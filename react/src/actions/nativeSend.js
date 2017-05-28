import * as storeType from './storeType';
import { translate } from '../translate/translate';
import {
  triggerToaster,
  Config,
  getPassthruAgent,
  iguanaHashHex
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function sendNativeTx(coin, _payload) {
  let ajax_data_to_hex;
  let payload;
  let _apiMethod;

  if (_payload.addressType === 'public') {
    _apiMethod = 'sendtoaddress';
    ajax_data_to_hex = '["' + _payload.sendTo + '", ' + (Number(_payload.amount) - Number(_payload.fee)) + ']';
  } else {
    _apiMethod = 'z_sendmany';
    ajax_data_to_hex = '["' + _payload.sendFrom + '",[{"address":"' + _payload.sendTo + '","amount":' + (Number(_payload.amount) - Number(_payload.fee)) + '}]]';
  }

  return dispatch => {
    return iguanaHashHex(ajax_data_to_hex, dispatch).then((hashHexJson) => {
      if (getPassthruAgent(coin) === 'iguana') {
        payload = {
          'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
          'agent': getPassthruAgent(coin),
          'method': 'passthru',
          'asset': coin,
          'function': _apiMethod,
          'hex': hashHexJson,
        };
      } else {
        payload = {
          'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
          'agent': getPassthruAgent(coin),
          'method': 'passthru',
          'function': _apiMethod,
          'hex': hashHexJson,
        };
      }

      const _timestamp = Date.now();
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'sendNativeTx',
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
        dispatch(triggerToaster(true, 'sendNativeTx', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(function(json) {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'success',
          'response': json,
        }));

        if (json.error &&
            json.error.toString().indexOf('code:') > -1) {
          dispatch(triggerToaster(true, 'Send failed', translate('TOASTR.WALLET_NOTIFICATION'), 'error'));
        } else {
          dispatch(triggerToaster(true, translate('TOASTR.TX_SENT_ALT'), translate('TOASTR.WALLET_NOTIFICATION'), 'success'));
        }
      })
      .catch(function(ex) {
        dispatch(triggerToaster(true, translate('TOASTR.TX_SENT_ALT'), translate('TOASTR.WALLET_NOTIFICATION'), 'success'));
        console.log('parsing failed', ex);
      })
    });
  }
}

export function getKMDOPIDState(json) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_NATIVE_OPIDS,
    opids: json,
  }
}

export function getKMDOPID(opid, coin) {
  let tmpopid_output = '',
      ajax_data_to_hex;

  if (opid === undefined) {
    ajax_data_to_hex = null;
  } else {
    ajax_data_to_hex = '["' + opid + '"]';
  }

  return dispatch => {
    return iguanaHashHex(ajax_data_to_hex, dispatch).then((hashHexJson) => {
      if (hashHexJson === '5b226e756c6c225d00') {
        hashHexJson = '';
      }

      let payload,
          passthru_agent = getPassthruAgent(coin),
          tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');

      if (passthru_agent == 'iguana') {
        payload = {
          'userpass': tmpIguanaRPCAuth,
          'agent': passthru_agent,
          'method': 'passthru',
          'asset': coin,
          'function': 'z_getoperationstatus',
          'hex': hashHexJson,
        };
      } else {
        payload = {
          'userpass': tmpIguanaRPCAuth,
          'agent': passthru_agent,
          'method': 'passthru',
          'function': 'z_getoperationstatus',
          'hex': hashHexJson,
        };
      }

      const _timestamp = Date.now();
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'function': 'getKMDOPID',
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
        dispatch(triggerToaster(true, 'getKMDOPID', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(json => {
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'status': 'success',
          'response': json,
        }));
        dispatch(getKMDOPIDState(json));
      })
    })
  }
}