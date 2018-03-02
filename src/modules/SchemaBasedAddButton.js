import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import ModalSearchOntologyWithCallback from './ModalSearchOntologyWithCallback';
import ModalSearchTextWithCallback from './ModalSearchTextWithCallback';
import ModalNewEntryForm from './ModalNewEntryForm';
import FontAwesome from 'react-fontawesome';

/**
 * Provides an Add button for adding an entry that is based on a json schema
 */
class SchemaBasedAddButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: {
        thisClass: Labels.getSchemaBasedAddButtonLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , references: Labels.getViewReferencesLabels(this.props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , idTopicType: this.props.formData["partTypeOfTopic"]
      , idKeyType: this.props.formData["partTypeOfKey"]
      , showModal: false
      , idSelected: false
      , idLibrary: this.props.idLibrary
      , idTopic: this.props.idTopic
      , idTopicValue: ""
      , idKey: this.props.idKey
      , idKeyValue: ""
      , initialOntologyType: "Animal"
      , restPath: this.props.restPath
      , uiSchema: this.props.uiSchema
      , schema: this.props.schema
      , formData: this.props.formData
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleIdBuilderClose = this.handleIdBuilderClose.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.getContent = this.getContent.bind(this);
    this.setFormData = this.setFormData.bind(this);

    this.handleIdLibrarySelection = this.handleIdLibrarySelection.bind(this);
    this.handleIdTopicSelection = this.handleIdTopicSelection.bind(this);
    this.handleIdKeySelection = this.handleIdKeySelection.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getSchemaBasedAddButtonLabels(this.props.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
            , references: Labels.getViewReferencesLabels(this.props.session.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
          }
          , message: Labels.getMessageLabels(props.session.languageCode).initial
        }
      }, function () {
        return this.handleStateChange("place holder")
      });
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }


  handleIdLibrarySelection = (library) => {
    if (library) {
      this.setState({
        idLibrary: library
      });
    }
  }

  handleIdTopicSelection = (topic, value) => {
    this.setState({
      idTopic: topic
      , idTopicValue: value
    });
  }

  handleIdKeySelection = (
      id
      , value
      , seq
      , schema
  ) => {
    let schemaId = this.props.session.uiSchemas.getLinkCreateSchemaIdForSchemaId(schema);
    let formData = this.props.session.uiSchemas.getForm(schemaId);

    this.setState({
      idKey: id
      , idKeyValue: value
      , idKeySeq: seq
      , idSelected: true
      , idSchema: schemaId
      , idTopicType: formData["partTypeOfTopic"]
      , idKeyType: formData["partTypeOfKey"]
      , restPath: this.props.session.uiSchemas.getHttpPostPathForSchema(schemaId)
      , uiSchema: this.props.session.uiSchemas.getUiSchema(schemaId)
      , schema: this.props.session.uiSchemas.getSchema(schemaId)
      , formData: formData
    });
  };

  handleAddButtonClick = () => {
    let idSelected = false;
    if (this.state.idKeyType === "TIMESTAMP") {
      idSelected = true;
    }
    this.setState({
      idSelected: idSelected
      , showModal: true
    });
  };

  handleIdBuilderClose = () => {
    let idSelected = (this.state.idKey && this.state.idKey.length > 0);
    this.setState({
      idSelected: idSelected
      , showModal: idSelected
    });
  }

  handleModalClose = () => {
    this.setState({
      showModal: false
    });
    this.props.onClose();
  }

  handleModalSubmit = ({formData}) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
  }

  setFormData = () => {
    let formData = this.state.formData;
    formData.library = this.props.idLibrary;
    formData.topic = this.props.idTopic;
    formData.key = this.state.idKey;
    formData.id = this.props.idLibrary
        +"~"
        + this.props.idTopic
        +"~"
        + this.state.idKey;
    formData.seq = this.props.seq;
    formData.status = "FINALIZED";
    return formData;
  }

  getContent = () => {
    if (this.state.showModal) {
      if (this.state.idSelected) {
        return (
            <ModalNewEntryForm
                session={this.props.session}
                restPath={this.state.restPath}
                uiSchema={this.state.uiSchema}
                schema={this.state.schema}
                formData={this.setFormData()}
                title={this.props.title}
                fromId={this.props.fromId}
                fromText={this.props.fromText}
                toId={this.state.idKey}
                toText={this.state.idKeyValue}
                fromTitle={this.state.labels.references.theText}
                toTitle={this.state.labels.references.refersTo}
                onSubmit={this.handleSubmit}
                onClose={this.handleModalClose}
            />
        )
      } else {
        switch(this.state.idKeyType) {
          case "ID_OF_SELECTED_BIBLICAL_VERSE":
            return (
                <ModalSearchTextWithCallback
                    session={this.props.session}
                    initialDocType={"Biblical"}
                    onCallback={this.handleIdKeySelection}
                    onClose={this.handleIdBuilderClose}
                />
            )
            break;
          case "ID_OF_SELECTED_ONTOLOGY_INSTANCE":
            return (
                <ModalSearchOntologyWithCallback
                    session={this.props.session}
                    initialDocType={"Animal"}
                    onCallback={this.handleIdKeySelection}
                    onClose={this.handleIdBuilderClose}
                />
            )
            break;
        }
      }
    } else {
      return (
          <Button
              className="Schema-Based-Add-Button"
              bsStyle="primary"
              bsSize={"xsmall"}
              onClick={this.handleAddButtonClick}>
            <FontAwesome
                className="App-Add-ico"
                name="plus"/>
          </Button>
      )
    }
  }

  render() {
    return (
        <span>{this.getContent()}</span>
    )
  }
}

SchemaBasedAddButton.propTypes = {
  session: PropTypes.object.isRequired
  , restPath: PropTypes.string.isRequired
  , uiSchema: PropTypes.object.isRequired
  , schema: PropTypes.object.isRequired
  , formData: PropTypes.object.isRequired
  , title: PropTypes.string
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , seq: PropTypes.string.isRequired
  , title: PropTypes.string.isRequired
  , fromTitle: PropTypes.string
  , fromId: PropTypes.string
  , fromText: PropTypes.string
  , toTitle: PropTypes.string
  , onClose: PropTypes.func.isRequired
  , onSubmit: PropTypes.func
};

// set default values for props here
SchemaBasedAddButton.defaultProps = {
  languageCode: "en"
  , title: ""
  , fromTitle: ""
  , fromId: ""
  , fromText: ""
  , toTitle: ""
};

export default SchemaBasedAddButton;
