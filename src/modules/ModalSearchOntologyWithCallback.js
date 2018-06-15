import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Well} from 'react-bootstrap';
import SearchOntology from '../SearchOntology';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal text search that allows user to select a doc.
 */
export class ModalSearchOntologyWithCallback extends React.Component {

  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        button: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
        , searchLabels: labels[labelTopics.search]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , showModal: true
  };

    this.close = this.close.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
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
        , resultsTableLabels: labels[labelTopics.resultsTable]
        , searchLabels: labels[labelTopics.search]
      }
    });
  };

  setMessage(message) {
    this.setState({
      message: message
    });
  }

  handleSearchCallback(id, value, seq, schema) {
    this.setState({ showModal: false });
    if (id.length > 0) {
      this.props.onCallback(id, value, seq, schema);
    } else {
      this.close();
    }
  }

  close() {
    this.setState({showModal: false});
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  render() {
    return (
        <div>
          <Modal
              backdrop={"static"}
              dialogClassName="App-Modal-Search-Text-With-Callback"
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
              <SearchOntology
                  session={this.props.session}
                  callback={this.handleSearchCallback}
                  editor={false}
                  initialType={this.props.initialDocType}
                  fixedType={false}
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

ModalSearchOntologyWithCallback.propTypes = {
  session: PropTypes.object.isRequired
  , initialDocType: PropTypes.string
  , onCallback: PropTypes.func.isRequired
  , onClose: PropTypes.func
};

ModalSearchOntologyWithCallback.defaultProps = {
  initialDocType: "Liturgical"
};

export default ModalSearchOntologyWithCallback;

