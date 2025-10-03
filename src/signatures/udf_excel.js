import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Excel.au3>`)';

const signatures = {
  _Excel_BookAttach: {
    documentation:
      'Attaches to the first instance of a workbook where the search string matches based on the selected mode',
    label: '_Excel_BookAttach ( $sString [, $sMode = "FilePath" [, $oInstance = Default]] )',
    params: [
      {
        label: '$sString',
        documentation: 'String to search for',
      },
      {
        label: '$sMode',
        documentation:
          '**[optional]** specifies search mode:    \nFileName - Name of the open workbook    \nFilePath - Full path to the open workbook (default)    \nTitle - Title of the Excel window',
      },
      {
        label: '$oInstance',
        documentation:
          '**[optional]** Object of the Excel instance to be searched (default = keyword Default = all instances)',
      },
    ],
  },
  _Excel_BookClose: {
    documentation: 'Closes the specified workbook',
    label: '_Excel_BookClose ( $oWorkbook [, $bSave = True] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Workbook object',
      },
      {
        label: '$bSave',
        documentation:
          '**[optional]** If True the workbook will be saved before closing (default = True)',
      },
    ],
  },
  _Excel_BookList: {
    documentation: 'Returns a list of workbooks of a specified or all Excel instances',
    label: '_Excel_BookList ( [$oExcel = Default] )',
    params: [
      {
        label: '$oExcel',
        documentation:
          '**[optional]** An Excel application object (default = keyword Default = process all Excel instances)',
      },
    ],
  },
  _Excel_BookNew: {
    documentation: 'Creates a new workbook',
    label: '_Excel_BookNew ( $oExcel [, $iSheets = Default] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object where you want to create the new workbook',
      },
      {
        label: '$iSheets',
        documentation:
          '**[optional]** Number of sheets to create in the new workbook (default = keyword Default = Excel default value). Maximum is 255',
      },
    ],
  },
  _Excel_BookOpen: {
    documentation: 'Opens an existing workbook',
    label:
      '_Excel_BookOpen ( $oExcel, $sFilePath [, $bReadOnly = False [, $bVisible = True [, $sPassword = Default [, $sWritePassword = Default [, $bUpdateLinks = Default]]]]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object where you want to open the workbook',
      },
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be opened',
      },
      {
        label: '$bReadOnly',
        documentation: '**[optional]** True opens the workbook as read-only (default = False)',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** True specifies that the workbook window will be visible (default = True)',
      },
      {
        label: '$sPassword',
        documentation:
          '**[optional]** The password that was used to read-protect the workbook, if any (default is none)',
      },
      {
        label: '$sWritePassword',
        documentation:
          '**[optional]** The password that was used to write-protect the workbook, if any (default is none)',
      },
      {
        label: '$bUpdateLinks',
        documentation:
          "**[optional]** Specifies the way external references (links) in the file are updated (default = keyword Default) Valid values are:  \nDefault: Excel prompts the user to decide how to update links.  \n0: Excel doesn't update links.  \n3: Excel updates all links.",
      },
    ],
  },
  _Excel_BookOpenText: {
    documentation: 'Opens a text file and parses the content to a new workbook with a single sheet',
    label:
      '_Excel_BookOpenText ( $oExcel, $sFilePath [, $iStartRow = 1 [, $iDataType = Default [, $sTextQualifier = $xlTextQualifierDoubleQuote [, $bConsecutiveDelimiter = False [, $sDelimiter = "," [, $aFieldInfo = "" [, $sDecimalSeparator = Default [, $sThousandsSeparator = Default [, $bTrailingMinusNumbers = True [, $iOrigin = Default]]]]]]]]]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object where you want to open the new workbook',
      },
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be opened',
      },
      {
        label: '$iStartRow',
        documentation: '**[optional]** The row at which to start parsing the file (default = 1)',
      },
      {
        label: '$iDataType',
        documentation:
          '**[optional]** Specifies the column format of the data in the file. Can be any of the XlTextParsingType enumeration.  \nIf set to keyword Default Excel attempts to determine the column format (default = keyword Default)',
      },
      {
        label: '$sTextQualifier',
        documentation:
          '**[optional]** Specifies the text qualifier (default = $xlTextQualifierDoubleQuote)',
      },
      {
        label: '$bConsecutiveDelimiter',
        documentation:
          '**[optional]** True will consider consecutive delimiters as one delimiter (default = False)',
      },
      {
        label: '$sDelimiter',
        documentation:
          '**[optional]** One or multiple characters to be used as delimiter (default = ",")',
      },
      {
        label: '$aFieldInfo',
        documentation:
          '**[optional]** An array containing parse information for individual columns of data.  \nThe interpretation depends on the value of DataType.  \nWhen the data is delimited, this argument is an array of two-element arrays, with each two-element array specifying the conversion options for a particular column.  \nThe first element is the column number (1-based), and the second element is one of the XlColumnDataType constants specifying how the column is parsed (default = keyword Default)',
      },
      {
        label: '$sDecimalSeparator',
        documentation:
          '**[optional]** Decimal separator that Excel uses when recognizing numbers.  \nDefault setting is the system setting (default = keyword Default)',
      },
      {
        label: '$sThousandsSeparator',
        documentation:
          '**[optional]** Thousands separator that Excel uses when recognizing numbers.  \nDefault setting is the system setting (default = keyword Default)',
      },
      {
        label: '$bTrailingMinusNumbers',
        documentation:
          '**[optional]** True treats numbers with a minus character at the end as negative numbers.  \nFalse treats such numbers as text (default = True)',
      },
      {
        label: '$iOrigin',
        documentation:
          '**[optional]** Origin of the text file. Can be one of the XlPlatform constants.  \nAdditionally, this could be an integer representing the code page number of the desired code page.  \nFor example, "1256" would specify that the encoding is Arabic (Windows).  \nIf this argument is omitted, the method uses the current setting of the File Origin option in the Text Import Wizard.',
      },
    ],
  },
  _Excel_BookSave: {
    documentation: 'Saves the specified workbook',
    label: '_Excel_BookSave ( $oWorkbook )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Object of the workbook to save',
      },
    ],
  },
  _Excel_BookSaveAs: {
    documentation: 'Saves the specified workbook with a new filename and/or type',
    label:
      '_Excel_BookSaveAs ( $oWorkbook, $sFilePath [, $iFormat = $xlWorkbookDefault [, $bOverWrite = False [, $sPassword = Default [, $sWritePassword = Default [, $bReadOnlyRecommended = False]]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Workbook object to be saved',
      },
      {
        label: '$sFilePath',
        documentation: 'Path and filename of the file to be read',
      },
      {
        label: '$iFormat',
        documentation:
          '**[optional]** Excel writeable filetype. Can be any value of the XlFileFormat enumeration.',
      },
      {
        label: '$bOverWrite',
        documentation: '**[optional]** True overwrites an already existing file (default = False)',
      },
      {
        label: '$sPassword',
        documentation:
          '**[optional]** The string password to protect the sheet with. If set to keyword Default no password will be used (default = keyword Default)',
      },
      {
        label: '$sWritePassword',
        documentation:
          '**[optional]** The string write-access password to protect the sheet with. If set to keyword Default no password will be used (default = keyword Default)',
      },
      {
        label: '$bReadOnlyRecommended',
        documentation:
          '**[optional]** True displays a message when the file is opened, recommending that the file be opened as read-only (default = False)',
      },
    ],
  },
  _Excel_Close: {
    documentation: 'Closes all worksheets and the instance of the Excel application',
    label: '_Excel_Close ( $oExcel [, $bSaveChanges = True [, $bForceClose = False]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object as returned by `_Excel_Open()`',
      },
      {
        label: '$bSaveChanges',
        documentation:
          '**[optional]** Specifies whether changed worksheets should be saved before closing (default = True)',
      },
      {
        label: '$bForceClose',
        documentation:
          '**[optional]** If True the Excel application is closed even when it was not started by `_Excel_Open()` (default = False)',
      },
    ],
  },
  _Excel_ColumnToLetter: {
    documentation: 'Converts the column number to letter(s)',
    label: '_Excel_ColumnToLetter ( $iColumn )',
    params: [
      {
        label: '$iColumn',
        documentation: 'The column number which you want to turn into letter(s)',
      },
    ],
  },
  _Excel_ColumnToNumber: {
    documentation: 'Converts the column letter(s) to a number',
    label: '_Excel_ColumnToNumber ( $sColumn )',
    params: [
      {
        label: '$sColumn',
        documentation:
          'The column letter(s) which you want to turn into a number (e.g. "ZZ" to 702)',
      },
    ],
  },
  _Excel_ConvertFormula: {
    documentation:
      'Converts cell references in a formula between A1 and R1C1 reference styles, relative and absolute reference type, or both',
    label:
      '_Excel_ConvertFormula ( $oExcel, $sFormula, $iFromStyle [, $iToStyle = Default [, $iToAbsolute = Default [, $vRelativeTo = Default]]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object',
      },
      {
        label: '$sFormula',
        documentation: 'String containing the formula to convert',
      },
      {
        label: '$iFromStyle',
        documentation:
          'The reference style of the formula. Can be any of the XlReferenceStyle enumeration',
      },
      {
        label: '$iToStyle',
        documentation:
          "**[optional]** A XlReferenceStyle enumeration specifying the reference style to be returned. If omitted, the reference style isn't changed",
      },
      {
        label: '$iToAbsolute',
        documentation:
          "**[optional]** A XlReferenceType which specifies the converted reference type. If this argument is omitted, the reference type isn't changed",
      },
      {
        label: '$vRelativeTo',
        documentation:
          '**[optional]** A Range object or a A1 range that contains one cell. Relative references relate to this cell. If omitted A1 is used',
      },
    ],
  },
  _Excel_Export: {
    documentation: 'Exports a workbook, worksheet, chart or range as PDF or XPS',
    label:
      '_Excel_Export ( $oExcel, $vObject, $sFileName [, $iType = $xlTypePDF [, $iQuality = $xlQualityStandard [, $bIncludeProperties = True [, $iFrom = Default [, $iTo = Default [, $bOpenAfterPublish = Default]]]]]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object',
      },
      {
        label: '$vObject',
        documentation:
          'Workbook, worksheet, chart or range object to export as PDF or XPS. Range can be specified as A1 range too',
      },
      {
        label: '$sFileName',
        documentation: 'Path/name of the exported file',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** Can be either $xlTypePDF or $xlTypeXPS of the XlFixedFormatType enumeration (default = $xlTypePDF)',
      },
      {
        label: '$iQuality',
        documentation:
          '**[optional]** Can be any of the XlFixedFormatQuality enumeration (default = $xlQualityStandard)',
      },
      {
        label: '$bIncludeProperties',
        documentation:
          '**[optional]** True indicates that document properties should be included (default = True)',
      },
      {
        label: '$iFrom',
        documentation:
          '**[optional]** The page number at which to start publishing (default = keyword Default = start at the beginning)',
      },
      {
        label: '$iTo',
        documentation:
          '**[optional]** The page number at which to end publishing (default = keyword Default = end at the last page)',
      },
      {
        label: '$bOpenAfterPublish',
        documentation:
          '**[optional]** True displays the file in viewer after it is published (default = False)',
      },
    ],
  },
  _Excel_FilterGet: {
    documentation: 'Returns a list of set filters',
    label: '_Excel_FilterGet ( $oWorkbook [, $vWorksheet = Default] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          '**[optional]** Name, index or worksheet object to be filtered. If set to keyword Default the active sheet will be filtered',
      },
    ],
  },
  _Excel_FilterSet: {
    documentation: 'Sets/unsets filter definitions and filters the range',
    label:
      '_Excel_FilterSet ( $oWorkbook, $vWorksheet, $vRange, $iField [, $sCriteria1 = Default [, $iOperator = Default [, $sCriteria2 = Default]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be filtered. If set to keyword Default the active sheet will be filtered',
      },
      {
        label: '$vRange',
        documentation:
          'A range object or an A1 range to specify the columns to filter on.  \nUse keyword Default to filter on all used columns of the specified worksheet',
      },
      {
        label: '$iField',
        documentation:
          'Integer offset of the field on which you want to base the filter (the leftmost field is field one).  \nIf set to 0 all Autofilters on the worksheet will be removed',
      },
      {
        label: '$sCriteria1',
        documentation:
          '**[optional]** The criteria (a string or an array of strings). Use "=" to find blank fields, or use "<>" to find nonblank fields.  \nIf this argument is omitted, the criteria is All.  \nIf Operator is xlTop10Items, Criteria1 specifies the number of items (for example, "10")',
      },
      {
        label: '$iOperator',
        documentation:
          '**[optional]** One of the constants of the XlAutoFilterOperator enumeration specifying the type of filter',
      },
      {
        label: '$sCriteria2',
        documentation:
          '**[optional]** The second criteria (a string). Used with Criteria1 and Operator to construct compound criteria',
      },
    ],
  },
  _Excel_Open: {
    documentation: 'Connects to an existing Excel instance or creates a new one',
    label:
      '_Excel_Open ( [$bVisible = True [, $bDisplayAlerts = False [, $bScreenUpdating = True [, $bInteractive = True [, $bForceNew = False]]]]] )',
    params: [
      {
        label: '$bVisible',
        documentation:
          '**[optional]** True specifies that the application will be visible (default = True)',
      },
      {
        label: '$bDisplayAlerts',
        documentation:
          '**[optional]** False suppresses all prompts and alert messages while opening a workbook (default = False)',
      },
      {
        label: '$bScreenUpdating',
        documentation:
          '**[optional]** False suppresses screen updating to speed up your script (default = True)',
      },
      {
        label: '$bInteractive',
        documentation:
          '**[optional]** If False, Excel blocks all keyboard and mouse input by the user (except input to dialog boxes) (default = True)',
      },
      {
        label: '$bForceNew',
        documentation:
          '**[optional]** True forces to create a new Excel instance even if there is already a running instance (default = False)',
      },
    ],
  },
  _Excel_PictureAdd: {
    documentation: 'Adds a picture on the specified workbook and worksheet',
    label:
      '_Excel_PictureAdd ( $oWorkbook, $vWorksheet, $sFile, $vRangeOrLeft [, $iTop = Default [, $iWidth = Default [, $iHeight = Default [, $bKeepRatio = True]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be written to. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$sFile',
        documentation: 'Full path to picture file being added',
      },
      {
        label: '$vRangeOrLeft',
        documentation:
          'Either an A1 range, a range object or an integer denoting the left position of the pictures upper left corner',
      },
      {
        label: '$iTop',
        documentation:
          '**[optional]** If `$vRangeOrLeft` is an integer then `$iTop` is the top position of the pictures upper left corner.',
      },
      {
        label: '$iWidth',
        documentation:
          '**[optional]** If specified, sets the width of the picture. If not specified, width will adjust automatically (default = Automatic)',
      },
      {
        label: '$iHeight',
        documentation:
          '**[optional]** If specified, sets the height of the picture. If not specified, height will adjust automatically (default = Automatic)',
      },
      {
        label: '$bKeepRatio',
        documentation:
          '**[optional]** Only used if `$vRangeOrLeft` is a multi-cell range (default = True)    \nTrue will maintain image aspect ratio while staying within the bounds of `$vRangeOrLeft`.    \nFalse will fill the `$vRangeOrLeft` regardless of original aspect ratio.',
      },
    ],
  },
  _Excel_Print: {
    documentation: 'Prints a workbook, worksheet, chart or range',
    label:
      '_Excel_Print ( $oExcel, $vObject [, $iCopies = Default [, $sPrinter = Default [, $bPreview = Default [, $iFrom = Default [, $iTo = Default [, $bPrintToFile = Default [, $bCollate = Default [, $sPrToFileName = ""]]]]]]]] )',
    params: [
      {
        label: '$oExcel',
        documentation: 'Excel application object',
      },
      {
        label: '$vObject',
        documentation:
          'Workbook, worksheet, chart or range object to print. Range can be specified as A1 range too',
      },
      {
        label: '$iCopies',
        documentation: '**[optional]** Number of copies to print (default = keyword Default = 1)',
      },
      {
        label: '$sPrinter',
        documentation:
          '**[optional]** Name of the printer to be used. Defaults to active printer (default = keyword Default)',
      },
      {
        label: '$bPreview',
        documentation:
          '**[optional]** True to invoke print preview before printing (default = keyword Default = False)',
      },
      {
        label: '$iFrom',
        documentation:
          '**[optional]** Page number where to start printing (default = keyword Default = first page)',
      },
      {
        label: '$iTo',
        documentation:
          '**[optional]** Page number where to stop printing (default = keyword Default = last page)',
      },
      {
        label: '$bPrintToFile',
        documentation:
          '**[optional]** True to print to a file. See parameter `$sPrToFileName` (default = keyword Default = False)',
      },
      {
        label: '$bCollate',
        documentation:
          '**[optional]** True to collate multiple copies (default = keyword Default = False)',
      },
      {
        label: '$sPrToFileName',
        documentation:
          '**[optional]** If `$bPrintToFile` is set to True, this argument specifies the name of the file you want to print to.',
      },
    ],
  },
  _Excel_RangeCopyPaste: {
    documentation:
      'Cuts or copies one or multiple cells, rows or columns to a range or from/to the clipboard',
    label:
      '_Excel_RangeCopyPaste ( $oWorksheet, $vSourceRange [, $vTargetRange = Default [, $bCut = False [, $iPaste = Default [, $iOperation = Default [, $bSkipBlanks = False [, $bTranspose = False]]]]]] )',
    params: [
      {
        label: '$oWorksheet',
        documentation: 'Object of the source worksheet',
      },
      {
        label: '$vSourceRange',
        documentation:
          'Source range to copy/cut from. Can be a range object or an A1 range.  \nIf set to keyword Default then the range will be copied from the clipboard.',
      },
      {
        label: '$vTargetRange',
        documentation:
          '**[optional]** Target range to copy/cut to. Can be a range object or an A1 range.  \nIf set to keyword Default then the range will be copied to the clipboard (default = keyword Default)',
      },
      {
        label: '$bCut',
        documentation:
          "**[optional]** If set to True the source range isn't copied but cut out (default = False)  \nThis parameter is ignored when `$vSourceRange` is set to keyword Default.",
      },
      {
        label: '$iPaste',
        documentation:
          '**[optional]** The part of the range to be pasted from the clipboard (formulas, formats ...). Must be a value of the XlPasteType enumeration  \n(default = keyword Default)',
      },
      {
        label: '$iOperation',
        documentation:
          '**[optional]** The paste operation (add, divide, multiply ...). Must be a value of the XlPasteSpecialOperation enunmeration  \n(default = keyword Default)',
      },
      {
        label: '$bSkipBlanks',
        documentation:
          '**[optional]** If set to True blank cells from the clipboard will not be pasted into the target range (default = False)',
      },
      {
        label: '$bTranspose',
        documentation:
          '**[optional]** Set to True to transpose rows and columns when the range is pasted (default = False)',
      },
    ],
  },
  _Excel_RangeDelete: {
    documentation: 'Deletes one or multiple cells, rows or columns from the specified worksheet',
    label:
      '_Excel_RangeDelete ( $oWorksheet, $vRange [, $iShift = Default [, $iEntireRowCol = Default]] )',
    params: [
      {
        label: '$oWorksheet',
        documentation: 'Excel worksheet object',
      },
      {
        label: '$vRange',
        documentation:
          'Range can be a range object, an A1 range (e.g. "A1:B2", "1:2" (row 1 to 2), "D:G" (columns D to G) etc.',
      },
      {
        label: '$iShift',
        documentation:
          '**[optional]** Specifies which way to shift the cells. Can be xlShiftToLeft or xlShiftUp of the XlDeleteShiftDirection enumeration.  \nIf set to keyword Default, Excel decides based on the shape of the range (default = keyword Default)',
      },
      {
        label: '$iEntireRowCol',
        documentation:
          '**[optional]** If set to 1 the entire row is deleted, if set to 2 the entire column is deleted (default = keyword Default = only delete specified range)',
      },
    ],
  },
  _Excel_RangeFind: {
    documentation:
      'Finds matching cells in a range or workbook and returns an array with information about the found cells',
    label:
      '_Excel_RangeFind ( $oWorkbook, $sSearch [, $vRange = Default [, $iLookIn = $xlValues [, $iLookAt = $xlPart [, $bMatchcase = False]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Workbook object',
      },
      {
        label: '$sSearch',
        documentation:
          'Search string. Can be a string (wildcards - *?~ - can be used) or any Excel data type. See Remarks',
      },
      {
        label: '$vRange',
        documentation:
          '**[optional]** A range object, an A1 range (string) or keyword Default to search all sheets of the workbook (default = keyword Default)',
      },
      {
        label: '$iLookIn',
        documentation:
          '**[optional]** Specifies where to search. Can be any of the XLFindLookIn enumeration (default = $xlValues)',
      },
      {
        label: '$iLookAt',
        documentation:
          '**[optional]** Specifies whether the search text must match as a whole or any part. Can be any of the XLLookAt enumeration (default = $xlPart)',
      },
      {
        label: '$bMatchcase',
        documentation:
          '**[optional]** True = case sensitive, False = case insensitive (default = False)',
      },
    ],
  },
  _Excel_RangeInsert: {
    documentation:
      'Inserts one or multiple empty cells, rows or columns into the specified worksheet',
    label:
      '_Excel_RangeInsert ( $oWorksheet, $vRange [, $iShift = Default [, $iCopyOrigin = Default]] )',
    params: [
      {
        label: '$oWorksheet',
        documentation: 'Excel worksheet object',
      },
      {
        label: '$vRange',
        documentation:
          'Range can be a range object, an A1 range (e.g. "A1:B2", "1:2" (row 1 to 2), ""D:G" (columns D to G) etc.',
      },
      {
        label: '$iShift',
        documentation:
          '**[optional]** Specifies which way to shift the cells. Can be xlShiftToRight or xlShiftDown of the XlInsertShiftDirection enumeration.  \nIf set to keyword Default, Excel decides based on the shape of the range (default = keyword Default)',
      },
      {
        label: '$iCopyOrigin',
        documentation:
          '**[optional]** Specifies which formatting option to copy. Can be any of the XlInsertFormatOrigin enumeration (default = keyword Default)',
      },
    ],
  },
  _Excel_RangeLinkAddRemove: {
    documentation: 'Adds or removes a hyperlink to/from a specified range',
    label:
      '_Excel_RangeLinkAddRemove ( $oWorkbook, $vWorksheet, $vRange, $sAddress [, $sSubAddress = Default [, $sScreenTip = Default [, $sTextToDisplay = Default]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be used. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$vRange',
        documentation: 'Either a range object or an A1 range to be set to a hyperlink',
      },
      {
        label: '$sAddress',
        documentation:
          'The address for the specified link. The address can be an E-mail address, an Internet address or a file name. "" removes an existing hyperlink',
      },
      {
        label: '$sSubAddress',
        documentation:
          '**[optional]** The name of a location within the destination file, such as a bookmark, named range or slide number (default = keyword Default = None)',
      },
      {
        label: '$sScreenTip',
        documentation:
          '**[optional]** The text that appears as a ScreenTip when the mouse pointer is positioned over the specified hyperlink (default = keyword Default = Uses value of `$sAddress`)',
      },
      {
        label: '$sTextToDisplay',
        documentation:
          '**[optional]** The text to be displayed for the hyperlink (default = keyword Default = None)',
      },
    ],
  },
  _Excel_RangeRead: {
    documentation:
      'Reads the value, formula or displayed text from a cell or range of cells of the specified workbook and worksheet',
    label:
      '_Excel_RangeRead ( $oWorkbook [, $vWorksheet = Default [, $vRange = Default [, $iReturn = 1 [, $bForceFunc = False]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          '**[optional]** Name, index or worksheet object to be read. If set to keyword Default the active sheet will be used (default = keyword Default)',
      },
      {
        label: '$vRange',
        documentation:
          '**[optional]** Either a range object or an A1 range. If set to Default all used cells will be processed (default = keyword Default)',
      },
      {
        label: '$iReturn',
        documentation:
          '**[optional]** What to return from the specified cell:    \n1 - Value (default)    \n2 - Formula    \n3 - The displayed text    \n4 - Value2. The only difference between Value and Value2 is that the Value2 property doesn’t use the Currency and Date data types',
      },
      {
        label: '$bForceFunc',
        documentation:
          '**[optional]** True forces to use the `_ArrayTranspose` function instead of the Excel transpose method (default = False).',
      },
    ],
  },
  _Excel_RangeReplace: {
    documentation: 'Finds and replaces matching strings in a range or worksheet',
    label:
      '_Excel_RangeReplace ( $oWorkbook, $vWorksheet, $vRange, $sSearch, $sReplace [, $iLookAt = $xlPart [, $bMatchcase = False]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be searched. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$vRange',
        documentation:
          'A range object, an A1 range or keyword Default to search all cells in the specified worksheet',
      },
      {
        label: '$sSearch',
        documentation: 'Search string',
      },
      {
        label: '$sReplace',
        documentation: 'Replace string',
      },
      {
        label: '$iLookAt',
        documentation:
          '**[optional]** Specifies whether the search text must match as a whole or any part. Can be any of the XLLookAt enumeration (default = $xlPart)',
      },
      {
        label: '$bMatchcase',
        documentation:
          '**[optional]** True = case sensitive, False = case insensitive (default = False)',
      },
    ],
  },
  _Excel_RangeSort: {
    documentation: 'Sorts a cell range',
    label:
      '_Excel_RangeSort ( $oWorkbook, $vWorksheet, $vRange, $vKey1 [, $iOrder1 = $xlAscending [, $iSortText = $xlSortNormal [, $iHeader = $xlNo [, $bMatchcase = False [, $iOrientation = $xlSortRows [, $vKey2 = Default [, $iOrder2 = Default [, $vKey3 = Default [, $iOrder3 = Default]]]]]]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be sorted. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$vRange',
        documentation:
          'A range object, an A1 range or keyword Default to sort the whole worksheet (default = keyword Default)',
      },
      {
        label: '$vKey1',
        documentation: 'Specifies the first sort field, either as an A1 range or range object',
      },
      {
        label: '$iOrder1',
        documentation:
          '**[optional]** Determines the sort order. Can be any of the XlSortOrder enumeration (default = $xlAscending)',
      },
      {
        label: '$iSortText',
        documentation:
          '**[optional]** Specifies how to sort text in $vKey1, $vKey2 and $vKey3. Can be any of the XlSortDataOption enumeration (default = $xlSortNormal)',
      },
      {
        label: '$iHeader',
        documentation:
          '**[optional]** Specifies whether the first row contains header information. Can be any of the XlYesNoGuess enumeration (default = $xlNo)',
      },
      {
        label: '$bMatchCase',
        documentation:
          '**[optional]** True to perform a case-sensitive sort, False to perform non-case sensitive sort (default = False)',
      },
      {
        label: '$iOrientation',
        documentation:
          '**[optional]** Specifies the sort orientation. Can be any of the XlSortOrientation enumeration (default = $xlSortColumns)',
      },
      {
        label: '$vKey2',
        documentation: '**[optional]** See $vKey1',
      },
      {
        label: '$iOrder2',
        documentation: '**[optional]** See $iOrder1',
      },
      {
        label: '$vKey3',
        documentation: '**[optional]** See $vKey1',
      },
      {
        label: '$iOrder3',
        documentation: '**[optional]** See $iOrder1',
      },
    ],
  },
  _Excel_RangeValidate: {
    documentation: 'Adds data validation to the specified range',
    label:
      '_Excel_RangeValidate ( $oWorkbook, $vWorksheet, $vRange, $iType, $sFormula1 [, $iOperator = Default [, $sFormula2 = Default [, $bIgnoreBlank = True [, $iAlertStyle = $xlValidAlertStop [, $sErrorMessage = Default [, $sInputMessage = Default]]]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$vRange',
        documentation:
          'A range object, an A1 range or keyword Default to validate all cells in the specified worksheet',
      },
      {
        label: '$iType',
        documentation: 'The validation type. Can be any of the XlDVType enumeration',
      },
      {
        label: '$sFormula1',
        documentation: 'The first part of the data validation equation',
      },
      {
        label: '$iOperator',
        documentation:
          '**[optional]** The data validation operator. Can be any of the XlFormatConditionOperator enumeration (default = keyword Default)',
      },
      {
        label: '$sFormula2',
        documentation:
          '**[optional]** The second part of the data validation when $iOperator is $xlBetween or $xlNotBetween. Otherwise it is ignored (default = keyword Default)',
      },
      {
        label: '$bIgnoreBlank',
        documentation:
          '**[optional]** If set to True, cell data is considered valid if the cell is blank (default = True)',
      },
      {
        label: '$iAlertStyle',
        documentation:
          '**[optional]** The validation alert style. Can be any of the XlDVAlertStyle enumeration (default = $xlValidAlertStop)',
      },
      {
        label: '$sErrorMessage',
        documentation:
          '**[optional]** Message to be displayed in a MsgBox when invalid data has been entered (default = keyword Default)',
      },
      {
        label: '$sInputMessage',
        documentation:
          '**[optional]** Message to be displayed in a Tooltip when you begin to enter data (default = keyword Default)',
      },
    ],
  },
  _Excel_RangeWrite: {
    documentation:
      'Writes value(s) or formula(s) to a cell or a cell range on the specified workbook and worksheet',
    label:
      '_Excel_RangeWrite ( $oWorkbook, $vWorksheet, $vValue [, $vRange = "A1" [, $bValue = True [, $bForceFunc = False]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'Excel workbook object',
      },
      {
        label: '$vWorksheet',
        documentation:
          'Name, index or worksheet object to be written to. If set to keyword Default the active sheet will be used',
      },
      {
        label: '$vValue',
        documentation:
          'Can be a string, a 1D or 2D zero based array containing the data to be written to the worksheet',
      },
      {
        label: '$vRange',
        documentation: '**[optional]** Either an A1 range or a range object (default = "A1")',
      },
      {
        label: '$bValue',
        documentation:
          '**[optional]** If True the $vValue will be written to the value property. If False $vValue will be written to the formula property (default = True)',
      },
      {
        label: '$bForceFunc',
        documentation:
          '**[optional]** True forces to use the `_ArrayTranspose` function instead of the Excel transpose method (default = False).',
      },
    ],
  },
  _Excel_SheetAdd: {
    documentation: 'Adds new sheet(s) to a workbook and sets their names',
    label:
      '_Excel_SheetAdd ( $oWorkbook [, $vSheet = Default [, $bBefore = True [, $iCount = 1 [, $sName = ""]]]] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'A workbook object',
      },
      {
        label: '$vSheet',
        documentation:
          '**[optional]** Object, index or name of the sheet before/after which the new sheet is inserted.    -1 = insert before/after the last worksheet (default = keyword Default = active worksheet)',
      },
      {
        label: '$bBefore',
        documentation:
          '**[optional]** The new sheet will be inserted before $vSheet if True, after $vSheet if False (default = True)',
      },
      {
        label: '$iCount',
        documentation:
          '**[optional]** Number of worksheets to be inserted (default = 1). Maximum is 255',
      },
      {
        label: '$sName',
        documentation:
          '**[optional]** Name(s) of the sheet(s) to create (default = "" = follows standard Excel new sheet convention).    When $iCount > 1 multiple names can be provided separated by | (pipe character). Sheets are named from left to right',
      },
    ],
  },
  _Excel_SheetCopyMove: {
    documentation:
      'Copies or moves the specified sheet before or after a specified sheet in the same or a different workbook',
    label:
      '_Excel_SheetCopyMove ( $oSourceBook [, $vSourceSheet = Default [, $oTargetBook = $oSourceBook [, $vTargetSheet = 1 [, $bBefore = True [, $bCopy = True]]]]] )',
    params: [
      {
        label: '$oSourceBook',
        documentation: 'Object of the source workbook where the sheet should be copied/moved from',
      },
      {
        label: '$vSourceSheet',
        documentation:
          '**[optional]** Name, index or object of the sheet to copy/move (default = keyword Default = active sheet)',
      },
      {
        label: '$oTargetBook',
        documentation:
          '**[optional]** Object of the target workbook where the sheet should be copied/moved to (default = keyword Default = $oSourceBook)',
      },
      {
        label: '$vTargetSheet',
        documentation:
          '**[optional]** The copied/moved sheet will be placed before or after this sheet (name, index or object) (default = keyword Default = first sheet)',
      },
      {
        label: '$bBefore',
        documentation:
          '**[optional]** The copied/moved sheet will be placed before $vTargetSheet if True, after it if False (default = True)',
      },
      {
        label: '$bCopy',
        documentation:
          '**[optional]** Copy the specified sheet if True, move the sheet if False (default = True)',
      },
    ],
  },
  _Excel_SheetDelete: {
    documentation: 'Deletes the specified sheet by object, string name or by number',
    label: '_Excel_SheetDelete ( $oWorkbook [, $vSheet = Default] )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'A workbook object',
      },
      {
        label: '$vSheet',
        documentation:
          '**[optional]** The sheet to delete, either by object, string name or number (default = keyword Default = active Worksheet)',
      },
    ],
  },
  _Excel_SheetList: {
    documentation: 'Returns a list of all sheets in the specified workbook',
    label: '_Excel_SheetList ( $oWorkbook )',
    params: [
      {
        label: '$oWorkbook',
        documentation: 'A workbook object',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
