import path from 'path';
import fs from 'fs';
import IncludeResolver from '../../src/utils/IncludeResolver.js';

// Mock fs at the top of the file
jest.mock('fs');

describe('IncludeResolver', () => {
  describe('parseIncludes', () => {
    it('should detect quoted include directives', () => {
      const source = '#include "config.au3"';
      const resolver = new IncludeResolver('/workspace');
      const includes = resolver.parseIncludes(source, '/workspace/main.au3');

      expect(includes).toHaveLength(1);
      expect(includes[0]).toMatchObject({
        type: 'relative',
        path: 'config.au3',
        line: 0,
      });
    });

    it('should detect angled bracket include directives', () => {
      const source = '#include <Array.au3>';
      const resolver = new IncludeResolver('/workspace');
      const includes = resolver.parseIncludes(source, '/workspace/main.au3');

      expect(includes).toHaveLength(1);
      expect(includes[0]).toMatchObject({
        type: 'library',
        path: 'Array.au3',
        line: 0,
      });
    });

    it('should detect multiple includes', () => {
      const source = `#include "config.au3"
#include <Array.au3>
#include "../utils/helper.au3"`;
      const resolver = new IncludeResolver('/workspace');
      const includes = resolver.parseIncludes(source, '/workspace/src/main.au3');

      expect(includes).toHaveLength(3);
      expect(includes[0].type).toBe('relative');
      expect(includes[1].type).toBe('library');
      expect(includes[2].type).toBe('relative');
    });

    it('should ignore commented includes', () => {
      const source = `#include "real.au3"
; #include "commented.au3"`;
      const resolver = new IncludeResolver('/workspace');
      const includes = resolver.parseIncludes(source, '/workspace/main.au3');

      expect(includes).toHaveLength(1);
      expect(includes[0].path).toBe('real.au3');
    });
  });

  describe('resolveIncludePath', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve relative include from current file directory', () => {
      const resolver = new IncludeResolver('/workspace');
      fs.existsSync = jest.fn().mockReturnValue(true);

      const resolved = resolver.resolveIncludePath(
        { type: 'relative', path: 'config.au3' },
        '/workspace/src/main.au3',
      );

      // Check that resolved path ends with correct structure
      expect(resolved).toBeTruthy();
      expect(path.basename(resolved)).toBe('config.au3');
      expect(resolved.replace(/\\/g, '/')).toMatch(/\/workspace\/src\/config\.au3$/);
    });

    it('should resolve relative path with ../', () => {
      const resolver = new IncludeResolver('/workspace');
      fs.existsSync = jest.fn().mockReturnValue(true);

      const resolved = resolver.resolveIncludePath(
        { type: 'relative', path: '../lib/utils.au3' },
        '/workspace/src/main.au3',
      );

      // Check that resolved path ends with correct structure
      expect(resolved).toBeTruthy();
      expect(path.basename(resolved)).toBe('utils.au3');
      expect(resolved.replace(/\\/g, '/')).toMatch(/\/workspace\/lib\/utils\.au3$/);
    });

    it('should resolve library include from AutoIt paths', () => {
      const resolver = new IncludeResolver('/workspace', ['/autoit/include']);
      const expectedPath = path.join('/autoit/include', 'Array.au3');
      fs.existsSync = jest.fn(p => path.normalize(p) === path.normalize(expectedPath));

      const resolved = resolver.resolveIncludePath(
        { type: 'library', path: 'Array.au3' },
        '/workspace/main.au3',
      );

      expect(path.normalize(resolved)).toBe(path.normalize(expectedPath));
    });

    it('should return null if file does not exist', () => {
      const resolver = new IncludeResolver('/workspace');
      fs.existsSync = jest.fn().mockReturnValue(false);

      const resolved = resolver.resolveIncludePath(
        { type: 'relative', path: 'missing.au3' },
        '/workspace/main.au3',
      );

      expect(resolved).toBeNull();
    });

    it('should try multiple library paths until found', () => {
      const resolver = new IncludeResolver('/workspace', ['/path1/include', '/path2/include']);
      const expectedPath = path.join('/path2/include', 'File.au3');
      fs.existsSync = jest.fn(p => path.normalize(p) === path.normalize(expectedPath));

      const resolved = resolver.resolveIncludePath(
        { type: 'library', path: 'File.au3' },
        '/workspace/main.au3',
      );

      expect(path.normalize(resolved)).toBe(path.normalize(expectedPath));
    });
  });

  describe('resolveAllIncludes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should resolve all includes recursively', () => {
      const resolver = new IncludeResolver('/workspace');

      // Mock file system
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        const basename = path.basename(filePath);
        if (basename === 'main.au3') {
          return '#include "config.au3"';
        }
        if (basename === 'config.au3') {
          return '#include "constants.au3"';
        }
        return '';
      });

      const resolved = resolver.resolveAllIncludes('/workspace/main.au3');
      const basenames = resolved.map(p => path.basename(p));

      expect(basenames).toContain('config.au3');
      expect(basenames).toContain('constants.au3');
      expect(basenames).not.toContain('main.au3'); // Don't include self
    });

    it('should detect and prevent circular includes', () => {
      const resolver = new IncludeResolver('/workspace');

      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        const basename = path.basename(filePath);
        if (basename === 'a.au3') {
          return '#include "b.au3"';
        }
        if (basename === 'b.au3') {
          return '#include "a.au3"'; // Circular!
        }
        return '';
      });

      const resolved = resolver.resolveAllIncludes('/workspace/a.au3');
      const basenames = resolved.map(p => path.basename(p));

      // Should include both but not infinite loop
      expect(basenames).toContain('b.au3');
      expect(basenames).toHaveLength(1); // Only b.au3, not a.au3 again
    });

    it('should respect max depth limit', () => {
      const resolver = new IncludeResolver('/workspace', [], 2);

      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        const basename = path.basename(filePath);
        if (basename === 'level1.au3') {
          return '#include "level2.au3"';
        }
        if (basename === 'level2.au3') {
          return '#include "level3.au3"';
        }
        if (basename === 'level3.au3') {
          return '#include "level4.au3"';
        }
        return '';
      });

      const resolved = resolver.resolveAllIncludes('/workspace/level1.au3');
      const basenames = resolved.map(p => path.basename(p));

      expect(basenames).toContain('level2.au3');
      expect(basenames).not.toContain('level3.au3'); // Beyond depth limit
    });
  });
});
