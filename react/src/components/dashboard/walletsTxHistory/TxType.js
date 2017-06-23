import React, { PropTypes } from 'react';
import { translate } from '../../../translate/translate';

const TxType = ({ category }) => {
  if (category === 'send' ||
      category === 'sent') {
    return (
      <span className="label label-danger">
        <i className="icon fa-arrow-circle-left" /> <span>{ translate('DASHBOARD.OUT') }</span>
      </span>
    );
  }
  if (category === 'receive' ||
      category === 'received') {
    return (
      <span className="label label-success">
        <i className="icon fa-arrow-circle-right" /> <span>{ translate('DASHBOARD.IN') }</span>
      </span>
    );
  }
  if (category === 'generate') {
    return (
      <span>
        <i className="icon fa-cogs" /> <span>{ translate('DASHBOARD.MINED') }</span>
      </span>
    );
  }
  if (category === 'immature') {
    return (
      <span>
        <i className="icon fa-clock-o" /> <span>{ translate('DASHBOARD.IMMATURE') }</span>
      </span>
    );
  }
  if (category === 'unknown') {
    return (
      <span>
        <i className="icon fa-meh-o" /> <span>{ translate('DASHBOARD.UNKNOWN') }</span>
      </span>
    );
  }
};

TxType.propTypes = {
  category: PropTypes.string.isRequired,
};

export default TxType;
