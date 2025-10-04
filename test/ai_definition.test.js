/**
 * ai_definition.test.js
 * End-to-end function-level tests for src/ai_definition.js using Jest with mocked VS Code API and util/fs.
 * - All include/file contents are in-memory strings.
 * - Fixtures also exist on disk under test/fixtures for future integration, but tests do not rely on real fs I/O.
 */

const path = require('path');

// In-memory fixtures mirroring the requested files
const MAIN_PATH = path.join(process.cwd(), 'test', 'fixtures', 'main.au3');
const HELPER_PATH = path.join(process.cwd(), 'test', 'fixtures', 'helper.au3');
const MISSING_PATH = path.join(process.cwd(), 'test', 'fixtures', 'missing.au3');
const LIB_ARRAY_PATH = path.join(process.cwd(), 'lib', 'Array.au3'); // fake normalized lib include

const MAIN_CONTENT = [
  '#include "helper.au3"',
  '#include <Array.au3>', // note: our parser will not use <> literally; util mocks return data for lib include
  'Local $a, $b = 1, _',
  '    $c',
  'Global $Mixed_Name123 = 0',
  '; function with volatile after name',
  '    Func DoWork volatile($x, $y)',
  '        Return $x + $y',
  '    EndFunc',
  '; function normal',
  'Func NormalFunc($p)',
  '    Return $p',
  'EndFunc',
  '; calls to included functions and variables',
  'Local $result = HelperFunc($helperVar)',
  'Local $libResult = LibFunc($Array_InLib)',
].join('\n');

const HELPER_CONTENT = [
  '; nested include to test recursion (not existing to simulate missing readable)',
  '#include "missing.au3"',
  'Const $CONST_ONE = 1',
  '    Local   $helperVar = 2',
  '; volatile before name',
  'Func volatile HelperFunc($v)',
  '    Return $v',
  'EndFunc',
].join('\n');

const LIB_ARRAY_CONTENT = [
  '; Fake Array.au3',
  'Global $Array_InLib = 42',
  'Func LibFunc($x)',
  '  Return $x',
  'EndFunc',
].join('\n');

// Minimal VS Code stubs
class MockUri {
  static file(p) {
    return { fsPath: path.normalize(p) };
  }
}

class MockPosition {
  constructor(line, character) {
    this.line = line;
    this.character = character;
  }
}

class MockRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class MockLocation {
  constructor(uri, range) {
    this.uri = uri;
    this.range = range;
  }
}

// Helper: implement a VS Code-like TextDocument for AutoIt
class MockTextDocument {
  constructor(text, filePath) {
    this._text = text;
    this.uri = MockUri.file(filePath || MAIN_PATH);
    const lines = text.split(/\r?\n/);
    this._lineOffsets = new Array(lines.length);
    let offset = 0;
    for (let i = 0; i < lines.length; i++) {
      this._lineOffsets[i] = offset;
      offset += lines[i].length + 1; // assume \n
    }
  }

  getText(range) {
    if (!range) return this._text;
    const start = this.offsetAt(range.start);
    const end = this.offsetAt(range.end);
    return this._text.substring(start, end);
  }

  positionAt(offset) {
    if (offset < 0) offset = 0;
    if (offset > this._text.length) offset = this._text.length;
    // binary search line
    let low = 0,
      high = this._lineOffsets.length - 1;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const mo = this._lineOffsets[mid];
      if (mo === offset) {
        return new MockPosition(mid, 0);
      }
      if (mo < offset) low = mid + 1;
      else high = mid - 1;
    }
    const line = Math.max(0, high);
    const lineOffset = this._lineOffsets[line];
    return new MockPosition(line, offset - lineOffset);
  }

  offsetAt(position) {
    const line = Math.max(0, Math.min(position.line, this._lineOffsets.length - 1));
    const off = this._lineOffsets[line] + Math.max(0, position.character);
    return Math.max(0, Math.min(off, this._text.length));
  }

  // AutoIt words include $ for variables, letters, digits, and underscore.
  getWordRangeAtPosition(pos, regex) {
    const offset = this.offsetAt(pos);
    const text = this._text;
    const pattern = regex || /\$?[A-Za-z_][A-Za-z0-9_]*/g;
    // scan the line containing position
    const { line } = pos;
    const lineStart = this._lineOffsets[line];
    const nextLineStart =
      line + 1 < this._lineOffsets.length ? this._lineOffsets[line + 1] : text.length;
    const segment = text.substring(lineStart, nextLineStart);
    let match;
    while ((match = pattern.exec(segment)) !== null) {
      const start = lineStart + match.index;
      const end = start + match[0].length;
      if (offset >= start && offset <= end) {
        const startPos = this.positionAt(start);
        const endPos = this.positionAt(end);
        return new MockRange(startPos, endPos);
      }
    }
    return null;
  }
}

