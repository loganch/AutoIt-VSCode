import { CompletionItemKind, SnippetString } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../util';

const signatures = {
  And: {
    documentation:
      'Logical And operation.\ne.g. If $vVar = 5 And $vVar2 > 6 Then\\n(True if $vVar equals 5 and $vVar2 is greater than 6)',
    label: 'And',
  },
  ByRef: {
    documentation: 'Indicates that a parameter should be treated as a reference to the original',
    label: 'ByRef',
  },
  Case: {
    documentation: '',
    label: 'Case',
  },
  Const: {
    documentation: 'Declare a constant',
    label: 'Const',
  },
  ContinueCase: {
    documentation:
      'Abort the code in the current Case block and continue with the code in the next Case block when in a Select or Switch structure.',
    label: 'ContinueCase',
  },
  ContinueLoop: {
    documentation: 'Continue a While/Do/For loop',
    label: 'ContinueLoop',
  },
  Default: {
    documentation: 'Keyword value used in function call',
    label: 'Default',
  },
  Dim: {
    documentation: '',
    label: 'Dim',
  },
  Do: {
    documentation: '',
    label: 'Do',
  },
  Else: {
    documentation: '',
    label: 'Else',
  },
  ElseIf: {
    documentation: '',
    label: 'ElseIf',
  },
  EndFunc: {
    documentation: 'Closes a Function definition',
    label: 'EndFunc',
  },
  EndIf: {
    documentation: 'Closes an If block',
    label: 'EndIf',
  },
  EndSelect: {
    documentation: 'Closes a Select block',
    label: 'EndSelect',
  },
  EndSwitch: {
    documentation: 'Closes a Switch block',
    label: 'EndSwitch',
  },
  EndWith: {
    documentation: 'Closes a With block',
    label: 'EndWith',
  },
  Enum: {
    documentation: 'Enumerates constants.',
    label: 'Enum',
  },
  Exit: {
    documentation: 'Terminates the script.',
    label: 'Exit',
  },
  ExitLoop: {
    documentation: 'Terminate a While/Do/For loop.',
    label: 'ExitLoop',
  },
  False: {
    documentation: 'Boolean value for use in logical expressions.',
    label: 'False',
  },
  For: {
    documentation: '',
    label: 'For',
  },
  Func: {
    documentation:
      'Defines a user-defined function that takes zero or more arguments and optionally returns a result.',
    label: 'Func',
  },
  Global: {
    documentation: '',
    label: 'Global',
  },
  If: {
    documentation: 'Conditionally run one or more statements.',
    label: 'If',
  },
  In: {
    documentation: '',
    label: 'In',
  },
  Local: {
    documentation: '',
    label: 'Local',
  },
  Next: {
    documentation: '',
    label: 'Next',
  },
  Not: {
    documentation: 'Logical Not operation',
    label: 'Not',
  },
  Null: {
    documentation: 'Keyword value to use in function call.',
    label: 'Null',
  },
  Or: {
    documentation: 'Logical Or operation',
    label: 'Or',
  },
  Redim: {
    documentation: 'Resize an existing array.',
    label: 'Redim',
  },
  Return: {
    documentation: 'Exit a function and provide a value',
    label: 'Return',
  },
  Select: {
    documentation: 'Conditionally run statements.',
    label: 'Select',
  },
  Static: {
    documentation: 'Declare a static variable or create a static array.',
    label: 'Static',
  },
  Step: {
    documentation: '',
    label: 'Step',
  },
  Switch: {
    documentation: 'Conditionally run statements.',
    label: 'Switch',
  },
  Then: {
    documentation: '',
    label: 'Then',
  },
  To: {
    documentation: '',
    label: 'To',
  },
  True: {
    documentation: 'Boolean value for use in logical expressions.',
    label: 'True',
  },
  Until: {
    documentation: '',
    label: 'Until',
  },
  Volatile: {
    documentation: 'Function qualifier. (EXPERIMENTAL)',
    label: 'Volatile',
  },
  WEnd: {
    documentation: 'Closes a While Loop',
    label: 'WEnd',
  },
  While: {
    documentation: 'Loop based on an expression.',
    label: 'While',
  },
  With: {
    documentation: 'Used to reduce long references to dot-accessible type of variables.',
    label: 'With',
  },
  '#NoTrayIcon': {
    documentation: 'Indicates that the AutoIt tray icon will not be shown when the script starts.',
    label: '#NoTrayIcon',
  },
  '#RequireAdmin': {
    documentation: 'Specifies that the current script requires full administrator rights to run.',
    label: '#RequireAdmin',
  },
  '#include': {
    documentation: 'Includes a file in the current script.',
    label: '#include',
  },
  '#include-once': {
    documentation: 'Specifies that the current file should only be included once.',
    label: '#include-once',
  },
  '#OnAutoItStartRegister': {
    documentation: 'Registers a function to be called when AutoIt starts.',
    label: '#OnAutoItStartRegister',
    insertText: new SnippetString('#OnAutoItStartRegister ').appendPlaceholder('function'),
  },
  '#pragma': {
    documentation: 'A special directive for controlling aspects of how the script is compiled.',
    label: '#pragma',
    insertText: new SnippetString('#pragma compile(')
      .appendPlaceholder('pragma-option')
      .appendText(', ')
      .appendPlaceholder('parameter')
      .appendText(')'),
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Keyword, 'Keyword');

export { signatures as default, hovers, completions };
