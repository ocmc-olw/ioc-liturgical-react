import React from 'react';
import ReactDOM from 'react-dom';

export default class CodeExample extends React.Component {
  render() {
    return (
      <pre className="cm-s-solarized cm-s-light">
        <code>
          {this.props.codeText}
        </code>
      </pre>
    );
  }

}
