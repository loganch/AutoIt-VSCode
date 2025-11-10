import path from 'path';
import IncludeResolver from '../../src/utils/IncludeResolver.js';

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
});