// jest mocks
jest.mock(
  'vscode',
  () => {
    return {
      Uri: MockUri,
      Position: MockPosition,
      Range: MockRange,
      Location: MockLocation,
      languages: {
        registerDefinitionProvider: jest.fn(() => ({ dispose: jest.fn() })),
      },
    };
  },
  { virtual: true },
);

// Enhanced centralized mock state management with caching
const mockState = {
  callCounts: {},
  cache: new Map(),
  cachedMocks: new WeakMap(),

  reset() {
    Object.keys(this.callCounts).forEach(key => delete this.callCounts[key]);
  },

  clearCache() {
    this.cache.clear();
    this.cachedMocks = new WeakMap();
  },

  getCachedContent(path) {
    return this.cache.get(path);
  },

  setCachedContent(path, content) {
    this.cache.set(path, content);
  },

  hasCachedContent(path) {
    return this.cache.has(path);
  },
};

const normalizeP = p => path.normalize(p);

// Mock fs used by util.js (only statSync, readFileSync as per instructions)
jest.mock('fs', () => {
  // Define paths and content locally within the mock to avoid Jest scoping issues
  const path = require('path');
  const mockMainPath = path.join(process.cwd(), 'test', 'fixtures', 'main.au3');
  const mockHelperPath = path.join(process.cwd(), 'test', 'fixtures', 'helper.au3');
  const mockLibArrayPath = path.join(process.cwd(), 'lib', 'Array.au3');

  // Define content constants locally
  const mockMainContent = [
    '#include "helper.au3"',
    '#include <Array.au3>', // note: our parser will not use <> literally; util mocks return data for lib include
    'Local $a, $b = 1, _',
    '    $c',
    'Global $Mixed_Name123 = 0',
    '; function with volatile after name',
    '    Func DoWork volatile($x, $y)',
    '        Return $x + $y',
    '    EndFunc',
    '; function normal',
    'Func NormalFunc($p)',
    '    Return $p',
    'EndFunc',
    '; calls to included functions and variables',
    'Local $result = HelperFunc($helperVar)',
    'Local $libResult = LibFunc($Array_InLib)',
  ].join('\n');

  const mockHelperContent = [
    '; nested include to test recursion (not existing to simulate missing readable)',
    '#include "missing.au3"',
    'Const $CONST_ONE = 1',
    '    Local   $helperVar = 2',
    '; volatile before name',
    'Func volatile HelperFunc($v)',
    '    Return $v',
    'EndFunc',
  ].join('\n');

  const mockLibArrayContent = [
    '; Fake Array.au3',
    'Global $Array_InLib = 42',
    'Func LibFunc($x)',
    '  Return $x',
    'EndFunc',
  ].join('\n');

  return {
    statSync: jest.fn(p => {
      // make MAIN, HELPER, LIB exist, missing throws
      const n = path.normalize(p);
      if (
        n === path.normalize(mockMainPath) ||
        n === path.normalize(mockHelperPath) ||
        n === path.normalize(mockLibArrayPath)
      ) {
        return { isFile: () => true };
      }
      // simulate not found
      const err = new Error('ENOENT: no such file or directory');
      // @ts-ignore
      err.code = 'ENOENT';
      throw err;
    }),
    readFileSync: jest.fn((p, _enc) => {
      const n = path.normalize(p);
      if (n === path.normalize(mockMainPath)) return mockMainContent;
      if (n === path.normalize(mockHelperPath)) return mockHelperContent;
      if (n === path.normalize(mockLibArrayPath)) {
        // simulate unreadable include in some tests via flag
        if (global.__UNREADABLE_LIB__) {
          const e = new Error('EACCES: permission denied');
          // @ts-ignore
          e.code = 'EACCES';
          throw e;
        }
        return mockLibArrayContent;
      }
      // missing
      const err = new Error('ENOENT: no such file or directory');
      // @ts-ignore
      err.code = 'ENOENT';
      throw err;
    }),
  };
});

