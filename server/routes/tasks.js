// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Route to add a task
router.post('/add', async (req, res) => {
    const { title, description, category, userEmail } = req.body;
  
    if (!title || !category || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const newTask = new Task({ title, description, category, userEmail });
      await newTask.save();
      res.status(201).json({ message: 'Task added', task: newTask });
    } catch (error) {
      console.error('Error saving task:', error);
      res.status(500).json({ message: 'Failed to add task' });
    }
  });
  
// GET: Tasks by Category
router.get('/by-category', async (req, res) => {
  const { category } = req.query;
  try {
    const tasks = await Task.find({ category });
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

router.put('/update-completed/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );
    res.status(200).json({ task: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// DELETE category route
router.delete('/delete-category', async (req, res) => {
  const { categoryName, userEmail } = req.body;

  try {
    // Find and delete the category for the given userEmail and categoryName
    const deletedCategory = await Category.findOneAndDelete({
      name: categoryName,
      userEmail: userEmail,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found or user not authorized.' });
    }

    res.status(200).json({
      message: 'Category deleted successfully',
      deletedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while deleting category', error });
  }
});


module.exports = router;