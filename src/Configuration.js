import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import server from './helpers/Server';
import {Alert} from 'react-bootstrap';
import versionNumbers from './helpers/VersionNumbers'

/**
 * Provides information about the running version.
 */
class Configuration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false
      , dbServer: ""
      , dbReadOnly: ""
      , wsVersion : ""
      , synchEnabled: false
      , synchDbConnectionOk: false
    }
  }

  componentWillMount = () => {
    this.fetchData();
  };

  fetchData() {
    axios.get(this.props.restServer + server.getWsServerVersionApi())
        .then(response => {
          this.setState( {
            dataLoaded: true
            ,dbServerDomain: response.data.dbServerDomain
            , dbReadOnly: response.data.dbReadOnly
            , wsVersion: response.data.wsVersion
            , synchEnabled: response.data.synchEnabled
            , synchDbConnectionOk: response.data.synchDbConnectionOk
          } );
        })
        .catch( (error) => {
          this.setState( { data: error.message });
        });
  }

  render() {
    if (this.state.dataLoaded) {
        return (
            <div className="App-DomainSelector">
              <Alert bsStyle="info">
                <p>{this.props.session.labels.pageAbout.appVersion} {this.props.appVersion}.</p>
                <p>ioc-liturgical-react {versionNumbers.getPackageNumber()}.</p>
                <p>{this.props.session.labels.pageAbout.DbServer} {this.state.dbServerDomain}</p>
                <p>{this.props.session.labels.pageAbout.RestServer} {this.props.restServer}</p>
                <p>{this.props.session.labels.pageAbout.wsVersion} {this.state.wsVersion}</p>
                <p>{this.props.session.labels.pageAbout.synchEnabled} {this.state.synchEnabled}</p>
                <p>{this.props.session.labels.pageAbout.synchDbConnectionOk} {this.state.synchDbConnectionOkLabel}</p>
              </Alert>
            </div>
        );
    } else {
      return (<div className="Resource"><p>Loading information...</p></div>);
    }
  }
}

Configuration.propTypes = {
  session: PropTypes.object.isRequired
  , appVersion: PropTypes.string.isRequired
  , restServer: PropTypes.string.isRequired
};

Configuration.defaultProps = {
};

export default Configuration;
