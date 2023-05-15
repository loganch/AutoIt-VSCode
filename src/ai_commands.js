import { window, Position, workspace, Uri, RelativePattern } from 'vscode';
import { execFile as launch, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { decode } from 'iconv-lite';
import { parse } from 'jsonc-parser';
import { performance } from 'perf_hooks';
import { findFilepath, getIncludeText, functionDefinitionRegex } from './util';
import conf from './ai_config';
import { commandsList as _commandsList, commandsPrefix } from './commandsList';
import { showInformationMessage, showErrorMessage, messages } from './ai_showMessage';

const { config } = conf;
const aiOutCommon = window.createOutputChannel('AutoIt (global)', 'vscode-autoit-output');
const keybindingsDefaultRaw = require('../package.json').contributes.keybindings;

/**
 * Get the file name of the active document in the editor.
 *
 * Note that `window.activeTextEditor.document.fileName` is not available in some situations
 * (like when `runScript()` is executed in the settings tab).
 *
 * @returns {string} The file name of the active document, or an empty string if it's not available.
 */
function getActiveDocumentFileName() {
  if (!window.activeTextEditor) {
    return '';
  }
  const { document } = window.activeTextEditor;
  if (!document || !document.fileName) {
    return '';
  }
  return document.fileName;
}

const runners = {
  list: new Map(), // list of running scripts
  isNewLine: true, // track if previous message ended with a newline
  lastId: 0, // last id used in global output
  id: 0, // last launched process id
  // eslint-disable-next-line global-require
  outputName: `extension-output-${require('../package.json').publisher}.${
    // eslint-disable-next-line global-require
    require('../package.json').name
  }-#`,

  get lastRunning() {
    return this.findRunner({ status: true, thisFile: null });
  },

  get lastRunningOpened() {
    return this.findRunner({ status: true, thisFile: getActiveDocumentFileName() });
  },

  /**
   * Find the first runner in the list that matches the given filter criteria.
   * @param {Object} [filter={ status: true, thisFile: null }] - An object containing the filter criteria.
   * @param {boolean} [filter.status=true] - The status of the runner to look for.
   * @param {string|null} [filter.thisFile=null] - The file associated with the runner to look for.
   * @returns {Object|null} The runner and its associated info, or null if no runner is found.
   */
  findRunner(filter = { status: true, thisFile: null }) {
    const list = [...this.list.entries()].reverse();
    // eslint-disable-next-line no-unused-vars
    const found = list.find(([_, info]) =>
      Object.entries(filter).every(([key, value]) => value === null || value === info[key]),
    );

    return found ? { runner: found[0], info: found[1] } : null;
  },

  /**
   * Checks if the AutoIt output window is currently visible.
   * @returns {Object|null} An object containing the ID, name, and output window of the AutoIt output, or null if the output is not visible
   */
  isAiOutVisible() {
    for (let i = 0; i < window.visibleTextEditors.length; i += 1) {
      const editor = window.visibleTextEditors[i];
      const { fileName } = editor.document;
      if (fileName.startsWith(this.outputName)) {
        const rest = fileName.slice(this.outputName.length);
        const index = rest.indexOf('-');
        if (index !== -1) {
          const id = rest.slice(0, index);
          const name = rest.slice(index + 1);
          return { id, name, output: editor };
        }
      }
    }
    return null;
  },

  /**
   * Removes finished runners from the list and handles their cleanup
   */
  cleanup() {
    const now = new Date().getTime();
    const timeout = config.multiOutputFinishedTimeout * 1000;
    const endTime = now - timeout;
    // get list of finished processes, ordered by endTime descent
    const values = [...this.list.entries()]
      .filter(a => !a[1].status)
      .sort((a, b) => b[1].endTime - a[1].endTime);
    for (let i = 0; i < values.length; i += 1) {
      const [runner, info] = values[i];
      clearTimeout(info.timer);
      if (
        i >= config.multiOutputMaxFinished ||
        (config.multiOutputFinishedTimeout && info.endTime < endTime)
      ) {
        this.cleanupFinishedRunner(info, runner);
      } else {
        info.timer = config.multiOutputFinishedTimeout
          ? setTimeout(info.callback.bind(this), info.endTime - endTime)
          : null;
      }
    }
  },

  /**
   * Cleans up a finished runner by flushing its output and disposing of its output window, if necessary.
   * @param {Object} info - Information about the finished runner, including its callback and output window.
   */
  cleanupFinishedRunner(info, runner) {
    const localAiOutCommon = aiOutCommon;
    info.callback = () => {
      // eslint-disable-next-line no-underscore-dangle
      info._aiOut.flush();
      if (info.aiOut !== localAiOutCommon) {
        info.aiOut.dispose();
      }
      const aiOutVisible = this.isAiOutVisible();
      if (aiOutVisible && aiOutVisible.name === info.aiOut.name) {
        localAiOutCommon.show(true); // switch to common output
      }
      this.list.delete(runner);
    };
    info.callback();
  },
}; // runners

conf.addListener(() => runners.cleanup());

/**
 * Trims the output text in the visible AutoIt output to the max number of lines
 * set in the configuration.
 *
 * If the number of lines in the output text is more than the max, the excess lines
 * are removed and the rest are displayed.
 * @returns {void}
 */
const trimOutputLines = () => {
  {
    const out = runners.isAiOutVisible();
    if (!out || !config.outputMaxHistoryLines) return;

    if (out.output.document.lineCount > config.outputMaxHistoryLines) {
      const text = out.output.document.getText();
      const lines = text.split(/\r?\n/);
      const outputText = lines.slice(-config.outputMaxHistoryLines).join('\r\n');
      aiOutCommon.replace(outputText);
    }
  }
};

window.onDidChangeVisibleTextEditors(trimOutputLines);

/**
 * An object containing methods to disable and reset hotkeys set by AutoIt3Wrapper.
 *
 * AutoIt3Wrapper.au3 sets CTRL+Break and CTRL+ALT+Break hotkeys.
 * They interfere with this extension (unless user changed hotkeys).
 * This will disable hotkeys via AutoIt3Wrapper.ini while script is running
 * and restore original (or if no .ini existed it will be deleted)
 * when AutoIt3Wrapper detected running, or after 5 seconds
 */
const aWrapperHotkey = (() => {
  const regex = /(SciTE_(STOPEXECUTE|RESTART)\s*=).*/gi;
  const { env } = process;
  /**
   * keep track of running scripts to avoid accidentally replacing AutoIt3Wrapper.ini
   * before each script finished initializing
   */
  const count = new Map();
  let iniDataOrig = null;
  let iniPath;
  let timer;

  /**
   * Reads the AutoIt3Wrapper.ini file and returns its data as an object.
   * @returns {object} An object with two properties: `iniPath` (the path to the
   * AutoIt3Wrapper.ini file) and `iniData` (the contents of the file).
   */
  const fileData = () => {
    let iniData = '';

    // We should not cache this
    if (env.SCITE_USERHOME && fs.existsSync(`${env.SCITE_USERHOME}\\AutoIt3Wrapper`))
      iniPath = `${env.SCITE_USERHOME}\\AutoIt3Wrapper\\AutoIt3Wrapper.ini`;
    else if (env.SCITE_HOME && fs.existsSync(`${env.SCITE_HOME}/AutoIt3Wrapper`))
      iniPath = `${env.SCITE_HOME}\\AutoIt3Wrapper\\AutoIt3Wrapper.ini`;
    else if (fs.existsSync(`${path.dirname(config.wrapperPath)}\\AutoIt3Wrapper.ini`))
      iniPath = `${path.dirname(config.wrapperPath)}\\AutoIt3Wrapper.ini`;
    else iniPath = `${path.dirname(config.wrapperPath)}\\AutoIt3Wrapper.ini`;

    try {
      iniDataOrig = fs.readFileSync(iniPath, 'utf-8');
      iniData = iniDataOrig.replace(regex, '');
      let otherIndex = iniData.search(/\[Other\]/i);
      if (otherIndex === -1) {
        iniData += '\r\n[Other]';
        otherIndex = iniData.length;
      }

      iniData =
        iniData.substring(0, otherIndex + 7) +
        '\r\nSciTE_STOPEXECUTE=\r\nSciTE_RESTART=\r\n' +
        iniData.substring(otherIndex + 7);
    } catch (error) {
      iniDataOrig = null;
      // eslint-disable-next-line no-console
      console.error(`Error reading AutoIt3Wrapper.ini: ${error.message}`);
    }

    return { iniPath, iniData };
  };

  return {
    disable(id) {
      // can't use arrow function because we need access "this.reset"
      clearTimeout(timer);
      count.set(id, id);
      if (count.size === 1) {
        const { iniPath: _iniPath, iniData: _iniData } = fileData();
        try {
          fs.writeFileSync(_iniPath, _iniData, 'utf-8');
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error writing AutoIt3Wrapper.ini: ${error.message}`);
        }
      }
      // timer should never be fired unless something went wrong
      timer = setTimeout(() => this.reset(), 10000);
      return id;
    },

    reset: id => {
      clearTimeout(timer);
      count.delete(id);
      if (!iniPath || (id && count.size)) return;

      try {
        if (iniDataOrig === null) fs.rmSync(iniPath);
        else fs.writeFileSync(iniPath, iniDataOrig, 'utf-8');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error restoring AutoIt3Wrapper.ini: ${error.message}`);
      }
    },
  };
})();

/**
 * Returns the current time in a specific format.
 * @returns {string} The current time in the format "hh:mm:ss.ms".
 * @example
 * // returns "10:30:45.123"
 */
function getTime() {
  return new Date()
    .toLocaleString('sv', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      fractionalSecondDigits: 3,
    })
    .replace(',', '.');
}

