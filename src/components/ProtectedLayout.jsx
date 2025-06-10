// src/components/ProtectedLayout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto p-4">
        {/* O Outlet renderizará o componente da rota filha (ex: EventManager) */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;