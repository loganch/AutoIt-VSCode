const mockShowErrorMessage = jest.fn();
const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockGetConfiguration = jest.fn();

jest.mock('vscode', () => ({
  window: {
    showErrorMessage: (...args) => mockShowErrorMessage(...args),
  },
  workspace: {
    getConfiguration: (...args) => mockGetConfiguration(...args),
  },
}));

const {
  config,
  addListener,
  removeListener,
  notifyListeners,
} = require('../../src/config/configStore');

beforeEach(() => {
  mockGet.mockImplementation(key => (key === 'someSetting' ? 'someValue' : undefined));
  mockGetConfiguration.mockImplementation(() => ({
    // Real vscode.WorkspaceConfiguration exposes settings both via get(key)
    // and as direct properties; configStore's pass-through reads the value
    // via direct property access, so the mock must mirror both.
    someSetting: 'someValue',
    get: mockGet,
    update: mockUpdate,
  }));
});

describe('config Proxy get trap', () => {
  test('resolves a single-object defaultPaths entry to its fullPath', () => {
    expect(config.aiPath).toBeUndefined();
  });

  test('resolves an array defaultPaths entry to a list of fullPaths', () => {
    expect(config.includePaths).toEqual([undefined]);
  });

  test('passes through keys not present in defaultPaths to the raw workspace config', () => {
    expect(config.someSetting).toBe('someValue');
  });
});

describe('config Proxy set trap', () => {
  test('forwards a write to workspace.update', () => {
    config.someSetting = 'newValue';
    expect(mockUpdate).toHaveBeenCalledWith('someSetting', 'newValue');
  });
});

describe('notifyListeners', () => {
  test('invokes every registered listener', () => {
    const listenerA = jest.fn();
    const listenerB = jest.fn();
    const idA = addListener(listenerA);
    const idB = addListener(listenerB);

    notifyListeners();

    expect(listenerA).toHaveBeenCalledTimes(1);
    expect(listenerB).toHaveBeenCalledTimes(1);

    removeListener(idA);
    removeListener(idB);
  });

  test('still invokes a second listener when the first one throws', () => {
    const throwingListener = jest.fn(() => {
      throw new Error('boom');
    });
    const workingListener = jest.fn();
    const idA = addListener(throwingListener);
    const idB = addListener(workingListener);

    expect(() => notifyListeners()).not.toThrow();
    expect(throwingListener).toHaveBeenCalledTimes(1);
    expect(workingListener).toHaveBeenCalledTimes(1);

    removeListener(idA);
    removeListener(idB);
  });

  test('removeListener stops a listener from being invoked', () => {
    const listener = jest.fn();
    const id = addListener(listener);
    removeListener(id);

    notifyListeners();

    expect(listener).not.toHaveBeenCalled();
  });
});
