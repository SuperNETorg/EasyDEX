import * as storeType from './storeType';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

export function resolveOpenAliasAddress(email) {
  const url = email.replace('@', '.');

  return new Promise((resolve, reject) => {
    fetch('https://dns.google.com/resolve?name=' + url + '&type=txt', {
      method: 'GET',
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'resolveOpenAliasAddress', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => resolve(json))
  });
}