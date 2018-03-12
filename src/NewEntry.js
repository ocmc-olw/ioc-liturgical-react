import React from 'react';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';
import ResourceSelector from './modules/ReactSelector'
import Labels from './Labels'
import TemplateNodeInitializer from './classes/TemplateNodeInitializer';
import IdManager from './helpers/IdManager';
import server from './helpers/Server';
import IdBuilder from './modules/IdBuilder';
import NewEntryForm from './modules/NewEntryForm';
import ParaRowTextEditor from './ParaRowTextEditor';
import { Panel, Well } from 'react-bootstrap'

/**
 * This allows addition of a new entry. The forms are only 'pure ontology'
 * and are hard coded. They should use the web service dropdown
 * this.props.session.uiSchemas.formsDropdown
 */
export class NewEntry extends React.Component {

  constructor(props) {
    super(props);

    const formsDropdown = [
      {label: "Animal", value: "AnimalCreateForm:1.1"}
      ,{label: "Being", value: "BeingCreateForm:1.1"}
//      ,{label: "Biblical Text (Source)", value: "TextBiblicalSourceCreateForm:1.1"}
//      ,{label: "Biblical Text (Translation)", value: "TextBiblicalTranslationCreateForm:1.1"}
      ,{label: "Concept", value: "ConceptCreateForm:1.1"}
//      ,{label: "Concordance Line", value: "ConcordanceLine:1.1"}
      ,{label: "Event", value: "EventCreateForm:1.1"}
      ,{label: "Group", value: "GroupCreateForm:1.1"}
      ,{label: "Human", value: "HumanCreateForm:1.1"}
 //     ,{label: "Liturgical Text (Source)", value: "TextLiturgicalSourceCreateForm:1.1"}
//      ,{label: "Liturgical Text (Translation)", value: "TextLiturgicalTranslationCreateForm:1.1"}
      ,{label: "Mystery", value: "MysteryCreateForm:1.1"}
      ,{label: "Object", value: "ObjectCreateForm:1.1"}
      ,{label: "Place", value: "PlaceCreateForm:1.1"}
      ,{label: "Plant", value: "PlantCreateForm:1.1"}
//      ,{label: "Reference to Animal", value: "LinkRefersToAnimalCreateForm:1.1"}
//      ,{label: "Reference to Being", value: "LinkRefersToBeingCreateForm:1.1"}
//      ,{label: "Reference to Biblical Text", value: "LinkRefersToBiblicalTextCreateForm:1.1"}
//      ,{label: "Reference to Concept", value: "LinkRefersToConceptCreateForm:1.1"}
//      ,{label: "Reference to Event", value: "LinkRefersToEventCreateForm:1.1"}
//      ,{label: "Reference to God", value: "LinkRefersToGodCreateForm:1.1"}
//      ,{label: "Reference to Group", value: "LinkRefersToGroupCreateForm:1.1"}
//      ,{label: "Reference to Human", value: "LinkRefersToHumanCreateForm:1.1"}
//      ,{label: "Reference to Mystery", value: "LinkRefersToMysteryCreateForm:1.1"}
//      ,{label: "Reference to Object", value: "LinkRefersToObjectCreateForm:1.1"}
//      ,{label: "Reference to Place", value: "LinkRefersToPlaceCreateForm:1.1"}
//      ,{label: "Reference to Plant", value: "LinkRefersToPlantCreateForm:1.1"}
//      ,{label: "Reference to Role", value: "LinkRefersToRoleCreateForm:1.1"}
      ,{label: "Role", value: "RoleCreateForm:1.1"}
//      ,{label: "Section", value: "Section:1.1"}
//      ,{label: "Template", value: "Template:1.1"}
//      ,{label: "Text Note ", value: "TextualNote:1.1"}
//      ,{label: "Tree Node", value: "TokenAnalysisCreateForm:1.1"}
//      ,{label: "User Note (Private)", value: "UserNoteCreateForm:1.1"}
//      ,{label: "Word Analysis", value: "WordAnalysis:1.1"}
    ];

    this.state = {
      labels: {
        thisClass: Labels.getComponentNewEntryLabels(this.props.session.languageCode)
        , search: Labels.getSearchLabels(this.props.session.languageCode)
        , paraRowEditor: Labels.getComponentParaTextEditorLabels(this.props.session.languageCode)
      }
      , formsDropdown: formsDropdown
      , idBuilt: false
      , message: Labels.getSearchLabels(this.props.session.languageCode).msg1
      , messageIcon: this.messageIcons.info
      , formSelected: false
      , selectedForm: ""
      , initialOntologyType: "Human"
      , isUserNoteForm: false
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
      , workflow: {
        userRolesForLibrary: {
          admins: []
          , authors: []
          , readers: []
          , reviewers: []
        }
        , statusDropdown: []
        , isPublic: false
        , stateEnabled: false
        , workflowEnabled: false
        , defaultStatusAfterEdit: "FINALIZED"
        , defaultStatusAfterFinalization: "FINALIZED"
      }
    };
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
    this.setLibraryWorkflowInfo = this.setLibraryWorkflowInfo.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        thisClass: Labels.getComponentNewEntryLabels(nextProps.session.languageCode)
        , search: Labels.getSearchLabels(nextProps.session.languageCode)
        , paraRowEditor: Labels.getComponentParaTextEditorLabels(nextProps.session.languageCode)
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
  };


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
      case "READY_TO_RELEASE":
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

