import React from 'react';
import { translate } from '../../translate/translate';

class WalletsBalance extends React.Component {
  constructor(props) {
    super(props);
    this.isFullySynced = this.isFullySynced.bind(this);
  }

  isFullySynced() {
    if (this.props.Dashboard.progress &&
        (Number(this.props.Dashboard.progress.balances) +
        Number(this.props.Dashboard.progress.validated) +
        Number(this.props.Dashboard.progress.bundles) +
        Number(this.props.Dashboard.progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
  }

  renderBalance(type) {
    let _balance = '0';

    if (this.props.ActiveCoin.mode === 'full') {
      _balance = this.props.ActiveCoin.balance || 0;
    } else {
      if (this.props.ActiveCoin.cache) {
        if (type === 'main' &&
            this.props.ActiveCoin.mode === 'basilisk' &&
            this.props.ActiveCoin.activeAddress &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin] &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress]&&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.balance) {
          _balance = this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.balance;
        }

        if (type === 'interest' &&
            this.props.ActiveCoin.mode === 'basilisk' &&
            this.props.ActiveCoin.activeAddress &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin] &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress] &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.interest) {
          _balance = this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.interest;
        }

        if (type === 'total' &&
            this.props.ActiveCoin.mode === 'basilisk' &&
            this.props.ActiveCoin.activeAddress &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin] &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress] &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance &&
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data &&
            (this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.balance ||
            this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.interest)) {
          const _regBalance = this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.balance ? this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.balance : 0;
          const _regInterest = this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.interest ? this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][this.props.ActiveCoin.activeAddress].getbalance.data.interest : 0;

          _balance = _regBalance + _regInterest;
        }
      }
    }

    return _balance;
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span>
        {_translation}
        <br />
      </span>
    );
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        this.props.ActiveCoin.mode !== 'native' &&
        !this.props.ActiveCoin.send &&
        !this.props.ActiveCoin.receive) {
      return (
        <div id="wallet-widgets">
          <div className="col-xs-12">
            <div className={ this.props.ActiveCoin.mode === 'native' || (this.props.ActiveCoin.mode === 'full' && !this.isFullySynced()) ? 'col-xs-12' : 'col-xs-12 hide' }>
              <div role="alert" className="alert alert-info alert-dismissible" id="edexcoin-wallet-waitingrt-alert">
                <button aria-label="Close" data-dismiss="alert" className="close" type="button">
                  <span aria-hidden="true">×</span>
                </button>
                <h4>{ translate('INDEX.ACTIVATING_WALLET_RT') }</h4>
                <p id="edexcoin-wallet-waitingrt-alert-text">{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P1') }</p>
                <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P2') }</p>
                <p className="font-weight-600">{ this.renderLB('INDEX.IGUANA_FULL_MODE_SYNC_P3') }</p>
              </div>

              <div role="alert" className="alert alert-info alert-dismissible" id="edexcoin-wallet-waitingcache-alert">
                <button aria-label="Close" data-dismiss="alert" className="close" type="button">
                  <span aria-hidden="true">×</span>
                </button>
                <h4>{ translate('INDEX.FETCHING_COIN_DATA') }</h4>
                <p id="edexcoin-wallet-waitingcache-alert-text">{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P1') }</p>
                <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P2') }</p>
                <p className="font-weight-600">{ this.renderLB('INDEX.IGUANA_FULL_MODE_SYNC_P3') }</p>
              </div>
            </div>
            <div
              className={ this.props.ActiveCoin.mode === 'native' || this.props.ActiveCoin.mode === 'basilisk' ? 'col-lg-4 col-xs-12' : 'col-lg-12 col-xs-12' }
              id="edexcoin_getbalance_t">
              <div className="widget widget-shadow" id="widgetLineareaOne">
                <div className="widget-content">
                  <div className="padding-20 padding-top-10">
                    <div className="clearfix">
                      <div className="pull-left padding-vertical-10">
                        <i className="icon fa-eye font-size-24 vertical-align-bottom margin-right-5"></i>{ translate('INDEX.BALANCE')}
                      </div>
                      <span className="pull-right padding-top-10 font-size-22">
                        { this.renderBalance('main') } { this.props.ActiveCoin.coin }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={ this.props.ActiveCoin.mode === 'native' || this.props.ActiveCoin.mode === 'basilisk' ? 'col-lg-4 col-xs-12' : 'col-lg-4 col-xs-12 hide' }
              id="edexcoin_getbalance_interest">
              <div className="widget widget-shadow" id="widgetLineareaOne">
                <div className="widget-content">
                  <div className="padding-20 padding-top-10">
                    <div className="clearfix">
                      <div className="pull-left padding-vertical-10">
                        <i className="icon fa-money font-size-24 vertical-align-bottom margin-right-5"></i>{ translate('INDEX.INTEREST_EARNED') }
                      </div>
                      <span className="pull-right padding-top-10 font-size-22">
                        { this.renderBalance('interest') } { this.props.ActiveCoin.coin }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={ this.props.ActiveCoin.mode === 'native' || this.props.ActiveCoin.mode === 'basilisk' ? 'col-lg-4 col-xs-12' : 'col-lg-4 col-xs-12 hide' }
              id="edexcoin_getbalance_total_interest">
              <div className="widget widget-shadow" id="widgetLineareaOne">
                <div className="widget-content">
                  <div className="padding-20 padding-top-10">
                    <div className="clearfix">
                      <div className="pull-left padding-vertical-10">
                        <i className="icon fa-bullseye font-size-24 vertical-align-bottom margin-right-5"></i>{ translate('INDEX.TOTAL_BALANCE') }
                      </div>
                      <span className="pull-right padding-top-10 font-size-22">
                        { this.renderBalance('total') } { this.props.ActiveCoin.coin }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default WalletsBalance;
