import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment';
import {
  Panel
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';

export class ActivityLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.fetchData = this.fetchData.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getTableGeneric = this.getTableGeneric.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTheState = this.setTheState.bind(this);
  }

  componentWillMount = () => {
    if (
        this.props.session
        && this.props.session.userInfo
        && this.props.session.userInfo.domains
        && this.props.session.userInfo.domains.isSuperAdmin
    ) {
      this.fetchData();
    }
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
            resultsTableLabels: labels[labelTopics.resultsTable]
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
          , showSelectionButtons: false
          , selectedId: get(this.state, "selectedId", "" )
          , selectedFromDate: moment().utc().subtract(7, "days").format('YYYY-MM-DD')
          , selectedToDate: moment().utc().add(1, "days").format('YYYY-MM-DD')
          , showModalEditor: false
          , idColumnSize: "80px"
          , title: "Activity for the last 7 days as of "
          , lastSearchTime: ""
          , searchCount: ""
        }
    )
  };


  getSearchForm() {
    return (
        <div>
          Search Form goes here
        </div>
    );
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
            data: restCallResult.data.values
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

      let parms =
          "f=" + encodeURIComponent(this.state.selectedFromDate)
          + "&t=" + encodeURIComponent(this.state.selectedToDate)
      ;

      Server.getActivities(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , parms
          , this.handleSearchCallback
      );
  }

  getTableGeneric = () => {
    return (
        <BootstrapTable
            ref="theTable"
            data={this.state.data}
            exportCSV={ false }
            trClassName={"App-data-tr"}
            striped
            hover
            pagination
            options={ this.state.options }
        >
          <TableHeaderColumn
              dataField='who'
              dataSort={ true }
              width={"15%"}
              filter={this.state.filter}
          >ID
          </TableHeaderColumn>
          <TableHeaderColumn
              dataField='when'
              dataSort={ true }
              width={"25%"}
              filter={this.state.filter}
          >{this.state.labels.resultsTableLabels.headerDomain}
          </TableHeaderColumn>
          <TableHeaderColumn
              isKey
              dataField='what'
              dataSort={ true }
              filter={this.state.filter}
          >{this.state.labels.resultsTableLabels.headerTopic}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  render() {
    return (
        <div className="App-page App-search">
          {this.state.showSearchResults && this.state.data &&
          <div className="App-search-results">
            <Panel
                className="App-Grammar-Site-panel"
                header={this.state.title + moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS") + "Z"}
                collapsible
            >
            <div className="row">
              {this.getTableGeneric()}
            </div>
            </Panel>
          </div>
          }
        </div>
    )
  }
}

ActivityLister.propTypes = {
  session: PropTypes.object.isRequired
};

ActivityLister.defaultProps = {
};


export default ActivityLister;