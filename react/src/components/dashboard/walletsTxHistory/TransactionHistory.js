import React, {Component, PropTypes} from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
// import 'react-table/react-table.css';

import { translate } from '../../../translate/translate';
import { toggleDashboardTxInfoModal } from '../../../actions/actionCreators';
import { secondsToString } from '../../../util/time';
import Store from '../../../store';

class TransactionHistory extends Component {
  constructor(props) {
    super(props)
    const txHistory = this.props.txHistory;
    this.state = {
      isLoading: (txHistory === 'loading') ? true: false,
      txHistory: (txHistory && txHistory.length) ? txHistory : null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.txHistory !== this.props.txHistory && nextProps.txHistory.length) {
      this.setState({txHistory: nextProps.txHistory})
    }
    if (nextProps.txHistory !== 'loading') {
      this.setState({isLoading: false})
    }
  }


  render() {

    const columns = [
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Confirmations',
        accessor: 'confirmations'
      },
      {
        Header: 'Amount',
        accessor: 'amount'
      },
      {
        Header: 'Time',
        accessor: 'timestamp',
        Cell: props => secondsToString(props.value)
      },
      {
        Header: 'Tx Details',
        accessor: 'showTransactionInfo',
        Cell: props => (
          <button
            type="button"
            className="btn btn-xs white btn-info waves-effect waves-light btn-kmdtxid"
          >
            <i className="icon fa-search" />
          </button>
        )
      }
    ]
    console.error(`-------------- ${JSON.stringify(this.state)} -----------`);
    console.error(`-------------- ${JSON.stringify(this.props.txHistory)} -----------`);
    if (this.state.isLoading) {
      return (<div>Loading ...</div>);
    } else {
      if (!this.state.txHistory && !this.state.txHistory.length) {
        return (<div>No Data</div>);
      } else {
        return (
          <ReactTable
            data={this.state.txHistory}
            columns={columns}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            defaultPageSize={5}
            showPagination
            sortable
          />)
      }
    }
  }
}

const mapStateToProps = state => (
  {
    txHistory: state.ActiveCoin.txhistory,
  }
);

export default connect(mapStateToProps, null)(TransactionHistory);
