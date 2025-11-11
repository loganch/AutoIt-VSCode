import MapTrackingService from '../../src/services/MapTrackingService.js';

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
});
