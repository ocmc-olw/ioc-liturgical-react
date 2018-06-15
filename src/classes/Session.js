/**
 * Created by mac002 on 6/6/17.
 */
import User from './User';
import UiSchemas from './UiSchemas';
import Dropdowns from './Dropdowns';
import labelsJson from './labels.json';
import LabelTopics from './LabelTopics';

// To produce labels.json and LabelTopics.js,
//   run ioc-liturgical-ws net.ages.alwb.utils.transformers.LabelsNeoToJson
// Note that labels.json is replaced once the user logs on.

class Session {
  constructor(
      restServer
      , languageCode
      , userInfo
      , uiSchemas
      , dropdowns
      , labels
  ) {
    this.restServer = (restServer ? restServer : "");
    this.languageCode = (languageCode ? languageCode : "en");
    this.userInfo = (userInfo ? userInfo : new User());
    this.uiSchemas = (uiSchemas ? uiSchemas : new UiSchemas());
    this.dropdowns = (dropdowns ? dropdowns : new Dropdowns());
    this.labelsAll = (this.labelsAll ? this.labelsAll : labelsJson);
    this.labels = (labels ? labels[this.languageCode] : labelsJson[this.languageCode]);
    this.labelTopics = (this.labelTopics ? this.labelTopics : LabelTopics);
  };
}
export default Session;