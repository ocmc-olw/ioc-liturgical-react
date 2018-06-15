import json from './labels.json';

class Labels {
  constructor(value) {
    console.log("CONSTRUCTOR");
    console.log(value);
    this.labels = {};
    if (value) {
      this.labels = value;
    } else {
      this.labels = json;
    }
    console.log(this.labels);
    console.log(this.labels.en);
    console.log(this.labels.en.AgesEditor.agesEnglish);
    console.log(this.labels.en.help["search.headerDomain"]);
    this.labels["el"]["UiLabelEditor"] = {
      panelTitle: "View and Edit Parallel Texts in Columns"
      , msg1: "Select a topic, then select one or more libraries.  Then click the button."
      , msg2: "Double-Click to edit a cell. You can sort the columns using the up and down triangles. You can filter a column by typing in the box below the column name. Clear the filters using the button to the right."
      , key: "Key"
      , view: "Select a topic..."
      , including: "Including"
      , select: "you may select up to "
      , libraries: "libraries."
      , sourceRequired: "You must include the source library "
      , maxLibraries: "The maximum of number of libraries you may select is"
    };
    this.labels["en"]["UiLabelEditor"] = {
      panelTitle: "View and Edit Parallel Texts in Columns"
      , msg1: "Select a topic, then select one or more libraries.  Then click the button."
      , msg2: "Double-Click to edit a cell. You can sort the columns using the up and down triangles. You can filter a column by typing in the box below the column name. Clear the filters using the button to the right."
      , key: "Key"
      , view: "Select a topic..."
      , including: "Including"
      , select: "you may select up to "
      , libraries: "libraries."
      , sourceRequired: "You must include the source library "
      , maxLibraries: "The maximum of number of libraries you may select is"
    };
    return this;
  };

  getAllLabels = (code) => {
    if (this.labels[code]) {
      return this.labels[code];
    } else {
      return this.labels["en"];
    }
  };

  getLabels = (code, topic) => { if (this.labels[code]) { return this.labels[code][topic]; } else { return this.labels["en"][topic]; } };

