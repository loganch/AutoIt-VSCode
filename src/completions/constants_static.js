import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const labelPicIcon = 'Label/Pic/Icon Constant';
const controlDefault = 'Control Default Style Constant';
const message = 'Message Constant';

const items = [
  {
    label: '$SS_LEFT',
    documentation: '`= 0x0`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_CENTER',
    documentation: '`= 0x1`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_RIGHT',
    documentation: '`= 0x2`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_ICON',
    documentation: '`= 0x3`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_BLACKRECT',
    documentation: '`= 0x4`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_GRAYRECT',
    documentation: '`= 0x5`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_WHITERECT',
    documentation: '`= 0x6`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_BLACKFRAME',
    documentation: '`= 0x7`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_GRAYFRAME',
    documentation: '`= 0x8`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_WHITEFRAME',
    documentation: '`= 0x9`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_SIMPLE',
    documentation: '`= 0xB`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_LEFTNOWORDWRAP',
    documentation: '`= 0xC`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_BITMAP',
    documentation: '`= 0xE`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_ENHMETAFILE',
    documentation: '`= 0xF`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_ETCHEDHORZ',
    documentation: '`= 0x10`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_ETCHEDVERT',
    documentation: '`= 0x11`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_ETCHEDFRAME',
    documentation: '`= 0x12`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_REALSIZECONTROL',
    documentation: '`= 0x40`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_NOPREFIX',
    documentation: '`= 0x0080`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_NOTIFY',
    documentation: '`= 0x0100`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_CENTERIMAGE',
    documentation: '`= 0x0200`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_RIGHTJUST',
    documentation: '`= 0x0400`',
    detail: labelPicIcon,
  },
  {
    label: '$SS_SUNKEN',
    documentation: '`= 0x1000`',
    detail: labelPicIcon,
  },
  {
    label: '$GUI_SS_DEFAULT_LABEL',
    documentation: '`= 0`',
    detail: controlDefault,
  },
  {
    label: '$GUI_SS_DEFAULT_GRAPHIC',
    documentation: '`= 0`',
    detail: controlDefault,
  },
  {
    label: '$GUI_SS_DEFAULT_ICON',
    documentation: '`= $SS_NOTIFY`',
    detail: controlDefault,
  },
  {
    label: '$GUI_SS_DEFAULT_PIC',
    documentation: '`= $SS_NOTIFY`',
    detail: controlDefault,
  },
  {
    label: '$STM_SETICON',
    documentation: '`= 0x0170`',
    detail: message,
  },
  {
    label: '$STM_GETICON',
    documentation: '`= 0x0171`',
    detail: message,
  },
  {
    label: '$STM_SETIMAGE',
    documentation: '`= 0x0172`',
    detail: message,
  },
  {
    label: '$STM_GETIMAGE',
    documentation: '`= 0x0173`',
    detail: message,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'StaticConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
