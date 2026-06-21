import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const style = 'Style Constant';
const message = 'Message Constant';
const param = 'Param Constant';
const status = 'Status Constant';
const notification = 'Notification Constant';
const control = 'Control Default Style Constant';

const items = [
  {
    label: '$ES_LEFT',
    documentation: '`= 0`',
    detail: style,
  },
  {
    label: '$ES_CENTER',
    documentation: '`= 1`',
    detail: style,
  },
  {
    label: '$ES_RIGHT',
    documentation: '`= 2`',
    detail: style,
  },
  {
    label: '$ES_MULTILINE',
    documentation: '`= 4`',
    detail: style,
  },
  {
    label: '$ES_UPPERCASE',
    documentation: '`= 8`',
    detail: style,
  },
  {
    label: '$ES_LOWERCASE',
    documentation: '`= 16`',
    detail: style,
  },
  {
    label: '$ES_PASSWORD',
    documentation: '`= 32`',
    detail: style,
  },
  {
    label: '$ES_AUTOVSCROLL',
    documentation: '`= 64`',
    detail: style,
  },
  {
    label: '$ES_AUTOHSCROLL',
    documentation: '`= 128`',
    detail: style,
  },
  {
    label: '$ES_NOHIDESEL',
    documentation: '`= 256`',
    detail: style,
  },
  {
    label: '$ES_OEMCONVERT',
    documentation: '`= 1024`',
    detail: style,
  },
  {
    label: '$ES_READONLY',
    documentation: '`= 2048`',
    detail: style,
  },
  {
    label: '$ES_WANTRETURN',
    documentation: '`= 4096`',
    detail: style,
  },
  {
    label: '$ES_NUMBER',
    documentation: '`= 8192`',
    detail: style,
  },
  {
    label: '$EC_ERR',
    documentation: '`= -1`',
    detail: 'Error Checking Constant',
  },
  {
    label: '$ECM_FIRST',
    documentation: '`= 0X1500`',
    detail: message,
  },
  {
    label: '$EM_CANUNDO',
    documentation: '`= 0xC6`',
    detail: message,
  },
  {
    label: '$EM_CHARFROMPOS',
    documentation: '`= 0xD7`',
    detail: message,
  },
  {
    label: '$EM_EMPTYUNDOBUFFER',
    documentation: '`= 0xCD`',
    detail: message,
  },
  {
    label: '$EM_FMTLINES',
    documentation: '`= 0xC8`',
    detail: message,
  },
  {
    label: '$EM_GETCUEBANNER',
    documentation: '`= ($ECM_FIRST + 2)`',
    detail: message,
  },
  {
    label: '$EM_GETFIRSTVISIBLELINE',
    documentation: '`= 0xCE`',
    detail: message,
  },
  {
    label: '$EM_GETHANDLE',
    documentation: '`= 0xBD`',
    detail: message,
  },
  {
    label: '$EM_GETIMESTATUS',
    documentation: '`= 0xD9`',
    detail: message,
  },
  {
    label: '$EM_GETLIMITTEXT',
    documentation: '`= 0xD5`',
    detail: message,
  },
  {
    label: '$EM_GETLINE',
    documentation: '`= 0xC4`',
    detail: message,
  },
  {
    label: '$EM_GETLINECOUNT',
    documentation: '`= 0xBA`',
    detail: message,
  },
  {
    label: '$EM_GETMARGINS',
    documentation: '`= 0xD4`',
    detail: message,
  },
  {
    label: '$EM_GETMODIFY',
    documentation: '`= 0xB8`',
    detail: message,
  },
  {
    label: '$EM_GETPASSWORDCHAR',
    documentation: '`= 0xD2`',
    detail: message,
  },
  {
    label: '$EM_GETRECT',
    documentation: '`= 0xB2`',
    detail: message,
  },
  {
    label: '$EM_GETSEL',
    documentation: '`= 0xB0`',
    detail: message,
  },
  {
    label: '$EM_GETTHUMB',
    documentation: '`= 0xBE`',
    detail: message,
  },
  {
    label: '$EM_GETWORDBREAKPROC',
    documentation: '`= 0xD1`',
    detail: message,
  },
  {
    label: '$EM_HIDEBALLOONTIP',
    documentation: '`= ($ECM_FIRST + 4)`',
    detail: message,
  },
  {
    label: '$EM_LIMITTEXT',
    documentation: '`= 0xC5`',
    detail: message,
  },
  {
    label: '$EM_LINEFROMCHAR',
    documentation: '`= 0xC9`',
    detail: message,
  },
  {
    label: '$EM_LINEINDEX',
    documentation: '`= 0xBB`',
    detail: message,
  },
  {
    label: '$EM_LINELENGTH',
    documentation: '`= 0xC1`',
    detail: message,
  },
  {
    label: '$EM_LINESCROLL',
    documentation: '`= 0xB6`',
    detail: message,
  },
  {
    label: '$EM_POSFROMCHAR',
    documentation: '`= 0xD6`',
    detail: message,
  },
  {
    label: '$EM_REPLACESEL',
    documentation: '`= 0xC2`',
    detail: message,
  },
  {
    label: '$EM_SCROLL',
    documentation: '`= 0xB5`',
    detail: message,
  },
  {
    label: '$EM_SCROLLCARET',
    documentation: '`= 0x00B7`',
    detail: message,
  },
  {
    label: '$EM_SETCUEBANNER',
    documentation: '`= ($ECM_FIRST + 1)`',
    detail: message,
  },
  {
    label: '$EM_SETHANDLE',
    documentation: '`= 0xBC`',
    detail: message,
  },
  {
    label: '$EM_SETIMESTATUS',
    documentation: '`= 0xD8`',
    detail: message,
  },
  {
    label: '$EM_SETLIMITTEXT',
    documentation: '`= $EM_LIMITTEXT`',
    detail: message,
  },
  {
    label: '$EM_SETMARGINS',
    documentation: '`= 0xD3`',
    detail: message,
  },
  {
    label: '$EM_SETMODIFY',
    documentation: '`= 0xB9`',
    detail: message,
  },
  {
    label: '$EM_SETPASSWORDCHAR',
    documentation: '`= 0xCC`',
    detail: message,
  },
  {
    label: '$EM_SETREADONLY',
    documentation: '`= 0xCF`',
    detail: message,
  },
  {
    label: '$EM_SETRECT',
    documentation: '`= 0xB3`',
    detail: message,
  },
  {
    label: '$EM_SETRECTNP',
    documentation: '`= 0xB4`',
    detail: message,
  },
  {
    label: '$EM_SETSEL',
    documentation: '`= 0xB1`',
    detail: message,
  },
  {
    label: '$EM_SETTABSTOPS',
    documentation: '`= 0xCB`',
    detail: message,
  },
  {
    label: '$EM_SETWORDBREAKPROC',
    documentation: '`= 0xD0`',
    detail: message,
  },
  {
    label: '$EM_SHOWBALLOONTIP',
    documentation: '`= ($ECM_FIRST + 3)`',
    detail: message,
  },
  {
    label: '$EM_UNDO',
    documentation: '`= 0xC7`',
    detail: message,
  },
  {
    label: '$EC_LEFTMARGIN',
    documentation: '`= 0x1`',
    detail: param,
  },
  {
    label: '$EC_RIGHTMARGIN',
    documentation: '`= 0x2`',
    detail: param,
  },
  {
    label: '$EC_USEFONTINFO',
    documentation: '`= 0xFFFF`',
    detail: param,
  },
  {
    label: '$EMSIS_COMPOSITIONSTRING',
    documentation: '`= 0x1`',
    detail: param,
  },
  {
    label: '$EIMES_GETCOMPSTRATONCE',
    documentation:
      'If this flag is set, the edit control hooks the WM_IME_COMPOSITION message with fFlags set to GCS_RESULTSTR and returns the result string immediately\n\n`= 0x1 `',
    detail: status,
  },
  {
    label: '$EIMES_CANCELCOMPSTRINFOCUS',
    documentation:
      'If this flag is set, the edit control cancels the composition string when it receives the WM_SETFOCUS message.\n\n`= 0x2 `',
    detail: status,
  },
  {
    label: '$EIMES_COMPLETECOMPSTRKILLFOCUS',
    documentation:
      'If this flag is set, the edit control completes the composition string upon receiving the WM_KILLFOCUS message.\n\n`= 0x4`',
    detail: status,
  },
  {
    label: '$EN_ALIGN_LTR_EC',
    documentation: '`= 0x700`',
    detail: notification,
  },
  {
    label: '$EN_ALIGN_RTL_EC',
    documentation: '`= 0x701`',
    detail: notification,
  },
  {
    label: '$EN_CHANGE',
    documentation: '`= 0x300`',
    detail: notification,
  },
  {
    label: '$EN_ERRSPACE',
    documentation: '`= 0x500`',
    detail: notification,
  },
  {
    label: '$EN_HSCROLL',
    documentation: '`= 0X601`',
    detail: notification,
  },
  {
    label: '$EN_KILLFOCUS',
    documentation: '`= 0x200`',
    detail: notification,
  },
  {
    label: '$EN_MAXTEXT',
    documentation: '`= 0x501`',
    detail: notification,
  },
  {
    label: '$EN_SETFOCUS',
    documentation: '`= 0x100`',
    detail: notification,
  },
  {
    label: '$EN_UPDATE',
    documentation: '`= 0x400`',
    detail: notification,
  },
  {
    label: '$EN_VSCROLL',
    documentation: '`= 0x602`',
    detail: notification,
  },
  {
    label: '$GUI_SS_DEFAULT_EDIT',
    documentation: '`= 0x003010c0 `',
    detail: control,
  },
  {
    label: '$GUI_SS_DEFAULT_INPUT',
    documentation: '`= 0x00000080`',
    detail: control,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'EditConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
