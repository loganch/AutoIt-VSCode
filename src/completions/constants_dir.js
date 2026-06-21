import { CompletionItemKind } from 'vscode';
import { completionToHover, fillCompletions } from '../completionTransforms';

const items = [
  {
    label: '$DDL_ARCHIVE',
    documentation: 'Includes archived files\n\n`= 0x00000020`',
  },
  {
    label: '$DDL_DIRECTORY',
    documentation: 'Includes directories\n\n`= 0x00000010`',
  },
  {
    label: '$DDL_DRIVES',
    documentation: 'All mapped drives are added to the list\n\n`= 0x00004000`',
  },
  {
    label: '$DDL_EXCLUSIVE',
    documentation: 'Includes only files with the specified attributes\n\n`= 0x00008000`',
  },
  {
    label: '$DDL_HIDDEN',
    documentation: 'Includes hidden files\n\n`= 0x00000002`',
  },
  {
    label: '$DDL_READONLY',
    documentation: 'Includes read-only files\n\n`= 0x00000001`',
  },
  {
    label: '$DDL_READWRITE',
    documentation: 'Includes read-write files with no additional attributes\n\n`= 0x00000000`',
  },
  {
    label: '$DDL_SYSTEM',
    documentation: 'Includes system files\n\n`= 0x00000004`',
  },
];

const completions = fillCompletions(
  items,
  CompletionItemKind.Constant,
  'Dir Constant',
  'DirConstants.au3',
);
const hovers = completionToHover(completions);

export { completions as default, hovers };
