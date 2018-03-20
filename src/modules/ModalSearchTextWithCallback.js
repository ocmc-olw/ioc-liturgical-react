import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal, Well} from 'react-bootstrap';
import SearchText from '../SearchText';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';

/**
 * Display modal text search that allows user to select a doc.
 */
export class ModalSearchTextWithCallback extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      labels: {
        button: Labels.getButtonLabels(props.session.languageCode)
        , messages: Labels.getMessageLabels(props.session.languageCode)
        , searchLabels: Labels.getSearchLabels(props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(props.session.languageCode).initial
      , showModal: true
  }

    this.close = this.close.bind(this);
    this.setMessage = this.setMessage.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
  };

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        button: Labels.getButtonLabels(nextProps.session.languageCode)
        , messages: Labels.getMessageLabels(nextProps.session.languageCode)
        , searchLabels: Labels.getSearchLabels(nextProps.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
      }
    });
  }

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
              <SearchText
                  session={this.props.session}
                  callback={this.handleSearchCallback}
                  searchLabels={this.state.labels.searchLabels}
                  resultsTableLabels={this.state.labels.resultsTableLabels}
                  initialDocType={this.props.initialDocType}
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

ModalSearchTextWithCallback.propTypes = {
  session: PropTypes.object.isRequired
  , initialDocType: PropTypes.string
  , onCallback: PropTypes.func.isRequired
  , onClose: PropTypes.func
};
ModalSearchTextWithCallback.defaultProps = {
  initialDocType: "Liturgical"
};

export default ModalSearchTextWithCallback;

