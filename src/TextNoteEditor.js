import React from 'react';
import PropTypes from 'prop-types';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import { Button, ButtonGroup, Col, ControlLabel, Grid, HelpBlock, FormControl, FormGroup, Row, Well } from 'react-bootstrap';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';
import ResourceSelector from './modules/ReactSelector';
import BibleRefSelector from './helpers/BibleRefSelector';

class TextNodeEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getViewReferencesLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , editor: null
      , scope: props.scope
      , liturgicalText: props.liturgicalText
      , lemma: ""
      , selectedType: ""
      , selectedBibleBook: ""
      , selectedBibleChapter: ""
      , selectedBibleVerse: ""
      , bibleRef: ""
      , ontologyRef: ""
      , note: ""
    };

    this.handleBibleRefChange = this.handleBibleRefChange.bind(this);
    this.handleLemmaChange = this.handleLemmaChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleScopeChange = this.handleScopeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNoteTypeChange = this.handleNoteTypeChange.bind(this);
    this.handleOntologyRefChange = this.handleOntologyRefChange.bind(this);
    this.getBibleRefRow = this.getBibleRefRow.bind(this);
    this.getLiturgicalTextRow = this.getLiturgicalTextRow.bind(this);
    this.getOntologyRefRow = this.getOntologyRefRow.bind(this);
    this.getTitleRow = this.getTitleRow.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    tinymce.init({
      selector: `#${this.props.id}`,
      plugins: 'wordcount',
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.props.onEditorChange(content);
        });
      }
      , entity_encoding : "raw"
      , browser_spellcheck: true
      , branding: false
      , menubar: false
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  };

  componentWillUnmount() {
    tinymce.remove(this.state.editor);
  };

  handleScopeChange = (e) => {
    this.setState({scope: e.target.value});
  };

  handleNoteTypeChange = (selection) => {
    console.log(`selectedType=${selection["value"]}`);
    this.setState({
      selectedType: selection["value"]
    });
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleSave = (e) => {
    console.log('Content was updated:', e.target.getContent());
    this.setState({note: e.target.getContent()});
  };

  handleBibleRefChange = (e) => {
    this.setState({bibleRef: e.target.value});
  };

  handleOntologyRefChange = (e) => {
    this.setState({ontologyRef: e.target.value});
  };

  handleLemmaChange = (e) => {
    this.setState({lemma: e.target.value});
  };

  handleTitleChange = (e) => {
    this.setState({title: e.target.value});
  };

  getTitleRow = () => {
    return (
        <Row className="show-grid">
          <Col xs={2} md={2}>
            <ControlLabel>Title:</ControlLabel>
          </Col>
          <Col className="App App-Text-Note-Editor-Title" xs={8} md={8}>
            <FormControl
                className={"App App-Text-Note-Editor-Title"}
                type="text"
                value={this.state.title}
                placeholder="title"
                onChange={this.handleTitleChange}
            />
          </Col>
        </Row>
    );
  };

  getBibleRefRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (
        <BibleRefSelector
            session={this.props.session}
            callback={this.handleBibleRefChange}
        />
      );
    } else {
      <span></span>
    }
  };

  getOntologyRefRow = () => {
    if (this.state.selectedType
        && this.state.selectedType.startsWith("REF_TO")
        && (this.state.selectedType !== ("REF_TO_BIBLE"))
    ) {
      return (
          <Row className="show-grid">
            <Col xs={2} md={2}>
              <ControlLabel>Ontology Reference:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  className={"App App-Text-Note-Editor-Scope"}
                  type="text"
                  value={this.state.ontologyRef}
                  placeholder="Ontology reference"
                  onChange={this.handleOntologyRefChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span></span>);
    }
  };

  getLiturgicalTextRow = () => {
    console.log(this.props.liturgicalText);
    if (this.props.liturgicalText && this.props.liturgicalText.length > 0) {
      return (
          <Well><div>{this.props.liturgicalText}</div></Well>
      );
    } else {
      return (<span></span>);
    }
  };

  render() {
    return (
        <div className="App-Text-Note-Editor">
          {this.getLiturgicalTextRow()}
          <Well>
          <form onSubmit={this.handleSave}>
            <FormGroup
                controlId="formBasicText"
            >
              <Grid>
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Scope:</ControlLabel>
                  </Col>
                  <Col xs={10} md={10}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.scope}
                        placeholder="scope"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Type:</ControlLabel>
                  </Col>
                  <Col xs={10} md={10}>
                    <ResourceSelector
                        title={""}
                        initialValue={this.state.selectedType}
                        resources={this.props.session.dropdowns.noteTypesDropdown}
                        changeHandler={this.handleNoteTypeChange}
                        multiSelect={false}
                    />
                  </Col>
                </Row>
                {this.getTitleRow()}
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Lemma:</ControlLabel>
                  </Col>
                  <Col xs={10} md={10}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.lemma}
                        placeholder="lemma"
                        onChange={this.handleLemmaChange}
                    />
                  </Col>
                </Row>
                {this.getBibleRefRow()}
                {this.getOntologyRefRow()}
                <Row className="show-grid">
                  <Col xs={12} md={8}>
                    <ControlLabel>Note:</ControlLabel>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={12} md={8}>
                    <textarea id={this.props.id}/>
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={12} md={8}>
                    <ButtonGroup>
                      <Button>Save as Draft</Button>
                      <Button bsStyle="primary">Submit</Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </Grid>
            </FormGroup>
          </form>
          </Well>
        </div>
    )
  }
}

TextNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onEditorChange: PropTypes.func.isRequired
  , scope: PropTypes.string
  , liturgicalText: PropTypes.string
};

// set default values for props here
TextNodeEditor.defaultProps = {
  id: "tinymceeditor"
  , scope: ""
  , liturgicalText: ""
};

export default TextNodeEditor;
