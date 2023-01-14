import {LogProvider} from "../logging/log-provider";
import {ActiveObserversManager} from "../observation/active-observers-manager";

export const contentLogProvider = new LogProvider();
export const contentScriptObserversManager: ActiveObserversManager = new ActiveObserversManager();
