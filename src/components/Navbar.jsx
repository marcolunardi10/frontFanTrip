// src/components/Navbar.js (Com formatação de nome)

import React from 'react';
import { useNavigate } from 'react-router-dom';

// Função auxiliar para formatar o nome (coloca a primeira letra maiúscula e o resto minúscula)
const toTitleCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
};

const Navbar = () => {
  const navigate = useNavigate();
  
  const usuarioString = localStorage.getItem('usuario');
  let usuario = null;

  if (usuarioString && usuarioString !== 'undefined') {
    try {
      usuario = JSON.parse(usuarioString);
    } catch (error) {
      console.error("Erro ao analisar dados do usuário do localStorage:", error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  // Formata o nome antes de exibir
  const nomeFormatado = toTitleCase(usuario?.nome);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Fan Trip</h1>
        <div className="flex items-center space-x-4">
          {/* Usa a variável com o nome já formatado */}
          <span>Olá, {nomeFormatado || 'Usuário'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;