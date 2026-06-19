// test/services/symbolWarmup.test.js
jest.mock('vscode', () => ({
  Location: class Location {
    constructor(uri, range) {
      this.uri = uri;
      this.range = range;
    }
  },
  Uri: { file: p => ({ fsPath: p, toString: () => `file://${p}` }) },
  SymbolKind: { Function: 11, Variable: 12, Constant: 13, Enum: 9, Key: 19 },
  SymbolInformation: class SymbolInformation {
    constructor(name, kind, containerName, location) {
      this.name = name;
      this.kind = kind;
      this.containerName = containerName;
      this.location = location;
    }
  },
  workspace: {
    findFiles: jest.fn(() => Promise.resolve([])),
    openTextDocument: jest.fn(),
    getConfiguration: jest.fn(() => ({ get: (_k, d) => d })),
  },
  window: {
    showWarningMessage: jest.fn(),
  },
}));

// symbolWarmup imports indexDocument from symbolIndex, which in turn imports
// provideDocumentSymbols from ai_symbols and getIncludePath from util; mock
// both so their real (vscode-heavy) module side-effects never load.
jest.mock('../../src/providers/ai_symbols', () => ({
  __esModule: true,
  provideDocumentSymbols: jest.fn(() => Promise.resolve([])),
}));
jest.mock('../../src/util', () => ({
  getIncludePath: jest.fn(() => ''),
  isVariableDeclarationLine: () => false,
}));

const index = require('../../src/services/symbolWarmup');

describe('symbolWarmup.ensureWarm', () => {
  beforeEach(() => index.__resetForTests());

  it('runs the build at most once across repeated calls', async () => {
    const build = jest.fn(() => Promise.resolve());
    index.__setBuilderForTests(build);
    index.ensureWarm();
    index.ensureWarm();
    await Promise.resolve();
    expect(build).toHaveBeenCalledTimes(1);
  });

  it('retries the build after a failure resets state to cold', async () => {
    const errSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const failing = jest.fn(() => Promise.reject(new Error('boom')));
      index.__setBuilderForTests(failing);
      await index.ensureWarm(); // first attempt fails, resets to cold
      expect(index.isWarm()).toBe(false);

      const succeeding = jest.fn(() => Promise.resolve());
      index.__setBuilderForTests(succeeding);
      await index.ensureWarm(); // should retry since state went back to cold
      expect(succeeding).toHaveBeenCalledTimes(1);
      expect(index.isWarm()).toBe(true);
    } finally {
      errSpy.mockRestore();
    }
  });

  it('does not rebuild once warm', async () => {
    const build = jest.fn(() => Promise.resolve());
    index.__setBuilderForTests(build);
    await index.ensureWarm();
    expect(index.isWarm()).toBe(true);
    await index.ensureWarm(); // already warm — no rebuild
    expect(build).toHaveBeenCalledTimes(1);
  });

  it('coalesces concurrent callers onto the same promise', async () => {
    let resolveBuild;
    const build = jest.fn(
      () =>
        new Promise(r => {
          resolveBuild = r;
        }),
    );
    index.__setBuilderForTests(build);
    const p1 = index.ensureWarm();
    const p2 = index.ensureWarm();
    expect(p1).toBe(p2); // same in-flight promise
    await Promise.resolve(); // let the queued builder() microtask run
    expect(build).toHaveBeenCalledTimes(1);
    resolveBuild();
  });
});
