import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlHeader.au3>`)';

const signatures = {
  _GUICtrlHeader_AddItem: {
    documentation: 'Adds a new header item',
    label:
      '_GUICtrlHeader_AddItem ( $hWnd, $sText [, $iWidth = 50 [, $iAlign = 0 [, $iImage = -1 [, $bOnRight = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Item text',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Item width',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Text alignment:    0 - Text is left-aligned    1 - Text is right-aligned    2 - Text is centered',
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
  _GUICtrlHeader_ClearFilter: {
    documentation: 'Clears the filter',
    label: '_GUICtrlHeader_ClearFilter ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_ClearFilterAll: {
    documentation: 'Clears all of the filters',
    label: '_GUICtrlHeader_ClearFilterAll ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_Create: {
    documentation: 'Creates a Header control',
    label: '_GUICtrlHeader_Create ( $hWnd [, $iStyle = 0x00000046] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$iStyle',
        documentation: '**[optional]** Control styles',
      },
    ],
  },
  _GUICtrlHeader_CreateDragImage: {
    documentation:
      "Creates a semi-transparent version of an item's image for use as a dragging image",
    label: '_GUICtrlHeader_CreateDragImage ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '0-based item index. The image assigned to the item is the basis for the transparent image.',
      },
    ],
  },
  _GUICtrlHeader_DeleteItem: {
    documentation: 'Deletes a header item',
    label: '_GUICtrlHeader_DeleteItem ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_Destroy: {
    documentation: 'Delete the Header control',
    label: '_GUICtrlHeader_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_EditFilter: {
    documentation: 'Starts editing the specified filter',
    label: '_GUICtrlHeader_EditFilter ( $hWnd, $iIndex [, $bDiscard = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$bDiscard',
        documentation:
          "**[optional]** Flag that specifies how to handle the user's editing changes. Use this flag to specify what to do if the user is in the process of editing the filter when the message is sent:    True - Discard the changes made by the user    False - Accept the changes made by the user",
      },
    ],
  },
  _GUICtrlHeader_GetBitmapMargin: {
    documentation: 'Retrieves the width of the bitmap margin',
    label: '_GUICtrlHeader_GetBitmapMargin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_GetImageList: {
    documentation: 'Retrieves the handle to the image list',
    label: '_GUICtrlHeader_GetImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_GetItem: {
    documentation: 'Retrieves information about an item',
    label: '_GUICtrlHeader_GetItem ( $hWnd, $iIndex, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$tItem',
        documentation: '$tagHDITEM structure',
      },
    ],
  },
  _GUICtrlHeader_GetItemAlign: {
    documentation: 'Retrieves the item text alignment',
    label: '_GUICtrlHeader_GetItemAlign ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemBitmap: {
    documentation: 'Retrieves the item bitmap handle',
    label: '_GUICtrlHeader_GetItemBitmap ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemCount: {
    documentation: 'Retrieves a count of the items',
    label: '_GUICtrlHeader_GetItemCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_GetItemDisplay: {
    documentation: 'Returns the item display information',
    label: '_GUICtrlHeader_GetItemDisplay ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemFlags: {
    documentation: 'Returns the item flag information',
    label: '_GUICtrlHeader_GetItemFlags ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemFormat: {
    documentation: 'Returns the format of the item',
    label: '_GUICtrlHeader_GetItemFormat ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemImage: {
    documentation: 'Retrieves the index of an image within the image list',
    label: '_GUICtrlHeader_GetItemImage ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemOrder: {
    documentation: 'Retrieves the order in which the item appears',
    label: '_GUICtrlHeader_GetItemOrder ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemParam: {
    documentation: 'Retrieves the param value of the item',
    label: '_GUICtrlHeader_GetItemParam ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemRect: {
    documentation: 'Retrieves the bounding rectangle for a given item',
    label: '_GUICtrlHeader_GetItemRect ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemRectEx: {
    documentation: 'Retrieves the bounding rectangle for a given item',
    label: '_GUICtrlHeader_GetItemRectEx ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemText: {
    documentation: 'Retrieves the item text',
    label: '_GUICtrlHeader_GetItemText ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetItemWidth: {
    documentation: "Retrieves the item's width",
    label: '_GUICtrlHeader_GetItemWidth ( $hWnd, $iIndex )',
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
  _GUICtrlHeader_GetOrderArray: {
    documentation: 'Retrieves the current left-to-right order of items in a header control',
    label: '_GUICtrlHeader_GetOrderArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlHeader_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlHeader_HitTest: {
    documentation: 'Tests a point to determine which item is at the specified point',
    label: '_GUICtrlHeader_HitTest ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position to test',
      },
      {
        label: '$iY',
        documentation: 'Y position to text',
      },
    ],
  },
  _GUICtrlHeader_InsertItem: {
    documentation: 'Inserts a new header item',
    label:
      '_GUICtrlHeader_InsertItem ( $hWnd, $iIndex, $sText [, $iWidth = 50 [, $iAlign = 0 [, $iImage = -1 [, $bOnRight = False]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Index of the item after which the new item is to be inserted.The new item is inserted at the end of the control if index is greater than or equal to the number of items in the control.If index is zero, the new item is inserted at the beginning of the control.',
      },
      {
        label: '$sText',
        documentation: 'Item text. See remark.',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Item width',
      },
      {
        label: '$iAlign',
        documentation:
          '**[optional]** Text alignment:    0 - Text is left-aligned    1 - Text is right-aligned    2 - Text is centered',
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
  _GUICtrlHeader_Layout: {
    documentation: 'Retrieves the correct size and position of the control',
    label: '_GUICtrlHeader_Layout ( $hWnd, ByRef $tRECT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the rectangle the control will occupy.',
      },
    ],
  },
  _GUICtrlHeader_OrderToIndex: {
    documentation: 'Retrieves an index value for an item based on its order',
    label: '_GUICtrlHeader_OrderToIndex ( $hWnd, $iOrder )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iOrder',
        documentation:
          'Order in which the item appears within the header control, from left to right',
      },
    ],
  },
  _GUICtrlHeader_SetBitmapMargin: {
    documentation: 'Sets the width of the margin, specified in pixels, of a bitmap',
    label: '_GUICtrlHeader_SetBitmapMargin ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'Width, specified in pixels, of the bitmap margin',
      },
    ],
  },
  _GUICtrlHeader_SetFilterChangeTimeout: {
    documentation: 'Sets the filter change timeout interval',
    label: '_GUICtrlHeader_SetFilterChangeTimeout ( $hWnd, $iTimeOut )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iTimeOut',
        documentation: 'Timeout value, in milliseconds',
      },
    ],
  },
  _GUICtrlHeader_SetHotDivider: {
    documentation: 'Changes the hot divider color',
    label: '_GUICtrlHeader_SetHotDivider ( $hWnd, $iFlag, $iInputValue )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iFlag',
        documentation:
          'Value specifying the type of value represented by $iInputValue.This value can be one of the following:    True - Indicates that $iInputValue holds the client coordinates of the pointer    False - Indicates that $iInputValue holds a divider index value',
      },
      {
        label: '$iInputValue',
        documentation: 'Value interpreted by $iFlag',
      },
    ],
  },
  _GUICtrlHeader_SetImageList: {
    documentation: 'Assigns an image list',
    label: '_GUICtrlHeader_SetImageList ( $hWnd, $hImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hImage',
        documentation: 'Handle to an image list',
      },
    ],
  },
  _GUICtrlHeader_SetItem: {
    documentation: 'Sets information about an item',
    label: '_GUICtrlHeader_SetItem ( $hWnd, $iIndex, ByRef $tItem )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$tItem',
        documentation: 'DllStructCreate($tagHDITEM) structure',
      },
    ],
  },
  _GUICtrlHeader_SetItemAlign: {
    documentation: 'Sets the item text alignment',
    label: '_GUICtrlHeader_SetItemAlign ( $hWnd, $iIndex, $iAlign )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iAlign',
        documentation:
          'Text alignment:    0 - Text is left-aligned    1 - Text is right-aligned    2 - Text is centered',
      },
    ],
  },
  _GUICtrlHeader_SetItemBitmap: {
    documentation: 'Sets the item bitmap handle',
    label: '_GUICtrlHeader_SetItemBitmap ( $hWnd, $iIndex, $hBitmap )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$hBitmap',
        documentation: 'Item bitmap handle',
      },
    ],
  },
  _GUICtrlHeader_SetItemDisplay: {
    documentation: 'Returns the item display information',
    label: '_GUICtrlHeader_SetItemDisplay ( $hWnd, $iIndex, $iDisplay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iDisplay',
        documentation:
          "Item display information. Can be a combination of the following:    1 - The item displays a bitmap    2 - The bitmap appears to the right of text    4 - The control's owner draws the item    8 - The item displays a string",
      },
    ],
  },
  _GUICtrlHeader_SetItemFlags: {
    documentation: 'Returns the item flag information',
    label: '_GUICtrlHeader_SetItemFlags ( $hWnd, $iIndex, $iFlags )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iFlags',
        documentation:
          'Item flag information. Can be a combination of the following:    1 - Displays an image from an image list    2 - Text reads in the opposite direction from the text in the parent window    4 - Draws a down arrow on this item    8 - Draws a up arrow on this item',
      },
    ],
  },
  _GUICtrlHeader_SetItemFormat: {
    documentation: 'Sets the format of the item',
    label: '_GUICtrlHeader_SetItemFormat ( $hWnd, $iIndex, $iFormat )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iFormat',
        documentation:
          "Combination of the following format identifiers:    $HDF_CENTER - The item's contents are centered    $HDF_LEFT - The item's contents are left-aligned    $HDF_RIGHT - The item's contents are right-aligned    $HDF_BITMAP - The item displays a bitmap    $HDF_BITMAP_ON_RIGHT - The bitmap appears to the right of text    $HDF_OWNERDRAW - The header control's owner draws the item    $HDF_STRING - The item displays a string    $HDF_IMAGE - Display an image from an image list    $HDF_RTLREADING - Text will read in the opposite direction from the text in the parent window    $HDF_SORTDOWN - Draws a down-arrow on this item    $HDF_SORTUP - Draws an up-arrow on this item",
      },
    ],
  },
  _GUICtrlHeader_SetItemImage: {
    documentation: 'Sets the index of an image within the image list',
    label: '_GUICtrlHeader_SetItemImage ( $hWnd, $iIndex, $iImage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iImage',
        documentation: '0-based image index',
      },
    ],
  },
  _GUICtrlHeader_SetItemOrder: {
    documentation: 'Sets the order in which the item appears',
    label: '_GUICtrlHeader_SetItemOrder ( $hWnd, $iIndex, $iOrder )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iOrder',
        documentation: '0-based item order',
      },
    ],
  },
  _GUICtrlHeader_SetItemParam: {
    documentation: 'Sets the param value of the item',
    label: '_GUICtrlHeader_SetItemParam ( $hWnd, $iIndex, $iParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iParam',
        documentation: 'Item param value',
      },
    ],
  },
  _GUICtrlHeader_SetItemText: {
    documentation: 'Sets the item text',
    label: '_GUICtrlHeader_SetItemText ( $hWnd, $iIndex, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$sText',
        documentation: 'New item text. See remark.',
      },
    ],
  },
  _GUICtrlHeader_SetItemWidth: {
    documentation: "Sets the item's width",
    label: '_GUICtrlHeader_SetItemWidth ( $hWnd, $iIndex, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based item index',
      },
      {
        label: '$iWidth',
        documentation: 'New width for item',
      },
    ],
  },
  _GUICtrlHeader_SetOrderArray: {
    documentation: 'Sets the current left-to-right order of items',
    label: '_GUICtrlHeader_SetOrderArray ( $hWnd, ByRef $aOrder )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aOrder',
        documentation:
          'Array that specifies the index values for items in the header:    [0] - Number of items in array    [1] - Item index 1    [2] - Item index 2    [n] - Item index n',
      },
    ],
  },
  _GUICtrlHeader_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag for the control',
    label: '_GUICtrlHeader_SetUnicodeFormat ( $hWnd, $bUnicode )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          'Unicode flag:    True - Control uses Unicode characters    False - Control uses ANSI characters',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
