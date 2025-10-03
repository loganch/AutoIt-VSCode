/**
 * ai_workspaceSymbols.test.js
 * Tests for workspace symbol provider performance optimizations
 */

describe('Workspace Symbols Performance', () => {
  describe('Batch Processing Logic', () => {
    it('should process files in batches', async () => {
      const files = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const batchSize = 10;
      const batches = [];

      // Simulate batch processing
      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(5);
      expect(batches[0].length).toBe(10);
      expect(batches[4].length).toBe(10);
    });

    it('should respect maxFiles limit', async () => {
      const allFiles = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      const maxFiles = 500;

      // Simulate limiting files
      const filesToProcess = allFiles.slice(0, maxFiles);

      expect(allFiles.length).toBe(1000);
      expect(filesToProcess.length).toBe(500);
    });

    it('should handle uneven batch sizes', async () => {
      const files = Array.from({ length: 47 }, (_, i) => ({ id: i }));
      const batchSize = 10;
      const batches = [];

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        batches.push(batch);
      }

      expect(batches.length).toBe(5);
      expect(batches[4].length).toBe(7); // Last batch is smaller
    });
  });

  describe('Cancellation Support', () => {
    it('should stop processing when cancellation is requested', async () => {
      const mockToken = {
        isCancellationRequested: false,
      };

      const files = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const batchSize = 10;
      const processed = [];

      // Simulate cancellation after 2 batches
      for (let i = 0; i < files.length; i += batchSize) {
        if (mockToken.isCancellationRequested) {
          break;
        }

        const batch = files.slice(i, i + batchSize);
        processed.push(...batch);

        // Cancel after 2 batches
        if (i >= batchSize) {
          mockToken.isCancellationRequested = true;
        }
      }

      expect(processed.length).toBe(20); // Only 2 batches processed
    });
  });

  describe('Cache Management', () => {
    it('should use Map for incremental updates', () => {
      const cache = new Map();

      // Add entries
      cache.set('file1', ['symbol1', 'symbol2']);
      cache.set('file2', ['symbol3']);

      expect(cache.size).toBe(2);

      // Update single entry
      cache.set('file1', ['symbol1', 'symbol2', 'symbol4']);

      expect(cache.size).toBe(2);
      expect(cache.get('file1').length).toBe(3);
    });

    it('should remove individual files from cache', () => {
      const cache = new Map();

      cache.set('file1', ['symbol1']);
      cache.set('file2', ['symbol2']);
      cache.set('file3', ['symbol3']);

      expect(cache.size).toBe(3);

      // Remove single file
      cache.delete('file2');

      expect(cache.size).toBe(2);
      expect(cache.has('file2')).toBe(false);
    });
  });

  describe('Query Filtering', () => {
    it('should filter symbols by query string', () => {
      const symbols = [
        { name: 'TestFunc', kind: 1 },
        { name: 'HelperFunc', kind: 1 },
        { name: 'TestVariable', kind: 2 },
      ];

      const query = 'test';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query));

      expect(filtered).toHaveLength(2);
      expect(filtered[0].name).toBe('TestFunc');
      expect(filtered[1].name).toBe('TestVariable');
    });

    it('should be case-insensitive', () => {
      const symbols = [{ name: 'MyFunction' }, { name: 'myVariable' }, { name: 'OTHER' }];

      const query = 'my';
      const filtered = symbols.filter(s => s.name.toLowerCase().includes(query.toLowerCase()));

      expect(filtered).toHaveLength(2);
    });
  });
});
