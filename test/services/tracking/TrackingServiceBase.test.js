jest.mock('vscode', () => ({}));

import fs from 'fs';
import TrackingServiceBase from '../../../src/services/tracking/TrackingServiceBase';
import IncludeResolver from '../../../src/language/include.js';

class MinimalTracker extends TrackingServiceBase {
  createParser(source) {
    return { lines: source.split('\n') };
  }
}

describe('TrackingServiceBase', () => {
  let service;

  beforeEach(() => {
    MinimalTracker.resetInstance();
    service = MinimalTracker.getInstance({
      workspaceRoot: '/ws',
      autoitIncludePaths: [],
      maxIncludeDepth: 3,
    });
  });

  afterEach(() => {
    MinimalTracker.resetInstance();
    jest.restoreAllMocks();
  });

  test('returns the same singleton per subclass', () => {
    expect(MinimalTracker.getInstance()).toBe(service);
  });

  test('keeps separate singletons for different subclasses', () => {
    class OtherTracker extends TrackingServiceBase {
      createParser(source) {
        return { lines: source.split('\n') };
      }
    }
    const other = OtherTracker.getInstance({ workspaceRoot: '/ws' });
    expect(other).not.toBe(service);
    OtherTracker.resetInstance();
  });

  test('createParser must be implemented by subclasses', () => {
    class NoParser extends TrackingServiceBase {}
    NoParser.resetInstance();
    expect(() => NoParser.getInstance().updateFile('a.au3', 'x')).toThrow(
      'createParser must be implemented by subclass',
    );
    NoParser.resetInstance();
  });

  test('updateFile caches the parser for the file', () => {
    service.updateFile('C:\\a.au3', 'line1\nline2');
    expect(service.fileParsers.get('C:\\a.au3')).toEqual({
      lines: ['line1', 'line2'],
    });
  });

  test('updateFileImmediate cancels pending debounced parse and parses synchronously', () => {
    const cancel = jest.fn();
    service.debouncedParseByFile.set('C:\\a.au3', { cancel });
    service.updateFileImmediate('C:\\a.au3', 'src');
    expect(cancel).toHaveBeenCalled();
    expect(service.fileParsers.has('C:\\a.au3')).toBe(true);
    expect(service.pendingParses.has('C:\\a.au3')).toBe(false);
  });

  test('_parseFile re-queues the latest source when a parse is ongoing', () => {
    service.ongoingParses.add('C:\\a.au3');
    service._parseFile('C:\\a.au3', 'first');
    expect(service.fileParsers.has('C:\\a.au3')).toBe(false);
    expect(service.latestQueuedSource.get('C:\\a.au3')).toBe('first');
  });

  test('removeFile cancels debounced timers and clears all per-file state', () => {
    const cancel = jest.fn();
    service.fileParsers.set('C:\\a.au3', { lines: [] });
    service.debouncedParseByFile.set('C:\\a.au3', { cancel });
    service.pendingParses.set('C:\\a.au3', { source: 'x', timestamp: 0 });
    service.latestQueuedSource.set('C:\\a.au3', 'x');

    service.removeFile('C:\\a.au3');

    expect(cancel).toHaveBeenCalled();
    expect(service.fileParsers.has('C:\\a.au3')).toBe(false);
    expect(service.debouncedParseByFile.has('C:\\a.au3')).toBe(false);
    expect(service.pendingParses.has('C:\\a.au3')).toBe(false);
    expect(service.latestQueuedSource.has('C:\\a.au3')).toBe(false);
  });

  test('removeFile clears numeric (legacy) debounce timers', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');
    service.debouncedParseByFile.set('C:\\a.au3', 12345);

    service.removeFile('C:\\a.au3');

    expect(clearTimeoutSpy).toHaveBeenCalledWith(12345);
  });

  test('clear resets all cached state', () => {
    service.fileParsers.set('C:\\a.au3', { lines: [] });
    service.pendingParses.set('C:\\b.au3', { source: 'x', timestamp: 0 });
    service.ongoingParses.add('C:\\c.au3');

    service.clear();

    expect(service.fileParsers.size).toBe(0);
    expect(service.pendingParses.size).toBe(0);
    expect(service.ongoingParses.size).toBe(0);
  });

  test('updateConfiguration swaps the resolver and clears cached state', () => {
    service.fileParsers.set('C:\\a.au3', { lines: [] });
    const originalResolver = service.includeResolver;

    service.updateConfiguration('/other', ['C:\\includes'], 5);

    expect(service.workspaceRoot).toBe('/other');
    expect(service.includeResolver).not.toBe(originalResolver);
    expect(service.includeResolver.autoitIncludePaths).toEqual(['C:\\includes']);
    expect(service.includeResolver.maxDepth).toBe(5);
    expect(service.fileParsers.size).toBe(0);
  });

  test('getInstance throws when called with different parameters', () => {
    expect(() => MinimalTracker.getInstance({ workspaceRoot: '/different' })).toThrow(
      /getInstance called with different parameters/,
    );
  });

  test('_ensureIncludedFilesParsed reads and caches uncached includes', async () => {
    const readFileSpy = jest.spyOn(fs.promises, 'readFile').mockResolvedValue('included source');
    jest.spyOn(service.includeResolver, 'resolveAllIncludes').mockReturnValue(['C:\\inc.au3']);

    const parsed = await service._ensureIncludedFilesParsed('C:\\main.au3');

    expect(parsed).toEqual(['C:\\inc.au3']);
    expect(service.fileParsers.get('C:\\inc.au3')).toEqual({
      lines: ['included source'],
    });
    expect(readFileSpy).toHaveBeenCalledWith('C:\\inc.au3', 'utf8');
  });

  test('_ensureIncludedFilesParsed skips unreadable includes', async () => {
    jest.spyOn(fs.promises, 'readFile').mockRejectedValue(new Error('ENOENT'));
    jest.spyOn(service.includeResolver, 'resolveAllIncludes').mockReturnValue(['C:\\missing.au3']);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const parsed = await service._ensureIncludedFilesParsed('C:\\main.au3');

    expect(parsed).toEqual([]);
    expect(errorSpy).toHaveBeenCalled();
  });

  test('_ensureIncludedFilesParsed does not re-read cached includes', async () => {
    const readFileSpy = jest.spyOn(fs.promises, 'readFile');
    service.fileParsers.set('C:\\inc.au3', { lines: ['cached'] });
    jest.spyOn(service.includeResolver, 'resolveAllIncludes').mockReturnValue(['C:\\inc.au3']);

    const parsed = await service._ensureIncludedFilesParsed('C:\\main.au3');

    expect(parsed).toEqual(['C:\\inc.au3']);
    expect(readFileSpy).not.toHaveBeenCalled();
  });

  test('constructor wires the IncludeResolver with the given config', () => {
    expect(service.includeResolver).toBeInstanceOf(IncludeResolver);
    expect(service.includeResolver.maxDepth).toBe(3);
  });
});
