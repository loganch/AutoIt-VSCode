import { window } from 'vscode';
import { performance } from 'node:perf_hooks';

let lastHide = 0;
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
        i < 4;
        i += 1 // showing rapidly 4 messages hides the message...an exploit?
      )
        window[type].apply(window[type], args);

      isHidden = true;
      lastHide = performance.now();
    };
    timers[message] = timeout !== undefined && setTimeout(callback, timeout);
    // vscode doesn't display new message if previous message was forcibly hidden less then 1 sec ago
    const messageTimeout = 900 - (performance.now() - lastHide);
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
export const showInformationMessage = initMessage('showInformationMessage');
export const showErrorMessage = initMessage('showErrorMessage');
export const showWarningMessage = initMessage('showWarningMessage');
export const messages = { error: {}, info: {} };
