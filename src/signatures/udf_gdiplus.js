import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GDIPlus.au3>`)';

const signatures = {
  _GDIPlus_ArrowCapCreate: {
    documentation: 'Creates an adjustable arrow line cap with the specified height and width',
    label: '_GDIPlus_ArrowCapCreate ( $fHeight, $fWidth [, $bFilled = True] )',
    params: [
      {
        label: '$fHeight',
        documentation: 'Specifies the length, in units, of the arrow from its base to its point',
      },
      {
        label: '$fWidth',
        documentation:
          'Specifies the distance, in units, between the corners of the base of the arrow',
      },
      {
        label: '$bFilled',
        documentation:
          '**[optional]** Fill flag:    True - Arrow will be filled    False - Arrow will not be filled',
      },
    ],
  },
  _GDIPlus_ArrowCapDispose: {
    documentation: 'Release an adjustable arrow line cap object',
    label: '_GDIPlus_ArrowCapDispose ( $hCap )',
    params: [
      {
        label: '$hCap',
        documentation: 'Handle to an adjustable arrow line cap object',
      },
    ],
  },
  _GDIPlus_ArrowCapGetFillState: {
    documentation: 'Determines whether the arrow cap is filled',
    label: '_GDIPlus_ArrowCapGetFillState ( $hArrowCap )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
    ],
  },
  _GDIPlus_ArrowCapGetHeight: {
    documentation: 'Gets the height of the arrow cap',
    label: '_GDIPlus_ArrowCapGetHeight ( $hArrowCap )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
    ],
  },
  _GDIPlus_ArrowCapGetMiddleInset: {
    documentation: 'Gets the value of the inset',
    label: '_GDIPlus_ArrowCapGetMiddleInset ( $hArrowCap )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
    ],
  },
  _GDIPlus_ArrowCapGetWidth: {
    documentation: 'Gets the width of the arrow cap',
    label: '_GDIPlus_ArrowCapGetWidth ( $hArrowCap )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
    ],
  },
  _GDIPlus_ArrowCapSetFillState: {
    documentation: 'Sets whether the arrow cap is filled',
    label: '_GDIPlus_ArrowCapSetFillState ( $hArrowCap [, $bFilled = True] )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
      {
        label: '$bFilled',
        documentation:
          '**[optional]** Fill state:    True - Arrow cap is filled    False - Arrow cap is not filled',
      },
    ],
  },
  _GDIPlus_ArrowCapSetHeight: {
    documentation: 'Sets the height of the arrow cap',
    label: '_GDIPlus_ArrowCapSetHeight ( $hArrowCap, $fHeight )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
      {
        label: '$fHeight',
        documentation: 'Specifies the length, in units, of the arrow from its base to its point',
      },
    ],
  },
  _GDIPlus_ArrowCapSetMiddleInset: {
    documentation: 'Gets the value of the inset',
    label: '_GDIPlus_ArrowCapSetMiddleInset ( $hArrowCap, $fInset )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
      {
        label: '$fInset',
        documentation: 'Inset value',
      },
    ],
  },
  _GDIPlus_ArrowCapSetWidth: {
    documentation: 'Sets the width of the arrow cap',
    label: '_GDIPlus_ArrowCapSetWidth ( $hArrowCap, $fWidth )',
    params: [
      {
        label: '$hArrowCap',
        documentation: 'Handle to a ArrowCap object',
      },
      {
        label: '$fWidth',
        documentation:
          'Specifies the width, in units, of the arrow between the endpoints of the base of the arrow',
      },
    ],
  },
  _GDIPlus_BitmapApplyEffect: {
    documentation: 'Alters a Bitmap by applying a specified effect',
    label: '_GDIPlus_BitmapApplyEffect ( $hBitmap, $hEffect [, $tRECT = Null] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect to be applied.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** a $tagRECT structure that specifies the portion of the input bitmap to which the effect is applied.',
      },
    ],
  },
  _GDIPlus_BitmapApplyEffectEx: {
    documentation: 'Alters a Bitmap by applying a specified effect',
    label:
      '_GDIPlus_BitmapApplyEffectEx ( $hBitmap, $hEffect [, $iX = 0 [, $iY = 0 [, $iW = 0 [, $iH = 0]]]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect to be applied.',
      },
      {
        label: '$iX',
        documentation:
          '**[optional]** The X coordinate of the upper left corner of the portion to which the effect is applied.',
      },
      {
        label: '$iY',
        documentation:
          '**[optional]** The Y coordinate of the upper left corner of the portion to which the effect is applied.',
      },
      {
        label: '$iW',
        documentation:
          '**[optional]** Specifies the width of the portion to which the effect is applied.',
      },
      {
        label: '$iH',
        documentation:
          '**[optional]** Specifies the height of the portion to which the effect is applied.',
      },
    ],
  },
  _GDIPlus_BitmapCloneArea: {
    documentation: 'Create a clone of a Bitmap object from the coordinates and format specified',
    label:
      '_GDIPlus_BitmapCloneArea ( $hBitmap, $nLeft, $nTop, $nWidth, $nHeight [, $iFormat = 0x00021808] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap object',
      },
      {
        label: '$nLeft',
        documentation: 'X coordinate of upper left corner of the rectangle to copy',
      },
      {
        label: '$nTop',
        documentation: 'Y coordinate of upper left corner of the rectangle to copy',
      },
      {
        label: '$nWidth',
        documentation:
          'The width of the rectangle that specifies the portion of this bitmap to copy',
      },
      {
        label: '$nHeight',
        documentation:
          'The height of the rectangle that specifies the portion of this bitmap to copy',
      },
      {
        label: '$iFormat',
        documentation:
          '**[optional]** Pixel format for the new bitmap:    $GDIP_PXF01INDEXED = 1 bit per pixel, indexed    $GDIP_PXF04INDEXED = 4 bits per pixel, indexed    $GDIP_PXF08INDEXED = 8 bits per pixel, indexed    $GDIP_PXF16GRAYSCALE = 16 bits per pixel, grayscale    $GDIP_PXF16RGB555 = 16 bits per pixel; 5 bits for each RGB component    $GDIP_PXF16RGB565 = 16 bits per pixel; 5 bits for red, 6 bits for green and 5 bits blue    $GDIP_PXF16ARGB1555 = 16 bits per pixel; 1 bit for alpha and 5 bits for each RGB component    $GDIP_PXF24RGB = 24 bits per pixel; 8 bits for each RGB component    $GDIP_PXF32RGB = 32 bits per pixel; 8 bits for each RGB component. No alpha component.    $GDIP_PXF32ARGB = 32 bits per pixel; 8 bits for each RGB and alpha component    $GDIP_PXF32PARGB = 32 bits per pixel; 8 bits for each RGB and alpha component, pre-multiplied    $GDIP_PXF48RGB = 48 bits per pixel; 16 bits for each RGB component    $GDIP_PXF64ARGB = 64 bits per pixel; 16 bits for each RGB and alpha component    $GDIP_PXF64PARGB = 64 bits per pixel; 16 bits for each RGB and alpha component, pre-multiplied',
      },
    ],
  },
  _GDIPlus_BitmapConvertFormat: {
    documentation: 'Converts a bitmap to a specified pixel format',
    label:
      '_GDIPlus_BitmapConvertFormat ( $hBitmap, $iPixelFormat, $iDitherType, $iPaletteType, $tPalette [, $fAlphaThresholdPercent = 0.0] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$iPixelFormat',
        documentation: 'Pixel format constant that specifies the new pixel format ($GDIP_PXF*).',
      },
      {
        label: '$iDitherType',
        documentation:
          'DitherType constant that specifies the dithering algorithm ($GDIP_DitherType*).',
      },
      {
        label: '$iPaletteType',
        documentation:
          'PaletteType constant that specifies a standard palette to be used for dithering ($GDIP_PaletteType*).',
      },
      {
        label: '$tPalette',
        documentation:
          'Structure that specifies the palette whose indexes are stored in the pixel data of the converted bitmap.',
      },
      {
        label: '$fAlphaThresholdPercent',
        documentation:
          '**[optional]** Real number in the range 0.0 through 100.0 that specifies which pixels in the source bitmap will map to the transparent color in the converted bitmap.',
      },
    ],
  },
  _GDIPlus_BitmapCreateApplyEffect: {
    documentation: 'Creates a new Bitmap by applying a specified effect to an existing Bitmap',
    label:
      '_GDIPlus_BitmapCreateApplyEffect ( $hBitmap, $hEffect [, $tRECT = Null [, $tOutRECT = Null]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect to be applied.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** a $tagRECT structure that specifies the portion of the input bitmap that is used.',
      },
      {
        label: '$tOutRECT',
        documentation:
          '**[optional]** a $tagRECT structure that receives the portion of the input bitmap that was used.',
      },
    ],
  },
  _GDIPlus_BitmapCreateApplyEffectEx: {
    documentation: 'Creates a new Bitmap by applying a specified effect to an existing Bitmap',
    label:
      '_GDIPlus_BitmapCreateApplyEffectEx ( $hBitmap, $hEffect [, $iX = 0 [, $iY = 0 [, $iW = 0 [, $iH = 0]]]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect to be applied.',
      },
      {
        label: '$iX',
        documentation:
          '**[optional]** The X coordinate of the upper left corner of the portion to which the effect is applied.',
      },
      {
        label: '$iY',
        documentation:
          '**[optional]** The Y coordinate of the upper left corner of the portion to which the effect is applied.',
      },
      {
        label: '$iW',
        documentation:
          '**[optional]** Specifies the width of the portion to which the effect is applied.',
      },
      {
        label: '$iH',
        documentation:
          '**[optional]** Specifies the height of the portion to which the effect is applied.',
      },
    ],
  },
  _GDIPlus_BitmapCreateDIBFromBitmap: {
    documentation: 'Creates a DIB Section',
    label: '_GDIPlus_BitmapCreateDIBFromBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'A handle to a GDI+ bitmap',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromFile: {
    documentation: 'Create a Bitmap object from file',
    label: '_GDIPlus_BitmapCreateFromFile ( $sFileName )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Path to a bitmap file',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromGraphics: {
    documentation: 'Creates a Bitmap object based on a Graphics object, a width, and a height',
    label: '_GDIPlus_BitmapCreateFromGraphics ( $iWidth, $iHeight, $hGraphics )',
    params: [
      {
        label: '$iWidth',
        documentation: 'Specifies the width, in pixels, of the bitmap',
      },
      {
        label: '$iHeight',
        documentation: 'Specifies the height, in pixels, of the bitmap',
      },
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromHBITMAP: {
    documentation: 'Create a Bitmap object from a bitmap handle',
    label: '_GDIPlus_BitmapCreateFromHBITMAP ( $hBitmap [, $hPal = 0] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a HBITMAP',
      },
      {
        label: '$hPal',
        documentation: '**[optional]** Handle to a HPALETTE',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromHICON: {
    documentation: 'Creates a Bitmap object based on an icon',
    label: '_GDIPlus_BitmapCreateFromHICON ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to an icon',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromHICON32: {
    documentation: 'Creates a Bitmap object based on a 32bit icon',
    label: '_GDIPlus_BitmapCreateFromHICON32 ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to an icon',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromMemory: {
    documentation:
      'Loads an image (JPG, BMP, PNG, etc.) which is saved as a binary string and converts it to a bitmap (GDI+) or hbitmap (GDI)',
    label: '_GDIPlus_BitmapCreateFromMemory ( $dImage [, $bHBITMAP = False] )',
    params: [
      {
        label: '$dImage',
        documentation:
          'The binary string which contains any valid image which is supported by GDI+',
      },
      {
        label: '$bHBITMAP',
        documentation:
          '**[optional]** If False a bitmap will be created, if True a hbitmap (GDI) will be created',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromResource: {
    documentation: 'Creates a Bitmap object based on an icon',
    label: '_GDIPlus_BitmapCreateFromResource ( $hInst, $vResourceName )',
    params: [
      {
        label: '$hInst',
        documentation:
          'Handle to an instance of a module whose executable file contains a bitmap resource',
      },
      {
        label: '$vResourceName',
        documentation: 'The resource name string or identifier',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromScan0: {
    documentation:
      'Creates a Bitmap object based on an array of bytes along with size and format information',
    label:
      '_GDIPlus_BitmapCreateFromScan0 ( $iWidth, $iHeight [, $iPixelFormat = $GDIP_PXF32ARGB [, $iStride = 0 [, $pScan0 = 0]]] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'The bitmap width, in pixels.',
      },
      {
        label: '$iHeight',
        documentation: 'The bitmap height, in pixels.',
      },
      {
        label: '$iPixelFormat',
        documentation:
          '**[optional]** Specifies the format of the pixel data.    $GDIP_PXF01INDEXED = 1 bit per pixel, indexed    $GDIP_PXF04INDEXED = 4 bits per pixel, indexed    $GDIP_PXF08INDEXED = 8 bits per pixel, indexed    $GDIP_PXF16GRAYSCALE = 16 bits per pixel, grayscale    $GDIP_PXF16RGB555 = 16 bits per pixel; 5 bits for each RGB component    $GDIP_PXF16RGB565 = 16 bits per pixel; 5 bits for red, 6 bits for green and 5 bits blue    $GDIP_PXF16ARGB1555 = 16 bits per pixel; 1 bit for alpha and 5 bits for each RGB component    $GDIP_PXF24RGB = 24 bits per pixel; 8 bits for each RGB component    $GDIP_PXF32RGB = 32 bits per pixel; 8 bits for each RGB component. No alpha component.    $GDIP_PXF32ARGB = 32 bits per pixel; 8 bits for each RGB and alpha component    $GDIP_PXF32PARGB = 32 bits per pixel; 8 bits for each RGB and alpha component, pre-multiplied',
      },
      {
        label: '$iStride',
        documentation:
          '**[optional]** Integer that specifies the byte offset between the beginning of one scan line and the next.',
      },
      {
        label: '$pScan0',
        documentation: '**[optional]** Pointer to an array of bytes that contains the pixel data.',
      },
    ],
  },
  _GDIPlus_BitmapCreateFromStream: {
    documentation: 'Creates a Bitmap object based on an IStream COM interface',
    label: '_GDIPlus_BitmapCreateFromStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation: 'Pointer to an IStream COM interface',
      },
    ],
  },
  _GDIPlus_BitmapCreateHBITMAPFromBitmap: {
    documentation: 'Create a handle to a bitmap from a bitmap object',
    label: '_GDIPlus_BitmapCreateHBITMAPFromBitmap ( $hBitmap [, $iARGB = 0xFF000000] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a bitmap object',
      },
      {
        label: '$iARGB',
        documentation: '**[optional]** Color object that specifies the background color',
      },
    ],
  },
  _GDIPlus_BitmapDispose: {
    documentation: 'Release a bitmap object',
    label: '_GDIPlus_BitmapDispose ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a bitmap object',
      },
    ],
  },
  _GDIPlus_BitmapGetHistogram: {
    documentation:
      'Returns one or more histograms for specified color channels of the specified Bitmap',
    label:
      '_GDIPlus_BitmapGetHistogram ( $hBitmap, $iHistogramFormat, $iHistogramSize, $tChannel_0 [, $tChannel_1 = 0 [, $tChannel_2 = 0 [, $tChannel_3 = 0]]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
      {
        label: '$iHistogramFormat',
        documentation:
          'HistogramFormat constant that specifies the channels for which histograms will be created ($GDIP_HistogramFormat*).',
      },
      {
        label: '$iHistogramSize',
        documentation:
          'Number of elements in each of the arrays pointed to by $tChannel_0, $tChannel_1, $tChannel_2, and $tChannel_3?',
      },
      {
        label: '$tChannel_0',
        documentation: 'A DLL struct array of UINTs that receives the first histogram.',
      },
      {
        label: '$tChannel_1',
        documentation:
          '**[optional]** A DLL struct array of UINTs that receives the second histogram if there is a second histogram.Pass NULL if there is no second histogram.',
      },
      {
        label: '$tChannel_2',
        documentation:
          '**[optional]** A DLL struct array of UINTs that receives the third histogram if there is a third histogram.Pass NULL if there is no third histogram.',
      },
      {
        label: '$tChannel_3',
        documentation:
          '**[optional]** A DLL struct array of UINTs that receives the fourth histogram if there is a fourth histogram.Pass NULL if there is no fourth histogram.',
      },
    ],
  },
  _GDIPlus_BitmapGetHistogramEx: {
    documentation:
      'Returns histograms for the Bitmap´s color channels: Red, Green, Blue, Alpha and Grey',
    label: '_GDIPlus_BitmapGetHistogramEx ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a Bitmap to which the effect is applied.',
      },
    ],
  },
  _GDIPlus_BitmapGetHistogramSize: {
    documentation:
      'Returns the number of elements for allocation by _GDIPlus_BitmapGetHistogramEx()',
    label: '_GDIPlus_BitmapGetHistogramSize ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation: 'HistogramFormat constant ($GDIP_HistogramFormat*)',
      },
    ],
  },
  _GDIPlus_BitmapGetPixel: {
    documentation: 'Gets the color of a specified pixel in this bitmap',
    label: '_GDIPlus_BitmapGetPixel ( $hBitmap, $iX, $iY )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Pointer to the Bitmap object',
      },
      {
        label: '$iX',
        documentation: 'The X coordinate of the pixel',
      },
      {
        label: '$iY',
        documentation: 'The Y coordinate of the pixel',
      },
    ],
  },
  _GDIPlus_BitmapLockBits: {
    documentation: 'Locks a portion of a bitmap for reading or writing',
    label:
      '_GDIPlus_BitmapLockBits ( $hBitmap, $iLeft, $iTop, $iWidth, $iHeight [, $iFlags = $GDIP_ILMREAD [, $iFormat = $GDIP_PXF32RGB]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a bitmap object',
      },
      {
        label: '$iLeft',
        documentation: 'X coordinate of the upper-left corner of the rectangle to lock',
      },
      {
        label: '$iTop',
        documentation: 'Y coordinate of the upper-left corner of the rectangle to lock',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the rectangle to lock',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the rectangle to lock',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Set of flags that specify whether the locked portion of the bitmap is available for reading or for writing and whether the caller has already allocated a buffer. Can be a combination of the following:    $GDIP_ILMREAD - A portion of the image is locked for reading    $GDIP_ILMWRITE - A portion of the image is locked for writing    $GDIP_ILMUSERINPUTBUF - The buffer is allocated by the user',
      },
      {
        label: '$iFormat',
        documentation:
          '**[optional]** Specifies the format of the pixel data in the temporary buffer. Can be one of the following:    $GDIP_PXF01INDEXED - 1 bpp, indexed    $GDIP_PXF04INDEXED - 4 bpp, indexed    $GDIP_PXF08INDEXED - 8 bpp, indexed    $GDIP_PXF16GRAYSCALE - 16 bpp, grayscale    $GDIP_PXF16RGB555 - 16 bpp; 5 bits for each RGB    $GDIP_PXF16RGB565 - 16 bpp; 5 bits red, 6 bits green, and 5 bits blue    $GDIP_PXF16ARGB1555 - 16 bpp; 1 bit for alpha and 5 bits for each RGB component    $GDIP_PXF24RGB - 24 bpp; 8 bits for each RGB    $GDIP_PXF32RGB - 32 bpp; 8 bits for each RGB. No alpha.    $GDIP_PXF32ARGB - 32 bpp; 8 bits for each RGB and alpha    $GDIP_PXF32PARGB - 32 bpp; 8 bits for each RGB and alpha, pre-multiplied',
      },
    ],
  },
  _GDIPlus_BitmapSetPixel: {
    documentation: 'Sets the color of a specified pixel in this bitmap',
    label: '_GDIPlus_BitmapSetPixel ( $hBitmap, $iX, $iY, $iARGB )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Pointer to the Bitmap object',
      },
      {
        label: '$iX',
        documentation: 'The X coordinate of the pixel',
      },
      {
        label: '$iY',
        documentation: 'The Y coordinate of the pixel',
      },
      {
        label: '$iARGB',
        documentation: 'The new color of the pixel',
      },
    ],
  },
  _GDIPlus_BitmapUnlockBits: {
    documentation: 'Unlocks a portion of a bitmap that was locked by _GDIPlus_BitmapLockBits',
    label: '_GDIPlus_BitmapUnlockBits ( $hBitmap, $tBitmapData )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a bitmap object',
      },
      {
        label: '$tBitmapData',
        documentation:
          '$tagGDIPBITMAPDATA structure previously passed to _GDIPlus_BitmapLockBits()',
      },
    ],
  },
  _GDIPlus_BrushClone: {
    documentation: 'Clone a Brush object',
    label: '_GDIPlus_BrushClone ( $hBrush )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Handle to a Brush object',
      },
    ],
  },
  _GDIPlus_BrushCreateSolid: {
    documentation: 'Create a solid Brush object',
    label: '_GDIPlus_BrushCreateSolid ( [$iARGB = 0xFF000000] )',
    params: [
      {
        label: '$iARGB',
        documentation: '**[optional]** Alpha, Red, Green and Blue components of brush',
      },
    ],
  },
  _GDIPlus_BrushDispose: {
    documentation: 'Release a Brush object',
    label: '_GDIPlus_BrushDispose ( $hBrush )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Handle to a Brush object',
      },
    ],
  },
  _GDIPlus_BrushGetSolidColor: {
    documentation: 'Get the color of a Solid Brush object',
    label: '_GDIPlus_BrushGetSolidColor ( $hBrush )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Handle to a Brush object',
      },
    ],
  },
  _GDIPlus_BrushGetType: {
    documentation: 'Retrieve the type of Brush object',
    label: '_GDIPlus_BrushGetType ( $hBrush )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Handle to a Brush object',
      },
    ],
  },
  _GDIPlus_BrushSetSolidColor: {
    documentation: 'Set the color of a Solid Brush object',
    label: '_GDIPlus_BrushSetSolidColor ( $hBrush [, $iARGB = 0xFF000000] )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Handle to a Brush object',
      },
      {
        label: '$iARGB',
        documentation: '**[optional]** Alpha, Red, Green and Blue components of brush',
      },
    ],
  },
  _GDIPlus_ColorMatrixCreate: {
    documentation: 'Creates and initializes an identity color matrix',
    label: '_GDIPlus_ColorMatrixCreate (  )',
    params: [],
  },
  _GDIPlus_ColorMatrixCreateGrayScale: {
    documentation: 'Creates and initializes a gray-scaling color matrix',
    label: '_GDIPlus_ColorMatrixCreateGrayScale (  )',
    params: [],
  },
  _GDIPlus_ColorMatrixCreateNegative: {
    documentation: 'Creates and initializes a negative color matrix',
    label: '_GDIPlus_ColorMatrixCreateNegative (  )',
    params: [],
  },
  _GDIPlus_ColorMatrixCreateSaturation: {
    documentation: 'Creates and initializes a saturation color matrix',
    label: '_GDIPlus_ColorMatrixCreateSaturation ( $fSat )',
    params: [
      {
        label: '$fSat',
        documentation: 'Color saturation factor',
      },
    ],
  },
  _GDIPlus_ColorMatrixCreateScale: {
    documentation: 'Creates and initializes a scaling color matrix',
    label: '_GDIPlus_ColorMatrixCreateScale ( $fRed, $fGreen, $fBlue [, $fAlpha = 1] )',
    params: [
      {
        label: '$fRed',
        documentation: 'Red component scaling factor',
      },
      {
        label: '$fGreen',
        documentation: 'Green component scaling factor',
      },
      {
        label: '$fBlue',
        documentation: 'Blue component scaling factor',
      },
      {
        label: '$fAlpha',
        documentation: '**[optional]** Alpha component scaling factor',
      },
    ],
  },
  _GDIPlus_ColorMatrixCreateTranslate: {
    documentation: 'Creates and initializes a translation color matrix',
    label: '_GDIPlus_ColorMatrixCreateTranslate ( $fRed, $fGreen, $fBlue [, $fAlpha = 0] )',
    params: [
      {
        label: '$fRed',
        documentation: 'Red component translation factor',
      },
      {
        label: '$fGreen',
        documentation: 'Green component translation factor',
      },
      {
        label: '$fBlue',
        documentation: 'Blue component translation factor',
      },
      {
        label: '$fAlpha',
        documentation: '**[optional]** Alpha component translation factor',
      },
    ],
  },
  _GDIPlus_CustomLineCapClone: {
    documentation: 'Clones a CustomLineCap object',
    label: '_GDIPlus_CustomLineCapClone ( $hCustomLineCap )',
    params: [
      {
        label: '$hCustomLineCap',
        documentation: 'Pointer to a CustomLineCap object',
      },
    ],
  },
  _GDIPlus_CustomLineCapCreate: {
    documentation: 'Creates a CustomLineCap object',
    label:
      '_GDIPlus_CustomLineCapCreate ( $hPathFill, $hPathStroke [, $iLineCap = 0 [, $nBaseInset = 0]] )',
    params: [
      {
        label: '$hPathFill',
        documentation: 'Pointer to a Path object that defines the fill for the custom tip.',
      },
      {
        label: '$hPathStroke',
        documentation: 'Pointer to a Path object that defines the contour of the nozzle custom.',
      },
      {
        label: '$iLineCap',
        documentation:
          '**[optional]** The line cap that will be used.    $GDIP_LINECAPFLAT = Specifies a flat cap    $GDIP_LINECAPSQUARE = Specifies a square cap    $GDIP_LINECAPROUND = Specifies a circular cap    $GDIP_LINECAPTRIANGLE = Specifies a triangular cap    $GDIP_LINECAPNOANCHOR = Specifies that the line ends are not anchored    $GDIP_LINECAPSQUAREANCHOR = Specifies that the line ends are anchored with a square    $GDIP_LINECAPROUNDANCHOR = Specifies that the line ends are anchored with a circle    $GDIP_LINECAPDIAMONDANCHOR = Specifies that the line ends are anchored with a diamond    $GDIP_LINECAPARROWANCHOR = Specifies that the line ends are anchored with arrowheads    $GDIP_LINECAPCUSTOM = Specifies that the line ends are made from a CustomLineCap',
      },
      {
        label: '$nBaseInset',
        documentation:
          '**[optional]** Distance between the tip and the line. This distance is expressed in units.',
      },
    ],
  },
  _GDIPlus_CustomLineCapDispose: {
    documentation: 'Release a custom line cap object',
    label: '_GDIPlus_CustomLineCapDispose ( $hCap )',
    params: [
      {
        label: '$hCap',
        documentation: 'Handle to a custom line cap object',
      },
    ],
  },
  _GDIPlus_CustomLineCapGetStrokeCaps: {
    documentation: 'Gets the end cap styles for both the start line cap and the end line cap',
    label: '_GDIPlus_CustomLineCapGetStrokeCaps ( $hCustomLineCap )',
    params: [
      {
        label: '$hCustomLineCap',
        documentation: 'Pointer to a CustomLineCap object',
      },
    ],
  },
  _GDIPlus_CustomLineCapSetStrokeCaps: {
    documentation: 'Sets the distance between the base cap to the start of the line',
    label: '_GDIPlus_CustomLineCapSetStrokeCaps ( $hCustomLineCap, $iStartCap, $iEndCap )',
    params: [
      {
        label: '$hCustomLineCap',
        documentation: 'Pointer to a CustomLineCap object',
      },
      {
        label: '$iStartCap',
        documentation: 'Line cap that will be used for the start of the line to be drawn',
      },
      {
        label: '$iEndCap',
        documentation: 'Line cap that will be used for the end of the line to be drawn',
      },
    ],
  },
  _GDIPlus_Decoders: {
    documentation: 'Get an array of information about the available image decoders',
    label: '_GDIPlus_Decoders (  )',
    params: [],
  },
  _GDIPlus_DecodersGetCount: {
    documentation: 'Get the number of available image decoders',
    label: '_GDIPlus_DecodersGetCount (  )',
    params: [],
  },
  _GDIPlus_DecodersGetSize: {
    documentation:
      'Get the total size of the structure that is returned by _GDIPlus_GetImageDecoders',
    label: '_GDIPlus_DecodersGetSize (  )',
    params: [],
  },
  _GDIPlus_DrawImageFX: {
    documentation: 'Draws a portion of an image after applying a specified effect',
    label:
      '_GDIPlus_DrawImageFX ( $hGraphics, $hImage, $hEffect [, $tRECTF = 0 [, $hMatrix = 0 [, $hImgAttributes = 0 [, $iUnit = 2]]]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object.',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object.',
      },
      {
        label: '$hEffect',
        documentation:
          'Handle to an Effect that is applied to the image before rendering. The image is not permanently altered by the effect.',
      },
      {
        label: '$tRECTF',
        documentation:
          '**[optional]** $tagGDIPRECTF structure that specifies the portion of the image to be drawn.',
      },
      {
        label: '$hMatrix',
        documentation:
          '**[optional]** Handle to a Matrix object that specifies the parallelogram in which the image portion is rendered.',
      },
      {
        label: '$hImgAttributes',
        documentation:
          '**[optional]** Handle to an ImageAttributes object that specifies color adjustments to be applied when the image is rendered.',
      },
      {
        label: '$iUnit',
        documentation: '**[optional]** Specifies the unit of measure for the image.',
      },
    ],
  },
  _GDIPlus_DrawImageFXEx: {
    documentation: 'Draws a portion of an image after applying a specified effect',
    label:
      '_GDIPlus_DrawImageFXEx ( $hGraphics, $hImage, $hEffect [, $nX = 0 [, $nY = 0 [, $nW = 0 [, $nH = 0 [, $hMatrix = 0 [, $hImgAttributes = 0 [, $iUnit = 2]]]]]]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object.',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object.',
      },
      {
        label: '$hEffect',
        documentation:
          'Handle to an Effect that is applied to the image before rendering. The image is not permanently altered by the effect.',
      },
      {
        label: '$nX',
        documentation:
          '**[optional]** X coordinate of upper left hand corner of the portion of the image to be drawn.',
      },
      {
        label: '$nY',
        documentation:
          '**[optional]** X coordinate of upper left hand corner of the portion of the image to be drawn.',
      },
      {
        label: '$nW',
        documentation: '**[optional]** Width of the portion rectangle of the image to be drawn.',
      },
      {
        label: '$nH',
        documentation: '**[optional]** Height of the portion rectangle of the image to be drawn.',
      },
      {
        label: '$hMatrix',
        documentation:
          '**[optional]** Handle to a Matrix object that specifies the parallelogram in which the image portion is rendered.',
      },
      {
        label: '$hImgAttributes',
        documentation:
          '**[optional]** Handle to an ImageAttributes object that specifies color adjustments to be applied when the image is rendered.',
      },
      {
        label: '$iUnit',
        documentation: '**[optional]** Specifies the unit of measure for the image.',
      },
    ],
  },
  _GDIPlus_DrawImagePoints: {
    documentation: 'Draws an image at a specified location',
    label:
      '_GDIPlus_DrawImagePoints ( $hGraphic, $hImage, $nULX, $nULY, $nURX, $nURY, $nLLX, $nLLY [, $iCount = 3] )',
    params: [
      {
        label: '$hGraphic',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object',
      },
      {
        label: '$nULX',
        documentation: 'The X coordinate of the upper left corner of the source image',
      },
      {
        label: '$nULY',
        documentation: 'The Y coordinate of the upper left corner of the source image',
      },
      {
        label: '$nURX',
        documentation: 'The X coordinate of the upper right corner of the source image',
      },
      {
        label: '$nURY',
        documentation: 'The Y coordinate of the upper right corner of the source image',
      },
      {
        label: '$nLLX',
        documentation: 'The X coordinate of the lower left corner of the source image',
      },
      {
        label: '$nLLY',
        documentation: 'The Y coordinate of the lower left corner of the source image',
      },
      {
        label: '$iCount',
        documentation: "**[optional]** Specifies the number of points (x,y)'s in the structure.",
      },
    ],
  },
  _GDIPlus_EffectCreate: {
    documentation: 'Creates an Effect object of the type specified by the guid parameter',
    label: '_GDIPlus_EffectCreate ( $sEffectGUID )',
    params: [
      {
        label: '$sEffectGUID',
        documentation: 'Effect Guid constant that specifies the kind of effect to create.',
      },
    ],
  },
  _GDIPlus_EffectCreateBlur: {
    documentation: 'Creates a Blur class effect object',
    label: '_GDIPlus_EffectCreateBlur ( [$fRadius = 10.0 [, $bExpandEdge = False]] )',
    params: [
      {
        label: '$fRadius',
        documentation:
          '**[optional]** Real number that specifies the blur radius (the radius of the Gaussian convolution kernel) in pixels.The radius must be in the range 0.0 through 255.0.',
      },
      {
        label: '$bExpandEdge',
        documentation:
          '**[optional]** Boolean value that specifies whether the bitmap expands by an amount equal to the blur radius.If TRUE, the bitmap expands by an amount equal to the radius so that it can have soft edges.If FALSE, the bitmap remains the same size and the soft edges are clipped.',
      },
    ],
  },
  _GDIPlus_EffectCreateBrightnessContrast: {
    documentation: 'Creates a BrightnessContrast class effect object',
    label:
      '_GDIPlus_EffectCreateBrightnessContrast ( [$iBrightnessLevel = 0 [, $iContrastLevel = 0]] )',
    params: [
      {
        label: '$iBrightnessLevel',
        documentation:
          '**[optional]** Integer in the range -255 through 255 that specifies the brightness level.',
      },
      {
        label: '$iContrastLevel',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies the contrast level.',
      },
    ],
  },
  _GDIPlus_EffectCreateColorBalance: {
    documentation: 'Creates a ColorBalance class effect object',
    label:
      '_GDIPlus_EffectCreateColorBalance ( [$iCyanRed = 0 [, $iMagentaGreen = 0 [, $iYellowBlue = 0]]] )',
    params: [
      {
        label: '$iCyanRed',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies a change in the amount of red in the image.',
      },
      {
        label: '$iMagentaGreen',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies a change in the amount of green in the image.',
      },
      {
        label: '$iYellowBlue',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies a change in the amount of blue in the image.',
      },
    ],
  },
  _GDIPlus_EffectCreateColorCurve: {
    documentation: 'Creates a ColorBalance class effect object',
    label: '_GDIPlus_EffectCreateColorCurve ( $iAdjustment, $iChannel, $iAdjustValue )',
    params: [
      {
        label: '$iAdjustment',
        documentation:
          'CurveAdjustments constant that specifies the adjustment to be applied ($GDIP_Adjust*).',
      },
      {
        label: '$iChannel',
        documentation:
          'CurveChannel constant that specifies the color channel to which the adjustment applies ($GDIP_CurveChannel*).',
      },
      {
        label: '$iAdjustValue',
        documentation:
          'Integer that specifies the intensity of the adjustment.The range of acceptable values depends on which adjustment is being applied (see $GDIP_Adjust* constants).',
      },
    ],
  },
  _GDIPlus_EffectCreateColorLUT: {
    documentation: 'Creates a ColorLUT class effect object',
    label: '_GDIPlus_EffectCreateColorLUT ( $aColorLUT )',
    params: [
      {
        label: '$aColorLUT',
        documentation:
          'An array[256][4] of a color lookup table for the color channels, alpha, red, green, and blue:    [0][0] - first adjustment value for the alpha channel    [0][1] - first adjustment value for the red channel    [0][2] - first adjustment value for the green channel    [0][3] - first adjustment value for the blue channel    [1][0] - second adjustment value for the alpha channel    [1][1] - second adjustment value for the red channel    [1][2] - second adjustment value for the green channel    [1][3] - second adjustment value for the blue channel    ...    255][0] - last adjustment value for the alpha channel    [255][1] - last adjustment value for the red channel    [255][2] - last adjustment value for the green channel    [255][3] - last adjustment value for the blue channel',
      },
    ],
  },
  _GDIPlus_EffectCreateColorMatrix: {
    documentation: 'Creates a ColorMatrixEffect class effect object',
    label: '_GDIPlus_EffectCreateColorMatrix ( $tColorMatrix )',
    params: [
      {
        label: '$tColorMatrix',
        documentation: 'ColorMatrix structure.',
      },
    ],
  },
  _GDIPlus_EffectCreateHueSaturationLightness: {
    documentation: 'Creates a HueSaturationLightness class effect object',
    label:
      '_GDIPlus_EffectCreateHueSaturationLightness ( [$iHueLevel = 0 [, $iSaturationLevel = 0 [, $iLightnessLevel = 0]]] )',
    params: [
      {
        label: '$iHueLevel',
        documentation:
          '**[optional]** Integer in the range -180 through 180 that specifies the change in hue.',
      },
      {
        label: '$iSaturationLevel',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies the change in saturation.',
      },
      {
        label: '$iLightnessLevel',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies the change in lightness.',
      },
    ],
  },
  _GDIPlus_EffectCreateLevels: {
    documentation: 'Creates a Levels class effect object',
    label: '_GDIPlus_EffectCreateLevels ( [$iHighlight = 100 [, $iMidtone = 0 [, $iShadow = 0]]] )',
    params: [
      {
        label: '$iHighlight',
        documentation:
          '**[optional]** Integer in the range 0 through 100 that specifies which pixels should be lightened.',
      },
      {
        label: '$iMidtone',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies how much to lighten or darken an image.',
      },
      {
        label: '$iShadow',
        documentation:
          '**[optional]** Integer in the range 0 through 100 that specifies which pixels should be darkened.',
      },
    ],
  },
  _GDIPlus_EffectCreateRedEyeCorrection: {
    documentation: 'Creates a RedEyeCorrection class effect object',
    label: '_GDIPlus_EffectCreateRedEyeCorrection ( $aAreas )',
    params: [
      {
        label: '$aAreas',
        documentation:
          'An array of areas of the bitmap to which red eye correction should be applied:    [0][0] - Number of Area rectangles    [1][0] - X coordinate of the upper-left corner of the first rectangle    [1][1] - Y coordinate of the upper-left corner of the first rectangle    [1][2] - Width of the first rectangle    [1][3] - Height of the first rectangle    ...    [n][0] - X coordinate of the upper-left corner of the nth rectangle    [n][1] - Y coordinate of the upper-left corner of the nth rectangle    [n][2] - Width of the nth rectangle    [n][3] - Height of the nth rectangle',
      },
    ],
  },
  _GDIPlus_EffectCreateSharpen: {
    documentation: 'Creates a Sharpen class effect object',
    label: '_GDIPlus_EffectCreateSharpen ( [$fRadius = 10.0 [, $fAmount = 50.0]] )',
    params: [
      {
        label: '$fRadius',
        documentation:
          '**[optional]** Real number that specifies the sharpening radius (the radius of the convolution kernel) in pixels.The radius must be in the range 0.0 through 255.0',
      },
      {
        label: '$fAmount',
        documentation:
          '**[optional]** Real number in the range 0.0 through 100.0 that specifies the amount of sharpening to be applied',
      },
    ],
  },
  _GDIPlus_EffectCreateTint: {
    documentation: 'Creates a Tint class effect object',
    label: '_GDIPlus_EffectCreateTint ( [$iHue = 0 [, $iAmount = 0]] )',
    params: [
      {
        label: '$iHue',
        documentation:
          '**[optional]** Integer in the range -180 through 180 that specifies the hue to be strengthened or weakened.',
      },
      {
        label: '$iAmount',
        documentation:
          '**[optional]** Integer in the range -100 through 100 that specifies how much the hue (given by the hue parameter) is strengthened or weakened.',
      },
    ],
  },
  _GDIPlus_EffectDispose: {
    documentation: 'Deletes the specified Effect object',
    label: '_GDIPlus_EffectDispose ( $hEffect )',
    params: [
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect object.',
      },
    ],
  },
  _GDIPlus_EffectGetParameters: {
    documentation: 'Returns the parameters for the specified Effect object',
    label: '_GDIPlus_EffectGetParameters ( $hEffect, $tEffectParameters )',
    params: [
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect object.',
      },
      {
        label: '$tEffectParameters',
        documentation: 'A DLL structure that receives the effect parameters.',
      },
    ],
  },
  _GDIPlus_EffectSetParameters: {
    documentation: 'Sets the parameters for the specified Effect object',
    label: '_GDIPlus_EffectSetParameters ( $hEffect, $tEffectParameters [, $iSizeAdjust = 1] )',
    params: [
      {
        label: '$hEffect',
        documentation: 'Handle to an Effect object.',
      },
      {
        label: '$tEffectParameters',
        documentation: 'A DLL structure that specifies the parameters.',
      },
      {
        label: '$iSizeAdjust',
        documentation: '**[optional]** An integer value. Default is 1.',
      },
    ],
  },
  _GDIPlus_Encoders: {
    documentation: 'Get an array of information about the available image encoders',
    label: '_GDIPlus_Encoders (  )',
    params: [],
  },
  _GDIPlus_EncodersGetCLSID: {
    documentation: 'Return the encoder CLSID for a specific image file type',
    label: '_GDIPlus_EncodersGetCLSID ( $sFileExtension )',
    params: [
      {
        label: '$sFileExtension',
        documentation: 'File extension to search for (BMP, JPG, TIF, etc.)',
      },
    ],
  },
  _GDIPlus_EncodersGetCount: {
    documentation: 'Get the number of available image encoders',
    label: '_GDIPlus_EncodersGetCount (  )',
    params: [],
  },
  _GDIPlus_EncodersGetParamList: {
    documentation: 'Get the parameter list for a specified image encoder',
    label: '_GDIPlus_EncodersGetParamList ( $hImage, $sEncoder )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
      {
        label: '$sEncoder',
        documentation: 'GUID string of encoder to be used',
      },
    ],
  },
  _GDIPlus_EncodersGetParamListSize: {
    documentation: 'Get the size of the parameter list for a specified image encoder',
    label: '_GDIPlus_EncodersGetParamListSize ( $hImage, $sEncoder )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
      {
        label: '$sEncoder',
        documentation: 'GUID string of encoder to be used',
      },
    ],
  },
  _GDIPlus_EncodersGetSize: {
    documentation:
      'Get the total size of the structure that is returned by _GDIPlus_GetImageEncoders',
    label: '_GDIPlus_EncodersGetSize (  )',
    params: [],
  },
  _GDIPlus_FontCreate: {
    documentation: 'Create a Font object',
    label: '_GDIPlus_FontCreate ( $hFamily, $fSize [, $iStyle = 0 [, $iUnit = 3]] )',
    params: [
      {
        label: '$hFamily',
        documentation: 'Handle to a Font Family object',
      },
      {
        label: '$fSize',
        documentation:
          'The size of the font measured in the units specified in the $iUnit parameter',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
      {
        label: '$iUnit',
        documentation:
          '**[optional]** Unit of measurement for the font size:    0 - World coordinates, a nonphysical unit    1 - Display units    2 - A unit is 1 pixel    3 - A unit is 1 point or 1/72 inch    4 - A unit is 1 inch    5 - A unit is 1/300 inch    6 - A unit is 1 millimeter',
      },
    ],
  },
  _GDIPlus_FontDispose: {
    documentation: 'Release a Font object',
    label: '_GDIPlus_FontDispose ( $hFont )',
    params: [
      {
        label: '$hFont',
        documentation: 'Handle to a Font object',
      },
    ],
  },
  _GDIPlus_FontFamilyCreate: {
    documentation: 'Create a Font Family object',
    label: '_GDIPlus_FontFamilyCreate ( $sFamily [, $pCollection = 0] )',
    params: [
      {
        label: '$sFamily',
        documentation: 'Name of the Font Family',
      },
      {
        label: '$pCollection',
        documentation:
          '**[optional]** Pointer to a FontCollection object that specifies the collection that the font family belongs to.',
      },
    ],
  },
  _GDIPlus_FontFamilyCreateFromCollection: {
    documentation: 'Creates a FontFamily object based on a specified font family',
    label: '_GDIPlus_FontFamilyCreateFromCollection ( $sFontName, $hFontCollection )',
    params: [
      {
        label: '$sFontName',
        documentation:
          " A string value that specifies the internal name of a font, e.g. Times.ttf has as internal name 'Times New Roman'",
      },
      {
        label: '$hFontCollection',
        documentation: ' A handle to the font collection object',
      },
    ],
  },
  _GDIPlus_FontFamilyDispose: {
    documentation: 'Release a Font Family object',
    label: '_GDIPlus_FontFamilyDispose ( $hFamily )',
    params: [
      {
        label: '$hFamily',
        documentation: 'Handle to a Font Family object',
      },
    ],
  },
  _GDIPlus_FontFamilyGetCellAscent: {
    documentation:
      'Gets the cell ascent, in design units, of a font family for the specified style or style combination',
    label: '_GDIPlus_FontFamilyGetCellAscent ( $hFontFamily [, $iStyle = 0] )',
    params: [
      {
        label: '$hFontFamily',
        documentation: 'Pointer to a FontFamily object',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
    ],
  },
  _GDIPlus_FontFamilyGetCellDescent: {
    documentation:
      'Gets the cell descent, in design units, of a font family for the specified style or style combination',
    label: '_GDIPlus_FontFamilyGetCellDescent ( $hFontFamily [, $iStyle = 0] )',
    params: [
      {
        label: '$hFontFamily',
        documentation: 'Pointer to a FontFamily object',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
    ],
  },
  _GDIPlus_FontFamilyGetEmHeight: {
    documentation:
      'Gets the size (commonly called em size or em height), in design units, of a font family',
    label: '_GDIPlus_FontFamilyGetEmHeight ( $hFontFamily [, $iStyle = 0] )',
    params: [
      {
        label: '$hFontFamily',
        documentation: 'Pointer to a FontFamily object',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
    ],
  },
  _GDIPlus_FontFamilyGetLineSpacing: {
    documentation:
      'Gets the line spacing, in design units, of this font family for the specified style or style combination',
    label: '_GDIPlus_FontFamilyGetLineSpacing ( $hFontFamily [, $iStyle = 0] )',
    params: [
      {
        label: '$hFontFamily',
        documentation: 'Pointer to a FontFamily object',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
    ],
  },
  _GDIPlus_FontGetHeight: {
    documentation:
      'Gets the line spacing of a font in the current unit of a specified Graphics object',
    label: '_GDIPlus_FontGetHeight ( $hFont, $hGraphics )',
    params: [
      {
        label: '$hFont',
        documentation: 'Pointer to a Font object',
      },
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_FontPrivateAddFont: {
    documentation: 'Adds a font file to the private font collection',
    label: '_GDIPlus_FontPrivateAddFont ( $hFontCollection, $sFontFile )',
    params: [
      {
        label: '$hFontCollection',
        documentation: ' A handle to the font collection object',
      },
      {
        label: '$sFontFile',
        documentation: ' A string value that specifies the name of a font file',
      },
    ],
  },
  _GDIPlus_FontPrivateAddMemoryFont: {
    documentation:
      'Adds a font that is contained in system memory to a Microsoft® Windows® GDI+ font collection',
    label: '_GDIPlus_FontPrivateAddMemoryFont ( $hFontCollection, $tFont )',
    params: [
      {
        label: '$hFontCollection',
        documentation: ' A handle to the font collection object',
      },
      {
        label: '$tFont',
        documentation: ' A dll struct value filled with binary ttf font data',
      },
    ],
  },
  _GDIPlus_FontPrivateCollectionDispose: {
    documentation: 'Deletes the specified PrivateFontCollection object',
    label: '_GDIPlus_FontPrivateCollectionDispose ( $hFontCollection )',
    params: [
      {
        label: '$hFontCollection',
        documentation: ' A handle to the font collection object to delete',
      },
    ],
  },
  _GDIPlus_FontPrivateCreateCollection: {
    documentation: 'Creates a PrivateFont Collection object',
    label: '_GDIPlus_FontPrivateCreateCollection (  )',
    params: [],
  },
  _GDIPlus_GraphicsClear: {
    documentation: 'Clears a Graphics object to a specified color',
    label: '_GDIPlus_GraphicsClear ( $hGraphics [, $iARGB = 0xFF000000] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$iARGB',
        documentation: '**[optional]** Alpha, Red, Green and Blue components of color',
      },
    ],
  },
  _GDIPlus_GraphicsCreateFromHDC: {
    documentation: 'Create a Graphics object from a device context (DC)',
    label: '_GDIPlus_GraphicsCreateFromHDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Device context',
      },
    ],
  },
  _GDIPlus_GraphicsCreateFromHWND: {
    documentation: 'Create a Graphics object from a window handle',
    label: '_GDIPlus_GraphicsCreateFromHWND ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to a window',
      },
    ],
  },
  _GDIPlus_GraphicsDispose: {
    documentation: 'Release a Graphics object',
    label: '_GDIPlus_GraphicsDispose ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsDrawArc: {
    documentation: 'Draw an arc',
    label:
      '_GDIPlus_GraphicsDrawArc ( $hGraphics, $nX, $nY, $nWidth, $nHeight, $fStartAngle, $fSweepAngle [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the arc',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the arc',
      },
      {
        label: '$nWidth',
        documentation:
          'The width of the rectangle that bounds the ellipse in which to draw the arc',
      },
      {
        label: '$nHeight',
        documentation:
          'The height of the rectangle that bounds the ellipse in which to draw the arc',
      },
      {
        label: '$fStartAngle',
        documentation: 'The angle between the X axis and the starting point of the arc',
      },
      {
        label: '$fSweepAngle',
        documentation: 'The angle between the starting and ending points of the arc',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the arc. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawBezier: {
    documentation: 'Draw a bezier spline',
    label:
      '_GDIPlus_GraphicsDrawBezier ( $hGraphics, $nX1, $nY1, $nX2, $nY2, $nX3, $nY3, $nX4, $nY4 [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX1',
        documentation: 'X coordinate of the starting point',
      },
      {
        label: '$nY1',
        documentation: 'Y coordinate of the starting point',
      },
      {
        label: '$nX2',
        documentation: 'X coordinate of the first control point',
      },
      {
        label: '$nY2',
        documentation: 'Y coordinate of the first control point',
      },
      {
        label: '$nX3',
        documentation: 'X coordinate of the second control point',
      },
      {
        label: '$nY3',
        documentation: 'Y coordinate of the second control point',
      },
      {
        label: '$nX4',
        documentation: 'X coordinate of the ending point',
      },
      {
        label: '$nY4',
        documentation: 'Y coordinate of the ending point',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the bezier. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawClosedCurve: {
    documentation: 'Draw a closed cardinal spline',
    label: '_GDIPlus_GraphicsDrawClosedCurve ( $hGraphics, $aPoints [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array that specifies the points of the curve:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the spline. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawClosedCurve2: {
    documentation: 'Draws a closed cardinal spline',
    label: '_GDIPlus_GraphicsDrawClosedCurve2 ( $hGraphics, $aPoints, $nTension [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that specify the coordinates of the closed cardinal spline. The array must    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$nTension',
        documentation:
          'Number that specifies how tightly the curve bends through the coordinates of the closed cardinal spline',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the splines. If 0, a solid black pen with a width of',
      },
    ],
  },
  _GDIPlus_GraphicsDrawCurve: {
    documentation: 'Draw a cardinal spline',
    label: '_GDIPlus_GraphicsDrawCurve ( $hGraphics, $aPoints [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array that specifies the points of the curve:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the spline. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawCurve2: {
    documentation: 'Draws a cardinal spline',
    label: '_GDIPlus_GraphicsDrawCurve2 ( $hGraphics, $aPoints, $nTension [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that specify the coordinates that the cardinal spline passes through:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$nTension',
        documentation:
          'Number that specifies how tightly the curve bends through the coordinates of the closed cardinal spline',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the splines. If 0, a solid black pen with a width of',
      },
    ],
  },
  _GDIPlus_GraphicsDrawEllipse: {
    documentation: 'Draw an ellipse',
    label: '_GDIPlus_GraphicsDrawEllipse ( $hGraphics, $nX, $nY, $nWidth, $nHeight [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle that bounds the ellipse',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle that bounds the ellipse',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the arc. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawImage: {
    documentation: 'Draw an Image object',
    label: '_GDIPlus_GraphicsDrawImage ( $hGraphics, $hImage, $nX, $nY )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object',
      },
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rendered image',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rendered image',
      },
    ],
  },
  _GDIPlus_GraphicsDrawImagePointsRect: {
    documentation: 'Draws an image',
    label:
      '_GDIPlus_GraphicsDrawImagePointsRect ( $hGraphics, $hImage, $nULX, $nULY, $nURX, $nURY, $nLLX, $nLLY, $nSrcX, $nSrcY, $nSrcWidth, $nSrcHeight [, $hImageAttributes = 0 [, $iUnit = 2]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hImage',
        documentation: 'Pointer to an Image object',
      },
      {
        label: '$nULX',
        documentation: 'The X coordinate of the upper left corner of the source image',
      },
      {
        label: '$nULY',
        documentation: 'The Y coordinate of the upper left corner of the source image',
      },
      {
        label: '$nURX',
        documentation: 'The X coordinate of the upper right corner of the source image',
      },
      {
        label: '$nURY',
        documentation: 'The Y coordinate of the upper right corner of the source image',
      },
      {
        label: '$nLLX',
        documentation: 'The X coordinate of the lower left corner of the source image',
      },
      {
        label: '$nLLY',
        documentation: 'The Y coordinate of the lower left corner of the source image',
      },
      {
        label: '$nSrcX',
        documentation:
          'The X coordinate of the upper-left corner of the portion of the source image to be drawn',
      },
      {
        label: '$nSrcY',
        documentation:
          'The Y coordinate of the upper-left corner of the portion of the source image to be drawn',
      },
      {
        label: '$nSrcWidth',
        documentation: 'The width of the portion of the source image to be drawn',
      },
      {
        label: '$nSrcHeight',
        documentation: 'The height of the portion of the source image to be drawn',
      },
      {
        label: '$hImageAttributes',
        documentation:
          '**[optional]** Pointer to an ImageAttributes object that specifies the color and size attributes of the image to be drawn',
      },
      {
        label: '$iUnit',
        documentation:
          '**[optional]** Unit of measurement:    0 - World coordinates, a nonphysical unit    1 - Display units    2 - A unit is 1 pixel    3 - A unit is 1 point or 1/72 inch    4 - A unit is 1 inch    5 - A unit is 1/300 inch    6 - A unit is 1 millimeter',
      },
    ],
  },
  _GDIPlus_GraphicsDrawImageRect: {
    documentation: 'Draws an image at a specified location',
    label: '_GDIPlus_GraphicsDrawImageRect ( $hGraphics, $hImage, $nX, $nY, $nW, $nH )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object',
      },
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rendered image',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rendered image',
      },
      {
        label: '$nW',
        documentation:
          'Specifies the width of the destination rectangle at which to draw the image',
      },
      {
        label: '$nH',
        documentation:
          'Specifies the height of the destination rectangle at which to draw the image',
      },
    ],
  },
  _GDIPlus_GraphicsDrawImageRectRect: {
    documentation: 'Draw an Image object',
    label:
      '_GDIPlus_GraphicsDrawImageRectRect ( $hGraphics, $hImage, $nSrcX, $nSrcY, $nSrcWidth, $nSrcHeight, $nDstX, $nDstY, $nDstWidth, $nDstHeight [, $pAttributes = 0 [, $iUnit = 2]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an Image object',
      },
      {
        label: '$nSrcX',
        documentation: 'The X coordinate of the upper left corner of the source image',
      },
      {
        label: '$nSrcY',
        documentation: 'The Y coordinate of the upper left corner of the source image',
      },
      {
        label: '$nSrcWidth',
        documentation: 'Width of the source image',
      },
      {
        label: '$nSrcHeight',
        documentation: 'Height of the source image',
      },
      {
        label: '$nDstX',
        documentation: 'The X coordinate of the upper left corner of the destination image',
      },
      {
        label: '$nDstY',
        documentation: 'The Y coordinate of the upper left corner of the destination image',
      },
      {
        label: '$nDstWidth',
        documentation: 'Width of the destination image',
      },
      {
        label: '$nDstHeight',
        documentation: 'Height of the destination image',
      },
      {
        label: '$pAttributes',
        documentation:
          '**[optional]** Pointer to an ImageAttributes structure that specifies the color and size attributes of the image to be drawn. The default value is NULL.',
      },
      {
        label: '$iUnit',
        documentation: '**[optional]** Specifies the unit of measure for the image',
      },
    ],
  },
  _GDIPlus_GraphicsDrawLine: {
    documentation: 'Draw a line',
    label: '_GDIPlus_GraphicsDrawLine ( $hGraphics, $nX1, $nY1, $nX2, $nY2 [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX1',
        documentation: 'The X coordinate of the starting point of the line',
      },
      {
        label: '$nY1',
        documentation: 'The Y coordinate of the starting point of the line',
      },
      {
        label: '$nX2',
        documentation: 'The X coordinate of the ending point of the line',
      },
      {
        label: '$nY2',
        documentation: 'The Y coordinate of the ending point of the line',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the arc. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawPath: {
    documentation: 'Draws a sequence of lines and curves defined by a GraphicsPath object',
    label: '_GDIPlus_GraphicsDrawPath ( $hGraphics, $hPath [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hPath',
        documentation:
          'Pointer to a GraphicsPath object that specifies the sequence of lines and curves that make up thepath',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the splines. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawPie: {
    documentation: 'Draw a pie',
    label:
      '_GDIPlus_GraphicsDrawPie ( $hGraphics, $nX, $nY, $nWidth, $nHeight, $fStartAngle, $fSweepAngle [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nWidth',
        documentation:
          'The width of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nHeight',
        documentation:
          'The height of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$fStartAngle',
        documentation:
          'The angle, in degrees, between the X axis and the starting point of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
      {
        label: '$fSweepAngle',
        documentation:
          'The angle, in degrees, between the starting and ending points of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the arc. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawPolygon: {
    documentation: 'Draw a polygon',
    label: '_GDIPlus_GraphicsDrawPolygon ( $hGraphics, $aPoints [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array that specify the vertices of the polygon:    [0][0] - Number of vertices    [1][0] - Vertice 1 X position    [1][1] - Vertice 1 Y position    [2][0] - Vertice 2 X position    [2][1] - Vertice 2 Y position    [n][0] - Vertice n X position    [n][1] - Vertice n Y position',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the polygon. If 0, a solid black pen with a width of 1 will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsDrawRect: {
    documentation: 'Draw a rectangle',
    label: '_GDIPlus_GraphicsDrawRect ( $hGraphics, $nX, $nY, $nWidth, $nHeight [, $hPen = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Handle to a pen object that is used to draw the rectangle. If 0, a solid black pen with a width of 1 will be used',
      },
    ],
  },
  _GDIPlus_GraphicsDrawString: {
    documentation: 'Draw a string',
    label:
      '_GDIPlus_GraphicsDrawString ( $hGraphics, $sString, $nX, $nY [, $sFont = "Arial" [, $fSize = 10 [, $iFormat = 0]]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$sString',
        documentation: 'String to be drawn',
      },
      {
        label: '$nX',
        documentation: 'X coordinate where the string will be drawn',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate where the string will be drawn',
      },
      {
        label: '$sFont',
        documentation: '**[optional]** Name of the font to use for drawing',
      },
      {
        label: '$fSize',
        documentation: '**[optional]** Font size to use for drawing',
      },
      {
        label: '$iFormat',
        documentation:
          "**[optional]** Format flags. Can be one or more of the following:    0x0001 - Specifies that reading order is right to left    0x0002 - Specifies that individual lines of text are drawn vertically on the display device    0x0004 - Specifies that parts of characters are allowed to overhang the string's layout rectangle    0x0020 - Specifies that Unicode layout control characters are displayed with a representative character    0x0400 - Specifies that an alternate font is used for characters that are not supported in the requested font    0x0800 - Specifies that the space at the end of each line is included in a string measurement    0x1000 - Specifies that the wrapping of text to the next line is disabled    0x2000 - Specifies that only entire lines are laid out in the layout rectangle    0x4000 - Specifies that characters overhanging the layout rectangle and text extending outside the layout rectangle are allowed to show",
      },
    ],
  },
  _GDIPlus_GraphicsDrawStringEx: {
    documentation: 'Draw a string',
    label:
      '_GDIPlus_GraphicsDrawStringEx ( $hGraphics, $sString, $hFont, $tLayout, $hFormat, $hBrush )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$sString',
        documentation: 'String to be drawn',
      },
      {
        label: '$hFont',
        documentation: 'Handle to the font to use to draw the string',
      },
      {
        label: '$tLayout',
        documentation: '$tagGDIPRECTF structure that bounds the string',
      },
      {
        label: '$hFormat',
        documentation: 'Handle to the string format to draw the string',
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush to draw the string',
      },
    ],
  },
  _GDIPlus_GraphicsFillClosedCurve: {
    documentation: 'Fill a closed cardinal spline',
    label: '_GDIPlus_GraphicsFillClosedCurve ( $hGraphics, $aPoints [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array that specifies the points of the curve:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush object that is used to fill the ellipse. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsFillClosedCurve2: {
    documentation:
      'Creates a closed cardinal spline from an array of points and uses a brush to fill the interior of the spline',
    label:
      '_GDIPlus_GraphicsFillClosedCurve2 ( $hGraphics, $aPoints, $nTension [, $hBrush = 0 [, $iFillMode = 0]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that specify the coordinates of the closed cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$nTension',
        documentation:
          'Number that specifies how tightly the spline bends as it passes through the points',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush object that is used to fill the cardinal spline. If 0, a black brush will be used.',
      },
      {
        label: '$iFillMode',
        documentation:
          '**[optional]** Fill mode of the interior of the spline:    0 - The areas are filled according to the even-odd parity rule    1 - The areas are filled according to the nonzero winding rule',
      },
    ],
  },
  _GDIPlus_GraphicsFillEllipse: {
    documentation: 'Fill an ellipse',
    label:
      '_GDIPlus_GraphicsFillEllipse ( $hGraphics, $nX, $nY, $nWidth, $nHeight [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle that bounds the ellipse',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle that bounds the ellipse',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush object that is used to fill the ellipse. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsFillPath: {
    documentation: 'Uses a brush to fill the interior of a path',
    label: '_GDIPlus_GraphicsFillPath ( $hGraphics, $hPath [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object that specifies the path',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a Brush object that is used to paint the interior of the path. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsFillPie: {
    documentation: 'Fill a pie',
    label:
      '_GDIPlus_GraphicsFillPie ( $hGraphics, $nX, $nY, $nWidth, $nHeight, $fStartAngle, $fSweepAngle [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nWidth',
        documentation:
          'The width of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$nHeight',
        documentation:
          'The height of the rectangle that bounds the ellipse in which to draw the pie',
      },
      {
        label: '$fStartAngle',
        documentation:
          'The angle, in degrees, between the X axis and the starting point of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
      {
        label: '$fSweepAngle',
        documentation:
          'The angle, in degrees, between the starting and ending points of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush object that is used to fill the pie. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsFillPolygon: {
    documentation: 'Fill a polygon',
    label: '_GDIPlus_GraphicsFillPolygon ( $hGraphics, $aPoints [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array that specify the vertices of the polygon:    [0][0] - Number of vertices    [1][0] - Vertex 1 X position    [1][1] - Vertex 1 Y position    [2][0] - Vertex 2 X position    [2][1] - Vertex 2 Y position    [n][0] - Vertex n X position    [n][1] - Vertex n Y position',
      },
      {
        label: '$hBrush',
        documentation: '**[optional]** Handle to a brush object that is used to fill the polygon.',
      },
    ],
  },
  _GDIPlus_GraphicsFillRect: {
    documentation: 'Fill a rectangle',
    label: '_GDIPlus_GraphicsFillRect ( $hGraphics, $nX, $nY, $nWidth, $nHeight [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush object that is used to fill the rectangle. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsFillRegion: {
    documentation: 'Uses a brush to fill a specified region',
    label: '_GDIPlus_GraphicsFillRegion ( $hGraphics, $hRegion [, $hBrush = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hRegion',
        documentation: 'Pointer to a region to be filled',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Pointer to a brush that is used to paint the region. If 0, a black brush will be used.',
      },
    ],
  },
  _GDIPlus_GraphicsGetCompositingMode: {
    documentation: 'Gets the compositing mode currently set for a Graphics object',
    label: '_GDIPlus_GraphicsGetCompositingMode ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsGetCompositingQuality: {
    documentation: 'Gets the compositing quality currently set for a Graphics object',
    label: '_GDIPlus_GraphicsGetCompositingQuality ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsGetDC: {
    documentation: 'Gets a handle to the device context of the Graphics object',
    label: '_GDIPlus_GraphicsGetDC ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsGetInterpolationMode: {
    documentation: 'Gets the interpolation mode currently set for a Graphics object',
    label: '_GDIPlus_GraphicsGetInterpolationMode ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsGetSmoothingMode: {
    documentation: 'Gets the graphics object rendering quality',
    label: '_GDIPlus_GraphicsGetSmoothingMode ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsGetTransform: {
    documentation: 'Gets the world transformation matrix of a Graphics object',
    label: '_GDIPlus_GraphicsGetTransform ( $hGraphics, $hMatrix )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object that receives the transformation matrix',
      },
    ],
  },
  _GDIPlus_GraphicsMeasureCharacterRanges: {
    documentation:
      'Gets a set of region objects each of which bounds a range of character positions within a string',
    label:
      '_GDIPlus_GraphicsMeasureCharacterRanges ( $hGraphics, $sString, $hFont, $tLayout, $hStringFormat )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$sString',
        documentation: 'The string to measure',
      },
      {
        label: '$hFont',
        documentation: 'Pointer to a Font object that specifies the font characteristics',
      },
      {
        label: '$tLayout',
        documentation: '$tagGDIPRECTF structure that defines the string boundaries',
      },
      {
        label: '$hStringFormat',
        documentation:
          'Pointer to a StringFormat object that specifies the character ranges and layout information, such as alignment, trimming, tab stops, and so forth',
      },
    ],
  },
  _GDIPlus_GraphicsMeasureString: {
    documentation: 'Measures the size of a string',
    label: '_GDIPlus_GraphicsMeasureString ( $hGraphics, $sString, $hFont, $tLayout, $hFormat )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$sString',
        documentation: 'String to be drawn',
      },
      {
        label: '$hFont',
        documentation: 'Handle to the font to use to draw the string',
      },
      {
        label: '$tLayout',
        documentation: '$tagGDIPRECTF structure that bounds the string',
      },
      {
        label: '$hFormat',
        documentation: 'Handle to the string format to draw the string',
      },
    ],
  },
  _GDIPlus_GraphicsReleaseDC: {
    documentation: 'Releases the device context of the Graphics object',
    label: '_GDIPlus_GraphicsReleaseDC ( $hGraphics, $hDC )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hDC',
        documentation: 'Handle to the Graphics device context',
      },
    ],
  },
  _GDIPlus_GraphicsResetClip: {
    documentation: 'Sets the clipping region of a Graphics object to an infinite region',
    label: '_GDIPlus_GraphicsResetClip ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsResetTransform: {
    documentation:
      'Sets the world transformation matrix of a Graphics object to the identity matrix',
    label: '_GDIPlus_GraphicsResetTransform ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsRestore: {
    documentation:
      'Restores the state of a Graphics object to the state stored by a previous call to the _GDIPlus_GraphicsSave method of the Graphics object',
    label: '_GDIPlus_GraphicsRestore ( $hGraphics, $iState )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iState',
        documentation:
          'Value identifying the block of saved state previously returned by _GDIPlus_GraphicsSave().',
      },
    ],
  },
  _GDIPlus_GraphicsRotateTransform: {
    documentation:
      'Updates the world transformation matrix of a Graphics object with the product of itself and a rotation matrix',
    label: '_GDIPlus_GraphicsRotateTransform ( $hGraphics, $fAngle [, $iOrder = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$fAngle',
        documentation: 'The angle, in degrees, of rotation',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The rotation matrix is on the left    1 - The rotation matrix is on the right',
      },
    ],
  },
  _GDIPlus_GraphicsSave: {
    documentation:
      'Saves the current state (transformations, clipping region, and quality settings) of a Graphics object',
    label: '_GDIPlus_GraphicsSave ( $hGraphics )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
    ],
  },
  _GDIPlus_GraphicsScaleTransform: {
    documentation:
      "Updates a Graphics object's world transformation matrix with the product of itself and a scaling matrix",
    label: '_GDIPlus_GraphicsScaleTransform ( $hGraphics, $fScaleX, $fScaleY [, $iOrder = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$fScaleX',
        documentation: 'The horizontal scaling factor in the scaling matrix',
      },
      {
        label: '$fScaleY',
        documentation: 'The vertical scaling factor in the scaling matrix',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The scaling matrix is on the left    1 - The scaling matrix is on the right',
      },
    ],
  },
  _GDIPlus_GraphicsSetClipPath: {
    documentation:
      'Updates the clipping region of this Graphics object to a region that is the combination of itself and the region specified by a graphics path',
    label: '_GDIPlus_GraphicsSetClipPath ( $hGraphics, $hPath [, $iCombineMode = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hPath',
        documentation:
          'Pointer to a GraphicsPath object that specifies the region to be combined with the clipping region of the Graphics object',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Regions combination mode:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_GraphicsSetClipRect: {
    documentation:
      'Updates the clipping region of a Graphics object to a region that is the combination of itself and a rectangle',
    label:
      '_GDIPlus_GraphicsSetClipRect ( $hGraphics, $nX, $nY, $nWidth, $nHeight [, $iCombineMode = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'Width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'Height of the rectangle',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Regions combination mode:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_GraphicsSetClipRegion: {
    documentation:
      'Updates the clipping region of a Graphics object to a region that is the combination of itself and the region specified by a Region object',
    label: '_GDIPlus_GraphicsSetClipRegion ( $hGraphics, $hRegion [, $iCombineMode = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$hRegion',
        documentation:
          'Pointer to a Region object to be combined with the clipping region of the Graphics object',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Regions combination mode:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_GraphicsSetCompositingMode: {
    documentation: 'Sets the compositing mode of a Graphics object',
    label: '_GDIPlus_GraphicsSetCompositingMode ( $hGraphics, $iCompositionMode )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iCompositionMode',
        documentation:
          'Compositing mode:    0 - Specifies that when a color is rendered, it is blended with the background color.    1 - Specifies that when a color is rendered, it overwrites the background color.',
      },
    ],
  },
  _GDIPlus_GraphicsSetCompositingQuality: {
    documentation: 'Sets the compositing quality of a Graphics object',
    label: '_GDIPlus_GraphicsSetCompositingQuality ( $hGraphics, $iCompositionQuality )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iCompositionQuality',
        documentation:
          'Compositing quality:    0 - Gamma correction is not applied.    1 - Gamma correction is not applied. High speed, low quality.    2 - Gamma correction is applied. Composition of high quality and speed.    3 - Gamma correction is applied.    4 - Gamma correction is not applied. Linear values are used.',
      },
    ],
  },
  _GDIPlus_GraphicsSetInterpolationMode: {
    documentation: 'Sets the interpolation mode of a Graphics object',
    label: '_GDIPlus_GraphicsSetInterpolationMode ( $hGraphics, $iInterpolationMode )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iInterpolationMode',
        documentation:
          'Interpolation mode:    0 - Default interpolation mode    1 - Low-quality mode    2 - High-quality mode    3 - Bilinear interpolation. No prefiltering is done    4 - Bicubic interpolation. No prefiltering is done    5 - Nearest-neighbor interpolation    6 - High-quality, bilinear interpolation. Prefiltering is performed to ensure high-quality shrinking    7 - High-quality, bicubic interpolation. Prefiltering is performed to ensure high-quality shrinking',
      },
    ],
  },
  _GDIPlus_GraphicsSetPixelOffsetMode: {
    documentation: 'Sets the pixel offset mode of a Graphics object',
    label: '_GDIPlus_GraphicsSetPixelOffsetMode ( $hGraphics, $iPixelOffsetMode )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iPixelOffsetMode',
        documentation:
          'Pixel offset mode:\t0,1,3 - Pixel centers have integer coordinates\t2,4 - Pixel centers have coordinates that are half way between integer values (i.e. 0.5, 20, 105.5, etc...)',
      },
    ],
  },
  _GDIPlus_GraphicsSetSmoothingMode: {
    documentation: 'Sets the graphics object rendering quality',
    label: '_GDIPlus_GraphicsSetSmoothingMode ( $hGraphics, $iSmooth )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$iSmooth',
        documentation:
          'Smoothing mode:    0 - Smoothing is not applied    1 - Smoothing is applied using an 8 X 4 box filter    2 - Smoothing is applied using an 8 X 8 box filter',
      },
    ],
  },
  _GDIPlus_GraphicsSetTextRenderingHint: {
    documentation: 'Sets the contrast value of a Graphics object',
    label: '_GDIPlus_GraphicsSetTextRenderingHint ( $hGraphics, $iTextRenderingHint )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$iTextRenderingHint',
        documentation:
          'Text rendering mode:    0 - Character is drawn using the currently selected system font smoothing mode (also called a rendering hint)    1 - Character is drawn using its glyph bitmap and hinting to improve character appearance on stems and    2 - Character is drawn using its glyph bitmap and no hinting. This results in better performance at the    3 - Character is drawn using its antialiased glyph bitmap and hinting. This results in much better quality    4 - Character is drawn using its antialiased glyph bitmap and no hinting. Stem width differences may be    5 - Character is drawn using its glyph Microsoft ClearType bitmap and hinting. This type of text rendering',
      },
    ],
  },
  _GDIPlus_GraphicsSetTransform: {
    documentation: 'Sets the world transformation for a graphics object',
    label: '_GDIPlus_GraphicsSetTransform ( $hGraphics, $hMatrix )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Handle to a Graphics object',
      },
      {
        label: '$hMatrix',
        documentation: 'Handle to a Matrix object that specifies the world transformation',
      },
    ],
  },
  _GDIPlus_GraphicsTransformPoints: {
    documentation: 'Converts an array of points from one coordinate space to another',
    label:
      '_GDIPlus_GraphicsTransformPoints ( $hGraphics, ByRef $aPoints [, $iCoordSpaceTo = 0 [, $iCoordSpaceFrom = 1]] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points to be converted:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$iCoordSpaceTo',
        documentation: '**[optional]** Destination coordinate space',
      },
      {
        label: '$iCoordSpaceFrom',
        documentation:
          '**[optional]** Source coordinate space:    0 - World coordinate space, not physical coordinates    1 - Page coordinate space, read-world coordinates    2 - Device coordinate space, physical coordinates',
      },
    ],
  },
  _GDIPlus_GraphicsTranslateTransform: {
    documentation:
      "Updates a Graphics object's world transformation matrix with the product of itself and a translation matrix",
    label: '_GDIPlus_GraphicsTranslateTransform ( $hGraphics, $nDX, $nDY [, $iOrder = 0] )',
    params: [
      {
        label: '$hGraphics',
        documentation: 'Pointer to a Graphics object',
      },
      {
        label: '$nDX',
        documentation: 'Horizontal component of the translation',
      },
      {
        label: '$nDY',
        documentation: 'Vertical component of the translation',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The translation matrix is on the left    1 - The translation matrix is on the right',
      },
    ],
  },
  _GDIPlus_HatchBrushCreate: {
    documentation:
      'Creates a HatchBrush object based on a hatch style, a foreground color, and a background color',
    label:
      '_GDIPlus_HatchBrushCreate ( [$iHatchStyle = 0 [, $iARGBForeground = 0xFFFFFFFF [, $iARGBBackground = 0xFFFFFFFF]]] )',
    params: [
      {
        label: '$iHatchStyle',
        documentation:
          '**[optional]** Pattern of hatch lines that will be used, see remarks. Default = $GDIP_HATCHSTYLE_HORIZONTAL (0).',
      },
      {
        label: '$iARGBForeground',
        documentation: '**[optional]** Alpha, Red, Green and Blue components of the hatch lines',
      },
      {
        label: '$iARGBBackground',
        documentation:
          '**[optional]** Alpha, Red, Green and Blue components of the hatch background',
      },
    ],
  },
  _GDIPlus_HICONCreateFromBitmap: {
    documentation: 'Creates an icon handle from a bitmap object',
    label: '_GDIPlus_HICONCreateFromBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Pointer to the Bitmap object',
      },
    ],
  },
  _GDIPlus_ImageAttributesCreate: {
    documentation: 'Creates an ImageAttributes object',
    label: '_GDIPlus_ImageAttributesCreate (  )',
    params: [],
  },
  _GDIPlus_ImageAttributesDispose: {
    documentation: 'Releases an ImageAttributes object',
    label: '_GDIPlus_ImageAttributesDispose ( $hImageAttributes )',
    params: [
      {
        label: '$hImageAttributes',
        documentation: 'Pointer to an ImageAttribute object',
      },
    ],
  },
  _GDIPlus_ImageAttributesSetColorKeys: {
    documentation: 'Sets or clears the color key (transparency range) for a specified category',
    label:
      '_GDIPlus_ImageAttributesSetColorKeys ( $hImageAttributes [, $iColorAdjustType = 0 [, $bEnable = False [, $iARGBLow = 0 [, $iARGBHigh = 0]]]] )',
    params: [
      {
        label: '$hImageAttributes',
        documentation: 'Pointer to an ImageAttribute object',
      },
      {
        label: '$iColorAdjustType',
        documentation:
          '**[optional]** The category for which the color key is set or cleared:    0 - Color adjustment applies to all categories that do not have adjustment settings of their own    1 - Color adjustment applies to bitmapped images    2 - Color adjustment applies to brush operations in metafiles    3 - Color adjustment applies to pen operations in metafiles    4 - Color adjustment applies to text drawn in metafiles',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** If True, transparency range for the specified category is applied; otherwise, transparency',
      },
      {
        label: '$iARGBLow',
        documentation:
          '**[optional]** Alpha, Red, Green and Blue components of a color that specifies the low color-key value',
      },
      {
        label: '$iARGBHigh',
        documentation:
          '**[optional]** Alpha, Red, Green and Blue components of a color that specifies the high color-key value',
      },
    ],
  },
  _GDIPlus_ImageAttributesSetColorMatrix: {
    documentation:
      'Sets or clears the color- and grayscale-adjustment matrices for a specified category',
    label:
      '_GDIPlus_ImageAttributesSetColorMatrix ( $hImageAttributes [, $iColorAdjustType = 0 [, $bEnable = False [, $tClrMatrix = 0 [, $tGrayMatrix = 0 [, $iColorMatrixFlags = 0]]]]] )',
    params: [
      {
        label: '$hImageAttributes',
        documentation: 'Pointer to an ImageAttribute object',
      },
      {
        label: '$iColorAdjustType',
        documentation:
          '**[optional]** The category for which the color- and grayscale-adjustment matrices are set or cleared:    0 - Color or grayscale adjustment applies to all categories that do not have adjustment settings of their own    1 - Color or grayscale adjustment applies to bitmapped images    2 - Color or grayscale adjustment applies to brush operations in metafiles    3 - Color or grayscale adjustment applies to pen operations in metafiles    4 - Color or grayscale adjustment applies to text drawn in metafiles',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** If True, the specified matrices (color, grayscale or both) adjustments for the specified',
      },
      {
        label: '$tClrMatrix',
        documentation:
          '**[optional]** $tagGDIPCOLORMATRIX structure that specifies a color-adjustment matrix',
      },
      {
        label: '$tGrayMatrix',
        documentation:
          '**[optional]** $tagGDIPCOLORMATRIX structure that specifies a grayscale-adjustment matrix',
      },
      {
        label: '$iColorMatrixFlags',
        documentation:
          '**[optional]** Type of image and color that will be affected by the adjustment matrices:    0 - All color values (including grays) are adjusted by the same color-adjustment matrix    1 - Colors are adjusted but gray shades are not adjusted.    2 - Colors are adjusted by one matrix and gray shades are adjusted by another matrix',
      },
    ],
  },
  _GDIPlus_ImageDispose: {
    documentation: 'Release an image object',
    label: '_GDIPlus_ImageDispose ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetDimension: {
    documentation: 'Gets the width and height of an image which is supported by GDIPlus',
    label: '_GDIPlus_ImageGetDimension ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: ' A handle to image object',
      },
    ],
  },
  _GDIPlus_ImageGetFlags: {
    documentation: 'Returns enumeration of pixel data attributes contained in an image',
    label: '_GDIPlus_ImageGetFlags ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetGraphicsContext: {
    documentation: 'Get the graphics context of the image',
    label: '_GDIPlus_ImageGetGraphicsContext ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetHeight: {
    documentation: 'Get the image height',
    label: '_GDIPlus_ImageGetHeight ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetHorizontalResolution: {
    documentation: 'Returns horizontal resolution in DPI (pixels per inch) of an image',
    label: '_GDIPlus_ImageGetHorizontalResolution ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetPixelFormat: {
    documentation:
      'Returns pixel format of an image: Bits per pixel, Alpha channels, RGB, Grayscale, Indexed etc',
    label: '_GDIPlus_ImageGetPixelFormat ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetRawFormat: {
    documentation: 'Returns file format GUID and image format name of an image',
    label: '_GDIPlus_ImageGetRawFormat ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetThumbnail: {
    documentation: 'Gets a thumbnail image from this Image object',
    label:
      '_GDIPlus_ImageGetThumbnail ( $hImage [, $iWidth = 0 [, $iHeight = 0 [, $bKeepRatio = True [, $hCallback = Null [, $hCallbackData = Null]]]]] )',
    params: [
      {
        label: '$hImage',
        documentation: ' A handle to image object',
      },
      {
        label: '$iWidth',
        documentation:
          ' **[optional]** Width, in pixels, of the requested thumbnail image. Default is 0.',
      },
      {
        label: '$iHeight',
        documentation:
          ' **[optional]** Height, in pixels, of the requested thumbnail image. Default is 0.',
      },
      {
        label: '$bKeepRatio',
        documentation:
          ' **[optional]** If true destination width and height of the image will be recalculated to keep image aspect ratio. Default is True.',
      },
      {
        label: '$hCallback',
        documentation:
          ' **[optional]** Callback function that you provide. During the process of creating or retrieving the thumbnail image, Microsoft Windows GDI+ calls this function to give you the opportunity to abort the process. The default value is NULL.',
      },
      {
        label: '$hCallbackData',
        documentation:
          ' **[optional]** Pointer to a block of memory that contains data to be used by the callback function. The default value is NULL.',
      },
    ],
  },
  _GDIPlus_ImageGetType: {
    documentation: 'Returns type (bitmap or metafile) of an image',
    label: '_GDIPlus_ImageGetType ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetVerticalResolution: {
    documentation: 'Returns vertical resolution in DPI (pixels per inch) of an image',
    label: '_GDIPlus_ImageGetVerticalResolution ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageGetWidth: {
    documentation: 'Get the image width',
    label: '_GDIPlus_ImageGetWidth ( $hImage )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
    ],
  },
  _GDIPlus_ImageLoadFromFile: {
    documentation: 'Create an image object based on a file',
    label: '_GDIPlus_ImageLoadFromFile ( $sFileName )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Fully qualified image file name',
      },
    ],
  },
  _GDIPlus_ImageLoadFromStream: {
    documentation: 'Creates an Image object based on a stream',
    label: '_GDIPlus_ImageLoadFromStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation: 'Pointer to an IStream interface',
      },
    ],
  },
  _GDIPlus_ImageResize: {
    documentation: 'Resize an image to a new given size',
    label:
      '_GDIPlus_ImageResize ( $hImage, $iNewWidth, $iNewHeight [, $iInterpolationMode = $GDIP_INTERPOLATIONMODE_HIGHQUALITYBICUBIC] )',
    params: [
      {
        label: '$hImage',
        documentation: 'A handle value',
      },
      {
        label: '$iNewWidth',
        documentation: 'An integer value',
      },
      {
        label: '$iNewHeight',
        documentation: 'An integer value',
      },
      {
        label: '$iInterpolationMode',
        documentation:
          '**[optional]** An integer value. Default is $GDIP_INTERPOLATIONMODE_HIGHQUALITYBICUBIC.',
      },
    ],
  },
  _GDIPlus_ImageRotateFlip: {
    documentation: 'Rotates and flips an image',
    label: '_GDIPlus_ImageRotateFlip ( $hImage, $iRotateFlipType )',
    params: [
      {
        label: '$hImage',
        documentation: 'Pointer to an Image object',
      },
      {
        label: '$iRotateFlipType',
        documentation:
          'Type of rotation and flip:    0 - No rotation and no flipping (A 180-degree rotation, a horizontal flip and then a vertical flip)    1 - A 90-degree rotation without flipping (A 270-degree rotation, a horizontal flip and then a vertical flip)    2 - A 180-degree rotation without flipping (No rotation, a horizontal flip followed by a vertical flip)    3 - A 270-degree rotation without flipping (A 90-degree rotation, a horizontal flip and then a vertical flip)    4 - No rotation and a horizontal flip (A 180-degree rotation followed by a vertical flip)    5 - A 90-degree rotation followed by a horizontal flip (A 270-degree rotation followed by a vertical flip)    6 - A 180-degree rotation followed by a horizontal flip (No rotation and a vertical flip)    7 - A 270-degree rotation followed by a horizontal flip (A 90-degree rotation followed by a vertical flip)',
      },
    ],
  },
  _GDIPlus_ImageSaveToFile: {
    documentation: 'Save an image to file',
    label: '_GDIPlus_ImageSaveToFile ( $hImage, $sFileName )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
      {
        label: '$sFileName',
        documentation: 'Fully qualified image file name',
      },
    ],
  },
  _GDIPlus_ImageSaveToFileEx: {
    documentation: 'Save an image to file',
    label: '_GDIPlus_ImageSaveToFileEx ( $hImage, $sFileName, $sEncoder [, $tParams = 0] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to an image object',
      },
      {
        label: '$sFileName',
        documentation: 'Fully qualified image file name',
      },
      {
        label: '$sEncoder',
        documentation: 'GUID string of encoder to be used',
      },
      {
        label: '$tParams',
        documentation: '**[optional]** a $tagGDIPENCODERPARAMS structure or a pointer to it',
      },
    ],
  },
  _GDIPlus_ImageSaveToStream: {
    documentation: 'Saves an Image object to a stream',
    label: '_GDIPlus_ImageSaveToStream ( $hImage, $pStream, $tEncoder [, $tParams = 0] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Pointer to an Image object',
      },
      {
        label: '$pStream',
        documentation: 'Pointer to an IStream interface',
      },
      {
        label: '$tEncoder',
        documentation: 'a $tagGUID structure that defines the image encoder GUID',
      },
      {
        label: '$tParams',
        documentation: '**[optional]** a $tagGDIPENCODERPARAMS structure or a pointer to it',
      },
    ],
  },
  _GDIPlus_ImageScale: {
    documentation: 'Scales an image by a given factor',
    label:
      '_GDIPlus_ImageScale ( $hImage, $iScaleW, $iScaleH [, $iInterpolationMode = $GDIP_INTERPOLATIONMODE_HIGHQUALITYBICUBIC] )',
    params: [
      {
        label: '$hImage',
        documentation: 'A handle value',
      },
      {
        label: '$iScaleW',
        documentation: 'A floating point value',
      },
      {
        label: '$iScaleH',
        documentation: 'A floating point value',
      },
      {
        label: '$iInterpolationMode',
        documentation:
          '**[optional]** An integer value. Default is $GDIP_INTERPOLATIONMODE_HIGHQUALITYBICUBIC.',
      },
    ],
  },
  _GDIPlus_LineBrushCreate: {
    documentation:
      'Creates a LinearGradientBrush object from a set of boundary points and boundary colors',
    label:
      '_GDIPlus_LineBrushCreate ( $nX1, $nY1, $nX2, $nY2, $iARGBClr1, $iARGBClr2 [, $iWrapMode = 0] )',
    params: [
      {
        label: '$nX1',
        documentation:
          'X coordinate of the starting point of the gradient. The starting boundary line passes through the',
      },
      {
        label: '$nY1',
        documentation:
          'Y coordinate of the starting point of the gradient. The starting boundary line passes through the',
      },
      {
        label: '$nX2',
        documentation:
          'X coordinate of the ending point of the gradient. The ending boundary line passes through the',
      },
      {
        label: '$nY2',
        documentation:
          'Y coordinate of the ending point of the gradient. The ending boundary line passes through the',
      },
      {
        label: '$iARGBClr1',
        documentation: 'Alpha, Red, Green and Blue components of the starting color of the line',
      },
      {
        label: '$iARGBClr2',
        documentation: 'Alpha, Red, Green and Blue components of the ending color of the line',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Wrap mode that specifies how areas filled with the brush are tiled:    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_LineBrushCreateFromRect: {
    documentation: 'Creates a LinearGradientBrush object from a rectangle and boundary colors',
    label:
      '_GDIPlus_LineBrushCreateFromRect ( $tRECTF, $iARGBClr1, $iARGBClr2 [, $iGradientMode = 0 [, $iWrapMode = 0]] )',
    params: [
      {
        label: '$tRECTF',
        documentation:
          '$tagGDIPRECTF that specifies the starting and ending points of the gradient',
      },
      {
        label: '$iARGBClr1',
        documentation: 'Alpha, Red, Green and Blue components of the starting color of the line',
      },
      {
        label: '$iARGBClr2',
        documentation: 'Alpha, Red, Green and Blue components of the ending color of the line',
      },
      {
        label: '$iGradientMode',
        documentation:
          '**[optional]** The direction of the gradient:    0 - Horizontal direction from the left of the display to the right of the display    1 - Vertical direction from the top of the display to the bottom of the display    2 - Forward diagonal direction from the upper-left corner to the lower-right corner of the display    3 - Backward diagonal direction from the upper-right corner to the lower-left corner of the display',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Specifies how areas filled with the brush are tiled:    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_LineBrushCreateFromRectWithAngle: {
    documentation:
      'Creates a LinearGradientBrush object from a rectangle, boundary colors and angle of direction',
    label:
      '_GDIPlus_LineBrushCreateFromRectWithAngle ( $tRECTF, $iARGBClr1, $iARGBClr2, $fAngle [, $bIsAngleScalable = True [, $iWrapMode = 0]] )',
    params: [
      {
        label: '$tRECTF',
        documentation:
          '$tagGDIPRECTF that specifies the starting and ending points of the gradient',
      },
      {
        label: '$iARGBClr1',
        documentation: 'Alpha, Red, Green and Blue components of the starting color of the line',
      },
      {
        label: '$iARGBClr2',
        documentation: 'Alpha, Red, Green and Blue components of the ending color of the line',
      },
      {
        label: '$fAngle',
        documentation:
          'Depending the value of $fIsAngleScalable, this is the angle, in degrees (see remarks)',
      },
      {
        label: '$bIsAngleScalable',
        documentation:
          '**[optional]** If True, the angle of the directional line is scalable. Not scalable otherwise',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Specifies how areas filled with the brush are tiled:    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_LineBrushGetColors: {
    documentation: 'Gets the starting color and ending color of a linear gradient brush',
    label: '_GDIPlus_LineBrushGetColors ( $hLineGradientBrush )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
    ],
  },
  _GDIPlus_LineBrushGetRect: {
    documentation: 'Gets the rectangle that defines the boundaries of a linear gradient brush',
    label: '_GDIPlus_LineBrushGetRect ( $hLineGradientBrush )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
    ],
  },
  _GDIPlus_LineBrushMultiplyTransform: {
    documentation:
      "Updates a brush's transformation matrix with the product of itself and another matrix",
    label: '_GDIPlus_LineBrushMultiplyTransform ( $hLineGradientBrush, $hMatrix [, $iOrder = 0] )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object that specifies the transformation matrix',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The passed matrix is on the left    1 - The passed matrix is on the right',
      },
    ],
  },
  _GDIPlus_LineBrushResetTransform: {
    documentation:
      'Resets the transformation matrix of a linear gradient brush to the identity matrix',
    label: '_GDIPlus_LineBrushResetTransform ( $hLineGradientBrush )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
    ],
  },
  _GDIPlus_LineBrushSetBlend: {
    documentation:
      'Sets the blend factors and the blend positions of a linear gradient brush to create a custom blend',
    label: '_GDIPlus_LineBrushSetBlend ( $hLineGradientBrush, $aBlends )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$aBlends',
        documentation:
          'Array of blend factors and blend positions:    [0][0] - Number of blend factors and blend positions, must be at least 2    [1][0] - Factor 1    [1][1] - Position 1    [2][0] - Factor 2    [2][1] - Position 2    [n][0] - Factor n    [n][1] - Position n',
      },
    ],
  },
  _GDIPlus_LineBrushSetColors: {
    documentation: 'Sets the starting color and ending color of a linear gradient brush',
    label: '_GDIPlus_LineBrushSetColors ( $hLineGradientBrush, $iARGBStart, $iARGBEnd )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$iARGBStart',
        documentation: 'Alpha, Red, Green and Blue components of the starting color',
      },
      {
        label: '$iARGBEnd',
        documentation: 'Alpha, Red, Green and Blue components of the ending color',
      },
    ],
  },
  _GDIPlus_LineBrushSetGammaCorrection: {
    documentation: 'Specifies whether gamma correction is enabled for a linear gradient brush',
    label:
      '_GDIPlus_LineBrushSetGammaCorrection ( $hLineGradientBrush [, $bUseGammaCorrection = True] )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$bUseGammaCorrection',
        documentation:
          '**[optional]** If True, gamma correction is enabled; otherwise gamma correction is disabled',
      },
    ],
  },
  _GDIPlus_LineBrushSetLinearBlend: {
    documentation:
      'Sets the blend shape of a linear gradient brush to create a custom blend based on a triangular shape',
    label: '_GDIPlus_LineBrushSetLinearBlend ( $hLineGradientBrush, $fFocus [, $fScale = 1] )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$fFocus',
        documentation:
          'Number in the range 0.0 to 1.0 that specifies the position of the ending color',
      },
      {
        label: '$fScale',
        documentation:
          "**[optional]** Number in the range 0.0 to 1.0 that specifies the percentage of the gradient's ending color that gets blended, at the focus position, with the gradient's starting color. The default value is 1, which specifies that the ending color is at full intensity",
      },
    ],
  },
  _GDIPlus_LineBrushSetPresetBlend: {
    documentation:
      'Sets the colors to be interpolated for a linear gradient brush and their corresponding blend positions',
    label: '_GDIPlus_LineBrushSetPresetBlend ( $hLineGradientBrush, $aInterpolations )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$aInterpolations',
        documentation:
          'Array of blend colors and blend positions:    [0][0] - Number of blend colors and blend positions, must be at least 2    [1][0] - Color 1    [1][1] - Position 1    [2][0] - Color 2    [2][1] - Position 2    [n][0] - Color n    [n][1] - Position n',
      },
    ],
  },
  _GDIPlus_LineBrushSetSigmaBlend: {
    documentation:
      'Sets the blend shape of a linear gradient brush to create a custom blend based on a bell-shaped curve',
    label: '_GDIPlus_LineBrushSetSigmaBlend ( $hLineGradientBrush, $fFocus [, $fScale = 1] )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$fFocus',
        documentation:
          'Number in the range 0.0 to 1.0 that specifies the position of the ending color',
      },
      {
        label: '$fScale',
        documentation:
          "**[optional]** Number in the range 0.0 to 1.0 that specifies the percentage of the gradient's ending",
      },
    ],
  },
  _GDIPlus_LineBrushSetTransform: {
    documentation: 'Sets the transformation matrix of a linear gradient brush',
    label: '_GDIPlus_LineBrushSetTransform ( $hLineGradientBrush, $hMatrix )',
    params: [
      {
        label: '$hLineGradientBrush',
        documentation: 'Pointer to a LinearGradientBrush object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object that specifies the transformation matrix',
      },
    ],
  },
  _GDIPlus_MatrixClone: {
    documentation: 'Clones a Matrix object',
    label: '_GDIPlus_MatrixClone ( $hMatrix )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object',
      },
    ],
  },
  _GDIPlus_MatrixCreate: {
    documentation: 'Creates and initializes a Matrix object that represents the identity matrix',
    label: '_GDIPlus_MatrixCreate (  )',
    params: [],
  },
  _GDIPlus_MatrixDispose: {
    documentation: 'Release a matrix object',
    label: '_GDIPlus_MatrixDispose ( $hMatrix )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Handle to a Matrix object',
      },
    ],
  },
  _GDIPlus_MatrixGetElements: {
    documentation: 'Gets the elements of a matrix',
    label: '_GDIPlus_MatrixGetElements ( $hMatrix )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object',
      },
    ],
  },
  _GDIPlus_MatrixInvert: {
    documentation: 'Replaces the elements of a matrix with the elements of its inverse',
    label: '_GDIPlus_MatrixInvert ( $hMatrix )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object',
      },
    ],
  },
  _GDIPlus_MatrixMultiply: {
    documentation: 'Updates a matrix with the product of itself and another matrix',
    label: '_GDIPlus_MatrixMultiply ( $hMatrix1, $hMatrix2 [, $iOrder = 0] )',
    params: [
      {
        label: '$hMatrix1',
        documentation: 'Pointer to a Matrix object',
      },
      {
        label: '$hMatrix2',
        documentation: 'Pointer to a Matrix object that will be multiplied by the first matrix',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The second matrix is on the left    1 - The second matrix is on the right',
      },
    ],
  },
  _GDIPlus_MatrixRotate: {
    documentation: 'Updates a matrix with the product of itself and a rotation matrix',
    label: '_GDIPlus_MatrixRotate ( $hMatrix, $fAngle [, $bAppend = False] )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Handle to a Matrix object',
      },
      {
        label: '$fAngle',
        documentation:
          'The angle of rotation in degrees. Positive values specify clockwise rotation.',
      },
      {
        label: '$bAppend',
        documentation:
          '**[optional]** Specifies the order of the multiplication:    True - Specifies that the rotation matrix is on the left    False - Specifies that the rotation matrix is on the right',
      },
    ],
  },
  _GDIPlus_MatrixScale: {
    documentation: 'Updates a matrix with the product of itself and a scaling matrix',
    label: '_GDIPlus_MatrixScale ( $hMatrix, $fScaleX, $fScaleY [, $bOrder = False] )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Handle to a Matrix object',
      },
      {
        label: '$fScaleX',
        documentation: 'Multiplier to scale the x-axis',
      },
      {
        label: '$fScaleY',
        documentation: 'Multiplier to scale the y-axis',
      },
      {
        label: '$bOrder',
        documentation:
          '**[optional]** Specifies the order of the multiplication:    True - Specifies that the scaling matrix is on the left    False - Specifies that the scaling matrix is on the right',
      },
    ],
  },
  _GDIPlus_MatrixSetElements: {
    documentation: 'Sets the elements of a matrix',
    label:
      '_GDIPlus_MatrixSetElements ( $hMatrix [, $nM11 = 1 [, $nM12 = 0 [, $nM21 = 0 [, $nM22 = 1 [, $nDX = 0 [, $nDY = 0]]]]]] )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'A handle value',
      },
      {
        label: '$nM11',
        documentation: '**[optional]** A floating point number value. Default is 1',
      },
      {
        label: '$nM12',
        documentation: '**[optional]** A floating point number value. Default is 0',
      },
      {
        label: '$nM21',
        documentation: '**[optional]** A floating point number value. Default is 0',
      },
      {
        label: '$nM22',
        documentation: '**[optional]** A floating point number value. Default is 1',
      },
      {
        label: '$nDX',
        documentation: '**[optional]** A floating point number value. Default is 0',
      },
      {
        label: '$nDY',
        documentation: '**[optional]** A floating point number value. Default is 0',
      },
    ],
  },
  _GDIPlus_MatrixShear: {
    documentation: 'Updates a matrix with the product of itself and another matrix',
    label: '_GDIPlus_MatrixShear ( $hMatrix, $fShearX, $fShearY [, $iOrder = 0] )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object',
      },
      {
        label: '$fShearX',
        documentation: 'Real number that specifies the horizontal shear factor',
      },
      {
        label: '$fShearY',
        documentation: 'Real number that specifies the vertical shear factor',
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The passed matrix is on the left    1 - The passed matrix is on the right',
      },
    ],
  },
  _GDIPlus_MatrixTransformPoints: {
    documentation: 'Multiplies each point in an array by a matrix',
    label: '_GDIPlus_MatrixTransformPoints ( $hMatrix, ByRef $aPoints )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points to be transformed:    [0][0] - Number of points    [1][0] - Point 1 X coordinate    [1][1] - Point 1 Y coordinate    [2][0] - Point 2 X coordinate    [2][1] - Point 2 Y coordinate    [n][0] - Point n X coordinate    [n][1] - Point n Y coordinate',
      },
    ],
  },
  _GDIPlus_MatrixTranslate: {
    documentation: 'Updates a matrix with the product of itself and a translation matrix',
    label: '_GDIPlus_MatrixTranslate ( $hMatrix, $fOffsetX, $fOffsetY [, $bAppend = False] )',
    params: [
      {
        label: '$hMatrix',
        documentation: 'Handle to a Matrix object',
      },
      {
        label: '$fOffsetX',
        documentation: 'Amount of pixels to add along the x-axis',
      },
      {
        label: '$fOffsetY',
        documentation: 'Amount of pixels to add along the y-axis',
      },
      {
        label: '$bAppend',
        documentation:
          '**[optional]** Specifies the order of the multiplication:    True - Specifies that the translation matrix is on the left    False - Specifies that the translation matrix is on the right',
      },
    ],
  },
  _GDIPlus_PaletteInitialize: {
    documentation: 'Initializes a standard, optimal, or custom color palette',
    label:
      '_GDIPlus_PaletteInitialize ( $iEntries [, $iPaletteType = $GDIP_PaletteTypeOptimal [, $iOptimalColors = 0 [, $bUseTransparentColor = True [, $hBitmap = Null]]]] )',
    params: [
      {
        label: '$iEntries',
        documentation: 'Number of Entries.',
      },
      {
        label: '$iPaletteType',
        documentation:
          '**[optional]** PaletteType constant that specifies the palette type ($GDIP_PaletteType*).',
      },
      {
        label: '$iOptimalColors',
        documentation:
          '**[optional]** Integer that specifies the number of colors you want to have in an optimal palette based on a specified bitmap.If this parameter is greater than 0, the palettetype parameter must be set to PaletteTypeOptimal and the bitmap parameter must point to a Bitmap object.',
      },
      {
        label: '$bUseTransparentColor',
        documentation:
          '**[optional]** Boolean value that specifies whether to include the transparent color in the palette.Set to TRUE to include the transparent color; otherwise FALSE.',
      },
      {
        label: '$hBitmap',
        documentation:
          '**[optional]** Handle of a Bitmap object for which an optimal palette will be created.',
      },
    ],
  },
  _GDIPlus_ParamAdd: {
    documentation: 'Add a value to an encoder parameter list',
    label: '_GDIPlus_ParamAdd ( ByRef $tParams, $sGUID, $iNbOfValues, $iType, $pValues )',
    params: [
      {
        label: '$tParams',
        documentation: '$tagGDIPENCODERPARAMS structure returned from _GDIPlus_ParamInit()',
      },
      {
        label: '$sGUID',
        documentation:
          'Encoder parameter GUID. Can be one of the following:    $GDIP_EPGCHROMINANCETABLE - Chrominance table settings    $GDIP_EPGCOLORDEPTH - Color depth settings    $GDIP_EPGCOMPRESSION - Compression settings    $GDIP_EPGLUMINANCETABLE - Luminance table settings    $GDIP_EPGQUALITY - Quality settings    $GDIP_EPGRENDERMETHOD - Render method settings    $GDIP_EPGSAVEFLAG - Save flag settings    $GDIP_EPGSCANMETHOD - Scan mode settings    $GDIP_EPGTRANSFORMATION - Transformation settings    $GDIP_EPGVERSION - Software version settings',
      },
      {
        label: '$iNbOfValues',
        documentation: 'Number of elements in the $pValues array',
      },
      {
        label: '$iType',
        documentation:
          'Encoder parameter value type. Can be one of the following:    $GDIP_EPTBYTE - 8 bit unsigned integer    $GDIP_EPTASCII - Null terminated character string    $GDIP_EPTSHORT - 16 bit unsigned integer    $GDIP_EPTLONG - 32 bit unsigned integer    $GDIP_EPTRATIONAL - Two longs (numerator, denominator)    $GDIP_EPTLONGRANGE - Two longs (low, high)    $GDIP_EPTUNDEFINED - Array of bytes of any type    $GDIP_EPTRATIONALRANGE - Two longs (low, high)',
      },
      {
        label: '$pValues',
        documentation:
          'Pointer to an array of values. Each value has the type specified by the $iType data member.',
      },
    ],
  },
  _GDIPlus_ParamInit: {
    documentation: 'Allocate an empty encoder parameter list',
    label: '_GDIPlus_ParamInit ( $iCount )',
    params: [
      {
        label: '$iCount',
        documentation: 'The total number of $tagGDIPENCODERPARAM that the list can contain',
      },
    ],
  },
  _GDIPlus_ParamSize: {
    documentation: 'Get an encoder parameter size',
    label: '_GDIPlus_ParamSize (  )',
    params: [],
  },
  _GDIPlus_PathAddArc: {
    documentation: 'Adds an elliptical arc to the current figure of a path',
    label:
      '_GDIPlus_PathAddArc ( $hPath, $nX, $nY, $nWidth, $nHeight, $fStartAngle, $fSweepAngle )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the upper-left corner of the ellipse that contains the arc',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the upper-left corner of the ellipse that contains the arc',
      },
      {
        label: '$nWidth',
        documentation: 'Width of the bounding rectangle for the ellipse that contains the arc',
      },
      {
        label: '$nHeight',
        documentation: 'Height of the bounding rectangle for the ellipse that contains the arc',
      },
      {
        label: '$fStartAngle',
        documentation:
          'The angle, in degrees, between the X axis and the starting point of the arc',
      },
      {
        label: '$fSweepAngle',
        documentation: 'The angle, in degrees, between the starting and ending points of the arc',
      },
    ],
  },
  _GDIPlus_PathAddBezier: {
    documentation: 'Adds a bezier spline to the current figure of a path',
    label: '_GDIPlus_PathAddBezier ( $hPath, $nX1, $nY1, $nX2, $nY2, $nX3, $nY3, $nX4, $nY4 )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX1',
        documentation: 'X coordinate of the starting point',
      },
      {
        label: '$nY1',
        documentation: 'Y coordinate of the starting point',
      },
      {
        label: '$nX2',
        documentation: 'X coordinate of the first control point',
      },
      {
        label: '$nY2',
        documentation: 'Y coordinate of the first control point',
      },
      {
        label: '$nX3',
        documentation: 'X coordinate of the second control point',
      },
      {
        label: '$nY3',
        documentation: 'Y coordinate of the second control point',
      },
      {
        label: '$nX4',
        documentation: 'X coordinate of the ending point',
      },
      {
        label: '$nY4',
        documentation: 'Y coordinate of the ending point',
      },
    ],
  },
  _GDIPlus_PathAddClosedCurve: {
    documentation: 'Adds a closed cardinal spline to a path',
    label: '_GDIPlus_PathAddClosedCurve ( $hPath, $aPoints )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
    ],
  },
  _GDIPlus_PathAddClosedCurve2: {
    documentation: 'Adds a closed cardinal spline to a path',
    label: '_GDIPlus_PathAddClosedCurve2 ( $hPath, $aPoints [, $nTension = 0.5] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$nTension',
        documentation:
          '**[optional]** Nonnegative real number that controls the length of the curve and how the curve bends.A value of 0 specifies that the spline is a sequence of straight lines.As the value increases, the curve becomes fuller.',
      },
    ],
  },
  _GDIPlus_PathAddCurve: {
    documentation: 'Adds a cardinal spline to the current figure of a path',
    label: '_GDIPlus_PathAddCurve ( $hPath, $aPoints )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
    ],
  },
  _GDIPlus_PathAddCurve2: {
    documentation: 'Adds a cardinal spline to the current figure of a path',
    label: '_GDIPlus_PathAddCurve2 ( $hPath, $aPoints [, $nTension = 0.5] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$nTension',
        documentation:
          '**[optional]** Nonnegative real number that controls the length of the curve and how the curve bends.A value of 0 specifies that the spline is a sequence of straight lines.As the value increases, the curve becomes fuller.',
      },
    ],
  },
  _GDIPlus_PathAddCurve3: {
    documentation: 'Adds a cardinal spline to the current figure of a path',
    label:
      '_GDIPlus_PathAddCurve3 ( $hPath, $aPoints, $iOffset, $iNumOfSegments [, $nTension = 0.5] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the cardinal spline:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
      {
        label: '$iOffset',
        documentation:
          'The index of the array element that is used as the first point of the cardinal spline, this is the index of the specific point in the array minus 1',
      },
      {
        label: '$iNumOfSegments',
        documentation:
          'Number of segments in the cardinal spline. Segments are the curves that connect consecutive points in the array',
      },
      {
        label: '$nTension',
        documentation:
          '**[optional]** Nonnegative real number that controls the length of the curve and how the curve bends.As the value increases, the curve becomes fuller.',
      },
    ],
  },
  _GDIPlus_PathAddEllipse: {
    documentation: 'Adds an ellipse to the current figure a path',
    label: '_GDIPlus_PathAddEllipse ( $hPath, $nX, $nY, $nWidth, $nHeight )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle that bounds the ellipse',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle that bounds the ellipse',
      },
    ],
  },
  _GDIPlus_PathAddLine: {
    documentation: 'Adds a line to the current figure of a path',
    label: '_GDIPlus_PathAddLine ( $hPath, $nX1, $nY1, $nX2, $nY2 )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX1',
        documentation: 'The X coordinate of the starting point of the line',
      },
      {
        label: '$nY1',
        documentation: 'The Y coordinate of the starting point of the line',
      },
      {
        label: '$nX2',
        documentation: 'The X coordinate of the ending point of the line',
      },
      {
        label: '$nY2',
        documentation: 'The Y coordinate of the ending point of the line',
      },
    ],
  },
  _GDIPlus_PathAddLine2: {
    documentation: 'Adds a sequence of lines to the current figure of a path',
    label: '_GDIPlus_PathAddLine2 ( $hPath, $aPoints )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the lines:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
    ],
  },
  _GDIPlus_PathAddPath: {
    documentation: 'Adds a path to another path',
    label: '_GDIPlus_PathAddPath ( $hPath1, $hPath2 [, $bConnect = True] )',
    params: [
      {
        label: '$hPath1',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hPath2',
        documentation: 'Pointer to a GraphicsPath object to be added to $hPath1',
      },
      {
        label: '$bConnect',
        documentation:
          '**[optional]** Specifies whether the first figure in the added path is part of the last figure in this path:    True - The first figure in the added $hPath2 is part of the last figure in the $hPath1 path    False - The first figure in the added $hPath2 is separated from the last figure in the $hPath1 path',
      },
    ],
  },
  _GDIPlus_PathAddPie: {
    documentation: 'Adds a pie to a path',
    label:
      '_GDIPlus_PathAddPie ( $hPath, $nX, $nY, $nWidth, $nHeight, $fStartAngle, $fSweepAngle )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation:
          'The X coordinate of the upper left corner of the rectangle that bounds the ellipse that bounds the pie',
      },
      {
        label: '$nY',
        documentation:
          'The Y coordinate of the upper left corner of the rectangle that bounds the ellipse that bounds the pie',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle that bounds the ellipse that bounds the pie',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle that bounds the ellipse that bounds the pie',
      },
      {
        label: '$fStartAngle',
        documentation:
          'The angle, in degrees, between the X axis and the starting point of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
      {
        label: '$fSweepAngle',
        documentation:
          'The angle, in degrees, between the starting and ending points of the arc that defines the pie.A positive value specifies clockwise rotation.',
      },
    ],
  },
  _GDIPlus_PathAddPolygon: {
    documentation: 'Adds a polygon to a path',
    label: '_GDIPlus_PathAddPolygon ( $hPath, $aPoints )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of points that define the vertices of the polygon:    [0][0] - Number of points    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [2][0] - Point 2 X position    [2][1] - Point 2 Y position    [n][0] - Point n X position    [n][1] - Point n Y position',
      },
    ],
  },
  _GDIPlus_PathAddRectangle: {
    documentation: 'Adds a rectangle to a path',
    label: '_GDIPlus_PathAddRectangle ( $hPath, $nX, $nY, $nWidth, $nHeight )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the upper-left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'Width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'Height of the rectangle',
      },
    ],
  },
  _GDIPlus_PathAddString: {
    documentation: 'Adds the outline of a string to a path',
    label:
      '_GDIPlus_PathAddString ( $hPath, $sString, $tLayout, $hFamily [, $iStyle = 0 [, $fSize = 8.5 [, $hFormat = 0]]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$sString',
        documentation: 'String to be drawn',
      },
      {
        label: '$tLayout',
        documentation: '$tagGDIPRECTF structure that bounds the string',
      },
      {
        label: '$hFamily',
        documentation:
          'Pointer to a FontFamily object that specifies the font family for the string',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the typeface. Can be a combination of the following:    0 - Normal weight or thickness of the typeface    1 - Bold typeface    2 - Italic typeface    4 - Underline    8 - Strikethrough',
      },
      {
        label: '$fSize',
        documentation: '**[optional]** The em size, in world units, of the string characters',
      },
      {
        label: '$hFormat',
        documentation:
          '**[optional]** Pointer to a StringFormat object that specifies layout information for the string',
      },
    ],
  },
  _GDIPlus_PathBrushCreate: {
    documentation:
      'Creates a PathGradientBrush object based on an array of points and initializes the wrap mode of the brush',
    label: '_GDIPlus_PathBrushCreate ( $aPoints [, $iWrapMode = 0] )',
    params: [
      {
        label: '$aPoints',
        documentation:
          'Array of points that specify the boundary path of the path gradient brush    [0][0] - Number of points    [1][0] - Point 1 X coordinate    [1][1] - Point 1 Y coordinate    [2][0] - Point 2 X coordinate    [2][1] - Point 2 Y coordinate    [n][0] - Point n X coordinate    [n][1] - Point n Y coordinate',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Wrap mode that specifies how areas filled with the brush are tiled:    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_PathBrushCreateFromPath: {
    documentation: 'Creates a PathGradientBrush object based on a GraphicsPath object',
    label: '_GDIPlus_PathBrushCreateFromPath ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation:
          'Pointer to a GraphicsPath object that specifies the boundary path of the path gradient brush',
      },
    ],
  },
  _GDIPlus_PathBrushGetCenterPoint: {
    documentation: 'Gets the center point of a path gradient brush',
    label: '_GDIPlus_PathBrushGetCenterPoint ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushGetFocusScales: {
    documentation: 'Gets the focus scales of a path gradient brush',
    label: '_GDIPlus_PathBrushGetFocusScales ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushGetPointCount: {
    documentation:
      "Gets the number of points in the array of points that defines a brush's boundary path",
    label: '_GDIPlus_PathBrushGetPointCount ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushGetRect: {
    documentation:
      'Gets the smallest rectangle that encloses the boundary path of a path gradient brush',
    label: '_GDIPlus_PathBrushGetRect ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushGetWrapMode: {
    documentation: 'Gets the wrap mode currently set for a path gradient brush',
    label: '_GDIPlus_PathBrushGetWrapMode ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushMultiplyTransform: {
    documentation:
      "Updates a brush's transformation matrix with the product of itself and another matrix",
    label: '_GDIPlus_PathBrushMultiplyTransform ( $hPathGradientBrush, $hMatrix [, $iOrder = 0] )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$hMatrix',
        documentation:
          "Pointer to a matrix to be multiplied by the brush's current transformation matrix",
      },
      {
        label: '$iOrder',
        documentation:
          '**[optional]** Order of matrices multiplication:    0 - The passed matrix is on the left    1 - The passed matrix is on the right',
      },
    ],
  },
  _GDIPlus_PathBrushResetTransform: {
    documentation:
      'Resets the transformation matrix of a path gradient brush to the identity matrix',
    label: '_GDIPlus_PathBrushResetTransform ( $hPathGradientBrush )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
    ],
  },
  _GDIPlus_PathBrushSetBlend: {
    documentation: 'Sets the blend factors and the blend positions of a path gradient brush',
    label: '_GDIPlus_PathBrushSetBlend ( $hPathGradientBrush, $aBlends )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$aBlends',
        documentation:
          'Array of blend factors and blend positions:    [0][0] - Number of blend factors and blend positions    [1][0] - Factor 1    [1][1] - Position 1    [2][0] - Factor 2    [2][1] - Position 2    [n][0] - Factor n    [n][1] - Position n',
      },
    ],
  },
  _GDIPlus_PathBrushSetCenterColor: {
    documentation: 'Sets the color of the center point of a path gradient brush',
    label: '_GDIPlus_PathBrushSetCenterColor ( $hPathGradientBrush, $iARGB )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$iARGB',
        documentation: 'Alpha, Red, Green and Blue components of the new center color',
      },
    ],
  },
  _GDIPlus_PathBrushSetCenterPoint: {
    documentation: 'Sets the center point of a path gradient brush',
    label: '_GDIPlus_PathBrushSetCenterPoint ( $hPathGradientBrush, $nX, $nY )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the new center point',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the new center point',
      },
    ],
  },
  _GDIPlus_PathBrushSetFocusScales: {
    documentation: 'Sets the focus scales of a path gradient brush',
    label: '_GDIPlus_PathBrushSetFocusScales ( $hPathGradientBrush, $fScaleX, $fScaleY )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$fScaleX',
        documentation: 'Real number that specifies the X focus scale',
      },
      {
        label: '$fScaleY',
        documentation: 'Real number that specifies the Y focus scale',
      },
    ],
  },
  _GDIPlus_PathBrushSetGammaCorrection: {
    documentation: 'Specifies whether gamma correction is enabled for a path gradient brush',
    label: '_GDIPlus_PathBrushSetGammaCorrection ( $hPathGradientBrush, $bUseGammaCorrection )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$bUseGammaCorrection',
        documentation:
          'If True, gamma correction is enabled; otherwise, gamma correction is disabled',
      },
    ],
  },
  _GDIPlus_PathBrushSetLinearBlend: {
    documentation:
      'Sets the blend shape of a path gradient brush to create a custom blend based on a triangular shape',
    label: '_GDIPlus_PathBrushSetLinearBlend ( $hPathGradientBrush, $fFocus [, $fScale = 1] )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$fFocus',
        documentation:
          'Number in the range 0.0 to 1.0 that specifies where the center color will be at its highest intensity',
      },
      {
        label: '$fScale',
        documentation:
          '**[optional]** Number in the range 0.0 to 1.0 that specifies the maximum intensity of center color that gets blended with the boundary color',
      },
    ],
  },
  _GDIPlus_PathBrushSetPresetBlend: {
    documentation: 'Sets the preset colors and the blend positions of a path gradient brush',
    label: '_GDIPlus_PathBrushSetPresetBlend ( $hPathGradientBrush, $aInterpolations )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$aInterpolations',
        documentation:
          'Array of blend colors and blend positions:    [0][0] - Number of preset colors and blend positions    [1][0] - Color 1    [1][1] - Position 1    [2][0] - Color 2    [2][1] - Position 2    [n][0] - Color n    [n][1] - Position n',
      },
    ],
  },
  _GDIPlus_PathBrushSetSigmaBlend: {
    documentation:
      'Sets the blend shape of a path gradient brush to create a custom blend based on a bell-shaped curve',
    label: '_GDIPlus_PathBrushSetSigmaBlend ( $hPathGradientBrush, $fFocus [, $fScale = 1] )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$fFocus',
        documentation:
          'Number in the range 0.0 to 1.0 that specifies where the center color will be at its highest intensity',
      },
      {
        label: '$fScale',
        documentation:
          '**[optional]** Number in the range 0.0 to 1.0 that specifies the maximum intensity of center color that gets blended with the boundary color',
      },
    ],
  },
  _GDIPlus_PathBrushSetSurroundColor: {
    documentation: 'Sets the surround color for a path gradient brush',
    label: '_GDIPlus_PathBrushSetSurroundColor ( $hPathGradientBrush, $iARGB )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$iARGB',
        documentation: 'Alpha, Red, Green and Blue components of the new surrounding colors',
      },
    ],
  },
  _GDIPlus_PathBrushSetSurroundColorsWithCount: {
    documentation: 'Sets the surround colors currently specified for a path gradient brush',
    label: '_GDIPlus_PathBrushSetSurroundColorsWithCount ( $hPathGradientBrush, $aColors )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$aColors',
        documentation:
          'Array containing the surrounding colors:    [0] - Number of colors    [1] - Color 1    [2] - Color 2    [n] - Color n',
      },
    ],
  },
  _GDIPlus_PathBrushSetTransform: {
    documentation: 'Sets the transformation matrix of a path gradient brush',
    label: '_GDIPlus_PathBrushSetTransform ( $hPathGradientBrush, $hMatrix )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object that specifies the transformation matrix',
      },
    ],
  },
  _GDIPlus_PathBrushSetWrapMode: {
    documentation: 'Sets the wrap mode of a path gradient brush',
    label: '_GDIPlus_PathBrushSetWrapMode ( $hPathGradientBrush, $iWrapMode )',
    params: [
      {
        label: '$hPathGradientBrush',
        documentation: 'Pointer to a PathGradientBrush object',
      },
      {
        label: '$iWrapMode',
        documentation:
          'Wrap mode that specifies how an area is tiled when it is painted with a brush:    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column',
      },
    ],
  },
  _GDIPlus_PathClone: {
    documentation: 'Clones a path',
    label: '_GDIPlus_PathClone ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object to be cloned',
      },
    ],
  },
  _GDIPlus_PathCloseFigure: {
    documentation: 'Closes the current figure of a path',
    label: '_GDIPlus_PathCloseFigure ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathCreate: {
    documentation: 'Creates a GraphicsPath object and initializes the fill mode',
    label: '_GDIPlus_PathCreate ( [$iFillMode = 0] )',
    params: [
      {
        label: '$iFillMode',
        documentation:
          '**[optional]** Fill mode of the interior of the path figures:    0 - The areas are filled according to the even-odd parity rule    1 - The areas are filled according to the nonzero winding rule',
      },
    ],
  },
  _GDIPlus_PathCreate2: {
    documentation:
      'Creates a GraphicsPath object based on an array of points, an array of types, and a fill mode',
    label: '_GDIPlus_PathCreate2 ( $aPathData [, $iFillMode = 0] )',
    params: [
      {
        label: '$aPathData',
        documentation:
          'Array of points and types that specifies the endpoints and control points of the lines and bezier splines that are used to draw the path and the points types:    [0][0] - Number of points and types    [1][0] - Point 1 X position    [1][1] - Point 1 Y position    [1][2] - Point 1 type    [n][0] - Point n X position    [n][1] - Point n Y position    [1][2] - Point n typeEach point type is one of the following values:    0x00 - The point is the start of a figure    0x01 - The point is one of the two endpoints of a line    0x03 - The point is an endpoint or control point of a cubic bezier spline    0x20 - The point is a marker    0x80 - The point is the last point in a closed subpath (figure)',
      },
      {
        label: '$iFillMode',
        documentation:
          '**[optional]** Fill mode of the interior of the path figures:    0 - The areas are filled according to the even-odd parity rule    1 - The areas are filled according to the nonzero winding rule',
      },
    ],
  },
  _GDIPlus_PathDispose: {
    documentation: 'Releases a GraphicsPath object',
    label: '_GDIPlus_PathDispose ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathFlatten: {
    documentation:
      'Applies a transformation to a path and converts each curve in the path to a sequence of connected lines',
    label: '_GDIPlus_PathFlatten ( $hPath [, $fFlatness = 0.25 [, $hMatrix = 0]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$fFlatness',
        documentation:
          '**[optional]** Real number that specifies the maximum error between the path and its flattened approximation.Reducing the flatness increases the number of line segments in the approximation',
      },
      {
        label: '$hMatrix',
        documentation:
          "**[optional]** Pointer to a Matrix object that specifies the transformation to be applied to the path's data points",
      },
    ],
  },
  _GDIPlus_PathGetData: {
    documentation: 'Gets an array of points and types from a path',
    label: '_GDIPlus_PathGetData ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathGetFillMode: {
    documentation: 'Gets the fill mode of a path',
    label: '_GDIPlus_PathGetFillMode ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathGetLastPoint: {
    documentation: 'Gets the ending point of the last figure in a path',
    label: '_GDIPlus_PathGetLastPoint ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathGetPointCount: {
    documentation: "Gets the number of points in a path's array of data points",
    label: '_GDIPlus_PathGetPointCount ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathGetPoints: {
    documentation: 'Gets an array of points from a path',
    label: '_GDIPlus_PathGetPoints ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathGetWorldBounds: {
    documentation: 'Gets the bounding rectangle for a path',
    label: '_GDIPlus_PathGetWorldBounds ( $hPath [, $hMatrix = 0 [, $hPen = 0]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hMatrix',
        documentation:
          '**[optional]** Pointer to a Matrix object that specifies a transformation to be applied to this path before the bounding rectangle is calculated. The path is not permanently transformed',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Pointer to a Pen object that influences the size of the bounding rectangle.The bounding rectangle bounds will be large enough to enclose the path when the path is drawn with the specified pen.',
      },
    ],
  },
  _GDIPlus_PathIsOutlineVisiblePoint: {
    documentation:
      'Determines whether a specified point touches the outline of a path with the specified Graphics and Pen',
    label:
      '_GDIPlus_PathIsOutlineVisiblePoint ( $hPath, $nX, $nY [, $hPen = 0 [, $hGraphics = 0]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the point to test',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the point to test',
      },
      {
        label: '$hPen',
        documentation:
          '**[optional]** Pointer to a Pen object that define the width of point to test. If 0, a solid black pen with a width of 1 will be used',
      },
      {
        label: '$hGraphics',
        documentation:
          '**[optional]** Pointer to a Graphics object that specifies a world-to-device transformation. If 0, the test is done in world coordinates; otherwise, the test is done in device coordinates.',
      },
    ],
  },
  _GDIPlus_PathIsVisiblePoint: {
    documentation:
      'Determines whether a specified point lies in the area that is filled when a path is filled by a specified Graphics object',
    label: '_GDIPlus_PathIsVisiblePoint ( $hPath, $nX, $nY [, $hGraphics = 0] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$nX',
        documentation: 'X coordinate of the point to test',
      },
      {
        label: '$nY',
        documentation: 'Y coordinate of the point to test',
      },
      {
        label: '$hGraphics',
        documentation:
          '**[optional]** Pointer to a Graphics object that specifies a world-to-device transformation. If 0, the test is done in world coordinates; otherwise, the test is done in device coordinates.',
      },
    ],
  },
  _GDIPlus_PathIterCreate: {
    documentation:
      'Creates a new GraphicsPathIterator object and associates it with a GraphicsPath object',
    label: '_GDIPlus_PathIterCreate ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation:
          'Pointer to a GraphicsPath object that will be associated with this GraphicsPathIterator object',
      },
    ],
  },
  _GDIPlus_PathIterDispose: {
    documentation: 'Releases a GraphicsPathIterator object',
    label: '_GDIPlus_PathIterDispose ( $hPathIter )',
    params: [
      {
        label: '$hPathIter',
        documentation:
          'Pointer to a GraphicsPath object that will be associated with this GraphicsPathIterator object',
      },
    ],
  },
  _GDIPlus_PathIterGetSubpathCount: {
    documentation: 'Gets the number of subpaths (also called figures) in the path',
    label: '_GDIPlus_PathIterGetSubpathCount ( $hPathIter )',
    params: [
      {
        label: '$hPathIter',
        documentation: 'Pointer to a GraphicsPathIterator object',
      },
    ],
  },
  _GDIPlus_PathIterNextMarkerPath: {
    documentation: "Gets the next marker-delimited section of an iterator's associated path",
    label: '_GDIPlus_PathIterNextMarkerPath ( $hPathIter, $hPath )',
    params: [
      {
        label: '$hPathIter',
        documentation: 'Pointer to a GraphicsPathIterator object',
      },
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathIterNextSubpathPath: {
    documentation: "Gets the next figure (subpath) from an iterator's associated path",
    label: '_GDIPlus_PathIterNextSubpathPath ( $hPathIter, $hPath )',
    params: [
      {
        label: '$hPathIter',
        documentation: 'Pointer to a GraphicsPathIterator object',
      },
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathIterRewind: {
    documentation: 'Rewinds an iterator to the beginning of its associated path',
    label: '_GDIPlus_PathIterRewind ( $hPathIter )',
    params: [
      {
        label: '$hPathIter',
        documentation: 'Pointer to a GraphicsPathIterator object',
      },
    ],
  },
  _GDIPlus_PathReset: {
    documentation: 'Empties a path and sets the fill mode to alternate (0)',
    label: '_GDIPlus_PathReset ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathReverse: {
    documentation: "Reverses the order of the points that define a path's lines and curves",
    label: '_GDIPlus_PathReverse ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathSetFillMode: {
    documentation: 'Sets the fill mode of a path',
    label: '_GDIPlus_PathSetFillMode ( $hPath, $iFillMode )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$iFillMode',
        documentation:
          'Path fill mode:    0 - The areas are filled according to the even-odd parity rule    1 - The areas are filled according to the nonzero winding rule',
      },
    ],
  },
  _GDIPlus_PathSetMarker: {
    documentation: 'Designates the last point in a path as a marker point',
    label: '_GDIPlus_PathSetMarker ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathStartFigure: {
    documentation:
      'Starts a new figure without closing the current figure. Subsequent points added to a path are added to the new figure',
    label: '_GDIPlus_PathStartFigure ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
    ],
  },
  _GDIPlus_PathTransform: {
    documentation: "Multiplies each of a path's data points by a specified matrix",
    label: '_GDIPlus_PathTransform ( $hPath, $hMatrix )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a Matrix object that specifies the transformation',
      },
    ],
  },
  _GDIPlus_PathWarp: {
    documentation:
      'Applies a warp transformation to a path. The function also flattens (converts to a sequence of straight lines) the path',
    label:
      '_GDIPlus_PathWarp ( $hPath, $hMatrix, $aPoints, $nX, $nY, $nWidth, $nHeight [, $iWarpMode = 0 [, $fFlatness = 0.25]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hMatrix',
        documentation:
          'Pointer to a Matrix object that represents a transformation to be applied along with the warp.',
      },
      {
        label: '$aPoints',
        documentation:
          'Array of parallelogram points that, along with the rectangle parameters, define the wrap mode:    [0][0] - Number of points. This number must be 3 or 4    [1][0] - Point 1 X coordinate    [1][1] - Point 1 Y coordinate    [2][0] - Point 2 X coordinate    [2][1] - Point 2 Y coordinate    [n][0] - Point n X coordinate    [n][1] - Point n Y coordinate',
      },
      {
        label: '$nX',
        documentation:
          'X coordinate of the upper left corner of the rectangle to be transformed into a parallelogram defined by $aPoints',
      },
      {
        label: '$nY',
        documentation:
          'Y coordinate of the upper left corner of the rectangle to be transformed into a parallelogram defined by $aPoints',
      },
      {
        label: '$nWidth',
        documentation:
          'Width of the rectangle to be transformed into a parallelogram defined by $aPoints',
      },
      {
        label: '$nHeight',
        documentation:
          'Height of the rectangle to be transformed into a parallelogram defined by $aPoints',
      },
      {
        label: '$iWarpMode',
        documentation:
          '**[optional]** Kind of warp to be applied:    0 - Specifies the perspective warp mode    1 - Specifies the bilinear warp mode',
      },
      {
        label: '$fFlatness',
        documentation:
          '**[optional]** Real number that influences the number of line segments that are used to approximate the original path.Small values specify that many line segments are used, and large values specify that few line segments are used.',
      },
    ],
  },
  _GDIPlus_PathWiden: {
    documentation:
      'Replaces a path with curves that enclose the area that is filled when the path is drawn by a specified pen. The function also flattens the path',
    label: '_GDIPlus_PathWiden ( $hPath, $hPen [, $hMatrix = 0 [, $fFlatness = 0.25]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hPen',
        documentation:
          'Pointer to a Pen object. The path is made as wide as it would be when drawn by this pen. If 0, a solid black pen with a width of 1 will be used',
      },
      {
        label: '$hMatrix',
        documentation:
          '**[optional]** Pointer to a Matrix object that represents a transformation to be applied along with the widening. If 0, no transformation is applied',
      },
      {
        label: '$fFlatness',
        documentation:
          '**[optional]** Real number that specifies the maximum error between the path and its flattened approximation.Reducing the flatness increases the number of line segments in the approximation',
      },
    ],
  },
  _GDIPlus_PathWindingModeOutline: {
    documentation:
      "Transforms and flattens a path, and then converts the path's data points so that they represent only the outline of the path",
    label: '_GDIPlus_PathWindingModeOutline ( $hPath [, $hMatrix = 0 [, $fFlatness = 0.25]] )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object',
      },
      {
        label: '$hMatrix',
        documentation:
          '**[optional]** Pointer to a Matrix object that specifies the transformation. If 0, no transformation is applied',
      },
      {
        label: '$fFlatness',
        documentation:
          '**[optional]** Real number that specifies the maximum error between the path and its flattened approximation.Reducing the flatness increases the number of line segments in the approximation.',
      },
    ],
  },
  _GDIPlus_PenCreate: {
    documentation: 'Create a pen object',
    label: '_GDIPlus_PenCreate ( [$iARGB = 0xFF000000 [, $nWidth = 1 [, $iUnit = 2]]] )',
    params: [
      {
        label: '$iARGB',
        documentation: '**[optional]** Alpha, Red, Green and Blue components of pen color',
      },
      {
        label: '$nWidth',
        documentation:
          '**[optional]** The width of the pen measured in the units specified in the $iUnit parameter',
      },
      {
        label: '$iUnit',
        documentation:
          '**[optional]** Unit of measurement for the pen size:    0 - World coordinates, a nonphysical unit    1 - Display units    2 - A unit is 1 pixel    3 - A unit is 1 point or 1/72 inch    4 - A unit is 1 inch    5 - A unit is 1/300 inch    6 - A unit is 1 millimeter',
      },
    ],
  },
  _GDIPlus_PenCreate2: {
    documentation: 'Creates a Pen object that uses the attributes of a brush',
    label: '_GDIPlus_PenCreate2 ( $hBrush [, $nWidth = 1 [, $iUnit = 2]] )',
    params: [
      {
        label: '$hBrush',
        documentation: 'Pointer to a brush object to base this pen on',
      },
      {
        label: '$nWidth',
        documentation:
          '**[optional]** The width of the pen measured in the units specified in the $iUnit parameter',
      },
      {
        label: '$iUnit',
        documentation:
          '**[optional]** Unit of measurement for the pen size:    0 - World coordinates, a nonphysical unit    1 - Display units    2 - A unit is 1 pixel    3 - A unit is 1 point or 1/72 inch    4 - A unit is 1 inch    5 - A unit is 1/300 inch    6 - A unit is 1 millimeter',
      },
    ],
  },
  _GDIPlus_PenDispose: {
    documentation: 'Release a pen object',
    label: '_GDIPlus_PenDispose ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetAlignment: {
    documentation: 'Gets the pen alignment',
    label: '_GDIPlus_PenGetAlignment ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetColor: {
    documentation: 'Gets the pen color',
    label: '_GDIPlus_PenGetColor ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetCustomEndCap: {
    documentation: 'Gets the custom end cap for the pen',
    label: '_GDIPlus_PenGetCustomEndCap ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetDashCap: {
    documentation: 'Gets the pen dash cap style',
    label: '_GDIPlus_PenGetDashCap ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetDashStyle: {
    documentation: 'Gets the pen dash style',
    label: '_GDIPlus_PenGetDashStyle ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetEndCap: {
    documentation: 'Gets the pen end cap',
    label: '_GDIPlus_PenGetEndCap ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenGetMiterLimit: {
    documentation: 'Gets the miter length currently set for a Pen object',
    label: '_GDIPlus_PenGetMiterLimit ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Pointer to a Pen object',
      },
    ],
  },
  _GDIPlus_PenGetWidth: {
    documentation: 'Retrieve the width of a pen',
    label: '_GDIPlus_PenGetWidth ( $hPen )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
    ],
  },
  _GDIPlus_PenSetAlignment: {
    documentation: 'Sets the pen alignment',
    label: '_GDIPlus_PenSetAlignment ( $hPen [, $iAlignment = 0] )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$iAlignment',
        documentation:
          '**[optional]** Pen alignment. Can be one of the following:    0 - Specifies that the pen is aligned on the center of the line that is drawn    1 - Specifies, when drawing a polygon, that the pen is aligned on the inside of the edge of the polygon',
      },
    ],
  },
  _GDIPlus_PenSetColor: {
    documentation: 'Sets the pen color',
    label: '_GDIPlus_PenSetColor ( $hPen, $iARGB )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$iARGB',
        documentation: 'Alpha, Red, Green and Blue components of pen color',
      },
    ],
  },
  _GDIPlus_PenSetCustomEndCap: {
    documentation: 'Sets the custom end cap for the pen',
    label: '_GDIPlus_PenSetCustomEndCap ( $hPen, $hEndCap )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$hEndCap',
        documentation: 'Handle to a CustomLineCap object that specifies the pen custom end cap',
      },
    ],
  },
  _GDIPlus_PenSetDashCap: {
    documentation: 'Sets the pen dash cap style',
    label: '_GDIPlus_PenSetDashCap ( $hPen [, $iDash = 0] )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$iDash',
        documentation:
          '**[optional]** Dash cap style. Can be one of the following:    $GDIP_DASHCAPFLAT - A square cap that squares off both ends of each dash    $GDIP_DASHCAPROUND - A circular cap that rounds off both ends of each dash    $GDIP_DASHCAPTRIANGLE - A triangular cap that points both ends of each dash',
      },
    ],
  },
  _GDIPlus_PenSetDashStyle: {
    documentation: 'Sets the pen dash style',
    label: '_GDIPlus_PenSetDashStyle ( $hPen [, $iStyle = 0] )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Dash style. Can be one of the following:    $GDIP_DASHSTYLESOLID - A solid line    $GDIP_DASHSTYLEDASH - A dashed line    $GDIP_DASHSTYLEDOT - A dotted line    $GDIP_DASHSTYLEDASHDOT - An alternating dash-dot line    $GDIP_DASHSTYLEDASHDOTDOT - An alternating dash-dot-dot line    $GDIP_DASHSTYLECUSTOM - A a user-defined, custom dashed line',
      },
    ],
  },
  _GDIPlus_PenSetEndCap: {
    documentation: 'Sets the pen end cap',
    label: '_GDIPlus_PenSetEndCap ( $hPen, $iEndCap )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$iEndCap',
        documentation:
          'End cap type. Can be one of the following:    $GDIP_LINECAPFLAT - Specifies a flat cap    $GDIP_LINECAPSQUARE - Specifies a square cap    $GDIP_LINECAPROUND - Specifies a circular cap    $GDIP_LINECAPTRIANGLE - Specifies a triangular cap    $GDIP_LINECAPNOANCHOR - Specifies that the line ends are not anchored    $GDIP_LINECAPSQUAREANCHOR - Specifies that the line ends are anchored with a square    $GDIP_LINECAPROUNDANCHOR - Specifies that the line ends are anchored with a circle    $GDIP_LINECAPDIAMONDANCHOR - Specifies that the line ends are anchored with a diamond    $GDIP_LINECAPARROWANCHOR - Specifies that the line ends are anchored with arrowheads    $GDIP_LINECAPCUSTOM - Specifies that the line ends are made from a CustomLineCap',
      },
    ],
  },
  _GDIPlus_PenSetLineCap: {
    documentation:
      'Sets the cap styles for the start, end, and dashes in a line drawn with the pen',
    label: '_GDIPlus_PenSetLineCap ( $hPen, $iStartCap, $iEndCap, $iDashCap )',
    params: [
      {
        label: '$hPen',
        documentation: 'Pointer to a Pen object',
      },
      {
        label: '$iStartCap',
        documentation:
          'Line cap style for the start cap:    0x00 - Line ends at the last point. The end is squared off    0x01 - Square cap. The center of the square is the last point in the line.        The height and width of the square are the line width.    0x02 - Circular cap. The center of the circle is the last point in the line.        The diameter of the circle is the line width.    0x03 - Triangular cap.        The base of the triangle is the last point in the line.        The base of the triangle is the line width.    0x10 - Line ends are not anchored.    0x11 - Line ends are anchored with a square.        The center of the square is the last point in the line.        The height and width of the square are the line width.    0x12 - Line ends are anchored with a circle.        The center of the circle is at the last point in the line.        The circle is wider than the line.    0x13 - Line ends are anchored with a diamond (a square turned at 45 degrees).        The center of the diamond is at the last point in the line.        The diamond is wider than the line.    0x14 - Line ends are anchored with arrowheads.        The arrowhead point is located at the last point in the line.        The arrowhead is wider than the line.    0xff - Line ends are made from a CustomLineCap object',
      },
      {
        label: '$iEndCap',
        documentation: 'Line cap style for the end cap (same values as $iStartCap)',
      },
      {
        label: '$iDashCap',
        documentation:
          'Start and end caps for a dashed line:    0 - A square cap that squares off both ends of each dash    2 - A circular cap that rounds off both ends of each dash    3 - A triangular cap that points both ends of each dash',
      },
    ],
  },
  _GDIPlus_PenSetLineJoin: {
    documentation: 'Sets the line join for a Pen object',
    label: '_GDIPlus_PenSetLineJoin ( $hPen, $iLineJoin )',
    params: [
      {
        label: '$hPen',
        documentation: 'Pointer to a Pen object',
      },
      {
        label: '$iLineJoin',
        documentation:
          'Line join style:    0 - Line join produces a sharp corner or a clipped corner    1 - Line join produces a diagonal corner.    2 - Line join produces a smooth, circular arc between the lines.    3 - Line join produces a sharp corner or a clipped corner',
      },
    ],
  },
  _GDIPlus_PenSetMiterLimit: {
    documentation: 'Sets the miter limit of a Pen object',
    label: '_GDIPlus_PenSetMiterLimit ( $hPen, $fMiterLimit )',
    params: [
      {
        label: '$hPen',
        documentation: 'Pointer to a Pen object',
      },
      {
        label: '$fMiterLimit',
        documentation:
          'Real number that specifies the miter limit of the Pen object.A real number value that is less than 1.0 will be replaced with 1.0.',
      },
    ],
  },
  _GDIPlus_PenSetStartCap: {
    documentation: 'Sets the start cap for a Pen object',
    label: '_GDIPlus_PenSetStartCap ( $hPen, $iLineCap )',
    params: [
      {
        label: '$hPen',
        documentation: 'Pointer to a Pen object',
      },
      {
        label: '$iLineCap',
        documentation:
          'Line cap style:    0x00 - Line ends at the last point. The end is squared off    0x01 - Square cap. The center of the square is the last point in the line. The height and width of the square are the line width.    0x02 - Circular cap. The center of the circle is the last point in the line. The diameter of the circle is the line width.    0x03 - Triangular cap. The base of the triangle is the last point in the line. The base of the triangle is the line width.    0x10 - Line ends are not anchored.    0x11 - Line ends are anchored with a square. The center of the square is the last point in the line. The height and width of the square are the line width.    0x12 - Line ends are anchored with a circle. The center of the circle is at the last point in the line. The circle is wider than the line.    0x13 - Line ends are anchored with a diamond (a square turned at 45 degrees). The center of the diamond is at the last point in the line. The diamond is wider than the line.    0x14 - Line ends are anchored with arrowheads. The arrowhead point is located at the last point in the line. The arrowhead is wider than the line.    0xff - Line ends are made from a CustomLineCap object.',
      },
    ],
  },
  _GDIPlus_PenSetWidth: {
    documentation: 'Sets the width of a pen',
    label: '_GDIPlus_PenSetWidth ( $hPen, $fWidth )',
    params: [
      {
        label: '$hPen',
        documentation: 'Handle to a pen object',
      },
      {
        label: '$fWidth',
        documentation: 'Width of pen',
      },
    ],
  },
  _GDIPlus_RectFCreate: {
    documentation: 'Create a $tagGDIPRECTF structure',
    label: '_GDIPlus_RectFCreate ( [$nX = 0 [, $nY = 0 [, $nWidth = 0 [, $nHeight = 0]]]] )',
    params: [
      {
        label: '$nX',
        documentation: '**[optional]** X coordinate of upper left hand corner of rectangle',
      },
      {
        label: '$nY',
        documentation: '**[optional]** Y coordinate of upper left hand corner of rectangle',
      },
      {
        label: '$nWidth',
        documentation: '**[optional]** Rectangle width',
      },
      {
        label: '$nHeight',
        documentation: '**[optional]** Rectangle height',
      },
    ],
  },
  _GDIPlus_RegionClone: {
    documentation: 'Clones a Region object',
    label: '_GDIPlus_RegionClone ( $hRegion )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object to be cloned',
      },
    ],
  },
  _GDIPlus_RegionCombinePath: {
    documentation:
      "Updates a region to the portion of itself that intersects the specified path's interior",
    label: '_GDIPlus_RegionCombinePath ( $hRegion, $hPath [, $iCombineMode = 2] )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$hPath',
        documentation:
          'Pointer to a GraphicsPath object that specifies the path to use to update the region',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Combine mode that specifies how the region is combined with the path:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions.A point is in the XOR of two regions if it is in one region or the other but not in both regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_RegionCombineRect: {
    documentation:
      "Updates a region to the portion of itself that intersects the specified rectangle's interior",
    label:
      '_GDIPlus_RegionCombineRect ( $hRegion, $nX, $nY, $nWidth, $nHeight [, $iCombineMode = 2] )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Combine mode that specifies how the region is combined with the rectangle:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions.A point is in the XOR of two regions if it is in one region or the other but not in both regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_RegionCombineRegion: {
    documentation: 'Updates a region to the portion of itself that intersects another region',
    label: '_GDIPlus_RegionCombineRegion ( $hRegionDst, $hRegionSrc [, $iCombineMode = 2] )',
    params: [
      {
        label: '$hRegionDst',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$hRegionSrc',
        documentation: 'Pointer to a Region object to use to update the $hRegionDst Region object',
      },
      {
        label: '$iCombineMode',
        documentation:
          '**[optional]** Combine mode that specifies how the regions are combined:    0 - The existing region is replaced by the new region    1 - The existing region is replaced by the intersection of itself and the new region    2 - The existing region is replaced by the union of itself and the new region    3 - The existing region is replaced by the result of performing an XOR on the two regions.A point is in the XOR of two regions if it is in one region or the other but not in both regions    4 - The existing region is replaced by the portion of itself that is outside of the new region    5 - The existing region is replaced by the portion of the new region that is outside of the existing region',
      },
    ],
  },
  _GDIPlus_RegionCreate: {
    documentation: 'Creates a region that is infinite',
    label: '_GDIPlus_RegionCreate (  )',
    params: [],
  },
  _GDIPlus_RegionCreateFromPath: {
    documentation:
      'Creates a region that is defined by a path object and has a fill mode that is contained in the path object',
    label: '_GDIPlus_RegionCreateFromPath ( $hPath )',
    params: [
      {
        label: '$hPath',
        documentation: 'Pointer to a GraphicsPath object that specifies the path',
      },
    ],
  },
  _GDIPlus_RegionCreateFromRect: {
    documentation: 'Creates a region that is defined by a rectangle',
    label: '_GDIPlus_RegionCreateFromRect ( $nX, $nY, $nWidth, $nHeight )',
    params: [
      {
        label: '$nX',
        documentation: 'The X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nY',
        documentation: 'The Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$nWidth',
        documentation: 'The width of the rectangle',
      },
      {
        label: '$nHeight',
        documentation: 'The height of the rectangle',
      },
    ],
  },
  _GDIPlus_RegionDispose: {
    documentation: 'Releases a Region object',
    label: '_GDIPlus_RegionDispose ( $hRegion )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
    ],
  },
  _GDIPlus_RegionGetBounds: {
    documentation: 'Gets a rectangle that encloses a region',
    label: '_GDIPlus_RegionGetBounds ( $hRegion, $hGraphics )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$hGraphics',
        documentation:
          'Pointer to a Graphics object that contains the world and page transformations required to calculate the device coordinates of the region and the rectangle',
      },
    ],
  },
  _GDIPlus_RegionGetHRgn: {
    documentation: 'Creates a GDI region from a GDI+ Region object',
    label: '_GDIPlus_RegionGetHRgn ( $hRegion [, $hGraphics = 0] )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$hGraphics',
        documentation:
          '**[optional]** Pointer to a Graphics object that contains the world and page transformations required to calculate the device coordinates of the region',
      },
    ],
  },
  _GDIPlus_RegionTransform: {
    documentation:
      'Tansforms a region by multiplying each of its data points by a specified matrix',
    label: '_GDIPlus_RegionTransform ( $hRegion, $hMatrix )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$hMatrix',
        documentation: 'Pointer to a matrix that specifies the transformation',
      },
    ],
  },
  _GDIPlus_RegionTranslate: {
    documentation:
      'Offsets a region by specified amounts in the horizontal and vertical directions',
    label: '_GDIPlus_RegionTranslate ( $hRegion, $nDX, $nDY )',
    params: [
      {
        label: '$hRegion',
        documentation: 'Pointer to a Region object',
      },
      {
        label: '$nDX',
        documentation:
          'Real number that specifies the amount to shift the region in the X direction',
      },
      {
        label: '$nDY',
        documentation:
          'Real number that specifies the amount to shift the region in the Y direction',
      },
    ],
  },
  _GDIPlus_Shutdown: {
    documentation: 'Clean up resources used by Microsoft Windows GDI+',
    label: '_GDIPlus_Shutdown (  )',
    params: [],
  },
  _GDIPlus_Startup: {
    documentation: 'Initialize Microsoft Windows GDI+',
    label: '_GDIPlus_Startup ( [$sGDIPDLL = Default [, $bRetDllHandle = False]] )',
    params: [
      {
        label: '$sGDIPDLL',
        documentation:
          '**[optional]** the filename of the dll to be used. Default is the installed GDI Dll.',
      },
      {
        label: '$bRetDllHandle',
        documentation:
          '**[optional]** True if the handle to opened GDI Dll is to be returned. Default is False.',
      },
    ],
  },
  _GDIPlus_StringFormatCreate: {
    documentation: 'Create a String Format object',
    label: '_GDIPlus_StringFormatCreate ( [$iFormat = 0 [, $iLangID = 0]] )',
    params: [
      {
        label: '$iFormat',
        documentation:
          "**[optional]** Format flags. Can be one or more of the following:    0x0001 - Specifies that reading order is right to left    0x0002 - Specifies that individual lines of text are drawn vertically on the display device    0x0004 - Specifies that parts of characters are allowed to overhang the string's layout rectangle    0x0020 - Specifies that Unicode layout control characters are displayed with a representative character    0x0400 - Specifies that an alternate font is used for characters that are not supported in the requested font    0x0800 - Specifies that the space at the end of each line is included in a string measurement    0x1000 - Specifies that the wrapping of text to the next line is disabled    0x2000 - Specifies that only entire lines are laid out in the layout rectangle    0x4000 - Specifies that characters overhanging the layout rectangle and text extending outside the layout rectangle are allowed to show",
      },
      {
        label: '$iLangID',
        documentation: '**[optional]** The language to use',
      },
    ],
  },
  _GDIPlus_StringFormatDispose: {
    documentation: 'Release a String Format object',
    label: '_GDIPlus_StringFormatDispose ( $hFormat )',
    params: [
      {
        label: '$hFormat',
        documentation: 'Handle to a String Format object',
      },
    ],
  },
  _GDIPlus_StringFormatGetMeasurableCharacterRangeCount: {
    documentation:
      'Gets the number of measurable character ranges that are currently set for a StringFormat object',
    label: '_GDIPlus_StringFormatGetMeasurableCharacterRangeCount ( $hStringFormat )',
    params: [
      {
        label: '$hStringFormat',
        documentation: 'Pointer to a StringFormat object',
      },
    ],
  },
  _GDIPlus_StringFormatSetAlign: {
    documentation: 'Sets the text alignment of a string format object',
    label: '_GDIPlus_StringFormatSetAlign ( $hStringFormat, $iFlag )',
    params: [
      {
        label: '$hStringFormat',
        documentation: 'The string format object which is aligned',
      },
      {
        label: '$iFlag',
        documentation:
          'The alignment can be one of the following:    0 - The text is aligned to the left    1 - The text is centered    2 - The text is aligned to the right',
      },
    ],
  },
  _GDIPlus_StringFormatSetLineAlign: {
    documentation:
      'Sets the line alignment of a StringFormat object in relation to the origin of a layout rectangle',
    label: '_GDIPlus_StringFormatSetLineAlign ( $hStringFormat, $iStringAlign )',
    params: [
      {
        label: '$hStringFormat',
        documentation: 'Pointer to a StringFormat object',
      },
      {
        label: '$iStringAlign',
        documentation:
          'Type of line alignment to use:    0 - Alignment is towards the origin of the bounding rectangle    1 - Alignment is centered between origin and the height of the formatting rectangle    2 - Alignment is to the far extent (right side) of the formatting rectangle',
      },
    ],
  },
  _GDIPlus_StringFormatSetMeasurableCharacterRanges: {
    documentation:
      'Sets a series of character ranges for a StringFormat object that, when in a string, can be measured',
    label: '_GDIPlus_StringFormatSetMeasurableCharacterRanges ( $hStringFormat, $aRanges )',
    params: [
      {
        label: '$hStringFormat',
        documentation: 'Pointer to a StringFormat object',
      },
      {
        label: '$aRanges',
        documentation:
          'Array of character ranges:    [0][0] - Number of character ranges    [1][0] - Character range 1 specifying the first position of range 1    [1][1] - Character range 1 specifying the number of positions in range 1    [2][0] - Character range 2 specifying the first position of range 2    [2][1] - Character range 2 specifying the number of positions in range 2    [n][0] - Character range n specifying the first position of range n    [n][1] - Character range n specifying the number of positions in range n',
      },
    ],
  },
  _GDIPlus_TextureCreate: {
    documentation: 'Creates a TextureBrush object based on an image and a wrap mode',
    label: '_GDIPlus_TextureCreate ( $hImage [, $iWrapMode = 0] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Pointer to an Image object',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Wrap mode that specifies how repeated copies of an image are used to tile an area when it is    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_TextureCreate2: {
    documentation:
      'Creates a TextureBrush object based on an image, a wrap mode and a defining rectangle',
    label: '_GDIPlus_TextureCreate2 ( $hImage, $nX, $nY, $nWidth, $nHeight [, $iWrapMode = 0] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Pointer to an Image object',
      },
      {
        label: '$nX',
        documentation: 'Leftmost coordinate of the image portion to be used by this brush',
      },
      {
        label: '$nY',
        documentation: 'Uppermost coordinate of the image portion to be used by this brush',
      },
      {
        label: '$nWidth',
        documentation: 'Width of the brush and width of the image portion to be used by the brush',
      },
      {
        label: '$nHeight',
        documentation:
          'Height of the brush and height of the image portion to be used by the brush',
      },
      {
        label: '$iWrapMode',
        documentation:
          '**[optional]** Wrap mode that specifies how repeated copies of an image are used to tile an area when it is    0 - Tiling without flipping    1 - Tiles are flipped horizontally as you move from one tile to the next in a row    2 - Tiles are flipped vertically as you move from one tile to the next in a column    3 - Tiles are flipped horizontally as you move along a row and flipped vertically as you move along a column    4 - No tiling takes place',
      },
    ],
  },
  _GDIPlus_TextureCreateIA: {
    documentation:
      'Creates a TextureBrush object based on an image, a defining rectangle, and a set of image properties',
    label:
      '_GDIPlus_TextureCreateIA ( $hImage, $nX, $nY, $nWidth, $nHeight [, $pImageAttributes = 0] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Pointer to an image object',
      },
      {
        label: '$nX',
        documentation: 'Leftmost coordinate of the image portion to be used by this brush',
      },
      {
        label: '$nY',
        documentation: 'Uppermost coordinate of the image portion to be used by this brush',
      },
      {
        label: '$nWidth',
        documentation: 'Width of the brush and width of the image portion to be used by the brush',
      },
      {
        label: '$nHeight',
        documentation:
          'Height of the brush and height of the image portion to be used by the brush',
      },
      {
        label: '$pImageAttributes',
        documentation:
          '**[optional]** Pointer to an ImageAttributes object that contains properties of the image',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
