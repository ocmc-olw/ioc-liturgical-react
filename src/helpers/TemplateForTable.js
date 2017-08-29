import React from 'react';
import PropTypes from 'prop-types';
import IdManager from '../helpers/IdManager';
import MessageIcons from '../helpers/MessageIcons';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';

import Labels from '../Labels';
import Server from './Server';
import Spinner from './Spinner';

/**
 * Use this as an example starting point for new React components using a table
 */
class TemplateForTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.fetchDocData = this.fetchDocData.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getTable = this.getTable.bind(this);
    this.greetings = this.greetings.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // this is where you put the initial call to the rest server
    // if you need to do so.
    this.fetchDocData();
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(this.props, this.state);
    this.promiseDemo("a ", "b ", this.callback);
  }

  callback = (result) => {
    console.log(result);
  }

  promiseDemo = (a, b, c) => {
    new Promise(function(fulfill, reject){
      let result = a + b + "c ";
      fulfill(result);
    }).then(function(result){
      return new Promise(function(fulfill, reject){
        let result2 = result + "d ";
        fulfill(result2);
      });
    }).then(function(result){
      return new Promise(function(fulfill, reject){
        let result3 = result + "e ";
        fulfill(result3);
      });
    }).then(function(result){
      c(result);
    });
  }

  setTheState = (props, currentState) => {
    let showSearchResults = false;
    let data = {
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
            thisClass: Labels.getTemplateForTableLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , selectedId: ""
          , selectedLibrary: ""
          , selectedTopic: ""
          , selectedKey: ""
          , selectedValue: ""
          , showModalWindow: false
          , title: ""
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

    // This example has hard coded the selection state.
    // In real-life, add a set of dropdowns for the user
    // to select from.
    let parms =
        "t=" + encodeURIComponent(this.state.selectedDocType)
        + "&d=" + encodeURIComponent(this.state.selectedDomain)
        + "&b=" + encodeURIComponent(this.state.selectedBook)
        + "&c=" + encodeURIComponent(this.state.selectedChapter)
        + "&q=" + encodeURIComponent(this.state.query)
        + "&p=" + encodeURIComponent(this.state.selectedProperty)
        + "&m=" + encodeURIComponent(this.state.selectedMatcher)
    ;

    Server.restGetPromise(
        this.props.restServer
        , Server.getDbServerDocsApi()
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

  greetings = () => {
    alert(this.state.selectedId);
  }
  handleRowSelect = (row, isSelected, e) => {
    console.log(row);
    this.setState((prevState, props) => {
      return {
        selectedId: row["id"]
            , selectedLibrary: row["library"]
          , selectedTopic: row["topic"]
          , selectedKey: row["key"]
          , selectedValue: row["value"]
          , showIdPartSelector: true
          , showModalWindow: true
          , title: row["id"]
      }
    }, this.greetings);
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
                  exportCSV={ false }
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
                    dataField='library'
                    dataSort={ true }
                    export={ false }
                    tdClassname="tdDomain"
                    width={this.state.idColumnSize}>{this.state.labels.resultsTableLabels.headerDomain}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='topic'
                    dataSort={ true }
                    export={ false }
                    width={this.state.idColumnSize}>{this.state.labels.resultsTableLabels.headerTopic}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='key'
                    export={ false }
                    dataSort={ true }
                    width={this.state.idColumnSize}>{this.state.labels.resultsTableLabels.headerKey}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='value'
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerValue}</TableHeaderColumn>
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
          {this.state.showModalEditor && this.getModalEditor()}
          {this.getTable()}
        </div>
    )
  }
}

TemplateForTable.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
};

TemplateForTable.defaultProps = {
};

export default TemplateForTable;
