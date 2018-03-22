import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import FontAwesome from 'react-fontawesome';
import auth from './helpers/Auth'
import Form from "react-jsonschema-form";
import server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import Labels from './Labels';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path:""
      , username: ""
      , password: ""
      , labels: {
        thisClass: Labels.getChangePasswordPageLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
    };
  }

  onSubmit = ({formData}) => {
    if (formData.password === formData.passwordReenter) {
      var config = {
        auth: {
          username: formData.username
          , password: formData.currentPassword
        }
      };
      let path = "users/password/" + formData.username;
      axios.put(
          this.props.session.restServer
          + server.getWsServerAdminApi()
          + path
          , formData
          , config
      )
          .then(response => {
            auth.setCredentials(
                formData.username
                , formData.password
                , true
            );
            this.props.callback(
                response.status
                , true
                , formData.username
                , formData.password
                , response.data // domain, email, firstname, lastname, title
            );
            this.setState({
              formData: formData
              , message: this.state.labels.thisClass.changed
              , messageIcon: MessageIcons.getMessageIcons().info
            });
          })
          .catch( (error) => {
            this.setState({msg: error.message});
            this.props.callback(
                error.message
                , false
                , formData.username
                , formData.password
                , undefined
            );
          });
    } else {
      this.setState({
        formData: formData
        , message: this.state.labels.thisClass.doNotMatch
        , messageIcon: MessageIcons.getMessageIcons().error
      });
    }
  };


  fetchLoginForm() {
    var config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    axios.get(
        this.props.session.restServer
        + server.getWsServerPasswordChangeApi()
        , config
     )
        .then(response => {
          if (response.data && response.data.valueSchemas) {
            let schemaInfo = response.data.valueSchemas["UserPasswordSelfChangeForm:1.1"];
            this.setState(
                {
                  data: response.data
                  , schema: schemaInfo.schema
                  , uiSchema: schemaInfo.uiSchema
                  , formData: response.data.values[0].value
                  , path: this.props.path
                } );
          }
        })
        .catch(error => {
          this.setState( { data: error.message, path: this.props.path });
          this.props.callback(
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
      if (this.state.schema) {
        return (
            <div className="App-login">
              <Form schema={this.state.schema}
                    uiSchema={this.state.uiSchema}
                    formData={this.state.formData}
                    onSubmit={this.onSubmit}
              />
              <p className="App-login-msg">
                <FontAwesome name={this.state.messageIcon}/> {this.state.message}
              </p>
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

ChangePassword.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , formPrompt: PropTypes.string.isRequired
  , formMsg: PropTypes.string.isRequired
};
ChangePassword.defaultProps = {

};

export default ChangePassword;
