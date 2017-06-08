# AutoIt-VSCode Changelog

## 0.1.6
* Fixed the intellisense of parameters in the scope of the function.
* Added configuration for path to Koda and shortcut for launching Koda "Ctrl+K"

## 0.1.5
More IntelliSense!
* Added in function signature helpers (parameter info)
* AutoIt commands and keybindings now only show/activate in AutoIt files
* Debug MsgBoxes and Debug Consoles now match the indent of the line that they're generated from

## 0.1.4
* Added configuration for path to Au3Info

## 0.1.3
* Added AutoIt Configuration in Visual Studio Code Preferences.

## 0.1.2
The IntelliSense release!
* Hovers have been added for all UDFs
* Implementation of Completion Items has begun (Function, Macro and Variable suggestions will now have different icons)
* Symbol search added, press Ctrl+Shift+O to see where Functions and Variables have been declared in scripts

## 0.1.1
* You can now run a Syntax check and the Tidy tool
* You can now launch AutoIt Help by simply placing the cursor on functions and macros (complete selection no longer required)
* Even more hovers for UDFs
* Bugfix for commands that run through AutoIt3Wrapper (e.g. Build should make executables correctly now)

## 0.1.0
* Running, compiling and building now generate output live
* Added the ability to create console debug lines for highlighted variables and macros with Alt+D
* Added hovers for all macros, basic AutoIt functions and Array UDFs

## 0.0.9
* Running, compiling and building will now require the full install of SciTE4AutoIt3 (found [here](https://www.autoitscript.com/site/autoit-script-editor/downloads/)) in the default install location
* Changed compile command to closer reflect SciTe4AutoIt3 version (Opens GUI)
* Implemented build command, which works similar to previous compile command
* Added console output for running, compiling and building scripts
* Run, compile and build commands exit early if current file isn't AutoIt
* Implemented the hover feature and the first few hovers

## 0.0.8
* Implemented an option to compile scripts (Currently the AutoIt3Wrapper folder must be present in the "C:\Program Files (x86)\AutoIt3\SciTE" directory)
* Structure adjustment of the extension.
* Added more snippets.

## 0.0.6
* Added the ability to generate a debug MsgBox for a highlighted variable or macro with Ctrl+Shift+D.
* Added icon, banner color and description for marketplace.