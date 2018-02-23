import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import tinymce from 'tinymce';
import { get } from 'lodash';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/lists';
import {
  Accordion
  , Button
  , Col
  , ControlLabel
  , Glyphicon
  , Grid
  , FormControl
  , FormGroup
  , HelpBlock
  , Panel
  , Row
  , Tab
  , Tabs
  , Well
} from 'react-bootstrap';
import Labels from './Labels';
import Server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import ResourceSelector from './modules/ReactSelector';
import EditableSelector from './modules/EditableSelector';
import FormattedTextNote from './FormattedTextNote';
import BibleRefSelector from './helpers/BibleRefSelector';
import OntologyRefSelector from './helpers/OntologyRefSelector';
import WorkflowForm from './helpers/WorkflowForm';

import CompareDocs from './modules/CompareDocs';

class TextNoteEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    let thisClassLabels = Labels.getTextNoteEditorLabels(languageCode);
    let initialMessage = thisClassLabels.requiredMsg;
    let form = {};
    if (props.form) {
      form = props.form;
    } else {
      form = props.session.uiSchemas.forms["TextualNote:1.1"];
    }

    this.state = {
      labels: { //
        thisClass: thisClassLabels
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
        , search: Labels.getSearchLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: initialMessage
      , form: form
      , editor: null
      , scopeBiblical: ""
      , scopeLiturgical: props.idKey
      , lemmaBiblical: ""
      , lemmaLiturgical: ""
      , title: ""
      , liturgicalText: props.liturgicalText
      , liturgicalLibraries: undefined
      , biblicalLibraries: undefined
      , selectedNoteLibrary: props.session.userInfo.domain
      , selectedType: ""
      , selectedTypeLabel: thisClassLabels.typeLabel
      , selectedBibleBook: ""
      , selectedBibleChapter: ""
      , selectedBibleVerse: ""
      , bibleRef: ""
      , selectedBiblicalGreekId: ""
      , selectedBiblicalTranslationId: ""
      , selectedLiturgicalGreekId: ""
      , selectedLiturgicalTranslationId: ""
      , greekBibleId: ""
      , note: ""
      , selectedLiturgicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: props.idTopic},
        {key: "key", label: props.idKey}
      ]
      , selectedBiblicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showBibleView: false
      , ontologyRefType: ""
      , ontologyRefEntityId: ""
      , ontologyRefEntityName: ""
      , showOntologyView: false
      , workflow: {
        visibility: "PERSONAL"
        , status: "EDITING"
        , assignedTo: props.session.userInfo.username
        , statusIcon: "edit"
        , visibilityIcon: "lock"
      }
      , selectedNoteLibrary: props.session.userInfo.domain
      , buttonSubmitDisabled: true
      , selectedTag: ""
      , tags: []
      , formIsValid: false
    };

    this.createMarkup = this.createMarkup.bind(this);
    this.fetchBibleText = this.fetchBibleText.bind(this);
    this.handleFetchBibleTextCallback = this.handleFetchBibleTextCallback.bind(this);

    this.handleBiblicalIdSelection = this.handleBiblicalIdSelection.bind(this);
    this.handleBibleRefChange = this.handleBibleRefChange.bind(this);
    this.handleBiblicalLemmaChange = this.handleBiblicalLemmaChange.bind(this);
    this.handleBiblicalScopeChange = this.handleBiblicalScopeChange.bind(this);

    this.handleLiturgicalLemmaChange = this.handleLiturgicalLemmaChange.bind(this);
    this.handleLiturgicalScopeChange = this.handleLiturgicalScopeChange.bind(this);
    this.handleLiturgicalIdSelection = this.handleLiturgicalIdSelection.bind(this);

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleNoteLibraryChange = this.handleNoteLibraryChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNoteTypeChange = this.handleNoteTypeChange.bind(this);
    this.handleOntologyRefChange = this.handleOntologyRefChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleEditableListCallback = this.handleEditableListCallback.bind(this);
    this.handleWorkflowCallback = this.handleWorkflowCallback.bind(this);

    this.getFormattedView = this.getFormattedView.bind(this);
    this.getHeaderWell = this.getHeaderWell.bind(this);
    this.handleLibrariesCallback = this.handleLibrariesCallback.bind(this);
    this.getBibleRefRow = this.getBibleRefRow.bind(this);
    this.getOntologyRefRow = this.getOntologyRefRow.bind(this);
    this.getTimestamp = this.getTimestamp.bind(this);
    this.getTitleRow = this.getTitleRow.bind(this);
    this.getNoteLibraryRow = this.getNoteLibraryRow.bind(this);

    this.getBiblicalScopeRow = this.getBiblicalScopeRow.bind(this);
    this.getBiblicalLemmaRow = this.getBiblicalLemmaRow.bind(this);
    this.getBiblicalGreekLibraryRow = this.getBiblicalGreekLibraryRow.bind(this);
    this.getBiblicalTranslationLibraryRow = this.getBiblicalTranslationLibraryRow.bind(this);

    this.getLiturgicalView = this.getLiturgicalView.bind(this);
    this.getLiturgicalScopeRow = this.getLiturgicalScopeRow.bind(this);
    this.getLiturgicalLemmaRow = this.getLiturgicalLemmaRow.bind(this);
    this.getLiturgicalGreekLibraryRow = this.getLiturgicalGreekLibraryRow.bind(this);
    this.getLiturgicalTranslationLibraryRow = this.getLiturgicalTranslationLibraryRow.bind(this);

    this.getNoteTypeRow = this.getNoteTypeRow.bind(this);
    this.getButtonRow = this.getButtonRow.bind(this);
    this.getFormattedHeaderRow = this.getFormattedHeaderRow.bind(this);
    this.getOntologyLabel = this.getOntologyLabel.bind(this);
    this.getRevisionsPanel = this.getRevisionsPanel.bind(this);
    this.getTagsRow = this.getTagsRow.bind(this);
    this.getWorkflowPanel = this.getWorkflowPanel.bind(this);
    this.getTabs = this.getTabs.bind(this);

    this.getIdsWell = this.getIdsWell.bind(this);

    this.handleBiblicalGreekLibraryChange = this.handleBiblicalGreekLibraryChange.bind(this);
    this.handleBiblicalTranslationLibraryChange = this.handleBiblicalTranslationLibraryChange.bind(this);

    this.handleLiturgicalGreekLibraryChange = this.handleLiturgicalGreekLibraryChange.bind(this);
    this.handleLiturgicalTranslationLibraryChange = this.handleLiturgicalTranslationLibraryChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);

    this.getForm = this.getForm.bind(this);

    this.settingsValid = this.settingsValid.bind(this);
    this.validateForm = this.validateForm.bind(this);

  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    tinymce.init({
      selector: `#${this.props.id}`,
      plugins: 'lists, wordcount',
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.handleEditorChange(content);
        });
      }
      , entity_encoding : "raw"
      , browser_spellcheck: true
      , branding: false
      , menubar: false
    });
  }

  componentWillReceiveProps = (nextProps) => {
      let languageCode = nextProps.session.languageCode;
      let thisClassLabels = Labels.getTextNoteEditorLabels(languageCode);
      let message = thisClassLabels.requiredMsg;

      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: thisClassLabels
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
            , search: Labels.getSearchLabels(languageCode)
          }
          , message: message
          , note: get(this.state, "note", "" )
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  settingsValid = () => {
    let valid = false;
    if (this.state.selectedType) {
      if (this.state.selectedType === "REF_TO_BIBLE") {
        valid = (
            this.state.scopeLiturgical.length > 0
            && this.state.lemmaLiturgical.length > 0
            && this.state.title.length > 0
            && this.state.scopeBiblical.length > 0
            && this.state.lemmaBiblical.length > 0
            && this.state.bibleRef.length > 0
        );
      }  else if (this.state.selectedType.startsWith("REF_TO")) {
        valid = (
            this.state.scopeLiturgical.length > 0
            && this.state.lemmaLiturgical.length > 0
            && this.state.ontologyRefEntityId.length > 0
        );
      } else {
        valid = (
            this.state.scopeLiturgical.length > 0
            && this.state.lemmaLiturgical.length > 0
            && this.state.title.length > 0
        );
      }
    }
    return valid;
  };

  validateForm = () => {
    let message = this.state.labels.thisClass.requiredMsg;
    let messageIcon = MessageIcons.getMessageIcons().warning;
    let formIsValid = false;
    let noteValid = this.state.note.length > 0;
    if (this.settingsValid() && noteValid) {
      formIsValid = true;
      message = this.state.labels.messages.ok;
      messageIcon = MessageIcons.getMessageIcons().info;
    }
    this.setState({
      formIsValid: formIsValid
      , message: message
      , messageIcon: messageIcon
    });
  };

  getTimestamp = () => {
    let date = new Date();
    let month = (date.getMonth()+1).toString().padStart(2,"0");
    let day = date.getDate().toString().padStart(2,"0");
    let hour = date.getHours().toString().padStart(2,"0");
    let minute = date.getMinutes().toString().padStart(2,"0");
    let second = date.getSeconds().toString().padStart(2,"0");
    let timestamp = date.getFullYear()
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
    return timestamp;
  };

  getForm = () => {
    let form = this.state.form;
    let tags = this.state.tags.map(function(item) {
      return item['label'];
    });
    let topic = this.props.idLibrary + "~" + this.props.idTopic + "~" + this.props.idKey;
    let key = this.getTimestamp();

    form.noteType = this.state.selectedType;
    form.status = this.state.workflow.status;
    form.tags = tags;
    form.title = this.state.title;
    form.valueFormatted = this.state.note;
    form.visibility = this.state.workflow.visibility;
    form.assignedToUser = this.state.workflow.assignedTo;

    form.biblicalGreekId = this.state.selectedBiblicalGreekId;
    form.biblicalLemma = this.state.lemmaBiblical;
    form.biblicalScope = this.state.scopeBiblical;
    form.biblicalTranslationId = this.state.selectedBiblicalTranslationId;

    form.library = this.state.selectedNoteLibrary;
    form.topic = topic;
    form.key = key;
    form.id = this.state.selectedNoteLibrary + "~" + topic + "~" + key;

    form.liturgicalGreekId = this.state.selectedLiturgicalGreekId;
    form.liturgicalLemma = this.state.lemmaLiturgical;
    form.liturgicalScope = this.state.scopeLiturgical;
    form.liturgicalTranslationId = this.state.selectedBiblicalTranslationId;

    form.ontologicalEntityId = this.state.ontologyRefEntityId;

    console.log("form=");
    console.log(form);
    return form;
  };

  onSubmit = () => {
    this.setState(
        {form: this.getForm()}
    );
  };

  fetchBibleText = () => {
    let parms =
        "t=" + encodeURIComponent(this.state.topic)
        + "&l=" + encodeURIComponent(this.state.libraries)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
        },
        Server.getViewForTopic(
            this.props.session.restServer
            , this.props.session.userInfo.username
            , this.props.session.userInfo.password
            , parms
            , this.handleFetchCallback
        )
    );

  };

  handleWorkflowCallback = ( visibility, status, assignedTo ) => {
    let statusIcon = "check";
    let visibilityIcon = "globe";

    switch (visibility) {
      case ("PERSONAL"): {
        visibilityIcon = "lock"; // user-secret
        break;
      }
      case ("PRIVATE"): {
        visibilityIcon = "share-alt";
        break;
      }
      default: {
      }
    }
    switch (status) {
      case ("EDITING"): {
        statusIcon = "edit";
        break;
      }
      case ("REVIEWING"): {
        statusIcon = "eye-open";
        break;
      }
      default: {
      }
    }
    this.setState(
        {
          workflow: {
            visibility: visibility
            , status: status
            , assignedTo: assignedTo
            , visibilityIcon: visibilityIcon
            , statusIcon: statusIcon
          }
        }
    );
  };

  handleFetchBibleTextCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      let about = data.about;
      let templateKeys = data.templateKeys;
      let libraryKeys = data.libraryKeys;
      let libraryKeyValues = data.libraryKeyValues;
      this.setState({
        dataFetched: true
        , about: about
        , libraryKeyValues: libraryKeyValues
        , libraryKeys: libraryKeys
        , templateKeys: templateKeys
        , message: this.state.labels.messages.found
        + " "
        + templateKeys.length
        + " "
        + this.state.labels.messages.docs
        , messageIcon: restCallResult.messageIcon
        , resultCount: templateKeys.length
      }, this.setTableData);
    }
  };

  handleEditableListCallback = (value, values) => {
    this.setState({selectedTag: value, tags: values});
  };

  handleEditorChange = (content) => {
    this.setState({note: content}, this.validateForm);
  };

  handleBiblicalScopeChange = (e) => {
    this.setState({scopeBiblical: e.target.value}, this.validateForm);
  };

  handleLiturgicalScopeChange = (e) => {
    this.setState({scopeLiturgical: e.target.value}, this.validateForm);
  };

  handleNoteTypeChange = (selection) => {
    this.setState({
      selectedType: selection["value"]
      , selectedTypeLabel: selection["label"]
      , selectedBiblicalGreekId: ""
      , lemmaBiblical: ""
      , scopeBiblical: ""
      , selectedBiblicalTranslationId: ""
      , selectedLiturgicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: this.props.idTopic},
        {key: "key", label: this.props.idKey}
      ]
      , selectedBiblicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showBibleView: false
      , ontologyRefType: ""
      , ontologyRefEntityId: ""
      , ontologyRefName: ""
      , showOntologyView: false
    }, this.validateForm);
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleBibleRefChange = (book, chapter, verse, citeBible) => {
    let showBibleView = false;
    let scope = "";
    if (book.length > 0 && chapter.length > 0 && verse.length > 0) {
      showBibleView = true;
      scope = citeBible;
    }
    this.setState(
        {
        selectedBiblicalIdParts: [
          {key: "domain", label: "*"},
          {key: "topic", label: book},
          {key: "key", label: chapter + ":" + verse}
          ]
          , showBibleView
          , bibleRef: book + "~" + chapter + "~" + verse
          , citeBible: citeBible
          , scopeBiblical: scope
        }, this.validateForm
    );
  };


  handleOntologyRefChange = (entityId, entityName) => {
    let showOntologyView = false;
    if (entityId.length > 0) {
      showOntologyView = true;
    }
    this.setState(
        {
          ontologyRefEntityId: entityId
          , ontologyRefEntityName: entityName
          , showOntologyView: showOntologyView
          , title: entityName
        }, this.validateForm
    );
  };

  handleBiblicalLemmaChange = (e) => {
    this.setState({lemmaBiblical: e.target.value}, this.validateForm);
  };

  handleLiturgicalLemmaChange = (e) => {
    this.setState({lemmaLiturgical: e.target.value}, this.validateForm);
  };

  handleTitleChange = (e) => {
    this.setState({title: e.target.value}, this.validateForm);
  };

  getBibleRefRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (
        <BibleRefSelector
            session={this.props.session}
            callback={this.handleBibleRefChange}
        />
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getOntologyRefRow = () => {
    if (this.state.selectedType
        && this.state.selectedType.startsWith("REF_TO")
        && (this.state.selectedType !== ("REF_TO_BIBLE"))
    ) {
      let type = this.getOntologyLabel(this.state.selectedType);
      return (
          <Row className="show-grid App-Ontology-Ref-Selector-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.refersTo}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <div className={"App App-Ontology-Ref-Selector-Entity"}>
                <OntologyRefSelector
                    session={this.props.session}
                    type={type}
                    callback={this.handleOntologyRefChange}
                />
              </div>
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getOntologyLabel = (type) => {
    try {
      let label = type.split("_")[2];
      return label.charAt(0) + label.slice(1).toLowerCase();
    } catch (err) {
      return type;
    };
  };

  getLiturgicalView = () => {
    return (
        <Accordion>
          <Panel header={this.state.labels.thisClass.viewLiturgicalText} eventKey="TextNoteEditor">
            <CompareDocs
                session={this.props.session}
                handleRowSelect={this.handleLiturgicalIdSelection}
                title={"Liturgical Texts"}
                docType={"Liturgical"}
                selectedIdParts={this.state.selectedLiturgicalIdParts}
                labels={this.state.labels.search}
                librariesInfoCallback={this.handleLibrariesCallback}
            />
          </Panel>
        </Accordion>
    );
  };

  handleLiturgicalIdSelection = (row) => {
    let id = row["id"];
    if (id.startsWith("gr_")) {
      this.setState({ selectedLiturgicalGreekId: id })
    } else {
      this.setState({ selectedLiturgicalTranslationId: id })
    }
  };

  handleBiblicalIdSelection = (row) => {
    let id = row["id"];
    if (id.startsWith("gr_")) {
      this.setState({ selectedBiblicalGreekId: id })
    } else {
      this.setState({ selectedBiblicalTranslationId: id })
    }
  };

  handleLibrariesCallback = ( type, id , libraries ) => {
    if (libraries) {

      let greekDropdown = libraries.filter((row) => {
        return row.library.startsWith("gr_");
      }).map((row) => {
        return {label: row.library , value: row.id} ;
      });

      let translationDropdown = libraries.filter((row) => {
        return ! row.library.startsWith("gr_");
      }).map((row) => {
        return {label: row.library , value: row.id} ;
      });

      if (type === "Biblical") {
        biblicalLibraries =
        this.setState({
          biblicalLibraries: {
            greekBibleId: id
            , libraries: libraries
            , greekDropdown: greekDropdown
            , translationDropdown: translationDropdown
          }
          , selectedBiblicalGreekId: id
        });
      } else {
        this.setState({
          liturgicalLibraries: {
            greekBibleId: id
            , libraries: libraries
            , greekDropdown: greekDropdown
            , translationDropdown: translationDropdown
          }
          , selectedLiturgicalGreekId: id
        });
      }
    }
  };

  getBiblicalView = () => {
    if (this.state.showBibleView) {
      return (
          <Accordion>
          <Panel header={this.state.labels.thisClass.viewBiblicalText + ": " + this.state.bibleRef} eventKey="TextNoteEditor">
            <CompareDocs
                session={this.props.session}
                handleRowSelect={this.handleBiblicalIdSelection}
                librariesInfoCallback={this.handleLibrariesCallback}
                title={"Biblical Texts"}
                docType={"Biblical"}
                selectedIdParts={this.state.selectedBiblicalIdParts}
                labels={this.state.labels.search}
            />
          </Panel>
          </Accordion>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };


  getLiturgicalScopeRow = () => {
    return (
        <Row className="show-grid  App-Text-Note-Editor-Scope-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.liturgicalScope}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <FormControl
                id={"fxLiturgicalScope"}
                className={"App App-Text-Note-Editor-Scope"}
                type="text"
                value={this.state.scopeLiturgical}
                placeholder="scope"
                onChange={this.handleLiturgicalScopeChange}
            />
          </Col>
        </Row>
    );
  };

  getLiturgicalLemmaRow = () => {
    return (
        <Row className="show-grid  App-Text-Note-Editor-Lemma-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.liturgicalLemma}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <FormControl
                id={"fcLiturgicalLemma"}
                className={"App App-Text-Note-Editor-Lemma"}
                type="text"
                value={this.state.lemmaLiturgical}
                placeholder="liturgical lemma"
                onChange={this.handleLiturgicalLemmaChange}
            />
          </Col>
        </Row>
    );
  };


  handleNoteLibraryChange = ( selection ) => {
    this.setState( { selectedNoteLibrary: selection["value"] } );
  };

  getNoteLibraryRow = () => {
    if (this.props.session.userInfo.domains.author) {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.noteLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.selectedNoteLibrary}
                  resources={this.props.session.userInfo.domains.author}
                  changeHandler={this.handleNoteLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  handleBiblicalTranslationLibraryChange = ( selection ) => {
    this.setState( { selectedBiblicalTranslationId: selection["value"] } );
  };

  getBiblicalTranslationLibraryRow = () => {
    if (this.state.selectedType
        && this.state.selectedType === "REF_TO_BIBLE"
        && this.state.biblicalLibraries
    ) {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalTranslationLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.selectedBiblicalTranslationId}
                  resources={this.state.biblicalLibraries.translationDropdown}
                  changeHandler={this.handleBiblicalTranslationLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  handleLiturgicalGreekLibraryChange = ( selection ) => {
    this.setState( { selectedLiturgicalGreekId: selection["value"] } );
  };

  getLiturgicalGreekLibraryRow = () => {
    if (this.state.liturgicalLibraries) {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.liturgicalGreekLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.selectedLiturgicalGreekId}
                  resources={this.state.liturgicalLibraries.greekDropdown}
                  changeHandler={this.handleLiturgicalGreekLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  handleBiblicalGreekLibraryChange = ( selection ) => {
    this.setState( { selectedBiblicalGreekId: selection["value"] } );
  };


  getBiblicalGreekLibraryRow = () => {
    if (this.state.selectedType
        && this.state.selectedType === "REF_TO_BIBLE"
        && this.state.biblicalLibraries
    ) {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalGreekLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.selectedBiblicalGreekId}
                  resources={this.state.biblicalLibraries.greekDropdown}
                  changeHandler={this.handleBiblicalGreekLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  handleLiturgicalTranslationLibraryChange = ( selection ) => {
    this.setState( { selectedLiturgicalTranslationId: selection["value"] } );
  };


  getLiturgicalTranslationLibraryRow = () => {
    if (this.state.liturgicalLibraries && this.state.liturgicalLibraries.translationDropdown) {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.liturgicalTranslationLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.selectedLiturgicalTranslationId}
                  resources={this.state.liturgicalLibraries.translationDropdown}
                  changeHandler={this.handleLiturgicalTranslationLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getTitleRow = () => {
    if (this.state.selectedType
        && this.state.selectedType.startsWith("REF_TO")
        && (this.state.selectedType !== ("REF_TO_BIBLE"))
    ) {
      return (<span className="App-no-display"></span>);
    } else {
      return (
          <Row className="show-grid App-Text-Note-Editor-Title-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.title}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fxEditorTitle"}
                  className={"App App-Text-Note-Editor-Title"}
                  type="text"
                  value={this.state.title}
                  placeholder="title"
                  onChange={this.handleTitleChange}
              />
            </Col>
          </Row>
      );
    }
  };

  getBiblicalScopeRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (
          <Row className="show-grid  App-Text-Note-Editor-Scope-Biblical-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalScope}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fxEditorBiblicalScope"}
                  className={"App App-Text-Note-Editor-Scope"}
                  type="text"
                  value={this.state.scopeBiblical}
                  placeholder="scope"
                  onChange={this.handleBiblicalScopeChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }

  };

  getBiblicalLemmaRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (


          <Row className="show-grid  App-Text-Note-Editor-Lemma-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalLemma}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fcBibLemma"}
                  className={"App App-Text-Note-Editor-Lemma"}
                  type="text"
                  value={this.state.lemmaBiblical}
                  placeholder="biblical lemma"
                  onChange={this.handleBiblicalLemmaChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getNoteTypeRow = () => {
    return (
        <Row className="show-grid App-Text-Note-Editor-Type-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.type}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <div className={"App App-Text-Note-Type-Selector"}>
            <ResourceSelector
                title={""}
                initialValue={this.state.selectedType}
                resources={this.props.session.dropdowns.noteTypesDropdown}
                changeHandler={this.handleNoteTypeChange}
                multiSelect={false}
            />
            </div>
          </Col>
        </Row>
    );

  };

  getButtonRow = () => {
    let submitButtonDisabled = true;

    if (this.state.formIsValid) {
        submitButtonDisabled = false;
    }
    return (
        <Row className="show-grid App-Text-Note-Editor-Button-Row">
          <Col xs={12} md={12}>
              <Button
                  className="App App-Button"
                  bsStyle="primary"
                  disabled={submitButtonDisabled}
                  onClick={this.onSubmit}
              >
                {this.state.labels.buttons.submit}
              </Button>
            <span className="App-Text-Editor-Workflow-Glyph">
              <Glyphicon
                  glyph={this.state.workflow.statusIcon}/>
              <FontAwesome
                  name={this.state.workflow.visibilityIcon}/>
            </span>
          </Col>
        </Row>
    );

  };

  getTagsRow = () => {
    return (
            <Well className="App-Text-Note-Editor-Button-Row">
              <EditableSelector
                  session={this.props.session}
                  initialValue={this.state.selectedTag}
                  options={this.state.tags}
                  changeHandler={this.handleEditableListCallback}
                  title={""}
                  multiSelect={false}/>
            </Well>
    );

  };

  getRevisionsPanel = () => {
    return (
        <Well>
          revisions will appear here
        </Well>
    );
  };

    getWorkflowPanel = () => {
    return (
        <WorkflowForm
            session={this.props.session}
            callback={this.handleWorkflowCallback}
            library={this.state.selectedNoteLibrary}
        />
    );

  };

  getFormattedHeaderRow = () => {
    return (
            <Well>
              <div className="App App-Text-Note-formatted">
                <div className="App-Text-Note-Type">
                  <Glyphicon className="App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
                  <span className="App-Text-Note-Type-As-Heading">{this.state.selectedTypeLabel}</span>
                  <Glyphicon className="App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
                </div>
                {this.getFormattedView()}
              </div>
            </Well>
    );
  };

  getFormattedView = () => {
    return (
        <FormattedTextNote
            session={this.props.session}
            note={this.state.note}
            type={this.state.selectedType}
            title={this.state.title}
            scopeLiturgical={this.state.scopeLiturgical}
            lemmaLiturgical={this.state.lemmaLiturgical}
            lemmaBiblical={this.state.lemmaBiblical}
            scopeBiblical={this.state.scopeBiblical}
            ontologyRefEntityName={this.state.ontologyRefEntityName}
        />
    );
  };

  createMarkup() {
    return {__html: this.state.note};
  };

  getIdsWell = () => {
    return (
        <Well>
          <ControlLabel>{this.state.labels.thisClass.dbIds}</ControlLabel>
          <Grid>
            {this.getNoteLibraryRow()}
            {this.getLiturgicalGreekLibraryRow()}
            {this.getLiturgicalTranslationLibraryRow()}
            {this.getBiblicalGreekLibraryRow()}
            {this.getBiblicalTranslationLibraryRow()}
          </Grid>
        </Well>
    );
  };

  getHeaderWell = () => {
      return (
              <Well>
                <Grid>
                  {this.getNoteTypeRow()}
                  {this.getLiturgicalScopeRow()}
                  {this.getLiturgicalLemmaRow()}
                  {this.getTitleRow()}
                  {this.getBibleRefRow()}
                  {this.getBiblicalScopeRow()}
                  {this.getBiblicalLemmaRow()}
                  {this.getOntologyRefRow()}
                </Grid>
              </Well>
      );
  };

getTabs = () => {
    return (
        <Well>
          <Tabs id="App-Text-Node-Editor-Tabs" defaultActiveKey={"heading"} animation={false}>
            <Tab eventKey={"heading"} title={this.state.labels.thisClass.settings}>
              {this.getHeaderWell()}
            </Tab>
            <Tab eventKey={"formattedheading"} title={this.state.labels.thisClass.viewFormattedNote}>
              {this.getFormattedHeaderRow()}
            </Tab>
            <Tab eventKey={"idsheading"} title={this.state.labels.thisClass.ids}>
              {this.getIdsWell()}
            </Tab>
            <Tab eventKey={"revisions"} title={this.state.labels.thisClass.revisions}>
              {this.getRevisionsPanel()}
            </Tab>
            <Tab eventKey={"tags"} title={this.state.labels.thisClass.tags}>
              {this.getTagsRow()}
            </Tab>
            <Tab eventKey={"workflow"} title={this.state.labels.thisClass.workflow}>
              {this.getWorkflowPanel()}
            </Tab>
          </Tabs>
        </Well>
    );
  };

  render() {
    return (
        <div className="App-Text-Note-Editor">
          {this.getLiturgicalView()}
          {this.getBiblicalView()}
          <form>
            <FormGroup
            >
              <Well>
              <Grid>
                <Row className="show-grid">
                  <Col xs={12} md={8}>
                    <ControlLabel>
                      {this.state.labels.thisClass.note}: {this.state.selectedTypeLabel}
                    </ControlLabel>
                  </Col>
                </Row>
                <Row className="show-grid  App-Text-Note-Editor-Row">
                  <Col xs={12} md={8}>
                    <textarea id={this.props.id}/>
                  </Col>
                </Row>
                {this.getButtonRow()}
                <HelpBlock>
                  <div><span className="App-message"><FontAwesome
                      name={this.state.messageIcon}/> {this.state.message}</span>
                  </div>
                </HelpBlock>
              </Grid>
              </Well>
            </FormGroup>
          </form>
          {this.getTabs()}
        </div>
    )
  }
}

TextNoteEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onEditorChange: PropTypes.func.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , form: PropTypes.object
};

// set default values for props here
TextNoteEditor.defaultProps = {
  id: "tinymceeditor"
  , form: {}
};

export default TextNoteEditor;
