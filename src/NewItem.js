import React, {PropTypes} from 'react';
import 'react-select/dist/react-select.css';
import ResourceSelector from './modules/ReactSelector'
import axios from 'axios';
import Labels from './Labels'
import Form from "react-jsonschema-form";
import server from './helpers/Server';
import IdBuilder from './modules/IdBuilder';
import ParaRowTextEditor from './ParaRowTextEditor';
import { Button, Panel, Well } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
export class NewItem extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getComponentNewItemLabels(this.props.languageCode)
        , search: Labels.getSearchLabels(this.props.languageCode)
      }
      , idBuilt: false
      , message: Labels.getSearchLabels(this.props.languageCode).msg1
      , messageIcon: this.messageIcons.info
      , formSelected: false
      , selectedForm: ""
      , IdLibrary: ""
      , LibraryReadOnly: false
      , IdTopic: ""
      , IdTopicValue: ""
      , IdTopicType: ""
      , IdKey: ""
      , IdKeyValue: ""
      , IdKeyType: ""
      , selected: {
        schema: {}
        , uiSchema: {}
        , form: {}
        , path: server.getDbServerDocsApi()
      }
      , panel: {
        idBuilderOpen: true
        , paraTextOpen: false
      }
      , translationValue: ""
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handleFormSelection = this.handleFormSelection.bind(this);
    this.handleIdSelection = this.handleIdSelection.bind(this);
    this.toogleIdBuilderPanel = this.toogleIdBuilderPanel.bind(this);
    this.toogleParaTextPanel = this.toogleParaTextPanel.bind(this);
    this.handleParallelTextEditorCallback = this.handleParallelTextEditorCallback.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      labels: {
        thisClass: Labels.getComponentNewItemLabels(nextProps.languageCode)
        , search: Labels.getSearchLabels(nextProps.languageCode)
      }
    });
  }

  /**
   * font-awesome icons for messages
   * @type {{info: string, warning: string, error: string}}
   */
  messageIcons = {
    info: "info-circle"
    , warning: "lightbulb-o"
    , error: "exclamation-triangle"
    , toggleOn: "toggle-on"
    , toggleOff: "toggle-off"
    , simpleSearch: "minus"
    , advancedSearch: "bars"
    , idPatternSearch: "key"
  }


  handleFormSelection = (selection) => {
    let theForm = this.props.forms[selection.value];
    let thePath = server.getDbServerDocsApi(); // default to docs
    if (selection.value.startsWith("Link")) { // switch to links if need be
      thePath = server.getDbServerLinksApi();
    }
    this.setState({
      selected: {
        schema: this.props.formsSchemas[selection.value].schema
        , uiSchema: this.props.formsSchemas[selection.value].uiSchema
        , form: theForm
        , path: thePath
      }
      , selectedForm: selection.value
      , formSelected: true
      , IdLibrary: theForm["library"]
      , IdTopic: theForm["topic"]
      , IdTopicType: theForm["partTypeOfTopic"]
      , IdTopicValue: ""
      , IdKey: theForm["key"]
      , IdKeyValue: ""
      , IdKeyType: theForm["partTypeOfKey"]
      , idBuilt: false
    })
  };

  handleIdSelection = (
      IdLibrary
      , IdTopic
      , IdTopicValue
      , IdKey
      , IdKeyValue
  ) => {
    let IdBuilt = (IdLibrary.length > 0 && IdTopic.length > 0 && IdKey.length > 0);
    this.setState({
      IdLibrary: IdLibrary
      , IdTopic: IdTopic
      , IdTopicValue: IdTopicValue
      , IdKey: IdKey
      , IdKeyValue: IdKeyValue
      , idBuilt: IdBuilt
    });
    this.state.selected.form.library = IdLibrary;
    this.state.selected.form.topic = IdTopic;
    this.state.selected.form.key = IdKey;
    this.state.selected.form.id = IdLibrary+"~"+IdTopic+"~"+IdKey;
  };

  onSubmit = ({formData}) => {
    this.setState({
      message: this.state.labels.search.creating
      , messageIcon: this.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.username
        , password: this.props.password
      }
    };
    let path = this.props.restServer
        + this.state.selected.path
    ;
    axios.post(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: this.state.labels.search.created,
          });
        })
        .catch( (error) => {
          var message = Labels.getHttpMessage(
              this.props.languageCode
              , error.response.status
              , error.response.statusText
          );
          var messageIcon = this.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }

  toogleIdBuilderPanel = () => {
    this.setState({
          panel: {
            idBuilderOpen: ! this.state.panel.idBuilderOpen
          }
        }
    );
  }

  toogleParaTextPanel = () => {
    this.setState({
          panel: {
            ParaTextOpen: ! this.state.panel.paraTextOpen
          }
        }
    );
  }

  handleParallelTextEditorCallback = (value) => {
    console.log(value);
    this.setState({
      translationValue: value
    });
  }

  render () {
    return (
        <div className="newItem">
          <Well>
          <ResourceSelector
              title={"The Form you want to use..."}
              initialValue={this.state.selectedForm}
              resources={this.props.formsDropdown}
              changeHandler={this.handleFormSelection}
              multiSelect={false}
          />
          </Well>
          {this.state.formSelected ?
              <Well>
                <Panel
                    header={this.state.labels.search.IdParts.title}
                    eventKey="id-parts-builder"
                    expanded={this.state.panel.idBuilderOpen}
                    onSelect={this.toogleIdBuilderPanel}
                    collapsible
                >
                <IdBuilder
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    libraries={this.props.domains["author"]}
                    IdLibrary={this.state.IdLibrary}
                    ontologyDropdowns={this.props.ontologyDropdowns}
                    IdTopic={this.state.IdTopic}
                    IdTopicValue={this.state.IdTopicValue}
                    IdTopicType={this.state.IdTopicType}
                    IdKey={this.state.IdKey}
                    IdKeyValue={this.state.IdKeyValue}
                    IdKeyType={this.state.IdKeyType}
                    handleSubmit={this.handleIdSelection}
                    languageCode={this.props.languageCode}
                />
                </Panel>
              </Well>
              :
              <div></div>
          }
          {this.state.formSelected ?
              <Well>
                { this.state.idBuilt &&
                <Panel
                    header={this.state.labels.search.IdParts.title}
                    eventKey="para-text-panel"
                    expanded={this.state.panel.ParaTextOpen}
                    onSelect={this.toogleParaTextPanel}
                    collapsible
                >
                  <IdBuilder
                      restServer={this.props.restServer}
                      username={this.props.username}
                      password={this.props.password}
                      libraries={this.props.domains["author"]}
                      IdLibrary={this.state.IdLibrary}
                      ontologyDropdowns={this.props.ontologyDropdowns}
                      IdTopic={this.state.IdTopic}
                      IdTopicValue={this.state.IdTopicValue}
                      IdTopicType={this.state.IdTopicType}
                      IdKey={this.state.IdKey}
                      IdKeyValue={this.state.IdKeyValue}
                      IdKeyType={this.state.IdKeyType}
                      handleSubmit={this.handleIdSelection}
                      languageCode={this.props.languageCode}
                  />
                </Panel>
                }
              </Well>
              :
              <div></div>
          }
              <Well>
                {this.state.formSelected &&
                this.state.idBuilt &&
                <ParaRowTextEditor
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    languageCode={this.props.languageCode}
                    docType="Liturgical"
                    idLibrary={this.state.IdLibrary}
                    idTopic={this.state.IdTopic}
                    idKey={this.state.IdKey}
                    value={this.state.translationValue}
                    callback={this.handleParallelTextEditorCallback}
                />
                }
          </Well>
          {this.state.formSelected ?
              <Well>
                { this.state.idBuilt &&
                <Form schema={this.state.selected.schema}
                      uiSchema={this.state.selected.uiSchema}
                      formData={this.state.selected.form}
                      onSubmit={this.onSubmit}
                >
                  <div>
                    <Button bsStyle="primary" type="submit">{this.state.labels.search.submit}</Button>
                    <span className="App-message"><FontAwesome
                        name={this.state.messageIcon}/>
                      {this.state.message}
                    </span>
                  </div>
                </Form>
                }
              </Well>
              :
              <div></div>
          }
        </div>
    )
  }
}

NewItem.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , domains: React.PropTypes.object.isRequired
  , ontologyDropdowns: React.PropTypes.object.isRequired
  , formsDropdown: React.PropTypes.array.isRequired
  , formsSchemas: React.PropTypes.object.isRequired
  , forms: React.PropTypes.object.isRequired
  , changeHandler: React.PropTypes.func.isRequired
  , languageCode: React.PropTypes.string.isRequired
};

export default NewItem;