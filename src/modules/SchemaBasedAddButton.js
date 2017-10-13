import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import ModalNewEntryForm from './ModalNewEntryForm';
import FontAwesome from 'react-fontawesome';

/**
 * This is a template for a new component.
 * To use it:
 * 1. Rename all occurrences of NewComponentTemplate to your component name.
 * 2. Replace Labels.getViewReferenceLabels with a call to get your component's labels
 * 3. Add content to the render function, etc...
 */
class SchemaBasedAddButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: { // TODO: replace getViewReferencesLabels with method for this class
        thisClass: Labels.getViewReferencesLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , showModal: false
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleModalSubmit = this.handleModalSubmit.bind(this);
    this.getContent = this.getContent.bind(this);
    this.setFormData = this.setFormData.bind(this);
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
            thisClass: Labels.getViewReferencesLabels(nextProps.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
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

  handleAddButtonClick = () => {
    this.setState({
      showModal: true
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
    let formData = this.props.formData;
    formData.library = this.props.idLibrary;
    formData.topic = this.props.idTopic;
    formData.key = this.props.idKey;
    formData.id = this.props.idLibrary
        +"~"
        + this.props.idTopic
        +"~"
        + this.props.idKey;
    formData.seq = this.props.seq;
    formData.status = "FINALIZED";
    return formData;
  }

  getContent = () => {
    if (this.state.showModal) {
      return (
        <ModalNewEntryForm
            session={this.props.session}
            restPath={this.props.restPath}
            uiSchema={this.props.uiSchema}
            schema={this.props.schema}
            formData={this.setFormData()}
            title={this.props.title}
            textId={this.props.textId}
            text={this.props.text}
            onSubmit={this.handleSubmit}
            onClose={this.handleModalClose}
        />
      )
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
  //    {this.getContent()}

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
  , textId: PropTypes.string
  , text: PropTypes.string
  , onClose: PropTypes.func.isRequired
  , onSubmit: PropTypes.func
};

// set default values for props here
SchemaBasedAddButton.defaultProps = {
  languageCode: "en"
  , title: ""
  , textId: ""
  , text: ""
};

export default SchemaBasedAddButton;
