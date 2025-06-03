const Author = require('../models/Author');
const { ObjectId } = require('mongodb');

exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.status(200).json(authors);
  } catch (error) {
    console.error("Error in getAllAuthors:", error);
    res.status(500).json({ message: "Failed to retrieve authors", error: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Author ID format' });
    }
    if (!firstName && !lastName) {
        return res.status(400).json({ message: "At least one field (firstName or lastName) is required for update." });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;

    const updatedAuthor = await Author.updateById(id, updateData);

    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error("Error in updateAuthor:", error);
    res.status(500).json({ message: "Failed to update author", error: error.message });
  }
};