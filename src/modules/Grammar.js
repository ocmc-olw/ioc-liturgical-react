import React from 'react';
import PropTypes from 'prop-types';
import Server from '../helpers/Server';
import {
  Button
  , Label
  , Panel
  , PanelGroup
  , Well
} from 'react-bootstrap';
import IdManager from '../helpers/IdManager';
import MessageIcons from '../helpers/MessageIcons';
import HyperTokenText from './HyperTokenText';
import DependencyDiagram from './DependencyDiagram';
import TokenTagger from '../helpers/TokenTagger'; // When convert to UD gram tags, use UdTokenTagger
import TreeViewUtils from '../helpers/TreeViewUtils';
import GrammarSitePanel from './GrammarSitePanel';
import SearchTreebanks from '../SearchTreebanks';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import FileSaver from "file-saver";

class Grammar extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.closeModal = this.closeModal.bind(this);
    this.getBody = this.getBody.bind(this);
    this.getDependencyDiagram = this.getDependencyDiagram.bind(this);
    this.getDependencyTreeAsLatex = this.getDependencyTreeAsLatex.bind(this);
    this.getDependencyTreeText = this.getDependencyTreeText.bind(this);
    this.getLatexNode = this.getLatexNode.bind(this);
    this.getLemmas = this.getLemmas.bind(this);
    this.getPanelBasicLexicon = this.getPanelBasicLexicon.bind(this);
    this.getPanelKriaras = this.getPanelKriaras.bind(this);
    this.getPanelLaParola = this.getPanelLaParola.bind(this);
    this.getPanelLexigram = this.getPanelLexigram.bind(this);
    this.getPanelLogeion = this.getPanelLogeion.bind(this);
    this.getPanelPerseusSite = this.getPanelPerseusSite.bind(this);
    this.getPanelPotentialAnalyses = this.getPanelPotentialAnalyses.bind(this);
    this.getPanels = this.getPanels.bind(this);
    this.getPanelSearchTreebanks = this.getPanelSearchTreebanks.bind(this);
    this.getPanelSmythGrammar = this.getPanelSmythGrammar.bind(this);
    this.getPanelTokenTagger = this.getPanelTokenTagger.bind(this);
    this.getPanelTriantafyllides = this.getPanelTriantafyllides.bind(this);
    this.handleEnglishLexiconCallback = this.handleEnglishLexiconCallback.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.handleTaggerCallback = this.handleTaggerCallback.bind(this);
    this.handleTokenClick = this.handleTokenClick.bind(this);
    this.node = this.node.bind(this);
    this.setTextInfo = this.setTextInfo.bind(this);
    this.showModal = this.showModal.bind(this);
    this.treeViewSelectCallback = this.treeViewSelectCallback.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps = (nextProps) => {
    let nextId = IdManager.toId("gr_gr_cog", nextProps.idTopic, nextProps.idKey);
    let full = false;
    if (nextProps.session
        && nextProps.session.userInfo
        && nextProps.session.userInfo.authenticated
    ) {
      full = true;
    }
    this.state = this.setTheState(
        nextProps
        , this.state.text
        , this.state.dropdownsLoaded
        , this.state.data
        , this.state.tokens
        , this.state.analyses
        , this.state.selectedTokenTags
        , this.state.nodeData
        , this.state.nodeDependencies
        , this.state.treeNodeData
        , this.state.selectedPerseus
        , this.state.selectedToken
        , this.state.selectedTokenIndexNumber
        , this.state.selectedTokenIsWord
        , full
    );
    if (this.state.text && this.state.text.id !== nextId) {
      this.fetchData();
    }
  };

  setTheState = (
      props
      , text
      , dropdownsLoaded
      , data
      , tokens
      , analyses
      , selectedTokenTags
      , nodeData
      , nodeDependencies
      , treeNodeData
      , selectedPerseus
      , selectedToken
      , selectedTokenIndexNumber
      , selectedTokenIsWord
      , full
  ) => {
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    return (
        {
          labels: {
            thisClass: labels[labelTopics.Grammar]
            , messages: labels[labelTopics.messages]
            , search: labels[labelTopics.search]
            , tokenTagger: labels[labelTopics.TokenTagger]
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: labels[labelTopics.messages].initial
          , full: full
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          , showModal: false
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , tableColumnFilter: {
          defaultValue: ""
          , type: 'RegexFilter'
          , placeholder: labels[labelTopics.messages].regEx
            }
          , id: IdManager.toId("gr_gr_cog", props.idTopic, this.props.idKey)
          , props: props
          , text: text
          , dropdownsLoaded: dropdownsLoaded
          , data: data
          , tokens: tokens
          , analyses: analyses
          , selectedTokenPanelTitle: labels[labelTopics.TokenTagger].panelTitle
          , selectedTokenTags: selectedTokenTags
          , nodeData: nodeData
          , nodeDependencies: nodeDependencies
          , treeNodeData: treeNodeData ? treeNodeData : {}
          , selectedPerseus: selectedPerseus ? selectedPerseus : {}
          , selectedToken: selectedToken
          , selectedTokenIsWord: selectedTokenIsWord
          , selectedTokenIndexNumber: selectedTokenIndexNumber ? selectedTokenIndexNumber : 1
      }
    )
  };

  fetchData = () => {
    Server.getTextAnalysis(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , this.state.id
        , this.setTextInfo
    );
    if (this.state.full) {
      Server.getTable(
          this.props.session.restServer
          , this.props.session.userInfo.username
          , this.props.session.userInfo.password
          , Server.tableLexiconOald
          , this.handleEnglishLexiconCallback
      );
    }
  };

  handleEnglishLexiconCallback = (restCallResult) => {
    if (restCallResult
        && restCallResult.data
        && restCallResult.data.values
        && restCallResult.data.values.length > 0
    ) {
      this.setState({
        englishLexiconLoaded: true
        , data: restCallResult.data.values[0]
      });
    }
  };


  inSelectionPath(key) {

  }

  setTextInfo = (restCallResult) => {
    if (restCallResult && restCallResult.data && restCallResult.data.values) {
      if (restCallResult.data.values.length > 3) {
        let nodeData = restCallResult.data.values[3].nodes;
        let treeViewUtils = new TreeViewUtils(nodeData);
        let nodeDependencies = treeViewUtils.nodeDependencies;
        let treeNodeData = treeViewUtils.toTreeViewData("Root");
        this.setState({
          dropdownsLoaded: true
          , data: restCallResult.data.values[0].text
          , tokens: restCallResult.data.values[1].tokens
          , analyses: restCallResult.data.values[2].analyses
          , nodeData: nodeData
          , nodeDependencies: nodeDependencies
          , treeNodeData: treeNodeData
        });
      }
    }
  };

  treeViewSelectCallback = (node) => {
    if (node && node.key) {
      this.handleTokenClick(
          node.key
          ,this.state.tokens[parseInt(node.key)]
      );
    }
  };

  getLatexNode = (node, latex, first) => {
    latex = "\\begin{mdframed}";
    if (first) {
      latex += "[everyline=true,style=dependency]";
    }
    latex += "\n";
    if (node.key === "Root") {
      latex += "\\grNode{Root}{}{}{}{}{}\n";
    } else {
      let label = node.label;
      if (label.endsWith("_CO")) {
        label = label.replace("_", "\\textunderscore ");
      }
      let gloss = node.gloss;
      gloss = gloss.replace(/\[/g, "{[}");
      gloss = gloss.replace(/\]/g, "{]}");

      latex += "\\grNode"
          + "{"
          + node.key
          + "}"
          + "{"
          + label
          + "}"
          + "{"
          + node.token
          + "}"
          + "{"
          + gloss
          + "}"
          + "{"
          + node.grammar
          + "}"
          + "{"
          + node.lemma
          + "}\n";
    }
    let _this = this;
    if (node.nodes) {
      latex += node.nodes.map(function(elem) {
        return _this.getLatexNode(elem, latex, false);
      }).join('');
    }
    latex += "\\end{mdframed}\n";
    return latex;
  };

  getDependencyTreeAsLatex = () => {
    let latex = this.getLatexNode(this.state.treeNodeData[0], "", true);
    var blob = new Blob([latex], {type: 'text/plain;charset=utf-8'});
    FileSaver.saveAs(blob, "test" + ".tex");
  };

  handleNodeClick = (index) => {
    this.handleTokenClick(
        index.toString()
        ,this.state.tokens[index]
    );
  };

  handleTokenClick = (index, token) => {
    let tokenIndex = parseInt(index);
    let panelIndex = tokenIndex + 1;
    let tokenIsWord = true;
    if (token.length < 2) {
      let notLetter = '"\'·.,;?!~@#$%^&z-z_[]{})(-:0123456789';
      if (notLetter.includes(token)) {
        tokenIsWord = false;
      }
    }
    let treeViewUtils = new TreeViewUtils(this.state.nodeData);
    let treeNodeData = treeViewUtils.toTreeViewData("Root", index);
    this.setState({
      selectedTokenIndex: index
      , selectedTokenIndexNumber: tokenIndex
      , selectedToken: token
      , selectedTokenIsWord: tokenIsWord
      , selectedAnalysis: this.state.analyses[token]
      , selectedNodeData: this.state.nodeData[tokenIndex]
      , selectedLemma: this.state.analyses[token][0].lemmaGreek
      , selectedLemmas: this.getLemmas(token)
      , selectedTokenPanelTitle: this.state.labels.tokenTagger.panelTitle
        + " "
        + panelIndex
        + " "
        + token
      , selectedPerseus: {
        lemma: ""
        , gloss: ""
        , pos: ""
        , grammar: ""
      }
      , treeNodeData: treeNodeData
  });
  };

  // Gets the set of lemmas from analyses for this token
  getLemmas = (token) => {
    let s = this.state.analyses[token].length;
    let lemmas = [];
    for (let i=0; i < s; i++) {
      let lemma = this.state.analyses[token][i].lemmaGreek;
      if (lemmas.indexOf(lemma) === -1) {
        lemmas.push(lemma);
      }
    }
    return lemmas;
  };

  handleRowSelect = (row) => {
    let idParts = row["id"].split("~");
    let conciseParts = row["concise"].split("/");
    let nodeData =this.state.nodeData;
    let selectedPerseus = {
      lemma: row["lemmaGreek"]
      , gloss: row["glosses"]
      , pos: row["partOfSpeech"]
      , grammar: conciseParts[2]
    };
    if (selectedPerseus.pos === "ARTICLE") {
      selectedPerseus.pos = "ART";
    }
    this.setState({
      selectedId: row["id"]
      , selectedIdParts: [
        {key: "domain", label: idParts[0]},
        {key: "topic", label: idParts[1]},
        {key: "key", label: idParts[2]}
      ]
      , selectedLemma: row["lemmaGreek"]
      , showIdPartSelector: true
      , showModalCompareDocs: true
      , selectedPerseus: selectedPerseus
    });
  };

  handleTaggerCallback = (treeNode) => {
    let nodeData = this.state.nodeData;
    let dependsOn = treeNode.dependsOn;
    let i = parseInt(treeNode.id);
    nodeData[i].dependsOn = dependsOn;
    nodeData[i].refersTo = treeNode.refersTo;
    nodeData[i].gloss = treeNode.gloss;
    nodeData[i].label = treeNode.label;
    nodeData[i].grammar = treeNode.grammar;
    let treeViewUtils = new TreeViewUtils(nodeData);
    let nodeDependencies = treeViewUtils.nodeDependencies;
    let treeNodeData = treeViewUtils.toTreeViewData("Root");

    this.setState({
      selectedTokenTags: treeNode
      , nodeData: nodeData
      , nodeDependencies: nodeDependencies
      , treeNodeData: treeNodeData
    });
  };

  getPanelTokenTagger = () => {
    if (this.state.full) {
      return (
          <Panel
              header={
                this.state.selectedTokenPanelTitle
              }
              eventKey="tagger"
              collapsible
          >
            <TokenTagger
                session={this.props.session}
                index={this.state.selectedTokenIndex}
                tokens={this.state.tokens}
                token={this.state.selectedToken}
                tokenAnalysis={this.state.selectedNodeData}
                copiedGloss={this.state.selectedPerseus.gloss}
                copiedLemma={this.state.selectedPerseus.lemma}
                copiedPos={this.state.selectedPerseus.pos}
                copiedGrammar={this.state.selectedPerseus.grammar}
                callBack={this.handleTaggerCallback}
            />
            {this.getPanelSearchTreebanks()}
          </Panel>
      )
    }
  };
  getPanelPotentialAnalyses = () => {
    if (this.state.selectedTokenIsWord) {
      return (
          <Panel
              className="App-Grammar-Analyses-panel"
              header={
                this.state.labels.thisClass.panelAnalyses
                + ": "
                + this.state.selectedToken
                + " ("
                + this.state.analyses[this.state.selectedToken].length
                + ")"
              }
              eventKey="analyses"
              collapsible
          >
            <BootstrapTable
                data={this.state.analyses[this.state.selectedToken]}
                trClassName={"App-data-tr"}
                striped
                hover
                search
                pagination
                selectRow={ this.state.selectRow }
                options={ this.state.options }
            >
              <TableHeaderColumn
                  isKey
                  dataField='id'
                  dataSort={ true }
                  hidden
              >ID</TableHeaderColumn>
              <TableHeaderColumn
                  dataField='lemmaGreek'
                  filter={ this.state.tableColumnFilter }
              >{this.state.labels.thisClass.colLemma}</TableHeaderColumn>
              <TableHeaderColumn
                  dataField='glosses'
                  dataSort={ true }
                  filter={ this.state.tableColumnFilter }
              >{this.state.labels.thisClass.colGlosses}</TableHeaderColumn>
              <TableHeaderColumn
                  dataField='parse'
                  dataSort={ true }
                  filter={ this.state.tableColumnFilter }
              >{this.state.labels.thisClass.colParse}</TableHeaderColumn>
              <TableHeaderColumn
                  dataField='concise'
                  filter={ this.state.tableColumnFilter }
              >{this.state.labels.thisClass.colAnalyses}</TableHeaderColumn>
              <TableHeaderColumn
                  dataField='source'
                  filter={ this.state.tableColumnFilter }
                  width="20%"
              >{this.state.labels.thisClass.colSource}</TableHeaderColumn>
            </BootstrapTable>
          </Panel>
      )
    } else {
      return (<Label/>);
    }
  };

  getPanelLogeion = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          <GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://logeion.uchicago.edu/index.html#"}
              title={this.state.labels.thisClass.panelLogeionSite}
          />
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelLexigram = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          < GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://www.lexigram.gr/lex/arch/"}
              title={this.state.labels.thisClass.panelLexigramSite}
          />
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelPerseusSite = () => {
    if (this.state.selectedTokenIsWord) {
      return (
          <Panel
              className="App-Grammar-Site-panel"
              header={this.state.labels.thisClass.panelPerseusSite + ": " + this.state.selectedToken}
              eventKey="perseus"
              collapsible
          >
            <a
                key={"perseus" + this.state.selectedToken}
                target="_blank"
                rel={"noopener noreferrer"}
                href={
              "http://www.perseus.tufts.edu/hopper/morph?l="
                + this.state.selectedToken
                + "&la=greek"
            }
            >{this.state.selectedToken}</a>
          </Panel>
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelLaParola = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          <GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://www.laparola.net/greco/parola.php?p="}
              title={this.state.labels.thisClass.panelLaParola}
          />
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelKriaras = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          <GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://www.greek-language.gr/greekLang/medieval_greek/kriaras/search.html?lq="}
              title={this.state.labels.thisClass.panelKriaras}
          />
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelTriantafyllides = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          <GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/search.html?dq=&lq="}
              title={this.state.labels.thisClass.panelTriantafyllides}
          />
      )
    } else {
      return (<Label/>);
    }
  };
  getPanelBasicLexicon = () => {
    if (this.state.selectedTokenIsWord && this.state.selectedLemmas) {
      return (
          <GrammarSitePanel
              languageCode={this.props.session.languageCode}
              lemmas={this.state.selectedLemmas}
              url={"http://www.greek-language.gr/greekLang/ancient_greek/tools/lexicon/search.html?lq="}
              title={this.state.labels.thisClass.panelBasicLexicon}
          />
      )
    } else {
      return (<Label/>);
    }
  };

  getPanelSearchTreebanks = () => {
    return (
          <Panel
              className="App-TokenTagger-Panel-Search-Treebanks"
              collapsible={true}
              header={this.state.labels.thisClass.panelTreebanks}
          >
            <SearchTreebanks
                session={this.props.session}
                editor={true}
                initialType={"PtbWord"}
                fixedType={false}
            />
          </Panel>
    )
  }

  getPanelSmythGrammar = () => {
    if (this.state.selectedTokenIsWord) {
      return (
          <Panel
              className="App-Grammar-Site-panel "
              header={this.state.labels.thisClass.panelSmyth}
              eventKey="smyth"
              collapsible
          >
            <a
                key="smyth"
                target="_blank"
                rel={"noopener noreferrer"}
                href="http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0007"
            >View</a>
          </Panel>
      )
    } else {
      return (<Label/>);
    }
  };

  getPanels = () => {
    if (this.state.selectedToken) {
      return (
          <PanelGroup defaultActiveKey="analyses">
            {this.getPanelTokenTagger()}
            {this.getPanelPotentialAnalyses()}
            {this.getPanelLogeion()}
            {this.getPanelLexigram()}
            {this.getPanelPerseusSite()}
            {this.getPanelLaParola()}
            {this.getPanelKriaras()}
            {this.getPanelTriantafyllides()}
            {this.getPanelBasicLexicon()}
            {this.getPanelSmythGrammar()}
            </PanelGroup>
      )
    } else {
      return (<div/>);
    }
  };

  node = (
      id
      , dependsOn
      , token
      , lemma
      , gloss
      , label
      , grammar
  ) => {
    let n = parseInt(id);
    n++;
    let result = [
          {
            v: id
            , f:
          "<span class='App AppDependencyNodeToken'>"
          + token
          + "</span>"
          + "<sup>"
          + n
          + "</sup>"
          + "<div class='App AppDependencyNodeLabel'>"
          + label
          + " / "
          + grammar
          + '</div>'
          + "<div>"
          + "<span class='App AppDependencyNodeGloss'>"
          + gloss
          + '</span>'
          + " / "
          + "<span class='App AppDependencyNodeLemma'>"
          + lemma
          + "</span>"
          + "</div>"
          }
          , dependsOn
          , grammar
        ]
    ;
    return (
        result
    );
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

  getDependencyDiagram = () => {
    if (this.state.full) {
      return (
          <Panel
              className="App-Grammar-Explorer-DependencyDiagram"
              collapsible={true}
              header={this.state.labels.thisClass.panelDependency}
          >
            <DependencyDiagram
                data={this.state.treeNodeData}
                onClick={this.treeViewSelectCallback}
                highlightSelected={true}
                offsetKey={true}
            />
            <Button onClick={this.getDependencyTreeAsLatex}>Get Latex</Button>
          </Panel>
      );
    }
  };

  getBody = () => {
      return (
          <div>
            { this.state.nodeData &&
              this.getDependencyDiagram()}
            <Well>
            <HyperTokenText
                session={this.props.session}
                tokens={this.state.tokens ? this.state.tokens : []}
                onClick={this.handleTokenClick}
                selectedToken={this.state.selectedTokenIndexNumber}
            />
            {
              this.state.selectedToken &&
              this.getPanels()
            }
            </Well>
          </div>
      );
  };

  getDependencyTreeText = () => {
    if (this.state.data && this.state.data.value) {
      return this.state.data.value;
    } else {
      return this.props.idTopic;
    }
  };

  render() {
      return (
          <div className="App App-Grammar">
            <Well className={"App-Grammar-Well"}>
                  {this.getBody()}
            </Well>
          </div>
      )
  }
}

Grammar.propTypes = {
  session: PropTypes.object.isRequired
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string.isRequired
  , text: PropTypes.string
};

Grammar.defaultProps = {
  text: "Dependency Diagram"
};

export default Grammar;
