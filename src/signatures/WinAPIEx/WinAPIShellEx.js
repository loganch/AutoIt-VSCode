import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover, br } from '../../util';

const include = '(Requires: `#include <WinAPIShellEx.au3>`)';

const signatures = {
  _WinAPI_DllGetVersion: {
    documentation: 'Retrieves a DLL-specific version information',
    label: '_WinAPI_DllGetVersion ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file from which information is retrieved.',
      },
    ],
  },
  _WinAPI_GetAllUsersProfileDirectory: {
    documentation:
      'Retrieves the path to the root of the directory that contains program data shared by all users',
    label: '_WinAPI_GetAllUsersProfileDirectory ( )',
    params: [],
  },
  _WinAPI_GetDefaultUserProfileDirectory: {
    documentation: "Retrieves the path to the root of the default user's profile",
    label: '_WinAPI_GetDefaultUserProfileDirectory ( )',
    params: [],
  },
  _WinAPI_SetCurrentProcessExplicitAppUserModelID: {
    documentation:
      'Specifies a unique application-defined Application User Model ID that identifies the current process to the taskbar',
    label: '_WinAPI_SetCurrentProcessExplicitAppUserModelID ( $sAppID )',
    params: [
      {
        label: '$sAppID',
        documentation:
          'The string that represents an Application User Model ID (AppUserModelID). This identifier allows an application to group its associated processes and windows under a single taskbar button. An application must provide its AppUserModelID in the following form and can have no more than 128 characters and cannot contain spaces. CompanyName.ProductName.SubProduct.VersionInformation',
      },
    ],
  },
  _WinAPI_ShellAddToRecentDocs: {
    documentation: 'Adds a file to the most recently and frequently item list',
    label: '_WinAPI_ShellAddToRecentDocs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of the file to be added. Set this parameter to empty string to clear all usage data on all items.',
      },
    ],
  },
  _WinAPI_ShellChangeNotify: {
    documentation: 'Notifies the system of an event that an application has performed',
    label: '_WinAPI_ShellChangeNotify ( $iEvent, $iFlags [, $iItem1 = 0 [, $iItem2 = 0]] )',
    params: [
      {
        label: '$iEvent',
        documentation: `Describes the event that has occurred. Typically, only one event is specified at a time. If more than one event is specified, the values contained in the $iItem1 and $iItem2 parameters must be the same, respectively, for all specified events. This parameter can be one or more of the following values.${br}
          \`$SHCNE_ALLEVENTS\`${br}
          \`$SHCNE_ASSOCCHANGED\`${br}
          \`$SHCNE_ATTRIBUTES\`${br}
          \`$SHCNE_CREATE\`${br}
          \`$SHCNE_DELETE\`${br}
          \`$SHCNE_DRIVEADD\`${br}
          \`$SHCNE_DRIVEADDGUI\`${br}
          \`$SHCNE_DRIVEREMOVED\`${br}
          \`$SHCNE_EXTENDED_EVENT\`${br}
          \`$SHCNE_FREESPACE\`${br}
          \`$SHCNE_MEDIAINSERTED\`${br}
          \`$SHCNE_MEDIAREMOVED\`${br}
          \`$SHCNE_MKDIR\`${br}
          \`$SHCNE_NETSHARE\`${br}
          \`$SHCNE_NETUNSHARE\`${br}
          \`$SHCNE_RENAMEFOLDER\`${br}
          \`$SHCNE_RENAMEITEM\`${br}
          \`$SHCNE_RMDIR\`${br}
          \`$SHCNE_SERVERDISCONNECT\`${br}
          \`$SHCNE_UPDATEDIR\`${br}
          \`$SHCNE_UPDATEIMAGE\`${br}
          \`$SHCNE_DISKEVENTS\`${br}
          \`$SHCNE_GLOBALEVENTS\`${br}
          \`$SHCNE_INTERRUPT\`${br}
          (See MSDN for more information)`,
      },
      {
        label: '$iFlags',
        documentation: `Flags that indicate the meaning of the $iItem1 and $iItem2 parameters. This parameter must be one of the following values.${br}
          \`$SHCNF_DWORD\`${br}
          \`$SHCNF_IDLIST\`${br}
          \`$SHCNF_PATH\`${br}
          \`$SHCNF_PRINTER\`${br}
          \`$SHCNF_FLUSH\`${br}
          \`$SHCNF_FLUSHNOWAIT\`${br}
          \`$SHCNF_NOTIFYRECURSIVE\`${br}
          (See MSDN for more information)`,
      },
      {
        label: '$iItem1',
        documentation: '**[optional]** First event-dependent value. Default is 0.',
      },
      {
        label: '$iItem2',
        documentation: '**[optional]** Second event-dependent value. Default is 0.',
      },
    ],
  },
  _WinAPI_ShellChangeNotifyDeregister: {
    documentation: "Unregisters the client's window",
    label: '_WinAPI_ShellChangeNotifyDeregister ( $iID )',
    params: [
      {
        label: '$iID',
        documentation:
          'The value that specifies the registration ID returned by _WinAPI_ShellChangeNotifyRegister().',
      },
    ],
  },
  _WinAPI_ShellChangeNotifyRegister: {
    documentation: 'Registers a window to receive notifications from the file system or Shell',
    label:
      '_WinAPI_ShellChangeNotifyRegister ( $hWnd, $iMsg, $iEvents, $iSources, $aPaths [, $bRecursive = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that receives the change or notification messages.',
      },
      {
        label: '$iMsg',
        documentation: 'Message to be posted to the window procedure.',
      },
      {
        label: '$iEvents',
        documentation:
          'Change notification events for which to receive notification. This parameter can be one or more of the $SHCNE_* values.',
      },
      {
        label: '$iSources',
        documentation:
          'One or more of these values indicating event types: $SHCNRF_INTERRUPTLEVEL, $SHCNRF_SHELLLEVEL, $SHCNRF_RECURSIVEINTERRUPT, $SHCNRF_NEWDELIVERY',
      },
      {
        label: '$aPaths',
        documentation:
          'Single path or array of paths for which to receive notifications. These names should be fully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$bRecursive',
        documentation:
          "**[optional]** Specifies whether to post notifications for children paths in $aPaths parameter, valid values: True - Notifications would come from the folder's children. False - Notifications would come from the specified folder's only (Default).",
      },
    ],
  },
  _WinAPI_ShellCreateDirectory: {
    documentation: 'Creates a new file system folder',
    label: '_WinAPI_ShellCreateDirectory ( $sFilePath [, $hParent = 0 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The fully qualified path of the directory.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** A handle to a parent window.',
      },
      {
        label: '$tSecurity',
        documentation:
          "**[optional]** $tagSECURITY_ATTRIBUTES structure with the directory's security attribute. If this parameter is 0 (Default), no security attributes are set.",
      },
    ],
  },
  _WinAPI_ShellEmptyRecycleBin: {
    documentation: 'Empties the Recycle Bin on the specified drive',
    label: "_WinAPI_ShellEmptyRecycleBin ( [$sRoot = '' [, $iFlags = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The string that contains the path of the root drive on which the Recycle Bin is located. This string can be formatted with the drive, folder, and subfolder names, for example "c:\\\\windows\\\\system\\\\". If this parameter is empty string (Default), all Recycle Bins on all drives will be emptied.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values. $SHERB_NOCONFIRMATION $SHERB_NOPROGRESSUI $SHERB_NOSOUND $SHERB_NO_UI',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the parent window of any dialog boxes that might be displayed during the operation.',
      },
    ],
  },
  _WinAPI_ShellExecute: {
    documentation: 'Performs an operation on a specified file',
    label:
      "_WinAPI_ShellExecute ( $sFilePath [, $sArgs = '' [, $sDir = '' [, $sVerb = '' [, $iShow = 1 [, $hParent = 0]]]]] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The string that specifies the file or object on which to execute the specified verb. Note that not all verbs are supported on all objects. For example, not all document types support the "print" verb.',
      },
      {
        label: '$sArgs',
        documentation:
          '**[optional]** The string that specifies the parameters to be passed to the application.',
      },
      {
        label: '$sDir',
        documentation:
          '**[optional]** The string that specifies the working directory for the action.',
      },
      {
        label: '$sVerb',
        documentation:
          "**[optional]** The string, referred to as a verb, that specifies the action to be performed. The set of available verbs depends on the particular file or folder. Generally, the actions available from an object's shortcut menu are available verbs.",
      },
      {
        label: '$iShow',
        documentation:
          '**[optional]** The flags that specify how an application is to be displayed when it is opened ($SW_*).',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the owner window used for displaying a UI or error messages.',
      },
    ],
  },
  _WinAPI_ShellExecuteEx: {
    documentation: 'Performs an operation on a specified file',
    label: '_WinAPI_ShellExecuteEx ( ByRef $tSHEXINFO )',
    params: [
      {
        label: 'ByRef $tSHEXINFO',
        documentation:
          '$tagSHELLEXECUTEINFO structure that contains and receives information about the application being executed.',
      },
    ],
  },
  _WinAPI_ShellExtractAssociatedIcon: {
    documentation:
      "Returns a handle to the icon that is associated with the specified file's type.",
    label: '_WinAPI_ShellExtractAssociatedIcon ( $sFilePath [, $bSmall = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The full path and file name of the file that contains the icon, or its extension, such as ".txt".',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** Specifies whether to extract a small icon, valid values: True - Extract a small icon. False - Extract a large icon (Default).',
      },
    ],
  },
  _WinAPI_ShellExtractIcon: {
    documentation: 'Extracts the icon with the specified dimension from the specified file',
    label: '_WinAPI_ShellExtractIcon ( $sIcon, $iIndex, $iWidth, $iHeight )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Path and name of the file from which the icon are to be extracted.',
      },
      {
        label: '$iIndex',
        documentation:
          'The 0-based index of the icon to extract. If this value is a negative number, the function extracts the icon whose resource identifier is equal to the absolute value of $iIndex.',
      },
      {
        label: '$iWidth',
        documentation: 'Horizontal icon size wanted.',
      },
      {
        label: '$iHeight',
        documentation: 'Vertical icon size wanted.',
      },
    ],
  },
  _WinAPI_ShellFileOperation: {
    documentation: 'Copies, moves, renames, or deletes a file system object',
    label:
      "_WinAPI_ShellFileOperation ( $sFrom, $sTo, $iFunc, $iFlags [, $sTitle = '' [, $hParent = 0]] )",
    params: [
      {
        label: '$sFrom',
        documentation:
          'Single string or array of string that contains the source file name(s). These names should be fully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$sTo',
        documentation:
          'Single string or array of string that contains the destination file or directory name(s) (if used). These names should be fully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$iFunc',
        documentation:
          'A value that indicates which operation to perform. This parameter can be one of the following values: $FO_COPY, $FO_DELETE, $FO_MOVE, $FO_RENAME',
      },
      {
        label: '$iFlags',
        documentation: 'Flags that control the file operation.',
      },
      {
        label: '$sTitle',
        documentation:
          '**[optional]** The title of a progress dialog box. This parameter is used only if $iFlags includes the $FOF_SIMPLEPROGRESS flag.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the dialog box to display information about the status of the file operation.',
      },
    ],
  },
  _WinAPI_ShellFlushSFCache: {
    documentation: 'Flushes the special folder cache',
    label: '_WinAPI_ShellFlushSFCache ( )',
    params: [],
  },
  _WinAPI_ShellGetFileInfo: {
    documentation: 'Retrieves information about an object in the file system',
    label: '_WinAPI_ShellGetFileInfo ( $sFilePath, $iFlags, $iAttributes, ByRef $tSHFILEINFO )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'String that contains the absolute or relative path and file name. This string can use either short (the 8.3 form) or long file names.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify the file information to retrieve. This parameter can be a combination of the following values.',
      },
      {
        label: '$iAttributes',
        documentation: 'A combination of one or more file attribute flags ($FILE_ATTRIBUTE_*).',
      },
      {
        label: 'ByRef $tSHFILEINFO',
        documentation:
          '$tagSHFILEINFO structure to receive the file information. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_ShellGetIconOverlayIndex: {
    documentation: 'Retrieves the index of the overlay icon in the system image list',
    label: '_WinAPI_ShellGetIconOverlayIndex ( $sIcon, $iIndex )',
    params: [
      {
        label: '$sIcon',
        documentation: 'The fully qualified path of the file that contains the icon.',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the icon. To request a standard overlay icon, set the path to an empty string, and index to one of the following values.',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderIDList: {
    documentation: 'Retrieves the path of a known folder as an ITEMIDLIST structure',
    label: '_WinAPI_ShellGetKnownFolderIDList ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation:
          'The GUID ($FOLDERID_*) that identifies the standard folders registered with the system.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify special retrieval options. This parameter can be one or more of the following values.',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requests the known folder for the current user. Assigning the $hToken parameter a value of (-1) indicates the Default User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderPath: {
    documentation: 'Retrieves the full path of a known folder identified',
    label: '_WinAPI_ShellGetKnownFolderPath ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation:
          'The GUID ($FOLDERID_*) that identifies the standard folders registered with the system.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify special retrieval options. This parameter can be one or more of the following values.',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requests the known folder for the current user. Assigning the $hToken parameter a value of (-1) indicates the Default User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellGetLocalizedName: {
    documentation: 'Retrieves the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellGetLocalizedName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
    ],
  },
  _WinAPI_ShellGetPathFromIDList: {
    documentation: 'Converts an item identifier list to a file system path',
    label: '_WinAPI_ShellGetPathFromIDList ( $pPIDL )',
    params: [
      {
        label: '$pPIDL',
        documentation:
          'The address of an item identifier list that specifies a file or directory location relative to the root of the namespace (the desktop).',
      },
    ],
  },
  _WinAPI_ShellGetSetFolderCustomSettings: {
    documentation: 'Sets or retrieves custom folder settings',
    label: '_WinAPI_ShellGetSetFolderCustomSettings ( $sFilePath, $iFlag, ByRef $tSHFCS )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the folder.',
      },
      {
        label: '$iFlag',
        documentation:
          'A flag controlling the action of the function. It may be one of the following values. $FCS_READ $FCS_FORCEWRITE $FCS_WRITE',
      },
      {
        label: 'ByRef $tSHFCS',
        documentation:
          '$tagSHFOLDERCUSTOMSETTINGS structure that provides or receives the custom folder settings. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_ShellGetSettings: {
    documentation: 'Retrieves Shell state settings',
    label: '_WinAPI_ShellGetSettings ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'The flags that indicate which settings should be retrieved. This parameter can be one or more of the following values (use ONLY this flags).',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderLocation: {
    documentation: 'Retrieves a pointer to the ITEMIDLIST structure (PIDL) of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderLocation ( $iCSIDL )',
    params: [
      {
        label: '$iCSIDL',
        documentation: 'The CSIDL ($CSIDL_*) that identifies the folder of interest.',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderPath: {
    documentation: 'Retrieves the path of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderPath ( $iCSIDL [, $bCreate = False] )',
    params: [
      {
        label: '$iCSIDL',
        documentation: 'The CSIDL ($iCSIDL_*) that identifies the folder of interest.',
      },
      {
        label: '$bCreate',
        documentation:
          '**[optional]** Specifies whether the folder should be created if it does not already exist, valid values: True - The folder is created. False - The folder is not created (Default).',
      },
    ],
  },
  _WinAPI_ShellGetStockIconInfo: {
    documentation: 'Retrieves information about system-defined Shell icons',
    label: '_WinAPI_ShellGetStockIconInfo ( $iSIID, $iFlags )',
    params: [
      {
        label: '$iSIID',
        documentation:
          'One of the $SIID_* constants that specifies which icon should be retrieved. Those constants are defined in APIShellExConstants.au3.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify which information is requested. This parameter can be a combination of the following values. $SHGSI_ICONLOCATION $SHGSI_ICON $SHGSI_SYSICONINDEX $SHGSI_LINKOVERLAY $SHGSI_SELECTED $SHGSI_LARGEICON $SHGSI_SMALLICON $SHGSI_SHELLICONSIZE',
      },
    ],
  },
  _WinAPI_ShellILCreateFromPath: {
    documentation: 'Creates a pointer to an item identifier list (PIDL) from a path',
    label: '_WinAPI_ShellILCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be converted.',
      },
    ],
  },
  _WinAPI_ShellNotifyIcon: {
    documentation: "Sends a message to the taskbar's status area",
    label: '_WinAPI_ShellNotifyIcon ( $iMessage, $tNOTIFYICONDATA )',
    params: [
      {
        label: '$iMessage',
        documentation:
          'The variable that specifies the action to be taken. It can have one of the following values.',
      },
      {
        label: '$tNOTIFYICONDATA',
        documentation:
          '$tagNOTIFYICONDATA structure. The content and size of this structure depends on the value of the $iMessage and version of the operating system.',
      },
    ],
  },
  _WinAPI_ShellNotifyIconGetRect: {
    documentation: 'Gets the screen coordinates of the bounding rectangle of a notification icon',
    label: '_WinAPI_ShellNotifyIconGetRect ( $hWnd, $iID [, $tGUID = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the parent window used by the notification\'s callback function. For more information, see the "hWnd" member of the $tagNOTIFYICONDATA structure.',
      },
      {
        label: '$iID',
        documentation:
          'Application-defined identifier of the notification icon. Multiple icons can be associated with a single $hWnd, each with their own $iID.',
      },
      {
        label: '$tGUID',
        documentation: '**[optional]** $tagGUID structure that identifies the icon.',
      },
    ],
  },
  _WinAPI_ShellObjectProperties: {
    documentation: 'Invokes the Properties context menu command on a Shell object',
    label:
      "_WinAPI_ShellObjectProperties ( $sFilePath [, $iType = $SHOP_FILEPATH [, $sProperty = '' [, $hParent = 0]]] )",
    params: [
      {
        label: '$sFilePath',
        documentation: 'The object name.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The value that specifies the type of object.\n\n`$SHOP_PRINTERNAME`\n\n`$SHOP_FILEPATH` (Default)\n\n`$SHOP_VOLUMEGUID`',
      },
      {
        label: '$sProperty',
        documentation: '**[optional]** The name of the property sheet page to be opened initially.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window of the dialog box.',
      },
    ],
  },
  _WinAPI_ShellOpenFolderAndSelectItems: {
    documentation:
      'Opens a Windows Explorer window with specified items in a particular folder selected',
    label:
      '_WinAPI_ShellOpenFolderAndSelectItems ( $sFilePath [, $aNames = 0 [, $iStart = 0 [, $iEnd = -1 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The fully qualified path that specifies the folder or file. If `$aNames` parameter is used, `$sFilePath` should specified only to a folder, otherwise, the function fails. This parameter can be an empty string.',
      },
      {
        label: '$aNames',
        documentation:
          '**[optional]** The array of the folder or file names to be selected. It should be just names in the specified folder, without its path.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start selecting at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop selecting at.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. This parameter can be one or more of the following values.\n\n**Windows Vista or later**\n\n`$OFASI_EDIT`\n\n`$OFASI_OPENDESKTOP`',
      },
    ],
  },
  _WinAPI_ShellQueryRecycleBin: {
    documentation:
      'Retrieves the size of the Recycle Bin and the number of items in it, for a specified drive',
    label: "_WinAPI_ShellQueryRecycleBin ( [$sRoot = ''] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The string that contains the path of the root drive on which the Recycle Bin is located. This string can be formatted with the drive, folder, and subfolder names, for example "c:\\windows\\system".\n\nIf this parameter is empty string, information is retrieved for all Recycle Bins on all drives.',
      },
    ],
  },
  _WinAPI_ShellQueryUserNotificationState: {
    documentation: 'Checks the state of the computer for the current user',
    label: '_WinAPI_ShellQueryUserNotificationState ( )',
    params: [],
  },
  _WinAPI_ShellRemoveLocalizedName: {
    documentation: 'Removes the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellRemoveLocalizedName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
    ],
  },
  _WinAPI_ShellRestricted: {
    documentation: 'Determines whether a specified administrator policy is in effect',
    label: '_WinAPI_ShellRestricted ( $iRestriction )',
    params: [
      {
        label: '$iRestriction',
        documentation:
          'A restriction. This parameter can be one of the `$REST_*` constants defined in APIShellExConstants.au3.',
      },
    ],
  },
  _WinAPI_ShellSetKnownFolderPath: {
    documentation: 'Redirects a known folder to a new location',
    label: '_WinAPI_ShellSetKnownFolderPath ( $sGUID, $sFilePath [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation: 'The GUID (`$FOLDERID_*`) that identifies the known folder.',
      },
      {
        label: '$sFilePath',
        documentation: "The folder's new path.",
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be 0 or the following value.\n\n`$KF_FLAG_DONT_UNEXPAND`',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requests the known folder for the current user. Assigning the `$hToken` parameter a value of (-1) indicates the Default User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellSetLocalizedName: {
    documentation: 'Sets the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellSetLocalizedName ( $sFilePath, $sModule, $iResID )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
      {
        label: '$sModule',
        documentation:
          'The path to the module containing string resource that specifies the localized version of the file name.',
      },
      {
        label: '$iResID',
        documentation: 'ID of the localized file name resource.',
      },
    ],
  },
  _WinAPI_ShellSetSettings: {
    documentation: 'Sets Shell state settings',
    label: '_WinAPI_ShellSetSettings ( $iFlags, $bSet )',
    params: [
      {
        label: '$iFlags',
        documentation: `The flags that indicate which settings should be set. This parameter can be one or more of the following values (use ONLY this flags).${br}
          \`$SSF_SHOWALLOBJECTS\`${br}
          \`$SSF_SHOWEXTENSIONS\`${br}
          \`$SSF_SHOWCOMPCOLOR\`${br}
          \`$SSF_SHOWSYSFILES\`${br}
          \`$SSF_DOUBLECLICKINWEBVIEW\`${br}
          \`$SSF_DESKTOPHTML\`${br}
          \`$SSF_WIN95CLASSIC\`${br}
          \`$SSF_DONTPRETTYPATH\`${br}
          \`$SSF_MAPNETDRVBUTTON\`${br}
          \`$SSF_SHOWINFOTIP\`${br}
          \`$SSF_HIDEICONS\`${br}
          \`$SSF_NOCONFIRMRECYCLE\`${br}
          \`$SSF_WEBVIEW\`${br}
          \`$SSF_SHOWSUPERHIDDEN\`${br}
          \`$SSF_SEPPROCESS\`${br}
          \`$SSF_NONETCRAWLING\`${br}
          \`$SSF_STARTPANELON\`${br}
          **Windows Vista or later**${br}
          \`$SSF_AUTOCHECKSELECT\`${br}
          \`$SSF_ICONSONLY\`${br}
          \`$SSF_SHOWTYPEOVERLAY\``,
      },
      {
        label: '$bSet',
        documentation: `Specifies whether a settings (\`$SSF_*\`) is enable or disable, valid values: ${br}
          True - Enable.${br}
          False - Disable.`,
      },
    ],
  },
  _WinAPI_ShellUpdateImage: {
    documentation: 'Notifies the Shell that an image in the system image list has changed',
    label: '_WinAPI_ShellUpdateImage ( $sIcon, $iIndex, $iImage [, $iFlags = 0] )',
    params: [
      {
        label: '$sIcon',
        documentation: 'The fully qualified path of the file that contains the icon.',
      },
      {
        label: '$iIndex',
        documentation: 'The 0-based index of the icon.',
      },
      {
        label: '$iImage',
        documentation:
          'The 0-based index in the system image list of the icon that is being updated.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that determine the icon attributes. It can be 0 or a combination of the following values.\n\n`$GIL_NOTFILENAME`\n\n`$GIL_SIMULATEDOC`',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
