/**
 * Created by mac002 on 1/2/17.
 *
 * Note: June 1, 2017 -- I am in the process of creating functions
 * in this class that result in this being the only place that
 * calls Axios.  Only a few have been taken care of so far.
 */
import MessageIcons from './MessageIcons';
import axios from 'axios';
import FileSaver from 'file-saver';
import IdManager from './IdManager';

const adminApi = "/admin/api/v1/";
const dbApi = "/db/api/v1/";
const uilabels = "docs/uilabels";
const ldpApi = "/ldp/api/v1/";
const resources = "docs/new";
const version = "info";
const changePassword = "users/passwordchange";
const login = "login/form";
const loginUser = "login/user";
const links = "links";
const docs = "docs";
const generic = docs + "/generic";
const genericExists = docs + "/genericexists";
const notes = docs + "/notes";
const userdocs = docs + "/userdocs";
const treebanks = docs + "/treebanks";
const agesPdf = docs + "/agespdf";
const clone = docs + "/clone";
const agesIndex = docs + "/agesindex";
const agesReactTemplate = docs + "/agesreacttemplate";
const agesReadOnlyTemplate = docs + "/agesreadonlytemplate";
const nlp = "nlp/";
const ontology = "ontology/ontology";
const tables = docs + "/tables/";
const tableLexiconOald = "en_sys_tables/LexiconTable/OALD";
const templates = docs + "/templates";
const valuePath = docs + "/value";
const viewtemplate = docs + "/viewtemplate";
const viewtopic = docs + "/viewtopic";
const wordAnalysis = "nlp/word/analysis";
const textAnalysis = nlp + "text/analysis";
const textDownloads = docs + "/textdownloads";
const adminDomains = "misc/domains";
const dbDropdownsSearchAbbreviations = "dropdowns/abbreviations";
const dbDropdownsSearchGeneric = "dropdowns/bibliography";
const dbDropdownsSearchText = "dropdowns/texts";
const dbDropdownsSearchTemplates = "dropdowns/templates";
const dbDropdownsSearchNotes = "dropdowns/notes";
const dbDropdownsUserRolesForDomain = "domains/userdropdown";
const dbDomainsCollective = "domains/collective";
const dbDropdownsOntologyEntites = "dropdowns/ontologyentities";
const dbDropdownsSearchOntology = "dropdowns/ontology";
const dbDropdownDomains = "dropdowns/domains";
const dbDropdownsSearchRelationships = "dropdowns/relationships";
const dbDropdownsSearchTreebanks = "dropdowns/treebanks";
const dbDropdownsGrLibTopics = "dropdowns/grlibtopics";
const ldp = "ldp";
const messageIcons = MessageIcons.getMessageIcons();

const getTimestamp = () => {
  let date = new Date();
  let month = (date.getMonth()+1).toString().padStart(2,"0");
  let day = date.getDate().toString().padStart(2,"0");
  let hour = date.getHours().toString().padStart(2,"0");
  let minute = date.getMinutes().toString().padStart(2,"0");
  let second = date.getSeconds().toString().padStart(2,"0");
  let idKey = date.getFullYear()
      + "."
      + month
      + "."
      + day
      + ".T"
      + hour
      + "."
      + minute
      + "."
      + second
  ;
  return idKey;
};

const restGetPromise = (
    restServer
    , serverPath
    , username
    , password
    , parms
) => {
  return new Promise((resolve, reject) => {
    let responseType = "application/json";
    if (serverPath.includes('pdf')) {
      responseType = "blob";
    }
    let config = {
      auth: {
        username: username
        , password: password
      }
      , responseType: responseType
    };

    let path = restServer
        + serverPath
    ;

    if (parms && parms.length > 0) {
      path = path + "?" + parms
    }

    let result = {
      data: {}
      , userMessage: "OK"
      , developerMessage: "OK"
      , messageIcon: messageIcons.info
      , status: 200
    };

    axios.get(path, config)
        .then(response => {
          result.userMessage = response.data.status.userMessage
          result.developerMessage = response.data.status.developerMessage
          result.code = response.data.status.code
          result.data = response.data;
          resolve(result);
        })
        .catch((error) => {
          result.message = error.message;
          result.messageIcon = messageIcons.error;
          result.status = error.status;
          reject(result);
        });
  })
};

