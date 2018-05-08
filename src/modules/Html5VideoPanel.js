import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
  , Well
} from 'react-bootstrap';

class Html5VideoPanel extends React.Component {
  constructor(props) {
    super(props);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
  };

  render() {

    return (
            <div>
              <Panel
                  className="App-Help-panel"
                  header={this.props.title}
                  eventKey={this.props.eventKey}
                  collapsible
              >
                <Well>
                <p>{this.props.text}</p>
                  {this.props.url ?
                      <video className="App-video-player" width="320" height="240" controls> <source src={this.props.url}/></video>
                      : <span></span>
                  }
                </Well>
              </Panel>
            </div>
        )
  }
}

Html5VideoPanel.propTypes = {
    url: PropTypes.string
    , title: PropTypes.string.isRequired
    , text: PropTypes.string.isRequired
    , eventKey: PropTypes.string.isRequired
};

Html5VideoPanel.defaultProps = {
};

export default Html5VideoPanel;
