/**
 * @fileoverview Single source of truth mapping command id -> handler.
 *
 * registerCommands.js iterates this map to register VS Code commands, so a
 * handler can't be silently left unwired the way the old "string list +
 * separate re-export + name lookup" arrangement allowed (tech-debt F6). The
 * commandRegistry.test.js guard asserts these ids stay in sync with both
 * commandsList.js and package.json's command contributions.
 *
 * Adding a command: add one entry here, its id to commandsList.js, and the
 * matching contribution to package.json. (package.json must stay separate —
 * VS Code reads it statically before the extension runs.)
 */
import * as ScriptCommands from './commands/ScriptCommands';
import * as ToolCommands from './commands/ToolCommands';
import * as DebugCommands from './commands/DebugCommands';
import * as UtilityCommands from './commands/UtilityCommands';
import debugRemove from './commands/debugRemove.js';
import functionTraceAdd from './commands/functionTraceAdd.js';
import traceRemove from './commands/trace.js';

const killScriptOpened = (thisFile = null) =>
  ScriptCommands.killScript(thisFile || UtilityCommands.getActiveDocumentFileName());

export const commandRegistry = {
  runScript: ScriptCommands.runScript,
  killScript: ScriptCommands.killScript,
  killScriptOpened,
  restartScript: ScriptCommands.restartScript,

  compile: ToolCommands.compile,
  tidy: ToolCommands.tidy,
  check: ToolCommands.check,
  build: ToolCommands.build,
  launchHelp: ToolCommands.launchHelp,
  launchInfo: ToolCommands.launchInfo,
  launchKoda: ToolCommands.launchKoda,

  debugMsgBox: DebugCommands.debugMsgBox,
  debugConsole: DebugCommands.debugConsole,

  changeParams: UtilityCommands.changeParams,
  openInclude: UtilityCommands.openInclude,
  insertHeader: UtilityCommands.insertHeader,

  debugRemove,
  functionTraceAdd,
  traceRemove,
};