  handleWorkflowAssignmentCallback = (status, user) => {
    this.state.selected.form.assignedToUser = user;
    this.state.selected.form.status = status;
    this.setState({
      workflowStatus: status
      , workflowUser: user
    });
  }

  handleFormSelection = (selection) => {
    let theForm = this.props.session.uiSchemas.getForm(selection.value);

    theForm.assignedToUser = this.props.session.userInfo.username;

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
    let isTemplateForm = selection.value.includes("Template");
    let thisIsAReferenceForm = false;
    if (selection.value.startsWith("Link")) { // switch to links if need be
      thisIsAReferenceForm = true;
    }
    let isUserNoteForm = theForm["partTypeOfKey"].includes("TIMESTAMP");
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

    // the purpose of the next series of if statements for the
    // library, topic, and key
    // is to either preserve or reset the initial id and value
    // used in the IdBuilder.
    let topicTypeChanged = (this.state.IdTopicType !==  theForm["partTypeOfTopic"]);
    let keyTypeChanged = (this.state.IdKeyType !==  theForm["partTypeOfKey"]);

    let idLibrary = theForm["library"];
    if (isUserNoteForm) {
      idLibrary = this.props.session.userInfo.domain;
    } else {
      if (idLibrary === undefined || idLibrary.length < 6) {
        if (topicTypeChanged) {
          idLibrary = "";
        } else {
          if (idLibrary !== this.state.IdLibrary) {
            // try to avoid calling the rest server if we did it
            // last form change
            idLibrary = this.state.IdLibrary;
          }
        }
      } else {
        // try to avoid calling the rest server if we did it
        // last form change
        server.getDropdownUsersForLibrary(
            this.props.session.restServer
            , this.props.session.userInfo.username
            , this.props.session.userInfo.password
            , idLibrary
            , this.setLibraryWorkflowInfo
        );
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
    if (isUserNoteForm) {
      let date = new Date();
      let month = (date.getMonth()+1).toString().padStart(2,"0");
      let day = date.getDate().toString().padStart(2,"0");
      let hour = date.getHours().toString().padStart(2,"0");
      let minute = date.getMinutes().toString().padStart(2,"0");
      let second = date.getSeconds().toString().padStart(2,"0");
      idKey = date.getFullYear()
          + "."
          + month
          + "."
          + day
          + ".T"
          + hour
          + "."
          + minute
          + "."
          + second
      ;
      idKeyValue = idKey;
    } else {
      if (idKey === undefined || idKey.length < 1) {
        if (keyTypeChanged) {
          idKey = "";
          idKeyValue = "";
        } else {
          idKey = this.state.IdKey;
          idKeyValue = this.state.IdKeyValue;
        }
      }
    }
    this.setState({
      selected: {
        schema: this.props.session.uiSchemas.getSchema(selection.value)
        , uiSchema: this.props.session.uiSchemas.getUiSchema(selection.value)
        , form: theForm
        , path: this.props.session.uiSchemas.getHttpPostPathForSchema(selection.value)
      }
      , selectedForm: selection.value
      , initialOntologyType: initialOntologyType
      , isUserNoteForm: isUserNoteForm
      , isTranslationForm: thisIsATranslationForm
      , isReferenceForm: thisIsAReferenceForm
      , isTemplateForm: isTemplateForm
      , translationDocType: theTranslationDocType
      , formSelected: true
      , IdLibrary: idLibrary
      , IdTopic: idTopic
      , IdTopicType: theForm["partTypeOfTopic"]
      , IdTopicValue: idTopicValue
      , IdKey: idKey
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
  setLibraryWorkflowInfo = (restCallResult) => {
    if (restCallResult
        && restCallResult.data.values
        && restCallResult.data.values.length > 0
    ) {
      let config = restCallResult.data.values[3].config;
      let isPublic = true;
      if (config.isPublic) {
        isPublic = config.isPublic;
      }

      this.setState({
        workflow: {
          userRolesForLibrary: restCallResult.data.values[0]
          , statusDropdown: restCallResult.data.values[1].statusDropdown
          , isPublic: isPublic
          , stateEnabled: config.stateEnabled
          , workflowEnabled: config.workflowEnabled
          , defaultStatusAfterEdit: config.defaultStatusAfterEdit
          , defaultStatusAfterFinalization: config.defaultStatusAfterFinalization
        }
      });
    }
  };

  handleIdLibrarySelection = (library) => {
    if (library) {
      this.setState({
        IdLibrary: library
      });

      // get the authorized admins, authors, readers, and reviewers for this library
      server.getDropdownUsersForLibrary(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , library
          , this.setLibraryWorkflowInfo
      );
    }
  };

  handleIdTopicSelection = (topic, value) => {
    this.setState({
      IdTopic: topic
      , IdTopicValue: value
    });
  };

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
    } else if (this.state.isUserNoteForm) {
      idSeq = IdManager.toId(IdLibrary, IdTopic, IdKey);
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

    if (this.state.isTemplateForm) {
      let nodeBuilder = new TemplateNodeInitializer(
        IdLibrary
        , IdTopic
        , IdKey
        , "SERVICE"
        , "WHEN_DAY_NAME_IS"
      );
      let node = nodeBuilder.getRootNode();
        // {
        //   title: "TEMPLATE"
        //   , subtitle: IdLibrary + "~" + IdTopic + "~head"
        //   , expanded: true
        //   , children: [
        //     {
        //       title: "SECTION"
        //       , subtitle: "section01"
        //       , children: []
        //     }
        //   ]
        // };
      this.state.selected.form.node = JSON.stringify(node);
    }

    this.state.selected.form.library = IdLibrary;
    this.state.selected.form.topic = IdTopic;
    this.state.selected.form.key = IdKey;
    this.state.selected.form.id = IdLibrary+"~"+IdTopic+"~"+IdKey;
    this.state.selected.form.seq = idSeq;
    this.state.selected.form.status = this.state.workflow.defaultStatusAfterEdit;

    if (this.state.workflow && this.state.workflow.workflowEnabled) {
      this.state.selected.form.assignedToUser = this.state.workflow.userRolesForLibrary[this.state.userRolesIndex];
    } else {
      this.state.selected.form.assignedToUser = "";
    }
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

  // placeholder in case want to do something with the formData
  onSubmit = ({formData}) => {
    this.setState({
      formData: formData
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
  };

  // in the ResourceSelector, use this to get all forms:
  //               resources={this.props.session.uiSchemas.formsDropdown}

  render () {

    return (
        <div className="App-new-entry">
          <Well>
          <ResourceSelector
              title={this.state.labels.thisClass.formSelector}
              initialValue={this.state.selectedForm}
              resources={this.state.formsDropdown}
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
                    session={this.props.session}
                    IdLibrary={this.state.IdLibrary}
                    IdTopic={this.state.IdTopic}
                    IdTopicValue={this.state.IdTopicValue}
                    IdTopicType={this.state.IdTopicType}
                    IdKey={this.state.IdKey}
                    IdKeyValue={this.state.IdKeyValue}
                    IdKeyType={this.state.IdKeyType}
                    handleLibraryChange={this.handleIdLibrarySelection}
                    handleTopicChange={this.handleIdTopicSelection}
                    handleSubmit={this.handleIdSelection}
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
                      session={this.props.session}
                      canChange={false}
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
                  {
                    this.state.IdTopicValue &&
                    <Well>
                      <div>{this.state.IdTopicValue}<span className={"control-label"}> ({this.state.IdTopic})</span></div>
                    </Well>
                  }
                  {
                    this.state.IdKeyValue &&
                    <Well>
                      <div>{this.state.IdKeyValue}<span className={"control-label"}> ({this.state.IdKey})</span></div>
                    </Well>
                  }
                  <NewEntryForm
                      session={this.props.session}
                    path={this.state.selected.path}
                    schema={this.state.selected.schema}
                    uiSchema={this.state.selected.uiSchema}
                    formData={this.state.selected.form}
                    onSubmit={this.onSubmit}
                  />
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

/**
 , forms: PropTypes.object.isRequired

 * @type {{restServer: *, userInfo: *, uiSchemas: *, biblicalBooksDropdown: *, biblicalChaptersDropdown: *, biblicalVersesDropdown: *, biblicalSubversesDropdown: *, changeHandler: *, languageCode: *}}
 */
NewEntry.propTypes = {
  session: PropTypes.object.isRequired
  , changeHandler: PropTypes.func.isRequired
};

export default NewEntry;