import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import server from '../helpers/Server';
import {Button, ControlLabel, Well} from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import ResourceSelector from '../modules/ReactSelector'
import FontAwesome from 'react-fontawesome';

class WorkflowAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
    this.fetchData();
  }

  setTheState = (props) => {
    return (
        {
          labels: {
            thisClass: Labels.getWorkflowAssignmentLabels(this.props.session.languageCode)
            , messages: Labels.getMessageLabels(this.props.session.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.session.languageCode).initial
          , userRolesForDomain: {
            admins: []
            , authors: []
            , readers: []
            , reviewers: []
          }
          , userRolesIndex: ""
          ,statuses: []
          , selectedUser: ""
          , selectedStatus: ""
          , dropdownsLoaded: false
        }
    )
  }

  handleStatusChange = (item) => {

    let userIndex = "";

    switch(item.value) {
      case "EDITING":
        userIndex = "authors";
        break;
      case "READY_TO_EDIT":
        userIndex = "admins";
        break;
      case "READY_TO_FINALIZE":
        userIndex = "admins";
        break;
      case "READY_TO_REVIEW":
        userIndex = "admins";
        break;
      case "REVIEWING":
        userIndex = "reviewers";
        break;
      default:
    }

    this.setState({
      selectedStatus: item.value
      , selectedUser: ""
      , userRolesIndex: userIndex
    });
  }

  handleUserChange = (item) => {
    this.setState({selectedUser: item.value});
  }

  handleCallback = () => {
    this.props.callback(
        this.state.selectedStatus
        , this.state.selectedUser
    );
  }

  fetchData = () => {
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let path = this.props.session.restServer
        + server.getWsServerDropdownsForUserRolesForDomainApi()
        + "/"
        + this.props.library
    ;
    axios.get(path, config)
        .then(response => {
          this.setState({
                userRolesForDomain: response.data.values[0]
                , statuses: response.data.values[1].statuses
                , dropdownsLoaded: true
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "no docs found";
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });

  }

  render() {
        return (
            <div className="App-Workflow-Assignment">
              {this.state.dropdownsLoaded &&
              <Well>
                <ControlLabel>{this.state.labels.thisClass.title}</ControlLabel>
                <div>{this.state.labels.thisClass.instructions}</div>
                <ResourceSelector
                    title={this.state.labels.thisClass.status}
                    initialValue={this.state.selectedStatus}
                    resources={this.state.statuses}
                    changeHandler={this.handleStatusChange}
                    multiSelect={false}
                />
                {(this.state.userRolesIndex.length > 0) &&
                  <ResourceSelector
                      title={this.state.labels.thisClass.user[this.state.selectedStatus]}
                      initialValue={this.state.selectedUser}
                      resources={this.state.userRolesForDomain[this.state.userRolesIndex]}
                      changeHandler={this.handleUserChange}
                      multiSelect={false}
                  />
                }
                <div>
                  <Button
                      bsStyle="primary"
                      type="submit"
                      onClick={this.handleCallback}
                  >{this.state.labels.thisClass.submit}</Button>
                  <span className="App App-message"><FontAwesome
                      name={this.state.messageIcon}/>
                    {this.state.message}
                    </span>
                </div>
              </Well>
              }
            </div>
        )
  }
}

WorkflowAssignment.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , library: PropTypes.string.isRequired
};

WorkflowAssignment.defaultProps = {
};

export default WorkflowAssignment;
