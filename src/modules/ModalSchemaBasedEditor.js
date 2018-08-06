import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Col, ControlLabel, Button, Modal, Row, Well} from 'react-bootstrap';
import Form from "react-jsonschema-form";
import FontAwesome from 'react-fontawesome';
import MessageIcons from '../helpers/MessageIcons';
import DeleteButton from "../helpers/DeleteButton";

/**
 * Display modal content.
 */
export class ModalSchemaBasedEditor extends React.Component {

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
      , httpCodeLabels: labels[labelTopics.httpCodes]
      , selectedId: ""
      , selectedValue: ""
      , selectedSchema: ""
      , showModal: true
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.getModalFooter = this.getModalFooter.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
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
      labels: {
        buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , references: labels[labelTopics.ViewReferences]
      }
      , message: labels[labelTopics.messages].initial
      , httpCodeLabels: labels[labelTopics.httpCodes]
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
        , this.state.formData
    );
  };

  open() {
    this.setState({showModal: true});
  };

  onSubmit = ({formData}) => {
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
    axios.put(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: "updated "
            , formData: formData
          });
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = MessageIcons.getMessageIcons().error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  };

  onDelete = () => {
    this.close();
  };

  getModalFooter = () => {
    if (this.state.formData && this.state.formData.id) {
      return (
          <div>
            <Row className="App show-grid App-PDF-Title-Row">
              <Col xs={3} md={3}>
                <Button className={"App-Modal-Close-Button"} onClick={this.close}>{this.state.labels.buttons.close}</Button>
              </Col>
              <Col xs={9} md={9}>
                <DeleteButton
                    session={this.props.session}
                    idLibrary={this.state.formData.library}
                    idTopic={this.state.formData.topic}
                    idKey={this.state.formData.key}
                    onDelete={this.onDelete}
                />
              </Col>
            </Row>
          </div>
      )
    }  else {
      return (
          <Button onClick={this.close}>{this.state.labels.buttons.close}</Button>
      );
    }
  };

  render() {
    return (
        <div>
          <Modal
              backdrop={"static"}
              dialogClassName="App-Modal-Para-Row-Editor"
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
              <Form schema={this.state.schema}
                    uiSchema={this.state.uiSchema}
                    formData={this.state.formData}
                    onSubmit={this.onSubmit}
              >
              <div>
                  <Button
                      bsStyle="primary"
                      type="submit"
                      disabled={! this.props.canUpdate}
                  >
                    {this.state.labels.buttons.submit}
                  </Button>
                  <span className="App App-message"><FontAwesome
                    name={this.state.messageIcon}/>
                  {this.state.message}
                  </span>
              </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              {this.getModalFooter()}
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalSchemaBasedEditor.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , onClose: PropTypes.func.isRequired
  , showModal: PropTypes.bool.isRequired
  , title: PropTypes.string.isRequired
  , fromTitle: PropTypes.string
  , fromId: PropTypes.string
  , fromText: PropTypes.string
  , toTitle: PropTypes.string
  , toId: PropTypes.string
  , toText: PropTypes.string
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , canUpdate: PropTypes.bool
};
ModalSchemaBasedEditor.defaultProps = {
  canUpdate: true
};

export default ModalSchemaBasedEditor;

