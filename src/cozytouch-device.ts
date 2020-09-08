import {APIObject} from 'overkiz-api';
import {Logging} from "homebridge";
import {BaseDevice, BaseGlobalConfig, isVerboseInConfigs} from "homebridge-base-platform";

export interface ICozytouchDevice {
    readonly object: APIObject;
    readonly verbose: boolean;
}

export class CozytouchDevice implements BaseDevice {
    readonly object: APIObject;
    readonly verbose: boolean;

    constructor(props: ICozytouchDevice) {
        this.object = props.object;
        this.verbose = props.verbose;
    }

    get id() {
        return this.object.oid;
    }

    get name() {
        return this.object.name;
    }
}

export function deviceFromConfig(object: APIObject, globalConfig: BaseGlobalConfig, log: Logging): CozytouchDevice {
    const isVerbose = isVerboseInConfigs(globalConfig);
    const cd = new CozytouchDevice({
        object: object,
        verbose: isVerbose
    });
    if(isVerbose) {
        log(`[${cd.name}] Found device`);
    }
    return cd;
}
