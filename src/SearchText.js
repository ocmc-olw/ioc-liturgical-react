import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SearchOptionsAdvanced from "./modules/SearchOptionsAdvanced";
import SearchOptionsSimple from "./modules/SearchOptionsSimple";
import SearchTextResultsTable from "./modules/SearchTextResultsTable";
import ModalCompareDocs from './modules/ModalCompareDocs';
import FontAwesome from 'react-fontawesome';
import {
  Button
  , ControlLabel
  , FormControl
  , FormGroup
  , Panel
  , PanelGroup
  , Well
} from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import Server from './helpers/Server';
import Spinner from './helpers/Spinner';
import ModalParaRowEditor from './ModalParaRowEditor';
import IdManager from './helpers/IdManager';

export class Search extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    let search = labels[labelTopics.search];
    this.state = {
      labels: {
        thisClass: labels[labelTopics.ParaTextEditor]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTable: labels[labelTopics.resultsTable]
        , search: search
      },
      docType: this.props.initialDocType,
      docTypes: [
        {label: "All", value: "all"}
        , {label: "Biblical", value: "Biblical"}
        , {label: "Liturgical", value: "Liturgical"}
      ]
      ,
      domain: "*"
      ,
      selectedBook: "*"
      ,
      selectedChapter: "*"
      ,
      query: ""
      ,
      matcher: "c"
      ,
      matcherTypes: [
        {label: search.matchesAnywhere, value: "c"}
        , {label: search.matchesAtTheStart, value: "sw"}
        , {label: search.matchesAtTheEnd, value: "ew"}
        , {label: search.matchesRegEx, value: "rx"}
      ]
      ,
      suggestedQuery: ""
      ,
      docProp: "nnp"
      ,
      propertyTypes: [
        {label: "ID", value: "id"}
        , {label: "Value (insensitive)", value: "nnp"}
        , {label: "Value (sensitive)", value: "value"}
      ]
      ,
      docPropMessage: ""
      ,
      docPropMessageById: "Search By ID searches the ID of the docs, with the parts domain~topic~key, e.g. gr_gr_cog~actors~Priest."
      ,
      docPropMessageByValue: "Search By Value is insensitive to accents, case, and punctuation."
      ,
      docPropMessageByValueSensitive: "Search By Value (sensitive) is sensitive to accents, case, and punctuation."
      ,
      searchFormToggle: this.messageIcons.toggleOff
      ,
      showSearchForm: true
      ,
      filterMessage: search.msg5
      ,
      selectMessage: search.msg6
      ,
      searchFormType: "simple"
      ,
      showSearchResults: false
      ,
      fetchingData: false
      ,
      resultCount: 0
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
      selectedIdPartsPrompt: "Select one or more ID parts, then click on the search icon:"
      ,
      selectedIdParts: [
        {key: "domain", label: ""},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showIdPartSelector: false
      , selectedValue: ""
      , selectedSeq: ""
      , showModalWindow: false
      , idColumnSize: "80px"
    };
    this.deselectAllRows = this.deselectAllRows.bind(this);
    this.editable = this.editable.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getBars = this.getBars.bind(this);
    this.getDocComparison = this.getDocComparison.bind(this);
    this.getDocTypes = this.getDocTypes.bind(this);
    this.getMatcherTypes = this.getMatcherTypes.bind(this);
    this.getSearchAccordion = this.getSearchAccordion.bind(this);
    this.getSearchForm = this.getSearchForm.bind(this);
    this.getSelectedDocOptions = this.getSelectedDocOptions.bind(this);
    this.getTableIndex = this.getTableIndex.bind(this);
    this.handleAdvancedSearchSubmit = this.handleAdvancedSearchSubmit.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
    this.handleCloseDocComparison = this.handleCloseDocComparison.bind(this);
    this.handleDoneRequest = this.handleDoneRequest.bind(this);
    this.handleEditorClose = this.handleEditorClose.bind(this);
    this.handleIdQuerySelection = this.handleIdQuerySelection.bind(this);
    this.handleParaTextEditorSubmit = this.handleParaTextEditorSubmit.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleSearchFormTypeChange = this.handleSearchFormTypeChange.bind(this);
    this.handleSimpleSearchSubmit = this.handleSimpleSearchSubmit.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onRowDoubleClick = this.onRowDoubleClick.bind(this);
    this.onSizePerPageList = this.onSizePerPageList.bind(this);
    this.searchFormOptionIcons = this.searchFormOptionIcons.bind(this);
    this.showResultsStatus = this.showResultsStatus.bind(this);
    this.showRowComparison = this.showRowComparison.bind(this);
    this.showSelectionButtons = this.showSelectionButtons.bind(this);
    this.toggleSearchForm = this.toggleSearchForm.bind(this);
    this.toogleIdPattern = this.toogleIdPattern.bind(this);
  }

  componentWillMount = () => {
    let showSelectionButtons = false;
    if (this.props.callback) {
      showSelectionButtons = true;
    }
    this.setState({
          message: this.state.labels.search.msg1
          , messageIcon: this.messageIcons.info
          , docPropMessage: this.state.docPropMessageByValue
          , showSelectionButtons: showSelectionButtons
        }
    );
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer
        + Server.getDbServerDropdownsSearchTextApi();
    axios.get(path, config)
        .then(response => {
          let liturgicalDomains = response.data.values[1]["domains"];
          if (this.props
              && this.props.session
              && this.props.session.userInfo
              && this.props.session.userInfo.domains
          ) {
            if (this.props.session.userInfo.domains.liturgicalSearch) {
              liturgicalDomains = this.props.session.userInfo.domains.liturgicalSearch;
            }

          }
          this.setState({
                dropdowns: {
                  Biblical: {
                    all: {
                      books: response.data.values[0]["all"][0]["books"]
                      , chapters: response.data.values[0]["all"][0]["chapters"]
                    }
                    , domains: response.data.values[0]["domains"]
                    , topics: response.data.values[0]["topics"]
                  }
                  , Liturgical: {
                    all: {
                      books: response.data.values[1]["all"][0]["books"]
                    }
                    , domains: liturgicalDomains
                    , topics: response.data.values[1]["topics"]
                  }
                  , loaded: true
                }
              , domainInfo: response.data.values[2]
            }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 401) {
            message = Server.getWsServerDbApi() + " is a protected database.  Please login and try again.";
            messageIcon = this.messageIcons.error;
          } else if (error && error.response && error.response.status === 404) {
            message = "error retrieving values for dropdowns";
            messageIcon = this.messageIcons.error;
          } else if (error && error.message && error.message.toLowerCase() === "network error") {
            message = "The database server " + Server.getWsServerDbApi() + " is not available.";
            messageIcon = this.messageIcons.error;
          }
          this.setState({data: message, message: message, messageIcon: messageIcon});
        });
  };

  login(loginRequired) {
    if (loginRequired) {
      this.props.router.replace('/login');
    }
  }

  componentWillReceiveProps = (nextProps) => {
    let dropdowns = {};
    let liturgicalDomains = [];
    if (this.state.dropdowns) {
      dropdowns = this.state.dropdowns;
    }
    if (dropdowns && dropdowns.Liturgical) {
      if (dropdowns.Liturgical.domains) {
        liturgicalDomains = dropdowns.Liturgical.domains;
      }
      if (nextProps
          && nextProps.session
          && nextProps.session.userInfo
          && nextProps.session.userInfo.domains
      ) {
        if (nextProps.session.userInfo.domains.liturgicalSearch) {
          liturgicalDomains = nextProps.session.userInfo.domains.liturgicalSearch;
        }
      }
      dropdowns.Liturgical.domains = liturgicalDomains;
    }

    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;
    let search = labels[labelTopics.search];

      this.setState({
      docType: nextProps.initialDocType
      , labels: {
        thisClass: labels[labelTopics.ParaTextEditor]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTable: labels[labelTopics.resultsTable]
        , search: search
      }
      , selectedId: ""
      , selectedValue: ""
      , selectedSeq: ""
      , matcherTypes: [
        {label: search.matchesAnywhere, value: "c"}
        , {label: search.matchesAtTheStart, value: "sw"}
        , {label: search.matchesAtTheEnd, value: "ew"}
        , {label: search.matchesRegEx, value: "rx"}
      ]
      , dropdowns: dropdowns
    });
  };


  getTableIndex = (id) => {
    let result = undefined;
    this.state.data.values.forEach(function(element, index) {
      if (element["id"] === id ) {
        result = index;
        return true;
      }
    });
    return result;
  };

  handleParaTextEditorSubmit = (value) => {
    // only update if the value changed
    let data = this.state.data;
    let index = this.getTableIndex(this.state.selectedId);
    let currentValue = data.values[index].value;
    if (value !== currentValue) {
     // update the value held client-side in memory
      data.values[index].value = value;
      this.setState({
        data: data
        , showModalWindow: false
      });
     // now update the database via a rest call
      let parms =
          "i=" + encodeURIComponent(this.state.selectedId)
          + "&t=" + encodeURIComponent("Liturgical")
      ;
      Server.putValue(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , {value: value, seq: undefined}
          , parms
          , this.handleValueUpdateCallback
      )
    } else {
     this.setState(
         {
           showModalWindow: false
         }
     );
    }
  };

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
      }, this.setTableData);
    }
  };

  /**
   * Does the user have permission to edit records in this library?
   * @param library
   * @returns {boolean}
   */
  editable = (id) => {
    let canEdit = false;
    if (id) {
      let library = IdManager.getLibrary(id);
      for (let entry of this.props.session.userInfo.domains.author) {
        if (entry.value == library) {
          canEdit = true;
          break;
        }
      };
    }
    return canEdit;
  };


  toggleSearchForm = () => {
    let showing = this.state.searchFormType;
    let searchFormToggleIcon;
    let searchFormToggleMessage;

    if (showing) {
      searchFormToggleIcon = this.messageIcons.toggleOn;
      searchFormToggleMessage = this.state.advancedSearchMessage;
    } else {
      searchFormToggleIcon = this.messageIcons.toggleOff;
      searchFormToggleMessage = this.state.simpleSearchMessage;
    }
    this.setState({
      searchFormType: !showing
      , searchFormToggle: searchFormToggleIcon
      , searchFormToggleMessage: searchFormToggleMessage
    });
  }
  searchFormOptionIcons() {
    return (
        <div>
          Search Type:
          <span className="App-search-options">
          <label
              id={this.searchFormTypes.simple}
              className="App-search-form-option-label control-label"
              onClick={this.handleSearchFormTypeChange}>
            <FontAwesome
                id={this.searchFormTypes.simple}
                onClick={this.handleSearchFormTypeChange}
                name={this.messageIcons.simpleSearch}
            />Simple
          </label>
          <label
              id={this.searchFormTypes.advanced}
              onClick={this.handleSearchFormTypeChange}
              className="App-search-form-option-label control-label">
            <FontAwesome
                id={this.searchFormTypes.advanced}
                onClick={this.handleSearchFormTypeChange}
                name={this.messageIcons.advancedSearch}
            />
            Advanced
          </label>
          </span>
        </div>
    );
  }

  handleSearchFormTypeChange (event) {
    switch(event.target.id) {
      case (this.searchFormTypes.simple): {
        this.setState({
          searchFormType: this.searchFormTypes.simple
        });
        break;
      }
      case (this.searchFormTypes.advanced): {
        this.setState({
          searchFormType: this.searchFormTypes.advanced
        });
        break;
      }
      case (this.searchFormTypes.idPattern): {
        this.setState({
          searchFormType: this.searchFormTypes.idPattern
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  formOptionStyles = {
    hidden: { display: 'none' }
    , visible: { display: 'inline' }
  }

  toogleIdPattern (id) {
    if (id.length > 0) {
      return this.formOptionStyles.visible;
    } else {
      return this.formOptionStyles.hidden;
    }
  }

  getSearchAccordion(type) {
    if (this.props.callback) {
      return (
            <Panel className="App-search-panel" header={this.state.labels.search.advanced} eventKey="2">
              {this.state.dropdowns ?
                  <SearchOptionsAdvanced

                      docType={this.state.docType}
                      docTypes={this.state.docTypes}
                      dropDowns={this.state.dropdowns}
                      properties={this.state.propertyTypes}
                      matchers={this.getMatcherTypes()}
                      handleSubmit={this.handleAdvancedSearchSubmit}
                      labels={this.state.labels.search}
                  />
                  : "Loading dropdowns for advanced search..."}
            </Panel>
      );
    } else {
      return (
          <PanelGroup defaultActiveKey="1" accordion>
            <Panel  className="App-search-panel" header={this.state.labels.search.simple} eventKey="1">
              <SearchOptionsSimple
                  valueTitle=""
                  buttonLabel={this.state.labels.search.submit}
                  placeholder={this.state.labels.search.prompt}
                  handleSubmit={this.handleSimpleSearchSubmit}
              />
            </Panel>
            <Panel className="App-search-panel" header={this.state.labels.search.advanced} eventKey="2">
              {this.state.dropdowns ?
                  <SearchOptionsAdvanced
                      docType={this.props.initialDocType}
                      docTypes={this.state.docTypes}
                      dropDowns={this.state.dropdowns}
                      properties={this.state.propertyTypes}
                      matchers={this.getMatcherTypes()}
                      handleSubmit={this.handleAdvancedSearchSubmit}
                      labels={this.state.labels.search}
                  />
                  : "Loading dropdowns for advanced search..."}
            </Panel>
          </PanelGroup>
      );
    }
  }

  getSearchForm(type) {
    switch(type) {
      case (this.searchFormTypes.advanced): {
        return (
            <SearchOptionsAdvanced
                docType={this.props.initialDocType}
                docTypes={this.getDocTypes()}
                dropDowns={this.state.dropdowns}
                properties={this.state.propertyTypes}
                matchers={this.state.matcherTypes}
                handleSubmit={this.handleAdvancedSearchSubmit}
                labels={this.state.labels.search}
            />
        );
      }
      default: {
        return (
            <SearchOptionsSimple
                valueTitle=""
                buttonLabel={this.state.labels.search.submit}
                placeholder="enter a word or phrase and press the search icon..."
                handleSubmit={this.handleSimpleSearchSubmit}
            />
        );
      }
    }
  }

  getMatcherTypes () {
    return (
        [
            {label: this.state.labels.search.matchesAnywhere, value: "c"}
            , {label: this.state.labels.search.matchesAtTheStart, value: "sw"}
            , {label: this.state.labels.search.matchesAtTheEnd, value: "ew"}
            , {label: this.state.labels.search.matchesRegEx, value: "rx"}
            ]
    )
  }
  handleCancelRequest() {
    if (this.props.callback) {
      this.props.callback("","");
    }
  }

  handleDoneRequest() {
    if (this.props.callback) {
      this.props.callback(
          this.state.selectedId
          , this.state.selectedValue
          , this.state.selectedSeq
          , this.state.selectedSchema
      );
    }
  }

  getSelectedDocOptions() {
    return (
        <Panel>
          <FormGroup>
            <div>
            <ControlLabel>{this.state.labels.search.searchToSelectInstructions}</ControlLabel>
            </div>
            <ControlLabel>{this.state.labels.search.selectedId}</ControlLabel>
            <FormControl
              type="text"
              value={this.state.selectedId}
              disabled
            />
            <ControlLabel>{this.state.labels.search.selectedValue}</ControlLabel>
            <Well>{this.state.selectedValue}
            </Well>
            <div>
            <Button
                bsSize="small"
                className={"Button-Cancel"}
                onClick={this.handleCancelRequest}>
                {this.state.labels.buttons.cancel}
            </Button>
            <Button
                bsSize="small"
                className={"Button-Select"}
                bsStyle="primary"
                onClick={this.handleDoneRequest}
                disabled={this.state.selectedId.length < 1}
            >
              {this.state.labels.buttons.select}
            </Button>
            </div>
          </FormGroup>
        </Panel>
    )
  }

  handleIdQuerySelection(value) {
    this.setState({
          domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "id"
          , matcher: "rx"
          , query: value
        }
        , this.fetchData
    );
  }

  handleAdvancedSearchSubmit = (
      type
      , domain
      , book
      , chapter
      , property
      , matcher
      , value
      , seq
  ) => {
    this.setState({
          docType: type
          , domain: domain
          , selectedBook: book
          , selectedChapter: chapter
          , docProp: property
          , matcher: matcher
          , query: value
          , selectedSeq: seq
        }
        , this.fetchData
    );
  };

  handleSimpleSearchSubmit = (value) => {
    this.setState({
          docType: "Liturgical"
          , domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "nnp"
          , matcher: "c"
          , query: value
        }
        , this.fetchData
    );
  };

  onRowClick = (row) => {
  };

  onRowDoubleClick = (row) => {
  };

  handleRowSelect = (id, value, schemaId) => {
    let idParts = id.split("~");
    this.setState({
      selectedId: id
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: value
      , selectedSchema: schemaId
      , showIdPartSelector: true
      , showModalWindow: true
    }, this.showRowComparison(id, value));
  };

  showRowComparison = (id, value) => {
    this.setState({
      showModalWindow: true
      , selectedId: id
      , selectedValue: value
    })
  };

  deselectAllRows = () => {
    if (this.refs && this.refs.theTable) {
      this.refs.theTable.setState({
        selectedRowKeys: []
      });
    }
  };

  handleCloseDocComparison = (id, value, seq) => {
    if (id && id.length > 0) {
      this.setState({
        showModalWindow: false
        , selectedId: id
        , selectedValue: value
        , selectedSeq: seq
      }, this.deselectAllRows)
    } else {
      this.setState({
        showModalWindow: false
      }, this.deselectAllRows)
    }
  };


  handleEditorClose = (id, value, seq) => {
    if (id && id.length > 0) {
      this.setState({
        showModalWindow: false
        , selectedId: id
        , selectedValue: value
        , selectedSeq: seq
      })
    } else {
      this.setState({
        showModalWindow: false
      })
    }
    this.deselectAllRows();
  };

  getDocTypes = () => {
    return (
      [
          {label: this.state.labels.search.typeAny, value: "all"}
            , {label: this.state.labels.search.biblical, value: "Biblical"}
            , {label: this.state.labels.search.liturgical, value: "Liturgical"}
            ]
    );
  }

  getDocComparison = () => {
    let debug = false;
    if (this.props.session.userInfo.authenticated
        && this.state.docType === "Liturgical"
        && ! this.props.callback) {
      return (
          <ModalParaRowEditor
              session={this.props.session}
              editId={this.state.selectedId}
              value={this.state.selectedValue}
              showModal={this.state.showModalWindow}
              onClose={this.handleEditorClose}
              onSubmit={this.handleParaTextEditorSubmit}
              canChange={this.editable(this.state.selectedId)}
          />
      )
    } else {
      return (
          <ModalCompareDocs
              session={this.props.session}
              showModal={this.state.showModalWindow}
              title={this.state.selectedId}
              docType={this.state.docType}
              selectedIdParts={this.state.selectedIdParts}
              onClose={this.handleCloseDocComparison}
              labels={this.state.labels.search}
          />
      )
    }
  };

  showSelectionButtons = (id) => {
    this.setState({
      showSelectionButtons: true
      , selectedId: id
    });
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
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  };

  searchFormTypes = {
    simple: "simple"
    , advanced: "advanced"
    , idPattern: "id"
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  fetchData(event) {
    this.setState({
      message: this.state.labels.search.msg2
      , messageIcon: this.messageIcons.info
      , fetchingData: true
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let parms =
            "?t=" + encodeURIComponent(this.state.docType)
            + "&d=" + encodeURIComponent(this.state.domain)
            + "&b=" + encodeURIComponent(this.state.selectedBook)
            + "&c=" + encodeURIComponent(this.state.selectedChapter)
            + "&q=" + encodeURIComponent(this.state.query)
            + "&p=" + encodeURIComponent(this.state.docProp)
            + "&m=" + encodeURIComponent(this.state.matcher)
            + "&l=" + encodeURIComponent(this.props.session.location)
        ;
    let path = this.props.session.restServer + Server.getWsServerDbApi() + 'docs' + parms;
    axios.get(path, config)
        .then(response => {
          this.setState({
                data: response.data
              }
          );
          let resultCount = 0;
          let message = this.state.labels.search.foundNone;
          let found = this.state.labels.search.foundMany;
          if (response.data.valueCount) {
            resultCount = response.data.valueCount;
            if (resultCount === 1) {
              message = this.state.labels.search.foundOne;
            } else if (resultCount > 1) {
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
                , fetchingData: false
              }
          );
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = this.state.labels.search.foundNone;
            messageIcon = this.messageIcons.warning;
            this.setState({
              data: message
              , message: message
              , messageIcon: messageIcon
              , fetchingData: false
            });
          }
        });
  }

  /**
   * If the type of doc is
   *  Liturgical
   * and selected selectedBook is
   *  eothinon
   *  menaion
   *  octoechos
   * then display the additional two dropdown boxes, e.g. for month and day
   *
   *  Biblical
   *  then display selectedChapter numbers <-- must vary based on selectedBook!
   *
   * TODO: in Java, query database for each domain and collect the possible values for each part of the topic.
   * @returns {XML}
   */

//          <div>Search Form: <FontAwesome onClick={this.toggleSearchForm} name={this.state.searchFormToggle}/>{this.state.searchFormToggleMessage}</div>

  getBars = () => {
    return (
        <span><FontAwesome name="bars"/></span>
    )
  };

  showResultsStatus = () => {
    if (this.state.fetchingData) {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>      );
    } else {
      if (this.state.showSearchResults) {
        return (
            <div>
              {this.state.labels.search.msg5} {this.state.labels.search.msg6}
              <SearchTextResultsTable
                  session={this.props.session}
                  data={this.state.data.values}
                  callBack={this.handleRowSelect}
              />
            </div>
        );
      }
    }
  };

  render() {
    return (
        <div className="App-search">
          <h3>{this.state.labels.search.pageTitle}</h3>
          {this.state.showSelectionButtons && this.getSelectedDocOptions()}
          <div className="App-search-form">
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                {this.getSearchAccordion(this.state.searchFormType)}
              </div>
            </div>
          </div>

          <div>{this.state.labels.search.resultLabel}: <span className="App App-message"><FontAwesome
              name={this.state.messageIcon}/>{this.state.message} </span>
          </div>
          {this.showResultsStatus()}
          {this.state.showModalWindow && this.getDocComparison()}

        </div>
    )
  }
}

Search.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func
  , initialDocType: PropTypes.string.isRequired
  , dropdowns: PropTypes.object
};


export default Search;