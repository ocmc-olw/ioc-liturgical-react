import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
  , Checkbox
  , Col
  , ControlLabel
  , FormControl
  , Glyphicon
  , Grid
  , Row
  , Tab
  , Tabs
  , Well
} from 'react-bootstrap';
import { get } from 'lodash';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import Server from './helpers/Server';
import NotesLister from './NotesLister';
import Grammar from './modules/Grammar';
import Spinner from './helpers/Spinner';
import TextNotesLister from './TextNotesLister';
import ResourceSelector from './modules/ReactSelector';
import WorkflowForm from './helpers/WorkflowForm';

/**
 * Display a text to edit, with source and models as rows.
 */
export class ParaRowTextEditor extends React.Component {

  constructor(props) {
    super(props);

    let pdfSubTitle = "";
    let prefs = {};
    if (props.session.userInfo && props.session.userInfo.prefs) {
      prefs = props.session.userInfo.prefs;
      if (prefs.includeNotesTransAdvice) {
        pdfSubTitle = "A Liturgical Translator's Manual";
      }
    }
    let citeData = [];
    if (props.session.dropdowns) {
      citeData = props.session.dropdowns.bibTexStylesDropdown;
    }
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state =
        {
          labels: {
            thisClass: labels[labelTopics.ParaTextEditor]
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , search: labels[labelTopics.search]
          }
          , citeData: citeData
          , citeStyle: prefs.bibLatexStyle ? prefs.bibLatexStyle : "authoryear"
          , greekSourceValue: ""
          , greekSourceId: ""
          , showSearchResults: false
          , message: get(this.state,"message", labels[labelTopics.search].msg1)
          , downloadMessage: ""
          ,
          messageIcon: get(this.state,"messageIcon", this.messageIcons.info)
          ,
          data: {values: [{"id": "", "value:": ""}]}
          ,
          options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          ,
          showSelectionButtons: false
          ,
          selectedId: ""
          ,
          selectedValue: ""
          ,
          selectedIdPartsPrompt: "Select one or more ID parts, then click on the search icon:"
          ,
          selectedIdParts: [
            {key: "domain", label: ""},
            {key: "topic", label: ""},
            {key: "key", label: ""}
          ]
          , showIdPartSelector: false
          , idColumnSize: "80px"
          , editorValue: props.value
          , currentDocType: props.docType
          , currentId: props.idLibrary + "~" + props.idTopic + "~" + props.idKey
          , currentIdLibrary: props.idLibrary
          , currentIdTopic: props.idTopic
          , currentIdKey: props.idKey
          , domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "id"
          , matcher: "ew"
          , query: "~"
            + props.idTopic
            + "~"
            + props.idKey
          , pdfId: ""
          , pdfTitle: ""
          , pdfSubTitle: pdfSubTitle
          , pdfAuthor: prefs.author ? prefs.author : ""
          , pdfAuthorTitle: prefs.authorTitle ? prefs.authorTitle : ""
          , pdfAuthorAffiliation: prefs.authorAffiliation ? prefs.authorAffiliation : ""
          , includeAdviceNotes: prefs.includeNotesTransAdvice ? prefs.includeNotesTransAdvice : ""
          , includePersonalNotes: prefs.includeNotesUser ? prefs.includeNotesUser : ""
          , includeGrammar: prefs.includeGrammar ? prefs.includeGrammar : ""
          , combineNotes: prefs.combineNotes ? prefs.combineNotes : ""
          , createToc: prefs.createToc ? prefs.createToc : ""
          , showDownloadLinks: false
          , preparingDownloads: false
          , biblatex: "http://ftp.math.purdue.edu/mirrors/ctan.org/macros/latex/contrib/biblatex/doc/biblatex.pdf"
          , submitDisabled: true
    };

    this.fetchData = this.fetchData.bind(this);
    this.getDownloadLinks = this.getDownloadLinks.bind(this);
    this.getParaRows = this.getParaRows.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTextArea = this.getTextArea.bind(this);
    this.getTitleRow = this.getTitleRow.bind(this);
    this.getWorkflowPanel = this.getWorkflowPanel.bind(this);
    this.getStatusIcon = this.getStatusIcon.bind(this);
    this.getVisibilityIcon = this.getVisibilityIcon.bind(this);
    this.handleciteStyleChange = this.handleciteStyleChange.bind(this);
    this.handleDownloadRequest = this.handleDownloadRequest.bind(this);
    this.handleDownloadCallback = this.handleDownloadCallback.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleIncludeAdviceNotesChange = this.handleIncludeAdviceNotesChange.bind(this);
    this.handleIncludeGrammarChange = this.handleIncludeGrammarChange.bind(this);
    this.handleIncludePersonalNotesChange = this.handleIncludePersonalNotesChange.bind(this);
    this.handleCombineNotesChange = this.handleCombineNotesChange.bind(this);
    this.handleCreateTocChange = this.handleCreateTocChange.bind(this);
    this.handlePdfAuthorChange = this.handlePdfAuthorChange.bind(this);
    this.handlePdfAuthorAffiliationChange = this.handlePdfAuthorAffiliationChange.bind(this);
    this.handlePdfAuthorTitleChange = this.handlePdfAuthorTitleChange.bind(this);
    this.handlePdfTitleChange = this.handlePdfTitleChange.bind(this);
    this.handlePdfSubTitleChange = this.handlePdfSubTitleChange.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.handleWorkflowCallback = this.handleWorkflowCallback.bind(this);
    this.notifyParentValueChanged = this.notifyParentValueChanged.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.submitDisabled = this.submitDisabled.bind(this);
  };

  componentWillMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps = (nextProps) => {
    let prefs = {};
    let pdfSubTitle = get(this.state, "pdfSubTitle", "");
    if (nextProps.session.userInfo && nextProps.session.userInfo.prefs) {
      prefs = nextProps.session.userInfo.prefs;
      if (pdfSubTitle.length === 0 && prefs.includeNotesTransAdvice) {
        pdfSubTitle = "A Liturgical Translator's Manual";
      }
    }
    let citeData = [];
    if (nextProps.session.dropdowns) {
      citeData = nextProps.session.dropdowns.bibTexStylesDropdown;
    }
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;

    this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: labels[labelTopics.ParaTextEditor]
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , search: labels[labelTopics.search]
          }
          , message: get(prevState,"message", labels[labelTopics.search].msg1)
          , messageIcon: get(prevState,"messageIcon", this.messageIcons.info)
          , greekSourceValue: ""
          , greekSourceId: ""
          , citeData: citeData
          , citeStyle: prefs.bibLatexStyle ? prefs.bibLatexStyle : "authoryear"
          , pdfSubTitle: pdfSubTitle
          , pdfAuthor: prefs.author ? prefs.author : ""
          , pdfAuthorTitle: prefs.authorTitle ? prefs.authorTitle : ""
          , pdfAuthorAffiliation: prefs.authorAffiliation ? prefs.authorAffiliation : ""
          , includeAdviceNotes: prefs.includeNotesTransAdvice ? prefs.includeNotesTransAdvice : ""
          , includePersonalNotes: prefs.includeNotesUser ? prefs.includeNotesUser : ""
          , includeGrammar: prefs.includeGrammar ? prefs.includeGrammar : ""
          , combineNotes: prefs.combineNotes ? prefs.combineNotes : ""
          , createToc: prefs.createToc ? prefs.createToc : ""
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    this.handlePropsChange();
  };

  /**
   * Because we are passing back the value each time it changes,
   * componentWillReceiveProps keeps getting called.
   * We don't want that to result in calling fetchData unless
   * the docType, library, topic, or key changed.
   */
  handlePropsChange = () => {
    if (this.state.currentDocType !== this.props.docType
      || this.state.currentIdLibrary !== this.props.idLibrary
        || this.state.currentIdTopic !== this.props.idTopic
        || this.state.currentIdKey !== this.props.idKey
    ) {
      this.fetchData();
    }
  };

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  };

  fetchData() {
    this.setState({
      message: this.state.labels.search.msg2
      , messageIcon: this.messageIcons.info
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.props.docType)
            + "&d=" + encodeURIComponent(this.state.domain)
            + "&b=" + encodeURIComponent(this.state.selectedBook)
            + "&c=" + encodeURIComponent(this.state.selectedChapter)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
        ;
    let path = this.props.session.restServer + Server.getWsServerDbApi() + 'docs' + parms;
    axios.get(path, config)
        .then(response => {
          let greekSource = response.data.values.find( o => o.id.startsWith("gr_gr_cog"));
          let greekSourceId = "";
          let greekSourceValue = "";
          let pdfTitle = this.state.pdfTitle;
          if (greekSource) {
            greekSourceId = greekSource.id;
            greekSourceValue = greekSource.value;
            if (pdfTitle.length === 0) {
              if (greekSourceValue.length > 31) {
                let words = greekSourceValue.substring(0,30).split(/[\s,.;]/);
                if (words.length > 4) {
                  pdfTitle = words[0] + " " + words[1] + " " + words[2]  + " " + words[3];
                } else if (words.length > 3) {
                  pdfTitle = words[0] + " " + words[1] + " " + words[2];
                } else if (words.length > 2) {
                  pdfTitle = words[0] + " " + words[1];
                } else {
                  pdfTitle = words[0];
                }
              } else {
                pdfTitle = greekSourceValue.substring(0,30);
              }
            }
          }
          let thisText = response.data.values.find( o => o.id === (this.props.idLibrary
            + "~"
              + this.props.idTopic
              + "~"
              + this.props.idKey
          ));
          let workflow = {
            assignedTo: ""
            , status: "EDITING"
            , visibility: "PRIVATE"
            , statusIcon: "edit"
            , visibilityIcon: "share-alt"
          };
          let originalWorkflow = {
            assignedTo: ""
            , status: "EDITING"
            , visibility: "PRIVATE"
          };
          try {
            if (thisText) {
              if (thisText.status) {
                let theStatus = thisText.status;
                workflow.status = thisText.status;
                originalWorkflow.status = theStatus;
                workflow.statusIcon = this.getStatusIcon(thisText.status);
              }
              if (thisText.visibility) {
                let theVisibility = thisText.visibility;
                workflow.visibility = thisText.visibility;
                originalWorkflow.visibility = theVisibility;
                workflow.visibilityIcon = this.getVisibilityIcon(thisText.visibility);
              }
            }
          } catch (err) {
            console.log(err);
          }
          let values = response.data.values.filter((row) => {
            return row.value.length > 0;
          });
          response.data.values = values;

          let resultCount = 0;
          let message = this.state.labels.search.foundNone;
          let found = this.state.labels.search.foundMany;
          if (values) {
            resultCount = values.length;
            if (resultCount === 0) {
              message = this.state.labels.search.foundNone;
            } else if (resultCount === 1) {
              message = this.state.labels.search.foundOne;
            } else {
              message = found
                  + " "
                  + resultCount
                  + ".";
            }
          }

          this.setState({
                message: message
                , messageIcon: this.messageIcons.info
                , showSearchResults: true
                , data: response.data
                , greekSourceId: greekSourceId
                , greekSourceValue: greekSourceValue
                , pdfTitle: pdfTitle
                , thisText: thisText
                , workflow: workflow
                , originalWorkflow: originalWorkflow
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = this.state.labels.search.foundNone;
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }

  handleIncludeAdviceNotesChange = (evt) => {
    let pdfSubTitle = this.state.pdfSubTitle;
    if (this.state.includeAdviceNotes) {
      if (pdfSubTitle && pdfSubTitle.startsWith("A Liturgical Translator's")) {
        pdfSubTitle = "";
      }
    } else {
      if (! pdfSubTitle) {
        pdfSubTitle = "A Liturgical Translator's Manual";
      }
    }
    this.setState(
        {
          includeAdviceNotes: evt.target.checked
          , pdfSubTitle: pdfSubTitle
        });
  };

  handleIncludePersonalNotesChange = (evt) => {
    this.setState({ includePersonalNotes: evt.target.checked });
  };

  handleIncludeGrammarChange = (evt) => {
    this.setState({ includeGrammar: evt.target.checked });
  };

  handleCombineNotesChange = (evt) => {
    this.setState({ combineNotes: evt.target.checked });
  };

  handleCreateTocChange = (evt) => {
    this.setState({ createToc: evt.target.checked });
  };

  getDownloadLinks = () => {
    if (this.state.showDownloadLinks) {
      let url = "data/" + this.state.pdfId;
      return (
          <Row className="App-Download-Row">
            <Col className="App-Download-Col" xs={3} md={3}>
              <a href={url + ".pdf"} target={"_blank"}>{this.state.labels.buttons.downloadAsPdf}</a>
            </Col>
            <Col className="App-Download-Col" xs={4} md={4}>
              <a href={url + ".tex"} target={"_blank"}>{this.state.labels.buttons.downloadAsTex}</a>
            </Col>
            <Col className="App-Download-Col" xs={5} md={5}>
              <a href={url + ".bib"} target={"_blank"}>{this.state.labels.buttons.downloadAsTexBib}</a>
            </Col>
          </Row>
      );
    } else {
      if (this.state.preparingDownloads) {
        return (
            <Row className="App-Download-Row">
              <Col className="App-Download-Col" xs={12} md={12}>
                <Spinner message={this.state.labels.messages.preparingPdf}/>
              </Col>
            </Row>
        );
      } else {
        return (<span></span>);
      }
    }
  };


  handleciteStyleChange = (selection) => {
    this.setState({
      citeStyle: selection["value"]
    });
  };

  handleDownloadRequest = () => {
    this.setState({
      preparingDownloads: true
      , showDownloadLinks: false
    });

    let id = "gr_gr_cog/"
        + this.props.idTopic
        + "/"
        + this.props.idKey
    ;


    let includeAdviceNotes = "false";
    let includePersonalNotes = "false";
    let includeGrammar = "false";
    let combineNotes = "false";
    let createToc = "false";

    if (this.state.includeAdviceNotes) {
      includeAdviceNotes = "true";
    }
    if (this.state.includePersonalNotes) {
      includePersonalNotes = "true";
    }
    if (this.state.includeGrammar) {
      includeGrammar = "true";
    }
    if (this.state.combineNotes) {
      combineNotes = "true";
    }
    if (this.state.includePersonalNotes) {
      includePersonalNotes = "true";
    }
    if (this.state.createToc) {
      createToc = "true";
    }
    let parms =
    "ia=" + encodeURIComponent(includeAdviceNotes)
    + "&ip=" + encodeURIComponent(includePersonalNotes)
    + "&ig=" + encodeURIComponent(includeGrammar)
    + "&cn=" + encodeURIComponent(combineNotes)
    + "&toc=" + encodeURIComponent(createToc)
    + "&al=" + encodeURIComponent(this.props.idLibrary)
    + "&mt=" + encodeURIComponent(this.state.pdfTitle)
    + "&st=" + encodeURIComponent(this.state.pdfSubTitle)
    + "&au=" + encodeURIComponent(this.state.pdfAuthor)
    + "&at=" + encodeURIComponent(this.state.pdfAuthorTitle)
    + "&af=" + encodeURIComponent(this.state.pdfAuthorAffiliation)
    + "&cs=" + encodeURIComponent(this.state.citeStyle)
    ;

    Server.getTextDownloads(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , id
        , parms
        , this.handleDownloadCallback
    );
  };

  getWorkflowPanel = () => {
    if (this.props.canChange && ! this.props.idLibrary.includes("_sys_")) {
      return (
          <Tab eventKey={"workflow"} title={this.state.labels.thisClass.workflowPanel}>
            <Well>
              <WorkflowForm
                  session={this.props.session}
                  callback={this.handleWorkflowCallback}
                  library={this.props.idLibrary}
                  status={this.state.workflow.status}
                  visibility={this.state.workflow.visibility}
              />
            </Well>
          </Tab>
      );
    }
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

  handleWorkflowCallback = ( visibility, status, assignedTo ) => {
    if (visibility && status) {
      let statusIcon = this.getStatusIcon(status);
      let visibilityIcon = this.getVisibilityIcon(visibility);
      let workflow = this.state.workflow;
      workflow.status = status;
      workflow.visibility = visibility;
      workflow.assignedToUser = assignedTo;
      workflow.visibilityIcon = visibilityIcon;
      workflow.statusIcon = statusIcon;
      this.setState(
          {
            workflow: workflow
          }, this.submitDisabled()
      );
    }
  };



  getPdf = () => {
    this.setState({
      preparingDownloads: true
      , showDownloadLinks: false
    });

    let parms =
        "id=" + encodeURIComponent(id)
    ;

    Server.restGetPdf(
        this.props.session.restServer
        , Server.getDbServerAgesPdfApi()
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , parms
        , this.state.pdfFilename
    )
        .then( response => {
          this.setState(
              {
                data: response
                , preparingDownloads: false
                , showDownloadLinks: true
              }
          );
        })
        .catch( error => {
          this.setState(
              {
                data: {
                  values:
                      [
                        {
                          "id": ""
                          , "library": ""
                          , "topic": ""
                          , "key": ""
                          , "value:": ""
                        }
                      ]
                  , userMessage: error.userMessage
                  , developerMessage: error.developerMessage
                  , messageIcon: error.messageIcon
                  , status: error.status
                  , showSearchResults: false
                  , resultCount: 0
                  , fetching: false
                }
              })
        })
    ;
  };

  handleDownloadCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      let data = restCallResult.data.values[0];
      let pdfId = data.pdfId;
      let pdfFilename = data.pdfFilename;

      this.setState(
          {
            pdfId: pdfId
            , pdfFilename: pdfFilename
            , preparingDownloads: false
            , showDownloadLinks: true
          }
      );
    }
  };

  handlePdfStatusCallback = (result) => {
    let statusMessage = this.state.labels.messages.couldNotGenerate;
    let showPdfButton = false;
    if (result.code === 200) {
      let statusMessage = "";
      showPdfButton = true;
    }
    this.setState({
      fetchingPdf: false
      , showPdfButton: showPdfButton
      , generationStatusMessage: statusMessage
    });
  };


  getTextArea = () => {
    if (this.props.canChange && ! this.props.idLibrary.includes("_sys_")) {
      return (
          <div className="row">
          <Well>
              <div>
              <ControlLabel>
                {this.state.labels.thisClass.yourTranslation
                + " (" + this.props.idLibrary + ")"}
              </ControlLabel>
              </div>
              <textarea
                  className="App-Modal-Editor-TextArea"
                  rows="4"
                  cols="100"
                  spellCheck="true"
                  value={this.state.editorValue}
                  onChange={this.handleEditorChange}
              >
              </textarea>
              <div>
                <Button
                    type="submit"
                    bsStyle="primary"
                    disabled={this.state.submitDisabled}
                    onClick={this.handleSubmit}
                >
                  {this.state.labels.thisClass.submit}
                </Button>
                <span className="App App-message"><FontAwesome
                    name={this.state.messageIcon}/>
                  {this.state.message}
                </span>
                <span className="App App-Text-Editor-Workflow-Glyph">
              <Glyphicon glyph={this.state.workflow.statusIcon}/>
              <FontAwesome name={this.state.workflow.visibilityIcon}/>
            </span>
              </div>
              </Well>
            </div>
      )
    } else {
      return (<span className="App App-no-display"></span>);
    }
  };

  submitDisabled = () => {
    if (this.state.editorValue === this.props.value
      && this.state.originalWorkflow.status === this.state.workflow.status
        && this.state.originalWorkflow.visibility === this.state.workflow.visibility
    ) {
      this.setState({submitDisabled: true});
    } else {
      this.setState({submitDisabled: false});
    }
  };

  handlePdfAuthorChange = (e) => {
    this.setState({pdfAuthor: e.target.value});
  };

  handlePdfAuthorAffiliationChange = (e) => {
    this.setState({pdfAuthorAffiliation: e.target.value});
  };

  handlePdfAuthorTitleChange = (e) => {
    this.setState({pdfAuthorTitle: e.target.value});
  };

  handlePdfTitleChange = (e) => {
    this.setState({pdfTitle: e.target.value});
  };

  handlePdfSubTitleChange = (e) => {
    this.setState({pdfSubTitle: e.target.value});
  };

  getTitleRow = () => {
    return (
        <div>
        <Row className="App show-grid App-PDF-Title-Row">
          <Col xs={3} md={3}>
            <ControlLabel>{this.state.labels.thisClass.pdfTitle}:</ControlLabel>
          </Col>
          <Col xs={9} md={9}>
            <FormControl
                id={"fxPdfTitle"}
                className={"App App-PDF-Title"}
                type="text"
                value={this.state.pdfTitle}
                placeholder={this.state.labels.thisClass.pdfTitle}
                onChange={this.handlePdfTitleChange}
            />
          </Col>
        </Row>
          <Row className="App show-grid App-PDF-Title-Row">
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.pdfSubTitle}:</ControlLabel>
            </Col>
            <Col xs={9} md={9}>
              <FormControl
                  id={"fxPdfSubTitle"}
                  className={"App App-PDF-Title"}
                  type="text"
                  value={this.state.pdfSubTitle}
                  placeholder={this.state.labels.thisClass.pdfSubTitle}
                  onChange={this.handlePdfSubTitleChange}
              />
            </Col>
          </Row>
          <Row className="App show-grid App-PDF-Author-Row">
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.pdfAuthor}:</ControlLabel>
            </Col>
            <Col xs={9} md={9}>
              <FormControl
                  id={"fxPdfAuthor"}
                  className={"App App-PDF-Author"}
                  type="text"
                  value={this.state.pdfAuthor}
                  placeholder={this.state.labels.thisClass.pdfAuthor}
                  onChange={this.handlePdfAuthorChange}
              />
            </Col>
          </Row>
          <Row className="App show-grid App-PDF-Author-Row">
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.pdfAuthorTitle}:</ControlLabel>
            </Col>
            <Col xs={9} md={9}>
              <FormControl
                  id={"fxPdfAuthorTitle"}
                  className={"App App-PDF-Author"}
                  type="text"
                  value={this.state.pdfAuthorTitle}
                  placeholder={this.state.labels.thisClass.pdfAuthorTitle}
                  onChange={this.handlePdfAuthorTitleChange}
              />
            </Col>
          </Row>
          <Row className="App show-grid App-PDF-Author-Row">
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.pdfAuthorAffiliation}:</ControlLabel>
            </Col>
            <Col xs={9} md={9}>
              <FormControl
                  id={"fxPdfAuthorAffiliation"}
                  className={"App App-PDF-Author"}
                  type="text"
                  value={this.state.pdfAuthorAffiliation}
                  placeholder={this.state.labels.thisClass.pdfAuthorAffiliation}
                  onChange={this.handlePdfAuthorAffiliationChange}
              />
            </Col>
          </Row>
          <Row className="App show-grid App-PDF-BibStyle-Row">
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.citeStyle}:</ControlLabel>
            </Col>
            <Col xs={5} md={5}>
              <div className="App-PDF-BibStyle-Dropdown">
              <ResourceSelector
                  title={""}
                  initialValue={this.state.citeStyle}
                  resources={this.state.citeData}
                  changeHandler={this.handleciteStyleChange}
                  multiSelect={false}
              />
              </div>
            </Col>
            <Col xs={4} md={4}>
              <a className="App-See-Biblatex" href={this.state.biblatex} target={"_blank"}>{this.state.labels.thisClass.seeBiblatex}</a>
            </Col>
          </Row>
        </div>
    );
  };

  getTabs = () => {
      return (
          <div className="row">
          <Well>
            <Tabs id="App-Text-Node-Editor-Tabs" animation={false}>
              <Tab eventKey={"textnotes"} title={
                this.state.labels.thisClass.textualNotesPanelTitle}>
                <Well>
                  <TextNotesLister
                      session={this.props.session}
                      topicId={this.state.currentId}
                      topicText={this.props.value}
                  />
                </Well>
              </Tab>
              <Tab eventKey={"grammar"} title={
                this.state.labels.thisClass.grammarPanelTitle}>
                <Grammar
                    session={this.props.session}
                    idTopic={this.props.idTopic}
                    idKey={this.props.idKey}
                />
              </Tab>
              <Tab eventKey={"usernote"} title={
                this.state.labels.thisClass.userNotesPanelTitle}>
                <Well>
                <NotesLister
                    session={this.props.session}
                    type={"NoteUser"}
                    topicId={this.state.currentId}
                    topicText={this.props.value}
                />
                </Well>
              </Tab>
              <Tab eventKey={"download"} title={
                this.state.labels.thisClass.downloadPanelTitle}>
                <Well>
                  <Well>
                    {this.getTitleRow()}
                    <Row>
                      <Col className="App-Info-Row" xs={12} md={12}>
                        <Checkbox
                            checked={this.state.combineNotes}
                            onChange={this.handleCombineNotesChange}
                            inline={true}
                        >
                          {this.state.labels.thisClass.combineNotes}
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="App-Info-Row" xs={12} md={12}>
                        <Checkbox
                            checked={this.state.createToc}
                            onChange={this.handleCreateTocChange}
                            inline={true}
                        >
                          {this.state.labels.thisClass.createToc}
                        </Checkbox>
                      </Col>
                    </Row>
                    <Row  className="App-Info-Row">
                      <Col className="" xs={12} md={12}>
                        <Checkbox
                            checked={this.state.includeGrammar}
                            onChange={this.handleIncludeGrammarChange}
                            inline={true}
                        >
                          {this.state.labels.thisClass.includeGrammar}
                        </Checkbox>
                      </Col>
                    </Row>
                  <Row  className="App-Info-Row">
                    <Col className="" xs={12} md={12}>
                      <Checkbox
                          checked={this.state.includePersonalNotes}
                          onChange={this.handleIncludePersonalNotesChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.includePersonalNotes}
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row>
                    <Col className="App-Info-Row" xs={12} md={12}>
                      <Checkbox
                          checked={this.state.includeAdviceNotes}
                          onChange={this.handleIncludeAdviceNotesChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.includeAdviceNotes}
                      </Checkbox>
                    </Col>
                  </Row>
                  </Well>
                  <Row  className="App-Info-Row">
                  <Button
                      type="submit"
                      bsStyle="primary"
                      onClick={this.handleDownloadRequest}
                  >
                    {this.state.labels.buttons.createFiles}
                  </Button>
                  </Row>
                  {this.getDownloadLinks()}
                </Well>
              </Tab>
              {this.getWorkflowPanel()}
            </Tabs>
          </Well>
          </div>
      );
  };


  handleEditorChange = (event) => {
    this.setState({
      editorValue: event.target.value
    }, this.submitDisabled);
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  };

  notifyParentValueChanged = () => {
    if (this.props.onSubmit
        && this.state.message === this.state.labels.messages.updated) {
      this.props.onSubmit(
          this.state.editorValue
      );
    }
  };

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      let message = restCallResult.message;
      if (message === "OK") {
        message = this.state.labels.messages.updated;
      }
      this.setState({
        message: message
        , messageIcon: restCallResult.messageIcon
      },this.notifyParentValueChanged);
    }
  };

  handleSubmit = (event) => {
    this.setState({
      message: this.state.labels.messages.updating
      , messageIcon: this.messageIcons.info
    });
    let parms =
        "i=" + encodeURIComponent(
            this.props.idLibrary
        + "~"
        + this.props.idTopic
        + "~" + this.props.idKey
        )
        + "&t=" + encodeURIComponent("Liturgical")
    ;
    Server.putValue(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , {
          value: this.state.editorValue
          , seq: undefined
          , status: this.state.workflow.status
          , visibility: this.state.workflow.visibility
        }
        , parms
        , this.handleValueUpdateCallback
    );

  };

  getParaRows = () => {
    if (this.state.showSearchResults) {
      return (
            <div className="row">
              <ControlLabel>
                {this.state.labels.thisClass.showingMatchesFor + " " + this.props.idTopic + "~" + this.props.idKey}
              </ControlLabel>
              <Well>
                <BootstrapTable
                    data={this.state.data.values}
                    trClassName={"App-data-tr"}
                    striped
                    hover
                    pagination
                    options={ this.state.options }
                >
                  <TableHeaderColumn
                      isKey
                      dataField='id'
                      dataSort={ true }
                      hidden
                  >ID</TableHeaderColumn>
                  <TableHeaderColumn
                      dataField='library'
                      dataSort={ true }
                      width={this.state.idColumnSize}>Domain</TableHeaderColumn>
                  <TableHeaderColumn
                      dataField='value'
                      dataSort={ true }
                  >Value</TableHeaderColumn>
                </BootstrapTable>
              </Well>
            </div>
      )
    } else {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      )
    }
  };
  render() {
    return (
        <div className="App App-Text-Note-Editor">
          {(! this.state.showSearchResults) ? <Spinner message={this.state.labels.messages.retrieving}/>
              :
              <div className="App-ParaRow-Text-Editor">
                <Grid>
                {this.getParaRows()}
                {this.getTextArea()}
                {this.getTabs()}
                </Grid>
              </div>
              }
        </div>
    );
  }
}

ParaRowTextEditor.propTypes = {
  session: PropTypes.object.isRequired
  , docType: PropTypes.string.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , value: PropTypes.string.isRequired
  , canChange: PropTypes.bool.isRequired
  , canReview: PropTypes.bool
  , onSubmit: PropTypes.func
  , onChange: PropTypes.func
};
export default ParaRowTextEditor;

