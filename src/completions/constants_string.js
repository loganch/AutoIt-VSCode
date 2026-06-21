import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const multi = 'StringCompare/StringInStr/StringReplace Constant';
const stringStripWS = 'StringStripWS Constant';
const stringSplit = 'StringSplit Constant';
const stringRegExp = 'StringRegExp Constant';
const stringBetween = '_StringBetween Constant';
const stringBinary = 'BinaryToString/StringToBinary Constant';
const stringASCII = 'StringFromASCIIArray Constant';
const stringReverse = 'StringReverse Constant';

const items = [
  {
    label: '$STR_NOCASESENSE',
    documentation: 'Not case sensitive (default)\n\n`= 0`',
    detail: multi,
  },
  {
    label: '$STR_CASESENSE',
    documentation: 'Case sensitive\n\n`= 1`',
    detail: multi,
  },
  {
    label: '$STR_NOCASESENSEBASIC',
    documentation: 'Not case sensitive, using a basic comparison\n\n`= 2`',
    detail: multi,
  },
  {
    label: '$STR_STRIPLEADING',
    documentation: 'Strip leading whitespace\n\n`= 1`',
    detail: stringStripWS,
  },
  {
    label: '$STR_STRIPTRAILING',
    documentation: 'Strip trailing whitespace\n\n`= 2`',
    detail: stringStripWS,
  },
  {
    label: '$STR_STRIPSPACES',
    documentation: 'Strip double (or more) spaces between words\n\n`= 4`',
    detail: stringStripWS,
  },
  {
    label: '$STR_STRIPALL',
    documentation: 'Strip all spaces (over-rides all other flags)\n\n`= 8`',
    detail: stringStripWS,
  },
  {
    label: '$STR_CHRSPLIT',
    documentation: 'Each character in the delimiter string will mark the split\n\n`= 0`',
    detail: stringSplit,
  },
  {
    label: '$STR_ENTIRESPLIT',
    documentation: 'Entire delimiter marks the split\n\n`= 1`',
    detail: stringSplit,
  },
  {
    label: '$STR_NOCOUNT',
    documentation: 'Disable the return count\n\n`= 2`',
    detail: stringSplit,
  },
  {
    label: '$STR_REGEXPMATCH',
    documentation: 'Return 1 if match.\n\n`= 0`',
    detail: stringRegExp,
  },
  {
    label: '$STR_REGEXPARRAYMATCH',
    documentation: 'Return array of matches.\n\n`= 1`',
    detail: stringRegExp,
  },
  {
    label: '$STR_REGEXPARRAYFULLMATCH',
    documentation: 'Return array of matches including the full match (Perl / PHP style).\n\n`= 2`',
    detail: stringRegExp,
  },
  {
    label: '$STR_REGEXPARRAYGLOBALMATCH',
    documentation: 'Return array of global matches.\n\n`= 3`',
    detail: stringRegExp,
  },
  {
    label: '$STR_REGEXPARRAYGLOBALFULLMATCH',
    documentation:
      'Return an array of arrays containing global matches including the full match (Perl / PHP style).\n\n`= 4`',
    detail: stringRegExp,
  },
  {
    label: '$STR_ENDISSTART',
    documentation: 'End acts as next start when end = start\n\n`= 0`',
    detail: stringBetween,
  },
  {
    label: '$STR_ENDNOTSTART',
    documentation: 'End does not act as new start when end = start\n\n`= 1`',
    detail: stringBetween,
  },
  {
    label: '$SB_ANSI',
    documentation: 'String data is ANSI (default)\n`= 1`',
    detail: stringBinary,
  },
  {
    label: '$SB_UTF16LE',
    documentation: 'String data is UTF16 Little Endian\n`= 2`',
    detail: stringBinary,
  },
  {
    label: '$SB_UTF16BE',
    documentation: 'String data is UTF16 Big Endian\n`= 3`',
    detail: stringBinary,
  },
  {
    label: '$SB_UTF8',
    documentation: 'String data is UTF8\n`= 4`',
    detail: stringBinary,
  },
  {
    label: '$SE_UTF16',
    documentation: '`= 0`',
    detail: stringASCII,
  },
  {
    label: '$SE_ANSI',
    documentation: '`= 1`',
    detail: stringASCII,
  },
  {
    label: '$SE_UTF8',
    documentation: '`= 2`',
    detail: stringASCII,
  },
  {
    label: '$STR_UTF16',
    documentation: 'Reversed in full UTF-16 mode. (default)\n\n`= 0`',
    detail: stringReverse,
  },
  {
    label: '$STR_UCS2',
    documentation: 'A much faster method - only use if using UCS-2 text.\n\n`= 1`',
    detail: stringReverse,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'StringConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
