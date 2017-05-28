import React from 'react';
import { translate } from '../../translate/translate';
import WalletsHeader from './walletsHeader';
/*import { dashboardChangeSection, toggleAddcoinModal, logout } from '../../actions/actionCreators';
import Store from '../../store';*/

class Jumblr extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span key={ `jumblr-label-${Math.random(0, 9) * 10}` }>
        {_translation}
        <br />
      </span>
    );
  }

  render() {
    return (
      <div className="page margin-left-0">
        <WalletsHeader activeSection="jumblr" />
        <div className="page-content margin-top-30" id="section-jumblr">
          <div className="row" id="jumblr_dashboard">
            <div className="col-xs-12" id="jumblr_testing_alert">
              <div className="alert alert-danger" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <span className="jumblr-header">
                  <i className="icon fa-paw" aria-hidden="true"></i> { translate('JUMBLR.NOTICE') }
                </span>
                <br />
                { translate('JUMBLR.DESCRIPTION') }
              </div>
            </div>

            <div className="col-xs-12" id="jumblr_no_native_kmd_alert">
              <div className="alert alert-info alert-dismissible" role="alert">
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
                <span className="jumblr-header">
                  <i className="icon fa-paw" aria-hidden="true"></i> { translate('JUMBLR.NEED_NATIVE') }
                </span>
                <br />
                { translate('JUMBLR.TO_USE_JUMBLR') }
                <br />
                { translate('JUMBLR.IF_YOU_ALREADY_RUNNING') }
              </div>
            </div>

            <div className="col-xlg-12 col-md-12">
              <p>{ translate('JUMBLR.THIS_SCREEN_DOESNT_REFRESH') }</p>
            </div>

            <div className="col-xs-12">
              <div className="panel-group" id="jumber_quick_info" aria-multiselectable="true" role="tablist">
                <div className="panel">
                  <div
                    className="panel-heading"
                    id="jumblr_security_notes"
                    role="tab"
                    onClick={ () => this.openTab(0) }>
                    <a
                      className={ this.state.activeTab === 0 ? 'panel-title' : 'panel-title collapsed' }
                      aria-expanded="true"
                      aria-controls="jumblr_security_notes_1">{ translate('JUMBLR.FEW_SECURITY_NOTES') }</a>
                  </div>
                  <div
                    className={ this.state.activeTab === 0 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                    id="jumblr_security_notes_1"
                    aria-labelledby="jumblr_security_notes"
                    role="tabpanel">
                    <div className="panel-body">
                      <ul>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC1') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC2') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC3') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC4') }</li>
                        <li>{ translate('JUMBLR.FEW_SECURITY_NOTES_DESC5') }</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div
                    className="panel-heading"
                    id="jumblr_access_funds"
                    role="tab"
                    onClick={ () => this.openTab(1) }>
                    <a
                      className={ this.state.activeTab === 1 ? 'panel-title' : 'panel-title collapsed' }
                      aria-expanded="false"
                      aria-controls="jumblr_access_funds_2">{ translate('JUMBLR.ACCESS_JUMBLR_FUNDS') }</a>
                  </div>
                  <div
                    className={ this.state.activeTab === 1 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                    id="jumblr_access_funds_2"
                    aria-labelledby="jumblr_access_funds"
                    role="tabpanel">
                    <div className="panel-body">
                      <p>{ translate('JUMBLR.ADDRESS_ACCESSIBLE_EASILY') }</p>
                      <ul>
                        <code>duck dog cat donkey</code>
                      </ul>
                      <ol>
                        <li>{ translate('JUMBLR.TO_ACCESS') }</li>
                        <li>{ translate('JUMBLR.CLOSE_IAPP') }</li>
                        <li>{ translate('JUMBLR.START_IAPP') }</li>
                        <li>{ translate('JUMBLR.START_KMD') }</li>
                        <li>{ translate('JUMBLR.ACCESS_JUMBLR_FUNDS') }
                          <ul>
                            <li>{ translate('JUMBLR.SMALL_LETTERS') }</li>
                            <li>{ translate('JUMBLR.WHITE_SPACE') }</li>
                          </ul>
                        </li>
                        <li>
                          { translate('JUMBLR.PER_EXAMPLE') }
                          <br />
                          <code>jumblr duck dog cat donkey</code>
                        </li>
                        <li>{ translate('JUMBLR.LOGIN_WITH_JUMBLR') }</li>
                      </ol>
                      <h4>{ translate('JUMBLR.AGAIN_DONT_SHARE') }</h4>
                    </div>
                  </div>
                </div>
                <div className="panel">
                  <div className="panel-heading" id="jumblr_using_jumblr" role="tab" onClick={ () => this.openTab(2) }>
                    <a
                      className={ this.state.activeTab === 2 ? 'panel-title' : 'panel-title collapsed' }
                      aria-expanded="false"
                      aria-controls="jumblr_using_jumblr_3">{ translate('JUMBLR.USING_JUMBLR') }</a>
                  </div>
                  <div
                    className={ this.state.activeTab === 2 ? 'panel-collapse collapse in' : 'panel-collapse collapse' }
                    id="jumblr_using_jumblr_3"
                    aria-labelledby="jumblr_using_jumblr"
                    role="tabpanel">
                    <div className="panel-body">
                      <ul>
                        <li>{ translate('JUMBLR.RUN_KMD') }</li>
                        <li>{ translate('JUMBLR.LOGIN_KMD') }</li>
                        <li>{ translate('JUMBLR.GO_TO') }</li>
                        <li>{ translate('JUMBLR.FIND_DEPOSIT_ADDR') }</li>
                        <li>{ translate('JUMBLR.YOU_SEND_FUNDS') }</li>
                        <li>{ translate('JUMBLR.KEEP_WALLET_OPEN') }</li>
                        <li>{ translate('JUMBLR.IMPORTANT_FUNDS') }</li>
                        <li>{ translate('JUMBLR.LARGE_LOT') }</li>
                      </ul>
                      <p>{ this.renderLB('JUMBLR.EG') }</p>
                      <p>{ translate('JUMBLR.93_KMD') }</p>
                      <p>{ translate('JUMBLR.TO_CLEAR_THEM') }</p>
                      <p>{ translate('JUMBLR.WHEN_IT_TOTALS') }</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xlg-12 col-md-12">
              <h4 className="font-size-14 text-uppercase">{ translate('JUMBLR.JADDR') }</h4>
              <div className="panel" id="projects">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td width="20%">{ translate('JUMBLR.BTC_DEPOSIT') }</td>
                        <td>
                          <span id="jumblr_BTCdeposit"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>BTC Jumblr</td>
                        <td>
                          <button type="button" className="btn btn-animate btn-animate-side btn-default btn-sm waves-effect waves-light jumblr_show_hide_addr_btc_btn">
                            <span><i className="icon fa-eye" aria-hidden="true"></i> { translate('JUMBLR.SHOW_HIDE') }</span>
                          </button>
                          <span
                            className="label label-lg label-outline label-success"
                            id="jumblr_BTCjumblr"
                            style={{ display: 'none' }}></span>
                          <span
                            className="label label-lg label-outline label-default"
                            id="jumblr_BTCjumblr_showhide">{ translate('JUMBLR.HIDDEN') }</span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.KMD_DEPOSIT') }</td>
                        <td>
                          <span id="jumblr_KMDdeposit"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>KMD Jumblr</td>
                        <td>
                          <button type="button" className="btn btn-animate btn-animate-side btn-default btn-sm waves-effect waves-light jumblr_show_hide_addr_kmd_btn">
                            <span>
                              <i className="icon fa-eye" aria-hidden="true"></i> { translate('JUMBLR.SHOW_HIDE') }
                            </span>
                          </button>
                          <span
                            className="label label-lg label-outline label-success"
                            id="jumblr_KMDjumblr"
                            style={{ display: 'none' }}></span>
                          <span
                            className="label label-lg label-outline label-default"
                            id="jumblr_KMDjumblr_showhide">{ translate('JUMBLR.HIDDEN') }</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-xlg-12 col-md-12">
              <h4 className="font-size-14 text-uppercase">{ translate('JUMBLR.JSTATUS') }</h4>
              <div className="panel" id="projects">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td width="20%">{ translate('JUMBLR.RESULT') }</td>
                        <td>
                          <span id="jumblr_status_result" className="label label-success"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.DEPOSITED') }</td>
                        <td>
                          <span id="jumblr_status_deposited"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.PUB_TO_PRIV') }</td>
                        <td>
                          <span id="jumblr_status_t_to_z"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.PRIV_TO_PRIV') }</td>
                        <td>
                          <span id="jumblr_status_z_to_z"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.PRIV_TO_PUB') }</td>
                        <td>
                          <span id="jumblr_status_z_to_t"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.FINISHED') }</td>
                        <td>
                          <span id="jumblr_status_finished"></span>
                        </td>
                      </tr>
                      <tr>
                        <td>{ translate('JUMBLR.PENDING') }</td>
                        <td>
                          <span id="jumblr_status_pending"></span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jumblr;
