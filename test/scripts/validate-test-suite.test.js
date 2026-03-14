jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const { execSync } = require('child_process');
const fs = require('fs');
const { TestSuiteValidator } = require('../../scripts/validate-test-suite.js');

describe('TestSuiteValidator', () => {
  let logSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('applies default options in constructor', () => {
    const validator = new TestSuiteValidator();

    expect(validator.runs).toBe(5);
    expect(validator.timeout).toBe(45000);
    expect(validator.outputFile).toBe('validation-results.json');
    expect(validator.results).toEqual([]);
  });

  it('captures successful test run result', () => {
    const validator = new TestSuiteValidator({ timeout: 100 });
    jest.spyOn(process, 'memoryUsage')
      .mockReturnValueOnce({ heapUsed: 100, heapTotal: 200, external: 50, rss: 1000 })
      .mockReturnValueOnce({ heapUsed: 150, heapTotal: 260, external: 60, rss: 1200 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1300);
    execSync.mockReturnValue('ok');

    const result = validator.runSingleTest(1);

    expect(result.status).toBe('PASSED');
    expect(result.executionTime).toBe(300);
    expect(result.memoryDelta).toEqual({
      heapUsed: 50,
      heapTotal: 60,
      external: 10,
      rss: 200,
    });
    expect(execSync).toHaveBeenCalledWith(
      'npx jest --testTimeout=100 --runInBand --verbose --no-coverage',
      expect.objectContaining({ timeout: 5100 }),
    );
  });

  it('captures failed test run result', () => {
    const validator = new TestSuiteValidator({ timeout: 120 });
    jest.spyOn(process, 'memoryUsage').mockReturnValue({ heapUsed: 0, heapTotal: 0, external: 0, rss: 0 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(500).mockReturnValueOnce(850);

    const error = new Error('failed run');
    error.status = 1;
    error.stdout = 'stdout';
    error.stderr = 'stderr';
    execSync.mockImplementation(() => {
      throw error;
    });

    const result = validator.runSingleTest(2);

    expect(result.status).toBe('FAILED');
    expect(result.executionTime).toBe(350);
    expect(result.error).toEqual(
      expect.objectContaining({ message: 'failed run', stdout: 'stdout', stderr: 'stderr', code: 1 }),
    );
  });

  it('analyzes aggregate results and writes summary output', () => {
    const validator = new TestSuiteValidator({ runs: 3, outputFile: 'summary.json' });
    validator.startTime = 1000;
    validator.results = [
      {
        run: 1,
        status: 'PASSED',
        executionTime: 100,
        memoryDelta: { heapUsed: 5, heapTotal: 0, external: 0, rss: 0 },
      },
      {
        run: 2,
        status: 'PASSED',
        executionTime: 200,
        memoryDelta: { heapUsed: 15, heapTotal: 0, external: 0, rss: 0 },
      },
      {
        run: 3,
        status: 'FAILED',
        executionTime: 300,
      },
    ];

    jest.spyOn(Date, 'now').mockReturnValue(4000);
    jest.spyOn(validator, 'printSummary').mockImplementation(() => {});

    const summary = validator.analyzeResults();

    expect(summary.totalRuns).toBe(3);
    expect(summary.passedRuns).toBe(2);
    expect(summary.failedRuns).toBe(1);
    expect(summary.passRate).toBeCloseTo(66.666, 2);
    expect(summary.totalExecutionTime).toBe(3000);
    expect(summary.averageExecutionTime).toBe(200);
    expect(summary.minExecutionTime).toBe(100);
    expect(summary.maxExecutionTime).toBe(300);
    expect(summary.averageMemoryDelta).toBe(10);
    expect(summary.isReliable).toBe(false);
    expect(summary.isPerformant).toBe(true);

    expect(fs.writeFileSync).toHaveBeenCalledWith('summary.json', expect.any(String));
  });
});