import React from 'react';

class Spinner extends React.Component {
  constructor() {
    super();
  }

  render() {
    let _paths = [];

    for (let i = 0; i < 4; i++) {
      _paths.push(
        <circle
          className={ i === 0 ? 'path' : `path${i + 1}` }
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="5"
          strokeMiterlimit="10"
          key={ `spinner-circle-${i}` } />
      );
    }

    return (
      <div className="loader">
        <svg className="circle">
        { _paths }
        </svg>
      </div>
    );
  }
}

export default Spinner;