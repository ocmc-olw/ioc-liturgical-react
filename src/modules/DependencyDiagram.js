import React from 'react';
import PropTypes from 'prop-types';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';

import {Well} from 'react-bootstrap';
import { Chart } from 'react-google-charts';

/**
 * react-google-charts uses Google Charts.
 * We are using the orgchart to render dependency diagrams.
 * For options see:
 * https://developers.google.com/chart/interactive/docs/gallery/orgchart
 */
class DependencyDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    // chartEvents is left here, but is not useful.
    // the select event does not return enough information
    // to be useful for our purposes
        this.chartEvents = [
          {
            eventName: 'select',
            callback(Chart) {
//              console.log('Selected ', Chart.chart.getSelection());
            },
          },
        ];

    this.node = this.node.bind(this);
    this.getTreeData = this.getTreeData.bind(this);
    this.handleCallback = this.handleCallback.bind(this);

  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
          labels: {
            thisClass: Labels.getDependencyDiagramLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
          , treeData: this.getTreeData()
        }
    )
  }

  node = (
      id
      , dependsOn
      , token
      , lemma
      , gloss
      , label
      , grammar
  ) => {
    let n = 0;
    n = parseInt(id);
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
  }

  getTreeData = () => {
    let treeData = [];
    treeData.push(
        this.node("Root"
            , ""
            , ""
            , ""
            , ""
            , ""
            , ""
        )
    );
    for (let i=0; i < this.props.data.length; i++) {
      let parms = this.props.data[i];
      treeData.push(
          this.node(parms.key
              , parms.dependsOn
              , parms.token
              , parms.lemma
              , parms.gloss
              , parms.label
              , parms.grammar
          )
      );
    }
    return treeData;
  }

  handleCallback = (selection) => {
    console.log('selected', selection);
  }

  render() {
    return (
        <div className="App App-DependencyDiagram-Container">
          <div>{this.state.labels.thisClass.instructions}</div>
          <Well className="App-DependencyDiagram-Container">
              <Chart
                  chartType="OrgChart"
                  data={this.state.treeData}
                  options={
                    {
                      allowCollapse: true
                      , allowHtml: true
                      , nodeClass: "AppDependencyNode"
                      , selectedNodeClass: "AppDependencySelectedNode"
                      , size: this.props.size
                      , title: "ὁ κραταιός ἐν πολέμοις Κύριος˙"
                    }
                  }
                  graph_id="DependencyDiagram"
                  width={this.props.width}
                  height={this.props.height}
                  chartPackages={['corechart', 'orgchart']}

                  chartEvents={this.chartEvents}
              />
          </Well>
        </div>
    )
  }
}

DependencyDiagram.propTypes = {
  languageCode: PropTypes.string.isRequired
  , data: PropTypes.array.isRequired
  , size: PropTypes.string.isRequired
  , width: PropTypes.string.isRequired
  , height: PropTypes.string.isRequired
  , onSelect: PropTypes.func
};

DependencyDiagram.defaultProps = {
};

export default DependencyDiagram;