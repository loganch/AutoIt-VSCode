import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIShellEx.au3>`)';

const signatures = {
  _WinAPI_DllGetVersion: {
    documentation: 'Retrieves a DLL-specific version information',
    label: '_WinAPI_DllGetVersion ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellAddToRecentDocs: {
    documentation: 'Adds a file to the most recently and frequently item list',
    label: '_WinAPI_ShellAddToRecentDocs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellChangeNotify: {
    documentation: 'Notifies the system of an event that an application has performed',
    label: '_WinAPI_ShellChangeNotify ( $iEvent, $iFlags [, $iItem1 = 0 [, $iItem2 = 0]] )',
    params: [
      {
        label: '$iEvent',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags [, $iItem1',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellChangeNotifyDeregister: {
    documentation: "Unregisters the client's window",
    label: '_WinAPI_ShellChangeNotifyDeregister ( $iID )',
    params: [
      {
        label: '$iID',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$iMsg',
        documentation: 'Parameter description',
      },
      {
        label: '$iEvents',
        documentation: 'Parameter description',
      },
      {
        label: '$iSources',
        documentation: 'Parameter description',
      },
      {
        label: '$aPaths [, $bRecursive',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellCreateDirectory: {
    documentation: 'Creates a new file system folder',
    label: '_WinAPI_ShellCreateDirectory ( $sFilePath [, $hParent = 0 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sFilePath [, $hParent',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellEmptyRecycleBin: {
    documentation: 'Empties the Recycle Bin on the specified drive',
    label: "_WinAPI_ShellEmptyRecycleBin ( [$sRoot = '' [, $iFlags = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sRoot',
        documentation: "**[optional]** Default is '' [, $iFlags.",
      },
    ],
  },
  _WinAPI_ShellExecute: {
    documentation: 'Performs an operation on a specified file',
    label:
      "_WinAPI_ShellExecute ( $sFilePath [, $sArgs = '' [, $sDir = '' [, $sVerb = '' [, $iShow = 1 [, $hParent = 0]]]]] )",
    params: [
      {
        label: '$sFilePath [, $sArgs',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellExecuteEx: {
    documentation: 'Performs an operation on a specified file',
    label: '_WinAPI_ShellExecuteEx ( ByRef $tSHEXINFO )',
    params: [
      {
        label: 'ByRef $tSHEXINFO',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellExtractAssociatedIcon: {
    documentation: "Returns a handle to the icon that associated with the specified file's",
    label: '_WinAPI_ShellExtractAssociatedIcon ( $sFilePath [, $bSmall = False] )',
    params: [
      {
        label: '$sFilePath [, $bSmall',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellExtractIcon: {
    documentation: 'Extracts the icon with the specified dimension from the specified file',
    label: '_WinAPI_ShellExtractIcon ( $sIcon, $iIndex, $iWidth, $iHeight )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$sTo',
        documentation: 'Parameter description',
      },
      {
        label: '$iFunc',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags [, $sTitle',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
      {
        label: '$iAttributes',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tSHFILEINFO',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetIconOverlayIndex: {
    documentation: 'Retrieves the index of the overlay icon in the system image list',
    label: '_WinAPI_ShellGetIconOverlayIndex ( $sIcon, $iIndex )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderIDList: {
    documentation: 'Retrieves the path of a known folder as an ITEMIDLIST structure',
    label: '_WinAPI_ShellGetKnownFolderIDList ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderPath: {
    documentation: 'Retrieves the full path of a known folder identified',
    label: '_WinAPI_ShellGetKnownFolderPath ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetLocalizedName: {
    documentation: 'Retrieves the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellGetLocalizedName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetPathFromIDList: {
    documentation: 'Converts an item identifier list to a file system path',
    label: '_WinAPI_ShellGetPathFromIDList ( $pPIDL )',
    params: [
      {
        label: '$pPIDL',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetSetFolderCustomSettings: {
    documentation: 'Sets or retrieves custom folder settings',
    label: '_WinAPI_ShellGetSetFolderCustomSettings ( $sFilePath, $iFlag, ByRef $tSHFCS )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlag',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tSHFCS',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetSettings: {
    documentation: 'Retrieves Shell state settings',
    label: '_WinAPI_ShellGetSettings ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderLocation: {
    documentation: 'Retrieves a pointer to the ITEMIDLIST structure (PIDL) of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderLocation ( $iCSIDL )',
    params: [
      {
        label: '$iCSIDL',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderPath: {
    documentation: 'Retrieves the path of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderPath ( $iCSIDL [, $bCreate = False] )',
    params: [
      {
        label: '$iCSIDL [, $bCreate',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellGetStockIconInfo: {
    documentation: 'Retrieves information about system-defined Shell icons',
    label: '_WinAPI_ShellGetStockIconInfo ( $iSIID, $iFlags )',
    params: [
      {
        label: '$iSIID',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellILCreateFromPath: {
    documentation: 'Creates a pointer to an item identifier list (PIDL) from a path',
    label: '_WinAPI_ShellILCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellNotifyIcon: {
    documentation: "Sends a message to the taskbar's status area",
    label: '_WinAPI_ShellNotifyIcon ( $iMessage, $tNOTIFYICONDATA )',
    params: [
      {
        label: '$iMessage',
        documentation: 'Parameter description',
      },
      {
        label: '$tNOTIFYICONDATA',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellNotifyIconGetRect: {
    documentation: 'Gets the screen coordinates of the bounding rectangle of a notification icon',
    label: '_WinAPI_ShellNotifyIconGetRect ( $hWnd, $iID [, $tGUID = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$iID [, $tGUID',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellObjectProperties: {
    documentation: 'Invokes the Properties context menu command on a Shell object',
    label:
      "_WinAPI_ShellObjectProperties ( $sFilePath [, $iType = 2 [, $sProperty = '' [, $hParent = 0]]] )",
    params: [
      {
        label: '$sFilePath [, $iType',
        documentation: 'Parameter description',
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
        label: '$sFilePath [, $aNames',
        documentation: 'Parameter description',
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
        documentation: "**[optional]** Default is ''.",
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellRestricted: {
    documentation: 'Determines whether a specified administrator policy is in effect',
    label: '_WinAPI_ShellRestricted ( $iRestriction )',
    params: [
      {
        label: '$iRestriction',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellSetKnownFolderPath: {
    documentation: 'Redirects a known folder to a new location',
    label: '_WinAPI_ShellSetKnownFolderPath ( $sGUID, $sFilePath [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation: 'Parameter description',
      },
      {
        label: '$sFilePath [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellSetLocalizedName: {
    documentation: 'Sets the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellSetLocalizedName ( $sFilePath, $sModule, $iResID )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$sModule',
        documentation: 'Parameter description',
      },
      {
        label: '$iResID',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellSetSettings: {
    documentation: 'Sets Shell state settings',
    label: '_WinAPI_ShellSetSettings ( $iFlags, $bSet )',
    params: [
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
      {
        label: '$bSet',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ShellUpdateImage: {
    documentation: 'Notifies the Shell that an image in the system image list has changed',
    label: '_WinAPI_ShellUpdateImage ( $sIcon, $iIndex, $iImage [, $iFlags = 0] )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex',
        documentation: 'Parameter description',
      },
      {
        label: '$iImage [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
