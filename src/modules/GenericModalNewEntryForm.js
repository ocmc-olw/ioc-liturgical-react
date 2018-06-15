import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'react-bootstrap';

import GenericNewEntryForm from './GenericNewEntryForm';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal content.
 */
export class GenericModalNewEntryForm extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        button: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , references: labels[labelTopics.ViewReferences]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , showModal: true
    };

    this.close = this.close.bind(this);
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
        button: labels[labelTopics.button]
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
              backdrop={"static"}
              dialogClassName="App-Modal-New-Entry-Form"
              show={this.state.showModal}
              onHide={this.close}
              keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <GenericNewEntryForm
                session={this.props.session}
                path={this.props.restPath}
                onSubmit={this.onSubmit}
                schemaTypes={this.props.schemaTypes}
                title={this.props.title}
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

GenericModalNewEntryForm.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , onSubmit: PropTypes.func
  , onClose: PropTypes.func
  , schemaTypes: PropTypes.array
  , title: PropTypes.string.isRequired
};
GenericModalNewEntryForm.defaultProps = {
  canUpdate: true
};

export default GenericModalNewEntryForm;

