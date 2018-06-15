import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button, Glyphicon, Modal, Panel} from 'react-bootstrap';

import IdManager from './helpers/IdManager';
import MessageIcons from './helpers/MessageIcons';
import ParaRowTextEditor from './ParaRowTextEditor';
/**
 * Display the ParaRowEditor as a modal window.
 */
export class ModalParaRowEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        labels: {
          thisClass: props.session.labels[props.session.labelTopics.ModalParaRowEditor]
          , messages: props.session.labels[props.session.labelTopics.messages]
          , resultsTableLabels: props.session.labels[props.session.labelTopics.resultsTable]
        }
        , message: props.session.labels[props.session.labelTopics.messages].initial
        , messageIcons: MessageIcons.getMessageIcons()
        , messageIcon: MessageIcons.getMessageIcons().info
        , showModal: this.props.showModal
        , topic: IdManager.getTopic(this.props.editId)
        , key: IdManager.getKey(this.props.editId)
        , valuesSame: true
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getModalInfo = this.getModalInfo.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: nextProps.session.labels[nextProps.session.labelTopics.ModalParaRowEditor]
            , messages: nextProps.session.labels[nextProps.session.labelTopics.messages]
            , resultsTableLabels: nextProps.session.labels[nextProps.session.labelTopics.resultsTable]
          }
          , message: nextProps.session.labels[nextProps.session.labelTopics.messages].initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function is needed, e.g. if you need to call the rest server again
  };

  close() {
    this.setState({showModal: false});
    this.props.onClose(
        this.state.selectedId
        , this.state.selectedValue
        , this.state.selectedSeq
    );
  };

  open() {
    this.setState({showModal: true});
  };


  onSubmit = (value) => {
    this.props.onSubmit(value);
  };

  getModalInfo = () => {
    if (this.props.canChange) {
      return (
          <Alert bsStyle="info">
            <p>
              <Glyphicon glyph="hand-right"/>
              {this.state.labels.thisClass.msg1}
            </p>
          </Alert>
      );
    } else {
      return (
          <Alert bsStyle="warning">
            <p>
              <Glyphicon glyph="hand-right"/>
              {this.state.labels.thisClass.msg2}
            </p>
          </Alert>
      );
    }
  };

  render() {
    return (
        <div>
          <Modal backdrop={"static"} dialogClassName="App-Modal-Para-Row-Editor" show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.labels.thisClass.panelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getModalInfo()}
              <ParaRowTextEditor
                  session={this.props.session}
                  docType="Liturgical"
                  idLibrary={IdManager.getLibrary(this.props.editId)}
                  idTopic={IdManager.getTopic(this.props.editId)}
                  idKey={IdManager.getKey(this.props.editId)}
                  value={this.props.value}
                  onSubmit={this.onSubmit}
                  canChange={this.props.canChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                  onClick={this.close}>{this.state.labels.thisClass.close}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalParaRowEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onClose: PropTypes.func.isRequired
  , onSubmit: PropTypes.func.isRequired
  , showModal: PropTypes.bool.isRequired
  , editId: PropTypes.string.isRequired
  , value: PropTypes.string.isRequired
  , canChange: PropTypes.bool.isRequired
};
export default ModalParaRowEditor;

