import React from 'react';
import { dismissToasterMessage } from '../../actions/actionCreators';
import Store from '../../store';

// each toast will be displayed for 5 seconds
const DISPLAY_LENGTH_MILLIS = 5000;

/**
 * Displays one toast message
 * each messages has a type, title and a content message
 */
class ToasterItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: props.display,
      message: props.message,
      type: props._type,
      title: props.title,
      autoClose: props.autoClose,
      toastId: props.toastId,
      className: props.className,
    };
    this.dismissToast = this.dismissToast.bind(this);
    this.renderLB = this.renderLB.bind(this);
    this.timeoutHandler = null;
  }

  componentWillReceiveProps(props) {
    if (props &&
        props.message) {
      this.setState({
        message: props.message,
        type: props._type,
        title: props.title,
        autoClose: props.autoClose,
        toastId: props.toastId,
        className: props.className,
      });
    } else {
      this.setState({
        message: null,
        type: null,
        title: null,
        autoClose: true,
        toastId: null,
        className: null,
      });
    }
  }

  dismissToast(toastId) {
    Store.dispatch(dismissToasterMessage(toastId));
  }

  renderLB() {
    if (typeof this.state.message === 'object') {
      const _msg = this.state.message;
      let _items = [];

      for (let i = 0; i < _msg.length; i++) {
        if (_msg[i] === '') {
          _items.push(
            <div
              key={ `toaster-msg-${i}` }
              className="margin-top-5"></div>
          );
        } else {
          _items.push(
            <div key={ `toaster-msg-${i}` }>{ _msg[i] }</div>
          );
        }
      }

      return _items;
    } else {
      return this.state.message;
    }
  }

  renderToast() {
    // ensure that setTimeout is called only once for each toast message
    if (this.state.autoClose &&
        !this.timeoutHandler) {
      this.timeoutHandler = setTimeout(() => {
        this.dismissToast(this.state.toastId);
      }, DISPLAY_LENGTH_MILLIS);
    }

    return (
      <div className={ `toast toast-${this.state.type}${this.state.className ? ' ' + this.state.className : ''}` }>
        <button
          className="toast-close-button"
          onClick={ () => this.dismissToast(this.state.toastId) }>×
        </button>
        <div className="toast-title">{ this.state.title }</div>
        <div className="toast-message">{ this.renderLB() }</div>
      </div>
    );
  }

  render() {
    if (this.state.message) {
      return this.renderToast();
    } else {
      return null;
    }
  }
}

export default ToasterItem;
