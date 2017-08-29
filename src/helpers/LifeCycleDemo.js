import React from 'react';
import PropTypes from 'prop-types';

/**
 * Demonstrates the life cycle of a React component
 */
class LifeCycleDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previous: ""
      , stage: "a"
    }
    this.report = this.report.bind(this);
    this.report("constructor");
  }

  componentWillMount = () => {
    this.report("componentWillMount");
  }

  componentDidMount = () => {
    this.setState((prevState, props) => {
      return {
        previous: prevState.stage
        , stage: "componentDidMount"
      }
    }, function () { return this.report("componentDidMount")});
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState((prevState, props) => {
      return {
        stage: "componentWillReceiveProps"
      }
    }, function () { return this.report("componentWillReceiveProps")});
  }

  report = (method) => {
    console.log(`LifeCycleDemo.${method} previous: ${this.state.previous} stage: ${this.state.stage}`);
  }

  render() {
        return (
            <div>{this.state && this.state.stage}</div>
        )
  }
}

LifeCycleDemo.propTypes = {
    languageCode: PropTypes.string.isRequired
};

LifeCycleDemo.defaultProps = {
};

export default LifeCycleDemo;
