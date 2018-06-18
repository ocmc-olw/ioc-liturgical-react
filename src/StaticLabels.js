import labelsJson from './classes/labels.json';
import LabelTopics from './classes/LabelTopics';

class StaticLabels {
  constructor() {
    this.labelsJson = labelsJson;
    this.LabelTopics = LabelTopics;
  };
}
export default StaticLabels;
