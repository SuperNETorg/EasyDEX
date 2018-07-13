import {
  DASHBOARD_SECTION_CHANGE,
  GET_MAIN_ADDRESS,
  DISPLAY_COIND_DOWN_MODAL,
  DISPLAY_CLAIM_INTEREST_MODAL,
  DASHBOARD_SYNC_ONLY_UPDATE,
  DISPLAY_IMPORT_KEY_MODAL,
  DASHBOARD_ELECTRUM_COINS,
  ELECTRUM_SERVER_CHANGED,
  DISPLAY_ZCASH_PARAMS_FETCH,
  PRICES,
} from '../actions/storeType';

export function Dashboard(state = {
  activeSection: 'wallets',
  activeHandle: null,
  displayCoindDownModal: false,
  displayClaimInterestModal: false,
  skipFullDashboardUpdate: false,
  displayImportKeyModal: false,
  electrumCoins: {},
  eletrumServerChanged: false,
  displayZcparamsModal: false,
  prices: null,
}, action) {
  switch (action.type) {
    case DASHBOARD_ELECTRUM_COINS:
      return {
        ...state,
        electrumCoins: action.electrumCoins,
      };
    case DASHBOARD_SECTION_CHANGE:
      return {
        ...state,
        activeSection: action.activeSection,
      };
    case GET_MAIN_ADDRESS:
      return {
        ...state,
        activeHandle: action.activeHandle,
      };
    case DISPLAY_ZCASH_PARAMS_FETCH:
      return {
        ...state,
        displayZcparamsModal: action.displayZcparamsModal,
      };
      break;
    case DISPLAY_COIND_DOWN_MODAL:
      return {
        ...state,
        displayCoindDownModal: action.displayCoindDownModal,
      };
      break;
    case DISPLAY_CLAIM_INTEREST_MODAL:
      return {
        ...state,
        displayClaimInterestModal: action.displayClaimInterestModal,
      };
      break;
    case DISPLAY_IMPORT_KEY_MODAL:
      return {
        ...state,
        displayImportKeyModal: action.displayImportKeyModal,
      };
      break;
    case DASHBOARD_SYNC_ONLY_UPDATE:
      return {
        ...state,
        skipFullDashboardUpdate: action.skipFullDashboardUpdate,
      };
    case ELECTRUM_SERVER_CHANGED:
      return {
        ...state,
        eletrumServerChanged: action.eletrumServerChanged,
      };
    case PRICES:
      return {
        ...state,
        prices: action.prices,
      };
    default:
      return state;
  }
}

export default Dashboard;
