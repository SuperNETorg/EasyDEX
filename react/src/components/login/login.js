import React from 'react';
import { translate } from '../../translate/translate';
import {
  toggleAddcoinModal,
  iguanaWalletPassphrase,
  iguanaActiveHandle,
  startInterval,
  stopInterval,
  getDexCoins,
  toggleSyncOnlyModal,
  getSyncOnlyForks,
  createNewWallet
} from '../../actions/actionCreators';
import Store from '../../store';
import { PassPhraseGenerator } from '../../util/crypto/passphrasegenerator';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      activeLoginSection: 'activateCoin',
      loginPassphrase: null,
      seedInputVisibility: false,
      bitsOption: 256,
      randomSeed: PassPhraseGenerator.generatePassPhrase(256),
      randomSeedConfirm: '',
      isSeedConfirmError: false,
      displaySeedBackupModal: false,
    };
    this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.loginSeed = this.loginSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.handleRegisterWallet = this.handleRegisterWallet.bind(this);
    this.openSyncOnlyModal = this.openSyncOnlyModal.bind(this);
    this.toggleSeedBackupModal = this.toggleSeedBackupModal.bind(this);
    this.execWalletCreate = this.execWalletCreate.bind(this);
  }

  openSyncOnlyModal() {
    Store.dispatch(getSyncOnlyForks());

    const _iguanaActiveHandle = setInterval(function() {
      Store.dispatch(getSyncOnlyForks());
    }.bind(this), 3000);
    Store.dispatch(startInterval('syncOnly', _iguanaActiveHandle));

    Store.dispatch(toggleSyncOnlyModal(true));
  }

  componentDidMount() {
    Store.dispatch(iguanaActiveHandle(true));
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  generateNewSeed(bits) {
    this.setState(Object.assign({}, this.state, {
      randomSeed: PassPhraseGenerator.generatePassPhrase(bits),
      bitsOption: bits,
    }));
  }

  componentWillReceiveProps(props) {
    if (props && props.Main && props.Main.isLoggedIn) {
      this.setState({
        display: false,
      });
    }

    if (props && props.Main && !props.Main.isLoggedIn) {
      this.setState({
        display: true,
      });

      if (!this.props.Interval.interval.activeCoins) {
        const _iguanaActiveCoins = setInterval(function() {
          Store.dispatch(getDexCoins());
        }.bind(this), 10000);
        Store.dispatch(startInterval('activeCoins', _iguanaActiveCoins));
      }

      document.body.className = 'page-login layout-full page-dark';
    }

    if (this.state.activeLoginSection !== 'signup') {
      if (props && props.Main && props.Main.activeCoins) {
        this.setState({
          activeLoginSection: 'login',
        });
      } else {
        this.setState({
          activeLoginSection: 'activateCoin',
        });
      }
    }
  }

  toggleActivateCoinForm() {
    Store.dispatch(toggleAddcoinModal(true, false));
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isSeedConfirmError: false,
    });
  }

  loginSeed() {
    Store.dispatch(iguanaWalletPassphrase(this.state.loginPassphrase));
  }

  updateActiveLoginSection(name) {
    this.setState({
      activeLoginSection: name,
    });
  }

  execWalletCreate() {
    Store.dispatch(createNewWallet(this.state.randomSeedConfirm, this.props.Dashboard.activeHandle));

    this.setState({
      activeLoginSection: 'activateCoin',
      displaySeedBackupModal: false,
      isSeedConfirmError: false,
    });
  }

  handleRegisterWallet() {
    if (this.state.randomSeed === this.state.randomSeedConfirm) {
      this.toggleSeedBackupModal();
    } else {
      this.setState({
        isSeedConfirmError: true,
      });
    }
  }

  handleKeydown(e) {
    if (e.key === 'Enter') {
      this.loginSeed();
    }
  }

  toggleSeedBackupModal() {
    this.setState(Object.assign({}, this.state, {
      displaySeedBackupModal: !this.state.displaySeedBackupModal,
    }));
  }

  renderSwallModal() {
    if (this.state.displaySeedBackupModal) {
      return (
        <div className="swal2-container">
          <div className="swal2-overlay" tabIndex="-1" style={{ opacity: 1, display: 'block' }}></div>
          <div className="swal2-modal show-swal2 visible" style={{ display: 'block', width: '500px', padding: '20px', marginLeft: '-250px', background: 'rgb(255, 255, 255)', marginTop: '-230px' }} tabIndex="-1">
          <div className="swal2-icon swal2-warning pulse-warning" style={{ display: 'block' }}>!</div>
          <h2>{ translate('LOGIN.SAVED_WALLET_SEED') }</h2>
          <div className="swal2-content" style={{ display: 'block' }}>{ translate('LOGIN.SEED_MAKE_SURE_BACKUP') }</div>
          <hr className="swal2-spacer" style={{ display: 'block' }} />
          <button className="swal2-confirm styled" style={{ backgroundColor: 'rgb(48, 133, 214)', borderLeftColor: 'rgb(48, 133, 214)', borderRightColor: 'rgb(48, 133, 214)' }} onClick={ this.execWalletCreate }>{ translate('LOGIN.YES_I_BACKUP') }</button>
          <button className="swal2-cancel styled" style={{ display: 'inline-block', backgroundColor: 'rgb(221, 51, 51)'}} onClick={ this.toggleSeedBackupModal }>{ translate('LOGIN.CANCEL') }</button>
        </div>
      </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if ((this.state && this.state.display) || !this.props.Main) {
      return (
        <div id="wallet-login">
          { this.renderSwallModal() }
          <div className="page animsition vertical-align text-center fade-in">
            <div className="page-content vertical-align-middle">
              <div className="brand">
                <img className="brand-img" src="assets/images/easydex-logo-big.png" alt="SuperNET Iguana" />
              </div>

              <div style={{ padding: '20px 0' }}>
                <span className="display-sync-only-coins-toggle" onClick={ this.openSyncOnlyModal }>
                  <i className="fa fa-cubes"></i> { translate('LOGIN.DISPLAY_SYNC_ONLY') }
                </span>
              </div>

              <div id="section-ie-warning" className={ this.state.activeLoginSection === 'ieWarning' ? 'show' : 'hide' }>
                <div className="panel">
                  <div className="panel-heading">
                    <h3 className="panel-title">{ translate('INDEX.UNSUPPORTED_BROWSER') }</h3>
                  </div>
                  <div className="alert alert-danger alert-dismissible" role="alert">
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      <span className="sr-only">{ translate('INDEX.CLOSE') }</span>
                    </button>
                    { translate('INDEX.IE_UNSUPPORTED') }
                  </div>
                  <div className="panel-body">
                    <p style={{ color: '#424242' }}>
                      { translate('INDEX.PLEASE_USE') } <a href="https://www.google.com/chrome/">Google Chrome</a> { translate('INDEX.OR') } <a href="https://www.firefox.com">Mozilla FireFox</a> { translate('INDEX.TO_USE') } EasyDEX-GUI. { translate('INDEX.PLEASE_CLICK_ON') }.
                    </p>
                    <div className="col-sm-6 col-xs-6">
                      <a href="https://www.google.com/chrome/"><img className="brand-img" src="assets/images/browsers/chrome.png" alt="Google Chrome" /></a>
                    </div>
                    <div className="col-sm-6 col-xs-6">
                      <a href="https://www.firefox.com"><img className="brand-img" src="assets/images/browsers/firefox.png" alt="Mozilla FireFox" /></a>
                    </div>
                  </div>
                </div>
              </div>

              <div id="section-login" className={ this.state.activeLoginSection === 'login' ? 'show' : 'hide' }>
                <h4 style={{ color: '#fff' }} id="login-welcome">{translate('INDEX.WELCOME_LOGIN')}</h4>
                <div className="login-form">
                  <div className="form-group form-material floating">
                    <input
                      type={ this.state.seedInputVisibility ? 'text' : 'password' }
                      className="form-control"
                      name="loginPassphrase"
                      id="password"
                      onChange={ this.updateInput }
                      onKeyDown={ (event) => this.handleKeydown(event) } />
                    <i
                      className={ this.state.seedInputVisibility ? 'seed-toggle fa fa-eye-slash' : 'seed-toggle fa fa-eye' }
                      onClick={ this.toggleSeedInputVisibility }></i>
                    <label className="floating-label" htmlFor="inputPassword">{ translate('INDEX.WALLET_SEED') }</label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    id="loginbtn"
                    onClick={ this.loginSeed }
                    disabled={ !this.state.loginPassphrase || !this.state.loginPassphrase.length }>{ translate('INDEX.SIGN_IN') }</button>
                  <div className="form-group form-material floating">
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect"
                      id="register-btn"
                      onClick={ () => this.updateActiveLoginSection('signup') }>{ translate('INDEX.CREATE_WALLET') }</button>
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect hide"
                      id="logint-another-wallet">{ translate('INDEX.LOGIN_ANOTHER_WALLET') }</button>
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect"
                      id="register-btn"
                      role="menuitem"
                      onClick={ this.toggleActivateCoinForm }
                      disabled={ !this.props.Main }
                      style={{ marginTop: '20px' }}>
                      <span className="ladda-label">{ translate('ADD_COIN.ADD_ANOTHER_COIN') }</span>
                    </button>
                  </div>
                </div>
              </div>

              <div
                id="section-login-addcoin-btn"
                className={ this.state.activeLoginSection === 'activateCoin' ? 'show' : 'hide' }>
                <h4 style={{ color: '#fff' }} id="login-welcome">{ translate('INDEX.WELCOME_PLEASE_ADD') }</h4>
                <div
                  className="form-group form-material floating"
                  style={{ width: '540px', margin: '30px 0' }}>
                  <button
                    className="btn btn-lg btn-primary btn-block ladda-button"
                    id="start-coin-login"
                    role="menuitem"
                    onClick={ this.toggleActivateCoinForm }
                    disabled={ !this.props.Main }>
                    <span className="ladda-label">{ translate('INDEX.ACTIVATE_COIN') }</span>
                  </button>
                </div>
              </div>

              <div
                id="section-register"
                className={ this.state.activeLoginSection === 'signup' ? 'show' : 'hide' }>
                <div className="register-form">
                  <h4 className="hint" style={{ color: '#fff' }}>
                    { translate('INDEX.SELECT_SEED_TYPE') }:
                  </h4>
                  <div className="form-group form-material floating">
                    <div
                      className="radio-custom radio-default radio-inline"
                      onClick={ () => this.generateNewSeed(256) }>
                      <input
                        type="radio"
                        name="PassPhraseOptions"
                        checked={ this.state.bitsOption === 256 ? true : false } />
                      <label htmlFor="PassPhraseOptionsIguana">Iguana (256 bits)</label>
                    </div>
                    <div
                      className="radio-custom radio-default radio-inline"
                      onClick={ () => this.generateNewSeed(160) }>
                      <input
                        type="radio"
                        name="PassPhraseOptions"
                        checked={ this.state.bitsOption === 160 ? true : false } />
                      <label htmlFor="PassPhraseOptionsWaves">Waves</label>
                    </div>
                    <div
                      className="radio-custom radio-default radio-inline"
                      onClick={ () => this.generateNewSeed(128) }>
                      <input
                        type="radio"
                        name="PassPhraseOptions"
                        checked={ this.state.bitsOption === 128 ? true : false } />
                      <label htmlFor="PassPhraseOptionsNXT">NXT</label>
                    </div>
                  </div>
                  <div className="form-group form-material floating">
                    <textarea
                      className="form-control placeholder-no-fix"
                      type="text"
                      id="walletseed"
                      style={{ height: '100px' }}
                      value={ this.state.randomSeed }
                      readOnly="true"></textarea>
                    <label className="floating-label" htmlFor="walletseed">{ translate('INDEX.WALLET_SEED') }</label>
                  </div>
                  <div className="form-group form-material floating">
                    <textarea
                      className="form-control placeholder-no-fix"
                      type="text"
                      name="randomSeedConfirm"
                      onChange={ this.updateInput }
                      id="rwalletseed"
                      style={{ height: '100px' }}></textarea>
                    <span className={ this.state.isSeedConfirmError ? 'help-block' : 'hide' }>{ translate('LOGIN.ENTER_VALUE_AGAIN') }.</span>
                    <label className="floating-label" htmlFor="rwalletseed">{ translate('INDEX.CONFIRM_SEED') }</label>
                  </div>
                  <button
                    type="button"
                    id="register-submit-btn"
                    className="btn btn-primary btn-block"
                    onClick={ this.handleRegisterWallet }>{ translate('INDEX.REGISTER') }</button>
                  <div className="form-group form-material floating">
                    <button
                      className="btn btn-lg btn-flat btn-block waves-effect"
                      id="register-back-btn"
                      onClick={ () => this.updateActiveLoginSection('login') }>{ translate('INDEX.BACK_TO_LOGIN') }</button>
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

export default Login;
