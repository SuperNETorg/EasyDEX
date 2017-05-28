import React from 'react';
import { translate } from '../../translate/translate';
import {
  iguanaActiveHandle,
  encryptWallet,
  settingsWifkeyState,
  importPrivKey,
  getDebugLog,
  getPeersList,
  addPeerNode,
  getAppConfig,
  saveAppConfig,
  getAppInfo
} from '../../actions/actionCreators';
import Store from '../../store';
import AddCoinOptionsCrypto from '../addcoin/addcoinOptionsCrypto';
import AddCoinOptionsAC from '../addcoin/addcoinOptionsAC';
import AddCoinOptionsACFiat from '../addcoin/addcoinOptionsACFiat';

/*
  TODO:
  1) pre-select active coin in add node tab
  2) add fiat section
  3) kickstart section
  4) batch export/import wallet addresses
*/
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
      debugLinesCount: 10,
      debugTarget: 'iguana',
      activeTabHeight: '10px',
      appSettings: {},
    };
    this.exportWifKeys = this.exportWifKeys.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.updateInputSettings = this.updateInputSettings.bind(this);
    this.importWifKey = this.importWifKey.bind(this);
    this.readDebugLog = this.readDebugLog.bind(this);
    this.checkNodes = this.checkNodes.bind(this);
    this.addNode = this.addNode.bind(this);
    this.renderPeersList = this.renderPeersList.bind(this);
    this.renderSNPeersList = this.renderSNPeersList.bind(this);
    this._saveAppConfig = this._saveAppConfig.bind(this);
  }

  componentDidMount() {
    Store.dispatch(iguanaActiveHandle());
    Store.dispatch(getAppConfig());
    Store.dispatch(getAppInfo());
  }

  openTab(elemId, tab) {
    const _height = document.querySelector('#' + elemId + ' .panel-collapse .panel-body').offsetHeight;

    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
      activeTabHeight: _height,
    }));
  }

  exportWifKeys() {
    Store.dispatch(encryptWallet(this.state.wifkeysPassphrase, settingsWifkeyState, this.props.ActiveCoin.coin));
  }

  importWifKey() {
    Store.dispatch(importPrivKey(this.state.importWifKey));
  }

  readDebugLog() {
    Store.dispatch(getDebugLog(this.state.debugTarget, this.state.debugLinesCount));
  }

  checkNodes() {
    if (this.state.getPeersCoin) {
      Store.dispatch(getPeersList(this.state.getPeersCoin.split('|')[0]));
    }
  }

  addNode() {
    if (this.state.addNodeCoin) {
      Store.dispatch(addPeerNode(this.state.addNodeCoin.split('|')[0], this.state.addPeerIP));
    }
  }

  renderPeersList() {
    if (this.state.getPeersCoin) {
      const coin = this.state.getPeersCoin.split('|')[0];

      if (this.props.Settings.rawPeers &&
          this.state.getPeersCoin &&
          this.props.Settings.rawPeers[coin]) {
        return this.props.Settings.rawPeers[coin].map((ip) =>
          <div key={ ip }>{ ip }</div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  renderAppInfoTab() {
    const releaseInfo = this.props.Settings.appInfo && this.props.Settings.appInfo.releaseInfo;

    if (releaseInfo) {
      return (
        <div className="panel" id="AppInfo">
          <div className="panel-heading" role="tab" onClick={ () => this.openTab('AppInfo', 8) }>
            <a className={this.state.activeTab === 8 ? 'panel-title' : 'panel-title collapsed'}>
              <i className="icon md-info" aria-hidden="true"></i>{ translate('SETTINGS.APP_INFO') }
            </a>
          </div>
          <div
            className={ this.state.activeTab === 8 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
            style={{ height: this.state.activeTab === 8 ? this.state.activeTabHeight + 'px' : '10px' }}
            aria-labelledby="DebugLog"
            role="tabpanel">
            <div className="panel-body">
              <div className="col-sm-12" style={{ paddingTop: '15px' }}>
                <div className="row">
                  <h5>{ translate('SETTINGS.APP_RELEASE') }</h5>
                  <div>
                    { translate('SETTINGS.NAME') }: { this.props.Settings.appInfo.releaseInfo.name }
                  </div>
                  <div>
                    { translate('SETTINGS.VERSION') }: { this.props.Settings.appInfo.releaseInfo.version }
                  </div>
                  <div>
                    { translate('SETTINGS.APP_SESSION') }: { this.props.Settings.appInfo.appSession }
                  </div>
                </div>
              </div>
              <div className="col-sm-12" style={{ paddingTop: '20px' }}>
                <div className="row">
                  <h5>{ translate('SETTINGS.SYS_INFO') }</h5>
                  <div>
                    { translate('SETTINGS.ARCH') }: { this.props.Settings.appInfo.sysInfo.arch }
                  </div>
                  <div>
                    { translate('SETTINGS.OS_TYPE') }: { this.props.Settings.appInfo.sysInfo.os_type }
                  </div>
                  <div>
                    { translate('SETTINGS.OS_PLATFORM') }: { this.props.Settings.appInfo.sysInfo.platform }
                  </div>
                  <div>
                    { translate('SETTINGS.OS_RELEASE') }: { this.props.Settings.appInfo.sysInfo.os_release }
                  </div>
                  <div>
                    { translate('SETTINGS.CPU') }: { this.props.Settings.appInfo.sysInfo.cpu }
                  </div>
                  <div>
                    { translate('SETTINGS.CPU_CORES') }: { this.props.Settings.appInfo.sysInfo.cpu_cores }
                  </div>
                  <div>
                    { translate('SETTINGS.MEM') }: { this.props.Settings.appInfo.sysInfo.totalmem_readable }
                  </div>
                </div>
              </div>
              <div className="col-sm-12" style={{ paddingTop: '20px' }}>
                <div className="row">
                  <h5>{ translate('SETTINGS.LOCATIONS') }</h5>
                  <div>
                    { translate('SETTINGS.CACHE') }: { this.props.Settings.appInfo.dirs.cacheLocation }
                  </div>
                  <div>
                    { translate('SETTINGS.CONFIG') }: { this.props.Settings.appInfo.dirs.configLocation }
                  </div>
                  <div>
                    Iguana { translate('SETTINGS.BIN') }: { this.props.Settings.appInfo.dirs.iguanaBin }
                  </div>
                  <div>
                    Iguana { translate('SETTINGS.DIR') }: { this.props.Settings.appInfo.dirs.iguanaDir }
                  </div>
                  <div>
                    Komodo { translate('SETTINGS.BIN') }: { this.props.Settings.appInfo.dirs.komododBin }
                  </div>
                  <div>
                    Komodo { translate('SETTINGS.DIR') }: { this.props.Settings.appInfo.dirs.komodoDir }
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

  renderSNPeersList() {
    if (this.state.getPeersCoin) {
      const coin = this.state.getPeersCoin.split('|')[0];

      if (this.props.Settings.supernetPeers &&
          this.state.getPeersCoin &&
          this.props.Settings.supernetPeers[coin]) {
        return this.props.Settings.supernetPeers[coin].map((ip) =>
          <div key={ ip }>{ ip }</div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  updateInputSettings(e) {
    let _appSettings = this.state.appSettings;
    _appSettings[e.target.name] = e.target.value;

    this.setState({
      appSettings: _appSettings,
    });

    console.log(this.state.appSettings);
  }

  _saveAppConfig() {
    const _appSettings = this.state.appSettings;
    let _appSettingsPristine = Object.assign({}, this.props.Settings.appSettings);

    for (let key in _appSettings) {
      if (key.indexOf('__') === -1) {
        _appSettingsPristine[key] = _appSettings[key];
      } else {
        const _nestedKey = key.split('__');
        _appSettingsPristine[_nestedKey[0]][_nestedKey[1]] = _appSettings[key];
      }
    }

    Store.dispatch(saveAppConfig(_appSettingsPristine));
  }

  renderConfigEditForm() {
    let items = [];
    const _appConfig = this.props.Settings.appSettings;

    for (let key in _appConfig) {
      if (typeof _appConfig[key] === 'object') {
        items.push(
          <tr key={ `app-settings-${key}` }>
            <td style={{ padding: '15px' }}>
              { key }
            </td>
            <td style={{ padding: '15px' }}></td>
          </tr>
        );

        for (let _key in _appConfig[key]) {
          items.push(
            <tr key={ `app-settings-${key}-${_key}` }>
              <td style={{ padding: '15px', paddingLeft: '30px' }}>
                { _key }
              </td>
              <td style={{ padding: '15px' }}>
                <input
                  type="text"
                  name={ `${key}__${_key}` }
                  defaultValue={ _appConfig[key][_key] }
                  onChange={ this.updateInputSettings } />
              </td>
            </tr>
          );
        }
      } else {
        items.push(
          <tr key={ `app-settings-${key}` }>
            <td style={{ padding: '15px' }}>
              { key }
            </td>
            <td style={{ padding: '15px' }}>
              <input
                type="text"
                name={ `${key}` }
                defaultValue={ _appConfig[key] }
                onChange={ this.updateInputSettings } />
            </td>
          </tr>
        );
      }
    }

    return items;
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span key={ `settings-label-${Math.random(0, 9) * 10}` }>
        { _translation }
        <br />
      </span>
    );
  }

  render() {
    return (
      <div style={{ marginLeft: '0' }}>
        <div className="page-content" id="section-iguana-wallet-settings">
          <div className="row" id="iguana-wallet-settings">
            <div className="col-xlg-12 col-md-12">
              <div className="row" id="iguana-wallet-settings">
                <div className="col-xlg-12 col-md-12">
                  <h4 className="font-size-14 text-uppercase">{ translate('INDEX.WALLET_SETTINGS') }</h4>
                  <div className="panel-group" id="SettingsAccordion" aria-multiselectable="true" role="tablist">
                    <div className="panel" id="WalletInfo">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('WalletInfo', 0) }>
                        <a className={ this.state.activeTab === 0 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon md-balance-wallet" aria-hidden="true"></i>{ translate('INDEX.WALLET_INFO') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 0 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 0 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="WalletInfoTab"
                        aria-labelledby="WalletInfo"
                        role="tabpanel">
                        <div className="panel-body">
                          <table className="table" id="wallet-info-table">
                            <thead>
                              <tr>
                                <th width="10%">{ translate('INDEX.KEY') }</th>
                                <th>{ translate('INDEX.VALUE') }</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>pubkey</td>
                                <td>
                                  <div id="winfo_pubkey_value">{ this.props.Main.activeHandle.pubkey }</div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>btcpubkey</td>
                                <td>
                                  <div id="winfo_btcpubkey_value">{ this.props.Main.activeHandle.btcpubkey }</div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>rmd160</td>
                                <td>
                                  <div id="winfo_rmd160_value">{ this.props.Main.activeHandle.rmd160 }</div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>NXT</td>
                                <td>
                                  <div id="winfo_NXT_value">{ this.props.Main.activeHandle.NXT }</div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>notary</td>
                                <td>
                                  <div id="winfo_notary_value">{ this.props.Main.activeHandle.notary }</div>
                                </td>
                              </tr>
                              <tr>
                                <td style={{ fontWeight: 'bold' }}>status</td>
                                <td>
                                  <div id="winfo_status_value">{ this.props.Main.activeHandle.status }</div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="panel" id="AddNodeforCoin">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('AddNodeforCoin', 1) }>
                        <a className={ this.state.activeTab === 1 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon md-plus-square" aria-hidden="true"></i>{ translate('INDEX.ADD_NODE') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 1 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 1 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="AddNodeforCoinTab"
                        aria-labelledby="AddNodeforCoin"
                        role="tabpanel">
                        <div className="panel-body">
                          <div className="row">
                            <div className="col-sm-6">
                              <div className="col-sm-12">
                                <p>{ translate('INDEX.USE_THIS_SECTION') }</p>
                              </div>
                              <div className="col-sm-8 col-xs-12">
                                <div className="form-group">
                                  <select
                                    className="form-control form-material"
                                    id="settings_select_coin_options"
                                    name="getPeersCoin"
                                    onChange={ this.updateInput }>
                                    <option>{ translate('INDEX.SELECT_COIN') }</option>
                                    <AddCoinOptionsCrypto />
                                    <AddCoinOptionsAC />
                                    <AddCoinOptionsACFiat />
                                  </select>
                                </div>
                              </div>
                              <div className="col-sm-4 col-xs-12" style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className="btn btn-primary waves-effect waves-light"
                                  id="settings_getcoinpeers_btn"
                                  onClick={ this.checkNodes }>{ translate('INDEX.CHECK_NODES') }</button>
                              </div>
                              <div className="col-sm-12">
                                <h5>
                                  SuperNET Peers: <span id="coin_supernetpeers_h"></span>
                                </h5>
                                <p id="coin_supernetpeers">{ this.renderSNPeersList() }</p>
                                <h5>
                                  Raw Peers: <span id="coin_rawpeers_h"></span>
                                </h5>
                                <p id="coin_rawpeers">{ this.renderPeersList() }</p>
                              </div>
                            </div>

                            <div className="col-sm-6">
                              <div className="col-sm-12">
                                <p>{ translate('INDEX.USE_THIS_SECTION_PEER') }</p>
                              </div>
                              <div className="col-sm-8 col-xs-12">
                                <div className="form-group">
                                  <select
                                    className="form-control form-material"
                                    id="settings_select_coin_addpeer_options"
                                    name="addNodeCoin"
                                    onChange={ this.updateInput }>
                                    <option>{ translate('INDEX.SELECT_COIN') }</option>
                                    <AddCoinOptionsCrypto />
                                    <AddCoinOptionsAC />
                                    <AddCoinOptionsACFiat />
                                  </select>
                                </div>
                                <div className="form-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    id="settings_add_peer_ip"
                                    name="addPeerIP"
                                    placeholder={ translate('SETTINGS.ADD_PEER_IP') }
                                    onChange={ this.updateInput } />
                                </div>
                              </div>
                              <div className="col-sm-4 col-xs-12" style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  className="btn btn-primary waves-effect waves-light"
                                  id="settings_addcoinpeers_btn"
                                  onClick={ this.addNode }>{ translate('INDEX.ADD_NODE') }</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="panel" id="DumpWallet">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('DumpWallet', 2) }>
                        <a className={this.state.activeTab === 2 ? 'panel-title' : 'panel-title collapsed'}>
                          <i className="icon wb-briefcase" aria-hidden="true"></i>{ translate('INDEX.WALLET_BACKUP') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 2 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 2 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="DumpWalletTab"
                        aria-labelledby="DumpWallet"
                        role="tabpanel">
                        <div className="panel-body">Wallet Backup section to be updated soon.</div>
                      </div>
                    </div>

                    <div className="panel" id="FiatCurrencySettings">
                      <div
                        className="panel-heading"
                        role="tab"
                        onClick={ () => this.openTab('FiatCurrencySettings', 3) }>
                        <a className={ this.state.activeTab === 3 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon fa-money" aria-hidden="true"></i>{ translate('INDEX.FIAT_CURRENCY') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 3 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 3 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="FiatCurrencySettingsTab"
                        aria-labelledby="FiatCurrencySettings"
                        role="tabpanel">
                        <div className="panel-body">Fiat currency settings section to be updated soon.</div>
                      </div>
                    </div>

                    <div className="panel" id="ExportKeys">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('ExportKeys', 4) }>
                        <a className={ this.state.activeTab === 4 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon md-key" aria-hidden="true"></i>{ translate('INDEX.EXPORT_KEYS') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 4 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 4 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="ExportKeysTab"
                        aria-labelledby="ExportKeys"
                        role="tabpanel">
                        <div className="panel-body">
                          <p>
                            <div>{ this.renderLB('INDEX.ONLY_ACTIVE_WIF_KEYS') }</div><br/>
                            <strong>
                              <i>{ translate('INDEX.PLEASE_KEEP_KEYS_SAFE') }</i>
                            </strong>
                          </p>
                          <div className="col-sm-12"></div>
                          <form className="wifkeys-form" method="post" action="javascript:" autoComplete="off">
                            <div className="form-group form-material floating">
                              <input
                                type="password"
                                className="form-control"
                                name="wifkeysPassphrase"
                                id="wifkeys_passphrase"
                                onChange={ this.updateInput } />
                              <label className="floating-label" htmlFor="wifkeys_passphrase">{ translate('INDEX.PASSPHRASE') }</label>
                            </div>
                            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                id="wifkeys_passphrase_btn"
                                onClick={ this.exportWifKeys }>{ translate('INDEX.GET_WIF_KEYS') }</button>
                            </div>
                          </form>

                          <div className="col-sm-12" style={{ paddingTop: '15px' }}>
                            <div className="row" id="wif-priv-keys">
                              <table className={ this.props.Settings && this.props.Settings.address ? 'table show' : 'table hide' }>
                                <tr>
                                  <td style={{ width: '5%' }}>
                                    <strong>{ this.props.ActiveCoin.coin }</strong>
                                  </td>
                                  <td>{ this.props.Settings.address }</td>
                                </tr>
                                <tr>
                                  <td>
                                    <strong>{ this.props.ActiveCoin.coin }Wif</strong>
                                  </td>
                                  <td>{ this.props.Settings.wifkey }</td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="panel" id="ImportKeys">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('ImportKeys', 5) }>
                        <a className={ this.state.activeTab === 5 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon md-key" aria-hidden="true"></i>{ translate('INDEX.IMPORT_KEYS') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 5 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 5 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="ImportKeysTab"
                        aria-labelledby="ImportKeys"
                        role="tabpanel">
                        <div className="panel-body">
                          <p>
                            <div>{ translate('INDEX.IMPORT_KEYS_DESC_P1') }</div><br/>
                            <div>{ translate('INDEX.IMPORT_KEYS_DESC_P2') }</div><br/>
                            <div>{ translate('INDEX.IMPORT_KEYS_DESC_P3') }</div><br/>
                            <strong>
                              <i>{ translate('INDEX.PLEASE_KEEP_KEYS_SAFE') }</i>
                            </strong>
                          </p>
                          <div className="col-sm-12"></div>
                          <form className="wifkeys-import-form" method="post" action="javascript:" autoComplete="off">
                            <div className="form-group form-material floating">
                              <input
                                type="text"
                                className="form-control"
                                name="importWifKey"
                                id="import_wifkey"
                                onChange={ this.updateInput } />
                              <label
                                className="floating-label"
                                htmlFor="import_wifkey">{ translate('INDEX.INPUT_PRIV_KEY') }</label>
                            </div>
                            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                id="import_wifkey_btn"
                                onClick={ this.importWifKey }>{ translate('INDEX.IMPORT_PRIV_KEY') }</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="panel" id="DebugLog">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('DebugLog', 6) }>
                        <a className={ this.state.activeTab === 6 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon fa-bug" aria-hidden="true"></i>{ translate('INDEX.DEBUG_LOG') }
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 6 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 6 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="DebugLogTab" aria-labelledby="DebugLog" role="tabpanel">
                        <div className="panel-body">
                          <p>{ translate('INDEX.DEBUG_LOG_DESC') }</p>
                          <div className="col-sm-12"></div>
                          <form
                            className="read-debug-log-import-form"
                            method="post"
                            action="javascript:"
                            autoComplete="off">
                            <div className="form-group form-material floating">
                              <input
                                type="text"
                                className="form-control"
                                name="debugLinesCount"
                                id="read_debug_log_lines"
                                value={ this.state.debugLinesCount }
                                onChange={ this.updateInput } />
                              <label
                                className="floating-label"
                                htmlFor="read_debug_log_lines">{ translate('INDEX.DEBUG_LOG_LINES') }</label>
                            </div>
                            <div className="form-group form-material floating">
                              <select
                                className="form-control form-material"
                                name="debugTarget"
                                id="settings_select_debuglog_options"
                                onChange={ this.updateInput }>
                                <option value="iguana">Iguana</option>
                                <option value="komodo">Komodo</option>
                              </select>
                              <label
                                className="floating-label"
                                htmlFor="settings_select_debuglog_options">{ translate('INDEX.TARGET') }</label>
                            </div>
                            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'center'}}>
                              <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                id="read_debug_log_btn"
                                onClick={ this.readDebugLog }>{ translate('INDEX.LOAD_DEBUG_LOG') }</button>
                            </div>
                            <div className="col-sm-12 col-xs-12" style={{ textAlign: 'left' }}>
                              <div style={{ padding: '20px 0', paddingTop: '40px' }}>{ this.props.Settings.debugLog }</div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="panel" id="AppSettings">
                      <div className="panel-heading" role="tab" onClick={ () => this.openTab('AppSettings', 7) }>
                        <a className={ this.state.activeTab === 7 ? 'panel-title' : 'panel-title collapsed' }>
                          <i className="icon fa-wrench" aria-hidden="true"></i>{ translate('SETTINGS.APP_CONFIG') } (config.json)
                        </a>
                      </div>
                      <div
                        className={ this.state.activeTab === 7 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                        style={{ height: this.state.activeTab === 7 ? this.state.activeTabHeight + 'px' : '10px' }}
                        id="DebugLogTab" aria-labelledby="DebugLog" role="tabpanel">
                        <div className="panel-body">
                          <p>
                            <strong>{ translate('SETTINGS.CONFIG_RESTART_REQUIRED') }</strong>
                          </p>
                          <div className="col-sm-12" style={{ paddingTop: '15px' }}>
                            <table>
                              <tbody>
                              { this.renderConfigEditForm() }
                              </tbody>
                            </table>
                          </div>
                          <div className="col-sm-12 col-xs-12" style={{ textAlign: 'center', paddingTop: '25px', paddingBottom: '25px' }}>
                            <button
                              type="button"
                              className="btn btn-primary waves-effect waves-light"
                              id="read_debug_log_btn"
                              onClick={ this._saveAppConfig }>{ translate('SETTINGS.SAVE_APP_CONFIG') }</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    { this.renderAppInfoTab() }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
