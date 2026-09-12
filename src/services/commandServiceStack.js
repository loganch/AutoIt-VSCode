import ProcessRunner from './ProcessRunner';
import ProcessManager from './ProcessManager';
import OutputChannelManager from './OutputChannelManager';
import HotkeyManager from './HotkeyManager';
import conf from '../config/ai_config';
import { getActiveDocumentFileName } from '../commands/editorActions';
import packageJson from '../../package.json';

const { config } = conf;

/**
 * Shared singleton service stack for running/tracking AutoIt3Wrapper processes.
 * Both scriptCommands.js and toolCommands.js spawn processes through this same
 * stack so a single ProcessManager owns runner state across script and tool commands.
 *
 * Importing this module is side-effect free. Call createServiceStack() for a
 * fresh stack (tests) or getServiceStack() for the cached shared instance.
 */
export function createServiceStack() {
  const globalOutputChannel = OutputChannelManager.createGlobalOutputChannel(
    'AutoIt (global)',
    'vscode-autoit-output',
  );

  const processManager = new ProcessManager(
    config,
    globalOutputChannel,
    getActiveDocumentFileName,
    `extension-output-${packageJson.publisher}.${packageJson.name}-#`,
  );

  const hotkeyManager = new HotkeyManager(config);

  const outputChannelManager = new OutputChannelManager(
    globalOutputChannel,
    config,
    {},
    hotkeyManager,
    processManager,
  );

  const processRunner = new ProcessRunner({
    config,
    processManager,
    outputChannelManager,
    hotkeyManager,
    getActiveDocumentFileName,
    globalOutputChannel,
  });

  return { globalOutputChannel, processManager, hotkeyManager, outputChannelManager, processRunner };
}

let _cached = null;

export function getServiceStack() {
  if (!_cached) {
    _cached = createServiceStack();
  }
  return _cached;
}

// ponytail: test isolation hook; production code never calls this
export function resetServiceStack() {
  _cached = null;
}
