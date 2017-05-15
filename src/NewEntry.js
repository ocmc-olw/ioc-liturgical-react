import React, {PropTypes} from 'react';
import 'react-select/dist/react-select.css';
import ResourceSelector from './modules/ReactSelector'
import axios from 'axios';
import Labels from './Labels'
import Form from "react-jsonschema-form";
import IdManager from './helpers/IdManager';
import server from './helpers/Server';
import IdBuilder from './modules/IdBuilder';
import ParaRowTextEditor from './ParaRowTextEditor';
import WorkflowAssignment from './modules/WorkflowAssignment';
import { Button, Panel, Well } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';

export class NewEntry extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getComponentNewEntryLabels(this.props.languageCode)
        , search: Labels.getSearchLabels(this.props.languageCode)
        , paraRowEditor: Labels.getComponentParaTextEditorLabels(this.props.languageCode)
      }
      , idBuilt: false
      , message: Labels.getSearchLabels(this.props.languageCode).msg1
      , messageIcon: this.messageIcons.info
      , formSelected: false
      , selectedForm: ""
      , initialOntologyType: "Human"
      , isReferenceForm: false
      , isTranslationForm: false
      , translationDocType: "Liturgical"
      , IdLibrary: ""
      , LibraryReadOnly: false
      , IdTopic: ""
      , IdTopicValue: ""
      , IdTopicType: ""
      , IdTopicParts: {
        library: ""
        , topic: ""
        , key: ""
      }
      , IdKey: ""
      , IdKeyValue: ""
      , IdKeyType: ""
      , IdSeq: ""
      , selected: {
        schema: {}
        , uiSchema: {}
        , form: {}
        , path: server.getDbServerDocsApi()
      }
      , panel: {
        idBuilderOpen: true
        , paraTextOpen: false
        , formOpen: false
      }
      , translationValue: ""
      , userRolesForLibrary: {
        admins: []
        , authors: []
        , readers: []
        , reviewers: []
      }
      , statuses: []
      , workflowStatus: ""
      , workflowUser: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onFormPropertyChange = this.onFormPropertyChange.bind(this);
    this.handleFormSelection = this.handleFormSelection.bind(this);
    this.handleIdSelection = this.handleIdSelection.bind(this);
    this.handleIdLibrarySelection = this.handleIdLibrarySelection.bind(this);
    this.handleIdTopicSelection = this.handleIdTopicSelection.bind(this);
    this.toogleIdBuilderPanel = this.toogleIdBuilderPanel.bind(this);
    this.toogleParaTextPanel = this.toogleParaTextPanel.bind(this);
    this.handleParallelTextEditorCallback = this.handleParallelTextEditorCallback.bind(this);
    this.handleParallelTextEditorSubmit = this.handleParallelTextEditorSubmit.bind(this);
    this.handleWorkflowAssignmentCallback = this.handleWorkflowAssignmentCallback.bind(this);
    this.toogleFormPanel = this.toogleFormPanel.bind(this);
    this.setLibraryUserRoles = this.setLibraryUserRoles.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        thisClass: Labels.getComponentNewEntryLabels(nextProps.languageCode)
        , search: Labels.getSearchLabels(nextProps.languageCode)
        , paraRowEditor: Labels.getComponentParaTextEditorLabels(nextProps.languageCode)
      }
    });
  }

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  }


  handleWorkflowAssignmentCallback = (status, user) => {
    console.log(status);
    console.log(user);
    this.state.selected.form.assignedToUser = user;
    this.state.selected.form.status = status;
    this.setState({
      workflowStatus: status
      , workflowUser: user
    });
  }

  handleFormSelection = (selection) => {
    let theForm = this.props.forms[selection.value];

    theForm.assignedToUser = this.props.username;

    // If the form is for making a translation, we
    // we want to display a panel for a Parallel Row Text Editor.
    // So, we need to check if this is a translation, and
    // also determine whether it is biblical or liturgical.
    let theTranslationDocType = "Liturgical";
    let thisIsATranslationForm = false;
    if (selection.value.includes("Translation")) {
      thisIsATranslationForm = true;
      if (selection.value.includes("Biblical")) {
        theTranslationDocType = "Biblical";
      } else {
        theTranslationDocType = "Liturgical";
      }
    }
    let thisIsAReferenceForm = false;

    let thePath = server.getDbServerDocsApi(); // default to docs
    if (selection.value.startsWith("Link")) { // switch to links if need be
      thePath = server.getDbServerLinksApi();
      thisIsAReferenceForm = true;
    }


    let thisIsAnOntologyForm = theForm["partTypeOfKey"].includes("ONTOLOGY");
    let initialOntologyType = "Human";
    if (thisIsAnOntologyForm) {
        let parts = selection.label.split(" ");
        if (parts.length === 3) {
          initialOntologyType = parts[2];
        } else {
          initialOntologyType = selection.label;
        }
    }

    // the purpose of the next series of if states for the
    // library, topic, and key
    // is to either preserve or reset the initial id and value
    // used in the IdBuilder.
    let topicTypeChanged = (this.state.IdTopicType !==  theForm["partTypeOfTopic"]);
    let keyTypeChanged = (this.state.IdKeyType !==  theForm["partTypeOfKey"]);

    let idLibrary = theForm["library"];

    if (idLibrary === undefined || idLibrary.length < 1) {
      if (topicTypeChanged) {
        idLibrary = "";
      } else {
        idLibrary = this.state.IdLibrary;
      }
    }

    let idTopic = theForm["topic"];
    let idTopicValue = "";
    if (idTopic === undefined || idTopic.length < 1) {
      if (topicTypeChanged) {
        idTopic = "";
        idTopicValue = "";
      } else {
        idTopic = this.state.IdTopic;
        idTopicValue = this.state.IdTopicValue;
      }
    }
    let idKey = theForm["key"];
    let idKeyValue = "";

    if (idKey === undefined || idKey.length < 1) {
      if (thisIsAnOntologyForm) {
        idKey = "";
        idKeyValue = "";
      }
    }
    this.setState({
      selected: {
        schema: this.props.formsSchemas[selection.value].schema
        , uiSchema: this.props.formsSchemas[selection.value].uiSchema
        , form: theForm
        , path: thePath
      }
      , selectedForm: selection.value
      , initialOntologyType: initialOntologyType
      , isTranslationForm: thisIsATranslationForm
      , isReferenceForm: thisIsAReferenceForm
      , translationDocType: theTranslationDocType
      , formSelected: true
      , IdLibrary: idLibrary
      , IdTopic: idTopic
      , IdTopicType: theForm["partTypeOfTopic"]
      , IdTopicValue: idTopicValue
      , IdKey: theForm["key"]
      , IdKeyValue: idKeyValue
      , IdKeyType: theForm["partTypeOfKey"]
      , idBuilt: false
    });
    if (! this.state.panel.idBuilderOpen) {
      this.toogleIdBuilderPanel();
    }
  };

  /**
   * TODO:
   * add code to set the form users to those
   * for the role selected in the form.
   */
  setLibraryUserRoles = (restCallResult) => {
    console.log("setLibraryUserRoles");
    console.log(restCallResult);
    if (restCallResult) {
      this.setState({
        userRolesForLibrary: restCallResult.data.values[0]
        , statuses: restCallResult.data.values[1]
      });
    }
  }

  handleIdLibrarySelection = (library) => {
    this.setState({
      IdLibrary: library
    });
    // get the authorized admins, authors, readers, and reviewers for this library
    server.getDropdownUsersForLibrary(
        this.props.restServer
        , this.props.username
        , this.props.password
        , library
        , this.setLibraryUserRoles
    );
  }

  handleIdTopicSelection = (topic, value) => {
    this.setState({
      IdTopic: topic
      , IdTopicValue: value
    });
  }

  handleIdSelection = (
      IdLibrary
      , IdTopic
      , IdTopicValue
      , IdKey
      , IdKeyValue
      , seq
  ) => {
    let IdBuilt = (IdLibrary.length > 0 && IdTopic.length > 0 && IdKey.length > 0);
    let idSeq = "";
    if (seq) {
      idSeq = IdManager.replaceLibrary(seq, IdLibrary);
    }
    let idTopicParts = {};
    if (this.state.isReferenceForm) {
      let parts = IdManager.getParts(IdTopic);
      if (parts) {
        idTopicParts = {
          library: parts.library
          , topic: parts.topic
          , key: parts.key
        }
      }
    }
    this.setState({
      IdLibrary: IdLibrary
      , IdTopic: IdTopic
      , IdTopicValue: IdTopicValue
      , IdKey: IdKey
      , IdKeyValue: IdKeyValue
      , IdSeq: idSeq
      , idBuilt: IdBuilt
      , IdTopicParts: idTopicParts
    }
    );
    this.state.selected.form.library = IdLibrary;
    this.state.selected.form.topic = IdTopic;
    this.state.selected.form.key = IdKey;
    this.state.selected.form.id = IdLibrary+"~"+IdTopic+"~"+IdKey;
    this.state.selected.form.seq = idSeq;
    this.toogleIdBuilderPanel();
    if (this.state.isTranslationForm) {
      if (! this.state.panel.paraTextOpen) {
        this.toogleParaTextPanel();
      }
    } else if (this.state.isReferenceForm) {
      if (! this.state.panel.paraTextOpen) {
        this.toogleParaTextPanel();
      }
      if (! this.state.panel.formOpen) {
        this.toogleFormPanel();
      }
    } else {
      if (! this.state.panel.formOpen) {
        this.toogleFormPanel();
      }
    }
  };

  onFormPropertyChange = ({formData}) => {
    console.log(formData);
  }

  onSubmit = ({formData}) => {
    this.setState({
      message: this.state.labels.search.creating
      , messageIcon: this.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    let path = this.props.restServer
        + this.state.selected.path
    ;
    axios.post(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: this.state.labels.search.created,
          });
        })
        .catch( (error) => {
          var message = Labels.getHttpMessage(
              this.props.languageCode
              , error.response.status
              , error.response.statusText
          );
          var messageIcon = this.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }


  toogleIdBuilderPanel = () => {
    this.setState({
          panel: {
            idBuilderOpen: ! this.state.panel.idBuilderOpen
          }
        }
    );
  }

  toogleParaTextPanel = () => {
    this.setState({
          panel: {
            paraTextOpen: ! this.state.panel.paraTextOpen
          }
        }
    );
  }

  handleParallelTextEditorCallback = (value) => {
    this.setState({
      translationValue: value
    });
    this.state.selected.form.value = value;
  }

  handleParallelTextEditorSubmit = () => {
    this.onSubmit({
          formData: this.state.selected.form
        }
    );
  }

  toogleFormPanel = () => {
    this.setState({
          panel: {
            formOpen: ! this.state.panel.formOpen
          }
        }
    );
  }

  render () {
    return (
        <div className="App-new-entry">
          <Well>
          <ResourceSelector
              title={this.state.labels.thisClass.formSelector}
              initialValue={this.state.selectedForm}
              resources={this.props.formsDropdown}
              changeHandler={this.handleFormSelection}
              multiSelect={false}
          />
          </Well>
          {this.state.formSelected ?
              <Well>
                <Panel
                    header={this.state.labels.search.IdParts.title}
                    eventKey="id-parts-builder"
                    expanded={this.state.panel.idBuilderOpen}
                    onSelect={this.toogleIdBuilderPanel}
                    collapsible
                >
                <IdBuilder
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    libraries={this.props.domains["author"]}
                    IdLibrary={this.state.IdLibrary}
                    ontologyDropdowns={this.props.ontologyDropdowns}
                    biblicalBooksDropdown={this.props.biblicalBooksDropdown}
                    biblicalChaptersDropdown={this.props.biblicalChaptersDropdown}
                    biblicalVersesDropdown={this.props.biblicalVersesDropdown}
                    biblicalSubversesDropdown={this.props.biblicalSubversesDropdown}
                    IdTopic={this.state.IdTopic}
                    IdTopicValue={this.state.IdTopicValue}
                    IdTopicType={this.state.IdTopicType}
                    IdKey={this.state.IdKey}
                    IdKeyValue={this.state.IdKeyValue}
                    IdKeyType={this.state.IdKeyType}
                    handleLibraryChange={this.handleIdLibrarySelection}
                    handleTopicChange={this.handleIdTopicSelection}
                    handleSubmit={this.handleIdSelection}
                    languageCode={this.props.languageCode}
                    initialOntologyType={this.state.initialOntologyType}
                />
                </Panel>
              </Well>
              :
              <div></div>
          }
          {this.state.formSelected ?
              <Well>
                { this.state.idBuilt
                && (this.state.isTranslationForm || this.state.isReferenceForm)
                &&
                <Panel
                    header={this.state.labels.paraRowEditor.panelTitle}
                    eventKey="para-text-panel"
                    expanded={this.state.panel.paraTextOpen}
                    onSelect={this.toogleParaTextPanel}
                    collapsible
                >
                  <ParaRowTextEditor
                      restServer={this.props.restServer}
                      username={this.props.username}
                      password={this.props.password}
                      languageCode={this.props.languageCode}
                      docType={this.state.translationDocType}
                      idLibrary={this.state.IdLibrary}
                      idTopic={this.state.isReferenceForm ? this.state.IdTopicParts.topic : this.state.IdTopic}
                      idKey={this.state.isReferenceForm ? this.state.IdTopicParts.key : this.state.IdKey}
                      value={this.state.translationValue}
                      onSubmit={this.state.isReferenceForm ? undefined : this.handleParallelTextEditorSubmit}
                      onChange={this.state.isReferenceForm ? undefined : this.handleParallelTextEditorCallback}
                      message={this.state.isReferenceForm ? undefined : this.state.message}
                      messageIcon={this.state.isReferenceForm ? undefined : this.state.messageIcon}
                  />
                </Panel>
                }
              </Well>
              :
              <div></div>
          }
          {this.state.formSelected ?
              <Well>
                { this.state.idBuilt &&
                <Panel
                    header={this.state.labels.thisClass.panels.form}
                    eventKey="form-panel"
                    expanded={this.state.panel.formOpen}
                    onSelect={this.toogleFormPanel}
                    collapsible
                >
                <Form schema={this.state.selected.schema}
                      uiSchema={this.state.selected.uiSchema}
                      formData={this.state.selected.form}
                      onSubmit={this.onSubmit}
                      onChange={this.onFormPropertyChange}
                >
                  <div>
                    <Button
                        bsStyle="primary"
                        type="submit"
                    >{this.state.labels.search.submit}</Button>
                    <span className="App-message"><FontAwesome
                        name={this.state.messageIcon}/>
                      {this.state.message}
                    </span>
                  </div>
                </Form>
                </Panel>
                }
              </Well>
              :
              <div></div>
          }
        </div>
    )
  }
}

NewEntry.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , domains: React.PropTypes.object.isRequired
  , ontologyDropdowns: React.PropTypes.object.isRequired
  , formsDropdown: React.PropTypes.array.isRequired
  , formsSchemas: React.PropTypes.object.isRequired
  , forms: React.PropTypes.object.isRequired
  , biblicalBooksDropdown: React.PropTypes.array.isRequired
  , biblicalChaptersDropdown: React.PropTypes.array.isRequired
  , biblicalVersesDropdown: React.PropTypes.array.isRequired
  , biblicalSubversesDropdown: React.PropTypes.array.isRequired
  , changeHandler: React.PropTypes.func.isRequired
  , languageCode: React.PropTypes.string.isRequired
};

export default NewEntry;