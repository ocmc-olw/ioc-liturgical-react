import React from 'react';
import PropTypes from 'prop-types';

import {Alert, Button, Col, ControlLabel, Glyphicon, Grid, Row, Well} from 'react-bootstrap';
import fileDownload from 'react-file-download';

import Labels from './Labels';

import Spinner from './helpers/Spinner';
import server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import ModalAgesServiceSelector from './modules/ModalAgesServiceSelector';
import ReactSelector from './modules/ReactSelector'

/**
 *
 */
class AgesViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.fetchAgesIndex = this.fetchAgesIndex.bind(this);
    this.handleFetchAgesIndexCallback = this.handleFetchAgesIndexCallback.bind(this);
    this.disableFetchButton = this.disableFetchButton.bind(this);
    this.setTable = this.setTable.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
    this.getServiceSelectorPanel = this.getServiceSelectorPanel.bind(this);
    this.showServiceSelector = this.showServiceSelector.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleFirstLibrarySelection = this.handleFirstLibrarySelection.bind(this);
    this.handleFirstLibraryFallbackSelection = this.handleFirstLibraryFallbackSelection.bind(this);
    this.handleSecondLibrarySelection = this.handleSecondLibrarySelection.bind(this);
    this.handleSecondLibraryFallbackSelection = this.handleSecondLibraryFallbackSelection.bind(this);
    this.handleThirdLibrarySelection = this.handleThirdLibrarySelection.bind(this);
    this.handleThirdLibraryFallbackSelection = this.handleThirdLibraryFallbackSelection.bind(this);
    this.getAgesTableRow = this.getAgesTableRow.bind(this);
    this.getAgesTableInfo = this.getAgesTableInfo.bind(this);
    this.getFetchingAgesTableRow = this.getFetchingAgesTableRow.bind(this);
    this.fetchPdf = this.fetchPdf.bind(this);
    this.downloadPdf = this.downloadPdf.bind(this);
  }

  componentWillMount = () => {
    this.fetchAgesIndex();
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let url = undefined;
    if (currentState && currentState.url) {
      url = currentState.url;
    }
    let serviceType = undefined;
    if (currentState && currentState.serviceType) {
      serviceType = currentState.serviceType;
    }
    let serviceDate = undefined;
    if (currentState && currentState.serviceDate) {
      serviceDate = currentState.serviceDate;
    }
    let serviceDow = undefined;
    if (currentState && currentState.serviceDow) {
      serviceDow = currentState.serviceDow;
    }
    let selectedService = undefined;
    if (currentState && currentState.selectedService) {
      selectedService = currentState.selectedService;
    }
    let agesIndexValues = [];
    let agesIndexFetched = false;
    if (currentState && currentState.agesIndexFetched) {
      agesIndexValues = currentState.agesIndexValues;
      agesIndexFetched = true;
    }
    let selectedFirstLibrary = "gr_gr_cog";
    if (currentState && currentState.selectedFirstLibrary) {
      selectedFirstLibrary = currentState.selectedFirstLibrary;
    }
    let selectedFirstLibraryFallback = "gr_gr_ages";
    if (currentState && currentState.selectedFirstLibraryFallback) {
      selectedFirstLibraryFallback = currentState.selectedFirstLibraryFallback;
    }
    let selectedSecondLibrary = "en_us_dedes";
    if (currentState && currentState.selectedSecondLibrary) {
      selectedSecondLibrary = currentState.selectedSecondLibrary;
    }
    let selectedSecondLibraryFallback = "en_us_ages";
    if (currentState && currentState.selectedSecondLibraryFallback) {
      selectedSecondLibraryFallback = currentState.selectedSecondLibraryFallback;
    }
    let selectedThirdLibrary = "";
    if (currentState && currentState.selectedThirdLibrary) {
      selectedThirdLibrary = currentState.selectedThirdLibrary;
    }
    let selectedThirdLibraryFallback = "";
    if (currentState && currentState.selectedThirdLibraryFallback) {
      selectedThirdLibraryFallback = currentState.selectedThirdLibraryFallback;
    }

    return (
        {
          labels: {
            thisClass: Labels.getAgesViewerLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
            , liturgicalAcronyms: Labels.getLiturgicalAcronymsLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , selectedFirstLibrary: selectedFirstLibrary
          , selectedFirstLibraryFallback: selectedFirstLibraryFallback
          , selectedSecondLibrary: selectedSecondLibrary
          , selectedSecondLibraryFallback: selectedSecondLibraryFallback
          , selectedThirdLibrary: selectedThirdLibrary
          , selectedThirdLibraryFallback: selectedThirdLibraryFallback
          , showModalEditor: false
          , selectedId: ""
          , selectedTopicKey: ""
          , renderedTable: undefined
          , showModalServiceSelector: false
          , url: url
          , serviceDate: serviceDate
          , serviceDow: serviceDow
          , serviceType: serviceType
          , selectedService: selectedService
          , agesIndexFetched: agesIndexFetched
          , agesIndexValues: agesIndexValues
          , fetchingData: false
          , fallbackArray: [
            {value: "en_us_ages", label: "AGES English translations"}
            , {value: "gr_gr_ages", label: "AGES Greek"}
          ]
        }
    )
  }

  disableFetchButton = () => {
    return (
        ! (this.state.url)
    );
  }

  // if we did not receive table values as a prop, fetch them
  fetchAgesIndex = () => {
    if (this.props.agesIndexValues) {
      this.setState({
        agesIndexFetched: true
        , agesIndexValues: this.props.agesIndexValues
      });
    } else {
      this.setState({
            message: this.state.labels.messages.retrieving
          },
          server.getAgesIndex(
              this.props.restServer
              , this.props.username
              , this.props.password
              , this.handleFetchAgesIndexCallback
          )
      );
    }
  }

  handleFetchAgesIndexCallback = (restCallResult) => {
    if (restCallResult) {
      let values = restCallResult.data.values[0];
      this.setState({
        agesIndexFetched: true
        , agesIndexValues: values.tableData
      });
    }
  }

  downloadPdf = () => {
//    fileDownload(this.state.data, 'priestsservicebook.pdf');
  }

  fetchPdf = () => {

    this.setState({fetchingPdf: true});

    let parms =
        "u=" + encodeURIComponent(this.state.url)
        + "&l=" + encodeURIComponent(this.state.selectedFirstLibrary)
        + "&c=" + encodeURIComponent(this.state.selectedSecondLibrary)
        + "&r=" + encodeURIComponent(this.state.selectedThirdLibrary)
        + "&lf=" + encodeURIComponent(this.state.selectedFirstLibraryFallback)
        + "&cf=" + encodeURIComponent(this.state.selectedSecondLibraryFallback)
        + "&rf=" + encodeURIComponent(this.state.selectedThirdLibraryFallback)
    ;

    server.restGetPromise(
        this.props.restServer
        , server.getDbServerAgesPdfApi()
        , this.props.username
        , this.props.password
        , parms
    )
        .then( response => {
          console.log('pdf call back received')
          console.log(response);
          this.setState(
              {
                data: response
                , fetchingPdf: false
              }, this.downloadPdf
          );
        })
        .catch( error => {
          this.setState(
              {
                data: {
                  values:
                      [
                        {
                          "id": ""
                          , "library": ""
                          , "topic": ""
                          , "key": ""
                          , "value:": ""
                        }
                      ]
                  , userMessage: error.userMessage
                  , developerMessage: error.developerMessage
                  , messageIcon: error.messageIcon
                  , status: error.status
                  , showSearchResults: false
                  , resultCount: 0
                  , fetching: false
                }
              })
        })
    ;
  }

  fetchData = () => {
    let parms =
        "u=" + encodeURIComponent(this.state.url)
        + "&l=" + encodeURIComponent(this.state.selectedFirstLibrary)
        + "&c=" + encodeURIComponent(this.state.selectedSecondLibrary)
        + "&r=" + encodeURIComponent(this.state.selectedThirdLibrary)
        + "&lf=" + encodeURIComponent(this.state.selectedFirstLibraryFallback)
        + "&cf=" + encodeURIComponent(this.state.selectedSecondLibraryFallback)
        + "&rf=" + encodeURIComponent(this.state.selectedThirdLibraryFallback)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
          , fetchingData: true
          , dataFetched: false
        },
        server.getAgesReadOnlyTemplate(
            this.props.restServer
            , this.props.username
            , this.props.password
            , parms
            , this.handleFetchCallback
        )
    );

  }

  handleFetchCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      console.log(data);
      let values = data.values;
      let topicKeys = data.topicKeys;
      let topElement = data.topElement;
      console.log(topElement);
      this.setState({
        dataFetched: true
        , fetchingData: false
        , values: values
        , topicKeys: topicKeys
        , topElement: topElement
      }, this.setTable);
    }
  }

  handleFirstLibrarySelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedFirstLibrary: ""
        , selectedFirstLibraryFallback: ""
        , selectedSecondLibrary: ""
        , selectedSecondLibraryFallback: ""
        , selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    } else {
      let selectedFirstLibraryFallback = "en_us_ages";
      if (this.state.selectedFirstLibraryFallback.length > 0) {
        selectedFirstLibraryFallback = this.state.selectedFirstLibraryFallback;
      } else {
        if (selection["value"].startsWith("gr")) {
          selectedFirstLibraryFallback = "gr_gr_ages";
        } else if (selection["value"].startsWith("en")) {
          selectedFirstLibraryFallback = "en_us_ages";
        }
      }
      this.setState({
        selectedFirstLibrary: selection["value"]
        , selectedFirstLibraryFallback: selectedFirstLibraryFallback
      });
    }
  }

  handleFirstLibraryFallbackSelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedFirstLibrary: ""
        , selectedFirstLibraryFallback: ""
        , selectedSecondLibrary: ""
        , selectedSecondLibraryFallback: ""
        , selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    } else {
      this.setState({
        selectedFirstLibraryFallback: selection["value"]
      });
    }
  }

  handleSecondLibrarySelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedSecondLibrary: ""
        , selectedSecondLibraryFallback: ""
        , selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    } else {
      let selectedSecondLibraryFallback = "en_us_ages";
        if (selection["value"].startsWith("gr")) {
          selectedSecondLibraryFallback = "gr_gr_ages";
        } else if (selection["value"].startsWith("en")) {
          selectedSecondLibraryFallback = "en_us_ages";
        } else if (this.state.selectedSecondLibraryFallback.length > 0) {
          selectedSecondLibraryFallback = this.state.selectedSecondLibraryFallback;
        }
      this.setState({
        selectedSecondLibrary: selection["value"]
        , selectedSecondLibraryFallback: selectedSecondLibraryFallback
        , selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    }
  }

  handleSecondLibraryFallbackSelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedSecondLibrary: ""
        , selectedSecondLibraryFallback: ""
      });
    } else {
      this.setState({
        selectedSecondLibraryFallback: selection["value"]
      });
    }
  }

  handleThirdLibrarySelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    } else {
      let selectedThirdLibraryFallback = "en_us_ages";
      if (this.state.selectedThirdLibraryFallback.length > 0) {
        selectedThirdLibraryFallback = this.state.selectedThirdLibraryFallback;
      } else {
        if (selection["value"].startsWith("gr")) {
          selectedThirdLibraryFallback = "gr_gr_ages";
        } else if (selection["value"].startsWith("en")) {
          selectedThirdLibraryFallback = "en_us_ages";
        }
      }
      this.setState({
        selectedThirdLibrary: selection["value"]
        , selectedThirdLibraryFallback: selectedThirdLibraryFallback
      });
    }
  }

  handleThirdLibraryFallbackSelection = (selection) => {
    if (selection == null) {
      this.setState({
        selectedThirdLibrary: ""
        , selectedThirdLibraryFallback: ""
      });
    } else {
      this.setState({
        selectedThirdLibraryFallback: selection["value"]
      });
    }
  }

  setTable = () => {
    this.setState({
      renderedTable: this.renderHtml(this.state.topElement)
    });
  }

  renderHtml = (element) => {
    let props = {};
    let children = [];

    if (element.key) {
      props["key"] = element.key;
    }
    if (element.className) {
      props["className"] = element.className;
    } else {
      if (element.tag === "table"
          || element.tag === "tbody"
          || element.tag === "tr"
      ) {
        props["className"] = "ages";
      }
    }
    if (element.dataKey) {
      props["data-key"] = element.dataKey;
      children.push(this.state.values[element.dataKey]);
    }
    if (element.topicKey) {
      props["data-topicKey"] = element.topicKey;
    }

    if (element.children) {
      for (let i=0; i < element.children.length; i++) {
        children.push(this.renderHtml(element.children[i]));
      }
    }
    return (
        React.createElement(
            element.tag
            , props
            , children
        )
    );
  }

  showServiceSelector = () => {
    this.setState({
      showModalServiceSelector: true
    });
  }

  handleServiceSelection = (url, serviceType, serviceDate, serviceDow) => {
    let selectedService = serviceType;
    if (this.state.labels.liturgicalAcronyms[serviceType]) {
      selectedService = this.state.labels.liturgicalAcronyms[serviceType];
    }
    if (serviceDate != "any") {
      selectedService = selectedService + " " + serviceDate;
    }
    if (serviceDow != "any") {
      selectedService = selectedService + " " + serviceDow;
    }
    this.setState({
      showModalServiceSelector: false
      , url: url
      , serviceDate: serviceDate
      , serviceDow: serviceDow
      , serviceType: serviceType
      , selectedService: selectedService
    });
  }

  getServiceSelectorPanel = () => {
    if (this.state.showModalServiceSelector) {
      return (
        <ModalAgesServiceSelector
            restServer={this.props.restServer}
            username={this.props.username}
            password={this.props.password}
            languageCode={this.props.languageCode}
            callBack={this.handleServiceSelection}
            values={this.state.agesIndexValues}
        />
      )
    } else {
      if (this.state.agesIndexFetched) {
        return (
            <Button
                bsStyle="primary"
                onClick={this.showServiceSelector}
            >
              {this.state.labels.thisClass.select}
            </Button>
        );
      } else {
        return (
            <Spinner message={this.state.labels.messages.retrieving}/>
        );
      }
    }
  }

  getAgesTableInfo = () => {
    if (this.state.dataFetched) {
      if (this.state.selectedFirstLibrary) {
        return (
            <div>
              <Alert bsStyle="info">
                <p>
                  <Glyphicon glyph="hand-right"/>
                  {this.state.labels.thisClass.msg2}
                  {this.state.url}
                </p>
              </Alert>
            </div>
        );
      } else {
        return (
            <div>
              <Alert bsStyle="info">
                <p>
                  <Glyphicon glyph="hand-right"/>
                  {this.state.labels.thisClass.msg2}
                  {this.state.url}
                </p>
              </Alert>
              <Alert bsStyle="info">
                <p>
                  <Glyphicon glyph="hand-right"/>
                  {this.state.labels.thisClass.agesGreek}
                  {this.state.labels.thisClass.agesEnglish}
                  {this.state.labels.thisClass.msg1}
                </p>
              </Alert>
            </div>
        );

      }
    } else {
      return (<div></div>);
    }
  }

  getFetchingAgesTableRow = () => {
    return (
        <Spinner message={this.state.labels.messages.retrieving}/>
    );
  }

  getAgesTableRow = () => {
      return (
          <div>
            <Row className="App-Info-Row">
              <Col xs={12} md={12}>
                {this.getAgesTableInfo()}
              </Col>
            </Row>
            <Row className="App-Ages-Table-Row">
              <Col xs={12} md={12}>
                {this.state.dataFetched &&
                <div>
                  {this.state.renderedTable}
                </div>
                }
              </Col>
            </Row>
          </div>
      )
  }

  render() {
    return (
        <div className="App App-ParaColTextEditor">
          <Well>
          <Grid className="App-Grid">
            <Row className="App-Selection-Row">
              <Col xs={12} md={12}>
                <h3>
                  {this.state.labels.thisClass.panelTitle}
                </h3>
                <ControlLabel>
                  {this.state.labels.thisClass.msg1}
                </ControlLabel>
              </Col>
            </Row>
            <Row className="App-Selection-Row">
              <Col xs={4} md={4}>
                {this.getServiceSelectorPanel()}
              </Col>
              <Col xs={8} md={8}>
                { this.state.agesIndexFetched &&
                this.state.selectedService
                }
              </Col>
            </Row>
            <Row className="App-Selection-Row">
              <Col xs={4} md={4}>
                <ControlLabel>
                  {this.state.labels.thisClass.selectFirstLibrary}
                  </ControlLabel>
              </Col>
              <Col xs={8} md={8}>
                <ReactSelector
                    initialValue={this.state.selectedFirstLibrary}
                    resources={this.props.domains.author}
                    changeHandler={this.handleFirstLibrarySelection}
                    multiSelect={false}
                />
              </Col>
            </Row>
            <Row className="App-Selection-Row">
              <Col xs={4} md={4}>
                <ControlLabel>
                  {this.state.labels.thisClass.selectFirstLibraryFallback}
                </ControlLabel>
              </Col>
              <Col xs={8} md={8}>
                <ReactSelector
                    initialValue={this.state.selectedFirstLibraryFallback}
                    resources={this.state.fallbackArray}
                    changeHandler={this.handleFirstLibraryFallbackSelection}
                    multiSelect={false}
                />
              </Col>
            </Row>
            {this.state.selectedFirstLibrary &&
                <div>
                  <Row className="App-Selection-Row">
                    <Col xs={4} md={4}>
                      <ControlLabel>
                        {this.state.labels.thisClass.selectSecondLibrary}
                      </ControlLabel>
                    </Col>
                    <Col xs={8} md={8}>
                      <ReactSelector
                          initialValue={this.state.selectedSecondLibrary}
                          resources={this.props.domains.author}
                          changeHandler={this.handleSecondLibrarySelection}
                          multiSelect={false}
                      />
                    </Col>
                  </Row>
                  <Row className="App-Selection-Row">
                    <Col xs={4} md={4}>
                      <ControlLabel>
                        {this.state.labels.thisClass.selectSecondLibraryFallback}
                      </ControlLabel>
                    </Col>
                    <Col xs={8} md={8}>
                      <ReactSelector
                          initialValue={this.state.selectedSecondLibraryFallback}
                          resources={this.state.fallbackArray}
                          changeHandler={this.handleSecondLibraryFallbackSelection}
                          multiSelect={false}
                      />
                    </Col>
                  </Row>
                </div>
            }
            {this.state.selectedSecondLibrary &&
                <div>
                  <Row className="App-Selection-Row">
                    <Col xs={4} md={4}>
                      <ControlLabel>
                        {this.state.labels.thisClass.selectThirdLibrary}
                      </ControlLabel>
                    </Col>
                    <Col xs={8} md={8}>
                      <ReactSelector
                          initialValue={this.state.selectedThirdLibrary}
                          resources={this.props.domains.author}
                          changeHandler={this.handleThirdLibrarySelection}
                          multiSelect={false}
                      />
                    </Col>
                  </Row>
                  <Row className="App-Selection-Row">
                    <Col xs={4} md={4}>
                      <ControlLabel>
                        {this.state.labels.thisClass.selectThirdLibraryFallback}
                      </ControlLabel>
                    </Col>
                    <Col xs={8} md={8}>
                      <ReactSelector
                          initialValue={this.state.selectedThirdLibraryFallback}
                          resources={this.state.fallbackArray}
                          changeHandler={this.handleThirdLibraryFallbackSelection}
                          multiSelect={false}
                      />
                    </Col>
                  </Row>
                </div>
            }
            <Row className="App-Selection-Row">
              <Col xs={4} md={4}>
                <Button
                    bsStyle="primary"
                    onClick={this.fetchData}
                    disabled={this.disableFetchButton()}
                >
                  {this.state.labels.thisClass.fetch}
                </Button>
              </Col>
              <Col xs={8} md={8}>
                {this.state.dataFetched && <Button bsStyle="primary" onClick={this.fetchPdf}>Download as PDF</Button>}
              </Col>
            </Row>
            {this.state.dataFetched && this.getAgesTableRow()}
            {this.state.fetchingData && this.getFetchingAgesTableRow()}
          </Grid>
          </Well>
        </div>
    )
  }
}

AgesViewer.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , domains: PropTypes.object.isRequired
  , agesIndexValues: PropTypes.array
};

AgesViewer.defaultProps = {
};

export default AgesViewer;

