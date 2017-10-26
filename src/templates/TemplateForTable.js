import React from 'react';
import PropTypes from 'prop-types';
import IdManager from '../helpers/IdManager';
import MessageIcons from '../helpers/MessageIcons';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';

import Labels from '../Labels';
import Server from '../helpers/Server';
import Spinner from '../helpers/Spinner';
import ModalSchemaBasedEditor from '../modules/ModalSchemaBasedEditor';

/**
 * Use this as an example starting point for new React components using a table
 * The order in which life-cycle methods are called is:
 * this class's constructor
 * this class's componentWillMount
 * child component's constructor
 * child component's componentWillMount
 * this class's componentDidMount
 * child component's componentDidMount
 *
 * When the panel containing this component is expanded the following are called:
 * this class's componentWillReceiveProps
 * child component's componentWillReceiveProps
 */
class TemplateForTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getTemplateForTableLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , selectedId: ""
      , selectedLibrary: ""
      , selectedTopic: ""
      , selectedKey: ""
      , selectedValue: ""
      , showModalWindow: false
      , title: ""
      , data: {}
      , resultCount: 0
      , fetching: false
      , selectedDocType: "Liturgical"
      , selectedDomain: "en_us_dedes"
      , selectedBook: "me"
      , selectedChapter: "m01"
      , selectedProperty: "nnp"
      , query: "joy"
      , selectedMatcher: "c"
      , showSearchResults: false
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
  };

    this.fetchDocData = this.fetchDocData.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getTable = this.getTable.bind(this);

    // the following are examples, remove them as needed
    this.handleStateChange = this.handleStateChange.bind(this);
    this.greetings = this.greetings.bind(this);
  }

  componentWillMount = () => {
    // don't use this for anything
  }

  componentDidMount = () => {
    // this is where you put the initial call to the rest server
    // if you need to do so.
    this.fetchDocData();
  }

  componentWillReceiveProps = (nextProps) => {
    // use this to preserve any previous state if necessary
    // and to call a function that depends on the new state being set.
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getTemplateForTableLabels(nextProps.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
          }
          , message: Labels.getMessageLabels(props.session.languageCode).initial
        }
      }, function () { return this.handleStateChange("parm")});
    }
  }

  // this is called after setState has finished.
  handleStateChange = (parm) => {
    // put here a call to whatever method is needed.
  }

  fetchDocData = () => {

    this.setState({fetching: true});

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
        this.props.session.restServer
        , Server.getDbServerDocsApi()
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
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

  greetings = () => {
    alert(this.state.selectedId);
  }

  handleRowSelect = (row, isSelected, e) => {
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
            session={this.props.session}
            restPath={Server.getDbServerLinksApi()}
            showModal={this.state.showModalWindow}
            title={this.state.title}
            idLibrary={this.state.selectedLibrary}
            idTopic={this.state.selectedTopic}
            idKey={this.state.selectedKey}
            onClose={this.handleCloseModal}
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
    }  else if (this.state.fetching) {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      );
    } else {
      return (<div></div>)
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
  session: PropTypes.object.isRequired
};

TemplateForTable.defaultProps = {
};

export default TemplateForTable;
