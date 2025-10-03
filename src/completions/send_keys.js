import { CompletionItemKind, SnippetString } from 'vscode';
import { fillCompletions } from '../util';

const items = [
  {
    label: '{ALT}',
    insertText: '{ALT}',
  },
  {
    label: '{ALTDOWN}',
    insertText: '{ALTDOWN}',
    documentation: 'Holds the ALT key down until {ALTUP} is sent',
  },
  {
    label: '{ALTUP}',
    insertText: '{ALTUP}',
    documentation: 'Releases the ALT key',
  },
  {
    label: '{APPSKEY}',
    documentation: 'Windows App key',
  },
  {
    label: '{ASC}',
    documentation: 'Send the ALT+nnnn key combination',
    insertText: new SnippetString('{ASC ').appendPlaceholder('0000').appendText('}'),
  },
  {
    label: '{BACKSPACE}',
  },
  {
    label: '{BREAK}',
    documentation: 'for Ctrl+Break processing',
  },
  {
    label: '{BROWSER_BACK}',
    documentation: 'Select the browser "back" button',
  },
  {
    label: '{BROWSER_FAVORITES}',
    documentation: 'Select the browser "favorites" button',
  },
  {
    label: '{BROWSER_FORWARD}',
    documentation: 'Select the browser "forward" button',
  },
  {
    label: '{BROWSER_HOME}',
    documentation: 'Launch the browser and go to the home page',
  },
  {
    label: '{BROWSER_REFRESH}',
    documentation: 'Select the browser "refresh" button',
  },
  {
    label: '{BROWSER_SEARCH}',
    documentation: 'Select the browser "search" button',
  },
  {
    label: '{BROWSER_STOP}',
    documentation: 'Select the browser "stop" button',
  },
  {
    label: '{BROWSER_STOP}',
    documentation: 'Select the browser "stop" button',
  },
  {
    label: '{CAPSLOCK}',
    documentation: 'CAPSLOCK (on/off/toggle)',
    insertText: new SnippetString('{CAPSLOCK ')
      .appendChoice(['on', 'off', 'toggle'])
      .appendText('}'),
  },
  {
    label: '{CTRLDOWN}',
    documentation: 'Holds the CTRL key down until {CTRLUP} is sent',
  },
  {
    label: '{CTRLUP}',
    documentation: 'Releases the CTRL key',
  },
  {
    label: '{DELETE}',
  },
  {
    label: '{DOWN}',
    documentation: 'Down arrow',
  },
  {
    label: '{END}',
  },
  {
    label: '{ENTER}',
    documentation: 'ENTER key on the main keyboard',
  },
  {
    label: '{ESCAPE}',
  },
  {
    label: '{F1}',
  },
  {
    label: '{F2}',
  },
  {
    label: '{F3}',
  },
  {
    label: '{F4}',
  },
  {
    label: '{F5}',
  },
  {
    label: '{F6}',
  },
  {
    label: '{F7}',
  },
  {
    label: '{F8}',
  },
  {
    label: '{F9}',
  },
  {
    label: '{F10}',
  },
  {
    label: '{F11}',
  },
  {
    label: '{F12}',
  },
  {
    label: '{HOME}',
  },
  {
    label: '{INSERT}',
  },
  {
    label: '{LALT}',
    documentation: 'Left ALT key',
  },
  {
    label: '{LAUNCH_APP1}',
    documentation: 'Launch user app1',
  },
  {
    label: '{LAUNCH_APP2}',
    documentation: 'Launch user app2',
  },
  {
    label: '{LAUNCH_MAIL}',
    documentation: 'Launch the email application',
  },
  {
    label: '{LAUNCH_MEDIA}',
    documentation: 'Launch media player',
  },
  {
    label: '{LCTRL}',
    documentation: 'Left CTRL key',
  },
  {
    label: '{LEFT}',
    documentation: 'Left arrow',
  },
  {
    label: '{LSHIFT}',
    documentation: 'Left Shift key',
  },
  {
    label: '{LWIN}',
    documentation: 'Left Windows key',
  },
  {
    label: '{LWINDOWN}',
    documentation: 'Holds the left Windows key down until {LWINUP} is sent',
  },
  {
    label: '{LWINUP}',
    documentation: 'Releases the Windows key',
  },
  {
    label: '{MEDIA_NEXT}',
    documentation: 'Select next track in media player',
  },
  {
    label: '{MEDIA_PLAY_PAUSE}',
    documentation: 'Play/pause media player',
  },
  {
    label: '{MEDIA_PREV}',
    documentation: 'Select previous track in media player',
  },
  {
    label: '{MEDIA_STOP}',
    documentation: 'Stop media player',
  },
  {
    label: '{NUMLOCK}',
    documentation: 'NUMLOCK (on/off/toggle)',
    inserText: new SnippetString('{NUMLOCK ').appendChoice(['on', 'off', 'toggle']).appendText('}'),
  },
  {
    label: '{NUMPAD0}',
    documentation: '',
  },
  {
    label: '{NUMPAD1}',
    documentation: '',
  },
  {
    label: '{NUMPAD2}',
    documentation: '',
  },
  {
    label: '{NUMPAD3}',
    documentation: '',
  },
  {
    label: '{NUMPAD4}',
    documentation: '',
  },
  {
    label: '{NUMPAD5}',
    documentation: '',
  },
  {
    label: '{NUMPAD6}',
    documentation: '',
  },
  {
    label: '{NUMPAD7}',
    documentation: '',
  },
  {
    label: '{NUMPAD8}',
    documentation: '',
  },
  {
    label: '{NUMPAD9}',
    documentation: '',
  },
  {
    label: '{NUMPADADD}',
    documentation: 'Numpad Add',
  },
  {
    label: '{NUMPADDIV}',
    documentation: 'Numpad Divide',
  },
  {
    label: '{NUMPADDOT}',
    documentation: 'Numpad period',
  },
  {
    label: '{NUMPADENTER}',
    documentation: 'Enter key on the numpad',
  },
  {
    label: '{NUMPADMULT}',
    documentation: 'Numpad Multiply',
  },
  {
    label: '{NUMPADSUB}',
    documentation: 'Numpad Subtract',
  },
  {
    label: '{OEM_102}',
    documentation: 'Either the angle bracket key or the backslash key on the RT 102-key keyboard',
  },
  {
    label: '{PAUSE}',
    documentation: '',
  },
  {
    label: '{PGDN}',
    documentation: 'PageDown',
  },
  {
    label: '{PGUP}',
    documentation: 'PageUp',
  },
  {
    label: '{PRINTSCREEN}',
    documentation: 'Print Screen key',
  },
  {
    label: '{RALT}',
    documentation: 'Right ALT key',
  },
  {
    label: '{RCTRL}',
    documentation: 'Right CTRL key',
  },
  {
    label: '{RIGHT}',
    documentation: 'Right arrow',
  },
  {
    label: '{RSHIFT}',
    documentation: 'Right Shift key',
  },
  {
    label: '{RWIN}',
    documentation: 'Right Windows key',
  },
  {
    label: '{RWINDOWN}',
    documentation: 'Holds the right Windows key down until {RWINUP} is sent',
  },
  {
    label: '{RWINUP}',
    documentation: 'Releases the right Windows key',
  },
  {
    label: '{SCROLLLOCK}',
    documentation: 'SCROLLLOCK (on/off/toggle)',
    inserText: new SnippetString('{SCROLLLOCK ')
      .appendChoice(['on', 'off', 'toggle'])
      .appendText('}'),
  },
  {
    label: '{SHIFTDOWN}',
    documentation: 'Holds the SHIFT key down until {SHIFTUP} is sent',
  },
  {
    label: '{SHIFTUP}',
    documentation: 'Releases the SHIFT key',
  },
  {
    label: '{SLEEP}',
    documentation: 'Computer SLEEP key',
  },
  {
    label: '{SPACE}',
    documentation: '',
  },
  {
    label: '{TAB}',
    documentation: '',
  },
  {
    label: '{UP}',
    documentation: 'Up arrow',
  },
  {
    label: '{VOLUME_DOWN}',
    documentation: 'Reduce the volume',
  },
  {
    label: '{VOLUME_MUTE}',
    documentation: 'Mute the volume',
  },
  {
    label: '{VOLUME_UP}',
    documentation: 'Increase the volume',
  },
];

// Add the variable icon and Macro detail to each entry
const entries = fillCompletions(items, CompletionItemKind.Constant, 'Send() Command');

export default entries;
