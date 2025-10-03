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
  _WinAPI_AbortPath: {
    documentation: 'Closes and discards any paths in the specified device context',
    label: '_WinAPI_AbortPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context from which a path will be discarded.',
      },
    ],
  },
  _WinAPI_ActivateKeyboardLayout: {
    documentation: 'Sets the input locale identifier for the calling thread or the current process',
    label: '_WinAPI_ActivateKeyboardLayout ( $hLocale [, $iFlag = 0] )',
    params: [
      {
        label: '$hLocale',
        documentation:
          'The input locale identifier to be activated.This parameter must be either the handle to a keyboard layout or one of the following values:    $HKL_NEXT    $HKL_PREV',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies how the input locale identifier is to be activated.This parameter can be one of the following values:    $KLF_REORDER    $KLF_RESET    $KLF_SETFORPROCESS    $KLF_SHIFTLOCK',
      },
    ],
  },
  _WinAPI_AddClipboardFormatListener: {
    documentation:
      'Places the given window in the system-maintained clipboard format listener list',
    label: '_WinAPI_AddClipboardFormatListener ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be placed.',
      },
    ],
  },
  _WinAPI_AddFontMemResourceEx: {
    documentation: 'Adds the font resource from a memory image to the system',
    label: '_WinAPI_AddFontMemResourceEx ( $pData, $iSize )',
    params: [
      {
        label: '$pData',
        documentation: 'The pointer to a font resource.',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes in the font resource.',
      },
    ],
  },
  _WinAPI_AddFontResourceEx: {
    documentation: 'Adds the font resource from the specified file to the system font table',
    label: '_WinAPI_AddFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that contains a valid font file name. This parameter can specify any of the following files:\n.fon - Font resource file.\n.fnt - Raw bitmap font file.\n.ttf - Raw TrueType file.\n.ttc - East Asian Windows: TrueType font collection.\n.fot - TrueType resource file.\n.otf - PostScript OpenType font.\n.mmm - Multiple master Type1 font resource file. It must be used with .pfm and .pfb files.\n.pfb - Type 1 font bits file. It is used with a .pfm file.\n.pfm - Type 1 font metrics file. It is used with a .pfb file.\n\nTo add a font whose information comes from several resource files, they must be separated by a "|".\nFor example, abcxxxxx.pfm|abcxxxxx.pfb.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The characteristics of the font to be added to the system. This parameter can be one of the following values.\n$FR_PRIVATE\n$FR_NOT_ENUM',
      },
      {
        label: '$bNotify',
        documentation:
          "**[optional]** Specifies whether sends a WM_FONTCHANGE message, valid values:\n\tTrue - Send the WM_FONTCHANGE message to all top-level windows after changing the pool of font resources.\n\tFalse - Don't send (Default).",
      },
    ],
  },
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
  _WinAPI_AddIconTransparency: {
    documentation: 'Adds a transparency to the specified 32 bits-per-pixel icon',
    label: '_WinAPI_AddIconTransparency ( $hIcon [, $iPercent = 50 [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon.',
      },
      {
        label: '$iPercent',
        documentation:
          '**[optional]** A value (in percent) that specifies how much to decrease the values of the alpha channel for the specified icon. If this parameter is 0, the function returns a fully transparent icon. Default is 80.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the icon after the function is successful, valid values:    True - Icon will be deleted if the function succeeds.    False - Do not delete, you must release the icon when you are finished using it (Default).',
      },
    ],
  },
  _WinAPI_AddMRUString: {
    documentation: 'Adds a string to the top of the most recently used (MRU) list',
    label: '_WinAPI_AddMRUString ( $hMRU, $sStr )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Handle of the MRU list.',
      },
      {
        label: '$sStr',
        documentation: 'The string be added.',
      },
    ],
  },
  _WinAPI_AdjustBitmap: {
    documentation:
      'Creates a new device-depended bitmap (DDB) from the source bitmap with new dimensions and color adjustment',
    label:
      '_WinAPI_AdjustBitmap ( $hBitmap, $iWidth, $iHeight [, $iMode = 3 [, $tAdjustment = 0]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'A handle to the source bitmap.',
      },
      {
        label: '$iWidth',
        documentation:
          'The width of the new bitmap, in pixels.If this parameter is (-1), the width will be the same as in the source bitmap.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height of the new bitmap, in pixels.If this parameter is (-1), the height will be the same as in the source bitmap.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The stretching mode.This parameter can be one of the following values:    $BLACKONWHITE    $COLORONCOLOR (Default)    $HALFTONE    $WHITEONBLACK    $STRETCH_ANDSCANS    $STRETCH_DELETESCANS    $STRETCH_HALFTONE    $STRETCH_ORSCANS',
      },
      {
        label: '$tAdjustment',
        documentation:
          '**[optional]** $tagCOLORADJUSTMENT structure containing the color adjustment values.This color adjustment is used only if $HALFTONE ($STRETCH_HALFTONE) stretching mode are set.',
      },
    ],
  },
  _WinAPI_AdjustTokenPrivileges: {
    documentation: 'Enables or disables privileges in the specified access token',
    label: '_WinAPI_AdjustTokenPrivileges ( $hToken, $aPrivileges, $iAttributes, ByRef $aAdjust )',
    params: [
      {
        label: '$hToken',
        documentation:
          'Handle to the access token that contains the privileges to be modified.The handle must have $TOKEN_ADJUST_PRIVILEGES and $TOKEN_QUERY accesses to the token.',
      },
      {
        label: '$aPrivileges',
        documentation:
          "The variable that specifies a privileges.If this parameter is (-1), the function disables of the token's privileges and ignores the $iAttributes parameter.$aPrivileges can be one of the following types.The privilege constant ($SE_*).1D array of $SE_* constants.2D array of $SE_* constants and their attributes (see below).[0][0] - Privilege[0][1] - Attributes[n][0] - Privilege[n][1] - Attributes",
      },
      {
        label: '$iAttributes',
        documentation:
          'The privilege attributes. If $aPrivileges parameter is 1D array, $iAttributes applied to the entire array.If $aPrivileges parameter is (-1) or 2D array, the function ignores this parameter and will use the attributes that specified in this array.This parameter can be 0 (disables privilege) or any combination of the following values:    $SE_PRIVILEGE_ENABLED    $SE_PRIVILEGE_ENABLED_BY_DEFAULT    $SE_PRIVILEGE_REMOVED    $SE_PRIVILEGE_USED_FOR_ACCESS',
      },
      {
        label: '$aAdjust',
        documentation:
          '2D array of the previous state of any privileges that the function modifies. That is, if a privilege has been modified by this function, the privilege and its previous state are contained in this array.',
      },
    ],
  },
  _WinAPI_AdjustWindowRectEx: {
    documentation:
      'Calculates the required size of the window rectangle, based on the desired size of the client rectangle',
    label:
      '_WinAPI_AdjustWindowRectEx ( ByRef $tRECT, $iStyle [, $iExStyle = 0 [, $bMenu = False]] )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the desired client area. This structure must be created before function call.',
      },
      {
        label: '$iStyle',
        documentation:
          'The window style of the window whose required size is to be calculated. Note that you cannot specify the $WS_OVERLAPPED style.',
      },
      {
        label: '$iExStyle',
        documentation:
          '**[optional]** The extended window style of the window whose required size is to be calculated.',
      },
      {
        label: '$bMenu',
        documentation:
          '**[optional]** Specifies whether the window has a menu, valid values:True - The window has a menu.False - The window does not has a menu (Default).',
      },
    ],
  },
  _WinAPI_AlphaBlend: {
    documentation: 'Displays bitmaps that have transparent or semitransparent pixels',
    label:
      '_WinAPI_AlphaBlend ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iAlpha [, $bAlpha = False] )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width, in logical units, of the destination rectangle.',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height, in logical units, of the destination rectangle.',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context.',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width, in logical units, of the source rectangle.',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height, in logical units, of the source rectangle.',
      },
      {
        label: '$iAlpha',
        documentation:
          'The alpha transparency value to be used on the entire source bitmap.This value is combined with any per-pixel alpha values in the source bitmap.If you set $iAlpha to 0, it is assumed that your image is transparent.Set $iAlpha value to 255 (opaque) when you only want to use per-pixel alpha values.',
      },
      {
        label: '$bAlpha',
        documentation:
          '**[optional]** Specifies whether uses an alpha channel from the source bitmap, valid values:    True    - Use the alpha channel (that is, per-pixel alpha).        Note that the APIs use premultiplied alpha, which means that the red, green and blue channel values in the bitmap must be premultiplied with the alpha channel value.        For example, if the alpha channel value is x, the red, green and blue channels must be multiplied by x and divided by 255 prior to the call.    False - Do not use the alpha channel (Default).',
      },
    ],
  },
  _WinAPI_AngleArc: {
    documentation: 'Draws a line segment and an arc',
    label: '_WinAPI_AngleArc ( $hDC, $iX, $iY, $iRadius, $nStartAngle, $nSweepAngle )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the center of the circle.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the center of the circle.',
      },
      {
        label: '$iRadius',
        documentation: 'The radius, in logical units, of the circle.',
      },
      {
        label: '$nStartAngle',
        documentation: 'The start angle, in degrees, relative to the x-axis.',
      },
      {
        label: '$nSweepAngle',
        documentation: 'The sweep angle, in degrees, relative to the starting angle.',
      },
    ],
  },
  _WinAPI_AnimateWindow: {
    documentation: 'Enables you to produce special effects when showing or hiding windows',
    label: '_WinAPI_AnimateWindow ( $hWnd, $iFlags [, $iDuration = 1000] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to animate.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify the type of animation.This parameter can be one or more of the following values. Note that, by default, these flags take effect when showing a window.To take effect when hiding a window, use AW_HIDE and a logical OR operator with the appropriate flags:    $AW_ACTIVATE    $AW_BLEND    $AW_CENTER    $AW_HIDE    $AW_HOR_NEGATIVE    $AW_HOR_POSITIVE    $AW_SLIDE    $AW_VER_NEGATIVE    $AW_VER_POSITIVE',
      },
      {
        label: '$iDuration',
        documentation:
          '**[optional]** Specifies how long it takes to play the animation, in milliseconds. Default is 1000.',
      },
    ],
  },
  _WinAPI_Arc: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_Arc ( $hDC, $tRECT, $iXStartArc, $iYStartArc, $iXEndArc, $iYEndArc )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the bounding rectangle.',
      },
      {
        label: '$iXStartArc',
        documentation:
          'The x-coordinate, in logical units, of the ending point of the radial line defining the starting point of the arc.',
      },
      {
        label: '$iYStartArc',
        documentation:
          'The y-coordinate, in logical units, of the ending point of the radial line defining the starting point of the arc.',
      },
      {
        label: '$iXEndArc',
        documentation:
          'The x-coordinate, in logical units, of the ending point of the radial line defining the ending point of the arc.',
      },
      {
        label: '$iYEndArc',
        documentation:
          'The y-coordinate, in logical units, of the ending point of the radial line defining the ending point of the arc.',
      },
    ],
  },
  _WinAPI_ArcTo: {
    documentation: 'Draws an elliptical arc',
    label: '_WinAPI_ArcTo ( $hDC, $tRECT, $iXRadial1, $iYRadial1, $iXRadial2, $iYRadial2 )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the bounding rectangle.',
      },
      {
        label: '$iXRadial1',
        documentation:
          'The x-coordinate, in logical units, of the endpoint of the radial defining the starting point of the arc.',
      },
      {
        label: '$iYRadial1',
        documentation:
          'The y-coordinate, in logical units, of the endpoint of the radial defining the starting point of the arc.',
      },
      {
        label: '$iXRadial2',
        documentation:
          'The x-coordinate, in logical units, of the endpoint of the radial defining the ending point of the arc.',
      },
      {
        label: '$iYRadial2',
        documentation:
          'The y-coordinate, in logical units, of the endpoint of the radial defining the ending point of the arc.',
      },
    ],
  },
  _WinAPI_ArrayToStruct: {
    documentation: 'Converts an array of strings to the structure',
    label: '_WinAPI_ArrayToStruct ( Const ByRef $aData [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$aData',
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
  _WinAPI_AssignProcessToJobObject: {
    documentation: 'Assigns a process to an existing job object',
    label: '_WinAPI_AssignProcessToJobObject ( $hJob, $hProcess )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job object to which the process will be associated. The handle must have the$JOB_OBJECT_ASSIGN_PROCESS access right.',
      },
      {
        label: '$hProcess',
        documentation:
          'Handle to the process to associate with the job object. The process must not already be assigned to a job.',
      },
    ],
  },
  _WinAPI_AssocGetPerceivedType: {
    documentation: "Retrieves a file's perceived type based on its extension",
    label: '_WinAPI_AssocGetPerceivedType ( $sExt )',
    params: [
      {
        label: '$sExt',
        documentation:
          'The file\'s extension. This should include the leading period, for example ".txt".',
      },
    ],
  },
  _WinAPI_AssocQueryString: {
    documentation:
      'Searches for and retrieves a file or protocol association-related string from the registry',
    label: "_WinAPI_AssocQueryString ( $sAssoc, $iType [, $iFlags = 0 [, $sExtra = '']] )",
    params: [
      {
        label: '$sAssoc',
        documentation:
          'The string that is used to determine the root key. The following four types of strings can be used.The file name extension, such as ".txt".The class identifier (CLSID) GUID in the standard "{GUID}" format.The application\'s ProgID, such as Word.Document.8.The name of an application\'s .exe file. The $ASSOCF_OPEN_BYEXENAME flag must be set.',
      },
      {
        label: '$iType',
        documentation:
          'The value that specifies the type of string that is to be returned. This parameter can be one of the following values:    $ASSOCSTR_COMMAND    $ASSOCSTR_EXECUTABLE    $ASSOCSTR_FRIENDLYDOCNAME    $ASSOCSTR_FRIENDLYAPPNAME    $ASSOCSTR_NOOPEN    $ASSOCSTR_SHELLNEWVALUE    $ASSOCSTR_DDECOMMAND    $ASSOCSTR_DDEIFEXEC    $ASSOCSTR_DDEAPPLICATION    $ASSOCSTR_DDETOPIC    $ASSOCSTR_INFOTIP    $ASSOCSTR_QUICKTIP    $ASSOCSTR_TILEINFO    $ASSOCSTR_CONTENTTYPE    $ASSOCSTR_DEFAULTICON    $ASSOCSTR_SHELLEXTENSION',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that can be used to control the search. It can be any combination of the following values, except that only one $ASSOCF_INIT_* value can be included.    $ASSOCF_INIT_NOREMAPCLSID    $ASSOCF_INIT_BYEXENAME    $ASSOCF_OPEN_BYEXENAME    $ASSOCF_INIT_DEFAULTTOSTAR    $ASSOCF_INIT_DEFAULTTOFOLDER    $ASSOCF_NOUSERSETTINGS    $ASSOCF_NOTRUNCATE    $ASSOCF_VERIFY    $ASSOCF_REMAPRUNDLL    $ASSOCF_NOFIXUPS    $ASSOCF_IGNOREBASECLASS    $ASSOCF_INIT_IGNOREUNKNOWN',
      },
      {
        label: '$sExtra',
        documentation:
          '**[optional]** The string with additional information about the location of the string.It is typically set to a Shell verb such as open.',
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
  _WinAPI_BackupRead: {
    documentation: 'Backs up a file or directory, including the security information',
    label:
      '_WinAPI_BackupRead ( $hFile, $pBuffer, $iLength, ByRef $iBytes, ByRef $pContext [, $bSecurity = False] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file or directory to be backed up.To obtain the handle, call the _WinAPI_CreateFileEx() function.The SACLs are not read unless the file handle was created with the $ACCESS_SYSTEM_SECURITY access right.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to a buffer that receives the data.',
      },
      {
        label: '$iLength',
        documentation:
          'The size of the buffer, in bytes.The buffer size must be greater than the size of the $tagWIN32_STREAM_ID structure.(see also MSDN for more information)',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes read.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by this function to maintain context information during a backup operation.You must set this variable to 0 before the first call to _WinAPI_BackupRead() for the specified file or directory.The function allocates memory for the data structure, and then sets the variable to point to that structure.You must not change this variable or the variable that it points to between calls to _WinAPI_BackupRead().',
      },
      {
        label: '$bSecurity',
        documentation:
          '**[optional]** Specifies whether the function will backup the access-control list (ACL) data, valid values:    True - The ACL data will be backed up.    False - The ACL data will be omitted (Default).',
      },
    ],
  },
  _WinAPI_BackupReadAbort: {
    documentation: 'Finishes the use of _WinAPI_BackupRead() on the handle',
    label: '_WinAPI_BackupReadAbort ( ByRef $pContext )',
    params: [
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by _WinAPI_BackupRead() function to maintain context information during a backup operation.',
      },
    ],
  },
  _WinAPI_BackupSeek: {
    documentation:
      'Seeks forward in a data stream initially accessed by using the _WinAPI_BackupRead() or _WinAPI_BackupWrite() function',
    label: '_WinAPI_BackupSeek ( $hFile, $iSeek, ByRef $iBytes, ByRef $pContext )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file or directory.',
      },
      {
        label: '$iSeek',
        documentation: 'The number of bytes to seek.',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes the function actually seeks.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure. This structure must be the same structure that was initialized by the _WinAPI_BackupRead().An application must not touch the contents of this structure.',
      },
    ],
  },
  _WinAPI_BackupWrite: {
    documentation: 'Restore a file or directory that was backed up using _WinAPI_BackupRead()',
    label:
      '_WinAPI_BackupWrite ( $hFile, $pBuffer, $iLength, ByRef $iBytes, ByRef $pContext [, $bSecurity = False] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file or directory to be restored. To obtain the handle, call the _WinAPI_CreateFileEx() function.The SACLs are not restored unless the file handle was created with the $ACCESS_SYSTEM_SECURITY access right.To ensure that the integrity ACEs are restored correctly, the file handle must also have been created with the $WRITE_OWNER access right.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to a buffer that the function writes data from.',
      },
      {
        label: '$iLength',
        documentation:
          'The size of the buffer, in bytes. The buffer size must be greater than the size of the $tagWIN32_STREAM_ID structure.(see MSDN for more information)',
      },
      {
        label: '$iBytes',
        documentation: 'The number of bytes written.',
      },
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by this function to maintain context information during a restore operation.You must set this variable to 0 before the first call to _WinAPI_BackupWrite() for the specified file or directory.The function allocates memory for the data structure, and then sets the variable to point to that structure.You must not change this variable or the variable that it points to between calls to _WinAPI_BackupWrite().',
      },
      {
        label: '$bSecurity',
        documentation:
          '**[optional]** Specifies whether the function will restore the access-control list (ACL) data, valid values:    True - The ACL data will be restored.        Furthermore, you need to specify $WRITE_OWNER and $WRITE_DAC access when opening the file or directory handle.        If the handle does not have those access rights, the operating system denies access to the ACL data, and ACL data restoration will not occur.    False - The ACL data will be omitted (Default).',
      },
    ],
  },
  _WinAPI_BackupWriteAbort: {
    documentation: 'Finishes the use of _WinAPI_BackupWrite() on the handle',
    label: '_WinAPI_BackupWriteAbort ( ByRef $pContext )',
    params: [
      {
        label: '$pContext',
        documentation:
          'A pointer to an internal data structure used by _WinAPI_BackupWrite() function to maintain context information during a restore operation.',
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
  _WinAPI_BeginDeferWindowPos: {
    documentation: 'Allocates memory for a multiple-window-position structure',
    label: '_WinAPI_BeginDeferWindowPos ( [$iAmount = 1] )',
    params: [
      {
        label: '$iAmount',
        documentation:
          '**[optional]** The initial number of windows for which to store position information. Default is 1.',
      },
    ],
  },
  _WinAPI_BeginPaint: {
    documentation: 'Prepares the specified window for painting',
    label: '_WinAPI_BeginPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be repainted.',
      },
      {
        label: '$tPAINTSTRUCT',
        documentation:
          '$tagPAINTSTRUCT structure that will receive painting information.When the function call, this parameter should be any valid variable, the function creates this structure itself.',
      },
    ],
  },
  _WinAPI_BeginPath: {
    documentation: 'Opens a path bracket in the specified device context',
    label: '_WinAPI_BeginPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_BeginUpdateResource: {
    documentation:
      'Retrieves a handle that can be used to add, delete, or replace resources in a binary module',
    label: '_WinAPI_BeginUpdateResource ( $sFilePath [, $bDelete = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The binary file in which to update resources.An application must be able to obtain write-access to this file; the file referenced by $sFilePath cannot be currently executing.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete existing resources, valid values:True- The resources are deleted and the updated file includes only resources added with the _WinAPI_UpdateResource().False - The updated file includes existing resources (Default).',
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
  _WinAPI_BringWindowToTop: {
    documentation: 'Brings the specified window to the top of the Z order',
    label: '_WinAPI_BringWindowToTop ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to bring to the top of the Z order.',
      },
    ],
  },
  _WinAPI_BroadcastSystemMessage: {
    documentation: 'Sends a message to the specified recipients',
    label:
      '_WinAPI_BroadcastSystemMessage ( $iMsg [, $wParam = 0 [, $lParam = 0 [, $iFlags = 0 [, $iRecipients = 0]]]] )',
    params: [
      {
        label: '$iMsg',
        documentation: 'The message to be sent.',
      },
      {
        label: '$wParam',
        documentation: '**[optional]** The message-specific information.',
      },
      {
        label: '$lParam',
        documentation: '**[optional]** The message-specific information.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The broadcast option. This parameter can be one or more of the following values:    $BSF_ALLOWSFW    $BSF_FLUSHDISK    $BSF_FORCEIFHUNG    $BSF_IGNORECURRENTTASK    $BSF_NOHANG    $BSF_NOTIMEOUTIFNOTHUNG    $BSF_POSTMESSAGE    $BSF_QUERY    $BSF_SENDNOTIFYMESSAGE',
      },
      {
        label: '$iRecipients',
        documentation:
          '**[optional]** The recipients of the message. This parameter can be one or more of the following values:    $BSM_ALLCOMPONENTS (Default)    $BSM_ALLDESKTOPS    $BSM_APPLICATIONS    $BSM_INSTALLABLEDRIVERS    $BSM_NETDRIVER    $BSM_VXDS',
      },
    ],
  },
  _WinAPI_BrowseForFolderDlg: {
    documentation: 'Displays a dialog box that enables the user to select a Shell folder',
    label:
      "_WinAPI_BrowseForFolderDlg ( [$sRoot = '' [, $sText = '' [, $iFlags = 0 [, $pBrowseProc = 0 [, $lParam = 0 [, $hParent = 0]]]]]] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The root folder from which to start browsing.Only the specified folder and its subfolders in the namespace hierarchy appear in the dialog box.If this parameter is 0, the namespace root (the Desktop folder) is used.',
      },
      {
        label: '$sText',
        documentation:
          '**[optional]** The string that is displayed above the tree view control in the dialog box.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Flags that specify the options for the dialog box. This parameter can a combination of the following values:    $BIF_BROWSEFORCOMPUTER    $BIF_BROWSEFORPRINTER    $BIF_BROWSEINCLUDEFILES    $BIF_BROWSEINCLUDEURLS    $BIF_DONTGOBELOWDOMAIN    $BIF_EDITBOX    $BIF_NEWDIALOGSTYLE    $BIF_NONEWFOLDERBUTTON    $BIF_NOTRANSLATETARGETS    $BIF_RETURNFSANCESTORS    $BIF_RETURNONLYFSDIRS    $BIF_SHAREABLE    $BIF_STATUSTEXT    $BIF_USENEWUI    $BIF_UAHINT    $BIF_VALIDATEWindows 7 or later    $BIF_BROWSEFILEJUNCTIONS',
      },
      {
        label: '$pBrowseProc',
        documentation:
          '**[optional]** Pointer to a callback function that the dialog box calls when an event occurs.This function will receive one of the following event messages:    $BFFM_INITIALIZED    $BFFM_IUNKNOWN    $BFFM_SELCHANGED    $BFFM_VALIDATEFAILED(See MSDN for more information)',
      },
      {
        label: '$lParam',
        documentation:
          '**[optional]** The value that the dialog box passes to the callback function.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to the parent window for the dialog box.',
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
  _WinAPI_CallWindowProcW: {
    documentation: 'Passes message information to the specified window procedure',
    label: '_WinAPI_CallWindowProcW ( $pPrevWndProc, $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$pPrevWndProc',
        documentation:
          'The address of a previous window procedure, or a special internal value meaningful only to _WinAPI_CallWindowProcW() function.',
      },
      {
        label: '$hWnd',
        documentation: 'A handle to the window procedure that received the message.',
      },
      {
        label: '$iMsg',
        documentation: 'The message.',
      },
      {
        label: '$wParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
      {
        label: '$lParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
    ],
  },
  _WinAPI_CascadeWindows: {
    documentation: 'Cascades the specified child windows of the specified parent window',
    label:
      '_WinAPI_CascadeWindows ( $aWnds [, $tRECT = 0 [, $hParent = 0 [, $iFlags = 0 [, $iStart = 0 [, $iEnd = -1]]]]] )',
    params: [
      {
        label: '$aWnds',
        documentation:
          'The array of handles to the child windows to arrange.If a specified child window is a top-level window with the style $WS_EX_TOPMOST or $WS_EX_TOOLWINDOW, the child window is not arranged.If this parameter is 0, all child windows of the specified parent window (or of the desktop window) are arranged.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that specifies the rectangular area, in client coordinates, within which the windows are arranged.This parameter can be 0 (Default), in which case the client area of the parent window is used.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the parent window. If this parameter is 0 (Default), the desktop window is assumed.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A cascade flag. This parameter can be one or more of the following values:    $MDITILE_SKIPDISABLED    $MDITILE_ZORDER',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start arranging at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop arranging at.',
      },
    ],
  },
  _WinAPI_ChangeWindowMessageFilterEx: {
    documentation:
      'Modifies the User Interface Privilege Isolation (UIPI) message filter for a specified window',
    label: '_WinAPI_ChangeWindowMessageFilterEx ( $hWnd, $iMsg, $iAction )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window whose UIPI message filter is to be modified.If this parameter is 0, the UIPI message filter will be modified in a process-wide manner.Moreover, under Windows Vista this parameter is not used and should be set to 0.',
      },
      {
        label: '$iMsg',
        documentation: 'The message that the message filter allows through or blocks.',
      },
      {
        label: '$iAction',
        documentation:
          'The action to be performed. This parameter can be one of the following values:    $MSGFLT_ALLOW    $MSGFLT_DISALLOWWindows 7 or later    $MSGFLT_RESET',
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
  _WinAPI_ChildWindowFromPointEx: {
    documentation:
      'Determines which, if any, of the child windows belonging to the specified parent window contains the specified point',
    label: '_WinAPI_ChildWindowFromPointEx ( $hWnd, $tPOINT [, $iFlags = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the parent window.',
      },
      {
        label: '$tPOINT',
        documentation:
          '$tagPOINT structure that defines the client coordinates (relative to hwndParent) of the point to be checked.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify which child windows to skip. This parameter can be one or more of the following values:    $CWP_ALL (Default)    $CWP_SKIPINVISIBLE    $CWP_SKIPDISABLED    $CWP_SKIPTRANSPARENT',
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
  _WinAPI_ClipCursor: {
    documentation: 'Confines the cursor to a rectangular area on the screen',
    label: '_WinAPI_ClipCursor ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the screen coordinates of the confining rectangle.If this parameter is 0, the cursor is free to move anywhere on the screen.',
      },
    ],
  },
  _WinAPI_CloseDesktop: {
    documentation: 'Closes an open handle to a desktop object',
    label: '_WinAPI_CloseDesktop ( $hDesktop )',
    params: [
      {
        label: '$hDesktop',
        documentation: 'Handle to the desktop to be closed.',
      },
    ],
  },
  _WinAPI_CloseEnhMetaFile: {
    documentation:
      'Closes an enhanced-metafile device context and returns a handle that identifies an enhanced-format metafile',
    label: '_WinAPI_CloseEnhMetaFile ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to an enhanced-metafile device context.',
      },
    ],
  },
  _WinAPI_CloseFigure: {
    documentation: 'Closes an open figure in a path',
    label: '_WinAPI_CloseFigure ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context in which the figure will be closed.',
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
  _WinAPI_CloseWindow: {
    documentation: 'Minimizes (but does not destroy) the specified window',
    label: '_WinAPI_CloseWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be minimized.',
      },
    ],
  },
  _WinAPI_CloseWindowStation: {
    documentation: 'Closes an open window station handle',
    label: '_WinAPI_CloseWindowStation ( $hStation )',
    params: [
      {
        label: '$hStation',
        documentation: 'Handle to the window station to be closed.',
      },
    ],
  },
  _WinAPI_CLSIDFromProgID: {
    documentation: 'Looks up a CLSID in the registry, given a ProgID',
    label: '_WinAPI_CLSIDFromProgID ( $sProgID )',
    params: [
      {
        label: '$sProgID',
        documentation: 'The string containing the ProgID whose CLSID is requested.',
      },
    ],
  },
  _WinAPI_CoInitialize: {
    documentation: 'Initializes the COM library for use by the calling process',
    label: '_WinAPI_CoInitialize ( [$iFlags = 0] )',
    params: [
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.    $COINIT_APARTMENTTHREADED    $COINIT_DISABLE_OLE1DDE    $COINIT_MULTITHREADED (Default)    $COINIT_SPEED_OVER_MEMORY',
      },
    ],
  },
  _WinAPI_ColorAdjustLuma: {
    documentation: 'Changes the luminance of a RGB value',
    label: '_WinAPI_ColorAdjustLuma ( $iRGB, $iPercent [, $bScale = True] )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The initial RGB value.',
      },
      {
        label: '$iPercent',
        documentation: 'The luminance of the total range, in percent, or absolute luminance.',
      },
      {
        label: '$bScale',
        documentation:
          '**[optional]** Specifies how to use the $iPercent parameter, valid values:    True - The $iPercent specifies how much to increment or decrement the current luminance, $iPercent can range from -1000 to +1000.    False - The $iPercent specifies the absolute luminance, $iPercent can range 0 to 1000. Available luminance values range from 0 to a maximum. If the requested value is negative or exceeds the maximum, the luminance will be set to either zero or the maximum value, respectively.        Default is True.',
      },
    ],
  },
  _WinAPI_ColorHLSToRGB: {
    documentation: 'Converts colors from hue-luminance-saturation (HLS) to RGB format',
    label: '_WinAPI_ColorHLSToRGB ( $iHue, $iLuminance, $iSaturation )',
    params: [
      {
        label: '$iHue',
        documentation: 'HLS hue value.',
      },
      {
        label: '$iLuminance',
        documentation: 'HLS luminance value.',
      },
      {
        label: '$iSaturation',
        documentation: 'HLS saturation value.',
      },
    ],
  },
  _WinAPI_ColorRGBToHLS: {
    documentation: 'Converts colors from RGB to hue-luminance-saturation (HLS) format',
    label: '_WinAPI_ColorRGBToHLS ( $iRGB, ByRef $iHue, ByRef $iLuminance, ByRef $iSaturation )',
    params: [
      {
        label: '$iRGB',
        documentation: 'RGB color.',
      },
      {
        label: '$iHue',
        documentation: 'Returns HLS hue value.',
      },
      {
        label: '$iLuminance',
        documentation: 'Returns HLS luminance value.',
      },
      {
        label: '$iSaturation',
        documentation: 'Returns HLS saturation value.',
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
  _WinAPI_CombineTransform: {
    documentation: 'Concatenates two world-space to page-space transformations',
    label: '_WinAPI_CombineTransform ( $tXFORM1, $tXFORM2 )',
    params: [
      {
        label: '$tXFORM1',
        documentation: '$tagXFORM structure that specifies the first transformation.',
      },
      {
        label: '$tXFORM2',
        documentation: '$tagXFORM structure that specifies the second transformation.',
      },
    ],
  },
  _WinAPI_CommandLineToArgv: {
    documentation:
      'Parses a command-line string and returns an array of the command-line arguments',
    label: '_WinAPI_CommandLineToArgv ( $sCmd )',
    params: [
      {
        label: '$sCmd',
        documentation:
          'The string that contains the full command line. If this parameter is an empty string the function returns an empty array (zeroth element is 0).',
      },
    ],
  },
  _WinAPI_CommDlgExtendedError: {
    documentation:
      'Returns a common dialog box error string. This string indicates the most recent error to occur during the execution of one of the common dialog box functions',
    label: '_WinAPI_CommDlgExtendedError (  )',
    params: [],
  },
  _WinAPI_CommDlgExtendedErrorEx: {
    documentation: 'Returns a common dialog box error code',
    label: '_WinAPI_CommDlgExtendedErrorEx (  )',
    params: [],
  },
  _WinAPI_CompareString: {
    documentation: 'Compares two character strings for a specified locale',
    label: '_WinAPI_CompareString ( $iLCID, $sString1, $sString2 [, $iFlags = 0] )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values:    $LOCALE_INVARIANT    $LOCALE_SYSTEM_DEFAULT    $LOCALE_USER_DEFAULTWindows Vista or later    $LOCALE_CUSTOM_DEFAULT    $LOCALE_CUSTOM_UI_DEFAULT    $LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$sString1',
        documentation: 'The first string to compare.',
      },
      {
        label: '$sString2',
        documentation: 'The second string to compare.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that indicate how the function compares the two strings. This parameter can be 0 or combination of the following values:    $LINGUISTIC_IGNORECASE    $LINGUISTIC_IGNOREDIACRITIC    $NORM_IGNORECASE    $NORM_IGNOREKANATYPE    $NORM_IGNORENONSPACE    $NORM_IGNORESYMBOLS    $NORM_IGNOREWIDTH    $NORM_LINGUISTIC_CASING    $SORT_STRINGSORTWindows 7 or later    $SORT_DIGITSASNUMBERS',
      },
    ],
  },
  _WinAPI_CompressBitmapBits: {
    documentation: 'Creates a compressed data block from the specified bitmap',
    label:
      '_WinAPI_CompressBitmapBits ( $hBitmap, ByRef $pBuffer [, $iCompression = 0 [, $iQuality = 100]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'A handle to the bitmap to be compressed.',
      },
      {
        label: '$pBuffer',
        documentation:
          'A pointer to a memory block (buffer) that receives the compressed data. Optionaly, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself.Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function.',
      },
      {
        label: '$iCompression',
        documentation:
          '**[optional]** The compression method. This parameter can be one of the following values.    $COMPRESSION_BITMAP_PNG (Default)    $COMPRESSION_BITMAP_JPEG',
      },
      {
        label: '$iQuality',
        documentation:
          '**[optional]** The quality of JPEG image, in percent. This value is ignored for non JPEG compression. Default is 100.',
      },
    ],
  },
  _WinAPI_CompressBuffer: {
    documentation: 'Compresses a buffer with specified compression format and engine type',
    label:
      '_WinAPI_CompressBuffer ( $pUncompressedBuffer, $iUncompressedSize, $pCompressedBuffer, $iCompressedSize [, $iFormatAndEngine = 0x0002] )',
    params: [
      {
        label: '$pUncompressedBuffer',
        documentation:
          'A pointer to a caller-allocated buffer that contains the data to be compressed.',
      },
      {
        label: '$iUncompressedSize',
        documentation: 'The size of the uncompressed buffer, in bytes.',
      },
      {
        label: '$pCompressedBuffer',
        documentation: 'A pointer to a caller-allocated buffer that receives the compressed data.',
      },
      {
        label: '$iCompressedSize',
        documentation: 'The size of the compressed buffer, in bytes.',
      },
      {
        label: '$iFormatAndEngine',
        documentation:
          '**[optional]** A bitmask that specifies the compression format and engine type.This parameter must be set to a valid bitwise OR combination of one format type and one engine type.    $COMPRESSION_FORMAT_LZNT1 (Default)    $COMPRESSION_FORMAT_XPRESS    $COMPRESSION_FORMAT_XPRESS_HUFF    $COMPRESSION_ENGINE_STANDARD (Default)    $COMPRESSION_ENGINE_MAXIMUM',
      },
    ],
  },
  _WinAPI_ComputeCrc32: {
    documentation: 'Calculates the CRC32 checksum of a block of memory',
    label: '_WinAPI_ComputeCrc32 ( $pMemory, $iLength )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the memory block to calculate the checksum.',
      },
      {
        label: '$iLength',
        documentation: 'The number of bytes to be calculated.',
      },
    ],
  },
  _WinAPI_ConfirmCredentials: {
    documentation: 'Confirms the validity of the credential harvested',
    label: '_WinAPI_ConfirmCredentials ( $sTarget, $bConfirm )',
    params: [
      {
        label: '$sTarget',
        documentation:
          'The string that contains the name of the target for the credentials, typically a domain or server name.This must be the same value passed to _WinAPI_ShellUserAuthenticationDlg() function.',
      },
      {
        label: '$bConfirm',
        documentation:
          'Specifies whether the credentials returned from the prompt function are valid, valid values:    True - The credentials are stored in the credential manager.    False - The credentials are not stored and various pieces of memory are cleaned up.',
      },
    ],
  },
  _WinAPI_CopyBitmap: {
    documentation:
      'Creates a duplicate of a specified bitmap with a device-independent bitmap (DIB) section',
    label: '_WinAPI_CopyBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to be duplicated.',
      },
    ],
  },
  _WinAPI_CopyCursor: {
    documentation: 'Creates a duplicate of a specified cursor',
    label: '_WinAPI_CopyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Handle to the cursor to be duplicated.',
      },
    ],
  },
  _WinAPI_CopyEnhMetaFile: {
    documentation: 'Copies the contents of an enhanced-format metafile to a specified file',
    label: "_WinAPI_CopyEnhMetaFile ( $hEmf [, $sFilePath = ''] )",
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile to be copied.',
      },
      {
        label: '$sFilePath',
        documentation:
          "**[optional]** The name of the destination file (.emf). If this parameter is '' (Default), the source metafile is copied to memory.",
      },
    ],
  },
  _WinAPI_CopyFileEx: {
    documentation:
      'Copies an existing file to a new file, notifying the application of its progress through a callback function',
    label:
      '_WinAPI_CopyFileEx ( $sExistingFile, $sNewFile [, $iFlags = 0 [, $pProgressProc = 0 [, $pData = 0]]] )',
    params: [
      {
        label: '$sExistingFile',
        documentation: 'The name of an existing file.',
      },
      {
        label: '$sNewFile',
        documentation: 'The name of the new file.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how the file is to be copied. This parameter can be a combination of the following values:    $COPY_FILE_ALLOW_DECRYPTED_DESTINATION (0x0008)    $COPY_FILE_COPY_SYMLINK (0x0800)    $COPY_FILE_FAIL_IF_EXISTS (0x0001)    $COPY_FILE_NO_BUFFERING (0x1000)    $COPY_FILE_OPEN_SOURCE_FOR_WRITE (0x0004)    $COPY_FILE_RESTARTABLE (0x0002)',
      },
      {
        label: '$pProgressProc',
        documentation:
          '**[optional]** The address of a callback function that is called each time another portion of the file has been copied.(See MSDN for more information)',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** pointer to an argument to be passed to the callback function. Can be NULL.',
      },
    ],
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
  _WinAPI_CopyImage: {
    documentation:
      'Creates a new image (icon, cursor, or bitmap) and copies the attributes of the specified image to the new one',
    label:
      '_WinAPI_CopyImage ( $hImage [, $iType = 0 [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$hImage',
        documentation: 'Handle to the image to be copied.',
      },
      {
        label: '$iType',
        documentation:
          "**[optional]** Specifies the type of image to be copied. This parameter can be one of the following values:    $IMAGE_BITMAP 'Default)    $IMAGE_CURSOR    $IMAGE_ICON",
      },
      {
        label: '$iXDesiredPixels',
        documentation:
          '**[optional]** Specifies the desired width, in pixels, of the image. If this is zero (Default), then the returned image will have the same width as the original $hImage.',
      },
      {
        label: '$iYDesiredPixels',
        documentation:
          '**[optional]** Specifies the desired height, in pixels, of the image. If this is zero (Default), then the returned image will have the same height as the original $hImage.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.$LR_DEFAULTCOLOR (Default)$LR_COPYDELETEORG$LR_COPYFROMRESOURCE$LR_COPYRETURNORG$LR_CREATEDIBSECTION$LR_DEFAULTSIZE$LR_MONOCHROME',
      },
    ],
  },
  _WinAPI_CopyRect: {
    documentation: 'Copies the coordinates of one rectangle to another',
    label: '_WinAPI_CopyRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure whose coordinates are to be copied in logical units.',
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
  _WinAPI_CoTaskMemAlloc: {
    documentation: 'Allocates a block of task memory',
    label: '_WinAPI_CoTaskMemAlloc ( $iSize )',
    params: [
      {
        label: '$iSize',
        documentation: 'The size of the memory block to be allocated, in bytes.',
      },
    ],
  },
  _WinAPI_CoTaskMemFree: {
    documentation: 'Frees a block of task memory',
    label: '_WinAPI_CoTaskMemFree ( $pMemory )',
    params: [
      {
        label: '$pMemory',
        documentation: 'The pointer to the memory block to be freed.',
      },
    ],
  },
  _WinAPI_CoTaskMemRealloc: {
    documentation: 'Changes the size of a previously allocated block of task memory',
    label: '_WinAPI_CoTaskMemRealloc ( $pMemory, $iSize )',
    params: [
      {
        label: '$pMemory',
        documentation: 'The pointer to the memory block to be reallocated.',
      },
      {
        label: '$iSize',
        documentation: 'The size of the memory block to be reallocated, in bytes.',
      },
    ],
  },
  _WinAPI_CoUninitialize: {
    documentation: 'Closes the COM library on the current process',
    label: '_WinAPI_CoUninitialize (  )',
    params: [],
  },
  _WinAPI_Create32BitHBITMAP: {
    documentation: 'Creates a 32 bits-per-pixel bitmap from the specified icon',
    label: '_WinAPI_Create32BitHBITMAP ( $hIcon [, $bDib = False [, $bDelete = False]] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the source icon.',
      },
      {
        label: '$bDib',
        documentation:
          '**[optional]** Specifies whether to create device-independent (DIB) or device-dependent (DDB) bitmap, valid values: True - Creates DIB.False - Creates DDB (Default).',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the icon after the function is successful, valid values:    True - Icon will be deleted if the function succeeds.    False - Do not delete, you must release the icon when you are finished using it (Default).',
      },
    ],
  },
  _WinAPI_Create32BitHICON: {
    documentation: 'Converts an icon to a 32 bits-per-pixel format and copies to the new icon',
    label: '_WinAPI_Create32BitHICON ( $hIcon [, $bDelete = False] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to be converted.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the icon after the function is successful, valid values:    True - Icon will be deleted if the function succeeds.    False - Do not delete, you must release the icon themselves when you are finished using it (Default).',
      },
    ],
  },
  _WinAPI_CreateANDBitmap: {
    documentation: 'Creates AND bitmask device-independent bitmap (DIB) from the specified bitmap',
    label: '_WinAPI_CreateANDBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap from which to create AND bitmask DIB.',
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
  _WinAPI_CreateBitmapIndirect: {
    documentation:
      'Creates a bitmap with the specified width, height, and color format (color planes and bits-per-pixel)',
    label: '_WinAPI_CreateBitmapIndirect ( $tBITMAP )',
    params: [
      {
        label: '$tBITMAP',
        documentation:
          '$tagBITMAP structure that contains information about the bitmap.If an application sets the "bmWidth" or "bmHeight" members to zero, _WinAPI_CreateBitmapIndirect() returns the handle to a 1-by-1 pixel, monochrome bitmap.',
      },
    ],
  },
  _WinAPI_CreateBrushIndirect: {
    documentation: 'Creates a logical brush that has the specified style, color, and pattern',
    label: '_WinAPI_CreateBrushIndirect ( $iStyle, $iRGB [, $iHatch = 0] )',
    params: [
      {
        label: '$iStyle',
        documentation:
          'The brush style. This parameter can be one of the following styles:    $BS_DIBPATTERN    $BS_DIBPATTERN8X8    $BS_DIBPATTERNPT    $BS_HATCHED    $BS_HOLLOW    $BS_NULL    $BS_PATTERN    $BS_PATTERN8X8    $BS_SOLID',
      },
      {
        label: '$iRGB',
        documentation:
          'The color of a brush, in RGB, or one of the following values.    $DIB_PAL_COLORS    $DIB_RGB_COLORS',
      },
      {
        label: '$iHatch',
        documentation:
          '**[optional]** A hatch style. The meaning depends on the brush style defined by $iStyle parameter.$BS_DIBPATTERNContains a handle to a packed DIB.$BS_DIBPATTERNPTContains a pointer to a packed DIB.$BS_HATCHEDSpecifies the orientation of the lines used to create the hatch. It can be one of the orientation constants ($HS_*).$BS_PATTERNContains a handle to the bitmap that defines the pattern. The bitmap cannot be a DIB section bitmap.$BS_HOLLOW$BS_SOLID (Default)Ignored.',
      },
    ],
  },
  _WinAPI_CreateBuffer: {
    documentation: 'Allocates a block of memory from the internal library heap',
    label: '_WinAPI_CreateBuffer ( $iLength [, $pBuffer = 0 [, $bAbort = True]] )',
    params: [
      {
        label: '$iLength',
        documentation: 'The required buffer length, in bytes.',
      },
      {
        label: '$pBuffer',
        documentation:
          '**[optional]** A pointer to the existing buffer that to be replaced by a new buffer.If this parameter is a valid buffer pointer, the memory will be reallocated for a new buffer.However, the new memory is allocated at a different location. Therefore, you should always use the pointer that returns this function.If this parameter is 0 (Default) or invalid buffer pointer, the function just allocates a new memory.',
      },
      {
        label: '$bAbort',
        documentation:
          '**[optional]** Specifies whether to exit the script if not enough memory, valid values:    True - Displaying an error message and exit the script with error code 1 (Default).    False - Continue the script and return an error.',
      },
    ],
  },
  _WinAPI_CreateBufferFromStruct: {
    documentation:
      "Allocates a block of memory from the internal library heap and initializes it with the structure's data",
    label: '_WinAPI_CreateBufferFromStruct ( $tStruct [, $pBuffer = 0 [, $bAbort = True]] )',
    params: [
      {
        label: '$tStruct',
        documentation: 'The structure that contains data to initialize the buffer.',
      },
      {
        label: '$pBuffer',
        documentation:
          '**[optional]** A pointer to the existing buffer that to be replaced by a new buffer.If this parameter is a valid buffer pointer, the memory will be reallocated for a new buffer. However, the new memory is allocated at a different location.Therefore, you should always use the pointer that returns this function.If this parameter is 0 (Default) or invalid buffer pointer, the function just allocates a new memory.',
      },
      {
        label: '$bAbort',
        documentation:
          '**[optional]** Specifies whether to exit the script if not enough memory, valid values:    True - Displaying an error message and exit the script with error code 1 (Default).    False - Continue the script and return an error.',
      },
    ],
  },
  _WinAPI_CreateCaret: {
    documentation:
      'Creates a new shape for the system caret and assigns ownership of the caret to the specified window',
    label: '_WinAPI_CreateCaret ( $hWnd, $hBitmap [, $iWidth = 0 [, $iHeight = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that owns the caret.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the bitmap that defines the caret shape.If this parameter is 0, the caret is solid.If this parameter is 1, the caret is gray. If this parameter is a bitmap handle, the caret is the specified bitmap.',
      },
      {
        label: '$iWidth',
        documentation:
          '**[optional]** The width of the caret in logical units.If this parameter is 0 (Default), the width is set to the system-defined window border width.If $hBitmap is a bitmap handle, _WinAPI_CreateCaret() ignores this parameter.',
      },
      {
        label: '$iHeight',
        documentation:
          '**[optional]** The height of the caret in logical units.If this parameter is 0 (Default), the height is set to the system-defined window border height.If $hBitmap is a bitmap handle, _WinAPI_CreateCaret() ignores this parameter.',
      },
    ],
  },
  _WinAPI_CreateColorAdjustment: {
    documentation: 'Creates $tagCOLORADJUSTMENT structure specifies the color adjustment',
    label:
      '_WinAPI_CreateColorAdjustment ( [$iFlags = 0 [, $iIlluminant = 0 [, $iGammaR = 10000 [, $iGammaG = 10000 [, $iGammaB = 10000 [, $iBlack = 0 [, $iWhite = 10000 [, $iContrast = 0 [, $iBrightness = 0 [, $iColorfulness = 0 [, $iTint = 0]]]]]]]]]]] )',
    params: [
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how the output image should be prepared. This parameter can be 0 or any combination of the following values:    $CA_NEGATIVE    $CA_LOG_FILTER',
      },
      {
        label: '$iIlluminant',
        documentation:
          '**[optional]** The type of standard light source under which the image is viewed. This parameter can be only one of the following values:    $ILLUMINANT_DEVICE_DEFAULT (Default)    $ILLUMINANT_A    $ILLUMINANT_B    $ILLUMINANT_C    $ILLUMINANT_D50    $ILLUMINANT_D55    $ILLUMINANT_D65    $ILLUMINANT_D75    $ILLUMINANT_F2    $ILLUMINANT_TUNGSTEN    $ILLUMINANT_DAYLIGHT    $ILLUMINANT_FLUORESCENT    $ILLUMINANT_NTSC',
      },
      {
        label: '$iGammaR',
        documentation:
          '**[optional]** The n(th) power gamma-correction value for the red primary of the source colors.The value must be in the range from 2500 to 65,000.A value of 10,000 (Default) means no gamma correction.',
      },
      {
        label: '$iGammaG',
        documentation:
          '**[optional]** The n(th) power gamma-correction value for the green primary of the source colors.The value must be in the range from 2500 to 65,000.A value of 10,000 (Default) means no gamma correction.',
      },
      {
        label: '$iGammaB',
        documentation:
          '**[optional]** The n(th) power gamma-correction value for the blue primary of the source colors.The value must be in the range from 2500 to 65,000.A value of 10,000 (Default) means no gamma correction.',
      },
      {
        label: '$iBlack',
        documentation:
          '**[optional]** The black reference for the source colors. Any colors that are darker than this are treated as black.The value must be in the range from 0 to 4000.Default is 0.',
      },
      {
        label: '$iWhite',
        documentation:
          '**[optional]** The white reference for the source colors. Any colors that are lighter than this are treated as white.The value must be in the range from 6000 to 10,000.Default is 10,000',
      },
      {
        label: '$iContrast',
        documentation:
          '**[optional]** The amount of contrast to be applied to the source object.The value must be in the range from -100 to 100.A value of 0 (Default) means no contrast adjustment.',
      },
      {
        label: '$iBrightness',
        documentation:
          '**[optional]** The amount of brightness to be applied to the source object.The value must be in the range from -100 to 100.A value of 0 (Default) means no brightness adjustment.',
      },
      {
        label: '$iColorfulness',
        documentation:
          '**[optional]** The amount of colorfulness to be applied to the source object.The value must be in the range from -100 to 100.A value of 0 (Default) means no colorfulness adjustment).',
      },
      {
        label: '$iTint',
        documentation:
          '**[optional]** The amount of red or green tint adjustment to be applied to the source object.The value must be in the range from -100 to 100.Positive numbers adjust toward red and negative numbers adjust toward green.A value of 0 (Default) means no tint adjustment.',
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
  _WinAPI_CreateCompatibleBitmapEx: {
    documentation: 'Creates a bitmap compatible with the device and fills it the specified color',
    label: '_WinAPI_CreateCompatibleBitmapEx ( $hDC, $iWidth, $iHeight, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$iWidth',
        documentation: 'The bitmap width, in pixels.',
      },
      {
        label: '$iHeight',
        documentation: 'The bitmap height, in pixels.',
      },
      {
        label: '$iRGB',
        documentation: 'The bitmap color, in RGB.',
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
  _WinAPI_CreateDesktop: {
    documentation:
      'Creates a new desktop, associates it with the current window station of the calling process',
    label:
      '_WinAPI_CreateDesktop ( $sName [, $iAccess = 0x0002 [, $iFlags = 0 [, $iHeap = 0 [, $tSecurity = 0]]]] )',
    params: [
      {
        label: '$sName',
        documentation:
          'The name of the desktop to be created. Desktop names are case-insensitive and may not contain backslash characters (\\).',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The requested access to the desktop. This parameter can be one or more of the following values:    $DESKTOP_ALL_ACCESS    $DESKTOP_CREATEMENU    $DESKTOP_CREATEWINDOW (Default)    $DESKTOP_ENUMERATE    $DESKTOP_HOOKCONTROL    $DESKTOP_JOURNALPLAYBACK    $DESKTOP_JOURNALRECORD    $DESKTOP_READOBJECTS    $DESKTOP_SWITCHDESKTOP    $DESKTOP_WRITEOBJECTS',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. It can be zero or the following value:    $DF_ALLOWOTHERACCOUNTHOOK',
      },
      {
        label: '$iHeap',
        documentation: '**[optional]** The size of the desktop heap, in kilobytes. Default is 0.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines whether the returned handle can be inherited by child processes.If this parameter is 0 (Default), the handle cannot be inherited .',
      },
    ],
  },
  _WinAPI_CreateDIB: {
    documentation:
      'Creates an uncompressed device-independent bitmap (DIB) with the specified width, height, and color depth',
    label:
      '_WinAPI_CreateDIB ( $iWidth, $iHeight [, $iBitsPerPel = 32 [, $tColorTable = 0 [, $iColorCount = 0]]] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'The width of the bitmap, in pixels.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height of the bitmap, in pixels. If this value is positive, the bitmap is a bottom-up DIB and its origin is the lower-left corner, otherwise, the bitmap is a top-down DIB and its origin is the upper-left corner.',
      },
      {
        label: '$iBitsPerPel',
        documentation:
          '**[optional]** The number of bits that define each pixel and the maximum number of colors in the bitmap. Default is 32.',
      },
      {
        label: '$tColorTable',
        documentation:
          '**[optional]** "dword[n]" structure that represents a DIB color table.The number of colors in this table depends on the values of the $iBitsPerPel parameters.',
      },
      {
        label: '$iColorCount',
        documentation:
          '**[optional]** The number of color indexes in the DIB color table that are actually used by the bitmap.The value of this parameter should not exceed the number of colors in the color table pointed to by the $pColorTable parameter. Default is 0.',
      },
    ],
  },
  _WinAPI_CreateDIBColorTable: {
    documentation: 'Creates RGB color table from the specified array of colors',
    label:
      '_WinAPI_CreateDIBColorTable ( Const ByRef $aColorTable [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$aColorTable',
        documentation: 'The array of colors, in RGB, that to be make up the DIB color table.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start creating at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop creating at.',
      },
    ],
  },
  _WinAPI_CreateDIBitmap: {
    documentation:
      'Creates a compatible bitmap (DDB) from a DIB and, optionally, sets the bitmap bits',
    label: '_WinAPI_CreateDIBitmap ( $hDC, $tBITMAPINFO, $iUsage [, $pBits = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$tBITMAPINFO',
        documentation:
          '$tagBITMAPINFO structure that specifies various attributes of the DIB, including the bitmap dimensions and colors.Note that a positive value for the height indicates a bottom-up DIB while a negative value for the height indicates a top-down DIB.',
      },
      {
        label: '$iUsage',
        documentation:
          'The type of colors used. This parameter must be one of the following values:    $DIB_PAL_COLORS    $DIB_RGB_COLORS',
      },
      {
        label: '$pBits',
        documentation:
          '**[optional]** A pointer to an array of bytes containing the initial bitmap data.',
      },
    ],
  },
  _WinAPI_CreateDIBSection: {
    documentation: 'Creates a DIB that applications can write to directly',
    label:
      '_WinAPI_CreateDIBSection ( $hDC, $tBITMAPINFO, $iUsage, ByRef $pBits [, $hSection = 0 [, $iOffset = 0]] )',
    params: [
      {
        label: '$hDC',
        documentation:
          "Handle to a device context. If the value of $iUsage is $DIB_PAL_COLORS, the function uses this device context's logical palette to initialize the DIB colors.",
      },
      {
        label: '$tBITMAPINFO',
        documentation:
          '$tagBITMAPINFO structure that specifies various attributes of the DIB, including the bitmap dimensions and colors.',
      },
      {
        label: '$iUsage',
        documentation:
          'The type of colors used (either logical palette indexes or literal RGB values). The following values are defined:    $DIB_PAL_COLORS    $DIB_RGB_COLORS',
      },
      {
        label: '$pBits',
        documentation: 'Returns a pointer to the location of the DIB bit values.',
      },
      {
        label: '$hSection',
        documentation:
          '**[optional]** Handle to a file-mapping object that the function will use to create the DIB.',
      },
      {
        label: '$iOffset',
        documentation:
          '**[optional]** The offset from the beginning of the file-mapping object referenced by $hSection where storage for the bitmap bit values is to begin. This value is ignored if $hSection is 0 (Default).',
      },
    ],
  },
  _WinAPI_CreateDirectory: {
    documentation: 'Creates a new directory',
    label: '_WinAPI_CreateDirectory ( $sDir [, $tSecurity = 0] )',
    params: [
      {
        label: '$sDir',
        documentation: 'The path of the directory to be created.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new directory.If this parameter is 0 (Default), the directory gets a default security descriptor. The ACL in the default security descriptor for a directory are inherited from its parent directory.',
      },
    ],
  },
  _WinAPI_CreateDirectoryEx: {
    documentation: 'Creates a new directory with the attributes of a specified template directory',
    label: '_WinAPI_CreateDirectoryEx ( $sNewDir, $sTemplateDir [, $tSecurity = 0] )',
    params: [
      {
        label: '$sNewDir',
        documentation: 'The path of the directory to be created.',
      },
      {
        label: '$sTemplateDir',
        documentation:
          'The path of the directory to use as a template when creating the new directory.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new directory.If this parameter is 0 (Default), the directory gets a default security descriptor.The ACL in the default security descriptor for a directory are inherited from its parent directory.',
      },
    ],
  },
  _WinAPI_CreateEllipticRgn: {
    documentation: 'Creates an elliptical region',
    label: '_WinAPI_CreateEllipticRgn ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the upper-left and lower-right corners of the bounding rectangle of the ellipse in logical units.',
      },
    ],
  },
  _WinAPI_CreateEmptyIcon: {
    documentation:
      'Creates a fully transparent icon with the specified width, height, and color depth',
    label: '_WinAPI_CreateEmptyIcon ( $iWidth, $iHeight [, $iBitsPerPel = 32] )',
    params: [
      {
        label: '$iWidth',
        documentation: 'The width, in pixels, of the icon.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in pixels, of the icon.',
      },
      {
        label: '$iBitsPerPel',
        documentation:
          '**[optional]** The number of bits-per-pixel in the XOR bitmask of the icon. Default is 32.',
      },
    ],
  },
  _WinAPI_CreateEnhMetaFile: {
    documentation: 'Creates a device context for an enhanced-format metafile',
    label:
      "_WinAPI_CreateEnhMetaFile ( [$hDC = 0 [, $tRECT = 0 [, $bPixels = False [, $sFilePath = '' [, $sDescription = '']]]]] )",
    params: [
      {
        label: '$hDC',
        documentation:
          '**[optional]** Handle to a reference device for the enhanced metafile. The system uses this device context to record the resolution and units of the device on which a picture originally appeared.If this parameter is 0 (Default), it uses the current display device for reference.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that specifies the dimensions of the picture to be stored in the enhanced metafile.If this parameter is 0 (Default), the graphics device interface computes the dimensions of the smallest rectangle that surrounds the picture drawn by the application.',
      },
      {
        label: '$bPixels',
        documentation:
          '**[optional]** Specifies whether the $tRECT structure defined in pixels, valid values:    True     - In logical units (pixels).    False    - In .01-millimeter units (Default).',
      },
      {
        label: '$sFilePath',
        documentation:
          "**[optional]** The file name for the enhanced metafile to be created.If this parameter is '' (Default), the enhanced metafile is memory based and its contents are lost when it is deleted by using the _WinAPI_DeleteEnhMetaFile() function.",
      },
      {
        label: '$sDescription',
        documentation:
          '**[optional]** The string that specifies the name of the application that created the picture, as well as the picture\'s title. This string must be an empty string or represented as follows:    "application name|picture name"',
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
  _WinAPI_CreateFileEx: {
    documentation: 'Creates or opens a file or I/O device',
    label:
      '_WinAPI_CreateFileEx ( $sFilePath, $iCreation [, $iAccess = 0 [, $iShare = 0 [, $iFlagsAndAttributes = 0 [, $tSecurity = 0 [, $hTemplate = 0]]]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or device to be created or opened.',
      },
      {
        label: '$iCreation',
        documentation:
          'The action to take on a file or device that exists or does not exist. This parameter must be one of the following values, which cannot be combined.    $CREATE_NEW    $CREATE_ALWAYS    $OPEN_EXISTING    $OPEN_ALWAYS    $TRUNCATE_EXISTING',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The requested access to the file or device, which can be summarized as read, write, both or neither (zero) (Default).    $GENERIC_READ    $GENERIC_WRITE    (See MSDN for more information)',
      },
      {
        label: '$iShare',
        documentation:
          '**[optional]** The requested sharing mode of the file or device, which can be read, write, both, delete, all of these, or none.If this parameter is 0 (Default) and _WinAPI_CreateFileEx() succeeds, the file or device cannot be shared and cannot be opened again until the handle to the file or device is closed.    $FILE_SHARE_DELETE    $FILE_SHARE_READ    $FILE_SHARE_WRITE',
      },
      {
        label: '$iFlagsAndAttributes',
        documentation:
          '**[optional]** The file or device attributes and flags. This parameter can be one or more of the following values:    $FILE_ATTRIBUTE_READONLY    $FILE_ATTRIBUTE_HIDDEN    $FILE_ATTRIBUTE_SYSTEM    $FILE_ATTRIBUTE_DIRECTORY    $FILE_ATTRIBUTE_ARCHIVE    $FILE_ATTRIBUTE_DEVICE    $FILE_ATTRIBUTE_NORMAL    $FILE_ATTRIBUTE_TEMPORARY    $FILE_ATTRIBUTE_SPARSE_FILE    $FILE_ATTRIBUTE_REPARSE_POINT    $FILE_ATTRIBUTE_COMPRESSED    $FILE_ATTRIBUTE_OFFLINE    $FILE_ATTRIBUTE_NOT_CONTENT_INDEXED    $FILE_ATTRIBUTE_ENCRYPTED    $FILE_FLAG_BACKUP_SEMANTICS    $FILE_FLAG_DELETE_ON_CLOSE    $FILE_FLAG_NO_BUFFERING    $FILE_FLAG_OPEN_NO_RECALL    $FILE_FLAG_OPEN_REPARSE_POINT    $FILE_FLAG_OVERLAPPED    $FILE_FLAG_POSIX_SEMANTICS    $FILE_FLAG_RANDOM_ACCESS    $FILE_FLAG_SEQUENTIAL_SCAN    $FILE_FLAG_WRITE_THROUGH    $SECURITY_ANONYMOUS (Default)    $SECURITY_CONTEXT_TRACKING    $SECURITY_DELEGATION    $SECURITY_EFFECTIVE_ONLY    $SECURITY_IDENTIFICATION    $SECURITY_IMPERSONATION',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that contains two separate but related data members: an optional security descriptor, and a Boolean value that determines whether the returned handle can be inherited by child processes.If this parameter is 0 (Default), the handle cannot be inherited by any child processes the application may create and the file or device associated with the returned handle gets a default security descriptor.',
      },
      {
        label: '$hTemplate',
        documentation:
          '**[optional]** Handle to a template file with the $GENERIC_READ access right. The template file supplies file attributes and extended attributes for the file that is being created.',
      },
    ],
  },
  _WinAPI_CreateFileMapping: {
    documentation: 'Creates or opens a named or unnamed file mapping object for a specified file',
    label:
      "_WinAPI_CreateFileMapping ( $hFile [, $iSize = 0 [, $sName = '' [, $iProtect = 0x0004 [, $tSecurity = 0]]]] )",
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file from which to create a file mapping object.If this parameter is (-1), the calling process must also specify a size for the file mapping object in the $iSize parameters.In this scenario, _WinAPI_CreateFileMapping() creates a file mapping object of a specified size that is backed by the system paging file instead of by a file in the file system.',
      },
      {
        label: '$iSize',
        documentation:
          '**[optional]** The maximum size of the file mapping object.If this parameter is 0 (Default), the maximum size of the file mapping object is equal to the current size of the file that $hFile identifies.',
      },
      {
        label: '$sName',
        documentation: '**[optional]** The name of the file mapping object.',
      },
      {
        label: '$iProtect',
        documentation:
          '**[optional]** Specifies the page protection of the file mapping object and can be one of the following values.    $PAGE_EXECUTE_READ    $PAGE_EXECUTE_READWRITE    $PAGE_EXECUTE_WRITECOPY    $PAGE_READONLY    $PAGE_READWRITE (Default)    $PAGE_WRITECOPYAn application can specify one or more of the following attributes for the file mapping object by combining them with one of the preceding page protection values.    $SEC_COMMIT    $SEC_IMAGE    $SEC_LARGE_PAGES    $SEC_NOCACHE    $SEC_RESERVE    $SEC_WRITECOMBINE',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines whether a returned handle can be inherited by child processes.If this parameter is 0 (Default), the handle cannot be inherited and the file mapping object gets a default security descriptor.',
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
  _WinAPI_CreateFontEx: {
    documentation: 'Creates a logical font with the specified characteristics',
    label:
      "_WinAPI_CreateFontEx ( $iHeight [, $iWidth = 0 [, $iEscapement = 0 [, $iOrientation = 0 [, $iWeight = 400 [, $bItalic = False [, $bUnderline = False [, $bStrikeOut = False [, $iCharSet = 1 [, $iOutPrecision = 0 [, $iClipPrecision = 0 [, $iQuality = 0 [, $iPitchAndFamily = 0 [, $sFaceName = '' [, $iStyle = 0]]]]]]]]]]]]]] )",
    params: [
      {
        label: '$iHeight',
        documentation: "The height of the font's character cell or character, in logical units.",
      },
      {
        label: '$iWidth',
        documentation: '**[optional]** The average width, in logical units. Default is 0.',
      },
      {
        label: '$iEscapement',
        documentation:
          '**[optional]** The angle, in tenths of degrees, between the escapement vector and the x-axis of the device. Default is 0',
      },
      {
        label: '$iOrientation',
        documentation:
          "**[optional]** The angle, in tenths of degrees, between each character's base line and the x-axis of the device. Default is 0",
      },
      {
        label: '$iWeight',
        documentation:
          '**[optional]** The weight of the font in the range 0 through 1000, or one of the following values.    $FW_DONTCARE    $FW_THIN    $FW_EXTRALIGHT    $FW_ULTRALIGHT    $FW_LIGHT    $FW_NORMAL (Default)    $FW_REGULAR    $FW_MEDIUM    $FW_SEMIBOLD    $FW_DEMIBOLD    $FW_BOLD    $FW_EXTRABOLD    $FW_ULTRABOLD    $FW_HEAVY    $FW_BLACK',
      },
      {
        label: '$bItalic',
        documentation:
          '**[optional]** Specifies whether to set italic font attribute, valid values:    True - The attribute is set.    False - The attribute is not set (Default).',
      },
      {
        label: '$bUnderline',
        documentation:
          '**[optional]** Specifies whether to set underlined font attribute, valid values:    True - The attribute is set.    False - The attribute is not set (Default).',
      },
      {
        label: '$bStrikeOut',
        documentation:
          '**[optional]** Specifies whether to set strikeout font attribute, valid values:    True - The attribute is set.    False - The attribute is not set (Default).',
      },
      {
        label: '$iCharSet',
        documentation:
          '**[optional]** The character set. It can be one of the following values.    $ANSI_CHARSET    $BALTIC_CHARSET    $CHINESEBIG5_CHARSET    $DEFAULT_CHARSET (Default)    $EASTEUROPE_CHARSET    $GB2312_CHARSET    $GREEK_CHARSET    $HANGEUL_CHARSET    $MAC_CHARSET    $OEM_CHARSET    $RUSSIAN_CHARSET    $SHIFTJIS_CHARSET    $SYMBOL_CHARSET    $TURKISH_CHARSET    $VIETNAMESE_CHARSETKorean language edition of Windows:    $JOHAB_CHARSETMiddle East language edition of Windows:    $ARABIC_CHARSET    $HEBREW_CHARSETThai language edition of Windows:    $THAI_CHARSET',
      },
      {
        label: '$iOutPrecision',
        documentation:
          '**[optional]** The output precision. It can be one of the following values.    $OUT_CHARACTER_PRECIS    $OUT_DEFAULT_PRECIS (Default)    $OUT_DEVICE_PRECIS    $OUT_OUTLINE_PRECIS    $OUT_PS_ONLY_PRECIS    $OUT_RASTER_PRECIS    $OUT_STRING_PRECIS    $OUT_STROKE_PRECIS    $OUT_TT_ONLY_PRECIS    $OUT_TT_PRECIS',
      },
      {
        label: '$iClipPrecision',
        documentation:
          '**[optional]** The clipping precision. It can be one or more of the following values.    $CLIP_CHARACTER_PRECIS    $CLIP_DEFAULT_PRECIS (Default)    $CLIP_DFA_DISABLE    $CLIP_EMBEDDED    $CLIP_LH_ANGLES    $CLIP_DFA_OVERRIDE    $CLIP_STROKE_PRECIS',
      },
      {
        label: '$iQuality',
        documentation:
          '**[optional]** The output quality. It can be one of the following values.    $ANTIALIASED_QUALITY    $CLEARTYPE_QUALITY    $DEFAULT_QUALITY (Default)    $DRAFT_QUALITY    $NONANTIALIASED_QUALITY    $PROOF_QUALITY',
      },
      {
        label: '$iPitchAndFamily',
        documentation:
          '**[optional]** The pitch and family of the font. The two low-order bits specify the pitch of the font and can be one of the following values.    $DEFAULT_PITCH (Default    $FIXED_PITCH    $VARIABLE_PITCHThe four high-order bits specify the font family and can be one of the following values.    $FF_DECORATIVE    $FF_DONTCARE    $FF_MODERN    $FF_ROMAN    $FF_SCRIPT    $FF_SWISS',
      },
      {
        label: '$sFaceName',
        documentation:
          '**[optional]** The typeface name of the font (not including style). For example, "Arial", "Tahoma", etc.',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the font. It can be one or more of the following values.    $FS_REGULAR (Default)    $FS_BOLD    $FS_ITALIC',
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
  _WinAPI_CreateGUID: {
    documentation: 'Creates a globally unique identifier (GUID)',
    label: '_WinAPI_CreateGUID (  )',
    params: [],
  },
  _WinAPI_CreateHardLink: {
    documentation: 'Establishes a hard link between an existing file and a new file',
    label: '_WinAPI_CreateHardLink ( $sNewFile, $sExistingFile )',
    params: [
      {
        label: '$sNewFile',
        documentation: 'The name of the new file.',
      },
      {
        label: '$sExistingFile',
        documentation: 'The name of the existing file.',
      },
    ],
  },
  _WinAPI_CreateIcon: {
    documentation: 'Creates an icon that has the specified size, colors, and bit patterns',
    label:
      '_WinAPI_CreateIcon ( $hInstance, $iWidth, $iHeight, $iPlanes, $iBitsPixel, $pANDBits, $pXORBits )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Handle to the instance of the module creating the icon.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in pixels, of the icon.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in pixels, of the icon.',
      },
      {
        label: '$iPlanes',
        documentation: 'The number of planes in the XOR bitmask of the icon.',
      },
      {
        label: '$iBitsPixel',
        documentation: 'The number of bits-per-pixel in the XOR bitmask of the icon.',
      },
      {
        label: '$pANDBits',
        documentation:
          'An array of bytes that contains the bit values for the AND bitmask of the icon. This bitmask describes a monochrome bitmap.',
      },
      {
        label: '$pXORBits',
        documentation:
          'An array of bytes that contains the bit values for the XOR bitmask of the icon. This bitmask describes a monochrome or device-dependent color bitmap.',
      },
    ],
  },
  _WinAPI_CreateIconFromResourceEx: {
    documentation: 'Creates an icon or cursor from resource bits describing the icon',
    label:
      '_WinAPI_CreateIconFromResourceEx ( $pData, $iSize [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData',
        documentation:
          'The icon or cursor resource bits. These bits are typically loaded by calls to the _WinAPI_LookupIconIdFromDirectoryEx() and _WinAPI_LoadResource() functions.',
      },
      {
        label: '$iSize',
        documentation: 'The size, in bytes, of the set of bits pointed to by the $pData parameter.',
      },
      {
        label: '$bIcon',
        documentation:
          '**[optional]** Specifies whether an icon or a cursor is to be created, valid values:    True - An icon is to be created (Default).    False - A cursor is to be created.',
      },
      {
        label: '$iXDesiredPixels',
        documentation:
          '**[optional]** The desired width, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value to set the width.',
      },
      {
        label: '$iYDesiredPixels',
        documentation:
          '**[optional]** The desired height, in pixels, of the icon or cursor. If this parameter is zero (Default), the function uses the system metric value to set the height.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.    $LR_DEFAULTCOLOR (Default)    $LR_DEFAULTSIZE    $LR_MONOCHROME    $LR_SHARED',
      },
    ],
  },
  _WinAPI_CreateIconIndirect: {
    documentation:
      'Creates an icon or cursor that has the specified size, colors, and bit patterns',
    label:
      '_WinAPI_CreateIconIndirect ( $hBitmap, $hMask [, $iXHotspot = 0 [, $iYHotspot = 0 [, $bIcon = True]]] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the icon color bitmap.',
      },
      {
        label: '$hMask',
        documentation: 'Handle to the icon bitmask bitmap.',
      },
      {
        label: '$iXHotspot',
        documentation:
          "**[optional]** Specifies the x-coordinate of a cursor's hot spot. If creates an icon, the hot spot is always in the center of the icon, and this parameter is ignored. Default is 0.",
      },
      {
        label: '$iYHotspot',
        documentation:
          "**[optional]** Specifies the y-coordinate of a cursor's hot spot. If creates an icon, the hot spot is always in the center of the icon, and this parameter is ignored. Default is 0.",
      },
      {
        label: '$bIcon',
        documentation:
          '**[optional]** Specifies whether creates an icon or a cursor, valid values:    True - Creates an icon (Default).    False - Creates a cursor.',
      },
    ],
  },
  _WinAPI_CreateJobObject: {
    documentation: 'Creates or opens a job object',
    label: "_WinAPI_CreateJobObject ( [$sName = '' [, $tSecurity = 0]] )",
    params: [
      {
        label: '$sName',
        documentation:
          "**[optional]** The name of the job. Name comparison is case-sensitive. If this parameter is '', the job is created without a name.",
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies the security descriptor for the job object and determines whether child processes can inherit the returned handle.If this parameter is 0 (Default), the job object gets a default security descriptor and the handle cannot be inherited.',
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
  _WinAPI_CreateMRUList: {
    documentation: 'Creates a new most recently used (MRU) list',
    label: '_WinAPI_CreateMRUList ( $hKey, $sSubKey [, $iMax = 26] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the currently open key, or one of the following predefined values under which to store the MRU data.$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE',
      },
      {
        label: '$sSubKey',
        documentation: 'The subkey under which to store the MRU data.',
      },
      {
        label: '$iMax',
        documentation:
          '**[optional]** The maximum number of entries in the MRU list. Default is 26 (A..Z).',
      },
    ],
  },
  _WinAPI_CreateMutex: {
    documentation: 'Creates or opens a named or unnamed mutex object',
    label: '_WinAPI_CreateMutex ( $sMutex [, $bInitial = True [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sMutex',
        documentation: 'The name of the mutex object. Name comparisons are case sensitive.',
      },
      {
        label: '$bInitial',
        documentation:
          '**[optional]** Specifies whether the calling process obtains the initial ownership of the mutex object, valid values:    True - The calling thread obtains initial ownership of the mutex object (Default).    False - The calling thread does not obtain ownership of the mutex object.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new mutex.If this parameter is 0 (Default), the mutex gets a default security descriptor.',
      },
    ],
  },
  _WinAPI_CreateNullRgn: {
    documentation: 'Creates an empty region',
    label: '_WinAPI_CreateNullRgn (  )',
    params: [],
  },
  _WinAPI_CreateNumberFormatInfo: {
    documentation:
      'Creates a $tagNUMBERFMT structure with the specified number formatting information',
    label:
      '_WinAPI_CreateNumberFormatInfo ( $iNumDigits, $iLeadingZero, $iGrouping, $sDecimalSep, $sThousandSep, $iNegativeOrder )',
    params: [
      {
        label: '$iNumDigits',
        documentation: 'The number of fractional digits placed after the decimal separator.',
      },
      {
        label: '$iLeadingZero',
        documentation:
          'Specifier for leading zeros in decimal fields, valid values:    0 - No leading zeros.    1 - Leading zeros.',
      },
      {
        label: '$iGrouping',
        documentation:
          'The number of digits in each group of numbers to the left of the decimal separator.The values in the range 0 through 9 and 32 are valid.Typical examples are:    0 to group digits as in 123456789.00;    3 to group digits as in 123,456,789.00;    and 32 to group digits as in 12,34,56,789.00.',
      },
      {
        label: '$sDecimalSep',
        documentation: 'The decimal separator string.',
      },
      {
        label: '$sThousandSep',
        documentation: 'The thousand separator string.',
      },
      {
        label: '$iNegativeOrder',
        documentation:
          'The negative number mode, valid values:    0 - Left parenthesis, number, right parenthesis; for example, (1.1).    1 - Negative sign, number; for example, -1.1.    2 - Negative sign, space, number; for example, - 1.1.    3 - Number, negative sign; for example, 1.1-.    4 - Number, space, negative sign; for example, 1.1 -.',
      },
    ],
  },
  _WinAPI_CreateObjectID: {
    documentation: 'Creates or retrieves the object identifier for the specified file or directory',
    label: '_WinAPI_CreateObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'Path to the file or directory to create or retrieve object identifier.',
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
  _WinAPI_CreatePolygonRgn: {
    documentation: 'Creates a polygonal region',
    label:
      '_WinAPI_CreatePolygonRgn ( Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1 [, $iMode = 1]]] )',
    params: [
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the vertices of the polygon in logical units.The polygon is presumed closed. Each vertex can be specified only once.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start creating at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop creating at.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The fill mode used to determine which pixels are in the region. This parameter can be one of the following values:    $ALTERNATE (Default)    $WINDING',
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
  _WinAPI_CreateProcessWithToken: {
    documentation:
      'Creates a new process and its primary thread in the security context of the specified token',
    label:
      "_WinAPI_CreateProcessWithToken ( $sApp, $sCmd, $iFlags, $tStartupInfo, $tProcessInfo, $hToken [, $iLogon = 0 [, $pEnvironment = 0 [, $sDir = '']]] )",
    params: [
      {
        label: '$sApp',
        documentation:
          'The name of the module to be executed. If this parameter is an empty string, the module name must be the first white space–delimited token in the command line string.',
      },
      {
        label: '$sCmd',
        documentation:
          'The command line to be executed. If this parameter is an empty string, the function uses the module name as the command line.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that control how the process is created.The $CREATE_DEFAULT_ERROR_MODE, $CREATE_NEW_CONSOLE, and $CREATE_NEW_PROCESS_GROUP are enabled by default.You can specify additional flags as noted:    $CREATE_DEFAULT_ERROR_MODE    $CREATE_NEW_CONSOLE    $CREATE_NEW_PROCESS_GROUP    $CREATE_SEPARATE_WOW_VDM    $CREATE_SUSPENDED    $CREATE_UNICODE_ENVIRONMENT',
      },
      {
        label: '$tStartupInfo',
        documentation: 'a $tagSTARTUPINFO structure or a pointer to it.',
      },
      {
        label: '$tProcessInfo',
        documentation:
          'a $tagPROCESS_INFORMATION structure or a pointer to it that receives information for the new process, including a handle to the process.',
      },
      {
        label: '$hToken',
        documentation:
          'A handle to the primary token that represents a user. The handle must have the $TOKEN_QUERY, $TOKEN_DUPLICATE, and $TOKEN_ASSIGN_PRIMARY access rights.',
      },
      {
        label: '$iLogon',
        documentation:
          '**[optional]** The logon option. This parameter can be zero or one of the following values:    $LOGON_WITH_PROFILE    $LOGON_NETCREDENTIALS_ONLY',
      },
      {
        label: '$pEnvironment',
        documentation: '**[optional]** A pointer to an environment block for the new process.',
      },
      {
        label: '$sDir',
        documentation:
          '**[optional]** The path to the current directory for the process.If this parameter is an empty string (Default), the new process will have the same current drive and directory as the calling process.',
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
  _WinAPI_CreateRectRgnIndirect: {
    documentation: 'Creates a rectangular region',
    label: '_WinAPI_CreateRectRgnIndirect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the upper-left and lower-right corners of the rectangle that defines the region in logical units.',
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
  _WinAPI_CreateSemaphore: {
    documentation: 'Creates or opens a named or unnamed semaphore object',
    label: '_WinAPI_CreateSemaphore ( $sSemaphore, $iInitial, $iMaximum [, $tSecurity = 0] )',
    params: [
      {
        label: '$sSemaphore',
        documentation:
          'The name of the semaphore to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iInitial',
        documentation:
          'The initial count for the semaphore object. This value must be greater than or equal to zero and less than or equal to $iMaximum.',
      },
      {
        label: '$iMaximum',
        documentation:
          'The maximum count for the semaphore object. This value must be greater than zero.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new semaphore.If this parameter is 0 (Default), the semaphore gets a default security descriptor.',
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
  _WinAPI_CreateStreamOnHGlobal: {
    documentation: 'Creates a stream object that uses a memory handle to store the stream contents',
    label: '_WinAPI_CreateStreamOnHGlobal ( [$hGlobal = 0 [, $bDeleteOnRelease = True]] )',
    params: [
      {
        label: '$hGlobal',
        documentation:
          '**[optional]** The memory handle, or if 0 (Default) a new handle is to be allocated instead. The handle must be allocated as moveable and nondiscardable.',
      },
      {
        label: '$bDeleteOnRelease',
        documentation:
          '**[optional]** Specifies whether the underlying handle for this stream object should be automatically freed when the stream object is released, valid values:    True - The final release will automatically free the $hGlobal parameter (Default).    False - The user must free the $hGlobal after the final release.',
      },
    ],
  },
  _WinAPI_CreateString: {
    documentation:
      'Copies a specified string to the newly allocated memory block and returns its pointer',
    label:
      '_WinAPI_CreateString ( $sString [, $pString = 0 [, $iLength = -1 [, $bUnicode = True [, $bAbort = True]]]] )',
    params: [
      {
        label: '$sString',
        documentation: 'The source string to be copied.',
      },
      {
        label: '$pString',
        documentation:
          '**[optional]** A pointer to the existing string that to be replaced by a new string.If this parameter is a valid string pointer, the memory will be reallocated for a new string.However, the new memory is allocated at a different location. Therefore, you should always use the pointer that returns this function.If this parameter is 0 (Default) or invalid string pointer, the function just allocates a new memory.',
      },
      {
        label: '$iLength',
        documentation:
          '**[optional]** The required buffer length, in TCHARs, without null-terminating character.If this parameter is (-1), the buffer length will be equal to the length of the source string.If $iLength is less than a source string, the string will be truncated to the specified length. Default is 1.',
      },
      {
        label: '$bUnicode',
        documentation:
          '**[optional]** Specifies whether a string is Unicode or ASCII code of a character, valid values:    True - Unicode (Default).    False - ASCII.',
      },
      {
        label: '$bAbort',
        documentation:
          '**[optional]** Specifies whether to exit the script if not enough memory, valid values:    True - Displaying an error message and exit the script with error code 1 (Default).    False - Continue the script and return an error.',
      },
    ],
  },
  _WinAPI_CreateSymbolicLink: {
    documentation: 'Creates a symbolic link',
    label: '_WinAPI_CreateSymbolicLink ( $sSymlink, $sTarget [, $bDirectory = False] )',
    params: [
      {
        label: '$sSymlink',
        documentation: 'The name of the new file.',
      },
      {
        label: '$sTarget',
        documentation: 'The name of the existing file.',
      },
      {
        label: '$bDirectory',
        documentation:
          '**[optional]** Specifies whether the link target is a directory.    True - The link target is a directory.    False - The link target is a file (Default).',
      },
    ],
  },
  _WinAPI_CreateTransform: {
    documentation:
      'Creates $tagXFORM structure specifies a world-space to page-space transformation',
    label:
      '_WinAPI_CreateTransform ( [$nM11 = 1 [, $nM12 = 0 [, $nM21 = 0 [, $nM22 = 1 [, $nDX = 0 [, $nDY = 0]]]]]] )',
    params: [
      {
        label: '$nM11',
        documentation:
          '**[optional]** The following.Rotation - Cosine of rotation angle.Scaling - Horizontal scaling component.Shear - Not used. Reflection - Horizontal component.',
      },
      {
        label: '$nM12',
        documentation:
          '**[optional]** The following.Rotation - Sine of the rotation angle.Scaling - Not used. Shear - Horizontal proportionality constant.Reflection - Not used.',
      },
      {
        label: '$nM21',
        documentation:
          '**[optional]** The following.Rotation - Negative sine of the rotation angle.Scaling - Not used. Shear - Vertical proportionality constant.Reflection - Not used.',
      },
      {
        label: '$nM22',
        documentation:
          '**[optional]** The following.Rotation - Cosine of rotation angle.Scaling - Vertical scaling component.Shear - Not used.Reflection - Vertical reflection component.',
      },
      {
        label: '$nDx',
        documentation:
          '**[optional]** The horizontal translation component, in logical units. Default is 0.',
      },
      {
        label: '$nDy',
        documentation:
          '**[optional]** The vertical translation component, in logical units. Default is 0.',
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
  _WinAPI_CreateWindowStation: {
    documentation:
      'Creates a window station object, associates it with the calling process, and assigns it to the current session',
    label:
      "_WinAPI_CreateWindowStation ( [$sName = '' [, $iAccess = 0 [, $iFlags = 0 [, $tSecurity = 0]]]] )",
    params: [
      {
        label: '$sName',
        documentation:
          '**[optional]** The name of the window station to be created. Window station names are case-insensitive and cannot contain backslash characters (\\).Only members of the Administrators group are allowed to specify a name.If this parameter is empty string (Default), the system forms a window station name using the logon session identifier for the calling process.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The type of access the returned handle has to the window station. This parameter can be one or more of the following values:    $WINSTA_ALL_ACCESS    $WINSTA_ACCESSCLIPBOARD    $WINSTA_ACCESSGLOBALATOMS    $WINSTA_CREATEDESKTOP    $WINSTA_ENUMDESKTOPS    $WINSTA_ENUMERATE    $WINSTA_EXITWINDOWS    $WINSTA_READATTRIBUTES    $WINSTA_READSCREEN    $WINSTA_WRITEATTRIBUTES',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. It can be zero (Default) or the following value:    $CWF_CREATE_ONLY',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines whether the returned handle can be inherited by child processes. If this parameter is 0 (Default), the handle cannot be inherited.',
      },
    ],
  },
  _WinAPI_DecompressBuffer: {
    documentation: 'Decompresses an entire compressed buffer',
    label:
      '_WinAPI_DecompressBuffer ( $pUncompressedBuffer, $iUncompressedSize, $pCompressedBuffer, $iCompressedSize [, $iFormat = 0x0002] )',
    params: [
      {
        label: '$pUncompressedBuffer',
        documentation:
          'A pointer to a caller-allocated buffer that receives the decompressed data from compressed buffer.',
      },
      {
        label: '$iUncompressedSize',
        documentation: 'The size of the uncompressed buffer, in bytes.',
      },
      {
        label: '$pCompressedBuffer',
        documentation: 'A pointer to the buffer that contains the data to decompress.',
      },
      {
        label: '$iCompressedSize',
        documentation: 'The size of the compressed buffer, in bytes.',
      },
      {
        label: '$iFormat',
        documentation:
          '**[optional]** The compression format of the data in compressed buffer. This parameter must be one of the following values:    $COMPRESSION_FORMAT_LZNT1 (Default)    $COMPRESSION_FORMAT_XPRESS    $COMPRESSION_FORMAT_XPRESS_HUFF',
      },
    ],
  },
  _WinAPI_DecryptFile: {
    documentation: 'Decrypts an encrypted file or directory',
    label: '_WinAPI_DecryptFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of the file or directory to be decrypted. If $sFilePath specifies a read-only file, the function fails and the last error code is ERROR_FILE_READ_ONLY (6009). If $sFilePath specifies a directory that contains a read-only file, the functions succeeds but the directory is not decrypted.',
      },
    ],
  },
  _WinAPI_DeferWindowPos: {
    documentation:
      'Updates the specified multiple-window-position structure for the specified window',
    label:
      '_WinAPI_DeferWindowPos ( $hInfo, $hWnd, $hAfter, $iX, $iY, $iWidth, $iHeight, $iFlags )',
    params: [
      {
        label: '$hInfo',
        documentation:
          'Handle to a multiple-window-position structure that contains size and position information for one or more windows. This structure is returned by _WinAPI_BeginDeferWindowPos() or by the most recent call to _WinAPI_DeferWindowPos().',
      },
      {
        label: '$hWnd',
        documentation:
          'Handle to the window for which update information is stored in the structure.All windows in a multiple-window-position structure must have the same parent.',
      },
      {
        label: '$hAfter',
        documentation:
          'Handle to the window that precedes the positioned window in the Z order.This parameter must be a window handle or one of the following values. This parameter is ignored if the $SWP_NOZORDER flag is set in the $iFlags parameter.    $HWND_BOTTOM    $HWND_NOTOPMOST    $HWND_TOP    $HWND_TOPMOST',
      },
      {
        label: '$iX',
        documentation: "The x-coordinate of the window's upper-left corner.",
      },
      {
        label: '$iY',
        documentation: "The y-coordinate of the window's upper-left corner.",
      },
      {
        label: '$iWidth',
        documentation: "The window's new width, in pixels.",
      },
      {
        label: '$iHeight',
        documentation: "The window's new height, in pixels.",
      },
      {
        label: '$iFlags',
        documentation:
          'A combination of the following values that affect the size and position of the window.    $SWP_DRAWFRAME    $SWP_FRAMECHANGED    $SWP_HIDEWINDOW    $SWP_NOACTIVATE    $SWP_NOCOPYBITS    $SWP_NOMOVE    $SWP_NOOWNERZORDER    $SWP_NOREDRAW    $SWP_NOREPOSITION    $SWP_NOSENDCHANGING    $SWP_NOSIZE    $SWP_NOZORDER    $SWP_SHOWWINDOW',
      },
    ],
  },
  _WinAPI_DefineDosDevice: {
    documentation: 'Defines, redefines, or deletes MS-DOS device names',
    label: "_WinAPI_DefineDosDevice ( $sDevice, $iFlags [, $sFilePath = ''] )",
    params: [
      {
        label: '$sDevice',
        documentation: 'The name of the MS-DOS device.',
      },
      {
        label: '$iFlags',
        documentation:
          'This parameter can be one or more of the following values.$DDD_EXACT_MATCH_ON_REMOVE$DDD_NO_BROADCAST_SYSTEM$DDD_RAW_TARGET_PATH$DDD_REMOVE_DEFINITION',
      },
      {
        label: '$sFilePath',
        documentation: '**[optional]** The path that will implement device.',
      },
    ],
  },
  _WinAPI_DefRawInputProc: {
    documentation:
      'Calls the default raw input procedure to process the raw input messages that an application does not process',
    label: '_WinAPI_DefRawInputProc ( $paRawInput, $iInput )',
    params: [
      {
        label: '$paRawInput',
        documentation:
          'A pointer to an array of $tagRAWINPUT structures that is returned by _WinAPI_GetRawInputBuffer().',
      },
      {
        label: '$iInput',
        documentation: 'The number of structures in array.',
      },
    ],
  },
  _WinAPI_DefSubclassProc: {
    documentation: "Calls the next handler in a window's subclass chain",
    label: '_WinAPI_DefSubclassProc ( $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window being subclassed.',
      },
      {
        label: '$iMsg',
        documentation: 'The message to be sent.',
      },
      {
        label: '$wParam',
        documentation: 'The message-specific information.',
      },
      {
        label: '$lParam',
        documentation: 'The message-specific information.',
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
  _WinAPI_DefWindowProcW: {
    documentation:
      'Calls the default window procedure to provide default processing for any window messages',
    label: '_WinAPI_DefWindowProcW ( $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window procedure that received the message.',
      },
      {
        label: '$iMsg',
        documentation: 'The message.',
      },
      {
        label: '$wParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
      {
        label: '$lParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
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
  _WinAPI_DeleteEnhMetaFile: {
    documentation: 'Deletes an enhanced-format metafile or an enhanced-format metafile handle',
    label: '_WinAPI_DeleteEnhMetaFile ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to an enhanced metafile.',
      },
    ],
  },
  _WinAPI_DeleteFile: {
    documentation: 'Deletes an existing file',
    label: '_WinAPI_DeleteFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to be deleted.',
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
  _WinAPI_DeleteObjectID: {
    documentation: 'Removes the object identifier from a specified file or directory',
    label: '_WinAPI_DeleteObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'Path to the file or directory from the object identifier that is to be deleted.',
      },
    ],
  },
  _WinAPI_DeleteVolumeMountPoint: {
    documentation: 'Deletes a drive letter or mounted folder',
    label: '_WinAPI_DeleteVolumeMountPoint ( $sMountedPath )',
    params: [
      {
        label: '$sMountedPath',
        documentation:
          'The drive letter or mounted folder to be deleted (for example, X:\\ or Y:\\MountX\\).',
      },
    ],
  },
  _WinAPI_DeregisterShellHookWindow: {
    documentation:
      'Unregisters a specified Shell window that is registered to receive Shell hook messages',
    label: '_WinAPI_DeregisterShellHookWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to unregister from receiving Shell hook messages.',
      },
    ],
  },
  _WinAPI_DestroyCaret: {
    documentation:
      "Destroys the caret's current shape, frees the caret from the window, and removes the caret from the screen",
    label: '_WinAPI_DestroyCaret (  )',
    params: [],
  },
  _WinAPI_DestroyCursor: {
    documentation: 'Destroys a cursor and frees any memory the cursor occupied',
    label: '_WinAPI_DestroyCursor ( $hCursor )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Handle to the cursor to be destroyed. The cursor must not be in use.',
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
  _WinAPI_DeviceIoControl: {
    documentation: 'Sends a control code directly to a specified device driver',
    label:
      '_WinAPI_DeviceIoControl ( $hDevice, $iControlCode [, $pInBuffer = 0 [, $iInBufferSize = 0 [, $pOutBuffer = 0 [, $iOutBufferSize = 0]]]] )',
    params: [
      {
        label: '$hDevice',
        documentation:
          'Handle to the device on which the operation is to be performed.The device is typically a volume, directory, file, or stream. To retrieve a device handle, use the _WinAPI_CreateFileEx() function.To specify a device name, use the following format:    _WinAPI_CreateFileEx("\\\\.\\DeviceName", ...)',
      },
      {
        label: '$iControlCode',
        documentation:
          'The control code for the operation.This value identifies the specific operation to be performed and the type of device on which to perform it.',
      },
      {
        label: '$pInBuffer',
        documentation:
          '**[optional]** A pointer to the input buffer that contains the data required to perform the operation.',
      },
      {
        label: '$iInBufferSize',
        documentation: '**[optional]** The size of the input buffer, in bytes. Default is 0.',
      },
      {
        label: '$pOutBuffer',
        documentation:
          '**[optional]** A pointer to the output buffer that is to receive the data returned by the operation.',
      },
      {
        label: '$iOutBufferSize',
        documentation: '**[optional]** The size of the output buffer, in bytes. Default is 0.',
      },
    ],
  },
  _WinAPI_DisplayStruct: {
    documentation: 'Displays data from the specified structure or memory address as a list',
    label:
      "_WinAPI_DisplayStruct ( $tStruct [, $sStruct = '' [, $sTitle = '' [, $iItem = 0 [, $iSubItem = 0 [, $iFlags = 0 [, $bTop = True [, $hParent = 0]]]]]]] )",
    params: [
      {
        label: '$tStruct',
        documentation:
          'A structure that was created by DllStructCreate(), or memory address to be display its data.',
      },
      {
        label: '$sStruct',
        documentation:
          '**[optional]** A string representing the structure.If $tStruct is a structure, this parameter can be omitted or be an empty string. In this case, the structure will display as "byte[n]" structure.If $tStruct is a memory address, $sStruct should be a string representing the structure, otherwise, the function fail, and @error set to 10.',
      },
      {
        label: '$sTitle',
        documentation:
          '**[optional]** The title of the window, deault is "Structure: ListView Display".',
      },
      {
        label: '$iItem',
        documentation:
          '**[optional]** The 1-based index or name of the structure member to be selected in the list.If this parameter is 0 (Default), or an incorrect index or name, the first element of the structure will be selected.',
      },
      {
        label: '$iSubItem',
        documentation:
          '**[optional]** The 1-based index of the array in the structure member pointed to by the $iItem parameter to be selected.If $iItem was not defined as an array in the $sStruct, or invalid array index, the element pointed to by the $iItem parameter will be selected.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A set of bit flags that specifies an additional displaying options.This parameter can be 0, or any combination of the following values:    1 - Prevent displaying "" and "" fields at the beginning and end of the list.    2 - Prevent displaying "" fields.    4 - Prevent displaying "" in "Member" column of the list if the structure element has no name.    8 - Prevent highlighting structure elements that are defined as an array.    16 - Prevent perceiving structure elements named "Reserved*" as unused elements.    32 - Prevent using double-click to copy values of the structure elements to the clipboard.    64 - Forced to expand structure elements of BYTE[n] and BOOLEAN[n] types (elements of CHAR[n] and WCHAR[n] types always displays as a string).    128 - Forced to display the values of the structure elements in the hexadecimal representation, if possible.    256 - Forced to return error code instead of displaying a message box if a memory access error occurred.    512 - Forced to disable checking the read access memory allocated to a given structure.',
      },
      {
        label: '$bTop',
        documentation:
          '**[optional]** Specifies whether create a window with "Always On Top" attribute, valid values:    True - The window is created with the $WS_EX_TOPMOST extended style (Default).    False - The window will not have the "TOPMOST" flag set.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to the parent window.',
      },
    ],
  },
  _WinAPI_DllGetVersion: {
    documentation: 'Retrieves a DLL-specific version information',
    label: '_WinAPI_DllGetVersion ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file from which information is retrieved.',
      },
    ],
  },
  _WinAPI_DllInstall: {
    documentation: 'Registers OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllInstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file that will be registered.',
      },
    ],
  },
  _WinAPI_DllUninstall: {
    documentation: 'Unregisters OLE controls such as DLL or ActiveX Controls (OCX) files',
    label: '_WinAPI_DllUninstall ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the DLL file that will be unregistered.',
      },
    ],
  },
  _WinAPI_DPtoLP: {
    documentation: 'Converts device coordinates into logical coordinates',
    label: '_WinAPI_DPtoLP ( $hDC, ByRef $tPOINT [, $iCount = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tPOINT',
        documentation:
          '$tagPOINT structure or structure of points ("long x1;long y1;...long xN;long yN") containing the x- and y-coordinates to be transformed.',
      },
      {
        label: '$iCount',
        documentation: '**[optional]** The number of points. Default is 1.',
      },
    ],
  },
  _WinAPI_DragAcceptFiles: {
    documentation: 'Registers whether a window accepts dropped files',
    label: '_WinAPI_DragAcceptFiles ( $hWnd [, $bAccept = True] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that is registering whether it will accept dropped files.',
      },
      {
        label: '$bAccept',
        documentation:
          '**[optional]** Specifies whether a window accepts dropped files, valid values:    True - Accept dropped files (Default).    False - Discontinue accepting dropped files.',
      },
    ],
  },
  _WinAPI_DragFinish: {
    documentation:
      'Releases memory that the system allocated for use in transferring file names to the application',
    label: '_WinAPI_DragFinish ( $hDrop )',
    params: [
      {
        label: '$hDrop',
        documentation:
          'Handle of the drop structure that describes the dropped file. This parameter is passed toWM_DROPFILES message with WPARAM parameter.',
      },
    ],
  },
  _WinAPI_DragQueryFileEx: {
    documentation:
      'Retrieves the names of dropped files that result from a successful drag-and-drop operation',
    label: '_WinAPI_DragQueryFileEx ( $hDrop [, $iFlag = 0] )',
    params: [
      {
        label: '$hDrop',
        documentation:
          'Handle of the drop structure that describes the dropped file. This parameter is passed toWM_DROPFILES message with WPARAM parameter.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies whether to return files folders or both, valid values:0 - Return both files and folders (Default).1 - Return files only.2 - Return folders only.',
      },
    ],
  },
  _WinAPI_DragQueryPoint: {
    documentation:
      'Retrieves the position of the mouse pointer at the time a file was dropped during a drag-and-drop operation',
    label: '_WinAPI_DragQueryPoint ( $hDrop )',
    params: [
      {
        label: '$hDrop',
        documentation:
          'Handle of the drop structure that describes the dropped file. This parameter is passed to WM_DROPFILES message with WPARAM parameter.',
      },
    ],
  },
  _WinAPI_DrawAnimatedRects: {
    documentation:
      'Animates the caption of a window to indicate the opening of an icon or the minimizing or maximizing of a window',
    label: '_WinAPI_DrawAnimatedRects ( $hWnd, $tRectFrom, $tRectTo )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose caption should be animated on the screen.',
      },
      {
        label: '$tRectFrom',
        documentation:
          '$tagRECT structure specifying the location and size of the icon or minimized window.',
      },
      {
        label: '$tRectTo',
        documentation:
          '$tagRECT structure specifying the location and size of the restored window.',
      },
    ],
  },
  _WinAPI_DrawBitmap: {
    documentation: 'Draws a bitmap into the specified device context',
    label: '_WinAPI_DrawBitmap ( $hDC, $iX, $iY, $hBitmap [, $iRop = 0x00CC0020] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the bitmap will be drawn.',
      },
      {
        label: '$iX',
        documentation: 'Specifies the logical x-coordinate of the upper-left corner of the bitmap.',
      },
      {
        label: '$iY',
        documentation: 'Specifies the logical y-coordinate of the upper-left corner of the bitmap.',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to be drawn.',
      },
      {
        label: '$iRop',
        documentation:
          '**[optional]** The raster-operation code (same as for _WinAPI_BitBlt()). Default is $SRCCOPY.',
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
  _WinAPI_DrawFocusRect: {
    documentation:
      'Draws a rectangle in the style used to indicate that the rectangle has the focus',
    label: '_WinAPI_DrawFocusRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that specifies the logical coordinates of the rectangle that is to be drawn.',
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
  _WinAPI_DrawShadowText: {
    documentation: 'Draws formatted text in the specified rectangle with a drop shadow',
    label:
      '_WinAPI_DrawShadowText ( $hDC, $sText, $iRGBText, $iRGBShadow [, $iXOffset = 0 [, $iYOffset = 0 [, $tRECT = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$sText',
        documentation: 'The string that contains the text to be drawn.',
      },
      {
        label: '$iRGBText',
        documentation: 'The color of the text, in RGB.',
      },
      {
        label: '$iRGBShadow',
        documentation: 'The color of the shadow, in RGB.',
      },
      {
        label: '$iXOffset',
        documentation:
          '**[optional]** The x-coordinate of where the text should begin. Default is 0.',
      },
      {
        label: '$iYOffset',
        documentation:
          '**[optional]** The y-coordinate of where the text should begin. Default is 0.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that contains, in logical coordinates, the rectangle in which the text is to be drawn.If this parameter is 0 (Default), the size will be equal size of the device context ($hDC).',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies how the text is to be drawn. This parameter can be a combination of the formatting text constants ($DT_*).',
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
  _WinAPI_DuplicateEncryptionInfoFile: {
    documentation: 'Copies the EFS metadata from one file or directory to another',
    label:
      '_WinAPI_DuplicateEncryptionInfoFile ( $sSrcFilePath, $sDestFilePath [, $iCreation = 2 [, $iAttributes = 0 [, $tSecurity = 0]]] )',
    params: [
      {
        label: '$sSrcFilePath',
        documentation:
          'The name of the file or directory from which the EFS metadata is to be copied.This source file or directory must be encrypted.',
      },
      {
        label: '$sDestFilePath',
        documentation:
          'The name of the file or directory to which the EFS metadata is to be copied.This destination file or directory does not have to be encrypted before the call to this function.If the source is a file, this parameter must also specify a file, and likewise for directories.',
      },
      {
        label: '$iCreation',
        documentation:
          '**[optional]** Specifies how the destination file or directory is to be opened.The following are the valid values of this parameter:    $CREATE_NEW    $CREATE_ALWAYS (Default)',
      },
      {
        label: '$iAttributes',
        documentation:
          '**[optional]** The file attributes of the destination file or directory.The $FILE_READ_ONLY attribute is currently not processed by this function.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies the security attributes of the destination file or directory, if it does not already exist.If this parameter is 0 (Default), the file or directory gets a default security descriptor.The access-control lists (ACL) in the default security descriptor for a file or directory are inherited from its parent directory.',
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
  _WinAPI_DuplicateTokenEx: {
    documentation:
      'Creates a new primary or impersonation access token that duplicates an existing token',
    label:
      '_WinAPI_DuplicateTokenEx ( $hToken, $iAccess, $iLevel [, $iType = 1 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hToken',
        documentation: 'A handle to an access token opened with $TOKEN_DUPLICATE access.',
      },
      {
        label: '$iAccess',
        documentation:
          'The requested access rights for the new token. To request the same access rights as the existing token, specify zero.To request all access rights that are valid for the caller, specify the $TOKEN_ALL_ACCESS access.',
      },
      {
        label: '$iLevel',
        documentation:
          'The security impersonation levels.    $SECURITYANONYMOUS    $SECURITYIDENTIFICATION    $SECURITYIMPERSONATION    $SECURITYDELEGATION',
      },
      {
        label: '$iType',
        documentation: '**[optional]** The token type.    $TOKENPRIMARY    $TOKENIMPERSONATION',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new token and determines whether child processes can inherit the token.If this parameter is 0 (Default), the token gets a default security descriptor and the handle cannot be inherited.If the security descriptor contains a system access control list, the token gets $ACCESS_SYSTEM_SECURITY access right, even if it was not requested.',
      },
    ],
  },
  _WinAPI_DwmDefWindowProc: {
    documentation:
      'Default window procedure for Desktop Window Manager (DWM) hit testing within the non-client area',
    label: '_WinAPI_DwmDefWindowProc ( $hWnd, $iMsg, $wParam, $lParam )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window procedure that received the message.',
      },
      {
        label: '$iMsg',
        documentation: 'The message.',
      },
      {
        label: '$wParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
      {
        label: '$lParam',
        documentation:
          'Additional message-specific information. The content of this parameter depends on the message.',
      },
    ],
  },
  _WinAPI_DwmEnableBlurBehindWindow: {
    documentation: 'Enables the blur effect on a specified window',
    label:
      '_WinAPI_DwmEnableBlurBehindWindow ( $hWnd [, $bEnable = True [, $bTransition = False [, $hRgn = 0]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window on which the blur behind data is applied.',
      },
      {
        label: '$bEnable',
        documentation:
          '**[optional]** Specifies whether register or unregister the window handle to DWM blur behind, valid values:    True    - Register (Default).    False - Unregister.',
      },
      {
        label: '$bTransition',
        documentation:
          "**[optional]** Specifies whether colorize transition to match the maximized windows, valid values:    True    - The window's should be colorized.    False - Otherwise (Default).",
      },
      {
        label: '$hRgn',
        documentation:
          '**[optional]** The region within the client area to apply the blur behind.A value of zero (Default) will apply the blur behind the entire client area.',
      },
    ],
  },
  _WinAPI_DwmEnableComposition: {
    documentation: 'Enables or disables Desktop Window Manager (DWM) composition',
    label: '_WinAPI_DwmEnableComposition ( $bEnable )',
    params: [
      {
        label: '$bEnable',
        documentation:
          'Specifies whether enable or disable DWM composition, valid values:    True - Enable.    False - Disable.',
      },
    ],
  },
  _WinAPI_DwmExtendFrameIntoClientArea: {
    documentation: 'Extends the window frame behind the client area',
    label: '_WinAPI_DwmExtendFrameIntoClientArea ( $hWnd [, $tMARGINS = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window for which the frame is extended into the client area.',
      },
      {
        label: '$tMARGINS',
        documentation:
          '**[optional]** $tagMARGINS structure that describes the margins to use when extending the frame into the client area.Negative margins are used to create the "sheet of glass" effect where the client area is rendered as a solid surface with no window border (Default).',
      },
    ],
  },
  _WinAPI_DwmGetColorizationColor: {
    documentation:
      'Retrieves the current color used for Desktop Window Manager (DWM) glass composition',
    label: '_WinAPI_DwmGetColorizationColor (  )',
    params: [],
  },
  _WinAPI_DwmGetColorizationParameters: {
    documentation: 'Retrieves the colorization parameters used for Desktop Window Manager (DWM)',
    label: '_WinAPI_DwmGetColorizationParameters (  )',
    params: [],
  },
  _WinAPI_DwmGetWindowAttribute: {
    documentation: 'Retrieves the current value of a specified attribute applied to the window',
    label: '_WinAPI_DwmGetWindowAttribute ( $hWnd, $iAttribute )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window for which the attribute data is retrieved.',
      },
      {
        label: '$iAttribute',
        documentation:
          'The attribute to retrieve. This parameter can be one of the following values:    $DWMWA_NCRENDERING_ENABLED    $DWMWA_CAPTION_BUTTON_BOUNDS    $DWMWA_EXTENDED_FRAME_BOUNDS',
      },
    ],
  },
  _WinAPI_DwmInvalidateIconicBitmaps: {
    documentation:
      'Indicates that all previously provided iconic bitmaps from a window, both thumbnails and peek representations, should be refreshed',
    label: '_WinAPI_DwmInvalidateIconicBitmaps ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window or tab whose bitmaps are being invalidated through this call.',
      },
    ],
  },
  _WinAPI_DwmIsCompositionEnabled: {
    documentation: 'Determines whether Desktop Window Manager (DWM) composition is enabled',
    label: '_WinAPI_DwmIsCompositionEnabled (  )',
    params: [],
  },
  _WinAPI_DwmQueryThumbnailSourceSize: {
    documentation: 'Returns the source size of the Desktop Window Manager (DWM) thumbnail',
    label: '_WinAPI_DwmQueryThumbnailSourceSize ( $hThumbnail )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Handle of the thumbnail to retrieve the source window size from.',
      },
    ],
  },
  _WinAPI_DwmRegisterThumbnail: {
    documentation:
      'Creates a Desktop Window Manager (DWM) thumbnail relationship between the destination and source windows',
    label: '_WinAPI_DwmRegisterThumbnail ( $hDestination, $hSource )',
    params: [
      {
        label: '$hDestination',
        documentation: 'Handle to the window that will use the DWM thumbnail.',
      },
      {
        label: '$hSource',
        documentation: 'Handle to the window to use as the thumbnail source.',
      },
    ],
  },
  _WinAPI_DwmSetColorizationParameters: {
    documentation: 'Sets the colorization parameters for Desktop Window Manager (DWM)',
    label: '_WinAPI_DwmSetColorizationParameters ( $tDWMCP )',
    params: [
      {
        label: '$tDWMCP',
        documentation:
          '$tagDWM_COLORIZATION_PARAMETERS containing the colorization parameters to be set.',
      },
    ],
  },
  _WinAPI_DwmSetIconicLivePreviewBitmap: {
    documentation:
      'Sets a static, iconic bitmap to display a live preview (also known as a Peek preview) of a window or tab',
    label:
      '_WinAPI_DwmSetIconicLivePreviewBitmap ( $hWnd, $hBitmap [, $bFrame = False [, $tClient = 0]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window or tab.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the device-independent bitmap (DIB) to represent the specified window.',
      },
      {
        label: '$bFrame',
        documentation:
          '**[optional]** Specifies whether display a frame around the provided bitmap, valid values:    True - Display frame.    False - Do not display frame (Default).',
      },
      {
        label: '$tClient',
        documentation:
          "**[optional]** $tagPOINT structure that contains The offset of a tab window's client region from the host window's frame.This offset enables the tab window's contents to be drawn correctly in a live preview when it is drawn without its frame.",
      },
    ],
  },
  _WinAPI_DwmSetIconicThumbnail: {
    documentation:
      'Sets a static, iconic bitmap on a window or tab to use as a thumbnail representation',
    label: '_WinAPI_DwmSetIconicThumbnail ( $hWnd, $hBitmap [, $bFrame = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window or tab.',
      },
      {
        label: '$hBitmap',
        documentation:
          'Handle to the device-independent bitmap (DIB) to represent the specified window.',
      },
      {
        label: '$bFrame',
        documentation:
          '**[optional]** Specifies whether display a frame around the provided thumbnail, valid values:    True - Display frame.    False - Do not display frame (Default).',
      },
    ],
  },
  _WinAPI_DwmSetWindowAttribute: {
    documentation:
      'Sets the value of the specified attributes for non-client rendering to apply to the window',
    label: '_WinAPI_DwmSetWindowAttribute ( $hWnd, $iAttribute, $iData )',
    params: [
      {
        label: '$hWnd',
        documentation: 'The window handle to apply the given attribute.',
      },
      {
        label: '$iAttribute',
        documentation:
          'The attribute to apply to the window. This parameter can be one of the following values:    $DWMWA_NCRENDERING_POLICY    $DWMWA_TRANSITIONS_FORCEDISABLED    $DWMWA_ALLOW_NCPAINT    $DWMWA_NONCLIENT_RTL_LAYOUT    $DWMWA_FORCE_ICONIC_REPRESENTATION    $DWMWA_FLIP3D_POLICYWindows 7 or later    $DWMWA_HAS_ICONIC_BITMAP    $DWMWA_DISALLOW_PEEK    $DWMWA_EXCLUDED_FROM_PEEK',
      },
      {
        label: '$iData',
        documentation: 'The value of the attribute.',
      },
    ],
  },
  _WinAPI_DwmUnregisterThumbnail: {
    documentation: 'Removes a Desktop Window Manager (DWM) thumbnail relationship',
    label: '_WinAPI_DwmUnregisterThumbnail ( $hThumbnail )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Handle to the thumbnail relationship to be removed.',
      },
    ],
  },
  _WinAPI_DwmUpdateThumbnailProperties: {
    documentation: 'Specifies Desktop Window Manager (DWM) thumbnail properties',
    label:
      '_WinAPI_DwmUpdateThumbnailProperties ( $hThumbnail [, $bVisible = True [, $bClientAreaOnly = False [, $iOpacity = 255 [, $tRectDest = 0 [, $tRectSrc = 0]]]]] )',
    params: [
      {
        label: '$hThumbnail',
        documentation: 'Handle of the thumbnail to retrieve the source window size from.',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Specifies whether make the thumbnail visible or invisible, valid values:    True  - Visible (Default).    False     - Invisible.',
      },
      {
        label: '$bClientAreaOnly',
        documentation:
          "**[optional]** Specifies whether use only the thumbnail source's client area or entire window, valid values:    True - Use only source's client area.    False     - Use entire window (Default).",
      },
      {
        label: '$iOpacity',
        documentation:
          '**[optional]** The opacity with which to render the thumbnail. 0 is fully transparent while 255 (Default) is fully opaque.',
      },
      {
        label: '$tRectDest',
        documentation:
          '**[optional]** $tagRECT structure containing the rectangle in the destination window the thumbnail will be rendered.By default, the size of this rectangle equal to the source size of the DWM thumbnail which returns the _WinAPI_DwmQueryThumbnailSourceSize() function.',
      },
      {
        label: '$tRectSrc',
        documentation:
          '**[optional]** $tagRECT structure containing the rectangle that specifies the region of the source window to use as the thumbnail.By default, the entire window is used as the thumbnail.',
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
  _WinAPI_EjectMedia: {
    documentation: 'Ejects media from a device',
    label: '_WinAPI_EjectMedia ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the CD tray to eject, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_Ellipse: {
    documentation: 'Draws an ellipse',
    label: '_WinAPI_Ellipse ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the bounding rectangle.',
      },
    ],
  },
  _WinAPI_EmptyWorkingSet: {
    documentation:
      'Removes as many pages as possible from the working set of the specified process',
    label: '_WinAPI_EmptyWorkingSet ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
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
  _WinAPI_EncryptFile: {
    documentation: 'Encrypts a file or directory',
    label: '_WinAPI_EncryptFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of the file or directory to be encrypted.If $sFilePath specifies a read-only file, the function fails and the last error code is ERROR_FILE_READ_ONLY (6009).If $sFilePath specifies a directory that contains a read-only file, the functions succeeds but the directory is not encrypted.',
      },
    ],
  },
  _WinAPI_EncryptionDisable: {
    documentation: 'Disables or enables encryption of the specified directory and the files in it',
    label: '_WinAPI_EncryptionDisable ( $sDir, $bDisable )',
    params: [
      {
        label: '$sDir',
        documentation:
          'The name of the directory for which to enable or disable encryption.If this parameter specifies a file, the attempt will fail.',
      },
      {
        label: '$bDisable',
        documentation:
          'Specifies whether to disable or enable encryption, valid values:    True - Disable.    False - Enable.',
      },
    ],
  },
  _WinAPI_EndDeferWindowPos: {
    documentation:
      'Simultaneously updates the position and size of one or more windows in a single screen-refreshing cycle',
    label: '_WinAPI_EndDeferWindowPos ( $hInfo )',
    params: [
      {
        label: '$hInfo',
        documentation:
          'Handle to a multiple-window-position structure that contains size and position information for one or more windows.This internal structure is returned by the _WinAPI_BeginDeferWindowPos() function or by the most recent call to the _WinAPI_DeferWindowPos() function.',
      },
    ],
  },
  _WinAPI_EndPaint: {
    documentation: 'Marks the end of painting in the specified window',
    label: '_WinAPI_EndPaint ( $hWnd, ByRef $tPAINTSTRUCT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that has been repainted.',
      },
      {
        label: '$tPAINTSTRUCT',
        documentation:
          '$tagPAINTSTRUCT structure that contains the painting information retrieved by _WinAPI_BeginPaint().',
      },
    ],
  },
  _WinAPI_EndPath: {
    documentation:
      'Closes a path bracket and selects the path defined by the bracket into the specified device context',
    label: '_WinAPI_EndPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context into which the new path is selected.',
      },
    ],
  },
  _WinAPI_EndUpdateResource: {
    documentation: 'Commits or discards a changes of the resources within module',
    label: '_WinAPI_EndUpdateResource ( $hUpdate [, $bDiscard = False] )',
    params: [
      {
        label: '$hUpdate',
        documentation:
          'A module handle returned by the _WinAPI_BeginUpdateResource(), and used by _WinAPI_UpdateResource(), referencing the file to be updated.',
      },
      {
        label: '$bDiscard',
        documentation:
          '**[optional]** Specifies whether to write the resource updates to the file, valid values:    True - The changes are discarded.    False - The changes are made: the resource updates will take effect (Default).',
      },
    ],
  },
  _WinAPI_EnumChildProcess: {
    documentation: 'Enumerates a child processes that belong to the specified process',
    label: '_WinAPI_EnumChildProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_EnumChildWindows: {
    documentation: 'Enumerates a child windows that belong to the specified parent window',
    label: '_WinAPI_EnumChildWindows ( $hWnd [, $bVisible = True] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the parent window whose child windows are to be enumerated.If this parameter is 0, this function is equivalent to _WinAPI_EnumWindows().',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Specifies whether enumerates the invisible window, valid values:    True - Enumerate only visible windows (Default).    False - Enumerate all windows.',
      },
    ],
  },
  _WinAPI_EnumDesktops: {
    documentation:
      'Enumerates all desktops associated with the specified window station of the calling process',
    label: '_WinAPI_EnumDesktops ( $hStation )',
    params: [
      {
        label: '$hStation',
        documentation:
          'Handle to the window station whose desktops are to be enumerated. This handle must have the$WINSTA_ENUMDESKTOPS access right.',
      },
    ],
  },
  _WinAPI_EnumDesktopWindows: {
    documentation: 'Enumerates all top-level windows associated with the specified desktop',
    label: '_WinAPI_EnumDesktopWindows ( $hDesktop [, $bVisible = True] )',
    params: [
      {
        label: '$hDesktop',
        documentation:
          'Handle to the desktop whose top-level windows are to be enumerated. This handle must have the$DESKTOP_READOBJECTS access right.',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Specifies whether enumerates the invisible window, valid values:    True - Enumerate only visible windows (Default).    False - Enumerate all windows.',
      },
    ],
  },
  _WinAPI_EnumDeviceDrivers: {
    documentation: 'Retrieves the load address for each device driver in the system',
    label: '_WinAPI_EnumDeviceDrivers (  )',
    params: [],
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
  _WinAPI_EnumDisplayMonitors: {
    documentation:
      'Enumerates display monitors (including invisible pseudo-monitors associated with the mirroring drivers)',
    label: '_WinAPI_EnumDisplayMonitors ( [$hDC = 0 [, $tRECT = 0]] )',
    params: [
      {
        label: '$hDC',
        documentation:
          "**[optional]** Handle to a display device context that defines the visible region of interest.If it's 0 (Default), the visible region of interest is the virtual screen that encompasses all the displays on the desktop.",
      },
      {
        label: '$tRECT',
        documentation:
          "**[optional]** $tagRECT structure that specifies a clipping rectangle.This parameter can be 0 (Default) if you don't want to clip the specified region.",
      },
    ],
  },
  _WinAPI_EnumDisplaySettings: {
    documentation: 'Retrieves information about one of the graphics modes for a display device',
    label: '_WinAPI_EnumDisplaySettings ( $sDevice, $iMode )',
    params: [
      {
        label: '$sDevice',
        documentation:
          'The display device about whose graphics mode the function will obtain information.An empty string specifies the current display device on the computer on which the calling process is running.',
      },
      {
        label: '$iMode',
        documentation:
          "The type of information to be retrieved. This value can be a graphics mode index or one of the following values:    $ENUM_CURRENT_SETTINGS    $ENUM_REGISTRY_SETTINGSThe graphics mode indexes start at zero.To obtain information for all of a display device's graphics modes, make a series of calls to _WinAPI_EnumDisplaySettings().Set $iMode to zero for the first call, and increment $iMode by one for each subsequent call.Continue calling the function until the return value is zero.When you call _WinAPI_EnumDisplaySettings() with $iMode set to zero, the operating system initializes and caches information about the display device.When you call _WinAPI_EnumDisplaySettings() with $iMode set to a non-zero value, the function returns the information that was cached the last time the function was called with $iMode set to zero.",
      },
    ],
  },
  _WinAPI_EnumDllProc: {
    documentation: 'Enumerates an exported functions of the specified dynamic-link library (DLL)',
    label: "_WinAPI_EnumDllProc ( $sFilePath [, $sMask = '' [, $iFlags = 0]] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to the library.Although this function searches for a file path when it specified as the relative path or the name without a path, will better to specify a fully qualified path to the library for an unequivocal result.',
      },
      {
        label: '$sMask',
        documentation:
          '**[optional]** A wildcard string that indicates the function names to be enumerated.This string can optionally contain the wildcards, "*" and "?". If this parameter is an empty string or omitted (Default), all the exported functions will be enumerated.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. This parameter can be one or more of the following values:    $SYMOPT_CASE_INSENSITIVE    $SYMOPT_UNDNAME',
      },
    ],
  },
  _WinAPI_EnumFiles: {
    documentation:
      'Enumerates the files and subdirectories for the specified directory with a name that matches the template',
    label: "_WinAPI_EnumFiles ( $sDir [, $iFlag = 0 [, $sTemplate = '' [, $bExclude = False]]] )",
    params: [
      {
        label: '$sDir',
        documentation: 'The path to the directory.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies whether to enumerate files, subdirectories, or both.This parameter can be one of the following values:    0 - Enumerate both files and subdirectories (Default).    1 - Enumerate files only.    2 - Enumerate subdirectories only.',
      },
      {
        label: '$sTemplate',
        documentation:
          '**[optional]** A template that using to enumerating files and directories. For example, "*.jpe;*.jpeg;*.jpg".',
      },
      {
        label: '$bExclude',
        documentation:
          '**[optional]** Specifies whether the specified template is used to exclude files, valid values:    True - The files matching the template will not be enumerated.    False - The only those files that match the template will be enumerated (Default).',
      },
    ],
  },
  _WinAPI_EnumFileStreams: {
    documentation:
      'Enumerates all streams with a ::$DATA stream type in the specified file or directory',
    label: '_WinAPI_EnumFileStreams ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to the file or directory. The file must be located on volume with NTFS file system.',
      },
    ],
  },
  _WinAPI_EnumFontFamilies: {
    documentation:
      'Enumerates all uniquely-named fonts in the system that match the specified font characteristics',
    label:
      "_WinAPI_EnumFontFamilies ( [$hDC = 0 [, $sFaceName = '' [, $iCharSet = 1 [, $iFontType = 0x07 [, $sPattern = '' [, $bExclude = False]]]]]] )",
    params: [
      {
        label: '$hDC',
        documentation:
          "**[optional]** A handle to the device context from which to enumerate the fonts.If this parameter is 0, the function uses a DC for the application's current screen.",
      },
      {
        label: '$sFaceName',
        documentation:
          '**[optional]** The typeface name of the font.If this parameter is an empty string (Default), the function enumerates one font is each available typeface name.If this parameter is a valid typeface name, the function enumerates all fonts with the specified name.',
      },
      {
        label: '$iCharSet',
        documentation:
          '**[optional]** The character set. It can be one of the following predefined values.If this parameter is set to $DEFAULT_CHARSET (Default), the function enumerates all uniquely-named fonts in all character sets.If there are two fonts with the same name, only one is enumerated.If this parameter is set to a valid character set value, the function enumerates only fonts in the specified character set.    $ANSI_CHARSET    $BALTIC_CHARSET    $CHINESEBIG5_CHARSET    $DEFAULT_CHARSET (Default)    $EASTEUROPE_CHARSET    $GB2312_CHARSET    $GREEK_CHARSET    $HANGEUL_CHARSET    $MAC_CHARSET    $OEM_CHARSET    $RUSSIAN_CHARSET    $SHIFTJIS_CHARSET    $SYMBOL_CHARSET    $TURKISH_CHARSET    $VIETNAMESE_CHARSETKorean language edition of Windows:    $JOHAB_CHARSETMiddle East language edition of Windows:    $ARABIC_CHARSET    $HEBREW_CHARSETThai language edition of Windows:    $THAI_CHARSET',
      },
      {
        label: '$iFontType',
        documentation:
          '**[optional]** The type of the fonts to enumerating. This parameter can be 0 (vector fonts), (-1) (all fonts), or any combination of the following values.    $DEVICE_FONTTYPE (Default)    $RASTER_FONTTYPE (Default)    $TRUETYPE_FONTTYPE (Default)',
      },
      {
        label: '$sPattern',
        documentation:
          '**[optional]** The pattern string to include (exclude) the fonts in (from) the enumerating.This makes sense only if the typeface name is not specified. This string can contain wildcard characters.The pattern will be ignored if this parameter is omitted or an empty string.',
      },
      {
        label: '$bExclude',
        documentation:
          '**[optional]** Specifies whether to use the pattern to exclude the fonts, valid values:    True - Exclude the matching fonts.    False - Include the matching fonts (Default).',
      },
    ],
  },
  _WinAPI_EnumHardLinks: {
    documentation: 'Enumerates all the hard links to the specified file',
    label: '_WinAPI_EnumHardLinks ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file whose links are to be enumerated.',
      },
    ],
  },
  _WinAPI_EnumMRUList: {
    documentation: 'Enumerates the contents of the most recently used (MRU) list',
    label: '_WinAPI_EnumMRUList ( $hMRU, $iItem )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Handle of the MRU list, obtained when the list was created.',
      },
      {
        label: '$iItem',
        documentation:
          'The item to return. If this value is (-1), the function returns the number of items in the MRU list.',
      },
    ],
  },
  _WinAPI_EnumPageFiles: {
    documentation: 'Retrieves information for each installed pagefile in the system',
    label: '_WinAPI_EnumPageFiles (  )',
    params: [],
  },
  _WinAPI_EnumProcessHandles: {
    documentation: 'Enumerates a handles that belong to the specified process',
    label: '_WinAPI_EnumProcessHandles ( [$iPID = 0 [, $iType = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The value associated with the type of the objects that should be enumerated.This value depends on the operating system. If this parameter is 0 (Default), all handles of the specified process will be enumerated.',
      },
    ],
  },
  _WinAPI_EnumProcessModules: {
    documentation: 'Retrieves a handle and name for each module in the specified process',
    label: '_WinAPI_EnumProcessModules ( [$iPID = 0 [, $iFlag = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The filter criteria. This parameter is valid only for Windows Vista or later, and can be one of the following values:    $LIST_MODULES_32BIT    $LIST_MODULES_64BIT    $LIST_MODULES_ALL    $LIST_MODULES_DEFAULT (Default)',
      },
    ],
  },
  _WinAPI_EnumProcessThreads: {
    documentation: 'Enumerates a threads that belong to the specified process',
    label: '_WinAPI_EnumProcessThreads ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_EnumProcessWindows: {
    documentation: 'Enumerates a windows that belong to the specified process',
    label: '_WinAPI_EnumProcessWindows ( [$iPID = 0 [, $bVisible = True]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Specifies whether enumerates the invisible window, valid values:    True - Enumerate only visible windows (Default).    False - Enumerate all windows.',
      },
    ],
  },
  _WinAPI_EnumRawInputDevices: {
    documentation: 'Enumerates the raw input devices attached to the system',
    label: '_WinAPI_EnumRawInputDevices (  )',
    params: [],
  },
  _WinAPI_EnumResourceLanguages: {
    documentation:
      'Enumerates a language-specific resources, of the specified type and name, associated with a binary module',
    label: '_WinAPI_EnumResourceLanguages ( $hModule, $sType, $sName )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched.Also, this parameter can specify the name of the module to load, it must be a full or relative path.If this parameter is 0 or an empty string, that is equivalent to passing in a handle to the module used to create the current process.',
      },
      {
        label: '$sType',
        documentation:
          'The type of resource for which the language is being enumerated.It can be a string or an integer value representing a predefined resource type.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the resource for which the language is being enumerated.It can be a string or an integer value representing a predefined resource type.',
      },
    ],
  },
  _WinAPI_EnumResourceNames: {
    documentation: 'Enumerates the resources of a specified type within a binary module',
    label: '_WinAPI_EnumResourceNames ( $hModule, $sType )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched.Also, this parameter can specify the name of the module to load, it must be a full or relative path.If this parameter is 0 or an empty string, that is equivalent to passing in a handle to the module used to create the current process.',
      },
      {
        label: '$sType',
        documentation:
          'The type of the resource for which the name is being enumerated.It can be a string or an integer value representing a predefined resource type.',
      },
    ],
  },
  _WinAPI_EnumResourceTypes: {
    documentation: 'Enumerates the resource types within a binary module',
    label: '_WinAPI_EnumResourceTypes ( $hModule )',
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to be searched.Also, this parameter can specify the name of the module to load, it must be a full or relative path.If this parameter is 0 or an empty string, that is equivalent to passing in a handle to the module used to create the current process.',
      },
    ],
  },
  _WinAPI_EnumSystemGeoID: {
    documentation:
      'Enumerates the geographical location identifiers (GEOID) that are available on the operating system',
    label: '_WinAPI_EnumSystemGeoID (  )',
    params: [],
  },
  _WinAPI_EnumSystemLocales: {
    documentation:
      'Enumerates the locales that are either installed on or supported by an operating system',
    label: '_WinAPI_EnumSystemLocales ( $iFlag )',
    params: [
      {
        label: '$iFlag',
        documentation:
          'The flag specifying the locale identifiers to enumerate.This parameter can have one of the following values:    $LCID_INSTALLED    $LCID_SUPPORTED',
      },
    ],
  },
  _WinAPI_EnumUILanguages: {
    documentation:
      'Enumerates the user interface languages that are available on the operating system',
    label: '_WinAPI_EnumUILanguages ( [$iFlag = 0] )',
    params: [
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag identifying the language format. This parameter must be 0 or one of the following values Windows Vista or later:    $MUI_LANGUAGE_ID    $MUI_LANGUAGE_NAME',
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
  _WinAPI_EnumWindowStations: {
    documentation: 'Enumerates all window stations in the current session',
    label: '_WinAPI_EnumWindowStations (  )',
    params: [],
  },
  _WinAPI_EnumWindowsTop: {
    documentation: 'Enumerates all top level windows',
    label: '_WinAPI_EnumWindowsTop (  )',
    params: [],
  },
  _WinAPI_EqualMemory: {
    documentation:
      'Compares two blocks of memory to determine whether the specified number of bytes are identical',
    label: '_WinAPI_EqualMemory ( $pSource1, $pSource2, $iLength )',
    params: [
      {
        label: '$pSource1',
        documentation: 'A pointer to the block of memory to compare.',
      },
      {
        label: '$pSource2',
        documentation:
          'A pointer to the block of memory that is compared to the block of memory to which $pSource1 points.',
      },
      {
        label: '$iLength',
        documentation: 'The number of bytes to be compared.',
      },
    ],
  },
  _WinAPI_EqualRect: {
    documentation: 'Determines whether the two specified rectangles are equal',
    label: '_WinAPI_EqualRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the first rectangle.',
      },
      {
        label: '$tRECT2',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the second rectangle.',
      },
    ],
  },
  _WinAPI_EqualRgn: {
    documentation: 'Checks the two specified regions to determine whether they are identical',
    label: '_WinAPI_EqualRgn ( $hRgn1, $hRgn2 )',
    params: [
      {
        label: '$hRgn1',
        documentation: 'Handle to a region.',
      },
      {
        label: '$hRgn2',
        documentation: 'Handle to a region.',
      },
    ],
  },
  _WinAPI_ExcludeClipRect: {
    documentation:
      'Creates a new clipping region that consists of the existing clipping region minus the specified rectangle',
    label: '_WinAPI_ExcludeClipRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the specified rectangle.',
      },
    ],
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
  _WinAPI_ExtCreatePen: {
    documentation:
      'Creates a logical cosmetic or geometric pen that has the specified style, width, and brush attributes',
    label:
      '_WinAPI_ExtCreatePen ( $iPenStyle, $iWidth, $iBrushStyle, $iRGB [, $iHatch = 0 [, $aUserStyle = 0 [, $iStart = 0 [, $iEnd = -1]]]] )',
    params: [
      {
        label: '$iPenStyle',
        documentation:
          'A combination of type, style, end cap, and join attributes.The values from each category are combined by using the bitwise operation.The pen type can be one of the following values.    $PS_GEOMETRIC    $PS_COSMETICThe pen style can be one of the following values.    $PS_SOLID    $PS_DASH    $PS_DOT    $PS_DASHDOT    $PS_DASHDOTDOT    $PS_NULL    $PS_INSIDEFRAME    $PS_USERSTYLE    $PS_ALTERNATEThe end cap is only specified for geometric pens and can be one of the following values.    $PS_ENDCAP_ROUND    $PS_ENDCAP_SQUARE    $PS_ENDCAP_FLATThe join is only specified for geometric pens and can be one of the following values.    $PS_JOIN_BEVEL    $PS_JOIN_MITER    $PS_JOIN_ROUND',
      },
      {
        label: '$iWidth',
        documentation:
          'The width of the pen.If $PS_GEOMETRIC type is specified, the width is given in logical units, otherwise, the width must be set to 1.',
      },
      {
        label: '$iBrushStyle',
        documentation: 'A brush style. This parameter can be one of the $BS_* constants.',
      },
      {
        label: '$iRGB',
        documentation: 'The color of a pen, in RGB.',
      },
      {
        label: '$iHatch',
        documentation:
          '**[optional]** A hatch style. For more information, see _WinAPI_CreateBrushIndirect().',
      },
      {
        label: '$aUserStyle',
        documentation:
          '**[optional]** The array (dash1, space1, dash2, space2, ... dashN, spaceN) that contains the length of the dashes and spaces in a user-defined style. The first value specifies the length of the first dash, the second value specifies the length of the first space, and so on.This parameter is ignored if $PS_USERSTYLE style is not specified. The style count is limited to 16.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start filling at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop filling at.',
      },
    ],
  },
  _WinAPI_ExtCreateRegion: {
    documentation: 'Creates a region from the specified region and transformation data',
    label: '_WinAPI_ExtCreateRegion ( $tRGNDATA [, $tXFORM = 0] )',
    params: [
      {
        label: '$tRGNDATA',
        documentation: '$tagRGNDATA structure that contains the region data in logical units.',
      },
      {
        label: '$tXFORM',
        documentation:
          '**[optional]** $tagXFORM structure that defines the transformation to be performed on the region.',
      },
    ],
  },
  _WinAPI_ExtFloodFill: {
    documentation: 'Fills an area of the display surface with the current brush',
    label: '_WinAPI_ExtFloodFill ( $hDC, $iX, $iY, $iRGB [, $iType = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation:
          'The x-coordinate, in logical units, of the point where filling is to start.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate, in logical units, of the point where filling is to start.',
      },
      {
        label: '$iRGB',
        documentation:
          'The color of the boundary or of the area to be filled, in RGB.The interpretation of color depends on the value of the $iType parameter.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The type of fill operation to be performed.This parameter must be one of the following values:    $FLOODFILLBORDER (Default)    $FLOODFILLSURFACE',
      },
    ],
  },
  _WinAPI_ExtractIcon: {
    documentation: 'Extracts an icon from the specified executable file, DLL, or icon file',
    label: '_WinAPI_ExtractIcon ( $sIcon, $iIndex [, $bSmall = False] )',
    params: [
      {
        label: '$sIcon',
        documentation:
          'The name of an executable file, DLL, or icon file from which icons will be extracted.',
      },
      {
        label: '$iIndex',
        documentation:
          'The 0-based index of the icon to extract.If this value is a negative number, the function extracts the icon whose resource identifier is equal to the absolute value of $iIndex.',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** Specifies whether to extract a small icon, valid values:    True - Extract a small icon.    False - Extract a large icon (Default).',
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
  _WinAPI_ExtSelectClipRgn: {
    documentation: 'Combines the specified region with the current clipping region',
    label: '_WinAPI_ExtSelectClipRgn ( $hDC, $hRgn [, $iMode = 5] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          'Handle to the region to be selected. This parameter can only be 0 when the $RGN_COPY mode is specified.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The operation to be performed. It must be one of the following values.$RGN_AND$RGN_COPY (Default)$RGN_DIFF$RGN_OR$RGN_XOR',
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
  _WinAPI_FatalExit: {
    documentation: 'Transfers execution control to the debugger',
    label: '_WinAPI_FatalExit ( $iCode )',
    params: [
      {
        label: '$iCode',
        documentation: 'The error code associated with the exit.',
      },
    ],
  },
  _WinAPI_FileEncryptionStatus: {
    documentation: 'Retrieves the encryption status of the specified file',
    label: '_WinAPI_FileEncryptionStatus ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to retrieve encryption status.',
      },
    ],
  },
  _WinAPI_FileExists: {
    documentation: 'Tests whether the specified path is existing file',
    label: '_WinAPI_FileExists ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file to test.',
      },
    ],
  },
  _WinAPI_FileIconInit: {
    documentation: 'Initializes or reinitializes the system image list',
    label: '_WinAPI_FileIconInit ( [$bRestore = True] )',
    params: [
      {
        label: '$bRestore',
        documentation:
          "**[optional]** Specifies whether to restore the system image cache, valid values:    True - Restore the system image cache from disk (Default).    False - Don't restore.",
      },
    ],
  },
  _WinAPI_FileInUse: {
    documentation: 'Tests whether the specified file in use by another application',
    label: '_WinAPI_FileInUse ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of the file to test. If the path specifies a directory, the function fails.',
      },
    ],
  },
  _WinAPI_FillMemory: {
    documentation: 'Fills a block of memory with the given value',
    label: '_WinAPI_FillMemory ( $pMemory, $iLength [, $iValue = 0] )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the starting address of a memory to be filled.',
      },
      {
        label: '$iLength',
        documentation: 'The number of bytes to be filled.',
      },
      {
        label: '$iValue',
        documentation: '**[optional]** The value to fill the memory. Default is 0.',
      },
    ],
  },
  _WinAPI_FillPath: {
    documentation:
      "Closes any open figures in the current path and fills the path's interior by using the current brush",
    label: '_WinAPI_FillPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context that contains a valid path.',
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
  _WinAPI_FillRgn: {
    documentation: 'Fills a region by using the specified brush',
    label: '_WinAPI_FillRgn ( $hDC, $hRgn, $hBrush )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be filled. The region's coordinates are presumed to be in logical units.",
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush to be used to fill the region.',
      },
    ],
  },
  _WinAPI_FindClose: {
    documentation: 'Closes a file search handle',
    label: '_WinAPI_FindClose ( $hSearch )',
    params: [
      {
        label: '$hSearch',
        documentation: 'The file search handle opened by the _WinAPI_FindFirst... functions.',
      },
    ],
  },
  _WinAPI_FindCloseChangeNotification: {
    documentation: 'Stops change notification handle monitoring',
    label: '_WinAPI_FindCloseChangeNotification ( $hChange )',
    params: [
      {
        label: '$hChange',
        documentation:
          'A handle to a change notification handle created by the _WinAPI_FindFirstChangeNotification() function.',
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
  _WinAPI_FindFirstChangeNotification: {
    documentation:
      'Creates a change notification handle and sets up initial change notification filter conditions',
    label: '_WinAPI_FindFirstChangeNotification ( $sDirectory, $iFlags [, $bSubtree = False] )',
    params: [
      {
        label: '$sDirectory',
        documentation: 'The full path of the directory to be watched.',
      },
      {
        label: '$iFlags',
        documentation:
          'The filter conditions that satisfy a change notification wait. This parameter can be one or more of the following values:    $FILE_NOTIFY_CHANGE_FILE_NAME    $FILE_NOTIFY_CHANGE_DIR_NAME    $FILE_NOTIFY_CHANGE_ATTRIBUTES    $FILE_NOTIFY_CHANGE_SIZE    $FILE_NOTIFY_CHANGE_LAST_WRITE    $FILE_NOTIFY_CHANGE_SECURITY',
      },
      {
        label: '$bSubtree',
        documentation:
          '**[optional]** Specifies whether to monitor the subdirectories of the specified directory, valid values:    True - Monitor the directory tree rooted at the specified directory.    False - Monitor only the specified directory (Default).',
      },
    ],
  },
  _WinAPI_FindFirstFile: {
    documentation:
      'Searches a directory for a file or subdirectory with a name that matches a specific name',
    label: '_WinAPI_FindFirstFile ( $sFilePath, $tData )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The directory or path, and the file name, which can include wildcard characters, for example, an asterisk "*" or a question mark "?".If the string ends with a wildcard, period ".", or directory name, the user must have access permissions to the root and all subdirectories on the path.',
      },
      {
        label: '$tData',
        documentation:
          'A $tagWIN32_FIND_DATA structure or a pointer to it that receives information about a found file or directory.',
      },
    ],
  },
  _WinAPI_FindFirstFileName: {
    documentation: 'Creates an enumeration of all the hard links to the specified file',
    label: '_WinAPI_FindFirstFileName ( $sFilePath, ByRef $sLink )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
      {
        label: '$sLink',
        documentation: 'Returns the first link name found for the specified file.',
      },
    ],
  },
  _WinAPI_FindFirstStream: {
    documentation:
      'Enumerates the first stream with a ::$DATA stream type in the specified file or directory',
    label: '_WinAPI_FindFirstStream ( $sFilePath, $tData )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The fully-qualified file name.',
      },
      {
        label: '$tData',
        documentation:
          'A $tagWIN32_FIND_STREAM_DATA structure or a pointer to it that receives information about the stream.',
      },
    ],
  },
  _WinAPI_FindNextChangeNotification: {
    documentation:
      'Requests that the operating system signal a change notification handle the next time it detects an appropriate change',
    label: '_WinAPI_FindNextChangeNotification ( $hChange )',
    params: [
      {
        label: '$hChange',
        documentation:
          'A handle to a change notification handle created by the _WinAPI_FindFirstChangeNotification() function.',
      },
    ],
  },
  _WinAPI_FindNextFile: {
    documentation: 'Continues a file or directory search',
    label: '_WinAPI_FindNextFile ( $hSearch, $tData )',
    params: [
      {
        label: '$hSearch',
        documentation:
          'The search handle returned by a previous call to the _WinAPI_FindFirstFile() function.',
      },
      {
        label: '$tData',
        documentation:
          'A $tagWIN32_FIND_DATA structure or a pointer to it that receives information about a found file or directory.',
      },
    ],
  },
  _WinAPI_FindNextFileName: {
    documentation: 'Continues enumerating the hard links',
    label: '_WinAPI_FindNextFileName ( $hSearch, ByRef $sLink )',
    params: [
      {
        label: '$hSearch',
        documentation:
          'A handle to the enumeration that is returned by a successful call to _WinAPI_FindFirstFileName() function.',
      },
      {
        label: '$sLink',
        documentation: 'Returns the next link name that was found.',
      },
    ],
  },
  _WinAPI_FindNextStream: {
    documentation: 'Continues a stream search',
    label: '_WinAPI_FindNextStream ( $hSearch, $tData )',
    params: [
      {
        label: '$hSearch',
        documentation:
          'The search handle returned by a previous call to the _WinAPI_FindFirstStream() function.',
      },
      {
        label: '$tData',
        documentation:
          'A $tagWIN32_FIND_STREAM_DATA structure or a pointer to it that receives information about the stream.',
      },
    ],
  },
  _WinAPI_FindResource: {
    documentation:
      'Determines the location of a resource with the specified type and name in the specified module',
    label: '_WinAPI_FindResource ( $hInstance, $sType, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource.A value of 0 specifies the module handle associated with the image file that the operating system used to create the current process.',
      },
      {
        label: '$sType',
        documentation: 'The type of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$sName',
        documentation: 'The name of the resource. This parameter can be string or integer value.',
      },
    ],
  },
  _WinAPI_FindResourceEx: {
    documentation:
      'Determines the location of the resource with the specified type, name, and language in the specified module',
    label: '_WinAPI_FindResourceEx ( $hInstance, $sType, $sName, $iLanguage )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource.A value of 0 specifies the module handle associated with the image file that the operating system used to create the current process.',
      },
      {
        label: '$sType',
        documentation: 'The type of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$sName',
        documentation: 'The name of the resource. This parameter can be string or integer value.',
      },
      {
        label: '$iLanguage',
        documentation: 'The language of the resource.',
      },
    ],
  },
  _WinAPI_FindTextDlg: {
    documentation:
      'Creates a system-defined modeless Find dialog box to search for text in a document',
    label:
      "_WinAPI_FindTextDlg ( $hOwner [, $sFindWhat = '' [, $iFlags = 0 [, $pFindProc = 0 [, $lParam = 0]]]] )",
    params: [
      {
        label: '$hOwner',
        documentation:
          'A handle to the window that owns the dialog box. The window procedure of the specified window receives FINDMSGSTRING messages from the dialog box. This parameter can be any valid window handle, but it must not be 0.',
      },
      {
        label: '$sFindWhat',
        documentation:
          '**[optional]** The search string that is displayed when you initialize the dialog box.',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** A set of bit flags that used to initialize the dialog box.The dialog box sets these flags when it sends the FINDMSGSTRING registered message to indicate the user's input.This parameter can be one or more of the following values.    $FR_DIALOGTERM    $FR_DOWN    $FR_ENABLEHOOK    $FR_ENABLETEMPLATE    $FR_ENABLETEMPLATEHANDLE    $FR_FINDNEXT    $FR_HIDEUPDOWN    $FR_HIDEMATCHCASE    $FR_HIDEWHOLEWORD    $FR_MATCHCASE    $FR_NOMATCHCASE    $FR_NOUPDOWN    $FR_NOWHOLEWORD    $FR_REPLACE    $FR_REPLACEALL    $FR_SHOWHELP    $FR_WHOLEWORD",
      },
      {
        label: '$pFindProc',
        documentation:
          '**[optional]** Pointer to an hook procedure that can process messages intended for the dialog box.This parameter is ignored unless the $FR_ENABLEHOOK flag is not set.(See MSDN for more information)',
      },
      {
        label: '$lParam',
        documentation:
          '**[optional]** Application-defined data that the system passes to the hook procedure.',
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
  _WinAPI_FlattenPath: {
    documentation:
      'Transforms any curves in the path that is selected into the current DC, turning each curve into a sequence of lines',
    label: '_WinAPI_FlattenPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context that contains a valid path.',
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
  _WinAPI_FlushFRBuffer: {
    documentation:
      'Destroys the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_FlushFRBuffer (  )',
    params: [],
  },
  _WinAPI_FlushViewOfFile: {
    documentation: 'Writes to the disk a byte range within a mapped view of a file',
    label: '_WinAPI_FlushViewOfFile ( $pAddress [, $iBytes = 0] )',
    params: [
      {
        label: '$pAddress',
        documentation:
          'A pointer to the base address of the byte range to be flushed to the disk representation of the mapped file.',
      },
      {
        label: '$iBytes',
        documentation:
          '**[optional]** The number of bytes to be flushed.If $iBytes is 0 (Default), the file is flushed from the base address to the end of the mapping.',
      },
    ],
  },
  _WinAPI_FormatDriveDlg: {
    documentation: "Opens the Shell's Format dialog",
    label: '_WinAPI_FormatDriveDlg ( $sDrive [, $iOption = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive to format, in the format D:, E:, etc.',
      },
      {
        label: '$iOption',
        documentation:
          '**[optional]** This parameter must be 0 or one of the following values that alter the default format options in the dialog.    $SHFMT_OPT_FULL (Default)    $SHFMT_OPT_QUICKFORMAT    $SHFMT_OPT_SYSONLY',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window of the dialog.',
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
  _WinAPI_FrameRgn: {
    documentation: 'Draws a border around the specified region by using the specified brush',
    label: '_WinAPI_FrameRgn ( $hDC, $hRgn, $hBrush, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be enclosed in a border.The region's coordinates are presumed to be in logical units.",
      },
      {
        label: '$hBrush',
        documentation: 'Handle to the brush to be used to draw the border.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of vertical brush strokes.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of horizontal brush strokes.',
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
  _WinAPI_FreeMemory: {
    documentation: 'Frees a memory block in the internal library heap',
    label: '_WinAPI_FreeMemory ( $pMemory )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the valid memory block to be freed.',
      },
    ],
  },
  _WinAPI_FreeMRUList: {
    documentation:
      'Frees the handle associated with the most recently used (MRU) list and writes cached data to the registry',
    label: '_WinAPI_FreeMRUList ( $hMRU )',
    params: [
      {
        label: '$hMRU',
        documentation: 'Handle of the MRU list to free.',
      },
    ],
  },
  _WinAPI_FreeResource: {
    documentation: 'Decrements (decreases by one) the reference count of a loaded resource',
    label: '_WinAPI_FreeResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation: 'Handle of the resource was created by _WinAPI_LoadResource().',
      },
    ],
  },
  _WinAPI_GdiComment: {
    documentation: 'Copies a comment from a buffer into a specified enhanced-format metafile',
    label: '_WinAPI_GdiComment ( $hDC, $pBuffer, $iSize )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to an enhanced-metafile device context.',
      },
      {
        label: '$pBuffer',
        documentation: 'A pointer to the buffer that contains the comment.',
      },
      {
        label: '$iSize',
        documentation: 'The length of the comment buffer, in bytes.',
      },
    ],
  },
  _WinAPI_GetActiveWindow: {
    documentation:
      "Retrieves the window handle to the active window attached to the calling process's message queue",
    label: '_WinAPI_GetActiveWindow (  )',
    params: [],
  },
  _WinAPI_GetAllUsersProfileDirectory: {
    documentation:
      'Retrieves the path to the root of the directory that contains program data shared by all users',
    label: '_WinAPI_GetAllUsersProfileDirectory (  )',
    params: [],
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
  _WinAPI_GetApplicationRestartSettings: {
    documentation: 'Retrieves the restart information registered for the specified process',
    label: '_WinAPI_GetApplicationRestartSettings ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetArcDirection: {
    documentation: 'Retrieves the current arc direction for the specified device context',
    label: '_WinAPI_GetArcDirection ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetBinaryType: {
    documentation:
      'Determines whether a file is an executable (.exe) file, and if so, which subsystem runs the executable file',
    label: '_WinAPI_GetBinaryType ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The full path of the file whose executable type is to be determined.',
      },
    ],
  },
  _WinAPI_GetBitmapBits: {
    documentation: 'Copies the bitmap bits of a specified device-dependent bitmap into a buffer',
    label: '_WinAPI_GetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the device-dependent bitmap.',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes to copy from the bitmap into the buffer.',
      },
      {
        label: '$pBits',
        documentation: 'A pointer to a buffer to receive the bitmap bits.',
      },
    ],
  },
  _WinAPI_GetBitmapDimension: {
    documentation: 'Retrieves a dimension of the specified bitmap',
    label: '_WinAPI_GetBitmapDimension ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to retrieve dimension.',
      },
    ],
  },
  _WinAPI_GetBitmapDimensionEx: {
    documentation: 'Retrieves the dimensions of a compatible bitmap',
    label: '_WinAPI_GetBitmapDimensionEx ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to a compatible bitmap (DDB).',
      },
    ],
  },
  _WinAPI_GetBkColor: {
    documentation: 'Retrieves the current background color for the specified device context',
    label: '_WinAPI_GetBkColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetBoundsRect: {
    documentation:
      'Obtains the current accumulated bounding rectangle for a specified device context',
    label: '_WinAPI_GetBoundsRect ( $hDC [, $iFlags = 0] )',
    params: [
      {
        label: '$hDC',
        documentation:
          'Handle to the device context whose bounding rectangle the function will return.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies how the function will behave. This parameter can be the following value:    $DCB_RESET',
      },
    ],
  },
  _WinAPI_GetBrushOrg: {
    documentation: 'Retrieves the current brush origin for the specified device context',
    label: '_WinAPI_GetBrushOrg ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetBValue: {
    documentation: 'Retrieves an intensity value for the blue component of a 32-bit RGB value',
    label: '_WinAPI_GetBValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The color value, in RGB.',
      },
    ],
  },
  _WinAPI_GetCaretBlinkTime: {
    documentation: "Returns the time required to invert the caret's pixels",
    label: '_WinAPI_GetCaretBlinkTime (  )',
    params: [],
  },
  _WinAPI_GetCaretPos: {
    documentation: "Retrieves the caret's position",
    label: '_WinAPI_GetCaretPos (  )',
    params: [],
  },
  _WinAPI_GetCDType: {
    documentation: 'Retrieves a type of the media which is loaded into a specified CD-ROM device',
    label: '_WinAPI_GetCDType ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation:
          'The drive letter of the CD tray to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetClassInfoEx: {
    documentation: 'Retrieves information about a window class',
    label: '_WinAPI_GetClassInfoEx ( $sClass [, $hInstance = 0] )',
    params: [
      {
        label: '$sClass',
        documentation:
          'The class name. The name must be that of a preregistered class or a class registered by a previous call to the _WinAPI_RegisterClass() or _WinAPI_RegisterClassEx() function.Alternatively, this parameter can be a class atom.The atom must be in the low-order word of $sClass; the high-order word must be zero.',
      },
      {
        label: '$hInstance',
        documentation:
          '**[optional]** Handle to the instance of the application that created the class.To retrieve information about classes defined by the system (such as buttons or list boxes), set this parameter to 0 (Default).',
      },
    ],
  },
  _WinAPI_GetClassLongEx: {
    documentation: 'Retrieves the specified value associated with the specified window',
    label: '_WinAPI_GetClassLongEx ( $hWnd, $iIndex )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
      {
        label: '$iIndex',
        documentation:
          'The value to retrieve. This parameter can be one of the following values.$GCL_CBCLSEXTRA$GCL_CBWNDEXTRA$GCL_HBRBACKGROUND$GCL_HCURSOR$GCL_HICON$GCL_HICONSM$GCL_HMODULE$GCL_MENUNAME$GCL_STYLE$GCL_WNDPROC',
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
  _WinAPI_GetClipboardSequenceNumber: {
    documentation: 'Retrieves the clipboard sequence number for the current window station',
    label: '_WinAPI_GetClipboardSequenceNumber (  )',
    params: [],
  },
  _WinAPI_GetClipBox: {
    documentation: 'Retrieves the dimensions of the bounding rectangle of the visible area',
    label: '_WinAPI_GetClipBox ( $hDC, ByRef $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that is created by this function, and contains the rectangle dimensions, in logical units.',
      },
    ],
  },
  _WinAPI_GetClipCursor: {
    documentation:
      'Retrieves the screen coordinates of the rectangular area to which the cursor is confined',
    label: '_WinAPI_GetClipCursor (  )',
    params: [],
  },
  _WinAPI_GetClipRgn: {
    documentation: 'Retrieves a handle identifying the current application-defined clipping region',
    label: '_WinAPI_GetClipRgn ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetColorAdjustment: {
    documentation: 'Retrieves the color adjustment for the specified device context (DC)',
    label: '_WinAPI_GetColorAdjustment ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
    ],
  },
  _WinAPI_GetCompressedFileSize: {
    documentation:
      'Retrieves the actual number of bytes of disk storage used to store a specified file',
    label: '_WinAPI_GetCompressedFileSize ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetCompression: {
    documentation: 'Retrieves the current compression state of a file or directory',
    label: '_WinAPI_GetCompression ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file or directory to retrieve compression state.',
      },
    ],
  },
  _WinAPI_GetConnectedDlg: {
    documentation:
      'Launches the Get Connected wizard within the calling application to enable network connectivity',
    label: '_WinAPI_GetConnectedDlg ( $iDlg [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$iDlg',
        documentation:
          'Specifies which the dialog should be launched, valid values:0 - Local area network connectivity.1 - Internet connectivity.2 - Virtual private network (VPN) connectivity.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** Specifies an additional options. This parameter can be one or more of the following values.0 - Default.1 - Do not display the Get Connected wizard page that shows whether or not the user has a working or active Internet connection.2 - Do not display the Get Connected wizard page that shows a list of existing internet connections.4 - Hide the finish page of the Get Connected wizard.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to the parent window that called this API.',
      },
    ],
  },
  _WinAPI_GetCurrentDirectory: {
    documentation: 'Retrieves the current directory for the current process',
    label: '_WinAPI_GetCurrentDirectory (  )',
    params: [],
  },
  _WinAPI_GetCurrentHwProfile: {
    documentation:
      'Retrieves information about the current hardware profile for the local computer',
    label: '_WinAPI_GetCurrentHwProfile (  )',
    params: [],
  },
  _WinAPI_GetCurrentObject: {
    documentation:
      'Retrieves a handle to an object of the specified type that has been selected into the specified device context',
    label: '_WinAPI_GetCurrentObject ( $hDC, $iType )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iType',
        documentation:
          'The object type to be queried. This parameter can be one of the following values.$OBJ_BITMAP$OBJ_BRUSH$OBJ_COLORSPACE$OBJ_FONT$OBJ_PAL$OBJ_PEN',
      },
    ],
  },
  _WinAPI_GetCurrentPosition: {
    documentation: 'Retrieves the current position for the specified device context',
    label: '_WinAPI_GetCurrentPosition ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetCurrentProcess: {
    documentation: 'Returns the process handle of the calling process',
    label: '_WinAPI_GetCurrentProcess (  )',
    params: [],
  },
  _WinAPI_GetCurrentProcessExplicitAppUserModelID: {
    documentation:
      'Retrieves the application-defined, explicit Application User Model ID for the current process',
    label: '_WinAPI_GetCurrentProcessExplicitAppUserModelID (  )',
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
  _WinAPI_GetCursor: {
    documentation: 'Retrieves a handle to the current cursor',
    label: '_WinAPI_GetCursor (  )',
    params: [],
  },
  _WinAPI_GetCursorInfo: {
    documentation: 'Retrieves information about the global cursor',
    label: '_WinAPI_GetCursorInfo (  )',
    params: [],
  },
  _WinAPI_GetDateFormat: {
    documentation:
      'Formats a date as a date string for a locale specified by the locale identifier',
    label:
      "_WinAPI_GetDateFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = '']]]] )",
    params: [
      {
        label: '$iLCID',
        documentation:
          '**[optional]** The locale identifier (LCID) that specifies the locale or one of the following predefined values.    $LOCALE_INVARIANT    $LOCALE_SYSTEM_DEFAULT    $LOCALE_USER_DEFAULT (Default)Windows Vista or later    $LOCALE_CUSTOM_DEFAULT    $LOCALE_CUSTOM_UI_DEFAULT    $LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$tSYSTEMTIME',
        documentation:
          '**[optional]** $tagSYSTEMTIME structure that contains the date information to format.If this parameter is 0 (Default), the function will use the current local system date.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies the date format options.This parameter can be one or more of the following values:    $DATE_LONGDATE    $DATE_SHORTDATE (Default)    $DATE_USE_ALT_CALENDARWindows Vista or later    $DATE_LTRREADING    $DATE_RTLREADING    $DATE_YEARMONTHWindows 7 or later    $DATE_AUTOLAYOUT',
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the date. For example, "dddd MMMM, yyyy".If this parameter is omitted or an empty string (Default), the function returns the string according to the date format for the specified locale.',
      },
    ],
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
  _WinAPI_GetDCEx: {
    documentation:
      'Retrieves a handle to a device context (DC) for the client area of a specified window',
    label: '_WinAPI_GetDCEx ( $hWnd, $hRgn, $iFlags )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window whose DC is to be retrieved.If this value is 0, _WinAPI_GetDCEx() retrieves the DC for the entire screen.If the value of $iFlags parameter is $DCX_INTERSECTRGN or DCX_EXCLUDERGN, then the operating system assumes ownership of the region and will automatically delete it when it is no longer needed.In this case, the application should not use or delete the region after a successful call to _WinAPI_GetDCEx().',
      },
      {
        label: '$hRgn',
        documentation: 'A clipping region that may be combined with the visible region of the DC.',
      },
      {
        label: '$iFlags',
        documentation:
          'Flags that specifies how the DC is created.This parameter can be one or more of the following values:    $DCX_WINDOW    $DCX_CACHE    $DCX_PARENTCLIP    $DCX_CLIPSIBLINGS    $DCX_CLIPCHILDREN    $DCX_NORESETATTRS    $DCX_LOCKWINDOWUPDATE    $DCX_EXCLUDERGN    $DCX_INTERSECTRGN    $DCX_INTERSECTUPDATE    $DCX_VALIDATE',
      },
    ],
  },
  _WinAPI_GetDefaultPrinter: {
    documentation:
      'Retrieves the printer name of the default printer for the current user on the local computer',
    label: '_WinAPI_GetDefaultPrinter (  )',
    params: [],
  },
  _WinAPI_GetDefaultUserProfileDirectory: {
    documentation: "Retrieves the path to the root of the default user's profile",
    label: '_WinAPI_GetDefaultUserProfileDirectory (  )',
    params: [],
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
  _WinAPI_GetDeviceDriverBaseName: {
    documentation: 'Retrieves the base name of the specified device driver',
    label: '_WinAPI_GetDeviceDriverBaseName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation:
          'The load address of the device driver. This value can be retrieved using the _WinAPI_EnumDeviceDrivers() function.',
      },
    ],
  },
  _WinAPI_GetDeviceDriverFileName: {
    documentation: 'Retrieves the path available for the specified device driver',
    label: '_WinAPI_GetDeviceDriverFileName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation:
          'The load address of the device driver. This value can be retrieved using the _WinAPI_EnumDeviceDrivers() function.',
      },
    ],
  },
  _WinAPI_GetDeviceGammaRamp: {
    documentation:
      'Gets the gamma ramp on direct color display boards that support downloadable gamma ramps in hardware',
    label: '_WinAPI_GetDeviceGammaRamp ( $hDC, ByRef $aRamp )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context of the direct color display board in question.',
      },
      {
        label: '$aRamp',
        documentation:
          'Returns the 2D array ([r1, g1, b1], [r2, g2, b2], ... [r256, g256, b256]) that is created by this function, and where the function place the current gamma ramp of the color display board.Each element in this array is an integer value with a range from 0 to 65535 which is a mapping between RGB values in the frame buffer and digital-analog-converter (DAC) values.(See MSDN for more information)',
      },
    ],
  },
  _WinAPI_GetDIBColorTable: {
    documentation: 'Retrieves RGB color table from the DIB section bitmap',
    label: '_WinAPI_GetDIBColorTable ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'A DIB section bitmap from which to retrieve the color table.',
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
  _WinAPI_GetDiskFreeSpaceEx: {
    documentation:
      'Retrieves information about the amount of space that is available on a disk volume',
    label: '_WinAPI_GetDiskFreeSpaceEx ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive to retrieve information, in the format D:, E:, etc.',
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
  _WinAPI_GetDllDirectory: {
    documentation:
      'Retrieves the application-specific portion of the search path used to locate DLLs for the application',
    label: '_WinAPI_GetDllDirectory (  )',
    params: [],
  },
  _WinAPI_GetDriveBusType: {
    documentation: 'Retrieves a bus type for the specified drive',
    label: '_WinAPI_GetDriveBusType ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetDriveGeometryEx: {
    documentation: "Retrieves extended information about the disk's geometry",
    label: '_WinAPI_GetDriveGeometryEx ( $iDrive )',
    params: [
      {
        label: '$iDrive',
        documentation: 'The physical drive number (0, 1, 2, etc) to retrieve information.',
      },
    ],
  },
  _WinAPI_GetDriveNumber: {
    documentation:
      'Retrieves a device type, device number, and partition number for the specified drive',
    label: '_WinAPI_GetDriveNumber ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetDriveType: {
    documentation:
      'Determines whether a disk drive is a removable, fixed, CD-ROM, RAM disk, or network drive',
    label: "_WinAPI_GetDriveType ( [$sDrive = ''] )",
    params: [
      {
        label: '$sDrive',
        documentation:
          '**[optional]** The drive letter to retrieve information, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_GetDurationFormat: {
    documentation:
      'Formats a duration of time as a time string for a locale specified by identifier',
    label: "_WinAPI_GetDurationFormat ( $iLCID, $iDuration [, $sFormat = ''] )",
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values:    $LOCALE_INVARIANT    $LOCALE_SYSTEM_DEFAULT    $LOCALE_USER_DEFAULTWindows Vista or later    $LOCALE_CUSTOM_DEFAULT    $LOCALE_CUSTOM_UI_DEFAULT    $LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$iDuration',
        documentation:
          'The number of 100-nanosecond intervals in the duration.Alternatively, this parameter can be a $tagSYSTEMTIME structure that contains the time duration information to format.',
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the duration. For example, "hh:mm:ss.ff".If this parameter is omitted or an empty string (Default), the function returns the string according to the duration format for the specified locale.',
      },
    ],
  },
  _WinAPI_GetEffectiveClientRect: {
    documentation:
      'Calculates the dimensions of a rectangle in the client area that contains all the specified controls',
    label: '_WinAPI_GetEffectiveClientRect ( $hWnd, $aCtrl [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window that has the client area to check.',
      },
      {
        label: '$aCtrl',
        documentation:
          'The array containing the handles or identifiers of the controls that should be included in the calculation of the client area. Also, it can be a single handle or control identifier.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array element that contains the first control.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array element that contains the last control.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFile: {
    documentation:
      'Creates a handle that identifies the enhanced-format metafile stored in the specified file',
    label: '_WinAPI_GetEnhMetaFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of an enhanced metafile (.emf).',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileBits: {
    documentation: 'Retrieves the contents of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileBits ( $hEmf, ByRef $pBuffer )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
      {
        label: '$pBuffer',
        documentation:
          'Returns a pointer to a memory block (buffer) that receives the metafile data.Optionaly, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself.Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDescription: {
    documentation: 'Retrieves an optional text description from an enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDescription ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileDimension: {
    documentation: 'Retrieves a dimension of the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileDimension ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile to retrieve dimension.',
      },
    ],
  },
  _WinAPI_GetEnhMetaFileHeader: {
    documentation:
      'Retrieves the record containing the header for the specified enhanced-format metafile',
    label: '_WinAPI_GetEnhMetaFileHeader ( $hEmf )',
    params: [
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile for which the header is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetErrorMessage: {
    documentation: 'Retrieves a text error message for the specified system error code',
    label: '_WinAPI_GetErrorMessage ( $iCode [, $iLanguage = 0] )',
    params: [
      {
        label: '$iCode',
        documentation: 'The system error code to retrieve a message.',
      },
      {
        label: '$iLanguage',
        documentation: '**[optional]** The language identifier.',
      },
    ],
  },
  _WinAPI_GetErrorMode: {
    documentation: 'Retrieves the error mode for the current process',
    label: '_WinAPI_GetErrorMode (  )',
    params: [],
  },
  _WinAPI_GetExitCodeProcess: {
    documentation: 'Retrieves the termination status of the specified process',
    label: '_WinAPI_GetExitCodeProcess ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Handle to the process.',
      },
    ],
  },
  _WinAPI_GetExtended: {
    documentation: 'Retrieves the last extended function return value',
    label: '_WinAPI_GetExtended (  )',
    params: [],
  },
  _WinAPI_GetFileAttributes: {
    documentation: 'Retrieves file system attributes for a specified file or directory',
    label: '_WinAPI_GetFileAttributes ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory.',
      },
    ],
  },
  _WinAPI_GetFileID: {
    documentation: "Retrieves the file system's 8-byte file reference number for a file",
    label: '_WinAPI_GetFileID ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation:
          'A handle to the file or directory whose reference number is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetFileInformationByHandle: {
    documentation: 'Retrieves file information for the specified file',
    label: '_WinAPI_GetFileInformationByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file that contains the information to be retrieved.',
      },
    ],
  },
  _WinAPI_GetFileInformationByHandleEx: {
    documentation: 'Retrieves file information for the specified file',
    label: '_WinAPI_GetFileInformationByHandleEx ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file that contains the information to be retrieved.',
      },
    ],
  },
  _WinAPI_GetFilePointerEx: {
    documentation: 'Retrieves the file pointer of the specified file',
    label: '_WinAPI_GetFilePointerEx ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
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
  _WinAPI_GetFileSizeOnDisk: {
    documentation: 'Retrieves the file allocation size on disk',
    label: '_WinAPI_GetFileSizeOnDisk ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to retrieve allocation size.',
      },
    ],
  },
  _WinAPI_GetFileTitle: {
    documentation: 'Retrieves the name of the specified file',
    label: '_WinAPI_GetFileTitle ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name and location of a file.',
      },
    ],
  },
  _WinAPI_GetFileType: {
    documentation: 'Retrieves the file type of the specified file',
    label: '_WinAPI_GetFileType ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
    ],
  },
  _WinAPI_GetFileVersionInfo: {
    documentation: 'Retrieves version information for the specified file',
    label: '_WinAPI_GetFileVersionInfo ( $sFilePath, ByRef $pBuffer [, $iFlags = 0] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
      {
        label: '$pBuffer',
        documentation:
          'Returns a pointer to a memory block (buffer) that receives the file-version information.Optionaly, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself.Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that controls which MUI DLLs (if any) from which the version resource is extracted.It can be 0 or more of the following values (valid only for Windows Vista or later).    $FILE_VER_GET_LOCALISED    $FILE_VER_GET_NEUTRAL    $FILE_VER_GET_PREFETCHED',
      },
    ],
  },
  _WinAPI_GetFinalPathNameByHandle: {
    documentation: 'Retrieves the final path of the specified file',
    label: '_WinAPI_GetFinalPathNameByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to a file or directory whose path is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetFinalPathNameByHandleEx: {
    documentation: 'Retrieves the final path of the specified file',
    label: '_WinAPI_GetFinalPathNameByHandleEx ( $hFile [, $iFlags = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to a file or directory.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The type of result to return.This parameter can be combination of one $FILE_NAME_* and one $VOLUME_NAME_* values.$FILE_NAME_NORMALIZED$FILE_NAME_OPENED$VOLUME_NAME_DOS$VOLUME_NAME_GUID$VOLUME_NAME_NONE$VOLUME_NAME_NT',
      },
    ],
  },
  _WinAPI_GetFocus: {
    documentation: 'Retrieves the handle of the window that has the keyboard focus',
    label: '_WinAPI_GetFocus (  )',
    params: [],
  },
  _WinAPI_GetFontMemoryResourceInfo: {
    documentation: 'Reads out font information from a TTF loaded into the memory',
    label: '_WinAPI_GetFontMemoryResourceInfo ( $pMemory [, $iFlag = 1] )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer value the struct that contains the binary data of the TTF',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** An integer value. Default is 1 (Font Family name). See remarks for others values',
      },
    ],
  },
  _WinAPI_GetFontName: {
    documentation:
      'Retrieves the unique name of the font based on its typeface name, character set, and style',
    label: '_WinAPI_GetFontName ( $sFaceName [, $iStyle = 0 [, $iCharSet = 1]] )',
    params: [
      {
        label: '$sFaceName',
        documentation:
          'The typeface name of the font (not including style). For example, "Arial", "Tahoma", etc.',
      },
      {
        label: '$iStyle',
        documentation:
          '**[optional]** The style of the font.It can be one or more of the following values:    $FS_REGULAR    $FS_BOLD    $FS_ITALIC',
      },
      {
        label: '$iCharSet',
        documentation:
          '**[optional]** The character set.It can be one of the following values:    $ANSI_CHARSET    $BALTIC_CHARSET    $CHINESEBIG5_CHARSET    $DEFAULT_CHARSET (Default)    $EASTEUROPE_CHARSET    $GB2312_CHARSET    $GREEK_CHARSET    $HANGEUL_CHARSET    $MAC_CHARSET    $OEM_CHARSET    $RUSSIAN_CHARSET    $SHIFTJIS_CHARSET    $SYMBOL_CHARSET    $TURKISH_CHARSET    $VIETNAMESE_CHARSETKorean language edition of Windows:    $JOHAB_CHARSETMiddle East language edition of Windows:    $ARABIC_CHARSET    $HEBREW_CHARSETThai language edition of Windows:    $THAI_CHARSET',
      },
    ],
  },
  _WinAPI_GetFontResourceInfo: {
    documentation: 'Retrieves the fontname from the specified font resource file',
    label: '_WinAPI_GetFontResourceInfo ( $sFont [, $bForce = False [, $iFlag = Default]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that names a font resource file.To retrieve a fontname whose information comes from several resource files, they must be separated by a "|" .For example, abcxxxxx.pfm | abcxxxxx.pfb.',
      },
      {
        label: '$bForce',
        documentation:
          "**[optional]** Specifies whether adds a file to the font table, valid values:    True - Forced add the specified file to the system font table and remove it after retrieving the fontname.    False - Don't add and remove (Default).",
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** An integer value. See _WinAPI_GetFontMemoryResourceInfo() for value definition.',
      },
    ],
  },
  _WinAPI_GetForegroundWindow: {
    documentation: 'Returns the handle of the foreground window',
    label: '_WinAPI_GetForegroundWindow (  )',
    params: [],
  },
  _WinAPI_GetFRBuffer: {
    documentation:
      'Retrieves the current size of the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_GetFRBuffer (  )',
    params: [],
  },
  _WinAPI_GetFullPathName: {
    documentation: 'Retrieves the full path and file name of the specified file',
    label: '_WinAPI_GetFullPathName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file.',
      },
    ],
  },
  _WinAPI_GetGeoInfo: {
    documentation: 'Retrieves information about a specified geographical location',
    label: '_WinAPI_GetGeoInfo ( $iGEOID, $iType [, $iLanguage = 0] )',
    params: [
      {
        label: '$iGEOID',
        documentation:
          'The identifier for the geographical location (GEOID) for which to get information.',
      },
      {
        label: '$iType',
        documentation:
          'The type of information to retrieve. It can be one of the following values.$GEO_NATION$GEO_LATITUDE$GEO_LONGITUDE$GEO_ISO2$GEO_ISO3$GEO_LCID$GEO_FRIENDLYNAME$GEO_OFFICIALNAME$GEO_TIMEZONES$GEO_OFFICIALLANGUAGESWindows Vista or later$GEO_RFC1766Windows 8 or later$GEO_ISO_UN_NUMBER$GEO_PARENT',
      },
      {
        label: '$iLanguage',
        documentation:
          '**[optional]** The language identifier, used with the geographical location.',
      },
    ],
  },
  _WinAPI_GetGlyphOutline: {
    documentation: 'Retrieves the outline or bitmap for a character in the TrueType font',
    label: '_WinAPI_GetGlyphOutline ( $hDC, $sChar, $iFormat, ByRef $pBuffer [, $tMAT2 = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context which font is selected.',
      },
      {
        label: '$sChar',
        documentation: 'The character for which data is to be returned.',
      },
      {
        label: '$iFormat',
        documentation:
          'The format of the data that the function retrieves.This parameter can be one of the following values:    $GGO_BEZIER    $GGO_BITMAP    $GGO_GLYPH_INDEX    $GGO_GRAY2_BITMAP    $GGO_GRAY4_BITMAP    $GGO_GRAY8_BITMAP    $GGO_METRICS    $GGO_NATIVE    $GGO_UNHINTED',
      },
      {
        label: '$pBuffer',
        documentation:
          'Returns a pointer to a memory block (buffer) that receives the outline or bitmap data.Optionaly, you can set this parameter to 0 before function call, then the function will allocate the required memory block itself.Otherwise, it must be a valid memory pointer returned by the _WinAPI_CreateBuffer() function, or by previously calling this function.If the $GGO_METRICS is specified, this parameter is ignored, and function only returns the information about a glyph (see below).',
      },
      {
        label: '$tMAT2',
        documentation:
          '**[optional]** $tagMAT2 structure specifying a transformation matrix for the character.If this parameter is 0 (Default), the transformation will not be used (it is identity matrix).',
      },
    ],
  },
  _WinAPI_GetGraphicsMode: {
    documentation: 'Retrieves the current graphics mode for the specified device context',
    label: '_WinAPI_GetGraphicsMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
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
  _WinAPI_GetGUIThreadInfo: {
    documentation: 'Retrieves information about the active window or a specified GUI thread',
    label: '_WinAPI_GetGUIThreadInfo ( $iThreadId )',
    params: [
      {
        label: '$iThreadId',
        documentation: 'The identifier for the thread for which information is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetGValue: {
    documentation: 'Retrieves an intensity value for the green component of a 32-bit RGB value',
    label: '_WinAPI_GetGValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The color value, in RGB.',
      },
    ],
  },
  _WinAPI_GetHandleInformation: {
    documentation: 'Retrieves certain properties of an object handle',
    label: '_WinAPI_GetHandleInformation ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to an object whose information is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetHGlobalFromStream: {
    documentation: 'Retrieves the global memory handle to a stream',
    label: '_WinAPI_GetHGlobalFromStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation:
          'Pointer to the stream object previously created by a call to the _WinAPI_CreateStreamOnHGlobal() function.',
      },
    ],
  },
  _WinAPI_GetIconDimension: {
    documentation: 'Retrieves a dimension of the specified icon',
    label: '_WinAPI_GetIconDimension ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon to retrieve dimension.',
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
  _WinAPI_GetIconInfoEx: {
    documentation: 'Retrieves information about the specified icon or cursor',
    label: '_WinAPI_GetIconInfoEx ( $hIcon )',
    params: [
      {
        label: '$hIcon',
        documentation:
          'Handle to the icon or cursor. To retrieve information about a standard icon or cursor, use $IDC_* constants.',
      },
    ],
  },
  _WinAPI_GetIdleTime: {
    documentation: 'Retrieves the time that has elapsed since the last input',
    label: '_WinAPI_GetIdleTime (  )',
    params: [],
  },
  _WinAPI_GetKeyboardLayout: {
    documentation: 'Retrieves the active input locale identifier for the specified window',
    label: '_WinAPI_GetKeyboardLayout ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to retrieve the input locale identifier.',
      },
    ],
  },
  _WinAPI_GetKeyboardLayoutList: {
    documentation:
      'Retrieves the all input locale identifiers corresponding to the current set of input locales in the system',
    label: '_WinAPI_GetKeyboardLayoutList (  )',
    params: [],
  },
  _WinAPI_GetKeyboardState: {
    documentation: 'Copies the status of the 256 virtual keys to the specified buffer',
    label: '_WinAPI_GetKeyboardState (  )',
    params: [],
  },
  _WinAPI_GetKeyboardType: {
    documentation: 'Retrieves information about the current keyboard',
    label: '_WinAPI_GetKeyboardType ( $iType )',
    params: [
      {
        label: '$iType',
        documentation:
          'The type of keyboard information to be retrieved, valid values:0 - Keyboard type.1 - Keyboard subtype (original equipment manufacturer (OEM)-dependent value).2 - The number of function keys on the keyboard.',
      },
    ],
  },
  _WinAPI_GetKeyNameText: {
    documentation: 'Retrieves a string that represents the name of a key',
    label: '_WinAPI_GetKeyNameText ( $lParam )',
    params: [
      {
        label: '$lParam',
        documentation:
          'Specifies the second parameter of the keyboard message (such as WM_KEYDOWN) to be processed.',
      },
    ],
  },
  _WinAPI_GetKeyState: {
    documentation: 'Retrieves the status of the specified virtual key',
    label: '_WinAPI_GetKeyState ( $vKey )',
    params: [
      {
        label: '$vKey',
        documentation:
          'Specifies a virtual key ($VK_*). If the desired virtual key is a letter or digit (A through Z,a through z, or 0 through 9).',
      },
    ],
  },
  _WinAPI_GetLastActivePopup: {
    documentation:
      'Determines which pop-up window owned by the specified window was most recently active',
    label: '_WinAPI_GetLastActivePopup ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the owner window.',
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
  _WinAPI_GetLocaleInfo: {
    documentation: 'Retrieves information about a locale specified by identifier',
    label: '_WinAPI_GetLocaleInfo ( $iLCID, $iType )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$iType',
        documentation: 'The one of the locale information constants ($LOCALE_*) to retrieve.',
      },
    ],
  },
  _WinAPI_GetLogicalDrives: {
    documentation: 'Retrieves a bitmask representing the currently available disk drives',
    label: '_WinAPI_GetLogicalDrives (  )',
    params: [],
  },
  _WinAPI_GetMapMode: {
    documentation: 'Retrieves the current mapping mode',
    label: '_WinAPI_GetMapMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetMemorySize: {
    documentation: 'Retrieves the size of a memory block allocated from the internal library heap',
    label: '_WinAPI_GetMemorySize ( $pMemory )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the valid memory block whose size to be retrieved.',
      },
    ],
  },
  _WinAPI_GetMessageExtraInfo: {
    documentation: 'Retrieves the extra message information for the current thread',
    label: '_WinAPI_GetMessageExtraInfo (  )',
    params: [],
  },
  _WinAPI_GetModuleFileNameEx: {
    documentation:
      'Retrieves the fully-qualified path for the file containing the specified module',
    label: '_WinAPI_GetModuleFileNameEx ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process that contains the module. The handle must have the $PROCESS_QUERY_INFORMATION or$PROCESS_QUERY_LIMITED_INFORMATION access right and the $PROCESS_VM_READ access right.',
      },
      {
        label: '$hModule',
        documentation:
          '**[optional]** Handle to the module. If this parameter is 0 (Default), the function retrieves the path of the executablefile of the process.',
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
  _WinAPI_GetModuleHandleEx: {
    documentation: 'Retrieves a module handle for the specified module',
    label: '_WinAPI_GetModuleHandleEx ( $sModule [, $iFlags = 0] )',
    params: [
      {
        label: '$sModule',
        documentation:
          'The name of the loaded module (either a .dll or .exe file), or a pointer to an address in the module(if the $GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS flag is specified). If this parameter is 0 or an emptystring, the function returns a handle to the file used to create the calling process (.exe file).',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.$GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS$GET_MODULE_HANDLE_EX_FLAG_PIN$GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT$GET_MODULE_HANDLE_EX_FLAG_DEFAULT (Default)',
      },
    ],
  },
  _WinAPI_GetModuleInformation: {
    documentation: 'Retrieves information about the specified module',
    label: '_WinAPI_GetModuleInformation ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process that contains the module. The handle must have the $PROCESS_QUERY_INFORMATION or$PROCESS_QUERY_LIMITED_INFORMATION access right and the $PROCESS_VM_READ access right.',
      },
      {
        label: '$hModule',
        documentation:
          '**[optional]** Handle to the module. If this parameter is 0, the function retrieves information only about theexecutable file ("SizeOfImage" and "EntryPoint" members of the $tagMODULEINFO structure).',
      },
    ],
  },
  _WinAPI_GetMonitorInfo: {
    documentation: 'Retrieves information about a display monitor',
    label: '_WinAPI_GetMonitorInfo ( $hMonitor )',
    params: [
      {
        label: '$hMonitor',
        documentation: 'A handle to the display monitor of interest.',
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
  _WinAPI_GetMUILanguage: {
    documentation:
      'Gets the language currently in use by the common controls for a particular process',
    label: '_WinAPI_GetMUILanguage (  )',
    params: [],
  },
  _WinAPI_GetNumberFormat: {
    documentation:
      'Formats a number string as a number string customized for a locale specified by identifier',
    label: '_WinAPI_GetNumberFormat ( $iLCID, $sNumber [, $tNUMBERFMT = 0] )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$sNumber',
        documentation:
          'The string containing the number string to format. This string can only contain the followingcharacters. All other characters are invalid.Characters "0" through "9".A minus sign in the first character position if the number is a negative value.One decimal point (dot) if the number is a floating-point value.',
      },
      {
        label: '$tNUMBERFMT',
        documentation:
          '**[optional]** $tagNUMBERFMT structure that contains number formatting information. If this parameter is 0 (Default),the function returns the string according to the number format for the specified locale.You can use the _WinAPI_CreateNumberFormatInfo() function to create this structure.',
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
  _WinAPI_GetObjectID: {
    documentation: 'Retrieves the object identifier for the specified file or directory',
    label: '_WinAPI_GetObjectID ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'Path to the file or directory from which the object identifier is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetObjectInfoByHandle: {
    documentation: 'Retrieves information about a specified object',
    label: '_WinAPI_GetObjectInfoByHandle ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'A handle to the object to obtain information about.',
      },
    ],
  },
  _WinAPI_GetObjectNameByHandle: {
    documentation: 'Retrieves a name of the specified object',
    label: '_WinAPI_GetObjectNameByHandle ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'A handle to the object to obtain its name.',
      },
    ],
  },
  _WinAPI_GetObjectType: {
    documentation: 'Retrieves the type of the specified object',
    label: '_WinAPI_GetObjectType ( $hObject )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the graphics object.',
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
  _WinAPI_GetOutlineTextMetrics: {
    documentation: 'Retrieves text metrics for TrueType fonts',
    label: '_WinAPI_GetOutlineTextMetrics ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetParentProcess: {
    documentation: 'Retrieves the PID of the parent process for the specified process',
    label: '_WinAPI_GetParentProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetPerformanceInfo: {
    documentation: 'Retrieves the performance information',
    label: '_WinAPI_GetPerformanceInfo (  )',
    params: [],
  },
  _WinAPI_GetPEType: {
    documentation: 'Retrieves a type of the machine for the specified portable executable (PE)',
    label: '_WinAPI_GetPEType ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The full path of the PE whose machine type is to be retrieved.',
      },
    ],
  },
  _WinAPI_GetPhysicallyInstalledSystemMemory: {
    documentation: 'Retrieves the amount of RAM that is physically installed on the computer',
    label: '_WinAPI_GetPhysicallyInstalledSystemMemory (  )',
    params: [],
  },
  _WinAPI_GetPixel: {
    documentation: 'Retrieves the color value of the pixel at the specified coordinates',
    label: '_WinAPI_GetPixel ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the pixel to be examined.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the pixel to be examined.',
      },
    ],
  },
  _WinAPI_GetPolyFillMode: {
    documentation: 'Retrieves the current polygon fill mode',
    label: '_WinAPI_GetPolyFillMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetPosFromRect: {
    documentation: 'Interprets the coordinates of the rectangle as offset and position coordinates',
    label: '_WinAPI_GetPosFromRect ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the logical coordinates of the rectangle.',
      },
    ],
  },
  _WinAPI_GetPriorityClass: {
    documentation: 'Retrieves the priority class for the specified process',
    label: '_WinAPI_GetPriorityClass ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
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
  _WinAPI_GetProcessCommandLine: {
    documentation: 'Retrieves the command-line string for the specified process',
    label: '_WinAPI_GetProcessCommandLine ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessFileName: {
    documentation:
      'Retrieves the fully-qualified path of the executable file for the specified process',
    label: '_WinAPI_GetProcessFileName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessHandleCount: {
    documentation: 'Retrieves the number of open handles that belong to the specified process',
    label: '_WinAPI_GetProcessHandleCount ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessID: {
    documentation: 'Retrieves the process identifier of the specified process',
    label: '_WinAPI_GetProcessID ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process. The handle must have the $PROCESS_QUERY_INFORMATION or$PROCESS_QUERY_LIMITED_INFORMATION access right.',
      },
    ],
  },
  _WinAPI_GetProcessIoCounters: {
    documentation:
      'Retrieves accounting information for all I/O operations performed by the specified process',
    label: '_WinAPI_GetProcessIoCounters ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessMemoryInfo: {
    documentation: 'Retrieves information about the memory usage of the specified process',
    label: '_WinAPI_GetProcessMemoryInfo ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessName: {
    documentation: 'Retrieves the name for the specified process',
    label: '_WinAPI_GetProcessName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessShutdownParameters: {
    documentation: 'Retrieves the shutdown parameters for the currently calling process',
    label: '_WinAPI_GetProcessShutdownParameters (  )',
    params: [],
  },
  _WinAPI_GetProcessTimes: {
    documentation: 'Retrieves timing information for the specified process',
    label: '_WinAPI_GetProcessTimes ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessUser: {
    documentation: 'Retrieves the user and domain name for the specified process',
    label: '_WinAPI_GetProcessUser ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation:
          '**[optional]** **[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessWindowStation: {
    documentation: 'Retrieves a handle to the current window station for the calling process',
    label: '_WinAPI_GetProcessWindowStation (  )',
    params: [],
  },
  _WinAPI_GetProcessWorkingDirectory: {
    documentation: 'Retrieves the current working directory for the specified process',
    label: '_WinAPI_GetProcessWorkingDirectory ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProfilesDirectory: {
    documentation: 'Retrieves the path to the root directory where user profiles are stored',
    label: '_WinAPI_GetProfilesDirectory (  )',
    params: [],
  },
  _WinAPI_GetPwrCapabilities: {
    documentation: 'Retrieves information about the system power capabilities',
    label: '_WinAPI_GetPwrCapabilities (  )',
    params: [],
  },
  _WinAPI_GetRawInputBuffer: {
    documentation: 'Performs a buffered read of the raw input data',
    label: '_WinAPI_GetRawInputBuffer ( $pBuffer, $iLength )',
    params: [
      {
        label: '$pBuffer',
        documentation:
          'A pointer to the buffer to receive an array of $tagRAWINPUT structures containing the raw input data.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
      },
    ],
  },
  _WinAPI_GetRawInputBufferLength: {
    documentation:
      'Retrieves the required buffer size to call the _WinAPI_GetRawInputBuffer() function',
    label: '_WinAPI_GetRawInputBufferLength (  )',
    params: [],
  },
  _WinAPI_GetRawInputData: {
    documentation: 'Retrieves the raw input from the specified device',
    label: '_WinAPI_GetRawInputData ( $hRawInput, $pBuffer, $iLength, $iFlag )',
    params: [
      {
        label: '$hRawInput',
        documentation:
          'A handle to the $tagRAWINPUT structure (not a pointer). This comes from the "lParam" in WM_INPUT.',
      },
      {
        label: '$pBuffer',
        documentation:
          'A pointer to the buffer to receive a data that comes from the $tagRAWINPUT structure. This dependson the value of a command flag (see below). If this parameter is 0, the function returns therequired size of the buffer, in bytes.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
      },
      {
        label: '$iFlag',
        documentation:
          'The command flag. This parameter can be one of the following values.    $RID_HEADER    $RID_INPUT',
      },
    ],
  },
  _WinAPI_GetRawInputDeviceInfo: {
    documentation: 'Retrieves information about the raw input device',
    label: '_WinAPI_GetRawInputDeviceInfo ( $hDevice, $pBuffer, $iLength, $iFlag )',
    params: [
      {
        label: '$hDevice',
        documentation:
          'A handle to the raw input device. This comes from the "lParam" of the WM_INPUT message, from the"$hDevice" member of the $tagRAWINPUTHEADER structure, or from the _WinAPI_EnumRawInputDevices() function.',
      },
      {
        label: '$pBuffer',
        documentation:
          'A pointer to the buffer that receives an information specified by a command flag (see below).If this parameter is 0, the function returns the required size of the buffer, in bytes or characters.',
      },
      {
        label: '$iLength',
        documentation:
          'The size of the buffer, in bytes. For $RIDI_DEVICENAME only, this value is the character count,including null-terminating character (not the byte count).',
      },
      {
        label: '$iFlag',
        documentation:
          'The command flag that specifies what information will be returned.This parameter can be one of the following values.    $RIDI_DEVICENAME    $RIDI_DEVICEINFO    $RIDI_PREPARSEDDATA',
      },
    ],
  },
  _WinAPI_GetRegionData: {
    documentation: 'Fills the specified buffer with data describing a region',
    label: '_WinAPI_GetRegionData ( $hRgn, ByRef $tRGNDATA )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRGNDATA',
        documentation:
          'Returns a $tagRGNDATA structure that is created by this function, and contains the region data, in logical units.',
      },
    ],
  },
  _WinAPI_GetRegisteredRawInputDevices: {
    documentation:
      'Retrieves the information about the raw input devices for the current application',
    label: '_WinAPI_GetRegisteredRawInputDevices ( $pBuffer, $iLength )',
    params: [
      {
        label: '$pBuffer',
        documentation:
          'A pointer to the buffer to receive an array of $tagRAWINPUTDEVICE structures for the application.If this parameter is 0, the function returns the required buffer size, in bytes.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
      },
    ],
  },
  _WinAPI_GetRegKeyNameByHandle: {
    documentation: 'Retrieves a name of the specified registry key',
    label: '_WinAPI_GetRegKeyNameByHandle ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key.',
      },
    ],
  },
  _WinAPI_GetRgnBox: {
    documentation: 'Retrieves the bounding rectangle of the specified region',
    label: '_WinAPI_GetRgnBox ( $hRgn, ByRef $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRECT',
        documentation:
          'Returns a $tagRECT structure that is created by this function, and contains the bounding rectangle, in logical units.',
      },
    ],
  },
  _WinAPI_GetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_GetROP2 ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetRValue: {
    documentation: 'Retrieves an intensity value for the red component of a 32-bit RGB value',
    label: '_WinAPI_GetRValue ( $iRGB )',
    params: [
      {
        label: '$iRGB',
        documentation: 'The color value, in RGB.',
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
  _WinAPI_GetShellWindow: {
    documentation: "Retrieves a handle to the Shell's desktop window",
    label: '_WinAPI_GetShellWindow (  )',
    params: [],
  },
  _WinAPI_GetStartupInfo: {
    documentation:
      'Retrieves the contents of the STARTUPINFO structure that was specified when the calling process was created',
    label: '_WinAPI_GetStartupInfo (  )',
    params: [],
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
  _WinAPI_GetStretchBltMode: {
    documentation: 'Retrieves the current stretching mode',
    label: '_WinAPI_GetStretchBltMode ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
          '**[optional]** Specifies whether a string is Unicode or ASCII code of a character, valid values:    True - Unicode (Default).    False - ASCII.',
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
  _WinAPI_GetSystemDefaultLangID: {
    documentation: 'Returns the language identifier for the system locale',
    label: '_WinAPI_GetSystemDefaultLangID (  )',
    params: [],
  },
  _WinAPI_GetSystemDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the system locale',
    label: '_WinAPI_GetSystemDefaultLCID (  )',
    params: [],
  },
  _WinAPI_GetSystemDefaultUILanguage: {
    documentation:
      'Retrieves the language identifier for the system default UI language of the operating system',
    label: '_WinAPI_GetSystemDefaultUILanguage (  )',
    params: [],
  },
  _WinAPI_GetSystemDEPPolicy: {
    documentation: 'Gets the data execution prevention (DEP) policy setting for the system',
    label: '_WinAPI_GetSystemDEPPolicy (  )',
    params: [],
  },
  _WinAPI_GetSystemInfo: {
    documentation: 'Retrieves information about the current system',
    label: '_WinAPI_GetSystemInfo (  )',
    params: [],
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
  _WinAPI_GetSystemPowerStatus: {
    documentation: 'Retrieves the power status of the system',
    label: '_WinAPI_GetSystemPowerStatus (  )',
    params: [],
  },
  _WinAPI_GetSystemTimes: {
    documentation: 'Retrieves system timing information',
    label: '_WinAPI_GetSystemTimes (  )',
    params: [],
  },
  _WinAPI_GetSystemWow64Directory: {
    documentation: 'Retrieves the path of the system directory used by WOW64',
    label: '_WinAPI_GetSystemWow64Directory (  )',
    params: [],
  },
  _WinAPI_GetTabbedTextExtent: {
    documentation:
      'Computes the width and height of a character string which may contain one or more tab characters',
    label:
      '_WinAPI_GetTabbedTextExtent ( $hDC, $sText [, $aTab = 0 [, $iStart = 0 [, $iEnd = -1]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
      {
        label: '$sText',
        documentation: 'A character string.',
      },
      {
        label: '$aTab',
        documentation:
          '**[optional]** The array containing the tab-stop positions, in device units. The tab stops must be sorted in increasingorder; the smallest x-value should be the first item in the array. Also, it can be an integer value that isone tab-stop position. In this case, the tab stops are separated by the distance specified by this value.If this parameter is 0 (Default), tabs are expanded to eight times the average character width.',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** The index of array element that contains the first tab-stop position.',
      },
      {
        label: '$iEnd',
        documentation:
          '**[optional]** The index of array element that contains the last tab-stop position.',
      },
    ],
  },
  _WinAPI_GetTempFileName: {
    documentation: 'Creates a name for a temporary file',
    label: "_WinAPI_GetTempFileName ( $sFilePath [, $sPrefix = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The directory path for the file name. Applications typically specify a period (.) for the current directory.',
      },
      {
        label: '$sPrefix',
        documentation:
          '**[optional]** The prefix string. The function uses up to the first three characters of this string as the prefix of thefile name.',
      },
    ],
  },
  _WinAPI_GetTextAlign: {
    documentation: 'Retrieves the text-alignment setting for the specified device context',
    label: '_WinAPI_GetTextAlign ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetTextCharacterExtra: {
    documentation: 'Retrieves the current intercharacter spacing for the specified device context',
    label: '_WinAPI_GetTextCharacterExtra ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetTextColor: {
    documentation: 'Retrieves the current text color for the specified device context',
    label: '_WinAPI_GetTextColor ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetTextFace: {
    documentation:
      'Retrieves the typeface name of the font that is selected into the specified device context',
    label: '_WinAPI_GetTextFace ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetThreadDesktop: {
    documentation: 'Retrieves a handle to the desktop assigned to the specified thread',
    label: '_WinAPI_GetThreadDesktop ( $iThreadId )',
    params: [
      {
        label: '$iThreadId',
        documentation:
          'The thread identifier. The _WinAPI_CreateProcess() and _WinAPI_GetCurrentThreadId() return thread identifiers.',
      },
    ],
  },
  _WinAPI_GetThreadErrorMode: {
    documentation: 'Retrieves the error mode for the calling thread',
    label: '_WinAPI_GetThreadErrorMode (  )',
    params: [],
  },
  _WinAPI_GetThreadLocale: {
    documentation: 'Retrieves the locale identifier of the current locale for the calling thread',
    label: '_WinAPI_GetThreadLocale (  )',
    params: [],
  },
  _WinAPI_GetThreadUILanguage: {
    documentation:
      'Retrieves the language identifier of the first user interface language for the current thread',
    label: '_WinAPI_GetThreadUILanguage (  )',
    params: [],
  },
  _WinAPI_GetTickCount: {
    documentation:
      'Retrieves the number of milliseconds that have elapsed since the system was started',
    label: '_WinAPI_GetTickCount (  )',
    params: [],
  },
  _WinAPI_GetTickCount64: {
    documentation:
      'Retrieves the number of milliseconds that have elapsed since the system was started',
    label: '_WinAPI_GetTickCount64 (  )',
    params: [],
  },
  _WinAPI_GetTimeFormat: {
    documentation: 'Formats time as a time string for a locale specified by identifier',
    label:
      "_WinAPI_GetTimeFormat ( [$iLCID = 0 [, $tSYSTEMTIME = 0 [, $iFlags = 0 [, $sFormat = '']]]] )",
    params: [
      {
        label: '$iLCID',
        documentation:
          '**[optional]** The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$tSYSTEMTIME',
        documentation:
          '**[optional]** $tagSYSTEMTIME structure that contains the time information to format. If this parameter is 0 (Default),the function will use the current local system time.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies the time format options.This parameter can be one or more of the following values.$TIME_FORCE24HOURFORMAT$TIME_NOMINUTESORSECONDS$TIME_NOSECONDS$TIME_NOTIMEMARKER',
      },
      {
        label: '$sFormat',
        documentation:
          '**[optional]** The string that is used to form the time. For example, "hh:mm:ss tt". If this parameter isomitted or an empty string (Default), the function returns the string according to the time formatfor the specified locale.',
      },
    ],
  },
  _WinAPI_GetTopWindow: {
    documentation: 'Retrieves a handle to the child window at the top of the Z order',
    label: '_WinAPI_GetTopWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the parent window whose child windows are to be examined. If this parameter is 0, the functionreturns a handle to the window at the top of the Z order.',
      },
    ],
  },
  _WinAPI_GetUDFColorMode: {
    documentation: 'Retrieves the current color mode for WinAPIEx UDF library',
    label: '_WinAPI_GetUDFColorMode (  )',
    params: [],
  },
  _WinAPI_GetUpdateRect: {
    documentation:
      'Retrieves the coordinates of the rectangle that completely encloses the update region of the specified window',
    label: '_WinAPI_GetUpdateRect ( $hWnd [, $bErase = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose update region is to be retrieved.',
      },
      {
        label: '$bErase',
        documentation:
          '**[optional]** Specifies whether the background in the update region is to be erased, valid values:True - The background is erased (Default).False - The background remains unchanged.',
      },
    ],
  },
  _WinAPI_GetUpdateRgn: {
    documentation:
      'Retrieves the update region of a window by copying it into the specified region',
    label: '_WinAPI_GetUpdateRgn ( $hWnd, $hRgn [, $bErase = True] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window with an update region that is to be retrieved.',
      },
      {
        label: '$hRgn',
        documentation: 'Handle to the region to receive the update region.',
      },
      {
        label: '$bErase',
        documentation:
          '**[optional]** Specifies whether the background in the update region is to be erased, valid values:    True - The background is erased (Default).    False - The background remains unchanged.',
      },
    ],
  },
  _WinAPI_GetUserDefaultLangID: {
    documentation: 'Returns the language identifier for the current user locale',
    label: '_WinAPI_GetUserDefaultLangID (  )',
    params: [],
  },
  _WinAPI_GetUserDefaultLCID: {
    documentation: 'Returns the locale identifier (LCID) for the user default locale',
    label: '_WinAPI_GetUserDefaultLCID (  )',
    params: [],
  },
  _WinAPI_GetUserDefaultUILanguage: {
    documentation: 'Returns the language identifier for the user UI language for the current user',
    label: '_WinAPI_GetUserDefaultUILanguage (  )',
    params: [],
  },
  _WinAPI_GetUserGeoID: {
    documentation: 'Retrieves information about the geographical location of the user',
    label: '_WinAPI_GetUserGeoID (  )',
    params: [],
  },
  _WinAPI_GetUserObjectInformation: {
    documentation: 'Retrieves information about the specified window station or desktop object',
    label: '_WinAPI_GetUserObjectInformation ( $hObject, $iIndex )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the window station or desktop object.',
      },
      {
        label: '$iIndex',
        documentation:
          'The information to be retrieved. The parameter can be one of the following values.$UOI_FLAGS$tagUSEROBJECTFLAGS structure containing information about a window station or desktop handle.$UOI_HEAPSIZEThe size of the desktop heap, in KB.$UOI_IO1 if the object is a handle to the desktop that is receiving input from the user, 0 otherwise.$UOI_NAMEThe name of the object, as a string.$UOI_TYPEThe type of the object, as a string.$UOI_USER_SIDThe security identifier (SID) structure as "byte[n]".',
      },
    ],
  },
  _WinAPI_GetVersion: {
    documentation: 'Retrieves version of the current operating system',
    label: '_WinAPI_GetVersion (  )',
    params: [],
  },
  _WinAPI_GetVersionEx: {
    documentation: 'Retrieves information about the current operating system',
    label: '_WinAPI_GetVersionEx (  )',
    params: [],
  },
  _WinAPI_GetVolumeInformation: {
    documentation:
      'Retrieves information about the file system and volume associated with the specified root directory',
    label: "_WinAPI_GetVolumeInformation ( [$sRoot = ''] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The root directory of the volume to be described. If this parameter is empty string, the rootof the current directory is used. A trailing backslash is required. For example, you specify"\\\\MyServer\\MyShare" as "\\\\MyServer\\MyShare\\", or the "C" drive as "C:\\".',
      },
    ],
  },
  _WinAPI_GetVolumeInformationByHandle: {
    documentation:
      'Retrieves information about the file system and volume associated with the specified file',
    label: '_WinAPI_GetVolumeInformationByHandle ( $hFile )',
    params: [
      {
        label: '$hFile',
        documentation: 'A handle to the file.',
      },
    ],
  },
  _WinAPI_GetVolumeNameForVolumeMountPoint: {
    documentation:
      'Retrieves a volume GUID path for the volume that is associated with the specified volume mount point',
    label: '_WinAPI_GetVolumeNameForVolumeMountPoint ( $sMountedPath )',
    params: [
      {
        label: '$sMountedPath',
        documentation:
          'The path of a mounted folder (for example, Y:\\MountX\\) or a drive letter (for example, X:\\).',
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
  _WinAPI_GetWindowDisplayAffinity: {
    documentation:
      'Retrieves the current display affinity setting, from any process, for a given window',
    label: '_WinAPI_GetWindowDisplayAffinity ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window for which display affinity setting is retrieved.',
      },
    ],
  },
  _WinAPI_GetWindowExt: {
    documentation:
      'Retrieves the x-extent and y-extent of the window for the specified device context',
    label: '_WinAPI_GetWindowExt ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_GetWindowFileName: {
    documentation:
      'Retrieves the fully-qualified path of the module associated with the specified window handle',
    label: '_WinAPI_GetWindowFileName ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose module file name will be retrieved.',
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
  _WinAPI_GetWindowInfo: {
    documentation: 'Retrieves information about the specified window',
    label: '_WinAPI_GetWindowInfo ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose information is to be retrieved.',
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
  _WinAPI_GetWindowOrg: {
    documentation:
      'Retrieves the x-coordinates and y-coordinates of the window origin for the specified device context',
    label: '_WinAPI_GetWindowOrg ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GetWindowRgnBox: {
    documentation:
      'Retrieves the dimensions of the tightest bounding rectangle for the window region of a window',
    label: '_WinAPI_GetWindowRgnBox ( $hWnd, ByRef $tRECT )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
      {
        label: '$tRECT',
        documentation:
          'Returns a $tagRECT structure that is created by this function, and contains the rectangle dimensions, in deviceunits relative to the upper-left corner of the window.',
      },
    ],
  },
  _WinAPI_GetWindowSubclass: {
    documentation: 'Retrieves the reference data for the specified window subclass callback',
    label: '_WinAPI_GetWindowSubclass ( $hWnd, $pSubclassProc, $idSubClass )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window being subclassed.',
      },
      {
        label: '$pSubclassProc',
        documentation:
          'A pointer to a window procedure. This pointer and the subclass ID uniquely identify this subclass callback.(See MSDN for more information)',
      },
      {
        label: '$idSubClass',
        documentation: 'The subclass ID.',
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
  _WinAPI_GetWorkArea: {
    documentation: 'Retrieves the size of the working area on the primary display monitor',
    label: '_WinAPI_GetWorkArea (  )',
    params: [],
  },
  _WinAPI_GetWorldTransform: {
    documentation: 'Retrieves the current world-space to page-space transformation',
    label: '_WinAPI_GetWorldTransform ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
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
  _WinAPI_GradientFill: {
    documentation: 'Fills rectangle or triangle gradient',
    label:
      '_WinAPI_GradientFill ( $hDC, Const ByRef $aVertex [, $iStart = 0 [, $iEnd = -1 [, $bRotate = False]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$aVertex',
        documentation:
          'The 2D array ([x1, y1, $iRGB1], [x2, y2, $iRGB2], ... [xN, yN, $iRGBN]) that contains the necessarygradient vertices. Each vertex in this array contains the following parameters.x - The x-coordinate, in logical units.y - The y-coordinate, in logical unitsrgb - The color information at the point of x, y.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start filling at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop filling at.',
      },
      {
        label: '$bRotate',
        documentation:
          '**[optional]** Specifies whether fills a rectangle from left to right edge (horizontal gradient).    $bRotate used only for the rectangular gradients, for the triangular gradients this parameter will be ignored,    valid values:        True - Fills from left to right edge.        False - Fills from top to bottom edge (Default).',
      },
    ],
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
          '**[optional]** Specifies whether to treat the string as case sensitive when computing the hash value, valid values:True - The lowercase and uppercase string hash to the different value (Default).False - The lowercase and uppercase string hash to the same value.',
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
  _WinAPI_HideCaret: {
    documentation: 'Removes the caret from the screen',
    label: '_WinAPI_HideCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that owns the caret. If this parameter is 0, _WinAPI_HideCaret() searches thecurrent task for the window that owns the caret.',
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
  _WinAPI_InflateRect: {
    documentation: 'Increases or decreases the width and height of the specified rectangle',
    label: '_WinAPI_InflateRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that increases or decreases in size.',
      },
      {
        label: '$iDX',
        documentation: 'The amount to increase or decrease (negative value) the rectangle width.',
      },
      {
        label: '$iDY',
        documentation: 'The amount to increase or decrease (negative value) the rectangle height.',
      },
    ],
  },
  _WinAPI_InitMUILanguage: {
    documentation:
      'Enables an application to specify a language to be used with the common controls that is different from the system language',
    label: '_WinAPI_InitMUILanguage ( $iLanguage )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'The language identifier to be used by the common controls.',
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
  _WinAPI_IntersectClipRect: {
    documentation:
      'Creates a new clipping region from the intersection of the current clipping region and the specified rectangle',
    label: '_WinAPI_IntersectClipRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the specified rectangle.',
      },
    ],
  },
  _WinAPI_IntersectRect: {
    documentation: 'Creates the intersection of two rectangles',
    label: '_WinAPI_IntersectRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: '$tagRECT structure that contains the first source rectangle.',
      },
      {
        label: '$tRECT2',
        documentation: '$tagRECT structure that contains the second source rectangle.',
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
  _WinAPI_InvalidateRgn: {
    documentation: "Adds a region to the specified window's update region",
    label: '_WinAPI_InvalidateRgn ( $hWnd [, $hRgn = 0 [, $bErase = True]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window with an update region that is to be modified.',
      },
      {
        label: '$hRgn',
        documentation:
          '**[optional]** Handle to the region to be added to the update region. The region is assumed to have client coordinates.If this parameter is 0, the entire client area is added to the update region.',
      },
      {
        label: '$bErase',
        documentation:
          '**[optional]** Specifies whether the background within the update region is to be erased when the update region is processed, valid values:    True - The background is erased (Default).    False - The background remains unchanged.',
      },
    ],
  },
  _WinAPI_InvertANDBitmap: {
    documentation: 'Inverts the specified AND bitmask bitmap by performing a logical NOT operation',
    label: '_WinAPI_InvertANDBitmap ( $hBitmap [, $bDelete = False] )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the source bitmap that must be inverted.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the source bitmap after the function is successful, valid values:    True - The bitmap will be destroyed when the function succeeds.    False - Do not delete, you must destroy a bitmap when it no longer needed (Default).',
      },
    ],
  },
  _WinAPI_InvertColor: {
    documentation: 'Inverts (negative) the specified color',
    label: '_WinAPI_InvertColor ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation:
          'The color to be inverted. This color can be specified in RGB or BGR format.',
      },
    ],
  },
  _WinAPI_InvertRect: {
    documentation:
      'Inverts a rectangle in a window by performing a logical NOT operation on the color values for each pixel',
    label: '_WinAPI_InvertRect ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the rectangle to be inverted.',
      },
    ],
  },
  _WinAPI_InvertRgn: {
    documentation: 'Inverts the colors in the specified region',
    label: '_WinAPI_InvertRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region for which colors are inverted. The region's coordinates arepresumed to be logical coordinates.",
      },
    ],
  },
  _WinAPI_IOCTL: {
    documentation: 'Create a unique system I/O control code (IOCTL)',
    label: '_WinAPI_IOCTL ( $iDeviceType, $iFunction, $iMethod, $iAccess )',
    params: [
      {
        label: '$iDeviceType',
        documentation: 'The type of device.',
      },
      {
        label: '$iFunction',
        documentation: 'The action within the device category.',
      },
      {
        label: '$iMethod',
        documentation:
          'The method codes for how buffers are passed for I/O and file system controls.',
      },
      {
        label: '$iAccess',
        documentation: 'The access check value for any access.',
      },
    ],
  },
  _WinAPI_IsAlphaBitmap: {
    documentation: 'Determines whether the specified bitmap has an alpha channel',
    label: '_WinAPI_IsAlphaBitmap ( $hBitmap )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to test. This bitmap must be a 32 bits-per-pixel.',
      },
    ],
  },
  _WinAPI_IsBadCodePtr: {
    documentation:
      'Determines whether the calling process has read access to the memory at the specified address',
    label: '_WinAPI_IsBadCodePtr ( $pAddress )',
    params: [
      {
        label: '$pAddress',
        documentation: 'A pointer to a memory address.',
      },
    ],
  },
  _WinAPI_IsBadReadPtr: {
    documentation:
      'Verifies that the calling process has read access to the specified range of memory',
    label: '_WinAPI_IsBadReadPtr ( $pAddress, $iLength )',
    params: [
      {
        label: '$pAddress',
        documentation: 'A pointer to the first byte of the memory block.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the memory block, in bytes.',
      },
    ],
  },
  _WinAPI_IsBadStringPtr: {
    documentation:
      'Verifies that the calling process has read access to the specified range of memory',
    label: '_WinAPI_IsBadStringPtr ( $pAddress, $iLength )',
    params: [
      {
        label: '$pAddress',
        documentation: 'A pointer to a null-terminated string, either Unicode or ASCII.',
      },
      {
        label: '$iLength',
        documentation: 'The maximum size of the string, in TCHARs.',
      },
    ],
  },
  _WinAPI_IsBadWritePtr: {
    documentation:
      'Verifies that the calling process has write access to the specified range of memory',
    label: '_WinAPI_IsBadWritePtr ( $pAddress, $iLength )',
    params: [
      {
        label: '$pAddress',
        documentation: 'A pointer to the first byte of the memory block.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the memory block, in bytes.',
      },
    ],
  },
  _WinAPI_IsChild: {
    documentation: 'Tests whether a window is a child window of a specified parent window',
    label: '_WinAPI_IsChild ( $hWnd, $hWndParent )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be tested.',
      },
      {
        label: '$hWndParent',
        documentation: 'Handle to the parent window.',
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
  _WinAPI_IsDoorOpen: {
    documentation: 'Checks if a CD (DVD) tray is open',
    label: '_WinAPI_IsDoorOpen ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the CD tray to check, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_IsElevated: {
    documentation: 'Determines whether the current process is elevated',
    label: '_WinAPI_IsElevated (  )',
    params: [],
  },
  _WinAPI_IsHungAppWindow: {
    documentation: 'Determines whether the specified application is not responding',
    label: '_WinAPI_IsHungAppWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
    ],
  },
  _WinAPI_IsIconic: {
    documentation: 'Determines whether the specified window is minimized (iconic)',
    label: '_WinAPI_IsIconic ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to test.',
      },
    ],
  },
  _WinAPI_IsInternetConnected: {
    documentation: 'Determines whether the current user is connected to the Internet',
    label: '_WinAPI_IsInternetConnected (  )',
    params: [],
  },
  _WinAPI_IsLoadKBLayout: {
    documentation: 'Determines whether the specified input locale loaded into the system',
    label: '_WinAPI_IsLoadKBLayout ( $iLanguage )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'The input locale identifier to check.',
      },
    ],
  },
  _WinAPI_IsMemory: {
    documentation:
      'Determines whether the specified pointer points to the memory block in the internal library heap',
    label: '_WinAPI_IsMemory ( $pMemory )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the memory block that to be tested.',
      },
    ],
  },
  _WinAPI_IsNameInExpression: {
    documentation: 'Determines whether a string matches the specified pattern',
    label: '_WinAPI_IsNameInExpression ( $sString, $sPattern [, $bCaseSensitive = False] )',
    params: [
      {
        label: '$sString',
        documentation:
          'The string to be compared against the pattern. This string cannot contain wildcard characters.',
      },
      {
        label: '$sPattern',
        documentation: 'The pattern string. This string can contain wildcard characters.',
      },
      {
        label: '$bCaseSensitive',
        documentation:
          '**[optional]** Specifies whether to treat the string as case sensitive when matching, valid values:    True - The case-sensitive matching.    False - The case-insensitive matching (Default).',
      },
    ],
  },
  _WinAPI_IsNetworkAlive: {
    documentation:
      'Determines whether or not a local system is connected to a network, and identifies the type of network connection',
    label: '_WinAPI_IsNetworkAlive (  )',
    params: [],
  },
  _WinAPI_IsPathShared: {
    documentation: 'Determines whether the path is shared',
    label: '_WinAPI_IsPathShared ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The fully-qualified local path to be tested.',
      },
    ],
  },
  _WinAPI_IsProcessInJob: {
    documentation: 'Determines whether the process is running in the specified job',
    label: '_WinAPI_IsProcessInJob ( $hProcess [, $hJob = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process to be tested. The handle must have the $PROCESS_QUERY_INFORMATION or$PROCESS_QUERY_LIMITED_INFORMATION access right.',
      },
      {
        label: '$hJob',
        documentation:
          '**[optional]** Handle to the job. If this parameter is 0 (Default), the function tests if the process is running under any job.',
      },
    ],
  },
  _WinAPI_IsProcessorFeaturePresent: {
    documentation:
      'Determines whether the specified processor feature is supported by the current computer',
    label: '_WinAPI_IsProcessorFeaturePresent ( $iFeature )',
    params: [
      {
        label: '$iFeature',
        documentation:
          'The processor feature to be tested. This parameter can be one of the $PF_* constants defined in APISysConstants.au3.',
      },
    ],
  },
  _WinAPI_IsRectEmpty: {
    documentation: 'Determines whether the specified rectangle is empty',
    label: '_WinAPI_IsRectEmpty ( $tRECT )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the logical coordinates of the rectangle.',
      },
    ],
  },
  _WinAPI_IsValidLocale: {
    documentation:
      'Determines if the specified locale is installed or supported on the operating system',
    label: '_WinAPI_IsValidLocale ( $iLCID [, $iFlag = 0] )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** Flag specifying the validity test to apply to the locale identifier.This parameter can have one of the following values.$LCID_INSTALLED$LCID_SUPPORTED',
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
  _WinAPI_IsWindowEnabled: {
    documentation:
      'Determines whether the specified window is enabled for mouse and keyboard input',
    label: '_WinAPI_IsWindowEnabled ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to test.',
      },
    ],
  },
  _WinAPI_IsWindowUnicode: {
    documentation: 'Determines whether the specified window is a native Unicode window',
    label: '_WinAPI_IsWindowUnicode ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to test.',
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
  _WinAPI_IsWow64Process: {
    documentation: 'Determines whether the specified process is running under WOW64',
    label: '_WinAPI_IsWow64Process ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_IsWritable: {
    documentation: 'Determines whether a disk is writable',
    label: '_WinAPI_IsWritable ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the disk to check, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_IsZoomed: {
    documentation: 'Determines whether a window is maximized',
    label: '_WinAPI_IsZoomed ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to test.',
      },
    ],
  },
  _WinAPI_Keybd_Event: {
    documentation: 'Synthesizes a keystroke',
    label: '_WinAPI_Keybd_Event ( $vKey, $iFlags [, $iScanCode = 0 [, $iExtraInfo = 0]] )',
    params: [
      {
        label: '$vKey',
        documentation:
          "The virtual-key code ($VK_*). The code must be a value in the range 1 to 254.0x01 - Left mouse button0x02 - Right mouse button0x03 - Control-break processing0x04 - Middle mouse button (three-button mouse)0x05 - X1 mouse button0x06 - X2 mouse button0x08 - BACKSPACE key0x09 - TAB key0x0C - CLEAR key0x0D - ENTER key0x10 - SHIFT key0x11 - CTRL key0x12 - ALT key0x13 - PAUSE key0x14 - CAPS LOCK key0x1B - ESC key0x20 - SPACEBAR key0x21 - PAGE UP key0x22 - PAGE DOWN key0x23 - END key0x24 - HOME key0x25 - LEFT ARROW key0x26 - UP ARROW key0x27 - RIGHT ARROW key0x28 - DOWN ARROW key0x29 - SELECT key0x2A - PRINT key0x2B - EXECUTE key0x2C - PRINT SCREEN key0x2D - INS key0x2E - DEL key0x2F - HELP key0x30 - 0x39 - (0 - 9) key0x41 - 0x5A - (A - Z) key0x5B - Left Windows key0x5C - Right Windows key0x5D - Applications key0x5F - Computer Sleep key0x60 - 0x69 - Numeric keypad (0 - 9) key0x6A - Multiply key0x6B - Add key0x6C - Separator key0x6D - Subtract key0x6E - Decimal key0x6F - Divide key0x70 - 0x87 - (F1 - F24) key0x90 - NUM LOCK key0x91 - SCROLL LOCK key0xA0 - Left SHIFT key0xA1 - Right SHIFT key0xA2 - Left CONTROL key0xA3 - Right CONTROL key0xA4 - Left MENU key0xA5 - Right MENU key0xA6 - Browser Back key0xA7 - Browser Forward key0xA8 - Browser Refresh key0xA9 - Browser Stop key0xAA - Browser Search key0xAB - Browser Favorites key0xAC - Browser Start and Home key0xAD - Volume Mute key0xAE - Volume Down key0xAF - Volume Up key0xB0 - Next Track key0xB1 - Previous Track key0xB2 - Stop Media key0xB3 - Play/Pause Media key0xB4 - Start Mail key0xB5 - Select Media key0xB6 - Start Application 1 key0xB7 - Start Application 2 key0xBA - ';:' key0xBB - '+' key0xBC - ',' key0xBD - '-' key0xBE - '.' key0xBF - '/?' key0xC0 - '`~' key0xDB - '[{' key0xDC - '\\|' key0xDD - ']}' key0xDE - 'single-quote/double-quote' key0xE2 - Either the angle bracket key or the backslash key on the RT 102-key keyboard0xE7 - Used to pass Unicode characters as if they were keystrokes0xF6 - Attn key0xF7 - CrSel key0xF8 - ExSel key0xF9 - Erase EOF key0xFA - Play key0xFB - Zoom key0xFD - PA1 key0xFE - Clear key",
      },
      {
        label: '$iFlags',
        documentation:
          'This parameter can be one or more of the following values.$KEYEVENTF_EXTENDEDKEY$KEYEVENTF_KEYUP',
      },
      {
        label: '$iScanCode',
        documentation: '**[optional]** The hardware scan code for the key. Default is 0.',
      },
      {
        label: '$iExtraInfo',
        documentation:
          '**[optional]** The additional value associated with the key stroke. Default is 0.',
      },
    ],
  },
  _WinAPI_KillTimer: {
    documentation: 'Destroys the specified timer',
    label: '_WinAPI_KillTimer ( $hWnd, $iTimerID )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window associated with the specified timer. This value must be the same as the$hWnd value passed to the _WinAPI_SetTimer() function that created the timer.',
      },
      {
        label: '$iTimerID',
        documentation: 'The timer identifier which specifies the timer to be destroyed.',
      },
    ],
  },
  _WinAPI_LineDDA: {
    documentation: 'Determines which pixels should be highlighted for a line',
    label: '_WinAPI_LineDDA ( $iX1, $iY1, $iX2, $iY2, $pLineProc [, $pData = 0] )',
    params: [
      {
        label: '$iX1',
        documentation:
          "Specifies the x-coordinate, in logical units, of the line's starting point.",
      },
      {
        label: '$iY1',
        documentation:
          "Specifies the y-coordinate, in logical units, of the line's starting point.",
      },
      {
        label: '$iX2',
        documentation: "Specifies the x-coordinate, in logical units, of the line's ending point.",
      },
      {
        label: '$iY2',
        documentation: "Specifies the y-coordinate, in logical units, of the line's ending point.",
      },
      {
        label: '$pLineProc',
        documentation: 'Pointer to an application-defined callback function.',
      },
      {
        label: '$pData',
        documentation: '**[optional]** Pointer to the application-defined data.',
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
  _WinAPI_LoadCursor: {
    documentation: 'Loads the specified cursor resource from the executable (.exe) file',
    label: '_WinAPI_LoadCursor ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to an instance of the module whose executable file contains the cursor to be loaded.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the cursor resource or resource identifier to be loaded. To use one of the predefinedcursors, the application must set the $hInstance parameter to 0and the $sName parameter to oneof the following values.$IDC_ARROW$IDC_IBEAM$IDC_WAIT$IDC_CROSS$IDC_UPARROW$IDC_SIZE$IDC_ICON$IDC_SIZENWSE$IDC_SIZENESW$IDC_SIZEWE$IDC_SIZENS$IDC_SIZEALL$IDC_NO$IDC_HAND$IDC_APPSTARTING$IDC_HELP',
      },
    ],
  },
  _WinAPI_LoadCursorFromFile: {
    documentation: 'Creates a cursor based on data contained in a file',
    label: '_WinAPI_LoadCursorFromFile ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The file data to be used to create the cursor. The data in the file must be in either .CUR or .ANI format.',
      },
    ],
  },
  _WinAPI_LoadIcon: {
    documentation:
      'Loads the specified icon resource from the executable (.exe) file associated with an application instance',
    label: '_WinAPI_LoadIcon ( $hInstance, $sName )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'A handle to an instance of the module whose executable file contains the icon to be loaded.',
      },
      {
        label: '$sName',
        documentation:
          'The name of the icon resource to be loaded. Alternatively, if $hInstance is 0, it can beone of the following predefined values.$IDI_APPLICATION$IDI_HAND$IDI_QUESTION$IDI_EXCLAMATION$IDI_ASTERISK$IDI_WINLOGO$IDI_SHIELD$IDI_ERROR$IDI_INFORMATION$IDI_WARNING',
      },
    ],
  },
  _WinAPI_LoadIconMetric: {
    documentation: 'Loads a specified icon resource with a client-specified system metric',
    label: '_WinAPI_LoadIconMetric ( $hInstance, $sName, $iMetric )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module of either a DLL or executable (.exe) file that contains the icon to be loaded.',
      },
      {
        label: '$sName',
        documentation:
          'The information about the icon to load. If $hInstance is not 0, $sName specifies the icon resourceeither by name or ordinal, otherwise, $sName specifies either the name of a standalone icon (.ico)file or the identifier of a predefined icon to load.$IDI_APPLICATION$IDI_HAND$IDI_QUESTION$IDI_EXCLAMATION$IDI_ASTERISK$IDI_WINLOGO$IDI_SHIELD$IDI_ERROR$IDI_INFORMATION$IDI_WARNING',
      },
      {
        label: '$iMetric',
        documentation:
          'The desired metric. It can be one of the following values.$LIM_SMALL$LIM_LARGE',
      },
    ],
  },
  _WinAPI_LoadIconWithScaleDown: {
    documentation:
      'Loads an icon and scales down a larger image instead of scaling up a smaller image',
    label: '_WinAPI_LoadIconWithScaleDown ( $hInstance, $sName, $iWidth, $iHeight )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module of either a DLL or executable (.exe) file that contains the icon to be loaded.',
      },
      {
        label: '$sName',
        documentation:
          'The information about the icon to load. If $hInstance is not 0, $sName specifies the icon resourceeither by name or ordinal, otherwise, $sName specifies either the name of a standalone icon (.ico)file or the identifier of a predefined icon to load.$IDI_APPLICATION$IDI_HAND$IDI_QUESTION$IDI_EXCLAMATION$IDI_ASTERISK$IDI_WINLOGO$IDI_SHIELD$IDI_ERROR$IDI_INFORMATION$IDI_WARNING',
      },
      {
        label: '$iWidth',
        documentation: 'The desired width, in pixels, of the icon.',
      },
      {
        label: '$iHeight',
        documentation: 'The desired height, in pixels, of the icon.',
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
  _WinAPI_LoadIndirectString: {
    documentation: 'Extracts the string from the specified resource when given an indirect string',
    label: '_WinAPI_LoadIndirectString ( $sStrIn )',
    params: [
      {
        label: '$sStrIn',
        documentation: 'The input indirect string.',
      },
    ],
  },
  _WinAPI_LoadKeyboardLayout: {
    documentation: 'Loads a new input locale identifier into the system',
    label: '_WinAPI_LoadKeyboardLayout ( $iLanguage [, $iFlag = 0] )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'The input locale identifier to load.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies how the input locale identifier is to be loaded. This parameter can beone of the following values.$KLF_ACTIVATE$KLF_NOTELLSHELL$KLF_REORDER$KLF_REPLACELANG$KLF_SUBSTITUTE_OK$KLF_SETFORPROCESS',
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
  _WinAPI_LoadMedia: {
    documentation: 'Loads media into a device',
    label: '_WinAPI_LoadMedia ( $sDrive )',
    params: [
      {
        label: '$sDrive',
        documentation: 'The drive letter of the CD tray to load, in the format D:, E:, etc.',
      },
    ],
  },
  _WinAPI_LoadResource: {
    documentation: 'Loads the specified resource into global memory',
    label: '_WinAPI_LoadResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation:
          'Handle to the module whose executable file contains the resource. If this parameter is 0, the systemloads the resource from the module that was used to create the current process.',
      },
      {
        label: '$hResource',
        documentation:
          'Handle to the resource to be loaded. This handle is returned by the _WinAPI_FindResource()or _WinAPI_FindResourceEx() function.',
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
  _WinAPI_LoadStringEx: {
    documentation: 'Loads a string resource for the specified language from the specified module',
    label: '_WinAPI_LoadStringEx ( $hModule, $iID [, $iLanguage = $LOCALE_USER_DEFAULT] )',
    params: [
      {
        label: '$hModule',
        documentation:
          'A handle to an instance of the module whose executable file contains the string resource.Also, this parameter can specify the name of the module to load, it must be a full or relative path.If this parameter is 0 or an empty string, that is equivalent to passing in a handle to the moduleused to create the current process.',
      },
      {
        label: '$iID',
        documentation: 'The identifier of the string to be loaded.',
      },
      {
        label: '$iLanguage',
        documentation:
          '**[optional]** The language identifier of the string resource of interest. To retrieve string for user defaultlanguage set this parameter to $LOCALE_USER_DEFAULT (Default).',
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
  _WinAPI_LockDevice: {
    documentation:
      'Enables or disables the mechanism that ejects media, for those devices possessing that locking capability',
    label: '_WinAPI_LockDevice ( $sDrive, $bLock )',
    params: [
      {
        label: '$sDrive',
        documentation:
          'The drive letter of the device to enable or disable, in the format D:, E:, etc.',
      },
      {
        label: '$bLock',
        documentation:
          'Specifies whether the device should be disabled, valid values:    True - The device is disabled.    False - The device is enabled.',
      },
    ],
  },
  _WinAPI_LockFile: {
    documentation: 'Locks the specified file for exclusive access by the calling process',
    label: '_WinAPI_LockFile ( $hFile, $iOffset, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iOffset',
        documentation: 'The starting byte offset in the file where the lock should begin.',
      },
      {
        label: '$iLength',
        documentation: 'The length of the byte range to be locked.',
      },
    ],
  },
  _WinAPI_LockResource: {
    documentation: 'Locks the specified resource in memory',
    label: '_WinAPI_LockResource ( $hData )',
    params: [
      {
        label: '$hData',
        documentation:
          'Handle to the resource to be locked. The _WinAPI_LoadResource() function returns this handle. Do notpass any value as a parameter other than a successful return value from the LoadResource function.',
      },
    ],
  },
  _WinAPI_LockWindowUpdate: {
    documentation: 'Disables or enables drawing in the specified window',
    label: '_WinAPI_LockWindowUpdate ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window in which drawing will be disabled. If this parameter is 0, drawing in the lockedwindow is enabled.',
      },
    ],
  },
  _WinAPI_LockWorkStation: {
    documentation: "Locks the workstation's display",
    label: '_WinAPI_LockWorkStation (  )',
    params: [],
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
  _WinAPI_LookupIconIdFromDirectoryEx: {
    documentation:
      'Searches through icon or cursor data for the icon or cursor that best fits the current display device',
    label:
      '_WinAPI_LookupIconIdFromDirectoryEx ( $pData [, $bIcon = True [, $iXDesiredPixels = 0 [, $iYDesiredPixels = 0 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$pData',
        documentation:
          'The icon or cursor directory data. Because this function does not validate the resource data,it causes a general protection (GP) fault or returns an undefined value if presbits is not pointing to validresource data.',
      },
      {
        label: '$bIcon',
        documentation:
          '**[optional]** Specifies whether an icon or a cursor is sought, valid values:    True - The function is searching for an icon (Default).    False - The function is searching for a cursor.',
      },
      {
        label: '$iXDesiredPixels',
        documentation:
          '**[optional]** The desired width, in pixels, of the icon or cursor.If this parameter is zero (Default), the function uses the system metric value.',
      },
      {
        label: '$iYDesiredPixels',
        documentation:
          '**[optional]** The desired height, in pixels, of the icon or cursor.If this parameter is zero (Default), the function uses the system metric value.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.    $LR_DEFAULTCOLOR (Default)    $LR_MONOCHROME',
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
  _WinAPI_LPtoDP: {
    documentation: 'Converts a logical coordinates into device coordinates',
    label: '_WinAPI_LPtoDP ( $hDC, ByRef $tPOINT [, $iCount = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tPOINT',
        documentation:
          '$tagPOINT structure or structure of points ("long x1;long y1;...long xN;long yN") containing thex- and y-coordinates to be transformed.',
      },
      {
        label: '$iCount',
        documentation: '**[optional]** The number of points. Default is 1.',
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
  _WinAPI_MapViewOfFile: {
    documentation: 'Maps a view of a file mapping into the address space of a calling process',
    label:
      '_WinAPI_MapViewOfFile ( $hMapping [, $iOffset = 0 [, $iBytes = 0 [, $iAccess = 0x0006]]] )',
    params: [
      {
        label: '$hMapping',
        documentation:
          'Handle to a file mapping object. The _WinAPI_CreateFileMapping() and _WinAPI_OpenFileMapping()functions return this handle.',
      },
      {
        label: '$iOffset',
        documentation: '**[optional]** The file offset where the view is to begin.',
      },
      {
        label: '$iBytes',
        documentation:
          '**[optional]** The number of bytes of a file mapping to map to a view. All bytes must be within the maximum sizespecified by _WinAPI_CreateFileMapping(). If $iBytes is 0, the mapping extends from the specifiedoffset to the end of the file mapping.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the file mapping object. This parameter can be one of the following values.$FILE_MAP_ALL_ACCESS$FILE_MAP_COPY$FILE_MAP_READ (Default)$FILE_MAP_WRITE (Default)Each of the preceding values can be combined with the following value.$FILE_MAP_EXECUTE',
      },
    ],
  },
  _WinAPI_MapVirtualKey: {
    documentation:
      'Translates a virtual-key code into a scan code or character value, or translates a scan code into a virtual-key code',
    label: '_WinAPI_MapVirtualKey ( $iCode, $iType [, $hLocale = 0] )',
    params: [
      {
        label: '$iCode',
        documentation:
          'The virtual key code or scan code for a key. How this value is interpreted depends on the $iType parameter.',
      },
      {
        label: '$iType',
        documentation:
          'The translation to be performed. This value depends on the value of the $iCode parameter and can beone of the following values.$MAPVK_VK_TO_CHAR$MAPVK_VK_TO_VSC$MAPVK_VK_TO_VSC_EX$MAPVK_VSC_TO_VK$MAPVK_VSC_TO_VK_EX',
      },
      {
        label: '$hLocale',
        documentation:
          '**[optional]** The input locale identifier to use for translating the specified code.',
      },
    ],
  },
  _WinAPI_MaskBlt: {
    documentation:
      'Combines the color data for the source and destination bitmaps using the specified mask and raster operation',
    label:
      '_WinAPI_MaskBlt ( $hDestDC, $iXDest, $iYDest, $iWidth, $iHeight, $hSrcDC, $iXSrc, $iYSrc, $hMask, $iXMask, $iYMask, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidth',
        documentation:
          'The width, in logical units, of the destination rectangle and source bitmap.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height, in logical units, of the destination rectangle and source bitmap.',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the device context from which the bitmap is to be copied.',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the source bitmap.',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the source bitmap.',
      },
      {
        label: '$hMask',
        documentation:
          'Handle to the monochrome mask bitmap combined with the color bitmap in the source device context.',
      },
      {
        label: '$iXMask',
        documentation:
          'The horizontal pixel offset for the mask bitmap specified by the hbmMask parameter.',
      },
      {
        label: '$iYMask',
        documentation:
          'The vertical pixel offset for the mask bitmap specified by the hbmMask parameter.',
      },
      {
        label: '$iRop',
        documentation: 'The raster-operation code (same as for _WinAPI_BitBlt()).',
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
  _WinAPI_MessageBoxCheck: {
    documentation:
      'Displays a message box that gives the user the option of suppressing further occurrences',
    label:
      '_WinAPI_MessageBoxCheck ( $iType, $sTitle, $sText, $sRegVal [, $iDefault = -1 [, $hParent = 0]] )',
    params: [
      {
        label: '$iType',
        documentation:
          'The flags that specify the contents and behavior of the message box.You must specify the buttons to be displayed by setting one and only one of the following flags.$MB_OK$MB_OKCANCEL$MB_YESNOYou can display an optional icon by setting one and only one of the following flags.$MB_ICONEXCLAMATION$MB_ICONHAND$MB_ICONINFORMATION$MB_ICONQUESTION',
      },
      {
        label: '$sTitle',
        documentation: 'The string that contains the title of the message box.',
      },
      {
        label: '$sText',
        documentation: 'The string that contains the message to be displayed.',
      },
      {
        label: '$sRegVal',
        documentation:
          'The string that contains a unique string value to associate with this message.',
      },
      {
        label: '$iDefault',
        documentation:
          '**[optional]** The value that the function returns when the user has opted not to have the message box displayedagain. If the user has not opted to suppress the message box, the message box is displayed andthe function ignores $iDefault.',
      },
      {
        label: '$hParent',
        documentation: "**[optional]** The window handle to the message box's owner.",
      },
    ],
  },
  _WinAPI_MessageBoxIndirect: {
    documentation: 'Creates, displays, and operates a message box',
    label: '_WinAPI_MessageBoxIndirect ( $tMSGBOXPARAMS )',
    params: [
      {
        label: '$tMSGBOXPARAMS',
        documentation:
          '$tagMSGBOXPARAMS structure that contains information used to display the message box.',
      },
    ],
  },
  _WinAPI_MirrorIcon: {
    documentation:
      'Reverses (mirrors) icons so that they are displayed correctly on a mirrored device context',
    label: '_WinAPI_MirrorIcon ( $hIcon [, $bDelete = False] )',
    params: [
      {
        label: '$hIcon',
        documentation: 'Handle to the icon.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the icon after the function is successful, valid values:    True - Icon will be deleted if the function succeeds.    False - Do not delete, you must release the icon when you are finished using it (Default).',
      },
    ],
  },
  _WinAPI_ModifyWorldTransform: {
    documentation: 'Changes the world transformation for a device context using the specified mode',
    label: '_WinAPI_ModifyWorldTransform ( $hDC, $tXFORM, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tXFORM',
        documentation:
          '$tagXFORM structure used to modify the world transformation for the given device context.',
      },
      {
        label: '$iMode',
        documentation:
          'Specifies how the transformation data modifies the current world transformation.This parameter must be one of the following values.$MWT_IDENTITY$MWT_LEFTMULTIPLY$MWT_RIGHTMULTIPLY',
      },
    ],
  },
  _WinAPI_MonitorFromPoint: {
    documentation: 'Retrieves a handle to the display monitor that contains a specified point',
    label: '_WinAPI_MonitorFromPoint ( $tPOINT [, $iFlag = 1] )',
    params: [
      {
        label: '$tPOINT',
        documentation:
          '$tagPOINT structure that specifies the point of interest in virtual-screen coordinates.',
      },
      {
        label: '$iFlag',
        documentation:
          "**[optional]** The flag that specifies the function's return value if the point is not contained within any displaymonitor. This parameter can be one of the following values.$MONITOR_DEFAULTTONULL$MONITOR_DEFAULTTONEAREST (Default)$MONITOR_DEFAULTTOPRIMARY",
      },
    ],
  },
  _WinAPI_MonitorFromRect: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with a specified rectangle',
    label: '_WinAPI_MonitorFromRect ( $tRECT [, $iFlag = 1] )',
    params: [
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that specifies the rectangle of interest in virtual-screen coordinates.',
      },
      {
        label: '$iFlag',
        documentation:
          "**[optional]** The flag that specifies the function's return value if the rectangle does not intersect any displaymonitor. This parameter can be one of the following values.$MONITOR_DEFAULTTONULL$MONITOR_DEFAULTTONEAREST (Default)$MONITOR_DEFAULTTOPRIMARY",
      },
    ],
  },
  _WinAPI_MonitorFromWindow: {
    documentation:
      'Retrieves a handle to the display monitor that has the largest area of intersection with the specified window',
    label: '_WinAPI_MonitorFromWindow ( $hWnd [, $iFlag = 1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window of interest.',
      },
      {
        label: '$iFlag',
        documentation:
          "**[optional]** The flag that specifies the function's return value if the window does not intersect any displaymonitor. This parameter can be one of the following values.$MONITOR_DEFAULTTONULL$MONITOR_DEFAULTTONEAREST (Default)$MONITOR_DEFAULTTOPRIMARY",
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
  _WinAPI_MoveFileEx: {
    documentation:
      'Moves a file or directory, notifying the application of its progress through a callback function',
    label:
      '_WinAPI_MoveFileEx ( $sExistingFile, $sNewFile [, $iFlags = 0 [, $pProgressProc = 0 [, $pData = 0]]] )',
    params: [
      {
        label: '$sExistingFile',
        documentation:
          'The name of the existing file or directory on the local computer.If $iFlags specifies $MOVE_FILE_DELAY_UNTIL_REBOOT, the file cannot exist on a remote share because delayed operations are performed before the network is available.',
      },
      {
        label: '$sNewFile',
        documentation:
          'The new name of the file or directory on the local computer.When moving a file, $sNewFile can be on a different file system or volume.If $sNewFile is on another drive, you must set the $MOVE_FILE_COPY_ALLOWED flag in $iFlags parameter.When moving a directory, $sExistingFile and $sNewFile must be on the same drive.If $iFlags specifies $MOVE_FILE_DELAY_UNTIL_REBOOT and $sNewFile is 0, _WinAPI_MoveFileEx() registers $sExistingFile to be deleted when the system restarts.If $sExistingFile refers to a directory, the system removes the directory at restart only if the directory is empty.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The move options. This parameter can be one or more of the following values:    $MOVE_FILE_COPY_ALLOWED (0x0002)    $MOVE_FILE_CREATE_HARDLINK (0x0010)    $MOVE_FILE_DELAY_UNTIL_REBOOT (0x0004)    $MOVE_FILE_FAIL_IF_NOT_TRACKABLE (0x0020)    $MOVE_FILE_REPLACE_EXISTING (0x0001)    $MOVE_FILE_WRITE_THROUGH (0x0008)',
      },
      {
        label: '$pProgressProc',
        documentation:
          '**[optional]** The address of a callback function that is called each time another portion of the file has been moved.(See MSDN for more information)',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** Pointer to the argument to be passed to the callback function.',
      },
    ],
  },
  _WinAPI_MoveMemory: {
    documentation: 'Moves a block of memory from one location to another',
    label: '_WinAPI_MoveMemory ( $pDestination, $pSource, $iLength )',
    params: [
      {
        label: '$pDestination',
        documentation: 'A pointer to the starting address of the move destination.',
      },
      {
        label: '$pSource',
        documentation: 'A pointer to the starting address of the block of memory to be moved.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the block of memory to move, in bytes.',
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
  _WinAPI_MoveToEx: {
    documentation: 'Updates the current position to the specified point',
    label: '_WinAPI_MoveToEx ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the new position, in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the new position, in logical units.',
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
  _WinAPI_NtStatusToDosError: {
    documentation: 'Converts the specified NTSTATUS error code to its equivalent system error code',
    label: '_WinAPI_NtStatusToDosError ( $iStatus )',
    params: [
      {
        label: '$iStatus',
        documentation: 'The NTSTATUS error code to be converted.',
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
  _WinAPI_OffsetClipRgn: {
    documentation: 'Moves the clipping region of a device context by the specified offsets',
    label: '_WinAPI_OffsetClipRgn ( $hDC, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
      },
    ],
  },
  _WinAPI_OffsetPoints: {
    documentation: 'Moves a points from the array by the specified offsets',
    label:
      '_WinAPI_OffsetPoints ( ByRef $aPoint, $iXOffset, $iYOffset [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1, ...], [x2, y2, ...], ... [xN, yN, ...]). Every first two elements from thisarray specifies a point to be move. Other array elements (if any) do not change.',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start moving at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop moving at.',
      },
    ],
  },
  _WinAPI_OffsetRect: {
    documentation: 'Moves the specified rectangle by the specified offsets',
    label: '_WinAPI_OffsetRect ( ByRef $tRECT, $iDX, $iDY )',
    params: [
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that to be moved.',
      },
      {
        label: '$iDX',
        documentation: 'The amount to move the rectangle left (negative value) or right.',
      },
      {
        label: '$iDY',
        documentation: 'The amount to move the rectangle up (negative value) or down.',
      },
    ],
  },
  _WinAPI_OffsetRgn: {
    documentation: 'Moves a region by the specified offsets',
    label: '_WinAPI_OffsetRgn ( $hRgn, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region to be moved.',
      },
      {
        label: '$iXOffset',
        documentation: 'The number of logical units to move left or right.',
      },
      {
        label: '$iYOffset',
        documentation: 'The number of logical units to move up or down.',
      },
    ],
  },
  _WinAPI_OffsetWindowOrg: {
    documentation:
      'Modifies the window origin for a device context using the specified horizontal and vertical offsets',
    label: '_WinAPI_OffsetWindowOrg ( $hDC, $iXOffset, $iYOffset )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXOffset',
        documentation: 'The horizontal offset, in logical units.',
      },
      {
        label: '$iYOffset',
        documentation: 'The vertical offset, in logical units.',
      },
    ],
  },
  _WinAPI_OpenDesktop: {
    documentation: 'Opens the specified desktop object',
    label: '_WinAPI_OpenDesktop ( $sName [, $iAccess = 0 [, $iFlags = 0 [, $bInherit = False]]] )',
    params: [
      {
        label: '$sName',
        documentation:
          'The name of the desktop to be opened. Desktop names are case-insensitive. This desktop must belong tothe current window station.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the desktop. This parameter can be one or more of the following values.$DESKTOP_ALL_ACCESS$DESKTOP_CREATEMENU$DESKTOP_CREATEWINDOW$DESKTOP_ENUMERATE$DESKTOP_HOOKCONTROL$DESKTOP_JOURNALPLAYBACK$DESKTOP_JOURNALRECORD$DESKTOP_READOBJECTS$DESKTOP_SWITCHDESKTOP$DESKTOP_WRITEOBJECTS',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. It can be zero or the following value.$DF_ALLOWOTHERACCOUNTHOOK',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:    True - The processes created by this process will inherit the handle.    False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenFileById: {
    documentation: 'Opens the file that matches the specified object identifier',
    label: '_WinAPI_OpenFileById ( $hFile, $vID [, $iAccess = 0 [, $iShare = 0 [, $iFlags = 0]]] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'The path or handle to any file on a volume or share on which the file to be opened is stored.',
      },
      {
        label: '$vID',
        documentation:
          'The file identifier (FileID), or $tagGUID structure (ObjectID), or GUID\'s string representation in theform "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}" that identifies the file to open.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the object. Access can be read, write, or both. If this parameter is 0 (Default), theapplication can query file and device attributes without accessing a device.$GENERIC_READ$GENERIC_WRITE(See MSDN for more information)',
      },
      {
        label: '$iShare',
        documentation:
          '**[optional]** The sharing mode of an object, which can be read, write, both, or none. If this parameter is 0 (Default) andfunction succeeds, the object cannot be shared and cannot be opened again until the handle is closed.$FILE_SHARE_DELETE$FILE_SHARE_READ$FILE_SHARE_WRITE',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The file flags. When _WinAPI_OpenFileById() opens a file, it combines the file flags with existingfile attributes, and ignores any supplied file attributes. This parameter can include anycombination of the following values.$FILE_FLAG_BACKUP_SEMANTICS$FILE_FLAG_NO_BUFFERING$FILE_FLAG_OPEN_NO_RECALL$FILE_FLAG_OPEN_REPARSE_POINT$FILE_FLAG_OVERLAPPED$FILE_FLAG_RANDOM_ACCESS$FILE_FLAG_SEQUENTIAL_SCAN$FILE_FLAG_WRITE_THROUGH',
      },
    ],
  },
  _WinAPI_OpenFileDlg: {
    documentation:
      'Creates a dialog box that lets the user specify the drive, directory, and the name of a file or set of files to be opened',
    label:
      "_WinAPI_OpenFileDlg ( [$sTitle = '' [, $sInitDir = '' [, $sFilters = '' [, $iDefaultFilter = 0 [, $sDefaultFilePath = '' [, $sDefaultExt = '' [, $iFlags = 0 [, $iFlagsEx = 0 [, $pOFNProc = 0 [, $pData = 0 [, $hParent = 0]]]]]]]]]]] )",
    params: [
      {
        label: '$sTitle',
        documentation:
          '**[optional]** A string to be placed in the title bar of the dialog box.If this parameter is empty string (Default), the system uses the default title (that is, "Open").',
      },
      {
        label: '$sInitDir',
        documentation: '**[optional]** The initial directory.',
      },
      {
        label: '$sFilters',
        documentation:
          '**[optional]** The pairs of filter strings (for example, "Text Files (*.txt)"). To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "*.txt;*.doc;*.bak").Do not include spaces in the pattern. To specify multiple groups of filters, use the "|" character as a delimiter (for example, "Text Files (*.txt)|All Files (*.*)").If this parameter is omitted or an empty string (Default), the dialog box does not display any filters.',
      },
      {
        label: '$iDefaultFilter',
        documentation:
          '**[optional]** The 1-based index of the currently selected filter to initialize the combo box control.',
      },
      {
        label: '$sDefaultFilePath',
        documentation: '**[optional]** The file name to initialize the edit control.',
      },
      {
        label: '$sDefaultExt',
        documentation:
          '**[optional]** The default extension that appends to the file name if the user fails to type an extension.This string can be any length, but only the first three characters are appended. The string should not contain a period (.). If this parameter is empty string (Default), no extension is appended.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A set of bit flags you can use to initialize the dialog box.This parameter can be 0 or combination of the following values.    $OFN_ALLOWMULTISELECT    $OFN_CREATEPROMPT    $OFN_DONTADDTORECENT    $OFN_ENABLEHOOK    $OFN_ENABLEINCLUDENOTIFY    $OFN_ENABLESIZING    $OFN_EXPLORER    $OFN_FILEMUSTEXIST    $OFN_FORCESHOWHIDDEN    $OFN_HIDEREADONLY    $OFN_LONGNAMES    $OFN_NODEREFERENCELINKS    $OFN_NOLONGNAMES    $OFN_NONETWORKBUTTON    $OFN_NOREADONLYRETURN    $OFN_NOTESTFILECREATE    $OFN_NOVALIDATE    $OFN_PATHMUSTEXIST    $OFN_READONLY    $OFN_SHAREAWARE    $OFN_SHOWHELP',
      },
      {
        label: '$iFlagsEx',
        documentation:
          '**[optional]** A set of bit flags you can use to initialize the dialog box. It can be 0 or the following value:    $OFN_EX_NOPLACESBAR',
      },
      {
        label: '$pOFNProc',
        documentation:
          '**[optional]** A pointer to a hook procedure. This parameter is ignored unless the $OFN_ENABLEHOOK flag is set.',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** Application-defined data pointer that the system passes to the hook procedure.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** A handle to the parent window for the dialog box.',
      },
    ],
  },
  _WinAPI_OpenFileMapping: {
    documentation: 'Opens a named file mapping object',
    label: '_WinAPI_OpenFileMapping ( $sName [, $iAccess = 0x0006 [, $bInherit = False]] )',
    params: [
      {
        label: '$sName',
        documentation: 'The name of the file mapping object to be opened.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the file mapping object. This parameter can be one of the following values.$FILE_MAP_ALL_ACCESS$FILE_MAP_COPY$FILE_MAP_READ (Default)$FILE_MAP_WRITE (Default)Each of the preceding values can be combined with the following value.$FILE_MAP_EXECUTE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:    True - The processes created by this process will inherit the handle.    False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenIcon: {
    documentation:
      'Restores a minimized (iconic) window to its previous size and position and activates the window',
    label: '_WinAPI_OpenIcon ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be restored and activated.',
      },
    ],
  },
  _WinAPI_OpenInputDesktop: {
    documentation: 'Opens the desktop that receives user input',
    label: '_WinAPI_OpenInputDesktop ( [$iAccess = 0 [, $iFlags = 0 [, $bInherit = False]]] )',
    params: [
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the desktop. This parameter can be one or more of the following values.$DESKTOP_ALL_ACCESS$DESKTOP_CREATEMENU$DESKTOP_CREATEWINDOW$DESKTOP_ENUMERATE$DESKTOP_HOOKCONTROL$DESKTOP_JOURNALPLAYBACK$DESKTOP_JOURNALRECORD$DESKTOP_READOBJECTS$DESKTOP_SWITCHDESKTOP$DESKTOP_WRITEOBJECTS',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. It can be zero or the following value.$DF_ALLOWOTHERACCOUNTHOOK',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:    True - The processes created by this process will inherit the handle.    False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenJobObject: {
    documentation: 'Opens an existing job object',
    label:
      '_WinAPI_OpenJobObject ( $sName [, $iAccess = $JOB_OBJECT_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sName',
        documentation: 'The name of the job to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the job object. This parameter can be one or more of the following values.$JOB_OBJECT_ALL_ACCESS$JOB_OBJECT_ASSIGN_PROCESS$JOB_OBJECT_QUERY$JOB_OBJECT_SET_ATTRIBUTES$JOB_OBJECT_SET_SECURITY_ATTRIBUTES$JOB_OBJECT_TERMINATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:True - The processes created by this process will inherit the handle.False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenMutex: {
    documentation: 'Opens an existing named mutex object',
    label: '_WinAPI_OpenMutex ( $sMutex [, $iAccess = $MUTEX_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sMutex',
        documentation: 'The name of the mutex to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the mutex object. The function fails if the security descriptor of the specified objectdoes not permit the requested access for the calling process.This parameter can be one of the following values.$MUTEX_ALL_ACCESS$MUTEX_MODIFY_STATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:True - The processes created by this process will inherit the handle. False - The processes do not inherit this handle (Default).',
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
  _WinAPI_OpenProcessToken: {
    documentation: 'Opens the access token associated with a process',
    label: '_WinAPI_OpenProcessToken ( $iAccess [, $hProcess = 0] )',
    params: [
      {
        label: '$iAccess',
        documentation:
          'Access mask that specifies the requested types of access to the access token. This parameter can beone or more of the following values.$TOKEN_ALL_ACCESS$TOKEN_ADJUST_DEFAULT$TOKEN_ADJUST_GROUPS$TOKEN_ADJUST_PRIVILEGES$TOKEN_ADJUST_SESSIONID$TOKEN_ASSIGN_PRIMARY$TOKEN_DUPLICATE$TOKEN_EXECUTE$TOKEN_IMPERSONATE$TOKEN_QUERY$TOKEN_QUERY_SOURCE$TOKEN_READ$TOKEN_WRITE',
      },
      {
        label: '$hProcess',
        documentation:
          '**[optional]** Handle to the process whose access token is opened. The process must have the$PROCESS_QUERY_INFORMATION access permission. If this parameter is 0 (Default), will use the current process.',
      },
    ],
  },
  _WinAPI_OpenSemaphore: {
    documentation: 'Opens an existing named semaphore object',
    label: '_WinAPI_OpenSemaphore ( $sSemaphore [, $iAccess = 0x001F0003 [, $bInherit = False]] )',
    params: [
      {
        label: '$sSemaphore',
        documentation:
          'The name of the semaphore to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the semaphore object. The function fails if the security descriptor of the specifiedobject does not permit the requested access for the calling process.This parameter can be one of the following values.$SEMAPHORE_ALL_ACCESS (Default)$SEMAPHORE_MODIFY_STATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:True - The processes created by this process will inherit the handle.False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenWindowStation: {
    documentation: 'Opens the specified window station',
    label: '_WinAPI_OpenWindowStation ( $sName [, $iAccess = 0 [, $bInherit = False]] )',
    params: [
      {
        label: '$sName',
        documentation:
          'The name of the window station to be opened. Window station names are case-insensitive. This windowstation must belong to the current session.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the window station. This parameter can be one or more of the following values.$WINSTA_ALL_ACCESS$WINSTA_ACCESSCLIPBOARD$WINSTA_ACCESSGLOBALATOMS$WINSTA_CREATEDESKTOP$WINSTA_ENUMDESKTOPS$WINSTA_ENUMERATE$WINSTA_EXITWINDOWS$WINSTA_READATTRIBUTES$WINSTA_READSCREEN$WINSTA_WRITEATTRIBUTES',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values:    True - The processes created by this process will inherit the handle.    False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_PageSetupDlg: {
    documentation:
      'Creates a Page Setup dialog box that enables the user to specify the attributes of a printed page',
    label: '_WinAPI_PageSetupDlg ( ByRef $tPAGESETUPDLG )',
    params: [
      {
        label: '$tPAGESETUPDLG',
        documentation:
          "$tagPAGESETUPDLG structure that contains information used to initialize the Page Setup dialog box.The structure receives information about the user's selections when the function returns,and must be initialized before function call.(See MSDN for more information)",
      },
    ],
  },
  _WinAPI_PaintDesktop: {
    documentation:
      'Fills the clipping region in the specified device context with the desktop pattern or wallpaper',
    label: '_WinAPI_PaintDesktop ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_PaintRgn: {
    documentation:
      'Paints the specified region by using the brush currently selected into the device context',
    label: '_WinAPI_PaintRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be filled. The region's coordinates are presumed to be logical coordinates.",
      },
    ],
  },
  _WinAPI_ParseURL: {
    documentation: 'Performs rudimentary parsing of a URL',
    label: '_WinAPI_ParseURL ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL to be parsed.',
      },
    ],
  },
  _WinAPI_ParseUserName: {
    documentation: 'Extracts the domain and user account name from a fully qualified user name',
    label: '_WinAPI_ParseUserName ( $sUser )',
    params: [
      {
        label: '$sUser',
        documentation:
          'The user name to be parsed. The name must be in UPN or down-level format, or a certificate.',
      },
    ],
  },
  _WinAPI_PatBlt: {
    documentation:
      'Paints the specified rectangle using the brush that is currently selected into the specified device context',
    label: '_WinAPI_PatBlt ( $hDC, $iX, $iY, $iWidth, $iHeight, $iRop )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the rectangle to be filled.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the rectangle to be filled.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of the rectangle.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of the rectangle.',
      },
      {
        label: '$iRop',
        documentation:
          'The raster operation code. This code can be one of the following values.$BLACKNESS$DSTINVERT$PATCOPY$PATINVERT$WHITENESS',
      },
    ],
  },
  _WinAPI_PathAddBackslash: {
    documentation:
      'Adds a backslash to the end of a string to create the correct syntax for a path',
    label: '_WinAPI_PathAddBackslash ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to which the backslash will be appended. If this path already has a trailing backslash,no backslash will be added.',
      },
    ],
  },
  _WinAPI_PathAddExtension: {
    documentation: 'Adds a file name extension to a path string',
    label: "_WinAPI_PathAddExtension ( $sFilePath [, $sExt = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to which the file name extension will be appended. If there is already a file name extensionpresent, no extension will be added.',
      },
      {
        label: '$sExt',
        documentation:
          '**[optional]** The file name extension. If this parameter is empty string, an ".exe" extension will be added.',
      },
    ],
  },
  _WinAPI_PathAppend: {
    documentation: 'Appends one path to the end of another',
    label: '_WinAPI_PathAppend ( $sFilePath, $sMore )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The string to which the path is appended.',
      },
      {
        label: '$sMore',
        documentation: 'The path to be appended.',
      },
    ],
  },
  _WinAPI_PathBuildRoot: {
    documentation: 'Creates a root path from a given drive number',
    label: '_WinAPI_PathBuildRoot ( $iDrive )',
    params: [
      {
        label: '$iDrive',
        documentation: 'The desired drive number. It should be between 0 and 25.',
      },
    ],
  },
  _WinAPI_PathCanonicalize: {
    documentation:
      'Removes elements of a file path according to special strings inserted into that path',
    label: '_WinAPI_PathCanonicalize ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be canonicalized.',
      },
    ],
  },
  _WinAPI_PathCommonPrefix: {
    documentation: 'Compares two paths to determine if they share a common prefix',
    label: '_WinAPI_PathCommonPrefix ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'The first path name.',
      },
      {
        label: '$sPath2',
        documentation: 'The second path name.',
      },
    ],
  },
  _WinAPI_PathCompactPath: {
    documentation:
      'Truncates a file path to fit within a given pixel width by replacing path components with ellipses',
    label: '_WinAPI_PathCompactPath ( $hWnd, $sFilePath [, $iWidth = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window used for font metrics.',
      },
      {
        label: '$sFilePath',
        documentation: 'The path to be modified.',
      },
      {
        label: '$iWidth',
        documentation:
          "**[optional]** The width, in pixels, in which the string must fit. If this parameter is 0 (Default), width will be equal tothe width of the window's client area. If this parameter is a negative number, the width will bedecreased to its absolute value.",
      },
    ],
  },
  _WinAPI_PathCompactPathEx: {
    documentation:
      'Truncates a path to fit within a certain number of characters by replacing path components with ellipses',
    label: '_WinAPI_PathCompactPathEx ( $sFilePath, $iMax )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be modified.',
      },
      {
        label: '$iMax',
        documentation: 'The maximum number of characters to be contained in the modified path.',
      },
    ],
  },
  _WinAPI_PathCreateFromUrl: {
    documentation: 'Converts a file URL to a Microsoft MS-DOS path',
    label: '_WinAPI_PathCreateFromUrl ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
    ],
  },
  _WinAPI_PathFindExtension: {
    documentation: 'Searches a path for an extension',
    label: '_WinAPI_PathFindExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to search, including the extension being searched for.',
      },
    ],
  },
  _WinAPI_PathFindFileName: {
    documentation: 'Searches a path for a file name',
    label: '_WinAPI_PathFindFileName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to search.',
      },
    ],
  },
  _WinAPI_PathFindNextComponent: {
    documentation:
      'Parses a path and returns the portion of that path that follows the first backslash',
    label: '_WinAPI_PathFindNextComponent ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path to parse. Path components are delimited by backslashes. For instance, the path"c:\\path1\\path2\\file.txt" has four components: c:, path1, path2, and file.txt.',
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
  _WinAPI_PathGetArgs: {
    documentation: 'Finds the command-line arguments within a given path',
    label: '_WinAPI_PathGetArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathGetCharType: {
    documentation: 'Determines the type of character in relation to a path',
    label: '_WinAPI_PathGetCharType ( $sChar )',
    params: [
      {
        label: '$sChar',
        documentation: 'The character for which to determine the type.',
      },
    ],
  },
  _WinAPI_PathGetDriveNumber: {
    documentation:
      "Searches a path for a drive letter within the range of 'A' to 'Z' and returns the corresponding drive number",
    label: '_WinAPI_PathGetDriveNumber ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsContentType: {
    documentation:
      "Determines if a file's registered content type matches the specified content type",
    label: '_WinAPI_PathIsContentType ( $sFilePath, $sType )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file whose content type will be compared.',
      },
      {
        label: '$sType',
        documentation:
          'The content type string. For example, "application/x-msdownload", "image/jpeg", "text/plain", etc.',
      },
    ],
  },
  _WinAPI_PathIsDirectory: {
    documentation: 'Verifies that a path is a valid directory',
    label: '_WinAPI_PathIsDirectory ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to verify.',
      },
    ],
  },
  _WinAPI_PathIsDirectoryEmpty: {
    documentation: 'Determines whether a specified path is an empty directory',
    label: '_WinAPI_PathIsDirectoryEmpty ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be tested.',
      },
    ],
  },
  _WinAPI_PathIsExe: {
    documentation: 'Determines whether a file is an executable by examining the file extension',
    label: '_WinAPI_PathIsExe ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsFileSpec: {
    documentation: 'Searches a path for any path-delimiting characters',
    label: '_WinAPI_PathIsFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsLFNFileSpec: {
    documentation: 'Determines whether a file name is in long format',
    label: '_WinAPI_PathIsLFNFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name to be tested.',
      },
    ],
  },
  _WinAPI_PathIsRelative: {
    documentation: 'Searches a path and determines if it is relative',
    label: '_WinAPI_PathIsRelative ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
    ],
  },
  _WinAPI_PathIsRoot: {
    documentation: 'Parses a path to determine if it is a directory root',
    label: '_WinAPI_PathIsRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be validated.',
      },
    ],
  },
  _WinAPI_PathIsSameRoot: {
    documentation: 'Compares two paths to determine if they have a common root component',
    label: '_WinAPI_PathIsSameRoot ( $sPath1, $sPath2 )',
    params: [
      {
        label: '$sPath1',
        documentation: 'The first path to be compared.',
      },
      {
        label: '$sPath2',
        documentation: 'The second path to be compared.',
      },
    ],
  },
  _WinAPI_PathIsSystemFolder: {
    documentation:
      'Determines if an existing folder contains the attributes that make it a system folder',
    label: '_WinAPI_PathIsSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of an existing folder to check the system folder attributes.',
      },
    ],
  },
  _WinAPI_PathIsUNC: {
    documentation:
      'Determines if the string is a valid Universal Naming Convention (UNC) for a server and share path',
    label: '_WinAPI_PathIsUNC ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathIsUNCServer: {
    documentation:
      'Determines if a string is a valid Universal Naming Convention (UNC) for a server path only',
    label: '_WinAPI_PathIsUNCServer ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathIsUNCServerShare: {
    documentation: 'Determines if a string is a valid Universal Naming Convention (UNC) share path',
    label: '_WinAPI_PathIsUNCServerShare ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to validate.',
      },
    ],
  },
  _WinAPI_PathMakeSystemFolder: {
    documentation: 'Gives an existing folder the proper attributes to become a system folder',
    label: '_WinAPI_PathMakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of an existing folder that will be made into a system folder.',
      },
    ],
  },
  _WinAPI_PathMatchSpec: {
    documentation: 'Searches a string using a Microsoft MS-DOS wild card match type',
    label: '_WinAPI_PathMatchSpec ( $sFilePath, $sSpec )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be searched.',
      },
      {
        label: '$sSpec',
        documentation:
          'The file type for which to search. For example, to test whether $sFilePath is a .doc file,$sSpec should be set to "*.doc".',
      },
    ],
  },
  _WinAPI_PathParseIconLocation: {
    documentation: 'Parses a file location string that contains a file location and icon index',
    label: '_WinAPI_PathParseIconLocation ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The path that contains a file location string. It should be in the form "path,iconindex".',
      },
    ],
  },
  _WinAPI_PathRelativePathTo: {
    documentation: 'Creates a relative path from one file or folder to another',
    label: '_WinAPI_PathRelativePathTo ( $sPathFrom, $bDirFrom, $sPathTo, $bDirTo )',
    params: [
      {
        label: '$sPathFrom',
        documentation:
          'The path to the file or directory that defines the start of the relative path.',
      },
      {
        label: '$bDirFrom',
        documentation:
          'Specifies whether is $sPathFrom path to the directory, valid values:    True - Directory.    False - File.',
      },
      {
        label: '$sPathTo',
        documentation:
          'The path to the file or directory that defines the endpoint of the relative path.',
      },
      {
        label: '$bDirTo',
        documentation:
          'Specifies whether is $fDirTo path to the directory, valid values:    True - Directory.    False - File.',
      },
    ],
  },
  _WinAPI_PathRemoveArgs: {
    documentation: 'Removes any arguments from a given path',
    label: '_WinAPI_PathRemoveArgs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path that contains the path from which to remove arguments.',
      },
    ],
  },
  _WinAPI_PathRemoveBackslash: {
    documentation: 'Removes the trailing backslash from a given path',
    label: '_WinAPI_PathRemoveBackslash ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the backslash.',
      },
    ],
  },
  _WinAPI_PathRemoveExtension: {
    documentation: 'Removes the file name extension from a path, if one is present',
    label: '_WinAPI_PathRemoveExtension ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the extension.',
      },
    ],
  },
  _WinAPI_PathRemoveFileSpec: {
    documentation: 'Removes the trailing file name and backslash from a path, if they are present',
    label: '_WinAPI_PathRemoveFileSpec ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path from which to remove the file name.',
      },
    ],
  },
  _WinAPI_PathRenameExtension: {
    documentation: 'Replaces the extension of a file name with a new extension',
    label: '_WinAPI_PathRenameExtension ( $sFilePath, $sExt )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path in which to replace the extension.',
      },
      {
        label: '$sExt',
        documentation: 'The string that contains a "." character followed by the new extension.',
      },
    ],
  },
  _WinAPI_PathSearchAndQualify: {
    documentation: 'Formats a path to the fully qualified path',
    label: '_WinAPI_PathSearchAndQualify ( $sFilePath [, $bExists = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be formated.',
      },
      {
        label: '$bExists',
        documentation:
          '**[optional]** Specifies whether the path should be existing, valid values:    True - The path must be an existing path, otherwise, the function fails.    False - The path may not exist (Default).',
      },
    ],
  },
  _WinAPI_PathSkipRoot: {
    documentation:
      'Parses a path, ignoring the drive letter or Universal Naming Convention (UNC) server/share path elements',
    label: '_WinAPI_PathSkipRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to parse.',
      },
    ],
  },
  _WinAPI_PathStripPath: {
    documentation: 'Removes the path portion of a fully qualified path and file',
    label: '_WinAPI_PathStripPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path and file name.',
      },
    ],
  },
  _WinAPI_PathStripToRoot: {
    documentation: 'Removes all parts of the path except for the root information',
    label: '_WinAPI_PathStripToRoot ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be converted.',
      },
    ],
  },
  _WinAPI_PathToRegion: {
    documentation:
      'Creates a region from the path that is selected into the specified device context',
    label: '_WinAPI_PathToRegion ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context that contains a closed path.',
      },
    ],
  },
  _WinAPI_PathUndecorate: {
    documentation: 'Removes the decoration from a path string',
    label: '_WinAPI_PathUndecorate ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path.',
      },
    ],
  },
  _WinAPI_PathUnExpandEnvStrings: {
    documentation:
      'Replaces folder names in a fully-qualified path with their associated environment string',
    label: '_WinAPI_PathUnExpandEnvStrings ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be unexpanded.',
      },
    ],
  },
  _WinAPI_PathUnmakeSystemFolder: {
    documentation: 'Removes the attributes from a folder that make it a system folder',
    label: '_WinAPI_PathUnmakeSystemFolder ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of an existing folder that will have the system folder attributes removed.',
      },
    ],
  },
  _WinAPI_PathUnquoteSpaces: {
    documentation: 'Removes quotes from the beginning and end of a path',
    label: '_WinAPI_PathUnquoteSpaces ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path.',
      },
    ],
  },
  _WinAPI_PathYetAnotherMakeUniqueName: {
    documentation: 'Creates a unique filename based on an existing filename',
    label: '_WinAPI_PathYetAnotherMakeUniqueName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name that the unique name will be based on.',
      },
    ],
  },
  _WinAPI_PickIconDlg: {
    documentation: 'Displays a dialog box that allows the user to choose an icon',
    label: "_WinAPI_PickIconDlg ( [$sIcon = '' [, $iIndex = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sIcon',
        documentation:
          '**[optional]** The fully-qualified path of the file that contains the initial icon.',
      },
      {
        label: '$iIndex',
        documentation: '**[optional]** The index of the initial icon. Default is 0.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window.',
      },
    ],
  },
  _WinAPI_PlayEnhMetaFile: {
    documentation: 'Displays the picture stored in the specified enhanced-format metafile',
    label: '_WinAPI_PlayEnhMetaFile ( $hDC, $hEmf, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation:
          'Handle to the device context for the output device on which the picture will appear.',
      },
      {
        label: '$hEmf',
        documentation: 'Handle to the enhanced metafile.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the bounding rectangle used to display the picture,in logical units',
      },
    ],
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
          '**[optional]** The flags for sound playing. This parameter can be one or more of the following values.$SND_APPLICATION$SND_ALIAS$SND_ALIAS_ID$SND_ASYNC$SND_FILENAME$SND_LOOP$SND_MEMORY$SND_NODEFAULT$SND_NOSTOP$SND_NOWAIT$SND_PURGE$SND_RESOURCE$SND_SYNCWindows Vista or later$SND_SENTRY$SND_SYSTEMThree flags ($SND_ALIAS, $SND_FILENAME, and $SND_RESOURCE) determine whether the name is interpretedas an alias for a system event, a file name, or a resource identifier. If none of these flags arespecified, _WinAPI_PlaySound() searches the registry or the WIN.INI file for an association withthe specified sound name. If an association is found, the sound event is played. If no associationis found in the registry, the name is interpreted as a file name.If the $SND_ALIAS_ID flag is specified in $iFlags, the $sSound parameter must be one of the$SND_ALIAS_* values.(See MSDN for more information)',
      },
      {
        label: '$hInstance',
        documentation:
          '**[optional]** Handle to the executable file that contains the resource to be loaded. If $iFlags does notcontain the $SND_RESOURCE, this parameter will be ignored.',
      },
    ],
  },
  _WinAPI_PlgBlt: {
    documentation:
      'Performs a bit-block transfer of color data from the specified rectangle in the source DC to the specified parallelogram in the DC context',
    label:
      '_WinAPI_PlgBlt ( $hDestDC, Const ByRef $aPoint, $hSrcDC, $iXSrc, $iYSrc, $iWidth, $iHeight [, $hMask = 0 [, $iXMask = 0 [, $iYMask = 0]]] )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], [x3, y3]) that identify three corners of the destination parallelogram.The upper-left corner of the source rectangle is mapped to the first point in this array, the upper-rightcorner to the second point in this array, and the lower-left corner to the third point. The lower-rightcorner of the source rectangle is mapped to the implicit fourth point in the parallelogram.',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context.',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of the source rectangle.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of the source rectangle.',
      },
      {
        label: '$hMask',
        documentation:
          '**[optional]** Handle to the monochrome bitmap that is used to mask the colors of the source rectangle.',
      },
      {
        label: '$iXMask',
        documentation:
          '**[optional]** The x-coordinate, in logical units, of the upper-left corner of the monochrome bitmap. Default is 0.',
      },
      {
        label: '$iYMask',
        documentation:
          '**[optional]** The y-coordinate, in logical units, of the upper-left corner of the monochrome bitmap. Default is 0.',
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
  _WinAPI_PolyBezier: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezier ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the endpoints and control points of thecurve(s), in logical units. The number of points must be one more than three times the number of curvesto be drawn, because each Bezier curve requires two control points and an endpoint, and the initialcurve requires an additional starting point.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_PolyBezierTo: {
    documentation: 'Draws one or more Bezier curves',
    label: '_WinAPI_PolyBezierTo ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the endpoints and control points of thecurve(s), in logical units. The number of points must be three times the number of curves to be drawn,because each Bezier curve requires two control points and an ending point.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_PolyDraw: {
    documentation: 'Draws a set of line segments and Bezier curves',
    label: '_WinAPI_PolyDraw ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1, type1], [x2, y2, type2], ... [xN, yN, typeN]) that contains the endpoints foreach line segment and the endpoints and control points for each Bezier curve, in logical units. In addition,the array contains a parameters that specifies how each point is used. The third parameter of the arraycan be one of the following values.$PT_BEZIERTO$PT_LINETO$PT_MOVETO$PT_BEZIERTO or $PT_LINETO type can be combined with the following value that the corresponding pointis the last point in a figure and the figure is closed.$PT_CLOSEFIGURE',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start drawing at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop drawing at.',
      },
    ],
  },
  _WinAPI_Polygon: {
    documentation: 'Draws a polygon consisting of two or more vertices connected by straight lines',
    label: '_WinAPI_Polygon ( $hDC, Const ByRef $aPoint [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1], [x2, y2], ... [xN, yN]) that contains the vertices of the polygon in logicalunits. The polygon is closed automatically by drawing a line from the last vertex to the first.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start creating at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop creating at.',
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
  _WinAPI_PrintDlg: {
    documentation: 'Displays a Print dialog box',
    label: '_WinAPI_PrintDlg ( ByRef $tPRINTDLG )',
    params: [
      {
        label: '$tPRINTDLG',
        documentation:
          "$tagPRINTDLG structure that contains information used to initialize the dialog box. When the functionreturns, it contains information about the user's selections. This structure must be initializedbefore function call.(See MSDN for more information)",
      },
    ],
  },
  _WinAPI_PrintDlgEx: {
    documentation:
      'Displays a Print property sheet that enables the user to specify the properties of a particular print job',
    label: '_WinAPI_PrintDlgEx ( ByRef $tPRINTDLGEX )',
    params: [
      {
        label: '$tPRINTDLGEX',
        documentation:
          "$tagPRINTDLGEX structure that contains information used to initialize the property sheet. When thefunction returns, it contains information about the user's selections. This structure must beinitialized before function call.(See MSDN for more information)",
      },
    ],
  },
  _WinAPI_PrintWindow: {
    documentation: 'Copies a visual window into the specified device context',
    label: '_WinAPI_PrintWindow ( $hWnd, $hDC [, $bClient = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that will be copied.',
      },
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$bClient',
        documentation:
          '**[optional]** Specifies whether copies only the client area of the window, valid values:    True - Only the client area of the window is copied to device context.    False - The entire window is copied (Default).',
      },
    ],
  },
  _WinAPI_ProgIDFromCLSID: {
    documentation: 'Retrieves the ProgID for a given CLSID',
    label: '_WinAPI_ProgIDFromCLSID ( $sCLSID )',
    params: [
      {
        label: '$sCLSID',
        documentation: 'The string that represents the CLSID for which ProgID is to be retrieved.',
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
  _WinAPI_PtInRectEx: {
    documentation: 'Determines whether the specified point lies within the specified rectangle',
    label: '_WinAPI_PtInRectEx ( $iX, $iY, $iLeft, $iTop, $iRight, $iBottom )',
    params: [
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point.',
      },
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
  _WinAPI_PtInRegion: {
    documentation: 'Determines whether the specified point is inside the specified region',
    label: '_WinAPI_PtInRegion ( $hRgn, $iX, $iY )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region to be examined.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the point in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the point in logical units.',
      },
    ],
  },
  _WinAPI_PtVisible: {
    documentation: 'Determines whether the specified point is within the clipping region',
    label: '_WinAPI_PtVisible ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the point.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the point.',
      },
    ],
  },
  _WinAPI_QueryDosDevice: {
    documentation: 'Retrieves the current mapping for a particular MS-DOS device name',
    label: '_WinAPI_QueryDosDevice ( $sDevice )',
    params: [
      {
        label: '$sDevice',
        documentation: 'The name of the MS-DOS device.',
      },
    ],
  },
  _WinAPI_QueryInformationJobObject: {
    documentation: 'Retrieves limit and job state information from the job object',
    label:
      '_WinAPI_QueryInformationJobObject ( $hJob, $iJobObjectInfoClass, ByRef $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job whose information is being queried. The handle must have the$JOB_OBJECT_QUERY access right. If this value is 0 and the calling process is associatedwith a job, the job associated with the calling process is used.',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation:
          'The information class for the limits to be queried. This parameter specifies the typeof $tJobObjectInfo structure, valid values:1 - $tagJOBOBJECT_BASIC_ACCOUNTING_INFORMATION2 - $tagJOBOBJECT_BASIC_LIMIT_INFORMATION3 - $tagJOBOBJECT_BASIC_PROCESS_ID_LIST4 - $tagJOBOBJECT_BASIC_UI_RESTRICTIONS5 - $tagJOBOBJECT_SECURITY_LIMIT_INFORMATION8 - $tagJOBOBJECT_BASIC_AND_IO_ACCOUNTING_INFORMATION9 - $tagJOBOBJECT_EXTENDED_LIMIT_INFORMATION11 - $tagJOBOBJECT_GROUP_INFORMATION',
      },
      {
        label: '$tJobObjectInfo',
        documentation:
          '$tagJOBOBJECT_* structure (see above) that retrieves the limit and job state information.This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_QueryPerformanceCounter: {
    documentation: 'Retrieves the current value of the high-resolution performance counter',
    label: '_WinAPI_QueryPerformanceCounter (  )',
    params: [],
  },
  _WinAPI_QueryPerformanceFrequency: {
    documentation: 'Retrieves the frequency of the high-resolution performance counter',
    label: '_WinAPI_QueryPerformanceFrequency (  )',
    params: [],
  },
  _WinAPI_RadialGradientFill: {
    documentation: 'Fills radial gradient',
    label:
      '_WinAPI_RadialGradientFill ( $hDC, $iX, $iY, $iRadius, $iRGB1, $iRGB2 [, $fAngleStart = 0 [, $fAngleEnd = 360 [, $fStep = 5]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the central point, in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the central point, in logical units.',
      },
      {
        label: '$iRadius',
        documentation: 'The circle radius to filling the gradient.',
      },
      {
        label: '$iRGB1',
        documentation: 'The color information at the central point.',
      },
      {
        label: '$iRGB2',
        documentation: 'The color information at the edges of circle.',
      },
      {
        label: '$fAngleStart',
        documentation: '**[optional]** The angle to start filling at, in degree. Default is 0.',
      },
      {
        label: '$fAngleEnd',
        documentation: '**[optional]** The angle to end filling at, in degree. Default is 360.',
      },
      {
        label: '$fStep',
        documentation:
          "**[optional]** The gradient filling step in degree. The larger value of this parameter, the gradient will bebetter, but it's require more time, and vice versa. Default is 5.",
      },
    ],
  },
  _WinAPI_ReadDirectoryChanges: {
    documentation:
      'Retrieves information that describes the changes within the specified directory',
    label:
      '_WinAPI_ReadDirectoryChanges ( $hDirectory, $iFilter, $pBuffer, $iLength [, $bSubtree = 0] )',
    params: [
      {
        label: '$hDirectory',
        documentation:
          'A handle to the directory to be monitored. This directory must be opened with the $FILE_LIST_DIRECTORY access right.',
      },
      {
        label: '$iFilter',
        documentation:
          'The filter criteria that the function checks to determine if the wait operation has completed.This parameter can be one or more of the following values.    $FILE_NOTIFY_CHANGE_FILE_NAME    $FILE_NOTIFY_CHANGE_DIR_NAME    $FILE_NOTIFY_CHANGE_ATTRIBUTES    $FILE_NOTIFY_CHANGE_SIZE    $FILE_NOTIFY_CHANGE_LAST_WRITE    $FILE_NOTIFY_CHANGE_LAST_ACCESS    $FILE_NOTIFY_CHANGE_CREATION    $FILE_NOTIFY_CHANGE_SECURITY',
      },
      {
        label: '$pBuffer',
        documentation:
          'A pointer to the DWORD-aligned formatted buffer that internally used by this function to retrieve the data.To create a buffer, you can use _WinAPI_CreateBuffer() function.To prevent the crash of the script, use the buffer at least not less than 64 KB.If the buffer is greater than 64 KB and the application is monitoring a directory over the network, the function fails.This is due to a packet size limitation with the underlying file sharing protocols.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
      },
      {
        label: '$bSubtree',
        documentation:
          '**[optional]** Specifies whether to monitor the subdirectories of the specified directory, valid values:True - Monitor the directory tree rooted at the specified directory.False - Monitor only the specified directory (Default).',
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
  _WinAPI_Rectangle: {
    documentation: 'Draws a rectangle',
    label: '_WinAPI_Rectangle ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the logical coordinates of the rectangle.',
      },
    ],
  },
  _WinAPI_RectInRegion: {
    documentation:
      'Determines whether any part of the specified rectangle is within the boundaries of a region',
    label: '_WinAPI_RectInRegion ( $hRgn, $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the rectangle in logical units.',
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
  _WinAPI_RectVisible: {
    documentation:
      'Determines whether any part of the specified rectangle lies within the clipping region',
    label: '_WinAPI_RectVisible ( $hDC, $tRECT )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the logical coordinates of the specified rectangle.',
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
  _WinAPI_RegCloseKey: {
    documentation: 'Closes a handle to the specified registry key',
    label: '_WinAPI_RegCloseKey ( $hKey [, $bFlush = False] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the open key to be closed. The handle must have been opened by the _WinAPI_RegCreateKey()or _WinAPI_RegOpenKey() function.',
      },
      {
        label: '$bFlush',
        documentation:
          "**[optional]** Specifies whether writes all the attributes of the specified registry key into the registry, valid values:    True - Write changes to disk before close the handle.    False - Don't write (Default).",
      },
    ],
  },
  _WinAPI_RegConnectRegistry: {
    documentation: 'Establishes a connection to a predefined registry key on another computer',
    label: '_WinAPI_RegConnectRegistry ( $sComputer, $hKey )',
    params: [
      {
        label: '$sComputer',
        documentation:
          'The name of the remote computer. The string has the form as "\\\\computername". The caller musthave access to the remote computer or the function fails. If this parameter is 0, the localcomputer name is used.',
      },
      {
        label: '$hKey',
        documentation:
          'The predefined registry handle. This parameter can be one of the following predefined keyson the remote computer.$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegCopyTree: {
    documentation:
      'Recursively copies the subkeys and values of the source subkey to the destination key',
    label: '_WinAPI_RegCopyTree ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation: 'Handle to the source key or one of the predefined registry keys ($HKEY_*).',
      },
      {
        label: '$sSrcSubKey',
        documentation: 'The subkey whose subkeys and values are to be copied.',
      },
      {
        label: '$hDestKey',
        documentation: 'Handle to the destination key.',
      },
    ],
  },
  _WinAPI_RegCopyTreeEx: {
    documentation:
      'Copies the specified registry key, along with its values and subkeys, to the specified destination key',
    label: '_WinAPI_RegCopyTreeEx ( $hSrcKey, $sSrcSubKey, $hDestKey )',
    params: [
      {
        label: '$hSrcKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_READ access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can beone of the predefined registry keys ($HKEY_*).',
      },
      {
        label: '$sSrcSubKey',
        documentation:
          'The name of the key. This key must be a subkey of the key identified by the $hSrcKey parameter.',
      },
      {
        label: '$hDestKey',
        documentation:
          'Handle to the destination key. The calling process must have $KEY_CREATE_SUB_KEY access to the key.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can beone of the predefined registry keys ($HKEY_*).',
      },
    ],
  },
  _WinAPI_RegCreateKey: {
    documentation: 'Creates the specified registry key',
    label:
      "_WinAPI_RegCreateKey ( $hKey [, $sSubKey = '' [, $iAccess = $KEY_ALL_ACCESS [, $iOptions = 0 [, $tSecurity = 0]]]] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. If the key already exists, the function opens it. The calling processmust have $KEY_CREATE_SUB_KEY access to the key. This handle is returned by the _WinAPI_RegCreateKey()or _WinAPI_RegOpenKey() function, or it can be one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of a subkey that this function opens or creates. The subkey specified must be a subkey ofthe key identified by the $hKey parameter; it can be up to 32 levels deep in the registry tree.If an empty string (Default), the return is a new handle to the key specified by $hKey.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The mask that specifies the access rights for the key.This parameter can be one or more of the following values.$KEY_ALL_ACCESS$KEY_CREATE_LINK$KEY_CREATE_SUB_KEY$KEY_ENUMERATE_SUB_KEYS$KEY_EXECUTE$KEY_NOTIFY$KEY_QUERY_VALUE$KEY_READ$KEY_SET_VALUE$KEY_WOW64_32KEY$KEY_WOW64_64KEY$KEY_WRITE',
      },
      {
        label: '$iOptions',
        documentation:
          '**[optional]** This parameter can be one of the following values.$REG_OPTION_BACKUP_RESTORE$REG_OPTION_CREATE_LINK$REG_OPTION_NON_VOLATILE (Default)$REG_OPTION_VOLATILE',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines whether the returned handle can be inherited bychild processes. If this parameter is 0 (Default), the handle cannot be inherited.',
      },
    ],
  },
  _WinAPI_RegDeleteEmptyKey: {
    documentation: 'Deletes an empty key',
    label: "_WinAPI_RegDeleteEmptyKey ( $hKey [, $sSubKey = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key, or any of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the key to delete.',
      },
    ],
  },
  _WinAPI_RegDeleteKey: {
    documentation: 'Deletes a subkey and its values',
    label: "_WinAPI_RegDeleteKey ( $hKey [, $sSubKey = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The access rights of this key do not affect the delete operation.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can beone of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to be deleted. It must be a subkey of the key that $hKey identifies, but itcannot have subkeys.',
      },
    ],
  },
  _WinAPI_RegDeleteKeyValue: {
    documentation: 'Removes the specified value from the specified registry key and subkey',
    label: '_WinAPI_RegDeleteKeyValue ( $hKey, $sSubKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can beone of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          'The name of the registry key. This key must be a subkey of the key identified by the $hKey parameter.',
      },
      {
        label: '$sValueName',
        documentation: 'The registry value to be removed from the key.',
      },
    ],
  },
  _WinAPI_RegDeleteTree: {
    documentation: 'Deletes a subkey and all its descendants',
    label: "_WinAPI_RegDeleteTree ( $hKey [, $sSubKey = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key, or any of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the key to delete.',
      },
    ],
  },
  _WinAPI_RegDeleteTreeEx: {
    documentation: 'Deletes the subkeys and values of the specified key recursively',
    label: '_WinAPI_RegDeleteTreeEx ( $hKey [, $sSubKey = 0] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the following access rights:$DELETE, $KEY_ENUMERATE_SUB_KEYS, and $KEY_QUERY_VALUE. This handle is returned by the _WinAPI_RegCreateKey()or _WinAPI_RegOpenKey() function, or it can be one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to delete. This key must be a subkey of the key identified by the $hKey parameter.If this parameter is not specified (Default), the subkeys and values of $hKey are deleted.',
      },
    ],
  },
  _WinAPI_RegDeleteValue: {
    documentation: 'Removes a named value from the specified registry key',
    label: '_WinAPI_RegDeleteValue ( $hKey, $sValueName )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function, or it can beone of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The registry value to be removed. If this parameter is empty string, the key's unnamed or defaultvalue is removed.",
      },
    ],
  },
  _WinAPI_RegDisableReflectionKey: {
    documentation: 'Disables registry reflection for the specified key',
    label: '_WinAPI_RegDisableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey()function; it cannot specify a key on a remote computer. If the key is not on the reflection list,the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegDuplicateHKey: {
    documentation: "Duplicates a registry key's handle",
    label: '_WinAPI_RegDuplicateHKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key to be duplicated.',
      },
    ],
  },
  _WinAPI_RegEnableReflectionKey: {
    documentation: 'Restores registry reflection for the specified disabled key',
    label: '_WinAPI_RegEnableReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey()function; it cannot specify a key on a remote computer. If the key is not on the reflection list,the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegEnumKey: {
    documentation: 'Enumerates the subkeys of the specified open registry key',
    label: '_WinAPI_RegEnumKey ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_ENUMERATE_SUB_KEYS accessright. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function.It can also be one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the subkey to retrieve. This parameter should be zero for the first call to the _WinAPI_RegEnumKey()function and then incremented for subsequent calls.',
      },
    ],
  },
  _WinAPI_RegEnumValue: {
    documentation: 'Enumerates the values for the specified open registry key',
    label: '_WinAPI_RegEnumValue ( $hKey, $iIndex )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the value to be retrieved. This parameter should be zero for the first call to the _WinAPI_RegEnumValue()function and then be incremented for subsequent calls.',
      },
    ],
  },
  _WinAPI_RegFlushKey: {
    documentation: 'Writes all the attributes of the specified open registry key into the registry',
    label: '_WinAPI_RegFlushKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegisterApplicationRestart: {
    documentation: 'Registers the active instance of an application for restart',
    label: "_WinAPI_RegisterApplicationRestart ( [$iFlags = 0 [, $sCmd = '']] )",
    params: [
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies an events when application will not be restarted. This parameter can be0 or one or more of the following values.$RESTART_NO_CRASH$RESTART_NO_HANG$RESTART_NO_PATCH$RESTART_NO_REBOOT',
      },
      {
        label: '$sCmd',
        documentation:
          '**[optional]** The command-line arguments for the application when it is restarted. The maximum size of the commandline that you can specify is 2048 characters. If this parameter is empty string (Default), the previouslyregistered command line is removed.',
      },
    ],
  },
  _WinAPI_RegisterClass: {
    documentation: 'Registers a window class',
    label: '_WinAPI_RegisterClass ( $tWNDCLASS )',
    params: [
      {
        label: '$tWNDCLASS',
        documentation: '$tagWNDCLASS structure.',
      },
    ],
  },
  _WinAPI_RegisterClassEx: {
    documentation: 'Registers a window class',
    label: '_WinAPI_RegisterClassEx ( $tWNDCLASSEX )',
    params: [
      {
        label: '$tWNDCLASSEX',
        documentation: '$tagWNDCLASSEX structure.',
      },
    ],
  },
  _WinAPI_RegisterHotKey: {
    documentation: 'Defines a system-wide hot key',
    label: '_WinAPI_RegisterHotKey ( $hWnd, $iID, $iModifiers, $vKey )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that will receive WM_HOTKEY messages generated by the hot key. If this parameteris 0, WM_HOTKEY messages are posted to the message queue of the calling thread and must be processed inthe message loop.',
      },
      {
        label: '$iID',
        documentation:
          'Specifies the identifier of the hot key. An application must specify an id value in the range0x0000 through 0xBFFF.',
      },
      {
        label: '$iModifiers',
        documentation:
          'Specifies keys that must be pressed in combination with the key specified by the $vKey parameterin order to generate the WM_HOTKEY message.The $iModifiers parameter can be a combination of the following values.    $MOD_ALT    $MOD_CONTROL    $MOD_SHIFT    $MOD_WINWindows 7 or later    $MOD_NOREPEAT',
      },
      {
        label: '$vKey',
        documentation: 'Specifies the virtual-key code of the hot key ($VK_*).',
      },
    ],
  },
  _WinAPI_RegisterPowerSettingNotification: {
    documentation:
      'Registers the application to receive power setting notifications for the specific power setting event',
    label: '_WinAPI_RegisterPowerSettingNotification ( $hWnd, $sGUID )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that receives the change or notification messages.',
      },
      {
        label: '$sGUID',
        documentation:
          'The string that represents a GUID of the power setting for which notifications are to be sent.It may be one of the following values.$GUID_ACDC_POWER_SOURCE$GUID_BATTERY_PERCENTAGE_REMAINING$GUID_IDLE_BACKGROUND_TASK$GUID_MONITOR_POWER_ON$GUID_POWERSCHEME_PERSONALITY$GUID_SYSTEM_AWAYMODE',
      },
    ],
  },
  _WinAPI_RegisterRawInputDevices: {
    documentation: 'Registers the devices that supply the raw input data',
    label: '_WinAPI_RegisterRawInputDevices ( $paDevice [, $iCount = 1] )',
    params: [
      {
        label: '$paDevice',
        documentation:
          'A pointer to an array of $tagRAWINPUTDEVICE structures that represent the devices that supply the raw input.',
      },
      {
        label: '$iCount',
        documentation: '**[optional]** The number of entries in the array. Default is 1.',
      },
    ],
  },
  _WinAPI_RegisterShellHookWindow: {
    documentation:
      'Registers a specified Shell window to receive certain messages for events or notifications',
    label: '_WinAPI_RegisterShellHookWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to register for Shell hook messages.',
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
  _WinAPI_RegLoadMUIString: {
    documentation: 'Loads the specified string from the specified key and subkey',
    label: "_WinAPI_RegLoadMUIString ( $hKey, $sValueName [, $sDirectory = ''] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation: 'The name of the registry value.',
      },
      {
        label: '$sDirectory',
        documentation: '**[optional]** The directory path.',
      },
    ],
  },
  _WinAPI_RegNotifyChangeKeyValue: {
    documentation:
      'Notifies the caller about changes to the attributes or contents of a specified registry key',
    label:
      '_WinAPI_RegNotifyChangeKeyValue ( $hKey, $iFilter [, $bSubtree = False [, $bAsync = False [, $hEvent = 0]]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_NOTIFY access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$iFilter',
        documentation:
          'Indicates the changes that should be reported. This parameter can be one or more of the following values.$REG_NOTIFY_CHANGE_NAME$REG_NOTIFY_CHANGE_ATTRIBUTES$REG_NOTIFY_CHANGE_LAST_SET$REG_NOTIFY_CHANGE_SECURITY',
      },
      {
        label: '$bSubtree',
        documentation:
          '**[optional]** Specifies whether report changes in the subkeys of the specified key, valid values:    True - The function reports changes in the specified key and all its subkeys.    False - The function reports changes only in the specified key (Default).',
      },
      {
        label: '$bAsync',
        documentation:
          '**[optional]** Specifies whether return immediately, valid values:    True  - The function returns immediately and reports changes by signaling the specified event.    False - The function does not return until a change has occurred (Default).',
      },
      {
        label: '$hEvent',
        documentation:
          '**[optional]** Handle to an event. If the $fAsync parameter is True, the function returns immediately and changes arereported by signaling this event, otherwise this parameter is ignored (Default).',
      },
    ],
  },
  _WinAPI_RegOpenKey: {
    documentation: 'Opens the specified registry key',
    label: "_WinAPI_RegOpenKey ( $hKey [, $sSubKey = '' [, $iAccess = 0x000F003F]] )",
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey()function, or it can be one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation: '**[optional]** The name of the registry subkey to be opened (see remarks).',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** A mask that specifies the desired access rights to the key. The function fails if the securitydescriptor of the key does not permit the requested access for the calling process. This parametercan be one or more of the $KEY_* constants. Default is $KEY_ALL_ACCESS.',
      },
    ],
  },
  _WinAPI_RegQueryInfoKey: {
    documentation: 'Retrieves information about the specified registry key',
    label: '_WinAPI_RegQueryInfoKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegQueryLastWriteTime: {
    documentation: 'Retrieves information about the last write time to the specified registry key',
    label: '_WinAPI_RegQueryLastWriteTime ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
    ],
  },
  _WinAPI_RegQueryMultipleValues: {
    documentation:
      'Retrieves the type and data for a list of value names associated with an open registry key',
    label:
      '_WinAPI_RegQueryMultipleValues ( $hKey, ByRef $aValent, ByRef $pBuffer [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function.It can also be one of the following predefined keys :    $HKEY_CLASSES_ROOT    $HKEY_CURRENT_CONFIG    $HKEY_CURRENT_USER    $HKEY_LOCAL_MACHINE    $HKEY_PERFORMANCE_DATA    $HKEY_USERS',
      },
      {
        label: '$aValent',
        documentation:
          'The 2D array ([valuename1, *, *, *], ... [valuenameN, *, *, *]) that contains a value names to be retrieved.On input, 1, 2, and 3 array elements are not used, but array dimensions should be [n][4], otherwise the function fails.Also, this function fails if any of the specified values do not exist in the specified registry key.',
      },
      {
        label: '$pBuffer',
        documentation:
          'A pointer to a memory buffer that contains a registry data. Typically, you should not use this buffer directly (see remarks).',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start querying at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop querying at.',
      },
    ],
  },
  _WinAPI_RegQueryReflectionKey: {
    documentation:
      'Determines whether reflection has been disabled or enabled for the specified key',
    label: '_WinAPI_RegQueryReflectionKey ( $hKey )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey()function; it cannot specify a key on a remote computer. If the key is not on the reflection list,the function succeeds but has no effect.',
      },
    ],
  },
  _WinAPI_RegQueryValue: {
    documentation:
      'Retrieves the type and data for the specified value name associated with an open registry key',
    label: '_WinAPI_RegQueryValue ( $hKey, $sValueName, ByRef $tValueData )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the KEY_QUERY_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_PERFORMANCE_NLSTEXT$HKEY_PERFORMANCE_TEXT$HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The name of the registry value. If $sValueName is empty string, the function retrieves the type anddata for the key's unnamed or default value, if any.",
      },
      {
        label: '$tValueData',
        documentation:
          'The structure (buffer) that receives the value data. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_RegRestoreKey: {
    documentation:
      'Reads the registry information in a specified file and copies it over the specified key',
    label: '_WinAPI_RegRestoreKey ( $hKey, $sFilePath )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey()function. It can also be one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_USERS',
      },
      {
        label: '$sFilePath',
        documentation:
          'The name of the file with the registry information. This file is typically created byusing the _WinAPI_RegSaveKey() function.',
      },
    ],
  },
  _WinAPI_RegSaveKey: {
    documentation:
      'Saves the specified key and all of its subkeys and values to a new file, in the standard format',
    label: '_WinAPI_RegSaveKey ( $hKey, $sFilePath [, $bReplace = False [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hKey',
        documentation: 'Handle to an open registry key.',
      },
      {
        label: '$sFilePath',
        documentation:
          'The name of the file in which the specified key and subkeys are to be saved.',
      },
      {
        label: '$bReplace',
        documentation:
          '**[optional]** Specifies whether to replace the file if it already exists, valid values:    True - The function attempts to replace the existing file.    False - The function fails if the file already exists (Default).',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new file. If thisparameter is 0 (Default), the file gets a default security descriptor.',
      },
    ],
  },
  _WinAPI_RegSetValue: {
    documentation: 'Sets the data and type of a specified value under a registry key',
    label: '_WinAPI_RegSetValue ( $hKey, $sValueName, $iType, $tValueData, $iBytes )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to an open registry key. The key must have been opened with the $KEY_SET_VALUE access right.This handle is returned by the _WinAPI_RegCreateKey() or _WinAPI_RegOpenKey() function. It can alsobe one of the following predefined keys.$HKEY_CLASSES_ROOT$HKEY_CURRENT_CONFIG$HKEY_CURRENT_USER$HKEY_LOCAL_MACHINE$HKEY_PERFORMANCE_DATA$HKEY_USERS',
      },
      {
        label: '$sValueName',
        documentation:
          "The name of the value to be set. If a value with this name is not already present in the key,the function adds it to the key. If $sValueName is empty string, the function sets the type anddata for the key's unnamed or default value.",
      },
      {
        label: '$iType',
        documentation:
          'The type of data. This parameter can be one of the following values.$REG_BINARY$REG_DWORD$REG_DWORD_BIG_ENDIAN$REG_DWORD_LITTLE_ENDIAN$REG_EXPAND_SZ$REG_LINK$REG_MULTI_SZ$REG_NONE$REG_QWORD$REG_QWORD_LITTLE_ENDIAN$REG_SZ',
      },
      {
        label: '$tValueData',
        documentation:
          'The structure (buffer) that contains the data to be stored. For string-based types, such as REG_SZ,the string must be null-terminated. With the REG_MULTI_SZ data type, the string must be terminatedwith two null characters. A backslash must be preceded by another backslash as an escape character.For example, specify "C:\\\\mydir\\\\myfile" to store the string "C:\\mydir\\myfile".',
      },
      {
        label: '$iBytes',
        documentation:
          'The size of the data, in bytes. If the data has the REG_SZ, REG_MULTI_SZ or REG_EXPAND_SZ type,this size includes any terminating null character or characters unless the data was storedwithout them.',
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
  _WinAPI_ReleaseMutex: {
    documentation: 'Releases ownership of the specified mutex object',
    label: '_WinAPI_ReleaseMutex ( $hMutex )',
    params: [
      {
        label: '$hMutex',
        documentation:
          'Handle to the mutex object. The _WinAPI_CreateMutex() or _WinAPI_OpenMutex() function returns this handle.',
      },
    ],
  },
  _WinAPI_ReleaseSemaphore: {
    documentation: 'Increases the count of the specified semaphore object by a specified amount',
    label: '_WinAPI_ReleaseSemaphore ( $hSemaphore [, $iIncrease = 1] )',
    params: [
      {
        label: '$hSemaphore',
        documentation:
          'Handle to the semaphore object. The _WinAPI_CreateSemaphore() or _WinAPI_OpenSemaphore() functionreturns this handle.',
      },
      {
        label: '$iIncrease',
        documentation:
          "**[optional]** The amount by which the semaphore object's current count is to be increased. The value must be greaterthan zero. If the specified amount would cause the semaphore's count to exceed the maximum count thatwas specified when the semaphore was created, the count is not changed and the function returns 0. Default is 1.",
      },
    ],
  },
  _WinAPI_ReleaseStream: {
    documentation: 'Releases a stream object',
    label: '_WinAPI_ReleaseStream ( $pStream )',
    params: [
      {
        label: '$pStream',
        documentation:
          'Pointer to the stream object previously created by a call to the _WinAPI_CreateStreamOnHGlobal() function.',
      },
    ],
  },
  _WinAPI_RemoveClipboardFormatListener: {
    documentation:
      'Removes the given window from the system-maintained clipboard format listener list',
    label: '_WinAPI_RemoveClipboardFormatListener ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to be removed.',
      },
    ],
  },
  _WinAPI_RemoveDirectory: {
    documentation: 'Deletes an existing empty directory',
    label: '_WinAPI_RemoveDirectory ( $sDirPath )',
    params: [
      {
        label: '$sDirPath',
        documentation: 'The path of the empty directory to be removed.',
      },
    ],
  },
  _WinAPI_RemoveFontMemResourceEx: {
    documentation: 'Removes the fonts added from a memory image',
    label: '_WinAPI_RemoveFontMemResourceEx ( $hFont )',
    params: [
      {
        label: '$hFont',
        documentation:
          'Handle to the font-resource. This handle is returned by the _WinAPI_AddFontMemResourceEx() function.',
      },
    ],
  },
  _WinAPI_RemoveFontResourceEx: {
    documentation: 'Removes the fonts in the specified file from the system font table',
    label: '_WinAPI_RemoveFontResourceEx ( $sFont [, $iFlag = 0 [, $bNotify = False]] )',
    params: [
      {
        label: '$sFont',
        documentation:
          'String that names a font resource file. To remove a font whose information comes from several resourcefiles, they must be separated by a "|". For example, abcxxxxx.pfm|abcxxxxx.pfb.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The characteristics of the font to be removed from the system. In order for the font to be removed, the flagsused must be the same as when the font was added with the _WinAPI_AddFontResourceEx() function.',
      },
      {
        label: '$bNotify',
        documentation:
          "**[optional]** Specifies whether sends a WM_FONTCHANGE message, valid values:    True - Send the WM_FONTCHANGE message to all top-level windows after changing the pool of font resources.    False - Don't send (Default).",
      },
    ],
  },
  _WinAPI_RemoveWindowSubclass: {
    documentation: 'Removes a subclass callback from a window',
    label: '_WinAPI_RemoveWindowSubclass ( $hWnd, $pSubclassProc, $idSubClass )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window being subclassed.',
      },
      {
        label: '$pSubclassProc',
        documentation:
          'A pointer to a window procedure. This pointer and the subclass ID uniquely identify this subclass callback.(See MSDN for more information)',
      },
      {
        label: '$idSubClass',
        documentation: 'The subclass ID.',
      },
    ],
  },
  _WinAPI_ReOpenFile: {
    documentation:
      'Reopens the specified file system object with different access rights, sharing mode, and flags',
    label: '_WinAPI_ReOpenFile ( $hFile, $iAccess, $iShare [, $iFlags = 0] )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the object to be reopened. The object must have been created by the _WinAPI_CreateFileEx() function.',
      },
      {
        label: '$iAccess',
        documentation:
          'The required access to the object. If this parameter is 0, the application can query device attributeswithout accessing the device.$GENERIC_READ$GENERIC_WRITE(See MSDN for more information)',
      },
      {
        label: '$iShare',
        documentation:
          'The sharing mode of the object. If this parameter is 0, the object cannot be shared and cannot beopened again until the handle is closed.$FILE_SHARE_READ$FILE_SHARE_WRITE$FILE_SHARE_DELETE',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The file or device attributes and flags. This parameter can be one or more of the following values.$FILE_FLAG_BACKUP_SEMANTICS$FILE_FLAG_DELETE_ON_CLOSE$FILE_FLAG_NO_BUFFERING$FILE_FLAG_OPEN_NO_RECALL$FILE_FLAG_OPEN_REPARSE_POINT$FILE_FLAG_OVERLAPPED$FILE_FLAG_POSIX_SEMANTICS$FILE_FLAG_RANDOM_ACCESS$FILE_FLAG_SEQUENTIAL_SCAN$FILE_FLAG_WRITE_THROUGH$SECURITY_ANONYMOUS$SECURITY_CONTEXT_TRACKING$SECURITY_DELEGATION$SECURITY_EFFECTIVE_ONLY$SECURITY_IDENTIFICATION$SECURITY_IMPERSONATION',
      },
    ],
  },
  _WinAPI_ReplaceFile: {
    documentation:
      'Replaces one file with another file, and creates a backup copy of the original file',
    label:
      "_WinAPI_ReplaceFile ( $sReplacedFile, $sReplacementFile [, $sBackupFile = '' [, $iFlags = 0]] )",
    params: [
      {
        label: '$sReplacedFile',
        documentation: 'The name of the file to be replaced.',
      },
      {
        label: '$sReplacementFile',
        documentation: 'The name of the file that will replace the $sReplacedFile file.',
      },
      {
        label: '$sBackupFile',
        documentation:
          '**[optional]** The name of the file that will serve as a backup copy of the $sReplacedFile file. If thisparameter is empty string, no backup file is created.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The replacement options. This parameter can be one or more of the following values.$REPLACEFILE_WRITE_THROUGH$REPLACEFILE_IGNORE_MERGE_ERRORS$REPLACEFILE_IGNORE_ACL_ERRORS',
      },
    ],
  },
  _WinAPI_ReplaceTextDlg: {
    documentation:
      'Creates a system-defined modeless dialog box that lets the user specify a string to search for and a replacement string',
    label:
      "_WinAPI_ReplaceTextDlg ( $hOwner [, $sFindWhat = '' [, $sReplaceWith = '' [, $iFlags = 0 [, $pReplaceProc = 0 [, $lParam = 0]]]]] )",
    params: [
      {
        label: '$hOwner',
        documentation:
          'A handle to the window that owns the dialog box.The window procedure of the specified window receives FINDMSGSTRING messages from the dialog box.This parameter can be any valid window handle, but it must not be 0.',
      },
      {
        label: '$sFindWhat',
        documentation:
          '**[optional]** The search string that is displayed when you initialize the dialog box.',
      },
      {
        label: '$sReplaceWith',
        documentation:
          '**[optional]** The replacement string that is displayed when you initialize the dialog box.',
      },
      {
        label: '$iFlags',
        documentation:
          "**[optional]** A set of bit flags that used to initialize the dialog box.The dialog box sets these flags when it sends the FINDMSGSTRING registered message to indicate the user's input.This parameter can be one or more of the following values:    $FR_DIALOGTERM    $FR_DOWN    $FR_ENABLEHOOK    $FR_ENABLETEMPLATE    $FR_ENABLETEMPLATEHANDLE    $FR_FINDNEXT    $FR_HIDEUPDOWN    $FR_HIDEMATCHCASE    $FR_HIDEWHOLEWORD    $FR_MATCHCASE    $FR_NOMATCHCASE    $FR_NOUPDOWN    $FR_NOWHOLEWORD    $FR_REPLACE    $FR_REPLACEALL    $FR_SHOWHELP    $FR_WHOLEWORD",
      },
      {
        label: '$pReplaceProc',
        documentation:
          '**[optional]** Pointer to an hook procedure that can process messages intended for the dialog box.This parameter is ignored unless the $FR_ENABLEHOOK flag is not set.(See MSDN for more information)',
      },
      {
        label: '$lParam',
        documentation:
          '**[optional]** Application-defined data that the system passes to the hook procedure.',
      },
    ],
  },
  _WinAPI_ResetEvent: {
    documentation: 'Sets the specified event object to the nonsignaled state',
    label: '_WinAPI_ResetEvent ( $hEvent )',
    params: [
      {
        label: '$hEvent',
        documentation:
          'Handle to the event object. The _WinAPI_CreateEvent() function returns this handle.',
      },
    ],
  },
  _WinAPI_RestartDlg: {
    documentation: 'Displays a dialog box that prompts the user to restart Microsoft Windows',
    label: "_WinAPI_RestartDlg ( [$sText = '' [, $iFlags = 2 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sText',
        documentation:
          '**[optional]** The text that displays in the dialog box which prompts the user.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify the type of shutdown.This parameter must include one of the following values.$EWX_LOGOFF$EWX_POWEROFF$EWX_REBOOT (Default)$EWX_SHUTDOWNThis parameter can optionally include the following values.$EWX_FORCE$EWX_FORCEIFHUNG',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to the parent window.',
      },
    ],
  },
  _WinAPI_RestoreDC: {
    documentation: 'Restores a device context (DC) to the specified state',
    label: '_WinAPI_RestoreDC ( $hDC, $iID )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the DC.',
      },
      {
        label: '$iID',
        documentation:
          'The saved state to be restored. If this parameter is positive, $DC represents a specific instance of thestate to be restored. If this parameter is negative, $DC represents an instance relative to the currentstate. For example, (-1) restores the most recently saved state.',
      },
    ],
  },
  _WinAPI_RGB: {
    documentation: 'Creates a RGB color value based on red, green, and blue components',
    label: '_WinAPI_RGB ( $iRed, $iGreen, $iBlue )',
    params: [
      {
        label: '$iRed',
        documentation: 'The intensity of the red color.',
      },
      {
        label: '$iGreen',
        documentation: 'The intensity of the green color.',
      },
      {
        label: '$iBlue',
        documentation: 'The intensity of the blue color.',
      },
    ],
  },
  _WinAPI_RotatePoints: {
    documentation: 'Rotates a points from the array by the specified angle',
    label:
      '_WinAPI_RotatePoints ( ByRef $aPoint, $iXC, $iYC, $fAngle [, $iStart = 0 [, $iEnd = -1]] )',
    params: [
      {
        label: '$aPoint',
        documentation:
          'The 2D array ([x1, y1, ...], [x2, y2, ...], ... [xN, yN, ...]). Every first two elements from thisarray specifies a point to be rotate. Other array elements (if any) do not change.',
      },
      {
        label: '$iXC',
        documentation:
          'The x-coordinates of the point on which there is a rotation, in logical units.',
      },
      {
        label: '$iYC',
        documentation:
          'The y-coordinates of the point on which there is a rotation, in logical units.',
      },
      {
        label: '$fAngle',
        documentation: 'The angle to rotate, in degree.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start rotating at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop rotating at.',
      },
    ],
  },
  _WinAPI_RoundRect: {
    documentation: 'Draws a rectangle with rounded corners',
    label: '_WinAPI_RoundRect ( $hDC, $tRECT, $iWidth, $iHeight )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tRECT',
        documentation: '$tagRECT structure that contains the logical coordinates of the rectangle.',
      },
      {
        label: '$iWidth',
        documentation:
          'The width, in logical coordinates, of the ellipse used to draw the rounded corners.',
      },
      {
        label: '$iHeight',
        documentation:
          'The height, in logical coordinates, of the ellipse used to draw the rounded corners.',
      },
    ],
  },
  _WinAPI_SaveDC: {
    documentation:
      'Saves the current state of the specified device context (DC) by copying data describing selected objects and graphic modes to a context stack',
    label: '_WinAPI_SaveDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the DC whose state is to be saved.',
      },
    ],
  },
  _WinAPI_SaveFileDlg: {
    documentation:
      'Creates a dialog box that lets the user specify the drive, directory, and name of a file to save',
    label:
      '_WinAPI_SaveFileDlg ( [$sTitle = "" [, $sInitDir = "" [, $sFilters = "" [, $iDefaultFilter = 0 [, $sDefaultFilePath = "" [, $sDefaultExt = "" [, $iFlags = 0 [, $iFlagsEx = 0 [, $pOFNProc = 0 [, $pData = 0 [, $hParent = 0]]]]]]]]]]] )',
    params: [
      {
        label: '$sTitle',
        documentation:
          '**[optional]** A string to be placed in the title bar of the dialog box.If this parameter is empty string (Default), the system uses the default title (that is, "Save As").',
      },
      {
        label: '$sInitDir',
        documentation: '**[optional]** The initial directory.',
      },
      {
        label: '$sFilters',
        documentation:
          '**[optional]** The pairs of filter strings (for example, "Text Files (*.txt)").To specify multiple filter patterns for a single display string, use a semicolon to separate the patterns (for example, "*.txt;*.doc;*.bak").Do not include spaces in the pattern. To specify multiple groups of filters, use the "|" character as a delimiter (for example, "Text Files (*.txt)|All Files (*.*)").If this parameter is omitted or an empty string (Default), the dialog box does not display any filters',
      },
      {
        label: '$iDefaultFilter',
        documentation:
          '**[optional]** The 1-based index of the currently selected filter to initialize the combo box control.',
      },
      {
        label: '$sDefaultFilePath',
        documentation: '**[optional]** The file name to initialize the edit control.',
      },
      {
        label: '$sDefaultExt',
        documentation:
          '**[optional]** The default extension that appends to the file name if the user fails to type an extension.This string can be any length, but only the first three characters are appended. The string should not contain a period (.).If this parameter is empty string (Default), no extension is appended.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A set of bit flags you can use to initialize the dialog box.This parameter can be 0 or combination of the following values:    $OFN_ALLOWMULTISELECT    $OFN_CREATEPROMPT    $OFN_DONTADDTORECENT    $OFN_ENABLEHOOK    $OFN_ENABLEINCLUDENOTIFY    $OFN_ENABLESIZING    $OFN_EXPLORER    $OFN_FORCESHOWHIDDEN    $OFN_HIDEREADONLY    $OFN_LONGNAMES    $OFN_NOCHANGEDIR    $OFN_NODEREFERENCELINKS    $OFN_NOLONGNAMES    $OFN_NONETWORKBUTTON    $OFN_NOREADONLYRETURN    $OFN_NOTESTFILECREATE    $OFN_NOVALIDATE    $OFN_OVERWRITEPROMPT    $OFN_PATHMUSTEXIST    $OFN_READONLY    $OFN_SHAREAWARE    $OFN_SHOWHELP',
      },
      {
        label: '$iFlagsEx',
        documentation:
          '**[optional]** A set of bit flags you can use to initialize the dialog box. It can be 0 or the following value:    $OFN_EX_NOPLACESBAR',
      },
      {
        label: '$pOFNProc',
        documentation:
          '**[optional]** A pointer to a hook procedure. This parameter is ignored unless the $OFN_ENABLEHOOK flag is set.',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** Application-defined pointer to data that the system passes to the hook procedure.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** A handle to the parent window for the dialog box.',
      },
    ],
  },
  _WinAPI_SaveHBITMAPToFile: {
    documentation: 'Saves a specified bitmap to the specified bitmap (.bmp) file',
    label:
      '_WinAPI_SaveHBITMAPToFile ( $sFilePath, $hBitmap [, $iXPelsPerMeter = Default [, $iYPelsPerMeter = Default]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the .bmp file in which to save the bitmap.',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to be save.',
      },
      {
        label: '$iXPelsPerMeter',
        documentation: '**[optional]** The horizontal resolution, in pixels-per-meter.',
      },
      {
        label: '$iYPelsPerMeter',
        documentation: '**[optional]** The vertical resolution, in pixels-per-meter.',
      },
    ],
  },
  _WinAPI_SaveHICONToFile: {
    documentation:
      'Saves a specified single or multiple icon (HICON) to the specified icon (.ico) file',
    label:
      '_WinAPI_SaveHICONToFile ( $sFilePath, Const ByRef $vIcon [, $bCompress = 0 [, $iStart = 0 [, $iEnd = -1]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the .ico file in which to save the icon.',
      },
      {
        label: '$vIcon',
        documentation: 'Handle to the icon or array of the icon handles to be save.',
      },
      {
        label: '$bCompress',
        documentation:
          '**[optional]** Specifies whether to use PNG compression for the 32 bits-per-pixel icons if its size exceed orequal to 256x256 pixels (262144 bytes), valid values:True - The icon will be saved as a PNG image.False - The icon will be saved directly (Default).',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start saving at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop saving at.',
      },
    ],
  },
  _WinAPI_ScaleWindowExt: {
    documentation:
      'Modifies the window for a device context using the ratios formed by the specified multiplicands and divisors',
    label: '_WinAPI_ScaleWindowExt ( $hDC, $iXNum, $iXDenom, $iYNum, $iYDenom )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXNum',
        documentation: 'The amount by which to multiply the current horizontal extent.',
      },
      {
        label: '$iXDenom',
        documentation: 'The amount by which to divide the current horizontal extent.',
      },
      {
        label: '$iYNum',
        documentation: 'The amount by which to divide the current vertical extent.',
      },
      {
        label: '$iYDenom',
        documentation: 'The amount by which to divide the current vertical extent.',
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
  _WinAPI_SearchPath: {
    documentation: 'Searches for a specified file in a specified path',
    label: "_WinAPI_SearchPath ( $sFilePath [, $sSearchPath = ''] )",
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file for which to search.',
      },
      {
        label: '$sSearchPath',
        documentation:
          '**[optional]** The path to be searched for the file. If this parameter is omitted or an empty string (Default), the functionsearches for a matching file using a registry-dependent system search path (see below).',
      },
    ],
  },
  _WinAPI_SelectClipPath: {
    documentation:
      'Selects the current path as a clipping region, combining the new region with any existing clipping region',
    label: '_WinAPI_SelectClipPath ( $hDC [, $iMode = 5] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context of the path.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The way to use the path. This parameter can be one of the following values.$RGN_AND$RGN_COPY (Default)$RGN_DIFF$RGN_OR$RGN_XOR',
      },
    ],
  },
  _WinAPI_SelectClipRgn: {
    documentation:
      'Selects a region as the current clipping region for the specified device context',
    label: '_WinAPI_SelectClipRgn ( $hDC, $hRgn )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$hRgn',
        documentation:
          "Handle to the region to be selected. To remove a device-context's clipping region, set this parameter to 0.",
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
  _WinAPI_SendMessageTimeout: {
    documentation: 'Sends the specified message to one of more windows',
    label:
      '_WinAPI_SendMessageTimeout ( $hWnd, $iMsg [, $wParam = 0 [, $lParam = 0 [, $iTimeout = 1000 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose window procedure will receive the message.',
      },
      {
        label: '$iMsg',
        documentation: 'The message to be sent.',
      },
      {
        label: '$wParam',
        documentation: '**[optional]** The message-specific information.',
      },
      {
        label: '$lParam',
        documentation: '**[optional]** The message-specific information.',
      },
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** The duration, in milliseconds, of the time-out period. If the message is a broadcast message, eachwindow can use the full time-out period. Default is 1000.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies how to send the message.This parameter can be one or more of the following values.$SMTO_BLOCK$SMTO_NORMAL$SMTO_ABORTIFHUNG$SMTO_NOTIMEOUTIFNOTHUNG$SMTO_ERRORONEXIT',
      },
    ],
  },
  _WinAPI_SetActiveWindow: {
    documentation: 'Activates the specified window',
    label: '_WinAPI_SetActiveWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the top-level window to be activated.',
      },
    ],
  },
  _WinAPI_SetArcDirection: {
    documentation: 'Sets the drawing arc direction',
    label: '_WinAPI_SetArcDirection ( $hDC, $iDirection )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iDirection',
        documentation:
          'The new arc direction. This parameter can be one of the following values.$AD_COUNTERCLOCKWISE$AD_CLOCKWISE',
      },
    ],
  },
  _WinAPI_SetBitmapBits: {
    documentation: 'Sets the bits of color data for a bitmap to the specified values',
    label: '_WinAPI_SetBitmapBits ( $hBitmap, $iSize, $pBits )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap to be set. This must be a compatible bitmap (DDB).',
      },
      {
        label: '$iSize',
        documentation: 'The number of bytes pointed to by the $pBits parameter.',
      },
      {
        label: '$pBits',
        documentation:
          'A pointer to an array of bytes that contain color data for the specified bitmap.',
      },
    ],
  },
  _WinAPI_SetBitmapDimensionEx: {
    documentation: 'Assigns preferred dimensions to a compatible bitmap',
    label: '_WinAPI_SetBitmapDimensionEx ( $hBitmap, $iWidth, $iHeight )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap. This bitmap cannot be a DIB-section bitmap.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in 0.1-millimeter units, of the bitmap.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in 0.1-millimeter units, of the bitmap.',
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
  _WinAPI_SetBoundsRect: {
    documentation:
      'Controls the accumulation of bounding rectangle information for the specified device context',
    label: '_WinAPI_SetBoundsRect ( $hDC, $iFlags [, $tRECT = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context for which to accumulate bounding rectangles.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specifies how the new rectangle will be combined with the accumulated rectangle.This parameter can be one of more of the following values.$DCB_ACCUMULATE$DCB_DISABLE$DCB_ENABLE$DCB_RESET',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure used to set the bounding rectangle in logical coordinates.',
      },
    ],
  },
  _WinAPI_SetBrushOrg: {
    documentation:
      'Sets the brush origin that GDI assigns to the next brush an application selects into the specified device context',
    label: '_WinAPI_SetBrushOrg ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in device units, of the new brush origin.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in device units, of the new brush origin.',
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
  _WinAPI_SetCaretBlinkTime: {
    documentation: 'Sets the caret blink time',
    label: '_WinAPI_SetCaretBlinkTime ( $iDuration )',
    params: [
      {
        label: '$iDuration',
        documentation:
          'The new blink time, in milliseconds. If this parameter is (-1), caret does not blink.',
      },
    ],
  },
  _WinAPI_SetCaretPos: {
    documentation: 'Moves the caret to the specified coordinates',
    label: '_WinAPI_SetCaretPos ( $iX, $iY )',
    params: [
      {
        label: '$iX',
        documentation: 'The new x-coordinate of the caret.',
      },
      {
        label: '$iY',
        documentation: 'The new y-coordinate of the caret.',
      },
    ],
  },
  _WinAPI_SetClassLongEx: {
    documentation: 'Replaces the specified value into the specified window belongs',
    label: '_WinAPI_SetClassLongEx ( $hWnd, $iIndex, $iNewLong )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
      {
        label: '$iIndex',
        documentation:
          'The value to be replaced. This parameter can be one of the following values.$GCL_CBCLSEXTRA$GCL_CBWNDEXTRA$GCL_HBRBACKGROUND$GCL_HCURSOR$GCL_HICON$GCL_HICONSM$GCL_HMODULE$GCL_MENUNAME$GCL_STYLE$GCL_WNDPROC',
      },
      {
        label: '$iNewLong',
        documentation: 'The replacement value.',
      },
    ],
  },
  _WinAPI_SetColorAdjustment: {
    documentation: 'Sets the color adjustment for a device context (DC)',
    label: '_WinAPI_SetColorAdjustment ( $hDC, $tAdjustment )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
      {
        label: '$tAdjustment',
        documentation: '$tagCOLORADJUSTMENT structure containing the color adjustment values.',
      },
    ],
  },
  _WinAPI_SetCompression: {
    documentation: 'Sets the compression state of a file or directory',
    label: '_WinAPI_SetCompression ( $sFilePath, $iCompression )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the file or directory to be compressed.',
      },
      {
        label: '$iCompression',
        documentation:
          'The compression state. This parameter can be one of the following values.$COMPRESSION_FORMAT_NONE$COMPRESSION_FORMAT_DEFAULT$COMPRESSION_FORMAT_LZNT1',
      },
    ],
  },
  _WinAPI_SetCurrentDirectory: {
    documentation: 'Changes the current directory for the current process',
    label: '_WinAPI_SetCurrentDirectory ( $sDir )',
    params: [
      {
        label: '$sDir',
        documentation: 'The path to the new current directory.',
      },
    ],
  },
  _WinAPI_SetCurrentProcessExplicitAppUserModelID: {
    documentation:
      'Specifies a unique application-defined Application User Model ID that identifies the current process to the taskbar',
    label: '_WinAPI_SetCurrentProcessExplicitAppUserModelID ( $sAppID )',
    params: [
      {
        label: '$sAppID',
        documentation:
          'The string that represents an Application User Model ID (AppUserModelID). This identifier allows anapplication to group its associated processes and windows under a single taskbar button. An applicationmust provide its AppUserModelID in the following form and can have no more than 128 characters andcannot contain spaces.CompanyName.ProductName.SubProduct.VersionInformation(See MSDN for more information)',
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
  _WinAPI_SetDCBrushColor: {
    documentation: 'Sets the current device context (DC) brush color to the specified color value',
    label: '_WinAPI_SetDCBrushColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iRGB',
        documentation: 'The new brush color, in RGB.',
      },
    ],
  },
  _WinAPI_SetDCPenColor: {
    documentation: 'Sets the current device context (DC) pen color to the specified color value',
    label: '_WinAPI_SetDCPenColor ( $hDC, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iRGB',
        documentation: 'The new pen color, in RGB.',
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
  _WinAPI_SetDeviceGammaRamp: {
    documentation:
      'Sets the gamma ramp on direct color display boards that support downloadable gamma ramps in hardware',
    label: '_WinAPI_SetDeviceGammaRamp ( $hDC, Const ByRef $aRamp )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context of the direct color display board in question.',
      },
      {
        label: '$aRamp',
        documentation:
          'The 2D array ([r1, g1, b1], [r2, g2, b2], ... [r256, g256, b256]) that contains the gamma ramp to be set.Each element in this array is an integer value with a range from 0 to 65535 which is a mapping betweenRGB values in the frame buffer and digital-analog-converter (DAC) values. The RGB values must be storedin the most significant bits of each WORD to increase DAC independence.(See MSDN for more information)',
      },
    ],
  },
  _WinAPI_SetDIBColorTable: {
    documentation: 'Sets RGB color table in the DIB section bitmap',
    label: '_WinAPI_SetDIBColorTable ( $hBitmap, $tColorTable, $iColorCount )',
    params: [
      {
        label: '$hBitmap',
        documentation: 'A DIB section bitmap in which to set the color table.',
      },
      {
        label: '$tColorTable',
        documentation: '"dword[n]" structure that represents a DIB color table that to be set.',
      },
      {
        label: '$iColorCount',
        documentation: 'The number of color table entries to set.',
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
  _WinAPI_SetDIBitsToDevice: {
    documentation: 'Sets the pixels in the specified rectangle on the device',
    label:
      '_WinAPI_SetDIBitsToDevice ( $hDC, $iXDest, $iYDest, $iWidth, $iHeight, $iXSrc, $iYSrc, $iStartScan, $iScanLines, $tBITMAPINFO, $iUsage, $pBits )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidth',
        documentation: 'The width, in logical units, of the image.',
      },
      {
        label: '$iHeight',
        documentation: 'The height, in logical units, of the image.',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate, in logical units, of the lower-left corner of the image.',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate, in logical units, of the lower-left corner of the image.',
      },
      {
        label: '$iStartScan',
        documentation: 'The starting scan line in the image.',
      },
      {
        label: '$iScanLines',
        documentation: 'The number of DIB scan lines.',
      },
      {
        label: '$tBITMAPINFO',
        documentation: '$tagBITMAPINFO structure that contains information about the DIB.',
      },
      {
        label: '$iUsage',
        documentation:
          'The type of colors used. (either logical palette indexes or literal RGB values).The following values are defined:    $DIB_PAL_COLORS    $DIB_RGB_COLORS',
      },
      {
        label: '$pBits',
        documentation: 'A pointer to the color data stored as an array of bytes.',
      },
    ],
  },
  _WinAPI_SetDllDirectory: {
    documentation: 'Adds a directory to the search path used to locate DLLs for the application',
    label: '_WinAPI_SetDllDirectory ( [$sDirPath = Default] )',
    params: [
      {
        label: '$sDirPath',
        documentation:
          '**[optional]** The directory to be added to the search path. If this parameter is an empty string (""), the callremoves the current directory from the default DLL search order. If this parameter is not specified,the function restores the default search order (Default).',
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
  _WinAPI_SetEnhMetaFileBits: {
    documentation: 'Creates a memory-based enhanced-format metafile from the specified data',
    label: '_WinAPI_SetEnhMetaFileBits ( $pData, $iLength )',
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the enhanced-metafile data. To obtain the metafile data, call the_WinAPI_GetEnhMetaFileBits() function.',
      },
      {
        label: '$iLength',
        documentation: 'The size of the buffer, in bytes.',
      },
    ],
  },
  _WinAPI_SetErrorMode: {
    documentation:
      'Controls whether the system will handle the specified types of serious errors or whether the process will handle them',
    label: '_WinAPI_SetErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The process error mode. This parameter can be one or more of the following values.$SEM_FAILCRITICALERRORS$SEM_NOALIGNMENTFAULTEXCEPT$SEM_NOGPFAULTERRORBOX$SEM_NOOPENFILEERRORBOX',
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
  _WinAPI_SetFileAttributes: {
    documentation: 'Sets the attributes for a file or directory',
    label: '_WinAPI_SetFileAttributes ( $sFilePath, $iAttributes )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file or directory whose attributes are to be set.',
      },
      {
        label: '$iAttributes',
        documentation:
          'The file attributes to set for the file. This parameter can be one or more of the following values.$FILE_ATTRIBUTE_READONLY$FILE_ATTRIBUTE_HIDDEN$FILE_ATTRIBUTE_SYSTEM$FILE_ATTRIBUTE_ARCHIVE$FILE_ATTRIBUTE_NORMAL$FILE_ATTRIBUTE_TEMPORARY$FILE_ATTRIBUTE_OFFLINE$FILE_ATTRIBUTE_NOT_CONTENT_INDEXED',
      },
    ],
  },
  _WinAPI_SetFileInformationByHandleEx: {
    documentation: 'Sets the file information for the specified file',
    label: '_WinAPI_SetFileInformationByHandleEx ( $hFile, $tFILEINFO )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file for which to change information. This handle must have an appropriatepermissions for the requested change.',
      },
      {
        label: '$tFILEINFO',
        documentation: '$tagFILEINFO structure that contains the information to change.',
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
  _WinAPI_SetFilePointerEx: {
    documentation: 'Moves the file pointer of the specified file',
    label: '_WinAPI_SetFilePointerEx ( $hFile, $iPos [, $iMethod = 0] )',
    params: [
      {
        label: '$hFile',
        documentation: 'Handle to the file.',
      },
      {
        label: '$iPos',
        documentation:
          'The number of bytes to move the file pointer. A positive value moves the pointer forward in thefile and a negative value moves the file pointer backward.',
      },
      {
        label: '$iMethod',
        documentation:
          '**[optional]** The starting point for the file pointer move. This parameter can be one of the following values.$FILE_BEGIN (Default)$FILE_CURRENT$FILE_END',
      },
    ],
  },
  _WinAPI_SetFileShortName: {
    documentation: 'Sets the short name for the specified file',
    label: '_WinAPI_SetFileShortName ( $hFile, $sShortName )',
    params: [
      {
        label: '$hFile',
        documentation:
          'A handle to the file. The file must be on an NTFS file system volume. Also, the file must beopened with either the $GENERIC_ALL access right or $GENERIC_WRITE|$DELETE, and with the$FILE_FLAG_BACKUP_SEMANTICS file attribute.',
      },
      {
        label: '$sShortName',
        documentation:
          'The valid short name for the file. If the specified short name already exists, the functionfails and the last error code is ERROR_ALREADY_EXISTS (183).',
      },
    ],
  },
  _WinAPI_SetFileValidData: {
    documentation: 'Sets the valid data length of the specified file',
    label: '_WinAPI_SetFileValidData ( $hFile, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation:
          'A handle to the file. This file must have been opened with the $GENERIC_WRITE access right, and the$SE_MANAGE_VOLUME_NAME privilege enabled. The file cannot be a network file, or be compressed,sparse, or transacted.',
      },
      {
        label: '$iLength',
        documentation:
          'The new valid data length. This parameter must be a positive value that is greater than the currentvalid data length, but less than the current file size.',
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
  _WinAPI_SetForegroundWindow: {
    documentation: 'Puts the specified window into the foreground and activates its',
    label: '_WinAPI_SetForegroundWindow ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that should be activated and brought to the foreground.',
      },
    ],
  },
  _WinAPI_SetFRBuffer: {
    documentation:
      'Sets the size of the internal buffer that used the _WinAPI_FindTextDlg() and _WinAPI_ReplaceTextDlg() functions',
    label: '_WinAPI_SetFRBuffer ( $iChars )',
    params: [
      {
        label: '$iChars',
        documentation:
          'The size, in TCHARs, of the internal buffer. The buffer should be at least 80 characters long.The default buffer size is 16384 wide characters (32 KB).',
      },
    ],
  },
  _WinAPI_SetGraphicsMode: {
    documentation: 'Sets the graphics mode for the specified device context',
    label: '_WinAPI_SetGraphicsMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The graphics mode. This parameter can be one of the following values.$GM_COMPATIBLE$GM_ADVANCED',
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
  _WinAPI_SetInformationJobObject: {
    documentation: 'Sets limits for a job object',
    label: '_WinAPI_SetInformationJobObject ( $hJob, $iJobObjectInfoClass, $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job whose limits are being set. The handle must have the$JOB_OBJECT_SET_ATTRIBUTES access right.',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation:
          'The information class for the limits to be set. This parameter specifies the typeof $tJobObjectInfo structure, valid values:2 - $tagJOBOBJECT_BASIC_LIMIT_INFORMATION4 - $tagJOBOBJECT_BASIC_UI_RESTRICTIONS5 - $tagJOBOBJECT_SECURITY_LIMIT_INFORMATION6 - $tagJOBOBJECT_END_OF_JOB_TIME_INFORMATION7 - $tagJOBOBJECT_ASSOCIATE_COMPLETION_PORT9 - $tagJOBOBJECT_EXTENDED_LIMIT_INFORMATION11 - $tagJOBOBJECT_GROUP_INFORMATION',
      },
      {
        label: '$tJobObjectInfo',
        documentation: '$tagJOBOBJECT_* structure that sets the limit and job state information.',
      },
    ],
  },
  _WinAPI_SetKeyboardLayout: {
    documentation: 'Sets an input locale identifier to the specified window',
    label: '_WinAPI_SetKeyboardLayout ( $hWnd, $iLanguage [, $iFlags = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to set input locale identifier.',
      },
      {
        label: '$iLanguage',
        documentation:
          "The input locale identifier.0x0436 - Afrikaans0x041C - Albanian0x0401 - Arabic0x1401 - Arabic Algeria0x3C01 - Arabic Bahrain0x0C01 - Arabic Egypt0x0801 - Arabic Iraq0x2C01 - Arabic Jordan0x3401 - Arabic Kuwait0x3001 - Arabic Lebanon0x1001 - Arabic Libya0x1801 - Arabic Morocco0x2001 - Arabic Oman0x4001 - Arabic Qatar0x0401 - Arabic Saudi Arabia0x2801 - Arabic Syria0x1C01 - Arabic Tunisia0x3801 - Arabic U.A.E0x2401 - Arabic Yemen0x042B - Armenian0x044D - Assamese0x082C - Azeri Cyrillic0x042C - Azeri Latin0x042D - Basque0x0813 - Belgian Dutch0x080C - Belgian French0x0445 - Bengali0x0416 - Portuguese (Brazil)0x0402 - Bulgarian0x0455 - Burmese0x0423 - Byelorussian (Belarusian)0x0403 - Catalan0x0C04 - Chinese Hong Kong SAR0x1404 - Chinese Macau SAR0x0804 - Chinese Simplified0x1004 - Chinese Singapore0x0404 - Chinese Traditional0x041A - Croatian0x0405 - Czech0x0406 - Danish0x0413 - Dutch0x0C09 - English Australia0x2809 - English Belize0x1009 - English Canadian0x2409 - English Caribbean0x1813 - English Ireland0x2009 - English Jamaica0x1409 - English New Zealand0x3409 - English Philippines0x1C09 - English South Africa0x2C09 - English Trinidad0x0809 - English U.K.0x0409 - English U.S.0x3009 - English Zimbabwe0x0425 - Estonian0x0438 - Faeroese0x0429 - Farsi0x040B - Finnish0x040C - French0x2C0C - French Cameroon0x0C0C - French Canadian0x300C - French Cote d'Ivoire0x140C - French Luxembourg0x340C - French Mali0x180C - French Monaco0x200C - French Reunion0x280C - French Senegal0x1C0C - French West Indies0x240C - French Congo (DRC)0x0462 - Frisian Netherlands0x083C - Gaelic Ireland0x043C - Gaelic Scotland0x0456 - Galician0x0437 - Georgian0x0407 - German0x0C07 - German Austria0x1407 - German Liechtenstein0x1007 - German Luxembourg0x0408 - Greek0x0447 - Gujarati0x040D - Hebrew0x0439 - Hindi0x040E - Hungarian0x040F - Icelandic0x0421 - Indonesian0x0410 - Italian0x0411 - Japanese0x044B - Kannada0x0460 - Kashmiri0x043F - Kazakh0x0453 - Khmer0x0440 - Kirghiz0x0457 - Konkani0x0412 - Korean0x0454 - Lao0x0426 - Latvian0x0427 - Lithuanian0x042F - FYRO Macedonian0x044C - Malayalam0x083E - Malay Brunei Darussalam0x043E - Malaysian0x043A - Maltese0x0458 - Manipuri0x044E - Marathi0x0450 - Mongolian0x0461 - Nepali0x0414 - Norwegian Bokmol0x0814 - Norwegian Nynorsk0x0448 - Oriya0x0415 - Polish0x0816 - Portuguese0x0446 - Punjabi0x0417 - Rhaeto-Romanic0x0418 - Romanian0x0818 - Romanian Moldova0x0419 - Russian0x0819 - Russian Moldova0x043B - Sami Lappish0x044F - Sanskrit0x0C1A - Serbian Cyrillic0x081A - Serbian Latin0x0430 - Sesotho0x0459 - Sindhi0x041B - Slovak0x0424 - Slovenian0x042E - Sorbian0x040A - Spanish (Traditional)0x2C0A - Spanish Argentina0x400A - Spanish Bolivia0x340A - Spanish Chile0x240A - Spanish Colombia0x140A - Spanish Costa Rica0x1C0A - Spanish Dominican Republic0x300A - Spanish Ecuador0x440A - Spanish El Salvador0x100A - Spanish Guatemala0x480A - Spanish Honduras0x4C0A - Spanish Nicaragua0x180A - Spanish Panama0x3C0A - Spanish Paraguay0x280A - Spanish Peru0x500A - Spanish Puerto Rico0x0C0A - Spanish Spain (Modern Sort)0x380A - Spanish Uruguay0x200A - Spanish Venezuela0x0430 - Sutu0x0441 - Swahili0x041D - Swedish0x081D - Swedish Finland0x100C - Swiss French0x0807 - Swiss German0x0810 - Swiss Italian0x0428 - Tajik0x0449 - Tamil0x0444 - Tatar0x044A - Telugu0x041E - Thai0x0451 - Tibetan0x0431 - Tsonga0x0432 - Tswana0x041F - Turkish0x0442 - Turkmen0x0422 - Ukrainian0x0420 - Urdu0x0843 - Uzbek Cyrillic0x0443 - Uzbek Latin0x0433 - Venda0x042A - Vietnamese0x0452 - Welsh0x0434 - Xhosa0x0435 - Zulu",
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The new input locale. This parameter can be one or more of the following values.$INPUTLANGCHANGE_BACKWARD$INPUTLANGCHANGE_FORWARD$INPUTLANGCHANGE_SYSCHARSET',
      },
    ],
  },
  _WinAPI_SetKeyboardState: {
    documentation:
      "Copies a 256-byte array of keyboard key states into the calling process's keyboard input-state table",
    label: '_WinAPI_SetKeyboardState ( $tState )',
    params: [
      {
        label: '$tState',
        documentation: '"byte[256]" structure that contains keyboard key states.',
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
  _WinAPI_SetLocaleInfo: {
    documentation: 'Sets an item of information in the user override portion of the current locale',
    label: '_WinAPI_SetLocaleInfo ( $iLCID, $iType, $sData )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
      {
        label: '$iType',
        documentation:
          'Type of locale information to set. This parameter can be one of the locale information constants ($LOCALE_*).',
      },
      {
        label: '$sData',
        documentation:
          'The string containing the locale information to set. The information must be in the format specific tothe specified constant.',
      },
    ],
  },
  _WinAPI_SetMapMode: {
    documentation: 'Sets the mapping mode of the specified device context',
    label: '_WinAPI_SetMapMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The new mapping mode. This parameter can be one of the following values.$MM_ANISOTROPIC$MM_HIENGLISH$MM_HIMETRIC$MM_ISOTROPIC$MM_LOENGLISH$MM_LOMETRIC$MM_TEXT$MM_TWIPS',
      },
    ],
  },
  _WinAPI_SetMessageExtraInfo: {
    documentation: 'Sets the extra message information for the current thread',
    label: '_WinAPI_SetMessageExtraInfo ( $lParam )',
    params: [
      {
        label: '$lParam',
        documentation: 'The value of lParam type to be associated with the current thread.',
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
  _WinAPI_SetPixel: {
    documentation: 'Sets the pixel at the specified coordinates to the specified color',
    label: '_WinAPI_SetPixel ( $hDC, $iX, $iY, $iRGB )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the point to be set.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the point to be set.',
      },
      {
        label: '$iRGB',
        documentation: 'The color to be used to paint the point.',
      },
    ],
  },
  _WinAPI_SetPolyFillMode: {
    documentation: 'Sets the polygon fill mode for functions that fill polygons',
    label: '_WinAPI_SetPolyFillMode ( $hDC [, $iMode = 1] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The new fill mode. This parameter can be one of the following values.$ALTERNATE (Default)$WINDING',
      },
    ],
  },
  _WinAPI_SetPriorityClass: {
    documentation: 'Sets the priority class for the specified process',
    label: '_WinAPI_SetPriorityClass ( $iPriority [, $iPID = 0] )',
    params: [
      {
        label: '$iPriority',
        documentation:
          'The priority class for the process. This parameter can be one of the following values.$ABOVE_NORMAL_PRIORITY_CLASS$BELOW_NORMAL_PRIORITY_CLASS$HIGH_PRIORITY_CLASS$IDLE_PRIORITY_CLASS$NORMAL_PRIORITY_CLASS$REALTIME_PRIORITY_CLASSWindows Vista or later$PROCESS_MODE_BACKGROUND_BEGIN$PROCESS_MODE_BACKGROUND_END',
      },
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
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
  _WinAPI_SetProcessShutdownParameters: {
    documentation:
      'Sets a shutdown order for a process relative to the other processes in the system',
    label: '_WinAPI_SetProcessShutdownParameters ( $iLevel [, $bDialog = False] )',
    params: [
      {
        label: '$iLevel',
        documentation:
          'The shutdown priority. The system shuts down processes from high $iLevel values to low. The highestand lowest shutdown priorities are reserved for system components.This parameter must be in the following range of values.0x0000-0x00FF - System reserved last shutdown range.0x0100-0x01FF - Application reserved last shutdown range.0x0200-0x02FF - Application reserved "in between" shutdown range.0x0300-0x03FF - Application reserved first shutdown range.0x0400-0x04FF - System reserved first shutdown range.All processes start at shutdown level 0x0280.',
      },
      {
        label: '$bDialog',
        documentation:
          '**[optional]** Specifies whether display a retry dialog box for the user, valid values:    True - Display a retry dialog box if process takes longer than the specified timeout to shutdown.    False - Directly terminates the process (Default).',
      },
    ],
  },
  _WinAPI_SetProcessWindowStation: {
    documentation: 'Assigns the specified window station to the calling process',
    label: '_WinAPI_SetProcessWindowStation ( $hStation )',
    params: [
      {
        label: '$hStation',
        documentation:
          'Handle to the window station. This window station must be associated with the current session.',
      },
    ],
  },
  _WinAPI_SetRectRgn: {
    documentation: 'Converts a region into a rectangular region with the specified coordinates',
    label: '_WinAPI_SetRectRgn ( $hRgn, $tRECT )',
    params: [
      {
        label: '$hRgn',
        documentation: 'Handle to the region.',
      },
      {
        label: '$tRECT',
        documentation:
          '$tagRECT structure that contains the coordinates of the rectangular region in logical units.',
      },
    ],
  },
  _WinAPI_SetROP2: {
    documentation: 'Retrieves the foreground mix mode of the specified device context',
    label: '_WinAPI_SetROP2 ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The mix mode. This parameter can be one of the following values.$R2_BLACK$R2_COPYPEN$R2_LAST$R2_MASKNOTPEN$R2_MASKPEN$R2_MASKPENNOT$R2_MERGENOTPEN$R2_MERGEPEN$R2_MERGEPENNOT$R2_NOP$R2_NOT$R2_NOTCOPYPEN$R2_NOTMASKPEN$R2_NOTMERGEPEN$R2_NOTXORPEN$R2_WHITE$R2_XORPEN',
      },
    ],
  },
  _WinAPI_SetSearchPathMode: {
    documentation:
      'Sets the per-process mode that the _WinAPI_SearchPath() function uses when locating files',
    label: '_WinAPI_SetSearchPathMode ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'The search mode to use. This parameter can be one of the following values.    $BASE_SEARCH_PATH_ENABLE_SAFE_SEARCHMODE    $BASE_SEARCH_PATH_DISABLE_SAFE_SEARCHMODEOptionaly, $BASE_SEARCH_PATH_ENABLE_SAFE_SEARCHMODE can be combined with the following flag to make thismode permanent for the current process.    $BASE_SEARCH_PATH_DISABLE_SAFE_SEARCHMODE cannot be combined with this flag.    $BASE_SEARCH_PATH_PERMANENT',
      },
    ],
  },
  _WinAPI_SetStretchBltMode: {
    documentation: 'Sets the bitmap stretching mode in the specified device context',
    label: '_WinAPI_SetStretchBltMode ( $hDC, $iMode )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          'The stretching mode. This parameter can be one of the following values.$BLACKONWHITE$COLORONCOLOR$HALFTONE$WHITEONBLACK$STRETCH_ANDSCANS$STRETCH_DELETESCANS$STRETCH_HALFTONE$STRETCH_ORSCANS',
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
  _WinAPI_SetSystemCursor: {
    documentation: 'Enables an application to customize the system cursors',
    label: '_WinAPI_SetSystemCursor ( $hCursor, $iID [, $bCopy = False] )',
    params: [
      {
        label: '$hCursor',
        documentation: 'Handle to a cursor.',
      },
      {
        label: '$iID',
        documentation:
          'This parameter specifies the system cursor to replace with the contents of $hCursor,and can be one of the following values.$OCR_NORMAL$OCR_IBEAM$OCR_WAIT$OCR_CROSS$OCR_UP$OCR_SIZE$OCR_ICON$OCR_SIZENWSE$OCR_SIZENESW$OCR_SIZEWE$OCR_SIZENS$OCR_SIZEALL$OCR_ICOCUR$OCR_NO$OCR_HAND$OCR_APPSTARTING$OCR_HELP',
      },
      {
        label: '$bCopy',
        documentation:
          '**[optional]** Specifies whether the cursor should be duplicated, valid values:    True - The cursor is duplicated.    False - The cursor is not duplicated (Default).',
      },
    ],
  },
  _WinAPI_SetTextAlign: {
    documentation: 'Sets the text-alignment flags for the specified device context',
    label: '_WinAPI_SetTextAlign ( $hDC [, $iMode = 0] )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iMode',
        documentation:
          '**[optional]** The text alignment by using a mask of the values in the following list. Only one flag can be chosenfrom those that affect horizontal and vertical alignment. In addition, only one of the two flags thatalter the current position can be chosen.$TA_BASELINE$TA_BOTTOM$TA_TOP (Default)$TA_CENTER$TA_LEFT (Default)$TA_RIGHT$TA_NOUPDATECP (Default)$TA_RTLREADING$TA_UPDATECPWhen the current font has a vertical default base line, as with Kanji, the following values must beused instead of $TA_BASELINE and $TA_CENTER.$VTA_BASELINE$VTA_CENTERThe default values are $TA_LEFT, $TA_TOP, and $TA_NOUPDATECP.',
      },
    ],
  },
  _WinAPI_SetTextCharacterExtra: {
    documentation: 'Sets the intercharacter spacing for the specified device context',
    label: '_WinAPI_SetTextCharacterExtra ( $hDC, $iCharExtra )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iCharExtra',
        documentation:
          'The amount of extra space, in logical units, to be added to each character.',
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
  _WinAPI_SetTextJustification: {
    documentation:
      'Specifies the amount of space the system should add to the break characters in a string of text',
    label: '_WinAPI_SetTextJustification ( $hDC, $iBreakExtra, $iBreakCount )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iBreakExtra',
        documentation: 'The total extra space, in logical units, to be added to the line of text.',
      },
      {
        label: '$iBreakCount',
        documentation: 'The number of break characters in the line.',
      },
    ],
  },
  _WinAPI_SetThreadDesktop: {
    documentation: 'Assigns the specified desktop to the calling thread',
    label: '_WinAPI_SetThreadDesktop ( $hDesktop )',
    params: [
      {
        label: '$hDesktop',
        documentation:
          'Handle to the desktop to be assigned to the calling thread. This desktop must be associated with thecurrent window station for the process.',
      },
    ],
  },
  _WinAPI_SetThreadErrorMode: {
    documentation:
      'Controls whether the system will handle the specified types of serious errors or whether the calling thread will handle them',
    label: '_WinAPI_SetThreadErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The thread error mode. This parameter can be one or more of the following values.    $SEM_FAILCRITICALERRORS    $SEM_NOGPFAULTERRORBOX    $SEM_NOOPENFILEERRORBOX',
      },
    ],
  },
  _WinAPI_SetThreadExecutionState: {
    documentation:
      'Prevents the system from entering sleep or turning off the display while the current application is running',
    label: '_WinAPI_SetThreadExecutionState ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation:
          "The thread's execution requirements. This parameter can be one or more of the following values.$ES_AWAYMODE_REQUIRED$ES_CONTINUOUS$ES_DISPLAY_REQUIRED$ES_SYSTEM_REQUIRED$ES_USER_PRESENT",
      },
    ],
  },
  _WinAPI_SetThreadLocale: {
    documentation: 'Sets the current locale of the calling thread',
    label: '_WinAPI_SetThreadLocale ( $iLCID )',
    params: [
      {
        label: '$iLCID',
        documentation:
          'The locale identifier (LCID) that specifies the locale or one of the following predefined values.$LOCALE_INVARIANT$LOCALE_SYSTEM_DEFAULT$LOCALE_USER_DEFAULTWindows Vista or later$LOCALE_CUSTOM_DEFAULT$LOCALE_CUSTOM_UI_DEFAULT$LOCALE_CUSTOM_UNSPECIFIED',
      },
    ],
  },
  _WinAPI_SetThreadUILanguage: {
    documentation: 'Sets the user interface language for the current thread',
    label: '_WinAPI_SetThreadUILanguage ( $iLanguage )',
    params: [
      {
        label: '$iLanguage',
        documentation: 'The language identifier for the user interface language.',
      },
    ],
  },
  _WinAPI_SetTimer: {
    documentation: 'Creates a timer with the specified time-out value',
    label: '_WinAPI_SetTimer ( $hWnd, $iTimerID, $iElapse, $pTimerFunc )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window to be associated with the timer. This window must be owned by the callingprocess. If a 0 value for $hWnd is passed in along with an $iTimerID of an existing timer, thattimer will be replaced in the same way that an existing non-zero $hWnd timer will be.',
      },
      {
        label: '$iTimerID',
        documentation:
          'The timer identifier. If the $hWnd parameter is 0, and the $iTimerID does not match an existingtimer then it is ignored and a new timer ID is generated. If the $hWnd parameter is not 0 andthe window specified by $hWnd already has a timer with the value $iTimerID, then the existingtimer is replaced by the new timer. When _WinAPI_SetTimer() replaces a timer, the timer is reset.Therefore, a message will be sent after the current time-out value elapses, but the previouslyset time-out value is ignored. If the call is not intended to replace an existing timer,$iTimerID should be 0 if the $hWnd is 0.',
      },
      {
        label: '$iElapse',
        documentation: 'The time-out value, in milliseconds.',
      },
      {
        label: '$pTimerFunc',
        documentation:
          'The address of a callback function to be notified when the time-out value elapses. If thisparameter is 0, the system posts a WM_TIMER message to the application queue.(See MSDN for more information)',
      },
    ],
  },
  _WinAPI_SetUDFColorMode: {
    documentation: 'Sets the color mode for the WinAPIEx library',
    label: '_WinAPI_SetUDFColorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The color mode. This parameter can be one of the following values.$UDF_BGR$UDF_RGB',
      },
    ],
  },
  _WinAPI_SetUserGeoID: {
    documentation: 'Sets the geographical location identifier for the user',
    label: '_WinAPI_SetUserGeoID ( $iGEOID )',
    params: [
      {
        label: '$iGEOID',
        documentation: 'The identifier for the geographical location of the user (GEOID).',
      },
    ],
  },
  _WinAPI_SetUserObjectInformation: {
    documentation: 'Sets information about the specified window station or desktop object',
    label: '_WinAPI_SetUserObjectInformation ( $hObject, $iIndex, $tData )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the window station or desktop object.',
      },
      {
        label: '$iIndex',
        documentation:
          'The object information to be set. This parameter can be one of the following values.$UOI_FLAGS',
      },
      {
        label: '$tData',
        documentation:
          'The data of the object information. The data type depends on the information type. For more information,see _WinAPI_GetUserObjectInformation() function.',
      },
    ],
  },
  _WinAPI_SetVolumeMountPoint: {
    documentation: 'Associates a volume with a drive letter or a directory on another volume',
    label: '_WinAPI_SetVolumeMountPoint ( $sFilePath, $sGUID )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The user-mode path to be associated with the volume. This may be a drive letter (for example, X:\\)or a directory on another volume (for example, Y:\\MountX).',
      },
      {
        label: '$sGUID',
        documentation:
          'The volume GUID path for the volume. This string must be of the form "\\\\?\\Volume{GUID}\\" whereGUID is a GUID that identifies the volume. The \\\\?\\ turns off path parsing and is ignored as partof the path.',
      },
    ],
  },
  _WinAPI_SetWindowDisplayAffinity: {
    documentation: 'Stores the display affinity setting in kernel mode on the specified window',
    label: '_WinAPI_SetWindowDisplayAffinity ( $hWnd, $iAffinity )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window.',
      },
      {
        label: '$iAffinity',
        documentation:
          "The display affinity setting. This setting specifies where the window's contents are can be displayed.Set this value to $WDA_MONITOR to display the window's contents only on a monitor.Set this value to $WDA_NONE to remove the monitor-only affinity.",
      },
    ],
  },
  _WinAPI_SetWindowExt: {
    documentation:
      'Sets the horizontal and vertical extents of the window for a device context by using the specified values',
    label: '_WinAPI_SetWindowExt ( $hDC, $iXExtent, $iYExtent )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iXExtent',
        documentation: "The window's horizontal extent in logical units.",
      },
      {
        label: '$iYExtent',
        documentation: "The window's vertical extent in logical units.",
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
  _WinAPI_SetWindowOrg: {
    documentation: 'Specifies which window point maps to the viewport origin (0,0)',
    label: '_WinAPI_SetWindowOrg ( $hDC, $iX, $iY )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate, in logical units, of the new window origin.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate, in logical units, of the new window origin.',
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
  _WinAPI_SetWindowSubclass: {
    documentation: 'Installs or updates a window subclass callback',
    label: '_WinAPI_SetWindowSubclass ( $hWnd, $pSubclassProc, $idSubClass [, $pData = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle of the window being subclassed.',
      },
      {
        label: '$pSubclassProc',
        documentation:
          'A pointer to a window procedure. This pointer and the subclass ID uniquely identify this subclass callback.(See MSDN for more information)',
      },
      {
        label: '$idSubClass',
        documentation: 'The subclass ID.',
      },
      {
        label: '$pData',
        documentation:
          '**[optional]** The reference data. This value is passed to the subclass procedure. The meaning of this value is determined by the calling application.',
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
  _WinAPI_SetWinEventHook: {
    documentation: 'Sets an event hook function for a range of events',
    label:
      '_WinAPI_SetWinEventHook ( $iEventMin, $iEventMax, $pEventProc [, $iPID = 0 [, $iThreadId = 0 [, $iFlags = 0]]] )',
    params: [
      {
        label: '$iEventMin',
        documentation:
          'The lowest event value in the range of events ($EVENT_*) that are handled by the hook function.',
      },
      {
        label: '$iEventMax',
        documentation:
          'The highest event value in the range of events ($EVENT_*) that are handled by the hook function.',
      },
      {
        label: '$pEventProc',
        documentation:
          'The address of an application-defined hook function that the system calls in response toevents generated by an accessible object.',
      },
      {
        label: '$iPID',
        documentation:
          '**[optional]** The ID of the process from which the hook function receives events. If this parameter is 0 (Default),the hook function is associated with all existing processes on the current desktop.',
      },
      {
        label: '$iThreadId',
        documentation:
          '**[optional]** The ID of the thread from which the hook function receives events. If this parameter is 0 (Default),the hook function is associated with all existing threads on the current desktop.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify the location of the hook function and of the events to be skipped.The following flags are valid:    $WINEVENT_INCONTEXT    $WINEVENT_OUTOFCONTEXT (Default)    $WINEVENT_SKIPOWNPROCESS    $WINEVENT_SKIPOWNTHREADThe following single flags, or flag combinations are valid:    $WINEVENT_INCONTEXT    $WINEVENT_OUTOFCONTEXT    $WINEVENT_INCONTEXT | $WINEVENT_SKIPOWNPROCESS    $WINEVENT_INCONTEXT | $WINEVENT_SKIPOWNTHREAD    $WINEVENT_OUTOFCONTEXT | $WINEVENT_SKIPOWNPROCESS    $WINEVENT_OUTOFCONTEXT | $WINEVENT_SKIPOWNTHREAD',
      },
    ],
  },
  _WinAPI_SetWorldTransform: {
    documentation:
      'Sets a two-dimensional linear transformation between world space and page space for the specified device context',
    label: '_WinAPI_SetWorldTransform ( $hDC, $tXFORM )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$tXFORM',
        documentation: '$tagXFORM structure that contains the transformation data.',
      },
    ],
  },
  _WinAPI_SfcIsFileProtected: {
    documentation: 'Determines whether the specified file is protected',
    label: '_WinAPI_SfcIsFileProtected ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The name of the file to test.',
      },
    ],
  },
  _WinAPI_SfcIsKeyProtected: {
    documentation: 'Determines whether the specified registry key is protected',
    label: '_WinAPI_SfcIsKeyProtected ( $hKey [, $sSubKey = Default [, $iFlag = 0]] )',
    params: [
      {
        label: '$hKey',
        documentation:
          'Handle to the root registry key, it must be one of the following predefined keys:    $HKEY_CLASSES_ROOT    $HKEY_CURRENT_USER    $HKEY_LOCAL_MACHINE    $HKEY_USERS',
      },
      {
        label: '$sSubKey',
        documentation:
          '**[optional]** The name of the key to test. This key must be a subkey of the key identified by the $hKey parameter.If this parameter is not specified (Default), the function only checks whether the root registry key is protected.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The flag that specifies the alternate registry view that should be used by applications that run on 64-bit Windows.This flag is ignored on the x86 platform. It can be one of the following values:    $KEY_WOW64_32KEY    $KEY_WOW64_64KEY',
      },
    ],
  },
  _WinAPI_ShellAboutDlg: {
    documentation: 'Displays a Windows About dialog box',
    label: '_WinAPI_ShellAboutDlg ( $sTitle, $sName, $sText [, $hIcon = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sTitle',
        documentation: 'The title of the Windows About dialog box.',
      },
      {
        label: '$sName',
        documentation: 'The first line after the text "Microsoft".',
      },
      {
        label: '$sText',
        documentation:
          'The text to be displayed in the dialog box after the version and copyright information.',
      },
      {
        label: '$hIcon',
        documentation:
          '**[optional]** Handle to the icon that the function displays in the dialog box.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle to a parent window.',
      },
    ],
  },
  _WinAPI_ShellAddToRecentDocs: {
    documentation: 'Adds a file to the most recently and frequently item list',
    label: '_WinAPI_ShellAddToRecentDocs ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The name of the file to be added. Set this parameter to empty string to clear all usage data on all items.',
      },
    ],
  },
  _WinAPI_ShellChangeNotify: {
    documentation: 'Notifies the system of an event that an application has performed',
    label: '_WinAPI_ShellChangeNotify ( $iEvent, $iFlags [, $iItem1 = 0 [, $iItem2 = 0]] )',
    params: [
      {
        label: '$iEvent',
        documentation:
          'Describes the event that has occurred. Typically, only one event is specified at a time. If more thanone event is specified, the values contained in the $iItem1 and $iItem2 parameters must be the same,respectively, for all specified events. This parameter can be one or more of the following values.$SHCNE_ALLEVENTS$SHCNE_ASSOCCHANGED$SHCNE_ATTRIBUTES$SHCNE_CREATE$SHCNE_DELETE$SHCNE_DRIVEADD$SHCNE_DRIVEADDGUI$SHCNE_DRIVEREMOVED$SHCNE_EXTENDED_EVENT$SHCNE_FREESPACE$SHCNE_MEDIAINSERTED$SHCNE_MEDIAREMOVED$SHCNE_MKDIR$SHCNE_NETSHARE$SHCNE_NETUNSHARE$SHCNE_RENAMEFOLDER$SHCNE_RENAMEITEM$SHCNE_RMDIR$SHCNE_SERVERDISCONNECT$SHCNE_UPDATEDIR$SHCNE_UPDATEIMAGE$SHCNE_UPDATEITEM$SHCNE_DISKEVENTS$SHCNE_GLOBALEVENTS$SHCNE_INTERRUPT(See MSDN for more information)',
      },
      {
        label: '$iFlags',
        documentation:
          'Flags that indicate the meaning of the $iItem1 and $iItem2 parameters. This parameter must be oneof the following values.$SHCNF_DWORD$SHCNF_IDLIST$SHCNF_PATH$SHCNF_PRINTER$SHCNF_FLUSH$SHCNF_FLUSHNOWAIT$SHCNF_NOTIFYRECURSIVE(See MSDN for more information)',
      },
      {
        label: '$iItem1',
        documentation: '**[optional]** First event-dependent value. Default is 0.',
      },
      {
        label: '$iItem2',
        documentation: '**[optional]** Second event-dependent value. Default is 0.',
      },
    ],
  },
  _WinAPI_ShellChangeNotifyDeregister: {
    documentation: "Unregisters the client's window",
    label: '_WinAPI_ShellChangeNotifyDeregister ( $iID )',
    params: [
      {
        label: '$iID',
        documentation:
          'The value that specifies the registration ID returned by _WinAPI_ShellChangeNotifyRegister().',
      },
    ],
  },
  _WinAPI_ShellChangeNotifyRegister: {
    documentation: 'Registers a window to receive notifications from the file system or Shell',
    label:
      '_WinAPI_ShellChangeNotifyRegister ( $hWnd, $iMsg, $iEvents, $iSources, $aPaths [, $bRecursive = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window that receives the change or notification messages.',
      },
      {
        label: '$iMsg',
        documentation: 'Message to be posted to the window procedure.',
      },
      {
        label: '$iEvents',
        documentation:
          'Change notification events for which to receive notification. This parameter can be one or moreof the $SHCNE_* values.',
      },
      {
        label: '$iSources',
        documentation:
          'One or more of the following values that indicate the type of events for which to receivenotifications.$SHCNRF_INTERRUPTLEVEL$SHCNRF_SHELLLEVEL$SHCNRF_RECURSIVEINTERRUPT$SHCNRF_NEWDELIVERY',
      },
      {
        label: '$aPaths',
        documentation:
          'Single path or array of paths for which to receive notifications. These names should befully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$bRecursive',
        documentation:
          "**[optional]** Specifies whether to post notifications for children paths in $aPaths parameter, valid values:    True - Notifications would come from the folder's children.    False  - Notifications would come from the specified folder's only (Default).",
      },
    ],
  },
  _WinAPI_ShellCreateDirectory: {
    documentation: 'Creates a new file system folder',
    label: '_WinAPI_ShellCreateDirectory ( $sFilePath [, $hParent = 0 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The fully qualified path of the directory.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** A handle to a parent window.',
      },
      {
        label: '$tSecurity',
        documentation:
          "**[optional]** $tagSECURITY_ATTRIBUTES structure with the directory's security attribute. If this parameter is 0 (Default),no security attributes are set.",
      },
    ],
  },
  _WinAPI_ShellEmptyRecycleBin: {
    documentation: 'Empties the Recycle Bin on the specified drive',
    label: "_WinAPI_ShellEmptyRecycleBin ( [$sRoot = '' [, $iFlags = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The string that contains the path of the root drive on which the Recycle Bin is located. This stringcan be formatted with the drive, folder, and subfolder names, for example "c:\\windows\\system\\".If this parameter is empty string (Default), all Recycle Bins on all drives will be emptied.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be one or more of the following values.$SHERB_NOCONFIRMATION$SHERB_NOPROGRESSUI$SHERB_NOSOUND$SHERB_NO_UI',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the parent window of any dialog boxes that might be displayed during the operation.',
      },
    ],
  },
  _WinAPI_ShellExecute: {
    documentation: 'Performs an operation on a specified file',
    label:
      "_WinAPI_ShellExecute ( $sFilePath [, $sArgs = '' [, $sDir = '' [, $sVerb = '' [, $iShow = 1 [, $hParent = 0]]]]] )",
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The string that specifies the file or object on which to execute the specified verb. Note that not allverbs are supported on all objects. For example, not all document types support the "print" verb.',
      },
      {
        label: '$sArgs',
        documentation:
          '**[optional]** The string that specifies the parameters to be passed to the application.',
      },
      {
        label: '$sDir',
        documentation:
          '**[optional]** The string that specifies the working directory for the action.',
      },
      {
        label: '$sVerb',
        documentation:
          '**[optional]** The string, referred to as a verb, that specifies the action to be performed. The set of available verbsdepends on the particular file or folder. Generally, the actions available from an object\'s shortcutmenu are available verbs. The following verbs are commonly used:"edit""explore""find""open""edit""print"',
      },
      {
        label: '$iShow',
        documentation:
          '**[optional]** The flags that specify how an application is to be displayed when it is opened ($SW_*).',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the owner window used for displaying a UI or error messages.',
      },
    ],
  },
  _WinAPI_ShellExecuteEx: {
    documentation: 'Performs an operation on a specified file',
    label: '_WinAPI_ShellExecuteEx ( ByRef $tSHEXINFO )',
    params: [
      {
        label: '$tSHEXINFO',
        documentation:
          '$tagSHELLEXECUTEINFO structure that contains and receives information about the application being executed.',
      },
    ],
  },
  _WinAPI_ShellExtractAssociatedIcon: {
    documentation: "Returns a handle to the icon that associated with the specified file's",
    label: '_WinAPI_ShellExtractAssociatedIcon ( $sFilePath [, $bSmall = False] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The full path and file name of the file that contains the icon, or its extension, such as ".txt".',
      },
      {
        label: '$bSmall',
        documentation:
          '**[optional]** Specifies whether to extract a small icon, valid values:    True - Extract a small icon.    False - Extract a large icon (Default).',
      },
    ],
  },
  _WinAPI_ShellExtractIcon: {
    documentation: 'Extracts the icon with the specified dimension from the specified file',
    label: '_WinAPI_ShellExtractIcon ( $sIcon, $iIndex, $iWidth, $iHeight )',
    params: [
      {
        label: '$sIcon',
        documentation: 'Path and name of the file from which the icon are to be extracted.',
      },
      {
        label: '$iIndex',
        documentation:
          'The 0-based index of the icon to extract. If this value is a negative number, the function extractsthe icon whose resource identifier is equal to the absolute value of $iIndex.',
      },
      {
        label: '$iWidth',
        documentation: 'Horizontal icon size wanted.',
      },
      {
        label: '$iHeight',
        documentation: 'Vertical icon size wanted.',
      },
    ],
  },
  _WinAPI_ShellFileOperation: {
    documentation: 'Copies, moves, renames, or deletes a file system object',
    label:
      "_WinAPI_ShellFileOperation ( $sFrom, $sTo, $iFunc, $iFlags [, $sTitle = '' [, $hParent = 0]] )",
    params: [
      {
        label: '$sFrom',
        documentation:
          'Single string or array of string that contains the source file name(s). These names should befully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$sTo',
        documentation:
          'Single string or array of string that contains the destination file or directory name(s) (if used).These names should be fully-qualified paths to prevent unexpected results.',
      },
      {
        label: '$iFunc',
        documentation:
          'A value that indicates which operation to perform. This parameter can be one of the following values.$FO_COPY$FO_DELETE$FO_MOVE$FO_RENAME',
      },
      {
        label: '$iFlags',
        documentation:
          'Flags that control the file operation. This parameter can be one of the following values.$FOF_ALLOWUNDO$FOF_CONFIRMMOUSE$FOF_FILESONLY$FOF_MULTIDESTFILES$FOF_NOCONFIRMATION$FOF_NOCONFIRMMKDIR$FOF_NO_CONNECTED_ELEMENTS$FOF_NOCOPYSECURITYATTRIBS$FOF_NOERRORUI$FOF_NORECURSEREPARSE$FOF_NORECURSION$FOF_RENAMEONCOLLISION$FOF_SILENT$FOF_SIMPLEPROGRESS$FOF_WANTMAPPINGHANDLE$FOF_WANTNUKEWARNING$FOF_NO_UI',
      },
      {
        label: '$sTitle',
        documentation:
          '**[optional]** The title of a progress dialog box. This parameter is used only if $iFlags includes the $FOF_SIMPLEPROGRESS flag.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the dialog box to display information about the status of the file operation.',
      },
    ],
  },
  _WinAPI_ShellFlushSFCache: {
    documentation: 'Flushes the special folder cache',
    label: '_WinAPI_ShellFlushSFCache (  )',
    params: [],
  },
  _WinAPI_ShellGetFileInfo: {
    documentation: 'Retrieves information about an object in the file system',
    label: '_WinAPI_ShellGetFileInfo ( $sFilePath, $iFlags, $iAttributes, ByRef $tSHFILEINFO )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          "String that contains the absolute or relative path and file name. This string can use eithershort (the 8.3 form) or long file names.If the $iFlags parameter includes the $SHGFI_PIDL flag, this parameter must be the address of anITEMIDLIST (PIDL) structure that contains the list of item identifiers that uniquely identifies thefile within the Shell's namespace. The pointer to an item identifier list (PIDL) must be a fullyqualified PIDL. Relative PIDLs are not allowed.If the $iFlags parameter includes the $SHGFI_USEFILEATTRIBUTES flag, this parameter does not haveto be a valid file name. The function will proceed as if the file exists with the specified name andwith the file attributes passed in the $iAttributes parameter. This allows you to obtain informationabout a file type by passing just the extension for $sFilePath and passing $FILE_ATTRIBUTE_NORMALin $iAttributes.",
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify the file information to retrieve. This parameter can be a combination of thefollowing values.$SHGFI_ATTR_SPECIFIED$SHGFI_ATTRIBUTES$SHGFI_DISPLAYNAME$SHGFI_EXETYPE$SHGFI_ICON$SHGFI_ICONLOCATION$SHGFI_LARGEICON$SHGFI_LINKOVERLAY$SHGFI_OPENICON$SHGFI_OVERLAYINDEX$SHGFI_PIDL$SHGFI_SELECTED$SHGFI_SHELLICONSIZE$SHGFI_SMALLICON$SHGFI_SYSICONINDEX$SHGFI_TYPENAME$SHGFI_USEFILEATTRIBUTES',
      },
      {
        label: '$iAttributes',
        documentation: 'A combination of one or more file attribute flags ($FILE_ATTRIBUTE_*).',
      },
      {
        label: '$tSHFILEINFO',
        documentation:
          '$tagSHFILEINFO structure to receive the file information. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_ShellGetIconOverlayIndex: {
    documentation: 'Retrieves the index of the overlay icon in the system image list',
    label: '_WinAPI_ShellGetIconOverlayIndex ( $sIcon, $iIndex )',
    params: [
      {
        label: '$sIcon',
        documentation: 'The fully qualified path of the file that contains the icon.',
      },
      {
        label: '$iIndex',
        documentation:
          'The index of the icon. To request a standard overlay icon, set the path to an empty string,and index to one of the following values.    $IDO_SHGIOI_LINK    $IDO_SHGIOI_SHARE    $IDO_SHGIOI_SLOWFILEWindows 7 or later    $IDO_SHGIOI_DEFAULT',
      },
    ],
  },
  _WinAPI_ShellGetImageList: {
    documentation: 'Retrieves the system image list for small or large icons',
    label: '_WinAPI_ShellGetImageList ( [$bSmall = False] )',
    params: [
      {
        label: '$bSmall',
        documentation:
          '**[optional]** Specifies whether to retrieve an image list for small or large icons, valid values:    True - The small icons.    False - The large icons (Default).',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderIDList: {
    documentation: 'Retrieves the path of a known folder as an ITEMIDLIST structure',
    label: '_WinAPI_ShellGetKnownFolderIDList ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation:
          'The GUID ($FOLDERID_*) that identifies the standard folders registered with the system.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify special retrieval options. This parameter can be one or more of the following values.    $KF_FLAG_CREATE    $KF_FLAG_DONT_VERIFY    $KF_FLAG_DONT_UNEXPAND    $KF_FLAG_NO_ALIAS    $KF_FLAG_INIT    $KF_FLAG_DEFAULT_PATH    $KF_FLAG_NOT_PARENT_RELATIVE    $KF_FLAG_SIMPLE_IDLISTWindows 7 or later    $KF_FLAG_ALIAS_ONLY',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requeststhe known folder for the current user. Assigning the $hToken parameter a value of (-1) indicates theDefault User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellGetKnownFolderPath: {
    documentation: 'Retrieves the full path of a known folder identified',
    label: '_WinAPI_ShellGetKnownFolderPath ( $sGUID [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation:
          'The GUID ($FOLDERID_*) that identifies the standard folders registered with the system.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify special retrieval options. This parameter can be one or more of the following values.    $KF_FLAG_CREATE    $KF_FLAG_DONT_VERIFY    $KF_FLAG_DONT_UNEXPAND    $KF_FLAG_NO_ALIAS    $KF_FLAG_INIT    $KF_FLAG_DEFAULT_PATH    $KF_FLAG_NOT_PARENT_RELATIVE    $KF_FLAG_SIMPLE_IDLISTWindows 7 or later    $KF_FLAG_ALIAS_ONLY',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requeststhe known folder for the current user. Assigning the $hToken parameter a value of (-1) indicates theDefault User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellGetLocalizedName: {
    documentation: 'Retrieves the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellGetLocalizedName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
    ],
  },
  _WinAPI_ShellGetPathFromIDList: {
    documentation: 'Converts an item identifier list to a file system path',
    label: '_WinAPI_ShellGetPathFromIDList ( $pPIDL )',
    params: [
      {
        label: '$pPIDL',
        documentation:
          'The address of an item identifier list that specifies a file or directory location relative to the root of the namespace (the desktop).',
      },
    ],
  },
  _WinAPI_ShellGetSetFolderCustomSettings: {
    documentation: 'Sets or retrieves custom folder settings',
    label: '_WinAPI_ShellGetSetFolderCustomSettings ( $sFilePath, $iFlag, ByRef $tSHFCS )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the folder.',
      },
      {
        label: '$iFlag',
        documentation:
          'A flag controlling the action of the function. It may be one of the following values.$FCS_READ$FCS_FORCEWRITE$FCS_WRITE',
      },
      {
        label: '$tSHFCS',
        documentation:
          '$tagSHFOLDERCUSTOMSETTINGS structure that provides or receives the custom folder settings. This structuremust be created before function call.',
      },
    ],
  },
  _WinAPI_ShellGetSettings: {
    documentation: 'Retrieves Shell state settings',
    label: '_WinAPI_ShellGetSettings ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'The flags that indicate which settings should be retrieved. This parameter can be one ormore of the following values (use ONLY this flags).$SSF_DESKTOPHTML$SSF_DONTPRETTYPATH$SSF_DOUBLECLICKINWEBVIEW$SSF_HIDEICONS$SSF_MAPNETDRVBUTTON$SSF_NOCONFIRMRECYCLE$SSF_NONETCRAWLING$SSF_SEPPROCESS$SSF_SHOWALLOBJECTS$SSF_SHOWCOMPCOLOR$SSF_SHOWEXTENSIONS$SSF_SHOWINFOTIP$SSF_SHOWSUPERHIDDEN$SSF_SHOWSYSFILES$SSF_STARTPANELON$SSF_WIN95CLASSIC$SSF_WEBVIEWWindows Vista or later$SSF_AUTOCHECKSELECT$SSF_ICONSONLY$SSF_SHOWTYPEOVERLAY',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderLocation: {
    documentation: 'Retrieves a pointer to the ITEMIDLIST structure (PIDL) of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderLocation ( $iCSIDL )',
    params: [
      {
        label: '$iCSIDL',
        documentation: 'The CSIDL ($CSIDL_*) that identifies the folder of interest.',
      },
    ],
  },
  _WinAPI_ShellGetSpecialFolderPath: {
    documentation: 'Retrieves the path of a special folder',
    label: '_WinAPI_ShellGetSpecialFolderPath ( $iCSIDL [, $bCreate = False] )',
    params: [
      {
        label: '$iCSIDL',
        documentation: 'The CSIDL ($iCSIDL_*) that identifies the folder of interest.',
      },
      {
        label: '$bCreate',
        documentation:
          '**[optional]** Specifies whether the folder should be created if it does not already exist, valid values:True - The folder is created.False - The folder is not created (Default).',
      },
    ],
  },
  _WinAPI_ShellGetStockIconInfo: {
    documentation: 'Retrieves information about system-defined Shell icons',
    label: '_WinAPI_ShellGetStockIconInfo ( $iSIID, $iFlags )',
    params: [
      {
        label: '$iSIID',
        documentation:
          'One of the $SIID_* constants that specifies which icon should be retrieved.Those constants are defined in APIShellExConstants.au3.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify which information is requested. This parameter can be a combination of thefollowing values.$SHGSI_ICONLOCATION$SHGSI_ICON$SHGSI_SYSICONINDEX$SHGSI_LINKOVERLAY$SHGSI_SELECTED$SHGSI_LARGEICON$SHGSI_SMALLICON$SHGSI_SHELLICONSIZE',
      },
    ],
  },
  _WinAPI_ShellILCreateFromPath: {
    documentation: 'Creates a pointer to an item identifier list (PIDL) from a path',
    label: '_WinAPI_ShellILCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to be converted.',
      },
    ],
  },
  _WinAPI_ShellNotifyIcon: {
    documentation: "Sends a message to the taskbar's status area",
    label: '_WinAPI_ShellNotifyIcon ( $iMessage, $tNOTIFYICONDATA )',
    params: [
      {
        label: '$iMessage',
        documentation:
          'The variable that specifies the action to be taken. It can have one of the following values.$NIM_ADD$NIM_MODIFY$NIM_DELETE$NIM_SETFOCUS$NIM_SETVERSION',
      },
      {
        label: '$tNOTIFYICONDATA',
        documentation:
          '$tagNOTIFYICONDATA structure. The content and size of this structure depends on the valueof the $iMessage and version of the operating system.',
      },
    ],
  },
  _WinAPI_ShellNotifyIconGetRect: {
    documentation: 'Gets the screen coordinates of the bounding rectangle of a notification icon',
    label: '_WinAPI_ShellNotifyIconGetRect ( $hWnd, $iID [, $tGUID = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the parent window used by the notification\'s callback function. For more information,see the "hWnd" member of the $tagNOTIFYICONDATA structure.',
      },
      {
        label: '$iID',
        documentation:
          'Application-defined identifier of the notification icon. Multiple icons can be associated with a single$hWnd, each with their own $iID.',
      },
      {
        label: '$tGUID',
        documentation: '**[optional]** $tagGUID structure that identifies the icon.',
      },
    ],
  },
  _WinAPI_ShellObjectProperties: {
    documentation: 'Invokes the Properties context menu command on a Shell object',
    label:
      "_WinAPI_ShellObjectProperties ( $sFilePath [, $iType = 2 [, $sProperty = '' [, $hParent = 0]]] )",
    params: [
      {
        label: '$sFilePath',
        documentation: 'The object name.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The value that specifies the type of object.$SHOP_PRINTERNAME$SHOP_FILEPATH (Default)$SHOP_VOLUMEGUID',
      },
      {
        label: '$sProperty',
        documentation: '**[optional]** The name of the property sheet page to be opened initially.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window of the dialog box.',
      },
    ],
  },
  _WinAPI_ShellOpenFolderAndSelectItems: {
    documentation:
      'Opens a Windows Explorer window with specified items in a particular folder selected',
    label:
      '_WinAPI_ShellOpenFolderAndSelectItems ( $sFilePath [, $aNames = 0 [, $iStart = 0 [, $iEnd = -1 [, $iFlags = 0]]]] )',
    params: [
      {
        label: '$sFilePath',
        documentation:
          'The fully qualified path that specifies the folder or file. If $aNames parameter is used, $sFilePath shouldspecified only to a folder, otherwise, the function fails. This parameter can be an empty string.',
      },
      {
        label: '$aNames',
        documentation:
          '**[optional]** The array of the folder or file names to be selected. It should be just names in the specifiedfolder, without its path.',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start selecting at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop selecting at.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The optional flags. This parameter can be one or more of the following values.Windows Vista or later$OFASI_EDIT$OFASI_OPENDESKTOP',
      },
    ],
  },
  _WinAPI_ShellOpenWithDlg: {
    documentation: 'Displays the Open With dialog box',
    label: '_WinAPI_ShellOpenWithDlg ( $sFilePath [, $iFlags = 0 [, $hParent = 0]] )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The file name.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The characteristics of the Open With dialog box. This parameter can be one or more of the following values.$OAIF_ALLOW_REGISTRATION$OAIF_REGISTER_EXT$OAIF_EXEC$OAIF_FORCE_REGISTRATION$OAIF_HIDE_REGISTRATION$OAIF_URL_PROTOCOL',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window.',
      },
    ],
  },
  _WinAPI_ShellQueryRecycleBin: {
    documentation:
      'Retrieves the size of the Recycle Bin and the number of items in it, for a specified drive',
    label: "_WinAPI_ShellQueryRecycleBin ( [$sRoot = ''] )",
    params: [
      {
        label: '$sRoot',
        documentation:
          '**[optional]** The string that contains the path of the root drive on which the Recycle Bin is located. This stringcan be formatted with the drive, folder, and subfolder names, for example "c:\\windows\\system\\".If this parameter is empty string, information is retrieved for all Recycle Bins on all drives.',
      },
    ],
  },
  _WinAPI_ShellQueryUserNotificationState: {
    documentation: 'Checks the state of the computer for the current user',
    label: '_WinAPI_ShellQueryUserNotificationState (  )',
    params: [],
  },
  _WinAPI_ShellRemoveLocalizedName: {
    documentation: 'Removes the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellRemoveLocalizedName ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
    ],
  },
  _WinAPI_ShellRestricted: {
    documentation: 'Determines whether a specified administrator policy is in effect',
    label: '_WinAPI_ShellRestricted ( $iRestriction )',
    params: [
      {
        label: '$iRestriction',
        documentation:
          'A restriction. This parameter can be one of the $REST_* constants defined in APIShellExConstants.au3.',
      },
    ],
  },
  _WinAPI_ShellSetKnownFolderPath: {
    documentation: 'Redirects a known folder to a new location',
    label: '_WinAPI_ShellSetKnownFolderPath ( $sGUID, $sFilePath [, $iFlags = 0 [, $hToken = 0]] )',
    params: [
      {
        label: '$sGUID',
        documentation: 'The GUID ($FOLDERID_*) that identifies the known folder.',
      },
      {
        label: '$sFilePath',
        documentation: "The folder's new path.",
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** This parameter can be 0 or the following value.$KF_FLAG_DONT_UNEXPAND',
      },
      {
        label: '$hToken',
        documentation:
          '**[optional]** The access token that represents a particular user. If this parameter is 0, the function requeststhe known folder for the current user. Assigning the $hToken parameter a value of (-1) indicates theDefault User. Note that access to the Default User folders requires administrator privileges.',
      },
    ],
  },
  _WinAPI_ShellSetLocalizedName: {
    documentation: 'Sets the localized name of a file in a Shell folder',
    label: '_WinAPI_ShellSetLocalizedName ( $sFilePath, $sModule, $iResID )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The path to the target file.',
      },
      {
        label: '$sModule',
        documentation:
          'The path to the module containing string resource that specifies the localized version of the file name.',
      },
      {
        label: '$iResID',
        documentation: 'ID of the localized file name resource.',
      },
    ],
  },
  _WinAPI_ShellSetSettings: {
    documentation: 'Sets Shell state settings',
    label: '_WinAPI_ShellSetSettings ( $iFlags, $bSet )',
    params: [
      {
        label: '$iFlags',
        documentation:
          'The flags that indicate which settings should be set. This parameter can be one ormore of the following values (use ONLY this flags).$SSF_SHOWALLOBJECTS$SSF_SHOWEXTENSIONS$SSF_SHOWCOMPCOLOR$SSF_SHOWSYSFILES$SSF_DOUBLECLICKINWEBVIEW$SSF_DESKTOPHTML$SSF_WIN95CLASSIC$SSF_DONTPRETTYPATH$SSF_MAPNETDRVBUTTON$SSF_SHOWINFOTIP$SSF_HIDEICONS$SSF_NOCONFIRMRECYCLE$SSF_WEBVIEW$SSF_SHOWSUPERHIDDEN$SSF_SEPPROCESS$SSF_NONETCRAWLING$SSF_STARTPANELONWindows Vista or later$SSF_AUTOCHECKSELECT$SSF_ICONSONLY$SSF_SHOWTYPEOVERLAY',
      },
      {
        label: '$bSet',
        documentation:
          'Specifies whether a settings ($SSF_*) is enable or disable, valid values:True - Enable.False - Disable.',
      },
    ],
  },
  _WinAPI_ShellStartNetConnectionDlg: {
    documentation: 'Displays a general browsing dialog box for a network resource connection',
    label:
      "_WinAPI_ShellStartNetConnectionDlg ( [$sRemote = '' [, $iFlags = 0 [, $hParent = 0]]] )",
    params: [
      {
        label: '$sRemote',
        documentation: '**[optional]** The remote network name.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that identify the type of resource that the dialog is set to find. This parameter can beone or more of the following values.',
      },
      {
        label: '$hParent',
        documentation: '**[optional]** Handle of the parent window.',
      },
    ],
  },
  _WinAPI_ShellUpdateImage: {
    documentation: 'Notifies the Shell that an image in the system image list has changed',
    label: '_WinAPI_ShellUpdateImage ( $sIcon, $iIndex, $iImage [, $iFlags = 0] )',
    params: [
      {
        label: '$sIcon',
        documentation: 'The fully qualified path of the file that contains the icon.',
      },
      {
        label: '$iIndex',
        documentation: 'The 0-based index of the icon.',
      },
      {
        label: '$iImage',
        documentation:
          'The 0-based index in the system image list of the icon that is being updated.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that determine the icon attributes. It can be 0 or a combination of the following values.    $GIL_NOTFILENAME    $GIL_SIMULATEDOC',
      },
    ],
  },
  _WinAPI_ShellUserAuthenticationDlg: {
    documentation:
      'Creates and displays a configurable dialog box that accepts credentials information from a user',
    label:
      '_WinAPI_ShellUserAuthenticationDlg ( $sCaption, $sMessage, $sUser, $sPassword, $sTarget [, $iFlags = 0 [, $iError = 0 [, $bSave = False [, $hBitmap = 0 [, $hParent = 0]]]]] )',
    params: [
      {
        label: '$sCaption',
        documentation: 'The title for the dialog box.',
      },
      {
        label: '$sMessage',
        documentation: 'A brief message to display in the dialog box.',
      },
      {
        label: '$sUser',
        documentation:
          'The user name to populate the credential fields in the dialog box. For domain users, the string mustbe in the following format (if domain is not specified, the trget string is used as the domain):DomainName\\UserName',
      },
      {
        label: '$sPassword',
        documentation: 'The initial password.',
      },
      {
        label: '$sTarget',
        documentation:
          'The name of the target, typically a server name. This parameter is used to identify target informationwhen storing and retrieving credentials.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies behavior for this function. It can be a bitwise-OR combination of zeroor more of the following values.$CREDUI_FLAGS_ALWAYS_SHOW_UI$CREDUI_FLAGS_COMPLETE_USERNAME$CREDUI_FLAGS_DO_NOT_PERSIST$CREDUI_FLAGS_EXCLUDE_CERTIFICATES$CREDUI_FLAGS_EXPECT_CONFIRMATION$CREDUI_FLAGS_GENERIC_CREDENTIALS$CREDUI_FLAGS_INCORRECT_PASSWORD$CREDUI_FLAGS_KEEP_USERNAME$CREDUI_FLAGS_PASSWORD_ONLY_OK$CREDUI_FLAGS_PERSIST$CREDUI_FLAGS_REQUEST_ADMINISTRATOR$CREDUI_FLAGS_REQUIRE_CERTIFICATE$CREDUI_FLAGS_REQUIRE_SMARTCARD$CREDUI_FLAGS_SERVER_CREDENTIAL$CREDUI_FLAGS_SHOW_SAVE_CHECK_BOX$CREDUI_FLAGS_USERNAME_TARGET_CREDENTIALS$CREDUI_FLAGS_VALIDATE_USERNAME',
      },
      {
        label: '$iError',
        documentation:
          '**[optional]** The system error code that specifies why the credential dialog box is needed.',
      },
      {
        label: '$bSave',
        documentation:
          '**[optional]** Specifies whether the "Save" check box is selected in the dialog box (it makes sense only if the$CREDUI_FLAGS_SHOW_SAVE_CHECK_BOX flag is used), valid values:    True  - Selected.    False - Deselected (Default).',
      },
      {
        label: '$hBitmap',
        documentation:
          '**[optional]** A bitmap handle to display in the dialog box. If this parameter is 0, the default bitmap is used.The bitmap size is limited to 320x60 pixels.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** The dialog box is modal with respect to the parent window. If this parameter is 0, the desktopis the parent window of the dialog box.',
      },
    ],
  },
  _WinAPI_ShellUserAuthenticationDlgEx: {
    documentation:
      'Creates and displays a configurable dialog box that accepts credentials information from a user',
    label:
      '_WinAPI_ShellUserAuthenticationDlgEx ( $sCaption, $sMessage, $sUser, $sPassword [, $iFlags = 0 [, $iAuthError = 0 [, $bSave = False [, $iPackage = 0 [, $hParent = 0]]]]] )',
    params: [
      {
        label: '$sCaption',
        documentation: 'The title for the dialog box.',
      },
      {
        label: '$sMessage',
        documentation: 'A brief message to display in the dialog box.',
      },
      {
        label: '$sUser',
        documentation:
          'The user name to populate the credential fields in the dialog box. For domain users, the string mustbe in the following format:DomainName\\UserName',
      },
      {
        label: '$sPassword',
        documentation: 'The initial password.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies behavior for this function. It can be a combination of the following values.$CREDUIWIN_AUTHPACKAGE_ONLY$CREDUIWIN_CHECKBOX$CREDUIWIN_ENUMERATE_ADMINS$CREDUIWIN_ENUMERATE_CURRENT_USER$CREDUIWIN_GENERIC$CREDUIWIN_IN_CRED_ONLY$CREDUIWIN_SECURE_PROMPT$CREDUIWIN_PACK_32_WOW$CREDUIWIN_PREPROMPTING',
      },
      {
        label: '$iAuthError',
        documentation: '**[optional]** The system error code that is displayed in the dialog box.',
      },
      {
        label: '$bSave',
        documentation:
          '**[optional]** Specifies whether the "Save" check box is selected in the dialog box (it makes sense only if the$CREDUIWIN_CHECKBOX flag is used), valid values:True  - Selected. False - Deselected (Default).',
      },
      {
        label: '$iPackage',
        documentation:
          '**[optional]** The authentication package for which the credentials are serialized.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** The dialog box is modal with respect to the parent window. If this parameter is 0 (Default), the desktopis the parent window of the dialog box.',
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
  _WinAPI_ShowCaret: {
    documentation: "Makes the caret visible on the screen at the caret's current position",
    label: '_WinAPI_ShowCaret ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window that owns the caret. If this parameter is 0, _WinAPI_ShowCaret() searches thecurrent task for the window that owns the caret.',
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
  _WinAPI_ShowLastError: {
    documentation: 'Shows the last error code and message',
    label: "_WinAPI_ShowLastError ( [$sText = '' [, $bAbort = False [, $iLanguage = 0]]] )",
    params: [
      {
        label: '$sText',
        documentation: "**[optional]** The user's text that to be displayed with the message.",
      },
      {
        label: '$bAbort',
        documentation:
          '**[optional]** Specifies whether to exit the script after displaying an error message, valid values:True - Exit the script after displaying a message if it indicates an error.False - Always return normally (Default).',
      },
      {
        label: '$iLanguage',
        documentation: '**[optional]** The language identifier for the message.',
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
  _WinAPI_ShowOwnedPopups: {
    documentation: 'Shows or hides all pop-up windows owned by the specified window',
    label: '_WinAPI_ShowOwnedPopups ( $hWnd, $bShow )',
    params: [
      {
        label: '$hWnd',
        documentation: 'A handle to the window that owns the pop-up windows to be shown or hidden.',
      },
      {
        label: '$bShow',
        documentation:
          'Specifies whether pop-up windows are to be shown or hidden, valid values:    True - All hidden pop-up windows are shown.    False - All visible pop-up windows are hidden.',
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
  _WinAPI_ShutdownBlockReasonCreate: {
    documentation:
      'Indicates that the system cannot be shut down and sets a reason string to be displayed to the user if system shutdown is initiated',
    label: '_WinAPI_ShutdownBlockReasonCreate ( $hWnd, $sText )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the main window of the application.',
      },
      {
        label: '$sText',
        documentation:
          'The string which explaining the reason the application must block system shutdown.',
      },
    ],
  },
  _WinAPI_ShutdownBlockReasonDestroy: {
    documentation: 'Indicates that the system can be shut down and frees the reason string',
    label: '_WinAPI_ShutdownBlockReasonDestroy ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the main window of the application.',
      },
    ],
  },
  _WinAPI_ShutdownBlockReasonQuery: {
    documentation:
      'Retrieves the reason string set by the _WinAPI_ShutdownBlockReasonCreate() function',
    label: '_WinAPI_ShutdownBlockReasonQuery ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the main window of the application.',
      },
    ],
  },
  _WinAPI_SizeOfResource: {
    documentation: 'Returns the size, in bytes, of the specified resource',
    label: '_WinAPI_SizeOfResource ( $hInstance, $hResource )',
    params: [
      {
        label: '$hInstance',
        documentation: 'Handle to the module whose executable file contains the resource.',
      },
      {
        label: '$hResource',
        documentation:
          'Handle to the resource. This handle must be created by using the _WinAPI_FindResource() or _WinAPI_FindResourceEx()function.',
      },
    ],
  },
  _WinAPI_StretchBlt: {
    documentation:
      'Copies a bitmap from a source rectangle into a destination rectangle, stretching or compressing the bitmap to fit the dimensions of the destination rectangle',
    label:
      '_WinAPI_StretchBlt ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width, in logical units, of the destination rectangle.',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height, in logical units, of the destination rectangle.',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context.',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width, in logical units, of the source rectangle.',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height, in logical units, of the source rectangle.',
      },
      {
        label: '$iRop',
        documentation:
          'The raster-operation code. These codes define how the color data for the source rectangle isto be combined with the color data for the destination rectangle to achieve the final color.This parameter must be 0 or one of the following values.$BLACKNESS$CAPTUREBLT$DSTINVERT$MERGECOPY$MERGEPAINT$NOMIRRORBITMAP$NOTSRCCOPY$NOTSRCERASE$PATCOPY$PATINVERT$PATPAINT$SRCAND$SRCCOPY$SRCERASE$SRCINVERT$SRCPAINT$WHITENESS',
      },
    ],
  },
  _WinAPI_StretchDIBits: {
    documentation:
      'Copies the color data for a rectangle of pixels in a DIB, JPEG, or PNG image to the specified destination rectangle, stretching or compressing the rows and columns by using the specified raster operation',
    label:
      '_WinAPI_StretchDIBits ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $tBITMAPINFO, $iUsage, $pBits, $iRop )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width, in logical units, of the destination rectangle.',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height, in logical units, of the destination rectangle.',
      },
      {
        label: '$iXSrc',
        documentation: 'The x-coordinate, in pixels, of the source rectangle in the image.',
      },
      {
        label: '$iYSrc',
        documentation: 'The y-coordinate, in pixels, of the source rectangle in the image.',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width, in pixels, of the source rectangle in the image.',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height, in pixels, of the source rectangle in the image.',
      },
      {
        label: '$tBITMAPINFO',
        documentation: '$tagBITMAPINFO structure that contains information about the DIB.',
      },
      {
        label: '$iUsage',
        documentation:
          'The type of colors used. (either logical palette indexes or literal RGB values).The following values are defined:    $DIB_PAL_COLORS    $DIB_RGB_COLORS',
      },
      {
        label: '$pBits',
        documentation: 'A pointer to the image bits, which are stored as an array of bytes.',
      },
      {
        label: '$iRop',
        documentation:
          "The raster-operation code that specifies how the source pixels, the destination device context'scurrent brush, and the destination pixels are to be combined to form the new image.It must be 0 or one of the following values:    $BLACKNESS    $CAPTUREBLT    $DSTINVERT    $MERGECOPY    $MERGEPAINT    $NOMIRRORBITMAP    $NOTSRCCOPY    $NOTSRCERASE    $PATCOPY    $PATINVERT    $PATPAINT    $SRCAND    $SRCCOPY    $SRCERASE    $SRCINVERT    $SRCPAINT    $WHITENESS",
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
          '**[optional]** Specifies whether a string is Unicode or ASCII code of a character, valid values:True - Unicode (Default). False - ASCII.',
      },
    ],
  },
  _WinAPI_StrokeAndFillPath: {
    documentation:
      'Closes any open figures in a path, strokes the outline of the path, and fills its interior',
    label: '_WinAPI_StrokeAndFillPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
    ],
  },
  _WinAPI_StrokePath: {
    documentation: 'Renders the specified path by using the current pen',
    label: '_WinAPI_StrokePath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context that contains the completed path.',
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
          'The structure to convert. This structure should be same as for _WinAPI_ArrayToStruct().',
      },
      {
        label: '$iItems',
        documentation:
          '**[optional]** The number of strings that contains the structure. If this parameter is 0 (Default), the end of the structuredetermined by a double null-terminated character ("... ;{0};{0}").',
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
  _WinAPI_SubtractRect: {
    documentation:
      'Determines the coordinates of a rectangle formed by subtracting one rectangle from another',
    label: '_WinAPI_SubtractRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation:
          '$tagRECT structure from which the function subtracts the rectangle specified by $tRECT2.',
      },
      {
        label: '$tRECT2',
        documentation:
          '$tagRECT structure that the function subtracts from the rectangle specified by $tRECT1.',
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
  _WinAPI_SwitchColor: {
    documentation: 'Converts a color from BGR to RGB and vice versa',
    label: '_WinAPI_SwitchColor ( $iColor )',
    params: [
      {
        label: '$iColor',
        documentation: 'The color to conversion.',
      },
    ],
  },
  _WinAPI_SwitchDesktop: {
    documentation: 'Makes the specified desktop visible and activates it',
    label: '_WinAPI_SwitchDesktop ( $hDesktop )',
    params: [
      {
        label: '$hDesktop',
        documentation:
          'Handle to the desktop. This desktop must be associated with the current window station for the process.',
      },
    ],
  },
  _WinAPI_SwitchToThisWindow: {
    documentation: 'Switches the focus to a specified window and bring it to the foreground',
    label: '_WinAPI_SwitchToThisWindow ( $hWnd [, $bAltTab = False] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window being switched to.',
      },
      {
        label: '$bAltTab',
        documentation:
          '**[optional]** Specifies whether switches to using the Alt/Ctl+Tab key sequence, valid values:    True - The window is being switched to using the Alt/Ctl+Tab key sequence.    False - Otherwise (Default).',
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
  _WinAPI_TabbedTextOut: {
    documentation:
      'Writes a character string at a specified location and expanding tabs to the specified tab-stop positions',
    label:
      '_WinAPI_TabbedTextOut ( $hDC, $iX, $iY, $sText [, $aTab = 0 [, $iStart = 0 [, $iEnd = -1 [, $iOrigin = 0]]]] )',
    params: [
      {
        label: '$hDC',
        documentation: 'A handle to the device context.',
      },
      {
        label: '$iX',
        documentation: 'The x-coordinate of the starting point of the string, in logical units.',
      },
      {
        label: '$iY',
        documentation: 'The y-coordinate of the starting point of the string, in logical units.',
      },
      {
        label: '$sText',
        documentation: 'The character string to draw.',
      },
      {
        label: '$aTab',
        documentation:
          '**[optional]** The array containing the tab-stop positions, in logical units. The tab stops must be sorted in increasingorder; the smallest x-value should be the first item in the array. Also, it can be an integer value that isone tab-stop position. In this case, the tab stops are separated by the distance specified by this value.If this parameter is 0, tabs are expanded to eight times the average character width.',
      },
      {
        label: '$iStart',
        documentation:
          '**[optional]** The index of array element that contains the first tab-stop position.',
      },
      {
        label: '$iEnd',
        documentation:
          '**[optional]** The index of array element that contains the last tab-stop position.',
      },
      {
        label: '$iOrigin',
        documentation:
          '**[optional]** The x-coordinate of the starting position from which tabs are expanded, in logical units. This allowsan application to call the function several times for a single line. If the application calls the functionmore than once with the starting position set to the same value each time, the function expandsall tabs relative to the position specified by this parameter.',
      },
    ],
  },
  _WinAPI_TerminateJobObject: {
    documentation: 'Terminates all processes currently associated with the job',
    label: '_WinAPI_TerminateJobObject ( $hJob [, $iExitCode = 0] )',
    params: [
      {
        label: '$hJob',
        documentation:
          'A handle to the job whose processes will be terminated. This handle must have the $JOB_OBJECT_TERMINATEaccess right. Furthermore, the handle for each process in the job object must have the$PROCESS_TERMINATE access right.',
      },
      {
        label: '$iExitCode',
        documentation:
          '**[optional]** The exit code to be used by all processes and threads in the job object.',
      },
    ],
  },
  _WinAPI_TerminateProcess: {
    documentation: 'Terminates the specified process and all of its threads',
    label: '_WinAPI_TerminateProcess ( $hProcess [, $iExitCode = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'A handle to the process to be terminated. The handle must have the $PROCESS_TERMINATE access right.',
      },
      {
        label: '$iExitCode',
        documentation:
          '**[optional]** The exit code to be used by the process and threads terminated as a result of this call.',
      },
    ],
  },
  _WinAPI_TextOut: {
    documentation:
      'Writes a string at the specified location, using the currently selected font, background color, and text color',
    label: '_WinAPI_TextOut ( $hDC, $iX, $iY, $sText )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to the device context.',
      },
      {
        label: '$iX',
        documentation:
          'The x-coordinate, in logical coordinates, of the reference point that the system uses to align the string.',
      },
      {
        label: '$iY',
        documentation:
          'The y-coordinate, in logical coordinates, of the reference point that the system uses to align the string.',
      },
      {
        label: '$sText',
        documentation: 'The string to be drawn.',
      },
    ],
  },
  _WinAPI_TileWindows: {
    documentation: 'Tiles the specified child windows of the specified parent window',
    label:
      '_WinAPI_TileWindows ( $aWnds [, $tRECT = 0 [, $hParent = 0 [, $iFlags = 0 [, $iStart = 0 [, $iEnd = -1]]]]] )',
    params: [
      {
        label: '$aWnds',
        documentation:
          'The array of handles to the child windows to arrange. If a specified child window is a top-level windowwith the style $WS_EX_TOPMOST or $WS_EX_TOOLWINDOW, the child window is not arranged. If this parameteris 0, all child windows of the specified parent window (or of the desktop window) are arranged.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that specifies the rectangular area, in client coordinates, within which the windowsare arranged. If this parameter is 0 (Default), the client area of the parent window is used.',
      },
      {
        label: '$hParent',
        documentation:
          '**[optional]** Handle to the parent window. If this parameter is 0 (Default), the desktop window is assumed.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** A cascade flag. This parameter can be one or more of the following values.$MDITILE_HORIZONTAL$MDITILE_VERTICAL (Default)',
      },
      {
        label: '$iStart',
        documentation: '**[optional]** The index of array to start arranging at.',
      },
      {
        label: '$iEnd',
        documentation: '**[optional]** The index of array to stop arranging at.',
      },
    ],
  },
  _WinAPI_TrackMouseEvent: {
    documentation:
      'Posts messages when the mouse pointer leaves a window or hovers over a window for a specified amount of time',
    label: '_WinAPI_TrackMouseEvent ( $hWnd, $iFlags [, $iTime = -1] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window to track.',
      },
      {
        label: '$iFlags',
        documentation:
          'The services requested. This parameter can be a combination of the following values.$TME_CANCEL$TME_HOVER$TME_LEAVE$TME_NONCLIENT$TME_QUERY',
      },
      {
        label: '$iTime',
        documentation:
          '**[optional]** The hover time-out (if $TME_HOVER was specified in $Flags), in milliseconds. Can be (-1) (Default), whichmeans to use the system default hover time-out.',
      },
    ],
  },
  _WinAPI_TransparentBlt: {
    documentation:
      'Performs a bit-block transfer of the color data corresponding to a rectangle of pixels',
    label:
      '_WinAPI_TransparentBlt ( $hDestDC, $iXDest, $iYDest, $iWidthDest, $iHeightDest, $hSrcDC, $iXSrc, $iYSrc, $iWidthSrc, $iHeightSrc, $iRGB )',
    params: [
      {
        label: '$hDestDC',
        documentation: 'Handle to the destination device context.',
      },
      {
        label: '$iXDest',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iYDest',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the destination rectangle.',
      },
      {
        label: '$iWidthDest',
        documentation: 'The width, in logical units, of the destination rectangle.',
      },
      {
        label: '$iHeightDest',
        documentation: 'The height, in logical units, of the destination rectangle.',
      },
      {
        label: '$hSrcDC',
        documentation: 'Handle to the source device context.',
      },
      {
        label: '$iXSrc',
        documentation:
          'The x-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iYSrc',
        documentation:
          'The y-coordinate, in logical units, of the upper-left corner of the source rectangle.',
      },
      {
        label: '$iWidthSrc',
        documentation: 'The width, in logical units, of the source rectangle.',
      },
      {
        label: '$iHeightSrc',
        documentation: 'The height, in logical units, of the source rectangle.',
      },
      {
        label: '$iRGB',
        documentation: 'The RGB color in the source bitmap to treat as transparent.',
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
  _WinAPI_UnhookWinEvent: {
    documentation: 'Removes an event hook function',
    label: '_WinAPI_UnhookWinEvent ( $hEventHook )',
    params: [
      {
        label: '$hEventHook',
        documentation:
          'Handle to the event hook returned in the previous call to _WinAPI_SetWinEventHook().',
      },
    ],
  },
  _WinAPI_UnionRect: {
    documentation: 'Creates the union of two rectangles',
    label: '_WinAPI_UnionRect ( $tRECT1, $tRECT2 )',
    params: [
      {
        label: '$tRECT1',
        documentation: '$tagRECT structure that contains the first source rectangle.',
      },
      {
        label: '$tRECT2',
        documentation: '$tagRECT structure that contains the second source rectangle.',
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
  _WinAPI_UniqueHardwareID: {
    documentation: 'Generates a unique hardware identifier (ID) for local computer',
    label: '_WinAPI_UniqueHardwareID ( [$iFlags = 0] )',
    params: [
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specifies what information would be used to generate ID. This parameter can be one or more of the following values.$UHID_MB - Uses information about your motherboard. This flag is used by default regardless of whether specified or not.$UHID_BIOS - Uses information from BIOS.$UHID_CPU - Uses information about your processor(s). Note that $UHID_CPU flag reduces the function speed.$UHID_HDD - Uses information about the installed hard drives. Any change in the configuration disks will change ID returned by this function. Taken into account only non-removable disks with an ATA or SATA interfaces.$UHID_All - The sum of all the previous flags.',
      },
    ],
  },
  _WinAPI_UnloadKeyboardLayout: {
    documentation: 'Unloads an input locale identifier',
    label: '_WinAPI_UnloadKeyboardLayout ( $hLocale )',
    params: [
      {
        label: '$hLocale',
        documentation: 'The input locale identifier to be unloaded.',
      },
    ],
  },
  _WinAPI_UnlockFile: {
    documentation: 'Unlocks a region in an open file',
    label: '_WinAPI_UnlockFile ( $hFile, $iOffset, $iLength )',
    params: [
      {
        label: '$hFile',
        documentation:
          'Handle to the file that contains a region locked with _WinAPI_LockFile() function.',
      },
      {
        label: '$iOffset',
        documentation: 'The starting byte offset in the file where the locked region begins.',
      },
      {
        label: '$iLength',
        documentation: 'The length of the byte range to be unlocked.',
      },
    ],
  },
  _WinAPI_UnmapViewOfFile: {
    documentation: "Unmaps a mapped view of a file from the calling process's address space",
    label: '_WinAPI_UnmapViewOfFile ( $pAddress )',
    params: [
      {
        label: '$pAddress',
        documentation:
          'A pointer to the base address of the mapped view of a file that is to be unmapped.This value must be identical to the value returned by a previous call to the _WinAPI_MapViewOfFile() function.',
      },
    ],
  },
  _WinAPI_UnregisterApplicationRestart: {
    documentation: 'Removes the active instance of an application from the restart list',
    label: '_WinAPI_UnregisterApplicationRestart (  )',
    params: [],
  },
  _WinAPI_UnregisterClass: {
    documentation: 'Unregisters a window class, freeing the memory required for the class',
    label: '_WinAPI_UnregisterClass ( $sClass [, $hInstance = 0] )',
    params: [
      {
        label: '$sClass',
        documentation:
          'A null-terminated string or a class atom. If $sClass is a string, it specifies the window classname. This class name must have been registered by a previous call to the _WinAPI_RegisterClass()or _WinAPI_RegisterClassEx() function. If this parameter is an atom, it must be in the low-orderword of $sClass; the high-order word must be zero.',
      },
      {
        label: '$hInstance',
        documentation:
          '**[optional]** Handle to the instance of the module that created the class.',
      },
    ],
  },
  _WinAPI_UnregisterHotKey: {
    documentation: 'Frees a hot key previously registered by the calling thread',
    label: '_WinAPI_UnregisterHotKey ( $hWnd, $iID )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window associated with the hot key to be freed. This parameter should be 0 if thehot key is not associated with a window.',
      },
      {
        label: '$iID',
        documentation: 'Specifies the identifier of the hot key to be freed.',
      },
    ],
  },
  _WinAPI_UnregisterPowerSettingNotification: {
    documentation: 'Unregisters the power setting notification',
    label: '_WinAPI_UnregisterPowerSettingNotification ( $hNotify )',
    params: [
      {
        label: '$hNotify',
        documentation:
          'Handle returned from the _WinAPI_RegisterPowerSettingNotification() function.',
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
  _WinAPI_UpdateLayeredWindowEx: {
    documentation: 'Updates a bitmap translucency of a layered window',
    label:
      '_WinAPI_UpdateLayeredWindowEx ( $hWnd, $iX, $iY, $hBitmap [, $iOpacity = 255 [, $bDelete = False]] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to a layered window. A layered window is created by specifying $WS_EX_LAYERED when its creating.',
      },
      {
        label: '$iX',
        documentation: 'The new position of the left side of the window.',
      },
      {
        label: '$iY',
        documentation: 'The new position of the top of the window.',
      },
      {
        label: '$hBitmap',
        documentation: 'Handle to the bitmap that will be set to the layered window.',
      },
      {
        label: '$iOpacity',
        documentation:
          '**[optional]** The alpha transparency value to be used on the entire source bitmap. Default is 255.',
      },
      {
        label: '$bDelete',
        documentation:
          '**[optional]** Specifies whether to delete the bitmap after updated the window, valid values:    True - Bitmap will be deleted if the function succeeds.    False - Do not delete, you must release the bitmap when you are finished using it (Default).',
      },
    ],
  },
  _WinAPI_UpdateLayeredWindowIndirect: {
    documentation:
      'Updates the position, size, shape, content, and translucency of a layered window',
    label: '_WinAPI_UpdateLayeredWindowIndirect ( $hWnd, $tULWINFO )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to a layered window. A layered window is created by specifying $WS_EX_LAYERED when its creating.',
      },
      {
        label: '$tULWINFO',
        documentation:
          '$tagUPDATELAYEREDWINDOWINFO structure that contains the information for the window.',
      },
    ],
  },
  _WinAPI_UpdateResource: {
    documentation: 'Adds, deletes, or replaces a resource in a portable executable (PE) file',
    label: '_WinAPI_UpdateResource ( $hUpdate, $sType, $sName, $iLanguage, $pData, $iSize )',
    params: [
      {
        label: '$hUpdate',
        documentation:
          'A module handle returned by the _WinAPI_BeginUpdateResource(), referencing the file to be updated.',
      },
      {
        label: '$sType',
        documentation:
          'The resource type to be updated. Alternatively, rather than a pointer, this parameter can be aninteger value representing a predefined resource type. If the first character of the string is apound sign (#), then the remaining characters represent a decimal number that specifies the integeridentifier of the resource type. For example, the string "#258" represents the identifier 258.Also, you can use a predefined resource types ($RT_*).',
      },
      {
        label: '$sName',
        documentation:
          'The name of the resource to be updated. This parameter can be string or integer value.',
      },
      {
        label: '$iLanguage',
        documentation: 'The language identifier of the resource.',
      },
      {
        label: '$pData',
        documentation:
          'The resource data to be inserted into the file indicated by $hUpdate parameter. If the resource isone of the predefined types, the data must be valid and properly aligned. Note that this is the rawbinary data, not the data provided by _WinAPI_LoadIcon(), _WinAPI_LoadString(), or other resource-specific load functions. All data containing strings or text must be in Unicode format. If $pDatais 0 and $iSize is 0, the specified resource is deleted from the file indicated by $hUpdate.',
      },
      {
        label: '$iSize',
        documentation: 'The size, in bytes, of the resource data at $pData.',
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
  _WinAPI_UrlApplyScheme: {
    documentation:
      'Determines a scheme for a specified URL string, and returns a string with an appropriate prefix',
    label: '_WinAPI_UrlApplyScheme ( $sUrl [, $iFlags = 1] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how to determine the scheme. It can be a combination of the following values.$URL_APPLY_DEFAULT (Default)$URL_APPLY_GUESSSCHEME$URL_APPLY_GUESSFILE$URL_APPLY_FORCEAPPLY',
      },
    ],
  },
  _WinAPI_UrlCanonicalize: {
    documentation: 'Converts a URL string into canonical form',
    label: '_WinAPI_UrlCanonicalize ( $sUrl, $iFlags )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that specify how the URL is to be converted. It can be a combination of the following values.    $URL_DONT_SIMPLIFY    $URL_ESCAPE_PERCENT    $URL_ESCAPE_SPACES_ONLY    $URL_ESCAPE_UNSAFE    $URL_NO_META    $URL_PLUGGABLE_PROTOCOL    $URL_UNESCAPEWindows 7 or later    $URL_ESCAPE_AS_UTF8',
      },
    ],
  },
  _WinAPI_UrlCombine: {
    documentation: 'Combines the base an relative URLs in canonical form',
    label: '_WinAPI_UrlCombine ( $sUrl, $sPart [, $iFlags = 0] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The base URL.',
      },
      {
        label: '$sPart',
        documentation: 'The relative URL.',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The flags that specify how the URL is to be converted. It can be a combination of the following values.    $URL_DONT_SIMPLIFY    $URL_ESCAPE_PERCENT    $URL_ESCAPE_SPACES_ONLY    $URL_ESCAPE_UNSAFE    $URL_NO_META    $URL_PLUGGABLE_PROTOCOL    $URL_UNESCAPEWindows 7 or later    $URL_ESCAPE_AS_UTF8',
      },
    ],
  },
  _WinAPI_UrlCompare: {
    documentation: 'Makes a case-sensitive comparison of two URL strings',
    label: '_WinAPI_UrlCompare ( $sUrl1, $sUrl2 [, $bIgnoreSlash = False] )',
    params: [
      {
        label: '$sUrl1',
        documentation: 'The first URL.',
      },
      {
        label: '$sUrl2',
        documentation: 'The second URL.',
      },
      {
        label: '$bIgnoreSlash',
        documentation:
          "**[optional]** Specifies whether to ignore a trailing '/' character on either or both URLs, valid values:    True - The function ignores a trailing characters.    False - The function takes into account the trailing characters (Default).",
      },
    ],
  },
  _WinAPI_UrlCreateFromPath: {
    documentation: 'Converts a Microsoft MS-DOS path to a canonicalized URL',
    label: '_WinAPI_UrlCreateFromPath ( $sFilePath )',
    params: [
      {
        label: '$sFilePath',
        documentation: 'The MS-DOS path.',
      },
    ],
  },
  _WinAPI_UrlFixup: {
    documentation: 'Attempts to correct a URL whose protocol identifier is incorrect',
    label: '_WinAPI_UrlFixup ( $sUrl )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL to be corrected.',
      },
    ],
  },
  _WinAPI_UrlGetPart: {
    documentation: 'Retrieves a specified part from the URL',
    label: '_WinAPI_UrlGetPart ( $sUrl, $iPart )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iPart',
        documentation:
          'The part of the URL to retrieve. It can be one of the following values.$URL_PART_HOSTNAME$URL_PART_PASSWORD$URL_PART_PORT$URL_PART_QUERY$URL_PART_SCHEME$URL_PART_USERNAME',
      },
    ],
  },
  _WinAPI_UrlHash: {
    documentation: 'Hashes a URL string',
    label: '_WinAPI_UrlHash ( $sUrl [, $iLength = 32] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iLength',
        documentation:
          '**[optional]** The length of the hash data, in bytes. It should be no larger than 256, otherwise, the function fails. Default is 32.',
      },
    ],
  },
  _WinAPI_UrlIs: {
    documentation: 'Tests whether or not a URL is a specified type',
    label: '_WinAPI_UrlIs ( $sUrl [, $iType = 0] )',
    params: [
      {
        label: '$sUrl',
        documentation: 'The URL.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The type of URL to be tested for. It can be one of the following values.$URLIS_APPLIABLE$URLIS_DIRECTORY$URLIS_FILEURL$URLIS_HASQUERY$URLIS_NOHISTORY$URLIS_OPAQUE$URLIS_URL (Default)',
      },
    ],
  },
  _WinAPI_UserHandleGrantAccess: {
    documentation:
      'Grants or denies access to a handle to a User object to a job that has a user-interface restriction',
    label: '_WinAPI_UserHandleGrantAccess ( $hObject, $hJob, $bGrant )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the User object.',
      },
      {
        label: '$hJob',
        documentation: 'Handle to the job to be granted access to the User handle.',
      },
      {
        label: '$bGrant',
        documentation:
          'Specifies whether to grant or deny access to the User handle, valid values:True - The processes associated with the job can recognize and use the handle.False - The processes cannot use the handle.',
      },
    ],
  },
  _WinAPI_ValidateRect: {
    documentation: 'Removes a rectangle from the current update region of the specified window',
    label: '_WinAPI_ValidateRect ( $hWnd [, $tRECT = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to the window whose update region is to be modified. If this parameter is 0, the systeminvalidates and redraws all windows and sends the WM_ERASEBKGND and WM_NCPAINT messages to the windowprocedure before the function returns.',
      },
      {
        label: '$tRECT',
        documentation:
          '**[optional]** $tagRECT structure that contains the client coordinates of the rectangle to be removed from theupdate region. If this parameter is 0 (Default), the entire client area is removed.',
      },
    ],
  },
  _WinAPI_ValidateRgn: {
    documentation: 'Removes a region from the current update region of the specified window',
    label: '_WinAPI_ValidateRgn ( $hWnd [, $hRgn = 0] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose update region is to be modified.',
      },
      {
        label: '$hRgn',
        documentation:
          '**[optional]** Handle to a region that defines the area to be removed from the update region. If this parameter is 0 (Default),the entire client area is removed.',
      },
    ],
  },
  _WinAPI_VerQueryRoot: {
    documentation:
      'Retrieves the fixed version information from the specified version-information resource',
    label: '_WinAPI_VerQueryRoot ( $pData )',
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the version-information resource returned by the_WinAPI_GetFileVersionInfo() function.',
      },
    ],
  },
  _WinAPI_VerQueryValue: {
    documentation:
      'Retrieves the non-fixed (strings) version information from the specified version-information resource',
    label: "_WinAPI_VerQueryValue ( $pData [, $sValues = ''] )",
    params: [
      {
        label: '$pData',
        documentation:
          'A pointer to the buffer that contains the version-information resource returned by the_WinAPI_GetFileVersionInfo() function.',
      },
      {
        label: '$sValues',
        documentation:
          '**[optional]** The string containing the field names for which you want to get values. The names must be separated by a "|".For example, "name1|name2|...|namei". If some fields do not exist, the corresponding array elements is an empty string.If this parameter is not specified (empty string), uses the reserved names (12) in the following sequence:    $FV_COMMENTS ("Comments")    $FV_COMPANYNAME ("CompanyName")    $FV_FILEDESCRIPTION ("FileDescription")    $FV_FILEVERSION ("FileVersion")    $FV_INTERNALNAME ("InternalName")    $FV_LEGALCOPYRIGHT ("LegalCopyright")    $FV_LEGALTRADEMARKS ("LegalTrademarks")    $FV_ORIGINALFILENAME ("OriginalFilename")    $FV_PRODUCTNAME ("ProductName")    $FV_PRODUCTVERSION ("ProductVersion")    $FV_PRIVATEBUILD ("PrivateBuild")    $FV_SPECIALBUILD ("SpecialBuild")Constants are defined in FileConstants.au3.',
      },
    ],
  },
  _WinAPI_VerQueryValueEx: {
    documentation:
      'Retrieves the text information from the version-information resource of the specified binary module',
    label: "_WinAPI_VerQueryValueEx ( $hModule [, $sValues = '' [, $iLanguage = 0x0400]] )",
    params: [
      {
        label: '$hModule',
        documentation:
          'The handle to a module to retrieve information. Also, this parameter can specify the name of themodule to load, it must be a full or relative path. If this parameter is 0 or an empty string, that isequivalent to passing in a handle to the module used to create the current process.',
      },
      {
        label: '$sValues',
        documentation:
          '**[optional]** The string containing the field names for which you want to get values. The names must be separated by a "|".For example, "name1|name2|...|namei". If some fields do not exist, the corresponding array elements is an empty string.If this parameter is not specified (empty string), uses the reserved names (12) in the following sequence:    $FV_COMMENTS ("Comments")    $FV_COMPANYNAME ("CompanyName")    $FV_FILEDESCRIPTION ("FileDescription")    $FV_FILEVERSION ("FileVersion")    $FV_INTERNALNAME ("InternalName")    $FV_LEGALCOPYRIGHT ("LegalCopyright")    $FV_LEGALTRADEMARKS ("LegalTrademarks")    $FV_ORIGINALFILENAME ("OriginalFilename")    $FV_PRODUCTNAME ("ProductName")    $FV_PRODUCTVERSION ("ProductVersion")    $FV_PRIVATEBUILD ("PrivateBuild")    $FV_SPECIALBUILD ("SpecialBuild")Constants are defined in FileConstants.au3.',
      },
      {
        label: '$iLanguage',
        documentation:
          '**[optional]** The language identifier of the version-information resource of interest. To retrieve information foruser default language set this parameter to $LOCALE_USER_DEFAULT (Default). To retrieve information for alllanguages that are located in the resource set this parameter to (-1).',
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
  _WinAPI_WidenPath: {
    documentation:
      'Redefines the current path as the area that would be painted if the path were stroked',
    label: '_WinAPI_WidenPath ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation: 'Handle to a device context that contains a closed path.',
      },
    ],
  },
  _WinAPI_WindowFromDC: {
    documentation:
      'Retrieves a handle to the window associated with the specified display device context (DC)',
    label: '_WinAPI_WindowFromDC ( $hDC )',
    params: [
      {
        label: '$hDC',
        documentation:
          'Handle to the device context from which a handle to the associated window is to be retrieved.',
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
  _WinAPI_Wow64EnableWow64FsRedirection: {
    documentation: 'Enables or disables file system redirection for the calling thread',
    label: '_WinAPI_Wow64EnableWow64FsRedirection ( $bEnable )',
    params: [
      {
        label: '$bEnable',
        documentation:
          'Specifies whether enable or disable the WOW64 system folder redirection, valid values:    True - Enable.    False - Disable.',
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
  _WinAPI_ZeroMemory: {
    documentation: 'Fills a block of memory with zeros',
    label: '_WinAPI_ZeroMemory ( $pMemory, $iLength )',
    params: [
      {
        label: '$pMemory',
        documentation: 'A pointer to the starting address of a memory to be filled.',
      },
      {
        label: '$iLength',
        documentation: 'The number of bytes to be filled.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
