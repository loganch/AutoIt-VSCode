jest.mock('../../src/utils/fsCache', () => ({
  safeFileExists: jest.fn(),
  getIncludeText: jest.fn(),
}));

jest.mock('../../src/utils/includeResolution', () => ({
  getIncludePath: jest.fn(),
}));

jest.mock('../../src/config/pathResolution', () => ({
  findFilepath: jest.fn(),
}));

const { safeFileExists, getIncludeText } = require('../../src/utils/fsCache');
const { getIncludePath } = require('../../src/utils/includeResolution');
const { findFilepath } = require('../../src/config/pathResolution');
const { getIncludeData, getIncludeDataByPath } = require('../../src/utils/functionSignature');

const FUNC_SOURCE = 'Func MyLibFunc($a)\nEndFunc\n';
const document = {
  uri: { fsPath: 'C:\\main.au3' },
  fileName: 'C:\\main.au3',
  getText: () => '',
};

describe('getIncludeData', () => {
  test('resolves the include via getIncludePath and parses its functions', () => {
    getIncludePath.mockReturnValue('C:\\lib\\MyLib.au3');
    safeFileExists.mockReturnValue(true);
    getIncludeText.mockReturnValue(FUNC_SOURCE);

    const result = getIncludeData('MyLib.au3', document);

    expect(getIncludePath).toHaveBeenCalledWith('MyLib.au3', document);
    expect(findFilepath).not.toHaveBeenCalled();
    expect(result).toHaveProperty('MyLibFunc');
    expect(result.MyLibFunc.documentation).toContain('Included from MyLib.au3');
  });

  test('trusts getIncludePath\'s empty-string miss signal without re-resolving via findFilepath', () => {
    // getIncludePath already encodes the full fallback order (including its
    // own findFilepath call), so getIncludeData must not retry resolution.
    getIncludePath.mockReturnValue('');

    const result = getIncludeData('MyLib.au3', document);

    expect(findFilepath).not.toHaveBeenCalled();
    expect(result).toEqual({});
  });

  test('returns an empty object for invalid input', () => {
    expect(getIncludeData('', document)).toEqual({});
    expect(getIncludeData('MyLib.au3', null)).toEqual({});
  });
});

describe('getIncludeDataByPath', () => {
  test('parses functions from an already-resolved path without re-resolving', () => {
    getIncludeText.mockReturnValue(FUNC_SOURCE);

    const result = getIncludeDataByPath('C:\\lib\\MyLib.au3', 'MyLib.au3');

    expect(getIncludePath).not.toHaveBeenCalled();
    expect(findFilepath).not.toHaveBeenCalled();
    expect(getIncludeText).toHaveBeenCalledWith('C:\\lib\\MyLib.au3');
    expect(result.MyLibFunc.documentation).toContain('Included from MyLib.au3');
  });

  test('defaults the display name to the path itself when omitted', () => {
    getIncludeText.mockReturnValue(FUNC_SOURCE);

    const result = getIncludeDataByPath('C:\\lib\\MyLib.au3');

    expect(result.MyLibFunc.documentation).toContain('Included from C:\\lib\\MyLib.au3');
  });

  test('returns an empty object for invalid input', () => {
    expect(getIncludeDataByPath('')).toEqual({});
  });
});
