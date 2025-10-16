import * as vscode from 'vscode';
import "./auto-loaded-effects";
import { config } from './command/config';
import { transfromCase } from './command/transform';
import { InitProvidersContext } from './translate-provider/provider';
import { extCommands } from './command/constants';
import { initStatusBar } from './status-bar';
import { configListen } from './utils';

export function activate(context: vscode.ExtensionContext) {
	InitProvidersContext(context)

	context.subscriptions.push(
		initStatusBar(),
		configListen(),
		vscode.commands.registerCommand(extCommands.transformCaseTransform, () => transfromCase()),
		vscode.commands.registerCommand(extCommands.transformCaseTransformWithTranslate, () => transfromCase(true)),
		vscode.commands.registerCommand(extCommands.transformCaseTranslateConfig, () => config()),
	);
}

export function deactivate() { }
