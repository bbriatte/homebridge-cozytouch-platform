import {PollingInfo} from 'overkiz-api';
import {BasePlatformConfig} from "homebridge-base-platform";

export interface CozytouchPlatformConfig extends BasePlatformConfig {
    readonly user: string,
    readonly password: string;
    readonly polling: PollingInfo;
}
