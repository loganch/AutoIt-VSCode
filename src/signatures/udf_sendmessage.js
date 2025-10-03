import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <SendMessage.au3>`)';

const signatures = {
  _SendMessage: {
    documentation: 'Wrapper for commonly used DLL Call',
    label:
      '_SendMessage ( $hWnd, $iMsg [, $wParam = 0 [, $lParam = 0 [, $iReturn = 0 [, $wParamType = "wparam" [, $lParamType = "lparam" [, $sReturnType = "lresult"]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window/control handle',
      },
      {
        label: '$iMsg',
        documentation: 'Message to send to control (number)',
      },
      {
        label: '$wParam',
        documentation: '**[optional]** Specifies additional message-specific information',
      },
      {
        label: '$lParam',
        documentation: '**[optional]** Specifies additional message-specific information',
      },
      {
        label: '$iReturn',
        documentation:
          '**[optional]** What to return:    0 - Return value from DLL call    1 - $ihWnd    2 - $iMsg    3 - $wParam    4 - $lParam     4 - array same as DllCall()',
      },
      {
        label: '$wParamType',
        documentation: '**[optional]** See DllCall in Related',
      },
      {
        label: '$lParamType',
        documentation: '**[optional]** See DllCall in Related',
      },
      {
        label: '$sReturnType',
        documentation: '**[optional]** See DllCall in Related',
      },
    ],
  },
  _SendMessageA: {
    documentation: 'Send a Message to a Window/Control (Force Ansi Call)',
    label:
      '_SendMessageA ( $hWnd, $iMsg [, $wParam = 0 [, $lParam = 0 [, $iReturn = 0 [, $wParamType = "wparam" [, $lParamType = "lparam" [, $sReturnType = "lresult"]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window/control handle',
      },
      {
        label: '$iMsg',
        documentation: 'Message to send to control (number)',
      },
      {
        label: '$wParam',
        documentation: '**[optional]** Specifies additional message-specific information',
      },
      {
        label: '$lParam',
        documentation: '**[optional]** Specifies additional message-specific information',
      },
      {
        label: '$iReturn',
        documentation:
          '**[optional]** What to return:    0 - Return value from DLL call    1 - $ihWnd    2 - $iMsg    3 - $wParam    4 - $lParam     4 - array same as DllCall',
      },
      {
        label: '$wParamType',
        documentation: '**[optional]** See DllCall in Related',
      },
      {
        label: '$lParamType',
        documentation: '**[optional]** See DllCall in Related',
      },
      {
        label: '$sReturnType',
        documentation: '**[optional]** See DllCall in Related',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
