import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export class ReactSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
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
          />
        </div>
    )
  }
}

export default ReactSelector;