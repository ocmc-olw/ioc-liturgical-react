import React, { Component , PropTypes} from 'react';
import { Accordion
  , Button
  , ControlLabel
  , FormGroup
  , FormControl
  , Panel
  , Well
} from 'react-bootstrap'
import ResourceSelector from './ReactSelector'
import SearchText from '../SearchText'
import Labels from '../Labels';
import SearchOntology from '../SearchOntology';
import IdManager from '../helpers/IdManager';

class IdBuilder extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchLabels: Labels.getSearchLabels(this.props.languageCode)
      , resultsTableLabels: Labels.getResultsTableLabels(this.props.languageCode)
      , selectedLibrary: this.props.IdLibrary
      , selectedLibraryLabel: ""
      , selectedTopic: this.props.IdTopic
      , tempTopic: ""
      , selectedTopicValue: this.props.IdTopicValue
      , selectedKey: this.props.IdKey
      , tempKey: ""
      , selectedKeyValue: this.props.IdKeyValue
      , searchingForTopic: false
      , searchingForKey: false
      , panel: {
        keyOpen: false
        ,topicOpen: false
        , idBuilderOpen: true
      }
    };

    this.handleLibraryChange = this.handleLibraryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTopicSearchRequest = this.handleTopicSearchRequest.bind(this);
    this.handleTopicSearchCallback = this.handleTopicSearchCallback.bind(this);
    this.handleTopicTextCallback = this.handleTopicTextCallback.bind(this);
    this.handleTopicTextChange = this.handleTopicTextChange.bind(this);
    this.handleKeySearchRequest = this.handleKeySearchRequest.bind(this);
    this.handleKeySearchCallback = this.handleKeySearchCallback.bind(this);
    this.handleKeyTextCallback = this.handleKeyTextCallback.bind(this);
    this.handleKeyTextChange = this.handleKeyTextChange.bind(this);
    this.toogleTopicPanel = this.toogleTopicPanel.bind(this);
    this.toogleKeyPanel = this.toogleKeyPanel.bind(this);
    this.getContent = this.getContent.bind(this);
    this.getLibrarySelector = this.getLibrarySelector.bind(this);
    this.getSelector = this.getSelector.bind(this);
    this.getIdFormControl = this.getIdFormControl.bind(this);
    this.getIdValueFormControl = this.getIdValueFormControl.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({
      searchLabels: Labels.getSearchLabels(nextProps.languageCode)
      , resultsTableLabels: Labels.getResultsTableLabels(nextProps.languageCode)
      , selectedLibrary: nextProps.IdLibrary
      , selectedLibraryLabel: ""
      , selectedTopic: nextProps.IdTopic
      , selectedTopicValue: nextProps.IdTopicValue
      , selectedKey: nextProps.IdKey
      , selectedKeyValue: nextProps.IdKeyValue
      , searchingForTopic: false
      , searchingForKey: false
      , panel: {
        keyOpen: false
        ,topicOpen: false
      }
    });
  }

  getIdFormControl = (
      type
      , labelType
      , label
      , value
  ) => {
    let searchLabels = this.state.searchLabels.IdParts[type];
    switch(type) {
      case ("BIBLICAL_BOOK_ABBREVIATION"):
        break;
      case ("BIBLICAL_CHAPTER_VERSE"):
        break;
      case "ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "ID_OF_SELECTED_ONTOLOGY_INSTANCE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "KEY_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "KEY_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "ONTOLOGY_TOPIC" :
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      case "USER_TEXT":
        return (
            <div>
              <ControlLabel>{searchLabels[labelType]}</ControlLabel>
              <FormControl
                  type="text"
                  value={value}
                  disabled
              />
            </div>
        );
        break;
      default:
    }
  }


  getIdValueFormControl = (type, label, value) => {
    switch(type) {
      case ("BIBLICAL_BOOK_ABBREVIATION"):
        break;
      case ("BIBLICAL_CHAPTER_VERSE"):
        break;
      case "ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "ID_OF_SELECTED_ONTOLOGY_INSTANCE":
        break;
      case "KEY_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        break;
      case "KEY_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        break;
      case "ONTOLOGY_TOPIC" :
        return (
            <div></div>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "USER_TEXT":
        return (
            <div></div>
        );
        break;
      default:
    }

  }

  getLibrarySelector = (
      type
  ) => {
    let searchLabels = this.state.searchLabels.IdParts[type];
    switch(type) {
      case "ONTOLOGY_TOPIC" :
        return (
        <div>
          <ControlLabel>{searchLabels.library}</ControlLabel>
          <FormControl
              type="text"
              value={this.props.IdLibrary}
              disabled
          />
        </div>
        );
        break;
      default:
        return (
            <ResourceSelector
                title={"Library..."}
                initialValue={this.state.selectedLibrary}
                resources={this.props.libraries}
                changeHandler={this.handleLibraryChange}
                multiSelect={false}
            />
        );
    }
  }

  /**
   * The topic and key parts of an ID have differing content
   * depending on what the form schema is.
   *
   * This function returns a selector that is appropriate
   * for the type passed in.
   *
   * @param type
   */
  getSelector = (
      type
      , labelType
      , value
      , callback
      , textChangeHandler
      , textCallback
  ) => {
    let searchLabel = this.state.searchLabels.IdParts[type];
    switch(type) {
      case ("BIBLICAL_BOOK_ABBREVIATION"):
        break;
      case ("BIBLICAL_CHAPTER_VERSE"):
        break;
      case "ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleKeyPanel}
                  collapsible
              >
                <SearchText
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    callback={callback}
                    searchLabels={this.state.searchLabels}
                    resultsTableLabels={this.state.resultsTableLabels}
                    initialDocType="Biblical"
                />
              </Panel>
            </div>
        );
        break;
      case "ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleTopicPanel}
                  collapsible
              >
            <SearchText
                restServer={this.props.restServer}
                username={this.props.username}
                password={this.props.password}
                callback={callback}
                searchLabels={this.state.searchLabels}
                resultsTableLabels={this.state.resultsTableLabels}
                initialDocType="Liturgical"
            />
              </Panel>
            </div>
        );
        break;
      case "ID_OF_SELECTED_ONTOLOGY_INSTANCE":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleKeyPanel}
                  collapsible
              >
                <SearchOntology
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    callback={callback}
                    languageCode={this.props.languageCode}
                    editor={false}
                />
              </Panel>
            </div>
        );
        break;
      case "KEY_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        break;
      case "KEY_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        break;
      case "ONTOLOGY_TOPIC" :
        return (
            <ControlLabel>{value}</ControlLabel>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleTopicPanel}
                  collapsible
              >
                <SearchText
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    callback={callback}
                    searchLabels={this.state.searchLabels}
                    resultsTableLabels={this.state.resultsTableLabels}
                    initialDocType="Biblical"
                />
              </Panel>
            </div>
        );
        break;
      case "TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleTopicPanel}
                  collapsible
              >
                <SearchText
                    restServer={this.props.restServer}
                    username={this.props.username}
                    password={this.props.password}
                    callback={callback}
                    searchLabels={this.state.searchLabels}
                    resultsTableLabels={this.state.resultsTableLabels}
                    initialDocType="Liturgical"
                />
              </Panel>
            </div>
        );
        break;
      case "USER_TEXT":
        return (
            <div>
              <FormControl
                  type="text"
                  value={this.state.value}
                  placeholder={searchLabel.prompt}
                  onChange={textChangeHandler}
              />
              <Button bsStyle="primary" type="submit" onClick={textCallback}>
                {searchLabel.button}
              </Button>
            </div>
        );
        break;
      default:
    }

  }


  toogleTopicPanel = () => {
    this.setState({
      panel: {
        keyOpen: false
        , topicOpen: ! this.state.panel.topicOpen
      }
    }
    );
  }

  toogleKeyPanel = () => {
    this.setState({
          panel: {
            keyOpen: ! this.state.panel.keyOpen
            , topicOpen: false
          }
        }
    );
  }

  handleLibraryChange = (selection) => {
    this.setState({
      selectedLibrary: selection["value"]
      , selectedLibraryLabel: selection["label"]
    }
    , this.handleSubmit
    );
  };


  handleTopicSearchRequest() {
      this.setState({
        searchingForTopic: true
      });
  };

  handleTopicSearchCallback(id, value) {
    if (id && id.length > 0) {
      if (
           (this.props.IdTopicType === "TOPIC_FROM_ID_OF_SELECTED_BIBLICAL_VERSE")
        || (this.props.IdTopicType === "TOPIC_FROM_ID_OF_SELECTED_LITURGICAL_TEXT")
      ) {
        this.setState({
              searchingForTopic: false
              , selectedTopic: IdManager.getTopic(id)
              , selectedTopicValue: value
              , searchingForKey: false
              , selectedKey: IdManager.getKey(id)
              , selectedKeyValue: ""
              , panel: {keyOpen: false, topicOpen: false}
            }
            , this.handleSubmit
        );
      } else {
        this.setState({
              searchingForTopic: false
              , selectedTopic: id
              , selectedTopicValue: value
              , panel: {keyOpen: false, topicOpen: false}
            }
            , this.handleSubmit
        );
      }
    } else {
      this.setState({
        searchingForTopic: false
        , panel: {keyOpen: false, topicOpen: false}
      });
    }
  };

  handleTopicTextChange = (value) => {
    if (value && value.target && value.target.value && value.target.value.length > 0) {
      this.setState({
            tempTopic: value.target.value
          }
      );
    }
  }

  handleKeyTextChange = (value) => {
    if (value && value.target && value.target.value && value.target.value.length > 0) {
      this.setState({
            tempKey: value.target.value
          }
      );
    }
  }

  handleKeySearchRequest() {
    this.setState({
      searchingForKey: true
    });
  };

  handleKeySearchCallback(id, value) {
    if (id && id.length > 0) {
      this.setState({
        searchingForKey: false
        , selectedKey: id
        , selectedKeyValue: value
        , panel: {keyOpen: false, topicOpen: false}
      }
      , this.handleSubmit
      );
    } else {
      this.setState({
        searchingForKey: false
        , panel: {keyOpen: false, topicOpen: false}
      });
    }
  };

  handleTopicTextCallback = () => {
    this.setState({
          searchingForTopic: false
          , selectedTopic: this.state.tempTopic
          , selectedTopicValue: this.state.tempTopic
          , topicPanelOpen: false
        }
        , this.handleSubmit
    );
  };
  handleKeyTextCallback = () => {
      this.setState({
            searchingForKey: false
            , selectedKey: this.state.tempKey
            , selectedKeyValue: this.state.tempKey
            , keyPanelOpen: false
          }
          , this.handleSubmit
      );
  };

  handleSubmit = () => {
    if (
        (this.state.selectedLibrary.length > 0)
      && (this.state.selectedTopic.length > 0)
        && (this.state.selectedKey.length > 0)
    ) {
      this.props.handleSubmit(
          this.state.selectedLibrary
          , this.state.selectedTopic
          , this.state.selectedTopicValue
          , this.state.selectedKey
          , this.state.selectedKeyValue
      );
    }
  }

  getContent = () => {
    return (
        <div className="container App-id-builder">
          <div className="App-id-builder-header">
          {this.state.searchLabels.IdParts.msg1}
          </div>
          <div></div>
          <Well>
            {this.getLibrarySelector(this.props.IdTopicType)}
          </Well>
          <Well>
            <FormGroup>
            {this.state.selectedTopic.length > 0
              && this.getIdFormControl(
                this.props.IdTopicType
                , "topic"
                , this.state.searchLabels.IdParts[this.props.IdTopicType].topic
                , this.state.selectedTopic
            )
              }
              {this.state.selectedTopic.length > 0
                && this.getIdValueFormControl(
                  this.props.IdTopicType
                  , this.state.searchLabels.IdParts[this.props.IdTopicType].topicValue
                  , this.state.selectedTopicValue
              )
              }
                </FormGroup>
            {this.getSelector(
                    this.props.IdTopicType
                    , "topic"
                    , this.props.IdTopic
                    , this.handleTopicSearchCallback
                    , this.handleTopicTextChange
                    , this.handleTopicTextCallback
                )}
          </Well>
          <Well>
            <FormGroup>
              {this.state.selectedKey.length > 0
              && this.getIdFormControl(
                  this.props.IdKeyType
                  , "key"
                  , this.state.searchLabels.IdParts[this.props.IdKeyType].key
                  , this.state.selectedKey
              )
              }
              {this.state.selectedKey.length > 0
              && this.getIdValueFormControl(
                  this.props.IdKeyType
                  , this.state.searchLabels.IdParts[this.props.IdKeyType].keyValue
                  , this.state.selectedKeyValue
              )
              }
            </FormGroup>
            {this.getSelector(
                  this.props.IdKeyType
                  , "key"
                  , this.props.IdKey
                  , this.handleKeySearchCallback
                  , this.handleKeyTextChange
                  , this.handleKeyTextCallback
              )}
          </Well>
        </div>
    );

  }
  render() {
    return this.getContent();
  }
}

IdBuilder.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , libraries: PropTypes.array.isRequired
  , IdLibrary: PropTypes.string.isRequired
  , ontologyDropdowns: React.PropTypes.object.isRequired
  , IdTopic: React.PropTypes.string.isRequired
  , IdTopicValue: React.PropTypes.string.isRequired
  , IdTopicType: React.PropTypes.string.isRequired
  , IdKey: React.PropTypes.string.isRequired
  , IdKeyValue: React.PropTypes.string.isRequired
  , IdKeyType: React.PropTypes.string.isRequired
  , handleSubmit: React.PropTypes.func.isRequired
  , languageCode: React.PropTypes.string.isRequired
};

export default IdBuilder;