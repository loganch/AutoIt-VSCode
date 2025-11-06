import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIRes.au3>`)';

const signatures = {
  _WinAPI_CreateCaret: {
    documentation:
      'Creates a new shape for the system caret and assigns ownership of the caret to the specified window',
    label: '_WinAPI_CreateCaret ( $hWnd, $hBitmap [, $iWidth = 0 [, $iHeight = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that owns the caret.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the bitmap that defines the caret shape. If this parameter is 0, the caret is solid. If this parameter is 1, the caret is gray. If this parameter is a bitmap handle, the caret is the specified bitmap.',
      },
      {
        label: '$iWidth',
        documentation:
          'The width of the caret in logical units. If this parameter is 0 (Default), the width is set to the system-defined window border width. If $hBitmap is a bitmap handle, this parameter is ignored.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height of the caret in logical units. If this parameter is 0 (Default), the height is set to the system-defined window border height. If $hBitmap is a bitmap handle, this parameter is ignored.',
      },
    ],
  },
  _WinAPI_DestroyCaret: {
    documentation:
      "Destroys the caret's current shape, frees the caret from the window, and removes the caret from the screen",
    label: '_WinAPI_DestroyCaret ( )',
    params: [],
  },
  _WinAPI_GetCaretBlinkTime: {
    documentation: "Returns the time required to invert the caret's pixels",
    label: '_WinAPI_GetCaretBlinkTime ( )',
    params: [],
  },
  _WinAPI_GetCaretPos: {
    documentation: "Retrieves the caret's position",
    label: '_WinAPI_GetCaretPos ( )',
    params: [],
  },
  _WinAPI_HideCaret: {
    documentation: 'Removes the caret from the screen',
    label: '_WinAPI_HideCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that owns the caret. If this parameter is 0, _WinAPI_HideCaret() searches the current task for the window that owns the caret.',
      },
    ],
  },
  _WinAPI_SetCaretBlinkTime: {
    documentation: 'Sets the caret blink time',
    label: '_WinAPI_SetCaretBlinkTime ( $iDuration )',
    params: [
      {
        label: '$iDuration',
        documentation:
          'The new blink time, in milliseconds. If this parameter is (-1), caret does not blink.',
      },
    ],
  },
  _WinAPI_SetCaretPos: {
    documentation: 'Moves the caret to the specified coordinates',
    label: '_WinAPI_SetCaretPos ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation: 'The new x-coordinate of the caret.',
      },
      {
        label: '$iY',
        documentation: 'The new y-coordinate of the caret.',
      },
    ],
  },
  _WinAPI_ShowCaret: {
    documentation: "Makes the caret visible on the screen at the caret's current position",
    label: '_WinAPI_ShowCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'A handle to the window that owns the caret. If set to 0, the function searches the current task for the window that owns the caret.',
      },
    ],
  },
  _WinAPI_ClipCursor: {
    documentation: 'Confines the cursor to a rectangular area on the screen',
    label: '_WinAPI_ClipCursor ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation:
          'A $tagRECT structure that contains the screen coordinates of the confining rectangle. If this parameter is 0, the cursor is free to move anywhere on the screen.',
      },
    ],
  },
  _WinAPI_CopyCursor: {
    documentation: 'Creates a duplicate of a specified cursor',
    label: '_WinAPI_CopyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Handle to the cursor to be duplicated.',
      },
    ],
  },
  _WinAPI_DestroyCursor: {
    documentation: 'Destroys a cursor and frees any memory the cursor occupied',
    label: '_WinAPI_DestroyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation:
          'A handle to the cursor to be destroyed. The cursor must not currently be in active use.',
      },
    ],
  },
  _WinAPI_GetClipCursor: {
    documentation:
      'Retrieves the screen coordinates of the rectangular area to which the cursor is confined',
    label: '_WinAPI_GetClipCursor ( )',
    params: [],
  },
  _WinAPI_GetCursor: {
    documentation: 'Retrieves a handle to the current cursor',
    label: '_WinAPI_GetCursor ( )',
    params: [],
  },
  _WinAPI_LoadCursor: {
    documentation: 'Loads the specified cursor resource from the executable (.exe) file',
    label: '_WinAPI_LoadCursor ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to an instance of the module whose executable file contains the cursor to be loaded. To use predefined cursors, set this to 0.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the cursor resource or resource identifier to be loaded. When $hInstance is 0, this accepts predefined cursor constants like $OCR_NORMAL, $OCR_IBEAM, $OCR_WAIT, $OCR_CROSS, $OCR_UP, $OCR_SIZE, $OCR_ICON, $OCR_SIZENWSE, $OCR_SIZENESW, $OCR_SIZEWE, $OCR_SIZENS, $OCR_SIZEALL, $OCR_NO, $OCR_HAND, $OCR_APPSTARTING, and $OCR_HELP.',
      },
    ],
  },
  _WinAPI_LoadCursorFromFile: {
    documentation: 'Creates a cursor based on data contained in a file',
    label: '_WinAPI_LoadCursorFromFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The file data to be used to create the cursor. The data in the file must be in either .CUR or .ANI format.',
      },
    ],
  },
  _WinAPI_SetSystemCursor: {
    documentation: 'Enables an application to customize the system cursors',
    label: '_WinAPI_SetSystemCursor ( $hCursor, $iID [, $bCopy = False] )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Handle to a cursor.',
      },
      {
        label: '$iID',
        documentation:
          'Identifies which system cursor to replace. Accepts values like $OCR_NORMAL, $OCR_IBEAM, $OCR_WAIT, $OCR_CROSS, $OCR_UP, $OCR_SIZE, $OCR_ICON, $OCR_SIZENWSE, $OCR_SIZENESW, $OCR_SIZEWE, $OCR_SIZENS, $OCR_SIZEALL, $OCR_ICOCUR, $OCR_NO, $OCR_HAND, $OCR_APPSTARTING, and $OCR_HELP.',
      },
      {
        label: '$bCopy',
        documentation:
          'Specifies whether the cursor should be duplicated. True - The cursor is duplicated. False - The cursor is not duplicated (Default).',
      },
    ],
  },
  _WinAPI_AddIconTransparency: {
    documentation: 'Adds a transparency to the specified 32 bits-per-pixel icon',
    label: '_WinAPI_AddIconTransparency ( $hIcon [, $iPercent = 50 [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon.',
      },
      {
        label: '$iPercent',
        documentation:
          'A value (in percent) that specifies how much to decrease the values of the alpha channel for the specified icon. Default is 80. A value of 0 produces a fully transparent icon.',
      },
      {
        label: '$bDelete',
        documentation:
          'When set to True, the icon is automatically deleted upon successful function completion. When False (Default), the caller must manually release the icon using _WinAPI_DestroyIcon() when finished.',
      },
    ],
  },
  _WinAPI_CreateIcon: {
    documentation: 'Creates an icon that has the specified size, colors, and bit patterns',
    label:
      '_WinAPI_CreateIcon ( $hInstance, $iWidth, $iHeight, $iPlanes, $iBitsPixel, $pANDBits, $pXORBits )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Handle to the instance of the module creating the icon.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in pixels, of the icon.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in pixels, of the icon.',
      },
      {
        label: '$iPlanes',
        documentation: 'The number of planes in the XOR bitmask of the icon.',
      },
      {
        label: '$iBitsPixel',
        documentation: 'The number of bits-per-pixel in the XOR bitmask of the icon.',
      },
      {
        label: '$pANDBits',
        documentation:
          'An array of bytes that contains the bit values for the AND bitmask of the icon. This represents a monochrome bitmap.',
      },
      {
        label: '$pXORBits',
        documentation:
          'An array of bytes that contains the bit values for the XOR bitmask of the icon. This can describe either monochrome or device-dependent color bitmaps.',
      },
    ],
  },
  _WinAPI_CreateIconFromResourceEx: {
    documentation: 'Creates an icon or cursor from resource bits describing the icon',
    label:
      '_WinAPI_CreateIconFromResourceEx ( $pData, $iSize [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData',
        documentation:
          'The icon or cursor resource bits. These bits are typically loaded by calls to the _WinAPI_LookupIconIdFromDirectoryEx() and _WinAPI_LoadResource() functions.',
      },
      {
        label: '$iSize',
        documentation: 'The size, in bytes, of the set of bits pointed to by the $pData parameter.',
      },
      {
        label: '$bIcon',
        documentation:
          'Determines output type: True creates an icon (Default), False creates a cursor.',
      },
      {
        label: '$iXDesiredPixels',
        documentation:
          'The desired width, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value to set the width.',
      },
      {
        label: '$iYDesiredPixels',
        documentation:
          'The desired height, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value to set the height.',
      },
      {
        label: '$iFlags',
        documentation:
          'This parameter can be one or more of the following values: $LR_DEFAULTCOLOR (Default), $LR_DEFAULTSIZE, $LR_MONOCHROME, $LR_SHARED.',
      },
    ],
  },
  _WinAPI_ExtractIcon: {
    documentation: 'Extracts an icon from the specified executable file, DLL, or icon file',
    label: '_WinAPI_ExtractIcon ( $sIcon, $iIndex [, $bSmall = False] )',
    params: [
      {
        label: '$sIcon',
        documentation:
          'The name of an executable file, DLL, or icon file from which icons will be extracted.',
      },
      {
        label: '$iIndex',
        documentation:
          'The 0-based index of the icon to extract. If this value is a negative number, the function extracts the icon whose resource identifier is equal to the absolute value of $iIndex.',
      },
      {
        label: '$bSmall',
        documentation:
          'Specifies whether to extract a small icon. True - Extract a small icon. False - Extract a large icon (Default).',
      },
    ],
  },
  _WinAPI_FileIconInit: {
    documentation: 'Initializes or reinitializes the system image list',
    label: '_WinAPI_FileIconInit ( [$bRestore = True] )',
    params: [
      {
        label: '$bRestore',
        documentation: '**[optional]** Default is True.',
      },
    ],
  },
  _WinAPI_GetIconInfoEx: {
    documentation: 'Retrieves information about the specified icon or cursor',
    label: '_WinAPI_GetIconInfoEx ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation:
          'Handle to the icon or cursor. To retrieve information about a standard icon or cursor, use $OCR_* constants.',
      },
    ],
  },
  _WinAPI_LoadIcon: {
    documentation:
      'Loads the specified icon resource from the executable (.exe) file associated with an application instance',
    label: '_WinAPI_LoadIcon ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'A handle to an instance of the module whose executable file contains the icon to be loaded.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the icon resource to be loaded. Alternatively, if $hInstance is 0, it can be one of the following predefined values: $IDI_APPLICATION, $IDI_HAND, $IDI_QUESTION, $IDI_EXCLAMATION, $IDI_ASTERISK, $IDI_WINLOGO, $IDI_SHIELD, $IDI_ERROR, $IDI_INFORMATION, or $IDI_WARNING.',
      },
    ],
  },
  _WinAPI_LookupIconIdFromDirectoryEx: {
    documentation:
      'Searches through icon or cursor data for the icon or cursor that best fits the current display device',
    label:
      '_WinAPI_LookupIconIdFromDirectoryEx ( $pData [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData',
        documentation:
          'The icon or cursor directory data. Because this function does not validate the resource data, it causes a general protection (GP) fault if invalid data is passed.',
      },
      {
        label: '$bIcon',
        documentation:
          'Determines the resource type being searched. Set to True for icons (Default) or False for cursors.',
      },
      {
        label: '$iXDesiredPixels',
        documentation:
          'The desired width, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value.',
      },
      {
        label: '$iYDesiredPixels',
        documentation:
          'The desired height, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value.',
      },
      {
        label: '$iFlags',
        documentation:
          'Accepts color mode values: $LR_DEFAULTCOLOR (Default) or $LR_MONOCHROME to specify how the icon/cursor should be rendered.',
      },
    ],
  },
  _WinAPI_BeginUpdateResource: {
    documentation:
      'Retrieves a handle that can be used to add, delete, or replace resources in a binary module',
    label: '_WinAPI_BeginUpdateResource ( $sFilePath [, $bDelete = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The binary file in which to update resources. An application must be able to obtain write-access to this file; the file referenced by $sFilePath cannot be currently executing.',
      },
      {
        label: '$bDelete',
        documentation:
          'Indicates whether existing resources should be removed. When set to True, only newly added resources are retained. When False (Default), the updated file preserves all existing resources alongside any new ones.',
      },
    ],
  },
  _WinAPI_EndUpdateResource: {
    documentation: 'Commits or discards a changes of the resources within module',
    label: '_WinAPI_EndUpdateResource ( $hUpdate [, $bDiscard = False] )',
    params: [
      {
        label: '$hUpdate',
        documentation:
          'A module handle returned by the _WinAPI_BeginUpdateResource(), and used by _WinAPI_UpdateResource(), referencing the file to be updated.',
      },
      {
        label: '$bDiscard',
        documentation:
          'Determines the action taken with resource modifications. When set to True, changes are discarded without saving. When False (Default), modifications are committed to the file.',
      },
    ],
  },
  _WinAPI_EnumResourceLanguages: {
    documentation:
      'Enumerates a language-specific resources, of the specified type and name, associated with a binary module',
    label: '_WinAPI_EnumResourceLanguages ( $hModule, $sType, $sName )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched. Also, this parameter can specify the name of the module to load, it must be a full or relative path. It can also be 0 or empty to reference the current process module.',
      },
      {
        label: '$sType',
        documentation:
          'The type of resource for which the language is being enumerated. It can be a string or an integer value representing a predefined resource type.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the resource for which the language is being enumerated. It can be a string or an integer value representing a predefined resource type.',
      },
    ],
  },
  _WinAPI_EnumResourceNames: {
    documentation: 'Enumerates the resources of a specified type within a binary module',
    label: '_WinAPI_EnumResourceNames ( $hModule, $sType )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched. Also, this parameter can specify the name of the module to load, it must be a full or relative path. A value of 0 or empty string refers to the current process module.',
      },
      {
        label: '$sType',
        documentation:
          'The type of the resource for which the name is being enumerated. It can be a string or an integer value representing a predefined resource type.',
      },
    ],
  },
  _WinAPI_EnumResourceTypes: {
    documentation: 'Enumerates the resource types within a binary module',
    label: '_WinAPI_EnumResourceTypes ( $hModule )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched. Also, this parameter can specify the name of the module to load, it must be a full or relative path. When set to 0 or an empty string, it functions as a reference to the module that initialized the current process.',
      },
    ],
  },
  _WinAPI_FindResource: {
    documentation:
      'Determines the location of a resource with the specified type and name in the specified module',
    label: '_WinAPI_FindResource ( $hInstance, $sType, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource. A value of 0 specifies the module handle associated with the image file that the operating system used to create the current process.',
      },
      {
        label: '$sType',
        documentation: 'The type of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$sName',
        documentation: 'The name of the resource. This parameter can be string or integer value.',
      },
    ],
  },
  _WinAPI_FindResourceEx: {
    documentation:
      'Determines the location of the resource with the specified type, name, and language in the specified module',
    label: '_WinAPI_FindResourceEx ( $hInstance, $sType, $sName, $iLanguage )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource. A value of 0 specifies the module handle associated with the image file that the operating system used to create the current process.',
      },
      {
        label: '$sType',
        documentation: 'The type of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$sName',
        documentation: 'The name of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$iLanguage',
        documentation: 'Indicates which language version of the resource to locate.',
      },
    ],
  },
  _WinAPI_FreeResource: {
    documentation: 'Decrements (decreases by one) the reference count of a loaded resource',
    label: '_WinAPI_FreeResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation:
          "A handle to the resource that was previously created by the _WinAPI_LoadResource() function. This parameter identifies which resource's reference count should be decremented.",
      },
    ],
  },
  _WinAPI_GetFileVersionInfo: {
    documentation: 'Retrieves version information for the specified file',
    label: '_WinAPI_GetFileVersionInfo ( $sFilePath, ByRef $pBuffer [, $iFlags = 0] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
      {
        label: 'ByRef $pBuffer',
        documentation:
          'This parameter receives a pointer to a memory block containing file-version information. You may pass 0 to let the function allocate memory automatically, or provide a valid pointer from _WinAPI_CreateBuffer() or a previous call to this function.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that controls which MUI DLLs (if any) from which the version resource is extracted. Valid only for Windows Vista or later. Options include $FILE_VER_GET_LOCALISED, $FILE_VER_GET_NEUTRAL, and $FILE_VER_GET_PREFETCHED. Default is 0.',
      },
    ],
  },
  _WinAPI_LoadIndirectString: {
    documentation: 'Extracts the string from the specified resource when given an indirect string',
    label: '_WinAPI_LoadIndirectString ( $sStrIn )',
    params: [
      {
        label: '$sStrIn',
        documentation:
          "The input indirect string. This parameter accepts a string that may begin with an '@' symbol, following the indirect string format: @filename,resource or @filename,resource;v2. The function processes this input to extract the actual string resource from the specified file.",
      },
    ],
  },
  _WinAPI_LoadResource: {
    documentation: 'Loads the specified resource into global memory',
    label: '_WinAPI_LoadResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource. If this parameter is 0, the system loads the resource from the module that was used to create the current process.',
      },
      {
        label: '$hResource',
        documentation:
          'Handle to the resource to be loaded. This handle is returned by the _WinAPI_FindResource() or _WinAPI_FindResourceEx() function.',
      },
    ],
  },
  _WinAPI_LoadStringEx: {
    documentation: 'Loads a string resource for the specified language from the specified module',
    label: '_WinAPI_LoadStringEx ( $hModule, $iID [, $iLanguage = $LOCALE_USER_DEFAULT] )',
    params: [
      {
        label: '$hModule',
        documentation:
          'A handle to an instance of the module whose executable file contains the string resource. Can also be a file path, or 0/empty string to reference the current process module.',
      },
      {
        label: '$iID',
        documentation: 'The identifier of the string to be loaded.',
      },
      {
        label: '$iLanguage',
        documentation:
          "The language identifier of the string resource of interest. Defaults to $LOCALE_USER_DEFAULT for the user's default language preference.",
      },
    ],
  },
  _WinAPI_LockResource: {
    documentation: 'Locks the specified resource in memory',
    label: '_WinAPI_LockResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation:
          'A handle to the resource requiring memory locking. This handle must be obtained from the _WinAPI_LoadResource() function. Do not pass any value as a parameter other than a successful return value from the LoadResource function.',
      },
    ],
  },
  _WinAPI_SizeOfResource: {
    documentation: 'Returns the size, in bytes, of the specified resource',
    label: '_WinAPI_SizeOfResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Handle to the module whose executable file contains the resource.',
      },
      {
        label: '$hResource',
        documentation:
          'Handle to the resource. This handle must be created by using the _WinAPI_FindResource() or _WinAPI_FindResourceEx() function.',
      },
    ],
  },
  _WinAPI_UpdateResource: {
    documentation: 'Adds, deletes, or replaces a resource in a portable executable (PE) file',
    label: '_WinAPI_UpdateResource ( $hUpdate, $sType, $sName, $iLanguage, $pData, $iSize )',
    params: [
      {
        label: '$hUpdate',
        documentation:
          'A module handle returned by the _WinAPI_BeginUpdateResource(), referencing the file to be updated.',
      },
      {
        label: '$sType',
        documentation:
          "The resource type being modified. Can be a string, integer, or predefined constant (like $RT_*). If the string begins with '#', the remaining characters represent a decimal identifier.",
      },
      {
        label: '$sName',
        documentation:
          'The name of the resource to be updated. This parameter can be string or integer value.',
      },
      {
        label: '$iLanguage',
        documentation: 'The language identifier of the resource.',
      },
      {
        label: '$pData',
        documentation:
          'Raw binary resource data for insertion. Must be valid and properly aligned for predefined types. String/text data must use Unicode format. Pass 0 with $iSize of 0 to delete a resource.',
      },
      {
        label: '$iSize',
        documentation: 'The size, in bytes, of the resource data at $pData.',
      },
    ],
  },
  _WinAPI_VerQueryRoot: {
    documentation:
      'Retrieves the fixed version information from the specified version-information resource',
    label: '_WinAPI_VerQueryRoot ( $pData )',
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the version-information resource returned by the _WinAPI_GetFileVersionInfo() function.',
      },
    ],
  },
  _WinAPI_VerQueryValue: {
    documentation:
      'Retrieves the non-fixed (strings) version information from the specified version-information resource',
    label: "_WinAPI_VerQueryValue ( $pData [, $sValues = ''] )",
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the version-information resource returned by the _WinAPI_GetFileVersionInfo() function.',
      },
      {
        label: '$sValues',
        documentation:
          "An optional input field for specifying which version details to retrieve. When provided as a pipe-separated string (e.g., 'name1|name2'), it returns values for those specific fields. If omitted or left empty, the function defaults to retrieving 12 reserved fields including Comments, CompanyName, FileDescription, FileVersion, InternalName, LegalCopyright, LegalTrademarks, OriginalFilename, ProductName, ProductVersion, PrivateBuild, and SpecialBuild.",
      },
    ],
  },
  _WinAPI_VerQueryValueEx: {
    documentation:
      'Retrieves the text information from the version-information resource of the specified binary module',
    label: "_WinAPI_VerQueryValueEx ( $hModule [, $sValues = '' [, $iLanguage = 0x0400]] )",
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to retrieve information. Also, this parameter can specify the name of the module to load, it must be a full or relative path.',
      },
      {
        label: '$sValues',
        documentation:
          "The string containing the field names for which you want to get values. The names must be separated by a '|'. If left empty, the function defaults to 12 reserved field names including Comments, CompanyName, FileDescription, FileVersion, and others.",
      },
      {
        label: '$iLanguage',
        documentation:
          "This parameter accepts a language identifier for the version-information resource. Users can set it to $LOCALE_USER_DEFAULT to retrieve data matching the current user's language preferences, or use (-1) to retrieve information for all available languages within the resource. Default is 0x0400.",
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
