import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <String.au3>`)';

const signatures = {
  _HexToString: {
    documentation: 'Convert a hex string to a string',
    label: '_HexToString ( $sHex )',
    params: [
      {
        label: '$sHex',
        documentation: 'A hexadecimal string',
      },
    ],
  },
  _StringBetween: {
    documentation: 'Find strings between two string delimiters',
    label:
      '_StringBetween ( $sString, $sStart, $sEnd [, $iMode = $STR_ENDISSTART [, $bCase = False]] )',
    params: [
      {
        label: '$sString',
        documentation: 'The string to search.',
      },
      {
        label: '$sStart',
        documentation:
          'The beginning of the string to find. Passing an empty string starts at the beginning',
      },
      {
        label: '$sEnd',
        documentation:
          'The end of the string to find. Passing an empty string searches from $sStart to end of string',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** Search mode when $sStart = $sEnd\n$STR_ENDISSTART (0) the $sEnd string at the end of a match starts the next possible match (default)\n$STR_ENDNOTSTART (1) a further instance of the $sStart starts the next match',
      },
      {
        label: '$bCase',
        documentation:
          '**[optional]** False (default setting) = case-insensitive. True = case-sensitive.',
      },
    ],
  },
  _StringExplode: {
    documentation:
      'Splits up a string into substrings depending on the given delimiters as PHP Explode v5',
    label: '_StringExplode ( $sString, $sDelimiter [, $iLimit = 0] )',
    params: [
      {
        label: '$sString',
        documentation: 'String to be split',
      },
      {
        label: '$sDelimiter',
        documentation:
          'Delimiter to split on (split is performed on entire string, not individual characters)',
      },
      {
        label: '$iLimit',
        documentation:
          '**[optional]** Maximum elements to be returned    =0 : (default) Split on every instance of the delimiter    >0 : Split until limit, last element will contain remaining portion of the string    ',
      },
    ],
  },
  _StringInsert: {
    documentation: 'Inserts a string within another string',
    label: '_StringInsert ( $sString, $sInsertString, $iPosition )',
    params: [
      {
        label: '$sString',
        documentation: 'Original string',
      },
      {
        label: '$sInsertString',
        documentation: 'String to be inserted',
      },
      {
        label: '$iPosition',
        documentation: 'Position to insert string (negatives values count from right hand side)',
      },
    ],
  },
  _StringProper: {
    documentation: 'Changes a string to proper case, same as the =Proper function in Excel',
    label: '_StringProper ( $sString )',
    params: [
      {
        label: '$sString',
        documentation: 'Input string',
      },
    ],
  },
  _StringRepeat: {
    documentation: 'Repeats a string a specified number of times',
    label: '_StringRepeat ( $sString, $iRepeatCount )',
    params: [
      {
        label: '$sString',
        documentation: 'String to repeat',
      },
      {
        label: '$iRepeatCount',
        documentation: 'Number of times to repeat the string',
      },
    ],
  },
  _StringTitleCase: {
    documentation: 'Changes a string to a title case string',
    label: '_StringTitleCase ( $sString )',
    params: [
      {
        label: '$sString',
        documentation: 'Input string',
      },
    ],
  },
  _StringToHex: {
    documentation: 'Convert a string to a hex string',
    label: '_StringToHex ( $sString )',
    params: [
      {
        label: '$sString',
        documentation: 'String to be converted.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