// get keybindings
let keybindings; // note, we are defining this variable without value!
{
  // anonymous scope
  conf.noEvents(true);
  let profileDir;
  const prefs = workspace.getConfiguration('autoit');
  const prefName = 'consoleParams';
  const pref = prefs.inspect(prefName);
  const prefValue =
    pref.globalValue !== undefined
      ? pref.globalValue.replace(/ ?-profileDirID[\d.]+$/, '')
      : pref.globalValue;
  // generate ID, in some rare circumstances previous ID could still be present, try remove it
  const id =
    (prefValue ? prefValue + ' ' : '') +
    '-profileDirID.' +
    new Date().getTime() +
    performance.now();
  const dir =
    (process.env.VSCODE_PORTABLE
      ? process.env.VSCODE_PORTABLE + '/user-data'
      : process.env.APPDATA + '/Code') + '/User/';
  const settingsJsonWatcher = workspace.createFileSystemWatcher(
    new RelativePattern(dir, '**/settings.json'),
  );

  let settingsTimer;
  const initKeybindings = _dir => {
    let readFileLast = 0; // prevent multiple calls
    const commandsList = {};
    for (let i = 0; i < _commandsList.length; i++)
      commandsList[commandsPrefix + _commandsList[i]] = '';

    const keybindingsDefault = keybindingsDefaultRaw.reduce((a, b) => {
      a[b.command] = b.key;
      return a;
    }, {});
    const promise = { resolve: () => {}, isResolved: false };
    const fileName = 'keybindings.json';
    const file = Uri.file(_dir + fileName).fsPath;
    const keybindingsUpdate = list => {
      const keybindingsNew = {};
      const keybindingsFallback = Object.assign({}, keybindingsDefault);

      for (let i = 0; i < list.length; i++) {
        const isRemove = list[i].command.substring(0, 1) === '-';
        const command = isRemove
          ? list[i].command.substring(1, list[i].command.length)
          : list[i].command;
        if (command in commandsList) {
          if (isRemove) {
            delete keybindings[command];
            delete keybindingsFallback[command];
            continue;
          }
          keybindingsNew[command] = list[i].key;
        }
      }
      for (const command in commandsList) {
        if (Object.hasOwn(commandsList, command)) {
          const key = keybindingsNew[command] || keybindingsFallback[command];
          if (!key) continue;
          // capitalize first letter
          keybindingsFallback[command] = key.replace(
            /\w+/g,
            w => w.substring(0, 1).toUpperCase() + w.substring(1),
          );
          // add spaces around "+"
          // keybindingsFallback[i] = keybindingsFallback[i].replace(/\+/g, " $& ");
          keybindings[command] = keybindingsFallback[command];
        }
      }

      if (
        messages.error.killScript &&
        (keybindings[commandsPrefix + 'killScript'] ||
          keybindings[commandsPrefix + 'killScriptOpened'])
      ) {
        messages.error.killScript.hide();
        delete messages.error.killScript;
      }
      promise.resolve(keybindingsFallback);
      promise.isResolved = true;
    };
    const readFile = uri => {
      const now = performance.now();
      if (
        uri &&
        (uri.scheme !== 'file' ||
          uri.fsPath !== file ||
          !promise.isResolved ||
          readFileLast + 200 > now)
      )
        return;

      keybindings = new Promise(resolve => {
        promise.resolve = resolve;
        promise.isResolved = false;
      });
      Object.assign(keybindings, Object.assign({}, keybindingsDefault));
      readFileLast = now;
      // read file
      fs.readFile(file, (err, data) => {
        // we can't use JSON.parse() because file may contain comments
        keybindingsUpdate(
          err ? keybindingsDefaultRaw : parse(data.toString()) || keybindingsDefaultRaw,
        );
      });
    };
    const watcher = workspace.createFileSystemWatcher(new RelativePattern(_dir, '*.json'));
    watcher.onDidChange(readFile);
    watcher.onDidCreate(readFile);
    watcher.onDidDelete(readFile);

    readFile();
  };
  const reset = () => {
    clearTimeout(settingsTimer);
    prefs.update(prefName, prefValue, true).then(() => conf.noEvents(false));
    initKeybindings(profileDir || dir);
  };
  settingsTimer = setTimeout(reset, 2000);

  const settingsJsonWatcherEventHandler = uri => {
    if (profileDir) return;

    fs.readFile(uri.fsPath, (err, data) => {
      if (profileDir) return;

      const json = parse(data.toString());
      if (json[pref.key] !== id) return;

      profileDir = uri.fsPath.replace(/[^\\/]+$/, '');
      settingsJsonWatcher.dispose();
      reset();
    });
  };

  settingsJsonWatcher.onDidChange(settingsJsonWatcherEventHandler);
  settingsJsonWatcher.onDidCreate(settingsJsonWatcherEventHandler);
  prefs.update(prefName, id, true);
}

