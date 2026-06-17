import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const predefined = 'Tray predefined ID Constant';
const stateValue = 'Tray menu/item state value Constant';
const eventValue = 'Tray event value Constant';
const balloonTip = 'Balloon Tip Type Constant';
const trayCreateItem = 'TrayCreateItem value Constant';
const traySetCliCk = 'TraySetClick value Constant';
const traySetState = 'TraySetState value Constant';

const items = [
  {
    label: '$TRAY_ITEM_EXIT',
    documentation: '`= 3`',
    detail: predefined,
  },
  {
    label: '$TRAY_ITEM_PAUSE',
    documentation: '`= 4`',
    detail: predefined,
  },
  {
    label: '$TRAY_ITEM_FIRST',
    documentation: '`= 7`',
    detail: predefined,
  },
  {
    label: '$TRAY_CHECKED',
    documentation: '`= 1`',
    detail: stateValue,
  },
  {
    label: '$TRAY_UNCHECKED',
    documentation: '`= 4`',
    detail: stateValue,
  },
  {
    label: '$TRAY_ENABLE',
    documentation: '`= 64`',
    detail: stateValue,
  },
  {
    label: '$TRAY_DISABLE',
    documentation: '`= 128`',
    detail: stateValue,
  },
  {
    label: '$TRAY_FOCUS',
    documentation: '`= 256`',
    detail: stateValue,
  },
  {
    label: '$TRAY_DEFAULT',
    documentation: '`= 512`',
    detail: stateValue,
  },
  {
    label: '$TRAY_EVENT_NONE',
    documentation: '`= 0`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_SHOWICON',
    documentation: '`= -3`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_HIDEICON',
    documentation: '`= -4`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_FLASHICON',
    documentation: '`= -5`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_NOFLASHICON',
    documentation: '`= -6`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_PRIMARYDOWN',
    documentation: '`= -7`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_PRIMARYUP',
    documentation: '`= -8`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_SECONDARYDOWN',
    documentation: '`= -9`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_SECONDARYUP',
    documentation: '`= -10`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_MOUSEOVER',
    documentation: '`= -11`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_MOUSEOUT',
    documentation: '`= -12`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_PRIMARYDOUBLE',
    documentation: '`= -13`',
    detail: eventValue,
  },
  {
    label: '$TRAY_EVENT_SECONDARYDOUBLE',
    documentation: '`= -14`',
    detail: eventValue,
  },
  {
    label: '$TIP_ICONNONE',
    documentation: 'No icon (default)\n\n`= 0`',
    detail: balloonTip,
  },
  {
    label: '$TIP_ICONASTERISK',
    documentation: 'Info icon\n\n`= 1`',
    detail: balloonTip,
  },
  {
    label: '$TIP_ICONEXCLAMATION',
    documentation: 'Warning icon\n\n`= 2`',
    detail: balloonTip,
  },
  {
    label: '$TIP_ICONHAND',
    documentation: 'Error icon\n\n`= 3`',
    detail: balloonTip,
  },
  {
    label: '$TIP_NOSOUND',
    documentation: 'No sound\n\n`= 16`',
    detail: balloonTip,
  },
  {
    label: '$TRAY_ITEM_NORMAL',
    documentation: '`= 0`',
    detail: trayCreateItem,
  },
  {
    label: '$TRAY_ITEM_RADIO',
    documentation: '`= 1`',
    detail: trayCreateItem,
  },
  {
    label: '$TRAY_CLICK_SHOW',
    documentation: '`= 0`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_CLICK_PRIMARYDOWN',
    documentation: '`= 1`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_CLICK_PRIMARYUP',
    documentation: '`= 2`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_DBLCLICK_PRIMARY',
    documentation: '`= 4`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_CLICK_SECONDARYDOWN',
    documentation: '`= 8`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_CLICK_SECONDARYUP',
    documentation: '`= 16`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_DBLCLICK_SECONDARY',
    documentation: '`= 32`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_CLICK_HOVERING',
    documentation: '`= 64`',
    detail: traySetCliCk,
  },
  {
    label: '$TRAY_ICONSTATE_SHOW',
    documentation: '`= 1`',
    detail: traySetState,
  },
  {
    label: '$TRAY_ICONSTATE_HIDE',
    documentation: '`= 2`',
    detail: traySetState,
  },
  {
    label: '$TRAY_ICONSTATE_FLASH',
    documentation: '`= 4`',
    detail: traySetState,
  },
  {
    label: '$TRAY_ICONSTATE_STOPFLASH',
    documentation: '`= 8`',
    detail: traySetState,
  },
  {
    label: '$TRAY_ICONSTATE_RESET',
    documentation: '`= 16`',
    detail: traySetState,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'TrayConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
