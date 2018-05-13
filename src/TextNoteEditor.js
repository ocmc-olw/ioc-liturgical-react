import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import RichEditor from './modules/RichEditor';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { get, has } from 'lodash';
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
import Spinner from './helpers/Spinner';
import MessageIcons from './helpers/MessageIcons';
import ResourceSelector from './modules/ReactSelector';
import EditableSelector from './modules/EditableSelector';
import FormattedTextNote from './FormattedTextNote';
import IdManager from './helpers/IdManager';
import BibleRefSelector from './helpers/BibleRefSelector';
import OntologyRefSelector from './helpers/OntologyRefSelector';
import WorkflowForm from './helpers/WorkflowForm';

import CompareDocs from './modules/CompareDocs';
import axios from "axios/index";

class TextNoteEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    let thisClassLabels = Labels.getTextNoteEditorLabels(languageCode);
    let messages = Labels.getMessageLabels(languageCode);
    let initialMessage = messages.initial;
    let textIdParts = IdManager.getParts(props.textId);
    let editorId = "tinymce-" + (new Date).getTime();
    let tags = [];
    let selectedTag = "";
    let selectedBiblicalIdParts = [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
        ]
    ;

    let selectedType = "";
    let selectedTypeLabel = "";
    let selectedBiblicalGreekId = "";
    let selectedBiblicalLibrary = "";
    let selectedBiblicalBook = "";
    let selectedBiblicalChapter = "";
    let selectedBiblicalVerse = "";
    let citeBible = "";

    if (props.form) {
      selectedTypeLabel = props.form.noteType;
      if (props.form.tags) {
        selectedTag = props.form.tags[0];
        let j = props.form.tags.length;
        for (let i=0; i < j; i++) {
          tags.push({value: props.form.tags[i], label: props.form.tags[i]});
        }
      }
      if (props.form.biblicalGreekId) {
        let biblicalIdParts = IdManager.getParts(props.form.biblicalGreekId);
        selectedBiblicalIdParts = [
              {key: "domain", label: "*"},
              {key: "topic", label: biblicalIdParts.topic},
              {key: "key", label: biblicalIdParts.key}
            ];
        selectedBiblicalGreekId = props.form.biblicalGreekId;
        selectedBiblicalLibrary = biblicalIdParts.library;
        selectedBiblicalBook = biblicalIdParts.book;
        selectedBiblicalChapter = biblicalIdParts.chapter;
        selectedBiblicalVerse = biblicalIdParts.verse;
        let citeBook = biblicalIdParts.book;
        let citeChapter = biblicalIdParts.chapter.substring(1,biblicalIdParts.chapter.length);
        try {
          citeChapter = parseInt(citeChapter);
        } catch (err) {
          citeChapter = biblicalIdParts.chapter;
        }
        let citeVerse = 0;
        try {
          citeVerse = parseInt(biblicalIdParts.verse);
        } catch (err) {
          citeVerse = biblicalIdParts.verse;
        };
        citeBible = citeBook + " " + citeChapter + ":" + citeVerse;
      }
      if (props.form.noteType) {
        selectedType = props.form.noteType;
        selectedTypeLabel = this.getLabel(props.form.noteType);
      }
    }
    this.state = {
      labels: {
        thisClass: thisClassLabels
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: messages
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
        , search: Labels.getSearchLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: initialMessage
      , textIdParts: textIdParts
      , form: props.form
      , editor: null
      , editorId: editorId
      , note: ""
      , scopeBiblical: ""
      , scopeLiturgical: textIdParts.key
      , lemmaBiblical: ""
      , lemmaLiturgical: ""
      , title: ""
      , liturgicalText: props.liturgicalText
      , liturgicalLibraries: undefined
      , biblicalLibraries: undefined
      , selectedNoteLibrary: props.session.userInfo.domain
      , selectedType: selectedType
      , selectedTypeLabel: selectedTypeLabel
      , bibleRef: ""
      , selectedBiblicalGreekId: selectedBiblicalGreekId
      , selectedBiblicalIdParts: selectedBiblicalIdParts
      , selectedBiblicalLibrary: selectedBiblicalLibrary
      , selectedBiblicalBook: selectedBiblicalBook
      , selectedBiblicalChapter: selectedBiblicalChapter
      , selectedBiblicalVerse: selectedBiblicalVerse
      , citeBible: citeBible
      , selectedBiblicalTranslationId: ""
      , selectedLiturgicalGreekId: ""
      , selectedLiturgicalTranslationId: ""
      , greekBibleId: ""
      , selectedLiturgicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: textIdParts.topic},
        {key: "key", label: textIdParts.key}
      ]
      , showBibleView: (props.form && props.form.biblicalGreekId) ? true : false
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
      , selectedTag: selectedTag
      , tags: tags
      , formIsValid: true
      , suggestions:[{
              text: 'No abbreviations or Suggestions entries available.'
              , value: 'ignore'
              , url: 'cite'
            }
        ,
      ]
    };

    this.createMarkup = this.createMarkup.bind(this);
    this.fetchBibleText = this.fetchBibleText.bind(this);
    this.fetchSuggestions = this.fetchSuggestions.bind(this);
    this.getBibleRefRow = this.getBibleRefRow.bind(this);
    this.getBiblicalGreekLibraryRow = this.getBiblicalGreekLibraryRow.bind(this);
    this.getBiblicalLemmaRow = this.getBiblicalLemmaRow.bind(this);
    this.getBiblicalScopeRow = this.getBiblicalScopeRow.bind(this);
    this.getBiblicalTranslationLibraryRow = this.getBiblicalTranslationLibraryRow.bind(this);
    this.getButtonRow = this.getButtonRow.bind(this);
    this.getEditor = this.getEditor.bind(this);
    this.getFormattedHeaderRow = this.getFormattedHeaderRow.bind(this);
    this.getFormattedView = this.getFormattedView.bind(this);
    this.getSettingsWell = this.getSettingsWell.bind(this);
    this.getIdsWell = this.getIdsWell.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.getLiturgicalGreekLibraryRow = this.getLiturgicalGreekLibraryRow.bind(this);
    this.getLiturgicalLemmaRow = this.getLiturgicalLemmaRow.bind(this);
    this.getLiturgicalScopeRow = this.getLiturgicalScopeRow.bind(this);
    this.getLiturgicalTranslationLibraryRow = this.getLiturgicalTranslationLibraryRow.bind(this);
    this.getLiturgicalView = this.getLiturgicalView.bind(this);
    this.getNoteLibraryRow = this.getNoteLibraryRow.bind(this);
    this.getNoteTypeRow = this.getNoteTypeRow.bind(this);
    this.getOntologyLabel = this.getOntologyLabel.bind(this);
    this.getOntologyRefRow = this.getOntologyRefRow.bind(this);
    this.getRevisionsPanel = this.getRevisionsPanel.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTagsRow = this.getTagsRow.bind(this);
    this.getTimestamp = this.getTimestamp.bind(this);
    this.getTitleRow = this.getTitleRow.bind(this);
    this.getWorkflowPanel = this.getWorkflowPanel.bind(this);
    this.handleBibleRefChange = this.handleBibleRefChange.bind(this);
    this.handleBiblicalGreekLibraryChange = this.handleBiblicalGreekLibraryChange.bind(this);
    this.handleBiblicalIdSelection = this.handleBiblicalIdSelection.bind(this);
    this.handleBiblicalLemmaChange = this.handleBiblicalLemmaChange.bind(this);
    this.handleBiblicalScopeChange = this.handleBiblicalScopeChange.bind(this);
    this.handleBiblicalTranslationLibraryChange = this.handleBiblicalTranslationLibraryChange.bind(this);
    this.handleEditableListCallback = this.handleEditableListCallback.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleFetchBibleTextCallback = this.handleFetchBibleTextCallback.bind(this);
    this.handleFetchSuggestionsCallback = this.handleFetchSuggestionsCallback.bind(this);
    this.handleLibrariesCallback = this.handleLibrariesCallback.bind(this);
    this.handleLiturgicalGreekLibraryChange = this.handleLiturgicalGreekLibraryChange.bind(this);
    this.handleLiturgicalIdSelection = this.handleLiturgicalIdSelection.bind(this);
    this.handleLiturgicalLemmaChange = this.handleLiturgicalLemmaChange.bind(this);
    this.handleLiturgicalScopeChange = this.handleLiturgicalScopeChange.bind(this);
    this.handleLiturgicalTranslationLibraryChange = this.handleLiturgicalTranslationLibraryChange.bind(this);
    this.handleNoteLibraryChange = this.handleNoteLibraryChange.bind(this);
    this.handleNoteTypeChange = this.handleNoteTypeChange.bind(this);
    this.handleOntologyRefChange = this.handleOntologyRefChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleWorkflowCallback = this.handleWorkflowCallback.bind(this);
    this.mapTagsToObjectList = this.mapTagsToObjectList.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.settingsValid = this.settingsValid.bind(this);
    this.submitPost = this.submitPost.bind(this);
    this.submitPut = this.submitPut.bind(this);
    this.validateForm = this.validateForm.bind(this);

  };

  componentWillMount = () => {
    this.fetchSuggestions();
  };

  componentDidMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    let languageCode = nextProps.session.languageCode;
    let thisClassLabels = Labels.getTextNoteEditorLabels(languageCode);
    let messages = Labels.getMessageLabels(languageCode);
    let textIdParts = IdManager.getParts(nextProps.textId);
    let formIsValid = false;
    let form = {};
    let tags = [];
    let selectedTag = "";
    let selectedType = get(this.state, "selectedType", "");
    let selectedTypeLabel = get(this.state, "selectedTypeLabel", "");

    if (nextProps.form && nextProps.form.noteType) {
      form = nextProps.form;
      selectedType = form.noteType;
      selectedTypeLabel = this.getLabel(form.noteType);
    } else {
      form = JSON.parse(JSON.stringify(nextProps.session.uiSchemas.getForm("TextualNote:1.1")));
      form.liturgicalScope = textIdParts.key;
      form.library = nextProps.session.userInfo.domain;
      let key = this.getTimestamp();
      form.key = key;
      form.topic = "gr_gr_cog" + "~" + textIdParts.topic + "~" + textIdParts.key;
      form.id = form.library + "~" + form.topic + "~" + key;
      form.liturgicalGreekId = form.topic;
      formIsValid = true;
      selectedTag = form.tags[0];
      selectedType = form.noteType;
      selectedTypeLabel = this.getLabel(form.noteType);
      let j = form.tags.length;
      for (let i=0; i < j; i++) {
        tags.push({value: form.tags[i], label: form.tags[i]});
      }
    }
    this.setState((prevState, props) => {
      return {
        labels: {
          thisClass: thisClassLabels
          , buttons: Labels.getButtonLabels(languageCode)
          , messages: messages
          , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          , search: Labels.getSearchLabels(languageCode)
        }
        , message: get("message", this.state.message, messages.initial)
        , note: form.valueFormatted
        , form: form
        , formIsValid: formIsValid
        , selectedTypeLabel: selectedTypeLabel
        , tags: tags
        , selectedTag: selectedTag
        , selectedType: selectedType
      }
    });
  };

  settingsValid = () => {
    let valid = false;
    if (this.state.form.noteType) {
      if (this.state.form.noteType === "REF_TO_BIBLE") {
        valid = (
            this.state.form.liturgicalScope.length > 0
            && this.state.form.liturgicalLemma.length > 0
            && this.state.form.noteTitle.length > 0
            && this.state.form.biblicalScope.length > 0
            && this.state.form.biblicalLemma.length > 0
            && this.state.form.biblicalGreekId.length > 0
        );
      }  else if (this.state.form.noteType.startsWith("REF_TO")) {
        valid = (
            this.state.form.liturgicalScope.length > 0
            && this.state.form.liturgicalLemma.length > 0
            && this.state.form.ontologicalEntityId.length > 0
        );
      }  else if (this.state.form.noteType === "UNIT") {
        valid = (
            this.state.form.liturgicalScope.length > 0
            && this.state.form.noteTitle.length > 0
        );
      } else {
        valid = (
            this.state.form.liturgicalScope.length > 0
            && this.state.form.liturgicalLemma.length > 0
            && this.state.form.noteTitle.length > 0
        );
      }
    }
    return valid;
  };

  validateForm = () => {
    let message = this.state.labels.thisClass.requiredMsg;
    let messageIcon = MessageIcons.getMessageIcons().warning;
    let formIsValid = false;
    let noteValid = this.state.form.valueFormatted.length > 0;
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

  handleEditorChange = (plain, html) => {
    let form = this.state.form;
    form.value = plain;
    form.valueFormatted = html;
    this.setState({form: form}, this.validateForm);
  };


  onSubmit = () => {
    if (this.props.form && this.props.form.noteType) {
      this.submitPut();
    } else {
      this.submitPost();
    }
  };

  submitPost = () => {
    let formData = this.state.form;

    this.setState({
      message: this.state.labels.messages.creating
      , messageIcon: this.state.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer
        + Server.getDbServerNotesApi()
    ;
    axios.post(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: this.state.labels.messages.created
            , form: formData
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

  submitPut = () => {
    let formData = this.state.form;
    this.setState({
      message: this.state.labels.messages.updating
      , messageIcon: this.state.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer
        + Server.getDbServerNotesApi()
        + "/"
        + formData.library
        + "/"
        + formData.topic
        + "/"
        + formData.key
    ;
    axios.put(
        path
        , formData
        , config
    )
        .then(response => {
          let message = this.state.labels.messages.updated;
          this.setState({
            message: message
            , form: formData
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

  fetchSuggestions = () => {
    // Server.restGetForLibraryTopic(
    //     this.props.session.restServer
    //     , this.props.session.userInfo.username
    //     , this.props.session.userInfo.password
    //     , this.props.session.userInfo.domain
    //     , SuperTypeTopics.Suggestions
    //     , this.handleFetchSuggestionsCallback
    // );
    let parms =
        "t=" + encodeURIComponent(this.state.topic)
        + "&l=" + encodeURIComponent(this.state.libraries)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
        },
        Server.restGetSuggestions(
            this.props.session.restServer
            , this.props.session.userInfo.username
            , this.props.session.userInfo.password
            , this.props.session.userInfo.domain
            , this.handleFetchSuggestionsCallback
        )
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
    if (visibility && status) {
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
      let form = this.state.form;
      form.status = status;
      form.visibility = visibility;
      form.assignedToUser = assignedTo;

      this.setState(
          {
            form: form
            , workflow: {
              visibilityIcon: visibilityIcon
              , statusIcon: statusIcon
            }
          }
      );
    }
  };

  handleFetchSuggestionsCallback = (restCallResult) => {
    if (restCallResult) {
      let abbreviations = [];
      let bibliography = [];
      if (restCallResult.data.values.length > 1) {
        bibliography = restCallResult.data.values[1]["bibliography"];
      }
      if (restCallResult.data.values.length > 0) {
        abbreviations = restCallResult.data.values[0]["abbreviations"];
      }
      let suggestAbr = abbreviations.map((o) => {
        return {text: o.key + " - " + o.value , value: o.key, url: o.key} ;
      });
      let suggestBib = bibliography.map((o) => {
        let author = "";
        let date = "";
        if (has(o, "author")) {
          author = o.author;
        } else if (has(o, "editor")) {
          author = o.editor;
        }
        if (has(o, "date")) {
          date = o.date;
        } else if (has(o, "year")) {
          date = o.year;
        }
        let result = o.key + " - ";
        if (author.length > 0) {
          result += author;
        }
        if (date.length > 0) {
          result += " (" + date + "). ";
        }
        result += o.title;
        return {text: result , value: o.key, url: o.key} ;
      });

      this.setState({
        abbreviations: abbreviations
        , bibliography: bibliography
        , suggestAbbreviations: suggestAbr
        , suggestBibliography: suggestBib
        , suggestions: suggestBib
      });
    }
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
    let form = this.state.form;
    form.tags = values.map(function(item) {
      return item['label'].trim();
    });
    this.setState({form: form, selectedTag: value, tags: values});
  };

  handleBiblicalScopeChange = (e) => {
    let form = this.state.form;
    form.biblicalScope = e.target.value;
    this.setState({form: form}, this.validateForm);
  };

  handleLiturgicalScopeChange = (e) => {
    let form = this.state.form;
    form.liturgicalScope = e.target.value;
    this.setState({form: form}, this.validateForm);
  };

  handleNoteTypeChange = (selection) => {
    let form = this.state.form;
    form.noteType = selection["value"];
    form.biblicalGreekId = "";
    form.biblicalLemma = "";
    form.biblicalScope = "";
    form.biblicalTranslationId = "";
    form.ontologicalEntityId = "";

    // For all note types, we use gr_gr_cog as the library of the form.topic ID.
    // But, a translator's note is for a specific translation.  So we will use the
    // library from the translation.
    if (selection["value"] === "TRANSLATORS_NOTE") {
      let textIdParts = IdManager.getParts(this.props.textId);
      form.topic = textIdParts.library + "~" + textIdParts.topic + "~" + textIdParts.key;
      form.id = form.library + "~" + form.topic + "~" + form.key;
      form.liturgicalGreekId = form.topic;
    }
    this.setState({
      form
      , selectedTypeLabel: selection["label"]
      , selectedBiblicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showBibleView: false
      , ontologyRefType: ""
      , ontologyRefName: ""
      , showOntologyView: false
    }, this.validateForm);
  };


  handleBibleRefChange = (book, chapter, verse, citeBible) => {
    let form = this.state.form;
    let showBibleView = false;
    if (book.length > 0 && chapter.length > 0 && verse.length > 0) {
      showBibleView = true;
      form.biblicalScope = citeBible;
      let library = "";
      if (this.state.selectedBiblicalLibrary) {
        library = this.state.selectedBiblicalLibrary;
      }
      form.biblicalGreekId = library + "~" + book + "~" + chapter + ":" + verse;
    }
    this.setState(
        {
          selectedBiblicalIdParts: [
            {key: "domain", label: "*"},
            {key: "topic", label: book},
            {key: "key", label: chapter + ":" + verse}
          ]
          , showBibleView
          , form: form
          , selectedBiblicalBook: book
          , selectedBiblicalChapter: chapter
          , selectedBiblicalVerse: verse
          , citeBible: citeBible
        }, this.validateForm
    );
  };


  handleOntologyRefChange = (entityId, entityName) => {
    let showOntologyView = false;
    if (entityId.length > 0) {
      showOntologyView = true;
    }
    let form = this.state.form;
    form.ontologicalEntityId = entityId;
    form.noteTitle = entityName;

    this.setState(
        {
          form: form
          , ontologyRefEntityName: entityName
          , showOntologyView: showOntologyView
          , title: entityName
        }, this.validateForm
    );
  };

  handleBiblicalLemmaChange = (e) => {
    let form = this.state.form;
    form.biblicalLemma = e.target.value;
    this.setState({form: form}, this.validateForm);
  };

  handleLiturgicalLemmaChange = (e) => {
    let form = this.state.form;
    form.liturgicalLemma = e.target.value;
    this.setState({form: form}, this.validateForm);
  };

  handleTitleChange = (e) => {
    let form = this.state.form;
    form.noteTitle = e.target.value;
    this.setState({form: form}, this.validateForm);
  };

  getBibleRefRow = () => {
    if (this.state.form.noteType && this.state.form.noteType === "REF_TO_BIBLE") {
      return (
          <BibleRefSelector
              session={this.props.session}
              callback={this.handleBibleRefChange}
              book={this.state.selectedBiblicalBook}
              chapter={this.state.selectedBiblicalChapter}
              verse={this.state.selectedBiblicalVerse}
          />
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  getOntologyRefRow = () => {
    if (this.state.form.noteType
        && this.state.form.noteType.startsWith("REF_TO")
        && (this.state.form.noteType !== ("REF_TO_BIBLE"))
    ) {
      let type = this.getOntologyLabel(this.state.form.noteType);
      return (
          <Row className="App show-grid App-Ontology-Ref-Selector-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.refersTo}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <div className={"App App-Ontology-Ref-Selector-Entity"}>
                <OntologyRefSelector
                    session={this.props.session}
                    type={type}
                    callback={this.handleOntologyRefChange}
                    initialValue={this.state.form.ontologicalEntityId}
                />
              </div>
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
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
    let form = this.state.form;
    let id = row["id"];
    if (id.startsWith("gr_")) {
      form.liturgicalGreekId = id;
      this.setState({ form: form, selectedLiturgicalGreekId: id })
    } else {
      form.liturgicalTranslationId = id;
      this.setState({ form: form, selectedLiturgicalTranslationId: id })
    }
  };

  handleBiblicalIdSelection = (row) => {
    let id = row["id"];
    let form = this.state.form;
    let biblicalIdParts = IdManager.getParts(id);

    if (id.startsWith("gr_")) {
      form.biblicalGreekId = id;
      this.setState({
        form: form
        , selectedBiblicalGreekId: id
        , selectedBiblicalLibrary: biblicalIdParts.library
      })
    } else {
      form.biblicalTranslationId = id;
      this.setState({ form: form, selectedBiblicalTranslationId: id })
    }
  };

  handleLibrariesCallback = ( type, id , libraries ) => {
    if (libraries) {
      let form = this.state.form;
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
        let biblicalIdParts = IdManager.getParts(id);
        let selectedBiblicalLibrary = biblicalIdParts.library;
        form.biblicalGreekId = id;
        this.setState({
          form: form
          , biblicalLibraries: {
            greekBibleId: id
            , libraries: libraries
            , greekDropdown: greekDropdown
            , translationDropdown: translationDropdown
          }
          , selectedBiblicalGreekId: id
          , selectedBiblicalLibrary: selectedBiblicalLibrary
        });
      } else {
        form.liturgicalGreekId = id;
        this.setState({
          form: form
          , liturgicalLibraries: {
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
            <Panel header={this.state.labels.thisClass.viewBiblicalText + ": " + this.state.citeBible} eventKey="TextNoteEditor">
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
      return (<span className="App App-no-display"></span>);
    }
  };


  getLiturgicalScopeRow = () => {
    return (
        <Row className="App show-grid  App-Text-Note-Editor-Scope-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.liturgicalScope}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <FormControl
                id={"fxLiturgicalScope"}
                className={"App App-Text-Note-Editor-Scope"}
                type="text"
                value={this.state.form.liturgicalScope}
                placeholder="scope"
                onChange={this.handleLiturgicalScopeChange}
            />
          </Col>
        </Row>
    );
  };

  getLiturgicalLemmaRow = () => {
    if (this.state.form.noteType === "UNIT") {
      return (<span className="App App-no-display"></span>);
    } else {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Lemma-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.liturgicalLemma}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fcLiturgicalLemma"}
                  className={"App App-Text-Note-Editor-Lemma"}
                  type="text"
                  value={this.state.form.liturgicalLemma}
                  placeholder="liturgical lemma"
                  onChange={this.handleLiturgicalLemmaChange}
              />
            </Col>
          </Row>
      );
    }
  };


  handleNoteLibraryChange = ( selection ) => {
    let form = this.state.form;
    form.library = selection["value"];
    this.setState({form: form}, this.validateForm);
  };

  getNoteLibraryRow = () => {
    if (
        this.props.session.userInfo.domains.author
        && this.state.form && this.state.form.library
        && this.state.form.library.length < 1
    ) {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.noteLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.props.session.userInfo.domain}
                  resources={this.props.session.userInfo.domains.author}
                  changeHandler={this.handleNoteLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  handleBiblicalTranslationLibraryChange = ( selection ) => {
    let form = this.state.form;
    form.biblicalTranslationId = selection["value"];
    this.setState({form: form}, this.validateForm);
  };

  getBiblicalTranslationLibraryRow = () => {
    if (this.state.form.noteType
        && this.state.form.noteType === "REF_TO_BIBLE"
        && this.state.biblicalLibraries
    ) {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalTranslationLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.form.biblicalTranslationId}
                  resources={this.state.biblicalLibraries.translationDropdown}
                  changeHandler={this.handleBiblicalTranslationLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  handleLiturgicalGreekLibraryChange = ( selection ) => {
    let form = this.state.form;
    form.liturgicalGreekId = selection["value"];
    let textIdParts = IdManager.getParts(selection["value"]);
    this.setState({
      form: form
      , textIdParts: textIdParts
      , selectedLiturgicalGreekId: selection["value"]
    }, this.validateForm);
  };

  getLiturgicalGreekLibraryRow = () => {
    if (this.state.liturgicalLibraries) {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Library-Row">
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
      return (
          <div>
            <Spinner message={this.state.labels.messages.retrieving}/>
          </div>
      );
    }
  };

  handleBiblicalGreekLibraryChange = ( selection ) => {
    let form = this.state.form;
    form.biblicalGreekId = selection["value"];
    this.setState({
      form: form
      , selectedLiturgicalGreekId: selection["value"]
    }, this.validateForm);
  };


  getBiblicalGreekLibraryRow = () => {
    if (this.state.form.noteType
        && this.state.form.noteType === "REF_TO_BIBLE") {
      if (this.state.biblicalLibraries) {
        return (
            <Row className="App show-grid  App-Text-Note-Editor-Library-Row">
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
        return (
            <div>
              <Spinner message={this.state.labels.messages.retrieving}/>
            </div>
        );
      }
    } else {
      return (<span className="App App-no-display"></span>);
    }

  };

  handleLiturgicalTranslationLibraryChange = ( selection ) => {
    let form = this.state.form;
    form.liturgicalTranslationId = selection["value"];
    this.setState({form: form}, this.validateForm);
  };

  getLiturgicalTranslationLibraryRow = () => {
    if (this.state.liturgicalLibraries && this.state.liturgicalLibraries.translationDropdown) {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Library-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.liturgicalTranslationLibrary}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.form.liturgicalTranslationId}
                  resources={this.state.liturgicalLibraries.translationDropdown}
                  changeHandler={this.handleLiturgicalTranslationLibraryChange}
                  multiSelect={false}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  getTitleRow = () => {
    if (this.state.form.noteType
        && this.state.form.noteType.startsWith("REF_TO")
        && (this.state.form.noteType !== ("REF_TO_BIBLE"))
    ) {
      return (<span className="App App-no-display"></span>);
    } else {
      return (
          <Row className="App show-grid App-Text-Note-Editor-Title-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.title}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fxEditorTitle"}
                  className={"App App-Text-Note-Editor-Title"}
                  type="text"
                  value={this.state.form.noteTitle}
                  placeholder="title"
                  onChange={this.handleTitleChange}
              />
            </Col>
          </Row>
      );
    }
  };

  getBiblicalScopeRow = () => {
    if (this.state.form.noteType && this.state.form.noteType === "REF_TO_BIBLE") {
      return (
          <Row className="App show-grid  App-Text-Note-Editor-Scope-Biblical-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalScope}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fxEditorBiblicalScope"}
                  className={"App App-Text-Note-Editor-Scope"}
                  type="text"
                  value={this.state.form.biblicalScope}
                  placeholder="scope"
                  onChange={this.handleBiblicalScopeChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }

  };

  getBiblicalLemmaRow = () => {
    if (this.state.form.noteType && this.state.form.noteType === "REF_TO_BIBLE") {
      return (


          <Row className="App show-grid  App-Text-Note-Editor-Lemma-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalLemma}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  id={"fcBibLemma"}
                  className={"App App-Text-Note-Editor-Lemma"}
                  type="text"
                  value={this.state.form.biblicalLemma}
                  placeholder="biblical lemma"
                  onChange={this.handleBiblicalLemmaChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  getNoteTypeRow = () => {

    let dropdowns = this.props.session.dropdowns.noteTypesDropdown;

    if (this.props.session.userInfo.domain === "en_us_epentiuc") {
      dropdowns = this.props.session.dropdowns.noteTypesBilDropdown;
    }
    return (
        <Row className="App show-grid App-Text-Note-Editor-Type-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.type}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <div className={"App App-Text-Note-Type-Selector"}>
              <ResourceSelector
                  title={""}
                  initialValue={this.state.form.noteType}
                  resources={dropdowns}
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
        <Row className="App show-grid App-Text-Note-Editor-Button-Row">
          <Col xs={12} md={12}>
            <Button
                className="App App-Button"
                bsStyle="primary"
                disabled={submitButtonDisabled}
                onClick={this.onSubmit}
            >
              {this.state.labels.buttons.submit}
            </Button>
            <span className="App App-Text-Editor-Workflow-Glyph">
              <Glyphicon glyph={this.state.workflow.statusIcon}/>
              <FontAwesome name={this.state.workflow.visibilityIcon}/>
            </span>
          </Col>
        </Row>
    );

  };

  mapTagsToObjectList = (tags) => {
    let list = [];
    let j = tags.length;
    for (let i=0; i < j; i++) {
      let v = tags[i];
      list.push({value: v, label: v});
    }
    return list;
  };

  getTagsRow = () => {
    return (
        <Well className="App App-Text-Note-Editor-Button-Row">
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
            library={this.state.form.library}
            status={this.state.form.status}
            visibility={this.state.form.visibility}
        />
    );

  };

  getLabel = (type) => {
    let label = "";
    let targetValue = type;
    if (
        this.props.session
        && this.props.session.dropdowns
    ) {
      if (! type) {
        targetValue = this.props.form.noteType;
      }
      let j = this.props.session.dropdowns.noteTypesDropdown.length;
      for (let i=0; i < j; i++) {
        let o = this.props.session.dropdowns.noteTypesDropdown[i];
        if (o.value === targetValue) {
          label = o.label;
          break;
        }
      }
    }
    return label;
  };

  getFormattedHeaderRow = () => {
    return (
        <Well>
          <div className="App App-Text-Note-formatted">
            <div className="App App-Text-Note-Type">
              <Glyphicon className="App App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
              <span className="App App-Text-Note-Type-As-Heading">{this.state.selectedTypeLabel}</span>
              <Glyphicon className="App App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
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
            note={this.state.form.valueFormatted}
            type={this.state.form.noteType}
            title={this.state.form.noteTitle}
            scopeLiturgical={this.state.form.liturgicalScope}
            lemmaLiturgical={this.state.form.liturgicalLemma}
            lemmaBiblical={this.state.form.biblicalLemma}
            scopeBiblical={this.state.form.biblicalScope}
            ontologyRefEntityName={this.state.ontologyRefEntityName}
        />
    );
  };

  createMarkup() {
    return {__html: this.state.form.valueFormatted};
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

  getSettingsWell = () => {
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
    if (this.state.form) {
      return (
          <Well>
            <Tabs id="App-Text-Node-Editor-Tabs" defaultActiveKey={"heading"} animation={false}>
              <Tab eventKey={"heading"} title={
                this.state.labels.thisClass.settings}>
                {this.getSettingsWell()}
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
    } else {
      return (
          <div>
            <Spinner message={this.state.labels.messages.retrieving}/>
          </div>
      );
    }
  };

  getEditor = () => {
    if (this.state.form) {
      return (
          <RichEditor
              session={this.props.session}
              handleEditorChange={this.handleEditorChange}
              content={this.state.form.valueFormatted}
              suggestions={this.state.suggestions}
          />
      );
    } else {
      return (
          <div>
            <Spinner message={this.state.labels.messages.retrieving}/>
          </div>
      );
    }
  };

  render() {
    return (
        <div className="App App-Text-Note-Editor">
          {this.getLiturgicalView()}
          {this.getBiblicalView()}
          <form>
            <FormGroup
            >
              <Well>
                <Grid>
                  <Row className="App show-grid">
                    <Col xs={12} md={12}>
                      <ControlLabel>
                        {this.state.labels.thisClass.note}: {this.state.selectedTypeLabel}
                      </ControlLabel>
                    </Col>
                  </Row>
                  <Row className="App show-grid  App-Text-Note-Editor-Row">
                    <Col xs={12} md={12}>
                      {this.getEditor()}
                    </Col>
                  </Row>
                  {this.getButtonRow()}
                  <HelpBlock>
                    <div><span className="App App-message"><FontAwesome
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
  , textId: PropTypes.string.isRequired
  , form: PropTypes.object
};

// set default values for props here
TextNoteEditor.defaultProps = {
};

export default TextNoteEditor;

