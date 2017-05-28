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

export function checkAddressBasilisk(coin, address) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'dex',
    'method': 'checkaddress',
    'address': address,
    'symbol': coin,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'checkAddressBasilisk',
      'type': 'post',
      'url': 'http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort),
      'payload': payload,
      'status': 'pending',
    }));

    return fetch('http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort), {
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
      dispatch(triggerToaster(true, 'checkAddressBasilisk', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(checkAddressBasiliskHandle(json));
    })
  }
}

function checkAddressBasiliskHandle(json) {
  if (json &&
      json.error) {
    return dispatch => {
      dispatch(triggerToaster(true, json.error, translate('TOASTR.WALLET_NOTIFICATION'), 'error'));
    }
  }

  if (json &&
      json.coin &&
      json.randipbits) {
    return dispatch => {
      dispatch(triggerToaster(true, 'Address already registered', translate('TOASTR.WALLET_NOTIFICATION'), 'warning'));
    }
  }
}

export function validateAddressBasilisk(coin, address) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'dex',
    'method': 'validateaddress',
    'address': address,
    'symbol': coin,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'validateAddressBasilisk',
      'type': 'post',
      'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
      'payload': payload,
      'status': 'pending',
    }));

    return fetch('http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort), {
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
      dispatch(triggerToaster(true, 'validateAddressBasilisk', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(validateAddressBasiliskHandle(json));
    })
  }
}

function validateAddressBasiliskHandle(json) {
  return dispatch => {
    if (json.iswatchonly === true) {
      dispatch(triggerToaster(true, translate('TOASTR.VALIDATION_SUCCESS'), translate('TOASTR.BASILISK_NOTIFICATION'), 'error'));
    }
    if (json.iswatchonly === false) {
      dispatch(triggerToaster(true, translate('TOASTR.ADDR_ISNT_REG'), translate('TOASTR.BASILISK_NOTIFICATION'), 'error'));
    }
    if (json.iswatchonly === undefined) {
      dispatch(triggerToaster(true, translate('TOASTR.INVALID_QUERY_ALT'), translate('TOASTR.BASILISK_NOTIFICATION'), 'error'));
    }
    if (json.error === 'less than required responses') {
      dispatch(triggerToaster(true, translate('TOASTR.LESS_RESPONSES_REQ'), translate('TOASTR.BASILISK_NOTIFICATION'), 'error'));
    }
  }
}