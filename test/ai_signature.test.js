const mockRegisterHoverProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockRegisterSignatureHelpProvider = jest.fn(() => ({ dispose: jest.fn() }));
const mockFindFilepath = jest.fn(() => false);
const mockGetIncludeData = jest.fn(() => ({}));

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
    registerHoverProvider: (...args) => mockRegisterHoverProvider(...args),
    registerSignatureHelpProvider: (...args) => mockRegisterSignatureHelpProvider(...args),
  },
}));

jest.mock('../src/util', () => ({
  AUTOIT_MODE: { language: 'autoit' },
  buildFunctionSignature: jest.fn(),
  findFilepath: (...args) => mockFindFilepath(...args),
  functionDefinitionRegex: /^\s*(Func)\s+([^\s(]+)\s*\(([^)]*)\)/gim,
  getIncludeData: (...args) => mockGetIncludeData(...args),
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

  beforeAll(() => {
    signatureModule = require('../src/ai_signature');
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
});
