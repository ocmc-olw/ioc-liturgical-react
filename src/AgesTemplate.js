import React from 'react';
import Labels from './Labels';
import server from './helpers/Server';
import MessageIcons from './helpers/MessageIcons';
import FontAwesome from 'react-fontawesome';

/**
 * 
 */
class AgesTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);
    this.fetchData = this.fetchData.bind(this);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.edit = this.edit.bind(this);
    this.getValue = this.getValue.bind(this);
    this.renderHtml = this.renderHtml.bind(this);
  }

  componentWillMount = () => {
  }

  componentWillReceiveProps = (nextProps) => {
    this.state = this.setTheState(nextProps, this.state);
    this.fetchData();
  }

  setTheState = (props, currentState) => {
      return (
          {
            labels: {
              thisClass: Labels.getAgesTemplateLabels(this.props.languageCode)
              , messages: Labels.getMessageLabels(this.props.languageCode)
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: Labels.getMessageLabels(this.props.languageCode).initial
            , libLeft: ""
            , libRight: ""
          }
      )
  }

  fetchData = () => {
    let parms =
        "u=" + encodeURIComponent(this.props.url)
    ;

    this.setState({
          message: this.state.labels.messages.retrieving
        },
        server.getAgesTemplate(
            this.props.restServer
            , this.props.username
            , this.props.password
            , parms
            , this.handleFetchCallback
        )
    );

  }

  handleFetchCallback = (restCallResult) => {
    if (restCallResult) {
      let data = restCallResult.data.values[0];
      console.log(data);
      let values = data.values;
      let topicKeys = data.topicKeys;
      let topElement = data.topElement;
      this.setState({
        dataFetched: true
        , values: values
        , topicKeys: topicKeys
        , topElement: topElement
      });
    }
  }

  edit = (id) => {
      alert(id);
  }

  getValue = (requestedDomain, topicKey, originalDomain) => {
    console.log(requestedDomain);
    console.log(topicKey);
    console.log(originalDomain);
    return { __html: this.state.values[originalDomain+"~"+topicKey]};
  }

  renderHtml = (element) => {
    let props = {};
    let children = [];

    if (element.key) {
      props["key"] = element.key;
    }
    if (element.className) {
      props["className"] = element.className;
    }
    if (element.dataKey) {
      props["data-key"] = element.dataKey;
//      props["onDoubleClick"] = function () {return alert(element.dataKey);};
      props["onDoubleClick"] = this.edit.bind(null,element.dataKey);
      children.push(this.state.values[element.dataKey]);
    }
    if (element.topicKey) {
      props["data-topicKey"] = element.topicKey;
    }

    if (element.children) {
      for (let i=0; i < element.children.length; i++) {
        children.push(this.renderHtml(element.children[i]));
      }
    }
      return (
          React.createElement(
              element.tag
              , props
              , children
          )
      );
  }

  //
// <span
// className="kvp"
// data-key="gr_gr_cog~eu.baptism~euBAP.Key0901.text"
// onDoubleClick={this.edit(this.state.libLeft,'eu.baptism~euBAP.Key0901.text')}>
// {this.getValue(this.state.libLeft,'eu.baptism~euBAP.Key0901.text','gr_gr_cog')}
//           </span>

  render() {
        return (
        <div>
          {this.state.dataFetched &&
          this.renderHtml(this.state.topElement)
          }
        </div>
        )
  }
}

AgesTemplate.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  , languageCode: React.PropTypes.string.isRequired
  , url: React.PropTypes.string.isRequired
};

AgesTemplate.defaultProps = {
};

export default AgesTemplate;
