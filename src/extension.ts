import { runCommand } from './commands/runCommand';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('pico8tools.run', () => {
		runCommand();
	}));
}
