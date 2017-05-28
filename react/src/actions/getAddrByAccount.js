import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getAddressesByAccountState(json, coin, mode) {
  if (mode === 'full' ||
      mode === 'basilisk') {
    let publicAddressArray = [];

    for (let i = 0; i < json.result.length; i++) {
      publicAddressArray.push({
        'address': json.result[i],
        'amount': 'N/A'
      });
    }

    json.result = publicAddressArray;
  }

  return {
    type: storeType.ACTIVE_COIN_GET_ADDRESSES,
    addresses: { 'public': json.result },
  }
}

export function getAddressesByAccount(coin, mode) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'coin': coin,
    'agent': 'bitcoinrpc',
    'method': 'getaddressesbyaccount',
    'account': '*',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getAddressesByAccount',
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
      dispatch(updateErrosStack('activeHandle'));
      dispatch(triggerToaster(true, 'getAddressesByAccount', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getAddressesByAccountState(json, coin, mode));
    })
  }
}