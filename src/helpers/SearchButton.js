import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class SearchButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
        }
    )
  }

  render() {
        return (
              <div className="App-search-button">
                <div className="control-label">{this.props.instructions}</div>
                <Button
                    bsStyle="primary"
                    bsSize="xsmall"
                    type="submit"
                    disabled={this.props.disabled}
                    onClick={this.props.submitHandler}
                >
                 <FontAwesome className="Button-Select-FontAwesome" name={"search"}/>
                  {this.props.submitLabel}
                </Button>

              </div>
        )
  }
}

SearchButton.propTypes = {
  submitLabel: PropTypes.string.isRequired
  , instructions: PropTypes.string.isRequired
  , submitHandler: PropTypes.func.isRequired
  , disabled: PropTypes.bool.isRequired
};

SearchButton.defaultProps = {
};

export default SearchButton;
