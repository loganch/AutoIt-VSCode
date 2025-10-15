import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPILocale.au3>`)';

const signatures = {
  _WinAPI_CompareString: {
    documentation: 'Compares two character strings for a specified locale',
    label: '_WinAPI_CompareString ( $iLCID, $sString1, $sString2 [, $iFlags = 0] )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      },
      {
        label: '$sString1',
        documentation: 'Parameter description',
      },
      {
        label: '$sString2 [, $iFlags',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateNumberFormatInfo: {
    documentation: 'Creates a $tagNUMBERFMT structure with the specified number formatting information',
    label: '_WinAPI_CreateNumberFormatInfo ( $iNumDigits, $iLeadingZero, $iGrouping, $sDecimalSep, $sThousandSep, $iNegativeOrder )',
    params: [
      {
        label: '$iNumDigits',
        documentation: 'Parameter description',
      },
      {
        label: '$iLeadingZero',
        documentation: 'Parameter description',
      },
      {
        label: '$iGrouping',
        documentation: 'Parameter description',
      },
      {
        label: '$sDecimalSep',
        documentation: 'Parameter description',
      },
      {
        label: '$sThousandSep',
        documentation: 'Parameter description',
      },
      {
        label: '$iNegativeOrder',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumSystemGeoID: {
    documentation: 'Enumerates the geographical location identifiers (GEOID) that are available on the operating system',
    label: '_WinAPI_EnumSystemGeoID ( )',
    params: [

    ],
  },
  _WinAPI_EnumSystemLocales: {
    documentation: 'Enumerates the locales that are either installed on or supported by an operating system',
    label: '_WinAPI_EnumSystemLocales ( $iFlag )',
    params: [
      {
        label: '$iFlag',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EnumUILanguages: {
    documentation: 'Enumerates the user interface languages that are available on the operating system',
    label: '_WinAPI_EnumUILanguages ( [$iFlag = 0] )',
    params: [
      {
        label: '$iFlag',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetDateFormat: {
    documentation: 'Formats a date as a date string for a locale specified by the locale identifier',
    label: '_WinAPI_GetDateFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = \'\']]]] )',
    params: [
      {
        label: '$iLCID',
        documentation: '**[optional]** Default is 0 [, $tSYSTEMTIME.',
      }
    ],
  },
  _WinAPI_GetDurationFormat: {
    documentation: 'Formats a duration of time as a time string for a locale specified by identifier',
    label: '_WinAPI_GetDurationFormat ( $iLCID, $iDuration [, $sFormat = \'\'] )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      },
      {
        label: '$iDuration [, $sFormat',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetGeoInfo: {
    documentation: 'Retrieves information about a specified geographical location',
    label: '_WinAPI_GetGeoInfo ( $iGEOID, $iType [, $iLanguage = 0] )',
    params: [
      {
        label: '$iGEOID',
        documentation: 'Parameter description',
      },
      {
        label: '$iType [, $iLanguage',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetLocaleInfo: {
    documentation: 'Retrieves information about a locale specified by identifier',
    label: '_WinAPI_GetLocaleInfo ( $iLCID, $iType )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      },
      {
        label: '$iType',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetNumberFormat: {
    documentation: 'Formats a number string as a number string customized for a locale specified by identifier',
    label: '_WinAPI_GetNumberFormat ( $iLCID, $sNumber [, $tNUMBERFMT = 0] )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      },
      {
        label: '$sNumber [, $tNUMBERFMT',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetSystemDefaultLangID: {
    documentation: 'Returns the language identifier for the system locale',
    label: '_WinAPI_GetSystemDefaultLangID ( )',
    params: [

    ],
  },
  _WinAPI_GetSystemDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the system locale',
    label: '_WinAPI_GetSystemDefaultLCID ( )',
    params: [

    ],
  },
  _WinAPI_GetSystemDefaultUILanguage: {
    documentation: 'Retrieves the language identifier for the system default UI language of the operating system',
    label: '_WinAPI_GetSystemDefaultUILanguage ( )',
    params: [

    ],
  },
  _WinAPI_GetThreadLocale: {
    documentation: 'Retrieves the locale identifier of the current locale for the calling thread',
    label: '_WinAPI_GetThreadLocale ( )',
    params: [

    ],
  },
  _WinAPI_GetThreadUILanguage: {
    documentation: 'Retrieves the language identifier of the first user interface language for the current thread',
    label: '_WinAPI_GetThreadUILanguage ( )',
    params: [

    ],
  },
  _WinAPI_GetTimeFormat: {
    documentation: 'Formats time as a time string for a locale specified by identifier',
    label: '_WinAPI_GetTimeFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = \'\']]]] )',
    params: [
      {
        label: '$iLCID',
        documentation: '**[optional]** Default is 0 [, $tSYSTEMTIME.',
      }
    ],
  },
  _WinAPI_GetUserDefaultLangID: {
    documentation: 'Returns the language identifier for the current user locale',
    label: '_WinAPI_GetUserDefaultLangID ( )',
    params: [

    ],
  },
  _WinAPI_GetUserDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the user default locale',
    label: '_WinAPI_GetUserDefaultLCID ( )',
    params: [

    ],
  },
  _WinAPI_GetUserDefaultUILanguage: {
    documentation: 'Returns the language identifier for the user UI language for the current user',
    label: '_WinAPI_GetUserDefaultUILanguage ( )',
    params: [

    ],
  },
  _WinAPI_GetUserGeoID: {
    documentation: 'Retrieves information about the geographical location of the user',
    label: '_WinAPI_GetUserGeoID ( )',
    params: [

    ],
  },
  _WinAPI_IsValidLocale: {
    documentation: 'Determines if the specified locale is installed or supported on the operating system',
    label: '_WinAPI_IsValidLocale ( $iLCID [, $iFlag = 0] )',
    params: [
      {
        label: '$iLCID [, $iFlag',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetLocaleInfo: {
    documentation: 'Sets an item of information in the user override portion of the current locale',
    label: '_WinAPI_SetLocaleInfo ( $iLCID, $iType, $sData )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      },
      {
        label: '$iType',
        documentation: 'Parameter description',
      },
      {
        label: '$sData',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetThreadLocale: {
    documentation: 'Sets the current locale of the calling thread',
    label: '_WinAPI_SetThreadLocale ( $iLCID )',
    params: [
      {
        label: '$iLCID',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetThreadUILanguage: {
    documentation: 'Sets the user interface language for the current thread',
    label: '_WinAPI_SetThreadUILanguage ( $iLanguage )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetUserGeoID: {
    documentation: 'Sets the geographical location identifier for the user',
    label: '_WinAPI_SetUserGeoID ( $iGEOID )',
    params: [
      {
        label: '$iGEOID',
        documentation: 'Parameter description',
      }
    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
