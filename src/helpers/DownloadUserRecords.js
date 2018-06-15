import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Server from "./Server";
import Spinner from './Spinner';
import MessageIcons from "./MessageIcons";

class DownloadUserRecords extends React.Component {
  constructor(props) {
    super(props);
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    this.state = {
      fetching: false
      , labels: {
        messages: labels[labelTopics.messages]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.fetchDocData = this.fetchDocData.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;
    this.setState((prevState, props) => {
        return {
          labels: {
            messages: labels[labelTopics.messages]
          }
          , message: labels[labelTopics.messages].initial
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  fetchDocData = () => {
    this.setState({fetching: true});
    Server.restGetUserDocs(
        this.props.session.restServer
        , Server.getDbServerUserDocsApi()
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
    )
        .then( response => {
          this.setState(
              {
                userMessage: response.userMessage
                , developerMessage: response.developerMessage
                , messageIcon: response.messageIcon
                , status: response.status
                , fetching: false
              }
          );
        })
        .catch( error => {
          this.setState(
              {
                userMessage: error.userMessage
                , developerMessage: error.developerMessage
                , messageIcon: error.messageIcon
                , status: error.status
                , fetching: false
              })
        })
    ;
  };

  render() {
    if (this.state.fetching) {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      );
    } else {
      return (<div><Button onClick={this.fetchDocData}>Download</Button></div>);
    }
  };


}

DownloadUserRecords.propTypes = {
  session: PropTypes.object.isRequired
};

// set default values for props here
DownloadUserRecords.defaultProps = {
};

export default DownloadUserRecords;
