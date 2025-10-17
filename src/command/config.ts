import * as vscode from 'vscode';
import { GetTranslateProvider, TranslateProviders } from "../translate-provider/provider";
import { getConfig, setConfig } from "../utils";
import { configBar } from '../status-bars/config-bar';

export const config = async () => {
    let current = getConfig("current")
    let providerOptions = Array.from(
        TranslateProviders.values()
    ).filter(v => !v.disable).map(p => ({
        id: p.id,
        label: [
            current === p.id ? "$(pass-filled)" : "$(circle-large-outline)",
            p.name
        ].join(" "),
        description: p.description || "",
        detail: p.detail || "",
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
            provider?.targetLanguage && await setConfig("targetLanguage", provider.targetLanguage)
            configBar.update({
                text: provider!.name
            })
            await provider?.translate({
                sourceText: '你好'
            })
        }
        vscode.window.showInformationMessage(`(${provider?.name}) ` + (configured ? "Configured" : "Canceled"))
    }
}
