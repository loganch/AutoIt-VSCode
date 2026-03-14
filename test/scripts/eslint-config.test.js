const path = require('path');
const { execFileSync } = require('child_process');

describe('eslint.config.mjs', () => {
  let summary;

  beforeAll(() => {
    const workspaceRoot = path.resolve(__dirname, '..', '..');

    const inspectorScript = `
      import config from './eslint.config.mjs';
      const jsEntry = config.find(entry => Array.isArray(entry.files) && entry.files.includes('**/*.js'));
      const ignoreEntry = config.find(entry => Array.isArray(entry.ignores));

      const result = {
        isArray: Array.isArray(config),
        length: config.length,
        ecmaVersion: jsEntry?.languageOptions?.ecmaVersion,
        sourceType: jsEntry?.languageOptions?.sourceType,
        eqeqeqRule: jsEntry?.rules?.eqeqeq,
        noUnusedVarsRule: jsEntry?.rules?.['no-unused-vars'],
        importCoreModules: jsEntry?.settings?.['import/core-modules'],
        ignores: ignoreEntry?.ignores || [],
      };

      process.stdout.write(JSON.stringify(result));
    `;

    const stdout = execFileSync(
      process.execPath,
      ['--input-type=module', '--eval', inspectorScript],
      {
        cwd: workspaceRoot,
        encoding: 'utf8',
      },
    );

    summary = JSON.parse(stdout);
  });

  it('exports a flat config array', () => {
    expect(summary.isArray).toBe(true);
    expect(summary.length).toBeGreaterThanOrEqual(3);
  });

  it('contains the primary JavaScript ruleset entry', () => {
    expect(summary.ecmaVersion).toBe(2024);
    expect(summary.sourceType).toBe('module');
    expect(summary.eqeqeqRule).toEqual(['error', 'always']);
    expect(summary.noUnusedVarsRule).toEqual(['error', { argsIgnorePattern: '^_' }]);
    expect(summary.importCoreModules).toContain('vscode');
  });

  it('contains ignore patterns for build artifacts and dependencies', () => {
    expect(summary.ignores).toEqual(expect.arrayContaining(['dist/', 'node_modules/', '*.min.js']));
  });
});
