import React from 'react';
import En from './images/FlagEn';
import El from './images/FlagEl';


// To get more flags:
// git clone git@github.com:hjnilsson/country-flags.git

// To compute width and height, see
// https://en.wikipedia.org/wiki/List_of_aspect_ratios_of_national_flags

// if we use a standard width of 20px, then 20/ratio as a decimal = height

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
    console.log(this.props.code);
    return (
        <span>{this.getFlag(this.props.code)}</span>
    )
  }
}

export default Flag;

