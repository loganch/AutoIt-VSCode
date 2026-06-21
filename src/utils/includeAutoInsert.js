import { Position, TextEdit } from 'vscode';

const INCLUDE_LINE_REGEX = /^\s*#include\b/i;

const normalizeInclude = name => name.replace(/\.au3$/i, '').toLowerCase();

const collectExistingIncludes = docText => {
  const existing = new Set();
  const angled = /^\s*#include\s+<([^>]+)>/gm;
  const quoted = /^\s*#include\s+"([^"]+)"/gm;

  let match;
  while ((match = angled.exec(docText)) !== null) {
    if (match[1]) existing.add(normalizeInclude(match[1]));
  }
  while ((match = quoted.exec(docText)) !== null) {
    if (match[1]) existing.add(normalizeInclude(match[1]));
  }

  return existing;
};

const findInsertionLine = docText => {
  const lines = docText.split(/\r?\n/);
  let lastIncludeLine = -1;

  for (let i = 0; i < lines.length; i++) {
    if (INCLUDE_LINE_REGEX.test(lines[i])) {
      lastIncludeLine = i;
    }
  }

  return lastIncludeLine + 1;
};

const attachIncludeEdits = (items, document, enabled = true) => {
  if (!enabled || !Array.isArray(items) || items.length === 0) {
    return items;
  }

  try {
    const docText = document.getText();
    const requiredSet = new Set();

    for (const item of items) {
      if (item && typeof item.requiredInclude === 'string' && item.requiredInclude) {
        requiredSet.add(item.requiredInclude);
      }
    }

    if (requiredSet.size === 0) {
      return items;
    }

    const existing = collectExistingIncludes(docText);
    const missing = [...requiredSet].filter(name => !existing.has(normalizeInclude(name)));

    if (missing.length === 0) {
      return items;
    }

    const missingSet = new Set(missing);
    const insertLine = findInsertionLine(docText);
    const editFor = includeName =>
      TextEdit.insert(new Position(insertLine, 0), `#include <${includeName}>\n`);

    return items.map(item => {
      if (
        item &&
        typeof item.requiredInclude === 'string' &&
        item.requiredInclude &&
        missingSet.has(item.requiredInclude)
      ) {
        return {
          ...item,
          additionalTextEdits: [editFor(item.requiredInclude)],
        };
      }

      return item;
    });
  } catch (error) {
    console.error(`[AutoIt Extension] attachIncludeEdits: ${error.message}`);
    return items;
  }
};

export default attachIncludeEdits;
export { attachIncludeEdits };