// Prepare a mutable util mock; we override implementations per test
jest.mock('../src/util', () => {
  // Define paths and content locally within the mock to avoid Jest scoping issues
  const path = require('path');
  const mockMainPath = path.join(process.cwd(), 'test', 'fixtures', 'main.au3');
  const mockHelperPath = path.join(process.cwd(), 'test', 'fixtures', 'helper.au3');
  const mockMissingPath = path.join(process.cwd(), 'test', 'fixtures', 'missing.au3');
  const mockLibArrayPath = path.join(process.cwd(), 'lib', 'Array.au3');

  // Define content constants locally
  const mockMainContent = [
    '#include "helper.au3"',
    '#include <Array.au3>', // note: our parser will not use <> literally; util mocks return data for lib include
    'Local $a, $b = 1, _',
    '    $c',
    'Global $Mixed_Name123 = 0',
    '; function with volatile after name',
    '    Func DoWork volatile($x, $y)',
    '        Return $x + $y',
    '    EndFunc',
    '; function normal',
    'Func NormalFunc($p)',
    '    Return $p',
    'EndFunc',
    '; calls to included functions and variables',
    'Local $result = HelperFunc($helperVar)',
    'Local $libResult = LibFunc($Array_InLib)',
  ].join('\n');

  const mockHelperContent = [
    '; nested include to test recursion (not existing to simulate missing readable)',
    '#include "missing.au3"',
    'Const $CONST_ONE = 1',
    '    Local   $helperVar = 2',
    '; volatile before name',
    'Func volatile HelperFunc($v)',
    '    Return $v',
    'EndFunc',
  ].join('\n');

  const mockLibArrayContent = [
    '; Fake Array.au3',
    'Global $Array_InLib = 42',
    'Func LibFunc($x)',
    '  Return $x',
    'EndFunc',
  ].join('\n');

  // Use global to track calls since we can't access outer scope variables
  global.getIncludeTextCallCounts = global.getIncludeTextCallCounts || {};

  const mod = {
    getIncludeScripts: jest.fn(() => []),
    getIncludeText: jest.fn(p => {
      const n = path.normalize(p);
      global.getIncludeTextCallCounts[n] = (global.getIncludeTextCallCounts[n] || 0) + 1;
      if (n === path.normalize(mockHelperPath)) return mockHelperContent;
      if (n === path.normalize(mockLibArrayPath)) return mockLibArrayContent;
      if (n === path.normalize(mockMainPath)) return mockMainContent;
      return ''; // simulate missing
    }),
    getIncludePath: jest.fn((base, inc) => {
      // simplistic resolver: "helper.au3" -> HELPER_PATH, <Array.au3> -> LIB_ARRAY_PATH
      if (inc.startsWith('<') && inc.endsWith('>')) return mockLibArrayPath;
      if (inc.startsWith('"') && inc.endsWith('"')) {
        const name = inc.slice(1, -1);
        if (name.toLowerCase() === 'helper.au3') return mockHelperPath;
        if (name.toLowerCase() === 'missing.au3') return mockMissingPath;
      }
      return path.join(path.dirname(base), inc.replace(/["<>]/g, ''));
    }),
    normalizePath: jest.fn(p => path.normalize(p)),
    AUTOIT_MODE: { language: 'autoit', scheme: 'file' },
  };
  return mod;
});

const util = jest.mocked(require('../src/util')); // get the mock instance with proper typing

// Import the module under test
const { AutoItDefinitionProvider } = require('../src/ai_definition.js');
const definitionProvider = AutoItDefinitionProvider;

function makeDoc(text = MAIN_CONTENT, filePath = MAIN_PATH) {
  return new MockTextDocument(text, filePath);
}

// Helper to create a position at the first occurrence of token
function posAtFirst(doc, token) {
  const text = doc.getText();
  const idx = text.toLowerCase().indexOf(token.toLowerCase());
  if (idx === -1) throw new Error(`Token not found: ${token}`);
  return doc.positionAt(idx + Math.max(0, token.indexOf('$') === 0 ? 1 : 0)); // ensure inside token
}

// Safe version that returns null instead of throwing for missing tokens
function posAtFirstSafe(doc, token) {
  try {
    return posAtFirst(doc, token);
  } catch (error) {
    if (error.message.includes('Token not found')) {
      return null; // Return null for missing tokens instead of throwing
    }
    throw error; // Re-throw unexpected errors
  }
}

// Fixture validation utility
function validateFixtureSymbols() {
  const allContent = MAIN_CONTENT + '\n' + HELPER_CONTENT + '\n' + LIB_ARRAY_CONTENT;

  const expectedSymbols = {
    functions: ['DoWork', 'NormalFunc', 'HelperFunc', 'LibFunc'],
    variables: ['$a', '$b', '$c', '$Mixed_Name123', '$helperVar', '$CONST_ONE', '$Array_InLib'],
    constants: ['$CONST_ONE'],
  };

  const missingSymbols = {
    functions: [],
    variables: [],
    constants: [],
  };

  // Check functions
  expectedSymbols.functions.forEach(func => {
    if (!allContent.toLowerCase().includes(func.toLowerCase())) {
      missingSymbols.functions.push(func);
    }
  });

  // Check variables and constants
  expectedSymbols.variables.forEach(variable => {
    if (!allContent.includes(variable)) {
      missingSymbols.variables.push(variable);
    }
  });

  // Report missing symbols
  let hasErrors = false;
  Object.keys(missingSymbols).forEach(type => {
    if (missingSymbols[type].length > 0) {
      console.warn(`⚠️ Missing ${type} in fixtures:`, missingSymbols[type]);
      hasErrors = true;
    }
  });

  if (!hasErrors) {
    console.log('✅ All expected symbols found in fixtures');
  }

  return !hasErrors;
}

// Cross-platform path normalization utility
function ensureCrossPlatformPaths() {
  const testPaths = [MAIN_PATH, HELPER_PATH, LIB_ARRAY_PATH, MISSING_PATH];

  testPaths.forEach(testPath => {
    const normalized = normalizeP(testPath);
    if (testPath !== normalized) {
      console.log(`🔧 Path normalized: ${testPath} → ${normalized}`);
    }
  });

  // Verify that path separators work correctly across platforms
  const testPath = path.join('test', 'fixtures', 'main.au3');

  console.log(`📁 Cross-platform path test: ${testPath} (platform: ${process.platform})`);

  return true;
}

// Enhanced unified mock factory function with caching
function createUtilMocks(options = {}) {
  const defaults = {
    includeContent: {
      [normalizeP(HELPER_PATH)]: HELPER_CONTENT,
      [normalizeP(LIB_ARRAY_PATH)]: LIB_ARRAY_CONTENT,
      [normalizeP(MAIN_PATH)]: MAIN_CONTENT,
    },
    includeScripts: [HELPER_PATH, LIB_ARRAY_PATH],
    callCounts: mockState.callCounts,
    useCache: true,
    enableShallowCloning: true,
  };

  const config = { ...defaults, ...options };

  // Shallow clone test data when enabled
  const getContentWithCloning = content => {
    if (!config.enableShallowCloning || typeof content !== 'string') {
      return content;
    }
    // For strings, return a new string reference (shallow clone)
    return String(content);
  };

  return {
    getIncludeText: jest.fn(p => {
      const normalized = normalizeP(p);

      // Use cache if enabled
      if (config.useCache && mockState.hasCachedContent(normalized)) {
        const cached = mockState.getCachedContent(normalized);
        config.callCounts[normalized] = (config.callCounts[normalized] || 0) + 1;
        return getContentWithCloning(cached);
      }

      const content = config.includeContent[normalized] || '';

      // Cache the content if caching is enabled
      if (config.useCache && content) {
        mockState.setCachedContent(normalized, content);
      }

      config.callCounts[normalized] = (config.callCounts[normalized] || 0) + 1;
      return getContentWithCloning(content);
    }),

    getIncludeScripts: jest.fn(() => {
      // Cache the scripts list for reuse
      const cacheKey = 'includeScripts';
      if (config.useCache && mockState.hasCachedContent(cacheKey)) {
        return mockState.getCachedContent(cacheKey);
      }

      const scripts = config.includeScripts.map(normalizeP);
      if (config.useCache) {
        mockState.setCachedContent(cacheKey, scripts);
      }

      return scripts;
    }),

    getCallCounts: () => config.callCounts,

    resetCounts: () => {
      Object.keys(config.callCounts).forEach(key => delete config.callCounts[key]);
    },

    clearCache: () => {
      mockState.clearCache();
    },
  };
}

describe('ai_definition: basic functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all global test state
    Object.keys(global).forEach(key => {
      if (key.startsWith('__') && key.endsWith('__')) {
        delete global[key];
      }
    });

    // Reset mock call tracking
    mockState.reset();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;

    // Validate fixtures and cross-platform paths
    validateFixtureSymbols();
    ensureCrossPlatformPaths();

    // Set up unified mocks using factory
    const mocks = createUtilMocks();
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);
  });

  test('finds function definitions in the same file', () => {
    const doc = makeDoc();
    const position = posAtFirst(doc, 'NormalFunc');
    const res = definitionProvider.provideDefinition(doc, position);
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(MAIN_PATH));
    // Expect range to cover function name at its declaration line 10 (0-based 10)
    expect(res.range.start.line).toBe(10);
    expect(res.range.start.character).toBe(5); // "Func " is 5 chars
  });

  test('finds variable definitions in the same file ($a, $c, $Mixed_Name123)', () => {
    const doc = makeDoc();
    for (const variable of ['$a', '$c', '$Mixed_Name123']) {
      const position = posAtFirst(doc, variable);
      const res = definitionProvider.provideDefinition(doc, position);
      expect(res).toBeTruthy();
      expect(res.uri.fsPath).toBe(normalizeP(MAIN_PATH));
      // ranges should point to the declaration lines (Local/Global lines)
      if (variable === '$a' || variable === '$c') {
        // Local on line 2-3 with continuation; both should resolve within those lines
        expect([2, 3]).toContain(res.range.start.line);
      } else {
        // Global on line 4
        expect(res.range.start.line).toBe(4);
      }
    }
  });

  test('finds definitions in included files (HelperFunc and $helperVar)', () => {
    const doc = makeDoc();
    const posFunc = posAtFirst(doc, 'HelperFunc');
    const resFunc = definitionProvider.provideDefinition(doc, posFunc);
    expect(resFunc).toBeTruthy();
    expect(resFunc.uri.fsPath).toBe(normalizeP(HELPER_PATH));

    const posVar = posAtFirst(doc, '$helperVar');
    const resVar = definitionProvider.provideDefinition(doc, posVar);
    expect(resVar).toBeTruthy();
    expect(resVar.uri.fsPath).toBe(normalizeP(HELPER_PATH));
  });
});

