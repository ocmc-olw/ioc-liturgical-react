import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Modal, Well} from 'react-bootstrap';

import NewEntryForm from './NewEntryForm';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal content.
 */
export class ModalNewEntryForm extends React.Component {

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
      , showModal: true
    };

    this.handleClose = this.handleClose.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  };

  componentWillMount = () => {
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

  handleClose = () => {
    this.setState({showModal: false});
    if (this.props.onClose) {
      this.props.onClose(this.state.formData);
    }
  };

  render() {
    return (
        <div>
          <Modal
              backdrop={"static"}
              dialogClassName="App-Modal-New-Entry-Form"
              show={this.state.showModal}
              onHide={this.handleClose}
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
              <Button onClick={this.handleClose}>{this.state.labels.buttons.close}</Button>
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
  , title: PropTypes.string.isRequired
  , fromTitle: PropTypes.string
  , fromId: PropTypes.string
  , fromText: PropTypes.string
  , toTitle: PropTypes.string
  , toId: PropTypes.string
  , toText: PropTypes.string
  , onSubmit: PropTypes.func
  , onClose: PropTypes.func
};
ModalNewEntryForm.defaultProps = {
  canUpdate: true
};

export default ModalNewEntryForm;

