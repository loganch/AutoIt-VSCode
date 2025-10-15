import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIDiag.au3>`)';

const signatures = {
  _WinAPI_DisplayStruct: {
    documentation: 'Displays data from the specified structure or memory address as a list',
    label: '_WinAPI_DisplayStruct ( $tStruct [, $sStruct = \'\' [, $sTitle = \'\' [, $iItem = 0 [, $iSubItem = 0 [, $iFlags = 0 [, $bTop = True [, $hParent = 0]]]]]]] )',
    params: [
      {
        label: '$tStruct [, $sStruct',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumDllProc: {
    documentation: 'Enumerates an exported functions of the specified dynamic-link library (DLL)',
    label: '_WinAPI_EnumDllProc ( $sFilePath [, $sMask = \'\' [, $iFlags = 0]] )',
    params: [
      {
        label: '$sFilePath [, $sMask',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FatalExit: {
    documentation: 'Transfers execution control to the debugger',
    label: '_WinAPI_FatalExit ( $iCode )',
    params: [
      {
        label: '$iCode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetApplicationRestartSettings: {
    documentation: 'Retrieves the restart information registered for the specified process',
    label: '_WinAPI_GetApplicationRestartSettings ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetErrorMessage: {
    documentation: 'Retrieves a text error message for the specified system error code',
    label: '_WinAPI_GetErrorMessage ( $iCode [, $iLanguage = 0] )',
    params: [
      {
        label: '$iCode [, $iLanguage',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetErrorMode: {
    documentation: 'Retrieves the error mode for the current process',
    label: '_WinAPI_GetErrorMode ( )',
    params: [

    ],
  },
  _WinAPI_IsInternetConnected: {
    documentation: 'Determines whether the current user is connected to the Internet',
    label: '_WinAPI_IsInternetConnected ( )',
    params: [

    ],
  },
  _WinAPI_IsNetworkAlive: {
    documentation: 'Determines whether or not a local system is connected to a network, and identifies the type of network connection',
    label: '_WinAPI_IsNetworkAlive ( )',
    params: [

    ],
  },
  _WinAPI_NtStatusToDosError: {
    documentation: 'Converts the specified NTSTATUS error code to its equivalent system error code',
    label: '_WinAPI_NtStatusToDosError ( $iStatus )',
    params: [
      {
        label: '$iStatus',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_RegisterApplicationRestart: {
    documentation: 'Registers the active instance of an application for restart',
    label: '_WinAPI_RegisterApplicationRestart ( [$iFlags = 0 [, $sCmd = \'\']] )',
    params: [
      {
        label: '$iFlags',
        documentation: '**[optional]** Default is 0 [, $sCmd.',
      }
    ],
  },
  _WinAPI_SetErrorMode: {
    documentation: 'Controls whether the system will handle the specified types of serious errors or whether the process will handle them',
    label: '_WinAPI_SetErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ShowLastError: {
    documentation: 'Shows the last error code and message',
    label: '_WinAPI_ShowLastError ( [$sText = \'\' [, $bAbort = False [, $iLanguage = 0]]] )',
    params: [
      {
        label: '$sText',
        documentation: '**[optional]** Default is \'\' [, $bAbort.',
      }
    ],
  },
  _WinAPI_UniqueHardwareID: {
    documentation: 'Generates a unique hardware identifier (ID) for local computer',
    label: '_WinAPI_UniqueHardwareID ( [$iFlags = 0] )',
    params: [
      {
        label: '$iFlags',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_UnregisterApplicationRestart: {
    documentation: 'Removes the active instance of an application from the restart list',
    label: '_WinAPI_UnregisterApplicationRestart ( )',
    params: [

    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
