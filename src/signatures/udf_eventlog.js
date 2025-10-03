import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <EventLog.au3>`)';

const signatures = {
  _EventLog__Backup: {
    documentation: 'Saves the event log to a backup file',
    label: '_EventLog__Backup ( $hEventLog, $sFileName )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'Handle to the event log',
      },
      {
        label: '$sFileName',
        documentation: 'The name of the backup file',
      },
    ],
  },
  _EventLog__Clear: {
    documentation: 'Clears the event log',
    label: '_EventLog__Clear ( $hEventLog, $sFileName )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'Handle to the event log',
      },
      {
        label: '$sFileName',
        documentation:
          'The name of the backup file. If the name is blank, the current event log is not backed up.',
      },
    ],
  },
  _EventLog__Close: {
    documentation: 'Closes a read handle to the event log',
    label: '_EventLog__Close ( $hEventLog )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'Handle to the event log',
      },
    ],
  },
  _EventLog__Count: {
    documentation: 'Retrieves the number of records in the event log',
    label: '_EventLog__Count ( $hEventLog )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
    ],
  },
  _EventLog__DeregisterSource: {
    documentation: 'Closes a write handle to the event log',
    label: '_EventLog__DeregisterSource ( $hEventLog )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
    ],
  },
  _EventLog__Full: {
    documentation: 'Retrieves whether the event log is full',
    label: '_EventLog__Full ( $hEventLog )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
    ],
  },
  _EventLog__Notify: {
    documentation: 'Enables an application to receive event notifications',
    label: '_EventLog__Notify ( $hEventLog, $hEvent )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
      {
        label: '$hEvent',
        documentation: 'A handle to a manual-reset event object',
      },
    ],
  },
  _EventLog__Oldest: {
    documentation: 'Retrieves the absolute record number of the oldest record in the event log',
    label: '_EventLog__Oldest ( $hEventLog )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
    ],
  },
  _EventLog__Open: {
    documentation: 'Opens a handle to the event log',
    label: '_EventLog__Open ( $sServerName, $sSourceName )',
    params: [
      {
        label: '$sServerName',
        documentation:
          'The UNC name of the server on where the event log will be opened. If blank, the operation is performed on the local computer.',
      },
      {
        label: '$sSourceName',
        documentation: 'The name of the log',
      },
    ],
  },
  _EventLog__OpenBackup: {
    documentation: 'Opens a handle to a backup event log',
    label: '_EventLog__OpenBackup ( $sServerName, $sFileName )',
    params: [
      {
        label: '$sServerName',
        documentation:
          'The UNC name of the server on where the event log will be opened.If blank, the operation is performed on the local computer.',
      },
      {
        label: '$sFileName',
        documentation: 'The name of the backup file',
      },
    ],
  },
  _EventLog__Read: {
    documentation: 'Reads an entry from the event log',
    label: '_EventLog__Read ( $hEventLog [, $bRead = True [, $bForward = True [, $iOffset = 0]]] )',
    params: [
      {
        label: '$hEventLog',
        documentation: 'A handle to the event log',
      },
      {
        label: '$bRead',
        documentation:
          '**[optional]** If True, operation proceeds sequentially from the last call to this function using this handle.  \nIf False, the read will operation proceeds from the record specified by the `$iOffset` parameter.',
      },
      {
        label: '$bForward',
        documentation:
          '**[optional]** If True, the log is read in date order. If False, the log is read in reverse date order.',
      },
      {
        label: '$iOffset',
        documentation:
          '**[optional]** The number of the event record at which the read operation should start.  \nThis parameter is ignored if `$bRead` is True.',
      },
    ],
  },
  _EventLog__RegisterSource: {
    documentation: 'Retrieves a registered handle to the specified event log',
    label: '_EventLog__RegisterSource ( $sServerName, $sSourceName )',
    params: [
      {
        label: '$sServerName',
        documentation:
          'The UNC name of the server on where the event log will be opened. If blank, the operation is performed on the local computer.',
      },
      {
        label: '$sSourceName',
        documentation:
          'The name of the event source whose handle is to be retrieved. The source name must be a subkey of a log under the Eventlog registry key.',
      },
    ],
  },
  _EventLog__Report: {
    documentation: 'Writes an entry at the end of the specified event log',
    label:
      '_EventLog__Report ( $hEventLog, $iType, $iCategory, $iEventID, $sUserName, $sDesc, $aData )',
    params: [
      {
        label: '$hEventLog',
        documentation:
          'A handle to the event log. As of Windows XP SP2, this cannot be a handle to the Security log.',
      },
      {
        label: '$iType',
        documentation:
          'Event type. This can be one of the following values:  \n0 - Success event    \n1 - Error event    \n2 - Warning event    \n4 - Information event    \n8 - Success audit event    \n16 - Failue audit event',
      },
      {
        label: '$iCategory',
        documentation:
          'The event category. This is source specific information the category can have any value.',
      },
      {
        label: '$iEventID',
        documentation:
          'The event identifier. The event identifier specifies the entry in the message file associated with the event source.',
      },
      {
        label: '$sUserName',
        documentation:
          'User name for the event. This can be blank to indicate that no name is required.',
      },
      {
        label: '$sDesc',
        documentation: 'Event description',
      },
      {
        label: '$aData',
        documentation:
          'Data array formated as follows:    \n[0] - Number of bytes in array    \n[1] - Byte 1    \n[2] - Byte 2    \n[n] - Byte n',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
