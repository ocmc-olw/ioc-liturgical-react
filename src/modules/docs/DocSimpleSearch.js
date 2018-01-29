import React from 'react';
import FontAwesome from 'react-fontawesome';

class DocSimpleSearch extends React.Component {
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
          <li>{this.props.labels.secDocSimpleSearchP04} <FontAwesome name={"search"}/> Submit.</li>
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
}

export default DocSimpleSearch;