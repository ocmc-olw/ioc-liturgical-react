import React from 'react';
import PropTypes from 'prop-types';
import {Well} from 'react-bootstrap';
import SortableTree from 'react-sortable-tree';
import Labels from './Labels';
import MessageIcons from './helpers/MessageIcons';
import { addNodeUnderParent, removeNodeAtPath, toggleExpandedForAll } from './helpers/TreeDataUtils';
// The following is temporary
//import TreeData from './testdata/sortabletree/demo/TreeData';
//import TreeData from './testdata/sortabletree/atem/TreeData';

/**
 * This class provides a visual, drag-and-drop interface for
 * users to create templates to generate liturgical books or services.
 * It is a web browser replacement for the Java application ALWB.
 */
// TODO: rename class
class TemplateEditor extends React.Component {
  constructor(props) {
    super(props);

    const maxDepth = 5;
    const renderDepthTitle = ({ path }) => `Depth: ${path.length}`;

    this.state = {
      labels: { // TODO: replace getViewReferencesLabels with method for this class
        thisClass: Labels.getTemplateEditorLabels(this.props.session.languageCode)
        , messages: Labels.getMessageLabels(this.props.session.languageCode)
        , resultsTableLabels: Labels.getResultsTableLabels(props.session.languageCode)
      }
      , messageIcons: MessageIcons.getMessageIcons()
      , messageIcon: MessageIcons.getMessageIcons().info
      , message: Labels.getMessageLabels(this.props.session.languageCode).initial
      , maxDepth: 5
      , searchString: ''
      , searchFocusIndex: 0
      , searchFoundCount: null
  //    , treeData: TreeData.treeData
      , treeData: [
        {
          title: 'Template',
          subtitle: 'se.m01.d01.ve',
          expanded: true,
          children: [
            {
              title: 'Head',
              subtitle: '',
              children: [
                {
                  title: 'Set_Date',
                  subtitle: 'month 1 day 1 year 2018',
                },
              ],
            },
            {
              expanded: true,
              title: 'when-name-of-day-is',
              children: [
                {
                  expanded: true,
                  title: 'Sunday',
                  children: [
                      { title: 'Section', subtitle: 'Instance02'
                      , children: [
                          { title: 'Insert_section', subtitle: 'ST.ve.oc_me' },
                          { title: 'Insert_section', subtitle: 'VE._01_Beginning__.vespers' },
                        ]},
                    ],
                },
                {
                  expanded: true,
                  title: 'Otherwise',
                  children: [
                    { title: 'Section', subtitle: 'Instance01',
                    children: [
                      { title: 'Insert_section', subtitle: 'ST.ve.me' },
                      { title: 'Insert_section', subtitle: 'VE._01_Beginning__.vespers' },
                    ]},
                  ],
                },
              ],
            },
            {
              title: 'Button(s) can be added to the node',
              subtitle:
                  'Node info is passed when generating so you can use it in your onClick handler',
            },
            {
              title: 'Show node children by setting `expanded`',
              subtitle: ({ node }) =>
                  `expanded: ${node.expanded ? 'true' : 'false'}`,
              children: [
                {
                  title: 'Bruce',
                  subtitle: ({ node }) =>
                      `expanded: ${node.expanded ? 'true' : 'false'}`,
                  children: [{ title: 'Bruce Jr.' }, { title: 'Brucette' }],
                },
              ],
            },
            {
              title: 'Advanced',
              subtitle: 'Settings, behavior, etc.',
              children: [
                {
                  title: (
                      <div>
                        <div
                            style={{
                              backgroundColor: 'gray',
                              display: 'inline-block',
                              borderRadius: 10,
                              color: '#FFF',
                              padding: '0 5px',
                            }}
                        >
                          Any Component
                        </div>
                        &nbsp;can be used for `title`
                      </div>
                  ),
                },
                {
                  expanded: true,
                  title: 'Limit nesting with `maxDepth`',
                  subtitle: `It's set to ${maxDepth} for this example`,
                  children: [
                    {
                      expanded: true,
                      title: renderDepthTitle,
                      children: [
                        {
                          expanded: true,
                          title: renderDepthTitle,
                          children: [
                            { title: renderDepthTitle },
                            {
                              title: ({ path }) =>
                                  path.length >= maxDepth
                                      ? 'This cannot be dragged deeper'
                                      : 'This can be dragged deeper',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  title:
                      'Disable dragging on a per-node basis with the `canDrag` prop',
                  subtitle: 'Or set it to false to disable all dragging.',
                  noDragging: true,
                },
                {
                  title: 'You cannot give this children',
                  subtitle:
                      'Dropping is prevented via the `canDrop` API using `nextParent`',
                  noChildren: true,
                },
                {
                  title:
                  'When node contents are really long, it will cause a horizontal scrollbar' +
                  ' to appear. Deeply nested elements will also trigger the scrollbar.',
                },
              ],
            },
          ],
        },
      ]
    }

    this.handleStateChange = this.handleStateChange.bind(this);
    this.updateTreeData = this.updateTreeData.bind(this);
    this.expandAll = this.expandAll.bind(this);
    this.collapseAll = this.collapseAll.bind(this);
  }

  componentWillMount = () => {
  }

  componentDidMount = () => {
    // make any initial function calls here...
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.session.languageCode !== nextProps.session.languageCode) {
      this.setState((prevState, props) => {
        return {
          labels: {
            thisClass: Labels.getTemplateEditorLabels(nextProps.session.languageCode)
            , messages: Labels.getMessageLabels(nextProps.session.languageCode)
            , resultsTableLabels: Labels.getResultsTableLabels(nextProps.session.languageCode)
          }
          , message: Labels.getMessageLabels(props.session.languageCode).initial
        }
      }, function () { return this.handleStateChange("place holder")});
    }
  }

  // if we need to do something after setState, do it here...
  handleStateChange = (parm) => {
    // call a function if needed
  }

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

  render() {

    const {
      maxDepth
      , searchString
      , searchFocusIndex
      , searchFoundCount
    } = this.state;

    const alertNodeInfo = ({ node, path, treeIndex }) => {
      const objectString = Object.keys(node)
          .map(k => (k === 'children' ? 'children: Array' : `${k}: '${node[k]}'`))
          .join(',\n   ');

      global.alert(
          'Info passed to the button generator:\n\n' +
          `node: {\n   ${objectString}\n},\n` +
          `path: [${path.join(', ')}],\n` +
          `treeIndex: ${treeIndex}`
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
          <Well>
          <h3>{this.state.labels.thisClass.panelTitle}</h3>
          <button onClick={this.expandAll}>Expand All</button>
          <button onClick={this.collapseAll}>Collapse All</button>
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

            <button
                type="button"
                disabled={!searchFoundCount}
                onClick={selectPrevMatch}
            >
              &lt;
            </button>

            <button
                type="submit"
                disabled={!searchFoundCount}
                onClick={selectNextMatch}
            >
              &gt;
            </button>

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
                    global.console.debug(
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
                generateNodeProps={({ node, path }) => ({
                  buttons: [
                    <button
                        onClick={() =>
                            this.setState(state => ({
                              treeData: addNodeUnderParent({
                                treeData: state.treeData,
                                parentKey: path[path.length - 1],
                                expandParent: true,
                                getNodeKey,
                                newNode: {
                                  title: "tbd"},
                              }).treeData,
                            }))
                        }
                    >
                      Add Child
                    </button>,
                    <button
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
                      Remove
                    </button>,
                  ],
                })}
            />
          </div>
            <button
                onClick={() =>
                    this.setState(state => ({
                      treeData: state.treeData.concat({
                        title: "tbd",
                      }),
                    }))
                }
            >
              Add more
            </button>
          </Well>
        </div>
    )
  }
}

TemplateEditor.propTypes = {
  session: PropTypes.object.isRequired
};

TemplateEditor.defaultProps = {
  languageCode: "en"
};

// TODO: rename class for export
export default TemplateEditor;
