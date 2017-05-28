import {
  GET_WIF_KEY,
  GET_PEERS_LIST,
  GET_DEBUG_LOG,
  LOAD_APP_CONFIG,
  LOAD_APP_INFO
} from '../actions/storeType';

export function Settings(state = {
  wifkey: null,
  address: null,
  debugLog: null,
  appSettings: null,
  appInfo: null,
}, action) {
  switch (action.type) {
    case GET_WIF_KEY:
      return Object.assign({}, state, {
        wifkey: action.wifkey,
        address: action.address,
      });
    case GET_PEERS_LIST:
      return Object.assign({}, state, {
        supernetPeers: action.supernetPeers,
        rawPeers: action.rawPeers,
      });
    case GET_DEBUG_LOG:
      return Object.assign({}, state, {
        debugLog: action.data,
      });
    case LOAD_APP_CONFIG:
      return Object.assign({}, state, {
        appSettings: action.config,
      });
    case LOAD_APP_INFO:
      return Object.assign({}, state, {
        appInfo: action.info,
      });
    default:
      return state;
  }
}

export default Settings;
