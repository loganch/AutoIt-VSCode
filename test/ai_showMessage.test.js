jest.mock('vscode', () => ({
  window: {
    showInformationMessage: jest.fn(() => Promise.resolve('info')),
    showErrorMessage: jest.fn(() => Promise.resolve('error')),
    showWarningMessage: jest.fn(() => Promise.resolve('warn')),
  },
}));

describe('ai_showMessage', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('exports message helpers and messages object', () => {
    const mod = require('../src/ai_showMessage');

    expect(typeof mod.showInformationMessage).toBe('function');
    expect(typeof mod.showErrorMessage).toBe('function');
    expect(typeof mod.showWarningMessage).toBe('function');
    expect(mod.messages).toEqual(expect.objectContaining({ error: {}, info: {} }));
  });

  it('returns a handle with hide, isHidden, and message promise', async () => {
    const mod = require('../src/ai_showMessage');
    const handle = mod.showInformationMessage('Hello world');

    expect(handle.isHidden).toBe(false);
    expect(typeof handle.hide).toBe('function');
    expect(handle.message).toBeInstanceOf(Promise);

    jest.runAllTimers();
    await expect(handle.message).resolves.toBe('info');
  });

  it('supports timeout option and hides message after the timeout', () => {
    const mod = require('../src/ai_showMessage');
    const handle = mod.showErrorMessage('Boom', { timeout: 10 });

    jest.advanceTimersByTime(10);

    expect(handle.isHidden).toBe(true);
  });
});
