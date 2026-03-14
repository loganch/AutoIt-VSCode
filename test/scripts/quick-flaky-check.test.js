jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

const { execSync } = require('child_process');
const { QuickFlakyCheck } = require('../../scripts/quick-flaky-check.js');

describe('QuickFlakyCheck', () => {
  let logSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it('uses default run and timeout values', () => {
    const checker = new QuickFlakyCheck();

    expect(checker.runs).toBe(3);
    expect(checker.timeout).toBe(15000);
  });

  it('returns true when all runs pass', () => {
    const checker = new QuickFlakyCheck();

    const result = checker.runQuickCheck();

    expect(result).toBe(true);
    expect(execSync).toHaveBeenCalledTimes(3);
    expect(execSync).toHaveBeenCalledWith(
      'npx jest --testTimeout=15000 --runInBand --silent --no-coverage',
      expect.objectContaining({ timeout: 17000, encoding: 'utf8' }),
    );
  });

  it('returns false when a subset of runs fail (potential flaky behavior)', () => {
    const checker = new QuickFlakyCheck();
    execSync
      .mockImplementationOnce(() => 'ok')
      .mockImplementationOnce(() => {
        throw new Error('intermittent failure');
      })
      .mockImplementationOnce(() => 'ok');

    const result = checker.runQuickCheck();

    expect(result).toBe(false);
  });

  it('returns false when all runs fail', () => {
    const checker = new QuickFlakyCheck();
    execSync.mockImplementation(() => {
      throw new Error('persistent failure');
    });

    const result = checker.runQuickCheck();

    expect(result).toBe(false);
  });
});