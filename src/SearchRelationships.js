import React from 'react';
import axios from 'axios';
import LinkSearchOptions from "./modules/LinkSearchOptions";
import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';
import FontAwesome from 'react-fontawesome';
import {Button, ButtonGroup, ControlLabel, FormControl, FormGroup, Panel, PanelGroup} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';

export class SearchRelationships extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      domain: "*"
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
      , selectedId: ""
      , selectedLibrary: ""
      , selectedTopic: ""
      , selectedKey: ""
      , title: ""
      , showModalCompareDocs: false
      , idColumnSize: "80px"
    };
    this.fetchData = this.fetchData.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.getDocComparison = this.getDocComparison.bind(this);
    this.handleCloseDocComparison = this.handleCloseDocComparison.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
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
    let path = this.props.restServer + Server.getDbServerDropdownsSearchRelationshipsApi();
    axios.get(path, config)
        .then(response => {
          // literals used as keys to get data from the response
          let valueKey = "dropdown";
          let listKey = "typeList";
          let libsKey = "typeLibraries";
          let propsKey = "typeProps";
          let tagsKey = "typeTags";
          let tagOperatorsKey = "tagOperators";

          let values = response.data.values[0][valueKey];
          this.setState({
                dropdowns: {
                  linkTypes: values[listKey]
                  , linkTypeLibraries: values[libsKey]
                  , linkTypeProps: values[propsKey]
                  , linkTypeTags: values[tagsKey]
                  , linkTagOperators: values[tagOperatorsKey]
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


  getSearchForm() {
    return (
            <div>
            {this.state.dropdowns ?
                <LinkSearchOptions
                    types={this.state.dropdowns.linkTypes}
                    libraries={this.state.dropdowns.linkTypeLibraries}
                    properties={this.state.dropdowns.linkTypeProps}
                    matchers={this.getMatcherTypes()}
                    tags={this.state.dropdowns.linkTypeTags}
                    tagOperators={this.state.dropdowns.linkTagOperators}
                    handleSubmit={this.handleAdvancedSearchSubmit}
                    labels={this.props.searchLabels}
                />
                : "Loading dropdowns for search..."
            }
            </div>
    );
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
      this.props.callback(this.state.selectedId, this.state.selectedValue);
    }
  }

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <ControlLabel>{this.props.searchLabels.selectedDoc}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedId}
              disabled
            />
            <ControlLabel>{this.props.searchLabels.selectedDoc}</ControlLabel>
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
      , domain
      , property
      , matcher
      , value
      , tagOperator
      , tags
  ) => {
    console.log("handleAdvancedSearchSubmit");
    console.log(tagOperator);
    console.log(tags);
    this.setState({
          docType: type
          , domain: domain
          , docProp: property
          , matcher: matcher
          , query: value
          , tagOperator: tagOperator
          , tags: tags
        }
        , function () {
          this.fetchData();
        }
    );
  };

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedId: row["library"] + "~" + row["fromId"] + "~" + row["toId"]
      , selectedLibrary: row["library"]
      , selectedTopic: row["fromId"]
      , selectedKey: row["toId"]
      , title: row["fromId"] + " " + row["type"] + " " + row["toId"]
      , showIdPartSelector: true
      , showModalCompareDocs: true
    });
  }

  showRowComparison = (id) => {
    this.setState({
      showModalCompareDocs: true
      , selectedId: id
    })
  }

  handleCloseDocComparison = (id, value) => {
    if (id && id.length > 0) {
      this.setState({
        showModalCompareDocs: false
        , selectedId: id
        , selectedValue: value
      })
    } else {
      this.setState({
        showModalCompareDocs: false
      })
    }
  }

  getDocComparison = () => {
    return (
        <ModalSchemaBasedEditor
            restServer={this.props.restServer}
            restPath={Server.getDbServerLinksApi()}
            username={this.props.username}
            password={this.props.password}
            showModal={this.state.showModalCompareDocs}
            title={this.state.title}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            onClose={this.handleCloseDocComparison}
            labels={this.props.searchLabels}
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
      message: this.props.searchLabels.msg2
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
            + "&d=" + encodeURIComponent(this.state.domain)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
            + "&l=" + encodeURIComponent(this.state.tags)
            + "&o=" + encodeURIComponent(this.state.tagOperator)
        ;
    let path = this.props.restServer + Server.getDbServerLinksApi() + parms;
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

  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.props.searchLabels.pageTitle}</h3>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchForm()}
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
                >ID
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='library'
                    dataSort={ true }
                    export={ false }
                    tdClassname="tdDomain"
                    width={"10%"}
                >{this.props.resultsTableLabels.headerDomain}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='fromId'
                    dataSort={ true }
                    export={ false }
                >{this.props.resultsTableLabels.headerFromId}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='type'
                    dataSort={ true }
                >{this.props.resultsTableLabels.headerType}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='toId'
                    export={ false }
                    dataSort={ true }
                >{this.props.resultsTableLabels.headerToId}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ false }
                    dataSort={ true }
                >{this.props.resultsTableLabels.headerTags}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

SearchRelationships.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , callback: React.PropTypes.func
  , searchLabels: React.PropTypes.object.isRequired
  , resultsTableLabels: React.PropTypes.object.isRequired
};

export default SearchRelationships;