import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlToolbar.au3>`)';

const signatures = {
  _GUICtrlToolbar_AddBitmap: {
    documentation: 'Adds images to the image list',
    label: '_GUICtrlToolbar_AddBitmap ( $hWnd, $iButtons, $hInst, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iButtons',
        documentation: 'Number of button images in the bitmap',
      },
      {
        label: '$hInst',
        documentation:
          'Handle to the module instance with the executable file that contains a bitmap resource.To use bitmap handles instead of resource IDs, set this to 0. You can add system defined button bitmaps to the list by specifying -1 as the $hInst member and one of the following values as the $iID member:    $IDB_STD_LARGE_COLOR - Adds large, color standard bitmaps    $IDB_STD_SMALL_COLOR - Adds small, color standard bitmaps    $IDB_VIEW_LARGE_COLOR - Adds large, color view bitmaps    $IDB_VIEW_SMALL_COLOR - Adds small, color view bitmaps',
      },
      {
        label: '$iID',
        documentation:
          'If $hInst is 0, set this member to the bitmap handle of the bitmap with the button images.Otherwise, set it to the resource identifier of the bitmap with the button images.The following are resource IDs to the standard and view bitmaps:    $STD_COPY - Copy image    $STD_CUT - Cut image    $STD_DELETE - Delete image    $STD_FILENEW - New file image    $STD_FILEOPEN - Open file image    $STD_FILESAVE - Save file image    $STD_FIND - Find image    $STD_HELP - Help image    $STD_PASTE - Paste image    $STD_PRINT - Print image    $STD_PRINTPRE - Print preview image    $STD_PROPERTIES - Properties image    $STD_REDOW - Redo image    $STD_REPLACE - Replace image    $STD_UNDO - Undo image    $VIEW_DETAILS - View details image    $VIEW_LARGEICONS - View large icons image    $VIEW_LIST - View list image    $VIEW_SMALLICONS - View small icons image.    $VIEW_SORTDATE - Sort by date image.    $VIEW_SORTNAME - Sort by name image.    $VIEW_SORTSIZE - Sort by size image.    $VIEW_SORTTYPE - Sort by type image.',
      },
    ],
  },
  _GUICtrlToolbar_AddButton: {
    documentation: 'Adds a button',
    label:
      '_GUICtrlToolbar_AddButton ( $hWnd, $iID, $iImage [, $iString = 0 [, $iStyle = 0 [, $iState = 4 [, $iParam = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iID',
        documentation: 'Command ID',
      },
      {
        label: '$iImage',
        documentation:
          '0-based index of the button image.Set this parameter to -1 and the control will send the $TBN_GETDISPINFO notification to retrieve the image index when it is needed.Set this to -2 to indicate that the button does not have an image.The button layout will only include space for the text.If the button is a separator, this is the width of the separator, in pixels.',
      },
      {
        label: '$iString',
        documentation:
          '**[optional]** 0-based index of the button string that was set with AddString',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Button style. Can be a combination of the following:    $BTNS_AUTOSIZE - The toolbar control should not assign the standard width to the button    $BTNS_BUTTON - Standard button (Default)    $BTNS_CHECK - Toggles between the pressed and nonpressed    $BTNS_CHECKGROUP - Button that stays pressed until another button in the group is pressed    $BTNS_DROPDOWN - Creates a drop-down style button that can display a list    $BTNS_GROUP - Button that stays pressed until another button in the group is pressed    $BTNS_NOPREFIX - The button text will not have an accelerator prefix    $BTNS_SEP - Creates a separator    $BTNS_SHOWTEXT - Specifies that button text should be displayed    $BTNS_WHOLEDROPDOWN - Specifies that the button will have a drop-down arrow',
      },
      {
        label: '$iState',
        documentation:
          "**[optional]** Button state. Can be a combination of the following:    $TBSTATE_CHECKED - The button has the $TBSTYLE_CHECK style and is being clicked    $TBSTATE_PRESSED - The button is being clicked    $TBSTATE_ENABLED - The button accepts user input    $TBSTATE_HIDDEN - The button is not visible and cannot receive user input    $TBSTATE_INDETERMINATE - The button is grayed    $TBSTATE_WRAP - The button is followed by a line break    $TBSTATE_ELLIPSES - The button's text is cut off and an ellipsis is displayed    $TBSTATE_MARKED - The button is marked",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application-defined value',
      },
    ],
  },
  _GUICtrlToolbar_AddButtonSep: {
    documentation: 'Adds a separator',
    label: '_GUICtrlToolbar_AddButtonSep ( $hWnd [, $iWidth = 6] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to toolbar',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Separator width',
      },
    ],
  },
  _GUICtrlToolbar_AddString: {
    documentation: "Adds a new string to the toolbar's string pool",
    label: '_GUICtrlToolbar_AddString ( $hWnd, $sString )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sString',
        documentation: 'String to add',
      },
    ],
  },
  _GUICtrlToolbar_ButtonCount: {
    documentation: 'Retrieves a count of the buttons',
    label: '_GUICtrlToolbar_ButtonCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_CheckButton: {
    documentation: 'Checks or unchecks a given button',
    label: '_GUICtrlToolbar_CheckButton ( $hWnd, $iCommandID [, $bCheck = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bCheck',
        documentation:
          '**[optional]** Check state:    True - Button will be checked    False - Button will be unchecked',
      },
    ],
  },
  _GUICtrlToolbar_ClickAccel: {
    documentation: "Clicks a specific button using it's accelerator",
    label:
      '_GUICtrlToolbar_ClickAccel ( $hWnd, $sAccelKey [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sAccelKey',
        documentation: 'Button accelerator',
      },
      {
        label: '$sButton',
        documentation: '**[optional]** Button to click',
      },
      {
        label: '$bMove',
        documentation:
          '**[optional]** Mouse movement flag:    True - Mouse will be moved    False - Mouse will not be moved',
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
  _GUICtrlToolbar_ClickButton: {
    documentation: 'Clicks a specific button',
    label:
      '_GUICtrlToolbar_ClickButton ( $hWnd, $iCommandID [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$sButton',
        documentation: '**[optional]** Button to click',
      },
      {
        label: '$bMove',
        documentation:
          '**[optional]** Mouse movement flag:    True - Mouse will be moved    False - Mouse will not be moved',
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
  _GUICtrlToolbar_ClickIndex: {
    documentation: "Clicks a specific button using it's index",
    label:
      '_GUICtrlToolbar_ClickIndex ( $hWnd, $iIndex [, $sButton = "left" [, $bMove = False [, $iClicks = 1 [, $iSpeed = 1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Button index',
      },
      {
        label: '$sButton',
        documentation: '**[optional]** Button to click',
      },
      {
        label: '$bMove',
        documentation:
          '**[optional]** Mouse movement flag:    True - Mouse will be moved    False - Mouse will not be moved',
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
  _GUICtrlToolbar_CommandToIndex: {
    documentation:
      'Retrieves the index for the button associated with the specified command identifier',
    label: '_GUICtrlToolbar_CommandToIndex ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_Create: {
    documentation: 'Create a Toolbar control',
    label: '_GUICtrlToolbar_Create ( $hWnd [, $iStyle = 0x00000800 [, $iExStyle = 0x00000000]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Control styles:    $TBSTYLE_ALTDRAG - Allows users to change a toolbar button\'s position by dragging it while holding down the ALT key.        If this style is not specified, the user must hold down the SHIFT key while dragging a button.        Note that the $CCS_ADJUSTABLE style must be specified to enable toolbar buttons to be dragged.    $TBSTYLE_CUSTOMERASE - Generates $NM_CUSTOMDRAW messages when the toolbar processes $WM_ERASEBKGND messages    $TBSTYLE_FLAT - Creates a flat toolbar    $TBSTYLE_LIST - Creates a flat toolbar with button text to the right of the bitmap    $TBSTYLE_REGISTERDROP - Generates $TBN_GETOBJECT notification messages to request drop target objects when the cursor passes over toolbar buttons.    $TBSTYLE_TOOLTIPS - Creates a ToolTip control that an application can use to display descriptive text for the buttons in the toolbar.    $TBSTYLE_TRANSPARENT - Creates a transparent toolbar. In a transparent toolbar, the toolbar is transparent but the buttons are not.        Button text appears under button bitmaps. To prevent repainting problems, this style should be set before the toolbar control becomes visible.    $TBSTYLE_WRAPABLE - Creates a toolbar that can have multiple lines of buttons.        Toolbar buttons can "wrap" to the next line when the toolbar becomes too narrow to include all buttons on the same line.        When the toolbar is wrapped, the break will occur on either the rightmost separator or the rightmost button if there are no separators on the bar.        This style must be set to display a vertical toolbar control when the toolbar is part of a vertical rebar control.Default: $TBSTYLE_FLATForced: $WS_CHILD, $WS_CLIPSIBLINGS, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          "**[optional]** Control extended styles:    $TBSTYLE_EX_DRAWDDARROWS - Allows buttons to have a separate dropdown arrow. Buttons that have the    $BTNS_DROPDOWN style will be drawn with a drop down arrow in a separate section, to the right of the button.        If the arrow is clicked, only the arrow portion of the button will depress, and the toolbar control will send a $TBN_DROPDOWN notification to prompt the application to display the dropdown menu.        If the main part of the button is clicked, the toolbar control sends a $WM_COMMAND message with the button's ID.    $TBSTYLE_EX_HIDECLIPPEDBUTTONS - Hides partially clipped buttons    $TBSTYLE_EX_DOUBLEBUFFER - Requires the toolbar to be double buffered    $TBSTYLE_EX_MIXEDBUTTONS - Allows you to set text for all buttons, but only display it for the buttons with the $BTNS_SHOWTEXT button style.        The $TBSTYLE_LIST style must also be set.        Normally, when a button does not display text, you must handle $TBN_GETINFOTIP to display a ToolTip.        With the $TBSTYLE_EX_MIXEDBUTTONS extended style, text that is set but not displayed on a button will automatically be used as the button's ToolTip text.        You only need to handle $TBN_GETINFOTIP if it needs more flexibility in specifying the ToolTip text.",
      },
    ],
  },
  _GUICtrlToolbar_Customize: {
    documentation: 'Displays the Customize Toolbar dialog box',
    label: '_GUICtrlToolbar_Customize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_DeleteButton: {
    documentation: 'Deletes a button from the toolbar',
    label: '_GUICtrlToolbar_DeleteButton ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlToolbar_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_EnableButton: {
    documentation: 'Enables or disables the specified button',
    label: '_GUICtrlToolbar_EnableButton ( $hWnd, $iCommandID [, $bEnable = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** Enable flag:    True - Button will be enabled    False - Button will be disabled',
      },
    ],
  },
  _GUICtrlToolbar_FindToolbar: {
    documentation: 'Finds a specific toolbar',
    label: '_GUICtrlToolbar_FindToolbar ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window handle or text of window',
      },
      {
        label: '$sText',
        documentation: 'Button text to search for',
      },
    ],
  },
  _GUICtrlToolbar_GetAnchorHighlight: {
    documentation: 'Retrieves the anchor highlight setting',
    label: '_GUICtrlToolbar_GetAnchorHighlight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetBitmapFlags: {
    documentation: 'Retrieves the flags that describe the type of bitmap to be used',
    label: '_GUICtrlToolbar_GetBitmapFlags ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonBitmap: {
    documentation: 'Retrieves the index of the bitmap associated with a button',
    label: '_GUICtrlToolbar_GetButtonBitmap ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonInfo: {
    documentation: 'Retrieves information for a button',
    label: '_GUICtrlToolbar_GetButtonInfo ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonInfoEx: {
    documentation: 'Retrieves extended information for a button',
    label: '_GUICtrlToolbar_GetButtonInfoEx ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonParam: {
    documentation: 'Retrieves the button param value',
    label: '_GUICtrlToolbar_GetButtonParam ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonRect: {
    documentation: 'Retrieves the bounding rectangle for a button',
    label: '_GUICtrlToolbar_GetButtonRect ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonRectEx: {
    documentation: 'Retrieves the bounding rectangle for a specified toolbar button',
    label: '_GUICtrlToolbar_GetButtonRectEx ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonSize: {
    documentation: 'Retrieves the current button width and height, in pixels',
    label: '_GUICtrlToolbar_GetButtonSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonState: {
    documentation: 'Retrieves information about the state of the specified button',
    label: '_GUICtrlToolbar_GetButtonState ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonStyle: {
    documentation: 'Retrieves the style flags of a button',
    label: '_GUICtrlToolbar_GetButtonStyle ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetButtonText: {
    documentation: 'Retrieves the display text of a button',
    label: '_GUICtrlToolbar_GetButtonText ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_GetColorScheme: {
    documentation: 'Retrieves the color scheme information',
    label: '_GUICtrlToolbar_GetColorScheme ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetDisabledImageList: {
    documentation: 'Retrieves the disabled button image list',
    label: '_GUICtrlToolbar_GetDisabledImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetExtendedStyle: {
    documentation: 'Retrieves the extended styles',
    label: '_GUICtrlToolbar_GetExtendedStyle ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetHotImageList: {
    documentation: 'Retrieves the hot button image list',
    label: '_GUICtrlToolbar_GetHotImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetHotItem: {
    documentation: 'Retrieves the index of the hot item',
    label: '_GUICtrlToolbar_GetHotItem ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetImageList: {
    documentation: 'Retrieves the default state image list',
    label: '_GUICtrlToolbar_GetImageList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetInsertMark: {
    documentation: 'Retrieves the current insertion mark',
    label: '_GUICtrlToolbar_GetInsertMark ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetInsertMarkColor: {
    documentation: 'Retrieves the color used to draw the insertion mark',
    label: '_GUICtrlToolbar_GetInsertMarkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetMaxSize: {
    documentation: 'Retrieves the total size of all of the visible buttons and separators',
    label: '_GUICtrlToolbar_GetMaxSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetMetrics: {
    documentation: 'Retrieves the metrics of a toolbar control',
    label: '_GUICtrlToolbar_GetMetrics ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetPadding: {
    documentation: 'Retrieves the horizontal and vertical padding',
    label: '_GUICtrlToolbar_GetPadding ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetRows: {
    documentation: 'Retrieves the number of rows of buttons',
    label: '_GUICtrlToolbar_GetRows ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetString: {
    documentation: 'Retrieves a string from the string pool',
    label: '_GUICtrlToolbar_GetString ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Index of the string',
      },
    ],
  },
  _GUICtrlToolbar_GetStyle: {
    documentation: 'Retrieves the styles currently in use for a toolbar control',
    label: '_GUICtrlToolbar_GetStyle ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleAltDrag: {
    documentation: 'Indicates that the control allows buttons to be dragged',
    label: '_GUICtrlToolbar_GetStyleAltDrag ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleCustomErase: {
    documentation: 'Indicates that the control generates NM_CUSTOMDRAW notification messages',
    label: '_GUICtrlToolbar_GetStyleCustomErase ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleFlat: {
    documentation: 'Indicates that the control is flat',
    label: '_GUICtrlToolbar_GetStyleFlat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleList: {
    documentation: 'Indicates that the control has button text to the right of the bitmap',
    label: '_GUICtrlToolbar_GetStyleList ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleRegisterDrop: {
    documentation: 'Indicates that the control generates TBN_GETOBJECT notification messages',
    label: '_GUICtrlToolbar_GetStyleRegisterDrop ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleToolTips: {
    documentation: 'Indicates that the control has tooltips',
    label: '_GUICtrlToolbar_GetStyleToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleTransparent: {
    documentation: 'Indicates that the control is transparent',
    label: '_GUICtrlToolbar_GetStyleTransparent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetStyleWrapable: {
    documentation: 'Indicates that the control is wrapable',
    label: '_GUICtrlToolbar_GetStyleWrapable ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetTextRows: {
    documentation: 'Retrieves the maximum number of text rows that can be displayed on a button',
    label: '_GUICtrlToolbar_GetTextRows ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetToolTips: {
    documentation: 'Retrieves the handle to the ToolTip control',
    label: '_GUICtrlToolbar_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag',
    label: '_GUICtrlToolbar_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlToolbar_HideButton: {
    documentation: 'Hides or shows the specified button',
    label: '_GUICtrlToolbar_HideButton ( $hWnd, $iCommandID [, $bHide = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bHide',
        documentation:
          '**[optional]** State indicator:    True - Button will be hidden    False - Button will be made visible',
      },
    ],
  },
  _GUICtrlToolbar_HighlightButton: {
    documentation: 'Sets the highlight state of a given button control',
    label: '_GUICtrlToolbar_HighlightButton ( $hWnd, $iCommandID [, $bHighlight = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bHighlight',
        documentation:
          '**[optional]** Highlight state:    True - Button will be highlighted    False - Button will be unhighlighted',
      },
    ],
  },
  _GUICtrlToolbar_HitTest: {
    documentation: 'Determines where a point lies within the control',
    label: '_GUICtrlToolbar_HitTest ( $hWnd, $iX, $iY )',
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
        documentation: 'Y position to test',
      },
    ],
  },
  _GUICtrlToolbar_IndexToCommand: {
    documentation: 'Retrieves the command identifier associated with the button',
    label: '_GUICtrlToolbar_IndexToCommand ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'Button index',
      },
    ],
  },
  _GUICtrlToolbar_InsertButton: {
    documentation: 'Inserts a button',
    label:
      '_GUICtrlToolbar_InsertButton ( $hWnd, $iIndex, $iID, $iImage [, $sText = "" [, $iStyle = 0 [, $iState = 4 [, $iParam = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of a button',
      },
      {
        label: '$iID',
        documentation: 'Command ID',
      },
      {
        label: '$iImage',
        documentation: '0-based image index',
      },
      {
        label: '$sText',
        documentation: '**[optional]** Button text',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Button style. Can be a combination of the following:    $BTNS_AUTOSIZE - The toolbar control should not assign the standard width to the button    $BTNS_BUTTON - Standard button    $BTNS_CHECK - Toggles between the pressed and nonpressed    $BTNS_CHECKGROUP - Button that stays pressed until another button in the group is pressed    $BTNS_DROPDOWN - Creates a drop-down style button that can display a list    $BTNS_GROUP - Button that stays pressed until another button in the group is pressed    $BTNS_NOPREFIX - The button text will not have an accelerator prefix    $BTNS_SEP - Creates a separator    $BTNS_SHOWTEXT - Specifies that button text should be displayed    $BTNS_WHOLEDROPDOWN - Specifies that the button will have a drop-down arrow',
      },
      {
        label: '$iState',
        documentation:
          "**[optional]** Button state. Can be a combination of the following:    $TBSTATE_CHECKED - The button has the $TBSTYLE_CHECK style and is being clicked    $TBSTATE_PRESSED - The button is being clicked    $TBSTATE_ENABLED - The button accepts user input    $TBSTATE_HIDDEN - The button is not visible and cannot receive user input    $TBSTATE_INDETERMINATE - The button is grayed    $TBSTATE_WRAP - The button is followed by a line break    $TBSTATE_ELLIPSES - The button's text is cut off and an ellipsis is displayed    $TBSTATE_MARKED - The button is marked",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application-defined value',
      },
    ],
  },
  _GUICtrlToolbar_InsertMarkHitTest: {
    documentation: 'Retrieves the insertion mark information for a point',
    label: '_GUICtrlToolbar_InsertMarkHitTest ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'X position relative to the client area',
      },
      {
        label: '$iY',
        documentation: 'Y position relative to the client area',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonChecked: {
    documentation: 'Indicates whether the specified button is checked',
    label: '_GUICtrlToolbar_IsButtonChecked ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonEnabled: {
    documentation: 'Indicates whether the specified button is enabled',
    label: '_GUICtrlToolbar_IsButtonEnabled ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonHidden: {
    documentation: 'Indicates whether the specified button is hidden',
    label: '_GUICtrlToolbar_IsButtonHidden ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonHighlighted: {
    documentation: 'Indicates whether the specified button is hilighted',
    label: '_GUICtrlToolbar_IsButtonHighlighted ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonIndeterminate: {
    documentation: 'Indicates whether the specified button is indeterminate',
    label: '_GUICtrlToolbar_IsButtonIndeterminate ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_IsButtonPressed: {
    documentation: 'Indicates that the button is being clicked',
    label: '_GUICtrlToolbar_IsButtonPressed ( $hWnd, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
    ],
  },
  _GUICtrlToolbar_LoadBitmap: {
    documentation: 'Adds a bitmap to the image list from a file',
    label: '_GUICtrlToolbar_LoadBitmap ( $hWnd, $sFileName )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to toolbar',
      },
      {
        label: '$sFileName',
        documentation: 'Fully qualified path to bitmap file',
      },
    ],
  },
  _GUICtrlToolbar_LoadImages: {
    documentation: "Loads system defined button images into a toolbar control's image list",
    label: '_GUICtrlToolbar_LoadImages ( $hWnd, $iBitMapID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iBitMapID',
        documentation:
          'Identifier of a system-defined button image list. Can be set to one of the following values:    $IDB_HIST_LARGE_COLOR    $IDB_HIST_SMALL_COLOR    $IDB_STD_LARGE_COLOR    $IDB_STD_SMALL_COLOR    $IDB_VIEW_LARGE_COLOR    $IDB_VIEW_SMALL_COLOR    $IDB_HIST_NORMAL    $IDB_HIST_HOT    $IDB_HIST_DISABLED    $IDB_HIST_PRESSED',
      },
    ],
  },
  _GUICtrlToolbar_MapAccelerator: {
    documentation: 'Determines the ID of the button that corresponds to the specified accelerator',
    label: '_GUICtrlToolbar_MapAccelerator ( $hWnd, $sAccelKey )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sAccelKey',
        documentation: 'Accelerator character',
      },
    ],
  },
  _GUICtrlToolbar_MoveButton: {
    documentation: 'Moves a button from one index to another',
    label: '_GUICtrlToolbar_MoveButton ( $hWnd, $iOldPos, $iNewPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iOldPos',
        documentation: '0-based index of the button to be moved',
      },
      {
        label: '$iNewPos',
        documentation: '0-based index where the button will be moved',
      },
    ],
  },
  _GUICtrlToolbar_PressButton: {
    documentation: 'Presses or releases the specified button',
    label: '_GUICtrlToolbar_PressButton ( $hWnd, $iCommandID [, $bPress = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bPress',
        documentation:
          '**[optional]** Pressed state:    True - Button will be set to a pressed state    False - Button will be set to an unpressed state',
      },
    ],
  },
  _GUICtrlToolbar_SetAnchorHighlight: {
    documentation: 'Sets the anchor highlight setting',
    label: '_GUICtrlToolbar_SetAnchorHighlight ( $hWnd, $bAnchor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bAnchor',
        documentation:
          'Anchor highlighting setting:    True - Anchor highlighting will be enabled    False - Anchor highlighting will be disabled',
      },
    ],
  },
  _GUICtrlToolbar_SetBitmapSize: {
    documentation: 'Sets the size of the bitmapped images to be added to a toolbar',
    label: '_GUICtrlToolbar_SetBitmapSize ( $hWnd, $iWidth, $iHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iWidth',
        documentation: 'Width, in pixels, of the bitmapped images',
      },
      {
        label: '$iHeight',
        documentation: 'Height, in pixels, of the bitmapped images',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonBitMap: {
    documentation: 'Sets the index of the bitmap associated with a button',
    label: '_GUICtrlToolbar_SetButtonBitMap ( $hWnd, $iCommandID, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of an images image list',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonInfo: {
    documentation: 'Sets information for a button',
    label:
      '_GUICtrlToolbar_SetButtonInfo ( $hWnd, $iCommandID [, $iImage = -3 [, $iState = -1 [, $iStyle = -1 [, $iWidth = -1 [, $iParam = -1]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$iImage',
        documentation:
          '**[optional]** 0-based index of the button image.Set this parameter to -1 and the control will send the $TBN_GETDISPINFO notification to retrieve the image index when it is needed.Set this to -2 to indicate that the button does not have an image.The button layout will only include space for the text.If the button is a separator, this is the width of the separator, in pixels.',
      },
      {
        label: '$iState',
        documentation:
          "**[optional]** Button state. Can be a combination of the following:    $TBSTATE_CHECKED - The button being clicked    $TBSTATE_PRESSED - The button is being clicked    $TBSTATE_ENABLED - The button accepts user input    $TBSTATE_HIDDEN - The button is not visible    $TBSTATE_INDETERMINATE - The button is grayed    $TBSTATE_WRAP - The button is followed by a line break    $TBSTATE_ELLIPSES - The button's text is cut off    $TBSTATE_MARKED - The button is marked",
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Button style. Can be a combination of the following:    $BTNS_AUTOSIZE - The control should not assign the standard width    $BTNS_BUTTON - Standard button    $BTNS_CHECK - Toggles between the pressed and nonpressed    $BTNS_CHECKGROUP - Button that stays pressed until another button is pressed    $BTNS_DROPDOWN - Creates a drop-down style button that can display a list    $BTNS_GROUP - Button that stays pressed until another button is pressed    $BTNS_NOPREFIX - The button text will not have an accelerator prefix    $BTNS_SEP - Creates a separator    $BTNS_SHOWTEXT - Specifies that button text should be displayed    $BTNS_WHOLEDROPDOWN - Specifies that the button will have a drop-down arrow',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Button width',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application-defined value',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonInfoEx: {
    documentation: 'Sets extended information for a button',
    label: '_GUICtrlToolbar_SetButtonInfoEx ( $hWnd, $iCommandID, $tButton )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$tButton',
        documentation: '$tagTBBUTTONINFO structure',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonParam: {
    documentation: 'Sets the button param value',
    label: '_GUICtrlToolbar_SetButtonParam ( $hWnd, $iCommandID, $iParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$iParam',
        documentation: 'Application-defined value',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonSize: {
    documentation: 'Sets the size of the buttons to be added to a toolbar',
    label: '_GUICtrlToolbar_SetButtonSize ( $hWnd, $iHeight, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iHeight',
        documentation: 'Height, in pixels, of the buttons',
      },
      {
        label: '$iWidth',
        documentation: 'Width, in pixels, of the buttons',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonState: {
    documentation: 'Sets information about the state of the specified button',
    label: '_GUICtrlToolbar_SetButtonState ( $hWnd, $iCommandID, $iState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$iState',
        documentation:
          "Button state. Can be one or more of the following:    $TBSTATE_CHECKED - The button has the $TBSTYLE_CHECK style and is being clicked    $TBSTATE_PRESSED - The button is being clicked    $TBSTATE_ENABLED - The button accepts user input    $TBSTATE_HIDDEN - The button is not visible and cannot receive user input    $TBSTATE_INDETERMINATE - The button is grayed    $TBSTATE_WRAP - The button is followed by a line break    $TBSTATE_ELLIPSES - The button's text is cut off and an ellipsis is displayed    $TBSTATE_MARKED - The button is marked",
      },
    ],
  },
  _GUICtrlToolbar_SetButtonStyle: {
    documentation: 'Sets the style flags of a button',
    label: '_GUICtrlToolbar_SetButtonStyle ( $hWnd, $iCommandID, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$iStyle',
        documentation:
          'Button style. Can be one or more of the following:    $BTNS_AUTOSIZE - The toolbar control should not assign the standard width to the button    $BTNS_CHECK - Toggles between the pressed and nonpressed    $BTNS_CHECKGROUP - Button that stays pressed until another button in the group is pressed    $BTNS_DROPDOWN - Drop-down style button that can display a list    $BTNS_GROUP - Button that stays pressed until another button in the group is pressed    $BTNS_NOPREFIX - The button text will not have an accelerator prefix    $BTNS_SEP - Separator    $BTNS_SHOWTEXT - Button text should be displayed    $BTNS_WHOLEDROPDOWN - The button has a drop-down arrow',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonText: {
    documentation: 'Sets the display text of a button',
    label: '_GUICtrlToolbar_SetButtonText ( $hWnd, $iCommandID, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$sText',
        documentation: 'Button text',
      },
    ],
  },
  _GUICtrlToolbar_SetButtonWidth: {
    documentation: 'Sets the minimum and maximum button widths in the toolbar control',
    label: '_GUICtrlToolbar_SetButtonWidth ( $hWnd, $iMin, $iMax )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iMin',
        documentation: 'Minimum button width, in pixels',
      },
      {
        label: '$iMax',
        documentation: 'Maximum button width, in pixels',
      },
    ],
  },
  _GUICtrlToolbar_SetCmdID: {
    documentation: 'Sets the command identifier of a toolbar button',
    label: '_GUICtrlToolbar_SetCmdID ( $hWnd, $iIndex, $iCommandID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the button whose command identifier is to be set',
      },
      {
        label: '$iCommandID',
        documentation: 'Command identifier',
      },
    ],
  },
  _GUICtrlToolbar_SetColorScheme: {
    documentation: 'Sets the color scheme information',
    label: '_GUICtrlToolbar_SetColorScheme ( $hWnd, $iHighlight, $iShadow )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iHighlight',
        documentation: 'Highlight color',
      },
      {
        label: '$iShadow',
        documentation: 'Shadow color',
      },
    ],
  },
  _GUICtrlToolbar_SetDisabledImageList: {
    documentation: 'Sets the disabled image list',
    label: '_GUICtrlToolbar_SetDisabledImageList ( $hWnd, $hImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hImageList',
        documentation: 'Handle to the image list that will be set',
      },
    ],
  },
  _GUICtrlToolbar_SetDrawTextFlags: {
    documentation: 'Sets the text drawing flags for the toolbar',
    label: '_GUICtrlToolbar_SetDrawTextFlags ( $hWnd, $iMask, $iDTFlags )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iMask',
        documentation:
          'One or more of the DT_ flags, specified in DrawText, that indicate which bits in $iDTFlags will be used when drawing the text.',
      },
      {
        label: '$iDTFlags',
        documentation:
          'One or more of the DT_ flags, specified in DrawText, that indicate how the button text will be drawn. This value will be passed to the DrawText API when the button text is drawn.',
      },
    ],
  },
  _GUICtrlToolbar_SetExtendedStyle: {
    documentation: 'Sets the extended styles control',
    label: '_GUICtrlToolbar_SetExtendedStyle ( $hWnd, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iStyle',
        documentation:
          'Control extended styles. Can be one or more of the following:    $TBSTYLE_EX_DRAWDDARROWS - Allows buttons to have a separate dropdown arrow    $TBSTYLE_EX_MIXEDBUTTONS - Allows mixing buttons with text and images    $TBSTYLE_EX_HIDECLIPPEDBUTTONS - Hides partially clipped buttons    $TBSTYLE_EX_DOUBLEBUFFER - Requires the toolbar to be double buffered',
      },
    ],
  },
  _GUICtrlToolbar_SetHotImageList: {
    documentation: 'Sets the hot button image list',
    label: '_GUICtrlToolbar_SetHotImageList ( $hWnd, $hImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hImageList',
        documentation: 'Handle to the image list that will be set',
      },
    ],
  },
  _GUICtrlToolbar_SetHotItem: {
    documentation: 'Sets the hot item',
    label: '_GUICtrlToolbar_SetHotItem ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Index of the item that will be made hot. If this value is -1, none of the items will be hot.',
      },
    ],
  },
  _GUICtrlToolbar_SetImageList: {
    documentation: 'Sets the default button image list',
    label: '_GUICtrlToolbar_SetImageList ( $hWnd, $hImageList )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hImageList',
        documentation:
          'Handle to the image list to set. If this parameter is 0, no images are displayed in the buttons.',
      },
    ],
  },
  _GUICtrlToolbar_SetIndent: {
    documentation: 'Sets the indentation for the first button control',
    label: '_GUICtrlToolbar_SetIndent ( $hWnd, $iIndent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndent',
        documentation: 'Indentation in pixels',
      },
    ],
  },
  _GUICtrlToolbar_SetIndeterminate: {
    documentation: 'Sets or clears the indeterminate state of the specified button',
    label: '_GUICtrlToolbar_SetIndeterminate ( $hWnd, $iCommandID [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCommandID',
        documentation: 'Button command ID',
      },
      {
        label: '$bState',
        documentation: '**[optional]** True if indeterminate, otherwise False',
      },
    ],
  },
  _GUICtrlToolbar_SetInsertMark: {
    documentation: 'Sets the current insertion mark for the toolbar',
    label: '_GUICtrlToolbar_SetInsertMark ( $hWnd, $iButton [, $iFlags = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iButton',
        documentation: '0-based index of the insertion mark. If -1, there is no mark.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Defines where the insertion mark is in relation to $iButton:    0 - Left of the specified button    1 - Right of the specified button    2 - Background of the toolbar',
      },
    ],
  },
  _GUICtrlToolbar_SetInsertMarkColor: {
    documentation: 'Sets the color used to draw the insertion mark',
    label: '_GUICtrlToolbar_SetInsertMarkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iColor',
        documentation: 'Insertion mark color',
      },
    ],
  },
  _GUICtrlToolbar_SetMaxTextRows: {
    documentation: 'Sets the maximum number of text rows displayed button',
    label: '_GUICtrlToolbar_SetMaxTextRows ( $hWnd, $iMaxRows )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iMaxRows',
        documentation: 'Maximum number of rows of text that can be displayed',
      },
    ],
  },
  _GUICtrlToolbar_SetMetrics: {
    documentation: 'Sets the metrics of a toolbar control',
    label: '_GUICtrlToolbar_SetMetrics ( $hWnd, $iXPad, $iYPad, $iXSpacing, $iYSpacing )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iXPad',
        documentation: 'Width of the padding inside the toolbar buttons',
      },
      {
        label: '$iYPad',
        documentation: 'Height of the padding inside the toolbar buttons',
      },
      {
        label: '$iXSpacing',
        documentation: 'Width of the space between toolbar buttons',
      },
      {
        label: '$iYSpacing',
        documentation: 'Height of the space between toolbar buttons',
      },
    ],
  },
  _GUICtrlToolbar_SetPadding: {
    documentation: 'Sets the padding control',
    label: '_GUICtrlToolbar_SetPadding ( $hWnd, $iCX, $iCY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCX',
        documentation: 'The horizontal padding, in pixels',
      },
      {
        label: '$iCY',
        documentation: 'The vertical padding, in pixels',
      },
    ],
  },
  _GUICtrlToolbar_SetParent: {
    documentation: 'Sets the window to which the control sends notification messages',
    label: '_GUICtrlToolbar_SetParent ( $hWnd, $hParent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hParent',
        documentation: 'Handle to the window to receive notification messages',
      },
    ],
  },
  _GUICtrlToolbar_SetRows: {
    documentation: 'Sets the number of rows of buttons',
    label: '_GUICtrlToolbar_SetRows ( $hWnd, $iRows [, $bLarger = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iRows',
        documentation:
          'Number of rows requested. The minimum number of rows is one, and the maximum number of rows is equal to the total number of buttons.',
      },
      {
        label: '$bLarger',
        documentation:
          '**[optional]** Flag that indicates whether to create more rows than requested when the system can not create the number of rows specified by $iRows.If this parameter is True, the system creates more rows.If it is False, the system creates fewer rows.',
      },
    ],
  },
  _GUICtrlToolbar_SetStyle: {
    documentation: 'Sets the style control',
    label: '_GUICtrlToolbar_SetStyle ( $hWnd, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iStyle',
        documentation:
          "Control styles. Can be a combination of the following:    $TBSTYLE_TOOLTIPS - Creates a ToolTip control    $TBSTYLE_WRAPABLE - Creates a toolbar that can have multiple lines of buttons    $TBSTYLE_ALTDRAG - Allows users to change a toolbar button's position by dragging it    $TBSTYLE_FLAT - Creates a flat toolbar    $TBSTYLE_LIST - Creates a flat toolbar with button text to the right of the bitmap    $TBSTYLE_CUSTOMERASE - Sends $NM_CUSTOMDRAW messages when processing $WM_ERASEBKGND messages    $TBSTYLE_REGISTERDROP - Sends $TBN_GETOBJECT messages to request drop target objects    $TBSTYLE_TRANSPARENT - Creates a transparent toolbar",
      },
    ],
  },
  _GUICtrlToolbar_SetStyleAltDrag: {
    documentation: 'Sets whether that the control allows buttons to be dragged',
    label: '_GUICtrlToolbar_SetStyleAltDrag ( $hWnd [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: '**[optional]** True to set, False to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleCustomErase: {
    documentation: 'Sets whether the control generates NM_CUSTOMDRAW notification messages',
    label: '_GUICtrlToolbar_SetStyleCustomErase ( $hWnd [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: '**[optional]** True to set, False to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleFlat: {
    documentation: 'Sets whether the control is flat',
    label: '_GUICtrlToolbar_SetStyleFlat ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleList: {
    documentation: 'Sets whether the control has button text to the right of the bitmap',
    label: '_GUICtrlToolbar_SetStyleList ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleRegisterDrop: {
    documentation: 'Sets whether the control generates TBN_GETOBJECT notification messages',
    label: '_GUICtrlToolbar_SetStyleRegisterDrop ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleToolTips: {
    documentation: 'Sets whether the control has tooltips',
    label: '_GUICtrlToolbar_SetStyleToolTips ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleTransparent: {
    documentation: 'Sets whether the control is transparent',
    label: '_GUICtrlToolbar_SetStyleTransparent ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetStyleWrapable: {
    documentation: 'Sets whether the control is wrapable',
    label: '_GUICtrlToolbar_SetStyleWrapable ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to set, false to unset',
      },
    ],
  },
  _GUICtrlToolbar_SetToolTips: {
    documentation: 'Associates a ToolTip control with a toolbar',
    label: '_GUICtrlToolbar_SetToolTips ( $hWnd, $hToolTip )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hToolTip',
        documentation: 'Handle to the ToolTip control',
      },
    ],
  },
  _GUICtrlToolbar_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag',
    label: '_GUICtrlToolbar_SetUnicodeFormat ( $hWnd [, $bUnicode = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Unicode character setting:    True - Control uses Unicode characters    False - Control uses ANSI characters',
      },
    ],
  },
  _GUICtrlToolbar_SetWindowTheme: {
    documentation: 'Sets the visual style',
    label: '_GUICtrlToolbar_SetWindowTheme ( $hWnd, $sTheme )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sTheme',
        documentation: 'String that contains the toolbar visual style',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
