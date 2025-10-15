import * as vscode from 'vscode';
import "./auto-loaded-effects"
import { transfromCase } from './command/transform';
import { GetTranslateProvider, InitProvidersContext, TranslateProviders } from './translate-provider/provider';


export function activate(context: vscode.ExtensionContext) {
	InitProvidersContext(context)
	context.subscriptions.push(
		vscode.commands.registerCommand('transform-case.transform', () => transfromCase()),
		vscode.commands.registerCommand('transform-case.transformWithTranslate', () => transfromCase(true)),
		vscode.commands.registerCommand('transform-case.translateConfig', async () => {
			let providerOptions = Array.from(
				TranslateProviders.values()
			).map(p => ({
				id: p.id,
				label: "$(circle-large-outline) " + p.name
			}))
			const selectedOption = await vscode.window.showQuickPick(providerOptions, {
				title: 'Choose a provider',
				placeHolder: 'Please select an option...',
				ignoreFocusOut: true,
			});
			if (selectedOption) {
				let provider = GetTranslateProvider(selectedOption.id)
				vscode.window.showInformationMessage(`[${provider?.name}]` + await provider?.config?.() ? "configured" : "canceled")
			}
		}),

	);
}

export function deactivate() { }
