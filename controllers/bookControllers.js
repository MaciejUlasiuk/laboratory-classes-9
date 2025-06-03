const Book = require('../models/Book');
const Author = require('../models/Author'); 
const { ObjectId } = require('mongodb');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.findAllWithAuthor();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error in getAllBooks:", error);
    res.status(500).json({ message: "Failed to retrieve books", error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    const { title, year, author: authorId } = req.body; 

    if (!title || !year || !authorId) {
      return res.status(400).json({ message: 'Title, year, and author ID are required.' });
    }
    if (!ObjectId.isValid(authorId)) {
        return res.status(400).json({ message: 'Invalid Author ID format.' });
    }

    const authorExists = await Author.findById(authorId);
    if (!authorExists) {
      return res.status(400).json({ message: 'Author with the provided ID does not exist.' });
    }

    const newBook = new Book(title, year, authorId);
    await newBook.save();

    const booksWithAuthor = await Book.findAllWithAuthor();
    const createdBookWithAuthor = booksWithAuthor.find(b => b._id.equals(newBook._id));


    res.status(201).json(createdBookWithAuthor || newBook); 
  } catch (error) {
    console.error("Error in createBook:", error);
    res.status(500).json({ message: "Failed to create book", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Book ID format' });
    }

    const result = await Book.deleteById(id);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteBook:", error);
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};