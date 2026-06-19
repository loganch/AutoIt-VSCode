/** @type {jest.Mock} */
const mockRegisterHoverProvider = jest.fn(() => ({ dispose: jest.fn() }));
/** @type {jest.Mock} */
const mockRegisterSignatureHelpProvider = jest.fn(() => ({ dispose: jest.fn() }));
/** @type {jest.Mock} */
const mockFindFilepath = jest.fn(() => false);
/** @type {jest.Mock} */
const mockGetIncludeData = jest.fn(() => ({}));
/** @type {jest.Mock} */
const mockBuildFunctionSignature = jest.fn();

class MockMarkdownString {
  constructor(value) {
    this.value = value;
  }
}

class MockParameterInformation {
  constructor(label, documentation) {
    this.label = label;
    this.documentation = documentation;
  }
}

class MockSignatureInformation {
  constructor(label, documentation) {
    this.label = label;
    this.documentation = documentation;
    this.parameters = [];
  }
}

class MockSignatureHelp {
  constructor() {
    this.signatures = [];
    this.activeSignature = 0;
    this.activeParameter = 0;
  }
}

jest.mock('vscode', () => ({
  Hover: class Hover {
    constructor(contents) {
      this.contents = contents;
    }
  },
  MarkdownString: MockMarkdownString,
  ParameterInformation: MockParameterInformation,
  SignatureHelp: MockSignatureHelp,
  SignatureInformation: MockSignatureInformation,
  languages: {
    registerHoverProvider: mockRegisterHoverProvider,
    registerSignatureHelpProvider: mockRegisterSignatureHelpProvider,
  },
}));

jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit' },
  buildFunctionSignature: mockBuildFunctionSignature,
  findFilepath: mockFindFilepath,
  functionDefinitionRegex: /^\s*(Func)\s+([^\s(]+)\s*\(([^)]*)\)/gim,
  getIncludeData: mockGetIncludeData,
  includePattern: /#include\s+"([^"]+)"/gim,
  libraryIncludePattern: /#include\s+<([^>]+)>/gim,
}));

jest.mock('../src/constants', () => ({
  DEFAULT_UDFS: [],
}));

jest.mock('../src/signatures', () => ({
  __esModule: true,
  default: {
    MyFunc: {
      label: 'MyFunc($a, $b)',
      documentation: 'Description\rDetails',
      params: [
        { label: '$a', documentation: 'arg a' },
        { label: '$b', documentation: 'arg b' },
      ],
    },
  },
}));

