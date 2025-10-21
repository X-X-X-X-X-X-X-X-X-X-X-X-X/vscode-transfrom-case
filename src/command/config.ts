import * as vscode from 'vscode';
import { GetTranslateProvider, TranslateProviders } from "../translate-provider/provider";
import { getConfig, setConfig } from "../utils";
import { configBar } from '../status-bars/config-bar';
import ISO6391 from 'iso-639-1';

type MyQuickPickItem = vscode.QuickPickItem & { id?: string }

enum QuickPickLanguageSettingsOptions {
    SOURCE = "__SOURCE__",
    TARGET = "__TARGET__",
    RESET = "__RESET__",
}

const resetLanguageSettings = async (providerId?: string) => {
    let provider = GetTranslateProvider(providerId)
    await setConfig("sourceLanguage", provider?.sourceLanguage)
    await setConfig("targetLanguage", provider?.targetLanguage)
}

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
    })) as MyQuickPickItem[]

    const quickPickOptions = [
        { label: "Language Options", kind: vscode.QuickPickItemKind.Separator },
        { label: "$(arrow-right) Source Language", id: QuickPickLanguageSettingsOptions.SOURCE, description: getConfig("sourceLanguage") },
        { label: "$(arrow-left) Target Language", id: QuickPickLanguageSettingsOptions.TARGET, description: getConfig("targetLanguage") },
        { label: "$(redo) Reset Language", id: QuickPickLanguageSettingsOptions.RESET },
        { label: "Select Translation Services", kind: vscode.QuickPickItemKind.Separator },
        ...providerOptions
    ] as MyQuickPickItem[]
    const selectedOption = await vscode.window.showQuickPick(quickPickOptions, {
        title: 'Choose a provider',
        placeHolder: 'Please select an option...',
        ignoreFocusOut: true,
    });
    if (selectedOption) {
        if (!selectedOption.id) return;
        if (selectedOption.id === QuickPickLanguageSettingsOptions.RESET) {
            await resetLanguageSettings(getConfig("current"))
            vscode.window.showInformationMessage("Language settings have been reset.")
            return;
        }
        if (Object.values(QuickPickLanguageSettingsOptions).includes(selectedOption.id as any)) {
            let languageSelectionResults = ISO6391.getAllCodes().map(c => {
                return {
                    label: `${ISO6391.getName(c)} $(arrow-both) ${c}`,
                    description: ISO6391.getNativeName(c)
                } as vscode.QuickPickItem
            })
            let selectedLanguage = await vscode.window.showQuickPick(languageSelectionResults)
            if (selectedLanguage) {
                let lang = selectedLanguage.label.split(" ").pop()!;
                switch (selectedOption.id) {
                    case QuickPickLanguageSettingsOptions.SOURCE:
                        await setConfig("sourceLanguage", lang)
                        break
                    case QuickPickLanguageSettingsOptions.TARGET:
                        await setConfig("targetLanguage", lang)
                        break
                }
                vscode.window.showInformationMessage("Configuring language succeeded.")
            } else {
                vscode.window.showInformationMessage("Configuration language canceled.")
            }
        } else {
            let provider = GetTranslateProvider(selectedOption.id)
            let configured = await provider?.config?.()
            if (configured) {
                await setConfig("current", provider!.id)
                await resetLanguageSettings(provider?.id)
                configBar.update({
                    text: provider!.name
                })
                await provider?.translate({
                    sourceText: '你好'
                })
            }
            vscode.window.showInformationMessage(`(${provider?.name}) ` + (configured ? "configured." : "canceled."))
        }
    }
}
