import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHome.css';

const UserHome = () => {
  const [bookings, setBookings] = useState([]);

  const userData = localStorage.getItem('userDetails');
  const user = JSON.parse(userData);
  const user_id = user.userId;

  const navigate = useNavigate();

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

  return (
    <div>
      <header className='userHead'>
        <h1>Conference Room Booking System</h1>
        <button onClick={() => navigate("/login")}>Logout</button>
      </header>
      <h2 className='nameadmin'>Welcome {user.name}  :)</h2>
      <div>
        <div className="button-container">
          <button onClick={() => navigate("/bookings")}>Book a Room</button>
        </div>
        {bookings.length > 0 ? (
          <div className="booking-cards">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <h3>{booking.conferenceRoom.conferenceName}</h3>
                <p><strong>Date:</strong> {new Date(booking.start).toLocaleDateString()}</p>
                <p><strong>Start Time:</strong> {new Date(booking.start).toLocaleTimeString()}</p>
                <p><strong>End Time:</strong> {new Date(booking.end).toLocaleTimeString()}</p>
                <button onClick={() => handleDelete(booking.id)}>Delete Booking</button>
              </div>
            ))}
          </div>
        ) : (
          <p>No bookings have been made.</p>
        )}
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
    
  );
};

export default UserHome;
