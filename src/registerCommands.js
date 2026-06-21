import { commands } from 'vscode';
import { commandRegistry } from './commandRegistry';
import { commandsList, commandsPrefix } from './commandsList';

export const registerCommands = ctx => {
  for (const command of commandsList) {
    const commandFunc = commandRegistry[command];
    if (typeof commandFunc === 'function') {
      ctx.subscriptions.push(commands.registerCommand(commandsPrefix + command, commandFunc));
    }
  }
};
