import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
  , Well
} from 'react-bootstrap';
//import { Player } from 'video-react';

/**
 * The user of this component must import video-react.css
 */
class HelpPanel extends React.Component {
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

HelpPanel.propTypes = {
    url: PropTypes.string
    , title: PropTypes.string.isRequired
    , text: PropTypes.string.isRequired
};

HelpPanel.defaultProps = {
};

export default HelpPanel;
