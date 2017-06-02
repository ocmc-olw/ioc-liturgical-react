import React from 'react';
import {
  Button
  , ControlLabel
  , FormControl
  , FormGroup
  , Well
} from 'react-bootstrap';

import ResourceSelector from '../modules/ReactSelector';

class TreeNodeBuilder extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.getDependencyDropdown = this.getDependencyDropdown.bind(this);
    this.getLabelDropdown = this.getLabelDropdown.bind(this);
    this.getPartOfSpeechDropdown = this.getPartOfSpeechDropdown.bind(this);
    this.getPersonDropdown = this.getPersonDropdown.bind(this);
    this.getNumberDropdown = this.getNumberDropdown.bind(this);
    this.getCaseDropdown = this.getCaseDropdown.bind(this);
    this.getTenseDropdown = this.getTenseDropdown.bind(this);
    this.getVoiceDropdown = this.getVoiceDropdown.bind(this);
    this.getMoodDropdown =this.getMoodDropdown.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
        }
    )
  }

  getDependencyDropdown = () => {
    return (
        <div></div>
    );
  }

  getLabelDropdown =  () => {
    return (
        <div></div>
    );
  }

  getPartOfSpeechDropdown =  () => {
    return (
        <div></div>
    );
  }

  getPersonDropdown =  () => {
    return (
        <div></div>
    );
  }

  getNumberDropdown =  () => {
    return (
        <div></div>
    );
  }

  getCaseDropdown =  () => {
    return (
        <div></div>
    );
  }

  getTenseDropdown =  () => {
    return (
        <div></div>
    );
  }

  getVoiceDropdown =  () => {
    return (
        <div></div>
    );
  }

  getMoodDropdown =  () => {
    return (
        <div></div>
    );
  }

  render() {
        return (
            <form>
              <FormGroup
                  controlId="AppTreeNodeBuilder"
              >
                <div className="container">
                  <div>
                    <div className="row">
                      <div className="col-sm-12 col-md-12 col-lg-12">
                        <ResourceSelector
                            title={this.props.labels.findWhereTypeIs}
                            initialValue={this.props.docType}
                            resources={this.props.docTypes}
                            changeHandler={this.handleDocTypeChange}
                            multiSelect={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <span>{this.props.index}</span>
                <FormControl
                    type="text"
                    value={this.props.lemma}
                    placeholder="Enter lemma"
                />
              </FormGroup>
            </form>
        )
  }
}

TreeNodeBuilder.propTypes = {
    languageCode: React.PropTypes.string.isRequired
    , index: React.PropTypes.string.isRequired
    , tokenSize: React.PropTypes.number.isRequired
    , token: React.PropTypes.string.isRequired
    , lemma: React.PropTypes.string
    , gloss: React.PropTypes.string
    , grammar: React.PropTypes.string.isRequired
    , callBack: React.PropTypes.func.isRequired
};

TreeNodeBuilder.defaultProps = {
};

export default TreeNodeBuilder;
