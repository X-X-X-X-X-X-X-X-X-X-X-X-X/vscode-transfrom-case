import * as vscode from 'vscode';
import { updateStatusBar } from "../status-bar";
import { GetTranslateProvider, TranslateProviders } from "../translate-provider/provider";
import { getConfig, setConfig } from "../utils";

export const config = async () => {
    let current = getConfig("current")
    let providerOptions = Array.from(
        TranslateProviders.values()
    ).map(p => ({
        id: p.id,
        label: [
            current === p.id ? "$(pass-filled)" : "$(circle-large-outline)",
            p.name
        ].join(" "),
        detail: p.description || "",
    })) as (vscode.QuickPickItem & { id: string })[]
    const selectedOption = await vscode.window.showQuickPick(providerOptions, {
        title: 'Choose a provider',
        placeHolder: 'Please select an option...',
        ignoreFocusOut: true,
    });
    if (selectedOption) {
        let provider = GetTranslateProvider(selectedOption.id)
        let configured = await provider?.config?.()
        if (configured) {
            await setConfig("current", provider!.id)
            provider?.sourceLanguage && await setConfig("sourceLanguage", provider.sourceLanguage)
            provider?.targetLanguage && await setConfig("sourceLanguage", provider.targetLanguage)

            updateStatusBar({
                text: provider!.name
            })
            await provider?.translate({
                sourceText: '你好'
            })
        }
        vscode.window.showInformationMessage(`(${provider?.name}) ` + (configured ? "Configured" : "Canceled"))
    }
}
