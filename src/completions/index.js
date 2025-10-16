import AVI from './constants_avi';
import ButtonConstants from './constants_buttonconstants';
import ComboConstants from './constants_combo';
import DateTimeConstants from './constants_datetime';
import DirConstants from './constants_dir';
import EditConstants from './constants_edit';
import ExcelConstants from './constants_excel';
import FileConstants from './constants_file';
import FontConstants from './constants_font';
import FrameConstants from './constants_frame';
import GDIPlusConstants from './constants_gdiplus';
import ListBoxConstants from './constants_listbox';
import ListViewConstants from './constants_listview';
import MsgBoxConstants from './constants_msgbox';
import ProgressConstants from './constants_progress';
import SliderConstants from './constants_slider';
import StaticConstants from './constants_static';
import StatusBarConstants from './constants_statusbar';
import StringConstants from './constants_string';
import TabConstants from './constants_tab';
import TrayConstants from './constants_tray';
import TreeViewConstants from './constants_treeview';
import UpDownConstants from './constants_updown';
import WindowsConstants from './constants_windows';
import WordConstants from './constants_word';
import { completions as KEYWORDS } from '../signatures/keywords';
import { completions as MACROS } from '../signatures/macros';
import { completions as MAIN_FUNCTIONS } from '../signatures/functions';
import SendKeys from './send_keys';
import Debug from './udf_debug';
import { completions as Visa } from '../signatures/udf_visa';
import { completions as ArrayUDF } from '../signatures/udf_array';
import { completions as Clipboard } from '../signatures/udf_clipboard';
import { completions as ColorUDF } from '../signatures/udf_color';
import { completions as Crypt } from '../signatures/udf_crypt';
import { completions as DateUDF } from '../signatures/udf_date';
import { completions as EventLog } from '../signatures/udf_eventlog';
import { completions as Excel } from '../signatures/udf_excel';
import { completions as FileUDF } from '../signatures/udf_file';
import { completions as FTPEx } from '../signatures/udf_ftp';
import { completions as GDIPlus } from '../signatures/udf_gdiplus';
import { completions as GuiAVI } from '../signatures/udf_guictrlavi';
import { completions as GuiButton } from '../signatures/udf_guictrlbutton';
import { completions as GuiComboBox } from '../signatures/udf_guictrlcombobox';
import { completions as GuiComboBoxEx } from '../signatures/udf_guictrlcomboboxex';
import { completions as GuiDTP } from '../signatures/udf_guictrldtp';
import { completions as GuiEdit } from '../signatures/udf_guictrledit';
import { completions as GuiHeader } from '../signatures/udf_guictrlheader';
import { completions as GuiImageList } from '../signatures/udf_guiimagelist';
import { completions as GuiIPAddress } from '../signatures/udf_guictrlipaddress';
import { completions as GuiListBox } from '../signatures/udf_guictrllistbox';
import { completions as GuiListView } from '../signatures/udf_guictrllistview';
import { completions as GuiMenu } from '../signatures/udf_guictrlmenu';
import { completions as GuiMonthCal } from '../signatures/udf_guictrlmonthcal';
import { completions as GuiReBar } from '../signatures/udf_guictrlrebar';
import { completions as GuiRichEdit } from '../signatures/udf_guictrlrichedit';
import { completions as GuiScrollBars } from '../signatures/udf_guiscrollbars';
import { completions as GuiSlider } from '../signatures/udf_guictrlslider';
import { completions as GuiStatusBar } from '../signatures/udf_guictrlstatusbar';
import { completions as GuiTab } from '../signatures/udf_guictrltab';
import { completions as GuiToolbar } from '../signatures/udf_guictrltoolbar';
import { completions as GuiToolTip } from '../signatures/udf_guitooltip';
import { completions as GuiTreeView } from '../signatures/udf_guictrltreeview';
import { completions as IE } from '../signatures/udf_ie';
import { completions as Inet } from '../signatures/udf_inet';
import { completions as MathUDF } from '../signatures/udf_math';
import { completions as Misc } from '../signatures/udf_misc';
import { completions as NamedPipes } from '../signatures/udf_namedpipes';
import { completions as NetShare } from '../signatures/udf_netshare';
import { completions as ScreenCapture } from '../signatures/udf_screencapture';
import { completions as Security } from '../signatures/udf_security';
import { completions as SendMessage } from '../signatures/udf_sendmessage';
import { completions as Sound } from '../signatures/udf_sound';
import { completions as SQLite } from '../signatures/udf_sqlite';
import { completions as StringUDF } from '../signatures/udf_string';
import { completions as Timers } from '../signatures/udf_timers';
import { completions as WinAPI } from '../signatures/udf_winapi';
import { completions as WinAPICom } from '../signatures/WinAPIEx/WinAPICom';
import { completions as WinAPIDiag } from '../signatures/WinAPIEx/WinAPIDiag';
import { completions as WinAPIDlg } from '../signatures/WinAPIEx/WinAPIDlg';
import { completions as WinAPIFiles } from '../signatures/WinAPIEx/WinAPIFiles';
import { completions as WinAPIGdi } from '../signatures/WinAPIEx/WinAPIGdi';
import { completions as WinAPILocale } from '../signatures/WinAPIEx/WinAPILocale';
import { completions as WinAPIMisc } from '../signatures/WinAPIEx/WinAPIMisc';
import { completions as WinAPIProc } from '../signatures/WinAPIEx/WinAPIProc';
import { completions as WinAPIReg } from '../signatures/WinAPIEx/WinAPIReg';
import { completions as WinAPIRes } from '../signatures/WinAPIEx/WinAPIRes';
import { completions as WinAPIShellEx } from '../signatures/WinAPIEx/WinAPIShellEx';
import { completions as WinAPIShPath } from '../signatures/WinAPIEx/WinAPIShPath';
import { completions as WinAPISys } from '../signatures/WinAPIEx/WinAPISys';
import { completions as WinAPITheme } from '../signatures/WinAPIEx/WinAPITheme';
import { completions as WinNet } from '../signatures/udf_winnet';
import { completions as Word } from '../signatures/udf_word';
import InetConstants from './constantsInet';
import wrapperDirectivesCompletionItems, {
  au3CheckDirectivesCompletionItems,
  au3StripperDirectivesCompletionItems,
  versioningDirectivesCompletionItems,
} from './directives';

