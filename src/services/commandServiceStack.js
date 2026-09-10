import ProcessRunner from './ProcessRunner';
import ProcessManager from './ProcessManager';
import OutputChannelManager from './OutputChannelManager';
import HotkeyManager from './HotkeyManager';
import conf from '../providers/ai_config';
import { getActiveDocumentFileName } from '../commands/editorActions';
import packageJson from '../../package.json';

const { config } = conf;

/**
 * Shared singleton service stack for running/tracking AutoIt3Wrapper processes.
 * Both ScriptCommands.js and ToolCommands.js spawn processes through this same
 * stack so a single ProcessManager owns runner state across script and tool commands.
 */
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

export { globalOutputChannel, processManager, hotkeyManager, outputChannelManager, processRunner };
