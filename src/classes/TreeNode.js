/**
 * Created by mac002 on 6/6/17.
 */

class TreeNode {
  constructor(
      id
      , dependsOn
      , token
      , lemma
      , gloss
      , label
      , grammar
  ) {
    this.id = id;
    this.dependsOn = dependsOn;
    this.token = token;
    this.lemma = lemma;
    this.gloss = gloss;
    this.label = label;
    this.grammar = grammar;
  }
}

export default TreeNode;