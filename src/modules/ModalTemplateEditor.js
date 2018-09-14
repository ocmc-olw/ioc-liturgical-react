import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {ControlLabel, Button, Modal, Well} from 'react-bootstrap';
import MessageIcons from '../helpers/MessageIcons';
import Spinner from '../helpers/Spinner';
import SplitTemplateEditor from '../SplitTemplateEditor';
import ReactModal from 'react-modal-resizable-draggable'

/**
 * Display modal content.
 */
export class ModalSplitTemplateEditor extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , references: labels[labelTopics.ViewReferences]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , resultCount: 0
      , showSearchResults: false
      , schema: {}
      , uiSchema: {}
      , formData: {}
      , data: {values: [{"id": "", "value:": ""}]}
      , showForm: false
      , topicText: ""
      , keyText: ""
      , treeData: undefined
      , dataFetched: false
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.getEditor = this.getEditor.bind(this);
    this.setMessage = this.setMessage.bind(this);
  };

  componentWillMount = () => {
    this.setState({
          showModal: this.props.showModal
        }
        , function () {
          this.fetchData();
        }
    );
  };

  componentWillReceiveProps = (nextProps) => {
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;
    this.setState({
      buttons: labels[labelTopics.button]
      , messages: labels[labelTopics.messages]
      , references: labels[labelTopics.ViewReferences]
    });
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  }

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
        + this.props.idLibrary
        + "/"
        + this.props.idTopic
        + "/"
        + this.props.idKey
    ;
    axios.get(path, config)
        .then(response => {
          if (response.data.valueCount && response.data.valueCount > 0) {
            let data = response.data.values[0];
            let treeData = [];
            treeData.push(JSON.parse(data.node));
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
                  , treeData: treeData
                  , dataFetched: true
                }
            );
          }
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = MessageIcons.getMessageIcons().error;
          if (error && error.response && error.response.status === 404) {
            message = this.state.labels.messages.foundNone;
            messageIcon = MessageIcons.getMessageIcons().warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  };


  close() {
    this.setState({showModal: false});
    this.props.onClose(
        this.state.selectedId
        , this.state.selectedValue
        , this.state.selectedSchema
    );
  };

  open() {
    this.setState({showModal: true});
  };

  getEditor = () => {
    if (this.state.dataFetched) {
      return (
          <SplitTemplateEditor
              session={this.props.session}
              treeData={this.state.treeData}
              idLibrary={this.props.idLibrary}
              idTopic={this.props.idTopic}
              formData={this.state.formData}
              uiSchema={this.state.uiSchema}
              schema={this.state.schema}
          />
      )
    } else {
      return (
          <Spinner message={this.state.labels.messages.searching}/>
      );
    }
  };

  render() {
    return (
        <div>
          <Modal
              backdrop={"static"}
              dialogClassName="App-Modal-Template-Editor"
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
              { this.props.canUpdate ? <div></div>: <ControlLabel>{this.state.labels.messages.readOnly}</ControlLabel>}
            </Modal.Header>
            <Modal.Body>
              {this.getEditor()}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>{this.state.labels.buttons.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalSplitTemplateEditor.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , onClose: PropTypes.func.isRequired
  , showModal: PropTypes.bool.isRequired
  , title: PropTypes.string.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , canUpdate: PropTypes.bool
};
ModalSplitTemplateEditor.defaultProps = {
  canUpdate: true
};

export default ModalSplitTemplateEditor;

