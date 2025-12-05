import { languages, window, workspace } from 'vscode';
import { basename, dirname, sep } from 'path';
import { existsSync } from 'fs';
import { execFile } from 'child_process';
import { FORMATTER } from './constants';
import languageConfiguration from './languageConfiguration';
import hoverFeature from './ai_hover';
import completionFeature from './ai_completion';
import symbolsFeature from './ai_symbols';
import signaturesFeature, { signatureHoverProvider } from './ai_signature';
import workspaceSymbolsFeature from './ai_workspaceSymbols';
import goToDefinitionFeature from './ai_definition';

import { registerCommands } from './registerCommands';
import { formatterProvider } from './ai_formatter';
import { clearDiagnosticsOwnedBy, parseAu3CheckOutput } from './diagnosticUtils';
import conf from './ai_config';
import MapTrackingService from './services/MapTrackingService.js';

const { config } = conf;

// Debounce timers for file changes (Map<string, NodeJS.Timeout>)
const updateTimers = new Map();
const DEBOUNCE_DELAY = 300; // ms

/**
 * Runs the check process for the given document and returns the console output.
 * @param {import('vscode').TextDocument} document - The document to run the AU3Check process on.
 * @returns {Promise<string>} A promise that resolves with the console output of the check process.
 */
const runCheckProcess = document => {
  return new Promise((resolve, reject) => {
    let consoleOutput = '';
    // Start with empty params - let Au3Check use its own defaults
    // Only add parameters from include paths and #AutoIt3Wrapper_AU3Check_Parameters directive
    // See https://www.autoitscript.com/autoit3/docs/intro/au3check.htm
    const params = [];

    // Add -I for each include path
    config.includePaths.forEach(path => {
      params.push('-I', path);
    });

    // Parse #AutoIt3Wrapper_AU3Check_Parameters directive if present
    const match = [
      ...document.getText().matchAll(/^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/gm),
    ].pop();
    if (match) {
      // Extract the parameter string after the = sign
      const paramString = match[1].trim();

      // Parse standalone flags first: -q (quiet) and -d (must declare vars)
      // These flags are safe because they don't alter the output format:
      // - -q: suppresses info messages, keeps error/warning format
      // - -d: enables additional checks, produces standard format errors
      if (/(?:^|\s)-q\b/.test(paramString)) {
        params.push('-q');
      }
      if (/(?:^|\s)-d\b/.test(paramString)) {
        params.push('-d');
      }
      // Parse -w (warning) parameters: -w or -w- followed by a number
      // Append all warning parameters from the directive
      const warnRegex = /(-w-?)\s+([0-9]+)/g;
      let regexMatch;
      while ((regexMatch = warnRegex.exec(paramString)) !== null) {
        const [, param, value] = regexMatch;
        params.push(param, value);
      }

      // NOTE: -v (verbosity) parameters are intentionally NOT supported here
      // Verbosity flags (-v 1, -v 2, -v 3) add extra output lines that would break
      // the diagnostic parser which expects a specific format:
      //   "file.au3"(line,col) : severity: message
      // See diagnosticUtils.js OUTPUT_REGEXP for the expected format
    }
    const checkProcess = execFile(config.checkPath, [...params, document.fileName], {
      cwd: dirname(document.fileName),
    });

    checkProcess.stdout.on('data', data => {
      if (data.length === 0) {
        return;
      }
      consoleOutput += data.toString();
    });

    checkProcess.stderr.on('error', error => {
      reject(error);
    });

    checkProcess.on('close', () => {
      resolve(consoleOutput);
    });
  });
};

const handleCheckProcessError = error => {
  window.showErrorMessage(`${config.checkPath} ${error}`);
};

const validateCheckPath = checkPath => {
  if (!existsSync(checkPath)) {
    window.showErrorMessage(
      'Invalid Check Path! Please review AutoIt settings (Check Path in UI, autoit.checkPath in JSON)',
    );
    return false;
  }
  return true;
};

/**
 * Validates if the formatter can be used (Windows platform and valid paths)
 * @returns {boolean} True if formatter should be enabled
 */
