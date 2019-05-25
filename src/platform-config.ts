import {PollingInfo} from 'overkiz-api';

export interface PlatformConfig {
    readonly user: string,
    readonly password: string;
    readonly polling: PollingInfo;
}