  getAgesEditorLabels = (code) => { return this.getLabels(code,"AgesEditor");};
  getAgesViewerLabels = (code) => { return this.getLabels(code,"AgesViewer");};
  getBibleRefSelectorLabels = (code) => { return this.getLabels(code,"BibleRefSelector");};
  getButtonLabels= (code) => {return this.getLabels(code,"button")};
  getChangePasswordPageLabels= (code) => { return this.getLabels(code,"ChangePasswordPage")};
  getComponentNewEntryLabels = (code) => { return this.getLabels(code,"NewEntry");};
  getComponentParaTextEditorLabels = (code) => { return this.getLabels(code,"ParaTextEditor");};
  getDeleteButtonLabels= (code) => {return this.getLabels(code,"deleteButton") };
  getDependencyDiagramLabels= (code) => { return this.getLabels(code,"DependencyDiagram");};
  getFormattedTextNoteLabels = (code) => { return this.getLabels(code,"FormattedTextNote");};
  getGenericNewEntryFormLabels = (code) => { return this.getLabels(code,"GenericNewEntryForm");};
  getGlossBuilderLabels = (code) => { return this.getLabels(code,"GlossBuilder");};
  getGrammarLabels = (code) => { return this.getLabels(code,"Grammar");};
  getGrammarTerms = (code, category) => {
    let theCode = code;
    if (! this.labels[code]) {
      theCode = "en";
    }
    if (category) {
      return this.labels[theCode].grammarTerms[category];
    } else {
      return this.labels[theCode].grammarTerms;
    }
  };
  getGrammarTermsCase = (code) => { return this.getLabels(code,"grammarTerms.case");};
  getGrammarTermsCategories = (code) => { return this.getLabels(code,"grammarTerms.categories");};
  getGrammarTermsGender = (code) => { return this.getLabels(code,"grammarTerms.gender");};
  getGrammarTermsMood = (code) => { return this.getLabels(code,"grammarTerms.mood");};
  getGrammarTermsNumber = (code) => { return this.getLabels(code,"grammarTerms.number");};
  getGrammarTermsPartsOfSpeech = (code) => {return this.getLabels(code,"grammarTerms.pos");};
  getGrammarTermsPerson = (code) => { return this.getLabels(code,"grammarTerms.person");};
  getGrammarTermsTense = (code) => { return this.getLabels(code,"grammarTerms.tense");};
  getGrammarTermsVoice = (code) => { return this.getLabels(code,"grammarTerms.voice");};
  getHeaderLabels = (code) => { return this.getLabels(code,"header");};
  getHelpLabels = (code) => { return this.getLabels(code,"help");};
  getHttpCodeLabels = (code) => {return this.getLabels(code,"httpCodes");};
  getHttpMessage = (languageCode, errorCode, errorMessage) => {
    let message = "";
    if (this.labels[languageCode].httpCodes[errorCode]) {
      message = labels[languageCode].httpCodes[errorCode];
    } else {
      message = errorMessage;
    }
    return message;
  };
  getHyperTokenTextLabels = (code) => { return this.getLabels(code,"HyperTokenText");};
  getJson = () => { return JSON.stringify(this.labels)};
  getLdpLabels = (code) => { return this.getLabels(code,"ldp");};
  getLinkSearchResultsTableLabels = (code) => {return this.getLabels(code,"linkSearchResultsTable");};
  getLiturgicalAcronymsLabels = (code) => { return this.getLabels(code,"liturgicalAcronyms");};
  getMessageLabels = (code) => {return this.getLabels(code,"messages")};
  getModalAgesServiceSelectorLabels = (code) => { return this.getLabels(code,"ModalAgesServiceSelector");};
  getModalParaRowEditorLabels = (code) => { return this.getLabels(code,"ModalParaRowEditor");};
  getModalReactSelectorLabels = (code) => { return this.getLabels(code,"ModalReactSelector");};
  getModalTemplateNodeEditorLabels = (code) => { return this.getLabels(code,"ModalTemplateNodeEditor");};
  getNewEntryFormLabels = (code) => { return this.getLabels(code,"NewEntryForm");};
  getOntologyRefSelectorLabels = (code) => { return this.getLabels(code,"OntologyRefSelector");};
  getPageAboutLabels = (code) => { return this.getLabels(code,"pageAbout");};
  getPageLoginLabels = (code) => { return this.getLabels(code,"pageLogin");};
  getParaColTextEditorLabels = (code) => { return this.getLabels(code,"ParaColTextEditor");};
  getResultsTableLabels = (code) => { return this.getLabels(code,"resultsTable");};
  getRichEditorLabels = (code) => { return this.getLabels(code,"RichEditor");};
  getSchemaBasedAddButtonLabels = (code) => { return this.getLabels(code,"schemaBasedAddButton");};
  getSearchGenericLabels = (code) => { return this.getLabels(code,"SearchGeneric");};
  getSearchLabels = (code) => { return this.getLabels(code,"search");};
  getSearchLinksLabels = (code) => { return this.getLabels(code,"searchLinks");};
  getSearchNotesLabels = (code) => { return this.getLabels(code,"searchNotes");};
  getSearchOntologyLabels = (code) => { return this.getLabels(code,"searchOntology");};
  getSearchTemplatesLabels = (code) => { return this.getLabels(code,"searchTemplates");};
  getSearchTreebanksLabels = (code) => { return this.getLabels(code,"searchTreebanks");};
  getTemplateEditorLabels = (code) => { return this.getLabels(code,"TemplateEditor");};
  getTemplateForTableLabels = (code) => { return this.getLabels(code,"templateForTable");};
  getTemplateLabels = (code) => { return this.getLabels(code,"template");};
  getTextNoteEditorLabels = (code) => { return this.getLabels(code,"TextNoteEditor");};
  getTokenTaggerLabels = (code) => { return this.getLabels(code,"TokenTagger");};
  getTopicsSelectorLabels = (code) => { return this.getLabels(code,"TopicsSelector");};
  getTreebankSearchResultsTableLabels= (code) => {return this.getLabels(code,"treebanksResultsTable");};
  getUiLabelEditorLabels = (code) => {return this.getLabels(code,"UiLabelEditor");};
  getViewReferencesLabels = (code) => { return this.getLabels(code,"ViewReferences");};
  getViewRelationshipsLabels = (code) => { return this.getLabels(code,"ViewRelationships");};
  getWorkflowAssignmentLabels = (code) => { return this.getLabels(code,"WorkflowAssignment");};
  getWorkflowFormLabels = (code) => { return this.getLabels(code,"WorkflowForm");};
}

export default Labels;