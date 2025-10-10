import * as changeCase from 'change-case';
import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('xxc-transform-case.transform', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selections = editor.selections;
			const previewSelection = selections[0];
			const moreSelection = selections.length - 1;
			if (!previewSelection.isEmpty) {
				const quickPick = vscode.window.createQuickPick();
				let text = document.getText(previewSelection)
				quickPick.items = Object.keys(changeCase).filter(k => k.endsWith("Case")).map(k => {
					return {
						//@ts-ignore
						label: changeCase[k](text) + ` ← ${k}`,
						description: `${moreSelection > 0 ? `${moreSelection}+` : ""}`
					} as vscode.QuickPickItem
				})

				quickPick.onDidAccept(() => {
					const acceptedItem = quickPick.selectedItems[0]
					let method = acceptedItem.label?.split(" ").pop()
					editor.edit(edit => {
						selections.forEach(s => {
							if (!s.isEmpty) {
								let text = document.getText(s)
								//@ts-ignore
								edit.replace(s, changeCase[method](text))
							}
						})
					})
					quickPick.dispose();
				});
				quickPick.show();
			}
		}
	});
	context.subscriptions.push(disposable);
}

export function deactivate() { }
