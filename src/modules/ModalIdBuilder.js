import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Well} from 'react-bootstrap';

import Labels from '../Labels';
import IdBuilder from './IdBuilder';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal ID Builder to allow the user to select
 * the parts of the ID for a schema based form
 */
export class ModalIdBuilder extends React.Component {

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

    this.handleClose = this.handleClose.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.getContent = this.getContent.bind(this);
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

  handleClose() {
    this.setState({showModal: false});
    this.props.onClose(this.state.formData);
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
                <Modal.Title>{this.props.title}</Modal.Title>
                {this.props.text && this.props.textId &&
                <Well><div className={"App-Modal-Text"}>{this.props.text}<span className={"control-label"}> ({this.props.textId})</span></div></Well>
                }
              </Modal.Header>
              <Modal.Body>
                <IdBuilder
                    session={this.props.session}
                    IdLibrary={this.props.IdLibrary}
                    IdTopic={this.props.IdTopic}
                    IdTopicValue={this.props.IdTopicValue}
                    IdTopicType={this.props.IdTopicType}
                    IdKey={this.props.IdKey}
                    IdKeyValue={this.props.IdKeyValue}
                    IdKeyType={this.props.IdKeyType}
                    handleLibraryChange={this.props.handleLibraryChange}
                    handleTopicChange={this.props.handleTopicChange}
                    handleSubmit={this.handleClose}
                    initialOntologyType={this.props.initialOntologyType}
                />
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.close}>{this.state.labels.button.close}</Button>
              </Modal.Footer>
            </Modal>
            </div>
      )
    } else {
      return (<div></div>)
    }
  }

  render() {
    return (<Well>{this.getContent()}</Well>);
  }
}

ModalIdBuilder.propTypes = {
  session: PropTypes.object.isRequired
  , IdLibrary: PropTypes.string.isRequired
  , IdTopic: PropTypes.string.isRequired
  , IdTopicValue: PropTypes.string.isRequired
  , IdTopicType: PropTypes.string.isRequired
  , IdKey: PropTypes.string.isRequired
  , IdKeyValue: PropTypes.string.isRequired
  , IdKeyType: PropTypes.string.isRequired
  , handleLibraryChange: PropTypes.func.isRequired
  , handleTopicChange: PropTypes.func.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , initialOntologyType: PropTypes.string.isRequired
  , onClose: PropTypes.func.isRequired
};

ModalIdBuilder.defaultProps = {
};

export default ModalIdBuilder;

