import React from 'react';
import PropTypes from 'prop-types';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import IdManager from '../helpers/IdManager';
import Form from "react-jsonschema-form";
import {
  Alert
  , Button
  , ControlLabel
  , FormGroup
  , FormControl
  , HelpBlock
  , Row
  , Well
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import ResourceSelector from './ReactSelector';
import { get } from 'lodash';
import Server from './../helpers/Server';
import UiSchemas from "../classes/UiSchemas";

/**
 * This component provides a schema based form editor
 */
class GenericNewEntryForm extends React.Component {
  constructor(props) {
    super(props);

    let schemaTypes = [];
    if (props.schemaTypes) {
      schemaTypes = props.schemaTypes;
    } else {
      if (props.session && props.session.dropdowns) {
        schemaTypes = props.session.dropdowns.schemaEditorDropdown.filter(function(el) {
          return ! el.label.startsWith("Any ");
        });
      }
    }

    let userDomain = "";
    if (this.props.session
        && this.props.session.userInfo
        && this.props.session.userInfo.domain
    ) {
      userDomain = this.props.session.userInfo.domain;
    }

    let ontologyLibrary = {label: "en_sys_ontology", value: "en_sys_ontology"};

    let libraries = this.props.session.userInfo.domains.author;

    let thisClassLabels = Labels.getGenericNewEntryFormLabels(this.props.session.languageCode);

    let title = thisClassLabels.title;
    if (props.title) {
      title = props.title;
    }

    let uiSchemas = {};
    if (props.session && props.session.uiSchemas) {
      uiSchemas = new UiSchemas(
          props.session.uiSchemas.formsDropdown
          , props.session.uiSchemas.formsSchemas
          , props.session.uiSchemas.forms
      );
    }

    this.state = {
      labels: {
        thisClass: thisClassLabels
        , button: Labels.getButtonLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , search: Labels.getSearchLabels(this.props.session.languageCode)
        , title: title
      }
      , session: {
        uiSchemas: uiSchemas
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , schemaTypes: get(this.state, "schemaTypes", schemaTypes)
      , schema: {}
      , uiSchema: {}
      , formData: {}
      , showForm: false
      , newEntryType: ""
      , newEntryLibrary: userDomain
      , newEntryTopic: ""
      , newEntryKey: ""
      , idUnique: false
      , idMessage: ""
      , ontologyLibrary: ontologyLibrary
      , libraries: libraries
    };

    this.getBibTex = this.getBibTex.bind(this);
    this.getForm = this.getForm.bind(this);
    this.getSchemaSelector = this.getSchemaSelector.bind(this);
    this.getTopic = this.getTopic.bind(this);
    this.getValidationState = this.getValidationState.bind(this);
    this.handleSchemaTypeChange = this.handleSchemaTypeChange.bind(this);
    this.handleNewEntryLibraryChange = this.handleNewEntryLibraryChange.bind(this);
    this.handleNewEntryKeyChange = this.handleNewEntryKeyChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.verifyIdIsUnique = this.verifyIdIsUnique.bind(this);
    this.handleIdUniquenessCheckCallback = this.handleIdUniquenessCheckCallback.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {

    let schemaTypes = [];
    if (nextProps.schemaTypes) {
      schemaTypes = nextProps.schemaTypes;
    } else {
      if (nextProps.session && nextProps.session.dropdowns) {
        schemaTypes = nextProps.session.dropdowns.schemaEditorDropdown.filter(function(el) {
          return ! el.label.startsWith("Any ");
        });
      }
    }

    let libraries = nextProps.session.userInfo.domains.author;
    let thisClassLabels = Labels.getGenericNewEntryFormLabels(nextProps.session.languageCode);
    let title = thisClassLabels.title;
    if (nextProps.title) {
      title = nextProps.title;
    }

    let uiSchemas = {};
    if (nextProps.session && nextProps.session.uiSchemas) {
      uiSchemas = new UiSchemas(
          nextProps.session.uiSchemas.formsDropdown
          , nextProps.session.uiSchemas.formsSchemas
          , nextProps.session.uiSchemas.forms
      );
    }


    this.setState((prevState, props) => {
      return {
        labels: {
          thisClass: thisClassLabels
          , button: Labels.getButtonLabels(this.props.session.languageCode)
          , messages: Labels.getMessageLabels(nextProps.session.languageCode)
          , search: Labels.getSearchLabels(this.props.session.languageCode)
          , title: title
        }
        , session: {
          uiSchemas: uiSchemas
        }
        , message: Labels.getMessageLabels(props.session.languageCode).initial
        , schemaTypes: get(prevState, "schemaTypes", schemaTypes)
        , schema: get(prevState, "schema", "")
        , uiSchema: get(prevState, "uiSchema", {})
        , formData: get(prevState, "formData", {})
        , libraries: libraries
      }
    }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  /**
   * I am not using this because it turns ALL the fields
   * in the form to green or red, etc. and looks ugly.
   * Probably with CSS this can be controlled.
   * @returns {null}
   */
  getValidationState = () => {
    return null;
  };

  verifyIdIsUnique = () => {
      Server.getGenericExistsResult(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , this.state.newEntryLibrary
          , this.state.newEntryTopic
          , this.state.newEntryKey
          , this.handleIdUniquenessCheckCallback
      );
  };

  handleIdUniquenessCheckCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      this.setState({
            data: restCallResult.data
          }
      );
      let message = "";
      let idUnique = true;
      let showForm = true;
      let formData = this.state.formData;

      if (restCallResult.data.valueCount && restCallResult.data.valueCount > 0) {
        message = this.state.labels.thisClass.exists;
        idUnique = false;
        showForm = false;
      } else {
        formData.library = this.state.newEntryLibrary;
        formData.topic = this.state.newEntryTopic;
        formData.key = this.state.newEntryKey;
        formData.id = IdManager.toId(
            this.state.newEntryLibrary
          , this.state.newEntryTopic
          , this.state.newEntryKey
        );
      }
      this.setState({
            idMessage: message
            , idExists: idUnique
            , showForm: showForm
            , formData: formData
          }
      )
    }
  };

  onSubmit = ({formData}) => {
    this.setState({
      message: this.state.labels.search.creating
      , messageIcon: this.state.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer
        + this.props.path
    ;
    axios.post(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: this.state.labels.search.created,
            formData: formData
          });
          if (this.props.onSubmit) {
            this.props.onSubmit(formData);
          }
        })
        .catch( (error) => {
          var message = Labels.getHttpMessage(
              this.props.session.languageCode
              , error.response.status
              , error.response.statusText
          );
          var messageIcon = this.state.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  };

  getTopic = (selection) => {
    let label = selection["label"];
    let value = selection["value"];
    if (value.startsWith("BibEntry")) {
      return "biblioentry";
    } else if (value.startsWith("Abbreviation")) {
      return "abbreviation";
    } else if (label.includes("Ontology")) {
      if (value.endsWith("CreateForm:1.1")) {
        value = value.substring(0, value.length-14);
      } else if (value.endsWith(":1.1")) {
        value = value.substring(0, value.length-4);
      }
      return value;
    } else {
      return undefined;
    }
  };

  handleSchemaTypeChange = (selection) => {
    let type = selection["value"];
    let label = selection["label"];
    let topic = this.getTopic(selection);
    let schemaId = type;
    let schema = {};
    let uiSchema = {};
    let formData = {};
    let newEntryLibrary = this.state.newEntryLibrary;

    let libraries = this.props.session.userInfo.domains.author;

    if (label.includes("Ontology")) {
      libraries = libraries.filter(function(el) {
        return el.value === "en_sys_ontology";
      });
      newEntryLibrary = "en_sys_ontology";
    }
    let message = "";
    if (libraries.length === 0) {
      message = this.state.messages.notAuthorized;
    }
    if (type && this.props.session
        && this.state.session.uiSchemas
    ) {
      schema = this.state.session.uiSchemas.getSchema(schemaId);
      uiSchema = this.state.session.uiSchemas.getUiSchema(schemaId);
      formData = this.state.session.uiSchemas.getForm(schemaId);
    }
    this.setState({
      newEntryType: type
      , schema: schema
      , uiSchema: uiSchema
      , formData: formData
      , newEntryTopic: topic
      , showForm: false
      , libraries: libraries
      , newEntryLibrary: newEntryLibrary
      , message: message
    });
  };

  handleNewEntryKeyChange = (event) => {
    this.setState({
      newEntryKey: event.target.value
      , idMessage: ""
      , showForm: false
    });
  };

  handleNewEntryLibraryChange = (selection) => {
    if (selection && selection.value) {
      this.setState({
        newEntryLibrary: selection.value
        , showForm: false
      });
    }
  };

  getSchemaSelector = () => {
    if (this.props.session
    && this.props.session.userInfo
    && this.props.session.userInfo.domains
    && this.props.session.userInfo.domains.author
  ) {
      return (
          <div>
          <h3>{this.state.labels.title}</h3>
          <ControlLabel>{this.state.labels.thisClass.instructions}</ControlLabel>
            <Well>
              <form>
                <FormGroup
                    controlId="formBasicText"
                    validationState={this.getValidationState()}
                >
                  <Row className="App-Generic-Add-Options-Row">
                    <ControlLabel>{this.state.labels.thisClass.selectSchemaType}</ControlLabel>
                    <ResourceSelector
                        initialValue={this.state.newEntryType}
                        resources={this.state.schemaTypes}
                        changeHandler={this.handleSchemaTypeChange}
                        multiSelect={false}
                    />
                  </Row>
                  <Row className="App-Generic-Add-Options-Row">
                    <ControlLabel>{this.state.labels.thisClass.selectLibrary}</ControlLabel>
                    <ResourceSelector
                        initialValue={this.state.newEntryLibrary}
                        resources={this.state.libraries}
                        changeHandler={this.handleNewEntryLibraryChange}
                        multiSelect={false}
                    />
                  </Row>
                  <Row className="App-Generic-Add-Options-Row">
                  </Row>
                  <Row className="App-Generic-Add-Options-Row">
                        <ControlLabel>{this.state.labels.thisClass.enterKey}</ControlLabel>
                        <FormControl
                            className={"App App-Generic-Add-Key-text-input"}
                            type="text"
                            value={this.state.newEntryKey}
                            placeholder={"Key"}
                            onChange={this.handleNewEntryKeyChange}
                        />
                        <FormControl.Feedback />
                        <HelpBlock>{this.state.idMessage}</HelpBlock>
                  </Row>
                </FormGroup>
              </form>
              <Button
                  bsStyle="primary"
                  type="submit"
                  onClick={this.verifyIdIsUnique}
              >{this.state.labels.button.checkId}
              </Button>
            </Well>
          </div>
      );
    }
  };

  getBibTex = () => {
    if (this.state.newEntryType.startsWith("BibEntry")) {
      return (
          <div className="App-BibTex-Notice">
            {this.state.labels.thisClass.bibTex}
            <a href={"http://mirrors.ibiblio.org/CTAN/macros/latex/contrib/biblatex/doc/biblatex.pdf"} target="_blank"> {this.state.labels.thisClass.bibTexLink}</a>
          </div>
      );
    }
  };

  getForm = () => {
    if (this.state.schema) {
      return (
          <div>
          <Alert bsStyle="info">{this.state.labels.thisClass.formLengthWarning}{this.getBibTex()}</Alert>
          <Form schema={this.state.schema}
                uiSchema={this.state.uiSchema}
                formData={this.state.formData}
                onSubmit={this.onSubmit}
          >
            <div>
              <Button
                  bsStyle="primary"
                  type="submit"
              >{this.state.labels.button.submit}
              </Button>
              <span className="App App-message"><FontAwesome
                  name={this.state.messageIcon}/>
                {this.state.message}
              </span>
            </div>
          </Form>
          </div>
      );
    }
  };

  render() {
    return (
        <div className="App-New-Component-Template">
          {this.getSchemaSelector()}
          {this.state.showForm && this.getForm()}
        </div>
    )
  }
}

GenericNewEntryForm.propTypes = {
  session: PropTypes.object.isRequired
  , path: PropTypes.string.isRequired
  , onSubmit: PropTypes.func
  , schemaTypes: PropTypes.array
  , title: PropTypes.string
};

// set default values for props here
GenericNewEntryForm.defaultProps = {
  languageCode: "en"
};

export default GenericNewEntryForm;
