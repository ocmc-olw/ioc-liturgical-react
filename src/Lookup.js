import React from 'react';
import PropTypes from 'prop-types';
import server from "./helpers/Server";

let cellStyle = {
  padding: '2em'
};

class Lookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoaded: false
      , value: ""
    };

    this.fetchData = this.fetchData.bind(this);
    this.handleRestCallback = this.handleRestCallback.bind(this);
    this.getContent = this.getContent.bind(this);
  };

  componentDidMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps = (nextProps) => {
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };
  handleRestCallback = (restCallResult) => {
    if (restCallResult && restCallResult.data) {
      console.log(restCallResult);
      let value = restCallResult.data.values[0].value;
      this.setState({
        dataLoaded: true
        , data: value
      });
    }
  };

  fetchData() {
    console.log("fetching data");
    server.getLookupResult(
        this.props.session.restServer
        , this.props.idDomain
        , this.props.idTopic
        , this.props.idKey
        , this.handleRestCallback
    )
  }

  getContent = () => {
    if (this.state.dataLoaded) {
      return (
          <div className="App-New-Component-Template">
            <table>
              <tbody>
              <tr>
                <td style={cellStyle}>{this.props.idDomain}~{this.props.idTopic}~{this.props.idKey}</td>  <td style={cellStyle}>{this.state.data}</td>
              </tr>
              </tbody>
            </table>
          </div>
      )
    } else {
      if (this.props && this.props.idDomain) {
        return (
            <div className="App-New-Component-Template">
              <table>
                <tbody>
                <tr>
                  <td style={cellStyle}>{this.props.idDomain}~{this.props.idTopic}~{this.props.idKey}</td>  <td style={cellStyle}> </td>
                </tr>
                </tbody>
              </table>
            </div>
        )
      } else {
        return (
            <div className="App-New-Component-Template">
            </div>
        )
      }
    }
  };

  render() {
    return (
        <div>
          {this.getContent()}
        </div>
    )
  }
};

Lookup.propTypes = {
  session: PropTypes.object.isRequired
  , idDomain: PropTypes.string
  , idTopic: PropTypes.string.isRequired
  , idKey: PropTypes.string
};

// set default values for props here
Lookup.defaultProps = {
};

export default Lookup;
