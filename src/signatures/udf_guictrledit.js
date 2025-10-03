import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <GUICtrlEdit.au3>`)';

const signatures = {
  _GUICtrlEdit_AppendText: {
    documentation: 'Append text',
    label: '_GUICtrlEdit_AppendText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to append',
      },
    ],
  },
  _GUICtrlEdit_BeginUpdate: {
    documentation:
      'Prevents updating of the control until the _GUICtrlEdit_EndUpdate function is called',
    label: '_GUICtrlEdit_BeginUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_CanUndo: {
    documentation: "Determines whether there are any actions in an edit control's undo queue",
    label: '_GUICtrlEdit_CanUndo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_CharFromPos: {
    documentation:
      'Retrieve information about the character closest to a specified point in the client area',
    label: '_GUICtrlEdit_CharFromPos ( $hWnd, $iX, $iY )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iX',
        documentation: 'horizontal position',
      },
      {
        label: '$iY',
        documentation: 'vertical position',
      },
    ],
  },
  _GUICtrlEdit_Create: {
    documentation: 'Create an Edit control',
    label:
      '_GUICtrlEdit_Create ( $hWnd, $sText, $iX, $iY [, $iWidth = 150 [, $iHeight = 150 [, $iStyle = 0x003010C4 [, $iExStyle = 0x00000200]]]] )',
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
        label: '$iX',
        documentation: 'Horizontal position of the control',
      },
      {
        label: '$iY',
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
          '**[optional]** Control styles:    $ES_AUTOHSCROLL - Automatically scrolls text to the right by 10 characters when the user types a character at the end of the line.    $ES_AUTOVSCROLL - Automatically scrolls text up one page when the user presses the ENTER key on the last line.    $ES_CENTER - Centers text in an edit control.    $ES_LEFT - Aligns text with the left margin.    $ES_LOWERCASE - Converts all characters to lowercase as they are typed into the edit control.    $ES_MULTILINE - Designates a multiline edit control.    $ES_NOHIDESEL - The selected text is inverted, even if the control does not have the focus.    $ES_NUMBER - Allows only digits to be entered into the edit control.    $ES_OEMCONVERT - Converts text entered in the edit control.    $ES_READONLY - Prevents the user from typing or editing text in the edit control.    $ES_RIGHT - Right-aligns text edit control.    $ES_UPPERCASE - Converts all characters to uppercase as they are typed into the edit control.    $ES_WANTRETURN - Specifies that a carriage return be inserted when the user presses the ENTER key.    $ES_PASSWORD - Displays an asterisk (*) for each character that is typed into the edit controlDefault: $ES_MULTILINE, $ES_WANTRETURN, $WS_VSCROLL, $WS_HSCROLL, $ES_AUTOVSCROLL, $ES_AUTOHSCROLLForced : WS_CHILD, $WS_VISIBLE, $WS_TABSTOP only if not using $ES_READONLY',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** Control extended style. These correspond to the standard $WS_EX_* constants. See Extended Style Table.',
      },
    ],
  },
  _GUICtrlEdit_Destroy: {
    documentation: 'Delete the Edit control',
    label: '_GUICtrlEdit_Destroy ( ByRef $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_EmptyUndoBuffer: {
    documentation: 'Resets the undo flag of an edit control',
    label: '_GUICtrlEdit_EmptyUndoBuffer ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_EndUpdate: {
    documentation:
      'Enables screen repainting that was turned off with the _GUICtrlEdit_BeginUpdate function',
    label: '_GUICtrlEdit_EndUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_Find: {
    documentation: 'Initiates a find dialog',
    label: '_GUICtrlEdit_Find ( $hWnd [, $bReplace = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bReplace',
        documentation:
          '**[optional]** Replace Option:    True - Show option    False - Hide option',
      },
    ],
  },
  _GUICtrlEdit_FmtLines: {
    documentation: 'Determines whether an edit control includes soft line-break characters',
    label: '_GUICtrlEdit_FmtLines ( $hWnd [, $bSoftBreak = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bSoftBreak',
        documentation:
          '**[optional]** Specifies whether soft line-break characters are to be inserted:    True - Inserts the characters    False - Removes them',
      },
    ],
  },
  _GUICtrlEdit_GetCueBanner: {
    documentation: 'Gets the cue banner text displayed in the edit control',
    label: '_GUICtrlEdit_GetCueBanner ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetFirstVisibleLine: {
    documentation:
      'Retrieves the 0-based index of the uppermost visible line in a multiline edit control',
    label: '_GUICtrlEdit_GetFirstVisibleLine ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetLimitText: {
    documentation: 'Gets the current text limit for an edit control',
    label: '_GUICtrlEdit_GetLimitText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetLine: {
    documentation: 'Retrieves a line of text from an edit control',
    label: '_GUICtrlEdit_GetLine ( $hWnd, $iLine )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLine',
        documentation: '0-based line index to get',
      },
    ],
  },
  _GUICtrlEdit_GetLineCount: {
    documentation: 'Retrieves the number of lines',
    label: '_GUICtrlEdit_GetLineCount ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetMargins: {
    documentation: 'Retrieves the widths of the left and right margins',
    label: '_GUICtrlEdit_GetMargins ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetModify: {
    documentation: "Retrieves the state of an edit control's modification flag",
    label: '_GUICtrlEdit_GetModify ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetPasswordChar: {
    documentation:
      'Gets the password character that an edit control displays when the user enters text',
    label: '_GUICtrlEdit_GetPasswordChar ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetRECT: {
    documentation: 'Retrieves the formatting rectangle of an edit control',
    label: '_GUICtrlEdit_GetRECT ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetRECTEx: {
    documentation: 'Retrieves the formatting rectangle of an edit control',
    label: '_GUICtrlEdit_GetRECTEx ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetSel: {
    documentation: 'Retrieves the starting and ending character positions of the current selection',
    label: '_GUICtrlEdit_GetSel ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetText: {
    documentation: 'Get the text from the edit control',
    label: '_GUICtrlEdit_GetText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_GetTextLen: {
    documentation: 'Get the length of all the text from the edit control',
    label: '_GUICtrlEdit_GetTextLen ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_HideBalloonTip: {
    documentation: 'Hides any balloon tip associated with an edit control',
    label: '_GUICtrlEdit_HideBalloonTip ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
  _GUICtrlEdit_InsertText: {
    documentation: 'Insert text',
    label: '_GUICtrlEdit_InsertText ( $hWnd, $sText [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to insert',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Character position to insert',
      },
    ],
  },
  _GUICtrlEdit_LineFromChar: {
    documentation: 'Retrieves the index of the line that contains the specified character index',
    label: '_GUICtrlEdit_LineFromChar ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** The character index of the character contained in the line whose number is to be retrieved',
      },
    ],
  },
  _GUICtrlEdit_LineIndex: {
    documentation: 'Retrieves the character index of the first character of a specified line',
    label: '_GUICtrlEdit_LineIndex ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** Specifies the 0-based line number',
      },
    ],
  },
  _GUICtrlEdit_LineLength: {
    documentation: 'Retrieves the length, in characters, of a line',
    label: '_GUICtrlEdit_LineLength ( $hWnd [, $iIndex = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation:
          '**[optional]** Specifies the 0-based line index of the line whose length is to be retrieved',
      },
    ],
  },
  _GUICtrlEdit_LineScroll: {
    documentation: 'Scrolls the text',
    label: '_GUICtrlEdit_LineScroll ( $hWnd, $iHoriz, $iVert )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iHoriz',
        documentation: 'Specifies the number of characters to scroll horizontally.',
      },
      {
        label: '$iVert',
        documentation: 'Specifies the number of lines to scroll vertically.',
      },
    ],
  },
  _GUICtrlEdit_PosFromChar: {
    documentation:
      'Retrieves the client area coordinates of a specified character in an edit control',
    label: '_GUICtrlEdit_PosFromChar ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iIndex',
        documentation: 'The 0-based index of the character',
      },
    ],
  },
  _GUICtrlEdit_ReplaceSel: {
    documentation: 'Replaces the current selection',
    label: '_GUICtrlEdit_ReplaceSel ( $hWnd, $sText [, $bUndo = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String containing the replacement text.',
      },
      {
        label: '$bUndo',
        documentation:
          '**[optional]** Specifies whether the replacement operation can be undone:    True - The operation can be undone.    False - The operation cannot be undone.',
      },
    ],
  },
  _GUICtrlEdit_Scroll: {
    documentation: 'Scrolls the text vertically',
    label: '_GUICtrlEdit_Scroll ( $hWnd, $iDirection )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iDirection',
        documentation:
          'This parameter can be one of the following values:    $SB_LINEDOWN - Scrolls down one line    $SB_LINEUP - Scrolls up one line    $SB_PAGEDOWN - Scrolls down one page    $SB_PAGEUP - Scrolls up one page    $SB_SCROLLCARET - Scrolls the caret into view',
      },
    ],
  },
  _GUICtrlEdit_SetCueBanner: {
    documentation: 'Sets the cue banner text that is displayed for the edit control',
    label: '_GUICtrlEdit_SetCueBanner ( $hWnd, $sText [, $bOnFocus = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String that contains the text',
      },
      {
        label: '$bOnFocus',
        documentation:
          '**[optional]** True - if the cue banner should show even when the edit control has focus.False (Default) - the cue banner disappears when the user clicks in the control.',
      },
    ],
  },
  _GUICtrlEdit_SetLimitText: {
    documentation: 'Sets the text limit',
    label: '_GUICtrlEdit_SetLimitText ( $hWnd, $iLimit )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iLimit',
        documentation: 'The maximum number of TCHARs the user can enter',
      },
    ],
  },
  _GUICtrlEdit_SetMargins: {
    documentation: 'Sets the widths of the left and right margins',
    label:
      '_GUICtrlEdit_SetMargins ( $hWnd [, $iMargin = 0x1 [, $iLeft = 0xFFFF [, $iRight = 0xFFFF]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iMargin',
        documentation:
          '**[optional]** Can be one or more of the following    $EC_LEFTMARGIN - Sets the left margin    $EC_RIGHTMARGIN - Sets the right marginDefault: $EC_LEFTMARGIN',
      },
      {
        label: '$iLeft',
        documentation: '**[optional]** The new width of the left marginDefault: $EC_USEFONTINFO',
      },
      {
        label: '$iRight',
        documentation: '**[optional]** The new width of the right marginDefault: $EC_USEFONTINFO',
      },
    ],
  },
  _GUICtrlEdit_SetModify: {
    documentation: 'Sets or clears the modification flag',
    label: '_GUICtrlEdit_SetModify ( $hWnd, $bModified )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bModified',
        documentation:
          'Specifies the new value for the modification flag:    True - Indicates the text has been modified.    False - Indicates it has not been modified.',
      },
    ],
  },
  _GUICtrlEdit_SetPasswordChar: {
    documentation: 'Sets or removes the password character for an edit control',
    label: '_GUICtrlEdit_SetPasswordChar ( $hWnd [, $sDisplayChar = "0"] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sDisplayChar',
        documentation:
          '**[optional]** The character to be displayed in place of the characters typed by the userIf this parameter is zero, the control removes the current password character and displays the characters typed by the user',
      },
    ],
  },
  _GUICtrlEdit_SetReadOnly: {
    documentation: 'Sets or removes the read-only style ($ES_READONLY)',
    label: '_GUICtrlEdit_SetReadOnly ( $hWnd, $bReadOnly )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$bReadOnly',
        documentation:
          'Following values:    True - Sets the $ES_READONLY style    False - Removes the $ES_READONLY style',
      },
    ],
  },
  _GUICtrlEdit_SetRECT: {
    documentation: 'Sets the formatting rectangle of a multiline edit control',
    label: '_GUICtrlEdit_SetRECT ( $hWnd, $aRect )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aRect',
        documentation:
          'Array in the following format:[0] - Specifies the x-coordinate of the upper-left corner of the rectangle.[1] - Specifies the y-coordinate of the upper-left corner of the rectangle.[2] - Specifies the x-coordinate of the lower-right corner of the rectangle.[3] - Specifies the y-coordinate of the lower-right corner of the rectangle.',
      },
    ],
  },
  _GUICtrlEdit_SetRECTEx: {
    documentation: 'Sets the formatting rectangle of a multiline edit control',
    label: '_GUICtrlEdit_SetRECTEx ( $hWnd, $tRECT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains formatting rectangle of an edit control',
      },
    ],
  },
  _GUICtrlEdit_SetRECTNP: {
    documentation: 'Sets the formatting rectangle of a multiline edit control',
    label: '_GUICtrlEdit_SetRECTNP ( $hWnd, $aRect )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aRect',
        documentation:
          'Array in the following format:[0] - Specifies the x-coordinate of the upper-left corner of the rectangle.[1] - Specifies the y-coordinate of the upper-left corner of the rectangle.[2] - Specifies the x-coordinate of the lower-right corner of the rectangle.[3] - Specifies the y-coordinate of the lower-right corner of the rectangle.',
      },
    ],
  },
  _GUICtrlEdit_SetRectNPEx: {
    documentation: 'Sets the formatting rectangle of a multiline edit control',
    label: '_GUICtrlEdit_SetRectNPEx ( $hWnd, $tRECT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains formatting rectangle of an edit control',
      },
    ],
  },
  _GUICtrlEdit_SetSel: {
    documentation: 'Selects a range of characters',
    label: '_GUICtrlEdit_SetSel ( $hWnd, $iStart, $iEnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$iStart',
        documentation: 'Specifies the starting character position of the selection.',
      },
      {
        label: '$iEnd',
        documentation: 'Specifies the ending character position of the selection.',
      },
    ],
  },
  _GUICtrlEdit_SetTabStops: {
    documentation: 'Sets the tab stops',
    label: '_GUICtrlEdit_SetTabStops ( $hWnd, $aTabStops )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$aTabStops',
        documentation:
          'Array of tab stops in the following format:[0] - Tab stop 1[2] - Tab stop 2[n] - Tab stop n',
      },
    ],
  },
  _GUICtrlEdit_SetText: {
    documentation: 'Set the text',
    label: '_GUICtrlEdit_SetText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sText',
        documentation: 'String to place in edit control',
      },
    ],
  },
  _GUICtrlEdit_ShowBalloonTip: {
    documentation: 'Displays a balloon tip associated with an edit control',
    label: '_GUICtrlEdit_ShowBalloonTip ( $hWnd, $sTitle, $sText, $iIcon )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
      {
        label: '$sTitle',
        documentation: 'String for title of ToolTip (Unicode)',
      },
      {
        label: '$sText',
        documentation: 'String for text of ToolTip (Unicode)',
      },
      {
        label: '$iIcon',
        documentation:
          'Icon can be one of the following:    $TTI_ERROR - Use the error icon    $TTI_INFO - Use the information icon    $TTI_NONE - Use no icon    $TTI_WARNING - Use the warning iconThe following for Windows Vista or later    $TTI_ERROR_LARGE - Use the error icon    $TTI_INFO_LARGE - Use the information icon    $TTI_WARNING_LARGE - Use the warning icon',
      },
    ],
  },
  _GUICtrlEdit_Undo: {
    documentation: "Undoes the last edit control operation in the control's undo queue",
    label: '_GUICtrlEdit_Undo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Control ID/Handle to the control',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
