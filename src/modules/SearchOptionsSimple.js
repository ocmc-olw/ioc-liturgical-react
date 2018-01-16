import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { Button, FormControl, FormGroup, InputGroup } from 'react-bootstrap';

class SearchOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: ""
    }
    this.setValue = this.setValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setValue = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(this.state.value);
    event.preventDefault();
  }

  render() {
    return (
        <div className="container">
          <div className="row">
            <div className="col-12">
              <form className={"App-Search-Options-Text-Form"} onSubmit={this.handleSubmit}>
                <div className="control-label">{this.props.valueTitle}</div>
                <div className={"App-Search-Options-Text-Div"}>
                  <FormGroup>
                    <InputGroup>
                      <FormControl
                          type="text"
                          placeholder={this.props.placeholder}
                          onChange={this.setValue}
                          className="App-search-text-input"
                      />
                      <InputGroup.Button>
                        <Button
                            className="App-search-button"
                            bsStyle="primary"
                            bsSize="xsmall"
                            type="submit"
                            disabled={! this.state.value}
                            onClick={this.handleSubmit}
                        >
                    <span className="App-text-search-icon" >
                      <FontAwesome name={"search"}/>
                    </span>
                          {this.props.buttonLabel}
                        </Button>
                      </InputGroup.Button>
                    </InputGroup>
                  </FormGroup>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
  }
}

SearchOptions.propTypes = {
  valueTitle: PropTypes.string.isRequired
  , buttonLabel: PropTypes.string.isRequired
  , placeholder: PropTypes.string.isRequired
  , handleSubmit: PropTypes.func.isRequired
};


export default SearchOptions;