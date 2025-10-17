import * as vscode from 'vscode';

type updateStatusBarData = {
    text: string
}

export class BaseStatusBar {

    instance!: vscode.StatusBarItem
    priority?: number

    init() {
        if (!this.instance) {
            this.instance = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, this.priority)
        }
        return this.instance;
    }

    update({ text }: updateStatusBarData) {
        this.instance.text = text;
    }
}