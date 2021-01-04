import assert from "assert";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { Field, Model } from "../index.js";
import { EmptyDocument, WrongInstanciate } from "../lib/model/errors.js";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("Model Tests", () => {
  it("Should not be empty document", async () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();

    await expect(user.save()).to.be.rejectedWith(EmptyDocument);
  });

  it("Save doc id back to model", async () => {
    class User extends Model {
      userId = Field.ID();
      name = Field.Text();
    }

    const user = User.init();
    user.name = "azeem";
    await user.save();

    chai.assert.isString(user.userId);
  });

  it("Save doc id back to model when no IDField exist", async () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();
    user.name = "azeem";
    await user.save();

    chai.assert.isString(user.id);
  });

  it("Check doc key also exist in model object after specific operations like save", async () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();
    user.name = "azeem";
    await user.save();

    chai.assert.isString(user.key);
  });

  it("Instanciate model without init()", async () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = new User();
    user.name = "azeem";

    await expect(user.save()).to.be.rejectedWith(WrongInstanciate);
  });
});
