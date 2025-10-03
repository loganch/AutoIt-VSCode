import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlMenu.au3>`)';

const signatures = {
  _GUICtrlMenu_AddMenuItem: {
    documentation: 'Adds a new menu item to the end of the menu',
    label: '_GUICtrlMenu_AddMenuItem ( $hMenu, $sText [, $iCmdID = 0 [, $hSubMenu = 0]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$sText',
        documentation: 'Menu item text. If blank, a separator will be added.',
      },
      {
        label: '$iCmdID',
        documentation: '**[optional]** Command ID to assign to the item',
      },
      {
        label: '$hSubMenu',
        documentation: '**[optional]** Handle to the submenu associated with the menu item',
      },
    ],
  },
  _GUICtrlMenu_AppendMenu: {
    documentation:
      'Appends a new item to the end of the specified menu bar, drop-down menu, submenu, or shortcut menu',
    label: '_GUICtrlMenu_AppendMenu ( $hMenu, $iFlags, $iNewItem, $vNewItem )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iFlags',
        documentation:
          'Specifies flags to control the appearance and behavior of the new menu item:    $MF_BITMAP - Uses a bitmap as the menu item    $MF_CHECKED - Places a check mark next to the menu item. If the application provides check-mark bitmaps, this flag displays the check-mark bitmap next to the menu item.    $MF_DISABLED - Disables the menu item so that it cannot be selected, but the flag does not gray it.    $MF_ENABLED - Enables the menu item so that it can be selected, and restores it from its grayed state.    $MF_GRAYED - Disables the menu item and grays it so that it cannot be selected.    $MF_MENUBARBREAK - Functions the same as $MF_MENUBREAK for a menu bar. For a drop down menu, submenu, or shortcut menu, the new column is separated from the old column by a vertical line.    $MF_MENUBREAK - Places the item on a new line (for a menu bar) or in a new column (for a drop down menu, submenu, or shortcut menu) without separating columns.    $MF_OWNERDRAW - Specifies that the item is an owner drawn item.        Before the menu is displayed for the first time, the window that owns the menu receives a $WM_MEASUREITEM message to retrieve the width and height of the menu item.        The $WM_DRAWITEM message is then sent to the window procedure of the owner window whenever the appearance of the menu item must be updated.    $MF_POPUP - Specifies that the menu item opens a drop down menu or submenu.        The $iNewItem parameter specifies a handle to the drop down menu or submenu.        This flag is used to add a menu name to a menu bar, or a menu item that opens a submenu to a drop down menu, submenu, or shortcut menu.    $MF_SEPARATOR - Draws a horizontal dividing line. This flag is used only in a drop down menu, submenu, or shortcut menu.        The line cannot be grayed, disabled, or highlighted. The $vNewItem and $iNewItem parameters are ignored.    $MF_STRING - Specifies that the menu item is a text string. The $vNewItem parameter is a string.    $MF_UNCHECKED - Does not place a check mark next to the item. If the application supplies check mark bitmaps, this flag displays the clear bitmap next to the menu item.',
      },
      {
        label: '$iNewItem',
        documentation:
          'Specifies either the identifier of the new menu item or, if the $iFlags parameter is set to a popup, a handle to the drop down menu or submenu.',
      },
      {
        label: '$vNewItem',
        documentation:
          'Specifies the content of the new menu item. The interpretation of $vNewItem depends on whether the $iFlags parameter includes the $MF_BITMAP, $MF_OWNERDRAW, or $MF_STRING flag:    $MF_BITMAP - Contains a bitmap handle    $MF_OWNERDRAW - Contains an application supplied value that can be used to maintain additional data related to the menu item.        The value is in the ItemData member of the structure pointed to by the lParam parameter of the $WM_MEASUREITEM or $WM_DRAWITEM message sent when the menu is created or its appearance is updated.    $MF_STRING - Contains a string',
      },
    ],
  },
  _GUICtrlMenu_CalculatePopupWindowPosition: {
    documentation: 'Calculates an appropriate pop-up window position',
    label:
      '_GUICtrlMenu_CalculatePopupWindowPosition ( $iX, $iY, $iWidth, $iHeight [, $iFlags = 0 [, $tExclude = 0]] )',
    params: [
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the specified anchor point.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the specified anchor point.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of the specified window.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of the specified window.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how the function positions the pop-up window horizontally and vertically.    $TPM_CENTERALIGN    $TPM_LEFTALIGN (Default)    $TPM_RIGHTALIGN    $TPM_BOTTOMALIGN    $TPM_TOPALIGN (Default)    $TPM_VCENTERALIGN    $TPM_HORIZONTAL (Default)    $TPM_VERTICAL    $TPM_WORKAREA',
      },
      {
        label: '$tExclude',
        documentation: '**[optional]** $tagRECT structure that specifies the exclude rectangle.',
      },
    ],
  },
  _GUICtrlMenu_CheckMenuItem: {
    documentation:
      "Sets the state of the specified menu item's check mark attribute to either selected or clear",
    label: '_GUICtrlMenu_CheckMenuItem ( $hMenu, $iItem [, $bCheck = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item to check',
      },
      {
        label: '$bCheck',
        documentation: '**[optional]** True to set the check mark, False to remove it',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_CheckRadioItem: {
    documentation: 'Checks a specified menu item and makes it a radio item',
    label: '_GUICtrlMenu_CheckRadioItem ( $hMenu, $iFirst, $iLast, $iCheck [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iFirst',
        documentation: 'Identifier or position of the first menu item in the group',
      },
      {
        label: '$iLast',
        documentation: 'Identifier or position of the last menu item in the group',
      },
      {
        label: '$iCheck',
        documentation: 'Identifier or position of the menu item to check',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iFirst, $iLast and $iCheck are a 0-based item position    False - $iFirst, $iLast and $iCheck are a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_CreateMenu: {
    documentation: 'Creates a menu',
    label: '_GUICtrlMenu_CreateMenu ( [$iStyle = $MNS_CHECKORBMP] )',
    params: [
      {
        label: '$iStyle',
        documentation: '**[optional]** Style of the menu',
      },
    ],
  },
  _GUICtrlMenu_CreatePopup: {
    documentation: 'Creates a drop down menu, submenu, or shortcut menu',
    label: '_GUICtrlMenu_CreatePopup ( [$iStyle = $MNS_CHECKORBMP] )',
    params: [
      {
        label: '$iStyle',
        documentation: '**[optional]** Style of the menu',
      },
    ],
  },
  _GUICtrlMenu_DeleteMenu: {
    documentation: 'Deletes an item from the specified menu',
    label: '_GUICtrlMenu_DeleteMenu ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_DestroyMenu: {
    documentation: 'Destroys the specified menu and frees any memory that the menu occupies',
    label: '_GUICtrlMenu_DestroyMenu ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
    ],
  },
  _GUICtrlMenu_DrawMenuBar: {
    documentation: 'Redraws the menu bar of the specified window',
    label: '_GUICtrlMenu_DrawMenuBar ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose menu bar needs redrawing',
      },
    ],
  },
  _GUICtrlMenu_EnableMenuItem: {
    documentation: 'Enables, disables, or grays the specified menu item',
    label: '_GUICtrlMenu_EnableMenuItem ( $hMenu, $iItem [, $iState = 0 [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$iState',
        documentation:
          '**[optional]** Indicates whether the menu item is enabled, disabled, or grayed:    0 - Enabled    1 - Grayed    2 - Disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_FindItem: {
    documentation: "Retrieves a menu item based on it's text",
    label: '_GUICtrlMenu_FindItem ( $hMenu, $sText [, $bInStr = False [, $iStart = 0]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
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
        label: '$iStart',
        documentation: '**[optional]** Item to start searching from',
      },
    ],
  },
  _GUICtrlMenu_FindParent: {
    documentation: 'Retrieves the window to which a menu belongs',
    label: '_GUICtrlMenu_FindParent ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
    ],
  },
  _GUICtrlMenu_GetItemBmp: {
    documentation: 'Retrieves the bitmap displayed for the item',
    label: '_GUICtrlMenu_GetItemBmp ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemBmpChecked: {
    documentation: 'Retrieves the bitmap displayed if the item is selected',
    label: '_GUICtrlMenu_GetItemBmpChecked ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemBmpUnchecked: {
    documentation: 'Retrieves the bitmap displayed if the item is not selected',
    label: '_GUICtrlMenu_GetItemBmpUnchecked ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemChecked: {
    documentation: 'Retrieves the status of the menu item checked state',
    label: '_GUICtrlMenu_GetItemChecked ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemCount: {
    documentation: 'Retrieves the number of items in the specified menu',
    label: '_GUICtrlMenu_GetItemCount ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetItemData: {
    documentation: 'Retrieves the application defined value associated with the menu item',
    label: '_GUICtrlMenu_GetItemData ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemDefault: {
    documentation: 'Retrieves the status of the menu item default state',
    label: '_GUICtrlMenu_GetItemDefault ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemDisabled: {
    documentation: 'Retrieves the status of the menu item disabled state',
    label: '_GUICtrlMenu_GetItemDisabled ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemEnabled: {
    documentation: 'Retrieves the status of the menu item enabled state',
    label: '_GUICtrlMenu_GetItemEnabled ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemGrayed: {
    documentation: 'Retrieves the status of the menu item grayed state',
    label: '_GUICtrlMenu_GetItemGrayed ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemHighlighted: {
    documentation: 'Retrieves the status of the menu item highlighted state',
    label: '_GUICtrlMenu_GetItemHighlighted ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemID: {
    documentation: 'Retrieves the menu item ID',
    label: '_GUICtrlMenu_GetItemID ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemInfo: {
    documentation: 'Retrieves information about a menu item',
    label: '_GUICtrlMenu_GetItemInfo ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemRect: {
    documentation: 'Retrieves the bounding rectangle for the specified menu item',
    label: '_GUICtrlMenu_GetItemRect ( $hWnd, $hMenu, $iItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window containing the menu',
      },
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: '0-based position of the menu item',
      },
    ],
  },
  _GUICtrlMenu_GetItemRectEx: {
    documentation: 'Retrieves the bounding rectangle for the specified menu item',
    label: '_GUICtrlMenu_GetItemRectEx ( $hWnd, $hMenu, $iItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window containing the menu',
      },
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: '0-based position of the menu item',
      },
    ],
  },
  _GUICtrlMenu_GetItemState: {
    documentation: 'Retrieves the menu item state',
    label: '_GUICtrlMenu_GetItemState ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemStateEx: {
    documentation: 'Retrieves the menu flags associated with the specified menu item',
    label: '_GUICtrlMenu_GetItemStateEx ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemSubMenu: {
    documentation: 'Retrieves a the submenu activated by a specified item',
    label: '_GUICtrlMenu_GetItemSubMenu ( $hMenu, $iItem )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: '0-based position of the menu item',
      },
    ],
  },
  _GUICtrlMenu_GetItemText: {
    documentation: 'Retrieves the text of the specified menu item',
    label: '_GUICtrlMenu_GetItemText ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetItemType: {
    documentation: 'Retrieves the menu item type',
    label: '_GUICtrlMenu_GetItemType ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_GetMenu: {
    documentation: 'Retrieves the handle of the menu assigned to the given window',
    label: '_GUICtrlMenu_GetMenu ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Identifies the window whose menu handle is retrieved',
      },
    ],
  },
  _GUICtrlMenu_GetMenuBackground: {
    documentation: "Retrieves the brush to use for the menu's background",
    label: '_GUICtrlMenu_GetMenuBackground ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetMenuBarInfo: {
    documentation: 'Retrieves information about the specified menu bar',
    label: '_GUICtrlMenu_GetMenuBarInfo ( $hWnd [, $iItem = 0 [, $iObject = 1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose information is to be retrieved',
      },
      {
        label: '$iItem',
        documentation:
          '**[optional]** Specifies the item for which to retrieve information. If 0, the function retrieves information about the menu itself.If 1, the function retrieves information about the first item on the menu, and so on.',
      },
      {
        label: '$iObject',
        documentation:
          '**[optional]** Specifies the menu object:    0 - The popup menu associated with the window    1 - The menu bar associated with the window    2 - The system menu associated with the window',
      },
    ],
  },
  _GUICtrlMenu_GetMenuContextHelpID: {
    documentation: 'Retrieves the context help identifier',
    label: '_GUICtrlMenu_GetMenuContextHelpID ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetMenuData: {
    documentation: 'Retrieves the application defined value',
    label: '_GUICtrlMenu_GetMenuData ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetMenuDefaultItem: {
    documentation: 'Retrieves the default menu item on the specified menu',
    label: '_GUICtrlMenu_GetMenuDefaultItem ( $hMenu [, $bByPos = True [, $iFlags = 0]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$bByPos',
        documentation:
          "**[optional]** Determines whether to retrive the menu items's identifer of it's position:    True - Return menu item position    False - Return menu item identifier",
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Specifies how the function searches for menu items:    0 - No special search parameters    1 - Specifies that the function will return a default item even if it is disabled    2 - Specifies that if the default item is one that opens a submenu the function is to search recursively in the corresponding submenu.',
      },
    ],
  },
  _GUICtrlMenu_GetMenuHeight: {
    documentation: 'Retrieves the maximum height of a menu',
    label: '_GUICtrlMenu_GetMenuHeight ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetMenuInfo: {
    documentation: 'Retrieves information about a specified menu',
    label: '_GUICtrlMenu_GetMenuInfo ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetMenuStyle: {
    documentation: 'Retrieves the style information for a menu',
    label: '_GUICtrlMenu_GetMenuStyle ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
    ],
  },
  _GUICtrlMenu_GetSystemMenu: {
    documentation: 'Allows the application to access the window menu for copying and modifying',
    label: '_GUICtrlMenu_GetSystemMenu ( $hWnd [, $bRevert = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that will own a copy of the window menu',
      },
      {
        label: '$bRevert',
        documentation:
          '**[optional]** Specifies the action to be taken. If this parameter is False, the function returns a handle to the copy of the window menu currently in use. The copy is initially identical to the window menu, but it can be modified.If this parameter is True, the function resets the window menu back to the default state. The previous window menu, if any, is destroyed.',
      },
    ],
  },
  _GUICtrlMenu_InsertMenuItem: {
    documentation: 'Inserts a new menu item at the specified position',
    label:
      '_GUICtrlMenu_InsertMenuItem ( $hMenu, $iIndex, $sText [, $iCmdID = 0 [, $hSubMenu = 0]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iIndex',
        documentation: '0-based position of the menu item before which to insert the new item',
      },
      {
        label: '$sText',
        documentation: 'Menu item text. If blank, a separator will be inserted.',
      },
      {
        label: '$iCmdID',
        documentation: '**[optional]** Command ID to assign to the item',
      },
      {
        label: '$hSubMenu',
        documentation: '**[optional]** Handle to the submenu associated with the menu item',
      },
    ],
  },
  _GUICtrlMenu_InsertMenuItemEx: {
    documentation: 'Inserts a new menu item at the specified position in a menu',
    label: '_GUICtrlMenu_InsertMenuItemEx ( $hMenu, $iIndex, ByRef $tMenu [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iIndex',
        documentation: 'Position of the menu item before which to insert the new item',
      },
      {
        label: '$tMenu',
        documentation: '$tagMENUITEMINFO structure',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iIndex is a 0-based item position    False - $iIndex is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_IsMenu: {
    documentation: 'Determines whether a handle is a menu handle',
    label: '_GUICtrlMenu_IsMenu ( $hMenu )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle to be tested',
      },
    ],
  },
  _GUICtrlMenu_LoadMenu: {
    documentation:
      'Loads the specified menu resource from the executable file associated with an application instance',
    label: '_GUICtrlMenu_LoadMenu ( $hInst, $sMenuName )',
    params: [
      {
        label: '$hInst',
        documentation: 'Handle to the module containing the menu resource to be loaded',
      },
      {
        label: '$sMenuName',
        documentation:
          'String that contains the name of the menu resource.Alternatively, this parameter can consist of the resource identifier in the low order word and 0 in the high order word.',
      },
    ],
  },
  _GUICtrlMenu_MapAccelerator: {
    documentation: "Maps a menu accelerator key to it's position in the menu",
    label: '_GUICtrlMenu_MapAccelerator ( $hMenu, $sAccelKey )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle to menu',
      },
      {
        label: '$sAccelKey',
        documentation: 'Accelerator key',
      },
    ],
  },
  _GUICtrlMenu_MenuItemFromPoint: {
    documentation: 'Determines which menu item is at the specified location',
    label: '_GUICtrlMenu_MenuItemFromPoint ( $hWnd, $hMenu [, $iX = -1 [, $iY = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window containing the menu. If this value is 0 and $hMenu represents a popup menu, the function will find the menu window.',
      },
      {
        label: '$hMenu',
        documentation: 'Handle to the menu containing the menu items to hit test',
      },
      {
        label: '$iX',
        documentation:
          '**[optional]** X position to test. If -1, the current mouse X position will be used.',
      },
      {
        label: '$iY',
        documentation:
          '**[optional]** Y position to test. If -1, the current mouse Y position will be used.',
      },
    ],
  },
  _GUICtrlMenu_RemoveMenu: {
    documentation: 'Deletes a menu item or detaches a submenu from the specified menu',
    label: '_GUICtrlMenu_RemoveMenu ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle to the menu to be changed',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemBitmaps: {
    documentation: 'Associates the specified bitmap with a menu item',
    label:
      '_GUICtrlMenu_SetItemBitmaps ( $hMenu, $iItem, $hChecked, $hUnChecked [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$hChecked',
        documentation: 'Handle to the bitmap displayed when the menu item is selected',
      },
      {
        label: '$hUnChecked',
        documentation: 'Handle to the bitmap displayed when the menu item is not selected',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemBmp: {
    documentation: 'Sets the bitmap displayed for the item',
    label: '_GUICtrlMenu_SetItemBmp ( $hMenu, $iItem, $hBitmap [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the item bitmap',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemBmpChecked: {
    documentation: 'Sets the bitmap displayed if the item is selected',
    label: '_GUICtrlMenu_SetItemBmpChecked ( $hMenu, $iItem, $hBitmap [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to display next to the item if it is selected',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemBmpUnchecked: {
    documentation: 'Sets the bitmap displayed if the item is not selected',
    label: '_GUICtrlMenu_SetItemBmpUnchecked ( $hMenu, $iItem, $hBitmap [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to display next to the item if it is not selected',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemChecked: {
    documentation: 'Sets the checked state of a menu item',
    label: '_GUICtrlMenu_SetItemChecked ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation: '**[optional]** True to set state, otherwise False',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemData: {
    documentation: 'Sets the application defined value for a menu item',
    label: '_GUICtrlMenu_SetItemData ( $hMenu, $iItem, $iData [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$iData',
        documentation: 'Application defined value',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemDefault: {
    documentation: 'Sets the status of the menu item default state',
    label: '_GUICtrlMenu_SetItemDefault ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Item state to set:    True - State is enabled    False - State is disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemDisabled: {
    documentation: 'Sets the disabled state of a menu item',
    label: '_GUICtrlMenu_SetItemDisabled ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation: '**[optional]** True to set state, otherwise False',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemEnabled: {
    documentation: 'Sets the enabled state of a menu item',
    label: '_GUICtrlMenu_SetItemEnabled ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Item state to set:    True - State is enabled    False - State is disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemGrayed: {
    documentation: 'Sets the grayed state of a menu item',
    label: '_GUICtrlMenu_SetItemGrayed ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Item state to set:    True - State is enabled    False - State is disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemHighlighted: {
    documentation: 'Sets the highlighted state of a menu item',
    label:
      '_GUICtrlMenu_SetItemHighlighted ( $hMenu, $iItem [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Item state to set:    True - State is enabled    False - State is disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemID: {
    documentation: 'Sets the menu item ID',
    label: '_GUICtrlMenu_SetItemID ( $hMenu, $iItem, $iID [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$iID',
        documentation: 'Menu item ID',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemInfo: {
    documentation: 'Changes information about a menu item',
    label: '_GUICtrlMenu_SetItemInfo ( $hMenu, $iItem, ByRef $tInfo [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$tInfo',
        documentation: '$tagMENUITEMINFO structure',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemState: {
    documentation: 'Sets the state of a menu item',
    label:
      '_GUICtrlMenu_SetItemState ( $hMenu, $iItem, $iState [, $bState = True [, $bByPos = True]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$iState',
        documentation:
          'Menu item state:    $MFS_CHECKED - Item is checked    $MFS_DEFAULT - Item is the default item    $MFS_DISABLED - Item is disabled    $MFS_GRAYED - Item is disabled    $MFS_HILITE - Item is highlighted',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Item state to set:    True - State is enabled    False - State is disabled',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemSubMenu: {
    documentation: 'Sets the drop down menu or submenu associated with the menu item',
    label: '_GUICtrlMenu_SetItemSubMenu ( $hMenu, $iItem, $hSubMenu [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$hSubMenu',
        documentation: 'Handle to the drop down menu or submenu',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemText: {
    documentation: 'Sets the text for a menu item',
    label: '_GUICtrlMenu_SetItemText ( $hMenu, $iItem, $sText [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$sText',
        documentation: 'Menu item text',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetItemType: {
    documentation: 'Sets the menu item type',
    label: '_GUICtrlMenu_SetItemType ( $hMenu, $iItem, $iType [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the menu item',
      },
      {
        label: '$iType',
        documentation:
          'Menu item type. This can be one or more of the following values:    $MFT_BITMAP - Item is displayed using a bitmap    $MFT_MENUBARBREAK - Item is placed on a new line. A vertical line separates the new column from the old.    $MFT_MENUBREAK - Item is placed on a new line. The columns are not separated by a vertical line.    $MFT_OWNERDRAW - Item is owner drawn    $MFT_RADIOCHECK - Item is displayed using a radio button mark    $MFT_RIGHTJUSTIFY - Item is right justified    $MFT_RIGHTORDER - Item cascades from right to left    $MFT_SEPARATOR - Item is a separator',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetMenu: {
    documentation: 'Assigns a new menu to the specified window',
    label: '_GUICtrlMenu_SetMenu ( $hWnd, $hMenu )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to which the menu is to be assigned',
      },
      {
        label: '$hMenu',
        documentation: "Handle to the new menu. If 0, the window's current menu is removed.",
      },
    ],
  },
  _GUICtrlMenu_SetMenuBackground: {
    documentation: 'Sets the background brush for the menu',
    label: '_GUICtrlMenu_SetMenuBackground ( $hMenu, $hBrush )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$hBrush',
        documentation: 'Brush to use for the background',
      },
    ],
  },
  _GUICtrlMenu_SetMenuContextHelpID: {
    documentation: 'Sets the context help identifier for the menu',
    label: '_GUICtrlMenu_SetMenuContextHelpID ( $hMenu, $iHelpID )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iHelpID',
        documentation: 'Context help ID',
      },
    ],
  },
  _GUICtrlMenu_SetMenuData: {
    documentation: 'Sets the application defined for the menu',
    label: '_GUICtrlMenu_SetMenuData ( $hMenu, $iData )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iData',
        documentation: 'Application defined data',
      },
    ],
  },
  _GUICtrlMenu_SetMenuDefaultItem: {
    documentation: 'Sets the default menu item',
    label: '_GUICtrlMenu_SetMenuDefaultItem ( $hMenu, $iItem [, $bByPos = True] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$iItem',
        documentation: 'Identifier or position of the default menu item or -1 for no default item',
      },
      {
        label: '$bByPos',
        documentation:
          '**[optional]** Menu identifier flag:    True - $iItem is a 0-based item position    False - $iItem is a menu item identifier',
      },
    ],
  },
  _GUICtrlMenu_SetMenuHeight: {
    documentation: 'Sets the maximum height of the menu',
    label: '_GUICtrlMenu_SetMenuHeight ( $hMenu, $iHeight )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iHeight',
        documentation: 'Maximum height of the menu',
      },
    ],
  },
  _GUICtrlMenu_SetMenuInfo: {
    documentation: 'Sets information for a specified menu',
    label: '_GUICtrlMenu_SetMenuInfo ( $hMenu, ByRef $tInfo )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Menu handle',
      },
      {
        label: '$tInfo',
        documentation: '$tagMENUINFO structure',
      },
    ],
  },
  _GUICtrlMenu_SetMenuStyle: {
    documentation: 'Sets the menu style',
    label: '_GUICtrlMenu_SetMenuStyle ( $hMenu, $iStyle )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle of the menu',
      },
      {
        label: '$iStyle',
        documentation: 'Style of the menu.',
      },
    ],
  },
  _GUICtrlMenu_TrackPopupMenu: {
    documentation: 'Displays a shortcut menu at the specified location',
    label:
      '_GUICtrlMenu_TrackPopupMenu ( $hMenu, $hWnd [, $iX = -1 [, $iY = -1 [, $iAlignX = 1 [, $iAlignY = 1 [, $iNotify = 0 [, $iButtons = 0]]]]]] )',
    params: [
      {
        label: '$hMenu',
        documentation: 'Handle to the shortcut menu to be displayed',
      },
      {
        label: '$hWnd',
        documentation: 'Handle to the window that owns the shortcut menu',
      },
      {
        label: '$iX',
        documentation:
          '**[optional]** Specifies the horizontal location of the shortcut menu, in screen coordinates.If this is -1, the current mouse position is used.',
      },
      {
        label: '$iY',
        documentation:
          '**[optional]** Specifies the vertical location of the shortcut menu, in screen coordinates.If this is -1, the current mouse position is used.',
      },
      {
        label: '$iAlignX',
        documentation:
          '**[optional]** Specifies how to position the menu horizontally:    0 - Center the menu horizontally relative to $iX    1 - Position the menu so that its left side is aligned with $iX    2 - Position the menu so that its right side is aligned with $iX',
      },
      {
        label: '$iAlignY',
        documentation:
          '**[optional]** Specifies how to position the menu vertically:    0 - Position the menu so that its bottom side is aligned with $iY    1 - Position the menu so that its top side is aligned with $iY    2 - Center the menu vertically relative to $iY',
      },
      {
        label: '$iNotify',
        documentation:
          "**[optional]** Use to determine the selection withouta parent window:    1 - Do not send notification messages    2 - Return the menu item identifier of the user's selection",
      },
      {
        label: '$iButtons',
        documentation:
          '**[optional]** Mouse button the shortcut menu tracks:    0 - The user can select items with only the left mouse button    1 - The user can select items with both left and right buttons',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
