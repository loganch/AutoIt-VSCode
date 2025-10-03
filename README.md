# AutoIt for Visual Studio Code

Welcome to the AutoIt extension for Visual Studio Code! This has been forked
and developed from Damien122's release.

[Features](#features) | [Configuration](#configuration) | [Keyboard Shortcuts](#keyboard-shortcuts) | [Contributing](#contributing)

## Features

- AutoIt Syntax highlighting
- IntelliSense (code hints and completion)

  ![Intellisense](img/docs/signaturehelp.gif)

- Launch, compile and build scripts from VSCode
- Launch AutoIt Help for highlighted text
- Symbol search, press `Ctrl+Shift+O` to see where Functions and Variables have been declared in the current script

  ![SymbolSearch](img/docs/symbolsearch.gif)

- Diagnostics (Problems Tab) showing Warnings & Errors

## Configuration

By default, this extension is set up for the default installation of AutoIt and SciTe4AutoIt on a 64-bit system. For alternate setups, you can access the user settings by navigating to `File-> Preferences-> Settings` or invoking the command palette (`Ctrl+Shift+P`) and searching for Preferences [(example)](img/docs/CtrlShiftP.png), and changing the following options:

| Config                              | Description                                                                                                                                                                                             | Default                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| `autoit.aiPath`                     | Full path to the AutoIt executable, e.g. `C:\\Program Files (x86)\\AutoIt3\\` or `C:\\Program Files (x86)\\AutoIt3\\AutoIt3.exe`                                                                        | "C:\\Program Files (x86)\\AutoIt3\\AutoIt3.exe" |
| `autoit.wrapperPath`                | Full or relative path to the AutoIt3Wrapper script, e.g. `C:\\Program Files (x86)\\AutoIt3\\SciTE\\AutoIt3Wrapper\\AutoIt3Wrapper.au3`. Leave blank to use default, relative to `#autoit.aiPath#` path. | ""                                              |
| `autoit.checkPath`                  | Full or relative path to the AutoIt syntax Checker (Au3Check) executable, e.g. `C:\\Program Files (x86)\\AutoIt3\\AU3Check.exe`. Leave blank to use default, relative to `#autoit.aiPath#` path.        | ""                                              |
| `autoit.helpPath`                   | Full or relative path to the AutoIt3Help executable, e.g. `C:\\Program Files (x86)\\AutoIt3\\AutoIt3Help.exe`. Leave blank to use default, relative to `#autoit.aiPath#` path.                          | ""                                              |
| `autoit.infoPath`                   | Full or relative path to the AutoIt Window Info executable, e.g. `C:\\Program Files (x86)\\AutoIt3\\Au3Info.exe`. Leave blank to use default, relative to `#autoit.aiPath#` path.                       | ""                                              |
| `autoit.kodaPath`                   | Full or relative path to the Koda FormDesigner executable, e.g. `C:\\Program Files (x86)\\AutoIt3\\SciTE\\Koda\\FD.exe`. Leave blank to use default, relative to `#autoit.aiPath#` path.                | ""                                              |
| `autoit.showVariablesInGoToSymbol`  | Determines whether to show or hide variables when using Ctrl+Shift+O (added in v0.1.9)                                                                                                                  | `true`                                          |
| `autoit.showRegionsInGoToSymbol`    | Determines whether to show or hide regions when using Ctrl+Shift+O (added in v1.0.9)                                                                                                                    | true                                            |
| `autoit.includePaths`               | File paths for additional include folders                                                                                                                                                               | [""]                                            |
| `autoit.consoleParams`              | A string of parameters passed to the console when the Run Script command is launched (added in v0.2.1)                                                                                                  | ""                                              |
| `autoit.enableDiagnostics`          | Tells AutoIt-VSCode to provide diagnostics from Au3Check on document open, switch or save                                                                                                               | `true`                                          |
| `autoit.UDFCreator`                 | The name that will be added as Author when Insert Function Header is used                                                                                                                               | "Your Name"                                     |
| `autoit.smartHelp`                  | Defines prefixes, paths & sources for additional help files                                                                                                                                             | { "_\_yourUdfFuncPrefix_\_": { "chmPath": "", "udfPath": [""] } } |
| `autoit.multiOutput`                | Enable separate output panel for each running script                                                                                                                                                    | `true`                                          |
| `autoit.multiOutputMaxFinished`     | How many output panels to keep after script finished                                                                                                                                                    | 2                                               |
| `autoit.multiOutputFinishedTimeout` | How long (in seconds) to wait until output panels of finished scripts discarded (0 = indefinitely)                                                                                                      | 0                                               |
| `autoit.multiOutputReuseOutput`     | Reuse output for the same file                                                                                                                                                                          | `false`                                         |
| `autoit.clearOutput`                | Clear output panel before each run. (only applicable when `autoit.multiOutput` is `disabled` or `autoit.multiOutputReuseOutput` is `enabled`)                                                           | `true`                                          |
| `autoit.terminateRunningOnClose`    | Terminate running script when script file is closed                                                                                                                                                     | `true`                                          |
| `autoit.multiOutputShowProcessId`          | Show process ID in the Autoit (common) output                                                                                                                                                           | "Single"                                        |
| `autoit.outputCodePage`             | If you see incorrect text encoding in the output, set this option to match your system code page                                                                                                        | ""                                              |
| `autoit.outputShowTime`             | Show time when each output line was received                                                                                                                                                            | "None"                                          |
| `autoit.outputMaxHistoryLines`      | Number of output lines to keep                                                                                                                                                                          | 5000                                            |
| `autoit.enableParenTriggerForFunctions` | Adds the ability to use `(` to select a function completion suggestion, which will add the function with open and closed parens, place the cursor between them and trigger signature help. Requires window reload to take full effect. | `true` |
| `autoit.workspaceSymbolMaxFiles`    | Maximum number of AutoIt files to process for workspace symbol search. Lower values improve performance on large projects.                                                                               | 500                                             |
| `autoit.workspaceSymbolBatchSize`   | Number of files to process in each batch when building workspace symbol index. Lower values reduce UI freezing but take longer to complete.                                                              | 10                                              |

<!-- * Access the command palette `Ctrl+Shift+P`, type Preferences: Open User Settings or Preferences: Open Workspace Settings. -->

  <!-- ![CtrlShiftP](img/docs/CtrlShiftP.png) -->

<!-- * Configure the paths according to your AutoIt installation. -->

  <!-- ![AutoItConfiguration](img/docs/AutoItConfiguration.png) -->

## Keyboard Shortcuts

- Run Script: `F5`
- AutoIt Check: `Ctrl+F5`
- Compile Script: `Ctrl+F7`
- Build Script: `F7`
- Run AutoIt Help: `Ctrl+F1`
- Run Au3Info: `Ctrl+F6`
- Debug to MsgBox: `Ctrl+Shift+D`
- Debug to Console: `Alt+D`
- Run Koda: `Alt+M`
- Set Command Line Parameters: `Shift+F8`
- Kill Running Script: `Ctrl+Pause/Break`
- Go To Definition (Jump to Variable or Function declaration): `F12`
- Peek Definition (Show declarations in pop up): `Alt+F12`
- Open Include file (On the current line): `Alt+i`
- Insert UDF Header: `Ctrl+Alt+h`
- Debug Remove lines: `Ctrl+Alt+z`

> **NOTE:**
>
> Run, Compile and Build Script functions require the full install of [SciTE4AutoIt3](https://www.autoitscript.com/site/autoit-script-editor/downloads/) alongside AutoIt.

## Contributing

Check out the code, leave feedback and feature requests now on [GitHub/loganch](https://github.com/loganch/AutoIt-VSCode)

Please fork the repository and contribute using pull requests.

---

[Features](#features) | [Configuration](#configuration) | [Keyboard Shortcuts](#keyboard-shortcuts) | [Contributing](#contributing)
