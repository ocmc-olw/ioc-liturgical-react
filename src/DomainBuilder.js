import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Button
  , Col
  , ControlLabel
  , FormControl
  , FormGroup
  , Radio
  , Row
  , Well
} from 'react-bootstrap';
import MessageIcons from './helpers/MessageIcons';
import ModalCountrySelector from './modules/ModalCountrySelector';
import ModalLanguageSelector from './modules/ModalLanguageSelector';
import axios from "axios/index";
import Server from "./helpers/Server";

class DomainBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, {});

    this.createRealmName = this.createRealmName.bind(this);
    this.enableModalCountrySelector = this.enableModalCountrySelector.bind(this);
    this.enableModalLanguageSelector = this.enableModalLanguageSelector.bind(this);
    this.getCountryRow = this.getCountryRow.bind(this);
    this.getFullDescriptionRow = this.getFullDescriptionRow.bind(this);
    this.getLanguageRow = this.getLanguageRow.bind(this);
    this.getModalCountrySelector = this.getModalCountrySelector.bind(this);
    this.getModalLanguageSelector = this.getModalLanguageSelector.bind(this);
    this.getRealmRow = this.getRealmRow.bind(this);
    this.getSubmitRow = this.getSubmitRow.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handleModalCountryClose = this.handleModalCountryClose.bind(this);
    this.handleModalCountrySelection = this.handleModalCountrySelection.bind(this);
    this.handleModalLanguageClose = this.handleModalLanguageClose.bind(this);
    this.handleModalLanguageSelection = this.handleModalLanguageSelection.bind(this);
    this.handleRealmChange = this.handleRealmChange.bind(this);
    this.handleRealmNameChange = this.handleRealmNameChange.bind(this);
    this.handleRealmTypeAcronymnChange = this.handleRealmTypeAcronymnChange.bind(this);
    this.handleRealmTypeLastWordChange = this.handleRealmTypeLastWordChange.bind(this);
    this.handleRealmTypeOtherChange = this.handleRealmTypeOtherChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.setDomain = this.setDomain.bind(this);
    this.createRealmDescription = this.createRealmDescription.bind(this);
    this.postDomain = this.postDomain.bind(this);
  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state));
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, currentState) => {

    let initialDesc = "Translations by ";

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    return ({
      labels: {
        thisClass: labels[labelTopics.DomainBuilder]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , selectedLanguageCode: get(currentState, "selectedLanguageCode", "")
      , selectedLanguageName: get(currentState, "selectedLanguageName", "")
      , selectedCountryCode: get(currentState, "selectedCountryCode", "")
      , selectedCountryValue: get(currentState, "selectedCountryValue", "")
      , newRealm: get(currentState, "newRealm", "")
      , newRealmName: get(currentState, "newRealmName", "")
      , newRealmType: get(currentState, "newRealmType", 'a')
      , newRealmDesc: get(currentState, "newRealmDesc", initialDesc)
      , newDomain: get(currentState, "newDomain", "")
      , showModalCountrySelector: get(currentState, "showModalCountrySelector", false)
      , initialDesc: initialDesc
    })
  };

  setDomain = () => {
    if (this.state.selectedLanguageCode
        && this.state.selectedCountryCode
        && this.state.newRealm
        && this.state.newRealmDesc
        && (this.state.newRealmDesc !== this.state.initialDesc)
    ) {
      this.setState({
        newDomain: this.state.selectedLanguageCode
          + "_"
          + this.state.selectedCountryCode.toLowerCase()
          + "_"
          + this.state.newRealm
      },this.createRealmDescription);
    } else {
      this.createRealmDescription();
    }
  };

  handleRealmChange(e) {
    let realm = e.target.value;
    let editMsg = "";
    if (realm.includes(" ") || realm.length > 19) {
      editMsg = this.state.labels.thisClass.nameEdit;
    }
    this.setState({ newRealm: realm , newRealmEditMsg: editMsg}, this.setDomain);
  };

  createRealmName = () => {
    let name = this.state.newRealmName;
    switch (this.state.newRealmType) {
      case "a" : {
        try {
          var matches = name.match(/\b(\w)/g);
          name = matches.join('').toLowerCase();
        } catch(err) {
          name = this.state.newRealm;
        }
        break;
      }
      case "w" : {
        try {
          var matches = name.split(" ");
          name = matches[matches.length-1].toLowerCase();
        } catch(err) {
          name = this.state.newRealm;
        }
        break;
      }
      default: {
        name = this.state.newRealm;
      }
    }
    this.setState({ newRealm: name }, this.setDomain);
  };

  postDomain() {
    var config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let row = this.state.data[this.state.updateIndex];
    let id = row.domain;
    let path = "misc/domains/" + this.state.newDomain;
    let message = "";
    axios.post(
        this.props.session.restServer
        + Server.getWsServerAdminApi()
        + path
        , this.state.data[this.state.updateIndex]
        , config
    )
        .then(response => {
          message = "updated " + path;
          this.setState({
            message: message
          });
          this.setState({centerDivVisible: true});
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = MessageIcons.getMessageIcons().error;
          this.setState( { message: message, messageIcon: messageIcon });
        });
  }

  createRealmDescription = () => {
    let desc = this.state.newRealmDesc;
    if (this.state.newRealmType !== 'o') {
      desc = this.state.initialDesc + name;
      if (this.state.selectedLanguageName) {
        desc = this.state.selectedLanguageName + " " + desc;
      }
      if (this.state.newRealmName) {
        desc =   desc + this.state.newRealmName;
      }
    }
    this.setState({ newRealmDesc: desc });
  };

  handleRealmNameChange(e) {
    let name = e.target.value;
    let desc = this.state.newRealmDesc;
    let realm = this.state.newRealm;
    if (name.length === 0) {
      realm = "";
    }
    if (this.state.newRealmType !== 'o') {
      desc = this.state.initialDesc + name;
      if (this.state.selectedLanguageName) {
        desc = this.state.selectedLanguageName + " " + desc;
      }
    }
    this.setState({ newRealm: realm, newRealmName: name, newRealmDesc: desc }, this.createRealmName);
  };

  handleRealmTypeAcronymnChange(e) {
    this.setState({ newRealmType: 'a', newRealmEditMsg: "" }, this.createRealmName);
  }

  handleRealmTypeLastWordChange(e) {
    this.setState({ newRealmType: 'w', newRealmEditMsg: "" }, this.createRealmName);
  }
  handleRealmTypeOtherChange(e) {
    this.setState({ newRealmType: 'o' }, this.createRealmName);
  }
  handleDescriptionChange(e) {
    this.setState({ newRealmDesc: e.target.value }, this.setDomain);
  }


  handleModalCountrySelection = (code, value) => {
    this.setState({selectedCountryCode: code, selectedCountryName: value}, this.setDomain);
  };

  handleModalLanguageSelection = (code, value, countryCode, countryValue) => {
    this.setState({
      selectedLanguageCode: code
      , selectedLanguageName: value
      , selectedCountryCode: countryCode
      , selectedCountryValue: countryValue
    }, this.setDomain);
  };

  handleModalLanguageClose = () => {
    this.setState({showModalLanguageSelector: false});
  };

  handleModalCountryClose = () => {
    this.setState({showModalCountrySelector: false});
  };

  handleModalLanguageClose = () => {
    this.setState({showModalLanguageSelector: false});
  };

  getModalCountrySelector = () => {
    if (this.state.showModalCountrySelector) {
      return (
          <div className="App-Domain-Builder">
            <ModalCountrySelector
                session={this.props.session}
                handleSubmit={this.handleModalCountrySelection}
                onClose={this.handleModalCountryClose}
            ></ModalCountrySelector>
          </div>
      );
    }
  };

  getModalLanguageSelector = () => {
    if (this.state.showModalLanguageSelector) {
      return (
          <div className="App-Domain-Builder">
            <ModalLanguageSelector
                session={this.props.session}
                handleSubmit={this.handleModalLanguageSelection}
                onClose={this.handleModalLanguageClose}
            ></ModalLanguageSelector>
          </div>
      );
    }
  };

  enableModalCountrySelector = () => {
    this.setState({showModalCountrySelector: true})
  };

  enableModalLanguageSelector = () => {
    this.setState({showModalLanguageSelector: true})
  };

  getCountryRow = () => {
    return (
        <div>
          <Row className="App-Row-Country-Select">
            <Col xs={4} md={4}>
              <ControlLabel>{this.state.labels.thisClass.countryCode}:</ControlLabel>
            </Col>
            <Col xs={2} md={2}>
              {this.state.selectedCountryCode}
            </Col>
            <Col xs={4} md={4}>
              {this.state.selectedCountryValue}
            </Col>
            <Col xs={2} md={2}>
              <Button
                  className="App-Button-Select"
                  onClick={this.enableModalCountrySelector}
              >
                {this.state.labels.buttons.select}
              </Button>
            </Col>
          </Row>
        </div>
    );
  };

  getLanguageRow = () => {
    return (
        <div>
          <Row className="App-Row-Language-Select">
            <Col xs={4} md={4}>
              <ControlLabel>{this.state.labels.thisClass.languageCode}:</ControlLabel>
            </Col>
            <Col xs={2} md={2}>
              {this.state.selectedLanguageCode}
            </Col>
            <Col xs={4} md={4}>
              {this.state.selectedLanguageName}
            </Col>
            <Col xs={2} md={2}>
              <Button
                  className="App-Button-Select"
                  onClick={this.enableModalLanguageSelector}
              >
                {this.state.labels.buttons.select}
              </Button>
            </Col>
          </Row>
        </div>
    );
  };


  getRealmRow = () => {
    return (
        <div>
          <Row className="App-Domain-Builder">
            <Col xs={4} md={4}>
              <ControlLabel>{this.state.labels.thisClass.realmName}:</ControlLabel>
            </Col>
            <Col xs={8} md={8}>
              <FormControl
                  type="text"
                  value={this.state.newRealmName}
                  placeholder="Enter text"
                  onChange={this.handleRealmNameChange}
              />
            </Col>
          </Row>
          <Row className="App-Domain-Builder">
            <Col xs={4} md={4}>
                <ControlLabel>{this.state.labels.thisClass.realmType}:</ControlLabel>
            </Col>
            <Col xs={8} md={8}>
              <FormGroup controlId={"radioGroupRealmType"}>
                <Radio
                    name="radioGroup"
                    inline
                    checked={this.state.newRealmType === 'a'}
                    onChange={this.handleRealmTypeAcronymnChange}>
                  {this.state.labels.thisClass.acronymn}
                </Radio>{' '}
                <Radio
                    name="radioGroup"
                    inline
                    checked={this.state.newRealmType === 'w'}
                    onChange={this.handleRealmTypeLastWordChange}>
                  {this.state.labels.thisClass.lastWord}
                </Radio>{' '}
                <Radio
                    name="radioGroup"
                    inline
                    checked={this.state.newRealmType === 'o'}
                    onChange={this.handleRealmTypeOtherChange}>
                    {this.state.labels.thisClass.other}
                </Radio>
              </FormGroup>
            </Col>
          </Row>
          <Row className="App-Domain-Builder">
            <Col xs={4} md={4}>
              <ControlLabel>{this.state.labels.thisClass.realmAcronymn}:</ControlLabel>
            </Col>
            <Col xs={8} md={8}>
              <FormControl
                  type="text"
                  readOnly={this.state.newRealmType !== 'o'}
                  value={this.state.newRealm}
                  placeholder="Enter text"
                  onChange={this.handleRealmChange}
              />
            </Col>
          </Row>
          {this.state.newRealmEditMsg &&
            <Row className="App-Domain-Builder">
              <Col xs={12} md={12}>
                <ControlLabel className="editMessage">{this.state.newRealmEditMsg}</ControlLabel>
              </Col>
            </Row>
          }
          <Row className="App-Domain-Builder">
            <Col xs={4} md={4}>
              <ControlLabel>{this.state.labels.thisClass.realmDescription}:</ControlLabel>
            </Col>
            <Col xs={8} md={8}>
              <FormControl
                  componentClass="textarea"
                  value={this.state.newRealmDesc}
                  readOnly={this.state.newRealmType !== 'o'}
                  placeholder="Enter text"
                  onChange={this.handleDescriptionChange}
              />
            </Col>
          </Row>
        </div>
    );
  };

  getFullDescriptionRow = () => {
    return (
        <div>
          <Row className="App-Domain-Builder">
            <Col xs={12} md={12}>
              <ControlLabel>{this.state.labels.thisClass.translations} {this.state.newRealmDesc} {this.state.labels.thisClass.inLanguage} {this.state.selectedLanguageName}  {this.state.labels.thisClass.spokenIn}  {this.state.selectedCountryValue} </ControlLabel>
            </Col>
          </Row>
        </div>
    );
  };

  getSubmitRow = () => {
    if (this.state.newDomain
        && this.state.newRealmName
        && this.state.selectedLanguageCode
    ) {
      return (
          <Row className="App-Domain-Builder">
            <Col xs={3} md={3}>
              <Button
                  type="submit"
                  bsStyle="primary"
              >
                {this.state.labels.messages.submit}
              </Button>
            </Col>
            <Col xs={3} md={3}>
              <ControlLabel>{this.state.labels.thisClass.domain}:</ControlLabel>
            </Col>
            <Col xs={2} md={2}>
              {this.state.newDomain}
            </Col>
            <Col xs={4} md={4}>
            </Col>
          </Row>
      );
    }
  };

  render() {
    return (
        <div className="App App-Domain-Builder">
          <div className="row">
            <ControlLabel>{this.state.labels.thisClass.toCreate}</ControlLabel>
            <ControlLabel>{this.state.labels.thisClass.domainDesc}</ControlLabel>
            <ControlLabel>{this.state.labels.thisClass.howTo}</ControlLabel>
            {this.getModalCountrySelector()}
            {this.getModalLanguageSelector()}
            <div className="col-sm-12 col-md-12 col-lg-12">
              <Well className="App-Domain-Builder-Well">
                {this.getLanguageRow()}
              </Well>
              <Well className="App-Domain-Builder-Well">
                {this.getCountryRow()}
              </Well>
              <Well className="App-Domain-Builder-Well">
                {this.getRealmRow()}
              </Well>
              {/*<Well className="App-Domain-Builder-Well">*/}
                {/*{this.getFullDescriptionRow()}*/}
              {/*</Well>*/}
              {this.getSubmitRow()}
            </div>
          </div>
        </div>
    )
  }
};

DomainBuilder.propTypes = {
  session: PropTypes.object.isRequired
};

// set default values for props here
DomainBuilder.defaultProps = {
};

export default DomainBuilder;
