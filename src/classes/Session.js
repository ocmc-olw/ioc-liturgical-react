/**
 * Created by mac002 on 6/6/17.
 */
import User from './User';
import UiSchemas from './UiSchemas';
import Dropdowns from './Dropdowns';

class Session {
  constructor(
      restServer
      , languageCode
      , userInfo
      , uiSchemas
      , dropdowns
  ) {
    this.restServer = (restServer ? restServer : "");
    this.languageCode = (languageCode ? languageCode : "en");
    this.userInfo = (userInfo ? userInfo : new User());
    this.uiSchemas = (uiSchemas ? uiSchemas : new UiSchemas());
    this.dropdowns = (dropdowns ? dropdowns : new Dropdowns())
  };
}
export default Session;