const mockShowErrorMessage = jest.fn();

jest.mock('vscode', () => ({
  window: {
    showErrorMessage: (...args) => mockShowErrorMessage(...args),
    get activeTextEditor() {
      return global.__mockActiveEditor;
    },
  },
  Range: class Range {
    constructor(start, end) {
      this.start = start;
      this.end = end;
    }
  },
}));

const searchAndReplace = require('../../src/commands/commandUtils.js').default;

function makeEditor(text) {
  const replace = jest.fn();
  const document = {
    getText: () => text,
    positionAt: offset => ({ offset }),
  };
  const editor = {
    document,
    edit: cb => {
      cb({ replace });
      return Promise.resolve(true);
    },
  };
  return { editor, replace };
}

describe('searchAndReplace', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.__mockActiveEditor = null;
  });

  afterAll(() => {
    delete global.__mockActiveEditor;
  });

  test('returns 0 and shows error when no active editor', async () => {
    global.__mockActiveEditor = null;

    const result = await searchAndReplace(/foo/g);

    expect(result).toBe(0);
    expect(mockShowErrorMessage).toHaveBeenCalledWith('No active editor');
  });

  test('returns 0 when pattern does not match', async () => {
    const { editor } = makeEditor('hello world');
    global.__mockActiveEditor = editor;

    const result = await searchAndReplace(/xyz/g);

    expect(result).toBe(0);
  });

  test('replaces matches and returns match count', async () => {
    const { editor, replace } = makeEditor('foo bar foo');
    global.__mockActiveEditor = editor;

    const result = await searchAndReplace(/foo/g, 'baz');

    expect(result).toBe(2);
    expect(replace).toHaveBeenCalledTimes(1);
    const [, replacedText] = replace.mock.calls[0];
    expect(replacedText).toBe('baz bar baz');
  });

  test('uses CRLF as default replacement', async () => {
    const { editor, replace } = makeEditor('foo');
    global.__mockActiveEditor = editor;

    await searchAndReplace(/foo/g);

    expect(replace).toHaveBeenCalledTimes(1);
    const [, replacedText] = replace.mock.calls[0];
    expect(replacedText).toBe('\r\n');
  });
});
