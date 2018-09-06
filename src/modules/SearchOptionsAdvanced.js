import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from './ReactSelector'
import { Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import { get } from 'lodash';

/**
 * To future maintainers of this code.
 * This was written when I just started learning React Js.
 * The code I have written without a doubt needs to be
 * examined carefully if you are skilled in React JS,
 * and rewritten...
 * Michael Colburn, March 1, 2017
 */
class SearchOptions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      docType: this.props.docType
      , domain: "*"
      , selectedBook: "*"
      , selectedChapter: "*"
      , property: "nnp"
      , matcher: "c"
      , value: ""
      , dropdowns: {Biblical: [], Liturgical: [], loaded: false}
      , dropDownDomains: {
        show: true
        , msg: this.props.labels.domainIs
        , source: []
        , initialValue: "*"
      }
      ,
      dropDownBooks: {
        show: true
        , msg: this.props.labels.bookIs
        , source: []
        , initialValue: "*"
      }
      ,
      dropdownChapters: {
        show: false
        , msg: ""
        , initialValue: "*"
        , source: []
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
    this.getDropdownChapterTitle = this.getDropdownChapterTitle.bind(this);
    this.getDropdownSectionTitle = this.getDropdownSectionTitle.bind(this);
    this.resetDropDownBooksState = this.resetDropDownBooksState.bind(this);
    this.cascadeDocTypeChange = this.cascadeDocTypeChange.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
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
          } , function () {
            this.handleDocTypeChange({
              label: this.props.docType
              , value: this.props.docTyped
            })
          }
        }
    )
  };

  componentDidMount = () => {
    this.handleDocTypeChange({
      label: this.props.docType
      , value: this.props.docType
    });
  };
  componentWillReceiveProps = (nextProps) => {
    let docType = nextProps.docType;
    let domain = "*";
    let selectedBook = "*";
    let selectedChapter = "*";
    let property = "nnp";
    let matcher = "c";
    let value = "";
    let dropdownChapters = {};

    if (this.state) {
      if (this.state.docType) {
        docType = this.state.docType;
      }
      if (this.state.domain) {
        domain = this.state.domain;
      }
      if (this.state.selectedBook) {
        selectedBook = this.state.selectedBook;
      }
      if (this.state.selectedChapter) {
        selectedChapter = this.state.selectedChapter;
      }
      if (this.state.property) {
        property = this.state.property;
      }
      if (this.state.matcher) {
        matcher = this.state.matcher;
      }
      if (this.state.value) {
        value = this.state.value;
      }
      if (this.state.dropdownChapters) {
        dropdownChapters = this.state.dropdownChapters;
      } else {
        dropdownChapters =  {
          show: false
          , msg: ""
          , initialValue: "*"
          , source: []
        }

      }
    }


    this.setState(
        {
          docType: docType
          , domain: domain
          , selectedBook: selectedBook
          , selectedChapter: selectedChapter
          , property: property
          , matcher: matcher
          , value: value
          ,  dropdowns: {
            Biblical: {
              all: {
                books: nextProps.dropDowns.Biblical.all.books
                , chapters: nextProps.dropDowns.Biblical.all.chapters
              }
              , domains: nextProps.dropDowns.Biblical.domains
              , topics: nextProps.dropDowns.Biblical.topics
            }
            , Liturgical: {
              all: {
                books: nextProps.dropDowns.Liturgical.all.books
              }
              , domains: nextProps.dropDowns.Liturgical.domains
              , topics: nextProps.dropDowns.Liturgical.topics
            }
            , loaded: true
          }
          , dropdownChapters: dropdownChapters
        }, this.cascadeDocTypeChange(docType)
    )
  };

  isDisabled = () => {
    let disableButton = true;
    switch (this.state.docType) {
      case "All": {
        break;
      }
      case "Biblical": {
        if (this.state.value.length > 0) {
          disableButton = false;
        } else {
          if (this.state.domain == "*") {
            if (this.state.selectedBook == "*") {

            } else {
              disableButton = false;
            }
          } else {
            if (this.state.selectedBook == "*") {

            } else {
              disableButton = false;
            }
          }
        }
        break;
      }
      case "Liturgical": {
        if (this.state.value.length > 0) {
          disableButton = false;
        } else {
          if (this.state.domain == "*") {
            if (this.state.selectedBook == "*") {

            } else {
              disableButton = false;
            }
          } else {
            if (this.state.selectedBook == "*") {

            } else {
              disableButton = false;
            }
          }
        }
        break;
      }
      default: {
        break;
      }
    }
    return disableButton;
  };

  resetDropDownBooksState() {
    this.setState({
      selectedBook: "*"
      , dropDownBooks: {
        show: this.state.docType !== "Any"
        , msg: this.props.labels.bookIs
        , source: []
        , initialValue: "*"
      }
    });
  }

  handleDocTypeChange = (selection) => {
    this.setState({
      docType: selection["value"]
      , suggestedQuery: this.suggestedQuery(selection["value"])
      , domain: "*"
      , selectedBook: "*"
      , selectedChapter: "*"
    }, this.cascadeDocTypeChange(selection["value"]));
  };

  cascadeDocTypeChange(selection) {
    this.setDomainDropdown(selection);
    this.setGenericBookDropdown(selection);
    this.setGenericChaptersDropdown(selection);
  }

  handlePropertyChange = (item) => {
    this.setState({property: item.value});
  };

  handleMatcherChange = (item) => {
    this.setState({matcher: item.value});
  };

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  };

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
  };

  handleDomainChange = (selection) => {
    this.setState({domain: selection["value"]}, this.setBookDropdown(selection["value"]));
  };

  handleBookChange = (selection) => {
    this.setState({
      selectedBook: selection["value"]
    }, this.setChaptersDropdown(selection["value"]));
  };

  handleChapterChange = (selection) => {
    this.setState({
      selectedChapter: selection["value"]
      , dropdownChapters: {
        show: this.state.dropdownChapters.show
        , msg: this.state.dropdownChapters.msg
        , source: this.state.dropdownChapters.source
        , initialValue: selection["value"]
      }
    });
  };

  setDomainDropdown = (docType) => {
    let msg = "";
    let show = false;
    let source = {};
    let showBooks = false;
    let bookMsg = "";
    let bookSource = [];
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
          showBooks = true;
          bookMsg = this.props.labels.bookIs;
          bookSource = this.state.dropdowns.Liturgical["all"].books;
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
        , initialValue: "*"
      },
      dropDownBooks: {
        show: showBooks
        , msg: bookMsg
        , source: bookSource
        , initialValue: "*"
      },
      dropdownChapters: {
        show: false
        , msg: ""
        , source: []
        , initialValue: "*"
      }
    });
  };

  setGenericBookDropdown(type) {
    try {
      let msg = this.props.labels.bookIs;
      let show = false;
      let source = {};
      if (this.props.dropDowns) {
        if (type === "Biblical" && this.state.dropdowns.Biblical) {
          show = true;
          source = this.state.dropdowns.Biblical.all.books;
        } else if (type === "Liturgical" && this.state.dropdowns.Liturgical) {
          show = true;
          source = this.state.dropdowns.Liturgical.all.books;
        } // end of if
      }
      this.setState({
        dropDownBooks: {
          show: show
          , msg: msg
          , source: source
          , initialValue: "*"
        }
      });
    } catch (error) {
      this.setState({
        msg: error.message
      });
    }
  }; // end of method

  setBookDropdown(domain) {
    let msg = this.props.labels.bookIs;
    let show = false;
    let source = {};
    if (domain && domain === "*") {
      this.setGenericBookDropdown(this.state.docType);
    } else {
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
    }
  }; // end of method

  setChaptersDropdown(book) {
    let msg = "";
    let show = false;
    let source = {};
    if (this.state.docType === "Biblical") {
      if (this.state.domain === "*") {
        msg = this.props.labels.chapterIs;
        show = true;
        /**
         * If the combination of a domain and book exists, we will use its
         * chapter dropdown.
         *
         * Specifically, we will try to use certain
         * Greek language domains as the
         * basis to set generic chapter dropdowns.
         * For the Old Testament, we will use the UP CCATB LXX
         * Rahlf's version, and if not found, try each of the
         * LXX alternative manuscripts.  If that is not found,
         * we will assume we are searching the New Testament,
         * simply use the chapters for each book of the Patriarchal Greek NT.
         *
         */
        if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccat.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccat.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatb.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatb.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatba.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatba.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatog.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatog.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccats.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccats.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatth.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_eg_lxxupccatth.' + book];
        } else if (this.state.dropdowns.Biblical.topics['gr_gr_ntpt.' + book]) {
          source = this.state.dropdowns.Biblical.topics['gr_gr_ntpt.' + book];
        } else {
          source = this.state.dropdowns.Biblical.all.chapters;
        }
      } else {
        msg = this.props.labels.chapterIs;
        show = true;
        source = this.state.dropdowns.Biblical.topics[this.state.domain + '.' + book];
      }
    } else if (this.state.docType === "Liturgical") {
      if (this.state.dropdowns.loaded) {
        if (this.state.domain === "*") {
          source = this.state.dropdowns.Liturgical.topics["gr_gr_cog." + book]
          show = (source !== undefined);
        } else {
          source = this.state.dropdowns.Liturgical.topics[this.state.domain + "." + book]
          show = (source !== undefined);
        }
      }
    } // end of if
    this.setState({
      selectedChapter: "*"
      , dropdownChapters: {
        show: show
        , msg: msg
        , source: source
        , initialValue: "*"
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
      dropdownChapters: {
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

  getDropdownChapterTitle() {
    let msg = "";
    if (this.state.docType === "Biblical") {
      if (this.state.domain === "*") {
        msg = this.props.labels.chapterIs;
      } else {
        msg = this.props.labels.chapterIs;
      }
    } else if (this.state.docType === "Liturgical") {
      switch (this.state.selectedBook) {
        case "da":
          msg = this.props.labels.dayIs;
          break;
        case "eo":
          msg = this.props.labels.weekIs;
          break;
        case "eu":
          msg = this.props.labels.serviceIs;
          break;
        case "he":
          msg = this.props.labels.typeIs;
          break;
        case "hi":
          msg = this.props.labels.sectionIs;
          break;
        case "ho":
          msg = this.props.labels.sectionIs;
          break;
        case "oc":
          msg = this.props.labels.modeIs;
          break;
        case "me":
          msg = this.props.labels.monthIs;
          break;
        case "pe":
          msg = this.props.labels.dayIs;
          break;
        case "tr":
          msg = this.props.labels.dayIs;
          break;
        default:
          msg = this.props.labels.chapterIs;
      }
    } // end of if
    return msg;
  }

  getDropdownSectionTitle() {
    let msg = "";
    if (this.state.docType === "Biblical") {
    } else if (this.state.docType === "Liturgical") {
      switch (this.state.selectedBook) {
        case "he":
          msg = this.props.labels.modeIs;
          break;
        case "oc":
          msg = this.props.labels.dayIs;
          break;
        case "me":
          msg = this.props.labels.monthIs;
          break;
        default:
          msg = "undefined subsection";
      }
    } // end of if
    return msg;
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
                    multiSelect={false}
                />
              </div>
            </div>
            {this.state.dropDownDomains.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.domainIs}
                    initialValue={this.state.domain}
                    resources={this.state.dropDownDomains.source}
                    changeHandler={this.handleDomainChange}
                    multiSelect={false}
                />
              </div>
            </div>
            }
            {this.state.dropDownBooks.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.bookIs}
                    initialValue={this.state.selectedBook}
                    resources={this.state.dropDownBooks.source}
                    changeHandler={this.handleBookChange}
                    multiSelect={false}
                />
              </div>
            </div>
            }
            {this.state.dropdownChapters.show &&
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.getDropdownChapterTitle()}
                    initialValue={this.state.selectedChapter}
                    resources={this.state.dropdownChapters.source}
                    changeHandler={this.handleChapterChange}
                    multiSelect={false}
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
                  initialValue={this.state.property}
                  resources={this.props.properties}
                  changeHandler={this.handlePropertyChange}
                  multiSelect={false}
              />
              <form className={"App-Search-Options-Text-Form"} onSubmit={this.handleSubmit}>
                <div className="control-label">{this.props.labels.propertyTextIs}</div>
                <div className={"App-Search-Options-Text-Div"}>
                  <input
                      type="text"
                      onChange={this.handleValueChange}
                      className="App-search-text-input"
                      name="search"
                      value={this.state.value}
                  />
                </div>
                <ResourceSelector
                    title={this.props.labels.matcherIs}
                    initialValue={this.state.matcher}
                    resources={this.props.matchers}
                    changeHandler={this.handleMatcherChange}
                    multiSelect={false}
                />
                <div className="control-label">{this.props.labels.clickTheButton}</div>
                <Button
                    bsStyle="primary"
                    bsSize="xsmall"
                    type="submit"
                    disabled={this.isDisabled()}
                    onClick={this.handleSubmit}
                >
                  <FontAwesome className="Button-Select-FontAwesome" name={"search"}/>
                  {this.props.labels.submit}
                </Button>
              </form>
            </div>
          </div>
        </div>
    );
  }
}

SearchOptions.propTypes = {
  docType: PropTypes.string.isRequired
  , docTypes: PropTypes.array.isRequired
  , dropDowns: PropTypes.object.isRequired
  , properties: PropTypes.array.isRequired
  , matchers: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default SearchOptions;