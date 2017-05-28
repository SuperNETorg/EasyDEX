import * as storeType from './storeType';
import {
  triggerToaster,
  Config,
  getPassthruAgent
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getKMDBalanceTotal(coin) {
  let payload;

  if (coin !== 'KMD' &&
      coin !== 'ZEC') {
    payload = {
      'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
      'agent': 'iguana',
      'method': 'passthru',
      'asset': coin,
      'function': 'z_gettotalbalance',
      'hex': '3000',
    };
  } else {
    payload = {
      'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
      'agent': getPassthruAgent(coin),
      'method': 'passthru',
      'function': 'z_gettotalbalance',
      'hex': '3000',
    };
  }

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getKMDBalanceTotal',
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
      dispatch(triggerToaster(true, 'getKMDBalanceTotal', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(function(json) { // TODO: figure out why komodod spits out "parse error"
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      if (json &&
          !json.error) {
        dispatch(getNativeBalancesState(json));
      }
    })
  }
}

export function getNativeBalancesState(json) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_NATIVE_BALANCE,
    balance: json && !json.error ? json : 0,
  }
}