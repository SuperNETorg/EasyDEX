import 'whatwg-fetch';
import 'bluebird';

import _config from '../config';
import { translate } from '../translate/translate';
import * as storeType from './storeType';
import {
  logGuiHttp,
  getAgamaLog,
  guiLogState
} from './log';

export * from './nativeSyncInfo';
export * from './basiliskCache';
export * from './nativeSend';
export * from './coinList';
export * from './syncOnly';
export * from './createWallet';
export * from './nativeTxHistory';
export * from './nativeBalance';
export * from './nativeNewAddress';
export * from './logout';
export * from './syncOnly';
export * from './basiliskProcessAddress';
export * from './edexGetTx';
export * from './sendFullBasilisk';
export * from './settings';
export * from './syncOnly';
export * from './iguanaInstance';
export * from './notary';
export * from './edexBalance';
export * from './addCoin';
export * from './addressBalance';
export * from './syncInfo';
export * from './getAddrByAccount';
export * from './atomic';
export * from './walletAuth';
export * from './openAlias';
export * from './copyAddress';
export * from './sysInfo';
export * from './dexCoins';
export * from './fullTxHistory';
export * from './basiliskTxHistory';
export * from './iguanaHelpers';

export let Config;

try {
  Config = window.require('electron').remote.getCurrentWindow().appConfig;
} catch (e) {
  Config = _config;
}

export function changeActiveAddress(address) {
  return {
    type: storeType.DASHBOARD_ACTIVE_ADDRESS,
    address,
  }
}

export function updateErrosStack(method) {
  return {
    apiMethod: method,
  }
}

export function toggleViewCacheModal(display) {
  return {
    type: storeType.VIEW_CACHE_DATA,
    display,
  }
}

export function displayNotariesModal(display) {
  return {
    type: storeType.DASHBOARD_DISPLAY_NOTARIES_MODAL,
    display,
  }
}

export function changeMainBasiliskAddress(address) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_MAIN_BASILISK_ADDR,
    address,
  }
}

export function toggleDashboardActiveSection(name) {
  return {
    type: storeType.DASHBOARD_ACTIVE_SECTION,
    section: name,
  }
}

export function toggleDashboardTxInfoModal(display, txIndex) {
  return {
    type: storeType.DASHBOARD_ACTIVE_TXINFO_MODAL,
    showTransactionInfo: display,
    showTransactionInfoTxIndex: txIndex,
  }
}

export function basiliskConnectionState(display, json) {
  return {
    type: storeType.BASILISK_CONNECTION,
    basiliskConnection: display,
    progress: json,
  }
}

export function basiliskRefreshState(display, json) {
  return {
    type: storeType.BASILISK_REFRESH,
    basiliskRefresh: display,
    progress: json,
  }
}

export function basiliskRefresh(display) {
  return dispatch => {
    dispatch(basiliskRefreshState(display));
  }
}

export function basiliskConnection(display) {
  return dispatch => {
    dispatch(basiliskConnectionState(display));
  }
}

export function syncingNativeModeState(display, json) {
  return {
    type: storeType.SYNCING_FULL_MODE,
    syncingNativeMode: display,
    progress: json,
  }
}

export function syncingFullModeState(display, json) {
  return {
    type: storeType.SYNCING_NATIVE_MODE,
    syncingFullMode: display,
    progress: json,
  }
}

export function toggleSendCoinFormState(display) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_SEND_FORM,
    send: display,
  }
}

export function toggleReceiveCoinFormState(display) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_RECEIVE_FORM,
    receive: display,
  }
}

export function toggleSendReceiveCoinFormsState() {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_RESET_FORMS,
    send: false,
    receive: false,
  }
}

export function triggerToaster(display, message, title, _type) {
  return {
    type: storeType.ADD_TOASTER_MESSAGE,
    display,
    message,
    title,
    _type,
  }
}

// triggers removing of the toast with the provided toastId
export function dismissToaster(toastId) {
  return {
    type: storeType.REMOVE_TOASTER_MESSAGE,
    toastId: toastId
  }
}

export function toggleAddcoinModalState(display, isLogin) {
  return {
    type: storeType.DISPLAY_ADDCOIN_MODAL,
    display: display,
    isLogin: isLogin,
  }
}

export function dashboardCoinsState(json) {
  return {
    type: storeType.GET_ACTIVE_COINS,
    coins: json,
    activeCoins: Object.keys(json.native).length || Object.keys(json.basilisk).length || Object.keys(json.full).length ? true : false
  }
}

export function getMainAddressState(json) {
  return {
    type: storeType.GET_MAIN_ADDRESS,
    activeHandle: json,
  }
}

export function toggleSendCoinForm(display) {
  return dispatch => {
    dispatch(toggleSendCoinFormState(display));
  }
}

export function toggleReceiveCoinForm(display) {
  return dispatch => {
    dispatch(toggleReceiveCoinFormState(display));
  }
}

export function toggleSendReceiveCoinForms() {
  return dispatch => {
    dispatch(toggleSendReceiveCoinFormsState());
  }
}

export function dashboardChangeSectionState(sectionName) {
  return {
    type: storeType.DASHBOARD_SECTION_CHANGE,
    activeSection: sectionName,
  }
}

export function dashboardChangeSection(sectionName) {
  return dispatch => {
    dispatch(dashboardChangeSectionState(sectionName));
  }
}

export function dashboardChangeActiveCoinState(coin, mode) {
  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_CHANGE,
    coin: coin,
    mode: mode,
  }
}

export function dashboardChangeActiveCoin(coin, mode) {
  return dispatch => {
    dispatch(dashboardChangeActiveCoinState(coin, mode));
  }
}

export function toggleAddcoinModal(display, isLogin) {
  return dispatch => {
    dispatch(toggleAddcoinModalState(display, isLogin));
  }
}


export function dismissToasterMessage(toastId) {
  return dispatch => {
    dispatch(dismissToaster(toastId))
  }
}

// TODO
export function rpcErrorHandler(json, dispatch) {
  console.log('json', json);
  if (json &&
      json.error) {
    if (json.error === 'bitcoinrpc needs coin that is active') {
      dispatch(triggerToaster(true, 'No active coin', translate('TOASTR.SERVICE_NOTIFICATION'), 'error'));
    }
  }
}

export function setBasiliskMainAddress(json, coin, mode) {
  if (mode === 'full') {
    let publicAddressArray = [];

    for (let i = 0; i < json.result.length; i++) {
      publicAddressArray.push({
        'address': json.result[i],
        'amount': 'N/A'
      });
    }

    json.result = publicAddressArray;
  }

  if (mode === 'basilisk') {
    getDexBalance(coin, mode, json.result);
  }

  return {
    type: storeType.ACTIVE_COIN_GET_ADDRESSES,
    addresses: { 'public': [] },
  }
}

export function getNativeTxHistoryState(json) {
  if (json &&
      json.error) {
    json = null;
  } else if (json && json.result) {
    json = json.result;
  } else if (!json.length) {
    json = 'no data';
  }

  return {
    type: storeType.DASHBOARD_ACTIVE_COIN_NATIVE_TXHISTORY,
    txhistory: json,
  }
}

export function startInterval(name, handle) {
  return {
    type: storeType.START_INTERVAL,
    name,
    handle,
  }
}

export function stopInterval(name, intervals) {
  clearInterval(intervals[name]);

  return {
    type: storeType.STOP_INTERVAL,
    name,
  }
}