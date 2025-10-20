import { ExtensionContext } from "vscode";
import { TranslateProvider } from "../../type";
import { RegisterTranslateProvider } from "../provider";
class MymemoryTranslated implements TranslateProvider {
    id: string = "mymemory-translated";
    name: string = "MyMemory";
    sourceLanguage?: string | undefined = "Autodetect";
    targetLanguage?: string | undefined = "en";
    context?: ExtensionContext | undefined;
    description?: string | undefined = "无需登录免费使用，每日限制5000字符";
    async translate(context: { sourceLanguage?: string; targetLanguage?: string; sourceText: string; }): Promise<string> {
        let req = await fetch(`https://api.mymemory.translated.net/get?q=${context.sourceText}&langpair=${context.sourceLanguage}|${context.targetLanguage}`)
        let result: any = await req.json()
        return result.responseData.translatedText;
    }
    async config?(): Promise<void | boolean> {
        return true;
    }

}
RegisterTranslateProvider(MymemoryTranslated)