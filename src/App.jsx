import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleRegister from './pages/VehicleRegister';
import EventManager from './pages/EventManager';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vehicle" element={<VehicleRegister />} />
      <Route path="/event" element={<EventManager />} />
    </Routes>
  </Router>
);

export default App;
