import React from 'react';
import PropTypes from 'prop-types';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';

import Labels from './Labels';

import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';

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

    this.state = this.setTheState(props, "");

    this.fetchDocData = this.fetchDocData.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getTable = this.getTable.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.onExportToCSV = this.onExportToCSV.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.fetchDocData();
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let showSearchResults = false;
    let data = {
      values:
        [
          {
            "id": ""
            , "type": ""
            , "toId": ""
            , "tags:": ""
          }
        ]
    };
    let resultCount = 0;

    if (currentState) {
      if (currentState.showSearchResults) {
        showSearchResults = currentState.showSearchResults;
      }
      if (currentState.data) {
        data = currentState.data;
      }
      if (currentState.resultCount) {
        resultCount = currentState.resultCount;
      }
    }
    return (
        {
          labels: {
            thisClass: Labels.getViewReferencesLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , data: data
          , resultCount: resultCount
          , selectedDocType: "Liturgical"
          , selectedDomain: "en_us_dedes"
          , selectedBook: "me"
          , selectedChapter: "m01"
          , selectedProperty: "nnp"
          , query: "joy"
          , selectedMatcher: "c"
          , showSearchResults: showSearchResults
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
    )
  }

  fetchDocData = () => {

    let parms =
        "t=" + encodeURIComponent("*")
        + "&d=" + encodeURIComponent("*")
        + "&q=" + encodeURIComponent("en_sys_ontology~" + this.props.id)
        + "&p=" + encodeURIComponent("id")
        + "&m=" + encodeURIComponent("sw")
        + "&l=" + encodeURIComponent("")
        + "&o=" + encodeURIComponent("any")
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
                , showSearchResults: true
                , resultCount: response.data.values.length
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
            }
          })
        })
    ;
  }

  handleRowSelect = (row, isSelected, e) => {
    console.log(row);
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
    console.log('onExportToCSV called')
    return this.state.data.values;
  }


  getTable = () => {
    if (this.state.showSearchResults) {
      return (
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
                >{this.state.labels.resultsTableLabels.headerLink}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='ontologyTopic'
                    export = { true }
                    hidden
                >{this.state.labels.resultsTableLabels.headerOntologyTopic}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='toId'
                    export={ true }
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerTo}
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
                >{this.state.labels.resultsTableLabels.headerComments}
                </TableHeaderColumn>
              </BootstrapTable>
            </div>
          </div>
      );
    }  else {
      return (
        <Spinner message={this.state.labels.messages.retrieving}/>
      );
    }
  }

  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.state.labels.thisClass.pageTitle}</h3>
          <div>{this.state.labels.messages.resultLabel}: <span className="App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.labels.messages.found} {this.state.resultCount} {this.state.labels.messages.docs} </span>
          </div>
          {this.state.showSearchResults &&
          <div>
            {this.state.labels.messages.filter} {this.state.labels.messages.click}
          </div>
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
};

ViewReferences.defaultProps = {
};

export default ViewReferences;
