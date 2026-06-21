import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const InetConstants = [
  {
    label: '$INET_LOCALCACHE',
    documentation: '(0) = Get the file from local cache if available (default).',
  },
  {
    label: '$INET_FORCERELOAD',
    documentation: '(1) = Forces a reload from the remote site.',
  },
  {
    label: '$INET_IGNORESSL',
    documentation: '(2) = Ignore all SSL errors (with HTTPS connections).',
  },
  {
    label: '$INET_ASCIITRANSFER',
    documentation:
      'Use ASCII when transferring files with the FTP protocol (Can not be combined with flag `$INET_BINARYTRANSFER` (8)).',
  },
  {
    label: '$INET_BINARYTRANSFER',
    documentation:
      '(8) = Use BINARY when transferring files with the FTP protocol (Can not be combined with flag `$INET_ASCIITRANSFER` (4)). This is the default transfer mode if none are provided.',
  },
  {
    label: '$INET_FORCEBYPASS',
    documentation: '(16) = By-pass forcing the connection online (See remarks).',
  },
  {
    label: '$INET_DOWNLOADWAIT',
    documentation: '(0) = Wait until the download is complete before continuing (default).',
  },
  {
    label: '$INET_DOWNLOADBACKGROUND',
    documentation: '(1) = return immediately and download in the background (see remarks).',
  },
  {
    label: '$INET_DOWNLOADREAD',
    documentation: '0',
  },
  {
    label: '$INET_DOWNLOADSIZE',
    documentation: '1',
  },
  {
    label: '$INET_DOWNLOADCOMPLETE',
    documentation: '2',
  },
  {
    label: '$INET_DOWNLOADSUCCESS',
    documentation: '3',
  },
  {
    label: '$INET_DOWNLOADERROR',
    documentation: '4',
  },
  {
    label: '$INET_DOWNLOADEXTENDED',
    documentation: '5',
  },
];

const items = fillCompletions(
  InetConstants,
  CompletionItemKind.Constant,
  'InetGet Constant',
  'InetConstants.au3',
);
const hovers = completionToHover(items);

export { items as default, hovers };
