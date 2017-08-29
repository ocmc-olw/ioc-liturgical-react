import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import IdManager from './helpers/IdManager';
import server from './helpers/Server';
import Button from './helpers/Button';
import Labels from './Labels';
import Spinner from './helpers/Spinner';
import MessageIcons from './helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';
import {Col, Grid, Row, Well} from 'react-bootstrap';
import ResourceSelector from './modules/ReactSelector';
import Form from "react-jsonschema-form";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class Administrator extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);

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
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

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

    return (
        {
          labels: {
            thisClass: Labels.getAgesEditorLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
            , liturgicalAcronyms: Labels.getLiturgicalAcronymsLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , action: action
          , path: path
          , item: item
          , itemSelected: itemSelected
          , resources: resources
          , submitButtonHidden: submitButtonHidden
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
  }


  setMessage(message) {
    this.setState({
      message: message
    });
  }

  setPath(newPath, updateMessage) {
    var path = (newPath.value ? newPath.value : newPath);
    this.setState({
      path: path
      , centerDivVisible: false
      , submitIsAPost: path.includes("new/forms")
    });
    this.fetchData(path, updateMessage);
  }

  setItemDetails(id, uiSchema, schema, value) {
    var hidden = false;
    if (uiSchema["ui:readonly"]) {
      hidden = true;
    }
    this.setState({
      item: { id: id, uiSchema: uiSchema, schema: schema, value: value}
      , itemSelected: true
      , submitButtonHidden: hidden
      , centerDivVisible: true
    });
  }

  handleRowSelect = (row, isSelected, e) => {
    this.setItemDetails(
        row._id, this.state.data.valueSchemas[row._valueSchemaId].uiSchema
        , this.state.data.valueSchemas[row._valueSchemaId].schema
        , row.value
    );
  }

  fetchData(path, updateMessage) {
    var config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    axios.get(
        this.props.restServer
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


  handlePost(formData) {
    var config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    axios.post(
        this.props.restServer
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
        username: this.props.username
        , password: this.props.password
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
        this.props.restServer
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
        username: this.props.username
        , password: this.props.password
      }
    };

    axios.get(
        this.props.restServer
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
  }

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
  }
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
                      <div><Button label="Submit" hidden={this.state.submitButtonHidden}/></div>
                    </Form>
                  </Well>
                </div>
                }
              </Col>
              <Col sm={0} md={0}></Col>
            </Row>
          </Grid>
      )
  }
  getAdminContent = () => {
    if (this.state.resources) {
      return (
          <div className="App-administrator">
            <Grid>
              <Row className="show-grid">
                <Col sm={3} md={3}>
                </Col>
                <Col sm={6} md={6}>
                  <div className="App-message"><FontAwesome name={this.state.messageIcon} />{this.state.message}</div>
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
  }

  render() {
    return (
        <div>
        {this.getAdminContent()}
        </div>
    )
  }

}

Administrator.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , domains: PropTypes.object.isRequired
};

Administrator.defaultProps = {
};

export default Administrator;