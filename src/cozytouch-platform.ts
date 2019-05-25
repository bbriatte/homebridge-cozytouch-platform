import {HomebridgePlatform, PlatformSettings} from 'homebridge-base-platform';
import {PlatformConfig} from './platform-config';
import {API, APIDevice} from 'overkiz-api';
import {
    CozytouchAccessoryWrapperConstructorResolver,
    CozytouchAccessoryWrapperConstructor,
    CozytouchAccessoryWrapper
} from './accessory-wrappers';

export enum CozytouchPlatformInfo {
    plugin = 'homebridge-cozytouch-platform',
    name = 'CozytouchPlatform'
}

export class CozytouchPlatform extends HomebridgePlatform<PlatformConfig, APIDevice, CozytouchAccessoryWrapper> {
    protected getAccessoryWrapperConstructorForDevice(device: APIDevice): CozytouchAccessoryWrapperConstructor | undefined {
        return CozytouchAccessoryWrapperConstructorResolver.resolve(device);
    }

    protected initPlatformSettings(): PlatformSettings {
        return {
            name: CozytouchPlatformInfo.name,
            plugin: CozytouchPlatformInfo.plugin,
            deviceKeys: {
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
}