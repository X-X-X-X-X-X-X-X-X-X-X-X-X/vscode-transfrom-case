import * as vscode from 'vscode';
import { configurationKey } from './constants';
import { ExtConfig, ExtConfigKeys } from './type';
import { configBar } from './status-bars/config-bar';

export const getConfig = <K extends ExtConfigKeys>(key: K) => {
    return vscode.workspace.getConfiguration(configurationKey).get<ExtConfig[K]>(key)
}

export const setConfig = async <K extends ExtConfigKeys>(key: K, data: ExtConfig[K]) => {
    await vscode.workspace.getConfiguration(configurationKey).update(key, data, true)
}


export const configListen = () => {
    return vscode.workspace.onDidChangeConfiguration(ev => {
        if (ev.affectsConfiguration(configurationKey)) {
            configBar.init()
        }
    })
}