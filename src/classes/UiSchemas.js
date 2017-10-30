/**
 * UiSchemas
 * Provides a container for globally available
 * schema information for the rendering
 * and editing of forms.
 *
 * A form has a schema for its data.
 * It also has a uiSchema, that describes
 * the components to present the form as
 * a user interface.
 */
class UiSchemas {
  constructor(
      formsDropdown
      , formsSchemas
      , forms
  ) {
    this.formsDropdown = formsDropdown;
    this.formsSchemas = formsSchemas;
    this.forms = forms;
  };

  getFormsDropdown = () => {
    return this.formsDropdown;
  }

  /**
   * Get the schema whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getSchema = (id) => {
    return this.formsSchemas[id].schema;
  }

  /**
   * Get the uiSchema whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getUiSchema = (id) => {
    return this.formsSchemas[id].uiSchema;
  }

  /**
   * Get the formsSchema whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getSchema = (id) => {
    return this.formsSchemas[id].schema;
  }

  /**
   * Get the form whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getForm = (id) => {
    return this.forms[id];
  }

  /**
   * Get the HTTP GET path for the form whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getHttpGetPathForSchema = (id) => {
    return this.formsSchemas[id].paths.get;
  }
  /**
   * Get the HTTP POST path for the form whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getHttpPostPathForSchema = (id) => {
    return this.formsSchemas[id].paths.post;
  }
  /**
   * Get the HTTP PUT path for the form whose id matches the parameter
   * @param id
   * @returns {*}
   */
  getHttpPutPathForSchema = (id) => {
    let schemaId = id;
    if (this.formsSchemas[id]) {
      // ignore
    } else {
      schemaId = this.getCreateSchemaIdForSchemaId(id);
    }
    if (this.formsSchemas[schemaId]) {
      return this.formsSchemas[schemaId].paths.put;
    } else {
      console.log(`UiSchemas.getHttpPutPathForSchema.schemaId ${schemaId} not found`);
      console.table(this.formsSchemas);
    }
  }

  getPropsForSchema = (id, exclusions) => {
    var keys = [];
    for (var key in this.formsSchemas[id].schema.properties) {
      if (exclusions.includes(key)) {
        // skip
      } else {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * Uses the supplied ID to convert it to its
   * corresponding CreateForm
   * @param id
   * @returns {*}
   */
  getCreateSchemaIdForSchemaId = (id) => {
    let name = id;
    let parts = id.split(":");
    if (parts.length === 2) {
      if (! name.endsWith("CreateForm")) {
        name = parts[0] + "CreateForm";
      }
      name = name + ":1.1";
    }
    return name;
  }

  /**
   * Uses the supplied ID to convert it to its
   * corresponding LinkRefersTo...CreateForm
   * @param id
   * @returns {*}
   */
  getLinkCreateSchemaIdForSchemaId = (id) => {
    let name = id;
    let parts = id.split(":");
    if (parts.length === 2) {
      if (parts[0] === "TextBiblical") {
        name = "LinkRefersToBiblicalTextCreateForm";
      } else {
        name = "LinkRefersTo" + parts[0];
        if (! name.endsWith("CreateForm")) {
          name = name + "CreateForm";
        }
      }
      name = name + ":1.1";
    }
    return name;
  }
}

export default UiSchemas;