import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../util';

const signatures = {
  ACos: {
    documentation: 'Calculates the arcCosine of a number.',
    label: 'ACos(expression)',
    params: [
      {
        label: 'expression',
        documentation: 'Any value between -1 and 1 inclusive.',
      },
    ],
  },
  ASin: {
    documentation: 'Calculates the arcsine of a number.',
    label: 'ASin(expression)',
    params: [
      {
        label: 'expression',
        documentation: 'Any value between -1 and 1 (inclusive).',
      },
    ],
  },
  ATan: {
    documentation: 'Calculates the arctangent of a number.',
    label: 'ATan(expression)',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression.',
      },
    ],
  },
  Abs: {
    documentation: 'Calculates the absolute value of a number.',
    label: 'Abs(expression)',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression.',
      },
    ],
  },
  AdlibRegister: {
    documentation: 'Registers an Adlib function.',
    label: 'AdlibRegister ( "function" [, time = 250] )',
    params: [
      {
        label: '"function"',
        documentation: 'The name of the adlib function to be registered.',
      },
      {
        label: 'time',
        documentation:
          '**[optional]** how often in milliseconds to call the function. Default is 250 ms.',
      },
    ],
  },
  AdlibUnRegister: {
    documentation: 'Registers an Adlib function.',
    label: 'AdlibUnRegister ( ["function"] )',
    params: [
      {
        label: 'function',
        documentation: '**[optional]** The name of the adlib function to be Unregistered.',
      },
    ],
  },
  Asc: {
    documentation: 'Returns the unicode code of a character.',
    label: 'Asc ( "char" )',
    params: [
      {
        label: 'char',
        documentation:
          'The character to get the code for. If a string is used, the code for the first character is given.',
      },
    ],
  },
  AscW: {
    documentation: 'Returns the ASCII code of a character.',
    label: 'AscW ( "char" )',
    params: [
      {
        label: 'char',
        documentation:
          'The character to get the code for. If a string is used, the code for the first character is given.',
      },
    ],
  },
  Assign: {
    documentation: 'Assigns a variable by name with the data.',
    label: 'Assign ( "varname", "data" [, flag = 0] )',
    params: [
      {
        label: 'varname',
        documentation:
          'The name of the variable you wish to assign. Cannot be an array element and must only contain letters, digits and underscore characters (as per normal variable naming conventions).',
      },
      {
        label: 'data',
        documentation: 'The data you wish to assign to the variable.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** controls the way that variables are assigned  (add required options together):  \n&emsp;`$ASSIGN_CREATE` (`0`) = (default) Create variable if required  \n&emsp;`$ASSIGN_FORCELOCAL` (`1`) = Force creation in local scope  \n&emsp;`$ASSIGN_FORCEGLOBAL` (`2`) = Force creation in global scope  \n&emsp;`$ASSIGN_EXISTFAIL` (`4`) = Fail if variable does not already exist  \n\nConstants are defined in AutoItConstants.au3',
      },
    ],
  },
  AutoItSetOption: {
    documentation: 'Changes the operation of various AutoIt functions/parameters.',
    label: 'AutoItSetOption ( "option" [, param] )',
    params: [
      {
        label: 'option',
        documentation: 'The option to change.',
      },
      {
        label: 'param',
        documentation:
          '**[optional]** The value to assign to the option. The type and meaning vary by option. If the param is not provided, then the function just returns the value already assigned to the option. The keyword Default can be used for the parameter to reset the option to its default value.',
      },
    ],
  },
  AutoItWinGetTitle: {
    documentation: 'Retrieves the title of the AutoIt window.',
    label: 'AutoItWinGetTitle ( )',
    params: [],
  },
  AutoItWinSetTitle: {
    documentation: 'Changes the title of the AutoIt window.',
    label: 'AutoItWinSetTitle ( "newtitle" )',
    params: [
      {
        label: 'newtitle',
        documentation: 'The new title to give to the window.',
      },
    ],
  },
  Beep: {
    documentation: 'Plays back a beep to the user.',
    label: 'Beep ( [Frequency = 500 [, Duration = 1000]] )',
    params: [
      {
        label: 'Frequency',
        documentation:
          '**[optional]** The frequency of the beep in hertz. Can be anywhere from 37 through 32,767 (0x25 through 0x7FFF). Default is 500 Hz.',
      },
      {
        label: 'Duration',
        documentation: '**[optional]** The length of the beep in milliseconds. Default = 1000 ms.',
      },
    ],
  },
  Binary: {
    documentation: 'Returns the binary representation of an expression.',
    label: 'Binary ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into binary/byte data.',
      },
    ],
  },
  BinaryLen: {
    documentation: 'Returns the number of bytes in a binary variant.',
    label: 'BinaryLen ( binary )',
    params: [
      {
        label: 'binary',
        documentation: 'The binary data to evaluate.',
      },
    ],
  },
  BinaryMid: {
    documentation: 'Returns the number of bytes in a binary variant.',
    label: 'BinaryMid ( binary, start [, count] )',
    params: [
      {
        label: 'binary',
        documentation: 'The binary data to evaluate.',
      },
      {
        label: 'start',
        documentation: 'The byte position to start. (1 = first byte)',
      },
      {
        label: 'count',
        documentation:
          '**[optional]** The number of bytes to extract. By default the entire remainder of the binary data.',
      },
    ],
  },
  BinaryToString: {
    documentation: 'Converts a binary variant into a string.',
    label: 'BinaryToString ( expression [, flag = 1] )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into a string.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes how the binary data is converted:  \n&emsp;`$SB_ANSI` (`1`) = binary data is ANSI (default)  \n&emsp;`$SB_UTF16LE` (`2`) = binary data is UTF16 Little Endian  \n&emsp;`$SB_UTF16BE` (`3`) = binary data is UTF16 Big Endian  \n&emsp;`$SB_UTF8` (`4`) = binary data is UTF8  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  BitAND: {
    documentation: 'Performs a bitwise AND operation.',
    label: 'BitAND (value1, value2 [, value n])',
    params: [
      {
        label: 'value1',
        documentation: 'The first number.',
      },
      {
        label: 'value2',
        documentation: 'The second number.',
      },
      {
        label: 'value n',
        documentation: '**[optional]** The nth number - up to 255 values can be specified.',
      },
    ],
  },
  BitNOT: {
    documentation: 'Performs a bitwise NOT operation.',
    label: 'BitNOT ( value )',
    params: [
      {
        label: 'value',
        documentation: 'The number to operate on.',
      },
    ],
  },
  BitOR: {
    documentation: 'Performs a bitwise OR operation.',
    label: 'BitOR ( value1, value2 [, value n] )',
    params: [
      {
        label: 'value1',
        documentation: 'The first number.',
      },
      {
        label: 'value2',
        documentation: 'The second number.',
      },
      {
        label: 'value n',
        documentation: '**[optional]** The nth number - up to 255 values can be specified.',
      },
    ],
  },
  BitRotate: {
    documentation: 'Performs a bitwise OR operation.',
    label: 'BitRotate ( value [, shift = 1 [, size = "W"]] )',
    params: [
      {
        label: 'value',
        documentation: 'The number to be operated on.',
      },
      {
        label: 'shift',
        documentation:
          '**[optional]** Number of bits to rotate to the left (negative numbers rotate right). If not given, the default is 1.',
      },
      {
        label: 'size',
        documentation:
          '**[optional]** A string that determines the rotation size, the default is (16 bits). ',
      },
    ],
  },
  BitShift: {
    documentation: 'Performs a bit shifting operation.',
    label: 'BitShift ( value, shift )',
    params: [
      {
        label: 'value',
        documentation: 'The number to be shifted.',
      },
      {
        label: 'shift',
        documentation: 'Number of bits to shift to the right (negative numbers shift left).',
      },
    ],
  },
  BitXOR: {
    documentation: 'Performs a bitwise exclusive OR (XOR) operation.',
    label: 'BitXOR ( value1, value2 [, value n] )',
    params: [
      {
        label: 'value1',
        documentation: 'The first number.',
      },
      {
        label: 'value2',
        documentation: 'The second number.',
      },
      {
        label: 'value n',
        documentation: '**[optional]** The nth number - up to 255 values can be specified.',
      },
    ],
  },
  BlockInput: {
    documentation: 'Disable/enable the mouse and keyboard.',
    label: 'BlockInput ( flag )',
    params: [
      {
        label: 'flag',
        documentation:
          '&emsp;`$BI_DISABLE` (`1`) = Disable user input  \n&emsp;`$BI_ENABLE` (`0`) = Enable user input',
      },
    ],
  },
  CDTray: {
    documentation: 'Opens or closes the CD tray.',
    label: 'CDTray ( "drive", "status" )',
    params: [
      {
        label: 'drive',
        documentation:
          'The drive letter of the CD tray to control, in the format **D:**, **E:**, etc.',
      },
      {
        label: 'status',
        documentation:
          'Specifies if you want the CD tray to be open or closed  \n&emsp;`$CDTRAY_OPEN` ("open") - to be open  \n&emsp;`$CDTRAY_CLOSED` ("closed") - to be closed on cd tray (not laptop-style)  \n\nConstants are defined in AutoItConstants.au3',
      },
    ],
  },
  Call: {
    documentation: 'Calls a user-defined or built-in function contained in first parameter.',
    label: 'Call ( "function" [, paramN] )',
    params: [
      {
        label: 'function',
        documentation: 'The name of function or function to call.',
      },
      {
        label: 'paramN',
        documentation: 'Argument(s) that will be passed to the function being invoked.',
      },
    ],
  },
  Ceiling: {
    documentation: 'Returns a number rounded up to the next integer.',
    label: 'Ceiling ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression.',
      },
    ],
  },
  Chr: {
    documentation: 'Returns a character corresponding to an ASCII code.',
    label: 'Chr ( ASCIIcode )',
    params: [
      {
        label: 'ASCIIcode',
        documentation: 'An ASCII code in the range 0-255 (e.g., 65 returns the capital letter A).',
      },
    ],
  },
  ChrW: {
    documentation: 'Returns a character corresponding to a unicode code.',
    label: 'ChrW ( UNICODEcode  )',
    params: [
      {
        label: 'UNICODEcode',
        documentation:
          'A unicode code in the range 0-65535 (e.g., 65 returns the capital letter A).',
      },
    ],
  },
  ClipGet: {
    documentation: 'Retrieves text from the clipboard.',
    label: 'ClipGet ( )',
    params: [],
  },
  ClipPut: {
    documentation: 'Writes text to the clipboard.',
    label: 'ClipPut( "value" )',
    params: [
      {
        label: '"value"',
        documentation: 'The text to write to the clipboard.',
      },
    ],
  },
  ConsoleRead: {
    documentation: 'Read from the STDIN stream of the AutoIt script process.',
    label: 'ConsoleRead ( [peek = False [, binary = False]] )',
    params: [
      {
        label: 'peek',
        documentation:
          '**[optional]** If True the function does not remove the read characters from the stream.',
      },
      {
        label: 'binary',
        documentation:
          '**[optional]** If True the function reads the data as binary instead of text (default is text).',
      },
    ],
  },
  ConsoleWrite: {
    documentation:
      'Writes data to the STDOUT stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.',
    label: 'ConsoleWrite ( "data" )',
    params: [
      {
        label: 'data',
        documentation: 'The data you wish to output. This may either be text or binary.',
      },
    ],
  },
  ConsoleWriteError: {
    documentation:
      'Writes data to the STDERR stream. Some text editors can read this stream as can other programs which may be expecting data on this stream.',
    label: 'ConsoleWriteError ( "data" )',
    params: [
      {
        label: 'data',
        documentation: 'The data you wish to output. This may either be text or binary.',
      },
    ],
  },
  ControlClick: {
    documentation: 'Sends a mouse click command to a given control.',
    label:
      'ControlClick ( "title", "text", controlID [, button = "left" [, clicks = 1 [, x [, y]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'button',
        documentation:
          '**[optional]** The button to click, "left", "right", "middle", "main", "menu", "primary", "secondary". Default is the left button.',
      },
      {
        label: 'clicks',
        documentation: '**[optional]** The number of times to click the mouse. Default is 1.',
      },
      {
        label: 'x',
        documentation:
          '**[optional]** The x position to click within the control. Default is center.',
      },
      {
        label: 'y',
        documentation:
          '**[optional]** The y position to click within the control. Default is center.',
      },
    ],
  },
  ControlCommand: {
    documentation: 'Sends a command to a control.',
    label: 'ControlCommand ( "title", "text", controlID, "command" [, "option"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'command',
        documentation: 'The command to send to the control.',
      },
      {
        label: 'option',
        documentation: '**[optional]** Additional parameter required by some commands.',
      },
    ],
  },
  ControlDisable: {
    documentation: 'Disables or "grays-out" a control.',
    label: 'ControlDisable ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlEnable: {
    documentation: 'Enables a "grayed-out" control.',
    label: 'ControlEnable ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlFocus: {
    documentation: 'Sets input focus to a given control on a window.',
    label: 'ControlFocus ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlGetFocus: {
    documentation:
      'Returns the ControlRef# of the control that has keyboard focus within a specified window.',
    label: 'ControlGetFocus ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: '**[optional]** The text of the window to access.',
      },
    ],
  },
  ControlGetHandle: {
    documentation: 'Retrieves the internal handle of a control.',
    label: 'ControlGetHandle ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlGetPos: {
    documentation: 'Retrieves the position and size of a control relative to its window.',
    label: 'ControlGetPos ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlGetText: {
    documentation: 'Retrieves text from a control.',
    label: 'ControlGetText ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlHide: {
    documentation: 'Hides a control.',
    label: 'ControlHide ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlListView: {
    documentation: 'Sends a command to a ListView32 control.',
    label: 'ControlListView ( "title", "text", controlID, "command" [, option1 [, option2]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'command',
        documentation: 'The command to send to the control.',
      },
      {
        label: 'option1',
        documentation: '**[optional]** Additional parameter required by some commands.',
      },
      {
        label: 'option2',
        documentation: '**[optional]** Additional parameter required by some commands.',
      },
    ],
  },
  ControlMove: {
    documentation: 'Moves a control within a window.',
    label: 'ControlMove ( "title", "text", controlID, x, y [, width [, height]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'x',
        documentation: 'X coordinate to move to relative to the window client area.',
      },
      {
        label: 'y',
        documentation: 'Y coordinate to move to relative to the window client area.',
      },
      {
        label: 'width',
        documentation: '**[optional]** New width of the window.',
      },
      {
        label: 'height',
        documentation: '**[optional]** New height of the window.',
      },
    ],
  },
  ControlSend: {
    documentation: 'Sends a string of characters to a control.',
    label: 'ControlSend ( "title", "text", controlID, "string" [, flag = 0] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'string',
        documentation: 'String of characters to send to the control.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes how "keys" is processed:  \n&emsp;`$SEND_DEFAULT` (`0`) = Text contains special characters like + and ! to indicate SHIFT and ALT key-presses (default).  \n&emsp;`SEND_RAW` (`1`) = keys are sent raw.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  ControlSetText: {
    documentation: 'Sets text of a control.',
    label: 'ControlSetText  ( "title", "text", controlID, "new text" [, flag = 0] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'new text',
        documentation: 'The new text to be set into the control.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** when different from 0 (default) will force the target window to be redrawn.',
      },
    ],
  },
  ControlShow: {
    documentation: 'Shows a control that was hidden.',
    label: 'ControlShow ( "title", "text", controlID )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
    ],
  },
  ControlTreeView: {
    documentation: 'Sends a command to a TreeView32 control.',
    label: 'ControlTreeView ( "title", "text", controlID, "command" [, option1] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to access.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to access.',
      },
      {
        label: 'controlID',
        documentation: 'The control to interact with.',
      },
      {
        label: 'command',
        documentation: 'The command to send to the control.',
      },
      {
        label: 'option1',
        documentation: '**[optional]** Additional parameter required by some commands.',
      },
    ],
  },
  Cos: {
    documentation: 'Calculates the cosine of a number.',
    label: 'Cos ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Value in radians.',
      },
    ],
  },
  Dec: {
    documentation: 'Returns a numeric representation of a hexadecimal string.',
    label: 'Dec ( "hex" [, flag = 0] )',
    params: [
      {
        label: 'hex',
        documentation: 'The hexadecimal string to convert.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Defines behavior.  \nCan be one of the following:  \n&emsp;Default = string is interpreted as an integer. See remarks.  \n&emsp;`$NUMBER_32BIT` (`1`) = string is interpreted as a 32bit integer  \n&emsp;`$NUMBER_64BIT` (`2`) = string is interpreted as a 64bit integer  \n&emsp;`$NUMBER_DOUBLE` (`3`) = string is interpreted as a double  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  DirCopy: {
    documentation: 'Copies a directory and all sub-directories and files (Similar to xcopy).',
    label: 'DirCopy ( "source dir", "dest dir" [, flag = 0] )',
    params: [
      {
        label: 'source dir',
        documentation:
          'Path of the source directory (with no trailing backslash). e.g. "C:\\Path1"',
      },
      {
        label: 'dest dir',
        documentation:
          'Path of the destination dir (with no trailing backslash). e.g. "C:\\Path_Copy"',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** this flag determines whether to overwrite files if they already exist:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing files  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing files  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  DirCreate: {
    documentation: 'Creates a directory/folder.',
    label: 'DirCreate ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of the directory to create.',
      },
    ],
  },
  DirGetSize: {
    documentation: 'Returns the size in bytes of a given directory.',
    label: 'DirGetSize ( "path" [, flag = 0] )',
    params: [
      {
        label: 'path',
        documentation: 'Path of the directory to create.',
      },
      {
        label: 'flag',
        documentation:
          "**[optional]** this flag determines the behaviour and result of the function, and can be a combination of the following:  \n&emsp;`$DIR_DEFAULT` (`0`) = (default)  \n&emsp;`$DIR_EXTENDED` (`1`) = Extended mode is On -> returns an array that contains extended information (see Remarks).  \n&emsp;`$DIR_NORECURSE` (`2`) = Don't get the size of files in subdirectories (recursive mode is Off)",
      },
    ],
  },
  DirMove: {
    documentation: 'Copies a directory and all sub-directories and files (Similar to xcopy).',
    label: 'DirMove ( "source dir", "dest dir" [, flag = 0] )',
    params: [
      {
        label: 'source dir',
        documentation:
          'Path of the source directory (with no trailing backslash). e.g. "C:\\Path1"',
      },
      {
        label: 'dest dir',
        documentation:
          'Path of the destination dir (with no trailing backslash). e.g. "C:\\Path_Copy"',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** this flag determines whether to overwrite files if they already exist:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing files;  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing files  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  DirRemove: {
    documentation: 'Deletes a directory/folder.',
    label: 'DirRemove ( "path" [, recurse = 0] )',
    params: [
      {
        label: 'path',
        documentation: 'Path of the directory to remove.',
      },
      {
        label: 'recurse',
        documentation:
          '**[optional]** Use this flag to specify if you want to delete sub-directories too.  \n&emsp;`$DIR_DEFAULT` (`0`) = (default) deletes the folder, only if it is empty  \n&emsp;`$DIR_REMOVE` (`1`) = remove files and subdirectories (like the DOS DelTree command)  \nConstants are define in "AutoItConstants.au3".',
      },
    ],
  },
  DllCall: {
    documentation: 'Dynamically calls a function in a DLL.',
    label: 'DllCall ( "dll", "return type", "function" [, type1, param1 [, type n, param n]] )',
    params: [
      {
        label: 'dll',
        documentation:
          'The filename of the DLL to use. e.g. "user32.dll". A handle obtained from DllOpen can also be used.',
      },
      {
        label: 'return type',
        documentation: 'The return type of the function',
      },
      {
        label: 'function',
        documentation:
          'The name, eg. "MessageBox" or the ordinal value, e.g. 62, of the function in the DLL to call.',
      },
      {
        label: 'type1',
        documentation: '**[optional]** The type of the parameter ',
      },
      {
        label: 'param1',
        documentation: '**[optional]** The actual parameter',
      },
      {
        label: 'type n',
        documentation: '**[optional]** The type of the nth parameter',
      },
      {
        label: 'param n',
        documentation: '**[optional]** The actual nth parameter',
      },
    ],
  },
  DllCallAddress: {
    documentation: 'Dynamically calls a function in a DLL.',
    label: 'DllCallAddress ( "return type", address  [, type1, param1 [, type n, param n]] )',
    params: [
      {
        label: 'return type',
        documentation: 'The return type of the function',
      },
      {
        label: 'address',
        documentation:
          'The address of a function. **If this value is invalid your script will crash!**',
      },
      {
        label: 'type1',
        documentation: '**[optional]** The type of the parameter ',
      },
      {
        label: 'param1',
        documentation: '**[optional]** The actual parameter',
      },
      {
        label: 'type n',
        documentation: '**[optional]** The type of the nth parameter',
      },
      {
        label: 'param n',
        documentation: '**[optional]** The actual nth parameter',
      },
    ],
  },
  DllCallbackFree: {
    documentation: 'Frees a previously created handle created with DllCallbackRegister.',
    label: 'DllCallbackFree ( handle )',
    params: [
      {
        label: 'handle',
        documentation:
          'The DllCallback handle, as returned by a previous call to `DllCallbackRegister()`.',
      },
    ],
  },
  DllCallbackGetPtr: {
    documentation:
      'Returns the pointer to a callback function that can be passed to the Win32 API.',
    label: 'DllCallbackGetPtr ( handle )',
    params: [
      {
        label: 'handle',
        documentation: 'A DllCallback handle returned from `DllCallbackRegister()`.',
      },
    ],
  },
  DllCallbackRegister: {
    documentation: 'Creates a user-defined DLL Callback function.',
    label: 'DllCallbackRegister ( "function", "return type", "params" )',
    params: [
      {
        label: 'function',
        documentation: 'The name of the User Defined Function to call.',
      },
      {
        label: 'return type',
        documentation: 'The return type and calling convention of the function',
      },
      {
        label: 'params',
        documentation:
          'A semi-colon separated list of parameters that will be passed to this function.',
      },
    ],
  },
  DllClose: {
    documentation: 'Closes a previously opened DLL.',
    label: 'DllClose ( dllhandle )',
    params: [
      {
        label: 'dllhandle',
        documentation: 'The handle of a dll, as returned by a previous call to `DllOpen()`.',
      },
    ],
  },
  DllOpen: {
    documentation: 'Opens a DLL file for use in DllCall.',
    label: 'DllOpen ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'Filename of the DLL file to open.',
      },
    ],
  },
  DllStructCreate: {
    documentation: 'Creates a C/C++ style structure to be used in DllCall.',
    label: 'DllStructCreate ( Struct [, Pointer] )',
    params: [
      {
        label: 'Struct',
        documentation: 'A string representing the structure to create.',
      },
      {
        label: 'Pointer',
        documentation:
          '**[optional]** If supplied the struct will not allocate memory but use the pointer supplied.',
      },
    ],
  },
  DllStructGetData: {
    documentation: 'Returns the data of an element of the struct.',
    label: 'DllStructGetData ( Struct, Element [, index = Default] )',
    params: [
      {
        label: 'Struct',
        documentation: 'The struct returned by `DllStructCreate()`.',
      },
      {
        label: 'Element',
        documentation:
          'Which element of the struct you want to access, starting at 1 or the element name as defined in `DllStructCreate()`. ',
      },
      {
        label: 'index',
        documentation:
          '**[optional]** For elements that are an array this specifies the 1-based index to retrieve. If omitted or the Default keyword then the entire array is retrieved (Useful for quickly retrieving strings). **Not used for non-array elements.**',
      },
    ],
  },
  DllStructGetPtr: {
    documentation: 'Returns the pointer to the struct or an element in the struct.',
    label: 'DllStructGetPtr ( Struct [, Element] )',
    params: [
      {
        label: 'Struct',
        documentation: 'The struct returned by `DllStructCreate()`. ',
      },
      {
        label: 'Element',
        documentation:
          '**[optional]** The element of the struct whose pointer you need, starting at 1 or the element name as defined in `DllStructCreate()`. ',
      },
    ],
  },
  DllStructGetSize: {
    documentation: 'Returns the size of the struct in bytes.',
    label: 'DllStructGetSize ( Struct )',
    params: [
      {
        label: 'Struct',
        documentation: 'The struct returned by `DllStructCreate()`.',
      },
    ],
  },
  DllStructSetData: {
    documentation: 'Sets the data of an element in the struct.',
    label: 'DllStructSetData ( Struct, Element, value [, index] )',
    params: [
      {
        label: 'Struct',
        documentation: 'The struct returned by `DllStructCreate()`. ',
      },
      {
        label: 'Element',
        documentation:
          'Which element of the struct you want to access, starting at 1, or the element name as defined in `DllStructCreate()`. ',
      },
      {
        label: 'value',
        documentation: 'The new value to place in the struct element. ',
      },
      {
        label: 'index',
        documentation:
          '**[optional]** For elements that are an array this specifies the 1-based index to set. If omitted or the Default keyword then as much of the value as possible will be set in element starting at index 1 (Useful for quickly setting strings). **Not used for non-array elements.**',
      },
    ],
  },
  DriveGetDrive: {
    documentation: 'Returns an array containing the enumerated drives.',
    label: 'DriveGetDrive ( "type" )',
    params: [
      {
        label: 'type',
        documentation:
          'Type of drive to find:  \n&emsp;`$DT_ALL` ("ALL")  \n&emsp;`$DT_CDROM` ("CDROM")  \n&emsp;`$DT_REMOVABLE` ("REMOVABLE")  \n&emsp;`$DT_FIXED` ("FIXED")  \n&emsp;`$DT_NETWORK` ("NETWORK")  \n&emsp;`$DT_RAMDISK` ("RAMDISK")  \n&emsp;`$DT_UNKNOWN` ("UNKNOWN")  \n\nConstants are defined in AutoItConstants.au3',
      },
    ],
  },
  DriveGetFileSystem: {
    documentation: 'Returns File System Type of a drive.',
    label: 'DriveGetFileSystem ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  DriveGetLabel: {
    documentation: 'Returns Volume Label of a drive, if it has one.',
    label: 'DriveGetLabel ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  DriveGetSerial: {
    documentation: 'Returns Serial Number of a drive.',
    label: 'DriveGetSerial ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  DriveGetType: {
    documentation: 'Returns drive type.',
    label: 'DriveGetType ( "path" [, operation = 1] )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
      {
        label: 'operation',
        documentation:
          '**[optional]** The drive type operation to perform.  \n&emsp;`$DT_DRIVETYPE` (`1`) = the type of drive (default)  \n&emsp;`$DT_SSDSTATUS` (`2`) = SSD status of the drive  \n&emsp;`$DT_BUSTYPE` (`3`) = the bus type of drive  \n\nConstants are defined in AutoItConstants.au3.',
      },
    ],
  },
  DriveMapAdd: {
    documentation: 'Maps a network drive.',
    label: 'DriveMapAdd ( "device", "remote share" [, flags = 0 [, "user" [, "password"]]] )',
    params: [
      {
        label: 'device',
        documentation:
          'The device to map, for example "O:" or "LPT1:". If you pass an empty string for this parameter a connection is made but not mapped to a specific drive. If you specify "*" an unused drive letter will be automatically selected.',
      },
      {
        label: 'remote share',
        documentation: 'The remote share to connect to in the form "&#92;&#92;server&#92;share". ',
      },
      {
        label: 'flags',
        documentation:
          '**[optional]** A combination of the following:  \n&emsp;`$DMA_DEFAULT` (`0`) = default;  \n&emsp;`$DMA_PERSISTENT` (`1`) = Persistent mapping;  \n&emsp;`$DMA_AUTHENTICATION` (`8`) = Show authentication dialog if required  \n\nConstants are defined in "AutoItConstants.au3"',
      },
      {
        label: 'user',
        documentation:
          '**[optional]** The username to use to connect. In the form "username" or "domain\\username".',
      },
      {
        label: 'password',
        documentation: '**[optional]** The password to use to connect.',
      },
    ],
  },
  DriveMapDel: {
    documentation: 'Disconnects a network drive.',
    label: 'DriveMapDel ( "drive" )',
    params: [
      {
        label: 'drive',
        documentation: 'The device to disconnect, e.g. "O:" or "LPT1:". ',
      },
    ],
  },
  DriveMapGet: {
    documentation: 'Retrieves the details of a mapped drive.',
    label: 'DriveMapGet ( "device" )',
    params: [
      {
        label: 'device',
        documentation: 'The device (drive or printer) letter to query, e.g. "O:" or "LPT1:" ',
      },
    ],
  },
  DriveSetLabel: {
    documentation: 'Sets the Volume Label of a drive.',
    label: 'DriveSetLabel ( "path", "label" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to change. ',
      },
      {
        label: 'label',
        documentation: 'New volume label for the drive. (11 characters is usually max length) ',
      },
    ],
  },
  DriveSpaceFree: {
    documentation: 'Returns the free disk space of a path in Megabytes.',
    label: 'DriveSpaceFree ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  DriveSpaceTotal: {
    documentation: 'Returns the total disk space of a path in Megabytes.',
    label: 'DriveSpaceTotal ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  DriveStatus: {
    documentation: 'Returns the status of the drive as a string.',
    label: 'DriveStatus ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'Path of drive to receive information from. ',
      },
    ],
  },
  EnvGet: {
    documentation: 'Retrieves an environment variable.',
    label: 'EnvGet ( "envvariable" )',
    params: [
      {
        label: 'envvariable',
        documentation: 'Name of the environment variable to get such as "TEMP" or "PATH". ',
      },
    ],
  },
  EnvSet: {
    documentation: 'Writes an environment variable.',
    label: 'EnvSet ( "envvariable" [, "value"] )',
    params: [
      {
        label: 'envvariable',
        documentation: 'Name of the environment variable to set. ',
      },
      {
        label: 'value',
        documentation:
          '**[optional]** Value to set the environment variable to. If a value is not used the environment variable will be deleted. ',
      },
    ],
  },
  EnvUpdate: {
    documentation: 'Refreshes the OS environment.',
    label: 'EnvUpdate ( )',
    params: [],
  },
  Eval: {
    documentation: 'Return the value of the variable defined by a string.',
    label: 'Eval ( string )',
    params: [
      {
        label: 'string',
        documentation: 'string representing name of the variable. ',
      },
    ],
  },
  Execute: {
    documentation: 'Execute an expression.',
    label: 'Execute ( string )',
    params: [
      {
        label: 'string',
        documentation: 'string representing an expression to be evaluated. ',
      },
    ],
  },
  Exp: {
    documentation: 'Calculates e to the power of a number.',
    label: 'Exp ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression. ',
      },
    ],
  },
  FileChangeDir: {
    documentation: 'Changes the current working directory.',
    label: 'FileChangeDir ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'The path to make the current working directory. ',
      },
    ],
  },
  FileClose: {
    documentation: 'Closes a previously opened file.',
    label: 'FileClose ( "filehandle" )',
    params: [
      {
        label: 'filehandle',
        documentation: 'The handle of a file, as returned by a previous call to FileOpen(). ',
      },
    ],
  },
  FileCopy: {
    documentation: 'Copies one or more files.',
    label: 'FileCopy ( "source", "dest" [, flag = 0] )',
    params: [
      {
        label: 'source',
        documentation: 'The source path of the file(s) to copy. (* and ? wildcards accepted) ',
      },
      {
        label: 'dest',
        documentation: 'The destination path of the copied file(s). ',
      },
      {
        label: 'flag',
        documentation:
          "**[optional]** this flag determines whether to overwrite files if they already exist.  \nCan be a combination of the following:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing files  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing files  \n&emsp;`$FC_CREATEPATH` (`8`) = Create destination directory structure if it doesn't exist (See Remarks).  \n\nConstants are defined in FileConstants.au3.",
      },
    ],
  },
  FileCreateNTFSLink: {
    documentation: 'Creates an NTFS hardlink to a file or a directory.',
    label: 'FileCreateNTFSLink ( "source", "hardlink" [, flag = 0] )',
    params: [
      {
        label: 'source',
        documentation: 'Path of the source to which the hardlink will be created. ',
      },
      {
        label: 'hardlink',
        documentation: 'Path of the hardlink. ',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** this flag determines whether to overwrite link if they already exist.  \nCan be a combination of the following:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing link  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing link  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileCreateShortcut: {
    documentation: 'Creates a shortcut (.lnk) to a file.',
    label:
      'FileCreateShortcut ( "file", "lnk" [, "workdir" [, "args" [, "desc" [, "icon" [, "hotkey" [, icon number [, state]]]]]]] )',
    params: [
      {
        label: 'file',
        documentation: 'Full path and file name of file to which the shortcut will point. ',
      },
      {
        label: 'lnk',
        documentation: 'Full path and file name of the shortcut. ',
      },
      {
        label: 'workdir',
        documentation: '**[optional]** Working directory. ',
      },
      {
        label: 'args',
        documentation: '**[optional]** Additional file arguments. ',
      },
      {
        label: 'desc',
        documentation: '**[optional]** File Description. ',
      },
      {
        label: 'icon',
        documentation: '**[optional]** Full Path/File name of icon to use. ',
      },
      {
        label: 'hotkey',
        documentation: '**[optional]** Hotkey - same as the Send() key format. ',
      },
      {
        label: 'icon number',
        documentation: '**[optional]** The icon instance to use (usually 0) ',
      },
      {
        label: 'state',
        documentation:
          '**[optional]** The state the shortcut is launched in. Use either `@SW_SHOWNORMAL`, `@SW_SHOWMINNOACTIVE` or `@SW_SHOWMAXIMIZED`',
      },
    ],
  },
  FileDelete: {
    documentation: 'Delete one or more files.',
    label: 'FileDelete ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'The path of the file(s) to delete.  ',
      },
    ],
  },
  FileExists: {
    documentation: 'Checks if a file or directory exists.',
    label: 'FileExists ( "path" )',
    params: [
      {
        label: 'path',
        documentation: 'The directory or file to check. ',
      },
    ],
  },
  FileFindFirstFile: {
    documentation: 'Creates a search handle, defined by a path and file mask.',
    label: 'FileFindFirstFile ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'The path and file name. ',
      },
    ],
  },
  FileFindNextFile: {
    documentation: 'Returns the next filename defined by the search handle.',
    label: 'FileFindNextFile ( search [, flag = 0])',
    params: [
      {
        label: 'search',
        documentation: 'The search handle, as returned by `FileFindFirstFile()`. ',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** this flag determines whether to return detailed file attribute information in `@extended`.  \n&emsp;0 = (default) use `@extended` to return 1 or 0 if search item is a directory.  \n&emsp;1 = Return a string in `@extended` in the same format as `FileGetAttrib()`.',
      },
    ],
  },
  FileFlush: {
    documentation: "Flushes the file's buffer to disk.",
    label: 'FileFlush ( "filehandle" )',
    params: [
      {
        label: 'filehandle',
        documentation: 'The handle of a file, as returned by a previous call to FileOpen(). ',
      },
    ],
  },
  FileGetAttrib: {
    documentation: "Returns a code string representing a file's attributes.",
    label: 'FileGetAttrib ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'The path to the file or directory to check. ',
      },
    ],
  },
  FileGetEncoding: {
    documentation: 'Determines the text encoding used in a file.',
    label: 'FileGetEncoding ( "filehandle/filename" [, mode = 1] )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively you may use a string filename as the first parameter. ',
      },
      {
        label: 'mode',
        documentation:
          '**[optional]** The UTF8 detection mode to use.  \n&emsp;`$FE_ENTIRE_UTF8` (`1`) = Check entire file for UTF8 sequences (default)  \n&emsp;`$FE_PARTIALFIRST_UTF8` (`2`) = Check first part of file for UTF8 sequences (the same as `FileOpen()` uses by default)  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileGetLongName: {
    documentation: 'Returns the long path+name of the path+name passed.',
    label: 'FileGetLongName ( "filename" [, flag = 0] )',
    params: [
      {
        label: 'filename',
        documentation: 'Full path and file name to convert ',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**  \n&emsp;`$FN_FULLPATH` (`0`) - Default;  \n&emsp;`$FN_RELATIVEPATH` (`1`) - file can have relative dir, e.g. "..&#92;file.txt"  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileGetPos: {
    documentation: 'Retrieves the current file position.',
    label: 'FileGetPos ( "filehandle" )',
    params: [
      {
        label: 'filehandle',
        documentation: 'The handle of a file, as returned by a previous call to FileOpen(). ',
      },
    ],
  },
  FileGetShortName: {
    documentation: 'Returns the 8.3 short path+name of the path+name passed.',
    label: 'FileGetShortName ( "filename" [, flag = 0] )',
    params: [
      {
        label: 'filename',
        documentation: 'full path and file name to convert ',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**  \n&emsp;`$FN_FULLPATH` (`0`) - Default;  \n&emsp;`$FN_RELATIVEPATH` (`1`) - file can have relative dir, e.g. "..&#92;file.txt"  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileGetShortcut: {
    documentation: 'Retrieves details about a shortcut.',
    label: 'FileGetShortcut ( "lnk" )',
    params: [
      {
        label: 'lnk',
        documentation: 'Full path and file name of the shortcut. ',
      },
    ],
  },
  FileGetSize: {
    documentation: 'Returns the size of a file in bytes.',
    label: 'FileGetSize ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'Filename to check. ',
      },
    ],
  },
  FileGetTime: {
    documentation: 'Returns the time and date information for a file.',
    label: 'FileGetTime ( "filename" [, option = 0 [, format = 0]] )',
    params: [
      {
        label: 'filename',
        documentation: 'The path to the file or directory to check. ',
      },
      {
        label: 'option',
        documentation:
          '**[optional]** Flag to indicate which timestamp:  \n&emsp;`$FT_MODIFIED` (`0`) = Last modified (default);  \n&emsp;`$FT_CREATED` (`1`) = Created;  \n&emsp;`$FT_ACCESSED` (`2`) = Last accessed  \n\nConstants are defined in FileConstants.au3',
      },
      {
        label: 'format',
        documentation:
          '**[optional]** to specify type of return  \n&emsp;`$FT_ARRAY` (`0`) = return an array (default)  \n&emsp;`$FT_STRING` (`1`) = return a string YYYYMMDDHHMMSS  \n\nConstants are defined in FileConstants.au3',
      },
    ],
  },
  FileGetVersion: {
    documentation: 'Returns version information stored in a file.',
    label: 'FileGetVersion ( "filename" [, "stringname"] )',
    params: [
      {
        label: 'filename',
        documentation: 'Filename. ',
      },
      {
        label: 'stringname',
        documentation:
          '**[optional]** Name of the string field to be retrieved from the header version file info:  \n&emsp;`$FV_COMMENTS` ("Comments");  \n&emsp;`$FV_COMPANYNAME` ("CompanyName");  \n&emsp;`$FV_FILEDESCRIPTION` ("FileDescription");  \n&emsp;`$FV_FILEVERSION` ("FileVersion");  \n&emsp;`$FV_INTERNALNAME` ("InternalName");  \n&emsp;`$FV_LEGALCOPYRIGHT` ("LegalCopyright");  \n&emsp;`$FV_LEGALTRADEMARKS` ("LegalTrademarks");  \n&emsp;`$FV_ORIGINALFILENAME` ("OriginalFilename");  \n&emsp;`$FV_PRODUCTNAME` ("ProductName");  \n&emsp;`$FV_PRODUCTVERSION` ("ProductVersion");  \n&emsp;`$FV_PRIVATEBUILD` ("PrivateBuild");  \n&emsp;`$FV_SPECIALBUILD` ("SpecialBuild")  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileInstall: {
    documentation: 'Include and install a file with the compiled script.',
    label: 'FileInstall ( "source", "dest" [, flag = 0] )',
    params: [
      {
        label: 'source',
        documentation:
          'The source path of the file to compile. **This must be a literal string; it cannot be a variable or the result of a function call.** It can be a relative path (using .\\ or ..\\ in the path) to the source file (.au3).',
      },
      {
        label: 'dest',
        documentation:
          'The destination path of the file with trailing backslash if only the directory is used. This can be a variable.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** this flag determines whether to overwrite files if they already exist:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing files  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing files  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileMove: {
    documentation: 'Moves one or more files.',
    label: 'FileMove ( "source", "dest" [, flag = 0] )',
    params: [
      {
        label: 'source',
        documentation: 'The source path and filename of the file to move. (* wildcards accepted)',
      },
      {
        label: 'dest',
        documentation:
          'The destination path and filename of the moved file. (* wildcards accepted)',
      },
      {
        label: 'flag',
        documentation:
          "**[optional]** this flag determines whether to overwrite files if they already exist:  \nCan be a combination of the following:  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) do not overwrite existing files.  \n&emsp;`$FC_OVERWRITE` (`1`) = overwrite existing files.  \n&emsp;`$FC_CREATEPATH` (`8`) = Create destination directory structure if it doesn't exist (See Remarks).  \n\nConstants are defined in FileConstants.au3.",
      },
    ],
  },
  FileOpen: {
    documentation: 'Opens a file for reading or writing.',
    label: 'FileOpen ( "filename" [, mode = 0] )',
    params: [
      {
        label: 'filename',
        documentation: 'Filename of the file to open.',
      },
      {
        label: 'mode',
        documentation:
          "**[optional]** Mode to open the file in.  \nCan be a combination of the following:  \n&emsp;`$FO_READ` (`0`) = Read mode (default)  \n&emsp;`$FO_APPEND` (`1`) = Write mode (append to end of file)  \n&emsp;`$FO_OVERWRITE` (`2`) = Write mode (erase previous contents)  \n&emsp;`$FO_CREATEPATH` (`8`) = Create directory structure if it doesn't exist (See Remarks).  \n&emsp;`$FO_BINARY` (`16`) = Force binary mode (See Remarks).  \n&emsp;`$FO_UNICODE` or `$FO_UTF16_LE` (`32`) = Use Unicode UTF16 Little Endian reading and writing mode.  \n&emsp;`$FO_UTF16_BE` (`64`) = Use Unicode UTF16 Big Endian reading and writing mode.  \n&emsp;`$FO_UTF8` (`128`) = Use Unicode UTF8 (with BOM) reading and writing mode.  \n&emsp;`$FO_UTF8_NOBOM` (`256`) = Use Unicode UTF8 (without BOM) reading and writing mode.  \n&emsp;`$FO_ANSI` (`512`) = Use ANSI reading and writing mode.  \n&emsp;`$FO_UTF16_LE_NOBOM` (`1024`) = Use Unicode UTF16 Little Endian (without BOM) reading and writing mode.  \n&emsp;`$FO_UTF16_BE_NOBOM` (`2048`) = Use Unicode UTF16 Big Endian (without BOM) reading and writing mode.  \n&emsp;`$FO_FULLFILE_DETECT` (`16384`) = When opening for reading and no BOM is present, use the entire file to determine if it is UTF8 or UTF16. If this is not used then only the initial part of the file (up to 64KB) is checked for performance reasons.  \nThe folder path must already exist (except using `$FO_CREATEPATH` mode - See Remarks).  \n\nConstants are defined in FileConstants.au3.",
      },
    ],
  },
  FileOpenDialog: {
    documentation: 'Initiates a Open File Dialog.',
    label:
      'FileOpenDialog ( "title", "init dir", "filter" [, options = 0 [, "default name" [, hwnd]]] )',
    params: [
      {
        label: 'title',
        documentation: 'Title text of the Dialog GUI.',
      },
      {
        label: 'init dir',
        documentation: 'Initial directory selected in the GUI file tree.',
      },
      {
        label: 'filter',
        documentation:
          'File type single filter such as "All (&ast;.&ast;)" or "Text files (&ast;.txt)" or multiple filter groups such as "All (&ast;.&ast;)|Text files (&ast;.txt)".',
      },
      {
        label: 'options',
        documentation:
          '**[optional]** Dialog Options: To use more than one option, BitOR the required values together.  \n&emsp;`$FD_FILEMUSTEXIST` (`1`) = File Must Exist (if user types a filename);  \n&emsp;`$FD_PATHMUSTEXIST` (`2`) = Path Must Exist (if user types a path, ending with a backslash)  \n&emsp;`$FD_MULTISELECT` (`4`) = Allow MultiSelect  \n&emsp;`$FD_PROMPTCREATENEW` (`8`) = Prompt to Create New File (if does not exist)  \n\nConstants are defined in FileConstants.au3.',
      },
      {
        label: 'default name',
        documentation:
          '**[optional]** Suggested file name for the user to open. Default is blank ("").',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** The window handle to use as the parent for this dialog.',
      },
    ],
  },
  FileRead: {
    documentation: 'Read in a number of characters from a previously opened file.',
    label: 'FileRead ( "filehandle/filename" [, count] )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively you may use a string filename as the first parameter.',
      },
      {
        label: 'count',
        documentation: '**[optional]** The number of characters to read.',
      },
    ],
  },
  FileReadLine: {
    documentation: 'Read in a line of text from a previously opened text file.',
    label: 'FileReadLine ( "filehandle/filename" [, line = 1] )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively you may use a string filename as the first parameter.',
      },
      {
        label: 'line',
        documentation:
          '**[optional]** The line number to read. The first line of a text file is line 1 (not zero), last line is -1.',
      },
    ],
  },
  FileReadToArray: {
    documentation: 'Reads the specified file into an array.',
    label: 'FileReadToArray ( "filehandle/filename" )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively you may use a string filename as the first parameter.',
      },
    ],
  },
  FileRecycle: {
    documentation: 'Sends a file or directory to the recycle bin.',
    label: 'FileRecycle ( "source" )',
    params: [
      {
        label: 'source',
        documentation:
          'The source path of the file(s) or directory to Recycle. (* and ? wildcards accepted)',
      },
    ],
  },
  FileRecycleEmpty: {
    documentation: 'Empties the recycle bin.',
    label: 'FileRecycleEmpty ( ["source"] )',
    params: [
      {
        label: 'source',
        documentation:
          '**[optional]** The rootpath to empty - if omitted the recycle bin for all drives is emptied.',
      },
    ],
  },
  FileSaveDialog: {
    documentation: 'Initiates a Save File Dialog.',
    label:
      'FileSaveDialog ( "title", "init dir", "filter" [, options = 0 [, "default name" [, hwnd]]] )',
    params: [
      {
        label: 'title',
        documentation: 'Title text of the Dialog GUI.',
      },
      {
        label: 'init dir',
        documentation: 'Initial directory selected in the GUI file tree.',
      },
      {
        label: 'filter',
        documentation:
          'File type single filter such as "All (&ast;.&ast;)" or "Text files (&ast;.txt)" or multiple filter groups such as "All (&ast;.&ast;)|Text files (&ast;.txt)".',
      },
      {
        label: 'options',
        documentation:
          '**[optional]** Dialog Options: To use more than one option, `BitOR` the required values together.  \n&emsp;`$FD_PATHMUSTEXIST` (`2`) = Path Must Exist (if user types a path, ending with a backslash)  \n&emsp;`$FD_PROMPTOVERWRITE` (`16`) = Prompt to OverWrite File.  \n\nConstants are defined in FileConstants.au3.',
      },
      {
        label: 'default name',
        documentation:
          '**[optional]** File name to suggest to the user to save the file with. Default is blank ("").',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** The window handle to use as the parent for this dialog.',
      },
    ],
  },
  FileSelectFolder: {
    documentation: 'Initiates a Browse For Folder dialog.',
    label: 'FileSelectFolder ( "dialog text", "root dir" [, flag = 0 [, "initial dir" [, hwnd]]] )',
    params: [
      {
        label: 'dialog text',
        documentation: 'Text greeting in dialog.',
      },
      {
        label: 'root dir',
        documentation:
          'Root directory of GUI file tree. It limits a choice in the root folder. Use "" for Desktop to be root.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**  \n&emsp;`$FSF_CREATEBUTTON` (`1`) = Show Create Folder Button (XP only)  \n&emsp;`$FSF_NEWDIALOG` (`2`) = Use New Dialog Style (XP only)  \n&emsp;`$FSF_EDITCONTROL` (`4`) = Show Edit Control (XP only)  \n\nConstants are defined in FileConstants.au3.',
      },
      {
        label: 'initial dir',
        documentation:
          '**[optional]** The full path of the folder you selected/highlighted when displaying dialogue (if it exists in the root folder). Default is blank ("").',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** The window handle to use as the parent for this dialog.',
      },
    ],
  },
  FileSetAttrib: {
    documentation: 'Sets the attributes of one or more files/directories.',
    label: 'FileSetAttrib ( "file pattern", "+-RASHNOT" [, recurse = 0] )',
    params: [
      {
        label: 'file pattern',
        documentation:
          'The path of the file(s) to set, e.g. C:&#92;&ast;.au3, C:&#92;Dir. (&ast; and ? wildcards accepted)',
      },
      {
        label: '+-RASHNOT',
        documentation: 'Attribute(s) to set/clear. e.g. "+A", "+RA-SH"',
      },
      {
        label: 'recurse',
        documentation:
          '**[optional]**  \n&emsp;`$FT_NONRECURSIVE` (`0`) - no recursion (Default)  \n&emsp;`$FT_RECURSIVE` (`1`) - directories are recursed into.  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileSetEnd: {
    documentation: 'Sets the end of the file at the current file position.',
    label: 'FileSetEnd ( "filehandle" )',
    params: [
      {
        label: 'filehandle',
        documentation: 'The handle of a file, as returned by a previous call to `FileOpen()`.',
      },
    ],
  },
  FileSetPos: {
    documentation: 'Sets the current file position.',
    label: 'FileSetPos ( "filehandle", offset, origin )',
    params: [
      {
        label: 'filehandle',
        documentation: 'The handle of a file, as returned by a previous call to `FileOpen()`.',
      },
      {
        label: 'offset',
        documentation:
          'The offset to move from the origin. This value may be positive or negative. Negative values move backwards from the origin.',
      },
      {
        label: 'origin',
        documentation:
          'Must be one of the following:  \n&emsp;`$FILE_BEGIN` (`0`) = Beginning of the file.  \n&emsp;`$FILE_CURRENT` (`1`) = Current position.  \n&emsp;`$FILE_END` (`2`) = End of the file.  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  FileSetTime: {
    documentation: 'Sets the timestamp of one of more files.',
    label: 'FileSetTime ( "file pattern", "time" [, type = 0 [, recurse = 0]] )',
    params: [
      {
        label: 'file pattern',
        documentation:
          'The path of the file(s) to set, e.g. C:&#92;&ast;.au3, C:&#92;Dir. (&ast; and ? wildcards accepted)',
      },
      {
        label: 'time',
        documentation:
          'The new time to set in the format "YYYYMMDDHHMMSS" (Year, month, day, hours (24hr clock), seconds). If the time is blank "" then the current time is used.',
      },
      {
        label: 'type',
        documentation:
          '**[optional]** The timestamp to change:  \n&emsp;`$FT_MODIFIED` (`0`) = Last modified (default)  \n&emsp;`$FT_CREATED` (`1`) = Created  \n&emsp;`$FT_ACCESSED` (`2`) = Last accessed.  \n\nConstants are defined in FileConstants.au3',
      },
      {
        label: 'recurse',
        documentation:
          '**[optional]**  \n&emsp;`$FT_NONRECURSIVE` (`0`) - no recursion (Default).  \n&emsp;`$FT_RECURSIVE` (`1`) - directories are recursed into.  \n\nConstants are defined in FileConstants.au3',
      },
    ],
  },
  FileWrite: {
    documentation: 'Write text/data to the end of a previously opened file.',
    label: 'FileWrite ( "filehandle/filename", "text/data" )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively, you may use a string filename as the first parameter.',
      },
      {
        label: 'text/data',
        documentation:
          'The text/data to write to the file. The text is written as is - no `@CR` or `@LF` characters are added.',
      },
    ],
  },
  FileWriteLine: {
    documentation: 'Append a line of text to the end of a previously opened text file.',
    label: 'FileWriteLine ( "filehandle/filename", "line" )',
    params: [
      {
        label: 'filehandle/filename',
        documentation:
          'The handle of a file, as returned by a previous call to `FileOpen()`. Alternatively, you may use a string filename as the first parameter.',
      },
      {
        label: 'line',
        documentation:
          'The line of text to write to the text file. If the line does NOT end in `@CR` or `@LF` then a DOS linefeed (`@CRLF`) will be automatically added.',
      },
    ],
  },
  Floor: {
    documentation: 'Returns a number rounded down to the closest integer.',
    label: 'Floor ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression.',
      },
    ],
  },
  FtpSetProxy: {
    documentation: 'Sets the internet proxy to use for ftp access.',
    label: 'FtpSetProxy ( mode = 0 [, "proxy:port" [, "username" [, "password"]]] )',
    params: [
      {
        label: 'mode',
        documentation:
          'The proxy mode to use:  \n&emsp;`$PROXY_IE` (`0`) = (default) Use current Internet Explorer settings for proxy.  \n&emsp;`$PROXY_NONE` (`1`) = Use no proxy (direct access)  \n&emsp;`$PROXY_SPECIFIED` (`2`) = Use the proxy specified  \n\nConstants are deined in "AutoItConstants.au3".',
      },
      {
        label: 'proxy:port',
        documentation: '**[optional]** The address and port of the proxy to use.',
      },
      {
        label: 'username',
        documentation: '**[optional]** If required, the username for the proxy',
      },
      {
        label: 'password',
        documentation: '**[optional]** If required, the password for the proxy',
      },
    ],
  },
  FuncName: {
    documentation: 'Returns the name of a function stored in a variable.',
    label: 'FuncName ( $Functionvariable )',
    params: [
      {
        label: '$Functionvariable',
        documentation: 'A variable containing a Function whose name you want to retrieve.',
      },
    ],
  },
  GUICreate: {
    documentation: 'Create a GUI window.',
    label:
      'GUICreate ( "title" [, width [, height [, left = -1 [, top = -1 [, style = -1 [, exStyle = -1 [, parent = 0]]]]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title of the dialog box.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the window.',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the window.',
      },
      {
        label: 'left',
        documentation:
          '**[optional]** The left side of the dialog box. By default (-1), the window is centered. If defined, top must also be defined.',
      },
      {
        label: 'top',
        documentation: '**[optional]** The top of the dialog box. Default (-1) is centered',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** defines the style of the window. See GUI Control Styles Appendix.  \nUse -1 for the default style which includes a combination of `$WS_MINIMIZEBOX`, `$WS_CAPTION`, `$WS_POPUP`, `$WS_SYSMENU` styles.  \nSome styles are always included: `$WS_CLIPSIBLINGS`, and `$WS_SYSMENU` if `$WS_MAXIMIZEBOX` or `$WS_SIZEBOX` is specified.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** defines the extended style of the window. See the Extended Style Table.  \nUse -1 for the default, which is no extended styles.  \nForced styles: `$WS_EX_WINDOWEDGE`',
      },
      {
        label: 'parent',
        documentation:
          '**[optional]** The handle of another previously created window - this new window then becomes a child of that window.',
      },
    ],
  },
  GUICtrlCreateAvi: {
    documentation: 'Creates an AVI video control for the GUI.',
    label:
      'GUICtrlCreateAvi ( filename, subfileid, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the video. Only .avi files are supported.',
      },
      {
        label: 'subfileid',
        documentation:
          'id of the subfile to be used. If the file only contains one video then use 0.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default (-1) : `$ACS_TRANSPARENT`  \n&emsp;`$ACS_TRANSPARENT` is always used unless `$ACS_NONTRANSPARENT` is specified.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateButton: {
    documentation: 'Creates a Button control for the GUI.',
    label:
      'GUICtrlCreateButton ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the button control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control (default text autofit in width).',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control (default text autofit in height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : none.  \n&emsp;forced styles : `$WS_TABSTOP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.  \n&emsp;default ( -1) : `WS_EX_WINDOWEDGE`',
      },
    ],
  },
  GUICtrlCreateCheckbox: {
    documentation: 'Creates a Checkbox control for the GUI.',
    label:
      'GUICtrlCreateCheckbox ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control checkbox.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control (default text autofit in width).',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control (default text autofit in height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : `$BS_AUTOCHECKBOX`.  \n&emsp;forced styles : `$WS_TABSTOP`, and `$BS_AUTOCHECKBOX` if no checkbox style defined.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateCombo: {
    documentation: 'Creates a ComboBox control for the GUI.',
    label:
      'GUICtrlCreateCombo ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text which will appear in the combo control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default (-1) : `$CBS_DROPDOWN`, `$CBS_AUTOHSCROLL`, `$WS_VSCROLL`  \n&emsp;forced style : `$WS_TABSTOP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.  \n&emsp;default ( -1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateContextMenu: {
    documentation: 'Creates a context menu for a control or entire GUI window.',
    label: 'GUICtrlCreateContextMenu ( [controlID] )',
    params: [
      {
        label: 'controlID',
        documentation:
          '**[optional]** Control identifier as returned by a GUICtrlCreate...() function.',
      },
    ],
  },
  GUICtrlCreateDate: {
    documentation: 'Creates a date control for the GUI.',
    label:
      'GUICtrlCreateDate ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The preselected date (always as "yyyy/mm/dd").',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to GUICoordMode.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to GUICoordMode.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default (-1) : `$DTS_LONGDATEFORMAT`  \n&emsp;forced style : `$WS_TABSTOP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.  \n&emsp;default (-1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateDummy: {
    documentation: 'Creates a Dummy control for the GUI.',
    label: 'GUICtrlCreateDummy ( )',
    params: [],
  },
  GUICtrlCreateEdit: {
    documentation: 'Creates an Edit control for the GUI.',
    label:
      'GUICtrlCreateEdit ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to GUICoordMode.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to GUICoordMode.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : `$ES_WANTRETURN`, `$WS_VSCROLL`, `$WS_HSCROLL`, `$ES_AUTOVSCROLL`, `$ES_AUTOHSCROLL`  \n&emsp;forced styles : `$ES_MULTILINE`, `$WS_TABSTOP` only if not `$ES_READONLY`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.  \n&emsp;default ( -1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateGraphic: {
    documentation: 'Creates a Graphic control for the GUI.',
    label: 'GUICtrlCreateGraphic ( left, top [, width [, height [, style]]] )',
    params: [
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to GUICoordMode.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to GUICoordMode.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : `$SS_NOTIFY`.',
      },
    ],
  },
  GUICtrlCreateGroup: {
    documentation: 'Creates a Group control for the GUI.',
    label:
      'GUICtrlCreateGroup ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : none.  \n&emsp;forced styles : `$WS_GROUP`, `$BS_GROUPBOX`.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateIcon: {
    documentation: 'Creates an Icon control for the GUI.',
    label:
      'GUICtrlCreateIcon ( filename, iconName, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'filename',
        documentation: 'filename of the icon to be loaded.',
      },
      {
        label: 'iconName',
        documentation:
          'Icon name if the file contains multiple icons. Can be an ordinal name if negative number. Otherwise -1.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control (default is 32).',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control (default is 32).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : `$SS_NOTIFY`  \n&emsp;forced styles : `$WS_TABSTOP`, `$SS_ICON`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateInput: {
    documentation: 'Creates an Input control for the GUI.',
    label:
      'GUICtrlCreateInput ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : `$ES_LEFT`, `$ES_AUTOHSCROLL`  \n&emsp;forced styles : `$WS_TABSTOP` only if no `$ES_READONLY`. `$ES_MULTILINE` is always reset.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.  \n&emsp;default ( -1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateLabel: {
    documentation: 'Creates a static Label control for the GUI.',
    label:
      'GUICtrlCreateLabel ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control (default text autofit in width).',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control (default text autofit in height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.  \n&emsp;default ( -1) : none.  \n&emsp;forced styles : `$SS_NOTIFY`, `$SS_LEFT`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateList: {
    documentation: 'Creates a List control for the GUI.',
    label:
      'GUICtrlCreateList ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default ( -1) : `$LBS_SORT`, `$WS_BORDER`, `$WS_VSCROLL`    \n&emsp;forced styles : `$WS_TABSTOP`, `$LBS_NOTIFY`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.    \n&emsp;default ( -1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateListView: {
    documentation: 'Creates a ListView control for the GUI.',
    label:
      'GUICtrlCreateListView ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation:
          'definition of columns heading. Each of them are separated with `Opt("GUIDataSeparatorChar")`.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : `$LVS_SHOWSELALWAYS`, `$LVS_SINGLESEL`    \n&emsp;forced style : `$LVS_REPORT`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table or ListView Extended Style Table.    \n&emsp;default (-1) : `$LVS_EX_FULLROWSELECT`, `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateListViewItem: {
    documentation: 'Creates a ListView item.',
    label: 'GUICtrlCreateListViewItem ( "text", listviewID )',
    params: [
      {
        label: 'text',
        documentation: 'subitemtext separated with `Opt("GUIDataSeparatorChar")`.',
      },
      {
        label: 'listviewID',
        documentation: 'controlID of the ListView control holding the item.',
      },
    ],
  },
  GUICtrlCreateMenu: {
    documentation: 'Creates a Menu control for the GUI.',
    label: 'GUICtrlCreateMenu ( "submenutext" [, menuID = -1 [, menuentry = -1]] )',
    params: [
      {
        label: 'submenutext',
        documentation: 'The submenu text.',
      },
      {
        label: 'menuID',
        documentation:
          '**[optional]** If defined, allows you to create a submenu in the referenced menu. If equal -1 it refers to first level menu.',
      },
      {
        label: 'menuentry',
        documentation:
          '**[optional]** Allows you to define the entry number to be created. The entries are numbered starting at 0.',
      },
    ],
  },
  GUICtrlCreateMenuItem: {
    documentation: 'Creates a MenuItem control for the GUI.',
    label: 'GUICtrlCreateMenuItem ( "text", menuID [, menuentry = -1 [, menuradioitem = 0]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'menuID',
        documentation:
          'Allows you to create a submenu in the referenced menu. If equal -1 it refers to the first level menu.',
      },
      {
        label: 'menuentry',
        documentation:
          '**[optional]** Allows you to define the entry number to be created. The entries are numbered starting at 0.',
      },
      {
        label: 'menuradioitem',
        documentation:
          '**[optional]** 0 (default) = create a normal menuitem, 1 = create a menuradioitem',
      },
    ],
  },
  GUICtrlCreateMonthCal: {
    documentation: 'Creates a month calendar control for the GUI.',
    label:
      'GUICtrlCreateMonthCal ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The preselected date (always as "yyyy/mm/dd").',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : none.    \n&emsp;forced style : `$WS_TABSTOP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.    \n&emsp;default (-1) : `$WS_EX_CLIENTEDGE`',
      },
    ],
  },
  GUICtrlCreateObj: {
    documentation: 'Creates an ActiveX control in the GUI.',
    label: 'GUICtrlCreateObj ( ObjectVar, left, top [, width [, height]] )',
    params: [
      {
        label: 'ObjectVar',
        documentation: 'A variable pointing to a previously opened object',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
    ],
  },
  GUICtrlCreatePic: {
    documentation: 'Creates a Picture control for the GUI.',
    label:
      'GUICtrlCreatePic ( filename, left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'filename',
        documentation:
          'filename of the picture to be loaded : supported types BMP, JPG, GIF(but not animated).',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : `$SS_NOTIFY`    \n&emsp;forced style : `$SS_BITMAP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateProgress: {
    documentation: 'Creates a Progress control for the GUI.',
    label:
      'GUICtrlCreateProgress ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateRadio: {
    documentation: 'Creates a Radio button control for the GUI.',
    label:
      'GUICtrlCreateRadio ( "text", left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control (default text autofit in width).',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control (default text autofit in height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default ( -1) : none.    \n&emsp;forced styles : `$BS_AUTORADIOBUTTON` and `$WS_TABSTOP` if first radio in the group.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateSlider: {
    documentation: 'Creates a Slider control for the GUI.',
    label: 'GUICtrlCreateSlider ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to GUICoordMode.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to GUICoordMode.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : `$TBS_AUTOTICKS`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateTab: {
    documentation: 'Creates a Tab control for the GUI.',
    label: 'GUICtrlCreateTab ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to GUICoordMode.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to GUICoordMode.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default ( -1) : none.    \n&emsp;forced styles : `$TCS_TOOLTIPS`, `$WS_TABSTOP`, `$WS_CLIPSIBLINGS`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateTabItem: {
    documentation: 'Creates a TabItem control within an existing tab control in the GUI.',
    label: 'GUICtrlCreateTabItem ( "text" )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
    ],
  },
  GUICtrlCreateTreeView: {
    documentation: 'Creates a TreeView control for the GUI.',
    label:
      'GUICtrlCreateTreeView ( left, top [, width [, height [, style = -1 [, exStyle = -1]]]] )',
    params: [
      {
        label: 'left',
        documentation:
          'The left side of the control. If -1 is used then left will be computed according to `GUICoordMode`.',
      },
      {
        label: 'top',
        documentation:
          'The top of the control. If -1 is used then top will be computed according to `GUICoordMode`.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : `$TVS_HASBUTTONS`, `$TVS_HASLINES`, `$TVS_LINESATROOT`, `$TVS_DISABLEDRAGDROP`, `$TVS_SHOWSELALWAYS`    \n&emsp;forced style : `$WS_TABSTOP`',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlCreateTreeViewItem: {
    documentation: 'Creates a TreeViewItem control for the GUI.',
    label: 'GUICtrlCreateTreeViewItem ( "text", treeviewID )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'treeviewID',
        documentation:
          'treeview identifier as return by treeview or treeviewitem creation if subtree is created.',
      },
    ],
  },
  GUICtrlCreateUpdown: {
    documentation: 'Creates an UpDown control for the GUI.',
    label: 'GUICtrlCreateUpdown ( inputcontrolID [, style = -1] )',
    params: [
      {
        label: 'inputcontrolID',
        documentation:
          'The controlID of the input control in which the updown control will be created, or -1 for the last created control.',
      },
      {
        label: 'style',
        documentation:
          '**[optional]** Defines the style of the control. See GUI Control Styles Appendix.    \n&emsp;default (-1) : `$UDS_ALIGNRIGHT`.    \n&emsp;forced style : `$UDS_SETBUDDYINT` and `$UDS_ALIGNRIGHT` if no align defined.',
      },
    ],
  },
  GUICtrlDelete: {
    documentation: 'Deletes a control.',
    label: 'GUICtrlDelete ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
    ],
  },
  GUICtrlGetHandle: {
    documentation:
      'Returns the handle for a control and some special (item) handles (Menu, ContextMenu, TreeViewItem).',
    label: 'GUICtrlGetHandle ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation: 'Control identifier as returned by a `GUICtrlCreate...()` function.',
      },
    ],
  },
  GUICtrlGetState: {
    documentation: 'Gets the current state of a control.',
    label: 'GUICtrlGetState ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
    ],
  },
  GUICtrlRead: {
    documentation: 'Read state or data of a control.',
    label: 'GUICtrlRead ( controlID [, advanced = 0] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'advanced',
        documentation:
          '**[optional]** returns extended information of a control.    \n&emsp;`$GUI_READ_DEFAULT` (`0`) = (Default) Returns a value with state or data of a control.    \n&emsp;`$GUI_READ_EXTENDED` (`1`) = Returns extended information of a control.  \n\nConstants are defined in GUIConstantsEx.au3.',
      },
    ],
  },
  GUICtrlRecvMsg: {
    documentation: 'Send a message to a control and retrieve information in lParam.',
    label: 'GUICtrlRecvMsg ( controlID , msg [, wParam [, lParamType]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'msg',
        documentation:
          'type of message to be send to the control as defined in the Windows controls documentation.',
      },
      {
        label: 'wParam',
        documentation: '**[optional]** An integer first param to be send to the control.',
      },
      {
        label: 'lParamType',
        documentation:
          '**[optional]** Define the type of lParam that will be returned: 0 (default) for wParam and lParam, 1 for lParam String, 2 for lParam RECT struct.',
      },
    ],
  },
  GUICtrlRegisterListViewSort: {
    documentation:
      'Register a user defined function for an internal listview sorting callback function.',
    label: 'GUICtrlRegisterListViewSort ( controlID, "function" )',
    params: [
      {
        label: 'controlID',
        documentation: 'The listview controlID for which the user function should proceed.',
      },
      {
        label: 'function',
        documentation: 'The name of the user function to call when the sorting callback runs.',
      },
    ],
  },
  GUICtrlSendMsg: {
    documentation: 'Send a message to a control.',
    label: 'GUICtrlSendMsg ( controlID, msg , wParam, lParam )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'msg',
        documentation:
          'type of message to be send to the control as defined in the Windows control documentation.',
      },
      {
        label: 'wParam',
        documentation: 'The first param to send to the control.',
      },
      {
        label: 'lParam',
        documentation: 'The second param to send to the control.',
      },
    ],
  },
  GUICtrlSendToDummy: {
    documentation: 'Sends a message to a Dummy control.',
    label: 'GUICtrlSendToDummy ( controlID [, state] )',
    params: [
      {
        label: 'controlID',
        documentation: 'The control identifier (controlID) as returned by `GUICtrlCreateDummy()`',
      },
      {
        label: 'state',
        documentation: '**[optional]** value that can be retrieved later on by `GUICtrlRead()`',
      },
    ],
  },
  GUICtrlSetBkColor: {
    documentation: 'Sets the background color of a control.',
    label: 'GUICtrlSetBkColor ( controlID, backgroundcolor )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'backgroundcolor',
        documentation: 'The RGB color to use.',
      },
    ],
  },
  GUICtrlSetColor: {
    documentation: 'Sets the text color of a control.',
    label: 'GUICtrlSetColor ( controlID, textcolor )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'textcolor',
        documentation: 'The RGB color to use.',
      },
    ],
  },
  GUICtrlSetCursor: {
    documentation: 'Sets the mouse cursor icon for a particular control.',
    label: 'GUICtrlSetCursor ( controlID, cursorID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'cursorID',
        documentation:
          'cursor ID as used by Windows SetCursor API (use -1 for the default mouse cursor for the control)',
      },
    ],
  },
  GUICtrlSetData: {
    documentation: 'Modifies the data for a control.',
    label: 'GUICtrlSetData ( controlID, data [, default] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'data',
        documentation:
          'Combo, List, ListView, ListViewItem: An `Opt("GUIDataSeparatorChar",...)` separated list of items.  \nProgress: The percentage.  \nSlider: The value.  \nButton, Checkbox, Combo, Edit, Group, Input, Label, List, Menu, MenuItem, Radio, TabItem, TreeViewItem: Replaces the text.  \nDate : The date or time depending the style of the control and the regional settings.  \nDummy: The value.',
      },
      {
        label: 'default',
        documentation:
          '**[optional]**  \nCombo, List: The default value.  \nEdit, Input: If non-empty (""), the string is inserted at the current insertion point (caret).',
      },
    ],
  },
  GUICtrlSetDefBkColor: {
    documentation: 'Sets the default background color of all the controls of the GUI window.',
    label: 'GUICtrlSetDefBkColor ( defbkcolor [, winhandle] )',
    params: [
      {
        label: 'defbkcolor',
        documentation: 'Default background color for all controls.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUICtrlSetDefColor: {
    documentation: 'Sets the default text color of all the controls of the GUI window.',
    label: 'GUICtrlSetDefColor ( deftextcolor [, winhandle] )',
    params: [
      {
        label: 'deftextcolor',
        documentation: 'Default text color for all controls.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUICtrlSetFont: {
    documentation: 'Sets the font for a control.',
    label: 'GUICtrlSetFont ( controlID, size [, weight [, attribute [, fontname [, quality]]]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'size',
        documentation: 'Fontsize (default is 8.5).',
      },
      {
        label: 'weight',
        documentation:
          '**[optional]** The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.  \nThe following values are defined for convenience.  \n&emsp;`$FW_DONTCARE` = `0` (Use the default font weight)    \n&emsp;`$FW_THIN` = `100`    \n&emsp;`$FW_EXTRALIGHT` = `200`    \n&emsp;`$FW_LIGHT` = `300`    \n&emsp;`$FW_NORMAL` = `400`    \n&emsp;`$FW_MEDIUM` = `500`    \n&emsp;`$FW_SEMIBOLD` = `600`    \n&emsp;`$FW_BOLD` = `700`    \n&emsp;`$FW_EXTRABOLD` = `800`    \n&emsp;`$FW_HEAVY` = `900`  \n\nConstants are defined in FontConstants.au3.',
      },
      {
        label: 'attribute',
        documentation:
          '**[optional]** Font attributes, which can be a combination of the following added together:    \n&emsp;`$GUI_FONTITALIC` (`2`) = Italic    \n&emsp;`$GUI_FONTUNDER` (`4`) = Underlined    \n&emsp;`$GUI_FONTSTRIKE` (`8`) = Strike  \n\nConstants are defined in GUIConstantsEx.au3.',
      },
      {
        label: 'fontname',
        documentation:
          '**[optional]** Name of the font to use. (OS default GUI font is used if the font is "" or is not found).',
      },
      {
        label: 'quality',
        documentation:
          '**[optional]** Font quality to select. The following qualities are accepted:    \n&emsp;`$DEFAULT_QUALITY` (`0`) = Appearance of the font does not matter.    \n&emsp;`$DRAFT_QUALITY` (`1`) = Appearance of the font is less important than when `$PROOF_QUALITY` is used. For GDI raster fonts, scaling is enabled, which means that more font sizes are available, but the quality may be lower. Bold, italic, underline, and strikeout fonts are synthesized if necessary.    \n&emsp;`$PROOF_QUALITY` (`2`) = (default) Character quality of the font is more important than exact matching of the logical-font attributes. For GDI raster fonts, scaling is disabled and the font closest in size is chosen. Although the chosen font size may not be mapped exactly when `$PROOF_QUALITY` is used, the quality of the font is high and there is no distortion of appearance. Bold, italic, underline, and strikeout fonts are synthesized if necessary.    \n&emsp;`$NONANTIALIASED_QUALITY` (`3`) = Font is never antialiased.    \n&emsp;`$ANTIALIASED_QUALITY` (`4`) = Font is always antialiased if the font supports it and the size of the font is not too small or too large.    \n&emsp;`$CLEARTYPE_QUALITY` (`5`) = If set, text is rendered (when possible) using ClearType antialiasing method. See the remarks on the msdn page for LOGFONT for details about when cleartype is not available.  \nIf neither `$ANTIALIASED_QUALITY` nor `$NONANTIALIASED_QUALITY` is selected, the font is antialiased only if the user chooses smooth screen fonts in Control Panel.  \nConstants are defined in FontConstants.au3',
      },
    ],
  },
  GUICtrlSetGraphic: {
    documentation: 'Modifies the data for a control.',
    label: 'GUICtrlSetGraphic ( controlID, type [, par1 [, ... par6]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreateGraphic()` function.',
      },
      {
        label: 'type',
        documentation: 'type of drawing : dot, line, bezier, rect, ellipse, pie.',
      },
      {
        label: 'par1...par6',
        documentation: 'See the Graphic Type table below.',
      },
    ],
  },
  GUICtrlSetImage: {
    documentation: 'Sets the bitmap or icon image to use for a control.',
    label: 'GUICtrlSetImage ( controlID, filename [, iconname [, icontype]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'filename',
        documentation: 'The filename containing the picture to be display on the control.',
      },
      {
        label: 'iconname',
        documentation:
          '**[optional]** Icon name if the file contains multiple icons. Can be an ordinal name if negative number. Otherwise -1.',
      },
      {
        label: 'icontype',
        documentation:
          '**[optional]** To select a specific icon size : 0 = small, 1 = normal (default).For a TreeViewItem the icon size : 2 = selected, 4 for non-selected item.',
      },
    ],
  },
  GUICtrlSetLimit: {
    documentation: 'Limits the number of characters/pixels for a control.',
    label: 'GUICtrlSetLimit ( controlID, max [, min = 0] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'max',
        documentation:
          'For List controls it is the extent you can scroll horizontally in pixels.For Input/Edit controls it is the max number of characters that can be entered.',
      },
      {
        label: 'min',
        documentation:
          '**[optional]** For Slider and UpDown controls you can specify a min value. Default = 0',
      },
    ],
  },
  GUICtrlSetOnEvent: {
    documentation: 'Defines a user-defined function to be called when a control is clicked.',
    label: 'GUICtrlSetOnEvent ( controlID, "function" )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'function',
        documentation: 'The name of the user function to call.',
      },
    ],
  },
  GUICtrlSetPos: {
    documentation: 'Changes the position of a control within the GUI window.',
    label: 'GUICtrlSetPos ( controlID, left [, top [, width [, height]]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'left',
        documentation: 'The left side of the control.',
      },
      {
        label: 'top',
        documentation: '**[optional]** The top of the control.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the control.',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the control .',
      },
    ],
  },
  GUICtrlSetResizing: {
    documentation: 'Defines the resizing method used by a control.',
    label: 'GUICtrlSetResizing ( controlID, resizing )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'resizing',
        documentation:
          'See the Docking Values table for values that can be used (add together multiple values if required).',
      },
    ],
  },
  GUICtrlSetState: {
    documentation: 'Changes the state of a control.',
    label: 'GUICtrlSetState ( controlID, state )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a GUICtrlCreate...() function, or -1 for the last created control.',
      },
      {
        label: 'state',
        documentation: 'See the State table.',
      },
    ],
  },
  GUICtrlSetStyle: {
    documentation: 'Changes the style of a control.',
    label: 'GUICtrlSetStyle ( controlID, style [, exStyle] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'style',
        documentation: 'Defines the style of the control. See GUI Control Styles Appendix.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** Defines the extended Style of the control. See Extended Style Table.',
      },
    ],
  },
  GUICtrlSetTip: {
    documentation: 'Sets the tip text associated with a control.',
    label: 'GUICtrlSetTip ( controlID, tiptext [, "title" [, icon [, options]]] )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `GUICtrlCreate...()` function, or -1 for the last created control.',
      },
      {
        label: 'tiptext',
        documentation:
          'Tip text that will be displayed when the mouse is hovered over the control.',
      },
      {
        label: 'title',
        documentation: '**[optional]** The title for the tooltip.',
      },
      {
        label: 'icon',
        documentation:
          '**[optional]** Pre-defined icon to show next to the title: requires a title.    \n&emsp;`$TIP_NOICON` (`0`) = No icon    \n&emsp;`$TIP_INFOICON` (`1`) = Info icon    \n&emsp;`$TIP_WARNINGICON` (`2`) = Warning icon    \n&emsp;`$TIP_ERRORICON` (`3`) = Error Icon.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'options',
        documentation:
          '**[optional]** Sets different options for how the tooltip will be displayed (Can be added together):    \n&emsp;`$TIP_BALLOON` (`1`) = Display as Balloon Tip.    \n&emsp;`$TIP_CENTER` (`2`) = Center the tip horizontally along the control.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  GUIDelete: {
    documentation: 'Deletes a GUI window and all controls that it contains.',
    label: 'GUIDelete ( [winhandle] )',
    params: [
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUIGetCursorInfo: {
    documentation: 'Gets the mouse cursor position relative to GUI window.',
    label: 'GUIGetCursorInfo ( [winhandle] )',
    params: [
      {
        label: 'winhandle',
        documentation:
          '**[optional]** The handle of the window to use. If omitted the "current" window will be used.',
      },
    ],
  },
  GUIGetMsg: {
    documentation: 'Polls the GUI to see if any events have occurred.',
    label: 'GUIGetMsg ( [advanced = 0] )',
    params: [
      {
        label: 'advanced',
        documentation:
          '**[optional]** return extended information in an array.    \n&emsp;`$GUI_EVENT_SINGLE` (`0`) = (default) Returns a single event.    \n&emsp;`$GUI_EVENT_ARRAY` (`1`) = returns an array containing the event and extended information.  \n\nConstants are defined in GUIConstantsEx.au3.',
      },
    ],
  },
  GUIGetStyle: {
    documentation: 'Retrieves the styles of a GUI window.',
    label: 'GUIGetStyle ( [winhandle] )',
    params: [
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUIRegisterMsg: {
    documentation: 'Register a user defined function for a known Windows Message ID (WM_MSG).',
    label: 'GUIRegisterMsg ( msgID, "function" )',
    params: [
      {
        label: 'msgID',
        documentation: 'A Windows Message ID (see Appendix: Windows Message Codes).',
      },
      {
        label: 'function',
        documentation:
          'The name of the user function to call when the message appears or an empty string "" to unregister a message.',
      },
    ],
  },
  GUISetAccelerators: {
    documentation: 'Sets the accelerator table to be used in a GUI window.',
    label: 'GUISetAccelerators ( accelerators [, winhandle] )',
    params: [
      {
        label: 'accelerators',
        documentation: 'A 2 dimensional array holding the accelerator table.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetBkColor: {
    documentation: 'Sets the background color of the GUI window.',
    label: 'GUISetBkColor ( background [, winhandle] )',
    params: [
      {
        label: 'background',
        documentation: 'Background color of the dialog box.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetCoord: {
    documentation: 'Sets absolute coordinates for the next control.',
    label: 'GUISetCoord ( left, top [, width [, height [, winhandle]]] )',
    params: [
      {
        label: 'left',
        documentation: 'The left side of the control.',
      },
      {
        label: 'top',
        documentation: 'The top of the control.',
      },
      {
        label: 'width',
        documentation:
          '**[optional]** The width of the control (default is the previously used width).',
      },
      {
        label: 'height',
        documentation:
          '**[optional]** The height of the control (default is the previously used height).',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetCursor: {
    documentation: 'Sets the mouse cursor icon for a GUI window.',
    label: 'GUISetCursor ( [cursorID [, override = 0 [, winhandle]]] )',
    params: [
      {
        label: 'cursorID',
        documentation: '**[optional]** Cursor Id.',
      },
      {
        label: 'override',
        documentation:
          "**[optional]** Force the requested mouse cursor even when over controls (see below).    \n&emsp;`$GUI_CURSOR_NOOVERRIDE` (`0`) = (default) Don't override a control's default mouse cursor.    \n&emsp;`$GUI_CURSOR_OVERRIDE` (`1`) = override control's default mouse cursor.  \n\nConstants are defined in GUIConstantsEx.au3.",
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetFont: {
    documentation: 'Sets the default font for a GUI window.',
    label: 'GUISetFont ( size [, weight [, attribute [, fontname [, winhandle [, quality]]]]] )',
    params: [
      {
        label: 'size',
        documentation: 'Fontsize (default is 8.5).',
      },
      {
        label: 'weight',
        documentation:
          '**[optional]** The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.  \nThe following values are defined for convenience.  \n&emsp;`$FW_DONTCARE` = `0` (Use the default font weight)    \n&emsp;`$FW_THIN` = `100`    \n&emsp;`$FW_EXTRALIGHT` = `200`    \n&emsp;`$FW_LIGHT` = `300`    \n&emsp;`$FW_NORMAL` = `400`    \n&emsp;`$FW_MEDIUM` = `500`    \n&emsp;`$FW_SEMIBOLD` = `600`    \n&emsp;`$FW_BOLD` = `700`    \n&emsp;`$FW_EXTRABOLD` = `800`    \n&emsp;`$FW_HEAVY` = `900`  \n\nConstants are defined in FontConstants.au3.',
      },
      {
        label: 'attribute',
        documentation:
          '**[optional]** Font attributes, which can be a combination of the following added together:    \n&emsp;`$GUI_FONTNORMAL` (`0`) = Normal (Default)  \n&emsp;`$GUI_FONTITALIC` (`2`) = Italic    \n&emsp;`$GUI_FONTUNDER` (`4`) = Underlined    \n&emsp;`$GUI_FONTSTRIKE` (`8`) = Strike  \n\nConstants are defined in GUIConstantsEx.au3.',
      },
      {
        label: 'fontname',
        documentation:
          '**[optional]** Font to use. (OS default GUI font is used if the font is "" or is not found).',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by GUICreate() (default is the previously used window).',
      },
      {
        label: 'quality',
        documentation:
          '**[optional]** Font quality to select. The following qualities are accepted:    \n&emsp;`$DEFAULT_QUALITY` (`0`) = Appearance of the font does not matter.    \n&emsp;`$DRAFT_QUALITY` (`1`) = Appearance of the font is less important than when `$PROOF_QUALITY` is used. For GDI raster fonts, scaling is enabled, which means that more font sizes are available, but the quality may be lower. Bold, italic, underline, and strikeout fonts are synthesized if necessary.    \n&emsp;`$PROOF_QUALITY` (`2`) = (default) Character quality of the font is more important than exact matching of the logical-font attributes. For GDI raster fonts, scaling is disabled and the font closest in size is chosen. Although the chosen font size may not be mapped exactly when `$PROOF_QUALITY` is used, the quality of the font is high and there is no distortion of appearance. Bold, italic, underline, and strikeout fonts are synthesized if necessary.    \n&emsp;`$NONANTIALIASED_QUALITY` (`3`) = Font is never antialiased.    \n&emsp;`$ANTIALIASED_QUALITY` (`4`) = Font is always antialiased if the font supports it and the size of the font is not too small or too large.    \n&emsp;`$CLEARTYPE_QUALITY` (`5`) = If set, text is rendered (when possible) using ClearType antialiasing method. See the remarks on the msdn page for LOGFONT for details about when cleartype is not available.  \nIf neither `$ANTIALIASED_QUALITY` nor `$NONANTIALIASED_QUALITY` is selected, the font is antialiased only if the user chooses smooth screen fonts in Control Panel.  \nConstants are defined in FontConstants.au3',
      },
    ],
  },
  GUISetHelp: {
    documentation: 'Sets an executable file that will be run when F1 is pressed.',
    label: 'GUISetHelp ( helpfile [, winhandle] )',
    params: [
      {
        label: 'helpfile',
        documentation: 'file that will be run if F1 is pressed when the GUI is active.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetIcon: {
    documentation: 'Sets the icon used in a GUI window.',
    label: 'GUISetIcon ( iconfile [, iconID [, winhandle]] )',
    params: [
      {
        label: 'iconfile',
        documentation: 'used to display the icon in the title area.',
      },
      {
        label: 'iconID',
        documentation: '**[optional]** The ID of the icon in the iconfile. (Default is -1).',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetOnEvent: {
    documentation: 'Defines a user function to be called when a system button is clicked.',
    label: 'GUISetOnEvent ( specialID, "function" [, winhandle] )',
    params: [
      {
        label: 'specialID',
        documentation: 'See the Special ID table.',
      },
      {
        label: 'function',
        documentation: 'The name of the user function to call.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetState: {
    documentation: 'Changes the state of a GUI window.',
    label: 'GUISetState ( [flag [, winhandle]] )',
    params: [
      {
        label: 'flag',
        documentation:
          '**[optional]**  \n&emsp;`@SW_SHOW` = Shows a previously hidden window (default)    \n&emsp;`@SW_HIDE` = Hide window    \n&emsp;`@SW_MINIMIZE` = Minimize window    \n&emsp;`@SW_MAXIMIZE` = Maximize window    \n&emsp;`@SW_RESTORE` = Undoes a window minimization    \n&emsp;`@SW_DISABLE` = Disables the window    \n&emsp;`@SW_ENABLE` = Enables the window    \n&emsp;`@SW_LOCK` = Lock the window to avoid repainting.    \n&emsp;`@SW_UNLOCK` = Unlock windows to allow painting.    \n&emsp;`@SW_SHOWDEFAULT` - Sets the show state based on the SW_ flag specified in the STARTUPINFO structure    \n&emsp;`@SW_SHOWMAXIMIZED` - Activates the window and displays it as a maximized window    \n&emsp;`@SW_SHOWMINIMIZED` - Activates the window and displays it as a minimized window    \n&emsp;`@SW_SHOWMINNOACTIVE` - Displays the window as a minimized window    \n&emsp;`@SW_SHOWNA` - Displays the window in its current state    \n&emsp;`@SW_SHOWNOACTIVATE` - Displays a window in its most recent size and position    \n&emsp;`@SW_SHOWNORMAL` - Activates and displays a window',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISetStyle: {
    documentation: 'Changes the styles of a GUI window.',
    label: 'GUISetStyle ( style [, exStyle [, winhandle]] )',
    params: [
      {
        label: 'style',
        documentation:
          'defines the style of the window. See GUI Control Styles Appendix.  \n\nUse -1 to leave it unchanged.',
      },
      {
        label: 'exStyle',
        documentation:
          '**[optional]** defines the extended style of the window. See the Extended Style Table. -1 is the default.  \nUse -1 to leave it unchanged.',
      },
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUIStartGroup: {
    documentation:
      'Defines that any subsequent controls that are created will be "grouped" together.',
    label: 'GUIStartGroup ( [winhandle] )',
    params: [
      {
        label: 'winhandle',
        documentation:
          '**[optional]** Windows handle as returned by `GUICreate()` (default is the previously used window).',
      },
    ],
  },
  GUISwitch: {
    documentation: 'Switches the current window used for GUI functions.',
    label: 'GUISwitch ( winhandle [, tabitemID] )',
    params: [
      {
        label: 'winhandle',
        documentation: 'The handle of the window to switch to.',
      },
      {
        label: 'tabitemID',
        documentation: '**[optional]** controlID of the tabitem control to be selected.',
      },
    ],
  },
  HWnd: {
    documentation: 'Converts an expression into an HWND handle.',
    label: 'HWnd ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into an HWND handle.',
      },
    ],
  },
  Hex: {
    documentation:
      'Returns a string representation of an integer or of a binary type converted to hexadecimal.',
    label: 'Hex ( expression [, length] )',
    params: [
      {
        label: 'expression',
        documentation: 'The expression to convert.',
      },
      {
        label: 'length',
        documentation:
          '**[optional]** Number of characters to be returned for integer.  \nCharacters are truncated from the left-hand side if length is too small.  \nThis parameter is ignored if the data is binary data.',
      },
    ],
  },
  HotKeySet: {
    documentation: 'Sets a hotkey that calls a user function.',
    label: 'HotKeySet ( "key" [, "function"] )',
    params: [
      {
        label: 'key',
        documentation: 'The key combination to use as the hotkey. Same format as `Send()`.',
      },
      {
        label: 'function',
        documentation:
          '**[optional]** The name of the function to call when the key is pressed. Not specifying this parameter will unset a previous hotkey.',
      },
    ],
  },
  HttpSetProxy: {
    documentation: 'Sets the internet proxy to use for http access.',
    label: 'HttpSetProxy ( mode = 0 [, "proxy:port" [, "username" [, "password"]]] )',
    params: [
      {
        label: 'mode',
        documentation:
          'The proxy mode to use:    \n&emsp;`$PROXY_IE` (`0`) = (default) Use current Internet Explorer settings for proxy.    \n&emsp;`$PROXY_NONE` (`1`) = Use no proxy (direct access)    \n&emsp;`$PROXY_SPECIFIED` (`2`) = Use the proxy specified  \n\nConstants are deined in "AutoItConstants.au3".',
      },
      {
        label: 'proxy:port',
        documentation: '**[optional]** The address and port of the proxy to use.',
      },
      {
        label: 'username',
        documentation: '**[optional]** If required, the username for the proxy',
      },
      {
        label: 'password',
        documentation: '**[optional]** If required, the password for the proxy',
      },
    ],
  },
  HttpSetUserAgent: {
    documentation: 'Sets the HTTP user-agent string which is sent with all Inet requests.',
    label: 'HttpSetUserAgent ( "user agent" )',
    params: [
      {
        label: 'user agent',
        documentation:
          'The string to set as the user-agent. The default user-agent is "AutoIt". Passing an empty string will reset the user-agent back to the default.',
      },
    ],
  },
  InetClose: {
    documentation: 'Closes a handle returned from InetGet().',
    label: 'InetClose ( handle )',
    params: [
      {
        label: 'handle',
        documentation: 'A handle return from `InetGet()`.',
      },
    ],
  },
  InetGet: {
    documentation: 'Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.',
    label: 'InetGet ( "URL", "filename" [, options = 0 [, background = 0]] )',
    params: [
      {
        label: 'URL',
        documentation: 'URL of the file to download.',
      },
      {
        label: 'filename',
        documentation: 'Local filename to download to.',
      },
      {
        label: 'options',
        documentation:
          '**[optional]**  \n&emsp;`$INET_LOCALCACHE `(`0`) = Get the file from local cache if available (default).    \n&emsp;`$INET_FORCERELOAD` (`1`) = Forces a reload from the remote site.    \n&emsp;`$INET_IGNORESSL` (`2`) = Ignore all SSL errors (with HTTPS connections).    \n&emsp;`$INET_ASCIITRANSFER` (`4`) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag `$INET_BINARYTRANSFER (8)`).    \n&emsp;`$INET_BINARYTRANSFER` (`8`) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag `$INET_ASCIITRANSFER (4)`). This is the default transfer mode if none are provided.    \n&emsp;`$INET_FORCEBYPASS` (`16`) = By-pass forcing the connection online.  \n\nConstants are defined in InetConstants.au3.',
      },
      {
        label: 'background',
        documentation:
          '**[optional]**    \n&emsp;`$INET_DOWNLOADWAIT` (`0`) = Wait until the download is complete before continuing (default).    \n&emsp;`$INET_DOWNLOADBACKGROUND` (`1`) = return immediately and download in the background.  \n\nConstants are defined in InetConstants.au3',
      },
    ],
  },
  InetGetInfo: {
    documentation: 'Returns detailed data for a handle returned from InetGet().',
    label: 'InetGetInfo ( [handle [, index = -1]] )',
    params: [
      {
        label: 'handle',
        documentation: '**[optional]** A handle return from `InetGet()`.',
      },
      {
        label: 'index',
        documentation:
          '**[optional]** The index for the data to retrieve. If this value is -1 an array containing all of the below data will be returned.    \n&emsp;`$INET_DOWNLOADREAD` (`0`) - Bytes read so far (this is updated while the download progresses).    \n&emsp;`$INET_DOWNLOADSIZE` (`1`) - The size of the download in bytes (this may not always be present).    \n&emsp;`$INET_DOWNLOADCOMPLETE` (`2`) - Set to True if the download is complete, False if the download is still ongoing.    \n&emsp;`$INET_DOWNLOADSUCCESS` (`3`) - True if the download was successful. If this is False then the next data member will be non-zero.    \n&emsp;`$INET_DOWNLOADERROR` (`4`) - The error value for the download. The value itself is arbitrary. Testing that the value is non-zero is sufficient for determining if an error occurred.    \n&emsp;`$INET_DOWNLOADEXTENDED` (`5`) - The extended value for the download. The value is arbitrary and is primarily only useful to the AutoIt developers.  \n\nConstants are defined in InetConstants.au3.',
      },
    ],
  },
  InetGetSize: {
    documentation: 'Returns the size (in bytes) of a file located on the internet.',
    label: 'InetGetSize ( "URL" [, options = 0] )',
    params: [
      {
        label: 'URL',
        documentation: 'URL of the file to download.',
      },
      {
        label: 'options',
        documentation:
          '**[optional]**    \n&emsp;`$INET_LOCALCACHE` (`0`) = Get the file from local cache if available (default).    \n&emsp;`$INET_FORCERELOAD` (`1`) = Forces a reload from the remote site.    \n&emsp;`$INET_IGNORESSL` (`2`) = Ignore all SSL errors (with HTTPS connections).    \n&emsp;`$INET_ASCIITRANSFER` (`4`) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag `$INET_BINARYTRANSFER` (`8`)).    \n&emsp;`$INET_BINARYTRANSFER` (`8`) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag `$INET_ASCIITRANSFER` (`4`)). This is the default transfer mode if none are provided.  \n\nConstants are defined in InetConstants.au3.',
      },
    ],
  },
  InetRead: {
    documentation: 'Downloads a file from the internet using the HTTP, HTTPS or FTP protocol.',
    label: 'InetRead ( "URL" [, options = 0] )',
    params: [
      {
        label: 'URL',
        documentation: 'URL of the file to download.',
      },
      {
        label: 'options',
        documentation:
          '**[optional]**    \n&emsp;`$INET_LOCALCACHE` (`0`) = Get the file from local cache if available (default).    \n&emsp;`$INET_FORCERELOAD` (`1`) = Forces a reload from the remote site.    \n&emsp;`$INET_IGNORESSL` (`2`) = Ignore all SSL errors (with HTTPS connections).    \n&emsp;`$INET_ASCIITRANSFER` (`4`) = Use ASCII when transferring files with the FTP protocol (Can not be combined with flag `$INET_BINARYTRANSFER` (`8`)).    \n&emsp;`$INET_BINARYTRANSFER` (`8`) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag `$INET_ASCIITRANSFER` (`4`)). This is the default transfer mode if none are provided.    \n&emsp;`$INET_FORCEBYPASS` (`16`) = By-pass forcing the connection online.  \n\nConstants are defined in InetConstants.au3.',
      },
    ],
  },
  IniDelete: {
    documentation: 'Deletes a value from a standard format .ini file.',
    label: 'IniDelete ( "filename", "section" [, "key"] )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
      {
        label: 'key',
        documentation:
          '**[optional]** The key name in the .ini file to delete. If the key name is not given the entire section is deleted. The Default keyword may also be used which will cause the section to be deleted.',
      },
    ],
  },
  IniRead: {
    documentation: 'Reads a value from a standard format .ini file.',
    label: 'IniRead ( "filename", "section", "key", "default" )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
      {
        label: 'key',
        documentation: 'The key name in the .ini file.',
      },
      {
        label: 'default',
        documentation: 'The default value to return if the requested key is not found.',
      },
    ],
  },
  IniReadSection: {
    documentation: 'Reads all key/value pairs from a section in a standard format .ini file.',
    label: 'IniReadSection ( "filename", "section" )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
    ],
  },
  IniReadSectionNames: {
    documentation: 'Reads all sections in a standard format .ini file.',
    label: 'IniReadSectionNames ( "filename" )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
    ],
  },
  IniRenameSection: {
    documentation: 'Renames a section in a standard format .ini file.',
    label: 'IniRenameSection ( "filename", "section", "new section" [, flag = 0] )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
      {
        label: 'new section',
        documentation: 'The new section name.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**  \n&emsp;`$FC_NOOVERWRITE` (`0`) = (default) Fail if "new section" already exists.  \n&emsp;`$FC_OVERWRITE` (`1`) = Overwrite "new section". This will erase any existing keys in "new section".  \n\nConstants are defined in FileConstants.au3.',
      },
    ],
  },
  IniWrite: {
    documentation: 'Writes a value to a standard format .ini file.',
    label: 'IniWrite ( "filename", "section", "key", "value" )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
      {
        label: 'key',
        documentation: 'The key name in the .ini file.',
      },
      {
        label: 'value',
        documentation: 'The value to write/change.',
      },
    ],
  },
  IniWriteSection: {
    documentation: 'Writes a section to a standard format .ini file.',
    label: 'IniWriteSection ( "filename", "section", "data" [, index = 1] )',
    params: [
      {
        label: 'filename',
        documentation: 'The filename of the .ini file.',
      },
      {
        label: 'section',
        documentation: 'The section name in the .ini file.',
      },
      {
        label: 'data',
        documentation:
          'The data to write. The data can either be a string or an array. If the data is a string, then each key=value pair must be delimited by `@LF`. If the data is an array, the array must be 2-dimensional and the second dimension must be 2 elements.',
      },
      {
        label: 'index',
        documentation:
          '**[optional]** If an array is passed as data, this specifies the index to start writing from. By default, this is 1 so that the return value of `IniReadSection()` can be used immediately. For manually created arrays, this value may need to be different depending on how the array was created. This parameter is ignored if a string is passed as data.',
      },
    ],
  },
  InputBox: {
    documentation: 'Displays an input box to ask the user to enter a string.',
    label:
      'InputBox ( "title", "prompt" [, "default" [, "password char" [, width = -1 [, height = -1 [, left = Default [, top = Default [, timeout = 0 [, hwnd]]]]]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title of the input box.',
      },
      {
        label: 'prompt',
        documentation: 'A message to the user indicating what kind of input is expected.',
      },
      {
        label: 'default',
        documentation: '**[optional]** The value that the input box starts with.',
      },
      {
        label: 'password char',
        documentation:
          '**[optional]** The character to replace all typed characters with in the display. If you want the actual typed character to appear, define with an empty string ("") (default) or a space for the first character. If you provide a multi-character string, only the first character is used for character masking. There are special meanings for the second and subsequent characters.',
      },
      {
        label: 'width',
        documentation: '**[optional]** The width of the window.',
      },
      {
        label: 'height',
        documentation: '**[optional]** The height of the window.',
      },
      {
        label: 'left',
        documentation:
          '**[optional]** The left side of the input box. By default, the box is centered.',
      },
      {
        label: 'top',
        documentation: '**[optional]** The top of the input box. By default, the box is centered.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** How many seconds to wait before automatically canceling the InputBox().',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** The window handle to use as the parent for this dialog.',
      },
    ],
  },
  Int: {
    documentation: 'Returns the integer (whole number) representation of an expression.',
    label: 'Int ( expression [, flag = 0] )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into an integer.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Defines behavior.  \nCan be one of the following:  \n&emsp;`$NUMBER_AUTO` (`0`) = (default) the result is auto-sized integer.  \n&emsp;`$NUMBER_32BIT` (`1`) = string is interpreted as a 32bit integer  \n&emsp;`$NUMBER_64BIT` (`2`) = string is interpreted as a 64bit integer.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  IsAdmin: {
    documentation: 'Checks if the current user has full administrator privileges.',
    label: 'IsAdmin (  )',
    params: [],
  },
  IsArray: {
    documentation: 'Checks if a variable is an array type.',
    label: 'IsArray ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsBinary: {
    documentation: 'Checks if a variable or expression is a binary type.',
    label: 'IsBinary ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'The variable or expression to check.',
      },
    ],
  },
  IsBool: {
    documentation: "Checks if a variable's base type is boolean.",
    label: 'IsBool ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsDeclared: {
    documentation: 'Check if a variable has been declared.',
    label: 'IsDeclared ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'string representing name of the variable to be checked.',
      },
    ],
  },
  IsDllStruct: {
    documentation: 'Checks if a variable is a DllStruct type.',
    label: 'IsDllStruct ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsFloat: {
    documentation: 'Checks if the value of a variable or expression has a fractional component.',
    label: 'IsFloat ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable or expression to check.',
      },
    ],
  },
  IsFunc: {
    documentation: 'Checks if a variable or expression is a function type.',
    label: 'IsFunc ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'The variable or expression to check.',
      },
    ],
  },
  IsHWnd: {
    documentation: "Checks if a variable's base type is a pointer and window handle.",
    label: 'IsHWnd ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsInt: {
    documentation: 'Checks if the value of a variable or expression has no fractional component.',
    label: 'IsInt ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsKeyword: {
    documentation: 'Checks if a variable is a keyword (for example, Default).',
    label: 'IsKeyword ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable to check.',
      },
    ],
  },
  IsMap: {
    documentation: 'Checks if a variables is a Map type.',
    label: 'IsMap ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsNumber: {
    documentation: "Checks if a variable's base type is numeric.",
    label: 'IsNumber ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsObj: {
    documentation: 'Checks if a variable or expression is an object type.',
    label: 'IsObj ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsPtr: {
    documentation: "Checks if a variable's base type is a pointer.",
    label: 'IsPtr ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  IsString: {
    documentation: 'Checks if a variable is a string type.',
    label: 'IsString ( variable )',
    params: [
      {
        label: 'variable',
        documentation: 'The variable/expression to check.',
      },
    ],
  },
  Log: {
    documentation: 'Calculates the natural logarithm of a number.',
    label: 'Log ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Any positive number.',
      },
    ],
  },
  MapAppend: {
    documentation: 'Add an element to a Map variable.',
    label: 'MapAppend ( map, value )',
    params: [
      {
        label: 'map',
        documentation: 'An existing Map.',
      },
      {
        label: 'value',
        documentation: 'The value to add.',
      },
    ],
  },
  MapExists: {
    documentation: 'Determine whether a key exists within a Map.',
    label: 'MapExists ( map, key )',
    params: [
      {
        label: 'map',
        documentation: 'An existing Map.',
      },
      {
        label: 'key',
        documentation: 'The key to check.',
      },
    ],
  },
  MapKeys: {
    documentation: 'Returns an array holding the keys within a Map.',
    label: 'MapKeys ( map )',
    params: [
      {
        label: 'map',
        documentation: 'An existing Map.',
      },
    ],
  },
  MapRemove: {
    documentation: 'Remove a key and its associated value from a Map.',
    label: 'MapRemove ( map, key )',
    params: [
      {
        label: 'map',
        documentation: 'An existing Map.',
      },
      {
        label: 'key',
        documentation: 'The key to remove.',
      },
    ],
  },
  MemGetStats: {
    documentation: 'Retrieves memory related information.',
    label: 'MemGetStats (  )',
    params: [],
  },
  Mod: {
    documentation: 'Performs the modulus operation.',
    label: 'Mod ( value1, value2 )',
    params: [
      {
        label: 'value1',
        documentation: 'The dividend.',
      },
      {
        label: 'value2',
        documentation: 'The divisor.',
      },
    ],
  },
  MouseClick: {
    documentation: 'Perform a mouse click operation.',
    label: 'MouseClick ( "button" [, x, y [, clicks = 1 [, speed = 10]]] )',
    params: [
      {
        label: 'button',
        documentation:
          'The button to click:    \n&emsp;`$MOUSE_CLICK_RIGHT` ("right")    \n&emsp;`$MOUSE_CLICK_LEFT` ("left")    \n&emsp;`$MOUSE_CLICK_MIDDLE` ("middle")    \n&emsp;`$MOUSE_CLICK_MAIN` ("main")    \n&emsp;`$MOUSE_CLICK_MENU` ("menu")    \n&emsp;`$MOUSE_CLICK_PRIMARY` ("primary")    \n&emsp;`$MOUSE_CLICK_SECONDARY` ("secondary")  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'x, y',
        documentation:
          '**[optional]** The x/y coordinates to move the mouse to. If no x and y coords are given, the current position is used (default).',
      },
      {
        label: 'clicks',
        documentation: '**[optional]** The number of times to click the mouse. Default is 1.',
      },
      {
        label: 'speed',
        documentation:
          '**[optional]** the speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly. Default speed is 10.',
      },
    ],
  },
  MouseClickDrag: {
    documentation: 'Perform a mouse click and drag operation.',
    label: 'MouseClickDrag ( "button", x1, y1, x2, y2 [, speed = 10] )',
    params: [
      {
        label: 'button',
        documentation:
          'The button to click:    \n&emsp;`$MOUSE_CLICK_RIGHT` ("right")    \n&emsp;`$MOUSE_CLICK_LEFT` ("left")    \n&emsp;`$MOUSE_CLICK_MIDDLE` ("middle")    \n&emsp;`$MOUSE_CLICK_MAIN` ("main")    \n&emsp;`$MOUSE_CLICK_MENU` ("menu")    \n&emsp;`$MOUSE_CLICK_PRIMARY` ("primary")    \n&emsp;`$MOUSE_CLICK_SECONDARY` ("secondary")  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'x1, y1',
        documentation: 'The x/y coords to start the drag operation from.',
      },
      {
        label: 'x2, y2',
        documentation: 'The x/y coords to end the drag operation at.',
      },
      {
        label: 'speed',
        documentation:
          '**[optional]** the speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly. Default speed is 10.',
      },
    ],
  },
  MouseDown: {
    documentation: 'Perform a mouse down event at the current mouse position.',
    label: 'MouseDown ( "button" )',
    params: [
      {
        label: 'button',
        documentation:
          'The button to click:    \n&emsp;`$MOUSE_CLICK_RIGHT` ("right")    \n&emsp;`$MOUSE_CLICK_MIDDLE` ("middle")    \n&emsp;`$MOUSE_CLICK_MAIN` ("main")    \n&emsp;`$MOUSE_CLICK_MENU` ("menu")    \n&emsp;`$MOUSE_CLICK_PRIMARY` ("primary")    \n&emsp;`$MOUSE_CLICK_SECONDARY` ("secondary")  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  MouseGetCursor: {
    documentation: 'Returns the cursor ID Number for the current Mouse Cursor.',
    label: 'MouseGetCursor (  )',
    params: [],
  },
  MouseGetPos: {
    documentation: 'Retrieves the current position of the mouse cursor.',
    label: 'MouseGetPos ( [dimension] )',
    params: [
      {
        label: 'dimension',
        documentation: '**[optional]** argument that determines what the return value will be.',
      },
    ],
  },
  MouseMove: {
    documentation: 'Moves the mouse pointer.',
    label: 'MouseMove ( x, y [, speed = 10] )',
    params: [
      {
        label: 'x',
        documentation: 'The screen x coordinate to move the mouse to.',
      },
      {
        label: 'y',
        documentation: 'The screen y coordinate to move the mouse to.',
      },
      {
        label: 'speed',
        documentation:
          '**[optional]** the speed to move the mouse in the range 1 (fastest) to 100 (slowest). A speed of 0 will move the mouse instantly. Default speed is 10.',
      },
    ],
  },
  MouseUp: {
    documentation: 'Perform a mouse up event at the current mouse position.',
    label: 'MouseUp ( "button" )',
    params: [
      {
        label: 'button',
        documentation:
          'The button to click:    \n&emsp;`$MOUSE_CLICK_RIGHT` ("right")    \n&emsp;`$MOUSE_CLICK_MIDDLE` ("middle")    \n&emsp;`$MOUSE_CLICK_MAIN` ("main")    \n&emsp;`$MOUSE_CLICK_MENU` ("menu")    \n&emsp;`$MOUSE_CLICK_PRIMARY` ("primary")    \n&emsp;`$MOUSE_CLICK_SECONDARY` ("secondary")  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  MouseWheel: {
    documentation: 'Moves the mouse wheel up or down.',
    label: 'MouseWheel ( "direction" [, clicks = 1] )',
    params: [
      {
        label: 'direction',
        documentation:
          'The direction to move the wheel:    \n&emsp;`$MOUSE_WHEEL_UP `("up")    \n&emsp;`$MOUSE_WHEEL_DOWN` ("down")  \n\nConstants are defined in "AuoItConstants.au3".',
      },
      {
        label: 'clicks',
        documentation: '**[optional]** The number of times to move the wheel. Default is 1.',
      },
    ],
  },
  MsgBox: {
    documentation: 'Displays a simple message box with optional timeout.',
    label: 'MsgBox ( flag, "title", "text" [, timeout = 0 [, hwnd]] )',
    params: [
      {
        label: 'flag',
        documentation:
          'The flag indicates the type of message box and the possible button combinations.',
      },
      {
        label: 'title',
        documentation: 'The title of the message box.',
      },
      {
        label: 'text',
        documentation: 'The text of the message box.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Timeout in seconds. After the timeout has elapsed the message box will be automatically closed. The default is 0, which is no timeout.',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** The window handle to use as the parent for this dialog.',
      },
    ],
  },
  Number: {
    documentation: 'Returns the numeric representation of an expression.',
    label: 'Number ( expression [, flag = 0] )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into a number.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Defines behavior.  \nCan be one of the following:  \n&emsp;`$NUMBER_AUTO` (`0`) = (default) the result is auto-sized integer.  \n&emsp;`$NUMBER_32BIT` (`1`) = the result is 32bit integer.  \n&emsp;`$NUMBER_64BIT` (`2`) = the result is 64bit integer.  \n&emsp;`$NUMBER_DOUBLE` (`3`) = the result is double.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  ObjCreate: {
    documentation: 'Creates a reference to a COM object from the given classname.',
    label: 'ObjCreate ( "classname" [, "servername" [, "username" [, "password"]]] )',
    params: [
      {
        label: 'classname',
        documentation:
          'The class of the object in the following format: "appname.objectype"It can also be a string representation of the CLSID.',
      },
      {
        label: 'servername',
        documentation:
          '**[optional]** name of a remote computer from which the object must be obtained.',
      },
      {
        label: 'username',
        documentation:
          '**[optional]** name of a usercode on the remote computer.You have to enter this in the format "computer\\usercode" or "domain\\usercode".',
      },
      {
        label: 'password',
        documentation: '**[optional]** password for the usercode on the remote computer.',
      },
    ],
  },
  ObjCreateInterface: {
    documentation:
      'Creates a reference to an object from the given classname/object pointer, interface identifier and description string.',
    label: 'ObjCreateInterface ( "CLSID" , "IID" [, "interface_description",[flag = True]] )',
    params: [
      {
        label: 'CLSID',
        documentation:
          'Class identifier or object pointer. If this is a class identifier it can be in either ProgID or the string representation of the CLSID.',
      },
      {
        label: 'IID',
        documentation: 'String representation of interface identifier.',
      },
      {
        label: 'interface_description',
        documentation:
          '**[optional]** String describing v-table of the object. Use keyword Default to access IDispatch for dual interfaces.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Default value is True meaning the object interface inherits from IUnknown.',
      },
    ],
  },
  ObjEvent: {
    documentation: 'Handles incoming events from the given Object.',
    label: 'ObjEvent ( $ObjectVar, "functionprefix" [, "interface name"] )',
    params: [
      {
        label: '$ObjectVar',
        documentation: 'A variable containing an Object from which you want to receive events',
      },
      {
        label: '"functionprefix"',
        documentation:
          'The prefix of the functions you define to handle receiving events.  \nThe prefix is appended by the Objects method name.',
      },
      {
        label: '"interface name"',
        documentation:
          '**[optional]** name of an Event interface to use.  \nNote: It must be a supported as outgoing for the Object AND it must be of type DISPATCH.',
      },
    ],
  },
  ObjGet: {
    documentation: 'Retrieves a reference to a COM object from an existing process or filename.',
    label: 'ObjGet ( "filename" [, "classname" [, instance]] )',
    params: [
      {
        label: 'filename',
        documentation: 'The full path and name to the file containing the object.',
      },
      {
        label: 'classname',
        documentation:
          '**[optional]** Class identifier. Can be in either ProgID or the string representation of the CLSID.',
      },
      {
        label: 'instance',
        documentation:
          '**[optional]** Instance of the object for ROT objects of the same (co)class.',
      },
    ],
  },
  ObjName: {
    documentation: 'Returns the name or interface description of an Object.',
    label: 'ObjName ( $Objectvariable [, Flag = 1] )',
    params: [
      {
        label: '$Objectvariable',
        documentation: 'A variable containing an Object whose name you want to retrieve',
      },
      {
        label: 'Flag',
        documentation:
          '**[optional]**    \n&emsp;`$OBJ_NAME` (`1`) = (default) The name of the Object    \n&emsp;`$OBJ_STRING` (`2`) = Description string of the Object    \n&emsp;`$OBJ_PROGID` (`3`) = The ProgID of the Object    \n&emsp;`$OBJ_FILE` (`4`) = The file that is associated with the object in the Registry    \n&emsp;`$OBJ_MODULE` (`5`) = Module name in which the object runs (WIN XP And above). Marshaller for non-inproc objects.    \n&emsp;`$OBJ_CLSID` (`6`) = CLSID of the object\'s coclass    \n&emsp;`$OBJ_IID` (`7`) = IID of the object\'s interface.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  OnAutoItExitRegister: {
    documentation: 'Registers a function to be called when AutoIt exits.',
    label: 'OnAutoItExitRegister ( "function" )',
    params: [
      {
        label: 'function',
        documentation: 'The name of the user function to call.',
      },
    ],
  },
  OnAutoItExitUnRegister: {
    documentation: 'UnRegisters a function that was called when AutoIt exits.',
    label: 'OnAutoItExitUnRegister ( "function" )',
    params: [
      {
        label: 'function',
        documentation: 'The name of the user function that was called.',
      },
    ],
  },
  Ping: {
    documentation: 'Pings a host and returns the roundtrip-time.',
    label: 'Ping ( "address/hostname" [, timeout = 4000] )',
    params: [
      {
        label: 'address/hostname',
        documentation: 'Can be i.e. "www.autoitscript.com" or "87.106.244.38".',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Is the time to wait for an answer in milliseconds (default is 4000).',
      },
    ],
  },
  PixelChecksum: {
    documentation: 'Generates a checksum for a region of pixels.',
    label: 'PixelChecksum ( left, top, right, bottom [, step = 1 [, hwnd [, mode = 0]]] )',
    params: [
      {
        label: 'left',
        documentation: 'left coordinate of rectangle.',
      },
      {
        label: 'top',
        documentation: 'top coordinate of rectangle.',
      },
      {
        label: 'right',
        documentation: 'right coordinate of rectangle.',
      },
      {
        label: 'bottom',
        documentation: 'bottom coordinate of rectangle.',
      },
      {
        label: 'step',
        documentation:
          '**[optional]** Instead of checksumming each pixel use a value larger than 1 to skip pixels (for speed). E.g. A value of 2 will only check every other pixel. Default is 1. **It is not recommended to use a step value greater than 1.**',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** Window handle to be used. Default is the desktop window.',
      },
      {
        label: 'mode',
        documentation: '**[optional]** default 0 ADLER checksum, 1 CRC32 Checksum.',
      },
    ],
  },
  PixelGetColor: {
    documentation: 'Returns a pixel color according to x,y pixel coordinates.',
    label: 'PixelGetColor ( x , y [, hwnd] )',
    params: [
      {
        label: 'x',
        documentation: 'x coordinate of pixel.',
      },
      {
        label: 'y',
        documentation: 'y coordinate of pixel.',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** Window handle to be used. Default is the desktop window.',
      },
    ],
  },
  PixelSearch: {
    documentation: 'Searches a rectangle of pixels for the pixel color provided.',
    label:
      'PixelSearch ( left, top, right, bottom, color [, shade-variation = 0 [, step = 1 [, hwnd]]] )',
    params: [
      {
        label: 'left',
        documentation: 'left coordinate of rectangle.',
      },
      {
        label: 'top',
        documentation: 'top coordinate of rectangle.',
      },
      {
        label: 'right',
        documentation: 'right coordinate of rectangle.',
      },
      {
        label: 'bottom',
        documentation: 'bottom coordinate of rectangle.',
      },
      {
        label: 'color',
        documentation: 'Color value of pixel to find (in decimal or hex).',
      },
      {
        label: 'shade-variation',
        documentation:
          '**[optional]** A number between 0 and 255 to indicate the allowed number of shades of variation of the red, green, and blue components of the color. Default is 0 (exact match).',
      },
      {
        label: 'step',
        documentation:
          '**[optional]** Instead of searching each pixel use a value larger than 1 to skip pixels (for speed). E.g. A value of 2 will only check every other pixel. Default is 1. **It is not recommended to use a step value greater than 1.**',
      },
      {
        label: 'hwnd',
        documentation: '**[optional]** Window handle to be used. Default is the desktop window.',
      },
    ],
  },
  ProcessClose: {
    documentation: 'Terminates a named process.',
    label: 'ProcessClose ( "process" )',
    params: [
      {
        label: 'process',
        documentation: 'The name or PID of the process to terminate.',
      },
    ],
  },
  ProcessExists: {
    documentation: 'Checks to see if a specified process exists.',
    label: 'ProcessExists ( "process" )',
    params: [
      {
        label: 'process',
        documentation: 'The name or PID of the process to check.',
      },
    ],
  },
  ProcessGetStats: {
    documentation: 'Returns an array about Memory or IO infos of a running process.',
    label: 'ProcessGetStats ( ["process" [, type = 0]] )',
    params: [
      {
        label: 'process',
        documentation:
          '**[optional]** The name or PID of the process to get infos from. Default (-1) is the current process.',
      },
      {
        label: 'type',
        documentation:
          '**[optional]**    \n&emsp;`$PROCESS_STATS_MEMORY` (`0`) = (default) memory infos.    \n&emsp;`$PROCESS_STATS_IO` (`1`) = IO infos.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  ProcessList: {
    documentation: 'Returns an array listing the currently running processes (names and PIDs).',
    label: 'ProcessList ( ["name"] )',
    params: [
      {
        label: 'name',
        documentation:
          '**[optional]** If a name is given only processes of the same name will be returned.',
      },
    ],
  },
  ProcessSetPriority: {
    documentation: 'Changes the priority of a process.',
    label: 'ProcessSetPriority ( "process", priority )',
    params: [
      {
        label: 'process',
        documentation: 'The name or PID of the process to check.',
      },
      {
        label: 'priority',
        documentation:
          'A flag which determines what priority to set    \n&emsp;`$PROCESS_LOW` (`0`) = Idle/Low    \n&emsp;`$PROCESS_BELOWNORMAL` (`1`) = Below Normal    \n&emsp;`$PROCESS_NORMAL` (`2`) = Normal    \n&emsp;`$PROCESS_ABOVENORMAL` (`3`) = Above Normal    \n&emsp;`$PROCESS_HIGH` (`4`) = High    \n&emsp;`$PROCESS_REALTIME` (`5`) = Realtime (Use with caution, may make the system unstable)  \n\nConstants are define in "AutoItConstants.au3".',
      },
    ],
  },
  ProcessWait: {
    documentation: 'Pauses script execution until a given process exists.',
    label: 'ProcessWait ( "process" [, timeout = 0] )',
    params: [
      {
        label: 'process',
        documentation: 'The name of the process to check.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Specifies how long to wait (in seconds). Default is to wait indefinitely.',
      },
    ],
  },
  ProcessWaitClose: {
    documentation: 'Pauses script execution until a given process does not exist.',
    label: 'ProcessWaitClose ( "process" [, timeout = 0] )',
    params: [
      {
        label: 'process',
        documentation: 'The name or PID of the process to check.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Specifies how long to wait (in seconds). Default is to wait indefinitely.',
      },
    ],
  },
  ProgressOff: {
    documentation: 'Turns Progress window off.',
    label: 'ProgressOff (  )',
    params: [],
  },
  ProgressOn: {
    documentation: 'Creates a customizable progress bar window.',
    label: 'ProgressOn ( "title", "maintext" [, "subtext" [, x pos [, y pos [, opt]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'Title for progress window.',
      },
      {
        label: 'maintext',
        documentation: 'Text for Main, Bold, Upper label.',
      },
      {
        label: 'subtext',
        documentation: '**[optional]** text for Sub, Normal, Lower label. (default is blank)',
      },
      {
        label: 'x pos',
        documentation:
          '**[optional]** position from left (in pixels) of progress window. (default is centered)',
      },
      {
        label: 'y pos',
        documentation:
          '**[optional]** position from top (in pixels) of progress window. (default is centered)',
      },
      {
        label: 'opt',
        documentation:
          '**[optional]** Default is \'always on top/with title\'  \nAdd up the following options you want:    \n&emsp;`$DLG_NOTITLE` (`1`) = borderless, titleless window    \n&emsp;`$DLG_NOTONTOP` (`2`) = Without "always on top" attribute    \n&emsp;`$DLG_MOVEABLE` (`16`) = Window can be moved.  \n\nConstants are defined in AutoItConstants.au3',
      },
    ],
  },
  ProgressSet: {
    documentation: 'Sets the position and/or text of a previously created Progress bar window.',
    label: 'ProgressSet ( percent [, "subtext" [, "maintext"]] )',
    params: [
      {
        label: 'percent',
        documentation: 'Percentage (value between 0. and 100.) to set the progress bar at.',
      },
      {
        label: 'subtext',
        documentation: '**[optional]** Set the text for the Sub, Normal, Lower label.',
      },
      {
        label: 'maintext',
        documentation: '**[optional]** Set the text for the Main, Bold, Upper label.',
      },
    ],
  },
  Ptr: {
    documentation: 'Converts an expression into a pointer variant.',
    label: 'Ptr ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into a pointer variant.',
      },
    ],
  },
  Random: {
    documentation: 'Generates a pseudo-random float-type number.',
    label: 'Random ( [Min = 0 [, Max = 1 [, Flag = 0]]] )',
    params: [
      {
        label: 'Min',
        documentation: '**[optional]** The smallest number to be generated. The default is 0.',
      },
      {
        label: 'Max',
        documentation: '**[optional]** The largest number to be generated. The default is 1.',
      },
      {
        label: 'Flag',
        documentation:
          '**[optional]** If this is set to 1 then an integer result will be returned. Default is a floating point number.',
      },
    ],
  },
  RegDelete: {
    documentation: 'Deletes a key or value from the registry.',
    label: 'RegDelete ( "keyname" [, "valuename"] )',
    params: [
      {
        label: 'keyname',
        documentation: 'The registry key to delete.',
      },
      {
        label: 'valuename',
        documentation: '**[optional]** The valuename to delete.',
      },
    ],
  },
  RegEnumKey: {
    documentation: 'Reads the name of a subkey according to its instance.',
    label: 'RegEnumKey ( "keyname", instance )',
    params: [
      {
        label: 'keyname',
        documentation: 'The registry key to read.',
      },
      {
        label: 'instance',
        documentation: 'The 1-based key instance to retrieve',
      },
    ],
  },
  RegEnumVal: {
    documentation: 'Reads the name of a value according to its instance.',
    label: 'RegEnumVal ( "keyname", instance )',
    params: [
      {
        label: 'keyname',
        documentation: 'The registry key to read.',
      },
      {
        label: 'instance',
        documentation: 'The 1-based value instance to retrieve',
      },
    ],
  },
  RegRead: {
    documentation: 'Reads a value from the registry.',
    label: 'RegRead ( "keyname", "valuename" )',
    params: [
      {
        label: 'keyname',
        documentation: 'The registry key to read.',
      },
      {
        label: 'valuename',
        documentation: 'The value to read.',
      },
    ],
  },
  RegWrite: {
    documentation: 'Creates a key or value in the registry.',
    label: 'RegWrite ( "keyname" [, "valuename", "type", value] )',
    params: [
      {
        label: 'keyname',
        documentation:
          'The registry key to write to. If no other parameters are specified this key will simply be created.',
      },
      {
        label: 'valuename',
        documentation: '**[optional]** The valuename to write to.',
      },
      {
        label: 'type',
        documentation:
          '**[optional]** Type of key to write: "REG_SZ", "REG_MULTI_SZ", "REG_EXPAND_SZ", "REG_DWORD", "REG_QWORD", or "REG_BINARY".',
      },
      {
        label: 'value',
        documentation: '**[optional]** The value to write.',
      },
    ],
  },
  Round: {
    documentation: 'Returns a number rounded to a specified number of decimal places.',
    label: 'Round ( expression [, decimalplaces] )',
    params: [
      {
        label: 'expression',
        documentation: 'Any valid numeric expression.',
      },
      {
        label: 'decimalplaces',
        documentation:
          '**[optional]** Number indicating how many places to the right of the decimal are included in the rounding. If omitted, Round returns an integer.',
      },
    ],
  },
  Run: {
    documentation: 'Runs an external program.',
    label: 'Run ( "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
    params: [
      {
        label: 'program',
        documentation: 'The full path of the program (EXE, BAT, COM, or PIF) to run.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. Blank ("") uses the current working directory. This is not the path to the program.',
      },
      {
        label: 'show_flag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window (or Default keyword)  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
      {
        label: 'opt_flag',
        documentation:
          "**[optional]** Controls various options related to how the parent and child process interact.  \n&emsp;`$STDIN_CHILD` (`0x1`) = Provide a handle to the child's STDIN stream    \n&emsp;`$STDOUT_CHILD` (`0x2`) = Provide a handle to the child's STDOUT stream    \n&emsp;`$STDERR_CHILD` (`0x4`) = Provide a handle to the child's STDERR stream    \n&emsp;`$STDERR_MERGED` (`0x8`) = Provides the same handle for STDOUT and STDERR. Implies both `$STDOUT_CHILD` and `$STDERR_CHILD`.    \n&emsp;`$STDIO_INHERIT_PARENT` (`0x10`) = Provide the child with the parent's STDIO streams. \nemsp;This flag can not be combined with any other STDIO flag. This flag is only useful when the parent is compiled as a Console application.    \n&emsp;`$RUN_CREATE_NEW_CONSOLE` (`0x10000`) = The child console process should be created with it's own window instead of using the parent's window. This flag is only useful when the parent is compiled as a Console application.  \n\nConstants are defined in AutoItConstants.au3.",
      },
    ],
  },
  RunAs: {
    documentation: 'Runs an external program under the context of a different user.',
    label:
      'RunAs ( "username", "domain", "password", logon_flag, "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
    params: [
      {
        label: 'username',
        documentation: 'The username to log on with.',
      },
      {
        label: 'domain',
        documentation: 'The domain to authenticate against.',
      },
      {
        label: 'password',
        documentation: 'The password for the user.',
      },
      {
        label: 'logon_flag',
        documentation:
          '&emsp;`$RUN_LOGON_NOPROFILE` (`0`) - Interactive logon with no profile.    \n&emsp;`$RUN_LOGON_PROFILE` (`1`) - Interactive logon with profile.    \n&emsp;`$RUN_LOGON_NETWORK` (`2`) - Network credentials only.    \n&emsp;`$RUN_LOGON_INHERIT` (`4`) - Inherit the calling process\'s environment instead of the user\'s environment.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'program',
        documentation: 'The full path of the program (EXE, BAT, COM, or PIF) to run.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. If not specified, then the value of `@SystemDir` will be used. This is not the path to the program.',
      },
      {
        label: 'show_flag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window (or Default keyword)  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
      {
        label: 'opt_flag',
        documentation:
          "**[optional]** Controls various options related to how the parent and child process interact.  \n&emsp;`$STDIN_CHILD` (`0x1`) = Provide a handle to the child's STDIN stream    \n&emsp;`$STDOUT_CHILD` (`0x2`) = Provide a handle to the child's STDOUT stream    \n&emsp;`$STDERR_CHILD` (`0x4`) = Provide a handle to the child's STDERR stream    \n&emsp;`$STDERR_MERGED` (`0x8`) = Provides the same handle for STDOUT and STDERR. Implies both `$STDOUT_CHILD` and `$STDERR_CHILD`.    \n&emsp;`$STDIO_INHERIT_PARENT` (`0x10`) = Provide the child with the parent's STDIO streams. \nemsp;This flag can not be combined with any other STDIO flag. This flag is only useful when the parent is compiled as a Console application.    \n&emsp;`$RUN_CREATE_NEW_CONSOLE` (`0x10000`) = The child console process should be created with it's own window instead of using the parent's window. This flag is only useful when the parent is compiled as a Console application.  \n\nConstants are defined in AutoItConstants.au3.",
      },
    ],
  },
  RunAsWait: {
    documentation:
      'Runs an external program under the context of a different user and pauses script execution until the program finishes.',
    label:
      'RunAsWait ( "username", "domain", "password", logon_flag, "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
    params: [
      {
        label: 'username',
        documentation: 'The username to log on with.',
      },
      {
        label: 'domain',
        documentation: 'The domain to authenticate against.',
      },
      {
        label: 'password',
        documentation: 'The password for the user.',
      },
      {
        label: 'logon_flag',
        documentation:
          '&emsp;`$RUN_LOGON_NOPROFILE` (`0`) - Interactive logon with no profile.    \n&emsp;`$RUN_LOGON_PROFILE` (`1`) - Interactive logon with profile.    \n&emsp;`$RUN_LOGON_NETWORK` (`2`) - Network credentials only.    \n&emsp;`$RUN_LOGON_INHERIT` (`4`) - Inherit the calling process\'s environment instead of the user\'s environment.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'program',
        documentation: 'The full path of the program (EXE, BAT, COM, or PIF) to run.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. If not specified, then the value of @SystemDir will be used. This is not the path to the program.',
      },
      {
        label: 'show_flag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window (or Default keyword)  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
      {
        label: 'opt_flag',
        documentation:
          '**[optional]** Controls various options related to how the parent and child process interact.    \n&emsp;`0x10000` (`$RUN_CREATE_NEW_CONSOLE`) = The child console process should be created with its own window instead of using the parents window. This flag is only useful when the parent is compiled as a Console application.  \n\nConstant is defined in AutoItConstants.au3',
      },
    ],
  },
  RunWait: {
    documentation:
      'Runs an external program and pauses script execution until the program finishes.',
    label: 'RunWait ( "program" [, "workingdir" [, show_flag [, opt_flag]]] )',
    params: [
      {
        label: 'program',
        documentation: 'The full path of the program (EXE, BAT, COM, or PIF) to run.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. Blank ("") uses the current working directory. This is not the path to the program.',
      },
      {
        label: 'show_flag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window (or Default keyword)  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
      {
        label: 'opt_flag',
        documentation:
          '**[optional]** Controls various options related to how the parent and child process interact.    \n&emsp;`0x10000` (`$RUN_CREATE_NEW_CONSOLE`) = The child console process should be created with its own window instead of using the parents window. This flag is only useful when the parent is compiled as a Console application.  \n\nConstant is defined in AutoItConstants.au3',
      },
    ],
  },
  SRandom: {
    documentation: 'Set Seed for random number generation.',
    label: 'SRandom ( Seed )',
    params: [
      {
        label: 'Seed',
        documentation: 'Seed value for random number generation. Number between -2^31 and 2^31-1',
      },
    ],
  },
  Send: {
    documentation: 'Sends simulated keystrokes to the active window.',
    label: 'Send ( "keys" [, flag = 0] )',
    params: [
      {
        label: 'keys',
        documentation: 'The sequence of keys to send.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes how "keys" is processed:    \n&emsp;`$SEND_DEFAULT` (`0`) = Text contains special characters like + and ! to indicate SHIFT and ALT key-presses (default).    \n&emsp;`$SEND_RAW` (`1`) = keys are sent raw.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  SendKeepActive: {
    documentation: 'Attempts to keep a specified window active during Send().',
    label: 'SendKeepActive ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to activate. See Title special definition. Use a blank title to disable the function.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window. Default is an empty string. See Text special definition.',
      },
    ],
  },
  SetError: {
    documentation:
      'Manually set the value of the @error macro (and optionally @extended, and "Return Value").',
    label: 'SetError ( code [, extended = 0 [, return value]] )',
    params: [
      {
        label: 'code',
        documentation: 'The required value (integer) to set into the `@error` macro.',
      },
      {
        label: 'extended',
        documentation:
          '**[optional]** The required value (integer) to set into the `@extended` macro. This sets the same macro as the `SetExtended()` function.',
      },
      {
        label: 'return value',
        documentation:
          '**[optional]** The value to be returned by the function - if no parameter used the return value is undefined.',
      },
    ],
  },
  SetExtended: {
    documentation: 'Manually set the value of the @extended macro.',
    label: 'SetExtended ( code [, return value] )',
    params: [
      {
        label: 'code',
        documentation: 'The required value (integer) to set into the @extended macro.',
      },
      {
        label: 'return value',
        documentation:
          '**[optional]** The value to be returned by the function - if no parameter used the return value is undefined.',
      },
    ],
  },
  ShellExecute: {
    documentation: 'Runs an external program using the ShellExecute API.',
    label: 'ShellExecute ( "filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )',
    params: [
      {
        label: 'filename',
        documentation: 'The name of the file to run (EXE, .txt, .lnk, etc).',
      },
      {
        label: 'parameters',
        documentation: '**[optional]** Any parameters for the program. Blank ("") uses none.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. Blank ("") uses the current working directory.',
      },
      {
        label: 'verb',
        documentation:
          '**[optional]** The "verb" to use, common verbs include:    \n&emsp;`$SHEX_OPEN` ("open") = Opens the file specified. The file can be an executable file, a document file, or a folder    \n&emsp;`$SHEX_EDIT` ("edit") = Launches an editor and opens the document for editing. If "filename" is not a document file, the function will fail    \n&emsp;`$SHEX_PRINT` ("print") = Prints the document file specified. If "filename" is not a document file, the function will fail    \n&emsp;`$SHEX_PROPERTIES` ("properties") = Displays the file or folder\'s properties.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'showflag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
    ],
  },
  ShellExecuteWait: {
    documentation:
      'Runs an external program using the ShellExecute API and pauses script execution until it finishes.',
    label:
      'ShellExecuteWait ( "filename" [, "parameters" [, "workingdir" [, "verb" [, showflag]]]] )',
    params: [
      {
        label: 'filename',
        documentation: 'The name of the file to run (EXE, .txt, .lnk, etc).',
      },
      {
        label: 'parameters',
        documentation: '**[optional]** Any parameters for the program. Blank ("") uses none.',
      },
      {
        label: 'workingdir',
        documentation:
          '**[optional]** The working directory. Blank ("") uses the current working directory.',
      },
      {
        label: 'verb',
        documentation:
          '**[optional]** The "verb" to use, common verbs include:    \n&emsp;`$SHEX_OPEN` ("open") = Opens the file specified. The file can be an executable file, a document file, or a folder    \n&emsp;`$SHEX_EDIT` ("edit") = Launches an editor and opens the document for editing. If "filename" is not a document file, the function will fail    \n&emsp;`$SHEX_PRINT` ("print") = Prints the document file specified. If "filename" is not a document file, the function will fail    \n&emsp;`$SHEX_PROPERTIES` ("properties") = Displays the file or folder\'s properties.  \n**See remarks for more information on the default behavior when a verb is not specified.**  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'showflag',
        documentation:
          '**[optional]** The "show" flag of the executed program:  \n&emsp;`@SW_HIDE` = Hidden window  \n&emsp;`@SW_MINIMIZE` = Minimized window  \n&emsp;`@SW_MAXIMIZE` = Maximized window',
      },
    ],
  },
  Shutdown: {
    documentation: 'Shuts down the system.',
    label: 'Shutdown ( code )',
    params: [
      {
        label: 'code',
        documentation: 'A combination of shutdown codes. See "remarks".',
      },
    ],
  },
  Sin: {
    documentation: 'Calculates the sine of a number.',
    label: 'Sin ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Value in radians.',
      },
    ],
  },
  Sleep: {
    documentation: 'Pause script execution.',
    label: 'Sleep ( delay )',
    params: [
      {
        label: 'delay',
        documentation: 'Amount of time to pause (in milliseconds).',
      },
    ],
  },
  SoundPlay: {
    documentation: 'Play a sound file.',
    label: 'SoundPlay ( "filename" [, wait = 0] )',
    params: [
      {
        label: 'filename',
        documentation: 'Name of the file to be played (typically a WAV or MP3)',
      },
      {
        label: 'wait',
        documentation:
          '**[optional]** This flag determines if the script should wait for the sound to finish before continuing:  \n&emsp;`$SOUND_WAIT`(`1`) = wait until sound has finished  \n&emsp;`$SOUND_NOWAIT`(`0`) = continue script while sound is playing (default)  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  SoundSetWaveVolume: {
    documentation: 'Sets the system wave volume by percent.',
    label: 'SoundSetWaveVolume ( percent )',
    params: [
      {
        label: 'percent',
        documentation: 'percentage number between 0 and 100',
      },
    ],
  },
  SplashImageOn: {
    documentation: 'Creates a customizable image popup window.',
    label: 'SplashImageOn ( "title", "file" [, width [, height [, x pos [, y pos [, opt]]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'Title for splash window.',
      },
      {
        label: 'file',
        documentation: 'full path\\filename of image (BMP, GIF, or JPG)',
      },
      {
        label: 'width',
        documentation: '**[optional]** width of window in pixels. (default is 500)',
      },
      {
        label: 'height',
        documentation: '**[optional]** height of window in pixels. (default is 400)',
      },
      {
        label: 'x pos',
        documentation:
          '**[optional]** position from left (in pixels) of splash window. (default is centered)',
      },
      {
        label: 'y pos',
        documentation:
          '**[optional]** position from top (in pixels) of splash window. (default is centered)',
      },
      {
        label: 'opt',
        documentation:
          '**[optional]** Default is \'always on top/with title\'Add up the following options you want:    \n&emsp;`$DLG_NOTITLE` (`1`) = borderless, titleless window    \n&emsp;`$DLG_NOTONTOP` (`2`) = Without "always on top" attribute    \n&emsp;`$DLG_MOVEABLE` (`16`) = Window can be moved.  \n\nConstants are defined in AutoItConstants.au3.',
      },
    ],
  },
  SplashOff: {
    documentation: 'Turns SplashText or SplashImage off.',
    label: 'SplashOff (  )',
    params: [],
  },
  SplashTextOn: {
    documentation: 'Creates a customizable text popup window.',
    label:
      'SplashTextOn ( "title", "text" [, w = 500 [, h = 400 [, x pos [, y pos [, opt = 0 [, "fontname" [, fontsz = 12 [, fontwt]]]]]]]] )',
    params: [
      {
        label: 'title',
        documentation: 'Title for splash window.',
      },
      {
        label: 'text',
        documentation: 'Text for splash window.',
      },
      {
        label: 'w',
        documentation: '**[optional]** Width of window in pixels. (default 500)',
      },
      {
        label: 'h',
        documentation: '**[optional]** Height of window in pixels. (default 400)',
      },
      {
        label: 'x pos',
        documentation:
          '**[optional]** Position from left (in pixels) of splash window. (default is centered)',
      },
      {
        label: 'y pos',
        documentation:
          '**[optional]** Position from top (in pixels) of splash window. (default is centered)',
      },
      {
        label: 'opt',
        documentation:
          '**[optional]** Add them up - default is \'center justified/always on top/with title\'    \n&emsp;`$DLG_CENTERONTOP` (`0`) = Center justified/always on top/with title (default)    \n&emsp;`$DLG_NOTITLE` (`1`) = Thin bordered titleless window    \n&emsp;`$DLG_NOTONTOP` (`2`) = Without "always on top" attribute    \n&emsp;`$DLG_TEXTLEFT` (`4`) = Left justified text    \n&emsp;`$DLG_TEXTRIGHT` (`8`) = Right justified text    \n&emsp;`$DLG_MOVEABLE` (`16`) = Windows can be moved    \n&emsp;`$DLG_TEXTVCENTER` (`32`) = Center text vertically.  \n\nConstants are defined in AutoItConstants.au3.',
      },
      {
        label: 'fontname',
        documentation:
          '**[optional]** Name of the font to use. (OS default GUI font is used if the font is "" or is not found)',
      },
      {
        label: 'fontsz',
        documentation:
          '**[optional]** Font size. (default is 12; standard sizes are 6 8 9 10 11 12 14 16 18 20 22 24 26 28 36 48 72)',
      },
      {
        label: 'fontwt',
        documentation:
          '**[optional]** The weight of the font in the range 0 through 1000. For example, 400 is normal and 700 is bold. If this value is zero, a default weight is used.  \nThe following values are defined for convenience.    \n&emsp;`$FW_DONTCARE` (`0`) (Use the default font weight)    \n&emsp;`$FW_THIN` (`100`)    \n&emsp;`$FW_EXTRALIGHT` (`200`)    \n&emsp;`$FW_LIGHT` (`300`)    \n&emsp;`$FW_NORMAL` (`400`)    \n&emsp;`$FW_MEDIUM` (`500`)    \n&emsp;`$FW_SEMIBOLD` (`600`)    \n&emsp;`$FW_BOLD` (`700`)    \n&emsp;`$FW_EXTRABOLD` (`800`)    \n&emsp;`$FW_HEAVY` (`900`)  \n\nConstants are defined in FontConstants.au3.',
      },
    ],
  },
  Sqrt: {
    documentation: 'Calculates the square-root of a number.',
    label: 'Sqrt ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Any nonnegative expression to get the square-root of.',
      },
    ],
  },
  StatusbarGetText: {
    documentation: 'Retrieves the text from a standard status bar control.',
    label: 'StatusbarGetText ( "title" [, "text" [, part = 1]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string.',
      },
      {
        label: 'part',
        documentation:
          '**[optional]** The "part" number of the status bar to read - the default is 1. 1 is the first possible part and usually the one that contains the useful messages like "Ready" "Loading...", etc.',
      },
    ],
  },
  StderrRead: {
    documentation: 'Reads from the STDERR stream of a previously run child process.',
    label: 'StderrRead ( process_id [, peek = False [, binary = False]] )',
    params: [
      {
        label: 'process_id',
        documentation: 'The process ID of a child process, as returned by a previous call to Run.',
      },
      {
        label: 'peek',
        documentation:
          '**[optional]** If True the function does not remove the read characters from the stream.',
      },
      {
        label: 'binary',
        documentation:
          '**[optional]** If True the function reads the data as binary instead of text (default is text).',
      },
    ],
  },
  StdinWrite: {
    documentation:
      'Writes a number of characters to the STDIN stream of a previously run child process.',
    label: 'StdinWrite ( process_id [, data] )',
    params: [
      {
        label: 'process_id',
        documentation: 'The process ID of a child process, as returned by a previous call to Run.',
      },
      {
        label: 'data',
        documentation:
          '**[optional]** The data you wish to output. This may either be text or binary.',
      },
    ],
  },
  StdioClose: {
    documentation:
      'Closes all resources associated with a process previously run with STDIO redirection.',
    label: 'StdioClose ( process_id )',
    params: [
      {
        label: 'process_id',
        documentation: 'The process ID of a child process, as returned by a previous call to Run.',
      },
    ],
  },
  StdoutRead: {
    documentation: 'Reads from the STDOUT stream of a previously run child process.',
    label: 'StdoutRead ( process_id [, peek = False [, binary = False]] )',
    params: [
      {
        label: 'process_id',
        documentation: 'The process ID of a child process, as returned by a previous call to Run.',
      },
      {
        label: 'peek',
        documentation:
          '**[optional]** If True the function does not remove the read characters from the stream.',
      },
      {
        label: 'binary',
        documentation:
          '**[optional]** If True the function reads the data as binary instead of text (default is text).',
      },
    ],
  },
  String: {
    documentation: 'Returns the string representation of an expression.',
    label: 'String ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into a string.',
      },
    ],
  },
  StringAddCR: {
    documentation:
      'Takes a string and prefixes all linefeed characters ( Chr(10) ) with a carriage return character ( Chr(13) ).',
    label: 'StringAddCR ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to convert.',
      },
    ],
  },
  StringCompare: {
    documentation: 'Compares two strings with options.',
    label: 'StringCompare ( "string1", "string2" [, casesense = 0] )',
    params: [
      {
        label: 'string1',
        documentation: 'The first string to evaluate.',
      },
      {
        label: 'string2',
        documentation: 'The second string to evaluate.',
      },
      {
        label: 'casesense',
        documentation:
          "**[optional]** Flag to indicate if the operations should be case sensitive.    \n&emsp;`$STR_NOCASESENSE` (`0`) = not case sensitive, using the user's locale (default)    \n&emsp;`$STR_CASESENSE` (`1`) = case sensitive    \n&emsp;`$STR_NOCASESENSEBASIC` (`2`) = not case sensitive, using a basic/faster comparison.  \n\nConstants are defined in StringConstants.au3.",
      },
    ],
  },
  StringFormat: {
    documentation: 'Returns a formatted string (similar to the C sprintf() function).',
    label: 'StringFormat ( "format control", var1 [, ... var32] )',
    params: [
      {
        label: 'format control',
        documentation: 'The format and flags to use.',
      },
      {
        label: 'var1...var32',
        documentation: 'Up to 32 variables that will be output according to the "format control".',
      },
    ],
  },
  StringFromASCIIArray: {
    documentation: 'Converts an array of ASCII codes to a string.',
    label: 'StringFromASCIIArray ( array, [start = 0 [, end = -1 [, encoding = 0]]] )',
    params: [
      {
        label: 'array',
        documentation: 'The array of ASCII codes to convert to characters.',
      },
      {
        label: 'start',
        documentation: '**[optional]** The 0-based index to start processing from (Default: 0).',
      },
      {
        label: 'end',
        documentation:
          '**[optional]** The 0-based index to end processing at (Default: `UBound($aArray)`). Note that the character at this index is NOT included in the output.',
      },
      {
        label: 'encoding',
        documentation:
          '**[optional]** The array contains values in the specified character set:    \n&emsp;`$SE_UTF16` (`0`) = UTF-16 (Default)    \n&emsp;`$SE_ANSI` (`1`) = ANSI    \n&emsp;`$SE_UTF8` (`2`) = UTF-8.  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  StringInStr: {
    documentation: 'Checks if a string contains a given substring.',
    label:
      'StringInStr ( "string", "substring" [, casesense = 0 [, occurrence = 1 [, start = 1 [, count]]]] )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'substring',
        documentation: 'The substring to search for.',
      },
      {
        label: 'casesense',
        documentation:
          "**[optional]** Flag to indicate if the operations should be case sensitive.    \n&emsp;`$STR_NOCASESENSE` (`0`) = not case sensitive, using the user's locale (default)    \n&emsp;`$STR_CASESENSE` (`1`) = case sensitive    \n&emsp;`$STR_NOCASESENSEBASIC` (`2`) = not case sensitive, using a basic/faster comparison.  \n\nConstants are defined in StringConstants.au3.",
      },
      {
        label: 'occurrence',
        documentation:
          '**[optional]** Which occurrence of the substring to find in the string. Use a negative occurrence to search from the right side. The default value is 1 (finds first occurrence).',
      },
      {
        label: 'start',
        documentation: '**[optional]** The starting position of the search.',
      },
      {
        label: 'count',
        documentation:
          '**[optional]** The number of characters to search. This effectively limits the search to a portion of the full string.',
      },
    ],
  },
  StringIsASCII: {
    documentation:
      'Checks if a string contains only ASCII characters in the range 0x00 - 0x7f (0 - 127).',
    label: 'StringIsASCII ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsAlNum: {
    documentation: 'Checks if a string contains only alphanumeric characters.',
    label: 'StringIsAlNum ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsAlpha: {
    documentation: 'Checks if a string contains only alphabetic characters.',
    label: 'StringIsAlpha ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsDigit: {
    documentation: 'Checks if a string contains only digit (0-9) characters.',
    label: 'StringIsDigit ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsFloat: {
    documentation: 'Checks if a string is a floating point number.',
    label: 'StringIsFloat ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string or expression to check.',
      },
    ],
  },
  StringIsInt: {
    documentation: 'Checks if a string is an integer.',
    label: 'StringIsInt ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check.',
      },
    ],
  },
  StringIsLower: {
    documentation: 'Checks if a string contains only lowercase characters.',
    label: 'StringIsLower ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsSpace: {
    documentation: 'Checks if a string contains only whitespace characters.',
    label: 'StringIsSpace ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsUpper: {
    documentation: 'Checks if a string contains only uppercase characters.',
    label: 'StringIsUpper ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringIsXDigit: {
    documentation: 'Checks if a string contains only hexadecimal digit (0-9, A-F) characters.',
    label: 'StringIsXDigit ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to check',
      },
    ],
  },
  StringLeft: {
    documentation: 'Returns a number of characters from the left-hand side of a string.',
    label: 'StringLeft ( "string", count )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'count',
        documentation: 'The number of characters to get.',
      },
    ],
  },
  StringLen: {
    documentation: 'Returns the number of characters in a string.',
    label: 'StringLen ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
    ],
  },
  StringLower: {
    documentation: 'Converts a string to lowercase.',
    label: 'StringLower ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to convert.',
      },
    ],
  },
  StringMid: {
    documentation: 'Extracts a number of characters from a string.',
    label: 'StringMid ( "string", start [, count = -1] )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'start',
        documentation: 'The character position to start. (1 = first character)',
      },
      {
        label: 'count',
        documentation:
          '**[optional]** The number of characters to extract. By default the entire remainder of the string.',
      },
    ],
  },
  StringRegExp: {
    documentation: 'Check if a string fits a given regular expression pattern.',
    label: 'StringRegExp ( "test", "pattern" [, flag = 0 [, offset = 1]] )',
    params: [
      {
        label: 'test',
        documentation: 'The subject string to check',
      },
      {
        label: 'pattern',
        documentation: 'The regular expression to match.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** A number to indicate how the function behaves. See below for details. The default is 0.',
      },
      {
        label: 'offset',
        documentation:
          '**[optional]** The string position to start the match (starts at 1). The default is 1.',
      },
    ],
  },
  StringRegExpReplace: {
    documentation: 'Replace text in a string based on regular expressions.',
    label: 'StringRegExpReplace ( "test", "pattern", "replace" [, count = 0] )',
    params: [
      {
        label: 'test',
        documentation: 'The string to check',
      },
      {
        label: 'pattern',
        documentation:
          'The regular expression to compare. See StringRegExp for pattern definition characters.',
      },
      {
        label: 'replace',
        documentation:
          'The text to replace the regular expression matching text with. To insert matched group text, \\0 - \\9 (or $0 - $9) can be used as back-references.',
      },
      {
        label: 'count',
        documentation:
          '**[optional]** The number of times to execute the replacement in the string. The default is 0. Use 0 for global replacement.',
      },
    ],
  },
  StringReplace: {
    documentation: 'Replaces substrings in a string.',
    label:
      'StringReplace ( "string", "searchstring/start", "replacestring" [, occurrence = 0 [, casesense = 0]] )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'searchstring/start',
        documentation:
          'The substring to search for or the character position to start the replacement.',
      },
      {
        label: 'replacestring',
        documentation: 'The replacement string.',
      },
      {
        label: 'occurrence',
        documentation:
          '**[optional]** The number of times to replace the searchstring. Use a negative occurrence to replace from the right side.    \n&emsp;0 = all searchstrings will be replaced (default)',
      },
      {
        label: 'casesense',
        documentation:
          "**[optional]** Flag to indicate if the operations should be case sensitive.    \n&emsp;$STR_NOCASESENSE` (`0`) = not case sensitive, using the user's locale (default)    \n&emsp;`$STR_CASESENSE` (`1`) = case sensitive    \n&emsp;`$STR_NOCASESENSEBASIC` (`2`) = not case sensitive, using a basic/faster comparison.  \n\nConstants are defined in StringConstants.au3.",
      },
    ],
  },
  StringReverse: {
    documentation: 'Reverses the contents of the specified string.',
    label: 'StringReverse ( "string" [, flag = 0] )',
    params: [
      {
        label: 'string',
        documentation: 'The string to reverse.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes the way the string is reversed    \n&emsp;`$STR_UTF16` (`0`) = reversed in full UTF-16 mode. (default)    \n&emsp;`$STR_UCS2` (`1`) = a much faster method - only use if using UCS-2 text.  \n\nConstants are defined in "StringConstants.au3".',
      },
    ],
  },
  StringRight: {
    documentation: 'Returns a number of characters from the right-hand side of a string.',
    label: 'StringRight ( "string", count )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'count',
        documentation: 'The number of characters to get.',
      },
    ],
  },
  StringSplit: {
    documentation: 'Splits up a string into substrings depending on the given delimiters.',
    label: 'StringSplit ( "string", "delimiters" [, flag = 0] )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'delimiters',
        documentation: 'One or more characters to use as delimiters (case sensitive).',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes how the string split works, add multiple flag values together if required:    \n&emsp;`$STR_CHRSPLIT` (`0`) = each character in the delimiter string will mark where to split the string (default)    \nemsp;`$STR_ENTIRESPLIT` (`1`) = entire delimiter string is needed to mark the split    \n&emsp;`$STR_NOCOUNT` (`2`) = disable the return count in the first element - effectively makes the array 0-based (must use `UBound()` to get the size of the array in this case).  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  StringStripCR: {
    documentation: 'Removes all carriage return values ( Chr(13) ) from a string.',
    label: 'StringStripCR ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to convert.',
      },
    ],
  },
  StringStripWS: {
    documentation: 'Strips the white space in a string.',
    label: 'StringStripWS ( "string", flag )',
    params: [
      {
        label: 'string',
        documentation: 'The string to strip.',
      },
      {
        label: 'flag',
        documentation:
          'Flag to indicate the type of stripping that should be performed (add the flags together for multiple operations):    \n&emsp;`$STR_STRIPLEADING` (`1`) = strip leading white space    \n&emsp;`$STR_STRIPTRAILING` (`2`) = strip trailing white space    \n&emsp;`$STR_STRIPSPACES` (`4`) = strip double (or more) spaces between words    \n&emsp;`$STR_STRIPALL` (`8`) = strip all spaces (over-rides all other flags)  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  StringToASCIIArray: {
    documentation: 'Converts a string to an array containing the ASCII code of each character.',
    label: 'StringToASCIIArray ( "string",[start = 0 [, end [, encoding = 0]]] )',
    params: [
      {
        label: '"string"',
        documentation: 'The string to convert to an array of ASCII codes.',
      },
      {
        label: 'start',
        documentation: '**[optional]** The 0-based position to start processing from (Default: 0).',
      },
      {
        label: 'end',
        documentation:
          '**[optional]** The 0-based position to end processing at (Default: `StringLen("string")`).',
      },
      {
        label: 'encoding',
        documentation:
          '**[optional]** The returned array will contain values in the specified character set:    \n&emsp;`$SE_UTF16` (`0`) = UTF-16 (Default)    \n&emsp;`$SE_ANSI` (`1`) = ANSI    \n&emsp;`$SE_UTF8` (`2`) = UTF-8.  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  StringToBinary: {
    documentation: 'Converts a string into binary data.',
    label: 'StringToBinary ( expression [, flag = 1] )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to convert into binary data.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Changes how the string is stored as binary:  \n&emsp;`$SB_ANSI` (`1`) = string data is ANSI (default)  \n&emsp;`$SB_UTF16LE` (`2`) = string data is UTF16 Little Endian  \n&emsp;`$SB_UTF16BE` (`3`) = string data is UTF16 Big Endian  \n&emsp;`$SB_UTF8` (`4`) = string data is UTF8.  \n\nConstants are defined in StringConstants.au3.',
      },
    ],
  },
  StringTrimLeft: {
    documentation: 'Trims a number of characters from the left hand side of a string.',
    label: 'StringTrimLeft ( "string", count )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'count',
        documentation: 'The number of characters to trim.',
      },
    ],
  },
  StringTrimRight: {
    documentation: 'Trims a number of characters from the right hand side of a string.',
    label: 'StringTrimRight ( "string", count )',
    params: [
      {
        label: 'string',
        documentation: 'The string to evaluate.',
      },
      {
        label: 'count',
        documentation: 'The number of characters to trim.',
      },
    ],
  },
  StringUpper: {
    documentation: 'Converts a string to uppercase.',
    label: 'StringUpper ( "string" )',
    params: [
      {
        label: 'string',
        documentation: 'The string to convert.',
      },
    ],
  },
  TCPAccept: {
    documentation: 'Permits an incoming connection attempt on a socket.',
    label: 'TCPAccept ( mainsocket )',
    params: [
      {
        label: 'mainsocket',
        documentation:
          'The main socket identifier (SocketID) as returned by a `TCPListen()` function.',
      },
    ],
  },
  TCPCloseSocket: {
    documentation: 'Closes a TCP socket.',
    label: 'TCPCloseSocket ( socket )',
    params: [
      {
        label: 'socket',
        documentation:
          'The socket identifier (SocketID) as returned by a `TCPListen()`, `TCPConnect()` or `TCPAccept()` functions.',
      },
    ],
  },
  TCPConnect: {
    documentation: 'Create a socket connected to an existing server.',
    label: 'TCPConnect ( IPAddr, port )',
    params: [
      {
        label: 'IPAddr',
        documentation: 'Internet Protocol dotted address(IpV4) as "192.162.1.1".',
      },
      {
        label: 'port',
        documentation: 'port on which the created socket will be connected.',
      },
    ],
  },
  TCPListen: {
    documentation: 'Creates a socket listening for an incoming connection.',
    label: 'TCPListen ( IPAddr, port [, MaxPendingConnection] )',
    params: [
      {
        label: 'IPAddr',
        documentation: 'Internet Protocol dotted address(IpV4) as "192.162.1.1".',
      },
      {
        label: 'port',
        documentation: 'port on which the created socket will be connected.',
      },
      {
        label: 'MaxPendingConnection',
        documentation:
          '**[optional]** Maximum length of the queue of pending connections. By default the maximum reasonable value will be set.',
      },
    ],
  },
  TCPNameToIP: {
    documentation: 'Converts an Internet name to IP address.',
    label: 'TCPNameToIP ( name )',
    params: [
      {
        label: 'name',
        documentation: 'String containing an Internet name.',
      },
    ],
  },
  TCPRecv: {
    documentation: 'Receives data from a connected socket.',
    label: 'TCPRecv ( mainsocket, maxlen [, flag = 0] )',
    params: [
      {
        label: 'mainsocket',
        documentation:
          'The connected socket identifier (SocketID) as returned by a `TCPAccept()` or a `TCPConnect()` function.',
      },
      {
        label: 'maxlen',
        documentation: 'max # of characters to receive.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]** Forces the function to return binary data if set to 1 (default is 0, and will auto detect between binary/string).    \n&emsp;`$TCP_DATA_DEFAULT` (`0`) - (Default) will auto detect between binary/string    \n&emsp;`$TCP_DATA_BINARY` (`1`) - return binary data.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  TCPSend: {
    documentation: 'Sends data on a connected socket.',
    label: 'TCPSend ( mainsocket, data )',
    params: [
      {
        label: 'mainsocket',
        documentation:
          'The connected socket identifier (SocketID) as returned by a `TCPConnect()` function.',
      },
      {
        label: 'data',
        documentation: 'binary/string to be send to the connected socket.',
      },
    ],
  },
  TCPShutdown: {
    documentation: 'Stops TCP services.',
    label: 'TCPShutdown (  )',
    params: [],
  },
  TCPStartup: {
    documentation: 'Starts TCP services.',
    label: 'TCPStartup (  )',
    params: [],
  },
  Tan: {
    documentation: 'Calculates the tangent of a number.',
    label: 'Tan ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'Value in radians.',
      },
    ],
  },
  TimerDiff: {
    documentation: 'Returns the difference in time from a previous call to TimerInit().',
    label: 'TimerDiff ( handle )',
    params: [
      {
        label: 'handle',
        documentation: 'Handle returned from a previous call to `TimerInit()`.',
      },
    ],
  },
  TimerInit: {
    documentation:
      'Returns a handle that can be passed to TimerDiff() to calculate the difference in milliseconds.',
    label: 'TimerInit (  )',
    params: [],
  },
  ToolTip: {
    documentation: 'Creates a tooltip anywhere on the screen.',
    label: 'ToolTip ( "text" [, x [, y [, "title" [, icon = 0 [, options]]]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the tooltip. (An empty string clears a displaying tooltip)',
      },
      {
        label: 'x',
        documentation: '**[optional]** The x position of the tooltip.',
      },
      {
        label: 'y',
        documentation: '**[optional]** The y position of the tooltip.',
      },
      {
        label: 'title',
        documentation: '**[optional]** The title for the tooltip.',
      },
      {
        label: 'icon',
        documentation:
          '**[optional]** Pre-defined icon to show next to the title: Requires a title.    \n&emsp;`$TIP_NOICON` (`0`) = No icon    \n&emsp;`$TIP_INFOICON` (`1`) = Info icon    \n&emsp;`$TIP_WARNINGICON` (`2`) = Warning icon    \n&emsp;`$TIP_ERRORICON` (`3`) = Error Icon.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
      {
        label: 'options',
        documentation:
          '**[optional]** Sets different options for how the tooltip will be displayed (Can be added together):    \n&emsp;`$TIP_BALLOON` (`1`) = Display as Balloon Tip    \n&emsp;`$TIP_CENTER` (`2`) = Center the tip at the x,y coordinates instead of using them for the upper left corner.    \n&emsp;`$TIP_FORCEVISIBLE` (`4`) = Force the tooltip to always be visible confining it to monitor borders if necessary. If multiple monitors are used, then the tooltip will "snap-to" the nearest monitor.  \n\nConstants are defined in "AutoItConstants.au3"',
      },
    ],
  },
  TrayCreateItem: {
    documentation: 'Creates a menuitem control for the tray.',
    label: 'TrayCreateItem ( "text" [, menuID = -1 [, menuentry = -1 [, menuradioitem = 0]]] )',
    params: [
      {
        label: 'text',
        documentation: 'The text of the control.',
      },
      {
        label: 'menuID',
        documentation:
          "**[optional]** Allows you to create a submenu in the referenced menu. If equal -1 it will be added 'behind' the last created item (default setting).",
      },
      {
        label: 'menuentry',
        documentation:
          "**[optional]** Allows you to define the entry number to be created. The entries are numbered starting at 0. If equal -1 it will be added 'behind' the last created entry (default setting).",
      },
      {
        label: 'menuradioitem',
        documentation:
          '**[optional]**    \n&emsp;`$TRAY_ITEM_NORMAL` (`0`) = (default) create a normal menuitem.    \n&emsp;`$TRAY_ITEM_RADIO` (`1`) = create a menuradioitem.  \n\nConstants are defined in TrayConstants.au3.',
      },
    ],
  },
  TrayCreateMenu: {
    documentation: 'Creates a menu control for the tray menu.',
    label: 'TrayCreateMenu ( "sub/menutext" [, menuID = -1 [, menuentry = -1]] )',
    params: [
      {
        label: 'sub/menutext',
        documentation: 'The sub/menu text.',
      },
      {
        label: 'menuID',
        documentation:
          '**[optional]** If defined, allows you to create a submenu in the referenced menu. Default -1 (refers to first level menu).',
      },
      {
        label: 'menuentry',
        documentation:
          '**[optional]** Allows you to define the entry number to be created. The entries are numbered starting at 0. Default -1 (at the bottom).',
      },
    ],
  },
  TrayGetMsg: {
    documentation: 'Polls the tray to see if any events have occurred.',
    label: 'TrayGetMsg (  )',
    params: [],
  },
  TrayItemDelete: {
    documentation: 'Deletes a menu/item control from the tray menu.',
    label: 'TrayItemDelete ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
    ],
  },
  TrayItemGetHandle: {
    documentation: 'Returns the handle for a tray menu(item).',
    label: 'TrayItemGetHandle ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
    ],
  },
  TrayItemGetState: {
    documentation: 'Gets the current state of a control.',
    label: 'TrayItemGetState ( [controlID] )',
    params: [
      {
        label: 'controlID',
        documentation:
          '**[optional]** The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
    ],
  },
  TrayItemGetText: {
    documentation: 'Gets the itemtext of a tray menu/item control.',
    label: 'TrayItemGetText ( controlID )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
    ],
  },
  TrayItemSetOnEvent: {
    documentation: 'Defines a user-defined function to be called when a tray item is clicked.',
    label: 'TrayItemSetOnEvent ( itemID, "function" )',
    params: [
      {
        label: 'itemID',
        documentation: 'The item identifier (itemID) as returned by a `TrayCreateItem` function.',
      },
      {
        label: 'function',
        documentation: 'The name of the user function to call.',
      },
    ],
  },
  TrayItemSetState: {
    documentation: 'Sets the state of a tray menu/item control.',
    label: 'TrayItemSetState ( controlID, state )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
      {
        label: 'state',
        documentation: 'See the State table.',
      },
    ],
  },
  TrayItemSetText: {
    documentation: 'Sets the itemtext of a tray menu/item control.',
    label: 'TrayItemSetText ( controlID, text )',
    params: [
      {
        label: 'controlID',
        documentation:
          'The control identifier (controlID) as returned by a `TrayCreateItem` or `TrayCreateMenu` function.',
      },
      {
        label: 'text',
        documentation: 'The new text of the tray menu/item control.',
      },
    ],
  },
  TraySetClick: {
    documentation:
      'Sets the clickmode of the tray icon - what mouseclicks will display the tray menu.',
    label: 'TraySetClick ( flag )',
    params: [
      {
        label: 'flag',
        documentation:
          '0 = Tray menu will never be shown through a mouseclick  \n1 = Pressing primary mouse button  \n2 = Releasing primary mouse button  \n4 = Double-click primary mouse button  \n8 = Pressing secondary mouse button  \n16 = Releasing secondary mouse button  \n32 = Double-click secondary mouse button  \n64 = Hovering over the tray icon',
      },
    ],
  },
  TraySetIcon: {
    documentation: 'Loads/Sets a specified tray icon.',
    label: 'TraySetIcon ( [filename [, iconID]] )',
    params: [
      {
        label: 'filename',
        documentation: '**[optional]** The filename of the icon to be display in the tray.',
      },
      {
        label: 'iconID',
        documentation: '**[optional]** Icon identifier if the file contains multiple icons.',
      },
    ],
  },
  TraySetOnEvent: {
    documentation: 'Defines a user function to be called when a special tray action happens.',
    label: 'TraySetOnEvent ( specialID, "function" )',
    params: [
      {
        label: 'specialID',
        documentation: 'See the Special ID table.',
      },
      {
        label: 'function',
        documentation: 'The name of the user function to call.',
      },
    ],
  },
  TraySetPauseIcon: {
    documentation: 'Loads/Sets a specified tray pause icon.',
    label: 'TraySetPauseIcon ( [filename [, iconID]] )',
    params: [
      {
        label: 'filename',
        documentation:
          '**[optional]** The filename of the icon to be display as pause icon in the tray.',
      },
      {
        label: 'iconID',
        documentation: '**[optional]** Icon identifier if the file contains multiple icons.',
      },
    ],
  },
  TraySetState: {
    documentation: 'Sets the state of the tray icon.',
    label: 'TraySetState ( [flag = 1] )',
    params: [
      {
        label: 'flag',
        documentation:
          '**[optional]** A combination of the following:    \n&emsp;`$TRAY_ICONSTATE_SHOW` (`1`) = Shows the tray icon (default)    \n&emsp;`$TRAY_ICONSTATE_HIDE` (`2`) = Destroys/Hides the tray icon    \n&emsp;`$TRAY_ICONSTATE_FLASH` (`4`) = Flashes the tray icon    \n&emsp;`$TRAY_ICONSTATE_STOPFLASH` (`8`) = Stops tray icon flashing    \n&emsp;`$TRAY_ICONSTATE_RESET` (`16`) = Resets the icon to the defaults (no flashing, default tip text)  \n\nConstants are defined in TrayConstants.au3.',
      },
    ],
  },
  TraySetToolTip: {
    documentation: '(Re)Sets the tooltip text for the tray icon.',
    label: 'TraySetToolTip ( [text] )',
    params: [
      {
        label: 'text',
        documentation:
          '**[optional]** The new text to be displayed as tooltip. The length is limited.',
      },
    ],
  },
  TrayTip: {
    documentation: 'Displays a balloon tip from the AutoIt Icon.',
    label: 'TrayTip ( "title", "text", timeout [, option = 0] )',
    params: [
      {
        label: 'title',
        documentation:
          'Text appears in bold at the top of the balloon tip. (63 characters maximum)',
      },
      {
        label: 'text',
        documentation: 'Message the balloon tip will display. (255 characters maximum)',
      },
      {
        label: 'timeout',
        documentation:
          'A rough estimate of the time (in seconds) the balloon tip should be displayed. (Windows has a min and max of about 10-30 seconds but does not always honor a time in that range.)',
      },
      {
        label: 'option',
        documentation:
          '**[optional]**    \n&emsp;`$TIP_ICONNONE` (`0`) = No icon (default)    \n&emsp;`$TIP_ICONASTERISK` (`1`) = Info icon    \n&emsp;`$TIP_ICONEXCLAMATION` (`2`) = Warning icon    \n&emsp;`$TIP_ICONHAND` (`3`) = Error icon    \n&emsp;`$TIP_NOSOUND` (`16`) = Disable sound.  \n\nConstants are defined in TrayConstants.au3.',
      },
    ],
  },
  UBound: {
    documentation: 'Returns the size of array dimensions or the number of keys in a map.',
    label: 'UBound ( Variable [, Dimension = 1] )',
    params: [
      {
        label: 'Variable',
        documentation: 'An array or map variable',
      },
      {
        label: 'Dimension',
        documentation:
          '**[optional]** For an array - Which dimension size to return:  \n&emsp;`$UBOUND_DIMENSIONS` (`0`) = Number of subscripts in the array  \n&emsp;`$UBOUND_ROWS` (`1`) = Number of rows in the array (default)  \n&emsp;`$UBOUND_COLUMNS` (`2`) = Number of columns in the array  \nFor arrays with more than 2 dimensions, just use the corresponding integer  \nFor a map - this parameter is ignored and the number of keys is returned.  \n\nConstants are defined in AutoItConstants.au3.',
      },
    ],
  },
  UDPBind: {
    documentation: 'Create a socket bound to an incoming connection.',
    label: 'UDPBind ( IPAddr, port )',
    params: [
      {
        label: 'IPAddr',
        documentation: 'Internet Protocol dotted address(IpV4) as "192.162.1.1".',
      },
      {
        label: 'port',
        documentation: 'port on which the created socket will be bound.',
      },
    ],
  },
  UDPCloseSocket: {
    documentation: 'Close a UDP socket.',
    label: 'UDPCloseSocket ( socketarray )',
    params: [
      {
        label: 'socketarray',
        documentation: 'The socket/array as returned by a `UDPBind()` or `UDPOpen()` functions.',
      },
    ],
  },
  UDPOpen: {
    documentation: 'Open a socket connected to an existing server .',
    label: 'UDPOpen ( IPAddr, port [, flag = 0] )',
    params: [
      {
        label: 'IPAddr',
        documentation: 'Internet Protocol dotted address(IpV4) as "192.162.1.1".',
      },
      {
        label: 'port',
        documentation: 'port on which the created socket will be connected.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**    \n&emsp;`$UDP_OPEN_DEFAULT` (`0`) - (Default) - No additional options are set.    \n&emsp;`$UDP_OPEN_BROADCAST` (`1`) - Allow the broadcasting on the address "255.255.255.255".  \n\nConstants are defined in "AutoIt Constants.au3".',
      },
    ],
  },
  UDPRecv: {
    documentation: 'Receives data from an opened socket.',
    label: 'UDPRecv ( socketarray, maxlen [, flag = 0] )',
    params: [
      {
        label: 'socketarray',
        documentation: 'The socket/array as returned by a `UDPBind()` function.',
      },
      {
        label: 'maxlen',
        documentation: 'max # of characters to receive.',
      },
      {
        label: 'flag',
        documentation:
          '**[optional]**    \n&emsp;`$UDP_DATA_DEFAULT` (`0`) - will auto detect between binary/string.    \n&emsp;`$UDP_DATA_BINARY` (`1`) - return binary data    \n&emsp;`$UDP_DATA_ARRAY` (`2`) - returned in an Array : [0] data, [1] from IP, [2] from Port.  \nIf you want both just use 3.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  UDPSend: {
    documentation: 'Sends data on an opened socket.',
    label: 'UDPSend ( socketarray, data )',
    params: [
      {
        label: 'socketarray',
        documentation: 'The main socket/array as returned by a `UDPOpen()` function.',
      },
      {
        label: 'data',
        documentation: 'binary/string to be sent to the connected socket',
      },
    ],
  },
  UDPShutdown: {
    documentation: 'Stops UDP services.',
    label: 'UDPShutdown (  )',
    params: [],
  },
  UDPStartup: {
    documentation: 'Starts UDP services.',
    label: 'UDPStartup (  )',
    params: [],
  },
  VarGetType: {
    documentation: 'Returns the internal type representation of a variant.',
    label: 'VarGetType ( expression )',
    params: [
      {
        label: 'expression',
        documentation: 'An expression to check the internal type of.',
      },
    ],
  },
  WinActivate: {
    documentation: 'Activates (gives focus to) a window.',
    label: 'WinActivate ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to activate. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to activate. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinActive: {
    documentation: 'Checks to see if a specified window exists and is currently active.',
    label: 'WinActive ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinClose: {
    documentation: 'Closes a window.',
    label: 'WinClose ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to close. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to close. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinExists: {
    documentation: 'Checks to see if a specified window exists.',
    label: 'WinExists ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinFlash: {
    documentation: 'Flashes a window in the taskbar.',
    label: 'WinFlash ( "title" [, "text" [, flashes = 4 [, delay = 500]]] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to change. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to change. Default is an empty string. See Text special definition.',
      },
      {
        label: 'flashes',
        documentation: '**[optional]** The amount of times to flash the window. Default 4.',
      },
      {
        label: 'delay',
        documentation:
          '**[optional]** The time in milliseconds to sleep between each flash. Default 500 ms.',
      },
    ],
  },
  WinGetCaretPos: {
    documentation: 'Returns the coordinates of the caret in the foreground window.',
    label: 'WinGetCaretPos (  )',
    params: [],
  },
  WinGetClassList: {
    documentation: 'Retrieves the classes from a window.',
    label: 'WinGetClassList ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the classes. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the classes. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetClientSize: {
    documentation: "Retrieves the size of a given window's client area.",
    label: 'WinGetClientSize ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the size. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the size. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetHandle: {
    documentation: 'Retrieves the internal handle of a window.',
    label: 'WinGetHandle ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the handle. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the handle. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetPos: {
    documentation: 'Retrieves the position and size of a given window.',
    label: 'WinGetPos ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the position/size. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the position/size. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetProcess: {
    documentation: 'Retrieves the Process ID (PID) associated with a window.',
    label: 'WinGetProcess ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the PID. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the PID. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetState: {
    documentation: 'Retrieves the state of a given window.',
    label: 'WinGetState ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the state. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the state. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetText: {
    documentation: 'Retrieves the text from a window.',
    label: 'WinGetText ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the text. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the text. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinGetTitle: {
    documentation: 'Retrieves the full title from a window.',
    label: 'WinGetTitle ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to get the title. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to get the title. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinKill: {
    documentation: 'Forces a window to close.',
    label: 'WinKill ( "title" [, "text"] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to close. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to close. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinList: {
    documentation: 'Retrieves a list of windows.',
    label: 'WinList ( ["title" [, "text"]] )',
    params: [
      {
        label: 'title',
        documentation:
          '**[optional]** The title/hWnd/class of the windows to get the list. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the windows to get the list. Default is an empty string. See Text special definition.',
      },
    ],
  },
  WinMenuSelectItem: {
    documentation: 'Invokes a menu item of a window.',
    label:
      'WinMenuSelectItem ( "title", "text", "item" [, "item" [, "item" [, "item" [, "item" [, "item" [, "item"]]]]]] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to select the item. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to select the item. See Text special definition.',
      },
      {
        label: 'item',
        documentation: 'Text of Menu Item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
      {
        label: 'item',
        documentation: '**[optional]** Text of SubMenu item',
      },
    ],
  },
  WinMinimizeAll: {
    documentation: 'Minimizes all windows.',
    label: 'WinMinimizeAll (  )',
    params: [],
  },
  WinMinimizeAllUndo: {
    documentation: 'Undoes a previous WinMinimizeAll function.',
    label: 'WinMinimizeAllUndo (  )',
    params: [],
  },
  WinMove: {
    documentation: 'Moves and/or resizes a window.',
    label: 'WinMove ( "title", "text", x, y [, width [, height [, speed]]] )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to move/resize. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to move/resize. See Text special definition.',
      },
      {
        label: 'x',
        documentation: 'X coordinate to move to.',
      },
      {
        label: 'y',
        documentation: 'Y coordinate to move to.',
      },
      {
        label: 'width',
        documentation: '**[optional]** New width of the window.',
      },
      {
        label: 'height',
        documentation: '**[optional]** New height of the window.',
      },
      {
        label: 'speed',
        documentation:
          '**[optional]** the speed to move the windows in the range 1 (fastest) to 100 (slowest). If not defined the move is instantaneous.',
      },
    ],
  },
  WinSetOnTop: {
    documentation: 'Change a window\'s "Always On Top" attribute.',
    label: 'WinSetOnTop ( "title", "text", flag )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to change. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to change. See Text special definition.',
      },
      {
        label: 'flag',
        documentation:
          'Determines whether the window should have the "TOPMOST" flag set.    \n&emsp;`$WINDOWS_NOONTOP` (`0`) = remove on top flag    \n&emsp;`$WINDOWS_ONTOP` (`1`) = set on top flag.  \n\nConstants are defined in "AutoItConstants.au3".',
      },
    ],
  },
  WinSetState: {
    documentation: 'Shows, hides, minimizes, maximizes, or restores a window.',
    label: 'WinSetState ( "title", "text", flag )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to change the state. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to change the state. See Text special definition.',
      },
      {
        label: 'flag',
        documentation:
          'The "show" flag of the executed program:    \n&emsp;`@SW_HIDE` = Hide window    \n&emsp;`@SW_SHOW` = Shows a previously hidden window    \n&emsp;`@SW_MINIMIZE` = Minimize window    \n&emsp;`@SW_MAXIMIZE` = Maximize window    \n&emsp;`@SW_RESTORE` = Undoes a window minimization or maximization    \n&emsp;`@SW_DISABLE` = Disables the window    \n&emsp;`@SW_ENABLE` = Enables the window',
      },
    ],
  },
  WinSetTitle: {
    documentation: 'Changes the title of a window.',
    label: 'WinSetTitle ( "title", "text", "newtitle" )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to change. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to change. See Text special definition.',
      },
      {
        label: 'newtitle',
        documentation: 'The new title to give to the window.',
      },
    ],
  },
  WinSetTrans: {
    documentation: 'Sets the transparency of a window.',
    label: 'WinSetTrans ( "title", "text", transparency )',
    params: [
      {
        label: 'title',
        documentation:
          'The title/hWnd/class of the window to change. See Title special definition.',
      },
      {
        label: 'text',
        documentation: 'The text of the window to change. See Text special definition.',
      },
      {
        label: 'transparency',
        documentation:
          'A number in the range 0 - 255. The lower the number, the more transparent the window will become. 255 = Solid, 0 = Invisible.',
      },
    ],
  },
  WinWait: {
    documentation: 'Pauses execution of the script until the requested window exists.',
    label: 'WinWait ( "title" [, "text" [, timeout = 0]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Timeout in seconds if the window does not exist. Default is 0 (no timeout).',
      },
    ],
  },
  WinWaitActive: {
    documentation: 'Pauses execution of the script until the requested window is active.',
    label: 'WinWaitActive ( "title" [, "text" [, timeout = 0]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Timeout in seconds if the window is not active. Default is 0 (no timeout).',
      },
    ],
  },
  WinWaitClose: {
    documentation: 'Pauses execution of the script until the requested window does not exist.',
    label: 'WinWaitClose ( "title" [, "text" [, timeout = 0]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Timeout in seconds if the window is not closed. Default is 0 (no timeout).',
      },
    ],
  },
  WinWaitNotActive: {
    documentation: 'Pauses execution of the script until the requested window is not active.',
    label: 'WinWaitNotActive ( "title" [, "text" [, timeout = 0]] )',
    params: [
      {
        label: 'title',
        documentation: 'The title/hWnd/class of the window to check. See Title special definition.',
      },
      {
        label: 'text',
        documentation:
          '**[optional]** The text of the window to check. Default is an empty string. See Text special definition.',
      },
      {
        label: 'timeout',
        documentation:
          '**[optional]** Timeout in seconds if the window is still active. Default is 0 (no timeout).',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(
  signatures,
  CompletionItemKind.Function,
  'AutoIt Function',
);

export { signatures as default, hovers, completions };
