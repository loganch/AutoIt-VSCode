# AutoIt-VSCode Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Map variable IntelliSense** - Intelligent key completions when accessing AutoIt Map variables
  - Shows available keys when typing a Map variable name (e.g., typing `$map` shows known keys)
  - Tracks Map keys across your workspace and included files
  - Works with both direct assignments (`$map["key"] = value`) and declarations with initial keys
  - Configuration options to tune behavior:
    - `autoit.maps.enableIntelligence` - Enable/disable Map intelligence (default: true)
    - `autoit.maps.includeDepth` - Maximum depth for resolving #include files (default: 3, range: 0-10)
    - `autoit.maps.showFunctionKeys` - Show Map keys assigned in functions (default: true)
  - See [docs/map-support.md](docs/map-support.md) for performance tuning recommendations
- Ignore AutoIt Tidy backup files from diagnostics

### Changed

- Enhanced README documentation with Map intelligence feature details

### Refactored

- Extract and enhance formatter constants into constants.js file

## [1.3.0] - 2025-11-10

### Added

- COM object syntax highlighting for properties and methods using dot notation
- Distinct token scopes for COM identifiers (`support.class.com.autoit`) to enable theme-specific styling
- Contributors section to README.md with auto-updating contrib.rocks integration
- Added missing AutoIt macros: `@exitMethod`, `@GUI_DropId`, and `@SW_ENABLE` to completions and hovers
- AU3Check parameter parsing support with corresponding tests to improve syntax check behavior
- Parameter validation and improved status messages in OutputChannelManager (#230)
- WinNet API completions added to IntelliSense

### Fixed

- Function pattern incorrectly matching COM object methods (e.g., `$obj.Method()` now correctly identified as COM, not function)
- Incorrect documentation for `@GUI_CtrlId` macro (now correctly states "Last click GUI Control identifier" instead of "Drag GUI Control identifier")
- Duplicate WinNet signature removed and WinAPI COM signatures added to signature/hover data
- Incorrect CRLF constant definition corrected
- Duplicate parameter documentation entries removed in signature help provider
- Removed stray duplicate (misspelled) `Clibpoard` completion entry
- Improved parameter checks in `runCheckProcess` for more reliable regex matching

### Changed

- Consolidated macro data into single source of truth (`src/completions/macrosData.js`) to eliminate duplication and ensure consistency between completions and hovers
- Converted `src/hovers/macros.json` to `src/hovers/macros.js` to import from unified macro data source

## [1.2.0] - 2025-10-08

### Added

- File path validation to prevent path traversal attacks
- Parameter safety warnings for `autoit.consoleParams` to detect potentially dangerous shell metacharacters
- Workspace symbol performance optimizations with batch processing to prevent UI freezing on large projects
- Configuration options `autoit.workspaceSymbolMaxFiles` (default: 500) and `autoit.workspaceSymbolBatchSize` (default: 10)
- Configuration option `autoit.symbolMaxLines` (default: 50000) to control maximum lines processed for symbol information
- Warning message when files exceed symbol processing limit with actionable instructions
- Comprehensive unit tests for completion provider with 8 test cases
- Comprehensive README documentation improvements with installation guide, quick start section, platform support matrix, troubleshooting guide, and reorganized configuration
- Distribution scripts for packaging the extension to multiple marketplaces:
  - `package-all.js` for simultaneous packaging to VS Code Marketplace and OpenVSX
  - `package-openvsx.js` for OpenVSX-specific packaging with publisher name handling

### Fixed

- Command injection risk in registry update functionality by replacing `exec` with `execFile` for safer argument handling
- Multiple global output panels opening for AutoIt on startup
- Memory leak in completion provider where include cache grew indefinitely across document switches
- Incorrect array comparison logic in completion cache invalidation
- Cross-document contamination of completion items from include files

### Changed

- Simplified ESLint configuration by using globals package and removing redundant rules
- Workspace symbol cache now uses incremental updates instead of full invalidation on file changes
- Completion provider now uses per-document Map-based caching with LRU eviction (50 document limit)
- Include cache automatically cleans up when documents are closed
- Symbol processing limit increased from hardcoded 10,000 to configurable 50,000 lines by default

### Removed

- The unused `autoit.YAML-tmLanguage` file

## [1.1.0] - 2025-09-23

### Added

- Support for running the Format Document command via the Command Palette or hotkey using Tidy.exe on scripts, including automatic formatting on save
- Jest testing framework with test suite for language features and services

### Changed

- Refactored monolithic command code
- Upgraded build toolchain
- Diagnostic system overhaul with encoding handling and problem script source tracking

### Fixed

- Restored Go to Definition functionality for symbols declared outside of current script
- Restored Open Include file (Alt+i) functionality
- Path handling improvements
- Completion provider accuracy with user-defined functions

## [1.0.14] - 2025-07-31

### Changed

- Node package update.
- Sets `editor.minimap.showRegionSectionHeaders` to `false` for AutoIt scripts.
- Optimized editor command registrations.
- Enhancements to syntax definition file.

### Fixed

- Usage of wrong Au3Check encoding for the file path string.

## [1.0.13] - 2025-01-28

### Added

- Command to remove Debug to Console and MsgBox lines added by the extension
- Commands to add and remove debug Trace lines
- Refined syntax check, with ability to set options through `#AutoIt3Wrapper_AU3Check_Parameters`
- Completions and Hovers for AutoIt3Wrapper Directives

### Changed

- Changes to autoit.includePaths setting now gets written to Windows Registry

### Fixed

- Go To Definition regression
- Output colors not showing due to other extensions (e.g., Github Copilot)
- Icons missing for some Const and Enum variables in the outline/Symbol search
- Detection of nested Regions
- outputCodePage setting not working
- Au3Check/Problems tab now works with includePaths setting

## [1.0.12] - 2023-09-26

### Added

- Signature help pulls description and parameters from function headers
- Option to disable `(` as an option to accept function completion suggestions
- Syntax highlighting for `#Tidy_On`, `#Tidy_Off`, and `#Tidy_ILC_Pos` directives

### Changed

- Path checks for utility executables (e.g., Au3Check) reduced to occur when changes are made and disabled for non-Windows OSes
- Simplified regex for functions
- Trimmed spaces in insertHeader command
- Removed default configuration settings that were overriding user settings

### Fixed

- Open include shortcut not working for library UDFs
- Open include shortcut not working for paths with `#` in them
- Function autocomplete from include files
- Reduced completion suggestions when writing function definitions

### Contributors

[@vanowm](https://github.com/vanowm), [@rcmaehl](https://github.com/rcmaehl)

## [1.0.11] - 2023-02-21

### Changed

- Ignore case when identifying functions and regions
- Include search made recursive
- Improvements to regex used in extension functions

### Fixed

- Slow autocompletion suggestions
- Runtime errors when failing with symbol creation
- Can now capture regions with hyphens
- Syntax highlighting for nested comment blocks
- Include paths checked when gathering include data
- Problem tab not showing errors or warnings
- AutoIt indentation settings applying to other languages

### Contributors

[@Danp2](https://github.com/Danp2), [@loganch](https://github.com/loganch)

## [1.0.10] - 2022-12-05

### Fixed

- Regex characters (e.g., `*` and `\`) in that come after `#Region` will no longer stop all symbols from being found
- smartHelp checks includePaths with relative paths (thanks to [@vanowm](https://github.com/vanowm))

## [1.0.9] - 2022-12-01

### Added

- Set VS Code to default to 4-space tabs for indentation like SciTe
- Output window overhaul (thanks to [@vanowm](https://github.com/vanowm)), including:
  - Additional colors
  - Multiple output panels
  - An encoding option
  - Options to keep output from previous runs
  - Options to show process ID and times
- Option to show #regions as symbols in Outline and symbol search (thanks to [@Danp2](https://github.com/Danp2))
- Syntax highlighting for Au3Stripper directives (thanks to [rcmaehl](https://github.com/rcmaehl))
- Adds a wait for file save to finish before running certain commands (thanks to [@vanowm](https://github.com/vanowm))
- Support for Sticky Scroll
- Symbols nest in the Outline
- SmartHelp options that allow launching of help files (e.g., CHM) for UDFs (thanks to [@Danp2](https://github.com/Danp2))

### Changed

- Tidy now runs through AutoItWrapper (thanks to [@vanowm](https://github.com/vanowm))
- MsgBox/Console debugging line generation improved (thanks to [@Danp2](https://github.com/Danp2))
- Paths to AutoIt executables can now be relative to the AutoIt executable in settings (thanks to [@vanowm](https://github.com/vanowm))

### Fixed

- Syntax highlighting for #include lines followed by comments (thanks to [@Danp2](https://github.com/Danp2))
- Makes regex for #include non-greedy (thanks to [@Danp2](https://github.com/Danp2))
- Limits header insertion and include opening to be limited to AutoIt scripts (thanks to [@vanowm](https://github.com/vanowm))

## [1.0.8] - 2022-06-09

### Added

- Open include file from the current line with `Alt+i`/Command Palette (thanks Danp2)
- Insert UDF Header function (thanks Danp2)
- UDF Creator option in Settings to auto populate author when inserting a Function Header
- AutoIt Map functions (thanks steipal)
- Colorized output when running scripts (thanks Danp2)
- Restart script (thanks vanown)
- Abbreviations from SciTe4AutoIt as Snippets
- `(` is now a trigger character to accept a function completion and will place both parens and initiate signature help for the function.

### Changed

- The AutoIt Help command will now open on blank lines (thanks Danp2)
- Updated the descriptions of the path settings
- Refactored filepath finding code (thanks Danp2)

### Fixed

- Code folding for `If`, `Switch`, `For`, `While`, `With`, `#comments-start`, `#cs`, `#comments-end` and `#ce` (thanks Danp2)
- Go to Workspace Symbol functionality restored

## [1.0.7] - 2022-02-14

### Added

- Const and Enum variables now have appropriate icons in the Outline tree
- Snippet for Select Blocks

## [1.0.6] - 2021-06-14

### Added

- Implemented Diagnostics (Problems tab and red squiggles) for AutoIt scripts
- Completions and Hovers for InetConstants

### Changed

- Switched from Parcel to Webpack for bundling
- Reworked the wordPattern
- Optimized HoverProvider

## [1.0.5] - 2020-05-07

### Changed

- Stopped completion suggestions from showing in comments
- Reworked some of the statement snippets for accuracy and to show up properly as suggestions
- Indented function declarations will now be detected

## [1.0.4] - 2020-01-10

### Added

- Code folding for `#Region/#EndRegion` & `Func/EndFunc`

### Changed

- Fixed symbol detection for Function declarations

## [1.0.3] - 2019-11-19

### Changed

- Fixed local function completions

## [1.0.2] - 2019-11-12

### Added

- Even more missing syntax highlighting for SendKeys
- Missing information for `MouseClick()` and `MouseClickDrag()` function signature helpers

### Changed

- Some improvements to code for Completions

## [1.0.1] - 2019-10-23

### Added

- Completion, Hover and Signature help for `_DebugArrayDisplay()`
- Missing Syntax Highlighting for SendKeys (including for ASCII and UNICODE characters (`Send("{ASC 065}")` or `Send("{ASC 2709}")`), repetition for single keys (`Send("{DEL 4}")` or `Send("{S 30}")`) and holding a key up or down (`Send("{a down}")` or `Send("{a up}")`)

### Changed

- Consolidated signature and hover for all Debug.au3 UDFs

### Removed

- Generated .map file from final .vsix file

## [1.0.0] - 2019-10-15

- Improved Go To Definition to search include files (relative and UDFs)
- Used Parcel.js to bundle extension into single file
- Started work on consolidating Signature and Hover files for smaller extension size
- Switching to SemVer for versioning
- Made code-style improvements for consistency

## [0.2.3] - 2019-05-29

- Added indentation rules for automatic indents for keywords that indent/unindent on the next line (currently doesn't work when the keyword is input from Intellisense)
- Implemented basic Go To Definition functionality for Functions and Variables
- Added syntax highlighting rules to color user created functions differently from default AutoIt and standard UDFs (may be the same depending on theme)
- Added syntax highlighting for '\$' part of variables (depends on theme)
- Implemented command to kill running scripts set to Ctrl+Pause/Break

## [0.2.2] - 2019-02-12

- Improved Console parameter func tion to show previous input and preserve existing text if cancelled
- Added completions for DirConstants.au3, EditConstants.au3, ExcelConstants.au3, FileConstants.au3, FontConstants.au3, FrameConstants.au3, GDIPlusConstants.au3, StaticConstants.au3, StatusBarConstants.au3, StringConstants.au3, TrayConstants.au3 and TreeViewConstants.au3

## [0.2.1] - 2019-01-30

- Added "setupudf" snippet
- Added MIT license to extension
- Added functionality to set console parameters when runing a script, using the palette or `Shift+F8`

## [0.2.0] - 2018-05-30

- Fixed the word pattern for the extension
- Improved formatting for some parameter documentation in signature helpers
- Made hovers case-insensitive

## [0.1.9] - 2018-05-30

- Completions and Signature Helpers for files relative to include folders (e.g., `#include <Test.au3>`) are now provided
  - Defaults to searching in C:\Program Files (x86)\AutoIt3\Include, more can be added in User Settings
- Output window now clears on each Run, Compile or Build
- Implemented Workspace/Folder-wide Symbol Search (`Ctrl+T`)
- Upgraded Windows Message Codes from snippets to Completions
- Updated UDF file location for functions moved in latest AutoIt update (v3.3.14.3)
- Added configuration option to hide variables when using Ctrl+Shift+O to view symbols
- Fixed word definitions to clear up highlighting/selection inconsistencies

## [0.1.8] - 2017-12-20

- Improved function signature helpers
  - Parameter position in function has much improved detection (no longer tripped up by commas in quotes)
  - Help for nested functions now work
  - Parameter descriptions have been upgraded with Markdown for better styling and layout
- Upgraded many snippets to Completions

## [0.1.7] - 2017-09-26

- Updated ReadMe with links and more information about shortcuts and configuration
- Improved handling of functions from include scripts
- Debug Console and MsgBox can now be inserted solely with the cursor on the variable
- Symbol search now catches multiple variables declared on the same line
- Added and optimized #include snippets for all default scripts
- Converted some keyword snippets into IntelliSense completions

## [0.1.6] - 2017-07-31

- The extension can now read in functions from user-specified include files and provide completion IntelliSense hints for them
- Added internal function parameters to IntelliSense (they are not yet limited to appearing in the scope of the function)
- Added configuration a path to launch Koda including an "Alt+M" shortcut
- Adjusted snippet code to better follow VS Code syntax

## [0.1.5] - 2017-06-03

More IntelliSense!

- Added in function signature helpers (parameter info)
- AutoIt commands and keybindings now only show/activate in AutoIt files
- Debug MsgBoxes and Debug Consoles now match the indent of the line that they're generated from

## [0.1.4] - 2017-05-16

- Added configuration for path to Au3Info

## [0.1.3] - 2017-05-04

- Added AutoIt Configuration in Visual Studio Code Preferences.

## [0.1.2] - 2017-04-26

The IntelliSense release!

- Hovers have been added for all UDFs
- Implementation of Completion Items has begun (Function, Macro and Variable suggestions will now have different icons)
- Symbol search added, press Ctrl+Shift+O to see where Functions and Variables have been declared in scripts

## 0.1.1

- You can now run a Syntax check and the Tidy tool
- You can now launch AutoIt Help by simply placing the cursor on functions and macros (complete selection no longer required)
- Even more hovers for UDFs
- Bugfix for commands that run through AutoIt3Wrapper (e.g. Build should make executables correctly now)

## 0.1.0

- Running, compiling and building now generate output live
- Added the ability to create console debug lines for highlighted variables and macros with Alt+D
- Added hovers for all macros, basic AutoIt functions and Array UDFs

## 0.0.9

- Running, compiling, and building will now require the full install of SciTE4AutoIt3 (found [here](https://www.autoitscript.com/site/autoit-script-editor/downloads/) - the AutoIt script editor) in the default install location
- Changed compile command to closer reflect SciTe4AutoIt3 version (Opens GUI)
- Implemented build command, which works similar to previous compile command
- Added console output for running, compiling and building scripts
- Run, compile and build commands exit early if current file isn't AutoIt
- Implemented the hover feature and the first few hovers

## 0.0.8

- Implemented an option to compile scripts (Currently the AutoIt3Wrapper folder must be present in the "C:\Program Files (x86)\AutoIt3\SciTE" directory)
- Structure adjustment of the extension.
- Added more snippets.

## 0.0.6

- Added the ability to generate a debug MsgBox for a highlighted variable or macro with Ctrl+Shift+D.
- Added icon, banner color and description for marketplace.

[1.3.0]: https://github.com/loganch/AutoIt-VSCode/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/loganch/AutoIt-VSCode/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.14...v1.1.0
[1.0.14]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.13...v1.0.14
[1.0.13]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.12...v1.0.13
[1.0.12]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.11...v1.0.12
[1.0.11]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.10...v1.0.11
[1.0.10]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.9...v1.0.10
[1.0.9]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.7...v1.0.8
[1.0.7]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.6...v1.0.7
[1.0.6]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.5...v1.0.6
[1.0.5]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/loganch/AutoIt-VSCode/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/loganch/AutoIt-VSCode/compare/1.0.2...v1.0.3
[1.0.2]: https://github.com/loganch/AutoIt-VSCode/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/loganch/AutoIt-VSCode/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/loganch/AutoIt-VSCode/compare/v0.2.3...1.0.0
[0.2.3]: https://github.com/loganch/AutoIt-VSCode/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/loganch/AutoIt-VSCode/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/loganch/AutoIt-VSCode/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/loganch/AutoIt-VSCode/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/loganch/AutoIt-VSCode/releases/tag/v0.1.2
