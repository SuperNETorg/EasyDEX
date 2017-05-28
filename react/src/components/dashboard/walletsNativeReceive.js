import React from 'react';
import { translate } from '../../translate/translate';
import {
  copyCoinAddress,
  getNewKMDAddresses
} from '../../actions/actionCreators';
import Store from '../../store';

class WalletsNativeReceive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDropMenu: false,
    };
    this.openDropMenu = this.openDropMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, false);
  }

  handleClickOutside(e) {
    if (e.srcElement.className.indexOf('dropdown') === -1 &&
        (e.srcElement.offsetParent && e.srcElement.offsetParent.className.indexOf('dropdown') === -1)) {
      this.setState({
        openDropMenu: false,
      });
    }
  }

  openDropMenu() {
    this.setState(Object.assign({}, this.state, {
      openDropMenu: !this.state.openDropMenu,
    }));
  }

  copyZAddress(address) {
    Store.dispatch(copyCoinAddress(address));
  }

  renderAddressList(type) {
    if (this.props.ActiveCoin.addresses &&
        this.props.ActiveCoin.addresses[type] &&
        this.props.ActiveCoin.addresses[type].length) {
      return this.props.ActiveCoin.addresses[type].map((address) =>
        <tr key={ address.address }>
          <td>
            <span className={ type === 'public' ? 'label label-default' : 'label label-dark' }>
              <i className={ type === 'public' ? 'icon fa-eye' : 'icon fa-eye-slash' }></i> { type === 'public' ? translate('IAPI.PUBLIC_SM') : translate('KMD_NATIVE.PRIVATE') }
            </span>
            <button
              className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
              id="edexcoin_active_addr_clipboard"
              onClick={ () => this.copyZAddress(address.address) }><i className="icon wb-copy" aria-hidden="true"></i> { translate('INDEX.COPY') }</button>
          </td>
          <td>{ type === 'public' ? address.address : address.address.substring(0, 34) + '...' }</td>
          <td>{ address.amount }</td>
          <td></td>
        </tr>
      );
    } else {
      return null;
    }
  }

  getNewAddress(type) {
    Store.dispatch(getNewKMDAddresses(this.props.ActiveCoin.coin, type));
  }

  render() {
    if (this.props &&
        this.props.ActiveCoin &&
        this.props.ActiveCoin.nativeActiveSection === 'receive') {
      return (
        <div id="kmd_wallet_recieve">
          <div className="col-xs-12 margin-top-20">
            <div className="panel nav-tabs-horizontal">
              <div id="kmd_wallet_recieve_section">
                <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
                  <div className="panel">
                    <header className="panel-heading">
                      <div className="panel-actions">
                        <div className={ 'dropdown' + (this.state.openDropMenu ? ' open' : '') } onClick={ this.openDropMenu }>
                          <a
                            className="dropdown-toggle white btn btn-warning"
                            id="GetNewRecievingAddress"
                            href="javascript:void(0)"
                            aria-expanded="false"
                            role="button">
                            <i className="icon md-arrows margin-right-10" aria-hidden="true"></i> { translate('INDEX.GET_NEW_ADDRESS') } <span className="caret"></span>
                          </a>
                          <ul
                            className="dropdown-menu dropdown-menu-right"
                            aria-labelledby="GetNewRecievingAddress"
                            role="menu">
                            <li role="presentation">
                              <a
                                href="javascript:void(0)"
                                id="kmd_get_new_taddr"
                                role="menuitem"
                                onClick={ () => this.getNewAddress('public') }>
                                <i className="icon fa-eye" aria-hidden="true"></i> { translate('INDEX.TRANSPARENT_ADDRESS') }
                              </a>
                            </li>
                            <li data-extcoin="COIN" role="presentation">
                              <a
                                href="javascript:void(0)"
                                id="kmd_get_new_zaddr"
                                role="menuitem"
                                onClick={ () => this.getNewAddress('private') }>
                                <i className="icon fa-eye-slash" aria-hidden="true"></i> { translate('INDEX.PRIVATE_Z_ADDRESS') }
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <h3 className="panel-title">{ translate('INDEX.RECEIVING_ADDRESS') }</h3>
                    </header>
                    <div className="panel-body">
                      <table className="table table-hover dataTable table-striped" id="kmd-recieve-addr-tbl">
                        <thead>
                          <tr>
                            <th>{ translate('INDEX.TYPE') }</th>
                            <th>{ translate('INDEX.ADDRESS') }</th>
                            <th>{ translate('INDEX.AMOUNT') }</th>
                          </tr>
                        </thead>
                        <tbody>
                        { this.renderAddressList('public') }
                        { this.renderAddressList('private') }
                        </tbody>
                        <tfoot>
                          <tr>
                            <th>{ translate('INDEX.TYPE') }</th>
                            <th>{ translate('INDEX.ADDRESS') }</th>
                            <th>{ translate('INDEX.AMOUNT') }</th>
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

export default WalletsNativeReceive;
