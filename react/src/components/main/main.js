import React from 'react';
import WalletMain from './walletMain';
import Store from '../../store';
import {
  getDexCoins,
  activeHandle,
  shepherdElectrumCoins,
} from '../../actions/actionCreators';
import mainWindow from '../../util/mainWindow';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: null,
    };
  }

  componentDidMount() {
    const appVersion = mainWindow.appBasicInfo;
    const appConfig = mainWindow.appConfig;

    if (appVersion) {
      document.title = `${appVersion.name} (v${appVersion.version.replace('version=', '')}${mainWindow.arch === 'x64' ? '' : '-32bit'}-beta)`;
    }

    document.addEventListener('dragover', event => event.preventDefault());
    document.addEventListener('drop', event => event.preventDefault());
  }

  componentWillMount() {
    Store.dispatch(getDexCoins());
    Store.dispatch(activeHandle());
    Store.dispatch(shepherdElectrumCoins());
  }

  render() {
    return (
      <WalletMain />
    );
  }
}

export default Main;
