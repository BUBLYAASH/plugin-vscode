const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposable = vscode.commands.registerCommand('plugin-vscode-lab.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from plugin-vscode-lab!');
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
