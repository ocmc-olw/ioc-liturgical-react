import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
  , ControlLabel
  , FormControl
  , FormGroup
  , Well
} from 'react-bootstrap';

import LabelSelector from '../helpers/LabelSelector';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
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

  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let index = props.index;
    let labelCase = Labels.getGrammarTermsCase(props.languageCode);
    let labelCategories = Labels.getGrammarTermsCategories(props.languageCode);
    let labelGender = Labels.getGrammarTermsGender(props.languageCode);
    let labelNumber = Labels.getGrammarTermsNumber(props.languageCode);
    let labelPerson = Labels.getGrammarTermsPerson(props.languageCode);
    let labelPos = Labels.getGrammarTermsPartsOfSpeech(props.languageCode);
    let labelMood = Labels.getGrammarTermsMood(props.languageCode);
    let labelTense = Labels.getGrammarTermsTense(props.languageCode);
    let labelVoice = Labels.getGrammarTermsVoice(props.languageCode);

    // if the index did not change, preserve the previous state
    if (currentState.index && (currentState.index === index)) {
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

      if (selectedPos) {
        if (props.pos) {
          if(props.pos === this.state.propPos) {
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
          if(props.lemma === this.state.lemma) {
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
          if(props.gloss === this.state.propGloss) {
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
          }
          if (Object.keys(labelCase.values).includes(tag)) {
            selectedCase = tag;
          } else if (Object.keys(labelGender.values).includes(tag)) {
            selectedGender = tag;
          } else if (Object.keys(labelNumber.values).includes(tag)) {
            selectedNumber = tag;
          } else if (Object.keys(labelMood.values).includes(tag)) {
            selectedMood = tag;
          } else if (Object.keys(labelPerson.values).includes(tag)) {
            selectedPerson = tag;
          } else if (Object.keys(labelTense.values).includes(tag)) {
            selectedTense = tag;
          } else if (Object.keys(labelVoice.values).includes(tag)) {
            selectedVoice = tag;
          }
        }
      }


      return (
          {
            labels: {
              thisClass: Labels.getWordTaggerLabels(props.languageCode)
              , messages: Labels.getMessageLabels(props.languageCode)
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
            , message: Labels.getMessageLabels(props.languageCode).initial
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
          }
      )
    } else {
      return (
          {
            labels: {
              thisClass: Labels.getWordTaggerLabels(this.props.languageCode)
              , messages: Labels.getMessageLabels(this.props.languageCode)
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
            , message: Labels.getMessageLabels(this.props.languageCode).initial
            , index: index
            , selectedCase: ""
            , selectedGender: ""
            , selectedMood: ""
            , selectedNumber: ""
            , selectedPerson: ""
            , selectedPos: ""
            , selectedTense: ""
            , selectedVoice: ""
            , selectedLabel: ""
            , lemma: ""
            , gloss: ""
            , dependency: ""
            , grammar: ""
          }
      )

    }
  }


  handleGlossChange =  (event) => {
    this.setState({
      gloss: event.target.value
    });
  }

  handleLemmaChange =  (event) => {
    this.setState({
      lemma: event.target.value
    });
  }

  // TODO: parm not right
  handleDependencyChange = (selection) => {
      this.setState({
        dependency: selection["value"]
      });
  }

  handleLabelChange =  (selection) => {
    this.setState({
      selectedLabel: selection["value"]
    });
  }

  handlePartOfSpeechChange =  (selection) => {
    console.log(`handlePartOfSpeechChange.selection.value = ${selection["value"]}`)
    this.setState({
      selectedPos: selection["value"]
    });
  }

  handlePersonChange =  (selection) => {
    this.setState({
      selectedPerson: selection["value"]
    });
  }

  handleNumberChange =  (selection) => {
      this.setState({
        selectedNumber: selection["value"]
      });
  }

  handleCaseChange =  (selection) => {
    this.setState({
      selectedCase: selection["value"]
    });
  }

  handleGenderChange =  (selection) => {
    this.setState({
      selectedGender: selection["value"]
    });
  }

  handleTenseChange =  (selection) => {
    this.setState({
      selectedTense: selection["value"]
    });
  }

  handleMoodChange =  (selection) => {
    this.setState({
      selectedMood: selection["value"]
    });
  }

  handleVoiceChange =  (selection) => {
      this.setState({
        selectedVoice: selection["value"]
      });
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
        <LabelSelector
            languageCode={this.props.languageCode}
            labels={result}
            initialValue={this.state.dependency ? this.state.dependency : ""}
            changeHandler={this.handleDependencyChange}
        />
    );
  }

  getLabelComponent = () => {
    return (
        <LabelSelector
            languageCode={this.props.languageCode}
            labels={this.state.labels.grammar.categories}
            initialValue={this.state.selectedLabel}
            changeHandler={this.handleLabelChange}
        />
    );
  }
  getPartOfSpeechComponent =  () => {
    return (
        <LabelSelector
            languageCode={this.props.languageCode}
            labels={this.state.labels.grammar.pos}
            initialValue={this.state.selectedPos}
            changeHandler={this.handlePartOfSpeechChange}
        />
    );
  }
  getPersonComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.person}
              initialValue={this.state.selectedPerson}
              changeHandler={this.handlePersonChange}
          />
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
            <LabelSelector
                languageCode={this.props.languageCode}
                labels={this.state.labels.grammar.number}
                initialValue={this.state.selectedNumber}
                changeHandler={this.handleNumberChange}
            />
        );
    } else {
      // if (this.state.selectedNumber) {
      //   this.handleNumberChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }

  getCaseComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.case}
              initialValue={this.state.selectedCase}
              changeHandler={this.handleCaseChange}
          />
      );
    } else {
      // if (this.state.selectedCase) {
      //   this.handleCaseChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }
  getGenderComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.gender}
              initialValue={this.state.selectedGender}
              changeHandler={this.handleGenderChange}
          />
      );
    } else {
      // if (this.state.selectedGender) {
      //   this.handleGenderChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }
  getTenseComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.tense}
              initialValue={this.state.selectedTense}
              changeHandler={this.handleTenseChange}
          />
      );
    } else {
      // if (this.state.selectedTense) {
      //   this.handleTenseChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }

  getVoiceComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.voice}
              initialValue={this.state.selectedVoice}
              changeHandler={this.handleVoiceChange}
          />
      );
    } else {
      // if (this.state.selectedVoice) {
      //   this.handleVoiceChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }
  getMoodComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={this.state.labels.grammar.mood}
              initialValue={this.state.selectedMood}
              changeHandler={this.handleMoodChange}
          />
      );
    } else {
      // if (this.state.selectedMood) {
      //   this.handleMoodChange("{value: ''}");
      // }
      return (<span></span>);
    }
  }

  handleSubmit = (event) => {

      event.preventDefault();

     let theNode = new TreeNode(
         this.props.index
         , this.props.token
         , this.state.lemma
         , this.state.gloss
         , this.state.dependsOn
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

    this.props.callBack(
      theNode
    );
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
                      <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
                        {this.getPartOfSpeechComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
                        {this.getDependencyComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-POS">
                        {this.getLabelComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Person">
                        {this.getPersonComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Tense">
                        {this.getTenseComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Voice">
                        {this.getVoiceComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Mood">
                        {this.getMoodComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Gender">
                        {this.getGenderComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Number">
                        {this.getNumberComponent()}
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
                        {this.getCaseComponent()}
                      </div>
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
              <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
              <Button
                bsStyle="primary"
                type="submit"
                onClick={this.handleSubmit}
                >
                {Labels.getMessageLabels(this.props.languageCode).submit}
              </Button>
              </div>
            </form>
        )
  }
}

WordTagger.propTypes = {
    languageCode: PropTypes.string.isRequired
    , index: PropTypes.string.isRequired
    , tokens: PropTypes.array.isRequired
    , token: PropTypes.string.isRequired
    , lemma: PropTypes.string
    , gloss: PropTypes.string
    , pos: PropTypes.string
    , grammar: PropTypes.string
    , callBack: PropTypes.func.isRequired
};

WordTagger.defaultProps = {
  lemma: ""
  , gloss: ""
  , pos: ""
  , grammar: ""
};

export default WordTagger;
