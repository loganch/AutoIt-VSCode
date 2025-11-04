import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover, opt, br } from '../../util';

const include = '(Requires: `#include <WinAPIDlg.au3>`)';

const signatures = {
  _WinAPI_BrowseForFolderDlg: {
    documentation: 'Displays a dialog box that enables the user to select a Shell folder',
    label:
      "_WinAPI_BrowseForFolderDlg ( [$sRoot = '' [, $sText = '' [, $iFlags = 0 [, $pBrowseProc = 0 [, $lParam = 0 [, $hParent = 0]]]]]] )",
    params: [
      {
        label: '$sRoot',
        documentation: `${opt} The root folder from which to start browsing.${br}
          Only the specified folder and its subfolders in the namespace hierarchy appear in the dialog box.${br}
          If this parameter is 0, the namespace root (the Desktop folder) is used.`,
      },
      {
        label: '$sText',
        documentation: `${opt} The string that is displayed above the tree view control in the dialog box.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} Flags that specify the options for the dialog box. This parameter can be a combination of the following values:${br}
          \`$BIF_BROWSEFORCOMPUTER\`${br}
          \`$BIF_BROWSEFORPRINTER\`${br}
          \`$BIF_BROWSEINCLUDEFILES\`${br}
          \`$BIF_BROWSEINCLUDEURLS\`${br}
          \`$BIF_DONTGOBELOWDOMAIN\`${br}
          \`$BIF_EDITBOX\`${br}
          \`$BIF_NEWDIALOGSTYLE\`${br}
          \`$BIF_NONEWFOLDERBUTTON\`${br}
          \`$BIF_NOTRANSLATETARGETS\`${br}
          \`$BIF_RETURNFSANCESTORS\`${br}
          \`$BIF_RETURNONLYFSDIRS\`${br}
          \`$BIF_SHAREABLE\`${br}
          \`$BIF_STATUSTEXT\`${br}
          \`$BIF_USENEWUI\`${br}
          \`$BIF_UAHINT\`${br}
          \`$BIF_VALIDATE\`${br}${br}
          **Windows 7 or later**${br}
          \`$BIF_BROWSEFILEJUNCTIONS\``,
      },
      {
        label: '$pBrowseProc',
        documentation: `${opt} Pointer to a callback function that the dialog box calls when an event occurs.${br}
          This function will receive one of the following event messages:${br}
          \`$BFFM_INITIALIZED\`${br}
          \`$BFFM_IUNKNOWN\`${br}
          \`$BFFM_SELCHANGED\`${br}
          \`$BFFM_VALIDATEFAILED\`${br}
          (See MSDN for more information)`,
      },
      {
        label: '$lParam',
        documentation: `${opt} The value that the dialog box passes to the callback function.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle to the parent window for the dialog box.`,
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
        documentation:
          'The string that contains the name of the target for the credentials, typically a domain or server name.\n\nThis must be the same value passed to `_WinAPI_ShellUserAuthenticationDlg()`.',
      },
      {
        label: '$bConfirm',
        documentation:
          'Specifies whether the credentials returned from the prompt function are valid. Valid values:\n\n`True` - The credentials are stored in the credential manager.\n\n`False` - The credentials are not stored and various pieces of memory are cleaned up.',
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
        label: '$hOwner',
        documentation:
          'A handle to the window that owns the dialog box. The window procedure of the specified window receives FINDMSGSTRING messages from the dialog box. This parameter can be any valid window handle, but it must not be 0.',
      },
      {
        label: '$sFindWhat',
        documentation: `${opt} The search string that is displayed when you initialize the dialog box.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} A set of bit flags that used to initialize the dialog box.${br}
          The dialog box sets these flags when it sends the FINDMSGSTRING registered message to indicate the user's input.${br}
          This parameter can be one or more of the following values.${br}
          \`$FR_DIALOGTERM\`${br}
          \`$FR_DOWN\`${br}
          \`$FR_ENABLEHOOK\`${br}
          \`$FR_ENABLETEMPLATE\`${br}
          \`$FR_ENABLETEMPLATEHANDLE\`${br}
          \`$FR_FINDNEXT\`${br}
          \`$FR_HIDEUPDOWN\`${br}
          \`$FR_HIDEMATCHCASE\`${br}
          \`$FR_HIDEWHOLEWORD\`${br}
          \`$FR_MATCHCASE\`${br}
          \`$FR_NOMATCHCASE\`${br}
          \`$FR_NOUPDOWN\`${br}
          \`$FR_NOWHOLEWORD\`${br}
          \`$FR_REPLACE\`${br}
          \`$FR_REPLACEALL\`${br}
          \`$FR_SHOWHELP\`${br}
          \`$FR_WHOLEWORD\``,
      },
      {
        label: '$pFindProc',
        documentation: `${opt} Pointer to an hook procedure that can process messages intended for the dialog box.${br}
          This parameter is ignored unless the \`$FR_ENABLEHOOK\` flag is not set.${br}
          (See MSDN for more information)`,
      },
      {
        label: '$lParam',
        documentation: `${opt} Application-defined data that the system passes to the hook procedure.`,
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
    label: '_WinAPI_FormatDriveDlg ( $sDrive [, $iOption = $SHFMT_OPT_FULL [, $hParent = 0]] )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive to format, in the format D:, E:, etc.',
      },
      {
        label: '$iOption',
        documentation: `${opt} This parameter must be 0 or one of the following values that alter the default format options in the dialog.${br}
          \`$SHFMT_OPT_FULL\` (Default)${br}
          \`$SHFMT_OPT_QUICKFORMAT\`${br}
          \`$SHFMT_OPT_SYSONLY\``,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle of the parent window of the dialog.`,
      },
    ],
  },
  _WinAPI_GetConnectedDlg: {
    documentation:
      'Launches the Get Connected wizard within the calling application to enable network connectivity',
    label: '_WinAPI_GetConnectedDlg ( $iDlg [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$iDlg',
        documentation: `Specifies which the dialog should be launched, valid values:${br}
          \`0\` - Local area network connectivity.${br}
          \`1\` - Internet connectivity.${br}
          \`2\` - Virtual private network (VPN) connectivity.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} Specifies an additional options. This parameter can be one or more of the following values.${br}
          \`0\` - Default.${br}
          \`1\` - Do not display the Get Connected wizard page that shows whether or not the user has a working or active Internet connection.${br}
          \`2\` - Do not display the Get Connected wizard page that shows a list of existing internet connections.${br}
          \`4\` - Hide the finish page of the Get Connected wizard.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle to the parent window that called this API.`,
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
        documentation: `${opt} The flags that specify the contents and behavior of the message box.${br}
          You must specify the buttons to be displayed by setting one and only one of the following flags:${br}
          \`$MB_OK\`${br}
          \`$MB_OKCANCEL\`${br}
          \`$MB_YESNO\`${br}
          ${br}You can display an optional icon by setting one and only one of the following flags:${br}
          \`$MB_ICONEXCLAMATION\`${br}
          \`$MB_ICONHAND\`${br}
          \`$MB_ICONINFORMATION\`${br}
          \`$MB_ICONQUESTION\``,
      },
      {
        label: '$sTitle',
        documentation: 'The string that contains the title of the message box.',
      },
      {
        label: '$sText',
        documentation: 'The string that contains the message to be displayed.',
      },
      {
        label: '$sRegVal',
        documentation:
          'The string that contains a unique string value to associate with this message.',
      },
      {
        label: '$iDefault',
        documentation: `${opt} The value that the function returns when the user has opted not to have the message box displayed again.${br}
          If the user has not opted to suppress the message box, the message box is displayed and${br}
          the function ignores \`$iDefault\`. Default is \`-1\`.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} The window handle to the message box's owner. Default is \`0\`.`,
      },
    ],
  },
  _WinAPI_MessageBoxIndirect: {
    documentation: 'Creates, displays, and operates a message box',
    label: '_WinAPI_MessageBoxIndirect ( $tMSGBOXPARAMS )',
    params: [
      {
        label: '$tMSGBOXPARAMS',
        documentation:
          '`$tagMSGBOXPARAMS` structure that contains information used to display the message box.',
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
        documentation: `${opt} A string to be placed in the title bar of the dialog box.${br}
          If this parameter is empty string (Default), the system uses the default title (that is, "Open").`,
      },
      {
        label: '$sInitDir',
        documentation: `${opt} The initial directory.`,
      },
      {
        label: '$sFilters',
        documentation: `${opt} The pairs of filter strings (for example, "Text Files (\\*.txt)"). To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "\\*.txt;\\*.doc;\\*.bak").${br}
          Do not include spaces in the pattern. To specify multiple groups of filters, use the "|" character as a delimiter (for example, "Text Files (\\*.txt)|All Files (\\*.\\*)").${br}
          If this parameter is omitted or an empty string (Default), the dialog box does not display any filters.`,
      },
      {
        label: '$iDefaultFilter',
        documentation: `${opt} The 1-based index of the currently selected filter to initialize the combo box control.`,
      },
      {
        label: '$sDefaultFilePath',
        documentation: `${opt} The file name to initialize the edit control.`,
      },
      {
        label: '$sDefaultExt',
        documentation: `${opt} The default extension that appends to the file name if the user fails to type an extension.${br}
          This string can be any length, but only the first three characters are appended. The string should not contain a period (.). If this parameter is empty string (Default), no extension is appended.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} A set of bit flags you can use to initialize the dialog box. This parameter can be 0 or combination of the following values:${br}
          \`$OFN_ALLOWMULTISELECT\`${br}
          \`$OFN_CREATEPROMPT\`${br}
          \`$OFN_DONTADDTORECENT\`${br}
          \`$OFN_ENABLEHOOK\`${br}
          \`$OFN_ENABLEINCLUDENOTIFY\`${br}
          \`$OFN_ENABLESIZING\`${br}
          \`$OFN_EXPLORER\`${br}
          \`$OFN_FILEMUSTEXIST\`${br}
          \`$OFN_FORCESHOWHIDDEN\`${br}
          \`$OFN_HIDEREADONLY\`${br}
          \`$OFN_LONGNAMES\`${br}
          \`$OFN_NODEREFERENCELINKS\`${br}
          \`$OFN_NOLONGNAMES\`${br}
          \`$OFN_NONETWORKBUTTON\`${br}
          \`$OFN_NOREADONLYRETURN\`${br}
          \`$OFN_NOTESTFILECREATE\`${br}
          \`$OFN_NOVALIDATE\`${br}
          \`$OFN_PATHMUSTEXIST\`${br}
          \`$OFN_READONLY\`${br}
          \`$OFN_SHAREAWARE\`${br}
          \`$OFN_SHOWHELP\``,
      },
      {
        label: '$iFlagsEx',
        documentation: `${opt} A set of bit flags you can use to initialize the dialog box. It can be 0 or the following value:${br}
          \`$OFN_EX_NOPLACESBAR\``,
      },
      {
        label: '$pOFNProc',
        documentation: `${opt} A pointer to a hook procedure. This parameter is ignored unless the \`$OFN_ENABLEHOOK\` flag is set.`,
      },
      {
        label: '$pData',
        documentation: `${opt} Application-defined data pointer that the system passes to the hook procedure.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} A handle to the parent window for the dialog box.`,
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
        documentation:
          "`$tagPAGESETUPDLG` structure that contains information used to initialize the Page Setup dialog box. The structure receives information about the user's selections when the function returns, and must be initialized before function call.\n\n(See MSDN for more information)",
      },
    ],
  },
  _WinAPI_PickIconDlg: {
    documentation: 'Displays a dialog box that allows the user to choose an icon',
    label: "_WinAPI_PickIconDlg ( [$sIcon = '' [, $iIndex = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sIcon',
        documentation: `${opt} The fully-qualified path of the file that contains the initial icon.`,
      },
      {
        label: '$iIndex',
        documentation: `${opt} The index of the initial icon. Default is 0.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle of the parent window.`,
      },
    ],
  },
  _WinAPI_PrintDlg: {
    documentation: 'Displays a Print dialog box',
    label: '_WinAPI_PrintDlg ( ByRef $tPRINTDLG )',
    params: [
      {
        label: 'ByRef $tPRINTDLG',
        documentation:
          "`$tagPRINTDLG` structure that contains information used to initialize the dialog box. When the function returns, it contains information about the user's selections. This structure must be initialized before function call.\n\n(See MSDN for more information)",
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
        documentation:
          "`$tagPRINTDLGEX` structure that contains information used to initialize the property sheet. When the function returns, it contains information about the user's selections. This structure must be initialized before function call.\n\n(See MSDN for more information)",
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
        label: '$hOwner',
        documentation: `A handle to the window that owns the dialog box.${br}
          The window procedure of the specified window receives FINDMSGSTRING messages from the dialog box.${br}
          This parameter can be any valid window handle, but it must not be 0.`,
      },
      {
        label: '$sFindWhat',
        documentation: `${opt} The search string that is displayed when you initialize the dialog box.`,
      },
      {
        label: '$sReplaceWith',
        documentation: `${opt} The replacement string that is displayed when you initialize the dialog box.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} A set of bit flags that used to initialize the dialog box.${br}
          The dialog box sets these flags when it sends the FINDMSGSTRING registered message to indicate the user's input.${br}
          This parameter can be one or more of the following values:${br}
          \`$FR_DIALOGTERM\`${br}
          \`$FR_DOWN\`${br}
          \`$FR_ENABLEHOOK\`${br}
          \`$FR_ENABLETEMPLATE\`${br}
          \`$FR_ENABLETEMPLATEHANDLE\`${br}
          \`$FR_FINDNEXT\`${br}
          \`$FR_HIDEUPDOWN\`${br}
          \`$FR_HIDEMATCHCASE\`${br}
          \`$FR_HIDEWHOLEWORD\`${br}
          \`$FR_MATCHCASE\`${br}
          \`$FR_NOMATCHCASE\`${br}
          \`$FR_NOUPDOWN\`${br}
          \`$FR_NOWHOLEWORD\`${br}
          \`$FR_REPLACE\`${br}
          \`$FR_REPLACEALL\`${br}
          \`$FR_SHOWHELP\`${br}
          \`$FR_WHOLEWORD\``,
      },
      {
        label: '$pReplaceProc',
        documentation: `${opt} Pointer to an hook procedure that can process messages intended for the dialog box.${br}
          This parameter is ignored unless the \`$FR_ENABLEHOOK\` flag is not set.${br}
          (See MSDN for more information)`,
      },
      {
        label: '$lParam',
        documentation: `${opt} Application-defined data that the system passes to the hook procedure.`,
      },
    ],
  },
  _WinAPI_RestartDlg: {
    documentation: 'Displays a dialog box that prompts the user to restart Microsoft Windows',
    label: "_WinAPI_RestartDlg ( [$sText = '' [, $iFlags = 2 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sText',
        documentation: `${opt} The text that displays in the dialog box which prompts the user.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that specify the type of shutdown.${br}${br}
          This parameter must include one of the following values.${br}
          \`$EWX_LOGOFF\`${br}
          \`$EWX_POWEROFF\`${br}
          \`$EWX_REBOOT\` (Default)${br}
          \`$EWX_SHUTDOWN\`${br}${br}
          This parameter can optionally include the following values.${br}
          \`$EWX_FORCE\`${br}
          \`$EWX_FORCEIFHUNG\``,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle to the parent window.`,
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
        documentation: `${opt} A string to be placed in the title bar of the dialog box.${br}
          If this parameter is empty string (Default), the system uses the default title (that is, "Save As").`,
      },
      {
        label: '$sInitDir',
        documentation: `${opt} The initial directory.`,
      },
      {
        label: '$sFilters',
        documentation: `${opt} The pairs of filter strings (for example, "Text Files (\\*.txt)").${br}
          To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "\\*.txt;\\*.doc;\\*.bak").${br}
          Do not include spaces in the pattern. To specify multiple groups of filters, use the "|" character as a delimiter (for example, "Text Files (\\*.txt)|All Files (\\*.\\*)").${br}
          If this parameter is omitted or an empty string (Default), the dialog box does not display any filters`,
      },
      {
        label: '$iDefaultFilter',
        documentation: `${opt} The 1-based index of the currently selected filter to initialize the combo box control.`,
      },
      {
        label: '$sDefaultFilePath',
        documentation: `${opt} The file name to initialize the edit control.`,
      },
      {
        label: '$sDefaultExt',
        documentation: `${opt} The default extension that appends to the file name if the user fails to type an extension.${br}
          This string can be any length, but only the first three characters are appended. The string should not contain a period (.).${br}
          If this parameter is empty string (Default), no extension is appended.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} A set of bit flags you can use to initialize the dialog box. This parameter can be 0 or combination of the following values:${br}
          \`$OFN_ALLOWMULTISELECT\`${br}
          \`$OFN_CREATEPROMPT\`${br}
          \`$OFN_DONTADDTORECENT\`${br}
          \`$OFN_ENABLEHOOK\`${br}
          \`$OFN_ENABLEINCLUDENOTIFY\`${br}
          \`$OFN_ENABLESIZING\`${br}
          \`$OFN_EXPLORER\`${br}
          \`$OFN_FORCESHOWHIDDEN\`${br}
          \`$OFN_HIDEREADONLY\`${br}
          \`$OFN_LONGNAMES\`${br}
          \`$OFN_NOCHANGEDIR\`${br}
          \`$OFN_NODEREFERENCELINKS\`${br}
          \`$OFN_NOLONGNAMES\`${br}
          \`$OFN_NONETWORKBUTTON\`${br}
          \`$OFN_NOREADONLYRETURN\`${br}
          \`$OFN_NOTESTFILECREATE\`${br}
          \`$OFN_NOVALIDATE\`${br}
          \`$OFN_OVERWRITEPROMPT\`${br}
          \`$OFN_PATHMUSTEXIST\`${br}
          \`$OFN_READONLY\`${br}
          \`$OFN_SHAREAWARE\`${br}
          \`$OFN_SHOWHELP\``,
      },
      {
        label: '$iFlagsEx',
        documentation: `${opt} A set of bit flags you can use to initialize the dialog box. It can be 0 or the following value:${br}
          \`$OFN_EX_NOPLACESBAR\``,
      },
      {
        label: '$pOFNProc',
        documentation: `${opt} A pointer to a hook procedure. This parameter is ignored unless the \`$OFN_ENABLEHOOK\` flag is set.`,
      },
      {
        label: '$pData',
        documentation: `${opt} Application-defined pointer to data that the system passes to the hook procedure.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} A handle to the parent window for the dialog box.`,
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
        documentation:
          'The size, in TCHARs, of the internal buffer. The buffer should be at least 80 characters long.\n\nThe default buffer size is 16384 wide characters (32 KB).',
      },
    ],
  },
  _WinAPI_ShellAboutDlg: {
    documentation: 'Displays a Windows About dialog box',
    label: '_WinAPI_ShellAboutDlg ( $sTitle, $sName, $sText [, $hIcon = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sTitle',
        documentation: 'The title of the Windows About dialog box.',
      },
      {
        label: '$sName',
        documentation: ` 	The first line after the text "Microsoft".`,
      },
      {
        label: '$sText',
        documentation: ` The text to be displayed in the dialog box after the version and copyright information.`,
      },
      {
        label: '$hIcon',
        documentation: `${opt} Handle to the icon that the function displays in the dialog box.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle to a parent window.`,
      },
    ],
  },
  _WinAPI_ShellOpenWithDlg: {
    documentation: 'Displays the Open With dialog box',
    label: '_WinAPI_ShellOpenWithDlg ( $sFilePath [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name.',
      },
      {
        label: '$iFlags',
        documentation: `${opt} The characteristics of the Open With dialog box. This parameter can be one or more of the following values.${br}
          \`$OAIF_ALLOW_REGISTRATION\`${br}
          \`$OAIF_REGISTER_EXT\`,${br}
          \`$OAIF_EXEC\`${br}
          \`$OAIF_FORCE_REGISTRATION\`${br}
          \`$OAIF_HIDE_REGISTRATION\`${br}
          \`$OAIF_URL_PROTOCOL\``,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle of the parent window.`,
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
        documentation: `${opt} The remote network name.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that identify the type of resource that the dialog is set to find.${br}
          This parameter can be a combination of the following values:${br}
          \`$RESOURCETYPE_ANY = 0x00\` ${br}
          \`$RESOURCETYPE_DISK = 0x01\`.${br}
          \`$RESOURCETYPE_PRINT = 0x02\`${br}
          Those constants are defined in "WinNet.au3".`,
      },
      {
        label: '$hParent',
        documentation: `${opt} Handle of the parent window.`,
      },
    ],
  },
  _WinAPI_ShellUserAuthenticationDlg: {
    documentation:
      'Creates and displays a configurable dialog box that accepts credentials information from a user.',
    label:
      '_WinAPI_ShellUserAuthenticationDlg ( $sCaption, $sMessage, $sUser, $sPassword, $sTarget [, $iFlags = 0 [, $iError = 0 [, $bSave = False [, $hBitmap = 0 [, $hParent = 0]]]]] )',
    params: [
      {
        label: '$sCaption',
        documentation: 'The title for the dialog box.',
      },
      {
        label: '$sMessage',
        documentation: 'A brief message to display in the dialog box.',
      },
      {
        label: '$sUser',
        documentation:
          'The user name to populate the credential fields in the dialog box. For domain users, the string must be in the following format(if domain is not specified, the trget string is used as the domain):\n\nDomainName\\UserName',
      },
      {
        label: '$sPassword',
        documentation: 'The initial password.',
      },
      {
        label: '$sTarget',
        documentation:
          'The name of the target, typically a server name. This parameter is used to identify target information when storing and retrieving credentials.',
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that specifies behavior for this function. It can be a bitwise-OR combination of zero
          or more of the following values.${br}
          \`$CREDUI_FLAGS_ALWAYS_SHOW_UI\`
          ${br}\`$CREDUI_FLAGS_COMPLETE_USERNAME\`
          ${br}\`$CREDUI_FLAGS_DO_NOT_PERSIST\`
          ${br}\`$CREDUI_FLAGS_EXCLUDE_CERTIFICATES\`
          ${br}\`$CREDUI_FLAGS_EXPECT_CONFIRMATION\`
          ${br}\`$CREDUI_FLAGS_GENERIC_CREDENTIALS\`
          ${br}\`$CREDUI_FLAGS_INCORRECT_PASSWORD\`
          ${br}\`$CREDUI_FLAGS_KEEP_USERNAME\`
          ${br}\`$CREDUI_FLAGS_PASSWORD_ONLY_OK\`
          ${br}\`$CREDUI_FLAGS_PERSIST\`
          ${br}\`$CREDUI_FLAGS_REQUEST_ADMINISTRATOR\`
          ${br}\`$CREDUI_FLAGS_REQUIRE_CERTIFICATE\`
          ${br}\`$CREDUI_FLAGS_REQUIRE_SMARTCARD\`
          ${br}\`$CREDUI_FLAGS_SERVER_CREDENTIAL\`
          ${br}\`$CREDUI_FLAGS_SHOW_SAVE_CHECK_BOX\`
          ${br}\`$CREDUI_FLAGS_USERNAME_TARGET_CREDENTIALS\`
          ${br}\`$CREDUI_FLAGS_VALIDATE_USERNAME\`
          `,
      },
      {
        label: '$iError',
        documentation: `${opt} The system error code that specifies why the credential dialog box is needed.`,
      },
      {
        label: '$bSave',
        documentation: `${opt} Specifies whether the "Save" check box is selected in the dialog box (it makes sense only if the
\`$CREDUI_FLAGS_SHOW_SAVE_CHECK_BOX\` flag is used), valid values:${br}
  ${br}\u0009\`True\` - Selected.${br}
    ${br}\u0009\`False\` - Deselected (Default).`,
      },
      {
        label: '$hBitmap',
        documentation: `${opt} A bitmap handle to display in the dialog box. If this parameter is 0, the default bitmap is used. The bitmap size is limited to 320x60 pixels.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} The dialog box is modal with respect to the parent window. If this parameter is 0, the desktop is the parent window of the dialog box.`,
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
        documentation: 'The title for the dialog box.',
      },
      {
        label: '$sMessage',
        documentation: 'A brief message to display in the dialog box.',
      },
      {
        label: '$sUser',
        documentation:
          'The user name to populate the credential fields in the dialog box. For domain users, the string must be in the following format:\n\nDomainName\\UserName',
      },
      {
        label: '$sPassword',
        documentation: 'The initial password.',
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that specifies behavior for this function. It can be a combination of the following values.${br}
          \`$CREDUIWIN_AUTHPACKAGE_ONLY\`${br}
          \`$CREDUIWIN_CHECKBOX\`${br}
          \`$CREDUIWIN_ENUMERATE_ADMINS\`${br}
          \`$CREDUIWIN_ENUMERATE_CURRENT_USER\`${br}
          \`$CREDUIWIN_GENERIC\`${br}
          \`$CREDUIWIN_IN_CRED_ONLY\`${br}
          \`$CREDUIWIN_SECURE_PROMPT\`${br}
          \`$CREDUIWIN_PACK_32_WOW\`${br}
          \`$CREDUIWIN_PREPROMPTING\``,
      },
      {
        label: '$iAuthError',
        documentation: `${opt} The system error code that is displayed in the dialog box.`,
      },
      {
        label: '$bSave',
        documentation: `${opt} Specifies whether the "Save" check box is selected in the dialog box (it makes sense only if the \`$CREDUIWIN_CHECKBOX\` flag is used), valid values:${br}
          \`True\` - Selected.${br}
          \`False\` - Deselected (Default).`,
      },
      {
        label: '$iPackage',
        documentation: `${opt} The authentication package for which the credentials are serialized.`,
      },
      {
        label: '$hParent',
        documentation: `${opt} The dialog box is modal with respect to the parent window. If this parameter is 0 (Default), the desktop
is the parent window of the dialog box.`,
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
