import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {ControlLabel, Button, Modal, Well} from 'react-bootstrap';
import Form from "react-jsonschema-form";

import Labels from '../Labels';
import NewEntryForm from './NewEntryForm';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal content.
 */
export class ModalNewEntryForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: {
        button: Labels.getButtonLabels(props.session.languageCode)
        , messages: Labels.getMessageLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(props.session.languageCode).initial
      , showModal: true
    }

    this.close = this.close.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        button: Labels.getButtonLabels(nextProps.session.languageCode)
        , messages: Labels.getMessageLabels(nextProps.session.languageCode)
      }
    });
  }

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  onSubmit = ({formData}) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
  }

  close() {
    this.setState({showModal: false});
    if (this.props.onClose) {
      this.props.onClose(this.state.formData);
    }
  };

  render() {
    return (
        <div>
          <Modal
              dialogClassName="App-Modal-Para-Row-Editor"
              show={this.state.showModal}
              onHide={this.close}
              keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
              {this.props.text && this.props.textId &&
              <Well><div className={"App-Modal-Text"}>{this.props.text}<span className={"control-label"}> ({this.props.textId})</span></div></Well>
              }
            </Modal.Header>
            <Modal.Body>
              <NewEntryForm
                session={this.props.session}
                path={this.props.restPath}
                schema={this.props.schema}
                uiSchema={this.props.uiSchema}
                formData={this.props.formData}
                onSubmit={this.onSubmit}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.state.labels.button.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}

ModalNewEntryForm.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , schema: PropTypes.object.isRequired
  , uiSchema: PropTypes.object.isRequired
  , formData: PropTypes.object.isRequired
  , title: PropTypes.string.isRequired
  , textId: PropTypes.string
  , text: PropTypes.string
  , onSubmit: PropTypes.func
  , onClose: PropTypes.func
};
ModalNewEntryForm.defaultProps = {
  canUpdate: true
};

export default ModalNewEntryForm;

