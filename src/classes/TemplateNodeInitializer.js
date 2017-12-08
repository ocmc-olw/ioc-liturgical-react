/**
 * Created by mac002 on 12/6/17.
 * TODO: complete the cases for getRootNode().  Use the ENUMS.  Need to add to them.
 */

const dowArray = [
  {name: "SUNDAY"}
  ,{ name: "MONDAY"}
  ,{ name: "TUESDAY"}
  ,{ name: "WEDNESDAY"}
  ,{ name: "THURSDAY"}
  ,{ name: "FRIDAY"}
  ,{ name: "SATURDAY"}
];

const otherwise = {
  title: "OTHERWISE"
  , children: [
    {
      title: "SECTION"
          , subtitle: "section_otherwise"
        , children: []
    }
  ]
};

class TemplateNodeInitializer {
  constructor(library
      , topic
      , key
      , templateType
      , nodeType
  ) {
    this.library = library;
    this.topic = topic;
    this.key = key;
    this.templateType = templateType;
    this.nodeType = nodeType;
    if (this.templateType === "BOOK") {
      if (!topic.startsWith("bk.")) {
        this.topic = "bk." + topic;
      }
    } else if (this.templateType === "CLIENT") {
      if (!topic.startsWith("cu.")) {
        this.topic = "cu." + topic;
      }
    }
  };


  mapNodes = (items) => {
    let tempNodeChildren = [];
    items.map(item =>
        tempNodeChildren.push(
            {
              title: item.name
              ,children: [
                {
                  title: "SECTION"
                  , subtitle: "section_" + item.name.toLowerCase()
                  , children: []
                }
              ]
            }
        )
    );
    tempNodeChildren.push(otherwise);
    return tempNodeChildren;
  }

  setServiceTopic = (month, day, serviceType) => {
    this.topic = "se.m"
        + month.padStart(2,"0")
        + ".d"
        + day.padStart(2,"0")
        + serviceType
    ;
  };

  getRootNode = () => {
    let node = {
      title: "TEMPLATE"
      , subtitle: this.library + "~" + this.topic + "~head"
      , children: []
    };
    let theChildren = [];
    switch (this.nodeType) {
      case "WHEN_DATE_IS":
        break;
      case "WHEN_DAY_NAME_IS":
        let tempNode = {
          title: "WHEN_DAY_NAME_IS"
          , children: []
        };
        let tempNodeChildren = this.mapNodes(dowArray);
        tempNode.children = tempNodeChildren;
        theChildren.push(tempNode);
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
      theChildren.push(
          {
            title: "SECTION"
            , subtitle: "section01"
          , children: []
          }
      );
      break;
    }
    node.children = theChildren;
    return node;
  }
}
export default TemplateNodeInitializer;