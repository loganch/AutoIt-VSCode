import MapTrackingService from '../../src/services/MapTrackingService.js';
import fs from 'fs';

jest.mock('fs');

describe('MapTrackingService', () => {
  let service;
  let consoleWarnSpy;

  beforeEach(() => {
    // Reset singleton instance before each test
    MapTrackingService.resetInstance();
    // Set up spy before getInstance to catch any warnings
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    service = MapTrackingService.getInstance();
    service.clear(); // Clear state between tests
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('singleton pattern', () => {
    it('should return same instance', () => {
      const instance1 = MapTrackingService.getInstance();
      const instance2 = MapTrackingService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('updateFile', () => {
    it('should parse and store Map data for a file', () => {
      const source = `Local $mUser[]
$mUser.name = "John"`;

      service.updateFile('/workspace/test.au3', source);
      const keys = service.getKeysForMap('/workspace/test.au3', '$mUser', 2);

      expect(keys.directKeys).toContain('name');
    });

    it('should update existing file data', () => {
      service.updateFile('/workspace/test.au3', 'Local $mUser[]');
      service.updateFile(
        '/workspace/test.au3',
        `Local $mUser[]
$mUser.age = 30`,
      );

      const keys = service.getKeysForMap('/workspace/test.au3', '$mUser', 2);
      expect(keys.directKeys).toContain('age');
    });
  });

  describe('removeFile', () => {
    it('should remove file data', () => {
      service.updateFile('/workspace/test.au3', 'Local $mUser[]');
      service.removeFile('/workspace/test.au3');

      const keys = service.getKeysForMap('/workspace/test.au3', '$mUser', 0);
      expect(keys.directKeys).toHaveLength(0);
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      service.updateFile('/workspace/file1.au3', 'Local $mData[]');
      service.updateFile('/workspace/file2.au3', 'Local $mConfig[]');
      service.clear();

      const keys1 = service.getKeysForMap('/workspace/file1.au3', '$mData', 0);
      const keys2 = service.getKeysForMap('/workspace/file2.au3', '$mConfig', 0);

      expect(keys1.directKeys).toHaveLength(0);
      expect(keys2.directKeys).toHaveLength(0);
    });
  });

  describe('getKeysForMapWithIncludes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should merge keys from included files', async () => {
      // Setup mocks for both sync (IncludeResolver) and async (MapTrackingService) APIs
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        // Normalize paths for comparison (handle Windows/Unix differences)
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (
          normalizedPath.endsWith('/workspace/main.au3') ||
          normalizedPath === '/workspace/main.au3'
        ) {
          return `#include "config.au3"
Local $mApp[]
$mApp.version = "1.0"`;
        }
        if (
          normalizedPath.endsWith('/workspace/config.au3') ||
          normalizedPath === '/workspace/config.au3'
        ) {
          return `Global $mApp[]
$mApp.name = "MyApp"`;
        }
        return '';
      });

      fs.promises = {
        access: jest.fn().mockResolvedValue(undefined),
        readFile: jest.fn(filePath => {
          // Normalize paths for comparison (handle Windows/Unix differences)
          const normalizedPath = filePath.replace(/\\/g, '/');
          if (
            normalizedPath.endsWith('/workspace/config.au3') ||
            normalizedPath === '/workspace/config.au3'
          ) {
            return Promise.resolve(`Global $mApp[]
$mApp.name = "MyApp"`);
          }
          return Promise.resolve('');
        }),
      };

      const mainSource = `#include "config.au3"
Local $mApp[]
$mApp.version = "1.0"`;

      service.updateFile('/workspace/main.au3', mainSource);

      const keys = await service.getKeysForMapWithIncludes('/workspace/main.au3', '$mApp', 3);

      // Verify that the mocks were called during include processing
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringMatching(/config\.au3$/), 'utf8');

      expect(keys.directKeys).toContain('version');
      expect(keys.directKeys).toContain('name'); // From included file
    });

    it('should handle missing included files gracefully', async () => {
      // Setup mocks for sync API (IncludeResolver)
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (
          normalizedPath.endsWith('/workspace/test.au3') ||
          normalizedPath === '/workspace/test.au3'
        ) {
          return `#include "missing.au3"
Local $mData[]
$mData.key = "value"`;
        }
        return '';
      });

      // Setup mocks for promises API - simulate file not found error
      fs.promises = {
        access: jest.fn().mockRejectedValue(new Error('ENOENT: no such file or directory')),
        readFile: jest.fn().mockRejectedValue(new Error('ENOENT: no such file or directory')),
      };

      const source = `#include "missing.au3"
Local $mData[]
$mData.key = "value"`;

      service.updateFile('/workspace/test.au3', source);

      // Clear any previous console warnings
      consoleWarnSpy.mockClear();

      const keys = await service.getKeysForMapWithIncludes('/workspace/test.au3', '$mData', 3);

      // Should still get keys from current file
      expect(keys.directKeys).toContain('key');
      // Should have logged warning about missing file
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[MapTrackingService] Failed to read included file'),
        expect.any(String),
      );
    });
  });

  describe('updateConfiguration', () => {
    it('should update workspace root and include paths', () => {
      const initialService = MapTrackingService.getInstance('/workspace1', ['path1'], 3);

      initialService.updateConfiguration('/workspace2', ['path2', 'path3'], 5);

      expect(initialService.workspaceRoot).toBe('/workspace2');
      expect(initialService.includeResolver.autoitIncludePaths).toEqual(['path2', 'path3']);
      expect(initialService.includeResolver.maxDepth).toBe(5);
    });

    it('should clear cached parsers when configuration changes', () => {
      service.updateFile('/workspace/test.au3', 'Local $mData[]');
      expect(service.fileParsers.size).toBe(1);

      service.updateConfiguration('/new-workspace', [], 3);

      expect(service.fileParsers.size).toBe(0);
    });
  });

  describe('parameter validation', () => {
    beforeEach(() => {
      // Clear any warnings from the global beforeEach
      consoleWarnSpy.mockClear();
    });

    it('should warn when getInstance is called with different parameters', () => {
      // Reset and start fresh for this test
      MapTrackingService.resetInstance();
      MapTrackingService.getInstance('/workspace1', ['path1'], 3);
      MapTrackingService.getInstance('/workspace2', ['path2'], 5);

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'getInstance called with different parameters than initial instance',
        ),
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Use updateConfiguration()'),
      );
    });

    it('should not warn when getInstance is called with same parameters', () => {
      // Reset and start fresh for this test
      MapTrackingService.resetInstance();
      MapTrackingService.getInstance('/workspace', ['path'], 3);
      MapTrackingService.getInstance('/workspace', ['path'], 3);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    it('should not warn when getInstance is called with default values matching initial instance', () => {
      // Initialize with default values
      MapTrackingService.resetInstance();
      MapTrackingService.getInstance('', [], 3);
      // Call again with explicit defaults
      MapTrackingService.getInstance('', [], 3);

      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });
  });

  describe('resetInstance', () => {
    it('should allow creating a new instance after reset', () => {
      const instance1 = MapTrackingService.getInstance('/workspace1', [], 3);
      MapTrackingService.resetInstance();
      const instance2 = MapTrackingService.getInstance('/workspace2', [], 5);

      expect(instance1).not.toBe(instance2);
      expect(instance2.workspaceRoot).toBe('/workspace2');
    });
  });
});
