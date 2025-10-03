import { CompletionItemKind } from 'vscode';
import { descriptionHeader, fillCompletions, setDetail } from '../util';

let items = [];

let WdBreakType = [
  {
    label: '$WdColumnBreak',
    documentation: `${descriptionHeader}|Column break at the insertion point.|8`,
  },
  {
    label: '$WdLineBreak',
    documentation: `${descriptionHeader}|Line break.|6`,
  },
  {
    label: '$WdLineBreakClearLeft',
    documentation: `${descriptionHeader}|Line break.|9`,
  },
  {
    label: '$WdLineBreakClearRight',
    documentation: `${descriptionHeader}|Line break.|10`,
  },
  {
    label: '$WdPageBreak',
    documentation: `${descriptionHeader}|Page break at the insertion point.|7`,
  },
  {
    label: '$WdSectionBreakContinuous',
    documentation: `${descriptionHeader}|New section without a corresponding page break.|3`,
  },
  {
    label: '$WdSectionBreakEvenPage',
    documentation: `${descriptionHeader}|Section break with the next section beginning on the next even-numbered page. If the section break falls on an even-numbered page, Word leaves the next odd-numbered page blank.|4`,
  },
  {
    label: '$WdSectionBreakNextPage',
    documentation: `${descriptionHeader}|Section break on next page.|2`,
  },
  {
    label: '$WdSectionBreakOddPage',
    documentation: `${descriptionHeader}|Section break with the next section beginning on the next odd-numbered page. If the section break falls on an odd-numbered page, Word leaves the next even-numbered page blank.|5`,
  },
  {
    label: '$WdTextWrappingBreak',
    documentation: `${descriptionHeader}|Ends the current line and forces the text to continue below a picture, table, or other item. The text continues on the next blank line that does not contain a table aligned with the left or right margin.|11`,
  },
];
WdBreakType = setDetail(WdBreakType, 'WdBreakType Enumeration', 'Specifies type of break.');

let MsoDocProperties = [
  {
    label: '$msoPropertyTypeBoolean',
    documentation: `${descriptionHeader}|Boolean value.|2`,
  },
  {
    label: '$msoPropertyTypeDate',
    documentation: `${descriptionHeader}|Date value.|3`,
  },
  {
    label: '$msoPropertyTypeFloat',
    documentation: `${descriptionHeader}|Floating point value.|5`,
  },
  {
    label: '$msoPropertyTypeNumber',
    documentation: `${descriptionHeader}|Integer value.|1`,
  },
  {
    label: '$msoPropertyTypeString',
    documentation: `${descriptionHeader}|String value.|4`,
  },
];
MsoDocProperties = setDetail(
  MsoDocProperties,
  'MsoDocProperties Enumeration',
  'Specifies the data type for a document property.',
);

let WdCollapseDirection = [
  {
    label: '$WdCollapseEnd',
    documentation: `${descriptionHeader}|Collapse the range to the ending point.|0`,
  },
  {
    label: '$WdCollapseStart',
    documentation: `${descriptionHeader}|Collapse the range to the starting point.|1`,
  },
];
WdCollapseDirection = setDetail(
  WdCollapseDirection,
  'WdCollapseDirection Enumeration',
  'Specifies the direction in which to collapse a range or selection.',
);

let WdExportFormat = [
  {
    label: '$WdExportFormatPDF',
    documentation: `${descriptionHeader}|Export document into PDF format.|17`,
  },
  {
    label: '$WdExportFormatXPS',
    documentation: `${descriptionHeader}|Export document into XML Paper Specification (XPS) format.|18`,
  },
];
WdExportFormat = setDetail(
  WdExportFormat,
  'WdExportFormat Enumeration',
  'Specifies format to use for exporting a document.',
);

let WdExportRange = [
  {
    label: '$WdExportAllDocument',
    documentation: `${descriptionHeader}|Exports the entire document.|0`,
  },
  {
    label: '$WdExportCurrentPage',
    documentation: `${descriptionHeader}|Exports the current page.|2`,
  },
  {
    label: '$WdExportFromTo',
    documentation: `${descriptionHeader}|Exports the contents of a range using the starting and ending positions.|3`,
  },
  {
    label: '$WdExportSelection',
    documentation: `${descriptionHeader}|Exports the contents of the current selection.|1`,
  },
];
WdExportRange = setDetail(
  WdExportRange,
  'WdExportRange Enumeration',
  'Specifies how much of the document to export.',
);

