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
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ParseUserName: {
    documentation: 'Extracts the domain and user account name from a fully qualified user name',
    label: '_WinAPI_ParseUserName ( $sUser )',
    params: [
      {
        label: '$sUser',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathAddExtension: {
    documentation: 'Adds a file name extension to a path string',
    label: "_WinAPI_PathAddExtension ( $sFilePath [, $sExt = ''] )",
    params: [
      {
        label: '$sFilePath [, $sExt',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathAppend: {
    documentation: 'Appends one path to the end of another',
    label: '_WinAPI_PathAppend ( $sFilePath, $sMore )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$sMore',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathBuildRoot: {
    documentation: 'Creates a root path from a given drive number',
    label: '_WinAPI_PathBuildRoot ( $iDrive )',
    params: [
      {
        label: '$iDrive',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathCommonPrefix: {
    documentation: 'Compares two paths to determine if they share a common prefix',
    label: '_WinAPI_PathCommonPrefix ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'Parameter description',
      },
      {
        label: '$sPath2',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$sFilePath [, $iWidth',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$iMax',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathCreateFromUrl: {
    documentation: 'Converts a file URL to a Microsoft MS-DOS path',
    label: '_WinAPI_PathCreateFromUrl ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathFindExtension: {
    documentation: 'Searches a path for an extension',
    label: '_WinAPI_PathFindExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathFindFileName: {
    documentation: 'Searches a path for a file name',
    label: '_WinAPI_PathFindFileName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathGetArgs: {
    documentation: 'Finds the command-line arguments within a given path',
    label: '_WinAPI_PathGetArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathGetCharType: {
    documentation: 'Determines the type of character in relation to a path',
    label: '_WinAPI_PathGetCharType ( $sChar )',
    params: [
      {
        label: '$sChar',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsExe: {
    documentation: 'Determines whether a file is an executable by examining the file extension',
    label: '_WinAPI_PathIsExe ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsFileSpec: {
    documentation: 'Searches a path for any path-delimiting characters',
    label: '_WinAPI_PathIsFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsLFNFileSpec: {
    documentation: 'Determines whether a file name is in long format',
    label: '_WinAPI_PathIsLFNFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsRelative: {
    documentation: 'Searches a path and determines if it is relative',
    label: '_WinAPI_PathIsRelative ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsRoot: {
    documentation: 'Parses a path to determine if it is a directory root',
    label: '_WinAPI_PathIsRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsSameRoot: {
    documentation: 'Compares two paths to determine if they have a common root component',
    label: '_WinAPI_PathIsSameRoot ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'Parameter description',
      },
      {
        label: '$sPath2',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathIsUNCServerShare: {
    documentation: 'Determines if a string is a valid Universal Naming Convention (UNC) share path',
    label: '_WinAPI_PathIsUNCServerShare ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathMakeSystemFolder: {
    documentation: 'Gives an existing folder the proper attributes to become a system folder',
    label: '_WinAPI_PathMakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathMatchSpec: {
    documentation: 'Searches a string using a Microsoft MS-DOS wild card match type',
    label: '_WinAPI_PathMatchSpec ( $sFilePath, $sSpec )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$sSpec',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathParseIconLocation: {
    documentation: 'Parses a file location string that contains a file location and icon index',
    label: '_WinAPI_PathParseIconLocation ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRelativePathTo: {
    documentation: 'Creates a relative path from one file or folder to another',
    label: '_WinAPI_PathRelativePathTo ( $sPathFrom, $bDirFrom, $sPathTo, $bDirTo )',
    params: [
      {
        label: '$sPathFrom',
        documentation: 'Parameter description',
      },
      {
        label: '$bDirFrom',
        documentation: 'Parameter description',
      },
      {
        label: '$sPathTo',
        documentation: 'Parameter description',
      },
      {
        label: '$bDirTo',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRemoveArgs: {
    documentation: 'Removes any arguments from a given path',
    label: '_WinAPI_PathRemoveArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRemoveBackslash: {
    documentation: 'Removes the trailing backslash from a given path',
    label: '_WinAPI_PathRemoveBackslash ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRemoveExtension: {
    documentation: 'Removes the file name extension from a path, if one is present',
    label: '_WinAPI_PathRemoveExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRemoveFileSpec: {
    documentation: 'Removes the trailing file name and backslash from a path, if they are present',
    label: '_WinAPI_PathRemoveFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathRenameExtension: {
    documentation: 'Replaces the extension of a file name with a new extension',
    label: '_WinAPI_PathRenameExtension ( $sFilePath, $sExt )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$sExt',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathSearchAndQualify: {
    documentation: 'Formats a path to the fully qualified path',
    label: '_WinAPI_PathSearchAndQualify ( $sFilePath [, $bExists = False] )',
    params: [
      {
        label: '$sFilePath [, $bExists',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathStripPath: {
    documentation: 'Removes the path portion of a fully qualified path and file',
    label: '_WinAPI_PathStripPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathStripToRoot: {
    documentation: 'Removes all parts of the path except for the root information',
    label: '_WinAPI_PathStripToRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathUndecorate: {
    documentation: 'Removes the decoration from a path string',
    label: '_WinAPI_PathUndecorate ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
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
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathUnmakeSystemFolder: {
    documentation: 'Removes the attributes from a folder that make it a system folder',
    label: '_WinAPI_PathUnmakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathUnquoteSpaces: {
    documentation: 'Removes quotes from the beginning and end of a path',
    label: '_WinAPI_PathUnquoteSpaces ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathYetAnotherMakeUniqueName: {
    documentation: 'Creates a unique filename based on an existing filename',
    label: '_WinAPI_PathYetAnotherMakeUniqueName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
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
        label: '$sUrl [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlCanonicalize: {
    documentation: 'Converts a URL string into canonical form',
    label: '_WinAPI_UrlCanonicalize ( $sUrl, $iFlags )',
    params: [
      {
        label: '$sUrl',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlCombine: {
    documentation: 'Combines the base an relative URLs in canonical form',
    label: '_WinAPI_UrlCombine ( $sUrl, $sPart [, $iFlags = 0] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'Parameter description',
      },
      {
        label: '$sPart [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlCompare: {
    documentation: 'Makes a case-sensitive comparison of two URL strings',
    label: '_WinAPI_UrlCompare ( $sUrl1, $sUrl2 [, $bIgnoreSlash = False] )',
    params: [
      {
        label: '$sUrl1',
        documentation: 'Parameter description',
      },
      {
        label: '$sUrl2 [, $bIgnoreSlash',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlCreateFromPath: {
    documentation: 'Converts a Microsoft MS-DOS path to a canonicalized URL',
    label: '_WinAPI_UrlCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlFixup: {
    documentation: 'Attempts to correct a URL whose protocol identifier is incorrect',
    label: '_WinAPI_UrlFixup ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlGetPart: {
    documentation: 'Retrieves a specified part from the URL',
    label: '_WinAPI_UrlGetPart ( $sUrl, $iPart )',
    params: [
      {
        label: '$sUrl',
        documentation: 'Parameter description',
      },
      {
        label: '$iPart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlHash: {
    documentation: 'Hashes a URL string',
    label: '_WinAPI_UrlHash ( $sUrl [, $iLength = 32] )',
    params: [
      {
        label: '$sUrl [, $iLength',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UrlIs: {
    documentation: 'Tests whether or not a URL is a specified type',
    label: '_WinAPI_UrlIs ( $sUrl [, $iType = 0] )',
    params: [
      {
        label: '$sUrl [, $iType',
        documentation: 'Parameter description',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
