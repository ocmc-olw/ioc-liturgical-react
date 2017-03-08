import React from 'react';
import {Accordion, Panel} from 'react-bootstrap'

import DocIds from './modules/docs/DocIds';
import DocProps from './modules/docs/DocProps';
import DocComparison from './modules/docs/DocComparison';
import DocSearchTypes from './modules/docs/DocSearchTypes';
import DocSimpleSearch from './modules/docs/DocSimpleSearch';
import DocSearchResults from './modules/docs/DocSearchResults';
import DocSearchAdvanced from './modules/docs/DocSearchAdvanced';
import DocRegEx from './modules/docs/DocSearchRegularExpressions';

class HelpSearch extends React.Component {
  render() {
    return (
        <div className="App-page App-help">
          <h2>{this.props.labels.help.pageTitle}</h2>
          <div className="jumbotron">
            <p>
              {this.props.labels.help.para01}
            </p>
            <p>
              {this.props.labels.help.para02}
            </p>
            <p>
              {this.props.labels.help.para03}
            </p>
            <Accordion>
              <Panel header={this.props.labels.help.secDocIds} eventKey="1">
                <DocIds
                    labelDomain={this.props.labels.resultsTable.headerDomain}
                    labelTopic={this.props.labels.resultsTable.headerTopic}
                    labelKey={this.props.labels.resultsTable.headerKey}
                    labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secDocProps} eventKey="2">
                <DocProps labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secDocSearchTypes} eventKey="3">
                <DocSearchTypes labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secSimpleSearch}  eventKey="4">
                <DocSimpleSearch labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secSearchResults} eventKey="6">
                <DocSearchResults labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secDocVersionComparisonTitle} eventKey="5">
                <DocComparison labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secAdvancedSearch} eventKey="7">
                <DocSearchAdvanced labels={this.props.labels.help}/>
              </Panel>
              <Panel header={this.props.labels.help.secDocRegExSearch}  eventKey="8">
                <DocRegEx labels={this.props.labels.help}/>
              </Panel>
            </Accordion>
          </div>
        </div>
    )
  }
}

HelpSearch.propTypes = {
  labels: React.PropTypes.object.isRequired
};

HelpSearch.defaultProps = {

};

export default HelpSearch;
