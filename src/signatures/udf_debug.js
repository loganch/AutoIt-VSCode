import { br, opt, signatureToHover, valueFirstHeader } from '../util';

const include = '`#include <Debug.au3>`';

const signatures = {
  _Assert: {
    documentation: `Display a message if assertion fails ${include}`,
    label:
      '_Assert ( $sCondition, [$bExit] = True, [$iCode] = 0x7FFFFFFF, [$sLine] = @ScriptLineNumber )',
    params: [
      {
        label: '$sCondition',
        documentation: 'The condition (expression quoted) that must evaluate to true.',
      },
      {
        label: '$bExit',
        documentation: `${opt} If true, the script is aborted.`,
      },
      {
        label: '$iCode',
        documentation: `${opt} The exit code to use if the script is aborted.`,
      },
      {
        label: '$sLine',
        documentation: `${opt} Displays the line number where the assertion
          failed. If this value is not changed, then the default value will
          show the correct line.`,
      },
    ],
  },
  _DebugArrayDisplay: {
    documentation: `Displays a 1D or 2D array in a ListView to aid debugging ${include}`,
    label: `_DebugArrayDisplay ( Const ByRef $aArray, [$sTitle] = "DebugArray",
      [$sArrayRange] = "", [$iFlags] = 0, [$vUser_Separator] = Default,
      [$sHeader] = Default, [$iMax_ColWidth] = Default, [$hUser_Function] = "" )`,
    params: [
      { label: '$aArray', documentation: 'Array to display' },
      { label: '$sTitle', documentation: `${opt} Title for dialog. \`Default = "DebugArray"\`.` },
      {
        label: '$sArrayRange',
        documentation: `${opt} Range of rows/columns to display. Default ("") = entire array.`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} Determine UDF options.
      Add required values together${br}
      \`$ARRAYDISPLAY_COLALIGNLEFT\` (\`0\`) = (default) Column text alignment - left${br}
      \`$ARRAYDISPLAY_TRANSPOSE\` (\`1\`) = Transposes the array (2D only)`,
      },
      {
        label: '$vUser_Separator',
        documentation: `${opt} Sets column display option when copying data to clipboard.${br}
        Character = Delimiter between columns.${br}
        Number = Fixed column width - longer items will be truncated.${br}
        Default = Current separator character (usually "|").`,
      },
      {
        label: '$sHeader',
        documentation: `${opt} Column names in header (string of names separated by current separator character - usually "|").`,
      },
      {
        label: '$iMax_ColWidth',
        documentation: `${opt} Max width to which a ListView column will expand to show content. Default = 350 pixels.`,
      },
      {
        label: '$hUser_Function',
        documentation: `${opt} A variable assigned to the user defined function to run. Default = none. `,
      },
    ],
  },
  _DebugBugReportEnv: {
    documentation: `Outputs a string containing information for Bug report submission ${include}`,
    label: '_DebugBugReportEnv ( )',
    params: [],
  },
  _DebugCOMError: {
    documentation: `Sets, resets or queries the debug level for COM errors ${include}`,
    label: '_DebugCOMError ( [$iComDebug] = 1, [$bExit] = False )',
    params: [
      {
        label: '$iComDebug',
        documentation: `${opt} Debug level. Possible values are:${br}
          ${valueFirstHeader}
          -1|-|Return the current settings${br}
          0|-|Disable debugging${br}
          1|-|Enable debugging. Output the debug info (default)`,
      },
      {
        label: '$bExit',
        documentation: `${opt} \`True\` if the script must be terminated`,
      },
    ],
  },
  _DebugOut: {
    documentation: `Displays output on a debugging session started by \`_DebugSetup()\` ${include}`,
    label: '_DebugOut ( $sOutput )',
    params: [
      {
        label: '$sOutput',
        documentation:
          'The string (or other printable value) to be output to the debugging session.',
      },
    ],
  },
  _DebugReport: {
    documentation: `Writes to a debugging session ${include}`,
    label: '_DebugReport ( $sData, [$bLastError] = False, [$bExit] = False )',
    params: [
      {
        label: '$sData',
        documentation: 'Data to be reported',
      },
      {
        label: '$bLastError',
        documentation: `${opt} \`True\` if \`_WinAPI_GetLastErrorMessage()\` must be append to the data being reported`,
      },
      {
        label: '$bExit',
        documentation: `${opt} \`True\` if the script must be terminated`,
      },
    ],
  },
  _DebugReportEx: {
    documentation: `Writes to a debugging session a formatted message ${include}`,
    label: '_DebugReportEx ( $sData, [$bLastError] = False, [$bExit] = False )',
    params: [
      {
        label: '$sData',
        documentation: 'Data to be reported (e.g. "dllname|functionname")',
      },
      {
        label: '$bLastError',
        documentation: `${opt} \`True\` if \`_WinAPI_GetLastErrorMessage()\` must be append to the data being reported`,
      },
      {
        label: '$bExit',
        documentation: `${opt} \`True\` if the script must be terminated`,
      },
    ],
  },
  _DebugReportVar: {
    documentation: `Writes to debugging session the content of a variable ${include}`,
    label:
      '_DebugReportVar ( $sVarName, $vVar, [$bErrExt] = False, [$iDebugLineNumber] = @ScriptLineNumber )',
    params: [
      {
        label: '$sVarName',
        documentation: 'string representing name of the variable or a comment',
      },
      {
        label: '$vVar',
        documentation: 'the variable to be reported',
      },
      {
        label: '$bErrExt',
        documentation: `${opt} \`True\` if \`@error\` and \`@extended\` must also be displayed`,
      },
      {
        label: '$iDebugLineNumber',
        documentation: `${opt} can be used to overwrite the current calling line number. Default = \`@ScriptLineNumber\``,
      },
    ],
  },
  _DebugSetup: {
    documentation: `Setup up a debug session using a specific reporting type ${include}`,
    label:
      '_DebugSetup ( [$sTitle] = Default, [$bBugReportInfos] = False, [$vReportType] = 1, [$sLogFile] = "", [$bTimeStamp] = False )',
    params: [
      {
        label: '$sTitle',
        documentation: `${opt} Title to be displayed on the report window. Default value is "AutoIt Debug Report".`,
      },
      {
        label: '$bBugReportInfos',
        documentation: `${opt} Display BugReport infos. Default value is \`False\`.`,
      },
      {
        label: '$vReportType',
        documentation: `${opt} 1 - Report Log Window (Default).${br}
          2 - ConsoleWrite.${br}
          3 - MsgBox.${br}
          4 - FileWrite into \`$sLogFile\` defines the filename.${br}
          5 - Report Notepad Window.${br}
          string - name of specific report function to be used.`,
      },
      {
        label: '$sLogFile',
        documentation: `${opt} Name of the file if \`$vReportType\` = \`4\``,
      },
      {
        label: '$bTimeStamp',
        documentation: `${opt} \`True\` if every message must be prefixed with a timeStamp "YYYY/MM/DD HH:MM:SS"`,
      },
    ],
  },
};

const hovers = signatureToHover(signatures);

export { signatures as default, hovers };
