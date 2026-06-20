import { Range } from 'vscode';

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripLineComment(line) {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === ';' && !inSingle && !inDouble) return line.slice(0, i);
  }
  return line;
}

function stringMask(line) {
  const mask = new Array(line.length).fill(false);
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      mask[i] = true;
    } else if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      mask[i] = true;
    } else {
      mask[i] = inSingle || inDouble;
    }
  }
  return mask;
}

function blankStrings(line) {
  const mask = stringMask(line);
  return line
    .split('')
    .map((ch, i) => (mask[i] ? ' ' : ch))
    .join('');
}

function findEnclosingFunctionInDocument(document, position) {
  const funcStartRe = /^\s*(?:volatile\s+)?Func\b/i;
  const funcEndRe = /^\s*EndFunc\b/i;
  let startLine = null;

  for (let lineNum = 0; lineNum <= position.line; lineNum += 1) {
    const code = blankStrings(stripLineComment(document.lineAt(lineNum).text));
    if (funcStartRe.test(code)) startLine = lineNum;
    if (funcEndRe.test(code)) startLine = null;
  }

  if (startLine === null) return null;

  let endLine = null;
  for (let lineNum = startLine + 1; lineNum < document.lineCount; lineNum += 1) {
    const code = blankStrings(stripLineComment(document.lineAt(lineNum).text));
    if (funcEndRe.test(code)) {
      endLine = lineNum;
      break;
    }
  }

  if (endLine === null) return null;
  return new Range(document.lineAt(startLine).range.start, document.lineAt(endLine).range.end);
}

// Block-comment markers: #cs/#ce or #comments-start/#comments-end (see comment.block.autoit in autoit.tmLanguage.json)
const COMMENT_BLOCK_START = /^\s*#c(?:omments-start|s)\b/i;
const COMMENT_BLOCK_END = /^\s*#c(?:omments-end|e)\b/i;

function isInComment(document, position) {
  const currentLine = document.lineAt(position.line);
  if (currentLine.text.charAt(currentLine.firstNonWhitespaceCharacterIndex) === ';') return true;

  let inBlock = false;
  for (let i = 0; i < position.line; i++) {
    const lineText = document.lineAt(i).text;
    if (inBlock) {
      if (COMMENT_BLOCK_END.test(lineText)) inBlock = false;
    } else if (COMMENT_BLOCK_START.test(lineText)) {
      inBlock = true;
    }
  }

  return inBlock || COMMENT_BLOCK_START.test(currentLine.text);
}

function rangeContainsRange(outerRange, innerRange) {
  return (
    (outerRange.start.line < innerRange.start.line ||
      (outerRange.start.line === innerRange.start.line &&
        outerRange.start.character <= innerRange.start.character)) &&
    (outerRange.end.line > innerRange.end.line ||
      (outerRange.end.line === innerRange.end.line &&
        outerRange.end.character >= innerRange.end.character))
  );
}

function isLocalDeclaredInBody(bodyText, name) {
  const escaped = escapeRegex(name);
  const codeOnly = bodyText
    .split(/\r?\n/)
    .map(l => blankStrings(stripLineComment(l)))
    .join('\n');
  const declRe = new RegExp(`\\b(?:Local|Static|Dim)\\b[^\\n]*?${escaped}\\b`, 'i');
  if (declRe.test(codeOnly)) return true;
  const sigRe = new RegExp(`^\\s*(?:volatile\\s+)?Func\\b[^\\n(]*\\([^)]*${escaped}\\b`, 'i');
  return sigRe.test(codeOnly);
}

export {
  blankStrings,
  escapeRegex,
  findEnclosingFunctionInDocument,
  isInComment,
  isLocalDeclaredInBody,
  rangeContainsRange,
  stringMask,
  stripLineComment,
};
