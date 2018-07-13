import React from 'react';
import className from 'classnames';
import * as Utils from './settings.panelUtils';

class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.toggleSection = this.toggleSection.bind(this);
    this.state = {
      singleOpen: this.props.singleOpen,
      openByDefault: this.props.openByDefault,
      activeSections: [],
    };
  }

  componentWillMount() {
    const {
      singleOpen,
      openByDefault,
      uniqId,
      children,
    } = this.props;

    const settings = {
      singleOpen,
      openByDefault,
      uniqId,
      kids: children,
    };

    const initialStateSections = Utils.setupAccordion(settings).activeSections;

    this.setState({
      activeSections: initialStateSections,
    });
  }

  getChildrenWithProps() {
    const {
      children,
    } = this.props;

    const _children = React.Children.map(children, (child, i) => {
      if (child) {
        const unqId = `panel-sec-${i}`;

        return React.cloneElement(child, {
          toggle: (acId) => this.toggleSection(acId),
          key: unqId,
          unq: unqId,
          active: (this.state.activeSections && this.state.activeSections.lastIndexOf(unqId) !== -1),
        });
      }
    });

    return _children;
  }

  toggleSection(sectionId) {
    const newActive = Utils.toggleSection(
      sectionId,
      this.state.activeSections,
      this.state.singleOpen
    );

    if (this.state.activeSections &&
        this.state.activeSections[0] === sectionId) {
      this.setState({
        activeSections: [],
      });
    } else {
      this.setState({
        activeSections: newActive,
      });
    }
  }

  render() {
    const {
      className: propClasses,
      uniqId: propId
    } = this.props;

    const childrenWithProps = this.getChildrenWithProps();
    const accordionClasses = className('panel-group', propClasses);
    const uniqId = propId || '';

    return(
      <div
        className={ accordionClasses }
        id={ uniqId }>
        { childrenWithProps }
      </div>
    );
  }
}

export default Panel;