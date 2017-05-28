import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function iguanaEdexBalance(coin) {
  const _payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'bitcoinrpc',
    'method': 'getbalance',
    'coin': coin,
  };

  return dispatch => {
    if (coin) {
      const _timestamp = Date.now();
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'iguanaEdexBalance',
        'type': 'post',
        'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
        'payload': _payload,
        'status': 'pending',
      }));

      return fetch('http://127.0.0.1:' + Config.iguanaCorePort, {
        method: 'POST',
        body: JSON.stringify(_payload),
      })
      .catch(function(error) {
        console.log(error);
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'error',
          'response': error,
        }));
        dispatch(triggerToaster(true, 'Error iguanaEdexBalance', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(json => dispatch(iguanaEdexBalanceState(json)));
    }
  }
}

function iguanaEdexBalanceState(json) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_BALANCE,
    balance: json && json.result ? json.result : 0,
  }
}

export function getDexBalance(coin, mode, addr) {
  Promise.all(addr.map((_addr, index) => {
    const payload = {
      'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
      'agent': 'dex',
      'method': 'listunspent',
      'address': _addr,
      'symbol': coin,
    };

    return new Promise((resolve, reject) => {
      const _timestamp = Date.now();
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'getDexBalance',
        'type': 'post',
        'url': 'http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort),
        'payload': payload,
        'status': 'pending',
      }));

      fetch('http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort), {
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
        dispatch(triggerToaster(true, 'getDexBalance', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'success',
          'response': json,
        }));
      })

      resolve(index);
    });
  }))
  .then(result => {
    console.log(result);
  });
}