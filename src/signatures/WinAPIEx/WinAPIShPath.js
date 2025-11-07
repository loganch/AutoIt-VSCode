import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover, opt } from '../../util';

const include = '(Requires: `#include <WinAPIShPath.au3>`)';

const signatures = {
  _WinAPI_CommandLineToArgv: {
    documentation:
      'Parses a command-line string and returns an array of the command-line arguments',
    label: '_WinAPI_CommandLineToArgv ( $sCmd )',
    params: [
      {
        label: '$sCmd',
        documentation:
          'The string that contains the full command line. If this parameter is an empty string the function returns an empty array (zeroth element is 0).',
      },
    ],
  },
  _WinAPI_IsNameInExpression: {
    documentation: 'Determines whether a string matches the specified pattern',
    label: '_WinAPI_IsNameInExpression ( $sString, $sPattern [, $bCaseSensitive = False] )',
    params: [
      {
        label: '$sString',
        documentation:
          'The string to be compared against the pattern. This string cannot contain wildcard characters.',
      },
      {
        label: '$sPattern',
        documentation: 'The pattern string. This string can contain wildcard characters.',
      },
      {
        label: '$bCaseSensitive',
        documentation: `${opt} Specifies whether to treat the string as case sensitive when matching, valid values:\n\nTrue - The case-sensitive matching.\n\nFalse - The case-insensitive matching(Default).`,
      },
    ],
  },
  _WinAPI_ParseURL: {
    documentation: 'Performs rudimentary parsing of a URL',
    label: '_WinAPI_ParseURL ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL to be parsed.',
      },
    ],
  },
  _WinAPI_ParseUserName: {
    documentation: 'Extracts the domain and user account name from a fully qualified user name',
    label: '_WinAPI_ParseUserName ( $sUser )',
    params: [
      {
        label: '$sUser',
        documentation:
          'The user name to be parsed. The name must be in UPN or down-level format, or a certificate.',
      },
    ],
  },
  _WinAPI_PathAddBackslash: {
    documentation:
      'Adds a backslash to the end of a string to create the correct syntax for a path',
    label: '_WinAPI_PathAddBackslash ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to which the backslash will be appended. If this path already has a trailing backslash, no backslash will be added.',
      },
    ],
  },
  _WinAPI_PathAddExtension: {
    documentation: 'Adds a file name extension to a path string',
    label: "_WinAPI_PathAddExtension ( $sFilePath [, $sExt = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to which the file name extension will be appended. If there is already a file name extension present, no extension will be added.',
      },
      {
        label: '$sExt',
        documentation:
          '[optional] The file name extension. If this parameter is empty string, an ".exe" extension will be added.',
      },
    ],
  },
  _WinAPI_PathAppend: {
    documentation: 'Appends one path to the end of another',
    label: '_WinAPI_PathAppend ( $sFilePath, $sMore )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The string to which the path is appended.',
      },
      {
        label: '$sMore',
        documentation: 'The path to be appended.',
      },
    ],
  },
  _WinAPI_PathBuildRoot: {
    documentation: 'Creates a root path from a given drive number',
    label: '_WinAPI_PathBuildRoot ( $iDrive )',
    params: [
      {
        label: '$iDrive',
        documentation: 'The desired drive number. It should be between 0 and 25.',
      },
    ],
  },
  _WinAPI_PathCanonicalize: {
    documentation:
      'Removes elements of a file path according to special strings inserted into that path',
    label: '_WinAPI_PathCanonicalize ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be canonicalized.',
      },
    ],
  },
  _WinAPI_PathCommonPrefix: {
    documentation: 'Compares two paths to determine if they share a common prefix',
    label: '_WinAPI_PathCommonPrefix ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'The first path name.',
      },
      {
        label: '$sPath2',
        documentation: 'The second path name.',
      },
    ],
  },
  _WinAPI_PathCompactPath: {
    documentation:
      'Truncates a file path to fit within a given pixel width by replacing path components with ellipses',
    label: '_WinAPI_PathCompactPath ( $hWnd, $sFilePath [, $iWidth = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window used for font metrics.',
      },
      {
        label: '$sFilePath',
        documentation: 'The path to be modified.',
      },
      {
        label: '$iWidth',
        documentation:
          "[optional] The width, in pixels, in which the string must fit. If this parameter is 0 (Default), width will be equal to the width of the window's client area. If this parameter is a negative number, the width will be decreased to its absolute value.",
      },
    ],
  },
  _WinAPI_PathCompactPathEx: {
    documentation:
      'Truncates a path to fit within a certain number of characters by replacing path components with ellipses',
    label: '_WinAPI_PathCompactPathEx ( $sFilePath, $iMax )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be modified.',
      },
      {
        label: '$iMax',
        documentation: 'The maximum number of characters to be contained in the modified path.',
      },
    ],
  },
  _WinAPI_PathCreateFromUrl: {
    documentation: 'Converts a file URL to a Microsoft MS-DOS path',
    label: '_WinAPI_PathCreateFromUrl ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
    ],
  },
  _WinAPI_PathFindExtension: {
    documentation: 'Searches a path for an extension',
    label: '_WinAPI_PathFindExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to search, including the extension being searched for.',
      },
    ],
  },
  _WinAPI_PathFindFileName: {
    documentation: 'Searches a path for a file name',
    label: '_WinAPI_PathFindFileName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to search.',
      },
    ],
  },
  _WinAPI_PathFindNextComponent: {
    documentation:
      'Parses a path and returns the portion of that path that follows the first backslash',
    label: '_WinAPI_PathFindNextComponent ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to parse. Path components are delimited by backslashes. For instance, the path "c:\\path1\\path2\\file.txt" has four components: c:, path1, path2, and file.txt.',
      },
    ],
  },
  _WinAPI_PathGetArgs: {
    documentation: 'Finds the command-line arguments within a given path',
    label: '_WinAPI_PathGetArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathGetCharType: {
    documentation: 'Determines the type of character in relation to a path',
    label: '_WinAPI_PathGetCharType ( $sChar )',
    params: [
      {
        label: '$sChar',
        documentation: 'The character for which to determine the type.',
      },
    ],
  },
  _WinAPI_PathGetDriveNumber: {
    documentation:
      "Searches a path for a drive letter within the range of 'A' to 'Z' and returns the corresponding drive number",
    label: '_WinAPI_PathGetDriveNumber ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsContentType: {
    documentation:
      "Determines if a file's registered content type matches the specified content type",
    label: '_WinAPI_PathIsContentType ( $sFilePath, $sType )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file whose content type will be compared.',
      },
      {
        label: '$sType',
        documentation:
          'The content type string. For example, "application/x-msdownload", "image/jpeg", "text/plain", etc.',
      },
    ],
  },
  _WinAPI_PathIsExe: {
    documentation: 'Determines whether a file is an executable by examining the file extension',
    label: '_WinAPI_PathIsExe ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsFileSpec: {
    documentation: 'Searches a path for any path-delimiting characters',
    label: '_WinAPI_PathIsFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsLFNFileSpec: {
    documentation: 'Determines whether a file name is in long format',
    label: '_WinAPI_PathIsLFNFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name to be tested.',
      },
    ],
  },
  _WinAPI_PathIsRelative: {
    documentation: 'Searches a path and determines if it is relative',
    label: '_WinAPI_PathIsRelative ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsRoot: {
    documentation: 'Parses a path to determine if it is a directory root',
    label: '_WinAPI_PathIsRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be validated.',
      },
    ],
  },
  _WinAPI_PathIsSameRoot: {
    documentation: 'Compares two paths to determine if they have a common root component',
    label: '_WinAPI_PathIsSameRoot ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'The first path to be compared.',
      },
      {
        label: '$sPath2',
        documentation: 'The second path to be compared.',
      },
    ],
  },
  _WinAPI_PathIsSystemFolder: {
    documentation:
      'Determines if an existing folder contains the attributes that make it a system folder',
    label: '_WinAPI_PathIsSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of an existing folder to check the system folder attributes.',
      },
    ],
  },
  _WinAPI_PathIsUNC: {
    documentation:
      'Determines if the string is a valid Universal Naming Convention (UNC) for a server and share path',
    label: '_WinAPI_PathIsUNC ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathIsUNCServer: {
    documentation:
      'Determines if a string is a valid Universal Naming Convention (UNC) for a server path only',
    label: '_WinAPI_PathIsUNCServer ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathIsUNCServerShare: {
    documentation: 'Determines if a string is a valid Universal Naming Convention (UNC) share path',
    label: '_WinAPI_PathIsUNCServerShare ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathMakeSystemFolder: {
    documentation: 'Gives an existing folder the proper attributes to become a system folder',
    label: '_WinAPI_PathMakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of an existing folder that will be made into a system folder.',
      },
    ],
  },
  _WinAPI_PathMatchSpec: {
    documentation: 'Searches a string using a Microsoft MS-DOS wild card match type',
    label: '_WinAPI_PathMatchSpec ( $sFilePath, $sSpec )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
      {
        label: '$sSpec',
        documentation:
          'The file type for which to search. For example, to test whether $sFilePath is a .doc file, $sSpec should be set to "*.doc".',
      },
    ],
  },
  _WinAPI_PathParseIconLocation: {
    documentation: 'Parses a file location string that contains a file location and icon index',
    label: '_WinAPI_PathParseIconLocation ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path that contains a file location string. It should be in the form "path,iconindex".',
      },
    ],
  },
  _WinAPI_PathRelativePathTo: {
    documentation: 'Creates a relative path from one file or folder to another',
    label: '_WinAPI_PathRelativePathTo ( $sPathFrom, $bDirFrom, $sPathTo, $bDirTo )',
    params: [
      {
        label: '$sPathFrom',
        documentation:
          'The path to the file or directory that defines the start of the relative path.',
      },
      {
        label: '$bDirFrom',
        documentation:
          'Specifies whether is $sPathFrom path to the directory, valid values:     True - Directory.     False - File.',
      },
      {
        label: '$sPathTo',
        documentation:
          'The path to the file or directory that defines the endpoint of the relative path.',
      },
      {
        label: '$bDirTo',
        documentation:
          'Specifies whether is $fDirTo path to the directory, valid values:     True - Directory.     False - File.',
      },
    ],
  },
  _WinAPI_PathRemoveArgs: {
    documentation: 'Removes any arguments from a given path',
    label: '_WinAPI_PathRemoveArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path that contains the path from which to remove arguments.',
      },
    ],
  },
  _WinAPI_PathRemoveBackslash: {
    documentation: 'Removes the trailing backslash from a given path',
    label: '_WinAPI_PathRemoveBackslash ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the backslash.',
      },
    ],
  },
  _WinAPI_PathRemoveExtension: {
    documentation: 'Removes the file name extension from a path, if one is present',
    label: '_WinAPI_PathRemoveExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the extension.',
      },
    ],
  },
  _WinAPI_PathRemoveFileSpec: {
    documentation: 'Removes the trailing file name and backslash from a path, if they are present',
    label: '_WinAPI_PathRemoveFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the file name.',
      },
    ],
  },
  _WinAPI_PathRenameExtension: {
    documentation: 'Replaces the extension of a file name with a new extension',
    label: '_WinAPI_PathRenameExtension ( $sFilePath, $sExt )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path in which to replace the extension.',
      },
      {
        label: '$sExt',
        documentation: 'The string that contains a "." character followed by the new extension.',
      },
    ],
  },
  _WinAPI_PathSearchAndQualify: {
    documentation: 'Formats a path to the fully qualified path',
    label: '_WinAPI_PathSearchAndQualify ( $sFilePath [, $bExists = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be formated.',
      },
      {
        label: '$bExists',
        documentation:
          '[optional] Specifies whether the path should be existing, valid values:     True - The path must be an existing path, otherwise, the function fails.     False - The path may not exist (Default).',
      },
    ],
  },
  _WinAPI_PathSkipRoot: {
    documentation:
      'Parses a path, ignoring the drive letter or Universal Naming Convention (UNC) server/share path elements',
    label: '_WinAPI_PathSkipRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to parse.',
      },
    ],
  },
  _WinAPI_PathStripPath: {
    documentation: 'Removes the path portion of a fully qualified path and file',
    label: '_WinAPI_PathStripPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path and file name.',
      },
    ],
  },
  _WinAPI_PathStripToRoot: {
    documentation: 'Removes all parts of the path except for the root information',
    label: '_WinAPI_PathStripToRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be converted.',
      },
    ],
  },
  _WinAPI_PathUndecorate: {
    documentation: 'Removes the decoration from a path string',
    label: '_WinAPI_PathUndecorate ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path.',
      },
    ],
  },
  _WinAPI_PathUnExpandEnvStrings: {
    documentation:
      'Replaces folder names in a fully-qualified path with their associated environment string',
    label: '_WinAPI_PathUnExpandEnvStrings ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be unexpanded.',
      },
    ],
  },
  _WinAPI_PathUnmakeSystemFolder: {
    documentation: 'Removes the attributes from a folder that make it a system folder',
    label: '_WinAPI_PathUnmakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of an existing folder that will have the system folder attributes removed.',
      },
    ],
  },
  _WinAPI_PathUnquoteSpaces: {
    documentation: 'Removes quotes from the beginning and end of a path',
    label: '_WinAPI_PathUnquoteSpaces ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path.',
      },
    ],
  },
  _WinAPI_PathYetAnotherMakeUniqueName: {
    documentation: 'Creates a unique filename based on an existing filename',
    label: '_WinAPI_PathYetAnotherMakeUniqueName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name that the unique name will be based on.',
      },
    ],
  },
  _WinAPI_ShellGetImageList: {
    documentation: 'Retrieves the system image list for small or large icons',
    label: '_WinAPI_ShellGetImageList ( [$bSmall = False] )',
    params: [
      {
        label: '$bSmall',
        documentation: '**[optional]** Default is False.',
      },
    ],
  },
  _WinAPI_UrlApplyScheme: {
    documentation:
      'Determines a scheme for a specified URL string, and returns a string with an appropriate prefix',
    label: '_WinAPI_UrlApplyScheme ( $sUrl [, $iFlags = 1] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iFlags',
        documentation:
          '[optional] The flags that specify how to determine the scheme. It can be a combination of the following values. $URL_APPLY_DEFAULT (Default) $URL_APPLY_GUESSSCHEME $URL_APPLY_GUESSFILE $URL_APPLY_FORCEAPPLY',
      },
    ],
  },
  _WinAPI_UrlCanonicalize: {
    documentation: 'Converts a URL string into canonical form',
    label: '_WinAPI_UrlCanonicalize ( $sUrl, $iFlags )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify how the URL is to be converted. It can be a combination of the following values.     $URL_DONT_SIMPLIFY     $URL_ESCAPE_PERCENT     $URL_ESCAPE_SPACES_ONLY     $URL_ESCAPE_UNSAFE     $URL_NO_META     $URL_PLUGGABLE_PROTOCOL     $URL_UNESCAPE Windows 7 or later     $URL_ESCAPE_AS_UTF8',
      },
    ],
  },
  _WinAPI_UrlCombine: {
    documentation: 'Combines the base an relative URLs in canonical form',
    label: '_WinAPI_UrlCombine ( $sUrl, $sPart [, $iFlags = 0] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The base URL.',
      },
      {
        label: '$sPart',
        documentation: 'The relative URL.',
      },
      {
        label: '$iFlags',
        documentation:
          '[optional] The flags that specify how the URL is to be converted. It can be a combination of the following values.     $URL_DONT_SIMPLIFY     $URL_ESCAPE_PERCENT     $URL_ESCAPE_SPACES_ONLY     $URL_ESCAPE_UNSAFE     $URL_NO_META     $URL_PLUGGABLE_PROTOCOL     $URL_UNESCAPE Windows 7 or later     $URL_ESCAPE_AS_UTF8',
      },
    ],
  },
  _WinAPI_UrlCompare: {
    documentation: 'Makes a case-sensitive comparison of two URL strings',
    label: '_WinAPI_UrlCompare ( $sUrl1, $sUrl2 [, $bIgnoreSlash = False] )',
    params: [
      {
        label: '$sUrl1',
        documentation: 'The first URL.',
      },
      {
        label: '$sUrl2',
        documentation: 'The second URL.',
      },
      {
        label: '$bIgnoreSlash',
        documentation:
          "[optional] Specifies whether to ignore a trailing '/' character on either or both URLs, valid values:     True - The function ignores a trailing characters.     False - The function takes into account the trailing characters (Default).",
      },
    ],
  },
  _WinAPI_UrlCreateFromPath: {
    documentation: 'Converts a Microsoft MS-DOS path to a canonicalized URL',
    label: '_WinAPI_UrlCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The MS-DOS path.',
      },
    ],
  },
  _WinAPI_UrlFixup: {
    documentation: 'Attempts to correct a URL whose protocol identifier is incorrect',
    label: '_WinAPI_UrlFixup ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL to be corrected.',
      },
    ],
  },
  _WinAPI_UrlGetPart: {
    documentation: 'Retrieves a specified part from the URL',
    label: '_WinAPI_UrlGetPart ( $sUrl, $iPart )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iPart',
        documentation:
          'The part of the URL to retrieve. It can be one of the following values. $URL_PART_HOSTNAME $URL_PART_PASSWORD $URL_PART_PORT $URL_PART_QUERY $URL_PART_SCHEME $URL_PART_USERNAME',
      },
    ],
  },
  _WinAPI_UrlHash: {
    documentation: 'Hashes a URL string',
    label: '_WinAPI_UrlHash ( $sUrl [, $iLength = 32] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iLength',
        documentation:
          '[optional] The length of the hash data, in bytes. It should be no larger than 256, otherwise, the function fails. Default is 32.',
      },
    ],
  },
  _WinAPI_UrlIs: {
    documentation: 'Tests whether or not a URL is a specified type',
    label: '_WinAPI_UrlIs ( $sUrl [, $iType = 0] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iType',
        documentation:
          ' [optional] The type of URL to be tested for. It can be one of the following values. $URLIS_APPLIABLE $URLIS_DIRECTORY $URLIS_FILEURL $URLIS_HASQUERY $URLIS_NOHISTORY $URLIS_OPAQUE $URLIS_URL (Default)',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
