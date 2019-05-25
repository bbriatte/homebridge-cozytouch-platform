import {WaterheatingAccessoryWrapper} from './waterheating-accessory-wrapper';
import {Command} from 'overkiz-api';

export enum DomesticHotWaterProductionState {
    maximalTemperature = 'core:MaximalTemperatureManualModeState',
    middleWaterTemperature = 'core:MiddleWaterTemperatureInState',
    boostMode = 'io:DHWBoostModeState',
    absenceMode = 'io:DHWAbsenceModeState',
    heatingStatus = 'core:HeatingStatusState'
}

export class DomesticHotWaterProductionAccessoryWrapper extends WaterheatingAccessoryWrapper {

    protected initThermostatService(): any {
        const thermostatService = super.initThermostatService();
        const maxValue = this.device.getStateValue(DomesticHotWaterProductionState.maximalTemperature) || 65;
        this.targetTemperatureCharacteristic.setProps({
            minValue: 0,
            maxValue: maxValue,
            minStep: maxValue
        });
        const targetHeatingValues = [];
        if(this.device.getStateEntry(DomesticHotWaterProductionState.absenceMode) !== undefined) {
            targetHeatingValues.push(this.Characteristic.TargetHeatingCoolingState.OFF); // enabled OFF mode
        }
        if(this.device.getStateEntry(DomesticHotWaterProductionState.boostMode) !== undefined) {
            targetHeatingValues.push(this.Characteristic.TargetHeatingCoolingState.HEAT); // enabled HEAT mode
        }
        targetHeatingValues.push(this.Characteristic.TargetHeatingCoolingState.AUTO); // enabled AUTO mode
        this.targetHeatingCharacteristic.props.validValues = targetHeatingValues;
        return thermostatService;
    }

    async getCurrentHeatingState(): Promise<number> {
        await this.device.refreshStates();
        if(this.device.getStateValue(DomesticHotWaterProductionState.heatingStatus) !== 'off'
            || this.device.getStateValue(DomesticHotWaterProductionState.boostMode) === 'on') {
            return this.Characteristic.CurrentHeatingCoolingState.HEAT;
        }
        return this.Characteristic.CurrentHeatingCoolingState.OFF;
    }

    async getCurrentTemperature(): Promise<number> {
        await this.device.refreshStates();
        return this.device.getStateValue(DomesticHotWaterProductionState.middleWaterTemperature);
    }

    async getTargetHeatingState(): Promise<number> {
        await this.device.refreshStates();
        if(this.device.getStateValue(DomesticHotWaterProductionState.absenceMode) === 'on') {
            return this.Characteristic.TargetHeatingCoolingState.OFF;
        } else if(this.device.getStateValue(DomesticHotWaterProductionState.boostMode) === 'on') {
            return this.Characteristic.TargetHeatingCoolingState.HEAT;
        }
        return this.Characteristic.TargetHeatingCoolingState.AUTO;
    }

    async getTargetTemperature(): Promise<number> {
        await this.device.refreshStates();
        if(this.device.getStateValue(DomesticHotWaterProductionState.absenceMode) === 'on') {
            return 0;
        }
        return this.targetTemperatureCharacteristic.props.maxValue;
    }

    async setTargetHeatingState(state: number): Promise<boolean> {
        const commands: Command[] = [];
        commands.push({
            name: 'setAbsenceMode',
            parameters: [
                state === this.Characteristic.TargetHeatingCoolingState.OFF ? 'on' : 'off'
            ]
        });
        commands.push({
            name: 'setBoostMode',
            parameters: [
                state === this.Characteristic.TargetHeatingCoolingState.HEAT ? 'on' : 'off'
            ]
        });
        if(state === this.Characteristic.TargetHeatingCoolingState.OFF) {
            this.targetTemperatureCharacteristic.updateValue(0);
        } else {
            this.targetTemperatureCharacteristic.updateValue(this.targetTemperatureCharacteristic.props.maxValue);
        }
        return this.device.exec(...commands);
    }

    async setTargetTemperature(temperature: number): Promise<boolean> {
        if(temperature === 0) {
            this.currentHeatingCharacteristic.updateValue(this.Characteristic.CurrentHeatingCoolingState.OFF);
            this.targetHeatingCharacteristic.updateValue(this.Characteristic.TargetHeatingCoolingState.OFF);
        } else {
            this.currentHeatingCharacteristic.updateValue(this.Characteristic.CurrentHeatingCoolingState.HEAT);
            this.targetHeatingCharacteristic.updateValue(this.Characteristic.TargetHeatingCoolingState.AUTO);
        }
        return this.device.exec({
            name: 'setAbsenceMode',
            parameters: [
                temperature === 0 ? 'on' : 'off'
            ]
        });
    }
}