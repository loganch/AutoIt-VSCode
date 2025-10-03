import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlComboBoxEx.au3>`)';

const signatures = {
  _GUICtrlComboBoxEx_AddDir: {
    documentation: 'Adds the names of directories and files',
    label:
      '_GUICtrlComboBoxEx_AddDir ( $hWnd, $sFilePath [, $iAttributes = 0 [, $bBrackets = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
  _GUICtrlComboBoxEx_AddString: {
    documentation: 'Add a string',
    label:
      '_GUICtrlComboBoxEx_AddString ( $hWnd, $sText [, $iImage = -1 [, $iSelectedImage = -1 [, $iOverlayImage = -1 [, $iIndent = -1 [, $iParam = -1]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation:
          'Item text. If set to -1, the item set is set via the $CBEN_GETDISPINFO notification message.',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelectedImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iOverlayImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iIndent',
        documentation:
          '**[optional]** Number of image widths to indent the item. A single indentation equals the width of an image.',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Value specific to the item',
      },
    ],
  },
  _GUICtrlComboBoxEx_BeginUpdate: {
    documentation: 'Prevents updating of the control until the EndUpdate function is called',
    label: '_GUICtrlComboBoxEx_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_Create: {
    documentation: 'Create a ComboBoxEx control',
    label:
      '_GUICtrlComboBoxEx_Create ( $hWnd, $sText, $iX, $iY [, $iWidth = 100 [, $iHeight = 200 [, $iStyle = 0x00200002 [, $iExStyle = 0x00000000]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sText',
        documentation: 'Delimited text to add to ComboBox',
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
          '**[optional]** Control style:    $CBS_DROPDOWN - Similar to $CBS_SIMPLE, except that the list box is not displayed unless the user selects an icon next to the edit control    $CBS_DROPDOWNLIST - Similar to $CBS_DROPDOWN, except that the edit control is replaced by a static text item that displays the current selection in the list box    $CBS_SIMPLE - Displays the list box at all timesDefault: $CBS_DROPDOWN, $WS_VSCROLLForced : $WS_CHILD, $WS_TABSTOP, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style:    $CBES_EX_CASESENSITIVE - Searches in the list will be case sensitive    $CBES_EX_NOEDITIMAGE - The edit box and the dropdown list will not display item images    $CBES_EX_NOEDITIMAGEINDENT - The edit box and the dropdown list will not display item images    $CBES_EX_NOSIZELIMIT - Allows the ComboBoxEx control to be vertically sized smaller than its contained combo box control',
      },
    ],
  },
  _GUICtrlComboBoxEx_CreateSolidBitMap: {
    documentation: 'Creates a solid color bitmap',
    label: '_GUICtrlComboBoxEx_CreateSolidBitMap ( $hWnd, $iColor, $iWidth, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window where the bitmap will be displayed',
      },
      {
        label: '$iColor',
        documentation: 'The color of the bitmap, stated in RGB',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the bitmap',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the bitmap',
      },
    ],
  },
  _GUICtrlComboBoxEx_DeleteString: {
    documentation: 'Removes an item from a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_DeleteString ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the Item to delete',
      },
    ],
  },
  _GUICtrlComboBoxEx_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlComboBoxEx_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_EndUpdate: {
    documentation: 'Enables screen repainting that was turned off with the BeginUpdate function',
    label: '_GUICtrlComboBoxEx_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_FindStringExact: {
    documentation: 'Search for a string',
    label: '_GUICtrlComboBoxEx_FindStringExact ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
  _GUICtrlComboBoxEx_GetComboBoxInfo: {
    documentation: 'Gets information about the specified ComboBox',
    label: '_GUICtrlComboBoxEx_GetComboBoxInfo ( $hWnd, ByRef $tInfo )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tInfo',
        documentation: 'The information about the ComboBox.',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetComboControl: {
    documentation: 'Gets the handle to the child combo box control',
    label: '_GUICtrlComboBoxEx_GetComboControl ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetCount: {
    documentation: 'Retrieve the number of items',
    label: '_GUICtrlComboBoxEx_GetCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetCurSel: {
    documentation: 'Retrieve the index of the currently selected item',
    label: '_GUICtrlComboBoxEx_GetCurSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetDroppedControlRect: {
    documentation: 'Retrieve the screen coordinates of a combo box in its dropped-down state',
    label: '_GUICtrlComboBoxEx_GetDroppedControlRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetDroppedControlRectEx: {
    documentation: 'Retrieve the screen coordinates of a combo box in its dropped-down state',
    label: '_GUICtrlComboBoxEx_GetDroppedControlRectEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetDroppedState: {
    documentation: 'Determines whether the ListBox of a ComboBox is dropped down',
    label: '_GUICtrlComboBoxEx_GetDroppedState ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetDroppedWidth: {
    documentation: 'Retrieve the minimum allowable width, of the ListBox of a ComboBox',
    label: '_GUICtrlComboBoxEx_GetDroppedWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetEditControl: {
    documentation: 'Gets the handle to the edit control portion of a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_GetEditControl ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetEditSel: {
    documentation:
      'Gets the starting and ending character positions of the current selection in the edit control of a ComboBox',
    label: '_GUICtrlComboBoxEx_GetEditSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetEditText: {
    documentation: 'Get the text from the edit control of a ComboBoxEx',
    label: '_GUICtrlComboBoxEx_GetEditText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetExtendedStyle: {
    documentation: 'Gets the extended styles that are in use for a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_GetExtendedStyle ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetExtendedUI: {
    documentation:
      'Determines whether a ComboBox has the default user interface or the extended user interface',
    label: '_GUICtrlComboBoxEx_GetExtendedUI ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetImageList: {
    documentation: 'Retrieves the handle to an image list assigned to a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_GetImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItem: {
    documentation: "Retrieves an item's attributes",
    label: '_GUICtrlComboBoxEx_GetItem ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemEx: {
    documentation: "Retrieves some or all of an item's attributes",
    label: '_GUICtrlComboBoxEx_GetItemEx ( $hWnd, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tItem',
        documentation: '$tagCOMBOBOXEXITEM structure that specifies the information to retrieve',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemHeight: {
    documentation: 'Determines the height of list items or the selection field in a ComboBox',
    label: '_GUICtrlComboBoxEx_GetItemHeight ( $hWnd [, $iComponent = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iComponent',
        documentation:
          '**[optional]** Use the following values:    –1 - Get the height of the selection field     0 - Get the height of list items',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemImage: {
    documentation: "Retrieves the index of the item's icon",
    label: '_GUICtrlComboBoxEx_GetItemImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemIndent: {
    documentation: 'Retrieves the number of image widths the item is indented',
    label: '_GUICtrlComboBoxEx_GetItemIndent ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemOverlayImage: {
    documentation: "Retrieves the index of the item's overlay image icon",
    label: '_GUICtrlComboBoxEx_GetItemOverlayImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemParam: {
    documentation: 'Retrieves the application specific value of the item',
    label: '_GUICtrlComboBoxEx_GetItemParam ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemSelectedImage: {
    documentation: "Retrieves the index of the item's selected image icon",
    label: '_GUICtrlComboBoxEx_GetItemSelectedImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetItemText: {
    documentation: 'Retrieve a string from the list of a ComboBox',
    label: '_GUICtrlComboBoxEx_GetItemText ( $hWnd, $iIndex, ByRef $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
  _GUICtrlComboBoxEx_GetItemTextLen: {
    documentation: 'Gets the length, in characters, of a string in the list of a combo box',
    label: '_GUICtrlComboBoxEx_GetItemTextLen ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'index item',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetList: {
    documentation: 'Retrieves all items from the list portion of a ComboBox control',
    label: '_GUICtrlComboBoxEx_GetList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetListArray: {
    documentation: 'Retrieves all items from the list portion of a ComboBox control',
    label: '_GUICtrlComboBoxEx_GetListArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetLocale: {
    documentation: 'Retrieves the current locale',
    label: '_GUICtrlComboBoxEx_GetLocale ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetLocaleCountry: {
    documentation: 'Retrieves the current country code',
    label: '_GUICtrlComboBoxEx_GetLocaleCountry ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetLocaleLang: {
    documentation: 'Retrieves the current language identifier',
    label: '_GUICtrlComboBoxEx_GetLocaleLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetLocalePrimLang: {
    documentation: 'Extract primary language id from a language id',
    label: '_GUICtrlComboBoxEx_GetLocalePrimLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetLocaleSubLang: {
    documentation: 'Extract sublanguage id from a language id',
    label: '_GUICtrlComboBoxEx_GetLocaleSubLang ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetMinVisible: {
    documentation:
      'Retrieve the minimum number of visible items in the drop-down list of a ComboBox',
    label: '_GUICtrlComboBoxEx_GetMinVisible ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetTopIndex: {
    documentation:
      'Retrieve the 0-based index of the first visible item in the ListBox portion of a ComboBox',
    label: '_GUICtrlComboBoxEx_GetTopIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_GetUnicode: {
    documentation: 'Retrieves if control is using Unicode',
    label: '_GUICtrlComboBoxEx_GetUnicode ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_InitStorage: {
    documentation: 'Allocates memory for storing ListBox items',
    label: '_GUICtrlComboBoxEx_InitStorage ( $hWnd, $iNum, $iBytes )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
  _GUICtrlComboBoxEx_InsertString: {
    documentation: 'Inserts a new item in the control',
    label:
      '_GUICtrlComboBoxEx_InsertString ( $hWnd, $sText [, $iIndex = -1 [, $iImage = -1 [, $iSelectedImage = -1 [, $iOverlayImage = -1 [, $iIndent = -1 [, $iParam = -1]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation:
          'Item text. If set to -1, the item set is set via the $CBEN_GETDISPINFO notification message.',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index at which the new string should be inserted.To insert an item at the end of the list, set the $iIndex member to -1',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelectedImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iOverlayImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iIndent',
        documentation:
          '**[optional]** Number of image widths to indent the item. A single indentation equals the width of an image.',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Value specific to the item',
      },
    ],
  },
  _GUICtrlComboBoxEx_LimitText: {
    documentation:
      'Limits the length of the text the user may type into the edit control of a ComboBox',
    label: '_GUICtrlComboBoxEx_LimitText ( $hWnd [, $iLimit = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLimit',
        documentation: '**[optional]** Limit length of the text',
      },
    ],
  },
  _GUICtrlComboBoxEx_ReplaceEditSel: {
    documentation: 'Replace text selected in edit box',
    label: '_GUICtrlComboBoxEx_ReplaceEditSel ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String containing the replacement text',
      },
    ],
  },
  _GUICtrlComboBoxEx_ResetContent: {
    documentation: 'Removes all items',
    label: '_GUICtrlComboBoxEx_ResetContent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetCurSel: {
    documentation: 'Select a string in the list of a ComboBox',
    label: '_GUICtrlComboBoxEx_SetCurSel ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Specifies the 0-based index of the string to select',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetDroppedWidth: {
    documentation: 'Set the maximum allowable width, in pixels, of the ListBox of a ComboBox',
    label: '_GUICtrlComboBoxEx_SetDroppedWidth ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the ListBox, in pixels',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetEditSel: {
    documentation: 'Select characters in the edit control of a ComboBox',
    label: '_GUICtrlComboBoxEx_SetEditSel ( $hWnd, $iStart, $iStop )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
  _GUICtrlComboBoxEx_SetEditText: {
    documentation: 'Set the text of the edit control of the ComboBox',
    label: '_GUICtrlComboBoxEx_SetEditText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to be set',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetExtendedStyle: {
    documentation: 'Sets extended styles within a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_SetExtendedStyle ( $hWnd, $iExStyle [, $iExMask = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iExStyle',
        documentation:
          'Extended control styles:    $CBES_EX_CASESENSITIVE - Searches in the list will be case sensitive    $CBES_EX_NOEDITIMAGE - The edit box and the dropdown list will not display item images    $CBES_EX_NOEDITIMAGEINDENT - The edit box and the dropdown list will not display item images    $CBES_EX_NOSIZELIMIT - Allows the ComboBoxEx control to be vertically sized smaller than its contained combo box control',
      },
      {
        label: '$iExMask',
        documentation:
          '**[optional]** Specifies which styles in $iExStyle are to be affected.This parameter can be a combination of extended styles.Only the extended styles in $iExMask will be changed.All other styles will be maintained as they are.If this parameter is zero, all of the styles in $iExStyle will be affected.',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetExtendedUI: {
    documentation: 'Select either the default user interface or the extended user interface',
    label: '_GUICtrlComboBoxEx_SetExtendedUI ( $hWnd [, $bExtended = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bExtended',
        documentation: '**[optional]** Specifies whether the combo box uses the extended',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetImageList: {
    documentation: 'Sets an image list for a ComboBoxEx control',
    label: '_GUICtrlComboBoxEx_SetImageList ( $hWnd, $hHandle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hHandle',
        documentation: 'A handle to the image list to be set for the control',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItem: {
    documentation: "Sets some or all of a item's attributes",
    label:
      '_GUICtrlComboBoxEx_SetItem ( $hWnd, $sText [, $iIndex = 0 [, $iImage = -1 [, $iSelectedImage = -1 [, $iOverlayImage = -1 [, $iIndent = -1 [, $iParam = -1]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Item text. See remark.',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** The 0-based index of the item',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelectedImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iOverlayImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iIndent',
        documentation:
          '**[optional]** Number of image widths to indent the item. A single indentation equals the width of an image.',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Value specific to the item',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemEx: {
    documentation: "Sets some or all of a item's attributes",
    label: '_GUICtrlComboBoxEx_SetItemEx ( $hWnd, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tItem',
        documentation: '$tagCOMBOBOXEXITEM structure',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemHeight: {
    documentation: 'Set the height of list items or the selection field in a ComboBox',
    label: '_GUICtrlComboBoxEx_SetItemHeight ( $hWnd, $iComponent, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iComponent',
        documentation:
          'Use the following values:    –1 - Set the height of the selection field     0 - Set the height of list items',
      },
      {
        label: '$iHeight',
        documentation:
          'The height, in pixels, of the combo box component identified by $iComponent',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemImage: {
    documentation: "Sets the index of the item's icon in the control's image list",
    label: '_GUICtrlComboBoxEx_SetItemImage ( $hWnd, $iIndex, $iImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iImage',
        documentation: "0-based index into the control's image list",
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemIndent: {
    documentation: 'Sets the number of image widths to indent the item',
    label: '_GUICtrlComboBoxEx_SetItemIndent ( $hWnd, $iIndex, $iIndent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iIndent',
        documentation: 'Indention value',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemOverlayImage: {
    documentation: "Sets the index of the item's overlay icon in the control's image list",
    label: '_GUICtrlComboBoxEx_SetItemOverlayImage ( $hWnd, $iIndex, $iImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iImage',
        documentation: "0-based index into the control's image list",
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemParam: {
    documentation: 'Sets the value specific to the item',
    label: '_GUICtrlComboBoxEx_SetItemParam ( $hWnd, $iIndex, $iParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iParam',
        documentation: 'Item specific value',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetItemSelectedImage: {
    documentation: "Sets the index of the item's overlay icon in the control's image list",
    label: '_GUICtrlComboBoxEx_SetItemSelectedImage ( $hWnd, $iIndex, $iImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iImage',
        documentation: "0-based index into the control's image list",
      },
    ],
  },
  _GUICtrlComboBoxEx_SetMinVisible: {
    documentation: 'Set the minimum number of visible items in the drop-down list of a ComboBox',
    label: '_GUICtrlComboBoxEx_SetMinVisible ( $hWnd, $iMinimum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Specifies the minimum number of visible items',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetTopIndex: {
    documentation: 'Ensure that a particular item is visible in the ListBox of a ComboBox',
    label: '_GUICtrlComboBoxEx_SetTopIndex ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the list item',
      },
    ],
  },
  _GUICtrlComboBoxEx_SetUnicode: {
    documentation: 'Sets if control is using Unicode',
    label: '_GUICtrlComboBoxEx_SetUnicode ( $hWnd [, $bUnicode = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** May be one of the following:    True - Turn on Unicode    False - Turn off Unicode',
      },
    ],
  },
  _GUICtrlComboBoxEx_ShowDropDown: {
    documentation: 'Show or hide the ListBox of a ComboBox',
    label: '_GUICtrlComboBoxEx_ShowDropDown ( $hWnd [, $bShow = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
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
