import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlMonthCal.au3>`)';

const signatures = {
  _GUICtrlMonthCal_Create: {
    documentation: 'Creates a Month Calendar control',
    label:
      '_GUICtrlMonthCal_Create ( $hWnd, $iX, $iY [, $iStyle = 0x00000000 [, $iExStyle = 0x00000000]] )',
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
        label: '$iStyle',
        documentation:
          '**[optional]** Control styles:    $MCS_DAYSTATE - The month calendar will send $MCN_GETDAYSTATE notifications to request information about which days should be displayed in bold.    $MCS_MULTISELECT - The month calendar will allow the user to select a range of dates within the control    $MCS_WEEKNUMBERS - The month calendar control will display week numbers to the left of each row of days    $MCS_NOTODAYCIRCLE - The month calendar control will not circle the "today" date    $MCS_NOTODAY - The month calendar control will not display the "today" date at the bottomForced: $WS_CHILD, $WS_VISIBLE',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlMonthCal_Destroy: {
    documentation: 'Delete the MonthCal control',
    label: '_GUICtrlMonthCal_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetCalendarBorder: {
    documentation: 'Gets the size of the border, in pixels',
    label: '_GUICtrlMonthCal_GetCalendarBorder ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetCalendarCount: {
    documentation: 'Gets the number of calendars currently displayed in the calendar control',
    label: '_GUICtrlMonthCal_GetCalendarCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetColor: {
    documentation: 'Retrieves a given color for the control',
    label: '_GUICtrlMonthCal_GetColor ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Indicates which month calendar color to retrieve:    $MCSC_BACKGROUND - Background color displayed between months    $MCSC_TEXT - Color used to display text within a month    $MCSC_TITLEBK - Background color displayed in the calendar title    $MCSC_TITLETEXT - Color used to display text within the calendar title    $MCSC_MONTHBK - Background color displayed within the month    $MCSC_TRAILINGTEXT - Color used to display header day and trailing day text',
      },
    ],
  },
  _GUICtrlMonthCal_GetColorArray: {
    documentation: 'Retrieves the color for a given portion of a month calendar control',
    label: '_GUICtrlMonthCal_GetColorArray ( $hWnd, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iColor',
        documentation:
          "Value of type int specifying which month calendar color to retrieveThis value can be one of the following:    $MCSC_BACKGROUND - Retrieve the background color displayed between months.    $MCSC_MONTHBK - Retrieve the background color displayed within the month.    $MCSC_TEXT - Retrieve the color used to display text within a month.    $MCSC_TITLEBK - Retrieve the background color displayed in the calendar's title.    $MCSC_TITLETEXT - Retrieve the color used to display text within the calendar's title.    $MCSC_TRAILINGTEXT - Retrieve the color used to display header day and trailing day text.",
      },
    ],
  },
  _GUICtrlMonthCal_GetCurSel: {
    documentation: 'Retrieves the currently selected date',
    label: '_GUICtrlMonthCal_GetCurSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetCurSelStr: {
    documentation: 'Retrieves the currently selected date in string format',
    label: '_GUICtrlMonthCal_GetCurSelStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetFirstDOW: {
    documentation: 'Retrieves the first day of the week',
    label: '_GUICtrlMonthCal_GetFirstDOW ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetFirstDOWStr: {
    documentation: 'Retrieves the first day of the week as a string',
    label: '_GUICtrlMonthCal_GetFirstDOWStr ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMaxSelCount: {
    documentation:
      'Retrieves the maximum date range that can be selected in a month calendar control',
    label: '_GUICtrlMonthCal_GetMaxSelCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMaxTodayWidth: {
    documentation: 'Retrieves the maximum width of the "today" string in a month calendar control',
    label: '_GUICtrlMonthCal_GetMaxTodayWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMinReqHeight: {
    documentation: 'Retrieves the minimum height required to display a full month',
    label: '_GUICtrlMonthCal_GetMinReqHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMinReqRect: {
    documentation: 'Retrieves the minimum size required to display a full month',
    label: '_GUICtrlMonthCal_GetMinReqRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMinReqRectArray: {
    documentation:
      'Retrieves the minimum size required to display a full month in a month calendar control',
    label: '_GUICtrlMonthCal_GetMinReqRectArray ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMinReqWidth: {
    documentation: 'Retrieves the minimum width required to display a full month',
    label: '_GUICtrlMonthCal_GetMinReqWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthDelta: {
    documentation: 'Retrieves the scroll rate for a month calendar control',
    label: '_GUICtrlMonthCal_GetMonthDelta ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRange: {
    documentation: 'Retrieves date information that represents the high and low display limits',
    label: '_GUICtrlMonthCal_GetMonthRange ( $hWnd [, $bPartial = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bPartial',
        documentation:
          '**[optional]** Specifies the scope of the range limits to be retrieved:    True - Preceding and trailing months are included    False - Only months that are entirely displayed are included',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRangeMax: {
    documentation:
      'Retrieves date information that represents the high limit of the controls display',
    label: '_GUICtrlMonthCal_GetMonthRangeMax ( $hWnd [, $bPartial = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bPartial',
        documentation:
          '**[optional]** Specifies the scope of the range limits to be retrieved:    True - Preceding and trailing months are included    False - Only months that are entirely displayed are included',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRangeMaxStr: {
    documentation:
      'Retrieves date information that represents the high limit of the controls display in string format',
    label: '_GUICtrlMonthCal_GetMonthRangeMaxStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRangeMin: {
    documentation:
      'Retrieves date information that represents the low limit of the controls display',
    label: '_GUICtrlMonthCal_GetMonthRangeMin ( $hWnd [, $bPartial = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bPartial',
        documentation:
          '**[optional]** Specifies the scope of the range limits to be retrieved:    True - Preceding and trailing months are included    False - Only months that are entirely displayed are included',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRangeMinStr: {
    documentation:
      'Retrieves date information that represents the low limit of the controls display in string format',
    label: '_GUICtrlMonthCal_GetMonthRangeMinStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetMonthRangeSpan: {
    documentation: 'Returns a value that represents the range, in months, spanned',
    label: '_GUICtrlMonthCal_GetMonthRangeSpan ( $hWnd [, $bPartial = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bPartial',
        documentation:
          '**[optional]** Specifies the scope of the range limits to be retrieved:    True - Preceding and trailing months are included    False - Only months that are entirely displayed are included',
      },
    ],
  },
  _GUICtrlMonthCal_GetRange: {
    documentation: 'Retrieves the minimum and maximum allowable dates',
    label: '_GUICtrlMonthCal_GetRange ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetRangeMax: {
    documentation: 'Retrieves the upper limit date range',
    label: '_GUICtrlMonthCal_GetRangeMax ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetRangeMaxStr: {
    documentation: 'Retrieves the upper limit date range in string format',
    label: '_GUICtrlMonthCal_GetRangeMaxStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetRangeMin: {
    documentation: 'Retrieves the lower limit date range',
    label: '_GUICtrlMonthCal_GetRangeMin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetRangeMinStr: {
    documentation: 'Retrieves the lower limit date range in string form',
    label: '_GUICtrlMonthCal_GetRangeMinStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetSelRange: {
    documentation: 'Retrieves the upper and lower limits of the date range currently selected',
    label: '_GUICtrlMonthCal_GetSelRange ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetSelRangeMax: {
    documentation: 'Retrieves the upper date range currently selected by the user',
    label: '_GUICtrlMonthCal_GetSelRangeMax ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetSelRangeMaxStr: {
    documentation: 'Retrieves the upper date range currently selected by the user in string form',
    label: '_GUICtrlMonthCal_GetSelRangeMaxStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetSelRangeMin: {
    documentation: 'Retrieves the lower date range currently selected by the user',
    label: '_GUICtrlMonthCal_GetSelRangeMin ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetSelRangeMinStr: {
    documentation: 'Retrieves the lower date range currently selected by the user in string form',
    label: '_GUICtrlMonthCal_GetSelRangeMinStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetToday: {
    documentation: 'Retrieves the date information for the date specified as "today"',
    label: '_GUICtrlMonthCal_GetToday ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_GetTodayStr: {
    documentation:
      'Retrieves the date information for the date specified as "today" in string format',
    label: '_GUICtrlMonthCal_GetTodayStr ( $hWnd [, $sFormat = "%02d/%02d/%04d"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFormat',
        documentation: '**[optional]** StringFormat string used to format the date',
      },
    ],
  },
  _GUICtrlMonthCal_GetUnicodeFormat: {
    documentation: 'Retrieves the Unicode character format flag for the control',
    label: '_GUICtrlMonthCal_GetUnicodeFormat ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlMonthCal_HitTest: {
    documentation: 'Determines which portion of a month calendar control is at a given point',
    label: '_GUICtrlMonthCal_HitTest ( $hWnd, $iX, $iY )',
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
  _GUICtrlMonthCal_SetCalendarBorder: {
    documentation: 'Sets the size of the border, in pixels',
    label:
      '_GUICtrlMonthCal_SetCalendarBorder ( $hWnd [, $iBorderSize = 4 [, $bSetBorder = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iBorderSize',
        documentation: '**[optional]** Number of pixels of the border size',
      },
      {
        label: '$bSetBorder',
        documentation:
          '**[optional]** One of the Following:    True - The border size is set to the number of pixels that $iBorderSize specifies    False - The border size is reset to the default value specified by the theme, or zero if themes are not being used',
      },
    ],
  },
  _GUICtrlMonthCal_SetColor: {
    documentation: 'Sets the color for a given portion of the month calendar',
    label: '_GUICtrlMonthCal_SetColor ( $hWnd, $iIndex, $iColor )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          'Indicates which month calendar color to set:    $MCSC_BACKGROUND - Background color displayed between months    $MCSC_TEXT - Color used to display text within a month    $MCSC_TITLEBK - Background color displayed in the calendar title    $MCSC_TITLETEXT - Color used to display text within the calendar title    $MCSC_MONTHBK - Background color displayed within the month    $MCSC_TRAILINGTEXT - Color used to display header day and trailing day text',
      },
      {
        label: '$iColor',
        documentation: 'Color value',
      },
    ],
  },
  _GUICtrlMonthCal_SetCurSel: {
    documentation: 'Sets the currently selected date',
    label: '_GUICtrlMonthCal_SetCurSel ( $hWnd, $iYear, $iMonth, $iDay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iYear',
        documentation: 'Year value',
      },
      {
        label: '$iMonth',
        documentation: 'Month value',
      },
      {
        label: '$iDay',
        documentation: 'Day value',
      },
    ],
  },
  _GUICtrlMonthCal_SetDayState: {
    documentation: 'Sets the day states for all months that are currently visible',
    label: '_GUICtrlMonthCal_SetDayState ( $hWnd, $aMasks )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aMasks',
        documentation:
          'An array of integers that corresponds to the months that are visible in the calendar',
      },
    ],
  },
  _GUICtrlMonthCal_SetFirstDOW: {
    documentation: 'Sets the first day of the week for a month calendar control',
    label: '_GUICtrlMonthCal_SetFirstDOW ( $hWnd, $sDay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sDay',
        documentation:
          'In the following format:    0 or "Monday"    1 or "Tuesday"    2 or "Wednesday"    3 or "Thursday"    4 or "Friday"    5 or "Saturday"    6 or "Sunday"',
      },
    ],
  },
  _GUICtrlMonthCal_SetMaxSelCount: {
    documentation:
      'Sets the maximum number of days that can be selected in a month calendar control',
    label: '_GUICtrlMonthCal_SetMaxSelCount ( $hWnd, $iMaxSel )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMaxSel',
        documentation:
          'Value of type int that will be set to represent the maximum number of days that can be selected',
      },
    ],
  },
  _GUICtrlMonthCal_SetMonthDelta: {
    documentation: 'Sets the scroll rate for a month calendar control',
    label: '_GUICtrlMonthCal_SetMonthDelta ( $hWnd, $iDelta )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iDelta',
        documentation:
          "Value representing the number of months to be set as the control's scroll rate.If this value is zero, the month delta is reset to the default which is the number of months displayed in the control.",
      },
    ],
  },
  _GUICtrlMonthCal_SetRange: {
    documentation: 'Sets date information that represents the high and low limits',
    label:
      '_GUICtrlMonthCal_SetRange ( $hWnd, $iMinYear, $iMinMonth, $iMinDay, $iMaxYear, $iMaxMonth, $iMaxDay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinYear',
        documentation: 'Minimum year',
      },
      {
        label: '$iMinMonth',
        documentation: 'Minimum month',
      },
      {
        label: '$iMinDay',
        documentation: 'Minimum day',
      },
      {
        label: '$iMaxYear',
        documentation: 'Maximum year',
      },
      {
        label: '$iMaxMonth',
        documentation: 'Maximum month',
      },
      {
        label: '$iMaxDay',
        documentation: 'Maximum day',
      },
    ],
  },
  _GUICtrlMonthCal_SetSelRange: {
    documentation: 'Sets the selection for a month calendar control to a given date range',
    label:
      '_GUICtrlMonthCal_SetSelRange ( $hWnd, $iMinYear, $iMinMonth, $iMinDay, $iMaxYear, $iMaxMonth, $iMaxDay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMinYear',
        documentation: 'Minimum year',
      },
      {
        label: '$iMinMonth',
        documentation: 'Minimum month',
      },
      {
        label: '$iMinDay',
        documentation: 'Minimum day',
      },
      {
        label: '$iMaxYear',
        documentation: 'Maximum year',
      },
      {
        label: '$iMaxMonth',
        documentation: 'Maximum month',
      },
      {
        label: '$iMaxDay',
        documentation: 'Maximum day',
      },
    ],
  },
  _GUICtrlMonthCal_SetToday: {
    documentation: 'Sets the date information for the date specified as "today"',
    label: '_GUICtrlMonthCal_SetToday ( $hWnd, $iYear, $iMonth, $iDay )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iYear',
        documentation: 'Year',
      },
      {
        label: '$iMonth',
        documentation: 'Month',
      },
      {
        label: '$iDay',
        documentation: 'Day',
      },
    ],
  },
  _GUICtrlMonthCal_SetUnicodeFormat: {
    documentation: 'Sets the Unicode character format flag for the control',
    label: '_GUICtrlMonthCal_SetUnicodeFormat ( $hWnd [, $bUnicode = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Unicode format flag:    True - Control uses Unicode characters    False - Control uses ANSI characters',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
