import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <SQLite.au3>`)';

const signatures = {
  _SQLite_Changes: {
    documentation:
      'Returns the number of database rows that were changed by the most recently completed statement with this connection',
    label: '_SQLite_Changes ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, default is the last opened database',
      },
    ],
  },
  _SQLite_Close: {
    documentation: 'Close an open database',
    label: '_SQLite_Close ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** Database handle.',
      },
    ],
  },
  _SQLite_Display2DResult: {
    documentation: 'Returns or prints to Console a formated display of a 2Dimensional array',
    label: '_SQLite_Display2DResult ( $aResult [, $iCellWidth = 0 [, $bReturn = False]] )',
    params: [
      {
        label: '$aResult',
        documentation: 'The array to be displayed',
      },
      {
        label: '$iCellWidth',
        documentation: '**[optional]** specifies the size of a data field',
      },
      {
        label: '$bReturn',
        documentation:
          '**[optional]** if True the formated string is returned, not displayedIf False the formatted string is send to StdOut',
      },
    ],
  },
  _SQLite_Encode: {
    documentation:
      'Binary encodes a string, number or binary data for use as BLOB in SQLite statements',
    label: '_SQLite_Encode ( $vData )',
    params: [
      {
        label: '$vData',
        documentation: 'Data To be encoded (String, Number or Binary)',
      },
    ],
  },
  _SQLite_ErrCode: {
    documentation: 'Returns last error code (numeric)',
    label: '_SQLite_ErrCode ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, default is the last opened database',
      },
    ],
  },
  _SQLite_ErrMsg: {
    documentation:
      'Returns a string describing in english the error condition for the most recent sqlite3_* API call',
    label: '_SQLite_ErrMsg ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, default is the last opened database',
      },
    ],
  },
  _SQLite_Escape: {
    documentation: 'Escapes a string or number for use as TEXT in SQLite statements',
    label: '_SQLite_Escape ( $sString [, $iBuffSize = Default] )',
    params: [
      {
        label: '$sString',
        documentation: 'string to escape',
      },
      {
        label: '$iBuffSize',
        documentation:
          '**[optional]** Size of the escaped string to be returned (Default = complete escaped string)',
      },
    ],
  },
  _SQLite_Exec: {
    documentation: 'Executes a SQLite query, does not handle results',
    label: '_SQLite_Exec ( $hDB, $sSQL [, $sCallBack = ""] )',
    params: [
      {
        label: '$hDB',
        documentation: 'An open database, use -1 to use last opened database',
      },
      {
        label: '$sSQL',
        documentation: 'SQL statement to be executed',
      },
      {
        label: '$sCallback',
        documentation: '**[optional]** if specified the function will be called for each row',
      },
    ],
  },
  _SQLite_FastEncode: {
    documentation: 'Fast encodes binary data (exclusively) for use in SQLite statements',
    label: '_SQLite_FastEncode ( $vData )',
    params: [
      {
        label: '$vData',
        documentation: 'Data To be encoded (Binary only)',
      },
    ],
  },
  _SQLite_FastEscape: {
    documentation: 'Fast escapes a string or number for use as TEXT in SQLite statements',
    label: '_SQLite_FastEscape ( $sString )',
    params: [
      {
        label: '$sString',
        documentation: 'string to escape',
      },
    ],
  },
  _SQLite_FetchData: {
    documentation: 'Fetches 1 row of data from a _SQLite_Query() based query',
    label:
      '_SQLite_FetchData ( $hQuery, ByRef $aRow [, $bBinary = False [, $bDoNotFinalize = False [, $iColumns = 0]]] )',
    params: [
      {
        label: '$hQuery',
        documentation: 'Queryhandle passed out by _SQLite_Query()',
      },
      {
        label: '$aRow',
        documentation: 'A 1 dimensional array containing a row of data',
      },
      {
        label: '$bBinary',
        documentation:
          '**[optional]** Switch for binary mode ($aRow will be an array of binary strings)',
      },
      {
        label: '$bDoNotFinalize',
        documentation:
          "**[optional]** Switch can be set to True if you need to keep the query unfinalized for further use.(It is then the caller's responsability to invoke _SQLite_QueryFinalize() before closing database.)",
      },
      {
        label: '$iColumns',
        documentation: '**[optional]** Number of columns to be returned ((Default = all)',
      },
    ],
  },
  _SQLite_FetchNames: {
    documentation: 'Read out the Column names of a _SQLite_Query() based query',
    label: '_SQLite_FetchNames ( $hQuery, ByRef $aNames )',
    params: [
      {
        label: '$hQuery',
        documentation: 'Query handle generated by SQLite_Query()',
      },
      {
        label: '$aNames',
        documentation: '1 dimensional array containing the Column names',
      },
    ],
  },
  _SQLite_GetTable: {
    documentation:
      'Passes Out a 1Dimensional Array Containing Tablenames and Data of Executed Query',
    label:
      '_SQLite_GetTable ( $hDB, $sSQL, ByRef $aResult, ByRef $iRows, ByRef $iColumns [, $iCharSize = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: 'An open database, use -1 to use last opened database',
      },
      {
        label: '$sSQL',
        documentation: 'SQL Statement to be executed',
      },
      {
        label: '$aResult',
        documentation: 'Passes out the result',
      },
      {
        label: '$iRows',
        documentation: "Passes out the amount of 'data' Rows",
      },
      {
        label: '$iColumns',
        documentation: 'Passes out the amount of columns',
      },
      {
        label: '$iCharSize',
        documentation: '**[optional]** Specifies the maximal size of a data field',
      },
    ],
  },
  _SQLite_GetTable2d: {
    documentation:
      'Passes out a 2Dimensional array containing column names and data of executed query',
    label:
      '_SQLite_GetTable2d ( $hDB, $sSQL, ByRef $aResult, ByRef $iRows, ByRef $iColumns [, $iCharSize = -1 [, $bSwichDimensions = False]] )',
    params: [
      {
        label: '$hDB',
        documentation: 'An Open Database, Use -1 To use Last Opened Database',
      },
      {
        label: '$sSQL',
        documentation: 'SQL Statement to be executed',
      },
      {
        label: '$aResult',
        documentation: 'Passes out the result',
      },
      {
        label: '$iRows',
        documentation: "Passes out the amount of 'data' Rows",
      },
      {
        label: '$iColumns',
        documentation: 'Passes out the amount of columns',
      },
      {
        label: '$iCharSize',
        documentation: '**[optional]** Specifies the maximal size of a data field',
      },
      {
        label: '$bSwichDimensions',
        documentation: '**[optional]** Switches dimensions of $aResult',
      },
    ],
  },
  _SQLite_LastInsertRowID: {
    documentation: 'Returns the ROWID of the most recent insert in the database by this connection',
    label: '_SQLite_LastInsertRowID ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, use -1 to use last opened database',
      },
    ],
  },
  _SQLite_LibVersion: {
    documentation: 'Returns the version number of the library',
    label: '_SQLite_LibVersion (  )',
    params: [],
  },
  _SQLite_Open: {
    documentation: 'Opens/creates a SQLite database',
    label:
      '_SQLite_Open ( [$sDatabase_Filename = ":memory:" [, $iAccessMode = Default [, $iEncoding = $SQLITE_ENCODING_UTF8]]] )',
    params: [
      {
        label: '$sDatabase_Filename',
        documentation: '**[optional]** Database filename, by default will open a memory database.',
      },
      {
        label: '$iAccessMode',
        documentation:
          '**[optional]** access mode flags. Defaults to $SQLITE_OPEN_READWRITE + $SQLITE_OPEN_CREATE',
      },
      {
        label: '$iEncoding',
        documentation:
          '**[optional]** encoding mode flag, only used at creation time. Defaults to $SQLITE_ENCODING_UTF8',
      },
    ],
  },
  _SQLite_Query: {
    documentation: 'Prepares a SQLite Query',
    label: '_SQLite_Query ( $hDB, $sSQL, ByRef $hQuery )',
    params: [
      {
        label: '$hDB',
        documentation: 'An open database, use -1 to use last opened database',
      },
      {
        label: '$sSQL',
        documentation: 'SQL statement to be executed',
      },
      {
        label: '$hQuery',
        documentation: 'Passes out a query handle',
      },
    ],
  },
  _SQLite_QueryFinalize: {
    documentation: 'Finalizes an _SQLite_Query() based query. The query is interrupted',
    label: '_SQLite_QueryFinalize ( $hQuery )',
    params: [
      {
        label: '$hQuery',
        documentation: 'Query handle generated by _SQLite_Query()',
      },
    ],
  },
  _SQLite_QueryReset: {
    documentation: 'Reset a _SQLite_Query() based query',
    label: '_SQLite_QueryReset ( $hQuery )',
    params: [
      {
        label: '$hQuery',
        documentation: 'Query handle generated by _SQLite_Query()',
      },
    ],
  },
  _SQLite_QuerySingleRow: {
    documentation: 'Read out the first row of the result from the specified query',
    label: '_SQLite_QuerySingleRow ( $hDB, $sSQL, ByRef $aRow )',
    params: [
      {
        label: '$hDB',
        documentation: 'An open database, use -1 to use last opened database',
      },
      {
        label: '$sSQL',
        documentation: 'SQL statement to be executed',
      },
      {
        label: '$aRow',
        documentation: "Passes out the amount of 'data' rows",
      },
    ],
  },
  _SQLite_SafeMode: {
    documentation: 'Disable or Enable Safe mode',
    label: '_SQLite_SafeMode ( $bSafeModeState )',
    params: [
      {
        label: '$bSafeModeState',
        documentation: 'True or False to enable or disable SafeMode',
      },
    ],
  },
  _SQLite_SetTimeout: {
    documentation: 'Sets timeout for busy handler',
    label: '_SQLite_SetTimeout ( [$hDB = -1 [, $iTimeout = 1000]] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, use -1 to use last opened database',
      },
      {
        label: '$iTimeout',
        documentation: '**[optional]** Timeout [msec]',
      },
    ],
  },
  _SQLite_Shutdown: {
    documentation: 'Unloads SQLite.dll',
    label: '_SQLite_Shutdown (  )',
    params: [],
  },
  _SQLite_SQLiteExe: {
    documentation: 'Executes commands in sqlite3.exe',
    label:
      '_SQLite_SQLiteExe ( $sDatabaseFile, $sInput, ByRef $sOutput [, $sSQLiteExeFilename = "sqlite3.exe" [, $bDebug = False]] )',
    params: [
      {
        label: '$sDatabaseFile',
        documentation: 'Database filename',
      },
      {
        label: '$sInput',
        documentation: 'Commands for sqlite3.exe',
      },
      {
        label: '$sOutput',
        documentation: 'Raw output from sqlite3.exe',
      },
      {
        label: '$sSQLiteExeFilename',
        documentation: '**[optional]** Path to sqlite3.exe',
      },
      {
        label: '$bDebug',
        documentation:
          "**[optional]** Write sqlite3.exe exitcode through the callback function specified in _SQLite_Startup() (default is don't print)",
      },
    ],
  },
  _SQLite_Startup: {
    documentation: 'Loads SQLite3.dll',
    label:
      '_SQLite_Startup ( [$sDll_Filename = "" [, $bUTF8ErrorMsg = False [, $iForceLocal = 0 [, $hPrintCallback = $__g_hPrintCallback_SQLite]]]] )',
    params: [
      {
        label: '$sDll_Filename',
        documentation:
          '**[optional]** DLL filename. Default is "sqlite3.dll" or "sqlite3_x64.dll" in X64 mode.',
      },
      {
        label: '$bUTF8ErrorMsg',
        documentation: '**[optional]** to force ConsoleWrite() to display UTF8 chars',
      },
      {
        label: '$iForceLocal',
        documentation:
          '**[optional]** 1 = use the defined DLL file. No version checking. Automatic "_x64.dll" in X64 mode.0 = the DLL will be search in @ScriptDir, @SystemDir, @WindowsDir, and @WorkingDir.',
      },
      {
        label: '$hPrintCallback',
        documentation:
          '**[optional]** A variable assigned to the user defined function to display a SQLite diagnostic message. Default = __SQLite_ConsoleWrite(). See remarks.',
      },
    ],
  },
  _SQLite_TotalChanges: {
    documentation:
      'Returns number of all changes (including via triggers and foreign keys) from start of connection',
    label: '_SQLite_TotalChanges ( [$hDB = -1] )',
    params: [
      {
        label: '$hDB',
        documentation: '**[optional]** An open database, default is the last opened database',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
