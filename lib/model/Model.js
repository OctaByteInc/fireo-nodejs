import "../utils/ArrayPrototypes.js";
import MetaModel from "./MetaModel.js";
import Database from "../database/Database.js";

/**
 * Model that holds all information about fields
 */
class Model {
  /**
   * Setup method is require to save the fields information
   */
  setup() {
    this._meta = new MetaModel(this);
  }

  /**
   * Save model document into firestore
   */
  async save() {
    const res = await Database.collection("city").doc("LA").set({
      name: "something",
    });
    console.log(res);
  }
}

export default Model;
