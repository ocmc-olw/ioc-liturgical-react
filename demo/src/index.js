import './Demo.css'
import React from 'react'
import {render} from 'react-dom'

import {Login} from '../../src'

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      restServer: "https://ioc-liturgical-ws.org/"
      , username: ""
      , password: ""
      , authenticated: false
      , loginFormPrompt: "Please login to view the requested page:"
      , loginFormMsg: ""
    };
    this.handleLoginCallback = this.handleLoginCallback.bind(this);
  }

  handleLoginCallback(status, valid, username, password) {
    console.log(status);
    this.setState({username: username, password: password});
    if (valid) {
      this.setState({authenticated: true, loginFormMsg: "Login successful!"});
      console.log("login was successful " + status);
    } else {
      console.log("login failed " + status);
      this.setState({authenticated: false, loginFormMsg: "Login failed"});
    }
  };

  render() {
    return <div>
      <h1>ioc-liturgical-react Demo</h1>
      <Login
          restServer={this.state.restServer}
          username={this.state.username} // initially set to ""
          password={this.state.password} // initially set to ""
          loginCallback={this.handleLoginCallback}
          formPrompt={this.state.loginFormPrompt}
          formMsg={this.state.loginFormMsg}
      />
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
