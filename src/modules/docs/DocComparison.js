import React from 'react';
import ScreenShot from '../../images/SsVersionCompare';
import PropTypes from "prop-types";

class DocComparison extends React.Component {
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
        <div className="App-help-doc-comparison">
          <div className="jumbotron">
            <p>
              {this.state.labels.searchSecDocVersionComparisonP01}
            </p>
            <ScreenShot/>
          </div>
        </div>
    )
  }
}
DocComparison.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocComparison;
