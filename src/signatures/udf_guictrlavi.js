import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlAVI.au3>`)';

const signatures = {
  _GUICtrlAVI_Close: {
    documentation: 'Closes an AVI clip',
    label: '_GUICtrlAVI_Close ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlAVI_Create: {
    documentation: 'Creates an AVI control',
    label:
      '_GUICtrlAVI_Create ( $hWnd [, $sFilePath = "" [, $iSubFileID = -1 [, $iX = 0 [, $iY = 0 [, $iWidth = 0 [, $iHeight = 0 [, $iStyle = 0x00000006 [, $iExStyle = 0x00000000]]]]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sFilePath',
        documentation: '**[optional]** The filename of the video. Only .avi files are supported',
      },
      {
        label: '$iSubFileID',
        documentation: '**[optional]** id of the subfile to be used.',
      },
      {
        label: '$iX',
        documentation: '**[optional]** Horizontal position of the control',
      },
      {
        label: '$iY',
        documentation: '**[optional]** Vertical position of the control',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Control width',
      },
      {
        label: '$iHeight',
        documentation: '**[optional]** Control height',
      },
      {
        label: '$iStyle',
        documentation:
          "**[optional]** Control styles:    $ACS_CENTER - Centers the animation in the animation control's window    $ACS_TRANSPARENT - Creates the control with a transparent background    $ACS_AUTOPLAY - Starts playing the animation as soon as the AVI clip is opened    $ACS_TIMER - The control plays the clip without creating a threadDefault: $ACS_TRANSPARENT, $ACS_AUTOPLAYForced: $WS_CHILD, $WS_VISIBLE",
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlAVI_Destroy: {
    documentation: 'Delete the control',
    label: '_GUICtrlAVI_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlAVI_IsPlaying: {
    documentation: 'Checks whether an Audio-Video Interleaved (AVI) clip is playing',
    label: '_GUICtrlAVI_IsPlaying ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlAVI_Open: {
    documentation: 'Opens an AVI clip and displays its first frame in an animation control',
    label: '_GUICtrlAVI_Open ( $hWnd, $sFileName )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFileName',
        documentation: 'Fully qualified path to the AVI file',
      },
    ],
  },
  _GUICtrlAVI_OpenEx: {
    documentation: 'Opens an AVI clip and displays its first frame in an animation control',
    label: '_GUICtrlAVI_OpenEx ( $hWnd, $sFileName, $iResourceID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sFileName',
        documentation: 'Fully qualified path to resource file',
      },
      {
        label: '$iResourceID',
        documentation: 'AVI resource identifier',
      },
    ],
  },
  _GUICtrlAVI_Play: {
    documentation: 'Plays an AVI clip in an animation control',
    label: '_GUICtrlAVI_Play ( $hWnd [, $iFrom = 0 [, $iTo = -1 [, $iRepeat = -1]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFrom',
        documentation:
          '**[optional]** 0-based index of the frame where playing begins. The value must be less than 65,536.A value of 0 means begin with the first frame in the clip.',
      },
      {
        label: '$iTo',
        documentation:
          '**[optional]** 0-based index of the frame where playing ends. The value must be less than 65,536.A value of -1 means end with the last frame in the clip.',
      },
      {
        label: '$iRepeat',
        documentation:
          '**[optional]** Number of times to replay the AVI clip. A value of -1 means replay the clip indefinitely.',
      },
    ],
  },
  _GUICtrlAVI_Seek: {
    documentation: 'Directs an AVI control to display a particular frame of an AVI clip',
    label: '_GUICtrlAVI_Seek ( $hWnd, $iFrame )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iFrame',
        documentation: '0-based index of the frame to display',
      },
    ],
  },
  _GUICtrlAVI_Show: {
    documentation: 'Show/Hide the AVI control',
    label: '_GUICtrlAVI_Show ( $hWnd, $iState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iState',
        documentation: 'State of the AVI, can be the following values:',
      },
    ],
  },
  _GUICtrlAVI_Stop: {
    documentation: 'Stops playing an AVI clip',
    label: '_GUICtrlAVI_Stop ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
