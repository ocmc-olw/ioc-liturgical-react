import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import ModalTextNoteEditor from './modules/ModalTextNoteEditor';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Panel, PanelGroup} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';
import IdManager from './helpers/IdManager';
import FormattedTextNote from './FormattedTextNote';
import User from "./classes/User";

/**
 *
 * The TextNotesLister searches for notes about the liturgical text and its references
 *
 * Trouble-shooting: if notes are in the database, but not being returned, it is likely
 * that the notes were created while logged in as wsadmin.  The notes only show for
 * the user who logged in.  So, if you log in as your self you will not see notes
 * you created while logged in as wsadmin.  You need to update the createdBy property
 * of the notes to change them from wsadmin to your user id.
 *
 */
export class TextNotesLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getAddButton = this.getAddButton.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleAddClose = this.handleAddClose.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.handleGetForIdCallback = this.handleGetForIdCallback.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.noteFormatter = this.noteFormatter.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.verifyTextId = this.verifyTextId.bind(this);
    this.createNotesDropdown = this.createNotesDropdown.bind(this);
    this.compareNotes = this.compareNotes.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state.docType);
    this.verifyTextId(this.props.topicId, nextProps.topicId);
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, docType) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    let theSearchLabels = labels[labelTopics.searchNotes];

    let selectedId = "";
    if (docType) {
      if (props.initialType === docType) {
        selectedId = this.state.selectedId;
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
          messages: labels[labelTopics.messages]
            , search: theSearchLabels
            , resultsTable: labels[labelTopics.resultsTable]
          }
          , session: {
            userInfo: userInfo
          }
          , docType: props.initialType
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , messageIcon: get(this.state, "messageIcon", "")
          , message: get(this.state,"message", "")
          , rowSelectMessage: get(this.state,"rowSelectMessage", "")
          , rowSelectMessageIcon: get(this.state, "rowSelectMessageIcon", "")
          , showRowSelectMessage: get(this.state, "showRowSelectMessage", false)
          , matcherTypes: [
            {label: theSearchLabels.matchesAnywhere, value: "c"}
            , {label: theSearchLabels.matchesAtTheStart, value: "sw"}
            , {label: theSearchLabels.matchesAtTheEnd, value: "ew"}
            , {label: theSearchLabels.matchesRegEx, value: "rx"}
          ]
          , matcher: "c"
          ,
          query: ""
          ,
          suggestedQuery: ""
          ,
          propertyTypes: [
            {label: "ID", value: "id"}
            , {label: "Value (insensitive)", value: "nnp"}
            , {label: "Value (sensitive)", value: "value"}
          ]
          ,
          docPropMessage: ""
          ,
          docPropMessageById: "Search By ID searches the ID of the docs, with the parts domain~topic~key, e.g. gr_gr_cog~actors~Priest."
          ,
          docPropMessageByValue: "Search By Value is insensitive to accents, case, and punctuation."
          ,
          docPropMessageByValueSensitive: "Search By Value (sensitive) is sensitive to accents, case, and punctuation."
          ,
          searchFormToggle: this.messageIcons.toggleOff
          ,
          showSearchForm: true
          ,
          searchFormType: "simple"
          ,
          showSearchResults: get(this.state,"showSearchResults", false)
          ,
          resultCount: get(this.state, "resultCount", 0)
          ,
          options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , filter: { type: 'RegexFilter', delay: 100 }
          , showSelectionButtons: false
          , selectedId: selectedId
          , selectedLibrary: ""
          , selectedTopic: props.topicId
          , selectedKey: ""
          , title: ""
          , selectedText: ""
          , showModalEditor: false
          , idColumnSize: "80px"
          , enableAdd: get(this.state, "enableAdd", false)
          , notes: get(this.state,"notes",[{"id": "", "value:": ""}])
          , notesDropdown: get(this.state,"notesDropdown",[])
          , canUpdateNote: get(this.state,"canUpdateNote", false)
        }
    )
  };

  compareNotes = (a,b) => {
    if (a.label < b.label)
      return -1;
    if (a.label > b.label)
      return 1;
    return 0
  };

  createNotesDropdown = () => {
    let notesDropdown = this.state.notes.map(function(a) {
      let label = a.type;
      label += ": ";
      label += a.liturgicalScope;
      label += " ";
      label += a.liturgicalLemma;
      label += " ";
      label += a.value.substring(0, 20);
      return {label: label, value: a.id};
    });
    notesDropdown.sort(this.compareNotes);
    this.setState({notesDropdown: notesDropdown});

  };

  handleCancelRequest() {
    if (this.props.callback) {
      this.props.callback("","");
    }
  };

  handleDoneRequest() {
    if (this.props.callback) {
      this.props.callback(this.state.selectedId, this.state.selectedValue);
    }
  };

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <ControlLabel>{this.state.labels.search.selectedDoc}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedId}
              disabled
            />
            <ControlLabel>{this.state.labels.search.selectedDoc}</ControlLabel>
            <FormControl
                type="text"
                value={this.state.selectedValue}
                disabled
            />
            <div>
          <ButtonGroup bsSize="xsmall">
            <Button onClick={this.handleCancelRequest}>Cancel</Button>
            <Button onClick={this.handleDoneRequest}>Done</Button>
          </ButtonGroup>
            </div>
          </FormGroup>
        </Panel>
    )
  };

  deselectAllRows = () => {
    if (this.refs && this.refs.theTable) {
      this.refs.theTable.setState({
        selectedRowKeys: []
      });
    }
  };

  handleRowSelect = (row, isSelected, e) => {
    let rowSelectMessage = this.state.labels.messages.ok;
    let rowSelectMessageIcon = this.messageIcons.info;
    if (this.state.session.userInfo.isAuthorFor(row["library"])) {
      this.setState({
        selectedId: row["id"]
        , selectedLibrary: row["library"]
        , selectedTopic: row["topic"]
        , selectedKey: row["key"]
        , title: row["id"]
        , selectedText: row["text"]
        , showIdPartSelector: true
        , showModalEditor: true
        , rowSelectMessage: rowSelectMessage
        , rowSelectMessageIcon: rowSelectMessageIcon
        , showRowSelectMessage: false
      });
    } else {
      rowSelectMessage =
          this.state.labels.messages.readOnly
          + " ( "
          + row["library"]
          + ")";
      rowSelectMessageIcon = this.messageIcons.error;
      this.setState({
        rowSelectMessage: rowSelectMessage
        , rowSelectMessageIcon: rowSelectMessageIcon
        , showRowSelectMessage: true
      });
    }
  };

  showRowComparison = (id) => {
      this.setState({
        showModalEditor: true
        , selectedId: id
      })
  };

  handleCloseModal = (id, value) => {
    if (id && id.length > 0) {
      this.setState({
        showModalEditor: false
        , selectedId: id
        , selectedValue: value
      })
    } else {
      this.setState({
        showModalEditor: false
      })
    }
    this.deselectAllRows();
    this.fetchData();
  };

  getModalEditor = () => {
    return (
        <ModalTextNoteEditor
            session={this.props.session}
            restPath={Server.getDbServerDocsApi()}
            noteIdLibrary={this.state.selectedLibrary}
            noteIdTopic={this.state.selectedTopic}
            noteIdKey={this.state.selectedKey}
            onClose={this.handleCloseModal}
            notesList={this.state.notes}
            canUpdate={this.state.canUpdateNote}
        />
    )
  };

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
    });
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
  }

  fetchData(event) {
    this.setState({
      message: this.state.labels.search.msg2
      , messageIcon: this.messageIcons.info
    });
    let config = {
      auth: {
        username: this.state.session.userInfo.username
        , password: this.state.session.userInfo.password
      }
    };

    let idParts = IdManager.getParts(this.props.topicId);

    let parms =
            "?t=" + encodeURIComponent("*")
            + "&q=" + encodeURIComponent(idParts.topic + "~" + idParts.key)
            + "&p=topic"
            + "&m=ew"
            + "&l="
            + "&o=any"
        ;
    let path = this.props.session.restServer + Server.getDbServerNotesApi() + parms;
    axios.get(path, config)
        .then(response => {
          let resultCount = 0;
          let notes = [];
          let showSearchResults = false;
          let message = this.state.labels.search.foundNone
          let found = this.state.labels.search.foundMany;
          if (response.data.valueCount) {
            notes = response.data.values;
            resultCount = response.data.valueCount;
            showSearchResults = resultCount > 0;
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

          let enableAdd = resultCount > 0;
          this.setState({
                message: message
                , notes: notes
                , resultCount: resultCount
                , messageIcon: this.messageIcons.info
                , showSearchResults: showSearchResults
                , enableAdd: enableAdd
                , selectedId: ""
                , selectedKey: ""
                , selectedLibrary: ""
                , selectedTopic: this.props.topicId
                , selectedText: ""
              }, this.createNotesDropdown
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

  handleAddClose = () => {
    this.setState({
      showModalEditor: false
    }
    , this.fetchData
    );
  };

  handleAddButtonClick = () => {
    this.setState({
      showModalEditor: true
    });
  };

  getAddButton = () => {
      return (
        <Button
            className="Text-Note-Add-Button"
            bsStyle="primary"
            bsSize={"xsmall"}
            onClick={this.handleAddButtonClick}>
          <FontAwesome
              className="App-Add-ico"
              name="plus"/>
        </Button>
      )
  };

  handleGetForIdCallback = (restCallResult) => {
    let enableAdd = false;
    if (restCallResult && restCallResult.data && restCallResult.data.valueCount) {
      enableAdd = restCallResult.data.valueCount > 0;
    }
    this.setState({enableAdd: enableAdd});
  };

  verifyTextId = (currentId, nextId) => {
    let needToVerify = true;

    if (this.state.enableAdd) {
      if (currentId) {
        if (currentId == nextId) {
          needToVerify = false;
        }
      }
    }
    if (needToVerify) {
      this.setState({enableAdd: false});

      Server.restGetForId(
          this.props.session.restServer
          , this.state.session.userInfo.username
          , this.state.session.userInfo.password
          , nextId
          , this.handleGetForIdCallback
      );
    }
  };

  noteFormatter = (cell, row, formatExtraData) => {
      return (
          <FormattedTextNote
              session={formatExtraData}
              note={row["valueFormatted"]}
              type={row["type"]}
              title={row["title"]}
              scopeLiturgical={row["liturgicalScope"]}
              lemmaLiturgical={row["liturgicalLemma"]}
              scopeBiblical={row["biblicalScope"]}
              lemmaBiblical={row["biblicalLemma"]}
          />
      );
  };

  render() {
    return (
        <div className="App-page App-Notes-Lister">
          {this.props.title && <h3>{this.props.title}</h3>}
          <div>{this.state.labels.search.resultLabel}: <span className="App App-message"><FontAwesome name={this.state.messageIcon}/>{this.state.message} {this.getAddButton()}</span>
          </div>
          {this.state.showSearchResults &&
          <div>
            {this.state.labels.search.msg5} {this.state.labels.search.msg6}
          </div>
          }
          {this.state.showRowSelectMessage &&
          <div>
            <FontAwesome name={this.state.rowSelectMessageIcon}/> {this.state.rowSelectMessage}
          </div>
          }
          {this.state.showModalEditor && this.getModalEditor()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  ref="theTable"
                  data={this.state.notes}
                  exportCSV={ false }
                  trClassName={"App-data-tr"}
                  striped
                  hover
                  pagination
                  options={ this.state.options }
                  selectRow={ this.state.selectRow }
              >
                <TableHeaderColumn
                    isKey
                    dataField='id'
                    dataSort={ true }
                    export={ true }
                    hidden
                >ID
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='type'
                    dataSort={ true }
                    tdClassname="tdType"
                    width={"15%"}
                    filter={this.state.filter}
                >{this.state.labels.resultsTable.headerType}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='liturgicalScope'
                    dataSort={ true }
                    tdClassname="tdType"
                    width={"15%"}
                    filter={this.state.filter}
                >{this.state.labels.resultsTable.headerScope}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='liturgicalLemma'
                    dataSort={ true }
                    tdClassname="tdType"
                    width={"15%"}
                    filter={this.state.filter}
                >{this.state.labels.resultsTable.headerLemma}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='valueFormatted'
                    dataSort={ true }
                    width={"85%"}
                    filter={this.state.filter}
                    dataFormat={ this.noteFormatter }
                    formatExtraData={this.props.session}
                >{this.state.labels.resultsTable.headerNote}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
};

TextNotesLister.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , topicId: PropTypes.string.isRequired
  , topicText: PropTypes.string.isRequired
};

export default TextNotesLister;