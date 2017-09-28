import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button, Col, ControlLabel, Glyphicon, Grid, Row, Well} from 'react-bootstrap';

import Labels from './Labels';
import ModalParaRowEditor from './ModalParaRowEditor';

import Spinner from './helpers/Spinner';
import server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import IdManager from './helpers/IdManager';
import ModalAgesServiceSelector from './modules/ModalAgesServiceSelector';
import ReactSelector from './modules/ReactSelector'

/**
 *
 */
class AgesEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.fetchAgesIndex = this.fetchAgesIndex.bind(this);
    this.handleFetchAgesIndexCallback = this.handleFetchAgesIndexCallback.bind(this);

    this.edit = this.edit.bind(this);
    this.setTable = this.setTable.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
    this.handleParaTextEditorClose = this.handleParaTextEditorClose.bind(this);
    this.handleParaTextEditorSubmit = this.handleParaTextEditorSubmit.bind(this);
    this.getModalEditor = this.getModalEditor.bind(this);
    this.updateTemplateValues = this.updateTemplateValues.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.editable = this.editable.bind(this);
    this.getServiceSelectorPanel = this.getServiceSelectorPanel.bind(this);
    this.showServiceSelector = this.showServiceSelector.bind(this);
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.handleLibrarySelection = this.handleLibrarySelection.bind(this);
    this.getAgesTableRow = this.getAgesTableRow.bind(this);
    this.getAgesTableInfo = this.getAgesTableInfo.bind(this);
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
    let selectedLibrary = "";
    if (currentState && currentState.selectedLibrary) {
      selectedLibrary = currentState.selectedLibrary;
    }

    return (
        {
          labels: {
            thisClass: Labels.getAgesEditorLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
            , liturgicalAcronyms: Labels.getLiturgicalAcronymsLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , selectedLibrary: selectedLibrary
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
          , selectedLibrary: ""
          , agesIndexFetched: agesIndexFetched
          , agesIndexValues: agesIndexValues
          , fetchingData: false
        }
    )
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

  fetchData = () => {
    let parms =
        "u=" + encodeURIComponent(this.state.url)
        + "&t=" + encodeURIComponent(this.state.selectedLibrary)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
          , fetchingData: true
        },
        server.getAgesEditorTemplate(
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
      this.setState({
        dataFetched: true
        , fetchingData: false
        , values: values
        , topicKeys: topicKeys
        , topElement: topElement
      }, this.setTable);
    }
  }

  handleParaTextEditorClose = () => {
    this.setState({
      showModalEditor: false
    });
  }

  handleLibrarySelection = (selection) => {
    this.setState({
      selectedLibrary: selection["value"]
    });
  }

  handleParaTextEditorSubmit = (value) => {
    // only update if the value changed
    if (value !== this.state.values[this.state.selectedId]) {
      // update the value held client-side in memory
      let values = this.state.values;
      values[this.state.selectedId] = value;
      this.setState({
            changedText: value
            , values: values
            , showModalEditor: false
          }
          , this.setTable
      );
      // now update the database via a rest call
      let parms =
          "i=" + encodeURIComponent(this.state.selectedId)
          + "&t=" + encodeURIComponent("Liturgical")
      ;

      server.putValue(
          this.props.restServer
          , this.props.username
          , this.props.password
          , {value: value, seq: undefined}
          , parms
          , this.handleValueUpdateCallback
      )
    } else {
      this.setState(
          {
            showModalEditor: false
          }
      );
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

  /**
   * Does the user have permission to edit records in this library?
   * @param library
   * @returns {boolean}
   */
  editable = (id) => {
    let library = IdManager.getLibrary(id);
    let canEdit = false;
    for (let entry of this.props.domains.author) {
      if (entry.value == library) {
        canEdit = true;
        break;
      }
    }
    return canEdit;
  }

  getModalEditor = () => {
    return (
        <ModalParaRowEditor
            restServer={this.props.restServer}
            username={this.props.username}
            password={this.props.password}
            languageCode={this.props.languageCode}
            domains={this.props.domains}
            editId={this.state.selectedId}
            value={this.state.selectedValue}
            showModal={this.state.showModalEditor}
            onClose={this.handleParaTextEditorClose}
            onSubmit={this.handleParaTextEditorSubmit}
            canChange={this.editable(this.state.selectedId)}
        />
    )
  }

  edit = (id) => {
    this.setState({
      showModalEditor: true
      , selectedId: id
      , selectedValue: this.state.values[id]
    });
  }

  setTable = () => {
    this.setState({
      renderedTable: this.renderHtml(this.state.topElement)
    });
  }

  updateTemplateValues = () => {
    if (this.state.changedText) {
      let values = this.state.values;
      console.log(values[this.state.selectedId]);
      console.log(this.state.changedText);
      values[this.state.selectedId] = this.state.changedText;
      console.log(values[this.state.selectedId]);
      this.setState({
            values: values
          }
          , this.setTable
      );
    }
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
      props["onDoubleClick"] = this.edit.bind(null,element.dataKey);
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
      if (this.state.selectedLibrary) {
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
                  {this.state.labels.thisClass.yourTranslationA}
                  {this.state.selectedLibrary}
                  {this.state.labels.thisClass.yourTranslationB}
                  {this.state.labels.thisClass.agesEnglish}
                  {this.state.labels.thisClass.msg1}
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
  getAgesTableRow = () => {
    if (this.state.dataFetched) {
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
                  {this.state.showModalEditor && this.getModalEditor()}
                </div>
                }
              </Col>
          </Row>
        </div>
      )
    } else {
      if (this.state.fetchingData) {
        return (
            <Spinner message={this.state.labels.messages.retrieving}/>
        );
      } else {
        return (
            <div></div>
        )
      }
    }
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
                  {this.state.labels.thisClass.selectLibrary}
                  </ControlLabel>
              </Col>
              <Col xs={8} md={8}>
                <ReactSelector
                    initialValue={this.state.selectedLibrary}
                    resources={this.props.domains.author}
                    changeHandler={this.handleLibrarySelection}
                    multiSelect={false}
                />
              </Col>
            </Row>
            <Row className="App-Selection-Row">
              <Col xs={4} md={4}>
                <Button
                    bsStyle="primary"
                    onClick={this.fetchData}
                    disabled={! (this.state.url)}
                >
                  {this.state.labels.thisClass.fetch}
                </Button>
              </Col>
              <Col xs={8} md={8}>
              </Col>
            </Row>
            {this.getAgesTableRow()}
          </Grid>
          </Well>
        </div>
    )
  }
}

AgesEditor.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , domains: PropTypes.object.isRequired
  , agesIndexValues: PropTypes.array
};


export default AgesEditor;

