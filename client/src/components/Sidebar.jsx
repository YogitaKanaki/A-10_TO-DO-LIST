import React, { useState, useEffect } from 'react';
import '../styles/Sidebar.css';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 768);
  const [categoryInput, setCategoryInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState({ name: '', email: '' });

  // Get user info from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCategories(parsedUser.email); // Fetch categories for logged-in user
    }
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async (userEmail) => {
    try {
      const res = await fetch(`http://localhost:5010/api/categories/get?userEmail=${userEmail}`);
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      } else {
        console.error('Error fetching categories:', data.message);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Add category to database
  const handleAddCategory = async () => {
    if (categoryInput.trim() && user.email) {
      try {
        const res = await fetch('http://localhost:5010/api/categories/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryName: categoryInput.trim(),
            userEmail: user.email,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setCategories([...categories, data.category]); // Update categories list
          setCategoryInput(''); // Clear input field
        } else {
          console.error('Error adding category:', data.message);
        }
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };
  const handleDeleteCategory = async (categoryName) => {
    try {
      const res = await fetch('http://localhost:5010/api/categories/delete-category', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName, userEmail: user.email }),
      });
  
      const data = await res.json();
      if (res.ok) {
        // Remove deleted category from state
        setCategories(categories.filter((cat) => cat.name !== categoryName));
      } else {
        console.error('Error deleting category:', data.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    localStorage.setItem('selectedCategory', categoryName); // Store selected category
    window.location.href = '/add-task'; // Navigate to add-task page (or use useNavigate if using react-router)
  };
  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; // Redirect to login
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="hamburger" onClick={toggleSidebar}>☰</div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div>
          {/* Sidebar Header */}
          <div className="sidebar-header">
            
            <h1>Hello , </h1>
          </div>

          {/* User Info */}
          <div className="user-info">
            <strong>Welcome ,{user.username || 'User Name'}</strong>
            <div>email: {user.email || 'user@example.com'}</div>
          </div>

          {/* Add Category Section */}
          <div className="category-section">
            <input
              type="text"
              placeholder="Add category"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add Category</button>
            <ul className="category-list">
  {categories.map((cat, idx) => (
    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span onClick={() => handleCategoryClick(cat.name)} style={{ cursor: 'pointer' }}>
        • {cat.name}
      </span>
      <button
        onClick={() => handleDeleteCategory(cat.name)}
        style={{
          backgroundColor: '#ff4d4d',
          border: 'none',
          color: '#fff',
          borderRadius: '5px',
          padding: '5px 10px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Delete
      </button>
    </li>
  ))}
</ul>
         
          </div>
        </div>

        {/* Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}