import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Sound.au3>`)';

const signatures = {
  _SoundClose: {
    documentation: 'Closes a sound previously opened with _SoundOpen',
    label: '_SoundClose ( $aSndID )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen()',
      },
    ],
  },
  _SoundLength: {
    documentation: 'Returns the length of the soundfile',
    label: '_SoundLength ( $aSndID [, $iMode = 1] )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** This flag determines the format of the returned sound length    1 = (by default) hh:mm:ss where h = hours, m = minutes and s = seconds (default)    2 = milliseconds',
      },
    ],
  },
  _SoundOpen: {
    documentation: 'Opens a sound file for use with other _Sound functions',
    label: '_SoundOpen ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path to sound file',
      },
    ],
  },
  _SoundPause: {
    documentation: 'Pause a playing sound',
    label: '_SoundPause ( $aSndID )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
    ],
  },
  _SoundPlay: {
    documentation: 'Play a sound file',
    label: '_SoundPlay ( $aSndID [, $iWait = 0] )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** This flag determines if the script should wait for the sound to finish before continuing:    0 = continue script while sound is playing (default)    1 = wait until sound has finished',
      },
    ],
  },
  _SoundPos: {
    documentation: 'Returns the current position of the sound',
    label: '_SoundPos ( $aSndID [, $iMode = 1] )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** This flag determines which format the position of the sound is returned in    1 = (by default) hh:mm:ss where h = hours, m = minutes and s = seconds (default)    2 = milliseconds',
      },
    ],
  },
  _SoundResume: {
    documentation: 'Resume a paused sound',
    label: '_SoundResume ( $aSndID )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
    ],
  },
  _SoundSeek: {
    documentation: 'Seeks the sound to the specified position',
    label: '_SoundSeek ( ByRef $aSndID, $iHour, $iMin, $iSec )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen()',
      },
      {
        label: '$iHour',
        documentation: 'Hour to seek to',
      },
      {
        label: '$iMin',
        documentation: 'Minute to seek to',
      },
      {
        label: '$iSec',
        documentation: 'Second to seek to',
      },
    ],
  },
  _SoundStatus: {
    documentation: 'Returns the status of the sound',
    label: '_SoundStatus ( $aSndID )',
    params: [
      {
        label: '$aSndID',
        documentation: 'Sound ID array as returned by _SoundOpen() or a file name',
      },
    ],
  },
  _SoundStop: {
    documentation: 'Stop a playing sound',
    label: '_SoundStop ( ByRef $aSndID )',
    params: [
      {
        label: '$aSndID',
        documentation:
          'Sound ID array as returned by _SoundOpen() or a file name (must be a variable)',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
