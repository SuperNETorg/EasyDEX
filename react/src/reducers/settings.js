import {
  GET_WIF_KEY,
  GET_DEBUG_LOG,
  LOAD_APP_CONFIG,
  LOAD_APP_INFO,
  CLI
} from '../actions/storeType';

export function Settings(state = {
  wifkey: null,
  address: null,
  debugLog: null,
  appSettings: null,
  appInfo: null,
  cli: null,
}, action) {
  switch (action.type) {
    case GET_WIF_KEY:
      return {
        ...state,
        wifkey: action.wifkey,
        address: action.address,
      };
    case GET_DEBUG_LOG:
      return {
        ...state,
        debugLog: action.data,
      };
    case LOAD_APP_CONFIG:
      return {
        ...state,
        appSettings: action.config,
      };
    case LOAD_APP_INFO:
      return {
        ...state,
        appInfo: action.info,
      };
    case CLI:
      return {
        ...state,
        cli: action.data,
      };
    default:
      return state;
  }
}

export default Settings;
