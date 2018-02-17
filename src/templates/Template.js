import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { // TODO: replace getViewReferencesLabels with method for this class
        thisClass: Labels.getViewReferencesLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
    };

    this.handleStateChange = this.handleStateChange.bind(this);
  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
          , somethingWeTrackIfChanged: get(this.state, "somethingWeTrackIfChanged", "" )
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  // TODO: add the content for the render function
  render() {
    return (
        <div className="App-New-Component-Template">
        </div>
    )
  }
};

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
