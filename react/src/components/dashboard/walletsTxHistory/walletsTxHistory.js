import React from 'react';
import { translate } from '../../../translate/translate';
import { sortByDate } from '../../../util/sort';
import { toggleDashboardTxInfoModal } from '../../../actions/actionCreators';
import Store from '../../../store';
import {
  PaginationItemsPerPageSelectorRender,
  PaginationRender,
  TxHistoryListRender,
  WalletsTxHistoryRender
} from './walletsTxHistory.render';

class WalletsTxHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsPerPage: 10,
      activePage: 1,
      itemsList: null,
    };
    this.updateInput = this.updateInput.bind(this);
  }

  // TODO: implement sorting
  //       implement pagination past X items should call listtransactions to get new chunk of data
  //       z transactions
  //       filter based on addr

  toggleTxInfoModal(display, txIndex) {
    Store.dispatch(
      toggleDashboardTxInfoModal(
        display,
        txIndex
      )
    );
  }

  isFullySynced() {
    if (this.props.Dashboard &&
        this.props.Dashboard.progress &&
        this.props.Dashboard.progress.balances &&
        (Number(this.props.Dashboard.progress.balances) +
        Number(this.props.Dashboard.progress.validated) +
        Number(this.props.Dashboard.progress.bundles) +
        Number(this.props.Dashboard.progress.utxo)) / 4 === 100) {
      return true;
    } else {
      return false;
    }
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

  renderTxType(category) {
    if (category === 'send') {
      return (
        <span className="label label-danger">
          <i className="icon fa-arrow-circle-left"></i> <span>{ translate('DASHBOARD.OUT') }</span>
        </span>
      );
    }
    if (category === 'receive') {
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
  }

  renderAddress(tx) {
    if (!tx.address) {
      return (
        <span>
          <i className="icon fa-bullseye"></i> <span className="label label-dark">{ translate('DASHBOARD.ZADDR_NOT_LISTED') }</span>
        </span>
      );
    } else {
      return (tx.address);
    }
  }

  componentWillReceiveProps(props) {
    if (!this.state.itemsList ||
        (this.state.itemsList && !this.state.itemsList.length) ||
        (props.ActiveCoin.txhistory !== this.props.ActiveCoin.txhistory)) {
      if (this.props.ActiveCoin.txhistory &&
          this.props.ActiveCoin.txhistory !== 'loading' &&
          this.props.ActiveCoin.txhistory !== 'no data') {
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

    for (let i = 0; i < Math.floor(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage); i++) {
      items.push(
        <li className={ this.state.activePage === i + 1 ? 'paginate_button active' : 'paginate_button' }>
          <a
            key={ `${i}-pagination` }
            onClick={ this.state.activePage !== (i + 1) ? () => this.updateCurrentPage(i + 1) : null }>{ i + 1 }</a>
        </li>
      );
    }

    return items;
  }

  renderPaginationItemsPerPageSelector() {
    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory.length > 10) {
      return PaginationItemsPerPageSelectorRender.call(this);
    } else {
      return null;
    }
  }

  renderPagination() {
    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory !== 'loading' &&
        this.props.ActiveCoin.txhistory.length > 10) {
      const _paginationStart = ((this.state.activePage - 1) * this.state.itemsPerPage) + 1;
      const _paginationEnd = this.state.activePage * this.state.itemsPerPage;
      const _paginationNextState = this.state.activePage > Math.floor(this.props.ActiveCoin.txhistory.length / this.state.itemsPerPage);

      return PaginationRender.call(
        this,
        _paginationStart,
        _paginationEnd,
        _paginationNextState
      );
    }

    return null;
  }

  renderTxHistoryList() {
    if (this.props.ActiveCoin.txhistory &&
        this.props.ActiveCoin.txhistory === 'no data') {
      return translate('INDEX.NO_DATA');
    } else if (
      this.props.ActiveCoin.txhistory &&
      this.props.ActiveCoin.txhistory === 'loading') {
      if (this.isFullySynced()) {
        return translate('INDEX.LOADING_HISTORY');
      } else {
        return translate('INDEX.WAIT_UNTIL_SYNCED');
      }
    } else if (
      this.props.ActiveCoin.txhistory &&
      (this.props.ActiveCoin.txhistory !== 'loading' && this.props.ActiveCoin.txhistory !== 'no data')) {
      if (this.state.itemsList &&
          this.state.itemsList.length &&
          this.props.ActiveCoin.nativeActiveSection === 'default') {
        return TxHistoryListRender.call(this);
      }

      return null;
    }
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin.nativeActiveSection === 'default') {
      return WalletsTxHistoryRender.call(this);
    }

    return null;
  }
}

export default WalletsTxHistory;
