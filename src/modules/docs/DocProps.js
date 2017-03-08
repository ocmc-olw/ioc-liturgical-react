import React from 'react'
export default React.createClass({
  render() {
    return (
    <div className="App-help-doc-props">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocPropsP01}
        </p>
        <ol>
          <li>ID</li>
          <li>value</li>
          <li>nnp</li>
        </ol>
        <p>
          {this.props.labels.secDocPropsP02}
        </p>
        <p>
          {this.props.labels.secDocPropsP03}
        </p>
      </div>
    </div>
    )
  }
})
