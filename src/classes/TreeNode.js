/**
 * Created by mac002 on 6/6/17.
 */

class TreeNode {
  constructor(
      id
      , token
      , lemma
      , gloss
      , dependsOn
      , label
      , gCase
      , gender
      , mood
      , number
      , person
      , pos
      , tense
      , voice
  ) {
    this.id = id;
    this.dependsOn = dependsOn;
    this.token = token;
    this.lemma = lemma;
    this.gloss = gloss;
    this.label = label;
    this.case = gCase;
    this.gender = gender;
    this.mood = mood;
    this.number = number;
    this.person = person;
    this.pos = pos;
    this.tense = tense;
    this.voice = voice;
  };

  getGrammarForNounLikeWords = () => {
    return this.pos
        + "."
        + this.gender
        + "."
        + this.number
        + "."
        + this.case
        ;
  }

  // e.g. VERB.3.SG.PRS.ACT.IND
  getGrammarForVerb = () => {
    return this.pos
        + "."
        + this.person
        + "."
        + this.number
        + "."
        + this.tense
        + "."
        + this.voice
        + "."
        + this.mood
        ;
  }

  // e.g. PART.ACT.AOR.M.SG.NOM
  getGrammarForParticiple = () => {
    return this.pos
        + "."
        + this.voice
        + "."
        + this.tense
        + "."
        + this.gender
        + "."
        + this.number
        + "."
        + this.case
        ;
  }

  grammar = () => {
    switch (this.pos) {
      case ("ADJ"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ADJ.COMP"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ADJ.SUP.ABS"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ADJ.SUP.REL"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ART"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ART.DEF"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("ART.INDF"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("PART"): {
        return this.getGrammarForParticiple();
        break;
      }
      case ("PRON"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("PRON.POSS"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("PRON.REL"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("NOUN"): {
        return this.getGrammarForNounLikeWords();
        break;
      }
      case ("VERB"): {
        return this.getGrammarForVerb();
        break;
      }
      default: {
        return this.pos;
      }
    }
  }
}

export default TreeNode;