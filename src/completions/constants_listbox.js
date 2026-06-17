import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const items = [
  {
    label: '$LBS_DISABLENOSCROLL',
    documentation:
      'Shows a disabled vertical scroll bar for the list box when the box does not contain enough items to scroll. If you do not specify this style, the scroll bar is hidden when the list box does not contain enough items.',
  },
  {
    label: '$LBS_NOINTEGRALHEIGHT',
    documentation:
      'Specifies that the list box will be exactly the size specified by the application when it created the list box.',
  },
  {
    label: '$LBS_NOSEL',
    documentation: 'Specifies that the user can view list box strings but cannot select them.',
  },
  {
    label: '$LBS_NOTIFY',
    documentation:
      'Notifies the parent window when the user taps or double-taps a string in the list box.',
  },
  {
    label: '$LBS_SORT',
    documentation: 'Sorts strings in the list box alphabetically.',
  },
  {
    label: '$LBS_STANDARD',
    documentation:
      'Sorts strings in the list box alphabetically. The parent window receives an input message when the user taps or double-taps a string. The list box has borders on all sides. (LBS_NOTIFY | LBS_SORT | WS_VSCROLL | WS_BORDER)',
  },
  {
    label: '$LBS_USETABSTOPS',
    documentation:
      'Enables a list box to recognize and expand tab characters when drawing its strings. The default tab positions are 32 dialog box units. A dialog box unit is equal to one-fourth of the current dialog box base-width unit.',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'List Style Constant',
  'ListBoxConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
