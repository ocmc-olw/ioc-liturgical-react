import React from 'react';
import PropTypes from 'prop-types';
import {
  Button
  , FormControl
  , FormGroup
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { get } from 'lodash';

import TreeNode from '../classes/TreeNode';

import LabelSelector from '../helpers/LabelSelector';
import MessageIcons from '../helpers/MessageIcons';
import Server from '../helpers/Server';
import Spinner from '../helpers/Spinner';
import UiSchemas from "../classes/UiSchemas";

/**
 * Provides a means for the user to set the tags for a token.
 * A token can be a word or a punctuation mark.
 * The tags initialize using information from the database via the rest api.
 * The user then has the option of manually setting tag values,
 * or if the user selects an analysis from an external source,
 * e.g. Perseus (displayed via the Grammar component),
 * the selected values are copied and become parms to the TokenTagger.
 * The new values are saved back to the database.
 *
 * Note: the grammar tags are set by TreeNode.getGrammar()
 */
class TokenTagger extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.getAspectComponent = this.getAspectComponent.bind(this);
    this.getCaseComponent = this.getCaseComponent.bind(this);
    this.getDependencyComponent = this.getDependencyComponent.bind(this);
    this.getGenderComponent = this.getGenderComponent.bind(this);
    this.getLabelComponent = this.getLabelComponent.bind(this);
    this.getMoodComponent = this.getMoodComponent.bind(this);
    this.getNumberComponent = this.getNumberComponent.bind(this);
    this.getPartOfSpeechComponent = this.getPartOfSpeechComponent.bind(this);
    this.getPersonComponent = this.getPersonComponent.bind(this);
    this.getReferentComponent = this.getReferentComponent.bind(this);
    this.getTenseComponent = this.getTenseComponent.bind(this);
    this.getVerbNumberComponent = this.getVerbNumberComponent.bind(this);
    this.getVerbFormComponent = this.getVerbFormComponent.bind(this);
    this.getVoiceComponent = this.getVoiceComponent.bind(this);

    this.handleAspectChange = this.handleAspectChange.bind(this);
    this.handleReferentChange = this.handleReferentChange.bind(this);
    this.handleDependencyChange = this.handleDependencyChange.bind(this);
    this.handleCaseChange = this.handleCaseChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleGlossChange = this.handleGlossChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleLemmaChange = this.handleLemmaChange.bind(this);
    this.handleMoodChange = this.handleMoodChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handlePartOfSpeechChange = this.handlePartOfSpeechChange.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleTenseChange = this.handleTenseChange.bind(this);
    this.handleVerbFormChange = this.handleVerbFormChange.bind(this);
    this.handleVoiceChange = this.handleVoiceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitUpdate = this.submitUpdate.bind(this);
    this.toggleSubmit = this.toggleSubmit.bind(this);
    this.handleValueUpdateCallback = this.handleValueUpdateCallback.bind(this);
    this.getSubmitMessage = this.getSubmitMessage.bind(this);
    this.normalizeIndex = this.normalizeIndex.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  };

  setTheState = (props, currentState) => {
    let index = props.index;
    let tokenAnalysis = props.tokenAnalysis;

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    let labelGrammarTermsTitles = labels[labelTopics.grammarTermsTitles];
    let labelAspect = labels[labelTopics.UDtagsAspect];
    let labelCase = labels[labelTopics.UDtagsCase]; // grammarTermsCaseValues];
    let labelCategories = labels[labelTopics.UDtagsDepRel]; //grammarTermsCategoryValues];
    let labelGender = labels[labelTopics.UDtagsGender]; //grammarTermsGenderValues];
    let labelNumber = labels[labelTopics.UDtagsNumber]; //grammarTermsNumberValues];
    let labelPerson = labels[labelTopics.UDtagsPerson]; //grammarTermsPersonValues];
    let labelPos = labels[labelTopics.UDtagsPos]; //.grammarTermsPosValues];
    let labelMood = labels[labelTopics.UDtagsMood]; //grammarTermsMoodValues];
    let labelTense = labels[labelTopics.UDtagsTense]; //grammarTermsTenseValues];
    let labelVerbForm = labels[labelTopics.UDtagsVerbForm];
    let labelVoice = labels[labelTopics.UDtagsVoice]; //grammarTermsVoiceValues];
    let grammar = {
      case: {title: labelGrammarTermsTitles.case, values: labelCase}
      , categories: {title: labelGrammarTermsTitles.categories, values: labelCategories}
      , aspect: {title: labelGrammarTermsTitles.aspect, values: labelAspect}
      , gender: {title: labelGrammarTermsTitles.gender, values: labelGender}
      , mood: {title: labelGrammarTermsTitles.mood, values: labelMood}
      , number: {title: labelGrammarTermsTitles.number, values: labelNumber}
      , person: {title: labelGrammarTermsTitles.person, values: labelPerson}
      , pos: {title: labelGrammarTermsTitles.pos, values: labelPos}
      , tense: {title: labelGrammarTermsTitles.tense, values: labelTense}
      , verbForm: {title: labelGrammarTermsTitles.verbForm, values: labelVerbForm}
      , voice: {title: labelGrammarTermsTitles.voice, values: labelVoice}
    };


    // if the index did not change, preserve the previous state
    if (currentState.index && (currentState.index === index)) {
      tokenAnalysis = currentState.tokenAnalysis;
      let propLemma = props.copiedLemma;
      let propGloss = props.copiedGloss;
      let propPos = props.copiedPos;
      let propGrammar = props.copiedGrammar;
      let lemma = currentState.lemma;
      let gloss = currentState.gloss;

      let dependsOn = get(currentState, "dependsOn", props.tokenAnalysis.dependsOn);
      let refersTo = get(currentState, "refersTo", props.tokenAnalysis.refersTo);
      let selectedAspect = currentState.selectedAspect;
      let selectedCase = currentState.selectedCase;
      let selectedGender = currentState.selectedGender;
      let selectedMood = currentState.selectedMood;
      let selectedNumber = currentState.selectedNumber;
      let selectedPerson = currentState.selectedPerson;
      let selectedPos = currentState.selectedPos;
      let selectedTense = currentState.selectedTense;
      let selectedVerbForm = currentState.selectedVerbForm;
      let selectedVoice = currentState.selectedVoice;
      let theTaggedNode = new TreeNode();

      if (currentState.theTaggedNode) {
        theTaggedNode = currentState.theTaggedNode;
      }

      if (selectedPos) {
        if (props.copiedPos) {
          if(props.copiedPos === currentState.propPos) {
            // ignore
          } else {
            selectedPos = props.copiedPos;
          }
        }
      } else {
        selectedPos = props.copiedPos;
      }
      if (lemma) {
        if (props.copiedLemma) {
          if(props.copiedLemma === currentState.lemma) {
            // ignore
          } else {
            lemma = props.copiedLemma;
          }
        }
      } else {
        lemma = props.copiedLemma;
      }
      if (gloss) {
        if (props.copiedGloss) {
          if(props.copiedGloss === currentState.propGloss) {
            // ignore
          } else {
            gloss = props.copiedGloss;
          }
        }
      } else {
        gloss = props.copiedGloss;
      }
      if (props.copiedGrammar) {
        let tags = props.copiedGrammar.split(".");
        for (let i=1; i < tags.length; i++) {
          let tag = tags[i];
          if (tag === "PRES") {
            tag = "PRS";
          } else if (tag === "PART") {
            tag = "PTCP";
          } else if (tag === "PERF") {
            tag = "PRF";
          } else if (tag === "INF") { // treat infinitive as a part of speech
            selectedPos = tag;
            propPos = tag;
          }
          if (labelCase.values[tag]) {
            selectedCase = tag;
          } else if (grammar.gender.values[tag]) {
            selectedGender = tag;
          } else if (grammar.number.values[tag]) {
            selectedNumber = tag;
          } else if (grammar.mood.values[tag]) {
            selectedMood = tag;
          } else if (grammar.person.values[tag]) {
            selectedPerson = tag;
          } else if (grammar.tense.values[tag]) {
            selectedTense = tag;
          } else if (grammar.voice.values[tag]) {
            selectedVoice = tag;
          }
        }
      }
      let submitDisabled = true;
      if (currentState.theTaggedNode) {
        submitDisabled = currentState.theTaggedNode.notComplete();
      }

      let uiSchemas = {};
      if (props.session && props.session.uiSchemas) {
        uiSchemas = new UiSchemas(
            props.session.uiSchemas.formsDropdown
            , props.session.uiSchemas.formsSchemas
            , props.session.uiSchemas.forms
        );
      }

      return (
          {
            labels: {
              thisClass: labels[labelTopics.TokenTagger]
              , messages: labels[labelTopics.messages]
              , grammar: grammar
            }
            , session: {
              uiSchemas: uiSchemas
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: labels[labelTopics.messages].initial
            , index: index
            , selectedAspect: selectedAspect
            , selectedCase: selectedCase
            , selectedGender: selectedGender
            , selectedMood: selectedMood
            , selectedNumber: selectedNumber
            , selectedPerson: selectedPerson
            , selectedPos: selectedPos
            , selectedTense: selectedTense
            , selectedVerbForm: selectedVerbForm
            , selectedVoice: selectedVoice
            , selectedLabel: get(currentState, "selectedLabel", "")
            , dependsOn: dependsOn
            , refersTo: refersTo
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
              thisClass: labels[labelTopics.TokenTagger]
              , messages: labels[labelTopics.messages]
              , grammar: grammar
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: labels[labelTopics.messages].initial
            , updatingData: false
            , dataUpdated: false
            , index: index
            , selectedAspect: tokenAnalysis.aspect ? tokenAnalysis.aspect : ""
            , selectedCase: tokenAnalysis.gCase ? tokenAnalysis.gCase : ""
            , selectedGender: tokenAnalysis.gender ? tokenAnalysis.gender : ""
            , selectedMood: tokenAnalysis.mood ? tokenAnalysis.mood : ""
            , selectedNumber: tokenAnalysis.number ? tokenAnalysis.number : ""
            , selectedPerson: tokenAnalysis.person ? tokenAnalysis.person : ""
            , selectedPos: tokenAnalysis.pos ? tokenAnalysis.pos : ""
            , selectedTense: tokenAnalysis.tense ? tokenAnalysis.tense : ""
            , selectedVerbForm: tokenAnalysis.verbForm ? tokenAnalysis.verbForm : ""
            , selectedVoice: tokenAnalysis.voice ? tokenAnalysis.voice : ""
            , selectedLabel: tokenAnalysis.label ? tokenAnalysis.label : ""
            , lemma: tokenAnalysis.lemma ? tokenAnalysis.lemma : ""
            , gloss: tokenAnalysis.gloss ? tokenAnalysis.gloss : ""
            , dependsOn: tokenAnalysis.dependsOn ? tokenAnalysis.dependsOn : ""
            , refersTo: tokenAnalysis.refersTo ? tokenAnalysis.refersTo : ""
            , grammar: tokenAnalysis.grammar ? tokenAnalysis.grammar : ""
            , tokenAnalysis: tokenAnalysis
          }
      )

    }
  };


  handleGlossChange =  (event) => {
    this.setState({
      gloss: event.target.value
    }, this.toggleSubmit);
  };

  handleLemmaChange =  (event) => {
    this.setState({
      lemma: event.target.value
    }, this.toggleSubmit);
  };

  normalizeIndex(value) {
    let result = value;
    if (value) {
      if (value === "0") {
        result = "Root";
      } else {
        result = (parseInt(value)-1).toString();
      }
    }
    return result;
  }
  handleDependencyChange = (selection) => {
    this.setState({
      dependsOn: this.normalizeIndex(selection["value"])
    }, this.toggleSubmit);
  };

  handleReferentChange = (selection) => {
    this.setState({
      refersTo: selection["value"]
    }, this.toggleSubmit);
  };

  handleLabelChange =  (selection) => {
    this.setState({
      selectedLabel: selection["value"]
    }, this.toggleSubmit);
  };

  handlePartOfSpeechChange =  (selection) => {
    this.setState({
      selectedPos: selection["value"]
    }, this.toggleSubmit);
  };

  handlePersonChange =  (selection) => {
    this.setState({
      selectedPerson: selection["value"]
    }, this.toggleSubmit);
  };

  handleNumberChange =  (selection) => {
      this.setState({
        selectedNumber: selection["value"]
      }, this.toggleSubmit);
  };

  handleCaseChange =  (selection) => {
    this.setState({
      selectedCase: selection["value"]
    }, this.toggleSubmit);
  };

  handleGenderChange =  (selection) => {
    this.setState({
      selectedGender: selection["value"]
    }, this.toggleSubmit);
  };

  handleTenseChange =  (selection) => {
    this.setState({
      selectedTense: selection["value"]
    }, this.toggleSubmit);
  };

  handleAspectChange =  (selection) => {
    this.setState({
      selectedAspect: selection["value"]
    }, this.toggleSubmit);
  };

  handleVerbFormChange =  (selection) => {
    this.setState({
      selectedVerbForm: selection["value"]
    }, this.toggleSubmit);
  };

  handleMoodChange =  (selection) => {
    this.setState({
      selectedMood: selection["value"]
    }, this.toggleSubmit);
  };

  handleVoiceChange =  (selection) => {
      this.setState({
        selectedVoice: selection["value"]
      }, this.toggleSubmit);
  };

  getDependencyComponent = () => {
    let theIndex = parseInt(this.props.index)+1;
    let result = {};
    let values = {
      "0": "Root"
    };
    for (let i=1; i <= this.props.tokens.length; i++ ) {
      if (i !== theIndex) {
        values[i] = (i) + ": " + this.props.tokens[i-1];
      }
    }
    result.title = "Depends On"
    result.values = values;
    // make adjustments for displaying dependency dropdown
    let initialValue = this.state.dependsOn;
    if (initialValue === "Root") {
      initialValue = "0";
    } else {
      initialValue = (parseInt(initialValue)+1).toString();
    }
    return (
        <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-Dependency">
          <LabelSelector
              languageCode={this.props.session.languageCode}
              labels={result}
              initialValue={initialValue}
              changeHandler={this.handleDependencyChange}
          />
        </div>
    );
  };

  getReferentComponent = () => {
    if (TreeNode.requiresReferent(this.state.selectedPos)
    ) {
      let theIndex = parseInt(this.props.index);
      let result = {};
      let values = {};
      for (let i=0; i < this.props.tokens.length; i++ ) {
        if (i !== theIndex) {
          values[i] = (i+1) + ": " + this.props.tokens[i];
        }
      }
      result.title = "Refers to"
      result.values = values;
      // make adjustments for displaying dropdown index shift
      let initialValue = this.state.refersTo;
      // if (initialValue === "Root") {
      //   initialValue = "0";
      // } else {
      //   initialValue = (parseInt(initialValue)+1).toString();
      // }
      return (
          <div className="col-sm-12 col-md-12 col-lg-12 App-Label-Selector-Referent">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={result}
                initialValue={initialValue}
                changeHandler={this.handleReferentChange}
            />
          </div>
      );
    } else {
      return (<span/>);
    }
  };


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
  };

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
  };

  getPersonComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
        && (! this.state.selectedVerbForm.startsWith("Part"))
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
      return (<span/>);
    }
  };

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
      return (<span/>);
    }
  };

  getVerbNumberComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
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
      return (<span/>);
    }
  };

  getCaseComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
        || (this.state.selectedPos.startsWith("VERB") && this.state.selectedVerbForm.startsWith("Part"))
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
      return (<span/>);
    }
  };
  getGenderComponent =  () => {
    if (this.state.selectedPos.startsWith("ADJ")
        || this.state.selectedPos.startsWith("ART")
        || this.state.selectedPos.startsWith("PRON")
        || this.state.selectedPos.startsWith("NOUN")
        || (this.state.selectedPos.startsWith("VERB")
            && this.state.selectedVerbForm.startsWith("Part"))
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
      return (<span/>);
    }
  };

  getTenseComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
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
      return (<span/>);
    }
  };

  getAspectComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Tense">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.aspect}
                initialValue={this.state.selectedAspect}
                changeHandler={this.handleAspectChange}
            />
          </div>
      );
    } else {
      return (<span/>);
    }
  };

  getVerbFormComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Tense">
            <LabelSelector
                languageCode={this.props.session.languageCode}
                labels={this.state.labels.grammar.verbForm}
                initialValue={this.state.selectedVerbForm}
                changeHandler={this.handleVerbFormChange}
            />
          </div>
      );
    } else {
      return (<span/>);
    }
  };
  getVoiceComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
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
      return (<span/>);
    }
  };
  getMoodComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
        && (! this.state.selectedVerbForm.startsWith("Part"))
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
      return (<span/>);
    }
  };

  /**
   * Update the database and return the value to the caller
   */
  submitUpdate = () => {
    let path = this.state.session.uiSchemas.getHttpPutPathForSchema(
        this.state.tokenAnalysis._valueSchemaId
    );
    // submit update to the database via the rest api
    Server.restPutSchemaBasedForm(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , path
        , this.state.tokenAnalysis
        , undefined
        , this.handleValueUpdateCallback
    );
    // submit update to the caller
    this.props.callBack(
        this.state.theTaggedNode
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let tokenAnalysis = this.state.tokenAnalysis;
    let theTaggedNode = this.state.theTaggedNode;
    tokenAnalysis.dependsOn = theTaggedNode.dependsOn;
    tokenAnalysis.refersTo = theTaggedNode.refersTo;
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
  };

  handleValueUpdateCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
        , messageStatus: restCallResult.status
        , updatingData: false
        , dataUpdated: true
      });
    }
  };

  toggleSubmit = () => {
    let theNode = new TreeNode(
        this.props.index
        , this.props.token
        , this.state.lemma
        , this.state.gloss
        , this.state.dependsOn
        , this.state.refersTo
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
  };

  getSubmitMessage = () => {
    if (this.state.updatingData) {
     return (
         <Spinner message={this.state.labels.messages.updating}/>
     );
    } else if (this.state.dataUpdated) {
      let message = this.state.labels.messages.updated;
      if (this.state.messageStatus !== "200") {
        message = this.state.message;
      }
      return (
          <span>
            <FontAwesome
              name={this.state.messageIcon}
            />
            {message}
          </span>
      )
    } else {
      return (<span/>);
    }
  };


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
              >
                <div className="container">
                  <div>
                    <div className="row">
                      {this.getPartOfSpeechComponent()}
                      {this.getVerbFormComponent()}
                      {this.getAspectComponent()}
                      {this.getDependencyComponent()}
                      {this.getLabelComponent()}
                      {this.getReferentComponent()}
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
                            id="AppTreeNodeBuilder-Lemma"
                            className="App App-TokenTagger-Lemma"
                            type="text"
                            value={this.state.lemma}
                            placeholder="Enter lemma"
                            onChange={this.handleLemmaChange}
                        />
                      </div>
                      <div className="col-sm-12 col-md-12 col-lg-12  App-Label-Selector-Case">
                        <div className="resourceSelectorPrompt">{this.state.labels.thisClass.gloss}</div>
                        <FormControl
                            id="AppTreeNodeBuilder-Gloss"
                            className="App App-TokenTagger-Gloss"
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
                    {this.state.labels.messages.submit}
                  </Button>
                </div>
                <div className="col-sm-6 col-md-6 col-lg-6  App-Label-Selector-Retrieving">
                  {this.getSubmitMessage()}
                </div>
                <div className="col-sm-4 col-md-4 col-lg-4  App-Label-Selector-Empty">
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2 col-md-2 col-lg-2  App-Label-Selector-Help">
                  <a
                      href="https://github.com/PerseusDL/treebank_data/blob/master/AGDT2/guidelines/Greek_guidelines.md"
                      target="_blank"
                  >{this.state.labels.thisClass.help}</a>
                </div>
                <div className="col-sm-2 col-md-2 col-lg-2  App-Label-Selector-Help">
                  <a
                      href={"https://www.eva.mpg.de/lingua/resources/glossing-rules.php"
                      + this.state.gloss
                      + "_1?isEntryInOtherDict=false"}
                      target="_blank"
                  >{this.state.labels.thisClass.leipzig}</a>
                </div>
                <div className="col-sm-3 col-md-3 col-lg-3  App-Label-Selector-Help">
                  <a
                      href={"http://www.oxfordlearnersdictionaries.com/definition/english/"
                      + this.state.gloss
                      + "_1?isEntryInOtherDict=false"}
                      target="_blank"
                  >{this.state.labels.thisClass.oxford}</a>
                </div>
              </div>
            </form>
        )
  }
}

TokenTagger.propTypes = {
    session: PropTypes.object.isRequired
    , index: PropTypes.string.isRequired
    , tokens: PropTypes.array.isRequired
    , token: PropTypes.string.isRequired
    , tokenAnalysis: PropTypes.object.isRequired
    , callBack: PropTypes.func.isRequired
    , copiedLemma: PropTypes.string
    , copiedGloss: PropTypes.string
    , copiedPos: PropTypes.string
    , copiedGrammar: PropTypes.string
};

TokenTagger.defaultProps = {
  copiedLemma: ""
  , copiedGloss: ""
  , copiedPos: ""
  , copiedGrammar: ""
};

export default TokenTagger;
