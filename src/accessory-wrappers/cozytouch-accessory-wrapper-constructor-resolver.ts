import {APIDevice} from 'overkiz-api';
import {DomesticHotWaterProductionAccessoryWrapper} from './waterheating-accessory-wrappers';
import {CozytouchAccessoryWrapper} from './cozytouch-accessory-wrapper';
import {Context} from 'homebridge-base-platform';

export type CozytouchAccessoryWrapperConstructor = { new (context: Context, accessory: any, device: APIDevice): CozytouchAccessoryWrapper };
export type CozytouchAccessoryWrapperConstructorEntries = {[widget: string]: CozytouchAccessoryWrapperConstructor};

export class CozytouchAccessoryWrapperConstructorResolver {

    private static mapping: {[uiClass: string]: CozytouchAccessoryWrapperConstructorEntries} = {
        'WaterHeatingSystem': {
            'DomesticHotWaterProduction': DomesticHotWaterProductionAccessoryWrapper
        }
    };

    public static resolve(device: APIDevice): CozytouchAccessoryWrapperConstructor | undefined {
        const constructorEntries = CozytouchAccessoryWrapperConstructorResolver.mapping[device.uiClass];
        if(constructorEntries !== undefined) {
            return constructorEntries[device.widget];
        }
        return undefined;
    }
}