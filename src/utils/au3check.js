import { window } from 'vscode';
import { existsSync } from 'fs';
import { execFile } from 'child_process';
import { basename, dirname, sep } from 'path';
import { FORMATTER } from '../constants';

const validateCheckPath = checkPath => {
  if (!existsSync(checkPath)) {
    window.showErrorMessage(
      'Invalid Check Path! Please review AutoIt settings (Check Path in UI, autoit.checkPath in JSON)',
    );
    return false;
  }
  return true;
};

const handleCheckProcessError = (checkPath, error) => {
  const message = error?.message ?? String(error);
  window.showErrorMessage(`${checkPath} ${message}`);
};

const parseAu3CheckParameters = (documentText, includePaths) => {
  const params = [];

  includePaths.forEach(path => {
    params.push('-I', path);
  });

  const match = [...documentText.matchAll(/^\s*#AutoIt3Wrapper_AU3Check_Parameters=(.*)$/gm)].pop();
  if (match) {
    const paramString = match[1].trim();

    if (/(?:^|\s)-q\b/.test(paramString)) {
      params.push('-q');
    }
    if (/(?:^|\s)-d\b/.test(paramString)) {
      params.push('-d');
    }
    const warnRegex = /(-w-?)\s+([0-9]+)/g;
    let regexMatch;
    while ((regexMatch = warnRegex.exec(paramString)) !== null) {
      const [, param, value] = regexMatch;
      params.push(param, value);
    }
  }

  return params;
};

const runCheckProcess = (document, { checkPath, includePaths }) => {
  return new Promise((resolve, reject) => {
    let consoleOutput = '';
    const params = parseAu3CheckParameters(document.getText(), includePaths);

    const checkProcess = execFile(checkPath, [...params, document.fileName], {
      cwd: dirname(document.fileName),
    });

    checkProcess.stdout.on('data', data => {
      if (data.length === 0) {
        return;
      }
      consoleOutput += data.toString();
    });

    checkProcess.stderr.on('data', data => {
      if (!data || data.length === 0) {
        return;
      }
      console.error(`[AutoIt][extension] Au3Check stderr: ${data.toString()}`);
    });

    checkProcess.on('error', error => {
      reject(error);
    });

    checkProcess.on('close', () => {
      resolve(consoleOutput);
    });
  });
};

const shouldIgnoreDiagnostics = document => {
  const filePath = document.uri.fsPath;
  const fileName = basename(filePath);

  if (filePath.includes(sep + FORMATTER.BACKUP_DIR_NAME + sep)) {
    return true;
  }

  if (FORMATTER.BACKUP_FILE_SUFFIX_PATTERN.test(fileName)) {
    return true;
  }

  return false;
};

export {
  runCheckProcess,
  validateCheckPath,
  handleCheckProcessError,
  parseAu3CheckParameters,
  shouldIgnoreDiagnostics,
};
