import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIRes.au3>`)';

const signatures = {
  _WinAPI_CreateCaret: {
    documentation: 'Creates a new shape for the system caret and assigns ownership of the caret to the specified window',
    label: '_WinAPI_CreateCaret ( $hWnd, $hBitmap [, $iWidth = 0 [, $iHeight = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hBitmap [, $iWidth',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DestroyCaret: {
    documentation: 'Destroys the caret\'s current shape, frees the caret from the window, and removes the caret from the screen',
    label: '_WinAPI_DestroyCaret ( )',
    params: [

    ],
  },
  _WinAPI_GetCaretBlinkTime: {
    documentation: 'Returns the time required to invert the caret\'s pixels',
    label: '_WinAPI_GetCaretBlinkTime ( )',
    params: [

    ],
  },
  _WinAPI_GetCaretPos: {
    documentation: 'Retrieves the caret\'s position',
    label: '_WinAPI_GetCaretPos ( )',
    params: [

    ],
  },
  _WinAPI_HideCaret: {
    documentation: 'Removes the caret from the screen',
    label: '_WinAPI_HideCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetCaretBlinkTime: {
    documentation: 'Sets the caret blink time',
    label: '_WinAPI_SetCaretBlinkTime ( $iDuration )',
    params: [
      {
        label: '$iDuration',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetCaretPos: {
    documentation: 'Moves the caret to the specified coordinates',
    label: '_WinAPI_SetCaretPos ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ShowCaret: {
    documentation: 'Makes the caret visible on the screen at the caret\'s current position',
    label: '_WinAPI_ShowCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ClipCursor: {
    documentation: 'Confines the cursor to a rectangular area on the screen',
    label: '_WinAPI_ClipCursor ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CopyCursor: {
    documentation: 'Creates a duplicate of a specified cursor',
    label: '_WinAPI_CopyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DestroyCursor: {
    documentation: 'Destroys a cursor and frees any memory the cursor occupied',
    label: '_WinAPI_DestroyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetClipCursor: {
    documentation: 'Retrieves the screen coordinates of the rectangular area to which the cursor is confined',
    label: '_WinAPI_GetClipCursor ( )',
    params: [

    ],
  },
  _WinAPI_GetCursor: {
    documentation: 'Retrieves a handle to the current cursor',
    label: '_WinAPI_GetCursor ( )',
    params: [

    ],
  },
  _WinAPI_LoadCursor: {
    documentation: 'Loads the specified cursor resource from the executable (.exe) file',
    label: '_WinAPI_LoadCursor ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoadCursorFromFile: {
    documentation: 'Creates a cursor based on data contained in a file',
    label: '_WinAPI_LoadCursorFromFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetSystemCursor: {
    documentation: 'Enables an application to customize the system cursors',
    label: '_WinAPI_SetSystemCursor ( $hCursor, $iID [, $bCopy = False] )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Parameter description',
      },
      {
        label: '$iID [, $bCopy',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_AddIconTransparency: {
    documentation: 'Adds a transparency to the specified 32 bits-per-pixel icon',
    label: '_WinAPI_AddIconTransparency ( $hIcon [, $iPercent = 50 [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon [, $iPercent',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateIcon: {
    documentation: 'Creates an icon that has the specified size, colors, and bit patterns',
    label: '_WinAPI_CreateIcon ( $hInstance, $iWidth, $iHeight, $iPlanes, $iBitsPixel, $pANDBits, $pXORBits )',
    params: [
      {
        label: '$hInstance',
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
      {
        label: '$iPlanes',
        documentation: 'Parameter description',
      },
      {
        label: '$iBitsPixel',
        documentation: 'Parameter description',
      },
      {
        label: '$pANDBits',
        documentation: 'Parameter description',
      },
      {
        label: '$pXORBits',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateIconFromResourceEx: {
    documentation: 'Creates an icon or cursor from resource bits describing the icon',
    label: '_WinAPI_CreateIconFromResourceEx ( $pData, $iSize [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize [, $bIcon',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ExtractIcon: {
    documentation: 'Extracts an icon from the specified executable file, DLL, or icon file',
    label: '_WinAPI_ExtractIcon ( $sIcon, $iIndex [, $bSmall = False] )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Parameter description',
      },
      {
        label: '$iIndex [, $bSmall',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FileIconInit: {
    documentation: 'Initializes or reinitializes the system image list',
    label: '_WinAPI_FileIconInit ( [$bRestore = True] )',
    params: [
      {
        label: '$bRestore',
        documentation: '**[optional]** Default is True.',
      }
    ],
  },
  _WinAPI_GetIconInfoEx: {
    documentation: 'Retrieves information about the specified icon or cursor',
    label: '_WinAPI_GetIconInfoEx ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoadIcon: {
    documentation: 'Loads the specified icon resource from the executable (.exe) file associated with an application instance',
    label: '_WinAPI_LoadIcon ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LookupIconIdFromDirectoryEx: {
    documentation: 'Searches through icon or cursor data for the icon or cursor that best fits the current display device',
    label: '_WinAPI_LookupIconIdFromDirectoryEx ( $pData [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData [, $bIcon',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_BeginUpdateResource: {
    documentation: 'Retrieves a handle that can be used to add, delete, or replace resources in a binary module',
    label: '_WinAPI_BeginUpdateResource ( $sFilePath [, $bDelete = False] )',
    params: [
      {
        label: '$sFilePath [, $bDelete',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EndUpdateResource: {
    documentation: 'Commits or discards a changes of the resources within module',
    label: '_WinAPI_EndUpdateResource ( $hUpdate [, $bDiscard = False] )',
    params: [
      {
        label: '$hUpdate [, $bDiscard',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumResourceLanguages: {
    documentation: 'Enumerates a language-specific resources, of the specified type and name, associated with a binary module',
    label: '_WinAPI_EnumResourceLanguages ( $hModule, $sType, $sName )',
    params: [
      {
        label: '$hModule',
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumResourceNames: {
    documentation: 'Enumerates the resources of a specified type within a binary module',
    label: '_WinAPI_EnumResourceNames ( $hModule, $sType )',
    params: [
      {
        label: '$hModule',
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumResourceTypes: {
    documentation: 'Enumerates the resource types within a binary module',
    label: '_WinAPI_EnumResourceTypes ( $hModule )',
    params: [
      {
        label: '$hModule',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FindResource: {
    documentation: 'Determines the location of a resource with the specified type and name in the specified module',
    label: '_WinAPI_FindResource ( $hInstance, $sType, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FindResourceEx: {
    documentation: 'Determines the location of the resource with the specified type, name, and language in the specified module',
    label: '_WinAPI_FindResourceEx ( $hInstance, $sType, $sName, $iLanguage )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      },
      {
        label: '$iLanguage',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FreeResource: {
    documentation: 'Decrements (decreases by one) the reference count of a loaded resource',
    label: '_WinAPI_FreeResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetFileVersionInfo: {
    documentation: 'Retrieves version information for the specified file',
    label: '_WinAPI_GetFileVersionInfo ( $sFilePath, ByRef $pBuffer [, $iFlags = 0] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBuffer [, $iFlags',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoadIndirectString: {
    documentation: 'Extracts the string from the specified resource when given an indirect string',
    label: '_WinAPI_LoadIndirectString ( $sStrIn )',
    params: [
      {
        label: '$sStrIn',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoadResource: {
    documentation: 'Loads the specified resource into global memory',
    label: '_WinAPI_LoadResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$hResource',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoadStringEx: {
    documentation: 'Loads a string resource for the specified language from the specified module',
    label: '_WinAPI_LoadStringEx ( $hModule, $iID [, $iLanguage = $LOCALE_USER_DEFAULT] )',
    params: [
      {
        label: '$hModule',
        documentation: 'Parameter description',
      },
      {
        label: '$iID [, $iLanguage',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LockResource: {
    documentation: 'Locks the specified resource in memory',
    label: '_WinAPI_LockResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SizeOfResource: {
    documentation: 'Returns the size, in bytes, of the specified resource',
    label: '_WinAPI_SizeOfResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Parameter description',
      },
      {
        label: '$hResource',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_UpdateResource: {
    documentation: 'Adds, deletes, or replaces a resource in a portable executable (PE) file',
    label: '_WinAPI_UpdateResource ( $hUpdate, $sType, $sName, $iLanguage, $pData, $iSize )',
    params: [
      {
        label: '$hUpdate',
        documentation: 'Parameter description',
      },
      {
        label: '$sType',
        documentation: 'Parameter description',
      },
      {
        label: '$sName',
        documentation: 'Parameter description',
      },
      {
        label: '$iLanguage',
        documentation: 'Parameter description',
      },
      {
        label: '$pData',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_VerQueryRoot: {
    documentation: 'Retrieves the fixed version information from the specified version-information resource',
    label: '_WinAPI_VerQueryRoot ( $pData )',
    params: [
      {
        label: '$pData',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_VerQueryValue: {
    documentation: 'Retrieves the non-fixed (strings) version information from the specified version-information resource',
    label: '_WinAPI_VerQueryValue ( $pData [, $sValues = \'\'] )',
    params: [
      {
        label: '$pData [, $sValues',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_VerQueryValueEx: {
    documentation: 'Retrieves the text information from the version-information resource of the specified binary module',
    label: '_WinAPI_VerQueryValueEx ( $hModule [, $sValues = \'\' [, $iLanguage = 0x0400]] )',
    params: [
      {
        label: '$hModule [, $sValues',
        documentation: 'Parameter description',
      }
    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
