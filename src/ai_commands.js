import { window, Position, workspace, Uri } from 'vscode';
import { execFile as launch, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { findFilepath, getIncludeText } from './util';

const config = (() =>
{
  let conf = {
    data: workspace.getConfiguration('autoit')
  };
  workspace.onDidChangeConfiguration(({affectsConfiguration}) => {
    if (!affectsConfiguration("autoit"))
      return;

    conf.data = workspace.getConfiguration('autoit');
    runners.cleanup();
  });
  return new Proxy(conf,
  {
    get(target, prop) { return target.data[prop]; },
    set(target, prop, val) { return target.data.update(prop, val); }
  });
})();

//AutoIt3Wrapper.au3 sets CTRL+Break and CTRL+ALT+Break hotkeys
//they interfere with this extension (unless user changed hotkeys)
//this will disable hotkeys via AutoIt3Wrapper.ini while script is running
//and restore original (or if no .ini existed it will be deleted)
//when AutoIt3Wrapper detected running, or after 5 seconds
const aWrapperHotkey = (()=>
{
  let dataOrig, data, ini, timer;
  const regex = /(SciTE_(STOPEXECUTE|RESTART)\s*=).*/gi,
        env = process.env;
  const fileData = ()=>
  {
    ini = dataOrig = null;
    data = "";
    //we should not cache this
    if (env.SCITE_USERHOME && fs.existsSync(env.SCITE_USERHOME + "/AutoIt3Wrapper"))
      ini = env.SCITE_USERHOME + "/AutoIt3Wrapper/AutoIt3Wrapper.ini";
    else if (env.SCITE_HOME && fs.existsSync(env.SCITE_HOME + "/AutoIt3Wrapper"))
      ini = env.SCITE_HOME + "/AutoIt3Wrapper/AutoIt3Wrapper.ini";
    else
      ini = path.dirname(config.wrapperPath) + "/AutoIt3Wrapper.ini";

    try
    {
      dataOrig = data = fs.readFileSync(ini, 'utf-8');
    } catch(er){}
    const other = data.match(/^\s*\[Other\]\s*$/im);
    const hotkeys = {STOPEXECUTE:0,RESTART:0};
    if (other)
    {
      regex.lastIndex = other.index;
      let res;
      while((res = regex.exec(data)))
      {
        data = data.substring(0, res.index) + res[1] + data.substring(res.index + res[0].length);
        regex.lastIndex -= res[0].length - res[1].length;
        hotkeys[res[2].toUpperCase()]++;
      }
    }
    else
    {
      data += `\r\n[Other]`;
    }
    if (!hotkeys.STOPEXECUTE)
      data += `\r\nSciTE_STOPEXECUTE=`;
    if (!hotkeys.RESTART)
      data += `\r\nSciTE_RESTART=`;

    return {ini, data, dataOrig};
  };

  return {
    disable: function ()
    {
      clearTimeout(timer);
      const {ini, data} = fileData();
      try
      {
        fs.writeFileSync(ini, data, "utf-8");
      }catch(er){}
      timer = setTimeout(this.reset, 5000);
    },
    reset: () =>
    {
      clearTimeout(timer);
      if (!ini)
        return;

      try
      {
        if (dataOrig === null)
          fs.rmSync(ini);
        else
          fs.writeFileSync(ini, dataOrig, "utf-8");
      }catch(er){}
      ini = dataOrig = data = null;
    }
  };
})();

const aiOutCommon = window.createOutputChannel('AutoIt', 'vscode-autoit-output');

const runners = {
  list: new Map(), //list of running scripts
  isNewLine: true, //track if previous message ended with a newline
  lastId: 0, //last id used in output
  id: 0, //last launched process id
  outputName: `extension-output-${require("../package.json").publisher}.${require("../package.json").name}-#`,
  get lastRunning()
  {
    return this.findRunner({status: true, thisFile: null});
  },

  get lastRunningOpened()
  {
    return this.findRunner({status: true, thisFile: getActiveDocumentFile()});
  },

  findRunner(filter = {status: true, thisFile: null})
  {
    for(let list = [...this.list.entries()], i = list.length-1; i >= 0; i--)
    {
      const [runner, info] = list[i];
      let good = true;
      for(let f in filter)
      {
        if (filter[f] !== null && filter[f] !== info[f])
        {
          good = false;
          break;
        }
      }
      if (good)
        return {runner, info};

    }
    return null;
  },

  isAiOutVisible()
  {
    for(let i = 0, index, filename; i < window.visibleTextEditors.length; i++)
    {
      filename = window.visibleTextEditors[i].document.fileName;
      if (this.outputName === filename.substring(0,this. outputName.length))
      {
        filename = filename.substring(this.outputName.length);
        index = filename.indexOf("-");
        return {id: filename.substring(0, index), name: filename.substring(index + 1)};
      }
    }
    return;
  },

  cleanup()
  {
    const now = new Date().getTime();
    const timeout = config.multiOutputFinishedTimeout * 1000;
    const endTime = now - timeout;
    //get list of finished processes, ordered by endTime descent
    const values = [...this.list.entries()].filter(a => !a[1].status).sort((a,b) => b[1].endTime - a[1].endTime);
    for(let i = 0; i < values.length; i++)
    {
      const [runner, info] = values[i];
      clearTimeout(info.timer);
      info.callback = () =>
      {
        if (info.aiOut !== aiOutCommon)
          info.aiOut.dispose();
        const isAiOutVisible = this.isAiOutVisible();
        if (isAiOutVisible && isAiOutVisible.name == info.aiOut.name)
          aiOutCommon.show(true); //switch to common output

        this.list.delete(runner);
      };
      if (i >= config.multiOutputMaxFinished || (config.multiOutputFinishedTimeout && info.endTime < endTime))
        info.callback();
      else
       info.timer = config.multiOutputFinishedTimeout ? setTimeout(info.callback.bind(this), info.endTime - endTime) : null;
    }
  }
};

//accepts new option parameter in second argument: timeout
const showInformationMessage = (...args) =>
{
  let timeout;
  const [message, options] = args;
  if (options && options instanceof Object && !(options instanceof Array))
    {
      timeout = options.timeout;
      //not sure if we need to bother sanitize options object or not, seems to work as is
      // delete options.timeout;
      // if (!options.keys().length)
      //   args.splice(1,1);
    }
  clearTimeout(showInformationMessage.timer[message]);

  const callback = () =>
  {
    clearTimeout(timer);
    // https://github.com/microsoft/vscode/issues/153693
    for(let i = 0; i < 4; i++) // showing rapidly 4 messages hides the message...an exploit?
      window.showInformationMessage.apply(window, args);
  };
  const timer = timeout && setTimeout(callback, timeout);
  showInformationMessage.timer[message] = timer;
  return window.showInformationMessage.apply(window, args).finally(() => clearTimeout(timer));
};
showInformationMessage.timer = {};

const AiOut = ({id, aiOutProcess}) =>
{
  const prefix = "#" + id + ": ",
        prefixEmpty = "".padStart(prefix.length, " "), //using U+00A0 NO-BREAK SPACE character
        hotkeyFailedMsg = /!!?>Failed Setting Hotkey\(s\)(?::|...)[\r\n]*|--> SetHotKey (?:\(\) )?Restart failed(?:,|. -->) SetHotKey (?:\(\) )?Stop failed\.[\r\n]*/gi;

  //using proxy to "forward" all property calls to aiOutCommon and aiOutProcess
  return new Proxy(aiOutCommon, {
    get(aiOut, prop)
    {
      let ret = aiOut[prop];
      if (ret instanceof Function)
      {
        ret = (...args) =>
        {
          const text = args[0].replace(hotkeyFailedMsg, "");
          if (text != args[0] && !text.length)
          {
            aWrapperHotkey.reset();
            // in the future maybe we could find a way get current hotkeys registered for our commands...
            return;
          }
          args[0] = text;
          aiOutProcess[prop].apply(aiOutProcess[prop], args); //process output
          if ((prop == "append" || prop == "appendLine") && config.processIdInOutput != "None")
          {
            const isNewLine = runners.isNewLine;
            runners.isNewLine = prop == "appendLine" || args[0].match(/[\r\n]$/);
            //make sure process ID displays at the beginning of the line
            args[0] = args[0].replace(/([\r\n]+)(.+)/g, "$1" + prefixEmpty + "$2");
            if (runners.lastId != id || isNewLine)
            {
              if (config.processIdInOutput == "Multi")
                args[0] = prefix + args[0]; //display ID on each line
              else
                args[0] = (runners.lastId == id ? prefixEmpty : prefix) + args[0];

              if (!isNewLine)
                args[0] = "\r\n" + args[0];
            }

            runners.lastId = id;
          }

          aiOut[prop].apply(aiOut[prop], args); //common output
        };
      }
      return ret;
    }
  });
};

/*
window.activeTextEditor.document.fileName is not available in some situations
(like when runScript() executed in settings tab)
*/
function getActiveDocumentFile() {
  return window.activeTextEditor && window.activeTextEditor.document.fileName || "";
}

let hhproc;
// maybe it's not a good idea show default hotkeys, it will confuse user if they changed them.
// const keybindings = {};
// for(let i = 0, list = require("../package.json").contributes.keybindings; i < list.length; i++)
// {
//   keybindings[list[i].command.substring(10)] = list[i].key.replace(/\w+/g, w => (w.substring(0,1).toUpperCase()) + w.substring(1));
// }

function procRunner(cmdPath, args, bAiOutReuse = true) {
  const thisFile = getActiveDocumentFile(),
        processCommand = cmdPath + " " + args,
        runnerPrev = bAiOutReuse && runners.findRunner({status: false, thisFile, processCommand}),
        id = runnerPrev ? runnerPrev.info.id : ++runners.id,
        aiOutProcess = config.multiOutput
                          ? runnerPrev && !runnerPrev.info.aiOut.void && runnerPrev.info.aiOut || window.createOutputChannel(`AutoIt #${id} (${thisFile})`, 'vscode-autoit-output')
                          : new Proxy({},{get(){return()=>{};},void:true}),
        aiOut = new AiOut({id, aiOutProcess}),
        info = runnerPrev && runnerPrev.info || {
          id,
          startTime: new Date().getTime(),
          endTime: 0,
          aiOut: aiOutProcess,
          thisFile,
          processCommand,
          status: true
        },
        exit =  (code, text) => {
          aWrapperHotkey.reset();
          code = ~~code; //convert possible null into 0
          info.endTime = new Date().getTime();
          info.status = false;
          runners.cleanup();
          aiOut.appendLine((code>1||code<-1?"!":code<1?">":"-")+`>Exit code ${code}${text ? " (" + text + ")": ""} Time: ${(info.endTime - info.startTime) / 1000}`);
        };

  if (runnerPrev)
  {
    clearTimeout(runnerPrev.info.timer);
    runnerPrev.startTime = new Date().getTime();
    info.status = true;
    if (config.clearOutput)
      aiOutProcess.clear(); //clear process output

    runners.lastId = 0; //force displaying ID
  }
  if (!config.multiOutput && config.clearOutput)
    aiOutCommon.clear();

//  if (id == 1 || runners.isAiOutVisible()) //only switch output channel if autoit channel is opened now
  (config.multiOutput ? aiOutProcess : aiOutCommon).show(true);
  // Set working directory to AutoIt script dir so that compile and build
  // commands work right
  const workDir = path.dirname(thisFile);

  aWrapperHotkey.disable();
  const runner = spawn(cmdPath, args, {
    cwd: workDir,
  });
  //display process command line, adding quotes to file paths as it does in SciTE
  aiOut.appendLine(`Starting process #${id}\r\n"${cmdPath}" ${args.map((a,i,ar) => !i || ar[i-1] == "/in" ? '"' + a + '"' : a).join(" ")} [PID ${runner.pid||"n/a"}]`);

  if (runnerPrev)
  {
    //since we are reusing output panel
    //we need update our list
    //Map() doesn't allow update/replace keys, we'll have to add new one and delete old.
    runners.list.set(runner, runnerPrev.info);
    runners.list.delete(runnerPrev.runner);
  }
  else
  {
    runners.list.set(runner, info);
  }
  // process failed to start
  if (!runner.pid)
  {
    exit(-2, "wrong path?");
    return runner;
  }

  runner.stdout.on('data', data => {
    const output = data.toString();
    aiOut.append(output);
  });

  runner.stderr.on('data', data => {
    const output = data.toString();
    aiOut.append(output);
  });

  runner.on('exit', exit);
  return runner;
}
workspace.onDidCloseTextDocument(doc =>
{
  if (!config.terminateRunningOnClose)
    return;

  if (runners.findRunner({status: true, thisFile: doc.fileName}))
    killScript(doc.fileName);
});

const runScript = () => {
  const thisDoc = window.activeTextEditor.document; // Get the object of the text editor
  const thisFile = thisDoc.fileName; // Get the current file name

  // Save the file
  thisDoc.save().then(() => {

		const params = config.consoleParams;

		window.setStatusBarMessage('Running the script...', 1500);

		if (params) {
			const quoteSplit = /[\w-/]+|"[^"]+"/g;
			const paramArray = params.match(quoteSplit); // split the string by space or quotes

			const cleanParams = paramArray.map(value => {
				return value.replace(/"/g, '');
			});

			procRunner(config.aiPath, [
				config.wrapperPath,
				'/run',
				'/prod',
				'/ErrorStdOut',
				'/in',
				thisFile,
				'/UserParams',
				...cleanParams,
			], config.multiOutput && config.multiOutputReuseOutput);
		} else {
			procRunner(config.aiPath, [config.wrapperPath, '/run', '/prod', '/ErrorStdOut', '/in', thisFile], config.multiOutput && config.multiOutputReuseOutput);
		}
	});
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

    if (prefix) {
      for (let i = 0; i < config.smartHelp.length; i += 1) {
        if (config.smartHelp[i][0] === prefix[0]) {
          // Make sure help file exists
          if (!fs.existsSync(config.smartHelp[i][1])) {
            window.showErrorMessage(`Unable to locate ${config.smartHelp[i][1]}`);
            return;
          }

          const regex = new RegExp(`\\bFunc\\s+${query}\\s*\\(`, "g");
          const sources = config.smartHelp[i][2].split("|")

          for (let j = 0; j < sources.length; j += 1) {

            let filePath = sources[j];
            if (!fs.existsSync(filePath)) {
              filePath = findFilepath(filePath, true)
              if (!filePath) { continue };
            }
            let text = getIncludeText(filePath);
            let found = text.match(regex);

            if (found) {
              if (hhproc) { hhproc.kill() };
              hhproc = spawn("hh", [`mk:@MSITStore:${config.smartHelp[i][1]}::/funcs/${query}.htm`]);
              return;
            }
          }
          break;
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
  const varToDebug = thisDoc.getText(thisDoc.getWordRangeAtPosition(editor.selection.active));

  // Make sure that a variable or macro is selected
  if (varToDebug.charAt(0) === '$' || varToDebug.charAt(0) === '@') {
    const nextLine = editor.selection.active.line + 1;
    const newPosition = new Position(nextLine, 0);

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

function getIndent() {
  const editor = window.activeTextEditor;
  const doc = editor.document;

  // Grab the whole line
  const currentLine = doc.lineAt(editor.selection.active.line).text;
  // Get the indent of the current line
  const findIndent = /(\s*).+/;
  return findIndent.exec(currentLine)[1];
}

const debugMsgBox = () => {
  const editor = window.activeTextEditor;

  const debugText = getDebugText();

  const indent = getIndent();

  if (debugText) {
    const debugCode = `${indent};### Debug MSGBOX ↓↓↓\n${indent}MsgBox(262144, 'Debug line ~' & @ScriptLineNumber, 'Selection:' & @CRLF & '${debugText.text}' & @CRLF & @CRLF & 'Return:' & @CRLF & ${debugText.text})\n`;

    // Insert the code for the MsgBox into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  }
};

const compileScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
		// Get the current file name
		const thisFile = getActiveDocumentFile();

		window.setStatusBarMessage('Compiling script...', 1500);

		// Launch the AutoIt Wrapper executable with the script's path
		procRunner(config.aiPath, [config.wrapperPath, '/ShowGui', '/prod', '/in', thisFile]);
	});
};

const tidyScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
		// Get the current file name
		const thisFile = getActiveDocumentFile();

		window.setStatusBarMessage(`Tidying script...${thisFile}`, 1500);

		// Launch the AutoIt Wrapper executable with the script's path
		procRunner(config.tidyPath, [thisFile]);
	}); //
};

const checkScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
		// Get the current file name
		const thisFile = getActiveDocumentFile();

		window.setStatusBarMessage(`Checking script...${thisFile}`, 1500);

		// Launch the AutoIt Wrapper executable with the script's path
		procRunner(config.aiPath, [config.wrapperPath, '/AU3check', '/prod', '/in', thisFile]);
	});
};

const buildScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
		// Get the current file name
		const thisFile = getActiveDocumentFile();

		window.setStatusBarMessage('Building script...', 1500);

		// Launch the AutoIt Wrapper executable with the script's path
		procRunner(config.aiPath, [config.wrapperPath, '/NoStatus', '/prod', '/in', thisFile]);
	});
};

const debugConsole = () => {
  const editor = window.activeTextEditor;
  const debugText = getDebugText();
  const indent = getIndent();

  if (debugText) {
    const debugCode = `${indent};### Debug CONSOLE ↓↓↓\n${indent}ConsoleWrite('@@ Debug(' & @ScriptLineNumber & ') : ${debugText.text} = ' & ${debugText.text} & @CRLF & '>Error code: ' & @error & @CRLF)\n`;

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

const killScript = (thisFile = null) => {
  const data = runners.findRunner({status: true, thisFile});
  if (!data) {
    const file = thisFile ? " (" +thisFile.split("\\").splice(-2, 2).join("\\") + ") " : " ";
    showInformationMessage(`No script${file}is currently running.`, {timeout: 10000});
    return;
  }

  window.setStatusBarMessage('Stopping the script...', 1500);
  data.runner.stdin.pause();
  data.runner.kill();
};

const killScriptOpened = () =>
{
  killScript(getActiveDocumentFile());
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
      const library = found[0].includes("<")
      includeFile = findFilepath(includeFile, library);
    }
  }

  // check for
  if (!includeFile) {
    window.showErrorMessage(`Unable to locate #include file.`);
    return;
  }

  const url = Uri.parse(`file:///${includeFile}`);
  window.showTextDocument(url);
};

