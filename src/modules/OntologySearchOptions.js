import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from './ReactSelector'
import FontAwesome from 'react-fontawesome';

class OntologySearchOptions extends React.Component {

  constructor(props) {
    super(props);

    let initialType = "Human";
    if (this.props.initialType) {
      initialType = this.props.initialType;
    }

    this.state = {
      selectedType: initialType
      , selectedGenericType: "*"
      , selectedProperty: "*"
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
    this.handleGenericTypeChange = this.handleGenericTypeChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleMatcherChange = this.handleMatcherChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagsSelection = this.handleTagsSelection.bind(this);
    this.handleTagOperatorChange = this.handleTagOperatorChange.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {

    let initialType = "Human";
    if (nextProps.initialType) {
      initialType = nextProps.initialType;
    }

    this.state = {
      selectedType: initialType
      , selectedGenericType: "*"
      , selectedProperty: "*"
      , selectedMatcher: "c"
      , value: ""
      , selectedTagOperator: "any"
      , selectedTags: ""
      , tagData: []
      , dropDownProperties: {
        msg: nextProps.labels.domainIs
        , source: nextProps.properties[initialType]
        , initialValue: "*"
      }
    };
  }

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
  }

  handleMatcherChange = (item) => {
    this.setState({selectedMatcher: item.value});
  }

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleTagsSelection = (selection) => {
    let tags = selection.map(function(a) {return a.value;});

    this.setState({
          selectedTags: tags
        }
    );
  }

  handleTagOperatorChange = (selection) => {
    this.setState({
          selectedTagOperator: selection["value"]
        }
    );
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(
        this.state.selectedType
        , this.state.selectedGenericType
        , this.state.selectedProperty
        , this.state.selectedMatcher
        , this.state.value
        , this.state.selectedTagOperator
        , this.state.selectedTags
    );
    event.preventDefault();
  }

  handleGenericTypeChange = (selection) => {
    this.setState(
        {
          selectedGenericType: selection["value"]}
    );
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
            <div className="row">
              <div className="col-sm-12 col-md-12 col-lg-12">
                <ResourceSelector
                    title={this.props.labels.findWhereGenericTypeIs}
                    initialValue={this.state.selectedGenericType}
                    resources={this.props.types}
                    changeHandler={this.handleGenericTypeChange}
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
                <span className="App-text-search-icon" >
                    <FontAwesome
                        type="submit"
                        onClick={this.handleSubmit}
                        name={"search"}/>
                </span>
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
            </div>
          </div>
        </div>
    );
  }
}

OntologySearchOptions.propTypes = {
  types: PropTypes.array.isRequired
  , initialType: PropTypes.string.isRequired
  , properties: PropTypes.object.isRequired
  , matchers: PropTypes.array.isRequired
  , tags: PropTypes.object.isRequired
  , tagOperators: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default OntologySearchOptions;