import React from 'react';
import PropTypes from 'prop-types';
import MessageIcons from '../helpers/MessageIcons';
import Form from "react-jsonschema-form";
import { Button} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome';
import axios from 'axios';
import IdManager from "../helpers/IdManager";

/**
 * This component provides a schema based form editor
 */
class NewEntryForm extends React.Component {
  constructor(props) {
    super(props);

    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.NewEntryForm]
        , button: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
        , search: labels[labelTopics.search]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , formData: this.props.formData
    };

    this.handleStateChange = this.handleStateChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
    let labels = nextProps.session.labels;
    let labelTopics = nextProps.session.labelTopics;
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: labels[labelTopics.NewEntryForm]
            , button: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
            , search: labels[labelTopics.search]
          }
          , message: labels[labelTopics.messages].initial
          , formData: this.props.formData
      }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };

  onChange = ({formData}) => {
    this.setState({
      message: this.state.labels.search.initial
      , messageIcon: this.state.messageIcons.info
      , formData: formData
    });
  };


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
        })
        .catch( (error) => {
          let message = "";
          let messageIcon = this.state.messageIcons.error;
          if (error) {
            if (error.response) {
              message = error.response.statusText;
            } else {
              message = JSON.stringify(error)
            }
          } else {
            message = "unknown error";
          }
          this.setState( { data: message, message: message, messageIcon: messageIcon });
        }
        );
  };

  render() {
    return (
        <div className="App-New-Component-Template">
          <Form schema={this.props.schema}
                uiSchema={this.props.uiSchema}
                formData={this.state.formData}
                onSubmit={this.onSubmit}
                onChange={this.onChange}
          >
            <div>
              <Button
                  bsStyle="primary"
                  type="submit"
              >{this.state.labels.button.submit}</Button>
              <span className="App App-message"><FontAwesome
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
