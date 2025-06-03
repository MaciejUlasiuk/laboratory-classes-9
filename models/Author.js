const { getDatabase } = require('../config/mongo'); 
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'authors';

class Author {
  constructor(firstName, lastName, id = null) {
    this.firstName = firstName;
    this.lastName = lastName;
    if (id) {
      this._id = new ObjectId(id);
    }
  }

  static async findAll() {
    const db = getDatabase();
    return await db.collection(COLLECTION_NAME).find().toArray();
  }

  static async findById(id) {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async updateById(id, updateData) {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) {
        return null;
    }
    const { _id, ...dataToUpdate } = updateData;

    const result = await db.collection(COLLECTION_NAME).updateOne(
      { _id: new ObjectId(id) },
      { $set: dataToUpdate }
    );
    if (result.matchedCount === 0) {
      return null;
    }
    return await this.findById(id); 
  }

  async save() {
    const db = getDatabase();
    const result = await db.collection(COLLECTION_NAME).insertOne({
        firstName: this.firstName,
        lastName: this.lastName
    });
    this._id = result.insertedId;
    return this;
  }
}

module.exports = Author;