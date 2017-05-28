import React from 'react';
import { translate } from '../../translate/translate';
import {
  copyCoinAddress,
  checkAddressBasilisk,
  validateAddressBasilisk
} from '../../actions/actionCreators';
import Store from '../../store';

// TODO: implement sorting
// TODO: fallback to localstorage/stores data in case iguana is taking too long to respond

class ReceiveCoin extends React.Component {
  constructor(props) {
    super(props);
  }

  _checkAddressBasilisk(address) {
    Store.dispatch(checkAddressBasilisk(this.props.coin, address));
  }

  _validateAddressBasilisk(address) {
    Store.dispatch(validateAddressBasilisk(this.props.coin, address));
  }

  _copyCoinAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  renderAddressActions(address) {
    if (this.props.mode === 'basilisk') {
      return (
        <td>
          <span className="label label-default">
            <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
          </span>
          <button
            className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
            id="edexcoin_active_addr_clipboard"
            onClick={ () => this._copyCoinAddress(address) }><i className="icon wb-copy" aria-hidden="true"></i> { translate('INDEX.COPY') }</button>
          <span
            className="label label-default margin-left-10 action"
            title="Check"
            onClick={ () => this._checkAddressBasilisk(address) }>
            <i className="icon fa-database"></i>
          </span>
          <span
            className="label label-default margin-left-10 action"
            title="Import"
            onClick={ () => this._validateAddressBasilisk(address) }>
            <i className="icon fa-info-circle"></i>
          </span>
        </td>
      );
    } else {
      return (
        <td>
          <span className="label label-default">
            <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
          </span>
          <button
            className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
            id="edexcoin_active_addr_clipboard"
            onClick={ () => this._copyCoinAddress(address) }><i className="icon wb-copy" aria-hidden="true"></i> { translate('INDEX.COPY') }</button>
        </td>
      );
    }
  }

  renderAddressList() {
    if (this.props.addresses &&
        this.props.addresses.public &&
        this.props.addresses.public.length) {
      let items = [];

      for (let i = 0; i < this.props.addresses.public.length; i++) {
        let address = this.props.addresses.public[i];

        if (this.props.mode === 'basilisk' &&
            (address.amount === 'N/A' || address.amount === 0)) {
          address.amount = this.props.cache && this.props.cache[this.props.coin][address.address] && this.props.cache[this.props.coin][address.address].getbalance.data && this.props.cache[this.props.coin][address.address].getbalance.data.balance ? this.props.cache[this.props.coin][address.address].getbalance.data.balance : 'N/A';
        }
        if (this.props.mode === 'basilisk' &&
            (address.interest === 'N/A' || address.interest === 0 || !address.interest)) {
          address.interest = this.props.cache && this.props.cache[this.props.coin][address.address] && this.props.cache[this.props.coin][address.address].getbalance.data && this.props.cache[this.props.coin][address.address].getbalance.data.interest ? this.props.cache[this.props.coin][address.address].getbalance.data.interest : 'N/A';
        }

        items.push(
          <tr key={ address.address }>
            { this.renderAddressActions(address.address) }
            <td>{ address.address }</td>
            <td>{ address.amount }</td>
            <td>{ address.interest ? address.interest : 'N/A' }</td>
          </tr>
        );
      }

      return items;
    } else {
      return null;
    }
  }

  render() {
    if (this.props &&
        this.props.receive &&
        this.props.mode !== 'native') {
      return (
        <div id="edexcoin_recieve">
          <div className="col-xs-12 margin-top-20">
            <div className="panel nav-tabs-horizontal">
              <div id="edexcoin_recieve_section">
                <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                  <div className="panel">
                    <header className="panel-heading">
                      <div className="panel-actions">
                      </div>
                      <h4 className="panel-title">{ translate('INDEX.RECEIVING_ADDRESS') }</h4>
                    </header>
                    <div className="panel-body">
                      <table className="table table-hover dataTable table-striped" id="edexcoin-recieve-addr-tbl">
                        <thead>
                          <tr>
                            <th>{ translate('INDEX.TYPE') }</th>
                            <th>{ translate('INDEX.ADDRESS') }</th>
                            <th>{ translate('INDEX.BALANCE') }</th>
                            <th>{ translate('INDEX.INTEREST') }</th>
                          </tr>
                        </thead>
                        <tbody>
                          { this.renderAddressList() }
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>{ translate('INDEX.TYPE') }</th>
                            <th>{ translate('INDEX.ADDRESS') }</th>
                            <th>{ translate('INDEX.BALANCE') }</th>
                            <th>{ translate('INDEX.INTEREST') }</th>
                          </tr>
                        </tfoot>
                      </table>
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

export default ReceiveCoin;
