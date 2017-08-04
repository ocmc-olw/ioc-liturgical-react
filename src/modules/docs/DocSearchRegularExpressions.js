import React from 'react';
import SsRegEx from '../../images/SsRegEx';
import SsRegExResult from '../../images/SsRegExResult';

class DocSearchRegularExpressions extends React.Component {
  render() {
    return (
    <div className="App-help-doc-regex-search">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocSearchRegExP01}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP02}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP03}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP04}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP05}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP06}
        </p>
        <p>
          {this.props.labels.secDocSearchRegExP07}
        </p>
        <SsRegEx/>
        <p/>
        <p>
          {this.props.labels.secDocSearchRegExP08}
        </p>
        <SsRegExResult/>
        <p/>
        <p>
          {this.props.labels.secDocSearchRegExP09}
        </p>
        <ul>
          <li>{this.props.labels.secDocSearchRegExP10}</li>
          <li>{this.props.labels.secDocSearchRegExP11}</li>
          <li>{this.props.labels.secDocSearchRegExP12}</li>
          <li>{this.props.labels.secDocSearchRegExP13}</li>
          <li>{this.props.labels.secDocSearchRegExP14}</li>
          <li>{this.props.labels.secDocSearchRegExP15}</li>
          <li>{this.props.labels.secDocSearchRegExP16}</li>
          <li>{this.props.labels.secDocSearchRegExP17}</li>
          <li>{this.props.labels.secDocSearchRegExP18}</li>
        </ul>
        <p>
          {this.props.labels.secDocSearchRegExP19}
        </p>
      </div>
    </div>
    )
  }
}
export default DocSearchRegularExpressions;