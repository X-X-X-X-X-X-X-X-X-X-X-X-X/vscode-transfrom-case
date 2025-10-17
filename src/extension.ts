import * as vscode from 'vscode';
import "./auto-loaded-effects";
import { config } from './command/config';
import { transfromCase } from './command/transform';
import { InitProvidersContext } from './translate-provider/provider';
import { extCommands } from './command/constants';
import { configListen } from './utils';
import { loadingBar } from './status-bars/loading-bar';
import { configBar } from './status-bars/config-bar';

export function activate(context: vscode.ExtensionContext) {
    InitProvidersContext(context)

    context.subscriptions.push(
        configBar.init(),
        loadingBar.init(),
        configListen(),
        vscode.commands.registerCommand(extCommands.transformCaseTransform, () => transfromCase()),
        vscode.commands.registerCommand(extCommands.transformCaseTransformWithTranslate, () => transfromCase(true)),
        vscode.commands.registerCommand(extCommands.transformCaseTranslateConfig, () => config()),
    );
}

export function deactivate() { }
