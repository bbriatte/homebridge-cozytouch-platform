import {callbackify, HomebridgeContextProps} from 'homebridge-base-platform';
import {Service, Characteristic, PlatformAccessory} from 'homebridge';
import {CozytouchAccessoryWrapper} from '../cozytouch-accessory-wrapper';
import {CozytouchDevice} from "../../cozytouch-device";

export enum WaterHeatingState {
    softwareVersion = 'core:DHWPSoftwareVersionState',
}

export abstract class WaterheatingAccessoryWrapper extends CozytouchAccessoryWrapper {

    protected readonly thermostatService: Service;
    protected currentHeatingCharacteristic: Characteristic;
    protected targetHeatingCharacteristic: Characteristic;
    protected currentTemperatureCharacteristic: Characteristic;
    protected targetTemperatureCharacteristic: Characteristic;

    constructor(context: HomebridgeContextProps, accessory: PlatformAccessory, device: CozytouchDevice) {
        super(context, accessory, device);
        this.thermostatService = this.initThermostatService();
    }

    protected initThermostatService(): any {
        const thermostatService = this.getService(this.Service.Thermostat, this.getDisplayName(), 'thermostatService');

        this.currentHeatingCharacteristic = thermostatService.getCharacteristic(this.Characteristic.CurrentHeatingCoolingState);
        this.currentHeatingCharacteristic.on('get', callbackify(this.getCurrentHeatingState.bind(this)));

        this.targetHeatingCharacteristic = thermostatService.getCharacteristic(this.Characteristic.TargetHeatingCoolingState);
        this.targetHeatingCharacteristic
            .on('get', callbackify(this.getTargetHeatingState.bind(this)))
            .on('set', callbackify(this.setTargetHeatingState.bind(this)));

        this.currentTemperatureCharacteristic = thermostatService.getCharacteristic(this.Characteristic.CurrentTemperature);
        this.currentTemperatureCharacteristic
            .on('get', callbackify(this.getCurrentTemperature.bind(this)));

        this.targetTemperatureCharacteristic = thermostatService.getCharacteristic(this.Characteristic.TargetTemperature);
        this.targetTemperatureCharacteristic
            .on('get', callbackify(this.getTargetTemperature.bind(this)))
            .on('set', callbackify(this.setTargetTemperature.bind(this)));
    }

    protected getSoftwareVersion(): string | undefined {
        return this.object.getStateValue(WaterHeatingState.softwareVersion);
    }

    public abstract getCurrentHeatingState(): Promise<number>

    public abstract getTargetHeatingState(): Promise<number>

    public abstract setTargetHeatingState(state: number): Promise<boolean>

    public abstract getCurrentTemperature(): Promise<number>;

    public abstract getTargetTemperature(): Promise<number>;

    public abstract setTargetTemperature(temperature: number): Promise<boolean>;
}
