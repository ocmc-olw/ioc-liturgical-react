import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {Col, ControlLabel, Grid, Row } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from './MessageIcons';

class OntologyRefSelector extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getOntologyRefSelectorLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , selectedType: "*"
      , selectedEntity: "*"
    }

    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleEntityChange = this.handleEntityChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleCallback = () => {
    this.props.callback(
        this.state.selectedType
        , this.state.selectedEntity
    );
  };

  handleTypeChange = (selection) => {
    let book = selection["value"];
    this.setState({
      selectedType: book
    }, this.handleCallback);
  };

  handleEntityChange = (selection) => {
    this.setState({
      selectedEntity: selection["value"]
    }, this.handleCallback);
  };

  render() {
    return (
        <Row>
          <Col className="App-Ontology-Ref-Selector-Label" xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.type}:</ControlLabel>
          </Col>
          <Col className="App-Ontology-Ref-Selector-Type" xs={6} md={6}>
            <Select
                name="App-Ontology-Ref-Selector-Type"
                className="App-Ontology-Ref-Selector-Type"
                value={this.state.selectedType}
                options={this.props.session.dropdowns.ontologyTypesDropdown}
                onChange={this.handleTypeChange}
                multi={false}
                autosize={true}
                clearable
            />
          </Col>
          <Col className="App-Ontology-Ref-Selector-Entity" xs={2} md={2}>
            <Col className="App-Ontology-Ref-Selector-Label" xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.type}:</ControlLabel>
            </Col>
          <Select
              name="App-Ontology-Ref-Selector-Entity"
              className="App-Ontology-Ref-Selector-Entity"
              value={this.state.selectedEntity}
              options={this.props.session.dropdowns.ontologyTypesDropdown}
              onChange={this.handleEntityChange}
              multi={false}
              autosize={true}
              clearable
          />
          </Col>
          <Col className="App-Ontology-Ref-Selector-Verse" xs={2} md={2}>
          </Col>
        </Row>
    )
  }
}

OntologyRefSelector.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
};

// set default values for props here
OntologyRefSelector.defaultProps = {
  languageCode: "en"
};

export default OntologyRefSelector;
