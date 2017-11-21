import React from 'react';
import PropTypes from 'prop-types';

/**
 * Demonstrates the life cycle of a React component
 */
class LifeCycleDemoSubComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previous: ""
      , stage: "a"
    }
    this.report = this.report.bind(this);
    this.greet = this.greet.bind(this);
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
    console.log(`LifeCycleDemoSubComponent.${method} previous: ${this.state.previous} stage: ${this.state.stage}`);
  }

  greet = () => {
    if (this.props.languageCode === "en") {
      return (<div>Hello!</div>);
    } else if (this.props.languageCode === "el") {
      return (<div>Για!</div>);
    } else {
      return (<div>I don't understand that language!</div>)
    }
  }

  render() {
        return (
            <div>{this.greet()}</div>
        )
  }
}

LifeCycleDemoSubComponent.propTypes = {
    languageCode: PropTypes.string.isRequired
};

LifeCycleDemoSubComponent.defaultProps = {
};

export default LifeCycleDemoSubComponent;