const validateFormatterPaths = () => {
  // Only available on Windows
  if (process.platform !== 'win32') {
    return false;
  }

  // Check if required paths exist
  const { aiPath, wrapperPath } = conf;
  if (!aiPath || !wrapperPath) {
    return false;
  }

  if (!existsSync(aiPath) || !existsSync(wrapperPath)) {
    return false;
  }

  return true;
};

/**
 * Checks if a document should be ignored by diagnostics (AutoIt Tidy backup files)
 * @param {import('vscode').TextDocument} document - Document to check
 * @returns {boolean} True if document should be ignored
 */
const shouldIgnoreDiagnostics = document => {
  const filePath = document.uri.fsPath;
  const fileName = basename(filePath);

  // Ignore files in "BackUp" folder
  if (filePath.includes(sep + FORMATTER.BACKUP_DIR_NAME + sep)) {
    return true;
  }

  // Ignore *_old*.au3 files
  if (FORMATTER.BACKUP_FILE_SUFFIX_PATTERN.test(fileName)) {
    return true;
  }

  return false;
};

/**
 * Checks the AutoIt code in the given document and updates the diagnostic collection.
 * @param {import('vscode').TextDocument} document - The document to check.
 * @param {import('vscode').DiagnosticCollection} diagnosticCollection - The diagnostic collection to update.
 */
const checkAutoItCode = async (document, diagnosticCollection) => {
  if (!config.enableDiagnostics) {
    diagnosticCollection.clear();
    return;
  }

  if (document.languageId !== 'autoit') return;

  // Ignore backup files from AutoIt Tidy
  if (shouldIgnoreDiagnostics(document)) {
    diagnosticCollection.delete(document.uri);
    return;
  }

  const { checkPath } = config;
  if (!validateCheckPath(checkPath)) return;

  try {
    const consoleOutput = await runCheckProcess(document);
    parseAu3CheckOutput(consoleOutput, diagnosticCollection, document.uri);
  } catch (error) {
    handleCheckProcessError(error);
  }
};

