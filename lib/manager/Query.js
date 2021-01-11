/**
 * Operate query functions for firestore
 */

class Query {
  /**
   * Query constructor
   * @constructor
   * @param {Model} modelCls - Model class
   * @param {Manager} manager - Manager to perform firestore operations
   */
  constructor(modelCls, manager) {
    this.modelCls = modelCls;
    this._model = modelCls.init();
    this._manager = manager;
  }

  getFieldDBName(name) {
    return this._model._meta.fields[name].getName;
  }

  /**
   * Filter query
   * @param {string} name - name of the field
   * @param {string} operator - valid operator ==, !=, > etc
   * @param {any} value - value to match
   */
  where(name, operator, value) {
    // Check if filter already exist, push new filter at the end
    // else add the filter
    if (this._filters) {
      this._filters.push({ name: this.getFieldDBName(name), operator, value });
    } else {
      this._filters = [{ name: this.getFieldDBName(name), operator, value }];
    }

    return this;
  }

  /**
   * Fetch query documents
   */
  async fetch() {
    const docs = await this._manager.fetch(this);
    const modelList = [];
    for (const doc of docs) {
      const model = this.modelCls.init();
      model._meta.constructModel(model, doc);
      modelList.push(model);
    }

    return modelList;
  }
}

export default Query;
