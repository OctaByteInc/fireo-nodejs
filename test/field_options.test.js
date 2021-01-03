import assert from "assert";
import { Field, Model } from "../index.js";
import { RequiredField } from "../lib/fields/errors.js";

describe("Field option test", () => {
  it("Default option", () => {
    class User extends Model {
      name = Field.Text({ default: "default_value_for_name" });

      constructor() {
        super();
        this.setup();
      }
    }

    const user = new User();
    user.save();
    assert.equal(user.name, "default_value_for_name");
  });

  it("Required option", () => {
    class User extends Model {
      name = Field.Text({ required: true });

      constructor() {
        super();
        this.setup();
      }
    }

    const user = new User();

    assert.throws(() => {
      user.save();
    }, RequiredField);
  });
});
