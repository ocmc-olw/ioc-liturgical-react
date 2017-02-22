import React, { Component , PropTypes} from 'react';
import ResourceSelector from './ReactSelector'
import FontAwesome from 'react-fontawesome';

class SearchOptions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      docType: "Liturgical"
      , domain: "*"
      , selectedBook: "*"
      , selectedChapter: "*"
      , property: "nnp"
      , matcher: "c"
      , value: ""
      , dropdowns: {Biblical: [], Liturgical: [], loaded: false}
      , dropDownDomains: {
        show: false
        , msg: this.props.labels.domainIs
        , source: []
        , initialState: "*"
      }
      ,
      dropDownBooks: {
        show: false
        , msg: "and selected Book is:"
        , source: []
        , initialState: "*"
      }
      ,
      dropDownChapters: {
        show: false
        , msg: ""
        , source: []
        , initialState: "*"
      }
    };
    this.handleDocTypeChange = this.handleDocTypeChange.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
    this.handleBookChange = this.handleBookChange.bind(this);
    this.handleChapterChange = this.handleChapterChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleMatcherChange = this.handleMatcherChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setBookDropdown = this.setBookDropdown.bind(this);
    this.setChaptersDropdown = this.setChaptersDropdown.bind(this);
    this.setDomainDropdown = this.setDomainDropdown.bind(this);
    this.setGenericBookDropdown = this.setGenericBookDropdown.bind(this);
    this.setGenericChaptersDropdown = this.setGenericChaptersDropdown.bind(this);
    this.suggestedQuery = this.suggestedQuery.bind(this);

  }

  componentWillMount = () => {
    this.setState(
        {
          dropdowns: {
            Biblical: {
              all: {
                books: this.props.dropDowns.Biblical.all.books
                , chapters: this.props.dropDowns.Biblical.all.chapters
              }
              , domains: this.props.dropDowns.Biblical.domains
              , topics: this.props.dropDowns.Biblical.topics
            }
            , Liturgical: {
              all: {
                books: this.props.dropDowns.Liturgical.all.books
              }
              , domains: this.props.dropDowns.Liturgical.domains
              , topics: this.props.dropDowns.Liturgical.topics
            }
            , loaded: true
          }
        }
        , function () {
          this.handleDocTypeChange({
            value: "Liturgical"
          })
        }
    )
  }


  handleDocTypeChange = (selection) => {
    this.setState({
      docType: selection["value"]
      , suggestedQuery: this.suggestedQuery(selection["value"])
      , selectedBook: "*"
    });
    this.setDomainDropdown(selection["value"]);
//      this.setGenericBookDropdown(selection["value"]);
//      this.setGenericChaptersDropdown(selection["value"]);
  };

  handlePropertyChange = (item) => {
    this.setState({property: item.value});
  }

  handleMatcherChange = (item) => {
    this.setState({matcher: item.value});
  }

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(
        this.state.docType
        , this.state.domain
        , this.state.selectedBook
        , this.state.selectedChapter
        , this.state.property
        , this.state.matcher
        , this.state.value
    );
    event.preventDefault();
  }

  handleDomainChange = (selection) => {
    this.setState({domain: selection["value"]});
    this.setBookDropdown(selection["value"]);
  };

  handleBookChange = (selection) => {
    this.setState({
      selectedBook: selection["value"]
    });
    this.setChaptersDropdown(selection["value"]);
  };


  handleChapterChange = (selection) => {
    this.setState({
      selectedChapter: selection["value"]
    });
  }


  setDomainDropdown = (docType) => {
    let msg = "";
    let show = false;
    let source = {};
    switch (docType) {
      case "All": {
        show = false;
        break;
      }
      case "Biblical": {
        msg = this.props.labels.domainIs;
        show = true;
        if (this.state.dropdowns.loaded) {
          source = this.state.dropdowns.Biblical.domains;
        }
        break;
      }
      case "Liturgical": {
        msg = this.props.labels.domainIs;
        show = true;
        if (this.state.dropdowns.loaded) {
          source = this.state.dropdowns.Liturgical.domains;
        }
        break;
      }
      default: {
        show = false;
        break;
      }
    }
    this.setState({
      dropDownDomains: {
        show: show
        , msg: msg
        , source: source
      },
      dropDownBooks: {
        show: false
        , msg: ""
        , source: []
      },
      dropDownChapters: {
        show: false
        , msg: ""
        , source: []
      }
    });
  }


  setGenericBookDropdown(type) {
    let msg = "and selectedBook is:";
    let show = false;
    let source = {};
    if (type === "Biblical") {
      show = true;
      source = this.props.dropdowns.Biblical.all.books;
    } else if (type === "Liturgical") {
      show = true;
      source = this.props.dropdowns.Liturgical.all.books;
    } // end of if
    this.setState({
      dropDownBooks: {
        show: show
        , msg: msg
        , source: source
      }
    });
  } // end of method

  setBookDropdown(domain) {
    let msg = "and selectedBook is:";
    let show = false;
    let source = {};
    if (this.state.docType === "Biblical") {
      show = true;
      source = this.state.dropdowns.Biblical.topics[domain];
    } else if (this.state.docType === "Liturgical") {
      show = true;
      source = this.state.dropdowns.Liturgical.topics[domain];
    } // end of if
    this.setState({
      dropDownBooks: {
        show: show
        , msg: msg
        , source: source
      }
    });
  } // end of method

  setChaptersDropdown(book) {
    let msg = "";
    let show = false;
    let source = {};
    if (this.state.docType === "Biblical") {
      if (this.state.domain === "*") {
        msg = "Select Chapter...";
        show = true;
        source = this.state.dropdowns.Biblical.all.chapters;
      } else {
        msg = "Select Chapter...";
        show = true;
        source = this.state.dropdowns.Biblical.topics[this.state.domain + '.' + book];
      }
    } else if (this.state.docType === "Liturgical") {
      switch (book) {
        case "me":
          msg = "Select month...";
          show = true;
          if (this.state.dropdowns.loaded) {
            source = this.state.dropdowns.Liturgical.topics[this.state.domain + "." + book];
          } else {
            source = this.state.daysOfMonth;
          }
          break;
        default:
      }
    } // end of if
    this.setState({
      dropDownChapters: {
        show: show
        , msg: msg
        , source: source
      }
    });
  } // end of method

  setGenericChaptersDropdown(type) {
    let msg = "";
    let show = false;
    let source = {};
    if (type === "Biblical") {
      msg = "Select Chapter...";
      show = true;
      source = this.state.dropdowns.Biblical.all.chapters;
    } // end of if
    this.setState({
      dropDownChapters: {
        show: show
        , msg: msg
        , source: source
      }
    });
  } // end of method


  suggestedQuery(docType) {
    if (docType === "Biblical") {
      return "Enter a word or phrase from the Bible, even Greek...";
    } else if (docType === "Liturgical") {
      return "Enter a word or phrase from the Liturgical texts, even Greek...";
    } else {
      return "Enter a word or phrase from the Liturgical texts or the Bible, even Greek...";
    }
  }

  render() {
    return (
        <div className="container">
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.findWhereTypeIs}
                    initialValue={this.state.docType}
                    resources={this.props.docTypes}
                    changeHandler={this.handleDocTypeChange}
                />
              </div>
            </div>
            {this.state.dropDownDomains.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.domainIs}
                    initialValue="*"
                    resources={this.state.dropDownDomains.source}
                    changeHandler={this.handleDomainChange}
                />
              </div>
            </div>
            }
            {this.state.dropDownBooks.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.state.dropDownBooks.msg}
                    initialValue={"*"}
                    resources={this.state.dropDownBooks.source}
                    changeHandler={this.handleBookChange}
                />
              </div>
            </div>
            }
            {this.state.dropDownChapters.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.state.dropDownChapters.msg}
                    initialValue={"*"}
                    resources={this.state.dropDownChapters.source}
                    changeHandler={this.handleChapterChange}
                />
              </div>
            </div>
            }
            <div><p/></div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <ResourceSelector
                  title={this.props.labels.propertyIs}
                  initialValue=""
                  resources={this.props.properties}
                  changeHandler={this.handlePropertyChange}
              />
              <ResourceSelector
                  title={this.props.matcherTitle}
                  initialValue=""
                  resources={this.props.matchers}
                  changeHandler={this.handleMatcherChange}
              />
              <form onSubmit={this.handleSubmit}>
                <div className="control-label"></div>
                <input
                    type="text"
                    onChange={this.handleValueChange}
                    className="App-search-text-input"
                    name="search"/>
                <span className="App-text-search-icon" >
                    <FontAwesome
                        type="submit"
                        onClick={this.handleSubmit}
                        name={"search"}/>
                </span>
              </form>
            </div>
          </div>
        </div>
    );
  }
}

SearchOptions.propTypes = {
  docTypes: PropTypes.array.isRequired
  , dropDowns: PropTypes.object.isRequired
  , properties: PropTypes.array.isRequired
  , matchers: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default SearchOptions;