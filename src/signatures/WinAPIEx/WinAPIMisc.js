import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIMisc.au3>`)';

const signatures = {
  _WinAPI_GetExtended: {
    documentation: 'Retrieves the last extended function return value',
    label: '_WinAPI_GetExtended ( )',
    params: [

    ],
  },
  _WinAPI_PlaySound: {
    documentation: 'Plays a sound specified by the given file name, resource, or system event',
    label: '_WinAPI_PlaySound ( $sSound [, $iFlags = $SND_SYSTEM_NOSTOP [, $hInstance = 0]] )',
    params: [
      {
        label: '$sSound [, $iFlags',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CharToOem: {
    documentation: 'Converts a string into the OEM-defined character set',
    label: '_WinAPI_CharToOem ( $sStr )',
    params: [
      {
        label: '$sStr',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DWordToFloat: {
    documentation: 'Converts a value of type DWORD to a value of type FLOAT',
    label: '_WinAPI_DWordToFloat ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DWordToInt: {
    documentation: 'Converts a value of type DWORD to a value of type INT',
    label: '_WinAPI_DWordToInt ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_FloatToDWord: {
    documentation: 'Converts a value of type FLOAT to a value of type DWORD',
    label: '_WinAPI_FloatToDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetString: {
    documentation: 'Returns a string located at the specified memory address',
    label: '_WinAPI_GetString ( $pString [, $bUnicode = True] )',
    params: [
      {
        label: '$pString [, $bUnicode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_HashData: {
    documentation: 'Hashes a memory block',
    label: '_WinAPI_HashData ( $pMemory, $iSize [, $iLength = 32] )',
    params: [
      {
        label: '$pMemory',
        documentation: 'Parameter description',
      },
      {
        label: '$iSize [, $iLength',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_HashString: {
    documentation: 'Hashes a string',
    label: '_WinAPI_HashString ( $sString [, $bCaseSensitive = True [, $iLength = 32]] )',
    params: [
      {
        label: '$sString [, $bCaseSensitive',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_HiByte: {
    documentation: 'Returns the high BYTE of a 16-bit (2 bytes) value',
    label: '_WinAPI_HiByte ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_HiDWord: {
    documentation: 'Returns the high DWORD of a 64-bit (8 bytes) value',
    label: '_WinAPI_HiDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_IntToDWord: {
    documentation: 'Converts a value of type INT to a value of type DWORD',
    label: '_WinAPI_IntToDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoByte: {
    documentation: 'Returns the low BYTE of a 16-bit (2 bytes) value',
    label: '_WinAPI_LoByte ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LoDWord: {
    documentation: 'Returns the low DWORD of a 64-bit (8 bytes) value',
    label: '_WinAPI_LoDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_LongMid: {
    documentation: 'Extracts a number of bits from a DWORD (32-bit) value',
    label: '_WinAPI_LongMid ( $iValue, $iStart, $iCount )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      },
      {
        label: '$iStart',
        documentation: 'Parameter description',
      },
      {
        label: '$iCount',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_MakeWord: {
    documentation: 'Returns a WORD (16-bit) value from two BYTE (8-bit) values',
    label: '_WinAPI_MakeWord ( $iLo, $iHi )',
    params: [
      {
        label: '$iLo',
        documentation: 'Parameter description',
      },
      {
        label: '$iHi',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_OemToChar: {
    documentation: 'Converts a string from the OEM-defined character set into either an ANSI string',
    label: '_WinAPI_OemToChar ( $sStr )',
    params: [
      {
        label: '$sStr',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ShortToWord: {
    documentation: 'Converts a value of type SHORT to a value of type WORD',
    label: '_WinAPI_ShortToWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StrFormatByteSize: {
    documentation: 'Converts a numeric value into a string that represents the number expressed as a size value in bytes, kilobytes, megabytes, or gigabytes',
    label: '_WinAPI_StrFormatByteSize ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StrFormatByteSizeEx: {
    documentation: 'Converts a numeric value into a string that represents the number expressed as separated groups of digits to the left of the decimal',
    label: '_WinAPI_StrFormatByteSizeEx ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StrFormatKBSize: {
    documentation: 'Converts a numeric value into a string that represents the number expressed as a size value in kilobytes',
    label: '_WinAPI_StrFormatKBSize ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StrFromTimeInterval: {
    documentation: 'Converts a time interval to a string',
    label: '_WinAPI_StrFromTimeInterval ( $iTime [, $iDigits = 7] )',
    params: [
      {
        label: '$iTime [, $iDigits',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StrLen: {
    documentation: 'Returns the length of the specified string',
    label: '_WinAPI_StrLen ( $pString [, $bUnicode = True] )',
    params: [
      {
        label: '$pString [, $bUnicode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SwapDWord: {
    documentation: 'Converts a ULONG from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SwapQWord: {
    documentation: 'Converts a ULONGLONG from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapQWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SwapWord: {
    documentation: 'Converts a USHORT from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_WordToShort: {
    documentation: 'Converts a value of type WORD to a value of type SHORT',
    label: '_WinAPI_WordToShort ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ArrayToStruct: {
    documentation: 'Converts an array of strings to the structure',
    label: '_WinAPI_ArrayToStruct ( Const ByRef $aData [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: 'Const ByRef $aData [, $iStart',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CopyStruct: {
    documentation: 'Creates a duplicate of a specified structure',
    label: '_WinAPI_CopyStruct ( $tStruct [, $sStruct = \'\'] )',
    params: [
      {
        label: '$tStruct [, $sStruct',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateMargins: {
    documentation: 'Creates $tagMARGINS structure with specified left, right, top, and bottom retaining borders',
    label: '_WinAPI_CreateMargins ( $iLeftWidth, $iRightWidth, $iTopHeight, $iBottomHeight )',
    params: [
      {
        label: '$iLeftWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iRightWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iTopHeight',
        documentation: 'Parameter description',
      },
      {
        label: '$iBottomHeight',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreatePoint: {
    documentation: 'Creates $tagPOINT structure with the x- and y-coordinates of the specified point',
    label: '_WinAPI_CreatePoint ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateRect: {
    documentation: 'Creates $tagRECT structure with the coordinates of the specified rectangle',
    label: '_WinAPI_CreateRect ( $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$iLeft',
        documentation: 'Parameter description',
      },
      {
        label: '$iTop',
        documentation: 'Parameter description',
      },
      {
        label: '$iRight',
        documentation: 'Parameter description',
      },
      {
        label: '$iBottom',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateRectEx: {
    documentation: 'Creates $tagRECT structure with the coordinates of the specified rectangle',
    label: '_WinAPI_CreateRectEx ( $iX, $iY, $iWidth, $iHeight )',
    params: [
      {
        label: '$iX',
        documentation: 'Parameter description',
      },
      {
        label: '$iY',
        documentation: 'Parameter description',
      },
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateSize: {
    documentation: 'Creates $tagSIZE structure with the width and height of the specified rectangle',
    label: '_WinAPI_CreateSize ( $iWidth, $iHeight )',
    params: [
      {
        label: '$iWidth',
        documentation: 'Parameter description',
      },
      {
        label: '$iHeight',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_StructToArray: {
    documentation: 'Converts the structure to the array of strings',
    label: '_WinAPI_StructToArray ( $tStruct [, $iItems = 0] )',
    params: [
      {
        label: '$tStruct [, $iItems',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_UnionStruct: {
    documentation: 'Creates the structure of two structures',
    label: '_WinAPI_UnionStruct ( $tStruct1, $tStruct2 [, $sStruct = \'\'] )',
    params: [
      {
        label: '$tStruct1',
        documentation: 'Parameter description',
      },
      {
        label: '$tStruct2 [, $sStruct',
        documentation: 'Parameter description',
      }
    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
