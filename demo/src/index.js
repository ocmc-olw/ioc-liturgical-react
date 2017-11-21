import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import './css/alwb.css';
import './css/Demo.css'; // important that you load this as the last css
import RestServer from './helpers/restServer'

import React from 'react';
import {
  Accordion,
  Alert,
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  Glyphicon,
  Grid,
  Image,
  Jumbotron,
  Panel,
  Table
} from "react-bootstrap";
import logo from './images/ioc-liturgical-react-logo.png';
import CodeExample from './helpers/CodeExample';
import {render} from 'react-dom';

import {
  Administrator
  , AboutDatabase
  , AgesEditor
  , AgesViewer
  , Configuration
  , DependencyDiagram
  , DomainSelector
  , Dropdowns
  , Flag
  , HelpSearch
  , Labels
  , LiturgicalDayProperties
  , Login
  , NewEntry
  , ParaRowTextEditor
  , SearchNotes
  , SearchOntology
  , SearchText
  , SearchTreebanks
  , SearchRelationships
  , Session
  , Spinner
  , TopicsSelector
  , UiSchemas
  , User
  , ViewReferences
  , TemplateForTable
} from '../../src';

import VersionNumbers from '../../src/helpers/VersionNumbers'
import ParaColTextEditor from "../../src/ParaColTextEditor";
import LifeCycleDemo from "../../src/helpers/LifeCycleDemo";

const initialStateExample = "this.state = {\n    restServer: \"https://ioc-liturgical-ws.org/\"\n    , username: \"\"\n    , password: \"\"\n    , authenticated: false\n    , language: {\n      language: \"en\"\n      , labels: {\n        , resultsTable: Labels.labels.en.resultsTable\n        , header: Labels.labels.en.header\n        , help: Labels.labels.en.help\n        , pageAbout: Labels.labels.en.pageAbout\n        , pageLogin: Labels.labels.en.pageLogin\n        , search: Labels.labels.en.search\n  }\n}\n};";
const languageChangeHandlerExample = "handleLanguageChange = (code) => {\nif (code.length > 0 && code !== \"undefined\") {\n  this.setState({\n    language: {\n      code: code\n      , labels: {\n        compSimpleSearch: Labels.getCompSimpleSearchLabels(code)\n        , resultsTable: Labels.getResultsTableLabels(code)\n        , header: Labels.getHeaderLabels(code)\n        , help: Labels.getHelpLabels(code)\n        , pageAbout: Labels.getPageAboutLabels(code)\n        , pageLogin: Labels.getPageLoginLabels(code)\n        , search: Labels.getSearchLabels(code)\n      }\n    }\n  });\n}\n};";
const menuLanguageChangeExample = "<MenuItem eventKey={6.2} id=\"el\" onClick={this.handleLanguageChange}><Flag code=\"el\"/></MenuItem>";
const localLanguageChangeHandlerExample = "handleLanguageChange = (event) => {\n  if (event.target.id) {\n    this.props.changeHandler(event.target.id);\n    event.preventDefault();\n  }\n};";
const loginSample = "<Login\n\tsession={this.state.session} // e.g. https://ioc-liturgical-ws.org/\n\tusername={this.state.session.userInfo.username} // initially set to \"\"\n\tpassword={this.state.session.userInfo.password} // initially set to \"\"\n\tloginCallback={this.handleLoginCallback}\n\tformPrompt={this.state.language.labels.pageLogin.prompt}\n\tformMsg={this.state.loginFormMsg} // initially set to \"\"\n />";
const searchSample = "<SearchText\n session={this.state.session}\n username={this.state.session.userInfo.username}\n password={this.state.session.userInfo.password}\n callback={this.handleSearchCallback}\n searchLabels={this.state.language.labels.search}\n resultsTableLabels={this.state.language.labels.resultsTable}\n/>"
const searchCallbackSample = "\nhandleSearchCallback(id, value) {\n\tif (id && id.length > 0) {\n\t\tthis.setState({\n\t\t\tsearching: false\n\t\t\t, data : {\n\t\t\t\t\"idReferredByText\": id,\n\t\t\t\t\"referredByText\": value\n\t\t\t}\n\t\t});\n\t}\n};";
const loginCallbackSample = "handleLoginCallback(status, valid, username, password) {\n  // save the username and password regardless of status so it will not be erased when Login re-renders\n  this.setState({username: username, password: password});\n  if (valid) {\n    this.setState({authenticated: true, loginFormMsg: \"Login successful!\"});\n  } else {\n    this.setState({authenticated: false, loginFormMsg: \"Login failed\"});\n  }\n};"

