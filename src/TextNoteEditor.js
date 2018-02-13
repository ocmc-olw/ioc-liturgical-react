import React from 'react';
import PropTypes from 'prop-types';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/lists';
import {
  Accordion
  , Button
  , Col
  , ControlLabel
  , Glyphicon
  , Grid
  , FormControl
  , FormGroup
  , Panel
  , Row
  , Tab
  , Tabs
  , Well
} from 'react-bootstrap';
import Labels from './Labels';
import Server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import ResourceSelector from './modules/ReactSelector';
import EditableSelector from './modules/EditableSelector';
import BibleRefSelector from './helpers/BibleRefSelector';
import OntologyRefSelector from './helpers/OntologyRefSelector';
import WorkflowForm from './helpers/WorkflowForm';

import CompareDocs from './modules/CompareDocs';

class TextNodeEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    let thisClassLabels = Labels.getTextNoteEditorLabels(languageCode);
    this.state = {
      labels: { //
        thisClass: thisClassLabels
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
        , search: Labels.getSearchLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , editor: null
      , scopeBiblical: ""
      , scopeLiturgical: props.scope
      , lemmaBiblical: ""
      , lemmaLiturgical: ""
      , title: ""
      , liturgicalText: props.liturgicalText
      , selectedType: ""
      , selectedTypeLabel: thisClassLabels.typeLabel
      , selectedBibleBook: ""
      , selectedBibleChapter: ""
      , selectedBibleVerse: ""
      , bibleRef: ""
      , note: ""
      , selectedLiturgicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: props.idTopic},
        {key: "key", label: props.idKey}
      ]
      , selectedBiblicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showBibleView: false
      , ontologyRefType: ""
      , ontologyRefEntityId: ""
      , ontologyRefEntityName: ""
      , showOntologyView: false
      , workflow: {
        visibility: "PERSONAL"
        , status: "EDITING"
        , assignedTo: props.session.userInfo.username
      }
      , selectedNoteLibrary: props.session.userInfo.domain
    };

    this.createMarkup = this.createMarkup.bind(this);
    this.fetchBibleText = this.fetchBibleText.bind(this);
    this.handleFetchBibleTextCallback = this.handleFetchBibleTextCallback.bind(this);

    this.handleBibleRefChange = this.handleBibleRefChange.bind(this);
    this.handleBiblicalLemmaChange = this.handleBiblicalLemmaChange.bind(this);
    this.handleLiturgicalLemmaChange = this.handleLiturgicalLemmaChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleBiblicalScopeChange = this.handleBiblicalScopeChange.bind(this);
    this.handleLiturgicalScopeChange = this.handleLiturgicalScopeChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleNoteTypeChange = this.handleNoteTypeChange.bind(this);
    this.handleOntologyRefChange = this.handleOntologyRefChange.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleEditableListCallback = this.handleEditableListCallback.bind(this);
    this.handleWorkflowCallback = this.handleWorkflowCallback.bind(this);

    this.getFormattedScopes = this.getFormattedScopes.bind(this);
    this.getHeaderWell = this.getHeaderWell.bind(this);
    this.getBibleRefRow = this.getBibleRefRow.bind(this);
    this.getLiturgicalTextRow = this.getLiturgicalTextRow.bind(this);
    this.getOntologyRefRow = this.getOntologyRefRow.bind(this);
    this.getTitleRow = this.getTitleRow.bind(this);
    this.getLiturgicalView = this.getLiturgicalView.bind(this);
    this.getLiturgicalScopeRow = this.getLiturgicalScopeRow.bind(this);
    this.getLiturgicalLemmaRow = this.getLiturgicalLemmaRow.bind(this);
    this.getBiblicalScopeRow = this.getBiblicalScopeRow.bind(this);
    this.getBiblicalLemmaRow = this.getBiblicalLemmaRow.bind(this);
    this.getNoteTypeRow = this.getNoteTypeRow.bind(this);
    this.getButtonRow = this.getButtonRow.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getFormattedHeaderRow = this.getFormattedHeaderRow.bind(this);
    this.getOntologyLabel = this.getOntologyLabel.bind(this);
    this.getRevisionsPanel = this.getRevisionsPanel.bind(this);
    this.getTagsRow = this.getTagsRow.bind(this);
    this.getWorkflowPanel = this.getWorkflowPanel.bind(this);
    this.getTabs = this.getTabs.bind(this);

  }

  componentWillMount = () => {
  };

  // right arrow &rarr;
  // scroll &ac;

  componentDidMount = () => {
    tinymce.init({
      selector: `#${this.props.id}`,
      plugins: 'lists, wordcount',
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.handleEditorChange(content);
        });
      }
      , entity_encoding : "raw"
      , browser_spellcheck: true
      , branding: false
      , menubar: false
    });
  }

  componentWillReceiveProps = (nextProps) => {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getTextNoteEditorLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
            , search: Labels.getSearchLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  componentWillUnmount() {
    tinymce.remove(this.state.editor);
  };

  fetchBibleText = () => {
    let parms =
        "t=" + encodeURIComponent(this.state.topic)
        + "&l=" + encodeURIComponent(this.state.libraries)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
        },
        Server.getViewForTopic(
            this.props.session.restServer
            , this.props.session.userInfo.username
            , this.props.session.userInfo.password
            , parms
            , this.handleFetchCallback
        )
    );

  };

  handleWorkflowCallback = ( visibility, status, assignedTo ) => {
    console.log(`visibility=${visibility} status=${status} user=${assignedTo}`);
    this.setState(
        {
          workflow: {
            visibility: visibility
            , status: status
            , assignedTo: assignedTo
          }
        }
    );
  };

  handleFetchBibleTextCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      let about = data.about;
      let templateKeys = data.templateKeys;
      let libraryKeys = data.libraryKeys;
      let libraryKeyValues = data.libraryKeyValues;
      this.setState({
        dataFetched: true
        , about: about
        , libraryKeyValues: libraryKeyValues
        , libraryKeys: libraryKeys
        , templateKeys: templateKeys
        , message: this.state.labels.messages.found
        + " "
        + templateKeys.length
        + " "
        + this.state.labels.messages.docs
        , messageIcon: restCallResult.messageIcon
        , resultCount: templateKeys.length
      }, this.setTableData);
    }
  };

  handleRowSelect = () => {

  };

  handleEditableListCallback = (values) => {
    console.log(values);
  };

  handleEditorChange = (content) => {
    this.setState({note: content});
  }

  handleBiblicalScopeChange = (e) => {
    this.setState({scopeBiblical: e.target.value});
  };

  handleLiturgicalScopeChange = (e) => {
    this.setState({scopeLiturgical: e.target.value});
  };

  handleNoteTypeChange = (selection) => {
    this.setState({
      selectedType: selection["value"]
      , selectedTypeLabel: selection["label"]
      , scopeBiblical: ""
      , lemmaBiblical: ""
      , lemmaLiturgical: ""
      , selectedBibleBook: ""
      , selectedBibleChapter: ""
      , selectedBibleVerse: ""
      , bibleRef: ""
      , note: ""
      , selectedLiturgicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: this.props.idTopic},
        {key: "key", label: this.props.idKey}
      ]
      , selectedBiblicalIdParts: [
        {key: "domain", label: "*"},
        {key: "topic", label: ""},
        {key: "key", label: ""}
      ]
      , showBibleView: false
      , ontologyRefType: ""
      , ontologyRefEntityId: ""
      , ontologyRefName: ""
      , showOntologyView: false
    });
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleSave = (e) => {
    this.setState({note: e.target.getContent()});
  };

  handleBibleRefChange = (book, chapter, verse) => {
    let showBibleView = false;
    if (book.length > 0 && chapter.length > 0 && verse.length > 0) {
      showBibleView = true;
    }
    this.setState(
        {
        selectedBiblicalIdParts: [
          {key: "domain", label: "*"},
          {key: "topic", label: book},
          {key: "key", label: chapter + ":" + verse}
          ]
          , showBibleView
        }
    );
  };


  handleOntologyRefChange = (entityId, entityName) => {
    let showOntologyView = false;
    if (entityId.length > 0) {
      showOntologyView = true;
    }
    this.setState(
        {
          ontologyRefEntityId: entityId
          , ontologyRefEntityName: entityName
          , showOntologyView: showOntologyView
        }
    );
  };

  handleBiblicalLemmaChange = (e) => {
    this.setState({lemmaBiblical: e.target.value});
  };

  handleLiturgicalLemmaChange = (e) => {
    this.setState({lemmaLiturgical: e.target.value});
  };

  handleTitleChange = (e) => {
    this.setState({title: e.target.value});
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
      return (<span className="App-no-display"></span>);
    }
  };

  getOntologyRefRow = () => {
    if (this.state.selectedType
        && this.state.selectedType.startsWith("REF_TO")
        && (this.state.selectedType !== ("REF_TO_BIBLE"))
    ) {
      let type = this.getOntologyLabel(this.state.selectedType);
      return (
          <Row className="show-grid App-Ontology-Ref-Selector-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.refersTo}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <div className={"App App-Ontology-Ref-Selector-Entity"}>
                <OntologyRefSelector
                    session={this.props.session}
                    type={type}
                    callback={this.handleOntologyRefChange}
                />
              </div>
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getOntologyLabel = (type) => {
    try {
      let label = type.split("_")[2];
      return label.charAt(0) + label.slice(1).toLowerCase();
    } catch (err) {
      return type;
    };
  };

  getLiturgicalView = () => {
    return (
        <Accordion>
          <Panel header={this.state.labels.thisClass.viewLiturgicalText} eventKey="TextNoteEditor">
            <CompareDocs
                session={this.props.session}
                handleRowSelect={this.handleRowSelect}
                title={"Liturgical Texts"}
                docType={"Liturgical"}
                selectedIdParts={this.state.selectedLiturgicalIdParts}
                labels={this.state.labels.search}
            />
          </Panel>
        </Accordion>
    );
  };
  getBiblicalView = () => {
    if (this.state.showBibleView) {
      return (
          <Accordion>
          <Panel header={this.state.labels.thisClass.viewBiblicalText} eventKey="TextNoteEditor">
            <CompareDocs
                session={this.props.session}
                handleRowSelect={this.handleRowSelect}
                title={"Biblical Texts"}
                docType={"Biblical"}
                selectedIdParts={this.state.selectedBiblicalIdParts}
                labels={this.state.labels.search}
            />
          </Panel>
          </Accordion>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getLiturgicalTextRow = () => {
    if (this.props.liturgicalTextGrk && this.props.liturgicalTextGrk.length > 0) {
      return (
          <Well>
            <ControlLabel>Liturgical Text</ControlLabel>
            <Grid>
              <Row className="show-grid">
                <Col xs={6} md={6}>
                  <div>
                    {this.props.liturgicalTextGrk}
                    <ControlLabel className="App-Text-Note-Text-Source">
                         ({this.props.liturgicalTextGrkSource})
                    </ControlLabel>
                  </div>
                </Col>
                <Col xs={6} md={6}>
                  <div>
                    {this.props.liturgicalTextEng}
                    <ControlLabel className="App-Text-Note-Text-Source">
                       ({this.props.liturgicalTextEngSource})
                    </ControlLabel>
                  </div>
                </Col>
              </Row>
            </Grid>
          </Well>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getLiturgicalScopeRow = () => {
    return (
        <Row className="show-grid  App-Text-Note-Scope-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.liturgicalScope}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <FormControl
                className={"App App-Text-Note-Editor-Scope"}
                type="text"
                value={this.state.scopeLiturgical}
                placeholder="scope"
                onChange={this.handleLiturgicalScopeChange}
            />
          </Col>
        </Row>
    );
  };

  getLiturgicalLemmaRow = () => {
    return (
        <Row className="show-grid  App-Text-Note-Editor-Lemma-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.liturgicalLemma}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <FormControl
                className={"App App-Text-Note-Editor-Lemma"}
                type="text"
                value={this.state.lemmaLiturgical}
                placeholder="liturgical lemma"
                onChange={this.handleLiturgicalLemmaChange}
            />
          </Col>
        </Row>
    );
  };

  getTitleRow = () => {
    return (
        <Row className="show-grid App-Text-Note-Editor-Title-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.title}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
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

  getBiblicalScopeRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (
          <Row className="show-grid App-Text-Note-Editor-Scope-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalScope}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  className={"App App-Text-Note-Editor-Scope"}
                  type="text"
                  value={this.state.scopeBiblical}
                  placeholder="scope"
                  onChange={this.handleBiblicalScopeChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }

  };

  getBiblicalLemmaRow = () => {
    if (this.state.selectedType && this.state.selectedType === "REF_TO_BIBLE") {
      return (
          <Row className="show-grid App-Text-Note-Editor-Lemma-Row">
            <Col xs={2} md={2}>
              <ControlLabel>{this.state.labels.thisClass.biblicalLemma}:</ControlLabel>
            </Col>
            <Col xs={10} md={10}>
              <FormControl
                  className={"App App-Text-Note-Editor-Lemma"}
                  type="text"
                  value={this.state.lemmaBiblical}
                  placeholder="biblical lemma"
                  onChange={this.handleBiblicalLemmaChange}
              />
            </Col>
          </Row>
      );
    } else {
      return (<span className="App-no-display"></span>);
    }
  };

  getNoteTypeRow = () => {
    return (
        <Row className="show-grid App-Text-Note-Editor-Type-Row">
          <Col xs={2} md={2}>
            <ControlLabel>{this.state.labels.thisClass.type}:</ControlLabel>
          </Col>
          <Col xs={10} md={10}>
            <div className={"App App-Text-Note-Type-Selector"}>
            <ResourceSelector
                title={""}
                initialValue={this.state.selectedType}
                resources={this.props.session.dropdowns.noteTypesDropdown}
                changeHandler={this.handleNoteTypeChange}
                multiSelect={false}
            />
            </div>
          </Col>
        </Row>
    );

  };

  getButtonRow = () => {
    return (
        <Row className="show-grid App-Text-Note-Editor-Button-Row">
          <Col xs={12} md={8}>
              <Button className="App App-Button">{this.state.labels.buttons.saveAsDraft}</Button>
              <Button className="App App-Button" bsStyle="primary">{this.state.labels.buttons.submit}</Button>
          </Col>
        </Row>
    );

  };

  getTagsRow = () => {
    return (
            <Well className="App-Text-Note-Editor-Button-Row">
              <EditableSelector
                  session={this.props.session}
                  options={[]}
                  changeHandler={this.handleEditableListCallback}
                  title={""}
                  multiSelect={false}/>
            </Well>
    );

  };

  getRevisionsPanel = () => {
    return (
        <Well>
          revisions will appear here
        </Well>
    );
  }
    getWorkflowPanel = () => {
    return (
        <WorkflowForm
            session={this.props.session}
            callback={this.handleWorkflowCallback}
            library={this.state.selectedNoteLibrary}
        />
    );

  };

  getFormattedHeaderRow = () => {
    return (
            <Well>
              <div className="App App-Text-Note-formatted">
                <div className="App-Text-Note-Type">
                  <Glyphicon className="App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
                  <span className="App-Text-Note-Type-As-Heading">{this.state.selectedTypeLabel}</span>
                  <Glyphicon className="App-Text-Note-Type-Glyph" glyph={"screenshot"}/>
                </div>
                {this.getFormattedScopes()}
              </div>
            </Well>
    );
  };

  getFormattedScopes = () => {
      if (this.state.showBibleView) {
        return (
            <div className="App-Text-Note-formatted">
              <span className="App-Text-Note-Header-Scope">
                {this.state.scopeLiturgical}
              </span>
              <span className="App-Text-Note-Header-Lemma">
                  {this.state.lemmaLiturgical}
                </span>
              <Glyphicon className="App-Text-Note-Header-Scope-Glyph" glyph={"arrow-right"}/>
              <span className="App-Text-Note-Header-Scope-Biblical">
                {this.state.scopeBiblical}
              </span>
              <span className="App-Text-Note-Header-Lemma">
                  {this.state.lemmaBiblical}
                </span>
              <span className="App-Text-Note-Header-Title">
                  {this.state.title}
                </span>
              <span className="App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
            </div>
        );
      } else if (this.state.showOntologyView) {
        return (
            <div className="App-Text-Note-formatted">
              <span className="App-Text-Note-Header-Scope">
                {this.state.scopeLiturgical}
              </span>
              <span className="App-Text-Note-Header-Lemma">
                  {this.state.lemmaLiturgical}
                </span>
              <Glyphicon className="App-Text-Note-Header-Scope-Glyph" glyph={"arrow-right"}/>
              <span className="App-Text-Note-Header-Scope-Ontological">
                {this.state.ontologyRefEntityName}
              </span>
              <span className="App-Text-Note-Header-Title">
                  {this.state.title}
                </span>
              <span className="App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
            </div>
        );
      } else {
        return (
            <div className="App-Text-Note-formatted">
              <span className="App-Text-Note-Header-Scope">
                {this.state.scopeLiturgical}
              </span>
              <span className="App-Text-Note-Header-Lemma">
                  {this.state.lemmaLiturgical}
                </span>
              <span className="App-Text-Note-Header-Title">
                  {this.state.title}
                </span>
              <span className="App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
            </div>
      );
      }
  };

  createMarkup() {
    return {__html: this.state.note};
  }

  getHeaderWell = () => {
      return (
              <Well>
                <Grid>
                  {this.getNoteTypeRow()}
                  {this.getLiturgicalScopeRow()}
                  {this.getLiturgicalLemmaRow()}
                  {this.getTitleRow()}
                  {this.getBibleRefRow()}
                  {this.getBiblicalScopeRow()}
                  {this.getBiblicalLemmaRow()}
                  {this.getOntologyRefRow()}
                </Grid>
              </Well>
      );
  };

getTabs = () => {
    return (
        <Well>
          <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
            <Tab eventKey={"heading"} title={this.state.labels.thisClass.settings}>
              {this.getHeaderWell()}
            </Tab>
            <Tab eventKey={"formattedheading"} title={this.state.labels.thisClass.viewFormattedNote}>
              {this.getFormattedHeaderRow()}
            </Tab>
            <Tab eventKey={"revisions"} title={this.state.labels.thisClass.revisions}>
              {this.getRevisionsPanel()}
            </Tab>
            <Tab eventKey={"tags"} title={this.state.labels.thisClass.tags}>
              {this.getTagsRow()}
            </Tab>
            <Tab eventKey={"workflow"} title={this.state.labels.thisClass.workflow}>
              {this.getWorkflowPanel()}
            </Tab>
          </Tabs>
        </Well>
    );

  };

  render() {
    return (
        <div className="App-Text-Note-Editor">
          {this.getLiturgicalView()}
          {this.getBiblicalView()}
          <Well>
          <form onSubmit={this.handleSave}>
            <FormGroup
                controlId="formBasicText"
            >
              <Grid>
                <Row className="show-grid">
                  <Col xs={12} md={8}>
                    <ControlLabel>
                      {this.state.labels.thisClass.note}:
                      {this.state.selectedTypeLabel}
                    </ControlLabel>
                  </Col>
                </Row>
                <Row className="show-grid  App-Text-Note-Editor-Row">
                  <Col xs={12} md={8}>
                    <textarea id={this.props.id}/>
                  </Col>
                </Row>
                {this.getButtonRow()}
              </Grid>
            </FormGroup>
          </form>
          </Well>
          {this.getTabs()}
        </div>
    )
  }
}

TextNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onEditorChange: PropTypes.func.isRequired
  , scope: PropTypes.string
  , idTopic: PropTypes.string
  , idKey: PropTypes.string
  , liturgicalTextGrk: PropTypes.string
  , liturgicalTextGrkSource: PropTypes.string
  , liturgicalTextEng: PropTypes.string
  , liturgicalTextEngSource: PropTypes.string
};

// set default values for props here
TextNodeEditor.defaultProps = {
  id: "tinymceeditor"
  , scope: ""
  , liturgicalTextGrk: ""
  , liturgicalTextGrkSource: ""
  , liturgicalTextEng: ""
  , liturgicalTextEngSource: ""
};

export default TextNodeEditor;
