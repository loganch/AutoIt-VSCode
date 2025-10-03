import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlSlider.au3>`)';

const signatures = {
  _GUICtrlSlider_ClearSel: {
    documentation: 'Clears the current selection range',
    label: '_GUICtrlSlider_ClearSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_ClearTics: {
    documentation: 'Removes the current tick marks from a slider',
    label: '_GUICtrlSlider_ClearTics ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_Create: {
    documentation: 'Create a Slider control',
    label:
      '_GUICtrlSlider_Create ( $hWnd, $iX, $iY [, $iWidth = 100 [, $iHeight = 20 [, $iStyle = $TBS_AUTOTICKS [, $iExStyle = 0x00000000]]]] )',
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
          '**[optional]** Control style:    $TBS_AUTOTICKS - Adds tick marks when you set the range on the slider by using the TBM_SETRANGE message    $TBS_BOTH - Places ticks on both sides of the slider    $TBS_BOTTOM - Places ticks on the bottom of a horizontal slider    $TBS_DOWNISLEFT - Down equal left and up equal right    $TBS_ENABLESELRANGE - The tick marks at the starting and ending positions of a selection range are displayed as triangles        (instead of vertical dashes), and the selection range is highlighted.    $TBS_FIXEDLENGTH - allows the size of the slider to be changed with the $TBM_SETTHUMBLENGTH message    $TBS_HORZ - Specifies a horizontal slider. This is the default    $TBS_LEFT - Places ticks on the left side of a vertical slider    $TBS_NOTHUMB - Specifies that the slider has no slider    $TBS_NOTICKS - Specifies that no ticks are placed on the slider    $TBS_REVERSED - Smaller number indicates "higher" and a larger number indicates "lower"    $TBS_RIGHT - Places ticks on the right side of a vertical slider    $TBS_TOP - Places ticks on the top of a horizontal slider    $TBS_TOOLTIPS - Creates a default ToolTip control that displays the slider\'s current position    $TBS_VERT - Creates a vertical sliderDefault: $TBS_AUTOTICKSForced : $WS_CHILD, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.Default: $WS_EX_STATICEDGE',
      },
    ],
  },
  _GUICtrlSlider_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlSlider_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetBuddy: {
    documentation: 'Retrieves the handle to a slider control buddy window at a given location',
    label: '_GUICtrlSlider_GetBuddy ( $hWnd, $bLocation )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bLocation',
        documentation:
          'Which buddy window handle will be retrieved. This value can be one of the following:    True - Retrieves the handle to the buddy to the left of the slider.        If the slider control uses the $TBS_VERT style, the message will retrieve the buddy above the slider.    False - Retrieves the handle to the buddy to the right of the slider.        If the slider control uses the $TBS_VERT style, the message will retrieve the buddy below the slider.',
      },
    ],
  },
  _GUICtrlSlider_GetChannelRect: {
    documentation:
      "Retrieves the size and position of the bounding rectangle for a sliders's channel",
    label: '_GUICtrlSlider_GetChannelRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetChannelRectEx: {
    documentation:
      "Retrieves the size and position of the bounding rectangle for a sliders's channel",
    label: '_GUICtrlSlider_GetChannelRectEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetLineSize: {
    documentation: 'Retrieves the number of logical positions the slider moves',
    label: '_GUICtrlSlider_GetLineSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetLogicalTics: {
    documentation:
      'Retrieves an array that contains the logical positions of the tick marks for a slider',
    label: '_GUICtrlSlider_GetLogicalTics ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetNumTics: {
    documentation: 'Retrieves the number of tick marks from a slider',
    label: '_GUICtrlSlider_GetNumTics ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetPageSize: {
    documentation: 'Retrieves the number of logical positions the slider moves',
    label: '_GUICtrlSlider_GetPageSize ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetPos: {
    documentation: 'Retrieves the logical position the slider',
    label: '_GUICtrlSlider_GetPos ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetRange: {
    documentation: 'Retrieves the maximum and minimum position for the slider',
    label: '_GUICtrlSlider_GetRange ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetRangeMax: {
    documentation: 'Retrieves the maximum position for the slider',
    label: '_GUICtrlSlider_GetRangeMax ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetRangeMin: {
    documentation: 'Retrieves the minimum position for the slider',
    label: '_GUICtrlSlider_GetRangeMin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetSel: {
    documentation: 'Retrieves the ending and starting position of the current selection range',
    label: '_GUICtrlSlider_GetSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetSelEnd: {
    documentation: 'Retrieves the ending position of the current selection range',
    label: '_GUICtrlSlider_GetSelEnd ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetSelStart: {
    documentation: 'Retrieves the starting position of the current selection range',
    label: '_GUICtrlSlider_GetSelStart ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetThumbLength: {
    documentation: 'Retrieves the length of the slider',
    label: '_GUICtrlSlider_GetThumbLength ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetThumbRect: {
    documentation: 'Retrieves the size and position of the bounding rectangle for the slider',
    label: '_GUICtrlSlider_GetThumbRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetThumbRectEx: {
    documentation: 'Retrieves the size and position of the bounding rectangle for the slider',
    label: '_GUICtrlSlider_GetThumbRectEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetTic: {
    documentation: 'Retrieves the logical position of a tick mark',
    label: '_GUICtrlSlider_GetTic ( $hWnd, $iTic )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iTic',
        documentation:
          '0-based index identifying a tick mark. Valid indexes are in the range from zero to two less than the tick count returned by the _GUICtrlSlider_GetNumTics() depends on the _GUICtrlSlider_SetTicFreq().',
      },
    ],
  },
  _GUICtrlSlider_GetTicPos: {
    documentation: 'Retrieves the current physical position of a tick mark',
    label: '_GUICtrlSlider_GetTicPos ( $hWnd, $iTic )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iTic',
        documentation:
          '0-based index identifying a tick mark. The positions of the first and last tick marks are not directly available via this message.',
      },
    ],
  },
  _GUICtrlSlider_GetToolTips: {
    documentation: 'Retrieves the handle to the ToolTip control assigned to the slider, if any',
    label: '_GUICtrlSlider_GetToolTips ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlSlider_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlSlider_SetBuddy: {
    documentation: 'Assigns a window as the buddy window for a slider control',
    label: '_GUICtrlSlider_SetBuddy ( $hWnd, $bLocation, $hBuddy )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bLocation',
        documentation:
          'Following values:    True - The buddy will appear to the left of the slider if the control uses the $TBS_HORZ style        The buddy will appear above the slider if the control uses the $TBS_VERT style    False - The buddy will appear to the right of the slider if the control uses the $TBS_HORZ style        The buddy will appear below the slider if the control uses the $TBS_VERT style',
      },
      {
        label: '$hBuddy',
        documentation: 'Handle to buddy control',
      },
    ],
  },
  _GUICtrlSlider_SetLineSize: {
    documentation: 'Sets the number of logical positions the slider moves',
    label: '_GUICtrlSlider_SetLineSize ( $hWnd, $iLineSize )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLineSize',
        documentation: 'New line size',
      },
    ],
  },
  _GUICtrlSlider_SetPageSize: {
    documentation: 'Sets the number of logical positions the slider moves',
    label: '_GUICtrlSlider_SetPageSize ( $hWnd, $iPageSize )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iPageSize',
        documentation: 'New page size',
      },
    ],
  },
  _GUICtrlSlider_SetPos: {
    documentation: 'Sets the current logical position of the slider',
    label: '_GUICtrlSlider_SetPos ( $hWnd, $iPosition )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iPosition',
        documentation: 'New logical position of the slider',
      },
    ],
  },
  _GUICtrlSlider_SetRange: {
    documentation: 'Sets the range of minimum and maximum logical positions for the slider',
    label: '_GUICtrlSlider_SetRange ( $hWnd, $iMinimum, $iMaximum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Minimum position for the slider',
      },
      {
        label: '$iMaximum',
        documentation: 'Maximum position for the slider',
      },
    ],
  },
  _GUICtrlSlider_SetRangeMax: {
    documentation: 'Sets the maximum logical position for the slider',
    label: '_GUICtrlSlider_SetRangeMax ( $hWnd, $iMaximum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMaximum',
        documentation: 'Maximum position for the slider',
      },
    ],
  },
  _GUICtrlSlider_SetRangeMin: {
    documentation: 'Sets the minimum logical position for the slider',
    label: '_GUICtrlSlider_SetRangeMin ( $hWnd, $iMinimum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Minimum position for the slider',
      },
    ],
  },
  _GUICtrlSlider_SetSel: {
    documentation: 'Sets the starting and ending positions for the available selection range',
    label: '_GUICtrlSlider_SetSel ( $hWnd, $iMinimum, $iMaximum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Starting logical position for the selection range',
      },
      {
        label: '$iMaximum',
        documentation: 'Ending logical position for the selection range',
      },
    ],
  },
  _GUICtrlSlider_SetSelEnd: {
    documentation: 'Sets the ending logical position of the current selection range',
    label: '_GUICtrlSlider_SetSelEnd ( $hWnd, $iMaximum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMaximum',
        documentation: 'Ending logical position for the selection range',
      },
    ],
  },
  _GUICtrlSlider_SetSelStart: {
    documentation: 'Sets the starting logical position of the current selection range',
    label: '_GUICtrlSlider_SetSelStart ( $hWnd, $iMinimum )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinimum',
        documentation: 'Starting logical position for the selection range',
      },
    ],
  },
  _GUICtrlSlider_SetThumbLength: {
    documentation: 'Sets the length of the slider',
    label: '_GUICtrlSlider_SetThumbLength ( $hWnd, $iLength )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLength',
        documentation: 'Length, in pixels, of the slider',
      },
    ],
  },
  _GUICtrlSlider_SetTic: {
    documentation: 'Sets a tick mark in a slider at the specified logical position',
    label: '_GUICtrlSlider_SetTic ( $hWnd, $iPosition )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iPosition',
        documentation:
          "Position of the tick markThis parameter can be any of the integer values in the slider's range of minimum to maximum positions",
      },
    ],
  },
  _GUICtrlSlider_SetTicFreq: {
    documentation: 'Sets the interval frequency for tick marks in a slider',
    label: '_GUICtrlSlider_SetTicFreq ( $hWnd, $iFreg )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFreg',
        documentation: 'Frequency of the tick marks.',
      },
    ],
  },
  _GUICtrlSlider_SetTipSide: {
    documentation: 'Positions a ToolTip control',
    label: '_GUICtrlSlider_SetTipSide ( $hWnd, $iLocation )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLocation',
        documentation:
          'The location at which to display the ToolTip control. This value can be one of the following:    $TBTS_TOP - Will be positioned above the slider. This flag is for use with horizontal sliders.    $TBTS_LEFT - Will be positioned to the left of the slider. This flag is for use with vertical sliders.    $TBTS_BOTTOM - Will be positioned below the slider This flag is for use with horizontal sliders.    $TBTS_RIGHT - Will be positioned to the right of the slider. This flag is for use with vertical sliders.',
      },
    ],
  },
  _GUICtrlSlider_SetToolTips: {
    documentation: 'Assigns a ToolTip control to a slider control',
    label: '_GUICtrlSlider_SetToolTips ( $hWnd, $hWndTT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$hWndTT',
        documentation: 'Handle to an existing ToolTip control',
      },
    ],
  },
  _GUICtrlSlider_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag for the control',
    label: '_GUICtrlSlider_SetUnicodeFormat ( $hWnd, $bUnicode )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          'Determines the character set that is used by the control:    True - The control will use Unicode characters    False - The control will use ANSI characters',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
