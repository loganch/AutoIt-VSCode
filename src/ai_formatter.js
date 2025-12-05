import { Position, Range, TextEdit, Uri, languages, window, workspace } from 'vscode';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import conf from './ai_config';
import { FORMATTER } from './constants';

/**
 * AutoIt document formatter provider that integrates with AutoIt3Wrapper Tidy
 * Handles formatting of AutoIt (.au3) files using the external Tidy tool
 */
const AutoItFormatterProvider = {
  /**
   * Provides formatting edits for the entire AutoIt document
   * @param {TextDocument} document - The document to format
   * @returns {Promise<TextEdit[]>} Array of text edits to apply formatting
   */
  provideDocumentFormattingEdits: async document => {
    console.log('[AutoIt Formatter] Starting document formatting');

    // Input validation
    if (!document) {
      window.showErrorMessage('No document provided for formatting');
      return [];
    }

    if (!document.getText || document.getText().trim() === '') {
      window.showErrorMessage('Document is empty or invalid');
      return [];
    }

    const workspaceFolder = workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceFolder) {
      window.showErrorMessage('No workspace folder open');
      return [];
    }

    const tempFile = generateTempFilePath(workspaceFolder);
    const backupDir = path.join(workspaceFolder, FORMATTER.BACKUP_DIR_NAME);

    console.log(`[AutoIt Formatter] Workspace: ${workspaceFolder}`);
    console.log(`[AutoIt Formatter] Temp file: ${tempFile}`);
    console.log(`[AutoIt Formatter] Backup dir: ${backupDir}`);

    try {
      const startTime = Date.now();

      // Ensure backup directory exists
      await ensureDirectoryExists(backupDir);
      console.log(`[AutoIt Formatter] Backup directory ready: ${backupDir}`);

      // Write document content to temporary file asynchronously
      const documentContent = document.getText();
      console.log(`[AutoIt Formatter] Writing ${documentContent.length} characters to temp file`);
      await workspace.fs.writeFile(Uri.file(tempFile), Buffer.from(documentContent));

      // Execute Tidy formatting on the temporary file
      await runTidy(tempFile);

      // Read the formatted content back
      const formattedContent = await workspace.fs.readFile(Uri.file(tempFile));
      const formattedText = formattedContent.toString();
      console.log(`[AutoIt Formatter] Read ${formattedText.length} characters from formatted file`);

      // Validate that formatting produced valid content
      if (!formattedText || formattedText.trim() === '') {
        throw new Error('Tidy produced empty or invalid output');
      }

      const endTime = Date.now();
      console.log(`[AutoIt Formatter] Formatting completed in ${endTime - startTime}ms`);

      return [TextEdit.replace(fullDocumentRange(document), formattedText)];
    } catch (error) {
      const errorMessage = `AutoIt Formatting Error: ${error.message}`;
      window.showErrorMessage(errorMessage);
      console.error('[AutoIt Formatter] Error details:', error);
      return [];
    } finally {
      // Clean up temporary and backup files asynchronously
      console.log('[AutoIt Formatter] Starting cleanup');
      await cleanupFiles(tempFile, backupDir);
    }
  },
};

/**
 * Registers the AutoIt formatter provider with VS Code
 */
export const formatterProvider = languages.registerDocumentFormattingEditProvider(
  'autoit',
  AutoItFormatterProvider,
);

/**
 * Executes the AutoIt3Wrapper Tidy command on the specified file
 * @param {string} filePath - Path to the file to format
 * @returns {Promise<void>} Resolves when formatting completes successfully
 * @throws {Error} If Tidy process fails or times out
 */
