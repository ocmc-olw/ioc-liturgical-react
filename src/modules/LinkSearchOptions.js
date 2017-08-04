import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from './ReactSelector'
import FontAwesome from 'react-fontawesome';

class LinkSearchOptions extends React.Component {

  constructor(props) {
    super(props);

    let initialType = "REFERS_TO_BIBLICAL_TEXT";
    this.state = {
      selectedType: initialType
      , selectedLibrary: "*"
      , selectedProperty: "*"
      , selectedMatcher: "c"
      , value: ""
      , selectedTagOperator: "any"
      , selectedTags: []
      , tagData: []
      , dropDownLibraries: {
        msg: this.props.labels.domainIs
        , source: this.props.libraries[initialType]
        , initialValue: "*"
      }
      , dropDownProperties: {
        msg: this.props.labels.domainIs
        , source: this.props.properties[initialType]
        , initialValue: "*"
      }
    };
    this.handleDocTypeChange = this.handleDocTypeChange.bind(this);
    this.handleDomainChange = this.handleDomainChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleMatcherChange = this.handleMatcherChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagsSelection = this.handleTagsSelection.bind(this);
    this.handleTagOperatorChange = this.handleTagOperatorChange.bind(this);
  }

  PropTypesWillMount = () => {
  }

  PropTypesWillReceiveProps = (nextProps) => {
    this.setState({
    });
  }

  handleDocTypeChange = (selection) => {
    let type = selection["value"];
    this.setState({
      selectedType: type
          , dropDownLibraries: {
            msg: this.props.labels.domainIs
            , source: this.props.libraries[type]
            , initialValue: "*"
          }
          , dropDownProperties: {
        msg: this.props.labels.domainIs
        , source: this.props.properties[type]
        , initialValue: "*"
      }
    });
  };

  handlePropertyChange = (item) => {
    this.setState({selectedProperty: item.value});
  }

  handleMatcherChange = (item) => {
    this.setState({selectedMatcher: item.value});
  }

  handleValueChange = (event) => {
    this.setState({value: event.target.value});
  }

  handleTagsSelection = (selection) => {
    console.log("handleTagsSelection");
    console.log(selection);
    let tags = selection.map(function(a) {return a.value;});
    console.log(tags);

    this.setState({
          selectedTags: tags
        }
    );
  }

  handleTagOperatorChange = (selection) => {
    console.log(selection["value"]);
    this.setState({
          selectedTagOperator: selection["value"]
        }
    );
  }

  handleSubmit = (event) => {
    this.props.handleSubmit(
        this.state.selectedType
        , this.state.selectedLibrary
        , this.state.selectedProperty
        , this.state.selectedMatcher
        , this.state.value
        , this.state.selectedTagOperator
        , this.state.selectedTags
    );
    event.preventDefault();
  }

  handleDomainChange = (selection) => {
    this.setState(
        {
          selectedLibrary: selection["value"]}
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
                    title={this.props.labels.domainIs}
                    initialValue={this.state.selectedLibrary}
                    resources={this.props.libraries[this.state.selectedType]}
                    changeHandler={this.handleDomainChange}
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
                initialValue=""
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

LinkSearchOptions.propTypes = {
  types: PropTypes.array.isRequired
  , libraries: PropTypes.object.isRequired
  , properties: PropTypes.object.isRequired
  , matchers: PropTypes.array.isRequired
  , tags: PropTypes.object.isRequired
  , tagOperators: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default LinkSearchOptions;