const AiOut = ({ id, aiOutProcess }) => {
  let prevLine = '';
  let prevLineTimer;
  let isNewLineProcess = true;

  const spacer = ' '; // using U+00A0 NO-BREAK SPACE character to avoid white-space character highlight.
  const prefixId = `#${id}:${spacer}`;
  const prefixEmpty = ''.padStart(prefixId.length, spacer);
  const hotkeyFailedMsg = [
    [
      /!!?>Failed Setting Hotkey\(s\)(?::|...)[\r\n]*/gi,
      /(?:false)?--> SetHotKey (?:\(\) )?Restart failed(?:,|. -->) SetHotKey (?:\(\) )?Stop failed\.[\r\n]*/gi,
    ],
    [
      /(!!?>Failed Setting Hotkey\(s\)(?::|...)[\r\n]*)?(?:false)?--> SetHotKey (?:\(\) )?Restart failed(?:,|. -->) SetHotKey (?:\(\) )?Stop failed\.[\r\n]*/gi,
    ],
  ];

  const outputText = (aiOut, prop, lines) => {
    // using separate function, for performance, so it doesn't have to be created for each message
    const time = getTime();

    const linesProcess = Object.assign([], lines);
    if (prop === 'appendLine') {
      if (!isNewLineProcess) {
        isNewLineProcess = true;
        aiOutProcess.append('\r\n');
      }
      if (!runners.isNewLine) {
        runners.isNewLine = true;
        aiOut.append('\r\n');
      }
    }
    if (config.outputShowTime === 'Process' || config.outputShowTime === 'All') {
      for (let i = 0; i < linesProcess.length; i += 1) {
        if (i === linesProcess.length - 1 && linesProcess[i] === '') break;

        if (isNewLineProcess) linesProcess[i] = time + spacer + linesProcess[i];

        isNewLineProcess = true;
      }
    }
    const textProcess = linesProcess.join('\r\n');
    if (textProcess) {
      aiOutProcess[prop](textProcess); // process output
      isNewLineProcess =
        prop === 'appendLine' || textProcess.substring(textProcess.length - 2) === '\r\n';
    }

    if (runners.lastId !== id && !runners.isNewLine) {
      aiOut.append(prop === 'appendLine' ? '' : '\r\n');
      runners.isNewLine = true;
    }

    const prefixTime =
      config.outputShowTime === 'Global' || config.outputShowTime === 'All' ? time + spacer : '';
    for (let i = 0; i < lines.length; i += 1) {
      if (i === lines.length - 1 && lines[i] === '') break;

      if (runners.isNewLine) {
        // eslint-disable-next-line no-param-reassign
        if (config.multiOutputShowProcessId === 'Multi') lines[i] = prefixId + lines[i];
        else if (config.multiOutputShowProcessId !== 'None')
          // eslint-disable-next-line no-param-reassign
          lines[i] = (runners.lastId === id ? prefixEmpty : prefixId) + lines[i];

        // eslint-disable-next-line no-param-reassign
        if (prefixTime) lines[i] = prefixTime + lines[i];

        runners.lastId = id;
      }
      runners.isNewLine = true;
    }
    const textGlobal = lines.join('\r\n');
    if (textGlobal) {
      aiOut[prop](textGlobal); // common output

      runners.isNewLine =
        prop === 'appendLine' || textGlobal.substring(textGlobal.length - 2) === '\r\n';
    }
  };

  let hotkeyFailedMsgFound = false;
  // using proxy to "forward" all property calls to aiOutCommon and aiOutProcess
  return new Proxy(aiOutCommon, {
    get(aiOut, prop, proxy) {
      const isFlush = prop === 'flush';
      const isError = prop === 'error';

      // eslint-disable-next-line no-param-reassign
      if (isFlush) prop = 'append';
      // eslint-disable-next-line no-param-reassign
      else if (isError) prop = 'appendLine';

      let ret = aiOut[prop];
      if (ret instanceof Function) {
        ret = text => {
          if (text === undefined) return;
          // incoming text maybe split in chunks
          // to detect message about failed hotkeys we need a complete line
          // therefore we split text into lines and show right the way only the complete ones
          // if after 100 milliseconds nothing else received we show the incomplete line
          clearTimeout(prevLineTimer);
          const lines = prop === 'append' ? text.split(/\r?\n/) : [text];
          lines[0] = prevLine + lines[0];
          for (let i = 0; i < lines.length; i += 1) {
            if (!hotkeyFailedMsgFound) {
              for (let r = 0; r < hotkeyFailedMsg.length; r += 1) {
                const line = lines[i].replace(hotkeyFailedMsg[r][0], '');
                // eslint-disable-next-line no-continue
                if (line === lines[i]) continue;

                hotkeyFailedMsg[r].shift();
                if (hotkeyFailedMsg[r].length) {
                  lines.splice((i -= 1), 1);
                  break;
                }

                aWrapperHotkey.reset(id);
                // lines.splice(i--, 1);
                lines[i] = `+>Setting Hotkeys...--> Press `;
                if (keybindings[`${commandsPrefix}restartScript`])
                  lines[i] += `${keybindings[`${commandsPrefix}restartScript`]} to Restart`;

                if (
                  keybindings[`${commandsPrefix}killScript`] ||
                  keybindings[`${commandsPrefix}killScriptOpened`]
                ) {
                  if (keybindings[`${commandsPrefix}restartScript`]) lines[i] += ` or `;

                  lines[i] += `${keybindings[`${commandsPrefix}killScript`] ||
                    keybindings[`${commandsPrefix}killScriptOpened`]} to Stop.`;
                }
                hotkeyFailedMsgFound = true;
                break;
              }
            }
          }
          prevLine = !isFlush && prop === 'append' ? lines[lines.length - 1] : '';
          if (prevLine) {
            // last line is not complete, remove it from current text and delay showing it
            if (lines.length > 1) lines[lines.length - 1] = '';
            else lines.pop();

            prevLineTimer = setTimeout(() => proxy.flush(), 100);
          }
          if (lines.length) outputText(aiOut, prop, lines);
        };
      }
      if (isFlush) ret('');

      return ret;
    },
  });
}; // AiOut

