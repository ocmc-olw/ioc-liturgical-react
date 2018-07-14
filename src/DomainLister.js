import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, ControlLabel, FormControl } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from "./helpers/Server";
import MessageIcons from './helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';
import axios from "axios/index";

export class DomainLister extends React.Component {

  constructor(props) {

    super(props);

    this.state = this.setTheState(props, "");

    this.editable = this.editable.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getAddButton = this.getAddButton.bind(this);
    this.getModalNewEntryForm = this.getModalNewEntryForm.bind(this);
    this.getTable = this.getTable.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.notEditable = this.notEditable.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.putUpdate = this.putUpdate.bind(this);
    this.setTheState = this.setTheState.bind(this);
  }

  componentDidMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state), this.fetchData);
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, currentState) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    let theSearchLabels = labels[labelTopics.SearchGeneric];
    let messageIcon = MessageIcons.getMessageIcons().info;

    let clickType = "dbclick";
    try {
      if (window.innerWidth < 800) {
        clickType = "click";
      }
    } catch (err) {
      clickType = "dbclick";
    }

    return (
        {
          labels: {
            thisClass: labels[labelTopics.DomainLister]
            , search: theSearchLabels
          }
          , message: theSearchLabels.msg1
          , messageIcon: get(currentState, "messageIcon", messageIcon)
          , filterMessage: theSearchLabels.msg5
          , selectMessage: theSearchLabels.msg6
          , resultCount: 0
          , data: get(currentState, "data", {values: [{"id": "", "languageCode": "", "countryCode:": "", "realm:": "", "description:": ""}]})
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          , filter: { type: 'RegexFilter', delay: 100 }
          , cellEditProp : {
            mode: clickType
            , beforeSaveCell: this.onBeforeSaveCell
            , afterSaveCell: this.onAfterSaveCell
            , nonEditableRows: this.notEditable
            , blurToEscape: true
          }
          , showSelectionButtons: false
          , selectedCode: get(currentState, "selectedCode", "" )
          , selectedValue: get(currentState, "selectedValue", "" )
          , selectedCountryCode: get(currentState, "selectedCountryCode", "" )
          , selectedCountryValue: get(currentState, "selectedCountryValue", "" )
          , showModalEditor: false
          , idColumnSize: "80px"
          , updateIndex: get(currentState,"updateIndex", 0)
        }
    )
  };

  notEditable = () => {
    return this.state.data.filter(d => ! this.props.session.userInfo.isAuthorFor(d.domain)).map(d => d.domain);
  };

  onBeforeSaveCell = (row, cellName, cellValue) => {
  };

  /**
   *
   * @param row - returns the entire row including nbr, topicKey, etc.
   * @param cellName - the column title, i.e. the library
   * @param cellValue - the text value entered
   */
  onAfterSaveCell = (row, cellName, cellValue) => {
    let index = row.nbr;
    let dataRow = row;
    dataRow.description = cellValue;
    // update the local array with the new value
    let data = this.state.data;
    data[index] = dataRow;
    this.setState({
      data: data
      , updateIndex: index
    }, this.putUpdate);

  };


  putUpdate() {
    var config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let row = this.state.data[this.state.updateIndex];
    let id = row.domain;
    let path = "misc/domains/" + id;
    let message = "";
    axios.put(
        this.props.session.restServer
        + Server.getWsServerAdminApi()
        + path
        , this.state.data[this.state.updateIndex]
        , config
    )
        .then(response => {
          message = "updated " + path;
          this.setState({
            message: message
          });
          this.setState({centerDivVisible: true});
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = MessageIcons.getMessageIcons().error;
          this.setState( { message: message, messageIcon: messageIcon });
        });
  }

  handleAddButtonClick = () => {
    this.setState({showModalAdd: true});
  };

  fetchData() {
    if (this.props.session && this.props.session.userInfo) {
      this.setState({
        message: this.state.labels.search.msg2
        , messageIcon: MessageIcons.getMessageIcons().info
        , showSearchResults: false
      });

      Server.getCollectiveDomains(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , this.handleSearchCallback
      );
    }
  };

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
            , messageIcon: MessageIcons.getMessageIcons().info
            , showSearchResults: true
          }
      );
    }
  };

  getAddButton = () => {
    return (
        <Button
            className="Text-Note-Add-Button"
            bsStyle="primary"
            bsSize={"xsmall"}
            onClick={this.handleAddButtonClick}>
          <FontAwesome
              className="App-Add-ico"
              name="plus"/>
        </Button>
    )
  };

  getModalNewEntryForm = () => {
  };

  handleRowSelect = (row, isSelected, e) => {
    this.setState({
      selectedCode: row["id"]
    }, this.handleCallback);
  };

  handleCallback = () => {
    if (this.props.callBack) {
      this.props.callBack(
          this.state.selectedCode
      );
    }
  };

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
    });
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  getTable = () => {
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
            cellEdit={this.state.cellEditProp}
        >
          <TableHeaderColumn
              ref="domain"
              isKey
              dataField='domain'
              dataSort={ true }
              export={ true }
              hidden
          >ID
          </TableHeaderColumn>
          <TableHeaderColumn
              ref="languageCode"
              dataField='languageCode'
              dataSort={ true }
              filter={this.state.filter}
              width={"10%"}
              editable={false}
          >{this.state.labels.thisClass.languageCode}
          </TableHeaderColumn>
          <TableHeaderColumn
              ref="countryCode"
              dataField='countryCode'
              dataSort={ true }
              filter={this.state.filter}
              width={"10%"}
              editable={false}
          >{this.state.labels.thisClass.countryCode}
          </TableHeaderColumn>
          <TableHeaderColumn
              ref="realm"
              dataField='realm'
              dataSort={ true }
              filter={this.state.filter}
              width={"15%"}
              editable={false}
          >{this.state.labels.thisClass.realm}
          </TableHeaderColumn>
          <TableHeaderColumn
              ref="description"
              dataField='description'
              dataFormat={this.cellEditFormat}
              dataSort={ true }
              filter={this.state.filter}
              editable={{type: 'textarea'}}
          >{this.state.labels.thisClass.description}
          </TableHeaderColumn>
        </BootstrapTable>
    );
  };

  /**
   * Does the user have permission to edit records in this library?
   * @param library
   * @returns {boolean}
   */
  editable = (library) => {
      return { type: 'textarea' };
  };

  render() {
    return (
        <div className="App-page App-search">
          <h3>{this.state.labels.thisClass.title}</h3>
          <div>{this.state.labels.search.resultLabel}: <span className="App App-message"><FontAwesome name={this.state.messageIcon}/>{this.state.message} {this.getAddButton()}</span>
          </div>
          {this.state.showSearchResults &&
          <ControlLabel>
            {this.state.labels.thisClass.howto}
          </ControlLabel>
          }
          {this.state.showModalAdd && this.getModalNewEntryForm()}
          {this.state.showSearchResults &&
          <div className="App-search-results">
            <div className="row">
              {this.getTable()}
            </div>
          </div>
          }
        </div>
    )
  }
}

DomainLister.propTypes = {
  session: PropTypes.object.isRequired
  , callBack: PropTypes.func
};

DomainLister.defaultProps = {
};


export default DomainLister;