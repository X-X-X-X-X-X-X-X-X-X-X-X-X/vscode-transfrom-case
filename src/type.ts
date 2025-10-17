
import * as vscode from 'vscode';
export interface TranslateProvider {
    id: string
    name: string
    description?: string
    detail?: string
    // 如果填写则在配置成功后自动将源语言与目标语言设置为对应的值
    sourceLanguage?: string
    targetLanguage?: string

    disable?: boolean

    context?: vscode.ExtensionContext

    translate(context: {
        sourceLanguage?: string
        targetLanguage?: string
        sourceText: string
    }): Promise<string>

    config?(): Promise<void | boolean>
}

export type ExtConfig = {
    current?: string,
    sourceLanguage: string
    targetLanguage: string
}

export type ExtConfigKeys = keyof ExtConfig;
