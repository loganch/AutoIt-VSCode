import { CompletionItemKind } from 'vscode';
import { br, opt, signatureToHover, signatureToCompletion } from '../../util';

const include = '`#include <WinAPITHeme.au3>`';

const commonParams = {
  hBP: {
    label: '$hBP',
    documentation: 'Handle of the buffered paint context.',
  },
  hTheme: {
    label: '$hTheme',
    documentation: "Handle to a window's specified theme data.",
  },
  hTheme2: {
    label: '$hTheme',
    documentation: 'Handle to the theme data.',
  },
  iStateID: {
    label: '$iStateID',
    documentation: 'The state of the part.',
  },
  hDC: {
    label: '$hDC',
    documentation: 'Handle to the device context.',
  },
  hDC_Drawing: {
    label: '$hDC',
    documentation: 'Handle to the device context to use for drawing.',
  },
  hDC_Drawing2: {
    label: '$hDC',
    documentation: 'Handle to the device context to use when drawing.',
  },
  iFlags: {
    label: '$iFlags',
    documentation: "The string's formatting flags (`$DT_`\\*).",
  },
  iPartID: {
    label: '$iPartID',
    documentation: `The part that has the desired text appearance.${br}
          If this value is 0, the text is drawn in the default font, or a font selected into the device context.`,
  },
  iPartID_Content: {
    label: '$iPartID',
    documentation: 'The part that contains the content area.',
  },
  iPropID: {
    label: '$iPropID',
    documentation: 'The property to retrieve (`$TMT_`\\*).',
  },
  sText: {
    label: '$sText',
    documentation: 'The string that contains the text to draw.',
  },
  tRECT: {
    label: '$tRECT',
    documentation:
      '`$tagRECT` structure that contains the rectangle in which the text is to be drawn.',
  },
};

