import * as storeType from './storeType';
import {
  triggerToaster,
  Config,
  getPassthruAgent,
  getNativeTxHistoryState
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getNativeTxHistory(coin) {
  let payload;

  if (getPassthruAgent(coin) === 'iguana') {
    payload = {
      'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
      'agent': 'iguana',
      'method': 'passthru',
      'asset': coin,
      'function': 'listtransactions',
      'hex': '',
    };
  } else {
    payload = {
      'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
      'agent': getPassthruAgent(coin),
      'method': 'passthru',
      'function': 'listtransactions',
      'hex': '',
    };
  }

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getNativeTxHistory',
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
      dispatch(triggerToaster(true, 'getNativeTxHistory', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getNativeTxHistoryState(json));
    })
  }
}