let hhproc;

function procRunner(cmdPath, args = [], bAiOutReuse = true) {
  const thisFile = getActiveDocumentFileName();
  const processCommand = cmdPath + ' ' + args;
  const runnerPrev = bAiOutReuse && runners.findRunner({ status: false, thisFile, processCommand });
  const id = runnerPrev ? runnerPrev.info.id : ++runners.id;
  const aiOutProcess = config.multiOutput
    ? (runnerPrev && !runnerPrev.info.aiOut.void && runnerPrev.info.aiOut) ||
      window.createOutputChannel(`AutoIt #${id} (${thisFile})`, 'vscode-autoit-output')
    : new Proxy(
        {},
        {
          get() {
            return () => {};
          },
        },
      );
  const aiOut = new AiOut({ id, aiOutProcess });
  const info = (runnerPrev && runnerPrev.info) || {
    id,
    startTime: new Date().getTime(),
    endTime: 0,
    aiOut: aiOutProcess,
    thisFile,
    processCommand,
    status: true,
  };
  const exit = (code, text) => {
    aWrapperHotkey.reset(id);
    code = Number(code); // convert possible null into 0
    info.endTime = new Date().getTime();
    info.status = false;
    aiOut.flush();
    aiOut.appendLine(
      // eslint-disable-next-line no-nested-ternary
      (code > 1 || code < -1 ? '!' : code < 1 ? '>' : '-') +
        `>Exit code ${code}${text ? ' (' + text + ')' : ''} Time: ${(info.endTime -
          info.startTime) /
          1000}`,
    );
    runners.cleanup();
    //      runners.lastId = null;
  };
  // eslint-disable-next-line no-underscore-dangle
  if (!info._aiOut) info._aiOut = aiOut;

  if (runnerPrev) {
    if (runnerPrev.info.aiOut.void)
      // void won't be undefined when used proxy object
      runnerPrev.info.aiOut = aiOutProcess;

    clearTimeout(runnerPrev.info.timer);
    runnerPrev.info.startTime = new Date().getTime();
    info.status = true;
    if (config.clearOutput) aiOutProcess.clear(); // clear process output

    runners.lastId = 0; // force displaying ID
  }
  if (!config.multiOutput && config.clearOutput) aiOutCommon.clear();

  //  if (id == 1 || runners.isAiOutVisible()) //only switch output channel if autoit channel is opened now
  (config.multiOutput ? aiOutProcess : aiOutCommon).show(true);
  // Set working directory to AutoIt script dir so that compile and build
  // commands work right
  const workDir = path.dirname(thisFile);

  aWrapperHotkey.disable(id);
  const runner = spawn(cmdPath, args, {
    cwd: workDir,
  });
  // display process command line, adding quotes to file paths as it does in SciTE
  aiOut.appendLine(
    `Starting process #${id}\r\n"${cmdPath}" ${args
      .map((a, i, ar) => (!i || ar[i - 1] === '/in' ? '"' + a + '"' : a))
      .join(' ')} [PID ${runner.pid || 'n/a'}]`,
  );

  if (runnerPrev) {
    // since we are reusing output panel
    // we need update our list
    // Map() doesn't allow update/replace keys, we'll have to add new one and delete old.
    runners.list.set(runner, runnerPrev.info);
    runners.list.delete(runnerPrev.runner);
  } else {
    runners.list.set(runner, info);
  }
  // process failed to start
  if (!runner.pid) {
    exit(-2, 'wrong path?');
    return runner;
  }

  runner.stdout.on('data', data => {
    try {
      const output = (config.isCodePage ? decode(data, config.outputCodePage) : data).toString();
      aiOut.append(output);
    } catch (er) {
      console.error(er);
    }
  });

  runner.stderr.on('data', data => {
    try {
      const output = (config.isCodePage ? decode(data, config.outputCodePage) : data).toString();
      aiOut.append(output);
    } catch (er) {
      console.error(er);
    }
  });

  runner.on('exit', exit);
  return runner;
}
const killScript = (thisFile = null) => {
  const data = runners.findRunner({ status: true, thisFile });
  if (!data) {
    const file = thisFile
      ? ` (${thisFile
          .split('\\')
          .splice(-2, 2)
          .join('\\')}) `
      : ' ';
    showInformationMessage(`No script${file}currently is running.`, { timeout: 10000 });
    return;
  }

  window.setStatusBarMessage('Stopping the script...', 1500);
  data.runner.stdin.pause();
  data.runner.kill();
};

