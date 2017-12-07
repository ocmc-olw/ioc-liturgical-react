/**
 * Created by mac002 on 12/6/17.
 */

class TemplateNodeInitializer {
  constructor(library
      , topic
      , key
      , templateType
      , nodeType) {
    this.library = library;
    this.topic = topic;
    this.key = key;
    this.templateType = templateType;
    this.nodeType = nodeType;
  };

  getRootNode = () => {
    let theSubtitle = "se";
    if (this.templateType == "BOOK") {
      theSubtitle = "bk";
    } else if (this.templateType == "CLIENT") {
      theSubtitle = "cu";
    }
    let node = {
      title: "TEMPLATE"
      , subtitle: theSubtitle
      , children: []
    };
    let theKids = [];
    switch (this.nodeType) {
      case "WHEN_DATE_IS":
        break;
      case "WHEN_DAY_NAME_IS":
        break;
      case "WHEN_DAY_OF_MONTH_IS":
        break;
      case "WHEN_EXISTS":
        break;
      case "WHEN_LUKAN_CYCLE_DAY_IS":
        break;
      case "WHEN_MONTH_NAME_IS":
        break;
      case "WHEN_MODE_OF_WEEK_IS":
        break;
      case "WHEN_MOVABLE_CYCLE_DAY_IS":
        break;
      case "WHEN_PASCHA":
        break;
      case "WHEN_PENTECOSTARIAN_DAY_IS":
        break;
      case "WHEN_SUNDAYS_BEFORE_TRIODION":
        break;
      case "WHEN_SUNDAY_AFTER_ELEVATION_OF_CROSS_DAY_IS":
        break;
      case "WHEN_TRIODION_DAY_IS":
        break;
      default: // SECTION
      theKids.push(
          {
            title: "SECTION"
            , subtitle: "section01"
          , children: []
          }
      );
      break;
    }
    node.children = theKids;
    return node;
  }
}
export default TemplateNodeInitializer;