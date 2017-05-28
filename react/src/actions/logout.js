import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

function logoutState(json, dispatch) {
  sessionStorage.removeItem('IguanaActiveAccount');

  return {
    type: storeType.LOGIN,
    isLoggedIn: false,
  }
}

export function logout() {
  return dispatch => {
    dispatch(walletLock());
  }
}

function walletLock() {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'bitcoinrpc',
    'method': 'walletlock',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'walletLock',
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
      dispatch(triggerToaster(true, 'walletLock', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(logoutState(json));
    })
  }
}