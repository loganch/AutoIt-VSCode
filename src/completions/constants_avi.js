import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const items = [
  {
    label: '$ACS_AUTOPLAY',
    documentation: 'Starts playing the animation as soon as the AVI clip is opened. ',
  },
  {
    label: '$ACS_CENTER',
    documentation: "Centers the animation in the animation control's window. ",
  },
  {
    label: '$ACS_TRANSPARENT',
    documentation:
      'Allows you to match an animation\'s background color to that of the underlying window, creating a "transparent" background. (Default value) ',
  },
  {
    label: '$ACS_NONTRANSPARENT',
    documentation: 'To override default ACS_TRANSPARENT ',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'AVI Clip Style Constant',
  'AVIConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
