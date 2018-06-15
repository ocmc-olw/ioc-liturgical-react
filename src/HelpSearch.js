import React from 'react';
import PropTypes from 'prop-types';
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
        <div className="App-page App-help">
          <h2>{this.state.labels.searchPageTitle}</h2>
          <div className="jumbotron">
            <p>
              {this.state.labels.searchPara01}
            </p>
            <p>
              {this.state.labels.searchPara02}
            </p>
            <p>
              {this.state.labels.searchPara03}
            </p>
            <Accordion>
              <Panel header={this.state.labels.searchSecDocIds} eventKey="1">
                <DocIds session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecDocProps} eventKey="2">
                <DocProps session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecDocSearchTypes} eventKey="3">
                <DocSearchTypes session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecSimpleSearch}  eventKey="4">
                <DocSimpleSearch session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecSearchResults} eventKey="6">
                <DocSearchResults session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecDocVersionComparisonTitle} eventKey="5">
                <DocComparison session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecAdvancedSearch} eventKey="7">
                <DocSearchAdvanced session={this.props.session}/>
              </Panel>
              <Panel header={this.state.labels.searchSecDocRegExSearch}  eventKey="8">
                <DocRegEx session={this.props.session}/>
              </Panel>
            </Accordion>
          </div>
        </div>
    )
  }
}

HelpSearch.propTypes = {
  session: PropTypes.object.isRequired
};

HelpSearch.defaultProps = {

};

export default HelpSearch;
