import React from 'react';
import PropTypes from 'prop-types';
import {Button, ControlLabel, Modal, Well} from 'react-bootstrap';

import Labels from '../Labels';
import GenericNewEntryForm from './GenericNewEntryForm';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal content.
 */
export class GenericModalNewEntryForm extends React.Component {

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
        , title: "Generic New Entry Form"
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
              <Modal.Title>{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <GenericNewEntryForm
                session={this.props.session}
                path={this.props.restPath}
                onSubmit={this.onSubmit}
                schemaTypes={this.props.schemaTypes}
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
};
GenericModalNewEntryForm.defaultProps = {
  canUpdate: true
};

export default GenericModalNewEntryForm;

