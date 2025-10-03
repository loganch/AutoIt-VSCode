import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Memory.au3>`)';

const signatures = {
  _MemGlobalAlloc: {
    documentation: 'Allocates the specified number of bytes from the heap',
    label: '_MemGlobalAlloc ( $iBytes [, $iFlags = 0] )',
    params: [
      {
        label: '$iBytes',
        documentation:
          'The number of bytes to allocate. If this parameter is zero and the $iFlags parameter specifies $GMEM_MOVEABLE, the function returns a handle to a memory object that is marked as discarded.',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** The memory allocation attributes',
      },
    ],
  },
  _MemGlobalFree: {
    documentation: 'Frees the specified global memory object and invalidates its handle',
    label: '_MemGlobalFree ( $hMemory )',
    params: [
      {
        label: '$hMemory',
        documentation: 'Handle to the global memory object',
      },
    ],
  },
  _MemGlobalLock: {
    documentation:
      "Locks a global memory object and returns a pointer to the first byte of the object's memory block",
    label: '_MemGlobalLock ( $hMemory )',
    params: [
      {
        label: '$hMemory',
        documentation: 'Handle to the global memory object',
      },
    ],
  },
  _MemGlobalSize: {
    documentation: 'Retrieves the current size of the specified global memory object',
    label: '_MemGlobalSize ( $hMemory )',
    params: [
      {
        label: '$hMemory',
        documentation: 'Handle to the global memory object',
      },
    ],
  },
  _MemGlobalUnlock: {
    documentation:
      'Decrements the lock count associated with a memory object that was allocated with GMEM_MOVEABLE',
    label: '_MemGlobalUnlock ( $hMemory )',
    params: [
      {
        label: '$hMemory',
        documentation: 'Handle to the global memory object',
      },
    ],
  },
  _MemMoveMemory: {
    documentation: 'Moves memory either forward or backward, aligned or unaligned',
    label: '_MemMoveMemory ( $pSource, $pDest, $iLength )',
    params: [
      {
        label: '$pSource',
        documentation: 'Pointer to the source of the move',
      },
      {
        label: '$pDest',
        documentation: 'Pointer to the destination of the move',
      },
      {
        label: '$iLength',
        documentation: 'Specifies the number of bytes to be copied',
      },
    ],
  },
  _MemVirtualAlloc: {
    documentation:
      'Reserves or commits a region of pages in the virtual address space of the calling process',
    label: '_MemVirtualAlloc ( $pAddress, $iSize, $iAllocation, $iProtect )',
    params: [
      {
        label: '$pAddress',
        documentation: 'Specifies the desired starting address of the region to allocate',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the size, in bytes, of th region',
      },
      {
        label: '$iAllocation',
        documentation: 'Specifies the type of allocation',
      },
      {
        label: '$iProtect',
        documentation: 'Type of access protection',
      },
    ],
  },
  _MemVirtualAllocEx: {
    documentation:
      'Reserves a region of memory within the virtual address space of a specified process',
    label: '_MemVirtualAllocEx ( $hProcess, $pAddress, $iSize, $iAllocation, $iProtect )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Handle to process',
      },
      {
        label: '$pAddress',
        documentation: 'Specifies the desired starting address of the region to allocate',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the size, in bytes, of th region',
      },
      {
        label: '$iAllocation',
        documentation:
          "Specifies the type of allocation:    $MEM_COMMIT - Allocates physical storage in memory or in the paging file on disk for the specified region of pages.    $MEM_RESERVE - Reserves a range of the process's virtual address space without allocating any physical storage.    $MEM_TOP_DOWN - Allocates memory at the highest possible address",
      },
      {
        label: '$iProtect',
        documentation:
          'Type of access protection:    $PAGE_READONLY - Enables read access to the committed region of pages    $PAGE_READWRITE - Enables read and write access to the committed region    $PAGE_EXECUTE - Enables execute access to the committed region    $PAGE_EXECUTE_READ - Enables execute and read access to the committed region    $PAGE_EXECUTE_READWRITE - Enables execute, read, and write access to the committed region of pages    $PAGE_GUARD - Pages in the region become guard pages    $PAGE_NOACCESS - Disables all access to the committed region of pages    $PAGE_NOCACHE - Allows no caching of the committed regions of pages',
      },
    ],
  },
  _MemVirtualFree: {
    documentation: 'Releases a region of pages within the virtual address space of a process',
    label: '_MemVirtualFree ( $pAddress, $iSize, $iFreeType )',
    params: [
      {
        label: '$pAddress',
        documentation: 'Points to the base address of the region of pages to be freed',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the size, in bytes, of the region to be freed',
      },
      {
        label: '$iFreeType',
        documentation:
          'Specifies the type of free operation:    $MEM_DECOMMIT - Decommits the specified region of committed pages    $MEM_RELEASE - Releases the specified region of reserved pages',
      },
    ],
  },
  _MemVirtualFreeEx: {
    documentation: 'Releases a region of pages within the virtual address space of a process',
    label: '_MemVirtualFreeEx ( $hProcess, $pAddress, $iSize, $iFreeType )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Handle to a process',
      },
      {
        label: '$pAddress',
        documentation: 'A pointer to the starting address of the region of memory to be freed',
      },
      {
        label: '$iSize',
        documentation: 'The size of the region of memory to free, in bytes',
      },
      {
        label: '$iFreeType',
        documentation:
          'Specifies the type of free operation:    $MEM_DECOMMIT - Decommits the specified region of committed pages    $MEM_RELEASE - Releases the specified region of reserved pages',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
