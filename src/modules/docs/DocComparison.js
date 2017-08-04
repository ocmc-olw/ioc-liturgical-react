import React from 'react';
import ScreenShot from '../../images/SsVersionCompare';

class DocComparison extends React.Component {
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
}
export default DocComparison;
