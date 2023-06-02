import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
 import MessageIcons from '../helpers/MessageIcons';
import ModalSearchOntologyWithCallback from './ModalSearchOntologyWithCallback';
import ModalSearchTextWithCallback from './ModalSearchTextWithCallback';
import ModalNewEntryForm from './ModalNewEntryForm';
import FontAwesome from 'react-fontawesome';
import UiSchemas from "../classes/UiSchemas";

/**
 * Provides an Add button for adding an entry that is based on a json schema
 */
class SchemaBasedAddButton extends React.Component {
  constructor(props) {
    super(props);
    let uiSchemas = {};
    if (props.session && props.session.uiSchemas) {
      uiSchemas = new UiSchemas(
          props.session.uiSchemas.formsDropdown
          , props.session.uiSchemas.formsSchemas
          , props.session.uiSchemas.forms
      );
    }

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.schemaBasedAddButton]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
        , references: labels[labelTopics.ViewReferences]
      }
      , session: {
        uiSchemas: uiSchemas
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
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
    };

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
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;

    this.setState((prevState, props) => {
      return {
        labels: {
          thisClass: labels[labelTopics.schemaBasedAddButton]
          , messages: labels[labelTopics.messages]
          , resultsTableLabels: labels[labelTopics.resultsTable]
          , references: labels[labelTopics.ViewReferences]
        }
        , message: labels[labelTopics.messages].initial
      }
    }, function () {
      return this.handleStateChange("place holder")
    });
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };


  handleIdLibrarySelection = (library) => {
    if (library) {
      this.setState({
        idLibrary: library
      });
    }
  };

  handleIdTopicSelection = (topic, value) => {
    this.setState({
      idTopic: topic
      , idTopicValue: value
    });
  };

  handleIdKeySelection = (
      id
      , value
      , seq
      , schema
  ) => {
    let schemaId = this.state.session.uiSchemas.getLinkCreateSchemaIdForSchemaId(schema);
    let formData = this.state.session.uiSchemas.getForm(schemaId);

    this.setState({
      idKey: id
      , idKeyValue: value
      , idKeySeq: seq
      , idSelected: true
      , idSchema: schemaId
      , idTopicType: formData["partTypeOfTopic"]
      , idKeyType: formData["partTypeOfKey"]
      , restPath: this.state.session.uiSchemas.getHttpPostPathForSchema(schemaId)
      , uiSchema: this.state.session.uiSchemas.getUiSchema(schemaId)
      , schema: this.state.session.uiSchemas.getSchema(schemaId)
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
  };

  handleModalClose = () => {
    this.setState({
      showModal: false
    });
    this.props.onClose();
  };

  handleModalSubmit = ({formData}) => {
    if (this.props.onSubmit) {
      this.props.onSubmit(formData);
    }
  };

  setFormData = () => {
    let date = new Date();
    let month = (date.getMonth()+1).toString().padStart(2,"0");
    let day = date.getDate().toString().padStart(2,"0");
    let hour = date.getHours().toString().padStart(2,"0");
    let minute = date.getMinutes().toString().padStart(2,"0");
    let second = date.getSeconds().toString().padStart(2,"0");
    let key = date.getFullYear()
        + "."
        + month
        + "."
        + day
        + ".T"
        + hour
        + "."
        + minute
        + "."
        + second
    ;
    let formData = this.state.formData;
    formData.library = this.props.idLibrary;
    formData.topic = this.props.idTopic;
    formData.key = key; //this.state.idKey;
    formData.id = this.props.idLibrary
        +"~"
        + this.props.idTopic
        +"~"
        + key;
    formData.seq = formData.id;
    formData.status = "FINALIZED";
    return formData;
  };

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
                onSubmit={this.handleModalSubmit}
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
            );
          case "ID_OF_SELECTED_ONTOLOGY_INSTANCE":
            return (
                <ModalSearchOntologyWithCallback
                    session={this.props.session}
                    initialDocType={"Animal"}
                    onCallback={this.handleIdKeySelection}
                    onClose={this.handleIdBuilderClose}
                />
            );
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
  };

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
