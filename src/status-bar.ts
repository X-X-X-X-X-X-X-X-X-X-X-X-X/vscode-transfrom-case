import * as vscode from 'vscode';
import { extCommands } from './command/constants';
import { GetTranslateProvider } from './translate-provider/provider';
import { getConfig } from './utils';

export let statusBar: vscode.StatusBarItem;

export const initStatusBar = () => {
    if (!statusBar) {
        statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99)
    }
    statusBar.command = extCommands.transformCaseTranslateConfig;
    statusBar.tooltip = "Transfrom Case translation configuration"
    let name = GetTranslateProvider(getConfig("current"))?.name
    updateStatusBar({
        text: name ? name : "Configuration required"
    })
    statusBar.show()
    return statusBar;
}

type updateStatusBarData = {
    text: string
}

export const updateStatusBar = async (data: updateStatusBarData) => {
    statusBar.text = ["$(wrench)", data.text].join(" ");
}