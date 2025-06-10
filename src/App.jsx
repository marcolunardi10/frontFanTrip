// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes e Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import EventManager from './pages/EventManager';
import VehicleRegister from './pages/VehicleRegister';

// Componentes de Autenticação e Layout
import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout'; // <-- Importe o novo layout

const App = () => (
  <Router>
    <Routes>
      {/* --- ROTAS PÚBLICAS --- */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* --- CONTAINER DE ROTAS PROTEGIDAS --- */}
      {/* A PrivateRoute agora envolve o ProtectedLayout.
        Se o usuário estiver logado, o ProtectedLayout é renderizado.
        O ProtectedLayout, por sua vez, renderiza a Navbar e o Outlet.
        O Outlet renderiza a rota filha correspondente (EventManager ou VehicleRegister).
      */}
      <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
        <Route path="/event" element={<EventManager />} />
        <Route path="/vehicle" element={<VehicleRegister />} />
        {/* Se você tiver mais rotas protegidas, adicione-as aqui como filhas */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Route>

      {/* Rota padrão para redirecionar para o login se nenhuma outra corresponder */}
      <Route path="*" element={<Login />} />
    </Routes>
  </Router>
);

export default App;