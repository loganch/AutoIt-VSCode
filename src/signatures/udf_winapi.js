import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <WinAPI.au3>`)';

const signatures = {
  _WinAPI_AddIconOverlay: {
    documentation: 'Creates an icon by merging the source icon and overlay mask',
    label: '_WinAPI_AddIconOverlay ( $hIcon, $hOverlay )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the source icon.',
      },
      {
        label: '$hOverlay',
        documentation: 'Handle to the icon to use as an overlay mask.',
      },
    ],
  },
  _WinAPI_AttachConsole: {
    documentation: 'Attaches the calling process to the console of the specified process',
    label: '_WinAPI_AttachConsole ( [$iPID = -1] )',
    params: [
      {
        label: '$iPID',
        documentation:
          '**[optional]** Identifier of the process. Set to -1 to attach to the current process.',
      },
    ],
  },
  _WinAPI_AttachThreadInput: {
    documentation:
      'Attaches the input processing mechanism of one thread to that of another thread',
    label: '_WinAPI_AttachThreadInput ( $iAttach, $iAttachTo, $bAttach )',
    params: [
      {
        label: '$iAttach',
        documentation: 'Identifier of the thread to be attached to another thread',
      },
      {
        label: '$iAttachTo',
        documentation: 'Identifier of the thread to be attached to',
      },
      {
        label: '$bAttach',
        documentation:
          'Attachment mode:    True - The threads are attached    False - The threads are detached',
      },
    ],
  },
  _WinAPI_Beep: {
    documentation: 'Generates simple tones on the speaker',
    label: '_WinAPI_Beep ( [$iFreq = 500 [, $iDuration = 1000]] )',
    params: [
      {
        label: '$iFreq',
        documentation:
          '**[optional]** The frequency of the sound, in hertz. This parameter must be in the range 37 through 32,767.',
      },
      {
        label: '$iDuration',
        documentation:
          '**[optional]** The duration of the sound, in milliseconds. Windows Me/98/95: This parameter is ignored.',
      },
    ],
  },
  _WinAPI_BitBlt: {
    documentation: 'Performs a bit-block transfer of color data',
    label:
      '_WinAPI_BitBlt ( $hDestDC, $iXDest, $iYDest, $iWidth, $iHeight, $hSrcDC, $iXSrc, $iYSrc, $iROP )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context',
      },
      {
        label: '$iXDest',
        documentation: 'X value of the upper-left corner of the destination rectangle',
      },
      {
        label: '$iYDest',
        documentation: 'Y value of the upper-left corner of the destination rectangle',
      },
      {
        label: '$iWidth',
        documentation: 'Width of the source and destination rectangles',
      },
      {
        label: '$iHeight',
        documentation: 'Height of the source and destination rectangles',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context',
      },
      {
        label: '$iXSrc',
        documentation: 'X value of the upper-left corner of the source rectangle',
      },
      {
        label: '$iYSrc',
        documentation: 'Y value of the upper-left corner of the source rectangle',
      },
      {
        label: '$iROP',
        documentation:
          'Specifies a raster operation code. These codes define how the color data for the source rectangle is to be combined with the color data for the destination rectangle to achieve the final color:$BLACKNESS - Fills the destination rectangle using the color associated with palette index 0$CAPTUREBLT - Includes any window that are layered on top of your window in the resulting image$DSTINVERT - Inverts the destination rectangle$MERGECOPY - Merges the color of the source rectangle with the brush currently selected in hDest, by using the AND operator.$MERGEPAINT - Merges the color of the inverted source rectangle with the colors of the destination rectangle by using the OR operator.$NOMIRRORBITMAP - Prevents the bitmap from being mirrored$NOTSRCCOPY - Copies the inverted source rectangle to the destination$NOTSRCERASE - Combines the colors of the source and destination rectangles by using the OR operator and then inverts the resultant color.$PATCOPY - Copies the brush selected in hdcDest, into the destination bitmap$PATINVERT - Combines the colors of the brush currently selected in hDest, with the colors of the destination rectangle by using the XOR operator.$PATPAINT - Combines the colors of the brush currently selected in hDest, with the colors of the inverted source rectangle by using the OR operator. The result of this operation is combined with the color of the destination rectangle by using the OR operator.$SRCAND - Combines the colors of the source and destination rectangles by using the AND operator$SRCCOPY - Copies the source rectangle directly to the destination rectangle$SRCERASE - Combines the inverted color of the destination rectangle with the colors of the source rectangle by using the AND operator.$SRCINVERT - Combines the colors of the source and destination rectangles by using the XOR operator$SRCPAINT - Combines the colors of the source and destination rectangles by using the OR operator$WHITENESS - Fills the destination rectangle using the color associated with index 1 in the physical palette.',
      },
    ],
  },
  _WinAPI_CallNextHookEx: {
    documentation:
      'Passes the hook information to the next hook procedure in the current hook chain',
    label: '_WinAPI_CallNextHookEx ( $hHook, $iCode, $wParam, $lParam )',
    params: [
      {
        label: '$hHook',
        documentation: 'Parameter ignored.',
      },
      {
        label: '$iCode',
        documentation:
          'Specifies the hook code passed to the current hook procedure. The next hook procedure uses this code to determine how to process the hook information',
      },
      {
        label: '$wParam',
        documentation:
          'Specifies the wParam value passed to the current hook procedure.The meaning of this parameter depends on the type of hook associated with the current hook chain',
      },
      {
        label: '$lParam',
        documentation:
          'Specifies the lParam value passed to the current hook procedure.The meaning of this parameter depends on the type of hook associated with the current hook chain',
      },
    ],
  },
  _WinAPI_CallWindowProc: {
    documentation:
      'Passes the hook information to the next hook procedure in the current hook chain',
    label: '_WinAPI_CallWindowProc ( $pPrevWndFunc, $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$pPrevWndFunc',
        documentation:
          'Pointer to the previous window procedure.If this value is obtained by calling the _WinAPI_GetWindowLong() function with the $iIndex parameter set to $GWL_WNDPROC or $DWL_DLGPROC, it is actually either the address of a window or dialog box procedure, or a special internal value meaningful only to _WinAPI_CallWindowProc().',
      },
      {
        label: '$hWnd',
        documentation: 'Handle to the window procedure to receive the message',
      },
      {
        label: '$iMsg',
        documentation: 'Specifies the message',
      },
      {
        label: '$wParam',
        documentation:
          'Specifies additional message-specific information. The contents of this parameter depend on the value of the Msg parameter',
      },
      {
        label: '$lParam',
        documentation:
          'Specifies additional message-specific information. The contents of this parameter depend on the value of the Msg parameter',
      },
    ],
  },
  _WinAPI_ClientToScreen: {
    documentation: 'Converts the client coordinates of a specified point to screen coordinates',
    label: '_WinAPI_ClientToScreen ( $hWnd, ByRef $tPoint )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Identifies the window that will be used for the conversion',
      },
      {
        label: '$tPoint',
        documentation: '$tagPOINT structure that contains the client coordinates to be converted',
      },
    ],
  },
  _WinAPI_CloseHandle: {
    documentation: 'Closes an open object handle',
    label: '_WinAPI_CloseHandle ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle of object to close',
      },
    ],
  },
  _WinAPI_CombineRgn: {
    documentation: 'Combines two regions and stores the result in a third region',
    label: '_WinAPI_CombineRgn ( $hRgnDest, $hRgnSrc1, $hRgnSrc2, $iCombineMode )',
    params: [
      {
        label: '$hRgnDest',
        documentation:
          'Handle to a new region with dimensions defined by combining two other regions. (This region must exist before CombineRgn is called.)',
      },
      {
        label: '$hRgnSrc1',
        documentation: 'Handle to the first of two regions to be combined.',
      },
      {
        label: '$hRgnSrc2',
        documentation: 'Handle to the second of two regions to be combined.',
      },
      {
        label: '$iCombineMode',
        documentation:
          'Specifies a mode indicating how the two regions will be combined. This parameter can be one of the following values.$RGN_AND - Creates the intersection of the two combined regions.$RGN_COPY - Creates a copy of the region identified by $hRgnSrc1.$RGN_DIFF - Combines the parts of $hRgnSrc1 that are not part of $hRgnSrc2.$RGN_OR - Creates the union of two combined regions.$RGN_XOR - Creates the union of two combined regions except for any overlapping areas.',
      },
    ],
  },
  _WinAPI_CommDlgExtendedError: {
    documentation:
      'Returns a common dialog box error string. This string indicates the most recent error to occur during the execution of one of the common dialog box functions',
    label: '_WinAPI_CommDlgExtendedError (  )',
    params: [],
  },
  _WinAPI_CopyIcon: {
    documentation: 'Copies the specified icon from another module',
    label: '_WinAPI_CopyIcon ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to be copied',
      },
    ],
  },
  _WinAPI_CreateBitmap: {
    documentation: 'Creates a bitmap with the specified width, height, and color format',
    label:
      '_WinAPI_CreateBitmap ( $iWidth, $iHeight [, $iPlanes = 1 [, $iBitsPerPel = 1 [, $pBits = 0]]] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'Specifies the bitmap width, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'Specifies the bitmap height, in pixels',
      },
      {
        label: '$iPlanes',
        documentation: '**[optional]** Specifies the number of color planes used by the device',
      },
      {
        label: '$iBitsPerPel',
        documentation:
          '**[optional]** Specifies the number of bits required to identify the color of a single pixel',
      },
      {
        label: '$pBits',
        documentation:
          '**[optional]** Pointer to an array of color data used to set the colors in a rectangle of pixels.Each scan line in the rectangle must be word aligned (scan lines that are not word aligned must be padded with zeros).If this parameter is 0, the contents of the new bitmap is undefined.',
      },
    ],
  },
  _WinAPI_CreateCompatibleBitmap: {
    documentation: 'Creates a bitmap compatible with the specified device context',
    label: '_WinAPI_CreateCompatibleBitmap ( $hDC, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies a device context',
      },
      {
        label: '$iWidth',
        documentation: 'Specifies the bitmap width, in pixels',
      },
      {
        label: '$iHeight',
        documentation: 'Specifies the bitmap height, in pixels',
      },
    ],
  },
  _WinAPI_CreateCompatibleDC: {
    documentation: 'Creates a memory device context compatible with the specified device',
    label: '_WinAPI_CreateCompatibleDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation:
          "Handle to an existing DC. If this handle is 0, the function creates a memory DC compatible with the application's current screen.",
      },
    ],
  },
  _WinAPI_CreateEvent: {
    documentation: 'Creates or opens a named or unnamed event object',
    label:
      '_WinAPI_CreateEvent ( [$tAttributes = 0 [, $bManualReset = True [, $bInitialState = True [, $sName = ""]]]] )',
    params: [
      {
        label: '$tAttributes',
        documentation:
          '**[optional]** a $tagSECURITY_ATTRIBUTES structure or a pointer to it. If 0, the handle cannot be inherited by child processes.The Descriptor member of the structure specifies a security descriptor for the new event.If $tAttributes is 0, the event gets a default security descriptor.The ACLs in the default security descriptor for an event come from the primary or impersonation token of the creator.',
      },
      {
        label: '$bManualReset',
        documentation:
          '**[optional]** If True, the function creates a manual-reset event object, which requires the use of the ResetEvent function to set the event state to nonsignaled.If False, the function creates an auto-reset event object and system automatically resets the event state to nonsignaled after a single waiting thread has been released.',
      },
      {
        label: '$bInitialState',
        documentation:
          '**[optional]** If True, the initial state of the event object is signaled; otherwise, it is nonsignaled',
      },
      {
        label: '$sName',
        documentation:
          '**[optional]** The name of the event object. Name comparison is case sensitive.If $sName matches the name of an existing named event object, this function requests the EVENT_ALL_ACCESS access right.In this case the $bManualReset and $bInitialState parameters are ignored because they have already been set by the creating process.If the $tAttributes parameter is not 0, it determines whether the handle can be inherited, but its security-descriptor member is ignored.If Name is blank, the event object is created without a name.',
      },
    ],
  },
  _WinAPI_CreateFile: {
    documentation: 'Creates or opens a file or other device',
    label:
      '_WinAPI_CreateFile ( $sFileName, $iCreation [, $iAccess = 4 [, $iShare = 0 [, $iAttributes = 0 [, $tSecurity = 0]]]] )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Name of an object to create or open',
      },
      {
        label: '$iCreation',
        documentation:
          'Action to take on files that exist and do not exist:    0 - Creates a new file. The function fails if the file exists    1 - Creates a new file. If a file exists, it is overwritten    2 - Opens a file. The function fails if the file does not exist    3 - Opens a file. If the file does not exist, the function creates the file    4 - Opens a file and truncates it so that its size is 0 bytes. The function fails if the file does not exist.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** Access to the object:    1 - Execute    2 - Read    4 - Write',
      },
      {
        label: '$iShare',
        documentation:
          '**[optional]** Sharing mode of an object:    1 - Delete    2 - Read    4 - Write',
      },
      {
        label: '$iAttributes',
        documentation:
          '**[optional]** The file attributes:    1 - File should be archived    2 - File is hidden    4 - File is read only    8 - File is part of or used exclusively by an operating system.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** a $tagSECURITY_ATTRIBUTES structure or a pointer to it that determines if the returned handle can be inherited by child processes.If $tSecurity is 0, the handle cannot be inherited.',
      },
    ],
  },
  _WinAPI_CreateFont: {
    documentation: 'Creates a logical font with the specified characteristics',
    label:
      "_WinAPI_CreateFont ( $iHeight, $iWidth [, $iEscape = 0 [, $iOrientn = 0 [, $iWeight = $FW_NORMAL [, $bItalic = False [, $bUnderline = False [, $bStrikeout = False [, $iCharset = $DEFAULT_CHARSET [, $iOutputPrec = $OUT_DEFAULT_PRECIS [, $iClipPrec = $CLIP_DEFAULT_PRECIS [, $iQuality = $DEFAULT_QUALITY [, $iPitch = 0 [, $sFace = 'Arial']]]]]]]]]]]] )",
    params: [
      {
        label: '$iHeight',
        documentation: 'height of font',
      },
      {
        label: '$iWidth',
        documentation: 'average character width',
      },
      {
        label: '$iEscape',
        documentation: '**[optional]** angle of escapement',
      },
      {
        label: '$iOrientn',
        documentation: '**[optional]** base-line orientation angle',
      },
      {
        label: '$iWeight',
        documentation:
          '**[optional]** font weight, The following values are defined for convenience:$FW_DONTCARE - 0$FW_THIN - 100$FW_EXTRALIGHT - 200$FW_LIGHT - 300$FW_NORMAL - 400$FW_MEDIUM - 500$FW_SEMIBOLD - 600$FW_BOLD - 700$FW_EXTRABOLD - 800$FW_HEAVY - 900',
      },
      {
        label: '$bItalic',
        documentation: '**[optional]** italic attribute option',
      },
      {
        label: '$bUnderline',
        documentation: '**[optional]** underline attribute option',
      },
      {
        label: '$bStrikeout',
        documentation: '**[optional]** strikeout attribute option',
      },
      {
        label: '$iCharset',
        documentation:
          '**[optional]** Specifies the character set. The following values are predefined:$ANSI_CHARSET - 0$BALTIC_CHARSET - 186$CHINESEBIG5_CHARSET - 136$DEFAULT_CHARSET - 1$EASTEUROPE_CHARSET - 238$GB2312_CHARSET - 134$GREEK_CHARSET - 161$HANGEUL_CHARSET - 129$MAC_CHARSET - 77$OEM_CHARSET - 255$RUSSIAN_CHARSET - 204$SHIFTJIS_CHARSET - 128$SYMBOL_CHARSET - 2$TURKISH_CHARSET - 162$VIETNAMESE_CHARSET - 163',
      },
      {
        label: '$iOutputPrec',
        documentation:
          '**[optional]** Specifies the output precision, It can be one of the following values:$OUT_CHARACTER_PRECIS - Not used$OUT_DEFAULT_PRECIS - Specifies the default font mapper behavior$OUT_DEVICE_PRECIS - Instructs the font mapper to choose a Device font when the system contains multiple fonts with the same name$OUT_OUTLINE_PRECIS - This value instructs the font mapper to choose from TrueType and other outline-based fonts$OUT_PS_ONLY_PRECIS - Instructs the font mapper to choose from only PostScript fonts.If there are no PostScript fonts installed in the system, the font mapper returns to default behavior$OUT_RASTER_PRECIS - Instructs the font mapper to choose a raster font when the system contains multiple fonts with the same name$OUT_STRING_PRECIS - This value is not used by the font mapper, but it is returned when raster fonts are enumerated$OUT_STROKE_PRECIS - This value is not used by the font mapper, but it is returned when TrueType, other outline-based fonts, and vector fonts are enumerated$OUT_TT_ONLY_PRECIS - Instructs the font mapper to choose from only TrueType fonts. If there are no TrueType fonts installed in the system, the font mapper returns to default behavior$OUT_TT_PRECIS - Instructs the font mapper to choose a TrueType font when the system contains multiple fonts with the same name',
      },
      {
        label: '$iClipPrec',
        documentation:
          '**[optional]** Specifies the clipping precision, It can be one or more of the following values:$CLIP_CHARACTER_PRECIS - Not used$CLIP_DEFAULT_PRECIS - Specifies default clipping behavior$CLIP_EMBEDDED - You must specify this flag to use an embedded read-only font$CLIP_LH_ANGLES - When this value is used, the rotation for all fonts depends on whether the orientation of the coordinate system is left-handed or right-handed.If not used, device fonts always rotate counterclockwise, but the rotation of other fonts is dependent on the orientation of the coordinate system.$CLIP_MASK - Not used$CLIP_STROKE_PRECIS - Not used by the font mapper, but is returned when raster, vector, or TrueType fonts are enumeratedFor compatibility, this value is always returned when enumerating fonts$CLIP_TT_ALWAYS - Not used',
      },
      {
        label: '$iQuality',
        documentation:
          '**[optional]** Specifies the output quality, It can be one of the following values:$ANTIALIASED_QUALITY - Font is antialiased, or smoothed, if the font supports it and the size of the font is not too small or too large.In addition, you must select a TrueType font into a screen DC prior to using it in a DIBSection, otherwise antialiasing does not happen$DEFAULT_QUALITY - Appearance of the font does not matter$DRAFT_QUALITY - Appearance of the font is less important than when the PROOF_QUALITY value is used.For GDI raster fonts, scaling is enabled, which means that more font sizes are available, but the quality may be lower.Bold, italic, underline, and strikeout fonts are synthesized, if necessary$NONANTIALIASED_QUALITY - Font is never antialiased, that is, font smoothing is not done$PROOF_QUALITY - Character quality of the font is more important than exact matching of the logical-font attributes.For GDI raster fonts, scaling is disabled and the font closest in size is chosen.Although the chosen font size may not be mapped exactly when PROOF_QUALITY is used, the quality of the font is high and there is no distortion of appearance.Bold, italic, underline, and strikeout fonts are synthesized, if necessary',
      },
      {
        label: '$iPitch',
        documentation:
          '**[optional]** Specifies the pitch and family of the font. The two low-order bits specify the pitch of the font and can be one of the following values:$DEFAULT_PITCH, $FIXED_PITCH, $VARIABLE_PITCHThe four high-order bits specify the font family and can be one of the following values:$FF_DECORATIVE - Novelty fonts. Old English is an example$FF_DONTCARE - Use default font$FF_MODERN - Fonts with constant stroke width, with or without serifs. Pica, Elite, and Courier New are examples$FF_ROMAN - Fonts with variable stroke width and with serifs. MS Serif is an example$FF_SCRIPT - Fonts designed to look like handwriting. Script and Cursive are examples$FF_SWISS - Fonts with variable stroke width and without serifs. MS Sans Serif is an example',
      },
      {
        label: '$sFace',
        documentation: '**[optional]** typeface name',
      },
    ],
  },
  _WinAPI_CreateFontIndirect: {
    documentation: 'Creates a logical font that has specific characteristics',
    label: '_WinAPI_CreateFontIndirect ( $tLogFont )',
    params: [
      {
        label: '$tLogFont',
        documentation: '$tagLOGFONT structure that defines the characteristics of the logical font',
      },
    ],
  },
  _WinAPI_CreatePen: {
    documentation: 'Creates a logical pen that has the specified style, width, and color',
    label: '_WinAPI_CreatePen ( $iPenStyle, $iWidth, $iColor )',
    params: [
      {
        label: '$iPenStyle',
        documentation:
          'Specifies the pen style. It can be any one of the following values.PS_SOLID - The pen is solid.PS_DASH - The pen is dashed. This style is valid only when the pen width is one or less in device units.PS_DOT - The pen is dotted. This style is valid only when the pen width is one or less in device units.PS_DASHDOT - The pen has alternating dashes and dots. This style is valid only when the pen width is one or less in device units.PS_DASHDOTDOT - The pen has alternating dashes and double dots. This style is valid only when the pen width is one or less in device units.PS_NULL - The pen is invisible.PS_INSIDEFRAME - The pen is solid. When this pen is used in any GDI drawing function that takes a bounding rectangle, the dimensions of the figure are shrunk so that it fits entirely in the bounding rectangle, taking into account the width of the pen. This applies only to geometric pens.',
      },
      {
        label: '$iWidth',
        documentation: 'Specifies the width of the pen, in logical units.',
      },
      {
        label: '$iColor',
        documentation: 'Specifies the color of the pen (BGR)',
      },
    ],
  },
  _WinAPI_CreateProcess: {
    documentation: 'Creates a new process and its primary thread',
    label:
      '_WinAPI_CreateProcess ( $sAppName, $sCommand, $tSecurity, $tThread, $bInherit, $iFlags, $pEnviron, $sDir, $tStartupInfo, $tProcess )',
    params: [
      {
        label: '$sAppName',
        documentation: 'The name of the module to be executed',
      },
      {
        label: '$sCommand',
        documentation: 'The command line to be executed',
      },
      {
        label: '$tSecurity',
        documentation:
          'a $tagSECURITY_ATTRIBUTES structure or a pointer to it that determines whether the returned handle to the new process can be inherited by child processes.',
      },
      {
        label: '$tThread',
        documentation:
          'a $tagSECURITY_ATTRIBUTES structure or a pointer to it that determines whether the returned handle to the new thread can be inherited by child processes.',
      },
      {
        label: '$bInherit',
        documentation:
          'If True, each inheritable handle in the calling process is inherited by the new process',
      },
      {
        label: '$iFlags',
        documentation: 'Flags that control the priority class and creation of the process',
      },
      {
        label: '$pEnviron',
        documentation: 'Pointer to the environment block for the new process',
      },
      {
        label: '$sDir',
        documentation: 'The full path to the current directory for the process',
      },
      {
        label: '$tStartupInfo',
        documentation: 'a $tagSTARTUPINFO structure or a pointer to it',
      },
      {
        label: '$tProcess',
        documentation: 'a $tagPROCESS_INFORMATION structure or a pointer to it',
      },
    ],
  },
  _WinAPI_CreateRectRgn: {
    documentation: 'Creates a rectangular region',
    label: '_WinAPI_CreateRectRgn ( $iLeftRect, $iTopRect, $iRightRect, $iBottomRect )',
    params: [
      {
        label: '$iLeftRect',
        documentation: 'X-coordinate of the upper-left corner of the region',
      },
      {
        label: '$iTopRect',
        documentation: 'Y-coordinate of the upper-left corner of the region',
      },
      {
        label: '$iRightRect',
        documentation: 'X-coordinate of the lower-right corner of the region',
      },
      {
        label: '$iBottomRect',
        documentation: 'Y-coordinate of the lower-right corner of the region',
      },
    ],
  },
  _WinAPI_CreateRoundRectRgn: {
    documentation: 'Creates a rectangular region with rounded corners',
    label:
      '_WinAPI_CreateRoundRectRgn ( $iLeftRect, $iTopRect, $iRightRect, $iBottomRect, $iWidthEllipse, $iHeightEllipse )',
    params: [
      {
        label: '$iLeftRect',
        documentation: 'X-coordinate of the upper-left corner of the region',
      },
      {
        label: '$iTopRect',
        documentation: 'Y-coordinate of the upper-left corner of the region',
      },
      {
        label: '$iRightRect',
        documentation: 'X-coordinate of the lower-right corner of the region',
      },
      {
        label: '$iBottomRect',
        documentation: 'Y-coordinate of the lower-right corner of the region',
      },
      {
        label: '$iWidthEllipse',
        documentation: 'Width of the ellipse used to create the rounded corners',
      },
      {
        label: '$iHeightEllipse',
        documentation: 'Height of the ellipse used to create the rounded corners',
      },
    ],
  },
  _WinAPI_CreateSolidBitmap: {
    documentation: 'Creates a solid color bitmap',
    label: '_WinAPI_CreateSolidBitmap ( $hWnd, $iColor, $iWidth, $iHeight [, $bRGB = 1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window where the bitmap will be displayed',
      },
      {
        label: '$iColor',
        documentation: 'The color of the bitmap, stated in RGB',
      },
      {
        label: '$iWidth',
        documentation: 'The width of the bitmap',
      },
      {
        label: '$iHeight',
        documentation: 'The height of the bitmap',
      },
      {
        label: '$bRGB',
        documentation: '**[optional]** If True converts to COLOREF (0x00bbggrr)',
      },
    ],
  },
  _WinAPI_CreateSolidBrush: {
    documentation: 'Creates a logical brush that has the specified solid color',
    label: '_WinAPI_CreateSolidBrush ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'Specifies the color of the brush',
      },
    ],
  },
  _WinAPI_CreateWindowEx: {
    documentation: 'Creates an overlapped, pop-up, or child window',
    label:
      '_WinAPI_CreateWindowEx ( $iExStyle, $sClass, $sName, $iStyle, $iX, $iY, $iWidth, $iHeight, $hParent [, $hMenu = 0 [, $hInstance = 0 [, $pParam = 0]]] )',
    params: [
      {
        label: '$iExStyle',
        documentation: 'Extended window style',
      },
      {
        label: '$sClass',
        documentation: 'Registered class name',
      },
      {
        label: '$sName',
        documentation: 'Window name',
      },
      {
        label: '$iStyle',
        documentation: 'Window style',
      },
      {
        label: '$iX',
        documentation: 'Horizontal position of window',
      },
      {
        label: '$iY',
        documentation: 'Vertical position of window',
      },
      {
        label: '$iWidth',
        documentation: 'Window width',
      },
      {
        label: '$iHeight',
        documentation: 'Window height',
      },
      {
        label: '$hParent',
        documentation: 'Handle to parent or owner window',
      },
      {
        label: '$hMenu',
        documentation: '**[optional]** Handle to menu or child-window identifier',
      },
      {
        label: '$hInstance',
        documentation: '**[optional]** Handle to application instance',
      },
      {
        label: '$pParam',
        documentation: '**[optional]** Pointer to window-creation data',
      },
    ],
  },
  _WinAPI_DefWindowProc: {
    documentation: 'Call the default window procedure to provide default processing',
    label: '_WinAPI_DefWindowProc ( $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window procedure that received the message',
      },
      {
        label: '$iMsg',
        documentation: 'Specifies the message',
      },
      {
        label: '$wParam',
        documentation: 'Specifies additional message information',
      },
      {
        label: '$lParam',
        documentation: 'Specifies additional message information',
      },
    ],
  },
  _WinAPI_DeleteDC: {
    documentation: 'Deletes the specified device context',
    label: '_WinAPI_DeleteDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies the device context to be deleted',
      },
    ],
  },
  _WinAPI_DeleteObject: {
    documentation: 'Deletes a logical pen, brush, font, bitmap, region, or palette',
    label: '_WinAPI_DeleteObject ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Identifies a logical pen, brush, font, bitmap, region, or palette',
      },
    ],
  },
  _WinAPI_DestroyIcon: {
    documentation: 'Destroys an icon and frees any memory the icon occupied',
    label: '_WinAPI_DestroyIcon ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to be destroyed. The icon must not be in use.',
      },
    ],
  },
  _WinAPI_DestroyWindow: {
    documentation: 'Destroys the specified window',
    label: '_WinAPI_DestroyWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be destroyed',
      },
    ],
  },
  _WinAPI_DrawEdge: {
    documentation: 'Draws one or more edges of rectangle',
    label: '_WinAPI_DrawEdge ( $hDC, $tRECT, $iEdgeType, $iFlags )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the edge is drawn',
      },
      {
        label: '$tRECT',
        documentation:
          'a $tagRECT structure or a pointer to it that contains the logical coordinates of the rectangle',
      },
      {
        label: '$iEdgeType',
        documentation:
          'Specifies the type of inner and outer edges to draw. This parameter must be a combination of one inner-border flag and one outer-border flag.The inner-border flags are as follows:    $BDR_RAISEDINNER - Raised inner edge    $BDR_SUNKENINNER - Sunken inner edgeThe outer-border flags are as follows:    $BDR_RAISEDOUTER - Raised outer edge    $BDR_SUNKENOUTER - Sunken outer edgeAlternatively, the edge parameter can specify one of the following flags:    $EDGE_BUMP - Combination of $BDR_RAISEDOUTER and $BDR_SUNKENINNER    $EDGE_ETCHED - Combination of $BDR_SUNKENOUTER and $BDR_RAISEDINNER    $EDGE_RAISED - Combination of $BDR_RAISEDOUTER and $BDR_RAISEDINNER    $EDGE_SUNKEN - Combination of $BDR_SUNKENOUTER and $BDR_SUNKENINNER',
      },
      {
        label: '$iFlags',
        documentation:
          'Specifies the type of border. This parameter can be a combination of the following values:    $BF_ADJUST - If this flag is passed, shrink the rectangle pointed to by the $pRECT parameter to exclude the edges that were drawn.If this flag is not passed, then do not change the rectangle pointed to by the $pRECT parameter    $BF_BOTTOM - Bottom of border rectangle    $BF_BOTTOMLEFT - Bottom and left side of border rectangle    $BF_BOTTOMRIGHT - Bottom and right side of border rectangle    $BF_DIAGONAL - Diagonal border    $BF_DIAGONAL_ENDBOTTOMLEFT - Diagonal border. The end point is the bottom-left corner of the rectangle; the origin is top-right corner    $BF_DIAGONAL_ENDBOTTOMRIGHT - Diagonal border. The end point is the bottom-right corner of the rectangle; the origin is top-left corner    $BF_DIAGONAL_ENDTOPLEFT - Diagonal border. The end point is the top-left corner of the rectangle; the origin is bottom-right corner    $BF_DIAGONAL_ENDTOPRIGHT - Diagonal border. The end point is the top-right corner of the rectangle; the origin is bottom-left corner    $BF_FLAT - Flat border    $BF_LEFT - Left side of border rectangle    $BF_MIDDLE - Interior of rectangle to be filled    $BF_MONO - One-dimensional border    $BF_RECT - Entire border rectangle    $BF_RIGHT - Right side of border rectangle    $BF_SOFT - Soft buttons instead of tiles    $BF_TOP - Top of border rectangle    $BF_TOPLEFT - Top and left side of border rectangle    $BF_TOPRIGHT - Top and right side of border rectangle',
      },
    ],
  },
  _WinAPI_DrawFrameControl: {
    documentation: 'Draws a frame control of the specified type and style',
    label: '_WinAPI_DrawFrameControl ( $hDC, $tRECT, $iType, $iState )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the frame is drawn',
      },
      {
        label: '$tRECT',
        documentation:
          'a $tagRECT structure or a pointer to it that contains the logical coordinates of the rectangle',
      },
      {
        label: '$iType',
        documentation:
          'Specifies the type of frame control to draw. This parameter can be one of the following values:    $DFC_BUTTON - Standard button    $DFC_CAPTION - Title bar    $DFC_MENU - Menu bar    $DFC_POPUPMENU - Popup menu item    $DFC_SCROLL - Scroll bar',
      },
      {
        label: '$iState',
        documentation:
          'Specifies the initial state of the frame control. If $iType is $DFC_BUTTON, $iState can be one of the following values:    $DFCS_BUTTON3STATE - Three-state button    $DFCS_BUTTONCHECK - Check box    $DFCS_BUTTONPUSH - Push button    $DFCS_BUTTONRADIO - Radio button    $DFCS_BUTTONRADIOIMAGE - Image for radio button (nonsquare needs image)    $DFCS_BUTTONRADIOMASK - Mask for radio button (nonsquare needs mask)If $iType is $DFC_CAPTION, $iState can be one of the following values:    $DFCS_CAPTIONCLOSE - Close button    $DFCS_CAPTIONHELP - Help button    $DFCS_CAPTIONMAX - Maximize button    $DFCS_CAPTIONMIN - Minimize button    $DFCS_CAPTIONRESTORE - Restore buttonIf $iType is $DFC_MENU, $iState can be one of the following values:    $DFCS_MENUARROW - Submenu arrow    $DFCS_MENUARROWRIGHT - Submenu arrow pointing left. This is used for the right-to-left cascading menus used with right-to-left languages such as Arabic or Hebrew    $DFCS_MENUBULLET - Bullet    $DFCS_MENUCHECK - Check markIf $iType is $DFC_SCROLL, $iState can be one of the following values:    $DFCS_SCROLLCOMBOBOX - Combo box scroll bar    $DFCS_SCROLLDOWN - Down arrow of scroll bar    $DFCS_SCROLLLEFT - Left arrow of scroll bar    $DFCS_SCROLLRIGHT - Right arrow of scroll bar    $DFCS_SCROLLSIZEGRIP - Size grip in bottom-right corner of window    $DFCS_SCROLLSIZEGRIPRIGHT - Size grip in bottom-left corner of window. This is used with right-to-left languages such as Arabic or Hebrew    $DFCS_SCROLLUP - Up arrow of scroll barThe following style can be used to adjust the bounding rectangle of the push button:    $DFCS_ADJUSTRECT - Bounding rectangle is adjusted to exclude the surrounding edge of the push buttonOne or more of the following values can be used to set the state of the control to be drawn:    $DFCS_CHECKED - Button is checked    $DFCS_FLAT - Button has a flat border    $DFCS_HOT - Button is hot-tracked    $DFCS_INACTIVE - Button is inactive (grayed)    $DFCS_PUSHED - Button is pushed    $DFCS_TRANSPARENT - The background remains untouched. This flag can only be combined with $DFCS_MENUARROWUP or $DFCS_MENUARROWDOWN',
      },
    ],
  },
  _WinAPI_DrawIcon: {
    documentation: 'Draws an icon or cursor into the specified device context',
    label: '_WinAPI_DrawIcon ( $hDC, $iX, $iY, $hIcon )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the icon or cursor is drawn',
      },
      {
        label: '$iX',
        documentation: 'X coordinate of the upper-left corner of the icon',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate of the upper-left corner of the icon',
      },
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to be drawn',
      },
    ],
  },
  _WinAPI_DrawIconEx: {
    documentation: 'Draws an icon or cursor into the specified device context',
    label:
      '_WinAPI_DrawIconEx ( $hDC, $iX, $iY, $hIcon [, $iWidth = 0 [, $iHeight = 0 [, $iStep = 0 [, $hBrush = 0 [, $iFlags = 3]]]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the icon or cursor is drawn',
      },
      {
        label: '$iX',
        documentation: 'X coordinate of the upper-left corner of the icon',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate of the upper-left corner of the icon',
      },
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to be drawn',
      },
      {
        label: '$iWidth',
        documentation:
          '**[optional]** Specifies the logical width of the icon or cursor.If this parameter is zero and the $iFlags parameter is "default size", the function uses the $SM_CXICON or $SM_CXCURSOR system metric value to set the width.If this is zero and "default size" is not used, the function uses the actual resource width.',
      },
      {
        label: '$iHeight',
        documentation:
          '**[optional]** Specifies the logical height of the icon or cursor.If this parameter is zero and the $iFlags parameter is "default size", the function uses the $SM_CYICON or $SM_CYCURSOR system metric value to set the width.If this is zero and "default size" is not used, the function uses the actual resource height.',
      },
      {
        label: '$iStep',
        documentation:
          '**[optional]** Specifies the index of the frame to draw if $hIcon identifies an animated cursor.This parameter is ignored if $hIcon does not identify an animated cursor.',
      },
      {
        label: '$hBrush',
        documentation:
          '**[optional]** Handle to a brush that the system uses for flicker-free drawing.If $hBrush is a valid brush handle, the system creates an offscreen bitmap using the specified brush for the background color, draws the icon or cursor into the bitmap, and then copies the bitmap into the device context identified by $hDC.If $hBrush is 0, the system draws the icon or cursor directly into the device context.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Specifies the drawing flags. This parameter can be one of the following values:1 - Draws the icon or cursor using the mask2 - Draws the icon or cursor using the image3 - Draws the icon or cursor using the mask and image4 - Draws the icon or cursor using the system default image rather than the user-specified image5 - Draws the icon or cursor using the width and height specified by the system metric values for cursors or icons, if the width and height parameters are set to zero.If this flag is not specified and width and height are set to zero, the function uses the actual resource size.6 - Draws the icon as an unmirrored icon',
      },
    ],
  },
  _WinAPI_DrawLine: {
    documentation: 'Draws a line',
    label: '_WinAPI_DrawLine ( $hDC, $iX1, $iY1, $iX2, $iY2 )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to device context',
      },
      {
        label: '$iX1',
        documentation: "X coordinate of the line's starting point.",
      },
      {
        label: '$iY1',
        documentation: "Y coordinate of the line's starting point.",
      },
      {
        label: '$iX2',
        documentation: "X coordinate of the line's ending point.",
      },
      {
        label: '$iY2',
        documentation: "Y coordinate of the line's ending point.",
      },
    ],
  },
  _WinAPI_DrawText: {
    documentation: 'Draws formatted text in the specified rectangle',
    label: '_WinAPI_DrawText ( $hDC, $sText, ByRef $tRECT, $iFlags )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies the device context',
      },
      {
        label: '$sText',
        documentation: 'The string to be drawn',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the rectangle for the text',
      },
      {
        label: '$iFlags',
        documentation:
          'Specifies the method of formatting the text:$DT_BOTTOM - Justifies the text to the bottom of the rectangle$DT_CALCRECT - Determines the width and height of the rectangle$DT_CENTER - Centers text horizontally in the rectangle$DT_EDITCONTROL - Duplicates the text-displaying characteristics of a multiline edit control$DT_END_ELLIPSIS - Replaces part of the given string with ellipses if necessary$DT_EXPANDTABS - Expands tab characters$DT_EXTERNALLEADING - Includes the font external leading in line height$DT_HIDEPREFIX - Ignores the ampersand (&) prefix character in the text.The letter that follows will not be underlined, but other mnemonic-prefix characters are still processed.$DT_INTERNAL - Uses the system font to calculate text metrics$DT_LEFT - Aligns text to the left$DT_MODIFYSTRING - Modifies the given string to match the displayed text$DT_NOCLIP - Draws without clipping$DT_NOFULLWIDTHCHARBREAK - Prevents a line break at a DBCS (double-wide character string), so that the line breaking rule is equivalent to SBCS strings.For example, this can be used in Korean windows, for more readability of icon labels.This value has no effect unless $DT_WORDBREAK is specified$DT_NOPREFIX - Turns off processing of prefix characters$DT_PATH_ELLIPSIS - For displayed text, replaces characters in the middle of the string with ellipses so that the result fits in the specified rectangle.If the string contains backslash (\\) characters, $DT_PATH_ELLIPSIS preserves as much as possible of the text after the last backslash.The string is not modified unless the $DT_MODIFYSTRING flag is specified$DT_PREFIXONLY - Draws only an underline at the position of the character following the ampersand (&) prefix character.Does not draw any other characters in the string$DT_RIGHT - Aligns text to the right$DT_RTLREADING - Layout in right to left reading order for bi-directional text$DT_SINGLELINE - Displays text on a single line only$DT_TABSTOP - Sets tab stops. Bits 15-8 of $iFlags specify the number of characters for each tab$DT_TOP - Top-justifies text (single line only)$DT_VCENTER - Centers text vertically (single line only)$DT_WORDBREAK - Breaks words$DT_WORD_ELLIPSIS - Truncates any word that does not fit in the rectangle and adds ellipses',
      },
    ],
  },
  _WinAPI_DuplicateHandle: {
    documentation: 'Duplicates an object handle',
    label:
      '_WinAPI_DuplicateHandle ( $hSourceProcessHandle, $hSourceHandle, $hTargetProcessHandle, $iDesiredAccess, $iInheritHandle, $iOptions )',
    params: [
      {
        label: '$hSourceProcessHandle',
        documentation: 'A handle to the process with the handle to be duplicated',
      },
      {
        label: '$hSourceHandle',
        documentation: 'The handle to be duplicated',
      },
      {
        label: '$hTargetProcessHandle',
        documentation: 'A handle to the process that is to receive the duplicated handle',
      },
      {
        label: '$iDesiredAccess',
        documentation: 'The access requested for the new handle',
      },
      {
        label: '$iInheritHandle',
        documentation: 'A variable that indicates whether the handle is inheritable',
      },
      {
        label: '$iOptions',
        documentation: 'Optional actions',
      },
    ],
  },
  _WinAPI_EnableWindow: {
    documentation:
      'Enables or disables mouse and keyboard input to the specified window or control',
    label: '_WinAPI_EnableWindow ( $hWnd [, $bEnable = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be enabled or disabled',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** Specifies whether to enable or disable the window:True - The window or control is enabledFalse - The window or control is disabled',
      },
    ],
  },
  _WinAPI_EnumDisplayDevices: {
    documentation: 'Obtains information about the display devices in a system',
    label: '_WinAPI_EnumDisplayDevices ( $sDevice, $iDevNum )',
    params: [
      {
        label: '$sDevice',
        documentation:
          'Device name. If blank, the function returns information for the display adapters on the machine based on $iDevNum.',
      },
      {
        label: '$iDevNum',
        documentation: '0-based index value that specifies the display device of interest',
      },
    ],
  },
  _WinAPI_EnumWindows: {
    documentation: 'Enumerates all windows',
    label: '_WinAPI_EnumWindows ( [$bVisible = True [, $hWnd = Default]] )',
    params: [
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Window selection flag:True - Returns only visible windowsFalse - Returns all windows',
      },
      {
        label: '$hWnd',
        documentation: '**[optional]** Handle of the starting windows (default Desktop windows)',
      },
    ],
  },
  _WinAPI_EnumWindowsPopup: {
    documentation: 'Enumerates popup windows',
    label: '_WinAPI_EnumWindowsPopup (  )',
    params: [],
  },
  _WinAPI_EnumWindowsTop: {
    documentation: 'Enumerates all top level windows',
    label: '_WinAPI_EnumWindowsTop (  )',
    params: [],
  },
  _WinAPI_ExpandEnvironmentStrings: {
    documentation:
      'Expands environment variable strings and replaces them with their defined values',
    label: '_WinAPI_ExpandEnvironmentStrings ( $sString )',
    params: [
      {
        label: '$sString',
        documentation: 'String to convert for environment variables',
      },
    ],
  },
  _WinAPI_ExtractIconEx: {
    documentation: 'Creates an array of handles to large or small icons extracted from a file',
    label: '_WinAPI_ExtractIconEx ( $sFilePath, $iIndex, $paLarge, $paSmall, $iIcons )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'Name of an executable file, DLL, or icon file from which icons will be extracted',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the 0-based index of the first icon to extract',
      },
      {
        label: '$paLarge',
        documentation:
          'Pointer to an array of icon handles that receives handles to the large icons extracted from the file.If this parameter is 0, no large icons are extracted from the file.',
      },
      {
        label: '$paSmall',
        documentation:
          'Pointer to an array of icon handles that receives handles to the small icons extracted from the file.If this parameter is 0, no small icons are extracted from the file.',
      },
      {
        label: '$iIcons',
        documentation: 'Specifies the number of icons to extract from the file',
      },
    ],
  },
  _WinAPI_FatalAppExit: {
    documentation: 'Displays a message box and terminates the application',
    label: '_WinAPI_FatalAppExit ( $sMessage )',
    params: [
      {
        label: '$sMessage',
        documentation: 'The string that is displayed in the message box',
      },
    ],
  },
  _WinAPI_FillRect: {
    documentation: 'Fills a rectangle by using the specified brush',
    label: '_WinAPI_FillRect ( $hDC, $tRECT, $hBrush )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$tRECT',
        documentation:
          'a $tagRECT structure or pointer to it that contains the logical coordinates of the rectangle to be filled',
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush used to fill the rectangle',
      },
    ],
  },
  _WinAPI_FindExecutable: {
    documentation:
      'Retrieves the name of the executable file associated with the specified file name',
    label: '_WinAPI_FindExecutable ( $sFileName [, $sDirectory = ""] )',
    params: [
      {
        label: '$sFileName',
        documentation: 'Fully qualified path to existing file',
      },
      {
        label: '$sDirectory',
        documentation: '**[optional]** Default directory',
      },
    ],
  },
  _WinAPI_FindWindow: {
    documentation:
      'Retrieves the handle to the top-level window whose class name and window name match',
    label: '_WinAPI_FindWindow ( $sClassName, $sWindowName )',
    params: [
      {
        label: '$sClassName',
        documentation:
          'A string that specifies the class name or is an atom that identifies the class-name string.If this parameter is an atom, it must be a global atom created by a call to the GlobalAddAtom function.The atom, a 16-bit value, must be placed in the low-order word of the $sClassName string and the high-order word must be zero.',
      },
      {
        label: '$sWindowName',
        documentation:
          'A string that specifies the window name. If this parameter is blank, all window names match.',
      },
    ],
  },
  _WinAPI_FlashWindow: {
    documentation: 'Flashes the specified window one time',
    label: '_WinAPI_FlashWindow ( $hWnd [, $bInvert = True] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window to be flashed. The window can be either open or minimized.',
      },
      {
        label: '$bInvert',
        documentation:
          '**[optional]** If True, the window is flashed from one state to the other.If False the window is returned to its original state.When an application is minimized and this parameter is True, the taskbar window button flashes active/inactive.If it is False, the taskbar window button flashes inactive, meaning that it does not change colors.It flashes as if it were being redrawn, but it does not provide the visual invert clue to the user.',
      },
    ],
  },
  _WinAPI_FlashWindowEx: {
    documentation: 'Flashes the specified window',
    label: '_WinAPI_FlashWindowEx ( $hWnd [, $iFlags = 3 [, $iCount = 3 [, $iTimeout = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window to be flashed. The window can be either open or minimized.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flash status. Can be one or more of the following values:    0 - Stop flashing. The system restores the window to its original state.    1 - Flash the window caption    2 - Flash the taskbar button    4 - Flash continuously until stopped    8 - Flash continuously until the window comes to the foreground',
      },
      {
        label: '$iCount',
        documentation: '**[optional]** The number of times to flash the window',
      },
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** The rate at which the window is to be flashed, in milliseconds.If 0, the function uses the default cursor blink rate.',
      },
    ],
  },
  _WinAPI_FloatToInt: {
    documentation: 'Returns a 4 byte float as an integer value',
    label: '_WinAPI_FloatToInt ( $nFloat )',
    params: [
      {
        label: '$nFloat',
        documentation: 'Float value',
      },
    ],
  },
  _WinAPI_FlushFileBuffers: {
    documentation:
      'Flushes the buffers of a specified file and causes all buffered data to be written',
    label: '_WinAPI_FlushFileBuffers ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to an open file. The file handle must have the $GENERIC_WRITE access right.If $hFile is a handle to a communications device, the function only flushes the transmit buffer.If $hFile is a handle to the server end of a named pipe the function does not return until the client has read all buffered data from the pipe.',
      },
    ],
  },
  _WinAPI_FormatMessage: {
    documentation: 'Formats a message string',
    label:
      '_WinAPI_FormatMessage ( $iFlags, $pSource, $iMessageID, $iLanguageID, ByRef $pBuffer, $iSize, $vArguments )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'Contains a set of bit flags that specify aspects of the formatting process and how to interpret the $pSource parameter.The low-order byte of $iFlags specifies how the function handles line breaks in the output buffer.The low-order byte can also specify the maximum width of a formatted output line.',
      },
      {
        label: '$pSource',
        documentation: 'Pointer to message source',
      },
      {
        label: '$iMessageID',
        documentation: 'Requested message identifier',
      },
      {
        label: '$iLanguageID',
        documentation: 'Language identifier for requested message',
      },
      {
        label: '$pBuffer',
        documentation: 'Pointer to message buffer or string variable that will contain the message',
      },
      {
        label: '$iSize',
        documentation: 'Maximum size of message buffer',
      },
      {
        label: '$vArguments',
        documentation: 'Address of array of message inserts',
      },
    ],
  },
  _WinAPI_FrameRect: {
    documentation: 'Draws a border around the specified rectangle by using the specified brush',
    label: '_WinAPI_FrameRect ( $hDC, $tRECT, $hBrush )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context in which the border is drawn',
      },
      {
        label: '$tRECT',
        documentation:
          'A $tagRECT structure or a pointer to it that contains the logical coordinates of the upper-left and lower-right corners of the rectangle',
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush used to draw the border',
      },
    ],
  },
  _WinAPI_FreeLibrary: {
    documentation: 'Decrements the reference count of the loaded dynamic-link library (DLL) module',
    label: '_WinAPI_FreeLibrary ( $hModule )',
    params: [
      {
        label: '$hModule',
        documentation: 'Identifies the loaded library module',
      },
    ],
  },
  _WinAPI_GetAncestor: {
    documentation: 'Retrieves the handle to the ancestor of the specified window',
    label: '_WinAPI_GetAncestor ( $hWnd [, $iFlags = 1] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window whose ancestor is to be retrieved.If this is the desktop window, the function returns 0.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Specifies the ancestor to be retrieved. This parameter can be one of the following values:    $GA_PARENT - Retrieves the parent window    $GA_ROOT - Retrieves the root window by walking the chain of parent windows    $GA_ROOTOWNER - Retrieves the owned root window by walking the chain of parent and owner windows returned by GetParent.',
      },
    ],
  },
  _WinAPI_GetAsyncKeyState: {
    documentation: 'Determines whether a key is up or down at the time the function is called',
    label: '_WinAPI_GetAsyncKeyState ( $iKey )',
    params: [
      {
        label: '$iKey',
        documentation: 'Key to test for',
      },
    ],
  },
  _WinAPI_GetBkMode: {
    documentation: 'Returns the current background mix mode for a specified device context',
    label: '_WinAPI_GetBkMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context whose background mode is to be returned',
      },
    ],
  },
  _WinAPI_GetClassName: {
    documentation: 'Retrieves the name of the class to which the specified window belongs',
    label: '_WinAPI_GetClassName ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetClientHeight: {
    documentation: "Retrieves the height of a window's client area",
    label: '_WinAPI_GetClientHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetClientRect: {
    documentation: "Retrieves the coordinates of a window's client area",
    label: '_WinAPI_GetClientRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetClientWidth: {
    documentation: "Retrieves the width of a window's client area",
    label: '_WinAPI_GetClientWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetCurrentProcess: {
    documentation: 'Returns the process handle of the calling process',
    label: '_WinAPI_GetCurrentProcess (  )',
    params: [],
  },
  _WinAPI_GetCurrentProcessID: {
    documentation: 'Returns the process identifier of the calling process',
    label: '_WinAPI_GetCurrentProcessID (  )',
    params: [],
  },
  _WinAPI_GetCurrentThread: {
    documentation: 'Retrieves a pseudo handle for the calling thread',
    label: '_WinAPI_GetCurrentThread (  )',
    params: [],
  },
  _WinAPI_GetCurrentThreadId: {
    documentation: 'Returns the thread identifier of the calling thread',
    label: '_WinAPI_GetCurrentThreadId (  )',
    params: [],
  },
  _WinAPI_GetCursorInfo: {
    documentation: 'Retrieves information about the global cursor',
    label: '_WinAPI_GetCursorInfo (  )',
    params: [],
  },
  _WinAPI_GetDC: {
    documentation: 'Retrieves a handle of a display device context for the client area a window',
    label: '_WinAPI_GetDC ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetDesktopWindow: {
    documentation: 'Returns the handle of the Windows desktop window',
    label: '_WinAPI_GetDesktopWindow (  )',
    params: [],
  },
  _WinAPI_GetDeviceCaps: {
    documentation: 'Retrieves device specific information about a specified device',
    label: '_WinAPI_GetDeviceCaps ( $hDC, $iIndex )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies the device context',
      },
      {
        label: '$iIndex',
        documentation: 'Specifies the item to return',
      },
    ],
  },
  _WinAPI_GetDIBits: {
    documentation:
      'Retrieves the bits of the specified bitmap and copies them into a buffer as a DIB',
    label: '_WinAPI_GetDIBits ( $hDC, $hBitmap, $iStartScan, $iScanLines, $pBits, $tBI, $iUsage )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap. This must be a compatible bitmap (DDB).',
      },
      {
        label: '$iStartScan',
        documentation: 'Specifies the first scan line to retrieve',
      },
      {
        label: '$iScanLines',
        documentation: 'Specifies the number of scan lines to retrieve',
      },
      {
        label: '$pBits',
        documentation:
          'Pointer to a buffer to receive the bitmap data.If this parameter is 0, the function passes the dimensions and format of the bitmap to the $tagBITMAPINFO structure pointed to by the $tBI parameter.',
      },
      {
        label: '$tBI',
        documentation:
          'A $tagBITMAPINFO structure or a pointer to it that specifies the desired format for the DIB data',
      },
      {
        label: '$iUsage',
        documentation:
          'Specifies the format of the bmiColors member of the $tagBITMAPINFO structure.It must be one of the following values:    $DIB_PAL_COLORS - The color table should consist of an array of 16-bit indexes into the current palette    $DIB_RGB_COLORS - The color table should consist of literal red, green, blue values',
      },
    ],
  },
  _WinAPI_GetDlgCtrlID: {
    documentation: 'Returns the identifier of the specified control',
    label: '_WinAPI_GetDlgCtrlID ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the control',
      },
    ],
  },
  _WinAPI_GetDlgItem: {
    documentation: 'Retrieves the handle of a control in the specified dialog box',
    label: '_WinAPI_GetDlgItem ( $hWnd, $iItemID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the dialog box',
      },
      {
        label: '$iItemID',
        documentation: 'Specifies the identifier of the control to be retrieved',
      },
    ],
  },
  _WinAPI_GetFileSizeEx: {
    documentation: 'Retrieves the size of the specified file',
    label: '_WinAPI_GetFileSizeEx ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file whose size is to be returned',
      },
    ],
  },
  _WinAPI_GetFocus: {
    documentation: 'Retrieves the handle of the window that has the keyboard focus',
    label: '_WinAPI_GetFocus (  )',
    params: [],
  },
  _WinAPI_GetForegroundWindow: {
    documentation: 'Returns the handle of the foreground window',
    label: '_WinAPI_GetForegroundWindow (  )',
    params: [],
  },
  _WinAPI_GetGuiResources: {
    documentation:
      'Retrieves the count of handles to graphical user interface (GUI) objects in use by the specified process',
    label: '_WinAPI_GetGuiResources ( [$iFlag = 0 [, $hProcess = -1]] )',
    params: [
      {
        label: '$iFlag',
        documentation:
          '**[optional]** 0 (Default) Return the count of GDI objects.1 Return the count of USER objects.',
      },
      {
        label: '$hProcess',
        documentation: '**[optional]** A handle to the process. By default the current process.',
      },
    ],
  },
  _WinAPI_GetIconInfo: {
    documentation: 'Retrieves information about the specified icon or cursor',
    label: '_WinAPI_GetIconInfo ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation:
          'Handle to the icon or cursor.To retrieve information on a standard icon or cursor, specify one of the following values:    $IDC_APPSTARTING - Standard arrow and small hourglass cursor    $IDC_ARROW - Standard arrow cursor    $IDC_CROSS - Crosshair cursor    $IDC_HAND - Hand cursor    $IDC_HELP - Arrow and question mark cursor    $IDC_IBEAM - I-beam cursor    $IDC_NO - Slashed circle cursor    $IDC_SIZEALL - Four-pointed arrow cursor    $IDC_SIZENESW - Double-pointed arrow cursor pointing NE and SW    $IDC_SIZENS - Double-pointed arrow cursor pointing N and S    $IDC_SIZENWSE - Double-pointed arrow cursor pointing NW and SE    $IDC_SIZEWE - Double-pointed arrow cursor pointing W and E    $IDC_UPARROW - Vertical arrow cursor    $IDC_WAIT - Hourglass cursor    $IDI_APPLICATION - Application icon    $IDI_ASTERISK - Asterisk icon    $IDI_EXCLAMATION - Exclamation point icon    $IDI_HAND - Stop sign icon    $IDI_QUESTION - Question-mark icon    $IDI_WINLOGO - Windows logo icon',
      },
    ],
  },
  _WinAPI_GetLastError: {
    documentation: "Returns the calling thread's lasterror code value",
    label: '_WinAPI_GetLastError (  )',
    params: [],
  },
  _WinAPI_GetLastErrorMessage: {
    documentation: 'Returns the calling threads last error message',
    label: '_WinAPI_GetLastErrorMessage (  )',
    params: [],
  },
  _WinAPI_GetLayeredWindowAttributes: {
    documentation: 'Gets Layered Window Attributes',
    label:
      '_WinAPI_GetLayeredWindowAttributes ( $hWnd, ByRef $iTransColor, ByRef $iTransGUI [, $bColorRef = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of GUI to work on',
      },
      {
        label: '$iTransColor',
        documentation: 'Returns Transparent color ( dword as 0x00bbggrr or string "0xRRGGBB")',
      },
      {
        label: '$iTransGUI',
        documentation: 'Returns Transparancy of GUI',
      },
      {
        label: '$bColorRef',
        documentation:
          '**[optional]** If True, $iTransColor will be a COLORREF( 0x00bbggrr ), else an RGB-Color',
      },
    ],
  },
  _WinAPI_GetModuleHandle: {
    documentation: 'Returns a module handle for the specified module',
    label: '_WinAPI_GetModuleHandle ( $sModuleName )',
    params: [
      {
        label: '$sModuleName',
        documentation:
          'Names a Win32 module (either a .dll or .exe file). If the filename extension is omitted, thedefault library extension .dll is appended. The filename string can include a trailing point character (.) toindicate that the module name has no extension. The string does not have to specify a path. The name iscompared (case independently) to the names of modules currently mapped into the address space of the callingprocess. If this parameter is the Null keyword then the function returns a handle of the file used to create the calling process.',
      },
    ],
  },
  _WinAPI_GetMousePos: {
    documentation: 'Returns the current mouse position',
    label: '_WinAPI_GetMousePos ( [$bToClient = False [, $hWnd = 0]] )',
    params: [
      {
        label: '$bToClient',
        documentation:
          '**[optional]** If True, the coordinates will be converted to client coordinates',
      },
      {
        label: '$hWnd',
        documentation:
          '**[optional]** Window handle used to convert coordinates if $bToClient is True',
      },
    ],
  },
  _WinAPI_GetMousePosX: {
    documentation: 'Returns the current mouse X position',
    label: '_WinAPI_GetMousePosX ( [$bToClient = False [, $hWnd = 0]] )',
    params: [
      {
        label: '$bToClient',
        documentation:
          '**[optional]** If True, the coordinates will be converted to client coordinates',
      },
      {
        label: '$hWnd',
        documentation:
          '**[optional]** Window handle used to convert coordinates if $bToClient is True',
      },
    ],
  },
  _WinAPI_GetMousePosY: {
    documentation: 'Returns the current mouse Y position',
    label: '_WinAPI_GetMousePosY ( [$bToClient = False [, $hWnd = 0]] )',
    params: [
      {
        label: '$bToClient',
        documentation:
          '**[optional]** If True, the coordinates will be converted to client coordinates',
      },
      {
        label: '$hWnd',
        documentation:
          '**[optional]** Window handle used to convert coordinates if $bToClient is True',
      },
    ],
  },
  _WinAPI_GetObject: {
    documentation: 'Retrieves information for the specified graphics object',
    label: '_WinAPI_GetObject ( $hObject, $iSize, $pObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Identifies a logical pen, brush, font, bitmap, region, or palette',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the number of bytes to be written to the buffer',
      },
      {
        label: '$pObject',
        documentation:
          'Pointer to a buffer that receives the information.The following shows the type of information the buffer receives for each type of graphics object you can specify:    HBITMAP - BITMAP or DIBSECTION    HPALETTE - A count of the number of entries in the logical palette    HPEN - EXTLOGPEN or LOGPEN    HBRUSH - LOGBRUSH    HFONT - LOGFONTIf $pObject is 0 the function return value is the number of bytes required to store the information it writes to the buffer for the specified graphics object.',
      },
    ],
  },
  _WinAPI_GetOpenFileName: {
    documentation:
      'Creates an Open dialog box that lets the user specify the drive, directory, and the name of a file or set of files to open',
    label:
      '_WinAPI_GetOpenFileName ( [$sTitle = "" [, $sFilter = "All files (*.*)" [, $sInitalDir = "." [, $sDefaultFile = "" [, $sDefaultExt = "" [, $iFilterIndex = 1 [, $iFlags = 0 [, $iFlagsEx = 0 [, $hWndOwner = 0]]]]]]]]] )',
    params: [
      {
        label: '$sTitle',
        documentation: '**[optional]** string to be placed in the title bar of the dialog box',
      },
      {
        label: '$sFilter',
        documentation:
          '**[optional]** Pairs of filter strings (for example "Text Files (*.txt)|All Files (*.*)")The first string in each pair is a display string that describes the filter (for example, "Text Files")The second string specifies the filter pattern (for example, "*.TXT")To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "*.TXT;*.DOC;*.BAK")A pattern string can be a combination of valid file name characters and the asterisk (*) wildcard characterDo not include spaces in the pattern string.',
      },
      {
        label: '$sInitalDir',
        documentation: '**[optional]** String that can specify the initial directory',
      },
      {
        label: '$sDefaultFile',
        documentation: '**[optional]** A file name used to initialize the File Name edit control',
      },
      {
        label: '$sDefaultExt',
        documentation: '**[optional]** String that contains the default extension',
      },
      {
        label: '$iFilterIndex',
        documentation:
          '**[optional]** Specifies the index of the currently selected filter in the File Types control',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** See Flags in $tagOPENFILENAME information',
      },
      {
        label: '$iFlagsEx',
        documentation: '**[optional]** See FlagEx in $tagOPENFILENAME information',
      },
      {
        label: '$hWndOwner',
        documentation:
          '**[optional]** Handle to the window that owns the dialog box. This member can be any valid window handle, or it can be 0 if the dialog box has no owner',
      },
    ],
  },
  _WinAPI_GetOverlappedResult: {
    documentation: 'Retrieves the results of an overlapped operation',
    label: '_WinAPI_GetOverlappedResult ( $hFile, $tOverlapped, ByRef $iBytes [, $bWait = False] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file, named pipe, or communications device. This is the same handle that wasspecified when the overlapped operation was started by a call to ReadFile, WriteFile, ConnectNamedPipe,TransactNamedPipe, DeviceIoControl, or WaitCommEvent.',
      },
      {
        label: '$tOverlapped',
        documentation:
          'A $tagOVERLAPPED structure or a pointer to it that was specified when the overlapped operation wasstarted.',
      },
      {
        label: '$iBytes',
        documentation:
          'The number of bytes that were actually transferred by a read or write operation.For a TransactNamedPipe operation, this is the number of bytes that were read from the pipe.For a DeviceIoControl operation this is the number of bytes of output data returned by the device driver.For a ConnectNamedPipe or WaitCommEvent operation, this value is undefined.',
      },
      {
        label: '$bWait',
        documentation:
          '**[optional]** If True, the function does not return until the operation has been completed.If False and the operation is still pending, the function returns False and the GetLastError function will return ERROR_IO_INCOMPLETE.',
      },
    ],
  },
  _WinAPI_GetParent: {
    documentation: "Retrieves the handle of the specified child window's parent window",
    label: '_WinAPI_GetParent ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window handle of child window',
      },
    ],
  },
  _WinAPI_GetProcAddress: {
    documentation:
      'Retrieves the address of an exported function or variable from the specified module',
    label: '_WinAPI_GetProcAddress ( $hModule, $vName )',
    params: [
      {
        label: '$hModule',
        documentation: 'A handle to the module that contains the function or variable',
      },
      {
        label: '$vName',
        documentation: "The function or variable name, or the function's ordinal value",
      },
    ],
  },
  _WinAPI_GetProcessAffinityMask: {
    documentation: 'Obtains the affinity masks for the process and the system',
    label: '_WinAPI_GetProcessAffinityMask ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation: 'An open handle to the process whose affinity mask is desired.',
      },
    ],
  },
  _WinAPI_GetSaveFileName: {
    documentation:
      'Creates a Save dialog box that lets the user specify the drive, directory, and name of a file to save',
    label:
      '_WinAPI_GetSaveFileName ( [$sTitle = "" [, $sFilter = "All files (*.*)" [, $sInitalDir = "." [, $sDefaultFile = "" [, $sDefaultExt = "" [, $iFilterIndex = 1 [, $iFlags = 0 [, $iFlagsEx = 0 [, $hWndOwner = 0]]]]]]]]] )',
    params: [
      {
        label: '$sTitle',
        documentation: '**[optional]** string to be placed in the title bar of the dialog box',
      },
      {
        label: '$sFilter',
        documentation:
          '**[optional]** Pairs of filter strings (for example "Text Files (*.txt)|All Files (*.*)")The first string in each pair is a display string that describes the filter (for example, "Text Files")The second string specifies the filter pattern (for example, "*.TXT")To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "*.TXT;*.DOC;*.BAK")A pattern string can be a combination of valid file name characters and the asterisk (*) wildcard characterDo not include spaces in the pattern string.',
      },
      {
        label: '$sInitalDir',
        documentation: '**[optional]** String that can specify the initial directory',
      },
      {
        label: '$sDefaultFile',
        documentation: '**[optional]** A file name used to initialize the File Name edit control',
      },
      {
        label: '$sDefaultExt',
        documentation: '**[optional]** String that contains the default extension',
      },
      {
        label: '$iFilterIndex',
        documentation:
          '**[optional]** Specifies the index of the currently selected filter in the File Types control',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** See Flags in $tagOPENFILENAME information',
      },
      {
        label: '$iFlagsEx',
        documentation: '**[optional]** See FlagEx in $tagOPENFILENAME information',
      },
      {
        label: '$hWndOwner',
        documentation:
          '**[optional]** Handle to the window that owns the dialog box. This member can be any valid window handle, or it can be 0 if the dialog box has no owner',
      },
    ],
  },
  _WinAPI_GetStdHandle: {
    documentation:
      'Retrieves a handle for the standard input, standard output, or standard error device',
    label: '_WinAPI_GetStdHandle ( $iStdHandle )',
    params: [
      {
        label: '$iStdHandle',
        documentation:
          'Standard device for which a handle is to be returned. This can be one of the following values:0 - Handle to the standard input device1 - Handle to the standard output device2 - Handle to the standard error device',
      },
    ],
  },
  _WinAPI_GetStockObject: {
    documentation:
      'Retrieves a handle to one of the predefined stock pens, brushes, fonts, or palettes',
    label: '_WinAPI_GetStockObject ( $iObject )',
    params: [
      {
        label: '$iObject',
        documentation:
          'Specifies the type of stock object. This parameter can be any one of the following values:$BLACK_BRUSH - Black brush$DKGRAY_BRUSH - Dark gray brush$GRAY_BRUSH - Gray brush$HOLLOW_BRUSH - Hollow brush (equivalent to NULL_BRUSH)$LTGRAY_BRUSH - Light gray brush$NULL_BRUSH - Null brush (equivalent to HOLLOW_BRUSH)$WHITE_BRUSH - White brush$BLACK_PEN - Black pen$NULL_PEN - Null pen$WHITE_PEN - White pen$ANSI_FIXED_FONT - Windows fixed-pitch (monospace) system font$ANSI_VAR_FONT - Windows variable-pitch (proportional space) system font$DEVICE_DEFAULT_FONT - Device-dependent font$DEFAULT_GUI_FONT - Default font for user interface objects$OEM_FIXED_FONT - OEM dependent fixed-pitch (monospace) font$SYSTEM_FONT - System font$SYSTEM_FIXED_FONT - Fixed-pitch (monospace) system font used in Windows versions earlier than 3.0$DEFAULT_PALETTE - Default palette. This palette consists of the static colors in the system palette.',
      },
    ],
  },
  _WinAPI_GetSysColor: {
    documentation: 'Retrieves the current color of the specified display element',
    label: '_WinAPI_GetSysColor ( $iIndex )',
    params: [
      {
        label: '$iIndex',
        documentation:
          "The display element whose color is to be retrieved. Can be one of the following:$COLOR_3DDKSHADOW - Dark shadow for three-dimensional display elements.$COLOR_3DFACE - Face color for three-dimensional display elements and for dialog box backgrounds.$COLOR_3DHIGHLIGHT - Highlight color for three-dimensional display elements (for edges facing the light source.)$COLOR_3DHILIGHT - Highlight color for three-dimensional display elements (for edges facing the light source.)$COLOR_3DLIGHT - Light color for three-dimensional display elements (for edges facing the light source.)$COLOR_3DSHADOW - Shadow color for three-dimensional display elements (for edges facing away from the light source).$COLOR_ACTIVEBORDER - Active window border.$COLOR_ACTIVECAPTION - Active window title bar.Specifies the left side color in the color gradient of an active window's title bar if the gradient effect is enabled.$COLOR_APPWORKSPACE - Background color of multiple document interface (MDI) applications.$COLOR_BACKGROUND - Desktop.$COLOR_BTNFACE - Face color for three-dimensional display elements and for dialog box backgrounds.$COLOR_BTNHIGHLIGHT - Highlight color for three-dimensional display elements (for edges facing the light source.)$COLOR_BTNHILIGHT - Highlight color for three-dimensional display elements (for edges facing the light source.)$COLOR_BTNSHADOW - Shadow color for three-dimensional display elements (for edges facing away from the light source).$COLOR_BTNTEXT - Text on push buttons.$COLOR_CAPTIONTEXT - Text in caption, size box, and scroll bar arrow box.$COLOR_DESKTOP - Desktop.$COLOR_GRADIENTACTIVECAPTION - Right side color in the color gradient of an active window's title bar.$COLOR_ACTIVECAPTION specifies the left side color.Use SPI_GETGRADIENTCAPTIONS with the SystemParametersInfo function to determine whether the gradient effect is enabled.$COLOR_GRADIENTINACTIVECAPTION - Right side color in the color gradient of an inactive window's title bar.$COLOR_INACTIVECAPTION specifies the left side color.$COLOR_GRAYTEXT - Grayed (disabled) text. This color is set to 0 if the current display driver does not support a solid gray color.$COLOR_HIGHLIGHT - Item(s) selected in a control.$COLOR_HIGHLIGHTTEXT - Text of item(s) selected in a control.$COLOR_HOTLIGHT - Color for a hyperlink or hot-tracked item.$COLOR_INACTIVEBORDER - Inactive window border.$COLOR_INACTIVECAPTION - Inactive window caption.Specifies the left side color in the color gradient of an inactive window's title bar if the gradient effect is enabled.$COLOR_INACTIVECAPTIONTEXT - Color of text in an inactive caption.$COLOR_INFOBK - Background color for tooltip controls.$COLOR_INFOTEXT - Text color for tooltip controls.$COLOR_MENU - Menu background.$COLOR_MENUHILIGHT - The color used to highlight menu items when the menu appears as a flat menu.The highlighted menu item is outlined with $COLOR_HIGHLIGHT.$COLOR_MENUBAR - The background color for the menu bar when menus appear as flat menus.However, $COLOR_MENU continues to specify the background color of the menu popup.$COLOR_MENUTEXT - Text in menus.$COLOR_SCROLLBAR - Scroll bar gray area.$COLOR_WINDOW - Window background.$COLOR_WINDOWFRAME - Window frame.$COLOR_WINDOWTEXT - Text in windows.",
      },
    ],
  },
  _WinAPI_GetSysColorBrush: {
    documentation:
      'Retrieves a handle identifying a logical brush that corresponds to the specified color index',
    label: '_WinAPI_GetSysColorBrush ( $iIndex )',
    params: [
      {
        label: '$iIndex',
        documentation: 'The display element whose color is to be retrieved',
      },
    ],
  },
  _WinAPI_GetSystemMetrics: {
    documentation: 'Retrieves the specified system metric or system configuration setting',
    label: '_WinAPI_GetSystemMetrics ( $iIndex )',
    params: [
      {
        label: '$iIndex',
        documentation: 'The system metric or configuration setting to be retrieved',
      },
    ],
  },
  _WinAPI_GetTextExtentPoint32: {
    documentation: 'Computes the width and height of the specified string of text',
    label: '_WinAPI_GetTextExtentPoint32 ( $hDC, $sText )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies the device contex',
      },
      {
        label: '$sText',
        documentation: 'String of text',
      },
    ],
  },
  _WinAPI_GetTextMetrics: {
    documentation: 'Retrieves basic information for the currently selected font',
    label: '_WinAPI_GetTextMetrics ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetWindow: {
    documentation:
      'Retrieves the handle of a window that has a specified relationship to the specified window',
    label: '_WinAPI_GetWindow ( $hWnd, $iCmd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
      {
        label: '$iCmd',
        documentation:
          "Specifies the relationship between the specified window and the window whose handle is to be retrieved.This parameter can be one of the following values:    $GW_CHILD - The retrieved handle identifies the child window at the top of the Z order, if the specified        window is a parent window; otherwise, the retrieved handle is 0.        The function examines only child windows of the specified window. It does not examine descendant windows.    $GW_HWNDFIRST - The retrieved handle identifies the window of the same type that is highest in the Z order.        If the specified window is a topmost window, the handle identifies the topmost window that is highest in the Z order.        If the specified window is a top-level window, the handle identifies the top level window that is highest in the Z order.        If the specified window is a child window, the handle identifies the sibling window that is highest in the Z order.    $GW_HWNDLAST - The retrieved handle identifies the window of the same type that is lowest in the Z order.        If the specified window is a topmost window, the handle identifies the topmost window that is lowest in the Z order.        If the specified window is a top-level window the handle identifies the top-level window that's lowest in the Z order.        If the specified window is a child window, the handle identifies the sibling window that is lowest in the Z order.    $GW_HWNDNEXT - The retrieved handle identifies the window below the specified window in the Z order.        If the specified window is a topmost window, the handle identifies the topmost window below the specified window.        If the specified window is a top-level window, the handle identifies the top-level window below the specified window.        If the specified window is a child window the handle identifies the sibling window below the specified window.    $GW_HWNDPREV - The retrieved handle identifies the window above the specified window in the Z order.        If the specified window is a topmost window, the handle identifies the topmost window above the specified window.        If the specified window is a top-level window, the handle identifies the top-level window above the specified window.        If the specified window is a child window, the handle identifies the sibling window above the specified window.    $GW_OWNER - The retrieved handle identifies the specified window's owner window if any.",
      },
    ],
  },
  _WinAPI_GetWindowDC: {
    documentation: 'Retrieves the device context (DC) for the entire window',
    label: '_WinAPI_GetWindowDC ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_GetWindowHeight: {
    documentation: 'Returns the height of the window',
    label: '_WinAPI_GetWindowHeight ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to a window',
      },
    ],
  },
  _WinAPI_GetWindowLong: {
    documentation: 'Retrieves information about the specified window',
    label: '_WinAPI_GetWindowLong ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
      {
        label: '$iIndex',
        documentation:
          'Specifies the 0-based offset to the value to be retrieved.Valid values are in the range zero through the number of bytes of extra window memory, minus four;for example, if you specified 12 or more bytes of extra memory, a value of 8 would be an index to the third 32 bit integer.To retrieve any other value, specify one of the following values:    $GWL_EXSTYLE - Retrieves the extended window styles    $GWL_STYLE - Retrieves the window styles    $GWL_WNDPROC - Retrieves the address of the window procedure    $GWL_HINSTANCE - Retrieves the handle of the application instance    $GWL_HWNDPARENT - Retrieves the handle of the parent window, if any    $GWL_ID - Retrieves the identifier of the window    $GWL_USERDATA - Retrieves the 32-bit value associated with the window',
      },
    ],
  },
  _WinAPI_GetWindowPlacement: {
    documentation: 'Retrieves the placement of the window for Min, Max, and normal positions',
    label: '_WinAPI_GetWindowPlacement ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
    ],
  },
  _WinAPI_GetWindowRect: {
    documentation: 'Retrieves the dimensions of the bounding rectangle of the specified window',
    label: '_WinAPI_GetWindowRect ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
    ],
  },
  _WinAPI_GetWindowRgn: {
    documentation: 'Obtains a copy of the window region of a window',
    label: '_WinAPI_GetWindowRgn ( $hWnd, $hRgn )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose window region is to be obtained.',
      },
      {
        label: '$hRgn',
        documentation:
          'Handle to the region which will be modified to represent the window region.',
      },
    ],
  },
  _WinAPI_GetWindowText: {
    documentation: "Retrieves the text of the specified window's title bar",
    label: '_WinAPI_GetWindowText ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
    ],
  },
  _WinAPI_GetWindowThreadProcessId: {
    documentation: 'Retrieves the identifier of the thread that created the specified window',
    label: '_WinAPI_GetWindowThreadProcessId ( $hWnd, ByRef $iPID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window handle',
      },
      {
        label: '$iPID',
        documentation: 'Variable to hold the return the process ID (PID) of the thread.',
      },
    ],
  },
  _WinAPI_GetWindowWidth: {
    documentation: 'Returns the width of the window',
    label: '_WinAPI_GetWindowWidth ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to a window',
      },
    ],
  },
  _WinAPI_GetXYFromPoint: {
    documentation: 'Returns the X/Y values from a $tagPOINT structure',
    label: '_WinAPI_GetXYFromPoint ( ByRef $tPoint, ByRef $iX, ByRef $iY )',
    params: [
      {
        label: '$tPoint',
        documentation: '$tagPOINT structure',
      },
      {
        label: '$iX',
        documentation: 'Returns X value',
      },
      {
        label: '$iY',
        documentation: 'Returns Y value',
      },
    ],
  },
  _WinAPI_GlobalMemoryStatus: {
    documentation: 'Retrieves information about current available memory',
    label: '_WinAPI_GlobalMemoryStatus (  )',
    params: [],
  },
  _WinAPI_GUIDFromString: {
    documentation: 'Converts a string GUID to binary form',
    label: '_WinAPI_GUIDFromString ( $sGUID )',
    params: [
      {
        label: '$sGUID',
        documentation: 'GUID in string form',
      },
    ],
  },
  _WinAPI_GUIDFromStringEx: {
    documentation: 'Converts a string GUID to binary form',
    label: '_WinAPI_GUIDFromStringEx ( $sGUID, $tGUID )',
    params: [
      {
        label: '$sGUID',
        documentation: 'GUID in string form',
      },
      {
        label: '$tGUID',
        documentation: 'A $tagGUID structure or a ptr to it where the GUID will be stored',
      },
    ],
  },
  _WinAPI_HiWord: {
    documentation: 'Returns the high word of a longword value',
    label: '_WinAPI_HiWord ( $iLong )',
    params: [
      {
        label: '$iLong',
        documentation: 'Longword value',
      },
    ],
  },
  _WinAPI_InProcess: {
    documentation: 'Determines whether a window belongs to the current process',
    label: '_WinAPI_InProcess ( $hWnd, ByRef $hLastWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window handle to be tested',
      },
      {
        label: '$hLastWnd',
        documentation:
          'Last window tested. If $hWnd = $hLastWnd, this process will immediately return True. Otherwise,_WinAPI_InProcess() will be called. If $hWnd is in process, $hLastWnd will be set to $hWnd on return.',
      },
    ],
  },
  _WinAPI_IntToFloat: {
    documentation: 'Returns a 4 byte integer as a float value',
    label: '_WinAPI_IntToFloat ( $iInt )',
    params: [
      {
        label: '$iInt',
        documentation: 'Integer value',
      },
    ],
  },
  _WinAPI_InvalidateRect: {
    documentation: "Adds a rectangle to the specified window's update region",
    label: '_WinAPI_InvalidateRect ( $hWnd [, $tRECT = 0 [, $bErase = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to windows',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that contains the client coordinates of the rectangle to be added to theupdate region. If this parameter is 0 the entire client area is added to the update region.',
      },
      {
        label: '$bErase',
        documentation:
          '**[optional]** Specifies whether the background within the update region is to be erased when the updateregion is processed. If this parameter is True the background is erased when the BeginPaint function iscalled. If this parameter is False, the background remains unchanged.',
      },
    ],
  },
  _WinAPI_IsClassName: {
    documentation: 'Wrapper to check ClassName of the control',
    label: '_WinAPI_IsClassName ( $hWnd, $sClassName )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to a control',
      },
      {
        label: '$sClassName',
        documentation: 'Class name to check',
      },
    ],
  },
  _WinAPI_IsWindow: {
    documentation: 'Determines whether the specified window handle identifies an existing window',
    label: '_WinAPI_IsWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to be tested',
      },
    ],
  },
  _WinAPI_IsWindowVisible: {
    documentation: 'Retrieves the visibility state of the specified window',
    label: '_WinAPI_IsWindowVisible ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
    ],
  },
  _WinAPI_LineTo: {
    documentation:
      'Draws a line from the current position up to, but not including, the specified point',
    label: '_WinAPI_LineTo ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to device context',
      },
      {
        label: '$iX',
        documentation: "X coordinate of the line's ending point.",
      },
      {
        label: '$iY',
        documentation: "Y coordinate of the line's ending point.",
      },
    ],
  },
  _WinAPI_LoadBitmap: {
    documentation: "Loads the specified bitmap resource from a module's executable file",
    label: '_WinAPI_LoadBitmap ( $hInstance, $sBitmap )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the instance of the module whose executable file contains the bitmap to be loaded',
      },
      {
        label: '$sBitmap',
        documentation:
          'The name of the bitmap resource to be loaded. Alternatively this can consist of the resourceidentifier in the low order word and 0 in the high order word.',
      },
    ],
  },
  _WinAPI_LoadImage: {
    documentation: 'Loads an icon, cursor, or bitmap',
    label: '_WinAPI_LoadImage ( $hInstance, $sImage, $iType, $iXDesired, $iYDesired, $iLoad )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Identifies an instance of the module that contains the image to be loaded. To load an OEMimage, set this parameter to zero.',
      },
      {
        label: '$sImage',
        documentation:
          'Identifies the image to load. If the $hInstance parameter is not 0 and the $iLoad parameterdoes not include $LR_LOADFROMFILE $sImage is a string that contains the name of the image resource in the$hInstance module. If $hInstance is 0 and $LR_LOADFROMFILE is not specified, the low-order word of thisparameter must be the identifier of the OEM image to load.',
      },
      {
        label: '$iType',
        documentation:
          'Specifies the type of image to be loaded. This parameter can be one of the following values:$IMAGE_BITMAP - Loads a bitmap$IMAGE_CURSOR - Loads a cursor$IMAGE_ICON - Loads an icon',
      },
      {
        label: '$iXDesired',
        documentation:
          'Specifies the width, in pixels, of the icon or cursor. If this is 0and $iLoad is $LR_DEFAULTSIZE the function uses the SM_CXICON or SM_CXCURSOR systemmetric value to set the width. If this parameter is 0 and $LR_DEFAULTSIZE is notused, the function uses the actual resource width.',
      },
      {
        label: '$iYDesired',
        documentation:
          'Specifies the height, in pixels, of the icon or cursor. If this is 0and $iLoad is $LR_DEFAULTSIZE the function uses the SM_CYICON or SM_CYCURSOR systemmetric value to set the height. If this parameter is 0 and $LR_DEFAULTSIZE is notused, the function uses the actual resource height.',
      },
      {
        label: '$iLoad',
        documentation:
          'Specifies a combination of the following values:$LR_DEFAULTCOLOR - The default flag$LR_CREATEDIBSECTION - When the $iType parameter specifies $IMAGE_BITMAP, causes the function to return a DIBsection bitmap rather than a compatible bitmap. This flag is useful for loading a bitmap without mapping itto the colors of the display device.$LR_DEFAULTSIZE - Uses the width or height specified by the system metric values for cursors or icons ifthe $iXDesired or $iYDesired values are set to 0. If this flag is not specified and $iXDesired and $iYDesiredare set to zero, the function uses the actual resource size. If the resource contains multiple images thefunction uses the size of the first image.$LR_LOADFROMFILE - Loads the image from the file specified by the $sImage parameter. If this flag is notspecified, $sImage is the name of the resource.$LR_LOADMAP3DCOLORS - Searches the color table for the image and replaces the following shades of gray withthe corresponding 3D color:Dk Gray: RGB(128,128,128) COLOR_3DSHADOWGray : RGB(192,192,192) COLOR_3DFACELt Gray: RGB(223,223,223) COLOR_3DLIGHT$LR_LOADTRANSPARENT - Gets the color value of the first pixel in the image and replaces the correspondingentry in the color table with the default window color. All pixels in the image that use that entry becomethe default window color. This value applies only to images that have corresponding color tables. If $iLoadincludes both the $LR_LOADTRANSPARENT and $LR_LOADMAP3DCOLORS values, $LRLOADTRANSPARENT takes precedence.However, the color table entry is replaced with COLOR_3DFACE rather than COLOR_WINDOW.$LR_MONOCHROME - Loads the image in black and white$LR_SHARED - Shares the image handle if the image is loaded multiple times. If LR_SHARED is not set,a second call to LoadImage for the same resource will load the image again and return a different handle. Donot use $LR_SHARED for images that have non-standard sizes, that may change after loading, or that are loadedfrom a file.',
      },
    ],
  },
  _WinAPI_LoadLibrary: {
    documentation:
      'Maps a specified executable module into the address space of the calling process',
    label: '_WinAPI_LoadLibrary ( $sFileName )',
    params: [
      {
        label: '$sFileName',
        documentation:
          'Names a Win32 executable module (either a .dll or an .exe file). The name specified is thefilename of the executable module.',
      },
    ],
  },
  _WinAPI_LoadLibraryEx: {
    documentation:
      'Maps a specified executable module into the address space of the calling process',
    label: '_WinAPI_LoadLibraryEx ( $sFileName [, $iFlags = 0] )',
    params: [
      {
        label: '$sFileName',
        documentation:
          'Names a Win32 executable module (either a .dll or an .exe file). The name specified is thefilename of the executable module.',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** Specifies the action to take when loading the module. This parameter can be one of thefollowing values:$DONT_RESOLVE_DLL_REFERENCES - If this value is used and the executable module is a DLL the system does not call DllMain for process and thread initialization and termination. Also, the system does not load additional executable modules that are referenced by the specified module.$LOAD_LIBRARY_AS_DATAFILE - If this value is used, the system maps the file into the calling process's address space as if it were a data file. Nothing is done to execute or prepare to execute the mapped file.$LOAD_WITH_ALTERED_SEARCH_PATH - If this value is used, and $FileName specifies a path, the system uses the alternate file search strategy to find the associated executable modules that the specified module causes to be loaded.",
      },
    ],
  },
  _WinAPI_LoadShell32Icon: {
    documentation: 'Extracts an icon from the shell32.dll file',
    label: '_WinAPI_LoadShell32Icon ( $iIconID )',
    params: [
      {
        label: '$iIconID',
        documentation: 'ID of the icon to extract',
      },
    ],
  },
  _WinAPI_LoadString: {
    documentation:
      'loads a string resource from the executable file associated with a specified module',
    label: '_WinAPI_LoadString ( $hInstance, $iStringID )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to an instance of the module whose executable file contains the string resource',
      },
      {
        label: '$iStringID',
        documentation: 'Specifies the integer identifier of the string to be loaded',
      },
    ],
  },
  _WinAPI_LocalFree: {
    documentation: 'Frees the specified local memory object and invalidates its handle',
    label: '_WinAPI_LocalFree ( $hMemory )',
    params: [
      {
        label: '$hMemory',
        documentation: 'A handle to the local memory object',
      },
    ],
  },
  _WinAPI_LoWord: {
    documentation: 'Returns the low word of a longword',
    label: '_WinAPI_LoWord ( $iLong )',
    params: [
      {
        label: '$iLong',
        documentation: 'Longword value',
      },
    ],
  },
  _WinAPI_MAKELANGID: {
    documentation: 'Construct language id from a primary language id and a sublanguage id',
    label: '_WinAPI_MAKELANGID ( $iLngIDPrimary, $iLngIDSub )',
    params: [
      {
        label: '$iLngIDPrimary',
        documentation: 'Primary Language id',
      },
      {
        label: '$iLngIDSub',
        documentation: 'Sub-Language id',
      },
    ],
  },
  _WinAPI_MAKELCID: {
    documentation: 'Construct locale id from a language id and a sort id',
    label: '_WinAPI_MAKELCID ( $iLngID, $iSortID )',
    params: [
      {
        label: '$iLngID',
        documentation: 'Language id',
      },
      {
        label: '$iSortID',
        documentation: 'Sort id',
      },
    ],
  },
  _WinAPI_MakeLong: {
    documentation: 'Returns a long int value from two int values',
    label: '_WinAPI_MakeLong ( $iLo, $iHi )',
    params: [
      {
        label: '$iLo',
        documentation: 'Low word',
      },
      {
        label: '$iHi',
        documentation: 'Hi word',
      },
    ],
  },
  _WinAPI_MakeQWord: {
    documentation: 'Returns a QWORD value from two int values',
    label: '_WinAPI_MakeQWord ( $iLoDWORD, $iHiDWORD )',
    params: [
      {
        label: '$iLoDWORD',
        documentation: 'Low DWORD (int)',
      },
      {
        label: '$iHiDWORD',
        documentation: 'Hi DWORD (int)',
      },
    ],
  },
  _WinAPI_MessageBeep: {
    documentation: 'Plays a waveform sound',
    label: '_WinAPI_MessageBeep ( [$iType = 1] )',
    params: [
      {
        label: '$iType',
        documentation:
          '**[optional]** The sound type, as identified by an entry in the registry. This can be one of the followingvalues:0 - Simple beep. If a sound card is not available, the speaker is used.1 - OK2 - Hand3 - Question4 - Exclamation5 - Asterisk',
      },
    ],
  },
  _WinAPI_Mouse_Event: {
    documentation: 'Synthesizes mouse motion and button clicks',
    label:
      '_WinAPI_Mouse_Event ( $iFlags [, $iX = 0 [, $iY = 0 [, $iData = 0 [, $iExtraInfo = 0]]]] )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'A set of flag bits that specify various aspects of mouse motion and button clicking. The bitsin this parameter can be any reasonable combination of the following values:$MOUSEEVENTF_ABSOLUTE - Specifies that the $iX and $iY parameters contain normal absolute coordinates. Ifnot set, those parameters contain relative data. The change in position since the last reported position.This flag can be set, or not set, regardless of what kind of mouse or mouse-like device, if any, is connectedto the system.$MOUSEEVENTF_MOVE - Specifies that movement occurred$MOUSEEVENTF_LEFTDOWN - Specifies that the left button changed to down$MOUSEEVENTF_LEFTUP - Specifies that the left button changed to up$MOUSEEVENTF_RIGHTDOWN - Specifies that the right button changed to down$MOUSEEVENTF_RIGHTUP - Specifies that the right button changed to up$MOUSEEVENTF_MIDDLEDOWN - Specifies that the middle button changed to down$MOUSEEVENTF_MIDDLEUP - Specifies that the middle button changed to up$MOUSEEVENTF_WHEEL - Specifies that the wheel has been moved, if the mouse has a wheel$MOUSEEVENTF_XDOWN - Specifies that an X button was pressed$MOUSEEVENTF_XUP - Specifies that an X button was released',
      },
      {
        label: '$iX',
        documentation:
          "**[optional]** Specifies the mouse's absolute position along the X axis or its amount of motion since thelast mouse event was generated depending on the setting of $MOUSEEVENTF_ABSOLUTE. Absolute data is given asthe mouse's actual X coordinate relative data is given as the number of mickeys moved.",
      },
      {
        label: '$iY',
        documentation:
          "**[optional]** Specifies the mouse's absolute position along the Y axis or its amount of motion since thelast mouse event was generated depending on the setting of $MOUSEEVENTF_ABSOLUTE. Absolute data is given asthe mouse's actual Y coordinate relative data is given as the number of mickeys moved.",
      },
      {
        label: '$iData',
        documentation:
          '**[optional]** If $iFlags is $MOUSEEVENTF_WHEEL, then $iData specifies the amount of wheel movement. A positivevalue indicates that the wheel was rotated forward away from the user. A negative value indicates that thewheel was rotated backward, toward the user. One wheel click is defined as $WHEEL_DELTA, which is 120. If$iFlags is not $MOUSEEVENTF_WHEEL, then $iData should be zero.',
      },
      {
        label: '$iExtraInfo',
        documentation: '**[optional]** Specifies a 32 bit value associated with the mouse event',
      },
    ],
  },
  _WinAPI_MoveTo: {
    documentation: 'Updates the current position to the specified point',
    label: '_WinAPI_MoveTo ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to device context',
      },
      {
        label: '$iX',
        documentation: 'X coordinate of the new position.',
      },
      {
        label: '$iY',
        documentation: 'Y coordinate of the new position.',
      },
    ],
  },
  _WinAPI_MoveWindow: {
    documentation: 'Changes the position and dimensions of the specified window',
    label: '_WinAPI_MoveWindow ( $hWnd, $iX, $iY, $iWidth, $iHeight [, $bRepaint = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
      {
        label: '$iX',
        documentation: 'New position of the left side of the window',
      },
      {
        label: '$iY',
        documentation: 'New position of the top of the window',
      },
      {
        label: '$iWidth',
        documentation: 'New width of the window',
      },
      {
        label: '$iHeight',
        documentation: 'New height of the window',
      },
      {
        label: '$bRepaint',
        documentation:
          '**[optional]** Specifies whether the window is to be repainted. If True, the window receives a $WM_PAINTmessage. If False, no repainting of any kind occurs. This applies to the client area, the nonclient area, andany part of the parent window uncovered as a result of moving a child window. If False, the application mustexplicitly invalidate or redraw any parts of the window and parent window that need redrawing.',
      },
    ],
  },
  _WinAPI_MsgBox: {
    documentation: 'Displays a message box with wider margin than original',
    label: '_WinAPI_MsgBox ( $iFlags, $sTitle, $sText )',
    params: [
      {
        label: '$iFlags',
        documentation: 'Flags to use during window creation',
      },
      {
        label: '$sTitle',
        documentation: 'Window title',
      },
      {
        label: '$sText',
        documentation: 'Window text',
      },
    ],
  },
  _WinAPI_MulDiv: {
    documentation:
      'Multiplies two 32-bit values and then divides the 64-bit result by a third 32-bit value',
    label: '_WinAPI_MulDiv ( $iNumber, $iNumerator, $iDenominator )',
    params: [
      {
        label: '$iNumber',
        documentation: 'Specifies the multiplicand',
      },
      {
        label: '$iNumerator',
        documentation: 'Specifies the multiplier',
      },
      {
        label: '$iDenominator',
        documentation:
          'Specifies the number by which the result of the multiplication is to be divided',
      },
    ],
  },
  _WinAPI_MultiByteToWideChar: {
    documentation: 'Maps a character string to a wide-character (Unicode) string',
    label:
      '_WinAPI_MultiByteToWideChar ( $vText [, $iCodePage = 0 [, $iFlags = 0 [, $bRetString = False]]] )',
    params: [
      {
        label: '$vText',
        documentation: 'Text or DllStruct containing multibyte text to be converted',
      },
      {
        label: '$iCodePage',
        documentation:
          '**[optional]** Specifies the code page to be used to perform the conversion:    0 - ANSI code page    1 - OEM code page    2 - Macintosh code page    3 - The Windows ANSI code page for the current thread    42 - Symbol code page    65000 - UTF-7    65001 - UTF-8',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Flags that indicate whether to translate to precomposed or composite wide characters:    $MB_PRECOMPOSED - Always use precomposed characters    $MB_COMPOSITE - Always use composite characters    $MB_USEGLYPHCHARS - Use glyph characters instead of control characters',
      },
      {
        label: '$bRetString',
        documentation:
          '**[optional]** Flags that indicate whether to return a String or a DllStruct (default False : Structure)',
      },
    ],
  },
  _WinAPI_MultiByteToWideCharEx: {
    documentation: 'Maps a character string to a wide-character (Unicode) string',
    label: '_WinAPI_MultiByteToWideCharEx ( $sText, $pText [, $iCodePage = 0 [, $iFlags = 0]] )',
    params: [
      {
        label: '$sText',
        documentation: 'Text to be converted',
      },
      {
        label: '$pText',
        documentation: 'Pointer to a byte structure where the converted string will be stored',
      },
      {
        label: '$iCodePage',
        documentation:
          '**[optional]** Specifies the code page to be used to perform the conversion:    0 - ANSI code page    1 - OEM code page    2 - Macintosh code page',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Flags that indicate whether to translate to precomposed or composite wide characters:    $MB_PRECOMPOSED - Always use precomposed characters    $MB_COMPOSITE - Always use composite characters    $MB_USEGLYPHCHARS - Use glyph characters instead of control characters',
      },
    ],
  },
  _WinAPI_OpenProcess: {
    documentation: 'Returns a handle of an existing process object',
    label: '_WinAPI_OpenProcess ( $iAccess, $bInherit, $iPID [, $bDebugPriv = False] )',
    params: [
      {
        label: '$iAccess',
        documentation: 'Specifies the access to the process object',
      },
      {
        label: '$bInherit',
        documentation: 'Specifies whether the returned handle can be inherited',
      },
      {
        label: '$iPID',
        documentation: 'Specifies the process identifier of the process to open',
      },
      {
        label: '$bDebugPriv',
        documentation:
          '**[optional]** Certain system processes can not be opened unless you have the debug security privilege.If True, this function will attempt to open the process with debug privileges if the process can not be opened with standard access privileges.',
      },
    ],
  },
  _WinAPI_PathFindOnPath: {
    documentation: 'Searchs for a file in the default system paths',
    label: '_WinAPI_PathFindOnPath ( $sFilePath [, $aExtraPaths = "" [, $sPathDelimiter = @LF]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Filename to search for',
      },
      {
        label: '$aExtraPaths',
        documentation: '**[optional]** Extra paths to check before any others.',
      },
      {
        label: '$sPathDelimiter',
        documentation:
          "**[optional]** Delimiter used to split $aExtraPaths if it's an non-empty string (StringSplit() with flag $STR_NOCOUNT (2)).",
      },
    ],
  },
  _WinAPI_PointFromRect: {
    documentation: 'Returns the top/left coordinates of a $tagRECT as a $tagPOINT structure',
    label: '_WinAPI_PointFromRect ( ByRef $tRECT [, $bCenter = True] )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure',
      },
      {
        label: '$bCenter',
        documentation:
          '**[optional]** If True, the return will be a point at the center of the rectangle, otherwise the left/topcoordinates are returned.',
      },
    ],
  },
  _WinAPI_PostMessage: {
    documentation: 'Places a message in the message queue and then returns',
    label: '_WinAPI_PostMessage ( $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Identifies the window whose window procedure will receive the message.If this parameter is 0xFFFF (HWND_BROADCAST), the message is sent to all top-level windows in the system, including disabled or invisible windows, overlapped windows, and pop-up windows; but the message is not sent to child windows.',
      },
      {
        label: '$iMsg',
        documentation: 'Specifies the message to be sent',
      },
      {
        label: '$wParam',
        documentation: 'First message parameter',
      },
      {
        label: '$lParam',
        documentation: 'Second message parameter',
      },
    ],
  },
  _WinAPI_PrimaryLangId: {
    documentation: 'Extract primary language id from a language id',
    label: '_WinAPI_PrimaryLangId ( $iLngID )',
    params: [
      {
        label: '$iLngID',
        documentation: 'Language id',
      },
    ],
  },
  _WinAPI_PtInRect: {
    documentation: 'Determines whether the specified point lies within the specified rectangle',
    label: '_WinAPI_PtInRect ( ByRef $tRECT, ByRef $tPoint )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the specified rectangle',
      },
      {
        label: '$tPoint',
        documentation: '$tagPOINT structure that contains the specified point',
      },
    ],
  },
  _WinAPI_ReadFile: {
    documentation: 'Reads data from a file',
    label: '_WinAPI_ReadFile ( $hFile, $pBuffer, $iToRead, ByRef $iRead [, $tOverlapped = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file to be read',
      },
      {
        label: '$pBuffer',
        documentation: 'Pointer to the buffer that receives the data read from a file',
      },
      {
        label: '$iToRead',
        documentation: 'Maximum number of bytes to read',
      },
      {
        label: '$iRead',
        documentation: 'Number of bytes read',
      },
      {
        label: '$tOverlapped',
        documentation: '**[optional]** A $tagOVERLAPPED structure or a pointer to it',
      },
    ],
  },
  _WinAPI_ReadProcessMemory: {
    documentation: 'Reads memory in a specified process',
    label: '_WinAPI_ReadProcessMemory ( $hProcess, $pBaseAddress, $pBuffer, $iSize, ByRef $iRead )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Identifies an open handle of a process whose memory is read',
      },
      {
        label: '$pBaseAddress',
        documentation: 'Points to the base address in the specified process to be read',
      },
      {
        label: '$pBuffer',
        documentation: 'Points to a buffer that receives the contents from the address space',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the requested number of bytes to read from the specified process',
      },
      {
        label: '$iRead',
        documentation: 'The actual number of bytes transferred into the specified buffer',
      },
    ],
  },
  _WinAPI_RectIsEmpty: {
    documentation: 'Determins whether a rectangle is empty',
    label: '_WinAPI_RectIsEmpty ( ByRef $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRect structure',
      },
    ],
  },
  _WinAPI_RedrawWindow: {
    documentation: "Updates the specified rectangle or region in a window's client area",
    label: '_WinAPI_RedrawWindow ( $hWnd [, $tRECT = 0 [, $hRegion = 0 [, $iFlags = 5]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to a Window',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure containing the coordinates of the update rectangle. This parameter isignored if the $hRegion parameter identifies a region.',
      },
      {
        label: '$hRegion',
        documentation:
          '**[optional]** Identifies the update region. If the $hRegion and $tRECT parameters are 0, the entire clientarea is added to the update region.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Specifies the redraw flags. This parameter can be a combination of flags that invalidate or validate a window, control repainting, and control which windows are affected:    $RDW_ERASE - Causes the window to receive a WM_ERASEBKGND message when the window is repainted    $RDW_FRAME - Causes any part of the nonclient area of the window that intersects the update region to receive a WM_NCPAINT message.    $RDW_INTERNALPAINT - Causes a WM_PAINT message to be posted to the window regardless of whether any portion of the window is invalid.    $RDW_INVALIDATE - Invalidates $tRECT or $hRegion. If both are 0, the entire window is invalidated.    $RDW_NOERASE - Suppresses any pending $WM_ERASEBKGND messages    $RDW_NOFRAME - Suppresses any pending $WM_NCPAINT messages    $RDW_NOINTERNALPAINT - Suppresses any pending internal $WM_PAINT messages    $RDW_VALIDATE - Validates $tRECT or $hRegion    $RDW_ERASENOW - Causes the affected windows to receive $WM_NCPAINT and $WM_ERASEBKGND messages, if necessary, before the function returns    $RDW_UPDATENOW - Causes the affected windows to receive $WM_NCPAINT, $WM_ERASEBKGND, and $WM_PAINT messages, if necessary, before the function returns.    $RDW_ALLCHILDREN - Includes child windows in the repainting operation    $RDW_NOCHILDREN - Excludes child windows from the repainting operation',
      },
    ],
  },
  _WinAPI_RegisterWindowMessage: {
    documentation:
      'Defines a new window message that is guaranteed to be unique throughout the system',
    label: '_WinAPI_RegisterWindowMessage ( $sMessage )',
    params: [
      {
        label: '$sMessage',
        documentation: 'String that specifies the message to be registered',
      },
    ],
  },
  _WinAPI_ReleaseCapture: {
    documentation:
      'Releases the mouse capture from a window in the current thread and restores normal mouse input processing',
    label: '_WinAPI_ReleaseCapture (  )',
    params: [],
  },
  _WinAPI_ReleaseDC: {
    documentation: 'Releases a device context',
    label: '_WinAPI_ReleaseDC ( $hWnd, $hDC )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
      {
        label: '$hDC',
        documentation: 'Identifies the device context to be released',
      },
    ],
  },
  _WinAPI_ScreenToClient: {
    documentation:
      'Converts screen coordinates of a specified point on the screen to client coordinates',
    label: '_WinAPI_ScreenToClient ( $hWnd, ByRef $tPoint )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Identifies the window that be used for the conversion',
      },
      {
        label: '$tPoint',
        documentation: '$tagPOINT structure that contains the screen coordinates to be converted',
      },
    ],
  },
  _WinAPI_SelectObject: {
    documentation: 'Selects an object into the specified device context',
    label: '_WinAPI_SelectObject ( $hDC, $hGDIObj )',
    params: [
      {
        label: '$hDC',
        documentation: 'Identifies the device context',
      },
      {
        label: '$hGDIObj',
        documentation: 'Identifies the object to be selected',
      },
    ],
  },
  _WinAPI_SetBkColor: {
    documentation: 'Sets the current background color to the specified color value',
    label: '_WinAPI_SetBkColor ( $hDC, $iColor )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iColor',
        documentation: 'Specifies the new background color',
      },
    ],
  },
  _WinAPI_SetBkMode: {
    documentation: 'Sets the background mix mode of the specified device context',
    label: '_WinAPI_SetBkMode ( $hDC, $iBkMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to device context',
      },
      {
        label: '$iBkMode',
        documentation:
          'Specifies the background mix mode. This parameter can be one of the following values.OPAQUE - Background is filled with the current background color before the text, hatched brush, or pen is drawn.TRANSPARENT - Background remains untouched.',
      },
    ],
  },
  _WinAPI_SetCapture: {
    documentation: 'Sets the mouse capture to the specified window belonging to the current thread',
    label: '_WinAPI_SetCapture ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window in the current thread that is to capture the mouse',
      },
    ],
  },
  _WinAPI_SetCursor: {
    documentation: 'Establishes the cursor shape',
    label: '_WinAPI_SetCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Identifies the cursor',
      },
    ],
  },
  _WinAPI_SetDefaultPrinter: {
    documentation: 'Sets the default printer for the current user on the local computer',
    label: '_WinAPI_SetDefaultPrinter ( $sPrinter )',
    params: [
      {
        label: '$sPrinter',
        documentation:
          'The default printer name. For a remote printer, the name format is \\\\server\\printername. For alocal printer, the name format is printername. If this parameter is "", this function does nothing if thereis already a default printer. However, if there is no default printer, this function sets the default printerto the first printer, if any, in an enumeration of printers installed on the local computer.',
      },
    ],
  },
  _WinAPI_SetDIBits: {
    documentation: 'Sets the pixels in a compatible bitmap using the color data found in a DIB',
    label:
      '_WinAPI_SetDIBits ( $hDC, $hBitmap, $iStartScan, $iScanLines, $pBits, $tBMI [, $iColorUse = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the compatible bitmap (DDB) that is to be altered using the color data from the DIB',
      },
      {
        label: '$iStartScan',
        documentation:
          'Specifies the starting scan line for the device-independent color data in the array pointed to by the $pBits parameter.',
      },
      {
        label: '$iScanLines',
        documentation:
          'Specifies the number of scan lines found in the array containing device-independent color data',
      },
      {
        label: '$pBits',
        documentation:
          'Pointer to the DIB color data, stored as an array of bytes.The format of the bitmap values depends on the biBitCount member of the $tagBITMAPINFO structure pointed to by the $pBMI parameter.',
      },
      {
        label: '$tBMI',
        documentation:
          'A $tagBITMAPINFO structure or a pointer to it that contains information about the DIB',
      },
      {
        label: '$iColorUse',
        documentation:
          '**[optional]** Specifies whether the iColors member of the $tagBITMAPINFO structure was provided and, if so,whether iColors contains explicit red, green, blue (RGB) values or palette indexes.The $iColorUse parameter must be one of the following values:    0 - The color table is provided and contains literal RGB values    1 - The color table consists of an array of 16-bit indexes into the logical palette of $hDC',
      },
    ],
  },
  _WinAPI_SetEndOfFile: {
    documentation:
      'Sets the physical file size for the specified file to the current position of the file pointer',
    label: '_WinAPI_SetEndOfFile ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file to be extended or truncated.The file handle must have the $GENERIC_WRITE access right.',
      },
    ],
  },
  _WinAPI_SetEvent: {
    documentation: 'Sets the specified event object to the signaled state',
    label: '_WinAPI_SetEvent ( $hEvent )',
    params: [
      {
        label: '$hEvent',
        documentation: 'Handle to the event object',
      },
    ],
  },
  _WinAPI_SetFilePointer: {
    documentation: 'Moves the file pointer of the specified file',
    label: '_WinAPI_SetFilePointer ( $hFile, $iPos [, $iMethod = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file to be processed',
      },
      {
        label: '$iPos',
        documentation:
          'Number of bytes to move the file pointer. Maximum value is 2^32A positive value moves the file pointer forward in the file, and a negative value moves the file pointer back.',
      },
      {
        label: '$iMethod',
        documentation:
          '**[optional]** The starting point for the file pointer move.Can be one of the predefined values:    $FILE_BEGIN (0) = (default) The starting point is zero (0) or the beginning of the file    $FILE_CURRENT (1) = The starting point is the current value of the file pointer.    $FILE_END (2) = The starting point is the current end-of-file position.',
      },
    ],
  },
  _WinAPI_SetFocus: {
    documentation: 'Sets the keyboard focus to the specified window',
    label: '_WinAPI_SetFocus ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Identifies the window that will receive the keyboard input. If this parameter is 0, keystrokesare ignored.',
      },
    ],
  },
  _WinAPI_SetFont: {
    documentation: 'Sets a window font',
    label: '_WinAPI_SetFont ( $hWnd, $hFont [, $bRedraw = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Window handle',
      },
      {
        label: '$hFont',
        documentation: 'Font handle',
      },
      {
        label: '$bRedraw',
        documentation: '**[optional]** True to redraw the control',
      },
    ],
  },
  _WinAPI_SetHandleInformation: {
    documentation: 'Sets certain properties of an object handle',
    label: '_WinAPI_SetHandleInformation ( $hObject, $iMask, $iFlags )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to an object',
      },
      {
        label: '$iMask',
        documentation: 'Specifies the bit flags to be changed',
      },
      {
        label: '$iFlags',
        documentation: 'Specifies properties of the object handle',
      },
    ],
  },
  _WinAPI_SetLastError: {
    documentation: 'Sets the last-error code for the calling thread',
    label: '_WinAPI_SetLastError ( $iErrorCode )',
    params: [
      {
        label: '$iErrorCode',
        documentation: 'The last error code for the thread',
      },
    ],
  },
  _WinAPI_SetLayeredWindowAttributes: {
    documentation: 'Sets Layered Window Attributes',
    label:
      '_WinAPI_SetLayeredWindowAttributes ( $hWnd, $iTransColor [, $iTransGUI = 255 [, $iFlags = 0x03 [, $bColorRef = False]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of GUI to work on',
      },
      {
        label: '$iTransColor',
        documentation: 'Transparent color',
      },
      {
        label: '$iTransGUI',
        documentation: '**[optional]** Set Transparancy of GUI',
      },
      {
        label: '$iFlags',
        documentation: '**[optional]** Flags.',
      },
      {
        label: '$bColorRef',
        documentation:
          '**[optional]** If True, $iTransColor is a COLORREF( 0x00bbggrr ), else an RGB-Color',
      },
    ],
  },
  _WinAPI_SetParent: {
    documentation: 'Changes the parent window of the specified child window',
    label: '_WinAPI_SetParent ( $hWndChild, $hWndParent )',
    params: [
      {
        label: '$hWndChild',
        documentation: 'Window handle of child window',
      },
      {
        label: '$hWndParent',
        documentation:
          'Handle to the new parent window. If 0, the desktop window becomes the new parent window.',
      },
    ],
  },
  _WinAPI_SetProcessAffinityMask: {
    documentation: 'Sets a processor affinity mask for the threads of a specified process',
    label: '_WinAPI_SetProcessAffinityMask ( $hProcess, $iMask )',
    params: [
      {
        label: '$hProcess',
        documentation: 'A handle to the process whose affinity mask the function sets',
      },
      {
        label: '$iMask',
        documentation: 'Affinity mask',
      },
    ],
  },
  _WinAPI_SetSysColors: {
    documentation: 'Obtains information about the display devices in a system',
    label: '_WinAPI_SetSysColors ( $vElements, $vColors )',
    params: [
      {
        label: '$vElements',
        documentation: 'Single element or Array of elements',
      },
      {
        label: '$vColors',
        documentation: 'Single Color or Array of colors',
      },
    ],
  },
  _WinAPI_SetTextColor: {
    documentation: 'Sets the current text color to the specified color value',
    label: '_WinAPI_SetTextColor ( $hDC, $iColor )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context',
      },
      {
        label: '$iColor',
        documentation: 'Specifies the new text color',
      },
    ],
  },
  _WinAPI_SetWindowLong: {
    documentation: 'Sets information about the specified window',
    label: '_WinAPI_SetWindowLong ( $hWnd, $iIndex, $iValue )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
      {
        label: '$iIndex',
        documentation:
          'Specifies the 0-based offset to the value to be set.Valid values are in the range zero through the number of bytes of extra window memory, minus four;for example, if you specified 12 or more bytes of extra memory, a value of 8 would be an index to the third 32-bit integer.To retrieve any other value specify one of the following values:    $GWL_EXSTYLE - Sets the extended window styles    $GWL_STYLE - Sets the window styles    $GWL_WNDPROC - Sets the address of the window procedure    $GWL_HINSTANCE - Sets the handle of the application instance    $GWL_HWNDPARENT - Sets the handle of the parent window, if any    $GWL_ID - Sets the identifier of the window    $GWL_USERDATA - Sets the 32-bit value associated with the window',
      },
      {
        label: '$iValue',
        documentation: 'Specifies the replacement value',
      },
    ],
  },
  _WinAPI_SetWindowPlacement: {
    documentation: 'Sets the placement of the window for Min, Max, and normal positions',
    label: '_WinAPI_SetWindowPlacement ( $hWnd, $tWindowPlacement )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window',
      },
      {
        label: '$tWindowPlacement',
        documentation: 'A $tagWINDOWPLACEMENT structure or a pointer to it',
      },
    ],
  },
  _WinAPI_SetWindowPos: {
    documentation:
      'Changes the size, position, and Z order of a child, pop-up, or top-level window',
    label: '_WinAPI_SetWindowPos ( $hWnd, $hAfter, $iX, $iY, $iCX, $iCY, $iFlags )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
      {
        label: '$hAfter',
        documentation:
          'Identifies the window to precede the positioned window in the Z order. This parameter must be awindow handle or one of the following values:    $HWND_BOTTOM - Places the window at the bottom of the Z order    $HWND_NOTOPMOST - Places the window above all non-topmost windows    $HWND_TOP - Places the window at the top of the Z order    $HWND_TOPMOST - Places the window above all non-topmost windows',
      },
      {
        label: '$iX',
        documentation: 'Specifies the new position of the left side of the window',
      },
      {
        label: '$iY',
        documentation: 'Specifies the new position of the top of the window',
      },
      {
        label: '$iCX',
        documentation: 'Specifies the new width of the window, in pixels',
      },
      {
        label: '$iCY',
        documentation: 'Specifies the new height of the window, in pixels',
      },
      {
        label: '$iFlags',
        documentation:
          "Specifies the window sizing and positioning flags:    $SWP_DRAWFRAME - Draws a frame around the window    $SWP_FRAMECHANGED - Sends a $WM_NCCALCSIZE message to the window, even if the window's size is not changed    $SWP_HIDEWINDOW - Hides the window    $SWP_NOACTIVATE - Does not activate the window    $SWP_NOCOPYBITS - Discards the entire contents of the client area    $SWP_NOMOVE - Retains the current position    $SWP_NOOWNERZORDER - Does not change the owner window's position in the Z order    $SWP_NOREDRAW - Does not redraw changes    $SWP_NOREPOSITION - Same as the $SWP_NOOWNERZORDER flag    $SWP_NOSENDCHANGING - Prevents the window from receiving $WM_WINDOWPOSCHANGING    $SWP_NOSIZE - Retains the current size    $SWP_NOZORDER - Retains the current Z order    $SWP_SHOWWINDOW - Displays the window",
      },
    ],
  },
  _WinAPI_SetWindowRgn: {
    documentation: 'Sets the window region of a window',
    label: '_WinAPI_SetWindowRgn ( $hWnd, $hRgn [, $bRedraw = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose window region is to be set.',
      },
      {
        label: '$hRgn',
        documentation:
          'Handle to a region. The function sets the window region of the window to this region.',
      },
      {
        label: '$bRedraw',
        documentation:
          '**[optional]** Specifies whether the system redraws the window after setting the window region.',
      },
    ],
  },
  _WinAPI_SetWindowsHookEx: {
    documentation: 'Installs an application-defined hook procedure into a hook chain',
    label: '_WinAPI_SetWindowsHookEx ( $iHook, $pProc, $hDll [, $iThreadId = 0] )',
    params: [
      {
        label: '$iHook',
        documentation:
          "Specifies the type of hook procedure to be installed. This parameter can be one of the following values:    $WH_CALLWNDPROC - Installs a hook procedure that monitors messages before the system sends them to the destination window procedure    $WH_CALLWNDPROCRET - Installs a hook procedure that monitors messages after they have been processed by the destination window procedure    $WH_CBT - Installs a hook procedure that receives notifications useful to a computer-based training (CBT) application    $WH_DEBUG - Installs a hook procedure useful for debugging other hook procedures    $WH_FOREGROUNDIDLE - Installs a hook procedure that will be called when the application's foreground thread is about to become idle    $WH_GETMESSAGE - Installs a hook procedure that monitors messages posted to a message queue    $WH_JOURNALPLAYBACK - Installs a hook procedure that posts messages previously recorded by a $WH_JOURNALRECORD hook procedure    $WH_JOURNALRECORD - Installs a hook procedure that records input messages posted to the system message queue    $WH_KEYBOARD - Installs a hook procedure that monitors keystroke messages    $WH_KEYBOARD_LL - Installs a hook procedure that monitors low-level keyboard input events    $WH_MOUSE - Installs a hook procedure that monitors mouse messages    $WH_MOUSE_LL - Installs a hook procedure that monitors low-level mouse input events    $WH_MSGFILTER - Installs a hook procedure that monitors messages generated as a result of an input event in a dialog box, message box, menu, or scroll bar    $WH_SHELL - Installs a hook procedure that receives notifications useful to shell applications    $WH_SYSMSGFILTER - Installs a hook procedure that monitors messages generated as a result of an input event in a dialog box, message box, menu, or scroll bar",
      },
      {
        label: '$pProc',
        documentation:
          'Pointer to the hook procedure. If the $iThreadId parameter is zero or specifies the identifier of a thread created by a different process,the $pProc parameter must point to a hook procedure in a DLL.Otherwise, $pProc can point to a hook procedure in the code associated with the current process',
      },
      {
        label: '$hDll',
        documentation:
          'Handle to the DLL containing the hook procedure pointed to by the $pProc parameter.The $hMod parameter must be set to NULL if the $iThreadId parameter specifies a thread created by the current process and if the hook procedure is within the code associated with the current process',
      },
      {
        label: '$iThreadId',
        documentation:
          '**[optional]** Specifies the identifier of the thread with which the hook procedure is to be associated.If this parameter is zero, the hook procedure is associated with all existing threads running in the same desktop as the calling thread',
      },
    ],
  },
  _WinAPI_SetWindowText: {
    documentation: "Changes the text of the specified window's title bar",
    label: '_WinAPI_SetWindowText ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window or control whose text is to be changed',
      },
      {
        label: '$sText',
        documentation: 'String to be used as the new title or control text',
      },
    ],
  },
  _WinAPI_ShowCursor: {
    documentation: 'Displays or hides the cursor',
    label: '_WinAPI_ShowCursor ( $bShow )',
    params: [
      {
        label: '$bShow',
        documentation: 'If True, the cursor is shown, otherwise it is hidden',
      },
    ],
  },
  _WinAPI_ShowError: {
    documentation: 'Displays an error message box with an optional exit',
    label: '_WinAPI_ShowError ( $sText [, $bExit = True] )',
    params: [
      {
        label: '$sText',
        documentation: 'Error text to display',
      },
      {
        label: '$bExit',
        documentation:
          '**[optional]** Specifies whether to exit after the display:True - Exit program after displayFalse - Return normally after display',
      },
    ],
  },
  _WinAPI_ShowMsg: {
    documentation: 'Displays an "Information" message box',
    label: '_WinAPI_ShowMsg ( $sText )',
    params: [
      {
        label: '$sText',
        documentation: '"Information" text to display',
      },
    ],
  },
  _WinAPI_ShowWindow: {
    documentation: "Sets the specified window's show state",
    label: '_WinAPI_ShowWindow ( $hWnd [, $iCmdShow = 5] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window',
      },
      {
        label: '$iCmdShow',
        documentation:
          '**[optional]** Specifies how the window is to be shown:@SW_HIDE - Hides the window and activates another window@SW_MAXIMIZE - Maximizes the specified window@SW_MINIMIZE - Minimizes the specified window and activates the next top-level window in the Z order@SW_RESTORE - Activates and displays the window@SW_SHOW - Activates the window and displays it in its current size and position@SW_SHOWDEFAULT - Sets the show state based on the SW_ flag specified in the STARTUPINFO structure@SW_SHOWMAXIMIZED - Activates the window and displays it as a maximized window@SW_SHOWMINIMIZED - Activates the window and displays it as a minimized window@SW_SHOWMINNOACTIVE - Displays the window as a minimized window@SW_SHOWNA - Displays the window in its current state@SW_SHOWNOACTIVATE - Displays a window in its most recent size and position@SW_SHOWNORMAL - Activates and displays a window',
      },
    ],
  },
  _WinAPI_StringFromGUID: {
    documentation: 'Converts a binary GUID to string form',
    label: '_WinAPI_StringFromGUID ( $tGUID )',
    params: [
      {
        label: '$tGUID',
        documentation: 'A $tagGUID structure or a pointer to it',
      },
    ],
  },
  _WinAPI_StringLenA: {
    documentation: 'Calculates the size of ANSI string',
    label: '_WinAPI_StringLenA ( Const ByRef $tString )',
    params: [
      {
        label: '$tString',
        documentation: 'String Structure to process',
      },
    ],
  },
  _WinAPI_StringLenW: {
    documentation: 'Calculates the size of wide string',
    label: '_WinAPI_StringLenW ( Const ByRef $tString )',
    params: [
      {
        label: '$tString',
        documentation: 'String structure to process',
      },
    ],
  },
  _WinAPI_SubLangId: {
    documentation: 'Extract sublanguage id from a language id',
    label: '_WinAPI_SubLangId ( $iLngID )',
    params: [
      {
        label: '$iLngID',
        documentation: 'Language id',
      },
    ],
  },
  _WinAPI_SystemParametersInfo: {
    documentation: 'Retrieves or sets the value of one of the system-wide parameters',
    label:
      '_WinAPI_SystemParametersInfo ( $iAction [, $iParam = 0 [, $vParam = 0 [, $iWinIni = 0]]] )',
    params: [
      {
        label: '$iAction',
        documentation: 'The system-wide parameter to be retrieved or set',
      },
      {
        label: '$iParam',
        documentation:
          '**[optional]** A parameter whose usage and format depends on the parameter being queried or set',
      },
      {
        label: '$vParam',
        documentation:
          '**[optional]** A parameter whose usage and format depends on the parameter being queried or set',
      },
      {
        label: '$iWinIni',
        documentation:
          "**[optional]** If a system parameter is being set, specifies whether the user profile is to be updated, andif so, whether the $WM_SETTINGCHANGE message is to be broadcast. This parameter can be zero if you don't wantto update the user profile or it can be one or more of the following values:$SPIF_UPDATEINIFILE - Writes the new setting to the user profile$SPIF_SENDCHANGE - Broadcasts the $WM_SETTINGCHANGE message after updating the user profile",
      },
    ],
  },
  _WinAPI_TwipsPerPixelX: {
    documentation: 'Returns the width of a pixel, in twips',
    label: '_WinAPI_TwipsPerPixelX (  )',
    params: [],
  },
  _WinAPI_TwipsPerPixelY: {
    documentation: 'Returns the height of a pixel, in twips',
    label: '_WinAPI_TwipsPerPixelY (  )',
    params: [],
  },
  _WinAPI_UnhookWindowsHookEx: {
    documentation:
      'Removes a hook procedure installed in a hook chain by the _WinAPI_SetWindowsHookEx function',
    label: '_WinAPI_UnhookWindowsHookEx ( $hHook )',
    params: [
      {
        label: '$hHook',
        documentation: 'Handle to the hook to be removed',
      },
    ],
  },
  _WinAPI_UpdateLayeredWindow: {
    documentation:
      'Updates the position, size, shape, content, and translucency of a layered window',
    label:
      '_WinAPI_UpdateLayeredWindow ( $hWnd, $hDestDC, $tPTDest, $tSize, $hSrcDC, $tPTSrce, $iRGB, $tBlend, $iFlags )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to a layered window. A layered window is created by specifying $WS_EX_LAYERED when creating the window.',
      },
      {
        label: '$hDestDC',
        documentation: 'Handle to a device context for the screen',
      },
      {
        label: '$tPTDest',
        documentation:
          'A $tagPOINT structure or a pointer to it that specifies the new screen position of the layered window.If the current position is not changing, this can be zero.',
      },
      {
        label: '$tSize',
        documentation:
          'A $tagSIZE structure or a pointer to it that specifies the new size of the layered window.If the size of the window is not changing, this can be 0.',
      },
      {
        label: '$hSrcDC',
        documentation:
          'Handle to a device context for the surface that defines the layered window.This handle can be obtained by calling the _WinAPI_CreateCompatibleDC() function.',
      },
      {
        label: '$tPTSrce',
        documentation:
          'A $tagPOINT structure or a pointer to it that specifies the location of the layer in the device context',
      },
      {
        label: '$iRGB',
        documentation: 'The color key to be used when composing the layered window',
      },
      {
        label: '$tBlend',
        documentation:
          'A $tagBLENDFUNCTION structure or a pointer to it that specifies the transparency value to be used when composing the layered window.',
      },
      {
        label: '$iFlags',
        documentation:
          'This parameter can be one of the following values.    $ULW_ALPHA - Use $tblend as the blend function    $ULW_COLORKEY - Use $iRGB as the transparency color    $ULW_OPAQUE - Draw an opaque layered window',
      },
    ],
  },
  _WinAPI_UpdateWindow: {
    documentation:
      'Updates the client area of a window by sending a WM_PAINT message to the window',
    label: '_WinAPI_UpdateWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of window to update',
      },
    ],
  },
  _WinAPI_WaitForInputIdle: {
    documentation:
      'Waits until a process is waiting for user input with no input pending, or a time out',
    label: '_WinAPI_WaitForInputIdle ( $hProcess [, $iTimeout = -1] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'A handle to the process. If this process is a console application or does not have a messagequeue, this function returns immediately.',
      },
      {
        label: '$iTimeOut',
        documentation:
          '**[optional]** The time out interval, in milliseconds. If set to -1, the function does not return until theprocess is idle.',
      },
    ],
  },
  _WinAPI_WaitForMultipleObjects: {
    documentation: 'Waits until one or all of the specified objects are in the signaled state',
    label:
      '_WinAPI_WaitForMultipleObjects ( $iCount, $paHandles [, $bWaitAll = False [, $iTimeout = -1]] )',
    params: [
      {
        label: '$iCount',
        documentation: 'The number of object handles in the array pointed to by $paHandles',
      },
      {
        label: '$paHandles',
        documentation: 'Pointer to an array of object handles',
      },
      {
        label: '$bWaitAll',
        documentation:
          '**[optional]** If True, the function returns when the state of all objects in the $paHandles array is signaled.If False, the function returns when the state of any one of the objects is set to signaled.In the latter case, the return value indicates the object whose state caused the function to return.',
      },
      {
        label: '$iTimeout',
        documentation:
          "**[optional]** The time-out interval, in milliseconds.The function returns if the interval elapses, even if the conditions specified by the $bWaitAll parameter are not met.If 0, the function tests the states of the specified objects and returns immediately.If -1, the function's time-out interval never elapses.",
      },
    ],
  },
  _WinAPI_WaitForSingleObject: {
    documentation: 'Waits until the specified object is in the signaled state',
    label: '_WinAPI_WaitForSingleObject ( $hHandle [, $iTimeout = -1] )',
    params: [
      {
        label: '$hHandle',
        documentation: 'A handle to the object',
      },
      {
        label: '$iTimeout',
        documentation:
          "**[optional]** The time-out interval, in milliseconds. The function returns if the interval elapses, even ifthe conditions specified by the fWaitAll parameter are not met. If 0, the function tests the states of thespecified objects and returns immediately. If -1, the function's time-out interval never elapses.",
      },
    ],
  },
  _WinAPI_WideCharToMultiByte: {
    documentation: 'Converts a Unicode string to a multibyte string',
    label: '_WinAPI_WideCharToMultiByte ( $vUnicode [, $iCodePage = 0 [, $bRetString = True]] )',
    params: [
      {
        label: '$vUnicode',
        documentation:
          'String, DllStruct or Pointer to a byte array structure containing Unicode text to be converted',
      },
      {
        label: '$iCodePage',
        documentation:
          '**[optional]** Code page to use in performing the conversion:    0 - The current system Windows ANSI code page    1 - The current system OEM code page    2 - The current system Macintosh code page    3 - The Windows ANSI code page for the current thread    42 - Symbol code page    65000 - UTF-7    65001 - UTF-8',
      },
      {
        label: '$bRetString',
        documentation:
          '**[optional]** Flags that indicate whether to return a String or a DllStruct (default True : String)',
      },
    ],
  },
  _WinAPI_WindowFromPoint: {
    documentation: 'Retrieves the handle of the window that contains the specified point',
    label: '_WinAPI_WindowFromPoint ( ByRef $tPoint )',
    params: [
      {
        label: '$tPoint',
        documentation: '$tagPOINT structure that defines the point to be checked',
      },
    ],
  },
  _WinAPI_WriteConsole: {
    documentation: 'Writes a character string to a console screen buffer',
    label: '_WinAPI_WriteConsole ( $hConsole, $sText )',
    params: [
      {
        label: '$hConsole',
        documentation: 'Handle to the console screen buffer',
      },
      {
        label: '$sText',
        documentation: 'Text to be written to the console screen buffer',
      },
    ],
  },
  _WinAPI_WriteFile: {
    documentation: 'Writes data to a file at the position specified by the file pointer',
    label:
      '_WinAPI_WriteFile ( $hFile, $pBuffer, $iToWrite, ByRef $iWritten [, $tOverlapped = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file to be written',
      },
      {
        label: '$pBuffer',
        documentation: 'Pointer to the buffer containing the data to be written',
      },
      {
        label: '$iToWrite',
        documentation: 'Number of bytes to be written to the file',
      },
      {
        label: '$iWritten',
        documentation: 'The number of bytes written',
      },
      {
        label: '$tOverlapped',
        documentation: '**[optional]** A $tagOVERLAPPED structure or a pointer to it',
      },
    ],
  },
  _WinAPI_WriteProcessMemory: {
    documentation: 'Writes memory in a specified process',
    label:
      '_WinAPI_WriteProcessMemory ( $hProcess, $pBaseAddress, $pBuffer, $iSize, ByRef $iWritten [, $sBuffer = "ptr"] )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Identifies an open handle to a process whose memory is to be written to',
      },
      {
        label: '$pBaseAddress',
        documentation: 'Points to the base address in the specified process to be written to',
      },
      {
        label: '$pBuffer',
        documentation:
          'Points to the buffer that supplies data to be written into the address space',
      },
      {
        label: '$iSize',
        documentation: 'Specifies the number of bytes to write into the specified process',
      },
      {
        label: '$iWritten',
        documentation: 'The actual number of bytes transferred into the specified process',
      },
      {
        label: '$sBuffer',
        documentation: '**[optional]** Contains the data type that $pBuffer represents',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
