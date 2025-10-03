import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlTreeView.au3>`)';

const signatures = {
  _GUICtrlTreeView_Add: {
    documentation: 'Adds a new item',
    label: '_GUICtrlTreeView_Add ( $hWnd, $hSibling, $sText [, $iImage = -1 [, $iSelImage = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hSibling',
        documentation: 'Sibling item',
      },
      {
        label: '$sText',
        documentation: 'Text of the item',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
    ],
  },
  _GUICtrlTreeView_AddChild: {
    documentation: 'Adds a new item',
    label:
      '_GUICtrlTreeView_AddChild ( $hWnd, $hParent, $sText [, $iImage = -1 [, $iSelImage = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hParent',
        documentation: 'Parent item',
      },
      {
        label: '$sText',
        documentation: 'Text of the item',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
    ],
  },
  _GUICtrlTreeView_AddChildFirst: {
    documentation: 'Adds a new item',
    label:
      '_GUICtrlTreeView_AddChildFirst ( $hWnd, $hParent, $sText [, $iImage = -1 [, $iSelImage = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hParent',
        documentation: 'Parent item',
      },
      {
        label: '$sText',
        documentation: 'Text of the item',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
    ],
  },
  _GUICtrlTreeView_AddFirst: {
    documentation: 'Adds a new item',
    label:
      '_GUICtrlTreeView_AddFirst ( $hWnd, $hSibling, $sText [, $iImage = -1 [, $iSelImage = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hSibling',
        documentation: 'Sibling item',
      },
      {
        label: '$sText',
        documentation: 'Text of the item',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
    ],
  },
  _GUICtrlTreeView_BeginUpdate: {
    documentation: 'Prevents updating of the control until the EndUpdate function is called',
    label: '_GUICtrlTreeView_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_ClickItem: {
    documentation: 'Click on a item',
    label:
      '_GUICtrlTreeView_ClickItem ( $hWnd, $hItem [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
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
        documentation: '**[optional]** Mouse movement speed',
      },
    ],
  },
  _GUICtrlTreeView_Create: {
    documentation: 'Create a TreeView control',
    label:
      '_GUICtrlTreeView_Create ( $hWnd, $iX, $iY [, $iWidth = 150 [, $iHeight = 150 [, $iStyle = 0x00000037 [, $iExStyle = 0x00000000]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
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
          "**[optional]** Control style:    $TVS_CHECKBOXES - Enables check boxes for items. A check box will be displayed only if an image is associated with the item.        When set to this style, the control effectively uses DrawFrameControl to create and set a state image list containing two images.        State image 1 is the unchecked box and state image 2 is the checked box.        Setting the state image to zero removes the check box.        Version 5.80 displays a check box even if no image is associated with the item.    $TVS_DISABLEDRAGDROP - Prevents the control from sending $TVN_BEGINDRAG notification messages    $TVS_EDITLABELS - Allows the user to edit the item labels    $TVS_FULLROWSELECT - Enables full row selection.        The entire row of the selected item is highlighted, and clicking anywhere on an item's row causes it to be selected.        This style cannot be used in conjunction with the $TVS_HASLINES style.    $TVS_HASBUTTONS - Displays plus and minus buttons next to parent items.        The user clicks the buttons to expand or collapse a parent item's list of child items.        To include buttons with items at the root, you must also specify $TVS_LINESATROOT.    $TVS_HASLINES - Uses lines to show the hierarchy of items    $TVS_INFOTIP - Obtains ToolTip information by sending the $TVN_GETINFOTIP notification    $TVS_LINESATROOT - Uses lines to link items at the root of the control. This value is ignored if    $TVS_HASLINES is not also specified.    $TVS_NOHSCROLL - Disables horizontal scrolling in the control. The control will not display any horizontal scroll bars.    $TVS_NONEVENHEIGHT - Sets the height of the items to an odd height with the $TVM_SETITEMHEIGHT message.        By default the height of items must be an even value.    $TVS_NOSCROLL - Disables both horizontal and vertical scrolling in the control. The control will not display any scroll bars.    $TVS_NOTOOLTIPS - Disables ToolTips    $TVS_RTLREADING - Causes text to be displayed from right to left    $TVS_SHOWSELALWAYS - Causes a selected item to remain selected when the control loses focus    $TVS_SINGLEEXPAND - Causes the item being selected to expand and the item being unselected to collapse upon selection.        If the mouse is used to single-click the selected item and that item is closed, it will be expanded.        If the user holds down the CTRL key while selecting an item, the item being unselected will not be collapsed.        Version 5.80 causes the item being selected to expand and the item being unselected to collapse upon selection.        If the user holds down the CTRL key while selecting an item, the item being unselected will not be collapsed.    $TVS_TRACKSELECT - Enables hot trackingDefault: $TVS_HASBUTTONS, $TVS_HASLINES, $TVS_LINESATROOT, $TVS_DISABLEDRAGDROP, $TVS_SHOWSELALWAYSForced: $WS_CHILD, $WS_VISIBLE",
      },
      {
        label: '$iExStyle',
        documentation: '**[optional]** Control extended style',
      },
    ],
  },
  _GUICtrlTreeView_CreateDragImage: {
    documentation: 'Creates a dragging bitmap for the specified item',
    label: '_GUICtrlTreeView_CreateDragImage ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_CreateSolidBitMap: {
    documentation: 'Creates a solid color bitmap',
    label: '_GUICtrlTreeView_CreateSolidBitMap ( $hWnd, $iColor, $iWidth, $iHeight )',
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
  _GUICtrlTreeView_Delete: {
    documentation: 'Removes an item and all its children',
    label: '_GUICtrlTreeView_Delete ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** Handle/Control ID of item',
      },
    ],
  },
  _GUICtrlTreeView_DeleteAll: {
    documentation: 'Removes all items from a tree-view control',
    label: '_GUICtrlTreeView_DeleteAll ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_DeleteChildren: {
    documentation: 'Deletes all children of a item',
    label: '_GUICtrlTreeView_DeleteChildren ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item whose children will be deleted',
      },
    ],
  },
  _GUICtrlTreeView_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlTreeView_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_DisplayRect: {
    documentation: 'Returns the bounding rectangle for a tree item',
    label: '_GUICtrlTreeView_DisplayRect ( $hWnd, $hItem [, $bTextOnly = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item whose rectangle will be returned',
      },
      {
        label: '$bTextOnly',
        documentation:
          '**[optional]** If the True, the bounding rectangle includes only the text of the item.Otherwise, it includes the entire line that the item occupies.',
      },
    ],
  },
  _GUICtrlTreeView_DisplayRectEx: {
    documentation: 'Returns the bounding rectangle for a tree item',
    label: '_GUICtrlTreeView_DisplayRectEx ( $hWnd, $hItem [, $bTextOnly = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item whose rectangle will be returned',
      },
      {
        label: '$bTextOnly',
        documentation:
          '**[optional]** If the True, the bounding rectangle includes only the text of the item.    Otherwise, it includes the entire line that the item occupies.',
      },
    ],
  },
  _GUICtrlTreeView_EditText: {
    documentation: "Begins in-place editing of the specified item's text",
    label: '_GUICtrlTreeView_EditText ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item to edit',
      },
    ],
  },
  _GUICtrlTreeView_EndEdit: {
    documentation: "Ends the editing of the item's text",
    label: '_GUICtrlTreeView_EndEdit ( $hWnd [, $bCancel = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bCancel',
        documentation:
          '**[optional]** Indicates whether the editing is cancelled without being saved to the item.If True, the system cancels editing without saving the changes.',
      },
    ],
  },
  _GUICtrlTreeView_EndUpdate: {
    documentation: 'Enables screen repainting that was turned off with the BeginUpdate function',
    label: '_GUICtrlTreeView_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_EnsureVisible: {
    documentation:
      'Ensures that a item is visible, expanding the parent item or scrolling the control if necessary',
    label: '_GUICtrlTreeView_EnsureVisible ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_Expand: {
    documentation:
      'Expands or collapses the list of child items associated with the specified parent item, if any',
    label: '_GUICtrlTreeView_Expand ( $hWnd [, $hItem = 0 [, $bExpand = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** Handle to the item',
      },
      {
        label: '$bExpand',
        documentation:
          '**[optional]** Expand or Collapse, use the following values:    True - Expand items    False - Collapse items',
      },
    ],
  },
  _GUICtrlTreeView_ExpandedOnce: {
    documentation: "Indicates if the item's list of child items has been expanded at least once",
    label: '_GUICtrlTreeView_ExpandedOnce ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_FindItem: {
    documentation: "Retrieves a item based on it's text",
    label: '_GUICtrlTreeView_FindItem ( $hWnd, $sText [, $bInStr = False [, $hStart = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to search for',
      },
      {
        label: '$bInStr',
        documentation: "**[optional]** If True, the text can be anywhere in the item's text.",
      },
      {
        label: '$hStart',
        documentation: '**[optional]** Item to start searching from. If 0, the root item is used.',
      },
    ],
  },
  _GUICtrlTreeView_FindItemEx: {
    documentation: 'Retrieves a item based on a tree path',
    label: '_GUICtrlTreeView_FindItemEx ( $hWnd, $sTreePath [, $hStart = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sTreePath',
        documentation:
          'The path to take, delimiter of your choice, see Opt("GUIDataSeparatorChar")',
      },
      {
        label: '$hStart',
        documentation: '**[optional]** Item to start searching from. If 0, the root item is used.',
      },
    ],
  },
  _GUICtrlTreeView_GetBkColor: {
    documentation: 'Retrieve the text back color',
    label: '_GUICtrlTreeView_GetBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetBold: {
    documentation: 'Indicates if the item is drawn in a bold style',
    label: '_GUICtrlTreeView_GetBold ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetChecked: {
    documentation: 'Indicates if a item has its checkbox checked',
    label: '_GUICtrlTreeView_GetChecked ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetChildCount: {
    documentation: 'Retrieves the number of children of an parent item',
    label: '_GUICtrlTreeView_GetChildCount ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to item',
      },
    ],
  },
  _GUICtrlTreeView_GetChildren: {
    documentation: 'Indicates whether the item children flag is set',
    label: '_GUICtrlTreeView_GetChildren ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetCount: {
    documentation: 'Retrieves a count of the items',
    label: '_GUICtrlTreeView_GetCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetCut: {
    documentation:
      'Indicates if the item is drawn as if selected as part of a cut and paste operation',
    label: '_GUICtrlTreeView_GetCut ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetDropTarget: {
    documentation: 'Indicates whether the item is drawn as a drag and drop target',
    label: '_GUICtrlTreeView_GetDropTarget ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetEditControl: {
    documentation: "Retrieves the handle to the edit control being used to edit a item's text",
    label: '_GUICtrlTreeView_GetEditControl ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetExpanded: {
    documentation: 'Indicates whether the item is expanded',
    label: '_GUICtrlTreeView_GetExpanded ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetFirstChild: {
    documentation: 'Retrieves the first child item of the specified item',
    label: '_GUICtrlTreeView_GetFirstChild ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetFirstItem: {
    documentation: 'Retrieves the topmost or very first item',
    label: '_GUICtrlTreeView_GetFirstItem ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetFirstVisible: {
    documentation: 'Retrieves the first visible item in the control',
    label: '_GUICtrlTreeView_GetFirstVisible ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetFocused: {
    documentation: 'Indicates whether the item has focus',
    label: '_GUICtrlTreeView_GetFocused ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetHeight: {
    documentation: 'Retrieves the current height of the each item',
    label: '_GUICtrlTreeView_GetHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetImageIndex: {
    documentation: 'Retrieves the normal state image index',
    label: '_GUICtrlTreeView_GetImageIndex ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetImageListIconHandle: {
    documentation: 'Retrieve ImageList handle',
    label: '_GUICtrlTreeView_GetImageListIconHandle ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'ImageList index to retrieve',
      },
    ],
  },
  _GUICtrlTreeView_GetIndent: {
    documentation:
      'Retrieves the amount, in pixels, that child items are indented relative to their parent items',
    label: '_GUICtrlTreeView_GetIndent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetInsertMarkColor: {
    documentation: 'Retrieves the color used to draw the insertion mark',
    label: '_GUICtrlTreeView_GetInsertMarkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetISearchString: {
    documentation: 'Retrieves the incremental search string',
    label: '_GUICtrlTreeView_GetISearchString ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetItemByIndex: {
    documentation: 'Retrieve a item by its position in the list of child items',
    label: '_GUICtrlTreeView_GetItemByIndex ( $hWnd, $hItem, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of item in the list of child items',
      },
    ],
  },
  _GUICtrlTreeView_GetItemHandle: {
    documentation: 'Retrieve the item handle',
    label: '_GUICtrlTreeView_GetItemHandle ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** Item ID',
      },
    ],
  },
  _GUICtrlTreeView_GetItemParam: {
    documentation: 'Retrieves the application specific value of the item',
    label: '_GUICtrlTreeView_GetItemParam ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** Item ID',
      },
    ],
  },
  _GUICtrlTreeView_GetLastChild: {
    documentation: 'Retrieves the last child item of the specified item',
    label: '_GUICtrlTreeView_GetLastChild ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetLineColor: {
    documentation: 'Retrieve the line color',
    label: '_GUICtrlTreeView_GetLineColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetNext: {
    documentation: 'Retrieves the next item after the calling item',
    label: '_GUICtrlTreeView_GetNext ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetNextChild: {
    documentation: 'Returns the next item at the same level as the specified item',
    label: '_GUICtrlTreeView_GetNextChild ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the child item',
      },
    ],
  },
  _GUICtrlTreeView_GetNextSibling: {
    documentation: 'Returns the next item at the same level as the specified item',
    label: '_GUICtrlTreeView_GetNextSibling ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetNextVisible: {
    documentation: 'Retrieves the next visible item that follows the specified item',
    label: '_GUICtrlTreeView_GetNextVisible ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetNormalImageList: {
    documentation: 'Retrieves the normal image list',
    label: '_GUICtrlTreeView_GetNormalImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetParentHandle: {
    documentation: 'Retrieve the parent handle of item',
    label: '_GUICtrlTreeView_GetParentHandle ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/handle',
      },
    ],
  },
  _GUICtrlTreeView_GetParentParam: {
    documentation: 'Retrieve the parent control ID/Param of item',
    label: '_GUICtrlTreeView_GetParentParam ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/Param',
      },
    ],
  },
  _GUICtrlTreeView_GetPrev: {
    documentation: 'Retrieves the previous item before the calling item',
    label: '_GUICtrlTreeView_GetPrev ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetPrevChild: {
    documentation: 'Retrieves the previous child item of a specified item',
    label: '_GUICtrlTreeView_GetPrevChild ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetPrevSibling: {
    documentation: 'Returns the previous item before the calling item at the same level',
    label: '_GUICtrlTreeView_GetPrevSibling ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetPrevVisible: {
    documentation: 'Retrieves the first visible item that precedes the specified item',
    label: '_GUICtrlTreeView_GetPrevVisible ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetScrollTime: {
    documentation: 'Retrieves the maximum scroll time',
    label: '_GUICtrlTreeView_GetScrollTime ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetSelected: {
    documentation: 'Indicates whether the item appears in the selected state',
    label: '_GUICtrlTreeView_GetSelected ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetSelectedImageIndex: {
    documentation:
      'Retrieves the index in the image list of the image displayed for the item when it is selected',
    label: '_GUICtrlTreeView_GetSelectedImageIndex ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetSelection: {
    documentation: 'Retrieves the currently selected item',
    label: '_GUICtrlTreeView_GetSelection ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetSiblingCount: {
    documentation: 'Retrieves the number of siblings at the level of an item',
    label: '_GUICtrlTreeView_GetSiblingCount ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to item',
      },
    ],
  },
  _GUICtrlTreeView_GetState: {
    documentation: 'Retrieve the state of the item',
    label: '_GUICtrlTreeView_GetState ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/handle',
      },
    ],
  },
  _GUICtrlTreeView_GetStateImageIndex: {
    documentation: 'Retrieves the index of the state image to display for the item',
    label: '_GUICtrlTreeView_GetStateImageIndex ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetStateImageList: {
    documentation: 'Retrieves the handle to the state image list',
    label: '_GUICtrlTreeView_GetStateImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetText: {
    documentation: 'Retrieve the item text',
    label: '_GUICtrlTreeView_GetText ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/handle',
      },
    ],
  },
  _GUICtrlTreeView_GetTextColor: {
    documentation: 'Retrieve the text color',
    label: '_GUICtrlTreeView_GetTextColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetToolTips: {
    documentation: 'Retrieves the handle to the child ToolTip control',
    label: '_GUICtrlTreeView_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetTree: {
    documentation: 'Retrieve all items text',
    label: '_GUICtrlTreeView_GetTree ( $hWnd [, $hItem = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/handle',
      },
    ],
  },
  _GUICtrlTreeView_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag',
    label: '_GUICtrlTreeView_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_GetVisible: {
    documentation: 'Indicates whether the item is currently visible in the control image',
    label: '_GUICtrlTreeView_GetVisible ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_GetVisibleCount: {
    documentation: 'Returns the number of items that can be fully visible in the control',
    label: '_GUICtrlTreeView_GetVisibleCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTreeView_HitTest: {
    documentation: 'Returns information about the location of a point relative to the control',
    label: '_GUICtrlTreeView_HitTest ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position, relative to the control, to test',
      },
      {
        label: '$iY',
        documentation: 'Y position, relative to the control, to test',
      },
    ],
  },
  _GUICtrlTreeView_HitTestEx: {
    documentation: 'Returns information about the location of a point relative to the control',
    label: '_GUICtrlTreeView_HitTestEx ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position to test',
      },
      {
        label: '$iY',
        documentation: 'Y position to test',
      },
    ],
  },
  _GUICtrlTreeView_HitTestItem: {
    documentation: 'Returns the item at the specified coordinates',
    label: '_GUICtrlTreeView_HitTestItem ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position to test',
      },
      {
        label: '$iY',
        documentation: 'Y position to test',
      },
    ],
  },
  _GUICtrlTreeView_Index: {
    documentation: 'Retrieves the position of the item in the list',
    label: '_GUICtrlTreeView_Index ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to item',
      },
    ],
  },
  _GUICtrlTreeView_InsertItem: {
    documentation: 'Insert an item',
    label:
      '_GUICtrlTreeView_InsertItem ( $hWnd, $sItem_Text [, $hItem_Parent = 0 [, $hItem_After = 0 [, $iImage = -1 [, $iSelImage = -1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sItem_Text',
        documentation: 'Text of new item. See remark.',
      },
      {
        label: '$hItem_Parent',
        documentation: '**[optional]** parent item ID/handle/item',
      },
      {
        label: '$hItem_After',
        documentation: '**[optional]** item ID/handle/flag to insert new item after',
      },
      {
        label: '$iImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
      {
        label: '$iSelImage',
        documentation:
          "**[optional]** 0-based index of the item's icon in the control's image list",
      },
    ],
  },
  _GUICtrlTreeView_IsFirstItem: {
    documentation: 'Indicates whether the tree item is very first',
    label: '_GUICtrlTreeView_IsFirstItem ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_IsParent: {
    documentation: 'Indicates whether one item is the parent of another item',
    label: '_GUICtrlTreeView_IsParent ( $hWnd, $hParent, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hParent',
        documentation: 'Handle to parent item',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item to test',
      },
    ],
  },
  _GUICtrlTreeView_Level: {
    documentation: 'Indicates the level of indentation of a item',
    label: '_GUICtrlTreeView_Level ( $hWnd, $hItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
    ],
  },
  _GUICtrlTreeView_SelectItem: {
    documentation: 'Selects the specified item, scrolls the item into view, or redraws the item',
    label: '_GUICtrlTreeView_SelectItem ( $hWnd, $hItem [, $iFlag = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** Action flag:    $TVGN_CARET - Sets the selection to the given item    $TVGN_DROPHILITE - Redraws the given item in the style used to indicate the target of a drag/drop operation    $TVGN_FIRSTVISIBLE - Scrolls the tree view vertically so that the given item is the first visible item',
      },
    ],
  },
  _GUICtrlTreeView_SelectItemByIndex: {
    documentation: "Selects the item based on it's index in the parent list",
    label: '_GUICtrlTreeView_SelectItemByIndex ( $hWnd, $hItem, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of item in the parent list',
      },
    ],
  },
  _GUICtrlTreeView_SetBkColor: {
    documentation: 'Sets the back color',
    label: '_GUICtrlTreeView_SetBkColor ( $hWnd, $vRGBColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$vRGBColor',
        documentation: 'New hex RGB Color',
      },
    ],
  },
  _GUICtrlTreeView_SetBold: {
    documentation: 'Sets whether the item is drawn using a bold sytle',
    label: '_GUICtrlTreeView_SetBold ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation: '**[optional]** True if item is drawn bold, otherwise False',
      },
    ],
  },
  _GUICtrlTreeView_SetChecked: {
    documentation: "Sets whether a item has it's checkbox checked or not",
    label: '_GUICtrlTreeView_SetChecked ( $hWnd, $hItem [, $bCheck = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bCheck',
        documentation:
          '**[optional]** Value to set checked state to:    True - Checked    False - Not checked',
      },
    ],
  },
  _GUICtrlTreeView_SetCheckedByIndex: {
    documentation: "Sets whether an item has it's checkbox checked or not by it's index",
    label: '_GUICtrlTreeView_SetCheckedByIndex ( $hWnd, $hItem, $iIndex [, $bCheck = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: '0-based index into $hItem list of items',
      },
      {
        label: '$bCheck',
        documentation:
          '**[optional]** Value to set checked state to:    True - Checked    False - Not checked',
      },
    ],
  },
  _GUICtrlTreeView_SetChildren: {
    documentation: 'Sets whether the item children flag',
    label: '_GUICtrlTreeView_SetChildren ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation:
          '**[optional]** Flag setting:    True - Item children flag is set    False - Item children flag is cleared',
      },
    ],
  },
  _GUICtrlTreeView_SetCut: {
    documentation:
      'Sets whether the item is drawn as if selected as part of a cut and paste operation',
    label: '_GUICtrlTreeView_SetCut ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation: '**[optional]** Flag setting:    True - Item is cut    False - Item is not',
      },
    ],
  },
  _GUICtrlTreeView_SetDropTarget: {
    documentation: 'Sets whether the item is drawn as a drag and drop target',
    label: '_GUICtrlTreeView_SetDropTarget ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation:
          '**[optional]** Flag setting:    True - Item is drawn as a drag and drop target    False - Item is not',
      },
    ],
  },
  _GUICtrlTreeView_SetFocused: {
    documentation: 'Sets whether the item appears to have focus',
    label: '_GUICtrlTreeView_SetFocused ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation:
          '**[optional]** Flag setting:    True - Item appears to have focus    False - Item does not',
      },
    ],
  },
  _GUICtrlTreeView_SetHeight: {
    documentation: 'Sets the height of the each item',
    label: '_GUICtrlTreeView_SetHeight ( $hWnd, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iHeight',
        documentation:
          'New height of every item in pixels. Heights less than 1 will be set to 1.If not even and the control does not have the $TVS_NONEVENHEIGHT style this value will be rounded down to the nearest even value.If -1, the control will revert to using its default item height.',
      },
    ],
  },
  _GUICtrlTreeView_SetIcon: {
    documentation: 'Set an item icon',
    label:
      '_GUICtrlTreeView_SetIcon ( $hWnd [, $hItem = 0 [, $sIconFile = "" [, $iIconID = 0 [, $iImageMode = 6]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** item ID/handle',
      },
      {
        label: '$sIconFile',
        documentation: '**[optional]** The file to extract the icon of',
      },
      {
        label: '$iIconID',
        documentation: '**[optional]** The iconID to extract of the file',
      },
      {
        label: '$iImageMode',
        documentation: '**[optional]** 2=normal image / 4=selected image to set',
      },
    ],
  },
  _GUICtrlTreeView_SetImageIndex: {
    documentation:
      'Sets the index into image list for which image is displayed when a item is in its normal state',
    label: '_GUICtrlTreeView_SetImageIndex ( $hWnd, $hItem, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: 'Image list index',
      },
    ],
  },
  _GUICtrlTreeView_SetIndent: {
    documentation:
      'Sets the width of indentation for a tree-view control and redraws the control to reflect the new width',
    label: '_GUICtrlTreeView_SetIndent ( $hWnd, $iIndent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndent',
        documentation: 'Width, in pixels, of the indentation.',
      },
    ],
  },
  _GUICtrlTreeView_SetInsertMark: {
    documentation: 'Sets the insertion mark',
    label: '_GUICtrlTreeView_SetInsertMark ( $hWnd, $hItem [, $bAfter = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation:
          'Specifies at which item the insertion mark will be placed. If this is 0, the insertion mark is removed.',
      },
      {
        label: '$bAfter',
        documentation:
          '**[optional]** Specifies if the insertion mark is placed before or after the item.If this is True, the insertion mark will be placed after the item.If this is False, the insertion mark will be placed before the item.',
      },
    ],
  },
  _GUICtrlTreeView_SetInsertMarkColor: {
    documentation: 'Sets the color used to draw the insertion mark',
    label: '_GUICtrlTreeView_SetInsertMarkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Insertion mark color',
      },
    ],
  },
  _GUICtrlTreeView_SetItemHeight: {
    documentation: 'Sets the height of an individual item',
    label: '_GUICtrlTreeView_SetItemHeight ( $hWnd, $hItem, $iIntegral )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIntegral',
        documentation:
          'Height of the item. This height is in increments of the standard item height. By default, eachitem gets one increment of item height. Setting this field to 2 will give the item twice the standard height;setting this field to 3 will give the item three times the standard height; and so on. The control does notdraw in this extra area.',
      },
    ],
  },
  _GUICtrlTreeView_SetItemParam: {
    documentation: 'Sets the value specific to the item',
    label: '_GUICtrlTreeView_SetItemParam ( $hWnd, $hItem, $iParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iParam',
        documentation: 'A value to associate with the item',
      },
    ],
  },
  _GUICtrlTreeView_SetLineColor: {
    documentation: 'Sets the line color',
    label: '_GUICtrlTreeView_SetLineColor ( $hWnd, $vRGBColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$vRGBColor',
        documentation: 'New Hex RGB line color',
      },
    ],
  },
  _GUICtrlTreeView_SetNormalImageList: {
    documentation: 'Sets the normal image list for the control',
    label: '_GUICtrlTreeView_SetNormalImageList ( $hWnd, $hImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hImageList',
        documentation: 'Handle to the image list. If 0, all images are removed',
      },
    ],
  },
  _GUICtrlTreeView_SetScrollTime: {
    documentation: 'Sets the maximum scroll time',
    label: '_GUICtrlTreeView_SetScrollTime ( $hWnd, $iTime )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iTime',
        documentation: 'New maximum scroll time, in milliseconds',
      },
    ],
  },
  _GUICtrlTreeView_SetSelected: {
    documentation: 'Sets whether the item appears in the selected state',
    label: '_GUICtrlTreeView_SetSelected ( $hWnd, $hItem [, $bFlag = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$bFlag',
        documentation: '**[optional]** True if item is to be selected, otherwise False',
      },
    ],
  },
  _GUICtrlTreeView_SetSelectedImageIndex: {
    documentation: 'Sets the selected image index',
    label: '_GUICtrlTreeView_SetSelectedImageIndex ( $hWnd, $hItem, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: 'Image list index',
      },
    ],
  },
  _GUICtrlTreeView_SetState: {
    documentation: 'Set the state of the specified item',
    label: '_GUICtrlTreeView_SetState ( $hWnd, $hItem [, $iState = 0 [, $bSetState = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iState',
        documentation:
          "**[optional]** The new item state, can be one or more of the following:    $TVIS_SELECTED - Set item selected    $TVIS_CUT - Set item as part of a cut-and-paste operation    $TVIS_DROPHILITED - Set item as a drag-and-drop target    $TVIS_BOLD - Set item as bold    $TVIS_EXPANDED - Expand item    $TVIS_EXPANDEDONCE - Set item's list of child items has been expanded at least once    $TVIS_EXPANDPARTIAL - Set item as partially expanded",
      },
      {
        label: '$bSetState',
        documentation: '**[optional]** True if item state is to be set, False remove item state',
      },
    ],
  },
  _GUICtrlTreeView_SetStateImageIndex: {
    documentation: 'Sets the index into image list for the state image',
    label: '_GUICtrlTreeView_SetStateImageIndex ( $hWnd, $hItem, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: 'Handle to the item',
      },
      {
        label: '$iIndex',
        documentation: 'Image list index',
      },
    ],
  },
  _GUICtrlTreeView_SetStateImageList: {
    documentation: 'Sets the state image list for the control',
    label: '_GUICtrlTreeView_SetStateImageList ( $hWnd, $hImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hImageList',
        documentation: 'Handle to the image list. If 0, all images are removed',
      },
    ],
  },
  _GUICtrlTreeView_SetText: {
    documentation: 'Set the text of an item',
    label: '_GUICtrlTreeView_SetText ( $hWnd [, $hItem = 0 [, $sText = ""]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hItem',
        documentation: '**[optional]** Handle to the item',
      },
      {
        label: '$sText',
        documentation: '**[optional]** The new item text',
      },
    ],
  },
  _GUICtrlTreeView_SetTextColor: {
    documentation: 'Sets the text color',
    label: '_GUICtrlTreeView_SetTextColor ( $hWnd, $vRGBColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$vRGBColor',
        documentation: 'New Hex text color',
      },
    ],
  },
  _GUICtrlTreeView_SetToolTips: {
    documentation: 'Sets the handle to the child ToolTip control',
    label: '_GUICtrlTreeView_SetToolTips ( $hWnd, $hToolTip )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hToolTip',
        documentation: 'Handle to a ToolTip control',
      },
    ],
  },
  _GUICtrlTreeView_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag',
    label: '_GUICtrlTreeView_SetUnicodeFormat ( $hWnd [, $bFormat = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bFormat',
        documentation:
          '**[optional]** Determines the character set that is used by the control.    True - The control will use Unicode characters    False - The control will use ANSI characters.',
      },
    ],
  },
  _GUICtrlTreeView_Sort: {
    documentation: 'Sorts the items',
    label: '_GUICtrlTreeView_Sort ( $hWnd )',
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
