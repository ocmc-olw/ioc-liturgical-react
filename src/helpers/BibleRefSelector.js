import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {Col, ControlLabel, Grid, Row } from 'react-bootstrap';
import Labels from '../Labels';
import MessageIcons from './MessageIcons';

class BibleRefSelector extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getBibleRefSelectorLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , selectedBook: ""
      , citeBook: ""
      , selectedChapter: ""
      , selectedVerse: ""
      , selectedRef: ""
    }

    this.handleBookChange = this.handleBookChange.bind(this);
    this.handleChapterChange = this.handleChapterChange.bind(this);
    this.handleVerseChange = this.handleVerseChange.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleCallback = this.handleCallback.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getBibleRefSelectorLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

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
          <Col className="App App-Bible-Ref-Selector-Label" xs={2} md={2}>
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
        </Row>
    )
  }
}

BibleRefSelector.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
};

// set default values for props here
BibleRefSelector.defaultProps = {
  languageCode: "en"
};

export default BibleRefSelector;
