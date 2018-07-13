import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { AddCoin } from './addcoin';
import { toaster } from './toaster';
import { Main } from './main';
import { Dashboard } from './dashboard';
import { ActiveCoin } from './activeCoin';
import { Settings } from './settings';
import { Interval } from './interval';
import { Login } from './login';
import { Dex } from './dex';

const appReducer = combineReducers({
  AddCoin,
  toaster,
  Main,
  Dashboard,
  ActiveCoin,
  Settings,
  Interval,
  Login,
  Dex,
  routing: routerReducer,
});

// reset app state on logout
const initialState = appReducer({}, {});
const rootReducer = (state, action) => {
  /*if (action.type === 'LOGOUT') {
    state = initialState;
  }*/

  return appReducer(state, action);
}

export default rootReducer;
