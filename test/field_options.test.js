import assert from "assert";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Field, Model } from "../index.js";
import { RequiredField } from "../lib/fields/errors.js";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Field option test", () => {
  it("Default option", () => {
    class User extends Model {
      name = Field.Text({ default: "default_value_for_name" });
    }

    const user = User.init();
    user.save();
    assert.equal(user.name, "default_value_for_name");
  });

  it("Required option", async () => {
    class User extends Model {
      name = Field.Text({ required: true });
    }

    const user = User.init();

    await expect(user.save()).to.be.rejectedWith(RequiredField);
  });
});
