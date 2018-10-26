import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import IdManager from './helpers/IdManager';
import server from './helpers/Server';
import Button from './helpers/Button';
import Spinner from './helpers/Spinner';
import MessageIcons from './helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';
import {Col, Grid, Row, Well} from 'react-bootstrap';
import ResourceSelector from './modules/ReactSelector';
import Form from "react-jsonschema-form";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import User from "./classes/User";

class Administrator extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);

    this.handleDelete = this.handleDelete.bind(this);
    this.setPath = this.setPath.bind(this);
    this.setItemDetails = this.setItemDetails.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.getAdminGrid = this.getAdminGrid.bind(this);
    this.getResources = this.getResources.bind(this);
    this.getResourceItems = this.getResourceItems.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getAdminContent = this.getAdminContent.bind(this);
  }

  componentWillMount = () => {
    this.getResources();
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  };

  setTheState = (props, currentState) => {
    let action = 'GET';
    let path = 'users/statistics';
    let item = {id: "", uiSchema: {}, schema: {}, value: {}};
    let itemSelected = false;
    let resources = [];
    let submitButtonHidden = false;
    let centerDivVisible = false;
    let submitIsAPost = false;
    if (currentState) {
      if (currentState.action &&  currentState.action !== action) {
        action = currentState.action;
      }
      if (currentState.path && currentState.path !== path) {
        path = currentState.path;
      }
      if (currentState.item && currentState.item.id.length >0) {
        currentState.item = item;
      }
      if (currentState.itemSelected) {
        itemSelected = currentState.itemSelected;
      }
      if (currentState.resources && currentState.resources.length > 0) {
        resources = currentState.resources;
      }
      if (currentState.submitButtonHidden) {
        submitButtonHidden = currentState.submitButtonHidden;
      }
      if (currentState.centerDivVisible) {
        centerDivVisible = currentState.centerDivVisible;
      }
      if (currentState.submitIsAPost) {
        submitIsAPost = currentState.submitIsAPost;
      }
    }

    let userInfo = {};
    if (props.session && props.session.userInfo) {
      userInfo = new User(
          props.session.userInfo.username
          , props.session.userInfo.password
          , props.session.userInfo.domain
          , props.session.userInfo.email
          , props.session.userInfo.firstname
          , props.session.userInfo.lastname
          , props.session.userInfo.title
          , props.session.userInfo.authenticated
          , props.session.userInfo.domains
      );
    }

    return (
        {
          labels: {
            thisClass: props.session.labels[props.session.labelTopics.AgesEditor]
            , messages: props.session.labels[props.session.labelTopics.messages]
            , liturgicalAcronyms: props.session.labels[props.session.labelTopics.liturgicalAcronyms]
          }
          , session: {
            userInfo: userInfo
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: props.session.labels[props.session.labelTopics.messages].initial
          , action: action
          , path: path
          , item: item
          , itemSelected: itemSelected
          , resources: resources
          , submitButtonHidden: submitButtonHidden
          , deleteButtonVisible: get(currentState,"deleteButtonVisible", true)
          , centerDivVisible: centerDivVisible
          , submitIsAPost: submitIsAPost
          , options: {
            sizePerPage: 10
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          , selectRow: {
            mode: 'radio'
            , clickToSelect: true
            , onSelect: this.handleRowSelect
            , hideSelectColumn: true
        }
      }
    )
  };


  setMessage(message) {
    this.setState({
      message: message
    });
  }

  setPath(newPath, updateMessage) {
    if (newPath) {
      var path = (newPath.value ? newPath.value : newPath);
      this.setState({
        path: path
        , centerDivVisible: false
        , submitIsAPost: path.includes("new/forms")
      }, this.fetchData(path, updateMessage));
      ;
    }
  }

  setItemDetails(id, uiSchema, schema, value) {
    let hidden = false;
    let deleteVisible = ! id.includes("~new~");
    if (uiSchema["ui:readonly"]) {
      hidden = true;
    }
    this.setState({
      item: { id: id, uiSchema: uiSchema, schema: schema, value: value}
      , itemSelected: true
      , submitButtonHidden: hidden
      , deleteButtonVisible: deleteVisible
      , centerDivVisible: true
    });
  }

  handleRowSelect = (row, isSelected, e) => {
    this.setItemDetails(
        row._id, this.state.data.valueSchemas[row._valueSchemaId].uiSchema
        , this.state.data.valueSchemas[row._valueSchemaId].schema
        , row.value
    );
  };

  fetchData(path, updateMessage) {
    var config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };
    axios.get(
        this.props.session.restServer
        + server.getWsServerAdminApi()
        + path
        , config
    )
        .then(response => {
          this.setState( {
                data: response.data
              }
          );
          if (updateMessage) {
            this.setState( {
                  message: "found " + (response.data.valueCount ? response.data.valueCount : "") + " docs for " + IdManager.padPath(path)
                  , messageIcon: this.state.messageIcons.info
                }
            );
          }
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = this.state.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "no docs found";
            messageIcon = this.state.messageIcons.warning;
          }
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }
// /delete/user
  handleDelete() {
    let config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };
    axios.delete(
        this.props.session.restServer
        + server.getWsServerAdminApi()
        + IdManager.idToPath(this.state.item.id)
        , config
    )
    .then(response => {
      this.setState({
        message: "deleted " + IdManager.idToPaddedPath(this.state.item.id)
      });
      this.setPath(this.state.path);
      this.setState({centerDivVisible: true, submitIsDelete: false});
    })
    .catch( (error) => {
      var message = error.response.data.userMessage;
      var messageIcon = this.state.messageIcons.error;
      this.setState( { data: message, message: message, messageIcon: messageIcon });
    });
  }

  handlePost(formData) {
    var config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };
    axios.post(
        this.props.session.restServer
        + server.getWsServerAdminApi()
        + IdManager.idToPath(this.state.item.id)
        , formData.formData
        , config
    )
        .then(response => {
          this.setState({
            message: "updated " + IdManager.idToPaddedPath(this.state.item.id),
            item: { id: this.state.item.id, uiSchema: this.state.item.uiSchema, schema: this.state.item.schema, value: formData.formData}
          });
          this.setPath(this.state.path);
          this.setState({centerDivVisible: true});
        })
        .catch( (error) => {
          var message = error.response.data.userMessage;
          var messageIcon = this.state.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }

  handlePut(formData) {
    var config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };
    let path = IdManager.idToPath(this.state.item.id);
    let message = "";
    if (path.startsWith("misc/utilities")) {
      this.setState({
        message: "This will take a few minutes"
      });
    }
    axios.put(
        this.props.session.restServer
        + server.getWsServerAdminApi()
        + path
        , formData.formData
        , config
    )
        .then(response => {
          message = "updated " + path;
          if (path.startsWith("misc/utilities")) {
            message = path + ": " + response.data.userMessage;
          }
          if (formData.formData && formData.formData.password) {
            if (formData.formData.username === this.props.session.userInfo.username) {
              this.state.session.userInfo.password = formData.formData.password;
            }
          }
          this.setState({
            message: message
            , item: {
              id: this.state.item.id
              , uiSchema: this.state.item.uiSchema
              , schema: this.state.item.schema
              , value: formData.formData
            }
          });
          this.setPath(this.state.path);
          this.setState({centerDivVisible: true});
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = this.state.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }

  onSubmit(formData) {
    if (this.state.submitIsAPost) {
      this.handlePost(formData);
    } else {
      this.handlePut(formData);
    }
  }

  getResources = () => {
    var config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };

    axios.get(
        this.props.session.restServer
        + server.getWsServerAdminApi()
        + "resources"
        , config
    )
        .then(response => {
          this.setState({
            resources: response.data.resources
          }, this.fetchData("users/statistics", true)
        );
        })
        .catch( (error) => {
          this.setState({
            resources: []
          });
        });
  };

  getResourceItems = () => {
    if (this.state.data) {
      if (this.state.data === 'no docs found') {
        return ("")
      } else {
        return (
            <div>
              <Well>
                <div className="control-label">Select an item...</div>
                <BootstrapTable
                    data={this.state.data.values}
                    trClassName={"App-data-tr"}
                    striped
                    hover
                    pagination
                    options={ this.state.options }
                    selectRow={this.state.selectRow}
                    search
                >
                  <TableHeaderColumn
                      isKey
                      dataField='_id'
                      dataSort={ true }
                  >ID</TableHeaderColumn>
                </BootstrapTable>
              </Well>
            </div>
        )
      }
    } else {
      return (
          ""
      )
    }
  };
  getAdminGrid = () => {
      return (
          <Grid>
            <Row className="show-grid">
              <Col sm={5} md={5}>
                <Well>
                  <ResourceSelector
                      initialValue={this.state.path}
                      resources={this.state.resources}
                      changeHandler={this.setPath}
                      multiSelect={false}
                      title="Select a resource:"
                  />
                </Well>
                {this.getResourceItems()}
              </Col>
              <Col sm={7} md={7}>
                {this.state.itemSelected && this.state.centerDivVisible &&
                <div className="App-form-container">
                  <Well>
                    <h3>ID: {IdManager.idToPaddedPath(this.state.item.id)}</h3>
                    <Form
                        schema={this.state.item.schema}
                        uiSchema={this.state.item.uiSchema}
                        formData={this.state.item.value}
                        onSubmit={this.onSubmit}>
                      <div>
                        <Button label="Submit" hidden={this.state.submitButtonHidden}/>
                        {this.state.deleteButtonVisible &&
                        <button
                            type="button"
                            className="App-Form-Delete-Button"
                            onClick={this.handleDelete}
                        >Delete
                        </button>
                        }
                      </div>
                    </Form>
                  </Well>
                </div>
                }
              </Col>
              <Col sm={0} md={0}></Col>
            </Row>
          </Grid>
      )
  };
  getAdminContent = () => {
    if (this.state.resources) {
      return (
          <div className="App-administrator">
            <Grid>
              <Row className="show-grid">
                <Col sm={3} md={3}>
                </Col>
                <Col sm={6} md={6}>
                  <div className="App App-message"><FontAwesome name={this.state.messageIcon} />{this.state.message}</div>
                </Col>
                <Col sm={3} md={3}></Col>
              </Row>
            </Grid>
            {this.getAdminGrid()}
          </div>
      );
    } else {
      return (
          <div className="App-administrator">
            <Spinner message={this.state.labels.messages.retrieving}/>
          </div>
      );
    }
  };

  render() {
    return (
        <div>
          <div>{this.getAdminContent()}</div>
        </div>
    )
  }

}

Administrator.propTypes = {
  session: PropTypes.object.isRequired
};

Administrator.defaultProps = {
};

export default Administrator;
