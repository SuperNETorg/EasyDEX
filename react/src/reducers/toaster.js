import {
  ADD_TOASTER_MESSAGE,
  REMOVE_TOASTER_MESSAGE
} from '../actions/storeType';

export function toaster(state = {
  toasts: [],
}, action) {
  if (state === null) state = { toasts: [] };

  switch (action.type) {
    case ADD_TOASTER_MESSAGE:
      let _isSameToastTwice = false;

      function arrayToString(arr) {
        if (typeof arr === 'object') {
          return arr.join().toString();
        } else {
          return arr;
        }
      }

      for (let i = 0; i < state.toasts.length; i++) {
        if (state.toasts[i].title === action.title &&
            (arrayToString(action.message) === arrayToString(state.toasts[i].message) ||
            state.toasts[i].message === action.message) &&
            state.toasts[i]['_type'] === action['_type']) {
          _isSameToastTwice = true;
          break;
        }
      }

      if (!_isSameToastTwice) {
        return {
          ...state,
          toasts: [
            ...state.toasts,
            action
          ],
        };
      }
    case REMOVE_TOASTER_MESSAGE:
      // filter out the toastId that should be removed
      return {
        ...state,
        toasts: state.toasts.filter(t => t.toastId !== action.toastId),
      };
    default:
      return state;
  }
}

export default toaster;
