import MapTrackingService from '../../src/services/MapTrackingService.js';
import fs from 'fs';

jest.mock('fs');

describe('MapTrackingService', () => {
  let service;

  beforeEach(() => {
    service = MapTrackingService.getInstance();
    service.clear(); // Clear state between tests
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

    it('should merge keys from included files', () => {
      // Setup mocks
      fs.existsSync = jest.fn().mockReturnValue(true);
      fs.readFileSync = jest.fn(filePath => {
        // Normalize paths for comparison (handle Windows/Unix differences)
        const normalizedPath = filePath.replace(/\\/g, '/');
        if (normalizedPath.endsWith('/workspace/main.au3') || normalizedPath === '/workspace/main.au3') {
          return `#include "config.au3"
Local $mApp[]
$mApp.version = "1.0"`;
        }
        if (normalizedPath.endsWith('/workspace/config.au3') || normalizedPath === '/workspace/config.au3') {
          return `Global $mApp[]
$mApp.name = "MyApp"`;
        }
        return '';
      });

      const mainSource = `#include "config.au3"
Local $mApp[]
$mApp.version = "1.0"`;

      service = MapTrackingService.getInstance('/workspace', []);
      service.clear();
      service.updateFile('/workspace/main.au3', mainSource);

      const keys = service.getKeysForMapWithIncludes('/workspace/main.au3', '$mApp', 3);

      expect(keys.directKeys).toContain('version');
      expect(keys.directKeys).toContain('name'); // From included file
    });

    it('should handle missing included files gracefully', () => {
      fs.existsSync = jest.fn().mockReturnValue(false);

      const source = `#include "missing.au3"
Local $mData[]
$mData.key = "value"`;

      service = MapTrackingService.getInstance('/workspace', []);
      service.clear();
      service.updateFile('/workspace/test.au3', source);

      const keys = service.getKeysForMapWithIncludes('/workspace/test.au3', '$mData', 3);

      // Should still get keys from current file
      expect(keys.directKeys).toContain('key');
    });
  });
});
