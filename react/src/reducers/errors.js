import {
  SERVICE_ERROR
} from '../actions/storeType';

export function Errors(state = {
  errors: {},
}, action) {
  switch (action.type) {
    case SERVICE_ERROR:
      let _errors = Object.assign({}, state);

      if (_errors[action.apiMethod]) {
        _errors[action.apiMethod]++;
      } else {
        _errors[action.apiMethod] = 1;
      }

      return Object.assign({}, state, {
        errors: _errors,
      });
    default:
      return state;
  }
}

export default Errors;
