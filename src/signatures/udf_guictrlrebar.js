import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlRebar.au3>`)';

const signatures = {
  _GUICtrlRebar_AddBand: {
    documentation: 'Adds a new band in a rebar control',
    label:
      '_GUICtrlRebar_AddBand ( $hWndRebar, $hWndChild [, $iMinWidth = 100 [, $iDefaultWidth = 100 [, $sText = "" [, $iIndex = -1 [, $iStyle = -1]]]]] )',
    params: [
      {
        label: '$hWndRebar',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$hWndChild',
        documentation: 'Handle of control to add',
      },
      {
        label: '$iMinWidth',
        documentation: '**[optional]** Minimum width for the band',
      },
      {
        label: '$iDefaultWidth',
        documentation: '**[optional]** Length of the band, in pixels',
      },
      {
        label: '$sText',
        documentation: '**[optional]** Display text for the band',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index of the location where the band will be inserted.If you set this parameter to -1, the control will add the new band at the last location',
      },
      {
        label: '$iStyle',
        documentation:
          "**[optional]** Flags that specify the band style. This value can be a combination of the following:    $RBBS_BREAK - The band is on a new line.    $RBBS_CHILDEDGE - The band has an edge at the top and bottom of the child window.    $RBBS_FIXEDBMP - The background bitmap does not move when the band is resized.    $RBBS_FIXEDSIZE - The band can't be sized. With this style, the sizing grip is not displayed on the band.    $RBBS_GRIPPERALWAYS - Version 4.71. The band will always have a sizing grip, even if it is the only band in the rebar.    $RBBS_HIDDEN - The band will not be visible.    $RBBS_NOGRIPPER - Version 4.71. The band will never have a sizing grip, even if there is more than one band in the rebar.    $RBBS_USECHEVRON - Version 5.80. Show a chevron button if the band is smaller than cxIdeal.    $RBBS_VARIABLEHEIGHT - Version 4.71. The band can be resized by the rebar control; cyIntegral and cyMaxChild affect how the rebar will resize the band.    $RBBS_NOVERT - Don't show when vertical.    $RBBS_USECHEVRON - Display drop-down button.    $RBBS_HIDETITLE - Keep band title hidden.    $RBBS_TOPALIGN - Keep band in top row.",
      },
    ],
  },
  _GUICtrlRebar_AddToolBarBand: {
    documentation: 'Adds a new band in a rebar control',
    label:
      '_GUICtrlRebar_AddToolBarBand ( $hWndRebar, $hWndToolbar [, $sText = "" [, $iIndex = -1 [, $iStyle = -1]]] )',
    params: [
      {
        label: '$hWndRebar',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$hWndToolbar',
        documentation: 'Handle of the Toolbar control to add',
      },
      {
        label: '$sText',
        documentation: '**[optional]** Display text for the band',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index of the location where the band will be inserted.If you set this parameter to -1, the control will add the new band at the last location',
      },
      {
        label: '$iStyle',
        documentation:
          "**[optional]** Flags that specify the band style. This value can be a combination of the following:    $RBBS_BREAK - The band is on a new line.    $RBBS_CHILDEDGE - The band has an edge at the top and bottom of the child window.    $RBBS_FIXEDBMP - The background bitmap does not move when the band is resized.    $RBBS_FIXEDSIZE - The band can't be sized. With this style, the sizing grip is not displayed on the band.    $RBBS_GRIPPERALWAYS - Version 4.71. The band will always have a sizing grip, even if it is the only band in the rebar.    $RBBS_HIDDEN - The band will not be visible.    $RBBS_NOGRIPPER - Version 4.71. The band will never have a sizing grip, even if there is more than one band in the rebar.    $RBBS_USECHEVRON - Version 5.80. Show a chevron button if the band is smaller than cxIdeal.    $RBBS_VARIABLEHEIGHT - Version 4.71. The band can be resized by the rebar control; cyIntegral and cyMaxChild affect how the rebar will resize the band.    $RBBS_NOVERT - Don't show when vertical.    $RBBS_USECHEVRON - Display drop-down button.    $RBBS_HIDETITLE - Keep band title hidden.    $RBBS_TOPALIGN - Keep band in top row.",
      },
    ],
  },
  _GUICtrlRebar_BeginDrag: {
    documentation: 'Adds a new band in a rebar control',
    label: '_GUICtrlRebar_BeginDrag ( $hWnd, $iIndex [, $iPos = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band that the drag-and-drop operation will affect',
      },
      {
        label: '$iPos',
        documentation:
          "**[optional]** DWORD value that contains the starting mouse coordinates.The horizontal coordinate is contained in the LOWORD and the vertical coordinate is contained in the HIWORD.If you pass (DWORD)-1, the rebar control will use the position of the mouse the last time the control's thread called GetMessage or PeekMessage",
      },
    ],
  },
  _GUICtrlRebar_Create: {
    documentation: 'Create a Rebar control',
    label: '_GUICtrlRebar_Create ( $hWnd [, $iStyles = 0x513] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$iStyles',
        documentation:
          '**[optional]** Rebar controls support a variety of control styles in addition to standard window styles:    $RBS_AUTOSIZE - Version 4.71. The rebar control will automatically change the layout of the bands when the size or position of the control changes.        An $RBN_AUTOSIZE notification will be sent when this occurs    $RBS_BANDBORDERS - Version 4.71. The rebar control displays narrow lines to separate adjacent bands    $RBS_DBLCLKTOGGLE - Version 4.71. The rebar band will toggle its maximized or minimized state when the user double-clicks the band.        Without this style, the maximized or minimized state is toggled when the user single-clicks on the band    $RBS_FIXEDORDER - Version 4.70. The rebar control always displays bands in the same order. You can move bands to different rows, but the band order is static    $RBS_REGISTERDROP - Version 4.71. The rebar control generates $RBN_GETOBJECT notification messages when an object is dragged over a band in the control    $RBS_TOOLTIPS - Version 4.71. Not yet supported    $RBS_VARHEIGHT - Version 4.71. The rebar control displays bands at the minimum required height, when possible.        Without this style, the rebar control displays all bands at the same height, using the height of the tallest visible band to determine the height of other bands    $RBS_VERTICALGRIPPER - Version 4.71. The size grip will be displayed vertically instead of horizontally in a vertical rebar control.        This style is ignored for rebar controls that do not have the $CCS_VERT style    $CCS_LEFT - Version 4.70. Causes the control to be displayed vertically on the left side of the parent window    $CCS_NODIVIDER - Prevents a two-pixel highlight from being drawn at the top of the control    $CCS_RIGHT - Version 4.70. Causes the control to be displayed vertically on the right side of the parent window    $CCS_VERT - Version 4.70. Causes the control to be displayed verticallyDefault: $CCS_TOP, $RBS_VARHEIGHTForced: $WS_CHILD, $WS_VISIBLE, $WS_CLIPCHILDREN, $WS_CLIPSIBLINGS',
      },
    ],
  },
  _GUICtrlRebar_DeleteBand: {
    documentation: 'Deletes a band from a rebar control',
    label: '_GUICtrlRebar_DeleteBand ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band to be deleted',
      },
    ],
  },
  _GUICtrlRebar_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlRebar_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_DragMove: {
    documentation:
      'Updates the drag position in the rebar control after a previous _GUICtrlRebar_BeginDrag message',
    label: '_GUICtrlRebar_DragMove ( $hWnd [, $iPos = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iPos',
        documentation:
          "**[optional]** DWORD value that contains the new mouse coordinates.The horizontal coordinate is contained in the LOWORD and the vertical coordinate is contained in the HIWORD.If you pass (DWORD)-1, the rebar control will use the position of the mouse the last time the control's thread called GetMessage or PeekMessage",
      },
    ],
  },
  _GUICtrlRebar_EndDrag: {
    documentation: "Terminates the rebar control's drag-and-drop operation",
    label: '_GUICtrlRebar_EndDrag ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandBackColor: {
    documentation: 'Retrieves the Band background color',
    label: '_GUICtrlRebar_GetBandBackColor ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandBorders: {
    documentation: 'Retrieves the borders of a band',
    label: '_GUICtrlRebar_GetBandBorders ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band for which the borders will be retrieved',
      },
    ],
  },
  _GUICtrlRebar_GetBandBordersEx: {
    documentation: 'Retrieves the borders of a band',
    label: '_GUICtrlRebar_GetBandBordersEx ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band for which the borders will be retrieved',
      },
    ],
  },
  _GUICtrlRebar_GetBandChildHandle: {
    documentation: 'Retrieves the Handle to the child window contained in the band, if any',
    label: '_GUICtrlRebar_GetBandChildHandle ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band for which the borders will be retrieved',
      },
    ],
  },
  _GUICtrlRebar_GetBandChildSize: {
    documentation: 'Retrieves the Child size settings',
    label: '_GUICtrlRebar_GetBandChildSize ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandCount: {
    documentation: 'Retrieves the count of bands currently in the rebar control',
    label: '_GUICtrlRebar_GetBandCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandForeColor: {
    documentation: 'Retrieves the Band foreground color',
    label: '_GUICtrlRebar_GetBandForeColor ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandHeaderSize: {
    documentation: "Retrieves the size of the band's header, in pixels",
    label: '_GUICtrlRebar_GetBandHeaderSize ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandID: {
    documentation:
      'Get the value that the control uses to identify this band for custom draw notification messages',
    label: '_GUICtrlRebar_GetBandID ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandIdealSize: {
    documentation: 'Get Ideal width of the band, in pixels',
    label: '_GUICtrlRebar_GetBandIdealSize ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandLength: {
    documentation: 'Get Length of the band, in pixels',
    label: '_GUICtrlRebar_GetBandLength ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandLParam: {
    documentation: 'Get Application-defined value',
    label: '_GUICtrlRebar_GetBandLParam ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandMargins: {
    documentation: 'Get Length of the band, in pixels',
    label: '_GUICtrlRebar_GetBandMargins ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandMarginsEx: {
    documentation: 'Get Length of the band, in pixels',
    label: '_GUICtrlRebar_GetBandMarginsEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandRect: {
    documentation: 'Retrieves the bounding rectangle for a given band in a rebar control',
    label: '_GUICtrlRebar_GetBandRect ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of a band in the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandRectEx: {
    documentation: 'Retrieves the bounding rectangle for a given band in a rebar control',
    label: '_GUICtrlRebar_GetBandRectEx ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of a band in the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyle: {
    documentation: 'Get the band style Flags',
    label: '_GUICtrlRebar_GetBandStyle ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleBreak: {
    documentation: 'Determine if band break flag is set',
    label: '_GUICtrlRebar_GetBandStyleBreak ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleChildEdge: {
    documentation: 'Determine if band child edge flag is set',
    label: '_GUICtrlRebar_GetBandStyleChildEdge ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleFixedBMP: {
    documentation: 'Determine if band fixed BMP flag is set',
    label: '_GUICtrlRebar_GetBandStyleFixedBMP ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleFixedSize: {
    documentation: 'Determine if band fixed size flag is set',
    label: '_GUICtrlRebar_GetBandStyleFixedSize ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleGripperAlways: {
    documentation: 'Determine if band gripper flag is set',
    label: '_GUICtrlRebar_GetBandStyleGripperAlways ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleHidden: {
    documentation: 'Determine if band hidden flag is set',
    label: '_GUICtrlRebar_GetBandStyleHidden ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleHideTitle: {
    documentation: 'Determine if band hide title flag is set',
    label: '_GUICtrlRebar_GetBandStyleHideTitle ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleNoGripper: {
    documentation: 'Determine if band noGripper flag is set',
    label: '_GUICtrlRebar_GetBandStyleNoGripper ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleTopAlign: {
    documentation: 'Determine if band top align flag is set',
    label: '_GUICtrlRebar_GetBandStyleTopAlign ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleUseChevron: {
    documentation: 'Determine if band use chevron flag is set',
    label: '_GUICtrlRebar_GetBandStyleUseChevron ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandStyleVariableHeight: {
    documentation: 'Determine if band variable height flag is set',
    label: '_GUICtrlRebar_GetBandStyleVariableHeight ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_GetBandText: {
    documentation: 'Retrieves the display text for the band',
    label: '_GUICtrlRebar_GetBandText ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band for which the information will be retrieved',
      },
    ],
  },
  _GUICtrlRebar_GetBarHeight: {
    documentation: 'Retrieves the height of the rebar control',
    label: '_GUICtrlRebar_GetBarHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBarInfo: {
    documentation: 'Retrieves information about the rebar control and the image list it uses',
    label: '_GUICtrlRebar_GetBarInfo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetBKColor: {
    documentation: "Retrieves a rebar control's default background color",
    label: '_GUICtrlRebar_GetBKColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetColorScheme: {
    documentation: 'Retrieves the color scheme information from the rebar control',
    label: '_GUICtrlRebar_GetColorScheme ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetRowCount: {
    documentation: 'Retrieves the number of rows of bands in a rebar control',
    label: '_GUICtrlRebar_GetRowCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetRowHeight: {
    documentation: 'Retrieves the height of a specified row in a rebar control',
    label: '_GUICtrlRebar_GetRowHeight ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation:
          '0-based index of a band. The height of the row that contains the specified band will be retrieved',
      },
    ],
  },
  _GUICtrlRebar_GetTextColor: {
    documentation: "Retrieves a rebar control's default text color",
    label: '_GUICtrlRebar_GetTextColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetToolTips: {
    documentation: 'Retrieves the handle to any ToolTip control associated with the rebar control',
    label: '_GUICtrlRebar_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlRebar_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
    ],
  },
  _GUICtrlRebar_HitTest: {
    documentation: 'Determines which band is at a specified position',
    label: '_GUICtrlRebar_HitTest ( $hWnd [, $iX = -1 [, $iY = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
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
  _GUICtrlRebar_IDToIndex: {
    documentation: 'Converts a band identifier to a band index in a rebar control',
    label: '_GUICtrlRebar_IDToIndex ( $hWnd, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iID',
        documentation: 'The application-defined identifier of the band in question',
      },
    ],
  },
  _GUICtrlRebar_MaximizeBand: {
    documentation: 'Resizes a band in a rebar control to either its ideal or largest size',
    label: '_GUICtrlRebar_MaximizeBand ( $hWnd, $iIndex [, $bIdeal = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bIdeal',
        documentation:
          '**[optional]** Indicates if the ideal width of the band should be used when the band is maximized',
      },
    ],
  },
  _GUICtrlRebar_MinimizeBand: {
    documentation: 'Resizes a band in a rebar control to its smallest size',
    label: '_GUICtrlRebar_MinimizeBand ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
    ],
  },
  _GUICtrlRebar_MoveBand: {
    documentation: 'Moves a band from one index to another',
    label: '_GUICtrlRebar_MoveBand ( $hWnd, $iIndexFrom, $iIndexTo )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndexFrom',
        documentation: '0-based index of the band to be moved',
      },
      {
        label: '$iIndexTo',
        documentation: '0-based index of the new band position',
      },
    ],
  },
  _GUICtrlRebar_SetBandBackColor: {
    documentation: 'Set the Band background color',
    label: '_GUICtrlRebar_SetBandBackColor ( $hWnd, $iIndex, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iColor',
        documentation: 'New color for band background',
      },
    ],
  },
  _GUICtrlRebar_SetBandForeColor: {
    documentation: 'Set the Band foreground color',
    label: '_GUICtrlRebar_SetBandForeColor ( $hWnd, $iIndex, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iColor',
        documentation: 'New color for band foreground',
      },
    ],
  },
  _GUICtrlRebar_SetBandHeaderSize: {
    documentation: "Set the size of the band's header, in pixels",
    label: '_GUICtrlRebar_SetBandHeaderSize ( $hWnd, $iIndex, $iNewSize )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iNewSize',
        documentation: "New size of the band's header",
      },
    ],
  },
  _GUICtrlRebar_SetBandID: {
    documentation:
      'Set the value that the control uses to identify this band for custom draw notification messages',
    label: '_GUICtrlRebar_SetBandID ( $hWnd, $iIndex, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iID',
        documentation:
          'value that the control uses to identify this band for custom draw notification messages',
      },
    ],
  },
  _GUICtrlRebar_SetBandIdealSize: {
    documentation: 'Set Ideal width of the band, in pixels',
    label: '_GUICtrlRebar_SetBandIdealSize ( $hWnd, $iIndex, $iNewSize )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iNewSize',
        documentation: 'Ideal width of the band, in pixels',
      },
    ],
  },
  _GUICtrlRebar_SetBandLength: {
    documentation: 'Set the size length of the band',
    label: '_GUICtrlRebar_SetBandLength ( $hWnd, $iIndex, $iLength )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iLength',
        documentation: 'Length of the band, in pixels',
      },
    ],
  },
  _GUICtrlRebar_SetBandLParam: {
    documentation: 'Set Application-defined value',
    label: '_GUICtrlRebar_SetBandLParam ( $hWnd, $iIndex, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$lParam',
        documentation: 'Application-defined value',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyle: {
    documentation: 'Set the band style Flags',
    label: '_GUICtrlRebar_SetBandStyle ( $hWnd, $iIndex, $iStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$iStyle',
        documentation: 'see $tagREBARBANDINFO',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleBreak: {
    documentation: 'Set whether the band is on a new line',
    label: '_GUICtrlRebar_SetBandStyleBreak ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleChildEdge: {
    documentation: 'Set whether the band has an edge at the top and bottom of the child window',
    label: '_GUICtrlRebar_SetBandStyleChildEdge ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleFixedBMP: {
    documentation: 'Set whether the band background bitmap does not move when the band is resized',
    label: '_GUICtrlRebar_SetBandStyleFixedBMP ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleFixedSize: {
    documentation:
      "Set whether the band can't be sized. With this style, the sizing grip is not displayed on the band",
    label: '_GUICtrlRebar_SetBandStyleFixedSize ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleGripperAlways: {
    documentation:
      'Set whether the band will always have a sizing grip, even if it is the only band in the rebar',
    label: '_GUICtrlRebar_SetBandStyleGripperAlways ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleHidden: {
    documentation: 'Set whether the band will not be visible',
    label: '_GUICtrlRebar_SetBandStyleHidden ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleHideTitle: {
    documentation: 'Set whether to keep band title hidden',
    label: '_GUICtrlRebar_SetBandStyleHideTitle ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleNoGripper: {
    documentation:
      'Set whether the band will never have a sizing grip, even if there is more than one band in the rebar',
    label: '_GUICtrlRebar_SetBandStyleNoGripper ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleTopAlign: {
    documentation: 'Set whether to keep band in top row',
    label: '_GUICtrlRebar_SetBandStyleTopAlign ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleUseChevron: {
    documentation: 'Set whether to display drop-down button',
    label: '_GUICtrlRebar_SetBandStyleUseChevron ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandStyleVariableHeight: {
    documentation: 'Set whether the band can be resized by the rebar control',
    label: '_GUICtrlRebar_SetBandStyleVariableHeight ( $hWnd, $iIndex [, $bEnabled = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bEnabled',
        documentation: '**[optional]** If True the item state is set, otherwise it is not set',
      },
    ],
  },
  _GUICtrlRebar_SetBandText: {
    documentation: 'Sets the display text for the band of a rebar control',
    label: '_GUICtrlRebar_SetBandText ( $hWnd, $iIndex, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band for which the information will be set',
      },
      {
        label: '$sText',
        documentation: 'New display text for the band',
      },
    ],
  },
  _GUICtrlRebar_SetBarInfo: {
    documentation: 'Sets the characteristics of a rebar control',
    label: '_GUICtrlRebar_SetBarInfo ( $hWnd, $hIml )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$hIml',
        documentation: 'Handle to the Image list',
      },
    ],
  },
  _GUICtrlRebar_SetBKColor: {
    documentation: 'Sets the default background color of a rebar control',
    label: '_GUICtrlRebar_SetBKColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iColor',
        documentation: 'COLORREF value that represents the new default background color',
      },
    ],
  },
  _GUICtrlRebar_SetColorScheme: {
    documentation: 'Sets the color scheme of a rebar control',
    label: '_GUICtrlRebar_SetColorScheme ( $hWnd, $iBtnHighlight, $iBtnShadow )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iBtnHighlight',
        documentation: 'COLORREF value that represents the highlight color of the buttons',
      },
      {
        label: '$iBtnShadow',
        documentation: 'COLORREF value that represents the shadow color of the buttons',
      },
    ],
  },
  _GUICtrlRebar_SetTextColor: {
    documentation: "Sets a rebar control's default text color",
    label: '_GUICtrlRebar_SetTextColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iColor',
        documentation: 'COLORREF value that represents the new default text color',
      },
    ],
  },
  _GUICtrlRebar_SetToolTips: {
    documentation: 'Associates a ToolTip control with the rebar control',
    label: '_GUICtrlRebar_SetToolTips ( $hWnd, $hToolTip )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$hToolTip',
        documentation: 'Handle to the ToolTip control to be set',
      },
    ],
  },
  _GUICtrlRebar_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag for the control',
    label: '_GUICtrlRebar_SetUnicodeFormat ( $hWnd [, $bUnicode = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Determines the character set that is used by the control:    True - The control will use Unicode characters    False - The control will use ANSI characters',
      },
    ],
  },
  _GUICtrlRebar_ShowBand: {
    documentation: 'Shows or hides a given band in a rebar control',
    label: '_GUICtrlRebar_ShowBand ( $hWnd, $iIndex [, $bShow = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the rebar control',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the band',
      },
      {
        label: '$bShow',
        documentation:
          '**[optional]** indicates if the band should be shown or hidden:    True - Show    False - Hide',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
