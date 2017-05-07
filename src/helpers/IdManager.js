/**
 * Created by mac002 on 1/2/17.
 */

const delimiter = "~";

module.exports = {
  getLibrary: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[0];
    } else {
      return undefined;
    }
  }
  , getTopic: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[1];
    } else {
      return undefined;
    }
  }
  , getKey: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[2];
    } else {
      return undefined;
    }
  }
  , toId: (library, topic, key) => {
    return library + delimiter + topic + delimiter + key;
  }
}