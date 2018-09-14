import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MessageIcons from './helpers/MessageIcons';
import Server from "../helpers/Server";

/**
 * This is a template for a new component.
 * To use it:
 * 1. Rename all occurrences of NewComponentTemplate to your component name.
 * 2. Replace Labels.getViewReferenceLabels with a call to get your component's labels
 * 3. Add content to the render function, etc...
 *
 * Note that if you use the Server with a callback,
 * you need to:
 *     let requestTokens = this.state._requestTokens;
 *     const requestToken = Server.getCancelToken();
 *     requestTokens.set(requestToken,"live");
 *     ...and pass requestToken via the Server call.
 *     If the component unmounts before the promise
 *     is fulfilled, the componentWillUnmount will
 *     remove it from the Server's list, thus avoiding
 *     the setState on unmounted component error.

 */
// TODO: rename class
class NewComponentTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, {});

    this.handleStateChange = this.handleStateChange.bind(this);
  };

  componentDidMount = () => {
    this.setState({_isMounted: true});
  };

  componentWillUnmount = () => {
    for (let token of this.state._requestTokens.keys()) {
      try {
        Server.cancelRequest(token);
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({_isMounted: false});
  };


  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state));
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, currentState) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    return ({
      labels: { // TODO: replace ViewReferences with method for this class
        thisClass: labels[labelTopics.ViewReferences]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , _isMounted: get(currentState,"_isMounted",true)
      , _requestTokens: get(currentState,"_requestTokens", new Map())
    }, function () { return this.handleStateChange("place holder")})
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
};

// TODO: rename class for export
export default NewComponentTemplate;
