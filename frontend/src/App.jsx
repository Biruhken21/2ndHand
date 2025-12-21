import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import ShareProductPage from '/src/pages/ShareProductPage.jsx';  
import Favorites from '/src/pages/Favorite.jsx';
import Notifications from '/src/pages/Notification.jsx';


function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
        <Route path="/product/:id" element={<ShareProductPage />} />
        <Route path="/favorites" element={isAuthenticated ? <Favorites /> : <Navigate to="/" />} />
        <Route path="/notifications" element={isAuthenticated ? <Notifications /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
