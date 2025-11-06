import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIMisc.au3>`)';

const signatures = {
  _WinAPI_GetExtended: {
    documentation: 'Retrieves the last extended function return value',
    label: '_WinAPI_GetExtended ( )',
    params: [],
  },
  _WinAPI_PlaySound: {
    documentation: 'Plays a sound specified by the given file name, resource, or system event',
    label: '_WinAPI_PlaySound ( $sSound [, $iFlags = $SND_SYSTEM_NOSTOP [, $hInstance = 0]] )',
    params: [
      {
        label: '$sSound',
        documentation:
          'The string that specifies the sound to play. The maximum length is 255 characters. If $sSound isempty, any currently playing waveform sound is stopped.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags for sound playing. This parameter can be one or more of the following values.$SND_APPLICATION$SND_ALIAS$SND_ALIAS_ID$SND_ASYNC$SND_FILENAME$SND_LOOP$SND_MEMORY$SND_NODEFAULT$SND_NOSTOP$SND_NOWAIT$SND_PURGE$SND_RESOURCE$SND_SYNC **Windows Vista or later**$SND_SENTRY$SND_SYSTEM Three flags ($SND_ALIAS, $SND_FILENAME, and $SND_RESOURCE) determine whether the name is interpretedas an alias for a system event, a file name, or a resource identifier. If none of these flags arespecified, [_WinAPI_PlaySound()] searches the registry or the WIN.INI file for an association withthe specified sound name. If an association is found, the sound event is played. If no associationis found in the registry, the name is interpreted as a file name. If the $SND_ALIAS_ID flag is specified in $iFlags, the $sSound parameter must be one of the$SND_ALIAS_* values.(See MSDN for more information)',
      },
      {
        label: '$hInstance',
        documentation:
          '**[optional]** Handle to the executable file that contains the resource to be loaded. If $iFlags does notcontain the $SND_RESOURCE, this parameter will be ignored.',
      },
    ],
  },
  _WinAPI_CharToOem: {
    documentation: 'Converts a string into the OEM-defined character set',
    label: '_WinAPI_CharToOem ( $sStr )',
    params: [
      {
        label: '$sStr',
        documentation: 'The string that must be converted.',
      },
    ],
  },
  _WinAPI_DWordToFloat: {
    documentation: 'Converts a value of type DWORD to a value of type FLOAT',
    label: '_WinAPI_DWordToFloat ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_DWordToInt: {
    documentation: 'Converts a value of type DWORD to a value of type INT',
    label: '_WinAPI_DWordToInt ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_FloatToDWord: {
    documentation: 'Converts a value of type FLOAT to a value of type DWORD',
    label: '_WinAPI_FloatToDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_GetString: {
    documentation: 'Returns a string located at the specified memory address',
    label: '_WinAPI_GetString ( $pString [, $bUnicode = True] )',
    params: [
      {
        label: '$pString',
        documentation: 'Pointer to a null-terminated string.',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Specifies whether a string is Unicode or ASCII code of a character, valid values: True - Unicode (Default). False - ASCII.',
      },
    ],
  },
  _WinAPI_HashData: {
    documentation: 'Hashes a memory block',
    label: '_WinAPI_HashData ( $pMemory, $iSize [, $iLength = 32] )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to a memory block containing data to hash.',
      },
      {
        label: '$iSize',
        documentation: 'The size of the memory block, in bytes.',
      },
      {
        label: '$iLength',
        documentation:
          '**[optional]** The length of the hash data, in bytes. It should be no larger than 256, otherwise, the function fails. Default is 32.',
      },
    ],
  },
  _WinAPI_HashString: {
    documentation: 'Hashes a string',
    label: '_WinAPI_HashString ( $sString [, $bCaseSensitive = True [, $iLength = 32]] )',
    params: [
      {
        label: '$sString',
        documentation: 'The string to hash.',
      },
      {
        label: '$bCaseSensitive',
        documentation:
          '**[optional]** Specifies whether to treat the string as case sensitive when computing the hash value, valid values: True - The lowercase and uppercase string hash to the different value (Default). False - The lowercase and uppercase string hash to the same value.',
      },
      {
        label: '$iLength',
        documentation:
          '**[optional]** The length of the hash data, in bytes. It should be no larger than 256, otherwise, the function fails. Default is 32.',
      },
    ],
  },
  _WinAPI_HiByte: {
    documentation: 'Returns the high BYTE of a 16-bit (2 bytes) value',
    label: '_WinAPI_HiByte ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: '16-bit value.',
      },
    ],
  },
  _WinAPI_HiDWord: {
    documentation: 'Returns the high DWORD of a 64-bit (8 bytes) value',
    label: '_WinAPI_HiDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: '64-bit value.',
      },
    ],
  },
  _WinAPI_IntToDWord: {
    documentation: 'Converts a value of type INT to a value of type DWORD',
    label: '_WinAPI_IntToDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_LoByte: {
    documentation: 'Returns the low BYTE of a 16-bit (2 bytes) value',
    label: '_WinAPI_LoByte ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: '16-bit value.',
      },
    ],
  },
  _WinAPI_LoDWord: {
    documentation: 'Returns the low DWORD of a 64-bit (8 bytes) value',
    label: '_WinAPI_LoDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: '64-bit value.',
      },
    ],
  },
  _WinAPI_LongMid: {
    documentation: 'Extracts a number of bits from a DWORD (32-bit) value',
    label: '_WinAPI_LongMid ( $iValue, $iStart, $iCount )',
    params: [
      {
        label: '$iValue',
        documentation: '32-bit value.',
      },
      {
        label: '$iStart',
        documentation: 'The bit position to start. (0 - first bit)',
      },
      {
        label: '$iCount',
        documentation: 'The number of bits to extract.',
      },
    ],
  },
  _WinAPI_MakeWord: {
    documentation: 'Returns a WORD (16-bit) value from two BYTE (8-bit) values',
    label: '_WinAPI_MakeWord ( $iLo, $iHi )',
    params: [
      {
        label: '$iLo',
        documentation: 'Low byte.',
      },
      {
        label: '$iHi',
        documentation: 'Hi byte.',
      },
    ],
  },
  _WinAPI_OemToChar: {
    documentation:
      'Converts a string from the OEM-defined character set into either an ANSI string',
    label: '_WinAPI_OemToChar ( $sStr )',
    params: [
      {
        label: '$sStr',
        documentation: 'The string of characters from the OEM-defined character set.',
      },
    ],
  },
  _WinAPI_ShortToWord: {
    documentation: 'Converts a value of type SHORT to a value of type WORD',
    label: '_WinAPI_ShortToWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_StrFormatByteSize: {
    documentation:
      'Converts a numeric value into a string that represents the number expressed as a size value in bytes, kilobytes, megabytes, or gigabytes',
    label: '_WinAPI_StrFormatByteSize ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'The numeric value to be converted.',
      },
    ],
  },
  _WinAPI_StrFormatByteSizeEx: {
    documentation:
      'Converts a numeric value into a string that represents the number expressed as separated groups of digits to the left of the decimal',
    label: '_WinAPI_StrFormatByteSizeEx ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'The numeric value to be converted.',
      },
    ],
  },
  _WinAPI_StrFormatKBSize: {
    documentation:
      'Converts a numeric value into a string that represents the number expressed as a size value in kilobytes',
    label: '_WinAPI_StrFormatKBSize ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'The numeric value to be converted.',
      },
    ],
  },
  _WinAPI_StrFromTimeInterval: {
    documentation: 'Converts a time interval to a string',
    label: '_WinAPI_StrFromTimeInterval ( $iTime [, $iDigits = 7] )',
    params: [
      {
        label: '$iTime',
        documentation: 'The time interval, in milliseconds.',
      },
      {
        label: '$iDigits',
        documentation:
          '**[optional]** The maximum number of significant digits to be represented in converted string. Default is 7.',
      },
    ],
  },
  _WinAPI_StrLen: {
    documentation: 'Returns the length of the specified string',
    label: '_WinAPI_StrLen ( $pString [, $bUnicode = True] )',
    params: [
      {
        label: '$pString',
        documentation: 'Pointer to a null-terminated string.',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Specifies whether a string is Unicode or ASCII code of a character, valid values: True - Unicode (Default). False - ASCII.',
      },
    ],
  },
  _WinAPI_SwapDWord: {
    documentation: 'Converts a ULONG from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapDWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The ULONG value to convert.',
      },
    ],
  },
  _WinAPI_SwapQWord: {
    documentation: 'Converts a ULONGLONG from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapQWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The ULONGLONG value to convert.',
      },
    ],
  },
  _WinAPI_SwapWord: {
    documentation: 'Converts a USHORT from little-endian to big-endian, and vice versa',
    label: '_WinAPI_SwapWord ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The USHORT value to convert.',
      },
    ],
  },
  _WinAPI_WordToShort: {
    documentation: 'Converts a value of type WORD to a value of type SHORT',
    label: '_WinAPI_WordToShort ( $iValue )',
    params: [
      {
        label: '$iValue',
        documentation: 'The value to be converted.',
      },
    ],
  },
  _WinAPI_ArrayToStruct: {
    documentation: 'Converts an array of strings to the structure',
    label: '_WinAPI_ArrayToStruct ( Const ByRef $aData [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: 'Const ByRef $aData',
        documentation: 'The array to convert.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start converting at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop converting at.',
      },
    ],
  },
  _WinAPI_CopyStruct: {
    documentation: 'Creates a duplicate of a specified structure',
    label: "_WinAPI_CopyStruct ( $tStruct [, $sStruct = ''] )",
    params: [
      {
        label: '$tStruct',
        documentation: 'The structure to be duplicated.',
      },
      {
        label: '$sStruct',
        documentation:
          '**[optional]** The string representing the structure (same as for the DllStructCreate() function).',
      },
    ],
  },
  _WinAPI_CreateMargins: {
    documentation:
      'Creates $tagMARGINS structure with specified left, right, top, and bottom retaining borders',
    label: '_WinAPI_CreateMargins ( $iLeftWidth, $iRightWidth, $iTopHeight, $iBottomHeight )',
    params: [
      {
        label: '$iLeftWidth',
        documentation: 'The width of the left border that retains its size.',
      },
      {
        label: '$iRightWidth',
        documentation: 'The width of the right border that retains its size.',
      },
      {
        label: '$iTopHeight',
        documentation: 'The height of the top border that retains its size.',
      },
      {
        label: '$iBottomHeight',
        documentation: 'The height of the bottom border that retains its size.',
      },
    ],
  },
  _WinAPI_CreatePoint: {
    documentation:
      'Creates $tagPOINT structure with the x- and y-coordinates of the specified point',
    label: '_WinAPI_CreatePoint ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point.',
      },
    ],
  },
  _WinAPI_CreateRect: {
    documentation: 'Creates $tagRECT structure with the coordinates of the specified rectangle',
    label: '_WinAPI_CreateRect ( $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$iLeft',
        documentation: 'The x-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iTop',
        documentation: 'The y-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iRight',
        documentation: 'The x-coordinate of the lower-right corner of the rectangle.',
      },
      {
        label: '$iBottom',
        documentation: 'The y-coordinate of the lower-right corner of the rectangle.',
      },
    ],
  },
  _WinAPI_CreateRectEx: {
    documentation: 'Creates $tagRECT structure with the coordinates of the specified rectangle',
    label: '_WinAPI_CreateRectEx ( $iX, $iY, $iWidth, $iHeight )',
    params: [
      {
        label: '$iX',
        documentation: 'The x-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the upper-left corner of the rectangle.',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the rectangle.',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the rectangle.',
      },
    ],
  },
  _WinAPI_CreateSize: {
    documentation:
      'Creates $tagSIZE structure with the width and height of the specified rectangle',
    label: '_WinAPI_CreateSize ( $iWidth, $iHeight )',
    params: [
      {
        label: '$iWidth',
        documentation: 'The width of the rectangle.',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the rectangle.',
      },
    ],
  },
  _WinAPI_StructToArray: {
    documentation: 'Converts the structure to the array of strings',
    label: '_WinAPI_StructToArray ( $tStruct [, $iItems = 0] )',
    params: [
      {
        label: '$tStruct',
        documentation:
          'The structure to convert. This structure should be same as for [_WinAPI_ArrayToStruct()].',
      },
      {
        label: '$iItems',
        documentation:
          '**[optional]** The number of strings that contains the structure. If this parameter is 0 (Default), the end of the structuredetermined by a double null-terminated character ("... ; {0};{0}").',
      },
    ],
  },
  _WinAPI_UnionStruct: {
    documentation: 'Creates the structure of two structures',
    label: "_WinAPI_UnionStruct ( $tStruct1, $tStruct2 [, $sStruct = ''] )",
    params: [
      {
        label: '$tStruct1',
        documentation: 'The structure that contains the first source data.',
      },
      {
        label: '$tStruct2',
        documentation: 'The structure that contains the second source data.',
      },
      {
        label: '$sStruct',
        documentation:
          '**[optional]** The string representing the final structure (same as for the DllStructCreate() function).',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
