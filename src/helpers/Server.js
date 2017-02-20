/**
 * Created by mac002 on 1/2/17.
 */

const adminApi = "/admin/api/v1/";
const dbApi = "/db/api/v1/";
const resources = "resources";
const login = "login";

module.exports = {
  getWsServerAdminApi: () => { return adminApi;}
  , getWsServerDbApi: () => { return dbApi;}
  , getWsServerLoginApi: () => { return adminApi + login;}
  , getWsServerResourcesApi: () => { return adminApi + resources;}
}