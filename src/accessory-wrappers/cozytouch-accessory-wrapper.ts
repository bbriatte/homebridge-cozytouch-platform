import {HomebridgeContextProps, HomebridgeAccessoryWrapper} from 'homebridge-base-platform';
import {PlatformAccessory, Service} from "homebridge";
import {CozytouchDevice} from "../cozytouch-device";

export enum CozytouchState {
    model = 'core:ModelState',
    version = 'core:VersionState',
    manufacturer = 'core:ManufacturerNameState'
}

export class CozytouchAccessoryWrapper extends HomebridgeAccessoryWrapper<CozytouchDevice> {

    protected readonly informationService: Service;

    public get object() {
        return this.device.object;
    }

    constructor(context: HomebridgeContextProps, accessory: PlatformAccessory, device: CozytouchDevice) {
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
        const model = this.object.getStateValue(CozytouchState.model);
        return model !== undefined ? model : this.object.model;
    }

    protected getSerial(): string | undefined {
        const res = this.object.URL.split('/');
        if(res.length > 0) {
            return res[res.length - 1];
        }
        return undefined;
    }

    protected getHardwareVersion(): string | undefined {
        return this.object.getStateValue(CozytouchState.version);
    }

    protected getSoftwareVersion(): string | undefined {
        return undefined;
    }

    protected getManufacturer(): string | undefined {
        return this.object.getStateValue(CozytouchState.manufacturer);
    }
}
