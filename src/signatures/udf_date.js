import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Date.au3>`)';

const signatures = {
  _DateAdd: {
    documentation:
      'Calculates a new date/time by adding/subtracting a specified number of time intervals from an initial date/time',
    label: '_DateAdd ( $sType, $iNumber, $sDate )',
    params: [
      {
        label: '$sType',
        documentation:
          'Time interval to be used:  \nD - Add/subtract days to/from the specified date  \nM - Add/subtract months to/from the specified date  \nY - Add/subtract years to/from the specified date  \nw - Add/subtract Weeks to/from the specified date  \nh - Add/subtract hours to/from the specified date  \nn - Add/subtract minutes to/from the specified en date  \ns - Add/subtract seconds to/from the specified date',
      },
      {
        label: '$iNumber',
        documentation:
          'Number of intervals to be added/subtracted (use unary minus for subtraction)',
      },
      {
        label: '$sDate',
        documentation: 'Initial date in the format YYYY/MM/DD[ HH:MM:SS]',
      },
    ],
  },
  _DateDayOfWeek: {
    documentation: 'Returns the name of the weekday, based on the specified day',
    label: '_DateDayOfWeek ( $iDayNum [, $iFormat = 0] )',
    params: [
      {
        label: '$iDayNum',
        documentation:
          'Day number  \n1 = Sunday  \n2 = Monday  \n3 = Tuesday  \n4 = Wednesday  \n5 = Thursday  \n6 = Friday  \n7 = Saturday',
      },
      {
        label: '$iFormat',
        documentation:
          "**[optional]** Format:  \n`$DMW_LOCALE_USER` (0) - Long name of the weekday (Default)  \n`$DMW_SHORTNAME` (1) - Short name of the weekday e.g. Mon  \n`$DMW_LOCALE_LONGNAME` (2) - Long name of the weekday in the user's default language  \n`$DMW_LOCALE_SHORTNAME` (3) - Short name of the weekday in the user's default language",
      },
    ],
  },
  _DateDaysInMonth: {
    documentation: 'Returns the number of days in a month, based on the specified month and year',
    label: '_DateDaysInMonth ( $iYear, $iMonthNum )',
    params: [
      {
        label: '$iYear',
        documentation: '4-digit year.',
      },
      {
        label: '$iMonthNum',
        documentation: 'Month number (1 = January, 12 = December).',
      },
    ],
  },
  _DateDiff: {
    documentation: 'Returns the difference between 2 dates, expressed in the type requested',
    label: '_DateDiff ( $sType, $sStartDate, $sEndDate )',
    params: [
      {
        label: '$sType',
        documentation:
          'One of the following:  \nD = Difference in days between the given dates  \nM = Difference in months between the given dates  \nY = Difference in years between the given dates  \nw = Difference in Weeks between the given dates  \nh = Difference in hours between the given dates  \nn = Difference in minutes between the given dates  \ns = Difference in seconds between the given dates',
      },
      {
        label: '$sStartDate',
        documentation: 'Input Start date in the format "YYYY/MM/DD[ HH:MM:SS]"',
      },
      {
        label: '$sEndDate',
        documentation: 'Input End date in the format "YYYY/MM/DD[ HH:MM:SS]"',
      },
    ],
  },
  _DateIsLeapYear: {
    documentation: 'Checks a given year to see if it is a leap year',
    label: '_DateIsLeapYear ( $iYear )',
    params: [
      {
        label: '$iYear',
        documentation: 'The 4-digit year to check.',
      },
    ],
  },
  _DateIsValid: {
    documentation: 'Checks the given date to determine if it is a valid date',
    label: '_DateIsValid ( $sDate )',
    params: [
      {
        label: '$sDate',
        documentation: 'The date to be checked.',
      },
    ],
  },
  _DateTimeFormat: {
    documentation: "Returns the date in the PC's regional settings format",
    label: '_DateTimeFormat ( $sDate, $sType )',
    params: [
      {
        label: '$sDate',
        documentation: 'Input date in the format "YYYY/MM/DD[ HH:MM:SS]"',
      },
      {
        label: '$sType',
        documentation:
          "one the following:  \n0 - Display a date and/or time. If there is a date part, display it as a short date.  \nIf there is a time part, display it as a long time. If present, both parts are displayed.  \n1 - Display a date using the long date format specified in your computer's regional settings.  \n2 - Display a date using the short date format specified in your computer's regional settings.  \n3 - Display a time using the time format specified in your computer's regional settings.  \n4 - Display a time using the 24-hour format (hh:mm).  \n5 - Display a time using the 24-hour format (hh:mm:ss).",
      },
    ],
  },
  _DateTimeSplit: {
    documentation: 'Split a string containing Date and Time into two separate Arrays',
    label: '_DateTimeSplit ( $sDate, ByRef $aDatePart, ByRef $iTimePart )',
    params: [
      {
        label: '$sDate',
        documentation:
          'Any of these formats: "yyyy/mm/dd[ hh:mm[:ss]]"; "yyyy/mm/dd[Thh:mm[:ss]]"; "yyyy-mm-dd[ hh:mm[:ss]]"; "yyyy-mm-dd[Thh:mm[:ss]]"; "yyyy.mm.dd[ hh:mm[:ss]]"; "yyyy.mm.dd[Thh:mm[:ss]]"',
      },
      {
        label: '$aDatePart',
        documentation: 'array that contains the Date. $aDatePart[0] number of values returned',
      },
      {
        label: '$iTimePart',
        documentation: 'array that contains the Time. $aTimePart[0] number of values returned',
      },
    ],
  },
  _DateToDayOfWeek: {
    documentation: 'Returns the weekday number for a given date',
    label: '_DateToDayOfWeek ( $iYear, $iMonth, $iDay )',
    params: [
      {
        label: '$iYear',
        documentation: 'A valid year in format YYYY',
      },
      {
        label: '$iMonth',
        documentation: 'A valid month in format MM',
      },
      {
        label: '$iDay',
        documentation: 'A valid day in format DD',
      },
    ],
  },
  _DateToDayOfWeekISO: {
    documentation: 'Returns the ISO weekday number for a given date',
    label: '_DateToDayOfWeekISO ( $iYear, $iMonth, $iDay )',
    params: [
      {
        label: '$iYear',
        documentation: 'A valid year in format YYYY',
      },
      {
        label: '$iMonth',
        documentation: 'A valid month in format MM',
      },
      {
        label: '$iDay',
        documentation: 'A valid day in format DD',
      },
    ],
  },
  _DateToDayValue: {
    documentation: 'Returns the day number since noon 4713 BC January 1 for a given Gregorian date',
    label: '_DateToDayValue ( $iYear, $iMonth, $iDay )',
    params: [
      {
        label: '$iYear',
        documentation: 'A valid year in format YYYY',
      },
      {
        label: '$iMonth',
        documentation: 'A valid month in format MM',
      },
      {
        label: '$iDay',
        documentation: 'A valid day in format DD',
      },
    ],
  },
  _DateToMonth: {
    documentation: 'Returns the name of the month, based on the specified month',
    label: '_DateToMonth ( $iMonNum [, $iFormat = 0] )',
    params: [
      {
        label: '$iMonNum',
        documentation: 'Month number (1-12)',
      },
      {
        label: '$iFormat',
        documentation:
          "**[optional]** Format:  \n`$DMW_LOCALE_USER` (0) - Long name of the month (Default)  \n`$DMW_SHORTNAME` (1) - Short name of the month e.g. Jan  \n`$DMW_LOCALE_LONGNAME` (2) - Long name of the month in the user's default language           \n`$DMW_LOCALE_SHORTNAME` (3) - Short name of the month in the user's default language",
      },
    ],
  },
  _Date_Time_CompareFileTime: {
    documentation: 'Compares two file times',
    label: '_Date_Time_CompareFileTime ( $tFileTime1, $tFileTime2 )',
    params: [
      {
        label: '$tFileTime1',
        documentation: 'first $tagFILETIME structure or a pointer to it',
      },
      {
        label: '$tFileTime2',
        documentation: 'second $tagFILETIME structure or a pointer to it',
      },
    ],
  },
  _Date_Time_DOSDateTimeToArray: {
    documentation: 'Decode a DOS date/time to an array',
    label: '_Date_Time_DOSDateTimeToArray ( $iDosDate, $iDosTime )',
    params: [
      {
        label: '$iDosDate',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Day of the month (1–31)  \nBits 5- 8 Month (1 = January, 2 = February, and so on)  \nBits 9-15 Year offset from 1980 (add 1980 to get actual year)',
      },
      {
        label: '$iDosTime',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Second divided by 2  \nBits 5-10 Minute (0–59)  \nBits 11-15 Hour (0–23 on a 24-hour clock)',
      },
    ],
  },
  _Date_Time_DOSDateTimeToFileTime: {
    documentation: 'Converts MS-DOS date and time values to a file time',
    label: '_Date_Time_DOSDateTimeToFileTime ( $iFatDate, $iFatTime )',
    params: [
      {
        label: '$iFatDate',
        documentation:
          'The MS-DOS date, packed as follows:  \nBits 0- 4 Day of the month (1–31)  \nBits 5- 8 Month (1 = January, 2 = February, and so on)  \nBits 9-15 Year offset from 1980 (add 1980 to get actual year)',
      },
      {
        label: '$iFatTime',
        documentation:
          'The MS-DOS date, packed as follows:  \nBits 0- 4 Second divided by 2  \nBits 5-10 Minute (0–59)  \nBits 11-15 Hour (0–23 on a 24-hour clock)',
      },
    ],
  },
  _Date_Time_DOSDateTimeToStr: {
    documentation: 'Decode a DOS date to a string',
    label: '_Date_Time_DOSDateTimeToStr ( $iDosDate, $iDosTime )',
    params: [
      {
        label: '$iDosDate',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Day of the month (1–31)  \nBits 5- 8 Month (1 = January, 2 = February, and so on)  \nBits 9-15 Year offset from 1980 (add 1980 to get actual year)',
      },
      {
        label: '$iDosTime',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Second divided by 2  \nBits 5-10 Minute (0–59)  \nBits 11-15 Hour (0–23 on a 24-hour clock)',
      },
    ],
  },
  _Date_Time_DOSDateToArray: {
    documentation: 'Decode a DOS date to an array',
    label: '_Date_Time_DOSDateToArray ( $iDosDate )',
    params: [
      {
        label: '$iDosDate',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Day of the month (1–31)  \nBits 5- 8 Month (1 = January, 2 = February, and so on)  \nBits 9-15 Year offset from 1980 (add 1980 to get actual year)',
      },
    ],
  },
  _Date_Time_DOSDateToStr: {
    documentation: 'Decode a DOS date to a string',
    label: '_Date_Time_DOSDateToStr ( $iDosDate )',
    params: [
      {
        label: '$iDosDate',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Day of the month (1–31)  \nBits 5- 8 Month (1 = January, 2 = February, and so on)  \nBits 9-15 Year offset from 1980 (add 1980 to get actual year)',
      },
    ],
  },
  _Date_Time_DOSTimeToArray: {
    documentation: 'Decode a DOS time to an array',
    label: '_Date_Time_DOSTimeToArray ( $iDosTime )',
    params: [
      {
        label: '$iDosTime',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Second divided by 2  \nBits 5-10 Minute (0–59)  \nBits 11-15 Hour (0–23 on a 24-hour clock)',
      },
    ],
  },
  _Date_Time_DOSTimeToStr: {
    documentation: 'Decode a DOS time to a string',
    label: '_Date_Time_DOSTimeToStr ( $iDosTime )',
    params: [
      {
        label: '$iDosTime',
        documentation:
          'MS-DOS date, packed as follows:  \nBits 0- 4 Second divided by 2  \nBits 5-10 Minute (0–59)  \nBits 11-15 Hour (0–23 on a 24-hour clock)',
      },
    ],
  },
  _Date_Time_EncodeFileTime: {
    documentation: 'Encodes and returns a $tagFILETIME structure',
    label:
      '_Date_Time_EncodeFileTime ( $iMonth, $iDay, $iYear [, $iHour = 0 [, $iMinute = 0 [, $iSecond = 0 [, $iMSeconds = 0]]]] )',
    params: [
      {
        label: '$iMonth',
        documentation: 'Month',
      },
      {
        label: '$iDay',
        documentation: 'Day',
      },
      {
        label: '$iYear',
        documentation: 'Year',
      },
      {
        label: '$iHour',
        documentation: '**[optional]** Hour',
      },
      {
        label: '$iMinute',
        documentation: '**[optional]** Minute',
      },
      {
        label: '$iSecond',
        documentation: '**[optional]** Second',
      },
      {
        label: '$iMSeconds',
        documentation: '**[optional]** Milliseconds',
      },
    ],
  },
  _Date_Time_EncodeSystemTime: {
    documentation: 'Encodes and returns a $tagSYSTEMTIME structure',
    label:
      '_Date_Time_EncodeSystemTime ( $iMonth, $iDay, $iYear [, $iHour = 0 [, $iMinute = 0 [, $iSecond = 0 [, $iMSeconds = 0]]]] )',
    params: [
      {
        label: '$iMonth',
        documentation: 'Month',
      },
      {
        label: '$iDay',
        documentation: 'Day',
      },
      {
        label: '$iYear',
        documentation: 'Year',
      },
      {
        label: '$iHour',
        documentation: '**[optional]** Hour',
      },
      {
        label: '$iMinute',
        documentation: '**[optional]** Minute',
      },
      {
        label: '$iSecond',
        documentation: '**[optional]** Second',
      },
      {
        label: '$iMSeconds',
        documentation: '**[optional]** Milliseconds',
      },
    ],
  },
  _Date_Time_FileTimeToArray: {
    documentation: 'Decode a file time to an array',
    label: '_Date_Time_FileTimeToArray ( ByRef $tFileTime )',
    params: [
      {
        label: '$tFileTime',
        documentation: '$tagFILETIME structure',
      },
    ],
  },
  _Date_Time_FileTimeToDOSDateTime: {
    documentation: 'Converts MS-DOS date and time values to a file time',
    label: '_Date_Time_FileTimeToDOSDateTime ( $tFileTime )',
    params: [
      {
        label: '$tFileTime',
        documentation:
          'a $tagFILETIME structure containing the file time to convert to MS-DOS format or a pointer to it',
      },
    ],
  },
  _Date_Time_FileTimeToLocalFileTime: {
    documentation:
      'Converts a file time based on the Coordinated Universal Time to a local file time',
    label: '_Date_Time_FileTimeToLocalFileTime ( $tFileTime )',
    params: [
      {
        label: '$tFileTime',
        documentation:
          'a $tagFILETIME structure containing the UTC based file time to be converted into a local file time or a pointer to it.',
      },
    ],
  },
  _Date_Time_FileTimeToStr: {
    documentation: 'Decode a file time to a date/time string',
    label: '_Date_Time_FileTimeToStr ( ByRef $tFileTime [, $iFmt = 0] )',
    params: [
      {
        label: '$tFileTime',
        documentation: '$tagFILETIME structure',
      },
      {
        label: '$iFmt',
        documentation:
          '**[optional]** 0 returns mm/dd/yyyy hh:mm:ss (Default)  \n1 returns yyyy/mm/dd hh:mm:ss',
      },
    ],
  },
  _Date_Time_FileTimeToSystemTime: {
    documentation: 'Converts a file time to system time format',
    label: '_Date_Time_FileTimeToSystemTime ( $tFileTime )',
    params: [
      {
        label: '$tFileTime',
        documentation:
          'a $tagFILETIME structure containing the file time to convert to system date and time format or a pointer to it.',
      },
    ],
  },
  _Date_Time_GetFileTime: {
    documentation: 'Retrieves the date and time that a file was created, accessed and modified',
    label: '_Date_Time_GetFileTime ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file for which dates and times are to be retrieved. The file handle must have been created using the CreateFile function with the GENERIC_READ access right.',
      },
    ],
  },
  _Date_Time_GetLocalTime: {
    documentation: 'Retrieves the current local date and time',
    label: '_Date_Time_GetLocalTime (  )',
    params: [],
  },
  _Date_Time_GetSystemTime: {
    documentation: 'Retrieves the current system date and time expressed in UTC',
    label: '_Date_Time_GetSystemTime (  )',
    params: [],
  },
  _Date_Time_GetSystemTimeAdjustment: {
    documentation: 'Determines whether the system is applying periodic time adjustments',
    label: '_Date_Time_GetSystemTimeAdjustment (  )',
    params: [],
  },
  _Date_Time_GetSystemTimeAsFileTime: {
    documentation: 'Retrieves the current system date and time expressed in UTC',
    label: '_Date_Time_GetSystemTimeAsFileTime (  )',
    params: [],
  },
  _Date_Time_GetSystemTimes: {
    documentation: 'Retrieves system timing information',
    label: '_Date_Time_GetSystemTimes (  )',
    params: [],
  },
  _Date_Time_GetTickCount: {
    documentation:
      'Retrieves the number of milliseconds that have elapsed since Windows was started',
    label: '_Date_Time_GetTickCount (  )',
    params: [],
  },
  _Date_Time_GetTimeZoneInformation: {
    documentation: 'Retrieves the current time zone settings',
    label: '_Date_Time_GetTimeZoneInformation (  )',
    params: [],
  },
  _Date_Time_LocalFileTimeToFileTime: {
    documentation: 'Converts a local file time to a file time based on UTC',
    label: '_Date_Time_LocalFileTimeToFileTime ( $tLocalTime )',
    params: [
      {
        label: '$tLocalTime',
        documentation:
          'a $tagFILETIME structure that specifies the local file time to be converted into a UTC based file time or a pointer to it.',
      },
    ],
  },
  _Date_Time_SetFileTime: {
    documentation: 'Sets the date and time that a file was created, accessed and modified',
    label: '_Date_Time_SetFileTime ( $hFile, $tCreateTime, $tLastAccess, $tLastWrite )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file. The file handle must have been created using the CreateFile function with the FILE_WRITE_ATTRIBUTES access right.',
      },
      {
        label: '$tCreateTime',
        documentation:
          'a $tagFILETIME structure that contains the new date and time the file was created.  \nThis can be 0 if the application does not need to set this information.',
      },
      {
        label: '$tLastAccess',
        documentation:
          'a $tagFILETIME structure that contains the new date and time the file was last accessed.  \nThe last access time includes the last time the file was written to, read from, or (in the case of executable files) run.  \nThis can be 0 if the application does not need to set this information.  \nTo preserve the existing last access time for a file even after accessing a file, call SetFileTime with this parameter set to -1 before closing the file handle.',
      },
      {
        label: '$tLastWrite',
        documentation:
          'a $tagFILETIME structure that contains the new date and time the file was last written to.  \nThis can be 0 if the application does not want to set this information.',
      },
    ],
  },
  _Date_Time_SetLocalTime: {
    documentation: 'Sets the current local date and time',
    label: '_Date_Time_SetLocalTime ( $tSYSTEMTIME )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation:
          'a $tagSYSTEMTIME structure that contains the new local date and time or a pointer to it',
      },
    ],
  },
  _Date_Time_SetSystemTime: {
    documentation: 'Sets the current system time and date, expressed in UTC',
    label: '_Date_Time_SetSystemTime ( $tSYSTEMTIME )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation:
          'a $tagSYSTEMTIME structure that contains the new system date and time or a pointer to it',
      },
    ],
  },
  _Date_Time_SetSystemTimeAdjustment: {
    documentation:
      "Enables or disables periodic time adjustments to the system's time of day clock",
    label: '_Date_Time_SetSystemTimeAdjustment ( $iAdjustment, $bDisabled )',
    params: [
      {
        label: '$iAdjustment',
        documentation:
          'The number of 100 nanosecond units added to the time of day clock at each clock interrupt if periodic time adjustment is enabled.',
      },
      {
        label: '$bDisabled',
        documentation:
          "A value of True specifies that periodic time adjustment is to be disabled. The system is free to adjust time of day using its own internal mechanisms. The system's internal adjustment mechanisms may cause the time-of-day clock to jump noticeably when adjustments are made. A value of False specifies that periodic time adjustment is to be enabled, and will be used to adjust the time of day clock. The system will not interfere with the time adjustment scheme, and will not attempt to synchronize time of day on its own.The system will add the value of $iAdjustment to the time of day at each clock interrupt.",
      },
    ],
  },
  _Date_Time_SetTimeZoneInformation: {
    documentation: 'Sets the current time zone settings',
    label:
      '_Date_Time_SetTimeZoneInformation ( $iBias, $sStdName, $tStdDate, $iStdBias, $sDayName, $tDayDate, $iDayBias )',
    params: [
      {
        label: '$iBias',
        documentation:
          'The current bias for local time translation on this computer. The bias is the difference in minutes between Coordinated Universal Time (UTC) and local time.  \nAll translations between UTC and local time use the following formula: UTC = local time + bias',
      },
      {
        label: '$sStdName',
        documentation: 'The description for standard time',
      },
      {
        label: '$tStdDate',
        documentation:
          'A $tagSYSTEMTIME structure that contains a date and local time when the transition from daylight saving time to standard time occurs.',
      },
      {
        label: '$iStdBias',
        documentation:
          'The bias value to be used during local time translations that occur during standard time. This value is added to the value of the Bias to form the bias used during standard time. In most time zones, this value is zero.',
      },
      {
        label: '$sDayName',
        documentation: 'The description for daylight saving time',
      },
      {
        label: '$tDayDate',
        documentation:
          'A $tagSYSTEMTIME structure that contains a date and local time when the transition from standard time to daylight saving time occurs.',
      },
      {
        label: '$iDayBias',
        documentation:
          'The bias value to be used during local time translation that occur during daylight saving time. This value is added to the value of the Bias member to form the bias used during daylight saving time. In most time zones this value is –60.',
      },
    ],
  },
  _Date_Time_SystemTimeToArray: {
    documentation: 'Decode a system time to an array',
    label: '_Date_Time_SystemTimeToArray ( ByRef $tSYSTEMTIME )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation: '$tagSYSTEMTIME structure',
      },
    ],
  },
  _Date_Time_SystemTimeToDateStr: {
    documentation: 'Decode a system time to a date string',
    label: '_Date_Time_SystemTimeToDateStr ( ByRef $tSYSTEMTIME [, $iFmt = 0] )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation: '$tagSYSTEMTIME structure',
      },
      {
        label: '$iFmt',
        documentation: '**[optional]** 0 returns mm/dd/yyyy (Default)  \n1 returns yyyy/mm/dd',
      },
    ],
  },
  _Date_Time_SystemTimeToDateTimeStr: {
    documentation: 'Decode a system time to a date/time string',
    label: '_Date_Time_SystemTimeToDateTimeStr ( ByRef $tSYSTEMTIME [, $iFmt = 0] )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation: '$tagSYSTEMTIME structure',
      },
      {
        label: '$iFmt',
        documentation:
          '**[optional]** 0 returns mm/dd/yyyy hh:mm:ss (Default)  \n1 returns yyyy/mm/dd hh:mm:ss',
      },
    ],
  },
  _Date_Time_SystemTimeToFileTime: {
    documentation: 'Converts a system time to file time format',
    label: '_Date_Time_SystemTimeToFileTime ( $tSYSTEMTIME )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation: 'a $tagSYSTEMTIME structure to be converted or a pointer to it.',
      },
    ],
  },
  _Date_Time_SystemTimeToTimeStr: {
    documentation: 'Decode a system time to a time string',
    label: '_Date_Time_SystemTimeToTimeStr ( ByRef $tSYSTEMTIME )',
    params: [
      {
        label: '$tSYSTEMTIME',
        documentation: '$tagSYSTEMTIME structure',
      },
    ],
  },
  _Date_Time_SystemTimeToTzSpecificLocalTime: {
    documentation: "Converts a UTC time to a specified time zone's corresponding local time",
    label: '_Date_Time_SystemTimeToTzSpecificLocalTime ( $tUTC [, $tTimeZone = 0] )',
    params: [
      {
        label: '$tUTC',
        documentation:
          "a $tagSYSTEMTIME structure that specifies a time in UTC or a pointer to it. The function converts this time to the specified time zone's local time.",
      },
      {
        label: '$tTimeZone',
        documentation:
          '**[optional]** a $tagTIME_ZONE_INFORMATION structure that specifies the time zone of interest or a pointer to it.  \nIf 0, the function uses the currently active time zone.',
      },
    ],
  },
  _Date_Time_TzSpecificLocalTimeToSystemTime: {
    documentation: 'Converts a local time to a time in UTC',
    label: '_Date_Time_TzSpecificLocalTimeToSystemTime ( $tLocalTime [, $tTimeZone = 0] )',
    params: [
      {
        label: '$tLocalTime',
        documentation:
          'a $tagSYSTEMTIME structure that specifies a local time or a pointer to it. The function converts this time to the corresponding UTC time.',
      },
      {
        label: '$tTimeZone',
        documentation:
          '**[optional]** a $tagTIME_ZONE_INFORMATION structure that specifies the time zone of interest or a pointer to it.  \nIf 0, the function uses the currently active time zone.',
      },
    ],
  },
  _DayValueToDate: {
    documentation: 'Add the given days since noon 4713 BC January 1 and returns the Gregorian date',
    label: '_DayValueToDate ( $iJulianDate, ByRef $iYear, ByRef $iMonth, ByRef $iDay )',
    params: [
      {
        label: '$iJulianDate',
        documentation: 'A valid number of days.',
      },
      {
        label: '$iYear',
        documentation: 'will return the year in format YYYY',
      },
      {
        label: '$iMonth',
        documentation: 'will return the month in format MM',
      },
      {
        label: '$iDay',
        documentation: 'will return the day in format DD',
      },
    ],
  },
  _Now: {
    documentation: "Returns the current Date and Time in PC's format",
    label: '_Now (  )',
    params: [],
  },
  _NowCalc: {
    documentation:
      'Returns the current Date and Time in format YYYY/MM/DD HH:MM:SS for use in date calculations',
    label: '_NowCalc (  )',
    params: [],
  },
  _NowCalcDate: {
    documentation: 'Returns the current Date in format YYYY/MM/DD',
    label: '_NowCalcDate (  )',
    params: [],
  },
  _NowDate: {
    documentation: "Returns the current Date in the Pc's format",
    label: '_NowDate (  )',
    params: [],
  },
  _NowTime: {
    documentation: 'Returns the current Time in the requested format',
    label: '_NowTime ( [$sType = 3] )',
    params: [
      {
        label: '$sType',
        documentation:
          "**[optional]**    3 = (default) Display a time using the time format specified in your computer's regional settings.    4 - Display a time using the 24-hour format (hh:mm).    5 - Display a time using the 24-hour format (hh:mm:ss).",
      },
    ],
  },
  _TicksToTime: {
    documentation: 'Converts the specified tick amount to hours, minutes and seconds',
    label: '_TicksToTime ( $iTicks, ByRef $iHours, ByRef $iMins, ByRef $iSecs )',
    params: [
      {
        label: '$iTicks',
        documentation: 'Tick amount.',
      },
      {
        label: '$iHours',
        documentation: 'Variable to store the hours.',
      },
      {
        label: '$iMins',
        documentation: 'Variable to store the minutes.',
      },
      {
        label: '$iSecs',
        documentation: 'Variable to store the seconds.',
      },
    ],
  },
  _TimeToTicks: {
    documentation: 'Converts the specified hours, minutes, and seconds to ticks',
    label: '_TimeToTicks ( [$iHours = @HOUR [, $iMins = @MIN [, $iSecs = @SEC]]] )',
    params: [
      {
        label: '$iHours',
        documentation: '**[optional]** The hours.',
      },
      {
        label: '$iMins',
        documentation: '**[optional]** The minutes.',
      },
      {
        label: '$iSecs',
        documentation: '**[optional]** The seconds.',
      },
    ],
  },
  _WeekNumberISO: {
    documentation: 'Calculate the weeknumber of a given date',
    label: '_WeekNumberISO ( [$iYear = @YEAR [, $iMonth = @MON [, $iDay = @MDAY]]] )',
    params: [
      {
        label: '$iYear',
        documentation: '**[optional]** Year value (default = current year)',
      },
      {
        label: '$iMonth',
        documentation: '**[optional]** Month value (default = current month)',
      },
      {
        label: '$iDay',
        documentation: '**[optional]** Day value (default = current day)',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
