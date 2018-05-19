import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
  , Checkbox
  , Col
  , ControlLabel
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
import Labels from './Labels';
import NotesLister from './NotesLister';
import Grammar from './modules/Grammar';
import Spinner from './helpers/Spinner';
import TextNotesLister from './TextNotesLister';

/**
 * Display a text to edit, with source and models as rows.
 */
export class ParaRowTextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state =
        {
          labels: {
            thisClass: Labels.getComponentParaTextEditorLabels(props.session.languageCode)
            , messages: Labels.getMessageLabels(props.session.languageCode)
            , buttons: Labels.getButtonLabels(props.session.languageCode)
            , search: Labels.getSearchLabels(props.session.languageCode)
          }
          , greekSourceValue: ""
          , greekSourceId: ""
          , showSearchResults: false
          , message: Labels.getSearchLabels(props.session.languageCode).msg1
          , downloadMessage: ""
          ,
          messageIcon: this.messageIcons.info
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
          , includeAdviceNotes: false
          , includePersonalNotes: false
          , includeGrammar: false
          , combineNotes: false
          , showDownloadLinks: false
          , preparingDownloads: false
    };

    this.fetchData = this.fetchData.bind(this);
    this.getDownloadLinks = this.getDownloadLinks.bind(this);
    this.getParaRows = this.getParaRows.bind(this);
    this.getTabs = this.getTabs.bind(this);
    this.getTextArea = this.getTextArea.bind(this);
    this.handleDownloadRequest = this.handleDownloadRequest.bind(this);
    this.handleDownloadCallback = this.handleDownloadCallback.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleIncludeAdviceNotesChange = this.handleIncludeAdviceNotesChange.bind(this);
    this.handleIncludeGrammarChange = this.handleIncludeGrammarChange.bind(this);
    this.handleIncludePersonalNotesChange = this.handleIncludePersonalNotesChange.bind(this);
    this.handleCombineNotesChange = this.handleCombineNotesChange.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setMessage = this.setMessage.bind(this);
  };

  componentWillMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getComponentParaTextEditorLabels(props.session.languageCode)
            , messages: Labels.getMessageLabels(props.session.languageCode)
            , buttons: Labels.getButtonLabels(props.session.languageCode)
            , search: Labels.getSearchLabels(props.session.languageCode)
          }
          , message: Labels.getSearchLabels(props.session.languageCode).msg1
          , greekSourceValue: ""
          , greekSourceId: ""
          , includeAdviceNotes: get(this.state, "includeAdviceNotes", false)
          , includeGrammar: get(this.state, "includeGrammar", false)
          , includePersonalNotes: get(this.state, "includePersonalNotes", false)
          , combineNotes: get(this.state, "combineNotes", false)
        }
      }, function () { return this.handleStateChange("place holder")});
    }
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
          if (greekSource) {
            greekSourceId = greekSource.id;
            greekSourceValue = greekSource.value;
          }
          let values = response.data.values.filter((row) => {
            return row.value.length > 0;
          });
          response.data.values = values;
          this.setState({
                data: response.data
                , greekSourceId: greekSourceId
                , greekSourceValue: greekSourceValue
              }
          );
          let message = "No docs found...";
          if (response.data.valueCount && response.data.valueCount > 0) {
            message = this.state.labels.search.msg3
                + " "
                + values.length
                + " "
                + this.state.labels.search.msg4
                + "."
          }
          this.setState({
                message: message
                , messageIcon: this.messageIcons.info
                , showSearchResults: true
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "no docs found";
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }

  handleIncludeAdviceNotesChange = (evt) => {
    this.setState({ includeAdviceNotes: evt.target.checked });
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
    let parms =
    "ia=" + encodeURIComponent(includeAdviceNotes)
    + "&ip=" + encodeURIComponent(includePersonalNotes)
    + "&ig=" + encodeURIComponent(includeGrammar)
    + "&cn=" + encodeURIComponent(combineNotes)
    + "&al=" + encodeURIComponent(this.props.idLibrary);

    Server.getTextDownloads(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , id
        , parms
        , this.handleDownloadCallback
    );
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
    if (this.props.canChange) {
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
                    disabled={this.state.editorValue === this.props.value}
                    onClick={this.handleSubmit}
                >
                  {this.state.labels.thisClass.submit}
                </Button>
                <span className="App App-message"><FontAwesome
                    name={this.state.messageIcon}/>
                  {this.state.message}
                </span>
              </div>
              </Well>
            </div>
      )
    } else {
      return (<span className="App App-no-display"></span>);
    }
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
                  <Row  className="App-Info-Row">
                    <Col className="" xs={6} md={6}>
                      <Checkbox
                          checked={this.state.includePersonalNotes}
                          onChange={this.handleIncludePersonalNotesChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.includePersonalNotes}
                      </Checkbox>
                    </Col>
                    <Col className="" xs={6} md={6}>
                      <Checkbox
                          checked={this.state.includeAdviceNotes}
                          onChange={this.handleIncludeAdviceNotesChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.includeAdviceNotes}
                      </Checkbox>
                    </Col>
                  </Row>
                  <Row  className="App-Info-Row">
                    <Col className="" xs={6} md={6}>
                      <Checkbox
                          checked={this.state.includeGrammar}
                          onChange={this.handleIncludeGrammarChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.includeGrammar}
                      </Checkbox>
                    </Col>
                    <Col className="" xs={6} md={6}>
                      <Checkbox
                          checked={this.state.combineNotes}
                          onChange={this.handleCombineNotesChange}
                          inline={true}
                      >
                        {this.state.labels.thisClass.combineNotes}
                      </Checkbox>
                    </Col>
                  </Row>
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
            </Tabs>
          </Well>
          </div>
      );
  };


  handleEditorChange = (event) => {
    this.setState({
      editorValue: event.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  handleSubmit = (event) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(
          this.state.editorValue
      );
    }
  }

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
  }
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
  , message: PropTypes.string
  , messageIcon: PropTypes.string
};
export default ParaRowTextEditor;

