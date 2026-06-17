import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const xlAutoFilterOperator = 'XlAutoFilterOperator Enumeration Constant';
const constant = 'Constant Enumeration Constant';
const xlCalculation = 'XlCalculation Enumeration Constant';
const xlCellType = 'XlCellType Enumeration Constant';
const xlColumnDataType = 'XlColumnDataType Enumeration Constant';
const xlDeleteShiftDir = 'XlDeleteShiftDirection Enumeration Constant';
const xlDVAlertStyle = 'XlDVAlertStyle Enumeration Constant';
const xlDVType = 'XlDVType Enumeration Constant';
const xlDynamicFilterCriteria = 'XlDynamicFilterCriteria Enumeration Constant';
const xlFileFormat = 'XlFileFormat Enumeration Constant';
const xlFindLookIn = 'XlFindLookIn Enumeration Constant';
const xlFixedFormatQuality = 'XlFixedFormatQuality Enumeration Constant';
const xlFixedFormatType = 'XlFixedFormatType Enumeration Constant';
const xlFormatConditionOperator = 'XlFormatConditionOperator Enumeration Constant';
const xlInsertFormatOrigin = 'XlInsertFormatOrigin Enumeration Constant';
const xlInsertShiftDirection = 'XlInsertShiftDirection Enumeration Constant';
const xlLookAt = 'XlLookAt Enumeration Constant';
const xlPasteSpecialOperation = 'XlPasteSpecialOperation Enumeration Constant';
const xlPasteType = 'XlPasteType Enumeration Constant';
const xlPlatform = 'XlPlatform Enumeration Constant';
const xlReferenceStyle = 'XlReferenceStyle Enumeration Constant';
const xlReferenceType = 'XlReferenceType Enumeration Constant';
const xlSheetVisibility = 'xlSheetVisibility Enumeration Constant';
const xlSortDataOption = 'XlSortDataOption Enumeration Constant';
const xlSortOrder = 'XlSortOrder Enumeration Constant';
const xlSortOn = 'XlSortOn Enumeration Constant';
const xlSortOrientation = 'XlSortOrientation Enumeration Constant';
const xlTextParsingType = 'XlTextParsingType Enumeration Constant';
const xlTextQualifier = 'XlTextQualifier Enumeration Constant';
const xlYesNoGuess = 'XlYesNoGuess Enumeration Constant';

