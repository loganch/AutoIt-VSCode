import { window } from 'vscode';
import {
  COMMANDS_PREFIX as commandsPrefix,
  HOTKEY_LINE_DELAY_MS,
  NO_BREAK_SPACE,
} from '../constants';
import { handleError } from '../errorUtils';

/** @typedef {import('../config/configStore').AutoItConfig} AutoItConfig */

// Constants to avoid magic numbers when checking for CRLF endings
const CRLF = '\r\n';
const CRLF_LENGTH = 2;
/**
 * Module-level cache for output channels keyed by channel name.
 * This cache ensures singleton behavior for global channels (such as
 * 'AutoIt (global)') so multiple callers receive the same OutputChannel
 * instance. A simple module-level object is sufficient for typical VS Code
 * extension activation flows and is safe for the single-threaded Node.js
 * runtime used by extensions.
 */
const _cachedOutputChannels = {};

/**
 * Process-specific output formatting strategy - shows timestamps only for process output.
 * @param {string[]} lines - Lines to format (mutated in place)
 * @param {{time: string, isNewLineProcess: boolean, config: Object}} state - Formatting state
 * @returns {{lines: string[], isNewLineProcess: boolean}} Formatted lines and updated state
 */
function formatProcessLines(lines, { time, isNewLineProcess, config }) {
  let nextIsNewLineProcess = isNewLineProcess;
  if (config.outputShowTime === 'Process' || config.outputShowTime === 'All') {
    for (let i = 0; i < lines.length; i++) {
      if (i === lines.length - 1 && lines[i] === '') break;
      if (nextIsNewLineProcess) {
        lines[i] = time + NO_BREAK_SPACE + lines[i];
      }
      nextIsNewLineProcess = true;
    }
  }
  return { lines, isNewLineProcess: nextIsNewLineProcess };
}

/**
 * Multi-output formatting strategy - includes process ID prefixes.
 * @param {string[]} lines - Lines to format (mutated in place)
 * @param {{prefixId: string, prefixEmpty: string, time: string, isNewLine: boolean, lastId: number, id: number, config: Object}} state - Formatting state
 * @returns {{lines: string[], isNewLine: boolean, lastId: number}} Formatted lines and updated state
 */
function formatMultiLines(lines, { prefixId, prefixEmpty, time, isNewLine, lastId, id, config }) {
  const prefixTime =
    config.outputShowTime === 'Global' || config.outputShowTime === 'All'
      ? time + NO_BREAK_SPACE
      : '';

  let nextIsNewLine = isNewLine;
  let nextLastId = lastId;
  for (let i = 0; i < lines.length; i++) {
    if (i === lines.length - 1 && lines[i] === '') break;

    if (nextIsNewLine) {
      if (config.multiOutputShowProcessId === 'Multi') {
        lines[i] = prefixId + lines[i];
      } else if (config.multiOutputShowProcessId !== 'None') {
        lines[i] = (nextLastId === id ? prefixEmpty : prefixId) + lines[i];
      }
      if (prefixTime) {
        lines[i] = prefixTime + lines[i];
      }
      nextLastId = id;
    }
    nextIsNewLine = true;
  }
  return { lines, isNewLine: nextIsNewLine, lastId: nextLastId };
}

/**
 * Manages output channels for AutoIt script execution with comprehensive formatting,
 * filtering, and routing capabilities.
 *
 * Features:
 * - Factory methods for creating process-specific and global output channels
 * - Multiple output formatting strategies (global, process, multi)
 * - Hotkey message filtering and replacement
 * - Output routing based on configuration
 * - Line buffering with timeout management for incomplete lines
 *
 * @class OutputChannelManager
 */
class OutputChannelManager {
  /**
   * Creates an instance of OutputChannelManager.
   * @param {Object} globalOutputChannel - Global output channel singleton
   * @param {AutoItConfig} config - Configuration object from ai_config
   * @param {Object} keybindings - Keybindings object for hotkey replacement
   * @param {Object} aWrapperHotkey - AutoIt3Wrapper hotkey manager
   * @param {Object} runners - Runners object for managing output state
   */
  constructor(globalOutputChannel, config, keybindings, aWrapperHotkey, runners) {
    // Validate required parameters
    if (!globalOutputChannel) {
      throw new Error(
        'OutputChannelManager: globalOutputChannel is required and cannot be null/undefined',
      );
    }

    // Validate that globalOutputChannel has the expected methods
    const requiredMethods = ['append', 'appendLine', 'show', 'hide', 'clear', 'dispose'];
    for (const method of requiredMethods) {
      if (typeof globalOutputChannel[method] !== 'function') {
        throw new Error(`OutputChannelManager: globalOutputChannel must have method '${method}'`);
      }
    }

    // Validate config parameter
    if (!config || typeof config !== 'object') {
      throw new Error('OutputChannelManager: config parameter is required and must be an object');
    }

    this.globalOutputChannel = globalOutputChannel;
    this.config = config;
    this.keybindings = keybindings || {};
    // An empty map silently truncates hotkey-failure messages (see
    // generateHotkeyReplacementMessage), so say so once at wiring time.
    if (Object.keys(this.keybindings).length === 0) {
      console.warn(
        '[OutputChannelManager] No keybindings provided; hotkey-failure messages will omit key hints.',
      );
    }
    this.aWrapperHotkey = aWrapperHotkey;
    this.runners = runners || {};

    // Formatting strategies: (lines, state) => { lines, ...updatedState }
    this.strategies = {
      process: formatProcessLines,
      multi: formatMultiLines,
    };

    // Hotkey failure message patterns
    this.hotkeyFailedMsg = [
      /!!?>Failed Setting Hotkey\(s\)(?::|...)[\r\n]*?/gi,
      /(?:false)?--> SetHotKey (?:\(\) )?Restart failed(?:,|. -->) SetHotKey (?:\(\) )?Stop failed\.[\r\n]*/gi,
      /(!!?>Failed Setting Hotkey\(s\)(?::|...)[\r\n]*?)?(?:false)?--> SetHotKey (?:\(\) )?Restart failed(?:,|. -->) SetHotKey (?:\(\) )?Stop failed\.[\r\n]*/gi,
    ];
  }

