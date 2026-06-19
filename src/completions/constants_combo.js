import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$CBS_AUTOHSCROLL',
    documentation:
      'Automatically scrolls the text in an edit control to the right when the user types a character at the end of the line. If this style is not set, only text that fits within the rectangular boundary is enabled. ',
  },
  {
    label: '$CBS_DISABLENOSCROLL',
    documentation:
      'Shows a disabled vertical scroll bar in the list box when the box does not contain enough items to scroll. Without this style, the scroll bar is hidden when the list box does not contain enough items. ',
  },
  {
    label: '$CBS_DROPDOWN',
    documentation:
      'Displays only the edit control by default. The user can display the list box by selecting an icon next to the edit control. ',
  },
  {
    label: '$CBS_DROPDOWNLIST',
    documentation:
      'Displays a static text field that displays the current selection in the list box. ',
  },
  {
    label: '$CBS_LOWERCASE',
    documentation:
      'Converts to lowercase any uppercase characters that are typed into the edit control of a combo box. ',
  },
  {
    label: '$CBS_NOINTEGRALHEIGHT',
    documentation:
      'Specifies that the combo box will be exactly the size specified by the application when it created the combo box. Usually, Windows CE sizes a combo box so that it does not display partial items. ',
  },
  {
    label: '$CBS_OEMCONVERT',
    documentation:
      'Converts text typed in the combo box edit control from the Windows CE character set to the OEM character set and then back to the Windows CE set. This style is most useful for combo boxes that contain file names. It applies only to combo boxes created with the CBS_DROPDOWN style. ',
  },
  {
    label: '$CBS_SIMPLE',
    documentation:
      'Displays the list box at all times. The current selection in the list box is displayed in the edit control. ',
  },
  {
    label: '$CBS_SORT',
    documentation: 'Sorts strings that are typed into the list box. ',
  },
  {
    label: '$CBS_UPPERCASE',
    documentation:
      'Converts to uppercase any lowercase characters that are typed into the edit control of a combo box. ',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Combo Style Constant',
  'ComboConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
