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
      , refersTo
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
    this.dependsOn = dependsOn ? dependsOn : "";
    this.refersTo = refersTo ? refersTo: "";
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
        + this.number
        + "."
        + this.gender
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
      if (TreeNode.requiresReferent(this.pos)) {
        return this.refersTo;
      } else {
        return true;
      }
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

  // e.g. PTCP.ACT.AOR.M.SG.NOM
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

  hasGrammarForParticiple = (requireReferent) => {
    if (
        this.pos
        && this.voice
        && this.tense
        && this.gender
        && this.number
        && this.case
    ) {
      if (requireReferent) {
        if (this.refersTo) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  // e.g. INF.AOR.ACT
  hasGrammarForInfinitive = () => {
    if (
        this.pos
        && this.voice
        && this.tense
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
        case ("PRON.COR"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.DEF"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.DEM"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.INDF"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.PERS"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.POSS"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.Q"): {
          result = this.hasGrammarForNounLikeWords();
          break;
        }
        case ("PRON.REFL"): {
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
        case ("PTCP"): {
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

  static requiresReferent(pos) {
    switch (pos) {
      case ("PRON"): {
        return true;
        break;
      }
      case ("PRON.COR"): {
        return false;
        break;
      }
      case ("PRON.DEF"): {
        return true;
        break;
      }
      case ("PRON.DEM"): {
        return true;
        break;
      }
      case ("PRON.INDF"): {
        return false;
        break;
      }
      case ("PRON.PERS"): {
        return true;
        break;
      }
      case ("PRON.POSS"): {
        return true;
        break;
      }
      case ("PRON.Q"): {
        return false;
        break;
      }
      case ("PRON.REFL"): {
        return true;
        break;
      }
      case ("PRON.REL"): {
        return false;
        break;
      }
      default: {
        return false;
      }
    }
  }

  /**
   * On the server-side, the tags for grammar are set by LTKDbTokenAnalysis
   * in the org.ocmc.ioc.liturgical.schemas.models.supers package.
   * So, if changes are made here, you need to make
   * them also in LTKDbTokenAnalysis.
   */
  getGrammar = () => {
    switch (this.pos) {
      case ("ADJ"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ADJ.COMP"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ADJ.SUP.ABS"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ADJ.SUP.REL"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ART"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ART.DEF"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("ART.INDF"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("INF"): {
        return this.getGrammarForInfinitive();
      }
      case ("PTCP"): {
        return this.getGrammarForParticiple();
      }
      case ("PRON"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("PRON.COR"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.DEF"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.DEM"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.INDF"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.PERS"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.POSS"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.Q"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.REFL"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("PRON.REL"): {
        return  this.getGrammarForNounLikeWords();
      }
      case ("NOUN"): {
        return this.getGrammarForNounLikeWords();
      }
      case ("VERB"): {
        return this.getGrammarForVerb();
      }
      default: {
        return this.pos;
      }
    }
  }
}

export default TreeNode;