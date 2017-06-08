// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var { languages, commands } = require('vscode');
var ai_commands  = require("./ai_commands");
var ai_hover = require('./ai_hover');
var ai_completion = require('./ai_completion');
var ai_symbols = require('./ai_symbols');
var ai_signature = require('./ai_signature');

function activate(ctx) {

    ctx.subscriptions.push(ai_hover);
    ctx.subscriptions.push(ai_completion);
    ctx.subscriptions.push(ai_symbols);
    ctx.subscriptions.push(ai_signature);
    
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('AutoIt is now active!');

    ctx.subscriptions.push(languages.setLanguageConfiguration(
        'autoit', { wordPattern: /([^`~!#\%\^\&*()-\=+[{\]}\|\;\:\'\"\,.\<>\/\?\s][A-z0-9]+)/ }));

    commands.registerCommand('extension.runScript', () => {
        ai_commands.runScript();
    }); // Run Script Command
    commands.registerCommand('extension.launchHelp', () => {
        ai_commands.launchHelp();
    }); // Launch Help Command
    commands.registerCommand('extension.launchInfo', () => {
        ai_commands.launchInfo();
    }); // Launch Au3Info
    commands.registerCommand('extension.debugMsgBox', () => {
        ai_commands.debugMsgBox();
    }); // Insert Debug MsgBox
    commands.registerCommand('extension.compile', () => {
        ai_commands.compileScript();
    }); // Compile scripts
    commands.registerCommand('extension.tidy', () => {
        ai_commands.tidyScript();
    }); // Tidy script
    commands.registerCommand('extension.check', () => {
        ai_commands.checkScript();
    }); // Check script
    commands.registerCommand('extension.build', () => {
        ai_commands.buildScript();
    }); // Build scripts
    commands.registerCommand('extension.debugConsole', () => {
        ai_commands.debugConsole();
    }); // Launch Debug-Console
    commands.registerCommand('extension.launchKoda', () => {
        ai_commands.launchKoda();
    }) // Launch Koda Form Designer
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;