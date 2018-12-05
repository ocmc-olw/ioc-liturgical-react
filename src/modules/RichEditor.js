import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
    const blocksFromHtml = htmlToDraft(props.content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
    const editorState = EditorState.createWithContent(contentState);

    let mention = {};
    if (props.suggestions) {
      mention={
        separator: ' ',
            trigger: '@',
            suggestions: this.props.suggestions
      };
    }
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , editorState: editorState
      , content: ""
      , mention: mention
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
      let mention = {};
      if (nextProps.suggestions) {
        mention={
          separator: ' ',
          trigger: '@',
          suggestions: nextProps.suggestions
        };
      }
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;

    this.setState((prevState, props) => {
        return {
          message: labels[labelTopics.messages].initial
          , somethingWeTrackIfChanged: get(this.state, "somethingWeTrackIfChanged", "" )
          , mention: mention
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
                  // , 'blockType'
                  // , 'fontSize'
                  // , 'list'
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
              mention={this.state.mention}
          />
    )
  }
};

RichEditor.propTypes = {
  session: PropTypes.object.isRequired
  , handleEditorChange: PropTypes.func.isRequired
  , content: PropTypes.string
  , suggestions: PropTypes.array
};

// set default values for props here
RichEditor.defaultProps = {
  languageCode: "en"
  , content: "<p>Enter text here.</p>"
};

export default RichEditor;
