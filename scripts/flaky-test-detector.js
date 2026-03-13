#!/usr/bin/env node

/**
 * Flaky Test Detection Script
 * Runs tests multiple times to identify inconsistent behavior
 */

const { execSync } = require('child_process');
const fs = require('fs');

const DEFAULT_RUNS = 10;
const DEFAULT_TIMEOUT_MS = 30000;
const DEFAULT_OUTPUT_FILE = 'flaky-test-results.json';
const EXTRA_JEST_TIMEOUT_MS = 5000;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
const MAX_JEST_OUTPUT_MB = 5;
const ITERATION_DELAY_MS = 1000;
const PERCENT_SCALE = 100;
const HIGH_VARIANCE_RATIO_THRESHOLD = 0.5;
const MIN_MEMORY_SAMPLES = 3;
const MEMORY_LEAK_TREND_RATIO = 0.7;
const SUMMARY_LINE_WIDTH = 60;
const ARG_STEP = 2;
const PARSE_INT_RADIX = 10;
const CLI_ARGS_START_INDEX = 2;

class FlakyTestDetector {
  constructor(options = {}) {
    this.runs = options.runs || DEFAULT_RUNS;
    this.timeout = options.timeout || DEFAULT_TIMEOUT_MS;
    this.outputFile = options.outputFile || DEFAULT_OUTPUT_FILE;
    this.testPattern = options.testPattern || '';
    this.results = [];
    this.flakyTests = [];
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  runTestIteration(iteration) {
    this.log(`Running flaky test detection iteration ${iteration}/${this.runs}`);

    const startTime = Date.now();
    const memoryBefore = process.memoryUsage();

    try {
      let command = `npx jest --testTimeout=${this.timeout} --runInBand --verbose --no-coverage`;

      if (this.testPattern) {
        command += ` --testNamePattern="${this.testPattern}"`;
      }

      execSync(command, {
        encoding: 'utf8',
        timeout: this.timeout + EXTRA_JEST_TIMEOUT_MS,
        maxBuffer: BYTES_PER_MEGABYTE * MAX_JEST_OUTPUT_MB,
      });

      const endTime = Date.now();
      const memoryAfter = process.memoryUsage();

      const iterationResult = {
        iteration,
        status: 'PASSED',
        executionTime: endTime - startTime,
        memoryUsage: {
          heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
          rss: memoryAfter.rss - memoryBefore.rss,
        },
        timestamp: new Date().toISOString(),
      };

      this.results.push(iterationResult);
      this.log(`✅ Iteration ${iteration} passed in ${iterationResult.executionTime}ms`);

      return iterationResult;
    } catch (error) {
      const endTime = Date.now();

      const iterationResult = {
        iteration,
        status: 'FAILED',
        executionTime: endTime - startTime,
        error: {
          message: error.message,
          stdout: error.stdout?.toString() || '',
          stderr: error.stderr?.toString() || '',
          code: error.status,
        },
        timestamp: new Date().toISOString(),
      };

      this.results.push(iterationResult);
      this.log(`❌ Iteration ${iteration} failed: ${error.message}`);

      return iterationResult;
    }
  }

  async detectFlakyTests() {
    this.log(`🔍 Starting flaky test detection with ${this.runs} iterations`);

    for (let i = 1; i <= this.runs; i++) {
      await this.runTestIteration(i);

      // Short delay between iterations
      if (i < this.runs) {
        await new Promise(resolve => setTimeout(resolve, ITERATION_DELAY_MS));
      }
    }

    return this.analyzeFlakyBehavior();
  }

  analyzeFlakyBehavior() {
    const passedIterations = this.results.filter(r => r.status === 'PASSED').length;
    const failedIterations = this.results.filter(r => r.status === 'FAILED').length;
    const successRate = (passedIterations / this.runs) * PERCENT_SCALE;

    const executionTimes = this.results.filter(r => r.executionTime).map(r => r.executionTime);

    const avgExecutionTime =
      executionTimes.length > 0
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
        : 0;

    const minExecutionTime = executionTimes.length > 0 ? Math.min(...executionTimes) : 0;
    const maxExecutionTime = executionTimes.length > 0 ? Math.max(...executionTimes) : 0;
    const executionTimeVariance = maxExecutionTime - minExecutionTime;

    // Detect flaky behavior patterns
    const isFlaky = successRate > 0 && successRate < PERCENT_SCALE;
    const hasHighVariance =
      executionTimeVariance > avgExecutionTime * HIGH_VARIANCE_RATIO_THRESHOLD;
    const hasMemoryLeaks = this.detectMemoryLeaks();

    const analysis = {
      timestamp: new Date().toISOString(),
      totalIterations: this.runs,
      passedIterations,
      failedIterations,
      successRate,
      isFlaky,
      hasHighVariance,
      hasMemoryLeaks,
      executionStats: {
        average: Math.round(avgExecutionTime),
        min: minExecutionTime,
        max: maxExecutionTime,
        variance: executionTimeVariance,
      },
      recommendations: this.generateRecommendations(isFlaky, hasHighVariance, hasMemoryLeaks),
      iterations: this.results,
    };

    // Save results
    fs.writeFileSync(this.outputFile, JSON.stringify(analysis, null, ARG_STEP));

    this.printAnalysis(analysis);

    return analysis;
  }

  detectMemoryLeaks() {
    const memoryUsages = this.results
      .filter(r => r.memoryUsage && r.memoryUsage.heapUsed)
      .map(r => r.memoryUsage.heapUsed);

    if (memoryUsages.length < MIN_MEMORY_SAMPLES) return false;

    // Check for consistently increasing memory usage
    let increasingTrend = 0;
    for (let i = 1; i < memoryUsages.length; i++) {
      if (memoryUsages[i] > memoryUsages[i - 1]) {
        increasingTrend++;
      }
    }

    // If more than 70% of iterations show increasing memory, suspect a leak
    return increasingTrend / (memoryUsages.length - 1) > MEMORY_LEAK_TREND_RATIO;
  }

  generateRecommendations(isFlaky, hasHighVariance, hasMemoryLeaks) {
    const recommendations = [];

    if (isFlaky) {
      recommendations.push(
        '⚠️ Flaky tests detected. Check for race conditions, timing issues, or external dependencies.',
      );
      recommendations.push('🔧 Consider adding proper setup/teardown and mock isolation.');
      recommendations.push('🔍 Review global state management and ensure test independence.');
    }

    if (hasHighVariance) {
      recommendations.push(
        '📊 High execution time variance detected. Consider optimizing slow operations.',
      );
      recommendations.push(
        '⚡ Check for inefficient algorithms or unnecessary file I/O operations.',
      );
    }

    if (hasMemoryLeaks) {
      recommendations.push(
        '🔋 Potential memory leaks detected. Review mock cleanup and object disposal.',
      );
      recommendations.push('🧹 Ensure proper cleanup in beforeEach/afterEach hooks.');
    }

    if (!isFlaky && !hasHighVariance && !hasMemoryLeaks) {
      recommendations.push('✅ No flaky behavior detected. Tests appear stable and reliable.');
    }

    return recommendations;
  }

  printAnalysis(analysis) {
    console.log('\n' + '='.repeat(SUMMARY_LINE_WIDTH));
    console.log('🔍 FLAKY TEST DETECTION ANALYSIS');
    console.log('='.repeat(SUMMARY_LINE_WIDTH));
    console.log(`Total iterations: ${analysis.totalIterations}`);
    console.log(`Passed: ${analysis.passedIterations} ✅`);
    console.log(
      `Failed: ${analysis.failedIterations} ${analysis.failedIterations > 0 ? '❌' : '✅'}`,
    );
    console.log(`Success rate: ${analysis.successRate.toFixed(1)}%`);
    console.log(`Flaky behavior: ${analysis.isFlaky ? 'DETECTED ⚠️' : 'NONE ✅'}`);
    console.log(`High variance: ${analysis.hasHighVariance ? 'YES ⚠️' : 'NO ✅'}`);
    console.log(`Memory leaks: ${analysis.hasMemoryLeaks ? 'SUSPECTED ⚠️' : 'NONE ✅'}`);
    console.log(`Avg execution time: ${analysis.executionStats.average}ms`);
    console.log(`Time variance: ${analysis.executionStats.variance}ms`);
    console.log(`Results saved to: ${this.outputFile}`);

    if (analysis.recommendations.length > 0) {
      console.log('\n📋 RECOMMENDATIONS:');
      analysis.recommendations.forEach(rec => console.log(rec));
    }

    console.log('='.repeat(SUMMARY_LINE_WIDTH));

    if (analysis.isFlaky) {
      console.log('\n⚠️ FLAKY TESTS DETECTED');
      console.log('Please investigate and fix the inconsistent test behavior.');
      process.exit(1);
    } else {
      console.log('\n✅ NO FLAKY BEHAVIOR DETECTED');
      process.exit(0);
    }
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(CLI_ARGS_START_INDEX);
  const options = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i += ARG_STEP) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--runs':
        options.runs = parseInt(value, PARSE_INT_RADIX);
        break;
      case '--timeout':
        options.timeout = parseInt(value, PARSE_INT_RADIX);
        break;
      case '--output':
        options.outputFile = value;
        break;
      case '--pattern':
        options.testPattern = value;
        break;
    }
  }

  const detector = new FlakyTestDetector(options);
  detector.detectFlakyTests().catch(error => {
    console.error('❌ Flaky test detection failed:', error);
    process.exit(1);
  });
}

module.exports = { FlakyTestDetector };
