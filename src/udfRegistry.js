// Single source of truth for the UDF / constant signature modules.
//
// Each module exports `completions` (or a default completions array) and,
// optionally, a `hovers` map. completions/index.js and hovers/index.js both
// derive their registries from this one list, so a new UDF is registered in
// one place and cannot be added to one index but forgotten in the other —
// the F5 tech-debt risk that motivated this file.

import * as functions from './signatures/functions';
import * as keywords from './signatures/keywords';
import * as macros from './signatures/macros';
import * as udf_array from './signatures/udf_array';
import * as udf_clipboard from './signatures/udf_clipboard';
import * as udf_color from './signatures/udf_color';
import * as udf_crypt from './signatures/udf_crypt';
import * as udf_date from './signatures/udf_date';
import * as udf_debug from './signatures/udf_debug';
import * as udf_eventlog from './signatures/udf_eventlog';
import * as udf_excel from './signatures/udf_excel';
import * as udf_file from './signatures/udf_file';
import * as udf_ftp from './signatures/udf_ftp';
import * as udf_gdiplus from './signatures/udf_gdiplus';
import * as udf_guictrlavi from './signatures/udf_guictrlavi';
import * as udf_guictrlbutton from './signatures/udf_guictrlbutton';
import * as udf_guictrlcombobox from './signatures/udf_guictrlcombobox';
import * as udf_guictrlcomboboxex from './signatures/udf_guictrlcomboboxex';
import * as udf_guictrldtp from './signatures/udf_guictrldtp';
import * as udf_guictrledit from './signatures/udf_guictrledit';
import * as udf_guictrlheader from './signatures/udf_guictrlheader';
import * as udf_guiimagelist from './signatures/udf_guiimagelist';
import * as udf_guictrlipaddress from './signatures/udf_guictrlipaddress';
import * as udf_guictrllistbox from './signatures/udf_guictrllistbox';
import * as udf_guictrllistview from './signatures/udf_guictrllistview';
import * as udf_guictrlmenu from './signatures/udf_guictrlmenu';
import * as udf_guictrlmonthcal from './signatures/udf_guictrlmonthcal';
import * as udf_guictrlrebar from './signatures/udf_guictrlrebar';
import * as udf_guictrlrichedit from './signatures/udf_guictrlrichedit';
import * as udf_guiscrollbars from './signatures/udf_guiscrollbars';
import * as udf_guictrlslider from './signatures/udf_guictrlslider';
import * as udf_guictrlstatusbar from './signatures/udf_guictrlstatusbar';
import * as udf_guictrltab from './signatures/udf_guictrltab';
import * as udf_guictrltoolbar from './signatures/udf_guictrltoolbar';
import * as udf_guitooltip from './signatures/udf_guitooltip';
import * as udf_guictrltreeview from './signatures/udf_guictrltreeview';
import * as udf_ie from './signatures/udf_ie';
import * as udf_inet from './signatures/udf_inet';
import * as udf_math from './signatures/udf_math';
import * as udf_memory from './signatures/udf_memory';
import * as udf_misc from './signatures/udf_misc';
import * as udf_namedpipes from './signatures/udf_namedpipes';
import * as udf_netshare from './signatures/udf_netshare';
import * as udf_process from './signatures/udf_process';
import * as udf_screencapture from './signatures/udf_screencapture';
import * as udf_security from './signatures/udf_security';
import * as udf_sendmessage from './signatures/udf_sendmessage';
import * as udf_sound from './signatures/udf_sound';
import * as udf_sqlite from './signatures/udf_sqlite';
import * as udf_string from './signatures/udf_string';
import * as udf_timers from './signatures/udf_timers';
import * as udf_visa from './signatures/udf_visa';
import * as udf_winapi from './signatures/udf_winapi';
import * as udf_winnet from './signatures/udf_winnet';
import * as udf_word from './signatures/udf_word';
import * as udf_winapi_com from './signatures/WinAPIEx/WinAPICom';
import * as udf_winapi_diag from './signatures/WinAPIEx/WinAPIDiag';
import * as udf_winapi_dlg from './signatures/WinAPIEx/WinAPIDlg';
import * as udf_winapi_files from './signatures/WinAPIEx/WinAPIFiles';
import * as udf_winapi_gdi from './signatures/WinAPIEx/WinAPIGdi';
import * as udf_winapi_locale from './signatures/WinAPIEx/WinAPILocale';
import * as udf_winapi_misc from './signatures/WinAPIEx/WinAPIMisc';
import * as udf_winapi_proc from './signatures/WinAPIEx/WinAPIProc';
import * as udf_winapi_reg from './signatures/WinAPIEx/WinAPIReg';
import * as udf_winapi_res from './signatures/WinAPIEx/WinAPIRes';
import * as udf_winapi_shellex from './signatures/WinAPIEx/WinAPIShellEx';
import * as udf_winapi_shpath from './signatures/WinAPIEx/WinAPIShPath';
import * as udf_winapi_sys from './signatures/WinAPIEx/WinAPISys';
import * as udf_winapi_theme from './signatures/WinAPIEx/WinAPITheme';
import * as sendKeys from './completions/send_keys';
import * as aviConstants from './completions/constants_avi';
import * as buttonConstants from './completions/constants_buttonconstants';
import * as comboConstants from './completions/constants_combo';
import * as dateTimeConstants from './completions/constants_datetime';
import * as dirConstants from './completions/constants_dir';
import * as editConstants from './completions/constants_edit';
import * as excelConstants from './completions/constants_excel';
import * as fileConstants from './completions/constants_file';
import * as fontConstants from './completions/constants_font';
import * as frameConstants from './completions/constants_frame';
import * as gdiplusConstants from './completions/constants_gdiplus';
import * as listBoxConstants from './completions/constants_listbox';
import * as listViewConstants from './completions/constants_listview';
import * as msgBoxConstants from './completions/constants_msgbox';
import * as progressConstants from './completions/constants_progress';
import * as sliderConstants from './completions/constants_slider';
import * as staticConstants from './completions/constants_static';
import * as statusBarConstants from './completions/constants_statusbar';
import * as stringConstants from './completions/constants_string';
import * as tabConstants from './completions/constants_tab';
import * as trayConstants from './completions/constants_tray';
import * as treeViewConstants from './completions/constants_treeview';
import * as upDownConstants from './completions/constants_updown';
import * as windowsConstants from './completions/constants_windows';
import * as wordConstants from './completions/constants_word';
import * as inetConstants from './completions/constantsInet';
import * as directives from './completions/directives';

