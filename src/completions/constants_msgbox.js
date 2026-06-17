import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const flagParam = 'MsgBox Constant Flag Parameter';
const returnValue = 'MsgBox Constant Return Value';

const items = [
  {
    label: '$MB_OK',
    documentation: 'One push button: OK',
    detail: flagParam,
  },
  {
    label: '$MB_OKCANCEL',
    documentation: 'Two push buttons: OK and Cancel',
    detail: flagParam,
  },
  {
    label: '$MB_ABORTRETRYIGNORE',
    documentation: 'Three push buttons: Abort, Retry, and Ignore',
    detail: flagParam,
  },
  {
    label: '$MB_YESNOCANCEL',
    documentation: 'Three push buttons: Yes, No, and Cancel',
    detail: flagParam,
  },
  {
    label: '$MB_YESNO',
    documentation: 'Two push buttons: Yes and No',
    detail: flagParam,
  },
  {
    label: '$MB_RETRYCANCEL',
    documentation: 'Two push buttons: Retry and Cancel',
    detail: flagParam,
  },
  {
    label: '$MB_CANCELTRYCONTINUE',
    documentation: 'Three buttons: Cancel, Try Again and Continue',
    detail: flagParam,
  },
  {
    label: '$MB_HELP',
    documentation:
      'Adds a Help button to the message box. When the user clicks the Help button or presses F1, the system sends a WM_HELP message to the owner.',
    detail: flagParam,
  },
  {
    label: '$MB_ICONERROR',
    documentation: 'Stop-sign icon.',
    detail: flagParam,
  },
  {
    label: '$MB_ICONQUESTION',
    documentation: 'Question-mark icon',
    detail: flagParam,
  },
  {
    label: '$MB_ICONWARNING',
    documentation: 'Exclamation-point icon',
    detail: flagParam,
  },
  {
    label: '$MB_ICONINFORMATION',
    documentation: "Information-sign icon consisting of an 'i' in a circle",
    detail: flagParam,
  },
  {
    label: '$MB_DEFBUTTON1',
    documentation: 'First button is default button',
    detail: flagParam,
  },
  {
    label: '$MB_DEFBUTTON2',
    documentation: 'Second button is default button',
    detail: flagParam,
  },
  {
    label: '$MB_DEFBUTTON3',
    documentation: 'Third button is default button',
    detail: flagParam,
  },
  {
    label: '$MB_DEFBUTTON4',
    documentation: 'Fourth button is default button',
    detail: flagParam,
  },
  {
    label: '$MB_APPLMODAL',
    documentation: 'Application modal',
    detail: flagParam,
  },
  {
    label: '$MB_SYSTEMMODAL',
    documentation: 'System modal (dialog has an icon)',
    detail: flagParam,
  },
  {
    label: '$MB_TASKMODAL',
    documentation: 'Task modal',
    detail: flagParam,
  },
  {
    label: '$MB_DEFAULT_DESKTOP_ONLY',
    documentation: 'MsgBox() shows on the desktop of the interactive window station.',
    detail: flagParam,
  },
  {
    label: '$MB_RIGHT',
    documentation: 'Title and text are right-justified',
    detail: flagParam,
  },
  {
    label: '$MB_RTLREADING',
    documentation:
      'Displays message and caption text using right-to-left reading order on Hebrew and Arabic systems.',
    detail: flagParam,
  },
  {
    label: '$MB_SETFOREGROUND',
    documentation: 'The message box becomes the foreground window.',
    detail: flagParam,
  },
  {
    label: '$MB_TOPMOST',
    documentation: 'MsgBox() has top-most attribute set',
    detail: flagParam,
  },
  {
    label: '$MB_SERVICE_NOTIFICATION',
    documentation:
      'The function displays a message box on the current active desktop, even if there is no user logged on to the computer.',
    detail: flagParam,
  },
  {
    label: '$IDOK',
    documentation: 'OK button was selected',
    detail: returnValue,
  },
  {
    label: '$IDCANCEL',
    documentation: 'Cancel button was selected',
    detail: returnValue,
  },
  {
    label: '$IDABORT',
    documentation: 'Abort button was selected',
    detail: returnValue,
  },
  {
    label: '$IDRETRY',
    documentation: 'Retry button was selected',
    detail: returnValue,
  },
  {
    label: '$IDIGNORE',
    documentation: 'Ignore button was selected',
    detail: returnValue,
  },
  {
    label: '$IDYES',
    documentation: 'Yes button was selected',
    detail: returnValue,
  },
  {
    label: '$IDNO',
    documentation: 'No button was selected',
    detail: returnValue,
  },
  {
    label: '$IDCLOSE',
    documentation: 'Close button was selected',
    detail: returnValue,
  },
  {
    label: '$IDHELP',
    documentation: 'Help button was selected',
    detail: returnValue,
  },
  {
    label: '$IDTRYAGAIN',
    documentation: 'Try Again button was selected',
    detail: returnValue,
  },
  {
    label: '$IDTRYCONTINUE',
    documentation: 'Continue button was selected',
    detail: returnValue,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'MsgBoxConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
