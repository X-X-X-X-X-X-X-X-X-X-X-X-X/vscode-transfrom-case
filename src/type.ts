
import * as vscode from 'vscode';
export interface TranslateProvider {
    id: string
    name: string
    context?: vscode.ExtensionContext

    translate(context: {
        sourceLanguage: string
        targetLanguage: string
        sourceText: string
    }): Promise<string>

    config?(): Promise<void | boolean>
}