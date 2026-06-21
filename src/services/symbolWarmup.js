// src/services/symbolWarmup.js
import { window, workspace } from 'vscode';
import { indexDocument } from './symbolIndex';

const DEFAULT_MAX_WORKSPACE_SYMBOL_FILES = 500;
const DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE = 10;

/**
 * Build (or rebuild) the workspace symbol index: find all AutoIt scripts and
 * index them in batches, yielding between batches so the UI stays responsive.
 * Populates the shared symbolsCache / includeEdges directly.
 * @param {import('vscode').CancellationToken} [token] - Cancellation token to abort processing.
 * @returns {Promise<void>}
 */
async function buildWorkspaceIndex(token) {
  const config = workspace.getConfiguration('autoit');
  const maxFiles = config.get('workspaceSymbolMaxFiles', DEFAULT_MAX_WORKSPACE_SYMBOL_FILES);
  const batchSize = config.get('workspaceSymbolBatchSize', DEFAULT_WORKSPACE_SYMBOL_BATCH_SIZE);

  const workspaceScripts = await workspace.findFiles('**/*.{au3,a3x}');

  // Limit number of files to process
  const files = workspaceScripts.slice(0, maxFiles);

  if (workspaceScripts.length > maxFiles) {
    window.showWarningMessage(
      `AutoIt: Processing ${maxFiles} of ${workspaceScripts.length} files. Increase 'autoit.workspaceSymbolMaxFiles' to index more files.`,
    );
  }

  for (let i = 0; i < files.length; i += batchSize) {
    // On cancellation the partially-built cache is intentionally kept: the index is
    // incrementally maintained (the file watcher refreshes it), so partial data is useful.
    if (token?.isCancellationRequested) break;

    const batch = files.slice(i, i + batchSize);

    // Index batch in parallel. indexDocument writes symbols + include edges
    // directly into the shared cache and is internally resilient; guard only
    // the document open so a file that vanished after findFiles is skipped.
    await Promise.all(
      batch.map(async file => {
        try {
          const doc = await workspace.openTextDocument(file);
          await indexDocument(doc);
        } catch {
          // Skip files that can't be opened
        }
      }),
    );

    // Yield control to prevent UI freezing
    await new Promise(resolve => setImmediate(resolve));
  }
}

// --- background warm-up ---
let warmState = 'cold'; // 'cold' | 'warming' | 'warm'
let warmPromise = null;
let builder = buildWorkspaceIndex; // injectable for tests

/**
 * Idempotently warm the index in the background. Safe to call repeatedly.
 *
 * The build is run as a single shared, non-cancellable background warm-up:
 * concurrent callers coalesce onto the one in-flight build rather than each
 * starting their own, so we deliberately do not thread a per-request
 * cancellation token into it.
 *
 * @returns {Promise<void>} Resolves when the warm-up settles. This promise
 *   NEVER rejects — build failures are swallowed (state is reset to 'cold' so
 *   the next call retries). Callers must re-check `isWarm()`/cache state rather
 *   than relying on rejection to detect failure.
 */
function ensureWarm() {
  if (warmState !== 'cold') return warmPromise;
  warmState = 'warming';
  warmPromise = Promise.resolve()
    .then(() => builder())
    .then(() => {
      warmState = 'warm';
    })
    .catch(err => {
      warmState = 'cold';
      warmPromise = null;
      console.error('AutoIt: symbol index warm-up failed', err);
    });
  return warmPromise;
}

/** @returns {boolean} True once the background warm-up has completed. */
function isWarm() {
  return warmState === 'warm';
}

// --- test seams ---
function __resetForTests() {
  warmState = 'cold';
  warmPromise = null;
  builder = buildWorkspaceIndex;
}
function __setBuilderForTests(fn) {
  builder = fn;
}

export { buildWorkspaceIndex, ensureWarm, isWarm, __resetForTests, __setBuilderForTests };
