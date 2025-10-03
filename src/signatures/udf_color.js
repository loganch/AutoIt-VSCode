import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Color.au3>`)';

const signatures = {
  _ColorConvertHSLtoRGB: {
    documentation: 'Converts HSL to RGB',
    label: '_ColorConvertHSLtoRGB ( $aArray )',
    params: [
      {
        label: '$aArray',
        documentation: 'An array containing HSL values in their respective positions',
      },
    ],
  },
  _ColorConvertRGBtoHSL: {
    documentation: 'Converts RGB to HSL',
    label: '_ColorConvertRGBtoHSL ( $aArray )',
    params: [
      {
        label: '$aArray',
        documentation: 'An array containing RGB values in their respective positions',
      },
    ],
  },
  _ColorGetBlue: {
    documentation: 'Returns the blue component of a given color',
    label: '_ColorGetBlue ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The RGB color to work with (0x00RRGGBB).',
      },
    ],
  },
  _ColorGetCOLORREF: {
    documentation: 'Returns the COLORREF color',
    label: '_ColorGetCOLORREF ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'the COLORREF color to work with (0x00BBGGRR)',
      },
    ],
  },
  _ColorGetGreen: {
    documentation: 'Returns the green component of a given color',
    label: '_ColorGetGreen ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The RGB color to work with (0x00RRGGBB).',
      },
    ],
  },
  _ColorGetRed: {
    documentation: 'Returns the red component of a given color',
    label: '_ColorGetRed ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The RGB color to work with (0x00RRGGBB).',
      },
    ],
  },
  _ColorGetRGB: {
    documentation: 'Returns an array containing RGB values in their respective positions',
    label: '_ColorGetRGB ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The RGB color to work with (0x00RRGGBB).',
      },
    ],
  },
  _ColorSetCOLORREF: {
    documentation: 'Returns the COLORREF color',
    label: '_ColorSetCOLORREF ( $aColor )',
    params: [
      {
        label: '$aColor',
        documentation:
          'an array of values in the range 0-255:  \n[0] Red component color  \n[1] Green component color  \n[2] Blue component color',
      },
    ],
  },
  _ColorSetRGB: {
    documentation: 'Returns the RGB color',
    label: '_ColorSetRGB ( $aColor )',
    params: [
      {
        label: '$aColor',
        documentation:
          'an array of values in the range 0-255:  \n[0] Red component color  \n[1] Green component color  \n[2] Blue component color',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
