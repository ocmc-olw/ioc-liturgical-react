import React from 'react';
import PropTypes from 'prop-types';
import { ControlLabel, Well } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';

import Labels from './Labels';

import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';
import ReactSelector from './modules/ReactSelector';

import IdManager from './helpers/IdManager';
import MessageIcons from './helpers/MessageIcons';
import Server from './helpers/Server';
import Spinner from './helpers/Spinner';

/**
 * For the prop ID, finds and displays all REFERS_TO relationships.
 * Provides a modal schema based editor for selected rows.
 */
class ViewReferences extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getViewReferencesLabels(this.props.languageCode)
        , messages: Labels.getMessageLabels(this.props.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.languageCode).initial
      , data: {}
      , resultCount: 0
      , fetching: false
      , selectedDomain: "en_sys_ontology"
      , showSearchResults: false
      , options: {
        sizePerPage: 30
        , sizePerPageList: [5, 15, 30]
        , onSizePerPageList: this.onSizePerPageList
        , hideSizePerPage: true
        , paginationShowsTotal: true
        , onExportToCSV: this.onExportToCSV
      }
      , selectRow: {
        mode: 'radio' // or checkbox
        , hideSelectColumn: false
        , clickToSelect: false
        , onSelect: this.handleRowSelect
        , className: "App-row-select"
      }
    }

    this.fetchDocData = this.fetchDocData.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getTable = this.getTable.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.onExportToCSV = this.onExportToCSV.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.editable = this.editable.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.fetchDocData();
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.languageCode !== nextProps.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(nextProps.languageCode)
            , messages: Labels.getMessageLabels(nextProps.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.languageCode)
          }
          , message: Labels.getMessageLabels(props.languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function is needed
  }

  fetchDocData = () => {

    this.setState({fetching: true});

    let exclude = "";
    if (this.props.type === "*") {
      exclude = "REFERS_TO_BIBLICAL_TEXT";
    }

    let parms =
        "t=" + encodeURIComponent(this.props.type)
        + "&d=" + encodeURIComponent("*")
        + "&q=" + encodeURIComponent(this.state.selectedDomain + "~" + this.props.id)
        + "&p=" + encodeURIComponent("id")
        + "&m=" + encodeURIComponent("sw")
        + "&l=" + encodeURIComponent("")
        + "&o=" + encodeURIComponent("any")
        + "&x=" + encodeURIComponent(exclude)
    ;

    Server.restGetPromise(
        this.props.restServer
        , Server.getDbServerLinksApi()
        , this.props.username
        , this.props.password
        , parms
    )
        .then( response => {
          this.setState(
              {
                data: response.data
                , userMessage: response.userMessage
                , developerMessage: response.developerMessage
                , messageIcon: response.messageIcon
                , status: response.status
                , showSearchResults: response.data.values.length > 0
                , resultCount: response.data.values.length
                , fetching: false
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
  }

  handleRowSelect = (row, isSelected, e) => {
    let id = IdManager.toId(row["library"],row["fromId"],row["toId"]);
    this.setState({
      selectedId: id
      , selectedLibrary: row["library"]
      , selectedTopic: row["fromId"]
      , selectedKey: row["toId"]
      , selectedValue: row["value"]
      , showIdPartSelector: true
      , showModalWindow: true
      , title: row["fromId"]
    });
  }

  editable = (library) => {
    let canEdit = false;
    if (library) {
      for (let entry of this.props.domains.author) {
        if (entry.value == library) {
          canEdit = true;
          break;
        }
      };
    }
    return canEdit;
  }

  getModalEditor = () => {
    return (
        <ModalSchemaBasedEditor
            restServer={this.props.restServer}
            restPath={Server.getDbServerLinksApi()}
            username={this.props.username}
            password={this.props.password}
            showModal={this.state.showModalWindow}
            title={this.state.title}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            onClose={this.handleCloseModal}
            languageCode={this.props.languageCode}
            canUpdate={this.editable(this.state.selectedLibrary)}
        />
    )
  }

  handleCloseModal = (id, value) => {
    if (id && id.length > 0) {
      this.setState({
        showModalWindow: false
        , selectedId: id
        , selectedValue: value
      })
    } else {
      this.setState({
        showModalWindow: false
      })
    }
  }

  // a property must be a table column (even if hidden)
  // and have export: { true } set
  onExportToCSV = ( row ) => {
    return this.state.data.values;
  }

  handleDomainChange = (item) => {
    this.setState(
        {
          selectedDomain: item.value
          , showSearchResults: false
        }
        , this.fetchDocData);
  }

  getTable = () => {
    if (this.state.showSearchResults) {
      return (
          <Well>
          <div className="App-search-results">
            <div className="row">
              <BootstrapTable
                  data={this.state.data.values}
                  exportCSV={ true }
                  trClassName={"App-data-tr"}
                  search
                  searchPlaceholder={this.state.labels.resultsTableLabels.filterPrompt}
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
                    dataField='fromId'
                    export={ true }
                    hidden
                >{this.state.labels.resultsTableLabels.headerTo}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='type'
                    export = { true }
                    hidden
                >{this.state.labels.resultsTableLabels.headerLink}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField={this.props.type === "*" ? 'ontologyTopic' : 'toId'}
                    export = { true }
                >{this.state.labels.resultsTableLabels.headerOntologyType}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='toId'
                    export={ true }
                    dataSort={ true }
                    hidden
                >{this.state.labels.resultsTableLabels.headerTo}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField={this.props.type === "*" ? 'toName' : 'value'}
                    export={ true }
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerOntologyInstance}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ true }
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerTags}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='comments'
                    export={ true }
                    dataSort={ true }
                    hidden
                >{this.state.labels.resultsTableLabels.headerComments}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
          </Well>
      );
    }  else if (this.state.fetching) {
      return (
        <Spinner message={this.state.labels.messages.retrieving}/>
      );
    } else {
      return (<div></div>)
    }
  }

  getSelector = () => {
    if (this.props.domains && this.props.domains.reader) {
      return (
          <Well>
            <ControlLabel>
              {this.state.labels.thisClass.prompt}
            </ControlLabel>
          <ReactSelector
              initialValue={this.state.selectedDomain}
              resources={this.props.domains.reader}
              changeHandler={this.handleDomainChange}
              multiSelect={false}
          />
          </Well>
      )
    } else {
      return (<div></div>)
    }
  }

  render() {
    return (
        <div className="App-search">
          <h3>{this.state.labels.thisClass.pageTitle}</h3>
          {this.getSelector()}
          <ControlLabel>{this.props.type === "*" ? this.state.labels.thisClass.ontologyRef : this.state.labels.thisClass.biblicalRef} {this.state.labels.thisClass.panelTitle} {this.props.id} {this.state.labels.thisClass.library} {this.state.selectedDomain}</ControlLabel>
          <div>{this.state.labels.messages.resultLabel}: <span className="App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.labels.messages.found} {this.state.resultCount} {this.state.labels.messages.docs} </span>
          </div>
          {this.state.showSearchResults &&
          <ControlLabel>
            {this.state.labels.messages.filter} {this.state.labels.messages.click}
          </ControlLabel>
          }
          {this.state.showModalWindow && this.getModalEditor()}
          {this.getTable()}
        </div>
    )
  }
}

ViewReferences.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , domains: PropTypes.object.isRequired
  , id: PropTypes.string.isRequired
  , type: PropTypes.string
};

ViewReferences.defaultProps = {
  type: "*"
};

export default ViewReferences;
