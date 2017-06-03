import React from 'react';
import {
  Button
  , ControlLabel
  , FormControl
  , FormGroup
  , Well
} from 'react-bootstrap';

import LabelSelector from '../helpers/LabelSelector';
import Labels from '../Labels';

class TreeNodeBuilder extends React.Component {
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
    this.getMoodComponent =this.getMoodComponent.bind(this);

    this.handleDependencyChange = this.handleDependencyChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handlePartOfSpeechChange = this.handlePartOfSpeechChange.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleNumberChange = this.handleNumberChange.bind(this);
    this.handleCaseChange = this.handleCaseChange.bind(this);
    this.handleGenderChange = this.handleGenderChange.bind(this);
    this.handleTenseChange = this.handleTenseChange.bind(this);
    this.handleVoiceChange = this.handleVoiceChange.bind(this);
    this.handleMoodChange =this.handleMoodChange.bind(this);

  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let index = props.index;
    // if the index did not change, preserve the previous state
    if (currentState.index && (currentState.index === index)) {
      return (
          {
            index: index
            , selectedCase: currentState.selectedCase ? currentState.selectedCase : ""
            , selectedGender: currentState.selectedGender ? currentState.selectedGender : ""
            , selectedMood: currentState.selectedMood? currentState.selectedMood : ""
            , selectedNumber: currentState.selectedNumber ? currentState.selectedNumber : ""
            , selectedPerson: currentState.selectedPerson ? currentState.selectedPerson : ""
            , selectedPos: currentState.selectedPos ? currentState.selectedPos : ""
            , selectedTense: currentState.selectedTense ? currentState.selectedTense : ""
            , selectedVoice: currentState.selectedVoice ? currentState.selectedVoice : ""
            , selectedLabel: currentState.selectedLabel ? currentState.selectedLabel : ""
            , lemma: currentState.lemma
            , gloss: currentState.gloss
          }
      )
    } else {
      return (
          {
            index: index
          }
      )

    }
  }

  // TODO: parm not right
  handleDependencyChange = (value) => {
      this.setState({
        dependency: value
      });
  }

  handleLabelChange =  (selection) => {
    this.setState({
      selectedLabel: selection["value"]
    });
  }

  handlePartOfSpeechChange =  (selection) => {
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
            changeHandler={this.handleDependencyChange}
        />
    );
  }

  getLabelComponent = () => {
    return (
        <LabelSelector
            languageCode={this.props.languageCode}
            labels={Labels.getGrammarTermsCategories(this.props.languageCode)}
            changeHandler={this.handleLabelChange}
        />
    );
  }
  getPartOfSpeechComponent =  () => {
    return (
        <LabelSelector
            languageCode={this.props.languageCode}
            labels={Labels.getGrammarTermsPartsOfSpeech(this.props.languageCode)}
            changeHandler={this.handlePartOfSpeechChange}
        />
    );
  }
  getPersonComponent =  () => {
    return (
        <div></div>
    );
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
                labels={Labels.getGrammarTermsNumber(this.props.languageCode)}
                changeHandler={this.handleNumberChange}
            />
        );
    } else {
      if (this.state.selectedNumber) {
        this.handleNumberChange("{value: ''}");
      }
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
              labels={Labels.getGrammarTermsCase(this.props.languageCode)}
              changeHandler={this.handleCaseChange}
          />
      );
    } else {
      if (this.state.selectedCase) {
        this.handleCaseChange("{value: ''}");
      }
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
              labels={Labels.getGrammarTermsGender(this.props.languageCode)}
              changeHandler={this.handleGenderChange}
          />
      );
    } else {
      if (this.state.selectedGender) {
        this.handleGenderChange("{value: ''}");
      }
      return (<span></span>);
    }
  }
  getTenseComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={Labels.getGrammarTermsTense(this.props.languageCode)}
              changeHandler={this.handleTenseChange}
          />
      );
    } else {
      if (this.state.selectedTense) {
        this.handleTenseChange("{value: ''}");
      }
      return (<span></span>);
    }
  }

  getVoiceComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={Labels.getGrammarTermsVoice(this.props.languageCode)}
              changeHandler={this.handleVoiceChange}
          />
      );
    } else {
      if (this.state.selectedVoice) {
        this.handleVoiceChange("{value: ''}");
      }
      return (<span></span>);
    }
  }
  getMoodComponent =  () => {
    if (this.state.selectedPos.startsWith("VERB")
    ){
      return (
          <LabelSelector
              languageCode={this.props.languageCode}
              labels={Labels.getGrammarTermsMood(this.props.languageCode)}
              changeHandler={this.handleMoodChange}
          />
      );
    } else {
      if (this.state.selectedMood) {
        this.handleMoodChange("{value: ''}");
      }
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
            <form>
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
                    </div>
                  </div>
                </div>
                <span>{this.props.index}</span>
                <FormControl
                    type="text"
                    value={this.props.lemma}
                    placeholder="Enter lemma"
                />
              </FormGroup>
            </form>
        )
  }
}

TreeNodeBuilder.propTypes = {
    languageCode: React.PropTypes.string.isRequired
    , index: React.PropTypes.string.isRequired
    , tokens: React.PropTypes.array.isRequired
    , token: React.PropTypes.string.isRequired
    , lemma: React.PropTypes.string
    , gloss: React.PropTypes.string
    , grammar: React.PropTypes.string.isRequired
    , callBack: React.PropTypes.func.isRequired
};

TreeNodeBuilder.defaultProps = {
};

export default TreeNodeBuilder;