const restGetPdf = (
    restServer
    , serverPath
    , username
    , password
    , parms
    , filename
) => {
  return new Promise((resolve, reject) => {
    let responseType = "blob";
    let config = {
      auth: {
        username: username
        , password: password
      }
      , responseType: responseType
    };

    let path = restServer
        + serverPath
    ;

    if (parms && parms.length > 0) {
      path = path + "?" + parms
    }

    let result = {
      data: {}
      , userMessage: "OK"
      , developerMessage: "OK"
      , messageIcon: messageIcons.info
      , status: 200
    };

    axios.get(path, config)
        .then(response => {
          var blob = new Blob([response.data], {type: 'application/pdf'});
            FileSaver.saveAs(blob, filename);
            result.userMessage = "ok";
            result.developerMessage = "ok";
            result.code = "200";
            result.data = response.data;
          resolve(result);
        })
        .catch((error) => {
          result.message = error.message;
          result.messageIcon = messageIcons.error;
          result.status = error.status;
          reject(result);
        });
  })
};

const restGetAddress = (callback) => {
  return new Promise((resolve, reject) => {
    let path = "https://api.ipify.org/?format=json";
    let result = {
      ip: ""
      , status: 0
    };

    axios.get(path)
        .then(response => {
          result.status = response.status;
          result.ip = response.data.ip;
          callback(result);
        })
        .catch((error) => {
          result.message = error.message;
          result.messageIcon = messageIcons.error;
          result.status = error.status;
          callback(result);
        });
  })
};

const restGetLocation = (address, callback) => {
  return new Promise((resolve, reject) => {
    let path = "http://ip-api.com/json/" + address;

    let result = {
      location: ""
      , userMessage: "OK"
      , developerMessage: "OK"
      , messageIcon: messageIcons.info
      , status: 200
    };

    axios.get(path)
        .then(response => {
          result.status = response.status;
          result.location = response.data.countryCode
              + "|"
              + response.data.country
              + "|"
              + response.data.region
              + "|"
              + response.data.regionName
              + "|"
              + response.data.city
          ;
          callback(result);
        })
        .catch((error) => {
          result.status = error.status;
          callback(result);
        });
  })
};

const restGetUserDocs = (
    restServer
    , serverPath
    , username
    , password
) => {
  return new Promise((resolve, reject) => {
    let responseType = "blob";
    let config = {
      auth: {
        username: username
        , password: password
      }
      , responseType: responseType
    };

    let path = restServer
        + serverPath
    ;

    let result = {
      data: {}
      , userMessage: "OK"
      , developerMessage: "OK"
      , messageIcon: messageIcons.info
      , status: 200
    };

    axios.get(path, config)
        .then(response => {
          var blob = new Blob([response.data], {type: 'application/json'});
          FileSaver.saveAs(blob, getTimestamp() + "_" + username + ".json");
          result.userMessage = "ok";
          result.developerMessage = "ok";
          result.code = "200";
          result.data = response.data;
          resolve(result);
        })
        .catch((error) => {
          result.message = error.message;
          result.messageIcon = messageIcons.error;
          result.status = error.status;
          reject(result);
        });
  })
};

const restDelete = (
    restServer
    , username
    , password
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
      + dbApi
      + "/delete"
  ;

    path += "?";
    path += parms;

  let result = {
    data: {}
    , userMessage: "OK"
    , developerMessage: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  axios.delete(path, config)
      .then(response => {
        result.userMessage = response.data.status.userMessage;
        result.developerMessage = response.data.status.developerMessage;
        result.code = response.data.status.code;
        result.data = response.data;
        callback(result);
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
        callback(result);
      });
};

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
  console.log(`server path`);
  console.log(path);
  if (parms && parms.length > 0) {
    path = path + "?" + parms
  }

  let result = {
    data: {}
    , userMessage: "OK"
    , developerMessage: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  axios.get(path, config)
      .then(response => {
        result.userMessage = response.data.status.userMessage;
        result.developerMessage = response.data.status.developerMessage;
        result.code = response.data.status.code;
        result.data = response.data;
        callback(result);
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
        callback(result);
      });
};

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
    path = path + "/?" + parms
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
    path = path + "/?" + parms
  }
  let result = {
    data: {}
    , message: "OK"
    , messageIcon: messageIcons.info
    , status: 200
  };

  axios.put(
      path
      , data
      , config
  )
      .then(response => {
        let userMessage = "Updated OK";
        let developerMessage = userMessage;
        let statusCode = 200;
        if (response.data) {
          if (response.data.status) {
            userMessage = response.data.status.userMessage;
            developerMessage = response.data.status.developerMessage;
            statusCode = response.data.status.code;
          } else if (response.data.userMessage) {
            userMessage = response.data.userMessage;
            developerMessage = response.data.developerMessage;
            statusCode = response.data.code;
          }
        }
        result.userMessage = userMessage
        result.developerMessage = developerMessage
        result.code = statusCode
        if (callback) {
          callback(result);
        }
      })
      .catch((error) => {
        result.message = error.message;
        result.messageIcon = messageIcons.error;
        result.status = error.status;
        if (error.response && error.response.data) {
          result.status = error.response.data.code;
          result.message = error.response.data.userMessage;
          console.log(error.response.data.developerMessage);
        }
        if (callback) {
          callback(result);
        }
      });
  return result;
}

