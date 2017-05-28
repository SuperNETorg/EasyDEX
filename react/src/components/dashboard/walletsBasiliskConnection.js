import React from 'react';
import { translate } from '../../translate/translate';
import { basiliskConnection } from '../../actions/actionCreators';
import Store from '../../store';

class WalletsBasiliskConnection extends React.Component {
  constructor(props) {
    super(props);
    this.basiliskConnectionAction = this.basiliskConnectionAction.bind(this);
  }

  basiliskConnectionAction() {
    Store.dispatch(basiliskConnection(false));
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.basiliskConnectionAction();
    }
  }

  render() {
    if (this.props &&
        this.props.Dashboard.basiliskConnection) {
      return (
        <div onKeyDown={ (event) => this.handleKeydown(event) }>
          <div className="modal show" id="RefreshBasiliskConnectionsMdl" aria-hidden="false" role="dialog">
            <div className="modal-dialog modal-center modal-md">
              <div className="modal-content">
                <div className="modal-header bg-orange-a400 wallet-send-header">
                  <h4 className="modal-title white">
                    <span className="icon fa-refresh no-margin"></span> { translate('INDEX.REFRESHING_BASILISK_NET') }...
                  </h4>
                  <button type="button" className="close btn-close" aria-label="Close" onClick={ this.basiliskConnectionAction }>
                    <span aria-hidden="true">&times;</span>
                    <span className="sr-only">{ translate('INDEX.CLOSE') }</span>
                  </button>
                </div>
                <div className="modal-body text-align-center">
                  <div className="loader-wrapper active">
                    <div className="loader-layer loader-blue">
                      <div className="loader-circle-left">
                        <div className="circle"></div>
                      </div>
                      <div className="loader-circle-gap"></div>
                      <div className="loader-circle-right">
                        <div className="circle"></div>
                      </div>
                    </div>
                    <div className="loader-layer loader-red">
                      <div className="loader-circle-left">
                        <div className="circle"></div>
                      </div>
                      <div className="loader-circle-gap"></div>
                      <div className="loader-circle-right">
                        <div className="circle"></div>
                      </div>
                    </div>
                    <div className="loader-layer loader-green">
                      <div className="loader-circle-left">
                        <div className="circle"></div>
                      </div>
                      <div className="loader-circle-gap"></div>
                      <div className="loader-circle-right">
                        <div className="circle"></div>
                      </div>
                    </div>
                    <div className="loader-layer loader-yellow">
                      <div className="loader-circle-left">
                        <div className="circle"></div>
                      </div>
                      <div className="loader-circle-gap"></div>
                      <div className="loader-circle-right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                  <h5 className="text-left">
                    { translate('IAPI.CON_STATUS') + '... ' + this.props.Dashboard.connectedNotaries.current + '/' + this.props.Dashboard.connectedNotaries.total + ': ' + this.props.Dashboard.connectedNotaries.currentNodeName} <span className="pull-right" id="basilisk-connections-refresh-percent">{ Math.floor(this.props.Dashboard.connectedNotaries.current * 100 / this.props.Dashboard.connectedNotaries.total) }%</span>
                  </h5>
                  <div className="progress progress-sm">
                    <div className="progress-bar progress-bar-info progress-bar-striped active" style={{ width: Math.floor(this.props.Dashboard.connectedNotaries.current * 100 / this.props.Dashboard.connectedNotaries.total) + '%', fontSize: '80%' }} role="progressbar" id="basilisk-connections-refresh-progress-bar"></div>
                  </div>
                  <pre id="basilisk-connections-refresh-status-output no-padding">
                  { this.props.Dashboard.connectedNotaries.failedToConnectNodes ? 'Failed: ' + this.props.Dashboard.connectedNotaries.failedToConnectNodes : null }
                  </pre>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show in"></div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default WalletsBasiliskConnection;
