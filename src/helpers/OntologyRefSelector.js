import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {Col, ControlLabel, Grid, Row } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from './MessageIcons';
import Server from "./Server";

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
      , selectedEntityValue: props.initialValue
      , selectedEntityLabel: ""
      , fetching: false
      , data: []
      , lastType: props.type
    };

    this.handleEntityChange = this.handleEntityChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    this.setState({fetching: true}, this.fetchData);
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
          , selectedEntity: "*"
          , fetching: false
          , data: []
        }
      });
    }
    if (nextProps.type !== this.state.lastType) {
      this.setState(
          {lastType: nextProps.type}
          , this.fetchData
      );
    };
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleCallback = () => {
    this.props.callback(
      this.state.selectedEntityValue
        , this.state.selectedEntityLabel
    );
  };

  handleEntityChange = (selection) => {
    this.setState({
      selectedEntityValue: selection["value"]
      , selectedEntityLabel: selection["label"]
    }, this.handleCallback);
  };

  fetchData = () => {
    let parms =
        "t=" + encodeURIComponent(this.props.type)
    ;

    Server.restGetPromise(
        this.props.session.restServer
        , Server.getDbServerDropdownsOntologyEntitiesApi()
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , parms
    )
        .then( response => {
          this.setState(
              {
                data: response.data.values[0].dropdown
                , userMessage: response.userMessage
                , developerMessage: response.developerMessage
                , messageIcon: response.messageIcon
                , status: response.status
                , showSearchResults: response.data.values.length > 0
                , resultCount: response.data.values.length
                , fetching: false
              }
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


  render() {
    if (this.state.data && this.state.data.length > 0) {
      return (
          <div className="resourceSelector">
            <div className="resourceSelectorPrompt">{this.props.title}</div>
              <Select
                  name="App-Ontology-Ref-Selector-Entity"
                  value={this.state.selectedEntityValue}
                  options={this.state.data}
                  onChange={this.handleEntityChange}
                  multi={false}
                  autosize={true}
                  clearable
              />
          </div>
      )
    } else {
      return (<span className="App-no-display"></span>);
    }
  }
}

OntologyRefSelector.propTypes = {
  session: PropTypes.object.isRequired
  , type: PropTypes.string.isRequired
  , callback: PropTypes.func.isRequired
  , initialValue: PropTypes.string
};

// set default values for props here
OntologyRefSelector.defaultProps = {
  languageCode: "en"
  , initialValue: "*"
};

export default OntologyRefSelector;
