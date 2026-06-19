import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const styles = 'Style Constant';
const uFlag = 'uFlag Constant';
const message = 'Message Constant';
const notify = 'Notification Constant';

const items = [
  {
    label: '$SBARS_SIZEGRIP',
    documentation: '`= 0x100`',
    detail: styles,
  },
  {
    label: '$SBT_TOOLTIPS',
    documentation: '`= 0x800`',
    detail: styles,
  },
  {
    label: '$SBARS_TOOLTIPS',
    documentation: '`= 0x800`',
    detail: styles,
  },
  {
    label: '$SBT_SUNKEN',
    documentation: 'Default\n\n`= 0x0`',
    detail: uFlag,
  },
  {
    label: '$SBT_NOBORDERS',
    documentation: 'The text is drawn without borders.\n\n`= 0x100`',
    detail: uFlag,
  },
  {
    label: '$SBT_POPOUT',
    documentation:
      ' The text is drawn with a border to appear higher than the plane of the window.\n\n`= 0x200`',
    detail: uFlag,
  },
  {
    label: '$SBT_RTLREADING',
    documentation:
      '`SB_SETTEXT`, `SB_SETTEXT`, `SB_GETTEXTLENGTH` flags only: Displays text using right-to-left reading order on Hebrew or Arabic systems.\n\n`= 0x400`',
    detail: uFlag,
  },
  {
    label: '$SBT_NOTABPARSING',
    documentation: 'Tab characters are ignored.\n\n`= 0x800`',
    detail: uFlag,
  },
  {
    label: '$SBT_OWNERDRAW',
    documentation: 'The text is drawn by the parent window.\n\n`= 0x1000`',
    detail: uFlag,
  },
  {
    label: '$__STATUSBARCONSTANT_WM_USER',
    documentation: '`= 0X400`',
    detail: message,
  },
  {
    label: '$SB_GETBORDERS',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 7)`',
    detail: message,
  },
  {
    label: '$SB_GETICON',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 20)`',
    detail: message,
  },
  {
    label: '$SB_GETPARTS',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 6)`',
    detail: message,
  },
  {
    label: '$SB_GETRECT',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 10)`',
    detail: message,
  },
  {
    label: '$SB_GETTEXTA',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 2)`',
    detail: message,
  },
  {
    label: '$SB_GETTEXTW',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 13)`',
    detail: message,
  },
  {
    label: '$SB_GETTEXT',
    documentation: '`= $SB_GETTEXTA`',
    detail: message,
  },
  {
    label: '$SB_GETTEXTLENGTHA',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 3)`',
    detail: message,
  },
  {
    label: '$SB_GETTEXTLENGTHW',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 12)`',
    detail: message,
  },
  {
    label: '$SB_GETTEXTLENGTH',
    documentation: '`= $SB_GETTEXTLENGTHA`',
    detail: message,
  },
  {
    label: '$SB_GETTIPTEXTA',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 18)`',
    detail: message,
  },
  {
    label: '$SB_GETTIPTEXTW',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 19)`',
    detail: message,
  },
  {
    label: '$SB_GETUNICODEFORMAT',
    documentation: '`= 0x2000 + 6`',
    detail: message,
  },
  {
    label: '$SB_ISSIMPLE',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 14)`',
    detail: message,
  },

  {
    label: '$SB_SETBKCOLOR',
    documentation: '`= 0x2000 + 1`',
    detail: message,
  },
  {
    label: '$SB_SETICON',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 15)`',
    detail: message,
  },
  {
    label: '$SB_SETMINHEIGHT',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 8)`',
    detail: message,
  },
  {
    label: '$SB_SETPARTS',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 4)`',
    detail: message,
  },
  {
    label: '$SB_SETTEXTA',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 1)`',
    detail: message,
  },
  {
    label: '$SB_SETTEXTW',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 11)`',
    detail: message,
  },
  {
    label: '$SB_SETTEXT',
    documentation: '`= $SB_SETTEXTA`',
    detail: message,
  },
  {
    label: '$SB_SETTIPTEXTA',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 16)`',
    detail: message,
  },
  {
    label: '$SB_SETTIPTEXTW',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 17)`',
    detail: message,
  },
  {
    label: '$SB_SETUNICODEFORMAT',
    documentation: '`= 0x2000 + 5`',
    detail: message,
  },
  {
    label: '$SB_SIMPLE',
    documentation: '`= ($__STATUSBARCONSTANT_WM_USER + 9)`',
    detail: message,
  },
  {
    label: '$SB_SIMPLEID',
    documentation: '`= 0xff`',
    detail: message,
  },
  {
    label: '$SBN_FIRST',
    documentation: '`= -880`',
    detail: notify,
  },
  {
    label: '$SBN_SIMPLEMODECHANGE',
    documentation:
      'Sent when the simple mode changes due to a `$SB_SIMPLE` message\n\n`= $SBN_FIRST - 0`',
    detail: notify,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'StatusBarConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
