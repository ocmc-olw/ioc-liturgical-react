import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Panel } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import UiSchemas from './classes/UiSchemas';
import Server from './helpers/Server';
import SchemaBasedAddButton from "./modules/SchemaBasedAddButton";
import IdManager from './helpers/IdManager';

/**
 * Lists notes for a specific text made by the current user.
 * The ID of a UserNote is:
 * library = the user's personal library
* topic = library~topic~key (i.e. ID) of the text for which the note is made
 * key = timestamp of when the note was made.
 *
 * The NotesLister searches for notes matching the library and topic
 * of the UserNote ID.
 *
 */
export class NotesLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getAddButton = this.getAddButton.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.handleAddClose = this.handleAddClose.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.handleGetForIdCallback = this.handleGetForIdCallback.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.verifyTextId = this.verifyTextId.bind(this);
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

    let theSearchLabels = props.session.labels[props.session.labelTopics.searchNotes]

    let selectedId = "";
    if (docType) {
      if (props.initialType === docType) {
        selectedId = this.state.selectedId;
      }
    }

    let textIdParts = IdManager.getParts(this.props.topicId);
    let topicId = "gr_gr_cog" + "~" + textIdParts.topic + "~" + textIdParts.key;

    let uiSchemas = {};
    if (props.session && props.session.uiSchemas) {
      uiSchemas = new UiSchemas(
          props.session.uiSchemas.formsDropdown
          , props.session.uiSchemas.formsSchemas
          , props.session.uiSchemas.forms
      );
    }

    return (
        {
          searchLabels: theSearchLabels
          , session: {
            uiSchemas: uiSchemas
          }
          , docType: props.initialType
          , resultsTableLabels: props.session.labels[props.session.labelTopics.resultsTable]
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , messageIcon: get(this.state, "messageIcon", "")
          , message: get(this.state,"message", "")
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
          ,
          showSelectionButtons: false
          , selectedId: selectedId
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , title: ""
          , selectedText: ""
          , showModalEditor: false
          , idColumnSize: "80px"
          , enableAdd: get(this.state, "enableAdd", false)
          , data: get(this.state,"data",{values: [{"id": "", "value:": ""}]})
          , topicId: topicId
        }
    )
  };

  handleCancelRequest() {
    if (this.props.callback) {
      this.props.callback("","");
    }
  }

  handleDoneRequest() {
    if (this.props.callback) {
      this.props.callback(this.state.selectedId, this.state.selectedValue);
    }
  };

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <ControlLabel>{this.state.searchLabels.selectedDoc}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedId}
              disabled
            />
            <ControlLabel>{this.state.searchLabels.selectedDoc}</ControlLabel>
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
    this.refs.theTable.setState({
      selectedRowKeys: []
    });
  };

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedId: row["id"]
      , selectedLibrary: row["library"]
      , selectedTopic: row["topic"]
      , selectedKey: row["key"]
      , title: row["id"]
      , selectedText: row["text"]
      , showIdPartSelector: true
      , showModalEditor: true
    });
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
        <ModalSchemaBasedEditor
            session={this.props.session}
            restPath={Server.getDbServerDocsApi()}
            showModal={this.state.showModalEditor}
            title={this.state.title}
            fromId={this.state.selectedTopic}
            fromText={this.state.selectedText}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            onClose={this.handleCloseModal}
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
      message: this.state.searchLabels.msg2
      , messageIcon: this.messageIcons.info
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.props.type)
            + "&q=" + encodeURIComponent(this.props.session.userInfo.domain + "~" + this.state.topicId)
            + "&p=id"
            + "&m=sw"
            + "&l="
            + "&o=any"
        ;
    let path = this.props.session.restServer + Server.getDbServerNotesApi() + parms;
    axios.get(path, config)
        .then(response => {
          // response.data will contain: "id, library, topic, key, value, tags, text"
          let resultCount = 0;
          let message = this.state.searchLabels.foundNone
          let found = this.state.searchLabels.foundMany;
          let data = [];
          let showSearchResults = false;
          if (response.data.valueCount) {
            data = response.data;
            resultCount = data.valueCount;
            showSearchResults = resultCount > 0;
            if (resultCount === 0) {
              message = this.state.searchLabels.foundNone;
            } else if (resultCount === 1) {
              message = this.state.searchLabels.foundOne;
            } else {
              message = found
                  + " "
                  + resultCount
                  + ".";
            }
          }

          this.setState({
                message: message
                , data: data
                , resultCount: resultCount
                , messageIcon: this.messageIcons.info
                , showSearchResults: showSearchResults
                , enableAdd: true
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = this.state.searchLabels.foundNone;
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }

  handleAddClose = () => {
    this.fetchData();
  };


  getAddButton = () => {
    if (this.state.enableAdd
      && this.state.session
        && this.state.session.uiSchemas
    ) {
      let id = "UserNoteCreateForm:1.1";
      let textIdParts = IdManager.getParts(this.props.topicId);
      let topicId = "gr_gr_cog" + "~" + textIdParts.topic + "~" + textIdParts.key;
      let library = this.props.session.userInfo.domain;
      let date = new Date();
      let month = (date.getMonth()+1).toString().padStart(2,"0");
      let day = date.getDate().toString().padStart(2,"0");
      let hour = date.getHours().toString().padStart(2,"0");
      let minute = date.getMinutes().toString().padStart(2,"0");
      let second = date.getSeconds().toString().padStart(2,"0");
      let key = date.getFullYear()
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
      return (
          <SchemaBasedAddButton
              session={this.props.session}
              restPath={this.state.session.uiSchemas.getHttpPostPathForSchema(id)}
              uiSchema={this.state.session.uiSchemas.getUiSchema(id)}
              schema={this.state.session.uiSchemas.getSchema(id)}
              formData={this.state.session.uiSchemas.getForm(id)}
              idLibrary={library}
              idTopic={topicId}
              idKey={key}
              seq={IdManager.toId(library, this.props.topicId, key)
              }
              onClose={this.handleAddClose}
              fromId={this.props.topicId}
              fromText={this.props.topicText}
          />
      )
    } else {
      return (<span/>)
    }
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
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , nextId
          , this.handleGetForIdCallback
      );
    }
  };

  render() {
    return (
        <div className="App-page App-Notes-Lister">
          {this.props.title && <h3>{this.props.title}</h3>}
          <div>{this.state.searchLabels.resultLabel}: <span className="App App-message"><FontAwesome name={this.state.messageIcon}/>{this.state.message} {this.getAddButton()}</span>
          </div>
          {this.state.showSearchResults &&
          <div>
            {this.state.searchLabels.msg5} {this.state.searchLabels.msg6}
          </div>
          }
          {this.state.showModalEditor && this.getModalEditor()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  ref="theTable"
                  data={this.state.data.values}
                  exportCSV={ false }
                  trClassName={"App-data-tr"}
                  search
                  searchPlaceholder={this.state.resultsTableLabels.filterPrompt}
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
                    dataField='topic'
                    dataSort={ true }
                    export={ false }
                    tdClassname="tdTopic"
                    width={"10%"}
                >{this.state.resultsTableLabels.headerText}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='key'
                    dataSort={ true }
                    tdClassname="tdKey"
                    width={"10%"}
                >{this.state.resultsTableLabels.headerDate}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ false }
                    dataSort={ true }
                    width={"10%"}
                >{this.state.resultsTableLabels.headerTags}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='value'
                    dataSort={ true }
                >{this.state.resultsTableLabels.headerNote}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

NotesLister.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , type: PropTypes.string.isRequired
  , topicId: PropTypes.string.isRequired
  , topicText: PropTypes.string.isRequired
};

export default NotesLister;