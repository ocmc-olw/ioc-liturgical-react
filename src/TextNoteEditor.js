import React from 'react';
import PropTypes from 'prop-types';
import tinymce from 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/wordcount';
import 'tinymce/plugins/table';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';

class TextNodeEditor extends React.Component {
  constructor(props) {
    super(props);
    let languageCode = props.session.languageCode;
    this.state = {
      labels: { //
        thisClass: Labels.getViewReferencesLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , editor: null
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    tinymce.init({
      selector: `#${this.props.id}`,
      plugins: 'wordcount table',
      setup: editor => {
        this.setState({ editor });
        editor.on('keyup change', () => {
          const content = editor.getContent();
          this.props.onEditorChange(content);
        });
      }
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      let languageCode = nextProps.session.languageCode;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getViewReferencesLabels(languageCode)
            , buttons: Labels.getButtonLabels(languageCode)
            , messages: Labels.getMessageLabels(languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
          }
          , message: Labels.getMessageLabels(languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  componentWillUnmount() {
    tinymce.remove(this.state.editor);
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if neededd
  }

  handleSave = (e) => {
    console.log('Content was updated:', e.target.getContent());
  }

  render() {
    return (
        <div className="App-New-Component-Template">
          <form onSubmit={this.handleSave}>
            <textarea id={this.props.id}/>
          </form>
        </div>
    )
  }
}

TextNodeEditor.propTypes = {
  session: PropTypes.object.isRequired
  , onEditorChange: PropTypes.func.isRequired
};

// set default values for props here
TextNodeEditor.defaultProps = {
  id: "tinymceeditor"
};

export default TextNodeEditor;
