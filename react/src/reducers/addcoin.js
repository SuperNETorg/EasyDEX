import { DISPLAY_ADDCOIN_MODAL } from '../actions/storeType';

export function AddCoin(state = {
  display: false,
  isLogin: false,
}, action) {
  switch (action.type) {
    case DISPLAY_ADDCOIN_MODAL:
      return {
        ...state,
        display: action.display,
        isLogin: action.isLogin,
      };
    default:
      return state;
	}
}

export default AddCoin;
