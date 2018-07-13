import React from 'react';
import { connect } from 'react-redux';
import {
  dashboardChangeSection,
  toggleAddcoinModal,
  stopInterval,
  startInterval,
  displayImportKeyModal,
  shepherdElectrumLock,
  shepherdElectrumLogout,
  getDexCoins,
  activeHandle,
  dashboardRemoveCoin,
  dashboardChangeActiveCoin,
  toggleNotaryElectionsModal,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import Config from '../../../config';
import { checkAC } from '../../addcoin/payload';
import mainWindow from '../../../util/mainWindow';

import NavbarRender from './navbar.render';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      openDropMenu: false,
      isExperimentalOn: false,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this._toggleNotaryElectionsModal = this._toggleNotaryElectionsModal.bind(this);
    this._checkAC = this._checkAC.bind(this);
    this.spvLock = this.spvLock.bind(this);
    this.spvLogout = this.spvLogout.bind(this);
  }

  isRenderSpvLockLogout() {
    if (this.props.Main &&
        this.props.Main.isLoggedIn &&
        this.props.Main.coins &&
        this.props.Main.coins.spv &&
        this.props.Main.coins.spv.length) {
      return true;
    }
  }

  spvLock() {
    shepherdElectrumLock()
    .then((res) => {
      Store.dispatch(getDexCoins());
      Store.dispatch(activeHandle());
    });
  }

  spvLogout() {
    shepherdElectrumLogout()
    .then((res) => {
      const _spvCoins = this.props.Main.coins.spv;

      if (!this.props.Main.coins.native.length) {
        Store.dispatch(dashboardChangeActiveCoin(null, null, true));
      }

      setTimeout(() => {
        for (let i = 0; i < _spvCoins.length; i++) {
          Store.dispatch(dashboardRemoveCoin(_spvCoins[i]));
        }
        if (!this.props.Main.coins.native.length) {
          Store.dispatch(dashboardChangeActiveCoin(null, null, true));
        }
      }, 500);

      Store.dispatch(getDexCoins());
      Store.dispatch(activeHandle());
    });
  }

  componentWillMount() {
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );

    this.setState({
      isExperimentalOn: mainWindow.appConfig.experimentalFeatures,
    });

    if (mainWindow.argv.indexOf('dexonly') > -1) {
      Store.dispatch(dashboardChangeSection(mainWindow.activeSection));
    }
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  handleClickOutside(e) {
    if (e.srcElement.className !== 'dropdown-menu' &&
        e.srcElement.className !== 'icon fa-bars' &&
        e.srcElement.title !== 'top menu' &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className !== 'navbar-avatar-inner') &&
        e.srcElement.className.indexOf('navbar-avatar') === -1 &&
        (e.path && e.path[4] && e.path[4].className.indexOf('dropdown-menu') === -1)) {
      this.setState({
        openDropMenu: false,
      });
    }
  }

  openImportKeyModal() {
    Store.dispatch(displayImportKeyModal(true));
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  _toggleNotaryElectionsModal() {
    Store.dispatch(toggleNotaryElectionsModal(true));
  }

  toggleAddCoinModal() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  dashboardChangeSection(sectionName) {
    mainWindow.activeSection = sectionName;
    Store.dispatch(dashboardChangeSection(sectionName));
  }

  _checkAC() {
    return checkAC(this.props.ActiveCoin.coin);
  }

  isSectionActive(section) {
    return this.props.Dashboard.activeSection === section;
  }

  render() {
    return NavbarRender.call(this);
  }
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      mode: state.ActiveCoin.mode,
      coin: state.ActiveCoin.coin,
    },
    Dashboard: {
      activeSection: state.Dashboard.activeSection,
    },
    Interval: {
      interval: state.Interval.interval,
    },
    Main: {
      isLoggedIn: state.Main.isLoggedIn,
      coins: state.Main.coins,
    },
  };
};

export default connect(mapStateToProps)(Navbar);
