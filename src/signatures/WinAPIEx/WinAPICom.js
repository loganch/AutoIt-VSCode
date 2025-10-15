import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPICom.au3>`)';

const signatures = {
  _WinAPI_CLSIDFromProgID: {
    documentation: 'Looks up a CLSID in the registry, given a ProgID',
    label: '_WinAPI_CLSIDFromProgID ( $sProgID )',
    params: [
      {
        label: '$sProgID',
        documentation: 'The string containing the ProgID whose CLSID is requested.',
      },
    ],
  },
  _WinAPI_CoInitialize: {
    documentation: 'Initializes the COM library for use by the calling process',
    label: '_WinAPI_CoInitialize ( [$iFlags = 0] )',
    params: [
      {
        label: '$iFlags',
        documentation: '**[optional]** Initialization flags. Default is 0.',
      },
    ],
  },
  _WinAPI_CoTaskMemAlloc: {
    documentation: 'Allocates a block of task memory',
    label: '_WinAPI_CoTaskMemAlloc ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'Size of the memory block to allocate, in bytes',
      },
    ],
  },
  _WinAPI_CoTaskMemFree: {
    documentation: 'Frees a block of task memory',
    label: '_WinAPI_CoTaskMemFree ( $pMemory )',
    params: [
      {
        label: '$pMemory',
        documentation: 'Pointer to the memory block to be freed',
      },
    ],
  },
  _WinAPI_CoTaskMemRealloc: {
    documentation: 'Changes the size of a previously allocated block of task memory',
    label: '_WinAPI_CoTaskMemRealloc ( $pMemory, $iSize )',
    params: [
      {
        label: '$pMemory',
        documentation: 'Pointer to the memory block to be reallocated',
      },
      {
        label: '$iSize',
        documentation: 'New size of the memory block, in bytes',
      },
    ],
  },
  _WinAPI_CoUninitialize: {
    documentation: 'Closes the COM library on the current process',
    label: '_WinAPI_CoUninitialize ( )',
    params: [],
  },
  _WinAPI_CreateGUID: {
    documentation: 'Creates a globally unique identifier (GUID)',
    label: '_WinAPI_CreateGUID ( )',
    params: [],
  },
  _WinAPI_CreateStreamOnHGlobal: {
    documentation: 'Creates a stream object that uses a memory handle to store the stream contents',
    label: '_WinAPI_CreateStreamOnHGlobal ( [$hGlobal = 0 [, $bDeleteOnRelease = True]] )',
    params: [
      {
        label: '$hGlobal',
        documentation: '**[optional]** Handle to the global memory block. Default is 0.',
      },
      {
        label: '$bDeleteOnRelease',
        documentation:
          '**[optional]** Indicates whether the underlying memory should be freed when the stream object is released. Default is True.',
      },
    ],
  },
  _WinAPI_GetHGlobalFromStream: {
    documentation: 'Retrieves the global memory handle to a stream',
    label: '_WinAPI_GetHGlobalFromStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation: 'Pointer to the stream object',
      },
    ],
  },
  _WinAPI_ProgIDFromCLSID: {
    documentation: 'Retrieves the ProgID for a given CLSID',
    label: '_WinAPI_ProgIDFromCLSID ( $sCLSID )',
    params: [
      {
        label: '$sCLSID',
        documentation: 'The CLSID to look up',
      },
    ],
  },
  _WinAPI_ReleaseStream: {
    documentation: 'Releases a stream object',
    label: '_WinAPI_ReleaseStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation: 'Pointer to the stream object to be released',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
