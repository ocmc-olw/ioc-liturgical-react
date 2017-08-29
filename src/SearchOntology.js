import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import OntologySearchOptions from "./modules/OntologySearchOptions";
import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Panel, PanelGroup} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';
import Labels from './Labels';

export class SearchOntology extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.fetchData = this.fetchData.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.setTheState = this.setTheState.bind(this);
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
        username: this.props.username
        , password: this.props.password
      }
    };
    let path = this.props.restServer + Server.getDbServerDropdownsSearchOntologyApi();
    axios.get(path, config)
        .then(response => {
          // literals used as keys to get data from the response
          let valueKey = "dropdown";
          let listKey = "typeList";
          let propsKey = "typeProps";
          let tagsKey = "typeTags";
          let tagOperatorsKey = "tagOperators";

          let values = response.data.values[0][valueKey];
          this.setState({
                dropdowns: {
                  types: values[listKey]
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
    this.setTheState(nextProps, this.state.docType);
  }

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, docType) => {

    let theSearchLabels = Labels.getSearchOntologyLabels(props.languageCode);

    let selectedId = "";
    if (docType) {
      if (props.initialType === docType) {
        selectedId = this.state.selectedId;
      }
    }

    return (
        {
          searchLabels: theSearchLabels
          , docType: props.initialType
          , resultsTableLabels: Labels.getResultsTableLabels(props.languageCode)
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , matcherTypes: [
            {label: theSearchLabels.matchesAnywhere, value: "c"}
            , {label: theSearchLabels.matchesAtTheStart, value: "sw"}
            , {label: theSearchLabels.matchesAtTheEnd, value: "ew"}
            , {label: theSearchLabels.matchesRegEx, value: "rx"}
          ]
          , matcher: "c"
          , genericType: "*"
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
          ,
          showSelectionButtons: false
          , selectedId: selectedId
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , title: ""
          , showModalEditor: false
          , idColumnSize: "80px"
        }
    )
  }
  getSearchForm() {
    return (
            <div>
            {this.state.dropdowns ?
                <OntologySearchOptions
                    types={this.state.dropdowns.types}
                    initialType={this.props.fixedType ? this.props.initialType : this.state.docType}
                    properties={this.state.dropdowns.typeProps}
                    matchers={this.getMatcherTypes()}
                    tags={this.state.dropdowns.typeTags}
                    tagOperators={this.state.dropdowns.tagOperators}
                    handleSubmit={this.handleAdvancedSearchSubmit}
                    labels={this.state.searchLabels}
                />
                : "Loading dropdowns for search..."
            }
            </div>
    );
  }

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
      , genericType
      , property
      , matcher
      , value
      , tagOperator
      , tags
  ) => {
    this.setState({
          docType: type
          , genericType: genericType
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

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedId: row["id"]
      , selectedLibrary: row["library"]
      , selectedTopic: row["topic"]
      , selectedKey: row["key"]
      , title: row["name"]
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
      })
    }
  }

  getModalEditor = () => {
    return (
        <ModalSchemaBasedEditor
            restServer={this.props.restServer}
            restPath={Server.getDbServerDocsApi()}
            username={this.props.username}
            password={this.props.password}
            showModal={this.state.showModalEditor}
            title={this.state.title}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            onClose={this.handleCloseModal}
            languageCode={this.props.languageCode}
        />
    )
  }

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
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
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
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
        username: this.props.username
        , password: this.props.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.state.docType)
            + "&g=" + encodeURIComponent(this.state.genericType)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
            + "&l=" + encodeURIComponent(this.state.tags)
            + "&o=" + encodeURIComponent(this.state.tagOperator)
        ;
    let path = this.props.restServer + Server.getDbServerOntologyApi() + parms;
    axios.get(path, config)
        .then(response => {
          // response.data will contain: "id, library, topic, key, name, description, tags"
          this.setState({
                data: response.data
              }
          );
          let resultCount = 0;
          let message = "No docs found...";
          if (response.data.valueCount && response.data.valueCount > 0) {
            resultCount = response.data.valueCount;
            message = this.state.searchLabels.msg3
                + " "
                + response.data.valueCount
                + " "
                + this.state.searchLabels.msg4
                + "."
          } else {
            message = this.state.searchLabels.msg3
                + " 0 "
                + this.state.searchLabels.msg4
                + "."
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
            message = "no docs found";
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }

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

          <div>{this.state.searchLabels.resultLabel}: <span className="App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.searchLabels.msg3} {this.state.resultCount} {this.state.searchLabels.msg4} </span>
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
                >{this.state.resultsTableLabels.headerTopic}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='key'
                    dataSort={ true }
                    tdClassname="tdKey"
                >{this.state.resultsTableLabels.headerKey}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='name'
                    dataSort={ true }
                >{this.state.resultsTableLabels.headerName}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='description'
                    export={ false }
                    dataSort={ true }
                >{this.state.resultsTableLabels.headerDesc}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ false }
                    dataSort={ true }
                >{this.state.resultsTableLabels.headerTags}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

SearchOntology.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , callback: PropTypes.func
  , languageCode: PropTypes.string.isRequired
  , editor: PropTypes.bool.isRequired
  , initialType: PropTypes.string.isRequired
  , fixedType: PropTypes.bool.isRequired
};

export default SearchOntology;