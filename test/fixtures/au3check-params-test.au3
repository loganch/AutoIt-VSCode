; Test script for #AutoIt3Wrapper_AU3Check_Parameters parsing
; Tests supported Au3Check parameters: -w, -q, -d
; NOTE: -v (verbosity) parameters are NOT supported to maintain consistent diagnostic parsing
; IMPORTANT: Extension no longer sets default warning params - Au3Check uses its own defaults
#AutoIt3Wrapper_AU3Check_Parameters=-q -d -w- 3 -w- 5

; This script intentionally has issues that would trigger various warnings
; to verify that the directive correctly applies supported parameter types

; Warning 3: already declared var (DISABLED by -w- 3 in directive)
Local $sTest = "First"
Local $sTest = "Second"  ; This should NOT trigger warning 3

; Warning 5: local var declared but not used (DISABLED by -w- 5 in directive)
Local $sUnused = "Never used"  ; This should NOT trigger warning 5

; -d flag: must declare vars (enabled by directive)
; This forces Opt("MustDeclareVars", 1) behavior

; -q flag: quiet mode (enabled by directive)
; This suppresses informational messages while keeping error/warning format

MsgBox(0, "Test", $sTest)

; Additional test: Try using an undeclared variable
; This should trigger an error with -d flag from directive
; Uncomment the line below to test:
; $undeclared = "This should fail with -d flag"
