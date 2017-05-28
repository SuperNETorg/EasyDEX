import React from 'react';
import {
  checkTimestamp,
  secondsElapsedToString,
  secondsToString
} from '../../util/time';
import { sortByDate } from '../../util/sort';
import { translate } from '../../translate/translate';

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayModal: false,
      totalCalls: 0,
      totalErrorCalls: 0,
      totalSuccessCalls: 0,
      totalPendingCalls: 0,
      activeTab: 2,
      guiLog: null,
    };
    this.toggleNotificationsModal = this.toggleNotificationsModal.bind(this);
  }

  openTab(tab) {
    this.setState(Object.assign({}, this.state, {
      activeTab: tab,
    }));
  }

  componentWillReceiveProps(props) {
    // get total number of calls per type
    if (this.props.Dashboard &&
        this.props.Dashboard.guiLog) {
      const _guiLog = this.props.Dashboard.guiLog;
      let totalCalls = Object.keys(_guiLog).length;
      let totalErrorCalls = 0;
      let totalSuccessCalls = 0;
      let totalPendingCalls = 0;
      let guiLogToArray = [];

      for (let timestamp in _guiLog) {
        guiLogToArray.push(_guiLog[timestamp]);

        if (_guiLog[timestamp].status === 'error') {
          totalErrorCalls++;
        }
        if (_guiLog[timestamp].status === 'success') {
          totalSuccessCalls++;
        }
        if (_guiLog[timestamp].status === 'pending') {
          totalPendingCalls++;
        }
      }

      this.setState(Object.assign({}, this.state, {
        totalCalls,
        totalErrorCalls,
        totalSuccessCalls,
        totalPendingCalls,
        guiLog: guiLogToArray,
      }));
    }
  }

  renderNotificationsByType(type) {
    // get total number of calls per type
    if (this.state.guiLog &&
        this.state.guiLog.length) {
      let _guiLog = this.state.guiLog;
      _guiLog = sortByDate(_guiLog);
      let items = [];
      let index = 0;

      for (let i = 0; i < _guiLog.length; i++) {
        if (_guiLog[i].status === type) {
          const _logItem = _guiLog[i];

          items.push(
            <div key={ _logItem.timestamp }>
              <div>{ index + 1 }.</div>
              <div>
                <strong>Time:</strong> { secondsToString(_logItem.timestamp, true, true) }
              </div>
              <div>
                <strong>GUI Function:</strong> { _logItem.function }
              </div>
              <div>
                <strong>HTTP:</strong> { _logItem.httpMethod.toUpperCase() }
              </div>
              <div>
                <strong>URL:</strong> { _logItem.url }
              </div>
              <div>
                <strong>Payload:</strong> { JSON.stringify(_logItem.payload, null, '\t') }
              </div>
              <div className={ type !== 'pending' ? '' : 'hide' }>
                <strong>Response:</strong> { JSON.stringify(_logItem.response, null, '\t') }
              </div>
              <hr />
            </div>
          );
        }

        index++;
      }

      return items;
    }
  }

  renderNotificationsModal() {
    if (this.state.displayModal) {
      return (
        <div onKeyDown={ (event) => this.handleKeydown(event) }>
          <div className="modal show notifications-modal" aria-hidden="false" role="dialog">
            <div className="modal-dialog modal-center modal-lg">
              <div className="modal-content">
                <div className="modal-body modal-body-container">
                  <div className="panel nav-tabs-horizontal">
                    <ul className="nav nav-tabs nav-tabs-line" role="tablist">
                      <li className={ this.state.activeTab === 0 ? 'active' : 'pointer' } role="presentation">
                        <a
                          role="tab"
                          onClick={ () => this.openTab(0) }>
                          <i className="icon fa fa-thumbs-o-up" aria-hidden="true"></i> Success ({ this.state.totalSuccessCalls })
                        </a>
                      </li>
                      <li className={ this.state.activeTab === 1 ? 'active' : 'pointer' } role="presentation">
                        <a
                          role="tab"
                          onClick={ () => this.openTab(1) }>
                          <i className="icon fa fa-exclamation-triangle" aria-hidden="true"></i> Error ({ this.state.totalErrorCalls })
                        </a>
                      </li>
                      <li className={ this.state.activeTab === 2 ? 'active' : 'pointer' } role="presentation">
                        <a
                          role="tab"
                          onClick={ () => this.openTab(2) }>
                          <i className="icon fa fa-clock-o" aria-hidden="true"></i> Pending ({ this.state.totalPendingCalls })
                        </a>
                      </li>
                    </ul>
                    <div className="panel-body panel-body-container">
                      <div className="tab-content">
                        <div
                          className={ this.state.activeTab === 0 ? 'tab-pane active' : 'tab-pane' }
                          role="tabpanel">
                          { this.renderNotificationsByType('success') }
                        </div>
                        <div
                          className={ this.state.activeTab === 1 ? 'tab-pane active' : 'tab-pane' }
                          role="tabpanel">
                          { this.renderNotificationsByType('error') }
                        </div>
                        <div
                          className={ this.state.activeTab === 2 ? 'tab-pane active' : 'tab-pane' }
                          role="tabpanel">
                          { this.renderNotificationsByType('pending') }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    onClick={ this.toggleNotificationsModal }>{ translate('INDEX.CLOSE') }</button>
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

  toggleNotificationsModal() {
    this.setState(Object.assign({}, this.state, {
      displayModal: !this.state.displayModal,
    }));
  }

  render() {
    return (
      <div>
        <div
          className={ this.props.Dashboard.activeHandle && this.props.Dashboard.activeHandle.status === 'unlocked' ? 'notifications-badge stick-to-top' : 'notifications-badge' }
          onClick={ this.toggleNotificationsModal }>
          <span className="badge success">{ this.state.totalSuccessCalls }</span>
          <span className="badge error">{ this.state.totalErrorCalls }</span>
          <span className="badge pending">{ this.state.totalPendingCalls }</span>
        </div>
        { this.renderNotificationsModal() }
      </div>
    );
  }
}

export default Notifications;
