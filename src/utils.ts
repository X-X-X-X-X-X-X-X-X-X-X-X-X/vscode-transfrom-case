import * as vscode from 'vscode';
import { configurationKey } from './constants';
import { ExtConfig, ExtConfigKeys } from './type';

export const getConfig = <K extends ExtConfigKeys>(key: K) => {
    return vscode.workspace.getConfiguration(configurationKey).get<ExtConfig[K]>(key)
}

export const setConfig = async <K extends ExtConfigKeys>(key: K, data: ExtConfig[K]) => {
    await vscode.workspace.getConfiguration(configurationKey).update(key, data, true)
}