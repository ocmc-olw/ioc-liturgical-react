import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {Col, ControlLabel, Grid, Row, Well } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from './MessageIcons';
import server from "./Server";

class WorkflowForm extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getWorkflowFormLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , library: props.library
      , selectedStatus: "EDITING"
      , selectedVisibility: "PERSONAL"
      , selectedUser: props.session.userInfo.username
      , workflow: {
        userRolesForLibrary: {
          admins: []
          , authors: []
          , readers: []
          , reviewers: []
        }
        , statusDropdown: []
        , visibilityDropdown: []
        , isPublic: false
        , stateEnabled: false
        , workflowEnabled: false
        , defaultStatusAfterEdit: "FINALIZED"
        , defaultStatusAfterFinalization: "FINALIZED"
      }
    };

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
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      let currentLibrary = this.state.library;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getWorkflowFormLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
            , library: props.library
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.fetchData(currentLibrary)});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  fetchData = (library) => {
    if (library && library === this.state.library) {
      // ignore.  No need to call the web service
    } else {
      server.getDropdownUsersForLibrary(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , this.props.library
          , this.handleFetchCallback
      );
    }
  };

  handleFetchCallback = (restCallResult) => {
    if (restCallResult
        && restCallResult.data.values
        && restCallResult.data.values.length > 0
    ) {
      let config = restCallResult.data.values[3].config;

      this.setState({
        workflow: {
          userRolesForLibrary: restCallResult.data.values[0]
          , statusDropdown: restCallResult.data.values[1].statusDropdown
          , visibilityDropdown: restCallResult.data.values[2].visibilityDropdown
          , isPublic: config.isPublic
          , stateEnabled: config.stateEnabled
          , workflowEnabled: config.workflowEnabled
          , defaultStatusAfterEdit: config.defaultStatusAfterEdit
          , defaultStatusAfterFinalization: config.defaultStatusAfterFinalization
        }
      });
    }
  }


  handleCallback = () => {
    this.props.callback(
        this.state.selectedVisibility
        , this.state.selectedStatus
        , this.state.selectedUser
    );
  };

  handleStatusChange = (selection) => {
    this.setState({
      selectedStatus: selection["value"]
    }, this.handleCallback);
  };

  handleVisibilityChange = (selection) => {
    this.setState({
      selectedVisibility: selection["value"]
    }, this.handleCallback);
  };

  handleUserChange = (selection) => {
    this.setState({
      selectedUser: selection["value"]
    }, this.handleCallback);
  };

  render() {
    return (
      <Well>
        <Grid>
          <Row  className="show-grid App App-Workflow-Selector-Row">
            <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
              <ControlLabel>Visibility:</ControlLabel>
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
        <Row  className="show-grid App App-Workflow-Selector-Row">
          <Col className="App App-Workflow-Selector-Label" xs={2} md={2}>
            <ControlLabel>Status:</ControlLabel>
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
        </Grid>
      </Well>
    )
  }
};

WorkflowForm.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , library: PropTypes.string.isRequired
};

// set default values for props here
WorkflowForm.defaultProps = {
  languageCode: "en"
};

export default WorkflowForm;
