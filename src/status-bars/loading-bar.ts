import { StatusBarItem } from "vscode";
import { BaseStatusBar } from "./bar";

class LoadingBar extends BaseStatusBar {

    priority?: number | undefined = 100;

    init(): StatusBarItem {
        super.init();
        return this.instance;
    }

    update({ text }: { text: string; }): void {
        super.update({
            text: ["$(sync~spin)", text].join(" ")
        })
    }

    async loadingWrap<T extends (...args) => any>(text: string, f: T): Promise<Awaited<ReturnType<T>>> {
        this.update({ text })
        this.instance.show()
        try {
            return await f()
        } finally {
            this.instance.hide()
        }
    }

}


export const loadingBar = new LoadingBar();