const INITIAL_LINE = 0;
const CONTINUATION_LINE = 1;

const mockWindow = {
  activeTextEditor: null,
  showErrorMessage: jest.fn(),
};

jest.mock('vscode', () => ({
  window: mockWindow,
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
}));

const {
  debugConsole,
  debugMsgBox,
  getDebugText,
  getIndent,
} = require('../../src/commands/DebugCommands.js');

const createEditor = ({ activeLine, lines, selectedWord }) => {
  const insert = jest.fn();
  const document = {
    getText: jest.fn(() => selectedWord),
    getWordRangeAtPosition: jest.fn(() => ({ end: selectedWord.length, start: 0 })),
    lineAt: jest.fn(lineNumber => ({
      isEmptyOrWhitespace: lines[lineNumber].trim().length === 0,
      range: { end: { character: lines[lineNumber].length } },
      text: lines[lineNumber],
    })),
    lineCount: lines.length,
  };

  return {
    document,
    edit: jest.fn(callback => {
      callback({ insert });
      return true;
    }),
    insert,
    selection: {
      active: { character: 0, line: activeLine },
      start: { character: 0, line: activeLine },
    },
  };
};

describe('DebugCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getDebugText advances to the end of continued lines', () => {
    const editor = createEditor({
      activeLine: INITIAL_LINE,
      lines: ['    Local $value = _', '        42', 'ConsoleWrite($value)'],
      selectedWord: '$value',
    });
    mockWindow.activeTextEditor = editor;

    const debugText = getDebugText();

    expect(debugText.text).toBe('$value');
    expect(debugText.position.line).toBe(CONTINUATION_LINE);
    expect(debugText.position.character).toBe('        42'.length);
  });

  test('getIndent reuses the previous indentation for blank lines', () => {
    const editor = createEditor({
      activeLine: CONTINUATION_LINE,
      lines: ['    Local $value = 1', '   ', 'ConsoleWrite($value)'],
      selectedWord: '$value',
    });
    mockWindow.activeTextEditor = editor;

    expect(getIndent()).toBe('    ');
  });

  test('debugMsgBox inserts formatted debug code', () => {
    const editor = createEditor({
      activeLine: INITIAL_LINE,
      lines: ['    Local $value = 1', 'ConsoleWrite($value)'],
      selectedWord: '$value',
    });
    mockWindow.activeTextEditor = editor;

    debugMsgBox();

    expect(editor.insert).toHaveBeenCalledTimes(1);
    expect(editor.insert.mock.calls[0][1]).toContain(';### Debug MSGBOX ↓↓↓');
    expect(editor.insert.mock.calls[0][1]).toContain('$value');
  });

  test('debugConsole reports invalid selections to the user', () => {
    const editor = createEditor({
      activeLine: INITIAL_LINE,
      lines: ['Local value = 1'],
      selectedWord: 'value',
    });
    mockWindow.activeTextEditor = editor;

    debugConsole();

    expect(mockWindow.showErrorMessage).toHaveBeenCalledWith(
      expect.stringContaining('is not a valid variable or macro'),
    );
  });
});
