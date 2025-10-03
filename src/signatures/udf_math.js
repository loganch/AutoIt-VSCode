import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Math.au3>`)';

const signatures = {
  _Degree: {
    documentation: 'Converts radians to degrees',
    label: '_Degree ( $iRadians )',
    params: [
      {
        label: '$iRadians',
        documentation: 'Radians to be converted into degrees.',
      },
    ],
  },
  _MathCheckDiv: {
    documentation: 'Checks if first number is divisible by the second number',
    label: '_MathCheckDiv ( $iNum1 [, $iNum2 = 2] )',
    params: [
      {
        label: '$iNum1',
        documentation: 'Integer value to check',
      },
      {
        label: '$iNum2',
        documentation: '**[optional]** Integer value to divide by (default = 2)',
      },
    ],
  },
  _Max: {
    documentation: 'Evaluates which of the two numbers is higher',
    label: '_Max ( $iNum1, $iNum2 )',
    params: [
      {
        label: '$iNum1',
        documentation: 'First number.',
      },
      {
        label: '$iNum2',
        documentation: 'Second number.',
      },
    ],
  },
  _Min: {
    documentation: 'Evaluates which of the two numbers is lower',
    label: '_Min ( $iNum1, $iNum2 )',
    params: [
      {
        label: '$iNum1',
        documentation: 'First number.',
      },
      {
        label: '$iNum2',
        documentation: 'Second number.',
      },
    ],
  },
  _Radian: {
    documentation: 'Converts degrees to radians',
    label: '_Radian ( $iDegrees )',
    params: [
      {
        label: '$iDegrees',
        documentation: 'Degrees to be converted into radians.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
