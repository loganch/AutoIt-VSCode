import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

const styleConst = 'TreeView Style Constant';
const expand = 'Expand flag Constant';
const getNext = 'GetNext flag Constant';
const hitTest = 'HitTest flag Constant';
const insert = 'Insert flag Constant';
const item = 'Item/Itemex Mask Flag Constant';
const imageList = 'Image List Constant';
const typeOfAction = 'Type of Action Constant';
const itemState = 'Item State Constant';
const messages = 'TreeView Message Constant';
const notification = 'Notification Constant';

const items = [
  {
    label: '$TVS_HASBUTTONS',
    documentation:
      "Displays plus (+) and minus (-) buttons next to parent items. The user clicks the buttons to expand or collapse a parent item's list of child items. To include buttons with items at the root of the tree view, TVS_LINESATROOT must also be specified.",
    detail: styleConst,
  },
  {
    label: '$TVS_HASLINES',
    documentation: 'Uses lines to show the hierarchy of items.',
    detail: styleConst,
  },
  {
    label: '$TVS_LINESATROOT',
    documentation:
      'Uses lines to link items at the root of the tree view control. This value is ignored if TVS_HASLINES is not also specified.',
    detail: styleConst,
  },
  {
    label: '$TVS_DISABLEDRAGDROP',
    documentation:
      'Prevents the tree view control from sending TVN_BEGINDRAG notification messages.',
    detail: styleConst,
  },
  {
    label: '$TVS_SHOWSELALWAYS',
    documentation:
      'Causes a selected item to remain selected when the tree view control loses focus.',
    detail: styleConst,
  },
  {
    label: '$TVS_RTLREADING',
    documentation:
      'Normal windows display text left-to-right (LTR). Windows can be mirrored to display languages such as Hebrew or Arabic that read right-to-left (RTL). Normally, tree view text will be displayed in same direction as the the text in its parent window. If TVS_RTLREADING is set, tree view text will read in the opposite direction from the text in the parent window. ',
    detail: styleConst,
  },
  {
    label: '$TVS_NOTOOLTIPS',
    documentation: 'The tree view control does not support tooltips.',
    detail: styleConst,
  },
  {
    label: '$TVS_CHECKBOXES',
    documentation:
      'Enables check boxes for items in a tree-view control. Once a tree-view control is created with this style, the style cannot be removed. Instead, you must destroy the control and create a new one in its place.',
    detail: styleConst,
  },
  {
    label: '$TVS_TRACKSELECT',
    documentation: 'Enables hot tracking in a tree view control.',
    detail: styleConst,
  },
  {
    label: '$TVS_SINGLEEXPAND',
    documentation:
      'When this style is enabled, changing the selection in the tree view will automatically cause the item being selected to expand and the item being unselected to collapse. If the mouse is used to single-click the selected item and that item is closed, it will be expanded. If the user holds the CTRL key down while selecting an item, the item being unselected will not be collapsed.',
    detail: styleConst,
  },
  {
    label: '$TVS_FULLROWSELECT',
    documentation:
      "Enables full-row selection in the tree view. The entire row of the selected item is highlighted, and clicking anywhere on an item's row will cause it to be selected. This style cannot be used in conjunction with the TVS_HASLINES style.",
    detail: styleConst,
  },
  {
    label: '$TVS_NOSCROLL',
    documentation:
      'Disables both horizontal and vertical scrolling in the control. The control will not display any scroll bars.',
    detail: styleConst,
  },
  {
    label: '$TVS_NONEVENHEIGHT',
    documentation:
      'The height of the items can be set to an odd height with the TVM_SETITEMHEIGHT message. By default, the height of items must be an even value.',
    detail: styleConst,
  },
  {
    label: '$TVS_NOHSCROLL',
    documentation: 'Disables horizontal scrolling in the control\n\n`= 0x00008000`',
    detail: styleConst,
  },
  {
    label: '$TVS_DEFAULT',
    documentation: 'Default control style\n\n`= 0x00000037`',
    detail: styleConst,
  },
  {
    label: '$GUI_SS_DEFAULT_TREEVIEW',
    documentation:
      '`= BitOR($TVS_HASBUTTONS, $TVS_HASLINES, $TVS_LINESATROOT, $TVS_DISABLEDRAGDROP, $TVS_SHOWSELALWAYS)`',
    detail: styleConst,
  },
  {
    label: '$TVE_COLLAPSE',
    documentation: '`= 0x0001`',
    detail: expand,
  },
  {
    label: '$TVE_EXPAND',
    documentation: '`= 0x0002`',
    detail: expand,
  },
  {
    label: '$TVE_TOGGLE',
    documentation: '`= 0x0003`',
    detail: expand,
  },
  {
    label: '$TVE_EXPANDPARTIAL',
    documentation: '`= 0x4000`',
    detail: expand,
  },
  {
    label: '$TVE_COLLAPSERESET',
    documentation: '`= 0x8000`',
    detail: expand,
  },
  {
    label: '$TVGN_ROOT',
    documentation: '`= 0x00000000`',
    detail: getNext,
  },
  {
    label: '$TVGN_NEXT',
    documentation: '`= 0x00000001`',
    detail: getNext,
  },
  {
    label: '$TVGN_PREVIOUS',
    documentation: '`= 0x00000002`',
    detail: getNext,
  },
  {
    label: '$TVGN_PARENT',
    documentation: '`= 0x00000003`',
    detail: getNext,
  },
  {
    label: '$TVGN_CHILD',
    documentation: '`= 0x00000004`',
    detail: getNext,
  },
  {
    label: '$TVGN_FIRSTVISIBLE',
    documentation: '`= 0x00000005`',
    detal: getNext,
  },
  {
    label: '$TVGN_NEXTVISIBLE',
    documentation: '`= 0x00000006`',
    detal: getNext,
  },
  {
    label: '$TVGN_PREVIOUSVISIBLE',
    documentation: '`= 0x00000007`',
    detal: getNext,
  },
  {
    label: '$TVGN_DROPHILITE',
    documentation: '`= 0x00000008`',
    detal: getNext,
  },
  {
    label: '$TVGN_LASTVISIBLE',
    documentation: '`= 0x0000000A`',
    detal: getNext,
  },
  {
    label: '$TVHT_NOWHERE',
    documentation: '`= 0x00000001`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMICON',
    documentation: '`= 0x00000002`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMLABEL',
    documentation: '`= 0x00000004`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMINDENT',
    documentation: '`= 0x00000008`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMBUTTON',
    documentation: '`= 0x00000010`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMRIGHT',
    documentation: '`= 0x00000020`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEMSTATEICON',
    documentation: '`= 0x00000040`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ONITEM',
    documentation: '`= 0x00000046`',
    detail: hitTest,
  },
  {
    label: '$TVHT_ABOVE',
    documentation: '`= 0x00000100`',
    detail: hitTest,
  },
  {
    label: '$TVHT_BELOW',
    documentation: '`= 0x00000200`',
    detail: hitTest,
  },
  {
    label: '$TVHT_TORIGHT',
    documentation: '`= 0x00000400`',
    detail: hitTest,
  },
  {
    label: '$TVHT_TOLEFT',
    documentation: '`= 0x00000800`',
    detail: hitTest,
  },
  {
    label: '$TVI_ROOT',
    documentation: '`= 0xFFFF0000`',
    detail: insert,
  },
  {
    label: '$TVI_FIRST',
    documentation: '`= 0xFFFF0001`',
    detail: insert,
  },
  {
    label: '$TVI_LAST',
    documentation: '`= 0xFFFF0002`',
    detail: insert,
  },
  {
    label: '$TVI_SORT',
    documentation: '`= 0xFFFF0003`',
    detail: insert,
  },
  {
    label: '$TVIF_TEXT',
    documentation: '`= 0x00000001`',
    detail: item,
  },
  {
    label: '$TVIF_IMAGE',
    documentation: '`= 0x00000002`',
    detail: item,
  },
  {
    label: '$TVIF_PARAM',
    documentation: '`= 0x00000004`',
    detail: item,
  },
  {
    label: '$TVIF_STATE',
    documentation: '`= 0x00000008`',
    detail: item,
  },
  {
    label: '$TVIF_HANDLE',
    documentation: '`= 0x00000010`',
    detail: item,
  },
  {
    label: '$TVIF_SELECTEDIMAGE',
    documentation: '`= 0x00000020`',
    detail: item,
  },
  {
    label: '$TVIF_CHILDREN',
    documentation: '`= 0x00000040`',
    detail: item,
  },
  {
    label: '$TVIF_INTEGRAL',
    documentation: '`= 0x00000080`',
    detail: item,
  },
  {
    label: '$TVIF_EXPANDEDIMAGE',
    documentation: '`= 0x00000100`',
    detail: item,
  },
  {
    label: '$TVIF_STATEEX',
    documentation: '`= 0x00000200`',
    detail: item,
  },
  {
    label: '$TVIF_DI_SETITEM',
    documentation: '`= 0x00001000`',
    detail: item,
  },
  {
    label: '$TVSIL_NORMAL',
    documentation: '`= 0`',
    detail: imageList,
  },
  {
    label: '$TVSIL_STATE',
    documentation: '`= 2`',
    detail: imageList,
  },
  {
    label: '$TVC_BYKEYBOARD',
    documentation: '`= 0x2`',
    detail: typeOfAction,
  },
  {
    label: '$TVC_BYMOUSE',
    documentation: '`= 0x1`',
    detail: typeOfAction,
  },
  {
    label: '$TVC_UNKNOWN',
    documentation: '`= 0x0`',
    detail: typeOfAction,
  },
  {
    label: '$TVIS_FOCUSED',
    documentation: '`= 0x00000001`',
    detail: itemState,
  },
  {
    label: '$TVIS_SELECTED',
    documentation: '`= 0x00000002`',
    detail: itemState,
  },
  {
    label: '$TVIS_CUT',
    documentation: '`= 0x00000004`',
    detail: itemState,
  },
  {
    label: '$TVIS_DROPHILITED',
    documentation: '`= 0x00000008`',
    detail: itemState,
  },
  {
    label: '$TVIS_BOLD',
    documentation: '`= 0x00000010`',
    detail: itemState,
  },
  {
    label: '$TVIS_EXPANDED',
    documentation: '`= 0x00000020`',
    detail: itemState,
  },
  {
    label: '$TVIS_EXPANDEDONCE',
    documentation: '`= 0x00000040`',
    detail: itemState,
  },
  {
    label: '$TVIS_EXPANDPARTIAL',
    documentation: '`= 0x00000080`',
    detail: itemState,
  },
  {
    label: '$TVIS_OVERLAYMASK',
    documentation: '`= 0x00000F00`',
    detail: itemState,
  },
  {
    label: '$TVIS_STATEIMAGEMASK',
    documentation: '`= 0x0000F000`',
    detail: itemState,
  },
  {
    label: '$TVIS_USERMASK',
    documentation: '`= 0x0000F000`',
    detail: itemState,
  },
  {
    label: '$TVIS_UNCHECKED',
    documentation: '`= 4096`',
    detail: itemState,
  },
  {
    label: '$TVIS_CHECKED',
    documentation: '`= 8192`',
    detail: itemState,
  },
  {
    label: '$TVNA_ADD',
    documentation: '`= 1`',
    detail: itemState,
  },
  {
    label: '$TVNA_ADDFIRST',
    documentation: '`= 2`',
    detail: itemState,
  },
  {
    label: '$TVNA_ADDCHILD',
    documentation: '`= 3`',
    detail: itemState,
  },
  {
    label: '$TVNA_ADDCHILDFIRST',
    documentation: '`= 4`',
    detail: itemState,
  },
  {
    label: '$TVNA_INSERT',
    documentation: '`= 5`',
    detail: itemState,
  },
  {
    label: '$TVTA_ADDFIRST',
    documentation: '`= 1`',
    detail: itemState,
  },
  {
    label: '$TVTA_ADD',
    documentation: '`= 2`',
    detail: itemState,
  },
  {
    label: '$TVTA_INSERT',
    documentation: '`= 3`',
    detail: itemState,
  },
  {
    label: '$TV_FIRST',
    documentation: '`= 0x1100`',
    detail: messages,
  },
  {
    label: '$TVM_INSERTITEMA',
    documentation: '`= $TV_FIRST + 0`',
    detail: messages,
  },
  {
    label: '$TVM_DELETEITEM',
    documentation: '`= $TV_FIRST + 1`',
    detail: messages,
  },
  {
    label: '$TVM_EXPAND',
    documentation: '`= $TV_FIRST + 2`',
    detail: messages,
  },
  {
    label: '$TVM_GETITEMRECT',
    documentation: '`= $TV_FIRST + 4`',
    detail: messages,
  },
  {
    label: '$TVM_GETCOUNT',
    documentation: '`= $TV_FIRST + 5`',
    detail: messages,
  },
  {
    label: '$TVM_GETINDENT',
    documentation: '`= $TV_FIRST + 6`',
    detail: messages,
  },
  {
    label: '$TVM_SETINDENT',
    documentation: '`= $TV_FIRST + 7`',
    detail: messages,
  },
  {
    label: '$TVM_GETIMAGELIST',
    documentation: '`= $TV_FIRST + 8`',
    detail: messages,
  },
  {
    label: '$TVM_SETIMAGELIST',
    documentation: '`= $TV_FIRST + 9`',
    detail: messages,
  },
  {
    label: '$TVM_GETNEXTITEM',
    documentation: '`= $TV_FIRST + 10`',
    detail: messages,
  },
  {
    label: '$TVM_SELECTITEM',
    documentation: '`= $TV_FIRST + 11`',
    detail: messages,
  },
  {
    label: '$TVM_GETITEMA',
    documentation: '`= $TV_FIRST + 12`',
    detail: messages,
  },
  {
    label: '$TVM_SETITEMA',
    documentation: '`= $TV_FIRST + 13`',
    detail: messages,
  },
  {
    label: '$TVM_EDITLABELA',
    documentation: '`= $TV_FIRST + 14`',
    detail: messages,
  },
  {
    label: '$TVM_GETEDITCONTROL',
    documentation: '`= $TV_FIRST + 15`',
    detail: messages,
  },
  {
    label: '$TVM_GETVISIBLECOUNT',
    documentation: '`= $TV_FIRST + 16`',
    detail: messages,
  },
  {
    label: '$TVM_HITTEST',
    documentation: '`= $TV_FIRST + 17`',
    detail: messages,
  },
  {
    label: '$TVM_CREATEDRAGIMAGE',
    documentation: '`= $TV_FIRST + 18`',
    detail: messages,
  },
  {
    label: '$TVM_SORTCHILDREN',
    documentation: '`= $TV_FIRST + 19`',
    detail: messages,
  },
  {
    label: '$TVM_ENSUREVISIBLE',
    documentation: '`= $TV_FIRST + 20`',
    detail: messages,
  },
  {
    label: '$TVM_SORTCHILDRENCB',
    documentation: '`= $TV_FIRST + 21`',
    detail: messages,
  },
  {
    label: '$TVM_ENDEDITLABELNOW',
    documentation: '`= $TV_FIRST + 22`',
    detail: messages,
  },
  {
    label: '$TVM_GETISEARCHSTRINGA',
    documentation: '`= $TV_FIRST + 23`',
    detail: messages,
  },
  {
    label: '$TVM_SETTOOLTIPS',
    documentation: '`= $TV_FIRST + 24`',
    detail: messages,
  },
  {
    label: '$TVM_GETTOOLTIPS',
    documentation: '`= $TV_FIRST + 25`',
    detail: messages,
  },
  {
    label: '$TVM_SETINSERTMARK',
    documentation: '`= $TV_FIRST + 26`',
    detail: messages,
  },
  {
    label: '$TVM_SETITEMHEIGHT',
    documentation: '`= $TV_FIRST + 27`',
    detail: messages,
  },
  {
    label: '$TVM_GETITEMHEIGHT',
    documentation: '`= $TV_FIRST + 28`',
    detail: messages,
  },
  {
    label: '$TVM_SETBKCOLOR',
    documentation: '`= $TV_FIRST + 29`',
    detail: messages,
  },
  {
    label: '$TVM_SETTEXTCOLOR',
    documentation: '`= $TV_FIRST + 30`',
    detail: messages,
  },
  {
    label: '$TVM_GETBKCOLOR',
    documentation: '`= $TV_FIRST + 31`',
    detail: messages,
  },
  {
    label: '$TVM_GETTEXTCOLOR',
    documentation: '`= $TV_FIRST + 32`',
    detail: messages,
  },
  {
    label: '$TVM_SETSCROLLTIME',
    documentation: '`= $TV_FIRST + 33`',
    detail: messages,
  },
  {
    label: '$TVM_GETSCROLLTIME',
    documentation: '`= $TV_FIRST + 34`',
    detail: messages,
  },
  {
    label: '$TVM_SETINSERTMARKCOLOR',
    documentation: '`= $TV_FIRST + 37`',
    detail: messages,
  },
  {
    label: '$TVM_GETINSERTMARKCOLOR',
    documentation: '`= $TV_FIRST + 38`',
    detail: messages,
  },
  {
    label: '$TVM_GETITEMSTATE',
    documentation: '`= $TV_FIRST + 39`',
    detail: messages,
  },
  {
    label: '$TVM_SETLINECOLOR',
    documentation: '`= $TV_FIRST + 40`',
    detail: messages,
  },
  {
    label: '$TVM_GETLINECOLOR',
    documentation: '`= $TV_FIRST + 41`',
    detail: messages,
  },
  {
    label: '$TVM_MAPACCIDTOHTREEITEM',
    documentation: '`= $TV_FIRST + 42`',
    detail: messages,
  },
  {
    label: '$TVM_MAPHTREEITEMTOACCID',
    documentation: '`= $TV_FIRST + 43`',
    detail: messages,
  },
  {
    label: '$TVM_INSERTITEMW',
    documentation: '`= $TV_FIRST + 50`',
    detail: messages,
  },
  {
    label: '$TVM_GETITEMW',
    documentation: '`= $TV_FIRST + 62`',
    detail: messages,
  },
  {
    label: '$TVM_SETITEMW',
    documentation: '`= $TV_FIRST + 63`',
    detail: messages,
  },
  {
    label: '$TVM_GETISEARCHSTRINGW',
    documentation: '`= $TV_FIRST + 64`',
    detail: messages,
  },
  {
    label: '$TVM_EDITLABELW',
    documentation: '`= $TV_FIRST + 65`',
    detail: messages,
  },
  {
    label: '$TVM_GETUNICODEFORMAT',
    documentation: '`= 0x2000 + 6`',
    detail: messages,
  },
  {
    label: '$TVM_SETUNICODEFORMAT',
    documentation: '`= 0x2000 + 5`',
    detail: messages,
  },
  {
    label: '$TVN_FIRST',
    documentation: '`= -400`',
    detail: notification,
  },
  {
    label: '$TVN_SELCHANGINGA',
    documentation: '`= $TVN_FIRST - 1`',
    detail: notification,
  },
  {
    label: '$TVN_SELCHANGEDA',
    documentation: '`= $TVN_FIRST - 2`',
    detail: notification,
  },
  {
    label: '$TVN_GETDISPINFOA',
    documentation: '`= $TVN_FIRST - 3`',
    detail: notification,
  },
  {
    label: '$TVN_SETDISPINFOA',
    documentation: '`= $TVN_FIRST - 4`',
    detail: notification,
  },
  {
    label: '$TVN_ITEMEXPANDINGA',
    documentation: '`= $TVN_FIRST - 5`',
    detail: notification,
  },
  {
    label: '$TVN_ITEMEXPANDEDA',
    documentation: '`= $TVN_FIRST - 6`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINDRAGA',
    documentation: '`= $TVN_FIRST - 7`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINRDRAGA',
    documentation: '`= $TVN_FIRST - 8`',
    detail: notification,
  },
  {
    label: '$TVN_DELETEITEMA',
    documentation: '`= $TVN_FIRST - 9`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINLABELEDITA',
    documentation: '`= $TVN_FIRST - 10`',
    detail: notification,
  },
  {
    label: '$TVN_ENDLABELEDITA',
    documentation: '`= $TVN_FIRST - 11`',
    detail: notification,
  },
  {
    label: '$TVN_KEYDOWN',
    documentation: '`= $TVN_FIRST - 12`',
    detail: notification,
  },
  {
    label: '$TVN_GETINFOTIPA',
    documentation: '`= $TVN_FIRST - 13`',
    detail: notification,
  },
  {
    label: '$TVN_GETINFOTIPW',
    documentation: '`= $TVN_FIRST - 14`',
    detail: notification,
  },
  {
    label: '$TVN_SINGLEEXPAND',
    documentation: '`= $TVN_FIRST - 15`',
    detail: notification,
  },
  {
    label: '$TVN_SELCHANGINGW',
    documentation: '`= $TVN_FIRST - 50`',
    detail: notification,
  },
  {
    label: '$TVN_SELCHANGEDW',
    documentation: '`= $TVN_FIRST - 51`',
    detail: notification,
  },
  {
    label: '$TVN_GETDISPINFOW',
    documentation: '`= $TVN_FIRST - 52`',
    detail: notification,
  },
  {
    label: '$TVN_SETDISPINFOW',
    documentation: '`= $TVN_FIRST - 53`',
    detail: notification,
  },
  {
    label: '$TVN_ITEMEXPANDINGW',
    documentation: '`= $TVN_FIRST - 54`',
    detail: notification,
  },
  {
    label: '$TVN_ITEMEXPANDEDW',
    documentation: '`= $TVN_FIRST - 55`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINDRAGW',
    documentation: '`= $TVN_FIRST - 56`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINRDRAGW',
    documentation: '`= $TVN_FIRST - 57`',
    detail: notification,
  },
  {
    label: '$TVN_DELETEITEMW',
    documentation: '`= $TVN_FIRST - 58`',
    detail: notification,
  },
  {
    label: '$TVN_BEGINLABELEDITW',
    documentation: '`= $TVN_FIRST - 59`',
    detail: notification,
  },
  {
    label: '$TVN_ENDLABELEDITW',
    documentation: '`= $TVN_FIRST - 60`',
    detail: notification,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'TreeViewConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
