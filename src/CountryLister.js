import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export class CountryLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.getTableGeneric = this.getTableGeneric.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state.docType), this.fetchData);
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, docType) => {


    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    let theSearchLabels = labels[labelTopics.SearchGeneric];

    // LanguageLister is a superset of CountryLister, so we use the language labels
    return (
        {
          labels: {
            thisClass: labels[labelTopics.LanguageLister]
            , resultsTableLabels: labels[labelTopics.resultsTable]
            , search: theSearchLabels
          }
          , message: theSearchLabels.msg1
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , resultCount: 0
          , data: get(this.state, "data", {values: [{"who": "", "when:": "", "what:": ""}]})
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          , filter: { type: 'RegexFilter', delay: 100 }
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , showSelectionButtons: false
          , selectedCode: get(this.state, "selectedCode", "" )
          , selectedValue: get(this.state, "selectedValue", "" )
          , selectedLocalValue: get(this.state, "selectedLocalValue", "" )
          , showModalEditor: false
          , idColumnSize: "80px"
        }
    )
  };

  handleRowSelect = (row, isSelected, e) => {
    let value = row["countryName"];
    let valueLocal = row["countryNameLocal"];
    if (value !== valueLocal) {
      value = valueLocal + " (" + value + ")";
    }
    this.setState({
      selectedCode: row["countryCode"]
      , selectedValue: value
    }, this.handleCallback);
  };

  handleCallback = () => {
    if (this.props.callBack) {
      this.props.callBack(this.state.selectedCode, this.state.selectedValue);
    }
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

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  getTableGeneric = () => {
    return (
        <BootstrapTable
            ref="theTable"
            data={this.props.session.dropdowns.isoCountries}
            exportCSV={ false }
            trClassName={"App-data-tr"}
            striped
            hover
            pagination
            options={ this.state.options }
            selectRow={ this.state.selectRow }
        >
          <TableHeaderColumn
              dataField='countryNameLocal'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.countryNameLocal}
          </TableHeaderColumn>
            <TableHeaderColumn
                isKey
                dataField='countryCode'
                dataSort={ true }
                filter={this.state.filter}
            >{this.state.labels.thisClass.countryCode}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='area'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.area}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='countryName'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.countryName}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  render() {
    return (
        <div className="App-Country-Lister">
              {this.getTableGeneric()}
        </div>
    )
  }
}

CountryLister.propTypes = {
  session: PropTypes.object.isRequired
  , callBack: PropTypes.func
};

CountryLister.defaultProps = {
};


export default CountryLister;