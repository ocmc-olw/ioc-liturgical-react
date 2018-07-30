import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from '../modules/ReactSelector';

/**
 * Converts a specified label property into a ReactSelector
 * that has each of the label's sub-properties as key-values
 */
class LabelSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.compare = this.compare.bind(this);
    this.toArray = this.toArray.bind(this);
  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  };

  setTheState = (props) => {
    return (
        {
        }
    )
  };

  compare = (a,b) => {
    let comparison = 0;
    if (a.label > b.label) {
      comparison = 1;
    } else if (a.label < b.label) {
      comparison = -1;
    }
    return comparison;
  };

  toArray = () => {
    let s = this.props.labels.values;
    let result = Object.keys(s)
        .map(function(key){
          let item = {};
          item.value = key;
          if (isNaN(key)) { // show the value with the label so the user knows the code being used
            item.label = key + ": " + s[key];
          } else {
            item.label = s[key];
          }
      return item;
    });
    if (this.props.sort) {
      result = result.sort(this.compare);
    }
    return result;
  };

  render() {
        return (
            <ResourceSelector
                title={this.props.labels.title}
                className="App-label-selector"
                initialValue={this.props.initialValue}
                resources={this.toArray()}
                changeHandler={this.props.changeHandler}
                multiSelect={false}
            />
        )
  }
}

LabelSelector.propTypes = {
    languageCode: PropTypes.string.isRequired
    , labels: PropTypes.object.isRequired
    , initialValue: PropTypes.string.isRequired
    , changeHandler: PropTypes.func.isRequired
    , sort: PropTypes.bool
};

LabelSelector.defaultProps = {
  sort: true
};

export default LabelSelector;
