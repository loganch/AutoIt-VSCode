import { CompletionItemKind, SnippetString } from 'vscode';
import { completionToHover, fillCompletions } from '../util';

/** Directives used by AutoIt3Wrapper.exe */
const wrapperDirectives = [
  {
    label: '#AutoIt3Wrapper_testing',
    documentation: 'Skip Tidy, Obfuscator and cvsWrapper for speed while testing.',
    insertText: new SnippetString('#AutoIt3Wrapper_testing=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_UseX64',
    documentation: 'Use X64 versions for AutoIt3_x64 or AUT2EXE_x64.',
    insertText: new SnippetString('#AutoIt3Wrapper_UseX64=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Version',
    documentation: 'Use Beta or Production for AutoIt3 and AUT2EXE.',
    insertText: new SnippetString('#AutoIt3Wrapper_Version=${1|B,P|}'),
  },
  {
    label: '#AutoIt3Wrapper_Run_Debug_Mode',
    documentation: 'Run Script with console debugging.',
    insertText: new SnippetString('#AutoIt3Wrapper_Run_Debug_Mode=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Run_SciTE_Minimized',
    documentation: 'Minimize SciTE while script is running.',
    insertText: new SnippetString('#AutoIt3Wrapper_Run_SciTE_Minimized=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Run_SciTE_OutputPane_Minimized',
    documentation: 'Toggle SciTE output pane at run time so its not shown.',
    insertText: new SnippetString('#AutoIt3Wrapper_Run_SciTE_OutputPane_Minimized=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Autoit3Dir',
    documentation: 'Optionally override the base AutoIt3 install directory.',
  },
  {
    label: '#AutoIt3Wrapper_Aut2exe',
    documentation: 'Optionally override the Aut2exe.exe to use for this script',
  },
  {
    label: '#AutoIt3Wrapper_AutoIt3',
    documentation: 'Optionally override the Autoit3.exe to use for this script',
  },
  {
    label: '#AutoIt3Wrapper_Add_Constants',
    documentation: 'Add the needed standard constant include files. Will only run one time.',
  },
  {
    label: '#AutoIt3Wrapper_Icon',
    documentation: 'Filename of the Ico file to use',
  },
  {
    label: '#AutoIt3Wrapper_Outfile',
    documentation: 'Target exe/a3x filename.',
  },
  {
    label: '#AutoIt3Wrapper_OutFile_Type',
    documentation: 'a3x=small AutoIt3 file exe=Standalone executable',
    insertText: new SnippetString('#AutoIt3Wrapper_OutFile_Type=${1|exe,a3x|}'),
  },
  {
    label: '#AutoIt3Wrapper_OutFile_X64',
    documentation: 'Target exe filename for X64 compile.',
  },
  {
    label: '#AutoIt3Wrapper_Compression',
    documentation: 'Compression parameter 0-4. 0=Low 2=normal 4=High.',
  },
  {
    label: '#AutoIt3Wrapper_UseUpx',
    documentation: 'Compress output program.',
    insertText: new SnippetString('#AutoIt3Wrapper_UseUpx=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_UPX_Parameters',
    documentation: 'Override the default setting for UPX.',
  },
  {
    label: '#AutoIt3Wrapper_Change2CUI',
    documentation: 'Change output program to CUI in stead of GUI.',
    insertText: new SnippetString('#AutoIt3Wrapper_Change2CUI=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Compile_both',
    documentation: 'Compile both X86 and X64 in one run.',
    insertText: new SnippetString('#AutoIt3Wrapper_Compile_both=${1|Y,N|}'),
  },
  { label: '#AutoIt3Wrapper_Res_Comment', documentation: 'Comment field' },
  { label: '#AutoIt3Wrapper_Res_Description', documentation: 'Description field' },
  { label: '#AutoIt3Wrapper_Res_Fileversion', documentation: '	File Version' },
  {
    label: '#AutoIt3Wrapper_Res_FileVersion_AutoIncrement',
    documentation:
      'AutoIncrement FileVersion After AUTEXE is finished. P=Prompt, Will ask at compilation time if you want to increase the version number',
    insertText: new SnippetString('#AutoIt3Wrapper_Res_FileVersion_AutoIncrement=${1|Y,P,N|}'),
  },
  { label: '#AutoIt3Wrapper_Res_ProductVersion', documentation: 'Product Version.' },
  { label: '#AutoIt3Wrapper_Res_Language', documentation: 'Resource Language code.' },
  { label: '#AutoIt3Wrapper_Res_LegalCopyright', documentation: 'Copyright field' },
  {
    label: '#AutoIt3Wrapper_res_requestedExecutionLevel',
    documentation:
      'asInvoker, highestAvailable, requireAdministrator or None (remove the trustInfo section).',
    insertText: new SnippetString(
      '#AutoIt3Wrapper_res_requestedExecutionLevel=${1|asInvoker,highestAvailable,requireAdministrator,None|}',
    ),
  },
  {
    label: '#AutoIt3Wrapper_res_Compatibility',
    documentation: '	Vista, Windows7 both allowed separated by a comma.',
  },
  {
    label: '#AutoIt3Wrapper_Res_SaveSource',
    documentation:
      'Save a copy of the script source in the EXE resources. If Y then the content of the script source depends on the #AutoIt3Wrapper_Run_Obfuscator and #obfuscator_parameters directives.',
    insertText: new SnippetString('#AutoIt3Wrapper_Res_SaveSource=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Run_Tidy',
    documentation: 'Run Tidy before compilation.',
    insertText: new SnippetString('#AutoIt3Wrapper_Run_Tidy=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_Tidy_Stop_OnError',
    documentation: 'Continue when only Warnings.',
    insertText: new SnippetString('#AutoIt3Wrapper_Tidy_Stop_OnError=${1|Y,N|}'),
  },
  {
    label: '#Tidy_Parameters',
    documentation: 'Parameters for Au3Tidy',
  },
];

const wrapperDirectivesCompletionItems = fillCompletions(
  wrapperDirectives,
  CompletionItemKind.Keyword,
  'AutoIt3Wrapper Directive',
);

const au3StripperDirectives = [
  {
    label: '#AutoIt3Wrapper_Run_Au3Stripper',
    documentation: 'Run Au3Stripper before compilation.',
    insertText: new SnippetString('#AutoIt3Wrapper_Run_Au3Stripper=${1|y,n|}'),
  },
  {
    label: '#Au3Stripper_Parameters',
    documentation: 'Parameters for Au3Stripper',
  },
  {
    label: '#Au3Stripper_Off',
    documentation: 'Stop the Stripping process below this line.',
  },
  {
    label: '#Au3Stripper_On',
    documentation: 'Start the Stripping process below this line.',
  },
  {
    label: '#Au3Stripper_Ignore_Funcs',
    documentation: 'Do not Strip these functions.',
  },
  {
    label: '#Au3Stripper_Ignore_Variables',
    documentation: 'Do not Strip these variables.',
  },
];

const au3StripperDirectivesCompletionItems = fillCompletions(
  au3StripperDirectives,
  CompletionItemKind.Keyword,
  'Au3Stripper Directive',
);

const au3CheckDirectives = [
  {
    label: '#AutoIt3Wrapper_Run_AU3Check',
    documentation: 'Run AU3Check before compilation.',
  },
  {
    label: '#AutoIt3Wrapper_AU3Check_Parameters',
    documentation: 'Au3Check parameters',
  },
  {
    label: '#AutoIt3Wrapper_AU3Check_Stop_OnWarning',
    documentation: 'Y = Always stop on warnings. (default)\rN = Contine on warnings.',
    insertText: new SnippetString('#AutoIt3Wrapper_AU3Check_Stop_OnWarning=${1|Y,N|}'),
  },
  {
    label: '#AutoIt3Wrapper_PlugIn_Funcs',
    documentation: 'Define PlugIn function names separated by a comma to avoid AU3Check errors.',
  },
];

const au3CheckDirectivesCompletionItems = fillCompletions(
  au3CheckDirectives,
  CompletionItemKind.Keyword,
  'Au3Check Directive',
);

const versioningDirectives = [
  {
    label: '#AutoIt3Wrapper_Versioning',
    documentation:
      'Run versioning to update the script source. V=only run when fileversion is increased by `#AutoIt3Wrapper_Res_FileVersion_AutoIncrement`.',
    insertText: new SnippetString('#AutoIt3Wrapper_Versioning=${1|Y,N,V|}'),
  },
  {
    label: '#AutoIt3Wrapper_Versioning_Parameters',
    documentation:
      '/NoPrompt: Will skip the Comments prompt\r\r/Comments: Text to added in the Comments. It can also contain the below variables.',
  },
];

const versioningDirectivesCompletionItems = fillCompletions(versioningDirectives);

const wrapperDirectivesHovers = completionToHover(wrapperDirectivesCompletionItems);
const au3StripperDirectivesHovers = completionToHover(au3StripperDirectivesCompletionItems);
const au3CheckDirectivesHovers = completionToHover(au3CheckDirectivesCompletionItems);
const versioningDirectivesHovers = completionToHover(versioningDirectivesCompletionItems);

export {
  wrapperDirectivesCompletionItems as default,
  wrapperDirectivesHovers,
  au3StripperDirectivesCompletionItems,
  au3StripperDirectivesHovers,
  au3CheckDirectivesCompletionItems,
  au3CheckDirectivesHovers,
  versioningDirectivesCompletionItems,
  versioningDirectivesHovers,
};
