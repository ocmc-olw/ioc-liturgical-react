import React from 'react';

import {
  Button
  , ControlLabel
  , FormControl
  , FormGroup
  , Well
} from 'react-bootstrap';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import Server from './helpers/Server';
import Labels from './Labels';
import Grammar from './modules/Grammar';
import IdManager from './helpers/IdManager';

/**
 * Display modal content.
 */
export class ParaRowTextEditor extends React.Component {

  constructor(props) {
    super(props);

    console.log("ParaRowTextEditor::constructor");

    this.state = {
      labels: {
        thisClass: Labels.getComponentParaTextEditorLabels(this.props.languageCode)
        , search: Labels.getSearchLabels(this.props.languageCode)
      }
      , showSearchResults: false
      , message: Labels.getSearchLabels(this.props.languageCode).msg1
      ,
      messageIcon: this.messageIcons.info
      ,
      data: {values: [{"id": "", "value:": ""}]}
      ,
      options: {
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
      ,
      showSelectionButtons: false
      ,
      selectedId: ""
      ,
      selectedValue: ""
      ,
      selectedIdPartsPrompt: "Select one or more ID parts, then click on the search icon:"
      ,
      selectedIdParts: [
        {key: "domain", label: ""},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      ,
      showIdPartSelector: false
      , showModalCompareDocs: false
      , idColumnSize: "80px"
      , editorValue: ""
      , currentDocType: this.props.docType
      , currentIdLibrary: this.props.idLibrary
      , currentIdTopic: this.props.idTopic
      , currentIdKey: this.props.idKey
    }

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePropsChange = this.handlePropsChange.bind(this);
  };

  componentWillMount = () => {
    console.log("ParaRowTextEditor::componentWillMount");
    this.setState({
          showModal: this.props.showModal
          , domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "id"
          , matcher: "rx"
          , query: ".*"
          + this.props.idTopic
          + "~.*"
          + this.props.idKey
        }
        , function () {
          this.fetchData();
        }
    );

  }

  componentWillReceiveProps = (nextProps) => {
    console.log("ParaRowTextEditor::componentWillReceiveProps");
    this.setState({
          labels: {
            thisClass: Labels.getComponentParaTextEditorLabels(nextProps.languageCode)
            , search: Labels.getSearchLabels(nextProps.languageCode)
          }
        }
        , function () {
          this.handlePropsChange();
        }
    );
  }

  /**
   * Because we are passing back the value each time it changes,
   * componentWillReceiveProps keeps getting called.
   * We don't want that to result in calling fetchData unless
   * the docType, library, topic, or key changed.
   */
  handlePropsChange = () => {
    if (this.state.currentDocType !== this.props.docType
      || this.state.currentIdLibrary !== this.props.idLibrary
        || this.state.currentIdTopic !== this.props.idTopic
        || this.state.currentIdKey !== this.props.idKey
    ) {
      this.fetchData();
    }
  }

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  }

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  fetchData() {
    this.setState({
      message: this.state.labels.search.msg2
      , messageIcon: this.messageIcons.info
    });
    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.props.docType)
            + "&d=" + encodeURIComponent(this.state.domain)
            + "&b=" + encodeURIComponent(this.state.selectedBook)
            + "&c=" + encodeURIComponent(this.state.selectedChapter)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
        ;
    let path = this.props.restServer + Server.getWsServerDbApi() + 'docs' + parms;
    axios.get(path, config)
        .then(response => {
          this.setState({
                data: response.data
              }
          );
          let message = "No docs found...";
          if (response.data.valueCount && response.data.valueCount > 0) {
            message = this.state.labels.search.msg3
                + " "
                + response.data.valueCount
                + " "
                + this.state.labels.search.msg4
                + "."
          }
          this.setState({
                message: message
                , messageIcon: this.messageIcons.info
                , showSearchResults: true
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "no docs found";
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }


  close() {
    this.setState({showModal: false});
    this.props.onClose(
        this.state.selectedId
        , this.state.selectedValue
        , this.state.data
    );
  };

  open() {
    this.setState({showModal: true});
  };

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
    });
  }

  handleEditorChange = (event) => {
    this.setState({
      editorValue: event.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(event.target.value);
    }
  }

  handleSubmit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.editorValue);
    }
  }

  render() {
    return (
        <div>
          {(! this.state.showSearchResults) ? <div>Loading</div>:
              <div className="App-search-results">
                <ControlLabel>
                  {this.state.labels.thisClass.showingMatchesFor + " " + this.props.idTopic + "~" + this.props.idKey}
                </ControlLabel>
                <div className="row">
                  <Well>
                  <BootstrapTable
                      data={this.state.data.values}
                      trClassName={"App-data-tr"}
                      striped
                      hover
                      pagination
                      options={ this.state.options }
                  >
                    <TableHeaderColumn
                        isKey
                        dataField='id'
                        dataSort={ true }
                        hidden
                    >ID</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='library'
                        dataSort={ true }
                        width={this.state.idColumnSize}>Domain</TableHeaderColumn>
                    <TableHeaderColumn
                        dataField='value'
                        dataSort={ true }
                    >Value</TableHeaderColumn>
                  </BootstrapTable>
                  </Well>
                </div>
                {this.props.onSubmit &&
                <div>
                  <Well>
                    <form onSubmit={this.handleSubmit}>
                      <FormGroup controlId="formControlsTextarea">
                        <ControlLabel>
                          {this.state.labels.thisClass.yourTranslation
                          + " (" + this.props.idLibrary + ")"}
                        </ControlLabel>
                        <div>
                          <textarea
                              rows="4"
                              cols="100"
                              spellCheck="true"
                              value={this.state.editorValue}
                              onChange={this.handleEditorChange}
                          >
                          </textarea>
                        </div>
                      </FormGroup>
                      <Button
                          type="submit"
                          bsStyle="primary"
                          disabled={this.state.editorValue.length < 1}
                      >
                        {this.state.labels.thisClass.submit}
                      </Button>
                      {this.props.message && this.props.messageIcon &&
                        <span className="App-message"><FontAwesome
                            name={this.props.messageIcon}/>
                          {this.props.message}
                        </span>
                      }
                    </form>
                  </Well>
                </div>
                }
                <div>
                  <Well>
                    <Grammar
                        restServer={this.props.restServer}
                        username={this.props.username}
                        password={this.props.password}
                        languageCode={this.props.languageCode}
                        idTopic={this.props.idTopic}
                        idKey={this.props.idKey}
                    />
                  </Well>
                </div>
              </div>
              }
        </div>
    );
  }
}

ParaRowTextEditor.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , languageCode: React.PropTypes.string.isRequired
  , docType: React.PropTypes.string.isRequired
  , idLibrary: React.PropTypes.string.isRequired
  , idTopic: React.PropTypes.string.isRequired
  , idKey: React.PropTypes.string.isRequired
  , value: React.PropTypes.string.isRequired
  , onSubmit: React.PropTypes.func
  , onChange: React.PropTypes.func
  , message: React.PropTypes.string
  , messageIcon: React.PropTypes.string
};
export default ParaRowTextEditor;

