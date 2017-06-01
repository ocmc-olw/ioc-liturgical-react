import React from 'react';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
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
    this.props.onClick(event.currentTarget.textContent);
  }

  renderTokens = (tokens) => {
    if (tokens.length > 0) {
      return tokens.map((token, index) => (
          <span className="App App-HyperToken" key={index} onClick={this.handleClick}>{token} </span>
      ));
    } else {
      return [];
    }
  }


  render() {
        return (
            <div className="App App-HyperTokenText-Container">
                <div>{this.state.labels.thisClass.instructions}</div>
                <Well>
                  <div className="App App-HyperTokenText-Text">
                    {this.renderTokens(this.props.tokens)}
                  </div>
                </Well>
            </div>
        )
  }
}

HyperTokenText.propTypes = {
  languageCode: React.PropTypes.string.isRequired
  , tokens: React.PropTypes.array.isRequired
  , id: React.PropTypes.string.isRequired
  , onClick: React.PropTypes.func.isRequired
};

HyperTokenText.defaultProps = {
};

export default HyperTokenText;
