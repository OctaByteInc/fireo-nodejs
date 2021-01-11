import Database from "../database/Database.js";
import { DocumentNotFound } from "./errors.js";

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

  /**
   * Get document id if user defined any id otherwise generate
   * new document from firestore and return
   * @return document id
   */
  get getDocId() {
    if (this.meta.docId) {
      return this.meta.docId;
    }

    const doc = Database.collection(this.meta.collectionName).doc();
    return doc.id;
  }

  /**
   * save document in firestore
   */
  async save() {
    const doc = Database.collection(this.meta.collectionName).doc(
      this.getDocId
    );
    await doc.set(this.meta.fieldMapping);
    return doc.id;
  }

  /**
   * Get document from firestore
   * @param {string} key - document key
   */
  async get(key) {
    const doc = await Database.doc(key).get();
    if (!doc.exists) {
      throw new DocumentNotFound(`No Document Found against "${key}" key`);
    }
    return {
      id: doc.id,
      data: doc.data(),
    };
  }

  /**
   * Fetch query documents
   * @param {Query} query - Document query
   */
  async fetch(query) {
    let ref = Database.collection(this.meta.collectionName);

    // Check query has any filter
    if (query._filters) {
      for (const filter of query._filters) {
        ref = ref.where(filter.name, filter.operator, filter.value);
      }
    }

    const docs = await ref.get();
    if (docs.empty) {
      throw new DocumentNotFound(`No Document Found against this query`);
    }

    const docList = [];

    docs.forEach((doc) => {
      docList.push({ id: doc.id, data: doc.data() });
    });

    return docList;
  }
}

export default Manager;
