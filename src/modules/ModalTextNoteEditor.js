import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Modal, Well} from 'react-bootstrap';

import Labels from '../Labels';
import TextNoteEditor from '../TextNoteEditor';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal content.
 */
export class ModalTextNoteEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: {
        button: Labels.getButtonLabels(props.session.languageCode)
        , messages: Labels.getMessageLabels(props.session.languageCode)
        , references: Labels.getViewReferencesLabels(this.props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(props.session.languageCode).initial
      , showModal: true
    };

    this.close = this.close.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        button: Labels.getButtonLabels(nextProps.session.languageCode)
        , messages: Labels.getMessageLabels(nextProps.session.languageCode)
        , references: Labels.getViewReferencesLabels(this.props.session.languageCode)
      }
    });
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  };

  onSubmit = ({formData}) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
  };

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
              dialogClassName="App-Modal-New-Entry-Form"
              show={this.state.showModal}
              onHide={this.close}
              keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
              {this.props.fromText && this.props.fromTitle &&
              <div className={"App-Text-Refers-To"}>{this.props.fromTitle}</div>
              }
              {this.props.fromText && this.props.fromId &&
              <Well className={"App-Well-From-Text"}><div className={"App-Modal-Text"}>{this.props.fromText}<span className={"control-label"}> ({this.props.fromId})</span></div></Well>
              }
              {this.props.fromText && this.props.toText && this.props.toTitle &&
              <div className={"App-Text-Refers-To"}>{this.props.toTitle}</div>
              }
              {this.props.toText && this.props.toId &&
              <Well className={"App-Well-To-Text"}><div className={"App-Modal-Text"}>{this.props.toText}<span className={"control-label"}> ({this.props.toId})</span></div></Well>
              }
              {this.props.toText &&
              <ControlLabel>{this.state.labels.references.infoBelow}</ControlLabel>
              }
            </Modal.Header>
            <Modal.Body>
              <TextNoteEditor
                  session={this.props.session}
                  idLibrary={this.props.library}
                  idTopic={this.props.topic}
                  idKey={this.props.key}
                  onEditorChange={this.handleTextNoteContentChange }
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

ModalTextNoteEditor.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , library: PropTypes.string.isRequired
  , topic: PropTypes.string.isRequired
  , key: PropTypes.string.isRequired
  , onSubmit: PropTypes.func
  , onClose: PropTypes.func
};
ModalTextNoteEditor.defaultProps = {
  canUpdate: true
};

export default ModalTextNoteEditor;

