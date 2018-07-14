import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Modal, Well} from 'react-bootstrap';

import LanguageLister from '../LanguageLister';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display a modal window for the user to search languages and select one
 */
export class ModalLanguageSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.setTheState(props, {});

    this.handleClose = this.handleClose.bind(this);
    this.handleIdSelection = this.handleIdSelection.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.getContent = this.getContent.bind(this);
    this.getSelection = this.getSelection.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(this.setTheState(nextProps, this.state));
  };

  // a method called by both the constructor and componentWillReceiveProps
  setTheState = (props, currentState) => {

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    return ({
      labels: {
        thisClass: labels[labelTopics.ModalLanguageSelector]
        , button: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , showModal: true
    })
  };


  setMessage(message) {
    this.setState({
      message: message
    });
  }

  handleClose() {
    this.setState({showModal: false});
    this.props.onClose(this.state.formData);
  };

  handleIdSelection = (code, value, countryCode, countryValue) => {
      this.setState({
        selectedCode: code
        , selectedValue: value
        , selectedCountryCode: countryCode
        , selectedCountryValue: countryValue
      }, this.handleCallback);
  };

  handleCallback = () => {
    if (this.props.handleSubmit) {
      this.props.handleSubmit(
          this.state.selectedCode
          , this.state.selectedValue
          , this.state.selectedCountryCode
          , this.state.selectedCountryValue
      );
    }
  };

  getSelection = () => {
    if (this.state.selectedCode) {
      return (
        <span>{this.state.labels.messages.youSelected} {this.state.selectedCode} {this.state.selectedValue} {this.state.labels.thisClass.asSpokenIn} {this.state.selectedCountryValue}.</span>
      );
    }
  };

  getContent = () => {
    if (this.state.showModal) {
      return (
          <div>
            <Modal
                backdrop={"static"}
                dialogClassName="App-Modal-Id-Builder"
                show={this.state.showModal}
                onHide={this.handleClose}
                keyboard={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>{this.state.labels.thisClass.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <ControlLabel>{this.state.labels.messages.rowSelect} {this.state.labels.messages.filter} {this.state.labels.messages.close}</ControlLabel>
                  <div>{this.getSelection()}</div>
                <LanguageLister
                    session={this.props.session}
                    callBack={this.handleIdSelection}
                />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleClose}>{this.state.labels.button.close}</Button>
              </Modal.Footer>
            </Modal>
            </div>
      )
    } else {
      return (<div></div>)
    }
  };

  render() {
    return (<Well>{this.getContent()}</Well>);
  }
}

ModalLanguageSelector.propTypes = {
  session: PropTypes.object.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , onClose: PropTypes.func.isRequired
};

ModalLanguageSelector.defaultProps = {
};

export default ModalLanguageSelector;

