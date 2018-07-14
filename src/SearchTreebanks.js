import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import TreebankSearchOptions from "./modules/TreebankSearchOptions";
import FontAwesome from 'react-fontawesome';
import {
  Button
  , ButtonGroup
  , ControlLabel
  , FormControl
  , FormGroup
  , Modal
  , Panel
  , Well
  } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';
import TreeViewUtils from './helpers/TreeViewUtils';
import Spinner from './helpers/Spinner';
import DependencyDiagram from './modules/DependencyDiagram';
import HyperTokenText from './modules/HyperTokenText';

export class SearchTreebanks extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.fetchData = this.fetchData.bind(this);
    this.fetchDiagramData = this.fetchDiagramData.bind(this);
    this.showSearchStatus = this.showSearchStatus.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.getModalWindow = this.getModalWindow.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.handleTokenClick = this.handleTokenClick.bind(this);
    this.treeViewSelectCallback = this.treeViewSelectCallback.bind(this);
  }

  componentWillMount = () => {
    let showSelectionButtons = false;
    if (this.props.callback) {
      showSelectionButtons = true;
    }
    this.setState({
          message: this.state.labels.thisClass.msg1
          , messageIcon: this.messageIcons.info
          , docPropMessage: this.state.docPropMessageByValue
          , showSelectionButtons: showSelectionButtons
          , fetchingData: false
          , dataFetched: false
        }
    );
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer + Server.getDbServerDropdownsSearchTreebanksApi();
    axios.get(path, config)
        .then(response => {
          // literals used as keys to get data from the response
          let sourceKey = "sourceList";
          let relLabelsKey = "relLabels";
          let valueKey = "dropdown";
          let listKey = "typeList";
          let propsKey = "typeProps";
          let tagsKey = "typeTags";
          let tagOperatorsKey = "tagOperators";

          let values = response.data.values[0][valueKey];
          this.setState({
                dropdowns: {
                  sources: values[sourceKey]
                  , relLabels: values[relLabelsKey]
                  , types: values[listKey]
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
    this.setTheState(nextProps, this.state);
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, currentState) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    let theSearchLabels = labels[labelTopics.searchTreebanks];


    return (
        {
          labels: {
            thisClass: theSearchLabels
            , messages: labels[labelTopics.messages]
            , resultsTable: labels[labelTopics.resultsTable]
          }
          , docType: get(currentState,"docType", props.initialType)
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
          , tableColumnFilter: {
            defaultValue: "",
            type: 'RegexFilter',
            placeholder: labels[labelTopics.messages].regEx
          }
          ,
          showSelectionButtons: false
          , selectedId: get(currentState,"selectedId", "")
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , title: ""
          , selectedText: ""
          , showModalWindow: get(currentState,"showModalWindow", false)
          , idColumnSize: "80px"
          , updatingData: get(currentState,"updatingData", false)
          , dataUpdated: get(currentState,"dataUpdated",false)
          , selectedTokenIndexNumber: get(currentState,"selectedTokenIndexNumber", 1)
        }
    )
  };

  getSearchForm() {
    return (
            <div>
            {this.state.dropdowns ?
                <TreebankSearchOptions
                    sources={this.state.dropdowns.sources}
                    initialType={this.props.fixedType ? this.props.initialType : this.state.docType}
                    properties={this.state.dropdowns.typeProps}
                    matchers={this.getMatcherTypes()}
                    tags={this.state.dropdowns.typeTags}
                    tagOperators={this.state.dropdowns.tagOperators}
                    labels={this.state.labels.thisClass}
                    relationshipLabels={this.state.dropdowns.relLabels}
                    handleSubmit={this.handleAdvancedSearchSubmit}
                />
                : "Loading dropdowns for search..."
            }
            </div>
    );
  }

  getMatcherTypes () {
    return (
        [
            {label: this.state.labels.thisClass.matchesAnywhere, value: "c"}
            , {label: this.state.labels.thisClass.matchesAtTheStart, value: "sw"}
            , {label: this.state.labels.thisClass.matchesAtTheEnd, value: "ew"}
            , {label: this.state.labels.thisClass.matchesRegEx, value: "rx"}
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

  treeViewSelectCallback = (node) => {
    if (node && node.key) {
      let intKey = parseInt(node.key);
      this.handleTokenClick(
          intKey-1
          ,this.state.tokens[intKey]
      );
    }
  };

  handleTokenClick = (index, token) => {
    let treeViewIndex = (parseInt(index)+1);
    let tokenIndex = parseInt(index);
    let tokenIsWord = true;
    if (token && token.length < 2) {
      let notLetter = '"\'·.,;?!~@#$%^&z-z_[]{})(-:0123456789';
      if (notLetter.includes(token)) {
        tokenIsWord = false;
      }
    }
    let treeViewUtils = new TreeViewUtils(this.state.nodes);
    let treeNodeData = treeViewUtils.toTreeViewData("Root", treeViewIndex);

    this.setState({
      selectedTokenIndex: index
      , selectedTokenIndexNumber: tokenIndex
      , selectedToken: token
      , selectedTokenIsWord: tokenIsWord
      , treeNodeData: treeNodeData
    });
  };

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <ControlLabel>{this.state.labels.thisClass.selectedDoc}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedId}
              disabled
            />
            <ControlLabel>{this.state.labels.thisClass.selectedDoc}</ControlLabel>
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
      , relLabel
      , property
      , matcher
      , value
      , tagOperator
      , tags
  ) => {
    this.setState({
          docType: type
          , relLabel: relLabel
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
  };

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedTopic: row["c.topic"]
    }, this.fetchDiagramData);
  };

  handleCloseModal = () => {
      this.setState({
        showModalWindow: false
      });
    this.deselectAllRows();
  };

  getModalWindow = () => {
      return (
          <div className={"App-Modal-Dependency-Diagram"}>
            <Modal backdrop={'static'} show={true} onHide={this.handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>{this.state.selectedTopic}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <HyperTokenText
                    session={this.props.session}
                    tokens={this.state.tokens}
                    selectedToken={this.state.selectedTokenIndexNumber}
                    onClick={this.handleTokenClick}
                />
                <Well className={"App-DependencyDiagram-Well"}>
                  <DependencyDiagram
                      data={this.state.treeNodeData}
                      highlightSelected={true}
                      onClick={this.treeViewSelectCallback}
                  />
                </Well>
              </Modal.Body>
              <Modal.Footer>
              </Modal.Footer>
            </Modal>
          </div>
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
      message: this.state.labels.thisClass.msg2
      , messageIcon: this.messageIcons.info
      , fetchingData: true
      , dataFetched: false
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.state.docType)
            + "&r=" + encodeURIComponent(this.state.relLabel)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
            + "&l=" + encodeURIComponent(this.state.tags)
            + "&o=" + encodeURIComponent(this.state.tagOperator)
        ;
    let path = this.props.session.restServer + Server.getDbServerTreebanksApi() + parms;
    axios.get(path, config)
        .then(response => {
          this.setState({
            data: response.data
            , fetchingData: false
            , dataFetched: true
          });

          let resultCount = 0;
          let message = this.state.labels.thisClass.foundNone;
          let found = this.state.labels.thisClass.foundMany;
          if (response.data.valueCount) {
            resultCount = response.data.valueCount;
            if (resultCount === 0) {
              message = this.state.labels.thisClass.foundNone;
            } else if (resultCount === 1) {
              message = this.state.labels.thisClass.foundOne;
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
            message = this.state.labels.thisClass.foundNone;
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }

  fetchDiagramData() {
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let parms =
        "?t=" + encodeURIComponent(this.state.docType)
    ;

    let path = this.props.session.restServer
        + Server.getDbServerTreebanksApi()
        + "/"
        + encodeURIComponent("en_sys_linguistics")
        + "/"
        + encodeURIComponent(this.state.selectedTopic)
        + parms
    ;
    axios.get(path, config)
        .then(response => {
          let text = response.data.values[0].text.value;
          let tokens = response.data.values[1].tokens;
          let nodes = response.data.values[2].nodes;
          let treeViewUtils = new TreeViewUtils(nodes);
          let treeNodeData = treeViewUtils.toTreeViewData("Root");
          this.setState(
              {
                text: text
                , nodes: nodes
                , tokens: tokens
                , treeNodeData: treeNodeData
                , showModalWindow: true
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

  showSearchStatus = () => {
    if (this.state.fetchingData) {
      return (
          <Spinner message={this.state.labels.messages.searching}/>
      );
    } else if (this.state.showSearchResults) {
        return (
            <div>{this.state.labels.thisClass.resultLabel}: <span className="App App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.message} </span>
              <div>
                {this.state.labels.thisClass.msg5} {this.state.labels.thisClass.msg6}
              </div>
            </div>
        );
    } else {
      return (<span/>);
    }
  };


  render() {
    return (
        <div className="App-page App-search-treebanks">
          <h3>{this.state.labels.thisClass.pageTitle}</h3>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchForm()}
              </div>
            </div>
          </div>
          {this.showSearchStatus()}
          {this.state.showModalWindow && this.getModalWindow()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  ref="theTable"
                  data={this.state.data.values}
                  exportCSV={ false }
                  trClassName={"App-data-tr"}
                  search
                  searchPlaceholder={this.state.labels.resultsTable.filterPrompt}
                  striped
                  hover
                  pagination
                  options={ this.state.options }
                  selectRow={ this.state.selectRow }
              >
                <TableHeaderColumn
                    isKey
                    dataField='c.id'
                    export={ true }
                    hidden
                >ID
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='c.topic'
                    export={ true }
                    hidden
                >Sentence
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='d.token'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerChildToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='d.nnpToken'
                    hidden
                >{this.state.labels.resultsTable.headerChildToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='d.grammar'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerChildGrammar}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='DtoC'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerChildLabel}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='c.token'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                    columnClassName={"App-Search-Treebank-Target"}
                >{this.state.labels.resultsTable.headerToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='c.nnpToken'
                    hidden
                >{this.state.labels.resultsTable.headerToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='c.grammar'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                    columnClassName={"App-Search-Treebank-Target"}
                >{this.state.labels.resultsTable.headerGrammar}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='CtoB'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                    columnClassName={"App-Search-Treebank-Target"}
                >{this.state.labels.resultsTable.headerLabel}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='b.token'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerParentToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='b.nnpToken'
                    hidden
                >{this.state.labels.resultsTable.headerParentToken}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='b.grammar'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerParentGrammar}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='BtoA'
                    dataSort={ true }
                    filter={this.state.tableColumnFilter}
                >{this.state.labels.resultsTable.headerParentLabel}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          }
        </div>
    )
  }
}

SearchTreebanks.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , editor: PropTypes.bool.isRequired
  , initialType: PropTypes.string.isRequired
  , fixedType: PropTypes.bool.isRequired
};

export default SearchTreebanks;