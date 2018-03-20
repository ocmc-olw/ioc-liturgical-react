import React from 'react';
import PropTypes from 'prop-types';
import {Button, Col, ControlLabel, Form, FormControl, FormGroup, Glyphicon, InputGroup, Modal, Well} from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import ReactSelector from './ReactSelector';
import ModalReactSelector from './ModalReactSelector';
import ModalSearchTextWithCallback from './ModalSearchTextWithCallback';
import ModalSchemaBasedEditor from './ModalSchemaBasedEditor';
import Server from "../helpers/Server";

/**
 * Display modal window to allow user to edit information about a template node.
 * TODO: when user sets node type to a switch (e.g. WHEN_DAY_NAME_IS), display a list of cases and allow user to check box to include.
 */
export class ModalTemplateNodeEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      labels: {
        thisClass: Labels.getModalTemplateNodeEditorLabels(this.props.session.languageCode)
        , buttons: Labels.getButtonLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , node: this.props.node
      , selectedNodeType: this.props.node.title
      , selectedSubtitle: this.props.node.subtitle
      , selectedSchemaValue: ""
      , showModal: props.showModal
      , showModalSchemaEditor: false
      , showModalTextSearch: false
      , showTextInput: false
      , idKey: "head"
      , modalTitle: this.props.node.subtitle
    }

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);

    this.handleSelectionChange = this.handleSelectionChange.bind(this);

    this.getModalTextSearch = this.getModalTextSearch.bind(this);
    this.handleTextLookupCallback = this.handleTextLookupCallback.bind(this);

    this.getModalSchemaEditorButton = this.getModalSchemaEditorButton.bind(this);
    this.enableModalSchemaEditor = this.enableModalSchemaEditor.bind(this);
    this.getModalSchemaEditor = this.getModalSchemaEditor.bind(this);
    this.handleCloseModalSchemaEditor = this.handleCloseModalSchemaEditor.bind(this);

    this.getModalReactSelector = this.getModalReactSelector.bind(this);
    this.handleReactSelectorCallback = this.handleReactSelectorCallback.bind(this);

    this.getSubtitleTextInput = this.getSubtitleTextInput.bind(this);
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this);

    this.getSubtitleTextIdLookup = this.getSubtitleTextIdLookup.bind(this);
    this.handleSubtitleTextIdChange = this.handleSubtitleTextIdChange.bind(this);
    this.enableModalTextSearch = this.enableModalTextSearch.bind(this);

    this.getNodeTypeSelector = this.getNodeTypeSelector.bind(this);
    this.handleNodeTypeChange = this.handleNodeTypeChange.bind(this);

    this.setSubtitle = this.setSubtitle.bind(this);
    this.getServiceDate = this.getServiceDate.bind(this);

  };

  PropTypesWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState((prevState, nextProps) => {
      return {
        labels: {
          thisClass: Labels.getModalTemplateNodeEditorLabels(nextProps.session.languageCode)
          , buttons: Labels.getButtonLabels(nextProps.session.languageCode)
          , messages: Labels.getMessageLabels(nextProps.session.languageCode)
          , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
        }
        , message: Labels.getMessageLabels(nextProps.session.languageCode).initial
        , node: nextProps.node
        , selectedNodeType: nextProps.node.title
        , selectedSubtitle: nextProps.node.subtitle
        , selectedSchemaValue: ""
        , showModal: nextProps.showModal
        , showModalSchemaEditor: false
        , showModalTextSearch: false
        , showTextInput: false
        , idKey: "head"
        , modalTitle: this.props.node.subtitle
      }
    });
  }


  open = () => {
    this.setState({showModal: true});
  };

  close = () => {
    this.setState({showModal: false}, this.props.callBack());
  };

  /**
   * This editor uses uischemas from the REST API
   * @returns {*}
   */
  getModalSchemaEditorButton = () => {
    if (this.state.selectedNodeType === "TEMPLATE") {
      return (
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>&nbsp;
              {this.state.labels.thisClass.editProperties}
            </Col>
            <Col sm={8}>
              <Button onClick={this.enableModalSchemaEditor}>
                <Glyphicon glyph="pencil" />
              </Button>
            </Col>
          </FormGroup>
      );
    }
  };

  enableModalSchemaEditor = () => {
    console.log("Setting showModalSchemaEditor=true");
    this.setState({showModalSchemaEditor: true});
  }

  /**
   * TODO: This is unfinished.  The idea is to allow the user
   * to see (and perhaps easily set) the year, month, and date
   * without having to invoke the modal schema based editor.
   * @returns {*}
   */
  getServiceDate = () => {
    if (this.state.selectedNodeType === "TEMPLATE") {
      return (
          <Form inline>
            <FormGroup controlId="formInlineYear">
              <ControlLabel>Year</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
            {' '}
            <FormGroup controlId="formInlineMonth">
              <ControlLabel>Month</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
            <FormGroup controlId="formInlineDay">
              <ControlLabel>Month</ControlLabel>
              {' '}
              <FormControl type="text" placeholder="" />
            </FormGroup>
        </Form>
      );
    }
  }

  getModalSchemaEditor = () => {
    return (
        <ModalSchemaBasedEditor
            session={this.props.session}
            restPath={Server.getDbServerDocsApi()}
            showModal={this.state.showModalSchemaEditor}
            title={this.state.modalTitle}
            idLibrary={this.props.templateLibrary}
            idTopic={this.props.templateTopic}
            idKey={this.state.idKey}
            onClose={this.handleCloseModalSchemaEditor}
        />
    )
  };

  handleCloseModalSchemaEditor = (id, value) => {
    if (id && id.length > 0) {
      this.setState({
        showModalSchemaEditor: false
        , selectedId: id
        , selectedSchemaValue: value
      });
    } else {
      this.setState({
        showModalSchemaEditor: false
      });
    }
  };

  getModalReactSelector = () => {
    return (
        <ModalReactSelector
            languageCode={this.props.session.languageCode}
            resources={this.state.selectorResource}
            initialValue={this.state.selectorInitialValue}
            callBack={this.handleReactSelectorCallback}
        />
    )
  };

  handleReactSelectorCallback = (item) => {
    if (item.length > 0) {
      this.setState({
        showModalReactSelector: false
        , selectedItem: item
        , selectedNodeType:item["value"]
      })
    } else {
      this.setState({
        showModalReactSelector: false
      })
    }
  };

  handleNodeTypeChange = (selection) => {
    let value = selection["value"];
    let node = this.state.node;
    node.title = value;
    this.setState({node: node, selectedNodeType: value}
    , this.handleSelectionChange
    );
  }

  handleSelectionChange = () => {
    switch (this.state.selectedNodeType) {
      case ("INSERT_SECTION"): {
        break;
      }
      case ("RID"): {
        this.setState({
          showModalTextSearch: true
        });
        break;
      }
      case ("SECTION"): {
        this.setState({
          showTextInput: true
        });
        break;
      }
      case ("SID"): {
        this.setState({
          showModalTextSearch: true
        });
        break;
      }
      case ("TEMPLATE"): {
        console.log("invoke Template schema-based editor");
        this.setState({
          idKey: "head"
          ,showModalSchemaEditor: true
          , modalTitle: this.props.idLibrary + "~" + this.props.idTopic + "~head"
        });
        break;
      }
      case ("tbd"): {
        this.setState({
          showModalReactSelector: true
          , selectorResource: this.props.session.dropdowns["templatePartsDropdown"]
          , selectorInitialValue: "SECTION"
        });
        break;
      }
    }
  };

  getModalTextSearch = () => {
    return (
        <ModalSearchTextWithCallback
            session={this.props.session}
            onCallback={this.handleTextLookupCallback}
            initialDocType={"Liturgical"}
        />
    )
  };

  handleTextLookupCallback = (id, value) => {
    if (id && id.length > 0) {
      this.setState({
        showModalTextSearch: false
        , selectedId: id
        , selectedSchemaValue: value
      }, this.setSubtitle(id)
      );
    } else {
      this.setState({
        showModalTextSearch: false
      })
    }
  };

  enableModalTextSearch = () => {
    this.setState({showModalTextSearch: true});
  }

  handleSubtitleTextIdChange = () => {

  }

  getSubtitleTextIdLookup = () => {

  }

  setSubtitle = (value) => {
    console.log(`setSubtitle.value=${value}`);
    let node = this.state.node;
    node.subtitle = value;
    this.setState({node: node, selectedSubtitle: value});
  }

  handleSubtitleChange = (event) => {
    this.setSubtitle(event.target.value);
  }

  getSubtitleTextInput = () => {
    // Note: use fall throughs (i.e. no break) for switches that group together
    switch (this.state.selectedNodeType) {
      case ("SID"):
      case ("RID"): {
        return (
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                {this.state.labels.thisClass.nodeSubtitle}
              </Col>
              <Col sm={8}>
                <InputGroup className="App-InputGroup-Static">
                  <FormControl.Static>
                    {this.state.selectedSubtitle}
                  </FormControl.Static>
                <InputGroup.Button>
                  <Button onClick={this.enableModalTextSearch}>
                    <Glyphicon glyph="search" />
                  </Button>
                </InputGroup.Button>
                </InputGroup>
              </Col>
            </FormGroup>
        );
        break;
      }
      case ("SECTION"):
        return (
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                {this.state.labels.thisClass.nodeSubtitle}
              </Col>
              <Col sm={10}>
                <FormControl
                    type="text"
                    defaultValue={this.state.selectedSubtitle}
                    onChange={this.handleSubtitleChange}
                />
              </Col>
            </FormGroup>
        );
        break;
      case ("TEMPLATE"): {
        return (
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                {this.state.labels.thisClass.nodeSubtitle}
              </Col>
              <Col sm={8}>
                <InputGroup className="App-InputGroup-Static">
                  <FormControl.Static>
                    {this.state.selectedSubtitle}
                  </FormControl.Static>
                </InputGroup>
              </Col>
            </FormGroup>
        );
        break;
      }
    }
  };

  getNodeTypeSelector = () => {
    if (this.state.selectedNodeType === "TEMPLATE") {
      return (
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              {this.state.labels.thisClass.nodeTypePrompt}
            </Col>
            <Col sm={8}>
              <InputGroup className="App-InputGroup-Static">
                <FormControl.Static>
                  {this.state.selectedNodeType}
                </FormControl.Static>
              </InputGroup>
            </Col>
          </FormGroup>
          )
    } else {
      return (
          <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>
              {this.state.labels.thisClass.nodeTypePrompt}
            </Col>
            <Col sm={10}>
              <ReactSelector
                  initialValue={this.state.selectedNodeType}
                  resources={this.props.session.dropdowns["templatePartsDropdown"]}
                  changeHandler={this.handleNodeTypeChange}
                  multiSelect={false}
              />
            </Col>
          </FormGroup>
      );
    }
  };

  render() {
    return (
        <div>
          {this.state.showModalSchemaEditor && this.getModalSchemaEditor()}
          {this.state.showModalTextSearch && this.getModalTextSearch()}
          <Modal  backdrop={"static"} show={this.state.showModal} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.labels.thisClass.panelTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="App-modal-body">
                <Well>
                  <Form horizontal>
                    {this.getNodeTypeSelector()}
                    {this.getSubtitleTextInput()}
                    {this.getModalSchemaEditorButton()}
                  </Form>
                </Well>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsStyle="primary" onClick={this.close}>
                {this.state.labels.thisClass.close}
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
  }
}
ModalTemplateNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
  , showModal: PropTypes.bool.isRequired
  , node: PropTypes.object.isRequired
  , path: PropTypes.array.isRequired
  , treeIndex: PropTypes.number.isRequired
  , callBack: PropTypes.func.isRequired
  , templateLibrary: PropTypes.string.isRequired
  , templateTopic: PropTypes.string.isRequired
};
ModalTemplateNodeEditor.defaultProps = {
};

export default ModalTemplateNodeEditor;

