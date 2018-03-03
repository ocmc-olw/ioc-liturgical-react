import React from 'react';
import PropTypes from 'prop-types';
import Popout from 'react-popout';

/**
 * Provides a pop out windows that embeds a browser
 */
class PopoutBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.popout = this.popout.bind(this);
    this.popoutClosed = this.popoutClosed.bind(this);
    this.state = { isPoppedOut: true };
  };

  popout() {
    this.setState({isPoppedOut: true});
  };

  popoutClosed() {
    console.log("popoutClosed called");
    this.setState({isPoppedOut: true});
  };

  render() {
    if (this.props.show) {
      var popout = <span onClick={this.popout} className="buttonGlyphicon glyphicon glyphicon-export"></span>
      return (
          <div>
            <Popout url={this.props.url} title={this.props.title} onClosing={this.popoutClosed}>
            </Popout>
            <strong>View {popout}</strong>
          </div>
      );
    } else {
      return (
          <div>
            <strong>View {popout}</strong>
          </div>
      );
    }
  };
};
PopoutBrowser.propTypes = {
  title: PropTypes.string.isRequired
  , url: PropTypes.string.isRequired
  , show: PropTypes.bool.isRequired
};

export default PopoutBrowser;
