import React from 'react';
import FontAwesome from 'react-fontawesome';
import SsInitial from '../../images/SsSearchAvancedInitial';
import SsBiblicalInitial from '../../images/SsSearchAvancedBiblicalInitial';
import SsLiturgicalInitial from '../../images/SsSearchAvancedLiturgicalInitial';
export default React.createClass({
  render() {
    return (
    <div className="App-help-doc-advanced-search">
      <div className="jumbotron">
        <p>
          {this.props.labels.secDocSearchAdvancedP01}
        </p>
        <SsInitial />
        <p>
          {this.props.labels.secDocSearchAdvancedP02}
        </p>
        <ol>
          <li>
            {this.props.labels.secDocSearchAdvancedP03}
          </li>
          <ul>
            <li>{this.props.labels.secDocSearchAdvancedP04}</li>
            <li>{this.props.labels.secDocSearchAdvancedP05}</li>
            <li>{this.props.labels.secDocSearchAdvancedP06}</li>
          </ul>
          <li>
            {this.props.labels.secDocSearchAdvancedP07}
          </li>
        </ol>
        <p>
          {this.props.labels.secDocSearchAdvancedP08}
        </p>
        <SsBiblicalInitial/>
        <p>
          {this.props.labels.secDocSearchAdvancedP09}
        </p>
      <SsLiturgicalInitial/>
        <p>
          {this.props.labels.secDocSearchAdvancedP10} {this.props.labels.secDocSearchAdvancedP11}
        </p>
        <p>
          {this.props.labels.secDocSearchAdvancedP12}
        </p>
        <ol>
          <li>{this.props.labels.secDocSearchAdvancedP13}</li>
            <ul>
              <li>ID</li>
              <li>Value (insensitive)</li>
              <li>Value (sensitive)</li>
            </ul>
          <li>{this.props.labels.secDocSearchAdvancedP14}</li>
            <ul>
              <li>{this.props.labels.matchesAtTheStart}</li>
              <li>{this.props.labels.matchesAnywhere}</li>
              <li>{this.props.labels.matchesAtTheEnd}</li>
              <li>{this.props.labels.matchesRegEx}</li>
            </ul>
          <li>
            {this.props.labels.secDocSearchAdvancedP19}
          </li>
          <li>
            {this.props.labels.secDocSearchAdvancedP20} <FontAwesome name="search"/>
          </li>
        </ol>
        <p>{this.props.labels.secDocSearchAdvancedP21}:</p>
        <ul>
          <li>
            {this.props.labels.secDocSearchAdvancedP22}
          </li>
          <li>
            {this.props.labels.secDocSearchAdvancedP23}
          </li>
          <li>
            {this.props.labels.secDocSearchAdvancedP24}
          </li>
          <li>
            {this.props.labels.secDocSearchAdvancedP25}
          </li>
        </ul>
        <p>
          {this.props.labels.secDocSearchAdvancedP26}
        </p>
      </div>
    </div>
    )
  }
})
