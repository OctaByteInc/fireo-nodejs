import IDField from "./IDField.js";
import TextField from "./TextField.js";

/**
 * All fields which are available in FireO
 */
class Field {
  static ID() {
    return new IDField();
  }

  static Text(
    options = { required: undefined, default: undefined, name: undefined }
  ) {
    return new TextField(options);
  }
}

export default Field;
