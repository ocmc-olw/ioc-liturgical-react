import React from 'react';
import PropTypes from 'prop-types';
import MessageIcons from '../helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';

class Spinner extends React.Component {
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
  };

  render() {
        return (
              <span className="App-spinner-span">
              <FontAwesome
                  className="App-font-awesome-spinner"
                  name={MessageIcons.getMessageIcons().spinner}
                  spin
              /> {this.props.message}
              </span>
        )
  }
}

Spinner.propTypes = {
  message: PropTypes.string.isRequired
};

Spinner.defaultProps = {
};

export default Spinner;
