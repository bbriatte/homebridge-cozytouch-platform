import {HomebridgeContextProps, HomebridgeAccessoryWrapper} from 'homebridge-base-platform';
import {APIDevice} from 'overkiz-api';
import {PlatformAccessory, Service} from "homebridge";

export enum CozytouchState {
    model = 'core:ModelState',
    version = 'core:VersionState',
    manufacturer = 'core:ManufacturerNameState'
}

export class CozytouchAccessoryWrapper extends HomebridgeAccessoryWrapper<APIDevice> {

    protected readonly informationService: Service;

    constructor(context: HomebridgeContextProps, accessory: PlatformAccessory, device: APIDevice) {
        super(context, accessory, device);
        this.informationService = this.initInformationService();
        this.log(`Found device [${this.getDisplayName()}]`);
    }

    protected initInformationService(): Service {
        const informationService = this.accessory.getService(this.Service.AccessoryInformation);
        informationService
            .setCharacteristic(this.Characteristic.Name, this.getDisplayName())
            .setCharacteristic(this.Characteristic.Model, this.getModel());
        const serial = this.getSerial();
        if(serial !== undefined) {
            informationService.setCharacteristic(this.Characteristic.SerialNumber, serial);
        }
        const manufacturer = this.getManufacturer();
        if(manufacturer !== undefined) {
            informationService.setCharacteristic(this.Characteristic.Manufacturer, manufacturer);
        }
        let version = this.getSoftwareVersion();
        if(version !== undefined) {
            informationService.setCharacteristic(this.Characteristic.FirmwareRevision, version);
        }
        version = this.getHardwareVersion();
        if(version !== undefined) {
            informationService.setCharacteristic(this.Characteristic.HardwareRevision, version);
        }
        return informationService;
    }

    protected getModel(): string {
        const model = this.device.getStateValue(CozytouchState.model);
        return model !== undefined ? model : this.device.model;
    }

    protected getSerial(): string | undefined {
        const res = this.device.URL.split('/');
        if(res.length > 0) {
            return res[res.length - 1];
        }
        return undefined;
    }

    protected getHardwareVersion(): string | undefined {
        return this.device.getStateValue(CozytouchState.version);
    }

    protected getSoftwareVersion(): string | undefined {
        return undefined;
    }

    protected getManufacturer(): string | undefined {
        return this.device.getStateValue(CozytouchState.manufacturer);
    }
}
