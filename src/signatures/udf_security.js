import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Security.au3>`)';

const signatures = {
  _Security__AdjustTokenPrivileges: {
    documentation: 'Enables or disables privileges in the specified access token',
    label:
      '_Security__AdjustTokenPrivileges ( $hToken, $bDisableAll, $tNewState, $iBufferLen [, $tPrevState = 0 [, $pRequired = 0]] )',
    params: [
      {
        label: '$hToken',
        documentation: 'Handle to the access token that contains privileges to be modified',
      },
      {
        label: '$bDisableAll',
        documentation:
          'If True, the function disables all privileges and ignores the NewState parameter.If False, the function modifies privileges based on the information pointed to by the $pNewState parameter.',
      },
      {
        label: '$tNewState',
        documentation:
          "A $tagTOKEN_PRIVILEGES structure or a pointer to it that contains the privilege and it's attributes",
      },
      {
        label: '$iBufferLen',
        documentation: 'Size, in bytes, of the buffer pointed to by $pNewState',
      },
      {
        label: '$tPrevState',
        documentation:
          '**[optional]** A $tagTOKEN_PRIVILEGES structure or a pointer to it that specifies the previous state of the privilege that the function modified. This can be 0.',
      },
      {
        label: '$pRequired',
        documentation:
          '**[optional]** Pointer to a variable that receives the required size, in bytes, of the buffer pointed to by $tPrevState.This parameter can be 0 if $tPrevState is 0.',
      },
    ],
  },
  _Security__CreateProcessWithToken: {
    documentation:
      'Creates a new process and its primary thread running in the security context of the specified token',
    label:
      '_Security__CreateProcessWithToken ( $hToken, $iLogonFlags, $sCommandLine, $iCreationFlags, $sCurDir, $tSTARTUPINFO, $tPROCESS_INFORMATION )',
    params: [
      {
        label: '$hToken',
        documentation: 'A handle to the primary token that represents a user',
      },
      {
        label: '$iLogonFlags',
        documentation: 'The logon option',
      },
      {
        label: '$sCommandLine',
        documentation: 'The command line to be executed',
      },
      {
        label: '$iCreationFlags',
        documentation: 'The flags that control how the process is created',
      },
      {
        label: '$sCurDir',
        documentation: 'The full path to the current directory for the process',
      },
      {
        label: '$tSTARTUPINFO',
        documentation: 'A (pointer to a) STARTUPINFO structure',
      },
      {
        label: '$tPROCESS_INFORMATION',
        documentation:
          'A (pointer to a) PROCESS_INFORMATION structure that receives identification information for the new process',
      },
    ],
  },
  _Security__DuplicateTokenEx: {
    documentation: 'Creates a new access token that duplicates an existing token',
    label:
      '_Security__DuplicateTokenEx ( $hExistingToken, $iDesiredAccess, $iImpersonationLevel, $iTokenType )',
    params: [
      {
        label: '$hExistingToken',
        documentation: 'A handle to an access token opened with TOKEN_DUPLICATE access',
      },
      {
        label: '$iDesiredAccess',
        documentation: 'The requested access rights for the new token',
      },
      {
        label: '$iImpersonationLevel',
        documentation: 'The impersonation level of the new token',
      },
      {
        label: '$iTokenType',
        documentation: 'The type of new token',
      },
    ],
  },
  _Security__GetAccountSid: {
    documentation: 'Retrieves the security identifier (SID) for an account',
    label: '_Security__GetAccountSid ( $sAccount [, $sSystem = ""] )',
    params: [
      {
        label: '$sAccount',
        documentation:
          'Specifies the account name.Use a fully qualified string in the domain_name\\user_name format to ensure that the function finds the account in the desired domain.',
      },
      {
        label: '$sSystem',
        documentation:
          '**[optional]** Name of the system. This string can be the name of a remote computer.If this string is blank, the account name translation begins on the local system.If the name cannot be resolved on the local system, this function will try to resolve the name using domain controllers trusted by the local system.',
      },
    ],
  },
  _Security__GetLengthSid: {
    documentation: 'Returns the length, in bytes, of a valid SID',
    label: '_Security__GetLengthSid ( $pSID )',
    params: [
      {
        label: '$pSID',
        documentation: 'Pointer to a SID',
      },
    ],
  },
  _Security__GetTokenInformation: {
    documentation: 'Retrieves a specified type of information about an access token',
    label: '_Security__GetTokenInformation ( $hToken, $iClass )',
    params: [
      {
        label: '$hToken',
        documentation:
          'A handle to an access token from which information is retrieved.If $iClass specifies $sTokenSource, the handle must have $TOKEN_QUERY_SOURCE access.For all other $iClass values, the handle must have $TOKEN_QUERY access.',
      },
      {
        label: '$iClass',
        documentation:
          'Specifies a value to identify the type of information the function retrieves',
      },
    ],
  },
  _Security__ImpersonateSelf: {
    documentation: 'Obtains an access token that impersonates the calling process security context',
    label: '_Security__ImpersonateSelf ( [$iLevel = $SECURITYIMPERSONATION] )',
    params: [
      {
        label: '$iLevel',
        documentation:
          "**[optional]** Impersonation level of the new token:    $SECURITYANONYMOUS. The server process cannot obtain identification information about the client, and it cannot impersonate the client.    $SECURITYIDENTIFICATION. The server process can obtain information about the client, such as security identifiers and privileges, but it cannot impersonate the client.    $SECURITYIMPERSONATION. The server process can impersonate the clients security context on its local system. The server cannot impersonate the client on remote systems.    $SECURITYDELEGATION. The server process can impersonate the client's security context on remote systems.",
      },
    ],
  },
  _Security__IsValidSid: {
    documentation: 'Validates a SID',
    label: '_Security__IsValidSid ( $pSID )',
    params: [
      {
        label: '$pSID',
        documentation: 'Pointer to a SID',
      },
    ],
  },
  _Security__LookupAccountName: {
    documentation:
      'Retrieves a security identifier (SID) for the account and the name of the domain',
    label: '_Security__LookupAccountName ( $sAccount [, $sSystem = ""] )',
    params: [
      {
        label: '$sAccount',
        documentation:
          'Specifies the account name.Use a fully qualified string in the domain_name\\user_name format to ensure that the function finds the account in the desired domain.',
      },
      {
        label: '$sSystem',
        documentation:
          '**[optional]** Name of the system.This string can be the name of a remote computer.If this string is blank, the account name translation begins on the local system.If the name cannot be resolved on the local system, this function will try to resolve the name using domain controllers trusted by the local system.',
      },
    ],
  },
  _Security__LookupAccountSid: {
    documentation: 'Retrieves the name of the account for a SID',
    label: '_Security__LookupAccountSid ( $vSID [, $sSystem = ""] )',
    params: [
      {
        label: '$vSID',
        documentation: 'Either a binary SID or a string SID',
      },
      {
        label: '$sSystem',
        documentation: '**[optional]** The name of a remote computer. By default the local system.',
      },
    ],
  },
  _Security__LookupPrivilegeValue: {
    documentation:
      'Retrieves the locally unique identifier (LUID) for a privilege value in form of 64bit integer',
    label: '_Security__LookupPrivilegeValue ( $sSystem, $sName )',
    params: [
      {
        label: '$sSystem',
        documentation:
          'Specifies the name of the system on which the privilege name is retrieved.If blank, the function attempts to find the privilege name on the local system.',
      },
      {
        label: '$sName',
        documentation: 'Specifies the name of the privilege.',
      },
    ],
  },
  _Security__OpenProcessToken: {
    documentation: 'Returns the access token associated with a process',
    label: '_Security__OpenProcessToken ( $hProcess, $iAccess )',
    params: [
      {
        label: '$hProcess',
        documentation:
          'A handle to the process whose access token is opened.The process must have been given the $PROCESS_QUERY_INFORMATION access permission.',
      },
      {
        label: '$iAccess',
        documentation:
          'Specifies an access mask that specifies the requested types of access to the access token.',
      },
    ],
  },
  _Security__OpenThreadToken: {
    documentation: 'Opens the access token associated with a thread',
    label: '_Security__OpenThreadToken ( $iAccess [, $hThread = 0 [, $bOpenAsSelf = False]] )',
    params: [
      {
        label: '$iAccess',
        documentation:
          "Access mask that specifies the requested types of access to the access token.These requested access types are reconciled against the token's discretionary access control list (DACL) to determine which accesses are granted or denied.",
      },
      {
        label: '$hThread',
        documentation: '**[optional]** Handle to the thread whose access token is opened',
      },
      {
        label: '$bOpenAsSelf',
        documentation:
          '**[optional]** Indicates whether the access check is to be made against the security context of the thread calling the OpenThreadToken function or against the security context of the process for the calling thread.If this parameter is False, the access check is performed using the security context for the calling thread.If the thread is impersonating a client, this security context can be that of a client process.If this parameter is True, the access check is made using the security context of the process for the calling thread.',
      },
    ],
  },
  _Security__OpenThreadTokenEx: {
    documentation:
      "Opens the access token associated with a thread, impersonating the client's security context if required",
    label: '_Security__OpenThreadTokenEx ( $iAccess [, $hThread = 0 [, $bOpenAsSelf = False]] )',
    params: [
      {
        label: '$iAccess',
        documentation:
          "Access mask that specifies the requested types of access to the access token.These requested access types are reconciled against the token's discretionary access control list (DACL) to determine which accesses are granted or denied.",
      },
      {
        label: '$hThread',
        documentation: '**[optional]** Handle to the thread whose access token is opened',
      },
      {
        label: '$bOpenAsSelf',
        documentation:
          '**[optional]** Indicates whether the access check is to be made against the security context of the thread calling the OpenThreadToken function or against the security context of the process for the calling thread.If this parameter is False, the access check is performed using the security context for the calling thread.If the thread is impersonating a client, this security context can be that of a client process.If this parameter is True, the access check is made using the security context of the process for the calling thread.',
      },
    ],
  },
  _Security__SetPrivilege: {
    documentation: 'Enables or disables a local token privilege',
    label: '_Security__SetPrivilege ( $hToken, $sPrivilege, $bEnable )',
    params: [
      {
        label: '$hToken',
        documentation: 'Handle to a token',
      },
      {
        label: '$sPrivilege',
        documentation: 'Privilege name',
      },
      {
        label: '$bEnable',
        documentation: 'Privilege setting:    True - Enable privilege    False - Disable privilege',
      },
    ],
  },
  _Security__SetTokenInformation: {
    documentation: 'Sets various types of information for a specified access token',
    label:
      '_Security__SetTokenInformation ( $hToken, $iTokenInformation, $vTokenInformation, $iTokenInformationLength )',
    params: [
      {
        label: '$hToken',
        documentation: 'A handle to the access token for which information is to be set',
      },
      {
        label: '$iTokenInformation',
        documentation: 'The type of information the function sets',
      },
      {
        label: '$vTokenInformation',
        documentation:
          'A (pointer to a) structure that contains the information set in the access token',
      },
      {
        label: '$iTokenInformationLength',
        documentation: 'The length, in bytes, of the buffer pointed to by $vTokenInformation',
      },
    ],
  },
  _Security__SidToStringSid: {
    documentation: 'Converts a binary SID to a string',
    label: '_Security__SidToStringSid ( $pSID )',
    params: [
      {
        label: '$pSID',
        documentation: 'Pointer to a binary SID to be converted',
      },
    ],
  },
  _Security__SidTypeStr: {
    documentation: 'Converts a SID type to string form',
    label: '_Security__SidTypeStr ( $iType )',
    params: [
      {
        label: '$iType',
        documentation: 'SID type',
      },
    ],
  },
  _Security__StringSidToSid: {
    documentation: 'Converts a String SID to a binary SID',
    label: '_Security__StringSidToSid ( $sSID )',
    params: [
      {
        label: '$sSID',
        documentation: 'String SID to be converted',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
