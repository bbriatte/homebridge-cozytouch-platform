import {HomebridgePlatform, PlatformSettings} from 'homebridge-base-platform';
import {API, APIDevice} from 'overkiz-api';
import {
    CozytouchAccessoryWrapperConstructorResolver,
    CozytouchAccessoryWrapperConstructor,
    CozytouchAccessoryWrapper
} from './accessory-wrappers';
import {CozytouchPlatformConfig} from "./cozytouch-platform-config";
import {Logging} from "homebridge";

export enum CozytouchPlatformInfo {
    plugin = 'homebridge-cozytouch-platform',
    name = 'CozytouchPlatform'
}

export class CozytouchPlatform extends HomebridgePlatform<CozytouchPlatformConfig, APIDevice, CozytouchAccessoryWrapper> {

    public constructor(logger: Logging, config: CozytouchPlatformConfig, api: API) {
        super(logger, config, api);
    }
    protected getAccessoryWrapperConstructorForDevice(device: APIDevice): CozytouchAccessoryWrapperConstructor | undefined {
        return CozytouchAccessoryWrapperConstructorResolver.resolve(device);
    }

    protected initPlatformSettings(): PlatformSettings {
        return {
            name: CozytouchPlatformInfo.name,
            plugin: CozytouchPlatformInfo.plugin,
            deviceKeyMapping: {
                id: 'oid',
                name: 'name'
            }
        };
    }

    protected async searchDevices(): Promise<APIDevice[]> {
        const api = new API({
            host: 'ha110-1.overkiz.com',
            user: this.config.user,
            password: this.config.password,
            polling: this.config.polling
        });
        return api.getDevices();
    }

    protected getDefaultPlatformConfig(): CozytouchPlatformConfig | undefined {
        return undefined; // default config not possible
    }
}
