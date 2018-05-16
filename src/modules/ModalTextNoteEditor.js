import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Modal, Well} from 'react-bootstrap';

import Labels from '../Labels';
import TextNoteEditor from '../TextNoteEditor';
import MessageIcons from '../helpers/MessageIcons';
import Spinner from '../helpers/Spinner';
import axios from "axios/index";
import IdManager from "../helpers/IdManager";

/**
 * Display modal content.
 */
export class ModalTextNoteEditor extends React.Component {

  constructor(props) {
    super(props);
    let textId = IdManager.getParts(props.noteIdTopic);
    let showForm = true;
    if (props.noteIdLibrary) {
      showForm = false;
    }

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
      , showForm: showForm
      , textId: textId
    };

    this.close = this.close.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.handleTextNoteContentChange = this.handleTextNoteContentChange.bind(this);
  };

  componentDidMount = () => {
    if (this.props.noteIdLibrary && this.props.noteIdKey) {
      this.fetchData();
    }
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


  fetchData() {
    this.setState({
      message: this.state.labels.messages.searching
      , messageIcon: MessageIcons.getMessageIcons().info
    });
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };

    let path = this.props.session.restServer
        + this.props.restPath
        + "/"
        + this.props.noteIdLibrary
        + "/"
        + this.props.noteIdTopic
        + "/"
        + this.props.noteIdKey
    ;
    axios.get(path, config)
        .then(response => {
          if (response.data.valueCount && response.data.valueCount > 0) {
            let data = response.data.values[0];
            let schemaId = data._valueSchemaId;
            let dataSchema = response.data.valueSchemas[schemaId].schema;
            let dataUiSchema = response.data.valueSchemas[schemaId].uiSchema;
            this.setState({
                  schema:dataSchema
                  , uiSchema:dataUiSchema
                  , formData: data
                  , showForm: true
                  , message: this.state.labels.messages.found
                  , messageIcon: MessageIcons.getMessageIcons().info
                }
            );
          }
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = MessageIcons.getMessageIcons().error;
          if (error && error.response && error.response.status === 404) {
            message = "not found";
            messageIcon = MessageIcons.getMessageIcons().warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  };

  handleTextNoteContentChange = () => {
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

  getEditor = () => {
    if (this.state.showForm) {
      return (
          <TextNoteEditor
              session={this.props.session}
              textId={this.props.noteIdTopic}
              onEditorChange={this.handleTextNoteContentChange}
              form={this.state.formData}
              id={"tinymiceeditor" + this.props.noteIdTopic}
              notesList={this.props.notesList}
          />
          );
    } else {
      return (
          <Spinner message={this.state.labels.messages.retrieving}/>
      );
    }
  };

  render() {
    return (
        <div>
          <Modal
              backdrop={"static"}
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
              {this.getEditor()}
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
  , noteIdLibrary: PropTypes.string
  , noteIdTopic: PropTypes.string.isRequired
  , noteIdKey: PropTypes.string
  , onSubmit: PropTypes.func
  , onClose: PropTypes.func
  , canUpdate: PropTypes.bool
  , notesList: PropTypes.array
};
ModalTextNoteEditor.defaultProps = {
  canUpdate: true
};

export default ModalTextNoteEditor;

