import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <FTPEx.au3>`)';

const signatures = {
  _FTP_Close: {
    documentation: 'Closes the _FTP_Open or _FTP_Connect session',
    label: '_FTP_Close ( $hSession )',
    params: [
      {
        label: '$hSession',
        documentation: 'as returned by _FTP_Open() or _FTP_Connect()',
      },
    ],
  },
  _FTP_Command: {
    documentation: 'Sends a command to an FTP server',
    label:
      '_FTP_Command ( $hFTPSession, $sFTPCommand [, $iFlags = $FTP_TRANSFER_TYPE_ASCII [, $iExpectResponse = 0 [, $iContext = 0]]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect()',
      },
      {
        label: '$sFTPCommand',
        documentation: 'Command string to send to FTP Server',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** $FTP_TRANSFER_TYPE_ASCII or $FTP_TRANSFER_TYPE_BINARY',
      },
      {
        label: '$iExpectResponse',
        documentation: '**[optional]** Data socket for response in Async mode. See remarks.',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_Connect: {
    documentation: 'Connects to an FTP server',
    label:
      '_FTP_Connect ( $hInternetSession, $sServerName, $sUsername, $sPassword [, $iPassive = 0 [, $iServerPort = 0 [, $iService = $INTERNET_SERVICE_FTP [, $iFlags = 0 [, $fuContext = 0]]]]] )',
    params: [
      {
        label: '$hInternetSession',
        documentation: 'as returned by _FTP_Open()',
      },
      {
        label: '$sServerName',
        documentation: 'Server name/ip.',
      },
      {
        label: '$sUsername',
        documentation: 'Username.',
      },
      {
        label: '$sPassword',
        documentation: 'Password.',
      },
      {
        label: '$iPassive',
        documentation: '**[optional]** Passive mode.',
      },
      {
        label: '$iServerPort',
        documentation: '**[optional]** Server port ( 0 is default (21) )',
      },
      {
        label: '$iService',
        documentation:
          '**[optional]** This can be one of the following constant values:    $INTERNET_SERVICE_FTP - FTP service.    $INTERNET_SERVICE_GOPHER - Gopher service. Available only on Windows XP, Windows Server 2003 R2 or earlier.    $INTERNET_SERVICE_HTTP - HTTP service.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Special flags.    $INTERNET_FLAG_PASSIVE    $INTERNET_FLAG_TRANSFER_ASCII    $INTERNET_FLAG_TRANSFER_BINARY',
      },
      {
        label: '$fuContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_DecodeInternetStatus: {
    documentation: 'Decode a received Internet Status',
    label: '_FTP_DecodeInternetStatus ( $iInternetStatus )',
    params: [
      {
        label: '$iInternetStatus',
        documentation: 'Internet status',
      },
    ],
  },
  _FTP_DirCreate: {
    documentation: 'Makes an Directory on an FTP server',
    label: '_FTP_DirCreate ( $hFTPSession, $sRemote )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sRemote',
        documentation: 'The Directory to Create.',
      },
    ],
  },
  _FTP_DirDelete: {
    documentation: "Delete's an Directory on an FTP server",
    label: '_FTP_DirDelete ( $hFTPSession, $sRemote )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sRemote',
        documentation: 'The Directory to deleted.',
      },
    ],
  },
  _FTP_DirGetCurrent: {
    documentation: 'Get Current Directory on an FTP server',
    label: '_FTP_DirGetCurrent ( $hFTPSession )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
    ],
  },
  _FTP_DirPutContents: {
    documentation: 'Puts an folder on an FTP server. Recursivley if selected',
    label:
      '_FTP_DirPutContents ( $hFTPSession, $sLocalFolder, $sRemoteFolder, $bRecursivePut [, $iContext = 0] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sLocalFolder',
        documentation: 'The local folder i.e. "c:\\temp".',
      },
      {
        label: '$sRemoteFolder',
        documentation: "The remote folder i.e. '/website/home'.",
      },
      {
        label: '$bRecursivePut',
        documentation: 'Recurse through sub-dirs. 0=Non recursive, 1=Recursive',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_DirSetCurrent: {
    documentation: 'Set Current Directory on an FTP server',
    label: '_FTP_DirSetCurrent ( $hFTPSession, $sRemote )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sRemote',
        documentation: 'The Directory to be set.',
      },
    ],
  },
  _FTP_FileClose: {
    documentation: 'Closes the Handle returned by _FTP_FileOpen',
    label: '_FTP_FileClose ( $hFTPFile )',
    params: [
      {
        label: '$hFTPFile',
        documentation: 'as returned by _FTP_FileOpen()',
      },
    ],
  },
  _FTP_FileDelete: {
    documentation: 'Delete an file from an FTP server',
    label: '_FTP_FileDelete ( $hFTPSession, $sRemoteFile )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect()',
      },
      {
        label: '$sRemoteFile',
        documentation: 'The remote Location for the file.',
      },
    ],
  },
  _FTP_FileGet: {
    documentation: 'Get file from a FTP server',
    label:
      '_FTP_FileGet ( $hFTPSession, $sRemoteFile, $sLocalFile [, $bFailIfExists = False [, $iFlagsAndAttributes = 0 [, $iFlags = $FTP_TRANSFER_TYPE_UNKNOWN [, $iContext = 0]]]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect()',
      },
      {
        label: '$sRemoteFile',
        documentation: 'The remote Location for the file.',
      },
      {
        label: '$sLocalFile',
        documentation: 'The local file.',
      },
      {
        label: '$bFailIfExists',
        documentation: '**[optional]** True: do not overwrite existing (default = False).',
      },
      {
        label: '$iFlagsAndAttributes',
        documentation: '**[optional]** File attributes for the new file.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** as in _FTP_FileOpen().',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_FileGetSize: {
    documentation: 'Gets filesize of a file on the FTP server',
    label: '_FTP_FileGetSize ( $hFTPSession, $sFileName )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sFileName',
        documentation: 'The file name.',
      },
    ],
  },
  _FTP_FileOpen: {
    documentation: 'Initiates access to a remote file on an FTP server for reading or writing',
    label:
      '_FTP_FileOpen ( $hConnect, $sFileName [, $iAccess = $GENERIC_READ [, $iFlags = $INTERNET_FLAG_TRANSFER_BINARY [, $iContext = 0]]] )',
    params: [
      {
        label: '$hConnect',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sFileName',
        documentation: 'String of the ftp file to open.',
      },
      {
        label: '$iAccess',
        documentation: '**[optional]** The Local attribute (default $GENERIC_READ).',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Specify the conditions under which the transfers occur. The application should select one transfer type and any of the flags that indicate how the caching of the file will be controlled.The transfer type can be one of the following values:    $FTP_TRANSFER_TYPE_ASCII - Transfers the file using FTP's ASCII (Type A) transfer method. Control and formatting information is converted to local equivalents.    $FTP_TRANSFER_TYPE_BINARY - Transfers the file using FTP's Image (Type I) transfer method. The file is transferred exactly as it exists with no changes. This is the default transfer method.    $FTP_TRANSFER_TYPE_UNKNOWN - Defaults to $FTP_TRANSFER_TYPE_BINARY.    $INTERNET_FLAG_TRANSFER_ASCII - Transfers the file as ASCII.    $INTERNET_FLAG_TRANSFER_BINARY - Transfers the file as binary.The following values are used to control the caching of the file. The application can use one or more of these values:    $INTERNET_FLAG_HYPERLINK - Forces a reload if there was no Expires time and no LastModified time returned from the server when determining whether to reload the item from the network.    $INTERNET_FLAG_NEED_FILE - Causes a temporary file to be created if the file cannot be cached.    $INTERNET_FLAG_RELOAD - Forces a download of the requested file, object, or directory listing from the origin server, not from the cache.    $INTERNET_FLAG_RESYNCHRONIZE - Reloads HTTP resources if the resource has been modified since the last time it was downloaded. All FTP and Gopher resources are reloaded.",
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_FilePut: {
    documentation: 'Puts an file on an FTP server',
    label:
      '_FTP_FilePut ( $hFTPSession, $sLocalFile, $sRemoteFile [, $iFlags = 0 [, $iContext = 0]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect()',
      },
      {
        label: '$sLocalFile',
        documentation: 'The local file.',
      },
      {
        label: '$sRemoteFile',
        documentation: 'The remote Location for the file.',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Specify the conditions under which the transfers occur. The application should select one transfer type and any of the flags that indicate how the caching of the file will be controlled.The transfer type can be one of the following values:    $FTP_TRANSFER_TYPE_ASCII - Transfers the file using FTP's ASCII (Type A) transfer method. Control and formatting information is converted to local equivalents.    $FTP_TRANSFER_TYPE_BINARY - Transfers the file using FTP's Image (Type I) transfer method. The file is transferred exactly as it exists with no changes. This is the default transfer method.    $FTP_TRANSFER_TYPE_UNKNOWN - Defaults to $FTP_TRANSFER_TYPE_BINARY.    $INTERNET_FLAG_TRANSFER_ASCII - Transfers the file as ASCII.    $INTERNET_FLAG_TRANSFER_BINARY - Transfers the file as binary.The following values are used to control the caching of the file. The application can use one or more of these values:    $INTERNET_FLAG_HYPERLINK - Forces a reload if there was no Expires time and no LastModified time returned from the server when determining whether to reload the item from the network.    $INTERNET_FLAG_NEED_FILE - Causes a temporary file to be created if the file cannot be cached.    $INTERNET_FLAG_RELOAD - Forces a download of the requested file, object, or directory listing from the origin server, not from the cache.    $INTERNET_FLAG_RESYNCHRONIZE - Reloads HTTP resources if the resource has been modified since the last time it was downloaded. All FTP and Gopher resources are reloaded.",
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_FileRead: {
    documentation: 'Reads data from a handle opened by _FTP_FileOpen()',
    label: '_FTP_FileRead ( $hFTPFile, $iNumberOfBytesToRead )',
    params: [
      {
        label: '$hFTPFile',
        documentation: 'Handle returned by _FTP_FileOpen() to the ftp file.',
      },
      {
        label: '$iNumberOfBytesToRead',
        documentation: 'Number of bytes to read.',
      },
    ],
  },
  _FTP_FileRename: {
    documentation: 'Renames an file on an FTP server',
    label: '_FTP_FileRename ( $hFTPSession, $sExisting, $sNew )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sExisting',
        documentation: 'The old file name.',
      },
      {
        label: '$sNew',
        documentation: 'The new file name.',
      },
    ],
  },
  _FTP_FileTimeLoHiToStr: {
    documentation: 'Converts filetime Loword and Hiword to a string',
    label: '_FTP_FileTimeLoHiToStr ( $iLoDWORD, $iHiDWORD [, $bFmt = 0] )',
    params: [
      {
        label: '$iLoDWORD',
        documentation: 'FileTime Low',
      },
      {
        label: '$iHiDWORD',
        documentation: 'File Time Hi',
      },
      {
        label: '$bFmt',
        documentation:
          '**[optional]**    0 returns mm/dd/yyyy hh:mm:ss (Default)    1 returns yyyy/mm/dd hh:mm:ss',
      },
    ],
  },
  _FTP_FindFileClose: {
    documentation: 'Delete FindFile Handle',
    label: '_FTP_FindFileClose ( $hFTPFind )',
    params: [
      {
        label: '$hFTPFind',
        documentation: 'as returned by _FTP_FindFileFirst()',
      },
    ],
  },
  _FTP_FindFileFirst: {
    documentation: 'Find First File on an FTP server',
    label:
      '_FTP_FindFileFirst ( $hFTPSession, $sRemotePath, ByRef $hFTPFind [, $iFlags = 0 [, $iContext = 0]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sRemotePath',
        documentation: 'path to be used when searching the file.',
      },
      {
        label: '$hFTPFind',
        documentation: 'returns Handle to be used in _FTP_FindFileNext() or _FTP_FindFileClose().',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** $iFlags can be a combination of :    $INTERNET_FLAG_HYPERLINK    $INTERNET_FLAG_NEED_FILE    $INTERNET_FLAG_NO_CACHE_WRITE    $INTERNET_FLAG_RELOAD    $INTERNET_FLAG_RESYNCHRONIZE',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_FindFileNext: {
    documentation: 'Find Next File on an FTP server',
    label: '_FTP_FindFileNext ( $hFTPFind )',
    params: [
      {
        label: '$hFTPFind',
        documentation: 'Handle as returned by _FTP_FindFileFirst().',
      },
    ],
  },
  _FTP_GetLastResponseInfo: {
    documentation:
      'Retrieves the last error description or server response on the thread calling this function',
    label: '_FTP_GetLastResponseInfo ( ByRef $iError, ByRef $sMessage )',
    params: [
      {
        label: '$iError',
        documentation: 'returns an error message pertaining to the operation that failed.',
      },
      {
        label: '$sMessage',
        documentation: 'returns the error text.',
      },
    ],
  },
  _FTP_ListToArray: {
    documentation: 'Get Filenames, Directories or Both of current remote directory',
    label:
      '_FTP_ListToArray ( $hFTPSession [, $iReturnType = 0 [, $iFlags = $INTERNET_FLAG_NO_CACHE_WRITE [, $iContext = 0]]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$iReturntype',
        documentation: '**[optional]** 0 = Both Files and Directories, 1 = Directories, 2 = Files.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** default = $INTERNET_FLAG_NO_CACHE_WRITE. See _FTP_FindFileFirst().',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_ListToArray2D: {
    documentation: 'Get Filenames and filesizes of current remote directory',
    label:
      '_FTP_ListToArray2D ( $hFTPSession [, $iReturnType = 0 [, $iFlags = $INTERNET_FLAG_NO_CACHE_WRITE [, $iContext = 0]]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$iReturntype',
        documentation: '**[optional]** 0 = Both Files and Directories, 1 = Directories, 2 = Files.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** default = $INTERNET_FLAG_NO_CACHE_WRITE. See _FTP_FindFileFirst().',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_ListToArrayEx: {
    documentation:
      'Get names, sizes, attributes and times of files/dir of current remote directory',
    label:
      '_FTP_ListToArrayEx ( $hFTPSession [, $iReturnType = 0 [, $iFlags = $INTERNET_FLAG_NO_CACHE_WRITE [, $iFmt = 1 [, $iContext = 0]]]] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$iReturntype',
        documentation: '**[optional]** 0 = Both Files and Directories, 1 = Directories, 2 = Files.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** default = $INTERNET_FLAG_NO_CACHE_WRITE. See _FTP_FindFileFirst().',
      },
      {
        label: '$iFmt',
        documentation:
          '**[optional]** type on the date strings:    1 = yyyy/mm/dd    0 = mm/dd/yyyy',
      },
      {
        label: '$iContext',
        documentation:
          '**[optional]** A variable that contains the application-defined value that associates this search with any application data.This is only used if the application has already called _FTP_SetStatusCallback() to set up a status callback function.',
      },
    ],
  },
  _FTP_Open: {
    documentation: 'Opens an FTP session',
    label:
      "_FTP_Open ( $sAgent [, $iAccessType = $INTERNET_OPEN_TYPE_DIRECT [, $sProxyName = '' [, $sProxyBypass = '' [, $iFlags = 0]]]] )",
    params: [
      {
        label: '$sAgent',
        documentation: 'Random name. ( like "myftp" )',
      },
      {
        label: '$iAccessType',
        documentation:
          '**[optional]** Set if proxy is used:    $INTERNET_OPEN_TYPE_DIRECT -> no proxy (Default)    $INTERNET_OPEN_TYPE_PRECONFIG -> Retrieves the proxy or direct configuration from the registry.    $INTERNET_OPEN_TYPE_PRECONFIG_WITH_NO_AUTOPROXY -> Retrieves the proxy or direct configuration from the registry and prevents the use of a startup Microsoft JScript or Internet Setup (INS) file.    $INTERNET_OPEN_TYPE_PROXY -> Passes requests to the proxy unless a proxy bypass list is supplied and the name to be resolved bypasses the proxy. Then no proxy is used.',
      },
      {
        label: '$sProxyName',
        documentation: '**[optional]** ProxyName.',
      },
      {
        label: '$sProxyBypass',
        documentation: "**[optional]** ProxyByPasses's.",
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]**    $INTERNET_FLAG_ASYNC -> Makes only asynchronous requests on handles descended from the handle returned from this function.    $INTERNET_FLAG_FROM_CACHE -> Does not make network requests. All entities are returned from the cache. If the requested item is not in the cache, a suitable error, such as ERROR_FILE_NOT_FOUND, is returned.',
      },
    ],
  },
  _FTP_ProgressDownload: {
    documentation:
      'Downloads a file in Binary Mode and shows a Progress window or by Calling a User defined Function',
    label:
      '_FTP_ProgressDownload ( $hFTPSession, $sLocalFile, $sRemoteFile [, $hFunctionToCall = 0] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sLocalFile',
        documentation: 'The local file to create.',
      },
      {
        label: '$sRemoteFile',
        documentation: 'The remote source file.',
      },
      {
        label: '$hFunctionToCall',
        documentation:
          '**[optional]** A variable assigned to the user defined function to update a progress bar or react on user interation, such as aborting or exiting the process. Default = none. See remarks.',
      },
    ],
  },
  _FTP_ProgressUpload: {
    documentation:
      'Uploads a file in Binary Mode and shows a Progress window or by Calling a User defined Function',
    label:
      '_FTP_ProgressUpload ( $hFTPSession, $sLocalFile, $sRemoteFile [, $hFunctionToCall = 0] )',
    params: [
      {
        label: '$hFTPSession',
        documentation: 'as returned by _FTP_Connect().',
      },
      {
        label: '$sLocalFile',
        documentation: 'The local file to create.',
      },
      {
        label: '$sRemoteFile',
        documentation: 'The remote source file.',
      },
      {
        label: '$hFunctionToCall',
        documentation:
          '**[optional]** A variable assigned to the user defined function to update a progress bar or react on user interation, such as aborting or exiting the process. Default = none. See remarks.',
      },
    ],
  },
  _FTP_SetStatusCallback: {
    documentation:
      'Registers callback function that WinINet functions can call as progress is made during an operation',
    label: '_FTP_SetStatusCallback ( $hInternetSession, $sFunctionName )',
    params: [
      {
        label: '$hInternetSession',
        documentation: 'as returned by _FTP_Open()',
      },
      {
        label: '$sFunctionName',
        documentation: 'the name of the User Defined Function to call.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
