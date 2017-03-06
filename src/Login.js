import React from 'react';
import axios from 'axios';
import auth from './helpers/Auth'
import Form from "react-jsonschema-form";
import server from './helpers/Server';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path:""
    };
  }

  onSubmit = ({formData}) => {
    var config = {
      auth: {
        username: formData.username
        , password: formData.password
      }
    };
    axios.get(this.props.restServer + server.getWsServerResourcesApi(), config)
        .then(response => {
          auth.setCredentials(
              formData.username
              , formData.password
              , true
          );
          this.props.loginCallback(response.status, true, formData.username, formData.password);
        })
        .catch( (error) => {
          this.props.loginCallback(error.message, false, formData.username, formData.password);
        });
  }

  fetchData() {
    axios.get(this.props.restServer + server.getWsServerLoginApi())
        .then(response => {
          this.setState( { data: response.data , path: this.props.path} );
        })
        .catch( (error) => {
          this.setState( { data: error.message, path: this.props.path });
          this.props.loginCallback(error.message, false, formData.username, formData.password);
        });
  }

  render() {
    if (this.state.path !== this.props.path) {
      this.fetchData();
    }
    if (this.state.data) {
      if (this.state.data.schema) {
        var formData = {username: this.props.username, password: this.props.password};
        return (
            <div className="App-login">
              <h3 className="App-login-prompt">{this.props.formPrompt}</h3>
              <Form schema={this.state.data.schema}
                    uiSchema={this.state.data.uiSchema}
                    formData={this.formData}
                    onSubmit={this.onSubmit}
              />
              <p className="App-login-msg">{this.props.formMsg}</p>
            </div>
        );
      } else {
        return (
            <div className="App-login">
              <p>{this.props.path}</p>
              <pre>{JSON.stringify(this.state.data, null, 2)}</pre>
            </div>
        );

      }
    } else {
      return (<div className="Resource"><p>Loading {this.props.path} from {this.root}!</p></div>);
    }
  }
}

/**
 * Need a router callback
 * Need a callback to set credentials
 */

Login.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , loginCallback: React.PropTypes.func.isRequired
  , formPrompt: React.PropTypes.string.isRequired
  , formMsg: React.PropTypes.string.isRequired
};
Login.defaultProps = {

};

export default Login;
