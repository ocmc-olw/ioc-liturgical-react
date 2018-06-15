import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import server from './helpers/Server';
import ResourceSelector from './modules/ReactSelector';
import MessageIcons from './helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {
  Button
  , Col
  , FormGroup
  , Grid
  , Row
  , Well
} from 'react-bootstrap';
import User from "./classes/User";

/**
 * Provides a text editor with source and models as parallel columns
 */
class ParaColLabelEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.setTheState(props, this.state);

    this.editable = this.editable.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getUiLanguageRow = this.getUiLanguageRow.bind(this);
    this.getUiSystemRow = this.getUiSystemRow.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
    this.handleLibrarySelection = this.handleLibrarySelection.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTopicSelect = this.handleTopicSelect.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.setTableData = this.setTableData.bind(this);
  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  };

  setTheState = (props, currentState) => {
    let dataFetched = false;
    let values = undefined;
    let about = {};
    let libraryKeyValues = {};
    let libraryKeys = [];
    let templateKeys = [];
    let libraries = [
      this.props.source
      , ""
      , ""
      , ""
    ];
    let languages = [
      "en"
      , ""
      , ""
      , ""
    ];
    let topic = "";
    let message = props.session.labels[props.session.labelTopics.messages].initial;
    let messageIcon = MessageIcons.getMessageIcons().info;

    if (currentState) {
      if (message !== currentState.message) {
        message = currentState.message;
      }
      if (messageIcon !== currentState.messageIcon) {
        messageIcon = currentState.messageIcon;
      }
      if (currentState.dataFetched) {
        dataFetched = currentState.dataFetched;
      }
      if (currentState.languages) {
        languages = currentState.languages;
      }
      if (currentState.libraries) {
        libraries = currentState.libraries;
      }
      if (currentState.topic) {
        topic = currentState.topic;
      }
      if (currentState.dataFetched) {
        values = currentState.values;
      }
    }

    let userInfo = {};
    if (props.session && props.session.userInfo) {
      userInfo = new User(
          props.session.userInfo.username
          , props.session.userInfo.password
          , props.session.userInfo.domain
          , props.session.userInfo.email
          , props.session.userInfo.firstname
          , props.session.userInfo.lastname
          , props.session.userInfo.title
          , props.session.userInfo.authenticated
          , props.session.userInfo.domains
      );
    }

    return (
        {
          labels: {
            thisClass: props.session.labels[props.session.labelTopics.ParaColTextEditor]
            , messages: props.session.labels[props.session.labelTopics.messages]
          }
          , labelsToAdd: {
            system: "Select the system"
            , language: "Select up to 3 languages in addition to English"
          }
          , session: {
            userInfo: userInfo
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: message
          , selectedUiSystem: get(this.state, "selectedUiSystem", "ilr")
          , resultCount: -1
          , topic: topic
          , languages: languages
          , libraries: libraries
          , dataFetched: dataFetched
          , values: values
          , updatedLanguage: get(this.state,"updatedLanguage", "")
          , updatedTopic: get(this.state,"updatedTopic", "")
          , updatedKey: get(this.state,"updatedKey","")
          , updatedValue: get(this.state,"updatedValue","")
          , about: about
          , libraryKeyValues: libraryKeyValues
          , libraryKeys: libraryKeys
          , templateKeys: templateKeys
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , cellEditProp : {
            mode: 'dbclick'
            , beforeSaveCell: this.onBeforeSaveCell
            , afterSaveCell: this.onAfterSaveCell
          }
          , maxCols: 6
          , maxLibraries: 4
          , topicKeyColumnSize: "40px"
          , libraryValueColumnSize: "80px"
          , tableColumnFilter: {
            defaultValue: ""
            , type: 'RegexFilter'
            , placeholder: props.session.labels[props.session.labelTopics.messages].regEx
          }
        }
    )
  };

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
    });
  };

  fetchData = () => {
    let libraries = [];
    this.state.languages.forEach((lang) => {
      if (lang) {
        let library = lang + ("_sys_") + this.state.selectedUiSystem;
        libraries.push(library);
      }
    });
    let parms = "&l=" + encodeURIComponent(libraries.join(","))
        + "&e=" + encodeURIComponent("en_sys_") + this.state.selectedUiSystem
    ;

    // add empty libraries for the table columns (hidden if empty, but must exist)
    let missing =  4 - libraries.length;
    for (let i = 0; i < missing; i++) {
      libraries.push("");
    }
    this.setState({
          message: this.state.labels.messages.retrieving
          , libraries: libraries
        },
        server.getUiLabels(
            this.props.session.restServer
            , this.state.session.userInfo.username
            , this.state.session.userInfo.password
            , parms
            , this.handleFetchCallback
        )
    );

  };

  handleFetchCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      console.log("Dude, you've got data!");
      console.log(data);
      let libraryKeyValues = data.libraryKeyValues;
      let templateKeys = data.templateKeys;
      this.setState({
        dataFetched: true
        , libraryKeyValues: libraryKeyValues
        , templateKeys: templateKeys
        , message: this.state.labels.messages.found
        + " "
        + templateKeys.length
        + " "
        + this.state.labels.messages.docs
        , messageIcon: restCallResult.messageIcon
        , resultCount: templateKeys.length
      }, this.setTableData);
    }
  };

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      try {
        let labels = this.props.session.labelsAll;

        labels[this.state.updatedLanguage][this.state.updatedTopic][this.state.updatedKey] = this.state.updatedValue;
        if (this.state.updatedLanguage.endsWith(this.props.session.languageCode)) {
          this.props.session.labels[this.state.updatedTopic][this.state.updatedKey] = this.state.updatedValue;
        }
      } catch (err) {
        console.log(err);
      }
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
      }, this.setTableData);
    }
  };

  setTableData = () => {
    if (this.state.dataFetched) {
      let tableData = [];
      let j = this.state.templateKeys.length;
      for (let i = 0; i < j; i++) {
        try {
          let topicKey = this.state.templateKeys[i].key;
          let seq = this.state.libraryKeyValues[this.state.libraries[0]][this.state.templateKeys[i].libKeysIndex].seq;
          let source = this.state.libraryKeyValues[this.state.libraries[0]][this.state.templateKeys[i].libKeysIndex].value;
          let lib1 = "";
          let lib2 = "";
          let lib3 = "";
          if (this.state.libraries[1].length > 0) {
            try {
              lib1 = this.state.libraryKeyValues[this.state.libraries[1]][this.state.templateKeys[i].libKeysIndex].value;
            } catch (err) {
            }
          }
          if (this.state.libraries[2].length > 0) {
            try {
              lib2 = this.state.libraryKeyValues[this.state.libraries[2]][this.state.templateKeys[i].libKeysIndex].value;
            } catch (err) {
            }
          }
          if (this.state.libraries[3].length > 0) {
            try {
              lib3 = this.state.libraryKeyValues[this.state.libraries[3]][this.state.templateKeys[i].libKeysIndex].value;
            } catch (err) {
            }
          }
          let row = {};
          row["nbr"] = i;
          row["seq"] = seq;
          row["topicKey"] = topicKey;
          row[this.state.libraries[0]] = source;
          row[this.state.libraries[1]] = lib1;
          row[this.state.libraries[2]] = lib2;
          row[this.state.libraries[3]] = lib3;
          tableData.push(row);
        } catch (err) {
          console.log(this.state.libraries);
          console.log(i + " " + this.state.libraries[i]);
          console.log(err);
        }
      }
      this.setState({
        values: tableData
      });
    }
  };

  handleTopicSelect = (topic) => {
    this.setState({
      topic: topic
    });
  };

  handleRowSelect = (row, isSelected, e) => {
    // row["id"], etc.
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
    let seq = row.seq;
    let topicKey = row.topicKey;
    let library = cellName;
    let value = cellValue;
    let id = library + "~" + topicKey;
    let language = "";
    let topic = "";
    let key = "";
    try {
      let parts = topicKey.split("~");
      topic = parts[0];
      key = parts[1];
      parts = library.split("_");
      language = parts[0];
    } catch (err) {
      console.log(err);
    }
    // update the local array with the new value
    let libraryKeyValues = this.state.libraryKeyValues;
    libraryKeyValues[library][this.state.templateKeys[index].libKeysIndex] = value;
    this.setState({
      libraryKeyValues: libraryKeyValues
      , updatedLanguage: language
      , updatedTopic: topic
      , updatedKey: key
      , updatedValue: value
    });

    // now update the database via a rest call
    let parms =
        "i=" + encodeURIComponent(id)
        + "&t=" + encodeURIComponent("UI Interface Label")
    ;

    server.putUiLabel(
        this.props.session.restServer
        , this.state.session.userInfo.username
        , this.state.session.userInfo.password
        , {value: value, seq: seq}
        , parms
        , this.handleValueUpdateCallback
    )
  };

  handleLibrarySelection = (selection) => {
    let libraries = [];
    let source = this.props.source;
    let sourceFound = false;
    libraries.push(this.props.source);
    selection.forEach(function(lib) {
      if (lib.value == source) {
        sourceFound = true;
      } else {
        libraries.push(lib.value);
      }
    });
    let emptyCols = this.state.maxCols - libraries.length;
    for (let i=0; i < emptyCols; i++) {
      libraries.push("");
    }
    let message = "";
    let messageIcon = MessageIcons.getMessageIcons().info;
    if ( ! sourceFound ) {
      message = this.state.labels.thisClass.sourceRequired
          + " "
          + this.props.source;
      messageIcon = MessageIcons.getMessageIcons().error;
    } else if (selection.length > (this.state.maxLibraries)){
      message = this.state.labels.thisClass.maxLibraries
          + " "
          + this.state.maxLibraries;
      messageIcon = MessageIcons.getMessageIcons().error;
    }
    this.setState({
      libraries: libraries
      , message: message
      , messageIcon: messageIcon
    });
  };

  handleUiSystemSelection = (selection) => {
    this.setState({
      selectedUiSystem: selection.value
    });
  };

  handleUiLanguageSelection = (selection) => {
    let languages = [];
    let source = "en";
    let sourceFound = false;
    languages.push("en");
    selection.forEach(function(lib) {
      if (lib.value == source) {
        sourceFound = true;
      } else {
        languages.push(lib.value);
      }
    });
    let emptyCols = this.state.maxCols - languages.length;
    for (let i=0; i < emptyCols; i++) {
      languages.push("");
    }
    let message = "";
    let messageIcon = MessageIcons.getMessageIcons().info;
    if ( ! sourceFound ) {
      message = this.state.labels.thisClass.sourceRequired
          + " "
          + this.props.source;
      messageIcon = MessageIcons.getMessageIcons().error;
    } else if (selection.length > (this.state.maxLibraries)){
      message = this.state.labels.thisClass.maxLibraries
          + " "
          + this.state.maxLibraries;
      messageIcon = MessageIcons.getMessageIcons().error;
    }
    this.setState({
      languages: languages
      , message: message
      , messageIcon: messageIcon
    });
  };
  /**
   * Does the user have permission to edit records in this library?
   * @param library
   * @returns {boolean}
   */
  editable = (library) => {
    let canEdit = false;
    for (let entry of this.state.session.userInfo.domains.author) {
      if (entry.value == library) {
        canEdit = true;
        break;
      }
    }
    if (canEdit) {
      return { type: 'textarea' };
    } else {
      return false;
    }
  };

  handleSubmit = (event) => {
    this.fetchData();
    event.preventDefault();
  };

  handleFilterClear = () => {
    if (this.refs) {
      if (this.refs.topicKey) {
        this.refs.topicKey.applyFilter("");
      }
      if (this.refs.source) {
        this.refs.source.applyFilter("");
      }
      if (this.refs.lib1) {
        this.refs.lib1.applyFilter("");
      }
      if (this.refs.lib2) {
        this.refs.lib2.applyFilter("");
      }
      if (this.refs.lib3) {
        this.refs.lib3.applyFilter("");
      }
    }
  };

  getUiLanguageRow = () => {
    if (this.props.session
        && this.props.session.dropdowns
        && this.props.session.dropdowns.uiLanguagesDropdown) {
      return (
          <div>
            <Row>
              <Col xs={12} md={12}>
                <ResourceSelector
                    title={this.state.labelsToAdd.language}
                    initialValue={this.state.languages.join()}
                    resources={this.props.session.dropdowns.uiLanguagesDropdown}
                    changeHandler={this.handleUiLanguageSelection}
                    multiSelect={true}
                />
              </Col>
            </Row>
          </div>
    );
    }
  };

  getUiSystemRow = () => {
    if (this.props.session
        && this.props.session.dropdowns
        && this.props.session.dropdowns.uiSystemsDropdown) {
      return (
          <div>
            <Row>
              <Col xs={12} md={12}>
                <ResourceSelector
                    title={this.state.labelsToAdd.system}
                    initialValue={this.state.selectedUiSystem}
                    resources={this.props.session.dropdowns.uiSystemsDropdown}
                    changeHandler={this.handleUiSystemSelection}
                    multiSelect={false}
                />
              </Col>
            </Row>
          </div>
      );
    }
  };

  render() {
    return (
        <div className="App App-ParaColLabelEditor">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-12">
              <Well className="App-Para-Col-Editor">
                <form onSubmit={this.handleSubmit}>
                  <FormGroup controlId="formControlsTextarea">
                    <Grid>
                      <Row>
                        <Col xs={12} md={12}>
                          <h3>{this.state.labels.thisClass.panelTitle}</h3>
                        </Col>
                      </Row>
                      {this.getUiSystemRow()}
                      {this.getUiLanguageRow()}
                      <Row><Col>&nbsp;</Col></Row>
                      <Row>
                        <Col xs={12} md={12}>
                          <Button
                              type="submit"
                              bsStyle="primary"
                              disabled={
                                this.state.selectedUiSystem.length < 1
                                || this.state.languages.length < 1
                              }
                          >
                            {this.state.labels.messages.submit}
                          </Button>
                          <div>{this.state.labels.messages.status}: <span className="App App-message"><FontAwesome
                              name={this.state.messageIcon}/>{this.state.message} </span>
                          </div>
                        </Col>
                      </Row>
                    </Grid>
                  </FormGroup>
                </form>
              </Well>
            </div>
            {this.state.values &&
            <div className="col-sm-12 col-md-12 col-lg-12">
              <Well>
                <Grid>
                  <Row>
                    <Col xs={9} md={9}>
                      <div className="control-label">
                        {this.state.labels.thisClass.msg2}
                      </div>
                    </Col>
                    <Col xs={3} md={3}>
                      <Button
                          onClick={ this.handleFilterClear }
                          bsStyle="primary"
                          className="App-table-filter-clear"
                      >{this.state.labels.messages.clearFilters}
                      </Button>
                    </Col>
                  </Row>
                </Grid>
                <BootstrapTable
                    ref="table"
                    data={this.state.values}
                    trClassName={"App-data-tr"}
                    striped
                    pagination
                    options={ this.state.options }
                    cellEdit={this.state.cellEditProp}
                >
                  <TableHeaderColumn
                      ref="topicKey"
                      isKey
                      dataField='topicKey'
                      dataSort={ true }
                      width={this.state.topicKeyColumnSize}
                      filter={ this.state.tableColumnFilter }
                  >Topic~Key</TableHeaderColumn>
                  <TableHeaderColumn
                      ref="source"
                      dataSort={ true }
                      dataField={this.state.libraries[0]}
                      tdClassname="tdColEditorSource"
                      width={this.state.libraryValueColumnSize}
                      editable={this.editable(this.state.libraries[0])}
                      filter={ this.state.tableColumnFilter }
                  >{this.state.libraries[0]}
                  </TableHeaderColumn>
                  <TableHeaderColumn
                      ref="lib1"
                      dataSort={ true }
                      dataField={this.state.libraries[1]}
                      editable={this.editable(this.state.libraries[1])}
                      tdClassname='tdColEditorLib1'
                      width={this.state.libraryValueColumnSize}
                      hidden={this.state.libraries[1].length == 0}
                      filter={ this.state.tableColumnFilter }
                  >{this.state.libraries[1]}</TableHeaderColumn>
                  <TableHeaderColumn
                      ref="lib2"
                      dataField={this.state.libraries[2]}
                      dataSort={ true }
                      tdClassname='tdColEditorLib2'
                      width={this.state.libraryValueColumnSize}
                      editable={this.editable(this.state.libraries[2])}
                      filter={ this.state.tableColumnFilter }
                      hidden={this.state.libraries[2].length == 0}
                  >{this.state.libraries[2]}</TableHeaderColumn>
                  <TableHeaderColumn
                      ref="lib3"
                      dataField={this.state.libraries[3]}
                      dataSort={ true }
                      editable={this.editable(this.state.libraries[0])}
                      tdClassname='tdColEditorLib3'
                      width={this.state.libraryValueColumnSize}
                      filter={ this.state.tableColumnFilter }
                      hidden={this.state.libraries[3].length == 0}
                  >{this.state.libraries[3]}</TableHeaderColumn>
                </BootstrapTable>
              </Well>
            </div>
            }
          </div>
        </div>
    )
  }
}

ParaColLabelEditor.propTypes = {
  session: PropTypes.object.isRequired
  , source: PropTypes.string.isRequired
};

ParaColLabelEditor.defaultProps = {
};

export default ParaColLabelEditor;