let WdFindWrap = [
  {
    label: '$WdFindAsk',
    documentation: `${descriptionHeader} |After searching the selection or range, Microsoft Word displays a message asking whether to search the remainder of the document|2`,
  },
  {
    label: '$WdFindContinue',
    documentation: `${descriptionHeader}|The find operation continues if the beginning or end of the search range is reached|1`,
  },
  {
    label: '$WdFindStop',
    documentation: `${descriptionHeader}|The find operation ends if the beginning or end of the search range is reached |0 |`,
  },
];
WdFindWrap = setDetail(
  WdFindWrap,
  'WdFindWrap Enumeration',
  "Specifies wrap behavior if a selection or range is specified for a find operation and the search text isn't found in the selection or range.",
);

let WdNewDocumentType = [
  {
    label: '$WdNewBlankDocument',
    documentation: `${descriptionHeader}|Blank document.|0`,
  },
  {
    label: '$WdNewEmailMessage',
    documentation: `${descriptionHeader}|E-mail message.|2`,
  },
  {
    label: '$WdNewFrameset',
    documentation: `${descriptionHeader}|Frameset.|3`,
  },
  {
    label: '$WdNewWebPage',
    documentation: `${descriptionHeader}|Web page.|1`,
  },
  {
    label: '$WdNewXMLDocument',
    documentation: `${descriptionHeader}|XML document.|4`,
  },
];
WdNewDocumentType = setDetail(
  WdNewDocumentType,
  'WdNewDocumentType Enumeration',
  'Specifies the type of new document to create.',
);

let WdOpenFormat = [
  {
    label: '$WdOpenFormatAllWord',
    documentation: `${descriptionHeader}|A Microsoft Office Word format that is backward compatible with earlier versions of Word.|6`,
  },
  {
    label: '$WdOpenFormatAuto',
    documentation: `${descriptionHeader}|The existing format.|0`,
  },
  {
    label: '$WdOpenFormatDocument',
    documentation: `${descriptionHeader}|Word format.|1`,
  },
  {
    label: '$WdOpenFormatEncodedText',
    documentation: `${descriptionHeader}|Encoded text format.|5`,
  },
  {
    label: '$WdOpenFormatRTF',
    documentation: `${descriptionHeader}|Rich text format (RTF).|3`,
  },
  {
    label: '$WdOpenFormatTemplate',
    documentation: `${descriptionHeader}|As a Word template.|2`,
  },
  {
    label: '$WdOpenFormatText',
    documentation: `${descriptionHeader}|Unencoded text format.|4`,
  },
  {
    label: '$WdOpenFormatUnicodeText',
    documentation: `${descriptionHeader}|Unicode text format.|5`,
  },
  {
    label: '$WdOpenFormatWebPages',
    documentation: `${descriptionHeader}|HTML format.|7`,
  },
  {
    label: '$WdOpenFormatXML',
    documentation: `${descriptionHeader}|XML format.|8`,
  },
  {
    label: '$WdOpenFormatAllWordTemplates',
    documentation: `${descriptionHeader}|Word template format.|13`,
  },
  {
    label: '$WdOpenFormatDocument97',
    documentation: `${descriptionHeader}|Microsoft Word 97 document format.|1`,
  },
  {
    label: '$WdOpenFormatTemplate97',
    documentation: `${descriptionHeader}|Word 97 template format.|1`,
  },
  {
    label: '$WdOpenFormatXMLDocument',
    documentation: `${descriptionHeader}|XML document format.|9`,
  },
  {
    label: '$WdOpenFormatXMLDocumentMacroEnabled',
    documentation: `${descriptionHeader}|XML document format with macros enabled.|10`,
  },
  {
    label: '$WdOpenFormatXMLTemplate',
    documentation: `${descriptionHeader}|XML template format.|11`,
  },
  {
    label: '$WdOpenFormatXMLTemplateMacroEnabled',
    documentation: `${descriptionHeader}|XML template format with macros enabled.|12`,
  },
];
WdOpenFormat = setDetail(
  WdOpenFormat,
  'WdOpenFormat Enumeration',
  'Specifies the format to use when opening a document.',
);

let WdOrientation = [
  {
    label: '$WdOrientLandscape',
    documentation: `${descriptionHeader}|Landscape orientation|1`,
  },
  {
    label: '$WdOrientPortrait',
    documentation: `${descriptionHeader}|Portrait orientation.|0`,
  },
];
WdOrientation = setDetail(
  WdOrientation,
  'WdOrientation Enumeration',
  'Specifies a page layout orientation.',
);

