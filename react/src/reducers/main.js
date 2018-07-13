import {
  GET_ACTIVE_COINS,
  LOGIN,
  ACTIVE_HANDLE,
  DISPLAY_LOGIN_SETTINGS_MODAL,
  DISPLAY_NOTARY_ELECTIONS_MODAL,
} from '../actions/storeType';

export function Main(state = {
  isLoggedIn: false,
  displayLoginSettingsModal: false,
  displayNotaryElectionsModal: false,
  total: 0,
}, action) {
  switch (action.type) {
    case GET_ACTIVE_COINS:
      return {
        ...state,
        coins: action.coins,
        total: action.total,
      };
    case LOGIN:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
      };
    case ACTIVE_HANDLE:
      return {
        ...state,
        isLoggedIn: action.isLoggedIn,
        activeHandle: action.handle,
      };
    case DISPLAY_LOGIN_SETTINGS_MODAL:
      return {
        ...state,
        displayLoginSettingsModal: action.displayLoginSettingsModal,
      };
    case DISPLAY_NOTARY_ELECTIONS_MODAL:
      return {
        ...state,
        displayNotaryElectionsModal: action.displayNotaryElectionsModal,
      };
    default:
      return state;
  }
}

export default Main;