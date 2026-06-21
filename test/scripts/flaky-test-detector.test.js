jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const { execSync } = require('child_process');
const fs = require('fs');
const { FlakyTestDetector } = require('../../scripts/flaky-test-detector.js');

const DEFAULT_RUNS = 10;
const DEFAULT_TIMEOUT_MS = 30000;
const SHORT_TIMEOUT_MS = 50;
const SHORT_TIMEOUT_WITH_BUFFER_MS = 5050;
const FAILURE_TIMEOUT_MS = 25;
const FAILURE_TIMEOUT_WITH_BUFFER_MS = 5025;
const ANALYSIS_RUNS = 4;
const LEAK_DETECTION_RUNS = 5;
const START_TIME_MS = 1000;
const END_TIME_MS = 1150;
const FAILURE_START_TIME_MS = 2000;
const FAILURE_END_TIME_MS = 2250;
const SUCCESS_EXECUTION_TIME_MS = 150;
const FAILURE_EXECUTION_TIME_MS = 250;
const SUCCESS_RATE_PERCENT = 50;
const PASSED_ITERATIONS = 2;
const FAILED_ITERATIONS = 2;
const NON_EMPTY_LENGTH = 0;

describe('FlakyTestDetector', () => {
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

  it('applies default constructor options', () => {
    const detector = new FlakyTestDetector();

    expect(detector.runs).toBe(DEFAULT_RUNS);
    expect(detector.timeout).toBe(DEFAULT_TIMEOUT_MS);
    expect(detector.outputFile).toBe('flaky-test-results.json');
    expect(detector.testPattern).toBe('');
    expect(detector.results).toEqual([]);
  });

  it('records a passed iteration when jest command succeeds', () => {
    const detector = new FlakyTestDetector({ runs: 1, timeout: SHORT_TIMEOUT_MS });
    jest
      .spyOn(process, 'memoryUsage')
      .mockReturnValueOnce({ heapUsed: 100, rss: 1000 })
      .mockReturnValueOnce({ heapUsed: 220, rss: 1500 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(START_TIME_MS).mockReturnValueOnce(END_TIME_MS);

    const result = detector.runTestIteration(1);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining(
        `npx jest --testTimeout=${SHORT_TIMEOUT_MS} --runInBand --verbose --no-coverage`,
      ),
      expect.objectContaining({ timeout: SHORT_TIMEOUT_WITH_BUFFER_MS }),
    );
    expect(result.status).toBe('PASSED');
    expect(result.executionTime).toBe(SUCCESS_EXECUTION_TIME_MS);
    expect(result.memoryUsage).toEqual({ heapUsed: 120, rss: 500 });
    expect(detector.results).toHaveLength(1);
  });

  it('records a failed iteration when jest command throws', () => {
    const detector = new FlakyTestDetector({
      runs: 1,
      timeout: FAILURE_TIMEOUT_MS,
      testPattern: 'critical test',
    });
    jest.spyOn(process, 'memoryUsage').mockReturnValue({ heapUsed: 100, rss: 1000 });
    jest
      .spyOn(Date, 'now')
      .mockReturnValueOnce(FAILURE_START_TIME_MS)
      .mockReturnValueOnce(FAILURE_END_TIME_MS);

    const commandError = new Error('Test command failed');
    commandError.status = 1;
    commandError.stdout = Buffer.from('stdout output');
    commandError.stderr = Buffer.from('stderr output');
    execSync.mockImplementation(() => {
      throw commandError;
    });

    const result = detector.runTestIteration(1);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('--testNamePattern="critical test"'),
      expect.objectContaining({ timeout: FAILURE_TIMEOUT_WITH_BUFFER_MS }),
    );
    expect(result.status).toBe('FAILED');
    expect(result.executionTime).toBe(FAILURE_EXECUTION_TIME_MS);
    expect(result.error).toEqual(
      expect.objectContaining({
        code: 1,
        stdout: 'stdout output',
        stderr: 'stderr output',
      }),
    );
    expect(detector.results).toHaveLength(1);
  });

  it('analyzes flaky behavior and writes output JSON', () => {
    const detector = new FlakyTestDetector({ runs: ANALYSIS_RUNS, outputFile: 'analysis.json' });
    detector.results = [
      { status: 'PASSED', executionTime: 100, memoryUsage: { heapUsed: 10 } },
      { status: 'FAILED', executionTime: 200, memoryUsage: { heapUsed: 20 } },
      { status: 'PASSED', executionTime: 150, memoryUsage: { heapUsed: 30 } },
      { status: 'FAILED', executionTime: 250, memoryUsage: { heapUsed: 40 } },
    ];

    jest.spyOn(detector, 'printAnalysis').mockImplementation(() => {});

    const analysis = detector.analyzeFlakyBehavior();

    expect(analysis.totalIterations).toBe(ANALYSIS_RUNS);
    expect(analysis.passedIterations).toBe(PASSED_ITERATIONS);
    expect(analysis.failedIterations).toBe(FAILED_ITERATIONS);
    expect(analysis.successRate).toBe(SUCCESS_RATE_PERCENT);
    expect(analysis.isFlaky).toBe(true);
    expect(analysis.hasHighVariance).toBe(true);
    expect(analysis.hasMemoryLeaks).toBe(true);
    expect(analysis.executionStats).toEqual({ average: 175, min: 100, max: 250, variance: 150 });
    expect(analysis.recommendations.length).toBeGreaterThan(NON_EMPTY_LENGTH);

    expect(fs.writeFileSync).toHaveBeenCalledWith('analysis.json', expect.any(String));
  });

  it('detects memory leak trend only when growth is consistent enough', () => {
    const detector = new FlakyTestDetector({ runs: LEAK_DETECTION_RUNS });
    detector.results = [
      { memoryUsage: { heapUsed: 10 } },
      { memoryUsage: { heapUsed: 20 } },
      { memoryUsage: { heapUsed: 30 } },
      { memoryUsage: { heapUsed: 40 } },
      { memoryUsage: { heapUsed: 50 } },
    ];

    expect(detector.detectMemoryLeaks()).toBe(true);

    detector.results = [
      { memoryUsage: { heapUsed: 10 } },
      { memoryUsage: { heapUsed: 5 } },
      { memoryUsage: { heapUsed: 15 } },
      { memoryUsage: { heapUsed: 8 } },
      { memoryUsage: { heapUsed: 12 } },
    ];

    expect(detector.detectMemoryLeaks()).toBe(false);
  });
});
