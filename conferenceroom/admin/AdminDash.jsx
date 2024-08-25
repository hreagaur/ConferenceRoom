import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDash.css';

const AdminDash = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const userData = localStorage.getItem('userDetails');
  const user = JSON.parse(userData);
  const user_id = user.userId;

  useEffect(() => {
    axios.get(`http://localhost:8080/api/booking/${user_id}`)
    .then(response => {
        setBookings(response.data);
      })
    .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, [user_id]);

  const handleDelete = (bookingId) => {
    axios.delete(`http://localhost:8080/api/booking/${bookingId}`)
    .then(() => {
        setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
      })
    .catch(error => {
        console.error('Error deleting booking:', error);
      });
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div>
      <header className="admin-header">
        <h1>Book a Conference Room</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-header">
          <h2 className='nameadmin'>Welcome, {user.name} :)</h2>
            <main className="admin-dashboard-main">
              <p>Please choose an option from the menu.</p>
            </main>
          <nav>
            <ul className="admin-nav">
              <li><Link to="/admindashboard/rooms" className="nav-button">Room Management</Link></li>
              <li><Link to="/admindashboard/bookings" className="nav-button">Booking Management</Link></li>
              <li><Link to="/bookings" className="nav-button">Book a Room</Link></li>
            </ul>
          </nav>
        </div>
       
        <div className="booking-cards">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <h3>{booking.conferenceRoom.conferenceName}</h3>
              <p><strong>Date:</strong> {new Date(booking.start).toLocaleDateString()}</p>
              <p><strong>Start Time:</strong> {new Date(booking.start).toLocaleTimeString()}</p>
              <p><strong>End Time:</strong> {new Date(booking.end).toLocaleTimeString()}</p>
              <button onClick={() => handleDelete(booking.id)} className="delete-button">Delete Booking</button>
            </div>
          ))}
        </div>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminDash;
