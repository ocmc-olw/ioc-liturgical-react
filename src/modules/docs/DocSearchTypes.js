import React from 'react'
import SsSearchTypes from '../../images/SsSearchTypes';

class DocSearchTypes extends React.Component {
  render() {
    return (
    <div className="App-help-doc-search-types">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocSearchTypesP01}
        </p>
        <SsSearchTypes />
        <p>
          {this.props.labels.secDocSearchTypesP02}
        </p>
      </div>
    </div>
    )
  }
}

export default DocSearchTypes;
