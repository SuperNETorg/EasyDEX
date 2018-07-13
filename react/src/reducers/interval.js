import {
  START_INTERVAL,
  STOP_INTERVAL
} from '../actions/storeType'

export function Interval(state = {
  interval: {},
}, action) {
  let newIntervalState = Object.assign({}, state.interval);

  switch (action.type) {
    case START_INTERVAL:
      newIntervalState[action.name] = action.handle;

      return {
        ...state,
        interval: newIntervalState,
      };
    case STOP_INTERVAL:
      newIntervalState[action.name] = null;

      return {
        ...state,
        interval: newIntervalState,
      };
    default:
      return state;
  }
}

export default Interval;
