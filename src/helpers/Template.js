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

    this.state = this.setTheState(props, "");
  }

  componentDidMount = () => {
    // this is where you put the initial call to the rest server
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
      return (
          {
            labels: {
              thisClass: Labels.getTemplateLabels(this.props.languageCode)
              , messages: Labels.getMessageLabels(this.props.languageCode)
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: Labels.getMessageLabels(this.props.languageCode).initial
          }
      )
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
