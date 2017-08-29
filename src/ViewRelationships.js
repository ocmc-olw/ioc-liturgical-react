import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Labels from './Labels';
import ModalSchemaBasedEditor from './modules/ModalSchemaBasedEditor';

import IdManager from './helpers/IdManager';
import MessageIcons from './helpers/MessageIcons';
import Server from './helpers/Server';
import Spinner from './helpers/Spinner';

/**
 * Use this as an example starting point for new React components
 */
class ViewRelationships extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.fetchData = this.fetchData.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.getTable = this.getTable.bind(this);
    this.onExportToCSV = this.onExportToCSV.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    if (this.state && this.state.dataFetched) {
      // do nothing
    } else {
      this.fetchData();
    }
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let dataFetched = false;
    let data = {values: [{"id": "", "value:": ""}]};

    if (currentState) {
      if (currentState.dataFetched) {
        dataFetched = currentState.dataFetched;
      }
      if (currentState.data) {
        data = currentState.data;
      }
    }
    return (
        {
          labels: {
            thisClass: Labels.getViewRelationshipsLabels(props.languageCode)
            , messages: Labels.getMessageLabels(props.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(props.languageCode).initial
          , resultCount: 0
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
          , dataFetched: dataFetched
          , data: data
        }
    )
  }


  fetchData = () => {
    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };

    let parms =
        "?t=" + encodeURIComponent("*")
        + "&d=" + encodeURIComponent("*")
        + "&q=" + encodeURIComponent("en_sys_ontology~" + this.props.id)
        + "&p=" + encodeURIComponent("id")
        + "&m=" + encodeURIComponent("sw")
        + "&l=" + encodeURIComponent("")
        + "&o=" + encodeURIComponent("any")
    ;
    let path = this.props.restServer + Server.getDbServerLinksApi() + parms;
    axios.get(path, config)
        .then(response => {
          this.setState({
                data: response.data
                , dataFetched: true
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
                data: response.data
                , dataFetched: true
                , message: message
                , resultCount: resultCount
                , messageIcon: this.messageIcons.info
                , showSearchResults: true
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = MessageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "no docs found";
            messageIcon = MessageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
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

  onExportToCSV = ( row ) => {
    console.log('onExportToCSV called')
    return this.state.data.values;
  }

  getTable = () => {
    if (this.state.dataFetched) {
      return (
          <div className="App-search-results">
            <div className="App-search-title">{this.props.id}</div>
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
                >ID
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='type'
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerLink}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='toId'
                    export={ false }
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerTo}
                </TableHeaderColumn>
                <TableHeaderColumn
                    dataField='tags'
                    export={ false }
                    dataSort={ true }
                >{this.state.labels.resultsTableLabels.headerTags}
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
        <div>
          {this.getTable()}
          {this.state.showModalWindow && this.getModalEditor()}
        </div>
    )
  }
}

ViewRelationships.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , id: PropTypes.string.isRequired
};

ViewRelationships.defaultProps = {
};

export default ViewRelationships;

