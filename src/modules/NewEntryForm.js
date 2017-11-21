import React from 'react';
import PropTypes from 'prop-types';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import Form from "react-jsonschema-form";
import { Button} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';

/**
 * This component provides a schema based form editor
 */
class NewEntryForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      labels: {
        thisClass: Labels.getNewEntryFormLabels(this.props.session.languageCode)
        , button: Labels.getButtonLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , search: Labels.getSearchLabels(this.props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , formData: this.props.formData
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getNewEntryFormLabels(nextProps.session.languageCode)
            , button: Labels.getButtonLabels(this.props.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
            , search: Labels.getSearchLabels(this.props.session.languageCode)
          }
          , message: Labels.getMessageLabels(props.session.languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }

  onSubmit = ({formData}) => {
    this.setState({
      message: this.state.labels.search.creating
      , messageIcon: this.state.messageIcons.info
    });

    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = this.props.session.restServer
        + this.props.path
    ;
    axios.post(
        path
        , formData
        , config
    )
        .then(response => {
          this.setState({
            message: this.state.labels.search.created,
            formData: formData
          });
          if (this.props.onSubmit) {
            this.props.onSubmit(formData);
          }
        })
        .catch( (error) => {
          var message = Labels.getHttpMessage(
              this.props.session.languageCode
              , error.response.status
              , error.response.statusText
          );
          var messageIcon = this.state.messageIcons.error;
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        });
  }

  render() {
    return (
        <div className="App-New-Component-Template">
          <Form schema={this.props.schema}
                uiSchema={this.props.uiSchema}
                formData={this.state.formData}
                onSubmit={this.onSubmit}
          >
            <div>
              <Button
                  bsStyle="primary"
                  type="submit"
              >{this.state.labels.button.submit}</Button>
              <span className="App-message"><FontAwesome
                  name={this.state.messageIcon}/>
                {this.state.message}
                    </span>
            </div>
          </Form>
        </div>
    )
  }
}

NewEntryForm.propTypes = {
  session: PropTypes.object.isRequired
  , path: PropTypes.string.isRequired
  , schema: PropTypes.object.isRequired
  , uiSchema: PropTypes.object.isRequired
  , formData: PropTypes.object.isRequired
  , onSubmit: PropTypes.func
};

// set default values for props here
NewEntryForm.defaultProps = {
  languageCode: "en"
};

export default NewEntryForm;
