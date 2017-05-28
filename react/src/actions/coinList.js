import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function shepherdGetCoinList() {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/coinslist', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'shepherdGetCoinList', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}

export function shepherdPostCoinList(data) {
  return new Promise((resolve, reject) => {
    fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/coinslist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'payload': data }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'shepherdPostCoinList', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}