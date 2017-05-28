import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

// TODO: add custom json parser
function getSyncInfoState(json) {
  try {
    JSON.parse(json);
    json = JSON.parse(json);
  } catch(e) {
    //
  }

  return {
    type: storeType.SYNCING_FULL_MODE,
    progress: json,
  }
}

export function getSyncInfo(coin) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'coin': coin,
    'agent': 'bitcoinrpc',
    'method': 'getinfo',
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
    .then(function(response) {
      const _response = response.text().then(function(text) { return text; });

      return _response;
    })
    .then(function(json) {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      if (json.indexOf('coin is busy processing') === -1) {
        dispatch(getSyncInfoState(json, dispatch));
      }
    })
  }
}