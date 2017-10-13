import React from 'react';
import PropTypes from 'prop-types';

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

class IdBuilder extends React.Component {

  constructor(props) {
    super(props);
    this.state = this.setTheState(props, "");

    this.handleLibraryChange = this.handleLibraryChange.bind(this);
    this.handleBiblicalBooksChange = this.handleBiblicalBooksChange.bind(this);
    this.handleBiblicalChaptersChange = this.handleBiblicalChaptersChange.bind(this);
    this.handleBiblicalVersesChange = this.handleBiblicalVersesChange.bind(this);
    this.handleBiblicalSubversesChange = this.handleBiblicalSubversesChange.bind(this);
    this.handleBiblicalChapterVerseSelection = this.handleBiblicalChapterVerseSelection.bind(this);
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
    this.setTheState = this.setTheState.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state.selectedLibrary);
  }

  setTheState = (props, IdLibrary) => {
    return (
        {
          searchLabels: Labels.getSearchLabels(props.session.languageCode)
          , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
          , selectedLibrary: props.IdLibrary
          , selectedLibraryLabel: ""
          , selectedTopic: props.IdTopic
          , tempTopic: ""
          , selectedTopicValue: props.IdTopicValue
          , selectedKey: props.IdKey
          , tempKey: ""
          , selectedKeyValue: props.IdKeyValue
          , selectedSeq: ""
          , selectedBiblicalBook: ""
          , selectedBiblicalChapter: ""
          , selectedBiblicalVerse: ""
          , selectedBiblicalSubverse: "*"
          , searchingForTopic: false
          , searchingForKey: false
          , panel: {
              keyOpen: false
              ,topicOpen: false
              , idBuilderOpen: true
            }
        }
    )
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
      case ("BIBLICAL_CHAPTER_VERSE"):
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
      case "NOTE_USING_ID_OF_SELECTED_TEXT":
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
      case "TIMESTAMP" :
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
              <ControlLabel>{label}</ControlLabel>
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
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case ("BIBLICAL_CHAPTER_VERSE"):
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "ID_OF_SELECTED_BIBLICAL_VERSE":
        return (
            <div>
              <ControlLabel>{label}</ControlLabel>
              <Well>{value}</Well>
            </div>
        );
        break;
      case "NOTE_USING_ID_OF_SELECTED_TEXT":
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
        return (
            <div></div>
        );
    }

  }

  getLibrarySelector = (
      type
  ) => {
    let searchLabels = this.state.searchLabels.IdParts[type];
    switch(type) {
      case "NOTE_USING_ID_OF_SELECTED_TEXT" :
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
                resources={this.props.session.userInfo.domains["author"]}
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
      , callback
      , textValue
      , textChangeHandler
      , textCallback
  ) => {
    let searchLabel = this.state.searchLabels.IdParts[type];
    switch(type) {
      case ("BIBLICAL_BOOK_ABBREVIATION"):
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleTopicPanel}
                  collapsible
              >
                <ResourceSelector
                    title={searchLabel.topic}
                    initialValue={this.state.selectedTopic}
                    resources={this.props.biblicalBooksDropdown}
                    changeHandler={this.handleBiblicalBooksChange}
                    multiSelect={false}
                />
              </Panel>
            </div>
        );
        break;
      case ("BIBLICAL_CHAPTER_VERSE"):
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={this.state.panel[labelType+"Open"]}
                  onSelect={this.toogleKeyPanel}
                  collapsible
              >
                <ResourceSelector
                    title={searchLabel.chapter}
                    initialValue={this.state.selectedBiblicalChapter}
                    resources={this.props.biblicalChaptersDropdown}
                    changeHandler={this.handleBiblicalChaptersChange}
                    multiSelect={false}
                />
                <ResourceSelector
                    title={searchLabel.verse}
                    initialValue={this.state.selectedBiblicalVerse}
                    resources={this.props.biblicalVersesDropdown}
                    changeHandler={this.handleBiblicalVersesChange}
                    multiSelect={false}
                />
                <ResourceSelector
                    title={searchLabel.versePart}
                    initialValue={this.state.selectedBiblicalSubverse}
                    resources={this.props.biblicalSubversesDropdown}
                    changeHandler={this.handleBiblicalSubversesChange}
                    multiSelect={false}
                />
              </Panel>
            </div>
        );
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
                    session={this.props.session}
                    callback={callback}
                    searchLabels={this.state.searchLabels}
                    resultsTableLabels={this.state.resultsTableLabels}
                    initialDocType="Biblical"
                />
              </Panel>
            </div>
        );
        break;
      case "NOTE_USING_ID_OF_SELECTED_TEXT":
        return (
            <div>
              <Panel
                  header={searchLabel.prompt}
                  eventKey={type+labelType}
                  expanded={true}
                  onSelect={this.toogleTopicPanel}
                  collapsible
              >
                <SearchText
                    session={this.props.session}
                    callback={callback}
                    searchLabels={this.state.searchLabels}
                    resultsTableLabels={this.state.resultsTableLabels}
                    initialDocType="Liturgical"
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
                session={this.props.session}
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
                    session={this.props.session}
                    callback={callback}
                    editor={false}
                    initialType={this.props.initialOntologyType}
                    fixedType={true}
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
            <div></div>
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
                <ControlLabel>{searchLabel.key}</ControlLabel>
                <SearchText
                    session={this.props.session}
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
                    session={this.props.session}
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
                  value={textValue}
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
    this.props.handleLibraryChange(selection["value"]);
    this.setState({
      selectedLibrary: selection["value"]
      , selectedLibraryLabel: selection["label"]
    }
    , this.handleSubmit
    );
  };

  handleBiblicalBooksChange = (selection) => {
      this.props.handleTopicChange(selection["value"], selection["label"]);
        this.setState({
              searchingForTopic: false
              , selectedTopic: selection["value"]
              , selectedTopicValue: selection["label"]
              , selectedSeq: ""
              , panel: {keyOpen: false, topicOpen: false}
            }
            , this.handleSubmit
        );
  };

  handleBiblicalChaptersChange = (selection) => {
    this.setState({
          selectedBiblicalChapter: selection["value"]
          , selectedBiblicalChapterLabel: selection["label"]
        }
        , this.handleBiblicalChapterVerseSelection
    );
  };


  handleBiblicalVersesChange = (selection) => {
    this.setState({
          selectedBiblicalVerse: selection["value"]
          , selectedBiblicalVerseLabel: selection["label"]
        }
        , this.handleBiblicalChapterVerseSelection
    );
  };

  handleBiblicalSubversesChange = (selection) => {
    this.setState({
          selectedBiblicalSubverse: selection["value"]
          , selectedBiblicalSubverseLabel: selection["label"]
        }
        , this.handleBiblicalChapterVerseSelection
    );
  };

  handleBiblicalChapterVerseSelection = () => {
    if (
        (this.state.selectedBiblicalChapter.length > 0)
        && (this.state.selectedBiblicalVerse.length > 0)
        && (this.state.selectedBiblicalSubverse.length > 0)
    ) {
      let theKey = this.state.selectedBiblicalChapter
          + ":"
          + this.state.selectedBiblicalVerse;
      if (this.state.selectedBiblicalSubverse !== "*") {
        theKey = theKey + this.state.selectedBiblicalSubverse;
      }
      this.setState({
            searchingForKey: false
            , selectedKey: theKey
            , selectedKeyValue: theKey
            , keyPanelOpen: false
          }
          , this.handleSubmit
      );
    }
  }


  handleTopicSearchRequest() {
      this.setState({
        searchingForTopic: true
      });
  };

  handleTopicSearchCallback(id, value, seq) {
    if (id && id.length > 0) {
      this.props.handleTopicChange(id, value);
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
              , selectedSeq: seq
              , panel: {keyOpen: false, topicOpen: false}
            }
            , this.handleSubmit
        );
      } else {
        this.setState({
              searchingForTopic: false
              , selectedTopic: id
              , selectedTopicValue: value
              , selectedSeq: seq
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
    if (
        value
        && value.target
        && value.target.value
        && value.target.value.length > 0
    ) {
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

  handleKeySearchCallback(id, value, seq) {
    if (id && id.length > 0) {
      let theValue = value;
      if (theValue === undefined) {
        theValue = id;
      }
      this.setState({
        searchingForKey: false
        , selectedKey: id
        , selectedKeyValue: theValue
        , selectedSeq: seq
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
          , this.state.selectedSeq
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
            {this.getIdFormControl(
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
                    , this.handleTopicSearchCallback
                    , this.state.IdTopicValue
                    , this.handleTopicTextChange
                    , this.handleTopicTextCallback
                )}
          </Well>
          <Well>
            <FormGroup>
              {this.getIdFormControl(
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
                  , this.handleKeySearchCallback
                  , this.state.tempKey
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
  session: PropTypes.object.isRequired
  , IdLibrary: PropTypes.string.isRequired
  , biblicalBooksDropdown: PropTypes.array.isRequired
  , biblicalChaptersDropdown: PropTypes.array.isRequired
  , biblicalVersesDropdown: PropTypes.array.isRequired
  , biblicalSubversesDropdown: PropTypes.array.isRequired
  , IdTopic: PropTypes.string.isRequired
  , IdTopicValue: PropTypes.string.isRequired
  , IdTopicType: PropTypes.string.isRequired
  , IdKey: PropTypes.string.isRequired
  , IdKeyValue: PropTypes.string.isRequired
  , IdKeyType: PropTypes.string.isRequired
  , handleLibraryChange: PropTypes.func.isRequired
  , handleTopicChange: PropTypes.func.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , initialOntologyType: PropTypes.string.isRequired
};

export default IdBuilder;