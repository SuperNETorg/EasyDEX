import React from 'react';
import { translate } from '../../translate/translate';
import { atomic } from '../../actions/actionCreators';
import Store from '../../store';
import AddCoinOptionsCrypto from '../addcoin/addcoinOptionsCrypto';
import AddCoinOptionsAC from '../addcoin/addcoinOptionsAC';
import AddCoinOptionsACFiat from '../addcoin/addcoinOptionsACFiat';

/*
  TODO:
  pre-select active coin
*/
class Atomic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      output: null,
      api: null,
      coin: null,
      input: null,
    };
    this.updateSelectedAPI = this.updateSelectedAPI.bind(this);
    this.updateSelectedCoin = this.updateSelectedCoin.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.getAtomicData = this.getAtomicData.bind(this);
  }

  updateSelectedAPI(e) {
    this.setState(Object.assign({}, this.state, {
      'api': e.target.value,
    }));
  }

  updateSelectedCoin(e) {
    this.setState(Object.assign({}, this.state, {
      'coin': e.target.value.split('|')[0],
    }));
  }

  updateInput(e) {
    this.setState(Object.assign({}, this.state, {
      'input': e.target.value,
    }));
  }

  getAtomicData() {
    const tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth');
    let ExplorerInputData;

    switch (this.state.api) {
      case 'history':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'timeout': 20000,
          'agent': 'basilisk',
          'method': 'history',
          'vals': {
            'coin': this.state.coin,
            'addresses': [ this.state.input ]
          }
        };
        break;
      case 'getbalance':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'method': 'getbalance',
          'params': [ this.state.input ]
        };
        break;
      case 'listunspent':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'method': 'listunspent',
          'params': [
            1,
            9999999,
            [ this.state.input ]
          ]
        };
        break;
      case 'txid':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'method': 'getrawtransaction',
          'params': [ this.state.input ]
        };
        break;
      case 'blockash':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'agent': 'bitcoinrpc',
          'method': 'getblockhash',
          'height': this.state.input
        };
        break;
      case 'chaintip':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'agent': 'bitcoinrpc',
          'method': 'getbestblockhash'
        };
        break;
      case 'activehandle':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'SuperNET',
          'method': 'activehandle'
        };
        break;
      case 'gettransaction':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'coin': this.state.coin,
          'agent': 'bitcoinrpc',
          'method': 'gettransaction',
          'txid': this.state.input
        };
        break;
      case 'dex_getinfo':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getinfo',
          'symbol': this.state.coin
        };
        break;
      case 'dex_getnotaries':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getnotaries',
          'symbol': this.state.coin
        };
        break;
      case 'dex_alladdresses':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'alladdresses',
          'symbol': this.state.coin
        };
        break;
      case 'dex_importaddress':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'importaddress',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_checkaddress':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'checkaddress',
          'ddress': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_validateaddress':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'validateaddress',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_getbestblockhash':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getbestblockhash',
          'symbol': this.state.coin
        };
        break;
      case 'dex_listtransactions':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'listtransactions',
          'address': this.state.input,
          'count': 100,
          'skip': 0,
          'symbol': this.state.coin
        };
        break;
      case 'dex_listtransactions2':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'listtransactions2',
          'address': this.state.input,
          'count': 100,
          'skip': 0,
          'symbol': this.state.coin
        };
        break;
      case 'dex_listunspent':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'listunspent',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_listspent':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'listspent',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_listunspent2':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'listunspent2',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_getblockhash':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getblockhash',
          'height': 100,
          'symbol': this.state.coin
        };
        break;
      case 'dex_getblock':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getblock',
          'hash': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_gettxin':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'gettxin',
          'vout': 0,
          'txid': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_gettxout':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'gettxout',
          'vout': 0,
          'txid': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_gettransaction':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'gettransaction',
          'txid': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_getbalance':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getbalance',
          'address': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'dex_getsupply':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'getbalance',
          'address': '*',
          'symbol': this.state.coin,
          'timeout': 600000
        };
        break;
      case 'dex_sendrawtransaction':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dex',
          'method': 'sendrawtransaction',
          'signedtx': this.state.input,
          'symbol': this.state.coin
        };
        break;
      case 'basilisk_refresh':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'basilisk',
          'method': 'refresh',
          'address': this.state.input,
          'symbol': this.state.coin,
          'timeout': 600000
        };
        break;
      case 'jumblr_status':
        ExplorerInputData = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'jumblr',
          'method': 'status'
        };
        break;
    }

    Store.dispatch(atomic(ExplorerInputData));
  }

  componentWillReceiveProps(props) {
    if (props && props.Atomic.response) {
      if (this.state.api === 'txid' ||
          this.state.api === 'dex_getbestblockhash' ||
          this.state.api === 'dex_sendrawtransaction' ||
          this.state.api === 'dex_getblockhash') {
        this.setState(Object.assign({}, this.state, {
          'output': props.Atomic.response,
        }));
      } else {
        this.setState(Object.assign({}, this.state, {
          'output': JSON.stringify(props.Atomic.response, null, '\t'),
        }));
      }

      if (props.Atomic.response.error === 'less than required responses') {
        console.log('error');
        // toastr.error(_lang[defaultLang].DASHBOARD.LESS_RESPONSES_REQ, _lang[defaultLang].DASHBOARD.BASILISC_NOTIFICATION)
      }
    }
  }

  renderAtomicOptions() {
    const _options = [
      {
        method: 'history',
        name: 'Address History',
      },
      {
        method: 'getbalance',
        name: 'Get Balance',
      },
      {
        method: 'listunspent',
        name: 'List Unspent',
      },
      {
        method: 'txid',
        name: 'Transaction ID',
      },
      {
        method: 'blockash',
        name: 'Block Hash',
      },
      {
        method: 'chaintip',
        name: 'Chain Tip',
      },
      {
        method: 'activehandle',
        name: 'Active Handle',
      },
      {
        method: 'gettransaction',
        name: 'Get Transaction',
      },
      {
        method: 'dex_alladdresses',
        name: 'DEX All Addresses',
      },
      {
        method: 'dex_importaddress',
        name: 'DEX Import Address',
      },
      {
        method: 'dex_checkaddress',
        name: 'DEX Check Address',
      },
      {
        method: 'dex_validateaddress',
        name: 'DEX Validate Address',
      },
      {
        method: 'dex_getinfo',
        name: 'DEX Get Info',
      },
      {
        method: 'dex_getnotaries',
        name: 'DEX Get Notaries',
      },
      {
        method: 'dex_getbestblockhash',
        name: 'DEX Get Best Block Has',
      },
      {
        method: 'dex_getblock',
        name: 'DEX Get Block',
      },
      {
        method: 'dex_gettxin',
        name: 'DEX Get Txin',
      },
      {
        method: 'dex_gettxout',
        name: 'DEX Get Txout',
      },
      {
        method: 'dex_gettransaction',
        name: 'DEX Get Transaction',
      },
      {
        method: 'dex_getbalance',
        name: 'DEX Get Balance',
      },
      {
        method: 'dex_getsupply',
        name: 'DEX Get Supply',
      },
      {
        method: 'dex_listtransactions',
        name: 'DEX List Transactions',
      },
      {
        method: 'dex_listtransactions2',
        name: 'DEX List Transactions 2',
      },
      {
        method: 'dex_listspent',
        name: 'DEX List Spent',
      },
      {
        method: 'dex_listunspent',
        name: 'DEX List Unspent',
      },
      {
        method: 'dex_listunspent2',
        name: 'DEX List Unspent 2',
      },
      {
        method: 'dex_sendrawtransaction',
        name: 'DEX Send Raw Transaction',
      },
      {
        method: 'basilisk_refresh',
        name: 'Basilisk Refresh',
      },
      {
        method: 'jumblr_status',
        name: 'Jumbler Status',
      },
    ];

    let items = [];

    for (let i = 0; i < _options.length; i++) {
      items.push(
        <option key={_options[i].method} value={_options[i].method}>{_options[i].name}</option>
      );
    }

    return items;
  }

  render() {
    return (
      <div className="page margin-left-0">
        <div className="page-content" id="section-iguana-atomic-explorer">
          <div className="row" id="atomic-explorer">
            <div className="col-xlg-12 col-md-12">
              <h4 className="font-size-14 text-uppercase">Atomic Explorer</h4>
              <div className="panel panel-bordered">
                <div className="panel-body">
                  <div className="col-sm-4 col-xs-12">
                    <div className="form-group">
                      <select
                        className="form-control
                        form-material"
                        id="atomic_explorer_select_coin_options"
                        onChange={ this.updateSelectedCoin }>
                        <option value="-">{ translate('INDEX.SELECT_COIN') }</option>
                        <AddCoinOptionsCrypto />
                        <AddCoinOptionsAC />
                        <AddCoinOptionsACFiat />
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-4 col-xs-12 text-align-center">
                    <select
                      className="form-control form-material"
                      id="atomic_explorer_select_command_options"
                      onChange={this.updateSelectedAPI}>
                      <option value="">-{ translate('ATOMIC.SELECT_COMMAND') }-</option>
                      { this.renderAtomicOptions() }
                    </select>
                  </div>
                  <div className="col-sm-4 col-xs-12 text-align-center">
                    <input
                      type="text"
                      className="form-control"
                      id="atomic_explorer_input_data"
                      name="atomic_explorer_input_data"
                      placeholder={ translate('ATOMIC.INPUT_PLACEHOLDER') }
                      onChange={ this.updateInput } />
                  </div>
                  <div className="col-sm-12 col-xs-12 text-align-center">
                    <button
                      type="button"
                      className="btn btn-primary waves-effect waves-light"
                      id="atomic_explorer_getcoinpeers_btn"
                      onClick={ this.getAtomicData }>{ translate('ATOMIC.SUBMIT') }</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xlg-4 col-md-12">
              <div className="panel">
                <div className="panel-heading">
                  <h3 className="panel-title">{ translate('ATOMIC.RAW_OUTPUT') }</h3>
                </div>
                <div className="panel-body">
                  <div className="tab-content">
                    <pre id="atomic-explorer-commands-output">{ this.state.output }</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Atomic;
