import React from 'react';
import FontAwesome from 'react-fontawesome';

export default React.createClass({
  render() {
    return (
    <div className="App-help-doc-simple-search">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocSimpleSearchP01}
        </p>
        <p>
          {this.props.labels.secDocSimpleSearchP02}
        </p>
        <ol>
          <li>{this.props.labels.secDocSimpleSearchP03}</li>
          <li>{this.props.labels.secDocSimpleSearchP04} <FontAwesome name={"search"}/>.</li>
        </ol>
        <p>
          {this.props.labels.secDocSimpleSearchP05}
        </p>
        <p>
          {this.props.labels.secDocSimpleSearchP06}
        </p>
      </div>
    </div>
    )
  }
})
