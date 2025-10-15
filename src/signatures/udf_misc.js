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
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
