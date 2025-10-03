const { window } = require('vscode');
const { HOTKEY_LINE_DELAY_MS, NO_BREAK_SPACE } = require('../command_constants');

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
 * @typedef {Object} OutputOptions
 * @property {number} id - Process ID
 * @property {Object} aiOutProcess - Process output channel
 */

/**
 * Strategy pattern implementation for different output formatting modes
 */
class OutputFormattingStrategy {
  /**
   * Format output lines according to the strategy
   * @param {string[]} _lines - Lines to format
   * @param {Object} _context - Formatting context
   * @returns {string[]} Formatted lines
   */
  // eslint-disable-next-line no-unused-vars
  format(_lines, _context) {
    throw new Error('Strategy must implement format method');
  }
}

/**
 * Global output formatting strategy - shows timestamps for all lines
 */
class GlobalFormattingStrategy extends OutputFormattingStrategy {
  format(lines, context) {
    const { time, isNewLine } = context;
    if (isNewLine && lines.length > 0 && lines[0] !== '') {
      lines[0] = time + NO_BREAK_SPACE + lines[0];
    }
    return lines;
  }
}

/**
 * Process-specific output formatting strategy - shows timestamps only for process output
 */
class ProcessFormattingStrategy extends OutputFormattingStrategy {
  format(lines, context) {
    const { time, isNewLineProcess, config } = context;
    if (config.outputShowTime === 'Process' || config.outputShowTime === 'All') {
      for (let i = 0; i < lines.length; i++) {
        if (i === lines.length - 1 && lines[i] === '') break;
        if (isNewLineProcess) {
          lines[i] = time + NO_BREAK_SPACE + lines[i];
        }
        // Set isNewLineProcess to true for next iteration
        context.isNewLineProcess = true;
      }
    }
    return lines;
  }
}

/**
 * Multi-output formatting strategy - includes process ID prefixes
 */
