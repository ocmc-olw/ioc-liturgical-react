import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from './ReactSelector'
import FontAwesome from 'react-fontawesome';
import { Button } from 'react-bootstrap';

class NoteSearchOptions extends React.Component {

  constructor(props) {
    super(props);

    let initialType = "Human";
    if (this.props.initialType) {
      initialType = this.props.initialType;
    }

    this.state = {
      selectedType: initialType
      , selectedProperty: "value"
      , selectedMatcher: "c"
      , value: ""
      , selectedTagOperator: "any"
      , selectedTags: ""
      , tagData: []
      , dropDownProperties: {
        msg: this.props.labels.domainIs
        , source: this.props.properties[initialType]
        , initialValue: "*"
      }
    };
    this.handleDocTypeChange = this.handleDocTypeChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleMatcherChange = this.handleMatcherChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagsSelection = this.handleTagsSelection.bind(this);
    this.handleTagOperatorChange = this.handleTagOperatorChange.bind(this);
    this.isDisabled = this.isDisabled.bind(this);
  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
  };

  handleDocTypeChange = (selection) => {
    let type = selection["value"];
    this.setState({
      selectedType: type
          , dropDownProperties: {
        msg: this.props.labels.domainIs
        , source: this.props.properties[type]
        , initialValue: "*"
      }
    });
  };

  handlePropertyChange = (item) => {
    let newSelectedValue = this.state.value;

    if (item.value.startsWith("*")) {
      newSelectedValue = "";
    }
    this.setState({
      selectedProperty: item.value
      , value: newSelectedValue
    }
    );
  };

  handleMatcherChange = (item) => {
    this.setState({selectedMatcher: item.value});
  };

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  };

  handleTagsSelection = (selection) => {
    let tags = selection.map(function(a) {return a.value;});

    this.setState({
          selectedTags: tags.toString()
        }
    );
  };

  handleTagOperatorChange = (selection) => {
    this.setState({
          selectedTagOperator: selection["value"]
        }
    );
  };

  handleSubmit = (event) => {
    this.props.handleSubmit(
        this.state.selectedType
        , this.state.selectedProperty
        , this.state.selectedMatcher
        , this.state.value
        , this.state.selectedTagOperator
        , this.state.selectedTags
    );
    event.preventDefault();
  };

  isDisabled = () => {
    // For now, we are not disabling the search for any reason.
    // The code below is stubbed out for the event that we
    // start disabling.
    let disableButton = false;
    if (this.state.value && this.state.value.length > 0) {
      disableButton = false;
    } else {
      switch (this.state.selectedType) {
        case "*": {
          break;
        }
        default: {
          disableButton = false;
          break;
        }
      }
    }
    return disableButton;
  };

  render() {
    return (
        <div className="container App-search-options-container">
          <div>
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.findWhereTypeIs}
                    initialValue={this.state.selectedType}
                    resources={this.props.types}
                    changeHandler={this.handleDocTypeChange}
                    multiSelect={false}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <ResourceSelector
                  title={this.props.labels.propertyIs}
                  initialValue={this.state.selectedProperty}
                  resources={this.props.properties[this.state.selectedType]}
                  changeHandler={this.handlePropertyChange}
                  multiSelect={false}
              />
              <form onSubmit={this.handleSubmit}>
                <div className="control-label">{this.props.labels.propertyTextIs}</div>
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleValueChange}
                    className="App-search-text-input"
                    name="search"/>
              </form>
              <ResourceSelector
                  title={this.props.labels.matcherIs}
                  initialValue={this.state.selectedMatcher}
                  resources={this.props.matchers}
                  changeHandler={this.handleMatcherChange}
                  multiSelect={false}
              />
              { this.state.selectedType !== "*" &&
                  <div>
                <ResourceSelector
                    title={this.props.labels.has}
                    initialValue="any"
                    resources={this.props.tagOperators}
                    changeHandler={this.handleTagOperatorChange}
                    multiSelect={false}
                />
                <ResourceSelector
                  title={this.props.labels.tags}
                  initialValue={this.state.selectedTags}
                  resources={this.props.tags[this.state.selectedType]}
                  changeHandler={this.handleTagsSelection}
                  multiSelect={true}
                />
                  </div>
              }
              <div className="control-label">{this.props.labels.clickTheButton}</div>
              <Button
                  bsStyle="primary"
                  bsSize="xsmall"
                  type="submit"
                  disabled={this.isDisabled()}
                  onClick={this.handleSubmit}
              >
                <FontAwesome className="Button-Select-FontAwesome" name={"search"}/>
                {this.props.labels.submit}
              </Button>
            </div>
          </div>
        </div>
    );
  }
}

NoteSearchOptions.propTypes = {
  types: PropTypes.array.isRequired
  , initialType: PropTypes.string.isRequired
  , properties: PropTypes.object.isRequired
  , matchers: PropTypes.array.isRequired
  , tags: PropTypes.object.isRequired
  , tagOperators: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default NoteSearchOptions;