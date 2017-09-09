import React from 'react';
import PropTypes from 'prop-types';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

/**
 * Use this as an example starting point for new React components
 */
class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getTemplateLabels(this.props.languageCode)
        , messages: Labels.getMessageLabels(this.props.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.languageCode).initial
    }
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount = () => {
    // this is where you put the initial call to the rest server
    // if you need it
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.languageCode !== nextProps.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(nextProps.languageCode)
            , messages: Labels.getMessageLabels(nextProps.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.languageCode)
          }
          , message: Labels.getMessageLabels(props.languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function is needed, e.g. if you need to call the rest server again
  }

  render() {
        return (
            <div></div>
        )
  }
}

Template.propTypes = {
    languageCode: PropTypes.string.isRequired
};

Template.defaultProps = {
};

export default Template;
