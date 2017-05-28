import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function deleteCacheFile(_payload) {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/groom?', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'filename': _payload.pubkey }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'deleteCacheFile', 'Error', 'error'))
    })
    .then(response => response.json())
    .then(json => dispatch(fetchNewCacheData(_payload)));
  }
}

export function getCacheFile(pubkey) {
  const _pubkey = pubkey || JSON.parse(sessionStorage.getItem('IguanaActiveAccount')).pubkey;

  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/groom?filename=' + _pubkey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getCacheFile', 'Error', 'error'))
    })
    .then(response => response.json())
    .then(json => resolve(json))
  })
}

export function fetchNewCacheData(_payload) {
  const _userpass = '?userpass=tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
        _pubkey = '&pubkey=' + _payload.pubkey,
        _route = _payload.allcoins ? 'cache-all' : 'cache-one',
        _coin = '&coin=' + _payload.coin,
        _calls = '&calls=' + _payload.calls,
        _address = _payload.address ? ('&address=' + _payload.address) : '',
        _iguanaInstancePort = Config.useBasiliskInstance ? '&port=' + (Config.iguanaCorePort + 1) : '';

  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/' + _route + _userpass + _pubkey + _coin + _calls + _address + _iguanaInstancePort, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'fetchNewCacheData', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }
}

export function getShepherdCache(pubkey, coin) {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/cache?pubkey=' + pubkey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getShepherdCache', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getShepherdCacheState(json, pubkey, coin)))
  }
}

function getShepherdCacheState(json, pubkey, coin) {
  if (json.result &&
      json.error &&
      json.result.indexOf('no file with handle') > -1) {
    return dispatch => {
      dispatch(fetchNewCacheData({
        'pubkey': pubkey,
        'allcoins': false,
        'coin': coin,
        'calls': 'listtransactions:getbalance',
      }));
    }
  } else {
    return {
      type: storeType.DASHBOARD_ACTIVE_COIN_GET_CACHE,
      cache: json && json.result && json.result.basilisk ? json.result.basilisk : null,
    }
  }
}

export function fetchUtxoCache(_payload) {
  const _userpass = '?userpass=tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
        _pubkey = '&pubkey=' + _payload.pubkey,
        _route = _payload.allcoins ? 'cache-all' : 'cache-one',
        _coin = '&coin=' + _payload.coin,
        _calls = '&calls=' + _payload.calls,
        _address = _payload.address ? ('&address=' + _payload.address) : '',
        _iguanaInstancePort = Config.useBasiliskInstance ? '&port=' + (Config.iguanaCorePort + 1) : '';

  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/' + _route + _userpass + _pubkey + _coin + _calls + _address + _iguanaInstancePort, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'fetchNewCacheData', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(getShepherdCache(_pubkey)))
  }
}

export function shepherdGroomPost(_filename, _payload) {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/groom/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'filename': _filename,
        'payload': JSON.stringify(_payload),
      }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'shepherdGroomPost', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }
}

export function shepherdGroomPostPromise(_filename, _payload) {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/groom/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'filename': _filename,
        'payload': JSON.stringify(_payload),
      }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'shepherdGroomPostPromise', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  })
}