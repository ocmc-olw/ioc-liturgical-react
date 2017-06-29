import React from 'react';
import Labels from '../Labels';
import MessageIcons from '../helpers/MessageIcons';
import server from '../helpers/Server';
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import VirtualizedSelect from 'react-virtualized-select'
import ReactSelector from './ReactSelector';

/**
 * Gets a list of topics from the web service and displays
 * them as a dropdown.  Returns the value the user selects.
 */
class TopicsSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.setTheState(props, this.state);
    this.handleFetchCallback = this.handleFetchCallback.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
  }

  componentWillMount = () => {
    this.fetchData(this.props.library);
  }

  componentWillReceiveProps = (nextProps) => {
    let nextLibrary = nextProps.library;
    if (this.state.library && this.state.library !== nextLibrary) {
      this.fetchData(nextLibrary);
    }
    this.state = this.setTheState(nextProps, this.state);
  }

  setTheState = (props, currentState) => {
    let dataFetched = false;
    let data = undefined;
    let selectedItem = "";
    if (currentState) {
      if (currentState.dataFetched) {
        dataFetched = currentState.dataFetched;
      }
      if (currentState.data) {
        data = currentState.data;
      }
      if (currentState.selectedItem && currentState.selectedItem.length > 0) {
        selectedItem = currentState.selectedItem;
      }
    }
      return (
          {
            labels: {
              thisClass: Labels.getTopicsSelectorLabels(this.props.languageCode)
              , messages: Labels.getMessageLabels(this.props.languageCode)
            }
            , messageIcons: MessageIcons.getMessageIcons()
            , messageIcon: MessageIcons.getMessageIcons().info
            , message: Labels.getMessageLabels(this.props.languageCode).initial
            , selectedItem: selectedItem
            , dataFetched: dataFetched
            , data: data
          }
      )
  }

  fetchData = (library) => {
      server.getTopics(
          this.props.restServer
          , this.props.username
          , this.props.password
          , this.handleFetchCallback
      );
  }

  handleFetchCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        dataFetched: true
        , data: restCallResult.data.values[0].items
      });
    }
  }

  handleSelection = (selection) => {
    this.setState({
      selectedItem: selection["value"]
    });
    this.props.callBack(selection["value"]);
  }

  render() {
        return (
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12">
            {this.state.dataFetched &&
                <VirtualizedSelect
                    options={this.state.data}
                    onChange={this.handleSelection}
                    value={this.state.selectedItem}
                />
            }
          </div>
        </div>
  )
  }
}

TopicsSelector.propTypes = {
  restServer: React.PropTypes.string.isRequired
  , username: React.PropTypes.string.isRequired
  , password: React.PropTypes.string.isRequired
  ,  languageCode: React.PropTypes.string.isRequired
  , library: React.PropTypes.string.isRequired
  , callBack: React.PropTypes.func.isRequired
};

TopicsSelector.defaultProps = {
};

export default TopicsSelector;
