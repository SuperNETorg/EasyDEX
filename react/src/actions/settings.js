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

function getAppInfoState(json) {
  return {
    type: storeType.LOAD_APP_INFO,
    info: json,
  }
}

export function getAppInfo() {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/appinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getAppInfo', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getAppInfoState(json)))
  }
}

export function settingsWifkeyState(json, coin) {
  return {
    type: storeType.GET_WIF_KEY,
    wifkey: json[coin + 'wif'],
    address: json[coin],
  }
}

function parseImportPrivKeyResponse(json, dispatch) {
  if (json.error === 'illegal privkey') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Illegal privkey', translate('TOASTR.SETTINGS_NOTIFICATION'), 'error'));
    }
  }
  if (json.error === 'privkey already in wallet') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Privkey already in wallet', translate('TOASTR.SETTINGS_NOTIFICATION'), 'warning'));
    }
  }
  if (json &&
      json.result !== undefined &&
      json.result == 'success') {
    return dispatch => {
      dispatch(triggerToaster(true, translate('TOASTR.PRIV_KEY_IMPORTED'), translate('TOASTR.SETTINGS_NOTIFICATION'), 'success'));
    }
  }
}

export function importPrivKey(wifKey) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'method': 'importprivkey',
    'params': [
      wifKey,
      'imported'
    ],
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'importPrivKey',
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
      dispatch(triggerToaster(true, 'importPrivKey', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(parseImportPrivKeyResponse(json, dispatch));
    })
    .catch(function(ex) {
      dispatch(parseImportPrivKeyResponse({
        'error': 'privkey already in wallet'
      }, dispatch));
      console.log('parsing failed', ex);
    })
  }
}

function getDebugLogState(json) {
  const _data = json.result.replace('\n', '\r\n');

  return {
    type: storeType.GET_DEBUG_LOG,
    data: _data,
  }
}

export function getDebugLog(target, linesCount) {
  const payload = {
    'herdname': target,
    'lastLines': linesCount
  };

  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/debuglog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getDebugLog', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getDebugLogState(json)))
  }
}

export function getPeersList(coin) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'SuperNET',
    'method': 'getpeers',
    'activecoin': coin,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getPeersList',
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
      dispatch(triggerToaster(true, 'getPeersList', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getPeersListState(json, dispatch));
    })
  }
}

export function getPeersListState(json) {
  let peersList = {};

  if (json &&
      json.rawpeers &&
      json.rawpeers.length) {
    for (let i = 0; i < json.rawpeers.length; i++) {
      peersList[json.rawpeers[i].coin] = json.rawpeers[i].peers;
    }
  }

  return {
    type: storeType.GET_PEERS_LIST,
    supernetPeers: json && json.supernet[0] ? json.supernet : null,
    rawPeers: peersList,
  }
}

function addPeerNodeState(json, dispatch) {
  if (json.error === 'addnode needs active coin, do an addcoin first') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Addnode needs active coin', translate('TOASTR.SETTINGS_NOTIFICATION'), 'error'));
    }
  }
  if (json.result === 'peer was already connected') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Peer was already connected', translate('TOASTR.SETTINGS_NOTIFICATION'), 'warning'));
    }
  }
  if (json.result === 'addnode connection was already pending') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Addnode connection was already pending', translate('TOASTR.SETTINGS_NOTIFICATION'), 'warning'));
    }
  }
  if (json.result === 'addnode submitted') {
    return dispatch => {
      dispatch(triggerToaster(true, 'Peer is added', translate('TOASTR.SETTINGS_NOTIFICATION'), 'success'));
    }
  }
}

export function addPeerNode(coin, ip) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'iguana',
    'method': 'addnode',
    'activecoin': coin,
    'ipaddr': ip,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'addPeerNode',
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
      dispatch(triggerToaster(true, 'addPeerNode', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(addPeerNodeState(json, dispatch));
    })
  }
}

export function saveAppConfig(_payload) {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/appconf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'payload': _payload }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'saveAppConfig', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getAppConfig()))
  }
}

function getAppConfigState(json) {
  return {
    type: storeType.LOAD_APP_CONFIG,
    config: json,
  }
}

export function getAppConfig() {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/appconf', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getAppConfig', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getAppConfigState(json)))
  }
}