import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlStatusBar.au3>`)';

const signatures = {
  _GUICtrlStatusBar_Create: {
    documentation: 'Create a statusbar',
    label:
      '_GUICtrlStatusBar_Create ( $hWnd [, $vPartEdge = -1 [, $vPartText = "" [, $iStyles = -1 [, $iExStyles = 0x00000000]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent window',
      },
      {
        label: '$vPartEdge',
        documentation:
          '**[optional]** Width of part or parts, for more than 1 part pass in 0-based array in the following format:    $vPartEdge[0] - Right edge of part #1    $vPartEdge[1] - Right edge of part #2    $vPartEdge[n] - Right edge of part n',
      },
      {
        label: '$vPartText',
        documentation:
          '**[optional]** Text of part or parts, for more than 1 part pass in 0-based array in the following format:    $vPartText[0] - First part    $vPartText[1] - Second part    $vPartText[n] - Last part',
      },
      {
        label: '$iStyles',
        documentation:
          '**[optional]** Control styles:    $SBARS_SIZEGRIP - The status bar control will include a sizing grip at the right end of the status bar    $SBARS_TOOLTIPS - The status bar will have tooltipsForced: $WS_CHILD, $WS_VISIBLE',
      },
      {
        label: '$iExStyles',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlStatusBar_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlStatusBar_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_EmbedControl: {
    documentation: 'Embeds a child control in the control',
    label: '_GUICtrlStatusBar_EmbedControl ( $hWnd, $iPart, $hControl [, $iFit = 4] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
      {
        label: '$hControl',
        documentation: 'Handle of control to embed in panel',
      },
      {
        label: '$iFit',
        documentation:
          '**[optional]** Determines how to fit the control. Can be a combination of:    1 - Center the control horizontally    2 - Center the control vertically    4 - Fit the control to the status bar part',
      },
    ],
  },
  _GUICtrlStatusBar_GetBorders: {
    documentation: 'Retrieves the current widths of the horizontal and vertical borders',
    label: '_GUICtrlStatusBar_GetBorders ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetBordersHorz: {
    documentation: 'Retrieves the current width of the horizontal border',
    label: '_GUICtrlStatusBar_GetBordersHorz ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetBordersRect: {
    documentation: 'Retrieves the current width of the rectangle border',
    label: '_GUICtrlStatusBar_GetBordersRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetBordersVert: {
    documentation: 'Retrieves the current width of the vertical border',
    label: '_GUICtrlStatusBar_GetBordersVert ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetCount: {
    documentation: 'Retrieves the number of parts',
    label: '_GUICtrlStatusBar_GetCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetHeight: {
    documentation: 'Retrieves the height of the statusbar',
    label: '_GUICtrlStatusBar_GetHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetIcon: {
    documentation: 'Retrieves the icon for a part',
    label: '_GUICtrlStatusBar_GetIcon ( $hWnd [, $iIndex = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** 0-based index of the part that contains the icon to be retrieved.If this parameter is -1, the status bar is assumed to be a Simple Mode status bar.',
      },
    ],
  },
  _GUICtrlStatusBar_GetParts: {
    documentation: 'Retrieves the number of parts and the part edges',
    label: '_GUICtrlStatusBar_GetParts ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetRect: {
    documentation: 'Retrieves the bounding rectangle of a part',
    label: '_GUICtrlStatusBar_GetRect ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetRectEx: {
    documentation: 'Retrieves the bounding rectangle of a part',
    label: '_GUICtrlStatusBar_GetRectEx ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation:
          '0-based part index.If the control is in simple mode this field is ignored and the rectangle of the status bar is returned.',
      },
    ],
  },
  _GUICtrlStatusBar_GetText: {
    documentation: 'Retrieves the text from the specified part',
    label: '_GUICtrlStatusBar_GetText ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetTextFlags: {
    documentation: 'Retrieves the text length flags for a part',
    label: '_GUICtrlStatusBar_GetTextFlags ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetTextLength: {
    documentation: 'Retrieves the length of a part text',
    label: '_GUICtrlStatusBar_GetTextLength ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetTextLengthEx: {
    documentation: 'Retrieves the uFlag of a part',
    label: '_GUICtrlStatusBar_GetTextLengthEx ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetTipText: {
    documentation: 'Retrieves the ToolTip text for a part',
    label: '_GUICtrlStatusBar_GetTipText ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag',
    label: '_GUICtrlStatusBar_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_GetWidth: {
    documentation: 'Retrieves the width of a part',
    label: '_GUICtrlStatusBar_GetWidth ( $hWnd, $iPart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
    ],
  },
  _GUICtrlStatusBar_IsSimple: {
    documentation: 'Checks a status bar control to determine if it is in simple mode',
    label: '_GUICtrlStatusBar_IsSimple ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_Resize: {
    documentation: 'Causes the status bar to resize itself',
    label: '_GUICtrlStatusBar_Resize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlStatusBar_SetBkColor: {
    documentation: 'Sets the background color',
    label: '_GUICtrlStatusBar_SetBkColor ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iColor',
        documentation:
          'New background color. Specify the CLR_DEFAULT value to cause the status bar to use its default background color.',
      },
    ],
  },
  _GUICtrlStatusBar_SetIcon: {
    documentation: 'Sets the icon for a part',
    label: '_GUICtrlStatusBar_SetIcon ( $hWnd, $iPart [, $hIcon = -1 [, $sIconFile = ""]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation:
          '0-based part index. If the control is in simple mode, this field is ignored.',
      },
      {
        label: '$hIcon',
        documentation:
          '**[optional]** Handle to the icon. If this value is -1, the icon is removed.',
      },
      {
        label: '$sIconFile',
        documentation: '**[optional]** Icon filename to be used.',
      },
    ],
  },
  _GUICtrlStatusBar_SetMinHeight: {
    documentation: "Sets the minimum height of a status window's drawing area",
    label: '_GUICtrlStatusBar_SetMinHeight ( $hWnd, $iMinHeight )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iMinHeight',
        documentation: 'Minimum height, in pixels, of the window',
      },
    ],
  },
  _GUICtrlStatusBar_SetParts: {
    documentation: 'Sets the number of parts and the part edges',
    label: '_GUICtrlStatusBar_SetParts ( $hWnd [, $aParts = -1 [, $aPartWidth = 25]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aParts',
        documentation:
          '**[optional]** Number of parts, can be an 0-based array of ints in the following format:    $aParts[0] - Right edge of part #1    $aParts[1] - Right edge of part #2    $aParts[n] - Right edge of part n',
      },
      {
        label: '$aPartWidth',
        documentation:
          '**[optional]** Size of parts, can be an 0-based array of ints in the following format:    $aPartWidth[0] - width part #1    $aPartWidth[1] - width of part #2    $aPartWidth[n] - width of part n',
      },
    ],
  },
  _GUICtrlStatusBar_SetSimple: {
    documentation:
      'Specifies whether a status window displays simple text or displays all window parts',
    label: '_GUICtrlStatusBar_SetSimple ( $hWnd [, $bSimple = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bSimple',
        documentation:
          '**[optional]** Sets the display of the windows    True - The window displays simple text    False - The window displays multiple parts',
      },
    ],
  },
  _GUICtrlStatusBar_SetText: {
    documentation: 'Sets the text in the specified part of a status window',
    label: '_GUICtrlStatusBar_SetText ( $hWnd [, $sText = "" [, $iPart = 0 [, $iUFlag = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: '**[optional]** The text to display in the part',
      },
      {
        label: '$iPart',
        documentation: '**[optional]** The part to hold the text',
      },
      {
        label: '$iUFlag',
        documentation:
          '**[optional]** Type of drawing operation. The type can be one of the following values:    0 - The text is drawn with a border to appear lower than the plane of the window    $SBT_NOBORDERS - The text is drawn without borders    $SBT_OWNERDRAW - The text is drawn by the parent window    $SBT_POPOUT - The text is drawn with a border to appear higher than the plane of the window    $SBT_RTLREADING - The text will be displayed in the opposite direction to the text in the parent window',
      },
    ],
  },
  _GUICtrlStatusBar_SetTipText: {
    documentation: 'Sets the ToolTip text for a part',
    label: '_GUICtrlStatusBar_SetTipText ( $hWnd, $iPart, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPart',
        documentation: '0-based part index',
      },
      {
        label: '$sText',
        documentation: 'Text of Tip',
      },
    ],
  },
  _GUICtrlStatusBar_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag',
    label: '_GUICtrlStatusBar_SetUnicodeFormat ( $hWnd [, $bUnicode = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Unicode character format flag:    True - Control uses Unicode characters    False - Control uses ANSI characters',
      },
    ],
  },
  _GUICtrlStatusBar_ShowHide: {
    documentation: 'Show/Hide the StatusBar control',
    label: '_GUICtrlStatusBar_ShowHide ( $hWnd, $iState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iState',
        documentation: 'State of the StatusBar, can be the following values:@SW_SHOW@SW_HIDE',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
