import * as storeType from './storeType';
import { translate } from '../translate/translate';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function sendToAddress(coin, _payload) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'coin': coin,
    'method': 'sendtoaddress',
    'params': [
      _payload.sendTo,
      _payload.amount,
      'EasyDEX',
      'EasyDEXTransaction'
    ],
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'sendToAddress',
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
      dispatch(triggerToaster(true, 'sendToAddress', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(sendToAddressState(json, dispatch));
    })
  }
}

export function sendFromAddress(coin, _payload) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'coin': coin,
    'method': 'sendfrom',
    'params': [
      _payload.sendFrom,
      _payload.sendTo,
      _payload.amount,
      'EasyDEX',
      'EasyDEXTransaction'
    ],
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'sendFromAddress',
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
      dispatch(triggerToaster(true, 'sendFromAddress', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(sendToAddressState(json, dispatch));
    })
  }
}

export function iguanaUTXORawTX(data) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'symbol': data.coin,
    'agent': 'basilisk',
    'method': 'utxorawtx',
    'vals': {
      'timelock': 0,
      'changeaddr': data.sendfrom,
      'destaddr': data.sendtoaddr,
      'txfee': data.txfee,
      'amount': data.amount,
      'sendflag': data.sendsig
    },
    'utxos': data.utxos,
  };
  console.log('iguanaUTXORawTXExport', payload);

  return new Promise((resolve, reject) => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'iguanaUTXORawTX',
      'type': 'post',
      'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
      'payload': payload,
      'status': 'pending',
    }));

    fetch('http://127.0.0.1:' + Config.iguanaCorePort, {
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
      dispatch(triggerToaster(true, 'iguanaUTXORawTX', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      resolve(json);
    })
  });
}

export function dexSendRawTX(data) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'dex',
    'method': 'sendrawtransaction',
    'signedtx': data.signedtx,
    'symbol': data.coin
  };

  return new Promise((resolve, reject) => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'dexSendRawTX',
      'type': 'post',
      'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
      'payload': payload,
      'status': 'pending',
    }));

    fetch('http://127.0.0.1:' + Config.iguanaCorePort, {
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
      dispatch(triggerToaster(true, 'dexSendRawTX', 'Error', 'error'));
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
      resolve(json);
    })
  });
}

function sendToAddressState(json, dispatch) {
  if (json &&
      json.error) {
    dispatch(triggerToaster(true, json.error, 'Error', 'error'));

    return {
      type: storeType.DASHBOARD_ACTIVE_COIN_SENDTO,
      lastSendToResponse: json,
    }
  } else if (json && json.result && json.complete) {
    dispatch(triggerToaster(true, translate('TOASTR.TX_SENT_ALT'), translate('TOASTR.WALLET_NOTIFICATION'), 'success'));

    return {
      type: storeType.DASHBOARD_ACTIVE_COIN_SENDTO,
      lastSendToResponse: json,
    }
  }
}

export function sendToAddressStateAlt(json) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_SENDTO,
    lastSendToResponse: json,
  }
}

export function clearLastSendToResponseState() {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_SENDTO,
    lastSendToResponse: null,
  }
}