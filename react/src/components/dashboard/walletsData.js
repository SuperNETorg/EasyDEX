import React from 'react';
import Config from '../../config';
import { translate } from '../../translate/translate';
import { secondsToString } from '../../util/time';
import { sortByDate } from '../../util/sort';
import {
  basiliskRefresh,
  basiliskConnection,
  toggleDashboardTxInfoModal,
  getBasiliskTransactionsList,
  changeMainBasiliskAddress,
  displayNotariesModal,
  toggleViewCacheModal,
  changeActiveAddress,
  restartBasiliskInstance,
  connectNotaries,
  getDexNotaries,
  deleteCacheFile,
  fetchNewCacheData,
  fetchUtxoCache
} from '../../actions/actionCreators';
import Store from '../../store';

import WalletsBasiliskRefresh from './walletsBasiliskRefresh';
import WalletsBasiliskConnection from './walletsBasiliskConnection';
import WalletsNotariesList from './walletsNotariesList';
import WalletsCacheData from './walletsCacheData';

import { SocketProvider } from 'socket.io-react';
import io from 'socket.io-client';

const socket = io.connect('http://127.0.0.1:' + Config.agamaPort);

class WalletsData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basiliskActionsMenu: false,
      itemsPerPage: 10,
      activePage: 1,
      itemsList: null,
      currentAddress: null,
      addressSelectorOpen: false,
      currentStackLength: 0,
      totalStackLength: 0,
      useCache: true,
    };
    this.updateInput = this.updateInput.bind(this);
    this.toggleBasiliskActionsMenu = this.toggleBasiliskActionsMenu.bind(this);
    this.basiliskRefreshAction = this.basiliskRefreshAction.bind(this);
    this.basiliskConnectionAction = this.basiliskConnectionAction.bind(this);
    this.getDexNotariesAction = this.getDexNotariesAction.bind(this);
    this.openDropMenu = this.openDropMenu.bind(this);
    this.removeAndFetchNewCache = this.removeAndFetchNewCache.bind(this);
    this._toggleViewCacheModal = this._toggleViewCacheModal.bind(this);
    this.toggleCacheApi = this.toggleCacheApi.bind(this);
    this._fetchUtxoCache = this._fetchUtxoCache.bind(this);
    this.restartBasiliskInstance = this.restartBasiliskInstance.bind(this);
    this.basiliskRefreshActionOne = this.basiliskRefreshActionOne.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    socket.on('messages', msg => this.updateSocketsData(msg));
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside(e) {
    if (e.srcElement.className !== 'btn dropdown-toggle btn-info' &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className !== 'btn dropdown-toggle btn-info') &&
        (e.path && e.path[4] && e.path[4].className.indexOf('showkmdwalletaddrs') === -1) &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className.indexOf('dropdown') === -1) &&
        e.srcElement.className !== 'dropdown-toggle btn-xs btn-default') {
      this.setState({
        addressSelectorOpen: false,
        basiliskActionsMenu: false,
      });
    }
  }

  toggleCacheApi() {
    const _useCache = !this.state.useCache;

    sessionStorage.setItem('useCache', _useCache);
    this.setState(Object.assign({}, this.state, {
      useCache: _useCache,
    }));
  }

  restartBasiliskInstance() {
    Store.dispatch(restartBasiliskInstance());
  }

  _toggleViewCacheModal() {
    Store.dispatch(toggleViewCacheModal(!this.props.Dashboard.displayViewCacheModal));
  }

  updateSocketsData(data) {
    if (data &&
        data.message &&
        data.message.shepherd.iguanaAPI &&
        data.message.shepherd.iguanaAPI.totalStackLength) {
      this.setState(Object.assign({}, this.state, {
        totalStackLength: data.message.shepherd.iguanaAPI.totalStackLength,
      }));
    }
    if (data &&
        data.message &&
        data.message.shepherd.iguanaAPI &&
        data.message.shepherd.iguanaAPI.currentStackLength) {
      this.setState(Object.assign({}, this.state, {
        currentStackLength: data.message.shepherd.iguanaAPI.currentStackLength,
      }));
    }
    if (data &&
        data.message &&
        data.message.shepherd.method &&
        data.message.shepherd.method === 'cache-one' &&
        data.message.shepherd.status === 'done') {
      Store.dispatch(basiliskRefresh(false));
    }
  }

  removeAndFetchNewCache() {
    Store.dispatch(deleteCacheFile({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
      'address': this.state.currentAddress,
    }));
  }

  _fetchUtxoCache() {
    Store.dispatch(fetchUtxoCache({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'refresh',
      'address': this.state.currentAddress,
    }));
  }

  toggleBasiliskActionsMenu() {
    this.setState(Object.assign({}, this.state, {
      basiliskActionsMenu: !this.state.basiliskActionsMenu,
    }));
  }

  basiliskRefreshAction() {
    Store.dispatch(fetchNewCacheData({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
    }));
  }

  basiliskRefreshActionOne() {
    Store.dispatch(fetchNewCacheData({
      'pubkey': this.props.Dashboard.activeHandle.pubkey,
      'allcoins': false,
      'coin': this.props.ActiveCoin.coin,
      'calls': 'listtransactions:getbalance',
      'address': this.props.ActiveCoin.activeAddress,
    }));
  }

  basiliskConnectionAction() {
    if (this.props.Dashboard) {
      Store.dispatch(basiliskConnection(!this.props.Dashboard.basiliskConnection));
      Store.dispatch(connectNotaries());
    }
  }

  getDexNotariesAction() {
    Store.dispatch(getDexNotaries(this.props.ActiveCoin.coin));
    Store.dispatch(displayNotariesModal(true));
  }

  updateInput(e) {
    let historyToSplit = sortByDate(this.props.ActiveCoin.txhistory);
    historyToSplit = historyToSplit.slice(0, e.target.value);

    this.setState({
      [e.target.name]: e.target.value,
      activePage: 1,
      itemsList: historyToSplit,
    });
  }

  toggleTxInfoModal(display, txIndex) {
    Store.dispatch(toggleDashboardTxInfoModal(display, txIndex));
  }

  componentWillReceiveProps(props) {
    if (!this.state.currentAddress &&
        this.props.ActiveCoin.activeAddress) {
      this.setState(Object.assign({}, this.state, {
        currentAddress: this.props.ActiveCoin.activeAddress,
      }));
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory !== 'no data' &&
        this.props.ActiveCoin.txhistory.length) {
      if (!this.state.itemsList ||
          (this.state.itemsList && !this.state.itemsList.length) ||
          (props.ActiveCoin.txhistory !== this.props.ActiveCoin.txhistory)) {
        let historyToSplit = sortByDate(this.props.ActiveCoin.txhistory);
        historyToSplit = historyToSplit.slice((this.state.activePage - 1) * this.state.itemsPerPage, this.state.activePage * this.state.itemsPerPage);

        this.setState(Object.assign({}, this.state, {
          itemsList: historyToSplit,
        }));
      }
    }

    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory === 'no data') {
      this.setState(Object.assign({}, this.state, {
        itemsList: 'no data',
      }));
    } else if (this.props.ActiveCoin.txhistory && this.props.ActiveCoin.txhistory === 'loading') {
      this.setState(Object.assign({}, this.state, {
        itemsList: 'loading',
      }));
    }
  }

  updateCurrentPage(page) {
    let historyToSplit = sortByDate(this.props.ActiveCoin.txhistory);
    historyToSplit = historyToSplit.slice((page - 1) * this.state.itemsPerPage, page * this.state.itemsPerPage);

    this.setState(Object.assign({}, this.state, {
      activePage: page,
      itemsList: historyToSplit,
    }));
  }

  renderPaginationItems() {
    let items = [];

    for (let i=0; i < Math.ceil(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage); i++) {
      items.push(
        <li
          key={ `${i}-pagination-link` }
          className={ this.state.activePage === i + 1 ? 'paginate_button active' : 'paginate_button' }>
          <a
            aria-controls="kmd-tx-history-tbl"
            tabIndex="0" key={ `${i}-pagination` }
            onClick={ this.state.activePage !== (i + 1) ? () => this.updateCurrentPage(i + 1) : null }>{ i + 1 }</a>
        </li>
      );
    }

    return items;
  }

  renderPaginationItemsPerPageSelector() {
    if (this.props.ActiveCoin.txhistory &&
        this.state.itemsList !== 'loading' &&
        this.props.ActiveCoin.txhistory.length > 10) {
      return (
        <div className="dataTables_length" id="kmd-tx-history-tbl_length">
          <label>
            { translate('INDEX.SHOW') }&nbsp;
            <select
              name="itemsPerPage"
              aria-controls="kmd-tx-history-tbl"
              className="form-control input-sm"
              onChange={ this.updateInput }>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>&nbsp;
            { translate('INDEX.ENTRIES_SM') }
          </label>
        </div>
      );
    } else {
      return null;
    }
  }

  renderPagination() {
    if (this.props.ActiveCoin.txhistory &&
        this.state.itemsList !== 'loading' &&
        this.props.ActiveCoin.txhistory.length > 10) {
      const _paginationFrom = ((this.state.activePage - 1) * this.state.itemsPerPage) + 1;
      const _paginationTo = this.state.activePage * this.state.itemsPerPage;

      return (
        <div className="row unselectable">
          <div className="col-sm-5">
            <div
              className="dataTables_info"
              id="kmd-tx-history-tbl_info"
              role="status"
              aria-live="polite">{ translate('INDEX.SHOWING') } { _paginationFrom } { translate('INDEX.TO_ALT') } { _paginationTo } { translate('INDEX.OF') } { this.props.ActiveCoin.txhistory.length } { translate('INDEX.ENTRIES_SM') }</div>
          </div>
          <div className="col-sm-7">
            <div className="dataTables_paginate paging_simple_numbers" id="kmd-tx-history-tbl_paginate">
              <ul className="pagination">
                <li
                  className={ this.state.activePage === 1 ? 'paginate_button previous disabled' : 'paginate_button previous' }
                  id="kmd-tx-history-tbl_previous">
                  <a
                    aria-controls="kmd-tx-history-tbl"
                    tabIndex="0"
                    onClick={ () => this.updateCurrentPage(this.state.activePage - 1) }>{ translate('INDEX.PREVIOUS') }</a>
                </li>
                { this.renderPaginationItems() }
                <li
                  className={ this.state.activePage > Math.floor(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage) ? 'paginate_button next disabled' : 'paginate_button next' }
                  id="kmd-tx-history-tbl_next">
                  <a
                    aria-controls="kmd-tx-history-tbl"
                    tabIndex="0"
                    onClick={ () => this.updateCurrentPage(this.state.activePage + 1) }>{ translate('INDEX.NEXT') }</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  renderTxType(category) {
    if (category === 'send' ||
        category === 'sent') {
      return (
        <span className="label label-danger">
          <i className="icon fa-arrow-circle-left"></i> <span>{ translate('DASHBOARD.OUT') }</span>
        </span>
      );
    }
    if (category === 'receive' ||
        category === 'received') {
      return (
        <span className="label label-success">
          <i className="icon fa-arrow-circle-right"></i> <span>{ translate('DASHBOARD.IN') }</span>
        </span>
      );
    }
    if (category === 'generate') {
      return (
        <span>
          <i className="icon fa-cogs"></i> <span>{ translate('DASHBOARD.MINED') }</span>
        </span>
      );
    }
    if (category === 'immature') {
      return (
        <span>
          <i className="icon fa-clock-o"></i> <span>{ translate('DASHBOARD.IMMATURE') }</span>
        </span>
      );
    }
    if (category === 'unknown') {
      return (
        <span>
          <i className="icon fa-meh-o"></i> <span>{ translate('DASHBOARD.UNKNOWN') }</span>
        </span>
      );
    }
  }

  renderTxHistoryList() {
    if (this.state.itemsList === 'loading') {
      return (
        <div>{ translate('INDEX.LOADING_HISTORY') }...</div>
      );
    } else if (this.state.itemsList === 'no data') {
      return (
        <div>{ translate('INDEX.NO_DATA') }</div>
      );
    } else {
      if (this.state.itemsList &&
          this.state.itemsList.length &&
          this.state.itemsList !== 'no data') {
        return this.state.itemsList.map((tx, index) =>
          <tr key={ tx.txid + tx.amount }>
            <td>{ this.renderTxType(tx.category || tx.type) }</td>
            <td>{ tx.confirmations }</td>
            <td>{ tx.amount || translate('DASHBOARD.UNKNOWN') }</td>
            <td>{ secondsToString(tx.blocktime || tx.timestamp) }</td>
            <td className={ this.props.ActiveCoin.mode === 'basilisk' ? 'hide' : '' }>{ tx.address }</td>
            <td className={ this.props.ActiveCoin.mode === 'basilisk' ? 'text-center' : '' }>
              <button
                type="button"
                className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
                onClick={ () => this.toggleTxInfoModal(!this.props.ActiveCoin.showTransactionInfo, index) }>
                <i className="icon fa-search"></i>
              </button>
            </td>
          </tr>
        );
      }
    }
  }

  updateAddressSelection(address, type, amount) {
    Store.dispatch(changeActiveAddress(address));

    this.setState(Object.assign({}, this.state, {
      currentAddress: address,
      addressSelectorOpen: false,
      activePage: 1,
    }));

    if (this.props.ActiveCoin.mode === 'basilisk') {
      setTimeout(function() {
        Store.dispatch(changeMainBasiliskAddress(address));
        Store.dispatch(getBasiliskTransactionsList(this.props.ActiveCoin.coin, address));
      }.bind(this), 100);

      Store.dispatch(fetchNewCacheData({
        'pubkey': this.props.Dashboard.activeHandle.pubkey,
        'allcoins': false,
        'coin': this.props.ActiveCoin.coin,
        'calls': 'listtransactions:getbalance',
        'address': address,
      }));
    }
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      addressSelectorOpen: !this.state.addressSelectorOpen,
    }));
  }

  /*filterTable() {
    function myFunction() {
      // Declare variables
      var input, filter, table, tr, td, i;
      input = document.getElementById("myInput");
      filter = input.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");

      // Loop through all table rows, and hide those who don't match the search query
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    }
  }*/

  renderUseCacheToggle() {
    if (this.props.ActiveCoin.mode === 'basilisk') {
      return (
        <div className="col-sm-2">
          <div className="pull-left margin-right-10">
            <input type="checkbox" id="edexcoin_cache_api" checked={this.state.useCache} />
          </div>
          <label className="padding-top-3" htmlFor="edexcoin_cache_api" onClick={this.toggleCacheApi}>Use cache</label>
        </div>
      );
    } else {
      return null;
    }
  }

  renderAddressByType(type) {
    if (this.props.ActiveCoin.addresses &&
        this.props.ActiveCoin.addresses[type] &&
        this.props.ActiveCoin.addresses[type].length) {
        let items = [];

        for (let i = 0; i < this.props.ActiveCoin.addresses[type].length; i++) {
          const address = this.props.ActiveCoin.addresses[type][i];
          let _amount = address.amount;

          if (this.props.ActiveCoin.mode === 'basilisk') {
            _amount = this.props.ActiveCoin.cache && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin] && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address.address] && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address.address].getbalance.data && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address.address].getbalance.data.balance ? this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address.address].getbalance.data.balance : 'N/A';
          }

          items.push(
            <li key={address.address}>
              <a
                tabIndex="0"
                onClick={ () => this.updateAddressSelection(address.address, type, _amount) }><i className={ type === 'public' ? 'icon fa-eye' : 'icon fa-eye-slash' }></i>  <span className="text">[ { _amount } { this.props.ActiveCoin.coin } ]  { address.address }</span><span className="glyphicon glyphicon-ok check-mark"></span></a>
            </li>
          );
        }

        return items;
    } else {
      return null;
    }
  }

  renderAddressAmount() {
    if (this.props.ActiveCoin.addresses &&
        this.props.ActiveCoin.addresses.public &&
        this.props.ActiveCoin.addresses.public.length) {
      for (let i = 0; i < this.props.ActiveCoin.addresses.public.length; i++) {
        if (this.props.ActiveCoin.addresses.public[i].address === this.state.currentAddress) {
          if (this.props.ActiveCoin.addresses.public[i].amount &&
              this.props.ActiveCoin.addresses.public[i].amount !== 'N/A') {
            return this.props.ActiveCoin.addresses.public[i].amount;
          } else {
            const address = this.props.ActiveCoin.addresses.public[i].address;
            const _amount = this.props.ActiveCoin.cache[this.props.ActiveCoin.coin] && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address] && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address].getbalance.data && this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address].getbalance.data.balance ? this.props.ActiveCoin.cache[this.props.ActiveCoin.coin][address].getbalance.data.balance : 'N/A';
            return _amount;
          }
        }
      }
    } else {
      return 0;
    }
  }

  renderSelectorCurrentLabel() {
    if (this.state.currentAddress) {
      return (
        <span>
          <i className={ this.state.addressType === 'public' ? 'icon fa-eye' : 'icon fa-eye-slash' }></i>  <span className="text">[ { this.renderAddressAmount() } { this.props.ActiveCoin.coin } ]  { this.state.currentAddress }</span>
        </span>
      );
    } else {
      return (
        <span>- { translate('KMD_NATIVE.SELECT_ADDRESS') } -</span>
      );
    }
  }

  renderAddressList() {
    if (this.props.Dashboard &&
        this.props.Dashboard.activeHandle &&
        this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin] &&
        this.props.ActiveCoin.mode === 'basilisk') {
      return (
        <div className={ 'btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ' + (this.state.addressSelectorOpen ? 'open' : '') }>
          <button
            type="button"
            className="btn dropdown-toggle btn-info"
            title={ '-' + translate('KMD_NATIVE.SELECT_ADDRESS') + '-' }
            aria-expanded="true"
            onClick={ this.openDropMenu }>
            <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() } </span>&nbsp;
            <span className="bs-caret">
              <span className="caret"></span>
            </span>
          </button>
          <div className="dropdown-menu open">
            <ul className="dropdown-menu inner" role="menu">
              <li data-original-index="1" className="selected">
                <a tabIndex="0"><span className="text"> - { translate('KMD_NATIVE.SELECT_ADDRESS') } - </span><span className="glyphicon glyphicon-ok check-mark"></span></a>
              </li>
              { this.renderAddressByType('public') }
            </ul>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.coin &&
        this.props.ActiveCoin.mode !== 'native' &&
        !this.props.ActiveCoin.send &&
        !this.props.ActiveCoin.receive) {
      return (
        <span>
          <WalletsBasiliskRefresh {...this.props} />
          <WalletsBasiliskConnection {...this.props} />
          <WalletsNotariesList {...this.props} />
          <WalletsCacheData {...this.props} />
          <div id="edexcoin_dashboardinfo">
            <div className="col-xs-12 margin-top-20">
              <div className="panel nav-tabs-horizontal">
                <div id="edexcoin_dashoard_section">
                  <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12 edexcoin_dashoard_section_main_div">
                    <div id="edexcoin_txhistory" className="panel">
                      <header className="panel-heading" style={{ zIndex: '10' }}>
                        <div className={ this.props.ActiveCoin.mode === 'basilisk' ? 'panel-actions' : 'panel-actions hide' }>
                          <div
                            className={ this.state.currentStackLength === 1 || (this.state.currentStackLength === 0 && this.state.totalStackLength === 0) ? 'hide' : 'progress progress-sm' }
                            style={{ width: '100%', marginBottom: '3px' }}>
                            <div
                              className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success"
                              style={{ width: 100 - (this.state.currentStackLength * 100 / this.state.totalStackLength) + '%', fontSize: '80%' }}
                              role="progressbar">
                              { translate('SEND.PROCESSING_REQ') }: { this.state.currentStackLength } / { this.state.totalStackLength }
                            </div>
                          </div>
                          <div className={ this.state.basiliskActionsMenu ? 'dropdown open' : 'dropdown' } onClick={ this.toggleBasiliskActionsMenu }>
                            <a
                              className="dropdown-toggle btn-xs btn-default"
                              id="btn_edexcoin_basilisk"
                              href="javascript:void(0)"
                              aria-expanded="false"
                              role="button">
                              <i className="icon fa-magic margin-right-10" aria-hidden="true"></i> { translate('INDEX.BASILISK_ACTIONS') } <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="btn_edexcoin_basilisk" role="menu">
                              <li role="presentation">
                                <a
                                  className="btn_edexcoin_dashboard_getnotaries"
                                  id="btn_edexcoin_dashboard_getnotaries"
                                  role="menuitem"
                                  onClick={ this.getDexNotariesAction }>
                                  <i className="icon fa-sitemap" aria-hidden="true"></i> { translate('INDEX.GET_NOTARY_NODES_LIST') }
                                </a>
                              </li>
                              <li role="presentation">
                                <a
                                  className="btn_edexcoin_dashboard_refresh_basilisk_conn"
                                  id="btn_edexcoin_dashboard_refresh_basilisk_conn"
                                  role="menuitem"
                                  onClick={ this.basiliskConnectionAction }>
                                  <i className="icon wb-refresh" aria-hidden="true"></i> { translate('INDEX.REFRESH_BASILISK_CONNECTIONS') }
                                </a>
                              </li>
                              <li role="presentation" className={ !this.state.useCache ? 'hide' : '' }>
                                <a
                                  className="btn_edexcoin_dashboard_fetchdata"
                                  id="btn_edexcoin_dashboard_fetchdata"
                                  role="menuitem"
                                  onClick={ this.basiliskRefreshActionOne }>
                                  <i className="icon fa-cloud-download" aria-hidden="true"></i> { translate('INDEX.FETCH_WALLET_DATA') } ({ translate('INDEX.ACTIVE_ADDRESS') })
                                </a>
                              </li>
                              <li
                                role="presentation"
                                className={ !this.state.useCache || this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.public.length === 1 ? 'hide' : '' }>
                                <a role="menuitem" onClick={ this.basiliskRefreshAction }>
                                  <i className="icon fa-cloud-download" aria-hidden="true"></i> { translate('INDEX.FETCH_ALL_ADDR') }
                                </a>
                              </li>
                              <li role="presentation" className={ !this.state.useCache ? 'hide' : '' }>
                                <a
                                  className="btn_edexcoin_dashboard_refetchdata"
                                  id="btn_edexcoin_dashboard_refetchdata"
                                  role="menuitem"
                                  onClick={ this.removeAndFetchNewCache }>
                                  <i className="icon fa-history" aria-hidden="true"></i> { translate('INDEX.REFETCH_WALLET_DATA') }
                                </a>
                              </li>
                              <li role="presentation" className={ !this.state.useCache ? 'hide' : '' } style={{ display: 'none' }}>
                                <a role="menuitem" onClick={ this.restartBasiliskInstance }>
                                  <i className="icon fa-refresh" aria-hidden="true"></i> Restart Basilisk Instance (unsafe!)
                                </a>
                              </li>
                              <li role="presentation" className={ !this.state.useCache ? 'hide' : '' }>
                                <a className="btn_edexcoin_dashboard_fetchdata" role="menuitem" onClick={ this._toggleViewCacheModal }>
                                  <i className="icon fa-list-alt" aria-hidden="true"></i> { translate('INDEX.VIEW_CACHE_DATA') }
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <h4 className="panel-title">{ translate('INDEX.TRANSACTION_HISTORY') }</h4>
                      </header>
                      <div className="panel-body">
                        <div className="row">
                          <div className="col-sm-8">
                          { this.renderAddressList() }
                          </div>
                          { this.renderUseCacheToggle }
                        </div>
                        <div className="row" style={{ padding: '20px 0 10px 0' }}>
                          <div className="col-sm-6">
                            { this.renderPaginationItemsPerPageSelector() }
                          </div>
                          <div className="col-sm-6">
                            <div id="kmd-tx-history-tbl_filter" className="dataTables_filter">
                              <label>
                                { translate('INDEX.SEARCH') }: <input type="search" className="form-control input-sm" aria-controls="kmd-tx-history-tbl" disabled="true" />
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <table className="table table-hover dataTable table-striped" id="edex-tx-history-tbl" width="100%">
                            <thead>
                              <tr>
                                <th>{ translate('INDEX.DIRECTION') }</th>
                                <th className="hidden-xs hidden-sm">{ translate('INDEX.CONFIRMATIONS') }</th>
                                <th>{ translate('INDEX.AMOUNT') }</th>
                                <th>{ translate('INDEX.TIME') }</th>
                                <th className={ this.props.ActiveCoin.mode === 'basilisk' ? 'hide' : '' }>{ translate('INDEX.DEST_ADDRESS') }</th>
                                <th className={ this.props.ActiveCoin.mode === 'basilisk' ? 'hidden-xs hidden-sm text-center' : 'hidden-xs hidden-sm' }>{ translate('INDEX.TX_DETAIL') }</th>
                              </tr>
                            </thead>
                            <tbody>
                            { this.renderTxHistoryList() }
                            </tbody>
                            <tfoot>
                              <tr>
                                <th>{ translate('INDEX.DIRECTION') }</th>
                                <th>{ translate('INDEX.CONFIRMATIONS') }</th>
                                <th>{ translate('INDEX.AMOUNT') }</th>
                                <th>{ translate('INDEX.TIME') }</th>
                                <th className={ this.props.ActiveCoin.mode === 'basilisk' ? 'hide' : '' }>{ translate('INDEX.DEST_ADDRESS') }</th>
                                <th className={ this.props.ActiveCoin.mode === 'basilisk' ? 'hidden-xs hidden-sm text-center' : 'hidden-xs hidden-sm' }>{ translate('INDEX.TX_DETAIL') }</th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        { this.renderPagination() }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </span>
      );
    } else {
      return null;
    }
  }
}

export default WalletsData;
