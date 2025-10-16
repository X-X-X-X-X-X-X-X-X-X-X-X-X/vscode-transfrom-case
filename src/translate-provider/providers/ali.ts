import * as $dara from '@darabonba/typescript';
import alimt, * as $alimt from '@alicloud/alimt20181012';
import { $OpenApiUtil } from '@alicloud/openapi-core';
import Credential from '@alicloud/credentials';
import { TranslateProvider } from '../../type';
import { RegisterTranslateProvider } from '../provider';
import * as vscode from 'vscode';

const accessKeyIdStoreKey = "accessKeyId"
const accessKeySecretStoreKey = "accessKeySecret"

class Client implements TranslateProvider {
    id: string = "alicloud.translate";
    name: string = "阿里云翻译";
    context!: vscode.ExtensionContext;
    private storeKey(key: string) {
        return this.id + "-" + key;
    }
    /**
     * @remarks
     * 使用凭据初始化账号Client
     * @returns Client
     *
     * @throws Exception
     */
    async createClient(): Promise<alimt> {
        // 工程代码建议使用更安全的无AK方式，凭据配置方式请参见：https://help.aliyun.com/document_detail/378664.html。
        let credential = new Credential({
            type: 'access_key',
            accessKeyId: await this.context.secrets.get(this.storeKey(accessKeyIdStoreKey)),
            accessKeySecret: await this.context.secrets.get(this.storeKey(accessKeySecretStoreKey)),
        } as any);


        let config = new $OpenApiUtil.Config({
            credential: credential,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/alimt
        config.endpoint = `mt.cn-hangzhou.aliyuncs.com`;
        return new alimt(config);
    }

    async translate(context: { sourceLanguage: string; targetLanguage: string; sourceText: string; }): Promise<string> {
        let client = await this.createClient();
        let translateGeneralRequest = new $alimt.TranslateGeneralRequest({
            formatType: "text",
            sourceLanguage: context.sourceLanguage,
            targetLanguage: context.targetLanguage,
            sourceText: context.sourceText,
            scene: "general",
        });
        let runtime = new $dara.RuntimeOptions({});
        let resp = await client.translateGeneralWithOptions(translateGeneralRequest, runtime);
        return resp.body!.data!.translated as string;
    }

    async config() {
        const accessKeyId = await vscode.window.showInputBox({
            title: "Input AccessKey ID(1/2)",
            prompt: 'AccessKey ID',
            ignoreFocusOut: true
        });
        if (!accessKeyId) return
        const accessKeySecret = await vscode.window.showInputBox({
            title: "Input AccessKey Secret(2/2)",
            prompt: 'AccessKey Secret',
            password: true,
            ignoreFocusOut: true
        });
        if (!accessKeySecret) return
        await this.context.secrets.store(this.storeKey(accessKeyIdStoreKey), accessKeyId)
        await this.context.secrets.store(this.storeKey(accessKeySecretStoreKey), accessKeySecret)
        return true;
    }
}

RegisterTranslateProvider(Client)