import React from 'react';
import { translate } from '../../translate/translate';
import WalletsNativeAlert from './walletsNativeAlert';
import WalletsNativeBalance from './walletsNativeBalance';
import WalletsNativeInfo from './walletsNativeInfo';
import WalletsNativeReceive from './walletsNativeReceive';
import WalletsNativeSend from './walletsNativeSend';
import WalletsNativeSyncProgress from './walletsNativeSyncProgress';
import WalletsNativeTxHistory from './walletsNativeTxHistory';

class WalletsNative extends React.Component {
  constructor(props) {
    super(props);
  }

  defaultBG() {
    if (this.props.ActiveCoin.coin === 'REVS') {
      return 'supernet';
    } else {
      return this.props.ActiveCoin.coin.toLowerCase();
    }
  }

  // <WalletsNativeAlert {...this.props} />
  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.mode === 'native') {
      return (
        <div className="page" style={{ marginLeft: '0' }}>
          <div id="section-extcoin" style={{ paddingTop: '0' }}>
            <div id="easydex-header-div" style={{ 'backgroundImage': 'url("assets/images/bg/' + this.defaultBG() + '_transparent_header_bg.png")', backgroundColor: '#fff' }}>
              <ol className="breadcrumb">
                <li className="header-easydex-section">
                  <img src={ 'assets/images/native/' + this.defaultBG() + '_header_title_logo.png' } /> <span style={{ fontSize: '35px', verticalAlign: 'middle' }} className={ this.props.ActiveCoin.coin === 'KMD' ? 'hide' : '' }>{ this.props.ActiveCoin.coin }</span>
                </li>
              </ol>
            </div>
            <div className="page-content">
              <WalletsNativeSyncProgress {...this.props} />
              <div className="row" id="extcoin-wallet">
                <WalletsNativeBalance {...this.props} />
                <WalletsNativeTxHistory {...this.props} />
                <WalletsNativeReceive {...this.props} />
                <WalletsNativeSend {...this.props} />
                <WalletsNativeInfo {...this.props} />
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

export default WalletsNative;
