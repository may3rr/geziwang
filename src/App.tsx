import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import EventList from './components/EventList';
import CreateEvent from './components/CreateEvent';
import EventDetail from './components/EventDetail';
import Profile from './components/Profile';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app">
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={
            !isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/events" />
          } />
          <Route path="/register" element={
            !isLoggedIn ? <Register /> : <Navigate to="/events" />
          } />
          <Route path="/events" element={
            isLoggedIn ? <EventList /> : <Navigate to="/login" />
          } />
          <Route path="/events/create" element={
            isLoggedIn ? <CreateEvent /> : <Navigate to="/login" />
          } />
          <Route path="/events/:id" element={
            isLoggedIn ? <EventDetail /> : <Navigate to="/login" />
          } />
          <Route path="/profile" element={
            isLoggedIn ? <Profile /> : <Navigate to="/login" />
          } />
          <Route path="/" element={<Navigate to="/events" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;