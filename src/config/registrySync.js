import { execFile } from 'child_process';
import { window } from 'vscode';

/**
 * Sync resolved AutoIt include paths to the Windows registry so the
 * standalone AutoIt editor/compiler (which reads HKCU, not VS Code settings)
 * sees the same Include paths. See F19 in docs/tech-debt-assessment.md.
 * @param {string[]} resolvedIncludePaths
 */
export function syncIncludePathsToRegistry(resolvedIncludePaths) {
  const includePathsString = resolvedIncludePaths.join(';');
  execFile(
    'reg',
    [
      'add',
      'HKCU\\Software\\AutoIt v3\\AutoIt',
      '/v',
      'Include',
      '/t',
      'REG_SZ',
      '/d',
      includePathsString,
      '/f',
    ],
    (error, stdout, stderr) => {
      if (error) {
        window.showErrorMessage(`Error updating registry: ${error.message}`);
        return;
      }
      if (stderr) {
        window.showErrorMessage(`Registry stderr: ${stderr}`);
      }
    },
  );
}
