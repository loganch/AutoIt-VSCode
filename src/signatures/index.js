import mainFunctions from './functions';
import keywords from './keywords';
import macros from './macros';
import debug from './udf_debug';
import word from './udf_word';
import winnet from './udf_winnet';
import WinAPITheme from './WinAPIEx/WinAPITheme';
import WinAPICom from './WinAPIEx/WinAPICom';
import WinAPIDiag from './WinAPIEx/WinAPIDiag';
import WinAPIDlg from './WinAPIEx/WinAPIDlg';
import WinAPIFiles from './WinAPIEx/WinAPIFiles';
import WinAPIGdi from './WinAPIEx/WinAPIGdi';
import WinAPILocale from './WinAPIEx/WinAPILocale';
import WinAPIMisc from './WinAPIEx/WinAPIMisc';
import WinAPIProc from './WinAPIEx/WinAPIProc';
import WinAPIReg from './WinAPIEx/WinAPIReg';
import WinAPIRes from './WinAPIEx/WinAPIRes';
import WinAPIShellEx from './WinAPIEx/WinAPIShellEx';
import WinAPIShPath from './WinAPIEx/WinAPIShPath';
import WinAPISys from './WinAPIEx/WinAPISys';
import udf_array from './udf_array';
import udf_clipboard from './udf_clipboard';
import udf_color from './udf_color';
import udf_crypt from './udf_crypt';
import udf_date from './udf_date';
import udf_eventlog from './udf_eventlog';
import udf_excel from './udf_excel';
import udf_file from './udf_file';
import udf_ftp from './udf_ftp';
import udf_gdiplus from './udf_gdiplus';
import udf_guictrlavi from './udf_guictrlavi';
import udf_guictrlbutton from './udf_guictrlbutton';
import udf_guictrlcombobox from './udf_guictrlcombobox';
import udf_guictrlcomboboxex from './udf_guictrlcomboboxex';
import udf_guictrldtp from './udf_guictrldtp';
import udf_guictrledit from './udf_guictrledit';
import udf_guictrlheader from './udf_guictrlheader';
import udf_guictrlipaddress from './udf_guictrlipaddress';
import udf_guictrllistbox from './udf_guictrllistbox';
import udf_guictrllistview from './udf_guictrllistview';
import udf_guictrlmenu from './udf_guictrlmenu';
import udf_guictrlmonthcal from './udf_guictrlmonthcal';
import udf_guictrlrebar from './udf_guictrlrebar';
import udf_guictrlrichedit from './udf_guictrlrichedit';
import udf_guictrlslider from './udf_guictrlslider';
import udf_guictrlstatusbar from './udf_guictrlstatusbar';
import udf_guictrltab from './udf_guictrltab';
import udf_guictrltoolbar from './udf_guictrltoolbar';
import udf_guictrltreeview from './udf_guictrltreeview';
import udf_guiimagelist from './udf_guiimagelist';
import udf_guiscrollbars from './udf_guiscrollbars';
import udf_guitooltip from './udf_guitooltip';
import udf_ie from './udf_ie';
import udf_inet from './udf_inet';
import udf_math from './udf_math';
import udf_memory from './udf_memory';
import udf_misc from './udf_misc';
import udf_namedpipes from './udf_namedpipes';
import udf_netshare from './udf_netshare';
import udf_process from './udf_process';
import udf_screencapture from './udf_screencapture';
import udf_security from './udf_security';
import udf_sendmessage from './udf_sendmessage';
import udf_sound from './udf_sound';
import udf_sqlite from './udf_sqlite';
import udf_string from './udf_string';
import udf_timers from './udf_timers';
import udf_visa from './udf_visa';
import udf_winapi from './udf_winapi';

const signatures = {
  ...mainFunctions,
  ...keywords,
  ...macros,
  ...debug,
  ...word,
  ...winnet,
  ...winnet,
  ...WinAPITheme,
  ...WinAPIDiag,
  ...WinAPIDlg,
  ...WinAPIFiles,
  ...WinAPIGdi,
  ...WinAPILocale,
  ...WinAPIMisc,
  ...WinAPIProc,
  ...WinAPIReg,
  ...WinAPIRes,
  ...WinAPIShellEx,
  ...WinAPIShPath,
  ...WinAPISys,
  ...udf_array,
  ...udf_clipboard,
  ...udf_color,
  ...udf_crypt,
  ...udf_date,
  ...udf_eventlog,
  ...udf_excel,
  ...udf_file,
  ...udf_ftp,
  ...udf_gdiplus,
  ...udf_guictrlavi,
  ...udf_guictrlbutton,
  ...udf_guictrlcombobox,
  ...udf_guictrlcomboboxex,
  ...udf_guictrldtp,
  ...udf_guictrledit,
  ...udf_guictrlheader,
  ...udf_guictrlipaddress,
  ...udf_guictrllistbox,
  ...udf_guictrllistview,
  ...udf_guictrlmenu,
  ...udf_guictrlmonthcal,
  ...udf_guictrlrebar,
  ...udf_guictrlrichedit,
  ...udf_guictrlslider,
  ...udf_guictrlstatusbar,
  ...udf_guictrltab,
  ...udf_guictrltoolbar,
  ...udf_guictrltreeview,
  ...udf_guiimagelist,
  ...udf_guiscrollbars,
  ...udf_guitooltip,
  ...udf_ie,
  ...udf_inet,
  ...udf_math,
  ...udf_memory,
  ...udf_misc,
  ...udf_namedpipes,
  ...udf_netshare,
  ...udf_process,
  ...udf_screencapture,
  ...udf_security,
  ...udf_sendmessage,
  ...udf_sound,
  ...udf_sqlite,
  ...udf_string,
  ...udf_timers,
  ...udf_visa,
  ...udf_winapi,
};

export default signatures;
