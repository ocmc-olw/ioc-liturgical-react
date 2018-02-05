import React from 'react';
import PropTypes from 'prop-types';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import { Button, ButtonGroup, Col, ControlLabel, Grid, HelpBlock, FormControl, FormGroup, Row } from 'react-bootstrap';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

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
      , scope: undefined
      , lemma: undefined
      , type: undefined
      , biblicalRef: undefined
      , note: undefined
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleScopeChange = this.handleScopeChange.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    tinymce.init({
      selector: `#${this.props.id}`,
      plugins: 'wordcount table',
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.props.onEditorChange(content);
        });
      }
      , entity_encoding : "raw"
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
    console.log(`scope: ${e.target.value}`);
    this.setState({scope: e.target.value});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleSave = (e) => {
    console.log('Content was updated:', e.target.getContent());
  };

  render() {
    return (
        <div className="App-Text-Note-Editor">
          <form onSubmit={this.handleSave}>
            <FormGroup
                controlId="formBasicText"
            >
              <Grid>
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Scope:</ControlLabel>
                  </Col>
                  <Col xs={4} md={2}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.value}
                        placeholder="scope"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                  <Col xs={2} md={2}>
                    <ControlLabel>Type:</ControlLabel>
                  </Col>
                  <Col xs={4} md={2}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.value}
                        placeholder="type"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Lemma:</ControlLabel>
                  </Col>
                  <Col xs={4} md={4}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.value}
                        placeholder="lemma"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                  <Col xs={2} md={2}>
                    <ControlLabel>Bible Reference:</ControlLabel>
                  </Col>
                  <Col xs={4} md={4}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Scope"}
                        type="text"
                        value={this.state.value}
                        placeholder="Bible reference"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                </Row>
                <Row className="show-grid">
                  <Col xs={2} md={2}>
                    <ControlLabel>Title:</ControlLabel>
                  </Col>
                  <Col xs={8} md={8}>
                    <FormControl
                        className={"App App-Text-Note-Editor-Title"}
                        type="text"
                        value={this.state.value}
                        placeholder="title"
                        onChange={this.handleScopeChange}
                    />
                  </Col>
                </Row>
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
        </div>
    )
  }
}

TextNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onEditorChange: PropTypes.func.isRequired
};

// set default values for props here
TextNodeEditor.defaultProps = {
  id: "tinymceeditor"
};

export default TextNodeEditor;
