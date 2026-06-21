import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const type = 'Frame Type Constant';
const initial = 'Initial Frame State Constant';
const setState = 'Set State Constant';

const items = [
  {
    label: '$DFC_BUTTON',
    documentation: '`= 4`',
    detail: type,
  },
  {
    label: '$DFC_CAPTION',
    documentation: '`= 1`',
    detail: type,
  },
  {
    label: '$DFC_MENU',
    documentation: '`= 2`',
    detail: type,
  },
  {
    label: '$DFC_POPUPMENU',
    documentation: '`= 5`',
    detail: type,
  },
  {
    label: '$DFC_SCROLL',
    documentation: '`= 3`',
    detail: type,
  },
  {
    label: '$DFCS_BUTTON3STATE',
    documentation: '`= 0x8`',
    detail: initial,
  },
  {
    label: '$DFCS_BUTTONCHECK',
    documentation: '`= 0x0`',
    detail: initial,
  },
  {
    label: '$DFCS_BUTTONPUSH',
    documentation: '`= 0x10`',
    detail: initial,
  },
  {
    label: '$DFCS_BUTTONRADIO',
    documentation: '`= 0x4`',
    detail: initial,
  },
  {
    label: '$DFCS_BUTTONRADIOIMAGE',
    documentation: '`= 0x1`',
    detail: initial,
  },
  {
    label: '$DFCS_BUTTONRADIOMASK',
    documentation: '`= 0x2`',
    detail: initial,
  },
  {
    label: '$DFCS_CAPTIONCLOSE',
    documentation: '`= 0x0`',
    detail: initial,
  },
  {
    label: '$DFCS_CAPTIONHELP',
    documentation: '`= 0x4`',
    detail: initial,
  },
  {
    label: '$DFCS_CAPTIONMAX',
    documentation: '`= 0x2`',
    detail: initial,
  },
  {
    label: '$DFCS_CAPTIONMIN',
    documentation: '`= 0x1`',
    detail: initial,
  },
  {
    label: '$DFCS_CAPTIONRESTORE',
    documentation: '`= 0x3`',
    detail: initial,
  },
  {
    label: '$DFCS_MENUARROW',
    documentation: '`= 0x0`',
    detail: initial,
  },
  {
    label: '$DFCS_MENUARROWRIGHT',
    documentation: '`= 0x4`',
    detail: initial,
  },
  {
    label: '$DFCS_MENUBULLET',
    documentation: '`= 0x2`',
    detail: initial,
  },
  {
    label: '$DFCS_MENUCHECK',
    documentation: '`= 0x1`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLCOMBOBOX',
    documentation: '`= 0x5`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLDOWN',
    documentation: '`= 0x1`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLLEFT',
    documentation: '`= 0x2`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLRIGHT',
    documentation: '`= 0x3`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLSIZEGRIP',
    documentation: '`= 0x8`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLSIZEGRIPRIGHT',
    documentation: '`= 0x10`',
    detail: initial,
  },
  {
    label: '$DFCS_SCROLLUP',
    documentation: '`= 0x0`',
    detail: initial,
  },
  {
    label: '$DFCS_ADJUSTRECT',
    documentation: '`= 0x2000`',
    detail: initial,
  },
  {
    label: '$DFCS_CHECKED',
    documentation: '`= 0x400`',
    detail: setState,
  },
  {
    label: '$DFCS_FLAT',
    documentation: '`= 0x4000`',
    detail: setState,
  },
  {
    label: '$DFCS_HOT',
    documentation: '`= 0x1000`',
    detail: setState,
  },
  {
    label: '$DFCS_INACTIVE',
    documentation: '`= 0x100`',
    detail: setState,
  },
  {
    label: '$DFCS_PUSHED',
    documentation: '`= 0x200`',
    detail: setState,
  },
  {
    label: '$DFCS_TRANSPARENT',
    documentation: '`= 0x800`',
    detail: setState,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'FrameConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