const items = [
  {
    label: '$xlAnd',
    documentation: 'Logical AND of Criteria1 and Criteria2\n\n`= 1`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlBottom10Items',
    documentation:
      'Lowest-valued items displayed (number of items specified in Criteria1)\n\n`= 4`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlBottom10Percent',
    documentation: 'Lowest-valued items displayed (percentage specified in Criteria1)\n\n`= 6`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlFilterCellColor',
    documentation: 'Color of the cell\n\n`= 8`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlFilterDynamic',
    documentation: 'Dynamic filter\n\n`= 11`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlFilterFontColor',
    documentation: 'Color of the font\n\n`= 9`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlFilterIcon',
    documentation: 'Filter icon\n\n`= 10`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlFilterValues',
    documentation: 'Filter values\n\n`= 7`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlOr',
    documentation: 'Logical OR of Criteria1 or Criteria2\n\n`= 2`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlTop10Items',
    documentation:
      'Highest-valued items displayed (number of items specified in Criteria1)\n\n`= 3`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlTop10Percent',
    documentation: 'Highest-valued items displayed (percentage specified in Criteria1)\n\n`= 5`',
    detail: xlAutoFilterOperator,
  },
  {
    label: '$xlCenter',
    documentation: 'Center\n\n`= -4108`',
    detail: constant,
  },
  {
    label: '$xlLeft',
    documentation: 'Left\n\n`= -4131`',
    detail: constant,
  },
  {
    label: '$xlRight',
    documentation: 'Right\n\n`= -4152`',
    detail: constant,
  },
  {
    label: '$xlCalculationAutomatic',
    documentation: 'Excel controls recalculation\n\n`= -4105`',
    detail: xlCalculation,
  },
  {
    label: '$xlCalculationManual',
    documentation: 'Calculation is done when the user requests it\n\n`= -4135`',
    detail: xlCalculation,
  },
  {
    label: '$xlCalculationSemiautomatic',
    documentation: 'Excel controls recalculation but ignores changes in tables\n\n`= 2`',
    detail: xlCalculation,
  },
  {
    label: '$xlCellTypeAllFormatConditions',
    documentation: 'Cells of any format\n\n`= -4172`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeAllValidation',
    documentation: 'Cells having validation criteria\n\n`= -4174`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeBlanks',
    documentation: 'Empty cells\n\n`= 4`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeComments',
    documentation: 'Cells containing notes\n\n`= -4144`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeConstants',
    documentation: 'Cells containing constants\n\n`= 2`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeFormulas',
    documentation: 'Cells containing formulas\n\n`= -4123`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeLastCell',
    documentation: 'The last cell in the used range\n\n`= 11`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeSameFormatConditions',
    documentation: 'Cells having the same format\n\n`= -4173`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeSameValidation',
    documentation: 'Cells having the same validation criteria\n\n`= -4175`',
    detail: xlCellType,
  },
  {
    label: '$xlCellTypeVisible',
    documentation: 'All visible cells\n\n`= 12`',
    detail: xlCellType,
  },
  {
    label: '$xlDMYFormat',
    documentation: 'DMY date format\n\n`= 4`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlDYMFormat',
    documentation: 'DYM date format\n\n`= 7`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlEMDFormat',
    documentation: 'EMD date format\n\n`= 10`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlGeneralFormat',
    documentation: 'General\n\n`= 1`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlMDYFormat',
    documentation: 'MDY date format\n\n`= 3`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlMYDFormat',
    documentation: 'MYD date format\n\n`= 6`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlSkipColumn',
    documentation: 'Column is not parsed\n\n`= 9`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlTextFormat',
    documentation: 'Text\n\n`= 2`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlYDMFormat',
    documentation: 'YDM date format\n\n`= 8`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlYMDFormat',
    documentation: 'YMD date format\n\n`= 5`',
    detail: xlColumnDataType,
  },
  {
    label: '$xlShiftToLeft',
    documentation: 'Cells are shifted to the left\n\n`= -4159`',
    detail: xlDeleteShiftDir,
  },
  {
    label: '$xlShiftUp',
    documentation: 'Cells are shifted up\n\n`= -4162`',
    detail: xlDeleteShiftDir,
  },
  {
    label: '$xlValidAlertInformation',
    documentation: 'Information icon\n\n`= 3`',
    detail: xlDVAlertStyle,
  },
  {
    label: '$xlValidAlertStop',
    documentation: 'Stop icon\n\n`= 1`',
    detail: xlDVAlertStyle,
  },
  {
    label: '$xlValidAlertWarning',
    documentation: 'Warning icon\n\n`= 2`',
    detail: xlDVAlertStyle,
  },
  {
    label: '$xlValidateCustom',
    documentation: 'Data is validated using an arbitrary formula\n\n`= 7`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateDate',
    documentation: 'Date values\n\n`= 4`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateDecimal',
    documentation: 'Numeric values\n\n`= 2`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateInputOnly',
    documentation: 'Validate only when user changes the value\n\n`= 0`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateList',
    documentation: 'Value must be present in a specified list\n\n`= 3`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateTextLength',
    documentation: 'Length of text\n\n`= 6`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateTime',
    documentation: 'Time values\n\n`= 5`',
    detail: xlDVType,
  },
  {
    label: '$xlValidateWholeNumber',
    documentation: 'Whole numeric values\n\n`= 1`',
    detail: xlDVType,
  },
  {
    label: '$xlFilterAboveAverage',
    documentation: 'Filter all above-average values\n\n`= 33`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodApril',
    documentation: 'Filter all dates in April\n\n`= 24`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodAugust',
    documentation: 'Filter all dates in August\n\n`= 28`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodDecember',
    documentation: 'Filter all dates in December\n\n`= 32`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodFebruray',
    documentation: 'Filter all dates in February\n\n`= 22`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodJanuary',
    documentation: 'Filter all dates in January\n\n`= 21`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodJuly',
    documentation: 'Filter all dates in July\n\n`= 27`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodJune',
    documentation: 'Filter all dates in June\n\n`= 26`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodMarch',
    documentation: 'Filter all dates in March\n\n`= 23`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodMay',
    documentation: 'Filter all dates in May\n\n`= 25`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodNovember',
    documentation: 'Filter all dates in November\n\n`= 31`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodOctober',
    documentation: 'Filter all dates in October\n\n`= 30`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodQuarter1',
    documentation: 'Filter all dates in Quarter1\n\n`= 17`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodQuarter2',
    documentation: 'Filter all dates in Quarter2\n\n`= 18`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodQuarter3',
    documentation: 'Filter all dates in Quarter3\n\n`= 19`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodQuarter4',
    documentation: 'Filter all dates in Quarter4\n\n`= 20`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterAllDatesInPeriodSeptember',
    documentation: 'Filter all dates in September\n\n`= 29`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterBelowAverage',
    documentation: 'Filter all below-average values\n\n`= 34`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterLastMonth',
    documentation: 'Filter all values related to last month\n\n`= 8`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterLastQuarter',
    documentation: 'Filter all values related to last quarter\n\n`= 11`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterLastWeek',
    documentation: 'Filter all values related to last week\n\n`= 5`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterLastYear',
    documentation: 'Filter all values related to last year\n\n`= 14`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterNextMonth',
    documentation: 'Filter all values related to next month\n\n`= 9`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterNextQuarter',
    documentation: 'Filter all values related to next quarter\n\n`= 12`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterNextWeek',
    documentation: 'Filter all values related to next week\n\n`= 6`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterNextYear',
    documentation: 'Filter all values related to next year\n\n`= 15`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterThisMonth',
    documentation: 'Filter all values related to the current month\n\n`= 7`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterThisQuarter',
    documentation: 'Filter all values related to the current quarter\n\n`= 10`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterThisWeek',
    documentation: 'Filter all values related to the current week\n\n`= 4`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterThisYear',
    documentation: 'Filter all values related to the current year\n\n`= 13`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterToday',
    documentation: 'Filter all values related to the current date\n\n`= 1`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterTomorrow',
    documentation: 'Filter all values related to tomorrow\n\n`= 3`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterYearToDate',
    documentation: 'Filter all values from today until a year ago\n\n`= 16`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlFilterYesterday',
    documentation: 'Filter all values related to yesterday\n\n`= 2`',
    detail: xlDynamicFilterCriteria,
  },
  {
    label: '$xlAddIn',
    documentation: 'Microsoft Excel 97-2003 Add-In\n\n`= 18`',
    detail: xlFileFormat,
  },
  {
    label: '$xlAddIn8',
    documentation: 'Microsoft Excel 97-2003 Add-In\n\n`= 18`',
    detail: xlFileFormat,
  },
  {
    label: '$xlCSV',
    documentation: 'CSV\n\n`= 6`',
    detail: xlFileFormat,
  },
  {
    label: '$xlCSVMac',
    documentation: 'Macintosh CSV\n\n`= 22`',
    detail: xlFileFormat,
  },
  {
    label: '$xlCSVMSDOS',
    documentation: 'MSDOS CSV\n\n`= 24`',
    detail: xlFileFormat,
  },
  {
    label: '$xlCSVWindows',
    documentation: 'Windows CSV\n\n`= 23`',
    detail: xlFileFormat,
  },
  {
    label: '$xlCurrentPlatformText',
    documentation: 'Current Platform Text\n\n`= -4158`',
    detail: xlFileFormat,
  },
  {
    label: '$xlDBF2',
    documentation: 'DBF2\n\n`= 7`',
    detail: xlFileFormat,
  },
  {
    label: '$xlDBF3',
    documentation: 'DBF3\n\n`= 8`',
    detail: xlFileFormat,
  },
  {
    label: '$xlDBF4',
    documentation: 'DBF4\n\n`= 11`',
    detail: xlFileFormat,
  },
  {
    label: '$xlDIF',
    documentation: 'DIF\n\n`= 9`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel12',
    documentation:
      'Excel12 (Excel Binary Workbook in 2007 with or without macros, .xlsb)\n\n`= 50`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel2',
    documentation: 'Excel2\n\n`= 16`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel2FarEast',
    documentation: 'Excel2 FarEast\n\n`= 27`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel3',
    documentation: 'Excel3\n\n`= 29`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel4',
    documentation: 'Excel4\n\n`= 33`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel4Workbook',
    documentation: 'Excel4 Workbook\n\n`= 35`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel5',
    documentation: 'Excel5\n\n`= 39`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel7',
    documentation: 'Excel7\n\n`= 39`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel8',
    documentation: 'Excel8 (97-2003 format in Excel 2007, .xls)\n\n`= 56`',
    detail: xlFileFormat,
  },
  {
    label: '$xlExcel9795',
    documentation: 'Excel9795\n\n`= 43`',
    detail: xlFileFormat,
  },
  {
    label: '$xlHtml',
    documentation: 'HTML format\n\n`= 44`',
    detail: xlFileFormat,
  },
  {
    label: '$xlIntlAddIn',
    documentation: 'International Add-In\n\n`= 26`',
    detail: xlFileFormat,
  },
  {
    label: '$xlIntlMacro',
    documentation: 'International Macro\n\n`= 25`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenDocumentSpreadsheet',
    documentation: 'OpenDocument Spreadsheet\n\n`= 60`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenXMLAddIn',
    documentation: 'Open XML Add-In\n\n`= 55`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenXMLTemplate',
    documentation: 'Open XML Template\n\n`= 54`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenXMLTemplateMacroEnabled',
    documentation: 'Open XML Template Macro Enabled\n\n`= 53`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenXMLWorkbook',
    documentation: 'Open XML Workbook (without macros in 2007, .xlsx)\n\n`= 51`',
    detail: xlFileFormat,
  },
  {
    label: '$xlOpenXMLWorkbookMacroEnabled',
    documentation:
      'Open XML Workbook Macro Enabled (with or without macros in 2007, .xlsm)\n\n`= 52`',
    detail: xlFileFormat,
  },
  {
    label: '$xlSYLK',
    documentation: 'SYLK\n\n`= 2`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTemplate',
    documentation: 'Template\n\n`= 17`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTemplate8',
    documentation: 'Template 8\n\n`= 17`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTextMac',
    documentation: ' Macintosh Text\n\n`= 19`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTextMSDOS',
    documentation: 'MSDOS Text\n\n`= 21`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTextPrinter',
    documentation: 'Printer Text\n\n`= 36`',
    detail: xlFileFormat,
  },
  {
    label: '$xlTextWindows',
    documentation: 'Windows Text\n\n`= 20`',
    detail: xlFileFormat,
  },
  {
    label: '$xlUnicodeText',
    documentation: 'Unicode Text\n\n`= 42`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWebArchive',
    documentation: 'Web Archive\n\n`= 45`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWJ2WD1',
    documentation: 'WJ2WD1\n\n`= 14`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWJ3',
    documentation: 'WJ3\n\n`= 40`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWJ3FJ3',
    documentation: 'WJ3FJ3\n\n`= 41`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK1',
    documentation: 'WK1\n\n`= 5`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK1ALL',
    documentation: 'WK1ALL\n\n`= 31`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK1FMT',
    documentation: 'WK1FMT\n\n`= 30`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK3',
    documentation: 'WK3\n\n`= 15`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK3FM3',
    documentation: 'WK3FM3\n\n`= 32`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWK4',
    documentation: 'WK4\n\n`= 38`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWKS',
    documentation: 'Worksheet\n\n`= 4`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWorkbookDefault',
    documentation: 'Workbook default (.xls for < Excel 2007, .xlsx for > Excel 2007)\n\n`= 51`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWorkbookNormal',
    documentation: 'Workbook normal\n\n`= -4143`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWorks2FarEast',
    documentation: 'Works2 FarEast\n\n`= 28`',
    detail: xlFileFormat,
  },
  {
    label: '$xlWQ1',
    documentation: 'WQ1\n\n`= 34`',
    detail: xlFileFormat,
  },
  {
    label: '$xlXMLSpreadsheet',
    documentation: 'XML Spreadsheet\n\n`= 46`',
    detail: xlFileFormat,
  },
  {
    label: '$xlComments',
    documentation: 'Comments\n\n`= -4144`',
    detail: xlFindLookIn,
  },
  {
    label: '$xlFormulas',
    documentation: 'Formulas\n\n`= -4123`',
    detail: xlFindLookIn,
  },
  {
    label: '$xlValues',
    documentation: 'Values\n\n`= -4163`',
    detail: xlFindLookIn,
  },
  {
    label: '$xlQualityMinimum',
    documentation: 'Minimum quality\n\n`= 1`',
    detail: xlFixedFormatQuality,
  },
  {
    label: '$xlQualityStandard',
    documentation: 'Standard quality\n\n`= 0`',
    detail: xlFixedFormatQuality,
  },
  {
    label: '$xlTypePDF',
    documentation: '"PDF" - Portable Document Format file (.pdf)\n\n`= 0`',
    detail: xlFixedFormatType,
  },
  {
    label: '$xlTypeXPS',
    documentation: '"XPS" - XPS Document (.xps)\n\n`= 1`',
    detail: xlFixedFormatType,
  },
  {
    label: '$xlBetween',
    documentation: 'Between. Can be used only if two formulas are provided\n\n`= 1`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlEqual',
    documentation: 'Equal\n\n`= 3`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlGreater',
    documentation: 'Greater than\n\n`= 5`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlGreaterEqual',
    documentation: 'Greater than or equal to\n\n`= 7`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlLess',
    documentation: 'Less than\n\n`= 6`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlLessEqual',
    documentation: 'Less than or equal to\n\n`= 8`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlNotBetween',
    documentation: 'Not between. Can be used only if two formulas are provided\n\n`= 2`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlNotEqual',
    documentation: 'Not equal\n\n`= 4`',
    detail: xlFormatConditionOperator,
  },
  {
    label: '$xlFormatFromLeftOrAbove',
    documentation: 'Copy the format from cells above and/or to the left\n\n`= 0`',
    detail: xlInsertFormatOrigin,
  },
  {
    label: '$xlFormatFromRightOrBelow',
    documentation: 'Copy the format from cells below and/or to the right\n\n`= 1`',
    detail: xlInsertFormatOrigin,
  },
  {
    label: '$xlShiftDown',
    documentation: 'Shift cells down\n\n`= -4121`',
    detail: xlInsertShiftDirection,
  },
  {
    label: '$xlShiftToRight',
    documentation: 'Shift cells to the right\n\n`= -4161`',
    detail: xlInsertShiftDirection,
  },
  {
    label: '$xlPart',
    documentation: 'Match against any part of the search text\n\n`= 2`',
    detail: xlLookAt,
  },
  {
    label: '$xlWhole',
    documentation: 'Match against the whole of the search text\n\n`= 1`',
    detail: xlLookAt,
  },
  {
    label: '$xlPasteSpecialOperationAdd',
    documentation: 'Copied data will be added with the value in the destination cell\n\n`= 2`',
    detail: xlPasteSpecialOperation,
  },
  {
    label: '$xlPasteSpecialOperationDivide',
    documentation: 'Copied data will be divided with the value in the destination cell\n\n`= 5`',
    detail: xlPasteSpecialOperation,
  },
  {
    label: '$xlPasteSpecialOperationMultiply',
    documentation: 'Copied data will be multiplied with the value in the destination cell\n\n`= 4`',
    detail: xlPasteSpecialOperation,
  },
  {
    label: '$xlPasteSpecialOperationNone',
    documentation: 'No calculation will be done in the paste operation\n\n`= -4142`',
    detail: xlPasteSpecialOperation,
  },
  {
    label: '$xlPasteSpecialOperationSubtract',
    documentation: 'Copied data will be subtracted with the value in the destination cell\n\n`= 3`',
    detail: xlPasteSpecialOperation,
  },
  {
    label: '$xlPasteAll',
    documentation: 'Everything will be pasted\n\n`= -4104`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteAllExceptBorders',
    documentation: 'Everything except borders will be pasted\n\n`= 7`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteAllMergingConditionalFormats',
    documentation: 'Everything will be pasted and conditional formats will be merged\n\n`= 14`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteAllUsingSourceTheme',
    documentation: 'Everything will be pasted using the source theme\n\n`= 13`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteColumnWidths',
    documentation: 'Copied column width is pasted\n\n`= 8`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteComments',
    documentation: 'Comments are pasted\n\n`= -4144`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteFormats',
    documentation: 'Copied source format is pasted\n\n`= -4122`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteFormulas',
    documentation: 'Formulas are pasted\n\n`= -4123`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteFormulasAndNumberFormats',
    documentation: 'Formulas and Number formats are pasted\n\n`= 11`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteValidation',
    documentation: 'Validations are pasted\n\n`= 6`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteValues',
    documentation: 'Values are pasted\n\n`= -4163`',
    detail: xlPasteType,
  },
  {
    label: '$xlPasteValuesAndNumberFormats',
    documentation: 'Values and Number formats are pasted\n\n`= 12`',
    detail: xlPasteType,
  },
  {
    label: '$xlMacintosh',
    documentation: 'Macintosh\n\n`= 1`',
    detail: xlPlatform,
  },
  {
    label: '$xlMSDOS',
    documentation: 'MS-DOS\n\n`= 3`',
    detail: xlPlatform,
  },
  {
    label: '$xlWindows',
    documentation: 'Microsoft Windows\n\n`= 2`',
    detail: xlPlatform,
  },
  {
    label: '$xlA1',
    documentation: 'Default. Use xlA1 to return an A1-style reference\n\n`= 1`',
    detail: xlReferenceStyle,
  },
  {
    label: '$xlR1C1',
    documentation: 'Use xlR1C1 to return an R1C1-style reference\n\n`= -4150`',
    detail: xlReferenceStyle,
  },
  {
    label: '$xlAbsolute',
    documentation: 'Convert to absolute row and column style\n\n`= 1`',
    detail: xlReferenceType,
  },
  {
    label: '$xlAbsRowRelColumn',
    documentation: 'Convert to absolute row and relative column style\n\n`= 2`',
    detail: xlReferenceType,
  },
  {
    label: '$xlRelative',
    documentation: 'Convert to relative row and column style\n\n`= 4`',
    detail: xlReferenceType,
  },
  {
    label: '$xlRelRowAbsColumn',
    documentation: 'Convert to relative row and absolute column style\n\n`= 3`',
    detail: xlReferenceType,
  },
  {
    label: '$xlSheetHidden',
    documentation: 'Hides the worksheet which the user can unhide via menu\n\n`= 0`',
    detail: xlSheetVisibility,
  },
  {
    label: '$xlSheetVeryHidden',
    documentation:
      'Hides the object so that the only way for you to make it visible again is by setting this property to True (the user cannot make the object visible)\n\n`= 2`',
    detail: xlSheetVisibility,
  },
  {
    label: '$xlSheetVisible',
    documentation: 'Displays the sheet\n\n`= -1`',
    detail: xlSheetVisibility,
  },
  {
    label: '$xlSortNormal',
    documentation: 'Sorts numeric and text data separately\n\n`= 0`',
    detail: xlSortDataOption,
  },
  {
    label: '$xlSortTextAsNumbers',
    documentation: 'Treat text as numeric data for the sort\n\n`= 1`',
    detail: xlSortDataOption,
  },
  {
    label: '$xlAscending',
    documentation: 'Sorts the specified field in ascending order\n\n`= 1`',
    detail: xlSortOrder,
  },
  {
    label: '$xlDescending',
    documentation: 'Sorts the specified field in descending order\n\n`= 2`',
    detail: xlSortOrder,
  },
  {
    label: '$xlSortOnCellColor',
    documentation: 'Cell color\n\n`= 1`',
    detail: xlSortOn,
  },
  {
    label: '$xlSortOnFontColor',
    documentation: 'Font color\n\n`= 2`',
    detail: xlSortOn,
  },
  {
    label: '$xlSortOnIcon',
    documentation: 'Icon\n\n`= 3`',
    detail: xlSortOn,
  },
  {
    label: '$xlSortOnValues',
    documentation: 'Values\n\n`= 0`',
    detail: xlSortOn,
  },
  {
    label: '$xlSortColumns',
    documentation: 'Sorts by column\n\n`= 1`',
    detail: xlSortOrientation,
  },
  {
    label: '$xlSortRows',
    documentation: 'Sorts by row. This is the default value\n\n`= 2`',
    detail: xlSortOrientation,
  },
  {
    label: '$xlDelimited',
    documentation: 'Default. Indicates that the file is delimited by delimiter characters\n\n`= 1`',
    detail: xlTextParsingType,
  },
  {
    label: '$xlFixedWidth',
    documentation:
      'Indicates that the data in the file is arranged in columns of fixed widths\n\n`= 2`',
    detail: xlTextParsingType,
  },
  {
    label: '$xlTextQualifierDoubleQuote',
    documentation: 'Double quotation mark (")\n\n`= 1`',
    detail: xlTextQualifier,
  },
  {
    label: '$xlTextQualifierNone',
    documentation: 'No delimiter\n\n`= -4142`',
    detail: xlTextQualifier,
  },
  {
    label: '$xlTextQualifierSingleQuote',
    documentation: "Single quotation mark (')\n\n`= 2`",
    detail: xlTextQualifier,
  },
  {
    label: '$xlGuess',
    documentation:
      'Excel determines whether there is a header, and where it is, if there is one\n\n`= 0`',
    detail: xlYesNoGuess,
  },
  {
    label: '$xlNo',
    documentation: 'Default. The entire range should be sorted\n\n`= 2`',
    detail: xlYesNoGuess,
  },
  {
    label: '$xlYes',
    documentation: 'The entire range should not be sorted\n\n`= 1`',
    detail: xlYesNoGuess,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'ExcelConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
