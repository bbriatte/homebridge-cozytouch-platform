import {PollingInfo} from 'overkiz-api';
import {PlatformConfig} from 'homebridge';

export interface CozytouchPlatformConfig extends PlatformConfig {
    readonly user: string,
    readonly password: string;
    readonly polling: PollingInfo;
}
