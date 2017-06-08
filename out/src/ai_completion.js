'use strict'

var { languages, Completion, CompletionItem, CompletionItemKind, editor, document } = require('vscode')
var fs = require('fs')
var completions = []
var newComp

var files = fs.readdirSync(__dirname + '/completions')
for (var i in files) {
    newComp = require('./completions/' + files[i])
    completions = completions.concat(newComp)
}

const _funcPattern = /Func\s+(\w*)\s*\(/g;
const _varPattern = /\$(\w*)/g;

module.exports = languages.registerCompletionItemProvider({ language: 'autoit', scheme: 'file' }, {
    provideCompletionItems(document, position, token) {
        // Gather the functions created by the user
        var added = {};
        var result = [];
        var text = document.getText();
        var range = document.getWordRangeAtPosition(position);
        var prefix = range ? document.getText(range) : '';

        if (!range) {
            range = new Range(position, position);
        }

        var createNewCompletionItem = function (kind, name) {
            var compItem = new CompletionItem(name, kind);
            var strDetail = 'Document Function';
            if (kind == CompletionItemKind.Variable) {
                strDetail = 'Variable';
            }
            compItem.detail = strDetail;

            return compItem;
        };

        if (prefix[0] === '$') {
            var pattern = null;
            while (pattern = _varPattern.exec(text)) {
                var varName = pattern[0];
                if (!added[varName]) {
                    added[varName] = true;
                    result.push(createNewCompletionItem(CompletionItemKind.Variable, varName));
                }
            }
        }

        var pattern = null;
        while (pattern = _funcPattern.exec(text)) {
            var funcName = pattern[1];
            if (!added[funcName]) {
                added[funcName] = true;
                result.push(createNewCompletionItem(CompletionItemKind.Function, funcName));
            }
        }

        return completions.concat(result);
    }
}, '.', '$')