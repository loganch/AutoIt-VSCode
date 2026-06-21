jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const { execSync } = require('child_process');
const fs = require('fs');
const { TestSuiteValidator } = require('../../scripts/validate-test-suite.js');

const DEFAULT_RUNS = 5;
const DEFAULT_TIMEOUT_MS = 45000;
const SHORT_TIMEOUT_MS = 100;
const SHORT_TIMEOUT_WITH_BUFFER_MS = 5100;
const FAILURE_TIMEOUT_MS = 120;
const SUMMARY_RUNS = 3;
const START_TIME_MS = 1000;
const END_TIME_MS = 1300;
const FAILURE_START_TIME_MS = 500;
const FAILURE_END_TIME_MS = 850;
const SUMMARY_END_TIME_MS = 4000;
const SUCCESS_EXECUTION_TIME_MS = 300;
const FAILURE_EXECUTION_TIME_MS = 350;
const SUMMARY_TOTAL_EXECUTION_TIME_MS = 3000;
const AVERAGE_EXECUTION_TIME_MS = 200;
const MIN_EXECUTION_TIME_MS = 100;
const MAX_EXECUTION_TIME_MS = 300;
const AVERAGE_MEMORY_DELTA_MB = 10;
const PASS_RATE_PERCENT = 66.666;
const DECIMAL_PRECISION = 2;
const SECOND_RUN_INDEX = 2;
const SUCCESSFUL_RUNS = 2;
const FAILED_RUNS = 1;

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

    expect(validator.runs).toBe(DEFAULT_RUNS);
    expect(validator.timeout).toBe(DEFAULT_TIMEOUT_MS);
    expect(validator.outputFile).toBe('validation-results.json');
    expect(validator.results).toEqual([]);
  });

  it('captures successful test run result', () => {
    const validator = new TestSuiteValidator({ timeout: SHORT_TIMEOUT_MS });
    jest
      .spyOn(process, 'memoryUsage')
      .mockReturnValueOnce({ heapUsed: 100, heapTotal: 200, external: 50, rss: 1000 })
      .mockReturnValueOnce({ heapUsed: 150, heapTotal: 260, external: 60, rss: 1200 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(START_TIME_MS).mockReturnValueOnce(END_TIME_MS);
    execSync.mockReturnValue('ok');

    const result = validator.runSingleTest(1);

    expect(result.status).toBe('PASSED');
    expect(result.executionTime).toBe(SUCCESS_EXECUTION_TIME_MS);
    expect(result.memoryDelta).toEqual({
      heapUsed: 50,
      heapTotal: 60,
      external: 10,
      rss: 200,
    });
    expect(execSync).toHaveBeenCalledWith(
      `npx jest --testTimeout=${SHORT_TIMEOUT_MS} --runInBand --verbose --no-coverage`,
      expect.objectContaining({ timeout: SHORT_TIMEOUT_WITH_BUFFER_MS }),
    );
  });

  it('captures failed test run result', () => {
    const validator = new TestSuiteValidator({ timeout: FAILURE_TIMEOUT_MS });
    jest
      .spyOn(process, 'memoryUsage')
      .mockReturnValue({ heapUsed: 0, heapTotal: 0, external: 0, rss: 0 });
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(FAILURE_START_TIME_MS)
      .mockReturnValueOnce(FAILURE_END_TIME_MS);

    const error = new Error('failed run');
    error.status = 1;
    error.stdout = 'stdout';
    error.stderr = 'stderr';
    execSync.mockImplementation(() => {
      throw error;
    });

    const result = validator.runSingleTest(SECOND_RUN_INDEX);

    expect(result.status).toBe('FAILED');
    expect(result.executionTime).toBe(FAILURE_EXECUTION_TIME_MS);
    expect(result.error).toEqual(
      expect.objectContaining({
        message: 'failed run',
        stdout: 'stdout',
        stderr: 'stderr',
        code: 1,
      }),
    );
  });

  it('analyzes aggregate results and writes summary output', () => {
    const validator = new TestSuiteValidator({ runs: SUMMARY_RUNS, outputFile: 'summary.json' });
    validator.startTime = START_TIME_MS;
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

    jest.spyOn(Date, 'now').mockReturnValue(SUMMARY_END_TIME_MS);
    jest.spyOn(validator, 'printSummary').mockImplementation(() => {});

    const summary = validator.analyzeResults();

    expect(summary.totalRuns).toBe(SUMMARY_RUNS);
    expect(summary.passedRuns).toBe(SUCCESSFUL_RUNS);
    expect(summary.failedRuns).toBe(FAILED_RUNS);
    expect(summary.passRate).toBeCloseTo(PASS_RATE_PERCENT, DECIMAL_PRECISION);
    expect(summary.totalExecutionTime).toBe(SUMMARY_TOTAL_EXECUTION_TIME_MS);
    expect(summary.averageExecutionTime).toBe(AVERAGE_EXECUTION_TIME_MS);
    expect(summary.minExecutionTime).toBe(MIN_EXECUTION_TIME_MS);
    expect(summary.maxExecutionTime).toBe(MAX_EXECUTION_TIME_MS);
    expect(summary.averageMemoryDelta).toBe(AVERAGE_MEMORY_DELTA_MB);
    expect(summary.isReliable).toBe(false);
    expect(summary.isPerformant).toBe(true);

    expect(fs.writeFileSync).toHaveBeenCalledWith('summary.json', expect.any(String));
  });
});
