// routes/category.js
const express = require('express');
const Category = require('../models/Category');
const router = express.Router();

// Add category for a user
router.post('/add', async (req, res) => {
  const { categoryName, userEmail } = req.body;

  if (!categoryName || !userEmail) {
    return res.status(400).json({ message: 'Category name and user email are required.' });
  }

  try {
    const newCategory = new Category({ name: categoryName, userEmail });
    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
});

// Get categories for a user by email
router.get('/get', async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'User email is required' });
  }

  try {
    const categories = await Category.find({ userEmail });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

module.exports = router;