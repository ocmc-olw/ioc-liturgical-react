import React from 'react'
import SsSearchTypes from '../../images/SsSearchTypes';
export default React.createClass({
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
})
