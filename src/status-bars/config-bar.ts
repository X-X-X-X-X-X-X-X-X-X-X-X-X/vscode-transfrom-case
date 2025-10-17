import * as vscode from 'vscode';
import { extCommands } from '../command/constants';
import { GetTranslateProvider } from '../translate-provider/provider';
import { getConfig } from '../utils';
import { BaseStatusBar } from './bar';
class ConfigBar extends BaseStatusBar {

    priority?: number | undefined = 99;
    init(): vscode.StatusBarItem {
        super.init();
        this.instance.command = extCommands.transformCaseTranslateConfig;
        this.instance.tooltip = "Transfrom Case translation configuration"
        let name = GetTranslateProvider(getConfig("current"))?.name
        this.update({
            text: name ? name : "Configuration required"
        })
        this.instance.show()
        return this.instance;
    }

    update({ text }: { text: string; }): void {
        super.update({
            text: ["$(wrench)", text].join(" ")
        })
    }
}

export const configBar = new ConfigBar();