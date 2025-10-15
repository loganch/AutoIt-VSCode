import { CompletionItemKind } from 'vscode';
import { fillCompletions } from '../util';
import macrosData from './macrosData';

export default fillCompletions(macrosData, CompletionItemKind.Variable, 'Macro');
