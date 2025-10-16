import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIGdi.au3>`)';

const signatures = {
  _WinAPI_CreateDIB: {
    documentation:
      'Creates an uncompressed device-independent bitmap (DIB) with the specified width, height, and color depth',
    label:
      '_WinAPI_CreateDIB ( $iWidth, $iHeight [, $iBitsPerPel = 32 [, $tColorTable = 0 [, $iColorCount = 0]]] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight [, $iBitsPerPel',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AdjustBitmap: {
    documentation:
      'Creates a new device-depended bitmap (DDB) from the source bitmap with new dimensions and color adjustment',
    label:
      '_WinAPI_AdjustBitmap ( $hBitmap, $iWidth, $iHeight [, $iMode = 3 [, $tAdjustment = 0]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight [, $iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AlphaBlend: {
    documentation: 'Displays bitmaps that have transparent or semitransparent pixels',
    label:
      '_WinAPI_AlphaBlend ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iAlpha [, $bAlpha = False] )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightDest',
        documentation: 'Parameter description',
      },
      {
        label: '$hSrcDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iAlpha [, $bAlpha',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CompressBitmapBits: {
    documentation: 'Creates a compressed data block from the specified bitmap',
    label:
      '_WinAPI_CompressBitmapBits ( $hBitmap, ByRef $pBuffer [, $iCompression = 0 [, $iQuality = 100]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBuffer [, $iCompression',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CopyBitmap: {
    documentation:
      'Creates a duplicate of a specified bitmap with a device-independent bitmap (DIB) section',
    label: '_WinAPI_CopyBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CopyImage: {
    documentation:
      'Creates a new image (icon, cursor, or bitmap) and copies the attributes of the specified image to the new one',
    label:
      '_WinAPI_CopyImage ( $hImage [, $iType = 0 [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$hImage [, $iType',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Create32BitHBITMAP: {
    documentation: 'Creates a 32 bits-per-pixel bitmap from the specified icon',
    label: '_WinAPI_Create32BitHBITMAP ( $hIcon [, $bDib = False [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon [, $bDib',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Create32BitHICON: {
    documentation: 'Converts an icon to a 32 bits-per-pixel format and copies to the new icon',
    label: '_WinAPI_Create32BitHICON ( $hIcon [, $bDelete = False] )',
    params: [
      {
        label: '$hIcon [, $bDelete',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateANDBitmap: {
    documentation: 'Creates AND bitmask device-independent bitmap (DIB) from the specified bitmap',
    label: '_WinAPI_CreateANDBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateBitmapIndirect: {
    documentation:
      'Creates a bitmap with the specified width, height, and color format (color planes and bits-per-pixel)',
    label: '_WinAPI_CreateBitmapIndirect ( $tBITMAP )',
    params: [
      {
        label: '$tBITMAP',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateCompatibleBitmapEx: {
    documentation: 'Creates a bitmap compatible with the device and fills it the specified color',
    label: '_WinAPI_CreateCompatibleBitmapEx ( $hDC, $iWidth, $iHeight, $iRGB )',
    params: [
      {
        label: '$hDC',
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
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateDIBColorTable: {
    documentation: 'Creates RGB color table from the specified array of colors',
    label:
      '_WinAPI_CreateDIBColorTable ( Const ByRef $aColorTable [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: 'Const ByRef $aColorTable [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateDIBitmap: {
    documentation:
      'Creates a compatible bitmap (DDB) from a DIB and, optionally, sets the bitmap bits',
    label: '_WinAPI_CreateDIBitmap ( $hDC, $tBITMAPINFO, $iUsage [, $pBits = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Parameter description',
      },
      {
        label: '$iUsage [, $pBits',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateDIBSection: {
    documentation: 'Creates a DIB that applications can write to directly',
    label:
      '_WinAPI_CreateDIBSection ( $hDC, $tBITMAPINFO, $iUsage, ByRef $pBits [, $hSection = 0 [, $iOffset = 0]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Parameter description',
      },
      {
        label: '$iUsage',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBits [, $hSection',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateEmptyIcon: {
    documentation:
      'Creates a fully transparent icon with the specified width, height, and color depth',
    label: '_WinAPI_CreateEmptyIcon ( $iWidth, $iHeight [, $iBitsPerPel = 32] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight [, $iBitsPerPel',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateIconIndirect: {
    documentation:
      'Creates an icon or cursor that has the specified size, colors, and bit patterns',
    label:
      '_WinAPI_CreateIconIndirect ( $hBitmap, $hMask [, $iXHotspot = 0 [, $iYHotspot = 0 [, $bIcon = True]]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: '$hMask [, $iXHotspot',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DrawBitmap: {
    documentation: 'Draws a bitmap into the specified device context',
    label: '_WinAPI_DrawBitmap ( $hDC, $iX, $iY, $hBitmap [, $iRop = 0x00CC0020] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$hBitmap [, $iRop',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ExtFloodFill: {
    documentation: 'Fills an area of the display surface with the current brush',
    label: '_WinAPI_ExtFloodFill ( $hDC, $iX, $iY, $iRGB [, $iType = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB [, $iType',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBitmapBits: {
    documentation: 'Copies the bitmap bits of a specified device-dependent bitmap into a buffer',
    label: '_WinAPI_GetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize',
        documentation: 'Parameter description',
      },
      {
        label: '$pBits',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBitmapDimension: {
    documentation: 'Retrieves a dimension of the specified bitmap',
    label: '_WinAPI_GetBitmapDimension ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBitmapDimensionEx: {
    documentation: 'Retrieves the dimensions of a compatible bitmap',
    label: '_WinAPI_GetBitmapDimensionEx ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetDIBColorTable: {
    documentation: 'Retrieves RGB color table from the DIB section bitmap',
    label: '_WinAPI_GetDIBColorTable ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetIconDimension: {
    documentation: 'Retrieves a dimension of the specified icon',
    label: '_WinAPI_GetIconDimension ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetPixel: {
    documentation: 'Retrieves the color value of the pixel at the specified coordinates',
    label: '_WinAPI_GetPixel ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetStretchBltMode: {
    documentation: 'Retrieves the current stretching mode',
    label: '_WinAPI_GetStretchBltMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GradientFill: {
    documentation: 'Fills rectangle or triangle gradient',
    label:
      '_WinAPI_GradientFill ( $hDC, Const ByRef $aVertex [, $iStart = 0 [, $iEnd = -1 [, $bRotate = False]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aVertex [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_InvertANDBitmap: {
    documentation: 'Inverts the specified AND bitmask bitmap by performing a logical NOT operation',
    label: '_WinAPI_InvertANDBitmap ( $hBitmap [, $bDelete = False] )',
    params: [
      {
        label: '$hBitmap [, $bDelete',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_IsAlphaBitmap: {
    documentation: 'Determines whether the specified bitmap has an alpha channel',
    label: '_WinAPI_IsAlphaBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_MaskBlt: {
    documentation:
      'Combines the color data for the source and destination bitmaps using the specified mask and raster operation',
    label:
      '_WinAPI_MaskBlt ( $hDestDC, $iXDest, $iYDest, $iWidth, $iHeight, $hSrcDC, $iXSrc, $iYSrc, $hMask, $iXMask, $iYMask, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
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
        label: '$hSrcDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$hMask',
        documentation: 'Parameter description',
      },
      {
        label: '$iXMask',
        documentation: 'Parameter description',
      },
      {
        label: '$iYMask',
        documentation: 'Parameter description',
      },
      {
        label: '$iRop',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PlgBlt: {
    documentation:
      'Performs a bit-block transfer of color data from the specified rectangle in the source DC to the specified parallelogram in the DC context',
    label:
      '_WinAPI_PlgBlt ( $hDestDC, Const ByRef $aPoint, $hSrcDC, $iXSrc, $iYSrc, $iWidth, $iHeight [, $hMask = 0 [, $iXMask = 0 [, $iYMask = 0]]] )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aPoint',
        documentation: 'Parameter description',
      },
      {
        label: '$hSrcDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight [, $hMask',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RadialGradientFill: {
    documentation: 'Fills radial gradient',
    label:
      '_WinAPI_RadialGradientFill ( $hDC, $iX, $iY, $iRadius, $iRGB1, $iRGB2 [, $fAngleStart = 0 [, $fAngleEnd = 360 [, $fStep = 5]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iRadius',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB1',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB2 [, $fAngleStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SaveHBITMAPToFile: {
    documentation: 'Saves a specified bitmap to the specified bitmap (.bmp) file',
    label:
      '_WinAPI_SaveHBITMAPToFile ( $sFilePath, $hBitmap [, $iXPelsPerMeter = Default [, $iYPelsPerMeter = Default]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: '$hBitmap [, $iXPelsPerMeter',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SaveHICONToFile: {
    documentation:
      'Saves a specified single or multiple icon (HICON) to the specified icon (.ico) file',
    label:
      '_WinAPI_SaveHICONToFile ( $sFilePath, Const ByRef $vIcon [, $bCompress = 0 [, $iStart = 0 [, $iEnd = -1]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $vIcon [, $bCompress',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetBitmapBits: {
    documentation: 'Sets the bits of color data for a bitmap to the specified values',
    label: '_WinAPI_SetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize',
        documentation: 'Parameter description',
      },
      {
        label: '$pBits',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetBitmapDimensionEx: {
    documentation: 'Assigns preferred dimensions to a compatible bitmap',
    label: '_WinAPI_SetBitmapDimensionEx ( $hBitmap, $iWidth, $iHeight )',
    params: [
      {
        label: '$hBitmap',
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
  _WinAPI_SetDIBColorTable: {
    documentation: 'Sets RGB color table in the DIB section bitmap',
    label: '_WinAPI_SetDIBColorTable ( $hBitmap, $tColorTable, $iColorCount )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Parameter description',
      },
      {
        label: '$tColorTable',
        documentation: 'Parameter description',
      },
      {
        label: '$iColorCount',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetDIBitsToDevice: {
    documentation: 'Sets the pixels in the specified rectangle on the device',
    label:
      '_WinAPI_SetDIBitsToDevice ( $hDC, $iXDest, $iYDest, $iWidth, $iHeight, $iXSrc, $iYSrc, $iStartScan, $iScanLines, $tBITMAPINFO, $iUsage, $pBits )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
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
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iStartScan',
        documentation: 'Parameter description',
      },
      {
        label: '$iScanLines',
        documentation: 'Parameter description',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Parameter description',
      },
      {
        label: '$iUsage',
        documentation: 'Parameter description',
      },
      {
        label: '$pBits',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetPixel: {
    documentation: 'Sets the pixel at the specified coordinates to the specified color',
    label: '_WinAPI_SetPixel ( $hDC, $iX, $iY, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetStretchBltMode: {
    documentation: 'Sets the bitmap stretching mode in the specified device context',
    label: '_WinAPI_SetStretchBltMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_StretchBlt: {
    documentation:
      'Copies a bitmap from a source rectangle into a destination rectangle, stretching or compressing the bitmap to fit the dimensions of the destination rectangle',
    label:
      '_WinAPI_StretchBlt ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightDest',
        documentation: 'Parameter description',
      },
      {
        label: '$hSrcDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iRop',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_StretchDIBits: {
    documentation:
      'Copies the color data for a rectangle of pixels in a DIB, JPEG, or PNG image to the specified destination rectangle, stretching or compressing the rows and columns by using the specified raster operation',
    label:
      '_WinAPI_StretchDIBits ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $tBITMAPINFO, $iUsage, $pBits, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Parameter description',
      },
      {
        label: '$iUsage',
        documentation: 'Parameter description',
      },
      {
        label: '$pBits',
        documentation: 'Parameter description',
      },
      {
        label: '$iRop',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_TransparentBlt: {
    documentation:
      'Performs a bit-block transfer of the color data corresponding to a rectangle of pixels',
    label:
      '_WinAPI_TransparentBlt ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iRGB )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthDest',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightDest',
        documentation: 'Parameter description',
      },
      {
        label: '$hSrcDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidthSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeightSrc',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateBrushIndirect: {
    documentation: 'Creates a logical brush that has the specified style, color, and pattern',
    label: '_WinAPI_CreateBrushIndirect ( $iStyle, $iRGB [, $iHatch = 0] )',
    params: [
      {
        label: '$iStyle',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB [, $iHatch',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ExtCreatePen: {
    documentation:
      'Creates a logical cosmetic or geometric pen that has the specified style, width, and brush attributes',
    label:
      '_WinAPI_ExtCreatePen ( $iPenStyle, $iWidth, $iBrushStyle, $iRGB [, $iHatch = 0 [, $aUserStyle = 0 [, $iStart = 0 [, $iEnd = -1]]]] )',
    params: [
      {
        label: '$iPenStyle',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iBrushStyle',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB [, $iHatch',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBrushOrg: {
    documentation: 'Retrieves the current brush origin for the specified device context',
    label: '_WinAPI_GetBrushOrg ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PatBlt: {
    documentation:
      'Paints the specified rectangle using the brush that is currently selected into the specified device context',
    label: '_WinAPI_PatBlt ( $hDC, $iX, $iY, $iWidth, $iHeight, $iRop )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
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
        label: '$iRop',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetBrushOrg: {
    documentation:
      'Sets the brush origin that GDI assigns to the next brush an application selects into the specified device context',
    label: '_WinAPI_SetBrushOrg ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetDCBrushColor: {
    documentation: 'Sets the current device context (DC) brush color to the specified color value',
    label: '_WinAPI_SetDCBrushColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetDCPenColor: {
    documentation: 'Sets the current device context (DC) pen color to the specified color value',
    label: '_WinAPI_SetDCPenColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ExcludeClipRect: {
    documentation:
      'Creates a new clipping region that consists of the existing clipping region minus the specified rectangle',
    label: '_WinAPI_ExcludeClipRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ExtSelectClipRgn: {
    documentation: 'Combines the specified region with the current clipping region',
    label: '_WinAPI_ExtSelectClipRgn ( $hDC, $hRgn [, $iMode = 5] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn [, $iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetClipBox: {
    documentation: 'Retrieves the dimensions of the bounding rectangle of the visible area',
    label: '_WinAPI_GetClipBox ( $hDC, ByRef $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetClipRgn: {
    documentation: 'Retrieves a handle identifying the current application-defined clipping region',
    label: '_WinAPI_GetClipRgn ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_IntersectClipRect: {
    documentation:
      'Creates a new clipping region from the intersection of the current clipping region and the specified rectangle',
    label: '_WinAPI_IntersectClipRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OffsetClipRgn: {
    documentation: 'Moves the clipping region of a device context by the specified offsets',
    label: '_WinAPI_OffsetClipRgn ( $hDC, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXOffset',
        documentation: 'Parameter description',
      },
      {
        label: '$iYOffset',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PtVisible: {
    documentation: 'Determines whether the specified point is within the clipping region',
    label: '_WinAPI_PtVisible ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RectVisible: {
    documentation:
      'Determines whether any part of the specified rectangle lies within the clipping region',
    label: '_WinAPI_RectVisible ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SelectClipPath: {
    documentation:
      'Selects the current path as a clipping region, combining the new region with any existing clipping region',
    label: '_WinAPI_SelectClipPath ( $hDC [, $iMode = 5] )',
    params: [
      {
        label: '$hDC [, $iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SelectClipRgn: {
    documentation:
      'Selects a region as the current clipping region for the specified device context',
    label: '_WinAPI_SelectClipRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ColorAdjustLuma: {
    documentation: 'Changes the luminance of a RGB value',
    label: '_WinAPI_ColorAdjustLuma ( $iRGB, $iPercent [, $bScale = True] )',
    params: [
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
      {
        label: '$iPercent [, $bScale',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ColorHLSToRGB: {
    documentation: 'Converts colors from hue-luminance-saturation (HLS) to RGB format',
    label: '_WinAPI_ColorHLSToRGB ( $iHue, $iLuminance, $iSaturation )',
    params: [
      {
        label: '$iHue',
        documentation: 'Parameter description',
      },
      {
        label: '$iLuminance',
        documentation: 'Parameter description',
      },
      {
        label: '$iSaturation',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ColorRGBToHLS: {
    documentation: 'Converts colors from RGB to hue-luminance-saturation (HLS) format',
    label: '_WinAPI_ColorRGBToHLS ( $iRGB, ByRef $iHue, ByRef $iLuminance, ByRef $iSaturation )',
    params: [
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $iHue',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $iLuminance',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $iSaturation',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateColorAdjustment: {
    documentation: 'Creates $tagCOLORADJUSTMENT structure specifies the color adjustment',
    label:
      '_WinAPI_CreateColorAdjustment ( [$iFlags = 0 [, $iIlluminant = 0 [, $iGammaR = 10000 [, $iGammaG = 10000 [, $iGammaB = 10000 [, $iBlack = 0 [, $iWhite = 10000 [, $iContrast = 0 [, $iBrightness = 0 [, $iColorfulness = 0 [, $iTint = 0]]]]]]]]]]] )',
    params: [
      {
        label: '$iFlags',
        documentation: '**[optional]** Default is 0 [, $iIlluminant.',
      },
    ],
  },
  _WinAPI_GetBValue: {
    documentation: 'Retrieves an intensity value for the blue component of a 32-bit RGB value',
    label: '_WinAPI_GetBValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetColorAdjustment: {
    documentation: 'Retrieves the color adjustment for the specified device context (DC)',
    label: '_WinAPI_GetColorAdjustment ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetDeviceGammaRamp: {
    documentation:
      'Gets the gamma ramp on direct color display boards that support downloadable gamma ramps in hardware',
    label: '_WinAPI_GetDeviceGammaRamp ( $hDC, ByRef $aRamp )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $aRamp',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetGValue: {
    documentation: 'Retrieves an intensity value for the green component of a 32-bit RGB value',
    label: '_WinAPI_GetGValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetRValue: {
    documentation: 'Retrieves an intensity value for the red component of a 32-bit RGB value',
    label: '_WinAPI_GetRValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetUDFColorMode: {
    documentation: 'Retrieves the current color mode for WinAPIEx UDF library',
    label: '_WinAPI_GetUDFColorMode ( )',
    params: [],
  },
  _WinAPI_InvertColor: {
    documentation: 'Inverts (negative) the specified color',
    label: '_WinAPI_InvertColor ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RGB: {
    documentation: 'Creates a RGB color value based on red, green, and blue components',
    label: '_WinAPI_RGB ( $iRed, $iGreen, $iBlue )',
    params: [
      {
        label: '$iRed',
        documentation: 'Parameter description',
      },
      {
        label: '$iGreen',
        documentation: 'Parameter description',
      },
      {
        label: '$iBlue',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetColorAdjustment: {
    documentation: 'Sets the color adjustment for a device context (DC)',
    label: '_WinAPI_SetColorAdjustment ( $hDC, $tAdjustment )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tAdjustment',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetDeviceGammaRamp: {
    documentation:
      'Sets the gamma ramp on direct color display boards that support downloadable gamma ramps in hardware',
    label: '_WinAPI_SetDeviceGammaRamp ( $hDC, Const ByRef $aRamp )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aRamp',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetUDFColorMode: {
    documentation: 'Sets the color mode for the WinAPIEx library',
    label: '_WinAPI_SetUDFColorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SwitchColor: {
    documentation: 'Converts a color from BGR to RGB and vice versa',
    label: '_WinAPI_SwitchColor ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CombineTransform: {
    documentation: 'Concatenates two world-space to page-space transformations',
    label: '_WinAPI_CombineTransform ( $tXFORM1, $tXFORM2 )',
    params: [
      {
        label: '$tXFORM1',
        documentation: 'Parameter description',
      },
      {
        label: '$tXFORM2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateTransform: {
    documentation:
      'Creates $tagXFORM structure specifies a world-space to page-space transformation',
    label:
      '_WinAPI_CreateTransform ( [$nM11 = 1 [, $nM12 = 0 [, $nM21 = 0 [, $nM22 = 1 [, $nDX = 0 [, $nDY = 0]]]]]] )',
    params: [
      {
        label: '$nM11',
        documentation: '**[optional]** Default is 1 [, $nM12.',
      },
    ],
  },
  _WinAPI_DPtoLP: {
    documentation: 'Converts device coordinates into logical coordinates',
    label: '_WinAPI_DPtoLP ( $hDC, ByRef $tPOINT [, $iCount = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tPOINT [, $iCount',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetCurrentPosition: {
    documentation: 'Retrieves the current position for the specified device context',
    label: '_WinAPI_GetCurrentPosition ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetGraphicsMode: {
    documentation: 'Retrieves the current graphics mode for the specified device context',
    label: '_WinAPI_GetGraphicsMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetMapMode: {
    documentation: 'Retrieves the current mapping mode',
    label: '_WinAPI_GetMapMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetPosFromRect: {
    documentation: 'Interprets the coordinates of the rectangle as offset and position coordinates',
    label: '_WinAPI_GetPosFromRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetWindowExt: {
    documentation:
      'Retrieves the x-extent and y-extent of the window for the specified device context',
    label: '_WinAPI_GetWindowExt ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetWindowOrg: {
    documentation:
      'Retrieves the x-coordinates and y-coordinates of the window origin for the specified device context',
    label: '_WinAPI_GetWindowOrg ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetWorldTransform: {
    documentation: 'Retrieves the current world-space to page-space transformation',
    label: '_WinAPI_GetWorldTransform ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_LPtoDP: {
    documentation: 'Converts a logical coordinates into device coordinates',
    label: '_WinAPI_LPtoDP ( $hDC, ByRef $tPOINT [, $iCount = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tPOINT [, $iCount',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ModifyWorldTransform: {
    documentation: 'Changes the world transformation for a device context using the specified mode',
    label: '_WinAPI_ModifyWorldTransform ( $hDC, $tXFORM, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tXFORM',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OffsetPoints: {
    documentation: 'Moves a points from the array by the specified offsets',
    label:
      '_WinAPI_OffsetPoints ( ByRef $aPoint, $iXOffset, $iYOffset [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: 'ByRef $aPoint',
        documentation: 'Parameter description',
      },
      {
        label: '$iXOffset',
        documentation: 'Parameter description',
      },
      {
        label: '$iYOffset [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OffsetWindowOrg: {
    documentation:
      'Modifies the window origin for a device context using the specified horizontal and vertical offsets',
    label: '_WinAPI_OffsetWindowOrg ( $hDC, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXOffset',
        documentation: 'Parameter description',
      },
      {
        label: '$iYOffset',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RotatePoints: {
    documentation: 'Rotates a points from the array by the specified angle',
    label:
      '_WinAPI_RotatePoints ( ByRef $aPoint, $iXC, $iYC, $fAngle [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: 'ByRef $aPoint',
        documentation: 'Parameter description',
      },
      {
        label: '$iXC',
        documentation: 'Parameter description',
      },
      {
        label: '$iYC',
        documentation: 'Parameter description',
      },
      {
        label: '$fAngle [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ScaleWindowExt: {
    documentation:
      'Modifies the window for a device context using the ratios formed by the specified multiplicands and divisors',
    label: '_WinAPI_ScaleWindowExt ( $hDC, $iXNum, $iXDenom, $iYNum, $iYDenom )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXNum',
        documentation: 'Parameter description',
      },
      {
        label: '$iXDenom',
        documentation: 'Parameter description',
      },
      {
        label: '$iYNum',
        documentation: 'Parameter description',
      },
      {
        label: '$iYDenom',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetGraphicsMode: {
    documentation: 'Sets the graphics mode for the specified device context',
    label: '_WinAPI_SetGraphicsMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetMapMode: {
    documentation: 'Sets the mapping mode of the specified device context',
    label: '_WinAPI_SetMapMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetWindowExt: {
    documentation:
      'Sets the horizontal and vertical extents of the window for a device context by using the specified values',
    label: '_WinAPI_SetWindowExt ( $hDC, $iXExtent, $iYExtent )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iXExtent',
        documentation: 'Parameter description',
      },
      {
        label: '$iYExtent',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetWindowOrg: {
    documentation: 'Specifies which window point maps to the viewport origin (0,0)',
    label: '_WinAPI_SetWindowOrg ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetWorldTransform: {
    documentation:
      'Sets a two-dimensional linear transformation between world space and page space for the specified device context',
    label: '_WinAPI_SetWorldTransform ( $hDC, $tXFORM )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tXFORM',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmDefWindowProc: {
    documentation:
      'Default window procedure for Desktop Window Manager (DWM) hit testing within the non-client area',
    label: '_WinAPI_DwmDefWindowProc ( $hWnd, $iMsg, $wParam, $lParam )',
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
        label: '$wParam',
        documentation: 'Parameter description',
      },
      {
        label: '$lParam',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmEnableBlurBehindWindow: {
    documentation: 'Enables the blur effect on a specified window',
    label:
      '_WinAPI_DwmEnableBlurBehindWindow ( $hWnd [, $bEnable = True [, $bTransition = False [, $hRgn = 0]]] )',
    params: [
      {
        label: '$hWnd [, $bEnable',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmEnableComposition: {
    documentation: 'Enables or disables Desktop Window Manager (DWM) composition',
    label: '_WinAPI_DwmEnableComposition ( $bEnable )',
    params: [
      {
        label: '$bEnable',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmExtendFrameIntoClientArea: {
    documentation: 'Extends the window frame behind the client area',
    label: '_WinAPI_DwmExtendFrameIntoClientArea ( $hWnd [, $tMARGINS = 0] )',
    params: [
      {
        label: '$hWnd [, $tMARGINS',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmGetColorizationColor: {
    documentation:
      'Retrieves the current color used for Desktop Window Manager (DWM) glass composition',
    label: '_WinAPI_DwmGetColorizationColor ( )',
    params: [],
  },
  _WinAPI_DwmGetColorizationParameters: {
    documentation: 'Retrieves the colorization parameters used for Desktop Window Manager (DWM)',
    label: '_WinAPI_DwmGetColorizationParameters ( )',
    params: [],
  },
  _WinAPI_DwmGetWindowAttribute: {
    documentation: 'Retrieves the current value of a specified attribute applied to the window',
    label: '_WinAPI_DwmGetWindowAttribute ( $hWnd, $iAttribute )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$iAttribute',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmInvalidateIconicBitmaps: {
    documentation:
      'Indicates that all previously provided iconic bitmaps from a window, both thumbnails and peek representations, should be refreshed',
    label: '_WinAPI_DwmInvalidateIconicBitmaps ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmIsCompositionEnabled: {
    documentation: 'Determines whether Desktop Window Manager (DWM) composition is enabled',
    label: '_WinAPI_DwmIsCompositionEnabled ( )',
    params: [],
  },
  _WinAPI_DwmQueryThumbnailSourceSize: {
    documentation: 'Returns the source size of the Desktop Window Manager (DWM) thumbnail',
    label: '_WinAPI_DwmQueryThumbnailSourceSize ( $hThumbnail )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmRegisterThumbnail: {
    documentation:
      'Creates a Desktop Window Manager (DWM) thumbnail relationship between the destination and source windows',
    label: '_WinAPI_DwmRegisterThumbnail ( $hDestination, $hSource )',
    params: [
      {
        label: '$hDestination',
        documentation: 'Parameter description',
      },
      {
        label: '$hSource',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmSetColorizationParameters: {
    documentation: 'Sets the colorization parameters for Desktop Window Manager (DWM)',
    label: '_WinAPI_DwmSetColorizationParameters ( $tDWMCP )',
    params: [
      {
        label: '$tDWMCP',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmSetIconicLivePreviewBitmap: {
    documentation:
      'Sets a static, iconic bitmap to display a live preview (also known as a Peek preview) of a window or tab',
    label:
      '_WinAPI_DwmSetIconicLivePreviewBitmap ( $hWnd, $hBitmap [, $bFrame = False [, $tClient = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hBitmap [, $bFrame',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmSetIconicThumbnail: {
    documentation:
      'Sets a static, iconic bitmap on a window or tab to use as a thumbnail representation',
    label: '_WinAPI_DwmSetIconicThumbnail ( $hWnd, $hBitmap [, $bFrame = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hBitmap [, $bFrame',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmSetWindowAttribute: {
    documentation:
      'Sets the value of the specified attributes for non-client rendering to apply to the window',
    label: '_WinAPI_DwmSetWindowAttribute ( $hWnd, $iAttribute, $iData )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$iAttribute',
        documentation: 'Parameter description',
      },
      {
        label: '$iData',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmUnregisterThumbnail: {
    documentation: 'Removes a Desktop Window Manager (DWM) thumbnail relationship',
    label: '_WinAPI_DwmUnregisterThumbnail ( $hThumbnail )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DwmUpdateThumbnailProperties: {
    documentation: 'Specifies Desktop Window Manager (DWM) thumbnail properties',
    label:
      '_WinAPI_DwmUpdateThumbnailProperties ( $hThumbnail [, $bVisible = True [, $bClientAreaOnly = False [, $iOpacity = 255 [, $tRectDest = 0 [, $tRectSrc = 0]]]]] )',
    params: [
      {
        label: '$hThumbnail [, $bVisible',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EnumDisplaySettings: {
    documentation: 'Retrieves information about one of the graphics modes for a display device',
    label: '_WinAPI_EnumDisplaySettings ( $sDevice, $iMode )',
    params: [
      {
        label: '$sDevice',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetCurrentObject: {
    documentation:
      'Retrieves a handle to an object of the specified type that has been selected into the specified device context',
    label: '_WinAPI_GetCurrentObject ( $hDC, $iType )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iType',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetDCEx: {
    documentation:
      'Retrieves a handle to a device context (DC) for the client area of a specified window',
    label: '_WinAPI_GetDCEx ( $hWnd, $hRgn, $iFlags )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetObjectType: {
    documentation: 'Retrieves the type of the specified object',
    label: '_WinAPI_GetObjectType ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PrintWindow: {
    documentation: 'Copies a visual window into the specified device context',
    label: '_WinAPI_PrintWindow ( $hWnd, $hDC [, $bClient = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hDC [, $bClient',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RestoreDC: {
    documentation: 'Restores a device context (DC) to the specified state',
    label: '_WinAPI_RestoreDC ( $hDC, $iID )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iID',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SaveDC: {
    documentation:
      'Saves the current state of the specified device context (DC) by copying data describing selected objects and graphic modes to a context stack',
    label: '_WinAPI_SaveDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AddFontMemResourceEx: {
    documentation: 'Adds the font resource from a memory image to the system',
    label: '_WinAPI_AddFontMemResourceEx ( $pData, $iSize )',
    params: [
      {
        label: '$pData',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AddFontResourceEx: {
    documentation: 'Adds the font resource from the specified file to the system font table',
    label: '_WinAPI_AddFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateFontEx: {
    documentation: 'Creates a logical font with the specified characteristics',
    label:
      "_WinAPI_CreateFontEx ( $iHeight [, $iWidth = 0 [, $iEscapement = 0 [, $iOrientation = 0 [, $iWeight = 400 [, $bItalic = False [, $bUnderline = False [, $bStrikeOut = False [, $iCharSet = 1 [, $iOutPrecision = 0 [, $iClipPrecision = 0 [, $iQuality = 0 [, $iPitchAndFamily = 0 [, $sFaceName = '' [, $iStyle = 0]]]]]]]]]]]]]] )",
    params: [
      {
        label: '$iHeight [, $iWidth',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EnumFontFamilies: {
    documentation:
      'Enumerates all uniquely-named fonts in the system that match the specified font characteristics',
    label:
      "_WinAPI_EnumFontFamilies ( [$hDC = 0 [, $sFaceName = '' [, $iCharSet = 1 [, $iFontType = 0x07 [, $sPattern = '' [, $bExclude = False]]]]]] )",
    params: [
      {
        label: '$hDC',
        documentation: '**[optional]** Default is 0 [, $sFaceName.',
      },
    ],
  },
  _WinAPI_GetFontName: {
    documentation:
      'Retrieves the unique name of the font based on its typeface name, character set, and style',
    label: '_WinAPI_GetFontName ( $sFaceName [, $iStyle = 0 [, $iCharSet = 1]] )',
    params: [
      {
        label: '$sFaceName [, $iStyle',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetFontResourceInfo: {
    documentation: 'Retrieves the fontname from the specified font resource file',
    label: '_WinAPI_GetFontResourceInfo ( $sFont [, $bForce = False [, $iFlag = Default]] )',
    params: [
      {
        label: '$sFont [, $bForce',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetFontMemoryResourceInfo: {
    documentation: 'Reads out font information from a TTF loaded into the memory',
    label: '_WinAPI_GetFontMemoryResourceInfo ( $pMemory [, $iFlag = 1] )',
    params: [
      {
        label: '$pMemory [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetGlyphOutline: {
    documentation: 'Retrieves the outline or bitmap for a character in the TrueType font',
    label: '_WinAPI_GetGlyphOutline ( $hDC, $sChar, $iFormat, ByRef $pBuffer [, $tMAT2 = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$sChar',
        documentation: 'Parameter description',
      },
      {
        label: '$iFormat',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBuffer [, $tMAT2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetOutlineTextMetrics: {
    documentation: 'Retrieves text metrics for TrueType fonts',
    label: '_WinAPI_GetOutlineTextMetrics ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetTabbedTextExtent: {
    documentation:
      'Computes the width and height of a character string which may contain one or more tab characters',
    label:
      '_WinAPI_GetTabbedTextExtent ( $hDC, $sText [, $aTab = 0 [, $iStart = 0 [, $iEnd = -1]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$sText [, $aTab',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetTextAlign: {
    documentation: 'Retrieves the text-alignment setting for the specified device context',
    label: '_WinAPI_GetTextAlign ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetTextCharacterExtra: {
    documentation: 'Retrieves the current intercharacter spacing for the specified device context',
    label: '_WinAPI_GetTextCharacterExtra ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetTextColor: {
    documentation: 'Retrieves the current text color for the specified device context',
    label: '_WinAPI_GetTextColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetTextFace: {
    documentation:
      'Retrieves the typeface name of the font that is selected into the specified device context',
    label: '_WinAPI_GetTextFace ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RemoveFontMemResourceEx: {
    documentation: 'Removes the fonts added from a memory image',
    label: '_WinAPI_RemoveFontMemResourceEx ( $hFont )',
    params: [
      {
        label: '$hFont',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RemoveFontResourceEx: {
    documentation: 'Removes the fonts in the specified file from the system font table',
    label: '_WinAPI_RemoveFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetTextAlign: {
    documentation: 'Sets the text-alignment flags for the specified device context',
    label: '_WinAPI_SetTextAlign ( $hDC [, $iMode = 0] )',
    params: [
      {
        label: '$hDC [, $iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetTextCharacterExtra: {
    documentation: 'Sets the intercharacter spacing for the specified device context',
    label: '_WinAPI_SetTextCharacterExtra ( $hDC, $iCharExtra )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iCharExtra',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetTextJustification: {
    documentation:
      'Specifies the amount of space the system should add to the break characters in a string of text',
    label: '_WinAPI_SetTextJustification ( $hDC, $iBreakExtra, $iBreakCount )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iBreakExtra',
        documentation: 'Parameter description',
      },
      {
        label: '$iBreakCount',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_TabbedTextOut: {
    documentation:
      'Writes a character string at a specified location and expanding tabs to the specified tab-stop positions',
    label:
      '_WinAPI_TabbedTextOut ( $hDC, $iX, $iY, $sText [, $aTab = 0 [, $iStart = 0 [, $iEnd = -1 [, $iOrigin = 0]]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$sText [, $aTab',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_TextOut: {
    documentation:
      'Writes a string at the specified location, using the currently selected font, background color, and text color',
    label: '_WinAPI_TextOut ( $hDC, $iX, $iY, $sText )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$sText',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AngleArc: {
    documentation: 'Draws a line segment and an arc',
    label: '_WinAPI_AngleArc ( $hDC, $iX, $iY, $iRadius, $nStartAngle, $nSweepAngle )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iRadius',
        documentation: 'Parameter description',
      },
      {
        label: '$nStartAngle',
        documentation: 'Parameter description',
      },
      {
        label: '$nSweepAngle',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Arc: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_Arc ( $hDC, $tRECT, $iXStartArc, $iYStartArc, $iXEndArc, $iYEndArc )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
      {
        label: '$iXStartArc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYStartArc',
        documentation: 'Parameter description',
      },
      {
        label: '$iXEndArc',
        documentation: 'Parameter description',
      },
      {
        label: '$iYEndArc',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ArcTo: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_ArcTo ( $hDC, $tRECT, $iXRadial1, $iYRadial1, $iXRadial2, $iYRadial2 )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
      {
        label: '$iXRadial1',
        documentation: 'Parameter description',
      },
      {
        label: '$iYRadial1',
        documentation: 'Parameter description',
      },
      {
        label: '$iXRadial2',
        documentation: 'Parameter description',
      },
      {
        label: '$iYRadial2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetArcDirection: {
    documentation: 'Retrieves the current arc direction for the specified device context',
    label: '_WinAPI_GetArcDirection ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_LineDDA: {
    documentation: 'Determines which pixels should be highlighted for a line',
    label: '_WinAPI_LineDDA ( $iX1, $iY1, $iX2, $iY2, $pLineProc [, $pData = 0] )',
    params: [
      {
        label: '$iX1',
        documentation: 'Parameter description',
      },
      {
        label: '$iY1',
        documentation: 'Parameter description',
      },
      {
        label: '$iX2',
        documentation: 'Parameter description',
      },
      {
        label: '$iY2',
        documentation: 'Parameter description',
      },
      {
        label: '$pLineProc [, $pData',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_MoveToEx: {
    documentation: 'Updates the current position to the specified point',
    label: '_WinAPI_MoveToEx ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PolyBezier: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezier ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aPoint [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PolyBezierTo: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezierTo ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aPoint [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PolyDraw: {
    documentation: 'Draws a set of line segments and Bezier curves',
    label: '_WinAPI_PolyDraw ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aPoint [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetArcDirection: {
    documentation: 'Sets the drawing arc direction',
    label: '_WinAPI_SetArcDirection ( $hDC, $iDirection )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iDirection',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CloseEnhMetaFile: {
    documentation:
      'Closes an enhanced-metafile device context and returns a handle that identifies an enhanced-format metafile',
    label: '_WinAPI_CloseEnhMetaFile ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CopyEnhMetaFile: {
    documentation: 'Copies the contents of an enhanced-format metafile to a specified file',
    label: "_WinAPI_CopyEnhMetaFile ( $hEmf [, $sFilePath = ''] )",
    params: [
      {
        label: '$hEmf [, $sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateEnhMetaFile: {
    documentation: 'Creates a device context for an enhanced-format metafile',
    label:
      "_WinAPI_CreateEnhMetaFile ( [$hDC = 0 [, $tRECT = 0 [, $bPixels = False [, $sFilePath = '' [, $sDescription = '']]]]] )",
    params: [
      {
        label: '$hDC',
        documentation: '**[optional]** Default is 0 [, $tRECT.',
      },
    ],
  },
  _WinAPI_DeleteEnhMetaFile: {
    documentation: 'Deletes an enhanced-format metafile or an enhanced-format metafile handle',
    label: '_WinAPI_DeleteEnhMetaFile ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GdiComment: {
    documentation: 'Copies a comment from a buffer into a specified enhanced-format metafile',
    label: '_WinAPI_GdiComment ( $hDC, $pBuffer, $iSize )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$pBuffer',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetEnhMetaFile: {
    documentation:
      'Creates a handle that identifies the enhanced-format metafile stored in the specified file',
    label: '_WinAPI_GetEnhMetaFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileBits: {
    documentation: 'Retrieves the contents of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileBits ( $hEmf, ByRef $pBuffer )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $pBuffer',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDescription: {
    documentation: 'Retrieves an optional text description from an enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDescription ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDimension: {
    documentation: 'Retrieves a dimension of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDimension ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileHeader: {
    documentation:
      'Retrieves the record containing the header for the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileHeader ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PlayEnhMetaFile: {
    documentation: 'Displays the picture stored in the specified enhanced-format metafile',
    label: '_WinAPI_PlayEnhMetaFile ( $hDC, $hEmf, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hEmf',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetEnhMetaFileBits: {
    documentation: 'Creates a memory-based enhanced-format metafile from the specified data',
    label: '_WinAPI_SetEnhMetaFileBits ( $pData, $iLength )',
    params: [
      {
        label: '$pData',
        documentation: 'Parameter description',
      },
      {
        label: '$iLength',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EnumDisplayMonitors: {
    documentation:
      'Enumerates display monitors (including invisible pseudo-monitors associated with the mirroring drivers)',
    label: '_WinAPI_EnumDisplayMonitors ( [$hDC = 0 [, $tRECT = 0]] )',
    params: [
      {
        label: '$hDC',
        documentation: '**[optional]** Default is 0 [, $tRECT.',
      },
    ],
  },
  _WinAPI_MonitorFromPoint: {
    documentation: 'Retrieves a handle to the display monitor that contains a specified point',
    label: '_WinAPI_MonitorFromPoint ( $tPOINT [, $iFlag = 1] )',
    params: [
      {
        label: '$tPOINT [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_MonitorFromRect: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with a specified rectangle',
    label: '_WinAPI_MonitorFromRect ( $tRECT [, $iFlag = 1] )',
    params: [
      {
        label: '$tRECT [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_MonitorFromWindow: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with the specified window',
    label: '_WinAPI_MonitorFromWindow ( $hWnd [, $iFlag = 1] )',
    params: [
      {
        label: '$hWnd [, $iFlag',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_BeginPaint: {
    documentation: 'Prepares the specified window for painting',
    label: '_WinAPI_BeginPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tPAINTSTRUCT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DrawAnimatedRects: {
    documentation:
      'Animates the caption of a window to indicate the opening of an icon or the minimizing or maximizing of a window',
    label: '_WinAPI_DrawAnimatedRects ( $hWnd, $tRectFrom, $tRectTo )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$tRectFrom',
        documentation: 'Parameter description',
      },
      {
        label: '$tRectTo',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DrawShadowText: {
    documentation: 'Draws formatted text in the specified rectangle with a drop shadow',
    label:
      '_WinAPI_DrawShadowText ( $hDC, $sText, $iRGBText, $iRGBShadow [, $iXOffset = 0 [, $iYOffset = 0 [, $tRECT = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$sText',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGBText',
        documentation: 'Parameter description',
      },
      {
        label: '$iRGBShadow [, $iXOffset',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EndPaint: {
    documentation: 'Marks the end of painting in the specified window',
    label: '_WinAPI_EndPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tPAINTSTRUCT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBkColor: {
    documentation: 'Retrieves the current background color for the specified device context',
    label: '_WinAPI_GetBkColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetBoundsRect: {
    documentation:
      'Obtains the current accumulated bounding rectangle for a specified device context',
    label: '_WinAPI_GetBoundsRect ( $hDC [, $iFlags = 0] )',
    params: [
      {
        label: '$hDC [, $iFlags',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_GetROP2 ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetUpdateRect: {
    documentation:
      'Retrieves the coordinates of the rectangle that completely encloses the update region of the specified window',
    label: '_WinAPI_GetUpdateRect ( $hWnd [, $bErase = True] )',
    params: [
      {
        label: '$hWnd [, $bErase',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetUpdateRgn: {
    documentation:
      'Retrieves the update region of a window by copying it into the specified region',
    label: '_WinAPI_GetUpdateRgn ( $hWnd, $hRgn [, $bErase = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn [, $bErase',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetWindowRgnBox: {
    documentation:
      'Retrieves the dimensions of the tightest bounding rectangle for the window region of a window',
    label: '_WinAPI_GetWindowRgnBox ( $hWnd, ByRef $tRECT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_InvalidateRgn: {
    documentation: "Adds a region to the specified window's update region",
    label: '_WinAPI_InvalidateRgn ( $hWnd [, $hRgn = 0 [, $bErase = True]] )',
    params: [
      {
        label: '$hWnd [, $hRgn',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_LockWindowUpdate: {
    documentation: 'Disables or enables drawing in the specified window',
    label: '_WinAPI_LockWindowUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PaintDesktop: {
    documentation:
      'Fills the clipping region in the specified device context with the desktop pattern or wallpaper',
    label: '_WinAPI_PaintDesktop ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetBoundsRect: {
    documentation:
      'Controls the accumulation of bounding rectangle information for the specified device context',
    label: '_WinAPI_SetBoundsRect ( $hDC, $iFlags [, $tRECT = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags [, $tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_SetROP2 ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ValidateRect: {
    documentation: 'Removes a rectangle from the current update region of the specified window',
    label: '_WinAPI_ValidateRect ( $hWnd [, $tRECT = 0] )',
    params: [
      {
        label: '$hWnd [, $tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ValidateRgn: {
    documentation: 'Removes a region from the current update region of the specified window',
    label: '_WinAPI_ValidateRgn ( $hWnd [, $hRgn = 0] )',
    params: [
      {
        label: '$hWnd [, $hRgn',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_WindowFromDC: {
    documentation:
      'Retrieves a handle to the window associated with the specified display device context (DC)',
    label: '_WinAPI_WindowFromDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_AbortPath: {
    documentation: 'Closes and discards any paths in the specified device context',
    label: '_WinAPI_AbortPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_BeginPath: {
    documentation: 'Opens a path bracket in the specified device context',
    label: '_WinAPI_BeginPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CloseFigure: {
    documentation: 'Closes an open figure in a path',
    label: '_WinAPI_CloseFigure ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EndPath: {
    documentation:
      'Closes a path bracket and selects the path defined by the bracket into the specified device context',
    label: '_WinAPI_EndPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FillPath: {
    documentation:
      "Closes any open figures in the current path and fills the path's interior by using the current brush",
    label: '_WinAPI_FillPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FlattenPath: {
    documentation:
      'Transforms any curves in the path that is selected into the current DC, turning each curve into a sequence of lines',
    label: '_WinAPI_FlattenPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PathToRegion: {
    documentation:
      'Creates a region from the path that is selected into the specified device context',
    label: '_WinAPI_PathToRegion ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_StrokeAndFillPath: {
    documentation:
      'Closes any open figures in a path, strokes the outline of the path, and fills its interior',
    label: '_WinAPI_StrokeAndFillPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_StrokePath: {
    documentation: 'Renders the specified path by using the current pen',
    label: '_WinAPI_StrokePath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_WidenPath: {
    documentation:
      'Redefines the current path as the area that would be painted if the path were stroked',
    label: '_WinAPI_WidenPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CopyRect: {
    documentation: 'Copies the coordinates of one rectangle to another',
    label: '_WinAPI_CopyRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_DrawFocusRect: {
    documentation:
      'Draws a rectangle in the style used to indicate that the rectangle has the focus',
    label: '_WinAPI_DrawFocusRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EqualRect: {
    documentation: 'Determines whether the two specified rectangles are equal',
    label: '_WinAPI_EqualRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_InflateRect: {
    documentation: 'Increases or decreases the width and height of the specified rectangle',
    label: '_WinAPI_InflateRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: 'ByRef $tRECT',
        documentation: 'Parameter description',
      },
      {
        label: '$iDX',
        documentation: 'Parameter description',
      },
      {
        label: '$iDY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_IntersectRect: {
    documentation: 'Creates the intersection of two rectangles',
    label: '_WinAPI_IntersectRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_IsRectEmpty: {
    documentation: 'Determines whether the specified rectangle is empty',
    label: '_WinAPI_IsRectEmpty ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OffsetRect: {
    documentation: 'Moves the specified rectangle by the specified offsets',
    label: '_WinAPI_OffsetRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: 'ByRef $tRECT',
        documentation: 'Parameter description',
      },
      {
        label: '$iDX',
        documentation: 'Parameter description',
      },
      {
        label: '$iDY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PtInRectEx: {
    documentation: 'Determines whether the specified point lies within the specified rectangle',
    label: '_WinAPI_PtInRectEx ( $iX, $iY, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iLeft',
        documentation: 'Parameter description',
      },
      {
        label: '$iTop',
        documentation: 'Parameter description',
      },
      {
        label: '$iRight',
        documentation: 'Parameter description',
      },
      {
        label: '$iBottom',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SubtractRect: {
    documentation:
      'Determines the coordinates of a rectangle formed by subtracting one rectangle from another',
    label: '_WinAPI_SubtractRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_UnionRect: {
    documentation: 'Creates the union of two rectangles',
    label: '_WinAPI_UnionRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateEllipticRgn: {
    documentation: 'Creates an elliptical region',
    label: '_WinAPI_CreateEllipticRgn ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateNullRgn: {
    documentation: 'Creates an empty region',
    label: '_WinAPI_CreateNullRgn ( )',
    params: [],
  },
  _WinAPI_CreatePolygonRgn: {
    documentation: 'Creates a polygonal region',
    label:
      '_WinAPI_CreatePolygonRgn ( Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1 [, $iMode = 1]]] )',
    params: [
      {
        label: 'Const ByRef $aPoint [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_CreateRectRgnIndirect: {
    documentation: 'Creates a rectangular region',
    label: '_WinAPI_CreateRectRgnIndirect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_EqualRgn: {
    documentation: 'Checks the two specified regions to determine whether they are identical',
    label: '_WinAPI_EqualRgn ( $hRgn1, $hRgn2 )',
    params: [
      {
        label: '$hRgn1',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn2',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_ExtCreateRegion: {
    documentation: 'Creates a region from the specified region and transformation data',
    label: '_WinAPI_ExtCreateRegion ( $tRGNDATA [, $tXFORM = 0] )',
    params: [
      {
        label: '$tRGNDATA [, $tXFORM',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FillRgn: {
    documentation: 'Fills a region by using the specified brush',
    label: '_WinAPI_FillRgn ( $hDC, $hRgn, $hBrush )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$hBrush',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_FrameRgn: {
    documentation: 'Draws a border around the specified region by using the specified brush',
    label: '_WinAPI_FrameRgn ( $hDC, $hRgn, $hBrush, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$hBrush',
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
  _WinAPI_GetPolyFillMode: {
    documentation: 'Retrieves the current polygon fill mode',
    label: '_WinAPI_GetPolyFillMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetRegionData: {
    documentation: 'Fills the specified buffer with data describing a region',
    label: '_WinAPI_GetRegionData ( $hRgn, ByRef $tRGNDATA )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tRGNDATA',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_GetRgnBox: {
    documentation: 'Retrieves the bounding rectangle of the specified region',
    label: '_WinAPI_GetRgnBox ( $hRgn, ByRef $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_InvertRgn: {
    documentation: 'Inverts the colors in the specified region',
    label: '_WinAPI_InvertRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_OffsetRgn: {
    documentation: 'Moves a region by the specified offsets',
    label: '_WinAPI_OffsetRgn ( $hRgn, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$iXOffset',
        documentation: 'Parameter description',
      },
      {
        label: '$iYOffset',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PaintRgn: {
    documentation:
      'Paints the specified region by using the brush currently selected into the device context',
    label: '_WinAPI_PaintRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_PtInRegion: {
    documentation: 'Determines whether the specified point is inside the specified region',
    label: '_WinAPI_PtInRegion ( $hRgn, $iX, $iY )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RectInRegion: {
    documentation:
      'Determines whether any part of the specified rectangle is within the boundaries of a region',
    label: '_WinAPI_RectInRegion ( $hRgn, $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetPolyFillMode: {
    documentation: 'Sets the polygon fill mode for functions that fill polygons',
    label: '_WinAPI_SetPolyFillMode ( $hDC [, $iMode = 1] )',
    params: [
      {
        label: '$hDC [, $iMode',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_SetRectRgn: {
    documentation: 'Converts a region into a rectangular region with the specified coordinates',
    label: '_WinAPI_SetRectRgn ( $hRgn, $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Ellipse: {
    documentation: 'Draws an ellipse',
    label: '_WinAPI_Ellipse ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_InvertRect: {
    documentation:
      'Inverts a rectangle in a window by performing a logical NOT operation on the color values for each pixel',
    label: '_WinAPI_InvertRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Polygon: {
    documentation: 'Draws a polygon consisting of two or more vertices connected by straight lines',
    label: '_WinAPI_Polygon ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: 'Const ByRef $aPoint [, $iStart',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_Rectangle: {
    documentation: 'Draws a rectangle',
    label: '_WinAPI_Rectangle ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
        documentation: 'Parameter description',
      },
    ],
  },
  _WinAPI_RoundRect: {
    documentation: 'Draws a rectangle with rounded corners',
    label: '_WinAPI_RoundRect ( $hDC, $tRECT, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Parameter description',
      },
      {
        label: '$tRECT',
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
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
