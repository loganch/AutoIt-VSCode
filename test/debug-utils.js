/**
 * Test Debugging Utilities for ai_definition.test.js
 * Provides individual test isolation and debugging capabilities
 */

const { execSync } = require('child_process');

/**
 * Debug utility class for test isolation and execution
 */
class TestDebugger {
  constructor() {
    this.testFile = 'test/ai_definition.test.js';
    this.jestConfig = {
      verbose: true,
      coverage: false,
      runInBand: true,
      clearCache: false,
    };
  }

  /**
   * Run a specific test suite by name pattern
   * @param {string} suiteName - Name pattern of the test suite (describe block)
   * @param {Object} options - Additional jest options
   */
  runSuite(suiteName, options = {}) {
    const cmd = this._buildJestCommand({
      testNamePattern: suiteName,
      ...options,
    });

    console.log(`\n🔍 Running test suite: "${suiteName}"`);
    console.log(`Command: ${cmd}\n`);

    try {
      execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error(`\n❌ Test suite "${suiteName}" failed with exit code: ${error.status}`);
      throw error;
    }
  }

  /**
   * Run a specific test by name pattern
   * @param {string} testName - Name pattern of the test
   * @param {Object} options - Additional jest options
   */
  runTest(testName, options = {}) {
    const cmd = this._buildJestCommand({
      testNamePattern: testName,
      ...options,
    });

    console.log(`\n🧪 Running individual test: "${testName}"`);
    console.log(`Command: ${cmd}\n`);

    try {
      execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error(`\n❌ Test "${testName}" failed with exit code: ${error.status}`);
      throw error;
    }
  }

  /**
   * Run all tests in the definition test file
   * @param {Object} options - Additional jest options
   */
  runAll(options = {}) {
    const cmd = this._buildJestCommand({
      testPathPattern: this.testFile,
      ...options,
    });

    console.log('\n🚀 Running all ai_definition tests');
    console.log(`Command: ${cmd}\n`);

    try {
      execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
    } catch (error) {
      console.error(`\n❌ Test suite failed with exit code: ${error.status}`);
      throw error;
    }
  }

  /**
   * Run tests with debug mode (shows additional information)
   * @param {string} pattern - Test name or suite pattern
   * @param {Object} options - Additional options
   */
  debug(pattern, options = {}) {
    const debugOptions = {
      verbose: true,
      silent: false,
      detectOpenHandles: true,
      forceExit: true,
      ...options,
    };

    console.log(`\n🐛 Debug mode: "${pattern}"`);

    if (pattern.includes('basic functionality')) {
      return this.runSuite(pattern, debugOptions);
    } else if (pattern.includes('edge cases')) {
      return this.runSuite(pattern, debugOptions);
    } else if (pattern.includes('error handling')) {
      return this.runSuite(pattern, debugOptions);
    } else if (pattern.includes('performance')) {
      return this.runSuite(pattern, debugOptions);
    } else if (pattern.includes('null results')) {
      return this.runSuite(pattern, debugOptions);
    } else {
      return this.runTest(pattern, debugOptions);
    }
  }

  /**
   * Clear Jest cache and run tests
   * @param {string} pattern - Test pattern (optional)
   */
  clearCacheAndRun(pattern = null) {
    console.log('\n🧹 Clearing Jest cache...');
    execSync('npx jest --clearCache', { stdio: 'inherit', cwd: process.cwd() });

    if (pattern) {
      this.debug(pattern, { cache: false });
    } else {
      this.runAll({ cache: false });
    }
  }

  /**
   * Run tests with different isolation levels
   * @param {string} pattern - Test pattern
   * @param {'process'|'thread'|'serial'} isolationLevel - Level of isolation
   */
  runIsolated(pattern, isolationLevel = 'serial') {
    const isolationOptions = {
      serial: { runInBand: true, maxWorkers: 1 },
      process: { runInBand: false, maxWorkers: 1 },
      thread: { runInBand: false, maxWorkers: 2 },
    };

    const options = isolationOptions[isolationLevel] || isolationOptions.serial;

    console.log(`\n🔒 Running with ${isolationLevel} isolation: "${pattern}"`);

    if (pattern === 'all') {
      this.runAll(options);
    } else {
      this.debug(pattern, options);
    }
  }

