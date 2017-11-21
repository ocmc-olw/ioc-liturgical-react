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
  }

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
                <p>{this.props.appVersionLabel} {this.props.appVersion}.</p>
                <p>ioc-liturgical-react {versionNumbers.getPackageNumber()}.</p>
                <p>{this.props.dbServerLabel} {this.state.dbServerDomain}</p>
                <p>{this.props.restServerLabel} {this.props.restServer}</p>
                <p>{this.props.wsVersionLabel} {this.state.wsVersion}</p>
                <p>{this.props.synchEnabledLabel} {this.state.synchEnabled}</p>
                <p>{this.props.synchDbConnectionOkLabel} {this.state.synchDbConnectionOkLabel}</p>
              </Alert>
            </div>
        );
    } else {
      return (<div className="Resource"><p>Loading information...</p></div>);
    }
  }
}

Configuration.propTypes = {
  appVersion: PropTypes.string.isRequired
  , appVersionLabel: PropTypes.string.isRequired
  , restServer: PropTypes.string.isRequired
  , restServerLabel: PropTypes.string.isRequired
  , wsVersionLabel: PropTypes.string.isRequired
  , dbServerLabel: PropTypes.string.isRequired
  , synchEnabledLabel: PropTypes.string.isRequired
  , synchDbConnectionOkLabel: PropTypes.string.isRequired
};

Configuration.defaultProps = {
};

export default Configuration;
