import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import server from './helpers/Server';
import {ControlLabel, DropdownButton, FormGroup, HelpBlock, MenuItem} from 'react-bootstrap';
import DatePicker from 'react-bootstrap-date-picker'
import Form from 'react-jsonschema-form';
import ResponseParser from './helpers/ResponseParser'

class LiturgicalDayProperties extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedType: "g"
      , labels: props.session.labels[props.session.labelTopics.ldp]
    };

    this.handleChange = this.handleChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState(
        {
          labels: nextProps.session.labels[nextProps.session.labelTopics.ldp]
        }
    );
  };

  componentWillMount = () => {
    var value = new Date().toISOString();
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
    });
  };

  handleChange = (value, formattedValue) => {
    this.setState({
      value: value, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      formattedValue: formattedValue // Formatted String, ex: "11/19/2016"
    }, this.fetchData(value));
  };

  onSelect = (index) => {
    this.setState({
      selectedType: index
    })
  };

  fetchData(date) {
    var config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let parms =
            "?t=" + encodeURIComponent(this.state.selectedType)
            + "&d=" + encodeURIComponent(date)
        ;
    axios.get(
        this.props.session.restServer
        + server.getWsServerLiturgicalDayPropertiesApi()
        + parms
        , config
    )
        .then(response => {
          ResponseParser.setItem(response.data);
          this.setState( {
            item: ResponseParser.getItemObject()
          }
          );
        })
        .catch( (error) => {
          this.setState( { data: error.message });
          this.props.callback(error.message, "");
        });
  }

  render() {
        return (
            <div className="App-DateSelector">
              <h3 className="App-DateSelector-prompt">{this.props.formPrompt}</h3>
              <FormGroup>
                <ControlLabel>{this.state.labels.prompt}</ControlLabel>
                <p/>
                <DropdownButton
                    bsStyle="primary"
                    title={this.state.labels.calendar}
                    key={"a"}
                    id={`App-DateSelector-calendar-type`}
                    onSelect={this.onSelect}
                >
                  <MenuItem eventKey="j">{this.state.labels.julian}</MenuItem>
                  <MenuItem eventKey="g">{this.state.labels.gregorian}</MenuItem>
                </DropdownButton>
                <p/>
                <DatePicker
                    id="app-datepicker"
                    value={this.state.value}
                    onChange={this.handleChange}
                />
                <HelpBlock>Help</HelpBlock>
              </FormGroup>
              {this.state.item ?
                  <Form
                      schema={this.state.item.schema}
                      uiSchema={this.state.item.uiSchema}
                      formData={this.state.item.value}
                      onSubmit={this.onSubmit}>
                  </Form>
                  :
                  <div></div>
              }
            </div>
        )
  }
}

LiturgicalDayProperties.propTypes = {
  session: PropTypes.object.isRequired
  , callback: PropTypes.func.isRequired
};

LiturgicalDayProperties.defaultProps = {
};

export default LiturgicalDayProperties;
