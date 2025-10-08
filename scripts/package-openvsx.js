#!/usr/bin/env node

/**
 * Package AutoIt-VSCode extension for OpenVSX registry
 *
 * This script:
 * 1. Backs up the original package.json
 * 2. Temporarily changes the publisher to "loganch"
 * 3. Packages the extension with a custom filename
 * 4. Restores the original package.json
 */

import { readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
function restorePackageJson() {
  try {
    copyFileSync(backupPath, packageJsonPath);
    unlinkSync(backupPath);
    console.log('✓ Restored original package.json');
  } catch (error) {
    console.error('Error restoring package.json:', error.message);
    throw error;
  }
}

/**
 * Main packaging function
 */
function packageForOpenVSX() {
  let backupCreated = false;

  try {
    // Read original package.json
    const originalPackage = readPackageJson();
    const { name, version, publisher } = originalPackage;

    console.log(`\n📦 Packaging ${name} v${version} for OpenVSX`);
    console.log(`   Current publisher: ${publisher}`);
    console.log(`   OpenVSX publisher: loganch\n`);

    // Create backup
    copyFileSync(packageJsonPath, backupPath);
    backupCreated = true;
    console.log('✓ Created package.json backup');

    // Modify publisher
    const modifiedPackage = { ...originalPackage, publisher: 'loganch' };
    writePackageJson(modifiedPackage);
    console.log('✓ Updated publisher to "loganch"');

    // Build extension first
    console.log('\n🔨 Building extension...');
    execSync('npm run vscode:prepublish', {
      cwd: rootDir,
      stdio: 'inherit',
    });
    console.log('✓ Build completed');

    // Package with vsce
    console.log('\n📦 Creating .vsix package...');
    const vsixName = `${name}-${version}-openvsx.vsix`;

    try {
      execSync(`npx @vscode/vsce package --out ${vsixName}`, {
        cwd: rootDir,
        stdio: 'inherit',
      });
    } catch (error) {
      console.error('\n❌ Packaging failed. Make sure @vscode/vsce is installed:');
      console.error('   npm install --save-dev @vscode/vsce\n');
      throw error;
    }

    console.log(`\n✅ Successfully created: ${vsixName}`);
    console.log(`\n📤 To publish to OpenVSX, run:`);
    console.log(`   npx ovsx publish ${vsixName} -p <YOUR_ACCESS_TOKEN>\n`);
  } catch (error) {
    console.error('\n❌ Error during packaging:', error.message);
    process.exitCode = 1;
  } finally {
    // Always restore the original package.json
    if (backupCreated) {
      restorePackageJson();
    }
  }
}

// Run the script
packageForOpenVSX().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
