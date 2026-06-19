import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$WS_BORDER',
    documentation: 'Creates a window that has a thin-line border.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_POPUP',
    documentation: 'Creates a pop-up window. This style cannot be used with the WS_CHILD style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_CAPTION',
    documentation: 'Creates a window that has a title bar (includes the WS_BORDER style)',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_CLIPCHILDREN',
    documentation:
      'Excludes the area occupied by child windows when drawing occurs within the parent window. This style is used when creating the parent window.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_CLIPSIBLINGS',
    documentation:
      'Clips child windows relative to each other; that is, when a particular child window receives a WM_PAINT message, the WS_CLIPSIBLINGS style clips all other overlapping child windows out of the region of the child window to be updated. If WS_CLIPSIBLINGS is not specified and child windows overlap, it is possible, when drawing within the client area of a child window, to draw within the client area of a neighboring child window.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_DISABLED',
    documentation: 'Creates a window that is initially disabled.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_DLGFRAME',
    documentation:
      'Creates a window that has a border of a style typically used with dialog boxes.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_HSCROLL',
    documentation: 'Creates a window that has a horizontal scroll bar.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_MAXIMIZE',
    documentation: 'Creates a window that is initially maximized.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_MAXIMIZEBOX',
    documentation:
      'Creates a window that has a maximize button. Cannot be combined with the WS_EX_CONTEXTHELP style. The WS_SYSMENU style must also be specified.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_MINIMIZE',
    documentation: 'Creates a window that is initially minimized.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_MINIMIZEBOX',
    documentation:
      'Creates a window that has a minimize button. Cannot be combined with the WS_EX_CONTEXTHELP style. The WS_SYSMENU style must also be specified.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_OVERLAPPED',
    documentation:
      'Creates an overlapped window. An overlapped window has a title bar and a border. Same as the WS_TILED style',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_OVERLAPPEDWINDOW',
    documentation:
      'Creates an overlapped window with the WS_OVERLAPPED, WS_CAPTION, WS_SYSMENU, WS_THICKFRAME, WS_MINIMIZEBOX, and WS_MAXIMIZEBOX styles. Same as the WS_TILEDWINDOW style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_POPUPWINDOW',
    documentation:
      'Creates a pop-up window with WS_BORDER, WS_POPUP, and WS_SYSMENU styles. The WS_CAPTION and WS_POPUPWINDOW styles must be combined to make the window menu visible.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_SIZEBOX',
    documentation: 'Creates a window that has a sizing border. Same as the WS_THICKFRAME style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_SYSMENU',
    documentation:
      'Creates a window that has a window menu on its title bar. The WS_CAPTION style must also be specified.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_THICKFRAME',
    documentation: 'Creates a window that has a sizing border. Same as the WS_SIZEBOX style',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_VSCROLL',
    documentation: 'Creates a window that has a vertical scroll bar.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_VISIBLE',
    documentation: 'Creates a window that is initially visible.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_CHILD',
    documentation:
      'Creates a child window. A window with this style cannot have a menu bar. This style cannot be used with the WS_POPUP style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_GROUP',
    documentation:
      'Specifies the first control of a group of controls. The group consists of this first control and all controls defined after it, up to the next control with the WS_GROUP style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_TABSTOP',
    documentation:
      'Turns the control into a tab stop, which enables the user to select the control by tabbing through the controls in a dialog box.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$DS_MODALFRAME',
    documentation:
      'Creates a dialog box with a modal dialog-box frame that can be combined with a title bar and window menu by specifying the WS_CAPTION and WS_SYSMENU styles.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$DS_SETFOREGROUND',
    documentation:
      'This style is useful for modal dialog boxes that require immediate attention from the user regardless of whether the owner window is the foreground window.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$DS_CONTEXTHELP',
    documentation:
      'Includes a question mark in the title bar of the dialog box. Cannot be used with the WS_MAXIMIZEBOX or WS_MINIMIZEBOX styles. Same as WS_EX_CONTEXTHELP extended style.',
    detail: 'WindowsConstants Control Style',
  },
  {
    label: '$WS_EX_ACCEPTFILES',
    documentation:
      'Allow an edit or input control within the created GUI window to receive filenames via drag and drop. The control must have also the $GUI_DROPACCEPTED state set by GUICtrlSetState. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_APPWINDOW',
    documentation: 'Forces a top-level window onto the taskbar when the window is visible. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_COMPOSITED',
    documentation:
      'Paints all descendants of a window in bottom-to-top painting order using double-buffering. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_CLIENTEDGE',
    documentation: 'Specifies that a window has a border with a sunken edge. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_CONTEXTHELP',
    documentation:
      'Includes a question mark in the title bar of the window. Cannot be used with the WS_MAXIMIZEBOX or WS_MINIMIZEBOX ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_DLGMODALFRAME',
    documentation:
      'Creates a window that has a double border; the window can, optionally, be created with a title bar by specifying the WS_CAPTION style in the dwStyle parameter. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_LAYOUTRTL',
    documentation:
      'Specifies that a window has a layout from right to left (RTL) instead of the standard left to right (LTR). ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_MDICHILD',
    documentation:
      'Create a child window that will be moved with its parent.(simulation of a MDI window maximize/minimize are not simulated). ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_OVERLAPPEDWINDOW',
    documentation: 'Combines the WS_EX_CLIENTEDGE and WS_EX_WINDOWEDGE styles. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_STATICEDGE',
    documentation:
      'Creates a window with a three-dimensional border style intended to be used for items that do not accept user input. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_TOPMOST',
    documentation:
      'Specifies that a window created with this style should be placed above all non-topmost windows and should stay above them, even when the window is deactivated. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_TRANSPARENT',
    documentation:
      'The window appears transparent because the bits of underlying sibling windows have already been painted. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_TOOLWINDOW',
    documentation:
      'Creates a tool window; that is, a window intended to be used as a floating toolbar. A tool window has a title bar that is shorter than a normal title bar, and the window title is drawn using a smaller font. A tool window does not appear in the taskbar or in the dialog box that appears when the user presses ALT+TAB. If a tool window has a system menu, its icon is not displayed on the title bar. However, you can display the system menu by typing ALT+SPACE. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_WINDOWEDGE',
    documentation: 'Specifies that a window has a border with a raised edge. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$WS_EX_LAYERED',
    documentation: 'Creates a layered window. Note that this cannot be used for child windows. ',
    detail: 'WindowsConstant Extended Control Style',
  },
  {
    label: '$GUI_WS_EX_PARENTDRAG',
    documentation:
      'Allow the label or pic control to be used as the title bar to drag the whole the parent window. (Needs #include <GUIConstantsEx.au3>) ',
    detail: 'WindowsConstant Extended Control Style',
  },

  // Windows Message Codes
  {
    label: '$WM_ACTIVATE',
    documentation:
      '= 0x0006. Sent to both the window being activated and the window being deactivated. If the windows use the same input queue, the message is sent synchronously, first to the window procedure of the top-level window being deactivated, then to the window procedure of the top-level window being activated. If the windows use different input queues, the message is sent asynchronously, so the window is activated immediately.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_ACTIVATEAPP',
    documentation:
      '= 0x001C. Sent when a window belonging to a different application than the active window is about to be activated. The message is sent to the application whose window is being activated and to the application whose window is being deactivated.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_AFXFIRST',
    documentation: '= 0x0360',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_AFXLAST',
    documentation: '= 0x037F',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_APP',
    documentation:
      '= 0x8000. Used to define private messages, usually of the form WM_APP+x, where x is an integer value.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_APPCOMMAND',
    documentation:
      '= 0x0319. Notifies a window that the user generated an application command event, for example, by clicking an application command button using the mouse or typing an application command key on the keyboard.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_ASKCBFORMATNAME',
    documentation:
      '= 0x030C. Sent to the clipboard owner by a clipboard viewer window to request the name of a CF_OWNERDISPLAY clipboard format.\n\nA window receives this message through its WindowProc function.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_CANCELJOURNAL',
    documentation:
      "= 0x004B. Posted to an application when a user cancels the application's journaling activities. The message is posted with a NULL window handle.",
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_CANCELMODE',
    documentation: '= 0x001F. Sent to cancel certain modes, such as mouse capture.',
    detail: 'Windows Mesage Code',
  },
  {
    label: '$WM_CAPTURECHANGED',
    documentation: '= 0x0215.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CHANGECBCHAIN',
    documentation: '= 0x030D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CHANGEUISTATE',
    documentation: '= 0x0127.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CHAR',
    documentation: '= 0x0102.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CHARTOITEM',
    documentation: '= 0x002F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CHILDACTIVATE',
    documentation: '= 0x0022.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CLEAR',
    documentation: '= 0x0303.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CLOSE',
    documentation: '= 0x0010.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COMMAND',
    documentation: '= 0x0111.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COMMNOTIFY',
    documentation: '= 0x0044.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COMPACTING',
    documentation: '= 0x0041.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COMPAREITEM',
    documentation: '= 0x0039.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CONTEXTMENU',
    documentation: '= 0x007B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COPY',
    documentation: '= 0x0301.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_COPYDATA',
    documentation: '= 0x004A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CREATE',
    documentation: '= 0x0001.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORBTN',
    documentation: '= 0x0135.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORDLG',
    documentation: '= 0x0136.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLOREDIT',
    documentation: '= 0x0133.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORLISTBOX',
    documentation: '= 0x0134.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORMSGBOX',
    documentation: '= 0x0132.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORSCROLLBAR',
    documentation: '= 0x0137.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CTLCOLORSTATIC',
    documentation: '= 0x0138.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_CUT',
    documentation: '= 0x0300.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DEADCHAR',
    documentation: '= 0x0103.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DELETEITEM',
    documentation: '= 0x002D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DESTROY',
    documentation: '= 0x0002.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DESTROYCLIPBOARD',
    documentation: '= 0x0307.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DEVICECHANGE',
    documentation: '= 0x0219.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DEVMODECHANGE',
    documentation: '= 0x001B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DISPLAYCHANGE',
    documentation: '= 0x007E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DRAWCLIPBOARD',
    documentation: '= 0x0308.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DRAWITEM',
    documentation: '= 0x002B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_DROPFILES',
    documentation: '= 0x0233.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ENABLE',
    documentation: '= 0x000A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ENDSESSION',
    documentation: '= 0x0016.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ENTERIDLE',
    documentation: '= 0x0121.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ENTERMENULOOP',
    documentation: '= 0x0211.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ENTERSIZEMOVE',
    documentation: '= 0x0231.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ERASEBKGND',
    documentation: '= 0x0014.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_EXITMENULOOP',
    documentation: '= 0x0212.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_EXITSIZEMOVE',
    documentation: '= 0x0232.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_FONTCHANGE',
    documentation: '= 0x001D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETDLGCODE',
    documentation: '= 0x0087.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETFONT',
    documentation: '= 0x0031.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETHOTKEY',
    documentation: '= 0x0033.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETICON',
    documentation: '= 0x007F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETMINMAXINFO',
    documentation: '= 0x0024.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETOBJECT',
    documentation: '= 0x003D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETTEXT',
    documentation: '= 0x000D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_GETTEXTLENGTH',
    documentation: '= 0x000E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HANDHELDFIRST',
    documentation: '= 0x0358.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HANDHELDLAST',
    documentation: '= 0x035F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HELP',
    documentation: '= 0x0053.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HOTKEY',
    documentation: '= 0x0312.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HSCROLL',
    documentation: '= 0x0114.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_HSCROLLCLIPBOARD',
    documentation: '= 0x030E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_ICONERASEBKGND',
    documentation: '= 0x0027.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_CHAR',
    documentation: '= 0x0286.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_COMPOSITION',
    documentation: '= 0x010F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_COMPOSITIONFULL',
    documentation: '= 0x0284.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_CONTROL',
    documentation: '= 0x0283.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_ENDCOMPOSITION',
    documentation: '= 0x010E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_KEYDOWN',
    documentation: '= 0x0290.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_KEYLAST',
    documentation: '= 0x010F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_KEYUP',
    documentation: '= 0x0291.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_NOTIFY',
    documentation: '= 0x0282.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_REQUEST',
    documentation: '= 0x0288.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_SELECT',
    documentation: '= 0x0285.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_SETCONTEXT',
    documentation: '= 0x0281.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_IME_STARTCOMPOSITION',
    documentation: '= 0x010D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INITDIALOG',
    documentation: '= 0x0110.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INITMENU',
    documentation: '= 0x0116.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INITMENUPOPUP',
    documentation: '= 0x0117.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INPUT',
    documentation: '= 0x00FF.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INPUTLANGCHANGE',
    documentation: '= 0x0051.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_INPUTLANGCHANGEREQUEST',
    documentation: '= 0x0050.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_KEYDOWN',
    documentation: '= 0x0100.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_KEYFIRST',
    documentation: '= 0x0100.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_KEYLAST',
    documentation: '= 0x0109.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_KEYUP',
    documentation: '= 0x0101.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_KILLFOCUS',
    documentation: '= 0x0008.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_LBUTTONDBLCLK',
    documentation: '= 0x0203.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_LBUTTONDOWN',
    documentation: '= 0x0201.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_LBUTTONUP',
    documentation: '= 0x0202.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MBUTTONDBLCLK',
    documentation: '= 0x0209.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MBUTTONDOWN',
    documentation: '= 0x0207.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MBUTTONUP',
    documentation: '= 0x0208.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIACTIVATE',
    documentation: '= 0x0222.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDICASCADE',
    documentation: '= 0x0227.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDICREATE',
    documentation: '= 0x0220.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIDESTROY',
    documentation: '= 0x0221.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIGETACTIVE',
    documentation: '= 0x0229.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIICONARRANGE',
    documentation: '= 0x0228.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIMAXIMIZE',
    documentation: '= 0x0225.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDINEXT',
    documentation: '= 0x0224.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIREFRESHMENU',
    documentation: '= 0x0234.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDIRESTORE',
    documentation: '= 0x0223.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDISETMENU',
    documentation: '= 0x0230.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MDITILE',
    documentation: '= 0x0226.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MEASUREITEM',
    documentation: '= 0x002C.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENUCHAR',
    documentation: '= 0x0120.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENUCOMMAND',
    documentation: '= 0x0126.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENUDRAG',
    documentation: '= 0x0123.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENUGETOBJECT',
    documentation: '= 0x0124.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENURBUTTONUP',
    documentation: '= 0x0122.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MENUSELECT',
    documentation: '= 0x011F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSEACTIVATE',
    documentation: '= 0x0021.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSEFIRST',
    documentation: '= 0x0200.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSEHOVER',
    documentation: '= 0x02A1.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSELEAVE',
    documentation: '= 0x02A3.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSEMOVE',
    documentation: '= 0x0200.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOUSEWHEEL',
    documentation: '= 0x020A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOVE',
    documentation: '= 0x0003.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_MOVING',
    documentation: '= 0x0216.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCACTIVATE',
    documentation: '= 0x0086.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCCALCSIZE',
    documentation: '= 0x0083.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCCREATE',
    documentation: '= 0x0081.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCDESTROY',
    documentation: '= 0x0082.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCHITTEST',
    documentation: '= 0x0084.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCLBUTTONDBLCLK',
    documentation: '= 0x00A3.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCLBUTTONDOWN',
    documentation: '= 0x00A1.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCLBUTTONUP',
    documentation: '= 0x00A2.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMBUTTONDBLCLK',
    documentation: '= 0x00A9.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMBUTTONDOWN',
    documentation: '= 0x00A7.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMBUTTONUP',
    documentation: '= 0x00A8.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMOUSEHOVER',
    documentation: '= 0x02A0.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMOUSELEAVE',
    documentation: '= 0x02A2.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCMOUSEMOVE',
    documentation: '= 0x00A0.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCPAINT',
    documentation: '= 0x0085.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCRBUTTONDBLCLK',
    documentation: '= 0x00A6.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCRBUTTONDOWN',
    documentation: '= 0x00A4.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCRBUTTONUP',
    documentation: '= 0x00A5.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCXBUTTONDBLCLK',
    documentation: '= 0x00AD.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCXBUTTONDOWN',
    documentation: '= 0x00AB.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NCXBUTTONUP',
    documentation: '= 0x00AC.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NEXTDLGCTL',
    documentation: '= 0x0028.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NEXTMENU',
    documentation: '= 0x0213.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NOTIFY',
    documentation: '= 0x004E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NOTIFYFORMAT',
    documentation: '= 0x0055.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_NULL',
    documentation: '= 0x0000.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PAINT',
    documentation: '= 0x000F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PAINTCLIPBOARD',
    documentation: '= 0x0309.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PAINTICON',
    documentation: '= 0x0026.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PALETTECHANGED',
    documentation: '= 0x0311.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PALETTEISCHANGING',
    documentation: '= 0x0310.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PARENTNOTIFY',
    documentation: '= 0x0210.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PASTE',
    documentation: '= 0x0302.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PENWINFIRST',
    documentation: '= 0x0380.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PENWINLAST',
    documentation: '= 0x038F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_POWER',
    documentation: '= 0x0048.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_POWERBROADCAST',
    documentation: '= 0x0218.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PRINT',
    documentation: '= 0x0317.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_PRINTCLIENT',
    documentation: '= 0x0318.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUERYDRAGICON',
    documentation: '= 0x0037.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUERYENDSESSION',
    documentation: '= 0x0011.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUERYNEWPALETTE',
    documentation: '= 0x030F.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUERYOPEN',
    documentation: '= 0x0013.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUERYUISTATE',
    documentation: '= 0x0129.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUEUESYNC',
    documentation: '= 0x0023.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_QUIT',
    documentation: '= 0x0012.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_RBUTTONDBLCLK',
    documentation: '= 0x0206.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_RBUTTONDOWN',
    documentation: '= 0x0204.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_RBUTTONUP',
    documentation: '= 0x0205.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_RENDERALLFORMATS',
    documentation: '= 0x0306.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_RENDERFORMAT',
    documentation: '= 0x0305.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETCURSOR',
    documentation: '= 0x0020.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETFOCUS',
    documentation: '= 0x0007.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETFONT',
    documentation: '= 0x0030.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETHOTKEY',
    documentation: '= 0x0032.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETICON',
    documentation: '= 0x0080.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETREDRAW',
    documentation: '= 0x000B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETTEXT',
    documentation: '= 0x000C.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SETTINGCHANGE',
    documentation: '= 0x001A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SHOWWINDOW',
    documentation: '= 0x0018.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SIZE',
    documentation: '= 0x0005.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SIZECLIPBOARD',
    documentation: '= 0x030B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SIZING',
    documentation: '= 0x0214.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SPOOLERSTATUS',
    documentation: '= 0x002A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_STYLECHANGED',
    documentation: '= 0x007D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_STYLECHANGING',
    documentation: '= 0x007C.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYNCPAINT',
    documentation: '= 0x0088.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSCHAR',
    documentation: '= 0x0106.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSCOLORCHANGE',
    documentation: '= 0x0015.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSCOMMAND',
    documentation: '= 0x0112.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSDEADCHAR',
    documentation: '= 0x0107.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSKEYDOWN',
    documentation: '= 0x0104.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_SYSKEYUP',
    documentation: '= 0x0105.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_TABLET_FIRST',
    documentation: '= 0x02C0.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_TABLET_LAST',
    documentation: '= 0x02DF.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_TCARD',
    documentation: '= 0x0052.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_THEMECHANGED',
    documentation: '= 0x031A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_TIMECHANGE',
    documentation: '= 0x001E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_TIMER',
    documentation: '= 0x0113.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_UNDO',
    documentation: '= 0x0304.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_UNICHAR',
    documentation: '= 0x0109.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_UNINITMENUPOPUP',
    documentation: '= 0x0125.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_UPDATEUISTATE',
    documentation: '= 0x0128.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_USER',
    documentation: '= 0x0400.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_USERCHANGED',
    documentation: '= 0x0054.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_VKEYTOITEM',
    documentation: '= 0x002E.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_VSCROLL',
    documentation: '= 0x0115.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_VSCROLLCLIPBOARD',
    documentation: '= 0x030A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_WINDOWPOSCHANGED',
    documentation: '= 0x0047.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_WINDOWPOSCHANGING',
    documentation: '= 0x0046.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_WININICHANGE',
    documentation: '= 0x001A.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_WTSSESSION_CHANGE',
    documentation: '= 0x02B1.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_XBUTTONDBLCLK',
    documentation: '= 0x020D.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_XBUTTONDOWN',
    documentation: '= 0x020B.',
    detail: 'Windows Message Code',
  },
  {
    label: '$WM_XBUTTONUP',
    documentation: '= 0x020C.',
    detail: 'Windows Message Code',
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'WindowsConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
