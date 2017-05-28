import * as storeType from './storeType';
import { translate } from '../translate/translate';
import {
  triggerToaster,
  Config
} from './actionCreators';
import {
  logGuiHttp,
  guiLogState
} from './log';

function initNotaryNodesConSequence(nodes) {
  return dispatch => {
    Promise.all(nodes.map((node, index) => {
      const payload = {
        'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
        'agent': 'dex',
        'method': 'getinfo',
        'symbol': node,
        'timeout': 10000
      };

      return new Promise((resolve, reject) => {
        const _timestamp = Date.now();
        dispatch(logGuiHttp({
          'timestamp': _timestamp,
          'function': 'initNotaryNodesConSequence+' + node,
          'type': 'post',
          'url': 'http://127.0.0.1:' + Config.iguanaCorePort,
          'payload': payload,
          'status': 'pending',
        }));

        fetch('http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort) + '/api/dex/getinfo?userpass=' + ('tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth')) + '&symbol=' + node, {
          method: 'GET',
        })
        .catch(function(error) {
          console.log(error);
          dispatch(logGuiHttp({
            'timestamp': _timestamp,
            'status': 'error',
            'response': error,
          }));
          dispatch(triggerToaster(true, 'getInfoDexNode+' + node, 'Error', 'error'));
        })
        .then(response => response.json())
        .then(json => {
          dispatch(logGuiHttp({
            'timestamp': _timestamp,
            'status': 'success',
            'response': json,
          }));
          dispatch(updateNotaryNodeConState(json, nodes.length, index, node));
        })
      });
    }));
  }
}

function updateNotaryNodeConState(json, totalNodes, currentNodeIndex, currentNodeName) {
  if (currentNodeIndex === totalNodes - 1) {
    return dispatch => {
      dispatch(basiliskConnectionState(false));
    };
  } else {
    if (json &&
        json.error === 'less than required responses') {
      return {
        type: storeType.DASHBOARD_CONNECT_NOTARIES,
        total: totalNodes - 1,
        current: currentNodeIndex,
        name: currentNodeName,
        failedNode: currentNodeName,
      }
    } else {
      return {
        type: storeType.DASHBOARD_CONNECT_NOTARIES,
        total: totalNodes - 1,
        current: currentNodeIndex,
        name: currentNodeName,
      }
    }
  }
}

function connectAllNotaryNodes(json, dispatch) {
  if (json &&
      json.length) {
    dispatch(initNotaryNodesConSequence(json));

    return {
      type: storeType.DASHBOARD_CONNECT_NOTARIES,
      total: json.length - 1,
      current: 0,
      name: json[0],
    }
  }
}

export function connectNotaries() {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'dpow',
    'method': 'notarychains',
  };

  return dispatch => {
    return fetch('http://127.0.0.1:' + Config.iguanaCorePort, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(triggerToaster(true, 'connectNotaries', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => dispatch(connectAllNotaryNodes(json, dispatch)))
  }
}

function getDexNotariesState(json) {
  if (json.error === 'less than required responses') {
    return dispatch => {
      dispatch(triggerToaster(true, translate('TOASTR.LESS_RESPONSES_REQ'), translate('TOASTR.BASILISK_NOTIFICATION'), 'error'));
    }
  } else {
    return {
      type: storeType.DASHBOARD_GET_NOTARIES_LIST,
      notaries: json,
    }
  }
}

export function getDexNotaries(coin) {
  const payload = {
    'userpass': 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
    'agent': 'dex',
    'method': 'getnotaries',
    'symbol': coin,
  };

  return dispatch => {
    const _timestamp = Date.now();
    dispatch(logGuiHttp({
      'timestamp': _timestamp,
      'function': 'getDexNotaries',
      'type': 'post',
      'url': 'http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort),
      'payload': payload,
      'status': 'pending',
    }));
    return fetch('http://127.0.0.1:' + (Config.useBasiliskInstance ? Config.iguanaCorePort + 1 : Config.iguanaCorePort), {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    .catch(function(error) {
      console.log(error);
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'error',
        'response': error,
      }));
      dispatch(triggerToaster(true, 'getDexNotaries', 'Error', 'error'));
    })
    .then(response => response.json())
    .then(json => {
      dispatch(logGuiHttp({
        'timestamp': _timestamp,
        'status': 'success',
        'response': json,
      }));
      dispatch(getDexNotariesState(json));
    })
  }
}