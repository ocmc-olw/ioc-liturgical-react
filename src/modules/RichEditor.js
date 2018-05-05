import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import Labels from '../Labels';
import CitationButton from '../helpers/CitationButton';
import MessageIcons from '../helpers/MessageIcons';
import {
  EditorState
  , ContentState
  , convertToRaw
} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

class RichEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    const blocksFromHtml = htmlToDraft(props.content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);

    this.state = {
      labels: {
        thisClass: Labels.getRichEditorLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , editorState: editorState
      , content: ""
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
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
            thisClass: Labels.getRichEditorLabels(languageCode)
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

  onEditorStateChange = (editorState) => {
    let plain = editorState.getCurrentContent().getPlainText();
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState: editorState
      , plain: plain
      , html: html
    }, this.props.handleEditorChange(plain, html));
  };

  render() {
    const { editorState } = this.state;
    return (
          <Editor
              editorState={editorState}
              wrapperClassName="RichEditor-root"
              editorClassName="RichEditor-editor"
              onEditorStateChange={this.onEditorStateChange}
              toolbarCustomButtons={[<CitationButton />]}
              spellCheck={true}
              toolbar={{
                options: [
                    'inline'
                  , 'blockType'
                  , 'fontSize'
                  , 'list'
                  , 'link'
                  , 'history'
                ]
                , inline: {
                  options: [
                    'bold'
                    , 'italic'
                    , 'underline'
                  ]
                }
              }}
          />
    )
  }
};

RichEditor.propTypes = {
  session: PropTypes.object.isRequired
  , handleEditorChange: PropTypes.func.isRequired
  , content: PropTypes.string
};

// set default values for props here
RichEditor.defaultProps = {
  languageCode: "en"
  , content: "<p>Enter text here.</p>"
};

export default RichEditor;
