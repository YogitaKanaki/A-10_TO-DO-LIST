import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/AddTask.css'; // Import the CSS file
import { FaSort } from 'react-icons/fa'; // Import the sorting icon

export default function AddTask() {
  const [tasks, setTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('value');
  const [userEmail, setUserEmail] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // Sorting by time (ascending/descending)
  const [sortByCompletion, setSortByCompletion] = useState(null); // Sorting by completion status

  useEffect(() => {
    const category = localStorage.getItem('selectedCategory');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setSelectedCategory(category);
    setUserEmail(storedUser?.email || '');
    if (category) {
      fetchTasks(category);
    }
  }, []);

  const fetchTasks = async (categoryName) => {
    try {
      const res = await fetch(`http://localhost:5010/api/tasks/by-category?category=${categoryName}`);
      const data = await res.json();
      if (res.ok) {
        setTasks(data.tasks);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async () => {
    if (!title || !selectedCategory || !userEmail || !priority)
      return alert('All fields are required!');

    try {
      const res = await fetch('http://localhost:5010/api/tasks/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category: selectedCategory,
          priority,
          userEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTasks([...tasks, data.task]);
        setTitle('');
        setDescription('');
        setPriority('');
      } else {
        alert('Error adding task');
      }
    } catch (error) {
      console.error('Add task error:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const res = await fetch(`http://localhost:5010/api/tasks/delete/${taskId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.filter(task => task._id !== taskId));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleCompleted = async (taskId, currentState) => {
    try {
      const res = await fetch(`http://localhost:5010/api/tasks/update-completed/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentState }),
      });

      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.map(task =>
          task._id === taskId ? { ...task, completed: !currentState } : task
        ));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Sort the tasks by time and completion status
  const sortedTasks = [...tasks]
    .sort((a, b) => {
      // First sort by completion status
      if (sortByCompletion !== null) {
        if (a.completed === sortByCompletion && b.completed !== sortByCompletion) {
          return -1;
        }
        if (a.completed !== sortByCompletion && b.completed === sortByCompletion) {
          return 1;
        }
      }
      
      // Then sort by creation time
      const timeA = new Date(a.createdAt);
      const timeB = new Date(b.createdAt);
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const toggleSortByCompletion = () => {
    setSortByCompletion(sortByCompletion === null ? true : (sortByCompletion === true ? false : null));
  };

  return (
    <div className="task-page">
      <Sidebar />
      <div className="task-container">
        <h2>Add Task in Category: {selectedCategory}</h2>

        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Important">Important</option>
          <option value="Medium">Medium</option>
          <option value="Lesser">Lesser</option>
        </select>

        <button onClick={handleAddTask}>Add Task</button>

        <div className="sort-buttons">
          <div className="sort-button" onClick={toggleSortOrder}>
            <FaSort /> Sort by Time ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </div>
          <div className="sort-button" onClick={toggleSortByCompletion}>
            <FaSort /> Sort by Completion ({sortByCompletion === null ? 'All' : sortByCompletion ? 'Completed' : 'Not Completed'})
          </div>
        </div>

        <h3>Existing Tasks</h3>
        <div className="task-list">
          {sortedTasks.map((task) => (
            <div
              className={`task-item ${task.completed ? 'completed' : ''}`}
              key={task._id}
            >
              <div className="task-header">
                {!task.completed && (
                  <input
                    type="checkbox"
                    onChange={() => handleToggleCompleted(task._id, task.completed)}
                  />
                )}
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>

              <div className="task-details">
                <p className="task-title">{task.title}</p>
                <p className="task-desc">{task.description}</p>
                <span className="task-priority">{task.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}