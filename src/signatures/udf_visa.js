import { CompletionItemKind } from 'vscode';
import { signatureToCompletion, signatureToHover } from '../util';

const include = '(Requires: `#include <Visa.au3>`)';

const signatures = {
  _viClose: {
    documentation: `Closes a VISA connection to an Instrument/Device\n\n${include}`,
    label: '_viClose ( $hSession )',
    params: [{ label: '$hSession', documentation: 'VISA session handle' }],
  },

  _viExecCommand: {
    documentation: `Send a Command/Query to an Instrument/Device through the VISA interface (GPIB / TCP)\n\n${include}`,
    label: '_viExecCommand ( $hSession, $sCommand [, $iTimeoutMS = -1 [, $sMode = @LF]] )',
    params: [
      { label: '$hSession', documentation: 'VISA session handle' },
      { label: '$sCommand', documentation: 'Command/Query string to send' },
      {
        label: '$iTimeoutMS',
        documentation: '**[optional]** Timeout in milliseconds (default: -1)',
      },
      { label: '$sMode', documentation: '**[optional]** Line termination mode (default: @LF)' },
    ],
  },

  _viFindGpib: {
    documentation: `Send a Command/Query to an Instrument/Device through the VISA interface (GPIB / TCP)\n\n${include}`,
    label: '_viFindGpib ( ByRef $aDescriptorList, ByRef $aIDNList [, $iShow_Search_Results = 0] )',
    params: [
      { label: '$aDescriptorList', documentation: 'Array to receive descriptor list' },
      { label: '$aIDNList', documentation: 'Array to receive IDN list' },
      {
        label: '$iShow_Search_Results',
        documentation: '**[optional]** Show search results (default: 0)',
      },
    ],
  },

  _viGpibBusReset: {
    documentation: `GPIB BUS "reset": Use this function when the GPIB BUS gets stuck for some reason. You might be lucky and resolve the problem by calling this function\n\n${include}`,
    label: '_viGpibBusReset ( )',
    params: [],
  },

  _viGTL: {
    documentation: `Go To Local mode: Instruments that accept this command will exit the "Remote Control mode" and go to "Local mode". If the instrument is already in "Local mode" this is simply ignored. Normally, if an instrument does not support this command it will simply stay in the "Remote Control mode"\n\n${include}`,
    label: '_viGTL ( $hSession )',
    params: [{ label: '$hSession', documentation: 'VISA session handle' }],
  },

  _viInteractiveControl: {
    documentation: `Interactive VISA control to test your SCPI commands\n\n${include}`,
    label: '_viInteractiveControl ( [$sCommand_Save_FilePath = ""] )',
    params: [
      {
        label: '$sCommand_Save_FilePath',
        documentation: '**[optional]** File path to save commands (default: "")',
      },
    ],
  },

  _viOpen: {
    documentation: `Opens a VISA connection to an Instrument/Device\n\n${include}`,
    label: '_viOpen ( $sVisa_Address [, $sVisa_Secondary_Address = 0] )',
    params: [
      { label: '$sVisa_Address', documentation: 'VISA address string' },
      {
        label: '$sVisa_Secondary_Address',
        documentation: '**[optional]** Secondary VISA address (default: 0)',
      },
    ],
  },

  _viSetAttribute: {
    documentation: `Set any VISA attribute This function, which is called by _viSetTimeout, can ALSO be used to set the other VISA specific attributes. Read the VISA documentation for more information and a list of VISA attributes and their corresponding values\n\n${include}`,
    label: '_viSetAttribute ( $hSession, $iAttribute, $iValue )',
    params: [
      { label: '$hSession', documentation: 'VISA session handle' },
      { label: '$iAttribute', documentation: 'VISA attribute to set' },
      { label: '$iValue', documentation: 'Value to set for the attribute' },
    ],
  },

  _viSetTimeout: {
    documentation: `Sets the VISA timeout in MILISECONDS\n\n${include}`,
    label: '_viSetTimeout ( $hSession, $iTimeoutMS )',
    params: [
      { label: '$hSession', documentation: 'VISA session handle' },
      { label: '$iTimeoutMS', documentation: 'Timeout value in milliseconds' },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