  /**
   * Factory method to create a global output channel.
   * Uses a module-level cache to ensure channels with the same name are
   * created only once and the same OutputChannel instance is returned
   * on subsequent requests. This prevents duplicate "AutoIt (global)"
   * channels when multiple modules call createOutputChannel.
   *
   * @static
   * @param {string} name - Name for the output channel
   * @param {string} languageId - Language ID for syntax highlighting
   * @returns {Object} VS Code output channel
   */
  static createGlobalOutputChannel(name, languageId) {
    // Return cached channel if present
    if (_cachedOutputChannels[name]) {
      return _cachedOutputChannels[name];
    }

    // Create and cache the channel
    const channel = window.createOutputChannel(name, languageId);

    // Debug log only when the canonical global channel is created to help runtime verification
    if (name === 'AutoIt (global)') {
      console.debug('[AutoIt][OutputChannelManager] created global channel:', name);
    }

    _cachedOutputChannels[name] = channel;
    return channel;
  }

  /**
   * Factory method to create a process-specific output channel.
   * @param {number} processId - Process ID
   * @param {string} fileName - Associated file name
   * @param {string} languageId - Language ID for syntax highlighting
   * @returns {Object} VS Code output channel
   */
  createProcessOutputChannel(processId, fileName, languageId) {
    const name = `AutoIt #${processId} (${fileName})`;
    return window.createOutputChannel(name, languageId);
  }

