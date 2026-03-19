import debounce from '../utils/debounce.js';

/**
 * Shared implementation for debounced file parsing updates.
 * @param {object} service - Tracking service instance
 * @param {string} filePath - Absolute file path
 * @param {string} source - File source code
 */
export default function updateFileDebounced(service, filePath, source) {
  if (!service.debouncedParseByFile.has(filePath)) {
    service.debouncedParseByFile.set(
      filePath,
      debounce((path, src) => {
        service._parseFile(path, src);
      }, service.parseDebounceMs),
    );
  }

  service.pendingParses.set(filePath, { source, timestamp: Date.now() });

  const debouncedParse = service.debouncedParseByFile.get(filePath);
  debouncedParse(filePath, source);
}