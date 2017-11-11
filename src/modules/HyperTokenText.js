import React from 'react';
import PropTypes from 'prop-types';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import Spinner from '../helpers/Spinner';

import {ControlLabel, Well} from 'react-bootstrap';

class HyperTokenText extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, "");

    this.renderTokens = this.renderTokens.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps);
  }

  setTheState = (props) => {
    return (
        {
          labels: {
            thisClass: Labels.getHyperTokenTextLabels(this.props.languageCode)
            , messages: Labels.getMessageLabels(this.props.languageCode)
          }
          , messageIcons: MessageIcons.getMessageIcons()
          , messageIcon: MessageIcons.getMessageIcons().info
          , message: Labels.getMessageLabels(this.props.languageCode).initial
        }
    )
  }

  handleClick = (event) => {
    this.props.onClick(event.currentTarget.id, event.currentTarget.textContent.trim());
  }

  renderTokens = () => {

    if (this.props.tokens && this.props.tokens.length > 0) {
      return this.props.tokens.map((token, index) => (
          <ruby className="App App-HyperToken" key={index}>
            <rb><span className="App-HyperToken-Word" id={index} onClick={this.handleClick}>{token}&nbsp;</span></rb>
            <rt><span className="App-HyperToken-Index">{index+1}</span></rt>
          </ruby>
      ));
    } else {
      return <div><Spinner message={this.state.labels.messages.retrieving}/></div>;
    }
  }


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
  languageCode: PropTypes.string.isRequired
  , tokens: PropTypes.array.isRequired
  , onClick: PropTypes.func.isRequired
};

HyperTokenText.defaultProps = {
};

export default HyperTokenText;
