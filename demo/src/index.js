import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'
import './css/Demo.css'; // important that you load this as the last css
import RestServer from './helpers/restServer'

import React from 'react';
import {Accordion, Alert, Button, ControlLabel, FormControl, FormGroup, Glyphicon, Grid, Image, Jumbotron, Panel, Table} from "react-bootstrap"
import logo from './images/ioc-liturgical-react-logo.png'
import CodeExample from './helpers/CodeExample'
import {render} from 'react-dom';

import {DomainSelector, Flag, Labels, LiturgicalDayProperties, Login, Search} from '../../src';

const initialStateExample = "this.state = {\n    restServer: \"https://ioc-liturgical-ws.org/\"\n    , username: \"\"\n    , password: \"\"\n    , authenticated: false\n    , language: {\n      language: \"en\"\n      , labels: {\n        , resultsTable: Labels.labels.en.resultsTable\n        , header: Labels.labels.en.header\n        , help: Labels.labels.en.help\n        , pageAbout: Labels.labels.en.pageAbout\n        , pageLogin: Labels.labels.en.pageLogin\n        , search: Labels.labels.en.search\n  }\n}\n};";
const languageChangeHandlerExample = "handleLanguageChange = (code) => {\nif (code.length > 0 && code !== \"undefined\") {\n  this.setState({\n    language: {\n      code: code\n      , labels: {\n        compSimpleSearch: Labels.getCompSimpleSearchLabels(code)\n        , resultsTable: Labels.getResultsTableLabels(code)\n        , header: Labels.getHeaderLabels(code)\n        , help: Labels.getHelpLabels(code)\n        , pageAbout: Labels.getPageAboutLabels(code)\n        , pageLogin: Labels.getPageLoginLabels(code)\n        , search: Labels.getSearchLabels(code)\n      }\n    }\n  });\n}\n};";
const menuLanguageChangeExample = "<MenuItem eventKey={6.2} id=\"el\" onClick={this.handleLanguageChange}><Flag code=\"el\"/></MenuItem>";
const localLanguageChangeHandlerExample = "handleLanguageChange = (event) => {\n  if (event.target.id) {\n    this.props.changeHandler(event.target.id);\n    event.preventDefault();\n  }\n};";
const loginSample = "<Login\n\trestServer={this.state.restServer} // e.g. https://ioc-liturgical-ws.org/\n\tusername={this.state.username} // initially set to \"\"\n\tpassword={this.state.password} // initially set to \"\"\n\tloginCallback={this.handleLoginCallback}\n\tformPrompt={this.state.language.labels.pageLogin.prompt}\n\tformMsg={this.state.loginFormMsg} // initially set to \"\"\n />";
const searchSample = "<Search\n restServer={this.state.restServer}\n username={this.state.username}\n password={this.state.password}\n callback={this.handleSearchCallback}\n searchLabels={this.state.language.labels.search}\n resultsTableLabels={this.state.language.labels.resultsTable}\n/>"