  /**
   * Creates a proxy output channel with formatting and filtering capabilities.
   * @param {number} id - Process ID
   * @param {Object} aiOutProcess - Process-specific output channel to proxy
   * @returns {Proxy} Proxy object that handles output operations
   */
  createProxyOutputChannel(id, aiOutProcess) {
    let prevLine = '';
    let prevLineTimer;
    let isNewLineProcess = true;
    let hotkeyFailedMsgFound = false;

    const spacer = NO_BREAK_SPACE;
    const prefixId = `#${id}:${spacer}`;
    const prefixEmpty = ''.padStart(prefixId.length, spacer);

    const aiOutCommon = this.globalOutputChannel;

    const outputText = (aiOut, prop, lines) => {
      const time = this.getTime();
      const linesProcess = Object.assign([], lines);

      if (prop === 'appendLine') {
        if (!isNewLineProcess) {
          isNewLineProcess = true;
          aiOutProcess.append('\r\n');
        }
        if (!this.runners.isNewLine) {
          this.runners.isNewLine = true;
          aiOut.append('\r\n');
        }
      }

      // Apply process formatting strategy
      const processResult = this.strategies.process(linesProcess, {
        time,
        isNewLineProcess,
        config: this.config,
      });
      ({ isNewLineProcess } = processResult);

      const textProcess = processResult.lines.join('\r\n');
      if (textProcess) {
        aiOutProcess[prop](textProcess);
        isNewLineProcess =
          prop === 'appendLine' || textProcess.substring(textProcess.length - CRLF_LENGTH) === CRLF;
      }

      if (this.runners.lastId !== id && !this.runners.isNewLine) {
        aiOut.append(prop === 'appendLine' ? '' : '\r\n');
        this.runners.isNewLine = true;
      }

      // Apply multi formatting strategy
      const multiResult = this.strategies.multi(lines, {
        prefixId,
        prefixEmpty,
        time,
        isNewLine: this.runners.isNewLine,
        lastId: this.runners.lastId,
        id,
        config: this.config,
      });
      this.runners.isNewLine = multiResult.isNewLine;
      this.runners.lastId = multiResult.lastId;

      const textGlobal = multiResult.lines.join('\r\n');
      if (textGlobal) {
        aiOut[prop](textGlobal);
        this.runners.isNewLine =
          prop === 'appendLine' || textGlobal.substring(textGlobal.length - CRLF_LENGTH) === CRLF;
      }
    };

    const isHotkeyFailureLine = line =>
      this.hotkeyFailedMsg.some(pattern => line.replace(pattern, '') !== line);

    // A hotkey failure is reported across a short run of lines (e.g. one line
    // naming the failure, a second with the SetHotKey details). Replace the
    // first such line with a single friendly message and drop the rest of
    // the run; only fires once per proxy, matching the wrapper emitting it
    // once per script launch.
    const stripHotkeyFailureLines = lines => {
      if (hotkeyFailedMsgFound) return;

      const matchIndex = lines.findIndex(isHotkeyFailureLine);
      if (matchIndex === -1) return;

      this.aWrapperHotkey.reset(id);
      lines[matchIndex] = this.generateHotkeyReplacementMessage();
      hotkeyFailedMsgFound = true;

      for (let i = lines.length - 1; i > matchIndex; i--) {
        if (isHotkeyFailureLine(lines[i])) lines.splice(i, 1);
      }
    };

    const bufferPartialLine = (lines, prop, isFlush, proxy) => {
      prevLine = !isFlush && prop === 'append' ? lines[lines.length - 1] : '';
      if (prevLine) {
        if (lines.length > 1) lines[lines.length - 1] = '';
        else lines.pop();

        prevLineTimer = setTimeout(() => proxy.flush(), HOTKEY_LINE_DELAY_MS);
      }
    };

    const get = (aiOut, prop, proxy) => {
      try {
        const isFlush = prop === 'flush';
        const isError = prop === 'error';

        // Alias virtual methods to their real targets without mutating the
        // intercepted name, so errors and fallbacks report what was asked for.
        let targetProp = prop;
        if (isFlush) targetProp = 'append';
        else if (isError) targetProp = 'appendLine';

        // Validate that the property exists on the target object
        if (!(targetProp in aiOut)) {
          const available = Object.getOwnPropertyNames(aiOut).filter(
            name => typeof aiOut[name] === 'function',
          );
          throw new Error(
            `OutputChannelManager: Method '${prop}' is not available on the output channel ` +
              `(available: ${available.join(', ')}). This usually indicates incorrect initialization - the first parameter should be an output channel, not a config object.`,
          );
        }

        let ret = aiOut[targetProp];
        if (!(ret instanceof Function)) return ret;

        ret = text => {
          if (text === undefined) return;

          clearTimeout(prevLineTimer);
          const lines = targetProp === 'append' ? text.split(/\r?\n/) : [text];
          lines[0] = prevLine + lines[0];

          stripHotkeyFailureLines(lines);
          bufferPartialLine(lines, targetProp, isFlush, proxy);
          if (lines.length) outputText(aiOut, targetProp, lines);
        };

        if (isFlush) ret('');

        return ret;
      } catch (error) {
        handleError('OutputChannelManager proxy handler', error);
        // Provide a fallback function that prevents crashes
        return () => {
          console.warn(
            `[OutputChannelManager] Fallback called for method '${prop}' due to proxy error`,
          );
        };
      }
    };

    return new Proxy(aiOutCommon, { get });
  }

  /**
   * Generates a replacement message for failed hotkey settings.
   * @private
   * @returns {string} Formatted hotkey replacement message
   */
  generateHotkeyReplacementMessage() {
    let message = '+>Setting Hotkeys...--> Press ';

    if (this.keybindings[`${commandsPrefix}restartScript`]) {
      message += `${this.keybindings[`${commandsPrefix}restartScript`]} to Restart`;
    }

    if (
      this.keybindings[`${commandsPrefix}killScript`] ||
      this.keybindings[`${commandsPrefix}killScriptOpened`]
    ) {
      if (this.keybindings[`${commandsPrefix}restartScript`]) message += ' or ';
      message += `${
        this.keybindings[`${commandsPrefix}killScript`] ||
        this.keybindings[`${commandsPrefix}killScriptOpened`]
      } to Stop.`;
    }

    return message;
  }

  /**
   * Returns the current time in a specific format for output timestamps.
   * @private
   * @returns {string} The current time in the format "hh:mm:ss.ms".
   * @example
   * // returns "10:30:45.123"
   */
  getTime() {
    return new Date()
      .toLocaleString('sv', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        fractionalSecondDigits: 3,
      })
      .replace(',', '.');
  }

  /**
   * Trims the output text in the visible AutoIt output to the max number of lines
   * set in the configuration.
   * @param {Object} runners - Runners object containing output state
   * @param {Object} globalOutputChannel - Global output channel singleton
   * @returns {void}
   */
  static trimOutputLines(runners, globalOutputChannel) {
    const out = runners.isAiOutVisible();
    const maxLines = runners.outputMaxHistoryLines;
    if (!out || !maxLines) return;

    if (out.output.document.lineCount > maxLines) {
      const text = out.output.document.getText();
      const lines = text.split(/\r?\n/);
      const outputText = lines.slice(-maxLines).join('\r\n');
      globalOutputChannel.replace(outputText);
    }
  }
}

export default OutputChannelManager;
