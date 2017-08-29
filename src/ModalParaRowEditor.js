import React from 'react';
import PropTypes from 'prop-types';
import {Alert, Button, Glyphicon, Modal} from 'react-bootstrap';

import Labels from './Labels';
import IdManager from './helpers/IdManager';
import MessageIcons from './helpers/MessageIcons';
import ParaRowTextEditor from './ParaRowTextEditor';

/**
 * Display the ParaRowEditor as a modal window.
 */
export class ModalParaRowEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.setTheState(props, this.state);

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.getModalInfo = this.getModalInfo.bind(this);
  };

  componentWillMount = () => {
  }

  setTheState = (props, currentState) => {
    return (
        {
          labels: {
            thisClass: Labels.getModalParaRowEditorLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , showModal: this.props.showModal
          , topic: IdManager.getTopic(this.props.editId)
          , key: IdManager.getKey(this.props.editId)
          , valuesSame: true
        }
    )
  }

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
  }

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
  }
  render() {
    return (
        <div>
          <Modal dialogClassName="App-Modal-Para-Row-Editor" show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.labels.thisClass.panelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.getModalInfo()}
              <ParaRowTextEditor
                  restServer={this.props.restServer}
                  username={this.props.username}
                  password={this.props.password}
                  languageCode={this.props.languageCode}
                  domains={this.props.domains}
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
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , languageCode: PropTypes.string.isRequired
  , domains: PropTypes.object.isRequired
  , onClose: PropTypes.func.isRequired
  , onSubmit: PropTypes.func.isRequired
  , showModal: PropTypes.bool.isRequired
  , editId: PropTypes.string.isRequired
  , value: PropTypes.string.isRequired
  , canChange: PropTypes.bool.isRequired
};
export default ModalParaRowEditor;

