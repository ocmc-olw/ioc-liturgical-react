/**
 * Created by mac002 on 1/2/17.
 */

var getWsServer = () => {
  if (document.location.hostname === "localhost") {
    return document.location.protocol +  "//" + document.location.hostname + ":4567";
  } else {
    return "https://ioc-liturgical-ws.org";
  }
}

module.exports = {
  getWsServer: () => { return getWsServer();}
}
