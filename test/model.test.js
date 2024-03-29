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

  it("Save and get model", async () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();
    user.name = "azeem";
    await user.save();

    const doc = await User.collection.get(user.key);

    assert.equal(doc.name, user.name);
    chai.assert.isString(doc.id);
  });

  it("Filter document by where clause", async () => {
    class FilterWhereClause extends Model {
      name = Field.Text();
    }

    const u1 = FilterWhereClause.init();
    u1.name = "test-filter-clause";
    await u1.save();

    const u2 = FilterWhereClause.init();
    u2.name = "test-filter-clause";
    await u2.save();

    const docs = await FilterWhereClause.collection
      .where("name", "==", "test-filter-clause")
      .fetch();
    for (const doc of docs) {
      assert.equal(doc.name, "test-filter-clause");
    }
  });

  it("Filter document by where clause with changed db name", async () => {
    class FilterWhereClauseChangedName extends Model {
      name = Field.Text({ name: "customName" });
    }

    const u1 = FilterWhereClauseChangedName.init();
    u1.name = "test-filter-clause-changed-name";
    await u1.save();

    const u2 = FilterWhereClauseChangedName.init();
    u2.name = "test-filter-clause-changed-name";
    await u2.save();

    const docs = await FilterWhereClauseChangedName.collection
      .where("name", "==", "test-filter-clause-changed-name")
      .fetch();
    for (const doc of docs) {
      assert.equal(doc.name, "test-filter-clause-changed-name");
    }
  });

  it("Upsert document without document creation", async () => {
    class UpsertModel extends Model {
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpsertModel.init();
    d1.name = "azeem";
    await d1.upsert();

    const doc = await UpsertModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
  });

  it("Upsert document with doc already exist", async () => {
    class UpsertModel extends Model {
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpsertModel.init();
    d1.name = "azeem";
    await d1.upsert();

    d1.address = "user-address";
    await d1.upsert();

    const doc = await UpsertModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
    assert.equal(doc.address, "user-address");
  });

  it("Update Model with same model object", async () => {
    class UpdateModel extends Model {
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpdateModel.init();
    d1.name = "azeem";
    d1.address = "user-address";
    await d1.save();

    d1.address = "address-updated";
    await d1.update();

    const doc = await UpdateModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
    assert.equal(doc.address, "address-updated");
  });

  it("Update Model with key", async () => {
    class UpdateModel extends Model {
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpdateModel.init();
    d1.name = "azeem";
    d1.address = "user-address";
    await d1.save();

    const d2 = UpdateModel.init();
    d2.address = "address-changed";
    await d2.update(d1.key);

    const doc = await UpdateModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
    assert.equal(doc.address, "address-changed");
  });

  it("Update Model with already defined IDField and same object", async () => {
    class UpdateModel extends Model {
      id = Field.ID();
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpdateModel.init();
    d1.id = "custom-id";
    d1.name = "azeem";
    d1.address = "user-address";
    await d1.save();

    d1.address = "address-changed";
    await d1.update();

    const doc = await UpdateModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
    assert.equal(doc.address, "address-changed");
  });

  it("Update Model with already defined IDField and key", async () => {
    class UpdateModel extends Model {
      id = Field.ID();
      name = Field.Text();
      address = Field.Text();
    }

    const d1 = UpdateModel.init();
    d1.id = "custom-doc-id";
    d1.name = "azeem";
    d1.address = "user-address";
    await d1.save();

    const d2 = UpdateModel.init();
    d2.address = "address-changed";
    await d2.update(d1.key);

    const doc = await UpdateModel.collection.get(d1.key);
    assert.equal(doc.name, "azeem");
    assert.equal(doc.address, "address-changed");
  });
});
