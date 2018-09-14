import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import Server from '../helpers/Server';
import CompareDocs from './CompareDocs';
import {get} from "lodash";
import TreeViewUtils from "../helpers/TreeViewUtils";

/**
 * Display modal content.
 */
export class ModalCompareDocs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showSearchResults: false
      , message: this.props.labels.msg1
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
        , hideSelectColumn: (this.props.hasCallback ? false : true)
        , clickToSelect: false
        , onSelect: this.handleRowSelect
        , className: "App-row-select"
        , selected: []
      }
      ,
      showSelectionButtons: false
      ,
      selectedId: ""
      ,
      selectedValue: ""
      ,
      selectedSeq: ""
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
      , _isMounted: get(this.state,"_isMounted", false)
      , _requestTokens: get(this.state,"_requestTokens", new Map())
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.oldFetchData = this.oldFetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
  };

  componentDidMount = () => {
    this.setState({_isMounted: true});
  };

  componentWillUnmount = () => {
    if (this.state && this.state._requestTokens) {
      for (let token of this.state._requestTokens.keys()) {
        try {
          Server.cancelRequest(token);
        } catch (error) {
          // ignore
        }
      }
    }
    this.setState({_isMounted: false});
  };

  componentWillMount = () => {
    this.setState({
          showModal: this.props.showModal
          , domain: "*"
          , selectedBook: "*"
          , selectedChapter: "*"
          , docProp: "id"
          , matcher: "rx"
          , query: ".*~"
          + this.props.selectedIdParts[1].label
          + "~"
          + this.props.selectedIdParts[2].label
          + "$"
        }
        , function () {
          this.fetchData();
        }
    );
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

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  fetchData = () => {
    let requestTokens = this.state._requestTokens;
    const requestToken = Server.getRequestToken();
    requestTokens.set(requestToken,"live");
    this.setState({
      message: this.props.labels.msg2
      , messageIcon: this.messageIcons.info
      , _requestTokens: requestTokens
    });

    let parms =
        "?t=" + encodeURIComponent(this.props.docType)
        + "&d=" + encodeURIComponent(this.state.domain)
        + "&b=" + encodeURIComponent(this.state.selectedBook)
        + "&c=" + encodeURIComponent(this.state.selectedChapter)
        + "&q=" + encodeURIComponent(this.state.query)
        + "&p=" + encodeURIComponent(this.state.docProp)
        + "&m=" + encodeURIComponent(this.state.matcher)
    ;

    Server.getTextComparison(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , parms
        , this.handleFetchCallback
        , requestToken
    );
    this.setState({_requestTokens: requestTokens});
  };

  handleFetchCallback = (response) => {
    if (this.state._isMounted && response && response.data && response.data.values) {
        this.state._requestTokens.delete(requestToken);
        // if one of the values is greek, then make it the selected row
        let selectedId = "";
        let selectedValue = "";
        let selectRow = this.state.selectRow;
        if (response.data.values) {
          // select the Greek value.  If not, if there is only one item, select it
          let theItem = response.data.values.find(o => o.id.startsWith("gr_"));
          if (theItem) {
            selectedId = theItem.id;
            selectedValue = theItem.value;
            selectRow.selected = [selectedId];
          } else {
            if (response.data.values.length === 1) {
              theItem = response.data.values[0];
              selectedId = theItem.id;
              selectedValue = theItem.value;
              selectRow.selected = [selectedId];
            }
          }
        }
        this.setState({
              selectRow: selectRow
              , selectedId: selectedId
              , selectedValue: selectedValue
              , data: response.data
            }
        );
        let resultCount = 0;
        let message = this.props.labels.foundNone;
        let found = this.props.labels.foundMany;
        if (response.data.valueCount) {
          resultCount = response.data.valueCount;
          if (resultCount === 0) {
            message = this.props.labels.foundNone;
          } else if (resultCount === 1) {
            message = this.props.labels.foundOne;
          } else {
            message = found
                + " "
                + resultCount
                + ".";
          }
        }
        this.setState({
              message: message
              , messageIcon: this.messageIcons.info
              , showSearchResults: true
            }
        );
    };
  };

  oldFetchData() {
    let requestTokens = this.state._requestTokens;
    const requestToken = Server.getRequestToken();
    requestTokens.set(requestToken,"live");
    this.setState({
      message: this.props.labels.msg2
      , messageIcon: this.messageIcons.info
      , _requestTokens: requestTokens
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
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
    let path = this.props.session.restServer + Server.getWsServerDbApi() + 'docs' + parms;
    axios.get(path, config)
        .then(response => {
          if (this.state._requestTokens.has(requestToken)) {
            this.state._requestTokens.delete(requestToken);
            // if one of the values is greek, then make it the selected row
            let selectedId = "";
            let selectedValue = "";
            let selectRow = this.state.selectRow;
            if (response.data.values) {
              // select the Greek value.  If not, if there is only one item, select it
              let theItem = response.data.values.find(o => o.id.startsWith("gr_"));
              if (theItem) {
                selectedId = theItem.id;
                selectedValue = theItem.value;
                selectRow.selected = [selectedId];
              } else {
                if (response.data.values.length === 1) {
                  theItem = response.data.values[0];
                  selectedId = theItem.id;
                  selectedValue = theItem.value;
                  selectRow.selected = [selectedId];
                }
              }
            }
            this.setState({
                  selectRow: selectRow
                  , selectedId: selectedId
                  , selectedValue: selectedValue
                  , data: response.data
                }
            );
            let resultCount = 0;
            let message = this.props.labels.foundNone;
            let found = this.props.labels.foundMany;
            if (response.data.valueCount) {
              resultCount = response.data.valueCount;
              if (resultCount === 0) {
                message = this.props.labels.foundNone;
              } else if (resultCount === 1) {
                message = this.props.labels.foundOne;
              } else {
                message = found
                    + " "
                    + resultCount
                    + ".";
              }
            }
            this.setState({
                  message: message
                  , messageIcon: this.messageIcons.info
                  , showSearchResults: true
                }
            );
          }
        })
        .catch((error) => {
          if (this.state._requestTokens.has(requestToken)) {
            this.state._requestTokens.delete(requestToken);
            let message = error.message;
            let messageIcon = this.messageIcons.error;
            if (error && error.response && error.response.status === 404) {
              message = this.props.labels.foundNone;
              messageIcon = this.messageIcons.warning;
              this.setState({data: message, message: message, messageIcon: messageIcon});
            }
          }
        });
  }


  close() {
    this.setState({showModal: false});
    if (this.props.onClose) {
      this.props.onClose(
          this.state.selectedId
          , this.state.selectedValue
          , this.state.selectedSeq
      );
    }
  };

  open() {
    this.setState({showModal: true});
  };

  handleRowSelect = (row, isSelected, e) => {
    let selectRow = this.state.selectRow;
    selectRow.selected = [row["id"]];
    let idParts = row["id"].split("~");
    this.setState({
      selectRow: selectRow
      , selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
      , selectedSeq: row["seq"]
    });
  };

  render() {
    return (
        <div>
          <Modal  backdrop={"static"} show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.props.hasCallback &&
              <div className="control-label">{this.props.labels.selectVersion}</div>
              }
              <div>{this.props.labels.resultLabel}: <span className="App App-message"><FontAwesome
                  name={this.state.messageIcon}/>{this.state.message}</span>
              </div>
              <CompareDocs
                  session={this.props.session}
                  handleRowSelect={this.handleRowSelect}
                  title={this.props.title}
                  docType={this.props.docType}
                  selectedIdParts={this.props.selectedIdParts}
                  labels={this.props.labels}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.props.labels.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalCompareDocs.propTypes = {
  session: PropTypes.object.isRequired
  , onClose: PropTypes.func
  , showModal: PropTypes.bool.isRequired
  , hasCallback: PropTypes.func
  , title: PropTypes.string.isRequired
  , docType: PropTypes.string.isRequired
  , selectedIdParts: PropTypes.array.isRequired
  , labels: PropTypes.object.isRequired
  , instructions: PropTypes.string
};

ModalCompareDocs.defaultProps = {
};

export default ModalCompareDocs;

