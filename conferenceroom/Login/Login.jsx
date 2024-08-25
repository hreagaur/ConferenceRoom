import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    setError('');
    
    const payload = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', payload);
      if (response.status === 200) {
        
        localStorage.setItem('userDetails', JSON.stringify(response.data));
        console.log(response.data);
        console.log("response", response);

        setSuccess('Login successful');
        console.log(response.data.role.roleId);
        
        const roleId = response.data.role.roleId;
        
        if (roleId === 1) {
          navigate('/admindashboard');
        } else {
          navigate('/userHome');
        }
      } else {
        setError('Login failed');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
      console.error('Login error details:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div>
      <header className="register-header">
        <h1 className="register-header-title">
          Book a Conference Room
        </h1>
      </header>
      <div className="container">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label className="form-label">
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(event) => setEmail(event.target.value)} 
              className="input-field"
            />
          </label>
          <label className="form-label">
            Password:
            <input 
              type="password" 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              className="input-field"
            />
          </label>
          <button type="submit" className="submit-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="register-link">
          Don't have an account? <Link to="/register" className="link">Register</Link>
        </p>
      </div>
      <footer className="footer">
        <p className="footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Login;
