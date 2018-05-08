import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
  , Well
} from 'react-bootstrap';
import YouTube from 'react-youtube';

class YoutubeVideoPanel extends React.Component {
  constructor(props) {
    super(props);
    this.onReady = this.onReady.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
  };

  onReady = (event) => {
    event.target.pauseVideo();
  };


  render() {

    return (
            <div>
              <Panel
                  className="App-Youtube-panel"
                  header={this.props.title}
                  eventKey={this.props.eventKey}
                  collapsible
              >
                <Well>
                <p className="App-Youtube-Text">{this.props.text}</p>
                    <YouTube
                        className="App-Youtube-player"
                        videoId={this.props.videoId}
                        opts={this.props.opts}
                        onReady={this.onReady}
                    />
                  }
                </Well>
              </Panel>
            </div>
        )
  }
}

YoutubeVideoPanel.propTypes = {
    videoId: PropTypes.string
    , title: PropTypes.string.isRequired
    , text: PropTypes.string.isRequired
    , eventKey: PropTypes.string.isRequired
    , opts: PropTypes.object
};

YoutubeVideoPanel.defaultProps = {
  opts: {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
      , modestbranding: 1
      , rel: 0
    }
  }
};

export default YoutubeVideoPanel;
