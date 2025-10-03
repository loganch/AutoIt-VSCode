import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Misc.au3>`)';

const signatures = {
  _ChooseColor: {
    documentation: 'Creates a Color dialog box that enables the user to select a color',
    label:
      '_ChooseColor ( [$iReturnType = 0 [, $iColorRef = 0 [, $iRefType = 0 [, $hWndOwnder = 0]]]] )',
    params: [
      {
        label: '$iReturnType',
        documentation:
          '**[optional]** Determines return type, valid values:0 - COLORREF rgbcolor1 - BGR hex2 - RGB hex',
      },
      {
        label: '$iColorRef',
        documentation: '**[optional]** Default selected Color',
      },
      {
        label: '$iRefType',
        documentation:
          '**[optional]** Type of $iColorRef passed in, valid values:0 - COLORREF rgbcolor1 - BGR hex2 - RGB hex',
      },
      {
        label: '$hWndOwnder',
        documentation: '**[optional]** Handle to the window that owns the dialog box',
      },
    ],
  },
  _ChooseFont: {
    documentation:
      'Creates a Font dialog box that enables the user to choose attributes for a logical font',
    label:
      '_ChooseFont ( [$sFontName = "Courier New" [, $iPointSize = 10 [, $iFontColorRef = 0 [, $iFontWeight = 0 [, $bItalic = False [, $bUnderline = False [, $bStrikethru = False [, $hWndOwner = 0]]]]]]]] )',
    params: [
      {
        label: '$sFontName',
        documentation: '**[optional]** Default font name',
      },
      {
        label: '$iPointSize',
        documentation: '**[optional]** Pointsize of font',
      },
      {
        label: '$iFontColorRef',
        documentation: '**[optional]** COLORREF rgbColors',
      },
      {
        label: '$iFontWeight',
        documentation: '**[optional]** Font Weight',
      },
      {
        label: '$bItalic',
        documentation: '**[optional]** Italic',
      },
      {
        label: '$bUnderline',
        documentation: '**[optional]** Underline',
      },
      {
        label: '$bStrikethru',
        documentation: '**[optional]** Strikethru',
      },
      {
        label: '$hWndOwner',
        documentation: '**[optional]** Handle to the window that owns the dialog box',
      },
    ],
  },
  _IsPressed: {
    documentation: 'Check if key has been pressed',
    label: "_IsPressed ( $sHexKey [, $vDLL = 'user32.dll'] )",
    params: [
      {
        label: '$sHexKey',
        documentation: 'Key to check for',
      },
      {
        label: '$vDLL',
        documentation: '**[optional]** Handle to DLL or default to user32.dll',
      },
    ],
  },
  _MouseTrap: {
    documentation: 'Confine the Mouse Cursor to specified coords',
    label: '_MouseTrap ( [$iLeft = 0 [, $iTop = 0 [, $iRight = 0 [, $iBottom = 0]]]] )',
    params: [
      {
        label: '$iLeft',
        documentation: '**[optional]** Left coord',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Top coord',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** Right coord',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Bottom coord',
      },
    ],
  },
  _PathFull: {
    documentation:
      'Creates a path based on the relative path you provide. The newly created absolute path is returned',
    label: '_PathFull ( $sRelativePath [, $sBasePath = @WorkingDir] )',
    params: [
      {
        label: '$sRelativePath',
        documentation: 'The relative path to be created',
      },
      {
        label: '$sBasePath',
        documentation: '**[optional]** The base path to be used. Default = @WorkingDir',
      },
    ],
  },
  _PathGetRelative: {
    documentation: 'Returns the relative path to a directory',
    label: '_PathGetRelative ( $sFrom, $sTo )',
    params: [
      {
        label: '$sFrom',
        documentation: 'Path to the source directory',
      },
      {
        label: '$sTo',
        documentation: 'Path to the destination file or directory',
      },
    ],
  },
  _PathMake: {
    documentation: 'Creates a path from drive, directory, file name and file extension parts',
    label: '_PathMake ( $sDrive, $sDir, $sFileName, $sExtension )',
    params: [
      {
        label: '$sDrive',
        documentation: "Drive (Can be UNC). If it's a drive letter, a : is automatically appended",
      },
      {
        label: '$sDir',
        documentation: 'Directory. A trailing and preceding slash are added if not found.',
      },
      {
        label: '$sFileName',
        documentation: 'The name of the file',
      },
      {
        label: '$sExtension',
        documentation: 'The file extension. A period is supplied if not found in the extension',
      },
    ],
  },
  _PathSplit: {
    documentation:
      'Splits a path into the drive, directory, file name and file extension parts. An empty string is set if a part is missing',
    label:
      '_PathSplit ( $sFilePath, ByRef $sDrive, ByRef $sDir, ByRef  $sFileName, ByRef  $sExtension )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be split (Can contain a UNC server or drive letter)',
      },
      {
        label: '$sDrive',
        documentation: 'String to hold the drive',
      },
      {
        label: '$sDir',
        documentation: 'String to hold the directory',
      },
      {
        label: '$sFileName',
        documentation: 'String to hold the file name',
      },
      {
        label: '$sExtension',
        documentation: 'String to hold the file extension',
      },
    ],
  },
  _RunDos: {
    documentation: 'Executes a DOS command in a hidden command window',
    label: '_RunDos ( $sCommand )',
    params: [
      {
        label: '$sCommand',
        documentation: 'Command to execute',
      },
    ],
  },
  _SetDate: {
    documentation: 'Sets the current date of the system',
    label: '_SetDate ( $iDay [, $iMonth = 0 [, $iYear = 0]] )',
    params: [
      {
        label: '$iDay',
        documentation: 'Day of the month. Values: 1-31',
      },
      {
        label: '$iMonth',
        documentation: '**[optional]** month. Values: 1-12',
      },
      {
        label: '$iYear',
        documentation: '**[optional]** year. Values: > 0 (windows might restrict this further!!)',
      },
    ],
  },
  _SetTime: {
    documentation: 'Sets the current time of the system',
    label: '_SetTime ( $iHour, $iMinute [, $iSecond = 0 [, $iMSeconds = 0]] )',
    params: [
      {
        label: '$iHour',
        documentation: 'the hour. Values: 0-23',
      },
      {
        label: '$iMinute',
        documentation: 'the minute. Values: 0-59',
      },
      {
        label: '$iSecond',
        documentation: '**[optional]** the seconds. Values: 0-59',
      },
      {
        label: '$iMSeconds',
        documentation: '**[optional]** the milliseconds. Values: 0-999',
      },
    ],
  },
  _Singleton: {
    documentation: 'Enforce a design paradigm where only one instance of the script may be running',
    label: '_Singleton ( $sOccurrenceName [, $iFlag = 0] )',
    params: [
      {
        label: '$sOccurrenceName',
        documentation:
          'String to identify the occurrence of the script. This string may not contain the \\ character unless you are placing the object in a namespace (See Remarks).',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** Behavior options.0 - Exit the script with the exit code -1 if another instance already exists.1 - Return from the function without exiting the script.2 - Allow the object to be accessed by anybody in the system. This is useful if specifying a "Global\\" object in a multi-user environment.',
      },
    ],
  },
  _VersionCompare: {
    documentation: 'Compares two file versions for equality',
    label: '_VersionCompare ( $sVersion1, $sVersion2 )',
    params: [
      {
        label: '$sVersion1',
        documentation: 'The first version value',
      },
      {
        label: '$sVersion2',
        documentation: 'The second version value',
      },
    ],
  },
  _viClose: {
    documentation: 'Closes a VISA connection to an Instrument/Device',
    label: '_viClose ( $hSession )',
    params: [
      {
        label: '$hSession',
        documentation: 'A VISA session handle as returned by _viOpen()',
      },
    ],
  },
  _viExecCommand: {
    documentation:
      'Send a Command/Query to an Instrument/Device through the VISA interface (GPIB / TCP)',
    label: '_viExecCommand ( $hSession, $sCommand [, $iTimeoutMS = -1 [, $sMode = @LF]] )',
    params: [
      {
        label: '$hSession',
        documentation:
          'A VISA descriptor (STRING) OR a VISA session handle (INTEGER)This it can be a string or an integer (a handle):* STRING -&gr; A VISA DESCRIPTOR is a string which specifies the resource with which to establish a communication session.An example descriptor is "GPIB::20::0".This function supports all valid VISA descriptors, including GPIB, TCP, VXI and Serial Interface instruments (ASRL).A detailed explanation of VISA descriptors is shown in the Remarks section of this function.As a SHORTCUT you can also use a STRING containing the address number (e.g. "20") of a GPIB instrument instead of typing the full descriptor (in that case, "GPIB::20::0")* INTEGER -&gr; A VISA session handle is an integer value returned by _viOpen().It is recommended that instead you use _viOpen() and VISA session handles instead of descriptors if you plan to communicate repeteadly with an Instrument or Device, as otherwise each time that you contact the instrument you would incur the overhead of opening and closing the communication link.Once you are done using the instrument you must remember to close the link with _viClose().',
      },
      {
        label: '$sCommand',
        documentation:
          'Command/Query to execute (e.g. "*IDN?" or "SOURCE:POWER -20 dBM")A query MUST contain a QUESTION MARK (?)When the command is a QUERY the function will automatically wait for the instrument\'s answer (or until the operation times out)',
      },
      {
        label: '$iTimeoutMS',
        documentation:
          '**[optional]** The operation timeout in MILISECONDS.This is mostly important for QUERIES only.If it is not specified the last set timeout will be used. If it was never set before the default timeout (which depends on the VISA implementation) will be used.Timeouts can also be set separatelly with the _viSetTimeout() function.Depending on the bus type (GPIB, TCP, etc) the timeout might not be set to the exact value that you request. Instead the closest valid timeout bigger than the one that you requested will be used.',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** Control the mode in which the VISA viPrintf is called when $sCommand is not a query.Default is @LF, which means "attach @LF mode".Some instruments and in particular many GPIB cards do not honor the terminator character attribute in those cases an @LF terminator needs to be added.As this is the most common case, by default the mode is set to @LF, which appends @LF to the SCPI command you can also set this mode to @CR and @CRLF if your card uses those terminators.If you do not want to use a terminator, set this parameter to an empty string ("")Also, some cards support the execution of a "sprintf" on the SCPI string prior to sending it through the VISA interface.For those who do, it is possible, by setting this parameter to "str" to "protect" the VISa interface from accidentally applying an escape sequence when a "/" is found within the VISA command string.This is normally NOT necessary and should only be set if your GPIB card or instrument require it.',
      },
    ],
  },
  _viFindGpib: {
    documentation:
      'Send a Command/Query to an Instrument/Device through the VISA interface (GPIB / TCP)',
    label: '_viFindGpib ( ByRef $aDescriptorList, ByRef $aIDNList [, $iShow_Search_Results = 0] )',
    params: [
      {
        label: '$aDescriptorList',
        documentation:
          'RETURNS an array of the VISA resource descriptors of the instruments that were found in the GPIB bus (see the Remarks of the _viExecCommand() for more info)',
      },
      {
        label: '$aIDNList',
        documentation:
          'RETURNS an array of the IDNs (i.e names) of the instruments that were found in the GPIB bus',
      },
      {
        label: '$iShow_Search_Results',
        documentation:
          '**[optional]** If 1 a message box showing the results of the search will be shown.The default is 0, which means that the results are not shown',
      },
    ],
  },
  _viGpibBusReset: {
    documentation:
      'GPIB BUS "reset": Use this function when the GPIB BUS gets stuck for some reason. You might be lucky and resolve the problem by calling this function',
    label: '_viGpibBusReset (  )',
    params: [],
  },
  _viGTL: {
    documentation:
      'Go To Local mode: Instruments that accept this command will exit the "Remote Control mode" and go to "Local mode". If the instrument is already in "Local mode" this is simply ignored. Normally, if an instrument does not support this command it will simply stay in the "Remote Control mode"',
    label: '_viGTL ( $hSession )',
    params: [
      {
        label: '$hSession',
        documentation:
          'A VISA descriptor (STRING) OR a VISA session handle (INTEGER).See the Remarks of the _viExecCommand() for more info.',
      },
    ],
  },
  _viInteractiveControl: {
    documentation: 'Interactive VISA control to test your SCPI commands',
    label: '_viInteractiveControl ( [$sCommand_Save_FilePath = ""] )',
    params: [
      {
        label: '$sCommand_Save_FilePath',
        documentation:
          '**[optional]** The name of the file in which the SCPI commands issued during the interactive session will be saved.If no filename is passed the funcion asks the user where does he wants to save the issued commands.',
      },
    ],
  },
  _viOpen: {
    documentation: 'Opens a VISA connection to an Instrument/Device',
    label: '_viOpen ( $sVisa_Address [, $sVisa_Secondary_Address = 0] )',
    params: [
      {
        label: '$sVisa_Address',
        documentation:
          'A VISA resource descriptor STRING (see the NOTES of _viExecCommand() above for more info)As as shortcut you can also directly pass a GPIB address as an integer',
      },
      {
        label: '$sVisa_Secondary_Address',
        documentation:
          '**[optional]** The "secondary GPIB address". Only used if the primary address is passed as an integer.Only some GPIB instruments have secondary addresses. In those cases this optional parameter can be used to specify it.This parameter is ZERO by default, which means NO SECONDARY ADDRESS.',
      },
    ],
  },
  _viSetAttribute: {
    documentation:
      'Set any VISA attribute This function, which is called by _viSetTimeout, can ALSO be used to set the other VISA specific attributes. Read the VISA documentation for more information and a list of VISA attributes and their corresponding values',
    label: '_viSetAttribute ( $hSession, $iAttribute, $iValue )',
    params: [
      {
        label: '$hSession',
        documentation:
          'A VISA descriptor (STRING) OR a VISA session handle (INTEGER).See the Remarks of the _viExecCommand() for more info.',
      },
      {
        label: '$iAttribute',
        documentation:
          'The index of the attribute that must be changed.Attributes are defined in the VISA library.This AutoIt library only defines a CONSTANT for the TIMEOUT attribute ($VI_ATTR_TMO_VALUE) and for the Serial Interface attributes and values (see the remarks) but you can pass any other valid index (as an integer) if you want to.',
      },
      {
        label: '$iValue',
        documentation:
          'The value of the attribute. It must be an integer and the possible values depend on the attribute type and are defined in the VISA documentation.',
      },
    ],
  },
  _viSetTimeout: {
    documentation: 'Sets the VISA timeout in MILISECONDS',
    label: '_viSetTimeout ( $hSession, $iTimeoutMS )',
    params: [
      {
        label: '$hSession',
        documentation:
          'A VISA descriptor (STRING) OR a VISA session handle (INTEGER).See the Remarks of the _viExecCommand() for more info.',
      },
      {
        label: '$iTimeoutMS',
        documentation:
          'The timeout IN MILISECONDS for VISA operations (mainly for GPIB queries)If you set it to 0 the tiemouts are DISABLED.If you set it to "INF" the VISA operations will NEVER timeout.Be careful with this as it could easly hung your program ifv your instrument does not respond to one of your queries.Depending on the bus type (GPIB, TCP, etc) the timeout might not be set to the exact value that you request. Instead the closest valid timeout bigger than the one that you requested will be used.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
