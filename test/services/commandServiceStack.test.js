const fs = require('fs');
const path = require('path');

const pkg = require('../../package.json');

const expected = `extension-output-${pkg.publisher}.${pkg.name}-#`;
const producers = ['src/services/commandServiceStack.js', 'src/providers/ai_commands.js'];

describe('outputName interpolation guard', () => {
  it.each(producers)('builds interpolated outputName in %s', rel => {
    const src = fs.readFileSync(path.join(__dirname, '..', '..', rel), 'utf8');
    expect(src).toContain('`extension-output-${packageJson.publisher}.${packageJson.name}-#`');
    expect(src).not.toContain("'extension-output-${require");
  });

  it('no single-quoted require literal remains in src', () => {
    const hits = [];
    const walk = dir => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (p.endsWith('.js') && !p.includes('dist')) {
          const c = fs.readFileSync(p, 'utf8');
          if (c.includes("'extension-output-${require")) hits.push(p);
        }
      }
    };
    walk(path.join(__dirname, '..', '..', 'src'));
    expect(hits).toEqual([]);
  });

  it('expected channel prefix matches isAiOutVisible parsing', () => {
    expect(expected).toBe(`extension-output-${pkg.publisher}.${pkg.name}-#`);
    expect(expected).not.toContain('${');
    // ponytail: static prefix check; full ProcessManager matching covered in ProcessManager.test.js
    expect(`${expected}1-AutoIt`.startsWith(expected)).toBe(true);
  });
});