// Every entry contributes both its completions and (if present) its hovers.
const modules = [
  functions,
  keywords,
  macros,
  udf_array,
  udf_clipboard,
  udf_color,
  udf_crypt,
  udf_date,
  udf_debug,
  udf_eventlog,
  udf_excel,
  udf_file,
  udf_ftp,
  udf_gdiplus,
  udf_guictrlavi,
  udf_guictrlbutton,
  udf_guictrlcombobox,
  udf_guictrlcomboboxex,
  udf_guictrldtp,
  udf_guictrledit,
  udf_guictrlheader,
  udf_guiimagelist,
  udf_guictrlipaddress,
  udf_guictrllistbox,
  udf_guictrllistview,
  udf_guictrlmenu,
  udf_guictrlmonthcal,
  udf_guictrlrebar,
  udf_guictrlrichedit,
  udf_guiscrollbars,
  udf_guictrlslider,
  udf_guictrlstatusbar,
  udf_guictrltab,
  udf_guictrltoolbar,
  udf_guitooltip,
  udf_guictrltreeview,
  udf_ie,
  udf_inet,
  udf_math,
  udf_memory,
  udf_misc,
  udf_namedpipes,
  udf_netshare,
  udf_process,
  udf_screencapture,
  udf_security,
  udf_sendmessage,
  udf_sound,
  udf_sqlite,
  udf_string,
  udf_timers,
  udf_visa,
  udf_winapi,
  udf_winnet,
  udf_word,
  udf_winapi_com,
  udf_winapi_diag,
  udf_winapi_dlg,
  udf_winapi_files,
  udf_winapi_gdi,
  udf_winapi_locale,
  udf_winapi_misc,
  udf_winapi_proc,
  udf_winapi_reg,
  udf_winapi_res,
  udf_winapi_shellex,
  udf_winapi_shpath,
  udf_winapi_sys,
  udf_winapi_theme,
  sendKeys, // completions only — no hovers
  aviConstants,
  buttonConstants,
  comboConstants,
  dateTimeConstants,
  dirConstants,
  editConstants,
  excelConstants,
  fileConstants,
  fontConstants,
  frameConstants,
  gdiplusConstants,
  listBoxConstants,
  listViewConstants,
  msgBoxConstants,
  progressConstants,
  sliderConstants,
  staticConstants,
  statusBarConstants,
  stringConstants,
  tabConstants,
  trayConstants,
  treeViewConstants,
  upDownConstants,
  windowsConstants,
  wordConstants,
  inetConstants,
];

const moduleCompletions = mod => mod.completions ?? mod.default ?? [];
const moduleHovers = mod => mod.hovers ?? {};

// directives is the one irregular module: it bundles four directive sets,
// each with its own completion array and hover map.
const directiveCompletions = [
  directives.default,
  directives.au3StripperDirectivesCompletionItems,
  directives.au3CheckDirectivesCompletionItems,
  directives.versioningDirectivesCompletionItems,
];
const directiveHovers = [
  directives.wrapperDirectivesHovers,
  directives.au3StripperDirectivesHovers,
  directives.au3CheckDirectivesHovers,
  directives.versioningDirectivesHovers,
];

export const completions = [...modules.flatMap(moduleCompletions), ...directiveCompletions.flat()];

export const hovers = Object.assign({}, ...modules.map(moduleHovers), ...directiveHovers);
