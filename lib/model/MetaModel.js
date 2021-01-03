import BaseField from "../fields/BaseField.js";
import { getModelProperties } from "../utils/ModelUtils.js";

/**
 * Meta information about model i.e fields and properties etc
 * @constructor
 * @param {Model} model - Model object
 */
class MetaModel {
  constructor(model) {
    this.setupFields(model);
  }

  /**
   * Get information about model fields i.e TextField, NumberField etc
   * @param {Model} model - Model object
   */
  setupFields(model) {
    const properties = getModelProperties(model);
    const fields = {};
    for (const propertyName of properties) {
      const propertyField = model[propertyName];
      propertyField.setFieldName(propertyName);
      propertyField.setModelName(model.constructor.name);
      fields[propertyName] = propertyField;
    }

    this.fields = fields;
  }

  /**
   * Parse model object properties into field mapping
   * get values from their fields
   * @param {Model} model - Model object
   */
  parseFields(model) {
    const fieldMapping = {};
    const properties = getModelProperties(model);
    for (const propertyName of properties) {
      const val = model[propertyName];

      // Get property field
      const field = this.fields[propertyName];

      // Check if there is any initial value
      if (!(val instanceof BaseField)) {
        field.initialVal(val);
      }

      // Ignore those values which are undefiend
      const fieldValue = field.getValue;
      if (fieldValue) {
        fieldMapping[field.getName] = fieldValue;

        // Assign model to these field values ie. default values
        model[propertyName] = fieldValue;
      }
    }

    return fieldMapping;
  }
}

export default MetaModel;
