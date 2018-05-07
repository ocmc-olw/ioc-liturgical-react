import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
  , Well
} from 'react-bootstrap';
import { Player } from 'video-react';

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
                      <Player className="App-video-player">
                        <source src={this.props.url} />
                      </Player>
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
