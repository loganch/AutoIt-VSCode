import path from 'path';
import fs from 'fs';
import VariableTrackingService from '../../src/services/VariableTrackingService.js';

const GLOBAL_LINE = 0;
const INITIAL_MAX_DEPTH = 3;
const INSIDE_FUNCTION_LINE = 2;
const UPDATED_MAX_DEPTH = 5;

jest.mock('fs');

describe('VariableTrackingService', () => {
  let service;
  let consoleWarnSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    VariableTrackingService.resetInstance();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    service = VariableTrackingService.getInstance('/workspace');
    service.clear();
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
    jest.useRealTimers();
  });

  test('returns the same singleton instance', () => {
    const instanceOne = VariableTrackingService.getInstance('/workspace');
    const instanceTwo = VariableTrackingService.getInstance('/workspace');

    expect(instanceOne).toBe(instanceTwo);
  });

  test('parses variables accessible at a line', () => {
    const source = `Global $gShared = 1
Func Demo($param)
    Local $localVar = 2
EndFunc`;

    service.updateFile('/workspace/main.au3', source);

    const globalVariables = service.getVariablesAtPosition('/workspace/main.au3', GLOBAL_LINE);
    const functionVariables = service.getVariablesAtPosition(
      '/workspace/main.au3',
      INSIDE_FUNCTION_LINE,
    );

    expect(globalVariables.map(variable => variable.name)).toEqual(['$gShared']);
    expect(functionVariables.map(variable => variable.name)).toEqual(
      expect.arrayContaining(['$gShared', '$param', '$localVar']),
    );
  });

  test('debounces parsing until the configured delay elapses', () => {
    service.updateFileDebounced('/workspace/debounced.au3', 'Global $gValue = 1');

    expect(service.fileParsers.size).toBe(0);

    jest.advanceTimersByTime(service.parseDebounceMs);

    const variables = service.getVariablesAtPosition('/workspace/debounced.au3', GLOBAL_LINE);
    expect(variables.map(variable => variable.name)).toEqual(['$gValue']);
  });

  test('immediate updates cancel pending debounced parses', () => {
    service.updateFileDebounced('/workspace/cancel.au3', 'Global $gOld = 1');
    service.updateFileImmediate('/workspace/cancel.au3', 'Global $gNew = 1');

    jest.advanceTimersByTime(service.parseDebounceMs);

    const variables = service.getVariablesAtPosition('/workspace/cancel.au3', GLOBAL_LINE);
    expect(variables.map(variable => variable.name)).toEqual(['$gNew']);
  });

  test('merges global variables from included files', async () => {
    const mainPath = '/workspace/main.au3';
    const includePath = path.join('/workspace', 'config.au3');
    const getBaseName = filePath => path.basename(path.normalize(filePath));
    const mainSource = `#include "config.au3"
Global $gMain = 1`;

    const existsSyncMock = /** @type {jest.Mock} */ (/** @type {unknown} */ (fs.existsSync));
    const readFileSyncMock = /** @type {jest.Mock} */ (/** @type {unknown} */ (fs.readFileSync));
    const readFileMock = /** @type {jest.Mock} */ (/** @type {unknown} */ (fs.readFile));

    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockImplementation(filePath => {
      const baseName = getBaseName(filePath);

      if (baseName === getBaseName(mainPath)) {
        return mainSource;
      }

      if (baseName === getBaseName(includePath)) {
        return 'Global $gIncluded = 1';
      }

      return '';
    });
    readFileMock.mockImplementation((filePath, _encoding, callback) => {
      const baseName = getBaseName(filePath);

      if (baseName === getBaseName(includePath)) {
        callback(null, 'Global $gIncluded = 1');
        return;
      }

      callback(null, '');
    });

    service.updateFile(mainPath, mainSource);

    const variables = await service.getVariablesWithIncludes(mainPath, GLOBAL_LINE);
    const names = variables.map(variable => variable.name);

    expect(names).toEqual(expect.arrayContaining(['$gMain', '$gIncluded']));
    expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringMatching(/config\.au3$/), 'utf8');
  });

  test('updateConfiguration clears cached state and swaps include settings', () => {
    service.updateFile('/workspace/main.au3', 'Global $gValue = 1');

    service.updateConfiguration('/next-workspace', ['/autoit/include'], UPDATED_MAX_DEPTH);

    expect(service.workspaceRoot).toBe('/next-workspace');
    expect(service.includeResolver.autoitIncludePaths).toEqual(['/autoit/include']);
    expect(service.includeResolver.maxDepth).toBe(UPDATED_MAX_DEPTH);
    expect(service.fileParsers.size).toBe(0);
  });

  test('warns when getInstance is called with different parameters', () => {
    VariableTrackingService.resetInstance();
    VariableTrackingService.getInstance('/workspace-one', ['one'], INITIAL_MAX_DEPTH);
    VariableTrackingService.getInstance('/workspace-two', ['two'], UPDATED_MAX_DEPTH);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('getInstance called with different parameters than initial instance'),
    );
  });
});