async function runTidy(filePath) {
  return new Promise((resolve, reject) => {
    console.log(`[AutoIt Formatter] Starting Tidy process for: ${filePath}`);

    // Validate input parameters
    if (!filePath || typeof filePath !== 'string') {
      reject(new Error('Invalid file path provided to runTidy'));
      return;
    }

    if (!fsSync.existsSync(filePath)) {
      reject(new Error(`Source file does not exist: ${filePath}`));
      return;
    }

    // Check if config paths exist
    if (!fsSync.existsSync(conf.config.aiPath)) {
      reject(new Error(`AutoIt executable not found: ${conf.config.aiPath}`));
      return;
    }

    if (!fsSync.existsSync(conf.config.wrapperPath)) {
      reject(new Error(`Wrapper not found: ${conf.config.wrapperPath}`));
      return;
    }

    console.log(
      `[AutoIt Formatter] Command: ${conf.config.aiPath} ${conf.config.wrapperPath} /Tidy /in ${filePath}`,
    );

    // Spawn Tidy process with proper error handling
    const tidyProcess = spawn(conf.config.aiPath, [
      conf.config.wrapperPath,
      '/Tidy',
      '/in',
      filePath,
      {
        stdio: 'pipe', // Ensure proper stdio handling
        cwd: path.dirname(filePath), // Set working directory to file location
      },
    ]);

    let stdoutData = '';
    let stderrData = '';

    let hasExited = false;
    const timeoutId = setTimeout(() => {
      if (!hasExited && !tidyProcess.killed) {
        hasExited = true;
        tidyProcess.kill('SIGTERM'); // Use SIGTERM for graceful shutdown
        reject(new Error(`Tidy process timed out after ${FORMATTER.TIDY_TIMEOUT_MS}ms`));
      }
    }, FORMATTER.TIDY_TIMEOUT_MS);

    // Capture stdout and stderr
    tidyProcess.stdout.on('data', data => {
      stdoutData += data.toString();
      console.log(`[AutoIt Formatter] Tidy stdout: ${data.toString().trim()}`);
    });

    tidyProcess.stderr.on('data', data => {
      stderrData += data.toString();
      console.error(`[AutoIt Formatter] Tidy stderr: ${data.toString().trim()}`);
    });

    // Handle process exit with proper validation
    const handleExit = code => {
      if (hasExited) return; // Prevent multiple exit handlers
      hasExited = true;

      clearTimeout(timeoutId);

      console.log(`[AutoIt Formatter] Tidy exited with code: ${code}`);

      if (stdoutData) {
        console.log(`[AutoIt Formatter] Final stdout: ${stdoutData.trim()}`);
      }

      if (stderrData) {
        console.error(`[AutoIt Formatter] Final stderr: ${stderrData.trim()}`);
      }

      if (code === 0) {
        resolve();
      } else {
        const errorMsg = stderrData || stdoutData || `Tidy exited with code ${code}`;
        reject(new Error(`Tidy failed: ${errorMsg}`));
      }
    };

    // Handle process errors
    const handleError = error => {
      if (hasExited) return;
      hasExited = true;

      clearTimeout(timeoutId);
      console.error(`[AutoIt Formatter] Process error: ${error.message}`);
      reject(new Error(`Failed to start Tidy process: ${error.message}`));
    };

    // Set up event listeners
    tidyProcess.on('exit', handleExit);
    tidyProcess.on('error', handleError);
  });
}

/**
 * Generates a unique temporary file path for formatting operations
 * @param {string} workspaceFolder - The workspace folder path
 * @returns {string} Unique temporary file path
 */
function generateTempFilePath(workspaceFolder) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const fileName = `${FORMATTER.TEMP_FILE_PREFIX}${timestamp}_${randomSuffix}${FORMATTER.FILE_EXTENSION}`;
  return path.join(workspaceFolder, fileName);
}

/**
 * Ensures the specified directory exists, creating it if necessary
 * @param {string} dirPath - Directory path to ensure exists
 * @returns {Promise<void>}
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    // Directory doesn't exist, create it
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Cleans up temporary and backup files after formatting operation
 * @param {string} tempFile - Path to the temporary file
 * @param {string} backupDir - Path to the backup directory
 * @returns {Promise<void>}
 */
async function cleanupFiles(tempFile, backupDir) {
  const cleanupPromises = [];

  // Clean up temporary file
  cleanupPromises.push(
    safeDeleteFile(tempFile).catch(error =>
      console.warn(`Failed to cleanup temp file ${tempFile}:`, error.message),
    ),
  );

  // Clean up backup file if it exists
  const backupFile = path.join(
    backupDir,
    path.basename(tempFile, FORMATTER.FILE_EXTENSION) + FORMATTER.BACKUP_FILE_SUFFIX,
  );
  cleanupPromises.push(
    safeDeleteFile(backupFile).catch(error =>
      console.warn(`Failed to cleanup backup file ${backupFile}:`, error.message),
    ),
  );

  // Wait for all cleanup operations to complete
  await Promise.allSettled(cleanupPromises);
}

/**
 * Safely deletes a file if it exists, with proper error handling
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<void>}
 */
async function safeDeleteFile(filePath) {
  try {
    // Check if file exists before attempting deletion
    await fs.access(filePath);
    await fs.unlink(filePath);
  } catch (error) {
    // Re-throw if it's not a "file not found" error
    if (error.code !== 'ENOENT') {
      throw error;
    }
    // File doesn't exist, which is fine for cleanup
  }
}

/**
 * Creates a range covering the entire document for replacement
 * @param {TextDocument} document - The document to create range for
 * @returns {Range} Range covering the entire document
 */
function fullDocumentRange(document) {
  const lastLine = document.lineAt(document.lineCount - 1);
  return new Range(new Position(0, 0), new Position(document.lineCount - 1, lastLine.text.length));
}
