import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { ControlLabel } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export class LanguageLister extends React.Component {

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
          , selectedCountryCode: get(this.state, "selectedCountryCode", "" )
          , selectedCountryValue: get(this.state, "selectedCountryValue", "" )
          , showModalEditor: false
          , idColumnSize: "80px"
        }
    )
  };

  handleRowSelect = (row, isSelected, e) => {
    let langThree = row["languageCode"];
    let langTwo = row["languageCodeTwo"];
    let langCode = langThree;
    if (langTwo.length === 2) {
      langCode = langTwo;
    }
    let langName = row["languageName"];
    let langNameLocal = row["languageNameLocal"];
    if (langName !== langNameLocal) {
      langName = langNameLocal + " (" + langName + ")";
    }
    let countryName = row["countryName"];
    let countryNameLocal = row["countryNameLocal"];
    if (countryName !== countryNameLocal) {
      countryName = countryNameLocal + " (" + countryName + ")";
    }
    this.setState({
      selectedCode: langCode
      , selectedValue: langName
      , selectedCountryCode: row["countryCode"]
      , selectedCountryValue: countryName
    }, this.handleCallback);
  };

  handleCallback = () => {
    if (this.props.callBack) {
      this.props.callBack(
          this.state.selectedCode
          , this.state.selectedValue
          , this.state.selectedCountryCode
          , this.state.selectedCountryValue
      );
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
            data={this.props.session.dropdowns.isoLanguages}
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
              dataField='languageNameLocal'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.nameLocal}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='languageName'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.nameEnglish}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='languageCodeTwo'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.codeTwo}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='languageCode'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.codeThree}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='area'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.area}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='countryCode'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.countryCode}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='countryName'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.countryName}
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='countryNameLocal'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.thisClass.countryNameLocal}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  render() {
    return (
        <div className="App-Language-Lister">
          <ControlLabel>{this.state.labels.thisClass.copyright}</ControlLabel>
              {this.getTableGeneric()}
        </div>
    )
  }
}

LanguageLister.propTypes = {
  session: PropTypes.object.isRequired
  , callBack: PropTypes.func
};

LanguageLister.defaultProps = {
};


export default LanguageLister;