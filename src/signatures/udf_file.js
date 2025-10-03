import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <File.au3>`)';

const signatures = {
  _FileCountLines: {
    documentation: 'Returns the number of lines in the specified file',
    label: '_FileCountLines ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be read',
      },
    ],
  },
  _FileCreate: {
    documentation: "Creates or zero's out the length of the file specified",
    label: '_FileCreate ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be created.',
      },
    ],
  },
  _FileListToArray: {
    documentation:
      'Lists files and\\or folders in a specified folder (Similar to using Dir with the /B Switch)',
    label:
      '_FileListToArray ( $sFilePath [, $sFilter = "*" [, $iFlag = $FLTA_FILESFOLDERS [, $bReturnPath = False]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Folder to generate filelist for.',
      },
      {
        label: '$sFilter',
        documentation:
          '**[optional]** the filter to use, default is *. (* and ? wildcards accepted - See Remarks)',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** specifies whether to return files folders or both    $FLTA_FILESFOLDERS (0) = (Default) Return both files and folders    $FLTA_FILES (1) = Return files only    $FLTA_FOLDERS (2) = Return Folders only    Constants are defined in FileConstants.au3',
      },
      {
        label: '$bReturnPath',
        documentation:
          '**[optional]** If True the full path is appended to the file\\folder path, otherwise it is relative to the $sFilePath folder. Default is False.',
      },
    ],
  },
  _FileListToArrayRec: {
    documentation:
      'Lists files and\\or folders in specified path with optional recursion to defined level and result sorting',
    label:
      '_FileListToArrayRec ( $sFilePath [, $sMask = "*" [, $iReturn = $FLTAR_FILESFOLDERS [, $iRecur = $FLTAR_NORECUR [, $iSort = $FLTAR_NOSORT [, $iReturnPath = $FLTAR_RELPATH]]]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'Initial path used to generate filelist.If path ends in \\ then folders will be returned with an ending \\If path lengths > 260 chars, prefix path with "\\\\?\\" - return paths are not affected',
      },
      {
        label: '$sMask',
        documentation:
          '**[optional]** Filter for result. Multiple filters must be separated by ";"Use "|" to separate 3 possible sets of filters: "Include|Exclude|Exclude_Folders"    Include = Files/Folders to include (default = "*" [all])    Exclude = Files/Folders to exclude (default = "" [none])    Exclude_Folders = only used if $iRecur = 1 AND $iReturn <> 2 to exclude defined folders (default = "" [none])',
      },
      {
        label: '$iReturn',
        documentation:
          '**[optional]** Specifies whether to return files, folders or both and omit those with certain attributes    $FLTAR_FILESFOLDERS (0) - (Default) Return both files and folders    $FLTAR_FILES (1) - Return files only    $FLTAR_FOLDERS (2) - Return Folders onlyAdd one or more of the following to $iReturn to omit files/folders with that attribute    + $FLTAR_NOHIDDEN (4) - Hidden files and folders    + $FLTAR_NOSYSTEM (8) - System files and folders    + $FLTAR_NOLINK (16) - Link/junction folders',
      },
      {
        label: '$iRecur',
        documentation:
          '**[optional]** Specifies whether to search recursively in subfolders and to what level    $FLTAR_NORECUR (0) - Do not search in subfolders (Default)    $FLTAR_RECUR (1) - Search in all subfolders (unlimited recursion)Negative integer - Search in subfolders to specified depth',
      },
      {
        label: '$iSort',
        documentation:
          '**[optional]** Sort results in alphabetical and depth order    $FLTAR_NOSORT (0) - Not sorted (Default)    $FLTAR_SORT (1) - Sorted    $FLTAR_FASTSORT (2) - Sorted with faster algorithm (assumes files in folder returned sorted - requires NTFS and not guaranteed)',
      },
      {
        label: '$iReturnPath',
        documentation:
          '**[optional]** Specifies displayed path of results    $FLTAR_NOPATH (0) - File/folder name only    $FLTAR_RELPATH (1) - Relative to initial path (Default)    $FLTAR_FULLPATH (2) - Full path included',
      },
    ],
  },
  _FilePrint: {
    documentation: 'Prints a plain text file',
    label: '_FilePrint ( $sFilePath [, $iShow = @SW_HIDE] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file to print.',
      },
      {
        label: '$iShow',
        documentation: '**[optional]** The state of the window. (default = @SW_HIDE)',
      },
    ],
  },
  _FileReadToArray: {
    documentation: 'Reads the specified file into a 1D or 2D array',
    label:
      '_FileReadToArray ( $sFilePath, ByRef $vReturn [, $iFlags = $FRTA_COUNT [, $sDelimiter = ""]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be read.',
      },
      {
        label: '$vReturn',
        documentation: 'Variable to hold returned data - does not need to be an array.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** Add multiple values together as required',
      },
      {
        label: '$sDelimiter',
        documentation:
          '**[optional]** Used to further split each line of the file - e.g. reading CSV files into a 2D array',
      },
    ],
  },
  _FileWriteFromArray: {
    documentation: 'Writes an array to a specified file',
    label:
      '_FileWriteFromArray ( $sFilePath, Const ByRef $aArray [, $iBase = Default [, $iUBound = Default [, $sDelimiter = "|"]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path of the file to write to, or a file handle returned by FileOpen().',
      },
      {
        label: '$aArray',
        documentation: 'The array to be written to the specified file.',
      },
      {
        label: '$iBase',
        documentation:
          '**[optional]** Start array index to read, normally set to 0 or 1. Default is 0.',
      },
      {
        label: '$iUbound',
        documentation:
          '**[optional]** Set to the last record you want to write to the File. Default is the whole array.',
      },
      {
        label: '$sDelimiter',
        documentation:
          '**[optional]** Delimiter character(s) for 2-dimension arrays. Default is "|".',
      },
    ],
  },
  _FileWriteLog: {
    documentation: 'Writes current date, time and the specified text to a log file',
    label: '_FileWriteLog ( $sLogPath, $sLogMsg [, $iFlag = -1] )',
    params: [
      {
        label: '$sLogPath',
        documentation: 'Path of the file to write to, or a file handle returned from FileOpen().',
      },
      {
        label: '$sLogMsg',
        documentation: 'Message to be written to the log file',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** Flag that defines if $sLogMsg will be written to the end of file, or to the beginning.If $iFlag = -1 (default) $sLogMsg will be written to the end of file.Otherwise $sLogMsg will be written to beginning of file.',
      },
    ],
  },
  _FileWriteToLine: {
    documentation: 'Writes text to a specific line in a file',
    label: '_FileWriteToLine ( $sFilePath, $iLine, $sText [, $bOverWrite = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file to write to',
      },
      {
        label: '$iLine',
        documentation: 'The line number to write to',
      },
      {
        label: '$sText',
        documentation: 'The text to write',
      },
      {
        label: '$bOverWrite',
        documentation:
          '**[optional]**    True - will overwrite the old line    False - (default) will not overwrite',
      },
    ],
  },
  _ReplaceStringInFile: {
    documentation: 'Replaces substrings in a file',
    label:
      '_ReplaceStringInFile ( $sFilePath, $sSearchString, $sReplaceString [, $iCaseSensitive = 0 [, $iOccurance = 1]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Full path of file to replace substrings.',
      },
      {
        label: '$sSearchString',
        documentation: 'The string to evaluate.',
      },
      {
        label: '$sReplaceString',
        documentation: 'The replacement string.',
      },
      {
        label: '$iCaseSensitive',
        documentation:
          "**[optional]** Flag to indicate if the operations should be case sensitive.    $STR_NOCASESENSE (0) = not case sensitive, using the user's locale (default)    $STR_CASESENSE (1) = case sensitive    $STR_NOCASESENSEBASIC (2) = not case sensitive, using a basic/faster comparisonConstants are defined in StringConstants.au3",
      },
      {
        label: '$iOccurance',
        documentation:
          '**[optional]** 0 - Only the first occurrence is replaced or 1 - all occurrences are replaced (default)',
      },
    ],
  },
  _TempFile: {
    documentation: 'Generate a name for a temporary file. The file is guaranteed not to exist yet',
    label:
      '_TempFile ( [$sDirectoryName = @TempDir [, $sFilePrefix = "~" [, $sFileExtension = ".tmp" [, $iRandomLength = 7]]]] )',
    params: [
      {
        label: '$sDirectoryName',
        documentation:
          '**[optional]** Name of directory for filename, defaults to the users %TEMP% directory',
      },
      {
        label: '$sFilePrefix',
        documentation: '**[optional]** Filename prefix, defaults to "~"',
      },
      {
        label: '$sFileExtension',
        documentation: '**[optional]** File extenstion, defaults to ".tmp"',
      },
      {
        label: '$iRandomLength',
        documentation:
          '**[optional]** Number of characters to use to generate a unique name, defaults to 7',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
