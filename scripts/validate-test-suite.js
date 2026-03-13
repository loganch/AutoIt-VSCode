#!/usr/bin/env node

/**
 * Test Suite Validation Script
 * Runs the full test suite multiple times to ensure reliability
 */

const { execSync } = require('child_process');
const fs = require('fs');

const DEFAULT_RUNS = 5;
const DEFAULT_TIMEOUT_MS = 45000;
const DEFAULT_OUTPUT_FILE = 'validation-results.json';
const EXTRA_JEST_TIMEOUT_MS = 5000;
const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = BYTES_PER_KILOBYTE * BYTES_PER_KILOBYTE;
const MAX_JEST_OUTPUT_MB = 10;
const RUN_DELAY_MS = 2000;
const PASS_RATE_REQUIRED = 100;
const PERFORMANCE_THRESHOLD_MS = 30000;
const SUMMARY_LINE_WIDTH = 60;
const ARG_STEP = 2;
const PARSE_INT_RADIX = 10;
const DECIMAL_PLACES = 2;
const CLI_ARGS_START_INDEX = 2;

class TestSuiteValidator {
  constructor(options = {}) {
    this.runs = options.runs || DEFAULT_RUNS;
    this.timeout = options.timeout || DEFAULT_TIMEOUT_MS;
    this.outputFile = options.outputFile || DEFAULT_OUTPUT_FILE;
    this.results = [];
    this.startTime = Date.now();
  }

  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }

  runSingleTest(runNumber) {
    this.log(`Starting test run ${runNumber}/${this.runs}`);

    const runStartTime = Date.now();
    const memoryBefore = process.memoryUsage();

    try {
      const result = execSync(
        `npx jest --testTimeout=${this.timeout} --runInBand --verbose --no-coverage`,
        {
          encoding: 'utf8',
          timeout: this.timeout + EXTRA_JEST_TIMEOUT_MS,
          maxBuffer: BYTES_PER_MEGABYTE * MAX_JEST_OUTPUT_MB,
        },
      );

      const runEndTime = Date.now();
      const memoryAfter = process.memoryUsage();
      const executionTime = runEndTime - runStartTime;

      const testResult = {
        run: runNumber,
        status: 'PASSED',
        executionTime,
        memoryDelta: {
          heapUsed: memoryAfter.heapUsed - memoryBefore.heapUsed,
          heapTotal: memoryAfter.heapTotal - memoryBefore.heapTotal,
          external: memoryAfter.external - memoryBefore.external,
          rss: memoryAfter.rss - memoryBefore.rss,
        },
        output: result,
      };

      this.results.push(testResult);
      this.log(`✅ Test run ${runNumber} passed in ${executionTime}ms`);

      return testResult;
    } catch (error) {
      const runEndTime = Date.now();
      const executionTime = runEndTime - runStartTime;

      const testResult = {
        run: runNumber,
        status: 'FAILED',
        executionTime,
        error: {
          message: error.message,
          stdout: error.stdout,
          stderr: error.stderr,
          code: error.status,
        },
      };

      this.results.push(testResult);
      this.log(`❌ Test run ${runNumber} failed after ${executionTime}ms`);
      this.log(`Error: ${error.message}`);

      return testResult;
    }
  }

  async validateTestSuite() {
    this.log(`🚀 Starting test suite validation with ${this.runs} runs`);

    for (let i = 1; i <= this.runs; i++) {
      await this.runSingleTest(i);

      // Add delay between runs to prevent resource conflicts
      if (i < this.runs) {
        this.log('⏳ Waiting 2 seconds before next run...');
        await new Promise(resolve => setTimeout(resolve, RUN_DELAY_MS));
      }
    }

    return this.analyzeResults();
  }

  analyzeResults() {
    const totalTime = Date.now() - this.startTime;
    const passedRuns = this.results.filter(r => r.status === 'PASSED').length;
    const failedRuns = this.results.filter(r => r.status === 'FAILED').length;
    const passRate = (passedRuns / this.runs) * PASS_RATE_REQUIRED;

    const executionTimes = this.results.filter(r => r.executionTime).map(r => r.executionTime);

    const avgExecutionTime =
      executionTimes.length > 0
        ? executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length
        : 0;

    const minExecutionTime = executionTimes.length > 0 ? Math.min(...executionTimes) : 0;
    const maxExecutionTime = executionTimes.length > 0 ? Math.max(...executionTimes) : 0;

    // Calculate memory statistics
    const memoryDeltas = this.results.filter(r => r.memoryDelta).map(r => r.memoryDelta.heapUsed);

    const avgMemoryDelta =
      memoryDeltas.length > 0
        ? memoryDeltas.reduce((sum, delta) => sum + delta, 0) / memoryDeltas.length
        : 0;

    const summary = {
      timestamp: new Date().toISOString(),
      totalRuns: this.runs,
      passedRuns,
      failedRuns,
      passRate,
      totalExecutionTime: totalTime,
      averageExecutionTime: Math.round(avgExecutionTime),
      minExecutionTime,
      maxExecutionTime,
      averageMemoryDelta: Math.round(avgMemoryDelta),
      isReliable: passRate >= PASS_RATE_REQUIRED,
      isPerformant: avgExecutionTime < PERFORMANCE_THRESHOLD_MS,
      results: this.results,
    };

    // Save results to file
    fs.writeFileSync(this.outputFile, JSON.stringify(summary, null, ARG_STEP));

    this.printSummary(summary);

    return summary;
  }

  printSummary(summary) {
    console.log('\n' + '='.repeat(SUMMARY_LINE_WIDTH));
    console.log('📊 TEST SUITE VALIDATION SUMMARY');
    console.log('='.repeat(SUMMARY_LINE_WIDTH));
    console.log(`Total runs: ${summary.totalRuns}`);
    console.log(`Passed: ${summary.passedRuns} ✅`);
    console.log(`Failed: ${summary.failedRuns} ${summary.failedRuns > 0 ? '❌' : '✅'}`);
    console.log(`Pass rate: ${summary.passRate.toFixed(1)}%`);
    console.log(`Reliable: ${summary.isReliable ? 'YES ✅' : 'NO ❌'}`);
    console.log(`Performant: ${summary.isPerformant ? 'YES ✅' : 'NO ❌'}`);
    console.log(`Average execution time: ${summary.averageExecutionTime}ms`);
    console.log(`Min execution time: ${summary.minExecutionTime}ms`);
    console.log(`Max execution time: ${summary.maxExecutionTime}ms`);
    console.log(
      `Average memory delta: ${(summary.averageMemoryDelta / BYTES_PER_KILOBYTE / BYTES_PER_KILOBYTE).toFixed(DECIMAL_PLACES)}MB`,
    );
    console.log(`Total validation time: ${summary.totalExecutionTime}ms`);
    console.log(`Results saved to: ${this.outputFile}`);
    console.log('='.repeat(SUMMARY_LINE_WIDTH));

    if (!summary.isReliable) {
      console.log('\n❌ TEST SUITE IS NOT RELIABLE');
      console.log('Some test runs failed. Please investigate and fix the issues.');
      process.exit(1);
    } else if (!summary.isPerformant) {
      console.log('\n⚠️ TEST SUITE PERFORMANCE CONCERN');
      console.log('Tests are taking longer than expected. Consider optimization.');
      process.exit(0);
    } else {
      console.log('\n✅ TEST SUITE IS RELIABLE AND PERFORMANT');
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
    }
  }

  const validator = new TestSuiteValidator(options);
  validator.validateTestSuite().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

module.exports = { TestSuiteValidator };
