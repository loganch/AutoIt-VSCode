const path = require('path');

const mockExistsSync = jest.fn();
const mockReadFileSync = jest.fn();
const mockStatSync = jest.fn(() => ({ mtimeMs: 1, isFile: () => true }));

const normalizedEndsWith = (inputPath, suffix) =>
  path.normalize(inputPath).toLowerCase().endsWith(path.normalize(suffix).toLowerCase());

jest.mock('fs', () => ({
  existsSync: (...args) => mockExistsSync(...args),
  readFileSync: (...args) => mockReadFileSync(...args),
  statSync: (...args) => mockStatSync(...args),
}));

const { getIncludeText, normalizePath } = require('../../src/utils/fsCache');

describe('fsCache', () => {
  const fixturesDir = path.join(process.cwd(), 'fixtures');
  const helperPath = path.join(fixturesDir, 'helper.au3');

  beforeEach(() => {
    jest.clearAllMocks();
    mockStatSync.mockImplementation(() => ({ mtimeMs: 1, isFile: () => true }));
    mockExistsSync.mockImplementation(filePath => normalizedEndsWith(filePath, helperPath));
    mockReadFileSync.mockImplementation(() => '#include "nested.au3"');
  });

  test('normalizePath returns an absolute path', () => {
    const normalized = normalizePath(path.join('fixtures', 'helper.au3'));

    expect(path.isAbsolute(normalized)).toBe(true);
    expect(path.basename(normalized)).toBe('helper.au3');
  });

  test('getIncludeText reads and caches AutoIt include files', () => {
    const firstRead = getIncludeText(helperPath);
    const secondRead = getIncludeText(helperPath);

    expect(firstRead).toContain('nested.au3');
    expect(secondRead).toBe(firstRead);
    expect(mockReadFileSync).toHaveBeenCalledTimes(1);
  });
});