const signatures = {
  _WinAPI_BeginBufferedPaint: {
    documentation: `Begins a buffered paint operation ${include}`,
    label:
      '_WinAPI_BeginBufferedPaint ( $hDC, $tTarget, ByRef $hNewDC, [$iFormat] = 0, [$iFlags] = 0, [$tExclude] = 0, [$iAlpha] = -1 )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle of the target DC on which the buffer will be painted.',
      },
      {
        label: '$tTarget',
        documentation:
          '`$tagRECT` structure that specifies the area of the target DC in which to paint.',
      },
      {
        label: '$hNewDC',
        documentation: 'Handle of the new device context.',
      },
      {
        label: '[$iFormat]',
        documentation: `${opt} The format of the buffer. This parameter can be one of the following values.${br}${br}
          \`$BPBF_COMPATIBLEBITMAP\` (Default)${br}
          \`$BPBF_DIB\`${br}
          \`$BPBF_TOPDOWNDIB\`${br}
          \`$BPBF_TOPDOWNMONODIB\``,
      },
      {
        label: '[$iFlags]',
        documentation: `${opt} The additional flags, one or more of the following values.${br}
          ${br}\`$BPPF_ERASE\`${br}
          ${br}\`$BPPF_NOCLIP\`${br}
          \`$BPPF_NONCLIENT\``,
      },
      {
        label: '[$tExclude]',
        documentation: `${opt} \`$tagRECT\` structure that specifies the area which is excluded from the clipping region.`,
      },
      {
        label: '[$iAlpha]',
        documentation: `${opt} The alpha transparency value to be used on the entire source bitmap.${br}
          If this parameter is not specified or (-1) (Default), the source buffer is copied to the destination with no blending.`,
      },
    ],
  },
  _WinAPI_BufferedPaintClear: {
    documentation: `Clears a specified rectangle in the buffer to ARGB = {0,0,0,0} ${include}`,
    label: '_WinAPI_BufferedPaintClear ( $hBP, [$tRECT] = 0 )',
    params: [
      commonParams.hBP,
      {
        label: '$tRECT',
        documentation: `${opt} \`$tagRECT\` structure that specifies the rectangle to clear. If this parameter is 0 (Default), the entire buffer is used.`,
      },
    ],
  },
  _WinAPI_BufferedPaintInit: {
    documentation: `Initialize buffered painting for the current thread ${include}`,
    label: '_WinAPI_BufferedPaintInit ( )',
    params: [],
  },
  _WinAPI_BufferedPaintSetAlpha: {
    documentation: `Sets the alpha to a specified value in a given rectangle ${include}`,
    label: '_WinAPI_BufferedPaintSetAlpha ( $hBP, [$iAlpha] = 255, [$tRECT] = 0 )',
    params: [
      commonParams.hBP,
      {
        label: '$iAlpha',
        documentation: `${opt} The alpha value to set. The alpha value can range from zero (fully transparent) to 255 (Default)(fully opaque).`,
      },
      {
        label: '$tRECT',
        documentation: `${opt} \`$tagRECT\` structure that specifies the rectangle in which to set the alpha. If this parameter is 0 (Default), the entire buffer is used.`,
      },
    ],
  },
  _WinAPI_BufferedPaintUnInit: {
    documentation: `Closes down buffered painting for the current thread ${include}`,
    label: '_WinAPI_BufferedPaintUnInit ( )',
    params: [],
  },
  _WinAPI_CloseThemeData: {
    documentation: `Closes the theme data handle ${include}`,
    label: '_WinAPI_CloseThemeData ( $hTheme )',
    params: [commonParams.hTheme],
  },
  _WinAPI_DrawThemeBackground: {
    documentation: `Draws the border and fill defined by the visual style for the specified control part ${include}`,
    label:
      '_WinAPI_DrawThemeBackground ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT, [$tCLIP] = 0 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part to draw.',
      },
      {
        label: '$iStateID',
        documentation: 'The state of the part to draw.',
      },
      {
        label: '$hDC',
        documentation:
          'Handle to the device context for drawing the theme-defined background image.',
      },
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the rectangle in which the background image is drawn.',
      },
      {
        label: '$tCLIP',
        documentation: `${opt} \`$tagRECT\` structure that contains a clipping rectangle.`,
      },
    ],
  },

  _WinAPI_DrawThemeEdge: {
    documentation: `Draws one or more edges defined by the visual style of a rectangle ${include}`,
    label:
      '_WinAPI_DrawThemeEdge ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT, $iEdge, $iFlags, [$tAREA] = 0 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the rectangle.',
      },
      commonParams.iStateID,
      commonParams.hDC,
      {
        label: '$tRECT',
        documentation: '`$tagRECT` structure that contains the rectangle.',
      },
      {
        label: '$iEdge',
        documentation:
          'The type of inner and outer edges to draw.This parameter must be a combination of one inner-border flag and one outer-border flag (`$BDR_`\\*), or one of the combination flags (`$EDGE_`\\*).',
      },
      {
        label: '$iFlags',
        documentation:
          'The type of border to draw. It can be a combination of the `$BF_`\\* constants.',
      },
      {
        label: '$tAREA',
        documentation: `${opt} \`$tagRECT\` structure that contains the rectangle that receives the interior rectangle, if \`$BF_ADJUST\` is used.`,
      },
    ],
  },

  _WinAPI_DrawThemeIcon: {
    documentation: `Draws an image from an image list with the icon effect defined by the visual style ${include}`,
    label: '_WinAPI_DrawThemeIcon ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT, $hIL, $iIndex )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part in which the image is drawn.',
      },
      commonParams.iStateID,
      commonParams.hDC,
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the rectangle in which the image is drawn.',
      },
      {
        label: '$hIL',
        documentation: 'Handle to an image list that contains the image to draw.',
      },
      {
        label: '$iIndex',
        documentation: 'The index of the image to draw.',
      },
    ],
  },

  _WinAPI_DrawThemeParentBackground: {
    documentation: `Draws the part of a parent control that is covered by a partially-transparent or alpha-blended child control ${include}`,
    label: '_WinAPI_DrawThemeParentBackground ( $hWnd, $hDC, [$tRECT] = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the child control.',
      },
      {
        label: '$hDC',
        documentation: "Handle to the child control's DC.",
      },
      {
        label: '$tRECT',
        documentation: `${opt} \`$tagRECT\` structure that defines the area, in the child window's coordinates, to be drawn.`,
      },
    ],
  },

  _WinAPI_DrawThemeText: {
    documentation: `Draws text using the color and font defined by the visual style ${include}`,
    label: '_WinAPI_DrawThemeText ( $hTheme, $iPartID, $iStateID, $hDC, $sText, $tRECT, $iFlags )',
    params: [
      commonParams.hTheme,
      commonParams.iPartID,
      commonParams.iStateID,
      commonParams.hDC_Drawing,
      commonParams.sText,
      commonParams.tRECT,
      commonParams.iFlags,
    ],
  },

  _WinAPI_DrawThemeTextEx: {
    documentation: `Draws text using the color and font defined by the visual style ${include}`,
    label:
      '_WinAPI_DrawThemeTextEx ( $hTheme, $iPartID, $iStateID, $hDC, $sText, $tRECT, $iFlags, $tDTTOPTS )',
    params: [
      commonParams.hTheme,
      commonParams.iPartID,
      commonParams.iStateID,
      commonParams.hDC_Drawing,
      commonParams.sText,
      commonParams.tRECT,
      commonParams.iFlags,
      {
        label: '$tDTTOPTS',
        documentation: '`$tagDTTOPTS` structure that defines additional formatting options.',
      },
    ],
  },

  _WinAPI_EndBufferedPaint: {
    documentation: `Completes a buffered paint operation and frees the associated buffered paint handle ${include}`,
    label: '_WinAPI_EndBufferedPaint ( $hBP, [$bUpdate] = True )',
    params: [
      commonParams.hBP,
      {
        label: '$bUpdate',
        documentation: `${opt} Specifies whether copy the buffer to the target DC, valid values:${br}
          \`True\` - The target DC will be updated from the buffer (Default).${br}
          \`False\` - The target DC remains unchanged.`,
      },
    ],
  },

  _WinAPI_GetBufferedPaintBits: {
    documentation: `Retrieves a pointer to the buffer bitmap if the buffer is a device-independent bitmap (DIB) ${include}`,
    label: '_WinAPI_GetBufferedPaintBits ( $hBP )',
    params: [commonParams.hBP],
  },

  _WinAPI_GetBufferedPaintDC: {
    documentation: `Gets the paint device context (DC) ${include}`,
    label: '_WinAPI_GetBufferedPaintDC ( $hBP )',
    params: [commonParams.hBP],
  },

  _WinAPI_GetBufferedPaintTargetDC: {
    documentation: `Retrieves the target device context (DC) ${include}`,
    label: '_WinAPI_GetBufferedPaintTargetDC ( $hBP )',
    params: [commonParams.hBP],
  },

  _WinAPI_GetBufferedPaintTargetRect: {
    documentation: `Retrieves the target rectangle ${include}`,
    label: '_WinAPI_GetBufferedPaintTargetRect ( $hBP )',
    params: [commonParams.hBP],
  },

  _WinAPI_GetCurrentThemeName: {
    documentation: `Retrieves the name of the current visual styles, color scheme name, and size name ${include}`,
    label: '_WinAPI_GetCurrentThemeName ( )',
    params: [],
  },

  _WinAPI_GetThemeAppProperties: {
    documentation: `Retrieves the property flags that control how visual styles are applied in the current application ${include}`,
    label: '_WinAPI_GetThemeAppProperties ( )',
    params: [],
  },

  _WinAPI_GetThemeBackgroundContentRect: {
    documentation: `Retrieves the size of the content area for the background defined by the visual style ${include}`,
    label: '_WinAPI_GetThemeBackgroundContentRect ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT )',
    params: [
      commonParams.hTheme,
      commonParams.iPartID_Content,
      commonParams.iStateID,
      commonParams.hDC_Drawing2,
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the total background rectangle. This is the area inside the borders or margins.',
      },
    ],
  },

  _WinAPI_GetThemeBackgroundExtent: {
    documentation: `Calculates the size and location of the background, defined by the visual style, given the content area ${include}`,
    label: '_WinAPI_GetThemeBackgroundExtent ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT )',
    params: [
      commonParams.hTheme,
      commonParams.iPartID_Content,
      commonParams.iStateID,
      commonParams.hDC_Drawing2,
      {
        label: '$tRECT',
        documentation: '`$tagRECT` structure that contains the content background rectangle.',
      },
    ],
  },

  _WinAPI_GetThemeBackgroundRegion: {
    documentation: `Computes the region for a regular or partially transparent background that is bounded by a specified rectangle ${include}`,
    label: '_WinAPI_GetThemeBackgroundRegion ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the region.',
      },
      commonParams.iStateID,
      {
        label: '$hDC',
        documentation: 'Handle to the device context to draw into.',
      },
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the specified rectangle used to compute the region.',
      },
    ],
  },

  _WinAPI_GetThemeBitmap: {
    documentation: `Retrieves the bitmap associated with a particular theme, part, state, and property ${include}`,
    label: '_WinAPI_GetThemeBitmap ( $hTheme, $iPartID, $iStateID, $iPropID, [$iFlag] = 0x01 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the bitmap.',
      },
      commonParams.iStateID,
      {
        label: '$iPropID',
        documentation: `The property to retrieve. Set this parameter to 0 to automatically select
        the first available bitmap for this part and state, or use one of the following values.${br}
        \`$TMT_DIBDATA\`${br}
        \`$TMT_GLYPHDIBDATA\`${br}
        \`$TMT_HBITMAP\``,
      },
      {
        label: '$iFlag',
        documentation: `${opt} This parameter can be one of the following values.${br}
          \`$GBF_DIRECT\`${br}
          \`$GBF_COPY\`${br}
          \`$GBF_VALIDBITS\``,
      },
    ],
  },

  _WinAPI_GetThemeBool: {
    documentation: `Retrieves the value of a BOOL property from the SysMetrics section of theme data ${include}`,
    label: '_WinAPI_GetThemeBool ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the BOOL property.',
      },
      commonParams.iStateID,
      {
        label: '$iPropID',
        documentation: `The property to retrieve. It can be one of the following values.${br}
          \`$TMT_TRANSPARENT\`${br}\n\`$TMT_AUTOSIZE\`${br}\n\`$TMT_BORDERONLY\`${br}
          \`$TMT_COMPOSITED\`${br}\n\`$TMT_BGFILL\`${br}\n\`$TMT_GLYPHTRANSPARENT\`${br}
          \`$TMT_GLYPHONLY\`${br}\n\`$TMT_ALWAYSSHOWSIZINGBAR\`${br}\n\`$TMT_MIRRORIMAGE\`${br}
          \`$TMT_UNIFORMSIZING\`${br}\n\`$TMT_INTEGRALSIZING\`${br}\n\`$TMT_SOURCEGROW\`${br}
          \`$TMT_SOURCESHRINK\`${br}\n\`$TMT_USERPICTURE\``,
      },
    ],
  },

  _WinAPI_GetThemeColor: {
    documentation: `Retrieves the value of a color property ${include}`,
    label: '_WinAPI_GetThemeColor ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the color property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeDocumentationProperty: {
    documentation: `Retrieves the value for a theme property from the documentation section of the
      specified theme file ${include}`,
    label: '_WinAPI_GetThemeDocumentationProperty ( $sFilePath, $sProperty )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the theme file that will be opened to query for the property.',
      },
      {
        label: '$sProperty',
        documentation: `The name of the theme property to query. This parameter can be one of the
          following values.${br}\n\`$SZ_THDOCPROP_AUTHOR\`${br}\n\`$SZ_THDOCPROP_CANONICALNAME\`
          ${br}\`$SZ_THDOCPROP_DISPLAYNAME\`${br}\n\`$SZ_THDOCPROP_TOOLTIP\``,
      },
    ],
  },

  _WinAPI_GetThemeEnumValue: {
    documentation: `Retrieves the value of an enumerated type property ${include}`,
    label: '_WinAPI_GetThemeEnumValue ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the enumerated type property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeFilename: {
    documentation: `Retrieves the value of a filename property ${include}`,
    label: '_WinAPI_GetThemeFilename ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the filename property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeFont: {
    documentation: 'Retrieves the value of a font property',
    label: '_WinAPI_GetThemeFont ( $hTheme, $iPartID, $iStateID, $iPropID, [$hDC] = 0 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the font property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
      {
        label: '$hDC',
        documentation: `${opt} Handle to the device context.`,
      },
    ],
  },

  _WinAPI_GetThemeInt: {
    documentation: `Retrieves the value of an INT property ${include}`,
    label: '_WinAPI_GetThemeInt ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the INT property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeMargins: {
    documentation: `Retrieves the value of a margins property ${include}`,
    label: '_WinAPI_GetThemeMargins ( $hTheme, $iPartID, $iStateID, $iPropID, $hDC, $tRECT )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the MARGINS property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
      {
        label: '$hDC',
        documentation: 'Handle to a device context to select fonts into.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the rectangle that specifies the area to be drawn into.',
      },
    ],
  },

  _WinAPI_GetThemeMetric: {
    documentation: `Retrieves the value of a metric property ${include}`,
    label: '_WinAPI_GetThemeMetric ( $hTheme, $iPartID, $iStateID, $iPropID, [$hDC] = 0 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the metric property.',
      },
      commonParams.iStateID,
      {
        label: '$iPropID',
        documentation: `The property to retrieve. It can be one of the following values.${br}
          \`$TMT_ALPHALEVEL\`${br}\n\`$TMT_ALPHATHRESHOLD\`${br}\n\`$TMT_BORDERSIZE\`${br}
          \`$TMT_GLYPHINDEX\`${br}\n\`$TMT_GRADIENTRATIO1\`${br}\n\`$TMT_GRADIENTRATIO2\`${br}
          \`$TMT_GRADIENTRATIO3\`${br}\n\`$TMT_GRADIENTRATIO4\`${br}\n\`$TMT_GRADIENTRATIO5\`${br}
          \`$TMT_HEIGHT\`${br}\n\`$TMT_IMAGECOUNT\`${br}\n\`$TMT_MINDPI1\`${br}\n\`$TMT_MINDPI2\`${br}
          \`$TMT_MINDPI3\`${br}\n\`$TMT_MINDPI4\`${br}\n\`$TMT_MINDPI5\`${br}
          \`$TMT_PROGRESSCHUNKSIZE\`${br}\n\`$TMT_PROGRESSSPACESIZE\`${br}\n\`$TMT_ROUNDCORNERWIDTH\`${br}
          \`$TMT_ROUNDCORNERHEIGHT\`${br}\n\`$TMT_SATURATION\`${br}\n\`$TMT_TEXTBORDERSIZE\`${br}
          \`$TMT_TRUESIZESTRETCHMARK\`${br}\n\`$TMT_WIDTH\``,
      },
      {
        label: '$hDC',
        documentation: `${opt} Handle to the device context.`,
      },
    ],
  },

  _WinAPI_GetThemePartSize: {
    documentation: `Calculates the original size of the part defined by a visual style ${include}`,
    label: '_WinAPI_GetThemePartSize ( $hTheme, $iPartID, $iStateID, $hDC, $tRECT, $iType )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part part to calculate the size of.',
      },
      commonParams.iStateID,
      {
        label: '$hDC',
        documentation: 'Handle to a device context to select fonts into.',
      },
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the rectangle used for the part drawing destination.',
      },
      {
        label: '$iType',
        documentation: `The type of size to retrieve. This parameter can be one of the following
          values.${br}\n\`$TS_MIN\`${br}\n\`$TS_TRUE\`${br}\n\`$TS_DRAW\``,
      },
    ],
  },

  _WinAPI_GetThemePosition: {
    documentation: `Retrieves the value of a position property ${include}`,
    label: '_WinAPI_GetThemePosition ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the position property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemePropertyOrigin: {
    documentation: `Retrieves the location of the theme property definition for a property ${include}`,
    label: '_WinAPI_GetThemePropertyOrigin ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the theme.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeRect: {
    documentation: `Retrieves the value of a RECT property ${include}`,
    label: '_WinAPI_GetThemeRect ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part containing the RECT property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeString: {
    documentation: `Retrieves the value of a string property ${include}`,
    label: '_WinAPI_GetThemeString ( $hTheme, $iPartID, $iStateID, $iPropID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part that contains the string property.',
      },
      commonParams.iStateID,
      commonParams.iPropID,
    ],
  },

  _WinAPI_GetThemeSysBool: {
    documentation: `Retrieves the Boolean value of a system metric ${include}`,
    label: '_WinAPI_GetThemeSysBool ( $hTheme, $iBoolID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iBoolID',
        documentation: `The value that specifies the system Boolean metric desired. It may be the following
          value.${br}\n\`$TMT_FLATMENUS\``,
      },
    ],
  },

  _WinAPI_GetThemeSysColor: {
    documentation: `Retrieves the value of a system color ${include}`,
    label: '_WinAPI_GetThemeSysColor ( $hTheme, $iColorID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iColorID',
        documentation:
          'The value that specifies the color number. It may be one of the `$COLOR_`* constants.',
      },
    ],
  },

  _WinAPI_GetThemeSysColorBrush: {
    documentation: `Retrieves a system color brush ${include}`,
    label: '_WinAPI_GetThemeSysColorBrush ( $hTheme, $iColorID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iColorID',
        documentation: `The value that specifies the number of the desired system color. It may be
          one of the following values.${br}\n\`$TMT_SCROLLBAR\`${br}\n\`$TMT_BACKGROUND\`${br}
          \`$TMT_ACTIVECAPTION\`${br}\n\`$TMT_INACTIVECAPTION\`${br}
          \`$TMT_WINDOW\`${br}\n\`$TMT_WINDOWFRAME\`${br}\n\`$TMT_MENUTEXT\`${br}
          \`$TMT_WINDOWTEXT\`${br}
          \`$TMT_CAPTIONTEXT\`${br}\n\`$TMT_ACTIVEBORDER\`${br}\n\`$TMT_INACTIVEBORDER\`${br}
          \`$TMT_APPWORKSPACE\`${br}\n\`$TMT_HIGHLIGHT\`${br}\n\`$TMT_HIGHLIGHTTEXT\`${br}
          \`$TMT_BTNFACE\`${br}\n\`$TMT_BTNSHADOW\`${br}\n\`$TMT_GRAYTEXT\`${br}\n\`$TMT_BTNTEXT\`${br}
          \`$TMT_INACTIVECAPTIONTEXT\`${br}\n\`$TMT_BTNHIGHLIGHT\`${br}\n\`$TMT_DKSHADOW3D\`${br}
          \`$TMT_LIGHT3D\`${br}\n\`$TMT_INFOTEXT\`${br}\n\`$TMT_INFOBK\`${br}
          \`$TMT_BUTTONALTERNATEFACE\`${br}\n\`$TMT_HOTTRACKING\`${br}
          \`$TMT_GRADIENTACTIVECAPTION\`${br}\n\`$TMT_GRADIENTINACTIVECAPTION\`${br}
          \`$TMT_MENUHILIGHT\`${br}\n\`$TMT_MENUBAR\``,
      },
    ],
  },

  _WinAPI_GetThemeSysFont: {
    documentation: `Retrieves the font information of a system font ${include}`,
    label: '_WinAPI_GetThemeSysFont ( $hTheme, $iFontID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iFontID',
        documentation: `The value that specifies a system font. It may be one of the following
          values.${br}\n\`$TMT_CAPTIONFONT\`${br}\n\`$TMT_SMALLCAPTIONFONT\`${br}
          \`$TMT_MENUFONT\`${br}\n\`$TMT_STATUSFONT\`${br}\n\`$TMT_MSGBOXFONT\`${br}
          \`$TMT_ICONTITLEFONT\``,
      },
    ],
  },

  _WinAPI_GetThemeSysInt: {
    documentation: `Retrieves the value of a system INT ${include}`,
    label: '_WinAPI_GetThemeSysInt ( $hTheme, $iIntID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iIntID',
        documentation: `The value that specifies the desired system INT. It may be the following
          value.${br}\n\`$TMT_MINCOLORDEPTH\``,
      },
    ],
  },

  _WinAPI_GetThemeSysSize: {
    documentation: `Retrieves the value of a system size metric from theme data ${include}`,
    label: '_WinAPI_GetThemeSysSize ( $hTheme, $iSizeID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iSizeID',
        documentation: `The value that specifies the system size metric desired. The following
          values are valid.${br}\n\`$SM_CXBORDER\`${br}\n\`$SM_CXVSCROLL\`${br}\n\`$SM_CXHSCROLL\`${br}
          \`$SM_CXSIZE\`${br}\n\`$SM_CYSIZE\`${br}\n\`$SM_CXSMSIZE\`${br}\n\`$SM_CYSMSIZE\`${br}
          \`$SM_CXMENUSIZE\`${br}\n\`$SM_CYMENUSIZE\`${br}\n\`$SM_CXPADDEDBORDER\``,
      },
    ],
  },

  _WinAPI_GetThemeSysString: {
    documentation: `Retrieves the value of a system string ${include}`,
    label: '_WinAPI_GetThemeSysString ( $hTheme, $iStringID )',
    params: [
      commonParams.hTheme2,
      {
        label: '$iStringID',
        documentation: `The value that specifies a system string. It may be one of the following
          values.${br}\n\`$TMT_CSSNAME\`${br}\n\`$TMT_XMLNAME\``,
      },
    ],
  },

  _WinAPI_GetThemeTextExtent: {
    documentation: `Calculates the size and location of the specified text when rendered in the visual style font ${include}`,
    label:
      '_WinAPI_GetThemeTextExtent ( $hTheme, $iPartID, $iStateID, $hDC, $sText, $tRECT, $iFlags )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part in which the text will be drawn.',
      },
      commonParams.iStateID,
      {
        label: '$hDC',
        documentation: 'Handle to the device context to select the font into.',
      },
      commonParams.sText,
      {
        label: '$tRECT',
        documentation:
          '`$tagRECT` structure that contains the rectangle used to control layout of the text.' +
          ' This parameter may be set to 0.',
      },
      {
        label: '$iFlags',
        documentation: "The string's formatting flags (`$DT_`\\*).",
      },
    ],
  },

  _WinAPI_GetThemeTextMetrics: {
    documentation: `Retrieves information about the font specified by a visual style for a
      particular part ${include}`,
    label: '_WinAPI_GetThemeTextMetrics ( $hTheme, $iPartID, $iStateID, [$hDC] = 0 )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part to retrieve font information about.',
      },
      commonParams.iStateID,
      {
        label: '$hDC',
        documentation: `${opt} Handle to the device context to use for screen context.`,
      },
    ],
  },

  _WinAPI_GetThemeTransitionDuration: {
    documentation: `Gets the duration for the specified transition ${include}`,
    label:
      '_WinAPI_GetThemeTransitionDuration ( $hTheme, $iPartID, $iStateIDFrom, $iStateIDTo, $iPropID )',
    params: [
      {
        label: '$hTheme',
        documentation: 'Handle of the theme data.',
      },
      {
        label: '$iPartID',
        documentation: 'ID of the part.',
      },
      {
        label: '$iStateIDFrom',
        documentation: 'The state ID of the part before the transition.',
      },
      {
        label: '$iStateIDTo',
        documentation: 'The state ID of the part after the transition.',
      },
      {
        label: '$iPropID',
        documentation: 'The property ID (`$TMT_`\\*).',
      },
    ],
  },

  _WinAPI_GetWindowTheme: {
    documentation: `Retrieves a theme handle to a window that has visual styles applied ${include}`,
    label: '_WinAPI_GetWindowTheme ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
    ],
  },

  _WinAPI_IsThemeActive: {
    documentation: `Tests if a visual style for the current application is active ${include}`,
    label: '_WinAPI_IsThemeActive (  )',
    params: [],
  },

  _WinAPI_IsThemeBackgroundPartiallyTransparent: {
    documentation: `Retrieves whether the background specified by the visual style has transparent pieces or alpha-blended pieces ${include}`,
    label: '_WinAPI_IsThemeBackgroundPartiallyTransparent ( $hTheme, $iPartID, $iStateID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part.',
      },
      commonParams.iStateID,
    ],
  },

  _WinAPI_IsThemePartDefined: {
    documentation: `Retrieves whether a visual style has defined parameters for the specified part ${include}`,
    label: '_WinAPI_IsThemePartDefined ( $hTheme, $iPartID )',
    params: [
      commonParams.hTheme,
      {
        label: '$iPartID',
        documentation: 'The part.',
      },
    ],
  },

  _WinAPI_OpenThemeData: {
    documentation: `Opens the theme data for a window and its associated class ${include}`,
    label: '_WinAPI_OpenThemeData ( $hWnd, $sClass )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window for which theme data is required.',
      },
      {
        label: '$sClass',
        documentation: `The string that contains a semicolon-separated list of classes. This
          parameter may contain a list, not just a single name, to provide the class an opportunity
          to get the best match between the class and the current visual style.`,
      },
    ],
  },

  _WinAPI_SetThemeAppProperties: {
    documentation: `Sets the flags that determine how visual styles are implemented in the calling application ${include}`,
    label: '_WinAPI_SetThemeAppProperties ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation: `This parameter can be one or more of the following values.${br}
          \`$STAP_ALLOW_NONCLIENT\`${br}\n\`$STAP_ALLOW_CONTROLS\`${br}\n\`$STAP_ALLOW_WEBCONTENT\``,
      },
    ],
  },

  _WinAPI_SetWindowTheme: {
    documentation: `Causes a window to use a different set of visual style information than its class normally uses ${include}`,
    label: '_WinAPI_SetWindowTheme ( $hWnd, [$sName] = 0, [$sList] = 0 )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose visual style information is to be changed.',
      },
      {
        label: '$sName',
        documentation: `${opt} A string that contains the application name. If this parameter is 0
          (Default), the calling application's name is used.`,
      },
      {
        label: '$sList',
        documentation: `${opt} A string that contains a semicolon-separated list of CLSID names to
          use in place of the actual list passed by the window's class. If this parameter is 0
          (Default), the ID list from the calling class is used.`,
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, completions, hovers };
