import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class BodyEnd extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  componentDidMount() {
    this._popup = document.createElement('div');
    document.body.appendChild(this._popup);
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this._popup);
    document.body.removeChild(this._popup);
  }

  _render() {
    ReactDOM.render(this.props.children, this._popup);
  }

  render() {
    return null;
  }
}