import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlIpAddress.au3>`)';

const signatures = {
  _GUICtrlIpAddress_ClearAddress: {
    documentation: 'Clears the contents of the IP address control',
    label: '_GUICtrlIpAddress_ClearAddress ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_Create: {
    documentation: 'Create a GUI IP Address Control',
    label:
      '_GUICtrlIpAddress_Create ( $hWnd, $iX, $iY [, $iWidth = 125 [, $iHeight = 25 [, $iStyles = 0x00000000 [, $iExstyles = 0x00000000]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$iX',
        documentation: 'Horizontal position of the control',
      },
      {
        label: '$iY',
        documentation: 'Vertical position of the control',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Control width',
      },
      {
        label: '$iHeight',
        documentation: '**[optional]** Control height',
      },
      {
        label: '$iStyles',
        documentation: '**[optional]** Control styles:Forced : $WS_CHILD, $WS_VISIBLE, $WS_TABSTOP',
      },
      {
        label: '$iExStyles',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlIpAddress_Destroy: {
    documentation: 'Delete the IP Address control',
    label: '_GUICtrlIpAddress_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_Get: {
    documentation: 'Retrieves the address from the IP address control',
    label: '_GUICtrlIpAddress_Get ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_GetArray: {
    documentation: 'Retrieves the address from the IP address control',
    label: '_GUICtrlIpAddress_GetArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_GetEx: {
    documentation: 'Retrieves the address from the IP address control',
    label: '_GUICtrlIpAddress_GetEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_IsBlank: {
    documentation: 'Determines if all fields in the IP address control are blank',
    label: '_GUICtrlIpAddress_IsBlank ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlIpAddress_Set: {
    documentation: 'Sets the address in the IP address control',
    label: '_GUICtrlIpAddress_Set ( $hWnd, $sAddress )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sAddress',
        documentation: 'IP Address string',
      },
    ],
  },
  _GUICtrlIpAddress_SetArray: {
    documentation: 'Sets the address in the IP address control',
    label: '_GUICtrlIpAddress_SetArray ( $hWnd, $aAddress )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aAddress',
        documentation:
          'Array formatted as follows:[0] - 1st address field[1] - 2nd address field[2] - 3rd address field[3] - 4th address field',
      },
    ],
  },
  _GUICtrlIpAddress_SetEx: {
    documentation: 'Sets the address in the IP address control',
    label: '_GUICtrlIpAddress_SetEx ( $hWnd, $tIP )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tIP',
        documentation: '$tagGetIPAddress structure containing new ip address for the control',
      },
    ],
  },
  _GUICtrlIpAddress_SetFocus: {
    documentation: 'Sets the keyboard focus to the specified field in the IP address control',
    label: '_GUICtrlIpAddress_SetFocus ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '0-based field index to which the focus should be set.If this value is greater than the number of fields, focus is set to the first blank field.If all fields are nonblank, focus is set to the first field.',
      },
    ],
  },
  _GUICtrlIpAddress_SetFont: {
    documentation: 'Set font of the control',
    label:
      '_GUICtrlIpAddress_SetFont ( $hWnd [, $sFaceName = "Arial" [, $iFontSize = 12 [, $iFontWeight = 400 [, $bFontItalic = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sFaceName',
        documentation: '**[optional]** The Font Name of the font to use',
      },
      {
        label: '$iFontSize',
        documentation: '**[optional]** The Font Size',
      },
      {
        label: '$iFontWeight',
        documentation: '**[optional]** The Font Weight',
      },
      {
        label: '$bFontItalic',
        documentation: '**[optional]** Use Italic Attribute',
      },
    ],
  },
  _GUICtrlIpAddress_SetRange: {
    documentation: 'Sets the valid range for the specified field in the IP address control',
    label: '_GUICtrlIpAddress_SetRange ( $hWnd, $iIndex [, $iLowRange = 0 [, $iHighRange = 255]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based field index to which the range will be applied',
      },
      {
        label: '$iLowRange',
        documentation: '**[optional]** Lower limit of the range',
      },
      {
        label: '$iHighRange',
        documentation: '**[optional]** Upper limit of the range',
      },
    ],
  },
  _GUICtrlIpAddress_ShowHide: {
    documentation: 'Shows/Hides the IP address control',
    label: '_GUICtrlIpAddress_ShowHide ( $hWnd, $iState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iState',
        documentation: 'State of the IP Address control, can be the following values:',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