class Demo extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @description Because ioc-liturgical-react components reply on an object that supplies the literals, it is important to initialize the state using the Labels object.
     * @type {{restServer: string, username: string, password: string, authenticated: boolean, loginFormPrompt: string, loginFormMsg: string, language: {language: string, labels: {compSimpleSearch: (*), resultsTable: (*), header: (*), help: (*), pageAbout: (*), pageLogin: (*), search: (*)}}}}
     */

      this.state = {
        demoVersion: "0.0.2"
      , npmVersion: "0.0.10"
      , restServer: RestServer.getWsServer()
      , username: ""
      , password: ""
      , authenticated: false
      , language: {
        language: "en"
        , labels: {
          resultsTable: Labels.labels.en.resultsTable
          , header: Labels.labels.en.header
          , help: Labels.labels.en.help
          , pageAbout: Labels.labels.en.pageAbout
          , pageLogin: Labels.labels.en.pageLogin
          , search: Labels.labels.en.search
          , ldp: Labels.labels.en.ldp
        }
      }
      , loginFormMsg: "" // TODO: this should be part of the labels
      , data : {
            "idReferredByText": "gr_gr_cog~me.m01.d01~meVE.Stichera01.text",
            "referredByText": "Συγκαταβαίνων ὁ Σωτήρ, τῷ γένει τῶν ἀνθρώπων, κατεδέξατο σπαργάνων περιβολήν, οὐκ ἐβδελύξατο σαρκὸς τὴν περιτομήν, ὁ ὀκταήμερος κατὰ τὴν Μητέρα, ὁ ἄναρχος κατὰ τὸν Πατέρα. Αὐτῷ πιστοὶ βοήσωμεν. Σὺ εἶ ὁ Θεὸς ἡμῶν, ἐλέησον ἡμᾶς."
        }
      , searching: false
      , selectedDomain: "Your selection will appear here:"
   };

    // language change functions
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleLanguageToogle = this.handleLanguageToogle.bind(this);

    // component callbacks
    this.handleDomainSelectionCallback = this.handleDomainSelectionCallback.bind(this);
    this.handleLoginCallback = this.handleLoginCallback.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.handleLdpCallback = this.handleLdpCallback.bind(this);
    this.doNothingHandler = this.doNothingHandler.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
  }

  /**
   *
   * @param code the 2 or three letter ISO code for the language
   */
  handleLanguageChange = (code) => {
    if (code.length > 0 && code !== "undefined") {
      this.setState({
        language: {
          code: code
          , labels: {
              resultsTable: Labels.getResultsTableLabels(code)
            , header: Labels.getHeaderLabels(code)
            , help: Labels.getHelpLabels(code)
            , pageAbout: Labels.getPageAboutLabels(code)
            , pageLogin: Labels.getPageLoginLabels(code)
            , search: Labels.getSearchLabels(code)
            , ldp: Labels.getLdpLabels(code)
          }
        }
      });
    }
  };

  /**
   *
   * @param event
   */
  handleLanguageToogle(event) {
    if (event.target.id) {
      this.handleLanguageChange(event.target.id);
      event.preventDefault();
    }
  }

  /**
   * @description the signature of this method must always be used regardless of the name you give for your Login callback handler.
   * @param status - a string that will contain the HTTP response from the Login
   * @param valid - boolean true if login was successful, false if not
   * @param username - the username the person entered into the login form - save to state
   * @param password - the password the person entered into the login form - save to state
   */
  handleLoginCallback(status, valid, username, password) {
    // save the username and password regardless of status so it will not be erased when Login re-renders
    this.setState({username: username, password: password});
    if (valid) {
      this.setState({authenticated: true, loginFormMsg: "Login successful!"});
    } else {
      this.setState({authenticated: false, loginFormMsg: "Login failed"});
    }
  };

  handleSearchCallback(id, value) {
    if (id && id.length > 0) {
      this.setState({
        searching: false
        , data : {
          "idReferredByText": id,
          "referredByText": value
        }
      });
    }
  };

  handleLdpCallback(value) {
    console.log(value);
  };

  handleDomainSelectionCallback(id, description, domainObject) {
    this.setState({selectedDomain: "You selected: " + id + ": " + description});
  };

  handleSearchRequest = () => {
    this.setState({
      searching: true
    });
  }

  doNothingHandler = () => {
  }

  render() {
    return <div className="App">
      <div className="row App-content-row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <Jumbotron>
            <Image src={logo} responsive />
            <h2>Demo and Documentation for Version {this.state.npmVersion}</h2>
            <p>This page provides a demonstration of <a href="https://facebook.github.io/react/" target="_blank">React</a> components for web apps that access the IOC-Liturgical-WS REST API, and through it, the <a href="https://ioc-liturgical-db.org" target="_blank">IOC-Liturgical-DB database</a>.  The database contains the Greek liturgical text of the Eastern Orthodox Christian Church, its Greek Biblical texts, and translations.</p>
            <p>Mission specialists at the Orthodox Christian Mission Center (<a href="https://www.ocmc.org" target="_blank">OCMC</a>) and volunteers built these components for use in their own open source liturgical web apps, and are providing them as a service to the world-wide Eastern Orthodox Christian community.</p>
            <p>The components provided by ioc-liturgical-react do not duplicate the functionality of other React components, e.g. <a href="https://react-bootstrap.github.io/" target="_blank">react-bootstrap</a>.  Instead, the components provided by the ioc-liturgical-react encapsulate REST calls to the ioc-liturgical-ws and through it to the database, and encapsulate the response. This means that developers can use the components without detailed knowledge of how to access the database through the REST API.</p>
            <p>Each section below describes a component.  Click on the name of the component you are interested in to view the description.</p>
            <p>With the exception of the Login component, for the demo it is not necessary to provide a username and password.</p>
            <p>See the sourcecode for this demo <a href="https://github.com/OCMC-Translation-Projects/ioc-liturgical-react/tree/master/demo/src" target="_blank">here</a>.</p>
          </Jumbotron>
          <Grid>
            <Alert bsStyle="warning">
              <p><Glyphicon glyph="bullhorn" /> We are actively working to reach a 1.0.0 release.</p>
            </Alert>
            <Alert bsStyle="danger">
              <p><Glyphicon glyph="warning-sign" /> The project is under active development, and APIs will change. </p>
            </Alert>
          </Grid>
          <Accordion>
        <Panel header="Setup" eventKey="setup">
          <p>In order to use the ioc-liturgical-react components, at the top level of your web app, you need to do the following:</p>
          <Accordion>
            <Panel header="Import the Labels Component" eventKey="setupImport">
              The Labels component holds the translations of all the text used by the user interface of the ioc-liturgical-react components.
              <CodeExample codeText="import {Labels} from 'ioc-liturgical-react';"/>
            </Panel>
            <Panel header="Initialize the App State" eventKey="setupInitialize">
              Here is the minimum you need to do to initialize the state of your App:
              <CodeExample codeText={initialStateExample}/>
              The restServer can be set to whatever domain you want, as long as it is running an ioc-liturgical-ws server.  The username and password are initialized to be an empty string, and authenticated is set to false.  You should set it to true later, after a user has successfully logged in.  The authenticated boolean can then be used for parts of your application that need to know whether the user has successfully authenticated.
              <p/>
              <p>The language part of the state indicates what language is being used for the user interface.  In this case it is set to 'en' for English.</p>
              <p/>
              <p>The language.labels state is here initialized to 'en' (English), e.g. Labels.labels.en.search means the English labels for the Search component.  You will see below how to set up a mechanism for the user to change the language of the user interface.  It can only be changed to a language provided by the ioc-liturgical-react, unless you complete replace the Labels with our own language.</p>
            </Panel>
            <Panel header="Create a Language Change Handler" eventKey="setupChangeHandler">
              If your web app is only going to use a single language in the user interface, you will still need a change handler, but it doesn't have to do anything. If you do plan to support more than one language in your user interface, then here is how to set up your change handler:
              <CodeExample codeText={languageChangeHandlerExample}/>
              You will have to write your own code to give the user a way to indicate which language he/she wants to use for the user interface.  One technique is to set the language code in the id property of an element, and pass it back to an onClick handler for the element.  The language code used in the id is a two or three character ISO code.
              <p/>
              <p>For example, you could have a menu item that displays the language choices, and set the id property of the element to the language code.  If you then have an onClick handler for that element, you can use the event.target.id as the parameter to the languageChangeHander:</p>
              <CodeExample codeText={menuLanguageChangeExample}/>
              If the user clicks the above menu item, it calls a local language change handler.  The local handler, in turn, calls the handler passed as a prop:
              <CodeExample codeText={localLanguageChangeHandlerExample}/>
              Note that the event.target.id property holds the language code.
            </Panel>
          </Accordion>
        </Panel> {/* setup */}
        <Panel header="Flags and User Interface Labels" eventKey="flags">
          <p>Labels are provided in a variety of languages for the components.</p>
          <p>Click a language name below to change the language for the labels used by the demo components:</p>
          <div id="en" onClick={this.handleLanguageToogle}><Flag code="en"/> English</div>
          <div id="el" onClick={this.handleLanguageToogle}><Flag code="el"/> Modern Greek</div>
          <p></p>
          <p>Changing the language for the demo affects the labels for the components below this section. This also demonstrates the use of the Flag component.  There is a flag for each language supported by the user interface. For example, to use the Flag component to get Modern Greek:</p>
          <CodeExample
            codeText="<Flag code='el'/>"
          />
        </Panel> {/* Flags and Labels */}
        <Panel header="Login" eventKey="login">
          <Login
              restServer={this.state.restServer}
              username={this.state.username} // initially set to ""
              password={this.state.password} // initially set to ""
              loginCallback={this.handleLoginCallback}
              formPrompt={this.state.language.labels.pageLogin.prompt}
              formMsg={this.state.loginFormMsg}
          />
          <Accordion>
            <Panel header="Code and Props" eventKey="loginCode">
          <CodeExample
              codeText={loginSample}
          />
          <Table responsive>
            <thead>
            <tr>
              <th>Parm</th>
              <th>PropType</th>
              <th>Description</th>
              <th>Example</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>restServer</td>
              <td>String</td>
              <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include a final forward slash at the end.</td>
              <td>https://ioc-liturgical-ws.org/</td>
            </tr>
            <tr>
              <td>username</td>
              <td>String</td>
              <td>Required, but initialize to an empty string. This is a placeholder for the username that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
              <td>""</td>
            </tr>
            <tr>
              <td>password</td>
              <td>String</td>
              <td>Required, but initialize to an empty string. This is a placeholder for the password that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
              <td>""</td>
            </tr>
            <tr>
              <td>loginCallback</td>
              <td>Function</td>
              <td>Required.  This is your function that the Login component will call after a login attempt.  You should use this function to set the app state for the username and password for subsequent use of ioc-liturgical-react components.</td>
              <td>Use a function signature like this: handleLoginCallback(status, valid, username, password). The status is a string, and contains the HTTP response status of the REST API call. The valid parm is a boolean.  If the login succeeded, it will be set to true, otherwise false. The username and password are the ones that were used for the login attempt. </td>
            </tr>
            <tr>
              <td>formPrompt</td>
              <td>String</td>
              <td>Required. This is simply text that you supply as the login prompt.</td>
              <td>Please login to view the requested page:</td>
            </tr>
            <tr>
              <td>formMsg</td>
              <td>String</td>
              <td>Required. Initialize to empty string. Based on the status received in the callback, you can set the message to show to the user.</td>
              <td>Login successful.</td>
            </tr>
            </tbody>
          </Table>
            </Panel>
          </Accordion>
        </Panel> {/* Login */}
        <Panel header="Domain Selector" eventKey="domainSelector">
          <p>The Domain Selector is a dropdown that allows the user to select a domain.  A selected domain can be used as a database search parameter since all docs in the database use the domain in the first part of the doc ID.</p>
          {this.state.authenticated ?
              <div>
              <DomainSelector
                  restServer={this.state.restServer}
                  username={this.state.username} // initially set to ""
                  password={this.state.password} // initially set to ""
                  callback={this.handleDomainSelectionCallback}
                  id="testId"
                  title="Domains"
                  style="primary"
                  size="small"
                  filterLanguage="gr"
                  publicOnly={false}
              />
                <p></p>
                <p>{this.state.selectedDomain}</p>
              </div>
              :
              <p>You won't see the example, below, unless you first login using the Login example above.</p>
          }
          <Accordion>
                <Panel header="Code and Props" eventKey="domainSelectorCode">
                  <CodeExample
                      codeText={loginSample}
                  />
                  <Table responsive>
                    <thead>
                    <tr>
                      <th>Parm</th>
                      <th>PropType</th>
                      <th>Description</th>
                      <th>Example</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>restServer</td>
                      <td>String</td>
                      <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include a final forward slash at the end.</td>
                      <td>https://ioc-liturgical-ws.org/</td>
                    </tr>
                    <tr>
                      <td>username</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the username that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>password</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the password that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>loginCallback</td>
                      <td>Function</td>
                      <td>Required.  This is your function that the Login component will call after a login attempt.  You should use this function to set the app state for the username and password for subsequent use of ioc-liturgical-react components.</td>
                      <td>Use a function signature like this: handleLoginCallback(status, valid, username, password). The status is a string, and contains the HTTP response status of the REST API call. The valid parm is a boolean.  If the login succeeded, it will be set to true, otherwise false. The username and password are the ones that were used for the login attempt. </td>
                    </tr>
                    <tr>
                      <td>formPrompt</td>
                      <td>String</td>
                      <td>Required. This is simply text that you supply as the login prompt.</td>
                      <td>Please login to view the requested page:</td>
                    </tr>
                    <tr>
                      <td>formMsg</td>
                      <td>String</td>
                      <td>Required. Initialize to empty string. Based on the status received in the callback, you can set the message to show to the user.</td>
                      <td>Login successful.</td>
                    </tr>
                    </tbody>
                  </Table>
                </Panel>
              </Accordion>
            </Panel> {/* DomainSelector */}
        <Panel header="Search" eventKey="search">
          <p>The search component provides the user with a means for both a simple and an advanced search. The Search component takes an optional callback prop.  If the callback prop is provided, the Search component can be used as a means for the user to look up a specific doc and let your app know which one he/she selected.</p>
          <Accordion>
            <Panel header="Search without a Callback" eventKey="4a">
              <p>Use the Search component without a callback prop if all you want to do is give the user a means to search the database, and the app does not need to know which doc the user selected from the search results.</p>
              <Search
                  restServer={this.state.restServer}
                  username={this.state.username}
                  password={this.state.password}
                  searchLabels={this.state.language.labels.search}
                  resultsTableLabels={this.state.language.labels.resultsTable}
              />
            </Panel> {/* Search */}
            <Panel header="Search with a Callback" eventKey="searchWithCallback">
              <p>Use the Search component with a callback prop if you are giving the user a means to search the database in order to select a specific doc from the search results.</p>
              {this.state.searching ?
                  <Search
                      restServer={this.state.restServer}
                      username={this.state.username}
                      password={this.state.password}
                      callback={this.handleSearchCallback}
                      searchLabels={this.state.language.labels.search}
                      resultsTableLabels={this.state.language.labels.resultsTable}
                  />
                  :
                  <FormGroup>
                    <ControlLabel>Example of Setting Values by a Database Search</ControlLabel>
                    <FormControl
                        type="text"
                        disabled
                        value={this.state.data.idReferredByText}
                        onChange={this.doNothingHandler}
                    />
                    <FormControl
                        type="text"
                        disabled
                        value={this.state.data.referredByText}
                        onChange={this.doNothingHandler}
                    />
                    <Button onClick={this.handleSearchRequest} bsStyle="success">Search</Button>
                  </FormGroup>
              }
            </Panel> {/* Select a Doc */}
              <Panel header="Code and Props" eventKey="searchCode">
                <CodeExample
                    codeText={searchSample}
                />
                <Table responsive>
                  <thead>
                  <tr>
                    <th>Parm</th>
                    <th>PropType</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>restServer</td>
                    <td>String</td>
                    <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include a final forward slash at the end.</td>
                    <td>this.state.restServer</td>
                  </tr>
                  <tr>
                    <td>username</td>
                    <td>String</td>
                    <td>Required, but initialize to an empty string. This is a placeholder for the username that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
                    <td>""</td>
                  </tr>
                  <tr>
                    <td>password</td>
                    <td>String</td>
                    <td>Required, but initialize to an empty string. This is a placeholder for the password that the user will enter.  Passing it back in allows us to preserve the username in the event of a login error.</td>
                    <td>""</td>
                  </tr>
                  <tr>
                    <td>callback</td>
                    <td>Function</td>
                    <td>Optional.  This is your function that the Search component will call after the user has finished searching.</td>
                    <td>See the example below.</td>
                  </tr>
                  <tr>
                    <td>searchLabels</td>
                    <td>Object</td>
                    <td>Required. The Labels for the search criteria part of the search component.</td>
                    <td>this.state.language.labels.search</td>
                  </tr>
                  <tr>
                    <td>resultsTableLabels</td>
                    <td>Object</td>
                    <td>Required. The labels for the results table in the search component.</td>
                    <td>this.state.language.labels.resultsTable</td>
                  </tr>
                  </tbody>
                </Table>
                <p/>
                <p>Below is an example callback handler:</p>
                <CodeExample
                    codeText={searchSample}
                />
              </Panel>
          </Accordion>
        </Panel> {/* Search */}
            <Panel header="Liturgical Day Properties" eventKey="ldp">
              <p>Each day of the year has certain liturgical properties, e.g. the mode of the week, what day of the Triodion or Pentecostarion it might be, what the Eothinon is, etc.</p>
              <p/>
              <p>This component allows the user to select a date.  The component will request the information from the backend REST API.</p>
              <LiturgicalDayProperties
                  restServer={this.state.restServer}
                  username={this.state.username} // initially set to ""
                  password={this.state.password} // initially set to ""
                  callback={this.handleLdpCallback}
                  labels={this.state.language.labels.ldp}
              />
            </Panel> {/* LiturgicalDayProperties */}
        <Panel header="TBD" eventKey="tbd">
          Placeholder
        </Panel> {/* TDB */}
      </Accordion>
    </div>
      </div>
    <p className="App-demo-version">Demo version {this.state.demoVersion}</p>
    </div>
  }
}

render(<Demo/>, document.querySelector('#demo'))
