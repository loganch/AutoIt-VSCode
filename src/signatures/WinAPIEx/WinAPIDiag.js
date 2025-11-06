import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIDiag.au3>`)';

const signatures = {
  _WinAPI_DisplayStruct: {
    documentation: 'Displays data from the specified structure or memory address as a list',
    label:
      "_WinAPI_DisplayStruct ( $tStruct [, $sStruct = '' [, $sTitle = '' [, $iItem = 0 [, $iSubItem = 0 [, $iFlags = 0 [, $bTop = True [, $hParent = 0]]]]]]] )",
    params: [
      {
        label: '$tStruct',
        documentation:
          'A structure that was created by DllStructCreate(), or memory address to be display its data.',
      },
      {
        label: '$sStruct',
        documentation:
          '**[optional]** A string representing the structure.If $tStruct is a structure, this parameter can be omitted or be an empty string. In this case, the structure will display as "byte[n]" structure.If $tStruct is a memory address, $sStruct should be a string representing the structure, otherwise, the function fail, and @error set to 10.',
      },
      {
        label: '$sTitle',
        documentation:
          '**[optional]** The title of the window, deault is "Structure: ListView Display".',
      },
      {
        label: '$iItem',
        documentation:
          '**[optional]** The 1-based index or name of the structure member to be selected in the list.If this parameter is 0 (Default), or an incorrect index or name, the first element of the structure will be selected.',
      },
      {
        label: '$iSubItem',
        documentation:
          '**[optional]** The 1-based index of the array in the structure member pointed to by the $iItem parameter to be selected.If $iItem was not defined as an array in the $sStruct, or invalid array index, the element pointed to by the $iItem parameter will be selected.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A set of bit flags that specifies an additional displaying options.This parameter can be 0, or any combination of the following values: 1 - Prevent displaying "<struct>" and "<endstruct>" fields at the beginning and end of the list. 2 - Prevent displaying "<alignment>" fields. 4 - Prevent displaying "<unnamed>" in "Member" column of the list if the structure element has no name. 8 - Prevent highlighting structure elements that are defined as an array. 16 - Prevent perceiving structure elements named "Reserved*" as unused elements. 32 - Prevent using double-click to copy values of the structure elements to the clipboard. 64 - Forced to expand structure elements of BYTE[n] and BOOLEAN[n] types (elements of CHAR[n] and WCHAR[n] types always displays as a string). 128 - Forced to display the values of the structure elements in the hexadecimal representation, if possible. 256 - Forced to return error code instead of displaying a message box if a memory access error occurred. 512 - Forced to disable checking the read access memory allocated to a given structure.',
      },
      {
        label: '$bTop',
        documentation:
          '**[optional]** Specifies whether create a window with "Always On Top" attribute, valid values: True - The window is created with the $WS_EX_TOPMOST extended style (Default). False - The window will not have the "TOPMOST" flag set.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to the parent window.',
      },
    ],
  },
  _WinAPI_EnumDllProc: {
    documentation: 'Enumerates an exported functions of the specified dynamic-link library (DLL)',
    label: "_WinAPI_EnumDllProc ( $sFilePath [, $sMask = '' [, $iFlags = 0]] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to the library.Although this function searches for a file path when it specified as the relative path or the name without a path, will better to specify a fully qualified path to the library for an unequivocal result.',
      },
      {
        label: '$sMask',
        documentation:
          '**[optional]** A wildcard string that indicates the function names to be enumerated.This string can optionally contain the wildcards, "*" and "?". If this parameter is an empty string or omitted (Default), all the exported functions will be enumerated.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. This parameter can be one or more of the following values: $SYMOPT_CASE_INSENSITIVE $SYMOPT_UNDNAME',
      },
    ],
  },
  _WinAPI_FatalExit: {
    documentation: 'Transfers execution control to the debugger',
    label: '_WinAPI_FatalExit ( $iCode )',
    params: [
      {
        label: '$iCode',
        documentation: 'The error code associated with the exit.',
      },
    ],
  },
  _WinAPI_GetApplicationRestartSettings: {
    documentation: 'Retrieves the restart information registered for the specified process',
    label: '_WinAPI_GetApplicationRestartSettings ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      },
    ],
  },
  _WinAPI_GetErrorMessage: {
    documentation: 'Retrieves a text error message for the specified system error code',
    label: '_WinAPI_GetErrorMessage ( $iCode [, $iLanguage = 0] )',
    params: [
      {
        label: '$iCode',
        documentation: 'The system error code to retrieve a message.',
      },
      {
        label: '$iLanguage',
        documentation: '**[optional]** The language identifier.',
      },
    ],
  },
  _WinAPI_GetErrorMode: {
    documentation: 'Retrieves the error mode for the current process',
    label: '_WinAPI_GetErrorMode ( )',
    params: [],
  },
  _WinAPI_IsInternetConnected: {
    documentation: 'Determines whether the current user is connected to the Internet',
    label: '_WinAPI_IsInternetConnected ( )',
    params: [],
  },
  _WinAPI_IsNetworkAlive: {
    documentation:
      'Determines whether or not a local system is connected to a network, and identifies the type of network connection',
    label: '_WinAPI_IsNetworkAlive ( )',
    params: [],
  },
  _WinAPI_NtStatusToDosError: {
    documentation: 'Converts the specified NTSTATUS error code to its equivalent system error code',
    label: '_WinAPI_NtStatusToDosError ( $iStatus )',
    params: [
      {
        label: '$iStatus',
        documentation: 'The NTSTATUS error code to be converted.',
      },
    ],
  },
  _WinAPI_RegisterApplicationRestart: {
    documentation: 'Registers the active instance of an application for restart',
    label: "_WinAPI_RegisterApplicationRestart ( [$iFlags = 0 [, $sCmd = '']] )",
    params: [
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies an events when application will not be restarted. This parameter can be0 or one or more of the following values.$RESTART_NO_CRASH$RESTART_NO_HANG$RESTART_NO_PATCH$RESTART_NO_REBOOT',
      },
      {
        label: '$sCmd',
        documentation:
          '**[optional]** The command-line arguments for the application when it is restarted. The maximum size of the commandline that you can specify is 2048 characters. If this parameter is empty string (Default), the previouslyregistered command line is removed.',
      },
    ],
  },
  _WinAPI_SetErrorMode: {
    documentation:
      'Controls whether the system will handle the specified types of serious errors or whether the process will handle them',
    label: '_WinAPI_SetErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The process error mode. This parameter can be one or more of the following values.$SEM_FAILCRITICALERRORS$SEM_NOALIGNMENTFAULTEXCEPT$SEM_NOGPFAULTERRORBOX$SEM_NOOPENFILEERRORBOX',
      },
    ],
  },
  _WinAPI_ShowLastError: {
    documentation: 'Shows the last error code and message',
    label: "_WinAPI_ShowLastError ( [$sText = '' [, $bAbort = False [, $iLanguage = 0]]] )",
    params: [
      {
        label: '$sText',
        documentation: "**[optional]** The user's text that to be displayed with the message.",
      },
      {
        label: '$bAbort',
        documentation:
          '**[optional]** Specifies whether to exit the script after displaying an error message, valid values:True - Exit the script after displaying a message if it indicates an error.False - Always return normally (Default).',
      },
      {
        label: '$iLanguage',
        documentation: '**[optional]** The language identifier for the message.',
      },
    ],
  },
  _WinAPI_UniqueHardwareID: {
    documentation: 'Generates a unique hardware identifier (ID) for local computer',
    label: '_WinAPI_UniqueHardwareID ( [$iFlags = 0] )',
    params: [
      {
        label: '$iFlags',
        documentation: '**[optional]** Default is 0.',
      },
    ],
  },
  _WinAPI_UnregisterApplicationRestart: {
    documentation: 'Removes the active instance of an application from the restart list',
    label: '_WinAPI_UnregisterApplicationRestart ( )',
    params: [],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
