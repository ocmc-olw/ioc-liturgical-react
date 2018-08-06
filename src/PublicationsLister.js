import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import { Checkbox, Col, ControlLabel, Grid, Row, Well } from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker'
import ResourceSelector from './modules/ReactSelector'
import Spinner from './helpers/Spinner';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';

export class PublicationsLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.fetchData = this.fetchData.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getTable = this.getTable.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
    this.applyFilters = this.applyFilters.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.onlyUnique = this.onlyUnique.bind(this);
    this.getFilterRows = this.getFilterRows.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.getContent = this.getContent.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.getTypeRow = this.getTypeRow.bind(this);
    this.getDateRow = this.getDateRow.bind(this);
    this.handleAnyDateChange = this.handleAnyDateChange.bind(this);
  }

  componentWillMount = () => {
    if (
        this.props.session
    ) {
      this.fetchData();
    }
  };

  componentDidMount = () => {
    window.addEventListener("resize", this.updateDimensions);
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state.docType), this.fetchData);
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, docType) => {

    let hideBasedOnWidth = false;
    let innerWidth = window.innerWidth;
    if (innerWidth < 1024) {
      hideBasedOnWidth = true;
    }

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    let theSearchLabels = labels[labelTopics.SearchGeneric];

    return (
        {
          labels: {
            resultsTableLabels: labels[labelTopics.resultsTable]
            , messages: labels[labelTopics.messages]
            , search: theSearchLabels
            , thisClass: labels[labelTopics.publications]
          }
          , message: theSearchLabels.msg1
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , resultCount: 0
          , innerWidth: innerWidth
          , hideBasedOnWidth
          , data: get(this.state, "data", {values: [{"who": "", "when:": "", "what:": ""}]})
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
          , selectedDate: get(this.state,"selectedDate",moment().utc().format('YYYY-MM-DD'))
          , selectedFormattedDate: get(this.state,"selectedFormattedDate",moment().utc().format('YYYY/MM/DD'))
          , selectedId: get(this.state, "selectedId", "" )
          , selectedFromDate: moment().utc().subtract(7, "days").format('YYYY-MM-DD')
          , selectedToDate: moment().utc().add(1, "days").format('YYYY-MM-DD')
          , selectedTitle: get(this.state, "selectedTitle", "")
          , showModalEditor: false
          , idColumnSize: "80px"
          , title: "Activity for the last 7 days as of "
          , lastSearchTime: ""
          , searchCount: ""
        }
    )
  };

  updateDimensions = () => {
    let hideBasedOnWidth = false;
    let innerWidth = window.innerWidth;
    if (innerWidth < 1024) {
      hideBasedOnWidth = true;
    }
    this.setState({innerWidth: innerWidth, hideBasedOnWidth: hideBasedOnWidth});
  };

  handleRowSelect = (row, isSelected, e) => {
    let url = row["url"];
    window.open(url, '_blank');
  };

  applyFilters = () => {
    this.refs.theBookTable.handleFilterData({
      date: { type: 'TextFilter', value: [ this.state.selectedFormattedDate ] }
      , title: { type: 'TextFilter', value: [ this.state.selectedTitle ] }
    });
  };

  handleDateChange = (value, formattedValue) => {
    this.setState({
      selectedDate: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      selectedFormattedDate: formattedValue // Formatted String, ex: "11/19/2016"
    }, this.applyFilters);

  };

  getSearchForm = () => {
    return (
        <div>
          Search Form goes here
        </div>
    );
  };

  onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
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

  handleSearchCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      this.setState({
            data: restCallResult.data.values[0]["rowData"]
            , titleData: restCallResult.data.values[1]["titleData"].items
          }
      );
      let resultCount = 0;
      let message = this.state.labels.search.foundNone;
      let found = this.state.labels.search.foundMany;
      if (restCallResult.data.valueCount) {
        resultCount = restCallResult.data.valueCount;
        if (resultCount === 0) {
          message = this.state.labels.search.foundNone;
        } else if (resultCount === 1) {
          message = this.state.labels.search.foundOne;
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
    }
  };


  fetchData() {
      this.setState({
        message: this.state.labels.search.msg2
        , messageIcon: this.messageIcons.info
        , showSearchResults: false
      });

      Server.restGetPublications(
          this.props.session.restServer
          , this.handleSearchCallback
      );
  }

  handleAnyDateChange = (evt) => {
    let selectedFormattedDate = "any";
    let checked = evt.target.checked;
    if (checked) {

    } else {

    }
    this.setState({ anyDate: checked });
  };

  getTable = () => {
    if (this.state.showSearchResults && this.state.data) {
      return (
          <BootstrapTable
              ref="theBookTable"
              data={this.state.data}
              exportCSV={ false }
              trClassName={"App-data-tr"}
              striped
              hover
              pagination
              options={ this.state.options }
              selectRow={ this.state.selectRow }
          >
            <TableHeaderColumn
                dataField='url'
                isKey
                hidden
            >URL
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='title'
                dataSort={ true }
                filter={this.state.filter}
            >{this.state.labels.resultsTableLabels.headerTitle}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='date'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerDate}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='languageCodes'
                dataSort={ true }
                filter={this.state.filter}
            >{this.state.labels.resultsTableLabels.headerLanguage}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='language'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerLanguage}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='region'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerRegion}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='countryCode'
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >Country Code
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='country'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerCountry}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='publisher'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerPublisher}
            </TableHeaderColumn>
            <TableHeaderColumn
                dataField='filetype'
                dataSort={ true }
                filter={this.state.filter}
                hidden={this.state.hideBasedOnWidth}
            >{this.state.labels.resultsTableLabels.headerFileType}
            </TableHeaderColumn>
          </BootstrapTable>
      );
    } else {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      );
    }
  };

  handleTitleChange = (selection) => {
    let title = selection["value"];
    if (title === "any") {
      title = "";
    }
    this.setState({
      selectedTitle: title
    },this.applyFilters);
  };

  getDateRow = () => {
    return (
        <Row className="show-grid App-Pub-Date-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Pub-Date-Selector"}>
              <ControlLabel className="resourceSelectorPrompt">{this.state.labels.resultsTableLabels.headerDate}</ControlLabel>
              <DatePicker
                  id="app-datepicker"
                  value={this.state.selectedDate}
                  onChange={this.handleDateChange}
                  dateFormat={"YYYY/MM/DD"}
              />
              <Checkbox checked readOnly>
                Checkbox
              </Checkbox>
            </div>
          </Col>
        </Row>
    );
  };

  getTypeRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Type-Selector"}>
              <ResourceSelector
                  title={this.state.labels.resultsTableLabels.headerTitle}
                  initialValue={this.state.selectedTitle}
                  resources={this.state.titleData}
                  changeHandler={this.handleTitleChange}
                  multiSelect={false}
              />
            </div>
          </Col>
        </Row>
    );
  };

  getFilterRows = () => {
    return (
        <div className="container App-search-options-container">
          <Well>
            <Grid>
              {this.getDateRow()}
              {this.getTypeRow()}
            </Grid>
          </Well>
        </div>
    )
  };

  getContent = () => {
    if (this.state.showSearchResults && this.state.data) {
      return (
          <div>
            {this.getFilterRows()}
            <div className="row">
              {this.getTable()}
            </div>
          </div>
      )
    } else {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      );
    }
  };


  render() {
    return (
        <div className="App-pub-list">
          {this.getContent()}
        </div>
    )
  }
}

PublicationsLister.propTypes = {
  session: PropTypes.object.isRequired
};

PublicationsLister.defaultProps = {
};


export default PublicationsLister;