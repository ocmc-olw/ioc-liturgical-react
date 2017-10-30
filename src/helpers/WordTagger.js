import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
  , FormControl
  , FormGroup
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import Server from '../helpers/Server';
import LabelSelector from '../helpers/LabelSelector';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import Spinner from '../helpers/Spinner';
import TreeNode from '../classes/TreeNode';

class WordTagger extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.getDependencyComponent = this.getDependencyComponent.bind(this);
    this.getLabelComponent = this.getLabelComponent.bind(this);
    this.getPartOfSpeechComponent = this.getPartOfSpeechComponent.bind(this);
    this.getPersonComponent = this.getPersonComponent.bind(this);
    this.getNumberComponent = this.getNumberComponent.bind(this);
    this.getVerbNumberComponent = this.getVerbNumberComponent.bind(this);
    this.getCaseComponent = this.getCaseComponent.bind(this);
    this.getGenderComponent = this.getGenderComponent.bind(this);
    this.getTenseComponent = this.getTenseComponent.bind(this);
    this.getVoiceComponent = this.getVoiceComponent.bind(this);
    this.getMoodComponent = this.getMoodComponent.bind(this);


    this.handleDependencyChange = this.handleDependencyChange.bind(this);
    this.handleCaseChange = this.handleCaseChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleGlossChange = this.handleGlossChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleLemmaChange = this.handleLemmaChange.bind(this);
    this.handleMoodChange =this.handleMoodChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handlePartOfSpeechChange = this.handlePartOfSpeechChange.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleTenseChange = this.handleTenseChange.bind(this);
    this.handleVoiceChange = this.handleVoiceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
    this.toggleSubmit = this.toggleSubmit.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.getSubmitMessage = this.getSubmitMessage.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let index = props.index;
    let tokenAnalysis = props.tokenAnalysis;
    let labelCase = Labels.getGrammarTermsCase(props.session.languageCode);
    let labelCategories = Labels.getGrammarTermsCategories(props.session.languageCode);
    let labelGender = Labels.getGrammarTermsGender(props.session.languageCode);
    let labelNumber = Labels.getGrammarTermsNumber(props.session.languageCode);
    let labelPerson = Labels.getGrammarTermsPerson(props.session.languageCode);
    let labelPos = Labels.getGrammarTermsPartsOfSpeech(props.session.languageCode);
    let labelMood = Labels.getGrammarTermsMood(props.session.languageCode);
    let labelTense = Labels.getGrammarTermsTense(props.session.languageCode);
    let labelVoice = Labels.getGrammarTermsVoice(props.session.languageCode);

    // if the index did not change, preserve the previous state
    if (currentState.index && (currentState.index === index)) {
      tokenAnalysis = currentState.tokenAnalysis;
      let propLemma = props.lemma;
      let propGloss = props.gloss;
      let propPos = props.pos;
      let propGrammar = props.grammar;
      let lemma = currentState.lemma;
      let gloss = currentState.gloss;

      let selectedCase = currentState.selectedCase;
      let selectedGender = currentState.selectedGender;
      let selectedMood = currentState.selectedMood;
      let selectedNumber = currentState.selectedNumber;
      let selectedPerson = currentState.selectedPerson;
      let selectedPos = currentState.selectedPos;
      let selectedTense = currentState.selectedTense;
      let selectedVoice = currentState.selectedVoice;
      let theTaggedNode = currentState.theTaggedNode;

      if (selectedPos) {
        if (props.pos) {
          if(props.pos === currentState.propPos) {
            // ignore
          } else {
            selectedPos = props.pos;
          }
        }
      } else {
        selectedPos = props.pos;
      }
      if (lemma) {
        if (props.lemma) {
          if(props.lemma === currentState.lemma) {
            // ignore
          } else {
            lemma = props.lemma;
          }
        }
      } else {
        lemma = props.lemma;
      }
      if (gloss) {
        if (props.gloss) {
          if(props.gloss === currentState.propGloss) {
            // ignore
          } else {
            gloss = props.gloss;
          }
        }
      } else {
        gloss = props.gloss;
      }
      if (props.grammar) {
        let tags = props.grammar.split(".");
        for (let i=1; i < tags.length; i++) {
          let tag = tags[i];
          if (tag === "PRES") {
            tag = "PRS";
          } else if (tag == "PERF") {
            tag = "PRF";
          } else if (tag === "INF") { // treat infinitive as a part of speech
            selectedPos = tag;
            propPos = tag;
          }
          if (labelCase.values[tag]) {
            selectedCase = tag;
          } else if (labelGender.values[tag]) {
            selectedGender = tag;
          } else if (labelNumber.values[tag]) {
            selectedNumber = tag;
          } else if (labelMood.values[tag]) {
            selectedMood = tag;
          } else if (labelPerson.values[tag]) {
            selectedPerson = tag;
          } else if (labelTense.values[tag]) {
            selectedTense = tag;
          } else if (labelVoice.values[tag]) {
            selectedVoice = tag;
          }
        }
      }

      let submitDisabled = true;
      if (currentState.theTaggedNode) {
        submitDisabled = currentState.theTaggedNode.notComplete();
      }

      return (
          {
            labels: {
              thisClass: Labels.getWordTaggerLabels(props.session.languageCode)
              , messages: Labels.getMessageLabels(props.session.languageCode)
              , grammar: {
                case: labelCase
                , categories: labelCategories
                , gender: labelGender
                , mood: labelMood
                , number: labelNumber
                , person: labelPerson
                , pos: labelPos
                , tense: labelTense
                , voice: labelVoice
              }
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: Labels.getMessageLabels(props.session.languageCode).initial
            , index: index
            , selectedCase: selectedCase
            , selectedGender: selectedGender
            , selectedMood: selectedMood
            , selectedNumber: selectedNumber
            , selectedPerson: selectedPerson
            , selectedPos: selectedPos
            , selectedTense: selectedTense
            , selectedVoice: selectedVoice
            , selectedLabel: currentState.selectedLabel ? currentState.selectedLabel : ""
            , dependency: currentState.dependency ? currentState.dependency : ""
            , lemma: lemma
            , gloss: gloss
            , propLemma: propLemma
            , propGloss: propGloss
            , propPos: propPos
            , propGrammar: propGrammar
            , tokenAnalysis: tokenAnalysis
            , theTaggedNode: theTaggedNode
            , submitDisabled: submitDisabled
            , updatingData: currentState.updatingData
            , dataUpdated: currentState.dataUpdated
          }
      )
    } else {
      return (
          {
            labels: {
              thisClass: Labels.getWordTaggerLabels(this.props.session.languageCode)
              , messages: Labels.getMessageLabels(this.props.session.languageCode)
              , grammar: {
                case: labelCase
                , categories: labelCategories
                , gender: labelGender
                , mood: labelMood
                , number: labelNumber
                , person: labelPerson
                , pos: labelPos
                , tense: labelTense
                , voice: labelVoice
              }
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: Labels.getMessageLabels(this.props.session.languageCode).initial
            , updatingData: false
            , dataUpdated: false
            , index: index
            , selectedCase: tokenAnalysis.gCase ? tokenAnalysis.gCase : ""
            , selectedGender: tokenAnalysis.gender ? tokenAnalysis.gender : ""
            , selectedMood: tokenAnalysis.mood ? tokenAnalysis.mood : ""
            , selectedNumber: tokenAnalysis.number ? tokenAnalysis.number : ""
            , selectedPerson: tokenAnalysis.person ? tokenAnalysis.person : ""
            , selectedPos: tokenAnalysis.pos ? tokenAnalysis.pos : ""
            , selectedTense: tokenAnalysis.tense ? tokenAnalysis.tense : ""
            , selectedVoice: tokenAnalysis.voice ? tokenAnalysis.voice : ""
            , selectedLabel: tokenAnalysis.label ? tokenAnalysis.label : ""
            , lemma: tokenAnalysis.lemma ? tokenAnalysis.lemma : ""
            , gloss: tokenAnalysis.gloss ? tokenAnalysis.gloss : ""
            , dependency: tokenAnalysis.dependsOn ? tokenAnalysis.dependsOn : "0"
            , grammar: tokenAnalysis.grammar ? tokenAnalysis.grammar : ""
            , tokenAnalysis: tokenAnalysis
          }
      )

    }
  }


  handleGlossChange =  (event) => {
    this.setState({
      gloss: event.target.value
    }, this.toggleSubmit);
  }

  handleLemmaChange =  (event) => {
    this.setState({
      lemma: event.target.value
    }, this.toggleSubmit);
  }

  // TODO: parm not right
  handleDependencyChange = (selection) => {
      this.setState({
        dependency: selection["value"]
      }, this.toggleSubmit);
  }

  handleLabelChange =  (selection) => {
    this.setState({
      selectedLabel: selection["value"]
    }, this.toggleSubmit);
  }

  handlePartOfSpeechChange =  (selection) => {
    this.setState({
      selectedPos: selection["value"]
    }, this.toggleSubmit);
  }

  handlePersonChange =  (selection) => {
    this.setState({
      selectedPerson: selection["value"]
    }, this.toggleSubmit);
  }

  handleNumberChange =  (selection) => {
      this.setState({
        selectedNumber: selection["value"]
      }, this.toggleSubmit);
  }

  handleCaseChange =  (selection) => {
    this.setState({
      selectedCase: selection["value"]
    }, this.toggleSubmit);
  }

  handleGenderChange =  (selection) => {
    this.setState({
      selectedGender: selection["value"]
    }, this.toggleSubmit);
  }

  handleTenseChange =  (selection) => {
    this.setState({
      selectedTense: selection["value"]
    }, this.toggleSubmit);
  }

  handleMoodChange =  (selection) => {
    this.setState({
      selectedMood: selection["value"]
    }, this.toggleSubmit);
  }

  handleVoiceChange =  (selection) => {
      this.setState({
        selectedVoice: selection["value"]
      }, this.toggleSubmit);
  }

  getDependencyComponent = () => {
    let theIndex = parseInt(this.props.index);
    let result = {};
    let values = {
      "0": "Root"
    };
    for (let i=0; i < this.props.tokens.length; i++ ) {
      if (i !== theIndex) {
        values[i] = (i+1) + ": " + this.props.tokens[i];
      }
    }
    result.title = "Depends On"
    result.values = values;
    return (
        <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
          <LabelSelector
              languageCode={this.props.session.languageCode}
              labels={result}
              initialValue={this.state.dependency ? this.state.dependency : ""}
              changeHandler={this.handleDependencyChange}
          />
        </div>
    );
  }

  getLabelComponent = () => {
    return (
        <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
          <LabelSelector
              languageCode={this.props.session.languageCode}
              labels={this.state.labels.grammar.categories}
              initialValue={this.state.selectedLabel}
              changeHandler={this.handleLabelChange}
          />
        </div>
    );
  }
  getPartOfSpeechComponent =  () => {
    return (
        <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
          <LabelSelector
              languageCode={this.props.session.languageCode}
              labels={this.state.labels.grammar.pos}
              initialValue={this.state.selectedPos}
              changeHandler={this.handlePartOfSpeechChange}
          />
        </div>
    );
  }
  getPersonComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Person">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.person}
                initialValue={this.state.selectedPerson}
                changeHandler={this.handlePersonChange}
            />
          </div>
      );
    } else {
      // if (this.state.selectedPerson) {
      //   this.handlePersonChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }
  getNumberComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
    ){
        return (
            <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Number">
              <LabelSelector
                  languageCode={this.props.session.languageCode}
                  labels={this.state.labels.grammar.number}
                  initialValue={this.state.selectedNumber}
                  changeHandler={this.handleNumberChange}
              />
            </div>
        );
    } else {
      return (<span></span>);
    }
  }

  getVerbNumberComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
        || this.state.selectedPos.startsWith("PART")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Number">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.number}
                initialValue={this.state.selectedNumber}
                changeHandler={this.handleNumberChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }

  getCaseComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
        || this.state.selectedPos.startsWith("PART")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.case}
                initialValue={this.state.selectedCase}
                changeHandler={this.handleCaseChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }
  getGenderComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
        || this.state.selectedPos.startsWith("PART")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Gender">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.gender}
                initialValue={this.state.selectedGender}
                changeHandler={this.handleGenderChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }
  getTenseComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
        || this.state.selectedPos.startsWith("INF")
        || this.state.selectedPos.startsWith("PART")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Tense">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.tense}
                initialValue={this.state.selectedTense}
                changeHandler={this.handleTenseChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }

  getVoiceComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
        || this.state.selectedPos.startsWith("INF")
        || this.state.selectedPos.startsWith("PART")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Voice">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.voice}
                initialValue={this.state.selectedVoice}
                changeHandler={this.handleVoiceChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }
  getMoodComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Mood">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.mood}
                initialValue={this.state.selectedMood}
                changeHandler={this.handleMoodChange}
            />
          </div>
      );
    } else {
      return (<span></span>);
    }
  }

  submitUpdate = () => {
    let path = this.props.session.uiSchemas.getHttpPutPathForSchema(
        this.state.tokenAnalysis._valueSchemaId
    );
    Server.restPutSchemaBasedForm(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , path
        , this.state.tokenAnalysis
        , undefined
        , this.handleValueUpdateCallback
    )
    // respond back to the caller
    this.props.callBack(
        this.state.theTaggedNode
    );
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let tokenAnalysis = this.state.tokenAnalysis;
    let theTaggedNode = this.state.theTaggedNode;
    tokenAnalysis.dependsOn = this.state.dependency;
    tokenAnalysis.lemma = theTaggedNode.lemma;
    tokenAnalysis.gloss = theTaggedNode.gloss;
    tokenAnalysis.label = theTaggedNode.label;
    tokenAnalysis.gCase = theTaggedNode.case;
    tokenAnalysis.gender = theTaggedNode.gender;
    tokenAnalysis.mood = theTaggedNode.mood;
    tokenAnalysis.number = theTaggedNode.number;
    tokenAnalysis.person = theTaggedNode.person;
    tokenAnalysis.pos = theTaggedNode.pos;
    tokenAnalysis.tense = theTaggedNode.tense;
    tokenAnalysis.voice = theTaggedNode.voice;
    tokenAnalysis.grammar = theTaggedNode.grammar;

    this.setState({
      updatingData: true
      , tokenAnalysis: tokenAnalysis
    }, this.submitUpdate);
  }

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
        , updatingData: false
        , dataUpdated: true
      });
    }
  }


  toggleSubmit = () => {
    let theNode = new TreeNode(
        this.props.index
        , this.props.token
        , this.state.lemma
        , this.state.gloss
        , this.state.dependency
        , this.state.selectedLabel
        , this.state.selectedCase
        , this.state.selectedGender
        , this.state.selectedMood
        , this.state.selectedNumber
        , this.state.selectedPerson
        , this.state.selectedPos
        , this.state.selectedTense
        , this.state.selectedVoice
    );
    if (theNode.isComplete()) {
      this.setState({
        theTaggedNode: theNode
        , submitDisabled: false
      });
    } else {
      this.setState({submitDisabled: true})
    }
  }

  getSubmitMessage = () => {
    if (this.state.updatingData) {
     return (
         <Spinner message={this.state.labels.messages.updating}/>
     );
    } else if (this.state.dataUpdated) {
      return (
          <span>
            <FontAwesome
              name={this.state.messageIcon}
            />
            {this.state.labels.messages.updated}
          </span>
      )
    } else {
      return (<span></span>);
    }


  }
  // ἐρχομενός	part sg pres mp masc nom
  /**
   * Order:
   * POS
   * ADJ, ART, PRON, NOUN: gender / number / case
   * PART: tense, voice, gender, number, case
   * VERB: person / number / tense / voice / mood
   */

  render() {
        return (
            <form onSubmit={this.handleSubmit}>
              <div className="container">
                <div>
                  <div className="row">
                    <div className="col-sm-12 col-md-12 col-lg-12 resourceSelectorPrompt">{this.state.labels.thisClass.instructions}</div>
                    <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
                      {parseInt(this.props.index)+1} {this.props.token}
                    </div>
                  </div>
                </div>
              </div>
              <FormGroup
                  controlId="AppTreeNodeBuilder"
              >
                <div className="container">
                  <div>
                    <div className="row">
                      {this.getPartOfSpeechComponent()}
                      {this.getDependencyComponent()}
                      {this.getLabelComponent()}
                      {this.getPersonComponent()}
                      {this.getVerbNumberComponent()}
                      {this.getTenseComponent()}
                      {this.getVoiceComponent()}
                      {this.getMoodComponent()}
                      {this.getGenderComponent()}
                      {this.getNumberComponent()}
                      {this.getCaseComponent()}
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
                        <div className="resourceSelectorPrompt">{this.state.labels.thisClass.lemma}</div>
                        <FormControl
                            className="App App-WordTagger-Lemma"
                            type="text"
                            value={this.state.lemma}
                            placeholder="Enter lemma"
                            onChange={this.handleLemmaChange}
                        />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
                        <div className="resourceSelectorPrompt">{this.state.labels.thisClass.gloss}</div>
                        <FormControl
                            className="App App-WordTagger-Gloss"
                            type="text"
                            value={this.state.gloss}
                            placeholder="Enter gloss"
                            onChange={this.handleGlossChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </FormGroup>
              <div className="row">
                <div className="col-sm-2 col-md-2 col-lg-2  App-Label-Selector-Button">
                  <Button
                    bsStyle="primary"
                    type="submit"
                    onClick={this.handleSubmit}
                    disabled={this.state.submitDisabled}
                    >
                    {Labels.getMessageLabels(this.props.session.languageCode).submit}
                  </Button>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4  App-Label-Selector-Retrieving">
                  {this.getSubmitMessage()}
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6  App-Label-Selector-Empty">
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3 col-md-3 col-lg-3  App-Label-Selector-Help">
                  <a
                      href="http://nlp.perseus.tufts.edu/syntax/treebank/guidelines_treebank2.html"
                      target="_blank"
                  >{this.state.labels.thisClass.help}</a>
                </div>
                <div className="col-sm-3 col-md-3 col-lg-3  App-Label-Selector-Help">
                  <a
                      href="http://www.perseids.org/tools/arethusa/app/#/perseids?chunk=31&doc=4971"
                      target="_blank"
                  >{this.state.labels.thisClass.examples}</a>
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4  App-Label-Selector-Help">
                  <a
                      href={"http://www.oxfordlearnersdictionaries.com/definition/english/"
                      + this.state.gloss
                      + "_1?isEntryInOtherDict=false"}
                      target="_blank"
                  >{this.state.labels.thisClass.oxford}</a>
                </div>
                <div className="col-sm-3 col-md-3 col-lg-3  App-Label-Selector-Help">
                </div>
              </div>
            </form>
        )
  }
}

WordTagger.propTypes = {
    session: PropTypes.object.isRequired
    , index: PropTypes.string.isRequired
    , tokens: PropTypes.array.isRequired
    , token: PropTypes.string.isRequired
    , lemma: PropTypes.string
    , gloss: PropTypes.string
    , pos: PropTypes.string
    , grammar: PropTypes.string
    , callBack: PropTypes.func.isRequired
    , tokenAnalysis: PropTypes.object.isRequired
};

WordTagger.defaultProps = {
  lemma: ""
  , gloss: ""
  , pos: ""
  , grammar: ""
};

export default WordTagger;
