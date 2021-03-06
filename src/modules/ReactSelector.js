import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import {
  ControlLabel
} from 'react-bootstrap';

import 'react-select/dist/react-select.css';

// TODO: switch to VirtualizedSelect, see TopicsSelector for example.  Much faster
export class ReactSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: props.initialValue
    };
  };

  componentWillReceiveProps = (nextProps) => {

    this.setState({
      value: nextProps.initialValue
    });
  };

  handleChange = (selection) => {
    this.props.changeHandler(selection, true);
    this.setState({ value: selection });
  };

  render () {
    return (
        <div className="resourceSelector">
          {this.props.title ? <ControlLabel className="resourceSelectorPrompt">{this.props.title}</ControlLabel>: <span/>}
          <Select
              name="form-field-name"
              value={this.state.value}
              options={this.props.resources}
              onChange={this.handleChange}
              multi={this.props.multiSelect}
              autosize={true}
              clearable
          />
        </div>
    )
  }
};

ReactSelector.propTypes = {
  initialValue: PropTypes.string
  , resources: PropTypes.array.isRequired
  , changeHandler: PropTypes.func.isRequired
  , multiSelect: PropTypes.bool.isRequired
  , title: PropTypes.string
};

// set default values for props here
ReactSelector.defaultProps = {
  initialValue: ""
  , title: ""
};

export default ReactSelector;