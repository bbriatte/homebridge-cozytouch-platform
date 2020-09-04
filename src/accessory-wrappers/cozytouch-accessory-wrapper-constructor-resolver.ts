import {APIDevice} from 'overkiz-api';
import {DomesticHotWaterProductionAccessoryWrapper} from './waterheating-accessory-wrappers';
import {CozytouchAccessoryWrapper} from './cozytouch-accessory-wrapper';
import {HomebridgeContextProps} from 'homebridge-base-platform';
import {PlatformAccessory} from "homebridge";

export type CozytouchAccessoryWrapperConstructor = { new (context: HomebridgeContextProps, accessory: PlatformAccessory, device: APIDevice): CozytouchAccessoryWrapper };
export type CozytouchAccessoryWrapperConstructorEntries = {[widget: string]: CozytouchAccessoryWrapperConstructor};

export class CozytouchAccessoryWrapperConstructorResolver {

    static WILDCARD_WIDGET = '*';

    private static mapping: {[uiClass: string]: CozytouchAccessoryWrapperConstructorEntries} = {
        'WaterHeatingSystem': {
            'DomesticHotWaterProduction': DomesticHotWaterProductionAccessoryWrapper
        }
    };

    public static resolve(device: APIDevice): CozytouchAccessoryWrapperConstructor | undefined {
        const constructorEntries = CozytouchAccessoryWrapperConstructorResolver.mapping[device.uiClass];
        if(constructorEntries !== undefined) {
            const constructor = constructorEntries[device.widget];
            if(constructor === undefined) {
                return constructorEntries[this.WILDCARD_WIDGET]
            }
            return constructor;
        }
        return undefined;
    }
}
