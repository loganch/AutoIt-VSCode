# AutoIt Map Variable Support

This document describes the Map variable intelligence features in the AutoIt-VSCode extension.

## Overview

AutoIt Maps are associative arrays that use key-value pairs. This extension provides intelligent IntelliSense for Map keys based on static analysis of your code.

## Features

### 1. Key Completion

When you type `$mapVariable.`, the extension analyzes your code to suggest available keys.

**Example:**

```autoit
Local $mUser[]
$mUser.name = "John"
$mUser.email = "john@example.com"

; Type: $mUser.
; Suggestions: name, email
```

### 2. Scope Awareness

The extension respects variable scoping rules and provides suggestions based on the closest declaration.

**Example:**

```autoit
Global $mConfig[]
$mConfig.apiKey = "global-key"

Func DoWork()
    Local $mConfig[]  ; Shadows global
    $mConfig.tempData = "local-data"

    ; Type: $mConfig.
    ; Suggestions: tempData (only local scope)
EndFunc
```

### 3. Cross-File Tracking

The extension follows `#include` directives to merge Map definitions from multiple files.

**Example:**

`config.au3`:

```autoit
Global $mApp[]
$mApp.name = "MyApp"
$mApp.version = "1.0"
```

`main.au3`:

```autoit
#include "config.au3"

$mApp.debugMode = True

; Type: $mApp.
; Suggestions: name, version, debugMode
```

### 4. Function Parameter Tracking

Keys added to Map parameters within functions are tracked and suggested with lower priority.

**Example:**

```autoit
Func AddUserData($userMap)
    $userMap.name = "Default"
    $userMap.id = 0
EndFunc

Local $mUser[]
AddUserData($mUser)

; Type: $mUser.
; Suggestions: name, id (marked as "added in function")
```

## Configuration

### `autoit.maps.enableIntelligence`

**Type:** `boolean`
**Default:** `true`

Enable or disable Map key completions.

### `autoit.maps.includeDepth`

**Type:** `number`
**Default:** `3`

Maximum depth for resolving `#include` files. Higher values allow deeper include chains but may impact performance.

### `autoit.maps.showFunctionKeys`

**Type:** `boolean`
**Default:** `true`

Show keys that are added when Maps are passed to function parameters. These are marked with lower confidence.

### Recommendations

When tuning these settings, consider the trade-offs between feature completeness and editor performance:

• **includeDepth**: For large repositories or remote workspaces (WSL, SSH), reduce to 1–2 to improve responsiveness by limiting parsed files during include resolution.

• **enableIntelligence**: In very large projects or CI environments where IntelliSense isn't critical, consider disabling to minimize resource usage.

• **showFunctionKeys**: Keep enabled for more accurate completions, but can be disabled if you prefer fewer low-confidence suggestions.

• **Monitoring**: Watch editor memory usage and response time, then adjust settings iteratively based on your workspace characteristics.

What works well for a small local project may need tuning for large multi-file codebases.

## How It Works

The extension uses static analysis to:

1. **Parse Map declarations**: Detect `Local/Global/Dim/Static $var[]` patterns
2. **Track key assignments**: Find `$map.key = value` and `$map["key"] = value` patterns
3. **Analyze function boundaries**: Determine scope and track function parameters
4. **Resolve includes**: Follow `#include` directives to merge definitions
5. **Provide completions**: Suggest keys based on scope and position

## Limitations

- **Single-level Maps only**: Nested Map keys (e.g., `$map.user.name`) are not yet supported
- **Static analysis**: Only detects keys assigned via direct syntax, not dynamic keys
- **Function tracking**: Limited to same-file functions initially
- **Performance**: Very large workspaces may experience delays (see configuration)

## Future Enhancements

- Nested Map support (`$map.level1.level2`)
- Cross-file function parameter tracking
- Dynamic key detection from MapAppend calls
- Map type inference and validation

## Troubleshooting

**No completions appearing:**

- Check `autoit.maps.enableIntelligence` is `true`
- Ensure Map is declared with `[]` syntax: `Local $mVar[]`
- Verify file is recognized as AutoIt (check language mode)

**Missing keys from included files:**

- Check `autoit.maps.includeDepth` setting
- Verify include paths are correct
- Check `autoit.includePaths` setting for library includes

**Performance issues:**

- Reduce `autoit.maps.includeDepth`
- Disable `autoit.maps.showFunctionKeys` if not needed
