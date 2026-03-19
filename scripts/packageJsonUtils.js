const { readFileSync, writeFileSync, copyFileSync, unlinkSync } = require('fs');
const { join } = require('path');

const rootDir = join(__dirname, '..');
const packageJsonPath = join(rootDir, 'package.json');
const backupPath = join(rootDir, 'package.json.backup');
const JSON_INDENTATION = 2;

/**
 * Read and parse package.json
 */
function readPackageJson() {
  const content = readFileSync(packageJsonPath, 'utf8');
  return JSON.parse(content);
}

/**
 * Write package.json with formatting
 */
function writePackageJson(data) {
  writeFileSync(packageJsonPath, JSON.stringify(data, null, JSON_INDENTATION) + '\n', 'utf8');
}

/**
 * Restore package.json from backup
 */
function restorePackageJson(successMessage = '✓ Restored original package.json') {
  try {
    copyFileSync(backupPath, packageJsonPath);
    unlinkSync(backupPath);
    console.log(successMessage);
  } catch (error) {
    console.error('Error restoring package.json:', error.message);
    throw error;
  }
}

module.exports = {
  rootDir,
  packageJsonPath,
  backupPath,
  readPackageJson,
  writePackageJson,
  restorePackageJson,
};
