import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const items = [
  {
    label: '$UDS_ALIGNLEFT',
    documentation:
      'Positions the up-down control next to the left edge of the buddy window. The buddy window is moved to the right and its width is decreased to accommodate the width of the up-down control.',
  },
  {
    label: '$UDS_ALIGNRIGHT',
    documentation:
      'Positions the up-down control next to the right edge of the buddy window. The width of the buddy window is decreased to accommodate the width of the up-down control.',
  },
  {
    label: '$UDS_ARROWKEYS',
    documentation:
      'Causes the up-down control to process the UP ARROW and DOWN ARROW keys on the keyboard.',
  },
  {
    label: '$UDS_HORZ',
    documentation:
      "Causes the up-down control's arrows to point left and right instead of up and down.",
  },
  {
    label: '$UDS_NOTHOUSANDS',
    documentation:
      'Prevents insertion of a thousands separator between every three decimal positions.',
  },
  {
    label: '$UDS_WRAP',
    documentation:
      'Causes the position to wrap if it is incremented or decremented beyond the end or beginning of the range.',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Up-down Style Constant',
  'UpDownConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
