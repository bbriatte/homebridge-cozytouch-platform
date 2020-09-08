import {BaseGlobalConfig, HomebridgePlatform, PlatformSettings} from 'homebridge-base-platform';
import {
    CozytouchAccessoryWrapperConstructorResolver,
    CozytouchAccessoryWrapperConstructor,
    CozytouchAccessoryWrapper
} from './accessory-wrappers';
import {CozytouchPlatformConfig} from "./cozytouch-platform-config";
import {API, Logging} from "homebridge";
import {API as OverkizAPI} from "overkiz-api";
import {CozytouchDevice, deviceFromConfig} from "./cozytouch-device";

export enum CozytouchPlatformInfo {
    plugin = 'homebridge-cozytouch-platform',
    name = 'CozytouchPlatform'
}

export class CozytouchPlatform extends HomebridgePlatform<CozytouchPlatformConfig, CozytouchDevice, CozytouchAccessoryWrapper> {

    public constructor(logger: Logging, config: CozytouchPlatformConfig, api: API) {
        super(logger, config, api);
    }
    protected getAccessoryWrapperConstructorForDevice(device: CozytouchDevice): CozytouchAccessoryWrapperConstructor | undefined {
        return CozytouchAccessoryWrapperConstructorResolver.resolve(device);
    }

    protected initPlatformSettings(): PlatformSettings {
        return {
            name: CozytouchPlatformInfo.name,
            plugin: CozytouchPlatformInfo.plugin
        };
    }

    protected async searchDevices(): Promise<CozytouchDevice[]> {
        const api = new OverkizAPI({
            host: 'ha110-1.overkiz.com',
            user: this.config.user,
            password: this.config.password,
            polling: this.config.polling
        });
        const globalConfig: BaseGlobalConfig = this.config.global || {};
        const objects = await api.getObjects();
        return objects.map((o) => deviceFromConfig(o, globalConfig, this.log));
    }

    protected getDefaultPlatformConfig(): CozytouchPlatformConfig | undefined {
        return undefined; // default config not possible
    }
}
