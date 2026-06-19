import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$PBS_MARQUEE',
    documentation: 'Displays progress status as a scrolling marquee.',
  },
  {
    label: '$PBS_SMOOTH',
    documentation:
      "Displays progress status in a smooth scrolling bar instead of the default segmented bar.\nNote This style is supported only in the Windows Classic theme. All other themes won't visually change with or without this style.",
  },
  {
    label: '$PBS_SMOOTHREVERSE',
    documentation:
      'Displays progress status with a smooth backward transition when changing from a higher value to a lower value. By default, the control will instantly jump to the lower value.\nNote This style is supported only on Windows Vista or later. ',
  },
  {
    label: '$PBS_VERTICAL',
    documentation: 'Displays progress status vertically, from bottom to top.',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Progress Bar Style Constant',
  'ProgressConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
