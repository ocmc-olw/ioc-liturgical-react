import React from 'react'
import MeM1D1A1 from '../../images/MeM1D1A1';
import PropTypes from "prop-types";

class DocIds extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      labels: props.session.labels[props.session.labelTopics.help]
    };
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(
        {
          labels: nextProps.session.labels[nextProps.session.labelTopics.help]
        }
    );
  };


  render() {
    return (
        <div className="App-help-doc-ids">
          <div className="jumbotron">
            <p>
              {this.state.labels.searchSecDocIdP01}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP02}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP03}
            </p>
            <ol>
              <li>{this.state.labels.searchHeaderDomain}</li>
              <li>{this.state.labels.searchHeaderTopic}</li>
              <li>{this.state.labels.searchHeaderKey}</li>
            </ol>
            <p>
              {this.state.labels.searchSecDocIdP04}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP05}
            </p>
            <MeM1D1A1 />
            <p>
              {this.state.labels.searchSecDocIdP06}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP07}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP08}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP09}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP10}
            </p>
            <ol>
              <li>{this.state.labels.searchSecDocIdP11}</li>
              <li>{this.state.labels.searchSecDocIdP12}</li>
              <li>{this.state.labels.searchSecDocIdP13}</li>
            </ol>
            <p>
              {this.state.labels.searchSecDocIdP14}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP15}
            </p>
            <p>
              {this.state.labels.searchSecDocIdP16}
            </p>
          </div>
        </div>
    )
  }
}

DocIds.propTypes = {
  session: PropTypes.object.isRequired
};

export default DocIds;
