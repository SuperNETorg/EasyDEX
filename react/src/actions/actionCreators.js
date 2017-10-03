import 'whatwg-fetch';
import 'bluebird';

import { translate } from '../translate/translate';
import {
  GET_ACTIVE_COINS,
  DASHBOARD_ACTIVE_ADDRESS,
  DASHBOARD_ACTIVE_SECTION,
  DASHBOARD_ACTIVE_TXINFO_MODAL,
  SYNCING_NATIVE_MODE,
  DASHBOARD_ACTIVE_COIN_SEND_FORM,
  DASHBOARD_ACTIVE_COIN_RECEIVE_FORM,
  DASHBOARD_ACTIVE_COIN_RESET_FORMS,
  ADD_TOASTER_MESSAGE,
  REMOVE_TOASTER_MESSAGE,
  DISPLAY_ADDCOIN_MODAL,
  GET_MAIN_ADDRESS,
  DASHBOARD_SECTION_CHANGE,
  DASHBOARD_ACTIVE_COIN_CHANGE,
  ACTIVE_COIN_GET_ADDRESSES,
  DASHBOARD_ACTIVE_COIN_NATIVE_TXHISTORY,
  DISPLAY_LOGIN_SETTINGS_MODAL,
  DISPLAY_COIND_DOWN_MODAL,
  DISPLAY_CLAIM_INTEREST_MODAL,
  START_INTERVAL,
  STOP_INTERVAL,
  GET_PIN_LIST,
  DASHBOARD_SYNC_ONLY_UPDATE,
  DISPLAY_IMPORT_KEY_MODAL,
} from './storeType';

export * from './actions/nativeSyncInfo';
export * from './actions/nativeSend';
export * from './actions/coinList';
// export * from './actions/createWallet';
//export * from './actions/nativeTxHistory';
//export * from './actions/nativeBalance';
export * from './actions/nativeNewAddress';
// export * from './actions/logout';
//export * from './actions/edexGetTx';
export * from './actions/settings';
// export * from './actions/edexBalance';
export * from './actions/addCoin';
//export * from './actions/addressBalance';
//export * from './actions/syncInfo';
//export * from './actions/getAddrByAccount';
// export * from './actions/walletAuth';
export * from './actions/copyAddress';
export * from './actions/sysInfo';
export * from './actions/dexCoins';
//export * from './actions/fullTxHistory';
export * from './actions/cli';
export * from './actions/update';
export * from './actions/jumblr';
export * from './actions/interest';
export * from './actions/nativeDashboardUpdate';
export * from './actions/getTxDetails';

export function changeActiveAddress(address) {
  return {
    type: DASHBOARD_ACTIVE_ADDRESS,
    address,
  }
}

export function toggleDashboardActiveSection(name) {
  return {
    type: DASHBOARD_ACTIVE_SECTION,
    section: name,
  }
}

export function toggleDashboardTxInfoModal(display, txIndex) {
  return {
    type: DASHBOARD_ACTIVE_TXINFO_MODAL,
    showTransactionInfo: display,
    showTransactionInfoTxIndex: txIndex,
  }
}

export function syncingNativeModeState(display, json) {
  return {
    type: SYNCING_NATIVE_MODE,
    syncingNativeMode: display,
    progress: json,
  }
}

export function toggleSendCoinFormState(display) {
  return {
    type: DASHBOARD_ACTIVE_COIN_SEND_FORM,
    send: display,
  }
}

export function toggleReceiveCoinFormState(display) {
  return {
    type: DASHBOARD_ACTIVE_COIN_RECEIVE_FORM,
    receive: display,
  }
}

export function toggleSendReceiveCoinFormsState() {
  return {
    type: DASHBOARD_ACTIVE_COIN_RESET_FORMS,
    send: false,
    receive: false,
  }
}

export function triggerToaster(message, title, _type, autoClose = true) {
  return {
    type: ADD_TOASTER_MESSAGE,
    message,
    title,
    _type,
    autoClose,
  }
}

// triggers removing of the toast with the provided toastId
export function dismissToaster(toastId) {
  return {
    type: REMOVE_TOASTER_MESSAGE,
    toastId: toastId,
  }
}

export function toggleAddcoinModalState(display, isLogin) {
  return {
    type: DISPLAY_ADDCOIN_MODAL,
    display: display,
    isLogin: isLogin,
  }
}

export function dashboardCoinsState(json) {
  return {
    type: GET_ACTIVE_COINS,
    coins: json,
    activeCoins: Object.keys(json.native).length ? true : false,
  }
}

export function getMainAddressState(json) {
  return {
    type: GET_MAIN_ADDRESS,
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
    type: DASHBOARD_SECTION_CHANGE,
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
    type: DASHBOARD_ACTIVE_COIN_CHANGE,
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

export function getNativeTxHistoryState(json) {
  if (json &&
      json.error) {
    json = null;
  } else if (json && json.result && json.result.length) {
    json = json.result;
  } else if (!json || (!json.result || !json.result.length)) {
    json = 'no data';
  }

  return {
    type: DASHBOARD_ACTIVE_COIN_NATIVE_TXHISTORY,
    txhistory: json,
  }
}

export function startInterval(name, handle) {
  return {
    type: START_INTERVAL,
    name,
    handle,
  }
}

export function stopInterval(name, intervals) {
  clearInterval(intervals[name]);

  return {
    type: STOP_INTERVAL,
    name,
  }
}

export function toggleCoindDownModal(display) {
  return {
    type: DISPLAY_COIND_DOWN_MODAL,
    displayCoindDownModal: display,
  }
}

export function toggleLoginSettingsModal(display) {
  return {
    type: DISPLAY_LOGIN_SETTINGS_MODAL,
    displayLoginSettingsModal: display,
  }
}

export function toggleClaimInterestModal(display) {
  return {
    type: DISPLAY_CLAIM_INTEREST_MODAL,
    displayClaimInterestModal: display,
  }
}

export function getPinList(pinList) {
  return {
    type: GET_PIN_LIST,
    pinList: pinList,
  }
}

export function skipFullDashboardUpdate(skip) {
  return {
    type: DASHBOARD_SYNC_ONLY_UPDATE,
    skipFullDashboardUpdate: skip,
  }
}

export function displayImportKeyModal(display) {
  return {
    type: DISPLAY_IMPORT_KEY_MODAL,
    displayImportKeyModal: display,
  }
}