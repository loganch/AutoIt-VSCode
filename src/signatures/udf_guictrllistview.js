import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlListView.au3>`)';

const signatures = {
  _GUICtrlListView_AddArray: {
    documentation: 'Adds items from an array to the control',
    label: '_GUICtrlListView_AddArray ( $hWnd, ByRef $aItems )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aItems',
        documentation:
          'Array with the following format:    [0][0] - Item 1 Text    [0][1] - Item 1 Subitem 1 text    [0][2] - Item 1 Subitem 2 text    [0][n] - Item 1 Subitem n text    [1][0] - Item 2 Text    [1][1] - Item 2 Subitem 1 text    [1][2] - Item 2 Subitem 2 text    [1][n] - Item 2 Subitem n text',
      },
    ],
  },
  _GUICtrlListView_AddColumn: {
    documentation: 'Adds a new column in the control',
    label:
      '_GUICtrlListView_AddColumn ( $hWnd, $sText [, $iWidth = 50 [, $iAlign = -1 [, $iImage = -1 [, $bOnRight = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Column header text',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Width of the column, in pixels',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the column header and the subitem text in the column:    0 - Text is left aligned    1 - Text is right aligned    2 - Text is centered',
      },
      {
        label: '$iImage',
        documentation: '**[optional]** 0-based index of an image within the image list',
      },
      {
        label: '$bOnRight',
        documentation: '**[optional]** If True, the column image appears to the right of text',
      },
    ],
  },
  _GUICtrlListView_AddItem: {
    documentation: 'Adds a new item to the end of the list',
    label: '_GUICtrlListView_AddItem ( $hWnd, $sText [, $iImage = -1 [, $iParam = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation:
          'Item text. If set to -1, the item set is set via the $LVN_GETDISPINFO notification message.',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application Defined data',
      },
    ],
  },
  _GUICtrlListView_AddSubItem: {
    documentation: 'Adds a new subitem to the control',
    label: '_GUICtrlListView_AddSubItem ( $hWnd, $iIndex, $sText, $iSubItem [, $iImage = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$sText',
        documentation: 'Item or subitem text',
      },
      {
        label: '$iSubItem',
        documentation: '1-based index of the subitem',
      },
      {
        label: '$iImage',
        documentation: "**[optional]** 0-based index of the icon in the control's image list",
      },
    ],
  },
  _GUICtrlListView_ApproximateViewHeight: {
    documentation: 'Calculates the approximate height required to display a given number of items',
    label:
      '_GUICtrlListView_ApproximateViewHeight ( $hWnd [, $iCount = -1 [, $iCX = -1 [, $iCY = -1]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCount',
        documentation:
          '**[optional]** Number of items to be displayed in the control. If this parameter is set to -1 the message uses the total number of items in the control.',
      },
      {
        label: '$iCX',
        documentation:
          '**[optional]** Proposed X dimension of the control, in pixels. This parameter can be set to -1 to allow the message to use the current width value.',
      },
      {
        label: '$iCY',
        documentation:
          '**[optional]** Proposed Y dimension of the control, in pixels. This parameter can be set to -1 to allow the message to use the current height value.',
      },
    ],
  },
  _GUICtrlListView_ApproximateViewRect: {
    documentation: 'Calculates the approximate size required to display a given number of items',
    label:
      '_GUICtrlListView_ApproximateViewRect ( $hWnd [, $iCount = -1 [, $iCX = -1 [, $iCY = -1]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCount',
        documentation:
          '**[optional]** Number of items to be displayed in the control.If this parameter is set to -1 the message uses the total number of items in the control.',
      },
      {
        label: '$iCX',
        documentation:
          '**[optional]** Proposed X dimension of the control, in pixels.This parameter can be set to -1 to allow the message to use the current width value.',
      },
      {
        label: '$iCY',
        documentation:
          '**[optional]** Proposed Y dimension of the control, in pixels.This parameter can be set to -1 to allow the message to use the current height value.',
      },
    ],
  },
  _GUICtrlListView_ApproximateViewWidth: {
    documentation: 'Calculates the approximate width required to display a given number of items',
    label:
      '_GUICtrlListView_ApproximateViewWidth ( $hWnd [, $iCount = -1 [, $iCX = -1 [, $iCY = -1]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCount',
        documentation:
          '**[optional]** Number of items to be displayed in the control.If this parameter is set to -1 the message uses the total number of items in the control',
      },
      {
        label: '$iCX',
        documentation:
          '**[optional]** Proposed X dimension of the control, in pixels.This parameter can be set to -1 to allow the message to use the current width value.',
      },
      {
        label: '$iCY',
        documentation:
          '**[optional]** Proposed Y dimension of the control, in pixels.This parameter can be set to -1 to allow the message to use the current height value.',
      },
    ],
  },
  _GUICtrlListView_Arrange: {
    documentation: 'Arranges items in icon view',
    label: '_GUICtrlListView_Arrange ( $hWnd [, $iArrange = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iArrange',
        documentation:
          '**[optional]** Alignment. This can be one of the following values:    0 - Aligns items according to the controls default value    1 - Aligns items along the left edge of the window    2 - Aligns items along the top edge of the window    3 - Snaps all icons to the nearest grid position.',
      },
    ],
  },
  _GUICtrlListView_BeginUpdate: {
    documentation:
      'Prevents updating of the control until the _GUICtrlListView_EndUpdate() function is called',
    label: '_GUICtrlListView_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_CancelEditLabel: {
    documentation: 'Cancels an item text editing operation',
    label: '_GUICtrlListView_CancelEditLabel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_ClickItem: {
    documentation: 'Clicks an item',
    label:
      '_GUICtrlListView_ClickItem ( $hWnd, $iIndex [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$sButton',
        documentation: '**[optional]** Button to click',
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
        documentation: '**[optional]** Delay between clicks',
      },
    ],
  },
  _GUICtrlListView_CopyItems: {
    documentation: 'Copy Items between 2 list-view controls',
    label: '_GUICtrlListView_CopyItems ( $hWnd_Source, $hWnd_Destination [, $bDelFlag = False] )',
    params: [
      {
        label: '$hWnd_Source',
        documentation: 'Control ID/Handle to the control of the source',
      },
      {
        label: '$hWnd_Destination',
        documentation: 'Control ID/Handle to the control of the destination',
      },
      {
        label: '$bDelFlag',
        documentation: '**[optional]** Delete after copying',
      },
    ],
  },
  _GUICtrlListView_Create: {
    documentation: 'Create a ListView control',
    label:
      '_GUICtrlListView_Create ( $hWnd, $sHeaderText, $iX, $iY [, $iWidth = 150 [, $iHeight = 150 [, $iStyle = 0x0000000D [, $iExStyle = 0x00000000 [, $bCoInit = False]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sHeaderText',
        documentation: 'Text to be displayed in the header. Pipe "|" delimited.',
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
          '**[optional]** Control styles:    $LVS_ALIGNLEFT - Items are left aligned in icon and small icon view    $LVS_ALIGNTOP - Items are aligned with the top of the control in icon and small icon view    $LVS_AUTOARRANGE - Icons are automatically kept arranged in icon and small icon view    $LVS_EDITLABELS - Item text can be edited in place    $LVS_ICON - This style specifies icon view    $LVS_LIST - This style specifies list view    $LVS_NOCOLUMNHEADER - Column headers are not displayed in report view    $LVS_NOLABELWRAP - Item text is displayed on a single line in icon view    $LVS_NOSCROLL - Scrolling is disabled    $LVS_NOSORTHEADER - Column headers do not work like buttons    $LVS_OWNERDATA - This style specifies a virtual control    $LVS_OWNERDRAWFIXED - The owner window can paint items in report view    $LVS_REPORT - This style specifies report view    $LVS_SHAREIMAGELISTS - The image list will not be deleted    $LVS_SHOWSELALWAYS - The selection, if any, is always shown    $LVS_SINGLESEL - Only one item at a time can be selected    $LVS_SMALLICON - This style specifies small icon view    $LVS_SORTASCENDING - Item indexes are sorted in ascending order    $LVS_SORTDESCENDING - Item indexes are sorted in descending orderDefault: $LVS_REPORT, $LVS_SINGLESEL, $LVS_SHOWSELALWAYSForced : $WS_CHILD, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Extended control styles. Can be a combination of the following:    $LVS_EX_BORDERSELECT - When an item is selected the border color of the item changes    $LVS_EX_CHECKBOXES - Enables check boxes for items in a list-view control    $LVS_EX_DOUBLEBUFFER - Paints via double-buffering, which reduces flicker    $LVS_EX_FLATSB - Enables flat scroll bars in the list view    $LVS_EX_FULLROWSELECT - When an item is selected, the item and all its subitems are highlighted    $LVS_EX_GRIDLINES - Displays gridlines around items and subitems    $LVS_EX_HEADERDRAGDROP - Enables drag-and-drop reordering of columns    $LVS_EX_INFOTIP - The $LVN_GETINFOTIP notification message is sent before displaying a ToolTip    $LVS_EX_LABELTIP - If not set, the unfolds partly hidden labels only for the large icon mode    $LVS_EX_MULTIWORKAREAS - The control will not autoarrange its icons until one or more work areas are defined    $LVS_EX_ONECLICKACTIVATE - The control sends an $LVN_ITEMACTIVATE messages when the user clicks an item    $LVS_EX_REGIONAL - Sets the control region to include only the item icons and text    $LVS_EX_SIMPLESELECT - In icon view moves the state image of the control to the top right    $LVS_EX_SUBITEMIMAGES - Allows images to be displayed for subitems    $LVS_EX_TRACKSELECT - Enables hot-track selection in the control    $LVS_EX_TWOCLICKACTIVATE - The control sends an $LVN_ITEMACTIVATE message when the user double-clicks an item    $LVS_EX_UNDERLINECOLD - Causes non-hot items that may be activated to be displayed with underlined text    $LVS_EX_UNDERLINEHOT - Causes hot items that may be activated to be displayed with underlined text',
      },
      {
        label: '$bCoInit',
        documentation: '**[optional]** Initializes the COM library for use by the calling thread.',
      },
    ],
  },
  _GUICtrlListView_CreateDragImage: {
    documentation: 'Creates a drag image list for the specified item',
    label: '_GUICtrlListView_CreateDragImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_CreateSolidBitMap: {
    documentation: 'Creates a solid color bitmap',
    label: '_GUICtrlListView_CreateSolidBitMap ( $hWnd, $iColor, $iWidth, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
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
  _GUICtrlListView_DeleteAllItems: {
    documentation: 'Removes all items from a list-view control',
    label: '_GUICtrlListView_DeleteAllItems ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_DeleteColumn: {
    documentation: 'Removes a column from a list-view control',
    label: '_GUICtrlListView_DeleteColumn ( $hWnd, $iCol )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCol',
        documentation: 'Index of the column to delete',
      },
    ],
  },
  _GUICtrlListView_DeleteItem: {
    documentation: 'Removes an item from a list-view control',
    label: '_GUICtrlListView_DeleteItem ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the list-view item to delete',
      },
    ],
  },
  _GUICtrlListView_DeleteItemsSelected: {
    documentation: 'Deletes item(s) selected',
    label: '_GUICtrlListView_DeleteItemsSelected ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_Destroy: {
    documentation: 'Delete the listview control',
    label: '_GUICtrlListView_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_DrawDragImage: {
    documentation: 'Draw the Drag Image',
    label: '_GUICtrlListView_DrawDragImage ( ByRef $hWnd, ByRef $aDrag )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aDrag',
        documentation:
          'Array with the following format:    [0] - Handle to the drag image list    [1] - X coordinate of the upper left corner of the image    [2] - Y coordinate of the upper left corner of the image',
      },
    ],
  },
  _GUICtrlListView_EditLabel: {
    documentation: 'Begins in place editing of the specified item text',
    label: '_GUICtrlListView_EditLabel ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item to edit',
      },
    ],
  },
  _GUICtrlListView_EnableGroupView: {
    documentation: 'Enables or disables whether the items in the control display as a group',
    label: '_GUICtrlListView_EnableGroupView ( $hWnd [, $bEnable = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** Indicates whether to enable group displayed itemsTrue - Enable group viewFalse - Disable group view',
      },
    ],
  },
  _GUICtrlListView_EndUpdate: {
    documentation:
      'Enables screen repainting that was turned off with the _GUICtrlListView_BeginUpdate() function',
    label: '_GUICtrlListView_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_EnsureVisible: {
    documentation: 'Ensures that a list-view item is either entirely or partially visible',
    label: '_GUICtrlListView_EnsureVisible ( $hWnd, $iIndex [, $bPartialOK = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Index of the list-view item',
      },
      {
        label: '$bPartialOK',
        documentation: '**[optional]** Value specifying whether the item must be entirely visible',
      },
    ],
  },
  _GUICtrlListView_FindInText: {
    documentation: 'Searches for an item that contains the specified text anywhere in its text',
    label:
      '_GUICtrlListView_FindInText ( $hWnd, $sText [, $iStart = -1 [, $bWrapOK = True [, $bReverse = False]]] )',
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
      {
        label: '$bReverse',
        documentation:
          '**[optional]** If True, the search will start at $iStart - 1 to Zero. If $bWrapOK = True search will continue',
      },
    ],
  },
  _GUICtrlListView_FindItem: {
    documentation: 'Searches for an item with the specified characteristics',
    label: '_GUICtrlListView_FindItem ( $hWnd, $iStart, ByRef $tFindInfo [, $sText = ""] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStart',
        documentation:
          '0-based index of the item to begin the search with or -1 to start from the beginning.The specified item is itself excluded from the search.',
      },
      {
        label: '$tFindInfo',
        documentation: '$tagLVFINDINFO structure that contains the search information.',
      },
      {
        label: '$sText',
        documentation:
          '**[optional]** String to compare with the item text.It is valid if $LVFI_STRING or $LVFI_PARTIAL is set in the Flags member.',
      },
    ],
  },
  _GUICtrlListView_FindNearest: {
    documentation: 'Finds the item nearest to the position specified',
    label:
      '_GUICtrlListView_FindNearest ( $hWnd, $iX, $iY [, $iDir = 0 [, $iStart = -1 [, $bWrapOK = True]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position',
      },
      {
        label: '$iY',
        documentation: 'Y position',
      },
      {
        label: '$iDir',
        documentation:
          '**[optional]** Specifies which direction to search:    0 - Left    1 - Right    2 - Up    3 - Down    4 - From start    5 - From end    6 - From prior item    7 - From next item',
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
  _GUICtrlListView_FindParam: {
    documentation: 'Searches for an item with the specified lParam',
    label: '_GUICtrlListView_FindParam ( $hWnd, $iParam [, $iStart = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iParam',
        documentation: 'Param value to search for',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** 0-based index of the item to begin the search with or -1 to start from the beginning.The specified item is itself excluded from the search.',
      },
    ],
  },
  _GUICtrlListView_FindText: {
    documentation: 'Searches for an item with the specified text',
    label:
      '_GUICtrlListView_FindText ( $hWnd, $sText [, $iStart = -1 [, $bPartialOK = True [, $bWrapOK = True]]] )',
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
        label: '$bPartialOK',
        documentation:
          '**[optional]** If True, a match will occur if the item text begins with the text',
      },
      {
        label: '$bWrapOK',
        documentation:
          '**[optional]** If True, the search will continue with the first item if no match is found',
      },
    ],
  },
  _GUICtrlListView_GetBkColor: {
    documentation: 'Retrieves the background color of a list-view control',
    label: '_GUICtrlListView_GetBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetBkImage: {
    documentation: 'Retrieves the background image in the control',
    label: '_GUICtrlListView_GetBkImage ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetCallbackMask: {
    documentation: 'Retrieves the callback mask for the control',
    label: '_GUICtrlListView_GetCallbackMask ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetColumn: {
    documentation: 'Retrieves the attributes of a column',
    label: '_GUICtrlListView_GetColumn ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of column',
      },
    ],
  },
  _GUICtrlListView_GetColumnCount: {
    documentation: 'Retrieve the number of columns',
    label: '_GUICtrlListView_GetColumnCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetColumnOrder: {
    documentation: 'Retrieves the current left-to-right order of columns',
    label: '_GUICtrlListView_GetColumnOrder ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetColumnOrderArray: {
    documentation: 'Retrieves the current left-to-right order of columns in the control',
    label: '_GUICtrlListView_GetColumnOrderArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetColumnWidth: {
    documentation: 'Retrieves the width of a column in report or list view',
    label: '_GUICtrlListView_GetColumnWidth ( $hWnd, $iCol )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCol',
        documentation: 'The index of the column. This parameter is ignored in list view.',
      },
    ],
  },
  _GUICtrlListView_GetCounterPage: {
    documentation: 'Calculates the number of items that can fit vertically in the visible area',
    label: '_GUICtrlListView_GetCounterPage ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetEditControl: {
    documentation: "Retrieves the handle to the edit control being used to edit an item's text",
    label: '_GUICtrlListView_GetEditControl ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetExtendedListViewStyle: {
    documentation: 'Retrieves the extended styles that are currently in use',
    label: '_GUICtrlListView_GetExtendedListViewStyle ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetFocusedGroup: {
    documentation: 'Gets the group that has the focus',
    label: '_GUICtrlListView_GetFocusedGroup ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetGroupCount: {
    documentation: 'Gets the number of groups',
    label: '_GUICtrlListView_GetGroupCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetGroupInfo: {
    documentation: 'Retrieves group information',
    label: '_GUICtrlListView_GetGroupInfo ( $hWnd, $iGroupID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iGroupID',
        documentation: 'ID that specifies the group whose information is retrieved',
      },
    ],
  },
  _GUICtrlListView_GetGroupInfoByIndex: {
    documentation: 'Retrieves group information',
    label: '_GUICtrlListView_GetGroupInfoByIndex ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index that specifies the group whose information is retrieved',
      },
    ],
  },
  _GUICtrlListView_GetGroupRect: {
    documentation: 'Gets the rectangle for a specified group',
    label: '_GUICtrlListView_GetGroupRect ( $hWnd, $iGroupID [, $iGet = $LVGGR_GROUP] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iGroupID',
        documentation: 'ID that specifies the group whose information is retrieved',
      },
      {
        label: '$iGet',
        documentation:
          '**[optional]** Flag to specify the coordinates of the rectangle to get, can be one of the following:    $LVGGR_GROUP - Coordinates of the entire expanded group    $LVGGR_HEADER - Coordinates of the header only (collapsed group)    $LVGGR_LABEL - Coordinates of the label only    $LVGGR_SUBSETLINK - Coordinates of the subset link only (markup subset)',
      },
    ],
  },
  _GUICtrlListView_GetGroupViewEnabled: {
    documentation: 'Checks whether the control has group view enabled',
    label: '_GUICtrlListView_GetGroupViewEnabled ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetHeader: {
    documentation: 'Retrieves the handle to the header control',
    label: '_GUICtrlListView_GetHeader ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetHotCursor: {
    documentation:
      'Retrieves the HCURSOR value used when the pointer is over an item while hot tracking is enabled',
    label: '_GUICtrlListView_GetHotCursor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetHotItem: {
    documentation: 'Retrieves the index of the hot item',
    label: '_GUICtrlListView_GetHotItem ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetHoverTime: {
    documentation:
      'Retrieves the amount of time that the mouse cursor must hover over an item before it is selected',
    label: '_GUICtrlListView_GetHoverTime ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetImageList: {
    documentation: 'Retrieves the handle to an image list used for drawing listview items',
    label: '_GUICtrlListView_GetImageList ( $hWnd, $iImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iImageList',
        documentation:
          'Image list to retrieve:0 - Image list with large icons1 - Image list with small icons2 - Image list with state images',
      },
    ],
  },
  _GUICtrlListView_GetISearchString: {
    documentation: 'Retrieves the incremental search string of the control',
    label: '_GUICtrlListView_GetISearchString ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetItem: {
    documentation: "Retrieves an item's attributes",
    label: '_GUICtrlListView_GetItem ( $hWnd, $iIndex [, $iSubItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** 1-based subitem index',
      },
    ],
  },
  _GUICtrlListView_GetItemChecked: {
    documentation: 'Returns the check state for a list-view control item',
    label: '_GUICtrlListView_GetItemChecked ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index to retrieve item check state from',
      },
    ],
  },
  _GUICtrlListView_GetItemCount: {
    documentation: 'Retrieves the number of items in a list-view control',
    label: '_GUICtrlListView_GetItemCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetItemCut: {
    documentation: 'Determines whether the item is marked for a cut and paste operation',
    label: '_GUICtrlListView_GetItemCut ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemDropHilited: {
    documentation: 'Determines whether the item is highlighted as a drag-and-drop target',
    label: '_GUICtrlListView_GetItemDropHilited ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemEx: {
    documentation: "Retrieves some or all of an item's attributes",
    label: '_GUICtrlListView_GetItemEx ( $hWnd, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$tItem',
        documentation: '$tagLVITEM structure that specifies the information to retrieve',
      },
    ],
  },
  _GUICtrlListView_GetItemFocused: {
    documentation: 'Determines whether the item is highlighted as a drag-and-drop target',
    label: '_GUICtrlListView_GetItemFocused ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemGroupID: {
    documentation: 'Gets the item group ID',
    label: '_GUICtrlListView_GetItemGroupID ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemImage: {
    documentation: "Retrieves the index of the item's icon",
    label: '_GUICtrlListView_GetItemImage ( $hWnd, $iIndex [, $iSubItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** 1-based item sub item index',
      },
    ],
  },
  _GUICtrlListView_GetItemIndent: {
    documentation: 'Retrieves the number of image widths the item is indented',
    label: '_GUICtrlListView_GetItemIndent ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlListView_GetItemParam: {
    documentation: 'Retrieves the application specific value of the item',
    label: '_GUICtrlListView_GetItemParam ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
    ],
  },
  _GUICtrlListView_GetItemPosition: {
    documentation: 'Retrieves the position of an item',
    label: '_GUICtrlListView_GetItemPosition ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemPositionX: {
    documentation: 'Retrieves the X position of an item',
    label: '_GUICtrlListView_GetItemPositionX ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemPositionY: {
    documentation: 'Retrieves the Y position of an item',
    label: '_GUICtrlListView_GetItemPositionY ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemRect: {
    documentation: 'Retrieves the bounding rectangle for all or part of an item',
    label: '_GUICtrlListView_GetItemRect ( $hWnd, $iIndex [, $iPart = 3] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iPart',
        documentation:
          '**[optional]** The portion of the item to retrieve:    0 - The bounding rectangle of the entire item    1 - The bounding rectangle of the icon or small icon    2 - The bounding rectangle of the item text    3 - The union of 1 and 2, but excludes columns in report view',
      },
    ],
  },
  _GUICtrlListView_GetItemRectEx: {
    documentation: 'Retrieves the bounding rectangle for all or part of an item',
    label: '_GUICtrlListView_GetItemRectEx ( $hWnd, $iIndex [, $iPart = 3] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iPart',
        documentation:
          '**[optional]** The portion of the item to retrieve:    $LVIR_BOUNDS - Returns the bounding rectangle of the entire item, including the icon and label    $LVIR_ICON - Returns the bounding rectangle of the icon or small icon    $LVIR_LABEL - Returns the bounding rectangle of the item text    $LVIR_SELECTBOUNDS - Returns the union of the $LVIR_ICON and $LVIR_LABEL rectangles, but excludes columns in report view.',
      },
    ],
  },
  _GUICtrlListView_GetItemSelected: {
    documentation: 'Determines whether the item is selected',
    label: '_GUICtrlListView_GetItemSelected ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemSpacing: {
    documentation: 'Determines the spacing between items in the control',
    label: '_GUICtrlListView_GetItemSpacing ( $hWnd [, $bSmall = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** View for which to retrieve the item spacing:    True - Small icon view    False - Icon view',
      },
    ],
  },
  _GUICtrlListView_GetItemSpacingX: {
    documentation: 'Determines the horizontal spacing between items in the control',
    label: '_GUICtrlListView_GetItemSpacingX ( $hWnd [, $bSmall = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** View for which to retrieve the item spacing:    True - Small icon view    False - Icon view',
      },
    ],
  },
  _GUICtrlListView_GetItemSpacingY: {
    documentation: 'Determines the vertical spacing between items in the control',
    label: '_GUICtrlListView_GetItemSpacingY ( $hWnd [, $bSmall = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** View for which to retrieve the item spacing:    True - Small icon view    False - Icon view',
      },
    ],
  },
  _GUICtrlListView_GetItemState: {
    documentation: 'Retrieves the state of a listview item',
    label: '_GUICtrlListView_GetItemState ( $hWnd, $iIndex, $iMask )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iMask',
        documentation:
          "State information to retrieve. This can be a combination of:    $LVIS_CUT - The item is marked for a cut-and-paste operation    $LVIS_DROPHILITED - The item is highlighted as a drag-and-drop target    $LVIS_FOCUSED - The item has the focus, so it is surrounded by a standard focus rectangle    $LVIS_SELECTED - The item is selected    $LVIS_OVERLAYMASK - Use this mask to retrieve the item's overlay image index    $LVIS_STATEIMAGEMASK - Use this mask to retrieve the item's state image index",
      },
    ],
  },
  _GUICtrlListView_GetItemStateImage: {
    documentation: 'Gets the state image that is displayed',
    label: '_GUICtrlListView_GetItemStateImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
    ],
  },
  _GUICtrlListView_GetItemText: {
    documentation: 'Retrieves the text of an item or subitem',
    label: '_GUICtrlListView_GetItemText ( $hWnd, $iIndex [, $iSubItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** 1-based sub item index',
      },
    ],
  },
  _GUICtrlListView_GetItemTextArray: {
    documentation: 'Retrieves all of a list-view item',
    label: '_GUICtrlListView_GetItemTextArray ( $hWnd [, $iItem = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iItem',
        documentation: '**[optional]** 0-based index of item to retrieve',
      },
    ],
  },
  _GUICtrlListView_GetItemTextString: {
    documentation: 'Retrieves all of a list-view item',
    label: '_GUICtrlListView_GetItemTextString ( $hWnd [, $iItem = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iItem',
        documentation: '**[optional]** 0-based index of item to retrieve',
      },
    ],
  },
  _GUICtrlListView_GetNextItem: {
    documentation: 'Searches for an item that has the specified properties',
    label:
      '_GUICtrlListView_GetNextItem ( $hWnd [, $iStart = -1 [, $iSearch = 0 [, $iState = 8]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** Index of the item to begin the search with, or -1 to find the first item that matches the specified flags.The specified item itself is excluded from the search.',
      },
      {
        label: '$iSearch',
        documentation:
          '**[optional]** Relationship to the index of the item where the search is to begin:    0 - Searches for a subsequent item by index    1 - Searches for an item that is above the specified item    2 - Searches for an item that is below the specified item    3 - Searches for an item to the left of the specified item    4 - Searches for an item to the right of the specified item',
      },
      {
        label: '$iState',
        documentation:
          '**[optional]** State of the item to find. Can be a combination of:    1 - The item is cut    2 - The item is highlighted    4 - The item is focused    8 - The item is selected',
      },
    ],
  },
  _GUICtrlListView_GetNumberOfWorkAreas: {
    documentation: 'Retrieves the number of working areas in the control',
    label: '_GUICtrlListView_GetNumberOfWorkAreas ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetOrigin: {
    documentation: 'Retrieves the current view origin for the control',
    label: '_GUICtrlListView_GetOrigin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetOriginX: {
    documentation: 'Retrieves the current horizontal view origin for the control',
    label: '_GUICtrlListView_GetOriginX ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetOriginY: {
    documentation: 'Retrieves the current vertical view origin for the control',
    label: '_GUICtrlListView_GetOriginY ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetOutlineColor: {
    documentation: 'Retrieves the color of the border of the control',
    label: '_GUICtrlListView_GetOutlineColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetSelectedColumn: {
    documentation: 'Retrieves the index of the selected column',
    label: '_GUICtrlListView_GetSelectedColumn ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetSelectedCount: {
    documentation: 'Determines the number of selected items',
    label: '_GUICtrlListView_GetSelectedCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetSelectedIndices: {
    documentation: 'Retrieve indices of selected item(s)',
    label: '_GUICtrlListView_GetSelectedIndices ( $hWnd [, $bArray = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bArray',
        documentation:
          '**[optional]** Return string or Array    True - Returns array    False - Returns pipe "|" delimited string',
      },
    ],
  },
  _GUICtrlListView_GetSelectionMark: {
    documentation: 'Retrieves the selection mark from the control',
    label: '_GUICtrlListView_GetSelectionMark ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetStringWidth: {
    documentation: 'Determines the width of a specified string',
    label: '_GUICtrlListView_GetStringWidth ( $hWnd, $sString )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sString',
        documentation: 'String for which the width will be calculated',
      },
    ],
  },
  _GUICtrlListView_GetSubItemRect: {
    documentation: 'Retrieves information about an item bounding rectangle',
    label: '_GUICtrlListView_GetSubItemRect ( $hWnd, $iIndex, $iSubItem [, $iPart = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: "0-based index of the subitem's parent item",
      },
      {
        label: '$iSubItem',
        documentation: '1-based index of the subitem',
      },
      {
        label: '$iPart',
        documentation:
          '**[optional]** The portion of the subitem item to retrieve:    0 - The rectangle of the entire subitem, including the icon and label    1 - The rectangle of the icon or small icon',
      },
    ],
  },
  _GUICtrlListView_GetTextBkColor: {
    documentation: 'Retrieves the text background color of the control',
    label: '_GUICtrlListView_GetTextBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetTextColor: {
    documentation: 'Retrieves the text color of the control',
    label: '_GUICtrlListView_GetTextColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetToolTips: {
    documentation: 'Retrieves the ToolTip control handle',
    label: '_GUICtrlListView_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetTopIndex: {
    documentation: 'Retrieves the index of the topmost visible item when in list or report view',
    label: '_GUICtrlListView_GetTopIndex ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlListView_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetView: {
    documentation: 'Retrieves the current view of the control',
    label: '_GUICtrlListView_GetView ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewDetails: {
    documentation: 'Determines whether the view mode is in detail mode',
    label: '_GUICtrlListView_GetViewDetails ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewLarge: {
    documentation: 'Determines whether the view mode is in large icon mode',
    label: '_GUICtrlListView_GetViewLarge ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewList: {
    documentation: 'Determines whether the view mode is in list mode',
    label: '_GUICtrlListView_GetViewList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewRect: {
    documentation: 'Retrieves the bounding rectangle of all items in the control',
    label: '_GUICtrlListView_GetViewRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewSmall: {
    documentation: 'Determines whether the view mode is in small icon mode',
    label: '_GUICtrlListView_GetViewSmall ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_GetViewTile: {
    documentation: 'Determines whether the view mode is in tile mode',
    label: '_GUICtrlListView_GetViewTile ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_HideColumn: {
    documentation: 'Hides the column "sets column width to zero"',
    label: '_GUICtrlListView_HideColumn ( $hWnd, $iCol )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCol',
        documentation: 'Column to hide',
      },
    ],
  },
  _GUICtrlListView_HitTest: {
    documentation: 'Determines which item is at a specified position',
    label: '_GUICtrlListView_HitTest ( $hWnd [, $iX = -1 [, $iY = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation:
          '**[optional]** X position, in client coordinates, to be tested or -1 to use the current mouse position',
      },
      {
        label: '$iY',
        documentation:
          '**[optional]** Y position, in client coordinates, to be tested or -1 to use the current mouse position',
      },
    ],
  },
  _GUICtrlListView_InsertColumn: {
    documentation: 'Inserts a new column in the control',
    label:
      '_GUICtrlListView_InsertColumn ( $hWnd, $iIndex, $sText [, $iWidth = 50 [, $iAlign = -1 [, $iImage = -1 [, $bOnRight = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of new column',
      },
      {
        label: '$sText',
        documentation: 'Column header text',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Width of the column, in pixels',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the column header and the subitem text in the column:    0 - Text is left aligned    1 - Text is right aligned    2 - Text is centered',
      },
      {
        label: '$iImage',
        documentation: '**[optional]** 0-based index of an image within the image list',
      },
      {
        label: '$bOnRight',
        documentation: '**[optional]** If True, the column image appears to the right of text',
      },
    ],
  },
  _GUICtrlListView_InsertGroup: {
    documentation: 'Inserts a group',
    label: '_GUICtrlListView_InsertGroup ( $hWnd, $iIndex, $iGroupID, $sHeader [, $iAlign = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Index where the group is to be added. If this is -1, the group is added at the end of the list.',
      },
      {
        label: '$iGroupID',
        documentation: 'ID of the group',
      },
      {
        label: '$sHeader',
        documentation: 'Header text',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the header text for the group:    0 - Left    1 - Center    2 - Right',
      },
    ],
  },
  _GUICtrlListView_InsertItem: {
    documentation: 'Inserts a new item in the control',
    label:
      '_GUICtrlListView_InsertItem ( $hWnd, $sText [, $iIndex = -1 [, $iImage = -1 [, $iParam = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation:
          'Item text. If set to -1, the item text is set via the $LVN_GETDISPINFO notification message.',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index at which the new item should be inserted.If this value is greater than the number of items currently contained by the control, the new item will be appended to the end of the list and assigned the correct index.',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application Defined Data',
      },
    ],
  },
  _GUICtrlListView_JustifyColumn: {
    documentation: 'Set Justification of a column for a list-view control',
    label: '_GUICtrlListView_JustifyColumn ( $hWnd, $iIndex [, $iAlign = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of new column',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the column header and the subitem text in the column:    0 - Text is left aligned    1 - Text is right aligned    2 - Text is centered',
      },
    ],
  },
  _GUICtrlListView_MapIDToIndex: {
    documentation: 'Maps the ID of an item to an index',
    label: '_GUICtrlListView_MapIDToIndex ( $hWnd, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iID',
        documentation: 'ID of an item',
      },
    ],
  },
  _GUICtrlListView_MapIndexToID: {
    documentation: 'Maps an index to an item ID',
    label: '_GUICtrlListView_MapIndexToID ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of an item',
      },
    ],
  },
  _GUICtrlListView_RedrawItems: {
    documentation: 'Forces the control to redraw a range of items',
    label: '_GUICtrlListView_RedrawItems ( $hWnd, $iFirst, $iLast )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFirst',
        documentation: '0-based index of the first item to redraw',
      },
      {
        label: '$iLast',
        documentation: '0-based index of the last item to redraw',
      },
    ],
  },
  _GUICtrlListView_RegisterSortCallBack: {
    documentation: 'Register the Simple Sort callback function',
    label:
      '_GUICtrlListView_RegisterSortCallBack ( $hWnd [, $bNumbers = True [, $bArrows = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the control',
      },
      {
        label: '$bNumbers',
        documentation: '**[optional]** Treat number strings as numbers',
      },
      {
        label: '$bArrows',
        documentation: '**[optional]** Draws a down-arrow/up-arrow on column selected',
      },
    ],
  },
  _GUICtrlListView_RemoveAllGroups: {
    documentation: 'Removes all groups from the control',
    label: '_GUICtrlListView_RemoveAllGroups ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlListView_RemoveGroup: {
    documentation: 'Removes a group from the control',
    label: '_GUICtrlListView_RemoveGroup ( $hWnd, $iGroupID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iGroupID',
        documentation: 'ID that specifies the group to remove',
      },
    ],
  },
  _GUICtrlListView_Scroll: {
    documentation: 'Scrolls the content of a list-view',
    label: '_GUICtrlListView_Scroll ( $hWnd, $iDX, $iDY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iDX',
        documentation:
          'Value of type int that specifies the amount of horizontal scrolling in pixels.If the list-view control is in list-view, this value specifies the number of columns to scroll.',
      },
      {
        label: '$iDY',
        documentation:
          'Value of type int that specifies the amount of vertical scrolling in pixels',
      },
    ],
  },
  _GUICtrlListView_SetBkColor: {
    documentation: 'Sets the background color of the control',
    label: '_GUICtrlListView_SetBkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Background color to set or CLR_NONE value for no background color',
      },
    ],
  },
  _GUICtrlListView_SetBkImage: {
    documentation: 'Sets the background image in the control',
    label:
      '_GUICtrlListView_SetBkImage ( $hWnd [, $sURL = "" [, $iStyle = 0 [, $iXOffset = 0 [, $iYOffset = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sURL',
        documentation:
          '**[optional]** URL of the background image. If blank, the control has no background',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Determines the background image style:    0 - Normal    1 - Tiled',
      },
      {
        label: '$iXOffset',
        documentation:
          "**[optional]** Percentage of the control's client area that the image should be offset horizontally.Only valid when 0 is used in $iStyle.",
      },
      {
        label: '$iYOffset',
        documentation:
          "**[optional]** Percentage of the control's client area that the image should be offset vertically.Only valid when 0 is used in $iStyle.",
      },
    ],
  },
  _GUICtrlListView_SetCallBackMask: {
    documentation: 'Changes the callback mask for the control',
    label: '_GUICtrlListView_SetCallBackMask ( $hWnd, $iMask )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMask',
        documentation:
          'Value of the callback mask.The bits of the mask indicate the item states or images for which the application stores the current state data.This value can be any combination of the following:    1 - The item is marked for a cut-and-paste operation    2 - The item is highlighted as a drag-and-drop target    4 - The item has the focus    8 - The item is selected    16 - The application stores the image list index of the current overlay image    32 - The application stores the image list index of the current state image',
      },
    ],
  },
  _GUICtrlListView_SetColumn: {
    documentation: 'Sets the attributes of a column',
    label:
      '_GUICtrlListView_SetColumn ( $hWnd, $iIndex, $sText [, $iWidth = -1 [, $iAlign = -1 [, $iImage = -1 [, $bOnRight = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of new column',
      },
      {
        label: '$sText',
        documentation: 'Column header text',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Width of the column, in pixels',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the column header and the subitem text in the column:    0 - Text is left aligned    1 - Text is right aligned    2 - Text is centered',
      },
      {
        label: '$iImage',
        documentation: '**[optional]** 0-based index of an image within the image list',
      },
      {
        label: '$bOnRight',
        documentation: '**[optional]** If True, the column image appears to the right of text',
      },
    ],
  },
  _GUICtrlListView_SetColumnOrder: {
    documentation: 'Sets the left-to-right order of columns',
    label: '_GUICtrlListView_SetColumnOrder ( $hWnd, $sOrder )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sOrder',
        documentation:
          'Use Opt(\'GUIDataSeparatorChar\', param) to set Separator Char, delimited column order, must be formated as follows:    "2|0|3|1"',
      },
    ],
  },
  _GUICtrlListView_SetColumnOrderArray: {
    documentation: 'Sets the left-to-right order of columns in the control',
    label: '_GUICtrlListView_SetColumnOrderArray ( $hWnd, $aOrder )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aOrder',
        documentation:
          'Array of integers that holds the index values of the columns in the control.The array must be formatted as follows:    [0] - Number of items in array    [1] - First column index    [2] - Second column index    [n] - Last column index',
      },
    ],
  },
  _GUICtrlListView_SetColumnWidth: {
    documentation: 'Changes the width of a column',
    label: '_GUICtrlListView_SetColumnWidth ( $hWnd, $iCol, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCol',
        documentation:
          '0-based index of a valid column. For list-view mode, this parameter must be set to zero',
      },
      {
        label: '$iWidth',
        documentation:
          'New width of the column, in pixels.For report-view mode, the following special values are supported:    $LVSCW_AUTOSIZE - Automatically sizes the column.    $LVSCW_AUTOSIZE_USEHEADER - Automatically sizes the column to fit the header text.If you use this value with the last column, its width is set to fill the remaining width of the list-view control.',
      },
    ],
  },
  _GUICtrlListView_SetExtendedListViewStyle: {
    documentation: 'Sets extended styles',
    label: '_GUICtrlListView_SetExtendedListViewStyle ( $hWnd, $iExStyle [, $iExMask = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iExStyle',
        documentation:
          'Extended control styles:    $LVS_EX_BORDERSELECT - When an item is selected the border color of the item changes    $LVS_EX_CHECKBOXES - Enables check boxes for items in a list-view control    $LVS_EX_DOUBLEBUFFER - Paints via double-buffering, which reduces flicker    $LVS_EX_FLATSB - Enables flat scroll bars in the list view    $LVS_EX_FULLROWSELECT - When an item is selected, the item and all its subitems are highlighted    $LVS_EX_GRIDLINES - Displays gridlines around items and subitems    $LVS_EX_HEADERDRAGDROP - Enables drag-and-drop reordering of columns    $LVS_EX_INFOTIP - The $LVN_GETINFOTIP notification message is sent before displaying a ToolTip    $LVS_EX_LABELTIP - If not set, the unfolds partly hidden labels only for the large icon mode    $LVS_EX_MULTIWORKAREAS - The control will not autoarrange its icons until one or more work areas are defined    $LVS_EX_ONECLICKACTIVATE - The control sends an $LVN_ITEMACTIVATE messages when the user clicks an item    $LVS_EX_REGIONAL - Sets the control region to include only the item icons and text    $LVS_EX_SIMPLESELECT - In icon view moves the state image of the control to the top right    $LVS_EX_SUBITEMIMAGES - Allows images to be displayed for subitems    $LVS_EX_TRACKSELECT - Enables hot-track selection in the control    $LVS_EX_TWOCLICKACTIVATE - The control sends an $LVN_ITEMACTIVATE message when the user double-clicks an item    $LVS_EX_UNDERLINECOLD - Causes non-hot items that may be activated to be displayed with underlined text    $LVS_EX_UNDERLINEHOT - Causes hot items that may be activated to be displayed with underlined text',
      },
      {
        label: '$iExMask',
        documentation:
          '**[optional]** Specifies which styles in $iExStyle are to be affected.This parameter can be a combination of extended styles. Only the extended styles in $iExMask will be changed.All other styles will be maintained as they are.If this parameter is zero, all of the styles in $iExStyle will be affected.',
      },
    ],
  },
  _GUICtrlListView_SetGroupInfo: {
    documentation: 'Sets group information',
    label:
      '_GUICtrlListView_SetGroupInfo ( $hWnd, $iGroupID, $sHeader [, $iAlign = 0 [, $iState = $LVGS_NORMAL]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iGroupID',
        documentation: 'ID of the group',
      },
      {
        label: '$sHeader',
        documentation: 'Header text',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Alignment of the header text for the group:    0 - Left    1 - Center    2 - Right',
      },
      {
        label: '$iState',
        documentation:
          '**[optional]** Windows Vista or later can have one of the following values:    $LVGS_NORMAL - Groups are expanded, the group name is displayed, and all items in the group are displayed.    $LVGS_COLLAPSED - The group is collapsed.    $LVGS_HIDDEN - The group is hidden.    $LVGS_NOHEADER - The group does not display a header.    $LVGS_COLLAPSIBLE - The group can be collapsed.    $LVGS_FOCUSED - The group has keyboard focus.    $LVGS_SELECTED - The group is selected.    $LVGS_SUBSETED - The group displays only a portion of its items.    $LVGS_SUBSETLINKFOCUSED - The subset link of the group has keyboard focus',
      },
    ],
  },
  _GUICtrlListView_SetHotItem: {
    documentation: 'Sets the hot item',
    label: '_GUICtrlListView_SetHotItem ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item to be set as the hot item',
      },
    ],
  },
  _GUICtrlListView_SetHoverTime: {
    documentation:
      'Sets the amount of time which the mouse cursor must hover over an item before it is selected',
    label: '_GUICtrlListView_SetHoverTime ( $hWnd, $iTime )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iTime',
        documentation:
          'The new amount of time, in milliseconds, that the mouse cursor must hover over an item before it is selected.If this value is (DWORD)-1, then the hover time is set to the default hover time.',
      },
    ],
  },
  _GUICtrlListView_SetIconSpacing: {
    documentation: 'Sets the spacing between icons where the style is large icon',
    label: '_GUICtrlListView_SetIconSpacing ( $hWnd, $iCX, $iCY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCX',
        documentation: 'Distance, in pixels, to set between icons on the x-axis',
      },
      {
        label: '$iCY',
        documentation: 'Distance, in pixels, to set between icons on the y-axis',
      },
    ],
  },
  _GUICtrlListView_SetImageList: {
    documentation: 'Assigns an image list to the control',
    label: '_GUICtrlListView_SetImageList ( $hWnd, $hHandle [, $iType = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hHandle',
        documentation: 'Handle to the image list to assign',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** Type of image list:    0 - Image list with large icons    1 - Image list with small icons    2 - Image list with state images',
      },
    ],
  },
  _GUICtrlListView_SetItem: {
    documentation: "Sets some or all of a item's attributes",
    label:
      '_GUICtrlListView_SetItem ( $hWnd, $sText [, $iIndex = 0 [, $iSubItem = 0 [, $iImage = -1 [, $iParam = -1 [, $iIndent = -1]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
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
        label: '$iSubItem',
        documentation:
          '**[optional]** 1-based index of the subitem or zero if this refers to an item',
      },
      {
        label: '$iImage',
        documentation: "**[optional]** 0-base index of the item's icon in the control's image list",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Value specific to the item',
      },
      {
        label: '$iIndent',
        documentation:
          '**[optional]** Number of image widths to indent the item. A single indentation equals the width of an image.',
      },
    ],
  },
  _GUICtrlListView_SetItemChecked: {
    documentation: 'Sets the checked state',
    label: '_GUICtrlListView_SetItemChecked ( $hWnd, $iIndex [, $bCheck = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item, -1 sets all items',
      },
      {
        label: '$bCheck',
        documentation:
          '**[optional]** Value to set checked state to:    True - Checked    False - Not checked',
      },
    ],
  },
  _GUICtrlListView_SetItemCount: {
    documentation:
      'Causes the list-view control to allocate memory for the specified number of items',
    label: '_GUICtrlListView_SetItemCount ( $hWnd, $iItems )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iItems',
        documentation: 'Number of items that the list-view control will ultimately contain',
      },
    ],
  },
  _GUICtrlListView_SetItemCut: {
    documentation: 'Sets whether the item is marked for a cut-and-paste operation',
    label: '_GUICtrlListView_SetItemCut ( $hWnd, $iIndex [, $bEnabled = True] )',
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
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set.',
      },
    ],
  },
  _GUICtrlListView_SetItemDropHilited: {
    documentation: 'Sets whether the item is highlighted as a drag-and-drop target',
    label: '_GUICtrlListView_SetItemDropHilited ( $hWnd, $iIndex [, $bEnabled = True] )',
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
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set.',
      },
    ],
  },
  _GUICtrlListView_SetItemEx: {
    documentation: "Sets some or all of a item's attributes",
    label: '_GUICtrlListView_SetItemEx ( $hWnd, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$tItem',
        documentation: '$tagLVITEM structure',
      },
    ],
  },
  _GUICtrlListView_SetItemFocused: {
    documentation: 'Sets whether the item has the focus',
    label: '_GUICtrlListView_SetItemFocused ( $hWnd, $iIndex [, $bEnabled = True] )',
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
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set.',
      },
    ],
  },
  _GUICtrlListView_SetItemGroupID: {
    documentation: 'Sets the item group ID',
    label: '_GUICtrlListView_SetItemGroupID ( $hWnd, $iIndex, $iGroupID )',
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
        label: '$iGroupID',
        documentation: 'Group ID',
      },
    ],
  },
  _GUICtrlListView_SetItemImage: {
    documentation: "Sets the index of the item's icon in the control's image list",
    label: '_GUICtrlListView_SetItemImage ( $hWnd, $iIndex, $iImage [, $iSubItem = 0] )',
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
      {
        label: '$iSubItem',
        documentation: '**[optional]** 1-based index of the subitem',
      },
    ],
  },
  _GUICtrlListView_SetItemIndent: {
    documentation: 'Sets the number of image widths to indent the item',
    label: '_GUICtrlListView_SetItemIndent ( $hWnd, $iIndex, $iIndent )',
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
  _GUICtrlListView_SetItemParam: {
    documentation: 'Sets the value specific to the item',
    label: '_GUICtrlListView_SetItemParam ( $hWnd, $iIndex, $iParam )',
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
        documentation: 'A value to associate with the item',
      },
    ],
  },
  _GUICtrlListView_SetItemPosition: {
    documentation: 'Moves an item to a specified position in the control',
    label: '_GUICtrlListView_SetItemPosition ( $hWnd, $iIndex, $iCX, $iCY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iCX',
        documentation: "New x-position of the item's upper-left corner, in view coordinates",
      },
      {
        label: '$iCY',
        documentation: "New y-position of the item's upper-left corner, in view coordinates",
      },
    ],
  },
  _GUICtrlListView_SetItemPosition32: {
    documentation: 'Moves an item to a specified position in the control',
    label: '_GUICtrlListView_SetItemPosition32 ( $hWnd, $iIndex, $iCX, $iCY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iCX',
        documentation: "New x-position of the item's upper-left corner, in view coordinates",
      },
      {
        label: '$iCY',
        documentation: "New y-position of the item's upper-left corner, in view coordinates",
      },
    ],
  },
  _GUICtrlListView_SetItemSelected: {
    documentation: 'Sets whether the item is selected',
    label:
      '_GUICtrlListView_SetItemSelected ( $hWnd, $iIndex [, $bSelected = True [, $bFocused = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item, -1 to set selected state of all items',
      },
      {
        label: '$bSelected',
        documentation: '**[optional]** If True the item(s) are selected, otherwise not.',
      },
      {
        label: '$bFocused',
        documentation: '**[optional]** If True the item has focus, otherwise not.',
      },
    ],
  },
  _GUICtrlListView_SetItemState: {
    documentation: 'Changes the state of an item in the control',
    label: '_GUICtrlListView_SetItemState ( $hWnd, $iIndex, $iState, $iStateMask )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iState',
        documentation: 'Item state to be changed',
      },
      {
        label: '$iStateMask',
        documentation: 'Bits that determine whether state is active or inactive',
      },
    ],
  },
  _GUICtrlListView_SetItemStateImage: {
    documentation: 'Sets the state image that is displayed',
    label: '_GUICtrlListView_SetItemStateImage ( $hWnd, $iIndex, $iImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$iImage',
        documentation: '1-based overlay image index',
      },
    ],
  },
  _GUICtrlListView_SetItemText: {
    documentation: 'Changes the text of an item or subitem',
    label: '_GUICtrlListView_SetItemText ( $hWnd, $iIndex, $sText [, $iSubItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the item',
      },
      {
        label: '$sText',
        documentation: 'Item or subitem text',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** 1-based index of the subitem or 0 to set the item',
      },
    ],
  },
  _GUICtrlListView_SetOutlineColor: {
    documentation: 'Sets the color of the border',
    label: '_GUICtrlListView_SetOutlineColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Color to set the border',
      },
    ],
  },
  _GUICtrlListView_SetSelectedColumn: {
    documentation: 'Sets the index of the selected column',
    label: '_GUICtrlListView_SetSelectedColumn ( $hWnd, $iCol )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iCol',
        documentation: 'Specifies the column index',
      },
    ],
  },
  _GUICtrlListView_SetSelectionMark: {
    documentation: 'Sets the selection mark in the control',
    label: '_GUICtrlListView_SetSelectionMark ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '0-based index of the new selection mark. If -1, the selection mark is removed.',
      },
    ],
  },
  _GUICtrlListView_SetTextBkColor: {
    documentation: 'Sets the background color of text in the control',
    label: '_GUICtrlListView_SetTextBkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Text color',
      },
    ],
  },
  _GUICtrlListView_SetTextColor: {
    documentation: 'Sets the color of text in the control',
    label: '_GUICtrlListView_SetTextColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Text color',
      },
    ],
  },
  _GUICtrlListView_SetToolTips: {
    documentation: 'Sets the ToolTip control that the control will use to display ToolTips',
    label: '_GUICtrlListView_SetToolTips ( $hWnd, $hToolTip )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hToolTip',
        documentation: 'Handle to the ToolTip control to be set',
      },
    ],
  },
  _GUICtrlListView_SetUnicodeFormat: {
    documentation: 'Sets the UNICODE character format flag for the control',
    label: '_GUICtrlListView_SetUnicodeFormat ( $hWnd, $bUnicode )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          'Determines the character set that is used by the control.    True - the control will use Unicode    False - the control will use ANSI characters.',
      },
    ],
  },
  _GUICtrlListView_SetView: {
    documentation: 'Sets the view of the control',
    label: '_GUICtrlListView_SetView ( $hWnd, $iView )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iView',
        documentation:
          'View state for the control:    0 - Large Icon    1 - Details    2 - List    3 - Small Icon    4 - Tile',
      },
    ],
  },
  _GUICtrlListView_SetWorkAreas: {
    documentation: 'Creates a work area within the control',
    label: '_GUICtrlListView_SetWorkAreas ( $hWnd, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLeft',
        documentation: 'X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iTop',
        documentation: 'Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iRight',
        documentation: 'X coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iBottom',
        documentation: 'Y coordinate of the lower right corner of the rectangle',
      },
    ],
  },
  _GUICtrlListView_SimpleSort: {
    documentation: 'Sorts a list-view control (limited)',
    label:
      '_GUICtrlListView_SimpleSort ( $hWnd, ByRef $vSortSense, $iCol [, $bToggleSense = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$vSortSense',
        documentation:
          'Sets the defined sort order    True - Sort Descending    False - Sort AscendingUse a simple variable for a single column ListViewUse an array for multicolumn ListViews:    $aArray[0] - Order for first Column    $aArray[1] - Order for second Column    $aArray[n] - Order for last Column',
      },
      {
        label: '$iCol',
        documentation: 'Column number',
      },
      {
        label: '$bToggleSense',
        documentation:
          '**[optional]** Toggle sort sense    True - Toggle sort sense after sort (default)    False - Sort sense unchanged after sort',
      },
    ],
  },
  _GUICtrlListView_SortItems: {
    documentation: 'Starts the sort call back, also sets the Arrow in the Header',
    label: '_GUICtrlListView_SortItems ( $hWnd, $iCol )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the control',
      },
      {
        label: '$iCol',
        documentation: 'Column clicked',
      },
    ],
  },
  _GUICtrlListView_SubItemHitTest: {
    documentation: 'Determines which listview item or subitem is at a given position',
    label: '_GUICtrlListView_SubItemHitTest ( $hWnd [, $iX = -1 [, $iY = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: '**[optional]** X position to test or -1 to use the current mouse position',
      },
      {
        label: '$iY',
        documentation: '**[optional]** Y position to test or -1 to use the current mouse position',
      },
    ],
  },
  _GUICtrlListView_UnRegisterSortCallBack: {
    documentation: 'UnRegister the Sort callback function',
    label: '_GUICtrlListView_UnRegisterSortCallBack ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the control',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
