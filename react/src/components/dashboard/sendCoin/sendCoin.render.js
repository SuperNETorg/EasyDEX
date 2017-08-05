import React from 'react';
import { translate } from '../../../translate/translate';
import {
  secondsElapsedToString,
  secondsToString
} from '../../../util/time';

import QRModal from '../qrModal/qrModal';

export const UTXOCacheInfoRender = function(refreshCacheData, isReadyToUpdate, waitUntilCallIsFinished, timestamp) {
  return (
    <div className="col-lg-12">
      <hr />
      { translate('SEND.TOTAL_UTXO_AVAILABLE') }:
      { refreshCacheData ? refreshCacheData.data && refreshCacheData.data.length : translate('SEND.PRESS_UPDATE_BTN') }<br />
      <div className={ !timestamp ? 'hide' : '' }>
        { translate('SEND.LAST_UPDATED') } @
        { secondsToString(refreshCacheData ? refreshCacheData.timestamp : 0, true) }&nbsp;|&nbsp;
        { secondsElapsedToString(timestamp || 0) }&nbps;
        { translate('SEND.AGO') }<br />
      </div>
      <div className={ isReadyToUpdate ? 'hide' : '' }>
        { translate('SEND.NEXT_UPDATE_IN') } { secondsElapsedToString(600 - timestamp) }s
      </div>
      <div className={ 'full-width margin-bottom-10 margin-top-10 ' + (this.state.currentStackLength === 1 || (this.state.currentStackLength === 0 && this.state.totalStackLength === 0) ? 'hide' : 'progress progress-sm') }>
        <div
          className="progress-bar progress-bar-striped active progress-bar-indicating progress-bar-success font-size-80-percent"
          style={{ width: 100 - `${(this.state.currentStackLength * 100 / this.state.totalStackLength)}%` }}>
          { translate('SEND.PROCESSING_REQ') }: { this.state.currentStackLength } / { this.state.totalStackLength }
        </div>
      </div>
      <button
        type="button"
        className={ 'margin-top-10 ' + (isReadyToUpdate ? 'btn btn-primary waves-effect waves-light' : 'hide') }
        onClick={ this._fetchNewUTXOData }
        disabled={ waitUntilCallIsFinished }>
        { waitUntilCallIsFinished ? `${translate('SEND.LOCKED_PLEASE_WAIT')}...` : translate('SEND.UPDATE') }
      </button>
    </div>
  );
};

export const SendCoinResponseRender = function () {
  if (this.props.ActiveCoin.lastSendToResponse) {
    let items = [];
    const _response = this.props.ActiveCoin.lastSendToResponse;

    for (let key in _response) {
      if (key !== 'tag') {
        items.push(
          <tr key={ key }>
            <td>{ key }</td>
            <td>{ this.renderKey(key) }</td>
          </tr>
        );
      }
    }

    return items;
  } else {
    return (
      <div className="padding-20 text-align-center">
        <div className="vertical-padding-10 horizontal-padding-0">
          { translate('SEND.PROCESSING_TRANSACTION') }...<br />
          { translate('SEND.NOTE_IT_WILL_TAKE') }.
        </div>
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
      </div>
    );
  }
}

export const OASendUIRender = function () {
  return (
    <div className="row">
      <div className="col-lg-6 form-group form-material">
        <label
          className="control-label"
          htmlFor="kmdWalletSendTo">Fetch OpenAlias recipient address</label>
        <input
          type="text"
          className="form-control"
          name="sendToOA"
          onChange={ this.updateInput }
          id="kmdWalletSendTo"
          placeholder="Enter an alias as address@site.com"
          autoComplete="off"
          required />
      </div>
      <div className="col-lg-6 form-group form-material">
        <button
          type="button"
          className="btn btn-primary waves-effect waves-light"
          onClick={ this.getOAdress }>
          Get address
        </button>
      </div>
    </div>
  );
};

