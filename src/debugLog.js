/// <reference types="vscode" />
import { window, workspace } from 'vscode';

/**
 * Optional debug logger gated on the `autoit.debugLogging` setting. Centralises
 * the cfg-check + output-channel/console boilerplate that was copy-pasted ~5×
 * across diagnosticUtils.js and extension.js (tech-debt F8/F15). Never throws —
 * a logging failure must not break the caller's error path.
 *
 * @param {string} msg - Message to log when debug logging is enabled.
 */
export const debugLog = msg => {
  try {
    if (workspace.getConfiguration('autoit')?.get?.('debugLogging') !== true) return;
    // ponytail: creates a channel per call (matches prior behaviour); cache the
    // channel in module state if this ever shows up as a leak.
    const channel = window?.createOutputChannel?.('AutoIt');
    if (channel) {
      channel.appendLine(msg);
    } else {
      console.debug(msg);
    }
  } catch {
    // Swallow: debug logging is best-effort and must never mask the real error.
  }
};
