import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Alert, Button, Glyphicon } from 'react-bootstrap';
import Server from './Server';
import MessageIcons from './MessageIcons';

class DeleteButton extends React.Component {
  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.deleteButton]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , show: false
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteCallback = this.handleDeleteCallback.bind(this);
    this.handleDismiss = this.handleDismiss.bind(this);
    this.handleShow = this.handleShow.bind(this);  };

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
            thisClass: labels[labelTopics.deleteButton]
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , resultsTableLabels: labels[labelTopics.resultsTable]
          }
          , message: labels[labelTopics.messages].initial
          , somethingWeTrackIfChanged: get(this.state, "somethingWeTrackIfChanged", "" )
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleDismiss() {
    this.setState({ show: false });
  }

  handleDelete() {
    Server.restDelete(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , this.props.idLibrary
          , this.props.idTopic
          , this.props.idKey
          , this.handleDeleteCallback
      );
  }

  handleDeleteCallback = (result) => {
    this.setState({ show: false }, this.props.onDelete);
  };

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    if (this.state.show) {
      return (
          <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
            <h4>{this.state.labels.thisClass.danger}</h4>
            <p>{this.state.labels.thisClass.msg1}</p>
            <p>
              <Button
                  bsStyle="danger"
                  onClick={this.handleDelete}
              >{this.state.labels.thisClass.yesDelete}
              </Button>
              <span> or </span>
              <Button onClick={this.handleDismiss}>{this.state.labels.buttons.cancel}</Button>
            </p>
          </Alert>
      );
    }
    return <Button className="App App-Button App-Delete-Button" bsStyle="warning" onClick={this.handleShow}><Glyphicon  glyph={"trash"}/>{this.state.labels.buttons.delete}</Button>;
  }
};

DeleteButton.propTypes = {
  session: PropTypes.object.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , onDelete: PropTypes.func.isRequired
};

// set default values for props here
DeleteButton.defaultProps = {
  languageCode: "en"
};

export default DeleteButton;
