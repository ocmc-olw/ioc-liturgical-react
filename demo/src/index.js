import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../../node_modules/font-awesome/css/font-awesome.css'
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'
import './css/alwb.css';
import './css/Demo.css'; // important that you load this as the last css
import '../../node_modules/draft-js/dist/Draft.css'
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
  , ChangePassword
  , Configuration
  , BibleRefSelector
  , DependencyDiagram
  , DomainSelector
  , DownloadUserRecords
  , Dropdowns
  , EditableSelector
  , Flag
  , HelpSearch
  , Html5VideoPanel
  , LiturgicalDayProperties
  , Login
  , NewEntry
  , ParaColLabelEditor
  , ParaRowTextEditor
  , SearchNotes
  , SearchOntology
  , SearchTemplates
  , SearchGeneric
  , SearchText
  , SearchTextNotes
  , SearchTreebanks
  , SearchRelationships
  , Session
  , Spinner
  , TemplateEditor
  , TextNoteEditor
  , TopicsSelector
  , UiSchemas
  , User
  , ViewReferences
  , WorkflowForm
  , YoutubeVideoPanel
} from '../../src';

import VersionNumbers from '../../src/helpers/VersionNumbers'
import ParaColTextEditor from "../../src/ParaColTextEditor";
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
      , loginFormMsg: ""
      , data: {
        "idReferredByText": "gr_gr_cog~me.m01.d01~meVE.Stichera01.text",
        "referredByText": "Συγκαταβαίνων ὁ Σωτήρ, τῷ γένει τῶν ἀνθρώπων, κατεδέξατο σπαργάνων περιβολήν, οὐκ ἐβδελύξατο σαρκὸς τὴν περιτομήν, ὁ ὀκταήμερος κατὰ τὴν Μητέρα, ὁ ἄναρχος κατὰ τὸν Πατέρα. Αὐτῷ πιστοὶ βοήσωμεν. Σὺ εἶ ὁ Θεὸς ἡμῶν, ἐλέησον ἡμᾶς."
      }
      , searching: false
      , selectedDomain: "Your selection will appear here:"
      , translatedText: "On this day the Master Christ * stood in the streams of the Jordan. * By the holy Forerunner * he was baptized in the waters. * From above, the Father bore witness to Him, saying, * \\\"This is my beloved Son in whom I am well-pleased\\\"; * and amazingly the Spirit * appeared above him * in the form of a dove."
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
      , templateTreeData: [
      {
        title: 'TEMPLATE',
        subtitle: 'en_us_ages~datedServices~se.m01.d01.li',
        expanded: true,
        children: [
          {
            "title": "WHEN_DAY_OF_WEEK_IS",
            "subtitle": "",
            "children": [
              {
                "title": "SUNDAY",
                "subtitle": "",
                "children": [
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~ST.li.ba.oc_me",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._01_Enarxis__.daily",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._02_Antiphons__.sundays_weekdays_feasts",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._04_Entrance__.clergy",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.choir",
                    "children": [
                    ]
                  },
                  {
                    "title": "SECTION",
                    "subtitle": "en_us_ages~se.m01.d01.ma~sunday.hymns",
                    "children": [
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~AP.res__.modeofweek",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~AP.res__.AP.me2_",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~TI.s._00_saint_.m",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~AP.me1_.hymn",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.local",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~KO.seasonal",
                        "children": [
                        ]
                      },
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._06_Trisagion__.basil",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LE._01_Epistle__.menaion_",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LE._02_Gospel__.menaion_",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._08_Liturgy__.basil",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._09_Dismissal__.commemoration",
                    "children": [
                    ]
                  }
                ]
              },
              {
                "title": "OTHERWISE",
                "subtitle": "",
                "children": [
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~ST.li.ba.me",
                    "children": [
                      {
                        "title": "PARAGRAPH",
                        "children": [
                          {
                            "title": "SID",
                            "subtitle": "gr_gr_cog~misc~book.Octoechos.name",
                            "children": [
                            ]
                          },
                        ]
                      }
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._01_Enarxis__.daily",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._02_Antiphons__.sundays_weekdays_feasts",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._04_Entrance__.clergy",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.choir",
                    "children": [
                    ]
                  },
                  {
                    "title": "SECTION",
                    "subtitle": "en_us_ages~se.m01.d01.ma~otherwise.hymns",
                    "children": [
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~AP.me2_",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~TI.s._00_saint_.m",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~AP.me1_.hymn",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.local",
                        "children": [
                        ]
                      },
                      {
                        "title": "INSERT_SECTION",
                        "subtitle": "en_us_ages~blocks~KO.seasonal",
                        "children": [
                        ]
                      },
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._06_Trisagion__.basil",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LE._01_Epistle__.menaion_",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LE._02_Gospel__.menaion_",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._08_Liturgy__.basil",
                    "children": [
                    ]
                  },
                  {
                    "title": "INSERT_SECTION",
                    "subtitle": "en_us_ages~blocks~LI._09_Dismissal__.commemoration",
                    "children": [
                    ]
                  }
                ]
              }
            ]
          }
      ]
      }
    ]
      , oldtemplateTreeData: [
        {
          title: 'TEMPLATE',
          subtitle: 'en_us_ages~datedServices~se.m01.d01.li',
          expanded: true,
          children: [
            {
              "title": "WHEN_DAY_OF_WEEK_IS",
              "subtitle": "",
              "children": [
                {
                  "title": "SUNDAY",
                  "subtitle": "",
                  "children": [
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~ST.li.ba.oc_me",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._01_Enarxis__.daily",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._02_Antiphons__.sundays_weekdays_feasts",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._04_Entrance__.clergy",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.choir",
                      "children": [
                      ]
                    },
                    {
                      "title": "SECTION",
                      "subtitle": "en_us_ages~se.m01.d01.ma~sunday.hymns",
                      "children": [
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~AP.res__.modeofweek",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~AP.res__.AP.me2_",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~TI.s._00_saint_.m",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~AP.me1_.hymn",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.local",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~KO.seasonal",
                          "children": [
                          ]
                        },
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._06_Trisagion__.basil",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LE._01_Epistle__.menaion_",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LE._02_Gospel__.menaion_",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._08_Liturgy__.basil",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._09_Dismissal__.commemoration",
                      "children": [
                      ]
                    }
                  ]
                },
                {
                  "title": "OTHERWISE",
                  "subtitle": "",
                  "children": [
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~ST.li.ba.me",
                      "children": [
                        {
                          "title": "PARAGRAPH",
                          "children": [
                            {
                              "title": "SID",
                              "subtitle": "gr_gr_cog~misc~book.Octoechos.name",
                              "children": [
                              ]
                            },
                          ]
                        }
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._01_Enarxis__.daily",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._02_Antiphons__.sundays_weekdays_feasts",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._04_Entrance__.clergy",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.choir",
                      "children": [
                      ]
                    },
                    {
                      "title": "SECTION",
                      "subtitle": "en_us_ages~se.m01.d01.ma~otherwise.hymns",
                      "children": [
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~AP.me2_",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~TI.s._00_saint_.m",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~AP.me1_.hymn",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~LI._05_AfterEntranceHymns__.local",
                          "children": [
                          ]
                        },
                        {
                          "title": "INSERT_SECTION",
                          "subtitle": "en_us_ages~blocks~KO.seasonal",
                          "children": [
                          ]
                        },
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._06_Trisagion__.basil",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LE._01_Epistle__.menaion_",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LE._02_Gospel__.menaion_",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._08_Liturgy__.basil",
                      "children": [
                      ]
                    },
                    {
                      "title": "INSERT_SECTION",
                      "subtitle": "en_us_ages~blocks~LI._09_Dismissal__.commemoration",
                      "children": [
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
  };

    // language change functions
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleLanguageToogle = this.handleLanguageToogle.bind(this);

    // component callbacks
    this.handleAgesIndexCallback = this.handleAgesIndexCallback.bind(this);
    this.handleDomainSelectionCallback = this.handleDomainSelectionCallback.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleLoginCallback = this.handleLoginCallback.bind(this);
    this.handleSearchCallback = this.handleSearchCallback.bind(this);
    this.handleSearchNotesCallback = this.handleSearchNotesCallback.bind(this);
    this.handleSearchTemplatesCallback = this.handleSearchTemplatesCallback.bind(this);
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
    this.bibleRefSelectorCallback = this.bibleRefSelectorCallback.bind(this);
    this.handleTextNoteContentChange = this.handleTextNoteContentChange.bind(this);
    this.handleEditableListCallback = this.handleEditableListCallback.bind(this);
    this.handleWorkflowCallback = this.handleWorkflowCallback.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount = () => {
  };

  handleWorkflowCallback = (status, visibility, user) => {
    console.log(`status=${status} visibility=${visibility} user=${user}`);
  };

  handleDelete = () => {

  };

  handleLabelChange = (language, topic, key, value) => {
    try {
      let labels = this.state.session.labels;
      let labelsAll = this.state.session.labelsAll;
      let labelTopics = this.state.session.labelTopics;

      labelsAll[language][topic][key] = value;

      if (language.endsWith(this.state.session.languageCode)) {
        labels[topic][key] = value;
      }
      if (! labelTopics[topic]){
        labelTopics[topic] = topic;
      }
      this.setState(
          {
            labels: labels
            , labelsAll: labelsAll
            , labelTopics: labelTopics
          }
      );
    } catch (err) {
      console.log(err);
    }

  };

  handleTextNoteContentChange = (content) => {
    console.log(content);
  };

  handleEditableListCallback = (values) => {
    console.log(values);
  };
  bibleRefSelectorCallback = (book, chapter, verse) => {
    this.setState (
        {
          bibleRefSelectorBook: book
          , bibleRefSelectorChapter: chapter
          , bibleRefSelectorVerse: verse
        }
    );
  };

  /**
   *
   * @param code the 2 or three letter ISO code for the language
   */
  handleLanguageChange = (code) => {
    if (code.length > 0 && code !== "undefined") {
      let session = this.state.session;
      session.languageCode = code;
      session.labels = session.labelsAll[code];
      this.setState({
        session
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
      , userdata
  ) {
    if (valid) {
      let userinfo = userdata[0];
      let prefs = userdata[1];
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
          , prefs
      );
      let session = this.state.session;
      session.userInfo = userInfo;

      this.setState({
        session: session
        , authenticated: true
        , loginFormMsg: session.labels[session.labelTopics.pageLogin].good
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
          , {}
      );
      let session = this.state.session;
      session.userInfo = userInfo;

      this.setState({
        session
        , authenticated: false
        , loginFormMsg: this.state.session.labels[this.state.session.labelTopics.pageLogin].bad
        , formsLoaded: false
        , forms: {}
        , agesIndex: {}
      });
    }
  };

  // called after a successful login
  handleDropdownsCallback = (response) => {
    let forms = response.data;
    console.log(forms);
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
        , forms.templateNewTemplateDropdown
        , forms.templatePartsDropdown
        , forms.templateWhenDayNameCasesDropdown
        , forms.templateWhenDayOfMonthCasesDropdown
        , forms.templateWhenDayOfSeasonCasesDropdown
        , forms.templateWhenModeOfWeekCasesDropdown
        , forms.templateWhenMonthNameCasesDropdown
        , forms.liturgicalBooksDropdown
        , forms.noteTypesDropdown
        , forms.noteTypesBilDropdown
        , forms.schemaEditorFormsDropdown
        , forms.bibTexStyles
        , forms.uiDomains
        , forms.uiLanguages
        , forms.uiSystems
    );
    session.dropdowns = dropdowns;
    session.labelsAll = forms.uiLabels;
    session.labels = session.labelsAll[session.languageCode];
    if (forms.uiLabelTopics) {
      session.labelTopics = forms.uiLabelTopics;
    }
    console.log(session);
    this.setState({
      session: session
      , formsLoaded: true
      , forms: forms.data
    });
  };

  handleAgesIndexCallback = (response) => {
    if (response && response.data && response.data.values) {
      let values = response.data.values[0];
      if (values.tableData) {
        this.setState({
          agesIndexLoaded: true
          , agesIndex: values.tableData
        });
      }
    }
  };

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
  handleSearchTextNotesCallback(id, value) {
    // TODO
  };
  handleSearchOntologyCallback(id, value) {
    // TODO
  };
  handleSearchTemplatesCallback(id, value) {
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
  };

  showModal = () => {
    this.setState({
      showModal: true
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false
    });
  };

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
                  idLibrary="en_us_dedes"
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
            <Spinner message={this.state.session.labels[this.state.session.labelTopics.messages].retrieving}/>
        );
      }
    } else {
      return (
          <p>Parallel Row Text Editor.  You must log in first in order to see and use this.</p>
      );
    }
  };

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
                  formPrompt={this.state.session.labels[this.state.session.labelTopics.pageLogin].prompt}
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
            <Panel header="Change Password" eventKey="changePassword">
              {(this.state.authenticated && this.state.session.userInfo) ?
                  <div>
                    <ChangePassword
                        session={this.state.session}
                        callback={this.handleLoginCallback}
                        formPrompt={this.state.session.labels[this.state.session.labelTopics.pageLogin].prompt}
                        formMsg={this.state.loginFormMsg}
                    />
                  </div>
                  :
                  <p>You won't see the example, below, unless you first login using the Login example above.</p>
              }
            </Panel>
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
                  />
                </Panel> {/* Search Relationships */}
                <Panel header="Search Notes" eventKey="searchNotes">
                  {(this.state.authenticated && this.state.session.userInfo) ?
                      <div>
                        <p>Use the Search Notes Component to search your personal notes.</p>
                        <SearchNotes
                            session={this.state.session}
                            callback={this.handleSearchNotesCallback}
                            editor={true}
                            initialType={"NoteUser"}
                            fixedType={false}
                        />
                      </div>
                      :
                      <p>You won't see the example, below, unless you first login using the Login example above.</p>
                  }
                </Panel> {/* Search Text Notes */}
                <Panel header="Search Text Notes" eventKey="searchText Notes">
                  {(this.state.authenticated && this.state.session.userInfo) ?
                      <div>
                        <p>Use the Search Text Notes Component to search notes about texts.</p>
                        <SearchTextNotes
                            session={this.state.session}
                            callback={this.handleSearchTextNotesCallback}
                            editor={true}
                            fixedType={false}
                        />
                      </div>
                      :
                      <p>You won't see the example, below, unless you first login using the Login example above.</p>
                  }
                </Panel> {/* Search Notes */}
                <Panel header="Search Ontology Instances" eventKey="searchOntology">
                  {(this.state.authenticated && this.state.session.userInfo) ?
                      <div>
                        <p>Use the Search Ontology Component to search for instances of Ontology entries.</p>
                        <SearchOntology
                            session={this.state.session}
                            editor={true}
                            initialType={"Human"}
                            fixedType={false}
                        />
                      </div>
                      :
                      <p>You won't see the example, below, unless you first login using the Login example above.</p>
                  }
                </Panel> {/* Search Relationships */}
                <Panel header="Search Templates" eventKey="searchTemplates">
                  {(this.state.authenticated && this.state.session.userInfo) ?
                      <div>
                        <p>Use the Search Templates Component to search components used for generation of books and services.</p>
                        <SearchTemplates
                            session={this.state.session}
                            callback={this.handleSearchTemplatesCallback}
                            editor={true}
                            initialType={"Template"}
                            fixedType={false}
                        />
                      </div>
                      :
                      <p>You won't see the example, below, unless you first login using the Login example above.</p>
                  }
                </Panel> {/* Search Notes */}
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
                <Panel header="Search Generic" eventKey="searchGeneric
                ">
                  {(this.state.authenticated && this.state.session.userInfo) ?
                      <div>
                        <p>Use the Search Generic Component to search a limited variety of types of records.</p>
                        <SearchGeneric
                            session={this.state.session}
                            callback={this.handleSearchNotesCallback}
                            editor={true}
                            fixedType={false}
                        />
                      </div>
                      :
                      <p>You won't see the example, below, unless you first login using the Login example above.</p>
                  }
                </Panel> {/* Search Generic */}
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
              />
            </Panel> {/* LiturgicalDayProperties */}
            <Html5VideoPanel
                title={"Html5 Video Panel"}
                text={"This is the text of the video panel."}
                url={"https://liml.org/static/video/olw-login.mp4"}
                eventKey={"html5video"}
            />
            <YoutubeVideoPanel
                title={"YouTube Video Panel"}
                text={"This is the text of the video panel."}
                videoId={"dwtervZaeQo"}
                eventKey={"youtubevideo"}
            />
            <Panel header="Application Information" eventKey="info">
              <Configuration
                  session={this.state.session}
                  appVersion={this.state.demoVersion}
                  restServer={this.state.session.restServer}
              />
            </Panel> {/* Configuration */}
            <Panel header="Help - for Search Component" eventKey="helpSearch">
              <HelpSearch session={this.state.session}/>
            </Panel> {/* Help for search */}
            <Panel header="About the Database" eventKey="aboutdb">
              <AboutDatabase session={this.state.session}/>
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
            <Panel header="Parallel Column Label Editor" eventKey="paraColLabelEditor">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated && this.state.formsLoaded &&
              <ParaColLabelEditor
                  session={this.state.session}
                  source={"en_sys_ilr"}
                  callback={this.handleLabelChange}
              />
              }
            </Panel> {/* Parallel Column Label Editor */}
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
            <Panel header="Template Editor" eventKey="templateNodeEditor">
              { (this.state.authenticated) ?
                  <p></p>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              { this.state.authenticated  && this.state.formsLoaded &&
              <TemplateEditor
                  session={this.state.session}
                  treeData={this.state.templateTreeData}
                  idLibrary={"en_us_dedes"}
                  idTopic={"se.m01.d01.li"}
              />
              }
            </Panel> {/* Template Editor */}
            <Panel header="User Records Download" eventKey="userRecords">
              { (this.state.authenticated) ?
                  <DownloadUserRecords
                      session={this.state.session}
                  />
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
            </Panel> {/* Download User Records */}
            <Panel header="Biblical Reference Selector" eventKey="BibleRefSelector">
              { (this.state.authenticated) ?
                  <div>
                  <BibleRefSelector
                      session={this.state.session}
                      callback={this.bibleRefSelectorCallback}
                  />
                  <p>
                    <span>{this.state.bibleRefSelectorBook}</span>
                    <span>{this.state.bibleRefSelectorChapter}</span>
                  </p>
                  </div>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
              </Panel> {/* Biblical Reference Selector */}
            <Panel header="Editable Selector" eventKey="EditableSelector">
              { (this.state.authenticated) ?
                  <div>
                    <EditableSelector
                        session={this.state.session}
                        initialValue={""}
                        options={[]}
                        changeHandler={this.handleEditableListCallback}
                        title={"Tags"}
                        multiSelect={false}/>
                  </div>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
            </Panel> {/* Biblical Reference Selector */}
            <Panel header="Text Note Editor" eventKey="TextNoteEditor">
              { (this.state.authenticated) ?
                  <div>
                    <TextNoteEditor
                        session={this.state.session}
                        textId={"gr_gr_cog~he.h.m2~VythouAnekalypse.text"}
                        onEditorChange={this.handleTextNoteContentChange }
                        deleteCallback={this.handleDelete}
                  />
                  </div>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
            </Panel> {/* Text Note Editor */}
            <Panel header="Workflow Form" eventKey="WorkflowForm">
              { (this.state.authenticated) ?
                  <div>
                    <WorkflowForm
                        session={this.state.session}
                        library={"en_sys_ontology"}
                        callback={this.handleWorkflowCallback}
                    />
                  </div>
                  :
                  <p>You must log in first in order to see and use this.</p>
              }
            </Panel> {/* Workflow Form */}
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
