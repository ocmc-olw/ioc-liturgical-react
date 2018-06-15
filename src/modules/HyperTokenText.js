import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import MessageIcons from '../helpers/MessageIcons';
import Spinner from '../helpers/Spinner';

import {ControlLabel, Well} from 'react-bootstrap';

class HyperTokenText extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.renderTokens = this.renderTokens.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.getRuby = this.getRuby.bind(this);
    this.getTokenWordSpan = this.getTokenWordSpan.bind(this);

  }

  componentWillMount = () => {
  };

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
  };

  setTheState = (props, currentState) => {
    let selectedToken = get(currentState, "selectedToken", -1);
    if (this.props.selectedToken !== props.selectedToken) {
      selectedToken = props.selectedToken;
    }
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;
    return (
        {
          labels: {
            thisClass: labels[labelTopics.HyperTokenText]
            , messages: labels[labelTopics.messages]
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: labels[labelTopics.messages].initial
          , selectedToken: selectedToken
          , lastPropToken: get(props,"selectedToken", -1)
        }
    )
  };

  handleClick = (event) => {
    this.setState({
      selectedToken: parseInt(event.currentTarget.id)
    });
    this.props.onClick(
        event.currentTarget.id
        , event.currentTarget.textContent.trim()
    );
  };

  getTokenWordSpan = (token, index) => {
    if (this.state.selectedToken === index) {
      return (
          <rb><span className="App-HyperToken-Word-Selected" id={index} onClick={this.handleClick}>{token}&nbsp;</span>
          </rb>
      )
    } else {
      return (
          <rb><span className="App-HyperToken-Word" id={index} onClick={this.handleClick}>{token}&nbsp;</span></rb>
      )
    }
  };
  getRuby = (token, index) => {
    return (
        <ruby className="App App-HyperToken" key={index}>
          {this.getTokenWordSpan(token, index)}
          <rt><span className="App-HyperToken-Index">{index+1}</span></rt>
        </ruby>
    )
  };

  renderTokens = () => {
    if (this.props.tokens && this.props.tokens.length > 0) {
      let result = [];
      let size = this.props.tokens.length;
      for (let index=0; index < size; index++ ) {
        result.push(this.getRuby(this.props.tokens[index], index))
      }
      return result;
    } else {
      return <div><Spinner message={this.state.labels.messages.retrieving}/></div>;
    }
  };

  render() {
        return (
            <div className="App App-HyperTokenText-Container">
              <div><ControlLabel>{this.state.labels.thisClass.instructions}</ControlLabel></div>
                <Well>
                  <div className="App App-HyperTokenText-Text">
                    {this.renderTokens()}
                  </div>
                </Well>
            </div>
        )
  }
}

HyperTokenText.propTypes = {
  session: PropTypes.object.isRequired
  , tokens: PropTypes.array.isRequired
  , onClick: PropTypes.func.isRequired
  , selectedToken: PropTypes.number
};

HyperTokenText.defaultProps = {
};

export default HyperTokenText;
