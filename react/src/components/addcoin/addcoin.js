import React from 'react';
import { translate } from '../../translate/translate';
import {
  addCoin,
  toggleAddcoinModal,
  triggerToaster,
  shepherdGetCoinList,
  shepherdPostCoinList
} from '../../actions/actionCreators';
import Store from '../../store';
import AddCoinOptionsCrypto from './addcoinOptionsCrypto';
import AddCoinOptionsAC from './addcoinOptionsAC';
import AddCoinOptionsACFiat from './addcoinOptionsACFiat';

class AddCoin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coins: [],
      defaultCoinState: {
        selectedCoin: null,
        fullMode: {
          disabled: true,
          checked: false,
        },
        basiliskMode: {
          disabled: true,
          checked: false,
        },
        nativeMode: {
          disabled: true,
          checked: false,
        },
        mode: -2,
        syncOnly: false,
      },
      display: false,
      actionsMenu: false,
      modalClassName: 'hide',
    };
    this.activateCoin = this.activateCoin.bind(this);
    this.dismiss = this.dismiss.bind(this);
    this.addNewItem = this.addNewItem.bind(this);
    this.activateAllCoins = this.activateAllCoins.bind(this);
    this.toggleActionsMenu = this.toggleActionsMenu.bind(this);
    this.saveCoinSelection = this.saveCoinSelection.bind(this);
    this.loadCoinSelection = this.loadCoinSelection.bind(this);
  }

  saveCoinSelection() {
    shepherdPostCoinList(this.state.coins)
    .then(function(json) {
      this.toggleActionsMenu();
    }.bind(this));
  }

  loadCoinSelection() {
    shepherdGetCoinList()
    .then(function(json) {
      if (json.msg !== 'error') {
        this.setState(Object.assign({}, this.state, {
          coins: json.result,
          actionsMenu: false,
        }));
      } else {
        Store.dispatch(triggerToaster(true, translate('TOASTR.SELECTION_NOT_FOUND'), translate('TOASTR.COIN_SELECTION'), 'info'));
      }
    }.bind(this));
  }

  toggleSyncOnlyMode(index) {
    let _coins = this.state.coins;

    _coins[index] = Object.assign({}, _coins[index], {
      syncOnly: !this.state.coins[index].syncOnly,
    });

    this.setState(Object.assign({}, this.state, {
      coins: _coins,
    }));
  }

  toggleActionsMenu() {
    this.setState(Object.assign({}, this.state, {
      actionsMenu: !this.state.actionsMenu,
    }));
  }

  componentWillMount() {
    this.addNewItem();
  }

  componentWillReceiveProps(props) {
    if (props && props.display !== this.state.display) {
      this.setState(Object.assign({}, this.state, {
        display: props.display,
        modalClassName: props.display ? 'show fade' : 'show fade',
      }));

      setTimeout(function() {
        this.setState(Object.assign({}, this.state, {
          display: props.display,
          modalClassName: props.display ? 'show in' : 'hide',
        }));
      }.bind(this), 100);
    }
  }

  updateSelectedCoin(e, index) {
    const coin = e.target.value.split('|');
    const defaultMode = coin[1];
    const modeToValue = {
      'full': 1,
      'basilisk': 0,
      'native': -1,
    };
    let _coins = this.state.coins;

    _coins[index] = {
      [e.target.name]: e.target.value,
      fullMode: {
        disabled: e.target.value.indexOf('full') > -1 ? false : true,
        checked: defaultMode === 'full' ? true : false,
      },
      basiliskMode: {
        disabled: e.target.value.indexOf('basilisk') > -1 ? false : true,
        checked: defaultMode === 'basilisk' ? true : false,
      },
      nativeMode: {
        disabled: e.target.value.indexOf('native') > -1 ? false : true,
        checked: defaultMode === 'native' ? true : false,
      },
      mode: modeToValue[defaultMode] !== undefined ? modeToValue[defaultMode] : -2,
      syncOnly: this.state.coins[index].syncOnly,
    }

    this.setState(Object.assign({}, this.state, {
      coins: _coins,
    }));
  }

  updateSelectedMode(_value, index) {
    let _coins = this.state.coins;

    _coins[index] = {
      selectedCoin: _coins[index].selectedCoin,
      fullMode: {
        disabled: _coins[index].selectedCoin.indexOf('full') > -1 ? false : true,
        checked: _value === '1' ? true : false,
      },
      basiliskMode: {
        disabled: _coins[index].selectedCoin.indexOf('basilisk') > -1 ? false : true,
        checked: _value === '0' ? true : false,
      },
      nativeMode: {
        disabled: _coins[index].selectedCoin.indexOf('native') > -1 ? false : true,
        checked: _value === '-1' ? true : false,
      },
      mode: _value,
      syncOnly: this.state.coins[index].syncOnly,
    };

    this.setState(Object.assign({}, this.state, {
      coins: _coins
    }));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.dismiss();
    }
  }

  activateCoin() {
    Store.dispatch(addCoin(
      this.state.coins[0].selectedCoin.split('|')[0],
      this.state.coins[0].mode,
      this.state.coins[0].syncOnly
    ));

    this.removeCoin();
    this.addNewItem();

    Store.dispatch(toggleAddcoinModal(false, false));
  }

  dismiss() {
    Store.dispatch(toggleAddcoinModal(false, false));
  }

  addNewItem() {
    let _coins = this.state.coins;
    _coins.push(this.state.defaultCoinState);

    this.setState(Object.assign({}, this.state, {
      coins: _coins,
    }));
  }

  removeCoin(index) {
    let _coins = this.state.coins;
    _coins.splice(index, 1);

    this.setState(Object.assign({}, this.state, {
      coins: _coins,
    }));
  }

  activateAllCoins() {
    Store.dispatch(addCoin(
      this.state.coins[0].selectedCoin.split('|')[0],
      this.state.coins[0].mode,
      this.state.coins[0].syncOnly
    ));

    for (let i = 1; i < this.state.coins.length; i++) {
      const _item = this.state.coins[i];

      setTimeout(function() {
        Store.dispatch(addCoin(
          _item.selectedCoin.split('|')[0],
          _item.mode,
          _item.syncOnly
        ));

        if (i === this.state.coins.length - 1) {
          let _coins = [];
          _coins.push(this.state.defaultCoinState);

          this.setState(Object.assign({}, this.state, {
            coins: _coins,
          }));

          Store.dispatch(toggleAddcoinModal(false, false));
        }
      }.bind(this), 2000 * i);
    }
  }

  renderCoinSelectors() {
    let items = [];

    for (let i = 0; i < this.state.coins.length; i++) {
      const _item = this.state.coins[i];
      const _coin = _item.selectedCoin || '';

      items.push(
        <div className={ this.state.coins.length > 1 ? 'multi' : 'single' } key={ 'add-coin-' + i }>
          <div className="col-sm-8">
            <div className="form-group">
              <select
                className="form-control form-material"
                name="selectedCoin"
                id="addcoin_select_coin_mdl_options-login"
                value={ _coin }
                onChange={ (event) => this.updateSelectedCoin(event, i) }
                autoFocus>
                <option>{ translate('INDEX.SELECT') }</option>
                <AddCoinOptionsCrypto />
                <AddCoinOptionsAC />
                <AddCoinOptionsACFiat />
              </select>
            </div>
          </div>
          <div className={ this.state.coins.length > 1 ? 'hide' : 'col-sm-4' }>
            <button
              type="button"
              className="btn btn-primary mdl_addcoin_done_btn-login"
              id="mdl_addcoin_done_btn-login"
              onClick={ () => this.activateCoin(i) }
              disabled={ _item.mode === -2 }>{ translate('INDEX.ACTIVATE_COIN') }</button>
          </div>
          <div className="col-sm-12 text-center">
            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 style-addcoin-lbl-mdl-login">
              <input
                type="radio"
                className="to-labelauty labelauty"
                name={ `mode-${i}` }
                id={ `addcoin_mdl_full_mode_login-${i}` }
                disabled={ _item.fullMode.disabled }
                checked={ _item.fullMode.checked } />
              <label
                htmlFor={ `addcoin_mdl_full_mode_login-${i}` }
                onClick={ () => this.updateSelectedMode('1', i) }
                style={{ pointerEvents: _item.fullMode.disabled ? 'none' : 'all' }}>
                <span
                  className="labelauty-unchecked-image"
                  style={{ display: _item.fullMode.checked ? 'none' : 'inline-block' }}></span>
                <span
                  className="labelauty-unchecked"
                  style={{ display: _item.fullMode.checked ? 'none' : 'inline-block' }}>{ translate('INDEX.FULL_MODE') }</span>
                <span
                  className="labelauty-checked-image"
                  style={{ display: _item.fullMode.checked ? 'inline-block' : 'none' }}></span>
                <span
                  className="labelauty-checked"
                  style={{ display: _item.fullMode.checked ? 'inline-block' : 'none' }}>{ translate('INDEX.FULL_MODE') }</span>
              </label>
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-6 col-xs-6 style-addcoin-lbl-mdl-login">
              <input
                type="radio"
                className="to-labelauty labelauty"
                name={ `mode-${i}` }
                id={ `addcoin_mdl_basilisk_mode_login-${i}` }
                disabled={ _item.basiliskMode.disabled }
                checked={ _item.basiliskMode.checked } />
              <label
                htmlFor={ `addcoin_mdl_basilisk_mode_login-${i}` }
                onClick={ () => this.updateSelectedMode('0', i) }
                style={{ pointerEvents: _item.basiliskMode.disabled ? 'none' : 'all' }}>
                <span
                  className="labelauty-unchecked-image"
                  style={{ display: _item.basiliskMode.checked ? 'none' : 'inline-block' }}></span>
                <span
                  className="labelauty-unchecked"
                  style={{ display: _item.basiliskMode.checked ? 'none' : 'inline-block' }}>{ translate('INDEX.BASILISK_MODE') }</span>
                <span
                  className="labelauty-checked-image"
                  style={{ display: _item.basiliskMode.checked ? 'inline-block' : 'none' }}></span>
                <span
                  className="labelauty-checked"
                  style={{ display: _item.basiliskMode.checked ? 'inline-block' : 'none' }}>{ translate('INDEX.BASILISK_MODE') }</span>
              </label>
            </div>
            <div className="form-group col-lg-4 col-md-4 col-sm-12 col-xs-12 style-addcoin-lbl-mdl-login">
              <input
                type="radio"
                className="to-labelauty labelauty"
                name={ `mode-${i}` }
                id={ `addcoin_mdl_native_mode_login-${i}` }
                disabled={ _item.nativeMode.disabled }
                checked={ _item.nativeMode.checked } />
              <label
                htmlFor={ `addcoin_mdl_native_mode_login-${i}` }
                onClick={ () => this.updateSelectedMode('-1', i) }
                style={{ pointerEvents: _item.nativeMode.disabled ? 'none' : 'all' }}>
                <span
                  className="labelauty-unchecked-image"
                  style={{ display: _item.nativeMode.checked ? 'none' : 'inline-block' }}></span>
                <span
                  className="labelauty-unchecked"
                  style={{ display: _item.nativeMode.checked ? 'none' : 'inline-block' }}>{ translate('INDEX.NATIVE_MODE') }</span>
                <span
                  className="labelauty-checked-image"
                  style={{ display: _item.nativeMode.checked ? 'inline-block' : 'none' }}></span>
                <span
                  className="labelauty-checked"
                  style={{ display: _item.nativeMode.checked ? 'inline-block' : 'none' }}>{ translate('INDEX.NATIVE_MODE') }</span>
              </label>
            </div>
          </div>
          <div className={ this.state.coins.length > 1 && i !== 0 ? 'col-sm-1' : 'hide' }>
            <button
              type="button"
              className="btn btn-primary mdl_addcoin_done_btn-login"
              id="mdl_addcoin_done_btn-login"
              onClick={ () => this.removeCoin(i) }>
              <i className="fa fa-trash-o"></i>
            </button>
          </div>
          <div className={ _item.mode === '1' || _item.mode === 1 ? 'col-sm-12' : 'hide' }>
            <div className="toggle-box padding-top-3 padding-bottom-10">
              <span className="pointer">
                <label className="switch">
                  <input type="checkbox" checked={ _item.syncOnly } />
                  <div className="slider" onClick={ () => this.toggleSyncOnlyMode(i) }></div>
                </label>
                <div className="toggle-label" onClick={ () => this.toggleSyncOnlyMode(i) }>{ translate('ADD_COIN.SYNC_ONLY') }</div>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return items;
  }

  render() {
    return (
      <div onKeyDown={ (event) => this.handleKeydown(event) }>
        <div
          className={ 'modal modal-3d-sign add-coin-modal ' + this.state.modalClassName }
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
                  aria-label="Close" onClick={ this.dismiss }>
                  <span aria-hidden="true">×</span>
                </button>
                <h4 className="modal-title white">{ translate('INDEX.SELECT_A_COIN') }</h4>
              </div>
              <div className="modal-body">
                <button className="btn btn-primary btn-add-coin-item" onClick={ this.addNewItem }>+</button>
                <button className="btn btn-outline-primary btn-add-coin-item-options" onClick={ this.toggleActionsMenu }>
                  <i className={ this.state.actionsMenu ? 'fa-chevron-up' : 'fa-chevron-down' }></i>
                </button>
                <span className={ !this.state.actionsMenu ? 'hide' : '' }>
                  <button
                    className="btn btn-outline-primary btn-save-coin-selection"
                    onClick={ this.saveCoinSelection }>{ translate('ADD_COIN.SAVE_SELECTION') }</button>
                  <button
                    className="btn btn-outline-primary btn-load-coin-selection"
                    onClick={ this.loadCoinSelection }>{ translate('ADD_COIN.LOAD_SELECTION') }</button>
                </span>
                { this.renderCoinSelectors() }
                <div
                  className={ this.state.coins.length > 1 ? 'col-sm-12' : 'hide' }
                  style={{ textAlign: 'center', margin: '20px 0' }}>
                  <button
                    type="button"
                    className="btn btn-primary col-sm-4"
                    style={{ float: 'none' }}
                    id="mdl_addcoin_done_btn-login"
                    onClick={ this.activateAllCoins }>{ translate('ADD_COIN.ACTIVATE_ALL') }</button>
                </div>
                <div className="col-sm-12">
                  <p>
                    <strong>{ translate('INDEX.FULL_MODE') }:</strong> { translate('INDEX.FULL_MODE_DESC') }
                  </p>
                  <p>
                    <strong>{ translate('INDEX.BASILISK_MODE') }:</strong> { translate('INDEX.BASILISK_MODE_DESC') }
                  </p>
                  <p>
                    <strong>{ translate('INDEX.NATIVE_MODE') }:</strong> { translate('INDEX.NATIVE_MODE_DESC1') } <strong>Komodo Daemon</strong> { translate('INDEX.NATIVE_MODE_DESC2') } <i>Iguana Daemon</i> { translate('INDEX.NATIVE_MODE_DESC3') }.
                  </p>
                  <div className="alert alert-icon alert-primary" role="alert">
                    <button type="button" className="close" aria-label="Close">
                      <span aria-hidden="true">×</span>
                    </button>
                    <i className="icon md-info-outline" aria-hidden="true"></i> <strong>{ translate('INDEX.NATIVE_MODE') }</strong> { translate('INDEX.NATIVE_MODE_DESC4') } <strong>{ translate('INDEX.NATIVE_MODE_DESC5') }</strong>, <i>{ translate('INDEX.NATIVE_MODE_DESC5') }</i>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={ 'modal-backdrop ' + (this.state.display ? 'show in' : 'fade hide') }></div>
      </div>
    );
  }
}

export default AddCoin;
