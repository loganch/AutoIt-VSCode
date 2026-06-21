import { languages, window, workspace } from 'vscode';
import { existsSync } from 'fs';
import { DEFAULT_MAX_INCLUDE_DEPTH } from './constants';
import languageConfiguration from './languageConfiguration';
import hoverFeature from './providers/ai_hover';
import completionFeature from './providers/ai_completion';
import symbolsFeature from './providers/ai_symbols';
import signaturesFeature, { signatureHoverProvider } from './providers/ai_signature';
import workspaceSymbolsFeature from './providers/ai_workspaceSymbols';
import goToDefinitionFeature from './providers/ai_definition';
import referencesFeature from './providers/ai_references';

import { registerCommands } from './registerCommands';
import { formatterProvider } from './providers/ai_formatter';
import {
  clearDiagnosticsOwnedBy,
  parseAu3CheckOutput,
  resetDiagnosticTracking,
} from './diagnosticUtils';
import { clearIncludeCache } from './utils/fsCache';
import { debugLog } from './debugLog';
import conf from './providers/ai_config';
import { warmDocument } from './services/symbolIndex';
import { ensureWarm } from './services/symbolWarmup';
import MapTrackingService from './services/MapTrackingService.js';
import VariableTrackingService from './services/VariableTrackingService.js';
import {
  runCheckProcess,
  validateCheckPath,
  handleCheckProcessError,
  shouldIgnoreDiagnostics,
} from './utils/au3check';

const { config } = conf;

// Debounce timers for file changes (Map<string, NodeJS.Timeout>)
const updateTimers = new Map();
const DEBOUNCE_DELAY = 300; // ms

// Last document.version successfully checked by Au3Check, keyed by URI string.
// Used to skip redundant checks (e.g. on tab switch) when the document is unchanged.
const lastCheckedVersions = new Map();

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

  // Skip if this exact document version was already checked (e.g. tab switch with no edits)
  const versionKey = document.uri.toString();
  if (lastCheckedVersions.get(versionKey) === document.version) {
    return;
  }

  try {
    const consoleOutput = await runCheckProcess(document, {
      checkPath: config.checkPath,
      includePaths: config.includePaths,
    });
    parseAu3CheckOutput(consoleOutput, diagnosticCollection, document.uri);
    // Cache only after a successful check so failures are retried next time
    lastCheckedVersions.set(versionKey, document.version);
  } catch (error) {
    handleCheckProcessError(config.checkPath, error);
  }
};

/**
 * Wires up Map/Variable tracking services and the document-lifecycle listeners
 * that keep them in sync. Returns the services so config-change handling can update them.
 */
const setupDocumentTracking = ctx => {
  // Initialize MapTrackingService
  const workspaceRoot = workspace.workspaceFolders?.[0]?.uri.fsPath || '';
  const autoitConfig = workspace.getConfiguration('autoit');
  const autoitIncludePaths = autoitConfig.get('includePaths', []);
  const maxIncludeDepth = autoitConfig.get('maps.includeDepth', DEFAULT_MAX_INCLUDE_DEPTH);

  const mapTrackingService = MapTrackingService.getInstance(
    workspaceRoot,
    autoitIncludePaths,
    maxIncludeDepth,
  );

  // Initialize VariableTrackingService
  const variableTrackingService = VariableTrackingService.getInstance(
    workspaceRoot,
    autoitIncludePaths,
    maxIncludeDepth,
  );

  // Immediate (non-debounced) sync of a document into both tracking services.
  // variableTrackingService can throw on malformed input; never let that abort
  // the surrounding event handler or open-document scan.
  const syncDocumentImmediate = (filePath, text) => {
    mapTrackingService.updateFile(filePath, text);
    try {
      variableTrackingService.updateFileImmediate(filePath, text);
    } catch (error) {
      console.error(
        `[AutoIt][extension] Failed to update variable tracking for file: ${filePath}. Error: ${error.message}`,
      );
    }
  };

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
      variableTrackingService.updateFileDebounced(filePath, document.getText());
      updateTimers.delete(filePath); // Clean up after execution
    }, DEBOUNCE_DELAY);

    updateTimers.set(filePath, timer);
  };

  // Handle document open: prioritized symbol-index warming (so the doc is
  // navigable without waiting for the background pass) plus immediate tracking.
  ctx.subscriptions.push(
    workspace.onDidOpenTextDocument(document => {
      if (document.languageId !== 'autoit') return;
      warmDocument(document);
      syncDocumentImmediate(document.uri.fsPath, document.getText());
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

        syncDocumentImmediate(filePath, document.getText());
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

        // Note: We keep the files in cache for includes
        // mapTrackingService.removeFile(filePath);
        // variableTrackingService.removeFile(filePath);
      }
    }),
  );

  // Parse all open AutoIt documents
  workspace.textDocuments.forEach(document => {
    if (document.languageId === 'autoit') {
      syncDocumentImmediate(document.uri.fsPath, document.getText());
    }
  });

  return { mapTrackingService, variableTrackingService };
};

/**
 * Keeps MapTrackingService/VariableTrackingService and the Au3Check version
 * cache in sync with `autoit.*` configuration changes.
 */
const setupConfigSync = (ctx, mapTrackingService, variableTrackingService) => {
  ctx.subscriptions.push(
    workspace.onDidChangeConfiguration(event => {
      // Au3Check behavior depends on these settings, not just document content, so
      // invalidate the version cache to force fresh diagnostics when they change.
      // Otherwise stale Problems output persists until the document is edited or reopened.
      if (
        event.affectsConfiguration('autoit.includePaths') ||
        event.affectsConfiguration('autoit.checkPath') ||
        event.affectsConfiguration('autoit.enableDiagnostics')
      ) {
        lastCheckedVersions.clear();
      }

      if (
        event.affectsConfiguration('autoit.includePaths') ||
        event.affectsConfiguration('autoit.maps.includeDepth')
      ) {
        const updatedWorkspaceRoot = workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const updatedConfig = workspace.getConfiguration('autoit');
        const updatedIncludePaths = updatedConfig.get('includePaths', []);
        const updatedMaxDepth = updatedConfig.get('maps.includeDepth', DEFAULT_MAX_INCLUDE_DEPTH);

        try {
          mapTrackingService.updateConfiguration(
            updatedWorkspaceRoot,
            updatedIncludePaths,
            updatedMaxDepth,
          );
        } catch (error) {
          console.error(
            `[AutoIt][extension] Failed to update MapTrackingService configuration for workspace: ${updatedWorkspaceRoot}. Config changed: includePaths or maps.includeDepth. Error: ${error.message}`,
          );
          // Continue execution - the service will keep using previous configuration
        }

        try {
          variableTrackingService.updateConfiguration(
            updatedWorkspaceRoot,
            updatedIncludePaths,
            updatedMaxDepth,
          );
        } catch (error) {
          console.error(
            `[AutoIt][extension] Failed to update VariableTrackingService configuration for workspace: ${updatedWorkspaceRoot}. Config changed: includePaths or maps.includeDepth. Error: ${error.message}`,
          );
          // Continue execution - the service will keep using previous configuration
        }
      }
    }),
  );
};

/**
 * Sets up the Au3Check diagnostic collection and the document-lifecycle
 * listeners that trigger/clear it. Windows-only, matching validateCheckPath's platform.
 */
const setupDiagnostics = ctx => {
  if (process.platform !== 'win32') return;

  const diagnosticCollection = languages.createDiagnosticCollection('autoit');
  ctx.subscriptions.push(diagnosticCollection);

  const diagnosticListeners = [];
  diagnosticListeners.push(
    workspace.onDidSaveTextDocument(document => checkAutoItCode(document, diagnosticCollection)),
  );
  diagnosticListeners.push(
    workspace.onDidOpenTextDocument(document => checkAutoItCode(document, diagnosticCollection)),
  );
  diagnosticListeners.push(
    workspace.onDidCloseTextDocument(document => {
      // Drop the cached check version so a reopened document is re-checked
      lastCheckedVersions.delete(document.uri.toString());
      // First remove all diagnostics owned by the closing document (including in included files)
      try {
        clearDiagnosticsOwnedBy(diagnosticCollection, document.uri);
      } catch (err) {
        // Optional debug logging to help diagnose cleanup failures without breaking the extension
        debugLog(
          `[AutoIt][extension] clearDiagnosticsOwnedBy failed during document close for ${document?.uri?.toString?.() ?? document?.fileName ?? 'unknown'}: ${err?.message ?? err}`,
        );
      }
      // Then remove any remaining diagnostics specifically for the closed document
      try {
        diagnosticCollection.delete(document.uri);
      } catch (err) {
        // Optional debug logging for delete failures
        debugLog(
          `[AutoIt][extension] diagnosticCollection.delete failed during document close for ${document?.uri?.toString?.() ?? document?.fileName ?? 'unknown'}: ${err?.message ?? err}`,
        );
      }
    }),
  );
  diagnosticListeners.push(
    window.onDidChangeActiveTextEditor(editor => {
      if (editor) {
        checkAutoItCode(editor.document, diagnosticCollection);
      }
    }),
  );

  ctx.subscriptions.push(...diagnosticListeners);

  // Run diagnostic on document that's open when the extension loads
  if (config.enableDiagnostics && window.activeTextEditor) {
    checkAutoItCode(window.activeTextEditor.document, diagnosticCollection);
  }
};

export const activate = ctx => {
  conf.init();

  const features = [
    hoverFeature,
    completionFeature,
    symbolsFeature,
    signaturesFeature,
    signatureHoverProvider,
    workspaceSymbolsFeature,
    goToDefinitionFeature,
    referencesFeature,
  ];

  // Only register formatter on Windows with valid paths
  if (validateFormatterPaths()) {
    features.push(formatterProvider);
  }

  ctx.subscriptions.push(...features);

  ctx.subscriptions.push(languages.setLanguageConfiguration('autoit', languageConfiguration));

  registerCommands(ctx);

  ensureWarm(); // warm the symbol index in the background for fast Go-to-Definition

  const { mapTrackingService, variableTrackingService } = setupDocumentTracking(ctx);
  setupConfigSync(ctx, mapTrackingService, variableTrackingService);
  setupDiagnostics(ctx);

  console.log('AutoIt is now active!');
};

export function deactivate() {
  // Clear all pending debounce timers
  updateTimers.forEach(timer => clearTimeout(timer));
  updateTimers.clear();
  lastCheckedVersions.clear();
  clearIncludeCache();
  resetDiagnosticTracking();
}
