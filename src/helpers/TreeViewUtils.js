import { get, has } from 'lodash';

class TreeViewUtils {
  constructor(nodes) {
    this.nodes = nodes;
    this.nodeDependencies = this.toDependencyMap();
  }

  /**
   * Creates a map such that
   * key = parent node id
   * value = an array of dependent nodes
   * @param nodes
   * @returns {{}}
   */
  toDependencyMap = () => {
    let map = {};
    for (let i=0; i < this.nodes.length; i++) {
      let node = this.nodes[i];
      let dependsOn = node.dependsOn;
      let dependencies = [];
      if (has(map, dependsOn)) {
        dependencies = get(map,dependsOn);
      }
      dependencies.push(node.key);
      map[dependsOn] = dependencies;
    }
    return map;
  };

  /**
   * Converts the flat array of token nodes from the web service
   * into a hierarchical representation, with a root node
   * and children.  This function makes a recursive call.
   * @param nodes
   * @param nodeDependencies
   * @param parent
   * @returns {Array}
   */
  toTreeViewData = (parent, selection) => {
    let result = [];
    let nodeData = {};
    nodeData.key = "Root";
    nodeData.token = "";
    nodeData.label = "";
    nodeData.gloss = "";
    nodeData.grammar = "";
    nodeData.lemma = "";
    nodeData.refersTo =  "";
    nodeData.state = {
      expanded: true
      , selected: false
    };
    let children = this.toChildrenNodes(
        parent
        , selection
    );
    if (children) {
      nodeData.nodes = children;
    }
    result.push(nodeData);
    return result;
  };

  toChildrenNodes = (parent, selection) => {
    let result = [];
    if (has(this.nodeDependencies, parent)) {
      let keys = get(this.nodeDependencies, parent);
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let selected = (key === selection);
        let node = this.nodes[key];
        if (node) {
          let nodeData = {};
          nodeData.key = key;
          nodeData.token = node.token;
          nodeData.label = node.label;
          nodeData.gloss = node.gloss;
          nodeData.grammar = node.grammar;
          nodeData.lemma = node.lemma;
          nodeData.refersTo =  node.refersTo;
          nodeData.state = {
            expanded: selected
            , selected: selected
          };
          let children = this.toChildrenNodes(
              key
              , selection
          );
          if (children) {
            nodeData.nodes = children;
          }
          result.push(nodeData);
        }
      }
    }
    return result;
  };

}
export default TreeViewUtils;