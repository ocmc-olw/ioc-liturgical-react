import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import {Col, ControlLabel, Glyphicon, Grid, Row, Well } from 'react-bootstrap';
import MessageIcons from './MessageIcons';
import server from "./Server";

class WorkflowForm extends React.Component {
  constructor(props) {
    super(props);
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    let thisClassLabels = labels[labelTopics.WorkflowForm];
    this.state = {
      labels: {
        thisClass: thisClassLabels
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , library: props.library
      , selectedStatus: props.status
      , selectedStatusIcon: this.getStatusIcon(props.status)
      , selectedVisibility: props.visibility
      , selectedVisibilityIcon: this.getVisibilityIcon(props.visibility)
      , selectedUser: props.session.userInfo.username
      , workflow: {
        userRolesForLibrary: {
          admins: []
          , authors: []
          , readers: []
          , reviewers: []
        }
        , statusDropdown: [
          {value: "EDITING", label: thisClassLabels.statusTypesEdit}
          , {value: "REVIEWING", label: thisClassLabels.statusTypesReview}
          , {value: "FINALIZED", label: thisClassLabels.statusTypesFinal}
        ]
        , visibilityDropdown: [
          {value: "PERSONAL", label: thisClassLabels.visibilityTypesPersonal}
          , {value: "PRIVATE", label: thisClassLabels.visibilityTypesPrivate}
          , {value: "PUBLIC", label: thisClassLabels.visibilityTypesPublic}
        ]
        , isPublic: false
        , stateEnabled: false
        , workflowEnabled: false
        , defaultStatusAfterEdit: "FINALIZED"
        , defaultStatusAfterFinalization: "FINALIZED"
      }
    };

    this.getStatusIcon = this.getStatusIcon.bind(this);
    this.getVisibilityIcon = this.getVisibilityIcon.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    this.fetchData(undefined);
  };

  componentWillReceiveProps = (nextProps) => {
      let labels = nextProps.session.labels;
      let labelTopics = nextProps.session.labelTopics;
      let thisClassLabels = labels[labelTopics.WorkflowForm];
      let currentLibrary = this.state.library;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: thisClassLabels
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , resultsTableLabels: labels[labelTopics.resultsTable]
            , library: nextProps.library
          }
          , message: labels[labelTopics.messages].initial
          , selectedStatus: nextProps.status
          , selectedVisibility: nextProps.visibility
          , selectedStatusIcon: this.getStatusIcon(nextProps.status)
          , selectedVisibilityIcon: this.getVisibilityIcon(nextProps.visibility)
          , statusDropdown: [
            {value: "EDITING", label: thisClassLabels.statusTypesEdit}
            , {value: "REVIEWING", label: thisClassLabels.statusTypesReview}
            , {value: "FINALIZED", label: thisClassLabels.statusTypesFinal}
          ]
          , visibilityDropdown: [
            {value: "PERSONAL", label: thisClassLabels.visibilityTypesPersonal}
            , {value: "PRIVATE", label: thisClassLabels.visibilityTypesPrivate}
            , {value: "PUBLIC", label: thisClassLabels.visibilityTypesPublic}
          ]
        }
      }, function () { return this.fetchData(currentLibrary)});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  fetchData = (library) => {
    if (library && library === this.state.library) {
      // ignore.  No need to call the web service
    } else {
      let library = this.props.library;
      if (library === "" || library === " ") {
        library = this.props.session.userInfo.domain;
      }
      server.getDropdownUsersForLibrary(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , library
          , this.handleFetchCallback
      );
    }
  };


  // use these (below) in the handleFetchCallback if want dropdowns from the web service
