import { ExtensionContext } from "vscode";
import { TranslateProvider } from "../../type";
import { RegisterTranslateProvider } from "../provider";
class BaiduFree implements TranslateProvider {
    id: string = "baidu-free";
    name: string = "百度翻译(免费)";
    sourceLanguage?: string | undefined;
    targetLanguage?: string | undefined;
    context?: ExtensionContext | undefined;
    detail?: string | undefined = "免费slug api，只能识别简单单词";
    async translate(context: { sourceLanguage?: string; targetLanguage?: string; sourceText: string; }): Promise<string> {
        let req = await fetch("https://fanyi.baidu.com/sug", {
            method: "POST",
            body: JSON.stringify({
                kw: context.sourceText
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        let result: any = await req.json()
        if (result.errno !== 0) {
            throw new Error(JSON.stringify(result));
        }
        try {
            return result.data[0].v.split(";")[0].split(" ").pop()
        } catch (error) {
            throw new Error("There is no translation yet")
        }
    }
    async config?(): Promise<void | boolean> {
        return true;
    }

}
RegisterTranslateProvider(BaiduFree)