  /**
   * Validate test environment and configuration
   */
  validateEnvironment() {
    console.log('\n🔧 Validating test environment...\n');

    const checks = [
      { name: 'Node version', cmd: 'node --version' },
      { name: 'NPM version', cmd: 'npm --version' },
      { name: 'Jest version', cmd: 'npx jest --version' },
      {
        name: 'Jest config',
        cmd: 'npx jest --showConfig --testPathPattern=test/ai_definition.test.js',
      },
    ];

    checks.forEach(check => {
      try {
        console.log(`✅ ${check.name}:`);
        execSync(check.cmd, { stdio: 'inherit', cwd: process.cwd() });
        console.log('');
      } catch (error) {
        console.error(`❌ ${check.name} check failed:`, error.message);
      }
    });
  }

  /**
   * Build Jest command with options
   * @private
   */
  _buildJestCommand(options = {}) {
    let cmd = 'npx jest';

    if (options.testPathPattern) {
      cmd += ` ${options.testPathPattern}`;
    } else {
      cmd += ` ${this.testFile}`;
    }

    if (options.testNamePattern) {
      cmd += ` --testNamePattern="${options.testNamePattern}"`;
    }

    if (options.verbose !== false) cmd += ' --verbose';
    if (options.runInBand !== false) cmd += ' --runInBand';
    if (options.coverage === false) cmd += ' --no-coverage';
    if (options.cache === false) cmd += ' --no-cache';
    if (options.silent === false) cmd += ' --silent=false';
    if (options.detectOpenHandles) cmd += ' --detectOpenHandles';
    if (options.forceExit) cmd += ' --forceExit';
    if (options.maxWorkers) cmd += ` --maxWorkers=${options.maxWorkers}`;

    return cmd;
  }

  /**
   * Get available test suites and tests
   */
  listTests() {
    console.log('\n📋 Available test suites and tests:\n');

    const suites = [
      'basic functionality',
      'edge cases',
      'error handling',
      'performance and caching',
      'null results when symbol not found',
    ];

    const individualTests = [
      'finds function definitions in the same file',
      'finds variable definitions in the same file',
      'finds definitions in included files',
      'function declarations with volatile',
      'variable declarations Local, Global, Const',
      'returns null when symbol is absent',
    ];

    console.log('🔧 Test Suites:');
    suites.forEach((suite, i) => {
      console.log(`  ${i + 1}. ${suite}`);
    });

    console.log('\n🧪 Individual Tests:');
    individualTests.forEach((test, i) => {
      console.log(`  ${i + 1}. ${test}`);
    });

    console.log('\n💡 Usage examples:');
    console.log('  debugger.runSuite("basic functionality")');
    console.log('  debugger.runTest("finds function definitions")');
    console.log('  debugger.debug("edge cases")');
    console.log('  debugger.runIsolated("all", "serial")');
  }
}

// Export for use in other scripts
module.exports = { TestDebugger };

// CLI usage when run directly
if (require.main === module) {
  const testDebugger = new TestDebugger();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('🔬 AutoIt VSCode Test Debugger');
    testDebugger.listTests();
    console.log('\n🚀 Run with arguments: node test/debug-utils.js [command] [pattern]');
    console.log('Commands: run, debug, suite, test, isolated, validate, list');
    process.exit(0);
  }

  const [command, pattern, isolationLevel] = args;

  try {
    switch (command) {
      case 'run':
        testDebugger.runAll();
        break;
      case 'suite':
        testDebugger.runSuite(pattern);
        break;
      case 'test':
        testDebugger.runTest(pattern);
        break;
      case 'debug':
        testDebugger.debug(pattern);
        break;
      case 'isolated':
        testDebugger.runIsolated(
          pattern,
          /** @type {'process'|'thread'|'serial'} */ (isolationLevel),
        );
        break;
      case 'validate':
        testDebugger.validateEnvironment();
        break;
      case 'clear':
        testDebugger.clearCacheAndRun(pattern);
        break;
      case 'list':
        testDebugger.listTests();
        break;
      default:
        console.error(`Unknown command: ${command}`);
        process.exit(1);
    }
  } catch (error) {
    console.error('Debug execution failed:', error.message);
    process.exit(1);
  }
}
