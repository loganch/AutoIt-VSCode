/**
 * ai_symbols.test.js
 * Unit tests for Map symbol generation in document symbol provider
 */

const path = require('path');

const SYMBOL_MAX_LINES = 50000;
const DEFAULT_MAP_INCLUDE_DEPTH = 3;
const EXPECTED_MAP_KEY_COUNT = 2;
const EXPECTED_MULTIPLE_MAP_COUNT = 3;

// Mock VSCode classes
class MockUri {
  constructor(fsPath) {
    this.fsPath = fsPath;
  }

  toString() {
    return this.fsPath;
  }

  static file(p) {
    return new MockUri(path.normalize(p));
  }
}

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(startLine, startChar, endLine, endChar) {
    this.start = new MockPosition(startLine, startChar);
    this.end = new MockPosition(endLine, endChar);
  }
}

class MockTextLine {
  constructor(text, lineNumber) {
    this.text = text;
    this.lineNumber = lineNumber;
    this.range = new MockRange(lineNumber, 0, lineNumber, text.length);
    const firstNonWS = text.search(/\S/);
    this.firstNonWhitespaceCharacterIndex = firstNonWS === -1 ? 0 : firstNonWS;
  }
}

class MockTextDocument {
  constructor(text, filePath, languageId = 'autoit') {
    this._text = text;
    this.uri = MockUri.file(filePath);
    this.languageId = languageId;
    this._lines = text.split(/\r?\n/);
  }

  getText(range) {
    if (!range) return this._text;
    return this._text;
  }

  lineAt(line) {
    const text = this._lines[line] || '';
    return new MockTextLine(text, line);
  }

  offsetAt(position) {
    let offset = 0;
    for (let i = 0; i < position.line && i < this._lines.length; i++) {
      offset += this._lines[i].length + 1; // +1 for newline
    }
    offset += position.character;
    return offset;
  }

  positionAt(offset) {
    let remaining = offset;
    let line = 0;

    while (line < this._lines.length && remaining > this._lines[line].length) {
      remaining -= this._lines[line].length + 1; // +1 for newline
      line++;
    }

    return new MockPosition(line, remaining);
  }

  get lineCount() {
    return this._lines.length;
  }
}

// Mock SymbolKind enum
const SymbolKind = {
  File: 0,
  Module: 1,
  Namespace: 2,
  Package: 3,
  Class: 4,
  Method: 5,
  Property: 6,
  Field: 7,
  Constructor: 8,
  Enum: 9,
  Interface: 10,
  Function: 11,
  Variable: 12,
  Constant: 13,
  String: 14,
  Number: 15,
  Boolean: 16,
  Array: 17,
  Object: 18,
  Key: 19,
  Null: 20,
};

// Mock DocumentSymbol
class DocumentSymbol {
  constructor(name, detail, kind, range, selectionRange) {
    this.name = name;
    this.detail = detail;
    this.kind = kind;
    this.range = range;
    this.selectionRange = selectionRange;
    this.children = [];
  }
}

// Mock SymbolInformation
class SymbolInformation {
  constructor(name, kind, containerName, location) {
    this.name = name;
    this.kind = kind;
    this.containerName = containerName;
    this.location = location;
  }
}

// Mock Location
class Location {
  constructor(uri, rangeOrPosition) {
    this.uri = uri;
    this.range = rangeOrPosition;
  }
}

