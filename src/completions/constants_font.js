import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const fontWeight = 'Font Weight Constant';
const dialog = 'Font Dialog Constant';
const charSet = 'Font Char Set Constant';
const output = 'Font Output Precision Constant';
const clipping = 'Font Clipping Precision Constant';
const quality = 'Font Quality Constant';
const pitchFamily = 'Font Pitch/Family Constant';
const fontConst = 'Font Constant';

const items = [
  {
    label: '$FW_DONTCARE',
    documentation: '`= 0`',
    detail: fontWeight,
  },
  {
    label: '$FW_THIN',
    documentation: '`= 100`',
    detail: fontWeight,
  },
  {
    label: '$FW_EXTRALIGHT',
    documentation: '`= 200`',
    detail: fontWeight,
  },
  {
    label: '$FW_ULTRALIGHT',
    documentation: '`= 200`',
    detail: fontWeight,
  },
  {
    label: '$FW_LIGHT',
    documentation: '`= 300`',
    detail: fontWeight,
  },
  {
    label: '$FW_NORMAL',
    documentation: '`= 400`',
    detail: fontWeight,
  },
  {
    label: '$FW_REGULAR',
    documentation: '`= 400`',
    detail: fontWeight,
  },
  {
    label: '$FW_MEDIUM',
    documentation: '`= 500`',
    detail: fontWeight,
  },
  {
    label: '$FW_SEMIBOLD',
    documentation: '`= 600`',
    detail: fontWeight,
  },
  {
    label: '$FW_DEMIBOLD',
    documentation: '`= 600`',
    detail: fontWeight,
  },
  {
    label: '$FW_BOLD',
    documentation: '`= 700`',
    detail: fontWeight,
  },
  {
    label: '$FW_EXTRABOLD',
    documentation: '`= 800`',
    detail: fontWeight,
  },
  {
    label: '$FW_ULTRABOLD',
    documentation: '`= 800`',
    detail: fontWeight,
  },
  {
    label: '$FW_HEAVY',
    documentation: '`= 900`',
    detail: fontWeight,
  },
  {
    label: '$FW_BLACK',
    documentation: '`= 900`',
    detail: fontWeight,
  },
  {
    label: '$CF_EFFECTS',
    documentation: '`= 0x100`',
    detail: dialog,
  },
  {
    label: '$CF_PRINTERFONTS',
    documentation: '`= 0x2`',
    detail: dialog,
  },
  {
    label: '$CF_SCREENFONTS',
    documentation: '`= 0x1`',
    detail: dialog,
  },
  {
    label: '$CF_NOSCRIPTSEL',
    documentation: '`= 0x800000`',
    detail: dialog,
  },
  {
    label: '$CF_INITTOLOGFONTSTRUCT',
    documentation: '`= 0x40`',
    detail: dialog,
  },
  {
    label: '$LOGPIXELSX',
    documentation: '`= 88`',
    detail: dialog,
  },
  {
    label: '$LOGPIXELSY',
    documentation: '`= 90`',
    detail: dialog,
  },
  {
    label: '$ANSI_CHARSET',
    documentation: '`= 0`',
    detail: charSet,
  },
  {
    label: '$ARABIC_CHARSET',
    documentation: '`= 178`',
    detail: charSet,
  },
  {
    label: '$BALTIC_CHARSET',
    documentation: '`= 186`',
    detail: charSet,
  },
  {
    label: '$CHINESEBIG5_CHARSET',
    documentation: '`= 136`',
    detail: charSet,
  },
  {
    label: '$DEFAULT_CHARSET',
    documentation: '`= 1`',
    detail: charSet,
  },
  {
    label: '$EASTEUROPE_CHARSET',
    documentation: '`= 238`',
    detail: charSet,
  },
  {
    label: '$GB2312_CHARSET',
    documentation: '`= 134`',
    detail: charSet,
  },
  {
    label: '$GREEK_CHARSET',
    documentation: '`= 161`',
    detail: charSet,
  },
  {
    label: '$HANGEUL_CHARSET',
    documentation: '`= 129`',
    detail: charSet,
  },
  {
    label: '$HEBREW_CHARSET',
    documentation: '`= 177`',
    detail: charSet,
  },
  {
    label: '$JOHAB_CHARSET',
    documentation: '`= 130`',
    detail: charSet,
  },
  {
    label: '$MAC_CHARSET',
    documentation: '`= 77`',
    detail: charSet,
  },
  {
    label: '$OEM_CHARSET',
    documentation: '`= 255`',
    detail: charSet,
  },
  {
    label: '$RUSSIAN_CHARSET',
    documentation: '`= 204`',
    detail: charSet,
  },
  {
    label: '$SHIFTJIS_CHARSET',
    documentation: '`= 128`',
    detail: charSet,
  },
  {
    label: '$SYMBOL_CHARSET',
    documentation: '`= 2`',
    detail: charSet,
  },
  {
    label: '$THAI_CHARSET',
    documentation: '`= 222`',
    detail: charSet,
  },
  {
    label: '$TURKISH_CHARSET',
    documentation: '`= 162`',
    detail: charSet,
  },
  {
    label: '$VIETNAMESE_CHARSET',
    documentation: '`= 163`',
    detail: charSet,
  },
  {
    label: '$OUT_CHARACTER_PRECIS',
    documentation: '`= 2`',
    detail: output,
  },
  {
    label: '$OUT_DEFAULT_PRECIS',
    documentation: '`= 0`',
    detail: output,
  },
  {
    label: '$OUT_DEVICE_PRECIS',
    documentation: '`= 5`',
    detail: output,
  },
  {
    label: '$OUT_OUTLINE_PRECIS',
    documentation: '`= 8`',
    detail: output,
  },
  {
    label: '$OUT_PS_ONLY_PRECIS',
    documentation: '`= 10`',
    detail: output,
  },
  {
    label: '$OUT_RASTER_PRECIS',
    documentation: '`= 6`',
    detail: output,
  },
  {
    label: '$OUT_STRING_PRECIS',
    documentation: '`= 1`',
    detail: output,
  },
  {
    label: '$OUT_STROKE_PRECIS',
    documentation: '`= 3`',
    detail: output,
  },
  {
    label: '$OUT_TT_ONLY_PRECIS',
    documentation: '`= 7`',
    detail: output,
  },
  {
    label: '$OUT_TT_PRECIS',
    documentation: '`= 4`',
    detail: output,
  },
  {
    label: '$CLIP_CHARACTER_PRECIS',
    documentation: '`= 1`',
    detail: clipping,
  },
  {
    label: '$CLIP_DEFAULT_PRECIS',
    documentation: '`= 0`',
    detail: clipping,
  },
  {
    label: '$CLIP_DFA_DISABLE',
    documentation: '`= 0x0030`',
    detail: clipping,
  },
  {
    label: '$CLIP_EMBEDDED',
    documentation: '`= 128`',
    detail: clipping,
  },
  {
    label: '$CLIP_LH_ANGLES',
    documentation: '`= 16`',
    detail: clipping,
  },
  {
    label: '$CLIP_MASK',
    documentation: '`= 0xF`',
    detail: clipping,
  },
  {
    label: '$CLIP_DFA_OVERRIDE',
    documentation: '`= 0x0040`',
    detail: clipping,
  },
  {
    label: '$CLIP_STROKE_PRECIS',
    documentation: '`= 2`',
    detail: clipping,
  },
  {
    label: '$CLIP_TT_ALWAYS',
    documentation: '`= 32`',
    detail: clipping,
  },
  {
    label: '$ANTIALIASED_QUALITY',
    documentation: '`= 4`',
    detail: quality,
  },
  {
    label: '$DEFAULT_QUALITY',
    documentation: '`= 0`',
    detail: quality,
  },
  {
    label: '$DRAFT_QUALITY',
    documentation: '`= 1`',
    detail: quality,
  },
  {
    label: '$NONANTIALIASED_QUALITY',
    documentation: '`= 3`',
    detail: quality,
  },
  {
    label: '$PROOF_QUALITY',
    documentation: '`= 2`',
    detail: quality,
  },
  {
    label: '$CLEARTYPE_QUALITY',
    documentation: '`= 5`',
    detail: quality,
  },
  {
    label: '$DEFAULT_PITCH',
    documentation: '`= 0`',
    detail: pitchFamily,
  },
  {
    label: '$FIXED_PITCH',
    documentation: '`= 1`',
    detail: pitchFamily,
  },
  {
    label: '$VARIABLE_PITCH',
    documentation: '`= 2`',
    detail: pitchFamily,
  },
  {
    label: '$FF_DECORATIVE',
    documentation: '`= 80`',
    detail: fontConst,
  },
  {
    label: '$FF_DONTCARE',
    documentation: '`= 0`',
    detail: fontConst,
  },
  {
    label: '$FF_MODERN',
    documentation: '`= 48`',
    detail: fontConst,
  },
  {
    label: '$FF_ROMAN',
    documentation: '`= 16`',
    detail: fontConst,
  },
  {
    label: '$FF_SCRIPT',
    documentation: '`= 64`',
    detail: fontConst,
  },
  {
    label: '$FF_SWISS',
    documentation: '`= 32`',
    detail: fontConst,
  },
  {
    label: '$FS_REGULAR',
    documentation: '`= 0x00`',
    detail: fontConst,
  },
  {
    label: '$FS_BOLD',
    documentation: '`= 0x01`',
    detail: fontConst,
  },
  {
    label: '$FS_ITALIC',
    documentation: '`= 0x02`',
    detail: fontConst,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'FontConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
