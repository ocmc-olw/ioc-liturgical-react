import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Select from 'react-select';
import {Col, ControlLabel, Grid, Row } from 'react-bootstrap';
import MessageIcons from './MessageIcons';

class BibleRefSelector extends React.Component {
  constructor(props) {
    super(props);
    let citeBook = "";
    let citeChapter = "";
    let citeVerse = "";

    if (props.book) {
      citeBook = props.book;
      citeChapter = props.chapter.substring(1,props.chapter.length);
      try {
        citeChapter = parseInt(citeChapter);
      } catch (err) {
        citeChapter = props.chapter;
      }
      citeVerse = 0;
      try {
        citeVerse = parseInt(props.verse);
      } catch (err) {
        citeVerse = props.verse;
      };
    }

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.BibleRefSelector]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , resultsTableLabels: labels[labelTopics.resultsTable]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , selectedBook: props.book
      , selectedChapter: props.chapter
      , selectedVerse: props.verse
      , selectedRef: ""
      , citeBook: citeBook
      , citeChapter: citeChapter
      , citeVerse: citeVerse
    };

    this.handleBookChange = this.handleBookChange.bind(this);
    this.handleChapterChange = this.handleChapterChange.bind(this);
    this.handleVerseChange = this.handleVerseChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let labels = nextProps.session.labels;
      let labelTopics = nextProps.session.labelTopics;

      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: labels[labelTopics.BibleRefSelector]
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , resultsTableLabels: labels[labelTopics.resultsTable]
          }
          , message: labels[labelTopics.messages].initial
          , selectedBook: get(this.state, "selectedBook", nextProps.book)
          , selectedChapter: get(this.state, "selectedChapter", nextProps.chapter)
          , selectedVerse: get(this.state, "selectedVerse", nextProps.verse)

        }
      }, function () { return this.handleStateChange("place holder")});
    }
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  handleCallback = () => {
    this.props.callback(
        this.state.selectedBook
        , this.state.selectedChapter
        , this.state.selectedVerse
        , this.state.citeBook
          +" "
          + this.state.citeChapter
          + ":"
          + this.state.citeVerse
    );
  };

  handleBookChange = (selection) => {
    let book = selection["value"];
    let bookLabel = selection["label"];
    let citeBook = "";
    try {
      let parts = bookLabel.split(" - ");
      citeBook = parts[0];
    } catch (err) {
      citeBook = book;
    }
    this.setState({
      selectedBook: book
      , citeBook: citeBook
      , selectedRef: book + "~" + this.state.selectedChapter + "~" + this.state.selectedVerse
    }, this.handleCallback);
  };

  handleChapterChange = (selection) => {
    if (selection && selection["value"]) {
      let chapter = selection["value"];
      let citeChapter = chapter.substring(1,chapter.length);
      try {
        citeChapter = parseInt(citeChapter);
      } catch (err) {
        citeChapter = selection["value"];
      }
      this.setState({
        selectedChapter: chapter
        , citeChapter: citeChapter
        , selectedRef: this.state.selectedBook + "~" + chapter + "~" + this.state.selectedVerse
      }, this.handleCallback);
    }
  };

  handleVerseChange = (selection) => {
    if (selection && selection["value"]) {
      let verse = selection["value"];
      let citeVerse = verse;
      try {
        citeVerse = parseInt(verse);
      } catch (err) {
        citeVerse = verse;
      };

      this.setState({
        selectedVerse: selection["value"]
        , citeVerse: citeVerse
        , selectedRef: this.state.selectedBook + "~" + this.state.selectedChapter + "~" + verse
      }, this.handleCallback);
    }
  };

  render() {
    return (
        <Row  className="show-grid App-Bible-Ref-Selector-Row">
          <Col className="App App-Bible-Ref-Selector-Label" xs={3} md={3}>
            <ControlLabel>Bible Ref:</ControlLabel>
          </Col>
          <Col className="App-Bible-Ref-Selector-Container" xs={2} md={2}>
            <Select
                name="App-Bible-Ref-Selector-Book"
                className="App-Bible-Ref-Selector-Book"
                value={this.state.selectedBook}
                options={this.props.session.dropdowns.biblicalBooksDropdown}
                onChange={this.handleBookChange}
                multi={false}
                autosize={true}
                clearable
            />
            <Col className="App App-Bible-Ref-Selector-Label" xs={2} md={2}>
            </Col>
            <Select
                name="App-Bible-Ref-Selector-Chapter"
                className="App-Bible-Ref-Selector-Chapter"
                value={this.state.selectedChapter}
                options={this.props.session.dropdowns.biblicalChaptersDropdown}
                onChange={this.handleChapterChange}
                multi={false}
                autosize={true}
                clearable
            />
            <Col className="App App-Bible-Ref-Selector-Label" xs={2} md={2}>
            </Col>
            <Select
                name="App-Bible-Ref-Selector-Verse"
                className="App-Bible-Ref-Selector-Verse"
                value={this.state.selectedVerse}
                options={this.props.session.dropdowns.biblicalVersesDropdown}
                onChange={this.handleVerseChange}
                multi={false}
                autosize={true}
                clearable
            />
          </Col>
          <Col className="App App-Bible-Ref-Selector-Label" xs={3} md={3}>
          </Col>
        </Row>
    )
  }
}

BibleRefSelector.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
  , book: PropTypes.string
  , chapter: PropTypes.string
  , verse: PropTypes.string
};

// set default values for props here
BibleRefSelector.defaultProps = {
  book: ""
  , chapter: ""
  , verse: ""
};

export default BibleRefSelector;