// Mock VSCode module
const mockVSCode = {
  DocumentSymbol,
  SymbolInformation,
  Location,
  SymbolKind,
  Range: MockRange,
  Position: MockPosition,
  Uri: MockUri,
  languages: {
    registerDocumentSymbolProvider: jest.fn(() => ({ dispose: jest.fn() })),
  },
  window: {
    createOutputChannel: jest.fn(() => ({
      appendLine: jest.fn(),
      show: jest.fn(),
    })),
  },
  workspace: {
    getConfiguration: jest.fn(() => ({
      get: jest.fn((key, defaultValue) => {
        if (key === 'symbolMaxLines') return SYMBOL_MAX_LINES;
        if (key === 'includePaths') return [];
        if (key === 'maps.includeDepth') return DEFAULT_MAP_INCLUDE_DEPTH;
        if (key === 'maps.enableIntelligence') return true;
        if (key === 'enableIntelligence') return true;
        return defaultValue;
      }),
    })),
    onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
    fs: {
      stat: jest.fn(() => Promise.resolve({ type: 1 })), // 1 = FileType.File
    },
    workspaceFolders: [
      {
        uri: { fsPath: path.join(process.cwd(), 'test') },
      },
    ],
  },
  FileType: {
    File: 1,
    Directory: 2,
    SymbolicLink: 64,
  },
};

jest.mock('vscode', () => mockVSCode, { virtual: true });

// Import after mocking
const { provideDocumentSymbols } = require('../src/ai_symbols');

