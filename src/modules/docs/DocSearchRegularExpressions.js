import React from 'react';
import SsRegEx from '../../images/SsRegEx';
import SsRegExResult from '../../images/SsRegExResult';
import PropTypes from "prop-types";

class DocSearchRegularExpressions extends React.Component {
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
    <div className="App-help-doc-regex-search">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocSearchRegExP01}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP02}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP03}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP04}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP05}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP06}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchRegExP07}
        </p>
        <SsRegEx/>
        <p/>
        <p>
          {this.state.labels.searchSecDocSearchRegExP08}
        </p>
        <SsRegExResult/>
        <p/>
        <p>
          {this.state.labels.searchSecDocSearchRegExP09}
        </p>
        <ul>
          <li>{this.state.labels.searchSecDocSearchRegExP10}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP11}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP12}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP13}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP14}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP15}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP16}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP17}</li>
          <li>{this.state.labels.searchSecDocSearchRegExP18}</li>
        </ul>
        <p>
          {this.state.labels.searchSecDocSearchRegExP19}
        </p>
      </div>
    </div>
    )
  }
}

DocSearchRegularExpressions.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocSearchRegularExpressions;