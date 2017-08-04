import React from 'react'
import SsSearchResultYourKingdomOf from '../../images/SsSearchResultYourKingdomOf';
import SsShowingRows from '../../images/SsSearchShowingRows';

class DocSearchResults extends React.Component {
  render() {
    return (
    <div className="App-help-doc-search-results">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocSearchResultsP01a} <em>your kingdom of</em>
        </p>
        <SsSearchResultYourKingdomOf />
        <p>
          {this.props.labels.secDocSearchResultsP02}
          </p>
        <ol>
          <li>
            {this.props.labels.secDocSearchResultsP03}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP04}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP05}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP06}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP07}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP08}
          </li>
          <li>
            {this.props.labels.secDocSearchResultsP09}
          </li>
        </ol>
        <p>
          {this.props.labels.secDocSearchResultsP10}
        </p>
        <SsShowingRows />
        <p>
          {this.props.labels.secDocSearchResultsP11}
        </p>
      </div>
    </div>
    )
  }
}

export default DocSearchResults;
