/// <reference types="vscode" />

// ============================================================================
// EXPORTS (Maintaining API Compatibility)
// ============================================================================
//
// util.js is a thin barrel. The actual implementations live in focused
// modules under ./utils/ and ./completionTransforms — see F1 in
// docs/tech-debt-assessment.md. New code should import from those modules
// directly; this file exists only so the ~10 remaining consumers don't all
// need updating in the same change.

// Markdown formatting + completion/signature transforms
export {
  descriptionHeader,
  valueFirstHeader,
  trueFalseHeader,
  opt,
  br,
  defaultZero,
  fillCompletions,
  signatureToHover,
  completionToHover,
  signatureToCompletion,
  setDetailAndDocumentation as setDetail,
} from './completionTransforms';

// Variable declaration matching (shared with services/symbolIndex.js)
export {
  VARIABLE_KEYWORDS,
  VARIABLE_PATTERN_TEMPLATE,
  VARIABLE_REGEX_FLAGS,
  buildVariableRegex,
  isVariableDeclarationLine,
} from './utils/variableRegex';

// File system + include content caching
export { normalizePath, getIncludeText } from './utils/fsCache';

// Include path resolution + document line analysis
export { isSkippableLine, getIncludePath, getIncludeScripts } from './utils/includeResolution';

// Function signature analysis
export { buildFunctionSignature, getParams, getIncludeData } from './utils/functionSignature';

