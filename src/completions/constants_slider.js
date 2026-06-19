import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$TBS_AUTOTICKS',
    documentation:
      'Adds tick marks when you set the range on the trackbar by using the TBM_SETRANGE message.',
  },
  {
    label: '$TBS_BOTH',
    documentation: 'Places ticks on both sides of the trackbar.',
  },
  {
    label: '$TBS_BOTTOM',
    documentation: 'Places ticks on the bottom of a horizontal trackbar.',
  },
  {
    label: '$TBS_HORZ',
    documentation: 'Specifies a horizontal trackbar. This is the default.',
  },
  {
    label: '$TBS_VERT',
    documentation: 'Places ticks on the left side of a vertical trackbar.',
  },
  {
    label: '$TBS_NOTHUMB',
    documentation: 'Specifies that the trackbar has no slider.',
  },
  {
    label: '$TBS_NOTICKS',
    documentation: 'Specifies that no ticks are placed on the trackbar.',
  },
  {
    label: '$TBS_LEFT',
    documentation: 'Places ticks on the left side of a vertical trackbar.',
  },
  {
    label: '$TBS_RIGHT',
    documentation: 'Places ticks on the right side of a vertical trackbar.',
  },
  {
    label: '$TBS_TOP',
    documentation: 'Places ticks on the top of a horizontal trackbar.',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Slider Style Constant',
  'SliderConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
