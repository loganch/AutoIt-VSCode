import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <NamedPipes.au3>`)';

const signatures = {
  _NamedPipes_CallNamedPipe: {
    documentation: 'Performs a read/write operation on a named pipe',
    label:
      '_NamedPipes_CallNamedPipe ( $sPipeName, $pInpBuf, $iInpSize, $pOutBuf, $iOutSize, ByRef $iRead [, $iTimeOut = 0] )',
    params: [
      {
        label: '$sPipeName',
        documentation: 'Pipe name',
      },
      {
        label: '$pInpBuf',
        documentation: 'Pointer to the buffer containing the data written to the pipe',
      },
      {
        label: '$iInpSize',
        documentation: 'Size of the write buffer, in bytes',
      },
      {
        label: '$pOutBuf',
        documentation: 'Pointer to the buffer that receives the data read from the pipe',
      },
      {
        label: '$iOutSize',
        documentation: 'Size of the read buffer, in bytes',
      },
      {
        label: '$iRead',
        documentation: 'On return, contains the number of bytes read from the pipe',
      },
      {
        label: '$iTimeOut',
        documentation:
          '**[optional]** Number of milliseconds to wait for the named pipe to be available.In addition to numeric values, the following special values can be specified:    -1 - Wait indefinitely     0 - Uses the default time-out specified in the call to the CreateNamedPipe     1 - Do not wait. If the pipe is not available, return an error',
      },
    ],
  },
  _NamedPipes_ConnectNamedPipe: {
    documentation: 'Enables a named pipe server process to wait for a client process to connect',
    label: '_NamedPipes_ConnectNamedPipe ( $hNamedPipe [, $tOverlapped = 0] )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'Handle to the server end of a named pipe instance',
      },
      {
        label: '$tOverlapped',
        documentation:
          '**[optional]** a $tagOVERLAPPED structure.    If $hNamedPipe was opened with $PIPE_FLAG_OVERLAPPED, $pOverlapped must not be 0.    If $hNamedPipe was created with $PIPE_FLAG_OVERLAPPED and $pOverlapped is not 0, the $tagOVERLAPPED structure should contain a handle to a manual reset event object.    If $hNamedPipe was not opened with $PIPE_FLAG_OVERLAPPED, the function does not return until a client is connected or an error occurs.Successful synchronous operations result in the function returning a nonzero value if a client connects after the function is called.',
      },
    ],
  },
  _NamedPipes_CreateNamedPipe: {
    documentation: 'Creates an instance of a named pipe',
    label:
      '_NamedPipes_CreateNamedPipe ( $sName [, $iAccess = 2 [, $iFlags = 2 [, $iACL = 0 [, $iType = 1 [, $iRead = 1 [, $iWait = 0 [, $iMaxInst = 25 [, $iOutBufSize = 4096 [, $iInpBufSize = 4096 [, $iDefaultTimeout = 5000 [, $tSecurity = 0]]]]]]]]]]] )',
    params: [
      {
        label: '$sName',
        documentation:
          'Pipe name with the following format: \\\\.\\pipe\\pipename.The pipename part of the name can include any character other than a backslash, including numbers and special characters.The pipe name string can be up to 256 characters long.Pipe names are not case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The pipe access mode. Must be one of the following:    0 - The flow of data in the pipe goes from client to server only (inbound)    1 - The flow of data in the pipe goes from server to client only (outbound)    2 - The pipe is bi-directional (duplex)',
      },
      {
        label: '$iFlags',
        documentation:
          '**[optional]** The pipe flags. Can be any combination of the following:    1 - If you attempt to create multiple instances of a pipe with this flag, creation of the first instance succeeds, but creation of the next instance fails.    2 - Overlapped mode is enabled. If this mode is enabled functions performing read, write, and connect operations that may take a significant time to be completed can return immediately.    4 - Write-through mode is enabled. This mode affects only write operations on byte type pipes and only when the client and server are on different computers.',
      },
      {
        label: '$iACL',
        documentation:
          "**[optional]** Security ACL flags. Can be any combination of the following:    1 - The caller will have write access to the named pipe's discretionary ACL    2 - The caller will have write access to the named pipe's owner    4 - The caller will have write access to the named pipe's security ACL",
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** Pipe type mode. Must be one of the following:    0 - Data is written to the pipe as a stream of bytes    1 - Data is written to the pipe as a stream of messages',
      },
      {
        label: '$iRead',
        documentation:
          '**[optional]** Pipe read mode. Must be one of the following:    0 - Data is read from the pipe as a stream of bytes    1 - Data is read from the pipe as a stream of messages',
      },
      {
        label: '$iWait',
        documentation:
          '**[optional]** Pipe wait mode. Must be one of the following:    0 - Blocking mode is enabled. When the pipe handle is specified in ReadFile, WriteFile, or ConnectNamedPipe, the operation is not completed until there is data to read, all data is written, or a client is connected.    1 - Nonblocking mode is enabled. ReadFile, WriteFile, and ConnectNamedPipe always return immediately.',
      },
      {
        label: '$iMaxInst',
        documentation:
          '**[optional]** The maximum number of instances that can be created for this pipe',
      },
      {
        label: '$iOutBufSize',
        documentation: '**[optional]** The number of bytes to reserve for the output buffer',
      },
      {
        label: '$iInpBufSize',
        documentation: '**[optional]** The number of bytes to reserve for the input buffer',
      },
      {
        label: '$iDefaultTimeOut',
        documentation: '**[optional]** The default time out value, in milliseconds',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** a $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new named pipe and determines whether child processes can inherit the returned handle.If $tSecurity is 0, the named pipe gets a default security descriptor and the handle cannot be inherited.The ACLs in the default security descriptor for a named pipe grant full control to the LocalSystem account administrators, and the creator owner.They also grant read access to members of the Everyone group and the anonymous account.',
      },
    ],
  },
  _NamedPipes_CreatePipe: {
    documentation: 'Creates an anonymous pipe',
    label:
      '_NamedPipes_CreatePipe ( ByRef $hReadPipe, ByRef $hWritePipe [, $tSecurity = 0 [, $iSize = 0]] )',
    params: [
      {
        label: '$hReadPipe',
        documentation: 'Variable that receives the read handle for the pipe',
      },
      {
        label: '$hWritePipe',
        documentation: 'Variable that receives the write handle for the pipe',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that determines if the returned handle can be inherited by child processes.If 0, the handles cannot be inherited.',
      },
      {
        label: '$iSize',
        documentation:
          '**[optional]** The size of the buffer for the pipe, in bytes.If 0, the system uses the default buffer size.',
      },
    ],
  },
  _NamedPipes_DisconnectNamedPipe: {
    documentation: 'Disconnects the server end of a named pipe instance from a client process',
    label: '_NamedPipes_DisconnectNamedPipe ( $hNamedPipe )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'Handle to the server end of a named pipe instance.',
      },
    ],
  },
  _NamedPipes_GetNamedPipeHandleState: {
    documentation: 'Retrieves information about a specified named pipe',
    label: '_NamedPipes_GetNamedPipeHandleState ( $hNamedPipe )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'Handle to the server end of a named pipe instance',
      },
    ],
  },
  _NamedPipes_GetNamedPipeInfo: {
    documentation: 'Retrieves information about the specified named pipe',
    label: '_NamedPipes_GetNamedPipeInfo ( $hNamedPipe )',
    params: [
      {
        label: '$hNamedPipe',
        documentation:
          'Handle to the named pipe instance. The handle must have GENERIC_READ access to the named pipe',
      },
    ],
  },
  _NamedPipes_PeekNamedPipe: {
    documentation: 'Copies data from a pipe into a buffer without removing it from the pipe',
    label: '_NamedPipes_PeekNamedPipe ( $hNamedPipe )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'Handle to the pipe',
      },
    ],
  },
  _NamedPipes_SetNamedPipeHandleState: {
    documentation: 'Sets the read mode and the blocking mode of the specified named pipe',
    label:
      '_NamedPipes_SetNamedPipeHandleState ( $hNamedPipe, $iRead, $iWait [, $iBytes = 0 [, $iTimeOut = 0]] )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'Handle to the named pipe instance',
      },
      {
        label: '$iRead',
        documentation:
          'Pipe read mode. Must be one of the following:    0 - Data is read from the pipe as a stream of bytes    1 - Data is read from the pipe as a stream of messages',
      },
      {
        label: '$iWait',
        documentation:
          'Pipe wait mode. Must be one of the following:    0 - Blocking mode is enabled    1 - Nonblocking mode is enabled',
      },
      {
        label: '$iBytes',
        documentation:
          '**[optional]** Maximum number of bytes collected on the client computer before transmission to the server',
      },
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** Maximum time, in milliseconds, that can pass before a remote named pipe transfers information',
      },
    ],
  },
  _NamedPipes_TransactNamedPipe: {
    documentation: 'Reads and writes to a named pipe in one network operation',
    label:
      '_NamedPipes_TransactNamedPipe ( $hNamedPipe, $pInpBuf, $iInpSize, $pOutBuf, $iOutSize [, $tOverlapped = 0] )',
    params: [
      {
        label: '$hNamedPipe',
        documentation: 'The handle to the named pipe',
      },
      {
        label: '$pInpBuf',
        documentation: 'Pointer to the buffer containing the data to be written to the pipe',
      },
      {
        label: '$iInpSize',
        documentation: 'Size of the write buffer, in bytes',
      },
      {
        label: '$pOutBuf',
        documentation: 'Pointer to the buffer that receives the data read from the pipe',
      },
      {
        label: '$iOutSize',
        documentation: 'Size of the read buffer, in bytes',
      },
      {
        label: '$tOverlapped',
        documentation:
          '**[optional]** a $tagOVERLAPPED structure.    This structure is required if $hNamedPipe was opened with $PIPE_FLAG_OVERLAPPED.    If $hNamedPipe was opened with $PIPE_FLAG_OVERLAPPED, $tOverlapped must not be 0.    If $hNamedPipe was opened with $PIPE_FLAG_OVERLAPPED and $tOverlapped is not 0, TransactNamedPipe is executed as an overlapped operation.    The $tagOVERLAPPED structure should contain a manual reset event object.    If the operation cannot be completed immediately, TransactNamedPipe returns False and GetLastError will return ERROR_IO_PENDING.',
      },
    ],
  },
  _NamedPipes_WaitNamedPipe: {
    documentation: 'Waits for an instance of a named pipe to become available',
    label: '_NamedPipes_WaitNamedPipe ( $sPipeName [, $iTimeOut = 0] )',
    params: [
      {
        label: '$sPipeName',
        documentation:
          'The name of the named pipe. The string must include the name of the computer on which the server process is executing.A period may be used for the servername if the pipe is local.',
      },
      {
        label: '$iTimeout',
        documentation:
          '**[optional]** The number of milliseconds that the function will wait for the named pipe to be available.You can also use one of the following values:    -1 - The function does not return until an instance of the named pipe is available     0 - The time-out interval is the default value specified by the server process',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
