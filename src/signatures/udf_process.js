import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Process.au3>`)';

const signatures = {
  _ProcessGetName: {
    documentation: 'Returns a string containing the process name that belongs to a given PID',
    label: '_ProcessGetName ( $iPID )',
    params: [
      {
        label: '$iPID',
        documentation: 'The PID of a currently running process.',
      },
    ],
  },
  _ProcessGetPriority: {
    documentation: 'Get the priority of an open process',
    label: '_ProcessGetPriority ( $vProcess )',
    params: [
      {
        label: '$vProcess',
        documentation: 'The name or PID of the process to be examined.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
