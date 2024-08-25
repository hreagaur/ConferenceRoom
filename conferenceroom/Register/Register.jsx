import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css'; // Import the updated CSS

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/company/getall');
        setCompanies(response.data);
      } catch (err) {
        setError('Failed to load companies');
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword || !companyId) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    const payload = {
      name,
      email,
      password,
      role: { 
        roleId: 2,
      },
      company: {
        id: parseInt(companyId, 10),
      },
    };

    try {
      const response = await axios.post('http://localhost:8080/api/user/create', payload);

      if (response.status === 200) {
        setSuccess('Registration successful');
        navigate("/login");
      } else {
        setError('Registration failed: ' + response.statusText);
      }
    } catch (err) {
      setError('Registration failed: ' + (err.response ? err.response.data : err.message));
    }
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <h1 className="register-header-title">
          Book a Conference Room
        </h1>
      </header>
      <div className="register-container">
        <h1 className="register-title">Register</h1>
        {error && <p className="register-error-message">{error}</p>}
        {success && <p className="register-success-message">{success}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <label className="register-form-label">
            Name:
            <input 
              type="text" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              className="register-input-field"
            />
          </label>
          <label className="register-form-label">
            Email:
            <input 
              type="email" 
              value={email} 
              onChange={(event) => setEmail(event.target.value)} 
              className="register-input-field"
            />
          </label>
          <label className="register-form-label">
            Password:
            <input 
              type="password" 
              value={password} 
              onChange={(event) => setPassword(event.target.value)} 
              className="register-input-field"
            />
          </label>
          <label className="register-form-label">
            Confirm Password:
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(event) => setConfirmPassword(event.target.value)} 
              className="register-input-field"
            />
          </label>
          <label className="register-form-label">
            Company:
            <select value={companyId} onChange={(event) => setCompanyId(event.target.value)} className="register-select-field">
              <option value="">Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="register-submit-button">Register</button>
        </form>
        <p className="register-login-link">
          Already have an account? <Link to="/login" className="register-link">Login</Link>
        </p>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Register;
