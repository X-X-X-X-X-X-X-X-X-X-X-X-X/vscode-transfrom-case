import * as changeCase from 'change-case';
import * as vscode from 'vscode';
import { GetTranslateProvider } from '../translate-provider/provider';
import { getConfig } from '../utils';
import { extCommands } from './constants';


const translateFns: {
    [k: string]: (s: string) => string
} = {
    original: s => s
}

Object.keys(changeCase).forEach(k => {
    if (k.endsWith("Case")) {
        translateFns[k] = s => changeCase[k](s)
    }
})

export const transfromCase = async (translate?: boolean) => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const selections = editor.selections;
        const previewSelection = selections[0];
        const moreSelection = selections.length - 1;
        if (!previewSelection.isEmpty) {
            const quickPick = vscode.window.createQuickPick();
            let text = document.getText(previewSelection)
            let translator = GetTranslateProvider(getConfig("current"))
            if (translate) {
                if (!translator) {
                    await vscode.commands.executeCommand(extCommands.transformCaseTranslateConfig)
                    return
                }
                text = await translator?.translate({
                    sourceText: text
                })!
            }
            quickPick.items = Object.keys(translateFns).map(k => {
                return {
                    //@ts-ignore
                    label: translateFns[k](text) + ` ← ${k}`,
                    description: `${moreSelection > 0 ? `${moreSelection}+` : ""}`
                } as vscode.QuickPickItem
            })
            quickPick.onDidAccept(async () => {
                quickPick.dispose();
                const acceptedItem = quickPick.selectedItems[0]
                let method = acceptedItem.label?.split(" ").pop()
                const replace: Map<vscode.Selection, string> = new Map();
                if (selections.length === 1) {
                    replace.set(selections[0], text)
                } else {
                    let idx = 0
                    for (const s of selections) {
                        idx++;
                        if (idx === 0) continue;
                        if (!s.isEmpty) {
                            let text = document.getText(s)
                            if (translate) {
                                text = await await translator?.translate({
                                    sourceText: text
                                })!
                            }
                            replace.set(s, text)
                        }
                    }
                }
                editor.edit(edit => {
                    Array.from(replace.entries()).forEach(([s, text]) => {
                        //@ts-ignore
                        edit.replace(s, translateFns[method](text))
                    })
                })
            });
            quickPick.show();
        }
    }
}