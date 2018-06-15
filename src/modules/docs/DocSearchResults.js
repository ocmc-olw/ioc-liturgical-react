import React from 'react'
import SsSearchResultYourKingdomOf from '../../images/SsSearchResultYourKingdomOf';
import SsShowingRows from '../../images/SsSearchShowingRows';
import PropTypes from "prop-types";

class DocSearchResults extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: props.session.labels[props.session.labelTopics.help]
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(
        {
          labels: nextProps.session.labels[nextProps.session.labelTopics.help]
        }
    );
  };

  render() {
    return (
    <div className="App-help-doc-search-results">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocSearchResultsP01a} <em>your kingdom of</em>
        </p>
        <SsSearchResultYourKingdomOf />
        <p>
          {this.state.labels.searchSecDocSearchResultsP02}
          </p>
        <ol>
          <li>
            {this.state.labels.searchSecDocSearchResultsP03}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP04}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP05}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP06}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP07}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP08}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchResultsP09}
          </li>
        </ol>
        <p>
          {this.state.labels.searchSecDocSearchResultsP10}
        </p>
        <SsShowingRows />
        <p>
          {this.state.labels.searchSecDocSearchResultsP11}
        </p>
      </div>
    </div>
    )
  }
}
DocSearchResults.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocSearchResults;
