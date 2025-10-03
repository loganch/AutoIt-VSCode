import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUIImageList.au3>`)';

const signatures = {
  _GUIImageList_Add: {
    documentation: 'Adds an image or images to an image list',
    label: '_GUIImageList_Add ( $hWnd, $hImage [, $hMask = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$hImage',
        documentation:
          'Handle to the bitmap that contains the image or images. The number of images is inferred from the width of the bitmap.',
      },
      {
        label: '$hMask',
        documentation: '**[optional]** Handle to the bitmap that contains the mask',
      },
    ],
  },
  _GUIImageList_AddBitmap: {
    documentation: 'Adds a bitmap to an image list',
    label: '_GUIImageList_AddBitmap ( $hWnd, $sImage [, $sMask = ""] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$sImage',
        documentation: 'Path to the bitmap that contains the image',
      },
      {
        label: '$sMask',
        documentation: '**[optional]** Path to the bitmap that contains the mask',
      },
    ],
  },
  _GUIImageList_AddIcon: {
    documentation: 'Adds an icon to an image list',
    label: '_GUIImageList_AddIcon ( $hWnd, $sFilePath [, $iIndex = 0 [, $bLarge = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$sFilePath',
        documentation: 'Path to the icon that contains the image',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Specifies the 0-based index of the icon to extract',
      },
      {
        label: '$bLarge',
        documentation: '**[optional]** Extract Large Icon',
      },
    ],
  },
  _GUIImageList_AddMasked: {
    documentation:
      'Adds an image or images to an image list, generating a mask from the specified bitmap',
    label: '_GUIImageList_AddMasked ( $hWnd, $hImage [, $iMask = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$hImage',
        documentation:
          'Handle to the bitmap that contains the image or images. The number of images is inferred from the width of the bitmap.',
      },
      {
        label: '$iMask',
        documentation:
          '**[optional]** Color used to generate the mask. Each pixel of this color in the specified bitmap is changed to black, and the corresponding bit in the mask is set to 1.',
      },
    ],
  },
  _GUIImageList_BeginDrag: {
    documentation: 'Begins dragging an image',
    label: '_GUIImageList_BeginDrag ( $hWnd, $iTrack, $iXHotSpot, $iYHotSpot )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iTrack',
        documentation: 'Index of the image to drag',
      },
      {
        label: '$iXHotSpot',
        documentation:
          'X coordinate of the location of the drag position relative to image upper left corner',
      },
      {
        label: '$iYHotSpot',
        documentation:
          'Y coordinate of the location of the drag position relative to image upper left corner',
      },
    ],
  },
  _GUIImageList_Copy: {
    documentation: "Source image is copied to the destination image's index",
    label: '_GUIImageList_Copy ( $hWnd, $iSource, $iDestination )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iSource',
        documentation:
          'The 0-based index of the image to be used as the source of the copy operation',
      },
      {
        label: '$iDestination',
        documentation:
          'The 0-based index of the image to be used as the destination of the copy operation. The image index must exist',
      },
    ],
  },
  _GUIImageList_Create: {
    documentation: 'Create an ImageList control',
    label:
      '_GUIImageList_Create ( [$iCX = 16 [, $iCY = 16 [, $iColor = 4 [, $iOptions = 0 [, $iInitial = 4 [, $iGrow = 4]]]]]] )',
    params: [
      {
        label: '$iCX',
        documentation: '**[optional]** Width, in pixels, of each image',
      },
      {
        label: '$iCY',
        documentation: '**[optional]** Height, in pixels, of each image',
      },
      {
        label: '$iColor',
        documentation:
          '**[optional]** Image color depth:    0 - Use the default behavior    1 - Use a 4 bit DIB section    2 - Use a 8 bit DIB section    3 - Use a 16 bit DIB section    4 - Use a 24 bit DIB section    5 - Use a 32 bit DIB section    6 - Use a device-dependent bitmap',
      },
      {
        label: '$iOptions',
        documentation:
          '**[optional]** Option flags. Can be a combination of the following:    1 - Use a mask    2 - The images in the lists are mirrored    4 - The image list contains a strip of images',
      },
      {
        label: '$iInitial',
        documentation: '**[optional]** Number of images that the image list initially contains',
      },
      {
        label: '$iGrow',
        documentation:
          '**[optional]** Number of images by which the image list can grow when the system needs to make room for new images. This parameter represents the number of new images that the resized image list can contain.',
      },
    ],
  },
  _GUIImageList_Destroy: {
    documentation: 'Destroys an image list',
    label: '_GUIImageList_Destroy ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_DestroyIcon: {
    documentation: 'Destroys an icon and frees any memory the icon occupied',
    label: '_GUIImageList_DestroyIcon ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon',
      },
    ],
  },
  _GUIImageList_DragEnter: {
    documentation: 'Displays the drag image at the specified position within the window',
    label: '_GUIImageList_DragEnter ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iX',
        documentation:
          'The x-coordinate at which to display the drag image.The coordinate is relative to the upper-left corner of the window, not the client area.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate at which to display the drag image.The coordinate is relative to the upper-left corner of the window, not the client area.',
      },
    ],
  },
  _GUIImageList_DragLeave: {
    documentation:
      'Unlocks the specified window and hides the drag image, allowing the window to be updated',
    label: '_GUIImageList_DragLeave ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_DragMove: {
    documentation: 'Moves the image that is being dragged during a drag-and-drop operation',
    label: '_GUIImageList_DragMove ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation:
          'The x-coordinate at which to display the drag image.The coordinate is relative to the upper-left corner of the window, not the client area.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate at which to display the drag image.The coordinate is relative to the upper-left corner of the window, not the client area.',
      },
    ],
  },
  _GUIImageList_Draw: {
    documentation: 'Draws an image list item in the specified device context',
    label: '_GUIImageList_Draw ( $hWnd, $iIndex, $hDC, $iX, $iY [, $iStyle = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the image to draw',
      },
      {
        label: '$hDC',
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iX',
        documentation: 'X coordinate where the image will be drawn',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate where the image will be drawn',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Drawing style and overlay image:    1 - Draws the image transparently using the mask, regardless of the background color    2 - Draws the image, blending 25 percent with the system highlight color    4 - Draws the image, blending 50 percent with the system highlight color    8 - Draws the mask',
      },
    ],
  },
  _GUIImageList_DrawEx: {
    documentation: 'Draws an image list item in the specified device context',
    label:
      '_GUIImageList_DrawEx ( $hWnd, $iIndex, $hDC, $iX, $iY [, $iDX = 0 [, $iDY = 0 [, $iRGBBk = 0xFFFFFFFF [, $iRGBFg = 0xFFFFFFFF [, $iStyle = 0]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the image to draw',
      },
      {
        label: '$hDC',
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iX',
        documentation: 'X coordinate where the image will be drawn',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate where the image will be drawn',
      },
      {
        label: '$iDX',
        documentation:
          '**[optional]** The width of the portion of the image to draw relative to the upper-left corner of the image.If $iDX and $iDY are zero, the function draws the entire image. The function does not ensure that the parameters are valid.',
      },
      {
        label: '$iDY',
        documentation:
          '**[optional]** The height of the portion of the image to draw, relative to the upper-left corner of the image.If $iDX and $iDY are zero, the function draws the entire image. The function does not ensure that the parameters are valid.',
      },
      {
        label: '$iRGBBk',
        documentation:
          '**[optional]** The background color of the image. This parameter can be an application-defined RGB value or one of the following values:    $CLR_NONE - No background color. The image is drawn transparently.    $CLR_DEFAULT - The default background color. The image is drawn using the background color of the image list.',
      },
      {
        label: '$iRGBFg',
        documentation:
          '**[optional]** The foreground color of the image. This parameter can be an application-defined RGB value or one of the following values:    $CLR_NONE - No blend color. The image is blended with the color of the destination device context.    $CLR_DEFAULT - The default foreground color. The image is drawn using the system highlight color as the foreground color.',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Drawing style and overlay image:    1 - Draws the image transparently using the mask, regardless of the background color    2 - Draws the image, blending 25 percent with the system highlight color    4 - Draws the image, blending 50 percent with the system highlight color    8 - Draws the mask',
      },
    ],
  },
  _GUIImageList_Duplicate: {
    documentation: 'Creates a duplicate of an existing image list',
    label: '_GUIImageList_Duplicate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_EndDrag: {
    documentation: 'Ends a drag operation',
    label: '_GUIImageList_EndDrag (  )',
    params: [],
  },
  _GUIImageList_GetBkColor: {
    documentation: 'Retrieves the current background color for an image list',
    label: '_GUIImageList_GetBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetIcon: {
    documentation: 'Creates an icon from an image and mask in an image list',
    label: '_GUIImageList_GetIcon ( $hWnd, $iIndex [, $iStyle = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the image',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Drawing style and overlay image:    1 - Draws the image transparently using the mask, regardless of the background color    2 - Draws the image, blending 25 percent with the system highlight color    4 - Draws the image, blending 50 percent with the system highlight color    8 - Draws the mask',
      },
    ],
  },
  _GUIImageList_GetIconHeight: {
    documentation: 'Retrieves the height of the images in an image list',
    label: '_GUIImageList_GetIconHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetIconSize: {
    documentation: 'Retrieves the dimensions of images in an image list',
    label: '_GUIImageList_GetIconSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetIconSizeEx: {
    documentation: 'Retrieves the dimensions of images in an image list',
    label: '_GUIImageList_GetIconSizeEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetIconWidth: {
    documentation: 'Retrieves the width of the images in an image list',
    label: '_GUIImageList_GetIconWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetImageCount: {
    documentation: 'Retrieves the number of images in an image list',
    label: '_GUIImageList_GetImageCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
    ],
  },
  _GUIImageList_GetImageInfoEx: {
    documentation: 'Retrieves information about an image',
    label: '_GUIImageList_GetImageInfoEx ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation: 'Index of the image',
      },
    ],
  },
  _GUIImageList_Remove: {
    documentation: 'Remove Image(s) from the ImageList',
    label: '_GUIImageList_Remove ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** The index of the image to remove. If this parameter is -1, the function removes all images',
      },
    ],
  },
  _GUIImageList_ReplaceIcon: {
    documentation: 'Replaces an image with an icon or cursor',
    label: '_GUIImageList_ReplaceIcon ( $hWnd, $iIndex, $hIcon )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iIndex',
        documentation:
          'Index of the image to replace. If -1, the function appends the image to the end of the list.',
      },
      {
        label: '$hIcon',
        documentation:
          'Handle to the icon or cursor that contains the bitmap and mask for the new image',
      },
    ],
  },
  _GUIImageList_SetBkColor: {
    documentation: 'Sets the background color for an image list',
    label: '_GUIImageList_SetBkColor ( $hWnd, $iClrBk )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iClrBk',
        documentation:
          'The background color to set.This parameter can be the $CLR_NONE value; in that case, images are drawn transparently using the mask.',
      },
    ],
  },
  _GUIImageList_SetIconSize: {
    documentation:
      'Sets the dimensions of images in an image list and removes all images from the list',
    label: '_GUIImageList_SetIconSize ( $hWnd, $iCX, $iCY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iCX',
        documentation: 'The width, in pixels, of the images in the image list',
      },
      {
        label: '$iCY',
        documentation: 'The height, in pixels, of the images in the image list',
      },
    ],
  },
  _GUIImageList_SetImageCount: {
    documentation: 'Resizes an existing image list',
    label: '_GUIImageList_SetImageCount ( $hWnd, $iNewCount )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iNewCount',
        documentation: 'The new size of the image list',
      },
    ],
  },
  _GUIImageList_Swap: {
    documentation: "Swap image between Source and Destination image's index",
    label: '_GUIImageList_Swap ( $hWnd, $iSource, $iDestination )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the imagelist',
      },
      {
        label: '$iSource',
        documentation:
          'The 0-based index of the image to be used as the source of the swap operation',
      },
      {
        label: '$iDestination',
        documentation:
          'The 0-based index of the image to be used as the destination of the swap operation',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
