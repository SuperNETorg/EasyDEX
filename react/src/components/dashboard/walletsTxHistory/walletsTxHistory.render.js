import React from 'react';
import { translate } from '../../../translate/translate';


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

export const PaginationRender = function(paginationStart, paginationEnd, paginationNextState) {
  return (
    <div className="row unselectable">
      <div className="col-sm-5">
        <div className="dataTables_info">
          { translate('INDEX.SHOWING') }
          { paginationStart }
          { translate('INDEX.TO') }
          { paginationEnd }
          { translate('INDEX.OF') }
          { this.props.ActiveCoin.txhistory.length }
          { translate('INDEX.ENTRIES_SM') }
        </div>
      </div>
      <div className="col-sm-7">
        <div className="dataTables_paginate paging_simple_numbers">
          <ul className="pagination">
            <li className={ this.state.activePage
            === 1 ? 'paginate_button previous disabled' : 'paginate_button previous' }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage - 1) }>{ translate('INDEX.PREVIOUS') }</a>
            </li>
            { this.renderPaginationItems() }
            <li className={ paginationNextState ? 'paginate_button next disabled' : 'paginate_button next' }>
              <a onClick={ () => this.updateCurrentPage(this.state.activePage + 1) }>{ translate('INDEX.NEXT') }</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TxHistoryTableRender = () => {
  return ()
}

export const TxHistoryListRender = function() {
  return this.state.itemsList.map((tx, index) =>
    <tr key={ tx.txid + tx.amount }>
      <td>
        <span className="label label-default">
          <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
        </span>
      </td>
      <td>{ this.renderTxType(tx.category) }</td>
      <td>{ tx.confirmations }</td>
      <td>{ tx.amount }</td>
      <td>{ secondsToString(tx.time) }</td>
      <td>{ this.renderAddress(tx) }</td>
      <td>
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

export const WalletsNativeTxHistoryRender = function() {
  return (
    <div className="native-transactions">
      <div>
        <div className="col-xs-12 margin-top-20">
          <div className="panel nav-tabs-horizontal">
            <div>
              <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="panel">
                  <header className="panel-heading">
                    <h3 className="panel-title">{ translate('INDEX.TRANSACTION_HISTORY') }</h3>
                  </header>
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-sm-6">
                        { this.renderPaginationItemsPerPageSelector() }
                      </div>
                      <div className="col-sm-6">
                        <div className="dataTables_filter">
                          <label>
                            { translate('INDEX.SEARCH') }:
                            <input
                              type="search"
                              className="form-control input-sm"
                              disabled="true" />
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <table
                        className="table table-hover dataTable table-striped"
                        width="100%">
                        <thead>
                        <tr>
                          <th>{ translate('INDEX.TYPE') }</th>
                          <th>{ translate('INDEX.DIRECTION') }</th>
                          <th>{ translate('INDEX.CONFIRMATIONS') }</th>
                          <th>{ translate('INDEX.AMOUNT') }</th>
                          <th>{ translate('INDEX.TIME') }</th>
                          <th>{ translate('INDEX.DEST_ADDRESS') }</th>
                          <th>{ translate('INDEX.TX_DETAIL') }</th>
                        </tr>
                        </thead>
                        <tbody>
                          { this.renderTxHistoryList() }
                        </tbody>
                        <tfoot>
                        <tr>
                          <th>{ translate('INDEX.TYPE') }</th>
                          <th>{ translate('INDEX.DIRECTION') }</th>
                          <th>{ translate('INDEX.CONFIRMATIONS') }</th>
                          <th>{ translate('INDEX.AMOUNT') }</th>
                          <th>{ translate('INDEX.TIME') }</th>
                          <th>{ translate('INDEX.DEST_ADDRESS') }</th>
                          <th>{ translate('INDEX.TX_DETAIL') }</th>
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
    </div>
  );
};