let WdOriginalFormat = [
  {
    label: '$WdOriginalDocumentFormat',
    documentation: `${descriptionHeader}|Original document format.|1`,
  },
  {
    label: '$WdPromptUser',
    documentation: `${descriptionHeader}|Prompt user to select a document format.|2`,
  },
  {
    label: '$WdWordDocument',
    documentation: `${descriptionHeader}|Microsoft Word document format.|0`,
  },
];
WdOriginalFormat = setDetail(
  WdOriginalFormat,
  'WdOriginalFormat Enumeration',
  'Specifies the document format. This enumeration is commonly used when saving a document.',
);

let WdPrintOutItem = [
  {
    label: '$WdPrintAutoTextEntries',
    documentation: `${descriptionHeader}|Autotext entries in the current document.|4 `,
  },
  {
    label: '$WdPrintComments',
    documentation: `${descriptionHeader}|Comments in the current document.|2 `,
  },
  {
    label: '$WdPrintDocumentContent',
    documentation: `${descriptionHeader}|Current document content.|0 `,
  },
  {
    label: '$WdPrintDocumentWithMarkup',
    documentation: `${descriptionHeader}|Current document content including markup.|7 `,
  },
  { label: '$WdPrintEnvelope', documentation: `${descriptionHeader}|An envelope.|6 ` },
  {
    label: '$WdPrintKeyAssignments',
    documentation: `${descriptionHeader}|Key assignments in the current document.|5 `,
  },
  {
    label: '$WdPrintMarkup',
    documentation: `${descriptionHeader}|Markup in the current document.|2 `,
  },
  {
    label: '$WdPrintProperties',
    documentation: `${descriptionHeader}|Properties in the current document.|1 `,
  },
  {
    label: '$WdPrintStyles',
    documentation: `${descriptionHeader}|Styles in the current document.|3 `,
  },
];
WdPrintOutItem = setDetail(
  WdPrintOutItem,
  'WdPrintOutItem Enumeration',
  'Specifies the item to print.',
);

let WdPrintOutPages = [
  { label: '$WdPrintAllPages', documentation: `${descriptionHeader}|All pages.|0` },
  {
    label: '$WdPrintEvenPagesOnly',
    documentation: `${descriptionHeader}|Even-numbered pages only.|2`,
  },
  {
    label: '$WdPrintOddPagesOnly',
    documentation: `${descriptionHeader}|Odd-numbered pages only.|1`,
  },
];
WdPrintOutPages = setDetail(
  WdPrintOutPages,
  'WdPrintOutPages Enumeration',
  'Specifies the type of pages to print.',
);

let WdPrintOutRange = [
  { label: '$WdPrintAllDocument', documentation: `${descriptionHeader}|The entire document.|0` },
  { label: '$WdPrintCurrentPage', documentation: `${descriptionHeader}|The current page.|2` },
  { label: '$WdPrintFromTo', documentation: `${descriptionHeader}|A specified range.|3` },
  {
    label: '$WdPrintRangeOfPages',
    documentation: `${descriptionHeader}|A specified range of pages.|4`,
  },
  { label: '$WdPrintSelection', documentation: `${descriptionHeader}|The current selection.|1` },
];
WdPrintOutRange = setDetail(
  WdPrintOutRange,
  'WdPrintOutRange Enumeration',
  'Specifies a range to print.',
);

