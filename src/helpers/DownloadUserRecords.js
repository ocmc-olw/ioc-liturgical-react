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

    this.state = {
      fetching: false
      , labels: {
        messages: Labels.getMessageLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(props.session.languageCode).initial

    };
    this.fetchDocData = this.fetchDocData.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(
        {
          labels: {
            messages: Labels.getMessageLabels(nextProps.session.languageCode)
          }
          , message: Labels.getMessageLabels(nextProps.session.languageCode).initial

        }    )
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

export default DownloadUserRecords;
