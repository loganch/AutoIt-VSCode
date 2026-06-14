const AI_CONSTANTS = [
  '$MB_ICONERROR',
  '$MB_ICONINFORMATION',
  '$MB_YESNO',
  '$MB_TASKMODAL',
  '$IDYES',
  '$IDNO',
];

const AUTOIT_MODE = { language: 'autoit', scheme: 'file' };

const REGEX_PATTERNS = Object.freeze({
  functionPattern: /^[\t ]*(?:volatile[\t ]+)?Func[\t ]+(\w+)[\t ]*\(/i,
  variablePattern: /(?:["'].*?["'])|(?:;.*)|(\$\w+)/g,
  regionPattern: /^[\t ]*#region\s[- ]*(.+)/i,
  commentBlockStart: /^\s*#(cs|comments-start)/,
  commentBlockEnd: /^\s*#(ce|comments-end)/,
});

const isSkippableLine = line => {
  if (!line || line.isEmptyOrWhitespace) return true;

  const firstChar = line.text.charAt(line.firstNonWhitespaceCharacterIndex);
  if (firstChar === ';') return true;

  if (firstChar === '#') {
    return (
      !REGEX_PATTERNS.commentBlockStart.test(line.text) &&
      !REGEX_PATTERNS.commentBlockEnd.test(line.text)
    );
  }

  return false;
};

export { AI_CONSTANTS, AUTOIT_MODE, REGEX_PATTERNS, isSkippableLine };
