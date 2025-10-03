import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Clipboard.au3>`)';

const signatures = {
  _ClipBoard_ChangeChain: {
    documentation: 'Removes a specified window from the chain of clipboard viewers',
    label: '_ClipBoard_ChangeChain ( $hRemove, $hNewNext )',
    params: [
      {
        label: '$hRemove',
        documentation:
          'Handle to the window to be removed from the chain.The handle must have been passed to the _ClipBoard_SetViewer() function.',
      },
      {
        label: '$hNewNext',
        documentation:
          'Handle to the window that follows the $hRemove window in the clipboard viewer chain. This is the handle returned by _ClipBoard_SetViewer(), unless the sequence was changed in response to a $WM_CHANGECBCHAIN message.',
      },
    ],
  },
  _ClipBoard_Close: {
    documentation: 'Closes the clipboard',
    label: '_ClipBoard_Close (  )',
    params: [],
  },
  _ClipBoard_CountFormats: {
    documentation: 'Retrieves the number of different data formats currently on the clipboard',
    label: '_ClipBoard_CountFormats (  )',
    params: [],
  },
  _ClipBoard_Empty: {
    documentation: 'Empties the clipboard and frees handles to data in the clipboard',
    label: '_ClipBoard_Empty (  )',
    params: [],
  },
  _ClipBoard_EnumFormats: {
    documentation: 'Enumerates the data formats currently available on the clipboard',
    label: '_ClipBoard_EnumFormats ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation:
          'Specifies a clipboard format that is known to be available. To start an enumeration of formats, set $iFormat to zero.  \nWhen $iFormat is zero, the function retrieves the first available clipboard format.  \nFor subsequent calls during an enumeration, set $iFormat to the result of the previous call.',
      },
    ],
  },
  _ClipBoard_FormatStr: {
    documentation: 'Returns a string representation of a standard clipboard format',
    label: '_ClipBoard_FormatStr ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation: 'Specifies a clipboard format',
      },
    ],
  },
  _ClipBoard_GetData: {
    documentation: 'Retrieves data from the clipboard in a specified format',
    label: '_ClipBoard_GetData ( [$iFormat = 1] )',
    params: [
      {
        label: '$iFormat',
        documentation: '**[optional]** Specifies a clipboard format',
      },
    ],
  },
  _ClipBoard_GetDataEx: {
    documentation: 'Retrieves data from the clipboard in a specified format',
    label: '_ClipBoard_GetDataEx ( [$iFormat = 1] )',
    params: [
      {
        label: '$iFormat',
        documentation: '**[optional]** Specifies a clipboard format',
      },
    ],
  },
  _ClipBoard_GetFormatName: {
    documentation: 'Retrieves the name of the specified registered format',
    label: '_ClipBoard_GetFormatName ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation: 'Specifies the type of format to be retrieved',
      },
    ],
  },
  _ClipBoard_GetOpenWindow: {
    documentation: 'Retrieves the handle to the window that currently has the clipboard open',
    label: '_ClipBoard_GetOpenWindow (  )',
    params: [],
  },
  _ClipBoard_GetOwner: {
    documentation: 'Retrieves the window handle of the current owner of the clipboard',
    label: '_ClipBoard_GetOwner (  )',
    params: [],
  },
  _ClipBoard_GetPriorityFormat: {
    documentation: 'Retrieves the first available clipboard format in the specified list',
    label: '_ClipBoard_GetPriorityFormat ( $aFormats )',
    params: [
      {
        label: '$aFormats',
        documentation:
          'Array with the following format:  \n[0] - Number of formats (n)  \n[1] - Format 1  \n[2] - Format 2  \n[n] - Format n',
      },
    ],
  },
  _ClipBoard_GetSequenceNumber: {
    documentation: 'Retrieves the clipboard sequence number for the current window station',
    label: '_ClipBoard_GetSequenceNumber (  )',
    params: [],
  },
  _ClipBoard_GetViewer: {
    documentation: 'Retrieves the handle to the first window in the clipboard viewer chain',
    label: '_ClipBoard_GetViewer (  )',
    params: [],
  },
  _ClipBoard_IsFormatAvailable: {
    documentation: 'Determines whether the clipboard contains data in the specified format',
    label: '_ClipBoard_IsFormatAvailable ( $iFormat )',
    params: [
      {
        label: '$iFormat',
        documentation: 'Specifies a standard or registered clipboard format',
      },
    ],
  },
  _ClipBoard_Open: {
    documentation:
      'Opens the clipboard and prevents other applications from modifying the clipboard',
    label: '_ClipBoard_Open ( $hOwner )',
    params: [
      {
        label: '$hOwner',
        documentation:
          'Handle to the window to be associated with the open clipboard. If this parameter is 0, the open clipboard is associated with the current task.',
      },
    ],
  },
  _ClipBoard_RegisterFormat: {
    documentation: 'Registers a new clipboard format',
    label: '_ClipBoard_RegisterFormat ( $sFormat )',
    params: [
      {
        label: '$sFormat',
        documentation: 'The name of the new format',
      },
    ],
  },
  _ClipBoard_SetData: {
    documentation: 'Places data on the clipboard in a specified clipboard format',
    label: '_ClipBoard_SetData ( $vData [, $iFormat = 1] )',
    params: [
      {
        label: '$vData',
        documentation:
          'Data in Binary or String format, or optionally NULL (0) (owner must render, see below).  \nIMPORTANT: If a String is passed, and it is not of type $CF_TEXT, $CF_OEMTEXT, or $CF_UNICODETEXT, it will be treated as an ANSI string.  \nTo force Unicode strings for other types, you must pass the data in Binary format.  \nAlso, do NOT pass $CF_UNICODETEXT in Binary format (causes garbled data).  \nWhen $vData is NULL, it indicates that the window provides data in the specified clipboard format upon request.  \nIf a window delays rendering, it must process the $WM_RENDERFORMAT and $WM_RENDERALLFORMATS messages.  \nIf this function succeeds, the system owns the object identified by the $hMemory parameter.  \nThe application may not write to or free the data once ownership has been transferred to the system, but it can lock and read from the data until the _ClipBoard_Close() function is called.  \nThe memory must be unlocked before the clipboard is closed.  \nIf the $hMemory parameter identifies a memory object, the object must have been allocated using the function with the $GMEM_MOVEABLE flag.',
      },
      {
        label: '$iFormat',
        documentation: '**[optional]** Specifies a clipboard format',
      },
    ],
  },
  _ClipBoard_SetDataEx: {
    documentation: 'Places data on the clipboard in a specified clipboard format',
    label: '_ClipBoard_SetDataEx ( ByRef $hMemory [, $iFormat = 1] )',
    params: [
      {
        label: '$hMemory',
        documentation:
          'Handle to the data in the specified format. This parameter can be NULL, indicating that the window provides data in the specified clipboard format upon request.  \nIf a window delays rendering, it must process the $WM_RENDERFORMAT and $WM_RENDERALLFORMATS messages.  \nIf this function succeeds, the system owns the object identified by the $hMemory parameter.  \nThe application may not write to or free the data once ownership has been transferred to the system, but it can lock and read from the data until the _ClipBoard_Close() function is called.  \nThe memory must be unlocked before the clipboard is closed.  \nIf the $hMemory parameter identifies a memory object, the object must have been allocated using the function with the $GMEM_MOVEABLE flag.',
      },
      {
        label: '$iFormat',
        documentation: '**[optional]** Specifies a clipboard format',
      },
    ],
  },
  _ClipBoard_SetViewer: {
    documentation: 'Adds the specified window to the chain of clipboard viewers',
    label: '_ClipBoard_SetViewer ( $hViewer )',
    params: [
      {
        label: '$hViewer',
        documentation: 'Handle to the window to be added to the clipboard chain',
      },
    ],
  },
  _ClipPutFile: {
    documentation: 'Copy Files to Clipboard Like Explorer does',
    label: '_ClipPutFile ( $sFilePath [, $sDelimiter = "|"] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Full Path to File(s)',
      },
      {
        label: '$sDelimiter',
        documentation: "**[optional]** Separator for multiple Files, Default = '|'",
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
