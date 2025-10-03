import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlComboBox.au3>`)';

const signatures = {
  _GUICtrlComboBox_AddDir: {
    documentation: 'Adds the names of directories and files',
    label:
      '_GUICtrlComboBox_AddDir ( $hWnd, $sFilePath [, $iAttributes = 0 [, $bBrackets = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFilePath',
        documentation: 'Specifies an absolute path, relative path, or filename',
      },
      {
        label: '$iAttributes',
        documentation:
          '**[optional]** Specifies the attributes of the files or directories to be added:    $DDL_READWRITE - Includes read-write files with no additional attributes    $DDL_READONLY - Includes read-only files    $DDL_HIDDEN - Includes hidden files    $DDL_SYSTEM - Includes system files    $DDL_DIRECTORY - Includes directories    $DDL_ARCHIVE - Includes archived files    $DDL_DRIVES - All mapped drives are added to the list    $DDL_EXCLUSIVE - Includes only files with the specified attributes',
      },
      {
        label: '$bBrackets',
        documentation: '**[optional]** include/exclude brackets when $DDL_DRIVES is used',
      },
    ],
  },
  _GUICtrlComboBox_AddString: {
    documentation: 'Add a string',
    label: '_GUICtrlComboBox_AddString ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to add',
      },
    ],
  },
  _GUICtrlComboBox_AutoComplete: {
    documentation: 'AutoComplete a ComboBox edit control',
    label: '_GUICtrlComboBox_AutoComplete ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_BeginUpdate: {
    documentation: 'Prevents updating of the control until the EndUpdate function is called',
    label: '_GUICtrlComboBox_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_Create: {
    documentation: 'Create a ComboBox control',
    label:
      '_GUICtrlComboBox_Create ( $hWnd, $sText, $iX, $iY [, $iWidth = 100 [, $iHeight = 120 [, $iStyle = 0x00200042 [, $iExStyle = 0x00000000]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sText',
        documentation: 'Delimited string to add to the combobox',
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
        documentation: '**[optional]** Control width',
      },
      {
        label: '$iHeight',
        documentation: '**[optional]** Control height',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Control style:    $CBS_AUTOHSCROLL - Automatically scrolls the text in an edit control to the right when the user types a character at the end of the line.    $CBS_DISABLENOSCROLL - Shows a disabled vertical scroll bar    $CBS_DROPDOWN - Similar to $CBS_SIMPLE, except that the list box is not displayed unless the user selects an icon next to the edit control    $CBS_DROPDOWNLIST - Similar to $CBS_DROPDOWN, except that the edit control is replaced by a static text item that displays the current selection in the list box    $CBS_LOWERCASE - Converts to lowercase all text in both the selection field and the list    $CBS_NOINTEGRALHEIGHT - Specifies that the size of the combo box is exactly the size specified by the application when it created the combo box    $CBS_OEMCONVERT - Converts text entered in the combo box edit control from the Windows character set to the OEM character set and then back to the Windows character set    $CBS_OWNERDRAWFIXED - Specifies that the owner of the list box is responsible for drawing its contents and that the items in the list box are all the same height    $CBS_OWNERDRAWVARIABLE - Specifies that the owner of the list box is responsible for drawing its contents and that the items in the list box are variable in height    $CBS_SIMPLE - Displays the list box at all times    $CBS_SORT - Automatically sorts strings added to the list box    $CBS_UPPERCASE - Converts to uppercase all text in both the selection field and the listDefault: $CBS_DROPDOWN, $CBS_AUTOHSCROLL, $WS_VSCROLLForced : $WS_CHILD, $WS_TABSTOP, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlComboBox_DeleteString: {
    documentation: 'Delete a string',
    label: '_GUICtrlComboBox_DeleteString ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of string',
      },
    ],
  },
  _GUICtrlComboBox_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlComboBox_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_EndUpdate: {
    documentation: 'Enables screen repainting that was turned off with the BeginUpdate function',
    label: '_GUICtrlComboBox_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_FindString: {
    documentation: 'Search for a string',
    label: '_GUICtrlComboBox_FindString ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to search for',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index of the item preceding the first item to be searched',
      },
    ],
  },
  _GUICtrlComboBox_FindStringExact: {
    documentation: 'Search for a string',
    label: '_GUICtrlComboBox_FindStringExact ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to search for',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index of the item preceding the first item to be searched',
      },
    ],
  },
  _GUICtrlComboBox_GetComboBoxInfo: {
    documentation: 'Gets information about the specified ComboBox',
    label: '_GUICtrlComboBox_GetComboBoxInfo ( $hWnd, ByRef $tInfo )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$tInfo',
        documentation: 'infos as defined by $tagCOMBOBOXINFO',
      },
    ],
  },
  _GUICtrlComboBox_GetCount: {
    documentation: 'Retrieve the number of items',
    label: '_GUICtrlComboBox_GetCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetCueBanner: {
    documentation: 'Gets the cue banner text displayed in the edit control of a combo box',
    label: '_GUICtrlComboBox_GetCueBanner ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetCurSel: {
    documentation: 'Retrieve the index of the currently selected item',
    label: '_GUICtrlComboBox_GetCurSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetDroppedControlRect: {
    documentation: 'Retrieve the screen coordinates of a combo box in its dropped-down state',
    label: '_GUICtrlComboBox_GetDroppedControlRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetDroppedControlRectEx: {
    documentation: 'Retrieve the screen coordinates of a combo box in its dropped-down state',
    label: '_GUICtrlComboBox_GetDroppedControlRectEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetDroppedState: {
    documentation: 'Determines whether the ListBox of a ComboBox is dropped down',
    label: '_GUICtrlComboBox_GetDroppedState ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetDroppedWidth: {
    documentation: 'Retrieve the minimum allowable width, of the ListBox of a ComboBox',
    label: '_GUICtrlComboBox_GetDroppedWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetEditSel: {
    documentation:
      'Gets the starting and ending character positions of the current selection in the edit control of a ComboBox',
    label: '_GUICtrlComboBox_GetEditSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetEditText: {
    documentation: 'Get the text from the edit control of a ComboBox',
    label: '_GUICtrlComboBox_GetEditText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetExtendedUI: {
    documentation:
      'Determines whether a ComboBox has the default user interface or the extended user interface',
    label: '_GUICtrlComboBox_GetExtendedUI ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetHorizontalExtent: {
    documentation:
      'Gets the width, in pixels, that the ListBox of a ComboBox control can be scrolled horizontally',
    label: '_GUICtrlComboBox_GetHorizontalExtent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetItemHeight: {
    documentation: 'Determines the height of list items or the selection field in a ComboBox',
    label: '_GUICtrlComboBox_GetItemHeight ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Determines which height to get:    –1 - Retrieve the height of the selection field     0 - Retrieve the height of list items',
      },
    ],
  },
  _GUICtrlComboBox_GetLBText: {
    documentation: 'Retrieve a string from the list of a ComboBox',
    label: '_GUICtrlComboBox_GetLBText ( $hWnd, $iIndex, ByRef $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index to Retrieve from',
      },
      {
        label: '$sText',
        documentation: 'Variable that will receive the string',
      },
    ],
  },
  _GUICtrlComboBox_GetLBTextLen: {
    documentation: 'Gets the length, in characters, of a string in the list of a combo box',
    label: '_GUICtrlComboBox_GetLBTextLen ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'index of the required entry',
      },
    ],
  },
  _GUICtrlComboBox_GetList: {
    documentation: 'Retrieves all items from the list portion of a ComboBox control',
    label: '_GUICtrlComboBox_GetList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetListArray: {
    documentation: 'Retrieves all items from the list portion of a ComboBox control',
    label: '_GUICtrlComboBox_GetListArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetLocale: {
    documentation: 'Retrieves the current locale',
    label: '_GUICtrlComboBox_GetLocale ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetLocaleCountry: {
    documentation: 'Retrieves the current country code',
    label: '_GUICtrlComboBox_GetLocaleCountry ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetLocaleLang: {
    documentation: 'Retrieves the current language identifier',
    label: '_GUICtrlComboBox_GetLocaleLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetLocalePrimLang: {
    documentation: 'Extract primary language id from a language id',
    label: '_GUICtrlComboBox_GetLocalePrimLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetLocaleSubLang: {
    documentation: 'Extract sublanguage id from a language id',
    label: '_GUICtrlComboBox_GetLocaleSubLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetMinVisible: {
    documentation:
      'Retrieve the minimum number of visible items in the drop-down list of a ComboBox',
    label: '_GUICtrlComboBox_GetMinVisible ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_GetTopIndex: {
    documentation:
      'Retrieve the 0-based index of the first visible item in the ListBox portion of a ComboBox',
    label: '_GUICtrlComboBox_GetTopIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_InitStorage: {
    documentation: 'Allocates memory for storing ListBox items',
    label: '_GUICtrlComboBox_InitStorage ( $hWnd, $iNum, $iBytes )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iNum',
        documentation: 'Number of items to add',
      },
      {
        label: '$iBytes',
        documentation: 'The amount of memory to allocate for item strings, in bytes',
      },
    ],
  },
  _GUICtrlComboBox_InsertString: {
    documentation: 'Insert a string',
    label: '_GUICtrlComboBox_InsertString ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text string to be inserted',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Specifies the 0-based index of the position at which to insert the string.',
      },
    ],
  },
  _GUICtrlComboBox_LimitText: {
    documentation:
      'Limits the length of the text the user may type into the edit control of a ComboBox',
    label: '_GUICtrlComboBox_LimitText ( $hWnd [, $iLimit = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLimit',
        documentation: '**[optional]** limit length of the text',
      },
    ],
  },
  _GUICtrlComboBox_ReplaceEditSel: {
    documentation: 'Replace text selected in edit box',
    label: '_GUICtrlComboBox_ReplaceEditSel ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String containing the replacement text',
      },
    ],
  },
  _GUICtrlComboBox_ResetContent: {
    documentation: 'Remove all items from the ListBox and edit control of a ComboBox',
    label: '_GUICtrlComboBox_ResetContent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlComboBox_SelectString: {
    documentation:
      'Searches the ListBox of a ComboBox for an item that begins with the characters in a specified string',
    label: '_GUICtrlComboBox_SelectString ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String that contains the characters for which to search',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Specifies the 0-based index of the item preceding the first item to be searched',
      },
    ],
  },
  _GUICtrlComboBox_SetCueBanner: {
    documentation: 'Sets the cue banner text that is displayed for the edit control of a combo box',
    label: '_GUICtrlComboBox_SetCueBanner ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String that contains the text',
      },
    ],
  },
  _GUICtrlComboBox_SetCurSel: {
    documentation: 'Select a string in the list of a ComboBox',
    label: '_GUICtrlComboBox_SetCurSel ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Specifies the 0-based index of the string to select',
      },
    ],
  },
  _GUICtrlComboBox_SetDroppedWidth: {
    documentation: 'Set the maximum allowable width, in pixels, of the ListBox of a ComboBox',
    label: '_GUICtrlComboBox_SetDroppedWidth ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the ListBox, in pixels',
      },
    ],
  },
  _GUICtrlComboBox_SetEditSel: {
    documentation: 'Select characters in the edit control of a ComboBox',
    label: '_GUICtrlComboBox_SetEditSel ( $hWnd, $iStart, $iStop )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStart',
        documentation: 'Starting position',
      },
      {
        label: '$iStop',
        documentation: 'Ending postions',
      },
    ],
  },
  _GUICtrlComboBox_SetEditText: {
    documentation: 'Set the text of the edit control of the ComboBox',
    label: '_GUICtrlComboBox_SetEditText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to be set',
      },
    ],
  },
  _GUICtrlComboBox_SetExtendedUI: {
    documentation: 'Select either the default user interface or the extended user interface',
    label: '_GUICtrlComboBox_SetExtendedUI ( $hWnd [, $bExtended = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bExtended',
        documentation: '**[optional]** Specifies whether the combo box uses the extended',
      },
    ],
  },
  _GUICtrlComboBox_SetHorizontalExtent: {
    documentation: 'Set the width, in pixels, by which a list box can be scrolled horizontally',
    label: '_GUICtrlComboBox_SetHorizontalExtent ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'Specifies the scrollable width of the list box, in pixels',
      },
    ],
  },
  _GUICtrlComboBox_SetItemHeight: {
    documentation: 'Set the height of list items or the selection field in a ComboBox',
    label: '_GUICtrlComboBox_SetItemHeight ( $hWnd, $iHeight [, $iComponent = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iHeight',
        documentation:
          'The height, in pixels, of the combo box component identified by $iComponent',
      },
      {
        label: '$iComponent',
        documentation:
          '**[optional]** Use the following values:    –1 - Set the height of the selection field     0 - Set the height of list items',
      },
    ],
  },
  _GUICtrlComboBox_SetMinVisible: {
    documentation: 'Set the minimum number of visible items in the drop-down list of a ComboBox',
    label: '_GUICtrlComboBox_SetMinVisible ( $hWnd, $iMinimum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Specifies the minimum number of visible items',
      },
    ],
  },
  _GUICtrlComboBox_SetTopIndex: {
    documentation: 'Ensure that a particular item is visible in the ListBox of a ComboBox',
    label: '_GUICtrlComboBox_SetTopIndex ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the list item',
      },
    ],
  },
  _GUICtrlComboBox_ShowDropDown: {
    documentation: 'Show or hide the ListBox of a ComboBox',
    label: '_GUICtrlComboBox_ShowDropDown ( $hWnd [, $bShow = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bShow',
        documentation:
          '**[optional]** Specifies whether the drop-down ListBox is to be shown or hidden:    True - Show ListBox    False - Hide ListBox',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
