import React from 'react';
import { translate } from '../../translate/translate';
import {
  toggleAddcoinModal,
  iguanaWalletPassphrase,
  iguanaActiveHandle
} from '../../actions/actionCreators';
import Store from '../../store';

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      activeLoginSection: 'activateCoin',
      loginPassphrase: null,
      seedInputVisibility: false,
    };
    /*this.toggleActivateCoinForm = this.toggleActivateCoinForm.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.loginSeed = this.loginSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.handleRegisterWallet = this.handleRegisterWallet.bind(this);*/
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
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

  render() {
    if (this.props.Dashboard.activateLoginModal) {
      return (
        <div>
          <div
            className={ 'modal modal-3d-sign add-coin-modal ' + (this.state.display ? 'show in' : 'fade hide') }
            id="AddCoinDilogModel-login"
            aria-hidden="true"
            aria-labelledby="AddCoinDilogModel-login"
            role="dialog"
            tabIndex="-1">
            <div className="modal-dialog modal-center modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-orange-a400 wallet-send-header">
                  <button
                    type="button"
                    className="close white"
                    aria-label="Close"
                    onClick={ this.dismiss }>
                    <span aria-hidden="true">×</span>
                  </button>
                  <h4 className="modal-title white">{ translate('INDEX.SELECT_A_COIN') }</h4>
                </div>
                <div className="modal-body">
                  <div id="wallet-login">
                    <div className="page animsition vertical-align text-center fade-in">
                      <div className="page-content vertical-align-middle">
                        <div className="brand">
                          <img className="brand-img" src="assets/images/easydex-logo-big.png" alt="SuperNET Iguana" />
                        </div>

                        <div id="section-login" className={ this.state.activeLoginSection === 'login' ? 'show' : 'hide' }>
                          <h4 className="color-white" id="login-welcome">{ translate('INDEX.WELCOME_LOGIN') }</h4>
                          <div className="login-form">
                            <div className="form-group form-material floating">
                              <input
                                type={ this.state.seedInputVisibility ? 'text' : 'password' }
                                className="form-control"
                                name="loginPassphrase"
                                id="password"
                                onChange={ this.updateInput } />
                              <i
                                className={ this.state.seedInputVisibility ? 'seed-toggle fa fa-eye-slash' : 'seed-toggle fa fa-eye' }
                                onClick={ this.toggleSeedInputVisibility }></i>
                              <label className="floating-label" htmlFor="inputPassword">{translate('INDEX.WALLET_SEED')}</label>
                            </div>
                            <button
                              type="button"
                              className="btn btn-primary btn-block"
                              id="loginbtn"
                              onClick={ this.loginSeed }
                              disabled={ !this.state.loginPassphrase || !this.state.loginPassphrase.length }>{ translate('INDEX.SIGN_IN') }</button>
                          </div>
                        </div>
                      </div>
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

export default LoginModal;
