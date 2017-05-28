import * as storeType from './storeType';
import { translate } from '../translate/translate';
import {
  triggerToaster,
  Config,
  toggleAddcoinModal,
  getDexCoins
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';
import {
  startCurrencyAssetChain,
  startAssetChain,
  startCrypto,
  checkCoinType,
  checkAC
} from '../components/addcoin/payload';

export function addCoin(coin, mode, syncOnly, port) {
  if (mode === '-1') {
    return dispatch => {
      dispatch(shepherdGetConfig(coin, mode));
    }
  } else {
    if (checkCoinType(coin) === 'currency_ac') {
      const _acData = startCurrencyAssetChain('', coin, mode);

      return dispatch => {
        dispatch(iguanaAddCoin(coin, mode, _acData));
      }
    }
    if (checkCoinType(coin) === 'ac') {
      const _acData = startAssetChain('', coin, mode);

      return dispatch => {
        dispatch(iguanaAddCoin(coin, mode, _acData));
      }
    }
    if (checkCoinType(coin) === 'crypto') {
      const _acData = startCrypto('', coin, mode);

      if (syncOnly) {
        const modeToValue = {
          '1': 'full',
          '0': 'basilisk',
          '-1': 'native'
        };

        return dispatch => {
          startIguanaInstance(modeToValue[mode] + '/sync', coin)
          .then(function(json) {
            setTimeout(function() {
              console.log('started ' + coin + ' / ' + modeToValue[mode] + ' fork', json);
              dispatch(iguanaAddCoin(coin, mode, _acData, json.result));
            }, 2000);
          });
        }
      } else {
        if (port) {
          return dispatch => {
            dispatch(iguanaAddCoin(coin, mode, _acData, port));
          }
        } else {
          return dispatch => {
            dispatch(iguanaAddCoin(coin, mode, _acData));
          }
        }
      }
    }
  }
}

export function iguanaAddCoin(coin, mode, acData, port) {
  function _iguanaAddCoin(dispatch) {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'iguanaAddCoin',
      'type': 'post',
      'url': 'http://127.0.0.1:' + (port ? port : Config.iguanaCorePort),
      'payload': acData,
      'status': 'pending',
    }));

    return fetch('http://127.0.0.1:' + (port ? port : Config.iguanaCorePort), {
      method: 'POST',
      body: JSON.stringify(acData),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(triggerToaster(true, translate('TOASTR.FAILED_TO_ADDCOIN'), translate('TOASTR.ACCOUNT_NOTIFICATION'), 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(addCoinResult(coin, mode, acData));
    });
  }

  if (mode === 0) {
    return dispatch => {
      return _iguanaAddCoin(dispatch);
    }
  } else {
    return dispatch => {
      return _iguanaAddCoin(dispatch);
    }
  }
}

export function shepherdHerd(coin, mode, path) {
  let acData;
  let herdData = {
    'ac_name': coin,
    'ac_options': [
      '-daemon=0',
      '-server',
      '-ac_name=' + coin,
      '-addnode=78.47.196.146'
    ]
  };

  if (coin === 'ZEC') {
    herdData = {
      'ac_name': 'zcashd',
      'ac_options': [
        '-daemon=0',
        '-server=1'
      ]
    };
  }

  if (coin === 'KMD') {
    herdData = {
      'ac_name': 'komodod',
      'ac_options': [
        '-daemon=0',
        '-addnode=78.47.196.146'
      ]
    };
  }

  if (checkCoinType(coin) === 'crypto') {
    acData = startCrypto(path.result, coin, mode);
  }
  if (checkCoinType(coin) === 'currency_ac') {
    acData = startCurrencyAssetChain(path.result, coin, mode);
  }
  if (checkCoinType(coin) === 'ac') {
    acData = startAssetChain(path.result, coin, mode);
    const supply = startAssetChain(path.result, coin, mode, true);
    herdData.ac_options.push('-ac_supply=' + supply);
  }

  console.log('herdData', herdData);
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/herd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'herd': coin !== 'ZEC' ? 'komodod' : 'zcashd',
        'options': herdData
      }),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, translate('FAILED_SHEPHERD_HERD'), translate('TOASTR.SERVICE_NOTIFICATION'), 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(iguanaAddCoin(coin, mode, acData)));
  }
}

export function addCoinResult(coin, mode) {
  const modeToValue = {
    '1': 'full',
    '0': 'basilisk',
    '-1': 'native'
  };

  return dispatch => {
    dispatch(triggerToaster(true, coin + ' ' + translate('TOASTR.STARTED_IN') + ' ' + modeToValue[mode] + ' ' + translate('TOASTR.MODE'), translate('TOASTR.COIN_NOTIFICATION'), 'success'));
    dispatch(toggleAddcoinModal(false, false));
    dispatch(getDexCoins());
  }
}

export function _shepherdGetConfig(coin, mode) {
  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/getconf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 'chain': 'komodod' })
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'Failed to get mode config', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(shepherdHerd(coin, mode, json)));
  }
}

export function shepherdGetConfig(coin, mode) {
  if (coin === 'KMD' &&
      mode === '-1') {
    return dispatch => {
      return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/getconf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'chain': 'komodod' })
      })
      .catch(function(error) {
        console.log(error);
        dispatch(triggerToaster(true, 'Failed to get KMD config', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(json => dispatch(shepherdHerd(coin, mode, json)))
    }
  } else {
    return dispatch => {
      return fetch('http://127.0.0.1:' + Config.agamaPort + '/shepherd/getconf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'chain': coin })
      })
      .catch(function(error) {
        console.log(error);
        dispatch(triggerToaster(true, 'Failed to get mode config', 'Error', 'error'));
      })
      .then(response => response.json())
      .then(json => dispatch(shepherdHerd(coin, mode, json)));
    }
  }
}