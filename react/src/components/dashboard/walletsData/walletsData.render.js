import React from 'react';
import { translate } from '../../../translate/translate';
import WalletsBasiliskRefresh from '../walletsBasiliskRefresh/walletsBasiliskRefresh';
import WalletsBasiliskConnection from '../walletsBasiliskConnection/walletsBasiliskConnection';
import WalletsNotariesList from '../walletsNotariesList/walletsNotariesList';
import WalletsCacheData from '../walletsCacheData/walletsCacheData';
import { secondsToString } from '../../../util/time';

export const PaginationItemRender = function(i) {
  return (
    <li
      key={ `${i}-pagination-link` }
      className={ this.state.activePage === i + 1 ? 'paginate_button active' : 'paginate_button' }>
      <a
        key={ `${i}-pagination` }
        onClick={ this.state.activePage !== (i + 1) ? () => this.updateCurrentPage(i + 1) : null }>{ i + 1 }</a>
    </li>
  );
};

export const PaginationItemsPerPageSelectorRender = function() {
  return (
    <div className="dataTables_length">
      <label>
        { translate('INDEX.SHOW') }&nbsp;
        <select
          name="itemsPerPage"
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
};

export const PaginationRender = function(paginationFrom, paginationTo) {
  return (
    <div className="row unselectable">
      <div className="col-sm-5">
        <div className="dataTables_info">
          { translate('INDEX.SHOWING') }
          { paginationFrom }
          { translate('INDEX.TO_ALT') }
          { paginationTo }
          { translate('INDEX.OF') }
          { this.props.ActiveCoin.txhistory.length }
          { translate('INDEX.ENTRIES_SM') }
        </div>
      </div>
      <div className="col-sm-7">
        <div className="dataTables_paginate paging_simple_numbers">
          <ul className="pagination">
            <li className={ this.state.activePage === 1 ? 'paginate_button previous disabled' : 'paginate_button previous' }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage - 1) }>{ translate('INDEX.PREVIOUS') }</a>
            </li>
            { this.renderPaginationItems() }
            <li className={ this.state.activePage > Math.floor(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage) ? 'paginate_button next disabled' : 'paginate_button next' }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage + 1) }>{ translate('INDEX.NEXT') }</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TxHistoryListRender = function(tx, index) {
  return (
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
};

export const UseCacheToggleRender = function() {
  return (
    <div className="col-sm-2">
      <div className="pull-left margin-right-10">
        <input type="checkbox" id="edexcoin_cache_api" checked={this.state.useCache} />
      </div>
      <label className="padding-top-3" htmlFor="edexcoin_cache_api" onClick={this.toggleCacheApi}>Use cache</label>
    </div>
  );
};

export const AddressListRender = function() {
  return (
    <div className={ `btn-group bootstrap-select form-control form-material showkmdwalletaddrs show-tick ${(this.state.addressSelectorOpen ? 'open' : '')}` }>
      <button
        type="button"
        className="btn dropdown-toggle btn-info"
        title={ `-${translate('KMD_NATIVE.SELECT_ADDRESS')}-` }
        onClick={ this.openDropMenu }>
        <span className="filter-option pull-left">{ this.renderSelectorCurrentLabel() } </span>&nbsp;
        <span className="bs-caret">
          <span className="caret"></span>
        </span>
      </button>
      <div className="dropdown-menu open">
        <ul className="dropdown-menu inner">
          <li className="selected">
            <a><span className="text"> - { translate('KMD_NATIVE.SELECT_ADDRESS') } - </span><span className="glyphicon glyphicon-ok check-mark"></span></a>
          </li>
          { this.renderAddressByType('public') }
        </ul>
      </div>
    </div>
  );
};

export const WalletsDataRender = function() {
  return (
    <span>
      <WalletsBasiliskRefresh {...this.props} />
      <WalletsBasiliskConnection {...this.props} />
      <WalletsNotariesList {...this.props} />
      <WalletsCacheData {...this.props} />
      <div id="edexcoin_dashboardinfo">
        <div className="col-xs-12 margin-top-20">
          <div className="panel nav-tabs-horizontal">
            <div>
              <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <header className="panel-heading z-index-10">
                    <div className={ this.props.ActiveCoin.mode === 'basilisk' ? 'panel-actions' : 'panel-actions hide' }>
                      <div className={ 'margin-bottom-3 ' + (this.state.currentStackLength === 1 || (this.state.currentStackLength === 0 && this.state.totalStackLength === 0) ? 'hide' : 'progress progress-sm') }>
                        <div
                          className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success font-size-80-percent"
                          style={{ width: 100 - (this.state.currentStackLength * 100 / this.state.totalStackLength) + '%'}}>
                          { translate('SEND.PROCESSING_REQ') }: { this.state.currentStackLength } / { this.state.totalStackLength }
                        </div>
                      </div>
                      <div
                        className={ this.state.basiliskActionsMenu ? 'dropdown open' : 'dropdown' }
                        onClick={ this.toggleBasiliskActionsMenu }>
                        <a className="dropdown-toggle btn-xs btn-default">
                          <i className="icon fa-magic margin-right-10"></i> { translate('INDEX.BASILISK_ACTIONS') } <span className="caret"></span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-right">
                          <li>
                            <a onClick={ this.getDexNotariesAction }>
                              <i className="icon fa-sitemap"></i> { translate('INDEX.GET_NOTARY_NODES_LIST') }
                            </a>
                          </li>
                          <li>
                            <a onClick={ this.basiliskConnectionAction }>
                              <i className="icon wb-refresh"></i> { translate('INDEX.REFRESH_BASILISK_CONNECTIONS') }
                            </a>
                          </li>
                          <li className={ !this.state.useCache ? 'hide' : '' }>
                            <a onClick={ this.basiliskRefreshActionOne }>
                              <i className="icon fa-cloud-download"></i> { translate('INDEX.FETCH_WALLET_DATA') } ({ translate('INDEX.ACTIVE_ADDRESS') })
                            </a>
                          </li>
                          <li className={ !this.state.useCache || this.props.ActiveCoin.addresses && this.props.ActiveCoin.addresses.public.length === 1 ? 'hide' : '' }>
                            <a onClick={ this.basiliskRefreshAction }>
                              <i className="icon fa-cloud-download"></i> { translate('INDEX.FETCH_ALL_ADDR') }
                            </a>
                          </li>
                          <li className={ !this.state.useCache ? 'hide' : '' }>
                            <a onClick={ this.removeAndFetchNewCache }>
                              <i className="icon fa-history"></i> { translate('INDEX.REFETCH_WALLET_DATA') }
                            </a>
                          </li>
                          <li className={ 'hide ' + (!this.state.useCache ? 'hide' : '') }>
                            <a onClick={ this.restartBasiliskInstance }>
                              <i className="icon fa-refresh"></i> Restart Basilisk Instance (unsafe!)
                            </a>
                          </li>
                          <li className={ !this.state.useCache ? 'hide' : '' }>
                            <a onClick={ this._toggleViewCacheModal }>
                              <i className="icon fa-list-alt"></i> { translate('INDEX.VIEW_CACHE_DATA') }
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
                    <div className="row pagination-container">
                      <div className="col-sm-6">
                        { this.renderPaginationItemsPerPageSelector() }
                      </div>
                      <div className="col-sm-6">
                        <div className="dataTables_filter">
                          <label>
                            { translate('INDEX.SEARCH') }: <input type="search" className="form-control input-sm" disabled="true" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      { this.renderTxHistoryList() }
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
};
