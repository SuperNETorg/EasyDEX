import * as storeType from './storeType';
import {
  triggerToaster,
  Config,
  getNativeTxHistoryState
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function getBasiliskTransactionsList(coin, address) {
  const pubkey = JSON.parse(sessionStorage.getItem('IguanaActiveAccount')).pubkey;

  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/cache?pubkey=' + pubkey, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'getBasiliskTransactionsList+cache', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(function(json) {
      if (json.result &&
          !json.result.basilisk &&
          json.result.indexOf('no file with handle') > -1) {
        console.log('new cache');
      }

      json = json.result.basilisk;
      if (json[coin][address].listtransactions) {
        dispatch(getNativeTxHistoryState({ 'result': json[coin][address].listtransactions.data }));
      }
    })
  }
}