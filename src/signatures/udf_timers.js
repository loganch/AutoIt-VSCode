import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Timers.au3>`)';

const signatures = {
  _Timer_Diff: {
    documentation: 'Returns the difference in time from a previous call to _Timer_Init',
    label: '_Timer_Diff ( $iTimeStamp )',
    params: [
      {
        label: '$iTimeStamp',
        documentation: 'Timestamp returned from a previous call to _Timer_Init().',
      },
    ],
  },
  _Timer_GetIdleTime: {
    documentation: 'Returns the number of ticks since last user activity (i.e. KYBD/Mouse)',
    label: '_Timer_GetIdleTime (  )',
    params: [],
  },
  _Timer_GetTimerID: {
    documentation: 'Returns the Timer ID from $wParam',
    label: '_Timer_GetTimerID ( $wParam )',
    params: [
      {
        label: '$wParam',
        documentation: 'Specifies the timer identifier event.',
      },
    ],
  },
  _Timer_Init: {
    documentation: 'Returns a timestamp (in milliseconds)',
    label: '_Timer_Init (  )',
    params: [],
  },
  _Timer_KillAllTimers: {
    documentation: 'Destroys all the timers',
    label: '_Timer_KillAllTimers ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window associated with the timers.This value must be the same as the $hWnd value passed to the _Timer_SetTimer() function that created the timer',
      },
    ],
  },
  _Timer_KillTimer: {
    documentation: 'Destroys the specified timer',
    label: '_Timer_KillTimer ( $hWnd, $iTimerID )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window associated with the specified timer.This value must be the same as the $hWnd value passed to the _Timer_SetTimer() function that created the timer',
      },
      {
        label: '$iTimerID',
        documentation: 'Specifies the timer to be destroyed',
      },
    ],
  },
  _Timer_SetTimer: {
    documentation: 'Creates a timer with the specified time-out value',
    label: '_Timer_SetTimer ( $hWnd [, $iElapse = 250 [, $sTimerFunc = "" [, $iTimerID = -1]]] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window to be associated with the timer.This window must be owned by the calling thread',
      },
      {
        label: '$iElapse',
        documentation: '**[optional]** Specifies the time-out value, in milliseconds',
      },
      {
        label: '$sTimerFunc',
        documentation:
          '**[optional]** Function name to be notified when the time-out value elapses',
      },
      {
        label: '$iTimerID',
        documentation:
          '**[optional]** Specifies a timer identifier.If $iTimerID = -1 then a new timer is createdIf $iTimerID matches an existing timer then the timer is replacedIf $iTimerID = -1 and $sTimerFunc = "" then timer will use WM_TIMER events',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
