import ai_functions from './ai_functions';
import keywords from './keywords';
import macros from './macros';
import { hovers as udf_array } from '../signatures/udf_array';
import { hovers as udf_clipboard } from '../signatures/udf_clipboard';
import { hovers as udf_color } from '../signatures/udf_color';
import { hovers as udf_crypt } from '../signatures/udf_crypt';
import { hovers as udf_date } from '../signatures/udf_date';
import { hovers as udf_eventlog } from '../signatures/udf_eventlog';
import { hovers as udf_excel } from '../signatures/udf_excel';
import { hovers as udf_file } from '../signatures/udf_file';
import { hovers as udf_ftpex } from '../signatures/udf_ftp';
import { hovers as udf_gdiplus } from '../signatures/udf_gdiplus';
import { hovers as udf_guiavi } from '../signatures/udf_guictrlavi';
import { hovers as udf_guibutton } from '../signatures/udf_guictrlbutton';
import { hovers as udf_guicombobox } from '../signatures/udf_guictrlcombobox';
import { hovers as udf_guicomboboxex } from '../signatures/udf_guictrlcomboboxex';
import { hovers as udf_guiDateTimePicker } from '../signatures/udf_guictrldtp';
import { hovers as udf_guiEdit } from '../signatures/udf_guictrledit';
import { hovers as udf_guiHeader } from '../signatures/udf_guictrlheader';
import { hovers as udf_guiImageList } from '../signatures/udf_guiimagelist';
import { hovers as udf_guiIPAdress } from '../signatures/udf_guictrlipaddress';
import { hovers as udf_guiListBox } from '../signatures/udf_guictrllistbox';
import { hovers as udf_guiListView } from '../signatures/udf_guictrllistview';
import { hovers as udf_guiMenu } from '../signatures/udf_guictrlmenu';
import { hovers as udf_guiMonthCal } from '../signatures/udf_guictrlmonthcal';
import { hovers as udf_guiReBar } from '../signatures/udf_guictrlrebar';
import { hovers as udf_guiRichEdit } from '../signatures/udf_guictrlrichedit';
import { hovers as udf_guiScrollBars } from '../signatures/udf_guiscrollbars';
import { hovers as udf_guiSlider } from '../signatures/udf_guictrlslider';
import { hovers as udf_guiStatusBar } from '../signatures/udf_guictrlstatusbar';
import { hovers as udf_guiTab } from '../signatures/udf_guictrltab';
import { hovers as udf_guiToolbar } from '../signatures/udf_guictrltoolbar';
import { hovers as udf_guiToolTip } from '../signatures/udf_guitooltip';
import { hovers as udf_guiTreeView } from '../signatures/udf_guictrltreeview';
import { hovers as udf_ie } from '../signatures/udf_ie';
import { hovers as udf_inet } from '../signatures/udf_inet';
import { hovers as udf_math } from '../signatures/udf_math';
import { hovers as udf_memory } from '../signatures/udf_memory';
import { hovers as udf_misc } from '../signatures/udf_misc';
import { hovers as udf_namedpipes } from '../signatures/udf_namedpipes';
import { hovers as udf_netshare } from '../signatures/udf_netshare';
import { hovers as udf_process } from '../signatures/udf_process';
import { hovers as udf_screencapture } from '../signatures/udf_screencapture';
import { hovers as udf_security } from '../signatures/udf_security';
import { hovers as udf_sendmessage } from '../signatures/udf_sendmessage';
import { hovers as udf_sound } from '../signatures/udf_sound';
import { hovers as udf_sqlite } from '../signatures/udf_sqlite';
import { hovers as udf_string } from '../signatures/udf_string';
import { hovers as udf_timers } from '../signatures/udf_timers';
import { hovers as udf_winAPI } from '../signatures/udf_winapi';
import udf_visa from './udf_visa';
import udf_winAPIExCOM from './udf_winAPIExCOM';
import udf_winAPIExDiag from './udf_winAPIExDiag';
import udf_winAPIExDlg from './udf_winAPIExDlg';
import udf_winAPIExFiles from './udf_winAPIExFiles';
import udf_winAPIExGdi from './udf_winAPIExGdi';
import udf_winAPIExLocale from './udf_winAPIExLocale';
import udf_winAPIExMisc from './udf_winAPIExMisc';
import udf_winAPIExProc from './udf_winAPIExProc';
import udf_winAPIExReg from './udf_winAPIExReg';
import udf_winAPIExRes from './udf_winAPIExRes';
import udf_winAPIExShellEx from './udf_winAPIExShellEx';
import udf_winAPIExShPath from './udf_winAPIExShPath';
import udf_winAPIExSys from './udf_winAPIExSys';
import { hovers as udfWinAPITheme } from '../signatures/WinAPIEx/WinAPITheme';
import { hovers as udfWinNet } from '../signatures/udf_winnet';
import { hovers as udfWord } from '../signatures/udf_word';
import { hovers as udfDebug } from '../signatures/udf_debug';
import { hovers as InetConstants } from '../completions/constantsInet';
import {
  au3CheckDirectivesHovers,
  au3StripperDirectivesHovers,
  versioningDirectivesHovers,
  wrapperDirectivesHovers,
} from '../completions/directives';

const hoverImports = {
  ...ai_functions,
  ...keywords,
  ...macros,
  ...udf_array,
  ...udf_clipboard,
  ...udf_color,
  ...udf_crypt,
  ...udf_date,
  ...udf_eventlog,
  ...udf_excel,
  ...udf_file,
  ...udf_ftpex,
  ...udf_gdiplus,
  ...udf_guiavi,
  ...udf_guibutton,
  ...udf_guicombobox,
  ...udf_guicomboboxex,
  ...udf_guiDateTimePicker,
  ...udf_guiEdit,
  ...udf_guiHeader,
  ...udf_guiImageList,
  ...udf_guiIPAdress,
  ...udf_guiListBox,
  ...udf_guiListView,
  ...udf_guiMenu,
  ...udf_guiMonthCal,
  ...udf_guiReBar,
  ...udf_guiRichEdit,
  ...udf_guiScrollBars,
  ...udf_guiSlider,
  ...udf_guiStatusBar,
  ...udf_guiTab,
  ...udf_guiToolbar,
  ...udf_guiToolTip,
  ...udf_guiTreeView,
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
  ...udf_winAPI,
  ...udf_winAPIExCOM,
  ...udf_winAPIExDiag,
  ...udf_winAPIExDlg,
  ...udf_winAPIExFiles,
  ...udf_winAPIExGdi,
  ...udf_winAPIExLocale,
  ...udf_winAPIExMisc,
  ...udf_winAPIExProc,
  ...udf_winAPIExReg,
  ...udf_winAPIExRes,
  ...udf_winAPIExShellEx,
  ...udf_winAPIExShPath,
  ...udf_winAPIExSys,
  ...udfWinAPITheme,
  ...udfWinNet,
  ...udfWord,
  ...udfDebug,
  ...InetConstants,
  ...wrapperDirectivesHovers,
  ...au3StripperDirectivesHovers,
  ...au3CheckDirectivesHovers,
  ...versioningDirectivesHovers,
};

const hovers = Object.fromEntries(
  Object.entries(hoverImports).map(([key, value]) => [key.toLowerCase(), value]),
);

export default hovers;