export const SendApiTypeSelectorRender = function () {
  return (
    <div className="row">
      <div className="col-lg-8 margin-bottom-10">
        <span className="pointer">
          <label className="switch">
            <input
              type="checkbox"
              checked={ this.state.sendApiType } />
            <div
              className="slider"
              onClick={ this.toggleSendAPIType }></div>
          </label>
          <div
            className="toggle-label"
            onClick={ this.toggleSendAPIType }>
            { translate('SEND.SEND_VIA') } (sendtoaddress API)
          </div>
        </span>
      </div>
      { this.state.isCameraFeatureDetected &&
        <div className="col-lg-4 text-right">
          <QRModal
            mode="scan"
            setRecieverFromScan={this.setRecieverFromScan} />
        </div>
      }
    </div>
  );
};

export const SendCoinRender = function () {
  return (
    <div className="col-sm-12 padding-top-10">
      <div className="col-xlg-12 col-md-12 col-sm-12 col-xs-12">
        <div className="steps row margin-top-10">
          <div className={ 'step col-md-4' + (this.state.currentStep === 0 ? ' current' : '') }>
            <span className="step-number">1</span>
            <div className="step-desc">
              <span className="step-title">{ translate('INDEX.FILL_SEND_FORM') }</span>
              <p>{ translate('INDEX.FILL_SEND_DETAILS') }</p>
            </div>
          </div>
          <div className={ 'step col-md-4' + (this.state.currentStep === 1 ? ' current' : '') }>
            <span className="step-number">2</span>
            <div className="step-desc">
              <span className="step-title">{ translate('INDEX.CONFIRMING') }</span>
              <p>{ translate('INDEX.CONFIRM_DETAILS') }</p>
            </div>
          </div>
          <div className={ 'step col-md-4' + (this.state.currentStep === 2 ? ' current' : '') }>
            <span className="step-number">3</span>
            <div className="step-desc">
              <span className="step-title">{ translate('INDEX.PROCESSING_TX') }</span>
              <p>{ translate('INDEX.PROCESSING_DETAILS') }</p>
            </div>
          </div>
        </div>

        <div className={ 'panel' + (this.state.currentStep === 0 ? '' : ' hide') }>
          <div className="panel-heading">
            <h3 className="panel-title">
              { translate('INDEX.SEND') } { this.props.ActiveCoin.coin }
            </h3>
          </div>
          <div className="panel-body container-fluid">
            <form
              className="edexcoin-send-form"
              method="post"
              autoComplete="off">
              { this.renderSendApiTypeSelector() }
              <div className="row">
                <div className={ this.props.ActiveCoin.mode === 'basilisk' ? 'col-xlg-12 form-group form-material' : 'hide' }>
                  <label
                    className="control-label"
                    htmlFor="edexcoinSendFrom">
                      { translate('INDEX.SEND_FROM') }
                  </label>
                  { this.renderAddressList() }
                </div>
              </div>
              { this.renderOASendUI() }
              <div className="row">
                <div className="col-xlg-12 form-group form-material">
                  <label
                    className="control-label"
                    htmlFor="edexcoinSendTo">
                      { translate('INDEX.SEND_TO') }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edexcoinSendTo"
                    name="sendTo"
                    placeholder={ translate('SEND.ENTER_AN_ADDRESS') }
                    autoComplete="off"
                    value={ this.state.sendTo }
                    onChange={ this.updateInput }
                    required />
                </div>
                <div className="col-lg-6 form-group form-material">
                  <label
                    className="control-label"
                    htmlFor="edexcoinAmount">
                      { this.props.ActiveCoin.coin }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edexcoinAmount"
                    name="amount"
                    placeholder="0.000"
                    autoComplete="off"
                    defaultValue={ this.state.amount }
                    value={ this.state.amount }
                    onChange={ this.updateInput } />
                </div>
                <div className="col-lg-6 form-group form-material">
                  <label
                    className="control-label"
                    htmlFor="edexcoinFee">
                      { translate('INDEX.FEE') }
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="edexcoinFee"
                    name="fee"
                    defaultValue={ this.state.fee }
                    value={ this.state.fee }
                    placeholder="0.000"
                    autoComplete="off"
                    onChange={ this.updateInput } />
                </div>
                <div className="col-lg-12">
                  <strong>
                    { translate('INDEX.TOTAL') }&nbsp;
                    ({ translate('INDEX.AMOUNT_SM') } - txfee):
                  </strong>&nbsp;
                  { Number(this.state.amount) - Number(this.state.fee) } { this.props.ActiveCoin.coin }
                </div>
                <div className={ this.state.sendApiType ? 'hide' : 'col-lg-10 margin-top-30' }>
                  <span className="pointer">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={ this.state.sendSig } />
                      <div
                        className="slider"
                        onClick={ this.toggleSendSig }></div>
                    </label>
                    <div
                      className="toggle-label"
                      onClick={ this.toggleSendSig }>
                        { translate('INDEX.DONT_SEND') }
                    </div>
                  </span>
                </div>
                { this.renderUTXOCacheInfo()}
                <div className="col-lg-12">
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light pull-right"
                    onClick={ () => this.changeSendCoinStep(1) }
                    disabled={ !this.state.sendFrom || !this.state.sendTo || !this.state.amount }>
                    { translate('INDEX.SEND') }&nbsp;
                    { Number(this.state.amount) - Number(this.state.fee) } { this.props.ActiveCoin.coin }
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className={ 'col-xlg-12 col-md-12 col-sm-12 col-xs-12' + (this.state.currentStep === 1 ? '' : ' hide') }>
        <div className="panel">
          <div className="panel-body">
            <div className="row">
              <div className="col-xs-12">
                <strong>{ translate('INDEX.TO') }</strong>
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">{ this.state.sendTo }</div>
              <div className="col-lg-6 col-sm-6 col-xs-6">
                { this.state.amount } { this.props.ActiveCoin.coin }
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">{ translate('INDEX.TX_FEE_REQ') }</div>
              <div className="col-lg-6 col-sm-6 col-xs-6">
                { this.state.fee } { this.props.ActiveCoin.coin }
              </div>
            </div>
            <br />

            <div className="row">
              <div className="col-xs-12">
                <strong>{ translate('INDEX.FROM') }</strong>
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-12">
                { this.props.Dashboard.activeHandle[this.props.ActiveCoin.coin] }
              </div>
              <div className="col-lg-6 col-sm-6 col-xs-6 confirm-currency-send-container">
                { Number(this.state.amount) - Number(this.state.fee) } { this.props.ActiveCoin.coin }
              </div>
            </div>
            <div className="widget-body-footer">
              <a
                className="btn btn-default waves-effect waves-light"
                onClick={ () => this.changeSendCoinStep(0) }>{ translate('INDEX.BACK') }</a>
              <div className="widget-actions pull-right">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => this.changeSendCoinStep(2) }>
                    { translate('INDEX.CONFIRM') }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={ 'col-xlg-12 col-md-12 col-sm-12 col-xs-12' + (this.state.currentStep === 2 ? '' : ' hide') }>
        <div className="panel">
          <div className="panel-heading">
            <h4 className="panel-title">
              { translate('INDEX.TRANSACTION_RESULT') }
            </h4>
            <div className={ !this.state.sendSig ? 'hide' : 'center' }>
              { translate('SEND.YOU_PICKED_OPT') }
            </div>
            <table className="table table-hover table-striped">
              <thead>
                <tr>
                  <th>{ translate('INDEX.KEY') }</th>
                  <th>{ translate('INDEX.INFO') }</th>
                </tr>
              </thead>
              <tbody>
                { this.renderSendCoinResponse() }
              </tbody>
            </table>
            <div className="widget-body-footer">
              <div className="widget-actions margin-bottom-15 margin-right-15">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={ () => this.changeSendCoinStep(0) }
                  disabled={ this.state.utxoMethodInProgress }>
                    { !this.state.utxoMethodInProgress ? translate('INDEX.MAKE_ANOTHER_TX') : `${translate('SEND.PLEASE_WAIT')}...` }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};