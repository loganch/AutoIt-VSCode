import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const copyAndInstall = 'File Copy/Install Option Constant';
const dateTime = 'File Date/Time Option Constant';
const fileGetTime = 'FileGetTime Constant';
const fileSelectFolder = 'FileSelectFolder Constant';
const timeAttribute = 'FileSetTime/FileSetAttrib Constant';
const openMode = 'File Open Mode Constant';
const openSaveDialog = 'File Open/Save Dialog Options';
const fileConstant = 'File Constant';
const fileGetEncoding = 'FileGetEncoding Constant';
const getLongShort = 'FileGetLongName/FileGetShortName Constant';
const fileGetVersion = 'FileGetVersion Constant';
const readToArray = '_FileReadToArray Mode Constant';
const listToArray = '_FileListToArray Mode Constant';
const listToArrayRec = '_FileListToArrayRec Mode Constant';
const pathSplit = '_PathSplit Constant';

const items = [
  {
    label: '$FC_NOOVERWRITE',
    documentation: 'Do not overwrite existing files (default)\n\n`= 0`',
    detail: copyAndInstall,
  },
  {
    label: '$FC_OVERWRITE',
    documentation: 'Overwrite existing files\n\n`= 1`',
    detail: copyAndInstall,
  },
  {
    label: '$FC_CREATEPATH',
    documentation: "Create destination directory structure if it doesn't exist\n\n`= 8`",
    detail: copyAndInstall,
  },
  {
    label: '$FT_MODIFIED',
    documentation: 'Date and time file was last modified (default)\n\n`= 0`',
    detail: dateTime,
  },
  {
    label: '$FT_CREATED',
    documentation: 'Date and time file was created\n\n`= 1`',
    detail: dateTime,
  },
  {
    label: '$FT_ACCESSED',
    documentation: 'Date and time file was last accessed\n\n`= 2`',
    detail: dateTime,
  },
  {
    label: '$FT_ARRAY',
    documentation: '`= 0`',
    detail: fileGetTime,
  },
  {
    label: '$FT_STRING',
    documentation: '`= 1`',
    detail: fileGetTime,
  },
  {
    label: '$FSF_CREATEBUTTON',
    documentation: '`= 1`',
    detail: fileSelectFolder,
  },
  {
    label: '$FSF_NEWDIALOG',
    documentation: '`= 2`',
    detail: fileSelectFolder,
  },
  {
    label: '$FSF_EDITCONTROL',
    documentation: '`= 4`',
    detail: fileSelectFolder,
  },
  {
    label: '$FT_NONRECURSIVE',
    documentation: '`= 0`',
    detail: timeAttribute,
  },
  {
    label: '$FT_RECURSIVE',
    documentation: '`= 1`',
    detail: timeAttribute,
  },
  {
    label: '$FO_READ',
    documentation: 'Read mode\n\n`= 0`',
    detail: openMode,
  },
  {
    label: '$FO_APPEND',
    documentation: 'Write mode (append)\n\n`= 1`',
    detail: openMode,
  },
  {
    label: '$FO_OVERWRITE',
    documentation: 'Write mode (erase previous contents)\n\n`= 2`',
    detail: openMode,
  },
  {
    label: '$FO_CREATEPATH',
    documentation: "Create directory structure if it doesn't exist\n\n`= 8`",
    detail: openMode,
  },
  {
    label: '$FO_BINARY',
    documentation: 'Read/Write mode binary\n\n`= 16`',
    detail: openMode,
  },
  {
    label: '$FO_UNICODE',
    documentation: 'Write mode Unicode UTF16-LE\n\n`= 32`',
    detail: openMode,
  },
  {
    label: '$FO_UTF16_LE',
    documentation: 'Write mode Unicode UTF16-LE\n\n`= 32`',
    detail: openMode,
  },
  {
    label: '$FO_UTF16_BE',
    documentation: 'Write mode Unicode UTF16-BE\n\n`= 64`',
    detail: openMode,
  },
  {
    label: '$FO_UTF8',
    documentation: 'Read/Write mode UTF8 with BOM\n\n`= 128`',
    detail: openMode,
  },
  {
    label: '$FO_UTF8_NOBOM',
    documentation: 'Read/Write mode UTF8 with no BOM\n\n`= 256`',
    detail: openMode,
  },
  {
    label: '$FO_ANSI',
    documentation: 'Read/Write mode ANSI\n\n`= 512`',
    detail: openMode,
  },
  {
    label: '$FO_UTF16_LE_NOBOM',
    documentation: 'Write mode Unicode UTF16-LE with no BOM\n\n`= 1024`',
    detail: openMode,
  },
  {
    label: '$FO_UTF16_BE_NOBOM',
    documentation: 'Write mode Unicode UTF16-BE with no BOM\n\n`= 2048`',
    detail: openMode,
  },
  {
    label: '$FO_UTF8_FULL',
    documentation: 'Use full file UTF8 detection if no BOM present\n\n`= 16384`',
    detail: openMode,
  },
  {
    label: '$FO_FULLFILE_DETECT',
    documentation: 'Use full file UTF8 detection if no BOM present\n\n`= 16384`',
    detail: openMode,
  },
  {
    label: '$EOF',
    documentation: 'End-of-file reached\n\n`= -1`',
    detail: 'File Read Option Constant',
  },
  {
    label: '$FD_FILEMUSTEXIST',
    documentation: 'File must exist\n\n`= 1 `',
    detail: openSaveDialog,
  },
  {
    label: '$FD_PATHMUSTEXIST',
    documentation: 'Path must exist\n\n`= 2 `',
    detail: openSaveDialog,
  },
  {
    label: '$FD_MULTISELECT',
    documentation: 'Allow multi-select\n\n`= 4 `',
    detail: openSaveDialog,
  },
  {
    label: '$FD_PROMPTCREATENEW',
    documentation: 'Prompt to create new file\n\n`= 8 `',
    detail: openSaveDialog,
  },
  {
    label: '$FD_PROMPTOVERWRITE',
    documentation: 'Prompt to overWrite file\n\n`= 16 `',
    detail: openSaveDialog,
  },
  {
    label: '$CREATE_NEW',
    documentation: '`= 1`',
    detail: openSaveDialog,
  },
  {
    label: '$CREATE_ALWAYS',
    documentation: '`= 2`',
    detail: openSaveDialog,
  },
  {
    label: '$OPEN_EXISTING',
    documentation: '`= 3`',
    detail: openSaveDialog,
  },
  {
    label: '$OPEN_ALWAYS',
    documentation: '`= 4`',
    detail: openSaveDialog,
  },
  {
    label: '$TRUNCATE_EXISTING',
    documentation: '`= 5`',
    detail: openSaveDialog,
  },
  {
    label: '$INVALID_SET_FILE_POINTER',
    documentation: '`= -1`',
    detail: openSaveDialog,
  },
  {
    label: '$FILE_BEGIN',
    documentation: '`= 0`',
    detail: 'File Pointer Constant',
  },
  {
    label: '$FILE_CURRENT',
    documentation: '`= 1`',
    detail: 'File Pointer Constant',
  },
  {
    label: '$FILE_END',
    documentation: '`= 2`',
    detail: 'File Pointer Constant',
  },
  {
    label: '$FILE_ATTRIBUTE_READONLY',
    documentation: '`= 0x00000001`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_HIDDEN',
    documentation: '`= 0x00000002`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_SYSTEM',
    documentation: '`= 0x00000004`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_DIRECTORY',
    documentation: '`= 0x00000010`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_ARCHIVE',
    documentation: '`= 0x00000020`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_DEVICE',
    documentation: '`= 0x00000040`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_NORMAL',
    documentation: '`= 0x00000080`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_TEMPORARY',
    documentation: '`= 0x00000100`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_SPARSE_FILE',
    documentation: '`= 0x00000200`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_REPARSE_POINT',
    documentation: '`= 0x00000400`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_COMPRESSED',
    documentation: '`= 0x00000800`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_OFFLINE',
    documentation: '`= 0x00001000`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_NOT_CONTENT_INDEXED',
    documentation: '`= 0x00002000`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ATTRIBUTE_ENCRYPTED',
    documentation: '`= 0x00004000`',
    detail: fileConstant,
  },
  {
    label: '$FILE_SHARE_READ',
    documentation: '`= 0x00000001`',
    detail: fileConstant,
  },
  {
    label: '$FILE_SHARE_WRITE',
    documentation: '`= 0x00000002`',
    detail: fileConstant,
  },
  {
    label: '$FILE_SHARE_DELETE',
    documentation: '`= 0x00000004`',
    detail: fileConstant,
  },
  {
    label: '$FILE_SHARE_READWRITE',
    documentation: '`= BitOR($FILE_SHARE_READ, $FILE_SHARE_WRITE)`',
    detail: fileConstant,
  },
  {
    label: '$FILE_SHARE_ANY',
    documentation: '`= BitOR($FILE_SHARE_READ, $FILE_SHARE_WRITE, $FILE_SHARE_DELETE)`',
    detail: fileConstant,
  },
  {
    label: '$GENERIC_ALL',
    documentation: '`= 0x10000000`',
    detail: fileConstant,
  },
  {
    label: '$GENERIC_EXECUTE',
    documentation: '`= 0x20000000`',
    detail: fileConstant,
  },
  {
    label: '$GENERIC_WRITE',
    documentation: '`= 0x40000000`',
    detail: fileConstant,
  },
  {
    label: '$GENERIC_READ',
    documentation: '`= 0x80000000`',
    detail: fileConstant,
  },
  {
    label: '$GENERIC_READWRITE',
    documentation: '`= BitOR($GENERIC_READ, $GENERIC_WRITE)`',
    detail: fileConstant,
  },
  {
    label: '$FILE_ENCODING_UTF16LE',
    documentation: '`= 32`',
    detail: fileGetEncoding,
  },
  {
    label: '$FE_ENTIRE_UTF8',
    documentation: '`= 1`',
    detail: fileGetEncoding,
  },
  {
    label: '$FE_PARTIALFIRST_UTF8',
    documentation: '`= 2`',
    detail: fileGetEncoding,
  },
  {
    label: '$FN_FULLPATH',
    documentation: '`= 0`',
    detail: getLongShort,
  },
  {
    label: '$FN_RELATIVEPATH',
    documentation: '`= 1`',
    detail: getLongShort,
  },
  {
    label: '$FV_COMMENTS',
    documentation: '`= "Comments"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_COMPANYNAME',
    documentation: '`= "CompanyName"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_FILEDESCRIPTION',
    documentation: '`= "FileDescription"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_FILEVERSION',
    documentation: '`= "FileVersion"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_INTERNALNAME',
    documentation: '`= "InternalName"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_LEGALCOPYRIGHT',
    documentation: '`= "LegalCopyright"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_LEGALTRADEMARKS',
    documentation: '`= "LegalTrademarks"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_ORIGINALFILENAME',
    documentation: '`= "OriginalFilename"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_PRODUCTNAME',
    documentation: '`= "ProductName"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_PRODUCTVERSION',
    documentation: '`= "ProductVersion"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_PRIVATEBUILD',
    documentation: '`= "PrivateBuild"`',
    detail: fileGetVersion,
  },
  {
    label: '$FV_SPECIALBUILD',
    documentation: '`= "SpecialBuild"`',
    detail: fileGetVersion,
  },
  {
    label: '$FRTA_NOCOUNT',
    documentation: '`= 0`',
    detail: readToArray,
  },
  {
    label: '$FRTA_COUNT',
    documentation: '`= 1`',
    detail: readToArray,
  },
  {
    label: '$FRTA_INTARRAYS',
    documentation: '`= 2`',
    detail: readToArray,
  },
  {
    label: '$FRTA_ENTIRESPLIT',
    documentation: '`= 4`',
    detail: readToArray,
  },
  {
    label: '$FLTA_FILESFOLDERS',
    documentation: '`= 0`',
    detail: listToArray,
  },
  {
    label: '$FLTA_FILES',
    documentation: '`= 1`',
    detail: listToArray,
  },
  {
    label: '$FLTA_FOLDERS',
    documentation: '`= 2`',
    detail: listToArray,
  },
  {
    label: '$FLTAR_FILESFOLDERS',
    documentation: '`= 0`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_FILES',
    documentation: '`= 1`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_FOLDERS',
    documentation: '`= 2`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NOHIDDEN',
    documentation: '`= 4`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NOSYSTEM',
    documentation: '`= 8`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NOLINK',
    documentation: '`= 16`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NORECUR',
    documentation: '`= 0`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_RECUR',
    documentation: '`= 1`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NOSORT',
    documentation: '`= 0`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_SORT',
    documentation: '`= 1`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_FASTSORT',
    documentation: '`= 2`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_NOPATH',
    documentation: '`= 0`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_RELPATH',
    documentation: '`= 1`',
    detail: listToArrayRec,
  },
  {
    label: '$FLTAR_FULLPATH',
    documentation: '`= 2`',
    detail: listToArrayRec,
  },
  {
    label: '$PATH_ORIGINAL',
    documentation: '`= 0`',
    detail: pathSplit,
  },
  {
    label: '$PATH_DRIVE',
    documentation: '`= 1`',
    detail: pathSplit,
  },
  {
    label: '$PATH_DIRECTORY',
    documentation: '`= 2`',
    detail: pathSplit,
  },
  {
    label: '$PATH_FILENAME',
    documentation: '`= 3`',
    detail: pathSplit,
  },
  {
    label: '$PATH_EXTENSION',
    documentation: '`= 4`',
    detail: pathSplit,
  },
];

const completions = fillCompletions(items, CompletionItemKind.Constant, '', 'FileConstants.au3');
const hovers = completionToHover(completions);

export { completions as default, hovers };
