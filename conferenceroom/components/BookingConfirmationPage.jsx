import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirm.css';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, rooms } = location.state || {};

  const userData = JSON.parse(localStorage.getItem('userDetails'));
  const isAdmin = userData.role.roleId === 1;
  
  const roomName = rooms.find(room => room.conferenceRoomId === data.conferenceRoom.conferenceRoomId)?.conferenceName;

  const startDate = new Date(data.start);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="booking-confirmation-page">
      <header className="booking-confirmation-header">
        <h1 className="booking-confirmation-title">
          Book a Conference Room
        </h1>
        <button onClick={handleLogout} className="booking-confirmation-logout">Logout</button>
      </header>
      <div className="booking-confirmation-card">
        <h1>Booking Confirmation</h1>
        <div className="booking-confirmation-content">
          <p><strong>Username:</strong> {userData.name}</p>
          <p><strong>Conference Room:</strong> {roomName}</p>
          <p><strong>Company Name:</strong> {userData.company.name}</p>
          <p><strong>Date:</strong> {startDate.toLocaleDateString()}</p>
          <p><strong>Start Time:</strong> {startDate.toLocaleTimeString()}</p>
          <p><strong>End Time:</strong> {new Date(data.end).toLocaleTimeString()}</p>
          <button onClick={() => navigate(isAdmin ? "/admindashboard" : "/userHome")}>Home</button>
        </div>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BookingConfirmationPage;
