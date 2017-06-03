import React from 'react';
import server from '../helpers/Server';
import {
  ControlLabel
  , Panel
  , PanelGroup
  , Well
} from 'react-bootstrap';
import Iframe from 'react-iframe';
import Labels from '../Labels';
import IdManager from '../helpers/IdManager';
import MessageIcons from '../helpers/MessageIcons';
import HyperTokenText from './HyperTokenText';
import DependencyDiagram from './DependencyDiagram';
import TreeNodeBuilder from '../helpers/TreeNodeBuilder';

import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class Grammar extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.setTextInfo = this.setTextInfo.bind(this);
    this.handleTokenClick = this.handleTokenClick.bind(this);
    this.getPanels = this.getPanels.bind(this);
    this.handleRowSelect = this.handleRowSelect.bind(this);
    this.getBody = this.getBody.bind(this);
    this.handleTreeNodeBuilderCallback = this.handleTreeNodeBuilderCallback.bind(this);
  }

  componentWillMount = () => {
    this.fetchData();
  }

  componentWillReceiveProps = (nextProps) => {
    let nextId = IdManager.toId("gr_gr_cog", nextProps.idTopic, nextProps.idKey);
    this.state = this.setTheState(
        nextProps
        , this.state.text
        , this.state.dropdownsLoaded
        , this.state.data
        , this.state.tokens
        , this.state.analyses
    );
    if (this.state.text && this.state.text.id !== nextId) {
      this.fetchData();
    }
  }

  setTheState = (props, text, dropdownsLoaded, data, tokens, analyses) => {
    return (
        {
          labels: {
            thisClass: Labels.getGrammarLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , options: {
            sizePerPage: 30
            , sizePerPageList: [5, 15, 30]
            , onSizePerPageList: this.onSizePerPageList
            , hideSizePerPage: true
            , paginationShowsTotal: true
          }
          ,
          selectRow: {
            mode: 'radio' // or checkbox
            , hideSelectColumn: false
            , clickToSelect: false
            , onSelect: this.handleRowSelect
            , className: "App-row-select"
          }
          , id: IdManager.toId("gr_gr_cog", this.props.idTopic, this.props.idKey)
          , props: props
          , text: text
          , dropdownsLoaded: dropdownsLoaded
          , data: data
          , tokens: tokens
          , analyses: analyses
        }
    )
  }

  fetchData = () => {
    server.getTextAnalysis(
        this.props.restServer
        , this.props.username
        , this.props.password
        , this.state.id
        , this.setTextInfo
    );
  }

  setTextInfo = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        dropdownsLoaded: true
        , data: restCallResult.data.values[0].text
        , tokens: restCallResult.data.values[1].tokens
        , analyses: restCallResult.data.values[2].analyses
      });
    }
  }


  handleTokenClick = (index, token) => {
    this.setState({
      selectedTokenIndex: index
      , selectedToken: token
      , selectedLemma: this.state.analyses[token][0].lemmaGreek
    });
  }

  handleRowSelect = (row, isSelected, e) => {
    let idParts = row["id"].split("~");
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
    });
  }

  handleTreeNodeBuilderCallback = () => {

  }

  getPanels = () => {
    if (this.state.selectedToken) {
      return (
          <PanelGroup defaultActiveKey="analyses">
            <Panel
                header={
                  "Tree Builder"
                }
                eventKey="treebuilder"
                collapsible
            >
              <TreeNodeBuilder
                  languageCode={this.props.languageCode}
                  index={this.state.selectedTokenIndex}
                  tokens={this.state.tokens}
                  token={this.state.selectedToken}
                  grammar=""
                  callBack={this.handleTreeNodeBuilderCallback}
              />
            </Panel>
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
                >{this.state.labels.thisClass.colLemma}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='glosses'
                >{this.state.labels.thisClass.colGlosses}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='parse'
                >{this.state.labels.thisClass.colParse}</TableHeaderColumn>
                <TableHeaderColumn
                    dataField='concise'
                    width="40%"
                >{this.state.labels.thisClass.colAnalyses}</TableHeaderColumn>
              </BootstrapTable>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelLogeionSite + ": " + this.state.selectedLemma}
                eventKey="logeion"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://logeion.uchicago.edu/index.html#"
                    + this.state.selectedLemma
                    }
                />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelLexigramSite + ": " + this.state.selectedToken}
                eventKey="lexigram"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.lexigram.gr/lex/arch/"
                    + this.state.selectedToken
                    }
                />
              </div>
            </Panel>
            <Panel
                  className="App-Grammar-Site-panel"
                  header={this.state.labels.thisClass.panelPerseusSite + ": " + this.state.selectedToken}
                  eventKey="perseus"
                  collapsible
              >
              <div className="App-iframe-wrapper">
              <Iframe
                  position="relative"
                  height="500px"
                  url={"http://www.perseus.tufts.edu/hopper/morph?l="
                  + this.state.selectedToken
                  + "&la=greek"
                  }
              />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelLaParola + ": " + this.state.selectedLemma}
                eventKey="laparola"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.laparola.net/greco/parola.php?p="
                    + this.state.selectedLemma
                    }
                />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelKriaras + ": " + this.state.selectedLemma}
                eventKey="kriaras"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.greek-language.gr/greekLang/medieval_greek/kriaras/search.html?lq="
                    + this.state.selectedLemma
                    }
                />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelTriantafyllides + ": " + this.state.selectedLemma}
                eventKey="Triantafyllides"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.greek-language.gr/greekLang/modern_greek/tools/lexica/triantafyllides/search.html?dq=&lq="
                    + this.state.selectedLemma
                    }
                />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelBasicLexicon + ": " + this.state.selectedLemma}
                eventKey="BasicLexicon"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.greek-language.gr/greekLang/ancient_greek/tools/lexicon/search.html?lq="
                    + this.state.selectedLemma
                    }
                />
              </div>
            </Panel>
            <Panel
                className="App-Grammar-Site-panel "
                header={this.state.labels.thisClass.panelSmyth}
                eventKey="smyth"
                collapsible
            >
              <div className="App-iframe-wrapper">
                <Iframe
                    position="relative"
                    height="1000px"
                    url={"http://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.04.0007"
                    }
                />
              </div>
            </Panel>
          </PanelGroup>
      )
    } else {
      return (<div></div>);
    }
  }

  getBody = () => {
      return (
          <div>
            <Panel
                header="Dependency Diagram"
                eventKey="dependencyDiagram"
                collapsible
                defaultExpanded={false}
            >
              <DependencyDiagram
                  languageCode={this.props.languageCode}
                  data={['hi']}
                  size="medium"
                  width="100%"
                  height="500px"
              />
            </Panel> {/* Dependency Diagram */}
            <HyperTokenText
                languageCode={this.props.languageCode}
                tokens={this.state.tokens ? this.state.tokens : []}
                id={this.state.id}
                onClick={this.handleTokenClick}
            />
            {
              this.state.selectedToken &&
              this.getPanels()
            }
          </div>
      );
  }
  render() {
      return (
          <div className="App App-Grammar">
            <Well>
              <ControlLabel>{this.state.labels.thisClass.title + this.state.id}</ControlLabel>
              {this.getBody()}
            </Well>
          </div>
      )
  }
}

Grammar.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , languageCode: React.PropTypes.string.isRequired
  , idTopic: React.PropTypes.string.isRequired
  , idKey: React.PropTypes.string.isRequired
};

Grammar.defaultProps = {
};

export default Grammar;