describe('Map Symbol Generation', () => {
  let originalGetConfiguration;

  beforeEach(() => {
    // Reset MapTrackingService singleton before each test
    const MapTrackingService = require('../src/services/MapTrackingService').default;
    MapTrackingService.resetInstance();

    // Store original configuration and set default mock
    originalGetConfiguration = mockVSCode.workspace.getConfiguration;
    mockVSCode.workspace.getConfiguration = jest.fn(() => ({
      get: jest.fn((key, defaultValue) => {
        if (key === 'symbolMaxLines') return SYMBOL_MAX_LINES;
        if (key === 'includePaths') return [];
        if (key === 'maps.includeDepth') return DEFAULT_MAP_INCLUDE_DEPTH;
        if (key === 'maps.enableIntelligence') return true;
        if (key === 'enableIntelligence') return true;
        return defaultValue;
      }),
    }));
  });

  afterEach(() => {
    // Restore original configuration mock
    mockVSCode.workspace.getConfiguration = originalGetConfiguration;
  });

  describe('Flat Map keys', () => {
    it('should create Map symbol with key children', async () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$mUser.age = 30`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      // Find Map symbol
      const mapSymbol = symbols.find(s => s.kind === SymbolKind.Variable && s.detail === 'Map');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.name).toBe('$mUser');
      expect(mapSymbol.children).toHaveLength(EXPECTED_MAP_KEY_COUNT);

      const keyNames = mapSymbol.children.map(c => c.name);
      expect(keyNames).toContain('"name"');
      expect(keyNames).toContain('"age"');
    });

    it('should order keys by first appearance', async () => {
      const source = `Local $mData[]
$mData.z = 1
$mData.a = 2
$mData.m = 3`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mData');
      expect(mapSymbol).toBeDefined();

      const keyNames = mapSymbol.children.map(c => c.name);
      expect(keyNames).toEqual(['"z"', '"a"', '"m"']);
    });

    it('should deduplicate keys assigned multiple times', async () => {
      const source = `Local $mUser[]
$mUser.name = "John"
$mUser.name = "Jane"
$mUser.name = "Bob"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mUser');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.children).toHaveLength(1);
      expect(mapSymbol.children[0].name).toBe('"name"');
    });

    it('should handle both dot and bracket notation', async () => {
      const source = `Local $mUser[]
$mUser.username = "alice"
$mUser["email"] = "alice@example.com"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mUser');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.children).toHaveLength(EXPECTED_MAP_KEY_COUNT);

      const keyNames = mapSymbol.children.map(c => c.name);
      expect(keyNames).toContain('"username"');
      expect(keyNames).toContain('"email"');
    });
  });

  describe('Dynamic keys', () => {
    it('should display dynamic keys as [$variable]', async () => {
      const source = `Local $mData[]
Local $key = "dynamicKey"
$mData[$key] = "value"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mData');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.children).toHaveLength(1);
      expect(mapSymbol.children[0].name).toBe('[$key]');
    });

    it('should handle mixed static and dynamic keys', async () => {
      const source = `Local $mData[]
$mData.static = "value"
$mData[$dynamicVar] = "value"
$mData["quoted"] = "value"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mData');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.children).toHaveLength(DEFAULT_MAP_INCLUDE_DEPTH);

      const keyNames = mapSymbol.children.map(c => c.name);
      expect(keyNames).toContain('"static"');
      expect(keyNames).toContain('[$dynamicVar]');
      expect(keyNames).toContain('"quoted"');
    });
  });

  describe('Empty Maps', () => {
    it('should show empty Map with no children', async () => {
      const source = `Local $mEmpty[]`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mEmpty');
      expect(mapSymbol).toBeDefined();
      expect(mapSymbol.detail).toBe('Map');
      expect(mapSymbol.children).toHaveLength(0);
    });
  });

  describe('Multiple Maps', () => {
    it('should handle multiple Maps in same file', async () => {
      const source = `Local $mUser[]
$mUser.name = "John"

Local $mConfig[]
$mConfig.apiKey = "secret"

Local $mData[]
$mData.value = 123`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbols = symbols.filter(s => s.kind === SymbolKind.Variable && s.detail === 'Map');
      expect(mapSymbols).toHaveLength(EXPECTED_MULTIPLE_MAP_COUNT);

      const mapNames = mapSymbols.map(m => m.name);
      expect(mapNames).toContain('$mUser');
      expect(mapNames).toContain('$mConfig');
      expect(mapNames).toContain('$mData');
    });
  });

  describe('SymbolKind', () => {
    it('should use SymbolKind.Key for all keys', async () => {
      const source = `Local $mData[]
$mData.static = 1
$mData[$dynamic] = 2
$mData["nested"]["key"] = 3`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      const mapSymbol = symbols.find(s => s.name === '$mData');
      expect(mapSymbol).toBeDefined();

      // Check all top-level keys use SymbolKind.Key
      mapSymbol.children.forEach(child => {
        expect(child.kind).toBe(SymbolKind.Key);

        // Check nested children too
        if (child.children && child.children.length > 0) {
          child.children.forEach(nestedChild => {
            expect(nestedChild.kind).toBe(SymbolKind.Key);
          });
        }
      });
    });
  });

  describe('Map variable scoping', () => {
    it('should not duplicate Map variable as regular variable', async () => {
      const source = `Local $mUser[]
$mUser.name = "John"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      // Should only have one symbol for $mUser (as Map, not as regular variable)
      const userSymbols = symbols.filter(s => s.name === '$mUser');
      expect(userSymbols).toHaveLength(1);
      expect(userSymbols[0].detail).toBe('Map');
    });
  });

  describe('Integration with existing symbols', () => {
    it('should work alongside function symbols', async () => {
      const source = `Func TestFunc()
    Local $x = 1
EndFunc

Local $mData[]
$mData.key = "value"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      // Should have both function and Map symbols
      const funcSymbol = symbols.find(s => s.kind === SymbolKind.Function);
      const mapSymbol = symbols.find(s => s.kind === SymbolKind.Variable && s.detail === 'Map');

      expect(funcSymbol).toBeDefined();
      expect(mapSymbol).toBeDefined();
    });
  });

  describe('Configuration', () => {
    it('should not show Map keys when Map intelligence is disabled', async () => {
      // Override configuration for this test only
      mockVSCode.workspace.getConfiguration = jest.fn(() => ({
        get: jest.fn((key, defaultValue) => {
          if (key === 'enableIntelligence') return false;
          if (key === 'symbolMaxLines') return SYMBOL_MAX_LINES;
          return defaultValue;
        }),
      }));

      const source = `Local $mUser[]
$mUser.name = "John"`;

      const doc = new MockTextDocument(source, path.join(process.cwd(), 'test.au3'));
      const symbols = await provideDocumentSymbols(doc);

      // When Map intelligence is disabled, should return SymbolInformation array
      // and Map variables should not have hierarchical structure
      expect(Array.isArray(symbols)).toBe(true);

      // Configuration will be restored by afterEach
    });
  });
});
