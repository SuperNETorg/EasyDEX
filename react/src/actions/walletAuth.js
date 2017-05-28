import * as storeType from './storeType';
import { translate } from '../translate/translate';
import {
  triggerToaster,
  Config,
  getMainAddressState
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function encryptWallet(_passphrase, cb, coin) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'bitcoinrpc',
    'method': 'encryptwallet',
    'passphrase': _passphrase,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'encryptWallet',
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
      dispatch(triggerToaster(true, 'encryptWallet', 'Error', 'error'));
    })
    .then(dispatch(walletPassphrase(_passphrase)))
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(cb.call(this, json, coin));
    });
  }
}

export function walletPassphrase(_passphrase) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'bitcoinrpc',
    'method': 'walletpassphrase',
    'password': _passphrase,
    'timeout': '300000',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'walletpassphrase',
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
      dispatch(triggerToaster(true, 'walletPassphrase', 'Error', 'error'));
    })
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
    })
  }
}

export function iguanaWalletPassphrase(_passphrase) {
  const _payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'handle': '',
    'password': _passphrase,
    'timeout': '2592000',
    'agent': 'bitcoinrpc',
    'method': 'walletpassphrase',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'iguanaWalletPassphrase',
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
      dispatch(triggerToaster(true, 'Error iguanaWalletPassphrase', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(iguanaWalletPassphraseState(json, dispatch));
    });
  }
}

export function iguanaActiveHandle(getMainAddress) {
  const _payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'SuperNET',
    'method': 'activehandle',
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'iguanaActiveHandle',
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
      dispatch(updateErrosStack('activeHandle'));
      dispatch(triggerToaster(true, translate('TOASTR.IGUANA_ARE_YOU_SURE'), translate('TOASTR.SERVICE_NOTIFICATION'), 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getMainAddress ? getMainAddressState(json) : iguanaActiveHandleState(json));
    });
  }
}

function iguanaWalletPassphraseState(json, dispatch) {
  sessionStorage.setItem('IguanaActiveAccount', JSON.stringify(json));
  dispatch(triggerToaster(true, translate('TOASTR.LOGIN_SUCCESSFULL'), translate('TOASTR.ACCOUNT_NOTIFICATION'), 'success'));
  dispatch(getMainAddressState(json));
  dispatch(iguanaActiveHandleState(json));

  return {
    type: storeType.LOGIN,
    isLoggedIn: json && json.pubkey ? true : false,
  }
}

function iguanaActiveHandleState(json) {
  return {
    type: storeType.ACTIVE_HANDLE,
    isLoggedIn: sessionStorage.getItem('IguanaActiveAccount') && JSON.parse(sessionStorage.getItem('IguanaActiveAccount')).pubkey === json.pubkey && json.status === 'unlocked' ? true : false,
    handle: json,
  }
}