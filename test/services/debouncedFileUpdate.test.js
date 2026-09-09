jest.mock('vscode', () => ({}));

import updateFileDebounced from '../../src/services/debouncedFileUpdate';

describe('updateFileDebounced', () => {
  let service;
  let parseCalls;

  beforeEach(() => {
    jest.useFakeTimers();
    parseCalls = [];
    service = {
      parseDebounceMs: 100,
      debouncedParseByFile: new Map(),
      pendingParses: new Map(),
      _parseFile: (path, src) => parseCalls.push([path, src]),
    };
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('registers a single debounced parser per file and records the pending parse', () => {
    updateFileDebounced(service, 'C:\\a.au3', 'v1');
    updateFileDebounced(service, 'C:\\a.au3', 'v2');

    expect(service.debouncedParseByFile.size).toBe(1);
    expect(typeof service.debouncedParseByFile.get('C:\\a.au3').cancel).toBe('function');
    expect(service.pendingParses.get('C:\\a.au3').source).toBe('v2');
  });

  test('parses only the latest source after the debounce window', () => {
    updateFileDebounced(service, 'C:\\a.au3', 'v1');
    updateFileDebounced(service, 'C:\\a.au3', 'v2');

    jest.advanceTimersByTime(100);

    expect(parseCalls).toEqual([['C:\\a.au3', 'v2']]);
  });

  test('does not parse before the debounce window elapses', () => {
    updateFileDebounced(service, 'C:\\a.au3', 'v1');

    jest.advanceTimersByTime(50);

    expect(parseCalls).toEqual([]);
  });

  test('keeps independent debounce timers per file', () => {
    updateFileDebounced(service, 'C:\\a.au3', 'a-src');
    updateFileDebounced(service, 'C:\\b.au3', 'b-src');

    jest.advanceTimersByTime(100);

    expect(parseCalls).toEqual([
      ['C:\\a.au3', 'a-src'],
      ['C:\\b.au3', 'b-src'],
    ]);
  });

  test('cancel prevents the pending parse from running', () => {
    updateFileDebounced(service, 'C:\\a.au3', 'v1');
    service.debouncedParseByFile.get('C:\\a.au3').cancel();

    jest.advanceTimersByTime(200);

    expect(parseCalls).toEqual([]);
  });
});
