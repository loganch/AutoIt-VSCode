import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
  trueFalseHader as tfHeader,
} from '../util';

const include = '(Requires: `#include <Word.au3>`)';

const signatures = {
  _Word_Create: {
    documentation: 'Connects to an existing Word instance or creates a new Word application object',
    label: '_Word_Create ( [$bVisible], [$bForceNew] )',
    params: [
      {
        label: '[$bVisible]',
        documentation: `${opt} \`True\` specifies that the window will be visible (default)`,
      },
      {
        label: '[$bForceNew]',
        documentation: `${opt} \`True\` forces to create a new Word instance even if there is already a running instance (\`Default = False\`)`,
      },
    ],
  },
  _Word_DocAdd: {
    documentation: `Adds a new or empty document to the specified Word application ${include}`,
    label: '_Word_DocAdd ( $oAppl, [$iDocumentType], [$sDocumentTemplate], [$bNewTemplate] )',
    params: [
      {
        label: '$oAppl',
        documentation: 'Word object returned by a preceding call to `_Word_Create()`',
      },
      {
        label: '[$iDocumentType]',
        documentation: `${opt} Can be one of the following WdNewDocumentType constants:${br}
                \`$WdNewBlankDocument\`, \`$WdNewEmailMessage\`, \`$WdNewFrameset\` or \`$WdNewWebPage\` (\`Default = $WdNewBlankDocument\`)`,
      },
      {
        label: '[$sDocumentTemplate]',
        documentation: `${opt} The name of the template to be used for the new document.${br}
                If this argument is omitted, the Normal template is used (default = "")`,
      },
      {
        label: '[$bNewTemplate]',
        documentation: `${opt} \`True\` to open the document as a template (\`Default = False\`)`,
      },
    ],
  },
  _Word_DocAttach: {
    documentation: `Attaches to the first instance of a Word document where the search string matches based on the selected mode ${include}`,
    label: '_Word_DocAttach ( $oAppl, $sString, [$sMode], [$iCase] )',
    params: [
      {
        label: '$oAppl',
        documentation: 'Word object returned by a preceding call to `_Word_Create()`',
      },
      {
        label: '$sString',
        documentation: 'String to search for',
      },
      {
        label: '[$sMode]',
        documentation: `${opt} Search mode to use. Valid modes are:${br}
                ${tfHeader}
                "FileName"|-|Name of the open document
                "FilePath"|-|Full path to the open document (default)
                "Text"|-|Text in the body of the document`,
      },
      {
        label: '[$iCase]',
        documentation: `${opt} Specifies case-sensitivity of function \`StringInStr()\` used for search mode "Text":${br}
                ${header}
                \`0\`|-|not case-sensitive, using the user's locale (default)
                \`1\`|-|case sensitive
                \`2\`|-|not case sensitive, using a basic/faster comparison`,
      },
    ],
  },
  _Word_DocClose: {
    documentation: `Closes the specified Word document ${include}`,
    label: '_Word_DocClose ( $oDoc, [$iSaveChanges], [$iOriginalFormat] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$iSaveChanges]',
        documentation: `${opt} Specifies the save action for the document (\`Default = $WdDoNotSaveChanges\`).${br}
                Can be one of the WdSaveOptions constants:${br}
                \`$WdDoNotSaveChanges\`, \`$WdPromptToSaveChanges\` or \`$WdSaveChanges\``,
      },
      {
        label: '[$iOriginalFormat]',
        documentation: `${opt} Specifies the save format for the document.${br}
                Can be one of the WdOriginalFormat constants:${br}
                    \`$WdOriginalDocumentFormat\`, \`$WdPromptUser\` or \`$WdWordDocument\` (\`Default = $WdOriginalDocumentFormat\`)`,
      },
    ],
  },
  _Word_DocExport: {
    documentation: `Exports the document or a range as PDF or XPS ${include}`,
    label:
      '_Word_DocExport ( $oDoc, $sFileName, [$iFormat], [$iRange], [$iFrom], [$iTo], [$bOpenAfterExport], [$bIncludeProperties], [$iCreateBookmarks], [$bUseISO19005] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object to be exported',
      },
      {
        label: '$sFileName',
        documentation: 'Path/name of the exported file',
      },
      {
        label: '[$iFormat]',
        documentation: `${opt} Format to use for the export. Can be any of the WdExportFormat enumeration${br}
                (\`Default = $WdExportFormatPDF\`)`,
      },
      {
        label: '[$iRange]',
        documentation: `${opt} Specifies what to export. Can be any of the WdExportRange enumeration${br}
                (\`Default = $WdExportAllDocument\`)`,
      },
      {
        label: '[$iFrom]',
        documentation: `${opt} The page number at which to start publishing (default = start at the beginning)`,
      },
      {
        label: '[$iTo]',
        documentation: `${opt} The page number at which to end publishing (default = end at the last page)`,
      },
      {
        label: '[$bOpenAfterExport]',
        documentation: `${opt} \`True\` displays the file in a viewer after it is published (\`Default = False\`)`,
      },
      {
        label: '[$bIncludeProperties]',
        documentation: `${opt} \`True\` indicates that document properties should be included (\`Default = True\`)`,
      },
      {
        label: '[$iCreateBookmarks]',
        documentation: `${opt} Specifies whether to export bookmarks and the type of bookmarks to export.${br}
                Can be any of the WdExportCreateBookmarks enumeration (default)`,
      },
      {
        label: '[$bUseISO19005]',
        documentation: `${opt} Specifies whether the export should be created as PDF/A (self-contained PDF) (\`Default = False\`)`,
      },
    ],
  },
  _Word_DocFind: {
    documentation: `Runs or repeats the specified find operation ${include}`,
    label:
      '_Word_DocFind ( $oDoc, [$sFindText], [$vSearchRange], [$oFindRange], [$bForward], [$bMatchCase], [$bMatchWholeWord], [$bMatchWildcards], [$bMatchSoundsLike], [$bMatchAllWordForms], [$bFormat] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$sFindText]',
        documentation: `${opt} The text to be searched for. Use an empty string ("") to search for formatting only.\u0020\u0020
                You can search for special characters by specifying appropriate character codes.\u0020\u0020
                For example, "^p" corresponds to a paragraph mark and "^t" corresponds to a tab character (\`Default = ""\`)`,
      },
      {
        label: '[$vSearchRange]',
        documentation: `${opt} Specifies the selection or range to search. Can be:
            ${header}
            \`-1\`|-|Specifies the current selection
            \`0\`|-|Specifies the entire document (default)

            Any Word range object.`,
      },
      {
        label: '[$oFindRange]',
        documentation: `${opt} Specifies the range returned by the last call to \`_Word_DocFind()\`.${br}
                This is required if you want to search for the next or previous occurrence of \`$sFindText\`.${br}
                If set to \`Default\` then the search starts at the start of the \`$vSearchRange\` (default)`,
      },
      {
        label: '[$bForward]',
        documentation: `${opt} \`True\` to search forward (toward the end of the document) (\`Default = True\`)`,
      },
      {
        label: '[$bMatchCase]',
        documentation: `${opt} If \`True\` the find is case sensitive (\`Default = False\`)`,
      },
      {
        label: '[$bMatchWholeWord]',
        documentation: `${opt} If \`True\` only find entire words (\`Default = False\`)`,
      },
      {
        label: '[$bMatchWildcards]',
        documentation: `${opt} If \`True\` the find text has special search operators (\`Default = False\`)`,
      },
      {
        label: '[$bMatchSoundsLike]',
        documentation: `${opt} If \`True\` finds words that sound similar to the find text (\`Default = False\`)`,
      },
      {
        label: '[$bMatchAllWordForms]',
        documentation: `${opt} If \`True\` finds all forms of the find text${br}
                (e.g. "sit" locates "sitting" and "sat") (\`Default = False\`)`,
      },
      {
        label: '[$bFormat]',
        documentation: `${opt} \`True\` to have the find operation locate formatting in addition to or instead of the find text (\`Default = False\`)`,
      },
    ],
  },
  _Word_DocFindReplace: {
    documentation: `Runs the specified find and replace operation ${include}`,
    label:
      '_Word_DocFindReplace ( $oDoc, [$sFindText], [$sReplaceWith], [$iReplace], [$vSearchRange], [$bMatchCase], [$bMatchWholeWord], [$bMatchWildcards], [$bMatchSoundsLike], [$bMatchAllWordForms], [$bForward], [$iWrap], [$bFormat] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$sFindText]',
        documentation: `${opt} The text to be searched for. Use an empty string ("") to search for formatting only.\u0020\u0020
                You can search for special characters by specifying appropriate character codes.\u0020\u0020
                For example, "^p" corresponds to a paragraph mark and "^t" corresponds to a tab character (\`Default = ""\`)`,
      },
      {
        label: '[$sReplaceWith]',
        documentation: `${opt} The replacement text. To delete found text use an empty string ("").\u0020\u0020
                You specify special characters and advanced search criteria just as you do for the Find argument (\`Default = ""\`)`,
      },
      {
        label: '[$iReplace]',
        documentation: `${opt} How many replacements are to be made: one, all, or none.${br}
                Can be anyWdReplace constant (\`Default = $WdReplaceAll\`)`,
      },
      {
        label: '[$vSearchRange]',
        documentation: `${opt} Specifies the selection or range to search. Can be:
            ${header}
            \`-1\`|-|Specifies the current selection
            \`0\`|-|Specifies the entire document (default)

            Any Word range object.`,
      },
      {
        label: '[$bMatchCase]',
        documentation: `${opt} If \`True\` the find is case sensitive (\`Default = False\`)`,
      },
      {
        label: '[$bMatchWholeWord]',
        documentation: `${opt} If \`True\` only find entire words (\`Default = False\`)`,
      },
      {
        label: '[$bMatchWildcards]',
        documentation: `${opt} If \`True\` the find text has special search operators (\`Default = False\`)`,
      },
      {
        label: '[$bMatchSoundsLike]',
        documentation: `${opt} If \`True\` finds words that sound similar to the find text (\`Default = False\`)`,
      },
      {
        label: '[$bMatchAllWordForms]',
        documentation: `${opt} If \`True\` finds all forms of the find text${br}
                (e.g. "sit" locates "sitting" and "sat") (\`Default = False\`)`,
      },
      {
        label: '[$bForward]',
        documentation: `${opt} \`True\` to search forward (toward the end of the document) (\`Default = True\`)`,
      },
      {
        label: '[$iWrap]',
        documentation: `${opt} \`True\` wraps when the bottom or top of the document, selection or range is reached.${br}
                Can be one of the WdFindWrap constants (\`Default = $WdFindContinue\`)`,
      },
      {
        label: '[$bFormat]',
        documentation: `${opt} \`True\` to have the find operation locate formatting in addition to or instead of the find text (\`Default = False\`)`,
      },
    ],
  },
  _Word_DocGet: {
    documentation: `Returns a collection object containing all documents or an object for a single document ${include}`,
    label: '_Word_DocGet ( $oAppl , [$vIndex] )',
    params: [
      {
        label: '$oAppl',
        documentation: 'Word object returned by a preceding call to `_Word_Create()`',
      },
      {
        label: '[$vIndex]',
        documentation: `${opt} Specifies what to return:\u0020\u0020
                ${header}
                \`-1\`|-|Returns a collection of all documents (default)
                \`0\`|-|Returns the active document
                \`n\`|-|The index number of the document to return (1 based)
                \`x\`|-|The name of the document to return`,
      },
    ],
  },
  _Word_DocLinkAdd: {
    documentation: `Adds a hyperlink to the document ${include}`,
    label:
      '_Word_DocLinkAdd ( $oDoc, [$oAnchor], [$sAddress], [$sSubAddress], [$sScreenTip], [$sTextToDisplay], [$sTarget] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$oAnchor]',
        documentation: `${opt} Range object for the text or graphic to be turned into a hyperlink\u0020\u0020
                (default = Use entire document as range)`,
      },
      {
        label: '[$sAddress]',
        documentation: `${opt} The address for the specified link.\u0020\u0020
                The address can be an E-mail address, an Internet address or a file name (default = link to the specified document is used)`,
      },
      {
        label: '[$sSubAddress]',
        documentation: `${opt} The name of a location within the destination file, such as a bookmark, named range or slide number (default = None)`,
      },
      {
        label: '[$sScreenTip]',
        documentation: `${opt} The text that appears as a ScreenTip when the mouse pointer is positioned over the specified hyperlink (default = Uses value of \`$sAddress\`)`,
      },
      {
        label: '[$sTextToDisplay]',
        documentation: `${opt} The display text of the specified hyperlink.\u0020\u0020
                The value of this argument replaces the text or graphic specified by \`$oAnchor\` (default = Uses value of \`$sAddress\`)`,
      },
      {
        label: '[$sTarget]',
        documentation: `${opt} The name of the frame or window in which you want to load the specified hyperlink`,
      },
    ],
  },
  _Word_DocLinkGet: {
    documentation: `Returns a collection object containing all links in the document or a single link object ${include}`,
    label: '_Word_DocLinkGet ( $oDoc , [$iIndex] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$iIndex]',
        documentation: `${opt} Specifies what to return:
                ${tfHeader}
                \`Default\` |-| Returns a collection of all links (default)${br}
                |n |-| The index number of the link to return (1 based)`,
      },
    ],
  },
  _Word_DocOpen: {
    documentation: `Opens a Word document ${include}`,
    label:
      '_Word_DocOpen ( $oAppl, $sFilePath , [$bConfirmConversions], [$iFormat], [$bReadOnly], [$bRevert], [$bAddToRecentFiles], [$sOpenPassword], [$sWritePassword] )',
    params: [
      {
        label: '$oAppl',
        documentation: 'Word object returned by a preceding call to `_Word_Create()`',
      },
      {
        label: '$sFilePath',
        documentation: 'The name or full path of the document to open',
      },
      {
        label: '[$bConfirmConversions]',
        documentation: `${opt} \`True\` displays the Convert File dialog if the file isn't in Word format (\`Default = False\`)`,
      },
      {
        label: '[$iFormat]',
        documentation: `${opt} Specifies the format to use when opening the document.\u0020\u0020
                Can be any of the WdOpenFormat enumeration (\`Default = $WdOpenFormatAuto\` = the existing format)`,
      },
      {
        label: '[$bReadOnly]',
        documentation: `${opt} \`True\` to open the document as read-only (\`Default = False\`).\u0020\u0020
                Note: This argument doesn't override the read-only recommended setting on a saved document.`,
      },
      {
        label: '[$bRevert]',
        documentation: `${opt} Controls what happens if \`$sFilePath\` is the name of an open document.\u0020\u0020
                \`True\` to discard any unsaved changes to the open document and reopen the file.\u0020\u0020
                \`False\` to activate the open document (\`Default = False\`)`,
      },
      {
        label: '[$bAddToRecentFiles]',
        documentation: `${opt} \`True\` adds the file name to the list of recently used files at the bottom of the File menu (\`Default = False\`)`,
      },
      {
        label: '[$sOpenPassword]',
        documentation: `${opt} The password for opening the document`,
      },
      {
        label: '[$sWritePassword]',
        documentation: `${opt} The password for saving changes to the document`,
      },
    ],
  },
  _Word_DocPictureAdd: {
    documentation: `Adds a picture to the document ${include}`,
    label:
      '_Word_DocPictureAdd ( $oDoc, $sFilePath, [$bLinkToFile], [$bSaveWithDocument], [$oRange] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '$sFilePath',
        documentation: 'The path and file name of the picture',
      },
      {
        label: '[$bLinkToFile]',
        documentation: `${opt} Specifies whether to link the picture to the file from which it was created.\u0020\u0020
                ${tfHeader}
                \`True\`|-|Link the picture to the file from which it was created
                \`False\`|-|Make the picture an independent copy of the file (default)`,
      },
      {
        label: '[$bSaveWithDocument]',
        documentation: `${opt} Specifies whether to save the linked picture with the document.
                ${tfHeader}
                \`True\`|-|Save the linked picture with the document
                \`False\`|-|Do not save the linked picture with the document (default)`,
      },
      {
        label: '[$oRange]',
        documentation: `${opt} The location where the picture will be placed in the text.\u0020\u0020
                Can be \`0\` (the picture is placed automatically) or any range object (\`Default = 0\`)`,
      },
    ],
  },
  _Word_DocPrint: {
    documentation: `Prints all or parts of the specified document ${include}`,
    label:
      '_Word_DocPrint ( $oDoc, [$bBackground], [$iCopies], [$iOrientation], [$bCollate], [$sPrinter], [$iRange], [$vFrom], [$vTo], [$sPages], [$iPageType], [$iItem] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$bBackground]',
        documentation: `${opt} \`True\` lets the script continue while the document is printed (\`Default = False\`)`,
      },
      {
        label: '[$iCopies]',
        documentation: `${opt} The number of copies to be printed (\`Default = 1\`)`,
      },
      {
        label: '[$iOrientation]',
        documentation: `${opt} Sets the orientation of the page:
                ${header}
                \`-1\`|-|Use current document orientation (\`Default\`)
                \`0\`|-|Portrait (\`$WdOrientPortrait\` of the WdOrientation enumeration)
                \`1\`|-|Landscape (\`$WdOrientLandscape\` of the WdOrientation enumeration)`,
      },
      {
        label: '[$bCollate]',
        documentation: `${opt} \`True\` prints all pages of the document before printing the next copy (\`Default = True\`)`,
      },
      {
        label: '[$sPrinter]',
        documentation: `${opt} Sets the name of the printer (\`Default = ""\`&nbsp;=&nbsp;Active printer)`,
      },
      {
        label: '[$iRange]',
        documentation: `${opt} Specifies the page range to print.\u0020\u0020
                Can be any of the WdPrintOutRange enumeration.\u0020\u0020
                (\`Default = $WdPrintAllDocument\`&nbsp;=&nbsp;print the entire document)`,
      },
      {
        label: '[$vFrom]',
        documentation: `${opt} The starting page number (integer) when \`$iRange\` is set to \`$WdPrintFromTo\``,
      },
      {
        label: '[$vTo]',
        documentation: `${opt} The ending page number (integer) when \`$iRange\` is set to \`$WdPrintFromTo\``,
      },
      {
        label: '[$sPages]',
        documentation: `${opt} The page numbers and page ranges to be printed, separated by commas when \`$iRange\` is set to \`4\`.\u0020\u0020
                For example, \`"2, 6-10"\` prints page 2 and pages 6 through 10 (\`Default = ""\`)`,
      },
      {
        label: '[$iPageType]',
        documentation: `${opt} The type of pages to be printed. Can be any of the WdPrintOutPages enumeration\u0020\u0020
                (\`Default = $WdPrintAllPages\` = print all pages)`,
      },
      {
        label: '[$iItem]',
        documentation: `${opt} The item to be printed. Can be any of the WdPrintOutItem enumeration\u0020\u0020
                (\`Default = $WdPrintDocumentContent\` = document content)`,
      },
    ],
  },
  _Word_DocRangeSet: {
    documentation: `Sets or modifies a range in a document ${include}`,
    label:
      '_Word_DocRangeSet ( $oDoc, $vRange, [$iStartUnit], [$iStartCount], [$iEndUnit], [$iEndCount] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '$vRange',
        documentation: `Range to set or extend. You can pass an existing range which then is extended. Also valid is:
                ${header}
                |\`0\`|-|uses the current selection as range
                |\`-1\`|-|sets the range start/end at the start of the document
                |\`-2\`|-|sets the range start/end at the end of the document`,
      },
      {
        label: '[$iStartUnit]',
        documentation: `${opt} Unit by/to which the start position of the range is to be moved/set.\u0020\u0020
                Can be any of the WdUnit enumeration (\`Default = $WdWord\`).\u0020\u0020
                When set to \`-1\` the range is collapsed to the start of the range`,
      },
      {
        label: '[$iStartCount]',
        documentation: `${opt} Number of units by/to which the start of range is moved/set.\u0020\u0020
                Positive numbers move the range forward in the document.\u0020\u0020
                If the position is moved forward to a position beyond the end position of the range, the range is collapsed and both the start and end positions are moved together (default = don't move the start position)`,
      },
      {
        label: '[$iEndUnit]',
        documentation: `${opt} Unit by/to which the end position of the range is to be moved/set.\u0020\u0020
                Can be any of the WdUnit enumeration (\`Default = $WdWord\`).\u0020\u0020
                When set to \`-1\` the range is collapsed to the end of the range`,
      },
      {
        label: '[$iEndCount]',
        documentation: `${opt} Number of units by/to which the end of the range is moved/set.\u0020\u0020
                If this number is negative, the end is moved backward.\u0020\u0020
                If the ending position overtakes the starting position, the range collapses and both positions move together (default = don't move the end position)`,
      },
    ],
  },
  _Word_DocSave: {
    documentation: `Saves the specified Word document ${include}`,
    label: '_Word_DocSave ( $oDoc )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
    ],
  },
  _Word_DocSaveAs: {
    documentation: `Saves the specified Word document with a new name or format ${include}`,
    label:
      '_Word_DocSaveAs ( $oDoc, [$sFileName], [$iFileFormat], [$bReadOnlyRecommended], [$bAddToRecentFiles], [$sPassword], [$sWritePassword] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '[$sFileName]',
        documentation: `${opt} The full path name for the document (default = Current folder and current file name).\u0020\u0020
                If the document has never been saved, the default name is used (for example, Doc1.doc)`,
      },
      {
        label: '[$iFileFormat]',
        documentation: `${opt} The format in which the document is saved.\u0020\u0020
                Can be any WdSaveFormat constant (default = \`$WdFormatDocument\`)`,
      },
      {
        label: '[$bReadOnlyRecommended]',
        documentation: `${opt} True to have Word suggest read-only status whenever the document is opened (default = \`False\`)`,
      },
      {
        label: '[$bAddToRecentFiles]',
        documentation: `${opt} True to add the document to the list of recently used files (default = \`True\`)`,
      },
      {
        label: '[$sPassword]',
        documentation: `${opt} A password string for opening the document (default = "")`,
      },
      {
        label: '[$sWritePassword]',
        documentation: `${opt} A password string for saving changes to the document (default = "")`,
      },
    ],
  },
  _Word_DocTableRead: {
    documentation: `Reads a Word table and returns the content as a two-dimensional array ${include}`,
    label: '_Word_DocTableRead ( $oDoc, $vTable [, $iIndexBase [, $sDelimiter]] )',
    params: [
      {
        label: '$oDoc',
        documentation: 'Word document object',
      },
      {
        label: '$vTable',
        documentation: 'Table object or index of the table in the table collection',
      },
      {
        label: '$iIndexBase',
        documentation: `${opt} Can be 0 or 1 and specifies if the array starts with row 0 or 1 (default = 1)`,
      },
      {
        label: '$sDelimiter',
        documentation: `${opt} Specifies the character used to separate text into cells (default = \`@TAB\`)`,
      },
    ],
  },
  _Word_DocTableWrite: {
    documentation: `Writes a one or two dimensional array to a Word table ${include}`,
    label: '_Word_DocTableWrite ( $oRange, ByRef $aArray [, $iIndexBase [, $sDelimiter]] )',
    params: [
      {
        label: '$oRange',
        documentation: 'Word range object where the table should be inserted',
      },
      {
        label: '$aArray',
        documentation: `one or two-dimensional array to be converted to a table.
                Can be zero or 1-based`,
      },
      {
        label: '$iIndexBase',
        documentation: `${opt} Can be 0 or 1 and specifies if the array starts with row 0 or 1 (default = 1)`,
      },
      {
        label: '$sDelimiter',
        documentation: `${opt} Specifies the character used to separate text into cells (default = \`@TAB\`)`,
      },
    ],
  },
  _Word_Quit: {
    documentation: `Closes all documents, the Word application and removes the object reference to it ${include}`,
    label: '_Word_Quit ( $oAppl , [$iSaveChanges], [$iOriginalFormat], [$bForceClose] )',
    params: [
      {
        label: '$oAppl',
        documentation: 'Word object returned by a preceding call to `_Word_Create()`',
      },
      {
        label: '[$iSaveChanges]',
        documentation: `${opt} Specifies if changed documents should be saved before closing.${br}
                Can be one of the WdSaveOptions enumeration (default = \`$WdDoNotSaveChanges\`)`,
      },
      {
        label: '[$iOriginalFormat]',
        documentation: `${opt} Specifies how Word saves documents whose original format was not Word document format.${br}
                Can be any of the WdOriginalFormat enumeration (default = \`$WdWordDocument\`)`,
      },
      {
        label: '[$bForceClose]',
        documentation: `${opt} If True the Word application is closed even when it was running at \`_Word_Create()\` time (default = \`False\`)`,
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
