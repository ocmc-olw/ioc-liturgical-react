import React from 'react';
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
          } );
        })
        .catch( (error) => {
          console.log(error.message);
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
              </Alert>
            </div>
        );
    } else {
      return (<div className="Resource"><p>Loading information...</p></div>);
    }
  }
}

Configuration.propTypes = {
  appVersion: React.PropTypes.string.isRequired
  , appVersionLabel: React.PropTypes.string.isRequired
  , restServer: React.PropTypes.string.isRequired
  , restServerLabel: React.PropTypes.string.isRequired
  , wsVersionLabel: React.PropTypes.string.isRequired
  , dbServerLabel: React.PropTypes.string.isRequired
};

Configuration.defaultProps = {
};

export default Configuration;