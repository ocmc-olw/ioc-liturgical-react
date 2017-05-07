import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import axios from 'axios';
import Labels from '../Labels';
import Form from "react-jsonschema-form";
import FontAwesome from 'react-fontawesome';

/**
 * Display modal content.
 */
export class ModalSchemaBasedEditor extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showSearchResults: false
      , schema: {}
      , uiSchema: {}
      , formData: {}
      , message: this.props.searchLabels.msg1
      , messageIcon: this.messageIcons.info
      , data: {values: [{"id": "", "value:": ""}]}
      , showForm: false
      , topicText: ""
      , keyText: ""
      , httpCodeLabels: Labels.getHttpCodeLabels(this.props.languageCode)
    }

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
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

  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
     httpCodeLabels: Labels.getHttpCodeLabels(this.props.languageCode)
    });
  }

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    // , toggleOn: "eye"
    // , toggleOff: "eye-slash"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  }

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  fetchData() {
    this.setState({
      message: this.props.searchLabels.msg2
      , messageIcon: this.messageIcons.info
    });
    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };

    let path = this.props.restServer
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
                  , message: this.props.searchLabels.msg3
                  , messageIcon: this.messageIcons.info
                }
            );
          }
        })
        .catch((error) => {
          let message = error.message;
          let messageIcon = this.messageIcons.error;
          if (error && error.response && error.response.status === 404) {
            message = "not found";
            messageIcon = this.messageIcons.warning;
            this.setState({data: message, message: message, messageIcon: messageIcon});
          }
        });
  }


  close() {
    this.setState({showModal: false});
    this.props.onClose(this.state.selectedId, this.state.selectedValue);
  };

  open() {
    this.setState({showModal: true});
  };

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedValue: row["value"]
    });
  }

  onSubmit = ({formData}) => {
    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    let path = this.props.restServer
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
            message: "updated ",
          });
        })
        .catch( (error) => {
          var message = error.message;
          var messageIcon = this.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }

  render() {
    return (
        <div>
          <Modal
              show={this.state.showModal}
              onHide={this.close}
              keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form schema={this.state.schema}
                    uiSchema={this.state.uiSchema}
                    formData={this.state.formData}
                    onSubmit={this.onSubmit}
              >
                <div>
                  <Button bsStyle="primary" type="submit">{this.props.searchLabels.submit}</Button>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <div>
                <span className="App-message"><FontAwesome
                  name={this.state.messageIcon}/>
                  {this.state.message}
                  </span>
              </div>
              <Button onClick={this.close}>{this.props.searchLabels.close}</Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalSchemaBasedEditor.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , restPath: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , onClose: React.PropTypes.func.isRequired
  , showModal: React.PropTypes.bool.isRequired
  , title: React.PropTypes.string.isRequired
  , idLibrary: React.PropTypes.string.isRequired
  , idTopic: React.PropTypes.string.isRequired
  , idKey: React.PropTypes.string.isRequired
  , searchLabels: React.PropTypes.object.isRequired
  , languageCode: React.PropTypes.string.isRequired
};
export default ModalSchemaBasedEditor;

