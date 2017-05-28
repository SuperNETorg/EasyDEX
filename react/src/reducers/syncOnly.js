import {
  SYNC_ONLY_MODAL_TOGGLE,
  SYNC_ONLY_DATA
} from '../actions/storeType';

export function SyncOnly(state = {
  display: false,
  forks: null
}, action) {
  switch (action.type) {
    case SYNC_ONLY_MODAL_TOGGLE:
      return Object.assign({}, state, {
        display: action.display,
      });
    case SYNC_ONLY_DATA:
      return Object.assign({}, state, {
        forks: action.forks,
      });
    default:
      return state;
  }
}

export default SyncOnly;
