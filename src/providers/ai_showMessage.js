import { window } from 'vscode';
import { performance } from 'node:perf_hooks';

let lastHide = 0;
const MESSAGE_BURST_COUNT = 4;
const MESSAGE_COOLDOWN_MS = 900;
// accepts new option parameter in second argument: timeout
const initMessage = type => {
  const timers = {};
  const func = (...args) => {
    let timeout;
    const [message, options] = args;
    if (options && options instanceof Object && !(options instanceof Array)) {
      ({ timeout } = options);
      // not sure if we need to bother sanitize options object or not, seems to work as is
      // delete options.timeout;
      // if (!options.keys().length)
      //   args.splice(1,1);
    }
    const clearTimeoutEx = () => {
      clearTimeout(timers[message]);
      delete timers[message];
    };
    clearTimeoutEx();
    let isHidden = false;
    const callback = () => {
      clearTimeoutEx();
      // https://github.com/microsoft/vscode/issues/153693
      for (
        let i = 0;
        i < MESSAGE_BURST_COUNT;
        i += 1 // showing rapidly 4 messages hides the message...an exploit?
      )
        window[type].apply(window[type], args);

      isHidden = true;
      lastHide = performance.now();
    };
    timers[message] = timeout !== undefined && setTimeout(callback, timeout);
    // vscode doesn't display new message if previous message was forcibly hidden less then 1 sec ago
    const messageTimeout = MESSAGE_COOLDOWN_MS - (performance.now() - lastHide);
    return {
      get isHidden() {
        return isHidden;
      },
      hide: callback,
      message: new Promise(resolve =>
        setTimeout(
          () => resolve(window[type].apply(window[type], args).finally(clearTimeoutEx)),
          messageTimeout,
        ),
      ),
    };
  };
  return func;
};
/**
 * Wrap `vscode.window.show<Type>Message` with timeout/cooldown handling.
 *
 * Usage rule: import this wrapper only where the returned handle is needed
 * (hide/cooldown tracking, e.g. pathResolution message replacement and
 * ai_config path tracking). For fire-and-forget toasts, call
 * `window.show<Type>Message` directly.
 *
 * @param {string} message - message text passed through to VS Code
 * @param {{timeout?: number}} [options] - `timeout` auto-hides the message
 * @returns {{isHidden: boolean, hide: Function, message: Promise<string>}}
 *   `isHidden` flips true once hidden, `hide()` forces the burst-hide, and
 *   `message` resolves with the user's picked item (or undefined).
 */
export const showInformationMessage = initMessage('showInformationMessage');

/** @see showInformationMessage for the wrapper return contract and usage rule. */
export const showErrorMessage = initMessage('showErrorMessage');

/** @see showInformationMessage for the wrapper return contract and usage rule. */
export const showWarningMessage = initMessage('showWarningMessage');
export const messages = { error: {}, info: {} };
