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
        documentation:
          'Handle to the access token that contains the privileges to be modified. The handle must have $TOKEN_ADJUST_PRIVILEGES and $TOKEN_QUERY accesses to the token.',
      },
      {
        label: '$aPrivileges',
        documentation:
          "The variable that specifies a privileges. If this parameter is (-1), the function disables of the token's privileges and ignores the $iAttributes parameter. $aPrivileges can be one of the following types. The privilege constant ($SE_*). 1D array of $SE_* constants. 2D array of $SE_* constants and their attributes (see below). [0][0] - Privilege [0][1] - Attributes [n][0] - Privilege [n][1] - Attributes",
      },
      {
        label: '$iAttributes',
        documentation:
          'The privilege attributes. If $aPrivileges parameter is 1D array, $iAttributes applied to the entire array. If $aPrivileges parameter is (-1) or 2D array, the function ignores this parameter and will use the attributes that specified in this array. This parameter can be 0 (disables privilege) or any combination of the following values: $SE_PRIVILEGE_ENABLED $SE_PRIVILEGE_ENABLED_BY_DEFAULT $SE_PRIVILEGE_REMOVED $SE_PRIVILEGE_USED_FOR_ACCESS',
      },
      {
        label: 'ByRef $aAdjust',
        documentation:
          '2D array of the previous state of any privileges that the function modifies. That is, if a privilege has been modified by this function, the privilege and its previous state are contained in this array.',
      },
    ],
  },
  _WinAPI_AssignProcessToJobObject: {
    documentation: 'Assigns a process to an existing job object',
    label: '_WinAPI_AssignProcessToJobObject ( $hJob, $hProcess )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job object to which the process will be associated. The handle must have the $JOB_OBJECT_ASSIGN_PROCESS access right.',
      },
      {
        label: '$hProcess',
        documentation:
          'Handle to the process to associate with the job object. The process must not already be assigned to a job.',
      },
    ],
  },
  _WinAPI_CreateJobObject: {
    documentation: 'Creates or opens a job object',
    label: "_WinAPI_CreateJobObject ( [$sName = '' [, $tSecurity = 0]] )",
    params: [
      {
        label: '$sName',
        documentation:
          "**[optional]** The name of the job. Name comparison is case-sensitive. If this parameter is '', the job is created without a name.",
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies the security descriptor for the job object and determines whether child processes can inherit the returned handle. If this parameter is 0 (Default), the job object gets a default security descriptor and the handle cannot be inherited.',
      },
    ],
  },
  _WinAPI_CreateProcessWithToken: {
    documentation:
      'Creates a new process and its primary thread in the security context of the specified token',
    label:
      "_WinAPI_CreateProcessWithToken ( $sApp, $sCmd, $iFlags, $tStartupInfo, $tProcessInfo, $hToken [, $iLogon = 0 [, $pEnvironment = 0 [, $sDir = '']]] )",
    params: [
      {
        label: '$sApp',
        documentation:
          'The name of the module to be executed. If this parameter is an empty string, the module name must be the first white space–delimited token in the command line string.',
      },
      {
        label: '$sCmd',
        documentation:
          'The command line to be executed. If this parameter is an empty string, the function uses the module name as the command line.',
      },
      {
        label: '$iFlags',
        documentation:
          'The flags that control how the process is created. The $CREATE_DEFAULT_ERROR_MODE, $CREATE_NEW_CONSOLE, and $CREATE_NEW_PROCESS_GROUP are enabled by default. You can specify additional flags as noted: $CREATE_DEFAULT_ERROR_MODE $CREATE_NEW_CONSOLE $CREATE_NEW_PROCESS_GROUP $CREATE_SEPARATE_WOW_VDM $CREATE_SUSPENDED $CREATE_UNICODE_ENVIRONMENT',
      },
      {
        label: '$tStartupInfo',
        documentation: 'a $tagSTARTUPINFO structure or a pointer to it.',
      },
      {
        label: '$tProcessInfo',
        documentation:
          'a $tagPROCESS_INFORMATION structure or a pointer to it that receives information for the new process, including a handle to the process.',
      },
      {
        label: '$hToken',
        documentation:
          'A handle to the primary token that represents a user. The handle must have the $TOKEN_QUERY, $TOKEN_DUPLICATE, and $TOKEN_ASSIGN_PRIMARY access rights.',
      },
      {
        label: '$iLogon',
        documentation:
          '**[optional]** The logon option. This parameter can be zero or one of the following values: $LOGON_WITH_PROFILE $LOGON_NETCREDENTIALS_ONLY',
      },
      {
        label: '$pEnvironment',
        documentation: '**[optional]** A pointer to an environment block for the new process.',
      },
      {
        label: '$sDir',
        documentation:
          '**[optional]** The path to the current directory for the process. If this parameter is an empty string (Default), the new process will have the same current drive and directory as the calling process. Constants are defined in APIProcConstants.au3',
      },
    ],
  },
  _WinAPI_DuplicateTokenEx: {
    documentation:
      'Creates a new primary or impersonation access token that duplicates an existing token',
    label:
      '_WinAPI_DuplicateTokenEx ( $hToken, $iAccess, $iLevel [, $iType = 1 [, $tSecurity = 0]] )',
    params: [
      {
        label: '$hToken',
        documentation: 'A handle to an access token opened with $TOKEN_DUPLICATE access.',
      },
      {
        label: '$iAccess',
        documentation:
          'The requested access rights for the new token. To request the same access rights as the existing token, specify zero. To request all access rights that are valid for the caller, specify the $TOKEN_ALL_ACCESS access.',
      },
      {
        label: '$iLevel',
        documentation:
          'The security impersonation levels. $SECURITYANONYMOUS $SECURITYIDENTIFICATION $SECURITYIMPERSONATION $SECURITYDELEGATION',
      },
      {
        label: '$iType',
        documentation: '**[optional]** The token type. $TOKENPRIMARY (Default) $TOKENIMPERSONATION',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new token and determines whether child processes can inherit the token. If this parameter is 0 (Default), the token gets a default security descriptor and the handle cannot be inherited. If the security descriptor contains a system access control list, the token gets $ACCESS_SYSTEM_SECURITY access right, even if it was not requested.',
      },
    ],
  },
  _WinAPI_EmptyWorkingSet: {
    documentation:
      'Removes as many pages as possible from the working set of the specified process',
    label: '_WinAPI_EmptyWorkingSet ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_EnumChildProcess: {
    documentation: 'Enumerates a child processes that belong to the specified process',
    label: '_WinAPI_EnumChildProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_EnumDeviceDrivers: {
    documentation: 'Retrieves the load address for each device driver in the system',
    label: '_WinAPI_EnumDeviceDrivers ( )',
    params: [],
  },
  _WinAPI_EnumProcessHandles: {
    documentation: 'Enumerates a handles that belong to the specified process',
    label: '_WinAPI_EnumProcessHandles ( [$iPID = 0 [, $iType = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$iType',
        documentation:
          '**[optional]** The value associated with the type of the objects that should be enumerated. This value depends on the operating system. If this parameter is 0 (Default), all handles of the specified process will be enumerated.',
      },
    ],
  },
  _WinAPI_EnumProcessModules: {
    documentation: 'Retrieves a handle and name for each module in the specified process',
    label: '_WinAPI_EnumProcessModules ( [$iPID = 0 [, $iFlag = 0]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$iFlag',
        documentation:
          '**[optional]** The filter criteria. This parameter is valid only for Windows Vista or later, and can be one of the following values: $LIST_MODULES_32BIT $LIST_MODULES_64BIT $LIST_MODULES_ALL $LIST_MODULES_DEFAULT (Default) Constants are defined in APIProcConstants.au3',
      },
    ],
  },
  _WinAPI_EnumProcessThreads: {
    documentation: 'Enumerates a threads that belong to the specified process',
    label: '_WinAPI_EnumProcessThreads ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_EnumProcessWindows: {
    documentation: 'Enumerates a windows that belong to the specified process',
    label: '_WinAPI_EnumProcessWindows ( [$iPID = 0 [, $bVisible = True]] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
      {
        label: '$bVisible',
        documentation:
          '**[optional]** Specifies whether enumerates the invisible window, valid values: True - Enumerate only visible windows (Default). False - Enumerate all windows.',
      },
    ],
  },
  _WinAPI_GetCurrentProcessExplicitAppUserModelID: {
    documentation:
      'Retrieves the application-defined, explicit Application User Model ID for the current process',
    label: '_WinAPI_GetCurrentProcessExplicitAppUserModelID ( )',
    params: [],
  },
  _WinAPI_GetDeviceDriverBaseName: {
    documentation: 'Retrieves the base name of the specified device driver',
    label: '_WinAPI_GetDeviceDriverBaseName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation:
          'The load address of the device driver. This value can be retrieved using the _WinAPI_EnumDeviceDrivers() function.',
      },
    ],
  },
  _WinAPI_GetDeviceDriverFileName: {
    documentation: 'Retrieves the path available for the specified device driver',
    label: '_WinAPI_GetDeviceDriverFileName ( $pDriver )',
    params: [
      {
        label: '$pDriver',
        documentation:
          'The load address of the device driver. This value can be retrieved using the _WinAPI_EnumDeviceDrivers() function.',
      },
    ],
  },
  _WinAPI_GetExitCodeProcess: {
    documentation: 'Retrieves the termination status of the specified process',
    label: '_WinAPI_GetExitCodeProcess ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation: 'Handle to the process.',
      },
    ],
  },
  _WinAPI_GetModuleFileNameEx: {
    documentation:
      'Retrieves the fully-qualified path for the file containing the specified module',
    label: '_WinAPI_GetModuleFileNameEx ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process that contains the module. The handle must have the $PROCESS_QUERY_INFORMATION or $PROCESS_QUERY_LIMITED_INFORMATION access right and the $PROCESS_VM_READ access right.',
      },
      {
        label: '$hModule',
        documentation:
          '**[optional]** Handle to the module. If this parameter is 0 (Default), the function retrieves the path of the executable file of the process.',
      },
    ],
  },
  _WinAPI_GetModuleInformation: {
    documentation: 'Retrieves information about the specified module',
    label: '_WinAPI_GetModuleInformation ( $hProcess [, $hModule = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process that contains the module. The handle must have the $PROCESS_QUERY_INFORMATION or $PROCESS_QUERY_LIMITED_INFORMATION access right and the $PROCESS_VM_READ access right.',
      },
      {
        label: '$hModule',
        documentation:
          '**[optional]** Handle to the module. If this parameter is 0, the function retrieves information only about the executable file ("SizeOfImage" and "EntryPoint" members of the $tagMODULEINFO structure).',
      },
    ],
  },
  _WinAPI_GetParentProcess: {
    documentation: 'Retrieves the PID of the parent process for the specified process',
    label: '_WinAPI_GetParentProcess ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetPriorityClass: {
    documentation: 'Retrieves the priority class for the specified process',
    label: '_WinAPI_GetPriorityClass ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessCommandLine: {
    documentation: 'Retrieves the command-line string for the specified process',
    label: '_WinAPI_GetProcessCommandLine ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessFileName: {
    documentation:
      'Retrieves the fully-qualified path of the executable file for the specified process',
    label: '_WinAPI_GetProcessFileName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessHandleCount: {
    documentation: 'Retrieves the number of open handles that belong to the specified process',
    label: '_WinAPI_GetProcessHandleCount ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessID: {
    documentation: 'Retrieves the process identifier of the specified process',
    label: '_WinAPI_GetProcessID ( $hProcess )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process. The handle must have the $PROCESS_QUERY_INFORMATION or $PROCESS_QUERY_LIMITED_INFORMATION access right.',
      },
    ],
  },
  _WinAPI_GetProcessIoCounters: {
    documentation:
      'Retrieves accounting information for all I/O operations performed by the specified process',
    label: '_WinAPI_GetProcessIoCounters ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessMemoryInfo: {
    documentation: 'Retrieves information about the memory usage of the specified process',
    label: '_WinAPI_GetProcessMemoryInfo ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessName: {
    documentation: 'Retrieves the name for the specified process',
    label: '_WinAPI_GetProcessName ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessTimes: {
    documentation: 'Retrieves timing information for the specified process',
    label: '_WinAPI_GetProcessTimes ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessUser: {
    documentation: 'Retrieves the user and domain name for the specified process',
    label: '_WinAPI_GetProcessUser ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetProcessWorkingDirectory: {
    documentation: 'Retrieves the current working directory for the specified process',
    label: '_WinAPI_GetProcessWorkingDirectory ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_GetThreadDesktop: {
    documentation: 'Retrieves a handle to the desktop assigned to the specified thread',
    label: '_WinAPI_GetThreadDesktop ( $iThreadId )',
    params: [
      {
        label: '$iThreadId',
        documentation:
          'The thread identifier. The _WinAPI_CreateProcess() and _WinAPI_GetCurrentThreadId() return thread identifiers.',
      },
    ],
  },
  _WinAPI_GetThreadErrorMode: {
    documentation: 'Retrieves the error mode for the calling thread',
    label: '_WinAPI_GetThreadErrorMode ( )',
    params: [],
  },
  _WinAPI_GetWindowFileName: {
    documentation:
      'Retrieves the fully-qualified path of the module associated with the specified window handle',
    label: '_WinAPI_GetWindowFileName ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the window whose module file name will be retrieved.',
      },
    ],
  },
  _WinAPI_IsElevated: {
    documentation: 'Determines whether the current process is elevated',
    label: '_WinAPI_IsElevated ( )',
    params: [],
  },
  _WinAPI_IsProcessInJob: {
    documentation: 'Determines whether the process is running in the specified job',
    label: '_WinAPI_IsProcessInJob ( $hProcess [, $hJob = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'Handle to the process to be tested. The handle must have the $PROCESS_QUERY_INFORMATION or $PROCESS_QUERY_LIMITED_INFORMATION access right.',
      },
      {
        label: '$hJob',
        documentation:
          '**[optional]** Handle to the job. If this parameter is 0 (Default), the function tests if the process is running under any job.',
      },
    ],
  },
  _WinAPI_IsWow64Process: {
    documentation: 'Determines whether the specified process is running under WOW64',
    label: '_WinAPI_IsWow64Process ( [$iPID = 0] )',
    params: [
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_OpenJobObject: {
    documentation: 'Opens an existing job object',
    label:
      '_WinAPI_OpenJobObject ( $sName [, $iAccess = $JOB_OBJECT_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sName',
        documentation: 'The name of the job to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the job object. This parameter can be one or more of the following values: $JOB_OBJECT_ALL_ACCESS $JOB_OBJECT_ASSIGN_PROCESS $JOB_OBJECT_QUERY $JOB_OBJECT_SET_ATTRIBUTES $JOB_OBJECT_SET_SECURITY_ATTRIBUTES $JOB_OBJECT_TERMINATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values: True - The processes created by this process will inherit the handle. False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenProcessToken: {
    documentation: 'Opens the access token associated with a process',
    label: '_WinAPI_OpenProcessToken ( $iAccess [, $hProcess = 0] )',
    params: [
      {
        label: '$iAccess',
        documentation:
          'Access mask that specifies the requested types of access to the access token. This parameter can be one or more of the following values: $TOKEN_ALL_ACCESS $TOKEN_ADJUST_DEFAULT $TOKEN_ADJUST_GROUPS $TOKEN_ADJUST_PRIVILEGES $TOKEN_ADJUST_SESSIONID $TOKEN_ASSIGN_PRIMARY $TOKEN_DUPLICATE $TOKEN_EXECUTE $TOKEN_IMPERSONATE $TOKEN_QUERY $TOKEN_QUERY_SOURCE $TOKEN_READ $TOKEN_WRITE',
      },
      {
        label: '$hProcess',
        documentation:
          '**[optional]** Handle to the process whose access token is opened. The process must have the $PROCESS_QUERY_INFORMATION access permission. If this parameter is 0 (Default), will use the current process.',
      },
    ],
  },
  _WinAPI_QueryInformationJobObject: {
    documentation: 'Retrieves limit and job state information from the job object',
    label:
      '_WinAPI_QueryInformationJobObject ( $hJob, $iJobObjectInfoClass, ByRef $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job whose information is being queried. The handle must have the $JOB_OBJECT_QUERY access right. If this value is 0 and the calling process is associated with a job, the job associated with the calling process is used.',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation:
          'The information class for the limits to be queried. This parameter specifies the type of $tJobObjectInfo structure, valid values: 1 - $tagJOBOBJECT_BASIC_ACCOUNTING_INFORMATION 2 - $tagJOBOBJECT_BASIC_LIMIT_INFORMATION 3 - $tagJOBOBJECT_BASIC_PROCESS_ID_LIST 4 - $tagJOBOBJECT_BASIC_UI_RESTRICTIONS 5 - $tagJOBOBJECT_SECURITY_LIMIT_INFORMATION 8 - $tagJOBOBJECT_BASIC_AND_IO_ACCOUNTING_INFORMATION 9 - $tagJOBOBJECT_EXTENDED_LIMIT_INFORMATION 11 - $tagJOBOBJECT_GROUP_INFORMATION',
      },
      {
        label: 'ByRef $tJobObjectInfo',
        documentation:
          '$tagJOBOBJECT_* structure (see above) that retrieves the limit and job state information. This structure must be created before function call.',
      },
    ],
  },
  _WinAPI_SetInformationJobObject: {
    documentation: 'Sets limits for a job object',
    label: '_WinAPI_SetInformationJobObject ( $hJob, $iJobObjectInfoClass, $tJobObjectInfo )',
    params: [
      {
        label: '$hJob',
        documentation:
          'Handle to the job whose limits are being set. The handle must have the $JOB_OBJECT_SET_ATTRIBUTES access right.',
      },
      {
        label: '$iJobObjectInfoClass',
        documentation:
          'The information class for the limits to be set. This parameter specifies the type of $tJobObjectInfo structure, valid values: 2 - $tagJOBOBJECT_BASIC_LIMIT_INFORMATION 4 - $tagJOBOBJECT_BASIC_UI_RESTRICTIONS 5 - $tagJOBOBJECT_SECURITY_LIMIT_INFORMATION 6 - $tagJOBOBJECT_END_OF_JOB_TIME_INFORMATION 7 - $tagJOBOBJECT_ASSOCIATE_COMPLETION_PORT 9 - $tagJOBOBJECT_EXTENDED_LIMIT_INFORMATION 11 - $tagJOBOBJECT_GROUP_INFORMATION',
      },
      {
        label: '$tJobObjectInfo',
        documentation: '$tagJOBOBJECT_* structure that sets the limit and job state information.',
      },
    ],
  },
  _WinAPI_SetPriorityClass: {
    documentation: 'Sets the priority class for the specified process',
    label: '_WinAPI_SetPriorityClass ( $iPriority [, $iPID = 0] )',
    params: [
      {
        label: '$iPriority',
        documentation:
          'The priority class for the process. This parameter can be one of the following values. $ABOVE_NORMAL_PRIORITY_CLASS $BELOW_NORMAL_PRIORITY_CLASS $HIGH_PRIORITY_CLASS $IDLE_PRIORITY_CLASS $NORMAL_PRIORITY_CLASS $REALTIME_PRIORITY_CLASS **Windows Vista or later** $PROCESS_MODE_BACKGROUND_BEGIN $PROCESS_MODE_BACKGROUND_END',
      },
      {
        label: '$iPID',
        documentation: '**[optional]** The PID of the process. Default (0) is the current process.',
      },
    ],
  },
  _WinAPI_SetThreadDesktop: {
    documentation: 'Assigns the specified desktop to the calling thread',
    label: '_WinAPI_SetThreadDesktop ( $hDesktop )',
    params: [
      {
        label: '$hDesktop',
        documentation:
          'Handle to the desktop to be assigned to the calling thread. This desktop must be associated with the current window station for the process.',
      },
    ],
  },
  _WinAPI_SetThreadErrorMode: {
    documentation:
      'Controls whether the system will handle the specified types of serious errors or whether the calling thread will handle them',
    label: '_WinAPI_SetThreadErrorMode ( $iMode )',
    params: [
      {
        label: '$iMode',
        documentation:
          'The thread error mode. This parameter can be one or more of the following values. $SEM_FAILCRITICALERRORS $SEM_NOGPFAULTERRORBOX $SEM_NOOPENFILEERRORBOX',
      },
    ],
  },
  _WinAPI_SetThreadExecutionState: {
    documentation:
      'Prevents the system from entering sleep or turning off the display while the current application is running',
    label: '_WinAPI_SetThreadExecutionState ( $iFlags )',
    params: [
      {
        label: '$iFlags',
        documentation:
          "The thread's execution requirements. This parameter can be one or more of the following values. $ES_AWAYMODE_REQUIRED $ES_CONTINUOUS $ES_DISPLAY_REQUIRED $ES_SYSTEM_REQUIRED $ES_USER_PRESENT",
      },
    ],
  },
  _WinAPI_TerminateJobObject: {
    documentation: 'Terminates all processes currently associated with the job',
    label: '_WinAPI_TerminateJobObject ( $hJob [, $iExitCode = 0] )',
    params: [
      {
        label: '$hJob',
        documentation:
          'A handle to the job whose processes will be terminated. This handle must have the $JOB_OBJECT_TERMINATE access right. Furthermore, the handle for each process in the job object must have the $PROCESS_TERMINATE access right.',
      },
      {
        label: '$iExitCode',
        documentation:
          '**[optional]** The exit code to be used by all processes and threads in the job object.',
      },
    ],
  },
  _WinAPI_TerminateProcess: {
    documentation: 'Terminates the specified process and all of its threads',
    label: '_WinAPI_TerminateProcess ( $hProcess [, $iExitCode = 0] )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'A handle to the process to be terminated. The handle must have the $PROCESS_TERMINATE access right.',
      },
      {
        label: '$iExitCode',
        documentation:
          '**[optional]** The exit code to be used by the process and threads terminated as a result of this call.',
      },
    ],
  },
  _WinAPI_UserHandleGrantAccess: {
    documentation:
      'Grants or denies access to a handle to a User object to a job that has a user-interface restriction',
    label: '_WinAPI_UserHandleGrantAccess ( $hObject, $hJob, $bGrant )',
    params: [
      {
        label: '$hObject',
        documentation: 'Handle to the User object.',
      },
      {
        label: '$hJob',
        documentation: 'Handle to the job to be granted access to the User handle.',
      },
      {
        label: '$bGrant',
        documentation:
          'Specifies whether to grant or deny access to the User handle, valid values: True - The processes associated with the job can recognize and use the handle. False - The processes cannot use the handle.',
      },
    ],
  },
  _WinAPI_CreateMutex: {
    documentation: 'Creates or opens a named or unnamed mutex object',
    label: '_WinAPI_CreateMutex ( $sMutex [, $bInitial = True [, $tSecurity = 0]] )',
    params: [
      {
        label: '$sMutex',
        documentation: 'The name of the mutex object. Name comparisons are case sensitive.',
      },
      {
        label: '$bInitial',
        documentation:
          '**[optional]** Specifies whether the calling process obtains the initial ownership of the mutex object, valid values: True - The calling thread obtains initial ownership of the mutex object (Default). False - The calling thread does not obtain ownership of the mutex object.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new mutex. If this parameter is 0 (Default), the mutex gets a default security descriptor.',
      },
    ],
  },
  _WinAPI_CreateSemaphore: {
    documentation: 'Creates or opens a named or unnamed semaphore object',
    label: '_WinAPI_CreateSemaphore ( $sSemaphore, $iInitial, $iMaximum [, $tSecurity = 0] )',
    params: [
      {
        label: '$sSemaphore',
        documentation:
          'The name of the semaphore to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iInitial',
        documentation:
          'The initial count for the semaphore object. This value must be greater than or equal to zero and less than or equal to $iMaximum.',
      },
      {
        label: '$iMaximum',
        documentation:
          'The maximum count for the semaphore object. This value must be greater than zero.',
      },
      {
        label: '$tSecurity',
        documentation:
          '**[optional]** $tagSECURITY_ATTRIBUTES structure that specifies a security descriptor for the new semaphore. If this parameter is 0 (Default), the semaphore gets a default security descriptor.',
      },
    ],
  },
  _WinAPI_OpenMutex: {
    documentation: 'Opens an existing named mutex object',
    label: '_WinAPI_OpenMutex ( $sMutex [, $iAccess = $MUTEX_ALL_ACCESS [, $bInherit = False]] )',
    params: [
      {
        label: '$sMutex',
        documentation: 'The name of the mutex to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the mutex object. The function fails if the security descriptor of the specified object does not permit the requested access for the calling process. This parameter can be one of the following values: $MUTEX_ALL_ACCESS (Default) $MUTEX_MODIFY_STATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values: True - The processes created by this process will inherit the handle. False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_OpenSemaphore: {
    documentation: 'Opens an existing named semaphore object',
    label: '_WinAPI_OpenSemaphore ( $sSemaphore [, $iAccess = 0x001F0003 [, $bInherit = False]] )',
    params: [
      {
        label: '$sSemaphore',
        documentation:
          'The name of the semaphore to be opened. Name comparisons are case sensitive.',
      },
      {
        label: '$iAccess',
        documentation:
          '**[optional]** The access to the semaphore object. The function fails if the security descriptor of the specified object does not permit the requested access for the calling process. This parameter can be one of the following values: $SEMAPHORE_ALL_ACCESS (Default) $SEMAPHORE_MODIFY_STATE',
      },
      {
        label: '$bInherit',
        documentation:
          '**[optional]** Specifies whether inherites the handle by a processes, valid values: True - The processes created by this process will inherit the handle. False - The processes do not inherit this handle (Default).',
      },
    ],
  },
  _WinAPI_ReleaseMutex: {
    documentation: 'Releases ownership of the specified mutex object',
    label: '_WinAPI_ReleaseMutex ( $hMutex )',
    params: [
      {
        label: '$hMutex',
        documentation:
          'Handle to the mutex object. The _WinAPI_CreateMutex() or _WinAPI_OpenMutex() function returns this handle.',
      },
    ],
  },
  _WinAPI_ReleaseSemaphore: {
    documentation: 'Increases the count of the specified semaphore object by a specified amount',
    label: '_WinAPI_ReleaseSemaphore ( $hSemaphore [, $iIncrease = 1] )',
    params: [
      {
        label: '$hSemaphore',
        documentation:
          'Handle to the semaphore object. The _WinAPI_CreateSemaphore() or _WinAPI_OpenSemaphore() function returns this handle.',
      },
      {
        label: '$iIncrease',
        documentation:
          "**[optional]** The amount by which the semaphore object's current count is to be increased. The value must be greater than zero. If the specified amount would cause the semaphore's count to exceed the maximum count that was specified when the semaphore was created, the count is not changed and the function returns 0. Default is 1.",
      },
    ],
  },
  _WinAPI_ResetEvent: {
    documentation: 'Sets the specified event object to the nonsignaled state',
    label: '_WinAPI_ResetEvent ( $hEvent )',
    params: [
      {
        label: '$hEvent',
        documentation:
          'Handle to the event object. The _WinAPI_CreateEvent() function returns this handle.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
