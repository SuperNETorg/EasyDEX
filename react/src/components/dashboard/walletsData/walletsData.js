import React from 'react';
import ReactTable from 'react-table';
import Config from '../../../config';
import { translate } from '../../../translate/translate';
import { sortByDate } from '../../../util/sort';
import { secondsToString } from '../../../util/time';
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
} from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  PaginationItemRender,
  PaginationItemsPerPageSelectorRender,
  PaginationRender,
  TxHistoryListRender,
  UseCacheToggleRender,
  AddressListRender,
  WalletsDataRender
} from  './walletsData.render';

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
    document.addEventListener(
      'click',
      this.handleClickOutside,
      false
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'click',
      this.handleClickOutside,
      false
    );
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

  // deprecated
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
        historyToSplit = historyToSplit.slice(
          (this.state.activePage - 1) * this.state.itemsPerPage,
          this.state.activePage * this.state.itemsPerPage
        );

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
    historyToSplit = historyToSplit.slice(
      (page - 1) * this.state.itemsPerPage,
      page * this.state.itemsPerPage
    );

    this.setState(Object.assign({}, this.state, {
      activePage: page,
      itemsList: historyToSplit,
    }));
  }

  renderPaginationItems() {
    let items = [];

    for (let i = 0; i < Math.ceil(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage); i++) {
      items.push(
        PaginationItemRender.call(this, i)
      );
    }

    return items;
  }

  renderPaginationItemsPerPageSelector() {
    if (this.props.ActiveCoin.txhistory &&
        this.state.itemsList !== 'loading' &&
        this.props.ActiveCoin.txhistory.length > 10) {
      return PaginationItemsPerPageSelectorRender.call(this);
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

      return PaginationRender.call(
        this,
        _paginationFrom,
        _paginationTo
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
    const columns = [
      {
        Header: translate('INDEX.DIRECTION'),
        accessor: 'type',
        sortable: false,
        Cell: props => this.renderTxType(props.value),
        filterable: false,
      },
      {
        Header: translate('INDEX.CONFIRMATIONS'),
        accessor: 'confirmations',
        filterable: false,
      },
      {
        Header: translate('INDEX.AMOUNT'),
        accessor: 'amount',
        filterable: false,
      },
      {
        Header: translate('INDEX.TIME'),
        accessor: 'timestamp',
        Cell: props => secondsToString(props.value),
        filterable: false,
      },
      {
        Header: translate('INDEX.TX_DETAIL'),
        accessor: 'txid',
        Cell: (props) => {
          const showTxInfo = this.props.ActiveCoin.showTransactionInfo;
          const index = props.index;
          return (
            <button
              type="button"
              className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
              onClick={() => this.toggleTxInfoModal(!showTxInfo, index)}
            >
              <i className="icon fa-search" />
            </button>
          );
        },
        filterMethod: (filter, row) => (row[filter.id].includes(filter.value)),

      },
    ];
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
        return (
          <ReactTable
            className="-striped"
            data={this.state.itemsList}
            filterable
            columns={columns}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            defaultPageSize={5}
            showPagination
            sortable
          />);
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
      setTimeout(() => {
        Store.dispatch(changeMainBasiliskAddress(address));
        Store.dispatch(
          getBasiliskTransactionsList(
            this.props.ActiveCoin.coin,
            address
          )
        );
      }, 100);

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
              <a onClick={ () => this.updateAddressSelection(address.address, type, _amount) }><i className={ type === 'public' ? 'icon fa-eye' : 'icon fa-eye-slash' }></i>  <span className="text">[ { _amount } { this.props.ActiveCoin.coin } ]  { address.address }</span><span className="glyphicon glyphicon-ok check-mark"></span></a>
            </li>
          );
        }

        return items;
    } else {
      return null;
    }
  }

  hasPublicAdresses() {
    return this.props.ActiveCoin.addresses &&
      this.props.ActiveCoin.addresses.public &&
      this.props.ActiveCoin.addresses.public.length;
  }

  renderAddressAmount() {
    if (this.hasPublicAdresses()) {
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
      return AddressListRender.call(this);
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
            <div>
              {WalletsDataRender.call(this)}
            </div>
          )
    } else {
      return null;
    }
  }
}

export default WalletsData;
