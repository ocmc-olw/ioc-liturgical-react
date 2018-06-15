import React from 'react'
import SsSearchTypes from '../../images/SsSearchTypes';
import PropTypes from "prop-types";

class DocSearchTypes extends React.Component {

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
    <div className="App-help-doc-search-types">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocSearchTypesP01}
        </p>
        <SsSearchTypes />
        <p>
          {this.state.labels.searchSecDocSearchTypesP02}
        </p>
      </div>
    </div>
    )
  }
}
DocSearchTypes.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocSearchTypes;