class Demo extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @description Because ioc-liturgical-react components reply on an object that supplies the literals, it is important to initialize the state using the Labels object.
     * @type {{restServer: string, username: string, password: string, authenticated: boolean, loginFormPrompt: string, loginFormMsg: string, language: {language: string, labels: {compSimpleSearch: (*), resultsTable: (*), header: (*), help: (*), pageAbout: (*), pageLogin: (*), search: (*)}}}}
     */

    this.state = {
      demoVersion: "0.0.4"
      , session: new Session(
          RestServer.getWsServer()
          , "en"
          , new User()
          , new UiSchemas()
          , new Dropdowns()
      )
      , showModal: false
      , npmVersion: VersionNumbers.getPackageNumber()
      , authenticated: false
      , agesIndex: {}
      , language: {
        code: "en"
        , labels: {
          resultsTable: Labels.labels.en.resultsTable
          , linkSearchResultsTable: Labels.labels.en.linkSearchResultsTable
          , header: Labels.labels.en.header
          , help: Labels.labels.en.help
          , pageAbout: Labels.labels.en.pageAbout
          , pageLogin: Labels.labels.en.pageLogin
          , search: Labels.labels.en.search
          , searchLinks: Labels.labels.en.searchLinks
          , searchNotes: Labels.labels.en.searchNotes
          , searchOntology: Labels.labels.en.searchOntology
          , searchTreebanks: Labels.labels.en.searchTreebanks
          , ldp: Labels.labels.en.ldp
          , messages: Labels.getMessageLabels("en")
        }
      }
      , loginFormMsg: ""
      , data: {
        "idReferredByText": "gr_gr_cog~me.m01.d01~meVE.Stichera01.text",
        "referredByText": "Συγκαταβαίνων ὁ Σωτήρ, τῷ γένει τῶν ἀνθρώπων, κατεδέξατο σπαργάνων περιβολήν, οὐκ ἐβδελύξατο σαρκὸς τὴν περιτομήν, ὁ ὀκταήμερος κατὰ τὴν Μητέρα, ὁ ἄναρχος κατὰ τὸν Πατέρα. Αὐτῷ πιστοὶ βοήσωμεν. Σὺ εἶ ὁ Θεὸς ἡμῶν, ἐλέησον ἡμᾶς."
      }
      , searching: false
      , selectedDomain: "Your selection will appear here:"
      , translatedText: ""
      , linkSearchDropdowns: {}
      , treeData: [
        this.node('Root','', '', '', '', '', '')
        , this.node('0','4', 'ὁ', 'ὁ', 'the','ATR','DET.M.SG.NOM')
        , this.node('1','4', 'κραταιός', 'κραταιός','mighty','ATR','ADJ.M.SG.NOM')
        , this.node('2','1', 'ἐν', 'ἐν', 'in', 'AuxP','PREP')
        , this.node('3','2', 'πολέμοις', 'πόλεμος', 'wars','ATR','NOUN.M.PL.DAT')
        , this.node('4','Root', 'Κύριος', 'κύριος', 'Lord', 'ST-ROOT-SUBJ','NOUN.M.SG.NOM')
        , this.node('5','', '˙', '˙',  ':','APOS','PM')
      ]
    };

    // language change functions
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleLanguageToogle = this.handleLanguageToogle.bind(this);

    // component callbacks
    this.handleAgesIndexCallback = this.handleAgesIndexCallback.bind(this);
    this.handleDomainSelectionCallback = this.handleDomainSelectionCallback.bind(this);
    this.handleLoginCallback = this.handleLoginCallback.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.handleSearchNotesCallback = this.handleSearchNotesCallback.bind(this);
    this.handleSearchTreebanksCallback = this.handleSearchTreebanksCallback.bind(this);
    this.handleSearchOntologyCallback = this.handleSearchOntologyCallback.bind(this);
    this.handleSearchLinksCallback = this.handleSearchLinksCallback.bind(this);
    this.handleLdpCallback = this.handleLdpCallback.bind(this);
    this.handleNewEntryCallback = this.handleNewEntryCallback.bind(this);
    this.handleParallelTextEditorCallback = this.handleParallelTextEditorCallback.bind(this);
    this.doNothingHandler = this.doNothingHandler.bind(this);
    this.handleSearchRequest = this.handleSearchRequest.bind(this);
    this.handleDropdownsCallback = this.handleDropdownsCallback.bind(this);
    this.getParaTextEditor = this.getParaTextEditor.bind(this);
    this.handleTopicsSelection = this.handleTopicsSelection.bind(this);
    this.showModal = this.showModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.node = this.node.bind(this);
  }

  componentWillMount = () => {
  }


  /**
   *
   * @param code the 2 or three letter ISO code for the language
   */
  handleLanguageChange = (code) => {
    if (code.length > 0 && code !== "undefined") {
      let session = this.state.session;
      session.languageCode = code;
      this.setState({
        session
        , language: {
          code: code
          , labels: {
            resultsTable: Labels.getResultsTableLabels(code)
            , linkSearchResultsTable: Labels.getLinkSearchResultsTableLabels(code)
            , header: Labels.getHeaderLabels(code)
            , help: Labels.getHelpLabels(code)
            , pageAbout: Labels.getPageAboutLabels(code)
            , pageLogin: Labels.getPageLoginLabels(code)
            , search: Labels.getSearchLabels(code)
            , searchLinks: Labels.getSearchLinksLabels(code)
            , searchNotes: Labels.getSearchNotesLabels(code)
            , searchTreebanks: Labels.getSearchTreebanksLabels(code)
            , searchOntology: Labels.getSearchOntologyLabels(code)
            , ldp: Labels.getLdpLabels(code)
            , messages: Labels.getMessageLabels(code)
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
   * @param forms - an array of the forms used to create new items
   */
  handleLoginCallback(
      status
      , valid
      , username
      , password
      , userinfo
  ) {
    if (valid) {
      let userInfo = new User(
          username
          , password
          , userinfo.domain
          , userinfo.email
          , userinfo.firstname
          , userinfo.lastname
          , userinfo.title
          , true
          , {}
      );
      let session = this.state.session;
      session.userInfo = userInfo;

      this.setState({
        session: session
        , authenticated: true
        , loginFormMsg: this.state.language.labels.pageLogin.good
        , formsLoaded: false
        , forms: {}
        , agesIndex: {}
      });
    } else {
      let userInfo = new User(
          username
          , password
          , ""
          , ""
          , ""
          , ""
          , ""
          , false
          , {}
      );
      let session = this.state.session;
      session.userInfo = userInfo;

      this.setState({
        session
        , authenticated: false
        , loginFormMsg: this.state.language.labels.pageLogin.bad
        , formsLoaded: false
        , forms: {}
        , agesIndex: {}
      });
    }
  };

  // called after a successful login
  handleDropdownsCallback = (response) => {
    let forms = response.data;

    let session = this.state.session;
    session.userInfo.domains = forms.domains;

    let uiSchemas = new UiSchemas(
        forms.formsDropdown
        , forms.valueSchemas
        , forms.values
    );
    session.uiSchemas = uiSchemas;

    let dropdowns = new Dropdowns(
        forms.biblicalBooksDropdown
        , forms.biblicalChaptersDropdown
        , forms.biblicalVersesDropdown
        , forms.biblicalSubversesDropdown
        , forms.formsDropdown
        , forms.ontologyTypesDropdown
    );
    session.dropdowns = dropdowns;
    console.log(session);
    this.setState({
      session: session
      , formsLoaded: true
      , forms: forms.data
    });
  }

  handleAgesIndexCallback = (response) => {
    if (response) {
      let values = response.data.values[0];
      this.setState({
        agesIndexLoaded: true
        , agesIndex: values.tableData
      });
    }
  }

  handleSearchCallback(id, value) {
    if (id && id.length > 0) {
      this.setState({
        searching: false
        , data: {
          "idReferredByText": id,
          "referredByText": value
        }
      });
    }
  };

  handleSearchLinksCallback(id, value) {
    // TODO
  };

  handleSearchNotesCallback(id, value) {
    // TODO
  };
  handleSearchOntologyCallback(id, value) {
    // TODO
  };
  handleSearchTreebanksCallback(id, value) {
    // TODO
  };

  handleLdpCallback(value) {
    // TODO
  };

  handleNewEntryCallback(value) {
    // TODO
  };


  handleParallelTextEditorCallback(value) {
    this.setState({
      translatedText: value
    });
  };


  handleDomainSelectionCallback(id, description, domainObject) {
    this.setState({selectedDomain: "You selected: " + id + ": " + description});
  };

  handleSearchRequest = () => {
    this.setState({
      searching: true
    });
  }

  showModal = () => {
    this.setState({
      showModal: true
    });
  }

  closeModal = () => {
    this.setState({
      showModal: false
    });
  }

  node = (
      id
      , dependsOn
      , token
      , lemma
      , gloss
      , label
      , grammar
  ) => {
    let n = 0;
    n = parseInt(id);
    n++;
    let result = [
          {
            v: id
            , f:
          "<span class='App AppDependencyNodeToken'>"
          + token
          + "</span>"
          + "<sup>"
          + n
          + "</sup>"
          + "<div class='App AppDependencyNodeLabel'>"
          + label
          + " / "
          + grammar
          + '</div>'
          + "<div>"
          + "<span class='App AppDependencyNodeGloss'>"
          + gloss
          + '</span>'
          + " / "
          + "<span class='App AppDependencyNodeLemma'>"
          + lemma
          + "</span>"
          + "</div>"
          }
          , dependsOn
          , grammar
        ]
    ;
    return (
        result
    );
  }

  doNothingHandler = () => {
  }


  getParaTextEditor = () => {
    if (this.state.authenticated) {
      if (this.state.formsLoaded) {
        return (
            <div>
              <p>Parallel Row Text Editor. Shows source text and existing translations as rows in a table.  The user can enter his/her own translation.</p>
              <ParaRowTextEditor
                  session={this.state.session}
                  docType="Liturgical"
                  idLibrary="en_uk_gevsot"
                  idTopic="me.m01.d10"
                  idKey="meMA.Kathisma11.text"
                  value={this.state.translatedText}
                  onSubmit={this.handleParallelTextEditorCallback}
                  canChange={this.state.session.userInfo.isAuthorFor("en_uk_gevsot")}
              />
            </div>
        );
      } else {
        return (
            <Spinner message={this.state.language.labels.messages.retrieving}/>
        );
      }
    } else {
      return (
          <p>Parallel Row Text Editor.  You must log in first in order to see and use this.</p>
      );
    }
  }

  handleTopicsSelection(topic) {
    console.log("Selected topic: " + topic);
  }

  render() {
    return <div className="App">
      <div className="row App-content-row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <Jumbotron>
            <Image src={logo} responsive/>
            <h2>Demo and Documentation for Version {this.state.npmVersion}</h2>
            <p>This page provides a demonstration of <a href="https://facebook.github.io/react/"
                                                        target="_blank">React</a> components for web apps that access
              the IOC-Liturgical-WS REST API, and through it, the <a href="https://ioc-liturgical-db.org"
                                                                     target="_blank">IOC-Liturgical-DB database</a>. The
              database contains the Greek liturgical text of the Eastern Orthodox Christian Church, its Greek Biblical
              texts, and translations.</p>
            <p>Mission specialists at the Orthodox Christian Mission Center (<a href="https://www.ocmc.org"
                                                                                target="_blank">OCMC</a>) and volunteers
              built these components for use in their own open source liturgical web apps, and are providing them as a
              service to the world-wide Eastern Orthodox Christian community.</p>
            <p>The components provided by ioc-liturgical-react do not duplicate the functionality of other React
              components, e.g. <a href="https://react-bootstrap.github.io/" target="_blank">react-bootstrap</a>.
              Instead, the components provided by the ioc-liturgical-react encapsulate REST calls to the
              ioc-liturgical-ws and through it to the database, and encapsulate the response. This means that developers
              can use the components without detailed knowledge of how to access the database through the REST API.</p>
            <p>Each section below describes a component. Click on the name of the component you are interested in to
              view the description.</p>
            <p>With the exception of the Login component, for the demo it is not necessary to provide a username and
              password.</p>
            <p>See the sourcecode for this demo <a
                href="https://github.com/OCMC-Translation-Projects/ioc-liturgical-react/tree/master/demo/src"
                target="_blank">here</a>.</p>
          </Jumbotron>
          <Grid>
            <Alert bsStyle="warning">
              <p><Glyphicon glyph="bullhorn"/> We are actively working to reach a 1.0.0 release.</p>
            </Alert>
            <Alert bsStyle="danger">
              <p><Glyphicon glyph="warning-sign"/> The project is under active development, and APIs will change. </p>
            </Alert>
            <Alert bsStyle="danger">
              <p><Glyphicon glyph="warning-sign"/> Make sure that you use braces around the components you import from
                ioc-liturgical-react.</p>
            </Alert>
          </Grid>
          <Accordion>
            <Panel header="Setup" eventKey="setup">
              <p>In order to use the ioc-liturgical-react components, at the top level of your web app, you need to do
                the following:</p>
              <Accordion>
                <Panel header="Import the Labels Component" eventKey="setupImport">
                  The Labels component holds the translations of all the text used by the user interface of the
                  ioc-liturgical-react components.
                  <CodeExample codeText="import {Labels} from 'ioc-liturgical-react';"/>
                </Panel>
                <Panel header="Initialize the App State" eventKey="setupInitialize">
                  Here is the minimum you need to do to initialize the state of your App:
                  <CodeExample codeText={initialStateExample}/>
                  The restServer can be set to whatever domain you want, as long as it is running an ioc-liturgical-ws
                  server. The username and password are initialized to be an empty string, and authenticated is set to
                  false. You should set it to true later, after a user has successfully logged in. The authenticated
                  boolean can then be used for parts of your application that need to know whether the user has
                  successfully authenticated.
                  <p/>
                  <p>The language part of the state indicates what language is being used for the user interface. In
                    this case it is set to 'en' for English.</p>
                  <p/>
                  <p>The language.labels state is here initialized to 'en' (English), e.g. Labels.labels.en.search means
                    the English labels for the Search component. You will see below how to set up a mechanism for the
                    user to change the language of the user interface. It can only be changed to a language provided by
                    the ioc-liturgical-react, unless you complete replace the Labels with our own language.</p>
                </Panel>
                <Panel header="Create a Language Change Handler" eventKey="setupChangeHandler">
                  If your web app is only going to use a single language in the user interface, you will still need a
                  change handler, but it doesn't have to do anything. If you do plan to support more than one language
                  in your user interface, then here is how to set up your change handler:
                  <CodeExample codeText={languageChangeHandlerExample}/>
                  You will have to write your own code to give the user a way to indicate which language he/she wants to
                  use for the user interface. One technique is to set the language code in the id property of an
                  element, and pass it back to an onClick handler for the element. The language code used in the id is a
                  two or three character ISO code.
                  <p/>
                  <p>For example, you could have a menu item that displays the language choices, and set the id property
                    of the element to the language code. If you then have an onClick handler for that element, you can
                    use the event.target.id as the parameter to the languageChangeHander:</p>
                  <CodeExample codeText={menuLanguageChangeExample}/>
                  If the user clicks the above menu item, it calls a local language change handler. The local handler,
                  in turn, calls the handler passed as a prop:
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
              <p>Changing the language for the demo affects the labels for the components below this section. This also
                demonstrates the use of the Flag component. There is a flag for each language supported by the user
                interface. For example, to use the Flag component to get Modern Greek:</p>
              <CodeExample
                  codeText="<Flag code='el'/>"
              />
            </Panel> {/* Flags and Labels */}
            <Panel header="Login" eventKey="login">
              <Login
                  restServer={this.state.session.restServer}
                  username={this.state.session.userInfo.username} // initially set to ""
                  password={this.state.session.userInfo.password} // initially set to ""
                  loginCallback={this.handleLoginCallback}
                  dropdownsCallback={this.handleDropdownsCallback}
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
                      <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include
                        a final forward slash at the end.
                      </td>
                      <td>https://ioc-liturgical-ws.org/</td>
                    </tr>
                    <tr>
                      <td>username</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the username that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>password</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the password that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>loginCallback</td>
                      <td>Function</td>
                      <td>Required. This is your function that the Login component will call after a login attempt. You
                        should use this function to set the app state for the username and password for subsequent use
                        of ioc-liturgical-react components.
                      </td>
                      <td>Use a function signature like this: handleLoginCallback(status, valid, username, password).
                        The status is a string, and contains the HTTP response status of the REST API call. The valid
                        parm is a boolean. If the login succeeded, it will be set to true, otherwise false. The username
                        and password are the ones that were used for the login attempt.
                      </td>
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
                      <td>Required. Initialize to empty string. Based on the status received in the callback, you can
                        set the message to show to the user.
                      </td>
                      <td>Login successful.</td>
                    </tr>
                    </tbody>
                  </Table>
                  <CodeExample
                    codeText={loginCallbackSample}
                  />
                </Panel>
              </Accordion>
            </Panel> {/* Login */}
            <Panel header="Domain Selector" eventKey="domainSelector">
              <p>The Domain Selector is a dropdown that allows the user to select a domain. A selected domain can be
                used as a database search parameter since all docs in the database use the domain in the first part of
                the doc ID.</p>
              {(this.state.authenticated && this.state.formsLoaded) ?
                  <div>
                    <DomainSelector
                        session={this.state.session}
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
                      <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include
                        a final forward slash at the end.
                      </td>
                      <td>https://ioc-liturgical-ws.org/</td>
                    </tr>
                    <tr>
                      <td>username</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the username that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>password</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the password that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>loginCallback</td>
                      <td>Function</td>
                      <td>Required. This is your function that the Login component will call after a login attempt. You
                        should use this function to set the app state for the username and password for subsequent use
                        of ioc-liturgical-react components.
                      </td>
                      <td>Use a function signature like this: handleLoginCallback(status, valid, username, password).
                        The status is a string, and contains the HTTP response status of the REST API call. The valid
                        parm is a boolean. If the login succeeded, it will be set to true, otherwise false. The username
                        and password are the ones that were used for the login attempt.
                      </td>
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
                      <td>Required. Initialize to empty string. Based on the status received in the callback, you can
                        set the message to show to the user.
                      </td>
                      <td>Login successful.</td>
                    </tr>
                    </tbody>
                  </Table>
                </Panel>
              </Accordion>
            </Panel> {/* DomainSelector */}
            <Panel header="Search" eventKey="search">
              <p>The search component provides the user with a means for both a simple and an advanced search. The
                Search component takes an optional callback prop. If the callback prop is provided, the Search component
                can be used as a means for the user to look up a specific doc and let your app know which one he/she
                selected.</p>
              <Accordion>
                <Panel header="Search Text without a Callback" eventKey="4a">
                  <p>Use the Search component without a callback prop if all you want to do is give the user a means to
                    search the database, and the app does not need to know which doc the user selected from the search
                    results.</p>
                  <SearchText
                      session={this.state.session}
                      searchLabels={this.state.language.labels.search}
                      resultsTableLabels={this.state.language.labels.resultsTable}
                      initialDocType="Liturgical"
                  />
                </Panel> {/* Search Text without Callback*/}
                <Panel header="Search Text with a Callback" eventKey="searchWithCallback">
                  <p>Use the Search component with a callback prop if you are giving the user a means to search the
                    database in order to select a specific doc from the search results.</p>
                  {this.state.searching ?
                      <SearchText
                          session={this.state.session}
                          callback={this.handleSearchCallback}
                          searchLabels={this.state.language.labels.search}
                          resultsTableLabels={this.state.language.labels.resultsTable}
                          initialDocType="Liturgical"
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
                </Panel> {/* Search Text with a Callback */}
                <Panel header="Search Relationships" eventKey="5a">
                  <p>Use the Search component relationships component to search properties of relationships between two docs.</p>
                  <SearchRelationships
                      session={this.state.session}
//                      callback={this.handleSearchLinksCallback}
                      searchLabels={this.state.language.labels.searchLinks}
                      resultsTableLabels={this.state.language.labels.linkSearchResultsTable}
                  />
                </Panel> {/* Search Relationships */}
                <Panel header="Search Notes" eventKey="searchNotes">
                  <p>Use the Search Notes Component to search your personal notes.</p>
                  <SearchNotes
                      session={this.state.session}
                      callback={this.handleSearchNotesCallback}
                      editor={true}
                      initialType={"NoteUser"}
                      fixedType={false}
                  />
                </Panel> {/* Search Notes */}
                <Panel header="Search Ontology Instances" eventKey="searchOntology">
                  <p>Use the Search Ontology Component to search for instances of Ontology entries.</p>
                  <SearchOntology
                      session={this.state.session}
                      callback={this.handleSearchOntologyCallback}
                      editor={true}
                      initialType={"Human"}
                      fixedType={false}
                  />
                </Panel> {/* Search Relationships */}
                <Panel header="Search Treebanks" eventKey="searchTreebanks">
                  <p>Use the Search Notes Component to search your personal notes.</p>
                  { (this.state.authenticated  && this.state.formsLoaded) ?
                      <p></p>
                      :
                      <p>You must log in first in order to see and use this.</p>
                  }
                  { (this.state.authenticated && this.state.formsLoaded) &&
                  <SearchTreebanks
                      session={this.state.session}
                      callback={this.handleSearchTreebanksCallback}
                      editor={true}
                      initialType={"PtbWord"}
                      fixedType={false}
                  />
                  }
                </Panel> {/* Search Treebanks */}
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
                      <td>Required. The url of the ioc-liturgical-ws server, including the protocol. Be sure to include
                        a final forward slash at the end.
                      </td>
                      <td>this.state.restServer</td>
                    </tr>
                    <tr>
                      <td>username</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the username that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>password</td>
                      <td>String</td>
                      <td>Required, but initialize to an empty string. This is a placeholder for the password that the
                        user will enter. Passing it back in allows us to preserve the username in the event of a login
                        error.
                      </td>
                      <td>""</td>
                    </tr>
                    <tr>
                      <td>callback</td>
                      <td>Function</td>
                      <td>Optional. This is your function that the Search component will call after the user has
                        finished searching.
                      </td>
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
                      codeText={searchCallbackSample}
                  />
                </Panel>
              </Accordion>
            </Panel> {/* Search */}
            <Panel header="Liturgical Day Properties" eventKey="ldp">
              <p>Each day of the year has certain liturgical properties, e.g. the mode of the week, what day of the
                Triodion or Pentecostarion it might be, what the Eothinon is, etc.</p>
              <p/>
              <p>This component allows the user to select a date. The component will request the information from the
                backend REST API.</p>
              <LiturgicalDayProperties
                  session={this.state.session}
                  callback={this.handleLdpCallback}
                  labels={this.state.language.labels.ldp}
              />
            </Panel> {/* LiturgicalDayProperties */}
            <Panel header="Application Information" eventKey="info">
              <Configuration
                  appVersion={this.state.demoVersion}
                  appVersionLabel={this.state.language.labels.pageAbout.appVersion}
                  dbServerLabel={this.state.language.labels.pageAbout.DbServer}
                  restServer={this.state.session.restServer}
                  restServerLabel={this.state.language.labels.pageAbout.RestServer}
                  wsVersionLabel={this.state.language.labels.pageAbout.wsVersion}
                  synchEnabledLabel={this.state.language.labels.pageAbout.synchEnabled}
                  synchDbConnectionOkLabel={this.state.language.labels.pageAbout.synchDbConnectionOk}
              />
            </Panel> {/* Configuration */}
            <Panel header="Help - for Search Component" eventKey="helpSearch">
              <HelpSearch labels={this.state.language.labels.help.search}/>
            </Panel> {/* Help for search */}
            <Panel header="About the Database" eventKey="aboutdb">
              <AboutDatabase labels={this.state.language.labels.pageAbout}/>
            </Panel> {/* About Database */}
            <Panel header="Create a New Entry" eventKey="NewEntry">
              { (this.state.authenticated  && this.state.formsLoaded) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { (this.state.authenticated && this.state.formsLoaded) &&
              <NewEntry
                  session={this.state.session}
                  changeHandler={this.handleNewEntryCallback}
              />
              }
            </Panel> {/* New Item */}
            <Panel header="Dependency Diagram" eventKey="dependencyDiagram">
            </Panel> {/* Dependency Diagram */}
            <Panel header="Greek Liturgical Library Topics Selector" eventKey="grlibtopics">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated &&
                <TopicsSelector
                    session={this.state.session}
                    library="gr_gr_cog"
                    callBack={this.handleTopicsSelection}
                />
              }
            </Panel> {/* Greek Liturgical Library Topics Selector */}
            <Panel header="Parallel Column Text Editor" eventKey="paraColTextEditor">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated && this.state.formsLoaded &&
              <ParaColTextEditor
                  session={this.state.session}
                  source={"gr_gr_cog"}
              />
              }
            </Panel> {/* Parallel Column Text Editor */}
            <Panel header="Parallel Row Text Editor" eventKey="prte">
              {this.getParaTextEditor()}
            </Panel> {/* ParaRowTextEditor */}
            <Panel header="AGES Editor" eventKey="agesEditor">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated && this.state.formsLoaded &&
              <AgesEditor
                  session={this.state.session}
              />
              }
            </Panel> {/* AGES Editor */}
            <Panel header="AGES Viewer" eventKey="agesViewer">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated && this.state.formsLoaded &&
              <AgesViewer
                  session={this.state.session}
              />
              }
            </Panel> {/* AGES Viewer */}
            <Panel header="View References (aka REFERS_TO links)" eventKey="viewlinks">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated  && this.state.formsLoaded &&
                  <ViewReferences
                      session={this.state.session}
                      id="gr_gr_cog~me.m01.d10~meMA.Kathisma11.text"
                  />
              }
            </Panel> {/* View References */}
            <Panel header="Administrator" eventKey="admin">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated  && this.state.formsLoaded &&
              <Administrator
                  session={this.state.session}
              />
              }
            </Panel> {/* Administrator */}
            <Panel header="Template for Table Example" eventKey="tfort">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated  && this.state.formsLoaded &&
              <TemplateForTable
                  session={this.state.session}
              />
              }
            </Panel> {/* Template for Table */}
            {/*<Panel header="Life Cycle Demo" eventKey="lcd">*/}
              {/*<LifeCycleDemo languageCode={this.state.language.code}/>*/}
            {/*</Panel> /!* Life Cycle Demo *!/*/}
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
