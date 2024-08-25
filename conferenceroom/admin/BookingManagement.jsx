import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookingManagement.css';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/booking/getall')
    .then(response => {
        setBookings(response.data);
      })
    .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const handleReject = (bookingId) => {
    setError('');
    setSuccess('');
  
    axios.delete(`http://localhost:8080/api/booking/${bookingId}`)
    .then(() => {
        axios.get('http://localhost:8080/api/booking/getall')
        .then(response => {
            setBookings(response.data);
            setSuccess('Booking deleted succesfully...');
          })
        .catch(error => {
            console.error('Error fetching updated bookings:', error);
            setError('Error in deleting');
          });
      })
    .catch(error => {
        console.error('Error deleting booking:', error);
        setError('Error in deleting');
        alert('Failed to reject the booking. Please try again.');
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
          <h2>Booking Management</h2>
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="booking-management">
          <table className="booking-management-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.user.name}</td>
                  <td>{booking.conferenceRoom.conferenceName}</td>
                  <td>{new Date(booking.start).toLocaleDateString()}</td>
                  <td>{new Date(booking.start).toLocaleTimeString()}</td>
                  <td>{new Date(booking.end).toLocaleTimeString()}</td>
                  <td>
                    <button onClick={() => handleReject(booking.id)} className="reject-button">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingManagement;
