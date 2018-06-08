import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import TextNoteSearchOptions from "./modules/TextNoteSearchOptions";
import ModalTextNoteEditor from './modules/ModalTextNoteEditor';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Panel, PanelGroup} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';
import Labels from './Labels';
import FormattedTextNote from './FormattedTextNote';

export class SearchTextNotes extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.noteFormatter = this.noteFormatter();
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
  }

  componentWillMount = () => {
    let showSelectionButtons = false;
    if (this.props.callback) {
      showSelectionButtons = true;
    }
    this.setState({
          message: this.state.searchLabels.msg1
          , messageIcon: this.messageIcons.info
          , docPropMessage: this.state.docPropMessageByValue
          , showSelectionButtons: showSelectionButtons
        }
    );
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer + Server.getDbServerDropdownsSearchNotesApi();
    axios.get(path, config)
        .then(response => {
          // literals used as keys to get data from the response
          let valueKey = "dropdown";
          let propsKey = "typeProps";
          let tagsKey = "typeTags";
          let tagOperatorsKey = "tagOperators";
          let textNoteTypesKey = "textNoteTypes";
          let values = response.data.values[0][valueKey];
          this.setState({
                dropdowns: {
                  types: values[textNoteTypesKey]
                  , typeProps: values[propsKey]
                  , typeTags: values[tagsKey]
                  , tagOperators: values[tagOperatorsKey]
                  , loaded: true
                }
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 401) {
            message = Server.getWsServerDbApi() + " is a protected database.  Please login and try again.";
            messageIcon = this.messageIcons.error;
          } else if (error && error.response && error.response.status === 404) {
            message = "error retrieving values for dropdowns";
            messageIcon = this.messageIcons.error;
          } else if (error && error.message && error.message.toLowerCase() === "network error") {
            message = "The database server " + Server.getWsServerDbApi() + " is not available.";
            messageIcon = this.messageIcons.error;
          }
          this.setState({data: message, message: message, messageIcon: messageIcon});
        });
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state.docType));
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, docType) => {

    let theSearchLabels = Labels.getSearchNotesLabels(props.session.languageCode);

    return (
        {
          searchLabels: theSearchLabels
          , docType: "NoteTextual"
          , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
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
          showSearchResults: false
          ,
          resultCount: 0
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
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , filter: { type: 'RegexFilter', delay: 100 }
          ,
          showSelectionButtons: false
          , selectedId: get(this.state, "selectedId", "" )
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , title: ""
          , selectedText: ""
          , showModalEditor: false
          , idColumnSize: "80px"
        }
    )
  }
  getSearchForm() {
    if (this.state.dropdowns) {
      return (
          <div>
              <TextNoteSearchOptions
                  session={this.props.session}
                  types={this.state.dropdowns.types}
                  initialType={this.props.initialType}
                  properties={this.state.dropdowns.typeProps["NoteTextual"]}
                  matchers={this.getMatcherTypes()}
                  tags={this.state.dropdowns.typeTags["NoteTextual"]}
                  tagOperators={this.state.dropdowns.tagOperators}
                  handleSubmit={this.handleAdvancedSearchSubmit}
                  labels={this.state.searchLabels}
              />
          </div>
      );
    } else {
      return (
          <span>Loading dropdowns for search...</span>
      );
    }
  };

  getMatcherTypes () {
    return (
        [
            {label: this.state.searchLabels.matchesAnywhere, value: "c"}
            , {label: this.state.searchLabels.matchesAtTheStart, value: "sw"}
            , {label: this.state.searchLabels.matchesAtTheEnd, value: "ew"}
            , {label: this.state.searchLabels.matchesRegEx, value: "rx"}
            ]
    )
  }
  handleCancelRequest() {
    if (this.props.callback) {
      this.props.callback("","");
    }
  }

  handleDoneRequest() {
    if (this.props.callback) {
      this.props.callback(this.state.selectedId, this.state.selectedValue);
    }
  }

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
  }

  handleAdvancedSearchSubmit = (
      type
      , property
      , matcher
      , value
      , tagOperator
      , tags
  ) => {
    this.setState({
          docType: type
          , docProp: property
          , matcher: matcher
          , query: value
          , tagOperator: tagOperator
          , tags: tags
        }
        ,
          this.fetchData
    );
  };

  deselectAllRows = () => {
    this.refs.theTable.setState({
      selectedRowKeys: []
    });
  }

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedId: row["id"]
      , selectedLibrary: row["library"]
      , selectedTopic: row["topic"]
      , selectedKey: row["key"]
      , title: row["id"]
      , selectedText: row["text"]
      , showIdPartSelector: true
      , showModalEditor: this.props.editor
    });
  }

  showRowComparison = (id) => {
    if (this.props.editor) {
      this.setState({
        showModalEditor: true
        , selectedId: id
      })
    } else {
      this.setState({
        selectedId: id
      })
    }
  }

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
      }, this.fetchData)
    }
    this.deselectAllRows();
  }

  getModalEditor = () => {
    return (
        <ModalTextNoteEditor
            session={this.props.session}
            restPath={Server.getDbServerDocsApi()}
            noteIdTopic={this.state.selectedTopic}
            noteIdLibrary={this.state.selectedLibrary}
            noteIdKey={this.state.selectedKey}
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
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  }

  searchFormTypes = {
    simple: "simple"
    , advanced: "advanced"
    , idPattern: "id"
  }

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
            "?t=" + encodeURIComponent(this.state.docType)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
            + "&l=" + encodeURIComponent(this.state.tags)
            + "&o=" + encodeURIComponent(this.state.tagOperator)
        ;
    let path = this.props.session.restServer + Server.getDbServerNotesApi() + parms;
    axios.get(path, config)
        .then(response => {
          // response.data will contain: "id, library, topic, key, value, tags, text"
          this.setState({
                data: response.data
              }
          );
          let resultCount = 0;
          let message = this.state.searchLabels.foundNone;
          let found = this.state.searchLabels.foundMany;
          if (response.data.valueCount) {
            resultCount = response.data.valueCount;
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
                , resultCount: resultCount
                , messageIcon: this.messageIcons.info
                , showSearchResults: true
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

  noteFormatter = (cell, row, formatExtraData) => {
    return function (cell, row, formatExtraData) {
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
    }
  };

  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.state.searchLabels.pageTitle}</h3>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchForm()}
              </div>
            </div>
          </div>

          <div>{this.state.searchLabels.resultLabel}: <span className="App App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.message} </span>
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
                    dataField='text'
                    dataSort={ true }
                    export={ false }
                    tdClassname="tdText"
                    width={"30%"}
                    filter={this.state.filter}
                >{this.state.resultsTableLabels.headerText}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='type'
                    dataSort={ true }
                    tdClassname="tdType"
                    width={"10%"}
                    filter={this.state.filter}
                >{this.state.resultsTableLabels.headerType}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='valueFormatted'
                    dataSort={ true }
                    width={"50%"}
                    filter={this.state.filter}
                    dataFormat={ this.noteFormatter }
                    formatExtraData={this.props.session}
                >{this.state.resultsTableLabels.headerNote}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ false }
                    dataSort={ true }
                    width={"10%"}
                    filter={this.state.filter}
                >{this.state.resultsTableLabels.headerTags}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='noteTitle'
                    export={ true }
                    hidden
                >Title
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='liturgicalScope'
                    export={ true }
                    hidden
                >Liturgical Scope
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='liturgicalLemma'
                    export={ true }
                    hidden
                >Liturgical Lemma
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='biblicalScope'
                    export={ true }
                    hidden
                >Liturgical Scope
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='biblicalLemma'
                    export={ true }
                    hidden
                >Liturgical Lemma
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

SearchTextNotes.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , editor: PropTypes.bool.isRequired
  , initialType: PropTypes.string
  , fixedType: PropTypes.bool.isRequired
};

SearchTextNotes.defaultProps = {
  initialType: "*"
};


export default SearchTextNotes;