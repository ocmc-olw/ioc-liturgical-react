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
const docs = "docs";
const ontology = "ontology/ontology";
const adminDomains = "misc/domains";
const dbDropdownsSearchText = "dropdowns/texts";
const dbDropdownsSearchOntology = "dropdowns/ontology";
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
  , getDbServerDropdownsSearchOntologyApi: () => {return dbApi + dbDropdownsSearchOntology;}
  , getDbServerDropdownsSearchRelationshipsApi: () => {return dbApi + dbDropdownsSearchRelationships;}
  , getDbServerDocsApi: () => {return dbApi + docs;}
  , getDbServerLinksApi: () => {return dbApi + links;}
  , getDbServerOntologyApi: () => {return dbApi + ontology;}
  , getWsServerLiturgicalDayPropertiesApi: () => {return ldpApi + ldp;}
}