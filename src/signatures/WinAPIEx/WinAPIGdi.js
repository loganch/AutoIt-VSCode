import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover, br } from '../../util';

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
        documentation: 'The width of the bitmap, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the bitmap, in pixels',
      },
      {
        label: '$iBitsPerPel',
        documentation: 'The number of bits per pixel (1, 4, 8, 16, 24, or 32)',
      },
      {
        label: '$tColorTable',
        documentation:
          'Pointer to an array of RGBQUAD structures containing the color table for the DIB',
      },
      {
        label: '$iColorCount',
        documentation: 'The number of colors in the color table (0 = all colors)',
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
        documentation: 'Handle to the source bitmap',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the new bitmap, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the new bitmap, in pixels',
      },
      {
        label: '$iMode',
        documentation: 'Interpolation mode (0=default, 1=point, 2=linear, 3=cubic, 4=4x4, 5=8x8)',
      },
      {
        label: '$tAdjustment',
        documentation:
          'Pointer to a $tagCOLORADJUSTMENT structure containing the color adjustment values',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in pixels, of the upper-left corner of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in pixels, of the upper-left corner of the destination rectangle',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width, in pixels, of the destination rectangle',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height, in pixels, of the destination rectangle',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in pixels, of the upper-left corner of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in pixels, of the upper-left corner of the source rectangle',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width, in pixels, of the source rectangle',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height, in pixels, of the source rectangle',
      },
      {
        label: '$iAlpha',
        documentation: 'Alpha blending value (0-255)',
      },
      {
        label: '$bAlpha',
        documentation: 'If True, use the alpha channel in the source bitmap',
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
        documentation: 'Handle to the bitmap to compress',
      },
      {
        label: '$pBuffer',
        documentation: 'Buffer that receives the compressed data',
      },
      {
        label: '$iCompression',
        documentation: 'Compression type (0=none, 1=RLE, 2=JPEG)',
      },
      {
        label: '$iQuality',
        documentation: 'JPEG compression quality (1-100, default is 100)',
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
        documentation: 'Handle to the bitmap to be copied',
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
        label: '$hImage',
        documentation: 'Handle to the image to be copied',
      },
      {
        label: '$iType',
        documentation: 'Type of image (0=auto, 1=bitmap, 2=icon, 3=cursor)',
      },
      {
        label: '$iXDesiredPixels',
        documentation: 'Desired width in pixels (0=original size)',
      },
      {
        label: '$iYDesiredPixels',
        documentation: 'Desired height in pixels (0=original size)',
      },
      {
        label: '$iFlags',
        documentation:
          'Copy flags (0x0001=LR_COPYDELETEORG, 0x0002=LR_COPYFROMRESOURCE, 0x0004=LR_MONOCHROME)',
      },
    ],
  },
  _WinAPI_Create32BitHBITMAP: {
    documentation: 'Creates a 32 bits-per-pixel bitmap from the specified icon',
    label: '_WinAPI_Create32BitHBITMAP ( $hIcon [, $bDib = False [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon',
      },
      {
        label: '$bDib',
        documentation: 'If True, creates a DIB section instead of a DDB',
      },
      {
        label: '$bDelete',
        documentation: 'If True, deletes the original icon after conversion',
      },
    ],
  },
  _WinAPI_Create32BitHICON: {
    documentation: 'Converts an icon to a 32 bits-per-pixel format and copies to the new icon',
    label: '_WinAPI_Create32BitHICON ( $hIcon [, $bDelete = False] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to convert',
      },
      {
        label: '$bDelete',
        documentation: 'If True, deletes the original icon after conversion',
      },
    ],
  },
  _WinAPI_CreateANDBitmap: {
    documentation: 'Creates AND bitmask device-independent bitmap (DIB) from the specified bitmap',
    label: '_WinAPI_CreateANDBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the source bitmap',
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
        documentation: 'Pointer to a $tagBITMAP structure containing the bitmap information',
      },
    ],
  },
  _WinAPI_CreateCompatibleBitmapEx: {
    documentation: 'Creates a bitmap compatible with the device and fills it the specified color',
    label: '_WinAPI_CreateCompatibleBitmapEx ( $hDC, $iWidth, $iHeight, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the bitmap, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the bitmap, in pixels',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color value to fill the bitmap',
      },
    ],
  },
  _WinAPI_CreateDIBColorTable: {
    documentation: 'Creates RGB color table from the specified array of colors',
    label:
      '_WinAPI_CreateDIBColorTable ( Const ByRef $aColorTable [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$aColorTable',
        documentation: 'Array of RGB color values',
      },
      {
        label: '$iStart',
        documentation: 'Index of first color to include (0-based)',
      },
      {
        label: '$iEnd',
        documentation: 'Index of last color to include (-1 = all remaining colors)',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Pointer to a $tagBITMAPINFO structure',
      },
      {
        label: '$iUsage',
        documentation: 'Usage flag (0=DIB_PAL_COLORS, 1=DIB_RGB_COLORS)',
      },
      {
        label: '$pBits',
        documentation: 'Pointer to the bitmap bits',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Pointer to a $tagBITMAPINFO structure',
      },
      {
        label: '$iUsage',
        documentation: 'Usage flag (0=DIB_PAL_COLORS, 1=DIB_RGB_COLORS)',
      },
      {
        label: '$pBits',
        documentation: 'Pointer to receive a pointer to the location of the DIB bit values',
      },
      {
        label: '$hSection',
        documentation: 'Handle to a file-mapping object',
      },
      {
        label: '$iOffset',
        documentation: 'The offset from the beginning of the file-mapping object',
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
        documentation: 'The width of the icon, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the icon, in pixels',
      },
      {
        label: '$iBitsPerPel',
        documentation: 'The number of bits per pixel (1, 4, 8, 16, 24, or 32)',
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
        documentation: 'Handle to the color bitmap',
      },
      {
        label: '$hMask',
        documentation: 'Handle to the monochrome bitmap',
      },
      {
        label: '$iXHotspot',
        documentation: "The x-coordinate of the icon's hot spot",
      },
      {
        label: '$iYHotspot',
        documentation: "The y-coordinate of the icon's hot spot",
      },
      {
        label: '$bIcon',
        documentation: 'If True, creates an icon; otherwise, creates a cursor',
      },
    ],
  },
  _WinAPI_DrawBitmap: {
    documentation: 'Draws a bitmap into the specified device context',
    label: '_WinAPI_DrawBitmap ( $hDC, $iX, $iY, $hBitmap [, $iRop = 0x00CC0020] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the upper-left corner of the destination rectangle',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the upper-left corner of the destination rectangle',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to be drawn',
      },
      {
        label: '$iRop',
        documentation: 'Raster operation code (default is 0x00CC0020)',
      },
    ],
  },
  _WinAPI_ExtFloodFill: {
    documentation: 'Fills an area of the display surface with the current brush',
    label: '_WinAPI_ExtFloodFill ( $hDC, $iX, $iY, $iRGB [, $iType = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point where filling begins',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point where filling begins',
      },
      {
        label: '$iRGB',
        documentation: 'The color to be used for filling (RGB value)',
      },
      {
        label: '$iType',
        documentation: 'Flood fill type (0=stroke boundary, 1=fill area)',
      },
    ],
  },
  _WinAPI_GetBitmapBits: {
    documentation: 'Copies the bitmap bits of a specified device-dependent bitmap into a buffer',
    label: '_WinAPI_GetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to retrieve bits from',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes to copy',
      },
      {
        label: '$pBits',
        documentation: 'Buffer to receive the bitmap bits',
      },
    ],
  },
  _WinAPI_GetBitmapDimension: {
    documentation: 'Retrieves a dimension of the specified bitmap',
    label: '_WinAPI_GetBitmapDimension ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to get dimension from',
      },
    ],
  },
  _WinAPI_GetBitmapDimensionEx: {
    documentation: 'Retrieves the dimensions of a compatible bitmap',
    label: '_WinAPI_GetBitmapDimensionEx ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to get dimensions from',
      },
    ],
  },
  _WinAPI_GetDIBColorTable: {
    documentation: 'Retrieves RGB color table from the DIB section bitmap',
    label: '_WinAPI_GetDIBColorTable ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the DIB section bitmap',
      },
    ],
  },
  _WinAPI_GetIconDimension: {
    documentation: 'Retrieves a dimension of the specified icon',
    label: '_WinAPI_GetIconDimension ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to get dimension from',
      },
    ],
  },
  _WinAPI_GetPixel: {
    documentation: 'Retrieves the color value of the pixel at the specified coordinates',
    label: '_WinAPI_GetPixel ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the pixel to retrieve color from',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the pixel to retrieve color from',
      },
    ],
  },
  _WinAPI_GetStretchBltMode: {
    documentation: 'Retrieves the current stretching mode',
    label: '_WinAPI_GetStretchBltMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$aVertex',
        documentation: 'Array of TRIVERTEX structures defining the gradient vertices',
      },
      {
        label: '$iStart',
        documentation: 'Index of first vertex to use',
      },
      {
        label: '$iEnd',
        documentation: 'Index of last vertex to use (-1 = all remaining)',
      },
      {
        label: '$bRotate',
        documentation: 'If True, rotate the gradient',
      },
    ],
  },
  _WinAPI_InvertANDBitmap: {
    documentation: 'Inverts the specified AND bitmask bitmap by performing a logical NOT operation',
    label: '_WinAPI_InvertANDBitmap ( $hBitmap [, $bDelete = False] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the AND bitmask bitmap to invert',
      },
      {
        label: '$bDelete',
        documentation: 'If True, delete the bitmap after inversion',
      },
    ],
  },
  _WinAPI_IsAlphaBitmap: {
    documentation: 'Determines whether the specified bitmap has an alpha channel',
    label: '_WinAPI_IsAlphaBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to check',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation: 'The x-coordinate of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'The y-coordinate of the destination rectangle',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the destination rectangle and source rectangle',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the destination rectangle and source rectangle',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$hMask',
        documentation: 'Handle to the mask bitmap',
      },
      {
        label: '$iXMask',
        documentation: 'The x-coordinate of the mask rectangle',
      },
      {
        label: '$iYMask',
        documentation: 'The y-coordinate of the mask rectangle',
      },
      {
        label: '$iRop',
        documentation: 'Raster operation code',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$aPoint',
        documentation:
          'Array of three POINT structures that identify the destination parallelogram',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the source rectangle',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the source rectangle',
      },
      {
        label: '$hMask',
        documentation: 'Handle to the mask bitmap (0 if no mask)',
      },
      {
        label: '$iXMask',
        documentation: 'The x-coordinate of the mask rectangle',
      },
      {
        label: '$iYMask',
        documentation: 'The y-coordinate of the mask rectangle',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the center of the radial gradient',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the center of the radial gradient',
      },
      {
        label: '$iRadius',
        documentation: 'The radius of the gradient circle',
      },
      {
        label: '$iRGB1',
        documentation: 'The starting RGB color value',
      },
      {
        label: '$iRGB2',
        documentation: 'The ending RGB color value',
      },
      {
        label: '$fAngleStart',
        documentation: 'The starting angle in degrees',
      },
      {
        label: '$fAngleEnd',
        documentation: 'The ending angle in degrees',
      },
      {
        label: '$fStep',
        documentation: 'The angle step size in degrees',
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
        documentation: 'The path to the bitmap file to save',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to save',
      },
      {
        label: '$iXPelsPerMeter',
        documentation: 'Horizontal resolution in pixels per meter',
      },
      {
        label: '$iYPelsPerMeter',
        documentation: 'Vertical resolution in pixels per meter',
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
        documentation: 'The path to the icon file to save',
      },
      {
        label: '$vIcon',
        documentation: 'Handle to the icon or array of icons',
      },
      {
        label: '$bCompress',
        documentation: 'Compression flag (0=none, 1=compress)',
      },
      {
        label: '$iStart',
        documentation: 'Index of first icon to save',
      },
      {
        label: '$iEnd',
        documentation: 'Index of last icon to save (-1 = all remaining)',
      },
    ],
  },
  _WinAPI_SetBitmapBits: {
    documentation: 'Sets the bits of color data for a bitmap to the specified values',
    label: '_WinAPI_SetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to set bits for',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes to set',
      },
      {
        label: '$pBits',
        documentation: 'Buffer containing the bitmap bits',
      },
    ],
  },
  _WinAPI_SetBitmapDimensionEx: {
    documentation: 'Assigns preferred dimensions to a compatible bitmap',
    label: '_WinAPI_SetBitmapDimensionEx ( $hBitmap, $iWidth, $iHeight )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap',
      },
      {
        label: '$iWidth',
        documentation: 'The preferred width of the bitmap',
      },
      {
        label: '$iHeight',
        documentation: 'The preferred height of the bitmap',
      },
    ],
  },
  _WinAPI_SetDIBColorTable: {
    documentation: 'Sets RGB color table in the DIB section bitmap',
    label: '_WinAPI_SetDIBColorTable ( $hBitmap, $tColorTable, $iColorCount )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the DIB section bitmap',
      },
      {
        label: '$tColorTable',
        documentation: 'Array of RGB color values',
      },
      {
        label: '$iColorCount',
        documentation: 'The number of colors to set',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$iXDest',
        documentation: 'The x-coordinate of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'The y-coordinate of the destination rectangle',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the destination rectangle',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the destination rectangle',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$iStartScan',
        documentation: 'The starting scan line',
      },
      {
        label: '$iScanLines',
        documentation: 'The number of scan lines to copy',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Pointer to a $tagBITMAPINFO structure',
      },
      {
        label: '$iUsage',
        documentation: 'Usage flag (0=DIB_PAL_COLORS, 1=DIB_RGB_COLORS)',
      },
      {
        label: '$pBits',
        documentation: 'Pointer to the bitmap bits',
      },
    ],
  },
  _WinAPI_SetPixel: {
    documentation: 'Sets the pixel at the specified coordinates to the specified color',
    label: '_WinAPI_SetPixel ( $hDC, $iX, $iY, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the pixel to set',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the pixel to set',
      },
      {
        label: '$iRGB',
        documentation: 'The color to set (RGB value)',
      },
    ],
  },
  _WinAPI_SetStretchBltMode: {
    documentation: 'Sets the bitmap stretching mode in the specified device context',
    label: '_WinAPI_SetStretchBltMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iMode',
        documentation: 'Stretching mode (0=default, 1=black, 2=white, 3=color)',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation: 'The x-coordinate of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'The y-coordinate of the destination rectangle',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width of the destination rectangle',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height of the destination rectangle',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width of the source rectangle',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height of the source rectangle',
      },
      {
        label: '$iRop',
        documentation: 'Raster operation code',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation: 'The x-coordinate of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'The y-coordinate of the destination rectangle',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width of the destination rectangle',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height of the destination rectangle',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width of the source rectangle',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height of the source rectangle',
      },
      {
        label: '$tBITMAPINFO',
        documentation: 'Pointer to a $tagBITMAPINFO structure',
      },
      {
        label: '$iUsage',
        documentation: 'Usage flag (0=DIB_PAL_COLORS, 1=DIB_RGB_COLORS)',
      },
      {
        label: '$pBits',
        documentation: 'Pointer to the bitmap bits',
      },
      {
        label: '$iRop',
        documentation: 'Raster operation code',
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
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation: 'The x-coordinate of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'The y-coordinate of the destination rectangle',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width of the destination rectangle',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height of the destination rectangle',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate of the source rectangle',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width of the source rectangle',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height of the source rectangle',
      },
      {
        label: '$iRGB',
        documentation: 'The color to treat as transparent (RGB value)',
      },
    ],
  },
  _WinAPI_CreateBrushIndirect: {
    documentation: 'Creates a logical brush that has the specified style, color, and pattern',
    label: '_WinAPI_CreateBrushIndirect ( $iStyle, $iRGB [, $iHatch = 0] )',
    params: [
      {
        label: '$iStyle',
        documentation: 'Brush style (0=solid, 1=hatched, 2=pattern)',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color value',
      },
      {
        label: '$iHatch',
        documentation: 'Hatch style (used only when style is hatched)',
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
        documentation: 'Pen style (combination of cosmetic/geometry and dash styles)',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the pen in logical units',
      },
      {
        label: '$iBrushStyle',
        documentation: 'Brush style for geometric pens',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color value',
      },
      {
        label: '$iHatch',
        documentation: 'Hatch style (used only when brush style is hatched)',
      },
      {
        label: '$aUserStyle',
        documentation: 'Array of user-defined dash lengths',
      },
      {
        label: '$iStart',
        documentation: 'Index of first dash length to use',
      },
      {
        label: '$iEnd',
        documentation: 'Index of last dash length to use (-1 = all remaining)',
      },
    ],
  },
  _WinAPI_GetBrushOrg: {
    documentation: 'Retrieves the current brush origin for the specified device context',
    label: '_WinAPI_GetBrushOrg ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the rectangle',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the rectangle',
      },
      {
        label: '$iRop',
        documentation: 'Raster operation code',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the brush origin',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the brush origin',
      },
    ],
  },
  _WinAPI_SetDCBrushColor: {
    documentation: 'Sets the current device context (DC) brush color to the specified color value',
    label: '_WinAPI_SetDCBrushColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color value to set',
      },
    ],
  },
  _WinAPI_SetDCPenColor: {
    documentation: 'Sets the current device context (DC) pen color to the specified color value',
    label: '_WinAPI_SetDCPenColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color value to set',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_ExtSelectClipRgn: {
    documentation: 'Combines the specified region with the current clipping region',
    label: '_WinAPI_ExtSelectClipRgn ( $hDC, $hRgn [, $iMode = 5] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$hRgn',
        documentation: 'Handle to the region',
      },
      {
        label: '$iMode',
        documentation:
          'Region selection mode (1=replace, 2=intersect, 3=union, 4=xor, 5=diff, 6=copy)',
      },
    ],
  },
  _WinAPI_GetClipBox: {
    documentation: 'Retrieves the dimensions of the bounding rectangle of the visible area',
    label: '_WinAPI_GetClipBox ( $hDC, ByRef $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that is created by this function, and contains the rectangle dimensions, in logical units.',
      },
    ],
  },
  _WinAPI_GetClipRgn: {
    documentation: 'Retrieves a handle identifying the current application-defined clipping region',
    label: '_WinAPI_GetClipRgn ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_OffsetClipRgn: {
    documentation: 'Moves the clipping region of a device context by the specified offsets',
    label: '_WinAPI_OffsetClipRgn ( $hDC, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
      },
    ],
  },
  _WinAPI_PtVisible: {
    documentation: 'Determines whether the specified point is within the clipping region',
    label: '_WinAPI_PtVisible ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the brush origin',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the brush origin',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_SelectClipPath: {
    documentation:
      'Selects the current path as a clipping region, combining the new region with any existing clipping region',
    label: '_WinAPI_SelectClipPath ( $hDC [, $iMode = 5] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context of the path.',
      },
      {
        label: '$iMode',
        documentation: `**[optional]** The way to use the path. This parameter can be one of the following values.${br}
          \`$RGN_AND\`${br}
          \`$RGN_COP\` (Default)${br}
          \`$RGN_DIF\`${br}
          \`$RGN_OR\`${br}
          \`$RGN_XOR\``,
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be selected. To remove a device-context's clipping region, set this parameter to 0.",
      },
    ],
  },
  _WinAPI_ColorAdjustLuma: {
    documentation: 'Changes the luminance of a RGB value',
    label: '_WinAPI_ColorAdjustLuma ( $iRGB, $iPercent [, $bScale = True] )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The initial RGB value.',
      },
      {
        label: '$iPercent',
        documentation: 'The luminance of the total range, in percent, or absolute luminance.',
      },
      {
        label: '$bScale',
        documentation: `**[optional]** Specifies how to use the $iPercent parameter, valid values:${br}
            \`True\` - The \`$iPercent\` specifies how much to increment or decrement the current luminance, \`$iPercent\` can range from -1000 to +1000.${br}
            \`False\` - The \`$iPercent\` specifies the absolute luminance, \`$iPercent\` can range 0 to 1000. Available luminance values range from 0 to a maximum. If the requested value is negative or exceeds the maximum, the luminance will be set to either zero or the maximum value, respectively.${br}
            Default is \`True\`.`,
      },
    ],
  },
  _WinAPI_ColorHLSToRGB: {
    documentation: 'Converts colors from hue-luminance-saturation (HLS) to RGB format',
    label: '_WinAPI_ColorHLSToRGB ( $iHue, $iLuminance, $iSaturation )',
    params: [
      {
        label: '$iHue',
        documentation: 'HLS hue value.',
      },
      {
        label: '$iLuminance',
        documentation: 'HLS luminance value.',
      },
      {
        label: '$iSaturation',
        documentation: 'HLS saturation value.',
      },
    ],
  },
  _WinAPI_ColorRGBToHLS: {
    documentation: 'Converts colors from RGB to hue-luminance-saturation (HLS) format',
    label: '_WinAPI_ColorRGBToHLS ( $iRGB, ByRef $iHue, ByRef $iLuminance, ByRef $iSaturation )',
    params: [
      {
        label: '$iRGB',
        documentation: 'RGB color.',
      },
      {
        label: 'ByRef $iHue',
        documentation: 'Returns HLS hue value.',
      },
      {
        label: 'ByRef $iLuminance',
        documentation: 'Returns HLS luminance value.',
      },
      {
        label: 'ByRef $iSaturation',
        documentation: 'Returns HLS saturation value.',
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
        documentation:
          'The flags that specify how the output image should be prepared. This parameter can be 0 or any combination of the following values: $CA_NEGATIVE, $CA_LOG_FILTER',
      },
      {
        label: '$iIlluminant',
        documentation:
          'The type of standard light source under which the image is viewed. This parameter can be only one of the following values including $ILLUMINANT_DEVICE_DEFAULT, $ILLUMINANT_A through $ILLUMINANT_NTSC.',
      },
      {
        label: '$iGammaR',
        documentation:
          'The n(th) power gamma-correction value for the red primary of the source colors. The value must be in the range from 2500 to 65,000. A value of 10,000 means no gamma correction.',
      },
      {
        label: '$iGammaG',
        documentation:
          'The n(th) power gamma-correction value for the green primary of the source colors. The value must be in the range from 2500 to 65,000. A value of 10,000 means no gamma correction.',
      },
      {
        label: '$iGammaB',
        documentation:
          'The n(th) power gamma-correction value for the blue primary of the source colors. The value must be in the range from 2500 to 65,000. A value of 10,000 means no gamma correction.',
      },
      {
        label: '$iBlack',
        documentation:
          'The black reference for the source colors. Any colors darker than this are treated as black. The value must be in the range from 0 to 4000.',
      },
      {
        label: '$iWhite',
        documentation:
          'The white reference for the source colors. Any colors lighter than this are treated as white. The value must be in the range from 6000 to 10,000.',
      },
      {
        label: '$iContrast',
        documentation:
          'The amount of contrast to be applied to the source object. The value must be in the range from -100 to 100. A value of 0 means no contrast adjustment.',
      },
      {
        label: '$iBrightness',
        documentation:
          'The amount of brightness to be applied to the source object. The value must be in the range from -100 to 100. A value of 0 means no brightness adjustment.',
      },
      {
        label: '$iColorfulness',
        documentation:
          'The amount of colorfulness to be applied to the source object. The value must be in the range from -100 to 100. A value of 0 means no colorfulness adjustment.',
      },
      {
        label: '$iTint',
        documentation:
          'The amount of red or green tint adjustment to be applied to the source object. The value must be in the range from -100 to 100. Positive numbers adjust toward red; negative toward green. A value of 0 means no tint adjustment.',
      },
    ],
  },
  _WinAPI_GetBValue: {
    documentation: 'Retrieves an intensity value for the blue component of a 32-bit RGB value',
    label: '_WinAPI_GetBValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The RGB color value to set',
      },
    ],
  },
  _WinAPI_GetColorAdjustment: {
    documentation: 'Retrieves the color adjustment for the specified device context (DC)',
    label: '_WinAPI_GetColorAdjustment ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to a device context of the direct color display board in question.',
      },
      {
        label: 'ByRef $aRamp',
        documentation:
          'Returns the 2D array ([r1, g1, b1], [r2, g2, b2], ... [r256, g256, b256]) that is created by this function, and where the function place the current gamma ramp of the color display board. Each element in this array is an integer value with a range from 0 to 65535 which is a mapping between RGB values in the frame buffer and digital-analog-converter (DAC) values.',
      },
    ],
  },
  _WinAPI_GetGValue: {
    documentation: 'Retrieves an intensity value for the green component of a 32-bit RGB value',
    label: '_WinAPI_GetGValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The RGB color value to set',
      },
    ],
  },
  _WinAPI_GetRValue: {
    documentation: 'Retrieves an intensity value for the red component of a 32-bit RGB value',
    label: '_WinAPI_GetRValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The RGB color value to set',
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
        documentation:
          'The color to be inverted. This color can be specified in RGB or BGR format.',
      },
    ],
  },
  _WinAPI_RGB: {
    documentation: 'Creates a RGB color value based on red, green, and blue components',
    label: '_WinAPI_RGB ( $iRed, $iGreen, $iBlue )',
    params: [
      {
        label: '$iRed',
        documentation: 'The intensity of the red color.',
      },
      {
        label: '$iGreen',
        documentation: 'The intensity of the green color.',
      },
      {
        label: '$iBlue',
        documentation: 'The intensity of the blue color.',
      },
    ],
  },
  _WinAPI_SetColorAdjustment: {
    documentation: 'Sets the color adjustment for a device context (DC)',
    label: '_WinAPI_SetColorAdjustment ( $hDC, $tAdjustment )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
      {
        label: '$tAdjustment',
        documentation: '$tagCOLORADJUSTMENT structure containing the color adjustment values.',
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
        documentation: 'Handle to a device context of the direct color display board in question.',
      },
      {
        label: 'Const ByRef $aRamp',
        documentation:
          'The 2D array ([r1, g1, b1], [r2, g2, b2], ... [r256, g256, b256]) that contains the gamma ramp to be set. Each element in this array is an integer value with a range from 0 to 65535 which is a mapping between RGB values in the frame buffer and digital-analog-converter (DAC) values. The RGB values must be stored in the most significant bits of each WORD to increase DAC independence.',
      },
    ],
  },
  _WinAPI_SetUDFColorMode: {
    documentation: 'Sets the color mode for the WinAPIEx library',
    label: '_WinAPI_SetUDFColorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The color mode. This parameter can be one of the following values. $UDF_BGR $UDF_RGB',
      },
    ],
  },
  _WinAPI_SwitchColor: {
    documentation: 'Converts a color from BGR to RGB and vice versa',
    label: '_WinAPI_SwitchColor ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The color to conversion.',
      },
    ],
  },
  _WinAPI_CombineTransform: {
    documentation: 'Concatenates two world-space to page-space transformations',
    label: '_WinAPI_CombineTransform ( $tXFORM1, $tXFORM2 )',
    params: [
      {
        label: '$tXFORM1',
        documentation: '$tagXFORM structure that specifies the first transformation.',
      },
      {
        label: '$tXFORM2',
        documentation: '$tagXFORM structure that specifies the second transformation.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: 'ByRef $tPOINT',
        documentation:
          '$tagPOINT structure or structure of points ("long x1;long y1;...long xN;long yN") containing the x- and y-coordinates to be transformed.',
      },
      {
        label: '$iCount',
        documentation: '[optional] The number of points. Default is 1.',
      },
    ],
  },
  _WinAPI_GetCurrentPosition: {
    documentation: 'Retrieves the current position for the specified device context',
    label: '_WinAPI_GetCurrentPosition ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetGraphicsMode: {
    documentation: 'Retrieves the current graphics mode for the specified device context',
    label: '_WinAPI_GetGraphicsMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetMapMode: {
    documentation: 'Retrieves the current mapping mode',
    label: '_WinAPI_GetMapMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetPosFromRect: {
    documentation: 'Interprets the coordinates of the rectangle as offset and position coordinates',
    label: '_WinAPI_GetPosFromRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetWorldTransform: {
    documentation: 'Retrieves the current world-space to page-space transformation',
    label: '_WinAPI_GetWorldTransform ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_LPtoDP: {
    documentation: 'Converts a logical coordinates into device coordinates',
    label: '_WinAPI_LPtoDP ( $hDC, ByRef $tPOINT [, $iCount = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: 'ByRef $tPOINT',
        documentation:
          '$tagPOINT structure or structure of points ("long x1;long y1;...long xN;long yN") containing the x- and y-coordinates to be transformed.',
      },
      {
        label: '$iCount',
        documentation: '[optional] The number of points. Default is 1.',
      },
    ],
  },
  _WinAPI_ModifyWorldTransform: {
    documentation: 'Changes the world transformation for a device context using the specified mode',
    label: '_WinAPI_ModifyWorldTransform ( $hDC, $tXFORM, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tXFORM',
        documentation:
          '$tagXFORM structure used to modify the world transformation for the given device context.',
      },
      {
        label: '$iMode',
        documentation:
          'Specifies how the transformation data modifies the current world transformation. This parameter must be one of the following values. $MWT_IDENTITY, $MWT_LEFTMULTIPLY, $MWT_RIGHTMULTIPLY',
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
        documentation:
          'The 2D array ([x1, y1, ...], [x2, y2, ...], ... [xN, yN, ...]). Every first two elements from this array specifies a point to be move. Other array elements (if any) do not change.',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start moving at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop moving at.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXOffset',
        documentation: 'The horizontal offset, in logical units.',
      },
      {
        label: '$iYOffset',
        documentation: 'The vertical offset, in logical units.',
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
        documentation:
          'The 2D array ([x1, y1, ...], [x2, y2, ...], ... [xN, yN, ...]). Every first two elements from this array specifies a point to be rotate. Other array elements (if any) do not change.',
      },
      {
        label: '$iXC',
        documentation:
          'The x-coordinates of the point on which there is a rotation, in logical units.',
      },
      {
        label: '$iYC',
        documentation:
          'The y-coordinates of the point on which there is a rotation, in logical units.',
      },
      {
        label: '$fAngle',
        documentation: 'The angle to rotate, in degree.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start rotating at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop rotating at.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXNum',
        documentation: 'The amount by which to multiply the current horizontal extent.',
      },
      {
        label: '$iXDenom',
        documentation: 'The amount by which to divide the current horizontal extent.',
      },
      {
        label: '$iYNum',
        documentation: 'The amount by which to multiply the current vertical extent.',
      },
      {
        label: '$iYDenom',
        documentation: 'The amount by which to divide the current vertical extent.',
      },
    ],
  },
  _WinAPI_SetGraphicsMode: {
    documentation: 'Sets the graphics mode for the specified device context',
    label: '_WinAPI_SetGraphicsMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The graphics mode. This parameter can be one of the following values. $GM_COMPATIBLE $GM_ADVANCED',
      },
    ],
  },
  _WinAPI_SetMapMode: {
    documentation: 'Sets the mapping mode of the specified device context',
    label: '_WinAPI_SetMapMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The new mapping mode. This parameter can be one of the following values. $MM_ANISOTROPIC $MM_HIENGLISH $MM_HIMETRIC $MM_ISOTROPIC $MM_LOENGLISH $MM_LOMETRIC $MM_TEXT $MM_TWIPS',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXExtent',
        documentation: "The window's horizontal extent in logical units.",
      },
      {
        label: '$iYExtent',
        documentation: "The window's vertical extent in logical units.",
      },
    ],
  },
  _WinAPI_SetWindowOrg: {
    documentation: 'Specifies which window point maps to the viewport origin (0,0)',
    label: '_WinAPI_SetWindowOrg ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the brush origin',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the brush origin',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tXFORM',
        documentation: '$tagXFORM structure that contains the transformation data.',
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
        documentation: 'A handle to the window procedure that received the message.',
      },
      {
        label: '$iMsg',
        documentation: 'The message.',
      },
      {
        label: '$wParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
      {
        label: '$lParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
    ],
  },
  _WinAPI_DwmEnableBlurBehindWindow: {
    documentation: 'Enables the blur effect on a specified window',
    label:
      '_WinAPI_DwmEnableBlurBehindWindow ( $hWnd [, $bEnable = True [, $bTransition = False [, $hRgn = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window on which the blur behind data is applied.',
      },
      {
        label: '$bEnable',
        documentation:
          'Specifies whether register or unregister the window handle to DWM blur behind, valid values: True - Register (Default). False - Unregister.',
      },
      {
        label: '$bTransition',
        documentation:
          "Specifies whether colorize transition to match the maximized windows, valid values: True - The window's should be colorized. False - Otherwise (Default).",
      },
      {
        label: '$hRgn',
        documentation:
          'The region within the client area to apply the blur behind. A value of zero (Default) will apply the blur behind the entire client area.',
      },
    ],
  },
  _WinAPI_DwmEnableComposition: {
    documentation: 'Enables or disables Desktop Window Manager (DWM) composition',
    label: '_WinAPI_DwmEnableComposition ( $bEnable )',
    params: [
      {
        label: '$bEnable',
        documentation:
          'Specifies whether enable or disable DWM composition, valid values: True - Enable. False - Disable.',
      },
    ],
  },
  _WinAPI_DwmExtendFrameIntoClientArea: {
    documentation: 'Extends the window frame behind the client area',
    label: '_WinAPI_DwmExtendFrameIntoClientArea ( $hWnd [, $tMARGINS = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window for which the frame is extended into the client area.',
      },
      {
        label: '$tMARGINS',
        documentation:
          '[optional] $tagMARGINS structure that describes the margins to use when extending the frame into the client area. Negative margins are used to create the "sheet of glass" effect where the client area is rendered as a solid surface with no window border (Default).',
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
        documentation: 'Handle to the window for which the attribute data is retrieved.',
      },
      {
        label: '$iAttribute',
        documentation:
          'The attribute to retrieve. This parameter can be one of the following values: **Windows Vista or later** $DWMWA_NCRENDERING_ENABLED return True/False $DWMWA_CAPTION_BUTTON_BOUNDS return $tRect $DWMWA_EXTENDED_FRAME_BOUNDS return $tRect **Windows 8 or later** $DWMWA_CLOAKED return True/False',
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
        documentation:
          'Handle to the window or tab whose bitmaps are being invalidated through this call.',
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
        documentation: 'Handle of the thumbnail to retrieve the source window size from.',
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
        documentation: 'Handle to the window that will use the DWM thumbnail.',
      },
      {
        label: '$hSource',
        documentation: 'Handle to the window to use as the thumbnail source.',
      },
    ],
  },
  _WinAPI_DwmSetColorizationParameters: {
    documentation: 'Sets the colorization parameters for Desktop Window Manager (DWM)',
    label: '_WinAPI_DwmSetColorizationParameters ( $tDWMCP )',
    params: [
      {
        label: '$tDWMCP',
        documentation:
          '$tagDWM_COLORIZATION_PARAMETERS containing the colorization parameters to be set.',
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
        documentation: 'Handle to the window or tab.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the device-independent bitmap (DIB) to represent the specified window.',
      },
      {
        label: '$bFrame',
        documentation:
          '[optional] Specifies whether display a frame around the provided bitmap, valid values: True - Display frame. False - Do not display frame (Default).',
      },
      {
        label: '$tClient',
        documentation:
          "[optional] $tagPOINT structure that contains The offset of a tab window's client region from the host window's frame. This offset enables the tab window's contents to be drawn correctly in a live preview when it is drawn without its frame.",
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
        documentation: 'Handle to the window or tab.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the device-independent bitmap (DIB) to represent the specified window.',
      },
      {
        label: '$bFrame',
        documentation:
          '[optional] Specifies whether display a frame around the provided thumbnail, valid values: True - Display frame. False - Do not display frame (Default).',
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
        documentation: 'The window handle to apply the given attribute.',
      },
      {
        label: '$iAttribute',
        documentation:
          'The attribute to apply to the window. This parameter can be one of the following values:',
      },
      {
        label: '$iData',
        documentation:
          'The value of the attribute. See $iAttribute for specific values, otherwise True/False.',
      },
    ],
  },
  _WinAPI_DwmUnregisterThumbnail: {
    documentation: 'Removes a Desktop Window Manager (DWM) thumbnail relationship',
    label: '_WinAPI_DwmUnregisterThumbnail ( $hThumbnail )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Handle to the thumbnail relationship to be removed.',
      },
    ],
  },
  _WinAPI_DwmUpdateThumbnailProperties: {
    documentation: 'Specifies Desktop Window Manager (DWM) thumbnail properties',
    label:
      '_WinAPI_DwmUpdateThumbnailProperties ( $hThumbnail [, $bVisible = True [, $bClientAreaOnly = False [, $iOpacity = 255 [, $tRectDest = 0 [, $tRectSrc = 0]]]]] )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Handle of the thumbnail to retrieve the source window size from.',
      },
      {
        label: '$bVisible',
        documentation:
          '[optional] Specifies whether make the thumbnail visible or invisible, valid values: True - Visible (Default). False - Invisible.',
      },
      {
        label: '$bClientAreaOnly',
        documentation:
          "[optional] Specifies whether use only the thumbnail source's client area or entire window, valid values: True - Use only source's client area. False - Use entire window (Default).",
      },
      {
        label: '$iOpacity',
        documentation:
          '[optional] The opacity with which to render the thumbnail. 0 is fully transparent while 255 (Default) is fully opaque.',
      },
      {
        label: '$tRectDest',
        documentation:
          '[optional] $tagRECT structure containing the rectangle in the destination window the thumbnail will be rendered. By default, the size of this rectangle equal to the source size of the DWM thumbnail which returns the _WinAPI_DwmQueryThumbnailSourceSize() function.',
      },
      {
        label: '$tRectSrc',
        documentation:
          '[optional] $tagRECT structure containing the rectangle that specifies the region of the source window to use as the thumbnail. By default, the entire window is used as the thumbnail.',
      },
    ],
  },
  _WinAPI_EnumDisplaySettings: {
    documentation: 'Retrieves information about one of the graphics modes for a display device',
    label: '_WinAPI_EnumDisplaySettings ( $sDevice, $iMode )',
    params: [
      {
        label: '$sDevice',
        documentation:
          'The display device about whose graphics mode the function will obtain information. An empty string specifies the current display device on the computer on which the calling process is running.',
      },
      {
        label: '$iMode',
        documentation:
          'The type of information to be retrieved. This value can be a graphics mode index or one of the following values: $ENUM_CURRENT_SETTINGS $ENUM_REGISTRY_SETTINGS The graphics mode indexes start at zero.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iType',
        documentation:
          'The object type to be queried. This parameter can be one of the following values.',
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
        documentation:
          'Handle to the window whose DC is to be retrieved. If this value is 0, _WinAPI_GetDCEx() retrieves the DC for the entire screen.',
      },
      {
        label: '$hRgn',
        documentation: 'A clipping region that may be combined with the visible region of the DC.',
      },
      {
        label: '$iFlags',
        documentation:
          'Flags that specifies how the DC is created. This parameter can be one or more of the following values: $DCX_WINDOW, $DCX_CACHE, $DCX_PARENTCLIP, $DCX_CLIPSIBLINGS, $DCX_CLIPCHILDREN, $DCX_NORESETATTRS, $DCX_LOCKWINDOWUPDATE, $DCX_EXCLUDERGN, $DCX_INTERSECTRGN, $DCX_INTERSECTUPDATE, $DCX_VALIDATE',
      },
    ],
  },
  _WinAPI_GetObjectType: {
    documentation: 'Retrieves the type of the specified object',
    label: '_WinAPI_GetObjectType ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the graphics object.',
      },
    ],
  },
  _WinAPI_PrintWindow: {
    documentation: 'Copies a visual window into the specified device context',
    label: '_WinAPI_PrintWindow ( $hWnd, $hDC [, $bClient = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that will be copied.',
      },
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$bClient',
        documentation:
          '[optional] Specifies whether copies only the client area of the window, valid values: True - Only the client area of the window is copied to device context. False - The entire window is copied (Default).',
      },
    ],
  },
  _WinAPI_RestoreDC: {
    documentation: 'Restores a device context (DC) to the specified state',
    label: '_WinAPI_RestoreDC ( $hDC, $iID )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the DC.',
      },
      {
        label: '$iID',
        documentation:
          'The saved state to be restored. If this parameter is positive, $DC represents a specific instance of the state to be restored. If this parameter is negative, $DC represents an instance relative to the current state. For example, (-1) restores the most recently saved state.',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_AddFontMemResourceEx: {
    documentation: 'Adds the font resource from a memory image to the system',
    label: '_WinAPI_AddFontMemResourceEx ( $pData, $iSize )',
    params: [
      {
        label: '$pData',
        documentation: 'The pointer to a font resource.',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes in the font resource.',
      },
    ],
  },
  _WinAPI_AddFontResourceEx: {
    documentation: 'Adds the font resource from the specified file to the system font table',
    label: '_WinAPI_AddFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that contains a valid font file name. This parameter can specify any of the following files: .fon - Font resource file. .fnt - Raw bitmap font file. .ttf - Raw TrueType file. .ttc - East Asian Windows: TrueType font collection. .fot - TrueType resource file. .otf - PostScript OpenType font. .mmm - Multiple master Type1 font resource file. It must be used with .pfm and .pfb files. .pfb - Type 1 font bits file. It is used with a .pfm file. .pfm - Type 1 font metrics file. It is used with a .pfb file.',
      },
      {
        label: '$iFlag',
        documentation:
          'The characteristics of the font to be added to the system. This parameter can be one of the following values. $FR_PRIVATE $FR_NOT_ENUM',
      },
      {
        label: '$bNotify',
        documentation:
          "Specifies whether sends a WM_FONTCHANGE message, valid values: True - Send the WM_FONTCHANGE message to all top-level windows after changing the pool of font resources. False - Don't send (Default).",
      },
    ],
  },
  _WinAPI_CreateFontEx: {
    documentation: 'Creates a logical font with the specified characteristics',
    label:
      "_WinAPI_CreateFontEx ( $iHeight [, $iWidth = 0 [, $iEscapement = 0 [, $iOrientation = 0 [, $iWeight = 400 [, $bItalic = False [, $bUnderline = False [, $bStrikeOut = False [, $iCharSet = 1 [, $iOutPrecision = 0 [, $iClipPrecision = 0 [, $iQuality = 0 [, $iPitchAndFamily = 0 [, $sFaceName = '' [, $iStyle = 0]]]]]]]]]]]]]] )",
    params: [
      {
        label: '$iHeight',
        documentation: "The height of the font's character cell or character, in logical units.",
      },
      {
        label: '$iWidth',
        documentation: 'The average width, in logical units. Default is 0.',
      },
      {
        label: '$iEscapement',
        documentation:
          'The angle, in tenths of degrees, between the escapement vector and the x-axis of the device. Default is 0',
      },
      {
        label: '$iOrientation',
        documentation:
          "The angle, in tenths of degrees, between each character's base line and the x-axis of the device. Default is 0",
      },
      {
        label: '$iWeight',
        documentation:
          'The weight of the font in the range 0 through 1000, or one of the following values.',
      },
      {
        label: '$bItalic',
        documentation:
          'Specifies whether to set italic font attribute, valid values: True - The attribute is set. False - The attribute is not set (Default).',
      },
      {
        label: '$bUnderline',
        documentation:
          'Specifies whether to set underlined font attribute, valid values: True - The attribute is set. False - The attribute is not set (Default).',
      },
      {
        label: '$bStrikeOut',
        documentation:
          'Specifies whether to set strikeout font attribute, valid values: True - The attribute is set. False - The attribute is not set (Default).',
      },
      {
        label: '$iCharSet',
        documentation: 'The character set. It can be one of the following values.',
      },
      {
        label: '$iOutPrecision',
        documentation: 'The output precision. It can be one of the following values.',
      },
      {
        label: '$iClipPrecision',
        documentation: 'The clipping precision. It can be one or more of the following values.',
      },
      {
        label: '$iQuality',
        documentation: 'The output quality. It can be one of the following values.',
      },
      {
        label: '$iPitchAndFamily',
        documentation: 'The pitch and family of the font',
      },
      {
        label: '$sFaceName',
        documentation:
          'The typeface name of the font (not including style). For example, "Arial", "Tahoma", etc.',
      },
      {
        label: '$iStyle',
        documentation: 'The style of the font. It can be one or more of the following values.',
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
        documentation:
          "A handle to the device context from which to enumerate the fonts. If this parameter is 0, the function uses a DC for the application's current screen.",
      },
      {
        label: '$sFaceName',
        documentation:
          'The typeface name of the font. If this parameter is an empty string (Default), the function enumerates one font is each available typeface name. If this parameter is a valid typeface name, the function enumerates all fonts with the specified name.',
      },
      {
        label: '$iCharSet',
        documentation:
          'The character set. It can be one of the following predefined values. If this parameter is set to $DEFAULT_CHARSET (Default), the function enumerates all uniquely-named fonts in all character sets.',
      },
      {
        label: '$iFontType',
        documentation:
          'The type of the fonts to enumerating. This parameter can be 0 (vector fonts), (-1) (all fonts), or any combination of the following values.',
      },
      {
        label: '$sPattern',
        documentation:
          'The pattern string to include (exclude) the fonts in (from) the enumerating. This makes sense only if the typeface name is not specified. This string can contain wildcard characters.',
      },
      {
        label: '$bExclude',
        documentation:
          'Specifies whether to use the pattern to exclude the fonts, valid values: True - Exclude the matching fonts. False - Include the matching fonts (Default).',
      },
    ],
  },
  _WinAPI_GetFontName: {
    documentation:
      'Retrieves the unique name of the font based on its typeface name, character set, and style',
    label: '_WinAPI_GetFontName ( $sFaceName [, $iStyle = 0 [, $iCharSet = 1]] )',
    params: [
      {
        label: '$sFaceName',
        documentation:
          'The typeface name of the font (not including style). For example, "Arial", "Tahoma", etc.',
      },
      {
        label: '$iStyle',
        documentation:
          'The style of the font. It can be one or more of the following values: $FS_REGULAR Default) $FS_BOLD $FS_ITALIC',
      },
      {
        label: '$iCharSet',
        documentation:
          'The character set. It can be one of the following values: $ANSI_CHARSET $BALTIC_CHARSET $CHINESEBIG5_CHARSET $DEFAULT_CHARSET (Default)...',
      },
    ],
  },
  _WinAPI_GetFontResourceInfo: {
    documentation: 'Retrieves the fontname from the specified font resource file',
    label: '_WinAPI_GetFontResourceInfo ( $sFont [, $bForce = False [, $iFlag = Default]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that names a font resource file. To retrieve a fontname whose information comes from several resource files, they must be separated by "|".',
      },
      {
        label: '$bForce',
        documentation:
          "[optional] Specifies whether adds a file to the font table, valid values: True - Forced add the specified file to the system font table and remove it after retrieving the fontname. False - Don't add and remove (Default).",
      },
      {
        label: '$iFlag',
        documentation:
          '[optional] An integer value. See _WinAPI_GetFontMemoryResourceInfo() for value definition.',
      },
    ],
  },
  _WinAPI_GetFontMemoryResourceInfo: {
    documentation: 'Reads out font information from a TTF loaded into the memory',
    label: '_WinAPI_GetFontMemoryResourceInfo ( $pMemory [, $iFlag = 1] )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer value the struct that contains the binary data of the TTF',
      },
      {
        label: '$iFlag',
        documentation:
          'An integer value. Default is 1 (Font Family name). See remarks for others values',
      },
    ],
  },
  _WinAPI_GetGlyphOutline: {
    documentation: 'Retrieves the outline or bitmap for a character in the TrueType font',
    label: '_WinAPI_GetGlyphOutline ( $hDC, $sChar, $iFormat, ByRef $pBuffer [, $tMAT2 = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context which font is selected.',
      },
      {
        label: '$sChar',
        documentation: 'The character for which data is to be returned.',
      },
      {
        label: '$iFormat',
        documentation:
          'The format of the data that the function retrieves. This parameter can be one of the following values: $GGO_BEZIER, $GGO_BITMAP, $GGO_GLYPH_INDEX, $GGO_GRAY2_BITMAP, $GGO_GRAY4_BITMAP, $GGO_GRAY8_BITMAP, $GGO_METRICS, $GGO_NATIVE, $GGO_UNHINTED',
      },
      {
        label: 'ByRef $pBuffer',
        documentation:
          'Returns a pointer to a memory block (buffer) that receives the outline or bitmap data. Optionally, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself. Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function. If the $GGO_METRICS is specified, this parameter is ignored, and function only returns the information about a glyph.',
      },
      {
        label: '$tMAT2',
        documentation:
          '[optional] $tagMAT2 structure specifying a transformation matrix for the character. If this parameter is 0 (Default), the transformation will not be used (it is identity matrix).',
      },
    ],
  },
  _WinAPI_GetOutlineTextMetrics: {
    documentation: 'Retrieves text metrics for TrueType fonts',
    label: '_WinAPI_GetOutlineTextMetrics ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'A handle to the device context.',
      },
      {
        label: '$sText',
        documentation: 'A character string.',
      },
      {
        label: '$aTab',
        documentation:
          '[optional] The array containing the tab-stop positions, in device units. The tab stops must be sorted in increasing order; the smallest x-value should be the first item in the array. Also, it can be an integer value that is one tab-stop position. In this case, the tab stops are separated by the distance specified by this value. If this parameter is 0 (Default), tabs are expanded to eight times the average character width.',
      },
      {
        label: '$iStart',
        documentation:
          '[optional] The index of array element that contains the first tab-stop position.',
      },
      {
        label: '$iEnd',
        documentation:
          '[optional] The index of array element that contains the last tab-stop position.',
      },
    ],
  },
  _WinAPI_GetTextAlign: {
    documentation: 'Retrieves the text-alignment setting for the specified device context',
    label: '_WinAPI_GetTextAlign ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetTextCharacterExtra: {
    documentation: 'Retrieves the current intercharacter spacing for the specified device context',
    label: '_WinAPI_GetTextCharacterExtra ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetTextColor: {
    documentation: 'Retrieves the current text color for the specified device context',
    label: '_WinAPI_GetTextColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_RemoveFontMemResourceEx: {
    documentation: 'Removes the fonts added from a memory image',
    label: '_WinAPI_RemoveFontMemResourceEx ( $hFont )',
    params: [
      {
        label: '$hFont',
        documentation:
          'Handle to the font-resource. This handle is returned by the _WinAPI_AddFontMemResourceEx() function.',
      },
    ],
  },
  _WinAPI_RemoveFontResourceEx: {
    documentation: 'Removes the fonts in the specified file from the system font table',
    label: '_WinAPI_RemoveFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that names a font resource file. To remove a font whose information comes from several resource files, they must be separated by a "|".',
      },
      {
        label: '$iFlag',
        documentation:
          'The characteristics of the font to be removed from the system. In order for the font to be removed, the flags used must be the same as when the font was added with the _WinAPI_AddFontResourceEx() function.',
      },
      {
        label: '$bNotify',
        documentation:
          "Specifies whether sends a WM_FONTCHANGE message, valid values: True - Send the WM_FONTCHANGE message to all top-level windows after changing the pool of font resources. False - Don't send (Default).",
      },
    ],
  },
  _WinAPI_SetTextAlign: {
    documentation: 'Sets the text-alignment flags for the specified device context',
    label: '_WinAPI_SetTextAlign ( $hDC [, $iMode = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          '[optional] The text alignment by using a mask of the values in the following list. Only one flag can be chosen from those that affect horizontal and vertical alignment.',
      },
    ],
  },
  _WinAPI_SetTextCharacterExtra: {
    documentation: 'Sets the intercharacter spacing for the specified device context',
    label: '_WinAPI_SetTextCharacterExtra ( $hDC, $iCharExtra )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iCharExtra',
        documentation:
          'The amount of extra space, in logical units, to be added to each character.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iBreakExtra',
        documentation: 'The total extra space, in logical units, to be added to the line of text.',
      },
      {
        label: '$iBreakCount',
        documentation: 'The number of break characters in the line.',
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
        documentation: 'A handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the starting point of the string, in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the starting point of the string, in logical units.',
      },
      {
        label: '$sText',
        documentation: 'The character string to draw.',
      },
      {
        label: '$aTab',
        documentation:
          'The array containing the tab-stop positions, in logical units. The tab stops must be sorted in increasing order; the smallest x-value should be the first item in the array. Also, it can be an integer value that is one tab-stop position. In this case, the tab stops are separated by the distance specified by this value. If this parameter is 0, tabs are expanded to eight times the average character width.',
      },
      {
        label: '$iStart',
        documentation: 'The index of array element that contains the first tab-stop position.',
      },
      {
        label: '$iEnd',
        documentation: 'The index of array element that contains the last tab-stop position.',
      },
      {
        label: '$iOrigin',
        documentation:
          'The x-coordinate of the starting position from which tabs are expanded, in logical units. This allows an application to call the function several times for a single line.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation:
          'The x-coordinate, in logical coordinates, of the reference point that the system uses to align the string.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate, in logical coordinates, of the reference point that the system uses to align the string.',
      },
      {
        label: '$sText',
        documentation: 'The string to be drawn.',
      },
    ],
  },
  _WinAPI_AngleArc: {
    documentation: 'Draws a line segment and an arc',
    label: '_WinAPI_AngleArc ( $hDC, $iX, $iY, $iRadius, $nStartAngle, $nSweepAngle )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the center of the circle.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the center of the circle.',
      },
      {
        label: '$iRadius',
        documentation: 'The radius, in logical units, of the circle.',
      },
      {
        label: '$nStartAngle',
        documentation: 'The start angle, in degrees, relative to the x-axis.',
      },
      {
        label: '$nSweepAngle',
        documentation: 'The sweep angle, in degrees, relative to the starting angle.',
      },
    ],
  },
  _WinAPI_Arc: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_Arc ( $hDC, $tRECT, $iXStartArc, $iYStartArc, $iXEndArc, $iYEndArc )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the bounding rectangle.',
      },
      {
        label: '$iXStartArc',
        documentation:
          'The x-coordinate, in logical units, of the ending point of the radial line defining the starting point of the arc.',
      },
      {
        label: '$iYStartArc',
        documentation:
          'The y-coordinate, in logical units, of the ending point of the radial line defining the starting point of the arc.',
      },
      {
        label: '$iXEndArc',
        documentation:
          'The x-coordinate, in logical units, of the ending point of the radial line defining the ending point of the arc.',
      },
      {
        label: '$iYEndArc',
        documentation:
          'The y-coordinate, in logical units, of the ending point of the radial line defining the ending point of the arc.',
      },
    ],
  },
  _WinAPI_ArcTo: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_ArcTo ( $hDC, $tRECT, $iXRadial1, $iYRadial1, $iXRadial2, $iYRadial2 )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the bounding rectangle.',
      },
      {
        label: '$iXRadial1',
        documentation:
          'The x-coordinate, in logical units, of the endpoint of the radial defining the starting point of the arc.',
      },
      {
        label: '$iYRadial1',
        documentation:
          'The y-coordinate, in logical units, of the endpoint of the radial defining the starting point of the arc.',
      },
      {
        label: '$iXRadial2',
        documentation:
          'The x-coordinate, in logical units, of the endpoint of the radial defining the ending point of the arc.',
      },
      {
        label: '$iYRadial2',
        documentation:
          'The y-coordinate, in logical units, of the endpoint of the radial defining the ending point of the arc.',
      },
    ],
  },
  _WinAPI_GetArcDirection: {
    documentation: 'Retrieves the current arc direction for the specified device context',
    label: '_WinAPI_GetArcDirection ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_LineDDA: {
    documentation: 'Determines which pixels should be highlighted for a line',
    label: '_WinAPI_LineDDA ( $iX1, $iY1, $iX2, $iY2, $pLineProc [, $pData = 0] )',
    params: [
      {
        label: '$iX1',
        documentation:
          "Specifies the x-coordinate, in logical units, of the line's starting point.",
      },
      {
        label: '$iY1',
        documentation:
          "Specifies the y-coordinate, in logical units, of the line's starting point.",
      },
      {
        label: '$iX2',
        documentation: "Specifies the x-coordinate, in logical units, of the line's ending point.",
      },
      {
        label: '$iY2',
        documentation: "Specifies the y-coordinate, in logical units, of the line's ending point.",
      },
      {
        label: '$pLineProc',
        documentation: 'Pointer to an application-defined callback function.',
      },
      {
        label: '$pData',
        documentation: '[optional] Pointer to the application-defined data.',
      },
    ],
  },
  _WinAPI_MoveToEx: {
    documentation: 'Updates the current position to the specified point',
    label: '_WinAPI_MoveToEx ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the brush origin',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the brush origin',
      },
    ],
  },
  _WinAPI_PolyBezier: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezier ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: 'Const ByRef $aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the endpoints and control points of the curve(s), in logical units. The number of points must be one more than three times the number of curves to be drawn, because each Bezier curve requires two control points and an endpoint, and the initial curve requires an additional starting point.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_PolyBezierTo: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezierTo ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: 'Const ByRef $aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the endpoints and control points of the curve(s), in logical units. The number of points must be three times the number of curves to be drawn, because each Bezier curve requires two control points and an ending point.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_PolyDraw: {
    documentation: 'Draws a set of line segments and Bezier curves',
    label: '_WinAPI_PolyDraw ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: 'Const ByRef $aPoint',
        documentation:
          'The 2D array ([x1, y1, type1], [x2, y2, type2], ... [xN, yN, typeN]) that contains the endpoints for each line segment and the endpoints and control points for each Bezier curve, in logical units.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_SetArcDirection: {
    documentation: 'Sets the drawing arc direction',
    label: '_WinAPI_SetArcDirection ( $hDC, $iDirection )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iDirection',
        documentation:
          'The new arc direction. This parameter can be one of the following values. $AD_COUNTERCLOCKWISE $AD_CLOCKWISE',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_CopyEnhMetaFile: {
    documentation: 'Copies the contents of an enhanced-format metafile to a specified file',
    label: "_WinAPI_CopyEnhMetaFile ( $hEmf [, $sFilePath = ''] )",
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile to be copied.',
      },
      {
        label: '$sFilePath',
        documentation:
          "[optional] The name of the destination file (.emf). If this parameter is '' (Default), the source metafile is copied to memory.",
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
        documentation: 'Handle to an enhanced metafile.',
      },
    ],
  },
  _WinAPI_GdiComment: {
    documentation: 'Copies a comment from a buffer into a specified enhanced-format metafile',
    label: '_WinAPI_GdiComment ( $hDC, $pBuffer, $iSize )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to an enhanced-metafile device context.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to the buffer that contains the comment.',
      },
      {
        label: '$iSize',
        documentation: 'The length of the comment buffer, in bytes.',
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
        documentation: 'The name of an enhanced metafile (.emf).',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileBits: {
    documentation: 'Retrieves the contents of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileBits ( $hEmf, ByRef $pBuffer )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
      {
        label: 'ByRef $pBuffer',
        documentation:
          'Returns a pointer to a memory block (buffer) that receives the metafile data. Optionaly, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself. Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDescription: {
    documentation: 'Retrieves an optional text description from an enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDescription ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDimension: {
    documentation: 'Retrieves a dimension of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDimension ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile to retrieve dimension.',
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
        documentation: 'Handle to the enhanced metafile for which the header is to be retrieved.',
      },
    ],
  },
  _WinAPI_PlayEnhMetaFile: {
    documentation: 'Displays the picture stored in the specified enhanced-format metafile',
    label: '_WinAPI_PlayEnhMetaFile ( $hDC, $hEmf, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation:
          'Handle to the device context for the output device on which the picture will appear.',
      },
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the bounding rectangle used to display the picture, in logical units',
      },
    ],
  },
  _WinAPI_SetEnhMetaFileBits: {
    documentation: 'Creates a memory-based enhanced-format metafile from the specified data',
    label: '_WinAPI_SetEnhMetaFileBits ( $pData, $iLength )',
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the enhanced-metafile data. To obtain the metafile data, call the _WinAPI_GetEnhMetaFileBits() function.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
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
        label: '$tPOINT',
        documentation:
          '$tagPOINT structure that specifies the point of interest in virtual-screen coordinates.',
      },
      {
        label: '$iFlag',
        documentation:
          "[optional] The flag that specifies the function's return value if the point is not contained within any display monitor. This parameter can be one of the following values.",
      },
    ],
  },
  _WinAPI_MonitorFromRect: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with a specified rectangle',
    label: '_WinAPI_MonitorFromRect ( $tRECT [, $iFlag = 1] )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that specifies the rectangle of interest in virtual-screen coordinates.',
      },
      {
        label: '$iFlag',
        documentation:
          "[optional] The flag that specifies the function's return value if the rectangle does not intersect any display monitor.",
      },
    ],
  },
  _WinAPI_MonitorFromWindow: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with the specified window',
    label: '_WinAPI_MonitorFromWindow ( $hWnd [, $iFlag = 1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window of interest.',
      },
      {
        label: '$iFlag',
        documentation:
          "[optional] The flag that specifies the function's return value if the window does not intersect any display monitor. This parameter can be one of the following values. $MONITOR_DEFAULTTONULL $MONITOR_DEFAULTTONEAREST (Default) $MONITOR_DEFAULTTOPRIMARY",
      },
    ],
  },
  _WinAPI_BeginPaint: {
    documentation: 'Prepares the specified window for painting',
    label: '_WinAPI_BeginPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be repainted.',
      },
      {
        label: 'ByRef $tPAINTSTRUCT',
        documentation:
          '$tagPAINTSTRUCT structure that will receive painting information. When the function call, this parameter should be any valid variable, the function creates this structure itself.',
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
        documentation: 'Handle to the window whose caption should be animated on the screen.',
      },
      {
        label: '$tRectFrom',
        documentation:
          '$tagRECT structure specifying the location and size of the icon or minimized window.',
      },
      {
        label: '$tRectTo',
        documentation:
          '$tagRECT structure specifying the location and size of the restored window.',
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
        documentation: 'Handle to a device context.',
      },
      {
        label: '$sText',
        documentation: 'The string that contains the text to be drawn.',
      },
      {
        label: '$iRGBText',
        documentation: 'The color of the text, in RGB.',
      },
      {
        label: '$iRGBShadow',
        documentation: 'The color of the shadow, in RGB.',
      },
      {
        label: '$iXOffset',
        documentation: '[optional] The x-coordinate of where the text should begin. Default is 0.',
      },
      {
        label: '$iYOffset',
        documentation: '[optional] The y-coordinate of where the text should begin. Default is 0.',
      },
      {
        label: '$tRECT',
        documentation:
          '[optional] $tagRECT structure that contains, in logical coordinates, the rectangle in which the text is to be drawn. If this parameter is 0 (Default), the size will be equal size of the device context ($hDC).',
      },
      {
        label: '$iFlags',
        documentation:
          '[optional] The flags that specifies how the text is to be drawn. This parameter can be a combination of the formatting text constants ($DT_*), (Default $DT_LEFT).',
      },
    ],
  },
  _WinAPI_EndPaint: {
    documentation: 'Marks the end of painting in the specified window',
    label: '_WinAPI_EndPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that has been repainted.',
      },
      {
        label: 'ByRef $tPAINTSTRUCT',
        documentation:
          '$tagPAINTSTRUCT structure that contains the painting information retrieved by _WinAPI_BeginPaint().',
      },
    ],
  },
  _WinAPI_GetBkColor: {
    documentation: 'Retrieves the current background color for the specified device context',
    label: '_WinAPI_GetBkColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetBoundsRect: {
    documentation:
      'Obtains the current accumulated bounding rectangle for a specified device context',
    label: '_WinAPI_GetBoundsRect ( $hDC [, $iFlags = 0] )',
    params: [
      {
        label: '$hDC',
        documentation:
          'Handle to the device context whose bounding rectangle the function will return.',
      },
      {
        label: '$iFlags',
        documentation:
          '[optional] The flags that specifies how the function will behave. This parameter can be the following value: $DCB_RESET',
      },
    ],
  },
  _WinAPI_GetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_GetROP2 ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetUpdateRect: {
    documentation:
      'Retrieves the coordinates of the rectangle that completely encloses the update region of the specified window',
    label: '_WinAPI_GetUpdateRect ( $hWnd [, $bErase = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose update region is to be retrieved.',
      },
      {
        label: '$bErase',
        documentation:
          '[optional] Specifies whether the background in the update region is to be erased, valid values: True - The background is erased (Default). False - The background remains unchanged.',
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
        documentation: 'Handle to the window with an update region that is to be retrieved.',
      },
      {
        label: '$hRgn',
        documentation: 'Handle to the region to receive the update region.',
      },
      {
        label: '$bErase',
        documentation:
          '[optional] Specifies whether the background in the update region is to be erased, valid values: True - The background is erased (Default). False - The background remains unchanged.',
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
        documentation: 'Handle to the window.',
      },
      {
        label: 'ByRef $tRECT',
        documentation:
          'Returns a $tagRECT structure that is created by this function, and contains the rectangle dimensions, in device units relative to the upper-left corner of the window.',
      },
    ],
  },
  _WinAPI_InvalidateRgn: {
    documentation: "Adds a region to the specified window's update region",
    label: '_WinAPI_InvalidateRgn ( $hWnd [, $hRgn = 0 [, $bErase = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window with an update region that is to be modified.',
      },
      {
        label: '$hRgn',
        documentation:
          '[optional] Handle to the region to be added to the update region. The region is assumed to have client coordinates. If this parameter is 0, the entire client area is added to the update region.',
      },
      {
        label: '$bErase',
        documentation:
          '[optional] Specifies whether the background within the update region is to be erased when the update region is processed, valid values: True - The background is erased (Default). False - The background remains unchanged.',
      },
    ],
  },
  _WinAPI_LockWindowUpdate: {
    documentation: 'Disables or enables drawing in the specified window',
    label: '_WinAPI_LockWindowUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window in which drawing will be disabled. If this parameter is 0, drawing in the locked window is enabled.',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context for which to accumulate bounding rectangles.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specifies how the new rectangle will be combined with the accumulated rectangle. This parameter can be one of more of the following values. $DCB_ACCUMULATE $DCB_DISABLE $DCB_ENABLE $DCB_RESET',
      },
      {
        label: '$tRECT',
        documentation:
          '[optional] $tagRECT structure used to set the bounding rectangle in logical coordinates.',
      },
    ],
  },
  _WinAPI_SetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_SetROP2 ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation: 'The mix mode. This parameter can be one of the following values.',
      },
    ],
  },
  _WinAPI_ValidateRect: {
    documentation: 'Removes a rectangle from the current update region of the specified window',
    label: '_WinAPI_ValidateRect ( $hWnd [, $tRECT = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window whose update region is to be modified. If this parameter is 0, the system invalidates and redraws all windows and sends the WM_ERASEBKGND and WM_NCPAINT messages to the window procedure before the function returns.',
      },
      {
        label: '$tRECT',
        documentation:
          '[optional] $tagRECT structure that contains the client coordinates of the rectangle to be removed from the update region. If this parameter is 0 (Default), the entire client area is removed.',
      },
    ],
  },
  _WinAPI_ValidateRgn: {
    documentation: 'Removes a region from the current update region of the specified window',
    label: '_WinAPI_ValidateRgn ( $hWnd [, $hRgn = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose update region is to be modified.',
      },
      {
        label: '$hRgn',
        documentation:
          '[optional] Handle to a region that defines the area to be removed from the update region. If this parameter is 0 (Default), the entire client area is removed.',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_AbortPath: {
    documentation: 'Closes and discards any paths in the specified device context',
    label: '_WinAPI_AbortPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_BeginPath: {
    documentation: 'Opens a path bracket in the specified device context',
    label: '_WinAPI_BeginPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_CloseFigure: {
    documentation: 'Closes an open figure in a path',
    label: '_WinAPI_CloseFigure ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_StrokePath: {
    documentation: 'Renders the specified path by using the current pen',
    label: '_WinAPI_StrokePath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
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
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_CopyRect: {
    documentation: 'Copies the coordinates of one rectangle to another',
    label: '_WinAPI_CopyRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_EqualRect: {
    documentation: 'Determines whether the two specified rectangles are equal',
    label: '_WinAPI_EqualRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the first rectangle.',
      },
      {
        label: '$tRECT2',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the second rectangle.',
      },
    ],
  },
  _WinAPI_InflateRect: {
    documentation: 'Increases or decreases the width and height of the specified rectangle',
    label: '_WinAPI_InflateRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: 'ByRef $tRECT',
        documentation: '$tagRECT structure that increases or decreases in size.',
      },
      {
        label: '$iDX',
        documentation: 'The amount to increase or decrease (negative value) the rectangle width.',
      },
      {
        label: '$iDY',
        documentation: 'The amount to increase or decrease (negative value) the rectangle height.',
      },
    ],
  },
  _WinAPI_IntersectRect: {
    documentation: 'Creates the intersection of two rectangles',
    label: '_WinAPI_IntersectRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: '$tagRECT structure that contains the first source rectangle.',
      },
      {
        label: '$tRECT2',
        documentation: '$tagRECT structure that contains the second source rectangle.',
      },
    ],
  },
  _WinAPI_IsRectEmpty: {
    documentation: 'Determines whether the specified rectangle is empty',
    label: '_WinAPI_IsRectEmpty ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_OffsetRect: {
    documentation: 'Moves the specified rectangle by the specified offsets',
    label: '_WinAPI_OffsetRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: 'ByRef $tRECT',
        documentation: '$tagRECT structure that to be moved.',
      },
      {
        label: '$iDX',
        documentation: 'The amount to move the rectangle left (negative value) or right.',
      },
      {
        label: '$iDY',
        documentation: 'The amount to move the rectangle up (negative value) or down.',
      },
    ],
  },
  _WinAPI_PtInRectEx: {
    documentation: 'Determines whether the specified point lies within the specified rectangle',
    label: '_WinAPI_PtInRectEx ( $iX, $iY, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point.',
      },
      {
        label: '$iLeft',
        documentation: 'The x-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iTop',
        documentation: 'The y-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iRight',
        documentation: 'The x-coordinate of the lower-right corner of the rectangle.',
      },
      {
        label: '$iBottom',
        documentation: 'The y-coordinate of the lower-right corner of the rectangle.',
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
        documentation:
          '$tagRECT structure from which the function subtracts the rectangle specified by $tRECT2.',
      },
      {
        label: '$tRECT2',
        documentation:
          '$tagRECT structure that the function subtracts from the rectangle specified by $tRECT1.',
      },
    ],
  },
  _WinAPI_UnionRect: {
    documentation: 'Creates the union of two rectangles',
    label: '_WinAPI_UnionRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: '$tagRECT structure that contains the first source rectangle.',
      },
      {
        label: '$tRECT2',
        documentation: '$tagRECT structure that contains the second source rectangle.',
      },
    ],
  },
  _WinAPI_CreateEllipticRgn: {
    documentation: 'Creates an elliptical region',
    label: '_WinAPI_CreateEllipticRgn ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
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
        label: 'Const ByRef $aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the vertices of the polygon in logical units. The polygon is presumed closed.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start creating at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop creating at.',
      },
      {
        label: '$iMode',
        documentation:
          '[optional] The fill mode used to determine which pixels are in the region. This parameter can be one of the following values: $ALTERNATE (Default) $WINDING',
      },
    ],
  },
  _WinAPI_CreateRectRgnIndirect: {
    documentation: 'Creates a rectangular region',
    label: '_WinAPI_CreateRectRgnIndirect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_EqualRgn: {
    documentation: 'Checks the two specified regions to determine whether they are identical',
    label: '_WinAPI_EqualRgn ( $hRgn1, $hRgn2 )',
    params: [
      {
        label: '$hRgn1',
        documentation: 'Handle to a region.',
      },
      {
        label: '$hRgn2',
        documentation: 'Handle to a region.',
      },
    ],
  },
  _WinAPI_ExtCreateRegion: {
    documentation: 'Creates a region from the specified region and transformation data',
    label: '_WinAPI_ExtCreateRegion ( $tRGNDATA [, $tXFORM = 0] )',
    params: [
      {
        label: '$tRGNDATA',
        documentation: '$tagRGNDATA structure that contains the region data in logical units.',
      },
      {
        label: '$tXFORM',
        documentation:
          '[optional] $tagXFORM structure that defines the transformation to be performed on the region.',
      },
    ],
  },
  _WinAPI_FillRgn: {
    documentation: 'Fills a region by using the specified brush',
    label: '_WinAPI_FillRgn ( $hDC, $hRgn, $hBrush )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be filled. The region's coordinates are presumed to be in logical units.",
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush to be used to fill the region.',
      },
    ],
  },
  _WinAPI_FrameRgn: {
    documentation: 'Draws a border around the specified region by using the specified brush',
    label: '_WinAPI_FrameRgn ( $hDC, $hRgn, $hBrush, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be enclosed in a border. The region's coordinates are presumed to be in logical units.",
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush to be used to draw the border.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of vertical brush strokes.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of horizontal brush strokes.',
      },
    ],
  },
  _WinAPI_GetPolyFillMode: {
    documentation: 'Retrieves the current polygon fill mode',
    label: '_WinAPI_GetPolyFillMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
    ],
  },
  _WinAPI_GetRegionData: {
    documentation: 'Fills the specified buffer with data describing a region',
    label: '_WinAPI_GetRegionData ( $hRgn, ByRef $tRGNDATA )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: 'ByRef $tRGNDATA',
        documentation:
          'Returns a $tagRGNDATA structure that is created by this function, and contains the region data, in logical units.',
      },
    ],
  },
  _WinAPI_GetRgnBox: {
    documentation: 'Retrieves the bounding rectangle of the specified region',
    label: '_WinAPI_GetRgnBox ( $hRgn, ByRef $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: 'ByRef $tRECT',
        documentation:
          'Returns a $tagRECT structure that is created by this function, and contains the bounding rectangle, in logical units.',
      },
    ],
  },
  _WinAPI_InvertRgn: {
    documentation: 'Inverts the colors in the specified region',
    label: '_WinAPI_InvertRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region for which colors are inverted. The region's coordinates are presumed to be logical coordinates.",
      },
    ],
  },
  _WinAPI_OffsetRgn: {
    documentation: 'Moves a region by the specified offsets',
    label: '_WinAPI_OffsetRgn ( $hRgn, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region to be moved.',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
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
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be filled. The region's coordinates are presumed to be logical coordinates.",
      },
    ],
  },
  _WinAPI_PtInRegion: {
    documentation: 'Determines whether the specified point is inside the specified region',
    label: '_WinAPI_PtInRegion ( $hRgn, $iX, $iY )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region to be examined.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point in logical units.',
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
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the rectangle in logical units.',
      },
    ],
  },
  _WinAPI_SetPolyFillMode: {
    documentation: 'Sets the polygon fill mode for functions that fill polygons',
    label: '_WinAPI_SetPolyFillMode ( $hDC [, $iMode = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          '[optional] The new fill mode. This parameter can be one of the following values. $ALTERNATE (Default) $WINDING',
      },
    ],
  },
  _WinAPI_SetRectRgn: {
    documentation: 'Converts a region into a rectangular region with the specified coordinates',
    label: '_WinAPI_SetRectRgn ( $hRgn, $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the rectangular region in logical units.',
      },
    ],
  },
  _WinAPI_Ellipse: {
    documentation: 'Draws an ellipse',
    label: '_WinAPI_Ellipse ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
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
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_Polygon: {
    documentation: 'Draws a polygon consisting of two or more vertices connected by straight lines',
    label: '_WinAPI_Polygon ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: 'Const ByRef $aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the vertices of the polygon in logical units. The polygon is closed automatically by drawing a line from the last vertex to the first.',
      },
      {
        label: '$iStart',
        documentation: '[optional] The index of array to start creating at.',
      },
      {
        label: '$iEnd',
        documentation: '[optional] The index of array to stop creating at.',
      },
    ],
  },
  _WinAPI_Rectangle: {
    documentation: 'Draws a rectangle',
    label: '_WinAPI_Rectangle ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation: 'Pointer to a $tagRECT structure containing the rectangle coordinates',
      },
    ],
  },
  _WinAPI_RoundRect: {
    documentation: 'Draws a rectangle with rounded corners',
    label: '_WinAPI_RoundRect ( $hDC, $tRECT, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the logical coordinates of the rectangle.',
      },
      {
        label: '$iWidth',
        documentation:
          'The width, in logical coordinates, of the ellipse used to draw the rounded corners.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height, in logical coordinates, of the ellipse used to draw the rounded corners.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