workspace.onDidCloseTextDocument(doc => {
  if (!config.terminateRunningOnClose) return;

  if (runners.findRunner({ status: true, thisFile: doc.fileName })) killScript(doc.fileName);
});

const runScript = () => {
  const thisDoc = window.activeTextEditor.document; // Get the object of the text editor
  const thisFile = getActiveDocumentFileName();
  if (
    !keybindings[commandsPrefix + 'killScript'] &&
    !keybindings[commandsPrefix + 'killScriptOpened']
  ) {
    messages.error.killScript = showErrorMessage(
      `Please set "AutoIt: Kill Running Script" keyboard shortcut.`,
      { timeout: 30000 },
    );
    return messages.error.killScript;
  }
  // Save the file
  thisDoc.save().then(() => {
    if (thisDoc.isUntitled)
      return window.showErrorMessage(`"${thisFile}" file must be saved first!`);

    if (thisDoc.isDirty)
      showInformationMessage(`File failed to save, running saved file instead ("${thisFile}")`, {
        timeout: 30000,
      });

    const params = config.consoleParams;

    window.setStatusBarMessage('Running the script...', 1500);

    if (params) {
      const quoteSplit = /[\w-/]+|"[^"]+"/g;
      const paramArray = params.match(quoteSplit); // split the string by space or quotes

      const cleanParams = paramArray.map(value => {
        return value.replace(/"/g, '');
      });

      procRunner(
        config.aiPath,
        [
          config.wrapperPath,
          '/run',
          '/prod',
          '/ErrorStdOut',
          '/in',
          thisFile,
          '/UserParams',
          ...cleanParams,
        ],
        config.multiOutput && config.multiOutputReuseOutput,
      );
    } else {
      procRunner(
        config.aiPath,
        [config.wrapperPath, '/run', '/prod', '/ErrorStdOut', '/in', thisFile],
        config.multiOutput && config.multiOutputReuseOutput,
      );
    }
    return undefined;
  });
  return undefined;
};

