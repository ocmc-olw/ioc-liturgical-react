import React from 'react';
import PropTypes from 'prop-types';
import Labels from './Labels';
import server from './helpers/Server';
import ResourceSelector from './modules/ReactSelector';
import TopicsSelector from './modules/TopicsSelector';
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

/**
 * Provides a text editor with source and models as parallel columns
 */
class ParaColTextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.setTheState(props, this.state);

    this.editable = this.editable.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.setTableData = this.setTableData.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleTopicSelect = this.handleTopicSelect.bind(this);
    this.onBeforeSaveCell = this.onBeforeSaveCell.bind(this);
    this.onAfterSaveCell = this.onAfterSaveCell.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.handleLibrarySelection = this.handleLibrarySelection.bind(this);
    this.handleFilterClear = this.handleFilterClear.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

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
    let topic = "";
    let message = Labels.getMessageLabels(this.props.session.languageCode).initial;
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

    return (
        {
          labels: {
            thisClass: Labels.getParaColTextEditorLabels(this.props.session.languageCode)
            , messages: Labels.getMessageLabels(this.props.session.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: message
          , resultCount: -1
          , topic: topic
          , libraries: libraries
          , dataFetched: dataFetched
          , values: values
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
            , placeholder: Labels.getMessageLabels(this.props.session.languageCode).regEx
          }
        }
    )
  }

  onSizePerPageList = (sizePerPage) => {
    this.setState({
      options: {sizePerPage: sizePerPage}
    });
  }

  fetchData = () => {
    let parms =
        "t=" + encodeURIComponent(this.state.topic)
        + "&l=" + encodeURIComponent(this.state.libraries)
    ;

    this.setState({
      message: this.state.labels.messages.retrieving
    },
      server.getViewForTopic(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , parms
          , this.handleFetchCallback
      )
    );

  }

  handleFetchCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      let about = data.about;
      let templateKeys = data.templateKeys;
      let libraryKeys = data.libraryKeys;
      let libraryKeyValues = data.libraryKeyValues;
      this.setState({
        dataFetched: true
        , about: about
        , libraryKeyValues: libraryKeyValues
        , libraryKeys: libraryKeys
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
  }

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
      }, this.setTableData);
    }
  }

  setTableData = () => {
    if (this.state.dataFetched) {
      let tableData = [];
      let j = this.state.templateKeys.length;
      for (let i = 0; i < j; i++) {
        let topicKey = this.state.templateKeys[i].key;
        let seq = this.state.libraryKeyValues[this.state.libraries[0]][this.state.templateKeys[i].libKeysIndex].seq;
        let source = this.state.libraryKeyValues[this.state.libraries[0]][this.state.templateKeys[i].libKeysIndex].value;
        let lib1 = "";
        let lib2 = "";
        let lib3 = "";
        if (this.state.libraries[1].length > 0) {
          lib1 = this.state.libraryKeyValues[this.state.libraries[1]][this.state.templateKeys[i].libKeysIndex].value;
        }
        if (this.state.libraries[2].length > 0) {
          lib2 = this.state.libraryKeyValues[this.state.libraries[2]][this.state.templateKeys[i].libKeysIndex].value;
        }
        if (this.state.libraries[3].length > 0) {
          lib3 = this.state.libraryKeyValues[this.state.libraries[3]][this.state.templateKeys[i].libKeysIndex].value;
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
      }
      this.setState({
        values: tableData
      });
    }
  }

  handleTopicSelect = (topic) => {
    this.setState({
      topic: topic
    });
    ;
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
    // update the local array with the new value
    let libraryKeyValues = this.state.libraryKeyValues;
    libraryKeyValues[library][this.state.templateKeys[index].libKeysIndex].value = value;
    this.setState({
      libraryKeyValues: libraryKeyValues
    });

    // now update the database via a rest call
    let parms =
        "i=" + encodeURIComponent(id)
        + "&t=" + encodeURIComponent("Liturgical")
    ;

    server.putValue(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , {value: value, seq: seq}
        , parms
        , this.handleValueUpdateCallback
    )
  }

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
  }

  /**
   * Does the user have permission to edit records in this library?
   * @param library
   * @returns {boolean}
   */
  editable = (library) => {
    let canEdit = false;
    for (let entry of this.props.session.userInfo.domains.author) {
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
  }

  handleSubmit = (event) => {
    this.fetchData();
    event.preventDefault();
  }

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
  }

  render() {
        return (
              <div className="App App-ParaColTextEditor">
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
                            <Row>
                              <Col xs={12} md={12}>
                                <div className="control-label">
                                  {this.state.labels.thisClass.view}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={12}>
                                <TopicsSelector
                                    session={this.props.session}
                                    library={"gr_gr_cog"}
                                    callBack={this.handleTopicSelect}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={12}>
                                <div className="control-label">
                                  {
                                    this.state.labels.thisClass.including
                                    + " "
                                    + this.props.source
                                    + ", "
                                    + this.state.labels.thisClass.select
                                    + " "
                                    + (this.state.maxLibraries)
                                    +  " "
                                    + this.state.labels.thisClass.libraries
                                  }
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={12}>
                                <ResourceSelector
                                    initialValue={this.state.libraries.join()}
                                    resources={this.props.session.userInfo.domains.reader}
                                    changeHandler={this.handleLibrarySelection}
                                    multiSelect={true}
                                />
                              </Col>
                            </Row>
                            <Row><Col>&nbsp;</Col></Row>
                            <Row>
                              <Col xs={12} md={12}>
                                <Button
                                    type="submit"
                                    bsStyle="primary"
                                    disabled={
                                      this.state.topic.length < 1
                                      || this.state.libraries.length < 1
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
                          <Col xs={10} md={6}>
                            <div className="control-label">
                              {this.state.labels.thisClass.msg2}
                            </div>
                          </Col>
                          <Col xs={2} md={2}>
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

ParaColTextEditor.propTypes = {
  session: PropTypes.object.isRequired
  , source: PropTypes.string.isRequired
};

ParaColTextEditor.defaultProps = {
};

export default ParaColTextEditor;
