/**
 * Unified AutoIt macros data source
 * Consolidates macro definitions for signatures, hovers, and completions
 */

import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../util';

const signatures = {
  '@AppDataCommonDir': {
    documentation: 'Path to Application Data',
    label: '@AppDataCommonDir',
  },
  '@AppDataDir': {
    documentation: "Path to current user's Roaming Application Data",
    label: '@AppDataDir',
  },
  '@AutoItExe': {
    documentation:
      'The full path and filename of the AutoIt executable currently running. For compiled scripts it is the path of the compiled script; for .a3x and .au3 files it is the path of the interpreter running the file.',
    label: '@AutoItExe',
  },
  '@AutoItPID': {
    documentation: 'Process identifier (PID) of the current script.',
    label: '@AutoItPID',
  },
  '@AutoItVersion': {
    documentation: 'Version number of AutoIt such as 3.3.10.2',
    label: '@AutoItVersion',
  },
  '@AutoItX64': {
    documentation: 'Returns 1 if the script is running under the native x64 version of AutoIt.',
    label: '@AutoItX64',
  },
  '@COM_EventObj': {
    documentation: 'Object the COM event is being fired on. Only valid in a COM event function.',
    label: '@COM_EventObj',
  },
  '@CommonFilesDir': {
    documentation: 'Path to Common Files folder',
    label: '@CommonFilesDir',
  },
  '@Compiled': {
    documentation:
      'Returns 1 if script is a compiled executable or an .a3x file; returns 0 if an .au3 file.',
    label: '@Compiled',
  },
  '@ComputerName': {
    documentation: "Computer's network name.",
    label: '@ComputerName',
  },
  '@ComSpec': {
    documentation:
      'Value of %COMSPEC%, the SPECified secondary COMmand interpreter;\nprimary for command line uses, e.g. Run(@ComSpec & " /k help | more")',
    label: '@ComSpec',
  },
  '@CPUArch': {
    documentation: 'Returns "X86" when the CPU is a 32-bit CPU and "X64" when the CPU is 64-bit.',
    label: '@CPUArch',
  },
  '@CR': {
    documentation: 'Carriage return, Chr(13); occasionally used for line breaks.',
    label: '@CR',
  },
  '@CRLF': {
    documentation: '@CR & @LF; typically used for line breaks.',
    label: '@CRLF',
  },
  '@DesktopCommonDir': {
    documentation: 'Path to Desktop',
    label: '@DesktopCommonDir',
  },
  '@DesktopDepth': {
    documentation: 'Depth of the primary display in bits per pixel.',
    label: '@DesktopDepth',
  },
  '@DesktopDir': {
    documentation: "Path to current user's Desktop",
    label: '@DesktopDir',
  },
  '@DesktopHeight': {
    documentation: 'Height of the primary display in pixels. (Vertical resolution)',
    label: '@DesktopHeight',
  },
  '@DesktopRefresh': {
    documentation: 'Refresh rate of the primary display in hertz.',
    label: '@DesktopRefresh',
  },
  '@DesktopWidth': {
    documentation: 'Width of the primary display in pixels. (Horizontal resolution)',
    label: '@DesktopWidth',
  },
  '@DocumentsCommonDir': {
    documentation: 'Path to Documents',
    label: '@DocumentsCommonDir',
  },
  '@error': {
    documentation: 'Status of the error flag. See the function SetError().',
    label: '@error',
  },
  '@exitCode': {
    documentation: 'Exit code as set by Exit statement.',
    label: '@exitCode',
  },
  '@exitMethod': {
    documentation: 'Exit method. See the function OnAutoItExitRegister().',
    label: '@exitMethod',
  },
  '@extended': {
    documentation:
      'Extended function return - used in certain functions such as `StringReplace()`.',
    label: '@extended',
  },
  '@FavoritesCommonDir': {
    documentation: 'Path to Favorites',
    label: '@FavoritesCommonDir',
  },
  '@FavoritesDir': {
    documentation: "Path to current user's Favorites",
    label: '@FavoritesDir',
  },
  '@GUI_CtrlHandle': {
    documentation:
      'Last click GUI Control handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
    label: '@GUI_CtrlHandle',
  },
  '@GUI_CtrlId': {
    documentation:
      'Last click GUI Control identifier. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
    label: '@GUI_CtrlId',
  },
  '@GUI_DragFile': {
    documentation:
      'Filename of the file being dropped. Only valid on Drop Event. See the GUISetOnEvent() function.',
    label: '@GUI_DragFile',
  },
  '@GUI_DragId': {
    documentation:
      'Drag GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
    label: '@GUI_DragId',
  },
  '@GUI_DropId': {
    documentation:
      'Drop GUI Control identifier. Only valid on Drop Event. See the GUISetOnEvent() function.',
    label: '@GUI_DropId',
  },
  '@GUI_WinHandle': {
    documentation:
      'Last click GUI window handle. Only valid in an event Function. See the GUICtrlSetOnEvent() function.',
    label: '@GUI_WinHandle',
  },
  '@HomeDrive': {
    documentation: "Drive letter of drive containing current user's home directory.",
    label: '@HomeDrive',
  },
  '@HomePath': {
    documentation:
      "Directory part of current user's home directory. To get the full path, use in conjunction with @HomeDrive.",
    label: '@HomePath',
  },
  '@HomeShare': {
    documentation: "Server and share name containing current user's home directory.",
    label: '@HomeShare',
  },
  '@HotKeyPressed': {
    documentation: 'Last hotkey pressed. See the HotKeySet() function.',
    label: '@HotKeyPressed',
  },
  '@HOUR': {
    documentation: 'Hours value of clock in 24-hour format. Range is 00 to 23',
    label: '@HOUR',
  },
  '@IPAddress1': {
    documentation:
      'IP address of first network adapter. Tends to return 127.0.0.1 on some computers.',
    label: '@IPAddress1',
  },
  '@IPAddress2': {
    documentation: 'IP address of second network adapter. Returns 0.0.0.0 if not applicable.',
    label: '@IPAddress2',
  },
  '@IPAddress3': {
    documentation: 'IP address of third network adapter. Returns 0.0.0.0 if not applicable.',
    label: '@IPAddress3',
  },
  '@IPAddress4': {
    documentation: 'IP address of fourth network adapter. Returns 0.0.0.0 if not applicable.',
    label: '@IPAddress4',
  },
  '@KBLayout': {
    documentation: 'Returns code denoting Keyboard Layout. See Appendix for possible values.',
    label: '@KBLayout',
  },
  '@LF': {
    documentation: 'Line feed, Chr(10); occasionally used for line breaks.',
    label: '@LF',
  },
  '@LocalAppDataDir': {
    documentation: "Path to current user's Local Application Data",
    label: '@LocalAppDataDir',
  },
  '@LogonDNSDomain': {
    documentation: 'Logon DNS Domain.',
    label: '@LogonDNSDomain',
  },
  '@LogonDomain': {
    documentation: 'Logon Domain.',
    label: '@LogonDomain',
  },
  '@LogonServer': {
    documentation: 'Logon server.',
    label: '@LogonServer',
  },
  '@MDAY': {
    documentation: 'Current day of month. Range is 01 to 31',
    label: '@MDAY',
  },
  '@MIN': {
    documentation: 'Minutes value of clock. Range is 00 to 59',
    label: '@MIN',
  },
  '@MON': {
    documentation: 'Current month. Range is 01 to 12',
    label: '@MON',
  },
  '@MSEC': {
    documentation:
      'Milliseconds value of clock. Range is 000 to 999. The update frequency of this value depends on the timer resolution of the hardware and may not update every millisecond.',
    label: '@MSEC',
  },
  '@MUILang': {
    documentation:
      'Returns code denoting Multi Language if available (Vista is OK by default). See Appendix for possible values.',
    label: '@MUILang',
  },
  '@MyDocumentsDir': {
    documentation: 'Path to My Documents target',
    label: '@MyDocumentsDir',
  },
  '@NumParams': {
    documentation: 'Number of parameters used in calling the user function.',
    label: '@NumParams',
  },
  '@OSArch': {
    documentation:
      'Returns one of the following: "X86", "IA64", "X64" - this is the architecture type of the currently running operating system.',
    label: '@OSArch',
  },
  '@OSBuild': {
    documentation: 'Returns the OS build number. For example, Windows 2003 Server returns 3790',
    label: '@OSBuild',
  },
  '@OSLang': {
    documentation: 'Returns code denoting OS Language. See Appendix for possible values.',
    label: '@OSLang',
  },
  '@OSServicePack': {
    documentation: 'Service pack info in the form of "Service Pack 3".',
    label: '@OSServicePack',
  },
  '@OSType': {
    documentation: 'Returns "WIN32_NT" for XP/2003/Vista/2008/Win7/2008R2/Win8/2012/Win8.1/2012R2.',
    label: '@OSType',
  },
  '@OSVersion': {
    documentation:
      'Returns one of the following: "WIN_10", "WIN_81", "WIN_8", "WIN_7", "WIN_VISTA", "WIN_XP", "WIN_XPe", for Windows servers: "WIN_2016", "WIN_2012R2", "WIN_2012", "WIN_2008R2", "WIN_2008", "WIN_2003".',
    label: '@OSVersion',
  },
  '@ProgramFilesDir': {
    documentation: 'Path to Program Files folder',
    label: '@ProgramFilesDir',
  },
  '@ProgramsCommonDir': {
    documentation: "Path to Start Menu's Programs folder",
    label: '@ProgramsCommonDir',
  },
  '@ProgramsDir': {
    documentation: "Path to current user's Programs (folder on Start Menu)",
    label: '@ProgramsDir',
  },
  '@ScriptDir': {
    documentation:
      'Directory containing the running script. Only includes a trailing backslash when the script is located in the root of a drive.',
    label: '@ScriptDir',
  },
  '@ScriptFullPath': {
    documentation: 'Equivalent to @ScriptDir & "\\\\" & @ScriptName',
    label: '@ScriptFullPath',
  },
  '@ScriptLineNumber': {
    documentation:
      'Line number being executed - useful for debug statements (e.g. location of function call). Only significant in uncompiled scripts - note that #include files return their internal line numbering',
    label: '@ScriptLineNumber',
  },
  '@ScriptName': {
    documentation: 'Filename of the running script.',
    label: '@ScriptName',
  },
  '@SEC': {
    documentation: 'Seconds value of clock. Range is 00 to 59',
    label: '@SEC',
  },
  '@StartMenuCommonDir': {
    documentation: 'Path to Start Menu folder',
    label: '@StartMenuCommonDir',
  },
  '@StartMenuDir': {
    documentation: "Path to current user's Start Menu",
    label: '@StartMenuDir',
  },
  '@StartupCommonDir': {
    documentation: 'Path to Startup folder',
    label: '@StartupCommonDir',
  },
  '@StartupDir': {
    documentation: "Current user's Startup folder",
    label: '@StartupDir',
  },
  '@SW_DISABLE': {
    documentation: 'Disables the window.',
    label: '@SW_DISABLE',
  },
  '@SW_ENABLE': {
    documentation: 'Enables the window.',
    label: '@SW_ENABLE',
  },
  '@SW_HIDE': {
    documentation: 'Hides the window and activates another window.',
    label: '@SW_HIDE',
  },
  '@SW_LOCK': {
    documentation: 'Lock the window to avoid repainting.',
    label: '@SW_LOCK',
  },
  '@SW_MAXIMIZE': {
    documentation: 'Activates the window and displays it as a maximized window.',
    label: '@SW_MAXIMIZE',
  },
  '@SW_MINIMIZE': {
    documentation:
      'Minimizes the specified window and activates the next top-level window in the Z order.',
    label: '@SW_MINIMIZE',
  },
  '@SW_RESTORE': {
    documentation:
      'Activates and displays the window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when restoring a minimized window.',
    label: '@SW_RESTORE',
  },
  '@SW_SHOW': {
    documentation: 'Activates the window and displays it in its current size and position.',
    label: '@SW_SHOW',
  },
  '@SW_SHOWDEFAULT': {
    documentation:
      'Sets the show state based on the SW_ value specified by the program that started the application.',
    label: '@SW_SHOWDEFAULT',
  },
  '@SW_SHOWMAXIMIZED': {
    documentation: 'Activates the window and displays it as a maximized window.',
    label: '@SW_SHOWMAXIMIZED',
  },
  '@SW_SHOWMINIMIZED': {
    documentation: 'Activates the window and displays it as a minimized window.',
    label: '@SW_SHOWMINIMIZED',
  },
  '@SW_SHOWMINNOACTIVE': {
    documentation:
      'Displays the window as a minimized window. This value is similar to @SW_SHOWMINIMIZED, except the window is not activated.',
    label: '@SW_SHOWMINNOACTIVE',
  },
  '@SW_SHOWNA': {
    documentation:
      'Displays the window in its current size and position. This value is similar to @SW_SHOW, except the window is not activated.',
    label: '@SW_SHOWNA',
  },
  '@SW_SHOWNOACTIVATE': {
    documentation:
      'Displays a window in its most recent size and position. This value is similar to @SW_SHOWNORMAL, except the window is not activated.',
    label: '@SW_SHOWNOACTIVATE',
  },
  '@SW_SHOWNORMAL': {
    documentation:
      'Activates and displays a window. If the window is minimized or maximized, the system restores it to its original size and position. An application should specify this flag when displaying the window for the first time.',
    label: '@SW_SHOWNORMAL',
  },
  '@SW_UNLOCK': {
    documentation: 'Unlock window to allow painting.',
    label: '@SW_UNLOCK',
  },
  '@SystemDir': {
    documentation: "Path to the Windows' System (or System32) folder.",
    label: '@SystemDir',
  },
  '@TAB': {
    documentation: 'Tab character, Chr(9)',
    label: '@TAB',
  },
  '@TempDir': {
    documentation: 'Path to the temporary files folder.',
    label: '@TempDir',
  },
  '@TRAY_ID': {
    documentation:
      'Last clicked item identifier during a TraySetOnEvent() or TrayItemSetOnEvent() action.',
    label: '@TRAY_ID',
  },
  '@TrayIconFlashing': {
    documentation: 'Returns 1 if tray icon is flashing; otherwise, returns 0.',
    label: '@TrayIconFlashing',
  },
  '@TrayIconVisible': {
    documentation: 'Returns 1 if tray icon is visible; otherwise, returns 0.',
    label: '@TrayIconVisible',
  },
  '@UserName': {
    documentation: 'ID of the currently logged on user.',
    label: '@UserName',
  },
  '@UserProfileDir': {
    documentation: "Path to current user's Profile folder.",
    label: '@UserProfileDir',
  },
  '@WDAY': {
    documentation:
      'Numeric day of week. Range is 1 to 7 which corresponds to Sunday through Saturday.',
    label: '@WDAY',
  },
  '@WindowsDir': {
    documentation: 'Path to Windows folder',
    label: '@WindowsDir',
  },
  '@WorkingDir': {
    documentation:
      'Current/active working directory. Only includes a trailing backslash when the script is located in the root of a drive.',
    label: '@WorkingDir',
  },
  '@YDAY': {
    documentation: 'Current day of year. Range is 001 to 366 (or 001 to 365 if not a leap year)',
    label: '@YDAY',
  },
  '@YEAR': {
    documentation: 'Current four-digit year',
    label: '@YEAR',
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Variable, 'Macro');

export { signatures as default, hovers, completions };
