import React from 'react';
import PropTypes from 'prop-types';

import {Alert, Button, Col, ControlLabel, Glyphicon, Grid, Row, Table, Well} from 'react-bootstrap';

import Spinner from './helpers/Spinner';
import server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import ModalAgesServiceSelector from './modules/ModalAgesServiceSelector';
import ReactSelector from './modules/ReactSelector'
import User from "./classes/User";

/**
 * This class renders a liturgical service or book using a json
 * metadata file created from the HTML in a user selected service
 * or book from the AGES Initiatives website.
 * This class provides a UI for the user to
 * 1. Select a service or book from the AGES website.  It reads the json index and the index for sacraments.
 * 2. Indicate one, two, or three languages (versions) and fallbacks.
 * 3. Calls the web service to get the json metadata file.
 * 4. Uses the json metadata file to render an HTML table.
 */
class AgesViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);

    this.disableFetchButton = this.disableFetchButton.bind(this);
    this.fetchAgesIndex = this.fetchAgesIndex.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getAgesTableInfo = this.getAgesTableInfo.bind(this);
    this.getAgesTableRow = this.getAgesTableRow.bind(this);
    this.getFetchingAgesTableRow = this.getFetchingAgesTableRow.bind(this);
    this.getPdfButton = this.getPdfButton.bind(this);
    this.checkPdfStatus = this.checkPdfStatus.bind(this);
    this.getSelectedService = this.getSelectedService.bind(this);
    this.getServiceSelectorPanel = this.getServiceSelectorPanel.bind(this);
    this.handleFetchAgesIndexCallback = this.handleFetchAgesIndexCallback.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.handleFirstLibraryFallbackSelection = this.handleFirstLibraryFallbackSelection.bind(this);
    this.handleFirstLibrarySelection = this.handleFirstLibrarySelection.bind(this);
    this.handlePdfStatusCallback = this.handlePdfStatusCallback.bind(this);
    this.handleSecondLibraryFallbackSelection = this.handleSecondLibraryFallbackSelection.bind(this);
    this.handleSecondLibrarySelection = this.handleSecondLibrarySelection.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleServiceSelectionClose = this.handleServiceSelectionClose.bind(this);
    this.handleThirdLibraryFallbackSelection = this.handleThirdLibraryFallbackSelection.bind(this);
    this.handleThirdLibrarySelection = this.handleThirdLibrarySelection.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
    this.setTable = this.setTable.bind(this);
    this.showServiceSelector = this.showServiceSelector.bind(this);
  }

  componentWillMount = () => {
    this.fetchAgesIndex();
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  };

  setTheState = (props, currentState) => {
    let url = undefined;
    if (currentState && currentState.url) {
      url = currentState.url;
    }
    let pdfId = undefined;
    if (currentState && currentState.pdfId) {
      pdfId = currentState.pdfId;
    }
    let pdfFilename = undefined;
    if (currentState && currentState.pdfFilename) {
      pdfFilename = currentState.pdfFilename;
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
            thisClass: props.session.labels[props.session.labelTopics.AgesViewer]
            , buttons: props.session.labels[props.session.labelTopics.button]
            , messages: props.session.labels[props.session.labelTopics.messages]
            , liturgicalAcronyms: props.session.labels[props.session.labelTopics.liturgicalAcronyms]
          }
          , session: {
            userInfo: userInfo
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: props.session.labels[props.session.labelTopics.messages].initial
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
          , pdfId: pdfId
          , pdfFilename: pdfFilename
          , generationStatusMessage: ""
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
            , {value: "none", label: "No Fallback"}
          ]
        }
    )
  };

  disableFetchButton = () => {
    return (
        ! (this.state.url)
    );
  };

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
              this.props.session.restServer
              , this.state.session.userInfo.username
              , this.state.session.userInfo.password
              , this.handleFetchAgesIndexCallback
          )
      );
    }
  };

  handleFetchAgesIndexCallback = (restCallResult) => {
    if (restCallResult) {
      let values = restCallResult.data.values[0];
      this.setState({
        agesIndexFetched: true
        , agesIndexValues: values.tableData
      });
    }
  };

  checkPdfStatus = () => {
    this.setState({
          fetchingPdf: true
          , showPdfButton: false
        },
        server.restGetGenerationStatus(
            this.props.session.restServer
            , this.state.session.userInfo.username
            , this.state.session.userInfo.password
            , this.state.pdfId
            , this.handlePdfStatusCallback
        )
    );
  };

  handlePdfStatusCallback = (result) => {
    let statusMessage = this.state.labels.messages.couldNotGenerate;
    let showPdfButton = false;
    if (result.code === 200) {
      let statusMessage = "";
      showPdfButton = true;
    }
    this.setState({
      fetchingPdf: false
      , showPdfButton: showPdfButton
      , generationStatusMessage: statusMessage
    });
  };


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
          , showPdfButton: false
        },
        server.getAgesReadOnlyTemplate(
            this.props.session.restServer
            , this.state.session.userInfo.username
            , this.state.session.userInfo.password
            , parms
            , this.handleFetchCallback
        )
    );

  };

  handleTimeout = () => {
    this.setState({showPdfButton: true});
  };

  handleFetchCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      let data = restCallResult.data.values[0];
      let values = data.values;
      let topicKeys = data.topicKeys;
      let topElement = data.topElement.children[0].children[0]; // tbody
      let pdfId = data.pdfId;
      let pdfFilename = data.pdfFilename;
      this.setState({
        dataFetched: true
        , fetchingData: false
        , values: values
        , topicKeys: topicKeys
        , topElement: topElement
        , pdfId: pdfId
        , pdfFilename: pdfFilename
      }, this.setTable);
    }
  };

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
  };

  handleServiceSelectionClose = () => {
    this.setState({
      showModalServiceSelector: false
    });
  };


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
  };

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
  };

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
  };

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
  };

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
  };

  setTable = () => {
    this.setState({
      renderedTable: this.renderHtml(this.state.topElement)
    }, this.checkPdfStatus);
  };

  renderHtml = (element) => {
    let props = {};
    let children = [];
    let value = "";

    if (element.key) {
      props["key"] = element.key;
    }
    if (element.className) {
      props["className"] = element.className + " ages-table-element";
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
      value = this.state.values[element.dataKey];
      children.push(value);
    }
    if (element.topicKey) {
      props["data-topicKey"] = element.topicKey;
    }

    if (element.children) {
      for (let i=0; i < element.children.length; i++) {
        children.push(this.renderHtml(element.children[i]));
      }
    }
    if (element.dataKey && value && value.trim().length === 0) {
      return (<span className="app-no-show"></span>);
    } else {
      return (
          React.createElement(
              element.tag
              , props
              , children
          )
      );
    }
  };

  showServiceSelector = () => {
    this.setState({
      showModalServiceSelector: true
    });
  };

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
  };

  getServiceSelectorPanel = () => {
    if (this.state.showModalServiceSelector) {
      return (
        <ModalAgesServiceSelector
            session={this.props.session}
            callBack={this.handleServiceSelection}
            onClose={this.handleServiceSelectionClose}
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
  };

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
  };

  getFetchingAgesTableRow = () => {
    return (
        <Spinner message={this.state.labels.messages.retrieving}/>
    );
  };

  getAgesTableRow = () => {
      return (
          <div>
            <Row className="App-Info-Row">
              <Col xs={12} md={12}>
                {this.getAgesTableInfo()}
              </Col>
            </Row>
            {this.getPdfButton()}
            <Row className="App App-Ages-Table-Row">
              <Col xs={12} md={12}>
                {this.state.dataFetched &&
                <div className="ages-content">
                  <Table responsive>
                    {this.state.renderedTable}
                  </Table>
                </div>
                }
              </Col>
            </Row>
          </div>
      )
  };


  getPdfButton = () => {
    if (this.state.dataFetched && this.state.showPdfButton) {
      let url = "data/" + this.state.pdfId;
      return (
          <Row className="App-Download-Row">
            <Col className="App-Download-Col" xs={6} md={6}>
              <a href={url + ".pdf"} target={"_blank"}>{this.state.labels.buttons.downloadAsPdf}</a>
            </Col>
            <Col className="App-Download-Col" xs={6} md={6}>
              <a href={url + ".tex"} target={"_blank"}>{this.state.labels.buttons.downloadAsTex}</a>
            </Col>
          </Row>
      );
    } else {
      if (this.state.dataFetched) {
        return (
            <Spinner message={this.state.labels.messages.preparingPdf}/>
        );
      } else {
        return (<span>{this.state.generationStatusMessage}</span>);
      }
    }
  };

  getSelectedService = () => {
    if (this.state.selectedService) {
      return (
          <div>
            <ControlLabel>{this.state.labels.thisClass.selected}</ControlLabel>
            <span>{this.state.selectedService}</span>
          </div>
      );
    }
  };


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
              <Col xs={12} md={12}>
                {this.getServiceSelectorPanel()}
              </Col>
            </Row>
            <Row className="App-Selection-Row">
              <Col xs={12}>
                {this.getSelectedService()}
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
                    resources={this.state.session.userInfo.domains.reader}
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
                          resources={this.state.session.userInfo.domains.reader}
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
                          resources={this.state.session.userInfo.domains.reader}
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
              <Col xs={12} md={12}>
                <Button
                    bsStyle="primary"
                    onClick={this.fetchData}
                    disabled={this.disableFetchButton()}
                >
                  {this.state.labels.thisClass.fetch}
                </Button>
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
  session: PropTypes.object.isRequired
  , agesIndexValues: PropTypes.array
};

AgesViewer.defaultProps = {
};

export default AgesViewer;

