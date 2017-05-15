/**
 * Created by mac002 on 1/2/17.
 */

const delimiter = "~";

module.exports = {
  // splits the id into an object with its three parts: library, topic, key
  getParts: (id) => {
    let IdParts = {}
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      IdParts = {
        library: parts[0]
        , topic: parts[1]
        , key: parts[2]
      };
    } else {
      IdParts = undefined;
    }
      return IdParts;
    }
  // extracts the library part of an ID
  , getLibrary: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[0];
    } else {
      return undefined;
    }
  }
  // extracts the topic part of an ID
  , getTopic: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[1];
    } else {
      return undefined;
    }
  }
  // extracts the key part of an ID
  , getKey: (id) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return parts[2];
    } else {
      return undefined;
    }
  }
  // creates an ID from the parameters.
  , toId: (library, topic, key) => {
    return library + delimiter + topic + delimiter + key;
  }
  , replaceLibrary: (id, newLibrary) => {
    let parts = id.split(delimiter);
    if (parts.length === 3) {
      return newLibrary + delimiter + parts[1] + delimiter + parts[2];
    } else {
      return undefined;
    }
  }
}