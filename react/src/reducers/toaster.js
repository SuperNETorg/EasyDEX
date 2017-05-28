import {
  ADD_TOASTER_MESSAGE,
  REMOVE_TOASTER_MESSAGE
} from '../actions/storeType';

export function toaster(state = {
  toasts: [],
}, action) {
  if (state === null) state = {toasts: []};
  switch (action.type) {
    case ADD_TOASTER_MESSAGE:
      return {
        ...state,
        toasts: [...state.toasts, action]
      };
    case REMOVE_TOASTER_MESSAGE:
      // filter out the toastId that should be removed
      return {
        ...state,
        toasts: state.toasts.filter(t => t.toastId !== action.toastId)
      };
    default:
      return state;
  }
}

export default toaster;
