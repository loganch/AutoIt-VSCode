import { CompletionItemKind } from 'vscode';
import {
  br,
  valueFirstHeader as header,
  opt,
  signatureToCompletion,
  signatureToHover,
} from '../util';

const include = '(Requires: `#include <Inet.au3>`)';

const signatures = {
  _GetIP: {
    documentation: 'Get public IP address of a network/computer',
    label: '_GetIP (  )',
    params: [],
  },
  _INetExplorerCapable: {
    documentation: 'Converts a string to IE(Internet Explorer) capable line',
    label: '_INetExplorerCapable ( $sIEString )',
    params: [
      {
        label: '$sIEString',
        documentation: 'String to be converted',
      },
    ],
  },
  _INetGetSource: {
    documentation: 'Gets the source from an URL without writing a temp file',
    label: '_INetGetSource ( $sURL [, $bString = True] )',
    params: [
      {
        label: '$sURL',
        documentation: "(The URL of the site.) eg 'http://www.autoitscript.com'",
      },
      {
        label: '$bString',
        documentation:
          '**[optional]** If True the data is returned in string format, otherwise binary format.',
      },
    ],
  },
  _INetMail: {
    documentation: "Opens default user's mail client with given address, subject, and body",
    label: '_INetMail ( $sMailTo, $sMailSubject, $sMailBody )',
    params: [
      {
        label: '$sMailTo',
        documentation: 'Address for the E-Mail',
      },
      {
        label: '$sMailSubject',
        documentation: 'Subject for the E-Mail',
      },
      {
        label: '$sMailBody',
        documentation: 'Body for the E-Mail',
      },
    ],
  },
  _INetSmtpMail: {
    documentation: 'Sends an email without using an external email program',
    label:
      '_INetSmtpMail ( $sSMTPServer, $sFromName, $sFromAddress, $sToAddress [, $sSubject = "" [, $aBody = "" [, $sEHLO = "" [, $sFirst = "" [, $bTrace = 0]]]]] )',
    params: [
      {
        label: '$sSMTPServer',
        documentation:
          'Smtp server the eMail is to be sent though May be either alpha or a numeric IP address. In order to fight spam, many ISPs require this to be their server.eg "smtp.ispdomain.com", "mail.ispdomain.com" or "192.168.1.1"',
      },
      {
        label: '$sFromName',
        documentation: 'The name you wish the message to appear to be sent from.eg "Bob Smith"',
      },
      {
        label: '$sFromAddress',
        documentation:
          'The email address you wish the message to appear to be sent from.eg "bob.smith@mydomain.com".',
      },
      {
        label: '$sToAddress',
        documentation: 'The email address the message is to go to.eg "jane.brown@yourdomain.com"',
      },
      {
        label: '$sSubject',
        documentation: '**[optional]** The subject of the email.',
      },
      {
        label: '$aBody',
        documentation:
          '**[optional]** The body of the email as a single dimensional array of strings. Each value in the array will be terminated with a @CRLF in the email.',
      },
      {
        label: '$sEHLO',
        documentation:
          '**[optional]** identifier for the smtp server connection (by default @ComputerName). If Smtp server require a "EHLO" string just set the string to "EHLO " & @ComputerName.',
      },
      {
        label: '$sFirst',
        documentation:
          '**[optional]** string sent before helo for the smtp server connection (by default {SPACE}). To not send any character this parameter must equal -1, some SMTP server required it.',
      },
      {
        label: '$bTrace',
        documentation: '**[optional]** trace the dialog in a splash window',
      },
    ],
  },
  _TCPIpToName: {
    documentation: 'Resolves IP address to Hostname(s)',
    label: '_TCPIpToName ( $sIp [, $iOption = 0 [, $hDll = "Ws2_32.dll"]] )',
    params: [
      {
        label: '$sIp',
        documentation: 'Ip Adress in dotted (v4) Format',
      },
      {
        label: '$iOption',
        documentation:
          '**[optional]** Default = 00 = Return String Hostname1 = Return Array (see Remarks)',
      },
      {
        label: '$hDll',
        documentation: '**[optional]** Handle to Ws2_32.dll',
      },
    ],
  },
};

const hovers = signatureToHover(signatures);
const completions = signatureToCompletion(signatures, CompletionItemKind.Function, include);

export { signatures as default, hovers, completions };
