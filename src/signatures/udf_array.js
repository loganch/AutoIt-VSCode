import { CompletionItemKind } from 'vscode';
import {
  br,
  defaultZero,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Array.au3>`)';

const signatures = {
  _ArrayColDelete: {
    documentation: 'Deletes a specified column from a 2D array',
    label: '_ArrayColDelete ( ByRef $aArray, $iColumn [, $bConvert = False] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iColumn',
        documentation: 'Column to delete',
      },
      {
        label: '$bConvert',
        documentation:
          '**[optional]** If True then if only one column remains the array is converted to 1D',
      },
    ],
  },
  _ArrayColInsert: {
    documentation: 'Inserts a specified column into a 1D or 2D array',
    label: '_ArrayColInsert ( ByRef $aArray, $iColumn )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iColumn',
        documentation: 'Column to insert - if array is 1D it is automatically converted to 2D',
      },
    ],
  },
  _ArrayCombinations: {
    documentation:
      'Returns an array of the combinations of a set of elements from a selected 1D array',
    label: '_ArrayCombinations ( Const ByRef $aArray, $iSet [, $sDelimiter = ""] )',
    params: [
      {
        label: '$aArray',
        documentation: 'The Array to use',
      },
      {
        label: '$iSet',
        documentation: 'Size of the combinations set',
      },
      {
        label: '$sDelimiter',
        documentation: '**[optional]** String result separator, default is "" for none',
      },
    ],
  },
  _ArrayConcatenate: {
    documentation: 'Concatenate two arrays - either 1D or 2D with the same number of columns',
    label: '_ArrayConcatenate ( Const ByRef $aArrayTarget, ByRef $aArraySource [, $iStart = 0] )',
    params: [
      {
        label: '$aArrayTarget',
        documentation: 'The array to which the source array will be concatenated',
      },
      {
        label: '$aArraySource',
        documentation: 'The array to concatenate to the target array',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** index of the first Source array entry (Default = 0)',
      },
    ],
  },
  _ArrayDelete: {
    documentation: 'Deletes the specified element(s) from the specified 1D or 2D array',
    label: '_ArrayDelete ( ByRef $aArray, $vRange )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$vRange',
        documentation:
          'Element(s) to delete - either a single index, a range string or a 1D array with a count in the [0] element (see example for details)',
      },
    ],
  },
  _ArrayDisplay: {
    documentation: 'Displays a 1D or 2D array in a ListView',
    label:
      '_ArrayDisplay ( Const ByRef $aArray [, $sTitle = "ArrayDisplay" [, $sArrayRange = "" [, $iFlags = 0 [, $vUser_Separator = Default [, $sHeader = Default [, $iMax_ColWidth = Default [, $iAlt_Color = Default [, $hUser_Function = ""]]]]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to display',
      },
      {
        label: '$sTitle',
        documentation: '**[optional]** Title for dialog. Default = "ArrayDisplay".',
      },
      {
        label: '$sArrayRange',
        documentation:
          '**[optional]** Range of rows/columns to display. Default ("") = entire array.',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Determine UDF options. Add required values together  \n  0 = (default) Column text alignment - left  \n    1 = Transposes the array  \n  2 = Column text alignment - right  \n4 = Column text alignment - center  \n8 = Verbose - display MsgBox on error and splash screens during processing of large arrays  \n16 = Only 'Copy' buttons displayed  \n32 = No buttons displayed  \n64 = No 'Row' column displayed",
      },
      {
        label: '$vUser_Separator',
        documentation:
          '**[optional]** Sets column display option when copying data to clipboard.  \n> Character = Delimiter between columns.  \n> Number = Fixed column width - longer items will be truncated.  \n> Default = Current separator character (usually "|").',
      },
      {
        label: '$sHeader',
        documentation:
          '**[optional]** Column names in header (string of names separated by current separator character - usually "|").',
      },
      {
        label: '$iMax_ColWidth',
        documentation:
          '**[optional]** Max width to which a ListView column will expand to show content. Default = 350 pixels.',
      },
      {
        label: '$iAlt_Color',
        documentation:
          '**[optional]** ListView alternate rows set to defined color. Default = all rows ListView background color.',
      },
      {
        label: '$hUser_Function',
        documentation:
          '**[optional]** A variable assigned to the user defined function to run. Default = none.',
      },
    ],
  },
  _ArrayExtract: {
    documentation: 'Extracts an array from the specified element(s) of a 1D or 2D array',
    label:
      '_ArrayExtract ( Const ByRef $aArray [, $iStart_Row = -1 [, $iEnd_Row = -1 [, $iStart_Col = -1 [, $iEnd_Col = -1]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array from which extraction should occur',
      },
      {
        label: '$iStart_Row',
        documentation: '**[optional]** First row of the extracted array',
      },
      {
        label: '$iEnd_Row',
        documentation: '**[optional]** Last row of the extracted array',
      },
      {
        label: '$iStart_Col',
        documentation: '**[optional]** First column of the extracted array (2D only)',
      },
      {
        label: '$iEnd_Col',
        documentation: '**[optional]** Last column of the extracted array (2D only)',
      },
    ],
  },
  _ArrayFindAll: {
    documentation:
      'Find the indices of all ocurrences of a search query between two points in a 1D or 2D array using _ArraySearch()',
    label:
      '_ArrayFindAll ( Const ByRef $aArray, $vValue [, $iStart = 0 [, $iEnd = 0 [, $iCase = 0 [, $iCompare = 0 [, $iSubItem = 0 [, $bRow = False]]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'The array to search',
      },
      {
        label: '$vValue',
        documentation: 'What to search $aArray for',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start search',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to end search',
      },
      {
        label: '$iCase',
        documentation: '**[optional]** If set to 1, search is case sensitive',
      },
      {
        label: '$iCompare',
        documentation:
          '**[optional]**  \n0 Casting of variables to the same type (default), "string" = 0, "" = 0 or "0" = 0 match (If $iCase = 0)  \n1 executes a partial search  \n2 comparison match if variables have same type and same value  \n3 compares using a regular expression pattern provided as $vValue',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Sub-index to search on in 2D arrays',
      },
      {
        label: '$bRow',
        documentation:
          '**[optional]** If True then $iSubItem sets the row to search - False (default) searches columns',
      },
    ],
  },
  _ArrayInsert: {
    documentation: 'Insert a new value at the specified position of a 1D or 2D array',
    label:
      '_ArrayInsert ( ByRef $aArray, $vRange [, $vValue = "" [, $iStart = 0 [, $sDelim_Item = "|" [, $sDelim_Row = @CRLF [, $iForce = $ARRAYFILL_FORCE_DEFAULT]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$vRange',
        documentation: 'Position(s) at which to insert item(s) - see Remarks for format',
      },
      {
        label: '$vValue',
        documentation:
          '**[optional]** Value(s) to add - can be a single variable, a delimited string or a 1D array',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Column in which insert is to begin (2D array only)',
      },
      {
        label: '$sDelim_Item',
        documentation: '**[optional]** Delimiter used if a string is to be split into items',
      },
      {
        label: '$sDelim_Row',
        documentation:
          '**[optional]** Delimiter used if a string is to be split into rows (2D only)',
      },
      {
        label: '$iForce',
        documentation:
          '**[optional]** Maintains default behaviour,  \n`$ARRAYFILL_FORCE_DEFAULT` (0)  \nForces $vValue addition as a single item,  \n`$ARRAYFILL_FORCE_SINGLEITEM` (1)  \nOr forces datatype for all added items  \n`$ARRAYFILL_FORCE_INT` (2)  \n`$ARRAYFILL_FORCE_NUMBER` (3)  \n`$ARRAYFILL_FORCE_PTR` (4)  \n`$ARRAYFILL_FORCE_HWND` (5)  \n`$ARRAYFILL_FORCE_STRING` (6)',
      },
    ],
  },
  _ArrayMax: {
    documentation: 'Returns the highest value held in a 1D or 2D array',
    label:
      '_ArrayMax ( Const ByRef $aArray [, $iCompNumeric = 0 [, $iStart = -1 [, $iEnd = -1 [, $iSubItem = 0]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to search',
      },
      {
        label: '$iCompNumeric',
        documentation:
          '**[optional]** Comparison method:  \n`0` - compare alphanumerically  \n`1` - compare numerically',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start search',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to end search',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Column of array to search',
      },
    ],
  },
  _ArrayMaxIndex: {
    documentation: 'Returns the index where the highest value occurs in a 1D or 2D array',
    label:
      '_ArrayMaxIndex ( Const ByRef $aArray [, $iCompNumeric = 0 [, $iStart = -1 [, $iEnd = -1 [, $iSubItem = 0]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to search',
      },
      {
        label: '$iCompNumeric',
        documentation:
          '**[optional]** Comparison method:  \n`0` - compare alphanumerically  \n`1` - compare numerically',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start search',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to end search',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Column of array to search',
      },
    ],
  },
  _ArrayMin: {
    documentation: 'Returns the lowest value held in a 1D or 2D array',
    label:
      '_ArrayMin ( Const ByRef $aArray [, $iCompNumeric = 0 [, $iStart = -1 [, $iEnd = -1 [, $iSubItem = 0]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to search',
      },
      {
        label: '$iCompNumeric',
        documentation:
          '**[optional]** Comparison method:  \n`0` - compare alphanumerically  \n`1` - compare numerically',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start search',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to end search',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Column of array to search',
      },
    ],
  },
  _ArrayMinIndex: {
    documentation: 'Returns the index where the lowest value occurs in a 1D or 2D array',
    label:
      '_ArrayMinIndex ( Const ByRef $aArray [, $iCompNumeric = 0 [, $iStart = -1 [, $iEnd = -1 [, $iSubItem = 0]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to search',
      },
      {
        label: '$iCompNumeric',
        documentation:
          '**[optional]** Comparison method:  \n`0` - compare alphanumerically  \n`1` - compare numerically',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start search',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to end search',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Column of array to search',
      },
    ],
  },
  _ArrayPermute: {
    documentation: 'Returns an array of the Permutations of all Elements in a 1D array',
    label: '_ArrayPermute ( ByRef $aArray [, $sDelimiter = ""] )',
    params: [
      {
        label: '$aArray',
        documentation: 'The Array to get Permutations',
      },
      {
        label: '$sDelimiter',
        documentation: '**[optional]** String result separator, default is "" for none',
      },
    ],
  },
  _ArrayPop: {
    documentation:
      'Returns the last element of an array, deleting that element from the array at the same time',
    label: '_ArrayPop ( ByRef $aArray )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
    ],
  },
  _ArrayPush: {
    documentation:
      'Add new values without increasing array size by inserting at the end the new value and deleting the first one or vice versa',
    label: '_ArrayPush ( ByRef $aArray, $vValue [, $iDirection = 0] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$vValue',
        documentation: 'Value(s) to add (can be in an array)',
      },
      {
        label: '$iDirection',
        documentation:
          '**[optional]** Direction to push existing array elements:  \n`0` = Slide left (adding at the end)  \n`1` = Slide right (adding at the start)',
      },
    ],
  },
  _ArrayReverse: {
    documentation:
      'Takes the given array and reverses the order in which the elements appear in a 1D array',
    label: '_ArrayReverse ( ByRef $aArray [, $iStart = 0 [, $iEnd = 0]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start modifying at',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to stop modifying at',
      },
    ],
  },
  _ArraySearch: {
    documentation:
      'Finds an entry within a 1D or 2D array. Similar to _ArrayBinarySearch(), except that the array does not need to be sorted',
    label:
      '_ArraySearch ( Const ByRef $aArray, $vValue [, $iStart = 0 [, $iEnd = 0 [, $iCase = 0 [, $iCompare = 0 [, $iForward = 1 [, $iSubItem = -1 [, $bRow = False]]]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'The array to search',
      },
      {
        label: '$vValue',
        documentation: 'What to search $aArray for',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start searching at',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to stop searching at',
      },
      {
        label: '$iCase',
        documentation: '**[optional]** If set to 1, search is case sensitive',
      },
      {
        label: '$iCompare',
        documentation:
          '**[optional]**  \n`0` Casting of variables to the same type (default), "string" = 0, "" = 0 or "0" = 0 match (If $iCase = 0)  \n`1` executes a partial search  \n`2` comparison match if variables have same type and same value  \n`3` compares using a regular expression pattern provided as `$vValue`',
      },
      {
        label: '$iForward',
        documentation:
          '**[optional]** If set to 0, searches the array from end to beginning (instead of beginning to end)',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Sub-index to search on in 2D arrays',
      },
      {
        label: '$bRow',
        documentation:
          '**[optional]** If `True` then `$iSubItem` sets the row to search - `False` (default) searches columns',
      },
    ],
  },
  _ArrayShuffle: {
    documentation:
      'Shuffles selected rows of 1D or 2D arrays - can be limited to a specific column in 2D arrays',
    label: '_ArrayShuffle ( ByRef $aArray [, $iStart_Row = 0 [, $iEnd_Row = 0 [, $iCol = -1]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iStart_Row',
        documentation: '**[optional]** Start row for shuffle - default first',
      },
      {
        label: '$iEnd_Row',
        documentation: '**[optional]** End row for shuffle - default last',
      },
      {
        label: '$iCol',
        documentation: '**[optional]** Specific column to shuffle (2D only)',
      },
    ],
  },
  _ArraySort: {
    documentation:
      'Sort a 1D or 2D array on a specific index using the dualpivotsort/quicksort/insertionsort algorithms',
    label:
      '_ArraySort ( ByRef $aArray [, $iDescending = 0 [, $iStart = 0 [, $iEnd = 0 [, $iSubItem = 0 [, $iPivot = 0]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to sort',
      },
      {
        label: '$iDescending',
        documentation: '**[optional]** If set to 1, sort in descending order',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** Index of array to start sorting (default 0 = first element or row)',
      },
      {
        label: '$iEnd',
        documentation:
          '**[optional]** Index of array to stop sorting (default 0 = last element or row)',
      },
      {
        label: '$iSubItem',
        documentation:
          '**[optional]** Sub-index to sort on in 2D arrays (default 0 = first column)',
      },
      {
        label: '$iPivot',
        documentation: '**[optional]** Use pivot sort algorithm (default = quicksort)',
      },
    ],
  },
  _ArraySwap: {
    documentation: 'Swaps elements of a 1D array and full or part rows/columns of a 2D array',
    label:
      '_ArraySwap ( ByRef $aArray, $iIndex_1, $iIndex_2 [, $bCol = False [, $iStart = -1 [, $iEnd = -1]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iIndex_1',
        documentation: 'Index of first element (1D) or row/column (2D) to swap',
      },
      {
        label: '$iIndex_2',
        documentation: 'Index of second element (1D) or row/column (2D) to swap',
      },
      {
        label: '$bCol',
        documentation:
          '**[optional]** If True then for 2D array above parameters refer to rows; if False (default) above parameters refer to columns',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index in row/column to start swap (2D array only)',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index in row/column to end swap (2D array only)',
      },
    ],
  },
  _ArrayToClip: {
    documentation:
      'Sends the contents of a 1D or 2D array to the clipboard, each element separated by a specified delimiter',
    label:
      '_ArrayToClip ( Const ByRef $aArray [, $sDelim_Col = "|" [, $iStart_Row = -1 [, $iEnd_Row = -1 [, $sDelim_Row = @CRLF [, $iStart_Col = -1 [, $iEnd_Col = -1]]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to copy to clipboard',
      },
      {
        label: '$sDelim_Col',
        documentation: '**[optional]** Delimiter for elements of 1D array or columns of 2D array',
      },
      {
        label: '$iStart_Row',
        documentation: '**[optional]** Index of array row to start copy',
      },
      {
        label: '$iEnd_Row',
        documentation: '**[optional]** Index of array row to stop copy',
      },
      {
        label: '$sDelim_Row',
        documentation: '**[optional]** Delimiter for rows of 2D array (2D only)',
      },
      {
        label: '$iStart_Col',
        documentation: '**[optional]** Index of array column to start copy (2D only)',
      },
      {
        label: '$iEnd_Col',
        documentation: '**[optional]** Index of array column to stop copy (2D only)',
      },
    ],
  },
  _ArrayToString: {
    documentation:
      'Places the elements of a 1D or 2D array into a single string, separated by the specified delimiters',
    label:
      '_ArrayToString ( Const ByRef $aArray [, $sDelim_Col = "|" [, $iStart_Row = -1 [, $iEnd_Row = -1 [, $sDelim_Row = @CRLF [, $iStart_Col = -1 [, $iEnd_Col = -1]]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to convert to a string',
      },
      {
        label: '$sDelim_Col',
        documentation: '**[optional]** Delimiter for elements of 1D array or columns of 2D array',
      },
      {
        label: '$iStart_Row',
        documentation: '**[optional]** Index of array row to start copy',
      },
      {
        label: '$iEnd_Row',
        documentation: '**[optional]** Index of array row to stop copy',
      },
      {
        label: '$sDelim_Row',
        documentation: '**[optional]** Delimiter for rows of 2D array (2D only)',
      },
      {
        label: '$iStart_Col',
        documentation: '**[optional]** Index of array column to start copy (2D only)',
      },
      {
        label: '$iEnd_Col',
        documentation: '**[optional]** Index of array column to stop copy (2D only)',
      },
    ],
  },
  _ArrayTranspose: {
    documentation: 'Transposes a 1D or 2D array (swaps rows and columns)',
    label: '_ArrayTranspose ( ByRef $aArray )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
    ],
  },
  _ArrayTrim: {
    documentation: 'Trims a certain number of characters from all elements in a 1D or 2D array',
    label:
      '_ArrayTrim ( ByRef $aArray, $iTrimNum [, $iDirection = 0 [, $iStart = 0 [, $iEnd = 0 [, $iSubItem = 0]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$iTrimNum',
        documentation: 'Number of characters to remove',
      },
      {
        label: '$iDirection',
        documentation: '**[optional]** Direction to trim:  \n`0` - trim left  \n`1` - trim right',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** Index of array to start trim',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** Index of array to stop trim',
      },
      {
        label: '$iSubItem',
        documentation: '**[optional]** Column to trim',
      },
    ],
  },
  _ArrayUnique: {
    documentation:
      'Returns the Elements from a column of a 1D or 2D array, removing all duplicates',
    label:
      '_ArrayUnique ( Const ByRef $aArray [, $iColumn = 0 [, $iBase = 0 [, $iCase = 0 [, $iCount = $ARRAYUNIQUE_COUNT [, $iIntType = $ARRAYUNIQUE_AUTO]]]]] )',
    params: [
      {
        label: '$aArray',
        documentation: 'The Array to use',
      },
      {
        label: '$iColumn',
        documentation: '**[optional]** 0-based column to be used - default 0. (2D only)',
      },
      {
        label: '$iBase',
        documentation: '**[optional]** The array is 0-based or 1-based. Default 0 : 0-based.',
      },
      {
        label: '$iCase',
        documentation:
          '**[optional]** Flag to indicate if the operations should be case sensitive. Default 0 : not case sensitive.',
      },
      {
        label: '$iCount',
        documentation:
          '**[optional]** Flag to determine if [0] element holds the count of returned items (default)',
      },
      {
        label: '$iIntType',
        documentation: '**[optional]** Flag to change function algorithm',
      },
    ],
  },
  _Array1DToHistogram: {
    documentation: `Transform a 1D array to Histogram ${include}`,
    label: '_Array1DToHistogram ( $aArray, [$iSizing] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to transform',
      },
      {
        label: '$iSizing',
        documentation: `${opt} Allows to zoom the histogram. \`Default = 100 percent\``,
      },
    ],
  },
  _ArrayAdd: {
    documentation: `Adds a specified value at the end of an existing 1D or 2D array ${include}`,
    label:
      '_ArrayAdd ( ByRef $aArray, $vValue, [$iStart], [$sDelim_Item], [$sDelim_Row], [$iForce] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to modify',
      },
      {
        label: '$vValue',
        documentation: 'Value(s) to add - can be a single item, a delimited string or an array',
      },
      {
        label: '$iStart',
        documentation: `${opt} Column in which addition is to begin (2D array only)${br}
                \`Default = 0\``,
      },
      {
        label: '$sDelim_Item',
        documentation: `${opt} Delimiter used if a string is to be split into items${br}
                \`Default = "|"\``,
      },
      {
        label: '$sDelim_Row',
        documentation: `${opt} Delimiter used if a string is to be split into rows (2D only)
                ${br}\`Default = @CRLF\``,
      },
      {
        label: '$iForce',
        documentation: `${opt} Maintains default behaviour,${br}
                \`$ARRAYFILL_FORCE_DEFAULT (0)\`${br}
                Forces \`$vValue\` addition as a single item,${br}
                \`$ARRAYFILL_FORCE_SINGLEITEM (1)\`${br}
                Or forces datatype for all added items${br}
                \`$ARRAYFILL_FORCE_INT (2)\`${br}
                \`$ARRAYFILL_FORCE_NUMBER (3)\`${br}
                \`$ARRAYFILL_FORCE_PTR (4)\`${br}
                \`$ARRAYFILL_FORCE_HWND (5)\`${br}
                \`$ARRAYFILL_FORCE_STRING (6)\`${br}
                \`$ARRAYFILL_FORCE_BOOLEAN (7)\``,
      },
    ],
  },
  _ArrayBinarySearch: {
    documentation: `Uses the binary search algorithm to search through a 1D or 2D array ${include}`,
    label: '_ArrayBinarySearch ( Const ByRef $aArray, $vValue, [$iStart], [$iEnd], [$iColumn] )',
    params: [
      {
        label: '$aArray',
        documentation: 'Array to search',
      },
      {
        label: '$vValue',
        documentation: 'Value to find',
      },
      {
        label: '$iStart',
        documentation: `${opt} Index of array to start searching at ${defaultZero}`,
      },
      {
        label: '$iEnd',
        documentation: `${opt} Index of array to stop searching at ${defaultZero}`,
      },
      {
        label: '$iColumn',
        documentation: `${opt} Column of array to search ${defaultZero}`,
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
