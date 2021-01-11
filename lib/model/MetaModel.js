import BaseField from "../fields/BaseField.js";
import IDField from "../fields/IDField.js";
import { isEmptyObject } from "../utils/common.js";
import { getModelProperties } from "../utils/ModelUtils.js";
import { EmptyDocument } from "./errors.js";

/**
 * Meta information about model i.e fields and properties etc
 */
class MetaModel {
  /**
   * MetaModel constructor
   * @constructor
   * @param {Model} model - Model object
   * @param {Object} config - Model configuration
   */
  constructor(model, config) {
    this.setupFields(model);

    this.modelName = model.constructor.name;

    // Set collection name
    if (config.collectionName) {
      this.collectionName = config.collectionName;
    } else {
      this.collectionName = model.constructor.name;
    }
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

      // Ignore properties which are not part of Fields
      if (!field) {
        continue;
      }

      // Check if it is IDField
      if (field instanceof IDField) {
        // Save model id field for later user
        // for example when setting doc id
        this.modelIdField = propertyName;

        // Check if value set
        if (!(val instanceof IDField) && val) {
          this.docId = val;
        }

        continue;
      }

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

    if (isEmptyObject(fieldMapping)) {
      throw new EmptyDocument(
        `Can not perform any opertaion on empty document, ${this.modelName} Model is Empty`
      );
    }
    this.fieldMapping = fieldMapping;
  }

  /**
   * construct model to create new object
   * @param {Model} model - Model object
   * @param {Object} document - Document data from firestore include doc id
   */
  constructModel(model, document) {
    const docId = document.id;
    const docData = document.data;

    for (const [propertyName, field] of Object.entries(this.fields)) {
      // Check if it is IDField
      if (field instanceof IDField) {
        // Save model id field for later user
        // for example when setting doc id
        this.modelIdField = propertyName;

        continue;
      }

      // Get value from firestore document
      const propertyValue = docData[field.getName];

      // Set initial value for field
      field.initialVal(propertyValue);

      // Get db value from field
      const fieldValue = field.getDBValue;
      model[propertyName] = fieldValue;
    }

    // Set doc id and key
    this.setDocId(model, docId);
  }

  /**
   * Set document id and key in model object
   * @param {Model} model - Model object
   * @param {string} id - Document string id
   */
  setDocId(model, id) {
    if (this.modelIdField) {
      model[this.modelIdField] = id;
    } else {
      model.id = id;
    }

    // Set document key
    this.setDocKey(model, id);
  }

  /**
   * Set document key in model object
   * @param {Model} model - Model object
   * @param {string} id - Document string id
   */
  setDocKey(model, id) {
    model.key = this.collectionName + "/" + id;
  }
}

export default MetaModel;
