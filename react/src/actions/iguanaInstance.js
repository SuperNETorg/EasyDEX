import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function restartIguanaInstance(pmid) {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/forks/restart?pmid=' + pmid, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'restartIguanaInstance', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function restartBasiliskInstance() {
  return dispatch => {
    getIguanaInstancesList()
    .then(function(json) {
      for (let port in json.result) {
        if (json.result[port].mode === 'basilisk') {
          restartIguanaInstance(json.result[port].pmid)
          .then(function(json) {
            console.log('restartBasiliskInstance', json);
          });
        }
      }
    });
  }
}

export function startIguanaInstance(mode, coin) {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/forks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        coin
      }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'startIguanaInstance', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function getIguanaInstancesList() {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/forks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getIguanaInstanceList', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}