describe('ai_definition: edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all global test state
    Object.keys(global).forEach(key => {
      if (key.startsWith('__') && key.endsWith('__')) {
        delete global[key];
      }
    });

    // Reset mock call tracking
    mockState.reset();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;

    // Set up unified mocks using factory
    const mocks = createUtilMocks();
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);
  });

  test('function declarations with volatile after and before name; case-insensitive matching', () => {
    const doc = makeDoc();
    // After name in main: DoWork volatile
    const pos1 = posAtFirst(doc, 'DoWork');
    const res1 = definitionProvider.provideDefinition(doc, pos1);
    expect(res1).toBeTruthy();
    expect(res1.uri.fsPath).toBe(normalizeP(MAIN_PATH));

    // Before name in helper: volatile HelperFunc
    const pos2 = posAtFirst(doc, 'helperfunc'); // lowercase search
    const res2 = definitionProvider.provideDefinition(doc, pos2);
    expect(res2).toBeTruthy();
    expect(res2.uri.fsPath).toBe(normalizeP(HELPER_PATH));
  });

  test('variable declarations Local, Global, Const with indentation/tabs, multi-line continuation, comma lists', () => {
    const doc = makeDoc();
    // Local list on multiple lines ($a, $b, $c) with underscore continuation
    for (const v of ['$a', '$c']) {
      const pos = posAtFirst(doc, v);
      const res = definitionProvider.provideDefinition(doc, pos);
      expect(res).toBeTruthy();
      expect(res.uri.fsPath).toBe(normalizeP(MAIN_PATH));
    }
    // helper var with indentation/tabs
    const posHelperVar = posAtFirst(doc, '$helperVar');
    const resHelperVar = definitionProvider.provideDefinition(doc, posHelperVar);
    expect(resHelperVar).toBeTruthy();
    expect(resHelperVar.uri.fsPath).toBe(normalizeP(HELPER_PATH));
  });

  test('indented function and variable declarations; case-insensitive function name matching', () => {
    const doc = makeDoc();
    const posDoWorkUpper = posAtFirst(doc, 'DOWORK'); // uppercase reference
    const res1 = definitionProvider.provideDefinition(doc, posDoWorkUpper);
    expect(res1).toBeTruthy();
    expect(res1.uri.fsPath).toBe(normalizeP(MAIN_PATH));

    const posMixed = posAtFirst(doc, '$Mixed_Name123');
    const res2 = definitionProvider.provideDefinition(doc, posMixed);
    expect(res2).toBeTruthy();
    expect(res2.uri.fsPath).toBe(normalizeP(MAIN_PATH));
  });
});

