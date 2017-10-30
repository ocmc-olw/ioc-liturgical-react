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
    this.grammar = this.getGrammar()
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

  hasGrammarForNounLikeWords = () => {
    if (
        this.pos
        && this.gender
        && this.number
        && this.case
    ) {
      return true;
    } else {
      return false;
    }
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

  hasGrammarForVerb = () => {
    if (
        this.pos
        && this.person
        && this.number
        && this.tense
        && this.voice
        && this.mood
    ) {
      return true;
    } else {
      return false;
    }
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

  hasGrammarForParticiple = () => {
    if (
        this.pos
        && this.voice
        && this.tense
        && this.gender
        && this.number
        && this.case
    ) {
      return true;
    } else {
      return false;
    }
  }

  // e.g. INF.AOR.ACT
  getGrammarForInfinitive = () => {
    return this.pos
        + "."
        + this.tense
        + "."
        + this.voice
        ;
  }

  hasGrammarForParticiple = () => {
    if (
        this.pos
        && this.tense
        && this.voice
    ) {
      return true;
    } else {
      return false;
    }
  }

  isComplete = () => {
    let result = false;
    if (
        this.lemma
        && this.gloss
        && this.dependsOn
        && this.label
        && this.pos

    ) {
      switch (this.pos) {
        case ("ADJ"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ADJ.COMP"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ADJ.SUP.ABS"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ADJ.SUP.REL"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ART"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ART.DEF"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("ART.INDF"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.POSS"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.REL"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("NOUN"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("INF"): {
          result = this.hasGrammarForInfinitive();
          break;
        }
        case ("PART"): {
          result = this.hasGrammarForParticiple();
          break;
        }
        case ("VERB"): {
          result = this.hasGrammarForVerb();
          break;
        }
        default: {
          result = true;
        }
      }
    }

    return result;
  }

  notComplete = () => {
    return ! this.isComplete();
  }


  getGrammar = () => {
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
      case ("INF"): {
        return this.getGrammarForInfinitive();
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