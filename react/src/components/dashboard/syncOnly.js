import React from 'react';
import { translate } from '../../translate/translate';
import {
  stopInterval,
  addCoin,
  toggleSyncOnlyModal,
  stopIguanaFork,
  restartIguanaInstance
} from '../../actions/actionCreators';
import Store from '../../store';

class SyncOnly extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      autoRestartedForks: {}
    };
    this.closeSyncOnlyModal = this.closeSyncOnlyModal.bind(this);
  }

  isFullySynced(fork) {
    if (fork.balances && ((Number(fork.balances) +
        Number(fork.validated) +
        Number(fork.bundles) +
        Number(fork.utxo)) / 4 === 100)) {
      return true;
    } else {
      return false;
    }
  }

  renderCoinName(coin) {
    let coinlogo;
    let coinname;

    switch (coin) {
      case 'BTC':
        coinlogo = 'bitcoin';
        coinname = 'Bitcoin';
        break;
      case 'BTCD':
        coinlogo = 'bitcoindark';
        coinname = 'BitcoinDark';
        break;
      case 'LTC':
        coinlogo = 'litecoin';
        coinname = 'Litecoin';
        break;
      case 'VPN':
        coinlogo = 'vpncoin';
        coinname = 'VPNcoin';
        break;
      case 'SYS':
        coinlogo = 'syscoin';
        coinname = 'Syscoin';
        break;
      case 'ZEC':
        coinlogo = 'zcash';
        coinname = 'Zcash';
        break;
      case 'NMC':
        coinlogo = 'namecoin';
        coinname = 'Namecoin';
        break;
      case 'DEX':
        coinlogo = 'dex';
        coinname = 'InstantDEX';
        break;
      case 'DOGE':
        coinlogo = 'dogecoin';
        coinname = 'Dogecoin';
        break;
      case 'DGB':
        coinlogo = 'digibyte';
        coinname = 'Digibyte';
        break;
      case 'MZC':
        coinlogo = 'mazacoin';
        coinname = 'Mazacoin';
        break;
      case 'UNO':
        coinlogo = 'unobtanium';
        coinname = 'Unobtanium';
        break;
      case 'ZET':
        coinlogo = 'zetacoin';
        coinname = 'Zetacoin';
        break;
      case 'KMD':
        coinlogo = 'komodo';
        coinname = 'Komodo';
        break;
      case 'BTM':
        coinlogo = 'bitmark';
        coinname = 'Bitmark';
        break;
      case 'CARB':
        coinlogo = 'carboncoin';
        coinname = 'Carboncoin';
        break;
      case 'ANC':
        coinlogo = 'anoncoin';
        coinname = 'AnonCoin';
        break;
      case 'FRK':
        coinlogo = 'franko';
        coinname = 'Franko';
        break;
      case 'GAME':
        coinlogo = 'GAME';
        coinname = 'GameCredits';
        break;
    }

    return {
      'logo': coinlogo,
      'name': coinname
    };
  }

  componentWillReceiveProps(props) {
    // console.log('SyncOnly', props);
    if (props.SyncOnly) {
      for (let port in this.props.SyncOnly.forks) {
        const forkInfo = this.props.SyncOnly.forks[port];

        if (!this.state.autoRestartedForks[port] &&
            forkInfo &&
            forkInfo.registry &&
            forkInfo.getinfo &&
            forkInfo.getinfo.error &&
            forkInfo.getinfo.error === 'bitcoinrpc needs coin that is active') {
          console.log('fork add coin required');
          let _autoRestartedForks = Object.assign({}, this.state.autoRestartedForks);
          _autoRestartedForks[port] = true;

          this.setState({
            autoRestartedForks: _autoRestartedForks,
          });
          Store.dispatch(addCoin(forkInfo.registry.coin, '1', null, port));
          setTimeout(function() {
            let _autoRestartedForks = Object.assign({}, this.state.autoRestartedForks);
            _autoRestartedForks[port] = false;

            this.setState({
              autoRestartedForks: _autoRestartedForks,
            });
          }.bind(this), 10000);
        }
      }
    }
  }

  closeSyncOnlyModal() {
    Store.dispatch(stopInterval('syncOnly', this.props.Interval.interval));
    Store.dispatch(toggleSyncOnlyModal(false));
  }

  _stopIguanaFork(pmid) {
    Store.dispatch(stopIguanaFork(pmid));
  }

  _restartIguanaFork(coin, pmid, port) {
    restartIguanaInstance(pmid)
    .then(function(json) {
      setTimeout(function() {
        Store.dispatch(addCoin(coin, '1', null, port));
        console.log('restartSyncOnlyInstance', json);
      }, 2000);
    });
  }

  renderProgress(fork) {
    return (
      <div>
        <div>
          <div className="progress progress-sm">
            <div
              className={ this.isFullySynced(fork) ? 'progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success' : 'hide' }
              style={{ width: '100%', fontSize: '80%' }}
              role="progressbar"
              id="currency-bundles">
              { translate('INDEX.BUNDLES') } <span id="currency-bundles-percent">({ fork.coin }) 100.00% - ( { fork.blocks } / { fork.blocks } ) ==&gt;&gt; RT{ fork.RTheight }</span>
            </div>
            <div
              className={ this.isFullySynced(fork) ? 'hide' : 'progress-bar progress-bar-info progress-bar-striped active' }
              style={{ width: fork.bundles + '%', fontSize: '80%' }}
              role="progressbar"
              id="currency-bundles">
              { translate('INDEX.BUNDLES') } <span id="currency-bundles-percent">{ fork.bundles }%</span>
            </div>
          </div>
        </div>
        <div id="additional-progress-bars" className={ this.isFullySynced(fork) ? 'hide' : '' }>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-warning progress-bar-striped active"
              style={{ width: fork.utxo + '%', fontSize: '80%' }}
              role="progressbar"
              id="currency-utxo">
              utxo <span id="currency-utxo-percent">{ fork.utxo }%</span>
            </div>
          </div>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-danger progress-bar-striped active"
              style={{ width: fork.balances + '%', fontSize: '80%' }}
              role="progressbar"
              id="currency-balances">
              { translate('INDEX.BALANCES') } <span id="currency-balances-percent">{ fork.balances }%</span>
            </div>
          </div>
          <div className="progress progress-sm">
            <div
              className="progress-bar progress-bar-success progress-bar-striped active"
              style={{ width: fork.validated + '%', fontSize: '80%' }}
              role="progressbar"
              id="currency-validated">
              { translate('INDEX.VALIDATED') } <span id="currency-validated-percent">{ fork.validated }%</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderForksList() {
    let items = [];

    for (let port in this.props.SyncOnly.forks) {
      const forkInfo = this.props.SyncOnly.forks[port];

      if (forkInfo &&
          forkInfo.registry &&
          forkInfo.getinfo) {
        items.push(
          <div key={ port } style={{ width: '100%' }} className="padding-bottom-60">
            <div className="avatar">
              <img
                className="img-responsive margin-bottom-5"
                src={ 'assets/images/cryptologo/' + this.renderCoinName(forkInfo.registry.coin).logo + '.png' }
                alt={ forkInfo.registry.coin }/>
              <span className="badge up badge-success margin-bottom-5">Full</span>
              <div className="coin-name">{ this.renderCoinName(forkInfo.registry.coin).name } ({ forkInfo.registry.coin.toUpperCase() })</div>
              <div className="margin-top-10">
                <span className="btn btn-primary" onClick={ () => this._stopIguanaFork(forkInfo.registry.pmid) }>
                  <span className="fa fa-stop"></span> { translate('INDEX.STOP') }
                </span>
                <span
                  className="btn btn-primary margin-left-10"
                  onClick={ () => this._restartIguanaFork(forkInfo.registry.coin.toUpperCase(), forkInfo.registry.pmid, port) }>
                  <span className="fa fa-undo"></span> { translate('INDEX.RESTART') }
                </span>
              </div>
            </div>
            <div className="progress-bars">
            {this.renderProgress(forkInfo.getinfo)}
            </div>
          </div>
        );
      }
    }

    if (items.length) {
      return items;
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }

  render() {
    if (this.props &&
        this.props.SyncOnly.display) {
      return (
        <div>
          <div className="modal show sync-only-forks" aria-hidden="false" role="dialog">
            <div className="modal-dialog modal-center modal-lg">
              <div className="modal-content">
                <div className="modal-body" style={{ height: '590px' }}>
                  { this.renderForksList() }
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-default" onClick={ this.closeSyncOnlyModal }>{ translate('INDEX.CLOSE') }</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show in"></div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default SyncOnly;