describe('ai_signature', () => {
  let signatureModule;
  let signatureProvider;
  let hoverProvider;

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    signatureModule = require('../src/providers/ai_signature');
    hoverProvider = mockRegisterHoverProvider.mock.calls[0]?.[1] ?? null;
    signatureProvider = mockRegisterSignatureHelpProvider.mock.calls[0]?.[1] ?? null;
  });

  test('registers hover and signature help providers', () => {
    expect(hoverProvider).toEqual(expect.objectContaining({ provideHover: expect.any(Function) }));
    expect(signatureProvider).toEqual(
      expect.objectContaining({ provideSignatureHelp: expect.any(Function) }),
    );
    expect(signatureModule.default).toBeDefined();
    expect(signatureModule.signatureHoverProvider).toBeDefined();
  });

  test('provideSignatureHelp returns null when no callable function is found', () => {
    const document = {
      getText: jest.fn(() => ''),
      lineAt: jest.fn(() => ({ text: 'Local $x = 1' })),
    };

    const result = signatureProvider.provideSignatureHelp(document, { line: 0, character: 10 });
    expect(result).toBeNull();
  });

  test('provideSignatureHelp returns signature details for known function', () => {
    const document = {
      fileName: 'C:\\workspace\\test.au3',
      getText: jest.fn(() => ''),
      lineAt: jest.fn(() => ({ text: 'MyFunc($a, $b' })),
    };

    const result = signatureProvider.provideSignatureHelp(document, { line: 0, character: 13 });

    expect(result).toBeDefined();
    expect(result.signatures).toHaveLength(1);
    expect(result.signatures[0].label).toBe('MyFunc($a, $b)');
    expect(result.activeSignature).toBe(0);
    expect(result.activeParameter).toBe(1);
  });

  test('provideHover returns null for unknown hovered word', () => {
    const document = {
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: 3 })),
      getText: jest.fn(() => 'abc'),
      fileName: 'C:\\workspace\\test.au3',
      lineAt: jest.fn(() => ({ text: '' })),
    };

    const result = hoverProvider.provideHover(document, { line: 0, character: 0 });
    expect(result).toBeNull();
  });

  describe('signature caching', () => {
    const position = { line: 0, character: 0 };
    const expectedReparseCalls = 2;

    const createDoc = ({ uri, version, text, word }) => ({
      uri: { toString: () => uri },
      version,
      fileName: uri,
      getText: jest.fn(range => (range === undefined ? text : word)),
      getWordRangeAtPosition: jest.fn(() => ({ start: 0, end: word.length })),
      lineAt: jest.fn(() => ({ text: '' })),
    });

    const libSignature = name => ({
      label: `${name}()`,
      documentation: `${name} docs\rIncluded from MyLib.au3`,
      params: {},
    });

    const mockLocalFunctionParsing = () => {
      mockBuildFunctionSignature.mockImplementation(match => ({
        functionName: match[2],
        functionObject: {
          label: `${match[2]}()`,
          documentation: `${match[2]} docs\rLocal function`,
          params: {},
        },
      }));
      return mockBuildFunctionSignature;
    };

    test('parses library includes once for repeated hovers on an unchanged document', () => {
      mockFindFilepath.mockImplementation(() => '/lib/MyLib.au3');
      mockGetIncludeData.mockImplementation(() => ({ LibFunc: libSignature('LibFunc') }));

      const doc = createDoc({
        uri: 'file:///caching-repeated-hover.au3',
        version: 1,
        text: '#include <MyLib.au3>\n',
        word: 'LibFunc',
      });

      expect(hoverProvider.provideHover(doc, position)).not.toBeNull();
      expect(hoverProvider.provideHover(doc, position)).not.toBeNull();
      expect(mockGetIncludeData).toHaveBeenCalledTimes(1);
    });

    test('parses local functions once for repeated hovers on an unchanged document', () => {
      const buildFunctionSignature = mockLocalFunctionParsing();

      const doc = createDoc({
        uri: 'file:///caching-local-functions.au3',
        version: 1,
        text: 'Func MyLocal($a)\nEndFunc\n',
        word: 'MyLocal',
      });

      expect(hoverProvider.provideHover(doc, position)).not.toBeNull();
      expect(hoverProvider.provideHover(doc, position)).not.toBeNull();
      expect(buildFunctionSignature).toHaveBeenCalledTimes(1);
    });

    test('re-parses local functions when the document version changes', () => {
      const buildFunctionSignature = mockLocalFunctionParsing();
      const uri = 'file:///caching-version-bump.au3';

      const docV1 = createDoc({
        uri,
        version: 1,
        text: 'Func FirstFunc()\nEndFunc\n',
        word: 'FirstFunc',
      });
      expect(hoverProvider.provideHover(docV1, position)).not.toBeNull();
      expect(buildFunctionSignature).toHaveBeenCalledTimes(1);

      buildFunctionSignature.mockClear();

      const docV2 = createDoc({
        uri,
        version: 2,
        text: 'Func FirstFunc()\nEndFunc\nFunc SecondFunc()\nEndFunc\n',
        word: 'SecondFunc',
      });
      expect(hoverProvider.provideHover(docV2, position)).not.toBeNull();
      expect(buildFunctionSignature).toHaveBeenCalledTimes(expectedReparseCalls);
    });

    test('reuses include data across version changes when the include list is unchanged', () => {
      mockFindFilepath.mockImplementation(() => '/lib/MyLib.au3');
      mockGetIncludeData.mockImplementation(() => ({ LibFunc: libSignature('LibFunc') }));
      const uri = 'file:///caching-stable-includes.au3';

      const docV1 = createDoc({
        uri,
        version: 1,
        text: '#include <MyLib.au3>\n',
        word: 'LibFunc',
      });
      expect(hoverProvider.provideHover(docV1, position)).not.toBeNull();

      const docV2 = createDoc({
        uri,
        version: 2,
        text: '#include <MyLib.au3>\n; a new comment\n',
        word: 'LibFunc',
      });
      expect(hoverProvider.provideHover(docV2, position)).not.toBeNull();
      expect(mockGetIncludeData).toHaveBeenCalledTimes(1);
    });

    test('re-parses includes when the include list changes', () => {
      mockFindFilepath.mockImplementation(fileName => `/lib/${fileName}`);
      mockGetIncludeData.mockImplementation(fullPath =>
        fullPath.includes('OtherLib')
          ? { OtherFunc: libSignature('OtherFunc') }
          : { LibFunc: libSignature('LibFunc') },
      );
      const uri = 'file:///caching-changed-includes.au3';

      const docV1 = createDoc({
        uri,
        version: 1,
        text: '#include <MyLib.au3>\n',
        word: 'LibFunc',
      });
      expect(hoverProvider.provideHover(docV1, position)).not.toBeNull();

      const docV2 = createDoc({
        uri,
        version: 2,
        text: '#include <MyLib.au3>\n#include <OtherLib.au3>\n',
        word: 'OtherFunc',
      });
      expect(hoverProvider.provideHover(docV2, position)).not.toBeNull();
    });
  });
});
