import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import auth from './helpers/Auth'
import Form from "react-jsonschema-form";
import server from './helpers/Server';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path:""
      , username: ""
      , password: ""
    };
  }

  onSubmit = ({formData}) => {
    var config = {
      auth: {
        username: formData.username
        , password: formData.password
      }
    };
    axios.get(
        this.props.restServer
        + server.getWsServerLoginUserApi()
        , config
    )
        .then(response => {
          auth.setCredentials(
              formData.username
              , formData.password
              , true
          );
          this.props.loginCallback(
              response.status
              , true
              , formData.username
              , formData.password
          );
          console.log("Requesting dropdowns");
          server.getResources(
              this.props.restServer
              , formData.username
              , formData.password
              , this.props.dropdownsCallback
          );

        })
        .catch( (error) => {
          auth.setCredentials(
              formData.username
              , formData.password
              , false
          );
          this.props.loginCallback(
              error.message
              , false
              , formData.username
              , formData.password
          );
        });
  }

  fetchResources() {

  }

  fetchLoginForm() {
    axios.get(this.props.restServer + server.getWsServerLoginApi())
        .then(response => {
          this.setState( { data: response.data , path: this.props.path} );
        })
        .catch(error => {
          this.setState( { data: error.message, path: this.props.path });
          this.props.loginCallback(
              error.message
              , false
              , this.state.formData.username
              , this.state.formData.password
          );
        });
  }

  render() {
    if (this.state.path !== this.props.path) {
      this.fetchLoginForm();
    }
    if (this.state.data) {
      if (this.state.data.schema) {
        var formData = {username: this.props.username, password: this.props.password};
        return (
            <div className="App-login">
              <h3 className="App-login-prompt">{this.props.formPrompt}</h3>
              <Form schema={this.state.data.schema}
                    uiSchema={this.state.data.uiSchema}
                    formData={formData}
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

Login.propTypes = {
  restServer: PropTypes.string.isRequired
  , username: PropTypes.string.isRequired
  , password: PropTypes.string.isRequired
  , loginCallback: PropTypes.func.isRequired
  , dropdownsCallback: PropTypes.func.isRequired
  , formPrompt: PropTypes.string.isRequired
  , formMsg: PropTypes.string.isRequired
};
Login.defaultProps = {

};

export default Login;