const launchHelp = () => {
  const editor = window.activeTextEditor;
  const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);

  if (!wordRange) {
    launch(config.helpPath);
  } else {
    // Get the selected text and launch it
    const doc = editor.document;
    const query = doc.getText(doc.getWordRangeAtPosition(editor.selection.active));
    const findPrefix = /^[_]+[a-zA-Z0-9]+_/;
    const prefix = findPrefix.exec(query);

    window.setStatusBarMessage(`Searching documentation for ${query}`, 1500);

    let paths;
    if (prefix) {
      paths = config.smartHelp[prefix];
    }
    if (prefix && paths) {
      // Make sure help file exists
      if (!fs.existsSync(paths.chmPath)) {
        window.showErrorMessage(`Unable to locate ${paths.chmPath}`);
        return;
      }

      const regex = new RegExp(`\\bFunc\\s+${query}\\s*\\(`, 'g');
      const udfPaths = paths.udfPath;

      for (let j = 0; j < udfPaths.length; j += 1) {
        let filePath = udfPaths[j];
        if (!fs.existsSync(filePath)) {
          filePath = findFilepath(filePath, true);
          if (!filePath) {
            continue;
          }
        }
        const text = getIncludeText(filePath);
        const found = text.match(regex);

        if (found) {
          if (hhproc) {
            hhproc.kill();
          }
          hhproc = spawn('hh', [`mk:@MSITStore:${paths.chmPath}::/funcs/${query}.htm`]);
          return;
        }
      }
    }

    launch(config.helpPath, [query]);
  }
};

const launchInfo = () => {
  launch(config.infoPath);
};

