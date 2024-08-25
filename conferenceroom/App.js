import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Register from './Register/Register';
import UserHome from './components/UserHome';
import Booking from './components/Booking';
import BookingConfirmationPage from './components/BookingConfirmationPage'; 
import AdminDashboard from './admin/AdminDash';
import RoomManagement from './admin/RoomManagement';
import BookingManagement from './admin/BookingManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userHome" element={<UserHome/>} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admindashboard/rooms" element={<RoomManagement />} />
        <Route path="/admindashboard/bookings" element={<BookingManagement />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
