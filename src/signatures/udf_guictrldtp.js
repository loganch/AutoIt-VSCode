import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlDTP.au3>`)';

const signatures = {
  _GUICtrlDTP_Create: {
    documentation: 'Create a DTP control',
    label:
      '_GUICtrlDTP_Create ( $hWnd, $iX, $iY [, $iWidth = 120 [, $iHeight = 21 [, $iStyle = 0x00000000 [, $iExStyle = 0x00000000]]]] )',
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
          '**[optional]** Control styles:    $DTS_APPCANPARSE - Allows the owner to parse user input and take action    $DTS_LONGDATEFORMAT - Displays the date in long format    $DTS_RIGHTALIGN - The calendar will be right-aligned    $DTS_SHOWNONE - Displays a check box that can be checked once a date is entered    $DTS_SHORTDATEFORMAT - Displays the date in short format    $DTS_SHORTDATECENTURYFORMAT - The year is a four-digit field    $DTS_TIMEFORMAT - Displays the time    $DTS_UPDOWN - Places an up-down control to the right of the controlForced: $WS_CHILD, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlDTP_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlDTP_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetMCColor: {
    documentation: 'Retrieves the specified color',
    label: '_GUICtrlDTP_GetMCColor ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Indicates which month calendar color to retrieve:    0 - Background color displayed between months    1 - Color used to display text within a month    2 - Background color displayed in the calendar title    3 - Color used to display text within the calendar title    4 - Background color displayed within the month    5 - Color used to display header day and trailing day text',
      },
    ],
  },
  _GUICtrlDTP_GetMCFont: {
    documentation: 'Retrieves the month calendar font handle',
    label: '_GUICtrlDTP_GetMCFont ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetMonthCal: {
    documentation: 'Retrieves the handle to child month calendar control',
    label: '_GUICtrlDTP_GetMonthCal ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetRange: {
    documentation: 'Retrieves the current minimum and maximum allowable system times',
    label: '_GUICtrlDTP_GetRange ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetRangeEx: {
    documentation: 'Retrieves the current minimum and maximum allowable system times',
    label: '_GUICtrlDTP_GetRangeEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetSystemTime: {
    documentation: 'Retrieves the currently selected date and time',
    label: '_GUICtrlDTP_GetSystemTime ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_GetSystemTimeEx: {
    documentation: 'Retrieves the currently selected date and time',
    label: '_GUICtrlDTP_GetSystemTimeEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlDTP_SetFormat: {
    documentation: 'Sets the display based on a given format string',
    label: '_GUICtrlDTP_SetFormat ( $hWnd, $sFormat )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sFormat',
        documentation:
          'String that defines the desired format. Setting this to blank will reset the control to the default format string for the current style. You can use the following format strings:    "d" - The one or two digit day    "dd" - The two digit day. Single digit day values are preceded by a zero    "ddd" - The three character weekday abbreviation    "dddd" - The full weekday name    "h" - The one or two digit hour in 12-hour format    "hh" - The two digit hour in 12-hour format    "H" - The one or two digit hour in 24-hour format    "HH" - The two digit hour in 24 hour format    "m" - The one or two digit minute    "mm" - The two digit minute    "M" - The one or two digit month number    "MM" - The two digit month number    "MMM" - The three-character month abbreviation    "MMMM" - The full month name    "t" - The one letter AM/PM abbreviation    "tt" - The two letter AM/PM abbreviation    "yy" - The last two digits of the year    "yyyy" - The full year',
      },
    ],
  },
  _GUICtrlDTP_SetMCColor: {
    documentation: 'Sets the color for a given portion of the month calendar',
    label: '_GUICtrlDTP_SetMCColor ( $hWnd, $iIndex, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Indicates which month calendar color to set:    0 - Background color displayed between months    1 - Color used to display text within a month    2 - Background color displayed in the calendar title    3 - Color used to display text within the calendar title    4 - Background color displayed within the month    5 - Color used to display header day and trailing day text',
      },
      {
        label: '$iColor',
        documentation: 'The color that will be set for the specified area',
      },
    ],
  },
  _GUICtrlDTP_SetMCFont: {
    documentation: 'Sets the month calendar font',
    label: '_GUICtrlDTP_SetMCFont ( $hWnd, $hFont [, $bRedraw = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$hFont',
        documentation: 'Handle to the font that will be set',
      },
      {
        label: '$bRedraw',
        documentation: '**[optional]** Specifies whether the control should be redrawn immediately',
      },
    ],
  },
  _GUICtrlDTP_SetRange: {
    documentation: 'Sets the current minimum and maximum allowable system times',
    label: '_GUICtrlDTP_SetRange ( $hWnd, ByRef $aRange )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aRange',
        documentation:
          'Array formatted as follows:    [ 0] - True if Min data is to be set, otherwise False    [ 1] - Min Year    [ 2] - Min Month    [ 3] - Min Day    [ 4] - Min Hour    [ 5] - Min Minute    [ 6] - Min Second    [ 7] - True if Max data is to be set, otherwise False    [ 8] - Max Year    [ 9] - Max Month    [10] - Max Day    [11] - Max Hour    [12] - Max Minute    [13] - Max Second',
      },
    ],
  },
  _GUICtrlDTP_SetRangeEx: {
    documentation: 'Sets the current minimum and maximum allowable system times',
    label: '_GUICtrlDTP_SetRangeEx ( $hWnd, ByRef $tRange )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tRange',
        documentation: '$tagDTPRANGE structure',
      },
    ],
  },
  _GUICtrlDTP_SetSystemTime: {
    documentation: 'Sets the currently selected date and time',
    label: '_GUICtrlDTP_SetSystemTime ( $hWnd, ByRef $aDate )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$aDate',
        documentation:
          'Array formatted as follows:    [0] - If True, the control will is set to "no date"    [1] - Year    [2] - Month    [3] - Day    [4] - Hour    [5] - Minute    [6] - Second',
      },
    ],
  },
  _GUICtrlDTP_SetSystemTimeEx: {
    documentation: 'Sets the currently selected date and time',
    label: '_GUICtrlDTP_SetSystemTimeEx ( $hWnd, ByRef $tDate [, $bFlag = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$tDate',
        documentation: '$tagSYSTEMTIME structure',
      },
      {
        label: '$bFlag',
        documentation:
          '**[optional]** No date setting:    True - Control will be set to "no date"    False - Control is set to date and time value',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
