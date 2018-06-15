import React from 'react';
import FontAwesome from 'react-fontawesome';
import SsInitial from '../../images/SsSearchAvancedInitial';
import SsBiblicalInitial from '../../images/SsSearchAvancedBiblicalInitial';
import SsLiturgicalInitial from '../../images/SsSearchAvancedLiturgicalInitial';
import PropTypes from "prop-types";

class DocSearchAdvanced extends React.Component {
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
    <div className="App-help-doc-advanced-search">
      <div className="jumbotron">
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP01}
        </p>
        <SsInitial />
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP02}
        </p>
        <ol>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP03}
          </li>
          <ul>
            <li>{this.state.labels.searchSecDocSearchAdvancedP04}</li>
            <li>{this.state.labels.searchSecDocSearchAdvancedP05}</li>
            <li>{this.state.labels.searchSecDocSearchAdvancedP06}</li>
          </ul>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP07}
          </li>
        </ol>
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP08}
        </p>
        <SsBiblicalInitial/>
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP09}
        </p>
      <SsLiturgicalInitial/>
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP10} {this.state.labels.searchSecDocSearchAdvancedP11}
        </p>
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP12}
        </p>
        <ol>
          <li>{this.state.labels.searchSecDocSearchAdvancedP13}</li>
            <ul>
              <li>ID</li>
              <li>Value (insensitive)</li>
              <li>Value (sensitive)</li>
            </ul>
          <li>{this.state.labels.searchSecDocSearchAdvancedP14}</li>
            <ul>
              <li>{this.state.labels.searchMatchesAtTheStart}</li>
              <li>{this.state.labels.searchMatchesAnywhere}</li>
              <li>{this.state.labels.searchMatchesAtTheEnd}</li>
              <li>{this.state.labels.searchMatchesRegEx}</li>
            </ul>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP19}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP20} <FontAwesome name="search"/>
          </li>
        </ol>
        <p>{this.state.labels.searchSecDocSearchAdvancedP21}:</p>
        <ul>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP22}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP23}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP24}
          </li>
          <li>
            {this.state.labels.searchSecDocSearchAdvancedP25}
          </li>
        </ul>
        <p>
          {this.state.labels.searchSecDocSearchAdvancedP26}
        </p>
      </div>
    </div>
    )
  }
}
DocSearchAdvanced.propTypes = {
  session: PropTypes.object.isRequired
};
export default DocSearchAdvanced;
