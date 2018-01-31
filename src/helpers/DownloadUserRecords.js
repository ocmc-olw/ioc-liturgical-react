import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Server from "./Server";
import Spinner from './Spinner';
import MessageIcons from "./MessageIcons";
import Labels from "../Labels";

class DownloadUserRecords extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      fetching: false
      , labels: {
        messages: Labels.getMessageLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.fetchDocData = this.fetchDocData.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            messages: Labels.getMessageLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }

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
          console.log(error);
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
  languageCode: "en"
};

export default DownloadUserRecords;
