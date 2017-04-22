/**
 * Created by mac002 on 1/2/17.
 */

const adminApi = "/admin/api/v1/";
const dbApi = "/db/api/v1/";
const ldpApi = "/ldp/api/v1/";
const resources = "docs/new";
const version = "info";
const login = "login";
const links = "links";
const adminDomains = "misc/domains";
const dbDropdownsSearchText = "dropdowns/texts";
const dbDropdownDomains = "dropdowns/domains";
const dbDropdownsSearchRelationships = "dropdowns/relationships";
const ldp = "ldp";

module.exports = {
  getWsServerAdminApi: () => { return adminApi;}
  , getWsServerLdpApi: () => { return ldpApi;}
  , getWsServerDbApi: () => { return dbApi;}
  , getWsServerLoginApi: () => { return adminApi + login;}
  , getWsServerVersionApi: () => { return adminApi + version;}
  , getWsServerResourcesApi: () => { return dbApi + resources;}
  , getWsServerDomainsApi: () => {return adminApi + adminDomains;}
  , getDbServerDropdownsSearchTextApi: () => {return dbApi + dbDropdownsSearchText;}
  , getDbServerDropdownsSearchRelationshipsApi: () => {return dbApi + dbDropdownsSearchRelationships;}
  , getDbServerLinksApi: () => {return dbApi + links;}
  , getWsServerLiturgicalDayPropertiesApi: () => {return ldpApi + ldp;}
}