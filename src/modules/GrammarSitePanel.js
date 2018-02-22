import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
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

    const TheLinks = () => (
        <div>
          {this.props.lemmas.map(lemma => (
              <div key={this.props.title + lemma}>
                  <a
                      target="_blank"
                      href={this.props.url + lemma}
                      rel={"noopener noreferrer"}
                  >{lemma}</a>
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
                <TheLinks key={this.props.title}/>
              </Panel>
            </div>
        )
  }
}

GrammarSitePanel.propTypes = {
    languageCode: PropTypes.string.isRequired
    , lemmas: PropTypes.array.isRequired
    , url: PropTypes.string.isRequired
    , title: PropTypes.string.isRequired
};

GrammarSitePanel.defaultProps = {
};

export default GrammarSitePanel;
