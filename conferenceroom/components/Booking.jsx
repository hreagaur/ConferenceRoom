import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isRoomSelected, setIsRoomSelected] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const userData = localStorage.getItem('userDetails');
  const user = JSON.parse(userData);
  const user_id = user.userId;

  useEffect(() => {
    axios.get('http://localhost:8080/api/room/getall')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });

    axios.get('http://localhost:8080/api/booking/getall')
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
  }, []);

  const validateInput = () => {
    if (!selectedRoom || !selectedDate || !startTime || !endTime) {
      alert('Please fill out all fields.');
      return false;
    }
    if (endTime <= startTime) {
      alert('End time must be after start time.');
      return false;
    }
    return true;
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    if (!validateInput()) return;

    const room = rooms.find(r => r.conferenceRoomId === selectedRoom);
    const confirmationMessage = `
      Please confirm your booking:
      Date: ${selectedDate}
      Start Time: ${startTime}
      End Time: ${endTime}
      Room: ${room ? room.conferenceName : 'Not Found'}
    `;

    if (window.confirm(confirmationMessage)) {
      const payload = {
        user: {
          userId: user_id
        },
        conferenceRoom: {
          conferenceRoomId: selectedRoom
        },
        start: `${selectedDate}T${startTime}`,
        end: `${selectedDate}T${endTime}`,
      };

      axios.post('http://localhost:8080/api/booking/create', payload)
        .then(response => {
          if (response.data === false) {
            alert("Cannot book a room for a past date and time");
          } else {
            navigate('/booking-confirmation', { state: { data: payload, rooms } });
          }
        })
        .catch(error => {
          console.error('Booking failed:', error);
          alert('Booking failed. Please try again.');
        });
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room.conferenceRoomId);
    setIsRoomSelected(true);
  };

  const getAvailableRooms = () => {
    const availableRooms = rooms.filter(room => {
      const bookingsForRoom = bookings.filter(booking => booking.conferenceRoom.conferenceRoomId === room.conferenceRoomId);
      const overlappingBookings = bookingsForRoom.filter(booking => {
        const bookingStartTime = new Date(booking.start).getTime();
        const bookingEndTime = new Date(booking.end).getTime();
        const selectedStartTime = new Date(`${selectedDate}T${startTime}`).getTime();
        const selectedEndTime = new Date(`${selectedDate}T${endTime}`).getTime();
        return (selectedStartTime >= bookingStartTime && selectedStartTime < bookingEndTime) ||
               (selectedEndTime > bookingStartTime && selectedEndTime <= bookingEndTime) ||
               (selectedStartTime <= bookingStartTime && selectedEndTime >= bookingEndTime);
      });
      return overlappingBookings.length === 0;
    });
    return availableRooms;
  };

  return (
    <div className="booking-page">
      <header className="admin-header">
        <h1>Book a Conference Room</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="booking-content">
        <div className="booking-form-container">
          <h2 className="booking-form-title">Booking Details</h2>
          <form className="booking-form" onSubmit={handleBookingSubmit}>
            <label className="booking-form-label">
              Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="booking-input"
              />
            </label>
            <label className="booking-form-label">
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="booking-input"
              />
            </label>
            <label className="booking-form-label">
              End Time:
              <input
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="booking-input"
              />
            </label>
            {isRoomSelected && (
              <button type="submit" className="booking-submit-button">Book</button>
            )}
          </form>
        </div>

        <div className="rooms-container">
          <h2 className="rooms-header">Select your room</h2>
          <p>Available rooms: {getAvailableRooms().length}</p>
          <div className="rooms-grid">
            {getAvailableRooms().map((room) => (
              <div
                key={room.conferenceRoomId}
                onClick={() => handleRoomSelect(room)}
                className={`room-card ${room.conferenceRoomId === selectedRoom ? 'selected' : ''}`}
              >
                <h3 className="room-card-title">{room.conferenceName}</h3>
                <p className="room-card-location">Location: {room.conferenceName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Booking;
