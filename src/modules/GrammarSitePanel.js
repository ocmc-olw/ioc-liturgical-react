import React from 'react';
import PropTypes from 'prop-types';
import {
  Panel
} from 'react-bootstrap';

/**
 * Use this as an example starting point for new React components
 */
class GrammarSitePanel extends React.Component {
  constructor(props) {
    super(props);
    this.showWindow = this.showWindow.bind(this);
  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
  };

  // not used, but this is an alternative.  But sometimes browsers block popups
  showWindow = (url) => {
    window.open(url, "", "fullscreen=no");
  };

  render() {

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
