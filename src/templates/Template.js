import React from 'react';
import PropTypes from 'prop-types';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

/**
 * This is a template for a new component.
 * To use it:
 * 1. Rename all occurrences of NewComponentTemplate to your component name.
 * 2. Replace Labels.getViewReferenceLabels with a call to get your component's labels
 * 3. Add content to the render function, etc...
 */
// TODO: rename class
class NewComponentTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: { // TODO: replace getViewReferencesLabels with method for this class
        thisClass: Labels.getViewReferencesLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
    }

    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(nextProps.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
          }
          , message: Labels.getMessageLabels(props.session.languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }

  // TODO: add the content for the render function
  render() {
    return (
        <div className="App-New-Component-Template">
        </div>
    )
  }
}

// TODO: rename class and add any additional propTypes you need
// TODO: review the structure of the Session class, which also holds User, UiSchemas, and Dropdowns
NewComponentTemplate.propTypes = {
  session: PropTypes.object.isRequired
};

// set default values for props here
// TODO: rename class
NewComponentTemplate.defaultProps = {
  languageCode: "en"
};

// TODO: rename class for export
export default NewComponentTemplate;
