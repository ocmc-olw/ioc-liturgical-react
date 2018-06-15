import React from 'react'
import PropTypes from "prop-types";
class DocProps extends React.Component {
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
    <div className="App-help-doc-props">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocPropsP01}
        </p>
        <ol>
          <li>ID</li>
          <li>value</li>
          <li>nnp</li>
        </ol>
        <p>
          {this.state.labels.searchSecDocPropsP02}
        </p>
        <p>
          {this.state.labels.searchSecDocPropsP03}
        </p>
      </div>
    </div>
    )
  }
}
DocProps.propTypes = {
  session: PropTypes.object.isRequired
};


export default DocProps;