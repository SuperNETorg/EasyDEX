import React from 'react';
import WalletsHeaderRender from './walletsHeader.render';

class WalletsHeader extends React.Component {
  hasActiveSection() {
    return this.props &&
      this.props.activeSection;
  }

  isActiveSectionJumblr() {
    return this.props.activeSection === 'jumblr';
  }

  render() {
    if (this.hasActiveSection()) {
      return WalletsHeaderRender.call(this);
    } else {
      return null;
    }
  }
}

export default WalletsHeader;