let WdSaveFormat = [
  {
    label: '$WdFormatDocument',
    documentation: `${descriptionHeader}|Microsoft Office Word format.|0`,
  },
  { label: '$WdFormatDOSText', documentation: `${descriptionHeader}|Microsoft DOS text format.|4` },
  {
    label: '$WdFormatDOSTextLineBreaks',
    documentation: `${descriptionHeader}|Microsoft DOS text with line breaks preserved.|5`,
  },
  { label: '$WdFormatEncodedText', documentation: `${descriptionHeader}|Encoded text format.|7` },
  {
    label: '$WdFormatFilteredHTML',
    documentation: `${descriptionHeader}|Filtered HTML format.|10`,
  },
  { label: '$WdFormatHTML', documentation: `${descriptionHeader}|Standard HTML format.|8` },
  { label: '$WdFormatRTF', documentation: `${descriptionHeader}|Rich text format (RTF).|6` },
  { label: '$WdFormatTemplate', documentation: `${descriptionHeader}|Word template format.|1` },
  {
    label: '$WdFormatText',
    documentation: `${descriptionHeader}|Microsoft Windows text format.|2`,
  },
  {
    label: '$WdFormatTextLineBreaks',
    documentation: `${descriptionHeader}|Windows text format with line breaks preserved.|3`,
  },
  { label: '$WdFormatUnicodeText', documentation: `${descriptionHeader}|Unicode text format.|7` },
  { label: '$WdFormatWebArchive', documentation: `${descriptionHeader}|Web archive format.|9` },
  {
    label: '$WdFormatXML',
    documentation: `${descriptionHeader}|Extensible Markup Language (XML) format.|11`,
  },
  {
    label: '$WdFormatDocument97',
    documentation: `${descriptionHeader}|Microsoft Word 97 document format.|0`,
  },
  {
    label: '$WdFormatDocumentDefault',
    documentation: `${descriptionHeader}|Word default document file format. For Microsoft Office Word 2007, this is the DOCX format.|16`,
  },
  { label: '$WdFormatPDF', documentation: `${descriptionHeader}|PDF format.|17` },
  {
    label: '$WdFormatTemplate97',
    documentation: `${descriptionHeader}|Word 97 template format.|1`,
  },
  { label: '$WdFormatXMLDocument', documentation: `${descriptionHeader}|XML document format.|12` },
  {
    label: '$WdFormatXMLDocumentMacroEnabled',
    documentation: `${descriptionHeader}|XML document format with macros enabled.|13`,
  },
  { label: '$WdFormatXMLTemplate', documentation: `${descriptionHeader}|XML template format.|14` },
  {
    label: '$WdFormatXMLTemplateMacroEnabled',
    documentation: `${descriptionHeader}|XML template format with macros enabled.|15`,
  },
  { label: '$WdFormatXPS', documentation: `${descriptionHeader}|XPS format.|18` },
];
WdSaveFormat = setDetail(
  WdSaveFormat,
  'WdSaveFormat Enumeration',
  'Specifies the format to use when saving a document.',
);

let WdSaveOptions = [
  {
    label: '$WdDoNotSaveChanges',
    documentation: `${descriptionHeader}|Do not save pending changes.|0`,
  },
  {
    label: '$WdPromptToSaveChanges',
    documentation: `${descriptionHeader}|Prompt the user to save pending changes.|-2`,
  },
  {
    label: '$WdSaveChanges',
    documentation: `${descriptionHeader}|Save pending changes automatically without prompting the user.|-1`,
  },
];
WdSaveOptions = setDetail(
  WdSaveOptions,
  'WdSaveOptions Enumeration',
  'Specifies how pending changes should be handled.',
);

let WdUnits = [
  { label: '$WdCell', documentation: `${descriptionHeader}|A cell.|12` },
  { label: '$WdCharacter', documentation: `${descriptionHeader}|A character.|1` },
  {
    label: '$WdCharacterFormatting',
    documentation: `${descriptionHeader}|Character formatting.|13`,
  },
  { label: '$WdColumn', documentation: `${descriptionHeader}|A column.|9` },
  { label: '$WdItem', documentation: `${descriptionHeader}|The selected item.|16` },
  { label: '$WdLine', documentation: `${descriptionHeader}|A line.|5` },
  { label: '$WdParagraph', documentation: `${descriptionHeader}|A paragraph.|4` },
  {
    label: '$WdParagraphFormatting',
    documentation: `${descriptionHeader}|Paragraph formatting.|14`,
  },
  { label: '$WdRow', documentation: `${descriptionHeader}|A row.|10` },
  { label: '$WdScreen', documentation: `${descriptionHeader}|The screen dimensions.|7` },
  { label: '$WdSection', documentation: `${descriptionHeader}|A section.|8` },
  { label: '$WdSentence', documentation: `${descriptionHeader}|A sentence.|3` },
  { label: '$WdStory', documentation: `${descriptionHeader}|A story.|6` },
  { label: '$WdTable', documentation: `${descriptionHeader}|A table.|15` },
  { label: '$WdWindow', documentation: `${descriptionHeader}|A window.|11` },
  { label: '$WdWord', documentation: `${descriptionHeader}|A word.|2` },
];
WdUnits = setDetail(WdUnits, 'WdUnits Enumeration', 'Specifies a unit of measure to use.');

items = items.concat(
  WdExportRange,
  WdFindWrap,
  WdNewDocumentType,
  WdOpenFormat,
  WdOrientation,
  WdOriginalFormat,
  WdPrintOutItem,
  WdPrintOutPages,
  WdPrintOutRange,
  WdSaveFormat,
  WdSaveOptions,
  WdUnits,
  WdExportFormat,
  WdCollapseDirection,
  MsoDocProperties,
  WdBreakType,
);

export default fillCompletions(items, CompletionItemKind.Constant, '', 'WordConstants.au3');
