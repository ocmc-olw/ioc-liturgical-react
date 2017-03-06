/**
 * Created by mac002 on 1/2/17.
 */

const adminApi = "/admin/api/v1/";
const dbApi = "/db/api/v1/";
const ldpApi = "/ldp/api/v1/";
const resources = "resources";
const login = "login";
const adminDomains = "misc/domains";
const dbDropdowns = "dropdowns";
const dbDropdownDomains = "dropdowns/domains";
const ldp = "ldp";

module.exports = {
  getWsServerAdminApi: () => { return adminApi;}
  , getWsServerLdpApi: () => { return ldpApi;}
  , getWsServerDbApi: () => { return dbApi;}
  , getWsServerLoginApi: () => { return adminApi + login;}
  , getWsServerResourcesApi: () => { return adminApi + resources;}
  , getWsServerDomainsApi: () => {return adminApi + adminDomains;}
  , getDbServerDropdownsApi: () => {return dbApi + dbDropdowns;}
  , getWsServerLiturgicalDayPropertiesApi: () => {return ldpApi + ldp;}
}