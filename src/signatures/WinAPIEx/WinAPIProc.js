import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../../util';

const include = '(Requires: `#include <WinAPIProc.au3>`)';

const signatures = {
  _WinAPI_AdjustTokenPrivileges: {
    documentation: 'Enables or disables privileges in the specified access token',
    label: '_WinAPI_AdjustTokenPrivileges ( $hToken, $aPrivileges, $iAttributes, ByRef $aAdjust )',
    params: [
      {
        label: '$hToken',
        documentation: 'Parameter description',
      },
      {
        label: '$aPrivileges',
        documentation: 'Parameter description',
      },
      {
        label: '$iAttributes',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $aAdjust',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_AssignProcessToJobObject: {
    documentation: 'Assigns a process to an existing job object',
    label: '_WinAPI_AssignProcessToJobObject ( $hJob, $hProcess )',
    params: [
      {
        label: '$hJob',
        documentation: 'Parameter description',
      },
      {
        label: '$hProcess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateJobObject: {
    documentation: 'Creates or opens a job object',
    label: '_WinAPI_CreateJobObject ( [$sName = \'\' [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sName',
        documentation: '**[optional]** Default is \'\' [, $tSecurity.',
      }
    ],
  },
  _WinAPI_CreateProcessWithToken: {
    documentation: 'Creates a new process and its primary thread in the security context of the specified token',
    label: '_WinAPI_CreateProcessWithToken ( $sApp, $sCmd, $iFlags, $tStartupInfo, $tProcessInfo, $hToken [, $iLogon = 0 [, $pEnvironment = 0 [, $sDir = \'\']]] )',
    params: [
      {
        label: '$sApp',
        documentation: 'Parameter description',
      },
      {
        label: '$sCmd',
        documentation: 'Parameter description',
      },
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      },
      {
        label: '$tStartupInfo',
        documentation: 'Parameter description',
      },
      {
        label: '$tProcessInfo',
        documentation: 'Parameter description',
      },
      {
        label: '$hToken [, $iLogon',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_DuplicateTokenEx: {
    documentation: 'Creates a new primary or impersonation access token that duplicates an existing token',
    label: '_WinAPI_DuplicateTokenEx ( $hToken, $iAccess, $iLevel [, $iType = 1 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hToken',
        documentation: 'Parameter description',
      },
      {
        label: '$iAccess',
        documentation: 'Parameter description',
      },
      {
        label: '$iLevel [, $iType',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_EmptyWorkingSet: {
    documentation: 'Removes as many pages as possible from the working set of the specified process',
    label: '_WinAPI_EmptyWorkingSet ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_EnumChildProcess: {
    documentation: 'Enumerates a child processes that belong to the specified process',
    label: '_WinAPI_EnumChildProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_EnumDeviceDrivers: {
    documentation: 'Retrieves the load address for each device driver in the system',
    label: '_WinAPI_EnumDeviceDrivers ( )',
    params: [

    ],
  },
  _WinAPI_EnumProcessHandles: {
    documentation: 'Enumerates a handles that belong to the specified process',
    label: '_WinAPI_EnumProcessHandles ( [$iPID = 0 [, $iType = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0 [, $iType.',
      }
    ],
  },
  _WinAPI_EnumProcessModules: {
    documentation: 'Retrieves a handle and name for each module in the specified process',
    label: '_WinAPI_EnumProcessModules ( [$iPID = 0 [, $iFlag = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0 [, $iFlag.',
      }
    ],
  },
  _WinAPI_EnumProcessThreads: {
    documentation: 'Enumerates a threads that belong to the specified process',
    label: '_WinAPI_EnumProcessThreads ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_EnumProcessWindows: {
    documentation: 'Enumerates a windows that belong to the specified process',
    label: '_WinAPI_EnumProcessWindows ( [$iPID = 0 [, $bVisible = True]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0 [, $bVisible.',
      }
    ],
  },
  _WinAPI_GetCurrentProcessExplicitAppUserModelID: {
    documentation: 'Retrieves the application-defined, explicit Application User Model ID for the current process',
    label: '_WinAPI_GetCurrentProcessExplicitAppUserModelID ( )',
    params: [

    ],
  },
  _WinAPI_GetDeviceDriverBaseName: {
    documentation: 'Retrieves the base name of the specified device driver',
    label: '_WinAPI_GetDeviceDriverBaseName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetDeviceDriverFileName: {
    documentation: 'Retrieves the path available for the specified device driver',
    label: '_WinAPI_GetDeviceDriverFileName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetExitCodeProcess: {
    documentation: 'Retrieves the termination status of the specified process',
    label: '_WinAPI_GetExitCodeProcess ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetModuleFileNameEx: {
    documentation: 'Retrieves the fully-qualified path for the file containing the specified module',
    label: '_WinAPI_GetModuleFileNameEx ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess [, $hModule',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetModuleInformation: {
    documentation: 'Retrieves information about the specified module',
    label: '_WinAPI_GetModuleInformation ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess [, $hModule',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetParentProcess: {
    documentation: 'Retrieves the PID of the parent process for the specified process',
    label: '_WinAPI_GetParentProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetPriorityClass: {
    documentation: 'Retrieves the priority class for the specified process',
    label: '_WinAPI_GetPriorityClass ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessCommandLine: {
    documentation: 'Retrieves the command-line string for the specified process',
    label: '_WinAPI_GetProcessCommandLine ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessFileName: {
    documentation: 'Retrieves the fully-qualified path of the executable file for the specified process',
    label: '_WinAPI_GetProcessFileName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessHandleCount: {
    documentation: 'Retrieves the number of open handles that belong to the specified process',
    label: '_WinAPI_GetProcessHandleCount ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessID: {
    documentation: 'Retrieves the process identifier of the specified process',
    label: '_WinAPI_GetProcessID ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetProcessIoCounters: {
    documentation: 'Retrieves accounting information for all I/O operations performed by the specified process',
    label: '_WinAPI_GetProcessIoCounters ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessMemoryInfo: {
    documentation: 'Retrieves information about the memory usage of the specified process',
    label: '_WinAPI_GetProcessMemoryInfo ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessName: {
    documentation: 'Retrieves the name for the specified process',
    label: '_WinAPI_GetProcessName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessTimes: {
    documentation: 'Retrieves timing information for the specified process',
    label: '_WinAPI_GetProcessTimes ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessUser: {
    documentation: 'Retrieves the user and domain name for the specified process',
    label: '_WinAPI_GetProcessUser ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetProcessWorkingDirectory: {
    documentation: 'Retrieves the current working directory for the specified process',
    label: '_WinAPI_GetProcessWorkingDirectory ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_GetThreadDesktop: {
    documentation: 'Retrieves a handle to the desktop assigned to the specified thread',
    label: '_WinAPI_GetThreadDesktop ( $iThreadId )',
    params: [
      {
        label: '$iThreadId',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_GetThreadErrorMode: {
    documentation: 'Retrieves the error mode for the calling thread',
    label: '_WinAPI_GetThreadErrorMode ( )',
    params: [

    ],
  },
  _WinAPI_GetWindowFileName: {
    documentation: 'Retrieves the fully-qualified path of the module associated with the specified window handle',
    label: '_WinAPI_GetWindowFileName ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_IsElevated: {
    documentation: 'Determines whether the current process is elevated',
    label: '_WinAPI_IsElevated ( )',
    params: [

    ],
  },
  _WinAPI_IsProcessInJob: {
    documentation: 'Determines whether the process is running in the specified job',
    label: '_WinAPI_IsProcessInJob ( $hProcess [, $hJob = 0] )',
    params: [
      {
        label: '$hProcess [, $hJob',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_IsWow64Process: {
    documentation: 'Determines whether the specified process is running under WOW64',
    label: '_WinAPI_IsWow64Process ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** Default is 0.',
      }
    ],
  },
  _WinAPI_OpenJobObject: {
    documentation: 'Opens an existing job object',
    label: '_WinAPI_OpenJobObject ( $sName [, $iAccess = $JOB_OBJECT_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sName [, $iAccess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_OpenProcessToken: {
    documentation: 'Opens the access token associated with a process',
    label: '_WinAPI_OpenProcessToken ( $iAccess [, $hProcess = 0] )',
    params: [
      {
        label: '$iAccess [, $hProcess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_QueryInformationJobObject: {
    documentation: 'Retrieves limit and job state information from the job object',
    label: '_WinAPI_QueryInformationJobObject ( $hJob, $iJobObjectInfoClass, ByRef $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation: 'Parameter description',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation: 'Parameter description',
      },
      {
        label: 'ByRef $tJobObjectInfo',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetInformationJobObject: {
    documentation: 'Sets limits for a job object',
    label: '_WinAPI_SetInformationJobObject ( $hJob, $iJobObjectInfoClass, $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation: 'Parameter description',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation: 'Parameter description',
      },
      {
        label: '$tJobObjectInfo',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetPriorityClass: {
    documentation: 'Sets the priority class for the specified process',
    label: '_WinAPI_SetPriorityClass ( $iPriority [, $iPID = 0] )',
    params: [
      {
        label: '$iPriority [, $iPID',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetThreadDesktop: {
    documentation: 'Assigns the specified desktop to the calling thread',
    label: '_WinAPI_SetThreadDesktop ( $hDesktop )',
    params: [
      {
        label: '$hDesktop',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetThreadErrorMode: {
    documentation: 'Controls whether the system will handle the specified types of serious errors or whether the calling thread will handle them',
    label: '_WinAPI_SetThreadErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_SetThreadExecutionState: {
    documentation: 'Prevents the system from entering sleep or turning off the display while the current application is running',
    label: '_WinAPI_SetThreadExecutionState ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_TerminateJobObject: {
    documentation: 'Terminates all processes currently associated with the job',
    label: '_WinAPI_TerminateJobObject ( $hJob [, $iExitCode = 0] )',
    params: [
      {
        label: '$hJob [, $iExitCode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_TerminateProcess: {
    documentation: 'Terminates the specified process and all of its threads',
    label: '_WinAPI_TerminateProcess ( $hProcess [, $iExitCode = 0] )',
    params: [
      {
        label: '$hProcess [, $iExitCode',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_UserHandleGrantAccess: {
    documentation: 'Grants or denies access to a handle to a User object to a job that has a user-interface restriction',
    label: '_WinAPI_UserHandleGrantAccess ( $hObject, $hJob, $bGrant )',
    params: [
      {
        label: '$hObject',
        documentation: 'Parameter description',
      },
      {
        label: '$hJob',
        documentation: 'Parameter description',
      },
      {
        label: '$bGrant',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateMutex: {
    documentation: 'Creates or opens a named or unnamed mutex object',
    label: '_WinAPI_CreateMutex ( $sMutex [, $bInitial = True [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sMutex [, $bInitial',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_CreateSemaphore: {
    documentation: 'Creates or opens a named or unnamed semaphore object',
    label: '_WinAPI_CreateSemaphore ( $sSemaphore, $iInitial, $iMaximum [, $tSecurity = 0] )',
    params: [
      {
        label: '$sSemaphore',
        documentation: 'Parameter description',
      },
      {
        label: '$iInitial',
        documentation: 'Parameter description',
      },
      {
        label: '$iMaximum [, $tSecurity',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_OpenMutex: {
    documentation: 'Opens an existing named mutex object',
    label: '_WinAPI_OpenMutex ( $sMutex [, $iAccess = $MUTEX_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sMutex [, $iAccess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_OpenSemaphore: {
    documentation: 'Opens an existing named semaphore object',
    label: '_WinAPI_OpenSemaphore ( $sSemaphore [, $iAccess = 0x001F0003 [, $bInherit = False]] )',
    params: [
      {
        label: '$sSemaphore [, $iAccess',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ReleaseMutex: {
    documentation: 'Releases ownership of the specified mutex object',
    label: '_WinAPI_ReleaseMutex ( $hMutex )',
    params: [
      {
        label: '$hMutex',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ReleaseSemaphore: {
    documentation: 'Increases the count of the specified semaphore object by a specified amount',
    label: '_WinAPI_ReleaseSemaphore ( $hSemaphore [, $iIncrease = 1] )',
    params: [
      {
        label: '$hSemaphore [, $iIncrease',
        documentation: 'Parameter description',
      }
    ],
  },
  _WinAPI_ResetEvent: {
    documentation: 'Sets the specified event object to the nonsignaled state',
    label: '_WinAPI_ResetEvent ( $hEvent )',
    params: [
      {
        label: '$hEvent',
        documentation: 'Parameter description',
      }
    ],
  }
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
