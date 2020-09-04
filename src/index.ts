import {CozytouchPlatform, CozytouchPlatformInfo} from './cozytouch-platform';
import {API} from "homebridge";

export default function(homebridge: API) {
    homebridge.registerPlatform(CozytouchPlatformInfo.plugin, CozytouchPlatformInfo.name, CozytouchPlatform);
}
