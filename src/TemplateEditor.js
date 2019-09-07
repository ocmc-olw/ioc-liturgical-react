import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {Col, ControlLabel, Button, Grid, Modal, Row, Well} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import SortableTree, {
  addNodeUnderParent
  , removeNodeAtPath
  , toggleExpandedForAll
} from "react-sortable-tree";
import Spinner from './helpers/Spinner';
import MessageIcons from './helpers/MessageIcons';
import ModalTemplateNodeEditor from './modules/ModalTemplateNodeEditor';
import Server from './helpers/Server';

/**
 * This class provides a visual, drag-and-drop interface for
 * users to create templates to generate liturgical books or services.
 * It is a web browser replacement for the Java application ALWB.
 *
 * Note: if you try to drag and drop a node and you see a thick blue
 * line appear and it won't let you drop where you would like to,
 * the issue is the value for maxDepth.  It needs to be increased.
 */
class TemplateEditor extends React.Component {
  constructor(props) {
    super(props);

    const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;
    let labels = props.session.labels;
    let labelTopics = props.session.labelTopics;

    this.state = {
      labels: {
        thisClass: labels[labelTopics.TemplateEditor]
        , buttons: labels[labelTopics.button]
        , messages: labels[labelTopics.messages]
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: labels[labelTopics.messages].initial
      , searchString: ''
      , searchFocusIndex: 0
      , searchFoundCount: null
      , treeData: props.treeData
      , idKey: "head"
      , showModalEditor: false
      , showModalReactSelector: false
      , selectorResource: []
      , selectorInitialValue: ""
      , modalTitle: ""
      , editingNode: undefined
      , editingPath: undefined
      , editingTreeIndex: undefined
      , selectedId: "" // from SearchText
      , selectedItem: "" // from ReactSelector
      , updating: false
    };

    this.handleStateChange = this.handleStateChange.bind(this);

    this.updateTreeData = this.updateTreeData.bind(this);

    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);

    this.getNodeEditor = this.getNodeEditor.bind(this);
    this.handleNodeEditorCallback = this.handleNodeEditorCallback.bind(this);

    this.getMessages = this.getMessages.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleSubmitCallback = this.handleSubmitCallback.bind(this);

  }

  componentWillMount = () => {
  };

  componentDidMount = () => {
    // make any initial function calls here...
  };

