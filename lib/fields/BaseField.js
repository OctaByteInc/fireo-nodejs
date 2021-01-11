import { RequiredField } from "./errors.js";

/**
 * BaseField which should be extend every field
 */
class BaseField {
  /**
   * Each field available options
   * @constructor
   * @param {Object} options - Common options for each field
   */
  constructor(
    options = { required: false, default: undefined, name: undefined }
  ) {
    this.required = options.required;
    this.default = options.default;
    this.name = options.name;
  }

  /**
   * Setup initial (orignal) value to the field
   * @param {any} val - Any value which is initial value of field
   */
  initialVal(val) {
    this.val = val;
  }

  /**
   * Setup initial (orignal) name to the field
   * @param {string} name - Name which is initial name of field
   */
  setFieldName(name) {
    this.fieldName = name;
  }

  /**
   * Set name of Model
   */
  setModelName(name) {
    this.modelName = name;
  }

  get getName() {
    if (this.name) {
      return this.name;
    }
    return this.fieldName;
  }

  /**
   * Get value
   */
  get getValue() {
    let fv = this.fieldValue;

    // If field value is not giving then check default value
    if (fv === undefined) {
      if (this.default) {
        fv = this.default;
      }
    }

    // Check if field is required
    if (this.required && fv === undefined) {
      throw new RequiredField(
        `Field "${this.fieldName}" is required in Model "${this.modelName}", assign value or set default for "${this.fieldName}" field.`
      );
    }

    return fv;
  }

  /**
   * Field value
   */
  get fieldValue() {
    return this.val;
  }

  /**
   * Get db value
   */
  get getDBValue() {
    return this.val;
  }
}

export default BaseField;
