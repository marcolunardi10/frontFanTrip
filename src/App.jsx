import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VehicleRegister from './pages/VehicleRegister';


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/vehicle" element={<VehicleRegister />} />
    </Routes>
  </Router>
);

export default App;
