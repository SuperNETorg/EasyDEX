import React from 'react';
import { translate } from '../../translate/translate';
import {
  dashboardChangeActiveCoin,
  iguanaActiveHandle,
  getAddressesByAccount,
  getSyncInfo,
  startInterval,
  stopInterval,
  iguanaEdexBalance,
  getKMDAddressesNative,
  getFullTransactionsList,
  getBasiliskTransactionsList,
  changeActiveAddress,
  getShepherdCache,
  fetchNewCacheData,
  getKMDOPID,
  getNativeTxHistory,
  getKMDBalanceTotal
} from '../../actions/actionCreators';
import Store from '../../store';

class CoinTileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // TODO: 1) cache native/full node data to file
  //       2) limit amount of req per update e.g. list of addresses don't change too often
  //       3) limit req in basilisk as much as possible incl. activehandle
  //       4) add pending requests store

  // TODO: update all addresses once in 20 min, current address every 10 min
  // always fetch main addr data and current selected address

  dispatchCoinActions(coin, mode) {
    if (mode === 'native') {
      Store.dispatch(iguanaActiveHandle(true));
      if (this.props.Dashboard.progress &&
          this.props.Dashboard.progress.blocks &&
          this.props.Dashboard.progress.longestchain &&
          this.props.Dashboard.progress.blocks === this.props.Dashboard.progress.longestchain) {
        Store.dispatch(getSyncInfoNative(coin, true));
        Store.dispatch(getKMDBalanceTotal(coin));
        Store.dispatch(getNativeTxHistory(coin));
        Store.dispatch(getKMDAddressesNative(coin, mode));
        Store.dispatch(getKMDOPID(null, coin));
      } else {
        Store.dispatch(getSyncInfoNative(coin));
      }
    }
    if (mode === 'full') {
      Store.dispatch(iguanaActiveHandle(true));
      Store.dispatch(getSyncInfo(coin));
      Store.dispatch(iguanaEdexBalance(coin, mode));
      Store.dispatch(getAddressesByAccount(coin, mode));
      Store.dispatch(getFullTransactionsList(coin));
    }
    if (mode === 'basilisk') {
      const useAddress = this.props.ActiveCoin.mainBasiliskAddress ? this.props.ActiveCoin.mainBasiliskAddress : this.props.Dashboard.activeHandle[coin];
      Store.dispatch(iguanaActiveHandle(true));
      Store.dispatch(getKMDAddressesNative(coin, mode, useAddress));
      Store.dispatch(getShepherdCache(JSON.parse(sessionStorage.getItem('IguanaActiveAccount')).pubkey, coin));

      if (this.props &&
          this.props.Dashboard &&
          this.props.Dashboard.activeHandle &&
          this.props.Dashboard.activeHandle[coin]) {
        if (!this.props.ActiveCoin.addresses) {
          Store.dispatch(getAddressesByAccount(coin, mode));
        }
        Store.dispatch(getBasiliskTransactionsList(coin, useAddress));
        //Store.dispatch(iguanaEdexBalance(coin, mode));
      }
    }
  }

  dashboardChangeActiveCoin(coin, mode) {
    if (coin !== this.props.ActiveCoin.coin) {
      Store.dispatch(stopInterval('sync', this.props.Interval.interval));
      Store.dispatch(stopInterval('basilisk', this.props.Interval.interval));
      Store.dispatch(dashboardChangeActiveCoin(coin, mode));

      this.dispatchCoinActions(coin, mode);

      if (mode === 'full') {
        var _iguanaActiveHandle = setInterval(function() {
          this.dispatchCoinActions(coin, mode);
        }.bind(this), 3000);
        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      }
      if (mode === 'native') {
        // TODO: add conditions to skip txhistory, balances, addresses while "activating best chain"
        var _iguanaActiveHandle = setInterval(function() {
          this.dispatchCoinActions(coin, mode);
        }.bind(this), coin === 'KMD' ? 15000 : 3000);
        Store.dispatch(startInterval('sync', _iguanaActiveHandle));
      }
      if (mode === 'basilisk') {
        const _basiliskMainAddress = this.props.Dashboard.activeHandle[coin] || JSON.parse(sessionStorage.getItem('IguanaActiveAccount'))[coin];
        Store.dispatch(changeActiveAddress(_basiliskMainAddress));

        if (_basiliskMainAddress) {
          Store.dispatch(fetchNewCacheData({
            'pubkey': this.props.Dashboard.activeHandle.pubkey,
            'allcoins': false,
            'coin': coin,
            'calls': 'listtransactions:getbalance',
            'address': _basiliskMainAddress,
          }));

          var _iguanaActiveHandle = setInterval(function() {
            this.dispatchCoinActions(coin, mode);
          }.bind(this), 3000);

          var _basiliskCache = setInterval(function() {
            Store.dispatch(fetchNewCacheData({
              'pubkey': this.props.Dashboard.activeHandle.pubkey,
              'allcoins': false,
              'coin': this.props.ActiveCoin.coin,
              'calls': 'listtransactions:getbalance',
              'address': _basiliskMainAddress,
            }));
          }.bind(this), 240000);
          Store.dispatch(startInterval('sync', _iguanaActiveHandle));
          Store.dispatch(startInterval('basilisk', _basiliskCache));
          // basilisk
        }
      }
    }
  }

  render() {
    const { item } = this.props;

    return (
      <div className="list-group-item col-xlg-6 col-lg-12 wallet-widgets-info pointer">
        <div className={ this.props.ActiveCoin.coin === item.coin ? 'widget widget-shadow active' : 'widget widget-shadow' }>
          <div
            className="widget-content text-center bg-white padding-20 edexcoin-logo"
            onClick={ () => this.dashboardChangeActiveCoin(item.coin, item.mode) }>
            <a className="avatar margin-bottom-5" id="edexcoin-logo">
              <img
                className="img-responsive"
                src={ 'assets/images/cryptologo/' + item.coinlogo + '.png' }
                alt={ item.coinname }/>
              <span className={ 'badge up badge-' + item.modecolor } id="basfull">{ item.modecode }</span>
            </a>
            <div className="coin-name">{ item.coinname } ({ item.coinlogo.toUpperCase() })</div>
          </div>
        </div>
      </div>
    );
  }
}

export default CoinTileItem;
