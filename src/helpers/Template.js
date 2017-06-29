import React from 'react';
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

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
      return (
          {
            labels: {
              thisClass: Labels.TemplateLabels(this.props.languageCode)
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
    languageCode: React.PropTypes.string.isRequired
};

Template.defaultProps = {
};

export default Template;
