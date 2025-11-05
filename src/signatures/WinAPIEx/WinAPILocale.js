import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover, br, opt } from '../../util';

const include = '(Requires: `#include <WinAPILocale.au3>`)';

const iLCID_PARAM = {
  label: '$iLCID',
  documentation: `The locale identifier (LCID) that specifies the locale or one of the following predefined values:${br}
          \`$LOCALE_INVARIANT\`${br}
          \`$LOCALE_SYSTEM_DEFAULT\`${br}
          \`$LOCALE_USER_DEFAULT\`${br}
          **Windows Vista or later:**${br}
          \`$LOCALE_CUSTOM_DEFAULT\`${br}
          \`$LOCALE_CUSTOM_UI_DEFAULT\`${br}
          \`$LOCALE_CUSTOM_UNSPECIFIED\``,
};

const signatures = {
  _WinAPI_CompareString: {
    documentation: 'Compares two character strings for a specified locale',
    label: '_WinAPI_CompareString ( $iLCID, $sString1, $sString2 [, $iFlags = 0] )',
    params: [
      iLCID_PARAM,
      {
        label: '$sString1',
        documentation: 'The first string to compare.',
      },
      {
        label: '$sString2',
        documentation: 'The second string to compare.',
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that indicate how the function compares the two strings. This parameter can be 0 or combination of the following values:${br}
          \`$LINGUISTIC_IGNORECASE\`${br}
          \`$LINGUISTIC_IGNOREDIACRITIC\`${br}
          \`$NORM_IGNORECASE\`${br}
          \`$NORM_IGNOREKANATYPE\`${br}
          \`$NORM_IGNORENONSPACE\`${br}
          \`$NORM_IGNORESYMBOLS\`${br}
          \`$NORM_IGNOREWIDTH\`${br}
          \`$NORM_LINGUISTIC_CASING\`${br}
          \`$SORT_STRINGSORT\`${br}
          **Windows 7 or later:**${br}
          \`$SORT_DIGITSASNUMBERS\``,
      },
    ],
  },
  _WinAPI_CreateNumberFormatInfo: {
    documentation:
      'Creates a `$tagNUMBERFMT` structure with the specified number formatting information',
    label:
      '_WinAPI_CreateNumberFormatInfo ( $iNumDigits, $iLeadingZero, $iGrouping, $sDecimalSep, $sThousandSep, $iNegativeOrder )',
    params: [
      {
        label: '$iNumDigits',
        documentation: 'The number of fractional digits placed after the decimal separator.',
      },
      {
        label: '$iLeadingZero',
        documentation: `Specifier for leading zeros in decimal fields, valid values:${br}
          0 - No leading zeros.${br}
          1 - Leading zeros.`,
      },
      {
        label: '$iGrouping',
        documentation: `The number of digits in each group of numbers to the left of the decimal separator.${br}
          The values in the range 0 through 9 and 32 are valid.${br}
          Typical examples are:${br}
          0 to group digits as in 123456789.00;${br}
          3 to group digits as in 123,456,789.00;${br}
          and 32 to group digits as in 12,34,56,789.00.`,
      },
      {
        label: '$sDecimalSep',
        documentation: 'The decimal separator string.',
      },
      {
        label: '$sThousandSep',
        documentation: 'The thousand separator string.',
      },
      {
        label: '$iNegativeOrder',
        documentation: `The negative number mode, valid values:${br}
          0 - Left parenthesis, number, right parenthesis; for example, (1.1).${br}
          1 - Negative sign, number; for example, -1.1.${br}
          2 - Negative sign, space, number; for example, - 1.1.${br}
          3 - Number, negative sign; for example, 1.1-.${br}
          4 - Number, space, negative sign; for example, 1.1 -.`,
      },
    ],
  },
  _WinAPI_EnumSystemGeoID: {
    documentation:
      'Enumerates the geographical location identifiers (GEOID) that are available on the operating system',
    label: '_WinAPI_EnumSystemGeoID ( )',
    params: [],
  },
  _WinAPI_EnumSystemLocales: {
    documentation:
      'Enumerates the locales that are either installed on or supported by an operating system',
    label: '_WinAPI_EnumSystemLocales ( $iFlag )',
    params: [
      {
        label: '$iFlag',
        documentation: `The flag specifying the locale identifiers to enumerate.${br}
          This parameter can have one of the following values:${br}
          \`$LCID_INSTALLED\`${br}
          \`$LCID_SUPPORTED\``,
      },
    ],
  },
  _WinAPI_EnumUILanguages: {
    documentation:
      'Enumerates the user interface languages that are available on the operating system',
    label: '_WinAPI_EnumUILanguages ( [$iFlag = 0] )',
    params: [
      {
        label: '$iFlag',
        documentation: `${opt} The flag identifying the language format. This parameter must be 0 or one of the following values${br}
          **Windows Vista or later:**${br}
          \`$MUI_LANGUAGE_ID\`${br}
          \`$MUI_LANGUAGE_NAME\``,
      },
    ],
  },
  _WinAPI_GetDateFormat: {
    documentation:
      'Formats a date as a date string for a locale specified by the locale identifier',
    label:
      "_WinAPI_GetDateFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = '']]]] )",
    params: [
      iLCID_PARAM,
      {
        label: '$tSYSTEMTIME',
        documentation:
          '**[optional]** Default is 0. `$tagSYSTEMTIME` structure that contains the date information to format.\n\nIf this parameter is 0 (Default), the function will use the current local system date.',
      },
      {
        label: '$iFlags',
        documentation: `${opt} The flags that specifies the date format options.${br}
          This parameter can be one or more of the following values:${br}
          \`$DATE_LONGDATE\`${br}
          \`$DATE_SHORTDATE\` (Default)${br}
          \`$DATE_USE_ALT_CALENDAR\`${br}
          **Windows Vista or later:**${br}
          \`$DATE_LTRREADING\`${br}
          \`$DATE_RTLREADING\`${br}
          \`$DATE_YEARMONTH\`${br}
          **Windows 7 or later**${br}
          \`$DATE_AUTOLAYOUT\``,
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the date. For example, "dddd MMMM, yyyy".\n\nIf this parameter is omitted or an empty string (Default), the function returns the string according to the date format for the specified locale.',
      },
    ],
  },
  _WinAPI_GetDurationFormat: {
    documentation:
      'Formats a duration of time as a time string for a locale specified by identifier',
    label: "_WinAPI_GetDurationFormat ( $iLCID, $iDuration [, $sFormat = ''] )",
    params: [
      iLCID_PARAM,
      {
        label: '$iDuration',
        documentation:
          'The number of 100-nanosecond intervals in the duration.\n\nAlternatively, this parameter can be a `$tagSYSTEMTIME` structure that contains the time duration information to format.',
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the duration. For example, "hh:mm:ss.ff".\n\nIf this parameter is omitted or an empty string (Default), the function returns the string according to the duration format for the specified locale.',
      },
    ],
  },
  _WinAPI_GetGeoInfo: {
    documentation: 'Retrieves information about a specified geographical location',
    label: '_WinAPI_GetGeoInfo ( $iGEOID, $iType [, $iLanguage = 0] )',
    params: [
      {
        label: '$iGEOID',
        documentation:
          'The identifier for the geographical location (GEOID) for which to get information.',
      },
      {
        label: '$iType',
        documentation: `The type of information to retrieve. It can be one of the following values.${br}
          \`$GEO_NATION\`${br}
          \`$GEO_LATITUDE\`${br}
          \`$GEO_LONGITUDE\`${br}
          \`$GEO_ISO2\`${br}
          \`$GEO_ISO3\`${br}
          \`$GEO_LCID\`${br}
          \`$GEO_FRIENDLYNAME\`${br}
          \`$GEO_OFFICIALNAME\`${br}
          \`$GEO_TIMEZONES\`${br}
          \`$GEO_OFFICIALLANGUAGES\`${br}
          **Windows Vista or later:**${br}
          \`$GEO_RFC1766\`${br}
          **Windows 8 or later:**${br}
          \`$GEO_ISO_UN_NUMBER\`${br}
          \`$GEO_PARENT\``,
      },
      {
        label: '$iLanguage',
        documentation:
          '**[optional]** The language identifier, used with the geographical location.',
      },
    ],
  },
  _WinAPI_GetLocaleInfo: {
    documentation: 'Retrieves information about a locale specified by identifier',
    label: '_WinAPI_GetLocaleInfo ( $iLCID, $iType )',
    params: [
      iLCID_PARAM,
      {
        label: '$iType',
        documentation: 'The one of the locale information constants (`$LOCALE_*`) to retrieve.',
      },
    ],
  },
  _WinAPI_GetNumberFormat: {
    documentation:
      'Formats a number string as a number string customized for a locale specified by identifier',
    label: '_WinAPI_GetNumberFormat ( $iLCID, $sNumber [, $tNUMBERFMT = 0] )',
    params: [
      iLCID_PARAM,
      {
        label: '$sNumber',
        documentation:
          'The string containing the number string to format. This string can only contain the following characters. All other characters are invalid.\n\nCharacters "0" through "9".\n\nA minus sign in the first character position if the number is a negative value.\n\nOne decimal point (dot) if the number is a floating-point value.',
      },
      {
        label: '$tNUMBERFMT',
        documentation:
          '**[optional]** Default is 0. `$tagNUMBERFMT` structure that contains number formatting information. If this parameter is 0 (Default), the function returns the string according to the number format for the specified locale.\n\nYou can use the `_WinAPI_CreateNumberFormatInfo()` function to create this structure.',
      },
    ],
  },
  _WinAPI_GetSystemDefaultLangID: {
    documentation: 'Returns the language identifier for the system locale',
    label: '_WinAPI_GetSystemDefaultLangID ( )',
    params: [],
  },
  _WinAPI_GetSystemDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the system locale',
    label: '_WinAPI_GetSystemDefaultLCID ( )',
    params: [],
  },
  _WinAPI_GetSystemDefaultUILanguage: {
    documentation:
      'Retrieves the language identifier for the system default UI language of the operating system',
    label: '_WinAPI_GetSystemDefaultUILanguage ( )',
    params: [],
  },
  _WinAPI_GetThreadLocale: {
    documentation: 'Retrieves the locale identifier of the current locale for the calling thread',
    label: '_WinAPI_GetThreadLocale ( )',
    params: [],
  },
  _WinAPI_GetThreadUILanguage: {
    documentation:
      'Retrieves the language identifier of the first user interface language for the current thread',
    label: '_WinAPI_GetThreadUILanguage ( )',
    params: [],
  },
  _WinAPI_GetTimeFormat: {
    documentation: 'Formats time as a time string for a locale specified by identifier',
    label:
      "_WinAPI_GetTimeFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = '']]]] )",
    params: [
      iLCID_PARAM,
      {
        label: '$tSYSTEMTIME',
        documentation:
          '**[optional]** Default is 0. `$tagSYSTEMTIME` structure that contains the time information to format. If this parameter is 0 (Default), the function will use the current local system time.',
      },
      {
        label: '$iFlags',
        documentation: `**[optional]** The flags that specifies the time format options.${br}
          This parameter can be one or more of the following values.${br}
          \`$TIME_FORCE24HOURFORMAT\`${br}
          \`$TIME_NOMINUTESORSECONDS\`${br}
          \`$TIME_NOSECONDS\`${br}
          \`$TIME_NOTIMEMARKER\``,
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the time. For example, "hh:mm:ss tt". If this parameter is omitted or an empty string (Default), the function returns the string according to the time format for the specified locale.',
      },
    ],
  },
  _WinAPI_GetUserDefaultLangID: {
    documentation: 'Returns the language identifier for the current user locale',
    label: '_WinAPI_GetUserDefaultLangID ( )',
    params: [],
  },
  _WinAPI_GetUserDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the user default locale',
    label: '_WinAPI_GetUserDefaultLCID ( )',
    params: [],
  },
  _WinAPI_GetUserDefaultUILanguage: {
    documentation: 'Returns the language identifier for the user UI language for the current user',
    label: '_WinAPI_GetUserDefaultUILanguage ( )',
    params: [],
  },
  _WinAPI_GetUserGeoID: {
    documentation: 'Retrieves information about the geographical location of the user',
    label: '_WinAPI_GetUserGeoID ( )',
    params: [],
  },
  _WinAPI_IsValidLocale: {
    documentation:
      'Determines if the specified locale is installed or supported on the operating system',
    label: '_WinAPI_IsValidLocale ( $iLCID [, $iFlag = 0] )',
    params: [
      iLCID_PARAM,
      {
        label: '$iFlag',
        documentation: `**[optional]** Default is 0. Flag specifying the validity test to apply to the locale identifier.${br}
          This parameter can have one of the following values.${br}
          \`$LCID_INSTALLED\`${br}
          \`$LCID_SUPPORTED\``,
      },
    ],
  },
  _WinAPI_SetLocaleInfo: {
    documentation: 'Sets an item of information in the user override portion of the current locale',
    label: '_WinAPI_SetLocaleInfo ( $iLCID, $iType, $sData )',
    params: [
      iLCID_PARAM,
      {
        label: '$iType',
        documentation:
          'Type of locale information to set. This parameter can be one of the locale information constants (`$LOCALE_*`).',
      },
      {
        label: '$sData',
        documentation:
          'The string containing the locale information to set. The information must be in the format specific to the specified constant.',
      },
    ],
  },
  _WinAPI_SetThreadLocale: {
    documentation: 'Sets the current locale of the calling thread',
    label: '_WinAPI_SetThreadLocale ( $iLCID )',
    params: [iLCID_PARAM],
  },
  _WinAPI_SetThreadUILanguage: {
    documentation: 'Sets the user interface language for the current thread',
    label: '_WinAPI_SetThreadUILanguage ( $iLanguage )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'The language identifier for the user interface language.',
      },
    ],
  },
  _WinAPI_SetUserGeoID: {
    documentation: 'Sets the geographical location identifier for the user',
    label: '_WinAPI_SetUserGeoID ( $iGEOID )',
    params: [
      {
        label: '$iGEOID',
        documentation: 'The identifier for the geographical location of the user (GEOID).',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
