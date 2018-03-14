import React from 'react';
import PropTypes from 'prop-types';
import {
  Glyphicon
} from 'react-bootstrap';

import { get } from 'lodash';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

class FormattedTextNote extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getFormattedTextNoteLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.getFormattedDiv = this.getFormattedDiv.bind(this);
    this.createMarkup = this.createMarkup.bind(this);
  };

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getFormattedTextNoteLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
          , somethingWeTrackIfChanged: get(this.state, "somethingWeTrackIfChanged", "" )
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  createMarkup() {
    return {__html: this.props.note};
  };

  getFormattedDiv = () => {
    if (this.props.type === "REF_TO_BIBLE") {
      return (
          <div className="App App-Text-Note-formatted">
              <span className="App App-Text-Note-Header-Scope">
                {this.props.scopeLiturgical}
              </span>
            <span className="App App-Text-Note-Header-Lemma">
                  {this.props.lemmaLiturgical}
                </span>
            <Glyphicon className="App App-Text-Note-Header-Scope-Glyph" glyph={"arrow-right"}/>
            <span className="App App-Text-Note-Header-Scope-Biblical">
                {this.props.scopeBiblical}
              </span>
            <span className="App App-Text-Note-Header-Lemma">
                  {this.props.lemmaBiblical}
                </span>
            <span className="App App-Text-Note-Header-Title">
                  {this.props.title}
                </span>
            <span className="App App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
          </div>
      );
    } else if (this.props.type.startsWith("REF_TO")) {
      return (
          <div className="App App-Text-Note-formatted">
              <span className="App App-Text-Note-Header-Scope">
                {this.props.scopeLiturgical}
              </span>
            <span className="App App-Text-Note-Header-Lemma">
                  {this.props.lemmaLiturgical}
                </span>
            <Glyphicon className="App App-Text-Note-Header-Scope-Glyph" glyph={"arrow-right"}/>
            <span className="App App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
          </div>
      );
    } else {
      return (
          <div className="App App-Text-Note-formatted">
              <span className="App App-Text-Note-Header-Scope">
                {this.props.scopeLiturgical}
              </span>
            <span className="App App-Text-Note-Header-Lemma">
                  {this.props.lemmaLiturgical}
                </span>
            <span className="App App-Text-Note-Header-Title">
                  {this.props.title}
                </span>
            <span className="App App-Text-Note-Header-Note" dangerouslySetInnerHTML={this.createMarkup()}>
                </span>
          </div>
      );
    }
  };

  // TODO: add the content for the render function
  render() {
    return (
        <div className="App App-Formatted-Text-Note">
          {this.getFormattedDiv()}
        </div>
    )
  }
};

FormattedTextNote.propTypes = {
  session: PropTypes.object.isRequired
  , note: PropTypes.string.isRequired
  , type: PropTypes.string.isRequired
  , title: PropTypes.string.isRequired
  , scopeLiturgical: PropTypes.string.isRequired
  , lemmaLiturgical: PropTypes.string.isRequired
  , scopeBiblical: PropTypes.string
  , lemmaBiblical: PropTypes.string
};

// set default values for props here
FormattedTextNote.defaultProps = {
  languageCode: "en"
};

export default FormattedTextNote;
