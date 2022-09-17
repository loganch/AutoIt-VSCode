import { window, Position, workspace, Uri } from 'vscode';
import { execFile as launch, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { findFilepath, getIncludeText } from './util';

const configuration = workspace.getConfiguration('autoit');

// Executable paths
const { aiPath, wrapperPath, tidyPath, checkPath, helpPath, infoPath, kodaPath } = configuration;

const aiOut = window.createOutputChannel('AutoIt', 'vscode-autoit-output');

// Additional help files
const { smartHelp } = configuration;

let runner;
let hhproc;

function procRunner(cmdPath, args) {
  aiOut.clear();
  aiOut.show(true);

  // Set working directory to AutoIt script dir so that compile and build
  // commands work right
  const workDir = path.dirname(window.activeTextEditor.document.fileName);

  runner = spawn(cmdPath, args, {
    cwd: workDir,
  });
//	document.save() is async, it should wait for it to finish before proceeding.
  runner.stdout.on('data', data => {
    const output = data.toString();
    aiOut.append(output);
  });

  runner.stderr.on('data', data => {
    const output = data.toString();
    aiOut.append(output);
  });

  runner.on('exit', code => {
    aiOut.appendLine(`Process exited with code ${code}`);
  });
}

const runScript = () => {
  const thisDoc = window.activeTextEditor.document; // Get the object of the text editor
  const thisFile = thisDoc.fileName; // Get the current file name

  // Save the file
  thisDoc.save().then(() =>	{
    const params = workspace.getConfiguration('autoit').get('consoleParams');

    window.setStatusBarMessage('Running the script...', 1500);

    if (params) {
      const quoteSplit = /[\w-/]+|"[^"]+"/g;
      const paramArray = params.match(quoteSplit); // split the string by space or quotes

      const cleanParams = paramArray.map(value => {
        return value.replace(/"/g, '');
      });

      procRunner(aiPath, [
        wrapperPath,
        '/run',
        '/prod',
        '/ErrorStdOut',
        '/in',
        thisFile,
        '/UserParams',
        ...cleanParams,
      ]);
    } else {
      procRunner(aiPath, [wrapperPath, '/run', '/prod', '/ErrorStdOut', '/in', thisFile]);
    }
  });
};

const launchHelp = () => {
  const editor = window.activeTextEditor;
  const wordRange = editor.document.getWordRangeAtPosition(editor.selection.start);

  if (!wordRange) {
    launch(helpPath);
  } else {
    // Get the selected text and launch it
    const doc = editor.document;
    const query = doc.getText(doc.getWordRangeAtPosition(editor.selection.active));
    const findPrefix = /^[_]+[a-zA-Z0-9]+_/;
    const prefix = findPrefix.exec(query);

    window.setStatusBarMessage(`Searching documentation for ${query}`, 1500);

    if (prefix) {
      for (let i = 0; i < smartHelp.length; i += 1) {
        if (smartHelp[i][0] === prefix[0]) {
          // Make sure help file exists
          if (!fs.existsSync(smartHelp[i][1])) {
            window.showErrorMessage(`Unable to locate ${smartHelp[i][1]}`);
            return;
          }

          const regex = new RegExp(`\\bFunc\\s+${query}\\s*\\(`, "g");
          const sources = smartHelp[i][2].split("|")

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
              hhproc = spawn("hh", [`mk:@MSITStore:${smartHelp[i][1]}::/funcs/${query}.htm`]);
              return;
            }
          }
          break;
        }
      }
    }

    launch(helpPath, [query]);
  }
};

const launchInfo = () => {
  launch(infoPath);
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

  if (Object.keys(debugText).length) {
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
    const thisFile = window.activeTextEditor.document.fileName;

    window.setStatusBarMessage('Compiling script...', 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    procRunner(aiPath, [wrapperPath, '/ShowGui', '/prod', '/in', thisFile]);
  });
};

const tidyScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
    // Get the current file name
    const thisFile = window.activeTextEditor.document.fileName;

    window.setStatusBarMessage(`Tidying script...${thisFile}`, 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    procRunner(tidyPath, [thisFile]);
  });
};

const checkScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
    // Get the current file name
    const thisFile = window.activeTextEditor.document.fileName;

    window.setStatusBarMessage(`Checking script...${thisFile}`, 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    procRunner(aiPath, [wrapperPath, '/AU3check', '/prod', '/in', thisFile]);
  });
};

const buildScript = () => {
  // Save the file
  window.activeTextEditor.document.save().then(() => {
    // Get the current file name
    const thisFile = window.activeTextEditor.document.fileName;

    window.setStatusBarMessage('Building script...', 1500);

    // Launch the AutoIt Wrapper executable with the script's path
    procRunner(aiPath, [wrapperPath, '/NoStatus', '/prod', '/in', thisFile]);
  });
};

const debugConsole = () => {
  const editor = window.activeTextEditor;
  const debugText = getDebugText();
  const indent = getIndent();

  if (Object.keys(debugText).length) {
    const debugCode = `${indent};### Debug CONSOLE ↓↓↓\n${indent}ConsoleWrite('@@ Debug(' & @ScriptLineNumber & ') : ${debugText.text} = ' & ${debugText.text} & @CRLF & '>Error code: ' & @error & @CRLF)\n`;

    // Insert the code for the MsgBox into the script
    editor.edit(edit => {
      edit.insert(debugText.position, debugCode);
    });
  }
};

const launchKoda = () => {
  // Launch Koda Form Designer(FD.exe)
  procRunner(kodaPath);
};

const changeConsoleParams = () => {
  const currentParameters = workspace.getConfiguration('autoit').get('consoleParams');

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

      configuration.update('consoleParams', newParams, false).then(() => {
        const params = workspace.getConfiguration('autoit').get('consoleParams');

        const message = params
          ? `Current console parameter(s): ${params}`
          : `Console parameter(s) have been cleared.`;

        window.showInformationMessage(message);
      });
    });
};

const killScript = () => {
  if (!runner) {
    window.showErrorMessage('No script is currently running.');
    return;
  }

  runner.stdin.pause();
  runner.kill();
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
  const UDFCreator = workspace.getConfiguration('autoit').get('UDFCreator');

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
  killScript();
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
  launchHelp,
  launchInfo,
  launchKoda,
  runScript,
  tidyScript,
  openInclude,
  insertHeader,
  restartScript,
};