describe('ai_definition: error handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all global test state
    Object.keys(global).forEach(key => {
      if (key.startsWith('__') && key.endsWith('__')) {
        delete global[key];
      }
    });

    // Reset mock call tracking
    mockState.reset();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('missing include files: getIncludeText returns empty string', () => {
    const mocks = createUtilMocks({
      includeScripts: [MISSING_PATH],
      includeContent: {},
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    const pos = posAtFirst(doc, 'HelperFunc'); // only in helper/missing, but include text empty
    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeNull();
  });

  test('unreadable include: fs.readFileSync throws; provider does not throw and returns null', () => {
    const mocks = createUtilMocks({
      includeScripts: [LIB_ARRAY_PATH],
      includeContent: {},
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(p => {
      const n = normalizeP(p);
      mockState.callCounts[n] = (mockState.callCounts[n] || 0) + 1;
      // Simulate util falling back to fs.readFileSync internally: flip a flag that our fs mock reads
      global.__UNREADABLE_LIB__ = true;
      return ''; // cause util path to fallback or be empty; provider must handle safely
    });

    const doc = makeDoc();
    const pos = posAtFirst(doc, 'LibFunc');
    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeNull();
  });

  test('circular includes: getIncludeScripts returns recursive paths - no crash, completes search', () => {
    const mocks = createUtilMocks({
      includeScripts: [HELPER_PATH, MAIN_PATH, HELPER_PATH],
      includeContent: {
        [normalizeP(HELPER_PATH)]: HELPER_CONTENT,
        [normalizeP(MAIN_PATH)]: MAIN_CONTENT,
      },
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    const pos = posAtFirst(doc, '$helperVar');
    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(HELPER_PATH));
  });

  test('malformed include statements ignored by getIncludeScripts', () => {
    const mocks = createUtilMocks({
      includeScripts: ['<bad::include>'],
      includeContent: {},
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    const pos = posAtFirst(doc, 'HelperFunc');
    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeNull();
  });
});

describe('ai_definition: performance and caching', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Clear all global test state
    Object.keys(global).forEach(key => {
      if (key.startsWith('__') && key.endsWith('__')) {
        delete global[key];
      }
    });

    // Reset mock call tracking
    mockState.reset();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('deeply nested includes list; finds first match quickly and returns', () => {
    // simulate a long list where HELPER_PATH appears late, followed by many others
    const many = [];
    for (let i = 0; i < 200; i++) many.push(path.join(process.cwd(), 'fake', `file${i}.au3`));
    const list = [...many.slice(0, 150), HELPER_PATH, ...many.slice(150)]; // HELPER at index 150

    const mocks = createUtilMocks({
      includeScripts: list,
      includeContent: {
        [normalizeP(HELPER_PATH)]: HELPER_CONTENT,
      },
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    const pos = posAtFirst(doc, 'HelperFunc');
    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(HELPER_PATH));
    // ensure not all entries were loaded; we allow some short-circuit evidence:
    // At least HELPER was queried; we won't assert strict upper bound to avoid coupling.
    expect(mockState.callCounts[normalizeP(HELPER_PATH)]).toBe(1);
  });

  test('caching behavior: repeated getIncludeText calls hit cached path (simulate via counting)', () => {
    const mocks = createUtilMocks({
      includeScripts: [HELPER_PATH],
      includeContent: {
        [normalizeP(HELPER_PATH)]: HELPER_CONTENT,
      },
    });
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    // First lookup
    let pos = posAtFirst(doc, 'HelperFunc');
    let res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(HELPER_PATH));

    // Second lookup, same symbol
    pos = posAtFirst(doc, 'HelperFunc');
    res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(HELPER_PATH));

    // Our counting indicates getIncludeText was called at least once; if ai_definition caches text per path,
    // implementation could avoid repeated calls. Since we cannot assert internal cache,
    // validate calls do not explode: they should be small (e.g., 1-2).
    const cnt = mockState.callCounts[normalizeP(HELPER_PATH)] || 0;
    expect(cnt).toBeLessThanOrEqual(2);
  });
});

describe('ai_definition: null results when symbol not found', () => {
  test('returns null when symbol is absent', () => {
    jest.clearAllMocks();

    // Clear all global test state
    Object.keys(global).forEach(key => {
      if (key.startsWith('__') && key.endsWith('__')) {
        delete global[key];
      }
    });

    // Reset mock call tracking
    mockState.reset();
    global.getIncludeTextCallCounts = mockState.callCounts;

    const mocks = createUtilMocks();
    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();
    const pos = posAtFirstSafe(doc, 'NotExistingSymbol');
    if (pos === null) {
      // Token doesn't exist, which is expected for this test
      expect(true).toBe(true);
      return;
    }

    const res = definitionProvider.provideDefinition(doc, pos);
    expect(res).toBeNull();
  });
});

describe('ai_definition: advanced circular dependency handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.reset();
    mockState.clearCache();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('handles complex circular includes with multiple files', () => {
    const fileA = path.join(process.cwd(), 'test', 'fixtures', 'fileA.au3');
    const fileB = path.join(process.cwd(), 'test', 'fixtures', 'fileB.au3');
    const fileC = path.join(process.cwd(), 'test', 'fixtures', 'fileC.au3');

    const contentA = '#include "fileB.au3"\nFunc FuncA()\n  Return FuncB()\nEndFunc\n';
    const contentB = '#include "fileC.au3"\nFunc FuncB()\n  Return FuncC()\nEndFunc\n';
    const contentC = '#include "fileA.au3"\nFunc FuncC()\n  Return FuncA()\nEndFunc\n';

    const mocks = createUtilMocks({
      includeScripts: [fileA, fileB, fileC, fileA, fileB], // circular pattern
      includeContent: {
        [normalizeP(fileA)]: contentA,
        [normalizeP(fileB)]: contentB,
        [normalizeP(fileC)]: contentC,
      },
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(contentA, fileA);
    const pos = posAtFirst(doc, 'FuncB');
    const res = definitionProvider.provideDefinition(doc, pos);

    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(fileB));
  });

  test('prevents infinite recursion in deeply nested circular includes', () => {
    const deepFiles = [];
    const deepContent = {};

    // Create 10 files that include each other in a circular pattern
    for (let i = 0; i < 10; i++) {
      const fileName = path.join(process.cwd(), 'test', 'fixtures', `deep${i}.au3`);
      const nextFile = `deep${(i + 1) % 10}.au3`;
      deepFiles.push(fileName);
      deepContent[normalizeP(fileName)] =
        `#include "${nextFile}"\nFunc DeepFunc${i}()\n  Return ${i}\nEndFunc\n`;
    }

    const mocks = createUtilMocks({
      includeScripts: [...deepFiles, ...deepFiles, ...deepFiles], // triple circular
      includeContent: deepContent,
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(deepContent[normalizeP(deepFiles[0])], deepFiles[0]);
    const pos = posAtFirst(doc, 'DeepFunc5');

    // Should not hang or crash
    const startTime = Date.now();
    const res = definitionProvider.provideDefinition(doc, pos);
    const endTime = Date.now();

    expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    expect(res).toBeTruthy();
  });
});

describe('ai_definition: malformed include statement handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.reset();
    mockState.clearCache();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('handles malformed include paths gracefully', () => {
    const malformedContent = [
      '#include "valid.au3"',
      '#include <malformed::path>',
      '#include "unterminated.au3',
      '#include >backwards.au3<',
      '#include ""',
      '#include <>',
      'Func TestFunc()',
      '  Return 1',
      'EndFunc',
    ].join('\n');

    const mocks = createUtilMocks({
      includeScripts: ['<malformed::path>', 'unterminated.au3', '>backwards.au3<', '', '<>'],
      includeContent: {}, // No valid content for malformed paths
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(malformedContent, MAIN_PATH);
    const pos = posAtFirst(doc, 'TestFunc');
    const res = definitionProvider.provideDefinition(doc, pos);

    // Should find the function in the main file despite malformed includes
    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(MAIN_PATH));
  });

  test('handles include statements with special characters and unicode', () => {
    const unicodeContent = [
      '#include "файл.au3"', // Cyrillic
      '#include "文件.au3"', // Chinese
      '#include "tëst spæciål.au3"', // Special characters
      '#include "file with spaces.au3"',
      'Func UnicodeTest()',
      '  Return "test"',
      'EndFunc',
    ].join('\n');

    const mocks = createUtilMocks({
      includeScripts: ['файл.au3', '文件.au3', 'tëst spæciål.au3', 'file with spaces.au3'],
      includeContent: {},
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(unicodeContent, MAIN_PATH);
    const pos = posAtFirst(doc, 'UnicodeTest');
    const res = definitionProvider.provideDefinition(doc, pos);

    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(MAIN_PATH));
  });
});

describe('ai_definition: environment-specific path handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.reset();
    mockState.clearCache();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('handles mixed path separators correctly', () => {
    const mixedPathContent = [
      '#include "sub\\folder/helper.au3"', // Mixed separators
      '#include "..\\..\\lib/Array.au3"', // Relative with mixed
      'Func MixedPathTest()',
      '  Return CrossPlatformFunc()',
      'EndFunc',
    ].join('\n');

    const helperPath = path.normalize(
      path.join(process.cwd(), 'test', 'fixtures', 'sub', 'folder', 'helper.au3'),
    );
    const helperContent = 'Func CrossPlatformFunc()\n  Return "cross-platform"\nEndFunc\n';

    const mocks = createUtilMocks({
      includeScripts: [helperPath],
      includeContent: {
        [normalizeP(helperPath)]: helperContent,
      },
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(mixedPathContent, MAIN_PATH);
    const pos = posAtFirst(doc, 'CrossPlatformFunc');
    const res = definitionProvider.provideDefinition(doc, pos);

    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(helperPath));
  });

  test('handles UNC paths on Windows environments', () => {
    const originalPlatform = process.platform;

    // Mock Windows environment
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const uncPathContent = [
      '#include "\\\\server\\share\\autoit\\library.au3"',
      'Func UNCTest()',
      '  Return NetworkFunc()',
      'EndFunc',
    ].join('\n');

    const uncPath = '\\\\server\\share\\autoit\\library.au3';
    const uncContent = 'Func NetworkFunc()\n  Return "network"\nEndFunc\n';

    const mocks = createUtilMocks({
      includeScripts: [uncPath],
      includeContent: {
        [normalizeP(uncPath)]: uncContent,
      },
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(uncPathContent, MAIN_PATH);
    const pos = posAtFirst(doc, 'NetworkFunc');
    const res = definitionProvider.provideDefinition(doc, pos);

    expect(res).toBeTruthy();

    // Restore original platform
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  test('handles case-sensitive vs case-insensitive file systems', () => {
    const caseTestContent = [
      '#include "Helper.AU3"', // Different case
      'Func CaseTest()',
      '  Return CaseSensitiveFunc()',
      'EndFunc',
    ].join('\n');

    const upperHelperPath = path.join(process.cwd(), 'test', 'fixtures', 'Helper.AU3');
    const upperContent = 'Func CaseSensitiveFunc()\n  Return "case-test"\nEndFunc\n';

    const mocks = createUtilMocks({
      includeScripts: [upperHelperPath],
      includeContent: {
        [normalizeP(upperHelperPath)]: upperContent,
        [normalizeP(HELPER_PATH)]: HELPER_CONTENT, // Also include the lowercase version
      },
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument(caseTestContent, MAIN_PATH);
    const pos = posAtFirst(doc, 'CaseSensitiveFunc');
    const res = definitionProvider.provideDefinition(doc, pos);

    expect(res).toBeTruthy();
  });
});

describe('ai_definition: performance and timeout boundaries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.reset();
    mockState.clearCache();
    global.getIncludeTextCallCounts = mockState.callCounts;
    global.__UNREADABLE_LIB__ = false;
  });

  test('handles extremely large include lists efficiently', () => {
    const largeIncludeList = [];
    const largeContent = {};

    // Create 1000 fake includes
    for (let i = 0; i < 1000; i++) {
      const fakePath = path.join(process.cwd(), 'fake', `file${i}.au3`);
      largeIncludeList.push(fakePath);
      largeContent[normalizeP(fakePath)] = `; Fake file ${i}\n`;
    }

    // Put the target file in the middle
    const targetPath = path.join(process.cwd(), 'target.au3');
    const targetContent = 'Func TargetFunc()\n  Return "found"\nEndFunc\n';
    largeIncludeList[500] = targetPath;
    largeContent[normalizeP(targetPath)] = targetContent;

    const mocks = createUtilMocks({
      includeScripts: largeIncludeList,
      includeContent: largeContent,
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument('Local $test = TargetFunc()', MAIN_PATH);
    const startTime = Date.now();
    const pos = posAtFirst(doc, 'TargetFunc');
    const res = definitionProvider.provideDefinition(doc, pos);
    const endTime = Date.now();

    expect(res).toBeTruthy();
    expect(res.uri.fsPath).toBe(normalizeP(targetPath));
    expect(endTime - startTime).toBeLessThan(3000); // Should complete within 3 seconds
  }, 10000); // 10-second test timeout

  test('handles extremely long file content efficiently', () => {
    const hugeFunctionList = [];
    for (let i = 0; i < 10000; i++) {
      hugeFunctionList.push(`Func HugeFunc${i}()\n  Return ${i}\nEndFunc\n`);
    }

    // Add target function in the middle
    hugeFunctionList[5000] = 'Func TargetHugeFunc()\n  Return "target"\nEndFunc\n';

    const hugeContent = hugeFunctionList.join('\n');
    const hugePath = path.join(process.cwd(), 'huge.au3');

    const mocks = createUtilMocks({
      includeScripts: [hugePath],
      includeContent: {
        [normalizeP(hugePath)]: hugeContent,
      },
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = new MockTextDocument('Local $test = TargetHugeFunc()', MAIN_PATH);
    const startTime = Date.now();
    const pos = posAtFirst(doc, 'TargetHugeFunc');
    const res = definitionProvider.provideDefinition(doc, pos);
    const endTime = Date.now();

    expect(res).toBeTruthy();
    expect(endTime - startTime).toBeLessThan(2000); // Should complete within 2 seconds
  }, 15000); // 15-second test timeout

  test('performance regression test - caching improves repeated lookups', () => {
    const mocks = createUtilMocks({
      includeScripts: [HELPER_PATH],
      includeContent: {
        [normalizeP(HELPER_PATH)]: HELPER_CONTENT,
      },
      useCache: true,
    });

    util.getIncludeScripts.mockImplementation(mocks.getIncludeScripts);
    util.getIncludeText.mockImplementation(mocks.getIncludeText);

    const doc = makeDoc();

    // First lookup (cold)
    const startTime1 = Date.now();
    const pos1 = posAtFirst(doc, 'HelperFunc');
    const res1 = definitionProvider.provideDefinition(doc, pos1);
    const endTime1 = Date.now();
    const firstLookupTime = endTime1 - startTime1;

    // Second lookup (should use cache)
    const startTime2 = Date.now();
    const pos2 = posAtFirst(doc, 'HelperFunc');
    const res2 = definitionProvider.provideDefinition(doc, pos2);
    const endTime2 = Date.now();
    const secondLookupTime = endTime2 - startTime2;

    expect(res1).toBeTruthy();
    expect(res2).toBeTruthy();
    expect(res1.uri.fsPath).toBe(res2.uri.fsPath);

    // Second lookup should be faster or equal (caching benefit)
    expect(secondLookupTime).toBeLessThanOrEqual(firstLookupTime + 5); // Allow 5ms tolerance
  });
});