const insertHeader = () => {
  const editor = window.activeTextEditor;
  const doc = editor.document;
  const currentLine = editor.selection.active.line;
  const lineText = doc.lineAt(currentLine).text;
  const UDFCreator = config.UDFCreator;

  const findFunc = /(?=\S)(?!;~\s)Func\s+((\w+)\((.+)?\))/i;
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
    const params = found[3].split(',').map((element, index) => {
      let parameter = element;
      let tag = '- ';
      if (element.search('=') !== -1) {
        tag += '[optional] ';
        syntaxBegin += '[';
        syntaxEnd = `]${syntaxEnd}`;
      }
      syntaxBegin += (index ? ', ' : '') + element;
      if (element.substring(0, 5).toLowerCase() === 'byref') {
        parameter = element.substring(6); // strip off byref keyword
        tag += '[in/out] ';
      }
      return parameter
        .trim()
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
  const {runner, info} = runners.lastRunningOpened||{};
  if (runner)
  {
    runner.on("exit", () =>
    {
      if (info.callback)
      {
        clearTimeout(info.timer);
        info.callback();
      }
      runScript();
    });
    if (info.status)
      return killScript(info.thisFile);
  }
  runScript();
};

export {
  buildScript,
  changeConsoleParams,
  checkScript,
  compileScript,
  debugConsole,
  debugMsgBox,
  killScript,
  killScriptOpened,
  launchHelp,
  launchInfo,
  launchKoda,
  runScript,
  tidyScript,
  openInclude,
  insertHeader,
  restartScript,
};