// , statusDropdown: restCallResult.data.values[1].statusDropdown
// , visibilityDropdown: restCallResult.data.values[2].visibilityDropdown

  handleFetchCallback = (restCallResult) => {
    if (restCallResult
        && restCallResult.data.values
        && restCallResult.data.values.length > 0
    ) {
      let config = restCallResult.data.values[3].config;

      this.setState({
        workflow: {
          userRolesForLibrary: restCallResult.data.values[0]
          , isPublic: config.isPublic
          , stateEnabled: config.stateEnabled
          , workflowEnabled: config.workflowEnabled
          , defaultStatusAfterEdit: config.defaultStatusAfterEdit
          , defaultStatusAfterFinalization: config.defaultStatusAfterFinalization
          , statusDropdown: this.state.workflow.statusDropdown
          , visibilityDropdown: this.state.workflow.visibilityDropdown
        }
      });
    }
  };

  handleCallback = () => {
    this.props.callback(
        this.state.selectedVisibility
        , this.state.selectedStatus
        , this.state.selectedUser
    );
  };

  getStatusIcon = (status) => {
    let statusIcon = "edit";
    switch (status) {
      case ("EDITING"): {
        statusIcon = "edit";
        break;
      }
      case ("REVIEWING"): {
        statusIcon = "eye-open";
        break;
      }
      case ("FINALIZED"): {
        statusIcon = "check";
        break;
      }
      default: {
        let statusIcon = "edit";
      }
    }
    return statusIcon;
  };

  getVisibilityIcon = (visibility) => {
    let visibilityIcon = "lock";
    switch (visibility) {
      case ("PERSONAL"): {
        visibilityIcon = "lock"; // user-secret
        break;
      }
      case ("PRIVATE"): {
        visibilityIcon = "share-alt";
        break;
      }
      case ("PUBLIC"): {
        visibilityIcon = "globe";
        break;
      }
      default: {
        let visibilityIcon = "lock";
      }
    }
    return visibilityIcon;
  };

  handleStatusChange = (selection) => {
    let icon = "edit";
    let value = selection["value"];
    switch(value) {
      case ("EDITING"): {
        icon = "edit";
        break;
      }
      case ("REVIEWING"): {
        icon = "eye-open";
        break;
      }
      case ("FINALIZED"): {
        icon = "check";
        break;
      }
    }
    this.setState({
      selectedStatus: value
      , selectedStatusIcon: icon
    }, this.handleCallback);
  };

  handleVisibilityChange = (selection) => {
    let icon = "edit";
    let value = selection["value"];
    switch(value) {
      case ("PERSONAL"): {
        icon = "lock";
        break;
      }
      case ("PRIVATE"): {
        icon = "share-alt";
        break;
      }
      case ("PUBLIC"): {
        icon = "globe";
        break;
      }
    }
    this.setState({
      selectedVisibility: value
      , selectedVisibilityIcon: icon
    }, this.handleCallback);
  };

  handleUserChange = (selection) => {
    this.setState({
      selectedUser: selection["value"]
    }, this.handleCallback);
  };

  getUserRow = () => {
    if (this.props.assignable) {
      return (
          <Row  className="show-grid App App-Workflow-Selector-Row">
            <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
              <ControlLabel>Assigned To:</ControlLabel>
            </Col>
            <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
              <Select
                  name="App-Workflow-Selector-User"
                  className="App App-Workflow-Selector-User"
                  value={this.state.selectedUser}
                  options={this.state.workflow.userRolesForLibrary.readers}
                  onChange={this.handleUserChange}
                  multi={false}
                  autosize={true}
                  clearable
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  render() {
    return (
      <Well>
        <Grid>
        <Row  className="show-grid App App-Workflow-Selector-Row">
          <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
            <ControlLabel>
              <Glyphicon
                  className="App-Workflow-Selector-icon"
                  glyph={this.state.selectedStatusIcon}/>
              Status:
            </ControlLabel>
          </Col>
          <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
            <Select
                name="App-Workflow-Selector-Status"
                className="App App-Workflow-Selector-Status"
                value={this.state.selectedStatus}
                options={this.state.workflow.statusDropdown}
                onChange={this.handleStatusChange}
                multi={false}
                autosize={true}
                clearable
            />
          </Col>
        </Row>
          <Row  className="show-grid App App-Workflow-Selector-Row">
            <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
              <ControlLabel><FontAwesome  className="App-Workflow-Selector-icon"
                                          name={this.state.selectedVisibilityIcon}/>Visibility:
              </ControlLabel>
            </Col>
            <Col className="App-Workflow-Selector-Dropdown" xs={10} md={10}>
              <Select
                  name="App-Workflow-Selector-Visibility"
                  className="App App-Workflow-Selector-Visibility"
                  value={this.state.selectedVisibility}
                  options={this.state.workflow.visibilityDropdown}
                  onChange={this.handleVisibilityChange}
                  multi={false}
                  autosize={true}
                  clearable
              />
            </Col>
          </Row>
        </Grid>
      </Well>
    )
  }
};

WorkflowForm.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , library: PropTypes.string.isRequired
  , status: PropTypes.string
  , visibility: PropTypes.string
  , assignable: PropTypes.bool
};

// set default values for props here
WorkflowForm.defaultProps = {
  languageCode: "en"
  , status: "EDITING"
  , visibility: "PERSONAL"
  , assignable: false
};

export default WorkflowForm;
