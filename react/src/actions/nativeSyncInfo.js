import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getSyncInfoNativeKMD(skipDebug) {
  const coin = 'KMD';

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getSyncInfoNativeKMD',
      'type': 'post',
      'url': 'http://127.0.0.1:' + Config.iguanaCorePort + '/api/dex/getinfo?userpass=tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth') + '&symbol=' + coin,
      'payload': payload,
      'status': 'pending',
    }));

    return fetch('http://127.0.0.1:' + Config.iguanaCorePort + '/api/dex/getinfo?userpass=tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth') + '&symbol=' + coin, {
      method: 'GET',
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(triggerToaster(true, 'getSyncInfoNativeKMD', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getSyncInfoNativeState({ 'remoteKMDNode': json }));
    })
    .then(function() {
      if (!skipDebug) {
        dispatch(getDebugLog('komodo', 1));
      }
    })
  }
}

function getSyncInfoNativeState(json, coin, skipDebug) {
  if (coin === 'KMD' &&
      json &&
      json.error) {
    return getSyncInfoNativeKMD(skipDebug);
  } else {
    return {
      type: storeType.SYNCING_NATIVE_MODE,
      progress: json,
    }
  }
}

export function getSyncInfoNative(coin, skipDebug) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': getPassthruAgent(coin),
    'method': 'passthru',
    'asset': coin,
    'function': 'getinfo',
    'hex': '',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getSyncInfo',
      'type': 'post',
      'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
      'payload': payload,
      'status': 'pending',
    }));

    return fetch('http://127.0.0.1:' + Config.iguanaCorePort, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(triggerToaster(true, 'getSyncInfo', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getSyncInfoNativeState(json, coin, skipDebug));
    })
  }
}