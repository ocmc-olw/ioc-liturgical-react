/**
 *
 * Helper functions to parse a schematized response from
 * the REST API.  The response has not just the requested
 * data, but also schemas for each object and a uiSchema.
 * @type {object}
 */

let itemId = "";
let schema = {};
let uiSchema = {};
let value = {};

module.exports = {

  setItem: (data) => {
    itemId = data.values[0]._valueSchemaId;
    uiSchema = data.valueSchemas[itemId].uiSchema;
    schema = data.valueSchemas[itemId].schema;
    value =  data.values[0].value;
  }
  , getItemId: () => { return itemId;}
  , getSchema: () => { return schema;}
  , getUiSchema: () => { return uiSchema;}
  , getValue: () => { return value;}
  , getItemObject: () => {
    return {
        id: itemId
        , uiSchema: uiSchema
        , schema: schema
        , value: value
    }
  }
}
