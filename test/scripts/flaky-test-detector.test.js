jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}));

const { execSync } = require('child_process');
const fs = require('fs');
const { FlakyTestDetector } = require('../../scripts/flaky-test-detector.js');

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

    expect(detector.runs).toBe(10);
    expect(detector.timeout).toBe(30000);
    expect(detector.outputFile).toBe('flaky-test-results.json');
    expect(detector.testPattern).toBe('');
    expect(detector.results).toEqual([]);
  });

  it('records a passed iteration when jest command succeeds', () => {
    const detector = new FlakyTestDetector({ runs: 1, timeout: 50 });
    jest.spyOn(process, 'memoryUsage')
      .mockReturnValueOnce({ heapUsed: 100, rss: 1000 })
      .mockReturnValueOnce({ heapUsed: 220, rss: 1500 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValueOnce(1150);

    const result = detector.runTestIteration(1);

    expect(execSync).toHaveBeenCalledWith(
      expect.stringContaining('npx jest --testTimeout=50 --runInBand --verbose --no-coverage'),
      expect.objectContaining({ timeout: 5050 }),
    );
    expect(result.status).toBe('PASSED');
    expect(result.executionTime).toBe(150);
    expect(result.memoryUsage).toEqual({ heapUsed: 120, rss: 500 });
    expect(detector.results).toHaveLength(1);
  });

  it('records a failed iteration when jest command throws', () => {
    const detector = new FlakyTestDetector({ runs: 1, timeout: 25, testPattern: 'critical test' });
    jest.spyOn(process, 'memoryUsage').mockReturnValue({ heapUsed: 100, rss: 1000 });
    jest.spyOn(Date, 'now').mockReturnValueOnce(2000).mockReturnValueOnce(2250);

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
      expect.objectContaining({ timeout: 5025 }),
    );
    expect(result.status).toBe('FAILED');
    expect(result.executionTime).toBe(250);
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
    const detector = new FlakyTestDetector({ runs: 4, outputFile: 'analysis.json' });
    detector.results = [
      { status: 'PASSED', executionTime: 100, memoryUsage: { heapUsed: 10 } },
      { status: 'FAILED', executionTime: 200, memoryUsage: { heapUsed: 20 } },
      { status: 'PASSED', executionTime: 150, memoryUsage: { heapUsed: 30 } },
      { status: 'FAILED', executionTime: 250, memoryUsage: { heapUsed: 40 } },
    ];

    jest.spyOn(detector, 'printAnalysis').mockImplementation(() => {});

    const analysis = detector.analyzeFlakyBehavior();

    expect(analysis.totalIterations).toBe(4);
    expect(analysis.passedIterations).toBe(2);
    expect(analysis.failedIterations).toBe(2);
    expect(analysis.successRate).toBe(50);
    expect(analysis.isFlaky).toBe(true);
    expect(analysis.hasHighVariance).toBe(true);
    expect(analysis.hasMemoryLeaks).toBe(true);
    expect(analysis.executionStats).toEqual({ average: 175, min: 100, max: 250, variance: 150 });
    expect(analysis.recommendations.length).toBeGreaterThan(0);

    expect(fs.writeFileSync).toHaveBeenCalledWith('analysis.json', expect.any(String));
  });

  it('detects memory leak trend only when growth is consistent enough', () => {
    const detector = new FlakyTestDetector({ runs: 5 });
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
