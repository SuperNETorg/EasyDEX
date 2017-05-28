import { copyToClipboard } from '../util/copyToClipboard';
import { translate } from '../translate/translate';
import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';

export function copyCoinAddress(address) {
  const _result = copyToClipboard(address);

  if (_result) {
    return dispatch => {
      dispatch(triggerToaster(true, translate('DASHBOARD.ADDR_COPIED'), translate('TOASTR.COIN_NOTIFICATION'), 'success'));
    }
  } else {
    return dispatch => {
      dispatch(triggerToaster(true, 'Couldn\'t copy address to clipboard', translate('TOASTR.COIN_NOTIFICATION'), 'error'));
    }
  }
}