import Manager from "./Manager.js";
import Query from "./Query.js";

/**
 * Perform manager operation those are statically access ie. get()
 */
class Collection {
  /**
   * Collection constructor
   * @constructor
   * @param {Model} modelCls - Model class
   */
  constructor(modelCls) {
    this.modelCls = modelCls;
    this._model = modelCls.init();
    this._manager = new Manager(this._model._meta);
  }

  /**
   * Get document from firestore
   * @param {string} key - Document key
   * @returns firestore doc
   */
  async get(key) {
    const document = await this._manager.get(key);
    this._model._meta.constructModel(this._model, document);
    return this._model;
  }

  /**
   * Filter query
   * @param {string} name - name of the field
   * @param {string} operator - valid operator ==, !=, > etc
   * @param {any} value - value to match
   */
  where(name, operator, value) {
    const query = new Query(this.modelCls, this._manager);
    return query.where(name, operator, value);
  }
}

export default Collection;
