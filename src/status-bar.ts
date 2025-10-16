import * as vscode from 'vscode';
import { extCommands } from './command/constants';
import { configurationKey } from './constants';
import { ExtConfigKeys } from './type';

export let statusBar: vscode.StatusBarItem;

export const initStatusBar = () => {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99)
    statusBar.command = extCommands.transformCaseTranslateConfig;
    statusBar.tooltip = "Transfrom Case translation configuration"
    let configuration = vscode.workspace.getConfiguration(configurationKey)
    let current = configuration.get<string>("current" as ExtConfigKeys)
    statusBar.text = ["$(wrench)", current ? current : "Configuration required"].join(" ");
    statusBar.show()
    return statusBar;
}

type updateStatusBarData = {
    text: string
}

export const updateStatusBar = async (data: updateStatusBarData) => {
    statusBar.text = data.text;
}