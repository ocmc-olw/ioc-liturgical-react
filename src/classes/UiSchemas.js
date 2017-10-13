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
    return this.formsSchemas[id].paths.put;
  }

  /**
   * Search the formsSchemas to find the id that starts with the name provided.
   * Returns the ID of that formSchema.
   * @param name
   */
  getSchemaIdForSchemaName = (name) => {
    return name + "1.1";
  }
}

export default UiSchemas;