import React from 'react'
import MeM1D1A1 from '../../images/MeM1D1A1';

class DocIds extends React.Component {
  render() {
    return (
        <div className="App-help-doc-ids">
          <div className="jumbotron">
            <p>
              {this.props.labels.secDocIdP01}
            </p>
            <p>
              {this.props.labels.secDocIdP02}
            </p>
            <p>
              {this.props.labels.secDocIdP03}
            </p>
            <ol>
              <li>{this.props.labelDomain}</li>
              <li>{this.props.labelTopic}</li>
              <li>{this.props.labelKey}</li>
            </ol>
            <p>
              {this.props.labels.secDocIdP04}
            </p>
            <p>
              {this.props.labels.secDocIdP05}
            </p>
            <MeM1D1A1 />
            <p>
              {this.props.labels.secDocIdP06}
            </p>
            <p>
              {this.props.labels.secDocIdP07}
            </p>
            <p>
              {this.props.labels.secDocIdP08}
            </p>
            <p>
              {this.props.labels.secDocIdP09}
            </p>
            <p>
              {this.props.labels.secDocIdP10}
            </p>
            <ol>
              <li>{this.props.labels.secDocIdP11}</li>
              <li>{this.props.labels.secDocIdP12}</li>
              <li>{this.props.labels.secDocIdP13}</li>
            </ol>
            <p>
              {this.props.labels.secDocIdP14}
            </p>
            <p>
              {this.props.labels.secDocIdP15}
            </p>
            <p>
              {this.props.labels.secDocIdP16}
            </p>
          </div>
        </div>
    )
  }
}

export default DocIds;
