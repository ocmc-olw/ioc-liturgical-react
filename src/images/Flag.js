import React from 'react';
import En from './FlagEn';
import El from './FlagEl';

/**
 * Copy this to create a new component.
 */
export class Flag extends React.Component {

  constructor(props) {
    super(props);

    this.getFlag = this.getFlag.bind(this);
  };

  getFlag = (code) => {
    switch(code) {
      case "el": {
        return <El/>;
      }
      default: {
        return <En/>;
      }
    }
  };

  render() {
    return (
        <span>{this.getFlag(this.props.code)}</span>
    )
  }
}

export default Flag;

