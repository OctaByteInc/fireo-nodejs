import "../utils/Prototypes.js";
import MetaModel from "./MetaModel.js";
import Manager from "../manager/Manager.js";
import { WrongInstanciate } from "./errors.js";
import Collection from "../manager/Collection.js";

/**
 * Model that holds all information about fields
 */
class Model {
  /**
   * initialize the model object and setup require things
   */
  static init() {
    const modelObject = new this();
    modelObject._setup();
    return modelObject;
  }

  /**
   * Setup method is require to save the fields information
   */
  _setup(config = { collectionName: undefined }) {
    // Model object only can perform operation if they are initialize
    // from init() method
    this._setupComplete = true;
    this._meta = new MetaModel(this, config);
  }

  /**
   * Instanciate manager and setup require things parseFields and
   * check setup is complete
   */
  _instanciateManager() {
    // Check if setup is not complete
    if (!this._setupComplete) {
      throw new WrongInstanciate(
        `Model ${this.constructor.name} is not initialize correctly. Instanciate model like this "${this.constructor.name}.init()" instead of "new ${this.constructor.name}()"`
      );
    }

    this._meta.parseFields(this);
    return new Manager(this._meta);
  }

  /**
   * Save model document into firestore
   */
  async save(merge = false) {
    const manager = this._instanciateManager();
    const docId = await manager.save(merge);
    this._meta.setDocId(this, docId);
  }

  /**
   * upsert model document into firestore
   */
  async upsert() {
    await this.save(true);
  }

  static get collection() {
    return new Collection(this);
  }
}

export default Model;
