import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIDlg.au3>`)';

const signatures = {
  _WinAPI_BrowseForFolderDlg: {
    documentation: 'Displays a dialog box that enables the user to select a Shell folder',
    label:
      "_WinAPI_BrowseForFolderDlg ( [$sRoot = '' [, $sText = '' [, $iFlags = 0 [, $pBrowseProc = 0 [, $lParam = 0 [, $hParent = 0]]]]]] )",
    params: [
      {
        label: '$sRoot',
        documentation: "**[optional]** Default is '' [, $sText.",
      },
    ],
  },
  _WinAPI_CommDlgExtendedErrorEx: {
    documentation: 'Returns a common dialog box error code',
    label: '_WinAPI_CommDlgExtendedErrorEx ( )',
    params: [],
  },
  _WinAPI_ConfirmCredentials: {
    documentation: 'Confirms the validity of the credential harvested',
    label: '_WinAPI_ConfirmCredentials ( $sTarget, $bConfirm )',
    params: [
      {
        label: '$sTarget',
        documentation: 'Parameter description',
      },
      {
        label: '$bConfirm',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FindTextDlg: {
    documentation:
      'Creates a system-defined modeless Find dialog box to search for text in a document',
    label:
      "_WinAPI_FindTextDlg ( $hOwner [, $sFindWhat = '' [, $iFlags = 0 [, $pFindProc = 0 [, $lParam = 0]]]] )",
    params: [
      {
        label: '$hOwner [, $sFindWhat',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FlushFRBuffer: {
    documentation:
      'Destroys the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_FlushFRBuffer ( )',
    params: [],
  },
  _WinAPI_FormatDriveDlg: {
    documentation: "Opens the Shell's Format dialog",
    label: '_WinAPI_FormatDriveDlg ( $sDrive [, $iOption = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sDrive [, $iOption',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetConnectedDlg: {
    documentation:
      'Launches the Get Connected wizard within the calling application to enable network connectivity',
    label: '_WinAPI_GetConnectedDlg ( $iDlg [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$iDlg [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetFRBuffer: {
    documentation:
      'Retrieves the current size of the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_GetFRBuffer ( )',
    params: [],
  },
  _WinAPI_MessageBoxCheck: {
    documentation:
      'Displays a message box that gives the user the option of suppressing further occurrences',
    label:
      '_WinAPI_MessageBoxCheck ( $iType, $sTitle, $sText, $sRegVal [, $iDefault = -1 [, $hParent = 0]] )',
    params: [
      {
        label: '$iType',
        documentation: 'Parameter description',
      },
      {
        label: '$sTitle',
        documentation: 'Parameter description',
      },
      {
        label: '$sText',
        documentation: 'Parameter description',
      },
      {
        label: '$sRegVal [, $iDefault',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_MessageBoxIndirect: {
    documentation: 'Creates, displays, and operates a message box',
    label: '_WinAPI_MessageBoxIndirect ( $tMSGBOXPARAMS )',
    params: [
      {
        label: '$tMSGBOXPARAMS',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OpenFileDlg: {
    documentation:
      'Creates a dialog box that lets the user specify the drive, directory, and the name of a file or set of files to be opened',
    label:
      "_WinAPI_OpenFileDlg ( [$sTitle = '' [, $sInitDir = '' [, $sFilters = '' [, $iDefaultFilter = 0 [, $sDefaultFilePath = '' [, $sDefaultExt = '' [, $iFlags = 0 [, $iFlagsEx = 0 [, $pOFNProc = 0 [, $pData = 0 [, $hParent = 0]]]]]]]]]]] )",
    params: [
      {
        label: '$sTitle',
        documentation: "**[optional]** Default is '' [, $sInitDir.",
      },
    ],
  },
  _WinAPI_PageSetupDlg: {
    documentation:
      'Creates a Page Setup dialog box that enables the user to specify the attributes of a printed page',
    label: '_WinAPI_PageSetupDlg ( ByRef $tPAGESETUPDLG )',
    params: [
      {
        label: 'ByRef $tPAGESETUPDLG',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PickIconDlg: {
    documentation: 'Displays a dialog box that allows the user to choose an icon',
    label: "_WinAPI_PickIconDlg ( [$sIcon = '' [, $iIndex = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sIcon',
        documentation: "**[optional]** Default is '' [, $iIndex.",
      },
    ],
  },
  _WinAPI_PrintDlg: {
    documentation: 'Displays a Print dialog box',
    label: '_WinAPI_PrintDlg ( ByRef $tPRINTDLG )',
    params: [
      {
        label: 'ByRef $tPRINTDLG',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PrintDlgEx: {
    documentation:
      'Displays a Print property sheet that enables the user to specify the properties of a particular print job',
    label: '_WinAPI_PrintDlgEx ( ByRef $tPRINTDLGEX )',
    params: [
      {
        label: 'ByRef $tPRINTDLGEX',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ReplaceTextDlg: {
    documentation:
      'Creates a system-defined modeless dialog box that lets the user specify a string to search for and a replacement string',
    label:
      "_WinAPI_ReplaceTextDlg ( $hOwner [, $sFindWhat = '' [, $sReplaceWith = '' [, $iFlags = 0 [, $pReplaceProc = 0 [, $lParam = 0]]]]] )",
    params: [
      {
        label: '$hOwner [, $sFindWhat',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RestartDlg: {
    documentation: 'Displays a dialog box that prompts the user to restart Microsoft Windows',
    label: "_WinAPI_RestartDlg ( [$sText = '' [, $iFlags = 2 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sText',
        documentation: "**[optional]** Default is '' [, $iFlags.",
      },
    ],
  },
  _WinAPI_SaveFileDlg: {
    documentation:
      'Creates a dialog box that lets the user specify the drive, directory, and name of a file to save',
    label:
      '_WinAPI_SaveFileDlg ( [$sTitle = "" [, $sInitDir = "" [, $sFilters = "" [, $iDefaultFilter = 0 [, $sDefaultFilePath = "" [, $sDefaultExt = "" [, $iFlags = 0 [, $iFlagsEx = 0 [, $pOFNProc = 0 [, $pData = 0 [, $hParent = 0]]]]]]]]]]] )',
    params: [
      {
        label: '$sTitle',
        documentation: '**[optional]** Default is "" [, $sInitDir.',
      },
    ],
  },
  _WinAPI_SetFRBuffer: {
    documentation:
      'Sets the size of the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_SetFRBuffer ( $iChars )',
    params: [
      {
        label: '$iChars',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellAboutDlg: {
    documentation: 'Displays a Windows About dialog box',
    label: '_WinAPI_ShellAboutDlg ( $sTitle, $sName, $sText [, $hIcon = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sTitle',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      },
      {
        label: '$sText [, $hIcon',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellOpenWithDlg: {
    documentation: 'Displays the Open With dialog box',
    label: '_WinAPI_ShellOpenWithDlg ( $sFilePath [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sFilePath [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellStartNetConnectionDlg: {
    documentation: 'Displays a general browsing dialog box for a network resource connection',
    label:
      "_WinAPI_ShellStartNetConnectionDlg ( [$sRemote = '' [, $iFlags = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sRemote',
        documentation: "**[optional]** Default is '' [, $iFlags.",
      },
    ],
  },
  _WinAPI_ShellUserAuthenticationDlg: {
    documentation:
      'Creates and displays a configurable dialog box that accepts credentials information from a user',
    label:
      '_WinAPI_ShellUserAuthenticationDlg ( $sCaption, $sMessage, $sUser, $sPassword, $sTarget [, $iFlags = 0 [, $iError = 0 [, $bSave = False [, $hBitmap = 0 [, $hParent = 0]]]]] )',
    params: [
      {
        label: '$sCaption',
        documentation: 'Parameter description',
      },
      {
        label: '$sMessage',
        documentation: 'Parameter description',
      },
      {
        label: '$sUser',
        documentation: 'Parameter description',
      },
      {
        label: '$sPassword',
        documentation: 'Parameter description',
      },
      {
        label: '$sTarget [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellUserAuthenticationDlgEx: {
    documentation:
      'Creates and displays a configurable dialog box that accepts credentials information from a user',
    label:
      '_WinAPI_ShellUserAuthenticationDlgEx ( $sCaption, $sMessage, $sUser, $sPassword [, $iFlags = 0 [, $iAuthError = 0 [, $bSave = False [, $iPackage = 0 [, $hParent = 0]]]]] )',
    params: [
      {
        label: '$sCaption',
        documentation: 'Parameter description',
      },
      {
        label: '$sMessage',
        documentation: 'Parameter description',
      },
      {
        label: '$sUser',
        documentation: 'Parameter description',
      },
      {
        label: '$sPassword [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
