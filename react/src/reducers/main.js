import {
  GET_ACTIVE_COINS,
  LOGIN,
  ACTIVE_HANDLE
} from '../actions/storeType';

export function Main(state = {
  isLoggedIn: false,
  activeCoins: [],
}, action) {
  switch (action.type) {
    case GET_ACTIVE_COINS:
      return Object.assign({}, state, {
        activeCoins: action.activeCoins,
        coins: action.coins,
      });
    case LOGIN:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn,
      });
    case ACTIVE_HANDLE:
      return Object.assign({}, state, {
        isLoggedIn: action.isLoggedIn,
        activeHandle: action.handle,
      });
    default:
      return state;
  }
}

export default Main;