export default {
  tableLexiconOald
  , getWsServerAdminApi: () => { return adminApi;}
  , getWsServerLdpApi: () => { return ldpApi;}
  , getWsServerDbApi: () => { return dbApi;}
  , getWsServerLoginApi: () => { return adminApi + login;}
  , getWsServerPasswordChangeApi: () => { return adminApi + changePassword;}
  , getWsServerLoginUserApi: () => { return adminApi + loginUser;}
  , getWsServerVersionApi: () => { return adminApi + version;}
  , getWsServerResourcesApi: () => { return dbApi + resources;}
  , getWsServerDomainsApi: () => {return adminApi + adminDomains;}
  , getDbServerAgesPdfApi: () => {return dbApi + agesPdf;}
  , getDbServerDropdownsSearchAbbreviationsApi: () => {return dbApi + dbDropdownsSearchAbbreviations;}
  , getDbServerDropdownsSearchGenericApi: () => {return dbApi + dbDropdownsSearchGeneric;}
  , getDbServerDropdownsSearchTextApi: () => {return dbApi + dbDropdownsSearchText;}
  , getDbServerDropdownsSearchTemplatesApi: () => {return dbApi + dbDropdownsSearchTemplates;}
  , getDbServerDropdownsSearchNotesApi: () => {return dbApi + dbDropdownsSearchNotes;}
  , getDbServerDropdownsSearchOntologyApi: () => {return dbApi + dbDropdownsSearchOntology;}
  , getDbServerDropdownsOntologyEntitiesApi: () => {return dbApi + dbDropdownsOntologyEntites;}
  , getDbServerDropdownsSearchRelationshipsApi: () => {return dbApi + dbDropdownsSearchRelationships;}
  , getDbServerDropdownsSearchTreebanksApi: () => {return dbApi + dbDropdownsSearchTreebanks;}
  , getDbServerDocsApi: () => {return dbApi + docs;}
  , getDbServerNotesApi: () => {return dbApi + notes;}
  , getDbServerUserDocsApi: () => {return dbApi + userdocs;}
  , getDbServerLinksApi: () => {return dbApi + links;}
  , getDbServerOntologyApi: () => {return dbApi + ontology;}
  , getDbServerTemplatesApi: () => {return dbApi + templates;}
  , getDbServerTreebanksApi: () => {return dbApi + treebanks;}
  , getWsServerLiturgicalDayPropertiesApi: () => {return ldpApi + ldp;}
  , getDbServerWordAnalysisApi: () => {return dbApi + wordAnalysis;}
  , getGenericExistsResult: (
      restServer,
      username
      , password
      , library
      , topic
      , key
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + genericExists
        , "d=" + encodeURIComponent(library)
        + "&t=" + encodeURIComponent(topic)
        + "&k=" + encodeURIComponent(key)
        , function (result) {
          callback(result);
        }
    );
  }
  , getGenericSearchResult: (
      restServer,
      username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + generic
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getActivities: (
      restServer,
      username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + "activity"
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getResources: (
      restServer,
      username
      , password
      , parms
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
        , parms
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
  , getTextDownloads: (
      restServer,
      username
      , password
      , id
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + textDownloads
        + "/"
        + id
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getRelationshipsSearchDropdowns: (
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
        + dbDropdownsSearchRelationships
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
  , getCollectiveDomains: (
      restServer,
      username
      , password
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , adminApi
        + dbDomainsCollective
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getDropdownLibrariesForUser: (
      restServer,
      username
      , password
      , user
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , adminApi
        + dbDropdownDomains
        + "/"
        + user
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getTable: (
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
        + tables
        + id
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getTopics: (
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
        + dbDropdownsGrLibTopics
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getViewForTemplate: (
      restServer,
      username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + viewtemplate
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getViewForTopic: (
      restServer
      , username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + viewtopic
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getUiLabels: (
      restServer
      , username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + uilabels
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getAgesIndex: (
      restServer
      , username
      , password
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + agesIndex
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , getAgesEditorTemplate: (
      restServer
      , username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + agesReactTemplate
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , getAgesReadOnlyTemplate: (
      restServer
      , username
      , password
      , parms
      , callback
  ) => {
    restGet(
        restServer
        , username
        , password
        , dbApi
        + agesReadOnlyTemplate
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , postLibraryClone: (
      restServer
      , username
      , password
      , value
      , parms
      , callback
  ) => {
    restPost(
        restServer
        , username
        , password
        , dbApi
        + clone
        , value
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , restPutSchemaBasedForm: (
      restServer
      , username
      , password
      , path
      , value
      , parms
      , callback
  ) => {
    restPut(
        restServer
        , username
        , password
        , path
        , value
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , putValue: (
      restServer
      , username
      , password
      , value
      , parms
      , callback
  ) => {
    restPut(
        restServer
        , username
        , password
        , dbApi
        + valuePath
        , value
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , putUiLabel: (
      restServer
      , username
      , password
      , value
      , parms
      , callback
  ) => {
    restPut(
        restServer
        , username
        , password
        , dbApi
        + uilabels
        , value
        , parms
        , function (result) {
          callback(result);
        }
    );
  }
  , restGetPromise: (
      restServer
      , serverPath
      , username
      , password
      , parms
  ) => {
    return restGetPromise(
        restServer
        , serverPath
        , username
        , password
        , parms
    );
  }
  , restGetForId: (
      restServer
      , username
      , password
      , id
      , callback
  ) => {
    let idParts = IdManager.getParts(id);
    let path = dbApi + docs + "/" + idParts.library + "/" + idParts.topic + "/" + idParts.key;
    return restGet(
        restServer
        , username
        , password
        , path
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , restGetForLibraryTopicKey: (
      restServer
      , username
      , password
      , library
      , topic
      , key
      , callback
  ) => {
    let path = dbApi + docs + "/" + library+ "/" + topic + "/" + key;
    return restGet(
        restServer
        , username
        , password
        , path
        , undefined
        , function (result) {
          callback(result);
        }
    );
  }
  , restGetSuggestions: (
      restServer
      , username
      , password
      , library
      , callback
  ) => {
    let path = dbApi + docs + "/suggestions";
    return restGet(
        restServer
        , username
        , password
        , path
        , "d=" + encodeURIComponent(library)
        , function (result) {
          callback(result);
        }
    );
  }
  , restGetGenerationStatus: (
      restServer
      , username
      , password
      , fileId
      , callback
  ) => {
    let path = dbApi + docs + "/genstatus";
    return restGet(
        restServer
        , username
        , password
        , path
        , "i=" + encodeURIComponent(fileId)
        , function (result) {
          callback(result);
        }
    );
  }
  , restGetPdf: (
      restServer
      , serverPath
      , username
      , password
      , parms
      , filename
  ) => {
    return restGetPdf(
        restServer
        , serverPath
        , username
        , password
        , parms
        , filename
    );
  }
  , restGetUserDocs: (
      restServer
      , serverPath
      , username
      , password
  ) => {
    return restGetUserDocs(
        restServer
        , serverPath
        , username
        , password
    );
  }
  , restGetAddress: (
      callback
  ) => {
    return restGetAddress(
        callback
    );
  }
  , restGetLocation: (
      address
      , callback
  ) => {
    return restGetLocation(
      address
      , callback
    );
  }
  , restDelete: (
      restServer
      , username
      , password
      , parms
      , callback
  ) => {
    return restDelete(
        restServer
        , username
        , password
        , parms
        , callback
    );
  }
}