function getDebugText() {
  const editor = window.activeTextEditor;
  const thisDoc = editor.document;
  let lineNbr = editor.selection.active.line;
  let currentLine = thisDoc.lineAt(lineNbr);
  const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);
  const varToDebug = !wordRange
    ? ''
    : thisDoc.getText(thisDoc.getWordRangeAtPosition(editor.selection.active));

  // Make sure that a variable or macro is selected
  if (varToDebug.charAt(0) === '$' || varToDebug.charAt(0) === '@') {
    const lineCount = thisDoc.lineCount - 2;
    const isContinue = /\s_\b\s*(;.*)?\s*/;

    // eslint-disable-next-line no-underscore-dangle
    if (!currentLine._isLastLine) {
      // Find first line without continuation character
      while (lineNbr <= lineCount) {
        const noContinue = isContinue.exec(currentLine.text) === null;
        if (noContinue) {
          break;
        }

        lineNbr += 1;
        currentLine = thisDoc.lineAt(lineNbr);
      }
    }
    const endPos = currentLine.range.end.character;
    const newPosition = new Position(lineNbr, endPos);

    return {
      text: varToDebug,
      position: newPosition,
    };
  }
  window.showErrorMessage(
    `"${varToDebug}" is not a variable or macro, debug line can't be generated`,
  );
  return {};
}

/**
 * Get the indent of the current line.
 *
 * @return {string} The indent of the current line.
 */
function getIndent() {
  const editor = window.activeTextEditor;
  const doc = editor.document;
  const line = doc.lineAt(editor.selection.active.line);

  if (line.isEmptyOrWhitespace) {
    return '';
  }

  // Grab the whole line
  const { text } = line;
  // Get the indent of the current line
  const findIndent = /(\s*).+/;
  return findIndent.exec(text)[1];
}

