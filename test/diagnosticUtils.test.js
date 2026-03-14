const mockWorkspace = {
  getConfiguration: jest.fn(() => ({ get: jest.fn(() => false) })),
  textDocuments: [],
};

jest.mock('vscode', () => ({
  Diagnostic: class Diagnostic {
    constructor(range, message, severity) {
      this.range = range;
      this.message = message;
      this.severity = severity;
      this.source = undefined;
    }
  },
  DiagnosticSeverity: {
    Warning: 'warning',
    Error: 'error',
  },
  Position: class Position {
    constructor(line, character) {
      this.line = line;
      this.character = character;
    }
  },
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
  Uri: {
    file: p => ({ fsPath: p, path: p, toString: () => p }),
    parse: s => ({ toString: () => s }),
  },
  window: {
    createOutputChannel: jest.fn(() => ({ appendLine: jest.fn() })),
  },
  workspace: mockWorkspace,
}));

const {
  clearDiagnosticsOwnedBy,
  createDiagnosticRange,
  getDiagnosticSeverity,
  parseAu3CheckOutput,
  updateDiagnostics,
} = require('../src/diagnosticUtils');

describe('diagnosticUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWorkspace.textDocuments = [];
  });

  test('getDiagnosticSeverity maps warning and defaults to error', () => {
    expect(getDiagnosticSeverity('warning')).toBe('warning');
    expect(getDiagnosticSeverity('error')).toBe('error');
    expect(getDiagnosticSeverity('anything')).toBe('error');
  });

  test('createDiagnosticRange parses values and converts to zero-based range', () => {
    const range = createDiagnosticRange('3', '4');
    expect(range.start.line).toBe(2);
    expect(range.start.character).toBe(3);
    expect(range.end.line).toBe(2);
    expect(range.end.character).toBe(3);
  });

  test('updateDiagnostics appends diagnostics for same script path', () => {
    const diagnostics = new Map();
    const d1 = { message: 'first' };
    const d2 = { message: 'second' };

    updateDiagnostics(diagnostics, 'c:\\a.au3', d1);
    updateDiagnostics(diagnostics, 'c:\\a.au3', d2);

    expect(diagnostics.get('c:\\a.au3')).toEqual([d1, d2]);
  });

  test('parseAu3CheckOutput deletes diagnostics when output reports zero findings', () => {
    const collection = {
      delete: jest.fn(),
      set: jest.fn(),
    };

    parseAu3CheckOutput('- 0 error(s), 0 warning(s)', collection, {
      fsPath: 'c:\\tmp\\main.au3',
      toString: () => 'file:///c:/tmp/main.au3',
    });

    expect(collection.delete).toHaveBeenCalled();
    expect(collection.set).not.toHaveBeenCalled();
  });

  test('parseAu3CheckOutput parses and sets diagnostics', () => {
    const collection = {
      delete: jest.fn(),
      set: jest.fn(),
    };

    const output = '"C:\\\\tmp\\\\main.au3"(2,3) : error: Sample error\r\n';
    const ownerUri = {
      fsPath: 'c:\\tmp\\main.au3',
      path: '/c:/tmp/main.au3',
      toString: () => 'file:///c:/tmp/main.au3',
    };

    parseAu3CheckOutput(output, collection, ownerUri);

    expect(collection.set).toHaveBeenCalledTimes(1);
    const [, diagnostics] = collection.set.mock.calls[0];
    expect(Array.isArray(diagnostics)).toBe(true);
    expect(diagnostics[0]).toEqual(
      expect.objectContaining({
        message: 'Sample error',
        severity: 'error',
        source: 'au3check',
      }),
    );
  });

  test('clearDiagnosticsOwnedBy removes only diagnostics from matching owner', () => {
    const owner = 'file:///owner.au3';
    const docUri = { toString: () => 'file:///doc.au3' };
    mockWorkspace.textDocuments = [{ uri: docUri }];

    const keep = { _ownerUri: 'file:///other.au3', message: 'keep' };
    const remove = { _ownerUri: owner, message: 'remove' };

    const collection = {
      delete: jest.fn(),
      get: jest.fn(() => [remove, keep]),
      set: jest.fn(),
    };

    clearDiagnosticsOwnedBy(collection, owner);

    expect(collection.set).toHaveBeenCalledWith(docUri, [keep]);
    expect(collection.delete).not.toHaveBeenCalled();
  });
});
