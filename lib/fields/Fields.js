import TextField from "./TextField.js";

/**
 * All fields which are available in FireO
 */
class Field {
  static Text(
    options = { required: undefined, default: undefined, name: undefined }
  ) {
    return new TextField(options);
  }
}

export default Field;
