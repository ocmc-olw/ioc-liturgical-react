import React from 'react';
import PropTypes from 'prop-types';
import {Glyphicon} from 'react-bootstrap';
import { EditorState, Modifier } from 'draft-js';

// see https://draftjs.org/docs/api-reference-modifier.html#content
// copy from here when ready to make this more useful:
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/controls/BlockType/index.js

export class CitationButton extends React.Component {

  addCitation = () => {
    const { editorState, onChange } = this.props;
    const contentState = Modifier.replaceText(
        editorState.getCurrentContent()
        , editorState.getSelection()
        ,'<>'
        , editorState.getCurrentInlineStyle()
    );
    onChange(EditorState.push(editorState, contentState, 'insert-characters'));
  };

  render() {
    return (
        <div className="rdw-block-wrapper">
        <div className="rdw-option-wrapper" onClick={this.addCitation}>
          <Glyphicon glyph={"user"}/>
        </div>
        </div>
    );
  }
}

CitationButton.propTypes = {
  onChange: PropTypes.func,
  editorState: PropTypes.object,
};

export default CitationButton;