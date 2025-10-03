import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlButton.au3>`)';

const signatures = {
  _GUICtrlButton_Click: {
    documentation: 'Simulates the user clicking a button',
    label: '_GUICtrlButton_Click ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_Create: {
    documentation: 'Creates a Button control',
    label:
      '_GUICtrlButton_Create ( $hWnd, $sText, $iX, $iY, $iWidth, $iHeight [, $iStyle = -1 [, $iExStyle = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sText',
        documentation: 'Text to add to Button',
      },
      {
        label: '$iX',
        documentation: 'Horizontal position of the control',
      },
      {
        label: '$iY',
        documentation: 'Vertical position of the control',
      },
      {
        label: '$iWidth',
        documentation: 'Control width',
      },
      {
        label: '$iHeight',
        documentation: 'Control height',
      },
      {
        label: '$iStyle',
        documentation:
          "**[optional]** Control style:    $BS_AUTO3STATE - Creates a three-state check box in which the state cycles through selected, unavailable, and cleared each time the user selects the check box.    $BS_AUTOCHECKBOX - Creates a check box in which the check state switches between selected and cleared each time the user selects the check box.    $BS_AUTORADIOBUTTON - Same as a radio button, except that when the user selects it, the button automatically highlights itself and removes the selection from any other radio buttons with the same style in the same group.    $BS_FLAT - Specifies that the button is two-dimensional; it does not use the default shading to create a 3-D image.    $BS_GROUPBOX - Creates a rectangle in which other buttons can be grouped. Any text associated with this style is displayed in the rectangle’s upper-left corner.    $BS_PUSHLIKE - Makes a button (such as a check box, three-state check box, or radio button) look and act like a push button. The button looks raised when it isn't pushed or checked, and sunken when it is pushed or checked.    $BS_DEFPUSHBUTTON - Creates a push button with a heavy black border. If the button is in a dialog box, the user can select the button by pressing the ENTER key, even when the button does not have the input focus. This style is useful for enabling the user to quickly select the most likely option, or default.    $BS_BOTTOM - Places the text at the bottom of the button rectangle.    $BS_CENTER - Centers the text horizontally in the button rectangle.    $BS_LEFT - Left-aligns the text in the button rectangle on the right side of the check box.    $BS_MULTILINE - Wraps the button text to multiple lines if the text string is too long to fit on a single line in the button rectangle.    $BS_RIGHT - Right-aligns text in the button rectangle on the right side of the check box.    $BS_RIGHTBUTTON - Positions a check box square on the right side of the button rectangle.    $BS_TOP - Places text at the top of the button rectangle.    $BS_VCENTER - Vertically centers text in the button rectangle.    $BS_ICON - Specifies that the button displays an icon.    $BS_BITMAP - Specifies that the button displays a bitmap.    $BS_NOTIFY - Enables a button to send BN_KILLFOCUS and BN_SETFOCUS notification messages to its parent window. Note that buttons send the BN_CLICKED notification message regardless of whether it has this style. To get BN_DBLCLK notification messages, the button must have the BS_RADIOBUTTON or BS_OWNERDRAW style.Vista Sytles:    $BS_SPLITBUTTON - Creates a split button. A split button has a drop down arrow    $BS_DEFSPLITBUTTON - Creates a split button that behaves like a $BS_PUSHBUTTON style button, but also has a distinctive appearance.    $BS_COMMANDLINK - Creates a command link button    $BS_DEFCOMMANDLINK - Creates a command link button that behaves like a $BS_PUSHBUTTON style button.Default: ( -1) : noneForced : $WS_CHILD, $WS_TABSTOP, $WS_VISIBLE, $BS_NOTIFY",
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlButton_Destroy: {
    documentation: 'Delete the Button control',
    label: '_GUICtrlButton_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_Enable: {
    documentation: 'Enables or disables mouse and keyboard input to the specified button',
    label: '_GUICtrlButton_Enable ( $hWnd [, $bEnable = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** Specifies whether to enable or disable the button:    True - The button is enabled    False - The button is disabled',
      },
    ],
  },
  _GUICtrlButton_GetCheck: {
    documentation: 'Gets the check state of a radio button or check box',
    label: '_GUICtrlButton_GetCheck ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetFocus: {
    documentation: 'Retrieves if the button has keyboard focus',
    label: '_GUICtrlButton_GetFocus ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetIdealSize: {
    documentation:
      'Gets the size of the button that best fits its text and image, if an image list is present',
    label: '_GUICtrlButton_GetIdealSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetImage: {
    documentation: 'Retrieves a handle to the image (icon or bitmap) associated with the button',
    label: '_GUICtrlButton_GetImage ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetImageList: {
    documentation: 'Retrieves an array that describes the image list assigned to a button control',
    label: '_GUICtrlButton_GetImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetNote: {
    documentation: 'Gets the text of the note associated with the Command Link button',
    label: '_GUICtrlButton_GetNote ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetNoteLength: {
    documentation:
      'Gets the length of the note text that may be displayed in the description for a command link button',
    label: '_GUICtrlButton_GetNoteLength ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetSplitInfo: {
    documentation: 'Gets information for a split button control',
    label: '_GUICtrlButton_GetSplitInfo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetState: {
    documentation: 'Determines the state of a button or check box',
    label: '_GUICtrlButton_GetState ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetText: {
    documentation: 'Retrieve the text of the button',
    label: '_GUICtrlButton_GetText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_GetTextMargin: {
    documentation: 'Gets the margins used to draw text in a button control',
    label: '_GUICtrlButton_GetTextMargin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlButton_SetCheck: {
    documentation: 'Sets the check state of a radio button or check box',
    label: '_GUICtrlButton_SetCheck ( $hWnd [, $iState = $BST_CHECKED] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iState',
        documentation:
          '**[optional]** The check state. This parameter can be one of the following values:    $BST_CHECKED - Sets the button state to checked.    $BST_INDETERMINATE - Sets the button state to grayed, indicating an indeterminate state.        Use this value only if the button has the $BS_3STATE or $BS_AUTO3STATE style.    $BST_UNCHECKED - Sets the button state to cleared.',
      },
    ],
  },
  _GUICtrlButton_SetDontClick: {
    documentation: 'Sets the state of $BST_DONTCLICK flag on a button',
    label: '_GUICtrlButton_SetDontClick ( $hWnd [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bState',
        documentation: '**[optional]** The state. True to set the $BST_DONTCLICK, otherwise False',
      },
    ],
  },
  _GUICtrlButton_SetFocus: {
    documentation: 'Sets the keyboard focus to the specified button',
    label: '_GUICtrlButton_SetFocus ( $hWnd [, $bFocus = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bFocus',
        documentation:
          '**[optional]** This parameter can be one of the following values:    True - Sets the keyboard focus to the button    False - Removes the keyboard focus from the button',
      },
    ],
  },
  _GUICtrlButton_SetImage: {
    documentation: 'Sets the image of a button',
    label: '_GUICtrlButton_SetImage ( $hWnd, $sImageFile [, $iIconID = -1 [, $bLarge = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sImageFile',
        documentation: 'File containing the Image',
      },
      {
        label: '$iIconID',
        documentation: '**[optional]** Specifies the 0-based index of the icon to extract',
      },
      {
        label: '$bLarge',
        documentation: '**[optional]** Extract Large Icon',
      },
    ],
  },
  _GUICtrlButton_SetImageList: {
    documentation: 'Assigns an image list to a button control',
    label:
      '_GUICtrlButton_SetImageList ( $hWnd, $hImage [, $iAlign = 0 [, $iLeft = 1 [, $iTop = 1 [, $iRight = 1 [, $iBottom = 1]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hImage',
        documentation:
          'A handle to the image list.Should contain either a single image to be used for all states or individual images for each state listed in the following:    1 - Normal    2 - Hot    3 - Pressed    4 - Disabled    5 - Defaulted    6 - Stylus Hot (tablet computers only)',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Specifies the alignment to use. This parameter can be one of the following values:    0 - Align the image with the left margin.    1 - Align the image with the right margin.    2 - Align the image with the top margin.    3 - Align the image with the bottom margin.    4 - Center the image.',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** Left margin of the icon',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Top margin of the icon',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** Right margin of the icon',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Bottom margin of the icon',
      },
    ],
  },
  _GUICtrlButton_SetNote: {
    documentation: 'Sets the text of the note associated with a command link button',
    label: '_GUICtrlButton_SetNote ( $hWnd, $sNote )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sNote',
        documentation: 'String that contains the note',
      },
    ],
  },
  _GUICtrlButton_SetShield: {
    documentation:
      'Sets the elevation required state for a specified button or command link to display an elevated icon',
    label: '_GUICtrlButton_SetShield ( $hWnd [, $bRequired = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bRequired',
        documentation: '**[optional]** True to draw an elevated icon, or False otherwise',
      },
    ],
  },
  _GUICtrlButton_SetSize: {
    documentation: 'Sets the size of the button',
    label: '_GUICtrlButton_SetSize ( $hWnd, $iWidth, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'New width of the button',
      },
      {
        label: '$iHeight',
        documentation: 'New height of the button',
      },
    ],
  },
  _GUICtrlButton_SetSplitInfo: {
    documentation: 'Gets information for a split button control',
    label:
      '_GUICtrlButton_SetSplitInfo ( $hWnd [, $hImlGlyph = -1 [, $iSplitStyle = $BCSS_ALIGNLEFT [, $iWidth = 0 [, $iHeight = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hImlGlyph',
        documentation: '**[optional]** Handle to the image list',
      },
      {
        label: '$iSplitStyle',
        documentation:
          '**[optional]** The split button style. Value must be one or more of the following flags.    $BCSS_ALIGNLEFT - Align the image or glyph horizontally with the left margin    $BCSS_IMAGE - Draw an icon image as the glyph    $BCSS_NOSPLIT - No split    $BCSS_STRETCH - Stretch glyph, but try to retain aspect ratio',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Width of the glyph',
      },
      {
        label: '$iHeight',
        documentation: '**[optional]** Height of the glyph',
      },
    ],
  },
  _GUICtrlButton_SetState: {
    documentation:
      'Sets the highlight state of a button. The highlight state indicates whether the button is highlighted as if the user had pushed it',
    label: '_GUICtrlButton_SetState ( $hWnd [, $bHighlighted = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bHighlighted',
        documentation: '**[optional]** Specifies whether the button is highlighted.',
      },
    ],
  },
  _GUICtrlButton_SetStyle: {
    documentation: 'Sets the style of a button',
    label: '_GUICtrlButton_SetStyle ( $hWnd, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStyle',
        documentation: 'Can be a combination of button styles',
      },
    ],
  },
  _GUICtrlButton_SetText: {
    documentation: 'Sets the text of the button',
    label: '_GUICtrlButton_SetText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'New text',
      },
    ],
  },
  _GUICtrlButton_SetTextMargin: {
    documentation: 'Sets the margins for drawing text in a button control',
    label:
      '_GUICtrlButton_SetTextMargin ( $hWnd [, $iLeft = 1 [, $iTop = 1 [, $iRight = 1 [, $iBottom = 1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** Left margin to use for drawing text',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Top margin to use for drawing text',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** Right margin to use for drawing text',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Bottom margin to use for drawing text',
      },
    ],
  },
  _GUICtrlButton_Show: {
    documentation: 'Show/Hide button',
    label: '_GUICtrlButton_Show ( $hWnd [, $bShow = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bShow',
        documentation:
          '**[optional]** One of the following:    True - Show button    False - Hide button',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
