import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <ScreenCapture.au3>`)';

const signatures = {
  _ScreenCapture_Capture: {
    documentation: 'Captures a region of the screen',
    label:
      '_ScreenCapture_Capture ( [$sFileName = "" [, $iLeft = 0 [, $iTop = 0 [, $iRight = -1 [, $iBottom = -1 [, $bCursor = True]]]]]] )',
    params: [
      {
        label: '$sFileName',
        documentation: '**[optional]** Full path and extension of the image file',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iRight',
        documentation:
          '**[optional]** X coordinate of the lower right corner of the rectangle. If this is -1, the current screen width will be used.',
      },
      {
        label: '$iBottom',
        documentation:
          '**[optional]** Y coordinate of the lower right corner of the rectangle. If this is -1, the current screen height will be used.',
      },
      {
        label: '$bCursor',
        documentation: '**[optional]** If True the cursor will be captured with the image',
      },
    ],
  },
  _ScreenCapture_CaptureWnd: {
    documentation: 'Captures a screen shot of a specified window or controlID',
    label:
      '_ScreenCapture_CaptureWnd ( $sFileName, $hWnd [, $iLeft = 0 [, $iTop = 0 [, $iRight = -1 [, $iBottom = -1 [, $bCursor = True]]]]] )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Full path and extension of the image file',
      },
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be captured',
      },
      {
        label: '$iLeft',
        documentation:
          '**[optional]** X coordinate of the upper left corner of the client rectangle',
      },
      {
        label: '$iTop',
        documentation:
          '**[optional]** Y coordinate of the upper left corner of the client rectangle',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** X coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Y coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$bCursor',
        documentation: '**[optional]** If True the cursor will be captured with the image',
      },
    ],
  },
  _ScreenCapture_SaveImage: {
    documentation: 'Saves an image to file',
    label: '_ScreenCapture_SaveImage ( $sFileName, $hBitmap [, $bFreeBmp = True] )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Full path and extension of the bitmap file to be saved',
      },
      {
        label: '$hBitmap',
        documentation: 'HBITMAP handle',
      },
      {
        label: '$bFreeBmp',
        documentation:
          '**[optional]** If True, $hBitmap will be freed on a successful save (default)',
      },
    ],
  },
  _ScreenCapture_SetBMPFormat: {
    documentation: 'Sets the bit format that will be used for BMP screen captures',
    label: '_ScreenCapture_SetBMPFormat ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation:
          'Image bits per pixel (bpp) setting:    0 = 16 bpp; 5 bits for each RGB component    1 = 16 bpp; 5 bits for red, 6 bits for green and 5 bits blue    2 = 24 bpp; 8 bits for each RGB component    3 = 32 bpp; 8 bits for each RGB component. No alpha component.    4 = 32 bpp; 8 bits for each RGB and alpha component',
      },
    ],
  },
  _ScreenCapture_SetJPGQuality: {
    documentation: 'Sets the quality level that will be used for JPEG screen captures',
    label: '_ScreenCapture_SetJPGQuality ( $iQuality )',
    params: [
      {
        label: '$iQuality',
        documentation: 'The quality level of the image. Must be in the range of 0 to 100.',
      },
    ],
  },
  _ScreenCapture_SetTIFColorDepth: {
    documentation: 'Sets the color depth used for TIFF screen captures',
    label: '_ScreenCapture_SetTIFColorDepth ( $iDepth )',
    params: [
      {
        label: '$iDepth',
        documentation:
          'Image color depth:    0 - Default encoder color depth    24 - 24 bit    32 - 32 bit',
      },
    ],
  },
  _ScreenCapture_SetTIFCompression: {
    documentation: 'Sets the compression used for TIFF screen captures',
    label: '_ScreenCapture_SetTIFCompression ( $iCompress )',
    params: [
      {
        label: '$iCompress',
        documentation:
          'Image compression type:    0 - Default encoder compression    1 - No compression    2 - LZW compression',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