const debugMsgBox = () => {
  const editor = window.activeTextEditor;

  const debugText = getDebugText();

  if (Object.keys(debugText).length) {
    const indent = getIndent();
    const debugCode = `\n${indent};### Debug MSGBOX ↓↓↓\n${indent}MsgBox(262144, 'Debug line ~' & @ScriptLineNumber, 'Selection:' & @CRLF & '${debugText.text}' & @CRLF & @CRLF & 'Return:' & @CRLF & ${debugText.text})`;

    // Insert the code for the MsgBox into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  }
};

const compileScript = () => {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();
  // Save the file
  thisDoc.save().then(() => {
    if (thisDoc.isUntitled)
      return window.showErrorMessage(`"${thisFile}" file must be saved first!`);

    if (thisDoc.isDirty)
      showInformationMessage(`File failed to save, using saved file instead ("${thisFile}")`, {
        timeout: 30000,
      });

    window.setStatusBarMessage('Compiling script...', 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    return procRunner(config.aiPath, [config.wrapperPath, '/ShowGui', '/prod', '/in', thisFile]);
  });
};

const tidyScript = () => {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  thisDoc.save().then(() => {
    if (thisDoc.isUntitled)
      return window.showErrorMessage(`"${thisFile}" file must be saved first!`);

    if (thisDoc.isDirty) return window.showErrorMessage(`File failed to save ("${thisFile}")`);

    window.setStatusBarMessage(`Tidying script...${thisFile}`, 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    return procRunner(config.aiPath, [config.wrapperPath, '/Tidy', '/in', thisFile]);
  });
};

const checkScript = () => {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  thisDoc.save().then(() => {
    if (thisDoc.isUntitled)
      return window.showErrorMessage(`"${thisFile}" file must be saved first!`);

    if (thisDoc.isDirty) return window.showErrorMessage(`File failed to save ("${thisFile}")`);

    window.setStatusBarMessage(`Checking script...${thisFile}`, 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    return procRunner(config.aiPath, [config.wrapperPath, '/AU3check', '/prod', '/in', thisFile]);
  });
};

const buildScript = () => {
  const thisDoc = window.activeTextEditor.document;
  const thisFile = getActiveDocumentFileName();

  // Save the file
  thisDoc.save().then(() => {
    if (thisDoc.isUntitled)
      return window.showErrorMessage(`"${thisFile}" file must be saved first!`);

    if (thisDoc.isDirty)
      showInformationMessage(`File failed to save, using saved file instead ("${thisFile}")`, {
        timeout: 30000,
      });

    window.setStatusBarMessage('Building script...', 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    return procRunner(config.aiPath, [config.wrapperPath, '/NoStatus', '/prod', '/in', thisFile]);
  });
};

const debugConsole = () => {
  const editor = window.activeTextEditor;
  const debugText = getDebugText();

  if (Object.keys(debugText).length) {
    const indent = getIndent();
    const debugCode = `\n${indent};### Debug CONSOLE ↓↓↓\n${indent}ConsoleWrite('@@ Debug(' & @ScriptLineNumber & ') : ${debugText.text} = ' & ${debugText.text} & @CRLF & '>Error code: ' & @error & @CRLF)`;

    // Insert the code for the MsgBox into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  }
};

const launchKoda = () => {
  // Launch Koda Form Designer(FD.exe)
  procRunner(config.kodaPath);
};

const changeConsoleParams = () => {
  const currentParameters = config.consoleParams;

  window
    .showInputBox({
      placeHolder: `param "param with spaces" 3`,
      value: currentParameters,
      prompt:
        'Enter space-separated parameters to send to the command line when scripts are run. Wrap single parameters with one or more spaces with quotes.',
    })
    .then(input => {
      let newParams = input;
      if (input === undefined) {
        // Preserve standing console parameters if input is cancelled
        newParams = currentParameters;
      }

      config.update('consoleParams', newParams, false).then(() => {
        const params = config.consoleParams;

        const message = params
          ? `Current console parameter(s): ${params}`
          : `Console parameter(s) have been cleared.`;

        window.showInformationMessage(message);
      });
    });
};

const killScriptOpened = () => {
  killScript(getActiveDocumentFileName());
};

const openInclude = () => {
  const editor = window.activeTextEditor;
  const doc = editor.document;

  const currentLine = doc.lineAt(editor.selection.active.line).text;
  const findInclude = /^(?:\s*)#include.+["'<](.*\.au3)["'>]/i;
  const found = findInclude.exec(currentLine);

  if (found === null) {
    window.showErrorMessage(`Not on #include line.`);
    return;
  }

  let includeFile = found[1];

  if (!fs.existsSync(includeFile)) {
    // check based on current document directory
    const docPath = path.dirname(doc.fileName);
    const currFile = path.normalize(`${docPath}\\${includeFile}`);

    if (fs.existsSync(currFile)) {
      includeFile = currFile;
    } else {
      const library = found[0].includes('<');
      includeFile = findFilepath(includeFile, library);
    }
  }

  // check for
  if (!includeFile) {
    window.showErrorMessage(`Unable to locate #include file.`);
    return;
  }

  const url = Uri.file(includeFile);
  window.showTextDocument(url);
};

const insertHeader = () => {
  const editor = window.activeTextEditor;
  const doc = editor.document;
  const currentLine = editor.selection.active.line;
  const lineText = doc.lineAt(currentLine).text;
  const { UDFCreator } = config;

  const findFunc = functionDefinitionRegex.setFlags('i');
  const found = findFunc.exec(lineText);

  if (found === null) {
    window.showErrorMessage(`Not on function definition.`);
    return;
  }
  const hdrType =
    found[2].substring(0, 2) === '__' ? '#INTERNAL_USE_ONLY# ' : '#FUNCTION# =========';
  let syntaxBegin = `${found[2]}(`;
  let syntaxEnd = ')';
  let paramsOut = 'None';
  if (found[3]) {
    const params = found[3].split(',').map((parameter, index) => {
      parameter = parameter.trim();
      let tag = '- ';
      const paramIndex = parameter.search('=');
      if (paramIndex !== -1) {
        tag += '[optional] Default is ' + parameter.substring(paramIndex + 1).trim() + '.';
        syntaxBegin += '[';
        syntaxEnd = `]${syntaxEnd}`;
      }
      let byref = '';
      if (parameter.substring(0, 5).toLowerCase() === 'byref') {
        byref = 'ByRef ';
        parameter = parameter.substring(6).trim(); // strip off byref keyword
        tag += '[in/out] ';
      }
      syntaxBegin += (index ? ', ' : '') + byref + parameter;
      return parameter
        .split(' ')[0]
        .padEnd(21)
        .concat(tag);
    });
    const paramPrefix = '\n;                  ';
    paramsOut = params.join(paramPrefix);
  }
  const syntaxOut = `${syntaxBegin}${syntaxEnd}`;
  const header = `; ${hdrType}===========================================================================================================
; Name ..........: ${found[2]}
; Description ...:
; Syntax ........: ${syntaxOut}
; Parameters ....: ${paramsOut}
; Return values .: None
; Author ........: ${UDFCreator}
; Modified ......:
; Remarks .......:
; Related .......:
; Link ..........:
; Example .......: No
; ===============================================================================================================================
`;

  const newPosition = new Position(currentLine, 0);
  editor.edit(editBuilder => {
    editBuilder.insert(newPosition, header);
  });
};

const restartScript = () => {
  const { runner, info } = runners.lastRunningOpened || {};
  if (runner) {
    runner.on('exit', () => {
      if (info.callback) {
        clearTimeout(info.timer);
        info.callback();
      }
      runScript();
    });
    if (info.status) return killScript(info.thisFile);
  }
  return runScript();
};

export {
  buildScript as build,
  changeConsoleParams as changeParams,
  checkScript as check,
  compileScript as compile,
  debugConsole,
  debugMsgBox,
  killScript,
  killScriptOpened,
  launchHelp,
  launchInfo,
  launchKoda,
  runScript,
  tidyScript as tidy,
  openInclude,
  insertHeader,
  restartScript,
};
