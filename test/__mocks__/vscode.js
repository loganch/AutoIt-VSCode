module.exports = {
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
  Location: class Location {
    constructor(uri, range) {
      this.uri = uri;
      this.range = range;
    }
  },
  Uri: {
    file: p => ({ fsPath: p, toString: () => p }),
  },
  workspace: {
    getConfiguration: jest.fn(),
    findFiles: jest.fn(),
    openTextDocument: jest.fn(),
    createFileSystemWatcher: jest.fn(() => ({
      onDidChange: jest.fn(),
      onDidCreate: jest.fn(),
      onDidDelete: jest.fn(),
    })),
    onDidChangeConfiguration: jest.fn(),
  },
  languages: {
    registerWorkspaceSymbolProvider: jest.fn(),
  },
  window: {
    showWarningMessage: jest.fn(),
    showErrorMessage: jest.fn(),
  },
};
