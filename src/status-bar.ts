import * as vscode from 'vscode';
import { extCommands } from './command/constants';
import { configurationKey } from './constants';
import { ExtConfigKeys } from './type';
import { GetTranslateProvider } from './translate-provider/provider';

export let statusBar: vscode.StatusBarItem;

export const initStatusBar = () => {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99)
    statusBar.command = extCommands.transformCaseTranslateConfig;
    statusBar.tooltip = "Transfrom Case translation configuration"
    let configuration = vscode.workspace.getConfiguration(configurationKey)
    let current = configuration.get<string>("current" as ExtConfigKeys)
    let name = GetTranslateProvider(current!)?.name
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