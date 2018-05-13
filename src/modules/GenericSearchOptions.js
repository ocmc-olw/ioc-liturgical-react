import React from 'react';
import PropTypes from 'prop-types';
import ResourceSelector from './ReactSelector'
import FontAwesome from 'react-fontawesome';
import {
  Button
  , Col
  , ControlLabel
  , FormControl
  , Grid
  , Row
  , Well
} from 'react-bootstrap';

import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import {get} from "lodash";


class GenericSearchOptions extends React.Component {

  constructor(props) {
    super(props);

    let initialType = "*";
    if (this.props.initialType) {
      initialType = this.props.initialType;
    }

    let languageCode = props.session.languageCode;

    this.state = {
      labels: {
        thisClass: Labels.getSearchGenericLabels(languageCode)
        , buttons: Labels.getButtonLabels(languageCode)
        , messages: Labels.getMessageLabels(languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(languageCode).initial
      , selectedTypeLabel: ""
      , selectedType: initialType
      , selectedLibrary: "*"
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
    this.handleLibraryChange = this.handleLibraryChange.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.handleMatcherChange = this.handleMatcherChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTagsSelection = this.handleTagsSelection.bind(this);
    this.handleTagOperatorChange = this.handleTagOperatorChange.bind(this);
    this.isDisabled = this.isDisabled.bind(this);

    this.getLibraryRow = this.getLibraryRow.bind(this);
    this.getTypeRow = this.getTypeRow.bind(this);
    this.getPropertyRow = this.getPropertyRow.bind(this);
    this.getMatchLocationRow = this.getMatchLocationRow.bind(this);
    this.getHasTagRow = this.getHasTagRow.bind(this);
    this.getTagRow = this.getTagRow.bind(this);
    this.getTextRow = this.getTextRow.bind(this);
    this.getButtonRow = this.getButtonRow.bind(this);

  };

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    let languageCode = nextProps.session.languageCode;
    this.setState((prevState, props) => {
      return {
        labels: {
          thisClass: Labels.getSearchGenericLabels(languageCode)
          , buttons: Labels.getButtonLabels(languageCode)
          , messages: Labels.getMessageLabels(languageCode)
          , resultsTableLabels: Labels.getResultsTableLabels(languageCode)
        }
        , message: Labels.getMessageLabels(languageCode).initial
      }
    });
  };

  handleDocTypeChange = (selection) => {
    let type = selection["value"];
    let typeLabel = selection["label"];
    this.setState({
      selectedTypeLabel: typeLabel
      , selectedType: type
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
        , this.state.selectedTypeLabel
        , this.state.selectedLibrary
        , this.state.selectedProperty
        , this.state.selectedMatcher
        , this.state.value
        , this.state.selectedTagOperator
        , this.state.selectedTags
    );
    event.preventDefault();
  };

  isDisabled = () => {
    let disableButton = false;
    switch (this.state.selectedType) {
      case "*": {
        disableButton = true;
        break;
      }
      default: {
        disableButton = false;
        break;
      }
    }
    return disableButton;
  };

  getTypeRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Type-Selector"}>
              <ResourceSelector
                  title={this.props.labels.findWhereTypeIs}
                  initialValue={this.state.selectedType}
                  resources={this.props.session.dropdowns.schemaEditorDropdown}
                  changeHandler={this.handleDocTypeChange}
                  multiSelect={false}
              />
            </div>
          </Col>
        </Row>
    );
  };

  getPropertyRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Type-Selector"}>
              <ResourceSelector
                  title={this.props.labels.propertyIs}
                  initialValue={this.state.selectedProperty}
                  resources={this.props.properties}
                  changeHandler={this.handlePropertyChange}
                  multiSelect={false}
              />
            </div>
          </Col>
        </Row>
    );
  };

  getTextRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <ControlLabel>{this.props.labels.propertyTextIs}</ControlLabel>
            <FormControl
                id={"fxBibliographySearchText"}
                className={"App App-search-text-input"}
                type="text"
                value={this.state.value}
                placeholder={this.props.labels.textPrompt}
                onChange={this.handleValueChange}
            />
          </Col>
        </Row>
    );
  };

  getMatchLocationRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Type-Selector"}>
              <ResourceSelector
                  title={this.props.labels.matcherIs}
                  initialValue={this.state.selectedMatcher}
                  resources={this.props.matchers}
                  changeHandler={this.handleMatcherChange}
                  multiSelect={false}
              />
            </div>
          </Col>
        </Row>
    );
  };

  getHasTagRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Tag-Selector"}>
              <ResourceSelector
                  title={this.props.labels.has}
                  initialValue={this.state.selectedTagOperator}
                  resources={this.props.tagOperators}
                  changeHandler={this.handleTagOperatorChange}
                  multiSelect={false}
              />
            </div>
          </Col>
        </Row>
    );
  };

  getTagRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Tag-Selector"}>
              <ResourceSelector
                  title={this.props.labels.tags}
                  initialValue={this.state.selectedTags}
                  resources={this.props.tags}
                  changeHandler={this.handleTagsSelection}
                  multiSelect={true}
              />
            </div>
          </Col>
        </Row>
    );
  };

  handleLibraryChange = (selection) => {
    this.setState({selectedLibrary: selection["value"]});
  };

  getLibraryRow = () => {
    if (this.props.session && this.props.session.userInfo && this.props.session.userInfo.domains) {
      if (this.props.session.userInfo.domains.reader) {
        let resources = this.props.session.userInfo.domains.reader;
        return (
            <Row className="show-grid App-Bibliography-Search-Options-Row">
              <Col xs={12} md={12}>
                <div className={"App App-Bibliography-Library-Selector"}>
                  <ResourceSelector
                      title={this.props.labels.domainIs}
                      initialValue={this.state.selectedLibrary}
                      resources={resources}
                      changeHandler={this.handleLibraryChange}
                      multiSelect={false}
                  />
                </div>
              </Col>
            </Row>
        );
      }
    }
  };

  getButtonRow = () => {
    return (
        <Row className="show-grid App-Bibliography-Search-Options-Row">
          <Col xs={12} md={12}>
            <div className={"App App-Bibliography-Selector-Button"}>
              <ControlLabel>{this.props.labels.clickTheButton}</ControlLabel>
              <div>
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
          </Col>
        </Row>
    );
  };
  render() {
    return (
        <div className="container App-search-options-container">
          <Well>
            <Grid>
              {this.getTypeRow()}
              {this.getLibraryRow()}
              {this.getPropertyRow()}
              {this.getTextRow()}
              {this.getMatchLocationRow()}
              {this.getHasTagRow()}
              {this.getTagRow()}
              {this.getButtonRow()}
            </Grid>
          </Well>
        </div>
    );
  }
}

GenericSearchOptions.propTypes = {
  session: PropTypes.object.isRequired
  , initialType: PropTypes.string.isRequired
  , properties: PropTypes.array.isRequired
  , matchers: PropTypes.array.isRequired
  , tags: PropTypes.array.isRequired
  , tagOperators: PropTypes.array.isRequired
  , handleSubmit: PropTypes.func.isRequired
  , labels: PropTypes.object.isRequired
};

export default GenericSearchOptions;