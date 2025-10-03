import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <WinNet.au3>`)';

const iOptionsParam = {
  label: '[$iOptions]',
  documentation: `${opt} Connection options. Can be one or more of the following:
                ${header}
                \`1\`|-|The network resource connection should be remembered
                \`2\`|-|The operating system may interact with the user for authentication purposes
                \`4\`|-|The system not to use any default setting for user names or passwords without offering the user the opportunity to supply an alternative. This flag is ignored unless bit 2 (interactive) is also set.
                \`8\`|-|Forces the redirection of a local device when making the connection
                \`16\`|-|The operating system prompts the user for authentication using the command line instead of a GUI. This flag is ignored unless bit 2 (interactive) is also set.
                \`32\`|-|If this bit is set, and the operating system prompts for a credential, the credential is saved by the credential manager. If the credential manager is disabled for the caller's logon session, or if the network provider does not support saving credentials, this flag is ignored. This flag is also ignored unless you setbit 5 (command line instead of GUI).`,
};

const signatures = {
  _WinNet_AddConnection: {
    documentation: `Connects a local device to a network resource ${include}`,
    label: '_WinNet_AddConnection ( $sLocalName, $sRemoteName, [$sPassword] )',
    params: [
      {
        label: '$sLocalName',
        documentation: `Name of a local device to be redirected, such as "F:" or "LPT1".${br}
                The string is treated in a case-insensitive manner.${br}
                If the \`Null\` keyword or an empty, a connection to the network resource is made without redirecting the local device.`,
      },
      {
        label: '$sRemoteName',
        documentation: 'Name of the network resource to connect to',
      },
      {
        label: '[$sPassword]',
        documentation: `${opt} Password to be used to make a connection.${br}
                This parameter is usually the password associated with the current user.${br}
                If \`0\`, the default password is used.${br}
                If the string is empty, no password is used.`,
      },
    ],
  },
  _WinNet_AddConnection2: {
    documentation: `Connects a local device to a network resource ${include}`,
    label:
      '_WinNet_AddConnection2 ( $sLocalName, $sRemoteName, [$sUserName], [$sPassword], [$iType], [$iOptions] )',
    params: [
      {
        label: '$sLocalName',
        documentation: `Name of a local device to be redirected, such as "F:" or "LPT1".${br}
                The string is treated in a case-insensitive manner.${br}
                If the \`Null\` keyword or an empty, a connection to the network resource is made without redirecting the local device.`,
      },
      {
        label: '$sRemoteName',
        documentation: 'Name of the network resource to connect to',
      },
      {
        label: '[$sUserName]',
        documentation: `${opt} User name for making the connection. If \`0\`, the function uses the default user name.`,
      },
      {
        label: '[$sPassword]',
        documentation: `${opt} Password to be used to make a connection. If \`0\`, the default password is used. If the string is empty, no password is used.`,
      },
      {
        label: '[$iType]',
        documentation: `${opt} Specifies the type of network resource to connect to:
                ${header}
                \`0\`|-|Any (only if \`$sLocalName\` is \`0\`)
                \`1\`|-|Disk
                \`2\`|-|Print`,
      },
      iOptionsParam,
    ],
  },
  _WinNet_AddConnection3: {
    documentation: `Connects a local device to a network resource ${include}`,
    label:
      '_WinNet_AddConnection3 ( $hWnd, $sLocalName, $sRemoteName, [$sUserName], [$sPassword], [$iType], [$iOptions] )',
    params: [
      {
        label: '$hWnd',
        documentation:
          'Handle to a window that the provider of network resources can use as an owner window for dialogs. Use this parameter if you set bit 2 (interactive) in the Options parameter. This parameter can be `0`.',
      },
      {
        label: '$sLocalName',
        documentation:
          'Name of a local device to be redirected, such as "F:" or "LPT1". The string is treated in a case-insensitive manner. If the `Null` keyword or an empty, a connection to the network resource is made without redirecting the local device.',
      },
      {
        label: '$sRemoteName',
        documentation: 'Name of the network resource to connect to',
      },
      {
        label: '[$sUserName]',
        documentation: `${opt} User name for making the connection. If \`0\`, the function uses the default user name.`,
      },
      {
        label: '[$sPassword]',
        documentation: `${opt} Password to be used to make a connection. If \`0\`, the default password is used. If the string is empty, no password is used.`,
      },
      {
        label: '[$iType]',
        documentation: `${opt} Specifies the type of network resource to connect to:
                ${header}
                \`0\`|-|Any (only if \`$sLocalName\` is \`0\`)
                \`1\`|-|Disk
                \`2\`|-|Print`,
      },
      iOptionsParam,
    ],
  },
  _WinNet_CancelConnection: {
    documentation: `Cancels an existing network connection ${include}`,
    label: '_WinNet_CancelConnection ( $sName, [$bForce] )',
    params: [
      {
        label: '$sName',
        documentation: `Name of either the redirected local device or the remote network resource to disconnect from.${br}
                When this parameter specifies a redirected local device, the function cancels only the specified device redirection.${br}
                If the parameter specifies a remote network resource, only the connections to remote networks without devices are cancelled.`,
      },
      {
        label: '[$bForce]',
        documentation: `${opt} Specifies whether or not the disconnection should occur if there are open files or jobs on the connection.${br}
                If this parameter is \`False\`, the function fails if there are open files or jobs.`,
      },
    ],
  },
  _WinNet_CancelConnection2: {
    documentation: `Cancels an existing network connection ${include}`,
    label: '_WinNet_CancelConnection2 ( $sName, [$bUpdate], [$bForce] )',
    params: [
      {
        label: '$sName',
        documentation: `Name of either the redirected local device or the remote network resource to disconnect from.${br}
                When this parameter specifies a redirected local device, the function cancels only the specified device redirection.${br}
                If the parameter specifies a remote network resource, only the connections to remote networks without devices are cancelled.`,
      },
      {
        label: '[$bUpdate]',
        documentation: `${opt} If \`True\`, the users profile is updated with the information that the connection is no longer a persistent one.`,
      },
      {
        label: '[$bForce]',
        documentation: `${opt} Specifies whether or not the disconnection should occur if there are open files or jobs on the connection.${br}
                If this parameter is \`False\`, the function fails if there are open files or jobs.`,
      },
    ],
  },
  _WinNet_CloseEnum: {
    documentation: `Ends a network resource enumeration started by a call to \`_WinNet_OpenEnum()\` ${include}`,
    label: '_WinNet_CloseEnum ( $hEnum )',
    params: [
      {
        label: '$hEnum',
        documentation:
          'Handle that identifies an enumeration instance. The handle is returned by the `_WinNet_OpenEnum()` function',
      },
    ],
  },
  _WinNet_ConnectionDialog: {
    documentation: `Starts a general browsing dialog box for connecting to network resources ${include}`,
    label: '_WinNet_ConnectionDialog ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the owner window for the dialog box',
      },
    ],
  },
  _WinNet_ConnectionDialog1: {
    documentation: `Starts a general browsing dialog box for connecting to network resources ${include}`,
    label: '_WinNet_ConnectionDialog1 ( $hWnd, [$sRemoteName], [$iFlags] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the owner window for the dialog box',
      },
      {
        label: '$sRemoteName',
        documentation: `${opt} Name of the network resource to connect to`,
      },
      {
        label: '$iFlags',
        documentation: `${opt} Dialog box options. Can be one or more of the following:
                ${header}
                |\`1\`|-|Display a read-only path instead of allowing the user to type in a path
                \`2\`|-|Enter the most recently used paths into the combination box
                \`4\`|-|Do not show the restore the connection at logon checkbox
                \`8\`|-|Restore the connection at logon
                \`16\`|-|Do not restore the connection at logon`,
      },
    ],
  },
  _WinNet_DisconnectDialog: {
    documentation: `Starts a general browsing dialog box for disconnecting from network resources ${include}`,
    label: '_WinNet_DisconnectDialog ( $hWnd )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the owner window for the dialog box',
      },
    ],
  },
  _WinNet_DisconnectDialog1: {
    documentation: `Starts a general browsing dialog box for disconnecting from network resources ${include}`,
    label: '_WinNet_DisconnectDialog1 ( $hWnd, $sLocalName, [$sRemoteName], [$iFlags] )',
    params: [
      {
        label: '$hWnd',
        documentation: 'Handle to the owner window for the dialog box',
      },
      {
        label: '$sLocalName',
        documentation: 'Name of a local device, such as "F:" or "LPT1"',
      },
      {
        label: '[$sRemoteName]',
        documentation: `${opt} Name of the network resource to disconnect. This member can be \`0\` if \`$LocalName\` is specified.${br}
                When \`$sLocalName\` is specified, the connection to the network resource redirected from \`$sLocalName\` is disconnected.`,
      },
      {
        label: '[$iFlags]',
        documentation: `${opt} Flags describing the connection. Can be a combination of:
                ${header}
                \`1\`|-|If this value is set, the specified connection is no longer a persistent one. This flag is valid only if \`$sLocalName\` specifies a local device.
                |  |
                \`2\`|-|If this value is NOT set, the system applies force when disconnecting`,
      },
    ],
  },
  _WinNet_EnumResource: {
    documentation: `Continues an enumeration of network resources ${include}`,
    label: '_WinNet_EnumResource ( $hEnum, ByRef $iCount, $pBuffer, ByRef $iBufSize )',
    params: [
      {
        label: '$hEnum',
        documentation:
          'Handle that identifies an enumeration instance. The handle is returned by the `_WinNet_OpenEnum()` function.',
      },
      {
        label: '$iCount',
        documentation: `Number of entries requested. If the number requested is \`–1\`, the function returns as many entries as possible.${br}
                If the function succeeds, on return the variable contains the number of entries actually read.`,
      },
      {
        label: '$pBuffer',
        documentation: `Pointer to the buffer that receives the enumeration results.${br}
                The results are returned as an array of \`$tagNETRESOURCE\` structures.${br}
                The buffer must be large enough to hold the structures plus the strings to which their members point.${br}
                The buffer is valid until the next call using the handle specified by \`$hEnum\`.${br}
                The order of \`$tagNETRESOURCE\` structures in the array is not predictable.`,
      },
      {
        label: '$iBufSize',
        documentation: `The size of the buffer, in bytes.${br}
                If the buffer is too small to receive even one entry, this parameter receives the required size of the buffer.`,
      },
    ],
  },
  _WinNet_GetConnection: {
    documentation: `Retrieves the name of the network resource associated with a local device ${include}`,
    label: '_WinNet_GetConnection ( $sLocalName )',
    params: [
      {
        label: '$sLocalName',
        documentation: 'The name of the local device to get the network name for',
      },
    ],
  },
  _WinNet_GetConnectionPerformance: {
    documentation: `Returns information about the performance of a network connection resource ${include}`,
    label: '_WinNet_GetConnectionPerformance ( $sLocalName, $sRemoteName )',
    params: [
      {
        label: '$sLocalName',
        documentation: `Name of a local device, such as "F:" or "LPT1", that is redirected to a network resource to be queried.${br}
                If blank, the network resource is specified in \`$sRemoteName\`.${br}
                If this parameter specifies a local device \`$sRemoteName\` is ignored.`,
      },
      {
        label: '$sRemoteName',
        documentation: `Name of the network resource to query.${br}
                The resource must currently have an established connection.${br}
                For example, if the resource is a file on a file server, then having the file open will ensure the connection.`,
      },
    ],
  },
  _WinNet_GetLastError: {
    documentation: `Retrieves the most recent extended error ${include}`,
    label: '_WinNet_GetLastError ( ByRef $iError, ByRef $sError, ByRef $sName )',
    params: [
      {
        label: '$iError',
        documentation: 'On return, contains the most recent extended error code',
      },
      {
        label: '$sError',
        documentation: 'On return, contains the most recent extended error code message',
      },
      {
        label: '$sName',
        documentation: 'On return, the network provider that raised the error',
      },
    ],
  },
  _WinNet_GetNetworkInformation: {
    documentation: `Returns extended information about a specific network provider ${include}`,
    label: '_WinNet_GetNetworkInformation ( $sName )',
    params: [
      {
        label: '$sName',
        documentation: 'The network provider for which information is required',
      },
    ],
  },
  _WinNet_GetProviderName: {
    documentation: `Obtains the provider name for a specific type of network ${include}`,
    label: '_WinNet_GetProviderName ( $iType )',
    params: [
      {
        label: '$iType',
        documentation: 'Network type that is unique to the network',
      },
    ],
  },
  _WinNet_GetResourceInformation: {
    documentation: `Identifies the network provider that owns the resource ${include}`,
    label: '_WinNet_GetResourceInformation ( $sRemoteName, [$sProvider], [$iType] )',
    params: [
      {
        label: '$sRemoteName',
        documentation: 'The remote path name of the resource',
      },
      {
        label: '[$sProvider]',
        documentation: `${opt} The name of the provider that owns the resource.${br}
                This member can be blank if the provider name is unknown.`,
      },
      {
        label: '[$iType]',
        documentation: `${opt} Type of resource.${br}
                This member can be \`0\` if it is not known.`,
      },
    ],
  },
  _WinNet_GetResourceParent: {
    documentation: `Returns the parent of a network resource in the network browse hierarchy ${include}`,
    label: '_WinNet_GetResourceParent ( $sRemoteName, $sProvider, [$iType] )',
    params: [
      {
        label: '$sRemoteName',
        documentation: 'The remote path name of the resource',
      },
      {
        label: '$sProvider',
        documentation: 'The name of the provider that owns the resource',
      },
      {
        label: '[$iType]',
        documentation: `${opt} Type of resource.${br}
                This member can be \`0\` if it is not known.`,
      },
    ],
  },
  _WinNet_GetUniversalName: {
    documentation: `Converts drived based path to universal form ${include}`,
    label: '_WinNet_GetUniversalName ( $sLocalPath )',
    params: [
      {
        label: '$sLocalPath',
        documentation: 'Drive based path for a network resource',
      },
    ],
  },
  _WinNet_GetUser: {
    documentation:
      'Retrieves the default user name, or the user name used to establish a connection',
    label: '_WinNet_GetUser ( $sName )',
    params: [
      {
        label: '$sName',
        documentation: `Either the name of a local device that has been redirected to a network resource, or the remote name of a network resource to which a connection has been made without redirecting a local device.${br}
                If blank, the system returns the name of the current user for the process.`,
      },
    ],
  },
  _WinNet_OpenEnum: {
    documentation: `Starts an enumeration of network resources or existing connections ${include}`,
    label: '_WinNet_OpenEnum ( $iScope, $iType, $iUsage, $tResource, ByRef $hEnum )',
    params: [
      {
        label: '$iScope',
        documentation: `Scope of the enumeration:${br}
                ${header}
                \`0\`|-|Enumerate all currently connected resources
                \`1\`|-|Enumerate all resources on the network
                \`2\`|-|Enumerate all remembered (persistent) connections
                \`3\`|-|Enumerate only resources in the network context of the caller`,
      },
      {
        label: '$iType',
        documentation: `Resource types:${br}
                ${header}
                \`0\`|-|All resources
                \`1\`|-|Disk resources
                \`2\`|-|Print resources`,
      },
      {
        label: '$iUsage',
        documentation: `Resource usage types:${br}
                ${header}
                \`0\`|-|All resources
                \`1\`|-|All connectable resources
                \`2\`|-|All container resources
                \`4\`|-|Forces the function to fail if the user is not authenticated`,
      },
      {
        label: '$tResource',
        documentation: `a \`$tagNETRESOURCE\` structure that specifies the container to enumerate or a pointer to it.${br}
                If \`$iScope\` is not \`1\`, this must be \`0\`. ${br}
                If \`0\`, the root of the network is assumed.`,
      },
      {
        label: '$hEnum',
        documentation: 'On return, a handle that can be used in calls to `_WinNet_EnumResource()`',
      },
    ],
  },
  _WinNet_RestoreConnection: {
    documentation: `Restores the connection to a network resource ${include}`,
    label: '_WinNet_RestoreConnection ( [$sDevice], [$hWnd], [$bUseUI] )',
    params: [
      {
        label: '[$sDevice]',
        documentation: `${opt} The local name of the drive to connect to, such as "Z:".${br}
                If blank, the function reconnects all persistent drives stored in the registry for the current user.`,
      },
      {
        label: '[$hWnd]',
        documentation: `${opt} Handle to the parent window that the function uses to display the user interface that prompts the user for a name and password when making the network connection.${br}
                If \`0\`, there is no owner window.`,
      },
      {
        label: '[$bUseUI]',
        documentation: `${opt} If \`True\`, display a username/password prompt to the caller`,
      },
    ],
  },
  _WinNet_UseConnection: {
    documentation: `Connects a local device to a network resource ${include}`,
    label:
      '_WinNet_UseConnection ( $hWnd, $sLocalName, $sRemoteName, [$sUserName], [$sPassword], [$iType], [$iOptions] )',
    params: [
      {
        label: '$hWnd',
        documentation: `Handle to a window that the provider of network resources can use as an owner window for dialogs.${br}
                Use this parameter if you set bit 2 (interactive) in the Options parameter.${br}
                This parameter can be \`0\`.`,
      },
      {
        label: '$sLocalName',
        documentation: `Name of a local device to be redirected, such as "F:" or "LPT1".${br}
                The string is treated in a case-insensitive manner.${br}
                If \`0\`, a connection to the network resource is made without redirecting the local device.`,
      },
      {
        label: '$sRemoteName',
        documentation: 'Name of the network resource to connect to',
      },
      {
        label: '[$sUserName]',
        documentation: `${opt} User name for making the connection.${br}
                If \`0\`, the function uses the default user name.`,
      },
      {
        label: '[$sPassword]',
        documentation: `${opt} Password to be used to make a connection.${br}
                If \`0\`, the default password is used. If the string is empty, no password is used.`,
      },
      {
        label: '[$iType]',
        documentation: `${opt} Specifies the type of network resource to connect to:
                ${header}
                \`0\`|-|Any (only if $sLocalName is blank)
                \`1\`|-|Disk
                \`2\`|-|Print`,
      },
      iOptionsParam,
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
