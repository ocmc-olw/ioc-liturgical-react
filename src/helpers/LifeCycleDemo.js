import React from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import LifeCycleDemoSubComponent from './LifeCycleDemoSubComponent'
/**
 * Demonstrates the life cycle of a React component
 */
class LifeCycleDemo extends React.Component {
  /**
   * Use the constructor to set the state for things
   * whose value will never change during the life-cycle
   * @param props
   */
  constructor(props) {
    super(props);
    this.state = {
      previous: ""
      , stage: "a"
      , selectedLanguage: "en"
    }
    this.handleSelection = this.handleSelection.bind(this);
    this.report = this.report.bind(this);
    this.report("constructor");
  }

  componentWillMount = () => {
    this.report("componentWillMount");
  }

  /**
   * Use componentDidMount to
   */
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

  handleSelection = (event) => {
    this.setState({
      selectedLanguage: event
    });
  }

  render() {
        return (
            <div>
              <DropdownButton
                  bsStyle="primary"
                  title="Select Language for Greeting"
                  key={"btn"}
                  id={"btn-1"}
                  onSelect={this.handleSelection}
              >
                <MenuItem eventKey="en">English</MenuItem>
                <MenuItem eventKey="el">Greek</MenuItem>
              </DropdownButton>
              <LifeCycleDemoSubComponent
                  languageCode={this.state.selectedLanguage}
              />
            </div>
        )
  }
}

LifeCycleDemo.propTypes = {
    languageCode: PropTypes.string.isRequired
};

LifeCycleDemo.defaultProps = {
};

export default LifeCycleDemo;
