#!/usr/bin/env node

/**
 * Package AutoIt-VSCode extension for both VS Code Marketplace and OpenVSX
 *
 * This script:
 * 1. Builds the extension once
 * 2. Packages for VS Code Marketplace (publisher: Damien)
 * 3. Packages for OpenVSX (publisher: loganch)
 * 4. Restores original package.json
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

// JSON formatting constant (avoid ESLint magic number)
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
    console.log('✓ Restored original package.json\n');
  } catch (error) {
    console.error('Error restoring package.json:', error.message);
    throw error;
  }
}

/**
 * Package extension with specific publisher
 */
function packageExtension(publisher, outputName) {
  try {
    execSync(`npx @vscode/vsce package --out ${outputName}`, {
      cwd: rootDir,
      stdio: 'inherit',
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Packaging failed for ${publisher}`);
    throw error;
  }
}

/**
 * Main packaging function
 */
function packageAll() {
  let backupCreated = false;
  const createdFiles = [];

  try {
    // Read original package.json
    const originalPackage = readPackageJson();
    const { name, version, publisher: originalPublisher } = originalPackage;

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  AutoIt-VSCode Dual Marketplace Packaging                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
    console.log(`📦 Extension: ${name} v${version}\n`);

    // Create backup
    copyFileSync(packageJsonPath, backupPath);
    backupCreated = true;
    console.log('✓ Created package.json backup\n');

    // Build extension once
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🔨 Building extension...');
    console.log('═══════════════════════════════════════════════════════════\n');
    execSync('npm run vscode:prepublish', {
      cwd: rootDir,
      stdio: 'inherit',
    });
    console.log('\n✓ Build completed\n');

    // Package 1: VS Code Marketplace (Damien)
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📦 Packaging for VS Code Marketplace');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Publisher: ${originalPublisher}`);
    const vscodeVsixName = `${name}-${version}.vsix`;
    console.log(`   Output: ${vscodeVsixName}\n`);

    packageExtension(originalPublisher, vscodeVsixName);
    createdFiles.push({
      name: vscodeVsixName,
      marketplace: 'VS Code Marketplace',
      publisher: originalPublisher,
    });
    console.log(`\n✅ Created: ${vscodeVsixName}\n`);

    // Package 2: OpenVSX (loganch)
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📦 Packaging for OpenVSX');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   Publisher: loganch');
    const openvsxVsixName = `${name}-${version}-openvsx.vsix`;
    console.log(`   Output: ${openvsxVsixName}\n`);

    // Modify publisher for OpenVSX
    const modifiedPackage = { ...originalPackage, publisher: 'loganch' };
    writePackageJson(modifiedPackage);
    console.log('✓ Updated publisher to "loganch"');

    packageExtension('loganch', openvsxVsixName);
    createdFiles.push({
      name: openvsxVsixName,
      marketplace: 'OpenVSX',
      publisher: 'loganch',
    });
    console.log(`\n✅ Created: ${openvsxVsixName}\n`);

    // Summary
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ PACKAGING COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');

    console.log('📦 Created packages:\n');
    createdFiles.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file.name}`);
      console.log(`      → ${file.marketplace} (${file.publisher})\n`);
    });

    console.log('📤 Publishing instructions:\n');
    console.log(`   VS Code Marketplace:`);
    console.log(`   $ npx @vscode/vsce publish\n`);
    console.log(`   OpenVSX:`);
    console.log(`   $ npx ovsx publish ${openvsxVsixName}`);
    console.log(
      '   (Authenticate with OpenVSX using your preferred secure method before publishing.)\n',
    );
    console.log('═══════════════════════════════════════════════════════════\n');
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
packageAll();