export const activate = ctx => {
  const features = [
    hoverFeature,
    completionFeature,
    symbolsFeature,
    signaturesFeature,
    signatureHoverProvider,
    workspaceSymbolsFeature,
    goToDefinitionFeature,
  ];

  // Only register formatter on Windows with valid paths
  if (validateFormatterPaths()) {
    features.push(formatterProvider);
  }

  ctx.subscriptions.push(...features);

  ctx.subscriptions.push(languages.setLanguageConfiguration('autoit', languageConfiguration));

  registerCommands(ctx);

  // Initialize MapTrackingService
  const workspaceRoot = workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  const autoitConfig = workspace.getConfiguration('autoit');
  const autoitIncludePaths = autoitConfig.get('includePaths', []);
  const maxIncludeDepth = autoitConfig.get('maps.includeDepth', 3);

  const mapTrackingService = MapTrackingService.getInstance(
    workspaceRoot,
    autoitIncludePaths,
    maxIncludeDepth,
  );

  // Track document changes with debouncing
  const onDocumentChange = document => {
    if (document.languageId !== 'autoit') return;

    const filePath = document.uri.fsPath;

    // Clear existing timer for this specific document
    if (updateTimers.has(filePath)) {
      clearTimeout(updateTimers.get(filePath));
    }

    // Set new timer for this document
    const timer = setTimeout(() => {
      mapTrackingService.updateFile(filePath, document.getText());
      updateTimers.delete(filePath); // Clean up after execution
    }, DEBOUNCE_DELAY);

    updateTimers.set(filePath, timer);
  };

  // Handle document open
  ctx.subscriptions.push(
    workspace.onDidOpenTextDocument(document => {
      if (document.languageId === 'autoit') {
        mapTrackingService.updateFile(document.uri.fsPath, document.getText());
      }
    }),
  );

  // Handle document change (debounced)
  ctx.subscriptions.push(
    workspace.onDidChangeTextDocument(event => {
      onDocumentChange(event.document);
    }),
  );

  // Handle document save (immediate update)
  ctx.subscriptions.push(
    workspace.onDidSaveTextDocument(document => {
      if (document.languageId === 'autoit') {
        const filePath = document.uri.fsPath;

        // Cancel debounce for this specific document
        if (updateTimers.has(filePath)) {
          clearTimeout(updateTimers.get(filePath));
          updateTimers.delete(filePath);
        }

        mapTrackingService.updateFile(filePath, document.getText());
      }
    }),
  );

  // Handle document close
  ctx.subscriptions.push(
    workspace.onDidCloseTextDocument(document => {
      if (document.languageId === 'autoit') {
        const filePath = document.uri.fsPath;

        // Cancel and clean up timer for this specific document
        if (updateTimers.has(filePath)) {
          clearTimeout(updateTimers.get(filePath));
          updateTimers.delete(filePath);
        }

        // Note: We keep the file in cache for includes
        // mapTrackingService.removeFile(filePath);
      }
    }),
  );

  // Parse all open AutoIt documents
  workspace.textDocuments.forEach(document => {
    if (document.languageId === 'autoit') {
      mapTrackingService.updateFile(document.uri.fsPath, document.getText());
    }
  });

  // Handle configuration changes
  ctx.subscriptions.push(
    workspace.onDidChangeConfiguration(event => {
      if (
        event.affectsConfiguration('autoit.includePaths') ||
        event.affectsConfiguration('autoit.maps.includeDepth')
      ) {
        const updatedWorkspaceRoot = workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const updatedConfig = workspace.getConfiguration('autoit');
        const updatedIncludePaths = updatedConfig.get('includePaths', []);
        const updatedMaxDepth = updatedConfig.get('maps.includeDepth', 3);

        mapTrackingService.updateConfiguration(
          updatedWorkspaceRoot,
          updatedIncludePaths,
          updatedMaxDepth,
        );
      }
    }),
  );

  if (process.platform === 'win32') {
    const diagnosticCollection = languages.createDiagnosticCollection('autoit');
    ctx.subscriptions.push(diagnosticCollection);

    workspace.onDidSaveTextDocument(document => checkAutoItCode(document, diagnosticCollection));
    workspace.onDidOpenTextDocument(document => checkAutoItCode(document, diagnosticCollection));
    workspace.onDidCloseTextDocument(document => {
      // First remove all diagnostics owned by the closing document (including in included files)
      try {
        clearDiagnosticsOwnedBy(diagnosticCollection, document.uri);
      } catch (err) {
        // Optional debug logging to help diagnose cleanup failures without breaking the extension
        try {
          const cfg = workspace.getConfiguration('autoit');
          const dbg = cfg?.get?.('debugLogging') === true;
          const msg = `[AutoIt][extension] clearDiagnosticsOwnedBy failed during document close for ${document?.uri?.toString?.() ?? document?.fileName ?? 'unknown'}: ${err?.message ?? err}`;
          if (dbg) {
            console.debug(msg);
          }
        } catch {
          // swallow any logging errors
        }
      }
      // Then remove any remaining diagnostics specifically for the closed document
      try {
        diagnosticCollection.delete(document.uri);
      } catch (err) {
        // Optional debug logging for delete failures
        try {
          const cfg = workspace.getConfiguration('autoit');
          const dbg = cfg?.get?.('debugLogging') === true;
          const msg = `[AutoIt][extension] diagnosticCollection.delete failed during document close for ${document?.uri?.toString?.() ?? document?.fileName ?? 'unknown'}: ${err?.message ?? err}`;
          if (dbg) {
            console.debug(msg);
          }
        } catch {
          // swallow any logging errors
        }
      }
    });
    window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        checkAutoItCode(editor.document, diagnosticCollection);
      }
    });

    // Run diagnostic on document that's open when the extension loads
    if (config.enableDiagnostics && window.activeTextEditor) {
      checkAutoItCode(window.activeTextEditor.document, diagnosticCollection);
    }
  }

  console.log('AutoIt is now active!');
};

export function deactivate() {
  // Clear all pending debounce timers
  updateTimers.forEach(timer => clearTimeout(timer));
  updateTimers.clear();
}
