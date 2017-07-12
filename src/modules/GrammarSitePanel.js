import React from 'react';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import {
  Panel
  , PanelGroup
} from 'react-bootstrap';
import Iframe from 'react-iframe';

/**
 * Use this as an example starting point for new React components
 */
class GrammarSitePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
  }

  render() {
    const ThePanels = () => (
        <div>
          {this.props.lemmas.map(lemma => (
              <div key={this.props.title + lemma}>
                <Panel
                    className="App-Grammar-Site-panel "
                    header={this.props.title + ": " + lemma}
                    eventKey={this.props.title + lemma}
                    collapsible
                >
                  <div className="App-iframe-wrapper">
                    <Iframe
                        position="relative"
                        height="1000px"
                        url={this.props.url
                        + lemma
                        }
                    />
                  </div>
                </Panel>
              </div>
          ))}
        </div>
    );


    return (
            <div>
              <Panel
                  className="App-Grammar-Site-panel"
                  header={this.props.title}
                  collapsible
              >
                <ThePanels/>
              </Panel>
            </div>
        )
  }
}

GrammarSitePanel.propTypes = {
    languageCode: React.PropTypes.string.isRequired
    , lemmas: React.PropTypes.array.isRequired
    , url: React.PropTypes.string.isRequired
    , title: React.PropTypes.string.isRequired
};

GrammarSitePanel.defaultProps = {
};

export default GrammarSitePanel;
