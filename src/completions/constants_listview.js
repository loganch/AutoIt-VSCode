import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$LVS_ICON',
    documentation: 'This style specifies icon view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_REPORT',
    documentation: 'This style specifies report view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_SMALLICON',
    documentation: 'This style specifies small icon view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_LIST',
    documentation: 'This style specifies list view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_EDITLABELS',
    documentation: 'Item text can be edited in place.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_NOCOLUMNHEADER',
    documentation:
      'Column headers are not displayed in report view. By default, columns have headers in report view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_NOSORTHEADER',
    documentation:
      'Column headers do not work like buttons. This style can be used if clicking a column header in report view does not carry out an action, such as sorting.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_SINGLESEL',
    documentation: 'Only one item at a time can be selected.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_SHOWSELALWAYS',
    documentation:
      'The selection, if any, is always shown, even if the control does not have the focus.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_SORTASCENDING',
    documentation: 'Item indices are sorted based on item text in ascending order.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_SORTDESCENDING',
    documentation: 'Item indices are sorted based on item text in descending order.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_NOLABELWRAP',
    documentation:
      'Item text is displayed on a single line in icon view. By default, item text may wrap in icon view.',
    detail: 'ListView Style Constant',
  },
  {
    label: '$LVS_EX_FULLROWSELECT',
    documentation: 'When an item is selected, the item and all its subitems are highlighted.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_GRIDLINES',
    documentation: 'Displays gridlines around items and subitems.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_HEADERDRAGDROP',
    documentation: 'Enables drag-and-drop reordering of columns in a list view control.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_TRACKSELECT',
    documentation:
      'Enables hot-track selection in a list view control. Hot track selection means that an item is automatically selected when the cursor remains over the item for a certain period of time',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_CHECKBOXES',
    documentation: 'Enables check boxes for items in a list view control.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_BORDERSELECT',
    documentation:
      'If this style is set, when an item is selected the border color of the item changes rather than the item being highlighted.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_DOUBLEBUFFER',
    documentation:
      'Paints via double-buffering, which reduces flicker. This extended style also enables alpha-blended marquee selection on systems where it is supported.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_FLATSB',
    documentation: 'Enables flat scroll bars in the list view.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_MULTIWORKAREAS',
    documentation:
      'The control will not autoarrange its icons until one or more work areas are defined.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_SNAPTOGRID',
    documentation: 'In icon view, icons automatically snap into a grid.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_SUBITEMIMAGES',
    documentation: 'Allows images to be displayed for subitems.',
    detail: 'ListView Extended Style Constant',
  },
  {
    label: '$LVS_EX_INFOTIP',
    documentation:
      'Displays a tooltip when the item is not fully visible. Sends a notification message to $LVN_GETINFOTIP',
    detail: 'ListView Extended Style Constant',
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'ListViewConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
