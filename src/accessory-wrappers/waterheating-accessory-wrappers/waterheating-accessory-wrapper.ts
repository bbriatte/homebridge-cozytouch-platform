import {APIDevice} from 'overkiz-api';
import {callbackify, Context} from 'homebridge-base-platform';
import {CozytouchAccessoryWrapper} from '../cozytouch-accessory-wrapper';

export enum WaterHeatingState {
    softwareVersion = 'core:DHWPSoftwareVersionState',
}

export abstract class WaterheatingAccessoryWrapper extends CozytouchAccessoryWrapper {

    protected readonly thermostatService: any;
    protected currentHeatingCharacteristic: any;
    protected targetHeatingCharacteristic: any;
    protected currentTemperatureCharacteristic: any;
    protected targetTemperatureCharacteristic: any;

    constructor(context: Context, accessory: any, device: APIDevice) {
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
        return this.device.getStateValue(WaterHeatingState.softwareVersion);
    }

    public abstract async getCurrentHeatingState(): Promise<number>

    public abstract async getTargetHeatingState(): Promise<number>

    public abstract async setTargetHeatingState(state: number): Promise<boolean>

    public abstract async getCurrentTemperature(): Promise<number>;

    public abstract async getTargetTemperature(): Promise<number>;

    public abstract async setTargetTemperature(temperature: number): Promise<boolean>;
}