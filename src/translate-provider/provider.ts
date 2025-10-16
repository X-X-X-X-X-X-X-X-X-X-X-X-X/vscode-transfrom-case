import { TranslateProvider } from "../type"
import * as vscode from 'vscode';
import { getConfig } from "../utils";
export const TranslateProviders = new Map<string, TranslateProvider>()

export const GetTranslateProvider = (id?: string) => {
    return TranslateProviders.get(id || Date.now().toString())
}

export const RegisterTranslateProvider = (provider: new (...args) => TranslateProvider) => {
    let providerInstance = new provider()
    let originTranslate = providerInstance.translate
    providerInstance.translate = async (ctx) => {
        try {
            ctx.sourceLanguage ??= getConfig("sourceLanguage")
            ctx.targetLanguage ??= getConfig("targetLanguage")
            return await originTranslate.apply(providerInstance, [ctx])
        } catch (error: any) {
            vscode.window.showErrorMessage(`(${providerInstance.name}) Translate error: ${error.message || JSON.stringify(error)}`)
            return ctx.sourceText;
        }
    }

    TranslateProviders.set(providerInstance.id, providerInstance)
}

export const InitProvidersContext = (ctx: vscode.ExtensionContext) => {
    Array.from(TranslateProviders.values()).forEach(p => p.context = ctx)
}