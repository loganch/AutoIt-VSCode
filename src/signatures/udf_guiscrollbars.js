import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUIScrollBars.au3>`)';

const signatures = {
  _GUIScrollBars_EnableScrollBar: {
    documentation: 'Enable/Disable scrollbar',
    label:
      '_GUIScrollBars_EnableScrollBar ( $hWnd [, $iSBflags = $SB_BOTH [, $iArrows = $ESB_ENABLE_BOTH]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iSBflags',
        documentation:
          '**[optional]** Specifies the scroll bar type. This parameter can be one of the following values:    $SB_BOTH - Enables or disables the arrows on the horizontal and vertical scroll bars associated with the specified window.    $SB_CTL - Indicates that the scroll bar is a scroll bar control. The $hWnd must be the handle to the scroll bar control.    $SB_HORZ - Enables or disables the arrows on the horizontal scroll bar associated with the specified window.    $SB_VERT - Enables or disables the arrows on the vertical scroll bar associated with the specified window.',
      },
      {
        label: '$iArrows',
        documentation:
          '**[optional]** Specifies whether the scroll bar arrows are enabled or disabled and indicates which arrows are enabled or disabled.This parameter can be one of the following values    $ESB_DISABLE_BOTH - Disables both arrows on a scroll bar.    $ESB_DISABLE_DOWN - Disables the down arrow on a vertical scroll bar.    $ESB_DISABLE_LEFT - Disables the left arrow on a horizontal scroll bar.    $ESB_DISABLE_LTUP - Disables the left arrow on a horizontal scroll bar or the up arrow of a vertical scroll bar.    $ESB_DISABLE_RIGHT - Disables the right arrow on a horizontal scroll bar.    $ESB_DISABLE_RTDN - Disables the right arrow on a horizontal scroll bar or the down arrow of a vertical scroll bar.    $ESB_DISABLE_UP - Disables the up arrow on a vertical scroll bar.    $ESB_ENABLE_BOTH - Enables both arrows on a scroll bar.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarInfoEx: {
    documentation: 'Retrieves information about the specified scroll bar',
    label: '_GUIScrollBars_GetScrollBarInfoEx ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarRect: {
    documentation: 'Retrieves coordinates of the scroll bar',
    label: '_GUIScrollBars_GetScrollBarRect ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarRGState: {
    documentation: 'Retrieves the state of a scroll bar component',
    label: '_GUIScrollBars_GetScrollBarRGState ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarXYLineButton: {
    documentation: 'Retrieves the Height or width of the thumb',
    label: '_GUIScrollBars_GetScrollBarXYLineButton ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarXYThumbBottom: {
    documentation: 'Retrieves the Position of the bottom or right of the thumb',
    label: '_GUIScrollBars_GetScrollBarXYThumbBottom ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollBarXYThumbTop: {
    documentation: 'Retrieves the Position of the top or left of the thumb',
    label: '_GUIScrollBars_GetScrollBarXYThumbTop ( $hWnd, $iObject )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iObject',
        documentation:
          'Specifies the scroll bar object. This parameter can be one of the following values:    $OBJID_CLIENT - The $hWnd parameter is a handle to a scroll bar control.    $OBJID_HSCROLL - The horizontal scroll bar of the $hWnd window.    $OBJID_VSCROLL - The vertical scroll bar of the $hWnd window.',
      },
    ],
  },
  _GUIScrollBars_GetScrollInfo: {
    documentation: 'Retrieves the parameters of a scroll bar',
    label: '_GUIScrollBars_GetScrollInfo ( $hWnd, $iBar, ByRef $tSCROLLINFO )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
      {
        label: '$tSCROLLINFO',
        documentation: 'Structure of type $tagSCROLLINFO',
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoEx: {
    documentation: 'Retrieves the parameters of a scroll bar',
    label: '_GUIScrollBars_GetScrollInfoEx ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoMax: {
    documentation: 'Retrieves the maximum scrolling position',
    label: '_GUIScrollBars_GetScrollInfoMax ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoMin: {
    documentation: 'Retrieves the minimum scrolling position',
    label: '_GUIScrollBars_GetScrollInfoMin ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoPage: {
    documentation: 'Retrieves the page size',
    label: '_GUIScrollBars_GetScrollInfoPage ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoPos: {
    documentation: 'Retrieves the position of the scroll box',
    label: '_GUIScrollBars_GetScrollInfoPos ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollInfoTrackPos: {
    documentation: 'Retrieves the immediate position of a scroll box that the user is dragging',
    label: '_GUIScrollBars_GetScrollInfoTrackPos ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the parameters for a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the parameters for the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the parameters for the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollPos: {
    documentation:
      'Retrieves the current position of the scroll box (thumb) in the specified scroll bar',
    label: '_GUIScrollBars_GetScrollPos ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the position of the scroll box in a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the position of the scroll box in a window's standard horizontal scroll bar    $SB_VERT - Retrieves the position of the scroll box in a window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_GetScrollRange: {
    documentation:
      'Retrieves the current minimum and maximum scroll box (thumb) positions for the specified scroll bar',
    label: '_GUIScrollBars_GetScrollRange ( $hWnd, $iBar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Retrieves the positions of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Retrieves the positions of the window's standard horizontal scroll bar.    $SB_VERT - Retrieves the positions of the window's standard vertical scroll bar.",
      },
    ],
  },
  _GUIScrollBars_Init: {
    documentation: 'Initialize the scrollbars for the window',
    label: '_GUIScrollBars_Init ( $hWnd [, $iMaxH = -1 [, $iMaxV = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iMaxH',
        documentation: '**[optional]** Max size of Horizontal scrollbar',
      },
      {
        label: '$iMaxV',
        documentation: '**[optional]** Max size of Vertical scrollbar',
      },
    ],
  },
  _GUIScrollBars_ScrollWindow: {
    documentation: "Scrolls the contents of the specified window's client area",
    label: '_GUIScrollBars_ScrollWindow ( $hWnd, $iXAmount, $iYAmount )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iXAmount',
        documentation: 'Specifies the amount, in device units, of horizontal scrolling',
      },
      {
        label: '$iYAmount',
        documentation: 'Specifies the amount, in device units, of vertical scrolling',
      },
    ],
  },
  _GUIScrollBars_SetScrollInfo: {
    documentation: 'Sets the parameters of a scroll bar',
    label: '_GUIScrollBars_SetScrollInfo ( $hWnd, $iBar, $tSCROLLINFO [, $bRedraw = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the parameters of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the parameters of the window's standard horizontal scroll bar.    $SB_VERT - Sets the parameters of the window's standard vertical scroll bar.",
      },
      {
        label: '$tSCROLLINFO',
        documentation: 'Structure of type $tagSCROLLINFO',
      },
      {
        label: '$bRedraw',
        documentation:
          '**[optional]** Specifies whether the scroll bar is redrawn to reflect the changes to the scroll bar',
      },
    ],
  },
  _GUIScrollBars_SetScrollInfoMax: {
    documentation: 'Sets the maximum scrolling position',
    label: '_GUIScrollBars_SetScrollInfoMax ( $hWnd, $iBar, $iMax )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the parameters of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the parameters of the window's standard horizontal scroll bar.    $SB_VERT - Sets the parameters of the window's standard vertical scroll bar.",
      },
      {
        label: '$iMax',
        documentation: 'Maximum scrolling position',
      },
    ],
  },
  _GUIScrollBars_SetScrollInfoMin: {
    documentation: 'Sets the minimum scrolling position',
    label: '_GUIScrollBars_SetScrollInfoMin ( $hWnd, $iBar, $iMin )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the parameters of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the parameters of the window's standard horizontal scroll bar.    $SB_VERT - Sets the parameters of the window's standard vertical scroll bar.",
      },
      {
        label: '$iMin',
        documentation: 'Minimum scrolling position',
      },
    ],
  },
  _GUIScrollBars_SetScrollInfoPage: {
    documentation: 'Sets the page size',
    label: '_GUIScrollBars_SetScrollInfoPage ( $hWnd, $iBar, $iPage )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the parameters of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the parameters of the window's standard horizontal scroll bar.    $SB_VERT - Sets the parameters of the window's standard vertical scroll bar.",
      },
      {
        label: '$iPage',
        documentation: 'Page size',
      },
    ],
  },
  _GUIScrollBars_SetScrollInfoPos: {
    documentation: 'Sets the position of the scroll box (thumb) in the specified scroll bar',
    label: '_GUIScrollBars_SetScrollInfoPos ( $hWnd, $iBar, $iPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the parameters of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the parameters of the window's standard horizontal scroll bar.    $SB_VERT - Sets the parameters of the window's standard vertical scroll bar.",
      },
      {
        label: '$iPos',
        documentation: 'Position of the scroll box',
      },
    ],
  },
  _GUIScrollBars_SetScrollRange: {
    documentation: 'Sets the minimum and maximum scroll box positions for the specified scroll bar',
    label: '_GUIScrollBars_SetScrollRange ( $hWnd, $iBar, $iMinPos, $iMaxPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_CTL - Sets the range of a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Sets the range of a window's standard horizontal scroll bar.    $SB_VERT - Sets the range of a window's standard vertical scroll bar.",
      },
      {
        label: '$iMinPos',
        documentation: 'Specifies the minimum scrolling position',
      },
      {
        label: '$iMaxPos',
        documentation: 'Specifies the maximum scrolling position',
      },
    ],
  },
  _GUIScrollBars_ShowScrollBar: {
    documentation: 'Shows or hides the specified scroll bar',
    label: '_GUIScrollBars_ShowScrollBar ( $hWnd, $iBar [, $bShow = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window',
      },
      {
        label: '$iBar',
        documentation:
          "Specifies the type of scroll bar. This parameter can be one of the following values:    $SB_BOTH - Shows or hides a window's standard horizontal and vertical scroll bars.    $SB_CTL - Shows or hides a scroll bar control. The $hWnd parameter must be the handle to the scroll bar control.    $SB_HORZ - Shows or hides a window's standard horizontal scroll bars.    $SB_VERT - Shows or hides a window's standard vertical scroll bar.",
      },
      {
        label: '$bShow',
        documentation: '**[optional]** Specifies whether the scroll bar is shown or hidden',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
