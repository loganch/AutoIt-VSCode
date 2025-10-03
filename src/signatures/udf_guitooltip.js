import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUIToolTip.au3>`)';

const signatures = {
  _GUIToolTip_Activate: {
    documentation: 'Activates a ToolTip control',
    label: '_GUIToolTip_Activate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_AddTool: {
    documentation: 'Registers a tool with the ToolTip control',
    label:
      '_GUIToolTip_AddTool ( $hTool, $hWnd, $sText [, $iID = 0 [, $iLeft = 0 [, $iTop = 0 [, $iRight = 0 [, $iBottom = 0 [, $iFlags = Default [, $iParam = 0]]]]]]] )',
    params: [
      {
        label: '$hTool',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hWnd',
        documentation: 'Handle of the window that contains the tool, or 0',
      },
      {
        label: '$sText',
        documentation: 'Text for the ToolTip control. See remark.',
      },
      {
        label: '$iID',
        documentation:
          '**[optional]** Identifier of the tool, or Window handle of the control the tool is to be assigned to',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** X coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Y coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** Flags that control the ToolTip display',
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application-defined value that is associated with the tool',
      },
    ],
  },
  _GUIToolTip_AdjustRect: {
    documentation: 'Calculates the text display rectangle from the window rectangle',
    label: '_GUIToolTip_AdjustRect ( $hWnd, ByRef $tRECT [, $bLarger = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that holds a window or text display rectangle',
      },
      {
        label: '$bLarger',
        documentation:
          '**[optional]** Value that specifies which operation to perform. If True, $tRECT is used to specify a text display rectangle and it receives the corresponding window rectangle. If False, $tRECT is used to specify a window rectangle and it receives the corresponding text display rectangle.',
      },
    ],
  },
  _GUIToolTip_BitsToTTF: {
    documentation: 'Decode bit flags to TTF_* strings',
    label: '_GUIToolTip_BitsToTTF ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation: 'A value representing the ToolTip constants needing decoding',
      },
    ],
  },
  _GUIToolTip_Create: {
    documentation: 'Creates a ToolTip control',
    label: '_GUIToolTip_Create ( $hWnd [, $iStyle = $_TT_ghTTDefaultStyle] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that will own the tool tip control. See remarks.',
      },
      {
        label: '$iStyle',
        documentation: '**[optional]** ToolTip style',
      },
    ],
  },
  _GUIToolTip_Deactivate: {
    documentation: 'Deactivates a ToolTip control',
    label: '_GUIToolTip_Deactivate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_DelTool: {
    documentation: 'Deletes a tool from a tooltip control',
    label: '_GUIToolTip_DelTool ( $hWnd, $hTool [, $iID = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool (see Remarks)',
      },
      {
        label: '$iID',
        documentation: '**[optional]** Handle of the tool to delete (see Remarks)',
      },
    ],
  },
  _GUIToolTip_Destroy: {
    documentation: 'Delete a ToolTip control',
    label: '_GUIToolTip_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_EnumTools: {
    documentation: 'Retrieves information about the current tool',
    label: '_GUIToolTip_EnumTools ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iIndex',
        documentation: '0-based index of the tool for which to retrieve information',
      },
    ],
  },
  _GUIToolTip_GetBubbleHeight: {
    documentation: 'Returns the height of the control',
    label:
      '_GUIToolTip_GetBubbleHeight ( $hWnd, $hTool, $iID [, $iFlags = 0x00000001 + 0x00000010] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          'Handle of the control that the tool is associated with, or the ID of the tool',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Flags that control the ToolTip display:    $TTF_IDISHWND = Indicates that $iID is the window handle to the tool instead of the ID    $TTF_CENTERTIP = Centers the window below the tool specified by $iID    $TTF_RTLREADING = Indicates that text will be displayed in the opposite direction    $TTF_SUBCLASS = Indicates that the control should subclass the tool's window to intercept messages    $TTF_TRACK = Positions the control next to the tool to which it corresponds    $TTF_ABSOLUTE = Positions the window at the same coordinates provided by TTM_TRACKPOSITION    $TTF_TRANSPARENT = Causes the control to forward mouse messages to the parent window    $TTF_PARSELINKS = Indicates that links in the control text should be parsed",
      },
    ],
  },
  _GUIToolTip_GetBubbleSize: {
    documentation: 'Returns the width and height of a ToolTip control',
    label:
      '_GUIToolTip_GetBubbleSize ( $hWnd, $hTool, $iID [, $iFlags = 0x00000001 + 0x00000010] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          'Handle of the control that the tool is associated with, or the ID of the tool',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** Flags that control the ToolTip display',
      },
    ],
  },
  _GUIToolTip_GetBubbleWidth: {
    documentation: 'Returns the width of a ToolTip control',
    label:
      '_GUIToolTip_GetBubbleWidth ( $hWnd, $hTool, $iID [, $iFlags = 0x00000001 + 0x00000010] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          'Handle of the control that the tool is associated with, or the ID of the tool',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** Flags that control the ToolTip display',
      },
    ],
  },
  _GUIToolTip_GetCurrentTool: {
    documentation: 'Retrieves information for the current tool',
    label: '_GUIToolTip_GetCurrentTool ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetDelayTime: {
    documentation: 'Retrieves the initial, pop-up or reshow durations of a ToolTip control',
    label: '_GUIToolTip_GetDelayTime ( $hWnd, $iDuration )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iDuration',
        documentation: 'Flag that specifies which duration value will be retrieved',
      },
    ],
  },
  _GUIToolTip_GetMargin: {
    documentation: 'Retrieves the top, left, bottom, and right margins of a ToolTip control',
    label: '_GUIToolTip_GetMargin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetMarginEx: {
    documentation: 'Retrieves the top, left, bottom, and right margins of a ToolTip control',
    label: '_GUIToolTip_GetMarginEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetMaxTipWidth: {
    documentation: 'Retrieves the maximum width of a ToolTip window',
    label: '_GUIToolTip_GetMaxTipWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetText: {
    documentation: 'Retrieves the text of a tool',
    label: '_GUIToolTip_GetText ( $hWnd, $hTool, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          'Identifier of the tool, or Window handle of the control the tool is assigned to',
      },
    ],
  },
  _GUIToolTip_GetTipBkColor: {
    documentation: 'Retrieves the background color',
    label: '_GUIToolTip_GetTipBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetTipTextColor: {
    documentation: 'Retrieves the text color of a ToolTip control',
    label: '_GUIToolTip_GetTipTextColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetTitleBitMap: {
    documentation: 'Retrieves the title bitmap icon',
    label: '_GUIToolTip_GetTitleBitMap ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetTitleText: {
    documentation: 'Retrieve the title',
    label: '_GUIToolTip_GetTitleText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetToolCount: {
    documentation: 'Returns the count of tools maintained by the ToolTip control',
    label: '_GUIToolTip_GetToolCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_GetToolInfo: {
    documentation: 'Retrieves the information about a specific tool',
    label: '_GUIToolTip_GetToolInfo ( $hWnd, $hTool, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          'Identifier of the tool, or Window handle of the control the tool is assigned to',
      },
    ],
  },
  _GUIToolTip_HitTest: {
    documentation: 'Retrieves the information that a ToolTip control maintains about a tool',
    label: '_GUIToolTip_HitTest ( $hWnd, $hTool, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle to the window that contains the tool',
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
  _GUIToolTip_NewToolRect: {
    documentation: 'Sets a new bounding rectangle for a tool',
    label: '_GUIToolTip_NewToolRect ( $hWnd, $hTool, $iID, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle of the window that contains the tool, or 0',
      },
      {
        label: '$iID',
        documentation:
          'Identifier of the tool, or Window handle of the control the tool is to be assigned to',
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
  _GUIToolTip_Pop: {
    documentation: 'Removes a displayed ToolTip from view',
    label: '_GUIToolTip_Pop ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_PopUp: {
    documentation: 'Causes the ToolTip to display at the coordinates of the last mouse message',
    label: '_GUIToolTip_PopUp ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_SetDelayTime: {
    documentation: 'Sets the initial, pop-up, and reshow durations of a ToolTip',
    label: '_GUIToolTip_SetDelayTime ( $hWnd, $iDuration, $iTime )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iDuration',
        documentation:
          "Flag that specifies which duration value will be set:    $TTDT_AUTOMATIC (0) - Set all three delay times to default proportions. (see remarks)    $TTDT_RESHOW (1) - Time it takes for subsequent ToolTip windows to appear as the pointer moves from one tool to another    $TTDT_AUTOPOP (2) - Time the ToolTip window remains visible if the pointer is stationary within a tool's bounding rectangle    $TTDT_INITIAL (3) - Time the pointer must remain stationary within a tool's bounding rectangle before the window appears",
      },
      {
        label: '$iTime',
        documentation: 'Delay time in milliseconds',
      },
    ],
  },
  _GUIToolTip_SetMargin: {
    documentation: 'Sets the top, left, bottom, and right margins of a ToolTip',
    label: '_GUIToolTip_SetMargin ( $hWnd, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iLeft',
        documentation: 'Distance between left border and left end of text, in pixels',
      },
      {
        label: '$iTop',
        documentation: 'Distance between top border and top of text, in pixels',
      },
      {
        label: '$iRight',
        documentation: 'Distance between right border and right end of text, in pixels',
      },
      {
        label: '$iBottom',
        documentation: 'Distance between bottom border and bottom of text, in pixels',
      },
    ],
  },
  _GUIToolTip_SetMaxTipWidth: {
    documentation: 'Sets the maximum width for a ToolTip window',
    label: '_GUIToolTip_SetMaxTipWidth ( $hWnd, $iWidth )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iWidth',
        documentation: 'Maximum ToolTip window width to be set (in pixels)',
      },
    ],
  },
  _GUIToolTip_SetTipBkColor: {
    documentation: 'Sets the background color of a ToolTip',
    label: '_GUIToolTip_SetTipBkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iColor',
        documentation: 'New text color (see remarks)',
      },
    ],
  },
  _GUIToolTip_SetTipTextColor: {
    documentation: 'Sets the text color',
    label: '_GUIToolTip_SetTipTextColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iColor',
        documentation: 'New text color (see remarks)',
      },
    ],
  },
  _GUIToolTip_SetTitle: {
    documentation: 'Adds a standard icon and title string',
    label: '_GUIToolTip_SetTitle ( $hWnd, $sTitle [, $iIcon = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$sTitle',
        documentation: 'Title string',
      },
      {
        label: '$iIcon',
        documentation:
          '**[optional]** Set to one of the values below:.    $TTI_NONE (0) - No icon [default]    $TTI_INFO (1) - Information icon    $TTI_WARNING (2) - Warning icon    $TTI_ERROR (3) - Error Icon    $TTI_INFO_LARGE (4) - Large Information Icon    $TTI_WARNING_LARGE (5) - Large Warning Icon    $TTI_ERROR_LARGE (6) - Large Error Icon',
      },
    ],
  },
  _GUIToolTip_SetToolInfo: {
    documentation: 'Sets the information for a tool',
    label:
      '_GUIToolTip_SetToolInfo ( $hWnd, $sText [, $iID = 0 [, $iLeft = 0 [, $iTop = 0 [, $iRight = 0 [, $iBottom = 0 [, $iFlags = Default [, $iParam = 0]]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window that contains the tool, or 0',
      },
      {
        label: '$sText',
        documentation: 'Text for the ToolTip control',
      },
      {
        label: '$iID',
        documentation:
          '**[optional]** Identifier of the tool, or Window handle of the control the tool is assigned to',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** X coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Y coordinate of the upper left corner of the rectangle',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** X coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Y coordinate of the lower right corner of the rectangle',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Flags that control the ToolTip display:    $TTF_IDISHWND - Indicates that $iID is a window or control handle, instead of the ID of the tool [default]    $TTF_CENTERTIP - Centers the tooltip below the control specified by $iID    $TTF_RTLREADING - Indicates that text will be displayed in the opposite direction (right to left)    $TTF_SUBCLASS - Indicates that the control should subclass the tool's window [default]    $TTF_TRACK    - Positions the tooltip window next to the tool to which it corresponds    $TTF_ABSOLUTE - Positions the window at the same coordinates provided by TTM_TRACKPOSITION. (see Remarks)    $TTF_TRANSPARENT- Causes the control to forward mouse messages to the parent window    $TTF_PARSELINKS - Indicates that links in the control text should be displayed as links",
      },
      {
        label: '$iParam',
        documentation: '**[optional]** Application-defined value that is associated with the tool',
      },
    ],
  },
  _GUIToolTip_SetWindowTheme: {
    documentation: 'Sets the visual style',
    label: '_GUIToolTip_SetWindowTheme ( $hWnd, $sStyle )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$sStyle',
        documentation: 'String that contains the ToolTip visual style to set',
      },
    ],
  },
  _GUIToolTip_ToolExists: {
    documentation: 'Determines whether a tool currently exists (is displayed)',
    label: '_GUIToolTip_ToolExists ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_ToolToArray: {
    documentation: 'Transfers a ToolInfo structure to an array',
    label: '_GUIToolTip_ToolToArray ( $hWnd, ByRef $tToolInfo, $iError )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$tToolInfo',
        documentation: '$tagTOOLINFO structure',
      },
      {
        label: '$iError',
        documentation: 'Error code to be returned',
      },
    ],
  },
  _GUIToolTip_TrackActivate: {
    documentation: 'Activates or deactivates a tracking ToolTip',
    label: '_GUIToolTip_TrackActivate ( $hWnd [, $bActivate = True [, $hTool = 0 [, $iID = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$bActivate',
        documentation: '**[optional]** True to activate, False to deactivate',
      },
      {
        label: '$hTool',
        documentation: '**[optional]** Handle to the window that contains the tool',
      },
      {
        label: '$iID',
        documentation:
          '**[optional]** Control handle that the tool is assigned to, or application-defined identifier of the tool',
      },
    ],
  },
  _GUIToolTip_TrackPosition: {
    documentation: 'Sets the position of a tracking ToolTip',
    label: '_GUIToolTip_TrackPosition ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$iX',
        documentation: 'X position in screen coordinates',
      },
      {
        label: '$iY',
        documentation: 'Y position in screen coordinates',
      },
    ],
  },
  _GUIToolTip_Update: {
    documentation: 'Forces the current tool to be redrawn',
    label: '_GUIToolTip_Update ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
    ],
  },
  _GUIToolTip_UpdateTipText: {
    documentation: 'Sets the ToolTip text for a tool',
    label: '_GUIToolTip_UpdateTipText ( $hWnd, $hTool, $iID, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the ToolTip control (returned by _GUIToolTip_Create.)',
      },
      {
        label: '$hTool',
        documentation: 'Handle of the window that contains the tool, or 0',
      },
      {
        label: '$iID',
        documentation:
          'Identifier of the tool, or Window handle of the control the tool is to be assigned to',
      },
      {
        label: '$sText',
        documentation: 'Text for the ToolTip control.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
