import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MessageIcons from '../helpers/MessageIcons';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class SearchTextResultsTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props);

    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getTable = this.getTable.bind(this);

  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps));
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    return ({
      labels: labels[labelTopics.resultsTable]
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , options: {
        sizePerPage: 30
        , sizePerPageList: [5, 15, 30]
        , onSizePerPageList: this.onSizePerPageList
        , hideSizePerPage: true
        , paginationShowsTotal: true
      }
      , filter: { type: 'RegexFilter', delay: 100 }
      , selectRow: {
        mode: 'radio' // or checkbox
        , hideSelectColumn: false
        , clickToSelect: false
        , onSelect: this.handleRowSelect
        , className: "App-row-select"
      }
      , showSelectionButtons: false
      , selectedId: ""
      , idColumnSize: "80px"
    })
  };

  handleRowSelect = (row) => {
    this.setState({
      selectedId: row["id"]
    }, this.props.callBack(row["id"], row["value"], row["_valueSchemaId"]));
  };

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
    });
  };

  getTable = () => {
    return (
        <div className="row">
          <BootstrapTable
              ref="theTable"
              data={this.props.data}
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
            >ID</TableHeaderColumn>
            <TableHeaderColumn
                dataField='library'
                search
                dataSort={ true }
                export={ false }
                filter={this.state.filter}
                tdClassname="tdDomain"
                width={this.state.idColumnSize}>{this.state.labels.headerDomain}</TableHeaderColumn>
            <TableHeaderColumn
                dataField='topic'
                filter={this.state.filter}
                dataSort={ true }
                export={ false }
                width={this.state.idColumnSize}>{this.state.labels.headerTopic}</TableHeaderColumn>
            <TableHeaderColumn
                dataField='key'
                filter={this.state.filter}
                export={ false }
                dataSort={ true }
                width={this.state.idColumnSize}>{this.state.labels.headerKey}</TableHeaderColumn>
            <TableHeaderColumn
                dataField='value'
                filter={this.state.filter}
                dataSort={ true }
            >{this.state.labels.headerValue}</TableHeaderColumn>
            <TableHeaderColumn
                dataField='_valueSchemaId'
                export={ false }
                hidden
            >
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
    );
  };

  render() {
    return (
        <div className="App-search-results">
          {this.getTable()}
        </div>
    )
  }
};

SearchTextResultsTable.propTypes = {
  session: PropTypes.object.isRequired
  , data: PropTypes.array.isRequired
  , callBack: PropTypes.func.isRequired
};

// set default values for props here
SearchTextResultsTable.defaultProps = {
};

export default SearchTextResultsTable;
