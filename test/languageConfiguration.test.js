import languageConfiguration from '../src/languageConfiguration';

describe('languageConfiguration', () => {
  it('exports indentationRules', () => {
    expect(languageConfiguration).toEqual(
      expect.objectContaining({
        indentationRules: expect.any(Object),
      }),
    );
  });

  it('defines increase indent, decrease indent, and unindented line patterns', () => {
    const { indentationRules } = languageConfiguration;

    expect(indentationRules.increaseIndentPattern).toBeInstanceOf(RegExp);
    expect(indentationRules.decreaseIndentPattern).toBeInstanceOf(RegExp);
    expect(indentationRules.unIndentedLinePattern).toBeInstanceOf(RegExp);
  });

  it('matches common block openers and closers', () => {
    const { indentationRules } = languageConfiguration;

    expect(indentationRules.increaseIndentPattern.test('Func MyFunc()')).toBe(true);
    expect(indentationRules.increaseIndentPattern.test('If $a Then')).toBe(true);
    expect(indentationRules.decreaseIndentPattern.test('EndFunc')).toBe(true);
    expect(indentationRules.decreaseIndentPattern.test('EndIf')).toBe(true);
  });

  it('matches comment and include lines as unindented', () => {
    const { indentationRules } = languageConfiguration;

    expect(indentationRules.unIndentedLinePattern.test('; comment')).toBe(true);
    expect(indentationRules.unIndentedLinePattern.test('#include "file.au3"')).toBe(true);
  });
});
