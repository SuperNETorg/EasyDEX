import React from 'react';
import { connect } from 'react-redux';
import Toaster from '../toaster/toaster';
import AddCoin from '../addcoin/addcoin';
import Login from '../login/login';
import Dashboard from '../dashboard/main/dashboard';
import DexMain from '../dex/dexMain';
import NotaryElectionsModal from '../dashboard/notaryElectionsModal/notaryElectionsModal';
import mainWindow from '../../util/mainWindow';
import Store from '../../store';
import {
  toggleDashboardTxInfoModal,
  toggleAddcoinModal,
  toggleZcparamsFetchModal,
  toggleClaimInterestModal,
  toggleCoindDownModal,
  displayImportKeyModal,
  toggleNotaryElectionsModal,
} from '../../actions/actionCreators';

class WalletMain extends React.Component {
  componentDidMount() {
    // handle esc key globally
    document.onkeydown = (evt) => {
      evt = evt || window.event;

      let isEscape = false;

      if ('key' in evt) {
        isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
      } else {
        isEscape = (evt.keyCode === 27);
      }

      // TODO: qr modal
      if (isEscape) {
        if (this.props.activeModals.showTransactionInfo) {
          Store.dispatch(toggleDashboardTxInfoModal(false));
        } else if (this.props.activeModals.displayZcparamsModal) {
          Store.dispatch(toggleZcparamsFetchModal(false));
        } else if (this.props.activeModals.displayClaimInterestModal) {
          Store.dispatch(toggleClaimInterestModal(false));
        } else if (this.props.activeModals.displayCoindDownModal) {
          Store.dispatch(toggleCoindDownModal(false));
        } else if (this.props.activeModals.displayImportKeyModal) {
          Store.dispatch(displayImportKeyModal(false));
        } else if (this.props.activeModals.displayAddCoinModal) {
          Store.dispatch(toggleAddcoinModal(false, false));
        } else if (this.props.activeModals.displayLoginSettingsModal) {
          Store.dispatch(toggleLoginSettingsModal(false));
        } else if (this.props.activeModals.displayNotaryElectionsModal) {
          Store.dispatch(toggleNotaryElectionsModal(false));
        }
      }
    };
  }

  render() {
    if (mainWindow.argv.indexOf('dexonly') > -1) {
      return (
        <div className="full-height">
          <input
            type="text"
            id="js-copytextarea" />
          <DexMain />
        </div>
      );
    } else {
      return (
        <div className="full-height">
          <input
            type="text"
            id="js-copytextarea" />
          <Dashboard />
          <AddCoin />
          <Login />
          <NotaryElectionsModal />
          <Toaster {...this.props.toaster} />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    toaster: state.toaster,
    activeModals: {
      showTransactionInfo: state.ActiveCoin.showTransactionInfo,
      displayClaimInterestModal: state.Dashboard.displayClaimInterestModal,
      displayCoindDownModal: state.Dashboard.displayCoindDownModal,
      displayImportKeyModal: state.Dashboard.displayImportKeyModal,
      displayZcparamsModal: state.Dashboard.displayZcparamsModal,
      displayAddCoinModal: state.AddCoin.display,
      displayLoginSettingsModal: state.Main.displayLoginSettingsModal,
      displayNotaryElectionsModal: state.Main.displayNotaryElectionsModal,
    },
  };
};

export default connect(mapStateToProps)(WalletMain);

