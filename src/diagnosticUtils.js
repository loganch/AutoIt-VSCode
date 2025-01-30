import { Diagnostic, DiagnosticSeverity, Range, Position, Uri } from 'vscode';

/**
 * Returns the diagnostic severity based on the severity string.
 * @param {string} severityString - The severity string to convert to DiagnosticSeverity.
 * @returns {DiagnosticSeverity} - The DiagnosticSeverity based on the severity string.
 */
export const getDiagnosticSeverity = severityString => {
  switch (severityString) {
    case 'warning':
      return DiagnosticSeverity.Warning;
    default:
      return DiagnosticSeverity.Error;
  }
};

/**
 * Returns a diagnostic range for a given line and position.
 * @param {number} line - The line number.
 * @param {number} position - The position number.
 * @returns {Range} - The diagnostic range.
 */
export const createDiagnosticRange = (line, position) => {
  const diagnosticPosition = new Position(parseInt(line, 10) - 1, parseInt(position, 10) - 1);

  return new Range(diagnosticPosition, diagnosticPosition);
};

/**
 * Adds a new diagnostic to a Map of diagnostics.
 * @param {Map} diagnostics - The current diagnostics object.
 * @param {string} scriptPath - The path of the script that the diagnostic is for.
 * @param {Diagnostic} diagnosticToAdd - The new diagnostics object to add.
 */
export const updateDiagnostics = (diagnostics, scriptPath, diagnosticToAdd) => {
  const diagnosticArray = diagnostics.get(scriptPath) || [];
  diagnosticArray.push(diagnosticToAdd);
  diagnostics.set(scriptPath, diagnosticArray);
};

const OUTPUT_REGEXP = /"(?<scriptPath>.+)"\((?<line>\d{1,4}),(?<position>\d{1,4})\)\s:\s(?<severity>warning|error):\s(?<description>.+)\r/gm;

/**
 * Processes the results of AU3Check, identifies warnings and errors.
 * @param {string} output Text returned from AU3Check.
 * @param {DiagnosticCollection} collection - The diagnostic collection to update.
 * @param {Uri} documentURI - The URI of the document that was checked
 */
export const parseAu3CheckOutput = (output, collection, documentURI) => {
  if (output.includes('- 0 error(s), 0 warning(s)')) {
    collection.delete(documentURI);
    return;
  }

  const diagnostics = new Map();

  const matches = [...output.matchAll(OUTPUT_REGEXP)];
  matches.forEach(match => {
    const { line, position, severity, scriptPath, description } = match.groups;
    const diagnosticRange = createDiagnosticRange(line, position);
    const diagnosticSeverity = getDiagnosticSeverity(severity);

    const diagnosticToAdd = new Diagnostic(diagnosticRange, description, diagnosticSeverity);

    // The determined file path (scriptPath) from the AU3Check output will
    // not be used, because AU3Check returns a wrong encoded string in case
    // of special characters like german umlauts (ä, ü, ö) or spanish chars
    // like "ñ" etc. This behavior will not be fixed soon for AU3Check, so
    // the documentURI path is used instead, which is correct.
    const file = documentURI.path.replace(/^\/([a-z]):/, '$1:').replace(/\//g, '\\');

    updateDiagnostics(diagnostics, file, diagnosticToAdd);
  });

  diagnostics.forEach((diagnosticArray, file) => {
    collection.set(Uri.file(file), diagnosticArray);
  });
};

export default parseAu3CheckOutput;
