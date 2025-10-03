import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlRichEdit.au3>`)';

const signatures = {
  _GUICtrlRichEdit_AppendText: {
    documentation: 'Appends text at the end of the client area',
    label: '_GUICtrlRichEdit_AppendText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to be appended',
      },
    ],
  },
  _GUICtrlRichEdit_AutoDetectURL: {
    documentation: 'Enables or disables automatic detection of URLS',
    label: '_GUICtrlRichEdit_AutoDetectURL ( $hWnd, $bState )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation: 'True to detect URLs in text, False not to',
      },
    ],
  },
  _GUICtrlRichEdit_CanPaste: {
    documentation: 'Can the contents of the clipboard be pasted into the control?',
    label: '_GUICtrlRichEdit_CanPaste ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_CanPasteSpecial: {
    documentation: 'Can the contents of the clipboard be pasted into the control in both formats?',
    label: '_GUICtrlRichEdit_CanPasteSpecial ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_CanRedo: {
    documentation: 'Can an undone action be redone?',
    label: '_GUICtrlRichEdit_CanRedo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_CanUndo: {
    documentation: 'Can an action be undone?',
    label: '_GUICtrlRichEdit_CanUndo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_ChangeFontSize: {
    documentation: 'Increment or decrement font size(s) of selected text',
    label: '_GUICtrlRichEdit_ChangeFontSize ( $hWnd, $iIncrement )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iIncrement',
        documentation: 'Positive to increase, negative to decrease',
      },
    ],
  },
  _GUICtrlRichEdit_Copy: {
    documentation: 'Copy text to clipboard',
    label: '_GUICtrlRichEdit_Copy ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_Create: {
    documentation: 'Create an Edit control',
    label:
      '_GUICtrlRichEdit_Create ( $hWnd, $sText, $iLeft, $iTop [, $iWidth = 150 [, $iHeight = 150 [, $iStyle = -1 [, $iExStyle = -1]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$sText',
        documentation: 'Text to be displayed in the control',
      },
      {
        label: '$iLeft',
        documentation: 'Horizontal position of the control',
      },
      {
        label: '$iTop',
        documentation: 'Vertical position of the control',
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** Control width',
      },
      {
        label: '$iHeight',
        documentation: '**[optional]** Control height',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** Control styles:    $ES_AUTOHSCROLL - Automatically scrolls text to the right by 10 characters when the user types a character at the end of the line.    $ES_AUTOVSCROLL - Automatically scrolls text up one page when the user presses the ENTER key on the last line.    $WS_HSCROLL - Control has horizontal scroll bar    $WS_VSCROLL - Control has vertical scroll bar    $ES_CENTER - Centers text in an edit control.    $ES_LEFT - Aligns text with the left margin.    $ES_MULTILINE - Generates a multi-line control (Default)    $ES_NOHIDESEL - The selected text is inverted, even if the control does not have the focus.    $ES_NUMBER - Allows only digits to be entered into the edit control.    $ES_READONLY - Prevents the user from typing or editing text in the edit control.    $ES_RIGHT - Right-aligns text edit control.    $ES_WANTRETURN - Specifies that a carriage return be inserted when the user presses the ENTER key. (Default)    $ES_PASSWORD - Displays an asterisk (*) for each character that is typed into the edit controlDefault: 0Forced : WS_CHILD, $WS_VISIBLE, $WS_TABSTOP unless $ES_READONLY',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlRichEdit_Cut: {
    documentation: 'Cut text to clipboard',
    label: '_GUICtrlRichEdit_Cut ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_Deselect: {
    documentation: 'Deselects text, leaving none selected',
    label: '_GUICtrlRichEdit_Deselect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_Destroy: {
    documentation: 'Delete the Rich Edit control',
    label: '_GUICtrlRichEdit_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_EmptyUndoBuffer: {
    documentation: 'Resets the undo flag of the control',
    label: '_GUICtrlRichEdit_EmptyUndoBuffer ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_FindText: {
    documentation: 'Search for a text starting at insertion point or at anchor point of selection',
    label:
      '_GUICtrlRichEdit_FindText ( $hWnd, $sText [, $bForward = True [, $bMatchCase = False [, $bWholeWord = False [, $iBehavior = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to find',
      },
      {
        label: '$bForward',
        documentation: '**[optional]** Search direction(Win 95: search is always forward)',
      },
      {
        label: '$bMatchCase',
        documentation: '**[optional]** Search is case-sensitiveDefault: case-insensitive',
      },
      {
        label: '$bWholeWord',
        documentation:
          '**[optional]** Search only for text as a whole wordDefault: partial or full word',
      },
      {
        label: '$iBehavior',
        documentation:
          '**[optional]** Any BitOR combination of $FR_MATCHALEFHAMZA, $FR_MATCHDIAC and $FR_MATCHKASHIDADefault: 0',
      },
    ],
  },
  _GUICtrlRichEdit_FindTextInRange: {
    documentation: 'Search for a text in a range of inter-character positions',
    label:
      '_GUICtrlRichEdit_FindTextInRange ( $hWnd, $sText [, $iStart = 0 [, $iEnd = -1 [, $bMatchCase = False [, $bWholeWord = False [, $iBehavior = 0]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to find',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** Starting inter-character position of searchDefault: beginning of control',
      },
      {
        label: '$iEnd',
        documentation:
          '**[optional]** Ending inter-character position of searchDefault: end of control',
      },
      {
        label: '$bMatchCase',
        documentation: '**[optional]** Search is case-sensitiveDefault: case-insensitive',
      },
      {
        label: '$bWholeWord',
        documentation:
          '**[optional]** Search only for text as a whole wordDefault: partial or full word',
      },
      {
        label: '$iBehavior',
        documentation:
          '**[optional]** Any BitOR combination of $FR_MATCHALEFHAMZA, $FR_MATCHDIAC and $FR_MATCHKASHIDADefault: 0',
      },
    ],
  },
  _GUICtrlRichEdit_GetBkColor: {
    documentation: 'Gets the background color of the control',
    label: '_GUICtrlRichEdit_GetBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharAttributes: {
    documentation: 'Returns attributes of selected text',
    label: '_GUICtrlRichEdit_GetCharAttributes ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharBkColor: {
    documentation:
      'Retrieves the background color of the selected text or, if none selected, of the character to the right of the insertion point',
    label: '_GUICtrlRichEdit_GetCharBkColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharColor: {
    documentation:
      'Retrieves the color of the selected text or, if none selected, of the character to the right of the insertion point',
    label: '_GUICtrlRichEdit_GetCharColor ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharPosFromXY: {
    documentation: 'Gets inter-character position closest to a specified point in the client area',
    label: '_GUICtrlRichEdit_GetCharPosFromXY ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'horizontal coordinate relative to left side of control',
      },
      {
        label: '$iY',
        documentation: 'vertical coordinate relative to top of control',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharPosOfNextWord: {
    documentation: 'Gets inter-character position before the next word',
    label: '_GUICtrlRichEdit_GetCharPosOfNextWord ( $hWnd, $iCpStart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCPStart',
        documentation: 'inter-character position to start from',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharPosOfPreviousWord: {
    documentation: 'Gets inter-character position before the Previous word',
    label: '_GUICtrlRichEdit_GetCharPosOfPreviousWord ( $hWnd, $iCpStart )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCPStart',
        documentation: 'inter-character position to start from',
      },
    ],
  },
  _GUICtrlRichEdit_GetCharWordBreakInfo: {
    documentation: 'Gets inter-character position before the Previous word/',
    label: '_GUICtrlRichEdit_GetCharWordBreakInfo ( $hWnd, $iCp )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCP',
        documentation: 'Inter-character position to left of character of interest',
      },
    ],
  },
  _GUICtrlRichEdit_GetFirstCharPosOnLine: {
    documentation: 'Retrieves the inter-character position preceding the first character of a line',
    label: '_GUICtrlRichEdit_GetFirstCharPosOnLine ( $hWnd [, $iLine = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLine',
        documentation: '**[optional]** Line numberDefault: current line',
      },
    ],
  },
  _GUICtrlRichEdit_GetFont: {
    documentation:
      'Gets the font attributes of a selection or, if no selection, at the insertion point',
    label: '_GUICtrlRichEdit_GetFont ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetLineCount: {
    documentation: 'Retrieves the number of lines in a multi-line edit control',
    label: '_GUICtrlRichEdit_GetLineCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetLineLength: {
    documentation: 'Retrieves the length of a line',
    label: '_GUICtrlRichEdit_GetLineLength ( $hWnd, $iLine )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLine',
        documentation:
          'line numberSpecial value: -1 - return number of unselected characters on lines containing selected characters',
      },
    ],
  },
  _GUICtrlRichEdit_GetLineNumberFromCharPos: {
    documentation: 'Retrieves the line number on which an inter-character position is found',
    label: '_GUICtrlRichEdit_GetLineNumberFromCharPos ( $hWnd, $iCharPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCharPos',
        documentation: 'Inter-character position',
      },
    ],
  },
  _GUICtrlRichEdit_GetNextRedo: {
    documentation: 'Retrieves the name or type ID of the next possible redo action',
    label: '_GUICtrlRichEdit_GetNextRedo ( $hWnd [, $bName = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bName',
        documentation: '**[optional]** True (return name, default) or False (return ID number)',
      },
    ],
  },
  _GUICtrlRichEdit_GetNextUndo: {
    documentation: 'Retrieves the name or type ID of the next possible Undo action',
    label: '_GUICtrlRichEdit_GetNextUndo ( $hWnd [, $bName = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bName',
        documentation: '**[optional]** True (return name, default) or False (return ID number)',
      },
    ],
  },
  _GUICtrlRichEdit_GetNumberOfFirstVisibleLine: {
    documentation: 'Gets number of the first line which is visible in the control',
    label: '_GUICtrlRichEdit_GetNumberOfFirstVisibleLine ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaAlignment: {
    documentation:
      'Gets the alignment of selected paragraph(s), or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaAlignment ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaAttributes: {
    documentation:
      'Gets the attributes of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaAttributes ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaBorder: {
    documentation:
      'Gets the border settings of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaBorder ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaIndents: {
    documentation:
      'Gets the border indent settings of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaIndents ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaNumbering: {
    documentation:
      'Gets the numbering style of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaNumbering ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaShading: {
    documentation:
      'Gets the shading settings of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaShading ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaSpacing: {
    documentation:
      'Gets the spacing settings of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaSpacing ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetParaTabStops: {
    documentation:
      'Gets the tabstops of (first) selected paragraph or (if no selection) of the current paragraph',
    label: '_GUICtrlRichEdit_GetParaTabStops ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetPasswordChar: {
    documentation:
      'Gets the password character that a rich edit control displays when the user enters text',
    label: '_GUICtrlRichEdit_GetPasswordChar ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetRECT: {
    documentation: 'Retrieves the formatting rectangle of a control',
    label: '_GUICtrlRichEdit_GetRECT ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetScrollPos: {
    documentation: 'Gets the Scrolling position of the control',
    label: '_GUICtrlRichEdit_GetScrollPos ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetSel: {
    documentation: 'Gets the low and high inter-character positions of a selection',
    label: '_GUICtrlRichEdit_GetSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetSelAA: {
    documentation:
      'Gets the anchor and active inter-character positions of a selection, in that order',
    label: '_GUICtrlRichEdit_GetSelAA ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetSelText: {
    documentation: 'Retrieves the currently selected text',
    label: '_GUICtrlRichEdit_GetSelText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GetSpaceUnit: {
    documentation:
      'Gets the unit of measure of horizontal and vertical space used in parameters of various _GUICtrlRichEdit functions',
    label: '_GUICtrlRichEdit_GetSpaceUnit (  )',
    params: [],
  },
  _GUICtrlRichEdit_GetText: {
    documentation: 'Get all of the text in the control',
    label:
      '_GUICtrlRichEdit_GetText ( $hWnd [, $bCrToCrLf = False [, $iCodePage = 0 [, $sReplChar = ""]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bCrToCrLf',
        documentation:
          "**[optional]** Convert each CR to a CrLf    True - do it    False - don't (Default)",
      },
      {
        label: '$iCodePage',
        documentation:
          '**[optional]** code page used in translationDefault: use system defaultCP_ACP for ANSI, 1200 for Unicode',
      },
      {
        label: '$sReplChar',
        documentation:
          '**[optional]** Character used if $iCodePage is not 1200 and a wide character cannot be represented in specified code page',
      },
    ],
  },
  _GUICtrlRichEdit_GetTextInLine: {
    documentation: 'Gets a line of text',
    label: '_GUICtrlRichEdit_GetTextInLine ( $hWnd, $iLine )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLine',
        documentation: 'Line number',
      },
    ],
  },
  _GUICtrlRichEdit_GetTextInRange: {
    documentation: 'Gets the text from from one inter-character position to another',
    label: '_GUICtrlRichEdit_GetTextInRange ( $hWnd, $iStart, $iEnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iStart',
        documentation: 'Inter-character position before the text',
      },
      {
        label: '$iEnd',
        documentation: 'Inter-character position after the textSpecial value: -1 - end of text',
      },
    ],
  },
  _GUICtrlRichEdit_GetTextLength: {
    documentation: 'Get the length of the whole text in the control',
    label: '_GUICtrlRichEdit_GetTextLength ( $hWnd [, $bExact = True [, $bChars = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bExact',
        documentation:
          '**[optional]**    True - Return the exact length    False - return at least the number of characters in the control (faster)Default: exact length',
      },
      {
        label: '$bChars',
        documentation:
          '**[optional]**    True - return length in characters    False - return length in bytesDefault: bytes',
      },
    ],
  },
  _GUICtrlRichEdit_GetVersion: {
    documentation: 'Retrieves the version of Rich Edit',
    label: '_GUICtrlRichEdit_GetVersion (  )',
    params: [],
  },
  _GUICtrlRichEdit_GetXYFromCharPos: {
    documentation: 'Retrieves the XY coordinates of an inter-character position',
    label: '_GUICtrlRichEdit_GetXYFromCharPos ( $hWnd, $iCharPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCharPos',
        documentation: 'Inter-character position',
      },
    ],
  },
  _GUICtrlRichEdit_GetZoom: {
    documentation: 'Gets the zoom level of the control',
    label: '_GUICtrlRichEdit_GetZoom ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_GotoCharPos: {
    documentation: 'Moves the insertion point to an inter-character position',
    label: '_GUICtrlRichEdit_GotoCharPos ( $hWnd, $iCharPos )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iCharPos',
        documentation: 'the inter character positionSpecial value: -1 - end of text',
      },
    ],
  },
  _GUICtrlRichEdit_HideSelection: {
    documentation: 'Hides (or shows) a selection',
    label: '_GUICtrlRichEdit_HideSelection ( $hWnd [, $bHide = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bHide',
        documentation: '**[optional]**    True - hide    False - showDefault: hide',
      },
    ],
  },
  _GUICtrlRichEdit_InsertText: {
    documentation: 'Inserts text at insertion point or anchor point of selection',
    label: '_GUICtrlRichEdit_InsertText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Text to be inserted',
      },
    ],
  },
  _GUICtrlRichEdit_IsModified: {
    documentation: "Retrieves the state of a rich edit control's modification flag",
    label: '_GUICtrlRichEdit_IsModified ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_IsTextSelected: {
    documentation: 'Is text selected?',
    label: '_GUICtrlRichEdit_IsTextSelected ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_Paste: {
    documentation: 'Paste RTF or RTF with Objects from clipboard',
    label: '_GUICtrlRichEdit_Paste ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_PasteSpecial: {
    documentation: 'Paste RTF or RTF and Objects from clipboard',
    label: '_GUICtrlRichEdit_PasteSpecial ( $hWnd [, $bAndObjects = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bAndObjects',
        documentation: '**[optional]** Paste objects as well as RTF - True (default) or False',
      },
    ],
  },
  _GUICtrlRichEdit_PauseRedraw: {
    documentation: 'Pauses redrawing of the control',
    label: '_GUICtrlRichEdit_PauseRedraw ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_Redo: {
    documentation: 'Redoes last undone action',
    label: '_GUICtrlRichEdit_Redo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_ReplaceText: {
    documentation: 'Replaces selected text',
    label: '_GUICtrlRichEdit_ReplaceText ( $hWnd, $sText [, $bCanUndo = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Replacement text',
      },
      {
        label: '$bCanUndo',
        documentation: '**[optional]** Can operation can be undone? True (Default) or False',
      },
    ],
  },
  _GUICtrlRichEdit_ResumeRedraw: {
    documentation: 'Resumes redrawing of the control',
    label: '_GUICtrlRichEdit_ResumeRedraw ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_ScrollLineOrPage: {
    documentation: 'Scrolls the text down or up a line or a page',
    label: '_GUICtrlRichEdit_ScrollLineOrPage ( $hWnd, $sAction )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sAction',
        documentation:
          'one of the following:    "ld" - line down    "lu" - line up    "pd" - page down    "pu" - page up',
      },
    ],
  },
  _GUICtrlRichEdit_ScrollLines: {
    documentation: 'Scrolls the text down or up a number of lines',
    label: '_GUICtrlRichEdit_ScrollLines ( $hWnd, $iQlines )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iQlines',
        documentation: 'number of lines to scroll',
      },
    ],
  },
  _GUICtrlRichEdit_ScrollToCaret: {
    documentation: 'Scrolls to show line on which caret (insertion point) is',
    label: '_GUICtrlRichEdit_ScrollToCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _GUICtrlRichEdit_SetBkColor: {
    documentation: 'Sets the background color of the control',
    label: '_GUICtrlRichEdit_SetBkColor ( $hWnd [, $iBngColor = Default] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iBngColor',
        documentation:
          '**[optional]** one of the following:a number - a COLORREF valueDefault keyword - the system color (default)',
      },
    ],
  },
  _GUICtrlRichEdit_SetCharAttributes: {
    documentation:
      'Turns an attribute on or off for selected text or, if none selected, for text inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetCharAttributes ( $hWnd, $sStatesAndEffects [, $bWord = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sStatesAndEffects',
        documentation:
          "a string consisting of three character groups: + (or -) for the state, and a two-letter abbreviation for the attributefirst character: + for on, - for offsecond and third character: any of:    bo - bold    di - disable - displays characters with a shadow [nd]    em - emboss [nd]    hi - hide, i.e. don't display    im - imprint [nd]    it - italcize    li - send EN_LINK messages when mouse is over text with this attribute    ou - outline [nd]    pr - send EN_PROTECT when user attempts to modify    re - mark as revised [nd]    sh - shadow [nd]    sm - small capital letters [nd]    st - strike out    sb - subscript [nd]    sp - superscript [nd]    un - underline",
      },
      {
        label: '$bWord',
        documentation:
          '**[optional]** True    If text is selected, apply the attribute to whole words in the selected text    If not:    If the insertion point is in a word, or at the end of it, apply the attribute to the word    If not, apply the attribute to text inserted at the insertion pointFalse (Default)    If text is selected, apply the attribute to the selected text    If not, apply the attribute to text inserted at the insertion point',
      },
    ],
  },
  _GUICtrlRichEdit_SetCharBkColor: {
    documentation:
      'Sets the background color of selected text or, if none selected, sets the background color of text inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetCharBkColor ( $hWnd [, $iBkColor = Default] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iBkColor',
        documentation:
          '**[optional]** one of the following:a number - a COLORREF valueDefault keyword - the system color (default)',
      },
    ],
  },
  _GUICtrlRichEdit_SetCharColor: {
    documentation:
      'Sets the color of selected text or, if none selected, sets the background color of text inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetCharColor ( $hWnd [, $iColor = Default] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iColor',
        documentation:
          '**[optional]** one of the following:a number - a COLORREF valueDefault keyword - the system color (default)',
      },
    ],
  },
  _GUICtrlRichEdit_SetEventMask: {
    documentation: 'Specifies which notification messages are sent to the parent window',
    label: '_GUICtrlRichEdit_SetEventMask ( $hWnd, $iEventMask )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iEventMask',
        documentation:
          "BitOR combination of :    $ENM_CHANGE - Sends $EN_CHANGE notifications (user may have altered text)    $ENM_CORRECTTEXT - Sends $EN_CORRECTTEXT notifications (parent window can cancel correction of text)    $ENM_DRAGDROPDONE - Sends $EN_DRAGDROPDONE notifications (drag and drop operation completed)    $ENM_DROPFILES - Sends $EN_DROPFILES notifications (user is attempting to drop files into the control)    $ENM_KEYEVENTS - Sends $EN_MSGFILTER notifications for keyboard events    $ENM_LINK - Sends $EN_LINK notifications when the mouse pointer is over text having the link character attribute set and when user clicks the mouse [2.0+]    $ENM_MOUSEEVENTS - Sends $EN_MSGFILTER notifications for mouse events to parent window    $ENM_OBJECTPOSITIONS - Sends $EN_OBJECTPOSITIONS notifications when the control reads in objects    $ENM_PROTECTED - Sends $EN_PROTECTED notifications when the user attempts to change characters having the protected attribute set    $ENM_REQUESTRESIZE - Sends $EN_REQUESTRESIZE notifications that the control's contents are either smaller or larger than the control's window size    $ENM_SCROLL - Sends $EN_HSCROLL and $EN_VSCROLL notifications when the user clicks the horizontal/vertical scroll bar    $ENM_SCROLLEVENTS - Sends EN_MSGFILTER notifications for mouse wheel events    $ENM_SELCHANGE - Sends EN_SELCHANGE notifications when the current selection changes    $ENM_UPDATE - Sends EN_UPDATE notifications when a control is about to redraw itselfor    $ENM_NONE - Disables sending of notification messages to the parent window",
      },
    ],
  },
  _GUICtrlRichEdit_SetFont: {
    documentation:
      'Sets the font attributes of selected text or, if none selected, sets those of text inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetFont ( $hWnd [, $iPoints = Default [, $sName = Default [, $iCharset = Default [, $iLcid = Default]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPoints',
        documentation: '**[optional]** point size',
      },
      {
        label: '$sName',
        documentation:
          '**[optional]** the name of the font face, e.g. "Courier" not "Courier Bold"',
      },
      {
        label: '$iCharSet',
        documentation:
          '**[optional]** the character set - one of:    $ANSI_CHARSET - 0    $BALTIC_CHARSET - 186    $CHINESEBIG5_CHARSET - 136    $DEFAULT_CHARSET - 1    $EASTEUROPE_CHARSET - 238    $GB2312_CHARSET - 134    $GREEK_CHARSET - 161    $HANGEUL_CHARSET - 129    $MAC_CHARSET - 77    $OEM_CHARSET - 255    $RUSSIAN_CHARSET - 204    $SHIFTJIS_CHARSET - 128    $SYMBOL_CHARSET - 2    $TURKISH_CHARSET - 162    $VIETNAMESE_CHARSET - 163',
      },
      {
        label: '$iLcid',
        documentation:
          '**[optional]** see http://www.microsoft.com/globaldev/reference/lcid-all.mspx',
      },
    ],
  },
  _GUICtrlRichEdit_SetLimitOnText: {
    documentation:
      'Change number of characters that can be typed, pasted or streamed in as Rich Text Format',
    label: '_GUICtrlRichEdit_SetLimitOnText ( $hWnd, $iNewLimit )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iNewLimit',
        documentation: 'new limit',
      },
    ],
  },
  _GUICtrlRichEdit_SetModified: {
    documentation: 'Sets or clears the modification flag',
    label: '_GUICtrlRichEdit_SetModified ( $hWnd [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** Specifies the new value for the modification flag:True - Indicates that the text has been modified (default)False - Indicates it has not been modified.',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaAlignment: {
    documentation:
      'Sets alignment of paragraph(s) in the current selection or, if no selection, of paragraphs inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetParaAlignment ( $hWnd, $sAlignment )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sAlignment',
        documentation:
          'values:    "l" - align with the left margin.    "r" - align with the right margin.    "c" - center between margins    "j" - justify between margins    "f" - justify between margins by only expanding spaces',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaAttributes: {
    documentation:
      'Sets attributes of paragraph(s) in the current selection or, if no selection, of paragraphs inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetParaAttributes ( $hWnd, $sStatesAndAtts )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sStatesAndAtts',
        documentation:
          'a string consisting of groups separated by semicolons ";".Each group consists of:First character - state:    + - turn attribute on    - - turn attribute off    "fpg" - force this/these paragraphs on to new page(s) (Initially off)    "hyp" - automatic hypthenation (Initially on)    "kpt" - keep this/these paragraph(s) together on a page (Initially off}    "kpn" - keep this/these paragraph(s) and the next together on a page (Initially off)    "pwo" - prevent widows and orphans, i.e. avoid a single line of this/these paragraphson a page (Initially off)    "r2l" - display text using right-to-left reading order (Initially off)    "row" - paragraph(s) is/are table row(s) (Initially off)    "sbs" - display paragraphs side by side (Initially off)    "sln" - suppress line numbers in documents or sections with line numbers (Initially off)',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaBorder: {
    documentation:
      'Sets the border of paragraph(s) in the current selection or, if no selection, of paragraphs inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetParaBorder ( $hWnd [, $sLocation = Default [, $vLineStyle = Default [, $sColor = Default [, $iSpace = Default]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sLocation',
        documentation:
          '**[optional]** a string consisting of any logical combination of:    l - left border    r - right border    t - top border    b - bottom border    i - inside border    o - outside border    or "" - no border (initial value)',
      },
      {
        label: '$vLineStyle',
        documentation:
          '**[optional]** line style - one of:    "none" - no line (initial value)    .75 - 3/4 point    1.5 - 1 1/2 points    2.25 - 2 1/4 points    3 - 3 points    4.5 - 4 1/2 points    6 - 6 points    ".75d" - 1/2 points, double    "1.5d" - 1 1/2 points, double    "2.25d" - 2 1/4 points, double    ".75g" - 3/4 point grey    ".75gd" - 3/4 point grey dashed',
      },
      {
        label: '$sColor',
        documentation:
          '**[optional]** one of:    "aut" - autocolor    "blk" - black (initial value)    "blu" - blue    "cyn" - cyan    "grn" - green    "mag" - magenta    "red" - red    "yel" - yellow    "whi" - white    "dbl" - dark blue    "dgn" - dark green    "dmg" - dark magenta    "drd" - dark red    "dyl" - dark yellow    "dgy" - dark grey    "lgy" - light grey',
      },
      {
        label: '$iSpace',
        documentation:
          '**[optional]** space between the border and the text (in space units) ( (initial value): 0)',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaIndents: {
    documentation:
      'Sets indents of paragraph(s) in the current selection or, if no selection, of paragraphs inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetParaIndents ( $hWnd [, $vLeft = Default [, $iRight = Default [, $iFirstLine = Default]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$vLeft',
        documentation:
          '**[optional]** indentation of left side of the body of the paragraph (in space units)    absolute - a number    relative to previous - a string - "+" or "-"',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** indentation of right side of the paragraph (in space units)',
      },
      {
        label: '$iFirstLine',
        documentation:
          '**[optional]** indentation of the first line relative to other lines (in space units)',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaNumbering: {
    documentation:
      'Sets numbering of paragraph(s) in the current selection or, if no selection, of paragraph(s) inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetParaNumbering ( $hWnd, $sStyle [, $iTextToNbrSpace = Default [, $bForceRoman = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sStyle',
        documentation:
          'a string specifying style and starting "number": e.g. "." (bullet), "1)","(b)", "C.", "iv", "V)"This is the "numbering" that will display for the first paragraph.Trailing spaces indicate the minimum spaces between the number and the paragraph unless $iTextToNbrSpace is enteredSpecial cases:    "=" - This paragraph is an unnumbered paragraph within the preceding list element    "" - removed the numbering from the selected paragraph(s)',
      },
      {
        label: '$iTextToNbrSpace',
        documentation:
          '**[optional]** space between number/bullet and paragraph (in space units)Default: number of trailing spaces times point size',
      },
      {
        label: '$bForceRoman',
        documentation:
          '**[optional]** False - i, v, x ... in $sStyle is letter i, v, x ... {Default)',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaShading: {
    documentation:
      'Sets the shading of paragraph(s) in the current selection or, if no selection, of paragraphs inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetParaShading ( $hWnd [, $iWeight = Default [, $sStyle = Default [, $sForeColor = Default [, $sBackColor = Default]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iWeight',
        documentation:
          '**[optional]** percent of foreground color, the rest being background color',
      },
      {
        label: '$sStyle',
        documentation:
          '**[optional]** shading style - a string containing one of the following:    non - none    dhz - dark horizontal    dvt - dark vertical    ddd - dark down diagonal    dud - dark up diagonal    dgr - dark grid    dtr - dark trellis    lhz - light horizontal    lvt - light vertical    ldd - light down diagonal    lud - light up diagonal    lgr - light grid    ltr - light trellis',
      },
      {
        label: '$sForeColor',
        documentation:
          '**[optional]** one of the following:    "blk" - black (initial value)    "blu" - blue    "cyn" - cyan    "grn" - green    "mag" - magenta    "red" - red    "yel" - yellow    "whi" - white    "dbl" - dark blue    "dgn" - dark green    "dmg" - dark magenta    "drd" - dark red    "dyl" - dark yellow    "dgy" - dark grey    "lgy" - light grey',
      },
      {
        label: '$sBackColor',
        documentation: '**[optional]** same values as for $sForeColor',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaSpacing: {
    documentation:
      'Sets paragraph spacing of paragraphs having selected text or, if none selected, sets it for text inserted at the insertion point',
    label:
      '_GUICtrlRichEdit_SetParaSpacing ( $hWnd [, $vInter = Default [, $iBefore = Default [, $iAfter = Default]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$vInter',
        documentation:
          '**[optional]** spacing between lines:either: a number - in space unitsor: " lines" - in lines',
      },
      {
        label: '$iBefore',
        documentation: '**[optional]** spacing before paragraph(s) (in space units)',
      },
      {
        label: '$iAfter',
        documentation: '**[optional]** spacing after paragraph(s) (in space units)',
      },
    ],
  },
  _GUICtrlRichEdit_SetParaTabStops: {
    documentation:
      'Sets tab stops of paragraphs having selected text or, if none selected, sets it for text inserted at the insertion point',
    label: '_GUICtrlRichEdit_SetParaTabStops ( $hWnd, $sTabStops )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sTabStops',
        documentation:
          'A string consisting of groups separated by ; (semicolon). Format of a group:absolute position of a tab stop (in space units)kind of tab    l - left tab    c - center tab    r - decimal tab    b - bar tabkind of dot leader    . - dotted leader    - - dashed leader    _ - underline leader    = - double line leader    t - thick-line leader    a space - no leader',
      },
    ],
  },
  _GUICtrlRichEdit_SetPasswordChar: {
    documentation:
      'Sets the characters to be displayed instead of those typed, or causes typed characters to show',
    label: '_GUICtrlRichEdit_SetPasswordChar ( $hWnd [, $sDisplayChar = "*"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sDisplayChar',
        documentation:
          '**[optional]** The character to be displayed in place of the characters typed by the user.Special value: "" - characters typed are displayed',
      },
    ],
  },
  _GUICtrlRichEdit_SetReadOnly: {
    documentation: 'Sets or removes the read-only state',
    label: '_GUICtrlRichEdit_SetReadOnly ( $hWnd [, $bState = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bState',
        documentation:
          '**[optional]** one of the following values:    True - Sets control to read-only (default)    False - Sets control to read-write',
      },
    ],
  },
  _GUICtrlRichEdit_SetRECT: {
    documentation: 'Sets the formatting rectangle of a Rich Edit control',
    label:
      '_GUICtrlRichEdit_SetRECT ( $hWnd [, $iLeft = Default [, $iTop = Default [, $iRight = Default [, $iBottom = Default [, $bRedraw = True]]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** Left position in dialog units',
      },
      {
        label: '$iTop',
        documentation: '**[optional]** Top position in dialog units',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** Right position in dialog units',
      },
      {
        label: '$iBottom',
        documentation: '**[optional]** Bottom position in dialog unit',
      },
      {
        label: '$bRedraw',
        documentation: '**[optional]** True to force redraw',
      },
    ],
  },
  _GUICtrlRichEdit_SetScrollPos: {
    documentation:
      'Scrolls the display such that ($ix,$iY) is in the upper left corner of the control',
    label: '_GUICtrlRichEdit_SetScrollPos ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'x coordinate (in pixels)',
      },
      {
        label: '$iY',
        documentation: 'y coordinate (in pixels)',
      },
    ],
  },
  _GUICtrlRichEdit_SetSel: {
    documentation: 'Sets the low and high character position of a selection',
    label: '_GUICtrlRichEdit_SetSel ( $hWnd, $iAnchor, $iActive [, $bHideSel = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iAnchor',
        documentation:
          'the character position of the first character to selectSpecial value: -1 - end of text',
      },
      {
        label: '$iActive',
        documentation:
          'the character position of the last character to selectSpecial value: -1 - end of text',
      },
      {
        label: '$bHideSel',
        documentation: '**[optional]** True to hide the selection',
      },
    ],
  },
  _GUICtrlRichEdit_SetSpaceUnit: {
    documentation:
      'Sets the unit of measure of horizontal and vertical space used in parameters of various _GUICtrlRichEdit functions',
    label: '_GUICtrlRichEdit_SetSpaceUnit ( $sUnit )',
    params: [
      {
        label: '$sUnit',
        documentation:
          '"in", "cm", "mm", "pt" (points), or "tw" (twips, 1/1440 inches, 1/567 centimeters)',
      },
    ],
  },
  _GUICtrlRichEdit_SetTabStops: {
    documentation: 'Sets tab stops for the control',
    label: '_GUICtrlRichEdit_SetTabStops ( $hWnd, $vTabStops [, $bRedraw = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'handle of control',
      },
      {
        label: '$VTabStops',
        documentation:
          'tab stop(s) to set in space units:If a string, semicolon-separated tab stop positionsIf numeric: set a tab stop every  space units',
      },
      {
        label: '$bRedraw',
        documentation: '**[optional]** whether to redraw the control - True (default) or False',
      },
    ],
  },
  _GUICtrlRichEdit_SetText: {
    documentation: 'Sets the text of a control',
    label: '_GUICtrlRichEdit_SetText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'Plain or RTF text to put into the control',
      },
    ],
  },
  _GUICtrlRichEdit_SetUndoLimit: {
    documentation: 'Sets the maximum number of actions that can stored in the undo queue',
    label: '_GUICtrlRichEdit_SetUndoLimit ( $hWnd, $iLimit )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iLimit',
        documentation: 'the maximum number of actions that can be stored in the undo queue',
      },
    ],
  },
  _GUICtrlRichEdit_SetZoom: {
    documentation: 'Sets zoom level of the control',
    label: '_GUICtrlRichEdit_SetZoom ( $hWnd, $iPercent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$iPercent',
        documentation: 'percentage zoomvalues: 100 and 200 to 6400',
      },
    ],
  },
  _GUICtrlRichEdit_StreamFromFile: {
    documentation: 'Sets text in a control from a file',
    label: '_GUICtrlRichEdit_StreamFromFile ( $hWnd, $sFileSpec )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sFileSpec',
        documentation: 'file specification',
      },
    ],
  },
  _GUICtrlRichEdit_StreamFromVar: {
    documentation: 'Sets text in a control from a variable',
    label: '_GUICtrlRichEdit_StreamFromVar ( $hWnd, $sVar )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sVar',
        documentation: 'a string',
      },
    ],
  },
  _GUICtrlRichEdit_StreamToFile: {
    documentation: 'Writes contents of a control to a file',
    label:
      '_GUICtrlRichEdit_StreamToFile ( $hWnd, $sFileSpec [, $bIncludeCOM = True [, $iOpts = 0 [, $iCodePage = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$sFileSpec',
        documentation: 'file specification',
      },
      {
        label: '$bIncludeCOM',
        documentation:
          '**[optional]** True (default):    If writing to a .rtf file, includes any COM objects (space consuming)    If writing to any other file, writes a text represntation of COM objectsFalse: Writes spaces instead of COM objects',
      },
      {
        label: '$iOpts',
        documentation:
          '**[optional]** additional options: (default: 0)    $SFF_PLAINRTF - write only rich text keywords common to all languages    $SF_UNICODE - write Unicode',
      },
      {
        label: '$iCodePage',
        documentation: '**[optional]** Generate UTF-8 and text using this code pageDefault: do not',
      },
    ],
  },
  _GUICtrlRichEdit_StreamToVar: {
    documentation: 'Writes contents of a control to a variable',
    label:
      '_GUICtrlRichEdit_StreamToVar ( $hWnd [, $bRtf = True [, $bIncludeCOM = True [, $iOpts = 0 [, $iCodePage = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
      {
        label: '$bRtf',
        documentation:
          '**[optional]** True - write Rich Text Format (RTF) (Default)False - write only text',
      },
      {
        label: '$bIncludeCOM',
        documentation:
          '**[optional]** True (default):    If writing RTF, include any COM objects (space consuming)    If writing only text, write a text represntation of COM objectsFalse: Write spaces instead of COM objects',
      },
      {
        label: '$iOpts',
        documentation:
          '**[optional]** additional options:    $SFF_PLAINRTF - write only rich text keywords common to all languages    $SF_UNICODE - write Unicode',
      },
      {
        label: '$iCodePage',
        documentation: '**[optional]** Generate UTF-8 and text using this code pageDefault: do not',
      },
    ],
  },
  _GUICtrlRichEdit_Undo: {
    documentation: "Undoes the last edit control operation in the control's undo queue",
    label: '_GUICtrlRichEdit_Undo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
