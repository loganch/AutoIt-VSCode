import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlListBox.au3>`)';

const signatures = {
  _GUICtrlListBox_AddFile: {
    documentation: 'Adds the specified filename that contains a directory listing',
    label: '_GUICtrlListBox_AddFile ( $hWnd, $sFilePath )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFilePath',
        documentation: 'Name of the file to add',
      },
    ],
  },
  _GUICtrlListBox_AddString: {
    documentation: 'Add a string',
    label: '_GUICtrlListBox_AddString ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String that is to be added',
      },
    ],
  },
  _GUICtrlListBox_BeginUpdate: {
    documentation: 'Prevents updating of the control until the EndUpdate function is called',
    label: '_GUICtrlListBox_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_ClickItem: {
    documentation: 'Clicks an item',
    label:
      '_GUICtrlListBox_ClickItem ( $hWnd, $iIndex [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
      {
        label: '$sButton',
        documentation: '**[optional]** Button to click with',
      },
      {
        label: '$bMove',
        documentation:
          '**[optional]** If True, the mouse will be moved. If False, the mouse does not move.',
      },
      {
        label: '$iClicks',
        documentation: '**[optional]** Number of clicks',
      },
      {
        label: '$iSpeed',
        documentation: '**[optional]** Mouse movement speed',
      },
    ],
  },
  _GUICtrlListBox_Create: {
    documentation: 'Create a Listbox control',
    label:
      '_GUICtrlListBox_Create ( $hWnd, $sText, $iX, $iY [, $iWidth = 100 [, $iHeight = 200 [, $iStyle = 0x00B00002 [, $iExStyle = 0x00000200]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sText',
        documentation: 'String to add to the combobox',
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
          "**[optional]** Control style:    $LBS_COMBOBOX - Notifies a list box that it is part of a combo box    $LBS_DISABLENOSCROLL - Shows a disabled vertical scroll bar    $LBS_EXTENDEDSEL - Allows multiple items to be selected    $LBS_HASSTRINGS - Specifies that a list box contains items consisting of strings    $LBS_MULTICOLUMN - Specifies a multi columnn list box that will be scrolled horizontally    $LBS_MULTIPLESEL - Turns string selection on or off each time the user clicks a string    $LBS_NODATA - Specifies a no-data list box    $LBS_NOINTEGRALHEIGHT - Specifies that the size is exactly the size set by the application    $LBS_NOREDRAW - Specifies that the list box's appearance is not updated when changes are made    $LBS_NOSEL - Specifies that the list box contains items that can be viewed but not selected    $LBS_NOTIFY - Notifies whenever the user clicks or double clicks a string    $LBS_OWNERDRAWFIXED - Specifies that the list box is owner drawn    $LBS_OWNERDRAWVARIABLE - Specifies that the list box is owner drawn with variable height    $LBS_SORT - Sorts strings in the list box alphabetically    $LBS_STANDARD - Standard list box style    $LBS_USETABSTOPS - Enables a list box to recognize and expand tab characters    $LBS_WANTKEYBOARDINPUT - Specifies that the owner receives WM_VKEYTOITEM messagesDefault: $LBS_SORT, $WS_HSCROLL, $WS_VSCROLL, $WS_BORDERForced : $WS_CHILD, $WS_TABSTOP, $WS_VISIBLE, $LBS_NOTIFY",
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.Default: $WS_EX_CLIENTEDGE',
      },
    ],
  },
  _GUICtrlListBox_DeleteString: {
    documentation: 'Delete a string',
    label: '_GUICtrlListBox_DeleteString ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the string to be deleted',
      },
    ],
  },
  _GUICtrlListBox_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlListBox_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_Dir: {
    documentation: 'Adds the names of directories and files',
    label: '_GUICtrlListBox_Dir ( $hWnd, $sFilePath [, $iAttributes = 0 [, $bBrackets = True]] )',
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
          '**[optional]** Specifies the attributes of the files or directories to be added:    $DDL_READWRITE - Includes read-write files with no additional attributes    $DDL_READONLY - Includes read-only files    $DDL_HIDDEN - Includes hidden files    $DDL_SYSTEM - Includes system files    $DDL_DIRECTORY - Includes subdirectories    $DDL_ARCHIVE - Includes archived files    $DDL_DRIVES - All mapped drives are added to the list    $DDL_EXCLUSIVE - Includes only files with the specified attributes',
      },
      {
        label: '$bBrackets',
        documentation: '**[optional]** include/exclude brackets when $DDL_DRIVES is used',
      },
    ],
  },
  _GUICtrlListBox_EndUpdate: {
    documentation: 'Enables screen repainting that was turned off with the BeginUpdate function',
    label: '_GUICtrlListBox_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_FindInText: {
    documentation: 'Searches for an item that contains the specified text anywhere in its text',
    label: '_GUICtrlListBox_FindInText ( $hWnd, $sText [, $iStart = -1 [, $bWrapOK = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to match',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** 0-based index of the item to begin the search with or -1 to start from the beginning.The specified item is itself excluded from the search.',
      },
      {
        label: '$bWrapOK',
        documentation:
          '**[optional]** If True, the search will continue with the first item if no match is found',
      },
    ],
  },
  _GUICtrlListBox_FindString: {
    documentation: 'Search for a string',
    label: '_GUICtrlListBox_FindString ( $hWnd, $sText [, $bExact = False] )',
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
        label: '$bExact',
        documentation: '**[optional]** Exact match or not',
      },
    ],
  },
  _GUICtrlListBox_GetAnchorIndex: {
    documentation: 'Retrieves the index of the anchor item',
    label: '_GUICtrlListBox_GetAnchorIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetCaretIndex: {
    documentation: 'Return index of item that has the focus rectangle',
    label: '_GUICtrlListBox_GetCaretIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetCount: {
    documentation: 'Retrieves the number of items',
    label: '_GUICtrlListBox_GetCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetCurSel: {
    documentation: 'Retrieve the index of the currently selected item',
    label: '_GUICtrlListBox_GetCurSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetHorizontalExtent: {
    documentation: 'Retrieve from a list box the the scrollable width',
    label: '_GUICtrlListBox_GetHorizontalExtent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetItemData: {
    documentation: 'Retrieves the application defined value associated with an item',
    label: '_GUICtrlListBox_GetItemData ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_GetItemHeight: {
    documentation: 'Retrieves the height of items',
    label: '_GUICtrlListBox_GetItemHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetItemRect: {
    documentation: 'Retrieves the rectangle that bounds an item',
    label: '_GUICtrlListBox_GetItemRect ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_GetItemRectEx: {
    documentation: 'Retrieves the rectangle that bounds an item',
    label: '_GUICtrlListBox_GetItemRectEx ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_GetListBoxInfo: {
    documentation: 'Retrieve the number of items per column in a specified list box',
    label: '_GUICtrlListBox_GetListBoxInfo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetLocale: {
    documentation: 'Retrieves the current locale',
    label: '_GUICtrlListBox_GetLocale ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetLocaleCountry: {
    documentation: 'Retrieves the current country code',
    label: '_GUICtrlListBox_GetLocaleCountry ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetLocaleLang: {
    documentation: 'Retrieves the current language identifier',
    label: '_GUICtrlListBox_GetLocaleLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetLocalePrimLang: {
    documentation: 'Extract primary language id from a language id',
    label: '_GUICtrlListBox_GetLocalePrimLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetLocaleSubLang: {
    documentation: 'Extract sublanguage id from a language id',
    label: '_GUICtrlListBox_GetLocaleSubLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetSel: {
    documentation: 'Retrieves the selection state of an item',
    label: '_GUICtrlListBox_GetSel ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_GetSelCount: {
    documentation: 'Retrieves the total number of selected items',
    label: '_GUICtrlListBox_GetSelCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetSelItems: {
    documentation: 'Fills a buffer with an array of selected items',
    label: '_GUICtrlListBox_GetSelItems ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetSelItemsText: {
    documentation: 'Retrieves the text of selected items',
    label: '_GUICtrlListBox_GetSelItemsText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_GetText: {
    documentation: 'Returns the item (string) at the specified index',
    label: '_GUICtrlListBox_GetText ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the string to retrieve',
      },
    ],
  },
  _GUICtrlListBox_GetTextLen: {
    documentation: 'Gets the length of a string in a list box',
    label: '_GUICtrlListBox_GetTextLen ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_GetTopIndex: {
    documentation: 'Retrieve the index of the first visible item in a list',
    label: '_GUICtrlListBox_GetTopIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_InitStorage: {
    documentation: 'This message allocates memory for storing items',
    label: '_GUICtrlListBox_InitStorage ( $hWnd, $iItems, $iBytes )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iItems',
        documentation: 'The total amount of items that you intend to add',
      },
      {
        label: '$iBytes',
        documentation: 'The total amount of memory your strings will consume',
      },
    ],
  },
  _GUICtrlListBox_InsertString: {
    documentation: 'Insert a string into the list',
    label: '_GUICtrlListBox_InsertString ( $hWnd, $sText [, $iIndex = -1] )',
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
          '**[optional]** Specifies the 0-based index of the position at which to insert the string.If this parameter is -1 the string is added to the end of the list.',
      },
    ],
  },
  _GUICtrlListBox_ItemFromPoint: {
    documentation: 'Retrieves the 0-based index of the item nearest the specified point',
    label: '_GUICtrlListBox_ItemFromPoint ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X coordinate, relative to the upper-left corner of the client area',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate, relative to the upper-left corner of the client area',
      },
    ],
  },
  _GUICtrlListBox_ReplaceString: {
    documentation: 'Replaces the text of an item',
    label: '_GUICtrlListBox_ReplaceString ( $hWnd, $iIndex, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
      {
        label: '$sText',
        documentation: 'String to replace old string',
      },
    ],
  },
  _GUICtrlListBox_ResetContent: {
    documentation: 'Remove all items from the list box',
    label: '_GUICtrlListBox_ResetContent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_SelectString: {
    documentation: 'Searchs for an item that begins with the specified string',
    label: '_GUICtrlListBox_SelectString ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String that contains the string for which to search.',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Specifies the 0-based index of the item before the first item to be searched.When the search reaches the bottom of the list box, it continues searching from the top of the list box back to the item specified by $iIndex.If $iIndex is –1, the entire list box is searched from the beginning.',
      },
    ],
  },
  _GUICtrlListBox_SelItemRange: {
    documentation: 'Select one or more consecutive items in a multiple-selection list box',
    label: '_GUICtrlListBox_SelItemRange ( $hWnd, $iFirst, $iLast [, $bSelect = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFirst',
        documentation: '0-based index of the first item to select',
      },
      {
        label: '$iLast',
        documentation: '0-based index of the last item to select',
      },
      {
        label: '$bSelect',
        documentation:
          '**[optional]** Specifies how to set the selection.If this parameter is True, the string is selected and highlighted.If it is False, the highlight is removed and the string is no longer selected.',
      },
    ],
  },
  _GUICtrlListBox_SelItemRangeEx: {
    documentation: 'Select one or more consecutive items in a multiple-selection list box',
    label: '_GUICtrlListBox_SelItemRangeEx ( $hWnd, $iFirst, $iLast )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFirst',
        documentation: '0-based index of the first item to select',
      },
      {
        label: '$iLast',
        documentation: '0-based index of the last item to select',
      },
    ],
  },
  _GUICtrlListBox_SetAnchorIndex: {
    documentation: 'Set the anchor item—that is, the item from which a multiple selection starts',
    label: '_GUICtrlListBox_SetAnchorIndex ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_SetCaretIndex: {
    documentation:
      'Set the focus rectangle to the item at the specified index in a multiple-selection list box',
    label: '_GUICtrlListBox_SetCaretIndex ( $hWnd, $iIndex [, $bPartial = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
      {
        label: '$bPartial',
        documentation:
          '**[optional]** If False, the item is scrolled until it is fully visible.If it is True, the item is scrolled until it is at least partially visible.',
      },
    ],
  },
  _GUICtrlListBox_SetColumnWidth: {
    documentation: 'Set the width, in pixels, of all columns',
    label: '_GUICtrlListBox_SetColumnWidth ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'Specifies the width, in pixels, of all columns',
      },
    ],
  },
  _GUICtrlListBox_SetCurSel: {
    documentation: 'Select a string and scroll it into view, if necessary',
    label: '_GUICtrlListBox_SetCurSel ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Specifies the 0-based index of the string that is selected.If this parameter is -1 the list box is set to have no selection.',
      },
    ],
  },
  _GUICtrlListBox_SetHorizontalExtent: {
    documentation: 'Set the width, in pixels, by which a list box can be scrolled horizontally',
    label: '_GUICtrlListBox_SetHorizontalExtent ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'Specifies the number of pixels the list box can be scrolled',
      },
    ],
  },
  _GUICtrlListBox_SetItemData: {
    documentation: 'Sets the value associated with the specified item',
    label: '_GUICtrlListBox_SetItemData ( $hWnd, $iIndex, $iValue )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
      {
        label: '$iValue',
        documentation: 'Specifies the value to be associated with the item',
      },
    ],
  },
  _GUICtrlListBox_SetItemHeight: {
    documentation: 'Sets the height, in pixels, of items',
    label: '_GUICtrlListBox_SetItemHeight ( $hWnd, $iHeight [, $iIndex = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iHeight',
        documentation: 'Specifies the height, in pixels, of the item',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Specifies the 0-based index of the item in the list box.Use this only if the control has the LBS_OWNERDRAWVARIABLE style otherwise, set it to zero.',
      },
    ],
  },
  _GUICtrlListBox_SetLocale: {
    documentation: 'Set the current locale',
    label: '_GUICtrlListBox_SetLocale ( $hWnd, $iLocal )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLocal',
        documentation:
          'Specifies the locale identifier that the list box will use for sorting when adding text',
      },
    ],
  },
  _GUICtrlListBox_SetSel: {
    documentation: 'Select a string(s) in a multiple-selection list box',
    label: '_GUICtrlListBox_SetSel ( $hWnd [, $iIndex = -1 [, $iSelect = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Specifies the 0-based index of the item',
      },
      {
        label: '$iSelect',
        documentation: '**[optional]** Specifies how to set the selection.',
      },
    ],
  },
  _GUICtrlListBox_SetTabStops: {
    documentation: 'Sets the tab-stop positions',
    label: '_GUICtrlListBox_SetTabStops ( $hWnd, $aTabStops )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aTabStops',
        documentation:
          'Array with the following format:    [0] - Number of tab stops in the array (n)    [1] - First tab stop    [2] - Second tab stop    [n] - Nth tab stop',
      },
    ],
  },
  _GUICtrlListBox_SetTopIndex: {
    documentation: 'Ensure that a particular item in a list box is visible',
    label: '_GUICtrlListBox_SetTopIndex ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the item',
      },
    ],
  },
  _GUICtrlListBox_Sort: {
    documentation: 'Re-sorts list box if it has the $LBS_SORT style',
    label: '_GUICtrlListBox_Sort ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListBox_SwapString: {
    documentation: 'Swaps the text of two items at the specified indices',
    label: '_GUICtrlListBox_SwapString ( $hWnd, $iIndexA, $iIndexB )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndexA',
        documentation: '0-based index item to swap',
      },
      {
        label: '$iIndexB',
        documentation: '0-based index item to swap',
      },
    ],
  },
  _GUICtrlListBox_UpdateHScroll: {
    documentation: 'Update the horizontal scroll bar based on the longest string',
    label: '_GUICtrlListBox_UpdateHScroll ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
