import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5010/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save user info

        alert('Login successful!');
        navigate('/dashboard');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Enter your credentials to log in to your account</p>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="form-links">
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit">Sign in</button>
        </form>

        <p className="signup-text">
          Don't have an account? <a href="/register " className="signup-link">Sign up</a>
        </p>
      </div>
    </div>
  );
}