import React from 'react';
import ScreenShot from '../../images/SsVersionCompare';

export default React.createClass({
  render() {
    return (
    <div className="App-help-doc-comparison">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocVersionComparisonP01}
        </p>
        <ScreenShot/>
      </div>
    </div>
    )
  }
})
