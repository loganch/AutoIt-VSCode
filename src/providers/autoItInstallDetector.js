import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const isWinOS = process.platform === 'win32';

/**
 * Detect AutoIt3 installation directories on Windows: checks the registry
 * (64-bit then 32-bit view) and a handful of well-known Program Files paths.
 * @returns {string[]} directories containing AutoIt3.exe
 */
export function detectAutoItPaths() {
  if (!isWinOS) return [];

  const potentialPaths = [
    'C:\\Program Files (x86)\\AutoIt3',
    'C:\\Program Files\\AutoIt3',
    'C:\\AutoIt3',
    process.env.PROGRAMFILES ? `${process.env.PROGRAMFILES}\\AutoIt3` : null,
    process.env['PROGRAMFILES(X86)'] ? `${process.env['PROGRAMFILES(X86)']}\\AutoIt3` : null,
  ].filter(Boolean);

  try {
    const regResult = execSync(
      'reg query "HKLM\\SOFTWARE\\AutoIt v3\\AutoIt" /v InstallDir 2>nul',
      { encoding: 'utf8' },
    );
    const match = regResult.match(/InstallDir\s+REG_SZ\s+(.+)/);
    if (match && match[1]) {
      potentialPaths.unshift(match[1].trim());
    }
  } catch (error) {
    // Try 32-bit registry view
    try {
      const regResult32 = execSync(
        'reg query "HKLM\\SOFTWARE\\WOW6432Node\\AutoIt v3\\AutoIt" /v InstallDir 2>nul',
        { encoding: 'utf8' },
      );
      const match32 = regResult32.match(/InstallDir\s+REG_SZ\s+(.+)/);
      if (match32 && match32[1]) {
        potentialPaths.unshift(match32[1].trim());
      }
    } catch (error32) {
      // Registry queries failed in both views, keep using default paths.
      console.debug('[autoit] Registry InstallDir lookup failed; using default install paths.', {
        error,
        error32,
      });
    }
  }

  return potentialPaths.filter(p => {
    try {
      return p && fs.existsSync(path.join(p, 'AutoIt3.exe'));
    } catch {
      return false;
    }
  });
}
