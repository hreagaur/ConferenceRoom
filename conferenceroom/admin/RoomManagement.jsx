import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RoomManagement.css';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/api/room/getall')
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleAddRoom = () => {
    axios.post('http://localhost:8080/api/room/create', { conferenceName: newRoom })
      .then(response => {
        setRooms([...rooms, response.data]);
        setNewRoom('');
      })
      .catch(error => {
        console.error('Error adding room:', error);
      });
  };

  const handleDeleteRoom = (roomId) => {
    axios.delete(`http://localhost:8080/api/room/delete/${roomId}`)
      .then(() => {
        setRooms(prevRooms => prevRooms.filter(room => room.conferenceRoomId !== roomId));
      })
      .catch(error => {
        console.error('Error deleting room:', error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
  };

  return (
    <div className="room-management-page">
      <header className="admin-header">
        <h1>Book a Conference Room</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <div className="room-management-content">
        <h2 className="room-management-title">Room Management</h2>
        <div className="room-management-controls">
          <input
            type="text"
            value={newRoom}
            onChange={(e) => setNewRoom(e.target.value)}
            placeholder="Enter new room name"
            className="room-management-input"
          />
          <button onClick={handleAddRoom} className="room-management-add-button">Add Room</button>
        </div>
        <div className="room-management-rooms">
          {rooms.length > 0 ? (
            <div className="room-management-cards">
              {rooms.map((room) => (
                <div key={room.conferenceRoomId} className="room-management-card">
                  <h3 className="room-management-card-title">{room.conferenceName}</h3>
                  <button onClick={() => handleDeleteRoom(room.conferenceRoomId)} className="room-management-delete-button">Delete Room</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="room-management-no-rooms">No rooms available.</p>
          )}
        </div>
      </div>
      <footer className="register-footer">
        <p className="register-footer-text">&copy; 2024 Your Project. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RoomManagement;
