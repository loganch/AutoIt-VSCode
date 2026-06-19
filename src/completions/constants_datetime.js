import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$DTS_UPDOWN',
    documentation:
      'Places an up-down control to the right of a DTP control to modify time values. This style can be used instead of the drop-down month calendar, which is the default style. ',
    detail: 'Date Style Constant',
  },
  {
    label: '$DTS_SHOWNONE',
    documentation: 'Enables the control to accept "no date" as a valid selection state.',
    detail: 'Date Style Constant',
  },
  {
    label: '$DTS_LONGDATEFORMAT',
    documentation:
      'Displays the date in long format. The default format string for this style is defined by LOCALE_SLONGDATEFORMAT, which produces output like "Friday, April 19, 1998."',
    detail: 'Date Style Constant',
  },
  {
    label: '$DTS_TIMEFORMAT',
    documentation:
      'Displays the time. The default format string for this style is defined by LOCALE_STIMEFORMAT, which produces output like "5:31:42 PM."',
    detail: 'Date Style Constant',
  },
  {
    label: '$DTS_RIGHTALIGN',
    documentation:
      'The drop-down month calendar will be right-aligned with the control instead of left-aligned, which is the default.',
    detail: 'Date Style Constant',
  },
  {
    label: '$DTS_SHORTDATEFORMAT',
    documentation:
      'Displays the date in short format. The default format string for this style is defined by LOCALE_SSHORTDATE, which produces output like "4/19/96".',
    detail: 'Date Style Constant',
  },
  {
    label: '$MCS_NOTODAY',
    documentation:
      'The month calendar control will not display the "today" date at the bottom of the control.',
    detail: 'MonthCal Style Constant',
  },
  {
    label: '$MCS_NOTODAYCIRCLE',
    documentation: 'The month calendar control will not circle the "today" date.',
    detail: 'MonthCal Style Constant',
  },
  {
    label: '$MCS_WEEKNUMBERS',
    documentation:
      'The month calendar control will display week numbers (1-52) to the left of each row of days. Week 1 is defined as the first week that contains at least four days.',
    detail: 'MonthCal Style Constant',
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'DateTimeConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
