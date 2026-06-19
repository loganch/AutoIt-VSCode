import { parseAu3CheckParameters, shouldIgnoreDiagnostics } from '../../src/utils/au3check';
import { sep } from 'path';

jest.mock('vscode', () => ({
  window: { showErrorMessage: jest.fn() },
}));

describe('parseAu3CheckParameters', () => {
  test('returns empty params when no directive and no include paths', () => {
    expect(parseAu3CheckParameters('', [])).toEqual([]);
  });

  test('adds -I for each include path', () => {
    const result = parseAu3CheckParameters('', ['C:/inc1', 'C:/inc2']);
    expect(result).toEqual(['-I', 'C:/inc1', '-I', 'C:/inc2']);
  });

  test('parses -q flag from directive', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-q';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-q']);
  });

  test('parses -d flag from directive', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-d';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-d']);
  });

  test('parses -w parameters from directive', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-w- 3 -w 5';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-w-', '3', '-w', '5']);
  });

  test('parses mixed flags and warning params', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-q -d -w- 3 -w 7';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-q', '-d', '-w-', '3', '-w', '7']);
  });

  test('uses last directive when multiple exist', () => {
    const text = [
      '#AutoIt3Wrapper_AU3Check_Parameters=-w- 3',
      '; some code',
      '#AutoIt3Wrapper_AU3Check_Parameters=-w 5',
    ].join('\n');
    expect(parseAu3CheckParameters(text, [])).toEqual(['-w', '5']);
  });

  test('ignores -v verbosity parameters', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-v 2 -w 3';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-w', '3']);
  });

  test('combines include paths with directive params', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=-q';
    expect(parseAu3CheckParameters(text, ['C:/inc'])).toEqual(['-I', 'C:/inc', '-q']);
  });

  test('handles empty directive value', () => {
    const text = '#AutoIt3Wrapper_AU3Check_Parameters=';
    expect(parseAu3CheckParameters(text, [])).toEqual([]);
  });

  test('handles whitespace variations in directive', () => {
    const text = '  #AutoIt3Wrapper_AU3Check_Parameters=  -w-  3   -w   5  ';
    expect(parseAu3CheckParameters(text, [])).toEqual(['-w-', '3', '-w', '5']);
  });
});

describe('shouldIgnoreDiagnostics', () => {
  const makeDoc = (fsPath) => ({
    uri: { fsPath },
  });

  test('returns false for normal .au3 files', () => {
    expect(shouldIgnoreDiagnostics(makeDoc('C:/project/test.au3'))).toBe(false);
  });

  test('returns true for files in BackUp folder', () => {
    expect(shouldIgnoreDiagnostics(makeDoc(`C:${sep}project${sep}BackUp${sep}test.au3`))).toBe(true);
  });

  test('returns true for *_old*.au3 backup files', () => {
    expect(shouldIgnoreDiagnostics(makeDoc('C:/project/test_old.au3'))).toBe(true);
    expect(shouldIgnoreDiagnostics(makeDoc('C:/project/test_old1.au3'))).toBe(true);
  });
});