  componentWillReceiveProps = (nextProps) => {
      this.setState((prevState, props) => {
        let labels = nextProps.session.labels;
        let labelTopics = nextProps.session.labelTopics;

        return {
          labels: {
            thisClass: labels[labelTopics.TemplateEditor]
            , buttons: labels[labelTopics.button]
            , messages: labels[labelTopics.messages]
          }
          , message: labels[labelTopics.messages].initial
          , treeData: nextProps.treeData
          , updating: false
          , showModalEditor: false
          , showModalReactSelector: false
          , selectorResource: []
          , selectorInitialValue: ""
          , modalTitle: ""
          , editingNode: undefined
          , editingPath: undefined
          , editingTreeIndex: undefined
          , selectedId: "" // from SearchText
          , selectedItem: "" // from ReactSelector
        }
      }, function () { return this.handleStateChange("place holder")});
  };

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  };


  getNodeEditor = () => {
    if (this.state.showModalEditor) {
      return (
          <ModalTemplateNodeEditor
              session={this.props.session}
              showModal={this.state.showModalEditor}
              node={this.state.editingNode}
              path={this.state.editingPath}
              treeIndex={this.state.editingTreeIndex}
              callBack={this.handleNodeEditorCallback}
              templateLibrary={this.props.idLibrary}
              templateTopic={this.props.idTopic}
          />
      )
    }
  };

  handleNodeEditorCallback = (node) => {
    this.setState(
        {
          showModalEditor: false
        }
    , console.log(`handleNodeEditorCallback, this.state.showModalEditor=${this.state.showModalEditor}`));
  };

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  expand(expanded) {
    this.setState({
      treeData: toggleExpandedForAll({
        treeData: this.state.treeData,
        expanded,
      }),
    });
  }

  expandAll() {
    this.expand(true);
  }

  collapseAll() {
    this.expand(false);
  }

  onSubmit = () => {
    this.setState({
      updating: true
    });
    let formData = this.props.formData;
    formData.node = JSON.stringify(this.state.treeData[0]);
    let config = {
      auth: {
        username: this.props.session.userInfo.username
        , password: this.props.session.userInfo.password
      }
    };
    let path = Server.getDbServerTemplatesApi()
        + "/"
        + this.props.idLibrary
        + "/"
        + this.props.idTopic
        + "/"
        + this.props.idKey
    ;
    Server.restPutSchemaBasedForm(
        this.props.session.restServer
        , this.props.session.userInfo.username
        , this.props.session.userInfo.password
        , path
        , formData
        , undefined
        , this.handleSubmitCallback
    )
  };

  handleSubmitCallback = (restCallResult) => {
    if (restCallResult) {
      this.setState({
        message: restCallResult.message
        , messageIcon: restCallResult.messageIcon
        , updating: false
      });
    }
  }

  getSubmitButton = () => {
    if (this.props.formData) {
      return (
          <Grid>
            <Row className="show-grid App-Template-Editor-Submit-Row">
              <Col sm={12} md={12}>
                <Button
                    className={"App-Template-Editor-Submit-Button"}
                    bsStyle="primary"
                    onClick={this.onSubmit}
                >
                  {this.state.labels.buttons.submit}
                </Button>
                {this.getMessages()}
              </Col>
            </Row>
          </Grid>
      );
    }
  }

  getMessages = () => {
    if (this.state.updating) {
      return (
          <span>
            <Spinner message={this.state.labels.messages.updating}/>
          </span>
      );
    } else {
      return (
          <span>
            <FontAwesome name={this.state.messageIcon}/>
            {this.state.message}
          </span>
      )
    }
  };


  render() {

    const maxDepth = this.props.maxDepth;
    const {
      searchString
      , searchFocusIndex
      , searchFoundCount
    } = this.state;

    const handleEditRequest = (node, path, treeIndex) => {
      console.log("handleEditRequest");
      this.setState(
        {
          editingNode: node
          , editingPath: path
          , editingTreeIndex: treeIndex
          , showModalEditor: true
        }
      );

      const objectString = Object.keys(node)
          .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
          .join(',\n   ');

      console.log(
          'Info passed to the button generator:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n`
          + `treeIndex: ${treeIndex}`
      );
    };

    const selectPrevMatch = () =>
        this.setState({
          searchFocusIndex:
              searchFocusIndex !== null
                  ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
                  : searchFoundCount - 1,
        });

    const selectNextMatch = () =>
        this.setState({
          searchFocusIndex:
              searchFocusIndex !== null
                  ? (searchFocusIndex + 1) % searchFoundCount
                  : 0,
        });

    const isVirtualized = false;
    const treeContainerStyle = isVirtualized ? { height: 450 } : {};
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
        <div className="App App-Template-Editor">
          {this.state.showModalEditor && this.getNodeEditor()}
          <Well>
          <h3>{this.state.labels.thisClass.panelTitle}</h3>
          <Button className="App-Template-Editor-Button" bsStyle="primary" bsSize="small" onClick={this.expandAll}>{this.state.labels.thisClass.expandAll}</Button>
          <Button className="App-Template-Editor-Button" bsStyle="primary" bsSize="small" onClick={this.collapseAll}>{this.state.labels.thisClass.collapseAll}</Button>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <form
              style={{ display: 'inline-block' }}
              onSubmit={event => {
                event.preventDefault();
              }}
          >
            <label htmlFor="find-box">
              Search:&nbsp;
              <input
                  id="find-box"
                  type="text"
                  value={searchString}
                  onChange={event =>
                      this.setState({ searchString: event.target.value })
                  }
              />
            </label>

            <Button
                className="App-Template-Editor-Button"
                bsStyle="primary"
                bsSize="xsmall"
                type="button"
                disabled={!searchFoundCount}
                onClick={selectPrevMatch}
            >
              &lt;
            </Button>

            <Button
                className="App-Template-Editor-Button-Search"
                bsStyle="primary"
                bsSize="xsmall"
                type="submit"
                disabled={!searchFoundCount}
                onClick={selectNextMatch}
            >
              &gt;
            </Button>

            <span>
              &nbsp;
              {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
              &nbsp;/&nbsp;
              {searchFoundCount || 0}
            </span>
          </form>
          <div style={treeContainerStyle}>
            <SortableTree
                treeData={this.state.treeData}
                onChange={this.updateTreeData}
                onMoveNode={({ node, treeIndex, path }) =>
                    console.debug(
                        'node:',
                        node,
                        'treeIndex:',
                        treeIndex,
                        'path:',
                        path
                    )
                }
                maxDepth={maxDepth}
                searchQuery={searchString}
                searchFocusOffset={searchFocusIndex}
                canDrag={({ node }) => !node.noDragging}
                canDrop={({ nextParent }) =>
                    !nextParent || !nextParent.noChildren
                }
                searchFinishCallback={matches =>
                    this.setState({
                      searchFoundCount: matches.length,
                      searchFocusIndex:
                          matches.length > 0 ? searchFocusIndex % matches.length : 0,
                    })
                }
                isVirtualized={isVirtualized}
                generateNodeProps={({ node, path, treeIndex }) => ({
                  buttons: [
                    <Button
                        className="App-Template-Editor-Node-Button"
                        bsStyle="default"
                        bsSize="xsmall"
                        onClick={() => handleEditRequest(node, path, treeIndex)}
                    >
                      <FontAwesome name={this.state.messageIcons.pencil}/>
                    </Button>,
                    <Button
                        className="App-Template-Editor-Node-Button"
                        bsStyle="default"
                        bsSize="xsmall"
                        onClick={() =>
                            this.setState(state => ({
                              treeData: addNodeUnderParent({
                                treeData: state.treeData,
                                parentKey: path[path.length - 1],
                                expandParent: true,
                                getNodeKey,
                                newNode: {
                                  title: "tbd", subtitle: "", config: ""},
                              }).treeData,
                            }))
                        }
                    >
                    <FontAwesome name={this.state.messageIcons.plus}/>
                    </Button>,
                    <Button
                        className="App-Template-Editor-Node-Button"
                        bsStyle="default"
                        bsSize="xsmall"
                        onClick={() =>
                            this.setState(state => ({
                              treeData: removeNodeAtPath({
                                treeData: state.treeData,
                                path,
                                getNodeKey,
                              }),
                            }))
                        }
                    >
                      <FontAwesome name={this.state.messageIcons.trash}/>
                    </Button>,
                  ],
                })}
            />
            {this.getSubmitButton()}
          </div>
          </Well>
        </div>
    )
  }
}

TemplateEditor.propTypes = {
  session: PropTypes.object.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
  , treeData: PropTypes.array
  , maxDepth: PropTypes.number
  , formData: PropTypes.object
  , uiSchema: PropTypes.object
  , schema: PropTypes.object
};

TemplateEditor.defaultProps = {
  languageCode: "en"
  , treeData: [
    {
      title: 'Template',
      subtitle: 'tbd',
      expanded: true,
      children: [
        {
          title: "Section"
          , subtitle: 'tbd'
          , children: []
        }
      ]
    }
    ]
  , maxDepth: 20
};

TemplateEditor.propTypes = {
  session: PropTypes.object.isRequired
  , treeData: PropTypes.array.isRequired
  , idLibrary: PropTypes.string.isRequired
  , idTopic: PropTypes.string.isRequired
};

export default TemplateEditor;
