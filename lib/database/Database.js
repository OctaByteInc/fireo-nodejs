import FirestorePkg from "@google-cloud/firestore";
const { Firestore } = FirestorePkg;

class Database {
  constructor() {
    this.connection;
  }

  get conn() {
    if (!this.connection) {
      this.connection = new Firestore();
    }

    return this.connection;
  }
}

export default new Database().conn;
