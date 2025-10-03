import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlTab.au3>`)';

const signatures = {
  _GUICtrlTab_ActivateTab: {
    documentation: 'Activates a tab by its index',
    label: '_GUICtrlTab_ActivateTab ( $hWnd, $iIndex )',
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
  _GUICtrlTab_ClickTab: {
    documentation: 'Clicks a tab',
    label:
      '_GUICtrlTab_ClickTab ( $hWnd, $iIndex [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 1]]]] )',
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
  _GUICtrlTab_Create: {
    documentation: 'Create a TabControl control',
    label:
      '_GUICtrlTab_Create ( $hWnd, $iX, $iY [, $iWidth = 150 [, $iHeight = 150 [, $iStyle = 0x00000040 [, $iExStyle = 0x00000000]]]] )',
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
          '**[optional]** Control styles:    $TCS_BOTTOM - Tabs appear at the bottom of the control    $TCS_BUTTONS - Tabs appear as buttons, and no border is drawn around the display area    $TCS_FIXEDWIDTH - All tabs are the same width    $TCS_FLATBUTTONS - Selected tabs appear as being indented into the background while other tabs appear as being on the same plane as the background.        This only affects tab controls with the $TCS_BUTTONS style.    $TCS_FOCUSNEVER - The control does not receive the input focus when clicked    $TCS_FOCUSONBUTTONDOWN - The control receives the input focus when clicked    $TCS_FORCEICONLEFT - Icons are aligned with the left edge of each fixed width tab.        This style can only be used with the $TCS_FIXEDWIDTH style.    $TCS_FORCELABELLEFT - Labels are aligned on the left edge of each fixed width tab.        The label is displayed immediately to the right of the icon instead of being centered.        This style can only be used with the    $TCS_FIXEDWIDTH style and it implies the $TCS_FORCEICONLEFT style.    $TCS_HOTTRACK - Items under the pointer are automatically highlighted.        You can check whether or not hot tracking is enabled by calling SystemParametersInfo.    $TCS_MULTILINE - Multiple rows of tabs are displayed, if necessary, so all tabs are visible at once    $TCS_MULTISELECT - Multiple tabs can be selected by holding down the CTRL key when clicking.        This style must be used with the $TCS_BUTTONS style.    $TCS_OWNERDRAWFIXED - The parent window is responsible for drawing tabs    $TCS_RAGGEDRIGHT - Rows of tabs will not be stretched to fill the entire width of the control.        This style is the default.    $TCS_RIGHT - Tabs appear vertically on the right side of controls that use the $TCS_VERTICAL style.        This value equals $TCS_BOTTOM. This style is not supported if you use visual styles.    $TCS_RIGHTJUSTIFY - The width of each tab is increased, if necessary, so that each row of tabs fills the entire width of the tab control.        This style is ignored unless the $TCS_MULTILINE style is also specified.    $TCS_SCROLLOPPOSITE - Unneeded tabs scroll to the opposite side of the control when a tab is selected    $TCS_SINGLELINE - Only one row of tabs is displayed. The user can scroll to see more tabs, if necessary.        This style is the default.    $TCS_TABS - Tabs appear as tabs, and a border is drawn around the display area.        This style is the default.    $TCS_TOOLTIPS - The tab control has a ToolTip control associated with it    $TCS_VERTICAL - Tabs appear at the left side of the control with tab text displayed vertically.        This style is valid only when used with the $TCS_MULTILINE style.        To make tabs appear on the right side of the control, also use the $TCS_RIGHT style.Default: $TCS_HOTTRACKForced: $WS_CHILD, $WS_CLIPSIBLINGS, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended styles:    $TCS_EX_FLATSEPARATORS - The control will draw separators between the tab items    $TCS_EX_REGISTERDROP - The control generates $TCN_GETOBJECT notification messages to request a drop target object when an object is dragged over the tab items.',
      },
    ],
  },
  _GUICtrlTab_DeleteAllItems: {
    documentation: 'Deletes all tabs',
    label: '_GUICtrlTab_DeleteAllItems ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_DeleteItem: {
    documentation: 'Deletes a tab',
    label: '_GUICtrlTab_DeleteItem ( $hWnd, $iIndex )',
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
  _GUICtrlTab_DeselectAll: {
    documentation: 'Resets tabs, clearing any that were set to the pressed state',
    label: '_GUICtrlTab_DeselectAll ( $hWnd [, $bExclude = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bExclude',
        documentation:
          '**[optional]** Exclusion flag:    True - All tabs except for the one currently selected will be reset    False - All tab items will be reset',
      },
    ],
  },
  _GUICtrlTab_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlTab_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_FindTab: {
    documentation: 'Searches for a tab with the specific text',
    label: '_GUICtrlTab_FindTab ( $hWnd, $sText [, $bInStr = False [, $iStart = 0]] )',
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
        documentation: "**[optional]** If True, the text can be anywhere in the tab's text.",
      },
      {
        label: '$iStart',
        documentation: '**[optional]** 0-based index of the tab to start searching from',
      },
    ],
  },
  _GUICtrlTab_GetCurFocus: {
    documentation: 'Returns the index of the item that has the focus in a tab control',
    label: '_GUICtrlTab_GetCurFocus ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetCurSel: {
    documentation: 'Determines the currently selected tab',
    label: '_GUICtrlTab_GetCurSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetDisplayRect: {
    documentation: 'Retrieves the display rectangle of the client area',
    label: '_GUICtrlTab_GetDisplayRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetDisplayRectEx: {
    documentation: 'Retrieves the display rectangle of the client area',
    label: '_GUICtrlTab_GetDisplayRectEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetExtendedStyle: {
    documentation: 'Retrieves the extended styles that are currently in use',
    label: '_GUICtrlTab_GetExtendedStyle ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetImageList: {
    documentation: 'Retrieves the tab control image list',
    label: '_GUICtrlTab_GetImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetItem: {
    documentation: 'Retrieves information about a tab',
    label: '_GUICtrlTab_GetItem ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemCount: {
    documentation: 'Retrieves the number of tabs',
    label: '_GUICtrlTab_GetItemCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetItemImage: {
    documentation: 'Retrieves the image index for a tab',
    label: '_GUICtrlTab_GetItemImage ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemParam: {
    documentation: 'Retrieves the param data for a tab',
    label: '_GUICtrlTab_GetItemParam ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemRect: {
    documentation: 'Retrieves the bounding rectangle for a tab',
    label: '_GUICtrlTab_GetItemRect ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemRectEx: {
    documentation: 'Retrieves the bounding rectangle for a tab',
    label: '_GUICtrlTab_GetItemRectEx ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemState: {
    documentation: 'Retrieves the state of a tab',
    label: '_GUICtrlTab_GetItemState ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetItemText: {
    documentation: 'Retrieves the text of a tab',
    label: '_GUICtrlTab_GetItemText ( $hWnd, $iIndex )',
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
  _GUICtrlTab_GetRowCount: {
    documentation: 'Retrieves the current number of rows of tabs',
    label: '_GUICtrlTab_GetRowCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetToolTips: {
    documentation: 'Retrieves the handle to the ToolTip control associated with the control',
    label: '_GUICtrlTab_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlTab_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlTab_HighlightItem: {
    documentation: 'Sets the highlight state of a tab item',
    label: '_GUICtrlTab_HighlightItem ( $hWnd, $iIndex [, $bHighlight = True] )',
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
        label: '$bHighlight',
        documentation: '**[optional]** If True, the tab is highlighted, otherwise the tab is reset',
      },
    ],
  },
  _GUICtrlTab_HitTest: {
    documentation: 'Determines where a point lies control',
    label: '_GUICtrlTab_HitTest ( $hWnd, $iX, $iY )',
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
  _GUICtrlTab_InsertItem: {
    documentation: 'Inserts a new tab',
    label: '_GUICtrlTab_InsertItem ( $hWnd, $iIndex, $sText [, $iImage = -1 [, $iParam = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Index of the new tab',
      },
      {
        label: '$sText',
        documentation: 'Tab text',
      },
      {
        label: '$iImage',
        documentation: '**[optional]** 0-based tab image index',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application defined data',
      },
    ],
  },
  _GUICtrlTab_RemoveImage: {
    documentation: "Removes an image from the control's image list",
    label: '_GUICtrlTab_RemoveImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the image to remove',
      },
    ],
  },
  _GUICtrlTab_SetCurFocus: {
    documentation: 'Sets the focus to a specified tab',
    label: '_GUICtrlTab_SetCurFocus ( $hWnd, $iIndex )',
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
  _GUICtrlTab_SetCurSel: {
    documentation: 'Selects a tab',
    label: '_GUICtrlTab_SetCurSel ( $hWnd, $iIndex )',
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
  _GUICtrlTab_SetExtendedStyle: {
    documentation: 'Sets the extended styles that are currently in use',
    label: '_GUICtrlTab_SetExtendedStyle ( $hWnd, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStyle',
        documentation:
          'Extended styles currently in use:    $TCS_EX_FLATSEPARATORS - The control will draw separators between the tab items    $TCS_EX_REGISTERDROP - The control generates TCN_GETOBJECT notification messages to request a drop target object when an object is dragged over the tab items.',
      },
    ],
  },
  _GUICtrlTab_SetImageList: {
    documentation: 'Sets the image list associated with a tab control',
    label: '_GUICtrlTab_SetImageList ( $hWnd, $hImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hImage',
        documentation: 'Handle to the image list to assign to the tab control',
      },
    ],
  },
  _GUICtrlTab_SetItem: {
    documentation: 'Sets information about a tab',
    label:
      '_GUICtrlTab_SetItem ( $hWnd, $iIndex [, $sText = -1 [, $iState = -1 [, $iImage = -1 [, $iParam = -1]]]] )',
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
        label: '$sText',
        documentation: '**[optional]** Item text',
      },
      {
        label: '$iState',
        documentation: '**[optional]** Item state',
      },
      {
        label: '$iImage',
        documentation: '**[optional]** 0-based item image',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application defined data',
      },
    ],
  },
  _GUICtrlTab_SetItemImage: {
    documentation: 'Sets the image of a tab',
    label: '_GUICtrlTab_SetItemImage ( $hWnd, $iIndex, $iImage )',
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
        label: '$iImage',
        documentation: '0-based item image',
      },
    ],
  },
  _GUICtrlTab_SetItemParam: {
    documentation: 'Sets the param data of a tab',
    label: '_GUICtrlTab_SetItemParam ( $hWnd, $iIndex, $iParam )',
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
        label: '$iParam',
        documentation: 'Application defined data',
      },
    ],
  },
  _GUICtrlTab_SetItemSize: {
    documentation: 'Sets the width and height of tabs in a fixed width or owner drawn control',
    label: '_GUICtrlTab_SetItemSize ( $hWnd, $iWidth, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'New width, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'New height, in pixels',
      },
    ],
  },
  _GUICtrlTab_SetItemState: {
    documentation: 'Sets the state of a tab',
    label: '_GUICtrlTab_SetItemState ( $hWnd, $iIndex, $iState )',
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
        label: '$iState',
        documentation:
          'Item state. Can be a combination of:    $TCIS_BUTTONPRESSED - The tab control item is selected    $TCIS_HIGHLIGHTED - The tab control item is highlighted',
      },
    ],
  },
  _GUICtrlTab_SetItemText: {
    documentation: 'Sets the text of a tab',
    label: '_GUICtrlTab_SetItemText ( $hWnd, $iIndex, $sText )',
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
        label: '$sText',
        documentation: 'Item text',
      },
    ],
  },
  _GUICtrlTab_SetMinTabWidth: {
    documentation: 'Sets the minimum width of items in a tab control',
    label: '_GUICtrlTab_SetMinTabWidth ( $hWnd, $iMinWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinWidth',
        documentation:
          'Minimum width to be set for a tab control item.If -1, the control will use the default width.',
      },
    ],
  },
  _GUICtrlTab_SetPadding: {
    documentation: "Sets the amount of space around each tab's icon and label",
    label: '_GUICtrlTab_SetPadding ( $hWnd, $iHorz, $iVert )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iHorz',
        documentation: 'Amount of horizontal padding, in pixels',
      },
      {
        label: '$iVert',
        documentation: 'Amount of vertical padding, in pixels',
      },
    ],
  },
  _GUICtrlTab_SetToolTips: {
    documentation: 'Sets the handle to the ToolTip control associated with the control',
    label: '_GUICtrlTab_SetToolTips ( $hWnd, $hToolTip )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hToolTip',
        documentation: 'Handle to the ToolTip control',
      },
    ],
  },
  _GUICtrlTab_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag for the control',
    label: '_GUICtrlTab_SetUnicodeFormat ( $hWnd, $bUnicode )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          'Unicode character flag:    True - Control uses Unicode characters    False - Control uses ANSI characters',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
