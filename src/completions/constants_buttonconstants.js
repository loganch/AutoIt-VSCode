import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$BS_3STATE',
    documentation:
      'Creates a check box in which the box can be unavailable as well as selected or cleared. Use the unavailable state to show that the state of the check box is not determined.',
  },
  {
    label: '$BS_AUTO3STATE',
    documentation:
      'Creates a three-state check box in which the state cycles through selected, unavailable, and cleared each time the user selects the check box.',
  },
  {
    label: '$BS_AUTOCHECKBOX',
    documentation:
      'Creates a check box in which the check state switches between selected and cleared each time the user selects the check box.',
  },
  {
    label: '$BS_CHECKBOX',
    documentation:
      'Creates a small, empty check box with a label displayed to the right of it. To display the text to the left of the check box, combine this flag with the BS_RIGHTBUTTON style.',
  },
  {
    label: '$BS_LEFT',
    documentation:
      'Left-aligns the text in the button rectangle on the right side of the check box.',
  },
  {
    label: '$BS_PUSHLIKE',
    documentation:
      "Makes a button (such as a check box, three-state check box, or radio button) look and act like a push button. The button looks raised when it isn't pushed or checked, and sunken when it is pushed or checked.",
  },
  {
    label: '$BS_RIGHT',
    documentation: 'Right-aligns text in the button rectangle on the right side of the check box.',
  },
  {
    label: '$BS_RIGHTBUTTON',
    documentation: 'Positions a check box square on the right side of the button rectangle.',
  },
  {
    label: '$BS_GROUPBOX',
    documentation:
      "Creates a rectangle in which other buttons can be grouped. Any text associated with this style is displayed in the rectangle's upper-left corner.",
  },
  {
    label: '$BS_AUTORADIOBUTTON',
    documentation:
      'Same as a radio button, except that when the user selects it, the button automatically highlights itself and removes the selection from any other radio buttons with the same style in the same group.',
  },
  {
    label: '$BS_BOTTOM',
    documentation: 'Places the text at the bottom of the button rectangle.',
  },
  {
    label: '$BS_CENTER',
    documentation: 'Centers the text horizontally in the button rectangle.',
  },
  {
    label: '$BS_DEFPUSHBUTTON',
    documentation:
      'Creates a push button with a heavy black border. If the button is in a dialog box, the user can select the button by pressing the ENTER key, even when the button does not have the input focus. This style is useful for enabling the user to quickly select the most likely option, or default.',
  },
  {
    label: '$BS_MULTILINE',
    documentation:
      'Wraps the button text to multiple lines if the text string is too long to fit on a single line in the button rectangle.',
  },
  {
    label: '$BS_TOP',
    documentation: 'Places text at the top of the button rectangle.',
  },
  {
    label: '$BS_VCENTER',
    documentation: 'Vertically centers text in the button rectangle.',
  },
  {
    label: '$BS_ICON',
    documentation: 'Specifies that the button displays an icon.',
  },
  {
    label: '$BS_BITMAP',
    documentation: 'Specifies that the button displays a bitmap.',
  },
  {
    label: '$BS_FLAT',
    documentation:
      'Specifies that the button is two-dimensional; it does not use the default shading to create a 3-D image.',
  },
  {
    label: '$BS_NOTIFY',
    documentation:
      'Enables a button to send BN_KILLFOCUS and BN_SETFOCUS notification messages to its parent window. Note that buttons send the BN_CLICKED notification message regardless of whether it has this style. To get BN_DBLCLK notification messages, the button must have the BS_RADIOBUTTON or BS_OWNERDRAW style.',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Button Constant',
  'ButtonConstant.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