const completions = [
  ...AVI,
  ...ButtonConstants,
  ...Clipboard,
  ...ComboConstants,
  ...DateTimeConstants,
  ...DirConstants,
  ...EditConstants,
  ...ExcelConstants,
  ...FileConstants,
  ...FontConstants,
  ...FrameConstants,
  ...GDIPlusConstants,
  ...ListBoxConstants,
  ...ListViewConstants,
  ...MsgBoxConstants,
  ...ProgressConstants,
  ...SliderConstants,
  ...StaticConstants,
  ...StatusBarConstants,
  ...StringConstants,
  ...TabConstants,
  ...TrayConstants,
  ...TreeViewConstants,
  ...UpDownConstants,
  ...WindowsConstants,
  ...WordConstants,
  ...KEYWORDS,
  ...MACROS,
  ...MAIN_FUNCTIONS,
  ...SendKeys,
  ...Clipboard,
  ...ArrayUDF,
  ...ColorUDF,
  ...Crypt,
  ...DateUDF,
  ...Debug,
  ...EventLog,
  ...Excel,
  ...FileUDF,
  ...FTPEx,
  ...GDIPlus,
  ...GuiAVI,
  ...GuiButton,
  ...GuiComboBox,
  ...GuiComboBoxEx,
  ...GuiDTP,
  ...GuiEdit,
  ...GuiHeader,
  ...GuiImageList,
  ...GuiIPAddress,
  ...GuiListBox,
  ...GuiListView,
  ...GuiMenu,
  ...GuiMonthCal,
  ...GuiReBar,
  ...GuiRichEdit,
  ...GuiScrollBars,
  ...GuiSlider,
  ...GuiStatusBar,
  ...GuiTab,
  ...GuiToolbar,
  ...GuiToolTip,
  ...GuiTreeView,
  ...IE,
  ...Inet,
  ...MathUDF,
  ...Misc,
  ...NamedPipes,
  ...NetShare,
  ...ScreenCapture,
  ...Security,
  ...SendMessage,
  ...Sound,
  ...SQLite,
  ...StringUDF,
  ...Timers,
  ...Visa,
  ...WinAPI,
  ...WinAPICom,
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
  ...WinAPITheme,
  ...WinNet,
  ...Word,
  ...InetConstants,
  ...wrapperDirectivesCompletionItems,
  ...au3StripperDirectivesCompletionItems,
  ...au3CheckDirectivesCompletionItems,
  ...versioningDirectivesCompletionItems,
];

export default completions;
