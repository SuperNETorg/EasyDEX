import React from 'react';
import className from 'classnames';

class PanelSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectionHeight: 0,
    };
    this.accordionResizeInterval = null;
    this.toggleSection = this.toggleSection.bind(this);
  }

  componentDidMount() {
    const { active } = this.props;
    let _pass = false;

    if (active) {
      this.setState({
        sectionHeight: this.accordionContent.scrollHeight,
      });
    }

    this.accordionResizeInterval = setInterval(() => {
      if (this.props.active) {
        this.setState({ // auto resize hack
          sectionHeight: _pass ? 'auto' : `${this.accordionContent.scrollHeight}px`,
        });
        _pass = !_pass;
      }
    }, 2000);
  }

  componentWillUnmount() { // revise(?)
    clearInterval(this.accordionResizeInterval);
  }

  componentWillReceiveProps(props) {
    if (this.props.active) {
      this.setState({
        sectionHeight: 'auto',
      });
    }

    if (props.active !== this.props.active) {
      this.toggleOpen(props.active);
    }
  }

  getHeight() {
    const { active } = this.props;

    return (active) ? this.accordionContent.scrollHeight : 0;
  }

  toggleSection() {
    const {
      unq,
      toggle,
    } = this.props;
    toggle(unq);
  }

  toggleOpen(active) {
    const height = (active) ? `${this.accordionContent.scrollHeight}px` : 0;

    this.setState({
      sectionHeight: height,
    });
  }

  render() {
    const {
      title,
      icon,
      children,
      active,
      className: propClasses,
    } = this.props;

    const contentStyles = {
      height: this.state.sectionHeight,
      overflow: 'hidden',
      transition: 'height .25s ease',
    };

    const triggerClasses = className('panel', {
      active,
    });

    const contentClasses = className('panel-collapse', {
      active,
    });

    return(
      <div className={ triggerClasses }>
        <div
          onClick={ () => this.toggleSection() }
          className="panel-heading">
          <a className="panel-title">
            <i className={ icon }></i> { title }
          </a>
        </div>
        <div
          className={ contentClasses }
          style={ contentStyles }
          ref={ (ref) => this.accordionContent = ref }>
          <div className="panel-body">
            { children }
          </div>
        </div>
      </div>
    );
  }
}

export default PanelSection;
