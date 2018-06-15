import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from "prop-types";

class DocSimpleSearch extends React.Component {

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
    <div className="App-help-doc-simple-search">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocSimpleSearchP01}
        </p>
        <p>
          {this.state.labels.searchSecDocSimpleSearchP02}
        </p>
        <ol>
          <li>{this.state.labels.searchSecDocSimpleSearchP03}</li>
          <li>{this.state.labels.searchSecDocSimpleSearchP04} <FontAwesome name={"search"}/> Submit.</li>
        </ol>
        <p>
          {this.state.labels.searchSecDocSimpleSearchP05}
        </p>
        <p>
          {this.state.labels.searchSecDocSimpleSearchP06}
        </p>
      </div>
    </div>
    )
  }
}
DocSimpleSearch.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocSimpleSearch;