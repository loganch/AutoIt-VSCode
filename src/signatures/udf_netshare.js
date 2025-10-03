import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <NetShare.au3>`)';

const signatures = {
  _Net_Share_ConnectionEnum: {
    documentation: 'Lists all connections made to a shared resource',
    label: '_Net_Share_ConnectionEnum ( $sServer, $sQualifier )',
    params: [
      {
        label: '$sServer',
        documentation:
          'String that specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank the local computer is used.',
      },
      {
        label: '$sQualifier',
        documentation:
          'Specifies a share name or computer name of interest.If it is a share name, then all of the connections made to that share name are listed.If it is a computer name, the function lists all connections made from that computer to the server specified.',
      },
    ],
  },
  _Net_Share_FileClose: {
    documentation: 'Forces a resource to close',
    label: '_Net_Share_FileClose ( $sServer, $iFileID )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$iFileID',
        documentation: 'Specifies the file identifier of the opened resource instance to close',
      },
    ],
  },
  _Net_Share_FileEnum: {
    documentation: 'Returns information about open files on a server',
    label: '_Net_Share_FileEnum ( [$sServer = "" [, $sBaseName = "" [, $sUserName = ""]]] )',
    params: [
      {
        label: '$sServer',
        documentation:
          '**[optional]** String that contains the name of the server on which the function is to execute.A blank specifies the local computer.',
      },
      {
        label: '$sBaseName',
        documentation:
          '**[optional]** String containing a qualifier for the returned information.If blank all open resources are enumerated.If not blank, the function enumerates only resources that have $sBaseName as a prefix.',
      },
      {
        label: '$sUserName',
        documentation:
          '**[optional]** String that specifies the name of the user.If not blank $sUserName serves as a qualifier to the enumeration.',
      },
    ],
  },
  _Net_Share_FileGetInfo: {
    documentation: 'Retrieves information about a particular opening of a server resource',
    label: '_Net_Share_FileGetInfo ( $sServer, $iFileID )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$iFileID',
        documentation:
          'File identifier of the resource for which to return information.The value of this parameter must have been returned in a previous enumeration call.',
      },
    ],
  },
  _Net_Share_PermStr: {
    documentation: "Returns the string representation of a resource's permissions",
    label: '_Net_Share_PermStr ( $iPerm )',
    params: [
      {
        label: '$iPerm',
        documentation:
          "The resource's permissions:    1 - Permission to read data from a resource and to execute    2 - Permission to write data to the resource    4 - Permission to create an instance of the resource    8 - Permission to execute the resource    16 - Permission to delete the resource    32 - Permission to modify the resource's attributes    64 - Permission to modify the permissions assigned to a resource",
      },
    ],
  },
  _Net_Share_ResourceStr: {
    documentation: 'Returns the string representation of a resource',
    label: '_Net_Share_ResourceStr ( $iResource )',
    params: [
      {
        label: '$iResource',
        documentation:
          'Resource type. Can be a combination of:    $STYPE_DISKTREE - Print queue    $STYPE_PRINTQ - Disk drive    $STYPE_DEVICE - Communication device    $STYPE_IPC - IPC    $STYPE_SPECIAL - Special share reserved for IPC$ or remote administration of the server    $STYPE_TEMPORARY - A temporary share',
      },
    ],
  },
  _Net_Share_SessionDel: {
    documentation: 'Ends a network session between a server and a workstation',
    label: '_Net_Share_SessionDel ( [$sServer = "" [, $sClientName = "" [, $sUserName = ""]]] )',
    params: [
      {
        label: '$sServer',
        documentation:
          '**[optional]** Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$sClientName',
        documentation:
          '**[optional]** Specifies the computer name of the client to disconnect.If blank, then all the sessions of the user identified by the username parameter will be deleted on the server specified by $sServer.',
      },
      {
        label: '$sUserName',
        documentation:
          '**[optional]** Specifies the name of the user whose session is to be terminated.If this parameter is blank, all user sessions from the client specified by the $sClientName parameter are to be terminated.',
      },
    ],
  },
  _Net_Share_SessionEnum: {
    documentation: 'Provides information about sessions established on a server',
    label: '_Net_Share_SessionEnum ( [$sServer = "" [, $sClientName = "" [, $sUserName = ""]]] )',
    params: [
      {
        label: '$sServer',
        documentation:
          '**[optional]** String that specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank the local computer is used.',
      },
      {
        label: '$sClientName',
        documentation:
          '**[optional]** Specifies the name of the computer session for which information is to be returned.If this parameter is blank, the function returns information for all computer sessions on the server.',
      },
      {
        label: '$sUserName',
        documentation:
          '**[optional]** Specifies the name of the user for which information is to be returned.If this parameter is blank, the function returns information for all users.',
      },
    ],
  },
  _Net_Share_SessionGetInfo: {
    documentation:
      'Retrieves information about a session established between a server and workstation',
    label: '_Net_Share_SessionGetInfo ( $sServer, $sClientName, $sUserName )',
    params: [
      {
        label: '$sServer',
        documentation:
          'String that specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank the local computer is used.',
      },
      {
        label: '$sClientName',
        documentation:
          'Specifies the name of the computer session for which information is to be returned.This parameter cannot be blank.',
      },
      {
        label: '$sUserName',
        documentation:
          'String that specifies the name of the user whose session information is to be returned.This parameter cannot be blank.',
      },
    ],
  },
  _Net_Share_ShareAdd: {
    documentation: 'Shares a server resource',
    label:
      '_Net_Share_ShareAdd ( $sServer, $sShare, $iType, $sResourcePath [, $sComment = "" [, $iMaxUses = -1]] )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$sShare',
        documentation: 'Share name of a resource',
      },
      {
        label: '$iType',
        documentation:
          'Contains the type of the shared resource. Can be a combination of:    $STYPE_DISKTREE - Disk drive    $STYPE_PRINTQ - Print queue    $STYPE_DEVICE - Communication device    $STYPE_IPC - IPC    $STYPE_SPECIAL - Special share reserved for IPC$ or remote administration of the server    $STYPE_TEMPORARY - A temporary share',
      },
      {
        label: '$sResourcePath',
        documentation:
          'Local path for the shared resource. For disks, this is the path being shared.For print queues, this is the name of the print queue being shared.',
      },
      {
        label: '$sComment',
        documentation: '**[optional]** String that contains an comment about the shared resource',
      },
      {
        label: '$iMaxUses',
        documentation:
          '**[optional]** The maximum number of concurrent connections that the shared resource can accommodate.The number of connections is unlimited if the value specified is –1.',
      },
    ],
  },
  _Net_Share_ShareCheck: {
    documentation: 'Checks whether or not a server is sharing a device',
    label: '_Net_Share_ShareCheck ( $sServer, $sShare )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$sShare',
        documentation: 'Specifies the name of the device to check for shared access',
      },
    ],
  },
  _Net_Share_ShareDel: {
    documentation: "Deletes a share name from a server's list of shared resources",
    label: '_Net_Share_ShareDel ( $sServer, $sShare )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$sShare',
        documentation: 'Specifies the name of the share to delete',
      },
    ],
  },
  _Net_Share_ShareEnum: {
    documentation: 'Retrieves information about each shared resource on a server',
    label: '_Net_Share_ShareEnum ( [$sServer = ""] )',
    params: [
      {
        label: '$sServer',
        documentation:
          '**[optional]** String that specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank the local computer is used.',
      },
    ],
  },
  _Net_Share_ShareGetInfo: {
    documentation: 'Retrieves information about a particular shared resource on a server',
    label: '_Net_Share_ShareGetInfo ( $sServer, $sShare )',
    params: [
      {
        label: '$sServer',
        documentation:
          'String that specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank the local computer is used.',
      },
      {
        label: '$sShare',
        documentation: 'Name of the share for which to return information',
      },
    ],
  },
  _Net_Share_ShareSetInfo: {
    documentation: 'Shares a server resource',
    label: '_Net_Share_ShareSetInfo ( $sServer, $sShare, $sComment, $iMaxUses )',
    params: [
      {
        label: '$sServer',
        documentation:
          'Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
      {
        label: '$sShare',
        documentation: 'Specifies the name of the share to set information on',
      },
      {
        label: '$sComment',
        documentation: 'String that contains an optional comment about the shared resource',
      },
      {
        label: '$iMaxUses',
        documentation:
          'Indicates the maximum number of connections that the resource can accommodate.The number of connections is unlimited if this value is –1.',
      },
    ],
  },
  _Net_Share_StatisticsGetSvr: {
    documentation: 'Retrieves operating statistics for a server',
    label: '_Net_Share_StatisticsGetSvr ( [$sServer = ""] )',
    params: [
      {
        label: '$sServer',
        documentation:
          '**[optional]** Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
    ],
  },
  _Net_Share_StatisticsGetWrk: {
    documentation: 'Retrieves operating statistics for a workstation',
    label: '_Net_Share_StatisticsGetWrk ( [$sWorkStation = ""] )',
    params: [
      {
        label: '$sWorkStation',
        documentation:
          '**[optional]** Specifies the DNS or NetBIOS name of the remote server on which the function is to execute.If this parameter is blank, the local computer is used.',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
