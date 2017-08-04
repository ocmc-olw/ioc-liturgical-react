import React from 'react';
import PropTypes from 'prop-types';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

// TODO: switch to VirtualizedSelect, see TopicsSelector for example.  Much faster
export class ReactSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.initialValue
    };
  }

  componentWillReceiveProps = (nextProps) => {

    this.setState({
      value: nextProps.initialValue
    });
  }

  handleChange = (selection) => {
    this.props.changeHandler(selection, true);
    this.setState({ value: selection });
  };

  render () {
    return (
        <div className="resourceSelector">
          <div className="resourceSelectorPrompt">{this.props.title}</div>
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
}

ReactSelector.propTypes = {
  initialValue: PropTypes.string.isRequired
  , resources: PropTypes.array.isRequired
  , changeHandler: PropTypes.func.isRequired
  , multiSelect: PropTypes.bool.isRequired
};

export default ReactSelector;