import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { get } from 'lodash';
import GenericSearchOptions from "./modules/GenericSearchOptions";
import GenericModalNewEntryForm from './modules/GenericModalNewEntryForm';
import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';
import FontAwesome from 'react-fontawesome';
import {
  Alert
  , Button
  , ButtonGroup
  , ControlLabel
  , FormControl
  , FormGroup
  , Panel
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { SuperTypes } from './classes/ENUMS';
import Server from './helpers/Server';
import Labels from './Labels';

export class SearchGeneric extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getAddButton = this.getAddButton.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getModalNewEntryForm = this.getModalNewEntryForm.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.getTable = this.getTable.bind(this);
    this.getTableForAbbreviations = this.getTableForAbbreviations.bind(this);
    this.getTableForBibliographies = this.getTableForBibliographies.bind(this);
    this.getTableGeneric = this.getTableGeneric.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleCloseModalAdd = this.handleCloseModalAdd.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
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
    let path = this.props.session.restServer + Server.getDbServerDropdownsSearchGenericApi();
    axios.get(path, config)
        .then(response => {
          // literals used as keys to get data from the response
          let valueKey = "dropdown";
          let propsKey = "typeProps";
          let tagsKey = "typeTags";
          let tagOperatorsKey = "tagOperators";
          let objectTypesKey = "typeList";
          let values = response.data.values[0][valueKey];
          this.setState({
                dropdowns: {
                  types: values[objectTypesKey]
                  , typeProps: values[propsKey]
                  , typeTags: values[tagsKey]
                  , tagOperators: values[tagOperatorsKey]
                  , loaded: true
                }
                , newEntryType: "BibEntryArticle"
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

    let theSearchLabels = Labels.getSearchGenericLabels(props.session.languageCode);


    /**
     * Below is how we define the node properties to return from a database search.
     * Each of the above SuperTypes needs its corresponding propsToReturn and its own
     * Bootstrap Table (see getTable());
     * Most of these are used in the table that lists the results.
     * There is a different table for each type.  Although not explicitly requested,
     * the database will always add n._valueSchemaId.
     *
     * All the 'magic' happens in the function handleAdvancedSearchSubmit().
     * It examines the label returned from the search option for the type
     * to see what kind of schema we are dealing with.
     */
    let propsToReturnForBiblio = "n.id as id";
    propsToReturnForBiblio += ", n.library as library";
    propsToReturnForBiblio += ", n.topic as topic";
    propsToReturnForBiblio += ", n.key as key";
    propsToReturnForBiblio += ", n.entryType as type";
    propsToReturnForBiblio += ", coalesce(n.author, n.editor, n.editora) as author";
    propsToReturnForBiblio += ", n.title as title";
    propsToReturnForBiblio += ", coalesce(n.year, n.date) as date";
    propsToReturnForBiblio += ", n.tags as tags";

    let propsToReturnForOntology = "n.id as id";
    propsToReturnForOntology += ", n.library as library";
    propsToReturnForOntology += ", n.topic as topic";
    propsToReturnForOntology += ", n.key as key";
    propsToReturnForOntology += ", n.name as name";
    propsToReturnForOntology += ", n.description as desc";
    propsToReturnForOntology += ", n.tags as tags";

    let propsToReturnForGeneric = "n.id as id";
    propsToReturnForGeneric += ", n.library as library";
    propsToReturnForGeneric += ", n.topic as topic";
    propsToReturnForGeneric += ", n.key as key";
    propsToReturnForGeneric += ", coalesce(n.value, n.name, n.title) as value";
    propsToReturnForGeneric += ", n.tags as tags";


    let userDomain = "";
    if (this.props.session
        && this.props.session.userInfo
        && this.props.session.userInfo.domain
    ) {
      userDomain = this.props.session.userInfo.domain;
    }
    return (
        {
          searchLabels: theSearchLabels
          , propertiesToReturn: get(this.state, "propertiesToReturn", propsToReturnForGeneric)
          , propertiesToReturnGeneric: propsToReturnForGeneric
          , propertiesToReturnForBiblio: propsToReturnForBiblio
          , propertiesToReturnForOntology: propsToReturnForOntology
          , docType: "*"
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
          , showSelectionButtons: false
          , searchSuperType: get(this.state, "searchSuperType", SuperTypes.GENERIC )
          , SuperTypes: SuperTypes
          , selectedId: get(this.state, "selectedId", "" )
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , selectedType: get(this.state, "selectedType", "" )
          , title: ""
          , selectedText: ""
          , showModalEditor: false
          , idColumnSize: "80px"
          , showModalAdd: get(this.state, "showModalAdd", false)
          , addPanelOpen: get(this.state, "addPanelOpen", false)
          , newEntryLibrary: get(this.state, "newEntryLibrary", userDomain)
          , newEntryKey: get(this.state, "newEntryKey", "")
          , newEntryType: get(this.state, "newEntryType", "")
        }
    )
  };

  handleCloseModalAdd = () => {
    this.setState({showModalAdd: false},this.fetchData);
  };

  getSearchForm() {
    if (this.state.dropdowns) {
      return (
          <div>
              <GenericSearchOptions
                  session={this.props.session}
                  initialType={this.props.initialType}
                  properties={this.state.dropdowns.typeProps["Bibliography"]}
                  matchers={this.getMatcherTypes()}
                  tags={this.state.dropdowns.typeTags["Bibliography"]}
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

  handleAddButtonClick = () => {
    this.setState({showModalAdd: true});
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
      , typeLabel
      , library
      , property
      , matcher
      , value
      , tagOperator
      , tags
  ) => {
    let schema = type;
    if (schema.endsWith("CreateForm:1.1")) {
      schema = schema.substring(0, schema.length-14);
    } else if (schema.endsWith(":1.1")) {
      schema = schema.substring(0, schema.length-4);
    }
    let selectedSuperType = this.state.SuperTypes.GENERIC;
    let propertiesToReturn = this.state.propertiesToReturnGeneric;

    if (typeLabel.includes("Bibliography")) {
      selectedSuperType = this.state.SuperTypes.BIBLIOGRAPHY;
      propertiesToReturn = this.state.propertiesToReturnForBiblio;
    } else if (typeLabel.includes("Ontology")) {
      selectedSuperType = this.state.SuperTypes.ONTOLOGY;
      propertiesToReturn = this.state.propertiesToReturnForOntology;
    }
    this.setState({
          docType: schema
          , searchSuperType: selectedSuperType
          , propertiesToReturn: propertiesToReturn
          , docLibrary: library
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
      selectedId: row["id"]
      , selectedLibrary: row["library"]
      , selectedTopic: row["topic"]
      , selectedKey: row["key"]
      , title: row["id"]
      , showIdPartSelector: false
      , showModalEditor: this.props.editor
    });
  };

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
      }, this.fetchData)
    }
    this.deselectAllRows();
  };

  getModalEditor = () => {
    return (
        <ModalSchemaBasedEditor
            session={this.props.session}
            restPath={Server.getDbServerDocsApi()}
            onClose={this.handleCloseModal}
            showModal={true}
            title={this.state.selectedId}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            canUpdate={this.props.session.userInfo.isAuthorFor(this.state.selectedLibrary)}
        />
    )
  };

  getModalNewEntryForm = () => {
      return (
          <GenericModalNewEntryForm
              session={this.props.session}
              restPath={Server.getDbServerDocsApi()}
              onClose={this.handleCloseModalAdd}
              schemaTypes={this.state.dropdowns.types}
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
  };

  searchFormTypes = {
    simple: "simple"
    , advanced: "advanced"
    , idPattern: "id"
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  handleSearchCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      this.setState({
            data: restCallResult.data
          }
      );
      let resultCount = 0;
      let message = "No docs found...";
      if (restCallResult.data.valueCount && restCallResult.data.valueCount > 0) {
        resultCount = restCallResult.data.valueCount;
        message = this.state.searchLabels.msg3
            + " "
            + restCallResult.data.valueCount
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
    }
  };


  fetchData(event) {
    if (this.state.docType && this.state.docType !== "*") {
      this.setState({
        message: this.state.searchLabels.msg2
        , messageIcon: this.messageIcons.info
        , showSearchResults: false
      });
      let config = {
        auth: {
          username: this.props.session.userInfo.username
          , password: this.props.session.userInfo.password
        }
      };

      let parms =
          "t=" + encodeURIComponent(this.state.docType)
          + "&d=" + encodeURIComponent(this.state.docLibrary)
          + "&q=" + encodeURIComponent(this.state.query)
          + "&p=" + encodeURIComponent(this.state.docProp)
          + "&m=" + encodeURIComponent(this.state.matcher)
          + "&l=" + encodeURIComponent(this.state.tags)
          + "&o=" + encodeURIComponent(this.state.tagOperator)
          + "&r=" + encodeURIComponent(this.state.propertiesToReturn)
      ;

      Server.getGenericSearchResult(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , parms
          , this.handleSearchCallback
      );
    }
  }

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

  getTable = () => {
    switch (this.state.searchSuperType) {
      case this.state.SuperTypes.BIBLIOGRAPHY: {
        return this.getTableForBibliographies();
        break;
      }
      case this.state.SuperTypes.ONTOLOGY: {
        return this.getTableForOntology();
        break;
      }
      default: {
        return this.getTableGeneric();
      }
    }
  };

  getTableForAbbreviations = () => {

  };

  getTableForBibliographies = ()=> {
    return (
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
              dataField='library'
              dataSort={ true }
              export={ false }
              tdClassname="tdDomain"
              width={"10%"}
              filter={this.state.filter}
          >{this.state.resultsTableLabels.headerDomain}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='key'
              dataSort={ true }
              export={ false }
              tdClassname="tdKey"
              width={"10%"}
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
              dataField='title'
              dataSort={ true }
              tdClassname={"tdTitle"}
              width={"35%"}
              filter={this.state.filter}
          >{this.state.resultsTableLabels.headerNote}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='author'
              dataSort={ true }
              tdClassname={"tdAuthor"}
              width={"15%"}
              filter={this.state.filter}
          >{this.state.resultsTableLabels.headerNote}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='date'
              dataSort={ true }
              tdClassname={"tdDate"}
              width={"10%"}
              filter={this.state.filter}
          >{this.state.resultsTableLabels.headerNote}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='tags'
              export={ false }
              dataSort={ true }
              width={"20%"}
              filter={this.state.filter}
          >{this.state.resultsTableLabels.headerTags}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  getTableGeneric = () => {
    return (
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
              dataField='library'
              dataSort={ true }
              export={ false }
              width={"10%"}
          >{this.state.resultsTableLabels.headerDomain}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='topic'
              dataSort={ true }
              export={ false }
              width={"10%"}
          >{this.state.resultsTableLabels.headerTopic}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='key'
              dataSort={ true }
              tdClassname="tdKey"
              width={"10%"}
          >{this.state.resultsTableLabels.headerKey}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='value'
              dataSort={ true }
              width={"40%"}
          >{this.state.resultsTableLabels.headerValue}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='tags'
              export={ false }
              dataSort={ true }
          >{this.state.resultsTableLabels.headerTags}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  getTableForOntology = () => {
    return (
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
          >{this.state.resultsTableLabels.headerTopic}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='key'
              dataSort={ true }
              tdClassname="tdKey"
              width={"10%"}
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
          <TableHeaderColumn
              dataField='_valueSchemaId'
              export={ false }
              hidden
          >
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.state.searchLabels.pageTitle}</h3>
          <Alert>{this.state.searchLabels.instructions}</Alert>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchForm()}
              </div>
            </div>
          </div>

          <div>{this.state.searchLabels.resultLabel}: <span className="App App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.searchLabels.msg3} {this.state.resultCount} {this.state.searchLabels.msg4}  {this.getAddButton()}</span>
          </div>
          {this.state.showSearchResults &&
          <div>
            {this.state.searchLabels.msg5} {this.state.searchLabels.msg6}
          </div>
          }
          {this.state.showModalAdd && this.getModalNewEntryForm()}
          {this.state.showModalEditor && this.getModalEditor()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              {this.getTable()}
            </div>
          </div>
          }
        </div>
    )
  }
}

SearchGeneric.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , editor: PropTypes.bool.isRequired
  , initialType: PropTypes.string
  , fixedType: PropTypes.bool.isRequired
};

SearchGeneric.defaultProps = {
  initialType: "*"
};


export default SearchGeneric;