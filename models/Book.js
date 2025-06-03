const { getDatabase } = require('../config/mongo'); 
const { ObjectId } = require('mongodb');

const COLLECTION_NAME = 'books';

class Book {
  constructor(title, year, authorId, id = null) {
    this.title = title;
    this.year = year;
    if (ObjectId.isValid(authorId)) {
        this.authorId = new ObjectId(authorId); 
    } else {
        this.authorId = authorId; 
    }
    if (id) {
      this._id = new ObjectId(id);
    }
  }

  static async findAllWithAuthor() {
    const db = getDatabase();
    return await db.collection(COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: 'authors', 
          localField: 'authorId',
          foreignField: '_id',
          as: 'authorDetails' 
        }
      },
      {
        $unwind: { 
            path: "$authorDetails",
            preserveNullAndEmptyArrays: true 
        }
      },
      {
        $project: { 
            title: 1,
            year: 1,
            _id: 1,
            author: "$authorDetails" 
        }
      }
    ]).toArray();
  }

  async save() {
    const db = getDatabase();
    
    if (this.authorId && !(this.authorId instanceof ObjectId) && ObjectId.isValid(this.authorId)) {
        this.authorId = new ObjectId(this.authorId);
    } else if (!ObjectId.isValid(this.authorId)){
        throw new Error("Invalid authorId for saving book");
    }

    const result = await db.collection(COLLECTION_NAME).insertOne({
      title: this.title,
      year: this.year,
      authorId: this.authorId
    });
    this._id = result.insertedId;
    return this; 
  }

  static async findById(id) {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) {
        return null;
    }
    return await db.collection(COLLECTION_NAME).findOne({ _id: new ObjectId(id) });
  }

  static async deleteById(id) {
    const db = getDatabase();
    if (!ObjectId.isValid(id)) {
        return { deletedCount: 0 }; 
    }
    const result = await db.collection(COLLECTION_NAME).deleteOne({ _id: new ObjectId(id) });
    return result; 
  }
}

module.exports = Book;