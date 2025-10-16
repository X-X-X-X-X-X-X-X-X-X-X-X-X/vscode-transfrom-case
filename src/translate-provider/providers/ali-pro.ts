import { RegisterTranslateProvider } from '../provider';
import { AliClient } from './ali';


class AliProClient extends AliClient {
    mode: 'general' | 'pro' = "pro"
    id: string = "alicloud.translate.pro";
    name: string = "阿里云机器翻译(专业版)"
}

RegisterTranslateProvider(AliProClient)