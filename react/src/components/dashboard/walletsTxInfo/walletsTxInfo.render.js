import React from 'react';
import { translate } from '../../../translate/translate';
import { secondsToString } from '../../../util/time';
import Config from '../../../config';

const WalletsTxInfoRender = function(txInfo) {
  return (
    <div onKeyDown={ (event) => this.handleKeydown(event) }>
      <div
        className="modal show"
        id="kmd_txid_info_mdl">
        <div className="modal-dialog modal-center modal-lg">
          <div className="modal-content">
            <div className="modal-body modal-body-container">
              <div className="panel nav-tabs-horizontal">
                <ul className="nav nav-tabs nav-tabs-line">
                  <li className={ this.state.activeTab === 0 ? 'active' : '' }>
                    <a onClick={ () => this.openTab(0) }>
                      <i className="icon md-balance-wallet"></i>TxID Info
                    </a>
                  </li>
                  <li className={ this.state.activeTab === 1 ? 'hide active' : 'hide' }>
                    <a onClick={ () => this.openTab(1) }>
                      <i className="icon md-plus-square"></i>Vjointsplits, Details
                    </a>
                  </li>
                  <li className={ this.state.activeTab === 2 ? 'hide active' : 'hide' }>
                    <a onClick={ () => this.openTab(2) }>
                      <i className="icon wb-briefcase"></i>Hex
                    </a>
                  </li>
                  <li className={ this.state.activeTab === 3 ? 'active' : '' }>
                    <a onClick={ () => this.openTab(3) }>
                      <i className="icon wb-file"></i>Raw info
                    </a>
                  </li>
                </ul>
                <div className="panel-body">
                  { this.state.txDetails &&
                    <div className="tab-content">
                      { this.state.activeTab === 0 &&
                        <div className="tab-pane active">
                        <table className="table table-striped">
                            <tbody>
                              
                              <tr>
                                <td>{ translate('TX_INFO.ADDRESS') }</td>
                                <td>
                                  { this.state.txDetails.details[0].address }
                                </td>
                              </tr>
                              <tr>
                                <td>{ translate('TX_INFO.AMOUNT') }</td>
                                <td>
                                  { txInfo.amount }
                                </td>
                              </tr>
                              <tr>
                                <td>{ translate('TX_INFO.CATEGORY') }</td>
                                <td>
                                  { this.state.txDetails.details[0].category || txInfo.type }
                                </td>
                              </tr>
                              <tr>
                                <td>{ translate('TX_INFO.CONFIRMATIONS') }</td>
                                <td>
                                  { this.state.txDetails.confirmations }
                                </td>
                              </tr>
                              { this.state.txDetails.blockindex &&
                                <tr>
                                  <td>blockindex</td>
                                  <td>
                                    { this.state.txDetails.blockindex }
                                  </td>
                                </tr>
                              }
                              { this.state.txDetails.blockhash &&
                                <tr>
                                  <td>blockhash</td>
                                  <td>
                                    { this.state.txDetails.blockhash }
                                  </td>
                                </tr>
                              }
                              { (this.state.txDetails.blocktime || this.state.txDetails.timestamp) &&
                                <tr>
                                  <td>blocktime</td>
                                  <td>
                                    { secondsToString(this.state.txDetails.blocktime || this.state.txDetails.timestamp) }
                                  </td>
                                </tr>
                              }
                              <tr>
                                <td>txid</td>
                                <td>
                                  { this.state.txDetails.txid }
                                </td>
                              </tr>
                              <tr>
                                <td>walletconflicts</td>
                                <td>
                                  { this.state.txDetails.walletconflicts.length }
                                </td>
                              </tr>
                              <tr>
                                <td>time</td>
                                <td>
                                  { secondsToString(this.state.txDetails.time) }
                                </td>
                              </tr>
                              <tr>
                                <td>timereceived</td>
                                <td>
                                  { secondsToString(this.state.txDetails.timereceived) }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                      { this.state.activeTab === 1 &&
                        <div className="tab-pane active">
                          <table className="table table-striped">
                            <tbody>
                            <tr>
                              <td>vjoinsplit</td>
                              <td>
                                { txInfo.vjoinsplit }
                              </td>
                            </tr>
                            <tr>
                              <td>details</td>
                              <td>
                                { txInfo.details }
                              </td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      }
                      { this.state.activeTab === 2 &&
                        <div className="tab-pane active">
                          <textarea
                            className="full-width height-170"
                            rows="10"
                            cols="80"
                            defaultValue={ txInfo.hex }
                            disabled></textarea>
                        </div>
                      }
                      { this.state.activeTab === 3 &&
                        <div className="tab-pane active">
                          <textarea
                            className="full-width height-400"
                            rows="40"
                            cols="80"
                            defaultValue={ JSON.stringify(this.state.rawTxDetails, null, '\t') }
                            disabled></textarea>
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="modal-footer">
            <button
                type="button"
                className="btn btn-sm white btn-info waves-effect waves-light pull-left"
                onClick={ () => this.openExplorerWindow(txInfo.txid) }>
                <i className="icon fa-external-link"></i> { translate('INDEX.OPEN_TRANSACTION_IN_EPLORER', this.props.ActiveCoin.coin) }
              </button>
              <button
                type="button"
                className="btn btn-default"
                onClick={ this.toggleTxInfoModal }>{ translate('INDEX.CLOSE') }</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show in"></div>
    </div>
  );
};

export default WalletsTxInfoRender;