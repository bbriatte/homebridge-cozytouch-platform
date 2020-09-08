import {DomesticHotWaterProductionAccessoryWrapper} from './waterheating-accessory-wrappers';
import {CozytouchAccessoryWrapper} from './cozytouch-accessory-wrapper';
import {HomebridgeContextProps} from 'homebridge-base-platform';
import {PlatformAccessory} from "homebridge";
import {CozytouchDevice} from "../cozytouch-device";

export type CozytouchAccessoryWrapperConstructor = { new (context: HomebridgeContextProps, accessory: PlatformAccessory, device: CozytouchDevice): CozytouchAccessoryWrapper };
export type CozytouchAccessoryWrapperConstructorEntries = {[widget: string]: CozytouchAccessoryWrapperConstructor};

export class CozytouchAccessoryWrapperConstructorResolver {

    static WILDCARD_WIDGET = '*';

    private static mapping: {[uiClass: string]: CozytouchAccessoryWrapperConstructorEntries} = {
        'WaterHeatingSystem': {
            'DomesticHotWaterProduction': DomesticHotWaterProductionAccessoryWrapper
        }
    };

    public static resolve(device: CozytouchDevice): CozytouchAccessoryWrapperConstructor | undefined {
        const constructorEntries = CozytouchAccessoryWrapperConstructorResolver.mapping[device.object.uiClass];
        if(constructorEntries !== undefined) {
            const constructor = constructorEntries[device.object.widget];
            if(constructor === undefined) {
                return constructorEntries[this.WILDCARD_WIDGET]
            }
            return constructor;
        }
        return undefined;
    }
}
