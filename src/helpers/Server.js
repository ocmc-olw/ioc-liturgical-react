/**
 * Created by mac002 on 1/2/17.
 *
 * Note: June 1, 2017 -- I am in the process of creating functions
 * in this class that result in this being the only place that
 * calls Axios.  Only a few have been taken care of so far.
 */
import MessageIcons from './MessageIcons';
import axios from 'axios';

const adminApi = "/admin/api/v1/";
const dbApi = "/db/api/v1/";
const ldpApi = "/ldp/api/v1/";
const resources = "docs/new";
const version = "info";
const login = "login/form";
const loginUser = "login/user"
const links = "links";
const docs = "docs";
const ontology = "ontology/ontology";
const nlp = "nlp/"
const textAnalysis = nlp + "text/analysis"
const adminDomains = "misc/domains";
const dbDropdownsSearchText = "dropdowns/texts";
const dbDropdownsUserRolesForDomain = "domains/userdropdown";
const dbDropdownsSearchOntology = "dropdowns/ontology";
const dbDropdownDomains = "dropdowns/domains";
const dbDropdownsSearchRelationships = "dropdowns/relationships";
const ldp = "ldp";
const messageIcons = MessageIcons.getMessageIcons();

const restGet = (
    restServer
    , username
    , password
    , serverPath
    , parms
    , callback
) => {

  let config = {
    auth: {
      username: username
      , password: password
    }
  };

  let path = restServer
      + serverPath
  ;

  if (parms && parms.length > 0) {
    path = path + parms
  }

  let result = {
    data: {}
    , userMessage: "OK"
    , developerMessage: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  console.log(path);

  axios.get(path, config)
      .then(response => {
        result.userMessage = response.data.status.userMessage
        result.developerMessage = response.data.status.developerMessage
        result.code = response.data.status.code
        result.data = response.data;
        callback(result);
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
        callback(result);
      });
}

const restPost = (
    restServer
    , username
    , password
    , serverPath
    , data
    , parms
) => {

  let config = {
    auth: {
      username: username
      , password: password
    }
  };

  let path = restServer
      + serverPath
  ;

  if (parms && parms.length > 0) {
    path = path + parms;
  }

  let result = {
    data: {}
    , message: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  axios.post(
      path
      , data
      , config
  )
      .then(response => {
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
      });
  return result;
}

const restPut = (
    restServer
    , username
    , password
    , serverPath
    , data
    , parms
) => {

  let config = {
    auth: {
      username: username
      , password: password
    }
  };

  let path = restServer
      + serverPath
  ;

  if (parms && parms.length > 0) {
    path = path + parms;
  }
  let result = {
    data: {}
    , message: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  axios.post(
      path
      , data
      , config
  )
      .then(response => {
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
      });
  return result;
}

export default {
  getWsServerAdminApi: () => { return adminApi;}
  , getWsServerLdpApi: () => { return ldpApi;}
  , getWsServerDbApi: () => { return dbApi;}
  , getWsServerLoginApi: () => { return adminApi + login;}
  , getWsServerLoginUserApi: () => { return adminApi + loginUser;}
  , getWsServerVersionApi: () => { return adminApi + version;}
  , getWsServerResourcesApi: () => { return dbApi + resources;}
  , getWsServerDomainsApi: () => {return adminApi + adminDomains;}
  , getDbServerDropdownsSearchTextApi: () => {return dbApi + dbDropdownsSearchText;}
  , getDbServerDropdownsSearchOntologyApi: () => {return dbApi + dbDropdownsSearchOntology;}
  , getDbServerDropdownsSearchRelationshipsApi: () => {return dbApi + dbDropdownsSearchRelationships;}
  , getDbServerDocsApi: () => {return dbApi + docs;}
  , getDbServerLinksApi: () => {return dbApi + links;}
  , getDbServerOntologyApi: () => {return dbApi + ontology;}
  , getWsServerLiturgicalDayPropertiesApi: () => {return ldpApi + ldp;}
  , getResources: (
      restServer,
      username
      , password
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + resources
        + "/"
        + username
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getTextAnalysis: (
      restServer,
      username
      , password
      , id
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + textAnalysis
        + "/"
        + id
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getDropdownUsersForLibrary: (
      restServer,
      username
      , password
      , library
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , adminApi
        + dbDropdownsUserRolesForDomain
        + "/"
        + library
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }

}