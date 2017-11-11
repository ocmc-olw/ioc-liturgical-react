import React from 'react';
import PropTypes from 'prop-types';
import {
  Accordion
  , Button
  , ControlLabel
  , Panel
  , Well
} from 'react-bootstrap';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import Server from './helpers/Server';
import Labels from './Labels';
import NotesLister from './NotesLister';
import Grammar from './modules/Grammar';
import Spinner from './helpers/Spinner';
import ViewReferences from './ViewReferences';

/**
 * Display a text edit, with source and models as rows.
 */
export class ParaRowTextEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state =
        {
          labels: {
            thisClass: Labels.getComponentParaTextEditorLabels(props.session.languageCode)
            , messages: Labels.getMessageLabels(props.session.languageCode)
            , search: Labels.getSearchLabels(props.session.languageCode)
          }
          , greekSourceValue: ""
          , greekSourceId: ""
          , showSearchResults: false
          , message: Labels.getSearchLabels(props.session.languageCode).msg1
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
          , matcher: "rx"
          , query: ".*"
        + props.idTopic
        + "~.*"
        + props.idKey
    };


    this.fetchData = this.fetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
    this.getTextArea = this.getTextArea.bind(this);
    this.getParaRows = this.getParaRows.bind(this);
  };

  componentWillMount = () => {
    this.fetchData();
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getComponentParaTextEditorLabels(props.session.languageCode)
            , messages: Labels.getMessageLabels(props.session.languageCode)
            , search: Labels.getSearchLabels(props.session.languageCode)
          }
          , message: Labels.getSearchLabels(props.session.languageCode).msg1
          , greekSourceValue: ""
          , greekSourceId: ""
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    this.handlePropsChange();
  }

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
  }

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
  }

  setMessage(message) {
    this.setState({
      message: message
    });
  }

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
                + response.data.valueCount
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

  getTextArea = () => {
    if (this.props.canChange) {
      return (
        <div className="row">
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
            <span className="App-message"><FontAwesome
                name={this.state.messageIcon}/>
              {this.state.message}
            </span>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div>
          <ControlLabel>
            {this.state.labels.thisClass.valueFor
            +" " + this.props.idLibrary }
          </ControlLabel>
          </div>
          <textarea
              className="App-Modal-Editor-TextArea"
              rows="4"
              cols="100"
              value={this.state.editorValue}
              readOnly
          >
          </textarea>
        </div>
      )
    }
  }

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
          <div>
            <ControlLabel>
              {this.state.labels.thisClass.showingMatchesFor + " " + this.props.idTopic + "~" + this.props.idKey}
            </ControlLabel>
            <div className="row">
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
        <div>
          {(! this.state.showSearchResults) ? <Spinner message={this.state.labels.messages.retrieving}/>
              :
              <div className="App-ParaRow-Text-Editor">
                {this.getParaRows()}
                <div>
                  <Well>
                    {this.getTextArea()}
                  </Well>
                </div>
              </div>
              }
          <Accordion>
            <Panel
                className="App-biblial-links-panel "
                header={
                  this.state.labels.thisClass.grammarPanelTitle
                }
                eventKey="grammarPanelTitle"
                collapsible
            >
              <Grammar
                  session={this.props.session}
                  idTopic={this.props.idTopic}
                  idKey={this.props.idKey}
              />
            </Panel>
            <Panel
                className="App-biblial-links-panel "
                header={
                  this.state.labels.thisClass.biblicalLinksPanelTitle
                }
                eventKey="biblicalLinksExplorer"
                collapsible
            >
              <ViewReferences
                  session={this.props.session}
                  id={
                    "gr_gr_cog~"
                    + this.props.idTopic
                    + "~"
                    + this.props.idKey
                  }
                  type={"REFERS_TO_BIBLICAL_TEXT"}
                  value={this.state.greekSourceValue}
              />
            </Panel>
            <Panel
                className="App-ontology-links-panel "
                header={
                  this.state.labels.thisClass.ontologyLinksPanelTitle
                }
                eventKey="linksExplorer"
                collapsible
            >
              <ViewReferences
                  session={this.props.session}
                  id={
                    "gr_gr_cog~"
                    + this.props.idTopic
                    + "~"
                    + this.props.idKey
                  }
                  type={"*"}
                  value={this.state.greekSourceValue}
              />
            </Panel>
            <Panel
                className="App-user-notes-panel "
                header={
                  this.state.labels.thisClass.userNotesPanelTitle
                }
                eventKey="usernotesExplorer"
                collapsible
            >
              <NotesLister
                  session={this.props.session}
                  type={"NoteUser"}
                  topicId={this.state.currentId}
                  topicText={this.props.value}
              />
            </Panel>
          </Accordion>
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

