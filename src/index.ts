import {CozytouchPlatform, CozytouchPlatformInfo} from './cozytouch-platform';

export default function(homebridge: any) {
    homebridge.registerPlatform(CozytouchPlatformInfo.plugin, CozytouchPlatformInfo.name, CozytouchPlatform, true);
}