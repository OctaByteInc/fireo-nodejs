import Database from "../database/Database.js";

/**
 * Operate Firestore operations
 */
class Manager {
  /**
   * Manager constructor
   * @constructor
   * @param {MetaModel} meta - object of MetaModel which hold all information about model
   */
  constructor(meta) {
    this.meta = meta;
  }

  get getDocId() {
    if (this.meta.docId) {
      return this.meta.docId;
    }

    const doc = Database.collection(this.meta.collectionName).doc();
    return doc.id;
  }

  async save() {
    const doc = Database.collection(this.meta.collectionName).doc(
      this.getDocId
    );
    //await doc.set(this.meta.fieldMapping);
    return doc.id;
  }
}

export default Manager;
