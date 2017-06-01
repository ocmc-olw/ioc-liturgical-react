import React from 'react';
import axios from 'axios';
import SearchOptionsAdvanced from "./modules/SearchOptionsAdvanced";
import SearchOptionsSimple from "./modules/SearchOptionsSimple";
import ModalCompareDocs from './modules/ModalCompareDocs';
import FontAwesome from 'react-fontawesome';
import {
  Button
  , ButtonGroup
  , ControlLabel
  , FormControl
  , FormGroup
  , Panel
  , PanelGroup
  , Well
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';

export class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docType: this.props.initialDocType,
      docTypes: [
        {label: "All", value: "all"}
        , {label: "Biblical", value: "Biblical"}
        , {label: "Liturgical", value: "Liturgical"}
      ]
      ,
      domain: "*"
      ,
      selectedBook: "*"
      ,
      selectedChapter: "*"
      ,
      query: ""
      ,
      matcher: "c"
      ,
      matcherTypes: [
        {label: this.props.searchLabels.matchesAnywhere, value: "c"}
        , {label: this.props.searchLabels.matchesAtTheStart, value: "sw"}
        , {label: this.props.searchLabels.matchesAtTheEnd, value: "ew"}
        , {label: this.props.searchLabels.matchesRegEx, value: "rx"}
      ]
      ,
      suggestedQuery: ""
      ,
      docProp: "nnp"
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
      filterMessage: this.props.searchLabels.msg5
      ,
      selectMessage: this.props.searchLabels.msg6
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
//        , onRowClick: this.onRowClick
//        , onRowDoubleClick: this.onRowDoubleClick
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
      ,
      selectedID: ""
      ,
      selectedIdPartsPrompt: "Select one or more ID parts, then click on the search icon:"
      ,
      selectedIdParts: [
        {key: "domain", label: ""},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showIdPartSelector: false
      , selectedValue: ""
      , selectedSeq: ""
      , showModalCompareDocs: false
      , idColumnSize: "80px"
    };
    this.handleIdQuerySelection = this.handleIdQuerySelection.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.toggleSearchForm = this.toggleSearchForm.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.handleSimpleSearchSubmit = this.handleSimpleSearchSubmit.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getSearchAccordion = this.getSearchAccordion.bind(this);
    this.searchFormOptionIcons = this.searchFormOptionIcons.bind(this);
    this.handleSearchFormTypeChange = this.handleSearchFormTypeChange.bind(this);
    this.toogleIdPattern = this.toogleIdPattern.bind(this);
    this.showSelectionButtons = this.showSelectionButtons.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.getDocComparison = this.getDocComparison.bind(this);
    this.handleCloseDocComparison = this.handleCloseDocComparison.bind(this);
    this.getBars = this.getBars.bind(this);
    this.getDocTypes = this.getDocTypes.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
  }

  componentWillMount = () => {
    let showSelectionButtons = false;
    if (this.props.callback) {
      showSelectionButtons = true;
    }
    this.setState({
          message: this.props.searchLabels.msg1
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
    let path = this.props.restServer + Server.getDbServerDropdownsSearchTextApi();
    axios.get(path, config)
        .then(response => {
          this.setState({
                dropdowns: {
                  Biblical: {
                    all: {
                      books: response.data.values[0]["all"][0]["books"]
                      , chapters: response.data.values[0]["all"][0]["chapters"]
                    }
                    , domains: response.data.values[0]["domains"]
                    , topics: response.data.values[0]["topics"]
                  }
                  , Liturgical: {
                    all: {
                      books: response.data.values[1]["all"][0]["books"]
                    }
                    , domains: response.data.values[1]["domains"]
                    , topics: response.data.values[1]["topics"]
                  }
                  , loaded: true
                }
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 401) {
            message = server.getDbServerPath() + " is a protected database.  Please login and try again.";
            messageIcon = this.messageIcons.error;
          } else if (error && error.response && error.response.status === 404) {
            message = "error retrieving values for dropdowns";
            messageIcon = this.messageIcons.error;
          } else if (error && error.message && error.message.toLowerCase() === "network error") {
            message = "The database server " + server.getDbServerPath() + " is not available.";
            messageIcon = this.messageIcons.error;
          }
          this.setState({data: message, message: message, messageIcon: messageIcon});
        });
  };

  login(loginRequired) {
    if (loginRequired) {
      this.props.router.replace('/login');
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      docType: nextProps.initialDocType
      , selectedID: ""
      , selectedValue: ""
      , selectedSeq: ""
      , matcherTypes: [
        {label: nextProps.searchLabels.matchesAnywhere, value: "c"}
        , {label: nextProps.searchLabels.matchesAtTheStart, value: "sw"}
        , {label: nextProps.searchLabels.matchesAtTheEnd, value: "ew"}
        , {label: nextProps.searchLabels.matchesRegEx, value: "rx"}
      ]
    });
  }


  toggleSearchForm = () => {
    let showing = this.state.searchFormType;
    let searchFormToggleIcon;
    let searchFormToggleMessage;

    if (showing) {
      searchFormToggleIcon = this.messageIcons.toggleOn;
      searchFormToggleMessage = this.state.advancedSearchMessage;
    } else {
      searchFormToggleIcon = this.messageIcons.toggleOff;
      searchFormToggleMessage = this.state.simpleSearchMessage;
    }
    this.setState({
      searchFormType: !showing
      , searchFormToggle: searchFormToggleIcon
      , searchFormToggleMessage: searchFormToggleMessage
    });
  }
  searchFormOptionIcons() {
    return (
        <div>
          Search Type:
          <span className="App-search-options">
          <label
              id={this.searchFormTypes.simple}
              className="App-search-form-option-label control-label"
              onClick={this.handleSearchFormTypeChange}>
            <FontAwesome
                id={this.searchFormTypes.simple}
                onClick={this.handleSearchFormTypeChange}
                name={this.messageIcons.simpleSearch}
            />Simple
          </label>
          <label
              id={this.searchFormTypes.advanced}
              onClick={this.handleSearchFormTypeChange}
              className="App-search-form-option-label control-label">
            <FontAwesome
                id={this.searchFormTypes.advanced}
                onClick={this.handleSearchFormTypeChange}
                name={this.messageIcons.advancedSearch}
            />
            Advanced
          </label>
          </span>
        </div>
    );
  }

  handleSearchFormTypeChange (event) {
    switch(event.target.id) {
      case (this.searchFormTypes.simple): {
        this.setState({
          searchFormType: this.searchFormTypes.simple
        });
        break;
      }
      case (this.searchFormTypes.advanced): {
        this.setState({
          searchFormType: this.searchFormTypes.advanced
        });
        break;
      }
      case (this.searchFormTypes.idPattern): {
        this.setState({
          searchFormType: this.searchFormTypes.idPattern
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  formOptionStyles = {
    hidden: { display: 'none' }
    , visible: { display: 'inline' }
  }

  toogleIdPattern (id) {
    if (id.length > 0) {
      return this.formOptionStyles.visible;
    } else {
      return this.formOptionStyles.hidden;
    }
  }

  getSearchAccordion(type) {
    if (this.props.callback) {
      return (
            <Panel className="App-search-panel" header={this.props.searchLabels.advanced} eventKey="2">
              {this.state.dropdowns ?
                  <SearchOptionsAdvanced
                      docType={this.state.docType}
                      docTypes={this.state.docTypes}
                      dropDowns={this.state.dropdowns}
                      properties={this.state.propertyTypes}
                      matchers={this.getMatcherTypes()}
                      handleSubmit={this.handleAdvancedSearchSubmit}
                      labels={this.props.searchLabels}
                  />
                  : "Loading dropdowns for advanced search..."}
            </Panel>
      );
    } else {
      return (
          <PanelGroup defaultActiveKey="1" accordion>
            <Panel  className="App-search-panel" header={this.props.searchLabels.simple} eventKey="1">
              <SearchOptionsSimple
                  valueTitle=""
                  placeholder={this.props.searchLabels.prompt}
                  handleSubmit={this.handleSimpleSearchSubmit}
              />
            </Panel>
            <Panel className="App-search-panel" header={this.props.searchLabels.advanced} eventKey="2">
              {this.state.dropdowns ?
                  <SearchOptionsAdvanced
                      docType={this.props.initialDocType}
                      docTypes={this.state.docTypes}
                      dropDowns={this.state.dropdowns}
                      properties={this.state.propertyTypes}
                      matchers={this.getMatcherTypes()}
                      handleSubmit={this.handleAdvancedSearchSubmit}
                      labels={this.props.searchLabels}
                  />
                  : "Loading dropdowns for advanced search..."}
            </Panel>
          </PanelGroup>
      );
    }
  }

  getSearchForm(type) {
    switch(type) {
      case (this.searchFormTypes.advanced): {
        return (
            <SearchOptionsAdvanced
                docType={this.props.initialDocType}
                docTypes={this.getDocTypes()}
                dropDowns={this.state.dropdowns}
                properties={this.state.propertyTypes}
                matchers={this.state.matcherTypes}
                handleSubmit={this.handleAdvancedSearchSubmit}
                labels={this.props.searchLabels}
            />
        );
      }
      default: {
        return (
            <SearchOptionsSimple
                valueTitle=""
                placeholder="enter a word or phrase and press the search icon..."
                handleSubmit={this.handleSimpleSearchSubmit}
            />
        );
      }
    }
  }

  getMatcherTypes () {
    return (
        [
            {label: this.props.searchLabels.matchesAnywhere, value: "c"}
            , {label: this.props.searchLabels.matchesAtTheStart, value: "sw"}
            , {label: this.props.searchLabels.matchesAtTheEnd, value: "ew"}
            , {label: this.props.searchLabels.matchesRegEx, value: "rx"}
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
      this.props.callback(
          this.state.selectedID
          , this.state.selectedValue
          , this.state.selectedSeq
      );
    }
  }

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <ControlLabel>{this.props.searchLabels.selectedId}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedID}
              disabled
            />
            <ControlLabel>{this.props.searchLabels.selectedValue}</ControlLabel>
            <Well>{this.state.selectedValue}
            </Well>
            <div>
          <ButtonGroup bsSize="xsmall">
            <Button onClick={this.handleCancelRequest}>Cancel</Button>
            <Button
                onClick={this.handleDoneRequest}
                disabled={this.state.selectedID.length < 1}
            >
              Done
            </Button>
          </ButtonGroup>
            </div>
          </FormGroup>
        </Panel>
    )
  }

  handleIdQuerySelection(value) {
    this.setState({
          domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "id"
          , matcher: "rx"
          , query: value
        }
        , this.fetchData
    );
  }

  handleAdvancedSearchSubmit = (
      type
      , domain
      , book
      , chapter
      , property
      , matcher
      , value
      , seq
  ) => {
    this.setState({
          docType: type
          , domain: domain
          , selectedBook: book
          , selectedChapter: chapter
          , docProp: property
          , matcher: matcher
          , query: value
          , selectedSeq: seq
        }
        , this.fetchData
    );
  };

  handleSimpleSearchSubmit = (value) => {
    this.setState({
          docType: "Liturgical"
          , domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "nnp"
          , matcher: "c"
          , query: value
        }
        , this.fetchData
    );
  };

  onRowClick = (row) => {
    console.log("row clicked");
    console.log(row);
  }

  onRowDoubleClick = (row) => {
    console.log("row double clicked");
    console.log(row);
  }

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
      , showIdPartSelector: true
      , showModalCompareDocs: true
    }, this.showRowComparison(row["id"], row["value"]));
  }

  showRowComparison = (id, value) => {
    this.setState({
      showModalCompareDocs: true
      , selectedID: id
      , selectedValue: value
    })
  }

  handleCloseDocComparison = (id, value, seq) => {
    if (id && id.length > 0) {
      this.setState({
        showModalCompareDocs: false
        , selectedID: id
        , selectedValue: value
        , selectedSeq: seq
      })
    } else {
      this.setState({
        showModalCompareDocs: false
      })
    }
  }

  getDocTypes = () => {
    return (
      [
          {label: this.props.searchLabels.typeAny, value: "all"}
            , {label: this.props.searchLabels.biblical, value: "Biblical"}
            , {label: this.props.searchLabels.liturgical, value: "Liturgical"}
            ]
    );
  }

  getDocComparison = () => {
    return (
        <ModalCompareDocs
            restServer={this.props.restServer}
            username={this.props.username}
            password={this.props.password}
            showModal={this.state.showModalCompareDocs}
            title={this.state.selectedID}
            docType={this.state.docType}
            selectedIdParts={this.state.selectedIdParts}
            onClose={this.handleCloseDocComparison}
            labels={this.props.searchLabels}
        />
    )
  }

  showSelectionButtons = (id) => {
    this.setState({
      showSelectionButtons: true
      , selectedID: id
    });
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
    this.setState({message: this.props.searchLabels.msg2, messageIcon: this.messageIcons.info});
    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.state.docType)
            + "&d=" + encodeURIComponent(this.state.domain)
            + "&b=" + encodeURIComponent(this.state.selectedBook)
            + "&c=" + encodeURIComponent(this.state.selectedChapter)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
        ;
    let path = this.props.restServer + Server.getWsServerDbApi() + 'docs' + parms;
    axios.get(path, config)
        .then(response => {
          this.setState({
                data: response.data
              }
          );
          let resultCount = 0;
          let message = "No docs found...";
          if (response.data.valueCount && response.data.valueCount > 0) {
            resultCount = response.data.valueCount;
            message = this.props.searchLabels.msg3
                + " "
                + response.data.valueCount
                + " "
                + this.props.searchLabels.msg4
                + "."
          } else {
            message = this.props.searchLabels.msg3
                + " 0 "
                + this.props.searchLabels.msg4
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

  /**
   * If the type of doc is
   *  Liturgical
   * and selected selectedBook is
   *  eothinon
   *  menaion
   *  octoechos
   * then display the additional two dropdown boxes, e.g. for month and day
   *
   *  Biblical
   *  then display selectedChapter numbers <-- must vary based on selectedBook!
   *
   * TODO: in Java, query database for each domain and collect the possible values for each part of the topic.
   * @returns {XML}
   */

//          <div>Search Form: <FontAwesome onClick={this.toggleSearchForm} name={this.state.searchFormToggle}/>{this.state.searchFormToggleMessage}</div>

  getBars = () => {
    return (
        <span><FontAwesome name="bars"/></span>
    )
  };


  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.props.searchLabels.pageTitle}</h3>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchAccordion(this.state.searchFormType)}
              </div>
            </div>
          </div>

          <div>{this.props.searchLabels.resultLabel}: <span className="App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.props.searchLabels.msg3} {this.state.resultCount} {this.props.searchLabels.msg4} </span>
          </div>
          {this.state.showSearchResults &&
          <div>
            {this.props.searchLabels.msg5} {this.props.searchLabels.msg6}
          </div>
          }
          {this.state.showModalCompareDocs && this.getDocComparison()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  data={this.state.data.values}
                  exportCSV={ false }
                  trClassName={"App-data-tr"}
                  search
                  searchPlaceholder={this.props.resultsTableLabels.filterPrompt}
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
                >ID</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='library'
                    dataSort={ true }
                    export={ false }
                    tdClassname="tdDomain"
                    width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerDomain}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='topic'
                    dataSort={ true }
                    export={ false }
                    width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerTopic}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='key'
                    export={ false }
                    dataSort={ true }
                    width={this.state.idColumnSize}>{this.props.resultsTableLabels.headerKey}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='value'
                    dataSort={ true }
                >{this.props.resultsTableLabels.headerValue}</TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

Search.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , callback: React.PropTypes.func
  , searchLabels: React.PropTypes.object.isRequired
  , resultsTableLabels: React.PropTypes.object.isRequired
  , initialDocType: React.PropTypes.string.isRequired
};

export default Search;