class MultiFormattingStrategy extends OutputFormattingStrategy {
  format(lines, context) {
    const { prefixId, prefixEmpty, time, isNewLine, lastId, id, config } = context;

    const prefixTime =
      config.outputShowTime === 'Global' || config.outputShowTime === 'All'
        ? time + NO_BREAK_SPACE
        : '';

    for (let i = 0; i < lines.length; i++) {
      if (i === lines.length - 1 && lines[i] === '') break;

      if (isNewLine) {
        if (config.multiOutputShowProcessId === 'Multi') {
          lines[i] = prefixId + lines[i];
        } else if (config.multiOutputShowProcessId !== 'None') {
          lines[i] = (lastId === id ? prefixEmpty : prefixId) + lines[i];
        }
        if (prefixTime) {
          lines[i] = prefixTime + lines[i];
        }
        context.lastId = id;
      }
      context.isNewLine = true;
    }
    return lines;
  }
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
 * - Comprehensive JSDoc documentation
 *
 * @class OutputChannelManager
 */
class OutputChannelManager {
  /**
   * Creates an instance of OutputChannelManager.
   * @param {Object} globalOutputChannel - Global output channel singleton
   * @param {Object} config - Configuration object from ai_config
   * @param {Object} keybindings - Keybindings object for hotkey replacement
   * @param {Object} aWrapperHotkey - AutoIt3Wrapper hotkey manager
   * @param {Object} runners - Runners object for managing output state
   */
  constructor(globalOutputChannel, config, keybindings, aWrapperHotkey, runners) {
    this.globalOutputChannel = globalOutputChannel;
    this.config = config;
    this.keybindings = keybindings;
    this.aWrapperHotkey = aWrapperHotkey;
    this.runners = runners;

    // Strategy pattern implementations
    this.strategies = {
      global: new GlobalFormattingStrategy(),
      process: new ProcessFormattingStrategy(),
      multi: new MultiFormattingStrategy(),
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
   * @static
   * @param {number} processId - Process ID
   * @param {string} fileName - Associated file name
   * @param {string} languageId - Language ID for syntax highlighting
   * @returns {Object} VS Code output channel
   */
  static createProcessOutputChannel(processId, fileName, languageId) {
    const name = `AutoIt #${processId} (${fileName})`;
    return window.createOutputChannel(name, languageId);
  }

  /**
   * Creates a proxy output channel with formatting and filtering capabilities.
   * @param {OutputOptions} options - Output options containing process ID and channel
   * @returns {Proxy} Proxy object that handles output operations
   */
  createProxyOutputChannel(options) {
    const { id, aiOutProcess } = options;

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
      const processContext = {
        time,
        isNewLineProcess,
        config: this.config,
      };
      const formattedProcessLines = this.strategies.process.format(linesProcess, processContext);
      isNewLineProcess = processContext.isNewLineProcess;

      const textProcess = formattedProcessLines.join('\r\n');
      if (textProcess) {
        aiOutProcess[prop](textProcess);
        isNewLineProcess =
          prop === 'appendLine' || textProcess.substring(textProcess.length - 2) === '\r\n';
      }

      if (this.runners.lastId !== id && !this.runners.isNewLine) {
        aiOut.append(prop === 'appendLine' ? '' : '\r\n');
        this.runners.isNewLine = true;
      }

      // Apply multi formatting strategy
      const multiContext = {
        prefixId,
        prefixEmpty,
        time,
        isNewLine: this.runners.isNewLine,
        lastId: this.runners.lastId,
        id,
        config: this.config,
      };
      const formattedGlobalLines = this.strategies.multi.format(lines, multiContext);
      this.runners.isNewLine = multiContext.isNewLine;
      this.runners.lastId = multiContext.lastId;

      const textGlobal = formattedGlobalLines.join('\r\n');
      if (textGlobal) {
        aiOut[prop](textGlobal);
        this.runners.isNewLine =
          prop === 'appendLine' || textGlobal.substring(textGlobal.length - 2) === '\r\n';
      }
    };

    const get = (aiOut, prop, proxy) => {
      const isFlush = prop === 'flush';
      const isError = prop === 'error';

      if (isFlush) prop = 'append';
      else if (isError) prop = 'appendLine';

      let ret = aiOut[prop];
      if (!(ret instanceof Function)) return ret;

      ret = text => {
        if (text === undefined) return;

        clearTimeout(prevLineTimer);
        const lines = prop === 'append' ? text.split(/\r?\n/) : [text];
        lines[0] = prevLine + lines[0];

        // Filter hotkey failure messages
        for (let i = 0; i < lines.length; i++) {
          if (hotkeyFailedMsgFound) continue;
          for (let r = 0; r < this.hotkeyFailedMsg.length; r++) {
            const line = lines[i].replace(this.hotkeyFailedMsg[r], '');
            if (line === lines[i]) continue;
            if (hotkeyFailedMsgFound) {
              lines.splice(i, 1);
            } else {
              this.aWrapperHotkey.reset(id);
              lines[i] = this.generateHotkeyReplacementMessage();
              hotkeyFailedMsgFound = true;
            }
            if (++i >= lines.length) break;
          }
        }

        prevLine = !isFlush && prop === 'append' ? lines[lines.length - 1] : '';
        if (prevLine) {
          if (lines.length > 1) lines[lines.length - 1] = '';
          else lines.pop();

          prevLineTimer = setTimeout(() => proxy.flush(), HOTKEY_LINE_DELAY_MS);
        }
        if (lines.length) outputText(aiOut, prop, lines);
      };

      if (isFlush) ret('');

      return ret;
    };

    return new Proxy(aiOutCommon, { get });
  }

  /**
   * Generates a replacement message for failed hotkey settings.
   * @private
   * @returns {string} Formatted hotkey replacement message
   */
  generateHotkeyReplacementMessage() {
    const { commandsPrefix } = require('../commandsList');
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
    if (!out || !runners.config.outputMaxHistoryLines) return;

    if (out.output.document.lineCount > runners.config.outputMaxHistoryLines) {
      const text = out.output.document.getText();
      const lines = text.split(/\r?\n/);
      const outputText = lines.slice(-runners.config.outputMaxHistoryLines).join('\r\n');
      globalOutputChannel.replace(outputText);
    }
  }

  /**
   * Routes output to the appropriate channel based on configuration.
   * @param {string} text - Text to output
   * @param {OutputOptions} options - Output options
   * @param {string} method - Output method ('append' or 'appendLine')
   */
  routeOutput(text, options, method = 'append') {
    try {
      const proxyChannel = this.createProxyOutputChannel(options);
      proxyChannel[method](text);
    } catch (error) {
      console.error('Error routing output:', error);
      // Fallback to direct output if proxy fails
      const { aiOutProcess } = options;
      if (aiOutProcess && typeof aiOutProcess[method] === 'function') {
        aiOutProcess[method](text);
      }
    }
  }
}

module.exports = OutputChannelManager;
