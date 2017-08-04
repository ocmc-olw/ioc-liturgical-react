import React from 'react';
import PropTypes from 'prop-types';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';

import {ControlLabel, Well} from 'react-bootstrap';
import {Chart} from 'react-google-charts';

class DependencyDiagram extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.node = this.node.bind(this);
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

  handleCallback = (selection) => {
    console.log('selected', selection);
  }

  render() {
        return (
            <div className="App App-DependencyDiagram-Container">
                <div>{this.state.labels.thisClass.instructions}</div>
                <Well>
                  <div className={'my-pretty-chart-container'}>
                    <Chart
                        chartType="OrgChart"
                        data={[
                          this.node('Root','', '', '', '', '', '')
                          , this.node('0','4', 'ὁ', 'ὁ', 'the','ATR','DET.M.SG.NOM')
                          , this.node('1','4', 'κραταιός', 'κραταιός','mighty','ATR','ADJ.M.SG.NOM')
                          , this.node('2','1', 'ἐν', 'ἐν', 'in', 'AuxP','PREP')
                          , this.node('3','2', 'πολέμοις', 'πόλεμος', 'wars','ATR','NOUN.M.PL.DAT')
                          , this.node('4','Root', 'Κύριος', 'κύριος', 'Lord', 'ST-ROOT-SUBJ','NOUN.M.SG.NOM')
                          , this.node('5','', '˙', '˙',  ':','APOS','PM')
                        ]}
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

                        chartEvents={[{
                          eventName: 'select',
                          callback(Chart) {
                          var selectedItem = Chart.chart.getSelection()[0];
                          if (selectedItem) {
                            console.log(selectedItem.row);
                          }
                          },
                        }]
                       }
                    />
                  </div>
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
