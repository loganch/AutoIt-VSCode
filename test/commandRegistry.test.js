// Mock the command modules so these tests exercise the registry WIRING
// (id -> handler mapping + the killScriptOpened wrapper), not the handlers.
// jest config has resetMocks:true, so inline jest.fn(impl) loses its impl
// before each test; the two handlers killScriptOpened depends on delegate to
// mock-prefixed fns whose impls are (re)set in beforeEach.
const mockKillScript = jest.fn();
const mockGetActiveDocumentFileName = jest.fn();

jest.mock('../src/commands/ScriptCommands', () => ({
  __esModule: true,
  runScript: jest.fn(),
  killScript: (...args) => mockKillScript(...args),
  restartScript: jest.fn(),
}));
jest.mock('../src/commands/ToolCommands', () => ({
  __esModule: true,
  compile: jest.fn(),
  tidy: jest.fn(),
  check: jest.fn(),
  build: jest.fn(),
  launchHelp: jest.fn(),
  launchInfo: jest.fn(),
  launchKoda: jest.fn(),
}));
jest.mock('../src/commands/DebugCommands', () => ({
  __esModule: true,
  debugMsgBox: jest.fn(),
  debugConsole: jest.fn(),
}));
jest.mock('../src/commands/UtilityCommands', () => ({
  __esModule: true,
  changeParams: jest.fn(),
  openInclude: jest.fn(),
  insertHeader: jest.fn(),
  getActiveDocumentFileName: (...args) => mockGetActiveDocumentFileName(...args),
}));
jest.mock('../src/commands/debugRemove.js', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../src/commands/functionTraceAdd.js', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../src/commands/trace.js', () => ({ __esModule: true, default: jest.fn() }));

import { commandRegistry } from '../src/commandRegistry';
import { commandsList } from '../src/commandsList';

const packageJson = require('../package.json');

describe('commandRegistry', () => {
  beforeEach(() => {
    mockKillScript.mockImplementation(arg => `killed:${arg}`);
    mockGetActiveDocumentFileName.mockImplementation(() => 'C:\\workspace\\active.au3');
  });

  test('maps every command id to a handler function', () => {
    const handlers = Object.values(commandRegistry);
    expect(handlers.length).toBeGreaterThan(0);
    handlers.forEach(handler => expect(typeof handler).toBe('function'));
  });

  test('registry ids exactly match commandsList (no silent gaps)', () => {
    expect(new Set(Object.keys(commandRegistry))).toEqual(new Set(commandsList));
  });

  test('registry ids exactly match package.json command contributions', () => {
    const pkgIds = packageJson.contributes.commands.map(cmd =>
      cmd.command.replace(/^extension\./, ''),
    );
    expect(new Set(Object.keys(commandRegistry))).toEqual(new Set(pkgIds));
  });

  test('killScriptOpened uses active document path when no argument passed', () => {
    expect(commandRegistry.killScriptOpened()).toBe('killed:C:\\workspace\\active.au3');
  });

  test('killScriptOpened prefers explicit file path argument', () => {
    expect(commandRegistry.killScriptOpened('C:\\workspace\\explicit.au3')).toBe(
      'killed:C:\\workspace\\explicit.au3',
    );
  });
});
